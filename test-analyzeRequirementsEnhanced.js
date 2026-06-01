/**
 * Quick test for analyzeRequirementsEnhanced implementation
 * Tests the NLP-based pattern recognition functionality
 */

const { EnhancedSeamAnalyzerStub } = require("./src/stubs.js");

async function testAnalyzeRequirementsEnhanced() {
  console.log("🧪 Testing analyzeRequirementsEnhanced implementation...\n");

  const analyzer = new EnhancedSeamAnalyzerStub();

  // Test case 1: Simple requirements text
  const testInput = {
    requirementsText: `
      The user authentication system needs to validate user credentials against the database.
      The API gateway receives requests from the client and forwards them to the order service.
      The payment processor handles transactions and sends notifications to the user.
      All components must implement logging and error handling for security compliance.
    `,
    designNotes: "Focus on secure data flow and API communications",
  };

  try {
    console.log("📝 Input:", testInput.requirementsText.trim());
    console.log("\n🔄 Processing...\n");

    const result = await analyzer.analyzeRequirementsEnhanced(testInput);

    if (result.success) {
      console.log("✅ SUCCESS! Enhanced Analysis Results:");
      console.log("=====================================");
      console.log(`🎯 Identified Seams: ${result.data.identifiedSeams.length}`);
      console.log(
        `🔗 Component Interactions: ${result.data.componentInteractions.length}`
      );
      console.log(`📊 Data Flows: ${result.data.dataFlows.length}`);
      console.log(
        `⚡ Cross-cutting Concerns: ${result.data.crossCuttingConcerns.length}`
      );
      console.log(
        `📈 Confidence Score: ${result.data.analysisMetadata.confidence.toFixed(
          2
        )}`
      );
      console.log(
        `🔍 Patterns Found: ${result.data.analysisMetadata.patternsFound.join(
          ", "
        )}`
      );

      console.log("\n📋 Sample Identified Seams:");
      result.data.identifiedSeams.slice(0, 3).forEach((seam, i) => {
        console.log(
          `  ${i + 1}. ${seam.name} (${seam.participants.join(" ↔ ")})`
        );
      });

      console.log("\n🔗 Sample Component Interactions:");
      result.data.componentInteractions
        .slice(0, 3)
        .forEach((interaction, i) => {
          console.log(
            `  ${i + 1}. ${interaction.from} → ${interaction.to} (${
              interaction.interactionType
            })`
          );
        });
    } else {
      console.log("❌ FAILED:", result.error);
    }
  } catch (error) {
    console.log("💥 ERROR:", error.message);
  }
}

// Test edge cases
async function testEdgeCases() {
  console.log("\n🛡️ Testing edge cases...\n");

  const analyzer = new EnhancedSeamAnalyzerStub();

  // Test empty input
  const emptyResult = await analyzer.analyzeRequirementsEnhanced({
    requirementsText: "",
  });
  console.log(
    "Empty input test:",
    emptyResult.success ? "❌ Should fail" : "✅ Correctly failed"
  );

  // Test minimal input
  const minimalResult = await analyzer.analyzeRequirementsEnhanced({
    requirementsText: "User sends data to system.",
  });
  console.log(
    "Minimal input test:",
    minimalResult.success ? "✅ Handled gracefully" : "❌ Should work"
  );
}

// Run tests
if (require.main === module) {
  testAnalyzeRequirementsEnhanced()
    .then(() => testEdgeCases())
    .then(() => console.log("\n🎉 Test completed!"))
    .catch(console.error);
}

module.exports = { testAnalyzeRequirementsEnhanced, testEdgeCases };
