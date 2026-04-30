"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  BriefcaseBusiness,
  Cloud,
  Code2,
  Database,
  Infinity as InfinityIcon,
  Layers3,
  Sparkles,
  TerminalSquare,
  UserRound,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCounterProps {
  target: number;
  suffix: string;
  shouldAnimate: boolean;
  className?: string;
}

function AnimatedCounter({
  target,
  suffix,
  shouldAnimate,
  className = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    let start = 0;
    const duration = 1800;
    const increment = Math.max(1, target / 60);
    const stepTime = duration / 60;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, shouldAnimate]);

  return (
    <span
      className={`bg-gradient-to-r from-[#ff4bc1] via-[#b85cff] to-[#4f7dff] bg-clip-text text-transparent ${className}`}
    >
      {count}
      {suffix}
    </span>
  );
}

function GalaxyVisual() {
  return (
    <div
      className="pointer-events-none absolute inset-y-4 right-3 hidden w-[43%] min-w-[205px] items-center justify-center lg:flex"
      aria-hidden="true"
    >
      <div className="absolute h-[230px] w-[230px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,72,203,0.2),rgba(91,80,255,0.08)_34%,transparent_68%)] blur-sm xl:h-[250px] xl:w-[250px]" />
      <div className="absolute h-[196px] w-[196px] rounded-full border border-[#6d83ff]/25 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:42px_42px] opacity-60 xl:h-[214px] xl:w-[214px]" />
      <div className="absolute h-[184px] w-[184px] rounded-full border border-dashed border-[#7d85ff]/30 transition-transform duration-700 motion-safe:group-hover/experience:animate-[spin_10s_linear_infinite] motion-reduce:animate-none xl:h-[202px] xl:w-[202px]">
        <span className="absolute right-7 top-10 h-3 w-3 rounded-full bg-[#8b8cff] shadow-[0_0_22px_rgba(139,140,255,0.95)]" />
        <span className="absolute bottom-8 left-14 h-2 w-2 rounded-full bg-[#ff55c7] shadow-[0_0_18px_rgba(255,85,199,0.95)]" />
      </div>
      <div className="absolute h-[146px] w-[146px] rounded-full border border-[#626aff]/55 transition-transform duration-700 motion-safe:group-hover/experience:animate-[spin_7s_linear_infinite_reverse] motion-reduce:animate-none xl:h-[164px] xl:w-[164px]">
        <span className="absolute -bottom-1 left-20 h-4 w-4 rounded-full bg-[#ff4fc2] shadow-[0_0_22px_rgba(255,79,194,0.95)]" />
      </div>
      <div className="absolute h-[104px] w-[104px] rounded-full border border-[#ff4fbd]/45 transition-transform duration-700 motion-safe:group-hover/experience:animate-[spin_5s_linear_infinite] motion-reduce:animate-none xl:h-[116px] xl:w-[116px]" />
      <div className="absolute h-[62px] w-[62px] rounded-full bg-[radial-gradient(circle_at_60%_36%,#6f78ff_0_12%,#ff4bc1_30%,rgba(255,75,193,0.16)_58%,transparent_74%)] shadow-[0_0_55px_rgba(202,74,255,0.45)] transition-transform duration-500 group-hover/experience:scale-110 xl:h-[68px] xl:w-[68px]">
        <div className="absolute left-1/2 top-1/2 h-10 w-5 -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-full bg-gradient-to-b from-[#635bff] to-[#ff54c7] shadow-[0_0_30px_rgba(255,84,199,0.65)]" />
      </div>
    </div>
  );
}

