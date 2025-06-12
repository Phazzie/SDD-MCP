/**
 * SDD Analyzer Agent - Simple Implementation
 * Works with existing synchronous contract design
 */
import { ContractGenerationResult, ContractResult, ProjectStructure, SDDFunctionContract, SeamDefinition, StubGenerationResult, ValidationReport } from "../contracts.js";
export declare class SDDAnalyzer implements SDDFunctionContract {
    private readonly agentId;
    analyzeRequirements(prd: string): ContractResult<SeamDefinition[]>;
    generateContract(seam: SeamDefinition): ContractResult<ContractGenerationResult>;
    createStub(contract: ContractGenerationResult): ContractResult<StubGenerationResult>;
    orchestrateWorkflow(prd: string): ContractResult<ProjectStructure>;
    validateProject(structure: ProjectStructure): ContractResult<ValidationReport>;
}
