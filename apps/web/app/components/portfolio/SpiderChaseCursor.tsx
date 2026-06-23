"use client";

import { useEffect, useRef, useState } from "react";
import {
    animate,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useVelocity,
    type SpringOptions,
} from "motion/react";

interface SpiderChaseCursorProps {
    isDark: boolean;
}

type SurfaceRect = {
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
};

type SpiderMode = "idle" | "crawl" | "shoot" | "swing" | "climb" | "strike";

type ChasePlan = {
    anchorX: number;
    anchorY: number;
    desiredX: number;
    desiredY: number;
    mode: SpiderMode;
    webVisible: boolean;
    step: number;
};

const HOVER_FINE_POINTER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";
const SURFACE_SELECTOR = [
    "h1",
    "h2",
    "h3",
    "a",
    "button",
    "[data-spider-surface]",
    ".project-card-surface",
    ".timeline-surface",
].join(",");

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function getFloorY() {
    return Math.max(96, window.innerHeight - 26);
}

function collectSurfaceRects() {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(SURFACE_SELECTOR));
    const rects: SurfaceRect[] = [];

    for (let i = 0; i < elements.length && rects.length < 150; i += 1) {
        const element = elements[i];
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.width < 36 || rect.height < 18) continue;
        if (rect.bottom < -110 || rect.top > window.innerHeight + 110) continue;

        rects.push({
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2,
        });
    }

    return rects;
}

function findAnchorSurface(pointerX: number, pointerY: number, spiderX: number, spiderY: number, surfaces: SurfaceRect[]) {
    let best: SurfaceRect | null = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (let i = 0; i < surfaces.length; i += 1) {
        const rect = surfaces[i];
        if (!rect) continue;

        const pointerDx = pointerX < rect.left ? rect.left - pointerX : pointerX > rect.right ? pointerX - rect.right : 0;
        const pointerDy = pointerY < rect.top ? rect.top - pointerY : pointerY > rect.bottom ? pointerY - rect.bottom : 0;
        const spiderDx = Math.abs(spiderX - rect.centerX);
        const spiderDy = Math.abs(spiderY - rect.centerY);
        const score = Math.hypot(pointerDx, pointerDy) * 1.45 + spiderDx * 0.22 + spiderDy * 0.18;

        if (score < bestScore) {
            best = rect;
            bestScore = score;
        }
    }

    return bestScore < 360 ? best : null;
}

function planSpiderStep(
    pointerX: number,
    pointerY: number,
    spiderX: number,
    spiderY: number,
    surfaces: SurfaceRect[],
    hasPointer: boolean,
): ChasePlan {
    const width = window.innerWidth;
    const floorY = getFloorY();
    const idleX = clamp(width * 0.16, 82, width - 82);

    if (!hasPointer) {
        return {
            anchorX: idleX,
            anchorY: 0,
            desiredX: idleX,
            desiredY: floorY,
            mode: "idle",
            webVisible: false,
            step: 56,
        };
    }

    const distanceToBug = Math.hypot(pointerX - spiderX, pointerY - spiderY);

    if (distanceToBug < 76) {
        return {
            anchorX: pointerX,
            anchorY: pointerY - 28,
            desiredX: pointerX - 28,
            desiredY: pointerY + 28,
            mode: "strike",
            webVisible: true,
            step: 62,
        };
    }

    if (pointerY > floorY - 136) {
        return {
            anchorX: pointerX,
            anchorY: floorY,
            desiredX: clamp(pointerX - 42, 56, width - 56),
            desiredY: floorY,
            mode: "crawl",
            webVisible: false,
            step: 72,
        };
    }

    const surface = findAnchorSurface(pointerX, pointerY, spiderX, spiderY, surfaces);
    if (!surface) {
        return {
            anchorX: pointerX,
            anchorY: 0,
            desiredX: clamp(pointerX - 36, 56, width - 56),
            desiredY: clamp(pointerY + 124, 92, floorY),
            mode: "shoot",
            webVisible: true,
            step: 54,
        };
    }

    const anchorX = clamp(pointerX, surface.left + 18, surface.right - 18);
    const nearSide = Math.abs(pointerX - surface.left) < 62 || Math.abs(pointerX - surface.right) < 62;
    const insideY = pointerY > surface.top && pointerY < surface.bottom;

    if (nearSide && insideY) {
        const sideX = Math.abs(pointerX - surface.left) < Math.abs(pointerX - surface.right)
            ? surface.left - 18
            : surface.right + 18;

        return {
            anchorX: clamp(sideX, 40, width - 40),
            anchorY: clamp(pointerY, surface.top + 16, surface.bottom - 16),
            desiredX: clamp(sideX, 48, width - 48),
            desiredY: clamp(pointerY + 12, surface.top + 34, surface.bottom - 6),
            mode: "climb",
            webVisible: true,
            step: 38,
        };
    }

    return {
        anchorX,
        anchorY: surface.top - 6,
        desiredX: clamp(pointerX - 38, surface.left + 22, surface.right - 22),
        desiredY: surface.top + 48,
        mode: Math.abs(spiderY - surface.top) > 86 || Math.abs(spiderX - anchorX) > 132 ? "swing" : "crawl",
        webVisible: true,
        step: 48,
    };
}

