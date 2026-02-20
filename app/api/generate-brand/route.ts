
import { BrandInput } from "@/types/brand";

export const runtime = "edge";

const OPENROUTER_API_KEY = process.env.OPEN_ROUTER_KEY;
const AIHUBMIX_API_KEY = process.env.AIHUBMIX_API_KEY;

export async function POST(req: Request) {
    try {
        const input: BrandInput = await req.json();

        const shouldUseAIHubMix = input.model === "aihubmix";
        const API_KEY = shouldUseAIHubMix ? AIHUBMIX_API_KEY : OPENROUTER_API_KEY;
        const API_URL = shouldUseAIHubMix ? "https://aihubmix.com/v1/chat/completions" : "https://openrouter.ai/api/v1/chat/completions";
        const MODEL_NAME = shouldUseAIHubMix ? "coding-glm-5-free" : "arcee-ai/trinity-large-preview:free";

        if (!API_KEY) {
            return new Response(JSON.stringify({ error: `${shouldUseAIHubMix ? "AIHUBMIX_API_KEY" : "OPEN_ROUTER_KEY"} is not defined` }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        const prompt = `
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
      "positioning": "Who it’s for + what you do + why you’re different.",
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

        const body: any = {
            "model": MODEL_NAME,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "stream": true,
            "max_tokens": 65536,
            "temperature": 1.0
        };

        if (shouldUseAIHubMix) {
            body["thinking"] = { "type": "enabled" };
        } else {
            body["response_format"] = { "type": "json_object" };
        }

        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`API Error: ${res.status} - ${errorText}`);
        }

        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const stream = new ReadableStream({
            async start(controller) {
                const reader = res.body?.getReader();
                if (!reader) {
                    controller.close();
                    return;
                }

                let buffer = "";

                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true });
                        buffer += chunk;

                        const lines = buffer.split("\n");
                        buffer = lines.pop() || "";

                        for (const line of lines) {
                            const trimmed = line.trim();
                            if (!trimmed || !trimmed.startsWith("data: ")) continue;

                            const data = trimmed.slice(6);
                            if (data === "[DONE]") continue;

                            try {
                                const json = JSON.parse(data);
                                const content = json.choices?.[0]?.delta?.content || "";
                                if (content) {
                                    controller.enqueue(encoder.encode(content));
                                }
                            } catch (e) {
                                // Ignore parse errors
                            }
                        }
                    }
                } catch (err) {
                    controller.error(err);
                } finally {
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });

    } catch (error: any) {
        console.error("API Route Error:", error);
        return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
