// Y-axis auto spin; when hovered, ease to [0,0,0]. On leave, resume spin from front.

"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Text } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import * as THREE from "three";

type Rotating3DTextProps = {
    /** Text content to render in 3D */
    text: string;
    backgroundColor?: string;
    fontColor?: string;
    width?: number;
    height?: number;
    /** Spin speed in radians/sec when not hovered */
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
    // Per-axis springs so each prop is SpringValue<number>
    const [{ rx, ry, rz }, api] = useSpring<{ rx: number; ry: number; rz: number }>(() => ({
        rx: 0,
        ry: 0,
        rz: 0,
        config: { tension: 260, friction: 18 },
    }));

    // Keep an integrated angle (bounded to [-π, π]) to avoid large unwinds.
    const angleRef = useRef<number>(0);
    const prevHover = useRef<boolean>(hover);

    const TWO_PI = Math.PI * 2;
    const wrapToPi = (a: number) => {
        a = (a + Math.PI) % TWO_PI;
        if (a < 0) a += TWO_PI;
        return a - Math.PI;
    };

    useFrame((_, delta) => {
        // not-hover -> hover: snap to current angle, then ease to zero
        if (!prevHover.current && hover) {
            angleRef.current = wrapToPi(angleRef.current);
            api.start({ rx: 0, ry: angleRef.current, rz: 0, immediate: true });
            api.start({ rx: 0, ry: 0, rz: 0 });
        }

        // hover -> not-hover: restart free spin from front
        if (prevHover.current && !hover) {
            angleRef.current = 0;
            api.start({ rx: 0, ry: 0, rz: 0, immediate: true });
        }

        prevHover.current = hover;

        // Free spin when not hovered
        if (!hover) {
            angleRef.current = wrapToPi(angleRef.current + speed * delta);
            // angleRef.current = wrapToPi(angleRef.current + speed * 0);       // STOP ROTATING
            api.start({ ry: angleRef.current, immediate: true });
        }
    });

    return (
        <a.group rotation-x={rx} rotation-y={ry} rotation-z={rz}>
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
                    side={THREE.DoubleSide}
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
            aria-hidden
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
