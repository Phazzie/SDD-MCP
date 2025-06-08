/**
 * SDD Orchestrate Full Workflow Tool
 *
 * 🎯 SEAM: Complete SDD workflow orchestration
 * 📋 PURPOSE: Execute full PRD → Seams → Contracts → Stubs → Tests → Ready for Implementation
 * 🔗 CONNECTS: External PRD → Complete SDD project structure
 *
 * This tool orchestrates the complete SDD workflow by coordinating multiple seams:
 * - Requirement analysis seam (PRD → Seam definitions)
 * - Contract generation seam (Seams → TypeScript contracts)
 * - Stub creation seam (Contracts → Implementation stubs)
 * - Test generation seam (Contracts → Test cases)
 * - Project structure seam (Components → File organization)
 *
 * SEAM BOUNDARIES:
 * - INPUT: Raw PRD text + project metadata
 * - OUTPUT: Complete project structure with contracts, stubs, tests
 * - ERROR HANDLING: Validates each workflow stage, fails fast on issues
 * - DEPENDENCIES: Requires seamManager, all individual SDD tools
 */

import { z } from "zod";
import {
  ContractResult,
  ToolModuleContract,
  fail,
  succeed,
} from "../../contracts/contract-result.js";
import { seamManager } from "../../seams.js";
import { SDDError } from "../../utils/sdd-error.js";

// Zod schemas for type safety and validation
const OrchestrateWorkflowInput = z.object({
  prdText: z
    .string()
    .min(10, "PRD text must be at least 10 characters.")
    .describe("The Product Requirements Document or project description"),
  projectName: z
    .string()
    .min(1, "Project name cannot be empty.")
    .describe("Name of the project being built"),
  designNotes: z
    .string()
    .optional()
    .describe("Optional design notes or constraints"),
});

const WorkflowStageResult = z.object({
  stage: z.string(),
  success: z.boolean(),
  output: z.any().optional(), // Output from the specific tool/seam
  error: z.string().optional(), // Error message if the stage failed
  duration: z.number().optional(),
});

const OrchestrateWorkflowOutput = z.object({
  projectStructure: z.object({
    contracts: z
      .array(z.string())
      .describe("Paths or code snippets of generated contracts."),
    stubs: z
      .array(z.string())
      .describe("Paths or code snippets of generated stubs."),
    tests: z
      .array(z.string())
      .describe("Paths or code snippets of generated tests."),
    documentation: z
      .array(z.string())
      .describe("Paths to documentation files."),
  }),
  workflowStages: z
    .array(WorkflowStageResult)
    .describe("Detailed results of each workflow stage."),
  seamDefinitions: z
    .array(z.any())
    .describe("Seam definitions extracted from requirements analysis."), // Consider a more specific Zod schema for SeamDefinition if available
  totalDuration: z
    .number()
    .describe("Total duration of the workflow in milliseconds."),
  readyForImplementation: z
    .boolean()
    .describe(
      "Flag indicating if all core artifacts were generated successfully."
    ),
});

type OrchestrateWorkflowInput = z.infer<typeof OrchestrateWorkflowInput>;
type OrchestrateWorkflowOutput = z.infer<typeof OrchestrateWorkflowOutput>;

/**
 * SDD Orchestrate Full Workflow Tool Implementation
 *
 * Coordinates the complete SDD workflow through defined seam boundaries:
 * 1. Analyze requirements (PRD → Seam definitions)
 * 2. Generate contracts (Seams → TypeScript interfaces)
 * 3. Create implementation stubs (Contracts → Skeleton code)
 * 4. Generate test cases (Contracts → Test suite)
 * 5. Organize project structure (Components → File system)
 *
 * Each stage validates its inputs and outputs, ensuring seam contracts are honored.
 */
class SDDOrchestrateWorkflowTool {
  readonly name = "sdd_orchestrate_full_workflow";
  readonly description =
    "Complete SDD workflow: PRD → Seams → Contracts → Stubs → Tests → Ready for Implementation";
  readonly inputSchema = OrchestrateWorkflowInput;
  readonly outputSchema = OrchestrateWorkflowOutput;

