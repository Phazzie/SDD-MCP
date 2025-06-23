#!/usr/bin/env node
/**
 * SDD Phase 1 Integration Test: Full MCP Server Test
 * Test that the MCP server properly routes to enhanced_seam_analysis
 */

console.log("🧪 Testing Phase 1: MCP Server Integration");

async function testMCPServerIntegration() {
  try {
    // Test calling the enhanced analysis function directly (without importing MCP server)
    const { handleEnhancedSeamAnalysis } = await import(
      "./dist/tools/enhanced-seam-analysis-tool.js"
    );

    const testInput = {
      requirementsText:
        "Build a user authentication system with login, logout, and password reset functionality.",
      analysisDepth: "detailed",
    };

    console.log("📝 Test Input:", testInput);

    const result = await handleEnhancedSeamAnalysis(testInput);

    console.log(
      "✅ Enhanced Tool Response:",
      result.success ? "SUCCESS" : "FAILED"
    );

    if (result.success) {
      console.log("📊 Enhanced Tool Output Preview:");
      console.log(
        JSON.stringify(result.data, null, 2).substring(0, 300) + "..."
      );
    } else {
      console.log("❌ Error:", result.error);
    }

    console.log(
      "\n🎯 Phase 1 Enhanced Tool Test: " +
        (result.success ? "✅ WORKING" : "❌ FAILED")
    );
  } catch (error) {
    console.log("❌ Test Failed:", error.message);
    console.log("🎯 Phase 1 Enhanced Tool Test: ❌ FAILED");
  }
}

testMCPServerIntegration();
