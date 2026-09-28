"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

import styles from "./kinetic-brand-film.module.css";

const DURATION_SECONDS = 30;

export const brandFilmContent = {
  brand: "Christian Bonafena",
  descriptor: "Independent spirit. Full stack engineer.",
  opening: {
    wordA: "CODE",
    wordB: "CURIOSITY",
    bridge: "WITH PURPOSE / CREATE WITH",
    intro: "Christian Bonafena — Full Stack Engineer",
  },
  evidence: {
    first: { value: "06", label: "Years building", reel: ["03", "06", "09"] },
    second: {
      value: "100",
      label: "Projects built",
      reel: ["048", "076", "100"],
    },
    runner: ["BUILD", "SHIP", "LEARN", "REFINE"],
  },
  proof: {
    metric: "100",
    label: "PROJECTS / EXPERIMENTS",
    caption: "From dashboards to mini products and sharp experiments.",
    image: "/images/connect4.png",
  },
  categories: [
    {
      label: "FRONTEND",
      detail: "React / Next.js",
      image: "/images/tictactoe.png",
    },
    {
      label: "BACKEND",
      detail: "Node.js / PHP",
      image: "/images/quoridor.png",
    },
    {
      label: "REALTIME",
      detail: "WebSocket / GraphQL",
      image: "/images/orbito.png",
    },
    {
      label: "DATA",
      detail: "PostgreSQL / MongoDB",
      image: "/images/connect4.png",
    },
    {
      label: "SHIPPING",
      detail: "Docker / CI/CD",
      image: "/images/pexels-chevanon-325044.jpg",
    },
  ],
  pillars: [
    {
      key: "I",
      title: "Interfaces",
      copy: "Craft the interaction, not just the screen.",
      tone: "paper",
    },
    {
      key: "S",
      title: "Systems",
      copy: "Build the structure that keeps products moving.",
      tone: "accent",
    },
    {
      key: "C",
      title: "Curiosity",
      copy: "Always learning, refining, and trying the next idea.",
      tone: "sage",
    },
    {
      key: "X",
      title: "Execution",
      copy: "Ideas made real, then shipped.",
      tone: "ink",
    },
  ],
  impact: {
    headline: "SHIP ANYWAY.",
    line: "Built in the hours nobody was watching.",
    image: "/images/pexels-chevanon-325044.jpg",
  },
  closing: {
    tagline: "Full Stack Engineer crafting digital experiences that matter.",
    invitation: "Explore the work",
    destination: "github.com/Arthav",
    href: "https://github.com/Arthav",
  },
  links: {
    linkedin: "https://www.linkedin.com/in/cbonz/",
    github: "https://github.com/Arthav",
  },
};

function cssVars(
  values: Record<`--${string}`, string | number>,
): CSSProperties {
  return values as CSSProperties;
}

function Scene({
  number,
  className,
  children,
  labelledBy,
}: {
  number: string;
  className: string;
  children: ReactNode;
  labelledBy: string;
}) {
  return (
    <section
      className={className}
      aria-labelledby={labelledBy}
      data-scene={number}
    >
      {children}
    </section>
  );
}

function LetterLine({ text }: { text: string }) {
  return (
    <span className={styles.letterLine} aria-hidden="true">
      {text.split("").map((letter, index) => (
        <span
          className={styles.letter}
          key={letter + index}
          style={cssVars({ "--i": index })}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </span>
  );
}

function PhotoStrips({
  src,
  direction,
}: {
  src: string;
  direction: 1 | -1;
}) {
  return (
    <div className={styles.photoStrips} aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <span
          className={styles.photoStrip}
          key={index}
          style={{
            ...cssVars({ "--i": index, "--dir": direction }),
            backgroundImage: "url(" + src + ")",
            backgroundPosition:
              ((index * 100) / 7).toFixed(3) + "% 50%",
          }}
        />
      ))}
    </div>
  );
}

