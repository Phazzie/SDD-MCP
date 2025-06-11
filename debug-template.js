/**
 * Debug script to isolate the template parsing issue
 */

import { TemplateProcessor } from "./dist/template-processor.js";

async function debugTemplate() {
  console.log("🔍 Debugging template parsing issue...\n");

  const templateProcessor = new TemplateProcessor();

  // Test minimal context first
  console.log("📝 Testing with minimal context...");
  try {
    const minimalContext = {
      seamManagerClassName: "TestSeamManager",
      seamManagerFileName: "test.seam-manager",
      agentId: "test-001",
      contractResultImportPath: "./types.js",
      notImplementedErrorImportPath: "./errors.js",
      baseAgentInterfaceName: "IAgentBase",
      baseAgentInterfaceImportPath: "./base.js",
      agentsToImport: [],
      agentsToRegisterAtConstruction: [],
      useCircuitBreaker: false,
      circuitBreakerConfig: {},
    };

    const result = await templateProcessor.generateFromTemplate(
      "seam-manager.handlebars",
      minimalContext
    );
    console.log("✅ Minimal context - SUCCESS");
    console.log(`   Generated ${result.length} characters\n`);
  } catch (error) {
    console.log("❌ Minimal context - FAILED");
    console.log(`   Error: ${error.message}\n`);
  }

  // Test with one agent
  console.log("📝 Testing with one agent...");
  try {
    const oneAgentContext = {
      seamManagerClassName: "TestSeamManager",
      seamManagerFileName: "test.seam-manager",
      agentId: "test-001",
      contractResultImportPath: "./types.js",
      notImplementedErrorImportPath: "./errors.js",
      baseAgentInterfaceName: "IAgentBase",
      baseAgentInterfaceImportPath: "./base.js",
      agentsToImport: [
        { componentName: "UserAgent", importPath: "./agents/user.agent" },
      ],
      agentsToRegisterAtConstruction: [
        { componentName: "UserAgent", camelCaseName: "userAgent" },
      ],
      useCircuitBreaker: false,
      circuitBreakerConfig: {},
    };

    const result = await templateProcessor.generateFromTemplate(
      "seam-manager.handlebars",
      oneAgentContext
    );
    console.log("✅ One agent context - SUCCESS");
    console.log(`   Generated ${result.length} characters\n`);
  } catch (error) {
    console.log("❌ One agent context - FAILED");
    console.log(`   Error: ${error.message}\n`);
  }

  // Test with circuit breaker enabled
  console.log("📝 Testing with circuit breaker...");
  try {
    const circuitBreakerContext = {
      seamManagerClassName: "TestSeamManager",
      seamManagerFileName: "test.seam-manager",
      agentId: "test-001",
      contractResultImportPath: "./types.js",
      notImplementedErrorImportPath: "./errors.js",
      baseAgentInterfaceName: "IAgentBase",
      baseAgentInterfaceImportPath: "./base.js",
      agentsToImport: [],
      agentsToRegisterAtConstruction: [],
      useCircuitBreaker: true,
      circuitBreakerConfig: {
        errorThresholdPercentage: 50,
        resetTimeoutMs: 30000,
        minRequestsForEval: 5,
        openStateTimeoutMs: 60000,
      },
    };

    const result = await templateProcessor.generateFromTemplate(
      "seam-manager.handlebars",
      circuitBreakerContext
    );
    console.log("✅ Circuit breaker context - SUCCESS");
    console.log(`   Generated ${result.length} characters\n`);
  } catch (error) {
    console.log("❌ Circuit breaker context - FAILED");
    console.log(`   Error: ${error.message}\n`);
  }
}

// Run the debug
debugTemplate().catch(console.error);
