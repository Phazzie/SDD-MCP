/**
 * SDD MCP Server - ValidationEngine Implementation
 * Core agent providing validation services for SDD compliance and project health
 */
import { z } from "zod";
import { ComplianceReport, ContractResult, HealthReport, PatternReport, ProjectStructure, ValidationContract } from "../contracts.js";
export declare class ValidationEngine implements ValidationContract {
    private readonly agentId;
    private sddPatterns;
    private complianceRules;
    constructor();
    validateInput(schema: z.ZodSchema, data: unknown): Promise<ContractResult<unknown>>;
    validateContract(code: string): Promise<ContractResult<ComplianceReport>>;
    validateProjectHealth(structure: ProjectStructure): Promise<ContractResult<HealthReport>>;
    validateSDDPatterns(code: string): Promise<ContractResult<PatternReport>>;
    private initializePatterns;
    private initializeRules;
    private getRequiredPatterns;
    private validateContractStructure;
    private validateTypeSafety;
    private validateErrorHandling;
    private checkSeamStatus;
    private getPatternRecommendation;
    healthCheck(): Promise<ContractResult<string>>;
}
export declare const validationEngine: ValidationEngine;
