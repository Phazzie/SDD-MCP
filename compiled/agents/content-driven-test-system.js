/**
 * Content-Driven Infrastructure Testing System
 * Integrates Gemini's test scenarios with Copilot's utilities
 * Following SDD: Content-Infrastructure Seam + Test-Execution Seam
 */
import { DevUtilities } from "./dev-utilities.js";
import { EnhancedSeamAnalyzerWithUtilities } from "./enhanced-seam-analyzer-with-utilities.js";
import { PerformanceTracker } from "./performance-tracker.js";
// 💰 HIGH_ROI: Reuse existing foundation with Gemini's content
export class ContentDrivenTestSystem {
    devUtils;
    performanceTracker;
    analyzerWithUtils;
    testScenarios = [];
    constructor() {
        this.devUtils = new DevUtilities("content-driven-test-system-001");
        this.performanceTracker = new PerformanceTracker("content-driven-test-system-001");
        this.analyzerWithUtils = new EnhancedSeamAnalyzerWithUtilities();
    }
    // 🎯 CRITICAL: Load Gemini's refined test scenarios
    async loadGeminiTestScenarios() {
        try {
            this.testScenarios = [
                // Error Test Cases from Gemini (refined for actual SDDError structure)
                {
                    id: "error-001",
                    name: "analyzeRequirementsEnhanced - Empty Requirements Text",
                    category: "error",
                    input: { requirementsText: "" },
                    expectedOutcome: {
                        success: false,
                        error: {
                            category: "ValidationError",
                            messageContains: "Requirements text is required",
                            suggestionsInclude: ["Provide a non-empty requirements text"],
                            severity: "high",
                        },
                    },
                },
                {
                    id: "error-002",
                    name: "analyzeRequirementsEnhanced - Requirements Too Vague",
                    category: "error",
                    input: { requirementsText: "A system." },
                    expectedOutcome: {
                        success: false,
                        error: {
                            category: "ValidationError",
                            messageContains: "too vague or short",
                            suggestionsInclude: ["elaborate on the system's components"],
                            severity: "medium",
                        },
                    },
                },
                {
                    id: "error-003",
                    name: "generateInteractionMatrix - Empty Components List",
                    category: "error",
                    input: {
                        components: [],
                        requirements: "User calls API.",
                    },
                    expectedOutcome: {
                        success: false,
                        error: {
                            category: "ValidationError",
                            messageContains: "Components list is required",
                            suggestionsInclude: ["provide a list of component names"],
                            severity: "high",
                        },
                    },
                },
                // Performance Test Cases from Gemini
                {
                    id: "perf-001",
                    name: "analyzeRequirementsEnhanced - Simple Performance",
                    category: "performance",
                    input: {
                        requirementsText: "The User Service authenticates a User via the Auth API.",
                    },
                    expectedOutcome: {
                        success: true,
                        performance: {
                            maxDurationMs: 50,
                            operation: "analyzeRequirementsEnhanced-simple",
                        },
                    },
                },
                {
                    id: "perf-002",
                    name: "analyzeRequirementsEnhanced - Medium Performance",
                    category: "performance",
                    input: {
                        requirementsText: "An e-commerce system where the User browses products via the ProductCatalog service. When they add items to cart, the CartService manages the cart state. During checkout, the OrderService coordinates with the PaymentGateway for processing and the InventoryService for stock validation. After successful payment, the NotificationService sends confirmation emails and the FulfillmentService initiates shipping.",
                    },
                    expectedOutcome: {
                        success: true,
                        performance: {
                            maxDurationMs: 500,
                            operation: "analyzeRequirementsEnhanced-medium",
                        },
                    },
                },
                // Integration Test Cases combining content + infrastructure
                {
                    id: "integration-001",
                    name: "Full Pipeline with Debug Logging",
                    category: "integration",
                    input: {
                        requirementsText: "The UserService validates credentials with AuthAPI and logs events to AuditService.",
                    },
                    expectedOutcome: {
                        success: true,
                        integration: {
                            requiresUtilities: ["DevUtilities", "PerformanceTracker"],
                            expectedLogs: ["SeamExecution", "started", "success"],
                        },
                    },
                },
            ];
            await this.devUtils.logSeamExecution("ContentDrivenTestSystem.loadGeminiTestScenarios", "success", { scenariosLoaded: this.testScenarios.length });
            return { success: true, data: undefined };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    category: "ProcessingError",
                    message: "Failed to load Gemini test scenarios",
                    agentId: "content-driven-test-system-001",
                    timestamp: new Date().toISOString(),
                    details: {
                        originalError: error instanceof Error ? error.message : String(error),
                    },
                    suggestions: [
                        "Check test scenario definitions",
                        "Verify input structures match contracts",
                    ],
                    severity: "high",
                },
            };
        }
    }
    // ⚡ QUICK_WIN: Execute single scenario with full utility integration
    async executeScenario(scenario) {
        try {
            await this.devUtils.logSeamExecution(`ContentDrivenTestSystem.executeScenario.${scenario.id}`, "started", { scenarioName: scenario.name, category: scenario.category });
            // Enable tracking for this execution
            await this.analyzerWithUtils.enableDebugLogging(true);
            await this.analyzerWithUtils.enablePerformanceTracking(true);
            let executionResult;
            let performanceData = null; // 🔨 HARD_WORK: Route to appropriate analyzer method based on input type
            if (scenario.category === "performance") {
                // Use DevUtilities.measurePerformance for performance scenarios
                const perfResult = await this.devUtils.measurePerformance(async () => {
                    if (this.isSeamAnalysisInput(scenario.input)) {
                        return await this.analyzerWithUtils.analyzeSeamsWithTracking(scenario.input);
                    }
                    else if (this.isInteractionMatrixInput(scenario.input)) {
                        return await this.analyzerWithUtils.generateInteractionMatrixWithTracking(scenario.input);
                    }
                    else {
                        throw new Error(`Unsupported input type for scenario ${scenario.id}`);
                    }
                });
                if (perfResult.success && perfResult.data) {
                    executionResult = { success: true, data: perfResult.data.result };
                    performanceData = { durationMs: perfResult.data.timeMs };
                }
                else {
                    executionResult = { success: false, error: perfResult.error };
                }
            }
            else {
                // Regular execution for error and integration tests
                if (this.isSeamAnalysisInput(scenario.input)) {
                    executionResult =
                        await this.analyzerWithUtils.analyzeSeamsWithTracking(scenario.input);
                }
                else if (this.isInteractionMatrixInput(scenario.input)) {
                    executionResult =
                        await this.analyzerWithUtils.generateInteractionMatrixWithTracking(scenario.input);
                }
                else {
                    throw new Error(`Unsupported input type for scenario ${scenario.id}`);
                }
            } // 🛡️ DEFENSIVE: Validate execution against expected outcome
            const complianceResult = await this.devUtils.validateContractCompliance(executionResult, { success: "boolean", data: "any" });
            const complianceReport = complianceResult.success
                ? complianceResult.data
                : null;
            // Get debug report for integration scenarios
            let debugReport = null;
            if (scenario.category === "integration") {
                const debugResult = await this.devUtils.generateDebugReport();
                debugReport = debugResult.success ? debugResult.data : null;
            }
            const result = {
                scenario,
                executionResult,
                performanceData,
                complianceReport,
                debugReport,
            };
            await this.devUtils.logSeamExecution(`ContentDrivenTestSystem.executeScenario.${scenario.id}`, "success", {
                executionSuccess: executionResult.success,
                compliance: complianceReport?.isValid || false,
            });
            return { success: true, data: result };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    category: "ProcessingError",
                    message: `Failed to execute scenario ${scenario.id}`,
                    agentId: "content-driven-test-system-001",
                    timestamp: new Date().toISOString(),
                    details: {
                        scenarioId: scenario.id,
                        originalError: error instanceof Error ? error.message : String(error),
                    },
                    suggestions: [
                        "Check scenario input format",
                        "Verify analyzer utilities are working",
                    ],
                    severity: "medium",
                },
            };
        }
    }
    // 🧪 EXPERIMENTAL: Execute all scenarios and generate comprehensive report
    async executeAllScenarios() {
        try {
            const results = [];
            let passedScenarios = 0;
            let failedScenarios = 0;
            await this.devUtils.logSeamExecution("ContentDrivenTestSystem.executeAllScenarios", "started", { totalScenarios: this.testScenarios.length });
            // Execute each scenario
            for (const scenario of this.testScenarios) {
                const result = await this.executeScenario(scenario);
                if (result.success && result.data) {
                    results.push(result.data);
                    // Validate against expected outcome
                    const isValid = this.validateScenarioResult(result.data);
                    if (isValid) {
                        passedScenarios++;
                    }
                    else {
                        failedScenarios++;
                    }
                }
                else {
                    failedScenarios++;
                }
            }
            // Get overall performance data
            const performanceReport = await this.performanceTracker.getPerformanceReport();
            const overallPerformance = performanceReport.success
                ? performanceReport.data
                : null;
            // Generate system health assessment
            const passRate = passedScenarios / this.testScenarios.length;
            let systemHealth;
            if (passRate >= 0.95)
                systemHealth = "excellent";
            else if (passRate >= 0.85)
                systemHealth = "good";
            else if (passRate >= 0.7)
                systemHealth = "warning";
            else
                systemHealth = "critical";
            // Generate recommendations based on Gemini's content
            const recommendations = this.generateRecommendations(results, systemHealth);
            const report = {
                totalScenarios: this.testScenarios.length,
                passedScenarios,
                failedScenarios,
                results,
                overallPerformance,
                systemHealth,
                recommendations,
            };
            await this.devUtils.logSeamExecution("ContentDrivenTestSystem.executeAllScenarios", "success", {
                passRate: `${passedScenarios}/${this.testScenarios.length}`,
                systemHealth,
            });
            return { success: true, data: report };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    category: "ProcessingError",
                    message: "Failed to execute all test scenarios",
                    agentId: "content-driven-test-system-001",
                    timestamp: new Date().toISOString(),
                    details: {
                        originalError: error instanceof Error ? error.message : String(error),
                    },
                    suggestions: [
                        "Check individual scenario execution",
                        "Review system resources",
                    ],
                    severity: "high",
                },
            };
        }
    }
    // 🔄 REFACTOR: Helper methods for type checking and validation
    isSeamAnalysisInput(input) {
        return input && typeof input.requirementsText === "string";
    }
    isInteractionMatrixInput(input) {
        return (input &&
            Array.isArray(input.components) &&
            typeof input.requirements === "string");
    }
    validateScenarioResult(result) {
        const { scenario, executionResult, performanceData } = result;
        const expected = scenario.expectedOutcome;
        // Validate success/failure expectation
        if (executionResult.success !== expected.success) {
            return false;
        }
        // Validate error expectations (using Gemini's refined error structure)
        if (!expected.success && expected.error) {
            if (!executionResult.error)
                return false;
            const error = executionResult.error;
            if (error.category !== expected.error.category)
                return false;
            if (!error.message?.includes(expected.error.messageContains))
                return false;
            if (error.severity !== expected.error.severity)
                return false;
            // Check if any expected suggestions are present
            const hasSuggestions = expected.error.suggestionsInclude.some((expectedSuggestion) => error.suggestions?.some((actualSuggestion) => actualSuggestion.includes(expectedSuggestion)));
            if (!hasSuggestions)
                return false;
        }
        // Validate performance expectations (using Gemini's performance criteria)
        if (expected.performance && performanceData) {
            if (performanceData.durationMs > expected.performance.maxDurationMs) {
                return false;
            }
        }
        return true;
    }
    generateRecommendations(results, systemHealth) {
        const recommendations = [];
        // Analysis based on Gemini's content and my utilities
        const errorResults = results.filter((r) => r.scenario.category === "error");
        const performanceResults = results.filter((r) => r.scenario.category === "performance");
        if (systemHealth === "critical" || systemHealth === "warning") {
            recommendations.push("Review failed scenarios and address validation errors");
            recommendations.push("Check error message suggestions for guidance on fixing inputs");
        }
        const slowPerformanceResults = performanceResults.filter((r) => r.performanceData &&
            r.performanceData.durationMs >
                (r.scenario.expectedOutcome.performance?.maxDurationMs || 1000));
        if (slowPerformanceResults.length > 0) {
            recommendations.push("Performance optimization needed for slow operations");
            recommendations.push("Use PerformanceTracker to identify bottlenecks");
        }
        if (results.some((r) => !r.complianceReport?.isCompliant)) {
            recommendations.push("Contract compliance issues detected - review ContractResult structures");
        }
        return recommendations;
    }
}
//# sourceMappingURL=content-driven-test-system.js.map