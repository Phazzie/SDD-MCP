# SDD MCP Server - Installation & Usage Guide

## 🚀 Quick Setup for Claude Desktop

### 1. Build the Project

```bash
cd C:\Users\thump\SkepticalWombat
npm run build
```

### 2. Configure Claude Desktop

Copy the contents of `claude-desktop-config.json` to your Claude Desktop MCP configuration file:

**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`  
**Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`

### 3. Restart Claude Desktop

### 4. Test the Connection

Ask Claude: _"Can you help me analyze requirements using SDD methodology?"_

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
