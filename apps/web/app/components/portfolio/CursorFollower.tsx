/**
 * CursorFollower.tsx
 *
 * Multi-follow cursor animation with trailing dots
 * Features: Multiple followers with delay, smooth spring animation, scale on click
 *
 * @author Portfolio Developer
 * @version 1.0.0
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue, SpringOptions } from "motion/react";

interface CursorFollowerProps {
    isDark: boolean;
}

const HOVER_FINE_POINTER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";

export default function CursorFollower({ isDark }: CursorFollowerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [canUseCursor, setCanUseCursor] = useState(false);
    const lastMoveRef = useRef<number>(Date.now());
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    // Spring configs for different followers (slower = more delay)
    const slowSpring: SpringOptions = { damping: 20, stiffness: 150 };
    const slowerSpring: SpringOptions = { damping: 15, stiffness: 80 };
    const slowestSpring: SpringOptions = { damping: 12, stiffness: 50 };

    // Main cursor position
    const mainX = cursorX;
    const mainY = cursorY;

    // Follower positions with increasing delays
    const follower1X = useSpring(cursorX, slowSpring);
    const follower1Y = useSpring(cursorY, slowSpring);
    const follower2X = useSpring(cursorX, slowerSpring);
    const follower2Y = useSpring(cursorY, slowerSpring);
    const follower3X = useSpring(cursorX, slowestSpring);
    const follower3Y = useSpring(cursorY, slowestSpring);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            setIsVisible(true);
            lastMoveRef.current = Date.now();
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [cursorX, cursorY]);

    useEffect(() => {
        const media = window.matchMedia(HOVER_FINE_POINTER_MEDIA_QUERY);
        const update = () => setCanUseCursor(media.matches);
        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, []);

    if (!canUseCursor) return null;

    const ringColor = isDark ? "border-[#9acdc4]/70" : "border-[#2f7f74]/70";
    const trailColor = isDark ? "bg-[#9acdc4]/45" : "bg-[#6fa79b]/70";
    const coreShadow = isDark
        ? "shadow-[0_0_20px_rgba(154,205,196,0.42)]"
        : "shadow-[0_0_24px_rgba(47,127,116,0.42)]";

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {/* Trailing followers (back to front) */}
            <motion.div
                className={`absolute w-3 h-3 rounded-full ${trailColor} blur-[1px] opacity-35`}
                style={{ x: follower3X, y: follower3Y, translateX: "-50%", translateY: "-50%" }}
                animate={{ opacity: isVisible ? 0.2 : 0 }}
            />
            <motion.div
                className={`absolute w-4 h-4 rounded-full ${trailColor} blur-[1px] opacity-45`}
                style={{ x: follower2X, y: follower2Y, translateX: "-50%", translateY: "-50%" }}
                animate={{ opacity: isVisible ? 0.3 : 0 }}
            />
            <motion.div
                className={`absolute w-5 h-5 rounded-full ${trailColor} blur-[1px] opacity-60`}
                style={{ x: follower1X, y: follower1Y, translateX: "-50%", translateY: "-50%" }}
                animate={{ opacity: isVisible ? 0.5 : 0 }}
            />

            {/* Glow aura */}
            <motion.div
                className="absolute w-12 h-12 rounded-full bg-[#6fa79b]/24 blur-2xl"
                style={{ x: mainX, y: mainY, translateX: "-50%", translateY: "-50%" }}
                animate={{ opacity: isVisible ? 0.6 : 0, scale: 1 }}
                transition={{
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.12 },
                }}
            />

            {/* Main cursor dot */}
            <motion.div
                className={`absolute w-5 h-5 rounded-full bg-[#6fa79b] ${coreShadow}`}
                style={{ x: mainX, y: mainY, translateX: "-50%", translateY: "-50%" }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isClicking ? 0.85 : 1,
                }}
                transition={{ scale: { duration: 0.12 } }}
            />

            {/* Outer ring */}
            <motion.div
                className={`absolute w-10 h-10 rounded-full border ${ringColor} mix-blend-screen`}
                style={{ x: mainX, y: mainY, translateX: "-50%", translateY: "-50%" }}
                animate={{
                    opacity: isVisible ? 0.9 : 0.85,
                    scale: isClicking ? 1.28 : 1,
                }}
                transition={{ scale: { duration: 0.18 } }}
            />
        </div>
    );
}
