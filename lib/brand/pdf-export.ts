import { BrandResult } from "@/types/brand";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

type AutoTableDoc = jsPDF & {
  lastAutoTable?: {
    finalY: number;
  };
};

export function downloadBrandPdf(result: BrandResult) {
  const doc = new jsPDF() as AutoTableDoc;
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

  const addText = (
    text: string,
    fontSize = 11,
    color: [number, number, number] = [60, 60, 60]
  ) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    const splitText = doc.splitTextToSize(text, pageWidth - 28);
    checkPageBreak(splitText.length * 5 + 5);
    doc.text(splitText, 14, yPos);
    yPos += splitText.length * 5 + 5;
  };

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

  addSectionTitle("Brand Identity & Strategy");
  addText(`Positioning: ${result.positioning}`);
  addText(`Archetype: ${result.audienceAnalysis.brandArchetype}`);
  addText(`Customer Promise: ${result.audienceAnalysis.customerPromise}`);

  yPos += 5;
  addText("Key Differentiators (UVP):");
  result.uvp.forEach((point) => addText(`- ${point}`));

  yPos += 5;
  addText("What We Never Do:");
  addText(result.audienceAnalysis.whatWeNeverDo);

  addSectionTitle("Brand Story");
  addText(result.brandStory.long);

  addSectionTitle("Visual Identity");
  addText(`Theme Concept: ${result.themeDescription}`);
  yPos += 5;
  addText(`Icon Style: ${result.iconStyle}`);
  yPos += 5;

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
    body: colors.map((color) => [color[0], color[1], ""]),
    didParseCell(data) {
      if (data.column.index === 2 && data.section === "body") {
        const raw = data.row.raw as string[];
        data.cell.styles.fillColor = raw[1];
      }
    },
  });
  yPos = (doc.lastAutoTable?.finalY ?? yPos) + 15;

  checkPageBreak(60);
  addSectionTitle("Typography");
  autoTable(doc, {
    startY: yPos,
    body: [
      ["Header Font", result.typography.header],
      ["Body Font", result.typography.body],
      ["Sizing Scale", result.typography.sizing],
    ],
    theme: "grid",
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } },
  });
  yPos = (doc.lastAutoTable?.finalY ?? yPos) + 15;

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
    yPos += 5;
  });

  addSectionTitle("Voice & Tone Playbook");
  addText(`Attributes: ${result.voiceAndTone.attributes.join(", ")}`);
  yPos += 5;

  doc.setFontSize(10);
  Object.entries(result.voiceAndTone.contextualTone).forEach(([context, tone]) => {
    checkPageBreak(25);
    doc.setFont("helvetica", "bold");
    doc.text(`${context.charAt(0).toUpperCase() + context.slice(1)}:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    const splitTone = doc.splitTextToSize(tone, pageWidth - 40);
    doc.text(splitTone, 40, yPos);
    yPos += splitTone.length * 4 + 4;
  });

  checkPageBreak(30);
  addText("Do's & Don'ts:");
  result.voiceAndTone.doAndDonts.forEach((item) => {
    checkPageBreak(15);
    doc.setTextColor(34, 197, 94);
    doc.text(`DO: ${item.do}`, 14, yPos);
    yPos += 5;
    doc.setTextColor(239, 68, 68);
    doc.text(`DON'T: ${item.dont}`, 14, yPos);
    yPos += 7;
  });
  doc.setTextColor(60, 60, 60);

  addSectionTitle("Logo Guidelines");
  addText("Variants: Horizontal, Stacked, Icon-Only");
  addText(`Clear Space: ${result.logoGuidelines.clearSpaceRules}`);
  addText(`Min Size: ${result.logoGuidelines.minimumSize}`);
  yPos += 5;
  addText("Incorrect Usage:");
  result.logoGuidelines.incorrectUsage.forEach((usage) => addText(`- ${usage}`));

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by BNFN AI", pageWidth / 2, pageHeight - 10, {
      align: "center",
    });
  }

  doc.save(
    `${(result.businessName || "brand").toLowerCase().replace(/\s+/g, "-")}-brand-bible.pdf`
  );
}