function DigitReel({ values }: { values: string[] }) {
  return (
    <span className={styles.digitWindow} aria-hidden="true">
      <span className={styles.digitTrack}>
        {values.map((value) => (
          <span key={value}>{value}</span>
        ))}
      </span>
    </span>
  );
}

function StaticStory() {
  const scenes = [
    ["01 / IDEA", "Code with purpose. Create with curiosity."],
    ["02 / EVIDENCE", "6 years building. 100 projects built."],
    [
      "03 / PROOF",
      "From dashboards to mini products and sharp experiments.",
    ],
    [
      "04 / TOOLKIT",
      "Frontend, backend, realtime systems, data, and shipping.",
    ],
    [
      "05 / PILLARS",
      "Interfaces. Systems. Curiosity. Execution.",
    ],
    ["06 / PAYOFF", "Built in the hours nobody was watching. Ship anyway."],
    [
      "07 / SIGNATURE",
      "Christian Bonafena — Full Stack Engineer crafting digital experiences that matter.",
    ],
  ];

  return (
    <div className={styles.staticStory}>
      <div className={styles.staticIntro}>
        <span>REDUCED MOTION / STATIC CUT</span>
        <h1>CHRISTIAN BONAFENA.</h1>
        <p>Independent spirit. Full stack engineer.</p>
      </div>
      <div className={styles.staticGrid}>
        {scenes.map(([label, copy]) => (
          <article key={label}>
            <span>{label}</span>
            <p>{copy}</p>
          </article>
        ))}
      </div>
      <a
        className={styles.staticLink}
        href={brandFilmContent.closing.href}
        target="_blank"
        rel="noreferrer"
      >
        {brandFilmContent.closing.destination}
      </a>
    </div>
  );
}

