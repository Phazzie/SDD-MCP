import { promises as fs } from "fs";
import path from "path";
import {
  ContractResult,
  SddIntroductionTutorialToolContract,
} from "../../contracts.js";

/**
 * @class SddIntroductionTutorialTool
 * @description A tool to provide a comprehensive, interactive tutorial on Seam-Driven Development (SDD)
 * for LLMs onboarding to this project.
 *
 * @implements {SddIntroductionTutorialToolContract}
 */
class SddIntroductionTutorialTool
  implements SddIntroductionTutorialToolContract
{
  private tutorialContent: string | null = null;
  private readonly tutorialPath = path.resolve(
    process.cwd(),
    "docs",
    "consolidation-analysis",
    "SDD_UP_TO_SPEED_TOOL_OUTLINE.md"
  );

  private sectionMap: { [key: string]: string } = {
    quick_overview: "## 1. QUICK OVERVIEW",
    detailed_guide: "## 2. DETAILED GUIDE",
    full_methodology: "## 3. FULL METHODOLOGY",
    specific_topics: "## 4. SPECIFIC TOPIC DEEP DIVES",
    llm_briefing: "## 5. LLM-SPECIFIC TECHNICAL BRIEFING",
    scenarios: "## 6. SDD APPLICATION SCENARIOS",
    troubleshooting: "#### B. Troubleshooting with SDD",
    success_scenarios: "## 7. SDD SUCCESS SCENARIOS: BEFORE/AFTER COMPARISONS",
  };

  private async loadContent(): Promise<void> {
    if (!this.tutorialContent) {
      this.tutorialContent = await fs.readFile(this.tutorialPath, "utf-8");
    }
  }

  /**
   * @method getTutorialSection
   * @description Retrieves a specific section of the SDD tutorial.
   * @param {any} params - The parameters for the tutorial section.
   * @returns {Promise<ContractResult<string>>} The tutorial content in Markdown format.
   */
  async getTutorialSection(params: any): Promise<ContractResult<string>> {
    try {
      await this.loadContent();
      const sectionKey =
        typeof params === "object" && params.section ? params.section : params;

      if (!sectionKey || !this.sectionMap[sectionKey]) {
        return {
          success: true,
          data:
            `## SDD Tutorial: Full Content\n\n(No specific section requested or key not found. Returning full content.)\n\n` +
            this.tutorialContent,
          metadata: {
            source: this.tutorialPath,
            retrieval_mode: "full_content_fallback",
          },
        };
      }

      const sectionTitle = this.sectionMap[sectionKey];
      const lines = this.tutorialContent!.split(/\r?\n/);
      let inSection = false;
      const sectionContent: string[] = [];
      const headingLevel = (sectionTitle.match(/#/g) || []).length;

      for (const line of lines) {
        if (line.trim().startsWith(sectionTitle)) {
          inSection = true;
        }

        if (inSection) {
          const currentLineLevelMatch = line.match(/^(#+)/);
          if (currentLineLevelMatch) {
            const currentLineLevel = currentLineLevelMatch[1].length;
            if (
              currentLineLevel <= headingLevel &&
              !line.trim().startsWith(sectionTitle)
            ) {
              break; // Stop if we hit another header of the same or higher level
            }
          }
          sectionContent.push(line);
        }
      }

      if (sectionContent.length === 0) {
        return {
          success: false,
          error: `Section '${sectionKey}' with title '${sectionTitle}' not found in tutorial content.`,
          metadata: { path: this.tutorialPath },
        };
      }

      return {
        success: true,
        data: sectionContent.join("\n"),
        metadata: {
          source: this.tutorialPath,
          retrieval_mode: "specific_section",
          section_key: sectionKey,
          section_title: sectionTitle,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Failed to load SDD tutorial content: ${error.message}`,
        metadata: {
          path: this.tutorialPath,
          error_stack: error.stack,
        },
      };
    }
  }
}

export default new SddIntroductionTutorialTool();
