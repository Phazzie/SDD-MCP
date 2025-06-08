/**
 * SDD MCP Server - Core Contracts
 * Generated using SDD methodology for the MCP server itself
 */

import { z } from "zod";

// Blueprint: Core SDD result pattern with type safety
export type ContractResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
};

// === GEMINI INTEGRATION: Additional Error Classes ===
// Blueprint: Base error class for SDD specific errors
export class SDDError extends Error {
  public readonly context?: Record<string, any>;
  public readonly errorCode?: string;

  constructor(
    message: string,
    errorCode?: string,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.context = context;
  }
}

export class NotImplementedError extends SDDError {
  constructor(
    methodName: string,
    blueprintDetails: string = "Not yet implemented."
  ) {
    super(
      `Method ${methodName} is not implemented. Blueprint: ${blueprintDetails}`,
      "ERR_NOT_IMPLEMENTED"
    );
  }
}

export class InvalidInputError extends SDDError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, "ERR_INVALID_INPUT", context);
  }
}

export class ToolNotFoundError extends SDDError {
  constructor(toolName: string, version?: string) {
    const message = version
      ? `Tool '${toolName}' version '${version}' not found.`
      : `Tool '${toolName}' not found.`;
    super(message, "ERR_TOOL_NOT_FOUND", { toolName, version });
  }
}

export class ToolVersionNotFoundError extends SDDError {
  constructor(toolName: string, version: string) {
    super(
      `Tool '${toolName}' version '${version}' not found.`,
      "ERR_TOOL_VERSION_NOT_FOUND",
      { toolName, version }
    );
  }
}

export class ToolRegistrationError extends SDDError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, "ERR_TOOL_REGISTRATION", context);
  }
}

// === GEMINI INTEGRATION: Tool Registry Type Definitions ===

/**
 * @interface ToolDefinition
 * @description Defines the static properties and schema of a tool.
 * This information is used for discovery, documentation, and UI generation.
 */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
}

// Blueprint: Tool Module Contract - Defines the interface for all tool modules.
export interface ToolModuleContract {
  definition: ToolDefinition;
  handler: (args: any) => Promise<ContractResult<any>>;
  metadata: {
    name: string;
    version: string;
    dependencies?: string[];
    author?: string;
    tags?: string[];
  };
}

/**
 * Optional configuration for tool execution, allowing for features like A/B testing or version pinning.
 */
export interface ToolExecutionConfig {
  /** Specific version of the tool to execute. If not provided, registry decides (e.g., latest stable). */
  version?: string;
  /** Flags or context for A/B testing or feature flagging within the tool or registry. */
  abTestContext?: Record<string, any>;
  /** Timeout for the tool execution in milliseconds. */
  timeoutMs?: number;
}

// Minimal interface for the ErrorHandler dependency (as per prompt context)
export interface ErrorHandler {
  logError(error: any, context?: Record<string, any>): Promise<void>;
}

// Placeholder for actual ErrorHandler instance (as per prompt context)
// This would typically be injected or managed by a dependency injection system
export const errorHandler: ErrorHandler = {
  async logError(error: any, context?: Record<string, any>): Promise<void> {
    console.error("ErrorHandler Log:", error, context);
    // TODO: Integrate with actual ErrorHandler foundation component
  },
};

/**
 * @interface ToolRegistryContract
 * @description Defines the contract for managing tool modules within the MCP server.
 * All methods must be asynchronous and return a ContractResult.
 */
export interface ToolRegistryContract {
  /**
   * Registers a new tool module with the registry.
   * @param module The tool module to register.
   * @returns A ContractResult indicating success (void) or failure.
   * Blueprint: Implementation should handle versioning (e.g., allow multiple versions of a tool,
   * prevent duplicate registration of the same version).
   * Input validation: Ensure the provided module conforms to ToolModuleContract.
   */
  registerTool(module: ToolModuleContract): Promise<ContractResult<void>>;

  /**
   * Retrieves a list of definitions for all registered tools.
   * @returns A Promise resolving to a ContractResult containing an array of ToolDefinition objects.
   * Blueprint: This allows clients to discover available tools and their capabilities.
   * Could support filtering or pagination in future enhancements.
   */
  getTools(): Promise<ContractResult<ToolDefinition[]>>;

