/**
 * SDD MCP Server - Tool Registry Implementation
 * Implements the ToolRegistryContract for managing tool modules.
 *
 * 🎯 CRITICAL: Tool Registry Seam Implementation
 * Blueprint: Modular, version-aware tool management with A/B testing support
 *
 * Generated by: Gemini AI (Phase 2 Implementation)
 * Integrated by: GitHub Copilot
 */

import {
  ContractResult,
  ToolDefinition,
  ToolExecutionConfig,
  ToolModuleContract,
  ToolRegistryContract,
} from "./contracts.js";

/**
 * @class ToolRegistry
 * @implements ToolRegistryContract
 * @description Manages the registration, discovery, and execution of tool modules.
 * Supports versioning and provides hooks for A/B testing logic.
 */
export class ToolRegistry implements ToolRegistryContract {
  // Blueprint: Stores tools by name, then by version for efficient lookup.
  // Map<toolName, Map<version, ToolModuleContract>>
  private tools: Map<string, Map<string, ToolModuleContract>>;

  constructor() {
    // Blueprint: Initialize the internal tool storage.
    this.tools = new Map();
  }

  /**
   * @inheritdoc
   * Blueprint: Registers a tool module. Validates input and handles versioning.
   */
  async registerTool(
    module: ToolModuleContract
  ): Promise<ContractResult<void>> {
    try {
      // Blueprint: Input validation - fail fast if the module is invalid.
      if (
        !module ||
        !module.definition ||
        !module.handler ||
        !module.metadata
      ) {
        return {
          success: false,
          error: "Invalid tool module provided for registration.",
          metadata: { errorCode: "ERR_INVALID_INPUT" },
        };
      }

      if (!module.metadata.name || !module.metadata.version) {
        return {
          success: false,
          error: "Tool module metadata missing name or version.",
          metadata: { errorCode: "ERR_INVALID_INPUT" },
        };
      }

      if (module.definition.name !== module.metadata.name) {
        return {
          success: false,
          error: "Tool module definition name must match metadata name.",
          metadata: { errorCode: "ERR_INVALID_INPUT" },
        };
      }

      const { name, version } = module.metadata;

      // Blueprint: Ensure a map exists for this tool name.
      if (!this.tools.has(name)) {
        this.tools.set(name, new Map());
      }

      const versions = this.tools.get(name)!;

      // Blueprint: Check if this specific version is already registered.
      if (versions.has(version)) {
        return {
          success: false,
          error: `Tool '${name}' version '${version}' is already registered.`,
          metadata: { errorCode: "ERR_TOOL_REGISTRATION" },
        };
      }

      // Blueprint: Register the tool module.
      versions.set(version, module);

      // Blueprint: Log successful registration (optional, but good for debugging/auditing).
      console.log(`Tool registered: ${name} (version: ${version})`);

      return { success: true, metadata: { toolName: name, version } };
    } catch (error: any) {
      // Blueprint: Catch any unexpected errors during registration, log, and return failed result.
      return {
        success: false,
        error: `Unexpected error during registration: ${error.message}`,
        metadata: { errorCode: "ERR_UNEXPECTED" },
      };
    }
  }

  /**
   * @inheritdoc
   * Blueprint: Retrieves definitions for all registered tools across all versions.
   */
  async getTools(): Promise<ContractResult<ToolDefinition[]>> {
    try {
      // Blueprint: Collect all tool definitions across all tools and versions.
      const definitions: ToolDefinition[] = [];

      for (const [toolName, versionMap] of this.tools) {
        for (const [version, module] of versionMap) {
          definitions.push(module.definition);
        }
      }

      return { success: true, data: definitions };
    } catch (error: any) {
      // Blueprint: Handle unexpected errors.
      return {
        success: false,
        error: `Error retrieving tools: ${error.message}`,
        metadata: { errorCode: "ERR_UNEXPECTED" },
      };
    }
  }

