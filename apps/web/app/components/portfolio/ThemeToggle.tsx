/**
 * ThemeToggle.tsx
 *
 * Animated theme toggle component with sun/moon transition
 * Features: Smooth morphing animation, glowing effects
 *
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
    isDark: boolean;
    onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
    return (
        <motion.button
            onClick={onToggle}
            className={`
                relative p-3 rounded-full overflow-hidden
                transition-all duration-500
                ${isDark
                ? "bg-slate-800/50 border border-white/10 hover:border-cyan-500/50"
                : "bg-white/80 border border-slate-200 hover:border-emerald-500/50 shadow-lg"}
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
        >
            {/* Glow effect */}
            <motion.div
                className={`
                    absolute inset-0 rounded-full blur-xl opacity-50
                    ${isDark ? "bg-cyan-500" : "bg-yellow-400"}
                `}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Icon container */}
            <div className="relative w-5 h-5">
                <AnimatePresence mode="wait">
                    {isDark ? (
                        <motion.div
                            key="moon"
                            initial={{ rotate: -90, scale: 0, opacity: 0 }}
                            animate={{ rotate: 0, scale: 1, opacity: 1 }}
                            exit={{ rotate: 90, scale: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute inset-0"
                        >
                            <Moon className="w-5 h-5 text-cyan-400" />

                            {/* Stars around moon */}
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-white rounded-full"
                                    style={{
                                        top: `${-5 + i * 8}px`,
                                        right: `${-8 + i * 4}px`,
                                    }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                    }}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ rotate: 90, scale: 0, opacity: 0 }}
                            animate={{ rotate: 0, scale: 1, opacity: 1 }}
                            exit={{ rotate: -90, scale: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute inset-0"
                        >
                            <Sun className="w-5 h-5 text-amber-500" />

                            {/* Sun rays */}
                            <motion.div
                                className="absolute inset-0"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            >
                                {[...Array(8)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-0.5 h-2 bg-amber-400/60 rounded-full"
                                        style={{
                                            top: "50%",
                                            left: "50%",
                                            transformOrigin: "center -6px",
                                            transform: `rotate(${i * 45}deg) translateY(-100%)`,
                                        }}
                                        animate={{
                                            opacity: [0.4, 1, 0.4],
                                            scaleY: [0.8, 1.2, 0.8],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: i * 0.1,
                                        }}
                                    />
                                ))}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.button>
    );
}

