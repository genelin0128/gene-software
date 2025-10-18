"use client";

import styled, { keyframes } from "styled-components";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import Custom3DModel from "@/app/components/Custom3DModel";
import CanvasLoader from "@/app/components/CanvasLoader";

const wave = keyframes`
    0% {
        transform: rotate(0deg);
    }
    10% {
        transform: rotate(14deg);
    }
    20% {
        transform: rotate(-8deg);
    }
    30% {
        transform: rotate(14deg);
    }
    40% {
        transform: rotate(-4deg);
    }
    50% {
        transform: rotate(10deg);
    }
    60%, 100% {
        transform: rotate(0deg);
    }
`;

export const WavingHand = styled.span`
    display: inline-block;
    transform-origin: 70% 70%;
    animation: ${wave} 2.5s infinite;
`;

export default function Hero() {
    const deg = (d: number) => (d * Math.PI) / 180;

    // Preload the model before rendering to speed up the first frame.
    useGLTF.preload("/models/gaming_desktop.glb");

    return (
        <section className="min-h-screen w-full flex flex-col relative">
            <div className="w-full mx-auto flex flex-col gap-2 pointer-events-none select-none">
                <p className="sm:text-3xl text-2xl font-medium text-black text-center">
                    Hi, I am Gene <WavingHand>👋</WavingHand>
                </p>
                <p className="text-gray-600 text-3xl font-bold text-center">
                    Building Products & Brands
                </p>
            </div>

            {/* 3D stage */}
            <div className="w-full mt-10 h-[70vh]">
                <Canvas
                    className="w-full h-full"
                    dpr={[1, 2]}
                    camera={{ fov: 60, position: [15, 0, 0] }}
                    gl={{ antialias: true, preserveDrawingBuffer: false }}
                >
                    <axesHelper args={[100]} />

                    <Suspense fallback={<CanvasLoader />}>
                        {/* Lights */}
                        <ambientLight intensity={0.9} />
                        <directionalLight position={[6, 8, 5]} intensity={20.2} castShadow />
                        <hemisphereLight intensity={1} groundColor={"#222222"} />

                        {/* Controls: rotate / zoom / pan */}
                        <OrbitControls
                            enableZoom
                            enablePan
                            enableDamping
                            dampingFactor={0.06}
                            minDistance={0.9}
                            maxDistance={15}
                            minPolarAngle={Math.PI / 2 - deg(45)}
                            maxPolarAngle={Math.PI / 2 + deg(45)}
                        />

                        {/*
                        Reminder: preload this model before rendering to speed up the first frame.
                        inside Hero() before the return (not inside JSX)
                        useGLTF.preload("Model PATH");
                        */}
                        <Custom3DModel
                            model="/models/gaming_desktop.glb"
                            position={[0, -3, -1]}
                            rotation={[0, 0, 0]}
                            scale={1}
                        />
                    </Suspense>
                </Canvas>
            </div>
        </section>
    );
}
