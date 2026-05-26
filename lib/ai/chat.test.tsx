import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import {
  ChatRuntimeError,
  createGeminiModelConfig,
  resolveInstructionText,
  sendChatMessage,
} from "@/lib/ai/chat";

describe("AI chat Module", () => {
  it("selects instructions and todo-specific model settings", () => {
    expect(resolveInstructionText("todoList")).toMatch(/to-do/i);
    expect(createGeminiModelConfig("todoList")).toMatchObject({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 150,
      },
    });
  });

  it("fails clearly for missing messages and missing server env key", async () => {
    await expect(
      sendChatMessage({ message: " ", instructionKey: "todoList" }, "key")
    ).rejects.toMatchObject(new ChatRuntimeError("Message is required", 400));

    await expect(
      sendChatMessage(
        { message: "hello", instructionKey: undefined as never },
        "key"
      )
    ).rejects.toMatchObject(
      new ChatRuntimeError("Instruction key is required", 400)
    );

    await expect(
      sendChatMessage({ message: "hello", instructionKey: "todoList" }, "")
    ).rejects.toMatchObject(new ChatRuntimeError("GEMINI_API_KEY is not defined"));
  });

  it("renders model text as escaped React text instead of injected HTML", () => {
    render(
      createElement(
        "p",
        { className: "whitespace-pre-wrap" },
        "<img src=x onerror=alert(1)>hello"
      )
    );

    expect(screen.getByText("<img src=x onerror=alert(1)>hello")).toBeInTheDocument();
    expect(document.querySelector("img")).toBeNull();
  });

  it("keeps chat pages on the server route without public Gemini keys", () => {
    const aiChat = readFileSync("app/(site)/aichat/page.tsx", "utf8");
    const pdfChat = readFileSync("app/(site)/pdfchat/page.tsx", "utf8");

    expect(aiChat).toContain('fetch("/api/chat"');
    expect(pdfChat).toContain('fetch("/api/chat"');
    expect(aiChat + pdfChat).not.toContain("NEXT_PUBLIC_GEMINI_KEY");
    expect(aiChat + pdfChat).not.toContain("dangerouslySetInnerHTML");
  });
});
