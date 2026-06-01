# 🎯 Phase B: Tool Registry Integration Roadmap

## **Current State**

- ✅ Phase A Complete: All enhanced tools export ToolModuleContract
- ❌ Main server (src/index.ts) still uses hardcoded tool registration
- ⚠️ Mock intelligence bridges present in tools (temporary)
- ✅ ToolRegistry class implemented and ready

## **Phase B Tasks**

### **🔧 Step 1: Create Tool Registration Setup**

**File**: `src/tool-registry-setup.ts`
**Purpose**: Centralize all tool registrations for the server

```typescript
// Import all enhanced tools and register them with the registry
import { ToolRegistry } from "./tool-registry.js";
import { enhancedSeamAnalysisTool } from "./tools/enhanced-seam-analysis-tool.js";
// ... other tools

export async function setupToolRegistry(): Promise<ToolRegistry> {
  const registry = new ToolRegistry();
  await registry.registerTool(enhancedSeamAnalysisTool);
  // ... register other tools
  return registry;
}
```

### **🔄 Step 2: Replace Hardcoded Tool Discovery**

**File**: `src/index.ts` - ListToolsRequestSchema handler
**Current**: Hardcoded tool definitions array
**Replace with**: Registry-based tool discovery

```typescript
// OLD: Hardcoded tools array
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      /* hardcoded tools */
    ],
  };
});

// NEW: Registry-based discovery
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = await toolRegistry.listTools();
  return { tools: tools.data || [] };
});
```

### **🎯 Step 3: Replace Hardcoded Tool Execution**

**File**: `src/index.ts` - CallToolRequestSchema handler  
**Current**: Switch-case with hardcoded handlers
**Replace with**: Registry-based execution

```typescript
// OLD: Switch-case hardcoded
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (name) {
    case "enhanced_seam_analysis":
      return await handleEnhancedSeamAnalysisWrapper(args);
    // ... more cases
  }
});

// NEW: Registry-based execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const result = await toolRegistry.executeTool(name, args);
  return result.data;
});
```

### **🛠️ Step 4: Remove Mock Intelligence Bridges**

**Files**: All tool files in `src/tools/`
**Purpose**: Replace mock bridges with real mcpIntelligenceBridge

```typescript
// Current: Mock bridge in ToolModuleContract handler
const mockIntelligenceBridge = {
  /* mock */
};
return handleTool(args, mockIntelligenceBridge);

// Replace with: Real bridge
import { mcpIntelligenceBridge } from "../agents/mcp-intelligence-bridge.js";
return handleTool(args, mcpIntelligenceBridge);
```

### **✅ Step 5: Integration Testing**

**Purpose**: Verify the complete registry system works end-to-end

1. Run TypeScript compilation: `npm run build`
2. Test tool discovery: List all registered tools
3. Test tool execution: Execute each enhanced tool
4. Verify no mock dependencies remain

### **📋 Step 6: Documentation Update**

**Files**:

- `ai-collaboration/CURRENT_STATUS.md`
- `README.md`
- `PHASE_B_COMPLETION_SUMMARY.md` (new)

## **Success Criteria**

- [ ] ToolRegistry fully integrated into main server
- [ ] No hardcoded tool definitions or handlers
- [ ] No mock intelligence bridges in production
- [ ] All tools accessible via registry
- [ ] TypeScript compilation passes
- [ ] End-to-end functionality verified

## **Risk Mitigation**

- **Backup Strategy**: Keep existing hardcoded handlers commented out during transition
- **Rollback Plan**: Quick revert to hardcoded approach if registry fails
- **Testing Strategy**: Validate each tool individually before full integration

## **Estimated Effort**

- **Setup & Discovery**: 30 minutes
- **Execution Integration**: 45 minutes
- **Mock Removal**: 30 minutes
- **Testing & Validation**: 30 minutes
- **Documentation**: 15 minutes
- **Total**: ~2.5 hours

## **Next Steps After Phase B**

1. Plan Phase C: Advanced registry features (versioning, A/B testing)
2. Implement additional SDD tools using ToolModuleContract pattern
3. Create comprehensive tool development guide
4. Optimize performance and add monitoring
