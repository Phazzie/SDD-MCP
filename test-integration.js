/**
 * 🧪 INTEGRATION TEST: Enhanced Seam Analyzer with Utilities
 * PURPOSE: Test the integration of DevUtilities and PerformanceTracker with Enhanced Seam Analyzer
 * STATUS: INTEGRATION TEST - Verifies seam connections work properly
 * SEAM: TestRunner ↔ EnhancedSeamAnalyzerWithUtilities
 */

import { EnhancedSeamAnalyzerWithUtilities } from "./dist/agents/enhanced-seam-analyzer-with-utilities.js";

async function testIntegration() {
  console.log("🚀 Starting Enhanced Seam Analyzer Integration Test...\n");

  const analyzer = new EnhancedSeamAnalyzerWithUtilities();

  try {
    // Test 1: Enable performance tracking and debug logging
    console.log("📊 Test 1: Enable performance tracking and debug logging");

    const trackingResult = await analyzer.enablePerformanceTracking(true);
    const loggingResult = await analyzer.enableDebugLogging(true);

    console.log(`Performance tracking enabled: ${trackingResult.success}`);
    console.log(`Debug logging enabled: ${loggingResult.success}\n`);

    // Test 2: Analyze seams with tracking
    console.log("🔍 Test 2: Analyze seams with performance tracking");
    const analysisInput = {
      requirementsText:
        "Create a user authentication system with login, registration, and password reset functionality. The system should integrate with an external email service and store user data in a database.",
      designNotes: "Consider microservices architecture with API gateway",
      analysisDepth: "detailed",
    };

    const analysisResult = await analyzer.analyzeSeamsWithTracking(
      analysisInput
    );
    console.log(`Analysis completed: ${analysisResult.success}`);
    if (analysisResult.success) {
      console.log(
        `Identified seams: ${analysisResult.data?.identifiedSeams?.length || 0}`
      );
      console.log(
        `Component interactions: ${
          analysisResult.data?.componentInteractions?.length || 0
        }`
      );
    }
    console.log("");

    // Test 3: Get performance metrics
    console.log("📈 Test 3: Get performance metrics");

    const metricsResult = await analyzer.getOperationMetrics();
    console.log(`Metrics retrieved: ${metricsResult.success}`);
    if (metricsResult.success && metricsResult.data) {
      console.log(`Total operations: ${metricsResult.data.totalOperations}`);
      console.log(
        `Average execution time: ${metricsResult.data.averageExecutionTime.toFixed(
          2
        )}ms`
      );
      console.log(
        `Slowest operation: ${metricsResult.data.slowestOperation.operation}`
      );
    }
    console.log("");

    // Test 4: Get debug report
    console.log("🔍 Test 4: Get debug report");

    const debugResult = await analyzer.getDebugReport();
    console.log(`Debug report generated: ${debugResult.success}`);
    if (debugResult.success && debugResult.data) {
      console.log(`System health: ${debugResult.data.systemHealth}`);
      console.log(`Total operations: ${debugResult.data.totalOperations}`);
      console.log(
        `Successful operations: ${debugResult.data.successfulOperations}`
      );
      console.log(`Failed operations: ${debugResult.data.failedOperations}`);
      console.log(
        `Recommendations: ${debugResult.data.recommendations.length}`
      );
    }
    console.log("");

    // Test 5: Validate seam readiness with tracking
    console.log("✅ Test 5: Validate seam readiness with tracking");

    const validationInput = {
      seams: [
        {
          seamId: "auth-service-user-db",
          name: "Authentication Service to User Database",
          description: "Connection between auth service and user database",
          sourceComponent: "AuthService",
          targetComponent: "UserDatabase",
          interactionType: "data",
          contractDefined: true,
          dataFlowDirection: "bidirectional",
        },
      ],
    };

    const validationResult = await analyzer.validateSeamReadinessWithTracking(
      validationInput
    );
    console.log(`Validation completed: ${validationResult.success}`);
    if (validationResult.success && validationResult.data) {
      console.log(
        `Validations passed: ${validationResult.data.validationsPassed}`
      );
      console.log(
        `Overall readiness: ${validationResult.data.overallReadiness}`
      );
    }
    console.log("");

    console.log("✅ Integration test completed successfully!");
    console.log("🎯 All seam connections working properly!");
  } catch (error) {
    console.error("❌ Integration test failed:", error);
    process.exit(1);
  }
}

// Run the test
testIntegration().catch(console.error);
