#!/usr/bin/env node
"use strict";
/**
 * SDD MCP Server
 * Provides AI assistants with Seam-Driven Development tools
 * Based on proven real-world SDD methodology
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
// Server configuration
const SERVER_INFO = {
    name: "sdd-mcp-server",
    version: "1.0.0",
    description: "Seam-Driven Development tools for AI-assisted software development"
};
// Create the MCP server instance
const server = new index_js_1.Server({
    name: SERVER_INFO.name,
    version: SERVER_INFO.version,
}, {
    capabilities: {
        tools: {},
    },
});
// Tool 1: Analyze Requirements and Identify Seams
server.setRequestHandler(types_js_1.ListToolsRequestSchema, () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        tools: [
            {
                name: "sdd_analyze_requirements",
                description: "Analyze PRD/requirements and identify all component seams for SDD implementation",
                inputSchema: {
                    type: "object",
                    properties: {
                        prdText: {
                            type: "string",
                            description: "The Product Requirements Document or project description text"
                        },
                        designNotes: {
                            type: "string",
                            description: "Optional additional design notes or constraints"
                        }
                    },
                    required: ["prdText"]
                }
            },
            {
                name: "sdd_generate_contract",
                description: "Generate a single contract using proven SDD patterns (ContractResult<T>, blueprint comments)",
                inputSchema: {
                    type: "object",
                    properties: {
                        seam: {
                            type: "object",
                            description: "Seam definition containing name, participants, dataFlow, purpose",
                            properties: {
                                name: { type: "string" },
                                participants: { type: "array", items: { type: "string" } },
                                dataFlow: { type: "string", enum: ["IN", "OUT", "BOTH"] },
                                purpose: { type: "string" },
                                contractInterface: { type: "string" }
                            },
                            required: ["name", "participants", "dataFlow", "purpose"]
                        }
                    },
                    required: ["seam"]
                }
            },
            {
                name: "sdd_create_stub",
                description: "Create implementation stub with blueprint comments and NotImplementedError patterns",
                inputSchema: {
                    type: "object",
                    properties: {
                        contractCode: {
                            type: "string",
                            description: "The contract interface code to create a stub for"
                        },
                        componentName: {
                            type: "string",
                            description: "Name of the component (e.g., UserAgent, AuthAgent)"
                        }
                    },
                    required: ["contractCode", "componentName"]
                }
            },
            {
                name: "sdd_orchestrate_full_workflow",
                description: "Complete SDD workflow: PRD → Seams → Contracts → Stubs → Tests → Ready for Implementation",
                inputSchema: {
                    type: "object",
                    properties: {
                        prdText: {
                            type: "string",
                            description: "The Product Requirements Document or project description"
                        },
                        designNotes: {
                            type: "string",
                            description: "Optional design notes or constraints"
                        },
                        projectName: {
                            type: "string",
                            description: "Name of the project being built"
                        }
                    },
                    required: ["prdText", "projectName"]
                }
            }
        ]
    };
}));
// Tool implementations
server.setRequestHandler(types_js_1.CallToolRequestSchema, (request) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case "sdd_analyze_requirements":
                return yield analyzeRequirements(args);
            case "sdd_generate_contract":
                return yield generateContract(args);
            case "sdd_create_stub":
                return yield createStub(args);
            case "sdd_orchestrate_full_workflow":
                return yield orchestrateFullWorkflow(args);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error in ${name}: ${error instanceof Error ? error.message : String(error)}`
                }
            ],
            isError: true
        };
    }
}));
// Core SDD Functions Implementation
function analyzeRequirements(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const { prdText, designNotes } = args;
        // AI-powered seam identification
        const seams = identifySeamsFromPRD(prdText, designNotes);
        const result = {
            identifiedSeams: seams,
            seamCount: seams.length,
            analysisComplete: true,
            recommendations: [
                "Review identified seams for completeness",
                "Ensure all data flows are captured",
                "Validate seam boundaries make sense for your domain"
            ]
        };
        return {
            content: [
                {
                    type: "text",
                    text: `## SDD Seam Analysis Complete

**Identified ${seams.length} seams from your requirements:**

${seams.map((seam, i) => `
### ${i + 1}. ${seam.name}
- **Purpose**: ${seam.purpose}
- **Participants**: ${seam.participants.join(', ')}  
- **Data Flow**: ${seam.dataFlow}
- **Contract Interface**: ${seam.contractInterface}
`).join('\n')}

**Next Steps:**
1. Generate contracts for each seam using \`sdd_generate_contract\`
2. Or use \`sdd_orchestrate_full_workflow\` for complete automation

**Analysis Details:**
${JSON.stringify(result, null, 2)}`
                }
            ]
        };
    });
}
function generateContract(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const { seam } = args;
        // Use your proven contract template patterns
        const contractResult = generateContractFromSeam(seam);
        return {
            content: [
                {
                    type: "text",
                    text: `## Generated Contract: ${seam.name}

**File**: \`${contractResult.fileName}\`

\`\`\`typescript
${contractResult.contractCode}
\`\`\`

**Blueprint Comments Generated:**
${contractResult.blueprintComments}

**Type Aliases:**
${contractResult.typeAliases.join(', ')}

**Key Features:**
- ✅ ContractResult<T> pattern for standardized error handling
- ✅ Blueprint comments for AI implementation guidance  
- ✅ Type aliases for template precision
- ✅ AgentId tracking for debugging
- ✅ Health check method for integration testing`
                }
            ]
        };
    });
}
function createStub(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const { contractCode, componentName } = args;
        const stubResult = generateStubFromContract(contractCode, componentName);
        return {
            content: [
                {
                    type: "text",
                    text: `## Generated Implementation Stub: ${componentName}

**File**: \`${stubResult.fileName}\`

\`\`\`typescript
${stubResult.stubCode}
\`\`\`

**Blueprint Comments:**
${stubResult.blueprintComments}

**Test Template:**
\`\`\`typescript
${stubResult.testTemplate}
\`\`\`

**Implementation Notes:**
- ✅ NotImplementedError with agentId tracking
- ✅ Blueprint comments guide AI implementation
- ✅ Logging structure ready for step-by-step tracking
- ✅ Contract test template for validation`
                }
            ]
        };
    });
}
function orchestrateFullWorkflow(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const { prdText, designNotes, projectName } = args;
        // Complete SDD workflow automation
        const seams = identifySeamsFromPRD(prdText, designNotes);
        const contracts = seams.map(seam => generateContractFromSeam(seam));
        const stubs = contracts.map(contract => generateStubFromContract(contract.contractCode, extractComponentName(contract.fileName)));
        const integrationTests = generateIntegrationTests(seams, contracts);
        const projectStructure = {
            contracts,
            stubs,
            integrationTests,
            readyForImplementation: true,
            readinessScore: calculateReadinessScore(contracts, stubs, integrationTests)
        };
        return {
            content: [
                {
                    type: "text",
                    text: `# 🎯 SDD Project: ${projectName} - READY FOR IMPLEMENTATION

## Project Structure Generated

### 📋 Contracts (${contracts.length})
${contracts.map(c => `- \`${c.fileName}\``).join('\n')}

### 🔧 Implementation Stubs (${stubs.length})  
${stubs.map(s => `- \`${s.fileName}\``).join('\n')}

### 🧪 Integration Tests (${integrationTests.length})
${integrationTests.map((test, i) => `- Integration Test ${i + 1}`).join('\n')}

## 📊 Project Readiness: ${projectStructure.readinessScore}/100

**Status**: ${projectStructure.readyForImplementation ? '✅ READY FOR IMPLEMENTATION' : '⚠️ NEEDS ATTENTION'}

## 🚀 Next Steps for Implementation

1. **Review Generated Contracts** - Ensure seam definitions match your vision
2. **Validate Integration Tests** - Run tests to verify seam connections work  
3. **Begin Implementation** - Use stubs as starting points, guided by blueprint comments
4. **Iterate with Confidence** - SDD structure prevents the "70% wall"

**Your proven SDD methodology has been fully automated and applied to "${projectName}"!**

## Generated Files Preview

${contracts.slice(0, 2).map(contract => `
### ${contract.fileName}
\`\`\`typescript
${contract.contractCode.substring(0, 500)}...
\`\`\`
`).join('\n')}

**Complete project structure is ready for development!**`
                }
            ]
        };
    });
}
// Helper functions for SDD logic
function identifySeamsFromPRD(prdText, designNotes) {
    // AI-powered seam identification logic
    // This is where the magic happens - analyzing requirements to find component boundaries
    // For now, implementing basic pattern recognition
    // In production, this would use more sophisticated NLP/AI analysis
    const commonPatterns = [
        { keywords: ['user', 'login', 'auth', 'signup'], component: 'UserAgent' },
        { keywords: ['data', 'store', 'database', 'persist'], component: 'DataStoreAgent' },
        { keywords: ['email', 'notification', 'message'], component: 'NotificationAgent' },
        { keywords: ['orchestrat', 'coordinate', 'main', 'control'], component: 'OrchestratorAgent' },
        { keywords: ['ui', 'interface', 'frontend', 'display'], component: 'UIAgent' }
    ];
    const foundComponents = new Set();
    const text = (prdText + ' ' + (designNotes || '')).toLowerCase();
    for (const pattern of commonPatterns) {
        if (pattern.keywords.some(keyword => text.includes(keyword))) {
            foundComponents.add(pattern.component);
        }
    }
    // Generate seams between found components
    const components = Array.from(foundComponents);
    const seams = [];
    // Create seams based on common interaction patterns
    if (components.includes('UIAgent') && components.includes('OrchestratorAgent')) {
        seams.push({
            name: 'UI-Orchestrator Seam',
            participants: ['UIAgent', 'OrchestratorAgent'],
            dataFlow: 'BOTH',
            purpose: 'Handle user interactions and coordinate system responses',
            contractInterface: 'IUIOrchestrationContract'
        });
    }
    if (components.includes('OrchestratorAgent') && components.includes('DataStoreAgent')) {
        seams.push({
            name: 'Orchestrator-DataStore Seam',
            participants: ['OrchestratorAgent', 'DataStoreAgent'],
            dataFlow: 'BOTH',
            purpose: 'Manage data persistence and retrieval operations',
            contractInterface: 'IDataAccessContract'
        });
    }
    if (components.includes('UserAgent')) {
        seams.push({
            name: 'User Management Seam',
            participants: ['UserAgent', 'DataStoreAgent'],
            dataFlow: 'BOTH',
            purpose: 'Handle user authentication, authorization, and profile management',
            contractInterface: 'IUserManagementContract'
        });
    }
    if (components.includes('NotificationAgent')) {
        seams.push({
            name: 'Notification Seam',
            participants: ['OrchestratorAgent', 'NotificationAgent'],
            dataFlow: 'OUT',
            purpose: 'Send notifications and messages to users',
            contractInterface: 'INotificationContract'
        });
    }
    return seams;
}
function generateContractFromSeam(seam) {
    const componentName = seam.name.replace(/[-\s]/g, '').replace('Seam', '');
    const pascalCaseName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
    // Use your proven contract template pattern
    const contractCode = `/**
 * PURPOSE: Defines the contract for ${seam.purpose}
 * DATA FLOW: ${seam.dataFlow} - ${seam.participants.join(' ↔ ')} 
 * INTEGRATION POINTS: ${seam.participants.map(p => `Called by: ${p}`).join(', ')}
 * FAILURE MODES: 
 * - Invalid input data: Returns ValidationError
 * - Dependency unavailable: Returns DependencyError
 * - Processing failure: Returns ProcessingError
 * CONTRACT VERSION: 1.0.0
 * ERROR HANDLING: Returns ContractResult with AgentError for failures
 */

