/**
 * Enhanced Seam Analysis MCP Tool
 * 💰 HIGH_ROI: Core seam identification tool connecting MCP layer to Enhanced Analyzer
 * PURPOSE: Expose enhanced seam analysis capabilities through MCP interface
 */
import type { ContractResult, EnhancedSeamAnalysis, ToolModuleContract } from "../contracts.js";
export interface EnhancedSeamAnalysisTool {
    name: "enhanced_seam_analysis";
    description: "Analyze requirements using enhanced pattern recognition and AI-powered seam identification";
    inputSchema: {
        type: "object";
        properties: {
            requirementsText: {
                type: "string";
                description: "Requirements or PRD text to analyze";
            };
            designNotes?: {
                type: "string";
                description: "Optional design notes or constraints";
            };
            analysisDepth: {
                type: "string";
                enum: ["basic", "detailed", "comprehensive"];
                description: "Depth of analysis to perform";
            };
            focusAreas: {
                type: "array";
                items: {
                    type: "string";
                    enum: [
                        "data_flows",
                        "integrations",
                        "dependencies",
                        "cross_cutting_concerns"
                    ];
                };
                description: "Areas to focus analysis on";
            };
        };
        required: ["requirementsText"];
    };
}
/**
 * 🎯 CRITICAL: Enhanced seam analysis tool handler
 * SEAM: MCP Tool Layer → Intelligence Bridge → Enhanced Seam Analyzer
 */
export declare function handleEnhancedSeamAnalysis(args: unknown, intelligenceBridge: any): Promise<ContractResult<EnhancedSeamAnalysis>>;
export declare const ENHANCED_SEAM_ANALYSIS_TOOL_DEFINITION: EnhancedSeamAnalysisTool;
export declare const TOOL_MODULE_CONTRACT: ToolModuleContract;
