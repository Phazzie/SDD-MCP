/**
 * Quick Integration Test - Verify Gemini Enhanced Seam Analyzer Integration
 * Tests all 4 core intelligence methods from Tasks 1.1-1.4
 */

import { EnhancedSeamAnalyzer } from "./dist/agents/enhanced-seam-analyzer.js";

async function testEnhancedSeamAnalyzer() {
  console.log("🧪 Testing Enhanced Seam Analyzer Integration...\n");

  const analyzer = new EnhancedSeamAnalyzer("test-integration");

  // Test 1.1: analyzeRequirementsEnhanced
  console.log("🎯 Test 1.1: Analyzing Requirements Enhanced");
  try {
    const prd =
      "Build a user authentication system with login, registration, and password reset functionality.";
    const result1 = await analyzer.analyzeRequirementsEnhanced({
      requirementsText: prd,
    });
    console.log(`✅ Result: ${result1.success ? "SUCCESS" : "FAILED"}`);
    if (result1.data) {
      console.log(
        `   Seams Found: ${result1.data.identifiedSeams?.length || 0}`
      );
      console.log(`   Interactions: ${result1.data.interactions?.length || 0}`);
    }
    if (result1.error) {
      console.log(`   Error Details: ${result1.error.message}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    console.log(`   Stack: ${error.stack?.split("\n")[1] || "No stack"}`);
  }

  // Test 1.2: generateInteractionMatrix
  console.log("\n🎯 Test 1.2: Generate Interaction Matrix");
  try {
    const components = ["UserAgent", "AuthService", "EmailService"];
    const result2 = await analyzer.generateInteractionMatrix({ components });
    console.log(`✅ Result: ${result2.success ? "SUCCESS" : "FAILED"}`);
    if (result2.data) {
      console.log(
        `   Matrix Size: ${Object.keys(result2.data.matrix || {}).length}`
      );
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  // Test 1.3: analyzeDataFlows
  console.log("\n🎯 Test 1.3: Analyze Data Flows");
  try {
    const result3 = await analyzer.analyzeDataFlows({
      requirements:
        "Build a user authentication system with login, registration, and password reset functionality.",
      components: ["UserAgent", "AuthService", "EmailService"],
    });
    console.log(`✅ Result: ${result3.success ? "SUCCESS" : "FAILED"}`);
    if (result3.data) {
      console.log(
        `   Flow Chains: ${result3.data.transformationChains?.length || 0}`
      );
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  // Test 1.4: validateSeamReadiness
  console.log("\n🎯 Test 1.4: Validate Seam Readiness");
  try {
    const result4 = await analyzer.validateSeamReadiness({
      seams: [
        {
          name: "AuthenticationSeam",
          participants: ["UserAgent", "AuthService"],
          dataFlow: "BOTH",
          purpose: "Handle user authentication",
          contractInterface: "AuthContract",
        },
      ],
      requirements:
        "Build a user authentication system with login, registration, and password reset functionality.",
    });
    console.log(`✅ Result: ${result4.success ? "SUCCESS" : "FAILED"}`);
    if (result4.data) {
      console.log(`   Validation Score: ${result4.data.validationScore || 0}`);
      console.log(`   Ready: ${result4.data.isReady ? "YES" : "NO"}`);
    }
    if (result4.error) {
      console.log(`   Error Details: ${result4.error.message}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  console.log("\n🎉 Enhanced Seam Analyzer Integration Test Complete!");
}

// Run the test
testEnhancedSeamAnalyzer().catch(console.error);