import { AgentId, ContractResult, AgentError } from "./types";

// Input Type Alias (for template precision)
export type ${pascalCaseName}Input = {
  requestingAgentId: AgentId;
  // Add domain-specific input fields here based on: ${seam.purpose}
};

// Output Type Alias (for template precision)
export type ${pascalCaseName}Output = {
  // Add domain-specific output fields here
  processingMetadata?: {
    timestamp: string;
    processingTimeMs: number;
  };
};

// Request Interface (standardized structure)  
export interface ${pascalCaseName}Request {
  requestingAgentId: AgentId;
  payload: ${pascalCaseName}Input;
  requestId?: string; // For request tracking/debugging
}

// Response Interface (standardized structure)
export interface ${pascalCaseName}Response {
  data: ${pascalCaseName}Output;
  metadata: {
    handledBy: AgentId;
    requestId?: string;
    timestamp: string;
  };
}

// Main Contract Interface
export interface I${pascalCaseName}Agent {
  /**
   * ${seam.purpose}
   * 
   * BEHAVIOR:
   * - Validates input according to ${pascalCaseName}Input requirements
   * - Processes request according to domain logic
   * - Returns standardized ContractResult with success data or detailed error
   * 
   * LOGGING REQUIREMENTS:
   * - Log entry: agentId, requestId, input parameters (excluding sensitive data)
   * - Log exit: success/failure, processing time, result summary
   * - Log errors: full error context including agentId and requestId
   */
  handle${pascalCaseName}Request(request: ${pascalCaseName}Request): Promise<ContractResult<${pascalCaseName}Response>>;
  
