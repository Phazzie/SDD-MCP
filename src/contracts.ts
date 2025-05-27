/**
 * SDD MCP Server - Core Contracts
 * Generated using SDD methodology for the MCP server itself
 */

import { z } from "zod";

// Blueprint: Agent identification for seam tracking
export type AgentId = string;

// Blueprint: Enhanced SDD result pattern with fail-fast validation
export type ContractResult<T> = {
  success: boolean;
  data?: T;
  error?: SDDError;
  metadata?: {
    agentId: string;
    timestamp: string;
    requestId?: string;
    processingTimeMs?: number;
    seamName?: string; // Track which seam handled the request
  };
};

// Blueprint: Structured error handling per SDD manifesto
export interface SDDError {
  category:
    | "ValidationError"
    | "BusinessRuleViolation"
    | "DependencyError"
    | "ProcessingError"
    | "NotImplementedError";
  message: string;
  details?: Record<string, any>;
  agentId: string;
  seamName?: string;
  timestamp: string;
  // For debugging and seam boundary validation
  inputValidation?: {
    field: string;
    expectedType: string;
    actualValue: any;
    validationRule: string;
  };
}

// Blueprint: Fail-fast input validation helper
export function createSDDError(
  agentId: string,
  category: SDDError["category"],
  message: string,
  details?: Record<string, any>,
  seamName?: string
): SDDError {
  return {
    category,
    message,
    details,
    agentId,
    seamName,
    timestamp: new Date().toISOString(),
  };
}

// Blueprint: Seam boundary validation (fail-fast principle)
export function validateSeamInput<T>(
  input: unknown,
  schema: z.ZodSchema<T>,
  agentId: string,
  seamName: string
): ContractResult<T> {
  try {
    const validated = schema.parse(input);
    return {
      success: true,
      data: validated,
      metadata: {
        agentId,
        seamName,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: createSDDError(
          agentId,
          "ValidationError",
          `Input validation failed for seam ${seamName}`,
          {
            validationErrors: error.errors,
            receivedInput: input,
          },
          seamName
        ),
      };
    }
    return {
      success: false,
      error: createSDDError(
        agentId,
        "ProcessingError",
        `Unexpected validation error in seam ${seamName}`,
        {
          originalError: error instanceof Error ? error.message : String(error),
        },
        seamName
      ),
    };
  }
}

// ================================
// MCP Server Contract
// ================================

export interface MCPServerContract {
  // Blueprint: Tool discovery per MCP specification
  listTools(): ContractResult<ToolDefinition[]>;

  // Blueprint: Tool execution with type validation
  executeTool(name: string, args: unknown): ContractResult<unknown>;

  // Blueprint: Server lifecycle management
  initialize(): ContractResult<void>;
  shutdown(): ContractResult<void>;

  // Blueprint: Health monitoring for AI assistant connection
  healthCheck(): ContractResult<ServerHealth>;
}

export const ToolDefinitionSchema = z.object({
  name: z.string(),
  description: z.string(),
  inputSchema: z.object({
    type: z.literal("object"),
    properties: z.record(z.any()),
    required: z.array(z.string()).optional(),
  }),
});

export type ToolDefinition = z.infer<typeof ToolDefinitionSchema>;

export type ServerHealth = {
  status: "healthy" | "degraded" | "unhealthy";
  uptime: number;
  toolsAvailable: number;
  lastError?: string;
};

// ================================
// SDD Function Contract
// ================================

export interface SDDFunctionContract {
  // Blueprint: Requirements analysis with seam identification
  analyzeRequirements(prd: string): Promise<ContractResult<SeamDefinition[]>>;

  // Blueprint: Contract generation from seam definition
  generateContract(
    seam: SeamDefinition
  ): Promise<ContractResult<ContractGenerationResult>>;

  // Blueprint: Stub creation with implementation blueprint
  createStub(
    contract: ContractGenerationResult
  ): Promise<ContractResult<StubGenerationResult>>;

  // Blueprint: Full workflow orchestration
  orchestrateWorkflow(prd: string): Promise<ContractResult<ProjectStructure>>;

  // Blueprint: Validation of SDD compliance
  validateProject(
    structure: ProjectStructure
  ): Promise<ContractResult<ValidationReport>>;
}

export const SeamDefinitionSchema = z.object({
  name: z.string(),
  participants: z.array(z.string()),
  dataFlow: z.enum(["IN", "OUT", "BOTH"]),
  purpose: z.string(),
  contractInterface: z.string(),
});

export type SeamDefinition = z.infer<typeof SeamDefinitionSchema>;

// ================================
// Template Processor Contract
// ================================

export interface TemplateProcessorContract {
  // Blueprint: Load template from configuration
  loadTemplate(
    templateType: "contract" | "stub" | "seam"
  ): Promise<ContractResult<string>>;

  // Blueprint: Process template with data substitution
  processTemplate(
    template: string,
    data: TemplateData
  ): Promise<ContractResult<string>>;

