"use client";
import React, { useEffect } from "react";
import Skills from "@/components/portoSection/Skills";

import BioSection from "@/components/portoSection/bio";
import StatsSection from "@/components/portoSection/StatsSection";
import ExperienceTimeline from "@/components/portoSection/ExperienceTimeline";
import ProjectsShowcase from "@/components/portoSection/ProjectsShowcase";
import ContactFooter from "@/components/portoSection/ContactFooter";
import Marquee from "@/components/ui/Marquee";
import Magnetic from "@/components/ui/Magnetic";
import { motion } from "framer-motion";


export default function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer/build/spline-viewer.js";
    script.async = true;

    script.onload = () => {
      const splineViewer = document.querySelector("spline-viewer");
      if (splineViewer) {
        const shadowRoot = splineViewer.shadowRoot;
        if (shadowRoot) {
          const logoElement = shadowRoot.querySelector("#logo");
          if (logoElement) {
            logoElement.remove();
          }
        }
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 w-full">
      {/* Hero section */}
      {/* Hero section */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
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
      className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mt-8 font-light tracking-wide mix-blend-difference"
    >
      Full Stack Engineer crafting digital experiences that matter.
    </motion.p>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="flex gap-6 mt-12"
    >
      <Magnetic>
        <a
          href="https://www.linkedin.com/in/cbonz/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-black text-lg font-bold rounded-full overflow-hidden transition-all hover:bg-gray-200"
        >
          <span className="relative z-10 group-hover:text-black transition-colors">
            Let&apos;s Connect
          </span>
          <div className="absolute inset-0 bg-white rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out origin-center opacity-10" />
        </a>
      </Magnetic>

      <Magnetic>
        <button
          className="group relative inline-flex items-center justify-center px-8 py-4 border border-white/30 text-white text-lg font-bold rounded-full overflow-hidden transition-all hover:border-white"
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


