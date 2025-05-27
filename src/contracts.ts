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

// ================================
// 🧠 ADVANCED INTELLIGENCE CONTRACTS
// ================================

/**
 * Smart Template Processing Contracts
 */
export interface ISmartTemplateProcessor {
  selectOptimalTemplate(
    input: TemplateSelectionInput
  ): Promise<ContractResult<TemplateRecommendation>>;
  generateIntelligentContext(
    templateData: any,
    seamDefinitions: SeamDefinition[]
  ): Promise<ContractResult<TemplateContext>>;
  customizeTemplateParameters(
    template: string,
    customizations: Record<string, any>
  ): Promise<ContractResult<string>>;
}

export interface TemplateSelectionInput {
  projectType: string;
  requirements: string;
  contextData: Record<string, any>;
  existingTemplates: string[];
}

export interface TemplateRecommendation {
  recommendedTemplate: string;
  customizations: Record<string, any>;
  alternativeOptions: string[];
  confidenceScore: number;
  rationale: string;
}

export interface TemplateContext {
  intelligentContext: Record<string, any>;
  generatedHelpers: Record<string, Function>;
  semanticTags: string[];
  [key: string]: any;
}

/**
 * SDD Compliance Engine Contracts
 */
export interface ISDDComplianceValidator {
  validateSDDCompliance(
    input: SDDComplianceInput
  ): Promise<ContractResult<SDDComplianceReport>>;
  autoFixSDDViolations(
    input: SDDViolationInput
  ): Promise<ContractResult<SDDFixResult>>;
  generateActionPlan(
    violations: SDDViolation[]
  ): Promise<ContractResult<SDDActionPlan>>;
}

export interface SDDComplianceInput {
  codebase: string;
  seamDefinitions: SeamDefinition[];
  configurationFiles: string[];
}

export interface SDDComplianceReport {
  overallScore: number;
  violations: SDDViolation[];
  recommendations: string[];
  actionPlan: SDDActionPlan;
  complianceLevel: "HIGH" | "MEDIUM" | "LOW" | "CRITICAL";
}

export interface SDDViolation {
  type:
    | "CONTRACT_MISSING"
    | "SEAM_PATTERN_VIOLATION"
    | "ERROR_HANDLING_MISSING"
    | "TEST_COVERAGE_LOW";
  severity: "HIGH" | "MEDIUM" | "LOW";
  description: string;
  location: string;
  autoFixable: boolean;
  fixStrategy?: string;
}

export interface SDDViolationInput {
  violations: SDDViolation[];
  codebase: string;
  targetComplianceLevel: "HIGH" | "MEDIUM" | "LOW";
}

export interface SDDFixResult {
  fixedViolations: SDDViolation[];
  remainingViolations: SDDViolation[];
  manualActionRequired: string[];
  improvedScore: number;
}

export interface SDDActionPlan {
  immediateFixes: string[];
  shortTermTasks: string[];
  longTermGoals: string[];
  estimatedEffort: Record<string, number>;
}

/**
 * Architectural Pattern Detection Contracts
 */
export interface IPatternDetector {
  detectArchitecturalPatterns(
    input: PatternDetectionInput
  ): Promise<ContractResult<PatternAnalysis>>;
  analyzeCrossCuttingConcerns(
    input: CrossCuttingAnalysisInput
  ): Promise<ContractResult<CrossCuttingAnalysis>>;
  identifyAntiPatterns(codebase: string): Promise<ContractResult<AntiPatternAnalysis>>;
}

export interface PatternDetectionInput {
  codebase: string;
  language: string;
  framework?: string;
  analysisDepth: "SURFACE" | "DEEP" | "COMPREHENSIVE";
}

export interface PatternAnalysis {
  detectedPatterns: ArchitecturalPattern[];
  antiPatterns: AntiPattern[];
  recommendations: string[];
  patternHealth: number;
  complexityScore: number;
}

export interface ArchitecturalPattern {
  name: string;
  type: "STRUCTURAL" | "BEHAVIORAL" | "CREATIONAL";
  confidence: number;
  benefits: string[];
  implementation: string;
  relatedSeams: string[];
}

export interface AntiPattern {
  name: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  description: string;
  impact: string;
  refactoringStrategy: string;
}

export interface CrossCuttingAnalysisInput {
  codebase: string;
  components: string[];
  requirements: string;
}

