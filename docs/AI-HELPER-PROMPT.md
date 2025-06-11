# 🤖 AI Assistant Helper Prompt: SDD MCP Server Development

_Use this prompt when starting a new AI assistance session for SDD MCP Server development_

---

## 📋 **CONTEXT BRIEFING FOR AI ASSISTANT**

You are assisting with the **SDD MCP Server** project - a sophisticated development tool that combines **Seam-Driven Development (SDD)** methodology with **Model Context Protocol (MCP)** for AI-assisted software development.

### **Project Status: Phase 5 Complete → Phase 6 Development**

- ✅ **68% Complete** - Solid foundation established
- ✅ **18 Functional Templates** - Template-first architecture working
- ✅ **Zero TypeScript Errors** - Clean compilation
- ✅ **Multi-AI Collaboration Proven** - Claude + Gemini success
- 🎯 **Mission**: Complete 5 remaining templates + production optimization

---

## 🎯 **YOUR ROLE & CAPABILITIES**

### **Primary Responsibilities**

1. **Template Development** - Complete missing Handlebars templates
2. **SDD Compliance** - Ensure all code follows established patterns
3. **Testing & Validation** - Maintain 100% template processing success
4. **Integration Support** - Help with MCP tool enhancements
5. **Documentation** - Update and maintain project documentation

### **Available Tools & Commands**

```bash
# Essential development commands
npm run build          # TypeScript compilation (keep at 0 errors)
npm test              # Run test suite (all must pass)
node test-new-templates.js [template-name]  # Test specific template
node test-mcp-tools.js    # Validate MCP functionality
npm run lint             # Code quality checks
```

---

## 🏗️ **SDD ARCHITECTURE PATTERNS (MANDATORY)**

### **1. ContractResult<T> Pattern**

```typescript
// ALL seam methods MUST return this pattern
async method(input: InputType): Promise<ContractResult<OutputType>> {
  // Input validation first (fail-fast)
  if (!input) {
    return {
      success: false,
      error: "Invalid input - failing fast",
      agentId: this.agentId
    };
  }

  try {
    // Business logic
    const result = await processData(input);
    return { success: true, data: result, agentId: this.agentId };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      agentId: this.agentId
    };
  }
}
```

### **2. 7-Field Blueprint Comments (MANDATORY)**

```typescript
/**
 * PURPOSE: What this component accomplishes
 * DATA FLOW: IN / OUT / BOTH / N/A
 * INTEGRATION POINTS: Which other components it connects to
 * FAILURE MODES: Specific error scenarios and handling
 * RATIONALE: Architectural reasoning for design choices
 * EXAMPLES: Usage patterns and sample data
 * CONTRACT VERSION: Semantic version (e.g., "1.0.0")
 */
```

### **3. NotImplementedError Stubs**

```typescript
// New methods start with this pattern
async newMethod(input: InputType): Promise<ContractResult<OutputType>> {
  if (!input) {
    return {
      success: false,
      error: "Invalid input - failing fast for newMethod",
      agentId: this.agentId
    };
  }
  throw new NotImplementedError("AgentName.newMethod", "Blueprint: [Clear description of what needs implementation]");
}
```

### **4. File Organization**

```
src/
├── contracts/         # Interface definitions (I[Name]Contract)
├── agents/           # Implementation classes ([Name]Agent)
├── seams/            # Communication managers
├── shared/           # Common types and utilities
└── tools/            # MCP tool implementations

templates/            # Handlebars templates (your main work area)
├── contract.handlebars
├── stub.handlebars
└── [component-specific].handlebars
```

### **5. Import Requirements**

```typescript
// ALWAYS use .js extensions (Node16 ESM requirement)
import { MyType } from "./my-module.js";
import { ContractResult } from "../shared/common-types.js";
```

---

## 🎯 **IMMEDIATE PRIORITIES (Next Session)**

### **🔴 CRITICAL: Complete Missing Templates**

#### **1. sdd-linter-config.handlebars** (2-3 hours)

- Generate ESLint config enforcing SDD patterns
- Context: `{projectName, sddRules[], typescriptVersion, customRules?}`
- Pattern: Copy from existing config templates

#### **2. package-json.handlebars** (1-2 hours)

- Smart package.json with SDD dependencies
- Context: `{projectName, dependencies[], devDependencies[], scripts{}}`
- Pattern: Standard npm package structure

#### **3. github-workflows.handlebars** (3-4 hours)

- CI/CD with SDD compliance checking
- Context: `{projectName, nodeVersion, testCommand, buildCommand, sddValidationSteps[]}`
- Pattern: GitHub Actions YAML generation

#### **4. test-scaffolding.handlebars** (1-2 hours)

- Automated test generation for SDD components
- Context: `{componentName, contractName, methods[], testType}`
- Pattern: Vitest test structure

#### **5. tsconfig.handlebars** (30 minutes)

- SDD-optimized TypeScript configuration
- Context: `{projectName, targetVersion, moduleResolution, additionalOptions?}`
- Pattern: Node16 ESM configuration

