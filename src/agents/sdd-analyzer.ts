/**
 * SDD Analyzer Agent Implementation
 *
 * This agent orchestrates the complete SDD workflow:
 * PRD → Seam Analysis → Contract Generation → Stub Creation → Validation
 *
 * Blueprint: Core SDD methodology orchestration
 *
 * @author: SDD MCP Server
 * @seam: SDDAnalyzer (Main orchestration agent)
 */

import {
  AgentId,
  ComplianceReport,
  ContractGenerationResult,
  ContractResult,
  PatternReport,
  ProjectStructure,
  SDDFunctionContract,
  SeamDefinition,
  StubGenerationResult,
  ValidationReport,
} from "../contracts.js";
import { SeamManager } from "../seams.js";
import { ConfigManager } from "./config-manager.js";
import { ErrorHandler } from "./error-handler.js";
import { TemplateProcessor } from "./template-processor.js";
import { ValidationEngine } from "./validation-engine.js";

export class SDDAnalyzer implements SDDFunctionContract {
  private readonly agentId: AgentId = "SDDAnalyzer";
  private readonly seamManager: SeamManager;
  private readonly configManager: ConfigManager;
  private readonly errorHandler: ErrorHandler;
  private readonly templateProcessor: TemplateProcessor;
  private readonly validationEngine: ValidationEngine;

  constructor(
    seamManager: SeamManager,
    configManager: ConfigManager,
    errorHandler: ErrorHandler,
    templateProcessor: TemplateProcessor,
    validationEngine: ValidationEngine
  ) {
    this.seamManager = seamManager;
    this.configManager = configManager;
    this.errorHandler = errorHandler;
    this.templateProcessor = templateProcessor;
    this.validationEngine = validationEngine;
  }

