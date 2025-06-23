/**
 * SDD MCP Server - Legacy SDD Tool Wrappers
 * Wraps legacy SDD tool functions to conform to ToolModuleContract
 * 
 * 🔌 INTEGRATION: Legacy SDD Tools → Tool Registry Seam
 * PURPOSE: Bridge legacy tool implementations to modern registry architecture
 * SEAM: Legacy Functions ↔ ToolModuleContract ↔ Tool Registry
 */

import { ToolModuleContract, ContractResult } from "../contracts.js";

/**
 * Converts MCP tool response to ContractResult format
 * PURPOSE: Bridge between legacy MCP format and modern ContractResult<T>
 */
function convertMCPResponseToContractResult(mcpResponse: any): ContractResult<any> {
  // Check if it's an error response
  if (mcpResponse.isError) {
    return {
      success: false,
      error: mcpResponse.content?.[0]?.text || "Unknown error",
      metadata: { 
        errorCode: "LEGACY_TOOL_ERROR",
        isError: true 
      }
    };
  }

  // Success response - extract the content
  return {
    success: true,
    data: {
      content: mcpResponse.content,
      // Preserve original response structure for compatibility
      originalResponse: mcpResponse
    },
    metadata: {
      responseType: "mcp_legacy",
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Creates a wrapped handler that converts legacy function to ContractResult
 */
function createWrappedHandler(
  legacyFunction: (args: any) => Promise<any>
): (args: any) => Promise<ContractResult<any>> {
  return async (args: any): Promise<ContractResult<any>> => {
    try {
      const mcpResponse = await legacyFunction(args);
      return convertMCPResponseToContractResult(mcpResponse);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata: {
          errorCode: "LEGACY_TOOL_EXCEPTION",
          errorDetails: error
        }
      };
    }
  };
}

// Import the legacy functions from index.ts
// NOTE: These functions need to be exported from index.ts for this to work
// For now, we'll define the tool contracts and expect these functions to be passed in

/**
 * sdd_analyze_requirements tool wrapper
 */
export function createAnalyzeRequirementsWrapper(
  analyzeRequirementsFunc: (args: any) => Promise<any>
): ToolModuleContract {
  return {
    definition: {
      name: "sdd_analyze_requirements",
      description: "Analyze requirements text and identify seams for SDD methodology",
      inputSchema: {
        type: "object",
        properties: {
          prdText: {
            type: "string",
            description: "Product requirements document text"
          },
          designNotes: {
            type: "string",
            description: "Optional design notes or additional context"
          }
        },
        required: ["prdText"]
      }
    },
    handler: createWrappedHandler(analyzeRequirementsFunc),
    metadata: {
      name: "sdd_analyze_requirements",
      version: "1.0.0-legacy",
      author: "SDD Team",
      tags: ["sdd", "requirements", "analysis", "legacy"]
    }
  };
}

/**
 * sdd_generate_contract tool wrapper
 */
export function createGenerateContractWrapper(
  generateContractFunc: (args: any) => Promise<any>
): ToolModuleContract {
  return {
    definition: {
      name: "sdd_generate_contract",
      description: "Generate a contract template from a seam definition",
      inputSchema: {
        type: "object",
        properties: {
          seam: {
            type: "object",
            properties: {
              name: { type: "string" },
              participants: { 
                type: "array",
                items: { type: "string" }
              },
              dataFlow: { 
                type: "string",
                enum: ["IN", "OUT", "BOTH"]
              },
              purpose: { type: "string" },
              contractInterface: { type: "string" }
            },
            required: ["name", "participants", "dataFlow", "purpose", "contractInterface"]
          }
        },
        required: ["seam"]
      }
    },
    handler: createWrappedHandler(generateContractFunc),
    metadata: {
      name: "sdd_generate_contract",
      version: "1.0.0-legacy",
      author: "SDD Team",
      tags: ["sdd", "contract", "generation", "legacy"]
    }
  };
}

/**
 * sdd_create_stub tool wrapper
 */
export function createCreateStubWrapper(
  createStubFunc: (args: any) => Promise<any>
): ToolModuleContract {
  return {
    definition: {
      name: "sdd_create_stub",
      description: "Create an implementation stub from a contract",
      inputSchema: {
        type: "object",
        properties: {
          contractCode: {
            type: "string",
            description: "The contract code to generate stub from"
          },
          componentName: {
            type: "string",
            description: "Name of the component"
          }
        },
        required: ["contractCode", "componentName"]
      }
    },
    handler: createWrappedHandler(createStubFunc),
    metadata: {
      name: "sdd_create_stub",
      version: "1.0.0-legacy",
      author: "SDD Team",
      tags: ["sdd", "stub", "implementation", "legacy"]
    }
  };
}

/**
 * sdd_orchestrate_full_workflow tool wrapper
 */
export function createOrchestrateWorkflowWrapper(
  orchestrateFunc: (args: any) => Promise<any>
): ToolModuleContract {
  return {
    definition: {
      name: "sdd_orchestrate_full_workflow",
      description: "Orchestrate the complete SDD workflow from requirements to implementation",
      inputSchema: {
        type: "object",
        properties: {
          prdText: {
            type: "string",
            description: "Product requirements document text"
          },
          designNotes: {
            type: "string",
            description: "Optional design notes"
          },
          projectName: {
            type: "string",
            description: "Name of the project"
          }
        },
        required: ["prdText", "projectName"]
      }
    },
    handler: createWrappedHandler(orchestrateFunc),
    metadata: {
      name: "sdd_orchestrate_full_workflow",
      version: "1.0.0-legacy",
      author: "SDD Team",
      tags: ["sdd", "orchestration", "workflow", "legacy"]
    }
  };
}

/**
 * sdd_visualize_architecture tool wrapper
 */
export function createVisualizeArchitectureWrapper(
  visualizeFunc: (args: any) => Promise<any>
): ToolModuleContract {
  return {
    definition: {
      name: "sdd_visualize_architecture",
      description: "Generate architecture visualizations for SDD seams",
      inputSchema: {
        type: "object",
        properties: {
          seams: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                participants: { 
                  type: "array",
                  items: { type: "string" }
                },
                dataFlow: { 
                  type: "string",
                  enum: ["IN", "OUT", "BOTH"]
                },
                purpose: { type: "string" },
                contractInterface: { type: "string" }
              }
            }
          },
          projectName: {
            type: "string",
            description: "Name of the project"
          }
        },
        required: ["seams", "projectName"]
      }
    },
    handler: createWrappedHandler(visualizeFunc),
    metadata: {
      name: "sdd_visualize_architecture",
      version: "1.0.0-legacy",
      author: "SDD Team",
      tags: ["sdd", "visualization", "architecture", "legacy"]
    }
  };
}

/**
 * sdd_validate_compliance tool wrapper
 */
export function createValidateComplianceWrapper(
  validateFunc: (args: any) => Promise<any>
): ToolModuleContract {
  return {
    definition: {
      name: "sdd_validate_compliance",
      description: "Validate SDD compliance for a project",
      inputSchema: {
        type: "object",
        properties: {
          projectPath: {
            type: "string",
            description: "Path to the project to validate"
          },
          strictMode: {
            type: "boolean",
            description: "Whether to use strict validation mode"
          }
        },
        required: ["projectPath"]
      }
    },
    handler: createWrappedHandler(validateFunc),
    metadata: {
      name: "sdd_validate_compliance",
      version: "1.0.0-legacy",
      author: "SDD Team",
      tags: ["sdd", "validation", "compliance", "legacy"]
    }
  };
}

/**
 * Export all wrapper creation functions for easy import
 */
export const legacySDDToolWrappers = {
  createAnalyzeRequirementsWrapper,
  createGenerateContractWrapper,
  createCreateStubWrapper,
  createOrchestrateWorkflowWrapper,
  createVisualizeArchitectureWrapper,
  createValidateComplianceWrapper
};
