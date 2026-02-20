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
      }
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
