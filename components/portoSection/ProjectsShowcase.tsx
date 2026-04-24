"use client";

import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    BarChart3,
    Bot,
    Bug,
    Building2,
    Calculator,
    CheckCircle2,
    Code2,
    Coins,
    Database,
    ExternalLink,
    Film,
    Gift,
    Github,
    Grid2X2,
    Home,
    LayoutDashboard,
    Lock,
    MapPin,
    MessageCircle,
    Play,
    RadioTower,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    Trophy,
    UserRound,
    Wand2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const themes = {
    violet: {
        frame: "border-violet-400/50 shadow-[0_0_42px_rgba(139,92,246,0.18)]",
        bg: "from-violet-950/85 via-slate-950 to-black",
        glow: "bg-violet-500/25",
        accent: "text-violet-300",
        badge: "border-violet-300/35 bg-violet-500/15 text-violet-200",
        chip: "border-violet-300/25 bg-violet-500/10 text-violet-100",
        button: "border-violet-300/45 text-violet-100 hover:bg-violet-300/15",
    },
    teal: {
        frame: "border-teal-300/50 shadow-[0_0_42px_rgba(20,184,166,0.16)]",
        bg: "from-teal-950/80 via-slate-950 to-black",
        glow: "bg-teal-400/20",
        accent: "text-teal-200",
        badge: "border-teal-300/35 bg-teal-400/12 text-teal-100",
        chip: "border-teal-300/25 bg-teal-400/10 text-teal-100",
        button: "border-teal-300/45 text-teal-100 hover:bg-teal-300/15",
    },
    amber: {
        frame: "border-amber-400/50 shadow-[0_0_42px_rgba(245,158,11,0.15)]",
        bg: "from-amber-950/70 via-stone-950 to-black",
        glow: "bg-amber-400/20",
        accent: "text-amber-200",
        badge: "border-amber-300/35 bg-amber-400/12 text-amber-100",
        chip: "border-amber-300/25 bg-amber-400/10 text-amber-100",
        button: "border-amber-300/45 text-amber-100 hover:bg-amber-300/15",
    },
    pink: {
        frame: "border-fuchsia-400/45 shadow-[0_0_42px_rgba(217,70,239,0.16)]",
        bg: "from-fuchsia-950/80 via-slate-950 to-black",
        glow: "bg-fuchsia-500/20",
        accent: "text-fuchsia-200",
        badge: "border-fuchsia-300/35 bg-fuchsia-500/12 text-fuchsia-100",
        chip: "border-fuchsia-300/25 bg-fuchsia-500/10 text-fuchsia-100",
        button: "border-fuchsia-300/45 text-fuchsia-100 hover:bg-fuchsia-300/15",
    },
    rose: {
        frame: "border-rose-400/45 shadow-[0_0_42px_rgba(244,63,94,0.14)]",
        bg: "from-rose-950/75 via-slate-950 to-black",
        glow: "bg-rose-500/20",
        accent: "text-rose-200",
        badge: "border-rose-300/35 bg-rose-500/12 text-rose-100",
        chip: "border-rose-300/25 bg-rose-500/10 text-rose-100",
        button: "border-rose-300/45 text-rose-100 hover:bg-rose-300/15",
    },
    cyan: {
        frame: "border-cyan-300/45 shadow-[0_0_42px_rgba(34,211,238,0.14)]",
        bg: "from-cyan-950/70 via-slate-950 to-black",
        glow: "bg-cyan-400/20",
        accent: "text-cyan-200",
        badge: "border-cyan-300/35 bg-cyan-400/12 text-cyan-100",
        chip: "border-cyan-300/25 bg-cyan-400/10 text-cyan-100",
        button: "border-cyan-300/45 text-cyan-100 hover:bg-cyan-300/15",
    },
    slate: {
        frame: "border-slate-300/35 shadow-[0_0_42px_rgba(148,163,184,0.12)]",
        bg: "from-slate-900 via-neutral-950 to-black",
        glow: "bg-slate-300/16",
        accent: "text-slate-200",
        badge: "border-slate-300/30 bg-slate-300/10 text-slate-100",
        chip: "border-slate-300/20 bg-slate-300/10 text-slate-100",
        button: "border-slate-300/40 text-slate-100 hover:bg-slate-300/15",
    },
    indigo: {
        frame: "border-sky-300/45 shadow-[0_0_42px_rgba(56,189,248,0.14)]",
        bg: "from-indigo-950/80 via-slate-950 to-black",
        glow: "bg-sky-400/20",
        accent: "text-sky-200",
        badge: "border-sky-300/35 bg-sky-400/12 text-sky-100",
        chip: "border-sky-300/25 bg-sky-400/10 text-sky-100",
        button: "border-sky-300/45 text-sky-100 hover:bg-sky-300/15",
    },
} as const;

