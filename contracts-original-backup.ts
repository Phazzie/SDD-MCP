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

// === CORE SDD MCP SERVER TYPE DEFINITIONS ===
// Blueprint: Complete type system for SDD MCP server - all seams must have contracts

// === FOUNDATIONAL TYPES ===
export type AgentId = 
  | "MCPHandler"
  | "ToolRegistry" 
  | "SDDAnalyzer"
  | "TemplateProcessor"
  | "ValidationEngine"
  | "ErrorHandler"
  | "ConfigManager"
  | "SeamManager"
  | string; // Allow custom agent IDs

// === SEAM DEFINITION TYPES ===
export const SeamDefinitionSchema = z.object({
  name: z.string().describe("Unique seam identifier"),
  purpose: z.string().describe("What this seam accomplishes"),
  participants: z.array(z.string()).describe("Components that participate in this seam"),
  dataFlow: z.enum(["IN", "OUT", "BOTH"]).describe("Direction of data flow"),
  inputType: z.string().optional().describe("Input data type"),
  outputType: z.string().optional().describe("Output data type"),
  errorScenarios: z.array(z.string()).optional().describe("Known error conditions"),
  dependencies: z.array(z.string()).optional().describe("Other seams this depends on"),
});

export type SeamDefinition = z.infer<typeof SeamDefinitionSchema>;

// === ERROR HANDLING TYPES ===
export const ErrorContextSchema = z.object({
  seamName: z.string(),
  sourceAgent: z.string(), 
  targetAgent: z.string(),
  operation: z.string(),
  timestamp: z.string(),
  requestId: z.string().optional(),
  stackTrace: z.string().optional(),
  additionalData: z.record(z.any()).optional(),
});

export type ErrorContext = z.infer<typeof ErrorContextSchema>;

// === CONFIGURATION TYPES ===
export const ServerConfigSchema = z.object({
  port: z.number().default(3000),
  host: z.string().default("localhost"),
  logLevel: z.enum(["debug", "info", "warn", "error"]).default("info"),
  maxConcurrentRequests: z.number().default(10),
  tools: z.object({
    enabled: z.array(z.string()).default([]),
    disabled: z.array(z.string()).default([]),
    timeout: z.number().default(30000),
  }),
  validation: z.object({
    strict: z.boolean().default(true),
    failFast: z.boolean().default(true),
  }),
});

export type ServerConfig = z.infer<typeof ServerConfigSchema>;

// === HEALTH AND DIAGNOSTICS ===
export const ServerHealthSchema = z.object({
  status: z.enum(["healthy", "degraded", "unhealthy"]),
  uptime: z.number(),
  version: z.string(),
  activeConnections: z.number(),
  toolsStatus: z.record(z.enum(["operational", "degraded", "failed"])),
  memoryUsage: z.object({
    used: z.number(),
    total: z.number(),
    percentage: z.number(),
  }),
  lastHealthCheck: z.string(),
});

export type ServerHealth = z.infer<typeof ServerHealthSchema>;

export const DiagnosticInfoSchema = z.object({
  serverHealth: ServerHealthSchema,
  seamConnections: z.array(z.object({
    seamName: z.string(),
    status: z.enum(["connected", "disconnected", "error"]),
    lastCommunication: z.string(),
    errorCount: z.number(),
  })),
  toolRegistry: z.object({
    registeredTools: z.number(),
    activeTools: z.number(),
    failedTools: z.array(z.string()),
  }),
  recentErrors: z.array(ErrorContextSchema),
});

export type DiagnosticInfo = z.infer<typeof DiagnosticInfoSchema>;

// === VALIDATION AND COMPLIANCE TYPES ===
export const ComplianceIssueSchema = z.object({
  rule: z.string(),
  severity: z.enum(["error", "warning", "info"]),
  message: z.string(),
  filePath: z.string().optional(),
  lineNumber: z.number().optional(),
  suggestion: z.string().optional(),
});

