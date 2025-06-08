# SDD Tool Compliance Checklists

This directory contains detailed, SDD-specific checklists for each core tool in the Seam-Driven Development (SDD) MCP Server. Use these to review, implement, and validate each tool for SDD compliance, robustness, and integration readiness.

---

## 1. sdd-create-stub-tool Checklist

### SDD Principles & Architecture

- [ ] 🦄 **Surprise & Delight**: Does the tool provide any unexpectedly helpful developer experience or documentation?
- [ ] 🧩 **Composable**: Can the tool be easily reused or extended in unconventional SDD workflows?
- [ ] Clearly documents seam boundaries and purpose
- [ ] Exports contract/interface using ToolModuleContract
- [ ] Uses SDD blueprint comments (e.g., `// 🛡️ DEFENSIVE`, `// 🎯 CRITICAL`)

### Schema & Type Safety

- [ ] Uses Zod for input/output validation
- [ ] All types and function signatures are strongly typed
- [ ] Returns results using `ContractResult<T>`

### Implementation & Logic

- [ ] Throws NotImplementedError in stub (if stub)
- [ ] Real implementation generates stubs from contract definitions
- [ ] Handles all contract edge cases (async, error, metadata)
- [ ] No business logic leaks in stub

### Error Handling & Robustness

- [ ] Catches and reports errors with context
- [ ] Validates all inputs at seam boundaries

### Integration & Modularity

- [ ] Exports `TOOL_MODULE_CONTRACT`
- [ ] Uses `seamManager` for orchestration if needed

### Documentation & Clarity

- [ ] File/function headers explain purpose and usage
- [ ] Uses Copilot suggestion tags
- [ ] No redundant/legacy code

### Testability & Coverage

- [ ] Designed for easy unit/integration testing

### Should NOT Have

- [ ] No business logic in stub
- [ ] No unvalidated input
- [ ] No tight coupling

---

## 2. sdd-orchestrate-workflow-tool Checklist

### SDD Principles & Architecture

- [ ] 🦄 **Surprise & Delight**: Does the orchestrator offer any unique workflow visualizations, progress feedback, or developer guidance?
- [ ] 🧠 **Self-Diagnosis**: Can the orchestrator detect and report on its own misconfigurations or missing dependencies?
- [ ] Documents all orchestrated seams and workflow
- [ ] Exports ToolModuleContract
- [ ] Blueprint comments for each workflow stage

### Schema & Type Safety

- [ ] Zod schemas for input/output
- [ ] Strong typing throughout
- [ ] Uses `ContractResult<T>`

### Implementation & Logic

- [ ] Orchestrates all SDD stages (requirements, contracts, stubs, tests)
- [ ] Validates each stage’s input/output
- [ ] Stops/fails fast on error
- [ ] No business logic in stub

### Error Handling & Robustness

- [ ] Catches/reports errors at each stage
- [ ] Defensive input validation

### Integration & Modularity

- [ ] Uses `seamManager` for all tool calls
- [ ] No hardcoded paths

### Documentation & Clarity

- [ ] Usage examples and SDD tags
- [ ] No legacy code

### Testability & Coverage

- [ ] Testable orchestration logic

### Should NOT Have

- [ ] No direct file/process calls
- [ ] No unvalidated input

---

## 3. sdd-visualize-architecture-tool Checklist

### SDD Principles & Architecture

- [ ] 🦄 **Surprise & Delight**: Does the visualization offer any creative or interactive features (e.g., clickable diagrams, color-coding, or export options)?
- [ ] 🧠 **Meta-Visualization**: Can it visualize not just the architecture, but also the health/status of SDD seams and contracts?
- [ ] Documents seam for visualization
- [ ] Exports ToolModuleContract
- [ ] Blueprint comments for diagram logic

### Schema & Type Safety

- [ ] Zod schemas for input/output
- [ ] Strong typing
- [ ] Uses `ContractResult<T>`

### Implementation & Logic

- [ ] Generates diagrams (e.g., Mermaid) from seam definitions
- [ ] Handles edge cases (missing/partial seams)
- [ ] No business logic in stub

### Error Handling & Robustness

- [ ] Catches/reports errors
- [ ] Validates input

### Integration & Modularity

- [ ] Uses `seamManager` if needed

### Documentation & Clarity

- [ ] Usage examples, SDD tags
- [ ] No legacy code

### Testability & Coverage

- [ ] Testable diagram generation

### Should NOT Have

- [ ] No direct file/process calls
- [ ] No unvalidated input

---

## 4. sdd-validate-compliance-tool Checklist

### SDD Principles & Architecture

- [ ] 🦄 **Surprise & Delight**: Does the validator provide any unexpectedly useful feedback, humor, or developer encouragement?
- [ ] 🧠 **Meta-Validation**: Can it validate not just SDD artifacts, but also the compliance of the SDD tools themselves?
- [ ] Clearly identifies seam boundaries (input, output, dependencies)
- [ ] Exports ToolModuleContract
- [ ] Uses SDD blueprint comments (e.g., `// 🛡️ DEFENSIVE`, `// 🎯 CRITICAL`)

### Schema & Type Safety

- [ ] Uses Zod for input/output validation
- [ ] All types and function signatures are strongly typed
- [ ] Returns results using `ContractResult<T>`

### Implementation & Logic

- [ ] Throws NotImplementedError in stub (if stub)
- [ ] Real implementation performs SDD compliance validation
- [ ] AST-level validation for strict SDD compliance
- [ ] Meta-validation of SDD tool seams/contracts/tests
- [ ] Granular, actionable reporting (not just pass/fail)
- [ ] No business logic leaks in stub

### Error Handling & Robustness

- [ ] Catches and reports errors with context
- [ ] Validates all inputs at seam boundaries
- [ ] Fail-fast on invalid input or state

### Integration & Modularity

- [ ] Exports `TOOL_MODULE_CONTRACT`
- [ ] Uses `seamManager` for orchestration if needed
- [ ] No hardcoded paths

### Documentation & Clarity

- [ ] File/function headers explain purpose and usage
- [ ] Uses Copilot suggestion tags
- [ ] No redundant/legacy code

### Testability & Coverage

- [ ] Designed for easy unit/integration testing
- [ ] Optionally enforces/reports on test coverage for SDD artifacts

### Should NOT Have

- [ ] No business logic in stub
- [ ] No direct file/process calls
- [ ] No unvalidated input
- [ ] No tight coupling