export interface CrossCuttingAnalysis {
  crossCuttingConcerns: CrossCuttingConcern[];
  seamRecommendations: string[];
  implementationGuidance: string[];
  impactAnalysis: string[];
}

export interface AntiPatternAnalysis {
  antiPatterns: AntiPattern[];
  riskScore: number;
  refactoringPriority: string[];
  estimatedEffort: Record<string, number>;
}

/**
 * Machine Learning Enhancement Contracts
 */
export interface IMLSeamPredictor {
  trainSeamQualityModel(
    input: TrainingDataInput
  ): Promise<ContractResult<ModelTrainingResult>>;
  predictSeamQuality(
    input: SeamQualityPredictionInput
  ): Promise<ContractResult<SeamQualityPrediction>>;
  updateModel(
    feedback: SeamQualityFeedback[]
  ): Promise<ContractResult<ModelUpdateResult>>;
}

export interface TrainingDataInput {
  historicalData: SeamHistoryRecord[];
  qualityLabels: SeamQualityLabel[];
  validationSet: SeamHistoryRecord[];
}

export interface SeamHistoryRecord {
  seamDefinition: SeamDefinition;
  implementationMetrics: ImplementationMetrics;
  qualityScore: number;
  feedback: string[];
}

export interface SeamQualityLabel {
  seamId: string;
  qualityScore: number;
  categories: QualityCategory[];
  expertJudgment: string;
}

export interface QualityCategory {
  name: string;
  score: number;
  weight: number;
}

export interface ModelTrainingResult {
  trainedModel: any; // Model-specific type
  performance: ModelPerformance;
  featureImportance: Record<string, number>;
  recommendedThresholds: Record<string, number>;
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  validationError: number;
}

export interface SeamQualityPredictionInput {
  seamDefinitions: SeamDefinition[];
  contextData: Record<string, any>;
  requirementAnalysis: EnhancedSeamAnalysis;
}

export interface SeamQualityPrediction {
  qualityScores: Record<string, number>;
  confidence: Record<string, number>;
  riskFactors: string[];
  recommendations: string[];
  improvementSuggestions: string[];
}

export interface SeamQualityFeedback {
  seamId: string;
  actualQuality: number;
  predictionAccuracy: number;
  contextFactors: string[];
  corrections: string[];
}

export interface ModelUpdateResult {
  improvedAccuracy: number;
  newFeatures: string[];
  updatedThresholds: Record<string, number>;
  retrainingRequired: boolean;
}

export interface ImplementationMetrics {
  codeComplexity: number;
  testCoverage: number;
  performanceScore: number;
  maintainabilityIndex: number;
  defectRate: number;
}

/**
 * Advanced Analysis Supporting Types
 */
export interface ComponentCandidate {
  name: string;
  type: "AGENT" | "SERVICE" | "DATA_STORE" | "INTERFACE" | "UTILITY";
  confidence: number;
  attributes: string[];
  relationships: string[];
  responsibilities: string[];
}

export interface BoundaryAnalysis {
  componentBoundaries: ComponentBoundary[];
  dataFlowBoundaries: DataFlowBoundary[];
  responsibilityBoundaries: ResponsibilityBoundary[];
  integrationPoints: IntegrationPoint[];
}

export interface ComponentBoundary {
  componentName: string;
  inputBoundary: string[];
  outputBoundary: string[];
  internalOperations: string[];
  externalDependencies: string[];
}

export interface DataFlowBoundary {
  source: string;
  destination: string;
  dataType: string;
  transformationType:
    | "NONE"
    | "FORMAT"
    | "STRUCTURE"
    | "VALIDATION"
    | "ENRICHMENT";
  boundaryConditions: string[];
}

export interface ResponsibilityBoundary {
  componentName: string;
  primaryResponsibilities: string[];
  secondaryResponsibilities: string[];
  prohibitedOperations: string[];
  collaborationRequirements: string[];
}

export interface IntegrationPoint {
  name: string;
  type: "API" | "EVENT" | "DATABASE" | "FILE_SYSTEM" | "NETWORK";
  protocol: string;
  securityRequirements: string[];
  performanceRequirements: string[];
}

export interface PatternMatch {
  patternName: string;
  confidence: number;
  evidence: string[];
  components: string[];
  seamImplications: string[];
  implementationNotes: string[];
}
