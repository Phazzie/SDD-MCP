/**
 * Content-Driven Infrastructure Testing System
 * Integrates Gemini's test scenarios with Copilot's utilities
 * Following SDD: Content-Infrastructure Seam + Test-Execution Seam
 */
import { ContractResult } from "../contracts.js";
export interface TestScenario {
    id: string;
    name: string;
    category: "error" | "performance" | "integration";
    input: any;
    expectedOutcome: ExpectedOutcome;
    metadata?: Record<string, any>;
}
export interface ExpectedOutcome {
    success: boolean;
    error?: {
        category: string;
        messageContains: string;
        suggestionsInclude: string[];
        severity: "low" | "medium" | "high" | "critical";
    };
    performance?: {
        maxDurationMs: number;
        operation: string;
    };
    integration?: {
        requiresUtilities: string[];
        expectedLogs: string[];
    };
}
export interface ContentDrivenTestResult {
    scenario: TestScenario;
    executionResult: ContractResult<any>;
    performanceData?: any;
    utilityLogs?: string[];
    complianceReport?: any;
    debugReport?: any;
}
export interface ContentDrivenTestReport {
    totalScenarios: number;
    passedScenarios: number;
    failedScenarios: number;
    results: ContentDrivenTestResult[];
    overallPerformance: any;
    systemHealth: "excellent" | "good" | "warning" | "critical";
    recommendations: string[];
}
export declare class ContentDrivenTestSystem {
    private devUtils;
    private performanceTracker;
    private analyzerWithUtils;
    private testScenarios;
    constructor();
    loadGeminiTestScenarios(): Promise<ContractResult<void>>;
    executeScenario(scenario: TestScenario): Promise<ContractResult<ContentDrivenTestResult>>;
    executeAllScenarios(): Promise<ContractResult<ContentDrivenTestReport>>;
    private isSeamAnalysisInput;
    private isInteractionMatrixInput;
    private validateScenarioResult;
    private generateRecommendations;
}
