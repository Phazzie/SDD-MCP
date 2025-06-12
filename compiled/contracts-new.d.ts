/**
 * Standard result wrapper for all seam communications
 * Ensures consistent error handling across all components
 */
export interface ContractResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    metadata?: Record<string, any>;
}
/**
 * Core seam definition - defines communication pathways between components
 */
export interface SeamDefinition {
    name: string;
    participants: string[];
    dataFlow: "IN" | "OUT" | "BOTH";
    purpose: string;
    description?: string;
    inputType?: string;
    outputType?: string;
    sourceComponent?: string;
    targetComponent?: string;
    errorScenarios?: string[];
    contractInterface?: string;
    status?: "stub" | "partial" | "complete";
}
/**
 * Component definition for architectural analysis
 */
export interface ComponentDefinition {
    name: string;
    type: string;
    purpose: string;
    dependencies?: string[];
}
/**
 * Requirements analysis input
 */
export interface RequirementsAnalysisInput {
    prdText: string;
    designNotes?: string;
    analysisDepth?: "basic" | "detailed" | "comprehensive";
    focusAreas?: ("data_flows" | "integrations" | "dependencies" | "cross_cutting_concerns")[];
}
/**
 * Requirements analysis output
 */
export interface RequirementsAnalysisOutput {
    seams: SeamDefinition[];
    components: ComponentDefinition[];
    architecture: {
        overview: string;
        keyPatterns: string[];
        risks: string[];
        recommendations: string[];
    };
}
/**
 * Contract generation input
 */
export interface ContractGenerationInput {
    seam: SeamDefinition;
}
/**
 * Contract generation output
 */
export interface ContractGenerationOutput {
    contractCode: string;
    testCode: string;
    documentation: string;
}
/**
 * Stub creation input
 */
export interface StubCreationInput {
    contractCode: string;
    componentName: string;
}
/**
 * Stub creation output
 */
export interface StubCreationOutput {
    stubCode: string;
    blueprintComments: string[];
    notImplementedErrors: string[];
}
/**
 * Workflow orchestration input
 */
export interface WorkflowOrchestrationInput {
    prdText: string;
    projectName: string;
    designNotes?: string;
}
/**
 * Workflow orchestration output
 */
export interface WorkflowOrchestrationOutput {
    seams: SeamDefinition[];
    contracts: Record<string, string>;
    stubs: Record<string, string>;
    tests: Record<string, string>;
    documentation: string;
    architecture: string;
}
/**
 * Data flow analysis input
 */
export interface DataFlowAnalysisInput {
    seamDefinitions: SeamDefinition[];
    performanceRequirements?: {
        maxLatency?: number;
        minThroughput?: number;
        memoryConstraints?: string;
    };
    analyzeBottlenecks?: boolean;
    includeOptimizations?: boolean;
}
/**
 * Data flow analysis output
 */
export interface DataFlowAnalysisOutput {
    flows: {
        source: string;
        target: string;
        dataType: string;
        volume: string;
        latency: string;
    }[];
    bottlenecks: {
        location: string;
        type: string;
        impact: string;
        recommendation: string;
    }[];
    optimizations: {
        area: string;
        suggestion: string;
        effort: "low" | "medium" | "high";
        impact: "low" | "medium" | "high";
    }[];
}
/**
 * Interaction matrix input
 */
export interface InteractionMatrixInput {
    components: ComponentDefinition[];
    seamDefinitions?: SeamDefinition[];
    analysisScope?: "full" | "critical-path" | "integration-points";
    includeMetrics?: boolean;
}
/**
 * Interaction matrix output
 */
export interface InteractionMatrixOutput {
    matrix: Record<string, Record<string, {
        hasInteraction: boolean;
        type: string;
        strength: "weak" | "moderate" | "strong";
        dependencies: string[];
    }>>;
    metrics?: {
        coupling: Record<string, number>;
        complexity: Record<string, number>;
        centrality: Record<string, number>;
    };
    recommendations: string[];
}
/**
 * Test failure analysis input
 */
export interface TestFailureAnalysisInput {
    testResults: {
        testName: string;
        componentName: string;
        expectedOutput: string;
        actualOutput: string;
        errorMessage: string;
    }[];
    implementationComplexity?: number;
}
/**
 * Test failure analysis output
 */
export interface TestFailureAnalysisOutput {
    strategy: "incremental" | "de_novo";
    reasoning: string;
    fixRecommendations: {
        area: string;
        action: string;
        priority: "high" | "medium" | "low";
    }[];
    riskAssessment: {
        level: "low" | "medium" | "high";
        factors: string[];
    };
}
/**
 * Seam readiness validation input
 */
export interface SeamReadinessValidationInput {
    seamDefinitions: SeamDefinition[];
    validationLevel?: "basic" | "comprehensive" | "critical-only";
    strictMode?: boolean;
    checkDependencies?: boolean;
}
/**
 * Seam readiness validation output
 */
export interface SeamReadinessValidationOutput {
    overallReadiness: boolean;
    seamStatuses: {
        seamName: string;
        ready: boolean;
        issues: string[];
        recommendations: string[];
        criticalBlocking: boolean;
    }[];
    summary: {
        readyCount: number;
        totalCount: number;
        criticalIssues: string[];
        nextSteps: string[];
    };
}
/**
 * Compliance validation input
 */
export interface ComplianceValidationInput {
    projectPath: string;
    strictMode?: boolean;
}
/**
 * Compliance validation output
 */
export interface ComplianceValidationOutput {
    compliant: boolean;
    contractCompleteness: {
        score: number;
        missing: string[];
        recommendations: string[];
    };
    blueprintComments: {
        coverage: number;
        missing: string[];
    };
    contractResultUsage: {
        consistent: boolean;
        violations: string[];
    };
    testCoverage: {
        percentage: number;
        missingTests: string[];
    };
    overallRecommendations: string[];
}
/**
 * Manual test procedure input
 */
export interface ManualTestInput {
    contractCode: string;
    componentName: string;
}
/**
 * Manual test procedure output
 */
export interface ManualTestOutput {
    procedures: {
        testName: string;
        steps: string[];
        expectedResults: string[];
        validationCriteria: string[];
    }[];
    setupInstructions: string[];
    teardownInstructions: string[];
}
/**
 * Architecture visualization input
 */
export interface ArchitectureVisualizationInput {
    seams: SeamDefinition[];
    projectName: string;
}
/**
 * Architecture visualization output
 */
export interface ArchitectureVisualizationOutput {
    mermaidDiagram: string;
    textualDescription: string;
    componentSummary: {
        name: string;
        connections: number;
        status: string;
    }[];
}
/**
 * Error context for debugging
 */
export interface ErrorContext {
    tool: string;
    operation: string;
    input: any;
    timestamp: string;
    stackTrace?: string;
}
/**
 * Performance requirements
 */
export interface PerformanceRequirements {
    maxLatency: number;
    minThroughput: number;
    memoryConstraints: string;
}
/**
 * Template enhancement rules
 */
export interface TemplateEnhancementRules {
    transformationRules: string[];
    templateType: "contract" | "stub" | "test";
}
/**
 * Type guard to check if a result is successful
 */
export declare function isSuccessResult<T>(result: ContractResult<T>): result is ContractResult<T> & {
    success: true;
    data: T;
};
/**
 * Type guard to check if a result is an error
 */
export declare function isErrorResult<T>(result: ContractResult<T>): result is ContractResult<T> & {
    success: false;
    error: string;
};
