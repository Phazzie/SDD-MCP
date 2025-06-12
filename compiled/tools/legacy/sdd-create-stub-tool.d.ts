/**
 * SDD Create Stub Tool - Legacy Modernization
 * 🎯 PURPOSE: Generate SDD-compliant code stubs from contract definitions
 * 🔄 REFACTOR: Complete rewrite using ToolModuleContract pattern
 * 📅 CREATED: June 6, 2025 - Phase C.1
 */
import type { ContractResult, CreateStubOutput, ToolDefinition, ToolModuleContract } from "../../contracts.js";
import { // Import as value/type as needed
LegacyToolModernizationContract } from "../../contracts.js";
/**
 * 🎯 SDD Create Stub Tool Implementation
 * DESIGN PATTERN: ToolModuleContract + LegacyToolModernizationContract
 * PURPOSE: Transform contract definitions into SDD-compliant implementation stubs
 */
export declare class SDDCreateStubTool implements LegacyToolModernizationContract {
    originalTool: string;
    modernizedTool: string;
    migrationNotes: string[];
    private readonly agentId;
    private readonly version;
    getToolInfo(): {
        name: string;
        version: string;
        description: string;
        category: "generator";
        compatibilityLevel: "enhanced";
    };
    validateInput(input: unknown): ContractResult<boolean>;
    execute(input: unknown): Promise<ContractResult<CreateStubOutput>>;
    private processContractDefinition;
    private generateStubCode;
    private generateFilePathSuggestion;
    private estimateImplementationEffort;
    getUsageExamples(): {
        basic: {
            input: {
                interfaceName: string;
                methods: {
                    name: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    returnType: string;
                    isAsync: boolean;
                    description: string;
                }[];
                targetLanguage: string;
            };
            expectedOutput: {
                stubCode: string;
                filePathSuggestion: string;
                blueprintCommentsCount: number;
                contractCompliance: {
                    hasContractResultPattern: boolean;
                    hasNotImplementedErrors: boolean;
                    hasBlueprintComments: boolean;
                    complianceScore: number;
                };
            };
        };
        advanced: {
            input: {
                interfaceName: string;
                methods: {
                    name: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    returnType: string;
                    isAsync: boolean;
                }[];
                dataStructures: {
                    name: string;
                    properties: {
                        name: string;
                        type: string;
                    }[];
                }[];
                namespace: string;
                targetLanguage: string;
            };
            expectedOutput: {
                stubCode: string;
                filePathSuggestion: string;
                blueprintCommentsCount: number;
            };
        };
        errorCase: {
            input: {
                interfaceName: string;
                methods: never[];
            };
            expectedError: string;
        };
    };
    getToolDefinition(): ToolDefinition;
}
export declare const TOOL_MODULE_CONTRACT: ToolModuleContract;
export default TOOL_MODULE_CONTRACT;
/**
 * 🎯 IMPLEMENTATION NOTES FOR GEMINI:
 *
 * This stub provides the complete structure for a modernized sdd_create_stub tool.
 * Key implementation areas marked with NotImplementedError:
 *
 * 1. processContractDefinition(): Validate and process contract structure
 * 2. generateStubCode(): Apply templates to generate TypeScript stubs
 * 3. addBlueprintComments(): Enhance code with SDD blueprint comments
 *
 * The tool follows the ToolModuleContract pattern and includes:
 * ✅ Comprehensive Zod input/output schemas
 * ✅ Proper error handling with ContractResult<T>
 * ✅ SDD seam identification and documentation
 * ✅ Usage examples for testing and documentation
 * ✅ Backward compatibility exports
 *
 * When implementing, focus on:
 * - Template-based code generation with Handlebars or similar
 * - SDD-compliant patterns (ContractResult<T>, NotImplementedError, blueprint comments)
 * - Proper TypeScript syntax generation
 * - File path and naming conventions
 */
