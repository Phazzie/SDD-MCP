/**
 * Quick test of template-first architecture
 */

import { TemplateProcessor } from "./dist/template-processor.js";

async function testTemplateProcessor() {
  console.log("🧪 Testing Template-First SDD Architecture...\n");

  const templateProcessor = new TemplateProcessor("./templates");

  const testSeam = {
    name: "User Authentication Seam",
    participants: ["OrchestratorAgent", "UserAuthAgent"],
    dataFlow: "BOTH",
    purpose: "Handle user authentication and session management",
    contractInterface: "IUserAuthContract",
  };

  try {
    console.log("⚡ Generating templates for:", testSeam.name);
    const generated = await templateProcessor.generateFromSeam(testSeam);

    console.log("\n✅ Contract Template Generated:");
    console.log("📄 File:", generated.fileName);
    console.log("🏷️  Component:", generated.templateContext.componentName);
    console.log("⚡ Priority:", generated.templateContext.priority);
    console.log(
      "⏱️  Estimated Effort:",
      generated.templateContext.estimatedEffort
    );
    console.log(
      "📦 Dependencies:",
      generated.templateContext.dependencies.join(", ")
    );

    console.log("\n🔨 Contract Code Preview:");
    console.log(generated.contractCode.substring(0, 500) + "...");

    console.log("\n📋 Checklist Preview:");
    console.log(generated.checklistMarkdown.substring(0, 400) + "...");

    console.log("\n🎯 Template-First Architecture Working! ✅");
  } catch (error) {
    console.error("❌ Template processing failed:", error);
  }
}

testTemplateProcessor();
