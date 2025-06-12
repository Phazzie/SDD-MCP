/**
 * SDD Analyzer Agent Implementation
 *
 * This agent orchestrates the complete SDD workflow:
 * PRD → Seam Analysis → Contract Generation → Stub Creation → Validation
 *
 * Blueprint: Core SDD methodology orchestration
 *
 * @author: SDD MCP Server
 * @seam: SDDAnalyzer (Main orchestration agent)
 */
import { ContractGenerationResult, ContractResult, ProjectStructure, SDDFunctionContract, SeamDefinition, StubGenerationResult, ValidationReport } from "../contracts.js";
import { SeamManager } from "../seams.js";
import { ConfigManager } from "./config-manager.js";
import { ErrorHandler } from "./error-handler.js";
import { TemplateProcessor } from "./template-processor.js";
import { ValidationEngine } from "./validation-engine.js";
export declare class SDDAnalyzer implements SDDFunctionContract {
    private readonly agentId;
    private readonly seamManager;
    private readonly configManager;
    private readonly errorHandler;
    private readonly templateProcessor;
    private readonly validationEngine;
    constructor(seamManager: SeamManager, configManager: ConfigManager, errorHandler: ErrorHandler, templateProcessor: TemplateProcessor, validationEngine: ValidationEngine);
    /**
     * Analyze requirements to identify seams
     * Blueprint: Parse PRD text to extract seam definitions
     */
    analyzeRequirements(prd: string): Promise<ContractResult<SeamDefinition[]>>;
    /**
     * Generate contract from seam definition using SDD methodology
     * Blueprint: Transform seam into type-safe contract with templates
     */
    generateContract(seam: SeamDefinition): Promise<ContractResult<ContractGenerationResult>>;
    /**
     * Create implementation stub from contract
     * Blueprint: Generate implementation skeleton with NotImplementedError tracking
     */
    createStub(contract: ContractGenerationResult): Promise<ContractResult<StubGenerationResult>>;
    /**
     * Orchestrate complete SDD workflow
     * Blueprint: Execute full PRD → Seams → Contracts → Stubs → Validation workflow
     */
    orchestrateWorkflow(prd: string): Promise<ContractResult<ProjectStructure>>;
    /**
     * Validate project structure against SDD patterns
     * Blueprint: Comprehensive validation of SDD compliance
     */
    validateProject(structure: ProjectStructure): Promise<ContractResult<ValidationReport>>;
    private analyzeSeamsFromPRD;
    private generateBlueprintComments;
    private extractTypeAliases;
    private generateTestTemplate;
    private generateIntegrationTests;
    private generateHealthCheck;
    private generateDocumentation;
    private generateIntegrationPlan;
    private calculateReadinessScore;
    private validateSDDCompliance;
    private validateSDDPatterns;
}
