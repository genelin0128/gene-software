/**
 * AvatarCursor.tsx
 *
 * Floating target cursor that displays avatar image when hovering over specific elements
 * Features: Smooth spring animation, avatar image following cursor
 *
 */

"use client";

import { useState, useEffect } from "react";
import { motion, useSpring, useMotionValue, SpringOptions } from "motion/react";
import Image from "next/image";

interface AvatarCursorProps {
    isActive: boolean;
    avatarSrc: string;
}

const HOVER_FINE_POINTER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";

export default function AvatarCursor({ isActive, avatarSrc }: AvatarCursorProps) {
    const [canUseCursor, setCanUseCursor] = useState(false);
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

    useEffect(() => {
        const media = window.matchMedia(HOVER_FINE_POINTER_MEDIA_QUERY);
        const update = () => setCanUseCursor(media.matches);
        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, []);

    if (!canUseCursor || !isActive) return null;

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
                <div className="absolute -z-10 h-40 w-40 rounded-full bg-[#6fa79b]/20 blur-2xl" />

                {/* Avatar image */}
                <div
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl ring-4 ring-[#6fa79b]/30">
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
