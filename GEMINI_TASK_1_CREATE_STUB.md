# GEMINI TASK 1: sdd_create_stub

**FILE**: `src/tools/legacy/sdd-create-stub-tool.ts`

**TASK**: Replace 3 NotImplementedError methods with template-based code generation

**GEMINI'S EXACT SUGGESTIONS**:

- Take **highly structured contract definition** (not raw code)
- Generate **well-commented, SDD-compliant code stubs**
- Use **template application** for consistency

**INPUT SCHEMA** (per Gemini):

```typescript
{
  interfaceName: string,
  componentName: string,
  methods: [{
    name: string,
    params: [{ name: string, type: string }],
    returnType: string
  }],
  dataStructures?: [{
    name: string,
    properties: [{ name: string, type: string }]
  }]
}
```

**OUTPUT SCHEMA** (per Gemini):

```typescript
{
  stubCode: string,
  filePathSuggestion: string,
  blueprintCommentsCount: number
}
```

**WHAT TO IMPLEMENT**:

1. **Parse contract interfaces** - extract methods, parameters, return types
2. **Apply predefined templates** - consistent stub generation
3. **Generate blueprint comments** - proper SDD format

**APPROACH**: Parse TypeScript contract input → Apply templates → Generate structured stub code with metadata.

**EXAMPLE OUTPUT**:

```typescript
{
  stubCode: "class UserServiceImpl implements UserService { async authenticate(credentials: LoginCredentials): Promise<ContractResult<AuthToken>> { throw new NotImplementedError('UserServiceImpl.authenticate', 'Blueprint: Validate credentials...'); } }",
  filePathSuggestion: "src/agents/user-service-impl.ts",
  blueprintCommentsCount: 1
}
```

--- a/c/Users/thump/SkepticalWombat/src/tools/legacy/sdd-create-stub-tool.ts
+++ b/c/Users/thump/SkepticalWombat/src/tools/legacy/sdd-create-stub-tool.ts
@@ -15,10 +15,11 @@
// Blueprint: Define the internal structure for a parsed contract method
interface ParsedMethod {
name: string;

- parameters: Array<{ name: string; type: string; optional?: boolean }>;

* // Parameters now directly use the input schema's 'params' structure
* params: Array<{ name: string; type: string; optional?: boolean }>;
  returnType: string; // Full return type string e.g. Promise<ContractResult<AuthToken>>
  contractResultType: string; // Just the T from ContractResult<T>

- isAsync: boolean;

* isAsync: boolean; // Determined by presence of Promise in returnType
  }

// Blueprint: Define the internal structure for a parsed contract
@@ -26,7 +27,11 @@
interfaceName: string;
componentName: string; // The name of the class that will implement the interface
methods: ParsedMethod[];

- imports: Set<string>; // To collect necessary import statements

* // Imports will be derived from method param types and return types
* dataStructures?: Array<{ // As per your input schema
* name: string;
* properties: Array<{ name: string; type: string }>;
* }>;
  }

// Blueprint: Define the internal structure for validation results
@@ -38,15 +43,23 @@

// Blueprint: Define Zod schema for the tool's input, now expecting structured contract data
const CreateStubInputSchema = z.object({

- contractCode: z.string().min(1, 'Contract code cannot be empty.'),

* interfaceName: z.string().min(1, 'Interface name is required.'),
  componentName: z.string().min(1, 'Component name is required.'),

- templateType: z.enum(['default', 'service', 'agent']).optional(),

* methods: z.array(
* z.object({
*      name: z.string().min(1, 'Method name is required.'),
*      params: z.array(
*        z.object({
*          name: z.string().min(1, 'Parameter name is required.'),
*          type: z.string().min(1, 'Parameter type is required.'),
*          optional: z.boolean().optional(),
*        }),
*      ),
*      returnType: z.string().min(1, 'Return type is required.'),
* }),
* ).min(1, 'At least one method is required.'),
* dataStructures: z.array(z.object({ name: z.string(), properties: z.array(z.object({ name: z.string(), type: z.string() }))})).optional(),
* templateType: z.enum(['default', 'service', 'agent']).optional(), // Retained for potential future use
  });
  type CreateStubInput = z.infer<typeof CreateStubInputSchema>;

@@ -54,9 +67,9 @@
const CreateStubOutputSchema = z.object({
stubCode: z.string(),
filePathSuggestion: z.string(),

- className: z.string(),
- methodsCount: z.number(),
- blueprintCommentsCount: z.number(),

* // className: z.string(), // componentName from input can be used
* // methodsCount: z.number(), // Can be derived from input.methods.length
* blueprintCommentsCount: z.number(), // Count of generated blueprint comments
  });
  type CreateStubOutput = z.infer<typeof CreateStubOutputSchema>;

