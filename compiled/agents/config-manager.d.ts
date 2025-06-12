/**
 * SDD MCP Server - ConfigManager Implementation
 * Foundation agent providing configuration services to all other agents
 */
import { ConfigContract, ContractResult, ServerConfig } from "../contracts.js";
import { ErrorHandler } from "./error-handler.js";
export declare class ConfigManager implements ConfigContract {
    private readonly agentId;
    private config;
    private configPath;
    private readonly defaultConfig;
    private errorHandler;
    constructor(configPath?: string, errorHandlerInstance?: ErrorHandler);
    loadConfig(): Promise<ContractResult<ServerConfig>>;
    updateConfig(updates: Partial<ServerConfig>): Promise<ContractResult<void>>;
    getTemplatePath(templateType: string): Promise<ContractResult<string>>;
    isFeatureEnabled(feature: string): Promise<ContractResult<boolean>>;
    private createDefaultConfigFile;
    private saveConfig;
    private mergeConfig;
    private validateConfigInternal;
    healthCheck(): Promise<ContractResult<string>>;
}
export declare const configManager: ConfigManager;
