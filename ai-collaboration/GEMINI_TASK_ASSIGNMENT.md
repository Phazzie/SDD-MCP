# 🎯 Task Assignment for Gemini

## Current Task Status: READY FOR ASSIGNMENT

### Task Priority: 🎯 CRITICAL - Architecture Refactor

---

## 📋 TASK: MCP Tool Architecture Refactor (Phase 1)

### Context

The SDD MCP Server currently has enhanced analyzer tools implemented but not properly registered in the MCP server. We need to refactor the tool registration architecture to be modular and scalable.

### 🔗 Seam Identification

**Primary Seam**: Tool Registration Interface

- **Source**: MCP Server (`src/index.ts`)
- **Target**: Tool Modules (`src/tools/*.ts`)
- **Data Flow**: BOTH (registration + execution)
- **Purpose**: Modular, scalable tool registration system

### 📝 Contracts Required

```typescript
// Tool Module Contract
interface ToolModule {
  definition: ToolDefinition;
  handler: (args: any) => Promise<ContractResult<any>>;
  metadata: {
    name: string;
    version: string;
    dependencies?: string[];
  };
}

// Tool Registry Contract
interface ToolRegistry {
  registerTool(module: ToolModule): Promise<ContractResult<void>>;
  getTools(): Promise<ContractResult<ToolDefinition[]>>;
  executeTool(name: string, args: any): Promise<ContractResult<any>>;
}
```

### 🎯 Implementation Requirements

1. **Create Tool Registry System** (`src/tool-registry.ts`)

   - Implements ToolRegistry contract
   - Auto-discovery of tool modules
   - Error handling and validation
   - SDD-compliant patterns

2. **Refactor Tool Modules** (`src/tools/*.ts`)

   - Each tool becomes self-contained module
   - Implements ToolModule contract
   - Exports definition + handler + metadata
   - Follows SDD naming conventions

3. **Update MCP Server** (`src/index.ts`)
   - Replace hardcoded tool array with registry
   - Replace switch statement with registry.executeTool()
   - Maintain backward compatibility during transition
   - Clean, minimal orchestration layer

### 📁 Files to Create/Modify

**New Files:**

- `src/tool-registry.ts` - Core registry implementation
- `src/contracts.ts` - Add ToolModule and ToolRegistry contracts

**Modified Files:**

- `src/tools/enhanced-seam-analysis-tool.ts` - Convert to module
- `src/tools/analyze-data-flows-tool.ts` - Convert to module
- `src/tools/generate-interaction-matrix-tool.ts` - Convert to module
- `src/tools/validate-seam-readiness-tool.ts` - Convert to module
- `src/index.ts` - Integrate registry system

### 🛡️ Success Criteria

1. ✅ All 4 enhanced tools properly registered and accessible
2. ✅ Clean, modular architecture that scales for future tools
3. ✅ All code follows SDD patterns (ContractResult<T>, error handling)
4. ✅ Backward compatibility maintained for existing tools
5. ✅ TypeScript compilation successful
6. ✅ All existing MCP functionality unchanged

### 🔄 Handoff Instructions

**When Complete:**

1. Update `GEMINI_CODE_DELIVERY.md` with all code changes
2. Update `CURRENT_STATUS.md` with implementation status
3. Log major architectural decisions in `AI_COLLABORATION_LOG.md`
4. Provide integration testing instructions

### 📚 Reference Materials

- Current tool implementations: `src/tools/*.ts`
- MCP server structure: `src/index.ts` (lines 28-39, 92-300)
- SDD patterns: `.github/copilot-instructions.md`
- Contract patterns: `src/contracts.ts`

---

## 🚀 Ready for Implementation

**Assigned Date**: June 3, 2025  
**Expected Completion**: Within 4-6 hours  
**Next Review**: Upon delivery to `GEMINI_CODE_DELIVERY.md`