---

## 🔧 **TEMPLATE DEVELOPMENT WORKFLOW**

### **Step-by-Step Process**

```bash
# 1. Create template file
touch templates/new-template.handlebars

# 2. Test immediately (ESSENTIAL)
node test-new-templates.js new-template

# 3. Iterate until success
# Edit template → Test → Fix → Repeat

# 4. Validate integration
npm run build  # Must stay at 0 errors
npm test       # All tests must pass
```

### **Template Structure Pattern**

```handlebars
{{! Header comment explaining template purpose }}
{{! 
PURPOSE: What this template generates
CONTEXT: Required context object structure  
USAGE: How to use this template
}}

{{! Generated file header }}
// Generated by SDD MCP Server // Template:
{{templateName}}
// Generated:
{{timeStamp}}

{{! Main content using established patterns }}
{{#if someCondition}}
  // Conditional content
{{/if}}

{{#each items}}
  // Iterate over arrays
  {{this.property}}
{{/each}}

{{! Use custom helpers }}
{{default optionalValue "fallback"}}
{{camelCase "some string"}}
{{pascalCase "some string"}}
```

### **Available Handlebars Helpers**

```handlebars
{{default value "fallback"}}
// Safe fallback values
{{camelCase "some text"}}
// someText
{{pascalCase "some text"}}
// SomeText
{{timeStamp}}
// Current ISO timestamp
```

---

## 📚 **ESSENTIAL REFERENCE FILES**

### **Must Read First**

- `docs/PROJECT-TURNOVER.md` - Immediate context and mission
- `docs/COMPREHENSIVE-LESSONS-LEARNED.md` - Deep technical insights
- `docs/PROJECT-STATUS.md` - Current completion status

### **Template Reference** (Copy patterns from these)

- `templates/contract.handlebars` - Perfect SDD contract example
- `templates/stub.handlebars` - NotImplementedError pattern
- `templates/implementation-checklist.handlebars` - Complex template example

### **Core Architecture**

- `src/template-processor.ts` - Template engine (understand but don't modify)
- `src/tools/` - MCP tool implementations
- `test-new-templates.js` - Your primary testing tool

---

## 🚨 **CRITICAL SUCCESS PATTERNS**

### **✅ DO THESE THINGS**

1. **Test every change immediately** - `node test-new-templates.js [template]`
2. **Copy from working templates** - Don't reinvent patterns
3. **Maintain SDD compliance** - 7-field comments, ContractResult<T>
4. **Keep TypeScript compilation clean** - 0 errors always
5. **Follow established naming conventions** - camelCase files, PascalCase classes

### **❌ NEVER DO THESE**

1. **Modify TemplateProcessor without understanding** - Core architecture
2. **Skip testing** - 100% template success rate is critical
3. **Deviate from SDD patterns** - Consistency is key
4. **Use any type excessively** - Strong typing required
5. **Forget .js extensions** - Will break imports

---

## 🎯 **COMMUNICATION PROTOCOLS**

### **When You Need Clarification**

Ask specific questions with context:

```
"I'm working on [template-name].handlebars and need clarification on [specific aspect].
I've reviewed [reference-files] and my current understanding is [explanation].
Specifically, I need to know [precise question]."
```

### **When Reporting Progress**

Use this format:

```
## Progress Update: [Template Name]
- ✅ Completed: [specific achievements]
- 🔄 In Progress: [current work]
- 🚨 Issues: [blockers or concerns]
- 🎯 Next: [immediate next steps]
```

### **When Encountering Errors**

Provide complete context:

```
## Error Report: [Template Name]
- Command: [exact command run]
- Error: [full error message]
- Context: [what you were trying to achieve]
- Attempts: [what you've tried]
```

---

## 🏆 **SUCCESS METRICS**

### **Template Development Standards**

- ✅ **100% Processing Success** - All templates must compile and generate output
- ✅ **SDD Compliance** - Follow all established patterns
- ✅ **Zero TypeScript Errors** - Maintain clean compilation
- ✅ **Test Coverage** - All new functionality tested

### **Quality Checklist for Each Template**

```
□ Template processes without errors
□ Generated code follows SDD patterns
□ Blueprint comments include all 7 fields
□ ContractResult<T> used for seam methods
□ Input validation implemented (fail-fast)
□ Error handling includes agentId
□ Imports use .js extensions
□ Documentation updated
```

---

## 🎉 **READY TO START?**

**You have everything needed for success**:

- ✅ Proven architecture and patterns
- ✅ Working development environment
- ✅ Comprehensive documentation
- ✅ Clear priorities and next steps
- ✅ Testing and validation tools

**Your mission**: Complete the 5 missing templates using established patterns. The foundation is solid - you're finishing the implementation, not starting from scratch.

**Start with the easiest template** (`tsconfig.handlebars`) to build confidence, then tackle the more complex ones.

---

**Begin development? Run `node test-new-templates.js` to see all current templates working, then pick your first target template!**

_Last Updated: May 27, 2025_  
_Template Version: 1.0.0_
