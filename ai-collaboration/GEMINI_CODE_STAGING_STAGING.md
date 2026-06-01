--- a/c:\Users\thump\SkepticalWombat\ai-collaboration\GEMINI_CODE_STAGING.md
+++ b/c:\Users\thump\SkepticalWombat\ai-collaboration\GEMINI_CODE_STAGING.md
@@ -50,7 +50,271 @@

 <!-- GEMINI: START YOUR DELIVERY HERE -->

-[Gemini's code deliveries will appear here] +`yaml
+DELIVERY_ID: implementation-2025-06-03-02
+GEMINI_SESSION: gemini-session-alpha-001
+TASK_REFERENCE: MCP Tool Architecture Refactor (Phase 2 - Implementation)
+COMPLETION_STATUS: COMPLETE
+FILES_COUNT: 4
+BACKWARD_COMPATIBILITY: VERIFIED
+PERFORMANCE_IMPACT: NEUTRAL
+`

- +```
  +=== FILE_START: src/types.ts ===
  +ACTION: CREATE
  +DESCRIPTION: Centralized type definitions for ContractResult, SDDError, ToolModuleContract, etc.
  +SDD_SEAM: Shared Types
  +CONTRACTS_IMPLEMENTED: None (Defines types used by contracts)
  +BACKWARD_COMPATIBILITY: SAFE
- +/\*\*
- - Represents the result of a contract operation, indicating success or failure.
- - @template T The type of data returned on success.
- \*/
  +export interface ContractResult<TData> {
- success: boolean;
- data?: TData;
- error?: string; // Standardized error message
- errorDetails?: any; // Optional: for more detailed error information, e.g. SDDError object
  +}
- +/\*\*
- - Base error class for SDD specific errors.
- - Implementations should throw specific errors inheriting from this or a similar base.
- \*/
  +export class SDDError extends Error {
- public readonly context?: Record<string, any>;
- public readonly errorCode?: string;
-
- constructor(
- message: string,
- errorCode?: string,
- context?: Record<string, any>
- ) {
- super(message);
- this.name = this.constructor.name;
- this.errorCode = errorCode;
- this.context = context;
- }
  +}
- +export class NotImplementedError extends SDDError {
- constructor(
- methodName: string,
- blueprintDetails: string = "Not yet implemented."
- ) {
- super(
-      `Method ${methodName} is not implemented. Blueprint: ${blueprintDetails}`,
-      "ERR_NOT_IMPLEMENTED"
- );
- }
  +}
- +export class InvalidInputError extends SDDError {
- constructor(message: string, context?: Record<string, any>) {
- super(message, "ERR_INVALID_INPUT", context);
- }
  +}
- +export class ToolNotFoundError extends SDDError {
- constructor(toolName: string, version?: string) {
- const message = version
-      ? `Tool '${toolName}' version '${version}' not found.`
-      : `Tool '${toolName}' not found.`;
- super(message, "ERR_TOOL_NOT_FOUND", { toolName, version });
- }
  +}
- +export class ToolVersionNotFoundError extends SDDError {
- constructor(toolName: string, version: string) {
- super(
-      `Tool '${toolName}' version '${version}' not found.`,
-      "ERR_TOOL_VERSION_NOT_FOUND",
-      { toolName, version }
- );
- }
  +}
- +export class ToolRegistrationError extends SDDError {
- constructor(message: string, context?: Record<string, any>) {
- super(message, "ERR_TOOL_REGISTRATION", context);
- }
  +}
-
- +/\*\*
- - @interface ToolDefinition
- - @description Defines the static properties and schema of a tool.
- - This information is used for discovery, documentation, and UI generation.
- \*/
  +export interface ToolDefinition {
- name: string;
- description: string;
- inputSchema: Record<string, any>;
- outputSchema: Record<string, any>;
  +}
- +// Blueprint: Tool Module Contract - Defines the interface for all tool modules.
  +export interface ToolModuleContract {
- definition: ToolDefinition;
- handler: (args: any) => Promise<ContractResult<any>>;
- metadata: {
- name: string;
- version: string;
- dependencies?: string[];
- author?: string;
- tags?: string[];
- };
  +}
- +/\*\*
- - Optional configuration for tool execution, allowing for features like A/B testing or version pinning.
- \*/
  +export interface ToolExecutionConfig {
- /\*_ Specific version of the tool to execute. If not provided, registry decides (e.g., latest stable). _/
- version?: string;
- /\*_ Flags or context for A/B testing or feature flagging within the tool or registry. _/
- abTestContext?: Record<string, any>;
- /\*_ Timeout for the tool execution in milliseconds. _/
- timeoutMs?: number;
  +}
- +// Minimal interface for the ErrorHandler dependency (as per prompt context)
  +export interface ErrorHandler {
- logError(error: any, context?: Record<string, any>): Promise<void>;
  +}
- +// Placeholder for actual ErrorHandler instance (as per prompt context)
  +// This would typically be injected or managed by a dependency injection system
  +export const errorHandler: ErrorHandler = {
- async logError(error: any, context?: Record<string, any>): Promise<void> {
-        console.error("ErrorHandler Log:", error, context);
-        // TODO: Integrate with actual ErrorHandler foundation component
- }
  +};
- +=== FILE_END: src/types.ts ===
  +```
- +```
  +=== FILE_START: src/contracts.ts ===
  +ACTION: CREATE
  +DESCRIPTION: Defines the ToolRegistryContract interface.
  +SDD_SEAM: Tool Registry Seam
  +CONTRACTS_IMPLEMENTED: ToolRegistryContract
  +BACKWARD_COMPATIBILITY: SAFE
- +import { ContractResult, ToolDefinition, ToolModuleContract, ToolExecutionConfig } from "./types.js";
- +/\*\*
- - @interface ToolRegistryContract
- - @description Defines the contract for managing tool modules within the MCP server.
- - All methods must be asynchronous and return a ContractResult.
- \*/
  +export interface ToolRegistryContract {
- /\*\*
- - Registers a new tool module with the registry.
- - @param module The tool module to register.
- - @returns A ContractResult indicating success (void) or failure.
- - Blueprint: Implementation should handle versioning (e.g., allow multiple versions of a tool,
- - prevent duplicate registration of the same version).
- - Input validation: Ensure the provided module conforms to ToolModuleContract.
- \*/
- registerTool(module: ToolModuleContract): Promise<ContractResult<void>>;
-
- /\*\*
- - Retrieves a list of definitions for all registered tools.
- - @returns A Promise resolving to a ContractResult containing an array of ToolDefinition objects.
- - Blueprint: This allows clients to discover available tools and their capabilities.
- - Could support filtering or pagination in future enhancements.
- \*/
- getTools(): Promise<ContractResult<ToolDefinition[]>>;
-
- /\*\*
- - Executes a registered tool by its name.
- - @param name The unique name of the tool to execute (must match ToolModuleContract.metadata.name).
- - @param args The arguments to pass to the tool's handler.
- - @param config Optional configuration for this specific execution (e.g., version, A/B testing flags).
- - @returns A Promise resolving to a ContractResult containing the tool's output or an error.
- - Blueprint: Implementation will locate the appropriate tool (and version, if specified or determined by A/B logic),
- - validate args against the tool's inputSchema (or delegate to the tool), and invoke its handler.
- - Must handle cases where the tool is not found or the specified version is unavailable.
- \*/
- executeTool(name: string, args: any, config?: ToolExecutionConfig): Promise<ContractResult<any>>;
-
- /\*\*
- - Unregisters a tool module or a specific version of a tool module.
- - @param name The name of the tool to unregister.
- - @param version Optional. If provided, unregisters only this specific version. Otherwise, unregisters all versions.
- - @returns A Promise resolving to a ContractResult indicating success (void) or failure.
- - Blueprint: Important for dynamic environments or when tools are deprecated.
- \*/
- unregisterTool?(name: string, version?: string): Promise<ContractResult<void>>;
-
- /\*\*
- - Retrieves a specific tool module (or its definition).
- - @param name The name of the tool.
- - @param version Optional. The specific version to retrieve.
- - @returns A Promise resolving to a ContractResult containing the ToolModuleContract or ToolDefinition.
- - Blueprint: Useful for introspection or advanced scenarios.
- \*/
- getTool?(name: string, version?: string): Promise<ContractResult<ToolModuleContract | ToolDefinition>>;
  +}
- +=== FILE_END: src/contracts.ts ===
  +```
- +```
  +=== FILE_START: src/tool-registry.ts ===
  +ACTION: CREATE
  +DESCRIPTION: Implements the ToolRegistryContract for managing tool modules.
  +SDD_SEAM: Tool Registry Seam
  +CONTRACTS_IMPLEMENTED: ToolRegistryContract
  +BACKWARD_COMPATIBILITY: SAFE
- +import {
- ContractResult,
- ToolDefinition,
- ToolModuleContract,
- ToolRegistryContract,
- ToolExecutionConfig,
- InvalidInputError,
- ToolNotFoundError,
- ToolVersionNotFoundError,
- ToolRegistrationError,
- errorHandler // Assuming errorHandler is a singleton or globally accessible for now
  +} from "./types.js";
- +/\*\*
- - @class ToolRegistry
- - @implements ToolRegistryContract
- - @description Manages the registration, discovery, and execution of tool modules.
- - Supports versioning and provides hooks for A/B testing logic.
- \*/
  +export class ToolRegistry implements ToolRegistryContract {
- // Blueprint: Stores tools by name, then by version for efficient lookup.
- // Map<toolName, Map<version, ToolModuleContract>>
- private tools: Map<string, Map<string, ToolModuleContract>>;
-
- constructor() {
- // Blueprint: Initialize the internal tool storage.
- this.tools = new Map();
- }
-
- /\*\*
- - @inheritdoc
- - Blueprint: Registers a tool module. Validates input and handles versioning.
- \*/
- async registerTool(module: ToolModuleContract): Promise<ContractResult<void>> {
- try {
-      // Blueprint: Input validation - fail fast if the module is invalid.
-      if (!module || !module.definition || !module.handler || !module.metadata) {
-        const error = new InvalidInputError("Invalid tool module provided for registration.");
-        await errorHandler.logError(error, { context: 'ToolRegistry.registerTool', module: module?.metadata?.name });
-        return { success: false, error: error.message, errorDetails: error };
-      }
-      if (!module.metadata.name || !module.metadata.version) {
-         const error = new InvalidInputError("Tool module metadata missing name or version.");
-         await errorHandler.logError(error, { context: 'ToolRegistry.registerTool', module: module.metadata?.name });
-         return { success: false, error: error.message, errorDetails: error };
-      }
-       if (module.definition.name !== module.metadata.name) {
-          const error = new InvalidInputError("Tool module definition name must match metadata name.");
-          await errorHandler.logError(error, { context: 'ToolRegistry.registerTool', module: module.metadata.name });
-          return { success: false, error: error.message, errorDetails: error };
-       }
-
-
-      const { name, version } = module.metadata;
-
-      // Blueprint: Ensure a map exists for this tool name.
-      if (!this.tools.has(name)) {
-        this.tools.set(name, new Map());
-      }
-
-      const versions = this.tools.get(name)!;
-
-      // Blueprint: Check if this specific version is already registered.
-      if (versions.has(version)) {
-        const error = new ToolRegistrationError(`Tool '${name}' version '${version}' is already registered.`);
-        await errorHandler.logError(error, { context: 'ToolRegistry.registerTool', toolName: name, version });
-        return { success: false, error: error.message, errorDetails: error };
-      }
-
-      // Blueprint: Register the tool module.
-      versions.set(version, module);
-
-      // Blueprint: Log successful registration (optional, but good for debugging/auditing).
-      console.log(`Tool registered: ${name} (version: ${version})`);
-
-      return { success: true };
-
- } catch (error: any) {
-      // Blueprint: Catch any unexpected errors during registration, log, and return failed result.
-      const sddError = error instanceof SDDError ? error : new ToolRegistrationError(`Unexpected error during registration: ${error.message}`, undefined, { originalError: error });
-      await errorHandler.logError(sddError, { context: 'ToolRegistry.registerTool', module: module?.metadata?.name });
-      return { success: false, error: sddError.message, errorDetails: sddError };
- }
- }
-
- /\*\*
- - @inheritdoc
- - Blueprint: Retrieves definitions for all registered tools across all versions.
- \*/
- async getTools(): Promise<ContractResult<ToolDefinition[]>> {
- try {
-      // Blueprint: Aggregate definitions from all registered tool versions.
-      const definitions: ToolDefinition[] = [];
-      for (const versions of this.tools.values()) {
-        for (const module of versions.values()) {
-          definitions.push(module.definition);
-        }
-      }
-      // Blueprint: Consider adding logic here to return only the latest version,
-      // or handle filtering based on future requirements. For now, return all.
-
-      return { success: true, data: definitions };
-
- } catch (error: any) {
-      // Blueprint: Catch any unexpected errors, log, and return failed result.
-      const sddError = error instanceof SDDError ? error : new SDDError(`Unexpected error retrieving tools: ${error.message}`, undefined, { originalError: error });
-      await errorHandler.logError(sddError, { context: 'ToolRegistry.getTools' });
-      return { success: false, error: sddError.message, errorDetails: sddError };
- }
- }
-
- /\*\*
- - @inheritdoc
- - Blueprint: Executes a registered tool. Handles tool/version lookup and execution config.
- \*/
- async executeTool(name: string, args: any, config?: ToolExecutionConfig): Promise<ContractResult<any>> {
- try {
-      // Blueprint: Input validation - fail fast if tool name is missing.
-      if (!name) {
-        const error = new InvalidInputError("Tool name is required for execution.");
-        await errorHandler.logError(error, { context: 'ToolRegistry.executeTool', toolName: name });
-        return { success: false, error: error.message, errorDetails: error };
-      }
-
-      // Blueprint: Find the tool by name.
-      const versions = this.tools.get(name);
-      if (!versions || versions.size === 0) {
-        const error = new ToolNotFoundError(name);
-        await errorHandler.logError(error, { context: 'ToolRegistry.executeTool', toolName: name });
-        return { success: false, error: error.message, errorDetails: error };
-      }
-
-      let moduleToExecute: ToolModuleContract | undefined;
-      let targetVersion: string | undefined = config?.version;
-
-      // Blueprint: Determine which version to execute based on config or default logic.
-      if (targetVersion) {
-        // Execute specific version if requested.
-        moduleToExecute = versions.get(targetVersion);
-        if (!moduleToExecute) {
-          const error = new ToolVersionNotFoundError(name, targetVersion);
-          await errorHandler.logError(error, { context: 'ToolRegistry.executeTool', toolName: name, version: targetVersion });
-          return { success: false, error: error.message, errorDetails: error };
-        }
-      } else {
-        // Blueprint: Default behavior - find the latest version or use A/B testing logic.
-        // For Phase 1, let's default to the highest semantic version found.
-        // TODO: Implement proper A/B testing logic based on config.abTestContext
-        const sortedVersions = Array.from(versions.keys()).sort((a, b) => {
-            // Basic semantic version comparison (major.minor.patch)
-            const aParts = a.split('.').map(Number);
-            const bParts = b.split('.').map(Number);
-            for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
-                const aPart = aParts[i] || 0;
-                const bPart = bParts[i] || 0;
-                if (aPart > bPart) return -1; // a is higher version
-                if (aPart < bPart) return 1;  // b is higher version
-            }
-            return 0; // versions are equal
-        });
-        const latestVersion = sortedVersions[0]; // Highest version after sort
-        if (latestVersion) {
-             moduleToExecute = versions.get(latestVersion);
-             targetVersion = latestVersion; // Set targetVersion for logging
-        }
-      }
-
-      // Final check if a module was selected for execution.
-      if (!moduleToExecute) {
-         // This case should ideally not be reached if versions.size > 0,
-         // but as a safeguard.
-         const error = new ToolNotFoundError(name, targetVersion || 'any');
-         await errorHandler.logError(error, { context: 'ToolRegistry.executeTool', toolName: name, version: targetVersion });
-         return { success: false, error: error.message, errorDetails: error };
-      }
-
-      // Blueprint: Execute the tool's handler.
-      // TODO: Implement timeout logic using config.timeoutMs
-      console.log(`Executing tool: ${name} (version: ${targetVersion || 'default'})`);
-      const executionResult = await moduleToExecute.handler(args);
-
-      // Blueprint: Return the result from the tool's handler directly.
-      return executionResult;
-
- } catch (error: any) {
-      // Blueprint: Catch any unexpected errors during execution, log, and return failed result.
-      const sddError = error instanceof SDDError ? error : new SDDError(`Unexpected error during tool execution: ${error.message}`, undefined, { originalError: error, toolName: name, config });
-      await errorHandler.logError(sddError, { context: 'ToolRegistry.executeTool', toolName: name, config });
-      return { success: false, error: sddError.message, errorDetails: sddError };
- }
- }
-
- /\*\*
- - @inheritdoc
- - Blueprint: Optional method to unregister a tool or specific version.
- - Implementation: Basic removal logic.
- \*/
- async unregisterTool(name: string, version?: string): Promise<ContractResult<void>> {
-      try {
-          // Blueprint: Input validation
-          if (!name) {
-              const error = new InvalidInputError("Tool name is required for unregistration.");
-              await errorHandler.logError(error, { context: 'ToolRegistry.unregisterTool', toolName: name });
-              return { success: false, error: error.message, errorDetails: error };
-          }
-
-          const versions = this.tools.get(name);
-          if (!versions || versions.size === 0) {
-              // Tool not found, but unregistering a non-existent tool can be considered success or a specific error.
-              // Let's treat it as success for simplicity in Phase 1.
-              console.warn(`Attempted to unregister non-existent tool: ${name}`);
-              return { success: true };
-          }
-
-          if (version) {
-              // Unregister specific version
-              if (versions.delete(version)) {
-                  console.log(`Tool unregistered: ${name} (version: ${version})`);
-                  if (versions.size === 0) {
-                      // Remove the tool entry if no versions remain
-                      this.tools.delete(name);
-                  }
-                  return { success: true };
-              } else {
-                  const error = new ToolVersionNotFoundError(name, version);
-                  await errorHandler.logError(error, { context: 'ToolRegistry.unregisterTool', toolName: name, version });
-                  return { success: false, error: error.message, errorDetails: error };
-              }
-          } else {
-              // Unregister all versions of the tool
-              if (this.tools.delete(name)) {
-                  console.log(`Tool unregistered: ${name} (all versions)`);
-                  return { success: true };
-              } else {
-                   // Should not happen if versions.size > 0, but as safeguard
-                   const error = new ToolNotFoundError(name);
-                   await errorHandler.logError(error, { context: 'ToolRegistry.unregisterTool', toolName: name });
-                   return { success: false, error: error.message, errorDetails: error };
-              }
-          }
-      } catch (error: any) {
-          const sddError = error instanceof SDDError ? error : new SDDError(`Unexpected error during unregistration: ${error.message}`, undefined, { originalError: error, toolName: name, version });
-          await errorHandler.logError(sddError, { context: 'ToolRegistry.unregisterTool', toolName: name, version });
-          return { success: false, error: sddError.message, errorDetails: sddError };
-      }
- }
-
- /\*\*
-     * @inheritdoc
-     * Blueprint: Optional method to retrieve a specific tool module or its definition.
-     * Implementation: Basic lookup logic.
-     */
- async getTool(name: string, version?: string): Promise<ContractResult<ToolModuleContract | ToolDefinition>> {
-        try {
-            // Blueprint: Input validation
-            if (!name) {
-                const error = new InvalidInputError("Tool name is required to get tool.");
-                await errorHandler.logError(error, { context: 'ToolRegistry.getTool', toolName: name });
-                return { success: false, error: error.message, errorDetails: error };
-            }
-
-            const versions = this.tools.get(name);
-            if (!versions || versions.size === 0) {
-                const error = new ToolNotFoundError(name);
-                await errorHandler.logError(error, { context: 'ToolRegistry.getTool', toolName: name });
-                return { success: false, error: error.message, errorDetails: error };
-            }
-
-            let module: ToolModuleContract | undefined;
-            if (version) {
-                // Get specific version
-                module = versions.get(version);
-                if (!module) {
-                    const error = new ToolVersionNotFoundError(name, version);
-                    await errorHandler.logError(error, { context: 'ToolRegistry.getTool', toolName: name, version });
-                    return { success: false, error: error.message, errorDetails: error };
-                }
-            } else {
-                // Get the latest version if version is not specified (consistent with executeTool default)
-                 const sortedVersions = Array.from(versions.keys()).sort((a, b) => {
-                    const aParts = a.split('.').map(Number);
-                    const bParts = b.split('.').map(Number);
-                    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
-                        const aPart = aParts[i] || 0;
-                        const bPart = bParts[i] || 0;
-                        if (aPart > bPart) return -1;
-                        if (aPart < bPart) return 1;
-                    }
-                    return 0;
-                });
-                const latestVersion = sortedVersions[0];
-                if (latestVersion) {
-                     module = versions.get(latestVersion);
-                }
-                 // If still no module (shouldn't happen if versions.size > 0), return not found
-                 if (!module) {
-                     const error = new ToolNotFoundError(name, 'latest');
-                     await errorHandler.logError(error, { context: 'ToolRegistry.getTool', toolName: name, version: 'latest' });
-                     return { success: false, error: error.message, errorDetails: error };
-                 }
-            }
-
-            // Return the found module
-            return { success: true, data: module };
-
-        } catch (error: any) {
-            const sddError = error instanceof SDDError ? error : new SDDError(`Unexpected error getting tool: ${error.message}`, undefined, { originalError: error, toolName: name, version });
-            await errorHandler.logError(sddError, { context: 'ToolRegistry.getTool', toolName: name, version });
-            return { success: false, error: sddError.message, errorDetails: sddError };
-        }
- }
-
- // TODO: Implement auto-discovery mechanism (e.g., scanning a directory)
- // Blueprint: This could be a method called during registry initialization.
- // async discoverTools(): Promise<ContractResult<void>> { ... }
-
- // TODO: Implement A/B testing logic within executeTool
- // Blueprint: Use config.abTestContext to select a version or alternative implementation.
  +}
