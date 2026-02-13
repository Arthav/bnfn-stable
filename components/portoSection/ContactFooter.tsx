"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    FaLinkedin,
    FaGithub,
    FaEnvelope,
    FaArrowUp,
} from "react-icons/fa";

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
        href: "https://github.com/",
        color: "hover:text-gray-300",
    },
    {
        icon: FaEnvelope,
        label: "Email",
        href: "mailto:hello@bonafena.dev",
        color: "hover:text-pink-400",
    },
];

export default function ContactFooter() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        gsap.fromTo(
            sectionRef.current.querySelector(".contact-content"),
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            }
        );
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div ref={sectionRef} className="w-full mt-24">
            {/* Contact CTA */}
            <div className="contact-content relative overflow-hidden rounded-3xl mx-4 sm:mx-8 md:mx-16 p-12 md:p-16 text-center bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-blue-900/40 border border-white/10 backdrop-blur-sm">
                {/* Decorative blur circles */}
                <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl" />

                <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-gray-900 mb-4 relative z-10">
                    Let&apos;s Build Something{" "}
                    <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
                        Amazing
                    </span>
                </h2>
                <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8 relative z-10">
                    I&apos;m always open to new opportunities, collaborations, and
                    interesting projects. Feel free to reach out!
                </p>

                <div className="flex flex-wrap justify-center gap-4 relative z-10">
                    <a
                        href="https://www.linkedin.com/in/cbonz/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
                    >
                        <FaLinkedin />
                        Connect on LinkedIn
                    </a>
                    <a
                        href="mailto:hello@bonafena.dev"
                        className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 hover:scale-105 transition-all duration-300"
                    >
                        <FaEnvelope />
                        Send an Email
                    </a>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-16 pb-8 px-4 sm:px-8 md:px-16">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-8">
                    {/* Left — branding */}
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                            Christian Bonafena
                        </span>
                        <span className="text-sm text-gray-500">
                            © {new Date().getFullYear()} All rights reserved.
                        </span>
                    </div>

                    {/* Center — social icons */}
                    <div className="flex gap-5">
                        {socials.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                className={`text-gray-500 text-xl transition-colors duration-300 ${social.color}`}
                            >
                                <social.icon />
                            </a>
                        ))}
                    </div>

                    {/* Right — back to top */}
                    <button
                        onClick={scrollToTop}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-400 transition-colors duration-300"
                    >
                        Back to top
                        <FaArrowUp className="text-xs" />
                    </button>
                </div>
            </footer>
        </div>
    );
}
