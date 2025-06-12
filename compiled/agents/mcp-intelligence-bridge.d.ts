/**
 * MCP Intelligence Bridge
 * 🔌 INTEGRATION: Bridge between MCP tool layer and Enhanced Seam Analyzer
 * PURPOSE: Route MCP tool requests to appropriate Enhanced Analyzer methods
 * SEAM: MCP Tools → Intelligence Bridge → Enhanced Seam Analyzer
 */
import type { ContractResult, IEnhancedSeamAnalyzer } from "../contracts.js";
/**
 * 🔌 INTEGRATION: MCP Intelligence Bridge Contract
 * SEAM INTERFACE: Defines communication pathway between MCP layer and intelligence layer
 */
export interface IMCPIntelligenceBridge {
    /**
     * 🎯 CRITICAL: Route requests to Enhanced Seam Analyzer
     * PURPOSE: Central routing point for all enhanced analysis requests
     * DATA FLOW: MCP Tool Request → Method Selection → Enhanced Analyzer → Result
     * FAILURE MODES: Invalid method name, analyzer not available, processing errors
     */
    routeToEnhancedAnalyzer<T>(method: keyof IEnhancedSeamAnalyzer, input: any): Promise<ContractResult<T>>;
    /**
     * ⚡ QUICK_WIN: Health check for analyzer availability
     * PURPOSE: Verify Enhanced Analyzer is available and responsive
     * DATA FLOW: Health Check Request → Analyzer Status → Health Report
     * FAILURE MODES: Analyzer unavailable, initialization errors
     */
    checkAnalyzerHealth(): Promise<ContractResult<AnalyzerHealthStatus>>;
    /**
     * 🛡️ DEFENSIVE: Initialize bridge and analyzer connection
     * PURPOSE: Set up bridge connection and verify analyzer is ready
     * DATA FLOW: Initialization Request → Analyzer Setup → Connection Status
     * FAILURE MODES: Analyzer initialization failure, dependency issues
     */
    initialize(): Promise<ContractResult<void>>;
}
export interface AnalyzerHealthStatus {
    available: boolean;
    lastResponseTime: number;
    version: string;
    capabilities: string[];
}
/**
 * 🔌 INTEGRATION: MCP Intelligence Bridge Implementation
 * DESIGN PATTERN: Bridge pattern connecting MCP tools to Enhanced Analyzer
 */
export declare class MCPIntelligenceBridge implements IMCPIntelligenceBridge {
    private enhancedAnalyzer;
    private initialized;
    private readonly agentId;
    constructor();
    /**
     * 🛡️ DEFENSIVE: Initialize bridge connection
     */
    initialize(): Promise<ContractResult<void>>;
    /**
     * ⚡ QUICK_WIN: Check Enhanced Analyzer health
     */
    checkAnalyzerHealth(): Promise<ContractResult<AnalyzerHealthStatus>>;
    /**
     * 🎯 CRITICAL: Route requests to Enhanced Seam Analyzer
     * SEAM IMPLEMENTATION: Central routing logic for all analyzer methods
     */
    routeToEnhancedAnalyzer<T>(method: keyof IEnhancedSeamAnalyzer, input: any): Promise<ContractResult<T>>;
}
export declare const mcpIntelligenceBridge: MCPIntelligenceBridge;
