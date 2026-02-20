"use client";

import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { BrandInput, BrandMood, ThemeStyle } from "@/types/brand";
import { Chip } from "@nextui-org/chip";
import { CheckIcon, Sparkles, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const INDUSTRIES = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Food & Beverage",
    "Real Estate",
    "Entertainment",
    "Fashion",
    "Automotive",
    "Travel",
    "Other",
];

const MOODS: BrandMood[] = [
    "Minimalist",
    "Bold",
    "Playful",
    "Sophisticated",
    "Eco-friendly",
    "Luxury",
    "Tech-focused",
    "Retro",
    "Corporate",
    "Artistic",
];

const THEMES: ThemeStyle[] = [
    "None",
    "Glassmorphism",
    "Claymorphism",
    "Neomorphism",
    "Flat Design",
    "Material Design",
    "Brutalism",
    "Cyberpunk",
];

interface BrandFormProps {
    onSubmit: (data: BrandInput) => void;
    isLoading: boolean;
}

export function BrandForm({ onSubmit, isLoading }: BrandFormProps) {
    const [formData, setFormData] = useState<BrandInput>({
        businessName: "",
        description: "",
        industry: "",
        mood: [],
        themeStyle: "None",
    });

    const [customIndustry, setCustomIndustry] = useState("");
    const [seconds, setSeconds] = useState(0);

    // Timer effect
    useState(() => {
        let interval: NodeJS.Timeout;
        if (isLoading) {
            const start = Date.now();
            interval = setInterval(() => {
                setSeconds(Math.floor((Date.now() - start) / 1000));
            }, 1000);
        } else {
            setSeconds(0);
        }
        return () => clearInterval(interval);
    }); // Needs to depend on isLoading, but useState initializer runs once. Switching to useEffect.

    // Correct implementation with useEffect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading) {
            setSeconds(0);
            const start = Date.now();
            interval = setInterval(() => {
                setSeconds(Math.floor((Date.now() - start) / 1000));
            }, 1000);
        } else {
            setSeconds(0);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleMoodToggle = (mood: BrandMood) => {
        setFormData((prev) => {
            const currentMoods = prev.mood;
            if (currentMoods.includes(mood)) {
                return { ...prev, mood: currentMoods.filter((m) => m !== mood) };
            }
            if (currentMoods.length >= 2) {
                return prev; // Max 2 selected
            }
            return { ...prev, mood: [...currentMoods, mood] };
        });
    };

    const handleChange = (key: keyof BrandInput, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!formData.industry || formData.mood.length === 0) {
            return;
        }

        const finalData = {
            ...formData,
            industry: formData.industry === "Other" ? customIndustry : formData.industry
        };

        if (finalData.industry === "Other" && !customIndustry) return; // Validate custom input

        onSubmit(finalData);
    };

    return (
        <Card className="max-w-4xl mx-auto shadow-2xl border-none bg-content1/50 backdrop-blur-lg">
            <CardHeader className="flex flex-col gap-2 items-center text-center pt-8 pb-4 relative">
                <Button
                    isIconOnly
                    variant="light"
                    className="absolute left-4 top-4 text-default-400 hover:text-primary"
                    onPress={() => window.location.href = '/'}
                >
                    <Home size={20} />
                </Button>
                <div className="p-3 bg-primary/10 rounded-full mb-2 text-primary">
                    <Sparkles size={32} />
                </div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Create Your Brand Identity
                </h2>
                <p className="text-default-500 max-w-md">
                    Tell us about your business to generate a unique brand bible.
                </p>
            </CardHeader>
            <CardBody className="px-8 py-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            isRequired
                            label="Business Name"
                            labelPlacement="outside"
                            placeholder="e.g. Acme Corp"
                            value={formData.businessName}
                            onValueChange={(v) => handleChange("businessName", v)}
                            variant="bordered"
                            classNames={{
                                inputWrapper: "bg-default-50 hover:bg-default-100 transition-colors",
                            }}
                        />

                        <Textarea
                            isRequired
                            label="Business Description"
                            labelPlacement="outside"
                            placeholder="Describe what your business does..."
                            value={formData.description}
                            onValueChange={(v) => handleChange("description", v)}
                            variant="bordered"
                            minRows={1}
                            classNames={{
                                inputWrapper: "bg-default-50 hover:bg-default-100 transition-colors",
                            }}
                        />
                    </div>

                    {/* Industry Selection */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="text-medium font-semibold text-default-700">Industry <span className="text-danger">*</span></label>
                            <span className="text-tiny text-default-400">Select one</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {INDUSTRIES.map((industry) => {
                                const isSelected = formData.industry === industry;
                                return (
                                    <Chip
                                        key={industry}
                                        onClick={() => handleChange("industry", industry)}
                                        variant={isSelected ? "solid" : "flat"}
                                        color={isSelected ? "primary" : "default"}
                                        classNames={{
                                            base: cn(
                                                "cursor-pointer transition-all hover:scale-105 active:scale-95 px-2 py-4 h-auto",
                                                isSelected ? "shadow-md shadow-primary/30" : "hover:bg-default-200 border border-transparent"
                                            ),
                                            content: "text-small font-medium"
                                        }}
                                        startContent={isSelected ? <CheckIcon size={14} className="ml-1" /> : undefined}
                                    >
                                        {industry}
                                    </Chip>
                                );
                            })}
                        </div>

                        {formData.industry === "Other" && (
                            <div className="pt-2 animate-fade-in">
                                <Input
                                    label="Specify Industry"
                                    placeholder="e.g. Space Tourism"
                                    labelPlacement="outside"
                                    value={customIndustry}
                                    onValueChange={setCustomIndustry}
                                    variant="flat"
                                    color="primary"
                                    isRequired
                                />
                            </div>
                        )}
                    </div>

                    {/* Mood Selection */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="text-medium font-semibold text-default-700">Brand Mood <span className="text-danger">*</span></label>
                            <span className={cn("text-tiny", formData.mood.length >= 2 ? "text-warning" : "text-default-400")}>
                                {formData.mood.length}/2 selected
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {MOODS.map((mood) => {
                                const isSelected = formData.mood.includes(mood);
                                return (
                                    <Chip
                                        key={mood}
                                        onClick={() => handleMoodToggle(mood)}
                                        variant={isSelected ? "shadow" : "flat"}
                                        color={isSelected ? "secondary" : "default"}
                                        classNames={{
                                            base: cn(
                                                "cursor-pointer transition-all hover:scale-105 active:scale-95 px-2 py-4 h-auto",
                                                isSelected ? "shadow-md shadow-secondary/30 ring-2 ring-secondary ring-offset-2 ring-offset-background" : "hover:bg-default-200 border border-transparent"
                                            ),
                                            content: "text-small font-medium"
                                        }}
                                        startContent={isSelected ? <CheckIcon size={14} className="ml-1" /> : undefined}
                                    >
                                        {mood}
                                    </Chip>
                                );
                            })}
                        </div>
                    </div>

                    {/* Theme Style Selection */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="text-medium font-semibold text-default-700">Theme Style <span className="text-danger">*</span></label>
                            <span className="text-tiny text-default-400">Select one</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {THEMES.map((theme) => {
                                const isSelected = formData.themeStyle === theme;
                                return (
                                    <Chip
                                        key={theme}
                                        onClick={() => handleChange("themeStyle", theme)}
                                        variant={isSelected ? "solid" : "bordered"}
                                        color={isSelected ? "success" : "default"}
                                        classNames={{
                                            base: cn(
                                                "cursor-pointer transition-all hover:scale-105 active:scale-95 px-3 py-5 h-auto",
                                                isSelected ? "shadow-md shadow-success/30" : "hover:border-default-400"
                                            ),
                                            content: "text-small font-semibold"
                                        }}
                                        startContent={isSelected ? <CheckIcon size={14} className="ml-1" /> : undefined}
                                    >
                                        {theme}
                                    </Chip>
                                );
                            })}
                        </div>
                    </div>

                    <Button
                        color="primary"
                        type="submit"
                        isLoading={isLoading}
                        className="w-full mt-6 font-bold text-lg shadow-xl shadow-primary/20"
                        size="lg"
                        isDisabled={!formData.businessName || !formData.description || !formData.industry || formData.mood.length === 0 || (formData.industry === "Other" && !customIndustry)}
                    >
                        {isLoading ? `Generating Brand Magic... (${seconds}s) (estimated 45s)` : "Generate Brand Bible"}
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
}
