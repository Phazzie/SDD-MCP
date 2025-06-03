# 🚀 GEMINI CODE STAGING AREA

## 📋 DELIVERY INSTRUCTIONS FOR GEMINI

When you complete implementation work, place your code deliverables in this file using the format below. Copilot will then process and apply your code to the actual project files.

---

## 📂 CODE DELIVERY FORMAT

### **DELIVERY METADATA**
```yaml
DELIVERY_ID: [unique-id-YYYY-MM-DD-HH-MM]
GEMINI_SESSION: [your-session-identifier]
TASK_REFERENCE: [task-name-from-assignment]
COMPLETION_STATUS: [COMPLETE|PARTIAL|NEEDS_REVIEW]
FILES_COUNT: [number-of-files-delivered]
BACKWARD_COMPATIBILITY: [VERIFIED|NEEDS_TESTING|BREAKING_CHANGES]
PERFORMANCE_IMPACT: [IMPROVED|NEUTRAL|DEGRADED|UNKNOWN]
```

### **FILE DELIVERY TEMPLATE**

For each file you're delivering, use this exact format:

```
=== FILE_START: [relative/path/to/file.ts] ===
ACTION: [CREATE|MODIFY|DELETE]
DESCRIPTION: [Brief description of changes]
SDD_SEAM: [Name of primary seam being implemented]
CONTRACTS_IMPLEMENTED: [List of contract interfaces]
BACKWARD_COMPATIBILITY: [SAFE|BREAKING|NEEDS_MIGRATION]

[COMPLETE FILE CONTENT OR MODIFICATION INSTRUCTIONS]

=== FILE_END: [relative/path/to/file.ts] ===
```

### **MODIFICATION INSTRUCTIONS FORMAT**

If modifying existing files, use this format:
```
=== MODIFICATION: [relative/path/to/file.ts] ===
CHANGE_TYPE: [INSERT|REPLACE|DELETE]
LOCATION: [Line number, function name, or search pattern]
DESCRIPTION: [What's being changed and why]

FIND:
[Exact text to find - including surrounding context]

REPLACE_WITH:
[New code to insert/replace]

=== END_MODIFICATION ===
```

---

## 🧪 TESTING DELIVERY FORMAT

```
=== TESTS_START ===
TEST_FILES: [List of test files created/modified]
COVERAGE_ACHIEVED: [Percentage or description]
PERFORMANCE_BENCHMARKS: [Results if applicable]
INTEGRATION_STATUS: [PASSED|FAILED|PARTIAL]

[Test code and results]

=== TESTS_END ===
```

---

## 📚 DOCUMENTATION DELIVERY FORMAT

```
=== DOCUMENTATION_START ===
DOC_TYPE: [API|README|ARCHITECTURE|COMMENTS]
UPDATES_REQUIRED: [List of docs that need updating]

[Documentation content]

=== DOCUMENTATION_END ===
```

---

## ⚠️ IMPORTANT NOTES FOR GEMINI

1. **Complete Files**: Always provide complete file content, not just snippets
2. **Context**: Include enough surrounding code for safe modifications
3. **Dependencies**: List any new dependencies that need installation
4. **Breaking Changes**: Clearly mark any backward compatibility issues
5. **Performance**: Note any performance implications
6. **Error Handling**: Ensure all code follows SDD error handling patterns

---

## 🤖 COPILOT PROCESSING CHECKLIST

When processing Gemini's delivery:
- [ ] Validate SDD pattern compliance
- [ ] Check backward compatibility
- [ ] Review error handling
- [ ] Verify contract implementations
- [ ] Run integration tests
- [ ] Update project documentation
- [ ] Archive successful delivery

---

# 📝 GEMINI DELIVERY WORKSPACE

**Place your code deliveries below this line:**

---

<!-- GEMINI: START YOUR DELIVERY HERE -->

[Gemini's code deliveries will appear here]

<!-- GEMINI: END YOUR DELIVERY HERE -->

---

## 🔄 DELIVERY STATUS LOG

| Date | Delivery ID | Status | Files | Notes |
|------|-------------|--------|-------|-------|
| YYYY-MM-DD | delivery-001 | PENDING | 3 | Tool registry implementation |
