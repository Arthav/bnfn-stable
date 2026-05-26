import { instruction } from "@/components/constant/instruction";

export type InstructionKey = keyof typeof instruction;

export type ChatHistoryMessage = {
  user: "User" | "AI";
  text: string;
};

export type ChatRequest = {
  message: string;
  instructionKey: InstructionKey;
  history?: ChatHistoryMessage[];
};

export type ChatResponse = {
  text: string;
};
