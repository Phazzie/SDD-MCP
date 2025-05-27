/**
 * Test script for new Gemini-generated templates
 */

import * as path from "path";
import { TemplateProcessor } from "./dist/template-processor.js";

async function testNewTemplates() {
  console.log("🧪 Testing Gemini-generated templates...\n");

  const templateProcessor = new TemplateProcessor();
  const templatesDir = path.join(process.cwd(), "templates");

  // Test seam-manager template
  console.log("📝 Testing seam-manager.handlebars...");
  try {
    const seamManagerContext = {
      seamManagerClassName: "TestSeamManager",
      seamManagerFileName: "test.seam-manager",
      agentId: "test-seam-manager-001",
      baseAgentInterfaceName: "IAgentBase",
      contractResultImportPath: "./shared/types.js",
      notImplementedErrorImportPath: "./shared/errors.js",
      baseAgentInterfaceImportPath: "./shared/iagent-base.js",
      agentsToImport: [
        { componentName: "UserAgent", importPath: "./agents/user.agent" },
        { componentName: "DataAgent", importPath: "./agents/data.agent" },
      ],
      agentsToRegisterAtConstruction: [
        { componentName: "UserAgent", camelCaseName: "userAgent" },
      ],
      useCircuitBreaker: true,
      circuitBreakerConfig: {
        errorThresholdPercentage: 50,
        resetTimeoutMs: 30000,
        minRequestsForEval: 5,
        openStateTimeoutMs: 60000,
      },
    };

    const seamManagerResult = await templateProcessor.generateFromTemplate(
      "seam-manager.handlebars",
      seamManagerContext
    );
    console.log("✅ seam-manager.handlebars - SUCCESS");
    console.log(`   Generated ${seamManagerResult.length} characters\n`);
  } catch (error) {
    console.log("❌ seam-manager.handlebars - FAILED");
    console.log(`   Error: ${error.message}\n`);
  }

  // Test orchestrator-agent template
  console.log("📝 Testing orchestrator-agent.handlebars...");
  try {
    const orchestratorContext = {
      componentName: "TestOrchestratorAgent",
      pascalCaseName: "TestOrchestrator",
      stubFileName: "test.orchestrator.agent.ts",
      agentId: "test-orchestrator-001",
      purpose: "Test orchestration workflows",
      contractResultImportPath: "./shared/types.js",
      notImplementedErrorImportPath: "./shared/errors.js",
      seamManagerClassName: "TestSeamManager",
      seamManagerImportPath: "./core/test.seam-manager",
      baseAgentInterfaceName: "IAgentBase",
      baseAgentInterfaceImportPath: "./shared/iagent-base.js",
      additionalImports: [],
      directDependencies: [],
      generateCorrelationId: true,
      exposedMethods: [
        {
          methodName: "processTestWorkflow",
          pascalCaseName: "ProcessTestWorkflow",
          methodDescription: "Processes a test workflow",
          contractVersion: "1.0.0",
          inputFields: [
            {
              name: "workflowId",
              type: "string",
              description: "Workflow identifier",
              required: true,
            },
          ],
          outputFields: [
            {
              name: "result",
              type: "string",
              description: "Processing result",
            },
          ],
          involvedSeams: [
            {
              seamName: "UserAgent",
              methodToCall: "validateUser",
              camelCaseSeamName: "userAgent",
              resultKey: "userValidation",
              isCritical: true,
              inputMapping: [
                {
                  targetField: "userId",
                  sourceFieldExpression: "request.workflowId",
                },
              ],
            },
          ],
          outputMapping: [
            {
              targetField: "result",
              sourceFieldExpression: "'Workflow processed successfully'",
            },
          ],
        },
      ],
    };

    const orchestratorResult = await templateProcessor.generateFromTemplate(
      "orchestrator-agent.handlebars",
      orchestratorContext
    );
    console.log("✅ orchestrator-agent.handlebars - SUCCESS");
    console.log(`   Generated ${orchestratorResult.length} characters\n`);
  } catch (error) {
    console.log("❌ orchestrator-agent.handlebars - FAILED");
    console.log(`   Error: ${error.message}\n`);
  }

  // Test granular-checklist template
  console.log("📝 Testing granular-checklist.handlebars...");
  try {
    const checklistContext = {
      componentName: "TestComponent",
      purpose: "Test component for validation",
      contractFileName: "test.contract.ts",
      stubFileName: "test.stub.ts",
      priority: "HIGH_ROI",
      totalEstimatedHours: 24,
      complexityScore: 7,
      foundationEstimatedHours: 4,
      stubEstimatedHours: 6,
      coreLogicEstimatedHours: 10,
      integrationTestingEstimatedHours: 3,
      productionizationEstimatedHours: 1,
      foundationSteps: [
        {
          title: "Setup TypeScript Configuration",
          time: "30 minutes",
          description: "Configure TypeScript compiler options",
          validationPoint: "TypeScript compiles without errors",
          rollback: "Revert to previous tsconfig.json",
        },
      ],
      stubImplementationSteps: [
        {
          methodName: "testMethod",
          inputType: "TestInput",
          outputType: "TestOutput",
          estimatedTime: "45 minutes",
          functionality: "Test business logic",
          blueprint: "Implement core test functionality",
          requiredFields: [
            {
              fieldName: "id",
              fieldType: "string",
              validation: "Must be non-empty",
            },
          ],
        },
      ],
      coreLogicSteps: [],
      integrationTestingSteps: [],
      productionizationSteps: [],
      performanceTarget: "200",
      generatedDate: new Date().toISOString(),
      templateVersion: "1.2.0",
    };

    const checklistResult = await templateProcessor.generateFromTemplate(
      "granular-checklist.handlebars",
      checklistContext
    );
    console.log("✅ granular-checklist.handlebars - SUCCESS");
    console.log(`   Generated ${checklistResult.length} characters\n`);
  } catch (error) {
    console.log("❌ granular-checklist.handlebars - FAILED");
    console.log(`   Error: ${error.message}\n`);
  }

  console.log("🎉 Template testing completed!");
}

// Run the test
testNewTemplates().catch(console.error);
