"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

type TechStackProps = {
    images: string[];
    orbitRadius?: number;  // orbit radius
    size?: number;         // cube edge length
    spinSpeed?: number;    // per-cube self rotation (rad/sec)
    orbitSpeed?: number;   // belt rotation (rad/sec)
    direction?: -1 | 1;    // orbit direction; defaults to left (-1)
};

export default function TechStack({
                                      images,
                                      orbitRadius = 9.2,
                                      size = 1.2,
                                      spinSpeed = 0.6,
                                      orbitSpeed = 0.35,
                                      direction = -1,
                                  }: TechStackProps) {
    const pivotRef = useRef<THREE.Group>(null);
    const cubesRef = useRef<THREE.Mesh[]>([]);

    // Load all textures and tune sampling/color space for crisp UI logos
    const textures = useTexture(images) as THREE.Texture[];
    useMemo(() => {
        textures.forEach((t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            t.generateMipmaps = true;
            t.minFilter = THREE.LinearMipmapLinearFilter;
            t.magFilter = THREE.LinearFilter;
            t.wrapS = THREE.ClampToEdgeWrapping;
            t.wrapT = THREE.ClampToEdgeWrapping;
            t.anisotropy = 8;
            t.needsUpdate = true;
        });
    }, [textures]);

    // Compute angle directly from index and count to avoid undefined issues
    const count = Math.max(1, textures.length);
    const angleFor = (i: number) => (i / count) * Math.PI * 2;

    // Animate group orbit and cube self-spin
    useFrame((_, delta) => {
        if (pivotRef.current) {
            pivotRef.current.rotation.y += direction * orbitSpeed * delta;
        }
        cubesRef.current.forEach((m) => {
            if (m) m.rotation.y += spinSpeed * delta;
        });
    });

    return (
        <group ref={pivotRef}>
            {textures.map((tex, i) => (
                <group key={i} rotation={[0, angleFor(i), 0]}>
                    <CubeWithTexture
                        refCb={(el) => {
                            if (el) cubesRef.current[i] = el;
                        }}
                        position={[orbitRadius, 0, 0]}
                        size={size}
                        texture={tex}
                    />
                </group>
            ))}
        </group>
    );
}

/**
 * Cube with the same texture on all six faces.
 * - MeshBasicMaterial keeps logos bright regardless of lights.
 * - White color multiplies with the map so transparent pixels appear white.
 * - DoubleSide ensures each face renders from both directions.
 * - Six materials are attached inline (no possibility of undefined).
 */
function CubeWithTexture({
                             texture,
                             size,
                             position,
                             refCb,
                         }: {
    texture: THREE.Texture;
    size: number;
    position: [number, number, number];
    refCb?: React.Ref<THREE.Mesh>;
}) {
    return (
        <mesh position={position} ref={refCb}>
            <boxGeometry args={[size, size, size]} />
            {Array.from({ length: 6 }).map((_, face) => (
                <meshBasicMaterial
                    key={face}
                    attach={`material-${face}`}
                    map={texture}
                    color={0xffffff}
                    transparent
                    side={THREE.DoubleSide}
                    depthWrite
                    alphaTest={0.01}
                />
            ))}
        </mesh>
    );
}
