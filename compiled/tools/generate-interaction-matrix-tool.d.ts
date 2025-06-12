/**
 * Generate Interaction Matrix MCP Tool
 * 🎯 CRITICAL: Component interaction mapping tool
 * PURPOSE: Generate interaction matrices showing component relationships
 */
import type { ContractResult, InteractionMatrix, ToolModuleContract } from "../contracts.js";
export interface GenerateInteractionMatrixTool {
    name: "generate_interaction_matrix";
    description: "Generate component interaction matrix for architecture analysis";
    inputSchema: {
        type: "object";
        properties: {
            components: {
                type: "array";
                items: {
                    type: "object";
                    properties: {
                        name: {
                            type: "string";
                        };
                        type: {
                            type: "string";
                        };
                        purpose: {
                            type: "string";
                        };
                        dependencies: {
                            type: "array";
                            items: {
                                type: "string";
                            };
                        };
                    };
                    required: ["name", "type", "purpose"];
                };
                description: "Components to analyze for interactions";
            };
            seamDefinitions: {
                type: "array";
                items: {
                    type: "object";
                    properties: {
                        name: {
                            type: "string";
                        };
                        participants: {
                            type: "array";
                            items: {
                                type: "string";
                            };
                        };
                        dataFlow: {
                            type: "string";
                            enum: ["IN", "OUT", "BOTH"];
                        };
                        purpose: {
                            type: "string";
                        };
                    };
                    required: ["name", "participants", "dataFlow", "purpose"];
                };
                description: "Existing seam definitions to include in matrix";
            };
            analysisScope: {
                type: "string";
                enum: ["full", "critical-path", "integration-points"];
                description: "Scope of interaction analysis";
            };
            includeMetrics: {
                type: "boolean";
                description: "Include complexity and coupling metrics";
            };
        };
        required: ["components"];
    };
}
/**
 * 🎯 CRITICAL: Generate interaction matrix tool handler
 * SEAM: MCP Tool Layer → Intelligence Bridge → Enhanced Seam Analyzer
 */
export declare function handleGenerateInteractionMatrix(args: unknown, intelligenceBridge: any): Promise<ContractResult<InteractionMatrix>>;
export declare const GENERATE_INTERACTION_MATRIX_TOOL_DEFINITION: GenerateInteractionMatrixTool;
export declare const TOOL_MODULE_CONTRACT: ToolModuleContract;
