"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface TransitionCurtainProps {
    isLoading: boolean;
    isPageTransition?: boolean;
}

const loadingTexts = [
    "Crafting your brand identity...",
    "Analyzing market trends...",
    "Selecting the perfect typography...",
    "Harmonizing color palettes...",
    "Finalizing brand assets...",
];

export function TransitionCurtain({ isLoading, isPageTransition = false }: TransitionCurtainProps) {
    const [textIndex, setTextIndex] = useState(0);
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!isLoading) {
            setTextIndex(0);
            setElapsed(0);
            return;
        }

        const interval = setInterval(() => {
            setTextIndex((prev) => (prev + 1) % loadingTexts.length);
        }, 3000);

        const timer = setInterval(() => {
            setElapsed((prev) => prev + 1);
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(timer);
        };
    }, [isLoading]);

    // Custom deep purple color for the curtain
    const curtainColor = "bg-[#2E1065]"; // deep purple-950 equivalent or similar

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
                    {/* Left Panel */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} // Custom bezier for smooth "shut"
                        className={`absolute left-0 top-0 bottom-0 w-1/2 ${curtainColor} z-10 border-r border-white/10`}
                    />

                    {/* Right Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: "0%" }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className={`absolute right-0 top-0 bottom-0 w-1/2 ${curtainColor} z-10 border-l border-white/10`}
                    />

                    {/* Content Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1, transition: { delay: 0.4 } }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className="relative z-20 flex flex-col items-center justify-center text-white"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="mb-6"
                        >
                            <Loader2 className="w-12 h-12 text-purple-300" />
                        </motion.div>

                        <h2 className="text-4xl font-bold mb-3 tracking-tight">Please Wait</h2>
                        <h3 className="text-4xl font-bold mb-3 tracking-tight">Estimated wait time: 2 minutes</h3>
                        <p className="text-lg text-purple-300 mb-3 font-mono">
                            Elapsed: {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}
                        </p>

                        <div className="h-8 flex items-center justify-center overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={textIndex}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-purple-200 text-lg font-light"
                                >
                                    {isPageTransition ? "Navigating..." : loadingTexts[textIndex]}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
