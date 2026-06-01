# GEMINI TASK 3: sdd_visualize_architecture

**FILE**: `src/tools/legacy/sdd-visualize-architecture-tool.ts`

**TASK**: Replace 3 NotImplementedError methods with **structured architecture data to diagram generation** per Gemini's suggestions

**GEMINI'S EXACT SUGGESTIONS**:

- Take **structured representation of architecture** (components, seams, data flows)
- Generate **diagram string** (MermaidJS syntax)
- Transform **structured data into diagram-specific syntax**

**INPUT SCHEMA** (per Gemini):

```typescript
{
  components: [{
    id: string,
    name: string,
    type: string
  }],
  seams: [{
    from: string,
    to: string,
    label: string,
    dataFlowDirection: 'uni' | 'bi'
  }]
}
```

**OUTPUT SCHEMA** (per Gemini):

```typescript
{
  diagramSyntax: string,
  diagramType: 'mermaid' | 'plantuml'
}
```

**WHAT TO IMPLEMENT**:

1. `processArchitectureData()` - Parse and validate architecture input
2. `generateDiagramSyntax()` - Transform structured data into Mermaid/PlantUML syntax
3. `validateDiagramOutput()` - Validate generated diagram syntax

**APPROACH**: Take structured architecture data (components, seams, data flows) and generate diagram syntax string (focus on MermaidJS).

**EXAMPLE OUTPUT**:

```typescript
{
  diagramSyntax: "flowchart TD\n    A[UserAgent] -->|authenticate| B[AuthService]\n    B -->|validate| C[Database]",
  diagramType: "mermaid"
}
```
