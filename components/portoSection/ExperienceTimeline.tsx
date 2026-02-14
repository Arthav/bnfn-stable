"use client";
import { useRef } from "react";
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

export default function ExperienceTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            id="experience"
            className="w-full mt-24 px-4 sm:px-8 md:px-16 flex flex-col items-center"
        >
            <h2 className="text-4xl font-bold dark:text-white mb-2">Experience</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl text-center mb-16">
                A detailed log of my professional journey.
            </p>

            <div className="w-full max-w-4xl flex flex-col pb-24">
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
                            className="sticky"
                            style={{
                                // Staggered sticky top position
                                top: `${100 + index * 40}px`,
                                zIndex: index + 1,
                            }}
                        >
                            <div className="bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden border border-gray-800 font-mono text-sm md:text-base mb-8 transform origin-top hover:scale-[1.01] transition-transform duration-300">
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
        </div>
    );
}
