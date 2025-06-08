# 🔮 **HELPER PROMPT TEMPLATE: SDD MCP Server**

## 📋 **TASK TYPE**

[ ] Code Implementation
[ ] Architecture Design
[ ] Bug Fix
[ ] Performance Optimization
[ ] Review/Analysis
[ ] SDD Contract Design
[ ] Other: [Specify]

---

## 📝 **TASK DESCRIPTION**

**Primary Goal**: [Clear, specific objective]

**Context**: [Brief background on why this is needed]

**Specific Requirements**:

- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

---

## 🏗️ **SDD SPECIFICS**

**Seams Involved**:

- [Seam 1]: [Brief description]
- [Seam 2]: [Brief description]

**Contracts To Use/Create**:

```typescript
// Example or specific contract interfaces needed
interface ExampleContract {
  method(input: InputType): Promise<ContractResult<OutputType>>;
}
```

**Error Handling Requirements**:

- [Specific validation or error handling needs]
- [Error categories to consider]

---

## 📁 **FILE CONTEXT**

### 🗂️ **PROJECT FILE LOCATIONS**

**Core Implementation**:

- `src/index.ts` - Main MCP server entry point
- `src/contracts.ts` - All type definitions and contracts
- `src/tool-registry.ts` - Modular tool registry system
- `src/tool-registry-clean.ts` - Clean version of registry (if needed)
- `src/adapters/legacy-tool-adapter.ts` - Backward compatibility layer

**AI Collaboration Framework**:

- `ai-collaboration/CURRENT_STATUS.md` - Project status tracking
- `ai-collaboration/FILLED_TURNOVER_PROMPT.md` - Complete session context
- `ai-collaboration/COPY_PASTE_NEW_SESSION.md` - Quick start prompt
- `ai-collaboration/HELPER_PROMPT_TEMPLATE.md` - This file (task structuring)
- `ai-collaboration/AI_COLLABORATION_LOG.md` - Decision history

**Documentation & Examples**:

- `README.md` - Project overview and setup
- `ai-collaboration/examples/tool-registry-integration-example.ts` - Usage examples
- `copilot_endof_chat_notes/` - Session completion records

**Configuration**:

- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `.github/copilot-instructions.md` - AI collaboration rules

### 📋 **TASK-SPECIFIC FILES**

**Files to Modify**:

- `[file path]`: [Current purpose and intended changes]
- `[file path]`: [Current purpose and intended changes]

**Files to Create**:

- `[file path]`: [Purpose and contents]

**Reference Files**:

- `[file path]`: [Why this is relevant as reference]

---

## 🧠 **SPECIFIC GUIDANCE NEEDED**

I need help with:

- [Specific aspect you need help with]
- [Questions you have]
- [Areas of uncertainty]

---

## 🎨 **CREATIVE CONSTRAINTS**

**Inspiration Sources**:

- [Source 1]: [Unexpected but relevant inspiration - e.g., "biological immune systems"]
- [Source 2]: [Another non-obvious reference point that could spark novel solutions]

**Conceptual Metaphors**:

- [Metaphor 1]: [Helpful mental model to approach this problem - e.g., "Think of this registry like a neural network"]
- [Metaphor 2]: [Another metaphor that provides an alternative perspective]

**Challenge Prompts**:

- "What if [conventional constraint] didn't exist?"
- "How would [unrelated domain expert] solve this problem?"

---

## 🛑 **CONSTRAINTS & CONSIDERATIONS**

**Performance Requirements**:

- [Any performance criteria]

**Compatibility Requirements**:

- [Backward compatibility needs]
- [Integration with existing systems]

**Out of Scope**:

- [What should NOT be included in the solution]

---

## 🔍 **EXAMPLES & REFERENCES**

**Similar Patterns**:

```typescript
// Example code snippet showing similar implementation
const example = async () => {
  // Relevant code showing pattern to follow
};
```

**Documentation References**:

- [Link or file reference]
- [Link or file reference]

---

## 💭 **PREFERRED APPROACH**

**Ideal Solution**: [Brief description of what you think might work]

**Alternative Options to Consider**:

- [Option 1]: [Pros/Cons]
- [Option 2]: [Pros/Cons]

---

## 🔄 **ITERATION GUIDANCE**

**Fast-Feedback Loops**:

- **Checkpoint 1**: [Specific milestone where you want feedback before continuing]
- **Checkpoint 2**: [Another incremental point to validate direction]

**Failure Modes to Test**:

- [Edge Case 1]: [How to specifically test this challenging scenario]
- [Edge Case 2]: [Another non-obvious failure mode to validate against]
- [Performance Scenario]: [Specific load/stress condition to consider]

**Learning Goals**: [What you want to learn from this implementation, beyond just completing it]

---

**Additional Notes**: [Any other relevant information]

**Priority**: [High/Medium/Low]
