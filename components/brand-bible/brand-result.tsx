"use client";

import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Link } from "@nextui-org/link";
import { Chip } from "@nextui-org/chip";
import { Tabs, Tab } from "@nextui-org/tabs"; // Assuming NextUI tabs exist
import { BrandResult as BrandResultType } from "@/types/brand";
import { downloadBrandPdf } from "@/lib/brand/pdf-export";
import { useRouter } from "next/navigation";
import { DownloadIcon, Quote, Target, Users, Palette, BookOpen, ShieldAlert, Sparkles, Check as CheckIcon, RefreshCw, Home } from "lucide-react";

interface BrandResultProps {
    result: BrandResultType;
    onReset: () => void;
    onRegenerate: () => void;
}

export function BrandResult({ result, onReset, onRegenerate }: BrandResultProps) {
    const router = useRouter();
    const downloadPDF = () => downloadBrandPdf(result);

    return (
        <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto animate-fade-in pb-10">
            {/* Header Section */}
            <div className="relative">
                <Button
                    isIconOnly
                    variant="light"
                    className="absolute left-0 top-0 text-default-400 hover:text-primary md:hidden"
                    onPress={() => router.push('/')}
                >
                    <Home size={20} />
                </Button>
                <Button
                    variant="light"
                    className="absolute left-0 top-0 text-default-400 hover:text-primary hidden md:flex"
                    startContent={<Home size={18} />}
                    onPress={() => router.push('/')}
                >
                    Back to Home
                </Button>

                <div className="text-center space-y-4 pt-8 md:pt-0">
                    <Chip color="secondary" variant="flat" className="uppercase font-bold tracking-widest text-xs">
                        {result.audienceAnalysis.brandArchetype} Archetype
                    </Chip>
                    <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        {result.businessName || "Your Brand"}
                    </h1>
                    <p className="text-xl md:text-2xl text-default-500 font-light italic">
                        &quot;{result.tagline}&quot;
                    </p>
                    <div className="flex justify-center pt-4">
                        <Button
                            color="primary"
                            variant="shadow"
                            startContent={<DownloadIcon size={18} />}
                            onPress={downloadPDF}
                        >
                            Download Full Brand Bible (PDF)
                        </Button>
                    </div>
                </div>
            </div>

            <Divider className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Left Column: Strategy & Core (4 cols) */}
                <div className="md:col-span-4 space-y-6">
                    {/* Positioning */}
                    <Card className="border-l-4 border-l-primary shadow-sm">
                        <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                            <h4 className="font-bold text-large flex items-center gap-2">
                                <Target size={20} className="text-primary" /> Positioning
                            </h4>
                        </CardHeader>
                        <CardBody className="overflow-visible py-4">
                            <p className="text-default-500 text-small">
                                {result.positioning}
                            </p>
                        </CardBody>
                    </Card>

                    {/* UVP */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                            <h4 className="font-bold text-large flex items-center gap-2">
                                <Sparkles size={20} className="text-warning" /> Key Differentiators
                            </h4>
                        </CardHeader>
                        <CardBody className="overflow-visible py-4">
                            <ul className="list-disc pl-4 space-y-2">
                                {result.uvp.map((u, i) => (
                                    <li key={i} className="text-small text-default-600">{u}</li>
                                ))}
                            </ul>
                        </CardBody>
                    </Card>

                    {/* Promise & Never Do */}
                    <Card className="shadow-sm bg-default-50">
                        <CardBody className="gap-4">
                            <div>
                                <p className="font-bold text-small uppercase text-default-400 mb-1">Our Promise</p>
                                <p className="text-small font-serif italic text-default-700">{result.audienceAnalysis.customerPromise}</p>
                            </div>
                            <Divider />
                            <div>
                                <p className="font-bold text-small uppercase text-danger-400 mb-1 flex items-center gap-1">
                                    <ShieldAlert size={14} /> We Never Do
                                </p>
                                <p className="text-small text-default-600">{result.audienceAnalysis.whatWeNeverDo}</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column: Story & Visuals (8 cols) */}
                <div className="md:col-span-8 space-y-6">

                    {/* Brand Story Tabs */}
                    <Card className="shadow-md">
                        <CardBody className="p-6">
                            <Tabs
                                aria-label="Brand Story"
                                classNames={{
                                    tabContent: "group-data-[selected=true]:text-primary-foreground text-white"
                                }}
                            >
                                <Tab key="short" title="Short Story">
                                    <div className="pt-4">
                                        <p className="text-default-600 leading-relaxed text-lg">
                                            {result.brandStory.short}
                                        </p>
                                    </div>
                                </Tab>
                                <Tab key="long" title="Full Narrative">
                                    <div className="pt-4">
                                        <p className="text-default-600 leading-relaxed whitespace-pre-wrap">
                                            {result.brandStory.long}
                                        </p>
                                    </div>
                                </Tab>
                            </Tabs>
                        </CardBody>
                    </Card>

                    {/* Visual Identity Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Theme */}
                        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-none">
                            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                                <h4 className="font-bold text-large flex items-center gap-2">
                                    <Palette size={20} /> Theme: {result.themeDescription.split('.')[0]}
                                </h4>
                            </CardHeader>
                            <CardBody className="overflow-visible py-4">
                                <p className="text-tiny text-default-600">{result.themeDescription}</p>
                            </CardBody>
                        </Card>
                        {/* Icon Style */}
                        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-none">
                            <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                                <h4 className="font-bold text-large flex items-center gap-2">
                                    <Sparkles size={20} /> Iconography
                                </h4>
                            </CardHeader>
                            <CardBody className="overflow-visible py-4">
                                <p className="text-tiny text-default-600">{result.iconStyle}</p>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Colors */}
                    <Card>
                        <CardHeader><h4 className="font-bold">Color Palette</h4></CardHeader>
                        <Divider />
                        <CardBody>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                {Object.entries(result.colorPalette).map(([key, value]) => (
                                    <div key={key} className="flex flex-col gap-2 group cursor-pointer">
                                        <div
                                            className="w-full aspect-square rounded-xl shadow-sm border border-default-200 transition-transform group-hover:scale-105"
                                            style={{ backgroundColor: value }}
                                        />
                                        <div className="text-center">
                                            <p className="text-tiny uppercase font-bold text-default-400">{key}</p>
                                            <p className="text-small font-mono">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Typography */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                            <h4 className="font-bold text-large flex items-center gap-2">
                                <BookOpen size={20} /> Typography
                            </h4>
                        </CardHeader>
                        <CardBody className="py-4 gap-6">
                            {/* Font Loader - Attempt to load fonts from Google */}
                            <style>{`
                                @import url('https://fonts.googleapis.com/css2?family=${result.typography.header.replace(/\s+/g, '+')}&family=${result.typography.body.replace(/\s+/g, '+')}&display=swap');
                            `}</style>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-tiny uppercase font-bold text-default-400 mb-2">Header Font</p>
                                    <div className="p-4 bg-default-50 rounded-lg border border-default-100">
                                        <p className="text-xl" style={{ fontFamily: result.typography.header }}>
                                            {result.typography.header}
                                        </p>
                                        <p className="text-3xl mt-2" style={{ fontFamily: result.typography.header }}>
                                            The quick brown fox jumps over the lazy dog. 0123456789
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-tiny uppercase font-bold text-default-400 mb-2">Body Font</p>
                                    <div className="p-4 bg-default-50 rounded-lg border border-default-100">
                                        <p className="text-xl" style={{ fontFamily: result.typography.body }}>
                                            {result.typography.body}
                                        </p>
                                        <p className="text-base mt-2 opacity-80" style={{ fontFamily: result.typography.body }}>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-tiny uppercase font-bold text-default-400 mb-1">Scale & Usage</p>
                                <p className="text-small text-default-600">{result.typography.sizing}</p>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Voice & Tone Section */}
            <h3 className="text-2xl font-bold mt-12 mb-6 border-b pb-2">Voice & Tone Playbook</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Voice Attributes */}
                <Card className="md:col-span-2 shadow-sm">
                    <CardHeader className="pb-2">
                        <h4 className="font-bold text-large flex items-center gap-2">
                            <Quote size={20} className="text-secondary" /> Voice Attributes
                        </h4>
                    </CardHeader>
                    <CardBody>
                        <div className="flex flex-wrap gap-2">
                            {result.voiceAndTone.attributes.map((attr, i) => (
                                <Chip key={i} color="secondary" variant="flat" size="lg">{attr}</Chip>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Contextual Tone */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <h4 className="font-bold text-large">Contextual Tone</h4>
                    </CardHeader>
                    <Divider />
                    <CardBody className="gap-4">
                        {Object.entries(result.voiceAndTone.contextualTone).map(([ctx, tone]) => (
                            <div key={ctx}>
                                <p className="text-tiny uppercase font-bold text-default-400 mb-1">{ctx}</p>
                                <p className="text-small text-default-700">{tone}</p>
                            </div>
                        ))}
                    </CardBody>
                </Card>

                {/* Do's and Don'ts */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                        <h4 className="font-bold text-large">Do&apos;s & Don&apos;ts</h4>
                    </CardHeader>
                    <Divider />
                    <CardBody className="gap-3">
                        {result.voiceAndTone.doAndDonts.map((item, i) => (
                            <div key={i} className="grid grid-cols-2 gap-4 text-small">
                                <div className="text-success-600 flex gap-2">
                                    <CheckIcon size={16} className="shrink-0 mt-0.5" /> <span>{item.do}</span>
                                </div>
                                <div className="text-danger-600 flex gap-2">
                                    <div className="shrink-0 mt-0.5"><ShieldAlert size={16} /></div> <span>{item.dont}</span>
                                </div>
                            </div>
                        ))}
                    </CardBody>
                </Card>

                {/* Sample Copy */}
                <Card className="md:col-span-2 shadow-md bg-default-50">
                    <CardHeader className="pb-2">
                        <h4 className="font-bold text-large flex items-center gap-2">
                            <BookOpen size={20} /> Sample Copy
                        </h4>
                    </CardHeader>
                    <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-tiny uppercase font-bold text-default-400 mb-1">Hero Headline</p>
                            <p className="text-large font-bold text-default-900 font-serif">&quot;{result.voiceAndTone.sampleCopy.heroHeadline}&quot;</p>
                        </div>
                        <div>
                            <p className="text-tiny uppercase font-bold text-default-400 mb-1">Call to Action</p>
                            <Button size="sm" color="primary" className="font-bold shadow-md">{result.voiceAndTone.sampleCopy.cta}</Button>
                        </div>
                        <div>
                            <p className="text-tiny uppercase font-bold text-default-400 mb-1">Error Message</p>
                            <div className="bg-danger-50 text-danger-600 p-3 rounded-md text-small border border-danger-100">
                                {result.voiceAndTone.sampleCopy.errorMessage}
                            </div>
                        </div>
                        <div>
                            <p className="text-tiny uppercase font-bold text-default-400 mb-1">Email Greeting</p>
                            <p className="text-small text-default-600 italic">&quot;{result.voiceAndTone.sampleCopy.emailGreeting}&quot;</p>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Logo Guidelines Section */}
            <h3 className="text-2xl font-bold mt-12 mb-6 border-b pb-2">Logo Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Variants */}
                <Card className="md:col-span-3">
                    <CardHeader><h4 className="font-bold text-large">Logo Variants</h4></CardHeader>
                    <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-6 bg-default-100 rounded-lg flex flex-col items-center justify-center text-center h-40">
                            <div className="mb-2 font-bold text-2xl text-default-800 tracking-tighter">{result.businessName}</div>
                            <p className="text-tiny text-default-400 mt-auto uppercase font-bold">Horizontal</p>
                            <p className="text-tiny text-default-500">{result.logoGuidelines.variants.horizontal}</p>
                        </div>
                        <div className="p-6 bg-default-100 rounded-lg flex flex-col items-center justify-center text-center h-40">
                            <div className="flex flex-col items-center mb-2">
                                <div className="w-8 h-8 bg-default-800 rounded-full mb-1"></div>
                                <div className="font-bold text-lg text-default-800">{result.businessName}</div>
                            </div>
                            <p className="text-tiny text-default-400 mt-auto uppercase font-bold">Stacked</p>
                            <p className="text-tiny text-default-500">{result.logoGuidelines.variants.stacked}</p>
                        </div>
                        <div className="p-6 bg-default-100 rounded-lg flex flex-col items-center justify-center text-center h-40">
                            <div className="w-12 h-12 bg-primary rounded-xl mb-2 flex items-center justify-center text-white font-bold text-xl">
                                {result.businessName?.charAt(0) || "B"}
                            </div>
                            <p className="text-tiny text-default-400 mt-auto uppercase font-bold">Icon Only</p>
                            <p className="text-tiny text-default-500">{result.logoGuidelines.variants.iconOnly}</p>
                        </div>
                    </CardBody>
                </Card>

                {/* Rules */}
                <Card className="md:col-span-1 shadow-sm border border-success-100 bg-success-50/50">
                    <CardHeader className="pb-0">
                        <h4 className="font-bold text-large flex items-center gap-2">
                            <CheckIcon size={18} className="text-success" /> Clear Space & Size
                        </h4>
                    </CardHeader>
                    <CardBody className="gap-4">
                        <div>
                            <p className="text-tiny uppercase font-bold text-default-500">Clear Space</p>
                            <p className="text-small font-medium">{result.logoGuidelines.clearSpaceRules}</p>
                        </div>
                        <div>
                            <p className="text-tiny uppercase font-bold text-default-500">Minimum Size</p>
                            <p className="text-small font-medium">{result.logoGuidelines.minimumSize}</p>
                        </div>
                    </CardBody>
                </Card>

                {/* Incorrect Usage */}
                <Card className="md:col-span-2 shadow-sm border border-danger-100 bg-danger-50/50">
                    <CardHeader className="pb-0">
                        <h4 className="font-bold text-large flex items-center gap-2">
                            <ShieldAlert size={18} className="text-danger" /> Incorrect Usage
                        </h4>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {result.logoGuidelines.incorrectUsage.map((usage, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
                                    <p className="text-small text-default-700">{usage}</p>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            </div>


            {/* Landing Page Preview Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <Button
                    size="lg"
                    color="secondary"
                    variant="shadow"
                    className="font-bold animate-pulse shadow-2xl shadow-secondary/50"
                    onPress={() => window.open('', '_blank')?.document.write(`
                        <html>
                            <head>
                                <title>${result.businessName} - Landing Page Preview</title>
                                <script src="https://cdn.tailwindcss.com"></script>
                                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
                                <style>
                                    body { font-family: 'Inter', sans-serif; }
                                </style>
                            </head>
                            <body class="antialiased">
                                <div class="min-h-screen flex flex-col" style="background-color: ${result.colorPalette.background}; color: ${result.colorPalette.text}">
                                    <!-- Navbar -->
                                    <nav class="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                                        <div class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[${result.colorPalette.primary}] to-[${result.colorPalette.secondary}]" style="background-image: linear-gradient(to right, ${result.colorPalette.primary}, ${result.colorPalette.secondary})">
                                            ${result.businessName}
                                        </div>
                                        <button class="px-6 py-2 rounded-full font-bold transition-transform hover:scale-105" style="background-color: ${result.colorPalette.primary}; color: white">
                                            Get Started
                                        </button>
                                    </nav>

                                    <!-- Hero -->
                                    <main class="flex-grow flex items-center justify-center p-6">
                                        <div class="text-center max-w-4xl mx-auto space-y-8">
                                            <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                                                ${result.landingPagePreview.heroTitle}
                                            </h1>
                                            <p class="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto" style="color: ${result.colorPalette.text}">
                                                ${result.landingPagePreview.heroSubtitle}
                                            </p>
                                            <div class="flex gap-4 justify-center pt-4">
                                                <button class="px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-transform hover:scale-105" style="background-color: ${result.colorPalette.secondary}; color: white">
                                                    ${result.landingPagePreview.ctaText}
                                                </button>
                                                <button class="px-8 py-4 rounded-full text-lg font-bold border-2 transition-colors hover:bg-opacity-10" style="border-color: ${result.colorPalette.primary}; color: ${result.colorPalette.primary}">
                                                    Learn More
                                                </button>
                                            </div>
                                        </div>
                                    </main>

                                    <!-- Feature -->
                                    <section class="py-20 px-6" style="background-color: ${result.colorPalette.tertiary}20">
                                        <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                                            <div class="aspect-video rounded-2xl shadow-xl bg-gradient-to-br from-[${result.colorPalette.primary}] to-[${result.colorPalette.secondary}] opacity-80" style="background-image: linear-gradient(to bottom right, ${result.colorPalette.primary}, ${result.colorPalette.secondary})"></div>
                                            <div class="space-y-6">
                                                <h2 class="text-4xl font-bold" style="color: ${result.colorPalette.primary}">${result.landingPagePreview.featureTitle}</h2>
                                                <p class="text-lg opacity-80 leading-relaxed">${result.landingPagePreview.featureDescription}</p>
                                            </div>
                                        </div>
                                    </section>

                                    <!-- Footer -->
                                    <footer class="py-12 text-center opacity-60 text-sm">
                                        <p>&copy; ${new Date().getFullYear()} ${result.businessName}. All rights reserved.</p>
                                    </footer>
                                </div>
                            </body>
                        </html>
                    `)}
                    startContent={<Sparkles size={20} className="animate-spin-slow" />}
                >
                    Preview Live Landing Page
                </Button>
            </div>


            <div className="flex justify-center mt-12 pb-20 gap-4">
                <Button variant="flat" color="default" onPress={onReset} size="lg">
                    Create Another Brand
                </Button>
                <Button
                    color="secondary"
                    variant="shadow"
                    onPress={onRegenerate}
                    size="lg"
                    startContent={<RefreshCw size={18} />}
                >
                    Regenerate Brand
                </Button>
            </div>
        </div>
    );
}

