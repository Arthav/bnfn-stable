"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowUpRight,
  Grip,
  ShieldCheck,
  Bug,
  Bot,
  Calculator,
  Play,
  Layers3,
  Fingerprint,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { projects, type Project } from "./content";
import { Reveal, useQuietMotion } from "./motion";
import styles from "./portfolio.module.css";

const filters = ["All work", "Products & platforms", "Experiments"] as const;
const experiments = new Set([
  "spinwin",
  "cbcal",
  "autofood",
  "aifixhuman",
  "vifive",
]);
const palettes: Record<string, [string, string]> = {
  credentid: ["#e2e9d7", "#263b28"],
  vifive: ["#47252e", "#efb99f"],
  maxima: ["#abc4b1", "#24473c"],
  spinwin: ["#edd1ad", "#9c4d31"],
  tiershare: ["#cbc3e2", "#4e4273"],
  cbcal: ["#bfd2dd", "#2c5061"],
  autofood: ["#d4dcbb", "#3f552d"],
  aifixhuman: ["#e3c4b9", "#743a40"],
  dracin: ["#262c36", "#b7c9e3"],
  qanari: ["#e6e394", "#4c5426"],
};

function Artwork({ project }: { project: Project }) {
  const icons = {
    tiershare: Layers3,
    cbcal: Calculator,
    autofood: Bot,
    aifixhuman: Fingerprint,
    dracin: Play,
    qanari: Bug,
  };
  const Icon = icons[project.id as keyof typeof icons] || Sparkles;

  return (
    <div className={styles.artworkContent} aria-hidden="true">
      {project.id === "credentid" ? (
        <div className={styles.credential}>
          <div>
            <Fingerprint size={25} />
            <span>CredentID</span>
            <ArrowUpRight size={15} />
          </div>
          <div className={styles.credentialMiddle}>
            <span>C</span>
            <div>
              <i />
              <i />
              <i />
            </div>
          </div>
          <div>
            <ShieldCheck size={17} />
            <span>Identity. Simplified.</span>
          </div>
        </div>
      ) : project.id === "vifive" ? (
        <div className={styles.storyArtwork}>
          <div className={styles.storyMoon} />
          <span>ViFive</span>
          <p>A story worth stepping into.</p>
        </div>
      ) : project.id === "maxima" ? (
        <div className={styles.buildingArtwork}>
          <div />
          <div />
          <div />
          <strong>
            Maxima<span>Property</span>
          </strong>
        </div>
      ) : project.id === "spinwin" ? (
        <div className={styles.wheelArtwork}>
          <div />
          <span>
            Spin
            <br />& Win
          </span>
        </div>
      ) : (
        <div
          className={`${styles.symbolArtwork} ${project.id === "dracin" ? styles.cinemaArtwork : ""}`}
        >
          <div className={styles.symbolOrbit} />
          <Icon strokeWidth={1} size={83} />
          <strong>{project.title}</strong>
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  reorderable,
}: {
  project: Project;
  reorderable: boolean;
}) {
  const quiet = useQuietMotion();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id, disabled: !reorderable });
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerX, { stiffness: 150, damping: 22 });
  const rotateY = useSpring(pointerY, { stiffness: 150, damping: 22 });
  const palette = palettes[project.id];

  return (
    <article
      ref={setNodeRef}
      className={`${styles.projectCard} ${isDragging ? styles.dragging : ""}`}
      style={
        {
          transform: CSS.Transform.toString(transform),
          transition: quiet ? "none" : transition,
          "--project-bg": palette[0],
          "--project-ink": palette[1],
        } as CSSProperties
      }
    >
      <div
        className={styles.projectArtwork}
        onPointerMove={(event) => {
          if (quiet || isDragging || event.pointerType !== "mouse") return;
          const rect = event.currentTarget.getBoundingClientRect();
          pointerX.set(
            ((event.clientY - rect.top - rect.height / 2) / rect.height) * -10,
          );
          pointerY.set(
            ((event.clientX - rect.left - rect.width / 2) / rect.width) * 10,
          );
        }}
        onPointerLeave={() => {
          pointerX.set(0);
          pointerY.set(0);
        }}
      >
        <span className={styles.projectCategory}>
          {experiments.has(project.id)
            ? "Creative experiment"
            : "Digital product"}
        </span>
        <motion.div
          className={styles.projectArtMotion}
          style={{ rotateX: quiet ? 0 : rotateX, rotateY: quiet ? 0 : rotateY }}
        >
          <Artwork project={project} />
        </motion.div>
        {reorderable && (
          <button
            {...attributes}
            {...listeners}
            type="button"
            className={styles.dragHandle}
            aria-label={`Reorder ${project.title}`}
            title="Drag or press Space to reorder"
          >
            <Grip size={18} />
          </button>
        )}
        {project.liveUrl && (
          <a
            className={styles.projectOpen}
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${project.title}`}
          >
            <ArrowUpRight size={24} />
          </a>
        )}
      </div>
      <div className={styles.projectInfo}>
        <h3>
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              {project.title}
              <ArrowUpRight size={20} />
            </a>
          ) : (
            project.title
          )}
        </h3>
        <p>{project.description}</p>
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function ProjectGallery() {
  const [items, setItems] = useState(projects);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All work");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const visible = items.filter(
    (project) =>
      filter === "All work" ||
      (filter === "Experiments"
        ? experiments.has(project.id)
        : !experiments.has(project.id)),
  );

  function reorder({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    setItems((current) =>
      arrayMove(
        current,
        current.findIndex((item) => item.id === active.id),
        current.findIndex((item) => item.id === over.id),
      ),
    );
  }

  return (
    <section
      id="showcase"
      className={`${styles.section} ${styles.work}`}
      aria-labelledby="work-title"
    >
      <Reveal className={styles.sectionHeading}>
        <div>
          <span className={styles.eyebrow}>Small works. Big curiosity.</span>
          <h2 id="work-title">
            Made after hours<span>.</span>
          </h2>
        </div>
        <p>
          A selection of personal projects and experiments, outside my
          professional work.
        </p>
      </Reveal>
      <div className={styles.workToolbar}>
        <div
          className={styles.filters}
          role="group"
          aria-label="Filter projects"
        >
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <span className={styles.dragHint}>
          <Grip size={14} />
          Drag a handle to make it your own
        </span>
      </div>
      <span className={styles.srOnly} role="status">
        {visible.length} projects shown
      </span>
      <DndContext
        id="portfolio-projects"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={reorder}
      >
        <SortableContext
          items={visible.map((project) => project.id)}
          strategy={rectSortingStrategy}
        >
          <div className={styles.projectGrid}>
            {visible.map((project) => (
              <Reveal key={project.id}>
                <ProjectCard project={project} reorderable />
              </Reveal>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <a
        className={styles.moreWork}
        href="https://github.com/Arthav"
        target="_blank"
        rel="noopener noreferrer"
      >
        More from the workshop <ArrowRight size={18} />
      </a>
    </section>
  );
}
