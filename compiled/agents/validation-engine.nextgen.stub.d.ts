/**
 * SDD MCP Server - NextGen ValidationEngine (AST-based, SDD-strict)
 *
 * 🎯 PURPOSE: Enforce SDD compliance, contract/stub/test coverage, and blueprint documentation using AST-level analysis and granular reporting.
 *
 * SEAMS:
 * 1. File Discovery Seam: Find all contract, stub, and test files.
 * 2. AST Parsing Seam: Parse files into ASTs for precise analysis.
 * 3. Contract Analysis Seam: Enforce async, ContractResult<T>, and Blueprint comments on all contract methods.
 * 4. Stub Analysis Seam: Ensure every contract has a stub with NotImplementedError fail-fast logic.
 * 5. Test Analysis Seam: Ensure every contract/stub method is covered by a test (static and optionally runtime coverage).
 * 6. Blueprint Comment Seam: Require // Blueprint: comments for all SDD artifacts.
 * 7. Reporting Seam: Report all issues with file, line, column, code snippet, rule, and suggested fix.
 * 8. Error Handling Seam: Robust error capture and reporting.
 *
 * CONTRACT:
 * - Input: Validation request (project root, options)
 * - Output: Granular compliance report (per file, per rule, with locations and suggestions)
 *
 * NOTE: This is a stub/blueprint for Gemini to improve and implement.
 */
