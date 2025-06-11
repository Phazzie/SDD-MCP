// Test OrchestrateFull Seam Connection
import { seamManager } from "./dist/seams.js";

const testInput = {
  prdText:
    "Build a user management system with authentication, user profiles, and role-based access control.",
  projectName: "UserManagementSystem",
  designNotes: "Focus on security and scalability",
};

console.log("🔧 Testing OrchestrateFull Seam Connection");
console.log("Input:", JSON.stringify(testInput, null, 2));

try {
  const result = await seamManager.executeSeam("OrchestrateFull", testInput);
  console.log("🎯 SEAM EXECUTION RESULT:");
  console.log("Success:", result.success);

  if (!result.success) {
    console.log("❌ Seam execution failed:", result.error);
  } else {
    console.log("✅ Seam connection working! Data:", result.data);
  }
} catch (error) {
  console.error("💥 Seam test failed:", error.message);
}
