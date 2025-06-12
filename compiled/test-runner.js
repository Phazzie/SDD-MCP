/**
 * Simple Seam Test Runner
 */
import { seamTester } from "./tests/seam-integration.test.js";
async function runSeamTests() {
    try {
        console.log("🧪 Starting Seam Integration Tests...\n");
        const result = await seamTester.runAllSeamTests();
        console.log("\n📊 Test Results:");
        if (result.data) {
            result.data.forEach((line) => console.log("  " + line));
        }
        console.log("\n" + "=".repeat(60));
        if (result.success) {
            console.log("🎉 ALL SEAMS OPERATIONAL! Ready for agent implementation.");
        }
        else {
            console.log("⚠️  Some seams need attention before implementing agents.");
            console.log("   This is expected since we're testing connections before implementation.");
        }
        console.log("=".repeat(60));
    }
    catch (error) {
        console.error("❌ Test runner failed:", error);
    }
}
runSeamTests();
//# sourceMappingURL=test-runner.js.map