// This component renders a 3D "hamburger" icon that continuously rotates horizontally (Y axis).
// When clicked, the three bars smoothly morph into an "X" (middle bar fades), and keep rotating.
// Built with: react-three-fiber (R3F), drei, and @react-spring/three.

"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Environment } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import * as THREE from "three";

/**
 * Single bar of the hamburger icon.
 * - Uses spring-based animation to move to center (posY), rotate into ±45° (rotZ),
 *   fade the middle bar (opacity), and slightly shorten it (scaleX) when "open".
 */
function Bar({
                 open,
                 index, // 0: top, 1: middle, 2: bottom
                 y,     // initial Y offset for closed state
             }: {
    open: boolean;
    index: 0 | 1 | 2;
    y: number;
}) {
    // Spring values driving the transformation between "hamburger" and "X"
    const { posY, rotZ, opacity, scaleX, emissiveIntensity } = useSpring({
        // Move top/bottom bars toward the center when open
        posY: open ? 0 : y,
        // Rotate top to +45°, bottom to -45°; middle stays 0°
        rotZ:
            open && index !== 1
                ? index === 0
                    ? Math.PI / 4
                    : -Math.PI / 4
                : 0,
        // Fade the middle bar when open
        opacity: open && index === 1 ? 0 : 1,
        // Slightly shorten the middle bar when open (helps the "X" read clearly)
        scaleX: open && index === 1 ? 0.5 : 1,
        // Give a bit more glow when open
        emissiveIntensity: open ? 0.7 : 0.25,
        // Snappy but smooth spring feel
        config: { tension: 600, friction: 30 },
    });

    return (
        // Apply animated translation/rotation/scale per bar
        <a.group position-y={posY} rotation-z={rotZ} scale-x={scaleX}>
            <a.mesh>
                {/* RoundedBox: width, height, depth; tiny thickness to emphasize 3D */}
                <RoundedBox args={[1.6, 0.14, 0.12]} radius={0.05} smoothness={6}>
                    {/* Standard material supports roughness/metalness and emissive glow */}
                    <a.meshStandardMaterial
                        color="#ffffff"
                        emissive="#ffffff"
                        emissiveIntensity={emissiveIntensity}
                        roughness={0.35}
                        metalness={0.05}
                        transparent
                        opacity={opacity}
                    />
                </RoundedBox>
            </a.mesh>
        </a.group>
    );
}

/**
 * The group that holds all three bars and handles continuous horizontal spin.
 * - Spins around Y axis every frame.
 * - Also scales slightly when "open" to add a subtle breathing effect.
 */
function BurgerX3D({ open }: { open: boolean }) {
    const g = useRef<THREE.Group>(null!);

    // Per-frame update: horizontal (Y-axis) rotation only
    useFrame((_, delta) => {
        if (!g.current) return;
        // Increase/decrease 1.2 to change rotation speed
        g.current.rotation.y += 1.2 * delta;
    });

    // Slight scale change on open for emphasis
    const { scale } = useSpring({
        scale: open ? 1.06 : 1,
        config: { tension: 260, friction: 18 },
    });

    return (
        <a.group ref={g} scale={scale as any}>
            {/* Top / Middle / Bottom bars with their initial vertical offsets */}
            <Bar y={0.36} open={open} index={0} />
            <Bar y={0} open={open} index={1} />
            <Bar y={-0.36} open={open} index={2} />
        </a.group>
    );
}

/**
 * Button wrapper that:
 * - Hosts a tiny R3F Canvas so the icon lives fully in WebGL.
 * - Manages "open" state and accessibility attributes.
 * - Provides lights + environment for pleasing 3D shading in a small icon.
 */
export default function MenuButton3D() {
    const [open, setOpen] = useState(false);

    return (
        <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-pressed={open}
            className="p-1 rounded-xl hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:hidden flex"
            style={{ width: 36, height: 36 }}              // Stable hit area
        >
            <Canvas
                // Use device pixel ratio range for crispness without overdoing GPU work
                dpr={[1, 2]}
                // Keep the camera close enough to frame the 24px icon space nicely
                camera={{ position: [3, 0, 0], fov: 45 }}
                // camera={{ position: [0, 0, 3.2], fov: 40 }}
                gl={{ antialias: true }}
            >
                {/* Basic lighting: ambient for base visibility + directional for highlights */}
                <ambientLight intensity={0.7} />
                <directionalLight position={[2, 3, 5]} intensity={0.9} />

                {/* Image-based lighting/reflections; "city" preset gives subtle specular cues */}
                <Environment preset="city" />

                <BurgerX3D open={open} />
            </Canvas>
        </button>
    );
}
