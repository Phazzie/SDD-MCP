/**
 * 🔗 ENHANCED SEAM ANALYZER WITH UTILITY INTEGRATION
 * PURPOSE: Integrates development utilities and performance tracking with Enhanced Seam Analyzer
 * STATUS: STUBS - Following SDD pattern with fail-fast stubs first
 * SEAM: EnhancedSeamAnalyzer ↔ DevUtilities ↔ PerformanceTracker
 * CONTRACT VERSION: 1.0.0 - Initial integration
 */
import { createSDDError, } from "../contracts.js";
import { DevUtilities } from "./dev-utilities.js";
import { EnhancedSeamAnalyzer } from "./enhanced-seam-analyzer.js";
import { PerformanceTracker } from "./performance-tracker.js";
// Blueprint: NotImplementedError for tracking implementation progress
class NotImplementedError extends Error {
    constructor(contractMethod, blueprint) {
        super(`${contractMethod} not implemented. ${blueprint}`);
        this.name = "NotImplementedError";
    }
}
/**
 * 🎯 CRITICAL: Enhanced Seam Analyzer with integrated development utilities
 * Follows SDD pattern: Contract → Stubs → Implementation
 */
export class EnhancedSeamAnalyzerWithUtilities {
    agentId = "enhanced-seam-analyzer-with-utilities-001";
    seamAnalyzer;
    devUtilities;
    performanceTracker;
    performanceTrackingEnabled = false;
    debugLoggingEnabled = false;
    constructor() {
        this.seamAnalyzer = new EnhancedSeamAnalyzer();
        this.devUtilities = new DevUtilities(this.agentId);
        this.performanceTracker = new PerformanceTracker(this.agentId);
    }
    /**
     * 🎯 CRITICAL: Analyze seams with performance tracking
     * SEAM: SeamAnalyzer ↔ PerformanceTracker ↔ DevUtilities
     */
    async analyzeSeamsWithTracking(input) {
        try {
            // Start performance tracking if enabled
            let timingId;
            if (this.performanceTrackingEnabled) {
                const startResult = await this.performanceTracker.startTiming("analyzeRequirementsEnhanced");
                if (startResult.success) {
                    timingId = startResult.data;
                }
            }
            // Log operation if debug logging enabled
            if (this.debugLoggingEnabled) {
                await this.devUtilities.logSeamExecution("analyzeRequirementsEnhanced", "started", {
                    input: { requirementsLength: input.requirementsText?.length || 0 },
                });
            }
            // Execute the actual seam analysis
            const result = await this.seamAnalyzer.analyzeRequirementsEnhanced(input);
            // End performance tracking
            if (timingId && this.performanceTrackingEnabled) {
                await this.performanceTracker.endTiming(timingId);
            } // Log completion
            if (this.debugLoggingEnabled) {
                await this.devUtilities.logSeamExecution("analyzeRequirementsEnhanced", "completed", {
                    success: result.success,
                    seamsFound: result.data?.identifiedSeams?.length || 0,
                });
            }
            return result;
        }
        catch (error) {
            // Log error if debug logging enabled
            if (this.debugLoggingEnabled) {
                await this.devUtilities.logSeamExecution("analyzeRequirementsEnhanced", "error", {
                    error: error instanceof Error ? error.message : String(error),
                });
            }
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Failed to analyze seams with tracking: ${error instanceof Error ? error.message : String(error)}`, { operation: "analyzeSeamsWithTracking" }),
                metadata: {
                    seamName: "SeamAnalyzer-PerformanceTracker-DevUtilities",
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                },
            };
        }
    }
    /**
     * 🎯 CRITICAL: Validate seam readiness with performance tracking
     * SEAM: ValidationEngine ↔ PerformanceTracker ↔ DevUtilities
     */
    async validateSeamReadinessWithTracking(input) {
        try {
            // Start performance tracking if enabled
            let timingId;
            if (this.performanceTrackingEnabled) {
                const startResult = await this.performanceTracker.startTiming("validateSeamReadiness");
                if (startResult.success) {
                    timingId = startResult.data;
                }
            }
            // Log operation if debug logging enabled
            if (this.debugLoggingEnabled) {
                await this.devUtilities.logSeamExecution("validateSeamReadiness", "started", {
                    input: { seamsCount: input.seams?.length || 0 },
                });
            }
            // Execute the actual seam validation
            const result = await this.seamAnalyzer.validateSeamReadiness(input);
            // End performance tracking
            if (timingId && this.performanceTrackingEnabled) {
                await this.performanceTracker.endTiming(timingId);
            }
            // Log completion
            if (this.debugLoggingEnabled) {
                await this.devUtilities.logSeamExecution("validateSeamReadiness", "completed", {
                    success: result.success,
                    validationsPassed: result.data?.validationsPassed || 0,
                });
            }
            return result;
        }
        catch (error) {
            // Log error if debug logging enabled
            if (this.debugLoggingEnabled) {
                await this.devUtilities.logSeamExecution("validateSeamReadiness", "error", {
                    error: error instanceof Error ? error.message : String(error),
                });
            }
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Failed to validate seam readiness with tracking: ${error instanceof Error ? error.message : String(error)}`, { operation: "validateSeamReadinessWithTracking" }),
                metadata: {
                    seamName: "ValidationEngine-PerformanceTracker-DevUtilities",
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                },
            };
        }
    }
    /**
     * 🎯 CRITICAL: Generate interaction matrix with performance tracking
     * SEAM: InteractionEngine ↔ PerformanceTracker ↔ DevUtilities
     */
    async generateInteractionMatrixWithTracking(input) {
        try {
            // Start performance tracking if enabled
            let timingId;
            if (this.performanceTrackingEnabled) {
                const startResult = await this.performanceTracker.startTiming("generateInteractionMatrix");
                if (startResult.success) {
                    timingId = startResult.data;
                }
            }
            // Log operation if debug logging enabled
            if (this.debugLoggingEnabled) {
                await this.devUtilities.logSeamExecution("generateInteractionMatrix", "started", {
                    input: { componentsCount: input.components?.length || 0 },
                });
            }
            // Execute the actual interaction matrix generation
            const result = await this.seamAnalyzer.generateInteractionMatrix(input);
            // End performance tracking
            if (timingId && this.performanceTrackingEnabled) {
                await this.performanceTracker.endTiming(timingId);
            }
            // Log completion
            if (this.debugLoggingEnabled) {
                await this.devUtilities.logSeamExecution("generateInteractionMatrix", "completed", {
                    success: result.success,
                    totalInteractions: result.data?.metadata?.totalInteractions || 0,
                });
            }
            return result;
        }
        catch (error) {
            // Log error if debug logging enabled
            if (this.debugLoggingEnabled) {
                await this.devUtilities.logSeamExecution("generateInteractionMatrix", "error", {
                    error: error instanceof Error ? error.message : String(error),
                });
            }
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Failed to generate interaction matrix with tracking: ${error instanceof Error ? error.message : String(error)}`, { operation: "generateInteractionMatrixWithTracking" }),
                metadata: {
                    seamName: "InteractionEngine-PerformanceTracker-DevUtilities",
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                },
            };
        }
    }
    /**
     * ⚡ QUICK_WIN: Enable/disable performance tracking
     * SEAM: ConfigManager ↔ PerformanceTracker
     */
    async enablePerformanceTracking(enabled) {
        try {
            this.performanceTrackingEnabled = enabled;
            // Log the configuration change if debug logging is enabled
            if (this.debugLoggingEnabled) {
                await this.devUtilities.logSeamExecution("enablePerformanceTracking", "completed", {
                    enabled,
                    previousState: !enabled,
                });
            }
            return {
                success: true,
                data: enabled,
                metadata: {
                    seamName: "ConfigManager-PerformanceTracker",
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Failed to enable/disable performance tracking: ${error instanceof Error ? error.message : String(error)}`, { operation: "enablePerformanceTracking", enabled }),
                metadata: {
                    seamName: "ConfigManager-PerformanceTracker",
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                },
            };
        }
    }
    /**
     * ⚡ QUICK_WIN: Enable/disable debug logging
     * SEAM: ConfigManager ↔ DevUtilities
     */
    async enableDebugLogging(enabled) {
        try {
            const previousState = this.debugLoggingEnabled;
            this.debugLoggingEnabled = enabled;
            // Log the configuration change (if we just enabled logging)
            if (enabled) {
                await this.devUtilities.logSeamExecution("enableDebugLogging", "completed", {
                    enabled,
                    previousState,
                });
            }
            return {
                success: true,
                data: enabled,
                metadata: {
                    seamName: "ConfigManager-DevUtilities",
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Failed to enable/disable debug logging: ${error instanceof Error ? error.message : String(error)}`, { operation: "enableDebugLogging", enabled }),
                metadata: {
                    seamName: "ConfigManager-DevUtilities",
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                },
            };
        }
    }
    /**
     * 📊 ANALYTICS: Get operation performance metrics
     * SEAM: PerformanceTracker ↔ MetricsCollector
     */
    async getOperationMetrics() {
        try {
            // Get the performance report from the tracker
            const performanceReport = await this.performanceTracker.getPerformanceReport();
            if (!performanceReport.success) {
                return {
                    success: false,
                    error: createSDDError(this.agentId, "ProcessingError", "Failed to retrieve performance report from tracker", { operation: "getOperationMetrics" }),
                    metadata: {
                        seamName: "PerformanceTracker-MetricsCollector",
                        agentId: this.agentId,
                        timestamp: new Date().toISOString(),
                    },
                };
            }
            // Transform the performance report into the PerformanceMetrics format
            const report = performanceReport.data;
            // Find slowest and fastest operations
            const slowestOp = report.operationMetrics.reduce((prev, current) => current.maxTime > prev.maxTime ? current : prev);
            const fastestOp = report.operationMetrics.reduce((prev, current) => current.minTime < prev.minTime ? current : prev);
            const metrics = {
                totalOperations: report.overview.totalOperations,
                averageExecutionTime: report.overview.averageResponseTime,
                slowestOperation: {
                    operation: slowestOp.operationName,
                    duration: slowestOp.maxTime,
                    input: { operationMetrics: slowestOp },
                },
                fastestOperation: {
                    operation: fastestOp.operationName,
                    duration: fastestOp.minTime,
                },
                operationBreakdown: report.operationMetrics.map((op) => ({
                    operation: op.operationName,
                    count: op.callCount,
                    totalTime: op.totalTime,
                    averageTime: op.averageTime,
                })),
                recommendations: report.recommendations.map((rec) => rec.description),
            };
            return {
                success: true,
                data: metrics,
                metadata: {
                    seamName: "PerformanceTracker-MetricsCollector",
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Failed to get operation metrics: ${error instanceof Error ? error.message : String(error)}`, { operation: "getOperationMetrics" }),
                metadata: {
                    seamName: "PerformanceTracker-MetricsCollector",
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                },
            };
        }
    }
    /**
     * 🧪 EXPERIMENTAL: Get comprehensive debug report
     * SEAM: DevUtilities ↔ PerformanceTracker ↔ ErrorHandler
     */
    async getDebugReport() {
        try {
            // Get debug report from dev utilities
            const debugResult = await this.devUtilities.generateDebugReport();
            const performanceResult = await this.performanceTracker.getPerformanceReport();
            if (!debugResult.success) {
                return {
                    success: false,
                    error: createSDDError(this.agentId, "ProcessingError", "Failed to generate debug report from dev utilities", { operation: "getDebugReport" }),
                    metadata: {
                        seamName: "DevUtilities-PerformanceTracker-ErrorHandler",
                        agentId: this.agentId,
                        timestamp: new Date().toISOString(),
                    },
                };
            }
            const debugData = debugResult.data;
            // Combine with performance insights if available
            const performanceInsights = [];
            if (performanceResult.success) {
                performanceInsights.push(...performanceResult.data.recommendations.map((rec) => rec.description));
            }
            // Transform from dev utilities DebugReport to the contract DebugReport
            const totalOperations = debugData.recentOperations.length;
            const successfulOperations = debugData.recentOperations.filter((op) => op.success).length;
            const failedOperations = totalOperations - successfulOperations;
            // Map system health from "degraded" to "warning" if needed
            let systemHealth = debugData.systemHealth === "degraded"
                ? "warning"
                : debugData.systemHealth;
            const report = {
                timestamp: new Date().toISOString(),
                totalOperations,
                successfulOperations,
                failedOperations,
                recentErrors: debugData.errorSummary.recentErrors.map((error, index) => ({
                    timestamp: debugData.timestamp,
                    operation: `operation_${index}`,
                    error: error,
                    input: undefined,
                })),
                performanceInsights,
                systemHealth,
                recommendations: debugData.recommendations,
            };
            return {
                success: true,
                data: report,
                metadata: {
                    seamName: "DevUtilities-PerformanceTracker-ErrorHandler",
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Failed to generate debug report: ${error instanceof Error ? error.message : String(error)}`, { operation: "getDebugReport" }),
                metadata: {
                    seamName: "DevUtilities-PerformanceTracker-ErrorHandler",
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                },
            };
        }
    }
}
//# sourceMappingURL=enhanced-seam-analyzer-with-utilities.js.map