  /**
   * Executes a registered tool by its name.
   * @param name The unique name of the tool to execute (must match ToolModuleContract.metadata.name).
   * @param args The arguments to pass to the tool's handler.
   * @param config Optional configuration for this specific execution (e.g., version, A/B testing flags).
   * @returns A Promise resolving to a ContractResult containing the tool's output or an error.
   * Blueprint: Implementation will locate the appropriate tool (and version, if specified or determined by A/B logic),
   * validate args against the tool's inputSchema (or delegate to the tool), and invoke its handler.
   * Must handle cases where the tool is not found or the specified version is unavailable.
   */
  executeTool(
    name: string,
    args: any,
    config?: ToolExecutionConfig
  ): Promise<ContractResult<any>>;

  /**
   * Unregisters a tool module or a specific version of a tool module.
   * @param name The name of the tool to unregister.
   * @param version Optional. If provided, unregisters only this specific version. Otherwise, unregisters all versions.
   * @returns A Promise resolving to a ContractResult indicating success (void) or failure.
   * Blueprint: Important for dynamic environments or when tools are deprecated.
   */
  unregisterTool?(
    name: string,
    version?: string
  ): Promise<ContractResult<void>>;

  /**
   * Retrieves a specific tool module (or its definition).
   * @param name The name of the tool.
   * @param version Optional. The specific version to retrieve.
   * @returns A Promise resolving to a ContractResult containing the ToolModuleContract or ToolDefinition.
   * Blueprint: Useful for introspection or advanced scenarios.
   */
  getTool?(
    name: string,
    version?: string
  ): Promise<ContractResult<ToolModuleContract | ToolDefinition>>;
}

// ================================
// Tool Registry Contracts (SDD Modular Architecture)
// Generated from Gemini's Phase 1 Analysis
// ================================

/**
 * Base error class for SDD specific errors.
 * Implementations should throw specific errors inheriting from this or a similar base.
 */
export class SDDErrorClass extends Error {
  public readonly context?: Record<string, any>;
  public readonly errorCode?: string;

  constructor(
    message: string,
    errorCode?: string,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.context = context;
  }
}

export class InvalidInputError extends SDDErrorClass {
  constructor(message: string, context?: Record<string, any>) {
    super(message, "ERR_INVALID_INPUT", context);
  }
}

/**
 * @class ToolNotFoundError
 * @description Thrown when a requested tool is not found in the registry
 */
export class ToolNotFoundError extends SDDErrorClass {
  constructor(toolName: string, version?: string) {
    const message = version
      ? `Tool '${toolName}' version '${version}' not found.`
      : `Tool '${toolName}' not found.`;
    super(message, "ERR_TOOL_NOT_FOUND", { toolName, version });
  }
}

/**
 * @class ToolVersionNotFoundError
 * @description Thrown when a specific version of a tool is not found
 */
export class ToolVersionNotFoundError extends SDDErrorClass {
  constructor(toolName: string, version: string) {
    super(
      `Tool '${toolName}' version '${version}' not found.`,
      "ERR_TOOL_VERSION_NOT_FOUND",
      { toolName, version }
    );
  }
}

/**
 * @class ToolRegistrationError
 * @description Thrown when tool registration fails
 */
export class ToolRegistrationError extends SDDErrorClass {
  constructor(message: string, context?: Record<string, any>) {
    super(message, "ERR_TOOL_REGISTRATION", context);
  }
}

/**
 * @interface ToolModuleContract
 * @description Blueprint: Contract for all tool modules in the SDD-compliant modular architecture.
 * Each tool must implement this interface to be compatible with the ToolRegistry.
 */
export interface ToolModuleContract {
  definition: ToolDefinition;
  handler: (args: any) => Promise<ContractResult<any>>;
  metadata: {
    name: string;
    version: string;
    dependencies?: string[];
    author?: string;
    tags?: string[];
  };
}

/**
 * @interface ToolRegistryContract
 * @description Blueprint: Contract for the tool registry system that manages tool registration,
 * discovery, and execution in a modular, version-aware manner with A/B testing support.
 */
