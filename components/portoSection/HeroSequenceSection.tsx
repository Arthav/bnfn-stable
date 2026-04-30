"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const LAST_SOURCE_FRAME = 80;
const SELECTED_FRAME_NUMBERS = [
  1,
  ...Array.from({ length: LAST_SOURCE_FRAME / 5 }, (_, index) => (index + 1) * 5),
];
const TOTAL_SCENES = 5;

export default function HeroSequenceSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [currentScene, setCurrentScene] = useState(0);

  const scenes = useMemo(
    () => [
      {
        eyebrow: "SCENE 02",
        headline: [
          "SOME WORK DOESN'T",
          "NEED A PITCH.",
          "IT JUST NEEDS",
          "A LITTLE DARKNESS",
          "AND YOUR ATTENTION.",
        ],
        sub: "Keep scrolling. Everything below is something I built when no one asked me to.",
      },
      {
        eyebrow: "STILL HERE",
        headline: [
          "I DON'T BUILD",
          "FOR THE FEED.",
          "I BUILD FOR THE",
          "PEOPLE WHO STAY",
          "PAST THE FIRST",
          "SCROLL.",
        ],
        sub: "You're one of them. Let's get into it.",
      },
      {
        eyebrow: "OFF THE RECORD",
        headline: [
          "MOST OF WHAT I",
          "MAKE NEVER GETS",
          "POSTED.",
          "YOU'RE ABOUT TO",
          "SEE WHY THAT'S",
          "CHANGING.",
        ],
        sub: "A short list of things that survived the doubt.",
      },
      {
        eyebrow: "LATE NIGHTS, MOSTLY",
        headline: [
          "BUILT IN THE",
          "HOURS NOBODY",
          "WAS WATCHING.",
          "SHIPPED ANYWAY.",
        ],
        sub: "Side projects, half-finished thoughts, and a few things that worked.",
      },
      {
        eyebrow: "GO AHEAD",
        headline: [
          "SCROLL SLOWER.",
          "THIS PART WAS",
          "WORTH THE WORK.",
        ],
        sub: "Three years of building quietly, condensed into the next ninety seconds.",
      },
    ],
    []
  );

  const frames = useMemo(
    () =>
      SELECTED_FRAME_NUMBERS.map((sourceFrame) => {
        const frameNumber = String(sourceFrame).padStart(3, "0");

        return {
          sourceFrame,
          src: `/images/hero/ezgif-frame-${frameNumber}.png`,
        };
      }),
    []
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.2,
  });

  const frameIndex = useTransform(smoothProgress, (value) =>
    Math.min(frames.length - 1, Math.floor(value * (frames.length - 1)))
  );

  const sceneIndex = useTransform(smoothProgress, (value) =>
    Math.min(TOTAL_SCENES - 1, Math.floor(value * TOTAL_SCENES))
  );

  useMotionValueEvent(frameIndex, "change", (latestFrame) => {
    setCurrentFrame((previousFrame) =>
      previousFrame === latestFrame ? previousFrame : latestFrame
    );
  });

  useMotionValueEvent(sceneIndex, "change", (latestScene) => {
    setCurrentScene((previousScene) =>
      previousScene === latestScene ? previousScene : latestScene
    );
  });

  useEffect(() => {
    const preloadFrames = () => {
      frames.forEach(({ src }) => {
        const image = new window.Image();
        image.src = src;
      });
    };

    const timeoutId = window.setTimeout(preloadFrames, 150);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [frames]);

  const activeScene = scenes[currentScene];
  const activeFrame = frames[currentFrame];

  return (
    <section
      ref={sectionRef}
      id="hero-sequence"
      className="relative h-[420vh] w-full bg-black"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <Image
          src={activeFrame.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none select-none object-cover"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.28)_72%,rgba(0,0,0,0.8)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

        <div className="absolute left-0 top-0 flex w-full items-start justify-between px-5 py-5 text-[10px] uppercase tracking-[0.35em] text-white/70 md:px-8 md:py-8">
          <span>Private Archive</span>
          <span>
            {String(activeFrame.sourceFrame).padStart(3, "0")} /{" "}
            {String(LAST_SOURCE_FRAME).padStart(3, "0")}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 w-full px-5 pb-10 md:px-8 md:pb-14">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScene.eyebrow}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -22, filter: "blur(12px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-white/55">
                  {activeScene.eyebrow}
                </p>

                <h2 className="max-w-3xl text-3xl font-black uppercase leading-[0.88] tracking-[-0.04em] text-white sm:text-5xl md:text-7xl">
                  {activeScene.headline.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
                  {activeScene.sub}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
