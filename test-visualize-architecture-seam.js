// Test VisualizeArchitecture Seam Connection
import { seamManager } from "./dist/seams.js";

const testInput = {
  seams: [
    {
      name: "UserAuthentication",
      participants: ["AuthService", "UserManager"],
      dataFlow: "BOTH",
      purpose: "Handle user login and session management",
      status: "complete",
    },
    {
      name: "DataProcessing",
      participants: ["DataProcessor", "DatabaseManager"],
      dataFlow: "IN",
      purpose: "Process and store user data",
      status: "partial",
    },
    {
      name: "ReportGeneration",
      participants: ["ReportService", "TemplateEngine"],
      dataFlow: "OUT",
      purpose: "Generate user reports and analytics",
      status: "stub",
    },
  ],
  projectName: "UserManagementSystem",
  diagramType: "flowchart",
};

console.log("🔧 Testing VisualizeArchitecture Seam Connection");
console.log("Input seams:", testInput.seams.length);
console.log("Project:", testInput.projectName);

try {
  const result = await seamManager.executeSeam(
    "VisualizeArchitecture",
    testInput
  );
  console.log("🎯 SEAM EXECUTION RESULT:");
  console.log("Success:", result.success);
  if (!result.success) {
    console.log("❌ Seam execution failed:", result.error);
  } else {
    console.log("✅ Seam connection working!");
    console.log("Mermaid diagram generated:", !!result.data?.mermaidDiagram);
    console.log(
      "Textual description length:",
      result.data?.textualDescription?.length || 0
    );
    console.log(
      "Component summary count:",
      result.data?.componentSummary?.length || 0
    );

    if (result.data?.mermaidDiagram) {
      console.log("\n📊 MERMAID DIAGRAM PREVIEW:");
      console.log(result.data.mermaidDiagram.substring(0, 200) + "...");
    }

    if (result.data?.componentSummary?.length > 0) {
      console.log("\n🔗 COMPONENT SUMMARY:");
      result.data.componentSummary.forEach((comp) => {
        console.log(
          `  - ${comp.name}: ${comp.connections} connections, status: ${comp.status}`
        );
      });
    }

    if (result.data?.mermaidCode) {
      console.log("\n📊 GENERATED MERMAID CODE:");
      console.log("---");
      console.log(result.data.mermaidCode.substring(0, 300) + "...");
      console.log("---");
    }
  }
} catch (error) {
  console.error("💥 Seam test failed:", error.message);
}
