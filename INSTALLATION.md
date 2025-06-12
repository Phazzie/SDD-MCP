# SDD MCP Server - Installation & Usage Guide

## 🚀 Quick Setup for Claude Desktop

### 1. Build the Project

```bash
cd C:\Users\thump\SkepticalWombat
npm run build
```

### 2. Validate Installation

**Test the foundation toolchain:**

```bash
# Test individual agents
node test-extract-components.js
node test-create-stub.js
node test-validate-compliance.js

# Test complete pipeline
node test-end-to-end-pipeline.js
```

**Expected Results:**

- **Execution Time**: ~55ms for complete pipeline
- **Success Rate**: 100% (all phases should pass)
- **Generated Code**: SDD-compliant stubs with blueprint comments
- **Compliance Score**: 100% SDD pattern validation

### 3. Configure Claude Desktop

Copy the contents of `claude-desktop-config.json` to your Claude Desktop MCP configuration file:

**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`  
**Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`

### 4. Restart Claude Desktop

### 5. Test the Connection

Ask Claude: _"Can you help me analyze requirements using SDD methodology?"_

## 📊 Performance Benchmarks

**Pipeline Performance** (PRD → Generated Code):

- **Small PRD** (1,000 chars): <10ms
- **Medium PRD** (2,500 chars): ~25ms
- **Large PRD** (4,000+ chars): ~55ms
- **Memory Usage**: <50MB peak

**Quality Metrics:**

- **SDD Compliance**: 100% pattern adherence
- **Type Safety**: Zero compilation errors
- **Code Generation**: Production-ready stubs with blueprint comments
- **Architecture**: Full seam communication validation

## 🧪 Troubleshooting

### Common Issues

**Build Errors:**

```bash
# Clear and rebuild
rm -rf dist/
npm run build
```

**Test Failures:**

```bash
# Check individual components
node test-extract-components.js  # Should show component extraction
node test-create-stub.js         # Should generate SDD-compliant stubs
node test-validate-compliance.js # Should show 100% compliance
```

**Performance Issues:**

- Expected: Sub-second execution for enterprise PRDs
- If slower: Check available system memory
- Large PRDs (10,000+ chars) may need optimization

## 🛠️ Available Tools

### `sdd_analyze_requirements`

Analyze PRD text and identify seams using SDD methodology.

**Input**:

- `prdText`: Product requirements document or project description
- `designNotes`: Optional design constraints

**Output**: List of identified seams with participants, data flows, and purposes

### `sdd_generate_contract`

Generate TypeScript contracts from seam definitions.

**Input**:

- `seam`: Seam definition object

**Output**: TypeScript contract code with ContractResult<T> patterns

### `sdd_create_stub`

Create implementation stubs with NotImplementedError patterns.

**Input**:

- `contractCode`: Contract interface code
- `componentName`: Name of the component

**Output**: Implementation stub with blueprint comments

### `sdd_orchestrate_full_workflow`

Complete SDD workflow automation: PRD → Seams → Contracts → Stubs → Tests.

**Input**:

- `prdText`: Project requirements
- `projectName`: Name of the project
- `designNotes`: Optional design notes

**Output**: Complete project structure ready for implementation

## 💡 Example Usage

### Analyze Requirements

```
Please analyze these requirements using SDD methodology:

"Build a user authentication system with login, registration, and password reset.
The system should integrate with external OAuth providers and send email notifications."
```

### Generate Full Project

```
Please orchestrate a full SDD workflow for this project:

Project: "Task Management API"
Requirements: "Create a REST API for managing tasks with user accounts, task CRUD operations,
due date notifications, and team collaboration features."
```

## 🎯 SDD Methodology Overview

1. **Seams First**: Identify communication pathways between components
2. **Contracts**: Define async interfaces with ContractResult<T> patterns
3. **Stubs**: Create fail-fast implementations with NotImplementedError
4. **Integration**: Test seam connections before full implementation
5. **Implementation**: Build actual logic using proven foundation

## 🔧 Troubleshooting

### Server Won't Start

- Ensure Node.js is installed
- Run `npm run build` to compile TypeScript
- Check the path in claude-desktop-config.json

### Tools Not Available

- Restart Claude Desktop after configuration changes
- Verify the MCP configuration file is in the correct location
- Check the server logs for errors

### Connection Issues

- Test the server directly: `npm run start`
- Ensure the built files exist in `dist/` directory
- Verify file permissions on Windows

## 📚 Additional Resources

- **SDD Documentation**: `docs/` directory
- **Template Examples**: `templates/` directory
- **Test Examples**: `src/tests/` directory
- **Implementation Strategy**: `docs/sdd-implementation-strategy.md`
