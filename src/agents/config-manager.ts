/**
 * SDD MCP Server - ConfigManager Implementation
 * Foundation agent providing configuration services to all other agents
 */

import * as fs from "fs/promises";
import * as path from "path";
import {
  AgentId,
  ConfigContract,
  ContractResult,
  ServerConfig,
} from "../contracts.js";

export class ConfigManager implements ConfigContract {
  private readonly agentId: AgentId = "ConfigManager";
  private config: ServerConfig | null = null;
  private configPath: string;
  private readonly defaultConfig: ServerConfig;

  constructor(configPath?: string) {
    this.configPath =
      configPath || path.join(process.cwd(), "config", "server.config.json");

    // Blueprint: Default configuration following SDD patterns
    this.defaultConfig = {
      server: {
        name: "sdd-mcp-server",
        version: "1.0.0",
        debug: false,
      },
      templates: {
        contractPath: path.join(
          process.cwd(),
          "templates",
          "contract.template.ts"
        ),
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
  async loadConfig(): Promise<ContractResult<ServerConfig>> {
    try {
      let loadedConfig: Partial<ServerConfig> = {};

      // Try to load config file
      try {
        const configData = await fs.readFile(this.configPath, "utf-8");
        loadedConfig = JSON.parse(configData);
        console.log(
          `✅ ${this.agentId}: Configuration loaded from ${this.configPath}`
        );
      } catch (fileError) {
        console.log(`ℹ️ ${this.agentId}: No config file found, using defaults`);
        // Create default config file
        await this.createDefaultConfigFile();
      }

      // Merge with defaults (deep merge)
      this.config = this.mergeConfig(this.defaultConfig, loadedConfig);

      // Validate configuration
      const validationResult = this.validateConfig(this.config);
      if (!validationResult.success) {
        return {
          success: false,
          error: `Configuration validation failed: ${validationResult.error}`,
          agentId: this.agentId,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: this.config,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to load configuration: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Blueprint: Runtime configuration updates with validation
  async updateConfig(
    updates: Partial<ServerConfig>
  ): Promise<ContractResult<void>> {
    try {
      if (!this.config) {
        const loadResult = await this.loadConfig();
        if (!loadResult.success) {
          return {
            success: false,
            error:
              "Cannot update config: failed to load existing configuration",
            agentId: this.agentId,
            timestamp: new Date().toISOString(),
          };
        }
      }

      // Merge updates with existing config
      const updatedConfig = this.mergeConfig(this.config!, updates);

      // Validate updated configuration
      const validationResult = this.validateConfig(updatedConfig);
      if (!validationResult.success) {
        return {
          success: false,
          error: `Configuration update validation failed: ${validationResult.error}`,
          agentId: this.agentId,
          timestamp: new Date().toISOString(),
        };
      }

      // Apply updates
      this.config = updatedConfig;

      // Persist to file
      await this.saveConfig();

      console.log(`✅ ${this.agentId}: Configuration updated successfully`);
      return {
        success: true,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update configuration: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Blueprint: Template path resolution with existence checking
  async getTemplatePath(templateType: string): Promise<ContractResult<string>> {
    try {
      if (!this.config) {
        const loadResult = await this.loadConfig();
        if (!loadResult.success) {
          return {
            success: false,
            error: "Cannot get template path: configuration not loaded",
            agentId: this.agentId,
            timestamp: new Date().toISOString(),
          };
        }
      }

      let templatePath: string;
      switch (templateType.toLowerCase()) {
        case "contract":
          templatePath = this.config!.templates.contractPath;
          break;
        case "stub":
          templatePath = this.config!.templates.stubPath;
          break;
        case "seam":
          templatePath = this.config!.templates.seamPath;
          break;
        default:
          return {
            success: false,
            error: `Unknown template type: ${templateType}`,
            agentId: this.agentId,
            timestamp: new Date().toISOString(),
          };
      }

      // Check if template file exists
      try {
        await fs.access(templatePath);
      } catch {
        console.log(
          `⚠️ ${this.agentId}: Template file not found: ${templatePath}`
        );
        // Don't fail - template might be created later
      }

      return {
        success: true,
        data: path.resolve(templatePath),
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get template path: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Blueprint: Feature flag checking with safe defaults
  async isFeatureEnabled(feature: string): Promise<ContractResult<boolean>> {
    try {
      if (!this.config) {
        const loadResult = await this.loadConfig();
        if (!loadResult.success) {
          // Safe default: features disabled if config can't be loaded
          return {
            success: true,
            data: false,
            agentId: this.agentId,
            timestamp: new Date().toISOString(),
          };
        }
      }

      const isEnabled = (this.config!.features as any)[feature] || false;

      return {
        success: true,
        data: isEnabled,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      // Safe default: return false for unknown features
      return {
        success: true,
        data: false,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Blueprint: Private helper methods for configuration management
  private async createDefaultConfigFile(): Promise<void> {
    try {
      // Ensure config directory exists
      const configDir = path.dirname(this.configPath);
      await fs.mkdir(configDir, { recursive: true });

      // Write default configuration
      await fs.writeFile(
        this.configPath,
        JSON.stringify(this.defaultConfig, null, 2)
      );
      console.log(
        `✅ ${this.agentId}: Default configuration created at ${this.configPath}`
      );
    } catch (error) {
      console.log(
        `⚠️ ${this.agentId}: Could not create default config file: ${error}`
      );
    }
  }

  private async saveConfig(): Promise<void> {
    if (!this.config) return;

    try {
      const configDir = path.dirname(this.configPath);
      await fs.mkdir(configDir, { recursive: true });
      await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.log(`⚠️ ${this.agentId}: Could not save configuration: ${error}`);
    }
  }

  private mergeConfig(
    base: ServerConfig,
    updates: Partial<ServerConfig>
  ): ServerConfig {
    // Deep merge configuration objects
    const merged = JSON.parse(JSON.stringify(base)); // Deep clone base

    if (updates.server) {
      merged.server = { ...merged.server, ...updates.server };
    }
    if (updates.templates) {
      merged.templates = { ...merged.templates, ...updates.templates };
    }
    if (updates.validation) {
      merged.validation = { ...merged.validation, ...updates.validation };
    }
    if (updates.features) {
      merged.features = { ...merged.features, ...updates.features };
    }

    return merged;
  }

  private validateConfig(config: ServerConfig): ContractResult<boolean> {
    try {
      // Validate server configuration
      if (!config.server?.name || !config.server?.version) {
        return {
          success: false,
          error: "Server name and version are required",
          agentId: this.agentId,
          timestamp: new Date().toISOString(),
        };
      }

      // Validate template paths
      if (
        !config.templates?.contractPath ||
        !config.templates?.stubPath ||
        !config.templates?.seamPath
      ) {
        return {
          success: false,
          error: "All template paths are required",
          agentId: this.agentId,
          timestamp: new Date().toISOString(),
        };
      }

      // Validate validation settings
      if (!Array.isArray(config.validation?.requiredPatterns)) {
        return {
          success: false,
          error: "Required patterns must be an array",
          agentId: this.agentId,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: true,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: `Configuration validation error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Blueprint: Health check for configuration service
  async healthCheck(): Promise<ContractResult<string>> {
    try {
      const checks = [];

      // Check if config is loaded
      if (this.config) {
        checks.push("✅ Configuration loaded");
      } else {
        checks.push("❌ Configuration not loaded");
      }

      // Check if config file exists
      try {
        await fs.access(this.configPath);
        checks.push("✅ Configuration file exists");
      } catch {
        checks.push("⚠️ Configuration file missing (using defaults)");
      }

      // Check template paths
      if (this.config) {
        for (const [type, templatePath] of Object.entries(
          this.config.templates
        )) {
          try {
            await fs.access(templatePath);
            checks.push(`✅ ${type} template found`);
          } catch {
            checks.push(`⚠️ ${type} template missing`);
          }
        }
      }

      const healthStatus = checks.join("\n");
      const isHealthy = !checks.some((check) => check.includes("❌"));

      return {
        success: isHealthy,
        data: healthStatus,
        error: isHealthy ? undefined : "Some configuration issues detected",
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: `Health check failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Export singleton instance
export const configManager = new ConfigManager();
