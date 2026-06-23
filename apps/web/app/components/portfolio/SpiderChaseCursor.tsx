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
type ThreadPhase = "hidden" | "aiming" | "firing" | "attached";

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
const THREAD_REAIM_DISTANCE = 220;
const THREAD_RELEASE_DISTANCE = 360;
const THREAD_SHOT_DELAY_MS = 126;
const THREAD_ATTACH_MS = 190;
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

function isPortfolioModalOpen() {
    return document.body.classList.contains("portfolio-modal-open") || Boolean(document.querySelector('[role="dialog"][aria-modal="true"]'));
}

function getSuspensionAnchorY(pointerY: number, spiderY: number, floorY: number) {
    return clamp(Math.min(pointerY, spiderY) - 170, 8, floorY - 180);
}

function planOverheadSwing(pointerX: number, pointerY: number, spiderY: number, width: number, floorY: number): ChasePlan {
    const anchorY = getSuspensionAnchorY(pointerY, spiderY, floorY);

    return {
        anchorX: clamp(pointerX, 36, width - 36),
        anchorY,
        desiredX: clamp(pointerX - 22, 56, width - 56),
        desiredY: clamp(pointerY + 68, anchorY + 86, floorY),
        mode: "shoot",
        webVisible: true,
        step: 68,
    };
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

    if (distanceToBug < 130) {
        const anchorY = clamp(Math.min(pointerY, spiderY) - 92, 10, floorY - 120);

        return {
            anchorX: clamp(pointerX, 36, width - 36),
            anchorY,
            desiredX: clamp(pointerX - 18, 48, width - 48),
            desiredY: clamp(pointerY + 24, anchorY + 70, floorY),
            mode: "strike",
            webVisible: true,
            step: 78,
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
        return planOverheadSwing(pointerX, pointerY, spiderY, width, floorY);
    }

    const surfaceAnchorY = surface.top - 6;
    const needsSuspensionAnchor = pointerY < surface.top - 42 || surfaceAnchorY > Math.min(pointerY, spiderY) - 24;

    if (needsSuspensionAnchor) {
        return planOverheadSwing(pointerX, pointerY, spiderY, width, floorY);
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
        anchorY: surfaceAnchorY,
        desiredX: clamp(pointerX - 28, 56, width - 56),
        desiredY: clamp(pointerY + 72, surfaceAnchorY + 92, floorY),
        mode: "swing",
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
    const suffix = isDark ? "dark" : "light";
    const fur = isDark ? "#5f6f68" : "#6e877d";
    const furDeep = isDark ? "#24302d" : "#31463f";
    const furLight = isDark ? "#b7d8cb" : "#b6ddd1";
    const outline = isDark ? "#effff9" : "#23473f";
    const leg = isDark ? "#465a53" : "#49665d";
    const legJoint = isDark ? "#a7d2c3" : "#81aaa0";
    const bristle = isDark ? "rgba(235,255,248,0.74)" : "rgba(35,65,58,0.38)";
    const eye = isDark ? "#f5fbff" : "#eef9ff";
    const eyeDeep = "#050707";
    const blush = isDark ? "#e2a68a" : "#c47c64";
    const isSwinging = mode === "swing" || mode === "shoot";
    const isCrawling = mode === "crawl" || mode === "climb";
    const isStriking = mode === "strike";
    const cycle = isCrawling ? 0.5 : isSwinging ? 0.92 : 1.36;

    const legA = isStriking ? [-20, -5, -20] : isCrawling ? [-7, 9, -7] : isSwinging ? [-2, 2, -2] : [-1, 1, -1];
    const legB = isStriking ? [18, 2, 18] : isCrawling ? [9, -7, 9] : isSwinging ? [2, -2, 2] : [1, -1, 1];
    const bodyBob = isStriking ? [0, -7, 1, 0] : isSwinging ? [0, 4, -3, 0] : isCrawling ? [0, -1.2, 0] : [0, -0.7, 0];
    const sides: Array<-1 | 1> = [-1, 1];
    const legRows = [
        { y: 48, reach: 36, sweep: -18 },
        { y: 60, reach: 43, sweep: -4 },
        { y: 72, reach: 43, sweep: 11 },
        { y: 83, reach: 36, sweep: 23 },
    ];

    const legPath = (side: -1 | 1, y: number, reach: number, sweep: number) => {
        const startX = side === -1 ? 58 : 98;
        const kneeX = startX + side * reach * 0.42;
        const endX = startX + side * reach;
        return `M${startX} ${y} C${kneeX} ${y + sweep * 0.28}, ${kneeX} ${y + sweep}, ${endX} ${y + sweep * 0.78}`;
    };

    return (
        <svg viewBox="0 0 156 128" aria-hidden="true" className="h-full w-full drop-shadow-[0_13px_18px_rgba(15,23,27,0.36)]">
            <defs>
                <radialGradient id={`spider-abdomen-${suffix}`} cx="46%" cy="30%" r="70%">
                    <stop offset="0%" stopColor={furLight} />
                    <stop offset="54%" stopColor={fur} />
                    <stop offset="100%" stopColor={furDeep} />
                </radialGradient>
                <radialGradient id={`spider-thorax-${suffix}`} cx="48%" cy="32%" r="74%">
                    <stop offset="0%" stopColor={isDark ? "#b29176" : "#8d6b56"} />
                    <stop offset="62%" stopColor={fur} />
                    <stop offset="100%" stopColor={furDeep} />
                </radialGradient>
                <radialGradient id={`spider-eye-${suffix}`} cx="34%" cy="28%" r="68%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="28%" stopColor={eye} />
                    <stop offset="35%" stopColor={eyeDeep} />
                    <stop offset="100%" stopColor="#010303" />
                </radialGradient>
            </defs>
            <motion.g
                animate={{ y: bodyBob, rotate: isSwinging ? [-4, 5, -3] : 0 }}
                transition={{ duration: cycle, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "78px 68px" }}
            >
                <motion.g
                    animate={{ scaleX: isStriking ? [1, 0.88, 1.06, 1] : 1, scaleY: isStriking ? [1, 1.1, 0.95, 1] : 1 }}
                    transition={{ duration: 0.34, repeat: isStriking ? Infinity : 0, repeatDelay: 0.34, ease: "easeInOut" }}
                    style={{ transformOrigin: "78px 68px" }}
                >
                {sides.map((side) => (
                    <g key={side}>
                        {legRows.map((row, index) => (
                            <g key={`${side}-${row.y}`}>
                                <motion.path
                                    d={legPath(side, row.y, row.reach, row.sweep)}
                                    fill="none"
                                    stroke={leg}
                                    strokeLinecap="round"
                                    strokeWidth="7"
                                    animate={{ rotate: index % 2 === 0 ? legA : legB }}
                                    transition={{ duration: cycle, repeat: Infinity, ease: "easeInOut", delay: index * 0.028 }}
                                    style={{ transformOrigin: `${side === -1 ? 60 : 96}px ${row.y}px` }}
                                />
                                <motion.path
                                    d={legPath(side, row.y, row.reach, row.sweep)}
                                    fill="none"
                                    stroke={bristle}
                                    strokeLinecap="round"
                                    strokeWidth="1.2"
                                    strokeDasharray="1 6"
                                    animate={{ rotate: index % 2 === 0 ? legA : legB }}
                                    transition={{ duration: cycle, repeat: Infinity, ease: "easeInOut", delay: index * 0.028 }}
                                    style={{ transformOrigin: `${side === -1 ? 60 : 96}px ${row.y}px` }}
                                />
                                <circle cx={(side === -1 ? 60 : 96) + side * row.reach * 0.38} cy={row.y + row.sweep * 0.43} r="3.4" fill={legJoint} opacity="0.88" />
                            </g>
                        ))}
                    </g>
                ))}

                <ellipse cx="78" cy="77" rx="30" ry="27" fill={`url(#spider-abdomen-${suffix})`} stroke={outline} strokeWidth="3.1" />
                <ellipse cx="78" cy="58" rx="28" ry="25" fill={`url(#spider-thorax-${suffix})`} stroke={outline} strokeWidth="3.1" />
                <path d="M57 72c12 7 30 8 42 0M60 84c10 5 25 5 36 0" stroke={furLight} strokeLinecap="round" strokeWidth="2.2" opacity="0.62" />
                <path d="M59 52c11-7 27-8 39-1" stroke={isDark ? "rgba(255,247,229,0.46)" : "rgba(255,255,255,0.26)"} strokeLinecap="round" strokeWidth="4.5" opacity="0.85" />
                <circle cx="65" cy="54" r="11" fill={`url(#spider-eye-${suffix})`} stroke={outline} strokeWidth="1.8" />
                <circle cx="91" cy="54" r="11" fill={`url(#spider-eye-${suffix})`} stroke={outline} strokeWidth="1.8" />
                <circle cx="73" cy="47" r="5.1" fill={`url(#spider-eye-${suffix})`} stroke={outline} strokeWidth="1.25" opacity="0.88" />
                <circle cx="83" cy="47" r="5.1" fill={`url(#spider-eye-${suffix})`} stroke={outline} strokeWidth="1.25" opacity="0.88" />
                <circle cx="61" cy="49" r="3" fill="#fff" opacity="0.95" />
                <circle cx="87" cy="49" r="3" fill="#fff" opacity="0.95" />
                <circle cx="61" cy="66" r="4.5" fill={blush} opacity="0.58" />
                <circle cx="95" cy="66" r="4.5" fill={blush} opacity="0.58" />
                <path d="M71 67c4.8 3.3 9.2 3.3 14 0" stroke={isDark ? "#f6dbc6" : "#dcb59d"} strokeLinecap="round" strokeWidth="2.4" opacity="0.92" />
                </motion.g>
            </motion.g>
        </svg>
    );
}

export default function SpiderChaseCursor({ isDark }: SpiderChaseCursorProps) {
    const [canUseCursor, setCanUseCursor] = useState(false);
    const [hasPointer, setHasPointer] = useState(false);
    const [mode, setMode] = useState<SpiderMode>("idle");
    const [threadPhase, setThreadPhase] = useState<ThreadPhase>("hidden");
    const [threadShotId, setThreadShotId] = useState(0);
    const [capturePulse, setCapturePulse] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isSuppressed, setIsSuppressed] = useState(false);
    const [facing, setFacing] = useState<1 | -1>(1);
    const surfacesRef = useRef<SurfaceRect[]>([]);
    const pointerRef = useRef({ x: 0, y: 0 });
    const targetRef = useRef({ x: 96, y: 96 });
    const hasPointerRef = useRef(false);
    const isSuppressedRef = useRef(false);
    const threadPhaseRef = useRef<ThreadPhase>("hidden");
    const threadDelayRef = useRef<number | null>(null);
    const threadAttachRef = useRef<number | null>(null);
    const captureTimeoutRef = useRef<number | null>(null);
    const lastCaptureAtRef = useRef(0);
    const lockedThreadRef = useRef<{ anchorX: number; anchorY: number; targetX: number; targetY: number; mode: SpiderMode } | null>(null);
    const lastThreadTargetRef = useRef({ x: 96, y: 0, mode: "idle" as SpiderMode });
    const lastThreadShotAtRef = useRef(0);
    const intervalRef = useRef<number | null>(null);
    const swingControlsRef = useRef<{ stop: () => void } | null>(null);
    const driftControlsRef = useRef<{ stop: () => void } | null>(null);
    const threadProjectileControlsRef = useRef<{ stop: () => void } | null>(null);
    const routeXControlsRef = useRef<{ stop: () => void } | null>(null);
    const routeYControlsRef = useRef<{ stop: () => void } | null>(null);
    const lastRouteRef = useRef({ x: 96, y: 96, mode: "idle" as SpiderMode, startedAt: 0 });

    const bugX = useMotionValue(0);
    const bugY = useMotionValue(0);
    const spiderTargetX = useMotionValue(96);
    const spiderTargetY = useMotionValue(96);
    const anchorX = useMotionValue(96);
    const anchorY = useMotionValue(0);
    const swingLift = useMotionValue(0);
    const swingDrift = useMotionValue(0);
    const threadProgress = useMotionValue(0);

    const spring: SpringOptions = { damping: 20, stiffness: 168, mass: 0.72 };
    const spiderX = useSpring(spiderTargetX, spring);
    const spiderY = useSpring(spiderTargetY, spring);
    const renderedSpiderX = useTransform(() => spiderX.get() + swingDrift.get());
    const renderedSpiderY = useTransform(() => spiderY.get() + swingLift.get());
    const threadProjectileX = useTransform(() => renderedSpiderX.get() + (anchorX.get() - renderedSpiderX.get()) * threadProgress.get());
    const threadProjectileY = useTransform(() => renderedSpiderY.get() + (anchorY.get() - renderedSpiderY.get()) * threadProgress.get());
    const threadAngle = useTransform(() => `${Math.atan2(anchorY.get() - renderedSpiderY.get(), anchorX.get() - renderedSpiderX.get())}rad`);
    const threadPath = useTransform(() => {
        const sx = renderedSpiderX.get();
        const sy = renderedSpiderY.get();
        const ax = anchorX.get();
        const ay = anchorY.get();
        return `M ${sx} ${sy} L ${ax} ${ay}`;
    });
    const spiderVelocityX = useVelocity(spiderX);
    const spiderTilt = useTransform(spiderVelocityX, [-1000, 0, 1000], [-13, 0, 13], { clamp: true });

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
        const stopRoute = () => {
            routeXControlsRef.current?.stop();
            routeYControlsRef.current?.stop();
            routeXControlsRef.current = null;
            routeYControlsRef.current = null;
        };
        const reset = () => {
            const x = clamp(window.innerWidth * 0.16, 80, window.innerWidth - 80);
            const y = getFloorY();
            stopRoute();
            targetRef.current = { x, y };
            spiderTargetX.set(x);
            spiderTargetY.set(y);
            anchorX.set(x);
            anchorY.set(0);
            threadProgress.set(0);
            setCapturePulse(false);
            setMode("idle");
            setThreadPhase("hidden");
            threadPhaseRef.current = "hidden";
            lastThreadTargetRef.current = { x, y: 0, mode: "idle" };
            lockedThreadRef.current = null;
            lastRouteRef.current = { x, y, mode: "idle", startedAt: performance.now() };
            if (threadDelayRef.current !== null) {
                window.clearTimeout(threadDelayRef.current);
                threadDelayRef.current = null;
            }
            if (threadAttachRef.current !== null) {
                window.clearTimeout(threadAttachRef.current);
                threadAttachRef.current = null;
            }
            if (captureTimeoutRef.current !== null) {
                window.clearTimeout(captureTimeoutRef.current);
                captureTimeoutRef.current = null;
            }
        };
        const setThread = (phase: ThreadPhase) => {
            threadPhaseRef.current = phase;
            setThreadPhase((current) => (current === phase ? current : phase));
        };
        const clearThreadDelay = () => {
            if (threadDelayRef.current !== null) {
                window.clearTimeout(threadDelayRef.current);
                threadDelayRef.current = null;
            }
            if (threadAttachRef.current !== null) {
                window.clearTimeout(threadAttachRef.current);
                threadAttachRef.current = null;
            }
        };
        const syncSuppression = () => {
            const nextSuppressed = isPortfolioModalOpen();
            if (isSuppressedRef.current === nextSuppressed) return nextSuppressed;

            isSuppressedRef.current = nextSuppressed;
            setIsSuppressed(nextSuppressed);
            if (nextSuppressed) reset();

            return nextSuppressed;
        };
        const scheduleThreadShot = (plan: ChasePlan) => {
            const previous = lastThreadTargetRef.current;
            const anchorShift = Math.hypot(plan.anchorX - previous.x, plan.anchorY - previous.y);
            const targetShift = Math.hypot(plan.desiredX - (lockedThreadRef.current?.targetX ?? previous.x), plan.desiredY - (lockedThreadRef.current?.targetY ?? previous.y));
            const modeChanged = plan.mode !== previous.mode;
            const now = performance.now();
            const phase = threadPhaseRef.current;
            const locked = lockedThreadRef.current;

            if (locked && (phase === "aiming" || phase === "firing" || phase === "attached")) {
                const lockedAnchorIsBelowMotion = locked.anchorY > Math.min(plan.desiredY, pointerRef.current.y, spiderY.get()) - 24;
                const newPlanHasHigherAnchor = plan.anchorY < locked.anchorY - 96 && anchorShift > THREAD_REAIM_DISTANCE;

                if (
                    lockedAnchorIsBelowMotion ||
                    newPlanHasHigherAnchor ||
                    (targetShift > THREAD_RELEASE_DISTANCE && now - lastThreadShotAtRef.current > 520)
                ) {
                    clearThreadDelay();
                    lockedThreadRef.current = null;
                    setThread("hidden");
                    lastThreadTargetRef.current = { x: plan.anchorX, y: plan.anchorY, mode: plan.mode };
                    return;
                }

                locked.targetX = plan.desiredX;
                locked.targetY = plan.desiredY;
                locked.mode = plan.mode;
                return;
            }

            const slowReaim = phase === "attached" && anchorShift > THREAD_REAIM_DISTANCE && now - lastThreadShotAtRef.current > 980;
            const shouldReaim =
                phase === "hidden" ||
                modeChanged ||
                anchorShift > THREAD_REAIM_DISTANCE ||
                slowReaim;

            if (!shouldReaim) return;

            lastThreadTargetRef.current = { x: plan.anchorX, y: plan.anchorY, mode: plan.mode };
            lockedThreadRef.current = {
                anchorX: plan.anchorX,
                anchorY: plan.anchorY,
                targetX: plan.desiredX,
                targetY: plan.desiredY,
                mode: plan.mode,
            };
            clearThreadDelay();
            setThread("aiming");
            threadProgress.set(0);

            const delay = plan.mode === "strike" ? 64 : THREAD_SHOT_DELAY_MS;
            threadDelayRef.current = window.setTimeout(() => {
                threadDelayRef.current = null;
                lastThreadShotAtRef.current = performance.now();
                setThread("firing");
                setThreadShotId((value) => value + 1);
                threadProjectileControlsRef.current?.stop();
                threadProgress.set(0);
                threadProjectileControlsRef.current = animate(threadProgress, 1, {
                    duration: plan.mode === "strike" ? 0.18 : 0.3,
                    ease: [0.05, 0.82, 0.2, 1],
                });
                threadAttachRef.current = window.setTimeout(() => {
                    threadAttachRef.current = null;
                    setThread("attached");
                }, THREAD_ATTACH_MS);
            }, delay);
        };
        const launchSwingRoute = (plan: ChasePlan, startX: number, startY: number) => {
            const previousRoute = lastRouteRef.current;
            const routeShift = Math.hypot(plan.desiredX - previousRoute.x, plan.desiredY - previousRoute.y);
            const now = performance.now();

            if (routeShift < 46 && previousRoute.mode === plan.mode && now - previousRoute.startedAt < 520) {
                return false;
            }

            stopRoute();

            const dx = plan.desiredX - startX;
            const dy = plan.desiredY - startY;
            const distance = Math.hypot(dx, dy);
            const duration = clamp(distance / 720, 0.48, 0.96);
            const midX = startX + dx * 0.52 + clamp((plan.anchorX - startX) * 0.16, -34, 34);
            const overshootX = plan.desiredX + clamp(dx * 0.12, -38, 38);
            const ropeY = clamp(plan.anchorY + clamp(distance * 0.3, 88, 230), 74, getFloorY() - 36);
            const sagY = plan.desiredY + clamp(distance * 0.07, 12, 38);

            targetRef.current = { x: plan.desiredX, y: plan.desiredY };
            lastRouteRef.current = { x: plan.desiredX, y: plan.desiredY, mode: plan.mode, startedAt: now };
            routeXControlsRef.current = animate(spiderTargetX, [startX, midX, overshootX, plan.desiredX], {
                duration,
                ease: [0.17, 0.78, 0.18, 1],
            });
            routeYControlsRef.current = animate(spiderTargetY, [startY, ropeY, sagY, plan.desiredY], {
                duration,
                ease: [0.18, 0.74, 0.16, 1],
            });

            return true;
        };
        const pulseSwing = (nextMode: SpiderMode, distance: number, anchorDelta: number) => {
            if (nextMode !== "swing" && nextMode !== "shoot" && nextMode !== "strike") return;
            swingControlsRef.current?.stop();
            driftControlsRef.current?.stop();
            const lift = nextMode === "strike" ? -9 : -clamp(distance * 0.15, 18, 48);
            const drop = nextMode === "strike" ? 9 : clamp(distance * 0.1, 10, 28);
            const sway = clamp(anchorDelta * 0.22, -42, 42);
            swingControlsRef.current = animate(swingLift, [0, lift, drop, -4, 0], {
                duration: nextMode === "strike" ? 0.42 : 0.76,
                ease: [0.18, 0.74, 0.16, 1],
            });
            driftControlsRef.current = animate(swingDrift, [0, -sway * 0.42, sway, sway * 0.24, 0], {
                duration: nextMode === "strike" ? 0.42 : 0.76,
                ease: [0.2, 0.8, 0.2, 1],
            });
        };
        const triggerCapture = () => {
            const now = performance.now();
            if (now - lastCaptureAtRef.current < 760) return;
            lastCaptureAtRef.current = now;
            setCapturePulse(true);
            if (captureTimeoutRef.current !== null) window.clearTimeout(captureTimeoutRef.current);
            captureTimeoutRef.current = window.setTimeout(() => {
                captureTimeoutRef.current = null;
                setCapturePulse(false);
            }, 760);
        };
        const tick = () => {
            if (syncSuppression()) return;

            const actualX = spiderX.get();
            const actualY = spiderY.get();
            const pointer = pointerRef.current;
            const plan = planSpiderStep(
                pointer.x,
                pointer.y,
                actualX,
                actualY,
                surfacesRef.current,
                hasPointerRef.current,
            );
            const needsThread = plan.webVisible && plan.mode !== "idle" && plan.mode !== "crawl";
            if (needsThread) {
                scheduleThreadShot(plan);
            } else {
                clearThreadDelay();
                setThread("hidden");
                lockedThreadRef.current = null;
            }

            const lockedThread = lockedThreadRef.current;
            const effectivePlan = lockedThread
                ? {
                    ...plan,
                    anchorX: lockedThread.anchorX,
                    anchorY: lockedThread.anchorY,
                    desiredX: lockedThread.targetX,
                    desiredY: lockedThread.targetY,
                    mode: lockedThread.mode,
                }
                : plan;

            const threadReady = !needsThread || threadPhaseRef.current === "attached";
            const threadFiring = threadPhaseRef.current === "firing";
            anchorX.set(effectivePlan.anchorX);
            anchorY.set(effectivePlan.anchorY);

            if (needsThread && threadReady) {
                const startedRoute = launchSwingRoute(effectivePlan, actualX, actualY);
                const distance = Math.hypot(effectivePlan.desiredX - actualX, effectivePlan.desiredY - actualY);
                if (startedRoute && distance > 8) pulseSwing(effectivePlan.mode, distance, effectivePlan.anchorX - actualX);
                if (effectivePlan.mode === "strike" && distance < 180) triggerCapture();
            } else {
                stopRoute();
                const step = threadFiring ? Math.min(effectivePlan.step, 18) : Math.min(effectivePlan.step, effectivePlan.mode === "strike" ? 12 : effectivePlan.step);
                const nextX = stepToward(actualX, effectivePlan.desiredX, step);
                const nextY = stepToward(actualY, effectivePlan.desiredY, step);
                targetRef.current = { x: nextX, y: nextY };
                lastRouteRef.current = { x: nextX, y: nextY, mode: effectivePlan.mode, startedAt: performance.now() };
                spiderTargetX.set(nextX);
                spiderTargetY.set(nextY);
            }

            const nextMode = threadReady ? effectivePlan.mode : "shoot";
            setMode((current) => (current === nextMode ? current : nextMode));

            const facingDelta = (needsThread && threadReady ? effectivePlan.desiredX : targetRef.current.x) - actualX;
            if (Math.abs(facingDelta) > 2) {
                const nextFacing = facingDelta >= 0 ? 1 : -1;
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
        syncSuppression();
        const modalObserver = new MutationObserver(syncSuppression);
        modalObserver.observe(document.body, { attributes: true, attributeFilter: ["class"], childList: true, subtree: false });
        intervalRef.current = window.setInterval(tick, 52);

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("pointerdown", handlePointerDown);
        window.addEventListener("pointerup", handlePointerUp);
        document.addEventListener("pointerleave", handlePointerLeave);
        window.addEventListener("scroll", handleViewportChange, { passive: true });
        window.addEventListener("resize", handleViewportChange);

        return () => {
            if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
            if (frame) window.cancelAnimationFrame(frame);
            clearThreadDelay();
            swingControlsRef.current?.stop();
            driftControlsRef.current?.stop();
            threadProjectileControlsRef.current?.stop();
            stopRoute();
            modalObserver.disconnect();
            if (captureTimeoutRef.current !== null) window.clearTimeout(captureTimeoutRef.current);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("pointerup", handlePointerUp);
            document.removeEventListener("pointerleave", handlePointerLeave);
            window.removeEventListener("scroll", handleViewportChange);
            window.removeEventListener("resize", handleViewportChange);
        };
    }, [anchorX, anchorY, bugX, bugY, canUseCursor, spiderTargetX, spiderTargetY, spiderX, spiderY, swingDrift, swingLift, threadProgress]);

    if (!canUseCursor || isSuppressed) return null;

    const threadColor = isDark ? "rgba(238, 255, 252, 0.58)" : "rgba(29, 55, 50, 0.38)";
    const threadGlow = isDark ? "rgba(202, 255, 248, 0.13)" : "rgba(64, 105, 96, 0.09)";

    return (
        <div className="pointer-events-none fixed inset-0 z-[10000]" aria-hidden="true" data-portfolio-spider-cursor="" data-thread-phase={threadPhase}>
            <svg className="absolute inset-0 h-full w-full overflow-visible">
                <motion.path
                    key={threadShotId}
                    data-testid="spider-thread"
                    d={threadPath}
                    fill="none"
                    stroke={threadGlow}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: threadPhase === "firing" || threadPhase === "attached" ? 1 : 0,
                        opacity: threadPhase === "firing" || threadPhase === "attached" ? 1 : 0,
                    }}
                    transition={{
                        pathLength: { duration: 0.2, ease: [0.06, 0.76, 0.18, 1] },
                        opacity: { duration: threadPhase === "firing" || threadPhase === "attached" ? 0.08 : 0.12 },
                    }}
                />
                <motion.path
                    key={`thread-core-${threadShotId}`}
                    data-testid="spider-thread-core"
                    d={threadPath}
                    fill="none"
                    stroke={threadColor}
                    strokeWidth="0.95"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: threadPhase === "firing" || threadPhase === "attached" ? 1 : 0,
                        opacity: threadPhase === "firing" || threadPhase === "attached" ? 1 : 0,
                    }}
                    transition={{
                        pathLength: { duration: 0.16, ease: [0.06, 0.76, 0.18, 1] },
                        opacity: { duration: threadPhase === "firing" || threadPhase === "attached" ? 0.08 : 0.12 },
                    }}
                />
                <motion.path
                    key={`thread-fiber-${threadShotId}`}
                    data-testid="spider-thread-fiber"
                    d={threadPath}
                    fill="none"
                    stroke={isDark ? "rgba(255,255,255,0.54)" : "rgba(255,255,255,0.48)"}
                    strokeWidth="0.38"
                    strokeLinecap="round"
                    strokeDasharray="1 12"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: threadPhase === "firing" || threadPhase === "attached" ? 1 : 0,
                        opacity: threadPhase === "firing" ? 0.82 : threadPhase === "attached" ? 0.45 : 0,
                    }}
                    transition={{
                        pathLength: { duration: 0.18, ease: [0.06, 0.76, 0.18, 1] },
                        opacity: { duration: 0.12 },
                    }}
                />
            </svg>
            <motion.div
                className={`absolute z-0 h-1.5 w-1.5 rounded-full border shadow-[0_0_8px_rgba(111,167,155,0.26)] ${isDark ? "border-white/60 bg-[#eafffb]/70" : "border-[#284b44]/20 bg-[#315f56]/55"}`}
                style={{
                    x: anchorX,
                    y: anchorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    willChange: "transform, opacity",
                }}
                animate={{
                    opacity: threadPhase === "hidden" ? 0 : threadPhase === "aiming" ? 0.24 : 0.58,
                    scale: threadPhase === "aiming" ? [0.42, 1.08, 0.7] : threadPhase === "firing" ? [0.7, 1.12, 0.82] : threadPhase === "attached" ? 0.78 : 0.4,
                }}
                transition={{ duration: 0.18 }}
            />
            <motion.div
                data-testid="spider-capture-pulse"
                className={`absolute z-[25] h-[74px] w-[74px] rounded-full border ${isDark ? "border-[#effffb]/88 bg-[#effffb]/7" : "border-[#244842]/58 bg-[#244842]/7"}`}
                style={{
                    x: bugX,
                    y: bugY,
                    translateX: "-50%",
                    translateY: "-50%",
                    willChange: "transform, opacity",
                }}
                animate={{
                    opacity: capturePulse ? [0, 0.95, 0.72, 0.34, 0] : 0,
                    scale: capturePulse ? [0.28, 0.8, 1.05, 1.18] : 0.35,
                    rotate: capturePulse ? [0, 30, -20, 0] : 0,
                }}
                transition={{ duration: 0.72, ease: [0.2, 0.8, 0.2, 1] }}
            >
                <span className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 ${isDark ? "bg-[#effffb]/45" : "bg-[#244842]/25"}`} />
                <span className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 rotate-60 ${isDark ? "bg-[#effffb]/35" : "bg-[#244842]/18"}`} />
                <span className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 -rotate-60 ${isDark ? "bg-[#effffb]/35" : "bg-[#244842]/18"}`} />
                <span className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 rotate-[30deg] ${isDark ? "bg-[#effffb]/28" : "bg-[#244842]/14"}`} />
                <span className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 -rotate-[30deg] ${isDark ? "bg-[#effffb]/28" : "bg-[#244842]/14"}`} />
            </motion.div>
            <motion.div
                data-testid="spider-thread-dart"
                className={`absolute z-[9] h-[3px] w-5 rounded-full shadow-[0_0_12px_rgba(232,255,249,0.8)] ${isDark ? "bg-[#f5fffd]" : "bg-[#1f433d]"}`}
                style={{
                    x: threadProjectileX,
                    y: threadProjectileY,
                    rotate: threadAngle,
                    translateX: "-50%",
                    translateY: "-50%",
                    willChange: "transform, opacity",
                }}
                animate={{
                    opacity: threadPhase === "firing" ? [0, 1, 1, 0] : 0,
                    scale: threadPhase === "firing" ? [0.6, 1.35, 1.05, 0.78] : 0.5,
                }}
                transition={{ duration: 0.3, ease: [0.05, 0.82, 0.2, 1] }}
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
                    rotate: capturePulse ? [0, 18, -28, 10] : isClicking ? -12 : [0, 5, -4, 0],
                    scale: capturePulse ? [1, 0.62, 0.82, 1] : isClicking ? 0.86 : 1,
                }}
                transition={{ rotate: { duration: 0.52, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 0.1 } }}
            >
                <BugCursor isDark={isDark} />
            </motion.div>

            <motion.div
                data-testid="spider-chaser"
                data-spider-state={mode}
                className="absolute z-10 h-[82px] w-[102px]"
                style={{
                    x: renderedSpiderX,
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
                    scale: mode === "strike" ? 0.95 : mode === "swing" || mode === "shoot" ? 0.9 : 0.86,
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
