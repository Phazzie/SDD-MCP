/**
 * Enhanced Seam Analysis MCP Tool
 * 💰 HIGH_ROI: Core seam identification tool connecting MCP layer to Enhanced Analyzer
 * PURPOSE: Expose enhanced seam analysis capabilities through MCP interface
 */

import type {
  SeamAnalysisInput,
  EnhancedSeamAnalysis,
  ContractResult,
} from "../contracts.js";
import { validateSeamInput } from "../contracts.js";
import { z } from "zod";

export interface EnhancedSeamAnalysisTool {
  name: "enhanced_seam_analysis";
  description: "Analyze requirements using enhanced pattern recognition and AI-powered seam identification";
  inputSchema: {
    type: "object";
    properties: {
      requirementsText: { type: "string"; description: "Requirements or PRD text to analyze" };
      designNotes?: { type: "string"; description: "Optional design notes or constraints" };
      analysisDepth: { 
        type: "string"; 
        enum: ["basic", "detailed", "comprehensive"];
        description: "Depth of analysis to perform" 
      };
      focusAreas: {
        type: "array";
        items: {
          type: "string";
          enum: ["data_flows", "integrations", "dependencies", "cross_cutting_concerns"];
        };
        description: "Areas to focus analysis on";
      };
    };
    required: ["requirementsText"];
  };
}

// 🛡️ DEFENSIVE: Input validation schema
const SeamAnalysisInputSchema = z.object({
  requirementsText: z.string().min(10, "Requirements text must be at least 10 characters"),
  designNotes: z.string().optional(),
  analysisDepth: z.enum(["basic", "detailed", "comprehensive"]).default("detailed"),
  focusAreas: z.array(z.enum(["data_flows", "integrations", "dependencies", "cross_cutting_concerns"])).optional(),
});

/**
 * 🎯 CRITICAL: Enhanced seam analysis tool handler
 * SEAM: MCP Tool Layer → Intelligence Bridge → Enhanced Seam Analyzer
 */
export async function handleEnhancedSeamAnalysis(
  args: unknown,
  intelligenceBridge: any // Will be properly typed when bridge is implemented
): Promise<ContractResult<EnhancedSeamAnalysis>> {
  // 🛡️ DEFENSIVE: Validate input at seam boundary
  const validationResult = validateSeamInput(
    args,
    SeamAnalysisInputSchema,
    "EnhancedSeamAnalysisTool",
    "enhanced_seam_analysis"
  );

  if (!validationResult.success) {
    return validationResult as ContractResult<EnhancedSeamAnalysis>;
  }

  const input = validationResult.data!;

  try {
    // 🔌 INTEGRATION: Route through intelligence bridge to Enhanced Analyzer
    return await intelligenceBridge.routeToEnhancedAnalyzer(
      "analyzeRequirementsEnhanced",
      input
    );
  } catch (error) {
    return {
      success: false,
      error: {
        category: "ProcessingError",
        message: `Enhanced seam analysis failed: ${error instanceof Error ? error.message : String(error)}`,
        agentId: "EnhancedSeamAnalysisTool",
        seamName: "enhanced_seam_analysis",
        timestamp: new Date().toISOString(),
      },
      metadata: {
        agentId: "EnhancedSeamAnalysisTool",
        seamName: "enhanced_seam_analysis",
        timestamp: new Date().toISOString(),
      },
    };
  }
}

export const ENHANCED_SEAM_ANALYSIS_TOOL_DEFINITION: EnhancedSeamAnalysisTool = {
  name: "enhanced_seam_analysis",
  description: "Analyze requirements using enhanced pattern recognition and AI-powered seam identification",
  inputSchema: {
    type: "object",
    properties: {
      requirementsText: { 
        type: "string", 
        description: "Requirements or PRD text to analyze" 
      },
      designNotes: { 
        type: "string", 
        description: "Optional design notes or constraints" 
      },
      analysisDepth: { 
        type: "string", 
        enum: ["basic", "detailed", "comprehensive"],
        description: "Depth of analysis to perform" 
      },
      focusAreas: {
        type: "array",
        items: {
          type: "string",
          enum: ["data_flows", "integrations", "dependencies", "cross_cutting_concerns"],
        },
        description: "Areas to focus analysis on",
      },
    },
    required: ["requirementsText"],
  },
};
