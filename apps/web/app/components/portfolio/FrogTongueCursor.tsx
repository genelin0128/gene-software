"use client";

import { useEffect, useRef, useState } from "react";
import {
    animate,
    motion,
    useMotionValue,
    useTransform,
} from "motion/react";

interface FrogTongueCursorProps {
    isDark: boolean;
}

type FrogPhase = "idle" | "aim" | "hop" | "shoot" | "catch" | "miss" | "swallow";
type FlyPhase = "free" | "caught" | "respawn";
type FrogDirection = -1 | 1;

type Point = {
    x: number;
    y: number;
};

const HOVER_FINE_POINTER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";
const TONGUE_COOLDOWN_MS = 1320;
const TONGUE_AIM_MS = 170;
const FROG_HOP_MS = 520;
const FROG_LAND_MS = 110;
const TONGUE_SHOOT_MS = 180;
const TONGUE_RETRACT_MS = 210;
const TONGUE_CATCH_MS = 260;
const FLY_RESPAWN_MS = 90;
const TONGUE_HIT_RADIUS = 38;
const FROG_MOUTH_OFFSET_Y = 27;

const frogSprites = {
    idle: "/cursors/frog-idle.png",
    blink: "/cursors/frog-blink.png",
    open: "/cursors/frog-open.png",
    hop: {
        ready: {
            left: "/cursors/frog-hop-ready-left.png",
            right: "/cursors/frog-hop-ready-right.png",
        },
        launch: {
            left: "/cursors/frog-hop-launch-left.png",
            right: "/cursors/frog-hop-launch-right.png",
        },
        air: {
            left: "/cursors/frog-hop-left.png",
            right: "/cursors/frog-hop-right.png",
        },
        land: {
            left: "/cursors/frog-hop-land-left.png",
            right: "/cursors/frog-hop-land-right.png",
        },
    },
} as const;
const frogImageClass = "absolute inset-0 h-full w-full select-none object-contain";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function getFrogFloorY() {
    return Math.max(120, window.innerHeight - 22);
}

function getInitialFrogX() {
    if (typeof window === "undefined") return 96;
    return clamp(window.innerWidth * 0.5, 70, window.innerWidth - 70);
}

function getTongueMaxReach() {
    return Math.max(760, Math.hypot(window.innerWidth, window.innerHeight) * 1.05);
}

function isPortfolioModalOpen() {
    return document.body.classList.contains("portfolio-modal-open") ||
        Boolean(document.querySelector('[role="dialog"][aria-modal="true"], .portfolio-modal'));
}

function limitTongueTarget(mouth: Point, target: Point) {
    const dx = target.x - mouth.x;
    const dy = target.y - mouth.y;
    const distance = Math.hypot(dx, dy);
    const maxReach = getTongueMaxReach();

    if (distance <= maxReach) {
        return { target, reachable: true };
    }

    const ratio = maxReach / distance;
    return {
        target: {
            x: mouth.x + dx * ratio,
            y: mouth.y + dy * ratio,
        },
        reachable: false,
    };
}

function getMouthPoint(frogX: number, frogY: number, frogHop: number): Point {
    return {
        x: frogX,
        y: frogY + frogHop - FROG_MOUTH_OFFSET_Y,
    };
}

function directedSprite(sprite: { left: string; right: string }, direction: FrogDirection) {
    return direction === -1 ? sprite.left : sprite.right;
}

