"use client";

import { Html, useProgress } from "@react-three/drei";

export default function CanvasLoader() {
    const { progress } = useProgress();
    const pct = Number.isFinite(progress) ? Math.min(Math.max(progress, 0), 100) : 0;

    return (
        <Html center wrapperClass="pointer-events-none" as="div">
            <div
                role="status"
                aria-live="polite"
                className="
          pointer-events-auto select-none
          rounded-2xl border border-black/5
          bg-white/70 shadow-xl backdrop-blur-md
          dark:bg-black/40
          px-6 py-5
          flex flex-col items-center gap-3
          min-w-[220px]
        "
            >
                {/* Spinner */}
                <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-90" d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="4"
                          strokeLinecap="round" />
                </svg>

                {/* Title + Percentage */}
                <div className="text-sm font-semibold tracking-wide">Loading 3D Model</div>
                <div className="text-xs opacity-70">{pct > 0 ? `${pct.toFixed(0)}%` : "…"}</div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div
                        className="h-2 rounded-full bg-black/80 dark:bg-white/80 transition-[width] duration-300"
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>
        </Html>
    );
}
