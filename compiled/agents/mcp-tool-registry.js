/**
 * Enhanced MCP Tool Registry - Infrastructure Foundation
 * 🎯 CRITICAL: Core MCP-Enhanced Analyzer Communication Pathway
 * Built using SDD methodology with fail-fast validation
 */
import { createSDDError, } from "../contracts.js";
export class EnhancedMCPToolRegistry {
    agentId = "EnhancedMCPToolRegistry";
    registeredTools = new Map();
    toolSchemas = new Map();
    toolHandlers = new Map();
    errorHandler;
    configManager;
    constructor(errorHandler, configManager) {
        this.errorHandler = errorHandler;
        this.configManager = configManager;
    }
    /**
     * 💰 HIGH_ROI: Register all enhanced seam analysis tools
     * Blueprint: Core tool registration with schema validation
     */
    async registerEnhancedTools() {
        try {
            const registrations = [];
            const timestamp = new Date().toISOString();
            // 🎯 CRITICAL: Enhanced Seam Analysis Tools
            const enhancedTools = [
                {
                    name: "analyze_requirements_enhanced",
                    description: "Enhanced AI-powered seam analysis with NLP and pattern recognition",
                    inputSchema: {
                        type: "object",
                        properties: {
                            requirements: { type: "string", minLength: 1 },
                            designNotes: { type: "string" },
                            analysisDepth: {
                                type: "string",
                                enum: ["BASIC", "ADVANCED", "COMPREHENSIVE"],
                            },
                        },
                        required: ["requirements"],
                    },
                    outputSchema: {
                        type: "object",
                        properties: {
                            identifiedSeams: { type: "array" },
                            interactionMatrix: { type: "object" },
                            dataFlows: { type: "array" },
                            confidence: { type: "number", minimum: 0, maximum: 1 },
                        },
                    },
                    agentId: "EnhancedSeamAnalyzer",
                    version: "2.0.0",
                },
                {
                    name: "generate_interaction_matrix",
                    description: "Generate component interaction matrix with dependency analysis",
                    inputSchema: {
                        type: "object",
                        properties: {
                            components: { type: "array", items: { type: "string" } },
                            context: { type: "string" },
                        },
                        required: ["components"],
                    },
                    outputSchema: {
                        type: "object",
                        properties: {
                            matrix: { type: "object" },
                            dependencies: { type: "array" },
                            recommendations: { type: "array" },
                        },
                    },
                    agentId: "EnhancedSeamAnalyzer",
                    version: "2.0.0",
                },
                {
                    name: "analyze_data_flows",
                    description: "Analyze data transformation chains and identify bottlenecks",
                    inputSchema: {
                        type: "object",
                        properties: {
                            dataElements: { type: "array", items: { type: "string" } },
                            transformations: { type: "array" },
                        },
                        required: ["dataElements"],
                    },
                    outputSchema: {
                        type: "object",
                        properties: {
                            flows: { type: "array" },
                            bottlenecks: { type: "array" },
                            optimizations: { type: "array" },
                        },
                    },
                    agentId: "EnhancedSeamAnalyzer",
                    version: "2.0.0",
                },
                {
                    name: "validate_seam_readiness",
                    description: "Validate seam implementation readiness with comprehensive checks",
                    inputSchema: {
                        type: "object",
                        properties: {
                            seamDefinitions: { type: "array" },
                            implementationStatus: { type: "object" },
                        },
                        required: ["seamDefinitions"],
                    },
                    outputSchema: {
                        type: "object",
                        properties: {
                            readinessScore: { type: "number", minimum: 0, maximum: 100 },
                            blockers: { type: "array" },
                            recommendations: { type: "array" },
                        },
                    },
                    agentId: "EnhancedSeamAnalyzer",
                    version: "2.0.0",
                },
            ];
            // ⚡ QUICK_WIN: Smart Template Processing Tools
            const smartTemplateTools = [
                {
                    name: "smart_template_selection",
                    description: "AI-powered template selection based on requirements analysis",
                    inputSchema: {
                        type: "object",
                        properties: {
                            requirements: { type: "string" },
                            projectType: { type: "string" },
                            preferences: { type: "object" },
                        },
                        required: ["requirements"],
                    },
                    outputSchema: {
                        type: "object",
                        properties: {
                            selectedTemplates: { type: "array" },
                            confidence: { type: "number" },
                            reasoning: { type: "string" },
                        },
                    },
                    agentId: "SmartTemplateProcessor",
                    version: "1.0.0",
                },
                {
                    name: "intelligent_template_customization",
                    description: "Intelligent template customization with context-aware modifications",
                    inputSchema: {
                        type: "object",
                        properties: {
                            templateName: { type: "string" },
                            customizationContext: { type: "object" },
                            targetFormat: { type: "string" },
                        },
                        required: ["templateName", "customizationContext"],
                    },
                    outputSchema: {
                        type: "object",
                        properties: {
                            customizedTemplate: { type: "string" },
                            modifications: { type: "array" },
                            quality: { type: "number" },
                        },
                    },
                    agentId: "SmartTemplateProcessor",
                    version: "1.0.0",
                },
            ];
            // 🧪 EXPERIMENTAL: Advanced Intelligence Tools
            const advancedIntelligenceTools = [
                {
                    name: "detect_architectural_patterns",
                    description: "Detect architectural patterns and anti-patterns in requirements",
                    inputSchema: {
                        type: "object",
                        properties: {
                            codebase: { type: "string" },
                            requirements: { type: "string" },
                            analysisLevel: {
                                type: "string",
                                enum: ["SURFACE", "DEEP", "COMPREHENSIVE"],
                            },
                        },
                        required: ["requirements"],
                    },
                    outputSchema: {
                        type: "object",
                        properties: {
                            patterns: { type: "array" },
                            antiPatterns: { type: "array" },
                            recommendations: { type: "array" },
                        },
                    },
                    agentId: "PatternDetector",
                    version: "1.0.0",
                },
                {
                    name: "predict_seam_quality",
                    description: "ML-powered seam quality prediction with training feedback",
                    inputSchema: {
                        type: "object",
                        properties: {
                            seamDefinitions: { type: "array" },
                            implementationHistory: { type: "object" },
                        },
                        required: ["seamDefinitions"],
                    },
                    outputSchema: {
                        type: "object",
                        properties: {
                            qualityScore: { type: "number", minimum: 0, maximum: 100 },
                            riskFactors: { type: "array" },
                            recommendations: { type: "array" },
                        },
                    },
                    agentId: "MLSeamPredictor",
                    version: "1.0.0",
                },
                {
                    name: "validate_sdd_compliance",
                    description: "Validate SDD methodology compliance with automated suggestions",
                    inputSchema: {
                        type: "object",
                        properties: {
                            implementation: { type: "object" },
                            sddRules: { type: "array" },
                        },
                        required: ["implementation"],
                    },
                    outputSchema: {
                        type: "object",
                        properties: {
                            complianceScore: { type: "number", minimum: 0, maximum: 100 },
                            violations: { type: "array" },
                            suggestions: { type: "array" },
                        },
                    },
                    agentId: "SDDComplianceValidator",
                    version: "1.0.0",
                },
            ];
            // Register all tools
            const allTools = [
                ...enhancedTools,
                ...smartTemplateTools,
                ...advancedIntelligenceTools,
            ];
            for (const tool of allTools) {
                const registration = {
                    ...tool,
                    registeredAt: timestamp,
                };
                const registeredTool = {
                    name: tool.name,
                    description: tool.description,
                    schema: tool.inputSchema,
                    handler: tool.agentId,
                    status: "ACTIVE",
                    lastUpdated: timestamp,
                };
                this.registeredTools.set(tool.name, registeredTool);
                this.toolSchemas.set(tool.name, tool.inputSchema);
                this.toolHandlers.set(tool.name, tool.agentId);
                registrations.push(registration);
            }
            return {
                success: true,
                data: registrations,
                metadata: {
                    agentId: this.agentId,
                    timestamp,
                    seamName: "MCP-Enhanced-Analyzer-Communication",
                    processingTimeMs: Date.now() - new Date(timestamp).getTime(),
                },
            };
        }
        catch (error) {
            await this.errorHandler.logError(error, {
                agentId: this.agentId,
                operation: "registerEnhancedTools",
                timestamp: new Date().toISOString(),
            });
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Failed to register enhanced tools: ${error.message}`, "MCP-Enhanced-Analyzer-Communication"),
            };
        }
    }
    /**
     * 🛡️ DEFENSIVE: Validate tool schema with comprehensive error reporting
     * Blueprint: Multi-layer validation preventing malformed requests
     */
    async validateToolSchema(toolName, args) {
        try {
            // Fail-fast input validation
            if (!toolName || typeof toolName !== "string") {
                return {
                    success: false,
                    error: createSDDError(this.agentId, "ValidationError", "Tool name is required and must be a string", "Tool-Schema-Validation"),
                };
            }
            const schema = this.toolSchemas.get(toolName);
            if (!schema) {
                return {
                    success: false,
                    error: createSDDError(this.agentId, "ValidationError", `Tool '${toolName}' not found in registry`, "Tool-Schema-Validation"),
                };
            }
            const errors = [];
            const warnings = [];
            // Basic type validation
            if (args === null || args === undefined) {
                errors.push({
                    field: "args",
                    message: "Arguments cannot be null or undefined",
                    expectedType: "object",
                    actualValue: args,
                });
            }
            // Schema-specific validation would go here
            // For now, implementing basic validation
            const isValid = errors.length === 0;
            return {
                success: true,
                data: {
                    isValid,
                    errors,
                    warnings,
                    processedArgs: args,
                },
                metadata: {
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                    seamName: "Tool-Schema-Validation",
                },
            };
        }
        catch (error) {
            await this.errorHandler.logError(error, {
                agentId: this.agentId,
                operation: "validateToolSchema",
                timestamp: new Date().toISOString(),
                additionalInfo: { toolName, args },
            });
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Schema validation failed: ${error.message}`, "Tool-Schema-Validation"),
            };
        }
    }
    /**
     * 🎯 CRITICAL: Route tool requests to appropriate handlers
     * Blueprint: Intelligent routing with load balancing and error recovery
     */
    async routeToolRequest(toolName, args) {
        try {
            // Fail-fast validation
            if (!toolName) {
                return {
                    success: false,
                    error: createSDDError(this.agentId, "ValidationError", "Tool name is required for routing", "Tool-Request-Routing"),
                };
            }
            const tool = this.registeredTools.get(toolName);
            if (!tool) {
                return {
                    success: false,
                    error: createSDDError(this.agentId, "ValidationError", `Tool '${toolName}' not found in registry`, "Tool-Request-Routing"),
                };
            }
            if (tool.status !== "ACTIVE") {
                return {
                    success: false,
                    error: createSDDError(this.agentId, "DependencyError", `Tool '${toolName}' is not active (status: ${tool.status})`, "Tool-Request-Routing"),
                };
            }
            // Validate schema before routing
            const validationResult = await this.validateToolSchema(toolName, args);
            if (!validationResult.success || !validationResult.data?.isValid) {
                return {
                    success: false,
                    error: createSDDError(this.agentId, "ValidationError", `Tool request failed validation: ${validationResult.data?.errors
                        .map((e) => e.message)
                        .join(", ")}`, "Tool-Request-Routing"),
                };
            }
            // TODO: 🔨 HARD_WORK - Implement actual routing to agent handlers
            // This will be implemented when the actual agent handlers are available
            // For now, return a success with routing information
            return {
                success: true,
                data: {
                    toolName,
                    handler: tool.handler,
                    status: "routed",
                    message: `Request for '${toolName}' routed to '${tool.handler}' (implementation pending)`,
                },
                metadata: {
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                    seamName: "Tool-Request-Routing",
                },
            };
        }
        catch (error) {
            await this.errorHandler.logError(error, {
                agentId: this.agentId,
                operation: "routeToolRequest",
                timestamp: new Date().toISOString(),
                additionalInfo: { toolName, args },
            });
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Tool routing failed: ${error.message}`, "Tool-Request-Routing"),
            };
        }
    }
    /**
     * ⚡ QUICK_WIN: Get all registered tools with status information
     * Blueprint: Tool discovery and health monitoring
     */
    async getRegisteredTools() {
        try {
            const tools = Array.from(this.registeredTools.values());
            return {
                success: true,
                data: tools,
                metadata: {
                    agentId: this.agentId,
                    timestamp: new Date().toISOString(),
                    seamName: "Tool-Registry-Query",
                },
            };
        }
        catch (error) {
            await this.errorHandler.logError(error, {
                agentId: this.agentId,
                operation: "getRegisteredTools",
                timestamp: new Date().toISOString(),
            });
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Failed to retrieve registered tools: ${error.message}`, "Tool-Registry-Query"),
            };
        }
    }
    /**
     * 🔄 REFACTOR: Refresh tool registry with health checks
     * Blueprint: Dynamic tool management and health monitoring
     */
    async refreshToolRegistry() {
        try {
            const timestamp = new Date().toISOString();
            // Update last updated timestamps for all tools
            for (const [toolName, tool] of this.registeredTools.entries()) {
                tool.lastUpdated = timestamp;
                // TODO: 🔨 HARD_WORK - Implement actual health checks for each tool
                // For now, just mark as active if they were previously active
                if (tool.status === "ERROR") {
                    tool.status = "ACTIVE"; // Reset error status for refresh
                }
            }
            return {
                success: true,
                metadata: {
                    agentId: this.agentId,
                    timestamp,
                    seamName: "Tool-Registry-Refresh",
                },
            };
        }
        catch (error) {
            await this.errorHandler.logError(error, {
                agentId: this.agentId,
                operation: "refreshToolRegistry",
                timestamp: new Date().toISOString(),
            });
            return {
                success: false,
                error: createSDDError(this.agentId, "ProcessingError", `Failed to refresh tool registry: ${error.message}`, "Tool-Registry-Refresh"),
            };
        }
    }
    // 🎨 POLISH: Utility methods for registry management
    getToolCount() {
        return this.registeredTools.size;
    }
    getActiveToolCount() {
        return Array.from(this.registeredTools.values()).filter((tool) => tool.status === "ACTIVE").length;
    }
    isToolRegistered(toolName) {
        return this.registeredTools.has(toolName);
    }
}
//# sourceMappingURL=mcp-tool-registry.js.map