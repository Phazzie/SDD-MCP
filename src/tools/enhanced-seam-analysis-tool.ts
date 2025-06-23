/**
 * Enhanced Seam Analysis MCP Tool
 * 💰 HIGH_ROI: Core seam identification tool connecting MCP layer to Enhanced Analyzer
 * PURPOSE: Expose enhanced seam analysis capabilities through MCP interface
 */

import { z } from "zod";
import type {
  ContractResult,
  RequirementsAnalysisOutput,
  SeamDefinition,
  ToolModuleContract,
} from "../contracts.js";

export interface EnhancedSeamAnalysisTool {
  name: "enhanced_seam_analysis";
  description: "Analyze requirements using enhanced pattern recognition and AI-powered seam identification";
  inputSchema: {
    type: "object";
    properties: {
      requirementsText: {
        type: "string";
        description: "Requirements or PRD text to analyze";
      };
      designNotes?: {
        type: "string";
        description: "Optional design notes or constraints";
      };
      analysisDepth: {
        type: "string";
        enum: ["basic", "detailed", "comprehensive"];
        description: "Depth of analysis to perform";
      };
      focusAreas: {
        type: "array";
        items: {
          type: "string";
          enum: [
            "data_flows",
            "integrations",
            "dependencies",
            "cross_cutting_concerns"
          ];
        };
        description: "Areas to focus analysis on";
      };
    };
    required: ["requirementsText"];
  };
}

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
    .array(
      z.enum([
        "data_flows",
        "integrations",
        "dependencies",
        "cross_cutting_concerns",
      ])
    )
    .optional(),
});

// 🛡️ DEFENSIVE: Input validation function
function validateSeamInput(
  args: unknown,
  schema: z.ZodSchema,
  toolName: string,
  seamName: string
): ContractResult<any> {
  try {
    const data = schema.parse(args);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: `Validation failed for ${toolName}: ${
        error instanceof Error ? error.message : String(error)
      }`,
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
export async function handleEnhancedSeamAnalysis(
  args: unknown,
  intelligenceBridge?: any // Optional until bridge is implemented
): Promise<ContractResult<RequirementsAnalysisOutput>> {
  // 🛡️ DEFENSIVE: Validate input at seam boundary
  const validationResult = validateSeamInput(
    args,
    SeamAnalysisInputSchema,
    "EnhancedSeamAnalysisTool",
    "enhanced_seam_analysis"
  );

  if (!validationResult.success) {
    return validationResult as ContractResult<RequirementsAnalysisOutput>;
  }

  const input = validationResult.data!;

  try {
    // 🔌 INTEGRATION: Route through intelligence bridge if available, otherwise use basic analysis
    if (intelligenceBridge) {
      return await intelligenceBridge.routeToEnhancedAnalyzer(
        "analyzeRequirementsEnhanced",
        input
      );
    } else {
      // 🎯 FALLBACK: Basic enhanced analysis (until intelligence bridge is implemented)
      const basicEnhancedAnalysis = createBasicEnhancedAnalysis(input);
      return {
        success: true,
        data: basicEnhancedAnalysis,
        metadata: {
          agentId: "EnhancedSeamAnalysisTool",
          seamName: "enhanced_seam_analysis",
          timestamp: new Date().toISOString(),
          fallbackMode: true,
        },
      };
    }
  } catch (error) {
    // 🛡️ DEFENSIVE: Standardized error handling
    return {
      success: false,
      error: `Enhanced seam analysis failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
      metadata: {
        agentId: "EnhancedSeamAnalysisTool",
        seamName: "enhanced_seam_analysis",
        timestamp: new Date().toISOString(),
      },
    };
  }
}

export const ENHANCED_SEAM_ANALYSIS_TOOL_DEFINITION: EnhancedSeamAnalysisTool =
  {
    name: "enhanced_seam_analysis",
    description:
      "Analyze requirements using enhanced pattern recognition and AI-powered seam identification",
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

// 🔌 INTEGRATION: Tool Registry Contract Export
export const TOOL_MODULE_CONTRACT: ToolModuleContract = {
  toolDefinition: {
    name: "enhanced_seam_analysis",
    description:
      "Analyze requirements using enhanced pattern recognition and AI-powered seam identification",
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
  execute: async (args: any): Promise<ContractResult<any>> => {
    return handleEnhancedSeamAnalysis(args);
  },
};

// 🎯 FALLBACK: Basic enhanced analysis implementation
function createBasicEnhancedAnalysis(input: any): RequirementsAnalysisOutput {
  const { requirementsText, analysisDepth = "detailed" } = input;

  // Basic seam identification (enhanced version of legacy algorithm)
  const seams = identifySeamsFromText(requirementsText);

  return {
    seams: seams,
    components: seams.map((seam) => ({
      name: seam.participants[0],
      type: "service",
      purpose: seam.purpose,
      dependencies: seam.participants.slice(1),
    })),
    architecture: {
      overview: `Enhanced analysis identified ${seams.length} seams for ${analysisDepth} implementation`,
      keyPatterns: [
        "ContractResult<T>",
        "Seam-driven architecture",
        "Enhanced pattern recognition",
      ],
      risks: ["Integration complexity", "Seam boundary validation needed"],
      recommendations: [
        "Enhanced analysis: Review identified seams for completeness",
        "Enhanced analysis: Validate seam boundaries with domain experts",
        "Enhanced analysis: Consider confidence scores when prioritizing implementation",
      ],
    },
  };
}

// 🔧 UTILITY: Basic seam identification from text
function identifySeamsFromText(text: string): SeamDefinition[] {
  const basicSeams: SeamDefinition[] = [];

  // Enhanced pattern matching (better than legacy version)
  if (text.toLowerCase().includes("auth")) {
    basicSeams.push({
      name: "AuthenticationSeam",
      participants: ["User", "AuthService"],
      dataFlow: "BOTH" as const,
      purpose: "Handle user authentication and authorization",
      contractInterface:
        "interface AuthContract { authenticate(credentials: UserCredentials): Promise<ContractResult<AuthToken>>; }",
    });
  }

  if (text.toLowerCase().includes("user")) {
    basicSeams.push({
      name: "UserManagementSeam",
      participants: ["UserService", "Database"],
      dataFlow: "BOTH" as const,
      purpose: "Manage user data and profiles",
      contractInterface:
        "interface UserContract { getUser(id: string): Promise<ContractResult<User>>; }",
    });
  }

  if (text.toLowerCase().includes("password")) {
    basicSeams.push({
      name: "PasswordResetSeam",
      participants: ["PasswordService", "EmailService"],
      dataFlow: "OUT" as const,
      purpose: "Handle password reset functionality",
      contractInterface:
        "interface PasswordContract { resetPassword(email: string): Promise<ContractResult<boolean>>; }",
    });
  }

  return basicSeams;
}
