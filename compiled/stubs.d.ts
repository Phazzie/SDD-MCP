/**
 * SDD MCP Server - Implementation Stubs
 * Generated using SDD methodology - Ready for implementation
 */
import { AgentId, ComplianceReport, ConfigContract, ContractGenerationResult, ContractResult, DiagnosticInfo, ErrorContext, ErrorHandlerContract, HealthReport, // Keep this one for generateInteractionMatrix helpers
MCPServerContract, PatternReport, ProjectStructure, SDDFunctionContract, ServerConfig, ServerHealth, StubGenerationResult, TemplateData, TemplateProcessorContract, ToolDefinition, ValidationContract, ValidationReport } from "./contracts.js";
export declare class MCPServerStub implements MCPServerContract {
    private readonly agentId;
    listTools(): ContractResult<ToolDefinition[]>;
    executeTool(name: string, args: unknown): ContractResult<unknown>;
    initialize(): ContractResult<void>;
    shutdown(): ContractResult<void>;
    healthCheck(): ContractResult<ServerHealth>;
}
export declare class SDDAnalyzerStub implements SDDFunctionContract {
    private readonly agentId;
    analyzeRequirements(prd: string): Promise<ContractResult<SeamDefinition[]>>;
    generateContract(seam: SeamDefinition): Promise<ContractResult<ContractGenerationResult>>;
    createStub(contract: ContractGenerationResult): Promise<ContractResult<StubGenerationResult>>;
    orchestrateWorkflow(prd: string): Promise<ContractResult<ProjectStructure>>;
    validateProject(structure: ProjectStructure): Promise<ContractResult<ValidationReport>>;
}
export declare class TemplateProcessorStub implements TemplateProcessorContract {
    private readonly agentId;
    loadTemplate(templateType: "contract" | "stub" | "seam"): Promise<ContractResult<string>>;
    processTemplate(template: string, data: TemplateData): Promise<ContractResult<string>>;
    validateTemplate(template: string): Promise<ContractResult<boolean>>;
    reloadTemplates(): Promise<ContractResult<void>>;
}
export declare class ValidationEngineStub implements ValidationContract {
    private readonly agentId;
    validateInput(schema: any, data: unknown): Promise<ContractResult<unknown>>;
    validateContract(code: string): Promise<ContractResult<ComplianceReport>>;
    validateProjectHealth(structure: ProjectStructure): Promise<ContractResult<HealthReport>>;
    validateSDDPatterns(code: string): Promise<ContractResult<PatternReport>>;
}
export declare class ErrorHandlerStub implements ErrorHandlerContract {
    private readonly agentId;
    handleError(error: Error, context: ErrorContext): Promise<ContractResult<void>>;
    logError(agentId: AgentId, error: string, details?: any): Promise<ContractResult<void>>;
    suggestRecovery(errorType: string): Promise<ContractResult<string[]>>;
    collectDiagnostics(): Promise<ContractResult<DiagnosticInfo>>;
}
export declare class ConfigManagerStub implements ConfigContract {
    private readonly agentId;
    loadConfig(): Promise<ContractResult<ServerConfig>>;
    updateConfig(updates: Partial<ServerConfig>): Promise<ContractResult<void>>;
    getTemplatePath(templateType: string): Promise<ContractResult<string>>;
    isFeatureEnabled(feature: string): Promise<ContractResult<boolean>>;
}
/**
 * 🎯 ENHANCED SEAM ANALYZER STUBS
 * PURPOSE: Implementation stubs for enhanced seam analysis capabilities
 * STATUS: STUB - Following SDD patterns with NotImplementedError
 * SEAM: SeamAnalyzer ↔ Enhanced pattern recognition system
 */
