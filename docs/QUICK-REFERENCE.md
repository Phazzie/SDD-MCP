# 📋 SDD MCP Server: Quick Reference Guide for AI Assistants

_Last Updated: May 27, 2025_

---

## ⚡ **10-SECOND PROJECT SUMMARY**

**SDD MCP Server** = AI-powered development tool combining **Seam-Driven Development** methodology with **Model Context Protocol**. **68% complete** with **18 working templates**. **Mission: Complete 5 missing templates**.

---

## 🎯 **IMMEDIATE COMMANDS FOR AI ASSISTANTS**

### **🚀 Quick Start (First 2 minutes)**

```bash
cd "c:\Users\thump\SkepticalWombat"
npm run build                    # Should show 0 errors ✅
node test-new-templates.js       # Should show 18 working templates ✅
```

### **📝 Template Development**

```bash
# Edit template
code templates/[template-name].handlebars

# Test immediately (CRITICAL)
node test-new-templates.js [template-name]

# Validate compilation
npm run build

# Run full test suite
npm test
```

---

## 🎯 **MISSING TEMPLATES (Your Tasks)**

| Template                       | Priority    | Effort | Description                      |
| ------------------------------ | ----------- | ------ | -------------------------------- |
| `sdd-linter-config.handlebars` | 🔴 Critical | 2-3h   | ESLint config for SDD compliance |
| `package-json.handlebars`      | 🔴 Critical | 1-2h   | Smart package.json generation    |
| `github-workflows.handlebars`  | 🟡 High     | 3-4h   | CI/CD with SDD validation        |
| `test-scaffolding.handlebars`  | 🟡 High     | 1-2h   | Automated test generation        |
| `tsconfig.handlebars`          | 🟢 Quick    | 30m    | SDD TypeScript config            |

**Start with `tsconfig.handlebars` (easiest) → build confidence → tackle harder ones**

---

## 📚 **MANDATORY SDD PATTERNS**

### **1. ContractResult<T> (Every seam method)**

```typescript
Promise<ContractResult<OutputType>> {
  success: boolean;
  data?: OutputType;
  error?: string;
  agentId: string;
}
```

### **2. 7-Field Blueprint Comments**

```typescript
/**
 * PURPOSE: What it does
 * DATA FLOW: IN/OUT/BOTH/N/A
 * INTEGRATION POINTS: Connected components
 * FAILURE MODES: Error scenarios
 * RATIONALE: Why designed this way
 * EXAMPLES: Usage patterns
 * CONTRACT VERSION: Semantic version
 */
```

### **3. NotImplementedError Stubs**

```typescript
throw new NotImplementedError("Agent.method", "Blueprint: TODO description");
```

### **4. Import Pattern**

```typescript
import { Type } from "./module.js"; // MUST use .js extension
```

---

## 🔧 **HANDLEBARS TEMPLATE HELPERS**

```handlebars
{{default value "fallback"}}
{{! Safe defaults }}
{{camelCase "some string"}}
{{! someString }}
{{pascalCase "some string"}}
{{! SomeString }}
{{timeStamp}}
{{! Current ISO date }}
```

---

## 📖 **REFERENCE TEMPLATES (Copy From These)**

| Template                              | Use For               | Key Pattern                       |
| ------------------------------------- | --------------------- | --------------------------------- |
| `contract.handlebars`                 | Interface definitions | 7-field comments + ContractResult |
| `stub.handlebars`                     | Implementation stubs  | NotImplementedError pattern       |
| `implementation-checklist.handlebars` | Complex templates     | Iteration + conditions            |

---

## 🚨 **CRITICAL DO'S AND DON'TS**

### **✅ ALWAYS DO**

- Test every change: `node test-new-templates.js [template]`
- Copy patterns from working templates
- Keep TypeScript compilation at 0 errors
- Include all 7 blueprint comment fields
- Use ContractResult<T> for seam methods

### **❌ NEVER DO**

- Modify `src/template-processor.ts` without understanding
- Skip testing (100% success rate required)
- Use `any` type excessively
- Forget `.js` extensions in imports
- Deviate from established SDD patterns

---

## 📊 **SUCCESS METRICS**

- ✅ Template processes without errors
- ✅ Generated code follows SDD patterns
- ✅ TypeScript compilation stays at 0 errors
- ✅ All tests pass
- ✅ 100% template processing success rate maintained

---

## 🆘 **WHEN STUCK**

1. **Read**: `docs/PROJECT-TURNOVER.md` (detailed guidance)
2. **Reference**: Working templates in `/templates/` directory
3. **Test**: `node test-new-templates.js` to see what works
4. **Debug**: `node debug-template.js [template]` for context issues

---

## 🎯 **TODAY'S MISSION**

**Complete 2-3 missing templates using established patterns. Start easy (`tsconfig.handlebars`) then tackle harder ones. Maintain 100% template success rate.**

**You've got proven architecture, working patterns, and clear goals. Focus on template completion!**

---

_This is your quick reference - use `docs/AI-HELPER-PROMPT.md` for comprehensive guidance_
