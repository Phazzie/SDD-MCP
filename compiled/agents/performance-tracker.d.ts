/**
 * SDD MCP Server - Performance Tracker
 * Blueprint: Track response times and identify bottlenecks following SDD methodology
 */
import { AgentId, ContractResult } from "../contracts.js";
export interface PerformanceTrackerContract {
    startTiming(operationId: string): Promise<ContractResult<string>>;
    endTiming(timingId: string): Promise<ContractResult<number>>;
    recordMetric(metric: string, value: number): Promise<ContractResult<void>>;
    getPerformanceReport(): Promise<ContractResult<PerformanceReport>>;
}
export interface PerformanceReport {
    timestamp: string;
    reportPeriod: string;
    overview: PerformanceOverview;
    operationMetrics: OperationMetrics[];
    systemMetrics: SystemMetrics;
    bottlenecks: PerformanceBottleneck[];
    recommendations: PerformanceRecommendation[];
}
export interface PerformanceOverview {
    totalOperations: number;
    averageResponseTime: number;
    operationsPerSecond: number;
    slowestOperation: string;
    fastestOperation: string;
    errorRate: number;
}
export interface OperationMetrics {
    operationName: string;
    callCount: number;
    averageTime: number;
    minTime: number;
    maxTime: number;
    totalTime: number;
    errorCount: number;
    lastCalled: string;
    percentile95: number;
    percentile99: number;
}
export interface SystemMetrics {
    memoryUsage: {
        heapUsed: number;
        heapTotal: number;
        external: number;
        rss: number;
    };
    cpuUsage: number;
    uptime: number;
    activeTimers: number;
}
export interface PerformanceBottleneck {
    type: "slow_operation" | "high_memory" | "frequent_errors" | "resource_contention";
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    affectedOperations: string[];
    impact: string;
    suggestedFixes: string[];
}
export interface PerformanceRecommendation {
    priority: "low" | "medium" | "high" | "critical";
    category: "performance" | "memory" | "reliability" | "scalability";
    title: string;
    description: string;
    implementationSteps: string[];
    expectedImprovement: string;
}
export declare class PerformanceTracker implements PerformanceTrackerContract {
    private agentId;
    private activeTimings;
    private performanceRecords;
    private customMetrics;
    private maxRecords;
    private startTime;
    constructor(agentId: AgentId);
    startTiming(operationId: string): Promise<ContractResult<string>>;
    endTiming(timingId: string): Promise<ContractResult<number>>;
    recordMetric(metric: string, value: number): Promise<ContractResult<void>>;
    getPerformanceReport(): Promise<ContractResult<PerformanceReport>>;
    private calculateOverview;
    private calculateOperationMetrics;
    private calculatePercentile;
    private getSystemMetrics;
    private identifyBottlenecks;
    private generateRecommendations;
}
