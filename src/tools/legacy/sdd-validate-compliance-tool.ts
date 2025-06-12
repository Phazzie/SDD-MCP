import {
  ComplianceValidationInput,
  ComplianceValidationOutput,
  ContractResult,
} from "../../contracts.js";

class NotImplementedError extends Error {
  constructor(methodName: string, blueprint: string) {
    super(`${methodName}: ${blueprint}`);
    this.name = "NotImplementedError";
  }
}

/**
 * SDD Validate Compliance Agent
 * Validates SDD compliance: contract completeness, blueprint comments, ContractResult usage, test coverage
 *
 * Blueprint: This agent validates SDD project compliance by:
 * - Checking contract completeness and consistency
 * - Verifying blueprint comments are present
 * - Ensuring ContractResult<T> usage patterns
 * - Validating test coverage and structure
 * - Generating compliance reports with recommendations
 */
export class ValidateComplianceAgent {
  private readonly agentId = "validate-compliance-agent";

  /**
   * Validate input parameters for compliance validation
   */
  async validateInput(
    input: unknown
  ): Promise<ContractResult<ComplianceValidationInput>> {
    try {
      if (!input || typeof input !== "object") {
        return {
          success: false,
          error: "Input must be an object",
          metadata: {
            agentId: this.agentId,
            seamName: "validateInput",
            timestamp: new Date().toISOString(),
            validationErrors: "Invalid input type",
          },
        };
      }

      const data = input as any;
      if (!data.projectPath || typeof data.projectPath !== "string") {
        return {
          success: false,
          error: "projectPath is required and must be a string",
          metadata: {
            agentId: this.agentId,
            seamName: "validateInput",
            timestamp: new Date().toISOString(),
            validationErrors: "projectPath validation failed",
          },
        };
      }

      return {
        success: true,
        data: data as ComplianceValidationInput,
        metadata: {
          agentId: this.agentId,
          seamName: "validateInput",
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Input validation failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
        metadata: {
          agentId: this.agentId,
          seamName: "validateInput",
          timestamp: new Date().toISOString(),
          validationErrors: error,
        },
      };
    }
  }

  /**
   * Execute compliance validation
   */
  async execute(
    complianceInput: ComplianceValidationInput
  ): Promise<ContractResult<ComplianceValidationOutput>> {
    throw new NotImplementedError(
      "ValidateComplianceAgent.execute",
      `Blueprint: Validate SDD compliance across project files and generate comprehensive report
      
      DETAILED IMPLEMENTATION PLAN:
      
      // PHASE 1: Project Discovery
      const projectFiles = await this.scanProjectFiles(complianceInput.projectPath);
      
      // PHASE 2: Contract Analysis
      const contractCompliance = await this.validateContracts(projectFiles.contracts);
      
      // PHASE 3: Implementation Analysis  
      const implementationCompliance = await this.validateImplementations(projectFiles.implementations);
      
      // PHASE 4: Test Coverage Analysis
      const testCompliance = await this.validateTestCoverage(projectFiles.tests);
      
      // PHASE 5: SDD Pattern Analysis
      const sddCompliance = await this.validateSDDPatterns(projectFiles.all);
      
      // PHASE 6: Generate Report
      return this.generateComplianceReport({
        contractCompliance,
        implementationCompliance, 
        testCompliance,
        sddCompliance
      });`
    );
  }

  // Blueprint: HELPER METHODS TO IMPLEMENT
  /**
   * Blueprint: Scan project files and categorize them
   * Returns: { contracts: string[], implementations: string[], tests: string[], all: string[] }
   */ private async scanProjectFiles(projectPath: string): Promise<any> {
    const fs = await import("fs");
    const path = await import("path");

    const allFiles: string[] = [];
    const contracts: string[] = [];
    const implementations: string[] = [];
    const tests: string[] = [];

    try {
      const scanDirectory = async (dir: string) => {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.default.join(dir, entry.name);

          if (
            entry.isDirectory() &&
            !entry.name.startsWith(".") &&
            entry.name !== "node_modules"
          ) {
            await scanDirectory(fullPath);
          } else if (
            entry.isFile() &&
            (entry.name.endsWith(".ts") || entry.name.endsWith(".js"))
          ) {
            allFiles.push(fullPath);

            // Categorize files by SDD patterns
            if (
              entry.name.includes("contract") ||
              fullPath.includes("/contracts/")
            ) {
              contracts.push(fullPath);
            } else if (
              entry.name.includes("test") ||
              fullPath.includes("/test")
            ) {
              tests.push(fullPath);
            } else {
              implementations.push(fullPath);
            }
          }
        }
      };

      await scanDirectory(projectPath);

      return {
        all: allFiles,
        contracts,
        implementations,
        tests,
      };
    } catch (error) {
      throw new Error(
        `Failed to scan project files: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  /**
   * Blueprint: Validate contract files for SDD compliance
   * Check: ContractResult<T> return types, proper interfaces, export structure, type consistency
   */ private async validateContracts(contractFiles: string[]): Promise<any> {
    const fs = await import("fs");
    let totalContracts = 0;
    let compliantContracts = 0;
    const issues: string[] = [];

    for (const filePath of contractFiles) {
      try {
        const content = await fs.promises.readFile(filePath, "utf-8");
        totalContracts++;

        // Check for SDD patterns
        const hasContractResult = /ContractResult</.test(content);
        const hasAsyncMethods = /async\s+\w+\s*\([^)]*\)\s*:\s*Promise</.test(
          content
        );
        const hasProperExports = /export\s+(interface|type|class)/.test(
          content
        );

        if (hasContractResult && hasAsyncMethods && hasProperExports) {
          compliantContracts++;
        } else {
          if (!hasContractResult)
            issues.push(`${filePath}: Missing ContractResult<T> pattern`);
          if (!hasAsyncMethods)
            issues.push(`${filePath}: Missing async Promise methods`);
          if (!hasProperExports)
            issues.push(`${filePath}: Missing proper exports`);
        }
      } catch (error) {
        issues.push(
          `${filePath}: Failed to read file - ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    const score =
      totalContracts > 0
        ? Math.round((compliantContracts / totalContracts) * 100)
        : 0;

    return {
      isCompliant: score >= 80,
      issues,
      score,
      totalContracts,
      compliantContracts,
    };
  }
  /**
   * Blueprint: Validate implementation files for SDD patterns
   * Check: NotImplementedError usage, blueprint comments, method signatures, error handling
   */ private async validateImplementations(implFiles: string[]): Promise<any> {
    const fs = await import("fs");
    let hasStubs = 0;
    let hasImplementations = 0;
    let blueprintComments = 0;

    for (const filePath of implFiles) {
      try {
        const content = await fs.promises.readFile(filePath, "utf-8");

        // Count SDD patterns
        const stubMatches = content.match(/NotImplementedError/g);
        const blueprintMatches = content.match(/\/\*\s*Blueprint:/g);
        const implementationMatches = content.match(/return\s+{\s*success:/g);

        if (stubMatches) hasStubs += stubMatches.length;
        if (blueprintMatches) blueprintComments += blueprintMatches.length;
        if (implementationMatches)
          hasImplementations += implementationMatches.length;
      } catch (error) {
        // Continue validation even if individual files fail
        continue;
      }
    }

    return {
      hasStubs,
      hasImplementations,
      blueprintComments,
      totalFiles: implFiles.length,
      stubCoverage:
        hasStubs > 0
          ? Math.round((hasStubs / (hasStubs + hasImplementations)) * 100)
          : 0,
    };
  }
  /**
   * Blueprint: Analyze test coverage and structure
   * Check: Seam tests (test-*-seam.js), contract tests, error cases, integration tests
   */ private async validateTestCoverage(testFiles: string[]): Promise<any> {
    const fs = await import("fs");
    let seamTests = 0;
    let contractTests = 0;
    let integrationTests = 0;
    let totalTests = testFiles.length;

    for (const filePath of testFiles) {
      try {
        const content = await fs.promises.readFile(filePath, "utf-8");
        const fileName = filePath.split("/").pop() || "";

        // Check for SDD test patterns
        if (fileName.includes("seam") || content.includes("executeSeam")) {
          seamTests++;
        }

        if (
          content.includes("ContractResult") ||
          content.includes("validateInput")
        ) {
          contractTests++;
        }

        if (content.includes("integration") || content.includes("end-to-end")) {
          integrationTests++;
        }
      } catch (error) {
        // Continue even if file can't be read
        continue;
      }
    }

    const coverage =
      totalTests > 0
        ? Math.round(((seamTests + contractTests) / totalTests) * 100)
        : 0;

    return {
      seamTests,
      contractTests,
      integrationTests,
      totalTests,
      coverage,
      hasSeamTests: seamTests > 0,
      hasContractTests: contractTests > 0,
    };
  }
  /**
   * Blueprint: Validate SDD-specific architectural patterns
   * Check: Seam-driven architecture, contract-first development, blueprint-guided implementation
   */ private async validateSDDPatterns(allFiles: string[]): Promise<any> {
    const fs = await import("fs");
    let seamArchitecture = false;
    let contractFirst = false;
    let blueprintGuided = false;
    let failFastErrors = false;

    for (const filePath of allFiles) {
      try {
        const content = await fs.promises.readFile(filePath, "utf-8");
        const fileName = filePath.split("/").pop() || "";

        // Check for seam management
        if (fileName === "seams.ts" || fileName === "seams.js") {
          if (
            content.includes("executeSeam") &&
            content.includes("seamManager")
          ) {
            seamArchitecture = true;
          }
        }

        // Contract-first patterns
        if (
          content.includes("ContractResult<") &&
          content.includes("Promise<ContractResult")
        ) {
          contractFirst = true;
        }

        // Blueprint guidance
        if (
          content.includes("/* Blueprint:") ||
          content.includes("// Blueprint:")
        ) {
          blueprintGuided = true;
        }

        // Fail-fast error handling
        if (
          content.includes("NotImplementedError") ||
          content.includes("success: false")
        ) {
          failFastErrors = true;
        }
      } catch (error) {
        continue;
      }
    }

    return {
      seamArchitecture,
      contractFirst,
      blueprintGuided,
      failFastErrors,
      overallCompliance:
        seamArchitecture && contractFirst && blueprintGuided && failFastErrors,
    };
  }
  /**
   * Blueprint: Generate comprehensive compliance report
   * Output: compliance score (0-100), issues list, recommendations, summary
   */
  private generateComplianceReport(
    analysis: any
  ): ContractResult<ComplianceValidationOutput> {
    const {
      contractCompliance,
      implementationCompliance,
      testCompliance,
      sddCompliance,
    } = analysis;

    // Calculate weighted compliance score
    const weights = {
      contracts: 0.3, // 30% - Contract compliance is critical
      implementation: 0.2, // 20% - Implementation patterns matter
      tests: 0.2, // 20% - Test coverage important
      sdd: 0.3, // 30% - SDD pattern compliance is key
    };

    const complianceScore = Math.round(
      contractCompliance.score * weights.contracts +
        implementationCompliance.stubCoverage * weights.implementation +
        testCompliance.coverage * weights.tests +
        (sddCompliance.overallCompliance ? 100 : 0) * weights.sdd
    );

    // Generate actionable issues and recommendations
    const issues: string[] = [
      ...contractCompliance.issues,
      ...(implementationCompliance.blueprintComments === 0
        ? ["Missing blueprint comments in implementations"]
        : []),
      ...(testCompliance.seamTests === 0
        ? ["No seam connection tests found"]
        : []),
      ...(!sddCompliance.seamArchitecture
        ? ["Missing seam architecture (seams.ts)"]
        : []),
      ...(!sddCompliance.contractFirst
        ? ["Missing ContractResult<T> patterns"]
        : []),
    ];

    const recommendations: string[] = [];

    if (complianceScore < 70) {
      recommendations.push(
        "🚨 CRITICAL: Project needs major SDD compliance improvements"
      );
    }
    if (!sddCompliance.seamArchitecture) {
      recommendations.push(
        "🔗 Implement seam-driven architecture with seams.ts"
      );
    }
    if (contractCompliance.score < 80) {
      recommendations.push(
        "💰 HIGH_ROI: Add ContractResult<T> return types to interfaces"
      );
    }
    if (testCompliance.seamTests === 0) {
      recommendations.push(
        "⚡ QUICK_WIN: Add seam connection tests (test-*-seam.js)"
      );
    }
    if (implementationCompliance.blueprintComments < 5) {
      recommendations.push(
        "🛡️ DEFENSIVE: Add blueprint comments to guide implementation"
      );
    }

    const summary = `SDD Compliance: ${complianceScore}% - ${
      complianceScore >= 90
        ? "🏆 Excellent SDD compliance!"
        : complianceScore >= 70
        ? "✅ Good SDD compliance"
        : complianceScore >= 50
        ? "⚠️ Moderate compliance - needs improvement"
        : "🚨 Poor compliance - major SDD violations detected"
    }`;
    return {
      success: true,
      data: {
        compliant: complianceScore >= 70,
        contractCompleteness: {
          score: contractCompliance.score,
          missing: contractCompliance.issues,
          recommendations:
            contractCompliance.score < 80
              ? [
                  "Add ContractResult<T> return types",
                  "Ensure proper async method signatures",
                ]
              : [],
        },
        blueprintComments: {
          coverage:
            implementationCompliance.blueprintComments > 0
              ? Math.round(
                  (implementationCompliance.blueprintComments /
                    implementationCompliance.totalFiles) *
                    100
                )
              : 0,
          missing:
            implementationCompliance.blueprintComments === 0
              ? ["Implementation files missing blueprint comments"]
              : [],
        },
        contractResultUsage: {
          consistent: sddCompliance.contractFirst,
          violations: sddCompliance.contractFirst
            ? []
            : ["Inconsistent ContractResult<T> usage patterns"],
        },
        testCoverage: {
          percentage: testCompliance.coverage,
          missingTests:
            testCompliance.seamTests === 0
              ? ["Missing seam connection tests"]
              : [],
        },
        overallRecommendations: recommendations,
      },
      metadata: {
        agentId: this.agentId,
        complianceScore,
        summary,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
