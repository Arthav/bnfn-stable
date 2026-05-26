import { BrandInput, BrandResult } from "@/types/brand";
import {
  normalizeBrandJsonText,
  parseBrandResult,
} from "@/lib/brand/result-parser";

export { normalizeBrandJsonText, parseBrandResult };

export type BrandProvider = "openrouter" | "aihubmix";
export type BrandGenerationInput = BrandInput;

type ProviderConfig = {
  provider: BrandProvider;
  apiKey: string;
  apiUrl: string;
  modelName: string;
  missingKeyName: string;
};
type BrandProviderEnv = Partial<Record<"OPEN_ROUTER_KEY" | "AIHUBMIX_API_KEY", string>>;

const providerUrls: Record<BrandProvider, string> = {
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
  aihubmix: "https://aihubmix.com/v1/chat/completions",
};

const providerModels: Record<BrandProvider, string> = {
  openrouter: "arcee-ai/trinity-large-preview:free",
  aihubmix: "coding-glm-5-free",
};

export class BrandGenerationError extends Error {
  constructor(message: string, public status = 500) {
    super(message);
    this.name = "BrandGenerationError";
  }
}

export function resolveBrandProvider(input: BrandGenerationInput): BrandProvider {
  return input.model === "aihubmix" ? "aihubmix" : "openrouter";
}

export function getBrandProviderConfig(
  input: BrandGenerationInput,
  env: BrandProviderEnv = {
    OPEN_ROUTER_KEY: process.env.OPEN_ROUTER_KEY,
    AIHUBMIX_API_KEY: process.env.AIHUBMIX_API_KEY,
  }
): ProviderConfig {
  const provider = resolveBrandProvider(input);
  const missingKeyName = provider === "aihubmix" ? "AIHUBMIX_API_KEY" : "OPEN_ROUTER_KEY";
  const apiKey = provider === "aihubmix" ? env.AIHUBMIX_API_KEY : env.OPEN_ROUTER_KEY;

  if (!apiKey) {
    throw new BrandGenerationError(`${missingKeyName} is not defined`);
  }

  return {
    provider,
    apiKey,
    apiUrl: providerUrls[provider],
    modelName: providerModels[provider],
    missingKeyName,
  };
}

