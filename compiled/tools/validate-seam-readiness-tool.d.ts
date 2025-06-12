/**
 * Validate Seam Readiness MCP Tool
 * ⚡ QUICK_WIN: Seam validation tool for implementation readiness
 * PURPOSE: Validate seam definitions before contract generation
 */
import type { ContractResult, SeamValidationResult, ToolModuleContract } from "../contracts.js";
export interface ValidateSeamReadinessTool {
    name: "validate_seam_readiness";
    description: "Validate seam definitions for contract generation readiness";
    inputSchema: {
        type: "object";
        properties: {
            seamDefinitions: {
                type: "array";
                items: {
                    type: "object";
                    properties: {
                        name: {
                            type: "string";
                        };
                        description: {
                            type: "string";
                        };
                        sourceComponent: {
                            type: "string";
                        };
                        targetComponent: {
                            type: "string";
                        };
                        inputType: {
                            type: "string";
                        };
                        outputType: {
                            type: "string";
                        };
                        errorScenarios: {
                            type: "array";
                            items: {
                                type: "string";
                            };
                        };
                    };
                    required: [
                        "name",
                        "description",
                        "sourceComponent",
                        "targetComponent"
                    ];
                };
                description: "Seam definitions to validate for readiness";
            };
            validationLevel: {
                type: "string";
                enum: ["basic", "comprehensive", "critical-only"];
                description: "Level of validation to perform";
            };
            strictMode: {
                type: "boolean";
                description: "Enable strict validation requiring all optional fields";
            };
            checkDependencies: {
                type: "boolean";
                description: "Validate seam dependencies and prerequisites";
            };
        };
        required: ["seamDefinitions"];
    };
}
/**
 * ⚡ QUICK_WIN: Validate seam readiness tool handler
 * SEAM: MCP Tool Layer → Intelligence Bridge → Enhanced Seam Analyzer
 */
export declare function handleValidateSeamReadiness(args: unknown, intelligenceBridge: any): Promise<ContractResult<SeamValidationResult>>;
export declare const VALIDATE_SEAM_READINESS_TOOL_DEFINITION: ValidateSeamReadinessTool;
export declare const TOOL_MODULE_CONTRACT: ToolModuleContract;
