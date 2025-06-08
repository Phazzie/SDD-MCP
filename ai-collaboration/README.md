# 🤝 AI Collaboration Framework for SDD Projects

## Overview

This folder contains the coordination files for multi-AI Seam-Driven Development (SDD) projects. It enables seamless collaboration between GitHub Copilot and Google Gemini on complex architectural tasks.

## File Structure

| File                                | Purpose                   | Primary User     |
| ----------------------------------- | ------------------------- | ---------------- |
| `GEMINI_TASK_ASSIGNMENT.md`         | Tasks assigned to Gemini  | Copilot → Gemini |
| `GEMINI_CODE_DELIVERY.md`           | Code delivered by Gemini  | Gemini → Copilot |
| `COPILOT_TASK_ASSIGNMENT.md`        | Tasks assigned to Copilot | Gemini → Copilot |
| `AI_COLLABORATION_LOG.md`           | Shared communication log  | Both AIs         |
| `CURRENT_STATUS.md`                 | Live project status       | Both AIs         |
| `SDD_ARCHITECTURE_REFACTOR_PLAN.md` | Granular SDD plan         | Both AIs         |

## 🔗 SDD Collaboration Principles

### 1. Seam-Based Task Division

- Each AI owns specific seams in the architecture
- Clear contracts define handoff points
- No AI works on another's seam without coordination

### 2. Contract-First Communication

- All task assignments include clear success criteria
- Code deliveries follow SDD patterns (ContractResult<T>)
- Architecture decisions documented before implementation

### 3. Fail-Fast Coordination

- Status updates after every major milestone
- Immediate escalation if seam contracts change
- Clear rollback procedures for integration failures

## 🚀 Workflow

1. **Task Assignment**: One AI creates task in appropriate `*_TASK_ASSIGNMENT.md`
2. **Acknowledgment**: Receiving AI updates `CURRENT_STATUS.md`
3. **Implementation**: Work follows SDD principles (seams → contracts → stubs → implementation)
4. **Delivery**: Code delivered via `*_CODE_DELIVERY.md` with SDD compliance
5. **Integration**: Requesting AI integrates and updates status
6. **Documentation**: Major decisions logged in `AI_COLLABORATION_LOG.md`

## 🎯 Success Criteria

- ✅ Both AIs can work independently on separate seams
- ✅ Clear handoff points prevent integration conflicts
- ✅ All code follows SDD patterns and conventions
- ✅ Architecture decisions are transparent and documented
- ✅ Project progress is trackable and recoverable

## 📚 References

- [SDD Methodology](../docs/SDD_METHODOLOGY.md)
- [Copilot Instructions](../.github/copilot-instructions.md)
- [Project Documentation](../docs/)