function stepToward(current: number, desired: number, step: number) {
    const delta = desired - current;
    if (Math.abs(delta) <= step) return desired;
    return current + Math.sign(delta) * step;
}

function BugCursor({ isDark }: { isDark: boolean }) {
    const body = isDark ? "#a7e7dc" : "#2f7f74";
    const wing = isDark ? "rgba(230,255,252,0.76)" : "rgba(215,244,238,0.82)";
    const line = isDark ? "#16413d" : "#1b3f3b";

    return (
        <svg viewBox="0 0 44 36" aria-hidden="true" className="h-full w-full">
            <motion.ellipse
                cx="15"
                cy="15"
                rx="10"
                ry="6"
                fill={wing}
                stroke={line}
                strokeWidth="1.2"
                animate={{ rotate: [-24, 16, -24], scaleY: [0.72, 1.08, 0.72] }}
                transition={{ duration: 0.16, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "25px 19px" }}
            />
            <motion.ellipse
                cx="29"
                cy="15"
                rx="10"
                ry="6"
                fill={wing}
                stroke={line}
                strokeWidth="1.2"
                animate={{ rotate: [24, -16, 24], scaleY: [0.72, 1.08, 0.72] }}
                transition={{ duration: 0.16, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "19px 19px" }}
            />
            <ellipse cx="22" cy="20" rx="8" ry="10" fill={body} stroke={line} strokeWidth="2" />
            <circle cx="19" cy="13" r="4.4" fill={body} stroke={line} strokeWidth="1.8" />
            <circle cx="25" cy="13" r="4.4" fill={body} stroke={line} strokeWidth="1.8" />
            <circle cx="18" cy="12" r="1.5" fill="#0f1718" />
            <circle cx="26" cy="12" r="1.5" fill="#0f1718" />
            <path d="M18 8 14 3M26 8l4-5M17 30l-5 4M27 30l5 4" stroke={line} strokeLinecap="round" strokeWidth="1.8" />
        </svg>
    );
}

