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
        title: "Fullstack Engineer",
        company: "Freelance / Personal Projects",
        period: "2023 - Present",
        description:
            "Building scalable web applications using Next.js, React, and modern cloud infrastructure. Delivering end-to-end solutions from design to deployment.",
        tags: ["Next.js", "React", "TypeScript", "Docker", "PostgreSQL"],
    },
    {
        title: "Frontend Developer",
        company: "Web Development Studio",
        period: "2022 - 2023",
        description:
            "Developed responsive, high-performance user interfaces for client projects. Focused on component architecture, accessibility, and pixel-perfect designs.",
        tags: ["React", "Tailwind CSS", "JavaScript", "Figma"],
    },
    {
        title: "Software Engineering Learner",
        company: "Self-Directed & Open Source",
        period: "2021 - 2022",
        description:
            "Deep-dived into backend development, databases, and DevOps. Contributed to open-source projects and built a solid foundation in computer science fundamentals.",
        tags: ["Node.js", "MongoDB", "Git", "REST APIs"],
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
