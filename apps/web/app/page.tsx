/**
 * Home.tsx
 *
 * Main portfolio page component
 * Features: Dark/light theme, Three.js background, animated sections
 *
 * Tech Stack:
 * - React 18
 * - Three.js for 3D graphics
 * - Framer Motion for animations
 * - Tailwind CSS for styling
 * - Lucide React for icons
 *
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Github, Linkedin, Twitter, Mail, ArrowDown,
    Code2, Layers, Palette, Zap, Download, Sparkles, LucideIcon,
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
import ParticleField from "@/app/components/portfolio/ParticleField";
import CursorFollower from "@/app/components/portfolio/CursorFollower";
import AvatarCursor from "@/app/components/portfolio/AvatarCursor";

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
    slug?: "cardz" | "baccarat" | "portfolio" | "travel";
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

interface Stat {
    value: number;
    label: string;
    suffix: string;
    color: string;
}

const skills: Skill[] = [
    { name: "React / Next.js", level: 95, icon: Code2 },
    { name: "TypeScript", level: 90, icon: Code2 },
    { name: "Three.js / WebGL", level: 85, icon: Layers },
    { name: "Tailwind CSS", level: 92, icon: Palette },
    { name: "Node.js", level: 80, icon: Zap },
    { name: "Figma", level: 88, icon: Palette },
];

const projects: Project[] = [
    {
        title: "3D Motion Developer Portfolio",
        description: "Next.js portfolio deployed at gene-software.com with a Three.js background, Framer Motion-driven hero, and modal project spotlights.",
        image: "/projects/portfolio/portfolio-1.png",
        tech: ["React", "Next.js", "TypeScript", "Three.js", "Framer Motion", "Tailwind CSS"],
        liveUrl: "https://gene-software.com/",
        githubUrl: "https://github.com/genelin0128/gene-software",
        slug: "portfolio",
    },
    {
        title: "Intelligent Travel Consultant and Smart Planning",
        description: "AI-assisted travel planner combining RAG recommendations, itinerary heuristics, and map-aware distance checks.",
        image: "/projects/travel/travel-1.png",
        tech: ["Vue.js", "Python", "SQL", "JavaScript", "Google Maps API"],
        liveUrl: "#",
        githubUrl: "#",
        slug: "travel",
    },
    {
        title: "Cardz Social Media",
        description:
            "Full-stack social platform where users create multi-image posts, follow others, and interact through comments, upvotes, and rich profiles with optional Google OAuth linking.",
        image: "/projects/cardz/cardz-1.png",
        tech: [
            "React",
            "Redux Toolkit",
            "Node.js",
            "Express",
            "MongoDB",
            "Tailwind CSS"
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
        duration: "May 2025 - August 2025",
        description: "Built an internal UI Playroom so engineers and designers can drag-and-drop components, sketch flows, and share review links without writing code.",
        skills: ["React", "TypeScript", "Next.js", "Redux Toolkit", "Docker", "Monaco Editor"],
        slug: "paycom",
    },
    {
        role: "Software Engineer Intern",
        company: "SXB Liberal Arts & Science Tutoring Center",
        duration: "May 2024 - August 2024",
        description: "Developed an in-house billing & reconciliation platform with automated invoices, payment tracking, and admin dashboards backed by MySQL.",
        skills: ["Python", "SQL", "Vue.js", "HTML/CSS", "JavaScript", "MySQL"],
        slug: "sxb",
    },
];

const typewriterTexts: string[] = [
    "Frontend Engineer",
    "React Developer",
    "UI/UX Enthusiast",
    "Three.js Creator",
];

export default function Home() {
    const [isDark, setIsDark] = useState(true);
    const [isHoveringGreeting, setIsHoveringGreeting] = useState(false);
    const [isEmailRevealed, setIsEmailRevealed] = useState(false);

    // Persist theme preference
    useEffect(() => {
        const savedTheme = localStorage.getItem("portfolio-theme");
        if (savedTheme) {
            setIsDark(savedTheme === "dark");
        }
    }, []);

    const handleThemeToggle = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem("portfolio-theme", newTheme ? "dark" : "light");
    };

    // Dynamic text colors based on theme
    const textPrimary = isDark ? "text-white" : "text-slate-800";
    const textSecondary = isDark ? "text-white/60" : "text-slate-600";
    const textMuted = isDark ? "text-white/50" : "text-slate-500";

    return (
        <div
            className={`relative min-h-screen overflow-x-hidden transition-colors duration-700 ${isDark ? "bg-[#0a0a0f]" : "bg-slate-50"}`}>
            {/* Background layers */}
            <ThreeBackground isDark={isDark} />
            <ParticleField isDark={isDark} />

            {/* Foreground content */}
            <div className="relative z-10">
                {/* Custom cursor */}
                <CursorFollower isDark={isDark} />
                <AvatarCursor
                    isActive={isHoveringGreeting}
                    avatarSrc="/images/avatar.jpeg"
                />

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
                            <motion.div
                                className={`
                                    inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-sm font-medium
                                    ${isDark
                                        ? "bg-cyan-500/10 text-cyan-300"
                                        : "bg-emerald-100 text-emerald-700"
                                    }
                                `}
                                animate={{
                                    boxShadow: isDark
                                        ? [
                                            "0 0 0 0 rgba(52, 211, 153, 0.35)",
                                            "0 0 0 18px rgba(52, 211, 153, 0)",
                                            "0 0 0 0 rgba(52, 211, 153, 0.35)",
                                        ]
                                        : [
                                            "0 0 0 0 rgba(52, 211, 153, 0.25)",
                                            "0 0 0 18px rgba(52, 211, 153, 0)",
                                            "0 0 0 0 rgba(52, 211, 153, 0.25)",
                                        ],
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                whileHover={{ scale: 1.08 }}
                            >
                                <motion.span
                                    className={`w-3 h-3 rounded-full ${isDark ? "bg-cyan-300" : "bg-emerald-400"}`}
                                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.25, 1] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <span
                                    className={`text-sm font-medium ${isDark ? "text-cyan-200" : "text-emerald-800"}`}
                                >
                                    Available for opportunities
                                </span>
                            </motion.div>
                        </motion.div>

                        {/* Main heading with animated reveal */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${textPrimary} cursor-pointer`}
                            onMouseEnter={() => setIsHoveringGreeting(true)}
                            onMouseLeave={() => setIsHoveringGreeting(false)}
                        >
                            Hi, I&apos;m{" "}
                            <motion.span
                                className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-300 bg-clip-text text-transparent inline-block"
                                animate={{
                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                style={{ backgroundSize: "200% 200%" }}
                            >
                                Gene Lin
                            </motion.span>
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
                            crafting immersive digital experiences
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
                                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full font-medium text-white overflow-hidden"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    View My Work
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500"
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
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <ArrowDown className={`w-6 h-6 ${textMuted}`} />
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* ========== ABOUT SECTION ========== */}
                <section id="about" className="py-32 px-6">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeading title="About Me" highlightColor="text-cyan-400" isDark={isDark} />

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
                                            isDark ? "bg-gradient-to-r from-cyan-500/10 to-emerald-500/10" : "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10"
                                        }`}
                                    />
                                    <div className="relative space-y-4">
                                        <h3 className={`text-2xl font-semibold ${isDark ? "text-white/90" : "text-slate-800"}`}>
                                            Building Thoughtful and Reliable Web Experiences
                                        </h3>

                                        <div className={`space-y-4 leading-relaxed ${textSecondary}`}>
                                            <p>
                                                I&apos;m Gene Lin, a Master of Computer Science candidate at Rice University (graduating December 2025)
                                                focused on modern web development with TypeScript, React, and Next.js. I like shipping interfaces that
                                                feel intentional and fast, with clear component APIs and predictable state.
                                            </p>
                                            <p>
                                                Day to day I balance design fidelity with pragmatic engineering—profiling renders, tuning data flows,
                                                and keeping teams unblocked. Lately I&apos;ve been exploring Three.js for interactive 3D, and on the side
                                                I&apos;m building a small Texas Hold&apos;em app.
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
                                    <div className="h-full w-full bg-gradient-to-b from-cyan-500/60 via-emerald-500/60 to-transparent" />
                                    <motion.div
                                        className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-cyan-400 to-transparent"
                                        animate={{ y: ["0%", "400%"] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    />
                                </div>
                                {[
                                    { school: "Rice University", degree: "Master of Computer Science", period: "2024 - 2025", location: "Houston, TX" },
                                    { school: "Feng Chia University", degree: "Bachelor of Information Engineering & Computer Science", period: "2020 - 2024", location: "Taichung, Taiwan" },
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
                                            <motion.div
                                                className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center"
                                                whileInView={{
                                                    boxShadow: [
                                                        "0 0 0 0 rgba(6, 182, 212, 0.4)",
                                                        "0 0 0 10px rgba(6, 182, 212, 0)",
                                                    ],
                                                }}
                                                transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
                                                viewport={{ once: true }}
                                            >
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            </motion.div>
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
                                                    isDark ? "bg-gradient-to-r from-cyan-500/10 to-emerald-500/10" : "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10"
                                                }`}
                                            />
                                            <div className="relative space-y-2">
                                                <div className="flex items-center justify-between gap-3">
                                                    <h5 className={`text-base font-semibold ${textPrimary}`}>{edu.school}</h5>
                                                    <motion.span
                                                        whileHover={{ scale: 1.08 }}
                                                        className={`inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full cursor-default ${isDark ? "bg-cyan-500/10 text-cyan-400" : "bg-emerald-100 text-emerald-600"}`}
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

                {/* ========== PROJECTS SECTION ========== */}
                <section id="projects" className="py-32 px-6">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeading title="Featured Projects" highlightColor="text-emerald-400" isDark={isDark} />

                        <div className="grid md:grid-cols-2 gap-8">
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

                {/* ========== EXPERIENCE SECTION ========== */}
                <section id="experience" className="py-32 px-6">
                    <div className="max-w-4xl mx-auto">
                        <SectionHeading title="Work Experience" highlightColor="text-emerald-400" isDark={isDark} />
                        <ExperienceTimeline experiences={experiences} isDark={isDark} />
                    </div>
                </section>

                {/* ========== CONTACT SECTION ========== */}
                <section id="contact" className="py-32 px-6">
                    <div className="max-w-4xl mx-auto">
                        <SectionHeading title="Get In Touch" highlightColor="text-cyan-400" isDark={isDark} />

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
                                        Let&apos;s talk about your project
                                    </h3>
                                    <p className={`leading-relaxed ${textSecondary}`}>
                                        I&apos;m always excited to hear about new opportunities and interesting projects.
                                        Whether you need a complete web application or want to improve your existing
                                        product, I&apos;m here to help.
                                    </p>
                                </div>

                                {/* Email card */}
                                <motion.a
                                    href="mailto:genelin@gene-software.com"
                                    className={`
                                        flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group
                                        ${isDark
                                            ? "bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-lg shadow-cyan-500/10"
                                            : "bg-white border border-slate-200 hover:border-emerald-500/60 shadow-sm hover:shadow-emerald-100"
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
                                        className={`p-3 rounded-lg transition-colors ${isDark ? "bg-cyan-500/10 group-hover:bg-cyan-500/20" : "bg-emerald-100 group-hover:bg-emerald-200"}`}>
                                        <Mail className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-emerald-600"}`} />
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
                                            {isEmailRevealed ? "genelin@gene-software.com" : "genelin [at] gene-software.com"}
                                        </p>
                                        {!isEmailRevealed && (
                                            <p className="text-xs text-cyan-400/80">Click to reveal</p>
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
                            © 2025 Gene Lin. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
