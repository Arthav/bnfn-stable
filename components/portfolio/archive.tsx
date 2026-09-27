"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { archiveScenes } from "./content";
import { useQuietMotion } from "./motion";
import styles from "./portfolio.module.css";

// Reuse the original portrait, delivered through Next's responsive image optimizer.
export function Archive() {
  const ref = useRef<HTMLElement>(null);
  const quiet = useQuietMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.12]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={ref}
      id="hero-sequence"
      className={styles.archive}
      aria-labelledby="archive-title"
    >
      <div className={styles.archiveImage}>
        <motion.div
          className={styles.archiveImageMotion}
          style={{ scale: quiet ? 1 : scale, y: quiet ? 0 : imageY }}
        >
          <Image
            src="/images/hero/ezgif-frame-040.png"
            alt="Portrait from Christian's private archive"
            fill
            sizes="(max-width: 760px) 100vw, 55vw"
            quality={80}
          />
        </motion.div>
        <div className={styles.archiveImageShade} />
        <span className={styles.archiveLabel}>
          Private archive <ArrowDownRight size={18} />
        </span>
        <span className={styles.archiveImageCaption}>
          Built in the hours
          <br />
          nobody was watching.
        </span>
      </div>
      <div className={styles.archiveStories}>
        {archiveScenes.map((scene, index) => (
          <ArchiveStory key={scene.eyebrow} scene={scene} first={index === 0} />
        ))}
      </div>
    </section>
  );
}

function ArchiveStory({
  scene,
  first,
}: {
  scene: (typeof archiveScenes)[number];
  first: boolean;
}) {
  const heading = scene.headline
    .join(" ")
    .toLowerCase()
    .replace(/\bi\b/g, "I")
    .replace(
      /(^|[.!?]\s+)([a-z])/g,
      (_, prefix, letter) => prefix + letter.toUpperCase(),
    );
  const ref = useRef<HTMLDivElement>(null);
  const quiet = useQuietMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.7, 1],
    [0.25, 1, 1, 0.25],
  );
  const y = useTransform(scrollYProgress, [0, 1], [45, -45]);

  return (
    <div ref={ref} className={styles.archiveStory}>
      <motion.div style={{ opacity: quiet ? 1 : opacity, y: quiet ? 0 : y }}>
        <span className={styles.eyebrow}>{scene.eyebrow}</span>
        {first ? <h2 id="archive-title">{heading}</h2> : <h3>{heading}</h3>}
        <p>{scene.sub}</p>
      </motion.div>
    </div>
  );
}
