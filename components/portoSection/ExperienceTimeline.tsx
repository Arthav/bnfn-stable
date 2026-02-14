"use client";
import { useRef, useState, useEffect } from "react";
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
    const [typedCommand, setTypedCommand] = useState("");
    const command = "git log --graph --pretty=format:'%h - %an, %ar : %s'";

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < command.length) {
                setTypedCommand((prev) => prev + command.charAt(i));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            ref={containerRef}
            id="experience"
            className="w-full mt-24 px-4 sm:px-8 md:px-16 flex flex-col items-center"
        >
            <h2 className="text-4xl font-bold dark:text-white mb-2">Experience</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl text-center mb-10">
                A detailed log of my professional journey.
            </p>

            {/* Terminal Window */}
            <div className="w-full max-w-4xl bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden border border-gray-800 font-mono text-sm md:text-base">
                {/* Terminal Header */}
                <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-gray-800">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="text-gray-400 text-xs">cbonz@dev: ~/experience</div>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>

                {/* Terminal Body */}
                <div className="p-6 text-gray-300">
                    {/* Command Line */}
                    <div className="flex mb-6">
                        <span className="text-[#87d441] mr-2">➜</span>
                        <span className="text-[#27c93f] mr-2">~/experience</span>
                        <span className="text-gray-100">{typedCommand}</span>
                        <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="w-2 h-5 bg-gray-400 ml-1 block"
                        />
                    </div>

                    {/* Git Log Output */}
                    <div className="flex flex-col gap-8">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="flex gap-4 relative"
                            >
                                {/* Git Graph Visuals */}
                                <div className="flex flex-col items-center min-w-[20px]">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                                    {index !== experiences.length - 1 && (
                                        <div className="w-0.5 bg-gray-700 h-full mt-1" />
                                    )}
                                </div>

                                {/* Commit Content */}
                                <div className="flex-1 pb-4">
                                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                                        <span className="text-[#d7ba7d]">
                                            commit {exp.hash}
                                        </span>
                                        <span className="text-gray-500 hidden sm:inline">
                                            ({exp.period})
                                        </span>
                                    </div>

                                    <div className="mb-1">
                                        Author: <span className="text-[#4ec9b0]">Christian Bonafena</span>{" "}
                                        <span className="text-gray-500">&lt;cbonz@dev&gt;</span>
                                    </div>

                                    <div className="mb-2">
                                        Date: <span className="text-[#ce9178]">{exp.period}</span>
                                    </div>

                                    <div className="mt-4 pl-4 border-l-2 border-gray-700/50">
                                        <h3 className="text-xl font-bold text-white mb-1">
                                            {exp.title} <span className="text-gray-400">@</span>{" "}
                                            <span className="text-[#569cd6]">{exp.company}</span>
                                        </h3>
                                        <p className="text-gray-400 mb-3 leading-relaxed">
                                            {exp.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {exp.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 text-xs rounded bg-[#2d2d2d] text-[#9cdcfe] border border-gray-700"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        <div className="flex items-center gap-2 mt-4 opacity-50 text-sm">
                            <span className="text-[#d7ba7d]">(END)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
