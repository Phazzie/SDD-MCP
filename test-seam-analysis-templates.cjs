/**
 * Test script for Enhanced Seam Analysis Templates
 * Tests the three new seam analysis templates for proper compilation and content generation
 */

const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

// Register helpers for Handlebars
Handlebars.registerHelper('default', function(value, defaultValue) {
  return value != null ? value : defaultValue;
});

Handlebars.registerHelper('pascalCase', function(str) {
  return str.replace(/(?:^|\s|_|-)+(.)/g, (match, char) => char.toUpperCase());
});

Handlebars.registerHelper('camelCase', function(str) {
  const pascal = str.replace(/(?:^|\s|_|-)+(.)/g, (match, char) => char.toUpperCase());
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
});

// Enhanced test data for seam analysis templates
const testData = {
  // Basic project info
  timestamp: new Date().toISOString(),
  projectName: "SDD-Example-Project",
  sddVersion: "2.0.0",
  analysisScope: "Full System Analysis",
  validationScope: "Pre-Contract Generation",

  // Components for seam analysis matrix
  components: [
    {
      name: "AuthController",
      type: "Controller",
      purpose: "Handle user authentication requests",
      dependencies: ["AuthService", "ValidationEngine"],
      consumers: ["WebAPI", "MobileAPI"]
    },
    {
      name: "AuthService", 
      type: "Service",
      purpose: "Process authentication logic and session management",
      dependencies: ["DatabaseConnector", "TokenManager"],
      consumers: ["AuthController"]
    },
    {
      name: "ValidationEngine",
      type: "Utility",
      purpose: "Validate input data and enforce business rules",
      dependencies: [],
      consumers: ["AuthController", "DataProcessor"]
    }
  ],

  // Seam connections for matrix analysis
  seamConnections: [
    {
      source: "AuthController",
      target: "AuthService", 
      seamType: "Authentication",
      dataFlow: "LoginRequest → AuthResult",
      status: "Active",
      riskLevel: "Medium"
    },
    {
      source: "AuthController",
      target: "ValidationEngine",
      seamType: "Validation",
      dataFlow: "UserInput → ValidatedData",
      status: "Active", 
      riskLevel: "Low"
    },
    {
      source: "AuthService",
      target: "DatabaseConnector",
      seamType: "DataAccess",
      dataFlow: "UserQuery → UserRecord",
      status: "Pending",
      riskLevel: "High"
    }
  ],

  // Summary metrics
  activeConnections: 2,
  pendingConnections: 1,
  highRiskConnections: 1,

  // Data flows for analysis
  dataFlows: [
    {
      name: "UserAuthentication",
      steps: [
        {
          component: "AuthController",
          operation: "validateCredentials",
          inputType: "LoginRequest",
          outputType: "ValidationResult",
          transformation: "Schema validation + sanitization"
        },
        {
          component: "AuthService", 
          operation: "authenticateUser",
          inputType: "ValidationResult",
          outputType: "AuthSession",
          transformation: "Credential verification + session creation"
        }
      ],
      complexity: 6,
      performanceImpact: "Medium",
      errorHandling: "Fail-fast with retry",
      validationPoints: 3
    }
  ],

  // Transformation chains for data flow analysis
  transformationChains: [
    {
      name: "UserRegistration",
      priority: "HIGH",
      complexity: 8,
      performanceImpact: "HIGH",
      seamName: "UserRegistrationSeam",
      timeout: 5000,
      retryCount: 3,
      validateInput: true,
      steps: [
        {
          source: "RegistrationController",
          target: "ValidationEngine",
          operation: "validateRegistration", 
          inputType: "RegistrationRequest",
          outputType: "ValidatedRegistration",
          transformation: "Schema validation + uniqueness check",
          expectedLatency: 100,
          validation: "Email format, password strength",
          errorHandling: "Fail-fast on validation errors"
        },
        {
          source: "ValidationEngine",
          target: "UserService",
          operation: "createUser",
          inputType: "ValidatedRegistration",
          outputType: "UserAccount", 
          transformation: "Password hashing + account creation",
          expectedLatency: 300
        }
      ],
      contractMethods: [
        { name: "validateRegistration", inputType: "RegistrationRequest", outputType: "ValidatedRegistration" },
        { name: "createUserAccount", inputType: "ValidatedRegistration", outputType: "UserAccount" }
      ],
      dataStructure: [
        { field: "email", type: "string", description: "User email address" },
        { field: "hashedPassword", type: "string", description: "Securely hashed password" },
        { field: "userId", type: "string", description: "Unique user identifier" }
      ],
      expectedThroughput: "50",
      memoryUsage: "2MB per operation",
      cpuImpact: "Medium",
      ioRequirements: "Database write + email validation",
      risks: [
        { type: "Performance", description: "High latency during email validation", severity: "Medium", mitigation: "Implement async email validation" },
        { type: "Security", description: "Password exposure in logs", severity: "High", mitigation: "Sanitize logs and use secure hashing" }
      ]
    }
  ],

  // Critical seams for matrix analysis
  criticalSeams: [
    {
      name: "PaymentProcessing",
      priority: "CRITICAL",
      pattern: "Request-Response with Callback",
      components: "PaymentController → PaymentGateway → BankAPI",
      dataDependencies: "CreditCard, Amount, Currency",
      complexity: 9,
      failureImpact: "Revenue Loss",
      integrationDifficulty: "High",
      recommendations: [
        "Implement circuit breaker pattern",
        "Add comprehensive retry logic",
        "Monitor transaction success rates",
        "Implement payment reconciliation"
      ],
      methods: [
        { name: "processPayment", params: "paymentData: PaymentRequest", returnType: "PaymentResult" },
        { name: "validatePayment", params: "payment: PaymentDetails", returnType: "ValidationResult" }
      ]
    }
  ],

  // Seam definitions for validation checklist
  seamDefinitions: [
    {
      name: "UserAuthenticationSeam",
      hasName: true,
      description: "Handles user login and session management",
      hasDescription: true,
      sourceComponent: "AuthController",
      hasSourceComponent: true,
      targetComponent: "AuthService", 
      hasTargetComponent: true,
      communicationPattern: "request-response",
      hasCommunicationPattern: true,
      inputType: "LoginRequest",
      hasInputType: true,
      outputType: "AuthSession",
      hasOutputType: true,
      dataValidation: "Email format validation, password strength check",
      hasDataValidation: true,
      transformation: "Credential verification + session token generation",
      hasTransformation: true,
      errorScenarios: [
        { type: "invalid_credentials", handling: "fail-fast with error message" },
        { type: "service_unavailable", handling: "retry with exponential backoff" }
      ],
      hasErrorScenarios: true,
      hasFailFastPattern: true,
      errorRecovery: "Exponential backoff retry for service errors",
      hasErrorRecovery: true,
      timeoutHandling: "5 second timeout with fallback",
      hasTimeoutHandling: true,
      latencyRequirement: "< 500ms",
      hasLatencyRequirement: true,
      throughputRequirement: "100 requests/sec",
      hasThroughputRequirement: true,
      resourceRequirements: "2MB memory, 10% CPU",
      hasResourceRequirements: true,
      scalabilityPlan: "Horizontal scaling with load balancer",
      hasScalabilityPlan: true,
      hasContractInterface: true,
      hasContractResult: true,
      hasSeamManagerIntegration: true,
      hasStubImplementation: true,
      validationScore: 18,
      criticalIssues: [
        { 
          category: "Security", 
          issue: "Password logging in debug mode", 
          impact: "High - credential exposure risk",
          resolution: "Implement password sanitization in logs",
          priority: "HIGH"
        }
      ],
      warnings: [
        {
          category: "Performance",
          warning: "Session cleanup not implemented",
          recommendation: "Add session expiration and cleanup job"
        }
      ]
    }
  ]
};

