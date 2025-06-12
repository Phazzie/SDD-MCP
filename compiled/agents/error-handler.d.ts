/**
 * SDD MCP Server - ErrorHandler Implementation
 * Foundation agent providing error handling and diagnostic services
 */
import { AgentId, ContractResult, DiagnosticInfo, ErrorContext, ErrorHandlerContract } from "../contracts.js";
export declare class ErrorHandler implements ErrorHandlerContract {
    private readonly agentId;
    private errorLog;
    private logPath;
    private maxLogEntries;
    constructor(logPath?: string);
    handleError(error: Error, context: ErrorContext): Promise<ContractResult<void>>;
    logError(agentId: AgentId, errorMessage: string, // Changed from 'error: string' to 'errorMessage: string' for clarity
    details?: any): Promise<ContractResult<void>>;
    createTypedErrorResult<T>(error: Error, context: Partial<ErrorContext>, // agentId, operation, additionalInfo
    fallbackData?: T): ContractResult<T>;
    suggestRecovery(errorType: string): Promise<ContractResult<string[]>>;
    collectDiagnostics(): Promise<ContractResult<DiagnosticInfo>>;
    private categorizeError;
    private mapSeverity;
    private getRecoverySuggestions;
    private generateRecommendations;
    private analyzeErrorPatterns;
    private writeLogToFile;
    private logToConsole;
    healthCheck(): Promise<ContractResult<string>>;
}
export declare const errorHandler: ErrorHandler;
