/**
 * Analyze Data Flows MCP Tool
 * 💰 HIGH_ROI: Data flow analysis and bottleneck identification tool
 * PURPOSE: Analyze data transformations and identify optimization opportunities
 */
import type { ContractResult, DataFlowAnalysis, ToolModuleContract } from "../contracts.js";
export interface AnalyzeDataFlowsTool {
    name: "analyze_data_flows";
    description: "Analyze data flows between components and identify potential bottlenecks";
    inputSchema: {
        type: "object";
        properties: {
            seamDefinitions: {
                type: "array";
                items: {
                    type: "object";
                    properties: {
                        name: {
                            type: "string";
                        };
                        source: {
                            type: "string";
                        };
                        target: {
                            type: "string";
                        };
                        dataFlow: {
                            type: "string";
                            enum: ["IN", "OUT", "BOTH"];
                        };
                        inputType: {
                            type: "string";
                        };
                        outputType: {
                            type: "string";
                        };
                    };
                    required: ["name", "source", "target", "dataFlow"];
                };
                description: "Seam definitions to analyze for data flows";
            };
            performanceRequirements: {
                type: "object";
                properties: {
                    maxLatency: {
                        type: "number";
                        description: "Maximum acceptable latency in ms";
                    };
                    minThroughput: {
                        type: "number";
                        description: "Minimum required throughput";
                    };
                    memoryConstraints: {
                        type: "string";
                        description: "Memory usage constraints";
                    };
                };
                description: "Performance requirements and constraints";
            };
            includeOptimizations: {
                type: "boolean";
                description: "Include optimization recommendations in analysis";
            };
            analyzeBottlenecks: {
                type: "boolean";
                description: "Perform bottleneck analysis on data flows";
            };
        };
        required: ["seamDefinitions"];
    };
}
/**
 * 💰 HIGH_ROI: Analyze data flows tool handler
 * SEAM: MCP Tool Layer → Intelligence Bridge → Enhanced Seam Analyzer
 */
export declare function handleAnalyzeDataFlows(args: unknown, intelligenceBridge: any): Promise<ContractResult<DataFlowAnalysis>>;
export declare const ANALYZE_DATA_FLOWS_TOOL_DEFINITION: AnalyzeDataFlowsTool;
export declare const TOOL_MODULE_CONTRACT: ToolModuleContract;
