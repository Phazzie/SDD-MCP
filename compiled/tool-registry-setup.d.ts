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
export declare function setupToolRegistry(): Promise<ToolRegistry>;
/**
 * @function getRegisteredToolNames
 * @description Helper function to get all registered tool names for validation
 * @param registry The configured tool registry
 * @returns Promise<string[]> Array of registered tool names
 */
export declare function getRegisteredToolNames(registry: ToolRegistry): Promise<string[]>;
/**
 * @function validateRegistrySetup
 * @description Validates that all expected tools are registered correctly
 * @param registry The configured tool registry
 * @returns Promise<boolean> True if all tools are registered correctly
 */
export declare function validateRegistrySetup(registry: ToolRegistry): Promise<boolean>;
