/**
 * SDD MCP Server - ConfigManager Implementation
 * Foundation agent providing configuration services to all other agents
 */
import * as fs from "fs/promises";
import * as path from "path";
import { errorHandler as globalErrorHandler, } from "./error-handler.js"; // Corrected import path and import singleton
export class ConfigManager {
    agentId = "ConfigManager";
    config = null;
    configPath;
    defaultConfig;
    errorHandler;
    constructor(configPath, errorHandlerInstance) {
        this.configPath =
            configPath || path.join(process.cwd(), "config", "server.config.json");
        this.errorHandler = errorHandlerInstance || globalErrorHandler; // Use injected or global singleton
        // Blueprint: Default configuration following SDD patterns
        this.defaultConfig = {
            server: {
                name: "sdd-mcp-server",
                version: "1.0.0",
                debug: false,
            },
            templates: {
                contractPath: path.join(process.cwd(), "templates", "contract.template.ts"),
                stubPath: path.join(process.cwd(), "templates", "stub.template.ts"),
                seamPath: path.join(process.cwd(), "templates", "seam-template.md"),
            },
            validation: {
                strictMode: true,
                requiredPatterns: [
                    "ContractResult<T>",
                    "AgentId",
                    "NotImplementedError",
                    "Blueprint:",
                ],
            },
            features: {
                templateHotReload: true,
                diagnostics: true,
                extendedLogging: false,
            },
        };
    }
    // Blueprint: Configuration loading with validation and defaults
    async loadConfig() {
        try {
            let loadedConfig = {};
            let configSource = "default";
            try {
                const configData = await fs.readFile(this.configPath, "utf-8");
                loadedConfig = JSON.parse(configData);
                console.log(`✅ ${this.agentId}: Configuration loaded from ${this.configPath}`);
                configSource = this.configPath;
                this.config = this.mergeConfig(this.defaultConfig, loadedConfig); // Merge loaded with defaults
            }
            catch (fileError) {
                console.log(`ℹ️ ${this.agentId}: No config file found at ${this.configPath}, using defaults. Error: ${fileError}`);
                await this.createDefaultConfigFile();
                this.config = JSON.parse(JSON.stringify(this.defaultConfig)); // Deep clone default
                configSource = "generated_default";
            }
            const validation = this.validateConfigInternal(this.config);
            if (!validation.isValid) {
                return this.errorHandler.createTypedErrorResult(new Error(validation.message ||
                    "Configuration validation failed after load/merge"), {
                    agentId: this.agentId,
                    operation: "loadConfig.validateConfig",
                    additionalInfo: {
                        configPath: this.configPath,
                        validationMessage: validation.message,
                        configSource,
                    },
                });
            }
            return {
                success: true,
                data: this.config,
                metadata: {
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                    operation: "loadConfig",
                    configSource,
                },
            };
        }
        catch (error) {
            return this.errorHandler.createTypedErrorResult(error instanceof Error
                ? error
                : new Error("Unknown error during loadConfig"), {
                agentId: this.agentId,
                operation: "loadConfig.catchAll",
                additionalInfo: { configPath: this.configPath },
            });
        }
    }
    // Blueprint: Runtime configuration updates with validation
    async updateConfig(updates) {
        try {
            if (!this.config) {
                const loadResult = await this.loadConfig();
                if (!loadResult.success || !loadResult.data) {
                    const errorMessage = loadResult.error?.message ||
                        "Cannot update config: failed to load existing configuration";
                    return this.errorHandler.createTypedErrorResult(new Error(errorMessage), {
                        agentId: this.agentId,
                        operation: "updateConfig.loadConfigFailure",
                        additionalInfo: {
                            updates: JSON.stringify(updates).substring(0, 100),
                            originalError: loadResult.error,
                        },
                    });
                }
                // this.config is set by loadConfig if successful
            }
            const updatedConfig = this.mergeConfig(this.config, updates);
            const validation = this.validateConfigInternal(updatedConfig);
            if (!validation.isValid) {
                return this.errorHandler.createTypedErrorResult(new Error(validation.message || "Configuration update validation failed"), {
                    agentId: this.agentId,
                    operation: "updateConfig.validateConfigFailure",
                    additionalInfo: {
                        updates: JSON.stringify(updates).substring(0, 100),
                        validationMessage: validation.message,
                    },
                });
            }
            this.config = updatedConfig;
            await this.saveConfig();
            console.log(`✅ ${this.agentId}: Configuration updated successfully`);
            return {
                success: true,
                metadata: {
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                    operation: "updateConfig",
                },
            };
        }
        catch (error) {
            return this.errorHandler.createTypedErrorResult(error instanceof Error
                ? error
                : new Error("Unknown error during updateConfig"), {
                agentId: this.agentId,
                operation: "updateConfig.catchAll",
                additionalInfo: {
                    updates: JSON.stringify(updates).substring(0, 100),
                },
            });
        }
    }
    // Blueprint: Template path resolution with existence checking
    async getTemplatePath(templateType) {
        try {
            if (!this.config) {
                const loadResult = await this.loadConfig();
                if (!loadResult.success || !loadResult.data) {
                    const errorMessage = loadResult.error?.message ||
                        "Cannot get template path: configuration not loaded";
                    return this.errorHandler.createTypedErrorResult(new Error(errorMessage), {
                        agentId: this.agentId,
                        operation: "getTemplatePath.loadConfigFailure",
                        additionalInfo: { templateType, originalError: loadResult.error },
                    });
                }
                // this.config is set by loadConfig if successful
            }
            let templatePath;
            switch (templateType.toLowerCase()) {
                case "contract":
                    templatePath = this.config.templates.contractPath;
                    break;
                case "stub":
                    templatePath = this.config.templates.stubPath;
                    break;
                case "seam":
                    templatePath = this.config.templates.seamPath;
                    break;
                default:
                    return this.errorHandler.createTypedErrorResult(new Error(`Unknown template type: ${templateType}`), {
                        agentId: this.agentId,
                        operation: "getTemplatePath.unknownType",
                        additionalInfo: { templateType },
                    });
            }
            // 🛡️ DEFENSIVE: Check for missing or invalid templatePath before fs.access
            if (typeof templatePath !== "string" || !templatePath.trim()) {
                return this.errorHandler.createTypedErrorResult(new Error(`Template path for type '${templateType}' is missing or invalid in configuration.`), {
                    agentId: this.agentId,
                    operation: "getTemplatePath.invalidPath",
                    additionalInfo: { templateType, templatePath },
                });
            }
            try {
                await fs.access(templatePath);
            }
            catch (accessError) {
                console.log(`⚠️ ${this.agentId}: Template file not found at ${templatePath}. Error: ${accessError}`);
                // Return error if template not found, as path is unusable
                return this.errorHandler.createTypedErrorResult(new Error(`Template file not found: ${templatePath}`), {
                    agentId: this.agentId,
                    operation: "getTemplatePath.accessError",
                    additionalInfo: {
                        templateType,
                        templatePath,
                        originalError: accessError,
                    },
                });
            }
            return {
                success: true,
                data: path.resolve(templatePath),
                metadata: {
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                    operation: "getTemplatePath",
                    templateType,
                },
            };
        }
        catch (error) {
            return this.errorHandler.createTypedErrorResult(error instanceof Error
                ? error
                : new Error("Unknown error during getTemplatePath"), {
                agentId: this.agentId,
                operation: "getTemplatePath.catchAll",
                additionalInfo: { templateType },
            });
        }
    }
    // Blueprint: Feature flag checking with safe defaults
    async isFeatureEnabled(feature) {
        try {
            if (!this.config) {
                const loadResult = await this.loadConfig();
                if (!loadResult.success || !loadResult.data) {
                    return this.errorHandler.createTypedErrorResult(new Error("Configuration load failed, feature check cannot proceed reliably. Defaulting to false."), {
                        agentId: this.agentId,
                        operation: "isFeatureEnabled.loadConfigFailure",
                        additionalInfo: { feature, originalError: loadResult.error },
                    }, false // Default data value for fallback
                    );
                }
                // this.config is set by loadConfig if successful
            }
            const isEnabled = this.config.features[feature];
            if (typeof isEnabled !== "boolean") {
                console.log(`⚠️ ${this.agentId}: Feature '${feature}' not found or not a boolean in config, defaulting to false.`);
                return {
                    success: true, // Technically success, but feature is effectively off
                    data: false,
                    metadata: {
                        agentId: this.agentId,
                        timestamp: new Date().toISOString(),
                        operation: "isFeatureEnabled",
                        feature,
                        notes: "Feature not explicitly defined or not boolean, defaulted to false.",
                    },
                };
            }
            return {
                success: true,
                data: isEnabled,
                metadata: {
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                    operation: "isFeatureEnabled",
                    feature,
                },
            };
        }
        catch (error) {
            return this.errorHandler.createTypedErrorResult(error instanceof Error
                ? error
                : new Error("Unknown error during feature check"), {
                agentId: this.agentId,
                operation: "isFeatureEnabled.catchAll",
                additionalInfo: { feature },
            }, false // Default data value for fallback
            );
        }
    }
    // Blueprint: Private helper methods for configuration management
    async createDefaultConfigFile() {
        try {
            const configDir = path.dirname(this.configPath);
            await fs.mkdir(configDir, { recursive: true });
            await fs.writeFile(this.configPath, JSON.stringify(this.defaultConfig, null, 2));
            console.log(`✅ ${this.agentId}: Default configuration created at ${this.configPath}`);
        }
        catch (error) {
            // Log this critical failure using the errorHandler instance
            this.errorHandler
                .logError(this.agentId, `Could not create default config file at ${this.configPath}`, {
                operation: "createDefaultConfigFile",
                originalError: error instanceof Error ? error : new Error(String(error)),
                configPath: this.configPath,
            })
                .catch((err) => console.error("Panic: ErrorHandler failed to log createDefaultConfigFile failure", err));
            // Do not re-throw, allow loadConfig to proceed with in-memory default if needed
        }
    }
    async saveConfig() {
        if (!this.config) {
            this.errorHandler.logError(this.agentId, "Attempted to save null config", { operation: "saveConfig.nullConfig" });
            return;
        }
        try {
            const configDir = path.dirname(this.configPath);
            await fs.mkdir(configDir, { recursive: true });
            await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
            console.log(`✅ ${this.agentId}: Configuration saved to ${this.configPath}`);
        }
        catch (error) {
            this.errorHandler
                .logError(this.agentId, `Could not save configuration to ${this.configPath}`, {
                operation: "saveConfig.writeFileFailure",
                originalError: error instanceof Error ? error : new Error(String(error)),
                configPath: this.configPath,
            })
                .catch((err) => console.error("Panic: ErrorHandler failed to log saveConfig failure", err));
        }
    }
    mergeConfig(base, updates) {
        const merged = JSON.parse(JSON.stringify(base)); // Deep clone base
        if (updates.server)
            merged.server = { ...merged.server, ...updates.server };
        if (updates.templates)
            merged.templates = { ...merged.templates, ...updates.templates };
        if (updates.validation)
            merged.validation = { ...merged.validation, ...updates.validation };
        if (updates.features)
            merged.features = { ...merged.features, ...updates.features };
        return merged;
    }
    validateConfigInternal(config) {
        if (!config)
            return { isValid: false, message: "Config object is null or undefined." };
        if (!config.server?.name || !config.server?.version) {
            return {
                isValid: false,
                message: "Server name and version are required.",
            };
        }
        if (typeof config.server.debug !== "boolean") {
            return {
                isValid: false,
                message: "Server debug flag must be a boolean.",
            };
        }
        if (!config.templates?.contractPath ||
            !config.templates?.stubPath ||
            !config.templates?.seamPath) {
            return {
                isValid: false,
                message: "All template paths (contract, stub, seam) are required.",
            };
        }
        if (typeof config.validation?.strictMode !== "boolean") {
            return {
                isValid: false,
                message: "Validation strictMode flag must be a boolean.",
            };
        }
        if (!Array.isArray(config.validation?.requiredPatterns) ||
            !config.validation.requiredPatterns.every((p) => typeof p === "string")) {
            return {
                isValid: false,
                message: "Required patterns must be an array of strings.",
            };
        }
        if (typeof config.features?.templateHotReload !== "boolean" ||
            typeof config.features?.diagnostics !== "boolean" ||
            typeof config.features?.extendedLogging !== "boolean") {
            return {
                isValid: false,
                message: "All feature flags (templateHotReload, diagnostics, extendedLogging) must be booleans.",
            };
        }
        return { isValid: true };
    }
    // Blueprint: Health check for configuration service
    async healthCheck() {
        try {
            const checks = [];
            let overallHealthy = true;
            // 1. Check if config is loaded and valid
            if (this.config) {
                const validation = this.validateConfigInternal(this.config);
                if (validation.isValid) {
                    checks.push("✅ Configuration loaded and valid.");
                }
                else {
                    checks.push(`❌ Configuration loaded but invalid: ${validation.message}`);
                    overallHealthy = false;
                }
            }
            else {
                const loadResult = await this.loadConfig(); // This will also validate
                if (loadResult.success && loadResult.data) {
                    // this.config is set by loadConfig
                    checks.push("✅ Configuration loaded on-demand for health check and is valid.");
                }
                else {
                    checks.push(`❌ Configuration failed to load for health check: ${loadResult.error?.message || "Unknown load error"}`);
                    overallHealthy = false;
                }
            }
            // 2. Check if config file exists (informational, as defaults can be used)
            try {
                await fs.access(this.configPath);
                checks.push("✅ Configuration file exists on disk.");
            }
            catch {
                checks.push(`⚠️ Configuration file missing at ${this.configPath} (using defaults or in-memory).`);
            }
            // 3. Check template paths if config is available
            if (this.config) {
                for (const [type, templatePath] of Object.entries(this.config.templates)) {
                    try {
                        await fs.access(templatePath);
                        checks.push(`✅ ${type} template found at ${templatePath}.`);
                    }
                    catch {
                        checks.push(`❌ ${type} template missing at ${templatePath}. This is critical.`);
                        overallHealthy = false;
                    }
                }
            }
            const healthStatus = checks.join("\n");
            if (!overallHealthy) {
                return this.errorHandler.createTypedErrorResult(new Error("ConfigManager health check failed: Critical issues detected."), {
                    agentId: this.agentId,
                    operation: "healthCheck.criticalFailures",
                    additionalInfo: { healthStatusDetail: healthStatus },
                }, healthStatus // Provide current healthStatus as fallback data
                );
            }
            return {
                success: true,
                data: healthStatus,
                metadata: {
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                    operation: "healthCheck",
                    notes: checks.some((c) => c.startsWith("⚠️"))
                        ? "Health check passed with warnings."
                        : "Health check passed.",
                },
            };
        }
        catch (error) {
            // Catch errors within the healthCheck logic itself
            return this.errorHandler.createTypedErrorResult(error instanceof Error
                ? error
                : new Error("Unknown error during ConfigManager healthCheck execution"), {
                agentId: this.agentId,
                operation: "healthCheck.executionError",
            });
        }
    }
}
// Export singleton instance, ensuring it uses the global ErrorHandler singleton
export const configManager = new ConfigManager(undefined, globalErrorHandler);
//# sourceMappingURL=config-manager.js.map