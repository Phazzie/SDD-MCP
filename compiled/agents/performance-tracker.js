/**
 * SDD MCP Server - Performance Tracker
 * Blueprint: Track response times and identify bottlenecks following SDD methodology
 */
import { createSDDError } from "../contracts.js";
// ================================
// Performance Tracker Implementation
// ================================
export class PerformanceTracker {
    agentId;
    activeTimings = new Map();
    performanceRecords = [];
    customMetrics = new Map();
    maxRecords = 10000;
    startTime = Date.now();
    constructor(agentId) {
        this.agentId = agentId;
    }
    async startTiming(operationId) {
        try {
            const timingId = `${operationId}_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`;
            const startTime = performance.now();
            const startTimestamp = new Date().toISOString();
            const timing = {
                operationId,
                startTime,
                startTimestamp,
            };
            this.activeTimings.set(timingId, timing);
            return {
                success: true,
                data: timingId,
                metadata: {
                    agentId: this.agentId,
                    timestamp: startTimestamp,
                    seamName: "PerformanceTracker.startTiming",
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Failed to start timing for operation ${operationId}: ${error instanceof Error ? error.message : String(error)}`, { operationId, error }, "PerformanceTracker.startTiming"),
            };
        }
    }
    async endTiming(timingId) {
        try {
            const timing = this.activeTimings.get(timingId);
            if (!timing) {
                return {
                    success: false,
                    error: createSDDError(this.agentId, "ValidationError", `No active timing found for ID: ${timingId}`, { timingId, activeTiming: Array.from(this.activeTimings.keys()) }, "PerformanceTracker.endTiming"),
                };
            }
            const endTime = performance.now();
            const duration = Math.round(endTime - timing.startTime);
            const timestamp = new Date().toISOString();
            // Record performance data
            const record = {
                operationId: timing.operationId,
                duration,
                timestamp,
                success: true,
                memoryUsage: process.memoryUsage?.()?.heapUsed || 0,
            };
            this.performanceRecords.push(record);
            this.activeTimings.delete(timingId);
            // Cleanup old records
            if (this.performanceRecords.length > this.maxRecords) {
                this.performanceRecords = this.performanceRecords.slice(-this.maxRecords);
            }
            // Log performance for monitoring
            if (duration > 1000) {
                console.log(`⚠️ [${this.agentId}] Slow operation: ${timing.operationId} took ${duration}ms`);
            }
            else if (duration > 100) {
                console.log(`⏱️ [${this.agentId}] ${timing.operationId}: ${duration}ms`);
            }
            return {
                success: true,
                data: duration,
                metadata: {
                    agentId: this.agentId,
                    timestamp,
                    processingTimeMs: duration,
                    seamName: "PerformanceTracker.endTiming",
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Failed to end timing for ID ${timingId}: ${error instanceof Error ? error.message : String(error)}`, { timingId, error }, "PerformanceTracker.endTiming"),
            };
        }
    }
    async recordMetric(metric, value) {
        try {
            if (!this.customMetrics.has(metric)) {
                this.customMetrics.set(metric, []);
            }
            const metricValues = this.customMetrics.get(metric);
            metricValues.push(value);
            // Keep only recent values (last 1000 per metric)
            if (metricValues.length > 1000) {
                metricValues.splice(0, metricValues.length - 1000);
            }
            return {
                success: true,
                data: undefined,
                metadata: {
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                    seamName: "PerformanceTracker.recordMetric",
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Failed to record metric ${metric}: ${error instanceof Error ? error.message : String(error)}`, { metric, value, error }, "PerformanceTracker.recordMetric"),
            };
        }
    }
    async getPerformanceReport() {
        try {
            const timestamp = new Date().toISOString();
            const reportPeriod = `Last ${this.performanceRecords.length} operations`;
            // Calculate overview metrics
            const overview = this.calculateOverview();
            // Calculate operation-specific metrics
            const operationMetrics = this.calculateOperationMetrics();
            // Get system metrics
            const systemMetrics = this.getSystemMetrics();
            // Identify bottlenecks
            const bottlenecks = this.identifyBottlenecks(operationMetrics, systemMetrics);
            // Generate recommendations
            const recommendations = this.generateRecommendations(overview, bottlenecks);
            const report = {
                timestamp,
                reportPeriod,
                overview,
                operationMetrics,
                systemMetrics,
                bottlenecks,
                recommendations,
            };
            return {
                success: true,
                data: report,
                metadata: {
                    agentId: this.agentId,
                    timestamp,
                    seamName: "PerformanceTracker.getPerformanceReport",
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Failed to generate performance report: ${error instanceof Error ? error.message : String(error)}`, { error }, "PerformanceTracker.getPerformanceReport"),
            };
        }
    }
    calculateOverview() {
        if (this.performanceRecords.length === 0) {
            return {
                totalOperations: 0,
                averageResponseTime: 0,
                operationsPerSecond: 0,
                slowestOperation: "None",
                fastestOperation: "None",
                errorRate: 0,
            };
        }
        const totalOperations = this.performanceRecords.length;
        const successfulOps = this.performanceRecords.filter((r) => r.success);
        const durations = successfulOps.map((r) => r.duration);
        const averageResponseTime = durations.reduce((sum, d) => sum + d, 0) / durations.length;
        // Calculate operations per second
        const timeSpan = Date.now() - this.startTime;
        const operationsPerSecond = totalOperations / (timeSpan / 1000);
        // Find slowest and fastest
        const sortedByDuration = [...successfulOps].sort((a, b) => b.duration - a.duration);
        const slowestOperation = sortedByDuration[0]?.operationId || "None";
        const fastestOperation = sortedByDuration[sortedByDuration.length - 1]?.operationId || "None";
        const errorRate = (this.performanceRecords.length - successfulOps.length) / totalOperations;
        return {
            totalOperations,
            averageResponseTime: Math.round(averageResponseTime),
            operationsPerSecond: Math.round(operationsPerSecond * 100) / 100,
            slowestOperation,
            fastestOperation,
            errorRate: Math.round(errorRate * 100) / 100,
        };
    }
    calculateOperationMetrics() {
        const operationGroups = {};
        // Group records by operation
        this.performanceRecords.forEach((record) => {
            if (!operationGroups[record.operationId]) {
                operationGroups[record.operationId] = [];
            }
            operationGroups[record.operationId].push(record);
        });
        return Object.entries(operationGroups).map(([operationName, records]) => {
            const successfulRecords = records.filter((r) => r.success);
            const durations = successfulRecords
                .map((r) => r.duration)
                .sort((a, b) => a - b);
            const callCount = records.length;
            const errorCount = records.length - successfulRecords.length;
            const averageTime = durations.length > 0
                ? durations.reduce((sum, d) => sum + d, 0) / durations.length
                : 0;
            const minTime = durations.length > 0 ? durations[0] : 0;
            const maxTime = durations.length > 0 ? durations[durations.length - 1] : 0;
            const totalTime = durations.reduce((sum, d) => sum + d, 0);
            const lastCalled = records[records.length - 1]?.timestamp || new Date().toISOString();
            // Calculate percentiles
            const percentile95 = this.calculatePercentile(durations, 0.95);
            const percentile99 = this.calculatePercentile(durations, 0.99);
            return {
                operationName,
                callCount,
                averageTime: Math.round(averageTime),
                minTime,
                maxTime,
                totalTime,
                errorCount,
                lastCalled,
                percentile95: Math.round(percentile95),
                percentile99: Math.round(percentile99),
            };
        });
    }
    calculatePercentile(sortedValues, percentile) {
        if (sortedValues.length === 0)
            return 0;
        const index = Math.ceil(sortedValues.length * percentile) - 1;
        return sortedValues[Math.max(0, index)];
    }
    getSystemMetrics() {
        const memUsage = process.memoryUsage?.() || {
            heapUsed: 0,
            heapTotal: 0,
            external: 0,
            rss: 0,
        };
        return {
            memoryUsage: memUsage,
            cpuUsage: 0, // Would need additional measurement for accurate CPU usage
            uptime: Date.now() - this.startTime,
            activeTimers: this.activeTimings.size,
        };
    }
    identifyBottlenecks(operationMetrics, systemMetrics) {
        const bottlenecks = [];
        // Check for slow operations
        const slowOperations = operationMetrics.filter((op) => op.averageTime > 1000);
        if (slowOperations.length > 0) {
            bottlenecks.push({
                type: "slow_operation",
                severity: slowOperations.some((op) => op.averageTime > 5000)
                    ? "high"
                    : "medium",
                description: `${slowOperations.length} operation(s) have average response time > 1000ms`,
                affectedOperations: slowOperations.map((op) => op.operationName),
                impact: "Reduced user experience and system throughput",
                suggestedFixes: [
                    "Profile slow operations to identify bottlenecks",
                    "Consider caching frequently computed results",
                    "Optimize database queries if applicable",
                    "Consider async processing for heavy operations",
                ],
            });
        }
        // Check for high error rates
        const errorOperations = operationMetrics.filter((op) => op.errorCount / op.callCount > 0.1);
        if (errorOperations.length > 0) {
            bottlenecks.push({
                type: "frequent_errors",
                severity: "high",
                description: `${errorOperations.length} operation(s) have error rate > 10%`,
                affectedOperations: errorOperations.map((op) => op.operationName),
                impact: "System reliability and user experience degradation",
                suggestedFixes: [
                    "Review error logs for common failure patterns",
                    "Implement better input validation",
                    "Add retry mechanisms for transient failures",
                    "Improve error handling and recovery",
                ],
            });
        }
        // Check memory usage
        if (systemMetrics.memoryUsage.heapUsed > 100 * 1024 * 1024) {
            // > 100MB
            bottlenecks.push({
                type: "high_memory",
                severity: systemMetrics.memoryUsage.heapUsed > 500 * 1024 * 1024
                    ? "high"
                    : "medium",
                description: `High memory usage: ${Math.round(systemMetrics.memoryUsage.heapUsed / 1024 / 1024)}MB heap used`,
                affectedOperations: ["System-wide"],
                impact: "Potential memory leaks or inefficient memory usage",
                suggestedFixes: [
                    "Profile memory usage to identify leaks",
                    "Implement object pooling for frequently created objects",
                    "Review large data structures and consider streaming",
                    "Optimize caching strategies",
                ],
            });
        }
        return bottlenecks;
    }
    generateRecommendations(overview, bottlenecks) {
        const recommendations = [];
        // Performance recommendations
        if (overview.averageResponseTime > 500) {
            recommendations.push({
                priority: "high",
                category: "performance",
                title: "Optimize Response Times",
                description: `Average response time is ${overview.averageResponseTime}ms, which exceeds recommended 500ms threshold`,
                implementationSteps: [
                    "Profile the slowest operations",
                    "Implement caching where appropriate",
                    "Consider asynchronous processing",
                    "Optimize database queries and indexes",
                ],
                expectedImprovement: "30-50% reduction in response times",
            });
        }
        // Error rate recommendations
        if (overview.errorRate > 0.05) {
            recommendations.push({
                priority: "critical",
                category: "reliability",
                title: "Reduce Error Rate",
                description: `Error rate is ${(overview.errorRate * 100).toFixed(1)}%, exceeding 5% threshold`,
                implementationSteps: [
                    "Analyze error patterns and root causes",
                    "Improve input validation and error handling",
                    "Implement retry mechanisms for transient failures",
                    "Add comprehensive monitoring and alerting",
                ],
                expectedImprovement: "Reduce error rate to < 2%",
            });
        }
        // Add bottleneck-specific recommendations
        bottlenecks.forEach((bottleneck) => {
            if (bottleneck.severity === "high" ||
                bottleneck.severity === "critical") {
                recommendations.push({
                    priority: bottleneck.severity,
                    category: "performance",
                    title: `Address ${bottleneck.type.replace("_", " ")}`,
                    description: bottleneck.description,
                    implementationSteps: bottleneck.suggestedFixes,
                    expectedImprovement: bottleneck.impact,
                });
            }
        });
        return recommendations;
    }
}
//# sourceMappingURL=performance-tracker.js.map