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
import { fail, succeed, } from "../../contracts/contract-result.js";
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
        .describe("Flag indicating if all core artifacts were generated successfully."),
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
        // Blueprint: Initialize workflow state and timers.
        const startTime = Date.now();
        const workflowStages = [];
        let seamDefinitions = []; // Consider defining a more specific type or Zod schema for SeamDefinition
        let contracts = [];
        let stubs = [];
        let tests = [];
        let documentation = []; // Placeholder, could be dynamically generated
        let readyForImplementation = false;
        try {
            // Blueprint: Stage 1 - Analyze requirements (PRD → Seam definitions)
            // Assumes 'sdd_analyze_requirements' tool is registered with seamManager.
            // Expected output: { seamDefinitions: Array<{ name: string, interfaceName?: string, implementingComponentName?: string, ... }> }
            const reqStart = Date.now();
            const reqResult = await seamManager.executeSeam("sdd_analyze_requirements", {
                prdText: input.prdText,
                projectName: input.projectName,
                designNotes: input.designNotes || "",
            });
            workflowStages.push({
                stage: "analyze_requirements",
                success: reqResult.success,
                output: reqResult.data, // Store the full data for potential later use
                error: reqResult.success ? undefined : reqResult.error?.message,
                duration: Date.now() - reqStart,
            });
            if (!reqResult.success) {
                return fail(reqResult.error || // Use the error from the tool if available
                    new SDDError("RequirementAnalysisFailed", "Requirement analysis failed to produce valid output."));
            }
            if (!reqResult.data?.seamDefinitions ||
                !Array.isArray(reqResult.data.seamDefinitions)) {
                return fail(new SDDError("RequirementAnalysisFailed", "Requirement analysis did not return seamDefinitions array."));
            }
            seamDefinitions = reqResult.data.seamDefinitions;
            // Blueprint: Stage 2 - Generate contracts for each seam definition
            // Assumes 'sdd_generate_contract' tool is registered.
            // Expected input: { seamDefinition: object, projectName: string }
            // Expected output: { filePath?: string, contractCode?: string, structuredContractDefinition: { interfaceName: string, componentName: string, methods: any[], ... } }
            for (const seamDef of seamDefinitions) {
                const stageStartTime = Date.now();
                const stageName = `contract_generation:${seamDef.name || seamDef.interfaceName || "unknown_seam"}`;
                if (!seamDef.name && !seamDef.interfaceName) {
                    workflowStages.push({
                        stage: stageName,
                        success: false,
                        error: "Seam definition lacks a name or interfaceName.",
                        duration: Date.now() - stageStartTime,
                    });
                    return fail(new SDDError("ContractGenerationSkipped", `Seam definition for contract generation is missing a name or interfaceName.`));
                }
                const contractResult = await seamManager.executeSeam("sdd_generate_contract", {
                    seamDefinition: seamDef, // Pass the full seam definition
                    projectName: input.projectName,
                });
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
                    return fail(contractResult.error ||
                        new SDDError("ContractGenerationFailed", `Contract generation failed for seam '${stageName}'.`));
                }
                // Store path or code of the generated contract
                if (contractResult.data?.filePath)
                    contracts.push(contractResult.data.filePath);
                else if (contractResult.data?.contractCode)
                    contracts.push(contractResult.data.contractCode);
                else {
                    return fail(new SDDError("ContractGenerationOutputError", `Contract generation for '${stageName}' did not provide a filePath or contractCode.`));
                }
                if (!contractResult.data?.structuredContractDefinition) {
                    return fail(new SDDError("ContractGenerationOutputError", `Contract generation for '${stageName}' did not provide a structuredContractDefinition needed for subsequent steps.`));
                }
            }
            // Blueprint: Stage 3 - Create stubs for each generated contract
            // Assumes 'sdd_create_stub' tool is registered.
            // Expected input: The 'structuredContractDefinition' from the contract generation stage's output.
            // Expected output: { filePathSuggestion?: string, stubCode?: string }
            for (const contractStageData of workflowStages.filter((s) => s.stage.startsWith("contract_generation:") && s.success)) {
                const stageStartTime = Date.now();
                const structuredDef = contractStageData.output?.structuredContractDefinition;
                if (!structuredDef ||
                    !structuredDef.interfaceName ||
                    !structuredDef.componentName) {
                    const missingName = !structuredDef
                        ? "structuredDefinition"
                        : !structuredDef.interfaceName
                            ? "interfaceName"
                            : "componentName";
                    workflowStages.push({
                        stage: `stub_creation_skipped:${contractStageData.stage.split(":")[1]}`,
                        success: false,
                        error: `Missing ${missingName} for stub generation.`,
                        duration: Date.now() - stageStartTime,
                    });
                    return fail(new SDDError("StubGenerationSkipped", `Cannot generate stub for ${contractStageData.stage.split(":")[1]} due to missing ${missingName}.`));
                }
                const stageName = `stub_creation:${structuredDef.interfaceName}`;
                const stubResult = await seamManager.executeSeam("sdd_create_stub", structuredDef // Pass the whole structured definition object
                );
                workflowStages.push({
                    stage: stageName,
                    success: stubResult.success,
                    output: stubResult.data,
                    error: stubResult.success ? undefined : stubResult.error?.message,
                    duration: Date.now() - stageStartTime,
                });
                if (!stubResult.success) {
                    return fail(stubResult.error ||
                        new SDDError("StubGenerationFailed", `Stub generation failed for interface '${structuredDef.interfaceName}'.`));
                }
                if (stubResult.data?.filePathSuggestion)
                    stubs.push(stubResult.data.filePathSuggestion);
                else if (stubResult.data?.stubCode)
                    stubs.push(stubResult.data.stubCode);
                else {
                    return fail(new SDDError("StubGenerationOutputError", `Stub generation for '${structuredDef.interfaceName}' did not provide a filePathSuggestion or stubCode.`));
                }
            }
            // Blueprint: Stage 4 - Generate tests for each contract
            // Assumes 'sdd_generate_test' tool is registered.
            // Expected input: The 'structuredContractDefinition' from the contract generation stage's output.
            // Expected output: { testFilePath?: string, testCode?: string }
            for (const contractStageData of workflowStages.filter((s) => s.stage.startsWith("contract_generation:") && s.success)) {
                const stageStartTime = Date.now();
                const structuredDef = contractStageData.output?.structuredContractDefinition;
                if (!structuredDef || !structuredDef.interfaceName) {
                    workflowStages.push({
                        stage: `test_generation_skipped:${contractStageData.stage.split(":")[1]}`,
                        success: false,
                        error: "Missing structuredContractDefinition or interfaceName for test generation.",
                        duration: Date.now() - stageStartTime,
                    });
                    return fail(new SDDError("TestGenerationSkipped", `Cannot generate tests for ${contractStageData.stage.split(":")[1]} due to missing structuredContractDefinition or interfaceName.`));
                }
                const stageName = `test_generation:${structuredDef.interfaceName}`;
                const testResult = await seamManager.executeSeam("sdd_generate_test", structuredDef // Pass the whole structured definition object
                );
                workflowStages.push({
                    stage: stageName,
                    success: testResult.success,
                    output: testResult.data,
                    error: testResult.success ? undefined : testResult.error?.message,
                    duration: Date.now() - stageStartTime,
                });
                if (!testResult.success) {
                    return fail(testResult.error ||
                        new SDDError("TestGenerationFailed", `Test generation failed for interface '${structuredDef.interfaceName}'.`));
                }
                if (testResult.data?.testFilePath)
                    tests.push(testResult.data.testFilePath);
                else if (testResult.data?.testCode)
                    tests.push(testResult.data.testCode);
                else {
                    return fail(new SDDError("TestGenerationOutputError", `Test generation for '${structuredDef.interfaceName}' did not provide a testFilePath or testCode.`));
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
        }
        catch (error) {
            // Blueprint: Catch-all for unexpected errors during orchestration.
            return fail(new SDDError("OrchestrationError", `Workflow orchestration encountered an unexpected error: ${error instanceof Error ? error.message : String(error)}`, error // Preserve original error for context
            ));
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
/**
 * Helper function (already present or can be added/verified)
 */
function getNodeName(node) {
    if (!node)
        return "<unknown_node>";
    // Attempt to get name from function/method declaration id or key
    if (node.id && node.id.type === AST_NODE_TYPES.Identifier)
        return node.id.name;
    if (node.key && node.key.type === AST_NODE_TYPES.Identifier)
        return node.key.name; // For class methods/properties
    // Attempt to get name from variable declarator id
    if (node.type === AST_NODE_TYPES.VariableDeclarator &&
        node.id.type === AST_NODE_TYPES.Identifier)
        return node.id.name;
    // Attempt to get name from an Identifier node itself (e.g. parameter)
    if (node.type === AST_NODE_TYPES.Identifier)
        return node.name;
    // For NewExpression, get the callee name
    if (node.type === AST_NODE_TYPES.NewExpression &&
        node.callee &&
        node.callee.type === AST_NODE_TYPES.Identifier)
        return node.callee.name;
    // For parameters which might be objects or arrays (destructuring)
    if (param && param.type === AST_NODE_TYPES.ObjectPattern)
        return "{...}";
    if (param && param.type === AST_NODE_TYPES.ArrayPattern)
        return "[...]";
    if (param &&
        param.type === AST_NODE_TYPES.RestElement &&
        param.argument &&
        param.argument.type === AST_NODE_TYPES.Identifier)
        return `...${param.argument.name}`;
    // Fallback for other node types or unnamed constructs
    return "<anonymous_or_unnamed>";
}
// 🎯 CRITICAL Rule: Stubs Must Throw NotImplementedError (REVISED with context)
const StubMustThrowNotImplementedError = {
    id: "stub-must-throw-notimplementederror",
    description: "Stub methods must throw NotImplementedError from 'src/stubs.js' or a compatible NotImplementedError.",
    severity: "error",
    apply: (node, context) => {
        const violations = [];
        // 🛡️ DEFENSIVE: Apply only if context indicates a stub
        if (!(context.artifactType === "typescript_stub" ||
            context.artifactPath?.endsWith(".stub.ts") ||
            context.artifactType === "typescript_multiple_stubs")) {
            return violations; // Not a stub, skip this rule
        }
        if (node.type === AST_NODE_TYPES.MethodDefinition ||
            node.type === AST_NODE_TYPES.FunctionDeclaration) {
            let functionBody;
            if (node.type === AST_NODE_TYPES.MethodDefinition && node.value.body) {
                functionBody = node.value.body;
            }
            else if (node.type === AST_NODE_TYPES.FunctionDeclaration &&
                node.body?.type === AST_NODE_TYPES.BlockStatement) {
                functionBody = node.body;
            }
            if (functionBody && functionBody.body) {
                const bodyStatements = functionBody.body;
                if (bodyStatements.length !== 1 ||
                    bodyStatements[0].type !== AST_NODE_TYPES.ThrowStatement) {
                    violations.push({
                        ruleId: StubMustThrowNotImplementedError.id,
                        message: `Stub Method/Function '${getNodeName(node)}' body should consist of a single 'throw new NotImplementedError(...)'. Found ${bodyStatements.length} statements, first is ${bodyStatements[0]?.type}.`,
                        node: node,
                        severity: StubMustThrowNotImplementedError.severity,
                    });
                    return violations;
                }
                const throwStatement = bodyStatements[0];
                if (!throwStatement.argument ||
                    throwStatement.argument.type !== AST_NODE_TYPES.NewExpression ||
                    throwStatement.argument.callee.type !== AST_NODE_TYPES.Identifier ||
                    throwStatement.argument.callee.name !== "NotImplementedError") {
                    violations.push({
                        ruleId: StubMustThrowNotImplementedError.id,
                        message: `Stub Method/Function '${getNodeName(node)}' must throw 'new NotImplementedError(...)'. Found 'throw new ${getNodeName(throwStatement.argument)}'.`,
                        node: throwStatement.argument || throwStatement,
                        severity: StubMustThrowNotImplementedError.severity,
                    });
                }
            }
            else if (node.type === AST_NODE_TYPES.MethodDefinition &&
                node.value.expression) {
                // Arrow function in class property
                violations.push({
                    ruleId: StubMustThrowNotImplementedError.id,
                    message: `Stub Method/Function '${getNodeName(node)}' uses an expression body. Ensure it throws NotImplementedError. Manual review needed or enhance rule.`,
                    node: node,
                    severity: "warning",
                });
            }
            else if (!functionBody &&
                node.type === AST_NODE_TYPES.FunctionDeclaration &&
                node.expression) {
                // Arrow function as standalone const
                // This case might be complex if it's an arrow function assigned to a variable.
                // The 'node' here is FunctionDeclaration, need to check its use if it's an expression.
                // For now, this specific pattern might require a more complex rule or be caught by a broader check.
            }
            else if (!functionBody) {
                violations.push({
                    ruleId: StubMustThrowNotImplementedError.id,
                    message: `Stub Method/Function '${getNodeName(node)}' has no discernible block body to check for NotImplementedError.`,
                    node: node,
                    severity: "warning",
                });
            }
        }
        return violations;
    },
};
// 💰 HIGH_ROI Rule: Presence of Blueprint Comments in Stubs (REVISED with context)
const StubRequiresBlueprintComment = {
    id: "stub-requires-blueprint-comment",
    description: "Stub methods should contain a '// Blueprint: ...' comment to guide implementation.",
    severity: "warning",
    apply: (node, context) => {
        const violations = [];
        if (!(context.artifactType === "typescript_stub" ||
            context.artifactPath?.endsWith(".stub.ts") ||
            context.artifactType === "typescript_multiple_stubs")) {
            return violations;
        }
        if (node.type === AST_NODE_TYPES.MethodDefinition ||
            node.type === AST_NODE_TYPES.FunctionDeclaration) {
            let foundBlueprintComment = false;
            if (context.ast?.comments) {
                for (const comment of context.ast.comments) {
                    if (comment.type === TSESTree.AST_TOKEN_TYPES.Line &&
                        comment.range[1] <= node.range[0]) {
                        const lineOfCommentEnd = context.sourceCodeText
                            .substring(0, comment.range[1])
                            .split("\\n").length;
                        const lineOfNodeStart = context.sourceCodeText
                            .substring(0, node.range[0])
                            .split("\\n").length;
                        if (lineOfNodeStart - lineOfCommentEnd <= 5) {
                            if (comment.value.trim().startsWith("Blueprint:")) {
                                foundBlueprintComment = true;
                                break;
                            }
                        }
                    }
                }
            }
            if (!foundBlueprintComment) {
                violations.push({
                    ruleId: StubRequiresBlueprintComment.id,
                    message: `Stub Method/Function '${getNodeName(node)}' is recommended to have a '// Blueprint: ...' comment.`,
                    node: node,
                    severity: StubRequiresBlueprintComment.severity,
                });
            }
        }
        return violations;
    },
};
// 🛡️ DEFENSIVE Rule: Avoid \`any\` Type in Contract Method Signatures (REVISED with context)
const ContractMethodAvoidAny = {
    id: "contract-method-avoid-any",
    description: "Contract method signatures (parameters and return types) should avoid using the 'any' type.",
    severity: "warning",
    apply: (node, context) => {
        const violations = [];
        if (!(context.artifactType === "typescript_contract" ||
            context.artifactPath?.endsWith(".contract.ts"))) {
            return violations;
        }
        let functionNode;
        let nodeForName = node; // Node to use for getNodeName if functionNode.id is not available
        if (node.type === AST_NODE_TYPES.MethodDefinition) {
            functionNode = node.value;
            nodeForName = node; // key is part of MethodDefinition
        }
        else if (node.type === AST_NODE_TYPES.FunctionDeclaration) {
            functionNode = node;
            nodeForName = node; // id is part of FunctionDeclaration
        }
        else if (node.type === AST_NODE_TYPES.TSMethodSignature) {
            functionNode = node;
            nodeForName = node; // key is part of TSMethodSignature
        }
        // Consider FunctionExpression within VariableDeclarator for contracts if applicable
        // else if (node.type === AST_NODE_TYPES.VariableDeclarator && node.init &&
        //          (node.init.type === AST_NODE_TYPES.FunctionExpression || node.init.type === AST_NODE_TYPES.ArrowFunctionExpression)) {
        //   functionNode = node.init;
        //   nodeForName = node; // id is part of VariableDeclarator
        // }
        if (functionNode) {
            const functionName = getNodeName(functionNode.key || functionNode.id || nodeForName);
            if (functionNode.params) {
                for (const param of functionNode.params) {
                    let typeAnnotationNode;
                    let paramName = getNodeName(param); // Use helper for param name
                    if (param.type === AST_NODE_TYPES.Identifier &&
                        param.typeAnnotation) {
                        typeAnnotationNode = param.typeAnnotation.typeAnnotation;
                    }
                    else if (param.type === AST_NODE_TYPES.RestElement &&
                        param.typeAnnotation) {
                        typeAnnotationNode = param.typeAnnotation.typeAnnotation;
                    }
                    else if (param.type === AST_NODE_TYPES.TSParameterProperty &&
                        param.parameter.typeAnnotation) {
                        typeAnnotationNode = param.parameter.typeAnnotation.typeAnnotation;
                    }
                    else if (param.type === AST_NODE_TYPES.AssignmentPattern &&
                        param.left.type === AST_NODE_TYPES.Identifier &&
                        param.left.typeAnnotation) {
                        // Parameter with default value: foo(bar: string = "default")
                        typeAnnotationNode = param.left.typeAnnotation.typeAnnotation;
                    }
                    if (typeAnnotationNode &&
                        typeAnnotationNode.type === AST_NODE_TYPES.TSAnyKeyword) {
                        violations.push({
                            ruleId: ContractMethodAvoidAny.id,
                            message: `Parameter '${paramName}' in contract method '${functionName}' uses 'any' type. Prefer explicit types.`,
                            node: typeAnnotationNode,
                            severity: ContractMethodAvoidAny.severity,
                        });
                    }
                }
            }
            const returnTypeAnnotation = functionNode.returnType
                ?.typeAnnotation;
            if (returnTypeAnnotation &&
                returnTypeAnnotation.type === AST_NODE_TYPES.TSAnyKeyword) {
                violations.push({
                    ruleId: ContractMethodAvoidAny.id,
                    message: `Return type of contract method '${functionName}' is 'any'. Prefer explicit types.`,
                    node: returnTypeAnnotation,
                    severity: ContractMethodAvoidAny.severity,
                });
            }
        }
        return violations;
    },
};
// Ensure the rules array includes these new rules:
const rules = [
    MustReturnPromiseContractResult, // Existing or previously added
    StubMustThrowNotImplementedError,
    StubRequiresBlueprintComment,
    ContractMethodAvoidAny,
    // ... any other existing rules
];
//# sourceMappingURL=sdd-validate-compliance-tool.js.map