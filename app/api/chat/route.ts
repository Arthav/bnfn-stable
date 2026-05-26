import { ChatRequest } from "@/lib/ai/chat-types";
import { ChatRuntimeError, sendChatMessage } from "@/lib/ai/chat";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const request = (await req.json()) as ChatRequest;
    const response = await sendChatMessage(request);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = error instanceof ChatRuntimeError ? error.status : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
