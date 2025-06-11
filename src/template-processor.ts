/**
 * Template Processing Engine for SDD Code Generation
 * Converts Handlebars templates into project-specific code
 */

import * as fs from "fs/promises";
import Handlebars from "handlebars";
import * as path from "path";
import type { SeamDefinition } from "./contracts.js";

export interface TemplateContext {
  // Basic component info
  componentName: string;
  contractName: string;
  pascalCaseName: string;
  camelCaseName: string;

  // File names
  contractFileName: string;
  stubFileName: string;
  testFileName: string;

  // Seam definition
  purpose: string;
  dataFlow: string;
  participants: string[];

  // Contract details
  methodName: string;
  methodDescription: string;
  agentId: string;

  // Input/Output fields
  inputFields: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  outputFields: Array<{
    name: string;
    type: string;
    description: string;
  }>;

  // Implementation guidance
  blueprint: string;
  implementationHint: string;
  estimatedEffort: string;
  priority: string;

  // Enhanced blueprint fields
  rationale: string;
  examples: string;

  // Testing
  sampleInputFields: Array<{
    name: string;
    sampleValue: string;
  }>;

  // Dependencies
  dependencies: string[];
  seamDependencies: string;
  hasSeamDependencies: boolean;

  // Implementation checklist
  implementationSteps: Array<{
    stepTitle: string;
    estimate: string;
    tasks: Array<{
      title: string;
      time: string;
      code?: string;
      language?: string;
      description?: string;
    }>;
  }>;

  // Estimates
  foundationEstimate: string;
  stubEstimate: string;
  coreEstimate: string;
  integrationEstimate: string;
  productionEstimate: string;
  totalEstimate: string;

  // Validation
  validationRules: string[];
  maxResponseTime: string;
  maxErrorRate: string;
  minAvailability: string;

  // Metadata
  hasMetadata: boolean;
  nextComponent: string;
}

export interface GeneratedOutput {
  contractCode: string;
  stubCode: string;
  testCode: string;
  checklistMarkdown: string;
  fileName: string;
  templateContext: TemplateContext;
}

export class TemplateProcessor {
  private templateCache: Map<string, HandlebarsTemplateDelegate> = new Map();
  private readonly templateDir: string;

  constructor(templateDir: string = "./templates") {
    this.templateDir = templateDir;
    this.registerHelpers();
  }
  private registerHelpers() {
    // Register Handlebars helpers for SDD patterns
    Handlebars.registerHelper(
      "unless",
      function (this: any, conditional: any, options: any) {
        if (!conditional) {
          return options.fn(this);
        }
        return options.inverse(this);
      }
    );

    Handlebars.registerHelper("eq", function (a: any, b: any) {
      return a === b;
    });

    Handlebars.registerHelper("contains", function (array: any, item: any) {
      return Array.isArray(array) && array.includes(item);
    }); // 💰 HIGH_ROI - Default helper for Gemini-generated templates
    Handlebars.registerHelper(
      "default",
      function (value: any, defaultValue: any) {
        return value != null && value !== "" ? value : defaultValue;
      }
    );

    // 💰 HIGH_ROI - Helpers for Gemini-generated templates
    Handlebars.registerHelper("isBoolean", function (value: any) {
      return typeof value === "boolean";
    });

    Handlebars.registerHelper("isObject", function (value: any) {
      return (
        typeof value === "object" && value !== null && !Array.isArray(value)
      );
    });

    Handlebars.registerHelper("jsonStringify", function (obj: any) {
      return JSON.stringify(obj);
    });
  }

  async loadTemplate(
    templateName: string
  ): Promise<HandlebarsTemplateDelegate> {
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }

    const templatePath = path.join(
      this.templateDir,
      `${templateName}.handlebars`
    );
    const templateContent = await fs.readFile(templatePath, "utf-8");
    const compiledTemplate = Handlebars.compile(templateContent);