function FlyIcon({ isDark }: { isDark: boolean }) {
    const body = isDark ? "#b8f3e8" : "#2f7f74";
    const wing = isDark ? "rgba(239,255,252,0.8)" : "rgba(216,246,239,0.82)";
    const line = isDark ? "#153936" : "#1b3f3b";

    return (
        <svg viewBox="0 0 46 38" aria-hidden="true" className="h-full w-full">
            <motion.ellipse
                cx="15"
                cy="15"
                rx="10"
                ry="6"
                fill={wing}
                stroke={line}
                strokeWidth="1.2"
                animate={{ rotate: [-25, 18, -25], scaleY: [0.68, 1.08, 0.68] }}
                transition={{ duration: 0.14, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "24px 19px" }}
            />
            <motion.ellipse
                cx="31"
                cy="15"
                rx="10"
                ry="6"
                fill={wing}
                stroke={line}
                strokeWidth="1.2"
                animate={{ rotate: [25, -18, 25], scaleY: [0.68, 1.08, 0.68] }}
                transition={{ duration: 0.14, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "22px 19px" }}
            />
            <ellipse cx="23" cy="21" rx="8" ry="10" fill={body} stroke={line} strokeWidth="2" />
            <path d="M19 19c3 2 5 2 8 0M18 25c3 2 7 2 10 0" stroke={line} strokeWidth="1.4" strokeLinecap="round" opacity="0.38" />
            <circle cx="19" cy="13" r="4.4" fill={body} stroke={line} strokeWidth="1.8" />
            <circle cx="27" cy="13" r="4.4" fill={body} stroke={line} strokeWidth="1.8" />
            <circle cx="18.5" cy="12.2" r="1.45" fill="#0f1718" />
            <circle cx="27.5" cy="12.2" r="1.45" fill="#0f1718" />
            <path d="M18 8 14 3M28 8l4-5M18 31l-5 4M28 31l5 4" stroke={line} strokeLinecap="round" strokeWidth="1.8" />
        </svg>
    );
}

