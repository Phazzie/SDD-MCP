# GEMINI TASK 4: sdd_validate_compliance

**FILE**: `src/tools/legacy/sdd-validate-compliance-tool.ts`

**TASK**: Replace 3 NotImplementedError methods with **robust validation engine** per Gemini's suggestions

**GEMINI'S EXACT SUGGESTIONS**:

- Take **various artifacts** (code files, contract definitions, project configurations)
- Check against **SDD compliance rules** (configurable/extensible)
- Generate **detailed compliance report**

**INPUT SCHEMA** (per Gemini):

```typescript
{
  artifactType: 'typescript_contract' | 'source_code_file' | 'project_config_json',
  content: string,
  rulesetId?: string
}
```

**OUTPUT SCHEMA** (per Gemini):

```typescript
{
  isCompliant: boolean,
  violations: [{
    ruleId: string,
    message: string,
    severity: 'error' | 'warning' | 'info',
    location?: object
  }],
  summary: string
}
```

**WHAT TO IMPLEMENT**:

1. **Process validation rules** - configure compliance criteria
2. **Analyze project structure** - scan files, validate SDD compliance
3. **Generate detailed report** - specific issues, scores, recommendations

**APPROACH**: Configurable validation engine → File analysis → Compliance scoring → Detailed reporting
