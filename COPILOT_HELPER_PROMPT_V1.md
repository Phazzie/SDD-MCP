# SkepticalWombat Project - SDD MCP Server - Helper Prompt for GitHub Copilot

Hello! To ensure we're aligned on the SkepticalWombat project, please keep these key principles and project specifics in mind. This information complements your primary custom instructions.

**1. Project Core Goal:**
We are modernizing a Seam-Driven Development (SDD) Model-Context-Protocol (MCP) server. This involves implementing a suite of core SDD tools: a stub generator, an orchestrator, an architecture visualizer, and a compliance validator. These tools must be robust, type-safe (using Zod for schema validation where applicable), and follow all SDD principles.

**2. CRITICAL - Seam-Driven Development (SDD) First!**
This is the absolute cornerstone of our development philosophy. **"Seams First, Implementation Second."**
The SDD workflow MUST be followed: 1. **Identify Seams**: Clearly define the communication pathways and interfaces between components. What information needs to flow? 2. **Define Contracts**: For each seam, specify the TypeScript `interface` and ensure all methods return `Promise<ContractResult<OutputType>>`. 3. **Create Stubs**: Generate initial `NotImplementedError` skeleton implementations for all methods in the contracts. These stubs must include meaningful "Blueprint" comments. 4. **Test Connections**: Write tests to validate that components can communicate via their defined seams, even if it's just stubs calling stubs. This proves the "plumbing" works. 5. **Implement**: Only after the above steps, fill in the actual business logic within the components.
_Before writing any implementation code, always ask: "What seam am I building or interacting with?"_

**3. Core Coding Patterns:**

- **Contracts (Always Async with `ContractResult<T>`):**

  ```typescript
  // Located in src/contracts.ts (or similar)
  export interface ComponentContract {
    exampleMethod(input: InputType): Promise<ContractResult<OutputType>>;
  }

  export type ContractResult<T> = {
    success: boolean;
    data?: T;
    error?: string; // User-friendly error message
    metadata?: Record<string, any>; // For diagnostics, logs, or additional context
  };
  ```

- **Stubs (Fail Fast & Rich Blueprint Comments):**

  ```typescript
  // Located in src/stubs.ts or within agent files initially
  import { NotImplementedError } from "../core/errors.js"; // Assuming custom error class
  import { ContractResult } from "../contracts.js"; // Or specific contract file

  export class StubbedComponent implements ComponentContract {
    async exampleMethod(input: InputType): Promise<ContractResult<OutputType>> {
      // Blueprint: This method is intended to process [specific data] and return [specific result].
      // Blueprint: It will interact with [OtherComponent1] and [OtherComponent2].
      // Blueprint: Key logic involves [algorithm/step 1], then [algorithm/step 2].
      // Blueprint: TODO: Implement data transformation logic.
      // Blueprint: TODO: Add validation for input parameters.
      // Blueprint: TODO: Call OtherComponent1.methodA and handle its result.
      throw new NotImplementedError(
        "StubbedComponent.exampleMethod",
        "Blueprint: Method not implemented. See comments for intended functionality and TODOs."
      );
    }
  }
  ```

- **Seam Communication (via `SeamManager`):**
  ```typescript
  // Assumes SeamManager is appropriately set up and available
  import { seamManager } from "../core/seam-manager.js"; // Adjust path as needed
  // ...
  const executionData = {
    /* payload for the seam */
  };
  const result: ContractResult<ResponseType> = await seamManager.executeSeam<
    RequestType,
    ResponseType
  >("TargetSeamName", executionData);
  if (result.success) {
    // Process result.data
  } else {
    // Handle result.error
  }
  ```
- **Error Handling (Robust, Informative, Fail-Fast):**

  ```typescript
  async someOperation(input: any): Promise<ContractResult<any>> {
    try {
      // Fail fast: Validate inputs early
      if (!input || typeof input.requiredField === 'undefined') {
        return {
          success: false,
          error: "Invalid input: 'requiredField' is missing.",
          metadata: { receivedInput: input, validationTimestamp: new Date().toISOString() }
        };
      }

      // ... core business logic ...
      const operationResult = await someAsyncLogic(input);

      return {
        success: true,
        data: operationResult,
        metadata: { operationPerformed: "someOperation", details: "..." }
      };
    } catch (error: any) {
      // Log the detailed error internally (assume errorHandler is available)
      // await errorHandler.logError('someOperation', error, { input });

      return {
        success: false,
        error: error.message || "An unexpected error occurred during someOperation.",
        metadata: {
          originalErrorName: error.name,
          // stack: error.stack // Be cautious about exposing stack traces externally
        }
      };
    }
  }
  ```

