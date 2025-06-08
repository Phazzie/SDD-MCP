# 🧠 AI ASSISTANT HELPER PROMPT

## 📑 TABLE OF CONTENTS

1. [🎯 CONTEXT SUMMARY](#context-summary)
2. [📋 SITUATION BRIEF](#situation-brief)
3. [🔗 SEAM-DRIVEN DEVELOPMENT CONTEXT](#seam-driven-development-context)
4. [📁 KEY FILES & LOCATIONS](#key-files--locations)
5. [🎯 SPECIFIC METHODS TO INTEGRATE](#specific-methods-to-integrate)
6. [🚨 CURRENT PROBLEMS TO SOLVE](#current-problems-to-solve)
7. [🛠️ RECOMMENDED APPROACH](#recommended-approach)
8. [📖 CONVERSATION CONTEXT](#conversation-context)
9. [🧩 HELPER GUIDANCE](#helper-guidance)
10. [🔗 COMMUNICATION PATTERNS](#communication-patterns)
11. [🎯 SUCCESS METRICS](#success-metrics)

---

## 🎯 CONTEXT SUMMARY

You are helping integrate Gemini's comprehensive AI implementations into the Enhanced Seam Analyzer. This is NOT a new development task - it's an integration task where production-ready code exists but has integration conflicts.

## 📋 SITUATION BRIEF

- **Goal**: Replace NotImplementedError stubs with Gemini's actual AI implementations
- **Problem**: Incorrect partial implementations were created causing 30+ TypeScript errors
- **Solution**: Clean up conflicts and properly integrate Gemini's complete work
- **Timeline**: High priority integration task, implementations already exist

## 🔗 SEAM-DRIVEN DEVELOPMENT CONTEXT

This is an SDD (Seam-Driven Development) MCP server project. **WE MUST EAT OUR OWN DOG FOOD!**

### **SDD Principles to Follow**:

1. **Seams First** - Build communication pathways before implementations
2. **Contract-Driven** - All methods return `ContractResult<T>` with proper error handling
3. **Fail-Fast** - Input validation with immediate error returns
4. **Seam Communication** - Use `seamManager.executeSeam()` pattern where applicable

### **SDD Priority Tags** (use when making suggestions):

- `💰 HIGH_ROI` - Leverage existing patterns, template reuse, quick wins
- `🎯 CRITICAL` - Core seam connections, integration pathways, contract definitions
- `⚡ QUICK_WIN` - Simple implementations using existing foundation
- `🛡️ DEFENSIVE` - Error handling, validation, fail-fast implementations

## 📁 KEY FILES & LOCATIONS

### **Critical Files**:

- **Gemini's Work**: `c:/Users/thump/SkepticalWombat/geminiintelligencetasksfirstresults` (2139 lines)
- **Broken Code**: `c:/Users/thump/SkepticalWombat/src/agents/enhanced-seam-analyzer.ts`
- **Contracts**: `c:/Users/thump/SkepticalWombat/src/contracts.ts`
- **Integration Guide**: `c:/Users/thump/SkepticalWombat/URGENT-GEMINI-INTEGRATION-GUIDE.md`

### **Project Structure**:

```
src/
├── contracts.ts              # Interface definitions (partially incomplete)
├── stubs.ts                  # NotImplementedError templates
├── seams.ts                  # Communication pathways
├── agents/
│   ├── enhanced-seam-analyzer.ts  # TARGET FILE (has errors)
│   ├── config-manager.ts          # Working foundation
│   ├── error-handler.ts           # Working foundation
│   └── template-processor.ts      # Working foundation
templates/                    # Handlebars templates
docs/                        # Documentation
```

## 🎯 SPECIFIC METHODS TO INTEGRATE

### **Method Status Overview**:

| Method                        | Gemini Implementation | Current Status         | Lines in geminiintelligencetasksfirstresults |
| ----------------------------- | --------------------- | ---------------------- | -------------------------------------------- |
| `analyzeRequirementsEnhanced` | ✅ Complete           | ❌ Partially broken    | ~200-800                                     |
| `generateInteractionMatrix`   | ✅ Complete           | ❌ NotImplementedError | ~800-1200                                    |
| `analyzeDataFlows`            | ✅ Complete           | ❌ NotImplementedError | ~1200-1800                                   |
| `validateSeamReadiness`       | 🟡 Partial            | ❌ NotImplementedError | ~1800-2139                                   |

### **Method Signatures** (must match contracts.ts):

```typescript
// Method 1: Advanced NLP-based pattern recognition
async analyzeRequirementsEnhanced(input: SeamAnalysisInput): Promise<ContractResult<EnhancedSeamAnalysis>>

// Method 2: Systematic component relationship mapping
async generateInteractionMatrix(input: InteractionMatrixInput): Promise<ContractResult<InteractionMatrix>>

// Method 3: Comprehensive data flow analysis
async analyzeDataFlows(input: DataFlowAnalysisInput): Promise<ContractResult<RichDataFlowAnalysis>>

// Method 4: Multi-dimensional seam validation
async validateSeamReadiness(input: SeamValidationInput): Promise<ContractResult<RichSeamValidationResult>>
```

## 🚨 CURRENT PROBLEMS TO SOLVE

### **TypeScript Compilation Errors** (30+):

- Missing `SeamRecommendation` interface in contracts.ts
- Type mismatches between `DataFlowAnalysis` vs `RichDataFlowAnalysis`
- Duplicate method implementations causing conflicts
- Missing properties on contract types (e.g., `isValid` on `ValidatedInteraction`)
- Array type conflicts (string[] vs ComponentCandidate[])

### **Integration Issues**:

- Incorrect implementations created instead of using Gemini's work
- Contract types incomplete compared to Gemini's comprehensive definitions
- Method return types don't match contract interfaces

## 🛠️ RECOMMENDED APPROACH

### **Phase 1: Assessment** (⚡ QUICK_WIN)

1. Read current errors: `npx tsc --noEmit`
2. Examine Gemini's contract types in `geminiintelligencetasksfirstresults`
3. Identify missing/incorrect contract definitions

### **Phase 2: Contract Fixes** (🎯 CRITICAL)

1. Extract ALL contract types from Gemini's work (lines 1-200 have extensive type definitions)
2. Add missing interfaces to `src/contracts.ts`: `SeamRecommendation`, `ComponentCandidate`, etc.
3. Update existing interfaces to match Gemini's implementations

### **Phase 3: Method Integration** (💰 HIGH_ROI)

1. **ONE METHOD AT A TIME** - don't try to fix everything at once
2. Remove duplicate/conflicting implementations
3. Copy Gemini's actual implementations preserving their helper methods
4. Test compilation after each method integration

### **Phase 4: Verification** (🛡️ DEFENSIVE)

1. Zero TypeScript errors: `npx tsc --noEmit`
2. Tests pass: `npm test`
3. MCP integration works: `node test-mcp-tools.js`

## 📖 CONVERSATION CONTEXT

### **What Happened Before**:

1. Enhanced Seam Analyzer was created with NotImplementedError stubs
2. Gemini was asked to implement AI-powered intelligence for all 4 methods
3. Gemini created comprehensive, production-ready implementations
4. Instead of integrating Gemini's work, incorrect partial implementations were created
5. This caused compilation errors and conflicts with Gemini's contract types

### **What Needs to Happen Now**:

1. Clean up the incorrect implementations that were created
2. Properly integrate Gemini's actual, complete implementations
3. Fix contract type definitions to match Gemini's comprehensive types
4. Verify everything compiles and works with existing MCP infrastructure

## 🧩 HELPER GUIDANCE

### **When User Asks About**:

- **"Fix compilation errors"** → Start with contracts.ts, add missing types from Gemini's work
- **"Implement method X"** → Don't reimplement! Extract from `geminiintelligencetasksfirstresults`
- **"Add AI intelligence"** → It already exists in Gemini's file, needs integration
- **"Make tests pass"** → Fix type definitions first, then method integration

### **Code Quality Expectations**:

- ✅ Gemini's implementations are sophisticated (NLP, graph algorithms, performance analysis)
- ✅ They include comprehensive error handling and SDD compliance
- ✅ They have extensive helper method decomposition
- ❌ Don't recreate or simplify - use their actual production-ready code

### **Integration Priorities**:

1. **🎯 CRITICAL**: Contract type definitions (foundation for everything)
2. **💰 HIGH_ROI**: Method integration one at a time (proven implementations)
3. **⚡ QUICK_WIN**: Remove conflicts before adding new code
4. **🛡️ DEFENSIVE**: Test after each change to catch issues early

## 🔗 COMMUNICATION PATTERNS

### **Error Handling** (SDD Compliance):

```typescript
return {
  success: false,
  error: createSDDError(this.agentId, "ErrorType", "message", {
    seamName: "...",
  }),
  metadata: {
    agentId: this.agentId,
    timestamp: new Date().toISOString(),
    seamName: "...",
  },
};
```

### **Success Response**:

```typescript
return {
  success: true,
  data: resultData,
  metadata: {
    agentId: this.agentId,
    timestamp: new Date().toISOString(),
    seamName: "...",
  },
};
```

## 🎯 SUCCESS METRICS

### **Integration Complete When**:

- ✅ `npx tsc --noEmit` shows zero errors
- ✅ All 4 methods have Gemini's actual implementations (not NotImplementedError)
- ✅ `npm test` passes without issues
- ✅ MCP tools can use enhanced seam analysis features
- ✅ Contract types match implementation requirements

### **Quality Indicators**:

- Methods include sophisticated AI logic (not simple keyword matching)
- Helper methods are comprehensive and well-decomposed
- Error handling follows SDD patterns consistently
- Type safety is maintained throughout

---

**🔑 KEY INSIGHT**: This is integration work, not development work. Gemini already built the AI intelligence - your job is to properly connect it to the existing MCP infrastructure without breaking the seam contracts.