  async execute(
    input: OrchestrateWorkflowInput
  ): Promise<ContractResult<OrchestrateWorkflowOutput>> {
    // Blueprint: Initialize workflow state and timers.
    const startTime = Date.now();
    const workflowStages: WorkflowStageResult[] = [];
    let seamDefinitions: any[] = []; // Consider defining a more specific type or Zod schema for SeamDefinition
    let contracts: string[] = [];
    let stubs: string[] = [];
    let tests: string[] = [];
    let documentation: string[] = []; // Placeholder, could be dynamically generated
    let readyForImplementation = false;

    try {
      // Blueprint: Stage 1 - Analyze requirements (PRD → Seam definitions)
      // Assumes 'sdd_analyze_requirements' tool is registered with seamManager.
      // Expected output: { seamDefinitions: Array<{ name: string, interfaceName?: string, implementingComponentName?: string, ... }> }
      const reqStart = Date.now();
      const reqResult = await seamManager.executeSeam(
        "sdd_analyze_requirements",
        {
          prdText: input.prdText,
          projectName: input.projectName,
          designNotes: input.designNotes || "",
        }
      );
      workflowStages.push({
        stage: "analyze_requirements",
        success: reqResult.success,
        output: reqResult.data, // Store the full data for potential later use
        error: reqResult.success ? undefined : reqResult.error?.message,
        duration: Date.now() - reqStart,
      });

      if (!reqResult.success) {
        return fail(
          reqResult.error || // Use the error from the tool if available
            new SDDError(
              "RequirementAnalysisFailed",
              "Requirement analysis failed to produce valid output."
            )
        );
      }
      if (
        !reqResult.data?.seamDefinitions ||
        !Array.isArray(reqResult.data.seamDefinitions)
      ) {
        return fail(
          new SDDError(
            "RequirementAnalysisFailed",
            "Requirement analysis did not return seamDefinitions array."
          )
        );
      }
      seamDefinitions = reqResult.data.seamDefinitions;

      // Blueprint: Stage 2 - Generate contracts for each seam definition
      // Assumes 'sdd_generate_contract' tool is registered.
      // Expected input: { seamDefinition: object, projectName: string }
      // Expected output: { filePath?: string, contractCode?: string, structuredContractDefinition: { interfaceName: string, componentName: string, methods: any[], ... } }
      for (const seamDef of seamDefinitions) {
        const stageStartTime = Date.now();
        const stageName = `contract_generation:${
          seamDef.name || seamDef.interfaceName || "unknown_seam"
        }`;
        if (!seamDef.name && !seamDef.interfaceName) {
          workflowStages.push({
            stage: stageName,
            success: false,
            error: "Seam definition lacks a name or interfaceName.",
            duration: Date.now() - stageStartTime,
          });
          return fail(
            new SDDError(
              "ContractGenerationSkipped",
              `Seam definition for contract generation is missing a name or interfaceName.`
            )
          );
        }

        const contractResult = await seamManager.executeSeam(
          "sdd_generate_contract",
          {
            seamDefinition: seamDef, // Pass the full seam definition
            projectName: input.projectName,
          }
        );
        workflowStages.push({
          stage: stageName,
          success: contractResult.success,
          output: contractResult.data,
          error: contractResult.success
            ? undefined
            : contractResult.error?.message,
          duration: Date.now() - stageStartTime,
        });

        if (!contractResult.success) {
          return fail(
            contractResult.error ||
              new SDDError(
                "ContractGenerationFailed",
                `Contract generation failed for seam '${stageName}'.`
              )
          );
        }
        // Store path or code of the generated contract
        if (contractResult.data?.filePath)
          contracts.push(contractResult.data.filePath);
        else if (contractResult.data?.contractCode)
          contracts.push(contractResult.data.contractCode);
        else {
          return fail(
            new SDDError(
              "ContractGenerationOutputError",
              `Contract generation for '${stageName}' did not provide a filePath or contractCode.`
            )
          );
        }
        if (!contractResult.data?.structuredContractDefinition) {
          return fail(
            new SDDError(
              "ContractGenerationOutputError",
              `Contract generation for '${stageName}' did not provide a structuredContractDefinition needed for subsequent steps.`
            )
          );
        }
      }

      // Blueprint: Stage 3 - Create stubs for each generated contract
      // Assumes 'sdd_create_stub' tool is registered.
      // Expected input: The 'structuredContractDefinition' from the contract generation stage's output.
      // Expected output: { filePathSuggestion?: string, stubCode?: string }
      for (const contractStageData of workflowStages.filter(
        (s) => s.stage.startsWith("contract_generation:") && s.success
      )) {
        const stageStartTime = Date.now();
        const structuredDef =
          contractStageData.output?.structuredContractDefinition;

        if (
          !structuredDef ||
          !structuredDef.interfaceName ||
          !structuredDef.componentName
        ) {
          const missingName = !structuredDef
            ? "structuredDefinition"
            : !structuredDef.interfaceName
            ? "interfaceName"
            : "componentName";
          workflowStages.push({
            stage: `stub_creation_skipped:${
              contractStageData.stage.split(":")[1]
            }`,
            success: false,
            error: `Missing ${missingName} for stub generation.`,
            duration: Date.now() - stageStartTime,
          });
          return fail(
            new SDDError(
              "StubGenerationSkipped",
              `Cannot generate stub for ${
                contractStageData.stage.split(":")[1]
              } due to missing ${missingName}.`
            )
          );
        }
        const stageName = `stub_creation:${structuredDef.interfaceName}`;

        const stubResult = await seamManager.executeSeam(
          "sdd_create_stub",
          structuredDef // Pass the whole structured definition object
        );
        workflowStages.push({
          stage: stageName,
          success: stubResult.success,
          output: stubResult.data,
          error: stubResult.success ? undefined : stubResult.error?.message,
          duration: Date.now() - stageStartTime,
        });

        if (!stubResult.success) {
          return fail(
            stubResult.error ||
              new SDDError(
                "StubGenerationFailed",
                `Stub generation failed for interface '${structuredDef.interfaceName}'.`
              )
          );
        }
        if (stubResult.data?.filePathSuggestion)
          stubs.push(stubResult.data.filePathSuggestion);
        else if (stubResult.data?.stubCode)
          stubs.push(stubResult.data.stubCode);
        else {
          return fail(
            new SDDError(
              "StubGenerationOutputError",
              `Stub generation for '${structuredDef.interfaceName}' did not provide a filePathSuggestion or stubCode.`
            )
          );
        }
      }

      // Blueprint: Stage 4 - Generate tests for each contract
      // Assumes 'sdd_generate_test' tool is registered.
      // Expected input: The 'structuredContractDefinition' from the contract generation stage's output.
      // Expected output: { testFilePath?: string, testCode?: string }
      for (const contractStageData of workflowStages.filter(
        (s) => s.stage.startsWith("contract_generation:") && s.success
      )) {
        const stageStartTime = Date.now();
        const structuredDef =
          contractStageData.output?.structuredContractDefinition;

        if (!structuredDef || !structuredDef.interfaceName) {
          workflowStages.push({
            stage: `test_generation_skipped:${
              contractStageData.stage.split(":")[1]
            }`,
            success: false,
            error:
              "Missing structuredContractDefinition or interfaceName for test generation.",
            duration: Date.now() - stageStartTime,
          });
          return fail(
            new SDDError(
              "TestGenerationSkipped",
              `Cannot generate tests for ${
                contractStageData.stage.split(":")[1]
              } due to missing structuredContractDefinition or interfaceName.`
            )
          );
        }
        const stageName = `test_generation:${structuredDef.interfaceName}`;

        const testResult = await seamManager.executeSeam(
          "sdd_generate_test",
          structuredDef // Pass the whole structured definition object
        );
        workflowStages.push({
          stage: stageName,
          success: testResult.success,
          output: testResult.data,
          error: testResult.success ? undefined : testResult.error?.message,
          duration: Date.now() - stageStartTime,
        });

        if (!testResult.success) {
          return fail(
            testResult.error ||
              new SDDError(
                "TestGenerationFailed",
                `Test generation failed for interface '${structuredDef.interfaceName}'.`
              )
          );
        }
        if (testResult.data?.testFilePath)
          tests.push(testResult.data.testFilePath);
        else if (testResult.data?.testCode)
          tests.push(testResult.data.testCode);
        else {
          return fail(
            new SDDError(
              "TestGenerationOutputError",
              `Test generation for '${structuredDef.interfaceName}' did not provide a testFilePath or testCode.`
            )
          );
        }
      }

      // Blueprint: Stage 5 - Finalize and report successful completion.
      documentation = ["docs/README.md", "docs/ARCHITECTURE.md"]; // Example paths
      readyForImplementation = true; // Set if all critical stages succeeded
      const totalDuration = Date.now() - startTime;

      return succeed({
        projectStructure: {
          contracts,
          stubs,
          tests,
          documentation,
        },
        workflowStages,
        seamDefinitions,
        totalDuration,
        readyForImplementation,
      });
    } catch (error: any) {
      // Blueprint: Catch-all for unexpected errors during orchestration.
      return fail(
        new SDDError(
          "OrchestrationError",
          `Workflow orchestration encountered an unexpected error: ${
            error instanceof Error ? error.message : String(error)
          }`,
          error // Preserve original error for context
        )
      );
    }
  }
}

