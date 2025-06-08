# 📋 SDD Architecture Refactor Plan

## 🎯 Project: MCP Tool Registry Modular Architecture

**Objective**: Transform hardcoded tool registration into a modular, scalable architecture following SDD principles.

---

## 🔗 Phase 1: Seam Analysis

### Primary Seams Identified

| Seam Name            | Source        | Target        | Data Flow | Purpose                       |
| -------------------- | ------------- | ------------- | --------- | ----------------------------- |
| **ToolRegistration** | MCP Server    | Tool Registry | IN        | Register tool modules         |
| **ToolExecution**    | MCP Server    | Tool Registry | BOTH      | Execute registered tools      |
| **ToolDiscovery**    | Tool Registry | Tool Modules  | OUT       | Auto-discover available tools |
| **ToolDefinition**   | Tool Modules  | MCP Server    | OUT       | Provide tool schemas          |

### Secondary Seams

| Seam Name         | Source        | Target            | Data Flow | Purpose                      |
| ----------------- | ------------- | ----------------- | --------- | ---------------------------- |
| **ErrorHandling** | Tool Registry | Error System      | OUT       | Propagate tool errors        |
| **Validation**    | Tool Registry | Validation Engine | BOTH      | Validate tool inputs/outputs |
| **Logging**       | Tool Registry | DevUtilities      | OUT       | Tool execution metrics       |

---

## 📝 Phase 2: Contract Definitions

### Core Contracts

## 🧩 Validation & Extensibility Requirements (NEW)

- Validation engine and all core tools must:
  - Support loading rules/configuration from external files or plugins (not just hardcoded)
  - Allow user customization and extension of rulesets
  - Provide a comprehensive, production-ready ruleset (contracts, stubs, tests, naming, blueprint comments, etc.)
  - Use robust, generalized AST traversal for code analysis (not brittle structure-specific checks)
  - Leverage project context (related files, configs) for contextual validation
  - Allow configuration of severity levels and compliance thresholds (strict/lenient modes)
  - Optimize for performance on large codebases (AST caching, targeted traversal)
  - Output results in standard formats (e.g., SARIF) for CI/CD and IDE integration
  - Support auto-fix suggestions and, eventually, auto-application of fixes
  - Require and validate blueprint comment density and documentation quality
  - Support meta-validation (validate SDD tools themselves, not just user code)
  - Encourage developer experience and “Surprise & Delight” features in reporting
  - Provide a blueprint/example for rule/validator structure and registration

#### ToolModule Contract

```typescript
interface ToolModule {
  definition: ToolDefinition;
  handler: (args: any) => Promise<ContractResult<any>>;
  metadata: {
    name: string;
    version: string;
    dependencies?: string[];
    category?: string;
  };
}
```

#### ToolRegistry Contract

```typescript
interface ToolRegistry {
  registerTool(module: ToolModule): Promise<ContractResult<void>>;
  getTools(): Promise<ContractResult<ToolDefinition[]>>;
  executeTool(name: string, args: any): Promise<ContractResult<any>>;
  validateTool(module: ToolModule): Promise<ContractResult<boolean>>;
}
```

#### ToolDiscovery Contract

```typescript
interface ToolDiscovery {
  scanToolsDirectory(path: string): Promise<ContractResult<ToolModule[]>>;
  validateToolModule(module: ToolModule): Promise<ContractResult<boolean>>;
  loadToolModule(filePath: string): Promise<ContractResult<ToolModule>>;
}
```

---

## 🏗️ Phase 3: Implementation Plan

### Step 1: Foundation (Gemini)

**Files**: `src/contracts.ts`, `src/tool-registry.ts`

- [ ] Add ToolModule and ToolRegistry contracts to `src/contracts.ts`
- [ ] Implement ToolRegistry class with SDD patterns
- [ ] Add error handling and validation
- [ ] Include DevUtilities integration
- [ ] Implement validation engine with extensible, configurable ruleset (external config/plugin support)
- [ ] Ensure AST traversal is robust and generalized
- [ ] Add support for auto-fix suggestions in validation output
- [ ] Output validation results in standard formats (e.g., SARIF)
- [ ] Provide blueprint/example for rule/validator structure

