/**
 * MCP Intelligence Bridge
 * 🔌 INTEGRATION: Bridge between MCP tool layer and Enhanced Seam Analyzer
 * PURPOSE: Route MCP tool requests to appropriate Enhanced Analyzer methods
 * SEAM: MCP Tools → Intelligence Bridge → Enhanced Seam Analyzer
 */

import type {
  ContractResult,
  DataFlowAnalysisInput,
  IEnhancedSeamAnalyzer,
  InteractionMatrixInput,
  SeamAnalysisInput,
  SeamValidationInput,
} from "../contracts.js";
import { EnhancedSeamAnalyzer } from "./enhanced-seam-analyzer.js";

/**
 * 🔌 INTEGRATION: MCP Intelligence Bridge Contract
 * SEAM INTERFACE: Defines communication pathway between MCP layer and intelligence layer
 */
export interface IMCPIntelligenceBridge {
  /**
   * 🎯 CRITICAL: Route requests to Enhanced Seam Analyzer
   * PURPOSE: Central routing point for all enhanced analysis requests
   * DATA FLOW: MCP Tool Request → Method Selection → Enhanced Analyzer → Result
   * FAILURE MODES: Invalid method name, analyzer not available, processing errors
   */
  routeToEnhancedAnalyzer<T>(
    method: keyof IEnhancedSeamAnalyzer,
    input: any
  ): Promise<ContractResult<T>>;

  /**
   * ⚡ QUICK_WIN: Health check for analyzer availability
   * PURPOSE: Verify Enhanced Analyzer is available and responsive
   * DATA FLOW: Health Check Request → Analyzer Status → Health Report
   * FAILURE MODES: Analyzer unavailable, initialization errors
   */
  checkAnalyzerHealth(): Promise<ContractResult<AnalyzerHealthStatus>>;

  /**
   * 🛡️ DEFENSIVE: Initialize bridge and analyzer connection
   * PURPOSE: Set up bridge connection and verify analyzer is ready
   * DATA FLOW: Initialization Request → Analyzer Setup → Connection Status
   * FAILURE MODES: Analyzer initialization failure, dependency issues
   */
  initialize(): Promise<ContractResult<void>>;
}

export interface AnalyzerHealthStatus {
  available: boolean;
  lastResponseTime: number;
  version: string;
  capabilities: string[];
}

/**
 * 🔌 INTEGRATION: MCP Intelligence Bridge Implementation
 * DESIGN PATTERN: Bridge pattern connecting MCP tools to Enhanced Analyzer
 */
export class MCPIntelligenceBridge implements IMCPIntelligenceBridge {
  private enhancedAnalyzer: IEnhancedSeamAnalyzer;
  private initialized: boolean = false;
  private readonly agentId = "MCPIntelligenceBridge";

  constructor() {
    // 💰 HIGH_ROI: Use existing Enhanced Seam Analyzer instance
    this.enhancedAnalyzer = new EnhancedSeamAnalyzer();
  }

