# 🔧 SDD Tool Integration Pattern - Reality-Based Repair

## 🎯 **PROVEN SUCCESS PATTERN**

_Successfully used to fix sdd-create-stub-tool from 5 errors → 0 errors_

## 📋 **Step-by-Step Process**

### **Phase 1: Reality Analysis**

_"What does the tool actually expect/produce?"_

1. **Analyze Actual Tool Requirements**

   ```bash
   npx tsc --noEmit src/tools/legacy/[tool-name].ts
   ```

   - Document ALL compilation errors
   - Focus on type mismatches, missing imports, interface violations

2. **Identify Real Input/Output Structure**
   - Read the tool's actual function signatures
   - Note what types it expects vs what contracts.ts provides
   - Find the disconnect between reality and contracts

### **Phase 2: Contract Alignment**

_"Fix contracts to match reality, not the other way around"_

3. **Update contracts.ts to Match Tool Reality**

   ```typescript
   // BEFORE: What we wished the tool used
   interface StubCreationInput {
     /* wishful thinking */
   }

   // AFTER: What the tool actually expects
   interface CreateStubInput {
     /* reality-based */
   }
   ```

4. **Fix Import/Export Mismatches**
   - Correct interface names: `StubCreationInput` → `CreateStubInput`
   - Fix property names: `definition` → `toolDefinition`, `handler` → `execute`
   - Remove invalid properties: `metadata` (not in ToolModuleContract)

### **Phase 3: Seam Connection**

_"Connect the seam to the real tool"_

5. **Update seams.ts Import Path**

   ```typescript
   // Fix import to actual contracts
   import /* types */ "./contracts.js"; // not contracts-new.js
   ```

6. **Connect Seam to Real Tool**
   ```typescript
   // Ensure seam points to actual compiled tool
   import { TOOL_MODULE_CONTRACT } from "../tools/legacy/sdd-create-stub-tool.js";
   ```

### **Phase 4: Type Error Resolution**

_"Fix remaining implementation mismatches"_

7. **Initialize Required Class Properties**

   ```typescript
   // Add missing initializations
   private readonly agentId = "ToolName";
   private readonly version = "2.0.0";
   ```

8. **Fix Type Conversion Errors**

   ```typescript
   // WRONG: Invalid cast between incompatible types
   return processedContract as ContractResult<OutputType>;

   // RIGHT: Proper error propagation
   return {
     success: false,
     error: processedContract.error,
     metadata: processedContract.metadata,
   };
   ```

### **Phase 5: Verification**

_"Prove the integration works"_

9. **Compile and Test**

   ```bash
   npx tsc  # Should compile cleanly
   node test-[tool-name]-seam.js  # Should connect successfully
   ```

10. **Document Results**
    - ✅ Zero compilation errors
    - ✅ Seam connection working
    - ✅ Tool throws NotImplementedError (correct SDD behavior)

## 🚫 **ANTI-PATTERNS TO AVOID**

❌ **Don't Fix Tools to Match Contracts** - Fix contracts to match reality  
❌ **Don't Ignore Type Mismatches** - Each error points to a real disconnect  
❌ **Don't Skip Verification** - Untested "fixes" often hide deeper problems  
❌ **Don't Implement Business Logic First** - Infrastructure must be solid

## ✅ **SUCCESS CRITERIA**

- **Zero TypeScript compilation errors**
- **Seam connection test passes**
- **Tool throws NotImplementedError** (not type errors)
- **Input validation works**
- **Error handling is consistent**

## 🔄 **REPEATABLE VERIFICATION TEMPLATE**

```javascript
// test-[tool-name]-seam.js
import { seamManager } from "./src/seams.js";

const testInput = {
  // Structure matching the tool's actual expectations
};

console.log("🔧 Testing [ToolName] Seam Connection");
console.log("Input:", JSON.stringify(testInput, null, 2));

try {
  const result = await seamManager.executeSeam("[SeamName]", testInput);
  console.log("🎯 SEAM EXECUTION RESULT:");
  console.log("Success:", result.success);

  if (!result.success) {
    console.log("❌ Seam execution failed:", result.error);
  } else {
    console.log("✅ Seam connection working! Data:", result.data);
  }
} catch (error) {
  console.error("💥 Seam test failed:", error.message);
}
```

## 📊 **PROVEN RESULTS**

**sdd-create-stub-tool.ts:**

- **Before**: 5 compilation errors, broken seam connection
- **After**: 0 compilation errors, working seam connection
- **Time**: ~30 minutes following this pattern
- **Verification**: NotImplementedError (correct SDD behavior)

## 🚀 **SUCCESSFUL REWRITE RESULTS**

### **✅ sdd-analyze-requirements-tool.ts - CLEAN REWRITE SUCCESS**

**Pattern Applied**: Template from `sdd-create-stub-tool.ts`  
**Time**: ~20 minutes  
**Result**: **PERFECT SEAM CONNECTION**

```
🔧 Testing AnalyzeRequirements Seam Connection
🎯 SEAM EXECUTION RESULT:
Success: false
❌ Seam execution failed: Requirements analysis failed: SDDAnalyzeRequirementsTool.processRequirements not implemented
```

**✅ This is EXACTLY the correct behavior:**

- ✅ Seam connection works
- ✅ Tool executes and validates input
- ✅ Proper ContractResult<T> structure
- ✅ NotImplementedError for business logic (as designed)

**🔄 REWRITE PATTERN VALIDATION:**

1. **Template from working tool** ✅
2. **Contract compliance first** ✅
3. **Seam connection test** ✅
4. **Business logic as NotImplementedError** ✅
5. **Clean compilation** ✅

**📊 Comparison:**

- **Legacy tools**: 128-393 compilation errors, broken dependencies
- **Clean rewrite**: 0 compilation errors, working seam connection in 20 minutes

**Next tool ready for same pattern: `sdd-visualize-architecture-tool.ts`**

## 🎯 **NEXT APPLICATION TARGETS**

1. **sdd-analyze-requirements-tool.ts** - Apply this pattern
2. **sdd-generate-contract-tool.ts** - Apply this pattern
3. **sdd-orchestrate-workflow-tool.ts** - Apply this pattern
4. **All remaining tools** - Use this documented process

**📝 Pattern Author**: GitHub Copilot  
**📅 Pattern Validated**: June 10, 2025  
**🏷️ Tags**: `SDD`, `Tool Integration`, `Reality-Based`, `TypeScript`, `Seam Connection`
