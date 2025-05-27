import { TemplateProcessor } from "./dist/template-processor.js";

async function testNewTemplates() {
  console.log("🧪 Testing newly integrated templates...\n");

  const processor = new TemplateProcessor();

  // Test data for a sample component
  const testData = {
    componentName: "PaymentProcessor",
    description: "Handles payment processing and validation",
    methods: [
      {
        name: "processPayment",
        description: "Process a payment transaction",
        inputs: [
          { name: "amount", type: "number", description: "Payment amount" },
          { name: "currency", type: "string", description: "Currency code" },
          {
            name: "paymentMethod",
            type: "PaymentMethod",
            description: "Payment method details",
          },
        ],
        outputs: [
          {
            name: "transactionId",
            type: "string",
            description: "Unique transaction ID",
          },
          {
            name: "status",
            type: "PaymentStatus",
            description: "Payment status",
          },
        ],
      },
    ],
    projectName: "E-commerce Platform",
    author: "Development Team",
  }; // Test AI onboarding prompt template
  try {
    console.log("📋 Testing ai-onboarding-prompt.handlebars...");
    const onboardingPrompt = await processor.generateFromTemplate(
      "ai-onboarding-prompt",
      testData
    );
    console.log("✅ AI onboarding prompt generated successfully");
    console.log(
      `📝 Generated ${onboardingPrompt.length} characters of onboarding content\n`
    );
  } catch (error) {
    console.log("❌ AI onboarding prompt failed:", error.message, "\n");
  }

  // Test implementation prompt template
  try {
    console.log("🔧 Testing implementation-prompt.handlebars...");
    const implementationPrompt = await processor.generateFromTemplate(
      "implementation-prompt",
      testData
    );
    console.log("✅ Implementation prompt generated successfully");
    console.log(
      `📝 Generated ${implementationPrompt.length} characters of implementation guidance\n`
    );
  } catch (error) {
    console.log("❌ Implementation prompt failed:", error.message, "\n");
  }

  // Test API documentation template
  try {
    console.log("📚 Testing api-documentation.handlebars...");
    const apiDocs = await processor.generateFromTemplate(
      "api-documentation",
      testData
    );
    console.log("✅ API documentation generated successfully");
    console.log(
      `📝 Generated ${apiDocs.length} characters of API documentation\n`
    );
  } catch (error) {
    console.log("❌ API documentation failed:", error.message, "\n");
  }

  // Test troubleshooting guide template
  try {
    console.log("🔍 Testing troubleshooting-guide.handlebars...");
    const troubleshootingGuide = await processor.generateFromTemplate(
      "troubleshooting-guide",
      testData
    );
    console.log("✅ Troubleshooting guide generated successfully");
    console.log(
      `📝 Generated ${troubleshootingGuide.length} characters of troubleshooting content\n`
    );
  } catch (error) {
    console.log("❌ Troubleshooting guide failed:", error.message, "\n");
  }
}

testNewTemplates().catch(console.error);
