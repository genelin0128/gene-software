/**
 * ProjectCard.tsx
 *
 * Project showcase card with hover interactions
 * Features: Image zoom, overlay buttons, tech stack badges
 *
 */

"use client";

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ExternalLink, Github, ArrowUpRight, X, Ban } from "lucide-react";

interface Project {
    title: string;
    description: string;
    image: string;
    tech: string[];
    liveUrl: string;
    githubUrl: string;
    slug?: "gatherpoint" | "cardz" | "baccarat" | "portfolio" | "travel" | "poker";
}

interface ProjectDetail {
    badge: { text: string };
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
    gatherpoint: {
        badge: { text: "AI Discovery Workflow" },
        title: "GatherPoint AI",
        summary:
            "Full-stack event discovery system that converts natural-language intent into planner state, SQL and pgvector retrieval, ranked event cards, and draft-event handoff.",
        tech: [
            "TypeScript",
            "Next.js",
            "Fastify",
            "Azure OpenAI",
            "PostgreSQL",
            "Prisma",
            "pgvector",
            "Redis",
            "Cloudflare R2",
        ],
        image: "/projects/gatherpoint/gatherpoint-demo-detail-clean.png",
        gallery: [
            "/projects/gatherpoint/gatherpoint-demo-detail-clean.png",
            "/projects/gatherpoint/gatherpoint-demo-home.png",
        ],
        imageLabel: "GatherPoint AI public demo feed and event detail workflow",
        features: [
            "Orchestrated an app-controlled AI discovery workflow from user intent to validated planner state and ranked event cards.",
            "Built viewer-scoped Fastify APIs for event creation, registration, privacy-aware reads, and assistant state.",
            "Backed API flows with Clerk auth, Zod validation, Redis rate limits, and PostgreSQL data access.",
            "Shipped owner-scoped event image uploads with Cloudflare R2 presigned URLs and background WebP conversion.",
        ],
    },
    portfolio: {
        badge: { text: "Personal Portfolio" },
        title: "3D Motion Developer Portfolio",
        summary:
            "Next.js/TypeScript portfolio deployed at gene-software.com, pairing a Three.js background with Motion-driven sections and modal project spotlights that double as a design playground.",
        tech: ["Next.js", "React", "TypeScript", "Three.js", "Motion", "Tailwind CSS"],
        image: "/projects/portfolio/portfolio-1.png",
        gallery: ["/projects/portfolio/portfolio-1.png", "/projects/portfolio/portfolio-2.png"],
        imageLabel: "Portfolio hero and interactive project gallery",
        features: [
            "Three.js hero scene and particle field tuned for smooth GPU budgets on desktop and mobile.",
            "Dark/light theming persisted via localStorage with restrained tokens updating instantly.",
            "Project modals with image carousels, tech stacks, and guarded CTAs when links are unavailable.",
            "Motion choreography across hero, cards, and timeline for cohesive interaction patterns.",
            "Keyboard-accessible cards, ESC-to-close modals, and responsive layouts that hold up across breakpoints.",
        ],
    },
    poker: {
        badge: { text: "iOS + AWS Serverless" },
        title: "iOS Poker Session Tracking & Analytics App",
        summary:
            "Swift iOS platform with MVVM session analytics, social interaction workflows, and a secure serverless backend using RS256 JWT and OAuth 2.0 PKCE.",
        tech: [
            "Swift",
            "SwiftUI",
            "MVVM",
            "AWS Lambda",
            "API Gateway",
            "DynamoDB",
            "JWT (RS256)",
            "OAuth 2.0 PKCE",
        ],
        image: "/projects/poker/poker-1.png",
        gallery: ["/projects/poker/poker-1.png", "/projects/poker/poker-2.png"],
        imageLabel: "iOS poker session tracking and social analytics workflow",
        features: [
            "Built a SwiftUI MVVM analytics client for session logging, hand-history review, bankroll trends, and social activity.",
            "Turned poker records into searchable mobile workflows.",
            "Implemented RS256 JWTs, OAuth 2.0 PKCE sign-in, refresh-token rotation, and JWKS distribution.",
            "Deployed AWS Lambda and DynamoDB backend workflows for session, analytics, and social data.",
            "Used GSIs, conditional writes, TTL cleanup, and GitHub OIDC CI/CD without long-lived AWS keys.",
        ],
    },
    travel: {
        badge: { text: "Travel Planning" },
        title: "AI Travel Itinerary Recommendation Platform",
        summary:
            "Retrieval-augmented recommendation platform that turns user preferences, destination metadata, and time-window constraints into structured OpenAI context for feasible itinerary generation.",
        tech: ["Python", "SQL", "OpenAI API", "Google Maps API", "RAG"],
        image: "/projects/travel/travel-1.png",
        gallery: ["/projects/travel/travel-1.png", "/projects/travel/travel-2.png"],
        imageLabel: "Travel planning console with itinerary and map views",
        features: [
            "Built a retrieval-augmented recommendation pipeline from user preferences, destination metadata, and time-window constraints.",
            "Generated structured OpenAI context for constraint-aware itinerary generation.",
            "Implemented SQL-backed feasibility scoring with Google Maps API signals.",
            "Ranked destinations by schedule fit, travel distance, available time, and preference match.",
        ],
    },
    cardz: {
        badge: { text: "Social Media Platform" },
        title: "Cardz Social Media",
        summary:
            "A full-stack social media platform with middleware-driven security, normalized client state, and reliability-focused testing.",
        tech: [
            "React",
            "Redux Toolkit",
            "Tailwind CSS",
            "JavaScript",
            "Node.js",
            "Express",
            "MongoDB",
            "Jest",
        ],
        image: "/projects/cardz/cardz-1.png",
        gallery: ["/projects/cardz/cardz-1.png", "/projects/cardz/cardz-2.png", "/projects/cardz/cardz-3.png"],
        imageLabel: "Multi-image card posts with comments and upvotes",
        features: [
            "Engineered a RESTful Node.js/Express backend with layered request validation and middleware-driven access control.",
            "Developed a component-driven React frontend with normalized state management and optimistic interaction updates.",
            "Supported concurrent social interactions including posting, comments, follows, and engagement workflows.",
            "Established Jest-based automated testing for core user journeys and critical regression paths.",
            "Implemented abuse-mitigation controls including request throttling, input sanitization, and suspicious activity thresholds.",
        ],
    },
    baccarat: {
        badge: { text: "Table Game" },
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
            "Animated dealing flow with flip/squeeze overlays or popups, manual flip gating, and Motion result/win toasts.",
            "Mode selector (Beginner/Intermediate/Advanced) sets decision timers; countdown ring auto-flips and locks swaps once time expires.",
            "Automation tools like Auto Deal multi-round runs with stop controls plus paid utilities to swap unflipped cards or reshuffle undealt cards.",
            "Roadmap/telemetry slide-out with recent outcomes, undealt-card counts & probabilities, auto deck reset every 30 rounds, screenshot capture, and user ID/login persistence.",
        ],
    },
};

