#!/usr/bin/env node
/**
 * SDD Phase 1 Test: Enhanced Seam Analysis Replacement
 * Test that enhanced_seam_analysis properly replaces sdd_analyze_requirements
 */

console.log("🧪 Testing Phase 1: Enhanced Seam Analysis Replacement");

async function testEnhancedSeamAnalysis() {
  try {
    // Test that enhanced tool can handle basic requirements text
    const { handleEnhancedSeamAnalysis } = await import(
      "./dist/tools/enhanced-seam-analysis-tool.js"
    );

    const testInput = {
      requirementsText:
        "Build a user authentication system with login, logout, and password reset functionality.",
      analysisDepth: "basic",
    };

    console.log("📝 Test Input:", testInput);

    const result = await handleEnhancedSeamAnalysis(testInput);

    console.log("✅ Test Result:", result.success ? "SUCCESS" : "FAILED");

    if (result.success) {
      console.log(
        "📊 Enhanced Analysis Data:",
        JSON.stringify(result.data, null, 2)
      );
    } else {
      console.log("❌ Error:", result.error);
    }

    console.log(
      "\n🎯 Phase 1 Seam Connection Test: " +
        (result.success ? "✅ WORKING" : "❌ FAILED")
    );
  } catch (error) {
    console.log("❌ Test Failed:", error.message);
    console.log("🎯 Phase 1 Seam Connection Test: ❌ FAILED");
  }
}

testEnhancedSeamAnalysis();
