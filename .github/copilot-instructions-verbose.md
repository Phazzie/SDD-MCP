# GitHub Copilot Instructions for SDD MCP Server

## Project Context

This is an SDD (Seam-Driven Development) MCP Server that automates software development workflows for non-coders. We're using SDD methodology to build the SDD automation tool itself (meta-development).

## 🔗 SEAM-DRIVEN DEVELOPMENT - THE CORE METHODOLOGY

### What Makes SDD Different

**Traditional Development**: Build components → Hope they integrate
**Seam-Driven Development**: Build connections → Fill in components

### The SDD Mantra

**"Seams First, Implementation Second"**

- Seams are the communication pathways between components
- Seams define HOW components talk to each other
- Seams prevent integration hell by establishing contracts upfront
- Seams enable parallel development because interfaces are locked

### SDD Tags for Code Organization

Use these tags in comments to organize SDD work:

- `@SDD:SEAM` - Communication pathway implementation
- `@SDD:CONTRACT` - Interface definition with ContractResult<T>
- `@SDD:STUB` - Implementation skeleton with NotImplementedError
- `@SDD:INTEGRATION` - Seam connection testing
- `@SDD:MONEYBALL` - High ROI pattern reuse
- `@SDD:FAILFAST` - Early validation and error detection

### Copilot Suggestion Tags

When offering code suggestions, categorize them with these tags:

- `💰 HIGH_ROI` - Quick wins, leverage existing patterns, template reuse
- `🎯 CRITICAL` - Core seam connections, integration pathways, contract definitions
- `⚡ QUICK_WIN` - Simple implementations using existing foundation
- `🔨 HARD_WORK` - Complex logic, new patterns, significant implementation effort
- `🧪 EXPERIMENTAL` - New approaches, might need iteration, prototype territory
- `🛡️ DEFENSIVE` - Error handling, validation, fail-fast implementations
- `🔄 REFACTOR` - Improvement opportunities, technical debt reduction
- `🎨 POLISH` - UX improvements, documentation, code cleanup

## How to Use Suggestion Tags

When offering code suggestions or recommendations, prefix your suggestions with the appropriate tag:

### Examples:
- `💰 HIGH_ROI` Use existing ConfigManager instead of creating new config system
- `🎯 CRITICAL` This seam connection between ValidationEngine and ErrorHandler must be established first
- `⚡ QUICK_WIN` Add error handling using existing errorHandler pattern
- `🔨 HARD_WORK` Implementing custom validation logic will require significant effort but provides type safety
- `🧪 EXPERIMENTAL` This new seam pattern might work but needs testing
- `🛡️ DEFENSIVE` Add input validation to prevent silent failures
- `🔄 REFACTOR` Consider extracting this seam pattern for reuse
- `🎨 POLISH` Add JSDoc comments to improve code documentation

### Prioritization Guidelines:
1. **Suggest 💰 HIGH_ROI and ⚡ QUICK_WIN first** - Leverage existing foundation
2. **Identify 🎯 CRITICAL paths** - Core seam connections that enable everything else
3. **Warn about 🔨 HARD_WORK** - Complex implementations that require significant effort
4. **Offer 🛡️ DEFENSIVE options** - Fail-fast and error handling improvements
5. **Suggest 🧪 EXPERIMENTAL carefully** - Only when established patterns don't fit
6. **Recommend 🔄 REFACTOR and 🎨 POLISH** - After core functionality works

## Core Principles

### 1. SDD Methodology First

- Always implement seams (communication pathways) before implementations
- Follow: PRD → Seam Analysis → Contracts → Stubs → Integration Testing → Implementation
- Use seam-first architecture: build connections between components before filling them in

### 2. Fail Fast Philosophy

- **Validate Early**: Check inputs, contracts, and connections immediately
- **Surface Errors Quickly**: Don't let broken seams propagate through the system
- **Test Connections First**: Verify seam communication before implementation
- **Stub Everything**: Use NotImplementedError to identify incomplete work immediately
- **Zero Tolerance for Silent Failures**: Every operation must return ContractResult<T> with explicit success/failure

### 3. Moneyball Development Opportunities

- **Leverage Existing Foundation**: Don't rebuild what's working (ConfigManager, ErrorHandler, etc.)
- **Template-Driven Code Generation**: Use Handlebars templates for consistent, fast development
- **Seam Reusability**: Build communication patterns that work across multiple components
- **Contract Standardization**: ContractResult<T> pattern eliminates integration debugging
- **Integration Testing ROI**: Test seam connections early to prevent expensive late-stage failures
- **Meta-Development Multiplier**: Patterns we establish here will be generated for all future projects

### 4. Type Safety with ContractResult Pattern

All operations return `ContractResult<T>`:

```typescript
type ContractResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
};
```

### 5. Async Contracts

All contracts are async and return `Promise<ContractResult<T>>`:

