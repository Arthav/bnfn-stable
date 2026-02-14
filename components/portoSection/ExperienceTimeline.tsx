"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaBriefcase } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

interface Experience {
    title: string;
    company: string;
    period: string;
    description: string;
    tags: string[];
}

const experiences: Experience[] = [
    {
        title: "Fullstack Senior Software Engineer",
        company: "Harts Imagineering",
        period: "Sep 2024 – Present",
        description:
            "Building end-to-end solutions with scalability and security focus. Developing Internal Audit App and Superapp Bhakta (ERP). Managed backend with PHP and frontend with Gatsby.js.",
        tags: ["PHP", "Gatsby.js", "Scalability", "Security", "Mentorship"],
    },
    {
        title: "Backend Engineer",
        company: "Intimedia International",
        period: "Aug 2023 – Mar 2024",
        description:
            "Worked on TujuhLive streaming platform using PHP and ThinkPHP. Designed WebSocket for real-time data to improve engagement. Optimized performance and collaborated with cross-functional teams.",
        tags: ["PHP", "ThinkPHP", "WebSocket", "Real-time", "Optimization"],
    },
    {
        title: "Fullstack Engineer",
        company: "Alterra Academy",
        period: "2021 – Nov 2022",
        description:
            "Developed Alta.id, SKCBD (Nuxt + Express.js), and Talent Dashboard. Integrated AWS CI/CD, implemented Google Analytics, and set up Strapi on GCP.",
        tags: ["Nuxt.js", "Express.js", "AWS CI/CD", "GCP", "Strapi"],
    },
    {
        title: "Fullstack Engineer",
        company: "Alterra",
        period: "Jul 2019 – 2021",
        description:
            "Built Reconciliation Engine (Vue + Node + MongoDB) and PDAM Budgeting (Next.js + Node + GraphQL). Implemented unit testing with Jest and caching via GraphQL.",
        tags: ["Vue.js", "Node.js", "MongoDB", "GraphQL", "Jest"],
    },
];

export default function ExperienceTimeline() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const items = sectionRef.current.querySelectorAll(".timeline-item");

        items.forEach((item) => {
            gsap.fromTo(
                item,
                { opacity: 0, x: -60 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        end: "top 60%",
                        scrub: false,
                        toggleActions: "play none none none",
                    },
                }
            );
        });
    }, []);

    return (
        <div
            ref={sectionRef}
            id="experience"
            className="flex flex-col gap-8 w-full mt-16 px-4 sm:px-8 md:px-16"
        >
            <h2 className="text-4xl font-bold dark:text-white">Experience</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                A journey through my professional growth — from curious learner to
                fullstack engineer.
            </p>

            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 hidden md:block" />

                <div className="flex flex-col gap-10">
                    {experiences.map((exp, i) => (
                        <div
                            key={i}
                            className="timeline-item flex items-start gap-6 md:ml-6"
                        >
                            {/* Dot */}
                            <div className="hidden md:flex flex-shrink-0 items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-purple-500/30 -ml-6 z-10">
                                <FaBriefcase className="text-white text-lg" />
                            </div>

                            {/* Card */}
                            <div className="flex-1 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                                    <h3 className="text-xl font-semibold dark:text-white text-gray-900">
                                        {exp.title}
                                    </h3>
                                    <span className="text-sm font-medium text-purple-400">
                                        {exp.period}
                                    </span>
                                </div>
                                <p className="text-sm text-purple-300/80 mb-3 font-medium">
                                    {exp.company}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                    {exp.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {exp.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