function FrogSprite({ phase, direction }: { phase: FrogPhase; direction: FrogDirection }) {
    const mouthOpen = phase === "shoot" || phase === "catch" || phase === "swallow";
    const isHopping = phase === "hop";

    return (
        <div className="relative h-full w-full drop-shadow-[0_15px_22px_rgba(15,23,27,0.26)]">
            <motion.img
                src={frogSprites.idle}
                alt=""
                draggable="false"
                className={frogImageClass}
                animate={{ opacity: mouthOpen || isHopping ? 0 : 1 }}
                transition={{ duration: 0.08 }}
            />
            <motion.img
                src={frogSprites.blink}
                alt=""
                draggable="false"
                className={frogImageClass}
                animate={{ opacity: mouthOpen || isHopping ? 0 : [0, 0, 1, 1, 0, 0] }}
                transition={{ duration: 4.4, repeat: Infinity, times: [0, 0.8, 0.84, 0.88, 0.92, 1], ease: "easeInOut" }}
            />
            <motion.img
                src={directedSprite(frogSprites.hop.ready, direction)}
                alt=""
                draggable="false"
                className={frogImageClass}
                animate={{
                    opacity: isHopping ? [1, 1, 0, 0, 0, 0] : 0,
                    rotate: isHopping ? [-2, -1, 0, 0, 0, 0] : 0,
                }}
                transition={{
                    opacity: isHopping
                        ? { duration: FROG_HOP_MS / 1000, times: [0, 0.1, 0.18, 0.19, 0.82, 1], ease: "linear" }
                        : { duration: 0.08 },
                    rotate: { duration: FROG_HOP_MS / 1000, ease: [0.2, 0.86, 0.18, 1] },
                }}
            />
            <motion.img
                src={directedSprite(frogSprites.hop.launch, direction)}
                alt=""
                draggable="false"
                className={frogImageClass}
                animate={{
                    opacity: isHopping ? [0, 1, 1, 0, 0, 0] : 0,
                    rotate: isHopping ? [-4, -5, -4, -1, 0, 0] : 0,
                }}
                transition={{
                    opacity: isHopping
                        ? { duration: FROG_HOP_MS / 1000, times: [0, 0.12, 0.34, 0.44, 0.82, 1], ease: "linear" }
                        : { duration: 0.08 },
                    rotate: { duration: FROG_HOP_MS / 1000, ease: [0.2, 0.86, 0.18, 1] },
                }}
            />
            <motion.img
                src={directedSprite(frogSprites.hop.air, direction)}
                alt=""
                draggable="false"
                className={frogImageClass}
                animate={{
                    opacity: isHopping ? [0, 0, 1, 1, 0, 0] : 0,
                    rotate: isHopping ? [-6, -4, -2, 2, 5, 4] : 0,
                }}
                transition={{
                    opacity: isHopping
                        ? { duration: FROG_HOP_MS / 1000, times: [0, 0.3, 0.38, 0.68, 0.78, 1], ease: "linear" }
                        : { duration: 0.08 },
                    rotate: { duration: FROG_HOP_MS / 1000, ease: [0.2, 0.86, 0.18, 1] },
                }}
            />
            <motion.img
                src={directedSprite(frogSprites.hop.land, direction)}
                alt=""
                draggable="false"
                className={frogImageClass}
                animate={{
                    opacity: isHopping ? [0, 0, 0, 1, 1, 0] : 0,
                    rotate: isHopping ? [0, 0, 0, 3, 1, 0] : 0,
                }}
                transition={{
                    opacity: isHopping
                        ? { duration: FROG_HOP_MS / 1000, times: [0, 0.58, 0.68, 0.76, 0.94, 1], ease: "linear" }
                        : { duration: 0.08 },
                    rotate: { duration: FROG_HOP_MS / 1000, ease: [0.2, 0.86, 0.18, 1] },
                }}
            />
            <motion.img
                src={frogSprites.open}
                alt=""
                draggable="false"
                className={frogImageClass}
                animate={{ opacity: mouthOpen ? 1 : 0 }}
                transition={{ duration: mouthOpen ? 0.16 : 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            />
        </div>
    );
}

export default function FrogTongueCursor({ isDark }: FrogTongueCursorProps) {
    const [canUseCursor, setCanUseCursor] = useState(false);
    const [hasPointer, setHasPointer] = useState(false);
    const [isSuppressed, setIsSuppressed] = useState(false);
    const [frogPhase, setFrogPhase] = useState<FrogPhase>("idle");
    const [flyPhase, setFlyPhase] = useState<FlyPhase>("free");
    const [tongueShotId, setTongueShotId] = useState(0);
    const [facing, setFacing] = useState<FrogDirection>(1);

    const pointerRef = useRef<Point>({ x: 0, y: 0 });
    const lastPointerMoveAtRef = useRef(0);
    const hasPointerRef = useRef(false);
    const isSuppressedRef = useRef(false);
    const frogPhaseRef = useRef<FrogPhase>("idle");
    const flyPhaseRef = useRef<FlyPhase>("free");
    const lastTongueShotAtRef = useRef(0);
    const timeoutsRef = useRef<number[]>([]);
    const tongueControlsRef = useRef<Array<{ stop: () => void }>>([]);
    const hopControlsRef = useRef<{ stop: () => void } | null>(null);
    const frogMoveControlsRef = useRef<{ stop: () => void } | null>(null);
    const intervalRef = useRef<number | null>(null);

    const flyX = useMotionValue(0);
    const flyY = useMotionValue(0);
    const frogX = useMotionValue(getInitialFrogX());
    const frogY = useMotionValue(96);
    const frogHop = useMotionValue(0);
    const tongueEndX = useMotionValue(96);
    const tongueEndY = useMotionValue(96);

    const renderedFrogY = useTransform(() => frogY.get() + frogHop.get());
    const tonguePath = useTransform(() => {
        const mouth = getMouthPoint(frogX.get(), frogY.get(), frogHop.get());
        return `M ${mouth.x} ${mouth.y} L ${tongueEndX.get()} ${tongueEndY.get()}`;
    });
    const tongueAngle = useTransform(() => {
        const mouth = getMouthPoint(frogX.get(), frogY.get(), frogHop.get());
        return `${Math.atan2(tongueEndY.get() - mouth.y, tongueEndX.get() - mouth.x)}rad`;
    });

    useEffect(() => {
        const media = window.matchMedia(HOVER_FINE_POINTER_MEDIA_QUERY);
        const update = () => setCanUseCursor(media.matches);
        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        if (!canUseCursor) return;

        const setPhase = (phase: FrogPhase) => {
            frogPhaseRef.current = phase;
            setFrogPhase((current) => (current === phase ? current : phase));
        };

        const setFly = (phase: FlyPhase) => {
            flyPhaseRef.current = phase;
            setFlyPhase((current) => (current === phase ? current : phase));
        };

        const clearTimers = () => {
            for (let i = 0; i < timeoutsRef.current.length; i += 1) {
                window.clearTimeout(timeoutsRef.current[i]);
            }
            timeoutsRef.current = [];
        };

        const queue = (callback: () => void, delay: number) => {
            const id = window.setTimeout(() => {
                timeoutsRef.current = timeoutsRef.current.filter((timeoutId) => timeoutId !== id);
                callback();
            }, delay);
            timeoutsRef.current.push(id);
        };

        const stopTongue = () => {
            for (let i = 0; i < tongueControlsRef.current.length; i += 1) {
                tongueControlsRef.current[i]?.stop();
            }
            tongueControlsRef.current = [];
        };

        const resetTongueToMouth = () => {
            stopTongue();
            const mouth = getMouthPoint(frogX.get(), frogY.get(), frogHop.get());
            tongueEndX.set(mouth.x);
            tongueEndY.set(mouth.y);
        };

        const reset = () => {
            clearTimers();
            stopTongue();
            hopControlsRef.current?.stop();
            frogMoveControlsRef.current?.stop();
            const x = clamp(window.innerWidth * 0.5, 70, window.innerWidth - 70);
            const y = getFrogFloorY();
            frogX.set(x);
            frogY.set(y);
            tongueEndX.set(x);
            tongueEndY.set(y - FROG_MOUTH_OFFSET_Y);
            setPhase("idle");
            setFly("free");
            setHasPointer(false);
            hasPointerRef.current = false;
        };

        const syncSuppression = () => {
            const nextSuppressed = isPortfolioModalOpen();
            if (isSuppressedRef.current === nextSuppressed) return nextSuppressed;

            isSuppressedRef.current = nextSuppressed;
            setIsSuppressed(nextSuppressed);
            if (nextSuppressed) reset();
            if (!nextSuppressed) {
                resetTongueToMouth();
                setPhase("idle");
                setFly("free");
                lastTongueShotAtRef.current = performance.now();
                const pointer = pointerRef.current;
                const pointerIsInViewport = pointer.x > 0 && pointer.y > 0 && pointer.x < window.innerWidth && pointer.y < window.innerHeight;
                if (pointerIsInViewport) {
                    hasPointerRef.current = true;
                    setHasPointer(true);
                    flyX.set(pointer.x);
                    flyY.set(pointer.y);
                }
            }

            return nextSuppressed;
        };

        const updateFrogFloor = () => {
            frogY.set(getFrogFloorY());
            resetTongueToMouth();
        };

        const retractTongue = (nextPhase: FrogPhase = "idle") => {
            stopTongue();
            const mouth = getMouthPoint(frogX.get(), frogY.get(), frogHop.get());
            tongueControlsRef.current = [
                animate(tongueEndX, mouth.x, { duration: TONGUE_RETRACT_MS / 1000, ease: [0.22, 1, 0.36, 1] }),
                animate(tongueEndY, mouth.y, { duration: TONGUE_RETRACT_MS / 1000, ease: [0.22, 1, 0.36, 1] }),
            ];
            queue(() => {
                resetTongueToMouth();
                setPhase(nextPhase);
            }, TONGUE_RETRACT_MS);
        };

        const tryTongueShot = () => {
            if (syncSuppression()) return;
            if (!hasPointerRef.current || flyPhaseRef.current !== "free" || frogPhaseRef.current !== "idle") return;

            const now = performance.now();
            if (now - lastTongueShotAtRef.current < TONGUE_COOLDOWN_MS) return;

            lastTongueShotAtRef.current = now;
            clearTimers();
            stopTongue();

            setPhase("aim");
            const pointerBeforeAim = pointerRef.current;
            const horizontalGap = Math.abs(pointerBeforeAim.x - frogX.get());
            const shouldHopToPerch = horizontalGap > Math.min(300, window.innerWidth * 0.24);
            const aimDelay = shouldHopToPerch ? TONGUE_AIM_MS + FROG_HOP_MS + FROG_LAND_MS : TONGUE_AIM_MS;

            hopControlsRef.current?.stop();
            frogMoveControlsRef.current?.stop();
            if (shouldHopToPerch) {
                const currentFrogX = frogX.get();
                const maxHopDistance = Math.min(260, window.innerWidth * 0.18);
                const hopDirection = pointerBeforeAim.x >= currentFrogX ? 1 : -1;
                const perchX = clamp(
                    currentFrogX + hopDirection * Math.min(Math.abs(pointerBeforeAim.x - currentFrogX) * 0.58, maxHopDistance),
                    84,
                    window.innerWidth - 84,
                );
                setFacing((current) => {
                    const nextFacing: FrogDirection = hopDirection;
                    return current === nextFacing ? current : nextFacing;
                });
                queue(() => {
                    if (syncSuppression()) return;
                    setPhase("hop");
                    const deltaX = perchX - currentFrogX;
                    frogMoveControlsRef.current = animate(frogX, [
                        currentFrogX,
                        currentFrogX + deltaX * 0.04,
                        currentFrogX + deltaX * 0.12,
                        currentFrogX + deltaX * 0.25,
                        currentFrogX + deltaX * 0.42,
                        currentFrogX + deltaX * 0.58,
                        currentFrogX + deltaX * 0.72,
                        currentFrogX + deltaX * 0.84,
                        currentFrogX + deltaX * 0.94,
                        perchX,
                    ], {
                        duration: FROG_HOP_MS / 1000,
                        ease: [0.2, 0.86, 0.18, 1],
                        times: [0, 0.07, 0.16, 0.28, 0.42, 0.56, 0.7, 0.82, 0.93, 1],
                    });
                    hopControlsRef.current = animate(frogHop, [0, 4, 8, 2, -10, -24, -36, -40, -35, -26, -15, -5, 3, -1, 0], {
                        duration: FROG_HOP_MS / 1000,
                        ease: [0.2, 0.86, 0.18, 1],
                        times: [0, 0.04, 0.08, 0.14, 0.22, 0.32, 0.44, 0.55, 0.65, 0.74, 0.83, 0.9, 0.95, 0.98, 1],
                    });
                }, TONGUE_AIM_MS);
                queue(() => {
                    if (syncSuppression()) return;
                    setPhase("aim");
                    hopControlsRef.current?.stop();
                    hopControlsRef.current = animate(frogHop, [0, 4, -3, 0], {
                        duration: FROG_LAND_MS / 1000,
                        ease: [0.18, 0.74, 0.16, 1],
                    });
                }, TONGUE_AIM_MS + FROG_HOP_MS);
            }

            queue(() => {
                if (syncSuppression()) return;
                const pointerAtShot = { ...pointerRef.current };
                const mouth = getMouthPoint(frogX.get(), frogY.get(), frogHop.get());
                const { target, reachable } = limitTongueTarget(mouth, pointerAtShot);
                const shotStartedAt = performance.now();

                tongueEndX.set(mouth.x);
                tongueEndY.set(mouth.y);
                setPhase("shoot");
                setTongueShotId((value) => value + 1);
                stopTongue();
                tongueControlsRef.current = [
                    animate(tongueEndX, target.x, { duration: TONGUE_SHOOT_MS / 1000, ease: [0.08, 0.86, 0.18, 1] }),
                    animate(tongueEndY, target.y, { duration: TONGUE_SHOOT_MS / 1000, ease: [0.08, 0.86, 0.18, 1] }),
                ];

                queue(() => {
                    if (syncSuppression()) return;
                    const currentPointer = pointerRef.current;
                    const movedDistance = Math.hypot(currentPointer.x - pointerAtShot.x, currentPointer.y - pointerAtShot.y);
                    const pointerStayedNearTarget = movedDistance <= TONGUE_HIT_RADIUS;
                    const movedAfterShot = lastPointerMoveAtRef.current > shotStartedAt + 40;
                    const hit = reachable && pointerStayedNearTarget && (!movedAfterShot || movedDistance < 18);

                    if (!hit) {
                        setPhase("miss");
                        retractTongue("idle");
                        return;
                    }

                    setPhase("catch");
                    setFly("caught");
                    stopTongue();
                    const currentMouth = getMouthPoint(frogX.get(), frogY.get(), frogHop.get());
                    tongueControlsRef.current = [
                        animate(tongueEndX, currentMouth.x, { duration: TONGUE_CATCH_MS / 1000, ease: [0.22, 1, 0.36, 1] }),
                        animate(tongueEndY, currentMouth.y, { duration: TONGUE_CATCH_MS / 1000, ease: [0.22, 1, 0.36, 1] }),
                        animate(flyX, currentMouth.x, { duration: TONGUE_CATCH_MS / 1000, ease: [0.22, 1, 0.36, 1] }),
                        animate(flyY, currentMouth.y, { duration: TONGUE_CATCH_MS / 1000, ease: [0.22, 1, 0.36, 1] }),
                    ];

                    queue(() => {
                        setPhase("swallow");
                        setFly("respawn");
                        resetTongueToMouth();
                    }, TONGUE_CATCH_MS);

                    queue(() => {
                        const respawn = pointerRef.current;
                        flyX.set(respawn.x);
                        flyY.set(respawn.y);
                        setFly("free");
                        setPhase("idle");
                    }, TONGUE_CATCH_MS + FLY_RESPAWN_MS);
                }, TONGUE_SHOOT_MS + 30);
            }, aimDelay);
        };

        const handlePointerMove = (event: PointerEvent) => {
            if (event.pointerType && event.pointerType !== "mouse") return;
            const x = event.clientX;
            const y = event.clientY;
            const now = performance.now();
            pointerRef.current = { x, y };
            lastPointerMoveAtRef.current = now;
            hasPointerRef.current = true;
            setHasPointer(true);
            setFacing((current) => {
                if (frogPhaseRef.current === "hop") return current;
                if (Math.abs(x - frogX.get()) < 20) return current;
                const nextFacing: FrogDirection = x >= frogX.get() ? 1 : -1;
                return current === nextFacing ? current : nextFacing;
            });

            if (flyPhaseRef.current === "free") {
                flyX.set(x);
                flyY.set(y);
            }
        };

        const handlePointerLeave = () => {
            hasPointerRef.current = false;
            setHasPointer(false);
            setFly("free");
            retractTongue("idle");
        };

        reset();
        updateFrogFloor();
        syncSuppression();
        const modalObserver = new MutationObserver(syncSuppression);
        modalObserver.observe(document.body, { attributes: true, attributeFilter: ["class"], childList: true, subtree: false });
        intervalRef.current = window.setInterval(tryTongueShot, 80);

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        document.addEventListener("pointerleave", handlePointerLeave);
        window.addEventListener("resize", updateFrogFloor);

        return () => {
            if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
            clearTimers();
            stopTongue();
            hopControlsRef.current?.stop();
            frogMoveControlsRef.current?.stop();
            modalObserver.disconnect();
            window.removeEventListener("pointermove", handlePointerMove);
            document.removeEventListener("pointerleave", handlePointerLeave);
            window.removeEventListener("resize", updateFrogFloor);
        };
    }, [canUseCursor, flyX, flyY, frogHop, frogX, frogY, tongueEndX, tongueEndY]);

    if (!canUseCursor || isSuppressed) return null;

    const tongueColor = isDark ? "#ff8fb4" : "#d94c73";
    const tongueHighlight = isDark ? "rgba(255,220,232,0.9)" : "rgba(255,198,214,0.86)";

    return (
        <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden="true" data-portfolio-frog-cursor="" data-frog-phase={frogPhase}>
            <svg className="absolute inset-0 z-[12] h-full w-full overflow-visible">
                <motion.path
                    key={`tongue-shadow-${tongueShotId}`}
                    data-testid="frog-tongue-shadow"
                    d={tonguePath}
                    fill="none"
                    stroke="rgba(15,23,27,0.16)"
                    strokeLinecap="round"
                    strokeWidth="7"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: frogPhase === "shoot" || frogPhase === "catch" || frogPhase === "miss" ? 1 : 0,
                        opacity: frogPhase === "shoot" || frogPhase === "catch" || frogPhase === "miss" ? 0.55 : 0,
                    }}
                    transition={{ pathLength: { duration: 0.16, ease: [0.08, 0.86, 0.18, 1] }, opacity: { duration: 0.1 } }}
                />
                <motion.path
                    key={`tongue-${tongueShotId}`}
                    data-testid="frog-tongue"
                    d={tonguePath}
                    fill="none"
                    stroke={tongueColor}
                    strokeLinecap="round"
                    strokeWidth="4.8"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: frogPhase === "shoot" || frogPhase === "catch" || frogPhase === "miss" ? 1 : 0,
                        opacity: frogPhase === "shoot" || frogPhase === "catch" || frogPhase === "miss" ? 1 : 0,
                    }}
                    transition={{ pathLength: { duration: 0.16, ease: [0.08, 0.86, 0.18, 1] }, opacity: { duration: 0.1 } }}
                />
                <motion.path
                    key={`tongue-highlight-${tongueShotId}`}
                    data-testid="frog-tongue-highlight"
                    d={tonguePath}
                    fill="none"
                    stroke={tongueHighlight}
                    strokeLinecap="round"
                    strokeWidth="1.2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: frogPhase === "shoot" || frogPhase === "catch" ? 1 : 0,
                        opacity: frogPhase === "shoot" || frogPhase === "catch" ? 0.76 : 0,
                    }}
                    transition={{ pathLength: { duration: 0.14, ease: [0.08, 0.86, 0.18, 1] }, opacity: { duration: 0.08 } }}
                />
            </svg>

            <motion.div
                data-testid="frog-tongue-tip"
                className={`absolute z-[18] h-4 w-4 rounded-full shadow-[0_0_16px_rgba(255,126,164,0.34)] ${isDark ? "bg-[#ffd7e5]" : "bg-[#e95f86]"}`}
                style={{
                    x: tongueEndX,
                    y: tongueEndY,
                    rotate: tongueAngle,
                    translateX: "-50%",
                    translateY: "-50%",
                    willChange: "transform, opacity",
                }}
                animate={{
                    opacity: frogPhase === "shoot" || frogPhase === "catch" ? [0, 1, 1] : 0,
                    scale: frogPhase === "shoot" || frogPhase === "catch" ? [0.55, 1.12, 0.92] : 0.5,
                }}
                transition={{ duration: 0.18, ease: [0.08, 0.86, 0.18, 1] }}
            />

            <motion.div
                data-testid="fly-cursor"
                data-fly-state={flyPhase}
                className="absolute z-20 h-8 w-10 drop-shadow-[0_8px_10px_rgba(15,23,27,0.2)]"
                style={{
                    x: flyX,
                    y: flyY,
                    translateX: "-50%",
                    translateY: "-50%",
                    willChange: "transform, opacity",
                }}
                animate={{
                    opacity: hasPointer && flyPhase !== "respawn" ? 1 : 0,
                    scale: flyPhase === "caught" ? [1, 0.72, 0.42] : flyPhase === "respawn" ? [0, 1.08, 1] : 1,
                    rotate: flyPhase === "caught" ? [0, 40, -35, 0] : [0, 5, -4, 0],
                }}
                transition={{
                    opacity: { duration: 0.08 },
                    scale: { duration: flyPhase === "caught" ? 0.24 : 0.2 },
                    rotate: { duration: 0.5, repeat: flyPhase === "free" ? Infinity : 0, ease: "easeInOut" },
                }}
            >
                <FlyIcon isDark={isDark} />
            </motion.div>

            <motion.div
                data-testid="frog-hunter"
                data-frog-state={frogPhase}
                data-frog-facing={facing === -1 ? "left" : "right"}
                className="absolute z-10 h-[58px] w-[68px]"
                style={{
                    x: frogX,
                    y: renderedFrogY,
                    translateX: "-50%",
                    translateY: "-92%",
                    willChange: "transform",
                }}
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                }}
                transition={{ opacity: { duration: 0.18 } }}
            >
                <FrogSprite phase={frogPhase} direction={facing} />
            </motion.div>
        </div>
    );
}
