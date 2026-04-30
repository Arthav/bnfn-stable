"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Experience {
    title: string;
    company: string;
    period: string;
    description: string;
    tags: string[];
    hash: string;
}

const experiences: Experience[] = [
    {
        title: "Fullstack Senior Software Engineer",
        company: "Harts Imagineering",
        period: "Sep 2024 – Present",
        description:
            "Building end-to-end solutions with scalability and security focus. Developing Internal Audit App and Superapp Bhakta (ERP). Managed backend with PHP and frontend with Gatsby.js.",
        tags: ["PHP", "Gatsby.js", "Scalability", "Security", "Mentorship"],
        hash: "a1b2c3d",
    },
    {
        title: "Backend Engineer",
        company: "Intimedia International",
        period: "Aug 2023 – Mar 2024",
        description:
            "Worked on TujuhLive streaming platform using PHP and ThinkPHP. Designed WebSocket for real-time data to improve engagement. Optimized performance and collaborated with cross-functional teams.",
        tags: ["PHP", "ThinkPHP", "WebSocket", "Real-time", "Optimization"],
        hash: "e4f5g6h",
    },
    {
        title: "Fullstack Engineer",
        company: "Alterra Academy",
        period: "2021 – Nov 2022",
        description:
            "Developed Alta.id, SKCBD (Nuxt + Express.js), and Talent Dashboard. Integrated AWS CI/CD, implemented Google Analytics, and set up Strapi on GCP.",
        tags: ["Nuxt.js", "Express.js", "AWS CI/CD", "GCP", "Strapi"],
        hash: "i7j8k9l",
    },
    {
        title: "Fullstack Engineer",
        company: "Alterra",
        period: "Jul 2019 – 2021",
        description:
            "Built Reconciliation Engine (Vue + Node + MongoDB) and PDAM Budgeting (Next.js + Node + GraphQL). Implemented unit testing with Jest and caching via GraphQL.",
        tags: ["Vue.js", "Node.js", "MongoDB", "GraphQL", "Jest"],
        hash: "m0n1o2p",
    },
];

const ambientPalettes = [
    {
        primary: "rgba(45, 212, 191, 0.62)",
        secondary: "rgba(59, 130, 246, 0.56)",
        tertiary: "rgba(244, 114, 182, 0.44)",
    },
    {
        primary: "rgba(244, 114, 182, 0.62)",
        secondary: "rgba(168, 85, 247, 0.56)",
        tertiary: "rgba(34, 197, 94, 0.42)",
    },
    {
        primary: "rgba(250, 204, 21, 0.48)",
        secondary: "rgba(20, 184, 166, 0.62)",
        tertiary: "rgba(96, 165, 250, 0.52)",
    },
    {
        primary: "rgba(251, 146, 60, 0.52)",
        secondary: "rgba(14, 165, 233, 0.58)",
        tertiary: "rgba(217, 70, 239, 0.46)",
    },
];

