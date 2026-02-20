"use client";

import { useRef } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Link } from "@nextui-org/link";
import { Chip } from "@nextui-org/chip";
import { Tabs, Tab } from "@nextui-org/tabs"; // Assuming NextUI tabs exist
import { BrandResult as BrandResultType } from "@/types/brand";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // Ensure this is imported correctly
import { DownloadIcon, Quote, Target, Users, Palette, BookOpen, ShieldAlert, Sparkles } from "lucide-react";

interface BrandResultProps {
    result: BrandResultType;
    onReset: () => void;
}

export function BrandResult({ result, onReset }: BrandResultProps) {
    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let yPos = 20;

        const checkPageBreak = (height: number) => {
            if (yPos + height > pageHeight - 20) {
                doc.addPage();
                yPos = 20;
            }
        };

        const addSectionTitle = (title: string) => {
            checkPageBreak(15);
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text(title, 14, yPos);
            yPos += 10;
        };

        const addText = (text: string, fontSize = 11, color = [60, 60, 60]) => {
            doc.setFontSize(fontSize);
            // @ts-ignore
            doc.setTextColor(...color);
            const splitText = doc.splitTextToSize(text, pageWidth - 28);
            checkPageBreak(splitText.length * 5 + 5);
            doc.text(splitText, 14, yPos);
            yPos += splitText.length * 5 + 5;
        };

        // 1. Header
        doc.setFontSize(24);
        doc.setTextColor(40, 40, 40);
        const title = result.businessName || "Brand Bible";
        doc.text(title, pageWidth / 2, yPos, { align: "center" });
        yPos += 10;

        if (result.tagline) {
            doc.setFontSize(14);
            doc.setTextColor(100, 100, 100);
            doc.text(`"${result.tagline}"`, pageWidth / 2, yPos, { align: "center" });
            yPos += 15;
        }

        // 2. Positioning & Identity
        addSectionTitle("Brand Identity & Strategy");
        addText(`Positioning: ${result.positioning}`);
        addText(`Archetype: ${result.audienceAnalysis.brandArchetype}`);
        addText(`Customer Promise: ${result.audienceAnalysis.customerPromise}`);

        yPos += 5;
        addText("Key Differentiators (UVP):");
        result.uvp.forEach(point => {
            addText(`• ${point}`);
        });

        yPos += 5;
        addText("What We Never Do:");
        addText(result.audienceAnalysis.whatWeNeverDo);


        // 3. Brand Story
        addSectionTitle("Brand Story");
        addText(result.brandStory.long);

        // 4. Visual Identity
        addSectionTitle("Visual Identity");
        addText(`Theme Concept: ${result.themeDescription}`);
        yPos += 5;
        addText(`Icon Style: ${result.iconStyle}`);
        yPos += 5;

        // Colors
        addSectionTitle("Color Palette");
        const colors = [
            ["Primary", result.colorPalette.primary],
            ["Secondary", result.colorPalette.secondary],
            ["Background", result.colorPalette.background],
            ["Text", result.colorPalette.text],
            ["Tertiary", result.colorPalette.tertiary],
        ];

        autoTable(doc, {
            startY: yPos,
            head: [["Role", "Hex Code", "Preview"]],
            body: colors.map(c => [c[0], c[1], ""]),
            didParseCell: function (data) {
                if (data.column.index === 2 && data.section === 'body') {
                    // Fix existing lint error by safely accessing raw data
                    const raw = data.row.raw as string[];
                    const hex = raw[1];
                    data.cell.styles.fillColor = hex;
                }
            }
        });

        // @ts-ignore
        yPos = doc.lastAutoTable.finalY + 15;

        // Typography
        checkPageBreak(60);
        addSectionTitle("Typography");
        const typographyData = [
            ["Header Font", result.typography.header],
            ["Body Font", result.typography.body],
            ["Sizing Scale", result.typography.sizing],
        ];

        autoTable(doc, {
            startY: yPos,
            body: typographyData,
            theme: 'grid', // Use string literal to avoid type issues if enum not imported
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
        });

        // @ts-ignore
        yPos = doc.lastAutoTable.finalY + 15;


        // 5. Audience Analysis
        addSectionTitle("Target Audience");
        addText(`Competitor Context: ${result.audienceAnalysis.competitorContext}`);
        yPos += 10;

        result.audienceAnalysis.personas.forEach((persona, index) => {
            checkPageBreak(50);
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Persona ${index + 1}: ${persona.name}`, 14, yPos);
            yPos += 7;

            addText(`Demographics: ${persona.demographics}`);
            addText(`Care About: ${persona.whatTheyCareAbout}`);
            yPos += 2;
        });

        // Footer
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            // @ts-ignore
            doc.setTextColor(150, 150, 150);
            doc.text("Generated by BNFN AI", pageWidth / 2, pageHeight - 10, { align: "center" });
        }

        doc.save(`${(result.businessName || "brand").toLowerCase().replace(/\s+/g, '-')}-brand-bible.pdf`);
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto animate-fade-in pb-10">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <Chip color="secondary" variant="flat" className="uppercase font-bold tracking-widest text-xs">
                    {result.audienceAnalysis.brandArchetype} Archetype
                </Chip>
                <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    {result.businessName || "Your Brand"}
                </h1>
                <p className="text-xl md:text-2xl text-default-500 font-light italic">
                    "{result.tagline}"
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
                </div>
            </div>

            {/* Audience Analysis (Full Width) */}
            <h3 className="text-2xl font-bold mt-8 mb-4 border-b pb-2">Target Audience & Market</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Competitor Context */}
                <Card className="md:col-span-3 bg-default-100/50">
                    <CardBody>
                        <h4 className="font-bold flex items-center gap-2 mb-2"><Target size={18} /> Market Context</h4>
                        <p className="text-default-600">{result.audienceAnalysis.competitorContext}</p>
                    </CardBody>
                </Card>

                {/* Personas */}
                {result.audienceAnalysis.personas.map((persona, i) => (
                    <Card key={i} className="border border-default-200 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-primary/5 border-b border-primary/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-large">{persona.name}</p>
                                    <p className="text-tiny text-default-500">{persona.demographics}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="gap-4">
                            <div>
                                <p className="text-tiny uppercase font-bold text-default-400">Goals & Motivations</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {persona.motivations.map(m => <Chip key={m} size="sm" variant="flat">{m}</Chip>)}
                                </div>
                            </div>
                            <div>
                                <p className="text-tiny uppercase font-bold text-default-400">Frustrations</p>
                                <ul className="list-disc list-inside text-small text-default-600 mt-1">
                                    {persona.painPoints.map(p => <li key={p}>{p}</li>)}
                                </ul>
                            </div>
                            <div className="bg-secondary/10 p-3 rounded-medium">
                                <p className="text-tiny uppercase font-bold text-secondary mb-1">Deepest Care</p>
                                <p className="text-small italic text-secondary-800 dark:text-secondary-400">"{persona.whatTheyCareAbout}"</p>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center mt-12 pb-20">
                <Button variant="flat" color="default" onPress={onReset} size="lg">
                    Create Another Brand
                </Button>
            </div>
        </div>
    );
}
