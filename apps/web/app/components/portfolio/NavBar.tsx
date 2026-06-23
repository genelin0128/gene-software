/**
 * NavBar.tsx
 *
 * Responsive navigation bar with smooth scroll and mobile menu
 * Features: Glassmorphism effect, scroll-aware styling, animated menu
 *
 */

"use client";

import { useState, useEffect, type MouseEvent as ReactMouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface NavItem {
    name: string;
    href: string;
}

const navItems: NavItem[] = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
];

interface NavBarProps {
    isDark: boolean;
    onThemeToggle: (event: ReactMouseEvent<HTMLButtonElement>) => void;
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

    const glassShell = isDark
        ? "border-white/10 bg-[#07111e]/72 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)]"
        : "border-slate-200/80 bg-white/[0.82] text-slate-800 shadow-[0_18px_55px_rgba(15,23,42,0.12)]";

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="pointer-events-none fixed left-0 right-0 top-3 z-50 px-3 sm:top-4 sm:px-4"
            >
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
                        {/* Logo */}
                        <motion.a
                            href="#home"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNav("#home");
                            }}
                            className={`pointer-events-auto inline-flex h-11 items-center rounded-full border px-4 text-sm font-bold backdrop-blur-xl transition-all duration-300 sm:h-12 sm:px-5 sm:text-base ${glassShell} ${
                                isScrolled ? "translate-y-0" : ""
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className={isDark ? "text-[#d9ebe7]" : "text-[#28544b]"}>
                                Gene Lin
                            </span>
                        </motion.a>

                        {/* Desktop Navigation */}
                        <div className={`pointer-events-auto hidden h-12 items-center gap-1 rounded-full border px-1.5 backdrop-blur-xl transition-all duration-300 md:flex ${glassShell}`}>
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
                                        className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                                            isActive
                                                ? isDark
                                                    ? "text-[#d9ebe7]"
                                                    : "text-slate-900"
                                                : isDark
                                                    ? "text-white/62 hover:text-white"
                                                    : "text-slate-500 hover:text-slate-900"
                                        }`}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="nav-active-pill"
                                                className={`absolute inset-0 rounded-full ${
                                                    isDark
                                                        ? "bg-[#6fa79b]/16 ring-1 ring-[#6fa79b]/22"
                                                        : "bg-[#e6eee9] ring-1 ring-[#cbd9d0]"
                                                }`}
                                                transition={{ type: "spring", stiffness: 460, damping: 34 }}
                                            />
                                        )}
                                        <span className="relative z-10">
                                        {item.name}
                                        </span>
                                    </a>
                                );
                            })}
                        </div>

                        {/* Right side actions */}
                        <div className="pointer-events-auto flex items-center gap-2">
                            <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />

                            {/* Hire Me Button - Desktop */}
                            <motion.a
                                href="#contact"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNav("#contact");
                                }}
                                className="hidden h-12 items-center rounded-full bg-[#2f7f74] px-5 text-sm font-semibold text-white shadow-lg shadow-[#2f7f74]/18 transition-all duration-300 hover:bg-[#286f66] hover:shadow-[#2f7f74]/25 lg:inline-flex"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Hire Me
                            </motion.a>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`grid h-11 w-11 place-items-center rounded-full border backdrop-blur-xl transition-colors sm:h-12 sm:w-12 md:hidden ${glassShell}`}
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
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed inset-x-4 top-20 z-40 overflow-hidden rounded-3xl border p-4 backdrop-blur-xl md:hidden ${glassShell}`}
                    >
                        <div className="flex flex-col gap-2">
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
                                    className={`rounded-2xl px-4 py-3 text-base font-medium transition-colors ${
                                        activeSection === item.href.slice(1)
                                            ? isDark
                                                ? "bg-[#6fa79b]/16 text-[#d9ebe7]"
                                                : "bg-[#e6eee9] text-[#28544b]"
                                            : isDark
                                                ? "text-white/76 hover:bg-white/[0.08] hover:text-white"
                                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
                                className="mt-2 rounded-2xl bg-[#2f7f74] px-4 py-3 text-center text-base font-semibold text-white"
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
