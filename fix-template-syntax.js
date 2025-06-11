import * as fs from "fs/promises";
import * as path from "path";

async function fixHandlebarsSyntax() {
  console.log("🔧 Fixing Handlebars pipe syntax in templates...\n");

  const templatesDir = "./templates";
  const files = await fs.readdir(templatesDir);
  const handlebarsFiles = files.filter((file) => file.endsWith(".handlebars"));

  let totalReplacements = 0;

  for (const file of handlebarsFiles) {
    const filePath = path.join(templatesDir, file);
    console.log(`📝 Processing ${file}...`);

    let content = await fs.readFile(filePath, "utf-8");
    const originalContent = content;

    // Convert pipe syntax to Handlebars function syntax
    // {{value | default "fallback"}} → {{default value "fallback"}}
    content = content.replace(
      /\{\{([^}]+?)\s*\|\s*default\s+([^}]+?)\}\}/g,
      "{{default $1 $2}}"
    );

    const replacements = (
      originalContent.match(/\{\{[^}]+?\s*\|\s*default\s+[^}]+?\}\}/g) || []
    ).length;

    if (replacements > 0) {
      await fs.writeFile(filePath, content, "utf-8");
      console.log(`  ✅ Fixed ${replacements} pipe syntax instances`);
      totalReplacements += replacements;
    } else {
      console.log(`  ⚡ No pipe syntax found`);
    }
  }

  console.log(`\n🎉 Template syntax fix complete!`);
  console.log(
    `📊 Total replacements: ${totalReplacements} across ${handlebarsFiles.length} files`
  );
}

fixHandlebarsSyntax().catch(console.error);