// Export tool instance and ToolModuleContract
export const sddOrchestrateWorkflowTool = new SDDOrchestrateWorkflowTool();

// ToolModuleContract compliant export
export const TOOL_MODULE_CONTRACT: ToolModuleContract<
  typeof OrchestrateWorkflowInput,
  typeof OrchestrateWorkflowOutput
> = {
  definition: {
    name: "sdd_orchestrate_full_workflow",
    description:
      "Complete SDD workflow: PRD → Seams → Contracts → Stubs → Tests → Ready for Implementation",
    inputSchema: OrchestrateWorkflowInput,
    outputSchema: OrchestrateWorkflowOutput,
  },
  handler: async (args: OrchestrateWorkflowInput) => {
    // Input validation is handled by Zod schema in ToolRegistry or by the tool itself.
    return await sddOrchestrateWorkflowTool.execute(args);
  },
  metadata: {
    name: "sdd_orchestrate_full_workflow",
    version: "1.1.0", // Incremented version
    author: "SDD MCP Server (Gemini)",
    tags: ["sdd", "workflow", "orchestration", "seam-driven", "full-cycle"],
    dependencies: [
      "seamManager",
      "sdd_analyze_requirements", // Specific tool names
      "sdd_generate_contract",
      "sdd_create_stub",
      "sdd_generate_test",
    ],
  },
};

