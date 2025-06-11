import { z } from 'zod';
import {
ContractResult,
succeed,
fail,
} from '../../contracts/contract-result.js';
import {
ToolModuleContract,
ToolDefinition,
} from '../../contracts/tool-module-contract.js';
import { SDDError } from '../../utils/sdd-error.js';
import { parse, TSESTree, AST_NODE_TYPES } from '@typescript-eslint/parser';
// import fs from 'fs'; // Would be needed for actual external rule file loading
// import path from 'path'; // Would be needed for actual external rule file loading

// --- Type Definitions for Validation Logic ---

interface ValidationViolation {
ruleId: string;
description: string;
message: string;
severity: 'error' | 'warning' | 'info';
location?: {
line: number;
column: number;
endLine?: number;
endColumn?: number;
};
fix?: {
description: string;
// For more advanced auto-fix, might include:
// type: 'replaceText' | 'insertText' | 'removeText';
// range: [number, number]; // Character offsets
// text?: string;
};
suggestion?: string;
}

// Forward declaration for ValidationContext
interface ValidationContext extends z.infer<typeof ValidationContextSchema> {}

interface ValidationRule {
id: string;
description: string;
longDescription?: string; // More detailed explanation of the rule
severity: 'error' | 'warning' | 'info';
appliesTo: ArtifactType[];
tags?: string[];
validate: (
params: {
content: string;
ast?: TSESTree.Program;
artifactPath: string;
validationContext: ValidationContext; // Now non-optional within the rule
// Helper for adding violations, ensures ruleId and description are pre-filled
addViolation: (details: Omit<ValidationViolation, 'ruleId' | 'description' | 'severity'>) => void;
}
) => void; // Rules now use addViolation to report, not return an array
}

// --- Zod Schemas for Input and Output ---

const ArtifactTypeSchema = z.enum([
'typescript_contract',
'typescript_stub',
'typescript_test',
'sdd_tool_source',
'project_config_json',
'any_typescript',
'markdown',
]);
type ArtifactType = z.infer<typeof ArtifactTypeSchema>;

const ValidationContextSchema = z.object({
projectName: z.string().optional(),
relatedFilePaths: z.array(z.string()).optional().describe("Paths to related files for contextual analysis"),
projectSddConfig: z.record(z.any()).optional().describe("Parsed project-level SDD configuration"),
failOnSeverity: z.array(z.enum(['error', 'warning', 'info'])).default(['error'])
.describe("Severity levels that should mark the artifact as non-compliant."),
blueprintCommentConfig: z.object({
minDensityPercent: z.number().min(0).max(100).default(5),
checkFiles: z.array(ArtifactTypeSchema).default(['any_typescript', 'markdown']),
minBlueprintsForMajorFiles: z.number().int().min(0).default(3).describe("Minimum blueprint comments for files considered 'major' (e.g., tools, core modules)."),
majorFileLinesThreshold: z.number().int().min(1).default(100).describe("Line count threshold to consider a file 'major' for blueprint checks."),
}).default({ minDensityPercent: 5, checkFiles: ['any_typescript', 'markdown'], minBlueprintsForMajorFiles: 3, majorFileLinesThreshold: 100 }),
// Example: Naming convention config from projectSddConfig
namingConventions: z.object({
interfacePrefix: z.string().default("I").describe("Expected prefix for interface names, e.g., 'I' for IUserService."),
// Add more conventions: classSuffix, functionCase, etc.
}).optional().default({ interfacePrefix: "I" }),
}).default({});
// type ValidationContext is declared above with z.infer

const ValidateComplianceInputSchema = z.object({
artifactContent: z.string().min(1, 'Artifact content cannot be empty.'),
artifactType: ArtifactTypeSchema,
artifactPath: z.string().min(1, 'Artifact path is required for context.'),
rulesetTags: z.array(z.string()).optional().describe('Tags to select a specific ruleset (e.g., ["strict-sdd", "typescript"]). Defaults to all applicable rules.'),
validationContext: ValidationContextSchema.optional(),
// ruleFilePaths: z.array(z.string()).optional().describe("Paths to external rule definition files (e.g., JSON)."), // For actual external loading
});
type ValidateComplianceInput = z.infer<typeof ValidateComplianceInputSchema>;