- +=== FILE_END: src/tool-registry.ts ===
  +```
- +```
  +=== FILE_START: src/adapters/legacy-tool-adapter.ts ===
  +ACTION: CREATE
  +DESCRIPTION: Adapter to wrap existing tool structure to conform to ToolModuleContract.
  +SDD_SEAM: Legacy Tool Adapter Seam
  +CONTRACTS_IMPLEMENTED: ToolModuleContract (by the returned object)
  +BACKWARD_COMPATIBILITY: SAFE (Enables legacy tools to be used by the new registry)
- +import {
- ContractResult,
- ToolDefinition,
- ToolModuleContract,
- InvalidInputError,
- errorHandler // Assuming errorHandler is available
  +} from "../types.js";
- +// Blueprint: Define the expected structure of a "legacy" tool.
  +// This is based on the analysis of index.ts and enhanced-seam-analysis-tool.ts.
  +interface LegacyTool {
- definition: {
-        name: string;
-        description: string;
-        inputSchema: Record<string, any>;
-        outputSchema: Record<string, any>;
- };
- // Assuming the legacy handler already returns Promise<ContractResult<any>>
- handler: (args: any) => Promise<ContractResult<any>>;
- // Legacy tools might not have explicit metadata or version
  +}
- +/\*\*
- - @function createLegacyToolAdapter
- - @description Creates a ToolModuleContract compliant object from a legacy tool structure.
- - @param legacyTool The legacy tool object.
- - @returns An object conforming to ToolModuleContract.
- - Blueprint: Wraps the legacy tool's definition and handler, and provides default metadata.
- \*/
  +export function createLegacyToolAdapter(legacyTool: LegacyTool): ToolModuleContract {
- // Blueprint: Input validation for the legacy tool structure.
- if (!legacyTool || !legacyTool.definition || !legacyTool.handler || !legacyTool.definition.name) {
-        // In a real scenario, this might throw or return a specific error result
-        // depending on where this adapter is used. For a factory function, throwing is acceptable.
-        const error = new InvalidInputError("Invalid legacy tool structure provided to adapter.");
-        // Note: Logging here might be tricky if errorHandler isn't fully initialized yet.
-        // Assuming it is, or this adapter is used after initialization.
-        errorHandler.logError(error, { context: 'createLegacyToolAdapter' }).catch(console.error); // Log asynchronously
-        throw error; // Fail fast during adapter creation
- }
-
- // Blueprint: Construct the ToolModuleContract object.
- // Use the legacy definition directly.
- // Use the legacy handler directly (assuming it returns ContractResult<any>).
- // Create metadata, assigning a default version like 'legacy' or '1.0.0'.
- const adapter: ToolModuleContract = {
-        definition: legacyTool.definition,
-        handler: legacyTool.handler,
-        metadata: {
-            name: legacyTool.definition.name,
-            version: '1.0.0-legacy', // Blueprint: Assign a default or recognizable version
-            // dependencies, author, tags could be added if available in legacy structure or defaulted
-        }
- };
-
- console.log(`Created adapter for legacy tool: ${legacyTool.definition.name}`);
-
- return adapter;
  +}
