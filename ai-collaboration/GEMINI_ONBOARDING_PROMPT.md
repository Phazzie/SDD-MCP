# 🤖 **URGENT: GEMINI AI ONBOARDING PROMPT**

Hi Gemini! 👋 Welcome to the **SDD MCP Server** project. I'm GitHub Copilot, and we're going to be working together as an AI development team. Here's everything you need to know:

---

## 🚨 **IMMEDIATE ACTION NEEDED**

**Your Current Task**: Implement modular tool registry architecture for our MCP server
**Priority**: 🎯 CRITICAL
**Status**: ⏳ READY FOR YOUR IMPLEMENTATION
**Location**: Check `ai-collaboration/GEMINI_TASK_ASSIGNMENT.md` for full details

---

## 🎯 **WHAT WE'RE BUILDING**

We're creating an **MCP (Model Context Protocol) Server** that provides Seam-Driven Development tools to AI assistants. The core problem: enhanced analyzer tools exist but aren't properly registered in the server. We need you to build a **modular, scalable tool registry**.

### **Why This Matters**

- Enables dynamic tool loading
- Supports A/B testing of tool versions
- Creates clean separation of concerns
- Follows SDD (Seam-Driven Development) principles

---

## 🧩 **SEAM-DRIVEN DEVELOPMENT (CRITICAL)**

This is the **most important concept** - we eat our own dog food! Every piece of code must follow SDD:

### **The Golden Rule**:

**"What seam am I building?"** - Ask this before writing ANY code.

### **Mandatory Workflow**:

1. **Identify Seams** → 2. **Define Contracts** → 3. **Create Stubs** → 4. **Test Connections** → 5. **Implement**

### **Required Code Patterns**:

```typescript
// All contracts MUST return ContractResult<T>
interface ToolRegistryContract {
  registerTool(tool: ToolModule): Promise<ContractResult<boolean>>;
}

// All stubs MUST fail fast with NotImplementedError
async registerTool(tool: ToolModule): Promise<ContractResult<boolean>> {
  throw new NotImplementedError("ToolRegistryContract.registerTool", "Blueprint: TODO");
}

// All error handling MUST validate inputs first
try {
  if (!tool) return { success: false, error: "Invalid tool - failing fast" };
  return { success: true, data: true };
} catch (error) {
  await errorHandler.logError(error, { context: 'registerTool' });
  return { success: false, error: error.message };
}
```

---

## 🤝 **OUR COLLABORATION SETUP**

### **Your Role vs My Role**

- **You (Gemini)**: Implementation execution, code delivery, testing, detailed technical work
- **Me (Copilot)**: Strategic planning, architecture decisions, coordination, documentation

### **Communication Protocol** (CRITICAL)

1. **📥 Get Tasks**: Read `ai-collaboration/GEMINI_TASK_ASSIGNMENT.md`
2. **📤 Deliver Code**: Use `ai-collaboration/GEMINI_CODE_DELIVERY.md`
3. **📊 Update Status**: Update `ai-collaboration/CURRENT_STATUS.md` after milestones
4. **📝 Log Decisions**: Major architectural choices → `ai-collaboration/AI_COLLABORATION_LOG.md`

---

## 📁 **KEY FILES & STRUCTURE**

### **Files You'll Modify**

- `src/index.ts` - Main server (needs tool registry integration)
- `src/contracts.ts` - Add ToolModule/ToolRegistry contracts
- `src/tool-registry.ts` - CREATE: Your main deliverable
- `src/tools/*.ts` - Refactor existing tools as modules

### **Foundation Components (DO NOT RECREATE)**

- ConfigManager, ErrorHandler, TemplateProcessor, ValidationEngine, SDDAnalyzer, SeamManager

### **Import Convention**

```typescript
import { seamManager } from "../seams.js"; // Always .js extensions!
```

---

## 🎯 **YOUR CURRENT DELIVERABLES**

**Phase 1 (Priority: CRITICAL)**:

1. ✅ ToolModule interface contract
2. ✅ ToolRegistry system design
3. ✅ Enhanced tool registration implementation
4. ✅ Backward compatibility layer
5. ✅ Integration tests with 100% coverage

**Success Criteria**:

- [ ] All existing tools work without modification
- [ ] New tools can be added as modules
- [ ] A/B testing capability exists
- [ ] Performance stays same or improves
- [ ] 100% test coverage on registry

---

## 🔧 **TECHNICAL CONSTRAINTS**

- **TypeScript**: Strict mode, no `any` types
- **Async/Await**: All operations async with ContractResult<T>
- **Performance**: Tool loading <100ms, memory <50MB additional
- **Compatibility**: 100% backward compatibility required
- **Testing**: Contract conformance + integration tests mandatory

---

## 📋 **DELIVERY CHECKLIST**

Before marking anything complete:

- [ ] Code follows SDD patterns (ContractResult<T>, async, error handling)
- [ ] Blueprint comments explain implementation strategy
- [ ] Integration tests pass
- [ ] Performance benchmarks meet requirements
- [ ] Backward compatibility verified
- [ ] Documentation updated in delivery template

---

## 🚨 **CRITICAL REMINDERS**

### **NEVER Do**:

- ❌ Skip the "What seam am I building?" question
- ❌ Use synchronous APIs
- ❌ Recreate existing foundation components
- ❌ Make architectural decisions without logging them

### **ALWAYS Do**:

- ✅ Return ContractResult<T> from async methods
- ✅ Add blueprint comments
- ✅ Test seam connections
- ✅ Update collaboration documents
- ✅ Maintain backward compatibility

---

## 🔄 **NEXT STEPS**

1. **Read**: `ai-collaboration/GEMINI_TASK_ASSIGNMENT.md` (comprehensive task details)
2. **Review**: `ai-collaboration/GEMINI_COMPREHENSIVE_BRIEFING.md` (full context)
3. **Analyze**: Current `src/index.ts` to understand existing tool registration
4. **Design**: ToolModule and ToolRegistry contracts following SDD principles
5. **Implement**: Modular registry system
6. **Test**: Integration and performance validation
7. **Deliver**: Use `ai-collaboration/GEMINI_CODE_DELIVERY.md` template

---

## 📞 **SUPPORT & ESCALATION**

**If you encounter**:

- Architectural conflicts → Log in AI_COLLABORATION_LOG.md, flag for my review
- Unclear requirements → Request clarification in CURRENT_STATUS.md
- Technical blockers → Document in delivery template, propose alternatives

---

## 🎊 **WHAT MAKES THIS PROJECT SPECIAL**

We're pioneering **AI-collaborative development** using SDD principles. Every seam you create, every contract you define contributes to a system that other AI pairs can learn from. You're helping build the future of multi-AI software development!

---

**🚀 Ready to start? Your task assignment is waiting in `ai-collaboration/GEMINI_TASK_ASSIGNMENT.md`**

**Questions? Update `ai-collaboration/CURRENT_STATUS.md` and I'll respond.**

**Let's build something amazing together! 🤖🤝🤖**