export interface ToolRegistryContract {
  registerTool(module: ToolModuleContract): Promise<ContractResult<void>>;
  getTools(): Promise<ContractResult<ToolDefinition[]>>;
  executeTool(
    name: string,
    args: any,
    config?: ToolExecutionConfig
  ): Promise<ContractResult<any>>;
  unregisterTool?(
    name: string,
    version?: string
  ): Promise<ContractResult<void>>;
  getTool?(
    name: string,
    version?: string
  ): Promise<ContractResult<ToolModuleContract | ToolDefinition>>;
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

// ================================
// MISSING TYPE DEFINITIONS
// Blueprint: Core types for Enhanced Seam Analysis
// ================================

export interface ComponentInteraction {
  from: string;
  to: string;
  interactionType: InteractionType;
  dataExchanged?: string[];
  frequency?: "high" | "medium" | "low";
  criticality?: "critical" | "important" | "optional";
}

export type InteractionType =
  | "api_call"
  | "event_emission"
  | "data_sharing"
  | "dependency"
  | "inheritance"
  | "composition"
  | "aggregation";

export interface DataFlow {
  source: string;
  target: string;
  dataType: string;
  transformations?: string[];
  direction: "IN" | "OUT" | "BOTH";
  volume?: "high" | "medium" | "low";
}

export interface CrossCuttingConcern {
  name: string;
  type:
    | "logging"
    | "security"
    | "validation"
    | "caching"
    | "monitoring"
    | "error_handling";
  affectedComponents: string[];
  implementation?: string;
  priority?: "high" | "medium" | "low";
}

export interface DataTypeDefinition {
  name: string;
  structure: Record<string, any>;
  validation?: string[];
  constraints?: string[];
}

export interface DataTransformation {
  name: string;
  input: string;
  output: string;
  logic: string;
  complexity?: "simple" | "moderate" | "complex";
}

export interface SeamValidationError {
  seamName: string;
  errorType: "syntax" | "semantic" | "architectural" | "missing_dependency";
  message: string;
  suggestions: string[];
  severity: "error" | "warning" | "info";
}

// Additional types for Rich Analysis (Gemini Integration)
export interface DataSource {
  name: string;
  type: "database" | "api" | "file" | "stream" | "cache";
  location: string;
  accessPattern?: "read" | "write" | "read_write";
  reliability?: "high" | "medium" | "low";
}

export interface TransformationChain {
  id: string;
  steps: DataTransformation[];
  inputSource: string;
  outputTarget: string;
  complexity: "simple" | "moderate" | "complex";
}

export interface IdentifiedBottleneck {
  location: string;
  type: "cpu" | "memory" | "io" | "network" | "database";
  severity: "critical" | "major" | "minor";
  estimatedImpact: string;
  suggestedFixes: string[];
}

export interface OptimizationOpportunity {
  area: string;
  type: "performance" | "resource" | "architecture" | "code_quality";
  description: string;
  potentialGains: string;
  implementationEffort: "low" | "medium" | "high";
  priority: "high" | "medium" | "low";
}

export interface DataGovernanceRisk {
  riskType: "privacy" | "security" | "compliance" | "data_quality";
  description: string;
  affectedData: string[];
  severity: "critical" | "high" | "medium" | "low";
  mitigationSteps: string[];
  complianceImpact?: string;
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
  potentialBottlenecks?: string[]; // Added for test compatibility
  dataConsistencyScore?: number; // Added for test compatibility
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

// ================================
// Enhanced AI Analysis Types (Gemini Integration)
// ================================

// Rich output types for enhanced analysis capabilities
export interface RichDataFlowAnalysis {
  flows: DataFlow[];
  sources: DataSource[];
  transformationChains: TransformationChain[];
  identifiedBottlenecks: IdentifiedBottleneck[];
  optimizationOpportunities: OptimizationOpportunity[];
  dataGovernanceRisks: DataGovernanceRisk[];
  metadata: {
    flowComplexity: number;
    dataConsistencyScore: number;
    performanceRating: "high" | "medium" | "low";
    securityRating: "high" | "medium" | "low";
    analysisDepth: string;
    timestamp: string;
  };
}

export interface RichSeamValidationResult {
  validatedSeams: SeamDefinition[];
  complianceIssues: ComplianceReport;
  healthIssues: HealthReport;
  patternIssues: PatternReport;
  metadata: {
    analysisDepth: string;
    timestamp: string;
  };
}

// Blueprint: Utility class for development and logging, used by EnhancedSeamAnalyzerStub
export class DevUtilities {
  private agentId: AgentId;
  constructor(agentId: AgentId) {
    this.agentId = agentId;
    // In a real implementation, this might initialize a logger instance
  }

