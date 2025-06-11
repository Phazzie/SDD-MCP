import { TemplateProcessor } from "./dist/template-processor.js";

async function testLatestTemplates() {
  console.log("🆕 Testing latest template additions...\n");

  const processor = new TemplateProcessor();

  // Test data for SDD templates
  const testData = {
    // Test scaffolding template
    testFileName: "tests/unit/orderProcessor.agent.unit.test.ts",
    agentClassName: "OrderProcessorAgent",
    agentImportPath: "../../src/agents/orderProcessor.agent",
    expectedAgentId: "order-processor-agent-main",
    contractResultImportPath: "../../../src/shared/common-types.js",
    notImplementedErrorImportPath: "../../../src/shared/sdd-errors.js",
    methods: [
      {
        name: "createOrder",
        inputTypeName: "CreateOrderInput",
        outputTypeName: "Order",
        isImplemented: true,
        happyPathDescription: "create a new order successfully",
        happyPathInputExample:
          '{ "customerId": "cust123", "items": [{ "productId": "prodABC", "quantity": 1 }] }',
        happyPathOutputExample:
          '{ "orderId": "order-456", "status": "CONFIRMED" }',
        mockSetupsHappyPath: [],
        mockVerificationsHappyPath: [],
        inputValidationTests: [],
        dependencyFailureTests: [],
        failureModeTests: [],
      },
    ],
    contractDependencies: [],
    directDependenciesToMock: [],
    otherDependenciesToMock: [],

    // GitHub workflow template
    workflowName: "SDD Project CI/CD",
    mainBranch: "main",
    developBranch: "develop",
    runsOn: "ubuntu-latest",
    nodeVersions: ["18.x", "20.x"],
    packageManager: "npm",
    packageManagerInstallCommand: "npm ci",
    packageManagerRunCommand: "npm run",
    runLinter: true,
    runFormatterCheck: true,
    uploadCoverage: true,
    includeBuildAndPublishJob: false,
    includeDeploymentJob: false,
    buildEnvVars: [],
    testEnvVars: [],

    // ESLint config template
    includeTestEnvironment: true,
    includePrettier: true,
    includeTestExtensions: true,
    includeTestPlugins: true,
    includeSddCustomRules: true,
    enforceJsImportExtensions: true,
    consoleRule: '"warn"',
    hasConfigFiles: true,
    hasScriptFiles: true,
    additionalIgnorePatterns: ["temp/"],
    contractResultImportPath: "../shared/common-types.js",
    notImplementedErrorImportPath: "../shared/sdd-errors.js",

    // Package.json template
    projectName: "my-sdd-project",
    version: "1.0.0",
    description: "SDD-compliant project",
    mainEntry: "dist/index.js",
    typesEntry: "dist/index.d.ts",
    hasTypeDefinitions: true,
    buildCommand: "tsc",
    devCommand: "tsx src/index.ts",
    startCommand: "node dist/index.js",
    testCommand: "vitest",
    testWatchCommand: "vitest --watch",
    testCoverageCommand: "vitest --coverage",
    includeLinting: true,
    lintCommand: "eslint src --ext .ts",
    lintFixCommand: "eslint src --ext .ts --fix",
    includeFormatting: true,
    formatCommand: "prettier --write .",
    formatCheckCommand: "prettier --check .",
    includeTypeChecking: true,
    typeCheckCommand: "tsc --noEmit",
    cleanCommand: "rimraf dist",
    keywords: ["sdd", "typescript", "mcp"],
    author: "Development Team",
    license: "MIT",
    nodeVersion: ">=18.0.0",
    includeTypeScript: true,
    includeVitest: true,
    includeHandlebars: true,
    customDependencies: {},
    customDevDependencies: {},
    additionalScripts: {},

    // TypeScript config template
    target: "ES2022",
    module: "Node16",
    moduleResolution: "Node16",
    lib: ["ES2022"],
    outDir: "./dist",
    rootDir: "./src",
    sourceMap: true,
    declaration: true,
    declarationMap: true,
    noPropertyAccessFromIndexSignature: false,
    noUncheckedIndexedAccess: true,
    exactOptionalPropertyTypes: false,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noEmitOnError: true,
    skipLibCheck: true,
    verbatimModuleSyntax: false,
    includePatterns: ["src/**/*"],
    excludePatterns: ["node_modules", "dist", "**/*.test.ts"],

    // Dockerfile template
    nodeVersion: "20",
    packageManagerLockFile: "package-lock.json",
    packageManagerInstallCommandProduction: "npm ci --omit=dev",
    packageManagerRunCommand: "npm run",
    pruneDevDependenciesAfterBuild: true,
    packageManagerPruneCommand: "npm prune --production",
    buildArgs: [],
    productionEnvVars: [
      { name: "PORT", value: "3000" },
      { name: "LOG_LEVEL", value: "info" },
    ],
    otherFilesToCopyFromBuilder: [],
    appPort: 3000,
    includeHealthcheck: true,
    healthcheckCommand:
      "node -e \"require('http').get('http://localhost:3000/health', (res) => res.statusCode === 200 ? process.exit(0) : process.exit(1)).on('error', () => process.exit(1))\"",
    mainEntryFileJS: "dist/index.js",
  };

  // Test test-scaffolding template
  try {
    console.log("🧪 Testing test-scaffolding.handlebars...");
    const testScaffolding = await processor.generateFromTemplate(
      "test-scaffolding",
      testData
    );
    console.log("✅ Test scaffolding generated successfully");
    console.log(
      `📝 Generated ${testScaffolding.length} characters of test content\n`
    );
  } catch (error) {
    console.log("❌ Test scaffolding failed:", error.message, "\n");
  }

  // Test github-workflows template
  try {
    console.log("🔄 Testing github-workflows.handlebars...");
    const githubWorkflow = await processor.generateFromTemplate(
      "github-workflows",
      testData
    );
    console.log("✅ GitHub workflow generated successfully");
    console.log(
      `📝 Generated ${githubWorkflow.length} characters of workflow content\n`
    );
  } catch (error) {
    console.log("❌ GitHub workflow failed:", error.message, "\n");
  }

  // Test sdd-linter-config template
  try {
    console.log("🔍 Testing sdd-linter-config.handlebars...");
    const linterConfig = await processor.generateFromTemplate(
      "sdd-linter-config",
      testData
    );
    console.log("✅ SDD linter config generated successfully");
    console.log(
      `📝 Generated ${linterConfig.length} characters of config content\n`
    );
  } catch (error) {
    console.log("❌ SDD linter config failed:", error.message, "\n");
  }

  // Test package-json template
  try {
    console.log("📦 Testing package-json.handlebars...");
    const packageJson = await processor.generateFromTemplate(
      "package-json",
      testData
    );
    console.log("✅ Package.json generated successfully");
    console.log(
      `📝 Generated ${packageJson.length} characters of package content\n`
    );
  } catch (error) {
    console.log("❌ Package.json failed:", error.message, "\n");
  }

  // Test tsconfig template
  try {
    console.log("⚙️ Testing tsconfig.handlebars...");
    const tsconfig = await processor.generateFromTemplate("tsconfig", testData);
    console.log("✅ TypeScript config generated successfully");
    console.log(
      `📝 Generated ${tsconfig.length} characters of config content\n`
    );
  } catch (error) {
    console.log("❌ TypeScript config failed:", error.message, "\n");
  }

  // Test dockerfile template
  try {
    console.log("🐳 Testing dockerfile.handlebars...");
    const dockerfile = await processor.generateFromTemplate(
      "dockerfile",
      testData
    );
    console.log("✅ Dockerfile generated successfully");
    console.log(
      `📝 Generated ${dockerfile.length} characters of Docker content\n`
    );
  } catch (error) {
    console.log("❌ Dockerfile failed:", error.message, "\n");
  }

  console.log("🎉 Testing of latest templates completed!\n");
}

testLatestTemplates().catch(console.error);
