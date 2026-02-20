export type BrandMood =
    | "Minimalist"
    | "Bold"
    | "Playful"
    | "Sophisticated"
    | "Eco-friendly"
    | "Luxury"
    | "Tech-focused"
    | "Retro"
    | "Corporate"
    | "Artistic";

export type ThemeStyle =
    | "None"
    | "Glassmorphism"
    | "Claymorphism"
    | "Neomorphism"
    | "Flat Design"
    | "Material Design"
    | "Brutalism"
    | "Cyberpunk";

export interface BrandInput {
    businessName: string;
    description: string;
    industry: string;
    mood: BrandMood[];
    themeStyle: ThemeStyle;
}

export interface ColorPalette {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    tertiary: string;
}

export interface Typography {
    header: string;
    body: string;
    sizing: string;
}

export interface BrandResult {
    colorPalette: ColorPalette;
    typography: Typography;
    themeDescription: string;
    reasoning: string;
    businessName?: string;
    description?: string;
    // New additions
    tagline: string;
    positioning: string;
    uvp: string[];
    brandStory: {
        short: string;
        long: string;
    };
    iconStyle: string;
    audienceAnalysis: {
        personas: Array<{
            name: string;
            demographics: string;
            painPoints: string[];
            motivations: string[];
            whatTheyCareAbout: string;
        }>;
        competitorContext: string;
        brandArchetype: string;
        customerPromise: string;
        whatWeNeverDo: string;
    };
}
