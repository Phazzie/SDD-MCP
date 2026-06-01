# 🚀 **GEMINI PROMPT: Phase A Tool Migration**

---

## 📋 **COPY-PASTE PROMPT FOR GEMINI**

````
Hi Gemini! I'm working on my SDD MCP Server project with GitHub Copilot, and we've set up a multi-AI collaboration framework. Copilot has assigned you Phase A of our tool registry refactor.

🎯 **Your Task**: Convert 4 enhanced tools to work with our new modular registry system.

📍 **Context**: We've built a ToolRegistry infrastructure but need to migrate existing tools to use it. This is pure implementation work - perfect for your pattern application skills!

� **ESSENTIAL CONTEXT FILES** (Read These First):
- `ai-collaboration/GEMINI_TASK_ASSIGNMENT_PHASE_A.md` - Complete task specification
- `ai-collaboration/DETAILED_COMPLETION_ROADMAP.md` - Full refactor context
- `ai-collaboration/CURRENT_STATUS.md` - Project status and next steps
- `src/contracts.ts` - Contains ToolModuleContract interface (lines 200+ for ToolModuleContract)
- `src/tool-registry.ts` - Shows how modules will be used (reference only)

🔧 **FILES TO MODIFY** (4 files - add pattern to each):
1. `src/tools/enhanced-seam-analysis-tool.ts` - Current: ENHANCED_SEAM_ANALYSIS_TOOL_DEFINITION + handleEnhancedSeamAnalysis
2. `src/tools/analyze-data-flows-tool.ts` - Current: ANALYZE_DATA_FLOWS_TOOL_DEFINITION + handleAnalyzeDataFlows
3. `src/tools/generate-interaction-matrix-tool.ts` - Current: GENERATE_INTERACTION_MATRIX_TOOL_DEFINITION + handleGenerateInteractionMatrix
4. `src/tools/validate-seam-readiness-tool.ts` - Current: VALIDATE_SEAM_READINESS_TOOL_DEFINITION + handleValidateSeamReadiness

**Pattern to Add** (to each file):
```typescript
// Add this import at top
import { ToolModuleContract } from "../contracts.js";

// Add this export at bottom (keep ALL existing exports!)
export const toolNameModule: ToolModuleContract = {
  definition: EXISTING_TOOL_DEFINITION_NAME,
  handler: existingHandlerFunctionName,
  metadata: {
    name: "tool-name",
    version: "1.0.0",
    category: "sdd-analysis", // or "sdd-validation" for validate-seam-readiness
    dependencies: []
  }
};
````

**Specific Module Names & Categories**:

- `enhancedSeamAnalysisModule` → category: "sdd-analysis"
- `analyzeDataFlowsModule` → category: "sdd-analysis"
- `generateInteractionMatrixModule` → category: "sdd-analysis"
- `validateSeamReadinessModule` → category: "sdd-validation"

� **REFERENCE ARCHITECTURE FILES** (For Understanding):

- `src/adapters/legacy-tool-adapter.ts` - Shows tool module pattern
- `ai-collaboration/examples/tool-registry-integration-example.ts` - Usage examples
- `src/index.ts` - Current MCP server (will be modified in Phase B)

🛡️ **CRITICAL REQUIREMENTS**:

- ✅ **KEEP ALL EXISTING EXPORTS** - Don't remove anything
- ✅ **ADD NEW EXPORTS ONLY** - Pure additive changes
- ✅ **Backward Compatibility** - Existing imports must still work
- ✅ **Exact Naming** - Follow module naming convention precisely

✅ **Success Criteria**:

1. All 4 files have new ToolModuleContract exports
2. All existing exports still work unchanged
3. TypeScript compiles: `npm run build` (zero errors)
4. Consistent naming and metadata structure
5. Proper import of ToolModuleContract from "../contracts.js"

🤝 **After Completion**:

1. Test compilation: `npm run build`
2. Update `ai-collaboration/CURRENT_STATUS.md` - mark Phase A complete
3. Notify completion for Copilot to start Phase B (registry integration)

📍 **GitHub Repository**: https://github.com/Phazzie/SDD-MCP.git (Branch: feature/enhanced-seam-analysis)

Ready to start? Begin with `enhanced-seam-analysis-tool.ts` and apply the same pattern to all 4 files!

```

---

## 📋 **ALTERNATIVE SHORTER PROMPT**

```

Hi Gemini! Continuing SDD MCP Server project with Copilot collaboration.

**Your Task**: Phase A - Convert 4 tools to registry format

📁 **ESSENTIAL FILES TO READ**:

- `ai-collaboration/GEMINI_TASK_ASSIGNMENT_PHASE_A.md` - Full task details
- `ai-collaboration/CURRENT_STATUS.md` - Project status
- `src/contracts.ts` - ToolModuleContract interface (around line 200+)

**FILES TO MODIFY** (4 total):

- `src/tools/enhanced-seam-analysis-tool.ts`
- `src/tools/analyze-data-flows-tool.ts`
- `src/tools/generate-interaction-matrix-tool.ts`
- `src/tools/validate-seam-readiness-tool.ts`

**Add to each** (keep existing exports):

```typescript
import { ToolModuleContract } from "../contracts.js";

export const toolNameModule: ToolModuleContract = {
  definition: EXISTING_TOOL_DEFINITION,
  handler: existingHandlerFunction,
  metadata: {
    name: "tool-name",
    version: "1.0.0",
    category: "sdd-analysis", // or "sdd-validation" for validate tool
    dependencies: [],
  },
};
```

**Module names**:

- `enhancedSeamAnalysisModule` (sdd-analysis)
- `analyzeDataFlowsModule` (sdd-analysis)
- `generateInteractionMatrixModule` (sdd-analysis)
- `validateSeamReadinessModule` (sdd-validation)

📋 **REFERENCE FILES**:

- `src/tool-registry.ts` - How modules are used
- `src/adapters/legacy-tool-adapter.ts` - Pattern example
- `ai-collaboration/DETAILED_COMPLETION_ROADMAP.md` - Full context

**Test**: `npm run build` should compile without errors

**After**: Update `ai-collaboration/CURRENT_STATUS.md` to mark Phase A complete

**GitHub**: https://github.com/Phazzie/SDD-MCP.git (feature/enhanced-seam-analysis)

Ready to implement!

```

```