@@ -100,10 +113,11 @@
private isPrimitiveOrBuiltIn(type: string): boolean {
const primitives = ['string', 'number', 'boolean', 'null', 'undefined', 'symbol', 'bigint', 'any', 'unknown', 'void', 'never'];
const builtIns = ['Date', 'RegExp', 'Error', 'Array', 'Map', 'Set', 'Promise', 'Object']; // Add more as needed

- return primitives.includes(type) || builtIns.includes(type.replace(/<.\*>$/, '')); // Handle generics like Array<T>

* const cleanType = type.replace(/\[\]$/, '').split('<')[0]; // Handle T[] and T<U>
* return primitives.includes(cleanType) || builtIns.includes(cleanType);
  }

- // Blueprint: Define the main tool execution logic.
- // Blueprint: This orchestrates parsing, generation, and validation.

*
* // Blueprint: Orchestrates processing the structured contract, generating stubs, and validation.
  public async execute(
  input: CreateStubInput,
  ): Promise<ContractResult<CreateStubOutput>> {
  @@ -112,7 +126,7 @@
  try {
  // Step 1: Process the (already structured) contract definition

-      const contractDef = await this.processContractDefinition(input);

*      const contractDef = this.processStructuredContractInput(input);

         // Step 2: Generate the stub implementation code
         const stubGenerationResult = await this.generateStubImplementation(

  @@ -130,10 +144,8 @@
  const output: CreateStubOutput = {
  stubCode: stubGenerationResult.stubCode,

-        filePathSuggestion: `src/components/${contractDef.componentName.toLowerCase()}.ts`, // Example path
-        className: contractDef.componentName,
-        methodsCount: contractDef.methods.length,
-        blueprintCommentsCount: contractDef.methods.length, // Each method gets one blueprint comment

*        filePathSuggestion: `src/${contractDef.componentName.replace(/Impl$/, '').toLowerCase()}/${contractDef.componentName}.ts`, // e.g. src/user/UserServiceImpl.ts
*        blueprintCommentsCount: stubGenerationResult.blueprintCommentsCount,
         };

         return succeed(output);

  @@ -150,80 +162,57 @@
  }
  /\*\*

- - Parses the TypeScript contract code to extract interface and method definitions.
- - @param input - The input containing the contract code and component name.
- - @returns A Promise resolving to the parsed contract definition.

* - Processes the already structured contract input to prepare it for stub generation.
* - This mainly involves deriving `contractResultType` and `isAsync` for each method.
* - @param input - The structured input adhering to CreateStubInputSchema.
* - @returns The processed ContractDefinition.
    \*/

- private async processContractDefinition(

* private processStructuredContractInput(
  input: CreateStubInput,

- ): Promise<ContractDefinition> {
- // Blueprint: Use @typescript-eslint/parser to parse the contract code.
- // Blueprint: Traverse the AST to find interface declarations and their method signatures.
- // Blueprint: Extract method names, parameters (name, type, optional), and full return types.
- // Blueprint: Specifically identify the 'T' in Promise<ContractResult<T>>.
- // Blueprint: Collect necessary type names for import generation.
-
- const { contractCode, componentName } = input;
- const imports = new Set<string>();
-
- try {
-      const ast = parse(contractCode, {
-        ecmaVersion: 'latest',
-        sourceType: 'module',
-        loc: true, // Enable location data for substring extraction
-      });
-
-      let interfaceName = '';
-      const methods: ParsedMethod[] = [];
-
-      for (const node of ast.body) {
-        if (node.type === AST_NODE_TYPES.TSInterfaceDeclaration) {
-          interfaceName = node.id.name;
-          for (const element of node.body.body) {
-            if (element.type === AST_NODE_TYPES.TSMethodSignature) {
-              const methodName = (element.key as TSESTree.Identifier).name;
-              const parameters = element.params.map(param => {
-                if (param.type === AST_NODE_TYPES.Identifier && param.typeAnnotation) {
-                  const typeNode = param.typeAnnotation.typeAnnotation;
-                  // Use contractCode.substring to get the exact type string from the source
-                  const typeText = contractCode.substring(typeNode.range[0], typeNode.range[1]);
-                  // Add base type for arrays (e.g., MyType[] -> MyType)
-                  const baseType = typeText.replace(/\[\]$/, '');
-                  if (!this.isPrimitiveOrBuiltIn(baseType)) imports.add(baseType);
-                  return {
-                    name: param.name,
-                    type: typeText,
-                    optional: param.optional || false,
-                  };
-                }
-                // Fallback for more complex parameter types not fully handled here
-                return { name: (param as TSESTree.Identifier).name || 'unknownParam', type: 'any', optional: (param as TSESTree.Parameter & { optional?: boolean}).optional || false };
-              });
-
-              let returnType = 'Promise<ContractResult<void>>'; // Default
-              let contractResultType = 'void';
-              let isAsync = false;
-
-              if (element.returnType && element.returnType.typeAnnotation) {
-                const rtNode = element.returnType.typeAnnotation;
-                returnType = contractCode.substring(rtNode.range[0], rtNode.range[1]);
-                isAsync = returnType.startsWith('Promise<');
-
-                const crMatch = returnType.match(/Promise<ContractResult<(.+)>>/);
-                if (crMatch && crMatch[1]) {
-                  contractResultType = crMatch[1];
-                  imports.add('ContractResult');
-                  const baseCrType = contractResultType.replace(/\[\]$/, '');
-                  if (!this.isPrimitiveOrBuiltIn(baseCrType) && baseCrType !== 'void') {
-                     imports.add(baseCrType);
-                  }
-                } else if (isAsync) {
-                    const promiseContentMatch = returnType.match(/Promise<(.+)>/);
-                    if(promiseContentMatch && promiseContentMatch[1]) {
-                        contractResultType = promiseContentMatch[1]; // This is T if Promise<T>
-                        const basePromiseType = contractResultType.replace(/\[\]$/, '');
-                        if (!this.isPrimitiveOrBuiltIn(basePromiseType) && basePromiseType !== 'void') {
-                           imports.add(basePromiseType);
-                        }
-                    }
-                } else { // Not async, not Promise<ContractResult<T>>
-                    contractResultType = returnType;
-                    const baseReturnType = returnType.replace(/\[\]$/, '');
-                    if (!this.isPrimitiveOrBuiltIn(baseReturnType) && baseReturnType !== 'void') {
-                        imports.add(baseReturnType);
-                    }
-                }
-              }
-
-              methods.push({
-                name: methodName,
-                parameters,
-                returnType,
-                contractResultType,
-                isAsync,
-              });
-            }

* ): ContractDefinition {
* // Blueprint: Iterate through input methods to determine `isAsync` and `contractResultType`.
* // Blueprint: `contractResultType` is T from Promise<ContractResult<T>>, or T from Promise<T>, or the direct return type.
*
* const processedMethods: ParsedMethod[] = input.methods.map(method => {
*      const isAsync = method.returnType.startsWith('Promise<');
*      let contractResultType = 'void'; // Default
*
*      const crMatch = method.returnType.match(/Promise<ContractResult<(.+)>>/);
*      if (crMatch && crMatch[1]) {
*        contractResultType = crMatch[1];
*      } else {
*        const promiseMatch = method.returnType.match(/Promise<(.+)>/);
*        if (promiseMatch && promiseMatch[1]) {
*          contractResultType = promiseMatch[1];
*        } else {
*          contractResultType = method.returnType; // Direct return type
*        }
*      }
*
*      return {
*        name: method.name,
*        params: method.params, // Use params directly from input
*        returnType: method.returnType,
*        contractResultType: contractResultType,
*        isAsync: isAsync,
*      };
* });
*
* return {
*      interfaceName: input.interfaceName,
*      componentName: input.componentName,
*      methods: processedMethods,
*      dataStructures: input.dataStructures,
* };
* }
*
* /\*\*
* - Generates the TypeScript stub class implementation string.
* - @param contractDef - The processed contract definition.
* - @returns A Promise resolving to an object containing the stub code string and blueprint comment count.
* \*/
* private async generateStubImplementation(
* contractDef: ContractDefinition,
* ): Promise<{ stubCode: string; blueprintCommentsCount: number }> {
* // Blueprint: Construct the class string using template literals.
* // Blueprint: Include necessary imports (ContractResult, SDDError, NotImplementedError, and types from contract).
* // Blueprint: Generate each method from contractDef.methods.
* // Blueprint: Ensure methods are async if their return type is Promise<...>.
* // Blueprint: Populate NotImplementedError with the class and method name, and a detailed blueprint.
*
* const { interfaceName, componentName, methods } = contractDef;
* let blueprintCommentsCount = 0;
*
* const importStatements = new Set<string>();
* importStatements.add(`import { ContractResult, succeed, fail } from '../../contracts/contract-result.js';`);
* importStatements.add(`import { SDDError, NotImplementedError } from '../../utils/sdd-error.js';`);
*
* // Collect types for import from method parameters and return types
* methods.forEach(method => {
*      method.params.forEach(p => {
*        const baseType = p.type.replace(/\[\]$/, '').split('<')[0];
*        if (!this.isPrimitiveOrBuiltIn(baseType)) {
*          importStatements.add(baseType);
*        }
*      });
*      const baseReturnType = method.contractResultType.replace(/\[\]$/, '').split('<')[0];
*      if (!this.isPrimitiveOrBuiltIn(baseReturnType) && baseReturnType !== 'void') {
*        importStatements.add(baseReturnType);
*      }
* });
*
* // Collect types from dataStructures if provided
* if (contractDef.dataStructures) {
*        contractDef.dataStructures.forEach(ds => {
*            if (!this.isPrimitiveOrBuiltIn(ds.name)) importStatements.add(ds.name);
*            ds.properties.forEach(prop => {
*                const baseType = prop.type.replace(/\[\]$/, '').split('<')[0];
*                if (!this.isPrimitiveOrBuiltIn(baseType)) importStatements.add(baseType);
*            });
*        });
* }
*
* const uniqueImports = Array.from(importStatements)
*        .filter(type => type && type !== 'ContractResult' && type !== 'Promise' && type !== 'SDDError' && type !== 'NotImplementedError') // Filter out already handled or non-importable
*        .map(type => `import { ${type} } from '../types'; // Blueprint: Verify/adjust import path for '${type}'`)
*        .sort();
*
* const methodStubs = methods
*      .map(method => {
*        const paramsString = method.params
*          .map(p => `${p.name}${p.optional ? '?' : ''}: ${p.type}`)
*          .join(', ');
*        const asyncKeyword = method.isAsync ? 'async ' : '';
*        const blueprintMessage = `Blueprint: Implement logic for ${method.name}. Inputs: ${method.params.map(p=>p.name).join(', ') || 'none'}. Expected output type: ${method.contractResultType}.`;
*        blueprintCommentsCount++;
*
*        return `
* ${asyncKeyword}${method.name}(${paramsString}): ${method.returnType} {
* // ${blueprintMessage}
* throw new NotImplementedError('${componentName}.${method.name}', '${blueprintMessage.replace(/'/g, "\\'") /_ escape single quotes _/}');
* // Example for ${method.returnType.includes('ContractResult') ? 'ContractResult success' : 'direct return'}:
* // ${method.returnType.includes('ContractResult') ? `// return succeed(/* value_of_type_${method.contractResultType} _/);`:`// return /_ value*of_type*${method.contractResultType} \*/;`}
* // Example for ContractResult failure (if applicable):
* // ${method.returnType.includes('ContractResult') ? `// return fail(new SDDError('YourErrorCode', 'Error message for ${method.name}'));` : ''}
* }`;
*      })
*      .join('');
*
* const classComment = `/\*\*
* - Implements the ${interfaceName} contract.
* - Blueprint: This class provides the concrete implementation for ${interfaceName}.
* - Each method should be implemented to fulfill the contract's purpose.
* \*/`;
*
* const stubCode = `${importStatements.has('ContractResult') ? "import { ContractResult, succeed, fail } from '../../contracts/contract-result.js';" : ""}
+${importStatements.has('SDDError') || importStatements.has('NotImplementedError') ? "import { SDDError, NotImplementedError } from '../../utils/sdd-error.js';" : ""}
  +${uniqueImports.join('\n')}
* +${classComment}
+export class ${componentName} implements ${interfaceName} {${methodStubs}
  +}
  +`;
* return { stubCode, blueprintCommentsCount };
* }
*
* /\*\*
* - Validates the syntax of the generated TypeScript stub code.
* - @param stubCode - The TypeScript code string to validate.
* - @returns A Promise resolving to the validation result.
* \*/
* private async validateStubOutput(
* stubCode: string,
* ): Promise<ValidationResult> {
* // Blueprint: Use @typescript-eslint/parser to parse the generated stubCode.
* // Blueprint: If parsing fails, report syntax errors including line and column if available.
*
* const errors: Array<{ message: string; line?: number; column?: number }> = [];
* try {
*      parse(stubCode, {
*        ecmaVersion: 'latest',
*        sourceType: 'module',
*        loc: true,
*      });
*      return { isValid: true, errors: [] };
* } catch (error: any) {
*      const errorMessage = error.message || 'Unknown parsing error';
*      errors.push({ message: errorMessage, line: error.lineNumber, column: error.column });
*      return { isValid: false, errors };
* }
  }

-
- /\*\*
- - Generates the TypeScript stub class implementation string.
- - @param contractDef - The parsed contract definition.
- - @returns A Promise resolving to the stub code string.
- \*/
- private async generateStubImplementation(
- contractDef: ContractDefinition,
- ): Promise<string> {
- // Blueprint: Construct the class string using template literals.
- // Blueprint: Include necessary imports (ContractResult, NotImplementedError, and types from contract).
- // Blueprint: Generate each method from contractDef.methods.
- // Blueprint: Ensure methods are async if their return type is Promise<...>.
- // Blueprint: Populate NotImplementedError with the class and method name, and a generic blueprint.
-
- const { interfaceName, componentName, methods, imports: typeImports } = contractDef;
-
- const importStatements = new Set<string>();
- // Standard imports for SDD patterns
- importStatements.add(`import { ContractResult, succeed, fail } from '../../contracts/contract-result.js';`);
- importStatements.add(`import { SDDError, NotImplementedError } from '../../utils/sdd-error.js';`);
-
- // Add imports for types used in method signatures
- typeImports.forEach(type => {
-        // Avoid importing built-ins or already handled types
-        if (type && type !== 'ContractResult' && type !== 'Promise' && !this.isPrimitiveOrBuiltIn(type) && type !== 'void') {
-            // Heuristic: assume types are in a common 'types.js' or a file named after the interface (lowercase)
-            // This path needs to be configurable or more intelligently derived in a real system.
-            // For now, using a placeholder path convention.
-            importStatements.add(`import { ${type} } from './${interfaceName.toLowerCase()}-types.js'; // Blueprint: Adjust import path as needed for type '${type}'`);
-        }
- });
-
-
- const methodStubs = methods
-      .map(method => {
-        const paramsString = method.parameters
-          .map(p => `${p.name}${p.optional ? '?' : ''}: ${p.type}`)
-          .join(', ');
-        const asyncKeyword = method.isAsync ? 'async ' : '';
-        const blueprintMessage = `Blueprint: Implement logic for ${method.name}. Inputs: ${method.parameters.map(p=>p.name).join(', ') || 'none'}. Expected output type: ${method.contractResultType}.`;
-
-        return `
- ${asyncKeyword}${method.name}(${paramsString}): ${method.returnType} {
- // ${blueprintMessage}
- throw new NotImplementedError('${componentName}.${method.name}', '${blueprintMessage.replace(/'/g, "\\'") /_ escape single quotes _/}');
- // Example for ${method.returnType.includes('ContractResult') ? 'ContractResult success' : 'direct return'}:
- // ${method.returnType.includes('ContractResult') ? `// return succeed(/* value_of_type_${method.contractResultType} _/);`:`// return /_ value*of_type*${method.contractResultType} \*/;`}
- // Example for ContractResult failure (if applicable):
- // ${method.returnType.includes('ContractResult') ? `// return fail(new SDDError('YourErrorCode', 'Error message for ${method.name}'));` : ''}
- }`;
-      })
-      .join('');
-
- const classComment = `/\*\*
- - Implements the ${interfaceName} contract.
- - Blueprint: This class provides the concrete implementation for ${interfaceName}.
- - Each method should be implemented to fulfill the contract's purpose.
- \*/`;
-
- return `${Array.from(importStatements).sort().join('\n')}
- -${classComment}
-export class ${componentName} implements ${interfaceName} {${methodStubs}
  -}
  -`;
- }
-
- /\*\*
- - Validates the syntax of the generated TypeScript stub code.
- - @param stubCode - The TypeScript code string to validate.
- - @returns A Promise resolving to the validation result.
- \*/
- private async validateStubOutput(
- stubCode: string,
- ): Promise<ValidationResult> {
- // Blueprint: Use @typescript-eslint/parser to parse the generated stubCode.
- // Blueprint: If parsing fails, report syntax errors including line and column if available.
- // Blueprint: This provides a basic syntax check. More advanced semantic checks (e.g.,
- // correct usage of NotImplementedError, ContractResult patterns) could be
- // added by traversing the AST but are out of scope for basic validation.
-
- const errors: Array<{ message: string; line?: number; column?: number }> = [];
- try {
-      parse(stubCode, {
-        ecmaVersion: 'latest',
-        sourceType: 'module',
-        loc: true, // Ensure loc is true to get line/column numbers from parser errors
-      });
-      // If parse doesn't throw, the basic syntax is valid.
-      return { isValid: true, errors: [] };
- } catch (error: any) {
-      // @typescript-eslint/parser errors often have lineNumber and column
-      const errorMessage = error.message || 'Unknown parsing error';
-      errors.push({ message: errorMessage, line: error.lineNumber, column: error.column });
-      return { isValid: false, errors };
- }
- }
-
- // Blueprint: Main execution logic for the tool.
  }