  /**
   * @inheritdoc
   * Blueprint: Executes a tool by name, with optional version and configuration.
   */
  async executeTool(
    name: string,
    args: any,
    config?: ToolExecutionConfig
  ): Promise<ContractResult<any>> {
    try {
      // Blueprint: Input validation.
      if (!name) {
        return {
          success: false,
          error: "Tool name is required.",
          metadata: { errorCode: "ERR_INVALID_INPUT" },
        };
      }

      // Blueprint: Check if the tool exists.
      if (!this.tools.has(name)) {
        return {
          success: false,
          error: `Tool '${name}' not found.`,
          metadata: { errorCode: "ERR_TOOL_NOT_FOUND" },
        };
      }

      const versionMap = this.tools.get(name)!;
      let targetVersion = config?.version;

      // Blueprint: If no version specified, use the latest (lexicographically last for simplicity).
      if (!targetVersion) {
        const versions = Array.from(versionMap.keys()).sort();
        targetVersion = versions[versions.length - 1];
      }

      // Blueprint: Check if the specified version exists.
      if (!versionMap.has(targetVersion)) {
        return {
          success: false,
          error: `Tool '${name}' version '${targetVersion}' not found.`,
          metadata: { errorCode: "ERR_TOOL_VERSION_NOT_FOUND" },
        };
      }

      const module = versionMap.get(targetVersion)!;

      // Blueprint: Execute the tool's handler with the provided arguments.
      const result = await module.handler(args);

      return result;
    } catch (error: any) {
      // Blueprint: Handle unexpected errors during execution.
      return {
        success: false,
        error: `Error executing tool '${name}': ${error.message}`,
        metadata: { errorCode: "ERR_EXECUTION_FAILED" },
      };
    }
  }

  /**
   * @inheritdoc
   * Blueprint: Unregisters a tool or a specific version.
   */
  async unregisterTool(
    name: string,
    version?: string
  ): Promise<ContractResult<void>> {
    try {
      // Blueprint: Input validation.
      if (!name) {
        return {
          success: false,
          error: "Tool name is required.",
          metadata: { errorCode: "ERR_INVALID_INPUT" },
        };
      }

      // Blueprint: Check if the tool exists.
      if (!this.tools.has(name)) {
        return {
          success: false,
          error: `Tool '${name}' not found.`,
          metadata: { errorCode: "ERR_TOOL_NOT_FOUND" },
        };
      }

      const versionMap = this.tools.get(name)!;

      if (version) {
        // Blueprint: Unregister a specific version.
        if (!versionMap.has(version)) {
          return {
            success: false,
            error: `Tool '${name}' version '${version}' not found.`,
            metadata: { errorCode: "ERR_TOOL_VERSION_NOT_FOUND" },
          };
        }

        versionMap.delete(version);

        // Blueprint: If no versions left, remove the tool entirely.
        if (versionMap.size === 0) {
          this.tools.delete(name);
        }
      } else {
        // Blueprint: Unregister all versions of the tool.
        this.tools.delete(name);
      }

      return { success: true };
    } catch (error: any) {
      // Blueprint: Handle unexpected errors.
      return {
        success: false,
        error: `Error unregistering tool '${name}': ${error.message}`,
        metadata: { errorCode: "ERR_UNEXPECTED" },
      };
    }
  }

  /**
   * @inheritdoc
   * Blueprint: Gets a specific tool module or definition.
   */
  async getTool(
    name: string,
    version?: string
  ): Promise<ContractResult<ToolModuleContract | ToolDefinition>> {
    try {
      // Blueprint: Input validation.
      if (!name) {
        return {
          success: false,
          error: "Tool name is required.",
          metadata: { errorCode: "ERR_INVALID_INPUT" },
        };
      }

      // Blueprint: Check if the tool exists.
      if (!this.tools.has(name)) {
        return {
          success: false,
          error: `Tool '${name}' not found.`,
          metadata: { errorCode: "ERR_TOOL_NOT_FOUND" },
        };
      }

      const versionMap = this.tools.get(name)!;
      let targetVersion = version;

      // Blueprint: If no version specified, use the latest.
      if (!targetVersion) {
        const versions = Array.from(versionMap.keys()).sort();
        targetVersion = versions[versions.length - 1];
      }

      // Blueprint: Check if the specified version exists.
      if (!versionMap.has(targetVersion)) {
        return {
          success: false,
          error: `Tool '${name}' version '${targetVersion}' not found.`,
          metadata: { errorCode: "ERR_TOOL_VERSION_NOT_FOUND" },
        };
      }

      const module = versionMap.get(targetVersion)!;

      return { success: true, data: module };
    } catch (error: any) {
      // Blueprint: Handle unexpected errors.
      return {
        success: false,
        error: `Error retrieving tool '${name}': ${error.message}`,
        metadata: { errorCode: "ERR_UNEXPECTED" },
      };
    }
  }
}
