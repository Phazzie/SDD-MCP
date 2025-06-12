/**
 * Validate Seam Readiness MCP Tool
 * ⚡ QUICK_WIN: Seam validation tool for implementation readiness
 * PURPOSE: Validate seam definitions before contract generation
 */
import { z } from "zod";
import { SDDError } from "../contracts.js";
// 🛡️ DEFENSIVE: Input validation schema
const SeamValidationInputSchema = z.object({
    seamDefinitions: z
        .array(z.object({
        name: z.string().min(1, "Seam name is required"),
        description: z
            .string()
            .min(10, "Seam description must be at least 10 characters"),
        sourceComponent: z.string().min(1, "Source component is required"),
        targetComponent: z.string().min(1, "Target component is required"),
        inputType: z.string().optional(),
        outputType: z.string().optional(),
        errorScenarios: z.array(z.string()).optional().default([]),
    }))
        .min(1, "At least one seam definition is required"),
    validationLevel: z
        .enum(["basic", "comprehensive", "critical-only"])
        .default("comprehensive"),
    strictMode: z.boolean().default(false),
    checkDependencies: z.boolean().default(true),
});
// 🛡️ DEFENSIVE: Input validation function
function validateSeamInput(args, schema, toolName, seamName) {
    try {
        const data = schema.parse(args);
        return { success: true, data };
    }
    catch (error) {
        return {
            success: false,
            error: new SDDError(`Validation failed for ${toolName}: ${error instanceof Error ? error.message : String(error)}`, {
                toolName,
                seamName,
                timestamp: new Date().toISOString(),
            }).message,
            metadata: {
                toolName,
                seamName,
                timestamp: new Date().toISOString(),
            },
        };
    }
}
/**
 * ⚡ QUICK_WIN: Validate seam readiness tool handler
 * SEAM: MCP Tool Layer → Intelligence Bridge → Enhanced Seam Analyzer
 */
export async function handleValidateSeamReadiness(args, intelligenceBridge // Will be properly typed when bridge is implemented
) {
    // 🛡️ DEFENSIVE: Validate input at seam boundary
    const validationResult = validateSeamInput(args, SeamValidationInputSchema, "ValidateSeamReadinessTool", "validate_seam_readiness");
    if (!validationResult.success) {
        return validationResult;
    }
    const input = validationResult.data;
    try {
        // 🔌 INTEGRATION: Route through intelligence bridge to Enhanced Analyzer
        return await intelligenceBridge.routeToEnhancedAnalyzer("validateSeamReadiness", input);
    }
    catch (error) {
        return {
            success: false,
            error: `Seam readiness validation failed: ${error instanceof Error ? error.message : String(error)}`,
            metadata: {
                agentId: "ValidateSeamReadinessTool",
                seamName: "validate_seam_readiness",
                timestamp: new Date().toISOString(),
            },
        };
    }
}
export const VALIDATE_SEAM_READINESS_TOOL_DEFINITION = {
    name: "validate_seam_readiness",
    description: "Validate seam definitions for contract generation readiness",
    inputSchema: {
        type: "object",
        properties: {
            seamDefinitions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        sourceComponent: { type: "string" },
                        targetComponent: { type: "string" },
                        inputType: { type: "string" },
                        outputType: { type: "string" },
                        errorScenarios: { type: "array", items: { type: "string" } },
                    },
                    required: [
                        "name",
                        "description",
                        "sourceComponent",
                        "targetComponent",
                    ],
                },
                description: "Seam definitions to validate for readiness",
            },
            validationLevel: {
                type: "string",
                enum: ["basic", "comprehensive", "critical-only"],
                description: "Level of validation to perform",
            },
            strictMode: {
                type: "boolean",
                description: "Enable strict validation requiring all optional fields",
            },
            checkDependencies: {
                type: "boolean",
                description: "Validate seam dependencies and prerequisites",
            },
        },
        required: ["seamDefinitions"],
    },
};
// 🔌 INTEGRATION: Tool Registry Contract Export
export const TOOL_MODULE_CONTRACT = {
    definition: {
        name: "validate_seam_readiness",
        description: "Validate seam definitions for contract generation readiness",
        inputSchema: {
            type: "object",
            properties: {
                seamDefinitions: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            description: { type: "string" },
                            sourceComponent: { type: "string" },
                            targetComponent: { type: "string" },
                            inputType: { type: "string" },
                            outputType: { type: "string" },
                            errorScenarios: {
                                type: "array",
                                items: { type: "string" },
                            },
                        },
                        required: [
                            "name",
                            "description",
                            "sourceComponent",
                            "targetComponent",
                        ],
                    },
                    description: "Seam definitions to validate for readiness",
                },
                validationLevel: {
                    type: "string",
                    enum: ["basic", "comprehensive", "critical-only"],
                    description: "Level of validation to perform",
                },
                strictMode: {
                    type: "boolean",
                    description: "Enable strict validation requiring all optional fields",
                },
                checkDependencies: {
                    type: "boolean",
                    description: "Validate seam dependencies and prerequisites",
                },
            },
            required: ["seamDefinitions"],
        },
        outputSchema: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                data: {
                    type: "object",
                    description: "Seam validation results",
                },
                error: { type: "string" },
                metadata: { type: "object" },
            },
            required: ["success"],
        },
    },
    handler: async (args) => {
        // � INTEGRATION: Use real intelligence bridge instead of mock
        const { mcpIntelligenceBridge } = await import("../agents/mcp-intelligence-bridge.js");
        return handleValidateSeamReadiness(args, mcpIntelligenceBridge);
    },
    metadata: {
        name: "validate-seam-readiness-tool",
        version: "1.0.0",
        dependencies: ["intelligence-bridge"],
        tags: ["seam-validation", "readiness-check", "sdd-validation"],
    },
};
//# sourceMappingURL=validate-seam-readiness-tool.js.map