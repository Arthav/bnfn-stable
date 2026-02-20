"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                }}
            >
                {/* 
                  We could define the curtain animation here as well using nested motion divs 
                  that animate in/out on mount/unmount. 
                  
                  Entry Animation:
                  - Initial: Curtain Closed (covering screen)
                  - Animate: Curtain Open (revealing content)
                  
                  Exit Animation:
                  - Initial: Content visible
                  - Exit: Curtain Closed (covering content)
                */}
                <GlobalCurtain />
                {children}
            </motion.div>
        </>
    );
}

function GlobalCurtain() {
    const curtainColor = "bg-[#2E1065]";

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none flex" aria-hidden="true">
            {/* Left Panel */}
            <motion.div
                initial={{ x: "0%" }}
                animate={{ x: "-100%" }}
                exit={{ x: "0%" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`w-1/2 h-full ${curtainColor} border-r border-white/10`}
            />

            {/* Right Panel */}
            <motion.div
                initial={{ x: "0%" }}
                animate={{ x: "100%" }}
                exit={{ x: "0%" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`w-1/2 h-full ${curtainColor} border-l border-white/10`}
            />
        </div>
    );
}