```typescript
async operation(input: InputType): Promise<ContractResult<OutputType>>
```

## Code Patterns

### Contract Definitions (src/contracts.ts)

```typescript
// @SDD:CONTRACT - Seam interface definition
export interface ComponentContract {
  // @SDD:SEAM - Communication pathway method
  method(input: InputType): Promise<ContractResult<OutputType>>;
}
```

### Stub Implementations (src/stubs.ts)

```typescript
// @SDD:STUB - Implementation skeleton
async method(input: InputType): Promise<ContractResult<OutputType>> {
  // @SDD:FAILFAST - Immediate identification of incomplete work
  throw new NotImplementedError(
    "ComponentContract.method",
    "Blueprint: Implement method logic here",
    { input: typeof input, expectedOutput: "OutputType" }
  );
}
```

### Seam Communication (src/seams.ts)

```typescript
// @SDD:SEAM - Primary communication pathway
import { seamManager } from "../seams.js";

// Use seamManager for inter-agent communication
const result = await seamManager.executeSeam("SeamName", data);
```

### Error Handling Integration

```typescript
import { errorHandler } from "../seams.js";

try {
  // Implementation logic
  return { success: true, data: result };
} catch (error) {
  await errorHandler.logError(error, { context: "operation" });
  return { success: false, error: error.message };
}
```

### Error Handling Integration (Fail Fast)

```typescript
// @SDD:FAILFAST - Early validation and error detection
import { errorHandler } from "../seams.js";

try {
  // @SDD:FAILFAST - Validate inputs immediately
  if (!input || typeof input !== "expected_type") {
    return { success: false, error: "Invalid input - failing fast" };
  }

  // @SDD:SEAM - Test seam connection before proceeding
  const connection = await seamManager.testConnection("source", "target");
  if (!connection.success) {
    return { success: false, error: "Seam connection failed - stopping early" };
  }

  // Implementation logic
  return { success: true, data: result };
} catch (error) {
  await errorHandler.logError(error, { context: "operation", failFast: true });
  return { success: false, error: error.message };
}
```

### Seam Integration Testing

```typescript
// @SDD:INTEGRATION - Verify seam connections work
describe("Seam Integration", () => {
  test("should establish communication pathway", async () => {
    // @SDD:FAILFAST - Test connection before implementation
    const connection = await seamManager.testConnection(
      "SourceAgent",
      "TargetAgent"
    );
    expect(connection.success).toBe(true);
  });
});
```

## Code Snippets & Templates

### Quick SDD Contract Template

```typescript
// @SDD:CONTRACT - [ComponentName] communication interface
export interface [ComponentName]Contract {
  // @SDD:SEAM - Primary operation pathway
  [operationName](input: [InputType]): Promise<ContractResult<[OutputType]>>;

  // @SDD:INTEGRATION - Health check pathway
  healthCheck(): Promise<ContractResult<boolean>>;
}
```

### Quick SDD Stub Template

```typescript
// @SDD:STUB - [ComponentName] implementation skeleton
export class [ComponentName] implements [ComponentName]Contract {
  // @SDD:SEAM - Primary operation implementation
  async [operationName](input: [InputType]): Promise<ContractResult<[OutputType]>> {
    // @SDD:FAILFAST - Immediate identification of incomplete work
    throw new NotImplementedError(
      "[ComponentName]Contract.[operationName]",
      "Blueprint: [Describe what this operation should do]",
      { input: typeof input, expectedOutput: "[OutputType]" }
    );
  }

  // @SDD:INTEGRATION - Health check implementation
  async healthCheck(): Promise<ContractResult<boolean>> {
    // @SDD:MONEYBALL - Reuse standard health check pattern
    return { success: true, data: true };
  }
}
```

### Quick Seam Connection Template

```typescript
// @SDD:SEAM - [SourceComponent] to [TargetComponent] communication pathway
export class [SourceTarget]Seam {
  // @SDD:SEAM - Establish connection between components
  async connect(source: [SourceComponent], target: [TargetComponent]): Promise<boolean> {
    try {
      // @SDD:FAILFAST - Test connection immediately
      const sourceHealth = await source.healthCheck();
      const targetHealth = await target.healthCheck();

      if (!sourceHealth.success || !targetHealth.success) {
        return false;
      }

      // @SDD:INTEGRATION - Verify communication pathway works
      return true;
    } catch (error) {
      // @SDD:FAILFAST - Surface connection errors immediately
      return false;
    }
  }
}
```

### Quick MCP Tool Template