const ValidateComplianceOutputSchema = z.object({
isCompliant: z.boolean(),
artifactPath: z.string(),
artifactType: ArtifactTypeSchema,
summary: z.string(),
violations: z.array(
z.object({
ruleId: z.string(),
description: z.string(),
message: z.string(),
severity: z.enum(['error', 'warning', 'info']),
location: z.object({
line: z.number(),
column: z.number(),
endLine: z.number().optional(),
endColumn: z.number().optional(),
}).optional(),
fix: z.object({ description: z.string() }).optional(),
suggestion: z.string().optional(),
}),
),
metrics: z.object({
rulesChecked: z.number(),
errorsFound: z.number(),
warningsFound: z.number(),
infosFound: z.number(),
linesOfCode: z.number().optional(),
blueprintCommentDensity: z.number().optional().describe("Actual blueprint comment density percentage."),
}).optional(),
recommendations: z.array(z.string()).optional(),
sarifOutput: z.any().optional().describe("SARIF formatted output object (conceptual)."), // SARIF is JSON, so z.any() or a specific Zod schema for SARIF
});
type ValidateComplianceOutput = z.infer<typeof ValidateComplianceOutputSchema>;

// --- Tool Definition ---

const definition: ToolDefinition<
typeof ValidateComplianceInputSchema,
typeof ValidateComplianceOutputSchema

> = {
> name: 'sdd_validate_compliance',
> description: 'Validates SDD artifacts (contracts, stubs, tests, tools) against defined compliance rules using AST-based analysis where applicable.',
> inputSchema: ValidateComplianceInputSchema,
> outputSchema: ValidateComplianceOutputSchema,
> };

// --- AST Helper Utilities (Conceptual) ---
// Blueprint: These would be more fleshed out in a real system.
const ASTUtils = {
findExportedVariableDeclaration: (ast: TSESTree.Program, name: string): TSESTree.VariableDeclarator | undefined => {
for (const node of ast.body) {
if (node.type === AST_NODE_TYPES.ExportNamedDeclaration && node.declaration?.type === AST_NODE_TYPES.VariableDeclaration) {
for (const declarator of node.declaration.declarations) {
if (declarator.id.type === AST_NODE_TYPES.Identifier && declarator.id.name === name) {
return declarator;
}
}
}
}
return undefined;
},
getNodeProperty: (node: TSESTree.Node, propertyPath: string): TSESTree.Node | string | boolean | undefined => {
const pathParts = propertyPath.split('.');
let current: any = node;
for (const part of pathParts) {
if (current && typeof current === 'object' && part in current) {
current = current[part];
} else {
return undefined;
}
}
return current;
},
// Example visitor pattern utility (very basic)
visitNodes: (node: TSESTree.Node | undefined, nodeType: AST_NODE_TYPES, callback: (node: TSESTree.Node) => void): void => {
if (!node) return;
if (node.type === nodeType) {
callback(node);
}
for (const key in node) {
// @ts-ignore
const child = node[key];
if (child && typeof child === 'object') {
if (Array.isArray(child)) {
child.forEach(n => ASTUtils.visitNodes(n, nodeType, callback));
} else if (child.type) { // Check if it's an AST node
ASTUtils.visitNodes(child, nodeType, callback);
}
}
}
}
};

