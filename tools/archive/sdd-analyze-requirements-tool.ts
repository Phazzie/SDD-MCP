import {
  ContractResult,
  RequirementsAnalysisInput,
  RequirementsAnalysisOutput,
} from "../../contracts.js";

class NotImplementedError extends Error {
  constructor(methodName: string, blueprint: string) {
    super(`${methodName}: ${blueprint}`);
    this.name = "NotImplementedError";
  }
}

/**
 * SDD Requirements Analysis Agent
 * Analyzes PRD/requirements and identifies component seams for SDD implementation
 *
 * Blueprint: This agent processes natural language requirements and:
 * - Identifies system components and their boundaries
 * - Defines communication seams between components
 * - Maps data flows and dependencies
 * - Provides implementation order recommendations
 */
export class RequirementsAnalysisAgent {
  private readonly agentId = "requirements-analysis-agent";

  /**
   * Validate input parameters for requirements analysis
   */ async validateInput(
    input: unknown
  ): Promise<ContractResult<RequirementsAnalysisInput>> {
    try {
      if (!input || typeof input !== "object") {
        return {
          success: false,
          error: "Input must be an object",
          metadata: {
            agentId: this.agentId,
            seamName: "validateInput",
            timestamp: new Date().toISOString(),
            validationErrors: "Invalid input type",
          },
        };
      }

      const data = input as any;
      if (
        !data.prdText ||
        typeof data.prdText !== "string" ||
        data.prdText.length < 10
      ) {
        return {
          success: false,
          error: "prdText is required and must be at least 10 characters",
          metadata: {
            agentId: this.agentId,
            seamName: "validateInput",
            timestamp: new Date().toISOString(),
            validationErrors: "prdText validation failed",
          },
        };
      }

      return {
        success: true,
        data: data as RequirementsAnalysisInput,
        metadata: {
          agentId: this.agentId,
          seamName: "validateInput",
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Input validation failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
        metadata: {
          agentId: this.agentId,
          seamName: "validateInput",
          timestamp: new Date().toISOString(),
          validationErrors: error,
        },
      };
    }
  }
  /**
   * Execute requirements analysis
   */
  async execute(
    analysisInput: RequirementsAnalysisInput
  ): Promise<ContractResult<RequirementsAnalysisOutput>> {
    throw new NotImplementedError(
      "RequirementsAnalysisAgent.execute",
      `Blueprint: Process PRD text and identify component seams for SDD implementation
      
      DETAILED IMPLEMENTATION PLAN:
      
      // PHASE 1: Text Analysis and Component Extraction
      const components = this.extractComponents(analysisInput.prdText);
      // - Split text into sentences/paragraphs
      // - Look for component keywords (user, auth, admin, database, api, etc.)
      // - Identify entity nouns and action verbs
      // - Map to ComponentDefinition objects
      
      // PHASE 2: Seam Identification 
      const seams = this.identifySeams(components, analysisInput.prdText);
      // - Find interaction patterns (words like "communicates", "sends", "receives")
      // - Identify data flow directions (IN, OUT, BOTH)
      // - Map component relationships to seam definitions
      // - Generate seam names and purposes
      
      // PHASE 3: Data Flow Analysis
      const dataFlows = this.analyzeDataFlows(seams);
      // - Map input/output types for each seam
      // - Identify transformation requirements
      // - Detect potential bottlenecks
      
      // PHASE 4: Implementation Ordering
      const implementationOrder = this.generateImplementationOrder(components);
      // - Analyze component dependencies
      // - Create topological sort of implementation order
      // - Identify critical path components
      
      // PHASE 5: Generate Recommendations
      const recommendations = this.createRecommendations(components, seams);
      // - Suggest architectural patterns
      // - Identify potential risks
      // - Recommend implementation strategies
      
      // PHASE 6: Assemble Final Output
      return {
        success: true,
        data: {
          seamDefinitions: seams,
          components: components,
          dataFlowMappings: dataFlows,
          implementationOrder: implementationOrder,
          recommendations: recommendations,
          analysisMetadata: {
            totalSeams: seams.length,
            totalComponents: components.length,
            complexity: this.calculateComplexity(seams, components),
            confidenceScore: this.calculateConfidence(analysisInput.prdText),
            analysisTimestamp: new Date().toISOString(),
            analysisVersion: "2.0"
          }
        }
      };`
    );
  }

  // Blueprint: HELPER METHODS TO IMPLEMENT
  /**
   * Blueprint: Extract system components from PRD text
   * Returns: ComponentDefinition[] with name, type, purpose, dependencies
   */
  private extractComponents(prdText: string): any[] {
    const components: any[] = [];

    // Basic component keywords to look for
    const componentKeywords = [
      "user",
      "admin",
      "authentication",
      "auth",
      "database",
      "api",
      "server",
      "client",
      "service",
      "manager",
      "handler",
      "controller",
      "dashboard",
      "interface",
      "system",
      "module",
      "component",
      "agent",
    ];

    // Common component types
    const typeMapping: Record<string, string> = {
      user: "interface",
      admin: "interface",
      dashboard: "interface",
      authentication: "service",
      auth: "service",
      database: "storage",
      api: "service",
      server: "service",
      service: "service",
      manager: "service",
      handler: "service",
      controller: "service",
    };

    const text = prdText.toLowerCase();
    const sentences = text
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Extract components mentioned in text
    const foundComponents = new Set<string>();

    for (const keyword of componentKeywords) {
      if (text.includes(keyword)) {
        // Extract context around the keyword for purpose
        const keywordSentences = sentences.filter((s) => s.includes(keyword));
        const purpose =
          keywordSentences[0] || `Handles ${keyword} functionality`;

        const componentName =
          keyword.charAt(0).toUpperCase() + keyword.slice(1);
        const componentType = typeMapping[keyword] || "component";

        if (!foundComponents.has(componentName)) {
          foundComponents.add(componentName);

          components.push({
            name: componentName,
            type: componentType,
            purpose: purpose.slice(0, 100), // Truncate long purposes
            dependencies: [], // Will be populated later
            confidence: 0.8, // Basic confidence score
          });
        }
      }
    }

    // Ensure we have at least some basic components
    if (components.length === 0) {
      components.push({
        name: "System",
        type: "service",
        purpose: "Main system component",
        dependencies: [],
        confidence: 0.5,
      });
    }

    return components;
  }
  /**
   * Blueprint: Identify communication seams between components
   * Returns: SeamDefinition[] with name, participants, dataFlow, purpose
   */
  private identifySeams(components: any[], prdText: string): any[] {
    const seams: any[] = [];
    const text = prdText.toLowerCase();

    // Interaction keywords that suggest communication between components
    const interactionKeywords = [
      "sends",
      "receives",
      "communicates",
      "connects",
      "integrates",
      "manages",
      "handles",
      "processes",
      "stores",
      "retrieves",
      "authenticates",
      "validates",
      "authorizes",
      "accesses",
    ];

    // Data flow direction indicators
    const dataFlowPatterns = {
      IN: ["receives", "gets", "retrieves", "loads", "imports"],
      OUT: ["sends", "exports", "outputs", "generates", "creates"],
      BOTH: ["manages", "handles", "processes", "synchronizes"],
    };

    // Create seams between related components
    for (let i = 0; i < components.length; i++) {
      for (let j = i + 1; j < components.length; j++) {
        const comp1 = components[i];
        const comp2 = components[j];

        // Check if these components should have a seam based on common patterns
        const shouldCreateSeam = this.shouldComponentsCommunicate(
          comp1,
          comp2,
          text
        );

        if (shouldCreateSeam.create) {
          const seamName = this.generateSeamName(
            comp1.name,
            comp2.name,
            shouldCreateSeam.interaction
          );
          const dataFlow = this.determineDataFlow(comp1, comp2);

          seams.push({
            name: seamName,
            participants: [comp1.name, comp2.name],
            dataFlow: dataFlow,
            purpose: `Handle communication between ${comp1.name} and ${comp2.name} for ${shouldCreateSeam.interaction}`,
            source: comp1.name,
            target: comp2.name,
            interactionType: shouldCreateSeam.interaction,
            confidence: shouldCreateSeam.confidence,
          });
        }
      }
    }

    // Add some common architectural seams based on component types
    seams.push(...this.addStandardArchitectureSeams(components));

    // Ensure we have at least one seam
    if (seams.length === 0 && components.length >= 2) {
      seams.push({
        name: "SystemIntegration",
        participants: [components[0].name, components[1].name],
        dataFlow: "BOTH",
        purpose: "Basic system integration between core components",
        source: components[0].name,
        target: components[1].name,
        interactionType: "integration",
        confidence: 0.5,
      });
    }

    return seams;
  }

  /**
   * Helper: Determine if two components should communicate
   */
  private shouldComponentsCommunicate(
    comp1: any,
    comp2: any,
    prdText: string
  ): any {
    // Common interaction patterns
    const interactions = [
      {
        pattern: ["user", "auth"],
        interaction: "authentication",
        confidence: 0.9,
      },
      {
        pattern: ["auth", "database"],
        interaction: "data_storage",
        confidence: 0.8,
      },
      {
        pattern: ["api", "database"],
        interaction: "data_access",
        confidence: 0.9,
      },
      {
        pattern: ["user", "dashboard"],
        interaction: "user_interface",
        confidence: 0.8,
      },
      {
        pattern: ["admin", "system"],
        interaction: "management",
        confidence: 0.7,
      },
      {
        pattern: ["api", "service"],
        interaction: "service_call",
        confidence: 0.7,
      },
    ];

    const comp1Lower = comp1.name.toLowerCase();
    const comp2Lower = comp2.name.toLowerCase();

    // Check for known interaction patterns
    for (const interaction of interactions) {
      const [first, second] = interaction.pattern;
      if (
        (comp1Lower.includes(first) && comp2Lower.includes(second)) ||
        (comp1Lower.includes(second) && comp2Lower.includes(first))
      ) {
        return {
          create: true,
          interaction: interaction.interaction,
          confidence: interaction.confidence,
        };
      }
    }

    // Check if they're mentioned together in the PRD text
    const mentionedTogether =
      prdText.includes(comp1Lower) && prdText.includes(comp2Lower);
    if (mentionedTogether) {
      return {
        create: true,
        interaction: "collaboration",
        confidence: 0.6,
      };
    }

    return { create: false, interaction: null, confidence: 0 };
  }

  /**
   * Helper: Generate seam name based on components and interaction
   */
  private generateSeamName(
    comp1Name: string,
    comp2Name: string,
    interaction: string
  ): string {
    const interactionMap: Record<string, string> = {
      authentication: "Auth",
      data_storage: "DataStore",
      data_access: "DataAccess",
      user_interface: "UI",
      management: "Manage",
      service_call: "Service",
      collaboration: "Collab",
    };

    const prefix = interactionMap[interaction] || "Connect";
    return `${prefix}${comp1Name}${comp2Name}`;
  }

  /**
   * Helper: Determine data flow direction between components
   */
  private determineDataFlow(comp1: any, comp2: any): string {
    // Simple heuristics based on component types
    if (comp1.type === "interface" && comp2.type === "service") return "OUT";
    if (comp1.type === "service" && comp2.type === "interface") return "IN";
    if (comp1.type === "service" && comp2.type === "storage") return "OUT";
    if (comp1.type === "storage" && comp2.type === "service") return "IN";
    return "BOTH"; // Default to bidirectional
  }

  /**
   * Helper: Add standard architectural seams based on component types
   */
  private addStandardArchitectureSeams(components: any[]): any[] {
    const standardSeams: any[] = [];

    const interfaces = components.filter((c) => c.type === "interface");
    const services = components.filter((c) => c.type === "service");
    const storage = components.filter((c) => c.type === "storage");

    // Standard UI -> Service seams
    if (interfaces.length > 0 && services.length > 0) {
      standardSeams.push({
        name: "UIServiceLayer",
        participants: [interfaces[0].name, services[0].name],
        dataFlow: "BOTH",
        purpose: "Standard UI to service layer communication",
        source: interfaces[0].name,
        target: services[0].name,
        interactionType: "architectural",
        confidence: 0.9,
      });
    }

    // Standard Service -> Storage seams
    if (services.length > 0 && storage.length > 0) {
      standardSeams.push({
        name: "ServiceDataLayer",
        participants: [services[0].name, storage[0].name],
        dataFlow: "BOTH",
        purpose: "Standard service to data layer communication",
        source: services[0].name,
        target: storage[0].name,
        interactionType: "architectural",
        confidence: 0.9,
      });
    }

    return standardSeams;
  }
  /**
   * Blueprint: Analyze data flows and transformations
   * Returns: DataFlowMapping[] with input/output types and transformation requirements
   */
  private analyzeDataFlows(seams: any[]): any[] {
    const dataFlows: any[] = [];

    // Data type mappings based on interaction types
    const dataTypeMap: Record<
      string,
      { input: string; output: string; transformation: string }
    > = {
      authentication: {
        input: "UserCredentials",
        output: "AuthToken",
        transformation: "credential_validation",
      },
      data_storage: {
        input: "EntityData",
        output: "StorageResult",
        transformation: "data_serialization",
      },
      data_access: {
        input: "QueryRequest",
        output: "QueryResult",
        transformation: "data_retrieval",
      },
      user_interface: {
        input: "UserInput",
        output: "UIResponse",
        transformation: "interface_rendering",
      },
      management: {
        input: "AdminCommand",
        output: "SystemState",
        transformation: "administrative_action",
      },
      service_call: {
        input: "ServiceRequest",
        output: "ServiceResponse",
        transformation: "business_logic",
      },
      collaboration: {
        input: "CollaborationData",
        output: "CollaborationResult",
        transformation: "data_coordination",
      },
    };

    // Analyze each seam for data flow characteristics
    for (const seam of seams) {
      const interactionType = seam.interactionType || "collaboration";
      const dataTypes =
        dataTypeMap[interactionType] || dataTypeMap["collaboration"];

      // Determine data flow complexity
      const complexity = this.calculateDataFlowComplexity(seam);

      // Identify potential bottlenecks
      const bottlenecks = this.identifyBottlenecks(seam);

      // Calculate throughput requirements
      const throughput = this.estimateThroughput(seam);

      const dataFlow = {
        seamName: seam.name,
        source: seam.source,
        target: seam.target,
        inputType: dataTypes.input,
        outputType: dataTypes.output,
        transformation: dataTypes.transformation,
        dataFlowDirection: seam.dataFlow,
        complexity: complexity,
        estimatedThroughput: throughput,
        potentialBottlenecks: bottlenecks,
        transformationSteps: this.generateTransformationSteps(
          dataTypes.transformation
        ),
        errorHandling: this.suggestErrorHandling(seam),
        performance: {
          latencyRequirement: this.estimateLatency(seam),
          scalabilityNeeds: this.assessScalability(seam),
          cachingOpportunities: this.identifyCachingOpportunities(seam),
        },
      };

      dataFlows.push(dataFlow);
    }

    // Add aggregate analysis
    dataFlows.push({
      seamName: "SYSTEM_AGGREGATE",
      source: "SYSTEM",
      target: "SYSTEM",
      inputType: "SystemInput",
      outputType: "SystemOutput",
      transformation: "end_to_end_processing",
      dataFlowDirection: "BOTH",
      complexity: this.calculateOverallComplexity(dataFlows),
      estimatedThroughput: this.calculateTotalThroughput(dataFlows),
      potentialBottlenecks: this.identifySystemBottlenecks(dataFlows),
      transformationSteps: [
        "input_validation",
        "business_processing",
        "output_formatting",
      ],
      errorHandling: "comprehensive_error_management",
      performance: {
        latencyRequirement: "sub_second_response",
        scalabilityNeeds: "horizontal_scaling",
        cachingOpportunities: [
          "static_data",
          "computed_results",
          "session_data",
        ],
      },
    });

    return dataFlows;
  }

  /**
   * Helper: Calculate data flow complexity based on seam characteristics
   */
  private calculateDataFlowComplexity(seam: any): string {
    let complexityScore = 0;

    // Factor in data flow direction
    if (seam.dataFlow === "BOTH") complexityScore += 2;
    else complexityScore += 1;

    // Factor in interaction type
    const complexInteractions = [
      "authentication",
      "data_storage",
      "management",
    ];
    if (complexInteractions.includes(seam.interactionType))
      complexityScore += 2;
    else complexityScore += 1;

    // Factor in participants
    if (seam.participants.length > 2) complexityScore += 1;

    if (complexityScore <= 2) return "low";
    if (complexityScore <= 4) return "medium";
    return "high";
  }

  /**
   * Helper: Identify potential bottlenecks in data flow
   */
  private identifyBottlenecks(seam: any): string[] {
    const bottlenecks: string[] = [];

    // Database operations are often bottlenecks
    if (
      seam.participants.some((p: string) =>
        p.toLowerCase().includes("database")
      )
    ) {
      bottlenecks.push("database_io");
    }

    // Authentication operations can be bottlenecks
    if (seam.interactionType === "authentication") {
      bottlenecks.push("auth_validation");
    }

    // UI operations can be bottlenecks
    if (
      seam.participants.some((p: string) =>
        ["user", "dashboard"].includes(p.toLowerCase())
      )
    ) {
      bottlenecks.push("user_interface_rendering");
    }

    // Bidirectional flows are complex
    if (seam.dataFlow === "BOTH") {
      bottlenecks.push("bidirectional_synchronization");
    }

    return bottlenecks.length > 0 ? bottlenecks : ["none_identified"];
  }

  /**
   * Helper: Estimate throughput requirements
   */
  private estimateThroughput(seam: any): string {
    if (
      seam.participants.some((p: string) => p.toLowerCase().includes("user"))
    ) {
      return "medium"; // User interactions are typically medium throughput
    }
    if (seam.interactionType === "data_storage") {
      return "high"; // Data operations need high throughput
    }
    if (seam.interactionType === "authentication") {
      return "low"; // Auth is typically infrequent but critical
    }
    return "medium";
  }

  /**
   * Helper: Generate transformation steps for data flow
   */
  private generateTransformationSteps(transformation: string): string[] {
    const stepMap: Record<string, string[]> = {
      credential_validation: [
        "input_sanitization",
        "credential_lookup",
        "hash_verification",
        "token_generation",
      ],
      data_serialization: [
        "validation",
        "normalization",
        "serialization",
        "storage",
      ],
      data_retrieval: [
        "query_parsing",
        "data_access",
        "result_formatting",
        "response_packaging",
      ],
      interface_rendering: [
        "data_binding",
        "template_processing",
        "rendering",
        "client_delivery",
      ],
      administrative_action: [
        "permission_check",
        "action_validation",
        "execution",
        "audit_logging",
      ],
      business_logic: [
        "input_validation",
        "business_processing",
        "result_computation",
        "output_formatting",
      ],
      data_coordination: [
        "data_synchronization",
        "conflict_resolution",
        "consistency_check",
        "propagation",
      ],
    };

    return (
      stepMap[transformation] || [
        "input_processing",
        "transformation",
        "output_generation",
      ]
    );
  }

  /**
   * Helper: Suggest error handling approach
   */
  private suggestErrorHandling(seam: any): string {
    if (seam.interactionType === "authentication")
      return "fail_secure_with_retry";
    if (seam.interactionType === "data_storage")
      return "transactional_rollback";
    if (seam.participants.some((p: string) => p.toLowerCase().includes("user")))
      return "graceful_degradation";
    return "standard_error_propagation";
  }

  /**
   * Helper methods for performance analysis
   */
  private estimateLatency(seam: any): string {
    if (
      seam.participants.some((p: string) =>
        p.toLowerCase().includes("database")
      )
    )
      return "high";
    if (seam.interactionType === "user_interface") return "low";
    return "medium";
  }

  private assessScalability(seam: any): string {
    if (seam.interactionType === "data_storage")
      return "horizontal_scaling_required";
    if (seam.participants.some((p: string) => p.toLowerCase().includes("user")))
      return "load_balancing_recommended";
    return "standard_scaling";
  }

  private identifyCachingOpportunities(seam: any): string[] {
    const opportunities: string[] = [];
    if (seam.interactionType === "data_access")
      opportunities.push("query_result_caching");
    if (seam.interactionType === "authentication")
      opportunities.push("token_caching");
    if (seam.interactionType === "user_interface")
      opportunities.push("static_content_caching");
    return opportunities.length > 0 ? opportunities : ["minimal_caching"];
  }

  private calculateOverallComplexity(dataFlows: any[]): string {
    const complexities = dataFlows.map((df) => df.complexity);
    const highCount = complexities.filter((c) => c === "high").length;
    const mediumCount = complexities.filter((c) => c === "medium").length;

    if (highCount > dataFlows.length * 0.3) return "high";
    if (mediumCount > dataFlows.length * 0.5) return "medium";
    return "low";
  }

  private calculateTotalThroughput(dataFlows: any[]): string {
    const throughputs = dataFlows.map((df) => df.estimatedThroughput);
    if (throughputs.some((t) => t === "high")) return "high";
    if (
      throughputs.filter((t) => t === "medium").length >
      throughputs.length * 0.5
    )
      return "medium";
    return "low";
  }

  private identifySystemBottlenecks(dataFlows: any[]): string[] {
    const allBottlenecks = dataFlows.flatMap((df) => df.potentialBottlenecks);
    const uniqueBottlenecks = [...new Set(allBottlenecks)];
    return uniqueBottlenecks.filter((b) => b !== "none_identified");
  }
  /**
   * Blueprint: Generate implementation order based on dependencies
   * Returns: string[] of component names in implementation order
   */
  private generateImplementationOrder(components: any[]): string[] {
    const implementationOrder: string[] = [];
    const processed = new Set<string>();

    // Implementation priority based on component types and dependencies
    const priorityOrder = [
      "storage", // Databases and storage systems first
      "service", // Core services next
      "component", // General components
      "interface", // User interfaces last
    ];

    // Sort components by type priority
    const componentsByType = new Map<string, any[]>();
    for (const component of components) {
      const type = component.type;
      if (!componentsByType.has(type)) {
        componentsByType.set(type, []);
      }
      componentsByType.get(type)!.push(component);
    }

    // Add components in dependency order
    for (const type of priorityOrder) {
      const componentsOfType = componentsByType.get(type) || [];

      // Sort within type by implementation complexity and dependencies
      const sortedComponents =
        this.sortComponentsByDependency(componentsOfType);

      for (const component of sortedComponents) {
        if (!processed.has(component.name)) {
          implementationOrder.push(component.name);
          processed.add(component.name);
        }
      }
    }

    // Add any remaining components not caught by type-based sorting
    for (const component of components) {
      if (!processed.has(component.name)) {
        implementationOrder.push(component.name);
        processed.add(component.name);
      }
    }

    // Add implementation phases with reasoning
    const phasedOrder = this.organizeIntoImplementationPhases(
      implementationOrder,
      components
    );

    return phasedOrder;
  }

  /**
   * Helper: Sort components within a type by dependency complexity
   */
  private sortComponentsByDependency(components: any[]): any[] {
    return components.sort((a, b) => {
      // Prioritize by name-based dependency hints
      const aScore = this.calculateDependencyScore(a);
      const bScore = this.calculateDependencyScore(b);
      return aScore - bScore; // Lower scores = implement first
    });
  }

  /**
   * Helper: Calculate dependency score (lower = implement first)
   */
  private calculateDependencyScore(component: any): number {
    let score = 0;
    const name = component.name.toLowerCase();

    // Core infrastructure components get lowest scores (implement first)
    if (name.includes("database")) score = 1;
    else if (name.includes("auth")) score = 2;
    else if (name.includes("api")) score = 3;
    else if (name.includes("service")) score = 4;
    else if (name.includes("manager")) score = 5;
    else if (name.includes("system")) score = 6;
    else if (name.includes("dashboard")) score = 8;
    else if (name.includes("user")) score = 9; // User interfaces last
    else if (name.includes("admin")) score = 10; // Admin interfaces very last
    else score = 7; // Default middle score

    return score;
  }

  /**
   * Helper: Organize components into implementation phases
   */
  private organizeIntoImplementationPhases(
    order: string[],
    components: any[]
  ): string[] {
    const phasedOrder: string[] = [];

    // Phase 1: Foundation (Storage and Core Services)
    phasedOrder.push("=== PHASE 1: FOUNDATION ===");
    const foundationComponents = order.filter((name) => {
      const comp = components.find((c) => c.name === name);
      return (
        comp &&
        (comp.type === "storage" ||
          (comp.type === "service" &&
            comp.name.toLowerCase().includes("database")))
      );
    });
    phasedOrder.push(...foundationComponents);

    // Phase 2: Core Services (Authentication, APIs)
    phasedOrder.push("=== PHASE 2: CORE SERVICES ===");
    const coreServices = order.filter((name) => {
      const comp = components.find((c) => c.name === name);
      return (
        comp &&
        comp.type === "service" &&
        !comp.name.toLowerCase().includes("database")
      );
    });
    phasedOrder.push(...coreServices);

    // Phase 3: Business Logic (Components and Managers)
    phasedOrder.push("=== PHASE 3: BUSINESS LOGIC ===");
    const businessComponents = order.filter((name) => {
      const comp = components.find((c) => c.name === name);
      return comp && comp.type === "component";
    });
    phasedOrder.push(...businessComponents);

    // Phase 4: User Interfaces
    phasedOrder.push("=== PHASE 4: USER INTERFACES ===");
    const interfaces = order.filter((name) => {
      const comp = components.find((c) => c.name === name);
      return comp && comp.type === "interface";
    });
    phasedOrder.push(...interfaces);

    return phasedOrder;
  }

  /**
   * Blueprint: Create implementation recommendations   * Returns: string[] of architectural and implementation suggestions
   */
  private createRecommendations(components: any[], seams: any[]): string[] {
    const recommendations: string[] = [];

    // Analyze system characteristics
    const hasAuth = components.some((c) =>
      c.name.toLowerCase().includes("auth")
    );
    const hasDatabase = components.some((c) => c.type === "storage");
    const hasAPI = components.some((c) => c.name.toLowerCase().includes("api"));
    const hasUserInterface = components.some((c) => c.type === "interface");
    const complexSeams = seams.filter((s) => s.dataFlow === "BOTH").length;
    const totalSeams = seams.length;

    // === ARCHITECTURAL PATTERN RECOMMENDATIONS ===
    recommendations.push("=== ARCHITECTURAL PATTERNS ===");

    if (hasAuth && hasDatabase && hasAPI) {
      recommendations.push(
        "🏗️ Implement 3-Layer Architecture: Presentation → Business → Data"
      );
      recommendations.push(
        "🔐 Use JWT tokens for stateless authentication across services"
      );
    }

    if (totalSeams > 20) {
      recommendations.push(
        "🎯 Consider Microservices Architecture for complex system"
      );
      recommendations.push("📡 Implement API Gateway for service coordination");
    } else {
      recommendations.push(
        "🏢 Monolithic Architecture suitable for current complexity"
      );
    }

    if (complexSeams > 5) {
      recommendations.push(
        "🔄 Implement Event-Driven Architecture for bidirectional flows"
      );
      recommendations.push("📬 Use Message Queues for async communication");
    }

    // === SECURITY RECOMMENDATIONS ===
    recommendations.push("=== SECURITY ===");

    if (hasAuth) {
      recommendations.push("🔒 Implement Role-Based Access Control (RBAC)");
      recommendations.push("🛡️ Use bcrypt for password hashing");
      recommendations.push("⏰ Implement session timeout and refresh tokens");
    }

    if (hasAPI) {
      recommendations.push("🚪 Implement API rate limiting");
      recommendations.push("🔍 Add input validation and sanitization");
      recommendations.push("📝 Use HTTPS/TLS for all API communications");
    }

    if (hasDatabase) {
      recommendations.push(
        "💉 Prevent SQL injection with parameterized queries"
      );
      recommendations.push("🔐 Encrypt sensitive data at rest");
    }

    // === PERFORMANCE RECOMMENDATIONS ===
    recommendations.push("=== PERFORMANCE ===");
    const dbSeams = seams.filter((s) =>
      s.participants.some((p: string) => p.toLowerCase().includes("database"))
    ).length;

    if (dbSeams > 10) {
      recommendations.push("⚡ Implement database connection pooling");
      recommendations.push("💾 Use Redis for session and query result caching");
      recommendations.push("📊 Consider database indexing strategy");
    }

    if (hasUserInterface) {
      recommendations.push("🎨 Implement lazy loading for UI components");
      recommendations.push("📱 Use responsive design for mobile compatibility");
    }

    // === SDD-SPECIFIC RECOMMENDATIONS ===
    recommendations.push("=== SDD IMPLEMENTATION ===");

    recommendations.push(
      "🔗 Implement all seams with ContractResult<T> pattern"
    );
    recommendations.push("🛡️ Use fail-fast validation at seam boundaries");
    recommendations.push(
      "📝 Add blueprint comments for implementation guidance"
    );
    recommendations.push(
      "🧪 Create seam connection tests before implementation"
    );

    if (totalSeams > 15) {
      recommendations.push(
        "🎯 Implement seams in phases to reduce integration complexity"
      );
    }

    // === TESTING STRATEGY ===
    recommendations.push("=== TESTING STRATEGY ===");

    recommendations.push("🧪 Unit test each component with 80%+ coverage");
    recommendations.push("🔗 Integration test all seam connections");
    recommendations.push("🎭 End-to-end test critical user workflows");

    if (hasAuth) {
      recommendations.push(
        "🔐 Security test authentication and authorization flows"
      );
    }

    // === DEPLOYMENT RECOMMENDATIONS ===
    recommendations.push("=== DEPLOYMENT ===");

    if (hasDatabase) {
      recommendations.push(
        "📦 Use Docker containers for consistent environments"
      );
      recommendations.push("🔄 Implement database migration strategy");
    }

    recommendations.push("🚀 Set up CI/CD pipeline with automated testing");
    recommendations.push("📊 Implement logging and monitoring");
    recommendations.push("⚠️ Plan rollback strategy for deployments");

    // === SCALABILITY RECOMMENDATIONS ===
    recommendations.push("=== SCALABILITY ===");

    if (totalSeams > 25) {
      recommendations.push("📈 Design for horizontal scaling from day one");
      recommendations.push(
        "🔀 Implement load balancing for high-traffic components"
      );
    }

    if (hasDatabase) {
      recommendations.push("🗄️ Plan for database sharding if growth expected");
      recommendations.push("📊 Monitor database performance metrics");
    }

    // === RISK MITIGATION ===
    recommendations.push("=== RISK MITIGATION ===");
    const highRiskSeams = seams.filter(
      (s) =>
        s.interactionType === "authentication" ||
        s.participants.some((p: string) => p.toLowerCase().includes("database"))
    ).length;

    if (highRiskSeams > 5) {
      recommendations.push(
        "⚠️ Critical seams identified - implement error handling first"
      );
      recommendations.push(
        "🔄 Plan for graceful degradation of non-critical features"
      );
    }

    recommendations.push("💾 Implement automated backups for data persistence");
    recommendations.push("🚨 Set up error alerting and monitoring");

    // === DEVELOPMENT WORKFLOW ===
    recommendations.push("=== DEVELOPMENT WORKFLOW ===");

    recommendations.push("📋 Implement component stubs before business logic");
    recommendations.push(
      "🔄 Use feature flags for incremental feature rollout"
    );
    recommendations.push("📖 Maintain architectural decision records (ADRs)");
    recommendations.push("🤝 Regular code reviews focusing on seam compliance");

    return recommendations;
  }
}
