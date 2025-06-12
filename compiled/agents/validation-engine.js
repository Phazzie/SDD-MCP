/**
 * SDD MCP Server - ValidationEngine Implementation
 * Core agent providing validation services for SDD compliance and project health
 */
import { z } from "zod";
import { seamManager } from "../seams.js";
import { configManager } from "./config-manager.js";
import { errorHandler } from "./error-handler.js";
export class ValidationEngine {
    agentId = "ValidationEngine";
    sddPatterns = new Map();
    complianceRules = [];
    constructor() {
        this.initializePatterns();
        this.initializeRules();
    }
    // Blueprint: Input validation with comprehensive Zod schema support
    async validateInput(schema, data) {
        try {
            // Validate data against Zod schema
            const validationResult = schema.safeParse(data);
            if (validationResult.success) {
                console.log(`✅ ${this.agentId}: Input validation passed`);
                return {
                    success: true,
                    data: validationResult.data,
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                };
            }
            else {
                // Format Zod errors for user-friendly output
                const errors = validationResult.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
                const errorMessage = `Validation failed: ${errors.join("; ")}`;
                await errorHandler.logError(this.agentId, errorMessage, {
                    zodErrors: validationResult.error.errors,
                    inputData: data,
                });
                return {
                    success: false,
                    error: errorMessage,
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                };
            }
        }
        catch (error) {
            const errorMessage = `Input validation error: ${error instanceof Error ? error.message : "Unknown error"}`;
            await errorHandler.handleError(error instanceof Error ? error : new Error(errorMessage), {
                agentId: this.agentId,
                operation: "validateInput",
                timestamp: new Date().toISOString(),
                additionalInfo: { schemaType: schema.constructor.name },
            });
            return {
                success: false,
                error: errorMessage,
                agentId: this.agentId,
                timestamp: new Date().toISOString(),
            };
        }
    }
    // Blueprint: Contract compliance checking with detailed scoring
    async validateContract(code) {
        try {
            const issues = [];
            const suggestions = [];
            let score = 100;
            // Check required SDD patterns
            const requiredPatterns = await this.getRequiredPatterns();
            for (const pattern of requiredPatterns) {
                if (!code.includes(pattern)) {
                    issues.push(`Missing required pattern: ${pattern}`);
                    suggestions.push(`Add ${pattern} to follow SDD methodology`);
                    score -= 15;
                }
            }
            // Check contract structure
            const structureIssues = this.validateContractStructure(code);
            issues.push(...structureIssues.map((issue) => `Structure: ${issue}`));
            score -= structureIssues.length * 10;
            // Check type safety
            const typeSafetyIssues = this.validateTypeSafety(code);
            issues.push(...typeSafetyIssues.map((issue) => `Type Safety: ${issue}`));
            score -= typeSafetyIssues.length * 8;
            // Check error handling patterns
            const errorHandlingIssues = this.validateErrorHandling(code);
            issues.push(...errorHandlingIssues.map((issue) => `Error Handling: ${issue}`));
            score -= errorHandlingIssues.length * 12;
            // Ensure score doesn't go below 0
            score = Math.max(0, score);
            const isCompliant = score >= 70; // 70% threshold for compliance
            const report = {
                isCompliant,
                issues,
                suggestions,
                score,
            };
            console.log(`✅ ${this.agentId}: Contract compliance check completed (score: ${score})`);
            return {
                success: true,
                data: report,
                agentId: this.agentId,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            const errorMessage = `Contract validation error: ${error instanceof Error ? error.message : "Unknown error"}`;
            await errorHandler.handleError(error instanceof Error ? error : new Error(errorMessage), {
                agentId: this.agentId,
                operation: "validateContract",
                timestamp: new Date().toISOString(),
                additionalInfo: { codeLength: code.length },
            });
            return {
                success: false,
                error: errorMessage,
                agentId: this.agentId,
                timestamp: new Date().toISOString(),
            };
        }
    }
    // Blueprint: Project health assessment with seam status tracking
    async validateProjectHealth(structure) {
        try {
            const seamStatuses = [];
            let readinessScore = 100;
            let overall = "healthy";
            // Check each seam in the project structure
            for (const seam of structure.seams) {
                const seamStatus = await this.checkSeamStatus(seam);
                seamStatuses.push(seamStatus);
                // Adjust readiness score based on seam status
                switch (seamStatus.status) {
                    case "implemented":
                        // No penalty for implemented seams
                        break;
                    case "stubbed":
                        readinessScore -= 10;
                        if (overall === "healthy")
                            overall = "warning";
                        break;
                    case "missing":
                        readinessScore -= 25;
                        overall = "error";
                        break;
                }
            } // Check contract implementations
            const contractEntries = Object.values(structure.contracts);
            const contractsTotal = contractEntries.length;
            // Note: ContractGenerationResult doesn't have isImplemented field, so we check if contractCode exists
            const contractsImplemented = contractEntries.filter((c) => c.contractCode && c.contractCode.trim().length > 0).length;
            const contractScore = contractsTotal > 0 ? (contractsImplemented / contractsTotal) * 100 : 0;
            readinessScore = (readinessScore + contractScore) / 2;
            // Ensure score doesn't go below 0
            readinessScore = Math.max(0, readinessScore);
            const report = {
                overall,
                seams: seamStatuses,
                readinessScore: Math.round(readinessScore),
            };
            console.log(`✅ ${this.agentId}: Project health assessment completed (readiness: ${Math.round(readinessScore)}%)`);
            return {
                success: true,
                data: report,
                agentId: this.agentId,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            const errorMessage = `Project health validation error: ${error instanceof Error ? error.message : "Unknown error"}`;
            await errorHandler.handleError(error instanceof Error ? error : new Error(errorMessage), {
                agentId: this.agentId,
                operation: "validateProjectHealth",
                timestamp: new Date().toISOString(),
                additionalInfo: {
                    contractsCount: structure.contracts.length,
                    seamsCount: structure.seams.length,
                },
            });
            return {
                success: false,
                error: errorMessage,
                agentId: this.agentId,
                timestamp: new Date().toISOString(),
            };
        }
    }
    // Blueprint: SDD pattern verification with confidence scoring
    async validateSDDPatterns(code) {
        try {
            const patternsFound = [];
            const patternsMissing = [];
            const recommendations = [];
            // Check each SDD pattern
            for (const [patternName, patternRegex] of this.sddPatterns.entries()) {
                if (patternRegex.test(code)) {
                    patternsFound.push(patternName);
                }
                else {
                    patternsMissing.push(patternName);
                    recommendations.push(this.getPatternRecommendation(patternName));
                }
            }
            // Calculate confidence based on pattern coverage
            const totalPatterns = this.sddPatterns.size;
            const foundPatterns = patternsFound.length;
            const confidence = Math.round((foundPatterns / totalPatterns) * 100);
            // Add specific recommendations based on missing patterns
            if (patternsMissing.includes("Blueprint Comments")) {
                recommendations.push('Add "Blueprint:" comments to describe component purposes');
            }
            if (patternsMissing.includes("ContractResult")) {
                recommendations.push("Use ContractResult<T> for all method return types");
            }
            if (patternsMissing.includes("AgentId")) {
                recommendations.push("Include AgentId tracking for seam communication");
            }
            const report = {
                patternsFound,
                patternsMissing,
                recommendations,
                confidence,
            };
            console.log(`✅ ${this.agentId}: SDD pattern validation completed (confidence: ${confidence}%)`);
            return {
                success: true,
                data: report,
                agentId: this.agentId,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            const errorMessage = `SDD pattern validation error: ${error instanceof Error ? error.message : "Unknown error"}`;
            await errorHandler.handleError(error instanceof Error ? error : new Error(errorMessage), {
                agentId: this.agentId,
                operation: "validateSDDPatterns",
                timestamp: new Date().toISOString(),
                additionalInfo: { codeLength: code.length },
            });
            return {
                success: false,
                error: errorMessage,
                agentId: this.agentId,
                timestamp: new Date().toISOString(),
            };
        }
    }
    // Blueprint: Private helper methods for validation logic
    initializePatterns() {
        // Core SDD patterns
        this.sddPatterns.set("Blueprint Comments", /\/\/\s*Blueprint:/g);
        this.sddPatterns.set("ContractResult", /ContractResult<[^>]+>/g);
        this.sddPatterns.set("AgentId", /AgentId/g);
        this.sddPatterns.set("Error Handling", /catch\s*\([^)]*\)\s*{/g);
        this.sddPatterns.set("NotImplementedError", /NotImplementedError/g);
        this.sddPatterns.set("Seam Communication", /seamManager\./g);
        this.sddPatterns.set("Async Patterns", /async\s+\w+\s*\([^)]*\)\s*:\s*Promise</g);
        this.sddPatterns.set("Type Safety", /:\s*[A-Z]\w*[<>]?/g);
    }
    initializeRules() {
        this.complianceRules = [
            {
                name: "Contract Return Types",
                check: (code) => code.includes("ContractResult<"),
                message: "All contract methods must return ContractResult<T>",
            },
            {
                name: "Agent Identification",
                check: (code) => code.includes("agentId"),
                message: "Agent ID must be included for seam tracking",
            },
            {
                name: "Error Handling",
                check: (code) => code.includes("try") && code.includes("catch"),
                message: "Error handling must be implemented for all operations",
            },
            {
                name: "Blueprint Documentation",
                check: (code) => code.includes("// Blueprint:"),
                message: "Blueprint comments must document component purposes",
            },
        ];
    }
    async getRequiredPatterns() {
        try {
            const configResult = await configManager.loadConfig();
            if (configResult.success &&
                configResult.data?.validation?.requiredPatterns) {
                return configResult.data.validation.requiredPatterns;
            }
        }
        catch (error) {
            await errorHandler.logError(this.agentId, "Failed to load required patterns from config", error);
        }
        // Fallback to default patterns
        return [
            "ContractResult<T>",
            "AgentId",
            "NotImplementedError",
            "Blueprint:",
        ];
    }
    validateContractStructure(code) {
        const issues = [];
        // Check for interface definition
        if (!code.includes("interface") && !code.includes("class")) {
            issues.push("No interface or class definition found");
        }
        // Check for method signatures
        if (!code.includes("(") && !code.includes(")")) {
            issues.push("No method signatures found");
        }
        // Check for export statement
        if (!code.includes("export")) {
            issues.push("No export statement found");
        }
        return issues;
    }
    validateTypeSafety(code) {
        const issues = [];
        // Check for any types
        if (code.includes(": any")) {
            issues.push('Avoid using "any" type - use specific types');
        }
        // Check for untyped parameters
        const methodMatches = code.match(/\w+\s*\([^)]*\)/g);
        if (methodMatches) {
            for (const method of methodMatches) {
                if (method.includes("(") && !method.includes(":")) {
                    // This is a simplified check - could be improved
                    issues.push(`Method parameters should be typed: ${method}`);
                }
            }
        }
        return issues;
    }
    validateErrorHandling(code) {
        const issues = [];
        // Check for try-catch blocks
        const tryCount = (code.match(/try\s*{/g) || []).length;
        const catchCount = (code.match(/catch\s*\(/g) || []).length;
        if (tryCount !== catchCount) {
            issues.push("Unmatched try-catch blocks");
        }
        // Check for error propagation
        if (code.includes("async") && !code.includes("await errorHandler")) {
            issues.push("Async methods should use error handler for error tracking");
        }
        return issues;
    }
    async checkSeamStatus(seam) {
        const issues = [];
        let status = "missing";
        try {
            // Check if seam exists in seam manager
            const seamExists = await seamManager.checkAllSeams();
            if (seamExists.success && seamExists.data) {
                const seamConnection = seamExists.data.find((conn) => conn.seamName === seam.name);
                if (seamConnection) {
                    status =
                        seamConnection.status === "connected" ? "implemented" : "stubbed";
                    if (seamConnection.status !== "connected") {
                        issues.push(`Seam ${seam.name} is not fully connected`);
                    }
                }
                else {
                    issues.push(`Seam ${seam.name} not found in seam manager`);
                }
            }
        }
        catch (error) {
            issues.push(`Error checking seam ${seam.name}: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
        return {
            name: seam.name,
            status,
            issues,
        };
    }
    getPatternRecommendation(patternName) {
        const recommendations = {
            "Blueprint Comments": 'Add "// Blueprint:" comments to describe component purposes and methodology',
            ContractResult: "Use ContractResult<T> pattern for all method returns to ensure consistent error handling",
            AgentId: "Include AgentId tracking for seam communication and debugging",
            "Error Handling": "Implement try-catch blocks with proper error propagation",
            NotImplementedError: "Use NotImplementedError for SDD progress tracking in stubs",
            "Seam Communication": "Use seamManager for inter-component communication",
            "Async Patterns": "Use async/await patterns for I/O operations and external calls",
            "Type Safety": "Add explicit type annotations for better code safety",
        };
        return (recommendations[patternName] ||
            `Implement ${patternName} pattern according to SDD methodology`);
    }
    // Blueprint: Health check for validation service
    async healthCheck() {
        try {
            const checks = [];
            // Check pattern initialization
            const patternCount = this.sddPatterns.size;
            checks.push(`✅ SDD patterns loaded: ${patternCount}`);
            // Check compliance rules
            const rulesCount = this.complianceRules.length;
            checks.push(`✅ Compliance rules loaded: ${rulesCount}`);
            // Test Zod validation
            try {
                const testSchema = z.object({ test: z.string() });
                const testResult = await this.validateInput(testSchema, {
                    test: "validation",
                });
                if (testResult.success) {
                    checks.push("✅ Zod validation functional");
                }
                else {
                    checks.push("⚠️ Zod validation issues detected");
                }
            }
            catch {
                checks.push("❌ Zod validation test failed");
            }
            // Check configuration access
            try {
                const configResult = await configManager.isFeatureEnabled("strictMode");
                if (configResult.success) {
                    checks.push("✅ Configuration access working");
                }
                else {
                    checks.push("⚠️ Configuration access issues");
                }
            }
            catch {
                checks.push("❌ Configuration access failed");
            }
            const healthStatus = checks.join("\n");
            const isHealthy = !checks.some((check) => check.includes("❌"));
            return {
                success: isHealthy,
                data: healthStatus,
                error: isHealthy ? undefined : "Some validation issues detected",
                agentId: this.agentId,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                success: false,
                error: `Health check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
                agentId: this.agentId,
                timestamp: new Date().toISOString(),
            };
        }
    }
}
// Export singleton instance
export const validationEngine = new ValidationEngine();
//# sourceMappingURL=validation-engine.js.map