type ThemeName = keyof typeof themes;

interface Project {
    title: string;
    description: string;
    tags: string[];
    liveUrl?: string;
    githubUrl?: string;
    theme: ThemeName;
    className?: string;
    id: string;
}

const initialProjects: Project[] = [
    {
        id: "credentid",
        title: "CredentID",
        description:
            "A seamless identity verification and credential management platform.",
        tags: ["Next.js", "Identity", "Secure", "Landing Page"],
        liveUrl: "https://credentid.vercel.app/",
        theme: "violet",
        className: "md:col-span-2",
    },
    {
        id: "maxima",
        title: "Maxima Property",
        description: "Modern real estate listing and property management interface.",
        tags: ["React", "Real Estate", "Admin", "Marketplace"],
        liveUrl: "https://maxima-property.vercel.app/",
        theme: "teal",
        className: "md:col-span-1",
    },
    {
        id: "spinwin",
        title: "Spin & Win",
        description: "Interactive spin-the-wheel game for user engagement and rewards.",
        tags: ["React", "Gamification", "Fun"],
        liveUrl: "https://spin-win-psi.vercel.app/",
        theme: "amber",
        className: "md:col-span-1",
    },
    {
        id: "tiershare",
        title: "Tier Share Board",
        description:
            "Collaborative dashboard for visualizing tiered data and sharing insights.",
        tags: ["Next.js", "Dashboard", "Data Viz"],
        liveUrl: "https://tier-share-board.vercel.app/",
        theme: "pink",
        className: "md:col-span-2",
    },
    {
        id: "cbcal",
        title: "CB Cal",
        description: "A sleek and functional utility application.",
        tags: ["React", "Utility", "Minimalist"],
        liveUrl: "https://cb-cal.vercel.app/",
        theme: "rose",
        className: "md:col-span-1",
    },
    {
        id: "autofood",
        title: "Auto Food Polling Bot",
        description: "Telegram bot to automate daily food ordering polls for office.",
        tags: ["Node.js", "Telegram API", "Automation"],
        theme: "slate",
        className: "md:col-span-1",
    },
    {
        id: "aifixhuman",
        title: "AIFIXHUMAN",
        description:
            "Submit yourself to the ultimate AI optimization protocol. Say goodbye to flaws and biological limitations. (parody)",
        tags: ["Joke", "AI", "Design"],
        liveUrl: "https://aifixhuman.vercel.app/",
        theme: "rose",
        className: "md:col-span-1",
    },
    {
        id: "dracin",
        title: "Dracin",
        description:
            "A multi-platform streaming aggregator with cinematic dark UI and platform filtering.",
        tags: ["React", "Streaming", "UI/UX", "SaaS"],
        liveUrl: "https://dracin.indevs.in/",
        theme: "indigo",
        className: "md:col-span-2",
    },
    {
        id: "qanari",
        title: "Qanari",
        description: "Track Every Bug. Ship With Confidence.",
        tags: ["Next.js", "Management", "SaaS"],
        liveUrl: "https://qanari.vercel.app/",
        theme: "cyan",
        className: "md:col-span-1",
    },
];

