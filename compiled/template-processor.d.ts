/**
 * Template Processing Engine for SDD Code Generation
 * Converts Handlebars templates into project-specific code
 */
import type { SeamDefinition } from "./contracts.js";
export interface TemplateContext {
    componentName: string;
    contractName: string;
    pascalCaseName: string;
    camelCaseName: string;
    contractFileName: string;
    stubFileName: string;
    testFileName: string;
    purpose: string;
    dataFlow: string;
    participants: string[];
    methodName: string;
    methodDescription: string;
    agentId: string;
    inputFields: Array<{
        name: string;
        type: string;
        description: string;
    }>;
    outputFields: Array<{
        name: string;
        type: string;
        description: string;
    }>;
    blueprint: string;
    implementationHint: string;
    estimatedEffort: string;
    priority: string;
    rationale: string;
    examples: string;
    sampleInputFields: Array<{
        name: string;
        sampleValue: string;
    }>;
    dependencies: string[];
    seamDependencies: string;
    hasSeamDependencies: boolean;
    implementationSteps: Array<{
        stepTitle: string;
        estimate: string;
        tasks: Array<{
            title: string;
            time: string;
            code?: string;
            language?: string;
            description?: string;
        }>;
    }>;
    foundationEstimate: string;
    stubEstimate: string;
    coreEstimate: string;
    integrationEstimate: string;
    productionEstimate: string;
    totalEstimate: string;
    validationRules: string[];
    maxResponseTime: string;
    maxErrorRate: string;
    minAvailability: string;
    hasMetadata: boolean;
    nextComponent: string;
}
export interface GeneratedOutput {
    contractCode: string;
    stubCode: string;
    testCode: string;
    checklistMarkdown: string;
    fileName: string;
    templateContext: TemplateContext;
}
export declare class TemplateProcessor {
    private templateCache;
    private readonly templateDir;
    constructor(templateDir?: string);
    private registerHelpers;
    loadTemplate(templateName: string): Promise<HandlebarsTemplateDelegate>;
    createTemplateContext(seam: SeamDefinition): TemplateContext;
    generateFromSeam(seam: SeamDefinition): Promise<GeneratedOutput>;
    /**
     * Generate code from any template with provided context
     */
    generateFromTemplate(templateName: string, context: any): Promise<string>;
    private generateMethodName;
    private generateFieldsFromPurpose;
    private generateImplementationSteps;
    private estimateEffort;
    private determinePriority;
    private extractDependencies;
    private generateValidationRules;
    private generateSampleValue;
    private suggestNextComponent;
}
