import { GoogleGenerativeAI } from "@google/generative-ai";
import { instruction } from "@/components/constant/instruction";
import { ChatRequest, ChatResponse, InstructionKey } from "@/lib/ai/chat-types";

const defaultGenerationConfig = {
  temperature: 0.9,
  maxOutputTokens: 250,
  topP: 0.9,
  topK: 50,
};

const todoGenerationConfig = {
  temperature: 0.5,
  maxOutputTokens: 150,
  topP: 0.9,
  topK: 50,
};

export class ChatRuntimeError extends Error {
  constructor(message: string, public status = 500) {
    super(message);
    this.name = "ChatRuntimeError";
  }
}

export function resolveInstructionText(instructionKey: InstructionKey) {
  const text = instruction[instructionKey];
  if (!text) {
    throw new ChatRuntimeError("Unknown instruction", 400);
  }
  return text;
}

export function createGeminiModelConfig(instructionKey: InstructionKey) {
  return {
    model: "gemini-1.5-flash",
    systemInstruction: {
      role: "system" as const,
      parts: [
        {
          text: resolveInstructionText(instructionKey),
        },
      ],
    },
    generationConfig:
      instructionKey === "todoList" ? todoGenerationConfig : defaultGenerationConfig,
  };
}

export async function sendChatMessage(
  request: ChatRequest,
  apiKey = process.env.GEMINI_API_KEY
): Promise<ChatResponse> {
  const message = typeof request.message === "string" ? request.message.trim() : "";

  if (!message) {
    throw new ChatRuntimeError("Message is required", 400);
  }

  if (!request.instructionKey) {
    throw new ChatRuntimeError("Instruction key is required", 400);
  }

  if (!apiKey) {
    throw new ChatRuntimeError("GEMINI_API_KEY is not defined");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel(createGeminiModelConfig(request.instructionKey));
  const history = (request.history || []).map((entry) => ({
    role: entry.user === "AI" ? "model" : "user",
    parts: [{ text: entry.text }],
  }));

  const chatSession = model.startChat({ history });
  const result = await chatSession.sendMessage(message);

  return {
    text: result.response.text() || "No response received from AI.",
  };
}