### Step 2: Tool Module Refactoring (Gemini)

**Files**: `src/tools/*.ts`

- [x] Convert `enhanced-seam-analysis-tool.ts` to module format
- [x] Convert `analyze-data-flows-tool.ts` to module format
- [x] Convert `generate-interaction-matrix-tool.ts` to module format
- [x] Convert `validate-seam-readiness-tool.ts` to module format
- [ ] Refactor tools to support meta-validation and contextual validation
- [ ] Ensure all tools provide developer-friendly feedback and “Surprise & Delight” features

### Step 3: MCP Server Integration (Copilot)

- [ ] Initialize ToolRegistry in server startup
- [ ] Replace hardcoded tools array with registry.getTools()
- [ ] Replace switch statement with registry.executeTool()
- [ ] Maintain backward compatibility
- [ ] Integrate validation engine and reporting into CI/CD pipeline

### Step 4: Testing & Validation (Copilot)

**Files**: Testing infrastructure

- [ ] Verify all 4 enhanced tools are accessible
- [ ] Test tool execution end-to-end
- [ ] Validate backward compatibility
- [ ] Performance testing
- [ ] Create and maintain a diverse set of positive/negative test cases for validation engine and tools
- [ ] Test auto-fix and reporting features
- [ ] Validate blueprint comment density and documentation quality
- [ ] Test meta-validation and toolchain health reporting

---

## 🎯 Phase 4: Success Criteria

### Technical Criteria

- [ ] ✅ All 4 enhanced tools properly registered
- [ ] ✅ Clean, modular architecture implemented
- [ ] ✅ SDD patterns followed throughout (ContractResult<T>)
- [ ] ✅ TypeScript compilation successful
- [ ] ✅ Existing functionality unaffected
- [ ] ✅ Auto-discovery of future tools works
- [ ] ✅ Validation engine supports extensible, configurable rulesets
- [ ] ✅ Validation output is granular, actionable, and standard-compliant (e.g., SARIF)
- [ ] ✅ Auto-fix suggestions available for common violations
- [ ] ✅ Meta-validation and toolchain health reporting implemented
- [ ] ✅ Blueprint comment and documentation density validated
- [ ] ✅ Developer experience and “Surprise & Delight” features present

### Quality Criteria

- [ ] 📚 Code is self-documenting with blueprint comments
- [ ] 🛡️ Error handling is consistent and robust
- [ ] 📊 Logging and metrics properly integrated
- [ ] 🔄 Architecture scales for future tools
- [ ] 🧪 Integration tests validate all pathways
- [ ] 🦄 Developer feedback and encouragement present in validation output

---

## 🚨 Risk Mitigation

### Risk 1: Breaking Existing Tools

**Mitigation**: Implement registry alongside existing system, gradual migration
**Rollback**: Keep existing hardcoded tools as fallback

### Risk 2: Complex Integration

**Mitigation**: Clear seam boundaries, well-defined contracts
**Validation**: Comprehensive testing at each integration point

### Risk 3: Performance Degradation

**Mitigation**: Efficient registry implementation, caching where appropriate
**Monitoring**: Performance metrics through DevUtilities

---

## 🔄 Phase 5: Future Roadmap

### Immediate Next Steps (Post-Refactor)

1. **Template Integration**: Connect enhanced analyzer to template system
2. **Error Standardization**: Implement consistent SDDError patterns
3. **DevUtilities Integration**: Standardize logging across all components
4. **Plugin System**: Hot-loading of new tools and rulesets (move from long-term to immediate)
5. **Auto-Fix and Quick-Fix**: Begin implementing auto-fix and quick-fix support in validation engine
6. **Blueprint for Rule/Validator Structure**: Document and implement a clear pattern for rule/validator registration and configuration

### Long-term Architecture Goals

1. **Tool Versioning**: Support multiple versions of same tool
2. **Tool Dependencies**: Manage tool interdependencies
3. **Tool Marketplace**: Framework for community-contributed tools

---

**Created**: June 3, 2025  
**Status**: Ready for implementation  
**Assigned Phase 1-2**: Gemini  
**Assigned Phase 3-4**: Copilot