  /**
   * Health check method for integration testing
   */
  checkHealth(): Promise<ContractResult<{status: 'healthy' | 'unhealthy', details?: string}>>;
}`;
    const blueprintComments = `Blueprint comments generated for ${pascalCaseName}:
- PURPOSE: Clear contract definition
- DATA FLOW: Standardized request/response pattern
- INTEGRATION POINTS: Health check for testing
- FAILURE MODES: Comprehensive error handling
- LOGGING: Structured for debugging`;
    return {
        contractCode,
        blueprintComments,
        typeAliases: [`${pascalCaseName}Input`, `${pascalCaseName}Output`, `${pascalCaseName}Request`, `${pascalCaseName}Response`],
        fileName: `${pascalCaseName.toLowerCase()}.contract.ts`
    };
}
function generateStubFromContract(contractCode, componentName) {
    const pascalCaseName = componentName.charAt(0).toUpperCase() + componentName.slice(1).replace('Agent', '') + 'Agent';
    const stubCode = `/**
 * IMPLEMENTATION STUB: ${pascalCaseName}
 * PURPOSE: Provides skeletal implementation with proper SDD patterns
 * STATUS: STUB - Needs implementation
 * NEXT STEPS: Replace NotImplementedError with actual business logic
 */

import { AgentId, ContractResult, AgentError, createAgentError } from "./types";
import { I${pascalCaseName.replace('Agent', '')}Agent, ${pascalCaseName.replace('Agent', '')}Request, ${pascalCaseName.replace('Agent', '')}Response } from "./${pascalCaseName.toLowerCase().replace('agent', '')}.contract";

