import { ContractResult, SeamDefinition } from "./contracts.js";
/**
 * All seams in the SDD MCP Server
 * Each seam represents a communication pathway between components
 */
export declare const SEAM_REGISTRY: Record<string, SeamDefinition>;
/**
 * Central seam management and execution
 * Connects seam definitions to actual tool implementations
 */
export declare class SeamManager {
    private toolConnections;
    constructor();
    /**
     * Initialize connections between seams and actual tools
     * This is where seams connect to real implementations
     */
    private initializeToolConnections;
    /**
     * Execute a seam by name with input data
     * Central pathway for all seam communications
     */
    executeSeam<TInput, TOutput>(seamName: string, input: TInput): Promise<ContractResult<TOutput>>;
    /**
     * Get all available seams
     */
    getAvailableSeams(): SeamDefinition[];
    /**
     * Get seam definition by name
     */
    getSeamDefinition(seamName: string): SeamDefinition | undefined;
    /**
     * Validate that all seams have tool connections
     */
    validateConnections(): {
        connected: string[];
        missing: string[];
    };
    private executeAnalyzeRequirements;
    private executeAnalyzeDataFlows;
    private executeGenerateInteractionMatrix;
    private executeGenerateContract;
    private executeCreateStub;
    private executeOrchestrateFull;
    private executeValidateSeamReadiness;
    private executeValidateCompliance;
    private executeAnalyzeTestFailures;
    private executeGenerateManualTests;
    private executeVisualizeArchitecture;
}
/**
 * Singleton instance of SeamManager
 * Use this for all seam execution throughout the application
 */
export declare const seamManager: SeamManager;
/**
 * Convenience function to execute a seam
 * Wraps seamManager.executeSeam for easier imports
 */
export declare function executeSeam<TInput, TOutput>(seamName: string, input: TInput): Promise<ContractResult<TOutput>>;
/**
 * Get all available seam definitions
 */
export declare function getAvailableSeams(): SeamDefinition[];
/**
 * Validate all seam connections
 */
export declare function validateSeamConnections(): {
    connected: string[];
    missing: string[];
};
