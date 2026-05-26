import { BrandResult } from "@/types/brand";

export class BrandParseError extends Error {
  constructor(message = "Failed to parse AI response") {
    super(message);
    this.name = "BrandParseError";
  }
}

export function normalizeBrandJsonText(text: string) {
  const trimmed = text.trim();

  if (trimmed.includes("```json")) {
    return trimmed.split("```json")[1].split("```")[0].trim();
  }

  if (trimmed.includes("```")) {
    return trimmed.split("```")[1].split("```")[0].trim();
  }

  return trimmed;
}

export function parseBrandResult(text: string): BrandResult {
  const normalized = normalizeBrandJsonText(text);

  try {
    return JSON.parse(normalized) as BrandResult;
  } catch {
    throw new BrandParseError();
  }
}