export function buildBrandPrompt(input: BrandGenerationInput) {
  return `
    Generate a brand bible for a business with the following details:
    - Business Name: ${input.businessName}
    - Description: ${input.description}
    - Industry: ${input.industry}
    - Brand Mood: ${input.mood.join(", ")}
    - Theme Style: ${input.themeStyle}

    Please provide the output in the following JSON format:
    {
      "colorPalette": {
        "primary": "hex color code",
        "secondary": "hex color code",
        "background": "hex color code",
        "text": "hex color code",
        "tertiary": "hex color code"
      },
      "typography": {
        "header": "font family name",
        "body": "font family name",
        "sizing": "description of scale or sizing"
      },
      "themeDescription": "A concise description of the overall theme.",
      "reasoning": "Explanation of why these choices were made based on the input.",
      "tagline": "A catchy, memorable tagline.",
      "positioning": "Who it's for + what you do + why you're different.",
      "uvp": ["Key differentiator 1", "Key differentiator 2", "Key differentiator 3"],
      "brandStory": {
        "short": "Short version of the brand story.",
        "long": "Longer, narrative version of the brand story."
      },
      "iconStyle": "Guidance on iconography style.",
      "audienceAnalysis": {
        "personas": [
          {
            "name": "Persona Name",
            "demographics": "Age, gender, location, etc.",
            "painPoints": ["Pain point 1", "Pain point 2"],
            "motivations": ["Motivation 1", "Motivation 2"],
            "whatTheyCareAbout": "Core value or interest."
          },
          {
             "name": "Second Persona Name",
             "demographics": "...",
             "painPoints": ["..."],
             "motivations": ["..."],
             "whatTheyCareAbout": "..."
          }
        ],
        "competitorContext": "Brief analysis of where the brand sits relative to competitors.",
        "brandArchetype": "e.g., Hero, Sage, Creator.",
        "customerPromise": "What the brand promises to the customer.",
        "whatWeNeverDo": "What the brand explicitly avoids or stands against."
      },
      "logoGuidelines": {
        "variants": {
            "horizontal": "Description of horizontal logo variant.",
            "stacked": "Description of stacked logo variant.",
            "iconOnly": "Description of icon-only variant."
        },
        "clearSpaceRules": "Rules for clear space around the logo.",
        "minimumSize": "Minimum size requirements.",
        "incorrectUsage": ["Example 1", "Example 2", "Example 3"]
      },
      "voiceAndTone": {
        "attributes": ["Trait 1", "Trait 2", "Trait 3"],
        "contextualTone": {
            "marketing": "Tone for marketing.",
            "support": "Tone for support.",
            "academic": "Tone for academic/technical.",
            "social": "Tone for social media."
        },
        "doAndDonts": [
             { "do": "Do this...", "dont": "Don't do this..." },
             { "do": "Do this...", "dont": "Don't do this..." }
        ],
        "sampleCopy": {
            "heroHeadline": "Sample hero headline.",
            "aboutUs": "Sample about us text.",
            "cta": "Sample CTA text.",
            "errorMessage": "Sample error message.",
            "emailGreeting": "Sample email greeting."
        }
      },
      "landingPagePreview": {
        "heroTitle": "Headline for the landing page preview.",
        "heroSubtitle": "Subtitle for the landing page preview.",
        "ctaText": "Button text.",
        "featureTitle": "Title for a feature section.",
        "featureDescription": "Description for a feature section."
      }
    }
    `;
}

export function buildBrandRequestBody(
  input: BrandGenerationInput,
  config: Pick<ProviderConfig, "provider" | "modelName">,
  options: { stream?: boolean } = {}
) {
  const body: Record<string, unknown> = {
    model: config.modelName,
    messages: [
      {
        role: "user",
        content: buildBrandPrompt(input),
      },
    ],
    max_tokens: 65536,
    temperature: 1.0,
  };

  if (options.stream) {
    body.stream = true;
  }

  if (config.provider === "aihubmix") {
    body.thinking = { type: "enabled" };
  } else {
    body.response_format = { type: "json_object" };
  }

  return body;
}

export function decodeProviderStream(providerBody: ReadableStream<Uint8Array> | null) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = providerBody?.getReader();
      if (!reader) {
        controller.close();
        return;
      }

      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;

            const data = trimmed.slice(6);
            if (!data || data === "[DONE]") continue;

            try {
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.delta?.content || "";
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            } catch {
              // Provider streams can include non-JSON keepalive lines.
            }
          }
        }
      } catch (error) {
        controller.error(error);
        return;
      }

      controller.close();
    },
  });
}

export async function generateBrandStream(input: BrandGenerationInput) {
  const config = getBrandProviderConfig(input);
  const response = await fetch(config.apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildBrandRequestBody(input, config, { stream: true })),
  });

  if (!response.ok) {
    throw new BrandGenerationError(`API Error: ${response.status} - ${await response.text()}`);
  }

  return decodeProviderStream(response.body);
}

export async function generateBrandResult(input: BrandGenerationInput) {
  const config = getBrandProviderConfig(input);
  const response = await fetch(config.apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildBrandRequestBody(input, config)),
  });

  if (!response.ok) {
    throw new BrandGenerationError(
      `API Error (${config.provider === "aihubmix" ? "AIHubMix" : "OpenRouter"}): ${response.statusText} - ${await response.text()}`
    );
  }

  const result = await response.json();
  return {
    ...parseBrandResult(result.choices?.[0]?.message?.content || ""),
    businessName: input.businessName,
    description: input.description,
  };
}
