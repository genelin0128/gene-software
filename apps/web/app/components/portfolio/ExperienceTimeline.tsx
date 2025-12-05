/**
 * ExperienceTimeline.tsx
 *
 * Animated timeline component for work experience
 * Features: Staggered entrance animation, gradient timeline, hover cards
 *
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    badge: { text: string; tone: "cyan" | "emerald" };
    title: string;
    summary: string;
    tech: string[];
    image: string;
    imageLabel: string;
    highlights: string[];
    impact: string[];
    metric: string;
}

const detailContent: Record<NonNullable<Experience["slug"]>, ExperienceDetail> = {
    paycom: {
        badge: { text: "Internal UI Playroom", tone: "cyan" },
        title: "Designed and built a drag-and-drop UI Playroom for faster product decisions",
        summary:
            "An internal prototyping workspace where engineers and designers compose screens visually, tune props with Monaco, and publish stable demo links for async reviews.",
        tech: ["React", "TypeScript", "Next.js", "Redux Toolkit", "Docker", "Monaco Editor"],
        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80",
        imageLabel: "Playroom canvas for internal UI prototyping",
        highlights: [
            "Drag-and-drop component gallery and canvas so engineers and designers can sketch screens without writing code.",
            "Integrated Monaco editor for advanced teammates who want to tweak props or extend components inline.",
            "Performance profiling trimmed startup work, cutting initial load and render time by ~45%.",
            "Shareable demo links so reviewers can open the exact state of a screen and make decisions faster.",
        ],
        impact: [
            "Faster iteration loops for cross-functional UI/UX reviews.",
            "Clearer handoff between design and engineering teams.",
            "Stable demo links reduced meeting overhead for feedback.",
        ],
        metric: "Performance profiling cut initial load by about 45%, keeping the Playroom snappy even with a full component catalog.",
    },
    sxb: {
        badge: { text: "Billing & Reconciliation Platform", tone: "emerald" },
        title: "Automated invoicing and reconciliation to shrink manual overhead",
        summary:
            "Created a full billing workflow on MySQL with Python ETL to migrate legacy data, then shipped Vue.js admin views and parameterized SQL endpoints so staff could manage invoices and payments confidently.",
        tech: ["Python", "SQL", "Vue.js", "JavaScript", "HTML/CSS", "MySQL"],
        image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200&q=80",
        imageLabel: "Admin dashboards for billing and reconciliation",
        highlights: [
            "Built an in-house billing and reconciliation system that automated invoices and payment tracking.",
            "Designed a normalized MySQL schema and wrote Python ETL jobs to migrate legacy data cleanly.",
            "Delivered Vue.js admin views backed by RESTful, parameterized SQL endpoints to keep data accurate and auditable.",
        ],
        impact: [
            "Reduced manual billing work and operating costs by roughly 15%.",
            "Improved payment accuracy and audit readiness with clean data migrations.",
            "Gave staff an intuitive admin UI to manage invoices and reconciliation tasks.",
        ],
        metric: "Automated invoicing and reconciliation cut manual work and reduced operating costs by about 15%.",
    },
};

export default function ExperienceTimeline({ experiences, isDark }: ExperienceTimelineProps) {
    const [activeSlug, setActiveSlug] = useState<Experience["slug"] | null>(null);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") setActiveSlug(null);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const badgeTone = (tone: ExperienceDetail["badge"]["tone"]) => {
        if (tone === "emerald") {
            return isDark
                ? "border-emerald-300/60 bg-emerald-500/15 text-emerald-200"
                : "border-emerald-200 bg-emerald-50 text-emerald-700";
        }
        return isDark
            ? "border-cyan-300/60 bg-cyan-500/15 text-cyan-200"
            : "border-cyan-200 bg-cyan-50 text-cyan-700";
    };

    const textPrimary = isDark ? "text-white" : "text-slate-800";
    const textSecondary = isDark ? "text-white/70" : "text-slate-600";
    const bulletDot = (tone: "emerald" | "cyan") =>
        `mt-1 block h-2.5 aspect-square shrink-0 rounded-full ${
            tone === "emerald"
                ? "bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,0.12)]"
                : "bg-cyan-400 shadow-[0_0_0_6px_rgba(34,211,238,0.12)]"
        }`;
    const bulletRing = (tone: "emerald" | "cyan", size: number) =>
        tone === "emerald" ? `0 0 0 ${size}px rgba(52,211,153,0.12)` : `0 0 0 ${size}px rgba(34,211,238,0.12)`;
    const panelSurface = isDark ? "border-white/20 bg-white/5" : "border-slate-200 bg-white shadow-sm";

    // Lock background scroll while modal is open
    useEffect(() => {
        if (activeSlug) {
            const original = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = original;
            };
        }
    }, [activeSlug]);

    return (
        <div className="relative">
            <AnimatePresence>
                {activeSlug && detailContent[activeSlug] && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveSlug(null)}
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
                                if (!activeSlug) return null;
                                const detail = detailContent[activeSlug];
                                if (!detail) return null;
                                return (
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between gap-4">
                                            <div
                                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-tight ${
                                                    isDark ? "border-white/70 bg-white/10 text-white" : "border-slate-200 bg-white text-slate-700"
                                                }`}
                                            >
                                                <span
                                                    className={`h-2 w-2 rounded-full ${
                                                        detail.badge.tone === "emerald" ? "bg-emerald-400" : "bg-cyan-400"
                                                    }`}
                                                />
                                                {detail.badge.text}
                                            </div>
                                            <motion.button
                                                onClick={() => setActiveSlug(null)}
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
                                            className={`relative overflow-hidden rounded-2xl border px-5 py-4 ${
                                                isDark
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
                                                    className={`h-px w-full ${
                                                        detail.badge.tone === "emerald"
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

                                        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.97 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.4 }}
                                                className={`relative overflow-hidden rounded-2xl border ${isDark
                                                        ? "border-white/10 bg-gradient-to-br from-cyan-500/10 via-emerald-500/10 to-transparent"
                                                        : "border-slate-200 bg-gradient-to-br from-cyan-50 via-emerald-50 to-white"
                                                    }`}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                                                <img src={detail.image} alt={detail.imageLabel} className="h-full w-full object-cover" />
                                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                                    <p className="text-sm text-white/80">{detail.imageLabel}</p>
                                                </div>
                                            </motion.div>

                                            <div className="space-y-4">
                                                <div className={`rounded-2xl border p-6 ${panelSurface}`}>
                                                    <h4 className={`mb-3 text-lg font-semibold ${textPrimary}`}>Tech Stack</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {detail.tech.map((tech) => (
                                                            <motion.span
                                                                whileHover={{ scale: 1.1 }}
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                whileInView={{ opacity: 1, scale: 1 }}
                                                                viewport={{ once: true }}
                                                                transition={{ duration: 0.2 }}
                                                                key={tech}
                                                                className={`rounded-full px-2.5 py-1 text-xs font-medium cursor-default ${isDark
                                                                        ? "bg-cyan-500/10 text-cyan-400"
                                                                        : "bg-emerald-100 text-emerald-600"
                                                                    }`}
                                                            >
                                                                {tech}
                                                            </motion.span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className={`rounded-2xl border p-6 ${panelSurface}`}>
                                                    <h4 className={`text-lg font-semibold ${textPrimary}`}>Impact</h4>
                                                    <div className="mt-3 space-y-3 text-sm">
                                                    {detail.impact.map((item, idx) => (
                                                        <div
                                                            key={item}
                                                            className={`flex items-start gap-3 ${isDark ? "text-white/80" : "text-slate-700"}`}
                                                        >
                                                            <motion.span
                                                                className={bulletDot("cyan")}
                                                                style={{ boxShadow: bulletRing("cyan", 6) }}
                                                                animate={{
                                                                    scale: [1, 1.28, 1],
                                                                    opacity: [1, 0.65, 1],
                                                                    boxShadow: [bulletRing("cyan", 4), bulletRing("cyan", 7), bulletRing("cyan", 4)],
                                                                }}
                                                                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.08 }}
                                                            />
                                                            <span>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div
                                                        className={`mt-6 rounded-xl border px-4 py-3 text-sm ${isDark ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-100" : "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                            }`}
                                                    >
                                                        {detail.metric}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-6">
                                            <div className={`rounded-2xl border p-6 ${panelSurface}`}>
                                                <h3 className={`mb-3 text-xl font-semibold ${textPrimary}`}>What I built</h3>
                                                <div className="space-y-3 text-sm">
                                                    {detail.highlights.map((item, idx) => (
                                                        <div
                                                            key={item}
                                                            className={`flex items-start gap-3 ${isDark ? "text-white/80" : "text-slate-700"}`}
                                                        >
                                                            <motion.span
                                                                className={bulletDot("emerald")}
                                                                style={{ boxShadow: bulletRing("emerald", 6) }}
                                                                animate={{
                                                                    scale: [1, 1.28, 1],
                                                                    opacity: [1, 0.65, 1],
                                                                    boxShadow: [bulletRing("emerald", 4), bulletRing("emerald", 7), bulletRing("emerald", 4)],
                                                                }}
                                                                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.08 }}
                                                            />
                                                            <span>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Animated gradient timeline line */}
            <motion.div
                className="absolute left-8 top-0 bottom-0 w-px overflow-hidden"
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
            >
                <div className="h-full w-full bg-gradient-to-b from-cyan-500/50 via-emerald-500/50 to-transparent" />

                {/* Animated pulse along the line */}
                <motion.div
                    className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-cyan-400 to-transparent"
                    animate={{ y: ["0%", "500%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
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
                            <motion.div
                                className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center"
                                whileInView={{
                                    boxShadow: [
                                        "0 0 0 0 rgba(6, 182, 212, 0.4)",
                                        "0 0 0 10px rgba(6, 182, 212, 0)",
                                    ],
                                }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <div className="w-2 h-2 bg-white rounded-full" />
                            </motion.div>
                        </div>

                        {/* Experience card */}
                        <motion.div
                            className={`group relative ${exp.slug ? "cursor-pointer" : "cursor-default"}`}
                            role={exp.slug ? "button" : undefined}
                            tabIndex={exp.slug ? 0 : -1}
                            onClick={() => exp.slug && setActiveSlug(exp.slug)}
                            onKeyDown={(event) => {
                                if (!exp.slug) return;
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    setActiveSlug(exp.slug);
                                }
                            }}
                            whileHover={{ x: exp.slug ? 8 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Hover glow */}
                            <div
                                className={`absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 ${isDark ? "bg-gradient-to-r from-cyan-500/5 to-emerald-500/5" : "bg-gradient-to-r from-emerald-500/5 to-cyan-500/5"}`} />

                            <div
                                className={`relative p-6 rounded-xl transition-all duration-300 ${isDark ? "bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20" : "bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"}`}>
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                                    <h3 className={`text-lg font-semibold transition-colors ${isDark ? "text-white group-hover:text-cyan-400" : "text-slate-800 group-hover:text-emerald-600"}`}>
                                        {exp.role}
                                    </h3>
                                    {exp.duration && (
                                        <motion.span
                                            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full ${isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-emerald-100 text-emerald-600"}`}
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
                                            className={`px-2.5 py-1 text-xs font-medium rounded-full cursor-default ${isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-emerald-100 text-emerald-600"}`}
                                        >
                                            {skill}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