    this.templateCache.set(templateName, compiledTemplate);
    return compiledTemplate;
  }

  createTemplateContext(seam: SeamDefinition): TemplateContext {
    const componentName = seam.name.replace(/[-\s]/g, "").replace("Seam", "");
    const pascalCaseName =
      componentName.charAt(0).toUpperCase() + componentName.slice(1);
    const camelCaseName =
      componentName.charAt(0).toLowerCase() + componentName.slice(1);
    const contractName = `${pascalCaseName}Contract`;

    // Generate method name from purpose
    const methodName = this.generateMethodName(seam.purpose);

    // Create file names
    const contractFileName = `${camelCaseName}.contract.ts`;
    const stubFileName = `${camelCaseName}.agent.ts`;
    const testFileName = `${camelCaseName}.integration.test.ts`;

    // Generate sample fields based on purpose
    const { inputFields, outputFields } = this.generateFieldsFromPurpose(
      seam.purpose
    );

    // Create implementation steps
    const implementationSteps = this.generateImplementationSteps(seam);

    return {
      componentName: `${pascalCaseName}Agent`,
      contractName,
      pascalCaseName,
      camelCaseName,
      contractFileName,
      stubFileName,
      testFileName,
      purpose: seam.purpose,
      dataFlow: seam.dataFlow,
      participants: seam.participants,
      methodName,
      methodDescription: `Execute ${seam.purpose}`,
      agentId: `${camelCaseName}-agent`,
      inputFields,
      outputFields,
      blueprint: `Implement ${seam.purpose} with ContractResult pattern`,
      implementationHint: `TODO: Implement ${seam.purpose} business logic`,
      estimatedEffort: this.estimateEffort(seam),
      priority: this.determinePriority(seam),
      rationale: `This seam enables ${
        seam.purpose
      } by connecting ${seam.participants.join(" and ")}`,
      examples: `Example: ${methodName}(request) → ContractResult<${pascalCaseName}Output>`,
      sampleInputFields: inputFields.map((field) => ({
        name: field.name,
        sampleValue: this.generateSampleValue(field.type),
      })),
      dependencies: this.extractDependencies(seam),
      seamDependencies: seam.participants
        .filter((p) => p !== "OrchestratorAgent")
        .join(", "),
      hasSeamDependencies: seam.participants.length > 2,
      implementationSteps,
      foundationEstimate: "50 min",
      stubEstimate: "90 min",
      coreEstimate: "180 min",
      integrationEstimate: "130 min",
      productionEstimate: "110 min",
      totalEstimate: "560 min (9.3 hours)",
      validationRules: this.generateValidationRules(seam),
      maxResponseTime: "500ms",
      maxErrorRate: "1%",
      minAvailability: "99.9%",
      hasMetadata: true,
      nextComponent: this.suggestNextComponent(seam),
    };
  }

  async generateFromSeam(seam: SeamDefinition): Promise<GeneratedOutput> {
    const context = this.createTemplateContext(seam);

    // Load and compile templates
    const contractTemplate = await this.loadTemplate("contract");
    const stubTemplate = await this.loadTemplate("stub");
    const testTemplate = await this.loadTemplate("integration-tests");
    const checklistTemplate = await this.loadTemplate(
      "implementation-checklist"
    );

    // Generate code from templates
    const contractCode = contractTemplate(context);
    const stubCode = stubTemplate(context);
    const testCode = testTemplate(context);
    const checklistMarkdown = checklistTemplate(context);

    return {
      contractCode,
      stubCode,
      testCode,
      checklistMarkdown,
      fileName: context.contractFileName,
      templateContext: context,
    };
  }

  /**
   * Generate code from any template with provided context
   */
  async generateFromTemplate(
    templateName: string,
    context: any
  ): Promise<string> {
    // Remove .handlebars extension if provided
    const cleanTemplateName = templateName.replace(".handlebars", "");

    const template = await this.loadTemplate(cleanTemplateName);
    return template(context);
  }

  private generateMethodName(purpose: string): string {
    // Convert purpose to camelCase method name
    const cleaned = purpose
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const words = cleaned.split(" ");
    if (words.length === 0) return "execute";

    return (
      words[0] +
      words
        .slice(1)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("")
    );
  }

  private generateFieldsFromPurpose(purpose: string): {
    inputFields: Array<{ name: string; type: string; description: string }>;
    outputFields: Array<{ name: string; type: string; description: string }>;
  } {
    // Smart field generation based on purpose keywords
    const inputFields = [
      {
        name: "data",
        type: "Record<string, any>",
        description: "Input data for processing",
      },
    ];

    const outputFields = [
      { name: "result", type: "any", description: "Processing result" },
      {
        name: "processedAt",
        type: "Date",
        description: "Processing timestamp",
      },
    ];

    // Add purpose-specific fields
    if (purpose.includes("user") || purpose.includes("profile")) {
      inputFields.push({
        name: "userId",
        type: "string",
        description: "User identifier",
      });
      outputFields.push({
        name: "userProfile",
        type: "UserProfile",
        description: "User profile data",
      });
    }

    if (
      purpose.includes("data") ||
      purpose.includes("store") ||
      purpose.includes("save")
    ) {
      inputFields.push({
        name: "payload",
        type: "T",
        description: "Data payload to store",
      });
      outputFields.push({
        name: "id",
        type: "string",
        description: "Generated ID",
      });
    }

    if (purpose.includes("notification") || purpose.includes("message")) {
      inputFields.push({
        name: "message",
        type: "string",
        description: "Message content",
      });
      outputFields.push({
        name: "messageId",
        type: "string",
        description: "Unique message identifier",
      });
    }

    return { inputFields, outputFields };
  }

  private generateImplementationSteps(seam: SeamDefinition): Array<{
    stepTitle: string;
    estimate: string;
    tasks: Array<{
      title: string;
      time: string;
      code?: string;
      language?: string;
      description?: string;
    }>;
  }> {
    return [
      {
        stepTitle: "Business Logic Implementation",
        estimate: "120 min",
        tasks: [
          {
            title: "Implement core business logic",
            time: "60 min",
            description: `Core implementation for ${seam.purpose}`,
          },
          {
            title: "Add data transformation logic",
            time: "30 min",
            code: `// Transform input data
const transformedData = await this.transformInput(request.data);`,
            language: "typescript",
          },
          {
            title: "Implement response formatting",
            time: "30 min",
            description: "Format response according to ContractResult pattern",
          },
        ],
      },
      {
        stepTitle: "External Integration",
        estimate: "60 min",
        tasks: [
          {
            title: "Setup external service connections",
            time: "30 min",
            description: `Connect to required external services for ${seam.purpose}`,
          },
          {
            title: "Implement retry logic",
            time: "30 min",
            code: `// Retry mechanism for external calls
const result = await this.retryService.execute(() => externalCall(), 3);`,
            language: "typescript",
          },
        ],
      },
    ];
  }

  private estimateEffort(seam: SeamDefinition): string {
    let baseHours = 4; // Base implementation time

    // Adjust based on complexity indicators
    if (seam.participants.length > 2) baseHours += 2;
    if (seam.purpose.includes("complex") || seam.purpose.includes("advanced"))
      baseHours += 3;
    if (seam.dataFlow === "BOTH") baseHours += 1;

    return `${baseHours}-${baseHours + 2} hours`;
  }

  private determinePriority(seam: SeamDefinition): string {
    // Determine priority based on seam characteristics
    if (seam.participants.includes("OrchestratorAgent")) return "🎯 CRITICAL";
    if (seam.purpose.includes("auth") || seam.purpose.includes("security"))
      return "🎯 CRITICAL";
    if (seam.participants.length === 2) return "⚡ QUICK_WIN";
    return "🔨 HARD_WORK";
  }

  private extractDependencies(seam: SeamDefinition): string[] {
    const deps = ["vitest"]; // Base testing dependency

    // Add purpose-specific dependencies
    if (seam.purpose.includes("database") || seam.purpose.includes("data")) {
      deps.push("@types/node");
    }

    if (seam.purpose.includes("http") || seam.purpose.includes("api")) {
      deps.push("axios", "@types/axios");
    }

    return deps;
  }

  private generateValidationRules(seam: SeamDefinition): string[] {
    const rules = ["Required fields present", "Data types correct"];

    if (seam.purpose.includes("user")) {
      rules.push("Valid user ID format", "User exists in system");
    }

    if (
      seam.purpose.includes("email") ||
      seam.purpose.includes("notification")
    ) {
      rules.push("Valid email format", "Message content not empty");
    }

    return rules;
  }

  private generateSampleValue(type: string): string {
    switch (type) {
      case "string":
        return '"test-value"';
      case "number":
        return "123";
      case "boolean":
        return "true";
      case "Date":
        return "new Date()";
      case "Record<string, any>":
        return "{ key: 'value' }";
      default:
        return '"sample-data"';
    }
  }

  private suggestNextComponent(seam: SeamDefinition): string {
    // Suggest logical next component based on current seam
    const participants = seam.participants.filter(
      (p) => p !== "OrchestratorAgent"
    );
    return participants.length > 0 ? `${participants[0]}Seam` : "CoreLogicSeam";
  }
}
