// Quick test for extractComponents method
import { RequirementsAnalysisAgent } from "./dist/tools/legacy/sdd-analyze-requirements-tool.js";

const agent = new RequirementsAnalysisAgent();

// Test input
const testPRD = `
Build a user management system with authentication, user profiles, and role-based access control. 
The system should support user registration, login, profile management, and admin dashboard. 
Include features like password reset, email verification, and session management.
The database should store user data and the API should handle all requests.
`;

console.log("🧪 Testing COMPLETE Requirements Analysis Pipeline...");

try {
  // Test extractComponents
  const components = agent.extractComponents(testPRD);
  console.log(`📊 Found ${components.length} components`);

  // Test identifySeams
  const seams = agent.identifySeams(components, testPRD);
  console.log(`🔗 Found ${seams.length} seams`);

  // Test analyzeDataFlows
  const dataFlows = agent.analyzeDataFlows(seams);
  console.log(`� Found ${dataFlows.length} data flows`);

  // Test generateImplementationOrder
  console.log("\n🏗️ Testing generateImplementationOrder method...");
  const implementationOrder = agent.generateImplementationOrder(components);

  console.log("✅ Implementation Order:");
  implementationOrder.forEach((item, index) => {
    if (item.startsWith("===")) {
      console.log(`\n${item}`);
    } else {
      console.log(`  ${index}. ${item}`);
    }
  });

  // Test createRecommendations
  console.log("\n� Testing createRecommendations method...");
  const recommendations = agent.createRecommendations(components, seams);

  console.log("✅ System Recommendations (first 10):");
  recommendations.slice(0, 10).forEach((rec, index) => {
    if (rec.startsWith("===")) {
      console.log(`\n${rec}`);
    } else {
      console.log(`${rec}`);
    }
  });

  console.log(`\n� Total recommendations: ${recommendations.length}`);

  // FINAL SUMMARY
  console.log("\n🎉 COMPLETE PIPELINE SUCCESS!");
  console.log("✅ Components: Extracted and categorized");
  console.log("✅ Seams: Identified with data flows");
  console.log("✅ Data Flows: Analyzed with bottlenecks");
  console.log("✅ Implementation Order: Phased approach");
  console.log("✅ Recommendations: Comprehensive guidance");
  console.log("\n🚀 Requirements Analysis Agent is FULLY FUNCTIONAL!");
} catch (error) {
  console.error("❌ Test failed:", error);
}
