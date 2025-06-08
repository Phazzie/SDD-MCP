# GitHub Copilot Instructions for SDD MCP Server

## 🤝 AI COLLABORATION PROTOCOL

**Multi-AI SDD Development with Gemini**

- **Task Assignment**: Check `ai-collaboration/GEMINI_TASK_ASSIGNMENT.md` for Gemini's current work
- **Communication**: Update `ai-collaboration/AI_COLLABORATION_LOG.md` for major decisions/handoffs
- **Status Tracking**: Monitor `ai-collaboration/CURRENT_STATUS.md` for project progress
- **Coordination**: Architecture decisions must be coordinated between both AIs
- **Handoffs**: Clear seam boundaries define when to hand work between AIs
- **Gemini Briefing**: `ai-collaboration/GEMINI_COMPREHENSIVE_BRIEFING.md` contains full context for Gemini
- **Handoff Templates**: Use `ai-collaboration/COPILOT_HANDOFF_TEMPLATE.md` for task handoffs
- **Role Analysis**: `ai-collaboration/ROLE_COMPATIBILITY_ANALYSIS.md` defines complementary strengths

### **Copilot-Specific Responsibilities**

- **Strategic Planning**: Architecture design, seam identification, requirement analysis
- **Integration Oversight**: End-to-end testing, system validation, documentation coordination
- **Quality Assurance**: Code review, architecture compliance, SDD validation
- **Handoff Management**: Task preparation, specification clarity, success criteria definition

### **Gemini Coordination Protocol**

1. **Before Handoff**: Prepare detailed task specification using handoff template
2. **During Implementation**: Monitor status updates in `CURRENT_STATUS.md`
3. **After Delivery**: Review delivered code via `GEMINI_CODE_DELIVERY.md`
4. **Archive Completed**: Move finished work to `ai-collaboration/archive/`

## 🔗 SEAM-DRIVEN DEVELOPMENT

**"Seams First, Implementation Second"**

- Build communication pathways between components BEFORE implementations
- Seams = HOW components talk to each other
- Prevents integration hell by establishing contracts upfront

**\***WE MUST EAT OUR OWN DOG FOOD!**\***
Since this is a Seam-Driven Development (SDD) project, we must follow the SDD principles strictly every time:

1. **Identify Seams**: What are the seams in this feature?
2. **Define Contracts**: What are the contracts for these seams?
3. **Create Stubs**: Generate implementation stubs for each contract
4. **Test Connections**: Validate seam communications work
5. **Implement**: Fill in the actual logic

**Always ask**: "What seam am I building?" before writing code.

## Copilot Suggestion Tags

When offering suggestions, categorize with these tags:

- `💰 HIGH_ROI` - Quick wins, leverage existing patterns, template reuse
- `🎯 CRITICAL` - Core seam connections, integration pathways, contract definitions
- `⚡ QUICK_WIN` - Simple implementations using existing foundation
- `🔨 HARD_WORK` - Complex logic, new patterns, significant implementation effort
- `🧪 EXPERIMENTAL` - New approaches, might need iteration
- `🛡️ DEFENSIVE` - Error handling, validation, fail-fast implementations
- `🔄 REFACTOR` - Improvement opportunities, technical debt reduction
- `🎨 POLISH` - UX improvements, documentation, code cleanup
- `🔒 SECURITY` - Security-focused implementations, vulnerability fixes
- `📊 ANALYTICS` - Tracking, monitoring, or metrics-related suggestions
- `🚀 PERFORMANCE` - Optimizations and performance enhancements
- `📚 DOCUMENTATION` - Documentation improvements, examples, clarifications
- `♿ ACCESSIBILITY` - Accessibility improvements and considerations
- `🔌 INTEGRATION` - External system integrations and connections
- `🧩 COMPONENT` - Reusable component development
- `🧠 AI_ENHANCEMENT` - AI-related functionality improvements

**Priority Order**: 💰 HIGH_ROI → ⚡ QUICK_WIN → 🎯 CRITICAL → 🛡️ DEFENSIVE → 🔨 HARD_WORK → 🧪 EXPERIMENTAL → 🔄 REFACTOR → 🎨 POLISH

## Core Patterns

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

### Stubs (Fail Fast)

```typescript
async method(input: InputType): Promise<ContractResult<OutputType>> {
  throw new NotImplementedError("ComponentContract.method", "Blueprint: TODO");
}
```

### Seam Communication

```typescript
import { seamManager } from "../seams.js";
const result = await seamManager.executeSeam("SeamName", data);
```

### Error Handling

```typescript
try {
  if (!input) return { success: false, error: "Invalid input - failing fast" };
  return { success: true, data: result };
} catch (error) {
  await errorHandler.logError(error, context);
  return { success: false, error: error.message };
}
```

## File Organization

- `src/contracts.ts` - Interfaces with ContractResult<T>
- `src/stubs.ts` - NotImplementedError skeletons
- `src/seams.ts` - Communication pathways
- `src/agents/` - Actual implementations
- Import with `.js` extensions: `'../contracts.js'`

## Use Existing Foundation

Don't recreate: ConfigManager, ErrorHandler, TemplateProcessor, ValidationEngine, SDDAnalyzer, SeamManager

## SDD Workflow

1. **Identify seams** → 2. **Define contracts** → 3. **Create stubs** → 4. **Test connections** → 5. **Implement**

**Multi-AI Coordination:**

- Architecture decisions: Coordinate via `ai-collaboration/AI_COLLABORATION_LOG.md`
- Task handoffs: Update status in `ai-collaboration/CURRENT_STATUS.md`
- Seam boundaries: Clear contracts define AI responsibility boundaries

**Always ask**: "What seam am I building?" before writing code

## Critical Reminders

If you find yourself having to simulate something, say "Not tahday!" and stop and ask for clarification or direction.
