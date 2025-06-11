/**
 * Test the CreateStub seam connection
 */

// Test data that matches what the tool expects
const testInput = {
  contractCode:
    "interface TestContract { doSomething(): Promise<ContractResult<string>>; }",
  componentName: "TestComponent",
  contractName: "TestContract",
  methods: [
    {
      name: "doSomething",
      parameters: [],
      returnType: "string",
      description: "Test method",
    },
  ],
  namespace: "test",
};

// Import the seam manager
import { seamManager } from "./src/seams.js";

console.log("🔧 Testing CreateStub Seam Connection");
console.log("Input:", JSON.stringify(testInput, null, 2));

// Test the seam
seamManager
  .executeSeam("CreateStub", testInput)
  .then((result) => {
    console.log("\n🎯 SEAM EXECUTION RESULT:");
    console.log("Success:", result.success);
    if (result.success) {
      console.log("✅ Seam connected successfully!");
      console.log("Stub code length:", result.data?.stubCode?.length || 0);
      console.log("File path suggestion:", result.data?.filePathSuggestion);
    } else {
      console.log("❌ Seam execution failed:", result.error);
    }
  })
  .catch((error) => {
    console.log("❌ Test failed:", error.message);
  });
