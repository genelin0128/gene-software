/**
 * ProjectCard.tsx
 *
 * Project showcase card with hover interactions
 * Features: Image zoom, overlay buttons, tech stack badges
 *
 */

"use client";

import { useEffect, useState, type MouseEvent as ReactMouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight, CheckCircle2, X, Check, ChevronLeft, ChevronRight, Ban } from "lucide-react";

interface Project {
    title: string;
    description: string;
    image: string;
    tech: string[];
    liveUrl: string;
    githubUrl: string;
    slug?: "cardz" | "baccarat" | "portfolio" | "travel";
}

interface ProjectDetail {
    badge: { text: string; tone: "emerald" | "cyan" };
    title: string;
    summary: string;
    tech: string[];
    image: string;
    gallery?: string[];
    imageLabel: string;
    features: string[];
}

interface ProjectCardProps {
    project: Project;
    index: number;
    isDark: boolean;
}

const projectDetails: Record<NonNullable<Project["slug"]>, ProjectDetail> = {
    portfolio: {
        badge: { text: "Personal Portfolio", tone: "emerald" },
        title: "3D Motion Developer Portfolio",
        summary:
            "Next.js/TypeScript portfolio deployed at gene-software.com, pairing a Three.js background with Framer Motion sequences and modal project spotlights that double as a design playground.",
        tech: ["Next.js", "React", "TypeScript", "Three.js", "Framer Motion", "Tailwind CSS"],
        image: "/projects/portfolio/portfolio-1.png",
        gallery: ["/projects/portfolio/portfolio-1.png", "/projects/portfolio/portfolio-2.png"],
        imageLabel: "Portfolio hero and interactive project gallery",
        features: [
            "Three.js hero scene and particle field tuned for smooth GPU budgets on desktop and mobile.",
            "Dark/light theming persisted via localStorage with gradients and tokens updating instantly.",
            "Project modals with image carousels, tech stacks, and guarded CTAs when links are unavailable.",
            "Framer Motion choreography across hero, cards, and timeline for cohesive interaction patterns.",
            "Keyboard-accessible cards, ESC-to-close modals, and responsive layouts that hold up across breakpoints.",
        ],
    },
    travel: {
        badge: { text: "Travel Planning", tone: "cyan" },
        title: "Intelligent Travel Consultant and Smart Planning",
        summary:
            "AI-assisted travel planner that blends retrieval-augmented recommendations with itinerary heuristics and map-aware distance checks.",
        tech: ["Vue.js", "Python", "SQL", "OpenAI API", "JavaScript", "Google Maps API"],
        image: "/projects/travel/travel-1.png",
        gallery: ["/projects/travel/travel-1.png", "/projects/travel/travel-2.png"],
        imageLabel: "Travel planning console with itinerary and map views",
        features: [
            "ChatGPT API integration with retrieval and keyword extraction to deliver personalized recommendations and persist saved destinations.",
            "Modular Python ingestion and cleaning pipelines that de-duplicate sets/maps and batch I/O for stable feeds.",
            "Retrieval and ranking layer plus itinerary matching heuristics aligned to time windows and category preferences.",
            "Normalized SQL schema with indexes and foreign keys to keep destinations, preferences, and histories queryable.",
            "Google Maps embedding for interactive mapping and automated distance calculations that feed itinerary scoring.",
        ],
    },
    cardz: {
        badge: { text: "Social Media Platform", tone: "emerald" },
        title: "Cardz Social Media",
        summary:
            "A full-stack social platform where authenticated users create multi-image posts, follow others, and interact through comments and upvotes. Profiles support rich editing and optional Google OAuth linking.",
        tech: [
            "React",
            "Redux Toolkit + Persist",
            "Tailwind CSS",
            "Bootstrap 5",
            "JavaScript",
            "HTML/CSS",
            "Node.js",
            "Express",
            "MongoDB",
            "Passport (Google OAuth2)",
            "Cloudinary",
            "Jest",
            "React Testing Library",
            "Jasmine",
            "Supertest",
        ],
        image: "/projects/cardz/cardz-1.png",
        gallery: ["/projects/cardz/cardz-1.png", "/projects/cardz/cardz-2.png", "/projects/cardz/cardz-3.png"],
        imageLabel: "Multi-image card posts with comments and upvotes",
        features: [
            "Session-based auth with username/password plus Google OAuth login, link, and unlink flows.",
            "Create, edit, and delete posts with multi-image uploads via Multer and Cloudinary.",
            "Full comment CRUD and per-user upvote toggling for lightweight engagement.",
            "Follow/unfollow system with personalized feed generation and search across users or post content.",
            "Rich profile editing: avatar, status, names, contact info, and linked third-party accounts.",
            "Client and API test coverage using Jest, React Testing Library, Jasmine, Supertest, and MongoDB Memory Server.",
        ],
    },
    baccarat: {
        badge: { text: "Table Game", tone: "cyan" },
        title: "Baccarat Simulator — single-page table with animated squeeze reveals",
        summary:
            "A Next.js baccarat build with animated chip betting, squeeze/flip flows, automation tools, and cookie-backed session state that mirrors a real table feel.",
        tech: [
            "Next.js",
            "React",
            "Bootstrap 5",
            "Motion",
        ],
        image: "/projects/baccarat/Baccarat-1.png",
        gallery: ["/projects/baccarat/Baccarat-1.png", "/projects/baccarat/Baccarat-2.png"],
        imageLabel: "Single-page baccarat table with chip betting and squeeze reveals",
        features: [
            "Interactive betting surface with chip selection, bankroll tracking, undo/reset, and side bets (Player/Banker Pair, Lucky 6, Tie) kept in sync with balance.",
            "Animated dealing flow with flip/squeeze overlays or popups, manual flip gating, and Framer Motion result/win toasts.",
            "Mode selector (Beginner/Intermediate/Advanced) sets decision timers; countdown ring auto-flips and locks swaps once time expires.",
            "Automation tools like Auto Deal multi-round runs with stop controls plus paid utilities to swap unflipped cards or reshuffle undealt cards.",
            "Roadmap/telemetry slide-out with recent outcomes, undealt-card counts & probabilities, auto deck reset every 30 rounds, screenshot capture, and user ID/login persistence.",
        ],
    },
};