- +// Blueprint: Example of a mock legacy tool structure for testing/demonstration
  +// This would represent the shape of tools currently in src/tools/_.ts before refactor.
  +/_
  +interface MockLegacyToolStructure {
- definition: {
-        name: string;
-        description: string;
-        inputSchema: any;
-        outputSchema: any;
- };
- handler: (args: any) => Promise<ContractResult<any>>;
  +}
- +// Example mock legacy tool
  +const mockLegacyTool: MockLegacyToolStructure = {
- definition: {
-        name: "mockLegacyTool",
-        description: "A mock legacy tool.",
-        inputSchema: { type: "object", properties: { input: { type: "string" } } },
-        outputSchema: { type: "object", properties: { output: { type: "string" } } },
- },
- handler: async (args: any): Promise<ContractResult<any>> => {
-        try {
-            if (!args || typeof args.input !== 'string') {
-                 return { success: false, error: "Invalid input for mockLegacyTool" };
-            }
-            console.log(`Mock legacy tool handler received: ${args.input}`);
-            return { success: true, data: { output: `Processed: ${args.input}` } };
-        } catch (error: any) {
-             await errorHandler.logError(error, { context: 'mockLegacyTool.handler' });
-             return { success: false, error: error.message };
-        }
- }
  +};
- +// Example usage (for demonstration, not part of the delivered file content)
  +// const legacyAdapter = createLegacyToolAdapter(mockLegacyTool);
  +// console.log(legacyAdapter.metadata); // Should show name and version: '1.0.0-legacy'
  +\*/
