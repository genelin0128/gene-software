/**
 * ParticleField.tsx
 *
 * Decorative floating particles component using CSS animations
 * Features: Random particle generation, floating animation, theme-aware colors
 *
 */

"use client";

import { useState, useEffect } from "react";

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
}

interface ParticleFieldProps {
    isDark: boolean;
    count?: number;
}

export default function ParticleField({ isDark, count = 12 }: ParticleFieldProps) {
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
            })),
        );
    }, [count]);

    const colors = isDark
        ? ["bg-[#6fa79b]/25", "bg-[#9aa89d]/20", "bg-[#b3a474]/18", "bg-white/18"]
        : ["bg-[#6fa79b]/25", "bg-[#b3a474]/20", "bg-[#8da399]/18", "bg-[#2f3d39]/12"];

    // Don't render until particles are generated (client-side only)
    if (particles.length === 0) {
        return null;
    }

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5" aria-hidden="true">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className={`absolute rounded-full opacity-50 ${colors[particle.id % colors.length]}`}
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                    }}
                />
            ))}
        </div>
    );
}
