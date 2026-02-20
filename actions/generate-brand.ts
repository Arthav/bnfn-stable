"use server";

import { BrandInput, BrandResult } from "@/types/brand";

const OPENROUTER_API_KEY = process.env.OPEN_ROUTER_KEY;

export async function generateBrand(input: BrandInput): Promise<BrandResult> {
    if (!OPENROUTER_API_KEY) {
        throw new Error("OPEN_ROUTER_KEY is not defined");
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
      "reasoning": "Explanation of why these choices were made based on the input."
    }
  `;

    try {
        // First API call with reasoning enabled
        let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "arcee-ai/trinity-large-preview:free",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "response_format": { "type": "json_object" }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API error: ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        const content = result.choices[0].message.content;

        try {
            const parsedResult = JSON.parse(content) as BrandResult;
            return {
                ...parsedResult,
                businessName: input.businessName,
                description: input.description,
            };
        } catch (parseError) {
            console.error("Failed to parse JSON response:", content);
            throw new Error("Failed to parse AI response");
        }

    } catch (error) {
        console.error("Error generating brand:", error);
        throw error;
    }
}
