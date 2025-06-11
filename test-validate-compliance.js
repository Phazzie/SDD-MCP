// Test for SDD Validate Compliance Agent
import { ValidateComplianceAgent } from './dist/tools/legacy/sdd-validate-compliance-tool.js';

const agent = new ValidateComplianceAgent();

console.log('🧪 Testing SDD Validate Compliance Agent...');

try {
  // Test with our own project directory
  const projectPath = process.cwd();
  
  console.log(`\n📁 Scanning project: ${projectPath}`);
    // Test scanProjectFiles (but use a simple method instead of private)
  console.log('\n1. Testing file operations...');
  
  // Test with our current directory as project path
  const validationInput = {
    projectPath: projectPath,
    strictMode: false
  };
  
  const validationResult = await agent.validateInput(validationInput);
  console.log(`✅ Input validation: ${validationResult.success ? 'passed' : 'failed'}`);
    if (!validationResult.success) {
    console.error('❌ Input validation failed:', validationResult.error);
    throw new Error('Input validation failed');
  }

  console.log('\n🎉 BASIC VALIDATION TESTS PASSED!');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error(error.stack);
}
