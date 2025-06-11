# 🧠 Gemini Instructions for SDD MCP Server

## 🤝 AI COLLABORATION PROTOCOL

**Multi-AI SDD Development with GitHub Copilot**

- **Task Assignment**: Check `ai-collaboration/GEMINI_TASK_ASSIGNMENT.md` for assigned work
- **Code Delivery**: Deliver all code via `ai-collaboration/GEMINI_CODE_DELIVERY.md`
- **Communication**: Log major decisions in `ai-collaboration/AI_COLLABORATION_LOG.md`
- **Status Updates**: Update `ai-collaboration/CURRENT_STATUS.md` after milestones
- **Coordination**: Architecture decisions must align with Copilot

## 🔗 SEAM-DRIVEN DEVELOPMENT (SDD) PRINCIPLES

**"Seams First, Implementation Second"**

You must follow SDD methodology strictly:

1. **Identify Seams**: What are the communication pathways?
2. **Define Contracts**: How do components talk to each other?
3. **Create Stubs**: Generate implementation skeletons first
4. **Test Connections**: Validate seam communications work
5. **Implement**: Fill in the actual logic

**Critical**: Always ask "What seam am I building?" before writing code.

## 🎯 CORE PATTERNS (MANDATORY)

### Contracts (Always Async)

```typescript
interface ComponentContract {
  method(input: InputType): Promise<ContractResult<OutputType>>;
}

type ContractResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
};
```

### Implementation Stubs

```typescript
async method(input: InputType): Promise<ContractResult<OutputType>> {
  // Blueprint: [Describe what this method should do]
  throw new NotImplementedError("ComponentContract.method", "Blueprint: TODO");
}
```

### Error Handling Pattern

```typescript
try {
  if (!input) {
    return { success: false, error: "Invalid input - failing fast" };
  }

  const result = await doSomething(input);
  return { success: true, data: result };
} catch (error) {
  await errorHandler.logError(error, context);
  return { success: false, error: error.message };
}
```

## 📁 FILE ORGANIZATION RULES

- **Contracts**: `src/contracts.ts` - All interfaces with ContractResult<T>
- **Stubs**: `src/stubs.ts` - NotImplementedError skeletons
- **Agents**: `src/agents/` - Actual implementations
- **Tools**: `src/tools/` - MCP tool definitions and handlers
- **Imports**: Always use `.js` extensions: `import { ... } from '../contracts.js'`

## 🛡️ CODE QUALITY REQUIREMENTS

### TypeScript Standards

- All functions must have proper type annotations
- Use strict TypeScript settings
- No `any` types unless absolutely necessary
- Export interfaces and types properly

### SDD Compliance Checklist

- [ ] All async methods return `ContractResult<T>`
- [ ] Blueprint comments for future implementation
- [ ] Consistent error handling patterns
- [ ] Clear seam boundaries documented
- [ ] DevUtilities integration for logging

### Documentation Requirements

- Blueprint comments explaining intended functionality
- Clear parameter descriptions
- Error scenarios documented
- Integration points identified

## 🚀 DELIVERY STANDARDS

When delivering code to `ai-collaboration/GEMINI_CODE_DELIVERY.md`:

1. **Complete File Contents**: Provide full file content, not just snippets
2. **SDD Validation**: Confirm all seam contracts are implemented
3. **Testing Instructions**: Include compilation and testing steps
4. **Integration Notes**: Explain how Copilot should integrate the code
5. **Known Issues**: Document any limitations or follow-up needed

## 🎯 CURRENT PROJECT CONTEXT

**Project**: SDD MCP Server - Tool for AI assistants to use Seam-Driven Development methodology

**Architecture**: Model Context Protocol (MCP) server providing SDD tools to AI assistants

**Key Components**:

- Contract definitions (`src/contracts.ts`)
- Implementation stubs (`src/stubs.ts`)
- MCP tools (`src/tools/`)
- Template processor (`src/template-processor.ts`)
- Enhanced seam analyzer (implemented but not registered)

**Foundation Components** (DO NOT RECREATE):

- ConfigManager, ErrorHandler, TemplateProcessor
- ValidationEngine, SDDAnalyzer, SeamManager
- DevUtilities, PerformanceTracker

## 🔄 WORKFLOW WITH COPILOT

1. **Receive Tasks**: Check `GEMINI_TASK_ASSIGNMENT.md` for new assignments
2. **Analyze Seams**: Identify seam boundaries and contracts
3. **Implement Code**: Follow SDD patterns strictly
4. **Deliver Code**: Complete implementation via `GEMINI_CODE_DELIVERY.md`
5. **Update Status**: Log progress in `CURRENT_STATUS.md`
6. **Document Decisions**: Major choices go in `AI_COLLABORATION_LOG.md`

## 🎨 SUGGESTION TAGS

Use these tags when making recommendations:

- `💰 HIGH_ROI` - Quick wins, leverage existing patterns
- `🎯 CRITICAL` - Core seam connections, integration pathways
- `⚡ QUICK_WIN` - Simple implementations using existing foundation
- `🔨 HARD_WORK` - Complex logic, new patterns, significant effort
- `🛡️ DEFENSIVE` - Error handling, validation, fail-fast implementations
- `🔄 REFACTOR` - Improvement opportunities, technical debt reduction

**Priority Order**: 💰 HIGH_ROI → ⚡ QUICK_WIN → 🎯 CRITICAL → 🛡️ DEFENSIVE → 🔨 HARD_WORK

## 🚨 CRITICAL REMINDERS

- **EAT YOUR OWN DOG FOOD**: This is an SDD project, so follow SDD strictly
- **Seams Before Code**: Always identify seams before implementing
- **Contract Compliance**: Every async method returns ContractResult<T>
- **No Breaking Changes**: Maintain backward compatibility
- **Clear Handoffs**: Provide complete integration instructions

**Always ask**: "What seam am I building?" before writing any code.
