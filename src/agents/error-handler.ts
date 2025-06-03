/**
 * SDD MCP Server - ErrorHandler Implementation
 * Foundation agent providing error handling and diagnostic services
 */

import * as fs from "fs/promises";
import * as path from "path";
import {
  AgentId,
  ContractResult,
  DiagnosticInfo,
  ErrorContext,
  ErrorHandlerContract,
  SDDError, // Import SDDError
} from "../contracts.js";
import { seamManager } from "../seams.js";

export class ErrorHandler implements ErrorHandlerContract {
  private readonly agentId: AgentId = "ErrorHandler";
  private errorLog: ErrorLogEntry[] = [];
  private logPath: string;
  private maxLogEntries: number = 1000;

  constructor(logPath?: string) {
    this.logPath = logPath || path.join(process.cwd(), "logs", "error.log");
  }

  // Blueprint: Error categorization and handling with context
  async handleError(
    error: Error,
    context: ErrorContext
  ): Promise<ContractResult<void>> {
    try {
      const timestamp = new Date().toISOString();

      // Categorize error
      const errorCategory = this.categorizeError(error);

      // Create log entry
      const logEntry: ErrorLogEntry = {
        timestamp,
        agentId: context.agentId,
        operation: context.operation,
        errorType: error.constructor.name,
        errorMessage: error.message,
        stackTrace: error.stack,
        category: errorCategory,
        additionalInfo: context.additionalInfo,
      };

      // Add to memory log
      this.errorLog.push(logEntry);

      // Trim log if too large
      if (this.errorLog.length > this.maxLogEntries) {
        this.errorLog = this.errorLog.slice(-this.maxLogEntries);
      }

      // Write to file
      await this.writeLogToFile(logEntry);

      // Log to console with appropriate level
      this.logToConsole(logEntry);

      // Notify seam manager about error through error handling seam
      // This might be problematic if seamManager or its dependencies also use ErrorHandler
      // and cause a loop. For now, assuming it's handled.
      try {
        await seamManager.errorHandling.communicateErrorReport(
          context.agentId,
          error,
          context
        );
      } catch (seamError) {
        console.error(
          `❌ ${this.agentId}: Failed to communicate error report via seam:`,
          seamError
        );
      }

      console.log(
        `🔍 ${this.agentId}: Handled ${errorCategory} error from ${context.agentId}`
      );

      return {
        success: true,
        metadata: {
          agentId: this.agentId,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (handlingError) {
      // Fallback error handling - don't throw from error handler
      console.error(
        `❌ ${this.agentId}: Failed to handle error:`,
        handlingError
      );
      const err =
        handlingError instanceof Error
          ? handlingError
          : new Error(String(handlingError));
      const sddError: SDDError = {
        agentId: this.agentId,
        category: "ProcessingError",
        message: `ErrorHandler.handleError failed: ${err.message}`,
        timestamp: new Date().toISOString(),
        details: {
          originalError: err.stack,
          operation: "ErrorHandler.handleError.catch",
        },
      };
      return {
        success: false,
        error: sddError,
        metadata: {
          agentId: this.agentId,
          timestamp: new Date().toISOString(),
          operation: "ErrorHandler.handleError.catch",
        },
      };
    }
  }

  // Blueprint: Structured error logging with agent tracking
  async logError(
    agentId: AgentId,
    errorMessage: string, // Changed from 'error: string' to 'errorMessage: string' for clarity
    details?: any
  ): Promise<ContractResult<void>> {
    try {
      const timestamp = new Date().toISOString();

      const logEntry: ErrorLogEntry = {
        timestamp,
        agentId,
        operation: details?.operation || "manual-log",
        errorType: details?.errorType || "ManualError",
        errorMessage: errorMessage,
        stackTrace: details?.stackTrace, // Allow passing stack trace
        category: details?.category || "application", // Allow passing category
        additionalInfo: details,
      };

      // Add to memory log
      this.errorLog.push(logEntry);

      // Trim log if too large
      if (this.errorLog.length > this.maxLogEntries) {
        this.errorLog = this.errorLog.slice(-this.maxLogEntries);
      }

      // Write to file
      await this.writeLogToFile(logEntry);

      // Log to console
      this.logToConsole(logEntry);

      return {
        success: true,
        metadata: {
          agentId: this.agentId, // Logged by ErrorHandler itself
          timestamp: new Date().toISOString(),
        },
      };
    } catch (loggingError) {
      console.error(`❌ ${this.agentId}: Failed to log error:`, loggingError);
      const err =
        loggingError instanceof Error
          ? loggingError
          : new Error(String(loggingError));
      const sddError: SDDError = {
        agentId: this.agentId,
        category: "ProcessingError",
        message: `ErrorHandler.logError failed: ${err.message}`,
        timestamp: new Date().toISOString(),
        details: {
          originalError: err.stack,
          operation: "ErrorHandler.logError.catch",
        },
      };
      return {
        success: false,
        error: sddError,
        metadata: {
          agentId: this.agentId,
          timestamp: new Date().toISOString(),
          operation: "ErrorHandler.logError.catch",
        },
      };
    }
  }

  // Blueprint: Create typed error result for specific return types
  createTypedErrorResult<T>(
    error: Error,
    context: Partial<ErrorContext>, // agentId, operation, additionalInfo
    fallbackData?: T
  ): ContractResult<T> {
    // Log the error internally
    this.logError(
      context.agentId || this.agentId,
      error.message, // Pass message
      {
        // Pass structured details
        originalErrorType: error.constructor.name,
        operation: context.operation,
        additionalDetails: context.additionalInfo,
        stackTrace: error.stack, // Log stack trace
        category: this.categorizeError(error), // Use internal categorization for logging
      }
    ).catch((logErr) => {
      // Renamed variable to avoid conflict
      // Minimal console log to avoid loops if logging itself fails
      console.error(
        `[ErrorHandler] CRITICAL: Failed to log error via this.logError: ${logErr}`
      );
    });

    let sddCategory: SDDError["category"] = "ProcessingError";
    if (
      error.name === "TypeError" ||
      error.message.toLowerCase().includes("validation")
    ) {
      sddCategory = "ValidationError";
    } else if (error.name === "ReferenceError") {
      sddCategory = "ProcessingError"; // Could be a bug
    } else if (error.name === "NotImplementedError") {
      sddCategory = "NotImplementedError";
    }
    // More sophisticated mapping could be added here

    const sddErrorInstance: SDDError = {
      message: error.message,
      agentId: context.agentId || this.agentId,
      timestamp: new Date().toISOString(),
      category: sddCategory,
      details: {
        originalErrorType: error.constructor.name,
        operation: context.operation,
        ...(context.additionalInfo || {}),
      },
      seamName: context.additionalInfo?.seamName,
      severity: this.mapSeverity(this.categorizeError(error)), // Map internal category to severity
      suggestions: this.getRecoverySuggestions(error.name).slice(0, 3), // Add some suggestions
    };

    return {
      success: false,
      data: fallbackData,
      error: sddErrorInstance,
      metadata: {
        agentId: context.agentId || this.agentId,
        timestamp: new Date().toISOString(),
        operation: context.operation,
        ...(context.additionalInfo?.requestId && {
          requestId: context.additionalInfo.requestId,
        }),
        ...(context.additionalInfo?.seamName && {
          seamName: context.additionalInfo.seamName,
        }),
      },
    };
  }

  // Blueprint: Error recovery suggestions based on patterns
  async suggestRecovery(errorType: string): Promise<ContractResult<string[]>> {
    try {
      const suggestions = this.getRecoverySuggestions(errorType);
      return {
        success: true,
        data: suggestions,
        metadata: {
          agentId: this.agentId,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      const sddError: SDDError = {
        agentId: this.agentId,
        category: "ProcessingError",
        message: `Failed to suggest recovery: ${err.message}`,
        timestamp: new Date().toISOString(),
        details: {
          originalError: err.stack,
          operation: "suggestRecovery.catch",
          errorType,
        },
      };
      return {
        success: false,
        error: sddError,
        metadata: {
          agentId: this.agentId,
          timestamp: new Date().toISOString(),
          operation: "suggestRecovery.catch",
        },
      };
    }
  }

  // Blueprint: Comprehensive diagnostic information collection
  async collectDiagnostics(): Promise<ContractResult<DiagnosticInfo>> {
    try {
      const now = Date.now();
      const recentErrors = this.errorLog
        .filter((entry) => now - new Date(entry.timestamp).getTime() < 3600000) // Last hour
        .map(
          (entry) =>
            `${entry.agentId} (${entry.operation || "N/A"}): ${
              entry.errorMessage
            }`
        )
        .slice(-10); // Last 10 errors

      const errorCount = this.errorLog.length;
      // ... (rest of the diagnostic logic remains the same)
      let systemHealth: "good" | "degraded" | "critical";
      const criticalErrors = this.errorLog.filter(
        (entry) => entry.category === "critical"
      ).length;
      const recentCritical = this.errorLog.filter(
        (entry) =>
          new Date(entry.timestamp).getTime() > now - 3600000 &&
          entry.category === "critical"
      ).length;

      if (recentCritical > 0) {
        systemHealth = "critical";
      } else if (recentErrors.length > 5) {
        systemHealth = "degraded";
      } else {
        systemHealth = "good";
      }

      const recommendations = this.generateRecommendations(
        systemHealth,
        recentErrors
      );

      const diagnostics: DiagnosticInfo = {
        errorCount,
        recentErrors,
        systemHealth,
        recommendations,
      };

      return {
        success: true,
        data: diagnostics,
        metadata: {
          agentId: this.agentId,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      const sddError: SDDError = {
        agentId: this.agentId,
        category: "ProcessingError",
        message: `Failed to collect diagnostics: ${err.message}`,
        timestamp: new Date().toISOString(),
        details: {
          originalError: err.stack,
          operation: "collectDiagnostics.catch",
        },
      };
      return {
        success: false,
        error: sddError,
        metadata: {
          agentId: this.agentId,
          timestamp: new Date().toISOString(),
          operation: "collectDiagnostics.catch",
        },
      };
    }
  }

  // Blueprint: Private helper methods for error management
  private categorizeError(
    error: Error
  ): "critical" | "warning" | "info" | "application" {
    const errorMessage = error.message.toLowerCase();
    const errorType = error.constructor.name;

    if (errorType === "NotImplementedError") {
      // SDD Specific
      return "info";
    }
    if (
      errorType === "SyntaxError" ||
      (errorType === "TypeError" &&
        errorMessage.includes("cannot read property"))
    ) {
      return "critical";
    }
    if (errorType === "ReferenceError") {
      return "critical";
    }
    if (
      errorMessage.includes("enoent") ||
      errorMessage.includes("file not found")
    ) {
      return "warning";
    }
    if (
      errorMessage.includes("permission") ||
      errorMessage.includes("access denied")
    ) {
      // More specific
      return "critical";
    }
    // Default for other errors
    return "application";
  }

  // Helper method to map internal category to SDDError.severity
  private mapSeverity(
    internalCategory: ReturnType<typeof this.categorizeError>
  ): SDDError["severity"] {
    switch (internalCategory) {
      case "critical":
        return "critical";
      case "warning":
        return "high";
      case "info":
        return "low";
      case "application":
        return "medium";
      default:
        return "medium";
    }
  }

  private getRecoverySuggestions(errorTypeOrName: string): string[] {
    // ... (getRecoverySuggestions logic remains the same)
    const suggestions: Record<string, string[]> = {
      ENOENT: [
        "Check if the file path is correct",
        "Ensure the file exists",
        "Verify directory permissions",
        "Create missing directories",
      ],
      EACCES: [
        "Check file permissions",
        "Run with appropriate privileges",
        "Verify directory access rights",
      ],
      TypeError: [
        "Check for null or undefined values",
        "Verify object structure and types",
        "Ensure proper initialization of variables",
        "Add null checks before property access",
      ],
      ReferenceError: [
        "Check variable declarations and spelling",
        "Verify import statements and paths",
        "Ensure proper scope for variables",
      ],
      SyntaxError: [
        "Check code syntax for typos or structural errors",
        "Verify JSON structure if parsing JSON",
        "Look for missing brackets, commas, or quotes",
        "Validate template syntax if processing templates",
      ],
      NotImplementedError: [
        // SDD Specific
        "Complete the method implementation as per blueprint/contract",
        "Check SDD implementation strategy and task list",
        "Follow contract specifications for expected behavior",
      ],
    };

    return (
      suggestions[errorTypeOrName] ||
      suggestions[errorTypeOrName.toUpperCase()] || [
        // Check for common error codes like ENOENT
        "Review error message for details",
        "Check application logs for additional context",
        "Verify configuration settings related to the operation",
        "If persistent, consult documentation or support channels",
      ]
    );
  }

  private generateRecommendations(
    systemHealth: "good" | "degraded" | "critical",
    recentErrors: string[]
  ): string[] {
    // ... (generateRecommendations logic remains the same)
    const recommendations: string[] = [];

    if (systemHealth === "critical") {
      recommendations.push(
        "🔴 System health is critical - immediate attention required"
      );
      recommendations.push(
        "Review recent critical errors and apply fixes urgently"
      );
      recommendations.push(
        "Consider restarting affected services if necessary and safe"
      );
    } else if (systemHealth === "degraded") {
      recommendations.push("🟡 System health is degraded - monitor closely");
      recommendations.push(
        "Investigate recurring error patterns to identify root causes"
      );
    } else {
      recommendations.push("✅ System health is good");
    }

    // Pattern-based recommendations
    const errorPatterns = this.analyzeErrorPatterns(recentErrors);
    recommendations.push(...errorPatterns);

    if (
      recommendations.length === 1 &&
      recommendations[0] === "✅ System health is good"
    ) {
      return ["No specific recommendations at this time. System is stable."];
    }

    return recommendations;
  }

  private analyzeErrorPatterns(recentErrors: string[]): string[] {
    // ... (analyzeErrorPatterns logic remains the same)
    const patterns: string[] = [];
    if (!recentErrors || recentErrors.length === 0) return patterns;

    const errorCounts = recentErrors.reduce((counts, errorStr) => {
      // Extract primary message for better grouping
      const coreMessage = errorStr.split(":")[1]?.trim() || errorStr;
      counts[coreMessage] = (counts[coreMessage] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const repeatedErrors = Object.entries(errorCounts).filter(
      ([, count]) => count > 2
    );
    if (repeatedErrors.length > 0) {
      patterns.push(
        `🔄 Repeated errors detected (${repeatedErrors
          .map((e) => `'${e[0]}'`)
          .join(", ")}) - investigate root cause`
      );
    }

    if (recentErrors.some((e) => e.toLowerCase().includes("config"))) {
      patterns.push(
        "⚙️ Potential configuration issues detected - review settings"
      );
    }
    if (recentErrors.some((e) => e.toLowerCase().includes("template"))) {
      patterns.push(
        "📄 Potential template issues detected - verify template files and syntax"
      );
    }
    if (
      recentErrors.some(
        (e) =>
          e.toLowerCase().includes("permission") ||
          e.toLowerCase().includes("access")
      )
    ) {
      patterns.push(
        "🛡️ Potential permission issues detected - check file/resource access rights"
      );
    }
    if (recentErrors.some((e) => e.toLowerCase().includes("not implemented"))) {
      patterns.push(
        "🚧 'NotImplementedError' detected - check for incomplete SDD stubs or features."
      );
    }

    return patterns;
  }

  private async writeLogToFile(entry: ErrorLogEntry): Promise<void> {
    // ... (writeLogToFile logic remains the same)
    try {
      const logDir = path.dirname(this.logPath);
      await fs.mkdir(logDir, { recursive: true });
      const logLine = JSON.stringify(entry) + "\\n";
      await fs.appendFile(this.logPath, logLine);
    } catch (error) {
      console.error(
        `[ErrorHandler] CRITICAL: Failed to write to log file ${this.logPath}: ${error}`
      );
    }
  }

  private logToConsole(entry: ErrorLogEntry): void {
    // ... (logToConsole logic remains the same)
    const prefix = `[${entry.timestamp}] [${entry.agentId}${
      entry.operation ? `/${entry.operation}` : ""
    }]`;

    switch (entry.category) {
      case "critical":
        console.error(`🔴 ${prefix} CRITICAL: ${entry.errorMessage}`);
        break;
      case "warning":
        console.warn(`🟡 ${prefix} WARNING: ${entry.errorMessage}`);
        break;
      case "info":
        console.info(`ℹ️ ${prefix} INFO: ${entry.errorMessage}`);
        break;
      default: // application
        console.log(`📝 ${prefix} APP_ERROR: ${entry.errorMessage}`);
    }

    if (
      entry.stackTrace &&
      (entry.category === "critical" || entry.category === "application")
    ) {
      // Also log stack for application errors if available
      console.error(entry.stackTrace);
    }
  }

  // Blueprint: Health check for error handling service
  async healthCheck(): Promise<ContractResult<string>> {
    try {
      const checks = [];
      const now = Date.now();

      // Check log file access
      try {
        const logDir = path.dirname(this.logPath);
        await fs.access(logDir); // Check if dir exists and is accessible
        // Try a test write if possible, or check permissions more deeply
        checks.push("✅ Log directory accessible");
      } catch {
        checks.push("⚠️ Log directory not accessible or does not exist");
      }

      // Check memory usage
      const memoryLogSize = this.errorLog.length;
      if (memoryLogSize < this.maxLogEntries * 0.8) {
        checks.push(
          `✅ Memory log healthy (${memoryLogSize}/${this.maxLogEntries})`
        );
      } else if (memoryLogSize < this.maxLogEntries) {
        checks.push(
          `⚠️ Memory log approaching limit (${memoryLogSize}/${this.maxLogEntries})`
        );
      } else {
        checks.push(
          `❌ Memory log full or over limit (${memoryLogSize}/${this.maxLogEntries}) - oldest logs might be lost`
        );
      }

      // Check recent error rate
      const recentErrorEntries = this.errorLog.filter(
        (entry) => new Date(entry.timestamp).getTime() > now - 3600000 // Last hour
      );

      if (recentErrorEntries.length < 10) {
        checks.push(
          `✅ Error rate normal (${recentErrorEntries.length} in last hour)`
        );
      } else if (recentErrorEntries.length < 50) {
        checks.push(
          `🟡 Elevated error rate (${recentErrorEntries.length} in last hour)`
        );
      } else {
        checks.push(
          `❌ High error rate (${recentErrorEntries.length} in last hour)`
        );
      }

      const criticalRecent = recentErrorEntries.filter(
        (e) => e.category === "critical"
      ).length;
      if (criticalRecent > 0) {
        checks.push(`❌ ${criticalRecent} critical error(s) in the last hour.`);
      }

      const healthStatus = checks.join("\\n");
      // isHealthy is true if no "❌" messages
      const isHealthy = !checks.some((check) => check.startsWith("❌"));

      if (!isHealthy) {
        return this.createTypedErrorResult<string>(
          new Error(
            "ErrorHandler health check failed: Critical issues detected."
          ),
          {
            agentId: this.agentId,
            operation: "healthCheck.criticalIssues",
            additionalInfo: { healthStatusDetail: healthStatus }, // Use a different key
          },
          healthStatus // fallback data
        );
      }

      return {
        success: true,
        data: healthStatus,
        metadata: {
          agentId: this.agentId,
          timestamp: new Date().toISOString(),
          notes: checks.some((c) => c.startsWith("⚠️"))
            ? "Health check passed with warnings."
            : "Health check passed.",
        },
      };
    } catch (error) {
      // This catch is for errors within the healthCheck logic itself
      return this.createTypedErrorResult<string>(
        error instanceof Error
          ? error
          : new Error(
              "Unknown error during ErrorHandler healthCheck execution"
            ),
        {
          agentId: this.agentId,
          operation: "healthCheck.executionError",
        }
      );
    }
  }
}

// Blueprint: Internal error log entry structure
interface ErrorLogEntry {
  timestamp: string;
  agentId: AgentId;
  operation: string; // Operation during which error occurred
  errorType: string; // e.g., TypeError, ManualError
  errorMessage: string;
  stackTrace?: string;
  category: "critical" | "warning" | "info" | "application"; // Internal categorization
  additionalInfo?: any;
}

// Export singleton instance
export const errorHandler = new ErrorHandler();
