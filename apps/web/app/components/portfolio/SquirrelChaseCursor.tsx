"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useVelocity, type SpringOptions } from "motion/react";

interface SquirrelChaseCursorProps {
    isDark: boolean;
}

type SurfaceRect = {
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
};

type ChaseTarget = {
    x: number;
    y: number;
    grabbing: boolean;
};

const HOVER_FINE_POINTER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";
const SURFACE_SELECTOR = [
    "h1",
    "h2",
    "h3",
    "a",
    "button",
    "[data-squirrel-surface]",
    ".project-card-surface",
    ".timeline-surface",
].join(",");

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function collectSurfaceRects() {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(SURFACE_SELECTOR));
    const rects: SurfaceRect[] = [];

    for (let i = 0; i < elements.length && rects.length < 120; i += 1) {
        const element = elements[i];
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.width < 32 || rect.height < 18) continue;
        if (rect.bottom < -80 || rect.top > window.innerHeight + 80) continue;

        rects.push({
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
        });
    }

    return rects;
}

function resolveChaseTarget(pointerX: number, pointerY: number, surfaces: SurfaceRect[]): ChaseTarget {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    let closest: SurfaceRect | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < surfaces.length; i += 1) {
        const rect = surfaces[i];
        if (!rect) continue;

        const dx = pointerX < rect.left ? rect.left - pointerX : pointerX > rect.right ? pointerX - rect.right : 0;
        const dy = pointerY < rect.top ? rect.top - pointerY : pointerY > rect.bottom ? pointerY - rect.bottom : 0;
        const distance = Math.hypot(dx, dy);

        if (distance < closestDistance) {
            closestDistance = distance;
            closest = rect;
        }
    }

    if (closest && closestDistance < 118) {
        const distanceToTop = Math.abs(pointerY - closest.top);
        const distanceToBottom = Math.abs(pointerY - closest.bottom);
        const distanceToLeft = Math.abs(pointerX - closest.left);
        const distanceToRight = Math.abs(pointerX - closest.right);
        const edge = Math.min(distanceToTop, distanceToBottom, distanceToLeft, distanceToRight);
        const padding = 16;

        if (edge === distanceToLeft) {
            return {
                x: closest.left - 24,
                y: clamp(pointerY, closest.top + padding, closest.bottom - padding),
                grabbing: true,
            };
        }

        if (edge === distanceToRight) {
            return {
                x: closest.right + 24,
                y: clamp(pointerY, closest.top + padding, closest.bottom - padding),
                grabbing: true,
            };
        }

        return {
            x: clamp(pointerX - 48, closest.left + padding, closest.right - padding),
            y: edge === distanceToTop ? closest.top - 28 : closest.bottom + 28,
            grabbing: true,
        };
    }

    return {
        x: clamp(pointerX - 52, 34, viewportWidth - 34),
        y: clamp(pointerY + 52, 54, viewportHeight - 42),
        grabbing: false,
    };
}

