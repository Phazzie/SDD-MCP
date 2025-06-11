Q;
/**
 * 🎯 CRITICAL TEST: Verify Orchestrator → Seam Manager → Tool Connection
 */

console.log("🔍 Starting connection test...");

async function testSeamConnection() {
  try {
    console.log("� Importing seam manager...");
    const { seamManager } = await import("./src/seams.js");
    console.log("✅ Seam manager imported:", !!seamManager);

    console.log("🔗 Testing executeSeam method...");
    const testData = { type: "stub", componentName: "Test" };
    const result = await seamManager.executeSeam(
      "TemplateProcessing",
      testData
    );

    console.log("📊 Result:", {
      success: result.success,
      hasData: !!result.data,
      error: result.error,
    });
  } catch (error) {
    console.log("❌ Error:", error.message);
    console.log("Stack:", error.stack);
  }
}

testSeamConnection();
