/**
 * SDD MCP Server - TemplateProcessor Implementation
 * Core agent providing template processing services for SDD code generation
 */
import { ContractResult, TemplateData, TemplateProcessorContract } from "../contracts.js";
export declare class TemplateProcessor implements TemplateProcessorContract {
    private readonly agentId;
    private templateCache;
    private compiledCache;
    private templateEngine;
    constructor();
    loadTemplate(templateType: "contract" | "stub" | "seam"): Promise<ContractResult<string>>;
    processTemplate(template: string, data: TemplateData): Promise<ContractResult<string>>;
    validateTemplate(template: string): Promise<ContractResult<boolean>>;
    reloadTemplates(): Promise<ContractResult<void>>;
    private initializeTemplateEngine;
    private processSimpleTemplate;
    private replaceNestedPlaceholders;
    private formatValue;
    private validateTemplateSyntax;
    healthCheck(): Promise<ContractResult<string>>;
}
export declare const templateProcessor: TemplateProcessor;
