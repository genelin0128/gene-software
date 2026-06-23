/**
 * Home.tsx
 *
 * Main portfolio page component
 * Features: Dark/light theme, Three.js background, animated sections
 *
 * Tech Stack:
 * - React 18
 * - Three.js for 3D graphics
 * - Motion for animations
 * - Tailwind CSS for styling
 * - Lucide React for icons
 *
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
    Mail, ArrowDown,
    Code2, Layers, Palette, Zap, Download, Sparkles, LucideIcon, Database,
} from "lucide-react";

// Components
import ThreeBackground from "@/app/components/portfolio/ThreeBackground";
import NavBar from "@/app/components/portfolio/NavBar";
import SkillBadge from "@/app/components/portfolio/SkillBadge";
import ProjectCard from "@/app/components/portfolio/ProjectCard";
import ExperienceTimeline from "@/app/components/portfolio/ExperienceTimeline";
import ContactForm from "@/app/components/portfolio/ContactForm";
import { TypewriterText, SectionHeading } from "@/app/components/portfolio/AnimatedText";
import SocialLinks from "@/app/components/portfolio/SocialLinks";
import ScrollProgress from "@/app/components/portfolio/ScrollProgress";
import FrogTongueCursor from "@/app/components/portfolio/FrogTongueCursor";

// Data Types
interface Skill {
    name: string;
    level: number;
    icon: LucideIcon;
}

interface Project {
    title: string;
    description: string;
    image: string;
    tech: string[];
    liveUrl: string;
    githubUrl: string;
    slug?: "gatherpoint" | "cardz" | "baccarat" | "portfolio" | "travel" | "poker";
}

interface Experience {
    role: string;
    company: string;
    location?: string;
    duration?: string;
    description: string;
    skills: string[];
    slug?: "paycom" | "sxb";
}

const skills: Skill[] = [
    { name: "React / Next.js", level: 95, icon: Code2 },
    { name: "TypeScript / JavaScript", level: 92, icon: Code2 },
    { name: "Node.js / Fastify", level: 88, icon: Zap },
    { name: "PostgreSQL / Prisma", level: 86, icon: Database },
    { name: "Swift / SwiftUI", level: 84, icon: Layers },
    { name: "Docker / CI/CD", level: 85, icon: Palette },
];

const projects: Project[] = [
    {
        title: "GatherPoint AI",
        description:
            "App-controlled AI discovery workflow with Next.js, Fastify, Azure OpenAI, PostgreSQL, pgvector retrieval, Redis rate limits, and Cloudflare R2 media lifecycle.",
        image: "/projects/gatherpoint/gatherpoint-demo-detail-clean.png",
        tech: ["TypeScript", "Next.js", "Fastify", "Azure OpenAI", "PostgreSQL", "Prisma", "pgvector", "Redis"],
        liveUrl: "https://gatherpoint.ai/?feed=demo",
        githubUrl: "#",
        slug: "gatherpoint",
    },
    {
        title: "3D Motion Developer Portfolio",
        description: "Next.js portfolio deployed at gene-software.com with a Three.js background, Motion-driven hero, and modal project spotlights.",
        image: "/projects/portfolio/portfolio-1.png",
        tech: ["React", "Next.js", "TypeScript", "Three.js", "Motion", "Tailwind CSS"],
        liveUrl: "https://gene-software.com/",
        githubUrl: "https://github.com/genelin0128/gene-software",
        slug: "portfolio",
    },
    {
        title: "iOS Poker Session Tracking & Analytics App",
        description:
            "Swift iOS app with MVVM session analytics, social workflows, and a secure AWS serverless backend with RS256 JWT + OAuth 2.0 PKCE.",
        image: "/projects/poker/poker-1.png",
        tech: ["Swift", "SwiftUI", "MVVM", "AWS Lambda", "API Gateway", "DynamoDB"],
        liveUrl: "#",
        githubUrl: "#",
        slug: "poker",
    },
    {
        title: "AI Travel Itinerary Recommendation Platform",
        description:
            "Retrieval-augmented itinerary platform that combines user preferences, destination metadata, time windows, SQL feasibility scoring, and Google Maps signals.",
        image: "/projects/travel/travel-1.png",
        tech: ["Python", "SQL", "OpenAI API", "Google Maps API", "RAG"],
        liveUrl: "#",
        githubUrl: "#",
        slug: "travel",
    },
    {
        title: "Cardz Social Media",
        description:
            "Full-stack social platform with middleware-driven access control, optimistic UI interactions, and Jest-backed reliability + abuse mitigation.",
        image: "/projects/cardz/cardz-1.png",
        tech: [
            "React",
            "Redux Toolkit",
            "Node.js",
            "Express",
            "Jest",
            "MongoDB",
        ],
        liveUrl: "https://cardz.surge.sh/",
        githubUrl: "https://github.com/genelin0128/Cardz",
        slug: "cardz",
    },
    {
        title: "Baccarat Game",
        description:
            "Single-page baccarat table with animated chip betting, squeeze reveals, auto-deal tools, and cookie-backed session persistence.",
        image: "/projects/baccarat/Baccarat-1.png",
        tech: [
            "Next.js",
            "React",
            "Bootstrap 5",
            "Motion",
        ],
        liveUrl: "https://baccaratdevelopedbygene.surge.sh/",
        githubUrl: "https://github.com/genelin0128/Baccarat",
        slug: "baccarat",
    },
];

const experiences: Experience[] = [
    {
        role: "Software Development Intern",
        company: "Paycom",
        location: "Irving, TX",
        duration: "May 2025 - August 2025",
        description:
            "Built an IDE-style internal prototyping platform and drag-and-drop UI Playroom with React, TypeScript, Next.js, Monaco Editor, Redux Toolkit, Docker, and AWS Amplify.",
        skills: ["React", "TypeScript", "Next.js", "Redux Toolkit", "Docker", "AWS Amplify"],
        slug: "paycom",
    },
    {
        role: "Software Engineer Intern",
        company: "SXB Liberal Arts & Science Tutoring Center",
        location: "Yunlin, Taiwan",
        duration: "May 2024 - August 2024",
        description:
            "Delivered a production billing and reconciliation platform with MySQL, OAuth 2.0/OIDC + JWT authentication, and Python ETL migration pipelines.",
        skills: ["Python", "SQL", "Vue.js", "OAuth 2.0", "OpenID Connect", "MySQL"],
        slug: "sxb",
    },
];

const typewriterTexts: string[] = [
    "New Grad Software Engineer",
    "Full-Stack Developer",
    "Agentic AI Builder",
    "iOS App Builder",
];

export default function Home() {
    const [isDark, setIsDark] = useState(true);
    const [backgroundIsDark, setBackgroundIsDark] = useState(true);
    const [isEmailRevealed, setIsEmailRevealed] = useState(false);
    const [themeReveal, setThemeReveal] = useState<{
        id: number;
        x: number;
        y: number;
        radius: number;
        nextIsDark: boolean;
    } | null>(null);
    const themeRevealTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        if (window.location.hash) return;

        const resetScroll = () => window.scrollTo(0, 0);
        let secondFrame = 0;

        resetScroll();
        const firstFrame = window.requestAnimationFrame(() => {
            resetScroll();
            secondFrame = window.requestAnimationFrame(resetScroll);
        });
        const timeout = window.setTimeout(resetScroll, 160);

        return () => {
            window.cancelAnimationFrame(firstFrame);
            if (secondFrame) window.cancelAnimationFrame(secondFrame);
            window.clearTimeout(timeout);
        };
    }, []);

    // Persist theme preference
    useEffect(() => {
        const savedTheme = localStorage.getItem("portfolio-theme");
        if (savedTheme) {
            const savedIsDark = savedTheme === "dark";
            setIsDark(savedIsDark);
            setBackgroundIsDark(savedIsDark);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (themeRevealTimeoutRef.current !== null) {
                window.clearTimeout(themeRevealTimeoutRef.current);
            }
        };
    }, []);

    const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
        const newTheme = !isDark;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const radius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y),
        ) + 96;
        const id = Date.now();

        if (themeRevealTimeoutRef.current !== null) {
            window.clearTimeout(themeRevealTimeoutRef.current);
        }

        setThemeReveal({ id, x, y, radius, nextIsDark: newTheme });
        setIsDark(newTheme);
        localStorage.setItem("portfolio-theme", newTheme ? "dark" : "light");

        themeRevealTimeoutRef.current = window.setTimeout(() => {
            setBackgroundIsDark(newTheme);
            setThemeReveal((current) => (current?.id === id ? null : current));
            themeRevealTimeoutRef.current = null;
        }, 820);
    };

    // Dynamic text colors based on theme
    const textPrimary = isDark ? "text-white" : "text-[#1f2933]";
    const textSecondary = isDark ? "text-white/64" : "text-[#536173]";
    const textMuted = isDark ? "text-white/50" : "text-[#7d877f]";

    return (
        <div
            className={`relative min-h-screen overflow-x-hidden ${backgroundIsDark ? "bg-[#070b10]" : "bg-[#f4f7f5]"}`}>
            {/* Background layers */}
            <ThreeBackground isDark={backgroundIsDark} />
            {themeReveal && (
                <motion.div
                    key={themeReveal.id}
                    data-theme-reveal=""
                    className="pointer-events-none fixed inset-0 z-[1]"
                    style={{
                        backgroundColor: themeReveal.nextIsDark ? "#070b10" : "#f4f7f5",
                        clipPath: `circle(0px at ${themeReveal.x}px ${themeReveal.y}px)`,
                    }}
                    animate={{
                        clipPath: `circle(${themeReveal.radius}px at ${themeReveal.x}px ${themeReveal.y}px)`,
                    }}
                    transition={{ duration: 0.76, ease: [0.22, 1, 0.36, 1] }}
                />
            )}

            {/* Foreground content */}
            <div className="relative z-10">
                {/* Custom cursor */}
                <FrogTongueCursor isDark={isDark} />

                {/* UI Components */}
                <ScrollProgress isDark={isDark} />
                <NavBar isDark={isDark} onThemeToggle={handleThemeToggle} />

                {/* ========== HERO SECTION ========== */}
                <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-20 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Availability badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div
                                className={`
                                    inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-sm font-medium
                                    ${isDark
                                    ? "bg-[#1b2a31] text-[#d9ebe7]"
                                    : "bg-[#e6eee9] text-[#28544b]"
                                }
                                `}
                            >
                                <span
                                    className="w-3 h-3 rounded-full bg-[#6fa79b]"
                                />
                                <span
                                    className={`text-sm font-medium ${isDark ? "text-[#d9ebe7]" : "text-[#28544b]"}`}
                                >
                                    Available for opportunities
                                </span>
                            </div>
                        </motion.div>

                        {/* Main heading with animated reveal */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${textPrimary}`}
                        >
                            Hi, I&apos;m{" "}
                            <span
                                className={isDark ? "inline-block text-[#d9ebe7]" : "inline-block text-[#28544b]"}
                                style={{ backgroundSize: "200% 200%" }}
                            >
                                Gene Lin
                            </span>
                        </motion.h1>

                        {/* Typewriter subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`text-xl sm:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed ${textSecondary}`}
                        >
                            A passionate{" "}
                            <TypewriterText texts={typewriterTexts} isDark={isDark} />
                            <br />
                            building full-stack products, backend APIs, and AI workflows
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-wrap items-center justify-center gap-4 mb-12"
                        >
                            <motion.a
                                href="#projects"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="group relative overflow-hidden rounded-full bg-[#2f7f74] px-8 py-4 font-medium text-white"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    View My Work
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-[#286f66]"
                                    initial={{ x: "100%" }}
                                    whileHover={{ x: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.a>

                            <motion.a
                                href="/resume/resume.pdf"
                                download
                                className={`
                px-8 py-4 rounded-full font-medium flex items-center gap-2 transition-all duration-300
                ${isDark
                                    ? "bg-white/5 border border-white/20 text-white hover:bg-white/10"
                                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
                                }
              `}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Download className="w-4 h-4" />
                                Download CV
                            </motion.a>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <SocialLinks isDark={isDark} showLabels />
                        </motion.div>

                        {/* Scroll indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="absolute bottom-10 left-1/2 -translate-x-1/2"
                        >
                            <ArrowDown className={`w-6 h-6 ${textMuted}`} />
                        </motion.div>
                    </div>
                </section>

                {/* ========== ABOUT SECTION ========== */}
                <section id="about" className="px-6 pb-16 pt-24 lg:py-32">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeading title="About Me" highlightColor={isDark ? "text-[#9acdc4]" : "text-[#28544b]"} isDark={isDark} />

                        <div className="grid lg:grid-cols-2 gap-16 items-start">
                            {/* About card */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <div
                                    className={`group relative rounded-xl border p-6 transition-all duration-300 ${
                                        isDark
                                            ? "bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20"
                                            : "bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
                                    }`}
                                >
                                    <div
                                        className={`absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 ${
                                            isDark ? "bg-[#6fa79b]/10" : "bg-[#9aa89d]/12"
                                        }`}
                                    />
                                    <div className="relative space-y-4">
                                        <h3 className={`text-2xl font-semibold ${isDark ? "text-white/90" : "text-slate-800"}`}>
                                            Building Scalable Web and Mobile Systems
                                        </h3>

                                        <div className={`space-y-4 leading-relaxed ${textSecondary}`}>
                                            <p>
                                                I&apos;m Gene Lin, a Rice University Master of Computer Science graduate
                                                with software engineering internships building full-stack product tools,
                                                backend APIs, and cloud-deployed systems.
                                            </p>
                                            <p>
                                                Recently I&apos;ve been building React/Next.js interfaces, Fastify and
                                                Python API workflows, PostgreSQL and MySQL data models, OAuth/JWT
                                                authentication flows, SwiftUI clients, and app-controlled agentic AI
                                                workflows.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Education timeline as card-style entries */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className="relative space-y-6"
                            >
                                <div className="absolute left-8 top-0 bottom-0 w-px pointer-events-none">
                                    <div
                                        className="h-full w-full bg-[#6fa79b]/45" />
                                </div>
                                {[
                                    {
                                        school: "Rice University",
                                        degree: "Master of Computer Science",
                                        period: "Dec 2025",
                                        location: "Houston, TX",
                                    },
                                    {
                                        school: "Feng Chia University",
                                        degree: "Bachelor of Information Engineering & Computer Science",
                                        period: "Jun 2024",
                                        location: "Taichung, Taiwan",
                                    },
                                ].map((edu, idx) => (
                                    <motion.div
                                        key={edu.school}
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                                        viewport={{ once: true }}
                                        className="relative pl-12 sm:pl-16"
                                    >
                                        <div className="absolute left-5 top-4">
                                            <div
                                                className="w-6 h-6 rounded-full bg-[#6fa79b] flex items-center justify-center"
                                            >
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            </div>
                                        </div>

                                        <div
                                            className={`group relative rounded-xl border px-4 py-4 sm:px-5 sm:py-4 transition-all duration-300 ${
                                                isDark
                                                    ? "bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20"
                                                    : "bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
                                            }`}
                                        >
                                            <div
                                                className={`absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 ${
                                                    isDark ? "bg-[#6fa79b]/10" : "bg-[#9aa89d]/12"
                                                }`}
                                            />
                                            <div className="relative space-y-2">
                                                <div className="flex items-center justify-between gap-3">
                                                    <h5 className={`text-base font-semibold ${textPrimary}`}>{edu.school}</h5>
                                                    <motion.span
                                                        whileHover={{ scale: 1.08 }}
                                                        className={`inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full cursor-default ${isDark ? "bg-[#1b2a31] text-[#9acdc4]" : "bg-[#e6eee9] text-[#28544b]"}`}
                                                    >
                                                        {edu.period}
                                                    </motion.span>
                                                </div>
                                                <p className={`${isDark ? "text-white/80" : "text-slate-700"} text-sm leading-relaxed`}>{edu.degree}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                        </div>

                        <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {skills.map((skill, index) => (
                                <SkillBadge
                                    key={skill.name}
                                    name={skill.name}
                                    level={skill.level}
                                    icon={skill.icon}
                                    delay={index * 0.1}
                                    isDark={isDark}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========== EXPERIENCE SECTION ========== */}
                <section id="experience" className="px-6 py-20 lg:py-32">
                    <div className="max-w-4xl mx-auto">
                        <SectionHeading title="Work Experience" highlightColor={isDark ? "text-[#9acdc4]" : "text-[#28544b]"} isDark={isDark} />
                        <ExperienceTimeline experiences={experiences} isDark={isDark} />
                    </div>
                </section>

                {/* ========== PROJECTS SECTION ========== */}
                <section id="projects" className="px-6 py-20 lg:py-32">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeading title="Featured Projects" highlightColor={isDark ? "text-[#9acdc4]" : "text-[#28544b]"} isDark={isDark} />

                        <div className="grid min-w-0 grid-cols-1 gap-8 md:grid-cols-2">
                            {projects.map((project, index) => (
                                <ProjectCard
                                    key={project.title}
                                    project={project}
                                    index={index}
                                    isDark={isDark}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========== CONTACT SECTION ========== */}
                <section id="contact" className="px-6 py-20 lg:py-32">
                    <div className="max-w-4xl mx-auto">
                        <SectionHeading title="Get In Touch" highlightColor={isDark ? "text-[#9acdc4]" : "text-[#28544b]"} isDark={isDark} />

                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Left column - Info */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className="space-y-8"
                            >
                                <div>
                                    <h3 className={`text-xl font-semibold mb-4 ${textPrimary}`}>
                                        Let&apos;s talk software roles and product engineering
                                    </h3>
                                    <p className={`leading-relaxed ${textSecondary}`}>
                                        I&apos;m looking for software engineering opportunities where I can build
                                        product interfaces, API workflows, data-backed systems, and practical AI
                                        features with a strong ownership mindset.
                                    </p>
                                </div>

                                {/* Email card */}
                                <motion.a
                                    href="mailto:chingyao.work@gmail.com"
                                    className={`
                                        flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group
                                        ${isDark
                                        ? "bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#6fa79b]/45"
                                        : "bg-white border border-[#d8d2c7] hover:border-[#6fa79b]/60 shadow-sm"
                                    }
                                    `}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={(e) => {
                                        if (!isEmailRevealed) {
                                            e.preventDefault();
                                            setIsEmailRevealed(true);
                                        }
                                    }}
                                >
                                    <div
                                        className={`p-3 rounded-lg transition-colors ${isDark ? "bg-[#1b2a31] group-hover:bg-[#213640]" : "bg-[#e6eee9] group-hover:bg-[#dce9e2]"}`}>
                                        <Mail className={`w-5 h-5 ${isDark ? "text-[#9acdc4]" : "text-[#28544b]"}`} />
                                    </div>
                                    <div>
                                        <p className={`text-sm ${textMuted}`}>Email</p>
                                        <p
                                            className={`font-medium transition-all ${
                                                isDark
                                                    ? isEmailRevealed
                                                        ? "text-white"
                                                        : "text-white/40 blur-[2px]"
                                                    : isEmailRevealed
                                                        ? "text-slate-800"
                                                        : "text-slate-500 blur-[2px]"
                                            }`}
                                            aria-live="polite"
                                        >
                                            {isEmailRevealed ? "chingyao.work@gmail.com" : "chingyao.work [at] gmail.com"}
                                        </p>
                                        {!isEmailRevealed && (
                                            <p className="text-xs text-[#6fa79b]">Click to reveal</p>
                                        )}
                                    </div>
                                </motion.a>

                                {/* Social links */}
                                <SocialLinks isDark={isDark} size="lg" />
                            </motion.div>

                            {/* Right column - Form */}
                            <ContactForm isDark={isDark} />
                        </div>
                    </div>
                </section>

                {/* ========== FOOTER ========== */}
                <footer className={`py-8 px-6 border-t ${isDark ? "border-white/5" : "border-slate-200"}`}>
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className={`text-sm ${textMuted}`}>
                            © 2026 Gene Lin. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
