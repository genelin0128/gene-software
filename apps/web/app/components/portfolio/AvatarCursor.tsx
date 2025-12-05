/**
 * AvatarCursor.tsx
 *
 * Floating target cursor that displays avatar image when hovering over specific elements
 * Features: Smooth spring animation, avatar image following cursor
 *
 */

"use client";

import { useState, useEffect } from "react";
import { motion, useSpring, useMotionValue, SpringOptions } from "framer-motion";
import Image from "next/image";

interface AvatarCursorProps {
    isActive: boolean;
    avatarSrc: string;
}

export default function AvatarCursor({ isActive, avatarSrc }: AvatarCursorProps) {
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    // Spring config for smooth following animation
    const springConfig: SpringOptions = { damping: 20, stiffness: 150 };

    // Avatar position following cursor
    const avatarX = useSpring(cursorX, springConfig);
    const avatarY = useSpring(cursorY, springConfig);

    useEffect(() => {
        if (!isActive) return;

        const handleMouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [cursorX, cursorY, isActive]);

    // Hide on mobile/touch devices
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        setIsMobile("ontouchstart" in window);
    }, []);

    if (isMobile || !isActive) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[10000]">
            {/* Floating avatar cursor */}
            <motion.div
                className="absolute flex items-center justify-center"
                style={{
                    x: avatarX,
                    y: avatarY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
            >
                {/* Glow effect - behind avatar */}
                <motion.div
                    className="absolute w-40 h-40 rounded-full bg-cyan-400/20 blur-2xl -z-10"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Avatar image */}
                <div
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl ring-4 ring-cyan-400/30">
                    <Image
                        src={avatarSrc}
                        alt="Avatar"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </motion.div>
        </div>
    );
}
