"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDown, Plus } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { siteConfig } from "@/config/site";
import styles from "./portfolio.module.css";

const links = [
  { label: "Work", href: "#showcase" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Playground", href: "#playground" },
];

export function PortfolioNavigation() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const quiet = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30 });

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);

  return (
    <header className={styles.header}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <div className={styles.navInner}>
        <a aria-label="BNFN home" className={styles.brand} href="#top">
          <span className={styles.brandMark} aria-hidden="true">
            b.
          </span>
          <span>
            BNFN<span className={styles.brandDot}>.</span>
          </span>
        </a>
        <nav aria-label="Portfolio navigation" className={styles.desktopNav}>
          {links.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className={styles.navContact} href="#contact">
          Let&apos;s talk <ArrowUpRight size={16} />
        </a>
        <button
          aria-controls="portfolio-menu"
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
          className={styles.menuToggle}
          onClick={() => setOpen((value) => !value)}
          ref={toggleRef}
          type="button"
        >
          <Plus
            size={24}
            style={{ transform: open ? "rotate(45deg)" : "none" }}
          />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="portfolio-menu"
            className={styles.mobileMenu}
            initial={quiet ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: quiet ? 0 : 0.3 }}
          >
            <nav aria-label="Mobile portfolio navigation">
              {links.map((link) => (
                <a
                  href={link.href}
                  key={link.href}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                  <ArrowDown size={20} />
                </a>
              ))}
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
                <ArrowUpRight size={20} />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        aria-hidden="true"
        className={styles.readingProgress}
        style={{ scaleX: quiet ? scrollYProgress : progress }}
      />
    </header>
  );
}