const TagIcon = ({ tag }: { tag: string }) => {
    const tagMap: Record<string, LucideIcon> = {
        "Next.js": Code2,
        React: Grid2X2,
        Identity: UserRound,
        Secure: ShieldCheck,
        "Landing Page": LayoutDashboard,
        "Real Estate": Building2,
        Admin: Lock,
        Marketplace: ShoppingCart,
        Gamification: Trophy,
        Fun: Sparkles,
        Dashboard: LayoutDashboard,
        "Data Viz": BarChart3,
        Utility: Calculator,
        Minimalist: Sparkles,
        "Node.js": Code2,
        "Telegram API": RadioTower,
        Automation: Bot,
        Joke: Wand2,
        AI: Sparkles,
        Design: Grid2X2,
        Streaming: Film,
        "UI/UX": Sparkles,
        SaaS: Database,
        Management: CheckCircle2,
    };

    const Icon = tagMap[tag] ?? Sparkles;

    return <Icon className="h-3.5 w-3.5" />;
};

const projectNumber = (index: number) => String(index + 1).padStart(3, "0");

function ProjectPreview({ project }: { project: Project }) {
    const preview =
        project.id === "credentid" ? (
            <IdentityPreview />
        ) : project.id === "maxima" ? (
            <PropertyPreview />
        ) : project.id === "spinwin" ? (
            <SpinPreview />
        ) : project.id === "tiershare" ? (
            <DashboardPreview />
        ) : project.id === "cbcal" ? (
            <CalculatorPreview />
        ) : project.id === "autofood" ? (
            <BotPreview />
        ) : project.id === "aifixhuman" ? (
            <AiPreview />
        ) : project.id === "dracin" ? (
            <StreamingPreview />
        ) : project.id === "qanari" ? (
            <BugPreview />
        ) : (
            <DashboardPreview />
        );

    return <div className="h-full min-h-0 w-full">{preview}</div>;
}

function IdentityPreview() {
    return (
        <div className="relative h-full min-h-0 w-full overflow-hidden rounded-2xl border border-violet-300/15 bg-black/25">
            <div className="absolute inset-x-4 bottom-7 h-px bg-violet-300/25" />
            <div className="absolute bottom-4 left-12 h-16 w-56 -skew-x-12 rounded-[50%] border border-violet-300/20 bg-violet-500/10 blur-sm" />
            <div className="absolute right-8 top-8 h-28 w-28 rounded-full border border-dashed border-violet-300/25" />
            <div className="absolute right-14 top-14 h-16 w-16 rounded-full border border-dashed border-violet-300/20" />

            <div className="absolute left-[28%] top-8 h-28 w-56 rotate-3 rounded-2xl border border-violet-300/20 bg-slate-950/90 p-4 shadow-2xl">
                <div className="grid grid-cols-[1fr_76px] gap-4">
                    <div className="rounded-xl border border-violet-300/15 bg-violet-500/10 p-4">
                        <ShieldCheck className="mb-4 h-11 w-11 text-violet-300" />
                        <div className="h-2 w-20 rounded-full bg-white/30" />
                        <div className="mt-3 flex gap-2">
                            <span className="h-2 w-9 rounded-full bg-violet-300/35" />
                            <span className="h-2 w-9 rounded-full bg-violet-300/20" />
                            <span className="h-2 w-9 rounded-full bg-violet-300/15" />
                        </div>
                    </div>
                    <div>
                        <div className="grid h-20 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-slate-700 to-slate-950">
                            <UserRound className="h-10 w-10 text-white/70" />
                        </div>
                        <div className="mt-3 h-2 w-16 rounded-full bg-white/35" />
                        <div className="mt-2 h-2 w-20 rounded-full bg-white/15" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function PropertyPreview() {
    return (
        <div className="relative h-full min-h-0 w-full overflow-hidden rounded-2xl border border-teal-300/15 bg-teal-950/20">
            <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(45,212,191,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.14)_1px,transparent_1px)] [background-size:34px_34px]" />
            <MapPin className="absolute right-12 top-9 h-9 w-9 text-teal-300" />
            <MapPin className="absolute bottom-12 right-40 h-7 w-7 text-teal-400/80" />
            <Building2 className="absolute right-8 top-4 h-14 w-14 text-teal-300/70" />

            <div className="absolute bottom-5 left-5 grid w-[78%] grid-cols-[96px_1fr] gap-3 rounded-2xl border border-teal-300/25 bg-black/55 p-3 shadow-2xl backdrop-blur">
                <div className="rounded-xl bg-gradient-to-br from-amber-200 via-slate-700 to-teal-950" />
                <div>
                    <div className="h-2 w-20 rounded-full bg-white/60" />
                    <div className="mt-3 h-2 w-24 rounded-full bg-teal-200/60" />
                    <div className="mt-2 h-2 w-32 rounded-full bg-white/20" />
                    <div className="mt-4 flex items-center gap-1 text-[10px] text-teal-100/70">
                        <MapPin className="h-3 w-3" />
                        Beverly Hills, CA
                    </div>
                </div>
            </div>
        </div>
    );
}

