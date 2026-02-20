"use client";

import { useState } from "react";
import { BrandForm } from "@/components/brand-bible/brand-form";
import { BrandResult } from "@/components/brand-bible/brand-result";
// import { generateBrand } from "@/actions/generate-brand";
import { BrandInput, BrandResult as BrandResultType } from "@/types/brand";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { TransitionCurtain } from "@/components/transition-curtain";

export default function BrandBiblePage() {
    const [result, setResult] = useState<BrandResultType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastInput, setLastInput] = useState<BrandInput | null>(null);

    const handleGenerate = async (data: BrandInput) => {
        setIsLoading(true);
        setLastInput(data);
        try {
            const response = await fetch("/api/generate-brand", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No reader available");

            const decoder = new TextDecoder();
            let resultText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                resultText += decoder.decode(value, { stream: true });
            }

            // Clean up any markdown code blocks if present (safeguard)
            if (resultText.includes("```json")) {
                resultText = resultText.split("```json")[1].split("```")[0].trim();
            } else if (resultText.includes("```")) {
                resultText = resultText.split("```")[1].split("```")[0].trim();
            }

            const generatedBrand = JSON.parse(resultText) as BrandResultType;
            setResult({
                ...generatedBrand,
                businessName: data.businessName,
                description: data.description
            });
            toast.success("Brand Identity Generated Successfully!");
        } catch (error) {
            console.error("Failed to generate brand:", error);
            toast.error("Failed to generate brand. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegenerate = () => {
        if (lastInput) {
            handleGenerate(lastInput);
        }
    };

    const handleReset = () => {
        setResult(null);
        setLastInput(null);
    };

    return (
        <div className="container mx-auto max-w-7xl pt-16 px-6 flex-grow relative">
            <ToastContainer position="bottom-right" theme="dark" />

            <TransitionCurtain isLoading={isLoading} />

            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                    Brand Bible Generator
                </h1>
                <p className="text-lg text-default-500 max-w-2xl mx-auto">
                    Create a comprehensive brand identity for your business in seconds using AI.
                </p>
            </div>

            <div className="mt-8">
                {result ? (
                    <BrandResult
                        result={result}
                        onReset={handleReset}
                        onRegenerate={handleRegenerate}
                    />
                ) : (
                    <BrandForm onSubmit={handleGenerate} isLoading={isLoading} />
                )}
            </div>
        </div>
    );
}
