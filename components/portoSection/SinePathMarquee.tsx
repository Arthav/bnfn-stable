"use client";

import { useReducedMotion } from "framer-motion";

const roles = [
  "PROGRAMMER",
  "DESIGNER",
  "PROJECT MANAGER",
  "CREATOR",
  "SOFTWARE ENGINEER",
  "AGENTIC CODER",
  "OPTIMIZER",
];

const marqueeCopy = `${roles.join(" ⭐ ")}   `;
const repeatedMarqueeCopy = Array.from({ length: 12 }, () => marqueeCopy).join(
  ""
);

export default function SinePathMarquee() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/2 z-[2] h-36 -translate-y-1/2 overflow-hidden mask-linear-gradient sm:h-44 md:h-52">
      <p className="sr-only">{roles.join(", ")}</p>

      <svg
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 h-full w-[190vw] min-w-[96rem] -translate-x-1/2 overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 1440 220"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="hero-sine-upper-gradient"
            x1="0"
            x2="1"
            y1="0"
            y2="0"
          >
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="45%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>

          <linearGradient
            id="hero-sine-lower-gradient"
            x1="0"
            x2="1"
            y1="0"
            y2="0"
          >
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="48%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          <filter
            id="hero-sine-neon-glow"
            x="-20%"
            y="-120%"
            width="140%"
            height="340%"
          >
            <feGaussianBlur stdDeviation="5" result="softGlow" />
            <feGaussianBlur stdDeviation="12" result="wideGlow" />
            <feMerge>
              <feMergeNode in="wideGlow" />
              <feMergeNode in="softGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter
            id="hero-sine-text-shadow"
            x="-10%"
            y="-80%"
            width="120%"
            height="260%"
          >
            <feDropShadow
              dx="0"
              dy="2"
              floodColor="#000000"
              floodOpacity="0.75"
              stdDeviation="2"
            />
          </filter>

          <path
            id="hero-sine-marquee-path"
            d="M -720 118 C -540 56 -360 56 -180 118 S 180 180 360 118 S 720 56 900 118 S 1260 180 1440 118 S 1800 56 1980 118 S 2340 180 2520 118"
          />
        </defs>

        <g filter="url(#hero-sine-neon-glow)" opacity="0.9">
          <use
            href="#hero-sine-marquee-path"
            fill="none"
            stroke="url(#hero-sine-upper-gradient)"
            strokeLinecap="round"
            strokeWidth="2"
            transform="translate(0 -24)"
          />
          <use
            href="#hero-sine-marquee-path"
            fill="none"
            stroke="url(#hero-sine-lower-gradient)"
            strokeLinecap="round"
            strokeOpacity="0.8"
            strokeWidth="2"
            transform="translate(0 24)"
          />
        </g>

        <g filter="url(#hero-sine-text-shadow)">
          <text
            dominantBaseline="middle"
            fill="#ffffff"
            fontSize="21"
            fontWeight="900"
            letterSpacing="1.2"
          >
            <textPath href="#hero-sine-marquee-path" startOffset="0">
              {!shouldReduceMotion ? (
                <animate
                  attributeName="startOffset"
                  dur="24s"
                  from="0%"
                  repeatCount="indefinite"
                  to="-50%"
                />
              ) : null}
              {repeatedMarqueeCopy}
            </textPath>
          </text>
        </g>
      </svg>
    </div>
  );
}
