/**
 * Enhanced Seam Analysis MCP Tool
 * 💰 HIGH_ROI: Core seam identification tool connecting MCP layer to Enhanced Analyzer
 * PURPOSE: Expose enhanced seam analysis capabilities through MCP interface
 */
import { z } from "zod";
// 🛡️ DEFENSIVE: Input validation schema
const SeamAnalysisInputSchema = z.object({
    requirementsText: z
        .string()
        .min(10, "Requirements text must be at least 10 characters"),
    designNotes: z.string().optional(),
    analysisDepth: z
        .enum(["basic", "detailed", "comprehensive"])
        .default("detailed"),
    focusAreas: z
        .array(z.enum([
        "data_flows",
        "integrations",
        "dependencies",
        "cross_cutting_concerns",
    ]))
        .optional(),
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
            error: `Validation failed for ${toolName}: ${error instanceof Error ? error.message : String(error)}`,
            metadata: {
                toolName,
                seamName,
                timestamp: new Date().toISOString(),
            },
        };
    }
}
/**
 * 🎯 CRITICAL: Enhanced seam analysis tool handler
 * SEAM: MCP Tool Layer → Intelligence Bridge → Enhanced Seam Analyzer
 */
export async function handleEnhancedSeamAnalysis(args, intelligenceBridge // Will be properly typed when bridge is implemented
) {
    // 🛡️ DEFENSIVE: Validate input at seam boundary
    const validationResult = validateSeamInput(args, SeamAnalysisInputSchema, "EnhancedSeamAnalysisTool", "enhanced_seam_analysis");
    if (!validationResult.success) {
        return validationResult;
    }
    const input = validationResult.data;
    try {
        // 🔌 INTEGRATION: Route through intelligence bridge to Enhanced Analyzer
        return await intelligenceBridge.routeToEnhancedAnalyzer("analyzeRequirementsEnhanced", input);
    }
    catch (error) {
        // 🛡️ DEFENSIVE: Standardized error object using SDDError
        return {
            success: false,
            error: new SDDError("EnhancedSeamAnalysisTool", "enhanced_seam_analysis", error instanceof Error ? error.message : String(error), {
                agentId: "EnhancedSeamAnalysisTool",
                seamName: "enhanced_seam_analysis",
                timestamp: new Date().toISOString(),
            }).toString(),
            metadata: {
                agentId: "EnhancedSeamAnalysisTool",
                seamName: "enhanced_seam_analysis",
                timestamp: new Date().toISOString(),
            },
        };
    }
}
export const ENHANCED_SEAM_ANALYSIS_TOOL_DEFINITION = {
    name: "enhanced_seam_analysis",
    description: "Analyze requirements using enhanced pattern recognition and AI-powered seam identification",
    inputSchema: {
        type: "object",
        properties: {
            requirementsText: {
                type: "string",
                description: "Requirements or PRD text to analyze",
            },
            designNotes: {
                type: "string",
                description: "Optional design notes or constraints",
            },
            analysisDepth: {
                type: "string",
                enum: ["basic", "detailed", "comprehensive"],
                description: "Depth of analysis to perform",
            },
            focusAreas: {
                type: "array",
                items: {
                    type: "string",
                    enum: [
                        "data_flows",
                        "integrations",
                        "dependencies",
                        "cross_cutting_concerns",
                    ],
                },
                description: "Areas to focus analysis on",
            },
        },
        required: ["requirementsText"],
    },
};
// 🔌 INTEGRATION: Tool Registry Contract Export - Using simplified adapter pattern for compatibility
export const TOOL_MODULE_CONTRACT = {
    definition: {
        name: "enhanced_seam_analysis",
        description: "Analyze requirements using enhanced pattern recognition and AI-powered seam identification",
        inputSchema: {
            type: "object",
            properties: {
                requirementsText: {
                    type: "string",
                    description: "Requirements or PRD text to analyze",
                },
                designNotes: {
                    type: "string",
                    description: "Optional design notes or constraints",
                },
                analysisDepth: {
                    type: "string",
                    enum: ["basic", "detailed", "comprehensive"],
                    description: "Depth of analysis to perform",
                },
                focusAreas: {
                    type: "array",
                    items: {
                        type: "string",
                        enum: [
                            "data_flows",
                            "integrations",
                            "dependencies",
                            "cross_cutting_concerns",
                        ],
                    },
                    description: "Areas to focus analysis on",
                },
            },
            required: ["requirementsText"],
        },
        outputSchema: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                data: {
                    type: "object",
                    description: "Enhanced seam analysis results",
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
        return handleEnhancedSeamAnalysis(args, mcpIntelligenceBridge);
    },
    metadata: {
        name: "enhanced-seam-analysis-tool",
        version: "1.0.0",
        dependencies: ["intelligence-bridge"],
        tags: ["seam-analysis", "ai-enhanced", "pattern-recognition"],
    },
};
//# sourceMappingURL=enhanced-seam-analysis-tool.js.map