function SpiderIcon({ isDark, mode }: { isDark: boolean; mode: SpiderMode }) {
    const body = isDark ? "#1d2326" : "#222725";
    const body2 = isDark ? "#30393d" : "#333b38";
    const line = isDark ? "#91b1aa" : "#284b44";
    const eye = isDark ? "#d7fff8" : "#dff9f3";
    const leg = isDark ? "#151a1d" : "#1c211f";
    const accent = isDark ? "#6fa79b" : "#4d897e";
    const isSwinging = mode === "swing" || mode === "shoot";
    const isCrawling = mode === "crawl" || mode === "climb";
    const isStriking = mode === "strike";
    const cycle = isCrawling ? 0.34 : isSwinging ? 0.62 : 1.2;

    const legA = isStriking ? [-18, -4, -18] : isCrawling ? [-10, 16, -10] : [-4, 5, -4];
    const legB = isStriking ? [18, 2, 18] : isCrawling ? [16, -10, 16] : [5, -4, 5];
    const bodyBob = isStriking ? [0, -5, 0] : isSwinging ? [0, 4, -4, 0] : isCrawling ? [0, -2, 0] : [0, -1, 0];

    const legPath = (side: -1 | 1, y: number, reach: number) => {
        const startX = side === -1 ? 47 : 77;
        const midX = startX + side * reach * 0.44;
        const endX = startX + side * reach;
        return `M${startX} ${y} C${midX} ${y - 18}, ${midX} ${y + 18}, ${endX} ${y + 9}`;
    };

    return (
        <svg viewBox="0 0 124 92" aria-hidden="true" className="h-full w-full drop-shadow-[0_12px_16px_rgba(15,23,27,0.34)]">
            <motion.g
                animate={{ y: bodyBob, rotate: isSwinging ? [-4, 5, -3] : 0 }}
                transition={{ duration: cycle, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "62px 48px" }}
            >
                {[-1, 1].map((side) => (
                    <g key={side}>
                        {[30, 40, 52, 62].map((y, index) => (
                            <motion.path
                                key={`${side}-${y}`}
                                d={legPath(side as -1 | 1, y, 39 + index * 5)}
                                fill="none"
                                stroke={leg}
                                strokeLinecap="round"
                                strokeWidth="5"
                                animate={{ rotate: index % 2 === 0 ? legA : legB }}
                                transition={{ duration: cycle, repeat: Infinity, ease: "easeInOut", delay: index * 0.035 }}
                                style={{ transformOrigin: `${side === -1 ? 48 : 76}px ${y}px` }}
                            />
                        ))}
                    </g>
                ))}

                <ellipse cx="62" cy="54" rx="25" ry="24" fill={body} stroke={line} strokeWidth="2.6" />
                <ellipse cx="62" cy="36" rx="18" ry="15" fill={body2} stroke={line} strokeWidth="2.4" />
                <path d="M50 50c7 4 17 5 25 0M51 61c7 5 17 5 24 0" stroke={accent} strokeLinecap="round" strokeWidth="1.7" opacity="0.55" />
                <circle cx="56" cy="32" r="2.7" fill={eye} />
                <circle cx="64" cy="31" r="2.7" fill={eye} />
                <circle cx="70" cy="34" r="2.1" fill={eye} opacity="0.9" />
                <path d="M56 44l-5 7M68 44l5 7" stroke={eye} strokeLinecap="round" strokeWidth="2" opacity={isStriking ? 1 : 0.55} />
            </motion.g>
        </svg>
    );
}

