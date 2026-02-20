"use client";

import { useState } from "react";
import { BrandForm } from "@/components/brand-bible/brand-form";
import { BrandResult } from "@/components/brand-bible/brand-result";
import { generateBrand } from "@/actions/generate-brand";
import { BrandInput, BrandResult as BrandResultType } from "@/types/brand";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BrandBiblePage() {
    const [result, setResult] = useState<BrandResultType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastInput, setLastInput] = useState<BrandInput | null>(null);

    const handleGenerate = async (data: BrandInput) => {
        setIsLoading(true);
        setLastInput(data); // Store input for regeneration
        try {
            const generatedBrand = await generateBrand(data);
            setResult(generatedBrand);
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
        <div className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
            <ToastContainer position="bottom-right" theme="dark" />
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