// Templates to test
const templates = [
  {
    name: 'seam-analysis-matrix',
    file: 'seam-analysis-matrix.handlebars',
    description: 'Component interaction matrix generation'
  },
  {
    name: 'data-flow-analysis', 
    file: 'data-flow-analysis.handlebars',
    description: 'Data transformation chain mapping'
  },
  {
    name: 'seam-validation-checklist',
    file: 'seam-validation-checklist.handlebars', 
    description: 'Pre-contract validation checklist'
  }
];

console.log('🧪 Testing Enhanced Seam Analysis Templates\n');

// Test each template
templates.forEach(template => {
  try {
    console.log(`Testing ${template.name}...`);
    
    const templatePath = path.join(__dirname, 'templates', template.file);
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    
    // Compile template
    const compiledTemplate = Handlebars.compile(templateContent);
    
    // Generate content
    const result = compiledTemplate(testData);
    
    console.log(`✅ ${template.name}: Generated ${result.length} characters`);
    console.log(`   Description: ${template.description}`);
    
    // Validate content has expected sections
    const expectedSections = [
      template.name === 'seam-analysis-matrix' ? 'Component Interaction Overview' : null,
      template.name === 'data-flow-analysis' ? 'Data Flow Overview' : null,
      template.name === 'seam-validation-checklist' ? 'Pre-Contract Validation Overview' : null
    ].filter(Boolean);
    
    expectedSections.forEach(section => {
      if (result.includes(section)) {
        console.log(`   ✓ Contains: ${section}`);
      } else {
        console.log(`   ❌ Missing: ${section}`);
      }
    });
    
    console.log('');
    
  } catch (error) {
    console.error(`❌ ${template.name} failed:`, error.message);
    console.log('');
  }
});

console.log('🎉 Enhanced Seam Analysis Template testing complete!');
console.log('\n📊 Template Summary:');
console.log('- seam-analysis-matrix.handlebars: Component interaction matrices');
console.log('- data-flow-analysis.handlebars: Data transformation chain analysis');  
console.log('- seam-validation-checklist.handlebars: Pre-contract validation');
console.log('\n💰 HIGH_ROI: These templates enable comprehensive seam analysis before implementation');
console.log('🎯 CRITICAL: Essential for SDD methodology - analyze seams before coding');