function ProjectImageCarousel({
    slides,
    imageLabel,
}: {
    slides: string[];
    imageLabel: string;
}) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [dragLimit, setDragLimit] = useState(0);
    const [slideWidth, setSlideWidth] = useState(0);

    useLayoutEffect(() => {
        const viewport = viewportRef.current;
        const track = trackRef.current;
        if (!viewport || !track) return;

        const measure = () => {
            const viewportWidth = viewport.clientWidth;
            const nextSlideWidth = Math.min(
                slides.length > 1 ? viewport.clientWidth * 0.88 : viewport.clientWidth,
                620,
            );
            const measuredSlideWidth = Math.max(280, Math.floor(nextSlideWidth));
            const totalTrackWidth = slides.length * measuredSlideWidth + Math.max(0, slides.length - 1) * 16;

            setSlideWidth(measuredSlideWidth);
            setDragLimit(Math.max(0, totalTrackWidth - viewportWidth));
        };

        measure();
        const resizeObserver = new ResizeObserver(measure);
        resizeObserver.observe(viewport);
        resizeObserver.observe(track);
        return () => resizeObserver.disconnect();
    }, [slides.length]);

    return (
        <div
            ref={viewportRef}
            className="portfolio-carousel relative overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6fa79b]/45"
            aria-label="Project screenshots"
            tabIndex={0}
        >
            <motion.div
                ref={trackRef}
                className="flex w-max cursor-grab gap-4 py-1 active:cursor-grabbing"
                drag={dragLimit > 0 ? "x" : false}
                dragConstraints={{ left: -dragLimit, right: 0 }}
                dragElastic={0}
                dragMomentum={false}
            >
                {slides.map((src, slideIndex) => (
                    <motion.div
                        key={`${src}-${slideIndex}`}
                        className="shrink-0"
                        style={{ width: slideWidth || "100%" }}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: slideIndex * 0.04, ease: "easeOut" }}
                    >
                        <img
                            src={src}
                            alt={`${imageLabel} ${slideIndex + 1}`}
                            draggable={false}
                            className="aspect-[16/10] w-full select-none rounded-2xl object-cover"
                        />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

function TechPillTicker({ tech, isDark }: { tech: string[]; isDark: boolean }) {
    const shouldReduceMotion = useReducedMotion();
    const needsTicker = tech.length > 5;
    const visibleTech = needsTicker ? [...tech, ...tech] : tech;

    return (
        <div
            className="relative h-10 w-full min-w-0 overflow-hidden"
            style={{
                maskImage: needsTicker
                    ? "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)"
                    : undefined,
            }}
        >
            <motion.div
                className="flex w-max gap-2 py-1"
                animate={needsTicker && !shouldReduceMotion ? { x: ["0%", "-50%"] } : undefined}
                transition={
                    needsTicker && !shouldReduceMotion
                        ? { duration: Math.max(12, tech.length * 2.2), ease: "linear", repeat: Infinity }
                        : undefined
                }
            >
                {visibleTech.map((item, itemIndex) => (
                    <span
                        key={`${item}-${itemIndex}`}
                        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                            isDark ? "bg-[#1b2a31] text-[#9acdc4]" : "bg-[#e6eee9] text-[#28544b]"
                        }`}
                    >
                        {item}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

const boldTerms = [
    "app-controlled AI discovery workflow",
    "validated planner state",
    "ranked event cards",
    "viewer-scoped Fastify APIs",
    "Clerk auth",
    "Zod validation",
    "Redis rate limits",
    "PostgreSQL data access",
    "Cloudflare R2 presigned URLs",
    "background WebP conversion",
    "Three.js hero scene",
    "smooth GPU budgets",
    "Dark/light theming",
    "Project modals",
    "Motion choreography",
    "Keyboard-accessible cards",
    "SwiftUI MVVM analytics client",
    "session logging",
    "hand-history review",
    "RS256 JWTs",
    "OAuth 2.0 PKCE",
    "AWS Lambda",
    "DynamoDB",
    "GitHub OIDC CI/CD",
    "retrieval-augmented recommendation pipeline",
    "structured OpenAI context",
    "SQL-backed feasibility scoring",
    "Google Maps API signals",
    "schedule fit",
    "travel distance",
    "RESTful Node.js/Express backend",
    "middleware-driven access control",
    "component-driven React frontend",
    "Jest-based automated testing",
    "abuse-mitigation controls",
    "Interactive betting surface",
    "Animated dealing flow",
    "Mode selector",
    "Automation tools",
    "Roadmap/telemetry slide-out",
];

function renderBoldText(text: string) {
    const terms = boldTerms
        .filter((term) => text.includes(term))
        .sort((a, b) => text.indexOf(a) - text.indexOf(b));

    if (!terms.length) return text;

    const segments: Array<string | { text: string; strong: true }> = [];
    let cursor = 0;

    terms.forEach((term) => {
        const index = text.indexOf(term, cursor);
        if (index === -1) return;
        if (index > cursor) segments.push(text.slice(cursor, index));
        segments.push({ text: term, strong: true });
        cursor = index + term.length;
    });

    if (cursor < text.length) segments.push(text.slice(cursor));

    return segments.map((segment, index) =>
        typeof segment === "string" ? (
            segment
        ) : (
            <strong key={`${segment.text}-${index}`} className="font-semibold text-inherit">
                {segment.text}
            </strong>
        ),
    );
}

export default function ProjectCard({ project, index, isDark }: ProjectCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notifications, setNotifications] = useState<
        { id: number; title: string; message: string }[]
    >([]);
    const cardRef = useRef<HTMLDivElement>(null);
    const isLiveAvailable = Boolean(project.liveUrl && project.liveUrl !== "#");
    const isCodeAvailable = Boolean(project.githubUrl && project.githubUrl !== "#");
    const hasDetail = project.slug && projectDetails[project.slug];
    const textPrimary = isDark ? "text-white" : "text-slate-800";
    const textSecondary = isDark ? "text-white/70" : "text-slate-600";
    const bulletDot = "mt-1 block h-2.5 aspect-square shrink-0 rounded-full bg-[#6fa79b] shadow-[0_0_0_6px_rgba(111,167,155,0.16)]";
    const panelSurface = isDark ? "border-white/12 bg-white/[0.04]" : "border-[#d8d2c7] bg-white";

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
        const scrollY = window.scrollY;
        const originalBodyOverflow = document.body.style.overflow;
        const originalBodyPosition = document.body.style.position;
        const originalBodyTop = document.body.style.top;
        const originalBodyWidth = document.body.style.width;
        const originalHtmlOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
        document.body.classList.add("portfolio-modal-open");

        return () => {
            document.body.style.overflow = originalBodyOverflow;
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.body.style.position = originalBodyPosition;
            document.body.style.top = originalBodyTop;
            document.body.style.width = originalBodyWidth;
            document.body.classList.remove("portfolio-modal-open");
            window.scrollTo(0, scrollY);
        };
    }, [isModalOpen]);

    useEffect(() => {
        if (!isHovered) return;

        const clearIfPointerLeavesCard = (event: MouseEvent | PointerEvent) => {
            const card = cardRef.current;
            if (!card) return;
            const target = document.elementFromPoint(event.clientX, event.clientY);
            if (!target || !card.contains(target)) {
                setIsHovered(false);
            }
        };

        window.addEventListener("pointermove", clearIfPointerLeavesCard, { passive: true });
        window.addEventListener("mousemove", clearIfPointerLeavesCard, { passive: true });
        return () => {
            window.removeEventListener("pointermove", clearIfPointerLeavesCard);
            window.removeEventListener("mousemove", clearIfPointerLeavesCard);
        };
    }, [isHovered]);

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

    return (
        <>
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onPointerEnter={() => setIsHovered(true)}
                onPointerMove={() => setIsHovered(true)}
                onPointerLeave={() => setIsHovered(false)}
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
                className={`group relative h-full min-w-0 ${isHovered ? "project-card-hovered" : ""} ${hasDetail ? "cursor-pointer" : "cursor-default"}`}
            >
                {/* Ambient glow effect */}
                <motion.div
                    className={`
                    absolute -inset-2 rounded-3xl blur-2xl transition-all duration-500
                    ${isDark ? "bg-[#6f8b84]/12" : "bg-[#9aa89d]/14"}
                `}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                />

                <div
                    className={`
                    relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl transition-all duration-500
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
                        <div className={`absolute inset-0 ${isDark ? "bg-[#0b0f14]/18" : "bg-[#fffdf8]/16"}`} />

                        {/* Hover overlay with buttons */}
                        <div className="project-cover-actions pointer-events-none absolute inset-0 flex items-center justify-center gap-4">
                            <a
                                href={isLiveAvailable ? project.liveUrl : undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`project-cover-action project-cover-action-left pointer-events-auto rounded-full border p-4 shadow-lg ${isLiveAvailable
                                    ? isDark
                                        ? "bg-white/10 hover:bg-[#2f7f74] border-white/20 text-white"
                                        : "bg-white/95 border-[#d8d2c7] text-[#1f2933] hover:bg-[#2f7f74] hover:text-white hover:border-[#2f7f74]"
                                    : isDark
                                        ? "bg-white/5 text-white/60 border-white/10 cursor-not-allowed"
                                        : "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                                }`}
                                aria-disabled={!isLiveAvailable}
                                onClick={(event) => handleActionClick(event, isLiveAvailable, "live")}
                            >
                                <ExternalLink
                                    className={`w-5 h-5 ${isLiveAvailable ? (isDark ? "text-white" : "text-slate-800") : isDark ? "text-white/50" : "text-slate-500"}`} />
                            </a>
                            <a
                                href={isCodeAvailable ? project.githubUrl : undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`project-cover-action project-cover-action-right pointer-events-auto rounded-full border p-4 shadow-lg ${isCodeAvailable
                                    ? isDark
                                        ? "bg-white/10 hover:bg-[#2f7f74] border-white/20 text-white"
                                        : "bg-white/95 border-[#d8d2c7] text-[#1f2933] hover:bg-[#2f7f74] hover:text-white hover:border-[#2f7f74]"
                                    : isDark
                                        ? "bg-white/5 text-white/60 border-white/10 cursor-not-allowed"
                                        : "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                                }`}
                                aria-disabled={!isCodeAvailable}
                                onClick={(event) => handleActionClick(event, isCodeAvailable, "code")}
                            >
                                <Github
                                    className={`w-5 h-5 ${isCodeAvailable ? (isDark ? "text-white" : "text-slate-800") : isDark ? "text-white/50" : "text-slate-500"}`} />
                            </a>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex min-h-[168px] min-w-0 flex-1 flex-col p-5 sm:p-6">
                        <div className="flex min-w-0 items-start justify-between gap-3 mb-3">
                            <h3 className={`line-clamp-2 min-w-0 text-xl font-semibold transition-colors duration-300 ${isDark ? "text-white group-hover:text-[#9acdc4]" : "text-[#1f2933] group-hover:text-[#28544b]"}`}>
                                {project.title}
                            </h3>
                            <motion.div
                                animate={{ x: isHovered ? 4 : 0, y: isHovered ? -4 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ArrowUpRight
                                    className={`w-5 h-5 transition-colors duration-300 ${isDark ? "text-white/30 group-hover:text-[#9acdc4]" : "text-[#8b938c] group-hover:text-[#28544b]"}`} />
                            </motion.div>
                        </div>

                        <p className={`mb-4 line-clamp-2 min-w-0 break-words text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                            {project.description}
                        </p>

                        <div className="mt-auto">
                            <TechPillTicker tech={project.tech} isDark={isDark} />
                        </div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {hasDetail && isModalOpen && (
                    <motion.div
                        className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 px-3 py-6 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.24, ease: "easeOut" }}
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-label={project.title}
                            className={`relative max-h-[88vh] w-full max-w-[980px] overflow-hidden rounded-[22px] border shadow-2xl ${
                                isDark
                                    ? "border-white/12 bg-[#080d19]/96 text-white"
                                    : "border-slate-200 bg-white text-slate-900"
                            }`}
                            initial={{ y: 24, opacity: 0, scale: 0.98 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 16, opacity: 0, scale: 0.985 }}
                            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {(() => {
                                if (!hasDetail || !project.slug) return null;
                                const detail = projectDetails[project.slug];
                                const slides = detail.gallery && detail.gallery.length > 0 ? detail.gallery : [detail.image];
                                return (
                                    <motion.div
                                        className="portfolio-modal no-scroll-bounce m-2 max-h-[calc(88vh-16px)] overflow-y-auto overflow-x-hidden rounded-[18px] p-5 sm:p-7"
                                        initial="hidden"
                                        animate="show"
                                        variants={{
                                            hidden: {},
                                            show: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
                                        }}
                                    >
                                        <motion.button
                                            onClick={() => setIsModalOpen(false)}
                                            aria-label="Close"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.96 }}
                                            className={`absolute right-5 top-5 z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border sm:right-7 sm:top-7 ${
                                                isDark
                                                    ? "border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.12]"
                                                    : "border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
                                            }`}
                                        >
                                            <X className="h-5 w-5" />
                                        </motion.button>

                                        <motion.header
                                            className="pr-14 sm:pr-16"
                                            variants={{
                                                hidden: { opacity: 0, y: 12 },
                                                show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: "easeOut" } },
                                            }}
                                        >
                                            <h2 className={`max-w-3xl text-3xl font-bold leading-tight sm:text-4xl ${textPrimary}`}>
                                                {detail.title}
                                            </h2>
                                            <p className={`mt-3 max-w-3xl text-base leading-7 ${textSecondary}`}>
                                                {detail.summary}
                                            </p>
                                            <div className="mt-5 flex max-w-3xl flex-wrap gap-2">
                                                {detail.tech.map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                                                            isDark
                                                                ? "bg-[#1b2a31] text-[#d9ebe7] ring-1 ring-[#6fa79b]/20"
                                                                : "bg-[#e6eee9] text-[#28544b] ring-1 ring-[#cbd9d0]"
                                                        }`}
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.header>

                                        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,0.98fr)_minmax(280px,0.82fr)]">
                                            <motion.section
                                                className="min-w-0"
                                                variants={{
                                                    hidden: { opacity: 0, y: 16 },
                                                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 30 } },
                                                }}
                                            >
                                                <ProjectImageCarousel
                                                    slides={slides}
                                                    imageLabel={detail.imageLabel}
                                                />

                                                <div className="mt-5 flex flex-wrap gap-3">
                                                    <motion.a
                                                        href={isLiveAvailable ? project.liveUrl : undefined}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        whileHover={isLiveAvailable ? { y: -1 } : undefined}
                                                        whileTap={isLiveAvailable ? { scale: 0.98 } : undefined}
                                                        aria-disabled={!isLiveAvailable}
                                                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                                                            isLiveAvailable
                                                                ? "bg-[#2f7f74] text-white hover:bg-[#286f66]"
                                                                : isDark
                                                                    ? "bg-white/5 text-white/45"
                                                                    : "bg-slate-100 text-slate-400"
                                                        }`}
                                                        onClick={(event) => handleActionClick(event, isLiveAvailable, "live")}
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                        Live demo
                                                    </motion.a>
                                                    <motion.a
                                                        href={isCodeAvailable ? project.githubUrl : undefined}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        whileHover={isCodeAvailable ? { y: -1 } : undefined}
                                                        whileTap={isCodeAvailable ? { scale: 0.98 } : undefined}
                                                        aria-disabled={!isCodeAvailable}
                                                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                                                            isCodeAvailable
                                                                ? isDark
                                                                    ? "bg-white/10 text-white hover:bg-white/15"
                                                                    : "bg-slate-900 text-white hover:bg-slate-800"
                                                                : isDark
                                                                    ? "bg-white/5 text-white/45"
                                                                    : "bg-slate-100 text-slate-400"
                                                        }`}
                                                        onClick={(event) => handleActionClick(event, isCodeAvailable, "code")}
                                                    >
                                                        <Github className="h-4 w-4" />
                                                        View code
                                                    </motion.a>
                                                </div>
                                            </motion.section>

                                            <motion.aside
                                                className="min-w-0"
                                                variants={{
                                                    hidden: { opacity: 0, y: 16 },
                                                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 30 } },
                                                }}
                                            >
                                                <motion.section className={`rounded-2xl border p-5 ${panelSurface}`} layout>
                                                    <h3 className={`mb-3 text-sm font-semibold uppercase tracking-[0.18em] ${isDark ? "text-white/50" : "text-slate-500"}`}>
                                                        Highlights
                                                    </h3>
                                                    <div className="space-y-3 text-sm">
                                                        {detail.features.map((item) => (
                                                            <div
                                                                key={item}
                                                                className={`flex items-start gap-3 leading-6 ${
                                                                    isDark ? "text-white/76" : "text-slate-700"
                                                                }`}
                                                            >
                                                                <span className={bulletDot} />
                                                                <span>{renderBoldText(item)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.section>
                                            </motion.aside>
                                        </div>
                                    </motion.div>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="pointer-events-none fixed bottom-5 right-5 z-[90] h-28 w-[min(360px,calc(100vw-40px))]">
                <AnimatePresence>
                    {notifications.slice(-3).reverse().map((note, stackIndex) => (
                        <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: 24, scale: 0.96 }}
                            animate={{
                                opacity: stackIndex === 0 ? 1 : 0.58,
                                y: stackIndex * -10,
                                scale: 1 - stackIndex * 0.045,
                            }}
                            exit={{ opacity: 0, y: 18, scale: 0.96 }}
                            transition={{ type: "spring", stiffness: 460, damping: 34, mass: 0.8 }}
                            layout
                            style={{ zIndex: 3 - stackIndex }}
                            className={`absolute bottom-0 right-0 w-full overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl ${
                                stackIndex === 0 ? "pointer-events-auto" : "pointer-events-none"
                            } ${
                                isDark
                                    ? "border-white/12 bg-[#0b1224]/92 text-white"
                                    : "border-slate-200 bg-white/96 text-slate-900"
                            }`}
                            role="status"
                        >
                            <div className={`h-px w-full ${isDark ? "bg-[#6fa79b]/60" : "bg-[#2f7f74]/45"}`} />
                            <div className="flex items-start gap-3 px-3.5 py-3">
                                <span
                                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                                        isDark
                                            ? "border-[#6fa79b]/20 bg-[#6fa79b]/10 text-[#d9ebe7]"
                                            : "border-[#cbd9d0] bg-[#edf3ee] text-[#28544b]"
                                    }`}>
                                    <Ban className="h-4 w-4" />
                                </span>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className="text-sm font-semibold leading-tight">{note.title}</p>
                                    <p className={`text-xs leading-relaxed ${isDark ? "text-white/62" : "text-slate-600"}`}>{note.message}</p>
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
