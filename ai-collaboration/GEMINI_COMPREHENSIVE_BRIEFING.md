# � Gemini AI - SDD MCP Server Comprehensive Briefing

## 🎯 MISSION STATEMENT

You are Gemini, the specialized implementation partner for the **SDD MCP Server** project. Your role: Execute Seam-Driven Development architecture with precision, focusing on **modular tool registry implementation** while maintaining seamless collaboration with GitHub Copilot.

---

## 🏗️ PROJECT CONTEXT

### What We're Building

- **MCP (Model Context Protocol) Server** for Seam-Driven Development
- **Multi-AI Architecture**: Copilot (strategy/coordination) + Gemini (implementation/execution)
- **Core Philosophy**: "Seams First, Implementation Second" - build communication pathways before logic

### Current Challenge

The MCP server has enhanced tools imported but not properly registered. We need a **modular, scalable tool registry** that:

- Supports dynamic tool loading
- Enables A/B testing of tool versions
- Maintains clean separation of concerns
- Follows SDD principles religiously

---

## 🧩 SEAM-DRIVEN DEVELOPMENT (SDD) PRINCIPLES

### The Golden Rule

**"What seam am I building?"** - Ask this before writing ANY code.

### Core Workflow

1. **Identify Seams** → 2. **Define Contracts** → 3. **Create Stubs** → 4. **Test Connections** → 5. **Implement**

### Code Patterns (MANDATORY)

#### Contracts (Always Async)

```typescript
interface ComponentContract {
  method(input: InputType): Promise<ContractResult<OutputType>>;
}

type ContractResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
};
```

#### Stubs (Fail Fast)

```typescript
async method(input: InputType): Promise<ContractResult<OutputType>> {
  throw new NotImplementedError("ComponentContract.method", "Blueprint: TODO");
}
```

#### Error Handling

```typescript
try {
  if (!input) return { success: false, error: "Invalid input - failing fast" };
  return { success: true, data: result };
} catch (error) {
  await errorHandler.logError(error, context);
  return { success: false, error: error.message };
}
```

---

## 🔗 AI COLLABORATION PROTOCOL

### Your Role vs Copilot's Role

- **Copilot**: Strategic planning, architecture decisions, coordination, documentation
- **Gemini**: Implementation execution, code delivery, testing, detailed technical work

### Communication Channels

1. **`ai-collaboration/GEMINI_TASK_ASSIGNMENT.md`** - Your current tasks (READ FIRST!)
2. **`ai-collaboration/AI_COLLABORATION_LOG.md`** - Decision log (UPDATE after major decisions)
3. **`ai-collaboration/CURRENT_STATUS.md`** - Live project status (UPDATE after milestones)
4. **`ai-collaboration/GEMINI_CODE_DELIVERY.md`** - Your delivery template (USE for handoffs)

### Handoff Protocol

1. Read task assignment thoroughly
2. Implement using SDD principles
3. Test thoroughly
4. Document in delivery template
5. Update status and log
6. Archive completed work

---

## 📁 CRITICAL FILES & STRUCTURE

### Implementation Targets

- `src/index.ts` - Main server (needs tool registry integration)
- `src/contracts.ts` - Add ToolModule/ToolRegistry contracts
- `src/tool-registry.ts` - CREATE: Modular registry system
- `src/tools/*.ts` - Refactor existing tools as modules

### Foundation Components (DO NOT RECREATE)

- ConfigManager
- ErrorHandler
- TemplateProcessor
- ValidationEngine
- SDDAnalyzer
- SeamManager

### Import Convention

```typescript
import { seamManager } from "../seams.js"; // Always .js extensions
```

---

## 🎯 CURRENT TASK PRIORITY

### Phase 1: Modular Tool Registry (YOUR FOCUS)

Refer to `ai-collaboration/GEMINI_TASK_ASSIGNMENT.md` for detailed specifications.

**Key Deliverables:**

1. ToolModule interface contract
2. ToolRegistry system design
3. Enhanced tool registration
4. Backward compatibility layer
5. Integration tests

### Success Criteria

- [ ] All existing tools work without modification
- [ ] New tools can be added as modules
- [ ] A/B testing capability exists
- [ ] Performance improves or stays same
- [ ] 100% test coverage on registry

### **The Problem:**

```typescript
// CURRENT: Tools imported but NOT registered
import { handleEnhancedSeamAnalysis } from "./tools/enhanced-seam-analysis-tool.js";
// ❌ These tools are imported but never added to MCP server's tools array
```

### **The Solution Seams:**

1. **ToolRegistration Seam**: MCP Server ↔ Tool Registry
2. **ToolExecution Seam**: MCP Server ↔ Tool Registry
3. **ToolDiscovery Seam**: Tool Registry ↔ Tool Modules

---

## 📝 **REQUIRED CONTRACTS**

### **ToolModule Contract:**

```typescript
interface ToolModule {
  definition: ToolDefinition;
  handler: (args: any) => Promise<ContractResult<any>>;
  metadata: {
    name: string;
    version: string;
    dependencies?: string[];
  };
}
```

### **ToolRegistry Contract:**

```typescript
interface ToolRegistry {
  registerTool(module: ToolModule): Promise<ContractResult<void>>;
  getTools(): Promise<ContractResult<ToolDefinition[]>>;
  executeTool(name: string, args: any): Promise<ContractResult<any>>;
}
```

---

## 🏗️ **IMPLEMENTATION REQUIREMENTS**

### **Files to Create:**

1. **`src/tool-registry.ts`** - Core registry implementation
2. **Add contracts to `src/contracts.ts`** - ToolModule & ToolRegistry interfaces

