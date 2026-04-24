"use client";
import React, { useEffect } from "react";
import Skills from "@/components/portoSection/Skills";
import HeroSequenceSection from "@/components/portoSection/HeroSequenceSection";

import BioSection from "@/components/portoSection/bio";
import StatsSection from "@/components/portoSection/StatsSection";
import ExperienceTimeline from "@/components/portoSection/ExperienceTimeline";
import ProjectsShowcase from "@/components/portoSection/ProjectsShowcase";
import ContactFooter from "@/components/portoSection/ContactFooter";
import SinePathMarquee from "@/components/portoSection/SinePathMarquee";
import Marquee from "@/components/ui/Marquee";
import Magnetic from "@/components/ui/Magnetic";
import { motion } from "framer-motion";


export default function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer/build/spline-viewer.js";
    script.async = true;

    const badgeSelectors = [
      "#logo",
      "a#logo",
      "a[href*='spline.design']",
      "[aria-label*='Spline' i]",
      "[title*='Spline' i]",
    ].join(",");
    const observedShadowRoots = new WeakSet<ShadowRoot>();
    let observer: MutationObserver | null = null;

    // Remove Spline's runtime badge after its shadow DOM finishes rendering.
    const removeSplineBadge = () => {
      document.querySelectorAll<HTMLElement>("spline-viewer").forEach((viewer) => {
        const shadowRoot = viewer.shadowRoot;

        if (!shadowRoot) {
          return;
        }

        if (observer && !observedShadowRoots.has(shadowRoot)) {
          observer.observe(shadowRoot, { childList: true, subtree: true });
          observedShadowRoots.add(shadowRoot);
        }

        shadowRoot.querySelectorAll<HTMLElement>(badgeSelectors).forEach((badge) => {
          badge.remove();
        });
      });
    };

    document.body.appendChild(script);

    observer = new MutationObserver(removeSplineBadge);
    observer.observe(document.body, { childList: true, subtree: true });

    const badgeCleanupInterval = window.setInterval(removeSplineBadge, 250);
    const stopBadgeCleanupTimeout = window.setTimeout(() => {
      window.clearInterval(badgeCleanupInterval);
    }, 8000);

    script.addEventListener("load", removeSplineBadge);
    removeSplineBadge();

    return () => {
      observer?.disconnect();
      window.clearInterval(badgeCleanupInterval);
      window.clearTimeout(stopBadgeCleanupTimeout);
      script.removeEventListener("load", removeSplineBadge);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="flex flex-col items-center justify-center gap-4 w-full">
      {/* Hero section */}
      {/* Hero section */}
      <div className="relative w-full overflow-hidden bg-black">
        <div className="relative flex h-[calc(100vh-64px)] w-full flex-col items-center justify-center overflow-hidden">
          <Marquee />
          <spline-viewer
            style={{
              backgroundColor: "transparent",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
              pointerEvents: "none",
            }}
            url="https://prod.spline.design/pS-PjKUUhIiCodIC/scene.splinecode"
            events-target="global"
          ></spline-viewer>

          {heroSection}
        </div>

        <div className="relative isolate h-[220px] w-full overflow-hidden bg-black sm:h-[240px] md:h-[280px]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[54%] bg-black" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[58%] bg-[radial-gradient(circle_at_50%_8%,rgba(90,10,5,0.65),transparent_58%),linear-gradient(180deg,#120302_0%,#050000_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-[40%] z-0 h-[30%] bg-gradient-to-b from-black via-[#120302]/80 to-[#120302]" />
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_100%,transparent_0%,rgba(0,0,0,0.55)_78%)]" />

          <spline-viewer
            style={{
              backgroundColor: "transparent",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
              opacity: 0.9,
              pointerEvents: "none",
            }}
            url="https://prod.spline.design/pS-PjKUUhIiCodIC/scene.splinecode"
            events-target="global"
          ></spline-viewer>

          <SinePathMarquee />
        </div>
      </div>

      <HeroSequenceSection />

      {/* Skills section */}
      <Skills />

      {/* Bio section */}
      {/* <BioSection /> */}

      {/* Stats section */}
      <StatsSection />

      {/* Experience section */}
      <ExperienceTimeline />

      {/* Projects section */}
      <ProjectsShowcase />

      {/* Contact & Footer */}
      <ContactFooter />
    </section>
  );
}

const heroSection = (
  <div className="flex flex-col items-center justify-center text-center z-10 w-full px-4 relative mix-blend-difference">
    <div className="overflow-hidden">
      <motion.h1
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
        className="text-[12vw] sm:text-[10vw] font-heading font-black leading-[0.8] tracking-tighter text-white select-none"
      >
        CHRISTIAN
      </motion.h1>
    </div>
    <div className="overflow-hidden">
      <motion.h1
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.1 }}
        className="text-[12vw] sm:text-[10vw] font-heading font-black leading-[0.8] tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 select-none pb-4"
      >
        BONAFENA
      </motion.h1>
    </div>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="text-lg md:text-2xl text-gray-300 max-w-[19rem] sm:max-w-2xl mx-auto mt-8 font-light tracking-wide mix-blend-difference"
    >
      Full Stack Engineer crafting digital experiences that matter.
    </motion.p>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-10 sm:mt-12"
    >
      <Magnetic>
        <a
          href="https://www.linkedin.com/in/cbonz/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center justify-center px-6 py-4 bg-white text-black text-base sm:px-8 sm:text-lg font-bold rounded-full overflow-hidden transition-all hover:bg-gray-200"
        >
          <span className="relative z-10 group-hover:text-black transition-colors">
            Let&apos;s Connect
          </span>
          <div className="absolute inset-0 bg-white rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out origin-center opacity-10" />
        </a>
      </Magnetic>

      <Magnetic>
        <button
          className="group relative inline-flex items-center justify-center px-6 py-4 border border-white/30 text-white text-base sm:px-8 sm:text-lg font-bold rounded-full overflow-hidden transition-all hover:border-white"
          onClick={() => {
            const section = document.getElementById("showcase");
            if (section) {
              section.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <span className="relative z-10">View Work</span>
          <div className="absolute inset-0 bg-white rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out origin-center opacity-10" />
        </button>
      </Magnetic>
    </motion.div>
  </div>
);


