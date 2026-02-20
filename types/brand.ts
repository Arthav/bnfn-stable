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
    model: "openrouter" | "aihubmix";
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
    // New additions (Logo, Voice, Landing Page)
    logoGuidelines: {
        variants: {
            horizontal: string;
            stacked: string;
            iconOnly: string;
        };
        clearSpaceRules: string;
        minimumSize: string;
        incorrectUsage: string[];
    };
    voiceAndTone: {
        attributes: string[]; // 3-5 traits
        contextualTone: {
            marketing: string;
            support: string;
            academic: string;
            social: string;
        };
        doAndDonts: Array<{ do: string; dont: string }>;
        sampleCopy: {
            heroHeadline: string;
            aboutUs: string;
            cta: string;
            errorMessage: string;
            emailGreeting: string;
        };
    };
    landingPagePreview: {
        heroTitle: string;
        heroSubtitle: string;
        ctaText: string;
        featureTitle: string;
        featureDescription: string;
    };
}
