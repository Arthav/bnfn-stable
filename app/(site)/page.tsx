"use client";
import Skills from "@/components/portoSection/Skills";
import HeroSequenceSection from "@/components/portoSection/HeroSequenceSection";

import StatsSection from "@/components/portoSection/StatsSection";
import ExperienceTimeline from "@/components/portoSection/ExperienceTimeline";
import ProjectsShowcase from "@/components/portoSection/ProjectsShowcase";
import ContactFooter from "@/components/portoSection/ContactFooter";
import Magnetic from "@/components/ui/Magnetic";
import { hyperspeedPresets } from "@/components/HyperSpeedPresets";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Hyperspeed = dynamic(() => import("@/components/Hyperspeed"), {
  ssr: false,
});

export default function Home() {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-4 overflow-x-clip">
      {/* Hero section */}
      <div className="relative w-full overflow-hidden bg-black">
        <div className="relative isolate flex h-[calc(100vh-64px)] w-full flex-col items-center justify-center overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 opacity-90"
          >
            <Hyperspeed effectOptions={hyperspeedPresets.three} />
          </div>
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/10 to-black/70" />

          {heroSection}
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
  <div className="relative z-20 flex w-full flex-col items-center justify-center px-4 text-center">
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
      className="mx-auto mt-8 max-w-[19rem] text-lg font-light tracking-wide text-gray-300 sm:max-w-2xl md:text-2xl"
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


