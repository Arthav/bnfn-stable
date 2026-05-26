import {
  BrandGenerationError,
  generateBrandStream,
} from "@/lib/brand/generation";
import { BrandInput } from "@/types/brand";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const input = (await req.json()) as BrandInput;
    const stream = await generateBrandStream(input);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    const status = error instanceof BrandGenerationError ? error.status : 500;

    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
