"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Stat {
    value: number;
    suffix: string;
    label: string;
}

const stats: Stat[] = [
    { value: 5, suffix: "+", label: "Years of Experience" },
    { value: 20, suffix: "+", label: "Projects Held" },
    { value: 12, suffix: "+", label: "Technologies Mastered" },
    { value: 100, suffix: "%", label: "Passion for Code" },
];

function AnimatedCounter({
    target,
    suffix,
    shouldAnimate,
}: {
    target: number;
    suffix: string;
    shouldAnimate: boolean;
}) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!shouldAnimate) return;

        const duration = 2000;
        const stepTime = Math.max(Math.floor(duration / target), 30);
        let current = 0;

        const timer = setInterval(() => {
            current += 1;
            setCount(current);
            if (current >= target) {
                clearInterval(timer);
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [target, shouldAnimate]);

    return (
        <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
            {count}
            {suffix}
        </span>
    );
}

export default function StatsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [animateCounters, setAnimateCounters] = useState(false);

    useEffect(() => {
        if (!sectionRef.current) return;

        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 80%",
            onEnter: () => setAnimateCounters(true),
        });

        gsap.fromTo(
            sectionRef.current.querySelectorAll(".stat-item"),
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            }
        );
    }, []);

    return (
        <div
            ref={sectionRef}
            className="w-full mt-16 px-4 sm:px-8 md:px-16"
        >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 p-8 md:p-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="stat-item flex flex-col items-center text-center gap-2"
                    >
                        <AnimatedCounter
                            target={stat.value}
                            suffix={stat.suffix}
                            shouldAnimate={animateCounters}
                        />
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
