/**
 * SDD Visualize Architecture Tool
 *
 * 🎯 SEAM: Architecture visualization and diagram generation
 * 📋 PURPOSE: Generate Mermaid diagrams showing seam connections with color-coded implementation status
 * 🔗 CONNECTS: Seam definitions → Visual architecture diagrams
 *
 * This tool transforms abstract seam definitions into concrete visual representations:
 * - Component relationship diagrams (Mermaid flowcharts)
 * - Seam interaction matrices (Tables with metrics)
 * - Implementation status visualization (Color-coded diagrams)
 * - Data flow visualization (Directional arrows and annotations)
 *
 * SEAM BOUNDARIES:
 * - INPUT: Array of seam definitions + project metadata
 * - OUTPUT: Mermaid diagram code + SVG/PNG exports + status reports
 * - ERROR HANDLING: Validates seam structures, fails fast on malformed data
 * - DEPENDENCIES: Requires Mermaid syntax generation, optional diagram export
 */
import { z } from "zod";
import { ContractResult, ToolModuleContract } from "../../contracts.js";
declare const SeamVisualizationInput: z.ZodObject<{
    seams: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        participants: z.ZodArray<z.ZodString, "many">;
        dataFlow: z.ZodEnum<["IN", "OUT", "BOTH"]>;
        purpose: z.ZodString;
        status: z.ZodOptional<z.ZodEnum<["stub", "partial", "complete"]>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        dataFlow: "IN" | "OUT" | "BOTH";
        purpose: string;
        participants: string[];
        status?: "stub" | "partial" | "complete" | undefined;
    }, {
        name: string;
        dataFlow: "IN" | "OUT" | "BOTH";
        purpose: string;
        participants: string[];
        status?: "stub" | "partial" | "complete" | undefined;
    }>, "many">;
    projectName: z.ZodString;
    diagramType: z.ZodDefault<z.ZodOptional<z.ZodEnum<["flowchart", "sequence", "class", "interaction_matrix"]>>>;
    includeMetrics: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    outputFormat: z.ZodDefault<z.ZodOptional<z.ZodEnum<["mermaid", "svg", "png", "all"]>>>;
}, "strip", z.ZodTypeAny, {
    includeMetrics: boolean;
    projectName: string;
    seams: {
        name: string;
        dataFlow: "IN" | "OUT" | "BOTH";
        purpose: string;
        participants: string[];
        status?: "stub" | "partial" | "complete" | undefined;
    }[];
    diagramType: "class" | "flowchart" | "sequence" | "interaction_matrix";
    outputFormat: "mermaid" | "svg" | "png" | "all";
}, {
    projectName: string;
    seams: {
        name: string;
        dataFlow: "IN" | "OUT" | "BOTH";
        purpose: string;
        participants: string[];
        status?: "stub" | "partial" | "complete" | undefined;
    }[];
    includeMetrics?: boolean | undefined;
    diagramType?: "class" | "flowchart" | "sequence" | "interaction_matrix" | undefined;
    outputFormat?: "mermaid" | "svg" | "png" | "all" | undefined;
}>;
declare const VisualizeArchitectureOutput: z.ZodObject<{
    diagrams: z.ZodArray<z.ZodObject<{
        mermaidCode: z.ZodString;
        diagramUrl: z.ZodOptional<z.ZodString>;
        svgContent: z.ZodOptional<z.ZodString>;
        pngBase64: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        mermaidCode: string;
        diagramUrl?: string | undefined;
        svgContent?: string | undefined;
        pngBase64?: string | undefined;
    }, {
        mermaidCode: string;
        diagramUrl?: string | undefined;
        svgContent?: string | undefined;
        pngBase64?: string | undefined;
    }>, "many">;
    metrics: z.ZodOptional<z.ZodObject<{
        totalComponents: z.ZodNumber;
        totalSeams: z.ZodNumber;
        averageConnections: z.ZodNumber;
        complexityScore: z.ZodNumber;
        implementationProgress: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        totalComponents: number;
        totalSeams: number;
        averageConnections: number;
        complexityScore: number;
        implementationProgress: number;
    }, {
        totalComponents: number;
        totalSeams: number;
        averageConnections: number;
        complexityScore: number;
        implementationProgress: number;
    }>>;
    statusSummary: z.ZodObject<{
        stubCount: z.ZodNumber;
        partialCount: z.ZodNumber;
        completeCount: z.ZodNumber;
        totalSeams: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        totalSeams: number;
        stubCount: number;
        partialCount: number;
        completeCount: number;
    }, {
        totalSeams: number;
        stubCount: number;
        partialCount: number;
        completeCount: number;
    }>;
    recommendations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    diagrams: {
        mermaidCode: string;
        diagramUrl?: string | undefined;
        svgContent?: string | undefined;
        pngBase64?: string | undefined;
    }[];
    statusSummary: {
        totalSeams: number;
        stubCount: number;
        partialCount: number;
        completeCount: number;
    };
    metrics?: {
        totalComponents: number;
        totalSeams: number;
        averageConnections: number;
        complexityScore: number;
        implementationProgress: number;
    } | undefined;
    recommendations?: string[] | undefined;
}, {
    diagrams: {
        mermaidCode: string;
        diagramUrl?: string | undefined;
        svgContent?: string | undefined;
        pngBase64?: string | undefined;
    }[];
    statusSummary: {
        totalSeams: number;
        stubCount: number;
        partialCount: number;
        completeCount: number;
    };
    metrics?: {
        totalComponents: number;
        totalSeams: number;
        averageConnections: number;
        complexityScore: number;
        implementationProgress: number;
    } | undefined;
    recommendations?: string[] | undefined;
}>;
type SeamVisualizationInput = z.infer<typeof SeamVisualizationInput>;
type VisualizeArchitectureOutput = z.infer<typeof VisualizeArchitectureOutput>;
/**
 * SDD Visualize Architecture Tool Implementation
 *
 * Transforms seam definitions into visual diagrams following these patterns:
 * 1. Component Analysis (Identify all participants)
 * 2. Relationship Mapping (Map seam connections)
 * 3. Status Color Coding (Visual implementation progress)
 * 4. Diagram Generation (Mermaid syntax creation)
 * 5. Export Processing (Optional SVG/PNG generation)
 *
 * Supports multiple diagram types and export formats for different use cases.
 */
