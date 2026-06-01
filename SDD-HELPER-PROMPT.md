# 🔗 SDD HELPER PROMPT FOR AI ASSISTANTS

## 🎯 **CRITICAL: Seam-Driven Development (SDD) Compliance Required**

This project follows **Seam-Driven Development (SDD)** methodology. You MUST follow these principles:

### **🏗️ SDD Core Philosophy: "Seams First, Implementation Second"**

**What is SDD?**

- Build communication pathways (seams) between components BEFORE implementations
- Seams = HOW components talk to each other
- Prevents integration hell by establishing contracts upfront

### **🔧 SDD Implementation Requirements:**

#### **1. Contract Pattern (Always Async)**

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

#### **2. Stub Pattern (Fail Fast)**

```typescript
async method(input: InputType): Promise<ContractResult<OutputType>> {
  throw new NotImplementedError("ComponentContract.method", "Blueprint: TODO description");
}
```

#### **3. Implementation Pattern**

```typescript
async method(input: InputType): Promise<ContractResult<OutputType>> {
  try {
    if (!input) return { success: false, error: "Invalid input - failing fast" };

    // Implementation logic here
    const result = await processLogic(input);

    return { success: true, data: result };
  } catch (error) {
    await errorHandler.logError(error, context);
    return { success: false, error: error.message };
  }
}
```

#### **4. Seam Communication**

```typescript
import { seamManager } from "../seams.js";
const result = await seamManager.executeSeam("SeamName", data);
```

### **📁 SDD File Organization**

- `src/contracts.ts` - Interfaces with ContractResult<T>
- `src/stubs.ts` - NotImplementedError skeletons
- `src/seams.ts` - Communication pathways
- `src/agents/` - Actual implementations
- Import with `.js` extensions: `'../contracts.js'`

### **🚨 SDD Workflow (MANDATORY ORDER)**

1. **Identify Seams** → What communication pathways exist?
2. **Define Contracts** → What are the interfaces with ContractResult<T>?
3. **Create Stubs** → Generate NotImplementedError skeletons
4. **Test Connections** → Verify seams work before implementation
5. **Implement** → Replace stubs with actual logic

### **🎯 For This Enhanced Seam Analyzer Project:**

#### **Current Seams:**

1. Requirements Analysis Seam: `analyzeRequirementsEnhanced()`
2. Interaction Matrix Seam: `generateInteractionMatrix()`
3. Data Flow Analysis Seam: `analyzeDataFlows()`
4. Seam Validation Seam: `validateSeamReadiness()`

#### **Integration Task:**

- Gemini created complete AI implementations (2139 lines)
- Current enhanced-seam-analyzer.ts has 30+ TypeScript errors
- Need to extract contract types and integrate Gemini's code following SDD patterns

### **⚠️ CRITICAL SDD COMPLIANCE RULES:**

1. **ALL methods must return Promise<ContractResult<T>>**
2. **Use NotImplementedError for incomplete functionality**
3. **Include input validation with fail-fast pattern**
4. **Wrap all logic in try-catch with error logging**
5. **Use seamManager for inter-component communication**

### **💰 SDD Priority Tags:**

- `💰 HIGH_ROI` - Quick wins, leverage existing patterns
- `🎯 CRITICAL` - Core seam connections, contracts
- `⚡ QUICK_WIN` - Simple implementations using foundation
- `🔨 HARD_WORK` - Complex logic, new patterns
- `🛡️ DEFENSIVE` - Error handling, validation

### **🚀 SDD Success Pattern:**

Before writing ANY code, always ask: **"What seam am I building?"**

**Remember**: This is SDD dogfooding - we must eat our own dog food and follow SDD principles strictly since this IS an SDD project.

---

**Use this helper prompt to ensure all implementations follow Seam-Driven Development methodology!**
