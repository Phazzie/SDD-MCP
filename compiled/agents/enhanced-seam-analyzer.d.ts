import { AnalysisDepth, ContractResult, DataFlowAnalysis, DataFlowAnalysisInput, DesignConcern, EnhancedSeamAnalysis, EnhancedSeamAnalysisInput, EnhancedSeamAnalysisOutput, FocusArea, IEnhancedSeamAnalyzer, InteractionMatrix, InteractionMatrixInput, SeamAnalysisInput, SeamDetail, SeamValidationInput, SeamValidationResult } from "../contracts.js";
/**
 * @agent EnhancedSeamAnalyzer_Agent
 * @description Performs enhanced seam analysis on requirements documentation.
 * @sdd_phase 1 (Stubs)
 */
export declare class EnhancedSeamAnalyzer implements IEnhancedSeamAnalyzer {
    private errorHandler;
    constructor();
    analyzeRequirementsEnhanced(input: SeamAnalysisInput): Promise<ContractResult<EnhancedSeamAnalysis>>;
    generateInteractionMatrix(input: InteractionMatrixInput): Promise<ContractResult<InteractionMatrix>>;
    analyzeDataFlows(input: DataFlowAnalysisInput): Promise<ContractResult<DataFlowAnalysis>>;
    validateSeamReadiness(input: SeamValidationInput): Promise<ContractResult<SeamValidationResult>>;
    /**
     * @param input - The requirements text and analysis parameters.
     * @returns A Promise resolving to a ContractResult containing the seam analysis output or an error.
     * @sdd_phase 1 (Stub)
     * @tags 🎯 CRITICAL
     */
    analyzeRequirements(input: EnhancedSeamAnalysisInput): Promise<ContractResult<EnhancedSeamAnalysisOutput>>;
    /**
     * @param text - The text to identify seams in.
     * @param depth - The depth of analysis.
     * @returns A Promise resolving to a ContractResult containing identified seam details or an error.
     * @sdd_phase 1 (Stub)
     * @tags 🔨 HARD_WORK
     */
    identifySeams(text: string, depth?: AnalysisDepth): Promise<ContractResult<SeamDetail[]>>;
    /**
     * @param text - The text to analyze for design concerns.
     * @param focusAreas - Specific areas to focus the analysis on.
     * @returns A Promise resolving to a ContractResult containing identified design concerns or an error.
     * @sdd_phase 1 (Stub)
     * @tags 🧪 EXPERIMENTAL
     */
    detectDesignConcerns(text: string, focusAreas?: FocusArea[]): Promise<ContractResult<DesignConcern[]>>;
}
