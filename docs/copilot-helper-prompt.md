# SDD MCP Server - Copilot Helper Prompt

## 🎯 **Context Reinforcement for GitHub Copilot**

### **What is SDD (Seam-Driven Development)?**

SDD is a proven methodology that builds software by identifying and implementing the **communication pathways (seams)** between components FIRST, then filling in the implementations. This prevents integration issues and ensures all parts work together.

**SDD Workflow**: PRD/Requirements → AI Seam Analysis → Contract Generation → Stub Creation → Integration Testing → Implementation

### **This Project: Meta-SDD Application**

We're building an MCP server that automates SDD methodology using SDD methodology itself. The server will help non-coders develop software with AI assistance by automating the proven SDD workflow.

---

## 🔧 **Copilot Instructions for SDD Development**

### **1. Always Follow SDD Principles**

- **Seams First**: Build communication pathways before implementations
- **Contracts Define Behavior**: Use `ContractResult<T>` patterns for type safety
- **Stubs Track Progress**: Use `NotImplementedError` with descriptive messages
- **Integration Testing**: Verify seam connections work before implementation

### **2. Code Patterns to Use**

#### **Contract Pattern (Type-Safe Interfaces)**

```typescript
export interface ComponentContract {
  operation(input: InputType): Promise<ContractResult<OutputType>>;
}

export type ContractResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
};
```

#### **Stub Pattern (Implementation Skeleton)**

```typescript
async operation(input: InputType): Promise<ContractResult<OutputType>> {
  throw new NotImplementedError(
    "ComponentContract.operation",
    "TODO: Implement operation logic",
    { expectedInput: "InputType", expectedOutput: "OutputType" }
  );
}
```

#### **Seam Pattern (Communication Pathway)**

```typescript
export class ComponentSeam {
  async connect(source: SourceAgent, target: TargetAgent): Promise<boolean> {
    // Verify communication pathway works
    return await this.verifyConnection(source, target);
  }
}
```

### **3. File Organization Patterns**

- **`src/contracts.ts`**: All interface definitions with ContractResult<T>
- **`src/stubs.ts`**: Implementation skeletons with NotImplementedError
- **`src/seams.ts`**: Communication pathways between components
- **`src/agents/`**: Actual implementations that fulfill contracts
- **`src/tests/`**: Integration tests that verify seam connections
- **`templates/`**: Handlebars templates for generating SDD-compliant code

### **4. Error Handling Pattern**

```typescript
import { errorHandler } from "../seams.js";

try {
  // Implementation logic
  return { success: true, data: result };
} catch (error) {
  await errorHandler.logError(error, context);
  return { success: false, error: error.message };
}
```

### **5. Template Usage Pattern**

```typescript
import { templateProcessor } from "../seams.js";

const result = await templateProcessor.processTemplate(
  "contract.template.hbs",
  {
    contractName: "ComponentContract",
    methods: methodDefinitions,
    imports: requiredImports,
  }
);
```

---

## 🎯 **Current Project State Awareness**

### **What's Implemented (Don't Recreate)**

- ✅ All foundation agents (ConfigManager, ErrorHandler, TemplateProcessor, ValidationEngine, SDDAnalyzer)
- ✅ Complete seam communication system
- ✅ Type-safe contracts with async patterns
- ✅ Handlebars template infrastructure
- ✅ Integration testing framework
- ✅ Zero compilation errors

### **What Needs Completion**

- 🔄 MCPServer class in `src/index.ts` (wire up existing agents)
- 🔄 Configuration files (`server.config.json`)
- 🔄 Claude Desktop MCP integration testing

### **Key Architecture Points**

- **All contracts are async**: Use `Promise<ContractResult<T>>`
- **Seam-first approach**: Communication pathways built before implementations
- **Error handling integration**: All agents use `errorHandler` for consistency
- **Template-driven generation**: Use Handlebars for SDD-compliant code generation

---

## 🚨 **Critical Guidelines for Copilot**

### **DO:**

- Use existing foundation agents instead of recreating functionality
- Follow async contract patterns already established
- Import from `../contracts.js` and `../seams.js` in agents
- Use `seamManager` for inter-agent communication
- Apply SDD methodology: seams → contracts → stubs → implementation

### **DON'T:**

- Create synchronous contracts (all are async now)
- Bypass the seam communication system
- Recreate existing working agents
- Use direct imports without proper file extensions (.js)
- Skip integration testing for new seam connections

### **WHEN IN DOUBT:**

- Check `src/contracts.ts` for existing interface patterns
- Look at `src/agents/` for implementation examples
- Use `seamManager` to connect components
- Follow the ContractResult<T> pattern for all returns
- Test seam connections before implementation

---

## 💡 **Remember: This is Meta-SDD**

We're using SDD methodology to build a tool that automates SDD methodology. The patterns we establish here will be generated by the server for other projects. Make them exemplary!
