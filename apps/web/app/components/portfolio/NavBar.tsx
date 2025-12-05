/**
 * NavBar.tsx
 *
 * Responsive navigation bar with smooth scroll and mobile menu
 * Features: Glassmorphism effect, scroll-aware styling, animated menu
 *
 */

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface NavItem {
    name: string;
    href: string;
}

const navItems: NavItem[] = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" },
];

interface NavBarProps {
    isDark: boolean;
    onThemeToggle: () => void;
    onNavClick?: (href: string) => void;
}

export default function NavBar({ isDark, onThemeToggle, onNavClick }: NavBarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    // Track scroll position for navbar styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Determine which section occupies at least 70% of the viewport height; fallback to closest top
            const viewportHeight = window.innerHeight;
            const sections = navItems.map((item) => item.href.slice(1));
            const visibleSections: { id: string; coverage: number; distanceTop: number }[] = [];

            sections.forEach((id) => {
                const el = document.getElementById(id);
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
                const coverage = Math.max(0, visibleHeight) / viewportHeight;
                visibleSections.push({ id, coverage, distanceTop: Math.abs(rect.top) });
            });

            const dominant = visibleSections.find((section) => section.coverage >= 0.7);
            if (dominant) {
                setActiveSection(dominant.id);
                return;
            }

            if (visibleSections.length) {
                const closest = visibleSections.reduce((prev, curr) => (curr.distanceTop < prev.distanceTop ? curr : prev));
                setActiveSection(closest.id);
            }
        };

        const onResize = () => handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", onResize);

        const rafId = requestAnimationFrame(handleScroll);
        const timeoutId = setTimeout(handleScroll, 150);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", onResize);
            cancelAnimationFrame(rafId);
            clearTimeout(timeoutId);
        };
    }, []);

    // Navigate to section or custom handler
    const handleNav = (href: string) => {
        if (onNavClick) {
            onNavClick(href);
            setIsMobileMenuOpen(false);
            return;
        }
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: "smooth" });
        setIsMobileMenuOpen(false);
    };

    const navBgClass = isDark
        ? isScrolled
            ? "bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5"
            : ""
        : isScrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm"
            : "";

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBgClass}`}
            >
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <motion.a
                            href="#home"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNav("#home");
                            }}
                            className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-500 bg-clip-text text-transparent"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Gene Lin
                        </motion.a>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {navItems.map((item) => {
                                const isActive = activeSection === item.href.slice(1);
                                return (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNav(item.href);
                                        }}
                                        className={`
                      text-sm relative group transition-colors duration-300
                      ${isDark
                                                ? isActive
                                                    ? "text-cyan-400"
                                                    : "text-white/60 hover:text-white"
                                                : isActive
                                                    ? "text-emerald-600"
                                                    : "text-slate-600 hover:text-slate-900"
                                            }
                    `}
                                    >
                                        {item.name}
                                        <motion.span
                                            className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: isActive ? "100%" : 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        <span
                                            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-emerald-500 group-hover:w-full transition-all duration-300" />
                                    </a>
                                );
                            })}
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center gap-4">
                            <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />

                            {/* Hire Me Button - Desktop */}
                            <motion.a
                                href="#contact"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNav("#contact");
                                }}
                                className="hidden md:block px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Hire Me
                            </motion.a>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`md:hidden p-2 transition-colors ${isDark ? "text-white/70 hover:text-white" : "text-slate-600 hover:text-slate-900"
                                    }`}
                                aria-label="Toggle mobile menu"
                            >
                                <AnimatePresence mode="wait">
                                    {isMobileMenuOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <X className="w-6 h-6" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Menu className="w-6 h-6" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed inset-0 z-40 md:hidden pt-20 ${isDark ? "bg-[#0a0a0f]/95 backdrop-blur-xl" : "bg-white/95 backdrop-blur-xl"
                            }`}
                    >
                        <div className="flex flex-col items-center gap-8 p-8">
                            {navItems.map((item, index) => (
                                <motion.a
                                    key={item.name}
                                    href={item.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNav(item.href);
                                    }}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 30 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`text-2xl transition-colors ${isDark ? "text-white/80 hover:text-white" : "text-slate-700 hover:text-slate-900"
                                        }`}
                                >
                                    {item.name}
                                </motion.a>
                            ))}
                            <motion.a
                                href="#contact"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNav("#contact");
                                }}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-4 px-8 py-3 text-lg font-medium bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full text-white"
                            >
                                Hire Me
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
