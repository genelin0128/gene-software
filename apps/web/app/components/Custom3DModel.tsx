"use client";

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Vec3 = [number, number, number];

type Props = {
    /** GLB path (under /public, use absolute path like "/models/foo.glb") */
    model: string;
    /** Model position */
    position?: Vec3;
    /** Model rotation (radians) */
    rotation?: Vec3;
    /** Model scale (number or [x, y, z]) */
    scale?: number | Vec3;
    /**
     * Inject a GSAP animation from parent.
     * It receives the group ref and gsap instance so parent can compose any timeline.
     */
    animate?: (ctx: {
        ref: React.RefObject<THREE.Group>;
        gsap: typeof gsap;
    }) => gsap.core.Timeline | void;

    /** Optional dependency list for re-running `animate` */
    animateDeps?: ReadonlyArray<unknown>
} & Omit<ThreeElements["group"], "position" | "rotation" | "scale">;

export default function Custom3DModel({
                                          model,
                                          scale = 1,
                                          position = [0, 0, 0],
                                          rotation = [0, 0, 0],
                                          animate,
                                          animateDeps = [],
                                          ...groupProps
                                      }: Props) {
    const { scene } = useGLTF(model);
    const groupRef = useRef<THREE.Group>(null!);

    useGSAP(
        () => {
            if (!animate) return;
            // gsap.context will auto-revert on unmount
            const tl = animate({ ref: groupRef, gsap });
            return () => {
                // if parent returned a timeline, kill it explicitly (optional; context also reverts tweens)
                tl?.kill();
            };
        },
        // scope ensures selector-based animations (if any) are scoped to the group
        {
            scope: groupRef,
            dependencies: animateDeps ? [...animateDeps] : undefined,
        },
    );


    return (
        <group
            ref={groupRef}
            position={position}
            rotation={rotation}
            scale={scale}
            {...groupProps}
        >
            <primitive object={scene} />
        </group>
    );
}