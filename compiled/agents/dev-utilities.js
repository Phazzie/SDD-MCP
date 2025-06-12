/**
 * SDD MCP Server - Development Utilities
 * Blueprint: Developer debugging and monitoring tools following SDD methodology
 */
import { createSDDError } from "../contracts.js";
// ================================
// Development Utilities Implementation
// ================================
export class DevUtilities {
    agentId;
    operationLogs = [];
    maxLogs = 1000;
    constructor(agentId) {
        this.agentId = agentId;
    }
    async logSeamExecution(seamName, input, result) {
        try {
            const timestamp = new Date().toISOString();
            const inputSize = JSON.stringify(input).length;
            const outputSize = JSON.stringify(result).length;
            const log = {
                seamName,
                timestamp,
                duration: 0, // Will be set by measurePerformance
                success: result.success || false,
                inputSize,
                outputSize,
                error: result.error?.message,
            };
            this.operationLogs.push(log);
            // Keep only recent logs
            if (this.operationLogs.length > this.maxLogs) {
                this.operationLogs = this.operationLogs.slice(-this.maxLogs);
            }
            console.log(`🔍 [${this.agentId}] ${seamName}: ${result.success ? "✅ SUCCESS" : "❌ FAILED"} (${inputSize}b → ${outputSize}b)`);
            return {
                success: true,
                data: undefined,
                metadata: {
                    agentId: this.agentId,
                    timestamp,
                    seamName: "DevUtilities.logSeamExecution",
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Failed to log seam execution: ${error instanceof Error ? error.message : String(error)}`, { seamName, error }, "DevUtilities.logSeamExecution"),
            };
        }
    }
    async measurePerformance(operation) {
        try {
            const startTime = performance.now();
            const result = await operation();
            const endTime = performance.now();
            const timeMs = Math.round(endTime - startTime);
            console.log(`⏱️ [${this.agentId}] Operation completed in ${timeMs}ms`);
            return {
                success: true,
                data: { result, timeMs },
                metadata: {
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                    processingTimeMs: timeMs,
                    seamName: "DevUtilities.measurePerformance",
                },
            };
        }
        catch (error) {
            const endTime = performance.now();
            const timeMs = Math.round(endTime);
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Performance measurement failed: ${error instanceof Error ? error.message : String(error)}`, { timeMs, error }, "DevUtilities.measurePerformance"),
            };
        }
    }
    async validateContractCompliance(input, schema) {
        try {
            const errors = [];
            const warnings = [];
            // Basic validation checks
            if (!input) {
                errors.push("Input is null or undefined");
            }
            if (!schema) {
                warnings.push("No schema provided for validation");
            }
            // Check if input has required ContractResult structure for outputs
            if (input && typeof input === "object" && "success" in input) {
                if (typeof input.success !== "boolean") {
                    errors.push("ContractResult.success must be boolean");
                }
                if (input.success && !input.data) {
                    warnings.push("Successful result has no data field");
                }
                if (!input.success && !input.error) {
                    errors.push("Failed result must have error field");
                }
            }
            const compliance = Math.max(0, 100 - errors.length * 20 - warnings.length * 5);
            const validationResult = {
                isValid: errors.length === 0,
                errors,
                warnings,
                compliance,
            };
            return {
                success: true,
                data: validationResult,
                metadata: {
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                    seamName: "DevUtilities.validateContractCompliance",
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: createSDDError(this.agentId, "ValidationError", `Contract compliance validation failed: ${error instanceof Error ? error.message : String(error)}`, { input, schema, error }, "DevUtilities.validateContractCompliance"),
            };
        }
    }
    async generateDebugReport() {
        try {
            const timestamp = new Date().toISOString();
            const recentOperations = this.operationLogs.slice(-50); // Last 50 operations
            // Calculate performance metrics
            const successfulOps = recentOperations.filter((op) => op.success);
            const failedOps = recentOperations.filter((op) => !op.success);
            const averageResponseTime = successfulOps.length > 0
                ? successfulOps.reduce((sum, op) => sum + op.duration, 0) /
                    successfulOps.length
                : 0;
            const operationsPerMinute = recentOperations.length > 0
                ? recentOperations.length /
                    Math.max(1, (Date.now() - new Date(recentOperations[0].timestamp).getTime()) /
                        60000)
                : 0;
            // System health assessment
            const errorRate = recentOperations.length > 0
                ? failedOps.length / recentOperations.length
                : 0;
            const systemHealth = errorRate < 0.1 ? "healthy" : errorRate < 0.3 ? "degraded" : "critical";
            // Performance analysis
            const sortedByDuration = [...successfulOps].sort((a, b) => b.duration - a.duration);
            const slowestOperations = sortedByDuration
                .slice(0, 5)
                .map((op) => `${op.seamName} (${op.duration}ms)`);
            const fastestOperations = sortedByDuration
                .slice(-5)
                .reverse()
                .map((op) => `${op.seamName} (${op.duration}ms)`);
            // Error analysis
            const errorsByType = {};
            failedOps.forEach((op) => {
                if (op.error) {
                    const errorType = op.error.split(":")[0] || "Unknown";
                    errorsByType[errorType] = (errorsByType[errorType] || 0) + 1;
                }
            });
            const performanceMetrics = {
                averageResponseTime: Math.round(averageResponseTime),
                operationsPerMinute: Math.round(operationsPerMinute * 10) / 10,
                slowestOperations,
                fastestOperations,
                memoryUsage: process.memoryUsage?.()?.heapUsed || 0,
            };
            const errorSummary = {
                totalErrors: failedOps.length,
                errorsByType,
                recentErrors: failedOps
                    .slice(-10)
                    .map((op) => op.error || "Unknown error"),
                errorTrends: this.analyzeErrorTrends(failedOps),
            };
            // Generate recommendations
            const recommendations = [];
            if (errorRate > 0.2) {
                recommendations.push("High error rate detected - review error patterns");
            }
            if (averageResponseTime > 1000) {
                recommendations.push("Slow response times - consider performance optimization");
            }
            if (Object.keys(errorsByType).length > 5) {
                recommendations.push("Multiple error types - review error handling patterns");
            }
            if (recommendations.length === 0) {
                recommendations.push("System operating normally - continue monitoring");
            }
            const debugReport = {
                timestamp,
                systemHealth,
                recentOperations,
                performanceMetrics,
                errorSummary,
                recommendations,
            };
            return {
                success: true,
                data: debugReport,
                metadata: {
                    agentId: this.agentId,
                    timestamp,
                    seamName: "DevUtilities.generateDebugReport",
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Failed to generate debug report: ${error instanceof Error ? error.message : String(error)}`, { error }, "DevUtilities.generateDebugReport"),
            };
        }
    }
    async logMessage(sourceAgentId, message, details) {
        console.log("[DevUtilities] logMessage called"); // Temporary direct log
        try {
            console.log(`[INFO][${sourceAgentId} via ${this.agentId}] ${message}`, details || "");
            return {
                success: true,
                metadata: {
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (e) {
            // Log to console directly as this is the logger itself
            console.error(`[CRITICAL_LOG_FAILURE][${this.agentId}] Failed to execute logMessage for ${sourceAgentId}: ${e instanceof Error ? e.message : String(e)}`);
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", // Corrected from "LoggingError"
                `Failed to log message: ${e instanceof Error ? e.message : String(e)}`, {
                    originalError: e instanceof Error ? e.stack : String(e),
                    sourceAgentId,
                    loggedMessage: message,
                }, "DevUtilities.logMessage"),
                metadata: {
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                },
            };
        }
    }
    async logError(sourceAgentId, message, details) {
        console.log("[DevUtilities] logError called"); // Temporary direct log
        try {
            console.error(`[ERROR][${sourceAgentId} via ${this.agentId}] ${message}`, details || "");
            return {
                success: true,
                metadata: {
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (e) {
            console.error(`[CRITICAL_LOG_FAILURE][${this.agentId}] Failed to execute logError for ${sourceAgentId}: ${e instanceof Error ? e.message : String(e)}`);
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", // Corrected from "LoggingError"
                `Failed to log error: ${e instanceof Error ? e.message : String(e)}`, {
                    originalError: e instanceof Error ? e.stack : String(e),
                    sourceAgentId,
                    loggedMessage: message,
                }, "DevUtilities.logError"),
                metadata: {
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                },
            };
        }
    }
    async logAIDiagnostic(sourceAgentId, diagnosticName, data) {
        console.log("[DevUtilities] logAIDiagnostic called"); // Temporary direct log
        try {
            console.log(`[AI_DIAGNOSTIC][${sourceAgentId} via ${this.agentId}] ${diagnosticName}:`, data);
            return {
                success: true,
                metadata: {
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (e) {
            console.error(`[CRITICAL_LOG_FAILURE][${this.agentId}] Failed to execute logAIDiagnostic for ${sourceAgentId}: ${e instanceof Error ? e.message : String(e)}`);
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", // Corrected from "LoggingError"
                `Failed to log AI diagnostic: ${e instanceof Error ? e.message : String(e)}`, {
                    originalError: e instanceof Error ? e.stack : String(e),
                    sourceAgentId,
                    diagnosticName,
                }, "DevUtilities.logAIDiagnostic"),
                metadata: {
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                },
            };
        }
    }
    analyzeErrorTrends(failedOps) {
        const trends = [];
        if (failedOps.length === 0) {
            return ["No recent errors"];
        }
        // Group by time periods
        const now = Date.now();
        const lastHour = failedOps.filter((op) => now - new Date(op.timestamp).getTime() < 3600000);
        const lastDay = failedOps.filter((op) => now - new Date(op.timestamp).getTime() < 86400000);
        if (lastHour.length > 5) {
            trends.push("High error frequency in last hour");
        }
        if (lastDay.length > lastHour.length * 10) {
            trends.push("Error rate increasing over time");
        }
        // Most common error
        const errorCounts = {};
        failedOps.forEach((op) => {
            if (op.error) {
                const errorType = op.error.split(":")[0] || "Unknown";
                errorCounts[errorType] = (errorCounts[errorType] || 0) + 1;
            }
        });
        const mostCommonError = Object.entries(errorCounts).sort(([, a], [, b]) => b - a)[0];
        if (mostCommonError && mostCommonError[1] > 2) {
            trends.push(`Most common: ${mostCommonError[0]} (${mostCommonError[1]} occurrences)`);
        }
        return trends.length > 0 ? trends : ["No significant error trends"];
    }
}
//# sourceMappingURL=dev-utilities.js.map