function PineConeIcon({ isDark }: { isDark: boolean }) {
    const stroke = isDark ? "#ffe1a5" : "#4f3726";
    const fill = isDark ? "#b67836" : "#a36a32";
    const scaleFill = isDark ? "#e6a64f" : "#c98a3e";

    return (
        <svg viewBox="0 0 42 54" aria-hidden="true" className="h-full w-full">
            <path
                d="M20.5 3.5c8.3 5.6 13.4 14.3 13.4 24.3 0 10.7-5.4 19.8-13.2 22.8C12.6 47.4 7.8 38.2 8 27.5 8.2 17.5 13.1 8.9 20.5 3.5Z"
                fill={fill}
                stroke={stroke}
                strokeWidth="2.2"
                strokeLinejoin="round"
            />
            {[
                ["20.6 6.5", "14.6 14.8 20.6 20.6 26.7 14.8"],
                ["13.7 17.5", "8.9 25 16.8 29.4 20.9 22.1"],
                ["27.5 17.5", "33.1 25.2 24.7 29.6 20.9 22.1"],
                ["20.8 23.9", "13 32 20.8 37.9 28.5 32"],
                ["12.9 32.5", "10.4 39.5 18.3 43.4 20.8 38.2"],
                ["28.4 32.5", "31.2 39.5 23.2 43.4 20.8 38.2"],
            ].map(([origin, points]) => (
                <polygon
                    key={`${origin}-${points}`}
                    points={`${origin} ${points}`}
                    fill={scaleFill}
                    stroke={stroke}
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                />
            ))}
            <path
                d="M20.7 3.7c-.2 4.3 1.5 7.4 5.6 9.4M20.7 3.7c.7 4.1-1.2 7-5.2 9"
                fill="none"
                stroke={stroke}
                strokeLinecap="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function SquirrelIcon({ isDark, grabbing }: { isDark: boolean; grabbing: boolean }) {
    const fur = isDark ? "#b77742" : "#8a5a35";
    const belly = isDark ? "#f1c987" : "#dba96a";
    const line = isDark ? "#4a2b1c" : "#3b2a21";
    const highlight = isDark ? "#f5dfb2" : "#f0d3a2";

    return (
        <svg viewBox="0 0 104 78" aria-hidden="true" className="h-full w-full drop-shadow-[0_12px_18px_rgba(20,28,34,0.28)]">
            <motion.path
                d="M28 45c-17-1-25-11-21-23C11 9 25 12 29 24c3 9-7 15-2 22 4 5 12 3 16 0-2 11-10 15-18 13"
                fill={fur}
                stroke={line}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ rotate: grabbing ? [-4, 5, -2] : [0, 6, -3, 0] }}
                transition={{ duration: grabbing ? 1.1 : 1.6, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "44px 48px" }}
            />
            <ellipse cx="51" cy="45" rx="24" ry="18" fill={fur} stroke={line} strokeWidth="3" />
            <ellipse cx="54" cy="49" rx="15" ry="11" fill={belly} opacity="0.92" />
            <circle cx="76" cy="31" r="15" fill={fur} stroke={line} strokeWidth="3" />
            <path d="M74 17 80 6l5 12" fill={fur} stroke={line} strokeWidth="3" strokeLinejoin="round" />
            <path d="M66 22 59 12l11 3" fill={fur} stroke={line} strokeWidth="3" strokeLinejoin="round" />
            <circle cx="82" cy="29" r="2.6" fill={line} />
            <path d="M88 36c5 1 7 3 8 6" fill="none" stroke={line} strokeLinecap="round" strokeWidth="3" />
            <path d="M70 37c4 3 10 3 14 0" fill="none" stroke={highlight} strokeLinecap="round" strokeWidth="2.4" />
            <motion.g
                animate={{ rotate: grabbing ? -22 : [-12, 12, -12] }}
                transition={{ duration: 0.42, repeat: grabbing ? 0 : Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "62px 58px" }}
            >
                <path d="M61 58c5 7 13 7 19 3" fill="none" stroke={line} strokeLinecap="round" strokeWidth="4" />
                <circle cx="80" cy="61" r="3.5" fill={line} />
            </motion.g>
            <motion.g
                animate={{ rotate: grabbing ? 18 : [12, -12, 12] }}
                transition={{ duration: 0.42, repeat: grabbing ? 0 : Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "43px 59px" }}
            >
                <path d="M43 58c-2 8 2 12 10 12" fill="none" stroke={line} strokeLinecap="round" strokeWidth="4" />
                <circle cx="53" cy="70" r="3.5" fill={line} />
            </motion.g>
            <motion.g
                animate={{ y: grabbing ? -2 : [0, -3, 0] }}
                transition={{ duration: 0.36, repeat: Infinity, ease: "easeInOut" }}
            >
                <path d="M72 43c8 0 13-2 17-7" fill="none" stroke={line} strokeLinecap="round" strokeWidth="3.5" />
                <path d="M70 45c7 4 13 4 18 1" fill="none" stroke={line} strokeLinecap="round" strokeWidth="3.5" />
            </motion.g>
        </svg>
    );
}

