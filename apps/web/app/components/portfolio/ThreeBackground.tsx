/**
 * ThreeBackground.tsx
 *
 * Static page background layer. Kept as a component so the page import stays
 * stable while the previous animated runtime is intentionally disabled.
 */

"use client";

interface ThreeBackgroundProps {
    isDark: boolean;
}

export default function ThreeBackground({ isDark }: ThreeBackgroundProps) {
    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 z-0 transition-colors duration-700"
            style={{ backgroundColor: isDark ? "#070b10" : "#f4f7f5" }}
        />
    );
}
