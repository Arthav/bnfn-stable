"use client";
import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
    const [isHovered, setIsHovered] = useState(false);
    const cursorSize = isHovered ? 60 : 20;

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX - cursorSize / 2);
            mouseY.set(e.clientY - cursorSize / 2);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName.toLowerCase() === "a" ||
                target.tagName.toLowerCase() === "button" ||
                target.closest("a") ||
                target.closest("button")
            ) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [cursorSize, mouseX, mouseY]);

    return (
        <motion.div
            className="fixed top-0 left-0 bg-white mix-blend-difference rounded-full pointer-events-none z-[9999]"
            style={{
                translateX: cursorX,
                translateY: cursorY,
            }}
            animate={{
                width: cursorSize,
                height: cursorSize,
            }}
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 28,
            }}
        />
    );
}
