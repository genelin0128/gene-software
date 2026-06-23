/**
 * ThemeToggle.tsx
 *
 * Animated theme toggle component with sun/moon transition
 * Features: Smooth morphing animation, glowing effects
 *
 */

"use client";

import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon } from "lucide-react";
import type { MouseEvent as ReactMouseEvent } from "react";

interface ThemeToggleProps {
    isDark: boolean;
    onToggle: (event: ReactMouseEvent<HTMLButtonElement>) => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
    return (
        <motion.button
            onClick={onToggle}
            className={`
                relative p-3 rounded-full overflow-hidden
                transition-all duration-500
                ${isDark
                ? "bg-[#101820]/72 border border-white/10 hover:border-[#6fa79b]/50"
                : "bg-white/80 border border-[#d8d2c7] hover:border-[#6fa79b]/50 shadow-lg"}
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
        >
            <div
                className={`
                    absolute inset-0 rounded-full blur-xl opacity-50
                    ${isDark ? "bg-[#6fa79b]" : "bg-[#d8b45a]"}
                `}
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
                            <Moon className="w-5 h-5 text-[#9acdc4]" />

                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-1 h-1 bg-white rounded-full"
                                    style={{
                                        top: `${-5 + i * 8}px`,
                                        right: `${-8 + i * 4}px`,
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

                            <div className="absolute inset-0">
                                {[...Array(8)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-0.5 h-2 bg-amber-400/60 rounded-full"
                                        style={{
                                            top: "50%",
                                            left: "50%",
                                            transformOrigin: "center -6px",
                                            transform: `rotate(${i * 45}deg) translateY(-100%)`,
                                        }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.button>
    );
}