import { // This is the INPUT type for generateInteractionMatrix - present in contracts.ts
DataFlowAnalysis, // Result for analyzeDataFlows
DataFlowAnalysisInput, EnhancedSeamAnalysis, // Input for validateSeamReadiness - present in contracts.ts
IEnhancedSeamAnalyzer, // This is the INPUT type for analyzeRequirementsEnhanced
InteractionMatrix, // Result for generateInteractionMatrix (already in global, but good for clarity here)
InteractionMatrixInput, // This is the RESULT type for analyzeRequirementsEnhanced
SeamAnalysisInput, // Needed for helpers
SeamDefinition, // Result for validateSeamReadiness
SeamValidationInput, // Input for analyzeDataFlows - present in contracts.ts
SeamValidationResult } from "./contracts.js";
export declare class EnhancedSeamAnalyzerStub implements IEnhancedSeamAnalyzer {
    private readonly agentId;
    private readonly devUtilities;
    constructor();
    /**
     * 🎯 CRITICAL: Enhanced requirements analysis with NLP-based pattern recognition
     * Implements SDD-compliant seam identification using proven NLP algorithms
     */
    analyzeRequirementsEnhanced(input: SeamAnalysisInput): Promise<ContractResult<EnhancedSeamAnalysis>>;
    private extractComponentsFromText;
    private identifyComponentInteractions;
    private analyzeDataFlowPatterns;
    private identifyCrossCuttingConcerns;
    private generateSeamDefinitions;
    private calculateOverallConfidence;
    private extractFoundPatterns;
    /**
     * 🎯 CRITICAL: Generate component interaction matrix
     * 💰 HIGH_ROI: Leverages existing validation patterns and rule-based analysis
     * ⚡ QUICK_WIN: Uses proven patterns from analyzeRequirementsEnhanced
     *
     * Seams: ComponentAnalyzer ↔ InteractionMapper ↔ PerformanceTracker
     * Contract: Builds comprehensive interaction matrix with critical path analysis
     */
    generateInteractionMatrix(input: InteractionMatrixInput): Promise<ContractResult<InteractionMatrix>>;
    private buildInteractionMatrix;
    private analyzeInteractionType;
    private identifyCriticalPaths;
    private findIsolatedComponents;
    private calculateComplexityMetrics;
    /**
     * 💰 HIGH_ROI: Analyze data flows between components
     * Blueprint: TODO - Implement data flow tracing with transformation analysis
     */
    analyzeDataFlows(input: DataFlowAnalysisInput): Promise<ContractResult<DataFlowAnalysis>>;
    /**
     * 🎯 Helper for Data Flow Mapping (Phase 6.3.4)
     * Identifies data flows between components based on requirements.
     */ private mapDataFlows;
    /**
     * 🎯 Helper for Data Transformation Identification (Phase 6.3.5)
     * Identifies data transformations mentioned in requirements.
     */ private identifyDataTransformations;
    /**
     * 🛡️ Helper to clean and normalize data type names
     */
    private cleanDataType;
    /**
     * 🎯 Helper for Bottleneck Detection (Phase 6.3.6)
     * Identifies potential bottlenecks based on flow and transformation complexity.
     */
    private detectPotentialBottlenecks;
    /**
     * 🎯 Helper for Data Consistency Assessment (Phase 6.3.6)
     * Assesses data consistency based on identified data types.
     * Returns a score between 0 (low consistency) and 1 (high consistency).
     */
    private assessDataConsistency;
    /**
     * 🎯 Helper for Flow Complexity Calculation (Phase 6.3.7)
     * Calculates a complexity score based on number of flows and transformations.
     */
    private calculateFlowComplexity;
    private capitalizeFirstLetter;
    /**
     * Helper to identify data entities from requirements text.
     * @param requirements The requirements text.
     * @param components The list of component names.
     * @param existingDataTypes Optional list of known data type names.
     * @returns An array of DataTypeDefinition.
     */
    private identifyDataEntities;
    /**
     * Helper to find the original casing of a word from the requirements text.
     * This is a simplified approach.
     */
    private findOriginalCase;
    /**
     * ⚡ QUICK_WIN: Validate seam readiness for implementation
     * Blueprint: TODO - Implement seam validation rules
     */
    validateSeamReadiness(input: SeamValidationInput): Promise<ContractResult<SeamValidationResult>>;
}
export declare const integrationTests: {
    mcpProtocol: string;
    sddWorkflow: string;
    templateProcessing: string;
    seamConnections: string;
};
