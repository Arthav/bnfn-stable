"use client";
import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

interface Project {
    title: string;
    description: string;
    tags: string[];
    liveUrl?: string;
    githubUrl?: string;
    gradient: string;
    emoji: string;
    className?: string;
    id: string;
}

const initialProjects: Project[] = [
    {
        id: "credentid",
        title: "CredentID",
        description:
            "A seamless identity verification and credential management platform.",
        tags: ["Next.js", "Identity", "Secure"],
        liveUrl: "https://credentid.vercel.app/",
        gradient: "from-blue-600/20 to-cyan-500/20",
        emoji: "🆔",
        className: "md:col-span-2",
    },
    {
        id: "maxima",
        title: "Maxima Property",
        description: "Modern real estate listing and property management interface.",
        tags: ["React", "Real Estate", "UI/UX"],
        liveUrl: "https://maxima-property.vercel.app/",
        gradient: "from-emerald-600/20 to-teal-500/20",
        emoji: "🏠",
        className: "md:col-span-1",
    },
    {
        id: "spinwin",
        title: "Spin & Win",
        description: "Interactive spin-the-wheel game for user engagement and rewards.",
        tags: ["React", "Gamification", "Fun"],
        liveUrl: "https://spin-win-psi.vercel.app/",
        gradient: "from-orange-600/20 to-amber-500/20",
        emoji: "🎡",
        className: "md:col-span-1",
    },
    {
        id: "tiershare",
        title: "Tier Share Board",
        description:
            "Collaborative dashboard for visualizing tiered data and sharing insights.",
        tags: ["Next.js", "Dashboard", "Data Viz"],
        liveUrl: "https://tier-share-board.vercel.app/",
        gradient: "from-violet-600/20 to-purple-500/20",
        emoji: "📊",
        className: "md:col-span-2",
    },
    {
        id: "cbcal",
        title: "CB Cal",
        description: "A sleek and functional utility application.",
        tags: ["React", "Utility", "Minimalist"],
        liveUrl: "https://cb-cal.vercel.app/",
        gradient: "from-pink-600/20 to-rose-500/20",
        emoji: "🧮",
        className: "md:col-span-1",
    },
    {
        id: "autofood",
        title: "Auto Food Polling Bot",
        description: "Telegram bot to automate daily food ordering polls for teams.",
        tags: ["Node.js", "Telegram API", "Automation"],
        gradient: "from-gray-600/20 to-slate-500/20",
        emoji: "🤖",
        className: "md:col-span-1",
    },
];

function SortableItem(props: { project: Project }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props.project.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`project-card group relative p-8 rounded-3xl border border-white/10 bg-gradient-to-br ${props.project.gradient} backdrop-blur-sm hover:border-purple-500/40 cursor-grab active:cursor-grabbing flex flex-col ${props.project.className}`}
        >
            {/* Emoji badge */}
            <div className="absolute top-6 right-6 text-4xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                {props.project.emoji}
            </div>

            <div className="mt-2">
                <h3 className="text-2xl font-bold dark:text-white text-gray-900 mb-3 group-hover:text-purple-400 transition-colors">
                    {props.project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-6 max-w-md">
                    {props.project.description}
                </p>
            </div>

            {/* Tags & Links */}
            <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                    {props.project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-gray-300 border border-white/5"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex gap-4">
                    {props.project.liveUrl && (
                        <a
                            href={props.project.liveUrl}
                            target={
                                props.project.liveUrl.startsWith("http") ? "_blank" : undefined
                            }
                            rel="noopener noreferrer"
                            className="text-white hover:text-purple-400 transition-colors"
                            aria-label="Live Demo"
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            <FaExternalLinkAlt />
                        </a>
                    )}
                    {props.project.githubUrl && (
                        <a
                            href={props.project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-gray-300 transition-colors"
                            aria-label="Source Code"
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            <FaGithub className="text-lg" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

// Separate component for Overlay to keep main component clean
function ProjectCard({ project }: { project: Project }) {
    return (
        <div
            className={`project-card group relative p-8 rounded-3xl border border-purple-500/50 bg-gradient-to-br ${project.gradient} backdrop-blur-md shadow-2xl flex flex-col ${project.className}`}
        >
            {/* Emoji badge */}
            <div className="absolute top-6 right-6 text-4xl opacity-100 scale-110">
                {project.emoji}
            </div>

            <div className="mt-2">
                <h3 className="text-2xl font-bold dark:text-white text-gray-900 mb-3 text-purple-400">
                    {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-6 max-w-md">
                    {project.description}
                </p>
            </div>

            <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-gray-300 border border-white/5"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                {/* Links hidden in overlay usually or kept, but static */}
                <div className="flex gap-4 opacity-50">
                    <FaExternalLinkAlt className="text-white" />
                </div>
            </div>
        </div>
    );
}

export default function ProjectsShowcase() {
    const [items, setItems] = useState(initialProjects);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragStart(event: any) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }

        setActiveId(null);
    }

    return (
        <div
            id="showcase"
            className="flex flex-col gap-8 w-full mt-16 px-4 sm:px-8 md:px-16"
        >
            <div className="flex flex-col gap-2">
                <h2 className="text-4xl font-bold dark:text-white">Small Works</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                    A curated selection of small projects I&apos;ve built. <br />
                    <span className="text-sm text-purple-500 font-medium">
                        (Try dragging the cards to reorganize them!)
                    </span>
                </p>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map((item) => item.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(250px,auto)]">
                        {items.map((project) => (
                            <SortableItem key={project.id} project={project} />
                        ))}
                    </div>
                </SortableContext>
                <DragOverlay>
                    {activeId ? (
                        <ProjectCard project={items.find(i => i.id === activeId)!} />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