export default function ProjectCard({ project, index, isDark }: ProjectCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const [notifications, setNotifications] = useState<
        { id: number; title: string; message: string }[]
    >([]);
    const isLiveAvailable = Boolean(project.liveUrl && project.liveUrl !== "#");
    const isCodeAvailable = Boolean(project.githubUrl && project.githubUrl !== "#");
    const hasDetail = project.slug && projectDetails[project.slug];
    const textPrimary = isDark ? "text-white" : "text-slate-800";
    const textSecondary = isDark ? "text-white/70" : "text-slate-600";
    const panelSurface = isDark ? "border-white/20 bg-white/5" : "border-slate-200 bg-white shadow-sm";

    useEffect(() => {
        if (!isModalOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsModalOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isModalOpen]);

    useEffect(() => {
        if (!isModalOpen) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, [isModalOpen]);

    useEffect(() => {
        // Reset carousel when modal opens for a different project
        if (isModalOpen) {
            setActiveSlide(0);
        }
    }, [isModalOpen, project.slug]);

    const handlePrev = (slidesLength: number) => {
        setActiveSlide((prev) => (prev - 1 + slidesLength) % slidesLength);
    };

    const handleNext = (slidesLength: number) => {
        setActiveSlide((prev) => (prev + 1) % slidesLength);
    };

    const pushUnavailableNotice = (type: "live" | "code") => {
        const title = type === "live" ? "Live demo unavailable" : "Code not shared";
        const message =
            type === "live"
                ? "This project doesn't have a live demo yet."
                : "This project repo isn't public right now.";
        const id = Date.now() + Math.random();
        setNotifications((prev) => [...prev.slice(-2), { id, title, message }]);
        setTimeout(() => {
            setNotifications((prev) => prev.filter((note) => note.id !== id));
        }, 3800);
    };

    const handleActionClick = (event: ReactMouseEvent<HTMLAnchorElement, MouseEvent>, isAvailable: boolean, type: "live" | "code") => {
        event.stopPropagation();
        if (!isAvailable) {
            event.preventDefault();
            pushUnavailableNotice(type);
        }
    };

    const badgeTone = (tone: ProjectDetail["badge"]["tone"]) =>
        tone === "emerald"
            ? isDark
                ? "border-emerald-300/60 bg-emerald-500/15 text-emerald-200"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            : isDark
                ? "border-cyan-300/60 bg-cyan-500/15 text-cyan-200"
                : "border-cyan-200 bg-cyan-50 text-cyan-700";

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => hasDetail && setIsModalOpen(true)}
                onKeyDown={(event) => {
                    if (!hasDetail) return;
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setIsModalOpen(true);
                    }
                }}
                role={hasDetail ? "button" : undefined}
                tabIndex={hasDetail ? 0 : -1}
                className={`group relative ${hasDetail ? "cursor-pointer" : "cursor-default"}`}
            >
                {/* Ambient glow effect */}
                <motion.div
                    className={`
                    absolute -inset-2 rounded-3xl blur-2xl transition-all duration-500
                    ${isDark
                    ? "bg-gradient-to-br from-cyan-500/10 to-emerald-500/10"
                    : "bg-gradient-to-br from-emerald-500/5 to-cyan-500/5"}
                `}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                />

                <div
                    className={`
                    relative overflow-hidden rounded-2xl transition-all duration-500
                    ${isDark
                    ? "bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20"
                    : "bg-white border border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-xl"}
                `}
                >
                    {/* Project Image */}
                    <div className="relative h-56 overflow-hidden">
                        <motion.img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            animate={{ scale: isHovered ? 1.1 : 1 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                        />

                        {/* Gradient overlay */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-t to-transparent ${isDark ? "from-[#0a0a0f]" : "from-white"}`} />

                        {/* Hover overlay with buttons */}
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0 flex items-center justify-center gap-4 bg-black/50 backdrop-blur-sm"
                                >
                                    <motion.a
                                        href={isLiveAvailable ? project.liveUrl : undefined}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0, rotate: 180 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                        className={`p-4 rounded-full transition-all duration-300 border shadow-lg ${isLiveAvailable
                                                ? isDark
                                                    ? "bg-white/10 hover:bg-cyan-500 border-white/20 text-white"
                                                    : "bg-white/95 border-slate-200 text-slate-800 hover:bg-cyan-500 hover:text-white hover:border-cyan-200"
                                                : isDark
                                                    ? "bg-white/5 text-white/60 border-white/10 cursor-not-allowed"
                                                    : "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                                            }`}
                                        aria-disabled={!isLiveAvailable}
                                        onClick={(event) => handleActionClick(event, isLiveAvailable, "live")}
                                    >
                                        <ExternalLink className={`w-5 h-5 ${isLiveAvailable ? (isDark ? "text-white" : "text-slate-800") : isDark ? "text-white/50" : "text-slate-500"}`} />
                                    </motion.a>
                                    <motion.a
                                        href={isCodeAvailable ? project.githubUrl : undefined}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ scale: 0, rotate: 180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0, rotate: -180 }}
                                        transition={{ duration: 0.3, delay: 0.2 }}
                                        className={`p-4 rounded-full transition-all duration-300 border shadow-lg ${isCodeAvailable
                                                ? isDark
                                                    ? "bg-white/10 hover:bg-emerald-500 border-white/20 text-white"
                                                    : "bg-white/95 border-slate-200 text-slate-800 hover:bg-emerald-500 hover:text-white hover:border-emerald-200"
                                                : isDark
                                                    ? "bg-white/5 text-white/60 border-white/10 cursor-not-allowed"
                                                    : "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                                            }`}
                                        aria-disabled={!isCodeAvailable}
                                        onClick={(event) => handleActionClick(event, isCodeAvailable, "code")}
                                    >
                                        <Github className={`w-5 h-5 ${isCodeAvailable ? (isDark ? "text-white" : "text-slate-800") : isDark ? "text-white/50" : "text-slate-500"}`} />
                                    </motion.a>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className={`text-xl font-semibold transition-colors duration-300 ${isDark ? "text-white group-hover:text-cyan-400" : "text-slate-800 group-hover:text-emerald-600"}`}>
                                {project.title}
                            </h3>
                            <motion.div
                                animate={{ x: isHovered ? 4 : 0, y: isHovered ? -4 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ArrowUpRight
                                    className={`w-5 h-5 transition-colors duration-300 ${isDark ? "text-white/30 group-hover:text-cyan-400" : "text-slate-400 group-hover:text-emerald-600"}`} />
                            </motion.div>
                        </div>

                        <p className={`text-sm mb-4 line-clamp-2 ${isDark ? "text-white/60" : "text-slate-600"}`}>
                            {project.description}
                        </p>

                        {/* Tech stack badges */}
                        <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ delay: 0.05 * i }}
                                    viewport={{ once: true }}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-full cursor-default ${isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-emerald-100 text-emerald-600"}`}
                                >
                                    {tech}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {hasDetail && isModalOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            className={`relative w-full max-w-5xl max-h-[85vh] overflow-y-auto rounded-3xl border ${isDark ? "border-white/10 bg-[#0b1224]/95" : "border-slate-200 bg-white/95"
                                } p-6 shadow-2xl`}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 30, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {(() => {
                                if (!hasDetail || !project.slug) return null;
                                const detail = projectDetails[project.slug];
                                const slides = detail.gallery && detail.gallery.length > 0 ? detail.gallery : [detail.image];
                                const safeIndex = slides.length ? ((activeSlide % slides.length) + slides.length) % slides.length : 0;
                                const activeSrc = slides[safeIndex];
                                return (
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between gap-4">
                                            <div
                                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-tight ${isDark ? "border-white/70 bg-white/10 text-white" : "border-slate-200 bg-white text-slate-700"
                                                    }`}
                                            >
                                                <span
                                                    className={`h-2 w-2 rounded-full ${detail.badge.tone === "emerald" ? "bg-emerald-400" : "bg-cyan-400"}`}
                                                />
                                                {detail.badge.text}
                                            </div>
                                            <motion.button
                                                onClick={() => setIsModalOpen(false)}
                                                aria-label="Close"
                                                whileHover={{ scale: 1.08 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border transition-all duration-300 ${isDark
                                                        ? "bg-slate-800/50 border-white/15 hover:border-cyan-500/50"
                                                        : "bg-white/80 border-slate-200 hover:border-emerald-500/50 shadow-lg"
                                                    }`}
                                            >
                                                <motion.div
                                                    className={`absolute inset-0 rounded-full blur-xl opacity-50 ${isDark ? "bg-cyan-500" : "bg-emerald-400"}`}
                                                    animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.4, 0.25] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                />
                                                <span className="relative">
                                                    <X className={`h-5 w-5 ${isDark ? "text-white" : "text-slate-700"}`} />
                                                </span>
                                            </motion.button>
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            className={`relative overflow-hidden rounded-2xl border px-5 py-4 ${isDark
                                                    ? "border-white/10 bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-transparent"
                                                    : "border-slate-200 bg-gradient-to-r from-emerald-50 via-cyan-50 to-white"
                                                }`}
                                        >
                                            <motion.div
                                                className="absolute -left-10 -top-16 h-32 w-48 rounded-full blur-3xl"
                                                animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.08, 1] }}
                                                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                                                style={{
                                                    background:
                                                        detail.badge.tone === "emerald"
                                                            ? "radial-gradient(circle, rgba(52,211,153,0.45), transparent 55%)"
                                                            : "radial-gradient(circle, rgba(34,211,238,0.45), transparent 55%)",
                                                }}
                                            />
                                            <motion.div
                                                className="absolute inset-x-0 top-0 h-px"
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                                            >
                                                <div
                                                    className={`h-px w-full ${detail.badge.tone === "emerald"
                                                        ? "bg-gradient-to-r from-emerald-400 via-cyan-300 to-transparent"
                                                        : "bg-gradient-to-r from-cyan-300 via-emerald-300 to-transparent"
                                                        }`}
                                                />
                                            </motion.div>
                                            <div className="relative space-y-2">
                                                <h2 className={`text-3xl sm:text-4xl font-bold leading-snug ${textPrimary}`}>{detail.title}</h2>
                                                <p className={`text-base sm:text-lg ${textSecondary}`}>{detail.summary}</p>
                                            </div>
                                        </motion.div>

                                        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr] items-start lg:items-stretch">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.97 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.4 }}
                                                className={`relative h-full min-h-[280px] sm:min-h-[320px] md:min-h-[360px] max-h-[560px] md:max-h-[480px] overflow-hidden rounded-2xl border ${isDark
                                                        ? "border-white/10 bg-white/5"
                                                        : "border-slate-200 bg-white shadow-sm"
                                                    }`}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
                                                <AnimatePresence mode="wait">
                                                    {activeSrc && (
                                                        <motion.img
                                                            key={`${project.slug ?? detail.title}-${safeIndex}-${activeSrc}`}
                                                            src={activeSrc}
                                                            alt={detail.imageLabel}
                                                            initial={{ opacity: 0, x: 40 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -40 }}
                                                            transition={{ duration: 0.45, ease: "easeOut" }}
                                                            className="absolute inset-0 h-full w-full object-contain lg:object-cover"
                                                        />
                                                    )}
                                                </AnimatePresence>
                                                <div className="absolute inset-x-0 bottom-0 p-4">
                                                    {slides.length > 1 && (
                                                        <div className="flex items-center justify-center">
                                                            <div className="flex items-center gap-3 rounded-full bg-black/70 px-4 py-2 backdrop-blur">
                                                                <button
                                                                    onClick={() => handlePrev(slides.length)}
                                                                    className="p-1.5 rounded-full text-white/80 hover:text-white transition-colors"
                                                                    aria-label="Previous image"
                                                                >
                                                                    <ChevronLeft className="h-4 w-4" />
                                                                </button>
                                                                    <div className="flex items-center gap-2">
                                                                    {slides.map((_, dotIndex) => (
                                                                        <button
                                                                            key={dotIndex}
                                                                            onClick={() => setActiveSlide(dotIndex)}
                                                                            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${dotIndex === safeIndex
                                                                                    ? "bg-white"
                                                                                    : "bg-white/40"
                                                                                }`}
                                                                            aria-label={`Go to image ${dotIndex + 1}`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <button
                                                                    onClick={() => handleNext(slides.length)}
                                                                    className="p-1.5 rounded-full text-white/80 hover:text-white transition-colors"
                                                                    aria-label="Next image"
                                                                >
                                                                    <ChevronRight className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>

                                            <div className="space-y-4">
                                                <div className={`rounded-2xl border p-6 ${panelSurface}`}>
                                                    <h4 className={`mb-3 text-lg font-semibold ${textPrimary}`}>Tech Stack</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {detail.tech.map((tech) => (
                                                            <motion.span
                                                                key={tech}
                                                                whileHover={{ scale: 1.1 }}
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                whileInView={{ opacity: 1, scale: 1 }}
                                                                viewport={{ once: true }}
                                                                transition={{ duration: 0.2 }}
                                                                className={`rounded-full px-2.5 py-1 text-xs font-medium cursor-default ${isDark
                                                                        ? "bg-cyan-500/10 text-cyan-300"
                                                                        : "bg-emerald-100 text-emerald-700"
                                                                    }`}
                                                            >
                                                                {tech}
                                                            </motion.span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className={`rounded-2xl border p-6 ${panelSurface}`}>
                                                    <div className="flex items-center justify-between gap-3 mb-2">
                                                        <h4 className={`text-lg font-semibold leading-none ${textPrimary}`}>Try it</h4>
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold leading-none cursor-default ${isDark
                                                                    ? "bg-cyan-500/15 text-cyan-100 border border-cyan-400/40"
                                                                    : "bg-cyan-100 text-cyan-800 border border-cyan-200"
                                                                }`}
                                                        >
                                                            Live &amp; Code
                                                        </span>
                                                    </div>
                                                    <p className={`mb-4 text-sm ${textSecondary}`}>
                                                        Choose the live flow to feel the UX, or open the repo to inspect patterns and architecture.
                                                    </p>
                                                    <div className="grid gap-2 sm:grid-cols-2">
                                                        <motion.a
                                                            href={isLiveAvailable ? project.liveUrl : undefined}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            whileHover={{ scale: 1.02, y: -2 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            aria-disabled={!isLiveAvailable}
                                                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all border ${isLiveAvailable
                                                                    ? isDark
                                                                        ? "bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 text-emerald-50 hover:from-emerald-500/40 hover:to-cyan-500/40 border-emerald-400/50 shadow-lg shadow-emerald-500/15"
                                                                        : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 shadow-md shadow-emerald-300/30"
                                                                    : isDark
                                                                        ? "bg-white/5 text-white/60 border-white/10 cursor-not-allowed"
                                                                        : "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                                                                }`}
                                                            onClick={(event) => handleActionClick(event, isLiveAvailable, "live")}
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                            Live demo
                                                        </motion.a>
                                                        <motion.a
                                                            href={isCodeAvailable ? project.githubUrl : undefined}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            whileHover={{ scale: 1.02, y: -2 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            aria-disabled={!isCodeAvailable}
                                                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all border ${isCodeAvailable
                                                                    ? isDark
                                                                        ? "bg-white/10 text-white hover:bg-white/15 border-white/25 shadow-lg shadow-cyan-500/15"
                                                                        : "bg-slate-900 text-white hover:bg-slate-800 border-slate-800 shadow-md"
                                                                    : isDark
                                                                        ? "bg-white/5 text-white/60 border-white/10 cursor-not-allowed"
                                                                        : "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                                                                }`}
                                                            onClick={(event) => handleActionClick(event, isCodeAvailable, "code")}
                                                        >
                                                            <Github className="w-4 h-4" />
                                                            View code
                                                        </motion.a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`rounded-2xl border p-6 ${panelSurface}`}>
                                            <h3 className={`mb-3 text-xl font-semibold ${textPrimary}`}>Key features</h3>
                                            <div className="space-y-3 text-sm">
                                                {detail.features.map((item, idx) => (
                                                    <div
                                                        key={item}
                                                        className={`flex items-center gap-3 ${isDark ? "text-white/80" : "text-slate-700"}`}
                                                    >
                                                        <motion.span
                                                            className={`flex h-6 w-6 items-center justify-center rounded-full border-[2px] ${isDark
                                                                    ? "border-emerald-400 bg-emerald-500/10"
                                                                    : "border-emerald-500/80 bg-emerald-50"
                                                                }`}
                                                            animate={{ scale: [1, 1.06, 1] }}
                                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.08 }}
                                                        >
                                                            <Check className={`h-3.5 w-3.5 ${isDark ? "text-emerald-300" : "text-emerald-600"}`} />
                                                        </motion.span>
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[320px] flex-col gap-3">
                <AnimatePresence>
                    {notifications.map((note) => (
                        <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.96 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            layout
                            className={`pointer-events-auto overflow-hidden rounded-2xl border shadow-xl backdrop-blur ${isDark ? "bg-slate-900/90 border-white/10 text-white" : "bg-white/95 border-slate-200 text-slate-900"}`}
                            role="status"
                        >
                            <div className={`h-1 w-full ${isDark ? "bg-gradient-to-r from-emerald-400 via-cyan-400 to-transparent" : "bg-gradient-to-r from-emerald-500 via-cyan-500 to-transparent"}`} />
                            <div className="flex items-start gap-3 px-4 py-3">
                                <span className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border ${isDark ? "border-white/10 bg-white/5 text-emerald-100" : "border-emerald-100 bg-emerald-50 text-emerald-700"}`}>
                                    <Ban className="h-4 w-4" />
                                </span>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-semibold leading-none">{note.title}</p>
                                    <p className={`text-xs leading-relaxed ${isDark ? "text-white/70" : "text-slate-600"}`}>{note.message}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setNotifications((prev) => prev.filter((item) => item.id !== note.id))}
                                    className={`rounded-md p-2 text-xs font-semibold transition-colors ${isDark ? "text-white/60 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </>
    );
}
