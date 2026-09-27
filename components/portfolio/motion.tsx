"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode, PointerEvent } from "react";
import {
  MotionConfig,
  motion,
  animate,
  useSpring,
  useReducedMotion,
  useInView,
} from "framer-motion";

import styles from "./portfolio.module.css";

const MotionContext = createContext(true);
export const useQuietMotion = () => useContext(MotionContext);
export const ease = [0.22, 1, 0.36, 1] as const;

export function PortfolioMotion({ children }: { children: ReactNode }) {
  const systemReduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const quiet = Boolean(systemReduced || paused);

  return (
    <MotionContext.Provider value={quiet}>
      <MotionConfig reducedMotion={quiet ? "always" : "never"}>
        <div
          className={styles.motionRoot}
          data-portfolio-motion={quiet ? "paused" : "playing"}
        >
          {children}
          <button
            aria-label={quiet ? "Enable animations" : "Pause animations"}
            aria-pressed={quiet}
            className={styles.motionToggle}
            disabled={Boolean(systemReduced)}
            onClick={() => setPaused((value) => !value)}
            title={
              systemReduced
                ? "Following your reduced motion preference"
                : undefined
            }
            type="button"
          >
            <span aria-hidden="true">{quiet ? "▶" : "Ⅱ"}</span>
            Motion {quiet ? "off" : "on"}
          </button>
        </div>
      </MotionConfig>
    </MotionContext.Provider>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const quiet = useQuietMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -30px 0px" });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Visible server markup remains readable if JavaScript is unavailable.
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={
        !mounted || quiet || inView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 34 }
      }
      transition={{ duration: quiet ? 0 : 0.8, delay: quiet ? 0 : delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function MagneticLink({
  children,
  className,
  href,
  external = false,
}: {
  children: ReactNode;
  className?: string;
  href: string;
  external?: boolean;
}) {
  const quiet = useQuietMotion();
  const x = useSpring(0, { stiffness: 180, damping: 16 });
  const y = useSpring(0, { stiffness: 180, damping: 16 });

  function move(event: PointerEvent<HTMLAnchorElement>) {
    if (quiet || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.16);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.2);
  }

  return (
    <motion.a
      className={className}
      href={href}
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: quiet ? 0 : x, y: quiet ? 0 : y }}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </motion.a>
  );
}

export function Counter({
  value,
  suffix = "+",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const quiet = useQuietMotion();
  useEffect(() => {
    if (!ref.current) return;
    if (quiet) {
      ref.current.textContent = `${value}${suffix}`;
      return;
    }
    if (!inView) return;
    const animation = animate(0, value, {
      duration: 1.8,
      ease,
      onUpdate: (latest) => {
        if (ref.current)
          ref.current.textContent = `${Math.round(latest)}${suffix}`;
      },
    });
    return () => animation.stop();
  }, [inView, quiet, value, suffix]);

  return (
    <span aria-label={`${value}${suffix}`}>
      <span ref={ref} aria-hidden="true">
        {value}
        {suffix}
      </span>
    </span>
  );
}