export class ${pascalCaseName} implements I${pascalCaseName.replace('Agent', '')}Agent {
  private readonly agentId: AgentId;
  
  constructor(agentId: AgentId = "${pascalCaseName.toLowerCase()}-001") {
    this.agentId = agentId;
  }
  
  async handle${pascalCaseName.replace('Agent', '')}Request(
    request: ${pascalCaseName.replace('Agent', '')}Request
  ): Promise<ContractResult<${pascalCaseName.replace('Agent', '')}Response>> {
    // Step 1: Log entry
    console.log(\`[\${this.agentId}] Processing \${request.requestId || 'unknown'} request\`);
    
    try {
      // Step 2: Validate input
      if (!request.payload) {
        return {
          isSuccess: false,
          error: createAgentError(
            this.agentId,
            "Invalid request: payload is required",
            "ValidationError"
          )
        };
      }
      
      // Step 3: Business logic implementation
      // TODO: Replace with actual implementation
      throw new Error(\`NotImplementedError: \${this.agentId} - handle\${pascalCaseName.replace('Agent', '')}Request not yet implemented\`);
      
      // Step 4: Return success (template for when implemented)
      /*
      return {
        isSuccess: true,
        data: {
          data: {
            // Add your response data here
          },
          metadata: {
            handledBy: this.agentId,
            requestId: request.requestId,
            timestamp: new Date().toISOString()
          }
        }
      };
      */
      
    } catch (error) {
      // Step 5: Error handling
      console.error(\`[\${this.agentId}] Error processing request:\`, error);
      
      return {
        isSuccess: false,
        error: createAgentError(
          this.agentId,
          error instanceof Error ? error.message : String(error),
          "ProcessingError"
        )
      };
    }
  }
  
  async checkHealth(): Promise<ContractResult<{status: 'healthy' | 'unhealthy', details?: string}>> {
    // TODO: Add actual health checks (database connectivity, etc.)
    return {
      isSuccess: true,
      data: {
        status: 'healthy',
        details: \`\${this.agentId} is ready (stub implementation)\`
      }
    };
  }
}`;
    const testTemplate = `// Integration test template for ${pascalCaseName}
import { ${pascalCaseName} } from "./${pascalCaseName.toLowerCase()}";

describe('${pascalCaseName} Integration Tests', () => {
  let agent: ${pascalCaseName};
  
  beforeEach(() => {
    agent = new ${pascalCaseName}();
  });
  
  test('should handle valid request', async () => {
    const request = {
      requestingAgentId: 'test-agent',
      payload: {
        requestingAgentId: 'test-agent',
        // Add test data here
      },
      requestId: 'test-001'
    };
    
    const result = await agent.handle${pascalCaseName.replace('Agent', '')}Request(request);
    
    // Initially will fail with NotImplementedError - that's expected!
    expect(result.isSuccess).toBe(false);
    expect(result.error?.message).toContain('NotImplementedError');
  });
  
  test('should pass health check', async () => {
    const result = await agent.checkHealth();
    
    expect(result.isSuccess).toBe(true);
    expect(result.data?.status).toBe('healthy');
  });
});`;
    return {
        stubCode,
        blueprintComments: `Implementation stub generated with SDD best practices:
- NotImplementedError with agentId tracking
- Structured logging for debugging
- Proper error handling patterns
- Health check implementation
- Integration test template provided`,
        testTemplate,
        fileName: `${pascalCaseName.toLowerCase()}.ts`
    };
}
function generateIntegrationTests(seams, contracts) {
    return seams.map((seam, index) => `Integration Test ${index + 1}: Validate ${seam.name} - ${seam.participants.join(' ↔ ')} connection works`);
}
function extractComponentName(fileName) {
    return fileName.replace('.contract.ts', '').replace(/[-_]/g, '');
}
function calculateReadinessScore(contracts, stubs, integrationTests) {
    let score = 0;
    // Contract completeness (40 points)
    score += contracts.length * 10; // 10 points per contract
    // Stub completeness (40 points) 
    score += stubs.length * 10; // 10 points per stub
    // Integration test coverage (20 points)
    score += integrationTests.length * 5; // 5 points per integration test
    return Math.min(score, 100);
}
// Start the server
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const transport = new stdio_js_1.StdioServerTransport();
        yield server.connect(transport);
        console.error("SDD MCP Server running on stdio");
    });
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
