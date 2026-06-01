# 📋 AI Collaboration Handoff Template

## 🎯 **HANDOFF INFORMATION**

### **From**: [AI Name]

### **To**: [AI Name]

### **Date**: [Date]

### **Task**: [Task Name]

### **Priority**: [🎯 CRITICAL / 🔨 HARD_WORK / ⚡ QUICK_WIN / etc.]

---

## 🔗 **SEAM DEFINITION**

| Attribute            | Value                              |
| -------------------- | ---------------------------------- |
| **Seam Name**        | [Name of the seam being worked on] |
| **Source Component** | [Where data/requests come from]    |
| **Target Component** | [Where data/requests go to]        |
| **Data Flow**        | [IN / OUT / BOTH]                  |
| **Purpose**          | [What this seam accomplishes]      |

---

## 📝 **TASK CONTEXT**

### **What Was Completed:**

- [ ] [List completed items]
- [ ] [Mark with checkboxes]

### **What Needs To Be Done:**

- [ ] [List remaining items]
- [ ] [Clear action items]

### **Current Blockers:**

- [List any blockers or dependencies]

---

## 🏗️ **IMPLEMENTATION DETAILS**

### **Files Affected:**

| File              | Action               | Status   | Notes   |
| ----------------- | -------------------- | -------- | ------- |
| `path/to/file.ts` | Create/Modify/Delete | ✅/⏳/❌ | [Notes] |

### **Contracts Required:**

```typescript
// List any new contracts needed
interface ExampleContract {
  method(input: InputType): Promise<ContractResult<OutputType>>;
}
```

### **Dependencies:**

- [List any dependencies on other components]
- [External libraries or tools needed]

---

## 🛡️ **SUCCESS CRITERIA**

### **Technical Criteria:**

- [ ] [Specific technical requirements]
- [ ] [SDD pattern compliance]
- [ ] [TypeScript compilation]

### **Quality Criteria:**

- [ ] [Code quality requirements]
- [ ] [Testing requirements]
- [ ] [Documentation requirements]

---

## 📚 **REFERENCE MATERIALS**

### **Key Files:**

- [List relevant files to study]
- [Documentation references]

### **Context Documents:**

- [Link to relevant documentation]
- [Previous decisions or discussions]

---

## 🔄 **HANDOFF INSTRUCTIONS**

### **When You Complete This Task:**

1. Update `ai-collaboration/CURRENT_STATUS.md`
2. Log decisions in `ai-collaboration/AI_COLLABORATION_LOG.md`
3. Deliver via appropriate `*_CODE_DELIVERY.md` file
4. Create handoff for next phase if needed

### **How to Validate Success:**

1. [Step-by-step testing instructions]
2. [Compilation verification]
3. [Integration testing]

---

## 🚨 **CRITICAL NOTES**

### **SDD Compliance:**

- [ ] ContractResult<T> pattern used
- [ ] Blueprint comments included
- [ ] Error handling with SDDError
- [ ] Seam boundaries clearly defined

### **Backward Compatibility:**

- [Note any compatibility requirements]
- [Migration considerations]

---

**Created By**: [AI Name]  
**Assigned To**: [AI Name]  
**Target Completion**: [Date/Timeframe]
