/**
 * ExperienceTimeline.tsx
 *
 * Animated timeline component for work experience
 * Features: Staggered entrance animation, gradient timeline, hover cards
 *
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Briefcase, MapPin, Calendar, X } from "lucide-react";

interface Experience {
    role: string;
    company: string;
    location?: string;
    duration?: string;
    description: string;
    skills: string[];
    slug?: "paycom" | "sxb";
}

interface ExperienceTimelineProps {
    experiences: Experience[];
    isDark: boolean;
}

interface ExperienceDetail {
    badge: { text: string };
    title: string;
    summary: string;
    tech: string[];
    image: string;
    imageLabel: string;
    highlights: string[];
}

const detailContent: Record<NonNullable<Experience["slug"]>, ExperienceDetail> = {
    paycom: {
        badge: { text: "IDE-Style UI Playroom" },
        title: "Built an internal prototyping platform to accelerate UI iteration",
        summary:
            "Built an IDE-style internal prototyping platform where product and engineering teams can validate UI flows before production implementation.",
        tech: ["React", "TypeScript", "Next.js", "Redux Toolkit", "Docker", "AWS Amplify", "Monaco Editor"],
        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80",
        imageLabel: "Playroom canvas for internal UI prototyping",
        highlights: [
            "Built an IDE-style internal prototyping platform with React, TypeScript, Next.js, and Monaco Editor.",
            "Enabled product and engineering teams to validate UI flows before production implementation.",
            "Developed a drag-and-drop UI Playroom for composing reusable UI prototypes.",
            "Used Redux Toolkit to preserve component configuration and interaction state across previews.",
            "Containerized the app with Docker and configured AWS Amplify CI/CD for standardized builds and deployments.",
            "Made early UI validation faster for cross-functional product and engineering work.",
        ],
    },
    sxb: {
        badge: { text: "Billing & Reconciliation Platform" },
        title: "Delivered a production billing system with secure backend workflows",
        summary:
            "Built and deployed a production-grade billing and reconciliation platform on MySQL with OAuth 2.0 / OpenID Connect (OIDC) authentication, JWT session controls, and Python-driven ETL modernization.",
        tech: [
            "Python",
            "SQL",
            "MySQL",
            "Vue.js",
            "RESTful APIs",
            "OAuth 2.0",
            "OpenID Connect",
            "JWT",
            "Structured Logging",
        ],
        image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200&q=80",
        imageLabel: "Secure admin dashboards for billing and reconciliation",
        highlights: [
            "Automated invoice generation and payment tracking through a normalized MySQL-backed reconciliation workflow.",
            "Implemented backend authentication using OAuth 2.0 / OpenID Connect (OIDC) with JWT-based session management.",
            "Added structured logging and secure API patterns to strengthen production auditability.",
            "Shipped Vue.js internal tools with RESTful APIs for billing operations and staff administration.",
            "Led Python ETL migrations to modernize legacy datasets and improve data integrity.",
            "Preserved historical payment lookup accuracy through Python ETL and normalized schemas.",
        ],
    },
};

const boldTerms = [
    "IDE-style internal prototyping platform",
    "React",
    "TypeScript",
    "Next.js",
    "Monaco Editor",
    "UI Playroom",
    "Redux Toolkit",
    "Docker",
    "AWS Amplify CI/CD",
    "MySQL-backed reconciliation workflow",
    "OAuth 2.0",
    "OpenID Connect",
    "JWT-based session management",
    "structured logging",
    "secure API patterns",
    "Vue.js",
    "RESTful APIs",
    "Python ETL",
    "data integrity",
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

export default function ExperienceTimeline({ experiences, isDark }: ExperienceTimelineProps) {
    const [activeSlug, setActiveSlug] = useState<Experience["slug"] | null>(null);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") setActiveSlug(null);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const textPrimary = isDark ? "text-white" : "text-slate-800";
    const textSecondary = isDark ? "text-white/70" : "text-slate-600";
    const bulletDot = "mt-1 block h-2.5 aspect-square shrink-0 rounded-full bg-[#6fa79b] shadow-[0_0_0_6px_rgba(111,167,155,0.16)]";
    const panelSurface = isDark ? "border-white/12 bg-white/[0.04]" : "border-[#d8d2c7] bg-white";

    // Lock background scroll while modal is open
    useEffect(() => {
        if (activeSlug) {
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
        }
    }, [activeSlug]);

    return (
        <div className="relative">
            <AnimatePresence>
                {activeSlug && detailContent[activeSlug] && (
                    <motion.div
                        className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 px-3 py-6 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.24, ease: "easeOut" }}
                        onClick={() => setActiveSlug(null)}
                    >
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            className={`relative max-h-[88vh] w-full max-w-[980px] overflow-hidden rounded-[22px] border shadow-2xl ${
                                isDark
                                    ? "border-white/12 bg-[#080d19]/96 text-white"
                                    : "border-[#d8d2c7] bg-[#fffdf8] text-[#1f2933]"
                            }`}
                            initial={{ y: 24, opacity: 0, scale: 0.98 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 16, opacity: 0, scale: 0.985 }}
                            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {(() => {
                                if (!activeSlug) return null;
                                const detail = detailContent[activeSlug];
                                if (!detail) return null;
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
                                            onClick={() => setActiveSlug(null)}
                                            aria-label="Close"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.96 }}
                                            className={`absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border sm:right-7 sm:top-7 ${
                                                isDark
                                                    ? "border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.12]"
                                                    : "border-[#d8d2c7] bg-white text-[#34433f] shadow-sm hover:bg-[#f4f1ea]"
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
                                                    <motion.span
                                                        whileHover={{ scale: 1.06 }}
                                                        key={tech}
                                                        className={`rounded-full px-3 py-1.5 text-xs font-medium cursor-default ${isDark
                                                            ? "bg-[#1b2a31] text-[#9acdc4] ring-1 ring-[#6fa79b]/20"
                                                            : "bg-[#e6eee9] text-[#28544b] ring-1 ring-[#cbd9d0]"
                                                        }`}
                                                    >
                                                        {tech}
                                                    </motion.span>
                                                ))}
                                            </div>
                                        </motion.header>

                                        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,0.94fr)_minmax(280px,0.86fr)]">
                                            <motion.div
                                                className="min-w-0"
                                                variants={{
                                                    hidden: { opacity: 0, y: 16 },
                                                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 30 } },
                                                }}
                                            >
                                                <img
                                                    src={detail.image}
                                                    alt={detail.imageLabel}
                                                    className="aspect-[16/10] w-full rounded-2xl object-cover"
                                                />
                                            </motion.div>

                                            <motion.aside
                                                className="min-w-0"
                                                variants={{
                                                    hidden: { opacity: 0, y: 16 },
                                                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 30 } },
                                                }}
                                            >
                                                <div className={`rounded-2xl border p-5 ${panelSurface}`}>
                                                    <h3 className={`mb-3 text-sm font-semibold uppercase tracking-[0.18em] ${isDark ? "text-white/50" : "text-slate-500"}`}>
                                                        Highlights
                                                    </h3>
                                                    <div className="space-y-3 text-sm">
                                                        {detail.highlights.map((item) => (
                                                            <div
                                                                key={item}
                                                                className={`flex items-start gap-3 leading-6 ${isDark ? "text-white/80" : "text-slate-700"}`}
                                                            >
                                                                <span className={bulletDot} />
                                                                <span>{renderBoldText(item)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.aside>
                                        </div>
                                    </motion.div>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Animated timeline line */}
            <motion.div
                className="absolute left-8 top-0 bottom-0 w-px overflow-hidden"
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
            >
                <div className="h-full w-full bg-[#6fa79b]/45" />

            </motion.div>

            <div className="space-y-12">
                {experiences.map((exp, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="relative pl-20"
                    >
                        {/* Timeline dot with pulse effect */}
                        <div className="absolute left-5 top-2">
                            <div
                                className="w-6 h-6 rounded-full bg-[#6fa79b] flex items-center justify-center"
                            >
                                <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                        </div>

                        {/* Experience card */}
                        <motion.button
                            type="button"
                            className={`timeline-surface group relative block w-full appearance-none p-0 text-left font-[inherit] ${exp.slug ? "cursor-pointer" : "cursor-default"}`}
                            onClick={() => exp.slug && setActiveSlug(exp.slug)}
                            whileHover={{ x: exp.slug ? 8 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Hover glow */}
                            <div
                                className={`absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 ${isDark ? "bg-[#6fa79b]/10" : "bg-[#9aa89d]/12"}`} />

                            <div
                                className={`relative p-6 rounded-xl transition-all duration-300 ${isDark ? "bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20" : "bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"}`}>
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                                    <h3 className={`text-lg font-semibold transition-colors ${isDark ? "text-white group-hover:text-[#9acdc4]" : "text-[#1f2933] group-hover:text-[#28544b]"}`}>
                                        {exp.role}
                                    </h3>
                                    {exp.duration && (
                                        <motion.span
                                            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full ${isDark ? "bg-[#1b2a31] text-[#9acdc4]" : "bg-[#e6eee9] text-[#28544b]"}`}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <Calendar className="w-3 h-3" />
                                            {exp.duration}
                                        </motion.span>
                                    )}
                                </div>

                                {/* Company and location */}
                                <div
                                    className={`flex flex-wrap items-center gap-4 mb-4 text-sm ${isDark ? "text-white/50" : "text-slate-500"}`}>
                                    <div className="flex items-center gap-1.5">
                                        <Briefcase className="w-4 h-4" />
                                        <span>{exp.company}</span>
                                    </div>
                                    {exp.location && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" />
                                            <span>{exp.location}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <p className={`text-sm leading-relaxed mb-4 ${isDark ? "text-white/60" : "text-slate-600"}`}>
                                    {exp.description}
                                </p>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-2">
                                    {exp.skills.map((skill, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.05 * i }}
                                            viewport={{ once: true }}
                                            whileHover={{ scale: 1.1 }}
                                            className={`px-2.5 py-1 text-xs font-medium rounded-full cursor-default ${isDark ? "bg-[#1b2a31] text-[#9acdc4]" : "bg-[#e6eee9] text-[#28544b]"}`}
                                        >
                                            {skill}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        </motion.button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