  logMessage(sourceAgentId: AgentId, message: string, context?: any): void {
    console.log(
      `[${new Date().toISOString()}] [${sourceAgentId}] INFO: ${message}`,
      context || ""
    );
  }

  logError(
    sourceAgentId: AgentId,
    message: string,
    error?: any,
    context?: any
  ): void {
    console.error(
      `[\${new Date().toISOString()}] [\${sourceAgentId}] ERROR: \${message}`,
      error || "",
      context || ""
    );
  }

  logAIDiagnostic(
    sourceAgentId: AgentId,
    message: string,
    diagnosticInfo: any
  ): void {
    console.log(
      `[\${new Date().toISOString()}] [\${sourceAgentId}] AI_DIAGNOSTIC: \${message}`,
      diagnosticInfo
    );
  }

  // Placeholder for performance tracking start
  startPerformanceTimer(operationName: string): { end: () => void } {
    const startTime = Date.now();
    // console.log(\`[\${this.agentId}] PERF_START: \${operationName}\`);
    return {
      end: () => {
        const duration = Date.now() - startTime;
        // console.log(\`[\${this.agentId}] PERF_END: \${operationName} - Duration: \${duration}ms\`);
      },
    };
  }
}

// Blueprint: Type for confidence scoring in analysis results
export type ConfidenceScore = {
  score: number; // Typically 0.0 to 1.0, or 0-100
  details: string; // Explanation or factors contributing to the score
  // Example: { score: 0.85, details: "High confidence based on direct keyword matches and structural analysis." }
};

// Blueprint: Type for identified patterns in analysis results
export type PatternMatch = {
  name: string; // Name of the identified pattern (e.g., "Singleton", "Factory", "CQRS-QuerySide")
  description?: string; // Brief description of the pattern
  confidence?: number; // Confidence in this pattern match (0.0 to 1.0)
  // Example: { name: "EventSourcing", description: "Component appears to use event sourcing.", confidence: 0.7 }
};

// ================================
// 🔗 SEAM INTEGRATION CONTRACTS
// PURPOSE: Define contracts for integrating development utilities with Enhanced Seam Analyzer
// SEAM: EnhancedSeamAnalyzer ↔ DevUtilities ↔ PerformanceTracker
// ================================

// Integration contract for Enhanced Seam Analyzer with utilities
export interface EnhancedSeamAnalyzerIntegrationContract {
  analyzeSeamsWithTracking(
    input: SeamAnalysisInput
  ): Promise<ContractResult<EnhancedSeamAnalysis>>;
  validateSeamReadinessWithTracking(
    input: SeamValidationInput
  ): Promise<ContractResult<SeamValidationResult>>;
  generateInteractionMatrixWithTracking(
    input: InteractionMatrixInput
  ): Promise<ContractResult<InteractionMatrix>>;

  // Utility integration methods
  enablePerformanceTracking(enabled: boolean): Promise<ContractResult<boolean>>;
  enableDebugLogging(enabled: boolean): Promise<ContractResult<boolean>>;
  getOperationMetrics(): Promise<ContractResult<PerformanceMetrics>>;
  getDebugReport(): Promise<ContractResult<DebugReport>>;
}

// Performance metrics for seam operations
export interface PerformanceMetrics {
  totalOperations: number;
  averageExecutionTime: number;
  slowestOperation: {
    operation: string;
    duration: number;
    input?: any;
  };
  fastestOperation: {
    operation: string;
    duration: number;
  };
  operationBreakdown: Array<{
    operation: string;
    count: number;
    totalTime: number;
    averageTime: number;
  }>;
  recommendations: string[];
}

// Debug report for seam analyzer operations
export interface DebugReport {
  timestamp: string;
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  recentErrors: Array<{
    timestamp: string;
    operation: string;
    error: string;
    input?: any;
  }>;
  performanceInsights: string[];
  systemHealth: "healthy" | "warning" | "critical";
  recommendations: string[];
}

// ================================
// Enhanced Seam Analyzer Contract
// ================================

export interface IEnhancedSeamAnalyzer {
  /**
   * 🔄 REFACTOR: Enhanced requirements analysis with pattern recognition
   * Blueprint: TODO - Replace keyword matching with NLP/AI analysis
   */
  analyzeRequirementsEnhanced(
    input: SeamAnalysisInput
  ): Promise<ContractResult<EnhancedSeamAnalysis>>;

