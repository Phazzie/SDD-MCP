/**
 * SDD MCP Server - Development Utilities
 * Blueprint: Developer debugging and monitoring tools following SDD methodology
 */
import { AgentId, ContractResult } from "../contracts.js";
export interface DevUtilitiesContract {
    logSeamExecution(seamName: string, input: any, result: any): Promise<ContractResult<void>>;
    measurePerformance<T>(operation: () => Promise<T>): Promise<ContractResult<{
        result: T;
        timeMs: number;
    }>>;
    validateContractCompliance(input: any, schema: any): Promise<ContractResult<ValidationResult>>;
    generateDebugReport(): Promise<ContractResult<DebugReport>>;
    logMessage(sourceAgentId: AgentId, message: string, details?: any): Promise<ContractResult<void>>;
    logError(sourceAgentId: AgentId, message: string, details?: any): Promise<ContractResult<void>>;
    logAIDiagnostic(sourceAgentId: AgentId, diagnosticName: string, data: any): Promise<ContractResult<void>>;
}
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    compliance: number;
}
export interface DebugReport {
    timestamp: string;
    systemHealth: "healthy" | "degraded" | "critical";
    recentOperations: OperationLog[];
    performanceMetrics: PerformanceMetrics;
    errorSummary: ErrorSummary;
    recommendations: string[];
}
export interface OperationLog {
    seamName: string;
    timestamp: string;
    duration: number;
    success: boolean;
    inputSize: number;
    outputSize: number;
    error?: string;
}
export interface PerformanceMetrics {
    averageResponseTime: number;
    operationsPerMinute: number;
    slowestOperations: string[];
    fastestOperations: string[];
    memoryUsage: number;
}
export interface ErrorSummary {
    totalErrors: number;
    errorsByType: Record<string, number>;
    recentErrors: string[];
    errorTrends: string[];
}
export declare class DevUtilities implements DevUtilitiesContract {
    private agentId;
    private operationLogs;
    private maxLogs;
    constructor(agentId: AgentId);
    logSeamExecution(seamName: string, input: any, result: any): Promise<ContractResult<void>>;
    measurePerformance<T>(operation: () => Promise<T>): Promise<ContractResult<{
        result: T;
        timeMs: number;
    }>>;
    validateContractCompliance(input: any, schema: any): Promise<ContractResult<ValidationResult>>;
    generateDebugReport(): Promise<ContractResult<DebugReport>>;
    logMessage(sourceAgentId: AgentId, message: string, details?: any): Promise<ContractResult<void>>;
    logError(sourceAgentId: AgentId, message: string, details?: any): Promise<ContractResult<void>>;
    logAIDiagnostic(sourceAgentId: AgentId, diagnosticName: string, data: any): Promise<ContractResult<void>>;
    private analyzeErrorTrends;
}