function ProjectsVisual() {
  return (
    <div
      className="pointer-events-none absolute bottom-2 right-2 z-0 hidden h-24 w-32 opacity-90 sm:block xl:bottom-3 xl:right-3 xl:h-28 xl:w-36"
      aria-hidden="true"
    >
      <div className="absolute right-0 top-0 z-10 h-16 w-20 rounded-lg border border-[#ff4bc1]/45 bg-white/[0.04] shadow-[0_0_28px_rgba(255,75,193,0.22)] transition-all duration-500 ease-out group-hover/projects:-translate-x-8 group-hover/projects:translate-y-6 group-hover/projects:scale-105 group-hover/projects:border-[#ff4bc1]/70 group-hover/projects:z-30 xl:h-20 xl:w-24" />
      <div className="absolute right-3 top-3 z-20 h-16 w-20 rounded-lg border border-[#736cff]/45 bg-white/[0.05] shadow-[0_0_28px_rgba(95,91,255,0.2)] transition-all duration-500 ease-out group-hover/projects:-translate-x-3 group-hover/projects:translate-y-2 xl:h-20 xl:w-24" />
      <div className="absolute bottom-0 left-0 z-30 h-16 w-20 rounded-lg border border-[#6178ff]/70 bg-[#080b25] shadow-[0_0_30px_rgba(93,105,255,0.28)] transition-all duration-500 ease-out group-hover/projects:translate-x-8 group-hover/projects:-translate-y-5 group-hover/projects:scale-95 group-hover/projects:border-[#6178ff]/45 group-hover/projects:z-10 xl:h-20 xl:w-24">
        <div className="flex h-6 items-center gap-1.5 border-b border-white/10 px-3">
          <span className="h-2 w-2 rounded-full bg-[#ff4bc1]" />
          <span className="h-2 w-2 rounded-full bg-[#b85cff]" />
          <span className="h-2 w-2 rounded-full bg-[#607bff]" />
        </div>
        <div className="px-3 pt-2">
          <div className="mb-2 h-1.5 w-10 rounded-full bg-white/18" />
          <svg viewBox="0 0 92 46" className="h-9 w-full xl:h-10">
            <path
              d="M0 36 C12 14 24 12 37 32 C48 48 58 28 66 18 C75 6 84 11 92 23 L92 46 L0 46 Z"
              fill="url(#projectsWave)"
            />
            <defs>
              <linearGradient id="projectsWave" x1="0" x2="92" y1="0" y2="0">
                <stop stopColor="#ff4bc1" />
                <stop offset="1" stopColor="#527dff" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function StackVisual() {
  return (
    <div
      className="pointer-events-none absolute right-4 top-1/2 hidden h-32 w-32 -translate-y-1/2 transition-transform duration-700 ease-out group-hover/stack:rotate-[18deg] group-hover/stack:scale-105 sm:block xl:right-5 xl:h-40 xl:w-40"
      aria-hidden="true"
    >
      <div className="absolute inset-8 rounded-full border border-[#755cff]/55 shadow-[0_0_28px_rgba(117,92,255,0.2)]" />
      <div className="absolute inset-4 rounded-full border border-dashed border-[#ff4bc1]/35 transition-transform duration-700 motion-safe:group-hover/stack:animate-[spin_8s_linear_infinite] motion-reduce:animate-none">
        <span className="absolute right-7 top-0 h-2.5 w-2.5 rounded-full bg-[#d457ff] shadow-[0_0_18px_rgba(212,87,255,0.9)]" />
        <span className="absolute bottom-3 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#6b7dff] shadow-[0_0_16px_rgba(107,125,255,0.9)]" />
      </div>
      <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#7d62ff]/55 bg-[#11102b] shadow-[0_0_40px_rgba(144,82,255,0.34)] xl:h-16 xl:w-16">
        <Box className="h-7 w-7 text-[#8f66ff] xl:h-8 xl:w-8" strokeWidth={1.6} />
      </div>
      <div className="absolute left-1/2 top-0 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-[#16172c] text-white shadow-[0_0_24px_rgba(79,125,255,0.25)]">
        <Code2 className="h-4 w-4" />
      </div>
      <div className="absolute right-0 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#16172c] text-white shadow-[0_0_24px_rgba(79,125,255,0.25)]">
        <Database className="h-4 w-4" />
      </div>
      <div className="absolute bottom-0 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-[#16172c] text-white shadow-[0_0_24px_rgba(79,125,255,0.25)]">
        <Cloud className="h-4 w-4" />
      </div>
      <div className="absolute left-0 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#16172c] text-white shadow-[0_0_24px_rgba(255,75,193,0.25)]">
        <TerminalSquare className="h-4 w-4" />
      </div>
    </div>
  );
}

function HeartbeatVisual() {
  return (
    <svg
      className="pointer-events-none absolute bottom-2 right-4 hidden h-[68%] w-[58%] opacity-95 md:block"
      viewBox="0 0 620 240"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="heartbeatGradient" x1="64" y1="118" x2="560" y2="118">
          <stop stopColor="#ff4bc1" />
          <stop offset="0.48" stopColor="#c45cff" />
          <stop offset="1" stopColor="#4f7dff" />
        </linearGradient>
        <filter id="heartbeatGlow" x="-20%" y="-70%" width="140%" height="240%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M38 128 H134 C154 128 157 121 171 121 C187 121 191 138 207 138 C229 138 231 78 254 78 C281 78 285 125 305 126 C325 127 328 117 346 119 C370 122 373 175 391 176 C414 177 421 34 442 34 C466 34 470 173 493 174 C516 175 522 97 546 96 C568 95 572 128 592 128"
        stroke="url(#heartbeatGradient)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
        filter="url(#heartbeatGlow)"
        opacity="0.96"
      >
        <animate
          attributeName="stroke-dasharray"
          values="0 760;760 0;760 0"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M38 128 H592"
        stroke="url(#heartbeatGradient)"
        strokeDasharray="5 20"
        strokeLinecap="round"
        strokeWidth="1"
        opacity="0.26"
      />
    </svg>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animateCounters, setAnimateCounters] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const counterTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 78%",
      once: true,
      onEnter: () => setAnimateCounters(true),
    });

    const revealTween = gsap.fromTo(
      sectionRef.current.querySelectorAll(".stat-item"),
      { opacity: 0, y: 34 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
        },
      }
    );

    return () => {
      counterTrigger.kill();
      revealTween.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full px-4 py-12 sm:px-8 md:px-16 lg:min-h-screen lg:py-8"
    >
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="mb-4 lg:mb-3">
          <h2 className="text-4xl font-black tracking-normal text-white sm:text-5xl lg:text-[3.25rem] lg:leading-none">
            Life Stat
          </h2>
          <div className="mt-2 h-1 w-14 rounded-full bg-gradient-to-r from-[#ff4bc1] to-[#527dff] shadow-[0_0_18px_rgba(255,75,193,0.65)]" />
          <p className="mt-3 max-w-2xl text-base text-white/62 sm:text-lg lg:text-base">
            A quick snapshot of experience, output, and how I build.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:h-[calc(100dvh-170px)] lg:min-h-[390px] lg:max-h-[470px] lg:grid-cols-[0.92fr_1.08fr]">
          <article className="stat-item group/experience relative min-h-[480px] overflow-hidden rounded-[1.6rem] border border-[#7b8cff]/55 bg-[radial-gradient(circle_at_0%_0%,rgba(255,75,193,0.22),transparent_34%),radial-gradient(circle_at_100%_0%,rgba(78,114,255,0.2),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_42%,rgba(5,8,18,0.98))] p-7 shadow-[0_0_34px_rgba(255,75,193,0.18)] sm:p-9 lg:h-full lg:min-h-0 lg:p-6">
            <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:56px_56px]" />
            <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-[#ff4bc1] via-transparent to-[#527dff]" />
            <GalaxyVisual />

            <div className="relative z-10 flex h-full max-w-[360px] flex-col justify-center">
              <div className="mb-6 flex items-center gap-4 xl:mb-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#ff69cb]/30 bg-[#ff4bc1]/10 text-[#ff68ce] shadow-[0_0_22px_rgba(255,75,193,0.18)] xl:h-12 xl:w-12">
                  <UserRound className="h-5 w-5" />
                </span>
                <span className="text-sm font-black uppercase tracking-[0.22em] text-[#ff6ad1] sm:text-base">
                  Experience
                </span>
              </div>

              <AnimatedCounter
                target={6}
                suffix="+"
                shouldAnimate={animateCounters}
                className="text-[4.75rem] font-black leading-[0.8] tracking-normal sm:text-[5.5rem] xl:text-[6rem]"
              />
              <h3 className="mt-4 text-3xl font-black tracking-normal text-white sm:text-[2rem]">
                Years Building
              </h3>
              <p className="mt-3 text-base leading-relaxed text-white/66 sm:text-lg">
                Shipping interfaces, systems, and product ideas over time.
              </p>
            </div>
          </article>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:h-full lg:grid-rows-2">
            <article className="stat-item group/projects relative min-h-[260px] overflow-hidden rounded-[1.5rem] border border-[#ff4bc1]/45 bg-[radial-gradient(circle_at_95%_0%,rgba(255,75,193,0.34),transparent_24%),linear-gradient(135deg,rgba(255,75,193,0.12),rgba(5,7,17,0.97)_48%)] p-6 shadow-[0_0_28px_rgba(255,75,193,0.14)] lg:h-full lg:min-h-0 lg:p-5">
              <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:46px_46px]" />
              <ProjectsVisual />
              <div className="relative z-10 max-w-[250px]">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ff69cb]/30 bg-[#ff4bc1]/10 text-[#ff68ce] xl:h-11 xl:w-11">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-black uppercase tracking-[0.22em] text-[#ff68ce]">
                    Projects
                  </span>
                </div>
                <AnimatedCounter
                  target={100}
                  suffix="+"
                  shouldAnimate={animateCounters}
                  className="text-5xl font-black leading-none sm:text-[3.35rem]"
                />
                <h3 className="mt-2 text-xl font-black text-white xl:text-[1.35rem]">
                  Projects Built
                </h3>
                <p className="mt-1.5 text-sm leading-snug text-white/66 xl:text-[0.95rem]">
                  From dashboards to mini products and sharp experiments.
                </p>
              </div>
            </article>

            <article className="stat-item group/stack relative min-h-[260px] overflow-hidden rounded-[1.5rem] border border-[#6279ff]/45 bg-[radial-gradient(circle_at_95%_0%,rgba(82,125,255,0.32),transparent_25%),linear-gradient(135deg,rgba(93,95,255,0.12),rgba(5,8,18,0.98)_50%)] p-6 shadow-[0_0_28px_rgba(82,125,255,0.14)] lg:h-full lg:min-h-0 lg:p-5">
              <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:46px_46px]" />
              <StackVisual />
              <div className="relative z-10 max-w-[245px]">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#8074ff]/30 bg-[#615cff]/12 text-[#a78bff] xl:h-11 xl:w-11">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-black uppercase tracking-[0.22em] text-[#9a83ff]">
                    Stack
                  </span>
                </div>
                <AnimatedCounter
                  target={12}
                  suffix="+"
                  shouldAnimate={animateCounters}
                  className="text-5xl font-black leading-none sm:text-[3.35rem]"
                />
                <h3 className="mt-2 text-xl font-black text-white xl:text-[1.35rem]">
                  Core Technologies
                </h3>
                <p className="mt-1.5 text-sm leading-snug text-white/66 xl:text-[0.95rem]">
                  Frontend, backend, UI systems, APIs, and databases.
                </p>
              </div>
            </article>

            <article className="stat-item relative min-h-[240px] overflow-hidden rounded-[1.5rem] border border-[#9d55ff]/45 bg-[radial-gradient(circle_at_0%_0%,rgba(255,75,193,0.22),transparent_26%),radial-gradient(circle_at_100%_0%,rgba(79,125,255,0.22),transparent_28%),linear-gradient(135deg,rgba(255,75,193,0.08),rgba(5,7,18,0.98)_45%)] p-6 shadow-[0_0_30px_rgba(255,75,193,0.12)] md:col-span-2 lg:h-full lg:min-h-0 lg:p-5">
              <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:56px_56px]" />
              <HeartbeatVisual />
              <div className="relative z-10 max-w-[360px]">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ff69cb]/30 bg-[#ff4bc1]/10 text-[#ff68ce] xl:h-11 xl:w-11">
                    <InfinityIcon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-black uppercase tracking-[0.22em] text-[#ff68ce]">
                    Mindset
                  </span>
                </div>
                <div className="bg-gradient-to-r from-[#ff4bc1] via-[#b85cff] to-[#527dff] bg-clip-text text-5xl font-black leading-none text-transparent sm:text-[3.35rem]">
                  &infin;
                </div>
                <h3 className="mt-2 text-xl font-black text-white xl:text-[1.35rem]">
                  Still Obsessed
                </h3>
                <p className="mt-1.5 text-sm leading-snug text-white/66 xl:text-[0.95rem]">
                  Always learning, refining, and pushing for better execution.
                </p>
              </div>
              <Layers3
                className="absolute bottom-7 right-8 h-10 w-10 text-[#527dff]/30 md:hidden"
                aria-hidden="true"
              />
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