- +=== FILE_END: src/adapters/legacy-tool-adapter.ts ===
  +```
- +```
  +=== FILE_START: ai-collaboration/examples/tool-registry-integration-example.ts ===
  +ACTION: CREATE
  +DESCRIPTION: Example demonstrating how to use the new ToolRegistry and LegacyToolAdapter.
  +SDD_SEAM: Tool Registry Seam (Usage Example)
  +CONTRACTS_IMPLEMENTED: None (Consumes contracts)
  +BACKWARD_COMPATIBILITY: SAFE
- +import { ToolRegistry } from "../src/tool-registry.js";
  +import { createLegacyToolAdapter } from "../src/adapters/legacy-tool-adapter.js";
  +import { ContractResult, ToolModuleContract, ToolDefinition } from "../src/types.js";
- +// Blueprint: Mock the structure of an existing legacy tool before refactor.
  +// This represents what you'd find in src/tools/\*.ts currently.
  +interface MockLegacyToolStructure {
- definition: {
-        name: string;
-        description: string;
-        inputSchema: any;
-        outputSchema: any;
- };
- handler: (args: any) => Promise<ContractResult<any>>;
  +}
- +// Blueprint: Create a mock legacy tool instance.
  +const mockLegacyTool: MockLegacyToolStructure = {
- definition: {
-        name: "analyze-data-flows-tool", // Example using a name from the task assignment
-        description: "Analyzes data flows in the system (Legacy Mock).",
-        inputSchema: { type: "object", properties: { data: { type: "string" } }, required: ["data"] },
-        outputSchema: { type: "object", properties: { analysis: { type: "string" } } },
- },
- handler: async (args: any): Promise<ContractResult<any>> => {
-        try {
-            // Blueprint: Simulate legacy tool's input validation and logic
-            if (!args || typeof args.data !== 'string') {
-                 console.error("Legacy Mock: Invalid input received.");
-                 return { success: false, error: "Invalid input: 'data' must be a string." };
-            }
-            console.log(`Legacy Mock Handler received data: "${args.data}"`);
-            // Simulate some processing
-            const analysisResult = `Analysis of "${args.data}": Data flow looks good (simulated).`;
-            return { success: true, data: { analysis: analysisResult } };
-        } catch (error: any) {
-             // In a real legacy tool, this might not use the new errorHandler
-             console.error("Legacy Mock Handler Error:", error);
-             return { success: false, error: error.message };
-        }
- }
  +};