export default function SpiderChaseCursor({ isDark }: SpiderChaseCursorProps) {
    const [canUseCursor, setCanUseCursor] = useState(false);
    const [hasPointer, setHasPointer] = useState(false);
    const [mode, setMode] = useState<SpiderMode>("idle");
    const [isClicking, setIsClicking] = useState(false);
    const [facing, setFacing] = useState<1 | -1>(1);
    const surfacesRef = useRef<SurfaceRect[]>([]);
    const pointerRef = useRef({ x: 0, y: 0 });
    const targetRef = useRef({ x: 96, y: 96 });
    const hasPointerRef = useRef(false);
    const intervalRef = useRef<number | null>(null);
    const swingControlsRef = useRef<{ stop: () => void } | null>(null);

    const bugX = useMotionValue(0);
    const bugY = useMotionValue(0);
    const spiderTargetX = useMotionValue(96);
    const spiderTargetY = useMotionValue(96);
    const anchorX = useMotionValue(96);
    const anchorY = useMotionValue(0);
    const swingLift = useMotionValue(0);

    const spring: SpringOptions = { damping: 20, stiffness: 150, mass: 0.78 };
    const spiderX = useSpring(spiderTargetX, spring);
    const spiderY = useSpring(spiderTargetY, spring);
    const renderedSpiderY = useTransform(() => spiderY.get() + swingLift.get());
    const spiderVelocityX = useVelocity(spiderX);
    const spiderTilt = useTransform(spiderVelocityX, [-1000, 0, 1000], [-10, 0, 10], { clamp: true });

    useEffect(() => {
        const media = window.matchMedia(HOVER_FINE_POINTER_MEDIA_QUERY);
        const update = () => setCanUseCursor(media.matches);
        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        if (!canUseCursor) return;

        const collect = () => {
            surfacesRef.current = collectSurfaceRects();
        };
        const reset = () => {
            const x = clamp(window.innerWidth * 0.16, 80, window.innerWidth - 80);
            const y = getFloorY();
            targetRef.current = { x, y };
            spiderTargetX.set(x);
            spiderTargetY.set(y);
            anchorX.set(x);
            anchorY.set(0);
            setMode("idle");
        };
        const pulseSwing = (nextMode: SpiderMode, distance: number) => {
            if (nextMode !== "swing" && nextMode !== "shoot" && nextMode !== "strike") return;
            swingControlsRef.current?.stop();
            const lift = nextMode === "strike" ? -8 : -clamp(distance * 0.14, 16, 46);
            swingControlsRef.current = animate(swingLift, [0, lift, 0], {
                duration: nextMode === "strike" ? 0.28 : 0.54,
                ease: [0.2, 0.8, 0.2, 1],
            });
        };
        const tick = () => {
            const previous = targetRef.current;
            const pointer = pointerRef.current;
            const plan = planSpiderStep(
                pointer.x,
                pointer.y,
                previous.x,
                previous.y,
                surfacesRef.current,
                hasPointerRef.current,
            );
            const nextX = stepToward(previous.x, plan.desiredX, plan.step);
            const nextY = stepToward(previous.y, plan.desiredY, plan.step);
            const distance = Math.hypot(nextX - previous.x, nextY - previous.y);

            targetRef.current = { x: nextX, y: nextY };
            spiderTargetX.set(nextX);
            spiderTargetY.set(nextY);
            anchorX.set(plan.anchorX);
            anchorY.set(plan.anchorY);

            if (distance > 8) pulseSwing(plan.mode, distance);
            setMode((current) => (current === plan.mode ? current : plan.mode));

            if (Math.abs(nextX - previous.x) > 2) {
                const nextFacing = nextX >= previous.x ? 1 : -1;
                setFacing((current) => (current === nextFacing ? current : nextFacing));
            }
        };
        const handlePointerMove = (event: PointerEvent) => {
            if (event.pointerType && event.pointerType !== "mouse") return;
            bugX.set(event.clientX);
            bugY.set(event.clientY);
            pointerRef.current = { x: event.clientX, y: event.clientY };
            hasPointerRef.current = true;
            setHasPointer(true);
        };
        const handlePointerLeave = () => {
            hasPointerRef.current = false;
            setHasPointer(false);
            reset();
        };
        const handlePointerDown = () => setIsClicking(true);
        const handlePointerUp = () => setIsClicking(false);
        let frame = 0;
        const handleViewportChange = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(() => {
                frame = 0;
                collect();
                tick();
            });
        };

        collect();
        reset();
        intervalRef.current = window.setInterval(tick, 86);

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("pointerdown", handlePointerDown);
        window.addEventListener("pointerup", handlePointerUp);
        document.addEventListener("pointerleave", handlePointerLeave);
        window.addEventListener("scroll", handleViewportChange, { passive: true });
        window.addEventListener("resize", handleViewportChange);

        return () => {
            if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
            if (frame) window.cancelAnimationFrame(frame);
            swingControlsRef.current?.stop();
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("pointerup", handlePointerUp);
            document.removeEventListener("pointerleave", handlePointerLeave);
            window.removeEventListener("scroll", handleViewportChange);
            window.removeEventListener("resize", handleViewportChange);
        };
    }, [anchorX, anchorY, bugX, bugY, canUseCursor, spiderTargetX, spiderTargetY, swingLift]);

    if (!canUseCursor) return null;

    const threadColor = isDark ? "rgba(216, 255, 249, 0.58)" : "rgba(44, 83, 76, 0.42)";

    return (
        <div className="pointer-events-none fixed inset-0 z-[10000]" aria-hidden="true">
            <svg className="absolute inset-0 h-full w-full overflow-visible">
                <motion.line
                    data-testid="spider-thread"
                    x1={anchorX}
                    y1={anchorY}
                    x2={spiderX}
                    y2={renderedSpiderY}
                    stroke={threadColor}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeDasharray={mode === "shoot" ? "4 6" : undefined}
                    initial={false}
                    animate={{ opacity: mode === "idle" || mode === "crawl" ? 0 : 1 }}
                    transition={{ duration: 0.14 }}
                />
            </svg>
            <motion.div
                className="absolute z-0 h-2 w-2 rounded-full border border-white/70 bg-[#6fa79b]/70 shadow-[0_0_10px_rgba(111,167,155,0.35)]"
                style={{
                    x: anchorX,
                    y: anchorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    willChange: "transform, opacity",
                }}
                animate={{ opacity: mode === "idle" || mode === "crawl" ? 0 : 0.72, scale: mode === "shoot" ? [0.6, 1.16, 0.9] : 0.9 }}
                transition={{ duration: 0.22 }}
            />

            <motion.div
                data-testid="bug-cursor"
                className="absolute z-20 h-8 w-10 drop-shadow-[0_8px_10px_rgba(15,23,27,0.18)]"
                style={{
                    x: bugX,
                    y: bugY,
                    translateX: "-50%",
                    translateY: "-50%",
                    willChange: "transform",
                }}
                animate={{
                    opacity: hasPointer ? 1 : 0,
                    rotate: isClicking ? -12 : [0, 5, -4, 0],
                    scale: isClicking ? 0.86 : 1,
                }}
                transition={{ rotate: { duration: 0.52, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 0.1 } }}
            >
                <BugCursor isDark={isDark} />
            </motion.div>

            <motion.div
                data-testid="spider-chaser"
                data-spider-state={mode}
                className="absolute z-10 h-[58px] w-[78px]"
                style={{
                    x: spiderX,
                    y: renderedSpiderY,
                    rotate: spiderTilt,
                    scaleX: facing,
                    translateX: "-50%",
                    translateY: "-70%",
                    transformOrigin: "50% 50%",
                    willChange: "transform",
                }}
                initial={{ opacity: 0, scale: 0.66 }}
                animate={{
                    opacity: 1,
                    scale: mode === "strike" ? 0.84 : mode === "swing" || mode === "shoot" ? 0.78 : 0.74,
                }}
                transition={{ scale: { type: "spring", stiffness: 320, damping: 22 }, opacity: { duration: 0.16 } }}
            >
                <motion.div
                    className="absolute left-1/2 top-[78%] h-4 w-14 -translate-x-1/2 rounded-full bg-black/18 blur-md"
                    animate={{
                        opacity: mode === "swing" || mode === "shoot" ? 0.25 : 0.56,
                        scaleX: mode === "crawl" ? [0.8, 1.1, 0.8] : 0.92,
                    }}
                    transition={{ duration: 0.34, repeat: mode === "crawl" ? Infinity : 0 }}
                />
                <SpiderIcon isDark={isDark} mode={mode} />
            </motion.div>
        </div>
    );
}
