/**
 * StatsCounter.tsx
 *
 * Animated statistics counter component
 * Features: Number animation, icon display, gradient backgrounds
 *
 */

"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Stat {
    value: number;
    label: string;
    suffix: string;
    color: string;
}

interface CounterProps {
    end: number;
    suffix: string;
    duration?: number;
    isInView: boolean;
}

/**
 * Individual counter with animation
 */
function Counter({ end, suffix, duration = 2, isInView }: CounterProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, isInView]);

    return (
        <span>
      {count}
            {suffix}
    </span>
    );
}

interface StatsCounterProps {
    stats: Stat[];
    isDark: boolean;
}

export default function StatsCounter({ stats, isDark }: StatsCounterProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-4 mt-8"
        >
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`px-6 py-4 rounded-xl transition-all duration-300 ${isDark ? "bg-white/5 border border-white/10 hover:border-white/20" : "bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"}`}
                >
                    <motion.div
                        className={`text-3xl font-bold ${stat.color}`}
                        initial={{ scale: 1 }}
                        whileInView={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <Counter
                            end={stat.value}
                            suffix={stat.suffix}
                            isInView={isInView}
                        />
                    </motion.div>
                    <div className={`text-sm ${isDark ? "text-white/50" : "text-slate-500"}`}>
                        {stat.label}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

