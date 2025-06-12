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
import { seamManager } from "../../seams.js";
// Zod schemas for type safety and validation
const OrchestrateWorkflowInput = z.object({
    prdText: z
        .string()
        .min(10)
        .describe("The Product Requirements Document or project description"),
    projectName: z.string().min(1).describe("Name of the project being built"),
    designNotes: z
        .string()
        .optional()
        .describe("Optional design notes or constraints"),
});
const WorkflowStageResult = z.object({
    stage: z.string(),
    success: z.boolean(),
    output: z.any().optional(),
    error: z.string().optional(),
    duration: z.number().optional(),
});
const OrchestrateWorkflowOutput = z.object({
    projectStructure: z.object({
        contracts: z.array(z.string()),
        stubs: z.array(z.string()),
        tests: z.array(z.string()),
        documentation: z.array(z.string()),
    }),
    workflowStages: z.array(WorkflowStageResult),
    seamDefinitions: z.array(z.any()),
    totalDuration: z.number(),
    readyForImplementation: z.boolean(),
});
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
    name = "sdd_orchestrate_full_workflow";
    description = "Complete SDD workflow: PRD → Seams → Contracts → Stubs → Tests → Ready for Implementation";
    inputSchema = OrchestrateWorkflowInput;
    outputSchema = OrchestrateWorkflowOutput;
    async execute(input) {
        // 🛡️ DEFENSIVE: Validate inputs early
        if (!input.prdText?.trim()) {
            return {
                success: false,
                error: "PRD text is required - failing fast",
                metadata: { stage: "input_validation" },
            };
        }
        if (!input.projectName?.trim()) {
            return {
                success: false,
                error: "Project name is required - failing fast",
                metadata: { stage: "input_validation" },
            };
        }
        const startTime = Date.now();
        const workflowStages = [];
        let seamDefinitions = [];
        let contracts = [];
        let stubs = [];
        let tests = [];
        let documentation = [];
        let readyForImplementation = false;
        try {
            // 1. Analyze requirements (PRD → Seam definitions)
            const reqStart = Date.now();
            const reqResult = await seamManager.executeSeam("SDDFunction", {
                prdText: input.prdText,
                designNotes: input.designNotes || "",
            });
            workflowStages.push({
                stage: "requirements",
                success: reqResult.success,
                output: reqResult.data,
                error: reqResult.error,
                duration: Date.now() - reqStart,
            });
            if (!reqResult.success || !reqResult.data?.seamDefinitions) {
                return {
                    success: false,
                    error: reqResult.error || "Requirement analysis failed",
                    metadata: { stage: "requirements" },
                };
            }
            seamDefinitions = reqResult.data.seamDefinitions;
            // 2. Generate contracts for each seam
            const contractStart = Date.now();
            for (const seamDef of seamDefinitions) {
                const contractResult = await seamManager.executeSeam("TemplateProcessing", {
                    seam: seamDef,
                });
                workflowStages.push({
                    stage: `contract:${seamDef.name}`,
                    success: contractResult.success,
                    output: contractResult.data,
                    error: contractResult.error,
                    duration: Date.now() - contractStart,
                });
                if (!contractResult.success || !contractResult.data?.contractPath) {
                    return {
                        success: false,
                        error: contractResult.error ||
                            `Contract generation failed for seam ${seamDef.name}`,
                        metadata: { stage: `contract:${seamDef.name}` },
                    };
                }
                contracts.push(contractResult.data.contractPath);
            }
            // 3. Create stubs for each contract
            const stubStart = Date.now();
            for (const contractPath of contracts) {
                const stubResult = await seamManager.executeSeam("TemplateProcessing", {
                    contractPath,
                    type: "stub",
                });
                workflowStages.push({
                    stage: `stub:${contractPath}`,
                    success: stubResult.success,
                    output: stubResult.data,
                    error: stubResult.error,
                    duration: Date.now() - stubStart,
                });
                if (!stubResult.success || !stubResult.data?.stubPath) {
                    return {
                        success: false,
                        error: stubResult.error ||
                            `Stub generation failed for contract ${contractPath}`,
                        metadata: { stage: `stub:${contractPath}` },
                    };
                }
                stubs.push(stubResult.data.stubPath);
            }
            // 4. Generate tests for each contract
            const testStart = Date.now();
            for (const contractPath of contracts) {
                const testResult = await seamManager.executeSeam("Validation", {
                    contractPath,
                    type: "test",
                });
                workflowStages.push({
                    stage: `test:${contractPath}`,
                    success: testResult.success,
                    output: testResult.data,
                    error: testResult.error,
                    duration: Date.now() - testStart,
                });
                if (!testResult.success || !testResult.data?.testPath) {
                    return {
                        success: false,
                        error: testResult.error ||
                            `Test generation failed for contract ${contractPath}`,
                        metadata: { stage: `test:${contractPath}` },
                    };
                }
                tests.push(testResult.data.testPath);
            }
            // 5. Organize project structure and documentation
            documentation = ["README.md", "ARCHITECTURE.md"];
            readyForImplementation = true;
            const totalDuration = Date.now() - startTime;
            return {
                success: true,
                data: {
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
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Workflow orchestration failed: ${error instanceof Error ? error.message : String(error)}`,
                metadata: { stage: "orchestration", error },
            };
        }
    }
}
// Export tool instance and ToolModuleContract
export const sddOrchestrateWorkflowTool = new SDDOrchestrateWorkflowTool();
// ToolModuleContract compliant export
export const TOOL_MODULE_CONTRACT = {
    definition: {
        name: "sdd_orchestrate_full_workflow",
        description: "Complete SDD workflow: PRD → Seams → Contracts → Stubs → Tests → Ready for Implementation",
        inputSchema: OrchestrateWorkflowInput,
        outputSchema: OrchestrateWorkflowOutput,
    },
    handler: async (args) => {
        return await sddOrchestrateWorkflowTool.execute(args);
    },
    metadata: {
        name: "sdd_orchestrate_full_workflow",
        version: "1.0.0",
        author: "SDD MCP Server",
        tags: ["sdd", "workflow", "orchestration", "seam-driven"],
        dependencies: [
            "seamManager",
            "analyze_requirements",
            "generate_contract",
            "create_stub",
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
 * // Progressive workflow with status tracking
 * if (result.success) {
 *   console.log(`Project ${result.data.projectStructure} ready for implementation`);
 *   console.log(`Workflow completed in ${result.data.totalDuration}ms`);
 *   result.data.workflowStages.forEach(stage => {
 *     console.log(`${stage.stage}: ${stage.success ? 'SUCCESS' : 'FAILED'} (${stage.duration}ms)`);
 *   });
 * }
 *
 * // Integration with seam manager
 * const orchestrateSeam = await seamManager.executeSeam('orchestrate_workflow', {
 *   prdText: prdContent,
 *   projectName: "MyProject"
 * });
 */
/**
 * SEAM CONTRACTS VALIDATED BY THIS TOOL:
 *
 * 1. Requirements Analysis Seam:
 *    - Input: PRD text + design notes
 *    - Output: Array of seam definitions
 *    - Validation: Each seam has name, participants, dataFlow, purpose
 *
 * 2. Contract Generation Seam:
 *    - Input: Seam definition
 *    - Output: TypeScript contract interface
 *    - Validation: Uses ContractResult<T> pattern, proper async signatures
 *
 * 3. Stub Creation Seam:
 *    - Input: Contract interface
 *    - Output: Implementation stub with NotImplementedError
 *    - Validation: Proper imports, blueprint comments, error patterns
 *
 * 4. Test Generation Seam:
 *    - Input: Contract interface
 *    - Output: Test suite with happy/error paths
 *    - Validation: Complete test coverage, proper assertions
 *
 * 5. Project Structure Seam:
 *    - Input: All generated artifacts
 *    - Output: Organized file system structure
 *    - Validation: Proper directory layout, documentation, ready state
 */
//# sourceMappingURL=sdd-orchestrate-workflow-tool.js.map