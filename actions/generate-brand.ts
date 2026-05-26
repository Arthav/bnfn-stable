"use server";

import { generateBrandResult } from "@/lib/brand/generation";
import { BrandInput } from "@/types/brand";

export async function generateBrand(input: BrandInput) {
  return generateBrandResult(input);
}