class SDDValidateComplianceTool {
private allRegisteredRules: ValidationRule[];

constructor(
// ruleFilePaths?: string[] // For actual external loading
// For now, simulate rule injection or use defaults
initialRules?: ValidationRule[]
) {
this.allRegisteredRules = [];
// Blueprint: SEAM - Extensible Rule Engine: Rule Loading and Registration.
// if (ruleFilePaths && ruleFilePaths.length > 0) {
// this.loadRulesFromFiles(ruleFilePaths);
// } else
if (initialRules && initialRules.length > 0) {
this.allRegisteredRules.push(...initialRules);
} else {
this.loadDefaultRules();
}
}

// private loadRulesFromFiles(filePaths: string[]): void {
// Blueprint: Implement logic to read rule definition files (e.g., JSON),
// validate their schema, and dynamically require/import their 'validate' functions.
// This is a complex task involving file system access (needs injection or a seam),
// dynamic imports, and robust error handling.
// Example:
// filePaths.forEach(filePath => {
// try {
// const ruleContent = fs.readFileSync(path.resolve(filePath), 'utf-8');
// const ruleData = JSON.parse(ruleContent);
// // Validate ruleData against a Zod schema for rule definitions
// // Dynamically load ruleData.validate_function_path
// // this.allRegisteredRules.push(loadedRule);
// } catch (error) {
// console.error(`Failed to load rule from ${filePath}:`, error);
// }
// });
// }

private loadDefaultRules(): void {
// Blueprint: Define a comprehensive default ruleset.
const defaultRules: ValidationRule[] = [
// --- SDD Tool Self-Validation Rules ---
{
id: 'SDD-TOOL-001',
description: 'TOOL_MODULE_CONTRACT: Handler Signature',
longDescription: 'SDD Tool `handler` methods in `TOOL_MODULE_CONTRACT` must be async and return `Promise<ContractResult<T>>`. This ensures consistency and proper error handling within the MCP server.',
severity: 'error',
appliesTo: ['sdd_tool_source'],
tags: ['sdd-tooling', 'contract'],
validate: ({ ast, artifactPath, addViolation }) => {
if (!ast) return;
const toolModuleDeclarator = ASTUtils.findExportedVariableDeclaration(ast, 'TOOL_MODULE_CONTRACT');
if (!toolModuleDeclarator) {
addViolation({ message: `Missing 'TOOL_MODULE_CONTRACT' export. All SDD tools must export this contract.`, location: ast.loc?.start });
return;
}

          if (toolModuleDeclarator.init?.type === AST_NODE_TYPES.ObjectExpression) {
            const handlerProp = toolModuleDeclarator.init.properties.find(
              p => p.type === AST_NODE_TYPES.Property && (p.key as TSESTree.Identifier)?.name === 'handler'
            ) as TSESTree.Property | undefined;

            if (!handlerProp) {
                addViolation({ message: `'TOOL_MODULE_CONTRACT' is missing the 'handler' property.`, location: toolModuleDeclarator.init.loc?.start });
                return;
            }

            if (handlerProp.value.type === AST_NODE_TYPES.ArrowFunctionExpression || handlerProp.value.type === AST_NODE_TYPES.FunctionExpression) {
              const handlerFunc = handlerProp.value;
              if (!handlerFunc.async) {
                addViolation({
                  message: `Tool handler is not async. SDD tool handlers must be async.`,
                  location: handlerFunc.loc?.start,
                  fix: { description: "Prepend 'async' to the handler function signature." },
                });
              }
              const returnType = handlerFunc.returnType?.typeAnnotation;
              if (!returnType || returnType.type !== AST_NODE_TYPES.TSTypeReference || (returnType.typeName as TSESTree.Identifier)?.name !== 'Promise') {
                addViolation({ message: `Tool handler must return a Promise. Expected Promise<ContractResult<T>>.`, location: (returnType || handlerFunc).loc?.start });
              } else if (!returnType.typeParameters || returnType.typeParameters.params.length !== 1 ||
                         returnType.typeParameters.params[0].type !== AST_NODE_TYPES.TSTypeReference ||
                         ((returnType.typeParameters.params[0] as TSESTree.TSTypeReference).typeName as TSESTree.Identifier)?.name !== 'ContractResult') {
                addViolation({ message: `Tool handler Promise must wrap ContractResult. Expected Promise<ContractResult<T>>.`, location: returnType.typeParameters?.loc || returnType.loc });
              }
            } else {
              addViolation({ message: `Tool handler must be a function or arrow function.`, location: handlerProp.value.loc });
            }
          } else {
            addViolation({ message: `'TOOL_MODULE_CONTRACT' must be an object literal.`, location: toolModuleDeclarator.init?.loc || toolModuleDeclarator.loc });
          }
        },
      },
      {
        id: 'SDD-TOOL-002',
        description: 'TOOL_MODULE_CONTRACT: Definition Structure',
        longDescription: '`TOOL_MODULE_CONTRACT` must have a `definition` property with `name`, `description`, `inputSchema` (Zod), and `outputSchema` (Zod).',
        severity: 'error',
        appliesTo: ['sdd_tool_source'],
        tags: ['sdd-tooling', 'contract'],
        validate: ({ ast, artifactPath, addViolation }) => {
            if (!ast) return;
            const tmc = ASTUtils.findExportedVariableDeclaration(ast, 'TOOL_MODULE_CONTRACT');
            if (!tmc?.init || tmc.init.type !== AST_NODE_TYPES.ObjectExpression) return; // Covered by SDD-TOOL-001

            const defProp = tmc.init.properties.find(p => p.type === AST_NODE_TYPES.Property && (p.key as TSESTree.Identifier)?.name === 'definition') as TSESTree.Property | undefined;
            if (!defProp || defProp.value.type !== AST_NODE_TYPES.ObjectExpression) {
                addViolation({ message: `'TOOL_MODULE_CONTRACT' is missing a valid 'definition' object.`, location: tmc.init.loc?.start });
                return;
            }
            const requiredKeys = ['name', 'description', 'inputSchema', 'outputSchema'];
            requiredKeys.forEach(key => {
                const keyProp = defProp.value.properties.find(p => p.type === AST_NODE_TYPES.Property && (p.key as TSESTree.Identifier)?.name === key);
                if (!keyProp) {
                    addViolation({ message: `Tool 'definition' is missing required property '${key}'.`, location: defProp.value.loc?.start });
                }
                // Blueprint: Add checks for Zod schema types for inputSchema/outputSchema if possible (complex AST check)
            });
        }
      },
      // --- General SDD Compliance Rules ---
      {
        id: 'SDD-COMMON-001',
        description: 'Blueprint Comment Density and Quality',
        longDescription: 'Key code sections, classes, and complex functions should be documented with SDD blueprint comments. Markdown files should also reflect design blueprints.',
        severity: 'warning',
        appliesTo: ['any_typescript', 'markdown'],
        tags: ['documentation', 'sdd-common'],
        validate: ({ content, ast, artifactPath, validationContext, addViolation }) => {
          const lines = content.split('\n');
          const totalLines = lines.length;
          if (totalLines < 10 && artifactPath?.endsWith('.md')) return; // Ignore very short markdown
          if (totalLines < 20 && !artifactPath?.endsWith('.md')) return; // Ignore very short code files

          let blueprintCommentCount = 0;
          let blueprintLineNumbers: number[] = [];

          if (ast?.comments) {
            ast.comments.forEach(comment => {
              if (comment.value.trim().toLowerCase().startsWith('blueprint:')) {
                blueprintCommentCount++;
                if(comment.loc) blueprintLineNumbers.push(comment.loc.start.line);
              }
            });
          } else if (artifactPath?.endsWith('.md')) {
            lines.forEach((line, index) => {
              const lowerLine = line.trim().toLowerCase();
              if (lowerLine.includes('blueprint:') || lowerLine.startsWith('## 🎯') || lowerLine.startsWith('### 🎯') || lowerLine.startsWith('#### 🎯') || lowerLine.startsWith('## seam') || lowerLine.startsWith('### seam')) {
                blueprintCommentCount++;
                blueprintLineNumbers.push(index + 1);
              }
            });
          }

          const config = validationContext.blueprintCommentConfig;
          const density = totalLines > 0 ? (blueprintCommentCount / totalLines) * 100 : 0;
          const densityMet = density >= config.minDensityPercent;

          let majorFileBlueprintsMet = true;
          if (config.checkFiles.includes(ArtifactTypeSchema.parse(validationContext.artifactType)) && totalLines >= config.majorFileLinesThreshold) {
            if (blueprintCommentCount < config.minBlueprintsForMajorFiles) {
                majorFileBlueprintsMet = false;
            }
          }

          if (!densityMet || !majorFileBlueprintsMet) {
            let message = `Low blueprint comment engagement in '${artifactPath}'. `;
            if (!densityMet) message += `Density is ${density.toFixed(1)}% (found ${blueprintCommentCount}), expected at least ${config.minDensityPercent}%. `;
            if (!majorFileBlueprintsMet) message += `As a major file (${totalLines} lines), expected at least ${config.minBlueprintsForMajorFiles} blueprint comments, found ${blueprintCommentCount}. `;
            message += "Remember, blueprints are your friends for clarity and future you! 🗺️";
            addViolation({
              message,
              location: { line: 1, column: 0 },
              suggestion: 'Enhance maintainability by adding detailed blueprint comments to key architectural decisions, complex logic, classes, and functions. For markdown, ensure design sections are clearly marked.',
            });
          }
        },
      },
      {
        id: 'SDD-CONTRACT-001',
        description: 'Contract Naming Convention (Interface Prefix)',
        severity: 'info', // Often a stylistic choice, so 'info' or 'warning'
        appliesTo: ['typescript_contract'],
        tags: ['naming', 'contract'],
        validate: ({ ast, artifactPath, validationContext, addViolation }) => {
            if (!ast) return;
            const prefix = validationContext.namingConventions?.interfacePrefix || "I";
            ASTUtils.visitNodes(ast, AST_NODE_TYPES.TSInterfaceDeclaration, (node) => {
                const interfaceNode = node as TSESTree.TSInterfaceDeclaration;
                if (!interfaceNode.id.name.startsWith(prefix)) {
                    addViolation({
                        message: `Interface '${interfaceNode.id.name}' does not follow the naming convention. Expected prefix: '${prefix}'. (e.g. ${prefix}MyService)`,
                        location: interfaceNode.id.loc,
                        suggestion: `Rename the interface to '${prefix}${interfaceNode.id.name}'. This project loves consistent naming! 😊`
                    });
                }
            });
        }
      },
      {
        id: 'SDD-IMPORT-001',
        description: 'Use .js Extension in Imports',
        longDescription: 'All relative module imports in TypeScript files compiled to ESModules must use the .js extension to ensure compatibility in Node.js environments.',
        severity: 'error',
        appliesTo: ['any_typescript', 'sdd_tool_source'],
        tags: ['module-system', 'compatibility'],
        validate: ({ ast, artifactPath, addViolation }) => {
            if (!ast) return;
            ASTUtils.visitNodes(ast, AST_NODE_TYPES.ImportDeclaration, (node) => {
                const importNode = node as TSESTree.ImportDeclaration;
                if (importNode.source.type === AST_NODE_TYPES.Literal && typeof importNode.source.value === 'string') {
                    const importPath = importNode.source.value;
                    // Check for relative paths that are missing .js and don't end with .json (or other valid extensions)
                    if (importPath.startsWith('.') && !importPath.endsWith('.js') && !importPath.endsWith('.json') /* add other valid extensions if any */) {
                        // A more robust check would involve resolving the path and checking if it's a directory (implying index.js)
                        // or a .ts file that would compile to .js. For simplicity, this is a basic check.
                        if (!importPath.includes('node_modules')) { // Rough check to ignore node_modules paths
                             addViolation({
                                message: `Import path '${importPath}' should use the '.js' extension for ESModule compatibility.`,
                                location: importNode.source.loc,
                                fix: { description: `Change import to '${importPath}.js'.` },
                                suggestion: `Update the import path to '${importPath}.js'. This ensures your code plays nicely with Node.js modules! 🚀`
                            });
                        }
                    }
                }
            });
        }
      },
      // Blueprint: Add more rules:
      // - SDD-STUB-001: Stubs must use NotImplementedError.
      // - SDD-TEST-001: Tests must import and test the contract.
      // - SDD-TOOL-003: Tool metadata (version, author, tags) presence.
      // - CONFIG-001 (already present, but could be enhanced).
    ];
    this.allRegisteredRules.push(...defaultRules);

}

private getApplicableRules(artifactType: ArtifactType, rulesetTags?: string[]): ValidationRule[] {
return this.allRegisteredRules.filter(rule => {
const typeMatch = rule.appliesTo.includes(artifactType) ||
(artifactType.startsWith('typescript\_') && rule.appliesTo.includes('any_typescript')) ||
(artifactType === 'sdd_tool_source' && rule.appliesTo.includes('any_typescript'));
if (!typeMatch) return false;
if (!rulesetTags || rulesetTags.length === 0) return true;
return rulesetTags.some(tag => rule.tags?.includes(tag));
});
}

public async execute(
input: ValidateComplianceInput,
): Promise<ContractResult<ValidateComplianceOutput>> {
let ast: TSESTree.Program | undefined;
const allViolations: ValidationViolation[] = [];
// Ensure validationContext is always an object, merging defaults with input
const effectiveValidationContext: ValidationContext = ValidationContextSchema.parse({
...(this.allRegisteredRules.length > 0 ? {} : {}), // Ensure schema default is triggered if input.validationContext is undefined
...input.validationContext
});

    let rulesChecked = 0;
    let errorsFound = 0;
    let warningsFound = 0;
    let infosFound = 0;
    const linesOfCode = input.artifactContent.split('\n').length;
    let blueprintCommentDensity: number | undefined;

    if (input.artifactType.startsWith('typescript_') || input.artifactType === 'sdd_tool_source' || input.artifactType === 'any_typescript') {
      try {
        ast = parse(input.artifactContent, {
          ecmaVersion: 'latest', sourceType: 'module', loc: true, comment: true,
        });
      } catch (e: any) {
        return fail(
          new SDDError('ArtifactParsingError', `Failed to parse TypeScript artifact ${input.artifactPath}: ${e.message}`,
            { line: e.lineNumber, column: e.column, originalError: e }),
        );
      }
    }

    const applicableRules = this.getApplicableRules(input.artifactType, input.rulesetTags);

    for (const rule of applicableRules) {
      rulesChecked++;
      const ruleViolationsCollector: ValidationViolation[] = [];
      const addViolationForRule = (details: Omit<ValidationViolation, 'ruleId' | 'description' | 'severity'>) => {
        ruleViolationsCollector.push({
            ...details,
            ruleId: rule.id,
            description: rule.description,
            severity: rule.severity,
        });
      };

      try {
        rule.validate({
          content: input.artifactContent,
          ast,
          artifactPath: input.artifactPath,
          validationContext: effectiveValidationContext,
          addViolation: addViolationForRule,
        });

        ruleViolationsCollector.forEach(v => {
          allViolations.push(v);
          if (v.severity === 'error') errorsFound++;
          else if (v.severity === 'warning') warningsFound++;
          else infosFound++;
        });
      } catch (e: any) {
        console.error(`Critical error executing rule ${rule.id} on ${input.artifactPath}: ${e.message}\n${e.stack}`);
        allViolations.push({
            ruleId: rule.id, description: rule.description, severity: 'error',
            message: `Rule execution itself failed catastrophically: ${e.message}. This is a bug in the rule or validator.`,
            suggestion: "Check the validation tool's console logs for stack trace. This rule is temporarily bypassed."
        });
        errorsFound++;
      }
    }
    // Calculate blueprint density if applicable
    if (effectiveValidationContext.blueprintCommentConfig.checkFiles.includes(input.artifactType)) {
        let blueprintCommentCount = 0;
        if (ast?.comments) {
            ast.comments.forEach(comment => {
              if (comment.value.trim().toLowerCase().startsWith('blueprint:')) blueprintCommentCount++;
            });
        } else if (input.artifactType === 'markdown') {
             input.artifactContent.split('\n').forEach((line) => {
              const lowerLine = line.trim().toLowerCase();
              if (lowerLine.includes('blueprint:') || lowerLine.startsWith('## 🎯') || lowerLine.startsWith('### 🎯')) blueprintCommentCount++;
            });
        }
        blueprintCommentDensity = linesOfCode > 0 ? parseFloat(((blueprintCommentCount / linesOfCode) * 100).toFixed(1)) : 0;
    }


    let isCompliant = true;
    if (effectiveValidationContext.failOnSeverity?.includes('error') && errorsFound > 0) isCompliant = false;
    if (effectiveValidationContext.failOnSeverity?.includes('warning') && warningsFound > 0) isCompliant = false;
    if (effectiveValidationContext.failOnSeverity?.includes('info') && infosFound > 0) isCompliant = false;

    let summary = `Validation for '${input.artifactPath}' (${input.artifactType}) ${isCompliant ? 'looks great! 🎉 Keep rocking that SDD style!' : 'needs a little TLC.'}`;
    if (errorsFound > 0) summary += ` ${errorsFound} error(s) found.`;
    if (warningsFound > 0) summary += ` ${warningsFound} warning(s) noted.`;
    if (infosFound > 0) summary += ` ${infosFound} info(s) for your consideration.`;
    if (isCompliant && rulesChecked > 0) summary += ` All ${rulesChecked} applicable rules passed. Stellar job! 🌟`;
    else if (rulesChecked === 0) summary = `Hmm, no applicable validation rules found for '${input.artifactPath}' (type: '${input.artifactType}', tags: '${input.rulesetTags?.join(', ')}'). Maybe check the tags or artifact type? 🤔`;


    const recommendations: string[] = [];
    if (!isCompliant) {
        if (errorsFound > 0) recommendations.push(`High Priority: Address the ${errorsFound} error(s) to ensure full SDD compliance and prevent potential runtime surprises. You got this! 💪`);
        if (warningsFound > 0 && effectiveValidationContext.failOnSeverity?.includes('warning')) {
            recommendations.push(`Attention: ${warningsFound} warning(s) impacted compliance. Fixing these will boost quality and make your code shine! ✨`);
        }
    } else if (warningsFound > 0) {
        recommendations.push(`Good to Know: While compliant, there are ${warningsFound} warning(s). Addressing them could be a nice polish. Keep up the awesome work!`);
    }
    if (isCompliant && rulesChecked > 0) {
        recommendations.push("Fantastic! This artifact is a shining example of SDD best practices according to the checked rules. Pat yourself on the back! 🏆");
    }


    // Blueprint: SARIF Output Generation
    // const sarifResult = this.generateSarif(allViolations, applicableRules, input.artifactPath); // Conceptual
    const sarifResult = undefined; // Placeholder

    const output: ValidateComplianceOutput = {
      isCompliant,
      artifactPath: input.artifactPath,
      artifactType: input.artifactType,
      summary,
      violations: allViolations,
      metrics: {
        rulesChecked,
        errorsFound,
        warningsFound,
        infosFound,
        linesOfCode,
        blueprintCommentDensity,
      },
      recommendations: recommendations.length > 0 ? recommendations : undefined,
      sarifOutput: sarifResult,
    };
    return succeed(output);

}

// private generateSarif(violations: ValidationViolation[], rules: ValidationRule[], artifactPath: string): any {
// Blueprint: Implement SARIF v2.1.0 object generation.
// This involves mapping your internal rule and violation structures to SARIF's schema.
// Key SARIF components: runs[].tool.driver.rules, runs[].results.
// return {
// version: "2.1.0",
// $schema: "http://json.schemastore.org/sarif-2.1.0-rtm.5",
// runs: [ /* ... populate based on violations and rules ... */ ]
// };
// }
}

