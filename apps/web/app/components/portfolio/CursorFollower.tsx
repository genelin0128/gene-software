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
import { motion, useSpring, useMotionValue, SpringOptions } from "framer-motion";

interface CursorFollowerProps {
    isDark: boolean;
}

export default function CursorFollower({ isDark }: CursorFollowerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isIdle, setIsIdle] = useState(false);
    const lastMoveRef = useRef<number>(Date.now());
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    // Spring configs for different followers (slower = more delay)
    const springConfig: SpringOptions = { damping: 25, stiffness: 300 };
    const slowSpring: SpringOptions = { damping: 20, stiffness: 150 };
    const slowerSpring: SpringOptions = { damping: 15, stiffness: 80 };
    const slowestSpring: SpringOptions = { damping: 12, stiffness: 50 };

    // Main cursor position
    const mainX = useSpring(cursorX, springConfig);
    const mainY = useSpring(cursorY, springConfig);

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
            if (isIdle) setIsIdle(false);
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

    // Idle detector to trigger breathing animation
    useEffect(() => {
        const interval = window.setInterval(() => {
            const delta = Date.now() - lastMoveRef.current;
            setIsIdle(delta > 400);
        }, 200);
        return () => window.clearInterval(interval);
    }, []);

    // Hide on mobile/touch devices
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        setIsMobile("ontouchstart" in window);
    }, []);

    if (isMobile) return null;

    const coreGradient = isDark
        ? "from-cyan-300 via-emerald-300 to-cyan-200"
        : "from-cyan-500 via-emerald-400 to-teal-300";
    const glowGradient = isDark
        ? "from-cyan-400/25 via-emerald-400/20 to-transparent"
        : "from-cyan-400/55 via-emerald-400/45 to-transparent";
    const ringColor = isDark ? "border-cyan-200/70" : "border-emerald-500/80";
    const trailColor = isDark ? "bg-cyan-200/45" : "bg-emerald-300/85";
    const coreShadow = isDark
        ? "shadow-[0_0_20px_rgba(125,249,255,0.55)]"
        : "shadow-[0_0_26px_rgba(52,211,153,0.85)]";

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
                className={`absolute w-12 h-12 rounded-full bg-gradient-to-r ${glowGradient} blur-2xl`}
                style={{ x: mainX, y: mainY, translateX: "-50%", translateY: "-50%" }}
                animate={{ opacity: isVisible ? 0.95 : 0, scale: isIdle ? [0.9, 1.12, 0.96] : 1 }}
                transition={{
                    opacity: { duration: 0.2 },
                    scale: isIdle ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.12 },
                }}
            />

            {/* Main cursor dot */}
            <motion.div
                className={`absolute w-5 h-5 rounded-full bg-gradient-to-r ${coreGradient} ${coreShadow}`}
                style={{ x: mainX, y: mainY, translateX: "-50%", translateY: "-50%" }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isClicking ? 0.85 : isIdle ? [1, 1.12, 1] : 1,
                }}
                transition={{
                    scale: isIdle
                        ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.12 },
                }}
            />

            {/* Outer ring */}
            <motion.div
                className={`absolute w-10 h-10 rounded-full border ${ringColor} mix-blend-screen`}
                style={{ x: mainX, y: mainY, translateX: "-50%", translateY: "-50%" }}
                animate={{
                    opacity: isVisible ? 0.9 : 0.85,
                    scale: isClicking ? 1.4 : isIdle ? [1, 1.18, 1] : 1,
                }}
                transition={{
                    scale: isIdle
                        ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.18 },
                }}
            />

            {/* Soft pulse ring */}
            <motion.div
                className="absolute rounded-full border border-white/10"
                style={{ x: mainX, y: mainY, width: 32, height: 32, translateX: "-50%", translateY: "-50%" }}
                animate={{
                    opacity: isVisible ? [0.25, 0, 0.25] : 0,
                    scale: isClicking ? [1, 1.5, 1.1] : [1, 1.6, 1],
                }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
            />
        </div>
    );
}
