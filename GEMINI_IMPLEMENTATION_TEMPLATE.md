# 🧠 Gemini Intelligence Implementation Template

## 📋 **IMPLEMENTATION CHECKLIST**

The MCP infrastructure is 100% complete. We need Gemini to replace 4 NotImplementedError stubs in `src/agents/enhanced-seam-analyzer.ts`:

- [ ] `analyzeRequirementsEnhanced()` - Advanced NLP-based pattern recognition
- [ ] `generateInteractionMatrix()` - Systematic component relationship mapping  
- [ ] `analyzeDataFlows()` - Data transformation chain analysis with bottleneck detection
- [ ] `validateSeamReadiness()` - Comprehensive validation framework

## 🔧 **REQUIRED FORMAT**

Please provide implementations in this exact structure:

```markdown
# GEMINI ENHANCED SEAM ANALYZER IMPLEMENTATION

## IMPORTS AND DEPENDENCIES
```typescript
// Any new imports/dependencies needed beyond what's already in enhanced-seam-analyzer.ts
// Current imports: ContractResult, Enhanced interfaces, Zod schemas, errorHandler
```

## METHOD 1: analyzeRequirementsEnhanced
```typescript
async analyzeRequirementsEnhanced(input: SeamAnalysisInput): Promise<ContractResult<EnhancedSeamAnalysisResult>> {
  try {
    // Validation (keep existing)
    if (!input?.requirements?.length) {
      return { success: false, error: "Requirements array is required and cannot be empty" };
    }

    // GEMINI IMPLEMENTATION GOES HERE
    // Replace the NotImplementedError with actual AI logic
    
    return {
      success: true,
      data: {
        // EnhancedSeamAnalysisResult structure
      },
      metadata: {
        // Analysis metadata
      }
    };
  } catch (error) {
    await errorHandler.logError(error, { context: "Enhanced seam analysis", input });
    return { success: false, error: error.message };
  }
}
```

## METHOD 2: generateInteractionMatrix
```typescript
async generateInteractionMatrix(input: InteractionMatrixInput): Promise<ContractResult<InteractionMatrixResult>> {
  try {
    // Validation (keep existing)
    if (!input?.components?.length) {
      return { success: false, error: "Components array is required for interaction matrix generation" };
    }

    // GEMINI IMPLEMENTATION GOES HERE
    
    return {
      success: true,
      data: {
        // InteractionMatrixResult structure
      },
      metadata: {
        // Matrix generation metadata
      }
    };
  } catch (error) {
    await errorHandler.logError(error, { context: "Interaction matrix generation", input });
    return { success: false, error: error.message };
  }
}
```

## METHOD 3: analyzeDataFlows
```typescript
async analyzeDataFlows(input: DataFlowAnalysisInput): Promise<ContractResult<DataFlowAnalysisResult>> {
  try {
    // Validation (keep existing)
    if (!input?.dataFlows?.length) {
      return { success: false, error: "Data flows array is required for analysis" };
    }

    // GEMINI IMPLEMENTATION GOES HERE
    
    return {
      success: true,
      data: {
        // DataFlowAnalysisResult structure
      },
      metadata: {
        // Flow analysis metadata
      }
    };
  } catch (error) {
    await errorHandler.logError(error, { context: "Data flow analysis", input });
    return { success: false, error: error.message };
  }
}
```

## METHOD 4: validateSeamReadiness
```typescript
async validateSeamReadiness(input: SeamReadinessInput): Promise<ContractResult<SeamReadinessResult>> {
  try {
    // Validation (keep existing)
    if (!input?.seams?.length) {
      return { success: false, error: "Seams array is required for readiness validation" };
    }

    // GEMINI IMPLEMENTATION GOES HERE
    
    return {
      success: true,
      data: {
        // SeamReadinessResult structure
      },
      metadata: {
        // Validation metadata
      }
    };
  } catch (error) {
    await errorHandler.logError(error, { context: "Seam readiness validation", input });
    return { success: false, error: error.message };
  }
}
```
```

## 📚 **REFERENCE INFORMATION**

### Current File Location
- File: `src/agents/enhanced-seam-analyzer.ts`
- Class: `EnhancedSeamAnalyzer`
- Interface: `IEnhancedSeamAnalyzer` (from contracts.ts)

### Input/Output Types (from contracts.ts)
```typescript
// Input Types
interface SeamAnalysisInput { requirements: string[]; codebase?: string; constraints?: string[]; }
interface InteractionMatrixInput { components: ComponentInfo[]; relationships?: RelationshipInfo[]; }
interface DataFlowAnalysisInput { dataFlows: DataFlowInfo[]; components?: ComponentInfo[]; }
interface SeamReadinessInput { seams: SeamInfo[]; requirements?: string[]; }

// Output Types  
interface EnhancedSeamAnalysisResult { identifiedSeams: SeamInfo[]; patterns: SeamPattern[]; recommendations: string[]; }
interface InteractionMatrixResult { matrix: ComponentInteraction[][]; criticalPaths: string[]; bottlenecks: string[]; }
interface DataFlowAnalysisResult { flows: ProcessedDataFlow[]; bottlenecks: string[]; optimizations: string[]; }
interface SeamReadinessResult { readinessScores: SeamReadiness[]; blockers: string[]; recommendations: string[]; }
```

### Existing Infrastructure
- ✅ MCP Tools (4/4 complete)
- ✅ Intelligence Bridge (routing)
- ✅ Tool Registration (MCP server)
- ✅ Error Handling (errorHandler)
- ✅ Input Validation (Zod schemas)
- ✅ ContractResult<T> patterns

### SDD Compliance Requirements
- 🎯 **Fail Fast**: Return errors immediately for invalid inputs
- 🛡️ **Defensive**: Handle all edge cases gracefully  
- 💰 **HIGH_ROI**: Leverage existing validation and error handling
- 📊 **Rich Metadata**: Include analysis metrics in metadata field

## 🚀 **POST-IMPLEMENTATION STEPS**

Once Gemini provides the implementations:

1. **Replace stubs** in `src/agents/enhanced-seam-analyzer.ts`
2. **Add any new imports** at the top of the file
3. **Compile TypeScript**: `npm run build`
4. **Test MCP tools**: Run verification scripts
5. **Update documentation**: Mark intelligence layer complete

## 🎯 **SUCCESS CRITERIA**

- [ ] All 4 methods return proper ContractResult<T> format
- [ ] Input validation preserved (existing patterns)
- [ ] Error handling follows SDD principles
- [ ] TypeScript compilation succeeds (0 errors)
- [ ] MCP tools can call enhanced analyzer successfully
- [ ] Intelligence Bridge routing works end-to-end