export default function SquirrelChaseCursor({ isDark }: SquirrelChaseCursorProps) {
    const [canUseCursor, setCanUseCursor] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isGrabbing, setIsGrabbing] = useState(false);
    const [facing, setFacing] = useState<1 | -1>(1);
    const surfacesRef = useRef<SurfaceRect[]>([]);
    const rafRef = useRef<number | null>(null);
    const lastPointerRef = useRef({ x: 0, y: 0 });
    const targetRef = useRef({ x: 80, y: 80 });

    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const squirrelTargetX = useMotionValue(80);
    const squirrelTargetY = useMotionValue(80);

    const squirrelSpring: SpringOptions = { damping: 18, stiffness: 170, mass: 0.72 };
    const squirrelX = useSpring(squirrelTargetX, squirrelSpring);
    const squirrelY = useSpring(squirrelTargetY, squirrelSpring);
    const squirrelVelocityX = useVelocity(squirrelX);
    const squirrelTilt = useTransform(squirrelVelocityX, [-900, 0, 900], [-10, 0, 10], { clamp: true });

    useEffect(() => {
        const media = window.matchMedia(HOVER_FINE_POINTER_MEDIA_QUERY);
        const update = () => setCanUseCursor(media.matches);
        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        if (!canUseCursor) return;

        const updateSurfaces = () => {
            surfacesRef.current = collectSurfaceRects();
        };
        const scheduleChase = () => {
            if (rafRef.current !== null) return;
            rafRef.current = window.requestAnimationFrame(() => {
                rafRef.current = null;
                const { x, y } = lastPointerRef.current;
                const target = resolveChaseTarget(x, y, surfacesRef.current);
                const previousX = targetRef.current.x;
                targetRef.current = { x: target.x, y: target.y };

                squirrelTargetX.set(target.x);
                squirrelTargetY.set(target.y);
                setIsGrabbing((current) => (current === target.grabbing ? current : target.grabbing));

                if (Math.abs(target.x - previousX) > 2) {
                    const nextFacing = target.x >= previousX ? 1 : -1;
                    setFacing((current) => (current === nextFacing ? current : nextFacing));
                }
            });
        };
        const handlePointerMove = (event: PointerEvent) => {
            if (event.pointerType && event.pointerType !== "mouse") return;
            pointerX.set(event.clientX);
            pointerY.set(event.clientY);
            lastPointerRef.current = { x: event.clientX, y: event.clientY };
            setIsVisible(true);
            scheduleChase();
        };
        const handlePointerLeave = () => setIsVisible(false);
        const handlePointerEnter = () => setIsVisible(true);
        const handlePointerDown = () => setIsClicking(true);
        const handlePointerUp = () => setIsClicking(false);
        let scrollFrame = 0;
        const handleScrollOrResize = () => {
            if (scrollFrame) return;
            scrollFrame = window.requestAnimationFrame(() => {
                scrollFrame = 0;
                updateSurfaces();
                scheduleChase();
            });
        };

        updateSurfaces();
        squirrelTargetX.set(clamp(window.innerWidth * 0.18, 70, window.innerWidth - 70));
        squirrelTargetY.set(window.innerHeight - 52);

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("pointerdown", handlePointerDown);
        window.addEventListener("pointerup", handlePointerUp);
        document.addEventListener("pointerleave", handlePointerLeave);
        document.addEventListener("pointerenter", handlePointerEnter);
        window.addEventListener("scroll", handleScrollOrResize, { passive: true });
        window.addEventListener("resize", handleScrollOrResize);

        return () => {
            if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
            if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("pointerup", handlePointerUp);
            document.removeEventListener("pointerleave", handlePointerLeave);
            document.removeEventListener("pointerenter", handlePointerEnter);
            window.removeEventListener("scroll", handleScrollOrResize);
            window.removeEventListener("resize", handleScrollOrResize);
        };
    }, [canUseCursor, pointerX, pointerY, squirrelTargetX, squirrelTargetY]);

    if (!canUseCursor) return null;

    const coneShadow = isDark
        ? "drop-shadow-[0_10px_12px_rgba(0,0,0,0.48)]"
        : "drop-shadow-[0_8px_10px_rgba(55,45,32,0.22)]";
    const auraColor = isDark ? "bg-[#f4d59d]/18" : "bg-[#8f6a40]/14";

    return (
        <div className="pointer-events-none fixed inset-0 z-[10000]" aria-hidden="true">
            <motion.div
                data-testid="pinecone-cursor"
                className={`absolute z-20 h-11 w-8 ${coneShadow}`}
                style={{
                    x: pointerX,
                    y: pointerY,
                    translateX: "-50%",
                    translateY: "-42%",
                    willChange: "transform",
                }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    rotate: isClicking ? -10 : 0,
                    scale: isClicking ? 0.86 : 1,
                }}
                transition={{ duration: 0.1 }}
            >
                <motion.div
                    className={`absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full ${auraColor} blur-xl`}
                    animate={{ scale: isClicking ? 0.75 : 1, opacity: isVisible ? 1 : 0 }}
                    transition={{ duration: 0.16 }}
                />
                <PineConeIcon isDark={isDark} />
            </motion.div>

            <motion.div
                data-testid="squirrel-chaser"
                className="absolute z-10 h-[58px] w-[78px]"
                style={{
                    x: squirrelX,
                    y: squirrelY,
                    rotate: squirrelTilt,
                    scaleX: facing,
                    translateX: "-50%",
                    translateY: "-52%",
                    transformOrigin: "50% 72%",
                    willChange: "transform",
                }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? (isGrabbing ? 0.84 : 0.8) : 0.62,
                }}
                transition={{
                    opacity: { duration: 0.16 },
                    scale: { type: "spring", stiffness: 320, damping: 22 },
                }}
            >
                <motion.div
                    className="absolute left-1/2 top-[76%] h-5 w-16 -translate-x-1/2 rounded-full bg-black/18 blur-md"
                    animate={{ opacity: isVisible ? 0.55 : 0, scaleX: isGrabbing ? 0.72 : 1 }}
                    transition={{ duration: 0.16 }}
                />
                <motion.div
                    className={`absolute -left-2 top-2 h-8 w-8 rounded-full border ${isDark ? "border-[#f4d59d]/26" : "border-[#6fa79b]/30"}`}
                    animate={{
                        opacity: isGrabbing ? 0.62 : 0,
                        scale: isGrabbing ? [0.75, 1.05, 0.9] : 0.7,
                    }}
                    transition={{ duration: 0.48, repeat: isGrabbing ? Infinity : 0 }}
                />
                <SquirrelIcon isDark={isDark} grabbing={isGrabbing} />
            </motion.div>
        </div>
    );
}