  /**
   * Analyze requirements to identify seams
   * Blueprint: Parse PRD text to extract seam definitions
   */
  analyzeRequirements(prd: string): ContractResult<SeamDefinition[]> {
    try {
      console.log(
        `🔄 ${this.agentId}: Analyzing requirements for seam identification`
      );

      const seams = this.analyzeSeamsFromPRD(prd);
      console.log(
        `✅ ${this.agentId}: Identified ${seams.length} seams from requirements`
      );

      return {
        success: true,
        data: seams,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return this.errorHandler.createTypedErrorResult<SeamDefinition[]>(
        error as Error,
        {
          agentId: this.agentId,
          operation: "analyzeRequirements",
          timestamp: new Date().toISOString(),
          additionalInfo: { prd: prd.substring(0, 200) + "..." },
        },
        []
      );
    }
  }

  /**
   * Generate contract from seam definition using SDD methodology
   * Blueprint: Transform seam into type-safe contract with templates
   */
  async generateContract(
    seam: SeamDefinition
  ): Promise<ContractResult<ContractGenerationResult>> {
    try {
      console.log(
        `🔄 ${this.agentId}: Generating contract for seam: ${seam.name}`
      );

      // Load contract template
      const templateResult = await this.templateProcessor.loadTemplate(
        "contract"
      );
      if (!templateResult.success) {
        return this.errorHandler.createTypedErrorResult<ContractGenerationResult>(
          new Error(
            `Failed to load contract template: ${templateResult.error}`
          ),
          {
            agentId: this.agentId,
            operation: "generateContract",
            timestamp: new Date().toISOString(),
            additionalInfo: { seam: seam.name },
          }
        );
      }

      // Prepare template data
      const templateData = {
        seamName: seam.name,
        purpose: seam.purpose,
        participants: seam.participants,
        dataFlow: seam.dataFlow,
        contractInterface: seam.contractInterface,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };

      // Process template with seam data
      const processResult = await this.templateProcessor.processTemplate(
        templateResult.data!,
        templateData
      );
      if (!processResult.success) {
        return this.errorHandler.handleError(
          new Error(
            `Failed to process contract template: ${processResult.error}`
          ),
          { seam: seam.name, templateData }
        );
      }

      // Generate blueprint comments
      const blueprintComments = this.generateBlueprintComments(seam);

      // Extract type aliases from seam interface
      const typeAliases = this.extractTypeAliases(seam);

      // Generate test template
      const testTemplate = this.generateTestTemplate(seam);

      const result: ContractGenerationResult = {
        contractCode: processResult.data!,
        blueprintComments,
        typeAliases,
        agentId: this.agentId,
        testTemplate,
      };

      console.log(
        `✅ ${this.agentId}: Contract generated for seam: ${seam.name}`
      );

      return {
        success: true,
        data: result,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return this.errorHandler.handleError(error as Error, { seam: seam.name });
    }
  }

  /**
   * Create implementation stub from contract
   * Blueprint: Generate implementation skeleton with NotImplementedError tracking
   */
  async createStub(
    contract: ContractGenerationResult
  ): Promise<ContractResult<StubGenerationResult>> {
    try {
      console.log(
        `🔄 ${this.agentId}: Creating stub for contract from ${contract.agentId}`
      );

      // Load stub template
      const templateResult = await this.templateProcessor.loadTemplate("stub");
      if (!templateResult.success) {
        return this.errorHandler.handleError(
          new Error(`Failed to load stub template: ${templateResult.error}`),
          { contractAgentId: contract.agentId }
        );
      }

      // Prepare template data for stub generation
      const templateData = {
        contractCode: contract.contractCode,
        blueprintComments: contract.blueprintComments,
        typeAliases: contract.typeAliases,
        testTemplate: contract.testTemplate,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };

      // Process stub template
      const processResult = await this.templateProcessor.processTemplate(
        templateResult.data!,
        templateData
      );
      if (!processResult.success) {
        return this.errorHandler.handleError(
          new Error(`Failed to process stub template: ${processResult.error}`),
          { contractAgentId: contract.agentId, templateData }
        );
      }

      // Generate integration tests
      const integrationTests = this.generateIntegrationTests(contract);

      // Generate health check
      const healthCheck = this.generateHealthCheck(contract);

      // Generate documentation
      const documentation = this.generateDocumentation(contract);

      const result: StubGenerationResult = {
        stubCode: processResult.data!,
        integrationTests,
        healthCheck,
        agentId: this.agentId,
        documentation,
      };

      console.log(
        `✅ ${this.agentId}: Stub created for contract from ${contract.agentId}`
      );

      return {
        success: true,
        data: result,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return this.errorHandler.handleError(error as Error, {
        contractAgentId: contract.agentId,
      });
    }
  }

  /**
   * Orchestrate complete SDD workflow
   * Blueprint: Execute full PRD → Seams → Contracts → Stubs → Validation workflow
   */
  async orchestrateWorkflow(
    prd: string
  ): Promise<ContractResult<ProjectStructure>> {
    try {
      console.log(`🔄 ${this.agentId}: Starting SDD workflow orchestration`);

      // Step 1: Analyze PRD to identify seams
      const seamAnalysisResult = this.analyzeRequirements(prd);
      if (!seamAnalysisResult.success) {
        return this.errorHandler.handleError(
          new Error(
            `Failed to analyze requirements: ${seamAnalysisResult.error}`
          ),
          { prd: prd.substring(0, 200) + "..." }
        );
      }
      const seams = seamAnalysisResult.data!;
      console.log(
        `📋 ${this.agentId}: Identified ${seams.length} seams from PRD`
      );

      // Step 2: Generate contracts for each seam
      const contracts: { [seamName: string]: ContractGenerationResult } = {};
      for (const seam of seams) {
        const contractResult = await this.generateContract(seam);
        if (!contractResult.success) {
          return this.errorHandler.handleError(
            new Error(
              `Failed to generate contract for seam ${seam.name}: ${contractResult.error}`
            ),
            { seam: seam.name, prd: prd.substring(0, 200) + "..." }
          );
        }
        contracts[seam.name] = contractResult.data!;
      }

      // Step 3: Create stubs for each contract
      const stubs: { [seamName: string]: StubGenerationResult } = {};
      for (const [seamName, contract] of Object.entries(contracts)) {
        const stubResult = await this.createStub(contract);
        if (!stubResult.success) {
          return this.errorHandler.handleError(
            new Error(
              `Failed to create stub for seam ${seamName}: ${stubResult.error}`
            ),
            { seamName, contractAgentId: contract.agentId }
          );
        }
        stubs[seamName] = stubResult.data!;
      }

      // Step 4: Generate integration plan
      const integrationPlan = this.generateIntegrationPlan(
        seams,
        contracts,
        stubs
      );

      // Step 5: Calculate readiness score
      const readinessScore = this.calculateReadinessScore(contracts, stubs);

      const projectStructure: ProjectStructure = {
        seams,
        contracts,
        stubs,
        integrationPlan,
        readinessScore,
      };

      console.log(
        `✅ ${this.agentId}: SDD workflow completed (readiness: ${readinessScore}%)`
      );

      return {
        success: true,
        data: projectStructure,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return this.errorHandler.handleError(error as Error, {
        prd: prd.substring(0, 200) + "...",
      });
    }
  }

  /**
   * Validate project structure against SDD patterns
   * Blueprint: Comprehensive validation of SDD compliance
   */
  async validateProject(
    structure: ProjectStructure
  ): Promise<ContractResult<ValidationReport>> {
    try {
      console.log(`🔄 ${this.agentId}: Validating project structure`);

      // Validate SDD compliance
      const complianceResult = this.validateSDDCompliance(structure);
      if (!complianceResult.success) {
        return this.errorHandler.handleError(
          new Error(`Compliance validation failed: ${complianceResult.error}`),
          {
            structure:
              JSON.stringify(structure, null, 2).substring(0, 500) + "...",
          }
        );
      }

      // Validate project health
      const healthResult = await this.validationEngine.validateProjectHealth(
        structure
      );
      if (!healthResult.success) {
        return this.errorHandler.handleError(
          new Error(`Health validation failed: ${healthResult.error}`),
          {
            structure:
              JSON.stringify(structure, null, 2).substring(0, 500) + "...",
          }
        );
      }

      // Validate SDD patterns
      const patternResult = this.validateSDDPatterns(structure);
      if (!patternResult.success) {
        return this.errorHandler.handleError(
          new Error(`Pattern validation failed: ${patternResult.error}`),
          {
            structure:
              JSON.stringify(structure, null, 2).substring(0, 500) + "...",
          }
        );
      }

      const validationReport: ValidationReport = {
        ...complianceResult.data!,
        ...healthResult.data!,
        ...patternResult.data!,
      };

      console.log(`✅ ${this.agentId}: Project validation completed`);

      return {
        success: true,
        data: validationReport,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return this.errorHandler.handleError(error as Error, {
        structure: JSON.stringify(structure, null, 2).substring(0, 500) + "...",
      });
    }
  }

  // ================================
  // Private Helper Methods
  // ================================
  private analyzeSeamsFromPRD(prd: string): SeamDefinition[] {
    // Blueprint: Extract seam patterns from PRD text
    const seams: SeamDefinition[] = [];

    // Common SDD seam patterns to look for
    const seamPatterns = [
      {
        name: "DataFlow",
        keywords: ["data", "input", "output", "transform", "process"],
        purpose: "Handle data transformation and flow",
      },
      {
        name: "UserInterface",
        keywords: ["ui", "interface", "user", "display", "view"],
        purpose: "Manage user interactions and presentation",
      },
      {
        name: "BusinessLogic",
        keywords: ["logic", "business", "rule", "validation", "calculate"],
        purpose: "Implement core business rules",
      },
      {
        name: "DataStorage",
        keywords: ["storage", "database", "persist", "save", "retrieve"],
        purpose: "Manage data persistence",
      },
      {
        name: "ExternalAPI",
        keywords: ["api", "external", "service", "integration", "third-party"],
        purpose: "Handle external service integration",
      },
      {
        name: "Configuration",
        keywords: ["config", "setting", "parameter", "environment"],
        purpose: "Manage application configuration",
      },
    ];

    const prdLower = prd.toLowerCase();

    for (const pattern of seamPatterns) {
      const matchCount = pattern.keywords.reduce(
        (count, keyword) => count + (prdLower.split(keyword).length - 1),
        0
      );

      if (matchCount >= 2) {
        // Seam identified if 2+ relevant keywords found
        seams.push({
          name: pattern.name,
          participants: ["user", "system"],
          dataFlow: "BOTH" as const,
          purpose: pattern.purpose,
          contractInterface: `interface ${pattern.name}Contract { /* TODO: Define interface */ }`,
        });
      }
    }

    // Always include Configuration seam for SDD compliance
    if (!seams.find((s) => s.name === "Configuration")) {
      seams.push({
        name: "Configuration",
        participants: ["system", "environment"],
        dataFlow: "IN" as const,
        purpose: "Configuration management seam (SDD required)",
        contractInterface:
          "interface ConfigurationContract { /* TODO: Define interface */ }",
      });
    }

    return seams;
  }

  private generateBlueprintComments(seam: SeamDefinition): string {
    return `
// Blueprint: ${seam.purpose}
// Seam: ${seam.name}
// Participants: ${seam.participants.join(", ")}
// DataFlow: ${seam.dataFlow}
// Contract: ${seam.contractInterface}
// Generated: ${new Date().toISOString()}
`;
  }

  private extractTypeAliases(seam: SeamDefinition): string[] {
    const aliases: string[] = [];

    // Generate type aliases based on seam contract interface
    aliases.push(
      `export type ${seam.name}Input = unknown; // TODO: Define ${seam.name} input type`
    );
    aliases.push(
      `export type ${seam.name}Output = unknown; // TODO: Define ${seam.name} output type`
    );
    aliases.push(
      `export type ${seam.name}Config = unknown; // TODO: Define ${seam.name} configuration type`
    );

    return aliases;
  }

  private generateTestTemplate(seam: SeamDefinition): string {
    return `
describe('${seam.name} Contract Tests', () => {
  test('should handle seam communication', () => {
    // TODO: Implement test for ${seam.participants.join(" <-> ")} communication
  });

  test('should manage ${seam.dataFlow} data flow', () => {
    // TODO: Implement test for ${seam.dataFlow} data flow
  });

  test('should fulfill purpose: ${seam.purpose}', () => {
    // TODO: Implement test for seam purpose
  });

  test('should handle error conditions', () => {
    // TODO: Implement error handling tests
  });
});
`;
  }

  private generateIntegrationTests(contract: ContractGenerationResult): string {
    return `
// Integration Tests for ${contract.agentId}
// Generated: ${new Date().toISOString()}

describe('${contract.agentId} Integration', () => {
  test('should integrate with seam manager', () => {
    // TODO: Test seam communication
  });

  test('should handle contract lifecycle', () => {
    // TODO: Test contract creation, execution, cleanup
  });
});
`;
  }

  private generateHealthCheck(contract: ContractGenerationResult): string {
    return `
// Health Check for ${contract.agentId}
export function healthCheck(): { status: 'healthy' | 'degraded' | 'unhealthy', details: string } {
  try {
    // TODO: Implement health check logic
    return { status: 'healthy', details: '${contract.agentId} is operational' };
  } catch (error) {
    return { status: 'unhealthy', details: \`${contract.agentId} error: \${error.message}\` };
  }
}
`;
  }

  private generateDocumentation(contract: ContractGenerationResult): string {
    return `
# ${contract.agentId} Documentation

## Overview
Contract generated from SDD methodology.

## Blueprint Comments
\`\`\`typescript
${contract.blueprintComments}
\`\`\`

## Type Aliases
\`\`\`typescript
${contract.typeAliases.join("\n")}
\`\`\`

## Test Template
\`\`\`typescript
${contract.testTemplate}
\`\`\`

Generated: ${new Date().toISOString()}
`;
  }

  private generateIntegrationPlan(
    seams: SeamDefinition[],
    contracts: { [seamName: string]: ContractGenerationResult },
    stubs: { [seamName: string]: StubGenerationResult }
  ): string {
    return `
# SDD Integration Plan

## Seams Identified: ${seams.length}
${seams.map((s) => `- ${s.name}: ${s.description}`).join("\n")}

## Contracts Generated: ${Object.keys(contracts).length}
${Object.keys(contracts)
  .map((name) => `- ${name}: Contract ready`)
  .join("\n")}

## Stubs Created: ${Object.keys(stubs).length}
${Object.keys(stubs)
  .map((name) => `- ${name}: Stub ready for implementation`)
  .join("\n")}

## Implementation Order
1. Implement foundation seams (Configuration, ErrorHandling)
2. Implement data flow seams
3. Implement business logic seams
4. Implement UI/API seams
5. Integration testing
6. Deployment

Generated: ${new Date().toISOString()}
`;
  }

  private calculateReadinessScore(
    contracts: { [seamName: string]: ContractGenerationResult },
    stubs: { [seamName: string]: StubGenerationResult }
  ): number {
    const contractCount = Object.keys(contracts).length;
    const stubCount = Object.keys(stubs).length;

    if (contractCount === 0) return 0;

    // Base score from having contracts and stubs
    let score = 60;

    // Bonus for complete contract/stub pairs
    if (stubCount === contractCount) score += 20;

    // Bonus for having sufficient seams (3+ indicates good decomposition)
    if (contractCount >= 3) score += 10;

    // Bonus for having configuration seam (SDD requirement)
    if (contracts["Configuration"]) score += 10;

    return Math.min(100, score);
  }

  private validateSDDCompliance(
    structure: ProjectStructure
  ): ContractResult<ComplianceReport> {
    try {
      const issues: string[] = [];
      let score = 100;

      // Check for required SDD components
      if (structure.seams.length === 0) {
        issues.push("No seams identified - SDD requires seam decomposition");
        score -= 40;
      }

      if (Object.keys(structure.contracts).length === 0) {
        issues.push(
          "No contracts generated - SDD requires contract-first approach"
        );
        score -= 30;
      }

      if (Object.keys(structure.stubs).length === 0) {
        issues.push("No stubs created - SDD requires implementation stubs");
        score -= 20;
      }

      // Check for Configuration seam (SDD requirement)
      if (!structure.contracts["Configuration"]) {
        issues.push("Missing Configuration seam - Required for SDD compliance");
        score -= 10;
      }

      const report: ComplianceReport = {
        score: Math.max(0, score),
        issues,
        recommendations:
          issues.length > 0
            ? [
                "Follow SDD methodology: PRD → Seams → Contracts → Stubs",
                "Ensure all seams have corresponding contracts and stubs",
                "Include Configuration seam for environment management",
              ]
            : [],
      };

      return {
        success: true,
        data: report,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return this.errorHandler.handleError(
        error as Error,
        {
          structure:
            JSON.stringify(structure, null, 2).substring(0, 500) + "...",
        },
        this.agentId
      );
    }
  }

  private validateSDDPatterns(
    structure: ProjectStructure
  ): ContractResult<PatternReport> {
    try {
      const patterns: string[] = [];
      let score = 100;

      // Check for Blueprint comments pattern
      const hasBlueprints = Object.values(structure.contracts).some(
        (c) => c.blueprintComments && c.blueprintComments.includes("Blueprint:")
      );
      if (hasBlueprints) {
        patterns.push("Blueprint Comments: Found in contracts");
      } else {
        patterns.push("Blueprint Comments: Missing from contracts");
        score -= 20;
      }

      // Check for ContractResult pattern
      const hasContractResults = Object.values(structure.contracts).some(
        (c) => c.contractCode && c.contractCode.includes("ContractResult")
      );
      if (hasContractResults) {
        patterns.push("ContractResult Pattern: Used in contracts");
      } else {
        patterns.push("ContractResult Pattern: Missing from contracts");
        score -= 20;
      }

      // Check for NotImplementedError pattern in stubs
      const hasNotImplementedErrors = Object.values(structure.stubs).some(
        (s) => s.stubCode && s.stubCode.includes("NotImplementedError")
      );
      if (hasNotImplementedErrors) {
        patterns.push("NotImplementedError Pattern: Used in stubs");
      } else {
        patterns.push("NotImplementedError Pattern: Missing from stubs");
        score -= 15;
      }

      // Check for integration tests
      const hasIntegrationTests = Object.values(structure.stubs).some(
        (s) => s.integrationTests && s.integrationTests.length > 0
      );
      if (hasIntegrationTests) {
        patterns.push("Integration Tests: Generated for stubs");
      } else {
        patterns.push("Integration Tests: Missing from stubs");
        score -= 15;
      }

      const report: PatternReport = {
        score: Math.max(0, score),
        patterns,
        coverage: Math.round(
          (patterns.filter((p) => !p.includes("Missing")).length /
            patterns.length) *
            100
        ),
      };

      return {
        success: true,
        data: report,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return this.errorHandler.handleError(
        error as Error,
        {
          structure:
            JSON.stringify(structure, null, 2).substring(0, 500) + "...",
        },
        this.agentId
      );
    }
  }
}
