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
    },
    {
        title: "Next Do — Task Manager",
        description:
            "A sleek, modern to-do application with drag n drop, categories, and smooth animations. Built for productivity enthusiasts.",
        tags: ["React", "Framer Motion", "Tailwind CSS"],
        liveUrl: "/nextdo",
        gradient: "from-emerald-600/20 to-teal-500/20",
        emoji: "✅",
    },
    {
        title: "Langlern — Language Learning",
        description:
            "An interactive language learning platform with spaced repetition, quizzes, and progress tracking for polyglots.",
        tags: ["Next.js", "PostgreSQL", "i18n"],
        liveUrl: "https://mulmod.vercel.app/",
        gradient: "from-orange-600/20 to-amber-500/20",
        emoji: "🌍",
    },
    {
        title: "Massage Booking System",
        description:
            "A complete booking and management system for massage services with scheduling, client management, and reporting.",
        tags: ["React", "Node.js", "MongoDB"],
        liveUrl: "/massage",
        gradient: "from-pink-600/20 to-rose-500/20",
        emoji: "💆",
    },
    {
        title: "Lucky Draw / Lottery",
        description:
            "A fun, animated lottery application with confetti effects, multiple draw modes, and customizable participant lists.",
        tags: ["React", "Canvas Confetti", "GSAP"],
        liveUrl: "/lottery",
        gradient: "from-yellow-600/20 to-orange-500/20",
        emoji: "🎰",
    },
    {
        title: "PDF Chat — Document AI",
        description:
            "Upload PDF documents and chat with them using AI. Extracts and understands content for intelligent Q&A sessions.",
        tags: ["Next.js", "Gemini AI", "PDF.js"],
        liveUrl: "/pdfchat",
        gradient: "from-violet-600/20 to-purple-500/20",
        emoji: "📄",
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
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    delay: i * 0.1,
                    ease: "power3.out",
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
            <h2 className="text-4xl font-bold dark:text-white">Projects</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                A selection of projects I&apos;ve built — from AI-powered apps to
                productivity tools.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div
                        key={project.title}
                        className={`project-card group relative p-6 rounded-2xl border border-white/10 bg-gradient-to-br ${project.gradient} backdrop-blur-sm hover:border-purple-500/40 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1`}
                    >
                        {/* Emoji badge */}
                        <div className="text-4xl mb-4">{project.emoji}</div>

                        <h3 className="text-xl font-semibold dark:text-white text-gray-900 mb-2 group-hover:text-purple-400 transition-colors">
                            {project.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                            {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-5">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-gray-400 border border-white/5"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Links */}
                        <div className="flex gap-3 mt-auto">
                            {project.liveUrl && (
                                <a
                                    href={project.liveUrl}
                                    target={project.liveUrl.startsWith("http") ? "_blank" : undefined}
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium"
                                >
                                    <FaExternalLinkAlt className="text-xs" />
                                    Live Demo
                                </a>
                            )}
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-300 transition-colors font-medium"
                                >
                                    <FaGithub className="text-sm" />
                                    Source
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