/**
 * USAGE EXAMPLES:
 *
 * // Complete workflow execution
 * const result = await sddOrchestrateWorkflowTool.execute({
 *   prdText: "Build a user authentication system with login, registration, and profile management...",
 *   projectName: "AuthSystem",
 *   designNotes: "Must integrate with existing OAuth providers"
 * });
 *
 * if (result.success) {
 *   console.log(`Project structure for ${input.projectName} is ready for implementation.`);
 *   console.log(`Contracts: ${result.data.projectStructure.contracts.join(', ')}`);
 *   console.log(`Stubs: ${result.data.projectStructure.stubs.join(', ')}`);
 *   console.log(`Tests: ${result.data.projectStructure.tests.join(', ')}`);
 *   console.log(`Workflow completed in ${result.data.totalDuration}ms`);
 *   result.data.workflowStages.forEach(stage => {
 *     console.log(`  ${stage.stage}: ${stage.success ? 'SUCCESS' : 'FAILED'} (${stage.duration}ms)${stage.error ? ` - Error: ${stage.error}` : ''}`);
 *   });
 * } else {
 *   console.error(`Workflow failed: ${result.error.message}`);
 *   if (result.error.details) console.error(`Details: ${JSON.stringify(result.error.details)}`);
 * }
 *
 * // Example of how it might be called via seamManager (assuming registered as 'sdd_orchestrate_full_workflow')
 * // const orchestrateResult = await seamManager.executeSeam('sdd_orchestrate_full_workflow', {
 * //   prdText: "Some PRD content...",
 * //   projectName: "MyNewProject"
 * // });
 */

/**
 * SEAM CONTRACTS VALIDATED BY THIS TOOL (Implicitly, by orchestrating them):
 *
 * This tool relies on the individual SDD tools it orchestrates to honor their respective contracts.
 * The orchestrator's primary role is to manage the flow and data handoff between these tools.
 *
 * 1. Requirements Analysis Seam (e.g., sdd_analyze_requirements):
 *    - Input: PRD text, project name, design notes.
 *    - Output: { seamDefinitions: Array<SeamDefinition> }, where SeamDefinition includes at least name,
 *              and ideally hints for interfaceName and implementingComponentName.
 *
 * 2. Contract Generation Seam (e.g., sdd_generate_contract):
 *    - Input: A single SeamDefinition object, projectName.
 *    - Output: { filePath?: string, contractCode?: string, structuredContractDefinition: StructuredContract },
 *              where StructuredContract contains interfaceName, componentName, methods, etc.
 *
 * 3. Stub Creation Seam (e.g., sdd_create_stub):
 *    - Input: A StructuredContract object.
 *    - Output: { filePathSuggestion?: string, stubCode?: string }.
 *
 * 4. Test Generation Seam (e.g., sdd_generate_test):
 *    - Input: A StructuredContract object.
 *    - Output: { testFilePath?: string, testCode?: string }.
 *
 * The orchestrator ensures that if a stage fails, the workflow stops and reports the failure.
 * Successful completion implies all orchestrated tools produced their expected outputs.
 */
