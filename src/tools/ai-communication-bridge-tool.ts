import { promises as fs } from "fs";
import * as path from "path";
import {
  ContractResult,
  ToolDefinition,
  ToolModuleContract,
} from "../contracts.js";

const COMMUNICATION_FILE = path.join(
  "c:\\Users\\thump\\SkepticalWombat\\ai-collaboration",
  "communication.jsonl"
);

interface AIMessage {
  id: string;
  timestamp: string;
  from: "copilot" | "claude" | "mcp";
  to: "copilot" | "claude" | "mcp";
  type: string;
  payload: any;
  correlationId?: string;
  protocolVersion: string;
}

// Tool definition following SDD patterns
const AI_COMMUNICATION_BRIDGE_TOOL_DEFINITION: ToolDefinition = {
  name: "ai_communication_bridge",
  description: "Bridge for AI collaboration via shared JSONL file",
  inputSchema: {
    type: "object",
    properties: {
      operation: {
        type: "string",
        enum: ["read_new", "send_message", "read_all", "clear_processed"],
        description: "Operation to perform",
      },
      message: {
        type: "object",
        optional: true,
        description: "Message to send (for send_message operation)",
      },
      afterId: {
        type: "string",
        optional: true,
        description: "Read messages after this ID (for read_new)",
      },
    },
    required: ["operation"],
  },
  outputSchema: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      data: { type: "any" },
      error: { type: "string", optional: true },
      metadata: { type: "object", optional: true },
    },
  },
};

// Main execution function
async function execute(input: any): Promise<ContractResult<any>> {
  const { operation, message, afterId } = input;

  try {
    // Input validation (fail-fast)
    if (!operation) {
      return {
        success: false,
        error: "Missing required parameter: operation",
      };
    }

    switch (operation) {
      case "read_new":
        return await readNewMessages(afterId);

      case "read_all":
        return await readAllMessages();

      case "send_message":
        if (!message) {
          return {
            success: false,
            error:
              "Missing required parameter: message for send_message operation",
          };
        }
        return await sendMessage(message);

      case "clear_processed":
        return await clearProcessedMessages(afterId);

      default:
        return {
          success: false,
          error: `Unknown operation: ${operation}. Valid operations: read_new, send_message, read_all, clear_processed`,
        };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      metadata: {
        operation,
        timestamp: new Date().toISOString(),
      },
    };
  }
}

// Export the contract for registry registration
export const TOOL_MODULE_CONTRACT: ToolModuleContract = {
  toolDefinition: AI_COMMUNICATION_BRIDGE_TOOL_DEFINITION,
  execute,
};

// Legacy export for direct use (backward compatibility)
export const aiCommunicationBridgeTool = {
  name: "ai_communication_bridge",
  description: "Bridge for AI collaboration via shared JSONL file",

  inputSchema: {
    type: "object",
    properties: {
      operation: {
        type: "string",
        enum: ["read_new", "send_message", "read_all", "clear_processed"],
        description: "Operation to perform",
      },
      message: {
        type: "object",
        optional: true,
        description: "Message to send (for send_message operation)",
      },
      afterId: {
        type: "string",
        optional: true,
        description: "Read messages after this ID (for read_new)",
      },
    },
    required: ["operation"],
  },

  handler: async (args: any) => {
    const result = await execute(args);
    if (!result.success) {
      throw new Error(result.error || "AI communication bridge tool failed");
    }
    return result;
  },
};

// Helper functions
async function readNewMessages(afterId?: string) {
  const allMessages = await readAllMessages();
  if (!allMessages.success) return allMessages;

  const messages = allMessages.data as AIMessage[];
  if (!afterId) return allMessages;

  const afterIndex = messages.findIndex((m) => m.id === afterId);
  if (afterIndex === -1) return allMessages;

  return {
    success: true,
    data: messages.slice(afterIndex + 1),
  };
}

async function readAllMessages() {
  try {
    const content = await fs.readFile(COMMUNICATION_FILE, "utf-8");
    const lines = content
      .trim()
      .split("\n")
      .filter((line) => line.trim());
    const messages = lines.map((line) => JSON.parse(line));

    return {
      success: true,
      data: messages,
      metadata: { messageCount: messages.length },
    };
  } catch (error) {
    if ((error as any).code === "ENOENT") {
      // File doesn't exist yet
      return { success: true, data: [] };
    }
    throw error;
  }
}

async function sendMessage(message: AIMessage) {
  const newMessage = {
    ...message,
    id: message.id || `msg-${Date.now()}`,
    timestamp: message.timestamp || new Date().toISOString(),
    protocolVersion: message.protocolVersion || "1.0",
  };

  const line = JSON.stringify(newMessage) + "\n";
  await fs.appendFile(COMMUNICATION_FILE, line);

  return {
    success: true,
    data: newMessage,
    metadata: { written: true },
  };
}

async function clearProcessedMessages(beforeId: string) {
  // For now, we'll keep all messages (audit trail)
  // Could implement cleanup later if needed
  return {
    success: true,
    data: { cleared: 0 },
    metadata: { note: "Message cleanup not implemented - keeping audit trail" },
  };
}