export default function KineticBrandFilm() {
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);

  const replay = () => {
    setPaused(false);
    setCycle((value) => value + 1);
  };

  return (
    <main
      className={styles.shell}
      aria-label="Christian Bonafena kinetic portfolio film"
    >
      <div
        className={styles.film}
        data-paused={paused ? "true" : "false"}
        key={cycle}
        style={cssVars({ "--duration": DURATION_SECONDS + "s" })}
      >
        <div className={styles.stage}>
          <Scene
            number="01"
            className={styles.scene1}
            labelledBy="film-scene-1"
          >
            <div className={styles.sceneIndex}>01 / IDEA</div>
            <div className={styles.openingIntro}>
              <span>{brandFilmContent.descriptor}</span>
              <p>{brandFilmContent.opening.intro}</p>
            </div>
            <h1 id="film-scene-1" className={styles.openingWords}>
              <span className={styles.srOnly}>
                {brandFilmContent.opening.wordA} {brandFilmContent.opening.wordB}
              </span>
              <LetterLine text={brandFilmContent.opening.wordA} />
              <LetterLine text={brandFilmContent.opening.wordB} />
            </h1>
            <div className={styles.bridge}>
              <span />
              <p>{brandFilmContent.opening.bridge}</p>
            </div>
            <div className={styles.orbitGraphic} aria-hidden="true">
              {Array.from({ length: 7 }, (_, index) => (
                <span
                  key={index}
                  style={cssVars({ "--ring": index })}
                />
              ))}
            </div>
          </Scene>

          <Scene
            number="02"
            className={styles.scene2}
            labelledBy="film-scene-2"
          >
            <h2 id="film-scene-2" className={styles.srOnly}>
              Evidence
            </h2>
            <div className={styles.evidencePanelA}>
              <PhotoStrips
                src="/images/pexels-chevanon-325044.jpg"
                direction={1}
              />
              <div className={styles.evidenceCopy}>
                <span className={styles.evidenceLabel}>
                  {brandFilmContent.evidence.first.label}
                </span>
                <DigitReel values={brandFilmContent.evidence.first.reel} />
              </div>
            </div>
            <div className={styles.evidencePanelB}>
              <PhotoStrips src="/images/quoridor.png" direction={-1} />
              <div className={styles.evidenceCopy}>
                <span className={styles.evidenceLabel}>
                  {brandFilmContent.evidence.second.label}
                </span>
                <DigitReel values={brandFilmContent.evidence.second.reel} />
              </div>
            </div>
            <div className={styles.runner} aria-hidden="true">
              <div>
                {Array.from({ length: 3 }, (_, group) =>
                  brandFilmContent.evidence.runner.map((word) => (
                    <span key={group + word}>{word} / </span>
                  )),
                )}
              </div>
            </div>
          </Scene>

          <Scene
            number="03"
            className={styles.scene3}
            labelledBy="film-scene-3"
          >
            <div className={styles.proofMeta}>
              <span>{brandFilmContent.proof.label}</span>
              <p>{brandFilmContent.proof.caption}</p>
            </div>
            <h2 id="film-scene-3" className={styles.proofMetric}>
              {brandFilmContent.proof.metric}
            </h2>
            <div className={styles.tileMosaic} aria-hidden="true">
              {Array.from({ length: 24 }, (_, index) => {
                const col = index % 6;
                const row = Math.floor(index / 6);
                return (
                  <span
                    className={styles.tile}
                    key={index}
                    style={{
                      ...cssVars({
                        "--i": index,
                        "--col": col,
                        "--row": row,
                      }),
                      backgroundImage:
                        "url(" + brandFilmContent.proof.image + ")",
                      backgroundPosition:
                        (col * 20).toFixed(0) +
                        "% " +
                        ((row * 100) / 3).toFixed(0) +
                        "%",
                    }}
                  />
                );
              })}
            </div>
          </Scene>

          <Scene
            number="04"
            className={styles.scene4}
            labelledBy="film-scene-4"
          >
            <div className={styles.categoryHeading}>
              <span>THE TOOLKIT</span>
              <h2 id="film-scene-4">Built across the stack.</h2>
            </div>
            <div className={styles.bandStack}>
              {brandFilmContent.categories.map((category, index) => (
                <div
                  className={styles.categoryBand}
                  key={category.label}
                  style={cssVars({ "--i": index })}
                >
                  <span className={styles.bandNumber}>
                    0{index + 1}
                  </span>
                  <strong>{category.label}</strong>
                  <span className={styles.bandDetail}>{category.detail}</span>
                  <span
                    className={styles.bandImage}
                    aria-hidden="true"
                    style={{ backgroundImage: "url(" + category.image + ")" }}
                  />
                </div>
              ))}
            </div>
          </Scene>

          <Scene
            number="05"
            className={styles.scene5}
            labelledBy="film-scene-5"
          >
            <h2 id="film-scene-5" className={styles.srOnly}>
              Four pillars
            </h2>
            <div className={styles.pillarGrid}>
              {brandFilmContent.pillars.map((pillar, index) => (
                <article
                  className={
                    styles.pillar +
                    " " +
                    styles["pillarTone" + pillar.tone[0].toUpperCase() + pillar.tone.slice(1)]
                  }
                  key={pillar.title}
                  style={cssVars({ "--i": index })}
                >
                  <span className={styles.pillarKey}>{pillar.key}</span>
                  <div>
                    <h3>{pillar.title}</h3>
                    <p>{pillar.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </Scene>

          <Scene
            number="06"
            className={styles.scene6}
            labelledBy="film-scene-6"
          >
            <div
              className={styles.impactShape}
              aria-hidden="true"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(20, 23, 19, .08), rgba(20, 23, 19, .22)), url(" +
                  brandFilmContent.impact.image +
                  ")",
              }}
            />
            <div className={styles.impactKicker}>LATE NIGHTS, MOSTLY</div>
            <h2 id="film-scene-6" className={styles.impactHeadline}>
              <span className={styles.impactReadable}>
                {brandFilmContent.impact.headline}
              </span>
              <span className={styles.ripple} aria-hidden="true">
                {Array.from({ length: 10 }, (_, index) => (
                  <span
                    className={styles.rippleSlice}
                    key={index}
                    style={cssVars({
                      "--top": index * 10 + "%",
                      "--bottom": (9 - index) * 10 + "%",
                      "--i": index,
                      "--shift": (index % 2 === 0 ? 1 : -1) * (18 + index * 2) + "px",
                    })}
                  >
                    {brandFilmContent.impact.headline}
                  </span>
                ))}
              </span>
            </h2>
            <p className={styles.impactLine}>
              {brandFilmContent.impact.line}
            </p>
          </Scene>

          <Scene
            number="07"
            className={styles.scene7}
            labelledBy="film-scene-7"
          >
            <div className={styles.closingKicker}>PORTFOLIO / 2026</div>
            <h2 id="film-scene-7" className={styles.srOnly}>
              {brandFilmContent.brand}
            </h2>
            <div className={styles.wordmark} aria-hidden="true">
              {Array.from({ length: 8 }, (_, index) => (
                <span
                  className={styles.wordmarkSlice}
                  key={index}
                  style={cssVars({
                    "--left": index * 12.5 + "%",
                    "--right": (7 - index) * 12.5 + "%",
                    "--i": index,
                    "--dir": index % 2 === 0 ? -1 : 1,
                  })}
                >
                  CHRISTIAN BONAFENA.
                </span>
              ))}
            </div>
            <div className={styles.closingMeta}>
              <p>{brandFilmContent.closing.tagline}</p>
              <a
                href={brandFilmContent.closing.href}
                target="_blank"
                rel="noreferrer"
              >
                <span>{brandFilmContent.closing.invitation}</span>
                <strong>{brandFilmContent.closing.destination}</strong>
              </a>
            </div>
          </Scene>

          <div className={styles.motif} aria-hidden="true">
            <span />
          </div>
        </div>

        <header className={styles.hud}>
          <a
            className={styles.brandMark}
            href={brandFilmContent.links.github}
            target="_blank"
            rel="noreferrer"
            aria-label="Christian Bonafena on GitHub"
          >
            CB<span>*</span>
          </a>
          <span className={styles.hudDescriptor}>
            PORTFOLIO / MOTION CUT / 30S
          </span>
          <button
            type="button"
            className={styles.controlButton}
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
          >
            {paused ? <Play size={15} /> : <Pause size={15} />}
            <span>{paused ? "Resume" : "Pause"}</span>
          </button>
        </header>

        <details className={styles.infoDrawer}>
          <summary>Info</summary>
          <div>
            <p>{brandFilmContent.descriptor}</p>
            <span>7 scenes / {DURATION_SECONDS} seconds / seamless loop</span>
            <a
              href={brandFilmContent.links.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </details>

        <div className={styles.progressTrack} aria-hidden="true">
          <span className={styles.progressFill} />
        </div>

        <button
          type="button"
          className={styles.replayButton}
          onClick={replay}
        >
          <RotateCcw size={15} />
          <span>Replay</span>
        </button>
      </div>

      <StaticStory />

      <div className={styles.srStory}>
        <h2>Story transcript</h2>
        <ol>
          <li>Code with purpose. Create with curiosity.</li>
          <li>6 years building and 100 projects built.</li>
          <li>
            From dashboards to mini products and sharp experiments.
          </li>
          <li>
            Frontend, backend, realtime systems, data, and shipping.
          </li>
          <li>Interfaces, systems, curiosity, and execution.</li>
          <li>Built in the hours nobody was watching. Ship anyway.</li>
          <li>
            Christian Bonafena. Full Stack Engineer crafting digital
            experiences that matter.
          </li>
        </ol>
      </div>
    </main>
  );
}
