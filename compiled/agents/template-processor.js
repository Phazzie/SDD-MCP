/**
 * SDD MCP Server - TemplateProcessor Implementation
 * Core agent providing template processing services for SDD code generation
 */
import * as fs from "fs/promises";
import { configManager } from "./config-manager.js";
import { errorHandler } from "./error-handler.js";
export class TemplateProcessor {
    agentId = "TemplateProcessor";
    templateCache = new Map();
    compiledCache = new Map();
    templateEngine = null;
    constructor() {
        this.initializeTemplateEngine();
    }
    // Blueprint: Template loading with configuration integration
    async loadTemplate(templateType) {
        try {
            // Get template path from configuration
            const configResult = await configManager.getTemplatePath(templateType);
            if (!configResult.success || !configResult.data) {
                return {
                    success: false,
                    error: `Failed to get template path: ${configResult.error}`,
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                };
            }
            const templatePath = configResult.data;
            // Check cache first
            const cacheKey = `${templateType}_${templatePath}`;
            if (this.templateCache.has(cacheKey)) {
                console.log(`✅ ${this.agentId}: Template loaded from cache: ${templateType}`);
                return {
                    success: true,
                    data: this.templateCache.get(cacheKey),
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                };
            }
            // Load template from file system
            try {
                const templateContent = await fs.readFile(templatePath, "utf-8");
                // Cache the template
                this.templateCache.set(cacheKey, templateContent);
                console.log(`✅ ${this.agentId}: Template loaded: ${templateType} from ${templatePath}`);
                return {
                    success: true,
                    data: templateContent,
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                };
            }
            catch (fileError) {
                const errorMessage = `Template file not found: ${templatePath}`;
                await errorHandler.logError(this.agentId, errorMessage, {
                    templateType,
                    templatePath,
                });
                return {
                    success: false,
                    error: errorMessage,
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                };
            }
        }
        catch (error) {
            const errorMessage = `Failed to load template: ${error instanceof Error ? error.message : "Unknown error"}`;
            await errorHandler.handleError(error instanceof Error ? error : new Error(errorMessage), {
                agentId: this.agentId,
                operation: "loadTemplate",
                timestamp: new Date().toISOString(),
                additionalInfo: { templateType },
            });
            return {
                success: false,
                error: errorMessage,
                agentId: this.agentId,
                timestamp: new Date().toISOString(),
            };
        }
    }
    // Blueprint: Template processing with data substitution
    async processTemplate(template, data) {
        try {
            // Validate template first
            const validationResult = await this.validateTemplate(template);
            if (!validationResult.success) {
                return {
                    success: false,
                    error: `Template validation failed: ${validationResult.error}`,
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                };
            }
            // Process with template engine if available
            if (this.templateEngine) {
                try {
                    const compiled = this.templateEngine.compile(template);
                    const processed = compiled(data);
                    console.log(`✅ ${this.agentId}: Template processed with engine`);
                    return {
                        success: true,
                        data: processed,
                        agentId: this.agentId,
                        timestamp: new Date().toISOString(),
                    };
                }
                catch (engineError) {
                    // Fall back to simple substitution
                    console.log(`⚠️ ${this.agentId}: Template engine failed, using fallback`);
                }
            }
            // Fallback: Simple placeholder substitution
            const processed = this.processSimpleTemplate(template, data);
            console.log(`✅ ${this.agentId}: Template processed with simple substitution`);
            return {
                success: true,
                data: processed,
                agentId: this.agentId,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            const errorMessage = `Failed to process template: ${error instanceof Error ? error.message : "Unknown error"}`;
            await errorHandler.handleError(error instanceof Error ? error : new Error(errorMessage), {
                agentId: this.agentId,
                operation: "processTemplate",
                timestamp: new Date().toISOString(),
                additionalInfo: { dataKeys: Object.keys(data) },
            });
            return {
                success: false,
                error: errorMessage,
                agentId: this.agentId,
                timestamp: new Date().toISOString(),
            };
        }
    }
    // Blueprint: Template structure validation
    async validateTemplate(template) {
        try {
            const issues = [];
            // Check for basic template structure
            if (!template || template.trim().length === 0) {
                issues.push("Template is empty");
            }
            // Check for SDD compliance patterns
            const requiredPatterns = ["Blueprint:", "ContractResult", "AgentId"];
            const missingPatterns = requiredPatterns.filter((pattern) => !template.includes(pattern));
            if (missingPatterns.length > 0) {
                issues.push(`Missing SDD patterns: ${missingPatterns.join(", ")}`);
            }
            // Check for template syntax issues
            const syntaxIssues = this.validateTemplateSyntax(template);
            issues.push(...syntaxIssues);
            const isValid = issues.length === 0;
            if (!isValid) {
                await errorHandler.logError(this.agentId, "Template validation failed", { issues });
            }
            return {
                success: true,
                data: isValid,
                error: isValid ? undefined : issues.join("; "),
                agentId: this.agentId,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            const errorMessage = `Template validation error: ${error instanceof Error ? error.message : "Unknown error"}`;
            await errorHandler.handleError(error instanceof Error ? error : new Error(errorMessage), {
                agentId: this.agentId,
                operation: "validateTemplate",
                timestamp: new Date().toISOString(),
            });
            return {
                success: false,
                error: errorMessage,
                agentId: this.agentId,
                timestamp: new Date().toISOString(),
            };
        }
    }
    // Blueprint: Template hot-reload for development
    async reloadTemplates() {
        try {
            // Clear caches
            this.templateCache.clear();
            this.compiledCache.clear();
            // Check if hot-reload feature is enabled
            const featureResult = await configManager.isFeatureEnabled("templateHotReload");
            if (!featureResult.success || !featureResult.data) {
                return {
                    success: false,
                    error: "Template hot-reload is not enabled",
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                };
            }
            // Reinitialize template engine
            this.initializeTemplateEngine();
            console.log(`✅ ${this.agentId}: Templates reloaded and caches cleared`);
            return {
                success: true,
                agentId: this.agentId,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            const errorMessage = `Failed to reload templates: ${error instanceof Error ? error.message : "Unknown error"}`;
            await errorHandler.handleError(error instanceof Error ? error : new Error(errorMessage), {
                agentId: this.agentId,
                operation: "reloadTemplates",
                timestamp: new Date().toISOString(),
            });
            return {
                success: false,
                error: errorMessage,
                agentId: this.agentId,
                timestamp: new Date().toISOString(),
            };
        }
    }
    // Blueprint: Private helper methods for template processing
    initializeTemplateEngine() {
        try {
            // Try to load Handlebars if available
            const Handlebars = require("handlebars");
            this.templateEngine = Handlebars;
            console.log(`✅ ${this.agentId}: Handlebars template engine loaded`);
        }
        catch (error) {
            // Handlebars not available, use simple substitution
            console.log(`ℹ️ ${this.agentId}: Handlebars not available, using simple substitution`);
            this.templateEngine = null;
        }
    }
    processSimpleTemplate(template, data) {
        let processed = template;
        // Simple placeholder replacement: {{KEY}} -> value
        Object.entries(data).forEach(([key, value]) => {
            const placeholder = `{{${key}}}`;
            const replacement = this.formatValue(value);
            processed = processed.replace(new RegExp(placeholder, "g"), replacement);
        });
        // Handle nested object access: {{obj.prop}} -> value
        Object.entries(data).forEach(([key, value]) => {
            if (typeof value === "object" && value !== null) {
                this.replaceNestedPlaceholders(processed, key, value);
            }
        });
        return processed;
    }
    replaceNestedPlaceholders(template, prefix, obj) {
        let processed = template;
        Object.entries(obj).forEach(([key, value]) => {
            const placeholder = `{{${prefix}.${key}}}`;
            const replacement = this.formatValue(value);
            processed = processed.replace(new RegExp(placeholder, "g"), replacement);
        });
        return processed;
    }
    formatValue(value) {
        if (value === null || value === undefined) {
            return "";
        }
        if (typeof value === "boolean") {
            return value.toString();
        }
        if (typeof value === "object") {
            return JSON.stringify(value);
        }
        return String(value);
    }
    validateTemplateSyntax(template) {
        const issues = [];
        // Check for unmatched placeholder braces
        const openBraces = (template.match(/{{/g) || []).length;
        const closeBraces = (template.match(/}}/g) || []).length;
        if (openBraces !== closeBraces) {
            issues.push("Unmatched template braces");
        }
        // Check for empty placeholders
        if (template.includes("{{}}")) {
            issues.push("Empty placeholder found");
        }
        // Check for invalid placeholder characters
        const invalidPlaceholders = template.match(/{{[^}]*[^a-zA-Z0-9._][^}]*}}/g);
        if (invalidPlaceholders) {
            issues.push(`Invalid placeholder characters: ${invalidPlaceholders.join(", ")}`);
        }
        return issues;
    }
    // Blueprint: Health check for template processing service
    async healthCheck() {
        try {
            const checks = [];
            // Check template engine
            if (this.templateEngine) {
                checks.push("✅ Template engine available (Handlebars)");
            }
            else {
                checks.push("⚠️ Using simple substitution (Handlebars not available)");
            }
            // Check template cache
            const cacheSize = this.templateCache.size;
            checks.push(`ℹ️ Template cache: ${cacheSize} templates loaded`);
            // Check configuration access
            try {
                const configResult = await configManager.isFeatureEnabled("templateHotReload");
                if (configResult.success) {
                    checks.push("✅ Configuration access working");
                }
                else {
                    checks.push("⚠️ Configuration access issues");
                }
            }
            catch {
                checks.push("❌ Configuration access failed");
            }
            // Test template processing
            try {
                const testTemplate = "Hello {{name}}!";
                const testData = { name: "SDD" };
                const processResult = await this.processTemplate(testTemplate, testData);
                if (processResult.success && processResult.data === "Hello SDD!") {
                    checks.push("✅ Template processing functional");
                }
                else {
                    checks.push("⚠️ Template processing issues detected");
                }
            }
            catch {
                checks.push("❌ Template processing test failed");
            }
            const healthStatus = checks.join("\n");
            const isHealthy = !checks.some((check) => check.includes("❌"));
            return {
                success: isHealthy,
                data: healthStatus,
                error: isHealthy
                    ? undefined
                    : "Some template processing issues detected",
                agentId: this.agentId,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Health check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                agentId: this.agentId,
                timestamp: new Date().toISOString(),
            };
        }
    }
}
// Export singleton instance
export const templateProcessor = new TemplateProcessor();
//# sourceMappingURL=template-processor.js.map