### **Files to Refactor:**

1. **`src/tools/enhanced-seam-analysis-tool.ts`** - Convert to module format
2. **`src/tools/analyze-data-flows-tool.ts`** - Convert to module format
3. **`src/tools/generate-interaction-matrix-tool.ts`** - Convert to module format
4. **`src/tools/validate-seam-readiness-tool.ts`** - Convert to module format

### **Files to Update:**

1. **`src/index.ts`** - Integrate registry system (Copilot will handle this)

---

## 🛡️ **MANDATORY PATTERNS**

### **ContractResult Pattern:**

```typescript
// ALL async methods must return this
async methodName(input: InputType): Promise<ContractResult<OutputType>> {
  try {
    if (!input) {
      return { success: false, error: "Invalid input - failing fast" };
    }
    const result = await doSomething(input);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### **Blueprint Comments:**

```typescript
// Blueprint: This method registers a tool module with the registry
// Blueprint: Validates tool definition and metadata before registration
async registerTool(module: ToolModule): Promise<ContractResult<void>> {
  // Implementation here
}
```

### **Error Handling:**

```typescript
import { createSDDError } from "../contracts.js";

// Use SDDError for consistent error reporting
const error = createSDDError(
  "ToolRegistry",
  "ValidationError",
  "Tool definition is invalid",
  { toolName: module.metadata.name }
);
```

---

## 📁 **PROJECT FILE STRUCTURE**

```
src/
├── contracts.ts              # ✅ Contracts defined - ADD ToolModule/ToolRegistry
├── stubs.ts                  # ✅ Enhanced analyzer implemented
├── index.ts                  # ❌ Needs registry integration (Copilot handles)
├── tool-registry.ts          # ❌ CREATE THIS - Your main task
├── tools/
│   ├── enhanced-seam-analysis-tool.ts     # ❌ REFACTOR to module
│   ├── analyze-data-flows-tool.ts         # ❌ REFACTOR to module
│   ├── generate-interaction-matrix-tool.ts # ❌ REFACTOR to module
│   └── validate-seam-readiness-tool.ts    # ❌ REFACTOR to module
└── agents/
    └── sdd-analyzer.ts       # ✅ Enhanced analyzer logic
```

---

## 🚀 **SUCCESS CRITERIA**

### **✅ Must Achieve:**

1. All 4 enhanced tools properly registered and accessible
2. Clean, modular architecture that scales for future tools
3. All code follows SDD patterns (ContractResult<T>, error handling)
4. Backward compatibility maintained for existing 9 tools
5. TypeScript compilation successful
6. All existing MCP functionality unchanged

### **🛡️ SDD Compliance Checklist:**

- [ ] All contracts use `ContractResult<T>` pattern
- [ ] Error handling follows SDD patterns with SDDError
- [ ] Blueprint comments included for future implementation
- [ ] TypeScript types properly defined
- [ ] File imports use `.js` extensions
- [ ] Code follows existing naming conventions

---

## 📤 **DELIVERY INSTRUCTIONS**

### **When Complete, Update These Files:**

1. **`ai-collaboration/GEMINI_CODE_DELIVERY.md`**:

   ````markdown
   ## 🎯 Implementation Summary

   Brief overview of what was implemented

   ## 📁 File Changes

   ### File: `src/tool-registry.ts`

   **Action**: Created
   **Purpose**: Core tool registry implementation

   ```typescript
   // Complete file content here
   ```
   ````

   ```

   ```

2. **`ai-collaboration/CURRENT_STATUS.md`**:

   - Update progress tracking
   - Mark completed items ✅
   - Note any issues or blockers

3. **`ai-collaboration/AI_COLLABORATION_LOG.md`**:
   - Log major architectural decisions
   - Document any deviations from plan
   - Note handoff instructions for Copilot

---

## 🔍 **REFERENCE MATERIALS**

### **Key Files to Study:**

- `ai-collaboration/SDD_ARCHITECTURE_REFACTOR_PLAN.md` - Detailed implementation plan
- `src/index.ts` (lines 28-39) - Current tool imports
- `src/index.ts` (lines 92-300) - Current tool registration pattern
- `src/contracts.ts` - Existing contract patterns
- `ai-collaboration/GEMINI_INSTRUCTIONS.md` - Your detailed instructions

### **Existing Foundation (DO NOT RECREATE):**

- ConfigManager, ErrorHandler, TemplateProcessor
- ValidationEngine, SDDAnalyzer, SeamManager
- DevUtilities, PerformanceTracker

---

## 🚨 **CRITICAL REMINDERS**

1. **🍽️ EAT YOUR OWN DOG FOOD**: This is an SDD project - follow SDD strictly
2. **🔗 Seams Before Code**: Always identify seams before implementing
3. **📋 Contract Compliance**: Every async method returns ContractResult<T>
4. **🛡️ No Breaking Changes**: Maintain backward compatibility
5. **📤 Complete Delivery**: Provide full file contents, not snippets
6. **🤝 Clear Handoffs**: Include integration instructions for Copilot

---

## 🎯 **START HERE**

1. **Read**: `ai-collaboration/GEMINI_TASK_ASSIGNMENT.md` for complete task details
2. **Study**: `src/contracts.ts` and `src/index.ts` for existing patterns
3. **Plan**: Identify the seams you're building
4. **Implement**: Follow SDD methodology strictly
5. **Deliver**: Update collaboration files when complete

**Always ask**: "What seam am I building?" before writing any code.

🚀 **Ready to implement the modular tool registry architecture!**