export default function ExperienceTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [ambientPalette, setAmbientPalette] = useState(ambientPalettes[0]);

    useEffect(() => {
        setAmbientPalette(
            ambientPalettes[Math.floor(Math.random() * ambientPalettes.length)]
        );
    }, []);

    return (
        <div
            ref={containerRef}
            id="experience"
            className="relative mt-24 flex w-full flex-col items-center px-4 sm:px-8 md:px-16"
        >
            <div className="pointer-events-none absolute inset-0 bg-black" />
            <div
                className="pointer-events-none absolute inset-x-0 -inset-y-[18%] opacity-100 blur-3xl saturate-150 [animation:experienceAmbient_28s_ease-in-out_infinite_alternate] motion-reduce:animate-none"
                style={{
                    background: `radial-gradient(circle at 24% 28%, ${ambientPalette.primary}, transparent 26%), radial-gradient(circle at 76% 30%, ${ambientPalette.secondary}, transparent 28%), radial-gradient(circle at 50% 76%, ${ambientPalette.tertiary}, transparent 32%)`,
                }}
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px]"
                aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.12)_52%,rgba(0,0,0,0.58)_100%)]" />

            <h2 className="relative z-10 mb-2 text-4xl font-bold dark:text-white">Experience</h2>
            <p className="relative z-10 mb-16 max-w-2xl text-center text-lg text-gray-600 dark:text-gray-300">
                A detailed log of my professional journey.
            </p>

            <div className="relative z-10 flex w-full max-w-4xl flex-col pb-24">
                {experiences.map((exp, index) => {
                    // Create a "path" for the terminal header based on company name
                    const path = `~/experience/${exp.company
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="sticky group/terminal relative"
                            style={{
                                // Staggered sticky top position
                                top: `${100 + index * 40}px`,
                                zIndex: index + 1,
                            }}
                        >
                            <div
                                className="pointer-events-none absolute -inset-x-10 -inset-y-12 z-0 rounded-[2rem] opacity-100 blur-3xl saturate-150 transition-opacity duration-500 group-hover/terminal:opacity-100"
                                style={{
                                    background: `radial-gradient(circle at 18% 22%, ${ambientPalette.primary}, transparent 26%), radial-gradient(circle at 84% 50%, ${ambientPalette.secondary}, transparent 30%), radial-gradient(circle at 50% 94%, ${ambientPalette.tertiary}, transparent 36%)`,
                                }}
                                aria-hidden="true"
                            />
                            <div className="relative z-10 mb-8 origin-top overflow-hidden rounded-xl border border-white/10 bg-[#1e1e1e] font-mono text-sm shadow-2xl shadow-black/70 transition-transform duration-300 hover:scale-[1.01] md:text-base">
                                {/* Terminal Header */}
                                <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-gray-800">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                    </div>
                                    <div className="text-gray-400 text-xs font-mono opacity-80">
                                        cbonz@dev: {path}
                                    </div>
                                    <div className="w-10" />
                                </div>

                                {/* Terminal Body */}
                                <div className="p-6 md:p-8 text-gray-300">
                                    {/* Command Line */}
                                    <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-gray-800 pb-4">
                                        <span className="text-[#87d441]">➜</span>
                                        <span className="text-[#27c93f]">{path}</span>
                                        <span className="text-white">git show {exp.hash}</span>
                                    </div>

                                    {/* Output Content */}
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-3 text-[#d7ba7d] mb-1">
                                            <span>commit {exp.hash}</span>
                                            <span className="px-2 py-0.5 rounded-full bg-[#d7ba7d]/10 text-xs border border-[#d7ba7d]/20">
                                                HEAD
                                            </span>
                                        </div>

                                        <div className="mb-1">
                                            <span className="text-gray-500">Author:</span>{" "}
                                            <span className="text-[#4ec9b0]">Christian Bonafena</span>{" "}
                                            <span className="text-gray-500">&lt;cbonz@dev&gt;</span>
                                        </div>

                                        <div className="mb-6">
                                            <span className="text-gray-500">Date:</span>{" "}
                                            <span className="text-[#ce9178]">{exp.period}</span>
                                        </div>

                                        <div className="pl-4 border-l-2 border-gray-700/50">
                                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                                {exp.title} <span className="text-gray-500">@</span>{" "}
                                                <span className="text-[#569cd6]">{exp.company}</span>
                                            </h3>

                                            <p className="text-gray-400 mb-6 leading-relaxed">
                                                {exp.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {exp.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-3 py-1 text-xs rounded bg-[#2d2d2d] text-[#9cdcfe] border border-gray-700 hover:bg-[#3d3d3d] transition-colors cursor-default"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes experienceAmbient {
                            0% {
                                transform: translate3d(0, -1.5%, 0) scale(1);
                            }

                            45% {
                                transform: translate3d(0, 2%, 0) scale(1.04);
                            }

                            100% {
                                transform: translate3d(0, 4%, 0) scale(1.02);
                            }
                        }
                    `,
                }}
            />
        </div>
    );
}
