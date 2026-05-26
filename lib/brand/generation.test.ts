import { describe, expect, it } from "vitest";
import {
  buildBrandRequestBody,
  decodeProviderStream,
  getBrandProviderConfig,
} from "@/lib/brand/generation";
import {
  BrandParseError,
  normalizeBrandJsonText,
  parseBrandResult,
} from "@/lib/brand/result-parser";
import type { BrandGenerationInput } from "@/lib/brand/generation";

const baseInput: BrandGenerationInput = {
  businessName: "Northstar",
  description: "A calm planning app",
  industry: "Productivity",
  mood: ["Minimalist"],
  themeStyle: "Flat Design",
  model: "openrouter",
};

describe("brand generation Module", () => {
  it("chooses OpenRouter and AIHubMix provider config from the input", () => {
    expect(
      getBrandProviderConfig(baseInput, {
        OPEN_ROUTER_KEY: "open-router-key",
        AIHUBMIX_API_KEY: "aihubmix-key",
      })
    ).toMatchObject({
      provider: "openrouter",
      apiKey: "open-router-key",
      modelName: "arcee-ai/trinity-large-preview:free",
    });

    expect(
      getBrandProviderConfig(
        { ...baseInput, model: "aihubmix" },
        {
          OPEN_ROUTER_KEY: "open-router-key",
          AIHUBMIX_API_KEY: "aihubmix-key",
        }
      )
    ).toMatchObject({
      provider: "aihubmix",
      apiKey: "aihubmix-key",
      modelName: "coding-glm-5-free",
    });
  });

  it("builds provider-specific request bodies", () => {
    expect(
      buildBrandRequestBody(baseInput, {
        provider: "openrouter",
        modelName: "open-model",
      })
    ).toMatchObject({
      model: "open-model",
      response_format: { type: "json_object" },
    });

    expect(
      buildBrandRequestBody(
        { ...baseInput, model: "aihubmix" },
        {
          provider: "aihubmix",
          modelName: "mix-model",
        },
        { stream: true }
      )
    ).toMatchObject({
      model: "mix-model",
      stream: true,
      thinking: { type: "enabled" },
    });
  });

  it("decodes SSE provider chunks and ignores DONE frames", async () => {
    const stream = streamFromText([
      'data: {"choices":[{"delta":{"content":"hel"}}]}\n',
      'data: {"choices":[{"delta":{"content":"lo"}}]}\n',
      "data: [DONE]\n",
    ]);

    await expect(readUtf8(decodeProviderStream(stream))).resolves.toBe("hello");
  });

  it("normalizes markdown-wrapped JSON and throws useful parse errors", () => {
    const json = '{"themeDescription":"clear"}';

    expect(normalizeBrandJsonText(`\`\`\`json\n${json}\n\`\`\``)).toBe(json);
    expect(parseBrandResult(`\`\`\`json\n${json}\n\`\`\``)).toMatchObject({
      themeDescription: "clear",
    });
    expect(() => parseBrandResult("not json")).toThrow(BrandParseError);
  });
});

function streamFromText(chunks: string[]) {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    start(controller) {
      chunks.forEach((chunk) => controller.enqueue(encoder.encode(chunk)));
      controller.close();
    },
  });
}

async function readUtf8(stream: ReadableStream<Uint8Array>) {
  const decoder = new TextDecoder();
  const reader = stream.getReader();
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
  }

  return text;
}