function SpinPreview() {
    return (
        <div className="relative h-full min-h-0 w-full overflow-hidden rounded-2xl border border-amber-300/15 bg-amber-950/20">
            <div className="absolute right-8 top-3 h-44 w-44 rounded-full border border-amber-300/40 bg-[conic-gradient(from_24deg,#f59e0b,#7c2d12,#fbbf24,#451a03,#f97316,#f59e0b)] shadow-[0_0_34px_rgba(245,158,11,0.22)]" />
            <div className="absolute right-[74px] top-[78px] h-4 w-4 rounded-full bg-amber-200 shadow-[0_0_16px_rgba(251,191,36,0.9)]" />
            <div className="absolute right-[85px] top-0 h-16 w-px origin-bottom rotate-12 bg-amber-200" />
            <MapPin className="absolute right-[76px] top-0 h-8 w-8 fill-amber-400 text-amber-300" />
            <Trophy className="absolute right-20 top-16 h-8 w-8 text-amber-100" />
            <Gift className="absolute right-12 top-28 h-8 w-8 text-amber-200" />
            <Coins className="absolute bottom-10 right-40 h-8 w-8 text-amber-300" />
        </div>
    );
}

function DashboardPreview() {
    const points = "M 0 90 C 45 70 70 82 110 60 S 180 45 230 30 S 295 38 340 16";

    return (
        <div className="relative h-full min-h-0 w-full overflow-hidden rounded-2xl border border-fuchsia-300/15 bg-fuchsia-950/20 p-4">
            <div className="grid grid-cols-3 gap-2">
                {["Revenue", "Users", "Shares"].map((label, index) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                        <p className="text-[10px] text-white/45">{label}</p>
                        <p className="mt-1 text-sm font-bold text-white">
                            {index === 0 ? "$128.4K" : index === 1 ? "8,642" : "1,243"}
                        </p>
                    </div>
                ))}
            </div>
            <svg className="mt-5 h-24 w-full overflow-visible" viewBox="0 0 340 110">
                <path d={`${points} L 340 110 L 0 110 Z`} fill="url(#tierShareFill)" opacity="0.72" />
                <path d={points} fill="none" stroke="#f0abfc" strokeWidth="3" />
                <path
                    d="M 0 95 C 45 86 75 90 112 78 S 185 74 232 52 S 298 54 340 40"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="3"
                    opacity="0.8"
                />
                <defs>
                    <linearGradient id="tierShareFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#d946ef" />
                        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.1" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

function CalculatorPreview() {
    return (
        <div className="relative h-full min-h-0 w-full overflow-hidden rounded-2xl border border-rose-300/15 bg-rose-950/20 p-4">
            <div className="mx-auto max-w-[210px] rounded-2xl border border-rose-200/20 bg-black/60 p-4 shadow-2xl">
                <div className="mb-4 h-12 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-right">
                    <p className="text-xs text-white/35">Total</p>
                    <p className="text-lg font-black text-rose-100">42.08</p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {["7", "8", "9", "/", "4", "5", "6", "x", "1", "2", "3", "-", "0", ".", "=", "+"].map((key) => (
                        <span
                            key={key}
                            className="grid h-8 place-items-center rounded-lg border border-white/10 bg-white/[0.05] text-xs font-bold text-white/80"
                        >
                            {key}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function BotPreview() {
    return (
        <div className="relative h-full min-h-0 w-full overflow-hidden rounded-2xl border border-slate-300/15 bg-slate-900/40 p-4">
            <Bot className="absolute right-5 top-5 h-11 w-11 text-slate-200/60" />
            <div className="space-y-3 pr-16">
                <div className="rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.05] p-3 text-xs text-white/65">
                    Poll for lunch today?
                </div>
                <div className="ml-8 rounded-2xl rounded-br-sm border border-slate-200/15 bg-slate-200/10 p-3 text-xs text-white/75">
                    Created: nasi goreng, soto, salad.
                </div>
                <div className="rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.05] p-3 text-xs text-white/65">
                    Voting closes at 11:30.
                </div>
            </div>
            <RadioTower className="absolute bottom-5 right-7 h-8 w-8 text-slate-100/60" />
        </div>
    );
}

function AiPreview() {
    return (
        <div className="relative h-full min-h-0 w-full overflow-hidden rounded-2xl border border-rose-300/15 bg-rose-950/20 p-4">
            <div className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_center,rgba(244,63,94,0.28),transparent_34%)]" />
            <div className="relative mx-auto max-w-[240px] rounded-2xl border border-rose-200/20 bg-black/55 p-4">
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-rose-100">Protocol</span>
                    <Sparkles className="h-5 w-5 text-rose-200" />
                </div>
                <div className="grid grid-cols-[72px_1fr] gap-4">
                    <div className="grid h-20 place-items-center rounded-xl border border-rose-200/20 bg-rose-500/10">
                        <UserRound className="h-9 w-9 text-rose-100/80" />
                    </div>
                    <div className="space-y-3">
                        <div className="h-2 rounded-full bg-rose-200/70" />
                        <div className="h-2 w-4/5 rounded-full bg-white/20" />
                        <div className="h-2 w-2/3 rounded-full bg-white/15" />
                        <div className="rounded-full border border-rose-200/20 bg-rose-500/10 px-3 py-1 text-[10px] font-bold text-rose-100">
                            OPTIMIZING 84%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StreamingPreview() {
    return (
        <div className="relative h-full min-h-0 w-full overflow-hidden rounded-2xl border border-sky-300/15 bg-indigo-950/20 p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_10%,rgba(56,189,248,0.18),transparent_35%)]" />
            <div className="relative flex h-full items-center gap-3">
                {[0, 1, 2].map((index) => (
                    <div
                        key={index}
                        className="h-28 flex-1 rounded-2xl border border-white/10 bg-gradient-to-br from-sky-300/30 via-indigo-500/25 to-black p-3 shadow-xl"
                    >
                        <div className="mb-8 flex justify-end">
                            <Play className="h-6 w-6 fill-white/80 text-white/80" />
                        </div>
                        <div className="h-2 w-14 rounded-full bg-white/60" />
                        <div className="mt-2 h-2 w-20 rounded-full bg-white/20" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function BugPreview() {
    return (
        <div className="relative h-full min-h-0 w-full overflow-hidden rounded-2xl border border-cyan-300/15 bg-cyan-950/20 p-4">
            <div className="grid h-full grid-cols-3 gap-3">
                {["Todo", "Doing", "Fixed"].map((column, index) => (
                    <div key={column} className="rounded-xl border border-white/10 bg-black/35 p-2">
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-cyan-100/55">
                            {column}
                        </p>
                        <div className="space-y-2">
                            {[0, 1].map((item) => (
                                <div key={item} className="rounded-lg border border-cyan-200/15 bg-cyan-300/10 p-2">
                                    <Bug className="mb-2 h-4 w-4 text-cyan-100/70" />
                                    <div className="h-1.5 rounded-full bg-white/35" />
                                    <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-white/15" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProjectCardShell({
    project,
    index,
    isOverlay = false,
}: {
    project: Project;
    index: number;
    isOverlay?: boolean;
}) {
    const theme = themes[project.theme];
    const isWide = project.className?.includes("md:col-span-2");
    const featured = index === 0;

    return (
        <div
            className={`project-card group relative flex h-[390px] flex-col overflow-hidden rounded-[1.35rem] border bg-gradient-to-br md:h-[340px] ${theme.bg} ${theme.frame} ${isOverlay ? "shadow-2xl" : "transition-all duration-300 hover:-translate-y-1"} ${project.className ?? ""}`}
        >
            <div className={`absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl ${theme.glow}`} />
            <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,255,255,0.08),transparent_28%)]" />

            <div className="relative z-10 flex h-full min-h-0 flex-col p-5 sm:p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-black uppercase tracking-wide ${theme.badge}`}>
                        {featured ? (
                            <>
                                <Sparkles className="h-4 w-4" />
                                Featured
                            </>
                        ) : (
                            projectNumber(index)
                        )}
                    </span>
                    <span className={`text-sm font-black tracking-widest ${theme.accent}`}>
                        {projectNumber(index)}
                    </span>
                </div>

                <div className={`grid min-h-0 flex-1 gap-4 ${isWide ? "md:grid-cols-[0.82fr_1.18fr]" : "grid-rows-[auto_minmax(0,1fr)]"}`}>
                    <div className="flex min-h-0 flex-col">
                        <div className="min-h-0">
                            <h3 className={`text-3xl font-black leading-tight tracking-[-0.03em] text-white ${featured ? "sm:text-4xl" : ""}`}>
                                {project.title}
                            </h3>
                            <p className="mt-3 line-clamp-3 max-w-md text-sm leading-relaxed text-white/65 sm:text-base">
                                {project.description}
                            </p>
                        </div>

                        <div className="mt-auto flex flex-wrap gap-2 pt-4">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold ${theme.chip}`}
                                >
                                    <TagIcon tag={tag} />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex min-h-0 w-full items-stretch">
                        <ProjectPreview project={project} />
                    </div>
                </div>

                <div className="absolute bottom-5 right-5 flex gap-2">
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`grid h-11 w-11 place-items-center rounded-xl border bg-black/35 backdrop-blur transition-colors ${theme.button}`}
                            aria-label={`${project.title} source code`}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Github className="h-5 w-5" />
                        </a>
                    )}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target={project.liveUrl.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className={`grid h-11 w-11 place-items-center rounded-xl border bg-black/35 backdrop-blur transition-colors ${theme.button}`}
                            aria-label={`${project.title} live demo`}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink className="h-5 w-5" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

function SortableItem({ project, index }: { project: Project; index: number }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: project.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`cursor-grab active:cursor-grabbing ${project.className ?? ""}`}
        >
            <ProjectCardShell project={project} index={index} />
        </div>
    );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
    return <ProjectCardShell project={project} index={index} isOverlay />;
}

export default function ProjectsShowcase() {
    const [items, setItems] = useState(initialProjects);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragStart(event: any) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }

        setActiveId(null);
    }

    const activeProject = activeId
        ? items.find((item) => item.id === activeId)
        : null;
    const activeProjectIndex = activeProject
        ? items.findIndex((item) => item.id === activeProject.id)
        : 0;

    return (
        <div
            id="showcase"
            className="flex w-full flex-col gap-8 px-4 pt-16 sm:px-8 md:px-16"
        >
            <div className="flex flex-col gap-2">
                <h2 className="text-4xl font-black tracking-[-0.03em] dark:text-white sm:text-5xl">
                    Small Works
                </h2>
                <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-300">
                    A curated selection of small projects I&apos;ve built. (not including real work) <br />
                    <span className="text-sm font-bold text-purple-400">
                        (Try dragging the cards to reorganize them!)
                    </span>
                </p>
            </div>

            <DndContext
                id="projects-showcase-dnd"
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map((item) => item.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        {items.map((project, index) => (
                            <SortableItem key={project.id} project={project} index={index} />
                        ))}
                    </div>
                </SortableContext>
                <DragOverlay>
                    {activeProject ? (
                        <ProjectCard project={activeProject} index={activeProjectIndex} />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
