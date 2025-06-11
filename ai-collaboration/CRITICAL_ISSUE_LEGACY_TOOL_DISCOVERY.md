# 🚨 Critical Issue Report - Legacy Tool Discovery

**Issue ID**: CRIT-001  
**Date Discovered**: June 5, 2025  
**Discovered By**: GitHub Copilot (during V&V Phase)  
**Severity**: HIGH  
**Status**: 🔴 **OPEN** - Immediate fix required

---

## 📋 **Issue Summary**

**Problem**: MCP clients cannot discover legacy SDD tools through the `ListTools` request.

**Root Cause**: The `ListToolsRequestSchema` handler in `src/index.ts` only returns tools from the ToolRegistry, excluding legacy tools that are still handled via switch-case.

**Impact**: 6 legacy tools are effectively "hidden" from MCP client discovery:

- `sdd_analyze_requirements`
- `sdd_generate_contract`
- `sdd_create_stub`
- `sdd_orchestrate_full_workflow`
- `sdd_visualize_architecture`
- `sdd_validate_compliance`

---

## 🔍 **Technical Details**

### **Current Broken Code** (`src/index.ts` lines ~90-99)

```typescript
server.setRequestHandler(ListToolsRequestSchema, async () => {
  try {
    const result = await toolRegistry.getTools();
    if (!result.success) {
      throw new Error(result.error || "Failed to get tools from registry");
    }
    return { tools: result.data || [] }; // ❌ ONLY REGISTRY TOOLS
  } catch (error) {
    console.error("❌ Tool discovery failed:", error);
    throw error;
  }
});
```

### **Expected Behavior**

Should return:

- **4 Registry Tools**: `enhanced_seam_analysis`, `analyze_data_flows`, `generate_interaction_matrix`, `validate_seam_readiness`
- **6 Legacy Tools**: All `sdd_*` prefixed tools

### **Required Fix Strategy**

1. Create static definitions for legacy tools
2. Merge registry tools with legacy tool definitions
3. Return unified tool list in `ListToolsRequestSchema` handler

---

## 🛠️ **Proposed Solution**

### **Step 1: Add Legacy Tool Definitions**

Add to `src/index.ts` before the server handlers:

```typescript
// 🔧 LEGACY: Static tool definitions for backward compatibility
// TODO: Migrate these to registry in Phase C
const LEGACY_TOOL_DEFINITIONS: Tool[] = [
  {
    name: "sdd_analyze_requirements",
    description:
      "Analyze PRD/requirements and identify all component seams for SDD implementation",
    inputSchema: {
      type: "object",
      properties: {
        prdText: {
          type: "string",
          description:
            "The Product Requirements Document or project description text",
        },
        designNotes: {
          type: "string",
          description: "Optional additional design notes or constraints",
        },
      },
      required: ["prdText"],
    },
  },
  // ... (add remaining 5 legacy tools)
];
```

### **Step 2: Merge in ListTools Handler**

```typescript
server.setRequestHandler(ListToolsRequestSchema, async () => {
  try {
    // Get registry tools
    const registryResult = await toolRegistry.getTools();
    if (!registryResult.success) {
      throw new Error(
        registryResult.error || "Failed to get tools from registry"
      );
    }

    // Merge registry and legacy tools
    const allTools = [
      ...(registryResult.data || []),
      ...LEGACY_TOOL_DEFINITIONS,
    ];

    return { tools: allTools };
  } catch (error) {
    console.error("❌ Tool discovery failed:", error);
    throw error;
  }
});
```

---

## ✅ **Verification Steps**

After implementing the fix:

1. **Compile Check**: `npm run build` should pass
2. **Tool Count Verification**: MCP client should see 10 total tools (4 registry + 6 legacy)
3. **Tool Execution Test**: All tools (both registry and legacy) should execute correctly
4. **Backward Compatibility**: Existing MCP clients should continue working

---

## 📊 **Impact Assessment**

### **Pre-Fix State**

- ✅ Enhanced tools (4): Discoverable and executable via registry
- ❌ Legacy tools (6): Executable but NOT discoverable
- **Client Experience**: Appears as if only 4 tools exist

### **Post-Fix State**

- ✅ Enhanced tools (4): Discoverable and executable via registry
- ✅ Legacy tools (6): Discoverable and executable via switch-case
- **Client Experience**: All 10 tools visible and functional

---

## 🎯 **Priority & Timeline**

**Priority**: P0 (Critical - blocks basic functionality)  
**Effort**: 30-45 minutes  
**Dependencies**: None  
**Blocking**: Complete V&V phase, Phase C planning

**Recommended Timeline**:

- **Immediate**: Implement fix
- **Next 1 hour**: Test and validate
- **Following session**: Complete V&V and plan Phase C

---

## 📝 **Next Steps**

1. **Implement Solution**: Add legacy tool definitions and merge logic
2. **Test Fix**: Verify all 10 tools are discoverable and executable
3. **Update Documentation**: Note the hybrid discovery approach
4. **Plan Migration**: Include legacy tool migration in Phase C scope
5. **Close Issue**: Mark as resolved after successful testing

---

**Assignee**: Next developer (as per turnover process)  
**Expected Resolution**: Within 1 hour of assignment
