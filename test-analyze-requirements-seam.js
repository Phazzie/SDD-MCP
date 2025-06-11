// Test AnalyzeRequirements Seam Connection
import { seamManager } from "./dist/seams.js";

const testInput = {
  prdText:
    "Build a user management system with authentication, user profiles, and role-based access control. The system should support user registration, login, profile management, and admin dashboard. Include features like password reset, email verification, and session management.",
  designNotes:
    "Focus on security, scalability, and clean architecture patterns",
};

console.log("🔧 Testing AnalyzeRequirements Seam Connection");
console.log("Input:", JSON.stringify(testInput, null, 2));

try {
  const result = await seamManager.executeSeam(
    "AnalyzeRequirements",
    testInput
  );
  console.log("🎯 SEAM EXECUTION RESULT:");
  console.log("Success:", result.success);

  if (!result.success) {
    console.log("❌ Seam execution failed:", result.error);
  } else {
    console.log("✅ Seam connection working!");
    console.log("Seams found:", result.data?.seams?.length || 0);
    console.log("Components found:", result.data?.components?.length || 0);
    console.log("Architecture overview:", result.data?.architecture?.overview);
  }
} catch (error) {
  console.error("💥 Seam test failed:", error.message);
}
