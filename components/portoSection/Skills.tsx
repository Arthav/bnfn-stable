"use client";

import { useRef } from "react";
import {
    FaDocker,
    FaGithub,
} from "react-icons/fa";
import {
    SiNextdotjs,
    SiJavascript,
    SiTypescript,
    SiMongodb,
    SiPostgresql,
    SiGraphql,
    SiHtml5,
    SiCss3,
    SiVuedotjs,
    SiReact,
    SiPhp,
    SiMysql,
    SiJira,
    SiSonarqube,
    SiWordpress,
    SiSocketdotio,
    SiJest,
} from "react-icons/si";

const skills = [
    { icon: SiJavascript, name: "JavaScript (Node.js)" },
    { icon: SiTypescript, name: "TypeScript" },
    { icon: SiVuedotjs, name: "Vue.js / Nuxt" },
    { icon: SiReact, name: "React / Next.js" },
    { icon: SiPhp, name: "PHP" },
    { icon: SiMysql, name: "MySQL" },
    { icon: SiPostgresql, name: "PostgreSQL" },
    { icon: SiMongodb, name: "MongoDB" },
    { icon: SiGraphql, name: "GraphQL" },
    { icon: FaDocker, name: "Docker" },
    { icon: FaGithub, name: "GitHub" },
    { icon: SiJira, name: "Jira" },
    { icon: SiSonarqube, name: "Sonarqube" },
    { icon: SiWordpress, name: "WordPress" },
    { icon: SiSocketdotio, name: "WebSocket" },
    { icon: SiJest, name: "Testing (Jest)" },
];

const SkillBadge = ({ icon: Icon, name }: { icon: any; name: string }) => (
    <div className="flex items-center gap-2 px-4 py-2 mx-4 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm hover:bg-white/10 transition-colors">
        <Icon className="w-6 h-6 text-white" />
        <span className="text-sm font-medium text-white/80">{name}</span>
    </div>
);

export default function Skills() {
    const firstRow = skills.slice(0, Math.ceil(skills.length / 2));
    const secondRow = skills.slice(Math.ceil(skills.length / 2));

    return (
        <section id="skills" className="w-full py-20 overflow-hidden">
            <div className="container mx-auto px-6 mb-12 text-center">
                <h2 className="text-4xl font-bold mb-4 dark:text-white">Tech Stack</h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Technologies and tools I use to build digital products.
                </p>
            </div>

            <div className="relative flex flex-col gap-8">
                {/* First Row */}
                <div className="flex w-full overflow-hidden mask-linear-gradient">
                    <div className="flex animate-marquee min-w-full shrink-0 items-center justify-around group-hover:pause">
                        {[...firstRow, ...firstRow].map((skill, index) => (
                            <SkillBadge key={`row1-${index}`} {...skill} />
                        ))}
                    </div>
                </div>

                {/* Second Row */}
                <div className="flex w-full overflow-hidden mask-linear-gradient">
                    <div className="flex animate-marquee-reverse min-w-full shrink-0 items-center justify-around group-hover:pause">
                        {[...secondRow, ...secondRow].map((skill, index) => (
                            <SkillBadge key={`row2-${index}`} {...skill} />
                        ))}
                    </div>
                </div>

                {/* Gradient Overlays */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background to-transparent"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background to-transparent"></div>
            </div>
        </section>
    );
}
