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
import { ContractResult, ToolModuleContract } from "../../contracts/contract-result.js";
declare const OrchestrateWorkflowInput: z.ZodObject<{
    prdText: z.ZodString;
    projectName: z.ZodString;
    designNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    prdText: string;
    projectName: string;
    designNotes?: string | undefined;
}, {
    prdText: string;
    projectName: string;
    designNotes?: string | undefined;
}>;
declare const OrchestrateWorkflowOutput: z.ZodObject<{
    projectStructure: z.ZodObject<{
        contracts: z.ZodArray<z.ZodString, "many">;
        stubs: z.ZodArray<z.ZodString, "many">;
        tests: z.ZodArray<z.ZodString, "many">;
        documentation: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        contracts: string[];
        stubs: string[];
        tests: string[];
        documentation: string[];
    }, {
        contracts: string[];
        stubs: string[];
        tests: string[];
        documentation: string[];
    }>;
    workflowStages: z.ZodArray<z.ZodObject<{
        stage: z.ZodString;
        success: z.ZodBoolean;
        output: z.ZodOptional<z.ZodAny>;
        error: z.ZodOptional<z.ZodString>;
        duration: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        success: boolean;
        stage: string;
        error?: string | undefined;
        output?: any;
        duration?: number | undefined;
    }, {
        success: boolean;
        stage: string;
        error?: string | undefined;
        output?: any;
        duration?: number | undefined;
    }>, "many">;
    seamDefinitions: z.ZodArray<z.ZodAny, "many">;
    totalDuration: z.ZodNumber;
    readyForImplementation: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    seamDefinitions: any[];
    projectStructure: {
        contracts: string[];
        stubs: string[];
        tests: string[];
        documentation: string[];
    };
    workflowStages: {
        success: boolean;
        stage: string;
        error?: string | undefined;
        output?: any;
        duration?: number | undefined;
    }[];
    totalDuration: number;
    readyForImplementation: boolean;
}, {
    seamDefinitions: any[];
    projectStructure: {
        contracts: string[];
        stubs: string[];
        tests: string[];
        documentation: string[];
    };
    workflowStages: {
        success: boolean;
        stage: string;
        error?: string | undefined;
        output?: any;
        duration?: number | undefined;
    }[];
    totalDuration: number;
    readyForImplementation: boolean;
}>;
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
declare class SDDOrchestrateWorkflowTool {
    readonly name = "sdd_orchestrate_full_workflow";
    readonly description = "Complete SDD workflow: PRD \u2192 Seams \u2192 Contracts \u2192 Stubs \u2192 Tests \u2192 Ready for Implementation";
    readonly inputSchema: z.ZodObject<{
        prdText: z.ZodString;
        projectName: z.ZodString;
        designNotes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        prdText: string;
        projectName: string;
        designNotes?: string | undefined;
    }, {
        prdText: string;
        projectName: string;
        designNotes?: string | undefined;
    }>;
    readonly outputSchema: z.ZodObject<{
        projectStructure: z.ZodObject<{
            contracts: z.ZodArray<z.ZodString, "many">;
            stubs: z.ZodArray<z.ZodString, "many">;
            tests: z.ZodArray<z.ZodString, "many">;
            documentation: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            contracts: string[];
            stubs: string[];
            tests: string[];
            documentation: string[];
        }, {
            contracts: string[];
            stubs: string[];
            tests: string[];
            documentation: string[];
        }>;
        workflowStages: z.ZodArray<z.ZodObject<{
            stage: z.ZodString;
            success: z.ZodBoolean;
            output: z.ZodOptional<z.ZodAny>;
            error: z.ZodOptional<z.ZodString>;
            duration: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            success: boolean;
            stage: string;
            error?: string | undefined;
            output?: any;
            duration?: number | undefined;
        }, {
            success: boolean;
            stage: string;
            error?: string | undefined;
            output?: any;
            duration?: number | undefined;
        }>, "many">;
        seamDefinitions: z.ZodArray<z.ZodAny, "many">;
        totalDuration: z.ZodNumber;
        readyForImplementation: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        seamDefinitions: any[];
        projectStructure: {
            contracts: string[];
            stubs: string[];
            tests: string[];
            documentation: string[];
        };
        workflowStages: {
            success: boolean;
            stage: string;
            error?: string | undefined;
            output?: any;
            duration?: number | undefined;
        }[];
        totalDuration: number;
        readyForImplementation: boolean;
    }, {
        seamDefinitions: any[];
        projectStructure: {
            contracts: string[];
            stubs: string[];
            tests: string[];
            documentation: string[];
        };
        workflowStages: {
            success: boolean;
            stage: string;
            error?: string | undefined;
            output?: any;
            duration?: number | undefined;
        }[];
        totalDuration: number;
        readyForImplementation: boolean;
    }>;
    execute(input: OrchestrateWorkflowInput): Promise<ContractResult<OrchestrateWorkflowOutput>>;
}
export declare const sddOrchestrateWorkflowTool: SDDOrchestrateWorkflowTool;
export declare const TOOL_MODULE_CONTRACT: ToolModuleContract<typeof OrchestrateWorkflowInput, typeof OrchestrateWorkflowOutput>;
export {};