export const ComplianceReportSchema = z.object({
  overallScore: z.number().min(0).max(100),
  totalIssues: z.number(),
  errorCount: z.number(),
  warningCount: z.number(),
  infoCount: z.number(),
  issues: z.array(ComplianceIssueSchema),
  checkedRules: z.array(z.string()),
  summary: z.string(),
});

export type ComplianceReport = z.infer<typeof ComplianceReportSchema>;

export const HealthReportSchema = z.object({
  systemHealth: z.enum(["healthy", "degraded", "critical"]),
  componentStatus: z.record(z.enum(["operational", "degraded", "failed"])),
  issues: z.array(z.object({
    component: z.string(),
    issue: z.string(),
    severity: z.enum(["low", "medium", "high", "critical"]),
    recommendation: z.string(),
  })),
  performanceMetrics: z.object({
    responseTime: z.number(),
    throughput: z.number(),
    errorRate: z.number(),
  }),
});

export type HealthReport = z.infer<typeof HealthReportSchema>;

export const PatternReportSchema = z.object({
  detectedPatterns: z.array(z.object({
    patternName: z.string(),
    occurrences: z.number(),
    compliance: z.enum(["compliant", "partial", "non-compliant"]),
    recommendations: z.array(z.string()),
  })),
  missingPatterns: z.array(z.object({
    patternName: z.string(),
    importance: z.enum(["required", "recommended", "optional"]),
    suggestion: z.string(),
  })),
  antiPatterns: z.array(z.object({
    patternName: z.string(),
    severity: z.enum(["low", "medium", "high"]),
    locations: z.array(z.string()),
    remedy: z.string(),
  })),
});

export type PatternReport = z.infer<typeof PatternReportSchema>;

// === TEMPLATE PROCESSING TYPES ===
export const TemplateDataSchema = z.object({
  templateName: z.string(),
  variables: z.record(z.any()),
  metadata: z.object({
    generatedAt: z.string(),
    templateVersion: z.string(),
    targetFormat: z.string(),
  }),
  context: z.object({
    projectName: z.string().optional(),
    namespace: z.string().optional(),
    outputPath: z.string().optional(),
  }).optional(),
});

export type TemplateData = z.infer<typeof TemplateDataSchema>;

// === CONTRACT GENERATION TYPES ===
export const ContractGenerationResultSchema = z.object({
  contractCode: z.string(),
  contractPath: z.string(),
  interfaceName: z.string(),
  methodCount: z.number(),
  dependencyImports: z.array(z.string()),
  metadata: z.object({
    generatedAt: z.string(),
    templateUsed: z.string(),
    complianceScore: z.number(),
  }),
});

export type ContractGenerationResult = z.infer<typeof ContractGenerationResultSchema>;

// === STUB GENERATION TYPES ===
export const StubGenerationResultSchema = z.object({
  stubCode: z.string(),
  stubPath: z.string(),
  className: z.string(),
  implementedMethods: z.number(),
  blueprintComments: z.number(),
  metadata: z.object({
    generatedAt: z.string(),
    contractSource: z.string(),
    estimatedEffort: z.string(),
  }),
});

export type StubGenerationResult = z.infer<typeof StubGenerationResultSchema>;

// === PROJECT STRUCTURE TYPES ===
export const ProjectStructureSchema = z.object({
  rootPath: z.string(),
  contracts: z.array(z.string()),
  stubs: z.array(z.string()),
  tests: z.array(z.string()),
  documentation: z.array(z.string()),
  configuration: z.record(z.any()),
  dependencies: z.array(z.string()),
  structure: z.record(z.any()).optional(),
});

export type ProjectStructure = z.infer<typeof ProjectStructureSchema>;

// === COMPOSITE VALIDATION REPORT ===
export type ValidationReport = ComplianceReport & HealthReport & PatternReport;
//# sourceMappingURL=coreContracts.d.ts.map