**4. File Organization (Primary Locations - verify exact paths in workspace):**

- `src/contracts/`: Contains all TypeScript `interface` definitions for component contracts and `ContractResult<T>`. (e.g., `tool-module-contract.ts`, `specific-agent-contract.ts`)
- `src/stubs/`: May contain initial `NotImplementedError` stub implementations, though stubs might also be co-located with agents initially.
- `src/core/seam-manager.ts` (or `src/seams.ts`): Manages seam definitions, registration, and communication pathways.
- `src/agents/`: Houses the actual business logic implementations for various components/agents (e.g., `config-manager.ts`, `sdd-analyzer.ts`).
- `src/tools/`: Location for the core SDD tools we are building/modernizing (e.g., `sdd-create-stub-tool.ts`).
- `src/core/errors.ts`: Custom error classes like `NotImplementedError`.
- **IMPORTANT**: Remember to use `.js` extensions in all ES module import paths, e.g., `import { MyThing } from '../contracts/my-contract.js';` This is configured in `tsconfig.json`.

**5. AI Collaboration Protocol (Refer to files in `ai-collaboration/` directory):**

- This project involves close collaboration between multiple AIs (primarily GitHub Copilot and Gemini).
- **Copilot Role**: Focuses on strategic planning, architecture design, seam identification, requirements analysis, integration oversight, quality assurance (code reviews, SDD compliance), and handoff management.
- **Gemini Role**: Primarily focused on implementing specific, well-defined components or features based on detailed specifications provided by Copilot.
- **Key AI Collaboration Files**:
  - `ai-collaboration/GEMINI_TASK_ASSIGNMENT.md`: Details current tasks assigned to Gemini.
  - `ai-collaboration/AI_COLLABORATION_LOG.md`: Logs major decisions, architectural changes, and handoffs.
  - `ai-collaboration/CURRENT_STATUS.md`: Provides an overview of the project's current progress.
  - `ai-collaboration/COPILOT_HANDOFF_TEMPLATE.md`: Used for structuring handoffs to Gemini.
- Strict adherence to handoff templates and clearly defined seam boundaries (contracts) is essential for effective collaboration.

**6. Leverage Existing Foundation (Do Not Recreate):**
The project has several established foundational components and modules. Utilize them whenever appropriate:

- `ConfigManager` (for accessing configuration)
- `ErrorHandler` (for standardized error logging and reporting)
- `TemplateProcessor` (for code generation from templates)
- `ValidationEngine` (for data validation, possibly using Zod)
- `SDDAnalyzer` (for analyzing SDD artifacts)
- `SeamManager` (for inter-component communication)
  (These are likely located in `src/agents/`, `src/core/`, or `src/services/`. Verify their exact paths and interfaces.)

**7. "Not tahday!" for Simulations:**
If you find yourself in a situation where you need to simulate functionality or make significant assumptions about unimplemented parts that block your current task, please state **"Not tahday!"** and explicitly ask for clarification, direction, or request that the necessary preceding component, contract, or stub be created first. Avoid proceeding with extensive simulations.

**8. Current Project Phase (as of June 8, 2025):**
The project is in its final integration, testing, and documentation phase. Key activities include:

- Finalizing the implementation of the `sdd-orchestrate-workflow-tool.ts`.
- Integrating and thoroughly testing Gemini's advanced AST-based `sdd-validate-compliance-tool.ts`.
- Conducting comprehensive end-to-end testing of the entire SDD toolchain.
- Expanding documentation and preparing for project handoff.

Please prioritize these instructions alongside your main custom instructions. Your primary goal is to assist in developing high-quality, SDD-compliant code, documentation, and tests, while adhering to the established architectural patterns and collaborative workflows.
