/**
 * Generate Interaction Matrix MCP Tool
 * 🎯 CRITICAL: Component interaction mapping tool
 * PURPOSE: Generate interaction matrices showing component relationships
 */

import { z } from "zod";
import type {
  ContractResult,
  InteractionMatrix,
  ToolModuleContract,
} from "../contracts.js";

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
            name: { type: "string" };
            type: { type: "string" };
            purpose: { type: "string" };
            dependencies: { type: "array"; items: { type: "string" } };
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
            name: { type: "string" };
            participants: { type: "array"; items: { type: "string" } };
            dataFlow: { type: "string"; enum: ["IN", "OUT", "BOTH"] };
            purpose: { type: "string" };
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

// 🛡️ DEFENSIVE: Input validation schema
const InteractionMatrixInputSchema = z.object({
  components: z
    .array(
      z.object({
        name: z.string().min(1, "Component name is required"),
        type: z.string().min(1, "Component type is required"),
        purpose: z.string().min(1, "Component purpose is required"),
        dependencies: z.array(z.string()).optional().default([]),
      })
    )
    .min(1, "At least one component is required"),
  seamDefinitions: z
    .array(
      z.object({
        name: z.string(),
        participants: z.array(z.string()),
        dataFlow: z.enum(["IN", "OUT", "BOTH"]),
        purpose: z.string(),
      })
    )
    .optional()
    .default([]),
  analysisScope: z
    .enum(["full", "critical-path", "integration-points"])
    .default("full"),
  includeMetrics: z.boolean().default(false),
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
 * 🎯 CRITICAL: Generate interaction matrix tool handler
 * SEAM: MCP Tool Layer → Intelligence Bridge → Enhanced Seam Analyzer
 */
export async function handleGenerateInteractionMatrix(
  args: unknown,
  intelligenceBridge: any // Will be properly typed when bridge is implemented
): Promise<ContractResult<InteractionMatrix>> {
  // 🛡️ DEFENSIVE: Validate input at seam boundary
  const validationResult = validateSeamInput(
    args,
    InteractionMatrixInputSchema,
    "GenerateInteractionMatrixTool",
    "generate_interaction_matrix"
  );

  if (!validationResult.success) {
    return validationResult as ContractResult<InteractionMatrix>;
  }

  const input = validationResult.data!;

  try {
    // 🔌 INTEGRATION: Route through intelligence bridge to Enhanced Analyzer
    return await intelligenceBridge.routeToEnhancedAnalyzer(
      "generateInteractionMatrix",
      input
    );
  } catch (error) {
    return {
      success: false,
      error: `Interaction matrix generation failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
      metadata: {
        agentId: "GenerateInteractionMatrixTool",
        seamName: "generate_interaction_matrix",
        timestamp: new Date().toISOString(),
      },
    };
  }
}

export const GENERATE_INTERACTION_MATRIX_TOOL_DEFINITION: GenerateInteractionMatrixTool =
  {
    name: "generate_interaction_matrix",
    description:
      "Generate component interaction matrix for architecture analysis",
    inputSchema: {
      type: "object",
      properties: {
        components: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              type: { type: "string" },
              purpose: { type: "string" },
              dependencies: { type: "array", items: { type: "string" } },
            },
            required: ["name", "type", "purpose"],
          },
          description: "Components to analyze for interactions",
        },
        seamDefinitions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              participants: { type: "array", items: { type: "string" } },
              dataFlow: { type: "string", enum: ["IN", "OUT", "BOTH"] },
              purpose: { type: "string" },
            },
            required: ["name", "participants", "dataFlow", "purpose"],
          },
          description: "Existing seam definitions to include in matrix",
        },
        analysisScope: {
          type: "string",
          enum: ["full", "critical-path", "integration-points"],
          description: "Scope of interaction analysis",
        },
        includeMetrics: {
          type: "boolean",
          description: "Include complexity and coupling metrics",
        },
      },
      required: ["components"],
    },
  };

// 🔌 INTEGRATION: Tool Registry Contract Export
export const TOOL_MODULE_CONTRACT: ToolModuleContract = {
  definition: {
    name: "generate_interaction_matrix",
    description:
      "Generate component interaction matrix for architecture analysis",
    inputSchema: {
      type: "object",
      properties: {
        components: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              type: { type: "string" },
              purpose: { type: "string" },
              dependencies: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["name", "type", "purpose"],
          },
          description: "Components to analyze for interactions",
        },
        seamDefinitions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              participants: {
                type: "array",
                items: { type: "string" },
              },
              dataFlow: { type: "string", enum: ["IN", "OUT", "BOTH"] },
              purpose: { type: "string" },
            },
            required: ["name", "participants", "dataFlow", "purpose"],
          },
          description: "Existing seam definitions to include in matrix",
        },
        analysisScope: {
          type: "string",
          enum: ["full", "critical-path", "integration-points"],
          description: "Scope of interaction analysis",
        },
        includeMetrics: {
          type: "boolean",
          description: "Include complexity and coupling metrics",
        },
      },
      required: ["components"],
    },
    outputSchema: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        data: {
          type: "object",
          description: "Component interaction matrix results",
        },
        error: { type: "string" },
        metadata: { type: "object" },
      },
      required: ["success"],
    },
  },
  handler: async (args: any): Promise<ContractResult<any>> => {
    // � INTEGRATION: Use real intelligence bridge instead of mock
    const { mcpIntelligenceBridge } = await import(
      "../agents/mcp-intelligence-bridge.js"
    );
    return handleGenerateInteractionMatrix(args, mcpIntelligenceBridge);
  },
  metadata: {
    name: "generate-interaction-matrix-tool",
    version: "1.0.0",
    dependencies: ["intelligence-bridge"],
    tags: ["interaction-matrix", "component-analysis", "architecture"],
  },
};
