/**
 * Debug ESLint and Prettier Templates - Full Output Analysis
 */

import fs from "fs/promises";
import { TemplateProcessor } from "./dist/template-processor.js";

async function debugTemplates() {
  console.log("🔍 Debugging ESLint and Prettier Templates");
  console.log("=".repeat(50));

  const templateProcessor = new TemplateProcessor("./templates");

  // Simple ESLint context to debug comma issues
  const eslintrcContext = {
    projectTypeIsTypeScript: true,
    frameworkIsNodeOrBoth: true,
    frameworkIsBrowserOrBoth: false,
    usePrettier: true,
    useVitestInEnv: true,
    strictMode: true,
    useReact: false,
    useNextJS: false,
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
        },
      ],
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    hasSettingsContent: true,
    overrides: [],
  };

  // Simple Prettier context
  const prettierrcContext = {
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    plugins: [],
  };

  try {
    console.log("🔍 ESLint Template Debug:");
    const eslintOutput = await templateProcessor.generateFromTemplate(
      "eslintrc",
      eslintrcContext
    );
    await fs.writeFile("debug-eslint-output.json", eslintOutput);
    console.log("✅ ESLint output saved to debug-eslint-output.json");
    console.log("📏 Length:", eslintOutput.length);

    console.log("\n🔍 Prettier Template Debug:");
    const prettierOutput = await templateProcessor.generateFromTemplate(
      "prettierrc",
      prettierrcContext
    );
    await fs.writeFile("debug-prettier-output.json", prettierOutput);
    console.log("✅ Prettier output saved to debug-prettier-output.json");
    console.log("📏 Length:", prettierOutput.length);
  } catch (error) {
    console.error("❌ Debug failed:", error);
  }
}

debugTemplates().catch(console.error);