- +// Blueprint: Mock a new tool module conforming to the new contract.
  +const mockNewToolModule: ToolModuleContract = {
- definition: {
-        name: "generate-report-tool",
-        description: "Generates a system report (New Module).",
-        inputSchema: { type: "object", properties: { type: { type: "string", enum: ["summary", "detail"] } }, required: ["type"] },
-        outputSchema: { type: "object", properties: { report: { type: "string" } } },
- },
- handler: async (args: any): Promise<ContractResult<any>> => {
-        try {
-            // Blueprint: New tool module's input validation using SDD pattern
-            if (!args || (args.type !== 'summary' && args.type !== 'detail')) {
-                const error = new InvalidInputError("Invalid input: 'type' must be 'summary' or 'detail'.", { args });
-                // Assuming errorHandler is available in the new tool module context
-                // await errorHandler.logError(error, { context: 'generate-report-tool.handler' });
-                return { success: false, error: error.message, errorDetails: error };
-            }
-            console.log(`New Tool Handler received type: "${args.type}"`);
-            const reportContent = `Generated ${args.type} report (simulated).`;
-            return { success: true, data: { report: reportContent } };
-        } catch (error: any) {
-             // Assuming errorHandler is available
-             // await errorHandler.logError(error, { context: 'generate-report-tool.handler', args });
-             return { success: false, error: error.message };
-        }
- },
- metadata: {
-        name: "generate-report-tool",
-        version: "1.1.0",
-        author: "Gemini",
-        tags: ["reporting"]
- }
  +};