  // Blueprint: Validate template structure
  validateTemplate(template: string): Promise<ContractResult<boolean>>;

  // Blueprint: Template hot-reload for development
  reloadTemplates(): Promise<ContractResult<void>>;
}

export type TemplateData = Record<string, any>;

// ================================
// Validation Contract
// ================================

export interface ValidationContract {
  // Blueprint: Input validation with Zod schemas
  validateInput(
    schema: z.ZodSchema,
    data: unknown
  ): Promise<ContractResult<unknown>>;

  // Blueprint: Contract compliance checking
  validateContract(code: string): Promise<ContractResult<ComplianceReport>>;

  // Blueprint: Project health assessment
  validateProjectHealth(
    structure: ProjectStructure
  ): Promise<ContractResult<HealthReport>>;

  // Blueprint: SDD pattern verification
  validateSDDPatterns(code: string): Promise<ContractResult<PatternReport>>;
}

export type ComplianceReport = {
  isCompliant: boolean;
  issues: string[];
  suggestions: string[];
  score: number; // 0-100
};

export type HealthReport = {
  overall: "healthy" | "warning" | "error";
  seams: Array<{
    name: string;
    status: "implemented" | "stubbed" | "missing";
    issues: string[];
  }>;
  readinessScore: number; // 0-100
};

export type PatternReport = {
  patternsFound: string[];
  patternsMissing: string[];
  recommendations: string[];
  confidence: number; // 0-100
};

// ================================
// Error Handler Contract
// ================================

export interface ErrorHandlerContract {
  // Blueprint: Error categorization and handling
  handleError(
    error: Error,
    context: ErrorContext
  ): Promise<ContractResult<void>>;

  // Blueprint: Error logging with agent tracking
  logError(
    agentId: AgentId,
    error: string,
    details?: any
  ): Promise<ContractResult<void>>;

  // Blueprint: Error recovery suggestions
  suggestRecovery(errorType: string): Promise<ContractResult<string[]>>;

  // Blueprint: Diagnostic information collection
  collectDiagnostics(): Promise<ContractResult<DiagnosticInfo>>;
}

export type ErrorContext = {
  agentId: AgentId;
  operation: string;
  timestamp: string;
  additionalInfo?: Record<string, any>;
};

export type DiagnosticInfo = {
  errorCount: number;
  recentErrors: string[];
  systemHealth: "good" | "degraded" | "critical";
  recommendations: string[];
};

// ================================
// Configuration Contract
// ================================

export interface ConfigContract {
  // Blueprint: Configuration loading and validation
  loadConfig(): Promise<ContractResult<ServerConfig>>;

  // Blueprint: Runtime configuration updates
  updateConfig(updates: Partial<ServerConfig>): Promise<ContractResult<void>>;

  // Blueprint: Template path management
  getTemplatePath(templateType: string): Promise<ContractResult<string>>;

  // Blueprint: Feature flag checking
  isFeatureEnabled(feature: string): Promise<ContractResult<boolean>>;
}

export type ServerConfig = {
  server: {
    name: string;
    version: string;
    debug: boolean;
  };
  templates: {
    contractPath: string;
    stubPath: string;
    seamPath: string;
  };
  validation: {
    strictMode: boolean;
    requiredPatterns: string[];
  };
  features: {
    templateHotReload: boolean;
    diagnostics: boolean;
    extendedLogging: boolean;
  };
};

// ================================
// Shared Types (from original implementation)
// ================================

export interface ContractGenerationResult {
  contractCode: string;
  blueprintComments: string;
  typeAliases: string[];
  fileName: string;
  agentId: AgentId;
  testTemplate: string;
}

export interface StubGenerationResult {
  stubCode: string;
  integrationTests: string;
  healthCheck: string;
  agentId: AgentId;
  documentation: string;
}

export interface ProjectStructure {
  seams: SeamDefinition[];
  contracts: { [seamName: string]: ContractGenerationResult };
  stubs: { [seamName: string]: StubGenerationResult };
  integrationPlan: string;
  readinessScore: number;
}

export type ValidationReport = ComplianceReport & HealthReport & PatternReport;

// ================================
// 🎯 ENHANCED SEAM ANALYSIS CONTRACTS
// * PURPOSE: Define contracts for improved seam identification and analysis
// * SEAM: SeamAnalyzer ↔ Multiple analysis components
// * CONTRACT VERSION: 2.0.0 - Enhanced pattern recognition
// ================================

// Enhanced Seam Analysis Input Types
export interface SeamAnalysisInput {
  requirementsText: string;
  designNotes?: string;
  existingComponents?: string[];
  analysisDepth?: "basic" | "detailed" | "comprehensive";
  focusAreas?: (
    | "data_flows"
    | "integrations"
    | "cross_cutting"
    | "dependencies"
  )[];
}

export interface InteractionMatrixInput {
  components: string[];
  requirements: string;
  interactionPatterns?: Record<string, string[]>;
}

export interface DataFlowAnalysisInput {
  requirements: string;
  components: string[];
  dataTypes?: string[];
}

