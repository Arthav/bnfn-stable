"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

interface Project {
    title: string;
    description: string;
    tags: string[];
    liveUrl?: string;
    githubUrl?: string;
    gradient: string;
    emoji: string;
    className?: string; // For Bento Grid sizing
}

const projects: Project[] = [
    {
        title: "AI Chat Assistant",
        description:
            "An intelligent chat interface powered by Google Gemini AI. Features real-time streaming responses and a beautiful, responsive design.",
        tags: ["Next.js", "Gemini AI", "TypeScript"],
        liveUrl: "/aichat",
        gradient: "from-blue-600/20 to-cyan-500/20",
        emoji: "🤖",
        className: "md:col-span-2",
    },
    {
        title: "Next Do",
        description: "A sleek, modern to-do application.",
        tags: ["React", "Framer Motion"],
        liveUrl: "/nextdo",
        gradient: "from-emerald-600/20 to-teal-500/20",
        emoji: "✅",
        className: "md:col-span-1",
    },
    {
        title: "Langlern",
        description: "Interactive language learning platform.",
        tags: ["Next.js", "PostgreSQL"],
        liveUrl: "https://mulmod.vercel.app/",
        gradient: "from-orange-600/20 to-amber-500/20",
        emoji: "🌍",
        className: "md:col-span-1",
    },
    {
        title: "Massage Booking System",
        description:
            "A complete booking and management system for massage services with scheduling, client management, and reporting.",
        tags: ["React", "Node.js", "MongoDB"],
        liveUrl: "/massage",
        gradient: "from-pink-600/20 to-rose-500/20",
        emoji: "💆",
        className: "md:col-span-2",
    },
    {
        title: "Lucky Draw",
        description: "Fun, animated lottery app.",
        tags: ["React", "Confetti"],
        liveUrl: "/lottery",
        gradient: "from-yellow-600/20 to-orange-500/20",
        emoji: "🎰",
        className: "md:col-span-1",
    },
    {
        title: "PDF Chat",
        description: "Chat with PDF documents using AI.",
        tags: ["Next.js", "AI"],
        liveUrl: "/pdfchat",
        gradient: "from-violet-600/20 to-purple-500/20",
        emoji: "📄",
        className: "md:col-span-1",
    },
];

export default function ProjectsShowcase() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const cards = sectionRef.current.querySelectorAll(".project-card");

        cards.forEach((card, i) => {
            gsap.fromTo(
                card,
                { opacity: 0, scale: 0.9 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    delay: i * 0.05,
                    ease: "back.out(1.2)",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                        toggleActions: "play none none none",
                    },
                }
            );
        });
    }, []);

    return (
        <div
            ref={sectionRef}
            id="showcase"
            className="flex flex-col gap-8 w-full mt-16 px-4 sm:px-8 md:px-16"
        >
            <h2 className="text-4xl font-bold dark:text-white">Selected Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                A curated selection of projects I&apos;ve built.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(250px,auto)]">
                {projects.map((project) => (
                    <div
                        key={project.title}
                        className={`project-card group relative p-8 rounded-3xl border border-white/10 bg-gradient-to-br ${project.gradient} backdrop-blur-sm hover:border-purple-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col ${project.className}`}
                    >
                        {/* Emoji badge */}
                        <div className="absolute top-6 right-6 text-4xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                            {project.emoji}
                        </div>

                        <div className="mt-2">
                            <h3 className="text-2xl font-bold dark:text-white text-gray-900 mb-3 group-hover:text-purple-400 transition-colors">
                                {project.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-6 max-w-md">
                                {project.description}
                            </p>
                        </div>

                        {/* Tags & Links */}
                        <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-gray-300 border border-white/5"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target={
                                            project.liveUrl.startsWith("http") ? "_blank" : undefined
                                        }
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-purple-400 transition-colors"
                                        aria-label="Live Demo"
                                    >
                                        <FaExternalLinkAlt />
                                    </a>
                                )}
                                {project.githubUrl && (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-gray-300 transition-colors"
                                        aria-label="Source Code"
                                    >
                                        <FaGithub className="text-lg" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
