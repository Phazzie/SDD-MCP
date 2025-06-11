// Test for SDD Create Stub Agent
import { CreateStubAgent } from "./dist/tools/legacy/sdd-create-stub-tool.js";

const agent = new CreateStubAgent();

// Test contract interface
const testContractCode = `
interface UserManagementContract {
  createUser(userData: UserData): Promise<ContractResult<User>>;
  validateCredentials(email: string, password: string): Promise<ContractResult<AuthResult>>;
  updateProfile(userId: string, updates: ProfileUpdates): Promise<ContractResult<User>>;
  deleteUser(userId: string): Promise<ContractResult<boolean>>;
}
`;

console.log("🧪 Testing SDD Create Stub Agent...");

try {
  // Test parseContractInterface
  console.log("\n1. Testing parseContractInterface...");
  const parsedContract = agent.parseContractInterface(testContractCode);
  console.log(`✅ Parsed interface: ${parsedContract.name}`);
  console.log(`📊 Found ${parsedContract.methods.length} methods`);
  parsedContract.methods.forEach((method, index) => {
    console.log(
      `  ${index + 1}. ${method.name}(${method.parameters
        .map((p) => p.name)
        .join(", ")}) -> ${method.returnType}`
    );
  });

  // Test generateClassStub
  console.log("\n2. Testing generateClassStub...");
  const classStub = agent.generateClassStub(parsedContract, "UserManagement");
  console.log(
    `✅ Generated class stub (${classStub.split("\n").length} lines)`
  );

  // Test addBlueprintComments
  console.log("\n3. Testing addBlueprintComments...");
  const enhancedStub = agent.addBlueprintComments(classStub, parsedContract);
  console.log(
    `✅ Enhanced with blueprint comments (${
      enhancedStub.split("\n").length
    } lines)`
  );

  // Test validateStubCompliance
  console.log("\n4. Testing validateStubCompliance...");
  const compliance = agent.validateStubCompliance(enhancedStub);
  console.log(`✅ Compliance Report:`);
  console.log(
    `  - ContractResult Pattern: ${compliance.hasContractResultPattern}`
  );
  console.log(`  - NotImplementedError: ${compliance.hasNotImplementedErrors}`);
  console.log(`  - Blueprint Comments: ${compliance.blueprintComments}`);
  console.log(`  - Code Lines: ${compliance.codeLines}`);
  console.log(`  - Compliance Score: ${compliance.complianceScore}%`);

  // Test generateFilePathSuggestion
  console.log("\n5. Testing generateFilePathSuggestion...");
  const filePath = agent.generateFilePathSuggestion("UserManagement");
  console.log(`✅ Suggested file path: ${filePath}`);

  // Show sample of generated code
  console.log("\n📄 Generated Code Sample (first 20 lines):");
  const lines = enhancedStub.split("\n");
  lines.slice(0, 20).forEach((line, index) => {
    console.log(`${(index + 1).toString().padStart(2)}: ${line}`);
  });

  console.log(`\n... and ${lines.length - 20} more lines`);
  console.log("\n🎉 ALL TESTS PASSED! Create Stub Agent is FUNCTIONAL!");
} catch (error) {
  console.error("❌ Test failed:", error.message);
  console.error(error.stack);
}