  /**
   * 🎯 CRITICAL: Generate component interaction matrix
   * Blueprint: TODO - Build interaction graph with critical path analysis
   */
  generateInteractionMatrix(
    input: InteractionMatrixInput
  ): Promise<ContractResult<InteractionMatrix>>;

  /**
   * 💰 HIGH_ROI: Analyze data flows between components
   * Blueprint: TODO - Implement data flow tracing with transformation analysis
   */
  analyzeDataFlows(
    input: DataFlowAnalysisInput
  ): Promise<ContractResult<DataFlowAnalysis>>;

  /**
   * ⚡ QUICK_WIN: Validate seam readiness for implementation
   * Blueprint: TODO - Implement seam validation rules
   */
  validateSeamReadiness(
    input: SeamValidationInput
  ): Promise<ContractResult<SeamValidationResult>>;
}

// ADDED: Define and export AnalysisDepth from schema enum values
const analysisDepthEnumValues = ["basic", "detailed", "comprehensive"] as const;
export const AnalysisDepthEnum = z.enum(analysisDepthEnumValues);
export type AnalysisDepth = z.infer<typeof AnalysisDepthEnum>;

// ADDED: Define and export FocusArea from schema enum values
const focusAreaEnumValues = [
  "data_flows",
  "integrations",
  "dependencies",
  "cross_cutting_concerns",
] as const;
export const FocusAreaEnum = z.enum(focusAreaEnumValues);
export type FocusArea = z.infer<typeof FocusAreaEnum>;

// ADDED: DesignConcernSchema and DesignConcern type
export const DesignConcernSchema = z.object({
  id: z.string().uuid().describe("Unique identifier for the design concern"),
  description: z
    .string()
    .min(10)
    .describe("Detailed description of the concern"),
  severity: z
    .enum(["low", "medium", "high", "critical"])
    .describe("Severity level of the concern"),
  category: z
    .string()
    .min(3)
    .describe(
      "Category of the concern (e.g., Performance, Security, Maintainability)"
    ),
  recommendations: z
    .array(z.string())
    .optional()
    .describe("Suggested actions to address the concern"),
  relatedFiles: z
    .array(z.string())
    .optional()
    .describe("Files related to this concern"),
  status: z
    .enum(["open", "addressed", "deferred"])
    .default("open")
    .describe("Current status of the concern"),
  // Added from IEnhancedSeamAnalyzer.detectDesignConcerns which returns DesignConcern[]
  // This type might need more fields based on actual usage.
});
export type DesignConcern = z.infer<typeof DesignConcernSchema>;

// ADDED: Basic DataFlowAnalysisReport structure (as returned by IEnhancedSeamAnalyzer.analyzeDataFlows)
// Define the DataFlowDetailSchema first
export const DataFlowDetailSchema = z.object({
  source: z.string(),
  target: z.string(),
  dataType: z.string(),
  description: z.string().optional(),
});
export type DataFlowDetail = z.infer<typeof DataFlowDetailSchema>;

export const DataFlowAnalysisReportSchema = z.object({
  reportId: z.string().uuid(),
  analyzedAt: z.string().datetime(),
  summary: z.string(),
  details: z.array(DataFlowDetailSchema),
  potentialBottlenecks: z
    .array(
      z.object({
        flowName: z.string(),
        description: z.string(),
        severity: AnalysisDepthEnum, // Re-using for simplicity, could be specific enum
      })
    )
    .optional(),
});
export type DataFlowAnalysisReport = z.infer<
  typeof DataFlowAnalysisReportSchema
>;

// ADDED: Basic SeamReadinessReport structure (as returned by IEnhancedSeamAnalyzer.validateSeamReadiness)
export const SeamReadinessIssueSchema = z.object({
  code: z.string(),
  message: z.string(),
  severity: z.enum(["info", "warning", "error"]),
  filePath: z.string().optional(),
  lineNumber: z.number().optional(),
});
export const SeamReadinessReportSchema = z.object({
  reportId: z.string().uuid(),
  validatedAt: z.string().datetime(),
  overallStatus: z.enum(["ready", "issues_found", "incomplete", "error"]),
  seamReports: z.array(
    z.object({
      seamName: z.string(),
      isReady: z.boolean(),
      issues: z.array(SeamReadinessIssueSchema),
      suggestions: z.array(z.string()).optional(),
      confidenceScore: z.number().min(0).max(1).optional(),
    })
  ),
  summaryMessage: z.string().optional(),
});
export type SeamReadinessReport = z.infer<typeof SeamReadinessReportSchema>;

// MODIFIED: EnhancedSeamAnalysisSchema to use new enums and DesignConcernSchema
// This is an example, locate the actual EnhancedSeamAnalysisSchema definition and modify it.
// If it's not found, this is a placeholder for where it should be updated
/*
export const EnhancedSeamAnalysisSchema = z.object({
  requirementsText: z.string(),
  analysisDepth: AnalysisDepthEnum.optional(), // MODIFIED
  designNotes: z.string().optional(),
  focusAreas: z.array(FocusAreaEnum).optional(), // MODIFIED
  identifiedSeams: z.array(SeamDefinitionSchema).optional(),
  componentCandidates: z.array(ComponentCandidateSchema).optional(), // Ensure ComponentCandidateSchema is defined
  designConcerns: z.array(DesignConcernSchema).optional(), // MODIFIED
  interactionMatrix: z.record(z.array(z.string())).optional(),
  // dataFlowAnalysis: z.array(DataFlowDetailSchema).optional(), // Or DataFlowAnalysisReportSchema.optional()
});
export type EnhancedSeamAnalysis = z.infer<typeof EnhancedSeamAnalysisSchema>;
*/
// Ensure the actual EnhancedSeamAnalysisSchema is updated like this:
// Locate 'export const EnhancedSeamAnalysisSchema = z.object({'
// In its definition, change:
// analysisDepth: z.enum(['basic', 'detailed', 'comprehensive']).optional(), -> analysisDepth: AnalysisDepthEnum.optional(),
// focusAreas: z.array(z.enum(['data_flows', ...])).optional(), -> focusAreas: z.array(FocusAreaEnum).optional(),
// designConcerns: z.array(SomeOldDesignConcernSchema).optional(), -> designConcerns: z.array(DesignConcernSchema).optional(),

// MODIFIED: IEnhancedSeamAnalyzer interface signatures
// Locate 'export interface IEnhancedSeamAnalyzer {'
// In its definition, change:
// identifySeams(text: string, depth: string): Promise<ContractResult<SeamDefinition[]>>;
// -> identifySeams(text: string, depth: AnalysisDepth): Promise<ContractResult<SeamDefinition[]>>;
//
// detectDesignConcerns(text: string, focusAreas?: string[]): Promise<ContractResult<DesignConcern[]>>;
// -> detectDesignConcerns(text: string, focusAreas?: FocusArea[]): Promise<ContractResult<DesignConcern[]>>;

// Ensure ComponentCandidateSchema is defined if used by EnhancedSeamAnalysisSchema
// Example if not present (based on ComponentCandidate interface):
/*
export const PotentialInteractionSchema = z.object({ // If ComponentCandidate uses PotentialInteraction
  sourceComponent: z.string(),
  targetComponent: z.string(),
  interactionType: z.enum(["sync", "async", "event", "data"]),
  confidence: z.number(),
  reasoning: z.string(),
  dataExchanged: z.array(z.string()),
  frequency: z.enum(["high", "medium", "low"]),
  patternDetected: z.string().optional(),
});
export const ComponentCandidateSchema = z.object({
  name: z.string(),
  purpose: z.string().optional(),
  type: z.union([z.enum(["ui", "service", "integration", "data", "utility"]), z.string()]),
  interactions: z.array(PotentialInteractionSchema).optional(),
  confidenceScore: z.number(),
  extractedFrom: z.array(z.string()),
  relatedRequirements: z.array(z.number()).optional(),
  suggestedInterfaces: z.array(z.string()).optional(),
  estimatedComplexity: z.union([z.enum(["low", "medium", "high"]), z.string()]).optional(),
});
*/
