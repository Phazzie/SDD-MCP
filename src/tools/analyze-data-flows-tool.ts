/**
 * Analyze Data Flows MCP Tool
 * 💰 HIGH_ROI: Data flow analysis and bottleneck identification tool
 * PURPOSE: Analyze data transformations and identify optimization opportunities
 */

import type {
  DataFlowAnalysisInput,
  DataFlowAnalysis,
  ContractResult,
} from "../contracts.js";
import { validateSeamInput } from "../contracts.js";
import { z } from "zod";

export interface AnalyzeDataFlowsTool {
  name: "analyze_data_flows";
  description: "Analyze data flows between components and identify potential bottlenecks";
  inputSchema: {
    type: "object";
    properties: {
      seamDefinitions: {
        type: "array";
        items: {
          type: "object";
          properties: {
            name: { type: "string" };
            source: { type: "string" };
            target: { type: "string" };
            dataFlow: { type: "string"; enum: ["IN", "OUT", "BOTH"] };
            inputType: { type: "string" };
            outputType: { type: "string" };
          };
          required: ["name", "source", "target", "dataFlow"];
        };
        description: "Seam definitions to analyze for data flows";
      };
      performanceRequirements: {
        type: "object";
        properties: {
          maxLatency: { type: "number"; description: "Maximum acceptable latency in ms" };
          minThroughput: { type: "number"; description: "Minimum required throughput" };
          memoryConstraints: { type: "string"; description: "Memory usage constraints" };
        };
        description: "Performance requirements and constraints";
      };
      includeOptimizations: {
        type: "boolean";
        description: "Include optimization recommendations in analysis";
      };
      analyzeBottlenecks: {
        type: "boolean";
        description: "Perform bottleneck analysis on data flows";
      };
    };
    required: ["seamDefinitions"];
  };
}

// 🛡️ DEFENSIVE: Input validation schema
const DataFlowAnalysisInputSchema = z.object({
  seamDefinitions: z.array(z.object({
    name: z.string().min(1, "Seam name is required"),
    source: z.string().min(1, "Source component is required"),
    target: z.string().min(1, "Target component is required"),
    dataFlow: z.enum(["IN", "OUT", "BOTH"]),
    inputType: z.string().optional(),
    outputType: z.string().optional(),
  })).min(1, "At least one seam definition is required"),
  performanceRequirements: z.object({
    maxLatency: z.number().positive().optional(),
    minThroughput: z.number().positive().optional(),
    memoryConstraints: z.string().optional(),
  }).optional(),
  includeOptimizations: z.boolean().default(true),
  analyzeBottlenecks: z.boolean().default(true),
});

/**
 * 💰 HIGH_ROI: Analyze data flows tool handler
 * SEAM: MCP Tool Layer → Intelligence Bridge → Enhanced Seam Analyzer
 */
export async function handleAnalyzeDataFlows(
  args: unknown,
  intelligenceBridge: any // Will be properly typed when bridge is implemented
): Promise<ContractResult<DataFlowAnalysis>> {
  // 🛡️ DEFENSIVE: Validate input at seam boundary
  const validationResult = validateSeamInput(
    args,
    DataFlowAnalysisInputSchema,
    "AnalyzeDataFlowsTool",
    "analyze_data_flows"
  );

  if (!validationResult.success) {
    return validationResult as ContractResult<DataFlowAnalysis>;
  }

  const input = validationResult.data!;

  try {
    // 🔌 INTEGRATION: Route through intelligence bridge to Enhanced Analyzer
    return await intelligenceBridge.routeToEnhancedAnalyzer(
      "analyzeDataFlows",
      input
    );
  } catch (error) {
    return {
      success: false,
      error: {
        category: "ProcessingError",
        message: `Data flow analysis failed: ${error instanceof Error ? error.message : String(error)}`,
        agentId: "AnalyzeDataFlowsTool",
        seamName: "analyze_data_flows",
        timestamp: new Date().toISOString(),
      },
      metadata: {
        agentId: "AnalyzeDataFlowsTool",
        seamName: "analyze_data_flows",
        timestamp: new Date().toISOString(),
      },
    };
  }
}

export const ANALYZE_DATA_FLOWS_TOOL_DEFINITION: AnalyzeDataFlowsTool = {
  name: "analyze_data_flows",
  description: "Analyze data flows between components and identify potential bottlenecks",
  inputSchema: {
    type: "object",
    properties: {
      seamDefinitions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            source: { type: "string" },
            target: { type: "string" },
            dataFlow: { type: "string", enum: ["IN", "OUT", "BOTH"] },
            inputType: { type: "string" },
            outputType: { type: "string" },
          },
          required: ["name", "source", "target", "dataFlow"],
        },
        description: "Seam definitions to analyze for data flows",
      },
      performanceRequirements: {
        type: "object",
        properties: {
          maxLatency: { type: "number", description: "Maximum acceptable latency in ms" },
          minThroughput: { type: "number", description: "Minimum required throughput" },
          memoryConstraints: { type: "string", description: "Memory usage constraints" },
        },
        description: "Performance requirements and constraints",
      },
      includeOptimizations: {
        type: "boolean",
        description: "Include optimization recommendations in analysis",
      },
      analyzeBottlenecks: {
        type: "boolean",
        description: "Perform bottleneck analysis on data flows",
      },
    },
    required: ["seamDefinitions"],
  },
};