import { z } from "zod";
import { ContractResult, ToolModuleContract } from "../contracts.js";
export declare const NextGenValidationInput: z.ZodObject<{
    projectRoot: z.ZodString;
    strictMode: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    requireTestCoverage: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    strictMode: boolean;
    projectRoot: string;
    requireTestCoverage: boolean;
}, {
    projectRoot: string;
    strictMode?: boolean | undefined;
    requireTestCoverage?: boolean | undefined;
}>;
export declare const NextGenValidationIssue: z.ZodObject<{
    file: z.ZodString;
    line: z.ZodNumber;
    column: z.ZodNumber;
    rule: z.ZodString;
    message: z.ZodString;
    codeSnippet: z.ZodOptional<z.ZodString>;
    suggestion: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    rule: string;
    file: string;
    line: number;
    column: number;
    codeSnippet?: string | undefined;
    suggestion?: string | undefined;
}, {
    message: string;
    rule: string;
    file: string;
    line: number;
    column: number;
    codeSnippet?: string | undefined;
    suggestion?: string | undefined;
}>;
export declare const NextGenValidationReport: z.ZodObject<{
    issues: z.ZodArray<z.ZodObject<{
        file: z.ZodString;
        line: z.ZodNumber;
        column: z.ZodNumber;
        rule: z.ZodString;
        message: z.ZodString;
        codeSnippet: z.ZodOptional<z.ZodString>;
        suggestion: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        rule: string;
        file: string;
        line: number;
        column: number;
        codeSnippet?: string | undefined;
        suggestion?: string | undefined;
    }, {
        message: string;
        rule: string;
        file: string;
        line: number;
        column: number;
        codeSnippet?: string | undefined;
        suggestion?: string | undefined;
    }>, "many">;
    summary: z.ZodObject<{
        totalFiles: z.ZodNumber;
        totalIssues: z.ZodNumber;
        compliant: z.ZodBoolean;
        coverage: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        totalFiles: number;
        totalIssues: number;
        compliant: boolean;
        coverage?: number | undefined;
    }, {
        totalFiles: number;
        totalIssues: number;
        compliant: boolean;
        coverage?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    issues: {
        message: string;
        rule: string;
        file: string;
        line: number;
        column: number;
        codeSnippet?: string | undefined;
        suggestion?: string | undefined;
    }[];
    summary: {
        totalFiles: number;
        totalIssues: number;
        compliant: boolean;
        coverage?: number | undefined;
    };
}, {
    issues: {
        message: string;
        rule: string;
        file: string;
        line: number;
        column: number;
        codeSnippet?: string | undefined;
        suggestion?: string | undefined;
    }[];
    summary: {
        totalFiles: number;
        totalIssues: number;
        compliant: boolean;
        coverage?: number | undefined;
    };
}>;
type NextGenValidationInput = z.infer<typeof NextGenValidationInput>;
type NextGenValidationReport = z.infer<typeof NextGenValidationReport>;
export declare class NextGenValidationEngine {
    readonly name = "nextgen_validation_engine";
    readonly description = "AST-based, SDD-strict validation engine for contracts, stubs, and tests.";
    readonly inputSchema: z.ZodObject<{
        projectRoot: z.ZodString;
        strictMode: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        requireTestCoverage: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        strictMode: boolean;
        projectRoot: string;
        requireTestCoverage: boolean;
    }, {
        projectRoot: string;
        strictMode?: boolean | undefined;
        requireTestCoverage?: boolean | undefined;
    }>;
    readonly outputSchema: z.ZodObject<{
        issues: z.ZodArray<z.ZodObject<{
            file: z.ZodString;
            line: z.ZodNumber;
            column: z.ZodNumber;
            rule: z.ZodString;
            message: z.ZodString;
            codeSnippet: z.ZodOptional<z.ZodString>;
            suggestion: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            message: string;
            rule: string;
            file: string;
            line: number;
            column: number;
            codeSnippet?: string | undefined;
            suggestion?: string | undefined;
        }, {
            message: string;
            rule: string;
            file: string;
            line: number;
            column: number;
            codeSnippet?: string | undefined;
            suggestion?: string | undefined;
        }>, "many">;
        summary: z.ZodObject<{
            totalFiles: z.ZodNumber;
            totalIssues: z.ZodNumber;
            compliant: z.ZodBoolean;
            coverage: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            totalFiles: number;
            totalIssues: number;
            compliant: boolean;
            coverage?: number | undefined;
        }, {
            totalFiles: number;
            totalIssues: number;
            compliant: boolean;
            coverage?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        issues: {
            message: string;
            rule: string;
            file: string;
            line: number;
            column: number;
            codeSnippet?: string | undefined;
            suggestion?: string | undefined;
        }[];
        summary: {
            totalFiles: number;
            totalIssues: number;
            compliant: boolean;
            coverage?: number | undefined;
        };
    }, {
        issues: {
            message: string;
            rule: string;
            file: string;
            line: number;
            column: number;
            codeSnippet?: string | undefined;
            suggestion?: string | undefined;
        }[];
        summary: {
            totalFiles: number;
            totalIssues: number;
            compliant: boolean;
            coverage?: number | undefined;
        };
    }>;
    /**
     * Blueprint: SDD-compliant, AST-based validation workflow
     * 1. Discover all relevant files (contracts, stubs, tests)
     * 2. Parse each file into an AST
     * 3. For each contract:
     *    - Enforce async, ContractResult<T>, Blueprint comment
     *    - Ensure stub exists with NotImplementedError
     *    - Ensure test exists and covers all methods
     * 4. Aggregate issues with file, line, column, rule, message, suggestion
     * 5. Return granular report
     */
    execute(input: NextGenValidationInput): Promise<ContractResult<NextGenValidationReport>>;
}
export declare const TOOL_MODULE_CONTRACT: ToolModuleContract;
export {};
/**
 * PROMPT FOR GEMINI:
 *
 * Gemini, please:
 * - Review and improve this stub/blueprint for a next-generation SDD validation engine.
 * - Implement AST-based contract/stub/test analysis, strict SDD enforcement, and granular reporting as described.
 * - Ensure all seams are modular and SDD-compliant.
 * - In addition to validating business contracts/stubs/tests, also validate the seams, contracts, and SDD compliance of all SDD tools themselves (stub generator, orchestrator, visualizer, compliance validator).
 * - Add any enhancements for performance, extensibility, or developer experience you recommend.
 * - Return a production-ready implementation.
 */
