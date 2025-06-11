// Direct tool test
import { SDDVisualizeArchitectureTool } from "./src/tools/legacy/sdd-visualize-architecture-tool.js";

const tool = new SDDVisualizeArchitectureTool();

const testInput = {
  seams: [
    {
      name: "UserAuthentication",
      participants: ["AuthService", "UserManager"],
      dataFlow: "BOTH",
      purpose: "Handle user login and session management",
      status: "complete",
    },
  ],
  projectName: "TestProject",
  diagramType: "flowchart",
};

console.log("🔧 Testing Tool Directly");

try {
  const result = await tool.execute(testInput);
  console.log("Success:", result.success);
  console.log("Error:", result.error);
} catch (error) {
  console.error("Tool test failed:", error.message);
}
