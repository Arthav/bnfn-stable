"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowUp,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Asterisk,
  Code2,
  Braces,
  Layers3,
  MoveUpRight,
} from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { experiences, skills } from "./content";
import {
  Counter,
  ease,
  MagneticLink,
  PortfolioMotion,
  Reveal,
  useQuietMotion,
} from "./motion";
import { ProjectGallery } from "./projects";
import { Archive } from "./archive";
import styles from "./portfolio.module.css";

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const quiet = useQuietMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const artY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const rotationX = useMotionValue(0);
  const rotationY = useMotionValue(0);
  const rotateX = useSpring(rotationX, { stiffness: 80, damping: 20 });
  const rotateY = useSpring(rotationY, { stiffness: 80, damping: 20 });

  return (
    <section
      ref={ref}
      className={styles.hero}
      aria-labelledby="hero-title"
      onPointerMove={(event) => {
        if (quiet || event.pointerType !== "mouse") return;
        const box = event.currentTarget.getBoundingClientRect();
        rotationX.set(
          ((event.clientY - box.top - box.height / 2) / box.height) * -16,
        );
        rotationY.set(
          ((event.clientX - box.left - box.width / 2) / box.width) * 20,
        );
      }}
      onPointerLeave={() => {
        rotationX.set(0);
        rotationY.set(0);
      }}
    >
      <div className={styles.heroTopline}>
        <span className={styles.eyebrow}>
          Independent spirit. Full stack engineer.
        </span>
        <a className={styles.availability} href="#contact">
          <span />
          Open to collaboration
        </a>
      </div>
      <motion.div
        aria-hidden="true"
        className={styles.heroArt}
        style={{
          y: quiet ? 0 : artY,
          rotateX: quiet ? 0 : rotateX,
          rotateY: quiet ? 0 : rotateY,
        }}
      >
        <div className={styles.orbitHalo} />
        <svg className={styles.orbit} viewBox="0 0 560 560" fill="none">
          <defs>
            <linearGradient
              id="orbit-ink"
              x1="60"
              y1="40"
              x2="450"
              y2="540"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#e7ffaf" />
              <stop offset="0.5" stopColor="#b4d96a" />
              <stop offset="1" stopColor="#485939" />
            </linearGradient>
          </defs>
          <circle
            cx="280"
            cy="280"
            r="249"
            stroke="currentColor"
            strokeOpacity="0.18"
            strokeDasharray="2 8"
          />
          <path
            d="M0 280H560M280 0V560"
            stroke="currentColor"
            strokeOpacity="0.12"
          />
          <g className={styles.orbitRings}>
            {Array.from({ length: 20 }, (_, index) => (
              <ellipse
                key={index}
                cx="280"
                cy="280"
                rx="212"
                ry="95"
                transform={`rotate(${index * 9} 280 280)`}
                stroke="url(#orbit-ink)"
                strokeWidth="1.2"
              />
            ))}
          </g>
          <circle cx="280" cy="31" r="5" fill="#d4f58a" />
          <circle cx="529" cy="280" r="3" fill="#d4f58a" />
        </svg>
        <span className={styles.artCaption}>
          Always learning. Always building.
        </span>
      </motion.div>
      <motion.div
        className={styles.heroTitleWrap}
        style={{ y: quiet ? 0 : titleY }}
      >
        <h1
          id="hero-title"
          aria-label="Christian Bonafena"
          className={styles.heroTitle}
        >
          {["CHRISTIAN", "BONAFENA"].map((word, row) => (
            <span className={styles.titleLine} aria-hidden="true" key={word}>
              {word.split("").map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  initial={false}
                  animate={
                    quiet
                      ? { y: 0, rotate: 0 }
                      : { y: ["115%", "0%"], rotate: [5, 0] }
                  }
                  transition={{
                    duration: 1.1,
                    delay: quiet ? 0 : 0.12 + row * 0.13 + index * 0.035,
                    ease,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
              {row === 1 && <span className={styles.namePeriod}>.</span>}
            </span>
          ))}
        </h1>
      </motion.div>
      <div className={styles.heroBottom}>
        <Reveal delay={0.35} className={styles.heroIntro}>
          <p>Full Stack Engineer crafting digital experiences that matter.</p>
          <div className={styles.heroActions}>
            <MagneticLink className={styles.primaryButton} href="#showcase">
              Explore my work <ArrowDown size={18} />
            </MagneticLink>
            <MagneticLink
              className={styles.textLink}
              href={siteConfig.links.linkedin}
              external
            >
              Let&apos;s connect <ArrowUpRight size={18} />
            </MagneticLink>
          </div>
        </Reveal>
        <div className={styles.heroLocation}>
          <MapPin size={14} />
          <span>
            Surabaya, Indonesia
            <br />
            <span>Building for everywhere.</span>
          </span>
        </div>
      </div>
      <div className={styles.heroBaseline}>
        <span>Code with purpose. Create with curiosity.</span>
        <a href="#about">
          A little more about me <ArrowDown size={14} />
        </a>
      </div>
    </section>
  );
}

function About() {
  const ref = useRef<HTMLElement>(null);
  const quiet = useQuietMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotation = useTransform(scrollYProgress, [0, 1], [-60, 130]);

  return (
    <section
      ref={ref}
      id="about"
      className={`${styles.section} ${styles.about}`}
      aria-labelledby="about-title"
    >
      <div className={styles.aboutIntro}>
        <Reveal>
          <span className={styles.eyebrow}>A little about me</span>
        </Reveal>
        <Reveal>
          <h2 id="about-title" className={styles.statement}>
            Interfaces. Systems.
            <br />
            Ideas made <span>real.</span>
          </h2>
          <p className={styles.sectionCopy}>
            From dashboards to mini products and sharp experiments. Always
            learning, refining, and pushing for better execution.
          </p>
        </Reveal>
        <motion.div
          aria-hidden="true"
          className={styles.aboutAsterisk}
          style={{ rotate: quiet ? 0 : rotation }}
        >
          <Asterisk strokeWidth={0.8} />
        </motion.div>
      </div>
      <div className={styles.stats}>
        {[
          {
            value: 6,
            label: "Years building",
            detail:
              "Shipping interfaces, systems, and product ideas over time.",
          },
          {
            value: 100,
            label: "Projects built",
            detail: "From dashboards to mini products and sharp experiments.",
          },
          {
            value: 12,
            label: "Core technologies",
            detail: "Frontend, backend, UI systems, APIs, and databases.",
          },
        ].map((stat, index) => (
          <Reveal delay={index * 0.07} key={stat.label} className={styles.stat}>
            <div className={styles.statValue}>
              <Counter value={stat.value} />
            </div>
            <h3>{stat.label}</h3>
            <p>{stat.detail}</p>
          </Reveal>
        ))}
        <Reveal delay={0.21} className={styles.stat}>
          <div className={`${styles.statValue} ${styles.infinity}`}>∞</div>
          <h3>Still obsessed</h3>
          <p>Always learning, refining, and pushing for better execution.</p>
        </Reveal>
      </div>
    </section>
  );
}

function TechStack() {
  return (
    <section
      id="skills"
      className={`${styles.section} ${styles.stack}`}
      aria-labelledby="stack-title"
    >
      <Reveal className={styles.sectionHeading}>
        <div>
          <span className={styles.eyebrow}>The toolkit</span>
          <h2 id="stack-title">
            Built on a<br />
            <span>solid stack.</span>
          </h2>
        </div>
        <p>
          Technologies and tools I use to build digital products, from the first
          interaction to the last API call.
        </p>
      </Reveal>
      <div className={styles.stackGrid}>
        {skills.map((skill, index) => (
          <Reveal
            className={styles.skill}
            delay={(index % 4) * 0.04}
            key={skill}
          >
            {index % 3 === 0 ? (
              <Code2 size={19} />
            ) : index % 3 === 1 ? (
              <Braces size={19} />
            ) : (
              <Layers3 size={19} />
            )}
            <span>{skill}</span>
            <ArrowUpRight size={14} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section
      id="experience"
      className={`${styles.section} ${styles.experience}`}
      aria-labelledby="experience-title"
    >
      <Reveal className={styles.experienceHeading}>
        <span className={styles.eyebrow}>The journey so far</span>
        <h2 id="experience-title">
          Good work.
          <br />
          <span>Great company.</span>
        </h2>
        <p>A detailed log of my professional journey.</p>
        <a
          className={styles.textLink}
          href={siteConfig.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          Find me on LinkedIn <ArrowUpRight size={18} />
        </a>
      </Reveal>
      <div className={styles.experienceList}>
        {experiences.map((experience) => (
          <Reveal className={styles.experienceItem} key={experience.company}>
            <div className={styles.experienceMeta}>
              <span>{experience.period}</span>
              <span className={styles.experienceDot} />
            </div>
            <h3>{experience.company}</h3>
            <h4>{experience.title}</h4>
            <p>{experience.description}</p>
            <div className={styles.tags}>
              {experience.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Playground() {
  return (
    <section
      id="playground"
      className={`${styles.section} ${styles.playground}`}
      aria-labelledby="playground-title"
    >
      <Reveal className={styles.sectionHeading}>
        <div>
          <span className={styles.eyebrow}>Made to be played with</span>
          <h2 id="playground-title">
            The playground<span>.</span>
          </h2>
        </div>
        <p>
          A few things you can try right here. Pick something and make yourself
          at home.
        </p>
      </Reveal>
      <div className={styles.playgroundLinks}>
        {siteConfig.navItems
          .filter((item) => item.href !== "/")
          .map((item) => (
            <Link
              href={item.href}
              className={styles.playgroundLink}
              key={item.href}
              prefetch={false}
            >
              <span>{item.label}</span>
              <ArrowUpRight size={27} />
            </Link>
          ))}
      </div>
    </section>
  );
}

function Contact() {
  const ref = useRef<HTMLElement>(null);
  const quiet = useQuietMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["-12%", "0%"]);

  return (
    <section
      ref={ref}
      id="contact"
      className={styles.contact}
      aria-labelledby="contact-title"
    >
      <div className={styles.contactInner}>
        <Reveal>
          <span className={styles.eyebrow}>
            <span className={styles.contactDot} />
            Available for work
          </span>
          <h2 id="contact-title">
            Let&apos;s build
            <br />
            something <em>amazing.</em>
          </h2>
        </Reveal>
        <div className={styles.contactBottom}>
          <p>
            I&apos;m always open to new opportunities, collaborations, and
            interesting projects. Feel free to reach out!
          </p>
          <div className={styles.contactActions}>
            <MagneticLink
              href={siteConfig.links.email}
              className={styles.contactButton}
            >
              Send an email <MoveUpRight size={24} />
            </MagneticLink>
            <MagneticLink
              href={siteConfig.links.linkedin}
              external
              className={styles.contactSecondary}
            >
              Connect on LinkedIn <ArrowUpRight size={19} />
            </MagneticLink>
          </div>
        </div>
        <div className={styles.contactAvailability}>
          <span>Open to collaboration</span>
          <span>Fast replies</span>
          <span>Remote</span>
          <span>Open to projects</span>
        </div>
      </div>
      <motion.div
        aria-hidden="true"
        className={styles.footerWordmark}
        style={{ x: quiet ? 0 : x }}
      >
        LET&apos;S MAKE IT.
      </motion.div>
      <footer className={styles.footer}>
        <div>
          <strong>Christian Bonafena</strong>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className={styles.socials}>
          <a
            aria-label="GitHub"
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={20} />
          </a>
          <a
            aria-label="LinkedIn"
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={20} />
          </a>
          <a aria-label="Email" href={siteConfig.links.email}>
            <Mail size={20} />
          </a>
        </div>
        <a className={styles.backTop} href="#top">
          Back to top <ArrowUp size={17} />
        </a>
      </footer>
    </section>
  );
}

export default function Portfolio() {
  return (
    <PortfolioMotion>
      <div className={styles.portfolio}>
        <Hero />
        <About />
        <ProjectGallery />
        <Archive />
        <TechStack />
        <Experience />
        <Playground />
        <Contact />
      </div>
    </PortfolioMotion>
  );
}
