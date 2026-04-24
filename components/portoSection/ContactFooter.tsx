"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Globe2, Mail, Sparkles, Users, Zap } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaArrowUp, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  {
    icon: FaLinkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/cbonz/",
    color: "hover:text-blue-400",
  },
  {
    icon: FaGithub,
    label: "GitHub",
    href: "https://github.com/Arthav",
    color: "hover:text-gray-300",
  },
  {
    icon: FaEnvelope,
    label: "Email",
    href: "mailto:christianbonafena7@gmail.com",
    color: "hover:text-pink-400",
  },
];

const availability = [
  { icon: Users, label: "Open to Collaboration", color: "text-[#ff5ec9]" },
  { icon: Zap, label: "Fast Replies", color: "text-[#9b62ff]" },
  { icon: Globe2, label: "Remote", color: "text-[#a665ff]" },
  { icon: Sparkles, label: "Open to Projects", color: "text-[#b36cff]" },
];

export default function ContactFooter() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const revealTween = gsap.fromTo(
      sectionRef.current.querySelector(".contact-content"),
      { opacity: 0, y: 42, rotateX: -4 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      revealTween.kill();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={sectionRef} className="w-full mt-24">
      <section className="relative mx-4 sm:mx-8 md:mx-16">
        <div
          className="contact-content group relative overflow-hidden rounded-[2rem] border border-[#d97aff]/45 bg-[#05050b] px-5 py-14 text-center shadow-[0_0_50px_rgba(255,76,190,0.18),inset_0_0_70px_rgba(83,110,255,0.08)] sm:px-8 md:rounded-[2.25rem] md:px-12 md:py-20"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="pointer-events-none absolute -inset-6 -z-10 rotate-[-2deg] rounded-[2.35rem] border border-[#9d48ff]/25 bg-[#15091e]/45 shadow-[0_0_48px_rgba(134,74,255,0.12)]" />
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:70px_70px] opacity-35" />
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_7%_40%,rgba(255,70,177,0.36),transparent_16%),radial-gradient(circle_at_92%_68%,rgba(49,101,255,0.38),transparent_19%),radial-gradient(circle_at_50%_0%,rgba(180,78,255,0.18),transparent_34%)]" />
          <div className="pointer-events-none absolute left-0 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ff4ebd]/20 bg-[radial-gradient(circle_at_62%_35%,rgba(255,87,203,0.38),rgba(107,30,114,0.16)_44%,transparent_70%)] blur-[1px]" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 translate-x-1/2 translate-y-1/4 rounded-full border border-[#3776ff]/20 bg-[radial-gradient(circle_at_32%_30%,rgba(67,116,255,0.42),rgba(20,56,146,0.14)_48%,transparent_72%)] blur-[1px]" />
          <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-[#ff74d2] to-transparent shadow-[0_0_18px_rgba(255,116,210,0.95)]" />
          <div className="pointer-events-none absolute inset-x-7 bottom-0 h-px bg-gradient-to-r from-transparent via-[#4981ff] to-transparent shadow-[0_0_18px_rgba(73,129,255,0.95)]" />

          <div className="pointer-events-none absolute left-8 top-8 hidden h-9 w-9 opacity-50 sm:block">
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/30" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/30" />
          </div>
          <div className="pointer-events-none absolute right-8 top-8 hidden h-9 w-9 opacity-50 sm:block">
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/30" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/30" />
          </div>
          <div className="pointer-events-none absolute bottom-8 left-8 hidden h-9 w-9 opacity-50 sm:block">
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/30" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/30" />
          </div>
          <div className="pointer-events-none absolute bottom-8 right-8 hidden h-9 w-9 opacity-50 sm:block">
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/30" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/30" />
          </div>

          <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center">
            <div className="mb-8 flex items-center gap-4 self-start pl-0 font-mono text-xs uppercase tracking-[0.22em] text-white/52 sm:pl-12 md:text-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff69cf] shadow-[0_0_16px_rgba(255,105,207,0.9)]" />
              <span>Contact / Available for Work</span>
            </div>

            <h2 className="max-w-5xl text-balance text-center font-heading text-5xl font-black leading-[0.88] tracking-normal text-white sm:text-6xl md:text-7xl lg:text-8xl">
              Let&apos;s Build
              <br />
              Something{" "}
              <span className="bg-gradient-to-r from-[#ff4fc1] via-[#a855ff] to-[#3f78ff] bg-clip-text text-transparent">
                Amazing
              </span>
            </h2>

            <p className="relative z-10 mt-8 max-w-2xl text-center text-lg leading-relaxed text-white/62 md:text-xl">
              I&apos;m always open to new opportunities, collaborations, and
              interesting projects. Feel free to reach out!
            </p>

            <div className="relative z-10 mt-10 flex w-full max-w-4xl flex-col justify-center gap-5 sm:flex-row">
              <a
                href="https://www.linkedin.com/in/cbonz/"
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex min-h-16 items-center justify-center gap-5 rounded-2xl border border-[#ff8bd8]/70 bg-gradient-to-r from-[#ff4aa8] via-[#a855ff] to-[#286cff] px-8 text-lg font-bold text-white shadow-[0_0_34px_rgba(255,76,190,0.35),0_0_38px_rgba(45,103,255,0.26)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_42px_rgba(255,76,190,0.48),0_0_54px_rgba(45,103,255,0.34)]"
              >
                <FaLinkedin className="text-2xl" />
                <span>Connect on LinkedIn</span>
                <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover/link:translate-x-1" />
              </a>
              <a
                href="mailto:christianbonafena7@gmail.com"
                className="group/link inline-flex min-h-16 items-center justify-center gap-5 rounded-2xl border border-[#b781ff]/65 bg-black/30 px-8 text-lg font-bold text-white shadow-[inset_0_0_24px_rgba(255,255,255,0.03),0_0_24px_rgba(167,96,255,0.16)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#d9a7ff] hover:bg-white/8"
              >
                <Mail className="h-6 w-6" />
                <span>Send an Email</span>
                <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover/link:translate-x-1" />
              </a>
            </div>

            <div className="relative z-10 mt-10 grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {availability.map((item) => (
                <div
                  key={item.label}
                  className="flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-5 text-sm font-medium text-white/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur"
                >
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-16 pb-8 px-4 sm:px-8 md:px-16">
        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <div className="flex flex-col items-center gap-1 md:items-start">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-lg font-bold text-transparent">
              Christian Bonafena
            </span>
            <span className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} All rights reserved.
            </span>
          </div>

          <div className="flex gap-5">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`text-xl text-gray-500 transition-colors duration-300 ${social.color}`}
              >
                <social.icon />
              </a>
            ))}
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-white/60 transition-colors duration-300 hover:text-purple-400"
          >
            Back to top
            <FaArrowUp className="text-xs" />
          </button>
        </div>
      </footer>
    </div>
  );
}
