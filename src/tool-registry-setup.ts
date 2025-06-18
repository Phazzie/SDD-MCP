/**
 * SDD MCP Server - Tool Registry Setup
 * Centralizes tool registration for the main server.
 *
 * 🎯 CRITICAL: Tool Registry Integration Point
 * Blueprint: Registers all enhanced tools with the registry for modular tool management
 *
 * Phase B Implementation: Copilot (Strategic Planning Role)
 */

import { ToolRegistry } from "./tool-registry.js";

// Import all enhanced tools with ToolModuleContract exports
import { TOOL_MODULE_CONTRACT as analyzeDataFlowsTool } from "./tools/analyze-data-flows-tool.js";
import { TOOL_MODULE_CONTRACT as enhancedSeamAnalysisTool } from "./tools/enhanced-seam-analysis-tool.js";
import { TOOL_MODULE_CONTRACT as generateInteractionMatrixTool } from "./tools/generate-interaction-matrix-tool.js";
import { TOOL_MODULE_CONTRACT as validateSeamReadinessTool } from "./tools/validate-seam-readiness-tool.js";
// 🤝 AI COLLABORATION: Import AI Communication Bridge Tool
import { TOOL_MODULE_CONTRACT as aiCommunicationBridgeTool } from "./tools/ai-communication-bridge-tool.js";

/**
 * @function setupToolRegistry
 * @description Creates and configures the tool registry with all enhanced tools
 * @returns Promise<ToolRegistry> The configured registry ready for use
 *
 * Blueprint: This centralizes all tool registration in one place, making it easy to:
 * - Add new tools
 * - Remove deprecated tools
 * - Manage tool versions
 * - Configure tool-specific settings
 */
export async function setupToolRegistry(): Promise<ToolRegistry> {
  const registry = new ToolRegistry();

  try {
    // 🔌 INTEGRATION: Register all enhanced tools
    // Blueprint: Each tool is registered with its ToolModuleContract export

    // Enhanced Seam Analysis Tool
    const enhancedSeamResult = await registry.registerTool(
      enhancedSeamAnalysisTool
    );
    if (!enhancedSeamResult.success) {
      throw new Error(
        `Failed to register enhanced seam analysis tool: ${enhancedSeamResult.error}`
      );
    }

    // Analyze Data Flows Tool
    const analyzeDataResult = await registry.registerTool(analyzeDataFlowsTool);
    if (!analyzeDataResult.success) {
      throw new Error(
        `Failed to register analyze data flows tool: ${analyzeDataResult.error}`
      );
    }

    // Generate Interaction Matrix Tool
    const generateMatrixResult = await registry.registerTool(
      generateInteractionMatrixTool
    );
    if (!generateMatrixResult.success) {
      throw new Error(
        `Failed to register generate interaction matrix tool: ${generateMatrixResult.error}`
      );
    }

    // Validate Seam Readiness Tool
    const validateReadinessResult = await registry.registerTool(
      validateSeamReadinessTool
    );
    if (!validateReadinessResult.success) {
      throw new Error(
        `Failed to register validate seam readiness tool: ${validateReadinessResult.error}`
      );
    }

    // AI Communication Bridge Tool
    const aiCommunicationResult = await registry.registerTool(
      aiCommunicationBridgeTool
    );
    if (!aiCommunicationResult.success) {
      throw new Error(
        `Failed to register AI communication bridge tool: ${aiCommunicationResult.error}`
      );
    }

    console.log("✅ Tool Registry Setup Complete:");
    console.log("   - Enhanced Seam Analysis Tool");
    console.log("   - Analyze Data Flows Tool");
    console.log("   - Generate Interaction Matrix Tool");
    console.log("   - Validate Seam Readiness Tool");
    console.log("   - AI Communication Bridge Tool");

    return registry;
  } catch (error) {
    console.error("❌ Tool Registry Setup Failed:", error);
    throw error;
  }
}

/**
 * @function getRegisteredToolNames
 * @description Helper function to get all registered tool names for validation
 * @param registry The configured tool registry
 * @returns Promise<string[]> Array of registered tool names
 */
export async function getRegisteredToolNames(
  registry: ToolRegistry
): Promise<string[]> {
  const listResult = await registry.getTools();
  if (listResult.success && listResult.data) {
    return listResult.data.map((tool: any) => tool.name);
  }
  return [];
}

/**
 * @function validateRegistrySetup
 * @description Validates that all expected tools are registered correctly
 * @param registry The configured tool registry
 * @returns Promise<boolean> True if all tools are registered correctly
 */
export async function validateRegistrySetup(
  registry: ToolRegistry
): Promise<boolean> {
  const expectedTools = [
    "enhanced_seam_analysis",
    "analyze_data_flows",
    "generate_interaction_matrix",
    "validate_seam_readiness",
  ];

  const registeredTools = await getRegisteredToolNames(registry);

  for (const expectedTool of expectedTools) {
    if (!registeredTools.includes(expectedTool)) {
      console.error(`❌ Missing tool in registry: ${expectedTool}`);
      return false;
    }
  }

  console.log("✅ Registry validation passed - all expected tools registered");
  return true;
}
