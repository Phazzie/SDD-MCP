# 📋 COPILOT → GEMINI HANDOFF TEMPLATE

## 🏷️ HANDOFF METADATA

- **Date**: [YYYY-MM-DD]
- **Copilot Session**: [Session ID/Description]
- **Handoff Type**: [ ] Initial Assignment [ ] Work Update [ ] Review Request [ ] Architecture Change
- **Priority**: [ ] 🎯 CRITICAL [ ] ⚡ HIGH [ ] 🔄 NORMAL [ ] 🎨 LOW
- **Estimated Effort**: [Time estimate]

---

## 🎯 TASK SUMMARY

### **Primary Objective**

[Clear, one-sentence description of what needs to be accomplished]

### **Success Criteria**

- [ ] [Specific, measurable outcome 1]
- [ ] [Specific, measurable outcome 2]
- [ ] [Specific, measurable outcome 3]

### **SDD Seam Identification**

**Primary Seam**: [Name of the main seam being built/modified]
**Related Seams**: [List of dependent or connected seams]

---

## 🏗️ ARCHITECTURE CONTEXT

### **Current State**

[Brief description of existing implementation/status]

### **Target State**

[Clear description of desired end state]

### **Key Architectural Decisions Made**

1. [Decision 1] - Rationale: [Why this approach]
2. [Decision 2] - Rationale: [Why this approach]
3. [Decision 3] - Rationale: [Why this approach]

### **Constraints & Requirements**

- **Performance**: [Requirements]
- **Compatibility**: [Backward compatibility needs]
- **Dependencies**: [What components must/cannot be modified]
- **Testing**: [Required test coverage/types]

---

## 🔧 IMPLEMENTATION SPECIFICATION

### **Files to Create/Modify**

```
📁 Files to Modify:
├── [file-path] - [Purpose/changes needed]
├── [file-path] - [Purpose/changes needed]
└── [file-path] - [Purpose/changes needed]

📁 Files to Create:
├── [new-file-path] - [Purpose/functionality]
├── [new-file-path] - [Purpose/functionality]
└── [new-file-path] - [Purpose/functionality]
```

### **Required Contracts** (SDD Compliance)

```typescript
// Contract 1: [Contract Name]
interface ContractName {
  method(input: InputType): Promise<ContractResult<OutputType>>;
}

// Contract 2: [Contract Name]
interface ContractName {
  method(input: InputType): Promise<ContractResult<OutputType>>;
}
```

### **Implementation Checklist**

- [ ] Create contract interfaces with ContractResult<T> return types
- [ ] Generate implementation stubs with NotImplementedError
- [ ] Add blueprint comments explaining implementation strategy
- [ ] Implement fail-fast input validation
- [ ] Add comprehensive error handling
- [ ] Create integration tests for seam communication
- [ ] Verify backward compatibility
- [ ] Update relevant documentation

---

## 🧪 TESTING REQUIREMENTS

### **Unit Tests Required**

- [ ] [Specific test case 1]
- [ ] [Specific test case 2]
- [ ] [Error handling test]

### **Integration Tests Required**

- [ ] [Seam communication test]
- [ ] [End-to-end workflow test]
- [ ] [Performance/load test]

### **Test Data/Scenarios**

```typescript
// Example test scenarios
const testScenarios = [
  { input: [example], expected: [result] },
  { input: [edge-case], expected: [result] },
  { input: [error-case], expected: [error] }
];
```

---

## 📚 REFERENCE MATERIALS

### **Related Documentation**

- [Document 1]: [Brief description]
- [Document 2]: [Brief description]
- [Code Reference]: [Brief description]

### **Examples/Patterns to Follow**

```typescript
// Example implementation pattern
async exampleMethod(input: InputType): Promise<ContractResult<OutputType>> {
  try {
    if (!input) return { success: false, error: "Invalid input - failing fast" };

    // Blueprint: Implementation strategy explanation
    const result = await this.processInput(input);

    return { success: true, data: result };
  } catch (error) {
    await errorHandler.logError(error, { context: 'exampleMethod' });
    return { success: false, error: error.message };
  }
}
```

---

## 🚨 CRITICAL REMINDERS

### **Must Not Do**

- ❌ Recreate existing foundation components (ConfigManager, ErrorHandler, etc.)
- ❌ Use synchronous APIs
- ❌ Skip SDD workflow steps
- ❌ Ignore backward compatibility
- ❌ Make architectural decisions without logging

### **Must Do**

- ✅ Ask "What seam am I building?" before coding
- ✅ Use ContractResult<T> for all async methods
- ✅ Add blueprint comments
- ✅ Test seam connections
- ✅ Update collaboration documents

---

## 🔄 COMMUNICATION EXPECTATIONS

### **Progress Updates Required**

- [ ] **Milestone 1**: [Description] - Update CURRENT_STATUS.md
- [ ] **Milestone 2**: [Description] - Update CURRENT_STATUS.md
- [ ] **Completion**: Use GEMINI_CODE_DELIVERY.md template

### **Escalation Triggers**

- Architectural conflicts or unclear requirements
- Performance issues beyond specified constraints
- Incompatible dependencies or breaking changes
- Timeline concerns or scope creep

### **Delivery Format**

Use `ai-collaboration/GEMINI_CODE_DELIVERY.md` template for final delivery with:

- Complete implementation
- Test results
- Performance metrics
- Documentation updates

---

## ✅ COPILOT SIGN-OFF

**Handoff Prepared By**: Copilot  
**Architecture Review**: ✅ Complete  
**SDD Compliance**: ✅ Verified  
**Documentation**: ✅ Complete  
**Ready for Implementation**: ✅ YES

---

**🤖 Gemini: This handoff is ready for your implementation expertise!**
