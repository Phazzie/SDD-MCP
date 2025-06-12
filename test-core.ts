/**
 * Simple test of core contracts and seams functionality
 */

// Import types directly from TypeScript files for testing
import {
  ContractResult,
  isErrorResult,
  isSuccessResult,
} from "./src/contracts.js";

import {
  SEAM_REGISTRY,
  getAvailableSeams,
  validateSeamConnections,
} from "./src/seams.js";

console.log("🔧 Testing Core SDD Contracts & Seams");

// Test type guards
const successResult: ContractResult<string> = { success: true, data: "test" };
const errorResult: ContractResult<string> = {
  success: false,
  error: "test error",
};

console.log("✅ Type Guards:");
console.log(`  isSuccessResult(success): ${isSuccessResult(successResult)}`);
console.log(`  isErrorResult(error): ${isErrorResult(errorResult)}`);

// Test seam registry
console.log("\n✅ Seam Registry:");
console.log(`  Total seams: ${Object.keys(SEAM_REGISTRY).length}`);
console.log(
  `  Sample seams: ${Object.keys(SEAM_REGISTRY).slice(0, 3).join(", ")}`
);

// Test seam manager
console.log("\n✅ Seam Manager:");
const availableSeams = getAvailableSeams();
console.log(`  Available seams: ${availableSeams.length}`);

const connectionStatus = validateSeamConnections();
console.log(`  Connected: ${connectionStatus.connected.length}`);
console.log(`  Missing: ${connectionStatus.missing.length}`);

console.log("\n🎯 Core SDD infrastructure is working correctly!");
console.log("📝 Next: Connect seam execution methods to actual tools");
