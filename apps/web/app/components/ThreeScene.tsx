"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState, Suspense } from "react";

const RotatingDodecahedron = ({ paused = false }: { paused?: boolean }) => {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((_, delta) => {
        if (paused) return;
        meshRef.current.rotation.x += 0.8 * delta;
        meshRef.current.rotation.y += 0.8 * delta;
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <dodecahedronGeometry args={[1]} />
            <meshLambertMaterial color="#468585" emissive="#468585" />
            <Sparkles count={100} scale={2} size={20} speed={0.02} noise={0.2} color="cyan" />
        </mesh>
    );
};

function RotatingPlane({ paused = false }: { paused?: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((_, delta) => {
        if (paused) return;
        meshRef.current.rotation.y += 0.8 * delta;
    });

    return (
        <mesh ref={meshRef} position={[0, -1.5, 0]}>
            <boxGeometry args={[2.0, 0.1, 2.0]} />
            <meshStandardMaterial color="#B4B4B3" emissive="#B4B4B3" />
        </mesh>
    );
}

export default function ThreeScene() {
    const [paused, setPaused] = useState(false);


    return (
        <div style={{ width: "100%", height: "60vh", borderRadius: 12, overflow: "hidden" }}>
            <Canvas
                dpr={[1, 2]}
                camera={{ fov: 60, position: [0, 0, 5] }}
            >
                <color attach="background" args={["#F0F0F0"]} />

                <ambientLight intensity={0.6} />
                <spotLight color={0x006769} intensity={100} position={[1, 1, 1]} />

                <OrbitControls
                    enableZoom
                    enablePan
                    enableDamping
                    dampingFactor={0.05}
                    onStart={() => setPaused(true)}
                    onEnd={() => setPaused(false)}
                />
                <Suspense fallback={null}>
                    <RotatingDodecahedron paused={paused} />
                    <RotatingPlane paused={paused} />
                </Suspense>
            </Canvas>
        </div>
    );
}
