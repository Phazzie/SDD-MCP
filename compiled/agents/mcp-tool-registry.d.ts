/**
 * Enhanced MCP Tool Registry - Infrastructure Foundation
 * 🎯 CRITICAL: Core MCP-Enhanced Analyzer Communication Pathway
 * Built using SDD methodology with fail-fast validation
 */
import { ContractResult, IMCPToolRegistry, RegisteredTool, ToolRegistration, ValidationResult } from "../contracts.js";
import { ConfigManager } from "./config-manager.js";
import { ErrorHandler } from "./error-handler.js";
export declare class EnhancedMCPToolRegistry implements IMCPToolRegistry {
    private agentId;
    private registeredTools;
    private toolSchemas;
    private toolHandlers;
    private errorHandler;
    private configManager;
    constructor(errorHandler: ErrorHandler, configManager: ConfigManager);
    /**
     * 💰 HIGH_ROI: Register all enhanced seam analysis tools
     * Blueprint: Core tool registration with schema validation
     */
    registerEnhancedTools(): Promise<ContractResult<ToolRegistration[]>>;
    /**
     * 🛡️ DEFENSIVE: Validate tool schema with comprehensive error reporting
     * Blueprint: Multi-layer validation preventing malformed requests
     */
    validateToolSchema(toolName: string, args: unknown): Promise<ContractResult<ValidationResult>>;
    /**
     * 🎯 CRITICAL: Route tool requests to appropriate handlers
     * Blueprint: Intelligent routing with load balancing and error recovery
     */
    routeToolRequest(toolName: string, args: unknown): Promise<ContractResult<unknown>>;
    /**
     * ⚡ QUICK_WIN: Get all registered tools with status information
     * Blueprint: Tool discovery and health monitoring
     */
    getRegisteredTools(): Promise<ContractResult<RegisteredTool[]>>;
    /**
     * 🔄 REFACTOR: Refresh tool registry with health checks
     * Blueprint: Dynamic tool management and health monitoring
     */
    refreshToolRegistry(): Promise<ContractResult<void>>;
    getToolCount(): number;
    getActiveToolCount(): number;
    isToolRegistered(toolName: string): boolean;
}