declare class SDDVisualizeArchitectureTool {
    readonly name = "sdd_visualize_architecture";
    readonly description = "Generate Mermaid diagrams showing seam connections with color-coded implementation status";
    readonly inputSchema: z.ZodObject<{
        seams: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            participants: z.ZodArray<z.ZodString, "many">;
            dataFlow: z.ZodEnum<["IN", "OUT", "BOTH"]>;
            purpose: z.ZodString;
            status: z.ZodOptional<z.ZodEnum<["stub", "partial", "complete"]>>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            dataFlow: "IN" | "OUT" | "BOTH";
            purpose: string;
            participants: string[];
            status?: "stub" | "partial" | "complete" | undefined;
        }, {
            name: string;
            dataFlow: "IN" | "OUT" | "BOTH";
            purpose: string;
            participants: string[];
            status?: "stub" | "partial" | "complete" | undefined;
        }>, "many">;
        projectName: z.ZodString;
        diagramType: z.ZodDefault<z.ZodOptional<z.ZodEnum<["flowchart", "sequence", "class", "interaction_matrix"]>>>;
        includeMetrics: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        outputFormat: z.ZodDefault<z.ZodOptional<z.ZodEnum<["mermaid", "svg", "png", "all"]>>>;
    }, "strip", z.ZodTypeAny, {
        includeMetrics: boolean;
        projectName: string;
        seams: {
            name: string;
            dataFlow: "IN" | "OUT" | "BOTH";
            purpose: string;
            participants: string[];
            status?: "stub" | "partial" | "complete" | undefined;
        }[];
        diagramType: "class" | "flowchart" | "sequence" | "interaction_matrix";
        outputFormat: "mermaid" | "svg" | "png" | "all";
    }, {
        projectName: string;
        seams: {
            name: string;
            dataFlow: "IN" | "OUT" | "BOTH";
            purpose: string;
            participants: string[];
            status?: "stub" | "partial" | "complete" | undefined;
        }[];
        includeMetrics?: boolean | undefined;
        diagramType?: "class" | "flowchart" | "sequence" | "interaction_matrix" | undefined;
        outputFormat?: "mermaid" | "svg" | "png" | "all" | undefined;
    }>;
    readonly outputSchema: z.ZodObject<{
        diagrams: z.ZodArray<z.ZodObject<{
            mermaidCode: z.ZodString;
            diagramUrl: z.ZodOptional<z.ZodString>;
            svgContent: z.ZodOptional<z.ZodString>;
            pngBase64: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            mermaidCode: string;
            diagramUrl?: string | undefined;
            svgContent?: string | undefined;
            pngBase64?: string | undefined;
        }, {
            mermaidCode: string;
            diagramUrl?: string | undefined;
            svgContent?: string | undefined;
            pngBase64?: string | undefined;
        }>, "many">;
        metrics: z.ZodOptional<z.ZodObject<{
            totalComponents: z.ZodNumber;
            totalSeams: z.ZodNumber;
            averageConnections: z.ZodNumber;
            complexityScore: z.ZodNumber;
            implementationProgress: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            totalComponents: number;
            totalSeams: number;
            averageConnections: number;
            complexityScore: number;
            implementationProgress: number;
        }, {
            totalComponents: number;
            totalSeams: number;
            averageConnections: number;
            complexityScore: number;
            implementationProgress: number;
        }>>;
        statusSummary: z.ZodObject<{
            stubCount: z.ZodNumber;
            partialCount: z.ZodNumber;
            completeCount: z.ZodNumber;
            totalSeams: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            totalSeams: number;
            stubCount: number;
            partialCount: number;
            completeCount: number;
        }, {
            totalSeams: number;
            stubCount: number;
            partialCount: number;
            completeCount: number;
        }>;
        recommendations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        diagrams: {
            mermaidCode: string;
            diagramUrl?: string | undefined;
            svgContent?: string | undefined;
            pngBase64?: string | undefined;
        }[];
        statusSummary: {
            totalSeams: number;
            stubCount: number;
            partialCount: number;
            completeCount: number;
        };
        metrics?: {
            totalComponents: number;
            totalSeams: number;
            averageConnections: number;
            complexityScore: number;
            implementationProgress: number;
        } | undefined;
        recommendations?: string[] | undefined;
    }, {
        diagrams: {
            mermaidCode: string;
            diagramUrl?: string | undefined;
            svgContent?: string | undefined;
            pngBase64?: string | undefined;
        }[];
        statusSummary: {
            totalSeams: number;
            stubCount: number;
            partialCount: number;
            completeCount: number;
        };
        metrics?: {
            totalComponents: number;
            totalSeams: number;
            averageConnections: number;
            complexityScore: number;
            implementationProgress: number;
        } | undefined;
        recommendations?: string[] | undefined;
    }>;
    execute(input: SeamVisualizationInput): Promise<ContractResult<VisualizeArchitectureOutput>>;
}
export declare const sddVisualizeArchitectureTool: SDDVisualizeArchitectureTool;
export declare const TOOL_MODULE_CONTRACT: ToolModuleContract;
export {};
