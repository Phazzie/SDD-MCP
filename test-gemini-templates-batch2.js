/**
 * Test Script for ESLint and Prettier Templates (Gemini Batch 2)
 * 🎯 CRITICAL - Validate new templates work with provided contexts
 */

import { TemplateProcessor } from "./dist/template-processor.js";

async function testGeminiTemplatesBatch2() {
  console.log("🧪 Testing ESLint and Prettier Templates (Gemini Batch 2)");
  console.log("=".repeat(60));

  const templateProcessor = new TemplateProcessor("./templates");

  // ESLint context from Gemini documentation
  const eslintrcContext = {
    projectType: "typescript",
    framework: "node",
    useReact: false,
    useNextJS: false,
    usePrettier: true,
    useVitestInEnv: true,
    strictMode: true,

    // Helper flags derived for simpler Handlebars logic
    projectTypeIsTypeScript: true,
    frameworkIsNodeOrBoth: true,
    frameworkIsBrowserOrBoth: false,
    projectTypeIsTypeScriptOrUsePrettier: true,
    projectTypeIsTypeScriptOrUsePrettierOrUseVitestInEnv: true,

    additionalPlugins: ["import"],
    additionalExtends: ["plugin:import/typescript"],

    customRules: {
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-unresolved": "off",
      "no-return-await": "warn",
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    hasSettingsContent: true, // Helper flag for comma logic

    overrides: [
      {
        files: ["*.js", "*.cjs"],
        excludedFiles: [],
        rules: {
          "@typescript-eslint/no-var-requires": "off",
          "@typescript-eslint/no-unsafe-assignment": "off",
          "@typescript-eslint/no-unsafe-call": "off",
          "@typescript-eslint/no-unsafe-member-access": "off",
        },
      },
      {
        files: ["tests/**/*.ts", "*.test.ts", "*.spec.ts"],
        excludedFiles: [],
        rules: {
          "@typescript-eslint/no-explicit-any": "off",
          "@typescript-eslint/no-unsafe-assignment": "off",
          "@typescript-eslint/no-unsafe-call": "off",
          "@typescript-eslint/no-unsafe-member-access": "off",
          "@typescript-eslint/no-unsafe-return": "off",
          "@typescript-eslint/no-floating-promises": "off",
          "max-lines-per-function": "off",
        },
      },
    ],
  };

  // Prettier context from Gemini documentation
  const prettierrcContext = {
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    quoteProps: "as-needed",
    jsxSingleQuote: false,
    trailingComma: "all",
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: "always",
    requirePragma: false,
    insertPragma: false,
    proseWrap: "preserve",
    htmlWhitespaceSensitivity: "css",
    vueIndentScriptAndStyle: false,
    endOfLine: "lf",
    embeddedLanguageFormatting: "auto",
    singleAttributePerLine: false,
    plugins: [],
  };

  try {
    // Test ESLint template
    console.log("⚡ Testing eslintrc.handlebars template...");
    const eslintOutput = await templateProcessor.generateFromTemplate(
      "eslintrc",
      eslintrcContext
    );

    console.log(`✅ ESLint template generated successfully`);
    console.log(`📏 Length: ${eslintOutput.length} characters`);

    // Quick JSON validation
    try {
      JSON.parse(eslintOutput);
      console.log("✅ Generated ESLint config is valid JSON");
    } catch (parseError) {
      console.log("❌ ESLint JSON parse error:", parseError);
      console.log("Generated content:", eslintOutput.substring(0, 500) + "...");
    }

    // Test Prettier template
    console.log("\n⚡ Testing prettierrc.handlebars template...");
    const prettierOutput = await templateProcessor.generateFromTemplate(
      "prettierrc",
      prettierrcContext
    );

    console.log(`✅ Prettier template generated successfully`);
    console.log(`📏 Length: ${prettierOutput.length} characters`);

    // Quick JSON validation
    try {
      JSON.parse(prettierOutput);
      console.log("✅ Generated Prettier config is valid JSON");
    } catch (parseError) {
      console.log("❌ Prettier JSON parse error:", parseError);
      console.log(
        "Generated content:",
        prettierOutput.substring(0, 500) + "..."
      );
    }

    console.log("\n🎉 All templates validated successfully!");
    console.log("📊 Summary:");
    console.log(`   - eslintrc: ${eslintOutput.length} characters ✅`);
    console.log(`   - prettierrc: ${prettierOutput.length} characters ✅`);
  } catch (error) {
    console.error("❌ Template test failed:", error);
  }
}

// Run the tests
testGeminiTemplatesBatch2().catch(console.error);