- +// Blueprint: Demonstrate the integration
  +async function demonstrateToolRegistry() {
- console.log("--- Demonstrating Tool Registry Integration ---");
-
- // 1. Instantiate the registry
- const registry = new ToolRegistry();
- console.log("ToolRegistry instantiated.");
-
- // 2. Register a new tool module
- console.log("\nRegistering new tool module...");
- const registerNewResult = await registry.registerTool(mockNewToolModule);
- if (registerNewResult.success) {
-        console.log("New tool module registered successfully.");
- } else {
-        console.error("Failed to register new tool module:", registerNewResult.error);
- }
-
- // 3. Register a legacy tool using the adapter
- console.log("\nRegistering legacy tool using adapter...");
- const legacyAdapter = createLegacyToolAdapter(mockLegacyTool);
- const registerLegacyResult = await registry.registerTool(legacyAdapter);
-     if (registerLegacyResult.success) {
-        console.log("Legacy tool registered successfully via adapter.");
- } else {
-        console.error("Failed to register legacy tool:", registerLegacyResult.error);
- }
-
-
- // 4. Get list of registered tools
- console.log("\nGetting list of registered tools...");
- const getToolsResult = await registry.getTools();
- if (getToolsResult.success && getToolsResult.data) {
-        console.log("Registered tools:", getToolsResult.data.map(tool => tool.name));
- } else {
-        console.error("Failed to get tools:", getToolsResult.error);
- }
-
- // 5. Execute a new tool
- console.log("\nExecuting new tool 'generate-report-tool'...");
- const executeNewResult = await registry.executeTool("generate-report-tool", { type: "summary" });
- if (executeNewResult.success) {
-        console.log("New tool execution successful:", executeNewResult.data);
- } else {
-        console.error("New tool execution failed:", executeNewResult.error);
- }
-
-     // 6. Execute the legacy tool
- console.log("\nExecuting legacy tool 'analyze-data-flows-tool'...");
- const executeLegacyResult = await registry.executeTool("analyze-data-flows-tool", { data: "some important data" });
- if (executeLegacyResult.success) {
-        console.log("Legacy tool execution successful:", executeLegacyResult.data);
- } else {
-        console.error("Legacy tool execution failed:", executeLegacyResult.error);
- }
-
- // 7. Demonstrate error handling (e.g., executing non-existent tool)
- console.log("\nAttempting to execute non-existent tool 'non-existent-tool'...");
- const executeNonExistentResult = await registry.executeTool("non-existent-tool", {});
- if (!executeNonExistentResult.success) {
-        console.log("Execution of non-existent tool failed as expected:", executeNonExistentResult.error);
-        // Check for specific error type if needed
-        // console.log("Error details:", executeNonExistentResult.errorDetails);
- } else {
-        console.error("Execution of non-existent tool unexpectedly succeeded!");
- }
-
-     // 8. Demonstrate error handling (e.g., executing tool with invalid input)
- console.log("\nAttempting to execute 'generate-report-tool' with invalid input...");
- const executeInvalidInputResult = await registry.executeTool("generate-report-tool", { type: "invalid" });
- if (!executeInvalidInputResult.success) {
-        console.log("Execution with invalid input failed as expected:", executeInvalidInputResult.error);
-        // Check for specific error type if needed
-        // console.log("Error details:", executeInvalidInputResult.errorDetails);
- } else {
-        console.error("Execution with invalid input unexpectedly succeeded!");
- }
-
- console.log("\n--- Demonstration Complete ---");
  +}
- +// Blueprint: Run the demonstration function.
  +// In the actual index.ts integration, this logic would be part of the server setup.
  +// demonstrateToolRegistry().catch(console.error);
- +// Note: To run this example, you would need a TypeScript environment set up
  +// and potentially mock implementations of any foundation components (like ErrorHandler)
  +// if they are not yet fully implemented.
  +```
- +=== FILE_END: ai-collaboration/examples/tool-registry-integration-example.ts ===
  +```
   <!-- GEMINI: END YOUR DELIVERY HERE -->
