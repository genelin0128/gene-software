/**
 * ParticleField.tsx
 *
 * Decorative floating particles component using CSS animations
 * Features: Random particle generation, floating animation, theme-aware colors
 *
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
}

interface ParticleFieldProps {
    isDark: boolean;
    count?: number;
}

export default function ParticleField({ isDark, count = 30 }: ParticleFieldProps) {
    // Generate random particles only on client to avoid hydration mismatch
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        // Only generate particles on client side
        setParticles(
            Array.from({ length: count }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 4 + 2,
                duration: Math.random() * 10 + 10,
                delay: Math.random() * 5,
            })),
        );
    }, [count]);

    const colors = isDark
        ? ["bg-cyan-400/30", "bg-emerald-300/30", "bg-lime-300/30", "bg-blue-400/30"]
        : ["bg-emerald-300/40", "bg-cyan-400/40", "bg-lime-300/40", "bg-indigo-400/40"];

    // Don't render until particles are generated (client-side only)
    if (particles.length === 0) {
        return null;
    }

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className={`absolute rounded-full ${colors[particle.id % colors.length]}`}
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, particle.x * 0.2 - 10, 0],
                        opacity: [0.3, 0.7, 0.3],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Larger decorative orbs */}
            <motion.div
                className={`absolute w-96 h-96 rounded-full blur-3xl ${isDark ? "bg-cyan-500/5" : "bg-emerald-300/12"}`}
                style={{ left: "10%", top: "20%" }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className={`absolute w-72 h-72 rounded-full blur-3xl ${isDark ? "bg-emerald-400/6" : "bg-cyan-300/12"}`}
                style={{ right: "15%", bottom: "30%" }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div
                className={`absolute w-64 h-64 rounded-full blur-3xl ${isDark ? "bg-lime-400/8" : "bg-lime-300/12"}`}
                style={{ left: "50%", top: "60%" }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />
        </div>
    );
}
