/**
 * ScrollProgress.tsx
 *
 * Scroll progress indicator component
 * Features: Gradient progress bar, smooth animation, fixed position
 *
 */

"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollProgressProps {
    isDark: boolean;
}

export default function ScrollProgress({ isDark }: ScrollProgressProps) {
    const { scrollYProgress } = useScroll();
    const [isVisible, setIsVisible] = useState(false);

    // Smooth spring animation for progress
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Show progress bar after scrolling past hero section
    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 100);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* Top progress bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
                style={{ scaleX }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-300" />

                {/* Glow effect */}
                <div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-300 blur-sm opacity-50" />
            </motion.div>

            {/* Scroll to top button */}
            <motion.button
                onClick={() => {
                    // iOS Safari before 15.4 does not support scroll behavior option
                    // so fall back to instant scroll when smooth scrolling isn't available
                    const supportsSmoothScroll = "scrollBehavior" in document.documentElement.style;
                    if (supportsSmoothScroll) {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    } else {
                        window.scrollTo(0, 0);
                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                    }
                }}
                className={`fixed right-6 z-40 p-3 rounded-full shadow-lg transition-all duration-300 touch-manipulation ${isDark ? "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20" : "bg-white border border-slate-200 hover:bg-slate-50"}`}
                style={{
                    // Lift above mobile browser toolbars (safe areas) and keep reachable
                    bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Scroll to top"
            >
                <motion.svg
                    className={`w-5 h-5 ${isDark ? "text-white" : "text-slate-700"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                </motion.svg>
            </motion.button>
        </>
    );
}
