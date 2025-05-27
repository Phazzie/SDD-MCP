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
      this.logToConsole(logEntry); // Notify seam manager about error through error handling seam
      await seamManager.errorHandling.communicateErrorReport(
        context.agentId,
        error,
        context
      );

      console.log(
        `🔍 ${this.agentId}: Handled ${errorCategory} error from ${context.agentId}`
      );

      return {
        success: true,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (handlingError) {
      // Fallback error handling - don't throw from error handler
      console.error(
        `❌ ${this.agentId}: Failed to handle error:`,
        handlingError
      );
      return {
        success: false,
        error: `Error handling failed: ${
          handlingError instanceof Error
            ? handlingError.message
            : "Unknown error"
        }`,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Blueprint: Structured error logging with agent tracking
  async logError(
    agentId: AgentId,
    error: string,
    details?: any
  ): Promise<ContractResult<void>> {
    try {
      const timestamp = new Date().toISOString();

      const logEntry: ErrorLogEntry = {
        timestamp,
        agentId,
        operation: "manual-log",
        errorType: "ManualError",
        errorMessage: error,
        stackTrace: undefined,
        category: "application",
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
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (loggingError) {
      console.error(`❌ ${this.agentId}: Failed to log error:`, loggingError);
      return {
        success: false,
        error: `Error logging failed: ${
          loggingError instanceof Error ? loggingError.message : "Unknown error"
        }`,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Blueprint: Create typed error result for specific return types
  createTypedErrorResult<T>(
    error: Error,
    context: Partial<ErrorContext>,
    fallbackData?: T
  ): ContractResult<T> {
    // Log the error internally
    this.logError(
      context.agentId || this.agentId,
      error.message,
      context
    ).catch((logError) => {
      console.error(`Failed to log error: ${logError}`);
    });

    return {
      success: false,
      data: fallbackData,
      error: error.message,
      agentId: context.agentId || this.agentId,
      timestamp: new Date().toISOString(),
      metadata: context.additionalInfo,
    };
  }

  // Blueprint: Error recovery suggestions based on patterns
  async suggestRecovery(errorType: string): Promise<ContractResult<string[]>> {
    try {
      const suggestions = this.getRecoverySuggestions(errorType);

      return {
        success: true,
        data: suggestions,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to suggest recovery: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Blueprint: Comprehensive diagnostic information collection
  async collectDiagnostics(): Promise<ContractResult<DiagnosticInfo>> {
    try {
      const now = Date.now();
      const recentErrors = this.errorLog
        .filter((entry) => now - new Date(entry.timestamp).getTime() < 3600000) // Last hour
        .map((entry) => `${entry.agentId}: ${entry.errorMessage}`)
        .slice(-10); // Last 10 errors

      const errorCount = this.errorLog.length;
      const criticalErrors = this.errorLog.filter(
        (entry) => entry.category === "critical"
      ).length;
      const recentCritical = recentErrors.filter((error) =>
        this.errorLog.some(
          (entry) =>
            error.includes(entry.errorMessage) && entry.category === "critical"
        )
      ).length;

      let systemHealth: "good" | "degraded" | "critical";
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
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to collect diagnostics: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Blueprint: Private helper methods for error management
  private categorizeError(
    error: Error
  ): "critical" | "warning" | "info" | "application" {
    const errorMessage = error.message.toLowerCase();
    const errorType = error.constructor.name;

    // Critical system errors
    if (
      errorType === "TypeError" &&
      errorMessage.includes("cannot read property")
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
      errorMessage.includes("access")
    ) {
      return "critical";
    }
    if (errorType === "SyntaxError") {
      return "critical";
    }

    // Application-level errors
    if (errorType === "NotImplementedError") {
      return "info";
    }

    return "application";
  }

  private getRecoverySuggestions(errorType: string): string[] {
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
        "Verify object structure",
        "Ensure proper initialization",
        "Add null checks before property access",
      ],
      ReferenceError: [
        "Check variable declarations",
        "Verify import statements",
        "Ensure proper scope",
        "Check for typos in variable names",
      ],
      SyntaxError: [
        "Check code syntax",
        "Verify JSON structure",
        "Look for missing brackets or commas",
        "Validate template syntax",
      ],
      NotImplementedError: [
        "Complete the implementation",
        "Check SDD implementation strategy",
        "Implement required methods",
        "Follow contract specifications",
      ],
    };

    return (
      suggestions[errorType] || [
        "Review error message for details",
        "Check logs for additional context",
        "Verify configuration settings",
        "Restart the service if needed",
      ]
    );
  }

  private generateRecommendations(
    systemHealth: "good" | "degraded" | "critical",
    recentErrors: string[]
  ): string[] {
    const recommendations: string[] = [];

    if (systemHealth === "critical") {
      recommendations.push(
        "🔴 System health is critical - immediate attention required"
      );
      recommendations.push("Review recent errors and apply fixes");
      recommendations.push("Consider restarting affected services");
    } else if (systemHealth === "degraded") {
      recommendations.push("🟡 System health is degraded - monitor closely");
      recommendations.push("Investigate recurring error patterns");
    } else {
      recommendations.push("✅ System health is good");
    }

    // Pattern-based recommendations
    const errorPatterns = this.analyzeErrorPatterns(recentErrors);
    recommendations.push(...errorPatterns);

    return recommendations;
  }

  private analyzeErrorPatterns(recentErrors: string[]): string[] {
    const patterns: string[] = [];

    // Check for repeated errors
    const errorCounts = recentErrors.reduce((counts, error) => {
      counts[error] = (counts[error] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const repeatedErrors = Object.entries(errorCounts).filter(
      ([, count]) => count > 2
    );
    if (repeatedErrors.length > 0) {
      patterns.push("🔄 Repeated errors detected - investigate root cause");
    }

    // Check for configuration issues
    if (
      recentErrors.some(
        (error) => error.includes("config") || error.includes("Config")
      )
    ) {
      patterns.push("⚙️ Configuration issues detected - review settings");
    }

    // Check for template issues
    if (
      recentErrors.some(
        (error) => error.includes("template") || error.includes("Template")
      )
    ) {
      patterns.push("📄 Template issues detected - verify template files");
    }

    return patterns;
  }

  private async writeLogToFile(entry: ErrorLogEntry): Promise<void> {
    try {
      // Ensure log directory exists
      const logDir = path.dirname(this.logPath);
      await fs.mkdir(logDir, { recursive: true });

      // Format log entry
      const logLine = JSON.stringify(entry) + "\n";

      // Append to log file
      await fs.appendFile(this.logPath, logLine);
    } catch (error) {
      // Don't throw from logging - just log to console
      console.error(`Failed to write to log file: ${error}`);
    }
  }

  private logToConsole(entry: ErrorLogEntry): void {
    const prefix = `[${entry.timestamp}] ${entry.agentId}`;

    switch (entry.category) {
      case "critical":
        console.error(`🔴 ${prefix}: ${entry.errorMessage}`);
        break;
      case "warning":
        console.warn(`🟡 ${prefix}: ${entry.errorMessage}`);
        break;
      case "info":
        console.info(`ℹ️ ${prefix}: ${entry.errorMessage}`);
        break;
      default:
        console.log(`📝 ${prefix}: ${entry.errorMessage}`);
    }

    if (entry.stackTrace && entry.category === "critical") {
      console.error(entry.stackTrace);
    }
  }

  // Blueprint: Health check for error handling service
  async healthCheck(): Promise<ContractResult<string>> {
    try {
      const checks = [];

      // Check log file access
      try {
        const logDir = path.dirname(this.logPath);
        await fs.access(logDir);
        checks.push("✅ Log directory accessible");
      } catch {
        checks.push("⚠️ Log directory not accessible");
      }

      // Check memory usage
      const memoryLogSize = this.errorLog.length;
      if (memoryLogSize < this.maxLogEntries * 0.8) {
        checks.push(
          `✅ Memory log healthy (${memoryLogSize}/${this.maxLogEntries})`
        );
      } else {
        checks.push(
          `⚠️ Memory log approaching limit (${memoryLogSize}/${this.maxLogEntries})`
        );
      }

      // Check recent error rate
      const recentErrors = this.errorLog.filter(
        (entry) => Date.now() - new Date(entry.timestamp).getTime() < 3600000
      );

      if (recentErrors.length < 10) {
        checks.push("✅ Error rate is normal");
      } else {
        checks.push("🟡 High error rate detected");
      }

      const healthStatus = checks.join("\n");
      const isHealthy = !checks.some((check) => check.includes("❌"));

      return {
        success: isHealthy,
        data: healthStatus,
        error: isHealthy ? undefined : "Some error handling issues detected",
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: `Health check failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        agentId: this.agentId,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Blueprint: Internal error log entry structure
interface ErrorLogEntry {
  timestamp: string;
  agentId: AgentId;
  operation: string;
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
  category: "critical" | "warning" | "info" | "application";
  additionalInfo?: any;
}

// Export singleton instance
export const errorHandler = new ErrorHandler();