const sddValidateComplianceToolInstance = new SDDValidateComplianceTool();

export const TOOL_MODULE_CONTRACT: ToolModuleContract<
typeof ValidateComplianceInputSchema,
typeof ValidateComplianceOutputSchema

> = {
> definition,
> handler: async (input: ValidateComplianceInput) => {

    // Consider instantiating SDDValidateComplianceTool here if ruleFilePaths are passed in input
    // and need to be used for constructor, otherwise the singleton instance is fine.
    // For example:
    // const toolInstance = input.ruleFilePaths
    //   ? new SDDValidateComplianceTool(input.ruleFilePaths)
    //   : sddValidateComplianceToolInstance;
    // return toolInstance.execute(input);
    return sddValidateComplianceToolInstance.execute(input);

},
metadata: {
name: definition.name,
version: '1.1.0', // Version bump for enhancements
author: 'Gemini Code Assist (Supercharged)',
tags: ['sdd', 'validation', 'compliance', 'ast', 'typescript', 'linting', 'extensible'],
dependencies: ['@typescript-eslint/parser', 'zod'],
}
};

/\*\*

- USAGE EXAMPLES:
- (Same as before, but `rulesetId` is now `rulesetTags` and `validationContext` is richer)
-
- // Conceptual structure for an external rule definition file (e.g., sdd-rules.json):
- // [
- // {
- // "id": "CUSTOM-RULE-001",
- // "description": "Custom project-specific naming convention for services.",
- // "longDescription": "Ensures all service implementation classes end with 'ServiceImpl'.",
- // "severity": "warning",
- // "appliesTo": ["any_typescript"],
- // "tags": ["naming", "project-specific", "service"],
- // "validate_function_module_path": "./custom-rules/serviceNamingRule.js" // Path to a module exporting the validate function
- // }
- // ]
- // The tool's `RuleLoader` (not fully implemented here) would handle loading this.
  \*/
