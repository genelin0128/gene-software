// Rotating3DText.tsx
// Spins 3D text horizontally (Y axis). On hover, it eases to [0,0,0] (front).
// When pointer leaves, it resumes spinning from 0° (front) again.
// No clock usage — rotation integrates using frame `delta` and wraps to [-π, π].

"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Text } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import * as THREE from "three";

type Rotating3DTextProps = {
    text: string;
    backgroundColor?: string;
    fontColor?: string;
    width?: number;
    height?: number;
    /** radians per second while not hovered */
    speed?: number;
    fontSize?: number;
    emissiveIntensity?: number;
};

function SpinningTextGroup({
                               text,
                               fontColor = "#ffffff",
                               fontSize = 1.0,
                               emissiveIntensity = 0.25,
                               speed = 1.2,
                               hover = false,
                           }: {
    text: string;
    fontColor?: string;
    fontSize?: number;
    emissiveIntensity?: number;
    speed?: number;
    hover?: boolean;
}) {
    // Spring-driven rotation (X,Y,Z)
    const [{ rotation }, api] = useSpring(() => ({
        rotation: [0, 0, 0] as [number, number, number],
        config: { tension: 260, friction: 18 },
    }));

    // Integrate spin with delta; keep Y angle bounded to [-π, π] to avoid long unwinds.
    const angleRef = useRef<number>(0);
    const prevHover = useRef<boolean>(hover);

    const TWO_PI = Math.PI * 2;
    const wrapToPi = (a: number) => {
        // Wrap any angle to [-π, π]
        a = (a + Math.PI) % TWO_PI;
        if (a < 0) a += TWO_PI;
        return a - Math.PI;
    };

    useFrame((_, delta) => {
        // Transition: not-hover -> hover
        if (!prevHover.current && hover) {
            // Snap spring to the current wrapped angle so the ease-to-zero takes the shortest path
            angleRef.current = wrapToPi(angleRef.current);
            api.start({ rotation: [0, angleRef.current, 0], immediate: true });
            // Then animate toward exact zero (front)
            api.start({ rotation: [0, 0, 0] });
        }

        // Transition: hover -> not-hover
        if (prevHover.current && !hover) {
            // Restart free spin from front
            angleRef.current = 0;
            api.start({ rotation: [0, 0, 0], immediate: true });
        }

        prevHover.current = hover;

        if (!hover) {
            // Accumulate spin and keep bounded
            angleRef.current += speed * delta;
            angleRef.current = wrapToPi(angleRef.current);
            // Immediate so spring follows our integrated angle exactly
            api.start({ rotation: [0, angleRef.current, 0], immediate: true });
        }
        // When hovered, spring is already easing to [0,0,0]
    });

    return (
        <a.group rotation={rotation as any}>
            <Text
                anchorX="center"
                anchorY="middle"
                fontSize={fontSize}
                letterSpacing={0.1}
                lineHeight={1}
                sdfGlyphSize={64}
            >
                {text}
                <meshStandardMaterial
                    color={fontColor}
                    emissive={fontColor}
                    emissiveIntensity={emissiveIntensity}
                    roughness={0.35}
                    metalness={0.05}
                    side={THREE.DoubleSide} // keep visible from the back while spinning
                />
            </Text>
        </a.group>
    );
}

export default function Rotating3DText({
                                           text,
                                           backgroundColor = "transparent",
                                           fontColor = "#ffffff",
                                           width = 64,
                                           height = 40,
                                           speed = 1.2,
                                           fontSize = 0.9,
                                           emissiveIntensity = 0.25,
                                       }: Rotating3DTextProps) {
    const [hover, setHover] = useState(false);

    return (
        <div
            style={{
                width,
                height,
                display: "inline-block",
                lineHeight: 0,
                background: backgroundColor,
                borderRadius: 8,
            }}
            aria-hidden={true}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 0, 3.2], fov: 45 }}
                gl={{
                    antialias: true,
                    toneMapping: THREE.NoToneMapping,
                    outputColorSpace: THREE.SRGBColorSpace,
                }}
            >
                <ambientLight intensity={0.7} />
                <directionalLight position={[1.5, 2.5, 3.5]} intensity={0.9} />
                <Environment preset="city" />
                <SpinningTextGroup
                    text={text}
                    fontColor={fontColor}
                    fontSize={fontSize}
                    emissiveIntensity={emissiveIntensity}
                    speed={speed}
                    hover={hover}
                />
            </Canvas>
        </div>
    );
}