  /**
   * 🛡️ DEFENSIVE: Initialize bridge connection
   */
  async initialize(): Promise<ContractResult<void>> {
    try {
      if (this.initialized) {
        return {
          success: true,
          metadata: {
            agentId: this.agentId,
            seamName: "initialize",
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Verify analyzer is available (health check)
      const healthCheck = await this.checkAnalyzerHealth();
      if (!healthCheck.success) {
        return {
          success: false,
          error: {
            category: "DependencyError",
            message: "Enhanced Seam Analyzer is not available",
            agentId: this.agentId,
            seamName: "initialize",
            timestamp: new Date().toISOString(),
            details: { healthCheck: healthCheck.error },
          },
        };
      }

      this.initialized = true;
      return {
        success: true,
        metadata: {
          agentId: this.agentId,
          seamName: "initialize",
          timestamp: new Date().toISOString(),
          processingTimeMs: 0,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          category: "ProcessingError",
          message: `Bridge initialization failed: ${
            error instanceof Error ? error.message : String(error)
          }`,
          agentId: this.agentId,
          seamName: "initialize",
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  /**
   * ⚡ QUICK_WIN: Check Enhanced Analyzer health
   */
  async checkAnalyzerHealth(): Promise<ContractResult<AnalyzerHealthStatus>> {
    try {
      const startTime = Date.now();

      // Test basic analyzer availability by checking if methods exist
      const hasRequiredMethods =
        typeof this.enhancedAnalyzer.analyzeRequirementsEnhanced ===
          "function" &&
        typeof this.enhancedAnalyzer.generateInteractionMatrix === "function" &&
        typeof this.enhancedAnalyzer.analyzeDataFlows === "function" &&
        typeof this.enhancedAnalyzer.validateSeamReadiness === "function";

      const responseTime = Date.now() - startTime;

      const status: AnalyzerHealthStatus = {
        available: hasRequiredMethods,
        lastResponseTime: responseTime,
        version: "1.0.0",
        capabilities: [
          "enhanced_seam_analysis",
          "interaction_matrix_generation",
          "data_flow_analysis",
          "seam_validation",
        ],
      };

      return {
        success: true,
        data: status,
        metadata: {
          agentId: this.agentId,
          seamName: "checkAnalyzerHealth",
          timestamp: new Date().toISOString(),
          processingTimeMs: responseTime,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          category: "ProcessingError",
          message: `Health check failed: ${
            error instanceof Error ? error.message : String(error)
          }`,
          agentId: this.agentId,
          seamName: "checkAnalyzerHealth",
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  /**
   * 🎯 CRITICAL: Route requests to Enhanced Seam Analyzer
   * SEAM IMPLEMENTATION: Central routing logic for all analyzer methods
   */
  async routeToEnhancedAnalyzer<T>(
    method: keyof IEnhancedSeamAnalyzer,
    input: any
  ): Promise<ContractResult<T>> {
    const startTime = Date.now();

    try {
      // 🛡️ DEFENSIVE: Ensure bridge is initialized
      if (!this.initialized) {
        const initResult = await this.initialize();
        if (!initResult.success) {
          return initResult as ContractResult<T>;
        }
      }

      // 🔌 INTEGRATION: Route to specific analyzer method
      let result: ContractResult<any>;

      switch (method) {
        case "analyzeRequirementsEnhanced":
          result = await this.enhancedAnalyzer.analyzeRequirementsEnhanced(
            input as SeamAnalysisInput
          );
          break;

        case "generateInteractionMatrix":
          result = await this.enhancedAnalyzer.generateInteractionMatrix(
            input as InteractionMatrixInput
          );
          break;

        case "analyzeDataFlows":
          result = await this.enhancedAnalyzer.analyzeDataFlows(
            input as DataFlowAnalysisInput
          );
          break;

        case "validateSeamReadiness":
          result = await this.enhancedAnalyzer.validateSeamReadiness(
            input as SeamValidationInput
          );
          break;

        default:
          return {
            success: false,
            error: {
              category: "ValidationError",
              message: `Unknown analyzer method: ${String(method)}`,
              agentId: this.agentId,
              seamName: "routeToEnhancedAnalyzer",
              timestamp: new Date().toISOString(),
              details: {
                method,
                availableMethods: [
                  "analyzeRequirementsEnhanced",
                  "generateInteractionMatrix",
                  "analyzeDataFlows",
                  "validateSeamReadiness",
                ],
              },
            },
          };
      }

      // 🛡️ DEFENSIVE: Add bridge metadata to result
      if (result.metadata) {
        result.metadata.processingTimeMs = Date.now() - startTime;
        result.metadata.bridgeAgentId = this.agentId;
      }

      return result as ContractResult<T>;
    } catch (error) {
      return {
        success: false,
        error: {
          category: "ProcessingError",
          message: `Routing to ${String(method)} failed: ${
            error instanceof Error ? error.message : String(error)
          }`,
          agentId: this.agentId,
          seamName: "routeToEnhancedAnalyzer",
          timestamp: new Date().toISOString(),
          details: { method, input },
        },
        metadata: {
          agentId: this.agentId,
          seamName: "routeToEnhancedAnalyzer",
          timestamp: new Date().toISOString(),
          processingTimeMs: Date.now() - startTime,
        },
      };
    }
  }
}

// 💰 HIGH_ROI: Export singleton instance for use across MCP tools
export const mcpIntelligenceBridge = new MCPIntelligenceBridge();