```typescript
// @SDD:SEAM - MCP tool for [operation] workflow
{
  name: 'sdd_[operation]',
  description: 'SDD workflow: [operation description]',
  inputSchema: z.object({
    // @SDD:CONTRACT - Input validation schema
    [inputField]: z.string().describe('[field description]')
  }),
  handler: async (params) => {
    try {
      // @SDD:FAILFAST - Validate inputs immediately
      const validation = await validationEngine.validateInput(params);
      if (!validation.success) {
        return { content: [{ type: 'text', text: validation.error }] };
      }

      // @SDD:SEAM - Use existing agents through seamManager
      const result = await seamManager.executeSeam('[OperationSeam]', params);

      // @SDD:MONEYBALL - Consistent response format
      return { content: [{ type: 'text', text: result.data }] };
    } catch (error) {
      // @SDD:FAILFAST - Error handling integration
      await errorHandler.logError(error, { tool: 'sdd_[operation]' });
      throw error;
    }
  }
}
```

## File Organization Rules

### Import Conventions

- Use `.js` extensions for local imports: `import { contract } from '../contracts.js'`
- Foundation agents import from: `'../contracts.js'` and `'../seams.js'`

### Directory Structure

- `src/contracts.ts` - All interface definitions
- `src/stubs.ts` - Implementation skeletons
- `src/seams.ts` - Communication pathways
- `src/agents/` - Actual implementations
- `src/tests/` - Integration tests
- `templates/` - Handlebars templates

## Implementation Guidelines

### Use Existing Foundation

Don't recreate these working components:

- ConfigManager (configuration and templates)
- ErrorHandler (error categorization and logging)
- TemplateProcessor (Handlebars integration)
- ValidationEngine (Zod validation)
- SDDAnalyzer (seam analysis)
- SeamManager (inter-agent communication)

### Template Integration

```typescript
import { templateProcessor } from "../seams.js";

const code = await templateProcessor.processTemplate("contract.template.hbs", {
  contractName: "MyContract",
  methods: methodDefinitions,
});
```

### Validation Patterns

```typescript
import { validationEngine } from "../seams.js";

const result = await validationEngine.validateContract(contractCode);
if (!result.success) {
  return result; // Forward validation errors
}
```

## MCP Server Specific

### Tool Implementation Pattern

```typescript
{
  name: 'sdd_operation',
  description: 'SDD workflow operation',
  inputSchema: zodSchema,
  handler: async (params) => {
    try {
      // Use existing agents through seamManager
      const result = await seamManager.executeSeam('OperationSeam', params);
      return { content: [{ type: 'text', text: result.data }] };
    } catch (error) {
      await errorHandler.logError(error, { tool: 'sdd_operation' });
      throw error;
    }
  }
}
```

### Configuration Access

```typescript
import { configManager } from "../seams.js";

const config = await configManager.getConfig();
const templates = await configManager.getTemplatePaths();
```

## Testing Patterns

### Seam Integration Tests

```typescript
describe("Seam Integration", () => {
  test("should connect components", async () => {
    const connection = await seamManager.testConnection(
      "SourceAgent",
      "TargetAgent"
    );
    expect(connection.success).toBe(true);
  });
});
```

## What NOT to Do

❌ Don't create synchronous contracts (all are async)
❌ Don't bypass seamManager for inter-agent communication  
❌ Don't recreate existing working foundation agents
❌ Don't use direct file imports without .js extensions
❌ Don't skip error handling integration
❌ Don't implement before establishing seam connections
❌ Don't allow silent failures - always return ContractResult<T>
❌ Don't skip input validation - fail fast on bad inputs
❌ Don't rebuild patterns when templates exist - high ROI reuse

## Current State Awareness

✅ Foundation agents are complete and working
✅ Seam communication system is established  
✅ Templates and validation are implemented
✅ Zero compilation errors
🔄 Need to complete MCPServer integration in src/index.ts
🔄 Need configuration files for Claude Desktop

## Moneyball Development Patterns

```typescript
// @SDD:MONEYBALL - High ROI pattern reuse
import {
  configManager,
  templateProcessor,
  validationEngine,
} from "../seams.js";

// @SDD:MONEYBALL - Template-driven generation for consistency
const contract = await templateProcessor.processTemplate(
  "contract.template.hbs",
  data
);
const stub = await templateProcessor.processTemplate("stub.template.hbs", data);

// @SDD:FAILFAST - Standardized validation prevents debugging time
const validation = await validationEngine.validateContract(contract);
if (!validation.success) {
  return validation; // Fail fast with clear error
}

// @SDD:SEAM - Reusable seam patterns
const seamResult = await seamManager.executeSeam("StandardPattern", params);
```

## Meta-Development Note

Remember: We're using SDD to build SDD tooling. The patterns we establish here will be generated by this server for other projects. Make them exemplary and follow SDD methodology religiously.

## SDD Development Workflow Reminder
1. **Identify Seams**: What communication pathways are needed?
2. **Define Contracts**: How will components talk to each other?
3. **Create Stubs**: Implementation skeletons with clear TODOs
4. **Test Connections**: Verify seam communication works
5. **Implement**: Fill in the actual logic
6. **Integration Test**: Verify end-to-end seam flow

**Always ask**: "What seam am I building?" before writing any code.