export interface SeamValidationInput {
  seams: SeamDefinition[];
  requirements: string;
  validationLevel?: "syntax" | "semantic" | "architectural";
}

// Enhanced Output Types
export interface EnhancedSeamAnalysis {
  identifiedSeams: SeamDefinition[];
  componentInteractions: ComponentInteraction[];
  dataFlows: DataFlow[];
  crossCuttingConcerns: CrossCuttingConcern[];
  analysisMetadata: {
    confidence: number;
    patternsFound: string[];
    analysisDepth: string;
    timestamp: string;
  };
}

export interface InteractionMatrix {
  matrix: Record<string, Record<string, InteractionType>>;
  criticalPaths: string[];
  isolatedComponents: string[];
  metadata: {
    totalInteractions: number;
    complexityScore: number;
  };
}

export interface DataFlowAnalysis {
  flows: DataFlow[];
  dataTypes: DataTypeDefinition[];
  transformations: DataTransformation[];
  bottlenecks: string[];
  metadata: {
    flowComplexity: number;
    dataConsistencyScore: number;
  };
}

export interface SeamValidationResult {
  validSeams: SeamDefinition[];
  invalidSeams: SeamValidationError[];
  recommendations: string[];
  complianceScore: number;
}

// Supporting Types
export interface ComponentInteraction {
  source: string;
  target: string;
  interactionType: InteractionType;
  frequency: "high" | "medium" | "low";
  dataExchanged?: string[];
  contractRequired: boolean;
}

export type InteractionType =
  | "synchronous"
  | "asynchronous"
  | "event-driven"
  | "data-sharing"
  | "control-flow";

export interface DataFlow {
  source: string;
  target: string;
  dataType: string;
  direction: "IN" | "OUT" | "BOTH";
  transformations?: string[];
  validationRules?: string[];
}

export interface CrossCuttingConcern {
  name: string;
  affectedComponents: string[];
  concernType:
    | "logging"
    | "security"
    | "validation"
    | "monitoring"
    | "error_handling";
  implementation: "aspect" | "mixin" | "decorator" | "service";
}

export interface DataTypeDefinition {
  name: string;
  fields: Record<string, string>;
  validationRules: string[];
  sensitivityLevel: "public" | "internal" | "confidential";
}

export interface DataTransformation {
  from: string;
  to: string;
  transformationLogic: string;
  bidirectional: boolean;
}

export interface SeamValidationError {
  seamName: string;
  errorType:
    | "missing_contract"
    | "invalid_participants"
    | "circular_dependency"
    | "data_mismatch";
  message: string;
  severity: "error" | "warning" | "info";
}

// Main Contract Interfaces
export interface IEnhancedSeamAnalyzer {
  /**
   * 🔄 REFACTOR: Enhanced requirements analysis with pattern recognition
   * PURPOSE: Analyze requirements using advanced patterns beyond keyword matching
   * DATA FLOW: Requirements text → Enhanced seam identification
   * FAILURE MODES: Invalid input, pattern recognition failures, low confidence analysis
   */
  analyzeRequirementsEnhanced(
    input: SeamAnalysisInput
  ): Promise<ContractResult<EnhancedSeamAnalysis>>;

  /**
   * 🎯 CRITICAL: Generate component interaction matrix
   * PURPOSE: Create interaction matrix showing component relationships
   * DATA FLOW: Components + Requirements → Interaction matrix with critical paths
   * FAILURE MODES: Insufficient component data, complex circular dependencies
   */
  generateInteractionMatrix(
    input: InteractionMatrixInput
  ): Promise<ContractResult<InteractionMatrix>>;

  /**
   * 💰 HIGH_ROI: Analyze data flows between components
   * PURPOSE: Identify data flows, transformations, and potential bottlenecks
   * DATA FLOW: Requirements + Components → Data flow analysis with bottleneck identification
   * FAILURE MODES: Ambiguous data descriptions, complex transformation chains
   */
  analyzeDataFlows(
    input: DataFlowAnalysisInput
  ): Promise<ContractResult<DataFlowAnalysis>>;

  /**
   * ⚡ QUICK_WIN: Validate seam readiness for implementation
   * PURPOSE: Check if identified seams are ready for contract generation
   * DATA FLOW: Seam definitions → Validation results with recommendations
   * FAILURE MODES: Incomplete seam definitions, missing participant details
   */
  validateSeamReadiness(
    input: SeamValidationInput
  ): Promise<ContractResult<SeamValidationResult>>;
}

// Pattern Recognition Types
export interface PatternMatcher {
  matchPatterns(
    text: string,
    patterns: SeamPattern[]
  ): Promise<ContractResult<PatternMatch[]>>;
}

export interface SeamPattern {
  name: string;
  keywords: string[];
  context: string[];
  componentIndicators: string[];
  confidence: number;
}

export interface PatternMatch {
  pattern: SeamPattern;
  confidence: number;
  matchedText: string[];
  suggestedComponents: string[];
}
