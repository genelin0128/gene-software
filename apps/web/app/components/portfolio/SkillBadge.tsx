/**
 * SkillBadge.tsx
 *
 * Animated skill badge with progress bar
 * Features: Entrance animation, progress animation, hover effects
 *
 */

"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SkillBadgeProps {
    name: string;
    level: number;
    icon: LucideIcon;
    delay?: number;
    isDark: boolean;
}

export default function SkillBadge({ name, level, icon: Icon, delay = 0, isDark }: SkillBadgeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="group relative"
        >
            {/* Glow effect on hover */}
            <motion.div
                className={`
                    absolute inset-0 rounded-xl blur-xl transition-all duration-300
                    opacity-0 group-hover:opacity-100
                    ${isDark
                    ? "bg-gradient-to-r from-cyan-500/20 to-emerald-500/20"
                    : "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10"}
                `}
            />

            <div
                className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-300 backdrop-blur-sm
                    ${isDark
                    ? "bg-white/5 border border-white/10 hover:border-cyan-500/50"
                    : "bg-white border border-slate-200 hover:border-emerald-500/50 shadow-sm"}
                `}
            >
                {/* Icon with animated background */}
                <motion.div
                    className={`p-2 rounded-lg ${isDark ? "bg-cyan-500/10" : "bg-emerald-500/10"}`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                >
                    <Icon className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-emerald-600"}`} />
                </motion.div>

                <div className="flex-1">
                    <p className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-800"}`}>
                        {name}
                    </p>

                    {/* Progress bar container */}
                    <div
                        className={`mt-1.5 h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-slate-200"}`}>
                        {/* Animated progress bar */}
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${level}%` }}
                            transition={{ duration: 1.2, delay: delay + 0.3, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="h-full bg-gradient-to-r from-cyan-400 to-emerald-500 rounded-full relative overflow-hidden"
                        >
                            {/* Shimmer effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Percentage badge */}
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: delay + 0.8 }}
                    viewport={{ once: true }}
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isDark ? "bg-white/10 text-white/70" : "bg-slate-100 text-slate-600"}`}
                >
                    {level}%
                </motion.span>
            </div>
        </motion.div>
    );
}

