# GEMINI PROVIDED CODE - READY FOR IMPLEMENTATION

This file contains the code provided by Gemini that is ready to be applied to the SDD MCP Server project.

## 🔗 SOURCE

This code was provided by Gemini in response to the contract inconsistency analysis and questions about the Enhanced Seam Analyzer implementation.

## 📋 CODE TO BE APPLIED

### 1. CONTRACTS.TS - Complete Enhanced Contract Structure

```typescript
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
  // Enhanced error guidance
  suggestions?: string[];
  context?: Record<string, any>;
  severity?: "low" | "medium" | "high" | "critical";
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

// Blueprint: Enhanced error creation with actionable suggestions
export function createDetailedError(
  agentId: string,
  category: SDDError["category"],
  message: string,
  suggestions: string[],
  context?: Record<string, any>,
  details?: Record<string, any>,
  seamName?: string,
  severity: "low" | "medium" | "high" | "critical" = "medium"
): SDDError {
  return {
    category,
    message,
    suggestions,
    context,
    details,
    agentId,
    seamName,
    severity,
    timestamp: new Date().toISOString(),
  };
}

// Blueprint: Validation error with specific guidance
export function createValidationError(
  agentId: string,
  fieldName: string,
  expectedType: string,
  actualValue: any,
  seamName?: string
): SDDError {
  const suggestions = [
    `Ensure '${fieldName}' is of type '${expectedType}'`,
    `Check the input data structure before calling this seam`,
    `Refer to the contract interface for expected data format`,
  ];

  // Add specific suggestions based on common validation issues
  if (actualValue === null || actualValue === undefined) {
    suggestions.unshift(
      `Provide a valid value for '${fieldName}' - it cannot be null or undefined`
    );
  } else if (expectedType === "string" && typeof actualValue !== "string") {
    suggestions.unshift(
      `Convert '${fieldName}' to a string before passing to this seam`
    );
  } else if (expectedType === "array" && !Array.isArray(actualValue)) {
    suggestions.unshift(
      `'${fieldName}' should be an array, got ${typeof actualValue}`
    );
  }

  return createDetailedError(
    agentId,
    "ValidationError",
    `Validation failed for field '${fieldName}': expected ${expectedType}, got ${typeof actualValue}`,
    suggestions,
    {
      field: fieldName,
      expectedType,
      actualType: typeof actualValue,
      actualValue: actualValue?.toString?.() || String(actualValue),
    },
    {
      inputValidation: {
        field: fieldName,
        expectedType,
        actualValue,
        validationRule: `must be of type ${expectedType}`,
      },
    },
    seamName,
    "high"
  );
}

// Blueprint: Business rule violation with recovery guidance
export function createBusinessRuleError(
  agentId: string,
  ruleName: string,
  ruleDescription: string,
  currentValue: any,
  seamName?: string
): SDDError {
  const suggestions = [
    `Review the business rule: ${ruleDescription}`,
    `Adjust the input to comply with ${ruleName}`,
    `Contact the system administrator if this rule seems incorrect`,
  ];

  return createDetailedError(
    agentId,
    "BusinessRuleViolation",
    `Business rule violation: ${ruleName}`,
    suggestions,
    {
      ruleName,
      ruleDescription,
      currentValue,
      complianceCheck: "failed",
    },
    {
      businessRule: {
        name: ruleName,
        description: ruleDescription,
        violatedBy: currentValue,
      },
    },
    seamName,
    "high"
  );
}

// Blueprint: Dependency error with troubleshooting steps
export function createDependencyError(
  agentId: string,
  dependencyName: string,
  issue: string,
  seamName?: string
): SDDError {
  const suggestions = [
    `Check if ${dependencyName} is properly initialized`,
    `Verify network connectivity if ${dependencyName} is external`,
    `Review configuration for ${dependencyName} settings`,
    `Check system logs for more details about ${dependencyName} failure`,
  ];

  return createDetailedError(
    agentId,
    "DependencyError",
    `Dependency failure: ${dependencyName} - ${issue}`,
    suggestions,
    {
      dependencyName,
      issue,
      systemStatus: "degraded",
    },
    {
      dependency: {
        name: dependencyName,
        status: "failed",
        issue,
        lastCheck: new Date().toISOString(),
      },
    },
    seamName,
    "critical"
  );
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
```

## 🚨 IDENTIFIED ISSUES TO FIX

### ISSUE 1: Duplicate IEnhancedSeamAnalyzer Interface

- **Location**: End of contracts.ts (appears twice)
- **Action**: Remove the duplicate

### ISSUE 2: Missing Type Definitions

The following types are referenced but not defined:

- `ComponentInteraction`
- `DataFlow`
- `CrossCuttingConcern`
- `InteractionType`
- `DataTypeDefinition`
- `DataTransformation`
- `SeamValidationError`
- `DataSource`
- `TransformationChain`
- `IdentifiedBottleneck`
- `OptimizationOpportunity`
- `DataGovernanceRisk`

### ISSUE 3: Import Structure in stubs.ts

- Need to import `IEnhancedSeamAnalyzer`
- Remove any duplicate imports
- Update `EnhancedSeamAnalyzerStub` to implement the interface

## 📋 READY FOR IMPLEMENTATION

This code is ready to be applied following the step-by-step action plan once Gemini provides additional guidance.
