"use client";

import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

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
} & Omit<ThreeElements["group"], "position" | "rotation" | "scale">;

export default function Custom3DModel({
                                          model,
                                          scale = 1,
                                          position = [0, 0, 0],
                                          rotation = [0, 0, 0],
                                          ...groupProps
                                      }: Props) {
    const { scene } = useGLTF(model);

    return (
        <group position={position} rotation={rotation} scale={scale} {...groupProps}>
            <primitive object={scene} />
        </group>
    );
}