"use client";
import { useRef } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame,
} from "framer-motion";

interface ParallaxProps {
    children: string;
    baseVelocity: number;
}

const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400,
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false,
    });

    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef<number>(1);
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className="parallax overflow-hidden flex flex-nowrap m-0 whitespace-nowrap leading-[0.8]">
            <motion.div
                className="scroller font-bold uppercase text-[9rem] md:text-[12rem] flex whitespace-nowrap flex-nowrap"
                style={{ x }}
            >
                <span className="block mr-12 opacity-10">{children} </span>
                <span className="block mr-12 opacity-10">{children} </span>
                <span className="block mr-12 opacity-10">{children} </span>
                <span className="block mr-12 opacity-10">{children} </span>
            </motion.div>
        </div>
    );
}

export default function Marquee() {
    return (
        <section className="absolute top-[20%] w-full z-0 pointer-events-none select-none mix-blend-overlay opacity-30">
            <ParallaxText baseVelocity={-2}>DEVELOPER CREATOR ENGINEER</ParallaxText>
            <ParallaxText baseVelocity={2}>DESIGN CODE SHIP</ParallaxText>
        </section>
    );
}
