import {
  ContractResult,
  CreateStubInput,
  CreateStubOutput,
} from "../../contracts.js";

class NotImplementedError extends Error {
  constructor(methodName: string, blueprint: string) {
    super(`${methodName}: ${blueprint}`);
    this.name = "NotImplementedError";
  }
}

/**
 * SDD Create Stub Agent
 * Creates implementation stubs with blueprint comments and NotImplementedError patterns
 *
 * Blueprint: This agent generates SDD-compliant code stubs from contract definitions:
 * - Parses contract interface definitions
 * - Generates class stubs with NotImplementedError patterns
 * - Adds blueprint comments for implementation guidance
 * - Ensures ContractResult<T> return types
 */
export class CreateStubAgent {
  private readonly agentId = "create-stub-agent";

  /**
   * Validate input parameters for stub creation
   */
  async validateInput(
    input: unknown
  ): Promise<ContractResult<CreateStubInput>> {
    try {
      if (!input || typeof input !== "object") {
        return {
          success: false,
          error: "Input must be an object",
          metadata: {
            agentId: this.agentId,
            seamName: "validateInput",
            timestamp: new Date().toISOString(),
            validationErrors: "Invalid input type",
          },
        };
      }

      const data = input as any;
      if (!data.contractCode || typeof data.contractCode !== "string") {
        return {
          success: false,
          error: "contractCode is required and must be a string",
          metadata: {
            agentId: this.agentId,
            seamName: "validateInput",
            timestamp: new Date().toISOString(),
            validationErrors: "contractCode validation failed",
          },
        };
      }

      if (!data.componentName || typeof data.componentName !== "string") {
        return {
          success: false,
          error: "componentName is required and must be a string",
          metadata: {
            agentId: this.agentId,
            seamName: "validateInput",
            timestamp: new Date().toISOString(),
            validationErrors: "componentName validation failed",
          },
        };
      }

      return {
        success: true,
        data: data as CreateStubInput,
        metadata: {
          agentId: this.agentId,
          seamName: "validateInput",
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Input validation failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
        metadata: {
          agentId: this.agentId,
          seamName: "validateInput",
          timestamp: new Date().toISOString(),
          validationErrors: error,
        },
      };
    }
  }
  /**
   * Execute stub creation
   */
  async execute(
    stubInput: CreateStubInput
  ): Promise<ContractResult<CreateStubOutput>> {
    throw new NotImplementedError(
      "CreateStubAgent.execute",
      `Blueprint: Generate SDD-compliant implementation stubs from contract interface code
      
      DETAILED IMPLEMENTATION PLAN:
      
      // PHASE 1: Contract Parsing
      const contractDef = this.parseContractInterface(stubInput.contractCode);
      // - Extract interface/class definitions
      // - Identify method signatures and return types
      // - Parse parameter lists and types
      // - Validate contract structure
      
      // PHASE 2: Stub Code Generation
      const stubCode = this.generateClassStub(contractDef, stubInput.componentName);
      // - Create class declaration with proper name
      // - Implement interface/contract
      // - Generate method stubs with NotImplementedError
      // - Add ContractResult<T> return types
      // - Include proper imports and dependencies
      
      // PHASE 3: Blueprint Comment Injection
      const blueprintCode = this.addBlueprintComments(stubCode, contractDef);
      // - Add detailed method blueprints
      // - Include implementation guidance
      // - Specify expected behavior
      // - Add TODO markers for implementation
      
      // PHASE 4: Compliance Validation
      const compliance = this.validateStubCompliance(blueprintCode);
      // - Check NotImplementedError patterns
      // - Verify ContractResult usage
      // - Count blueprint comments
      // - Validate SDD naming conventions
      
      // PHASE 5: File Path Suggestion
      const filePath = this.generateFilePathSuggestion(stubInput.componentName);
      // - Generate appropriate file path
      // - Follow SDD project structure
      // - Include proper naming conventions
      
      // PHASE 6: Assemble Final Output
      return {
        success: true,
        data: {
          stubCode: blueprintCode,
          filePathSuggestion: filePath,
          blueprintCommentsCount: compliance.blueprintComments,
          contractCompliance: {
            hasContractResultPattern: compliance.hasContractResult,
            hasNotImplementedErrors: compliance.hasNotImplementedErrors,
            hasBlueprintComments: compliance.blueprintComments > 0,
            complianceScore: compliance.score
          }
        }
      };`
    );
  }

  // Blueprint: HELPER METHODS TO IMPLEMENT
  /**
   * Blueprint: Parse contract interface code and extract structure
   * Returns: ParsedContract with methods, types, and metadata
   */
  private parseContractInterface(contractCode: string): any {
    const contract = {
      name: "",
      methods: [] as any[],
      imports: [] as string[],
      namespace: "",
    };

    // Extract interface name
    const interfaceMatch = contractCode.match(
      /interface\s+([A-Za-z_][A-Za-z0-9_]*)/
    );
    if (interfaceMatch) {
      contract.name = interfaceMatch[1];
    }

    // Extract method signatures
    const methodRegex =
      /(\w+)\s*\([^)]*\)\s*:\s*Promise<ContractResult<([^>]*)>>/g;
    let methodMatch;

    while ((methodMatch = methodRegex.exec(contractCode)) !== null) {
      const [, methodName, returnType] = methodMatch;

      // Extract parameters from the method signature
      const paramRegex = new RegExp(`${methodName}\\s*\\(([^)]*)\\)`, "g");
      const paramMatch = paramRegex.exec(contractCode);
      const paramString = paramMatch ? paramMatch[1].trim() : "";

      const parameters = [];
      if (paramString) {
        const params = paramString.split(",").map((p) => p.trim());
        for (const param of params) {
          const paramParts = param.split(":").map((p) => p.trim());
          if (paramParts.length >= 2) {
            parameters.push({
              name: paramParts[0],
              type: paramParts[1],
            });
          }
        }
      }

      contract.methods.push({
        name: methodName,
        parameters,
        returnType: returnType || "any",
        signature: methodMatch[0],
      });
    }

    // Extract imports
    const importMatches = contractCode.match(
      /import\s+{[^}]+}\s+from\s+['"'][^'"]+['"]/g
    );
    if (importMatches) {
      contract.imports = importMatches;
    }

    return contract;
  }
  /**
   * Blueprint: Generate class stub implementation
   * Returns: string of TypeScript class code
   */
  private generateClassStub(contractDef: any, componentName: string): string {
    const className = componentName.endsWith("Agent")
      ? componentName
      : `${componentName}Agent`;
    const interfaceName = contractDef.name;

    // Generate imports
    const imports = [
      'import { ContractResult } from "../contracts.js";',
      ...contractDef.imports,
    ].join("\n");

    // Generate NotImplementedError class
    const notImplementedError = `
class NotImplementedError extends Error {
  constructor(methodName: string, blueprint: string) {
    super(\`\${methodName}: \${blueprint}\`);
    this.name = "NotImplementedError";
  }
}`;

    // Generate method stubs
    const methodStubs = contractDef.methods
      .map((method: any) => this.createMethodStub(method))
      .join("\n\n");

    // Generate class structure
    const classCode = `/**
 * ${className} - SDD-Compliant Implementation Stub
 * 
 * Blueprint: This agent implements ${interfaceName} interface
 * Generated from contract definition with full SDD compliance patterns
 */
export class ${className} implements ${interfaceName} {
  private readonly agentId = "${className
    .toLowerCase()
    .replace("agent", "-agent")}";

${methodStubs}
}

// Export singleton instance for seam connections
export const ${componentName.toLowerCase()}Agent = new ${className}();`;

    return `${imports}
${notImplementedError}

${classCode}`;
  }
  /**
   * Blueprint: Create individual method stub with NotImplementedError
   * Returns: string of method implementation
   */
  private createMethodStub(method: any): string {
    const { name, parameters, returnType } = method;

    // Generate parameter list
    const paramList = parameters
      .map((p: any) => `${p.name}: ${p.type}`)
      .join(", ");

    // Generate parameter names for the blueprint
    const paramNames = parameters.map((p: any) => p.name).join(", ");
    const paramDescription =
      parameters.length > 0
        ? `Processes: ${paramNames}`
        : "No parameters required";

    return `  /**
   * Blueprint: Implementation for ${name}
   * ${paramDescription}
   * Returns: ContractResult<${returnType}> with success/error data
   * 
   * TODO: Implement the following logic:
   * 1. Validate input parameters
   * 2. Execute core business logic
   * 3. Return properly formatted result
   */
  async ${name}(${paramList}): Promise<ContractResult<${returnType}>> {
    throw new NotImplementedError(
      "${method.name}",
      "Blueprint: ${paramDescription} -> ContractResult<${returnType}>"
    );
  }`;
  }
  /**
   * Blueprint: Add detailed blueprint comments to stub code
   * Returns: string of enhanced code with implementation guidance
   */
  private addBlueprintComments(stubCode: string, contractDef: any): string {
    // Add comprehensive header comment
    const headerComment = `/*
 * =============================================================================
 * SDD-COMPLIANT IMPLEMENTATION STUB
 * =============================================================================
 * 
 * Contract: ${contractDef.name}
 * Generated: ${new Date().toISOString()}
 * Methods: ${contractDef.methods.length}
 * 
 * IMPLEMENTATION CHECKLIST:
 * □ Validate all input parameters
 * □ Implement core business logic
 * □ Add proper error handling
 * □ Return ContractResult<T> format
 * □ Add comprehensive logging
 * □ Write unit tests
 * 
 * SDD PATTERNS INCLUDED:
 * ✓ NotImplementedError stubs
 * ✓ ContractResult<T> return types
 * ✓ Blueprint implementation guidance
 * ✓ Async/await error handling
 * 
 * =============================================================================
 */

`;

    // Add method-specific implementation guidance
    let enhancedCode = headerComment + stubCode;

    // Add inline TODO comments for each method
    contractDef.methods.forEach((method: any) => {
      const todoComment = `
    // TODO: ${method.name} Implementation Steps:
    // 1. Input validation: Check ${method.parameters
      .map((p: any) => p.name)
      .join(", ")}
    // 2. Business logic: Core ${method.name} functionality
    // 3. Error handling: Catch and format errors
    // 4. Success response: Return formatted ContractResult<${
      method.returnType
    }>`;

      // Insert TODO comment before the throw statement
      const methodPattern = new RegExp(`(async ${method.name}\\([^{]*{)`, "g");
      enhancedCode = enhancedCode.replace(methodPattern, `$1${todoComment}`);
    });

    return enhancedCode;
  }
  /**
   * Blueprint: Validate stub compliance with SDD patterns
   * Returns: ComplianceReport with scores and validation results
   */
  private validateStubCompliance(stubCode: string): any {
    const report = {
      hasContractResultPattern: false,
      hasNotImplementedErrors: false,
      blueprintComments: 0,
      codeLines: 0,
      complianceScore: 0,
    };

    // Count lines of code
    report.codeLines = stubCode.split("\n").length;

    // Check for ContractResult pattern
    report.hasContractResultPattern = /Promise<ContractResult</.test(stubCode);

    // Check for NotImplementedError pattern
    report.hasNotImplementedErrors = /throw new NotImplementedError/.test(
      stubCode
    );

    // Count blueprint comments
    const blueprintMatches = stubCode.match(
      /\/\*\*[\s\S]*?Blueprint:[\s\S]*?\*\//g
    );
    report.blueprintComments = blueprintMatches ? blueprintMatches.length : 0;

    // Calculate compliance score (0-100)
    let score = 0;
    if (report.hasContractResultPattern) score += 25;
    if (report.hasNotImplementedErrors) score += 25;
    if (report.blueprintComments > 0) score += 25;
    if (report.codeLines > 10) score += 25; // Has substantive content

    report.complianceScore = score;

    return report;
  }
  /**
   * Blueprint: Generate appropriate file path for stub
   * Returns: string of suggested file path following SDD conventions
   */
  private generateFilePathSuggestion(componentName: string): string {
    // Convert component name to kebab-case for file naming
    const kebabName = componentName
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // SDD convention: src/agents/[component-name].ts
    return `src/agents/${kebabName}.ts`;
  }
}
