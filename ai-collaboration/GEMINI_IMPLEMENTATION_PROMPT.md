# 🧩 **PROMPT FOR GEMINI: Tool Registry Implementation - Phase 2**

## 🎯 **YOUR TASK**

Now that you've designed the contracts for our MCP Tool Registry refactor, I need you to implement the actual **`ToolRegistry`** class that implements the **`ToolRegistryContract`** interface.

## 📋 **DELIVERABLES**

1. **ToolRegistry Implementation** → Put in `GEMINI_CODE_STAGING.md` under "## Implementation"
2. **Backward Compatibility Adapter** → For handling legacy tools
3. **Example Tool Module Wrapper** → Show how to convert an existing tool

## 📝 **IMPLEMENTATION REQUIREMENTS**

### **Core Features**

- Implement the full `ToolRegistryContract` interface
- Support for multiple versions of the same tool
- A/B testing capability (random or configured selection between versions)
- Efficient tool lookup and execution
- Thread safety for concurrent operations
- Comprehensive error handling and reporting

### **Backward Compatibility**

- Create an adapter that can wrap existing tool definitions and handlers
- Should work with current `ENHANCED_SEAM_ANALYSIS_TOOL_DEFINITION` format
- Must maintain existing behavior for current tools

### **Performance Optimization**

- Tool definitions should be cached
- Lazy loading of actual tool handlers when possible
- Keep initialization overhead minimal (<100ms)

### **Error Handling**

- Follow SDD error patterns with proper error categorization
- Validate all inputs extensively
- Provide clear, actionable error messages
- Include context information in errors

## 🛠️ **IMPLEMENTATION GUIDANCE**

### **File Structure**

```
src/
├── tool-registry.ts     // Main implementation
├── adapters/
│   └── legacy-tool-adapter.ts  // For backward compatibility
└── tools/
    └── [existing tool files]
```

### **Example Usage Patterns**

```typescript
// Initialization
const registry = new ToolRegistry();

// Registration
await registry.registerTool(enhancedSeamAnalysisTool);

// Execution
const result = await registry.executeTool("enhanced_seam_analysis", args);

// A/B Testing
const result = await registry.executeTool("enhanced_seam_analysis", args, {
  abTestContext: { variant: "experimental" },
});
```

## 📊 **DELIVERABLE FORMAT**

Your implementation in `GEMINI_CODE_STAGING.md` should follow this structure:

````markdown
# Tool Registry Implementation - Phase 2

## Implementation

```typescript
// File: src/tool-registry.ts

import { ToolRegistryContract, ToolModuleContract, ContractResult, ... } from "./contracts.js";

/**
 * Blueprint: Implementation of the ToolRegistry
 * This class manages registration, discovery, and execution of tool modules
 * in a dynamic, version-aware manner with A/B testing support.
 */
export class ToolRegistry implements ToolRegistryContract {
  // Your implementation here
}
```
````

## Backward Compatibility Adapter

```typescript
// File: src/adapters/legacy-tool-adapter.ts

import { ToolModuleContract, ToolDefinition, ... } from "../contracts.js";

/**
 * Blueprint: Adapter to wrap legacy tool definitions in the new ToolModuleContract interface
 */
export function createLegacyToolAdapter(
  toolDefinition: any,
  handlerFunction: Function
): ToolModuleContract {
  // Your adapter implementation
}
```

## Example Usage

```typescript
// Example of how to use the registry with both new and legacy tools
import { ToolRegistry } from "./tool-registry.js";
import { createLegacyToolAdapter } from "./adapters/legacy-tool-adapter.js";
import {
  ENHANCED_SEAM_ANALYSIS_TOOL_DEFINITION,
  handleEnhancedSeamAnalysis,
} from "./tools/enhanced-seam-analysis-tool.js";

// Example code showing integration
```

```

Follow SDD principles rigorously - ensure proper error handling, validation, and ContractResult<T> returns throughout.

## 🧪 **TESTING CONSIDERATIONS**

Explain how your implementation should be tested, including:
- Unit test approach for registry operations
- Integration test strategy with existing tools
- Performance benchmarking methodology
- Error case testing strategy

Remember, this is a critical component that all tools will depend on, so reliability and performance are paramount!

---

**NOTE:** After you deliver the implementation, I'll integrate it into our codebase and we'll move to the next phase - refactoring our existing tools to use the new registry.
```
