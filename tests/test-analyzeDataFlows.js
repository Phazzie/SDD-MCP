import { DevUtilities } from "../dist/agents/dev-utilities.js";
import { EnhancedSeamAnalyzerStub } from "../dist/stubs.js";

async function runTests() {
  const analyzer = new EnhancedSeamAnalyzerStub("TestAgent");
  const devUtils = new DevUtilities("TestDevUtils");
  analyzer.devUtilities = devUtils; // Inject DevUtilities
  process.stdout.write("Starting analyzeDataFlows tests...\n");

  // Helper to combine requirements into a single string
  const combineRequirements = (reqObj) => {
    if (!reqObj || typeof reqObj !== "object") return "";
    return [
      ...(reqObj.userStories || []),
      ...(reqObj.functionalRequirements || []),
      ...(reqObj.nonFunctionalRequirements || []),
      ...(reqObj.dataRequirements || []),
    ].join("\n");
  };

  // Test Case 1: Simple Flow
  process.stdout.write("\n--- Test Case 1: Simple Flow ---\n");
  const requirements1Obj = {
    userStories: ["As a user, I want to send my profile data to the backend."],
    functionalRequirements: [
      "The system must allow users to submit their profile information.",
    ],
    nonFunctionalRequirements: ["The system must respond within 2 seconds."],
    dataRequirements: ["User profile includes name, email, and address."],
  };
  const components1 = [
    {
      id: "frontend",
      name: "Frontend",
      description: "Handles user interaction.",
      type: "UI",
    },
    {
      id: "backend",
      name: "Backend",
      description: "Processes data.",
      type: "Service",
    },
  ];
  const input1 = {
    requirements: combineRequirements(requirements1Obj),
    components: components1.map((c) => c.name),
  };
  let result1 = await analyzer.analyzeDataFlows(input1);
  process.stdout.write("Result 1: " + JSON.stringify(result1, null, 2) + "\n");
  if (
    result1.success &&
    result1.data &&
    result1.data.flows.length > 0 &&
    result1.data.flows[0].source === "Frontend" &&
    result1.data.flows[0].target === "Backend"
  ) {
    process.stdout.write("Test Case 1 PASSED\n");
  } else {
    process.stderr.write(
      "Test Case 1 FAILED: " +
        JSON.stringify(result1.error || "Assertion failed", null, 2) +
        "\n"
    );
  }

  // Test Case 2: Multiple Flows
  process.stdout.write("\n--- Test Case 2: Multiple Flows ---\n");
  const requirements2Obj = {
    userStories: [
      "As an admin, I want to fetch user data from the database.",
      "The system sends notifications to users upon profile update.",
    ],
    functionalRequirements: [
      "Admins can retrieve user details.",
      "Users receive email notifications.",
    ],
    dataRequirements: [
      "User data: id, name, email. Notification: message, timestamp.",
    ],
  };
  const components2 = [
    {
      id: "adminPanel",
      name: "Admin Panel",
      description: "For administrative tasks.",
      type: "UI",
    },
    {
      id: "apiService",
      name: "API Service",
      description: "Handles requests.",
      type: "Service",
    },
    {
      id: "database",
      name: "Database",
      description: "Stores data.",
      type: "Persistence",
    },
    {
      id: "notificationService",
      name: "Notification Service",
      description: "Sends notifications.",
      type: "Service",
    },
  ];
  const input2 = {
    requirements: combineRequirements(requirements2Obj),
    components: components2.map((c) => c.name),
  };
  let result2 = await analyzer.analyzeDataFlows(input2);
  process.stdout.write("Result 2: " + JSON.stringify(result2, null, 2) + "\n");
  if (result2.success && result2.data && result2.data.flows.length >= 2) {
    process.stdout.write("Test Case 2 PASSED\n");
  } else {
    process.stderr.write(
      "Test Case 2 FAILED: " +
        JSON.stringify(
          result2.error || "Assertion failed: Expected at least 2 flows.",
          null,
          2
        ) +
        "\n"
    );
  }

  // Test Case 3: Transformations
  process.stdout.write("\n--- Test Case 3: Transformations ---\n");
  const requirements3Obj = {
    userStories: [
      "The system transforms raw sensor data into a readable report.",
    ],
    functionalRequirements: [
      "Sensor data (JSON) is converted to a PDF report.",
    ],
    dataRequirements: [
      "Raw data: {temp: 25, unit: 'C'}. Report: Formatted PDF.",
    ],
  };
  const components3 = [
    {
      id: "sensorInput",
      name: "Sensor Input",
      description: "Receives raw data.",
      type: "Service",
    },
    {
      id: "reportGenerator",
      name: "Report Generator",
      description: "Transforms data and creates PDF.",
      type: "Service",
    },
    {
      id: "storage",
      name: "Storage",
      description: "Stores generated reports.",
      type: "Persistence",
    },
  ];
  const input3 = {
    requirements: combineRequirements(requirements3Obj),
    components: components3.map((c) => c.name),
  };
  let result3 = await analyzer.analyzeDataFlows(input3);
  process.stdout.write("Result 3: " + JSON.stringify(result3, null, 2) + "\n");
  if (
    result3.success &&
    result3.data &&
    result3.data.transformations &&
    result3.data.transformations.length > 0 &&
    (result3.data.transformations[0].name.toLowerCase().includes("transform") ||
      result3.data.transformations[0].name.toLowerCase().includes("convert"))
  ) {
    process.stdout.write("Test Case 3 PASSED\n");
  } else {
    process.stderr.write(
      "Test Case 3 FAILED: " +
        JSON.stringify(
          result3.error ||
            "Assertion failed: Expected at least one transformation matching criteria.",
          null,
          2
        ) +
        "\n"
    );
  }

  // Test Case 4: Bottlenecks & Consistency (Heuristic)
  process.stdout.write("\n--- Test Case 4: Bottlenecks & Consistency ---\n");
  const requirements4Obj = {
    userStories: [
      "Component A sends data to B.",
      "Component B processes and sends to C.",
      "Component C sends to D.",
      "Component D sends to E.",
      "Component E sends to F.",
      "Component F sends to G.",
      "Component G sends to H.",
      "Component H sends to A (loop).",
    ],
    functionalRequirements: ["Multiple components exchanging data frequently."],
    dataRequirements: [
      "DataTypeX, DataTypeY, DataTypeZ, InconsistentTypeA, InconsistentTypeB",
    ],
  };
  const components4 = [
    {
      id: "compA",
      name: "Component A",
      description: "Source",
      type: "Service",
    },
    {
      id: "compB",
      name: "Component B",
      description: "Processor",
      type: "Service",
    },
    {
      id: "compC",
      name: "Component C",
      description: "Processor",
      type: "Service",
    },
    {
      id: "compD",
      name: "Component D",
      description: "Processor",
      type: "Service",
    },
    {
      id: "compE",
      name: "Component E",
      description: "Processor",
      type: "Service",
    },
    {
      id: "compF",
      name: "Component F",
      description: "Processor",
      type: "Service",
    },
    {
      id: "compG",
      name: "Component G",
      description: "Processor",
      type: "Service",
    },
    {
      id: "compH",
      name: "Component H",
      description: "Sink/Source",
      type: "Service",
    },
  ];
  const input4 = {
    requirements: combineRequirements(requirements4Obj),
    components: components4.map((c) => c.name),
  };
  let result4 = await analyzer.analyzeDataFlows(input4);
  process.stdout.write("Result 4: " + JSON.stringify(result4, null, 2) + "\n");
  if (
    result4.success &&
    result4.data &&
    Array.isArray(result4.data.potentialBottlenecks) &&
    typeof result4.data.dataConsistencyScore === "number"
  ) {
    process.stdout.write("Test Case 4 PASSED (heuristic check)\n");
  } else {
    process.stderr.write(
      "Test Case 4 FAILED: " +
        JSON.stringify(
          result4.error ||
            "Assertion failed: Bottlenecks or consistency score missing/invalid.",
          null,
          2
        ) +
        "\n"
    );
  }

  // Test Case 5: Empty/Invalid Input
  process.stdout.write("\n--- Test Case 5: Empty/Invalid Input ---\n");

  // 5a: Empty requirements string, empty components array
  let result5a = await analyzer.analyzeDataFlows({
    requirements: "",
    components: [],
  });
  process.stdout.write(
    "Result 5a (empty reqs, empty components): " +
      JSON.stringify(result5a, null, 2) +
      "\n"
  );
  if (
    !result5a.success &&
    result5a.error &&
    result5a.error.category === "ValidationError" &&
    result5a.error.message.includes("Requirements text is required")
  ) {
    process.stdout.write(
      "Test Case 5a PASSED (Empty requirements string correctly handled)\n"
    );
  } else {
    process.stderr.write(
      "Test Case 5a FAILED: " +
        JSON.stringify(
          result5a.error ||
            "Expected validation error for empty requirements string.",
          null,
          2
        ) +
        "\n"
    );
  }

  // 5b: Null requirements
  let result5b = await analyzer.analyzeDataFlows({
    requirements: null,
    components: ["TestComp"],
  });
  process.stdout.write(
    "Result 5b (null requirements): " + JSON.stringify(result5b, null, 2) + "\n"
  );
  if (
    !result5b.success &&
    result5b.error &&
    result5b.error.category === "ValidationError" &&
    result5b.error.message.includes("Requirements text must be a string")
  ) {
    process.stdout.write(
      "Test Case 5b PASSED (Null requirements correctly handled)\n"
    );
  } else {
    process.stderr.write(
      "Test Case 5b FAILED: " +
        JSON.stringify(
          result5b.error || "Expected validation error for null requirements.",
          null,
          2
        ) +
        "\n"
    );
  }

  // 5c: Null components
  let result5c = await analyzer.analyzeDataFlows({
    requirements: "Valid requirements text",
    components: null,
  });
  process.stdout.write(
    "Result 5c (null components): " + JSON.stringify(result5c, null, 2) + "\n"
  );
  if (
    !result5c.success &&
    result5c.error &&
    result5c.error.category === "ValidationError" &&
    result5c.error.message.includes("Components list must be an array")
  ) {
    process.stdout.write(
      "Test Case 5c PASSED (Null components correctly handled)\n"
    );
  } else {
    process.stderr.write(
      "Test Case 5c FAILED: " +
        JSON.stringify(
          result5c.error || "Expected validation error for null components.",
          null,
          2
        ) +
        "\n"
    );
  }

  // 5d: Components array with non-string elements
  let result5d = await analyzer.analyzeDataFlows({
    requirements: "Valid requirements text",
    components: ["CompA", { id: "CompB" }],
  });
  process.stdout.write(
    "Result 5d (invalid component in list): " +
      JSON.stringify(result5d, null, 2) +
      "\n"
  );
  if (
    !result5d.success &&
    result5d.error &&
    result5d.error.category === "ValidationError" &&
    result5d.error.message.includes(
      "Each component in the list must be a string"
    )
  ) {
    process.stdout.write(
      "Test Case 5d PASSED (Invalid component in list correctly handled)\n"
    );
  } else {
    process.stderr.write(
      "Test Case 5d FAILED: " +
        JSON.stringify(
          result5d.error ||
            "Expected validation error for non-string component.",
          null,
          2
        ) +
        "\n"
    );
  }

  // 5e: Input object is null
  let result5e = await analyzer.analyzeDataFlows(null);
  process.stdout.write(
    "Result 5e (null input object): " + JSON.stringify(result5e, null, 2) + "\n"
  );
  if (
    !result5e.success &&
    result5e.error &&
    result5e.error.category === "ValidationError" &&
    result5e.error.message.includes("Input object is required")
  ) {
    process.stdout.write(
      "Test Case 5e PASSED (Null input object correctly handled)\n"
    );
  } else {
    process.stderr.write(
      "Test Case 5e FAILED: " +
        JSON.stringify(
          result5e.error || "Expected validation error for null input object.",
          null,
          2
        ) +
        "\n"
    );
  }

  process.stdout.write("\nanalyzeDataFlows tests completed.\n");
}

runTests().catch((err) => {
  process.stderr.write("Error running tests: " + (err.stack || err) + "\n");
});
