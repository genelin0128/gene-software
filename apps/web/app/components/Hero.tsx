"use client";

import styled, { keyframes } from "styled-components";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import Custom3DModel from "@/app/components/Custom3DModel";
import CanvasLoader from "@/app/components/CanvasLoader";
import { useMediaQuery } from "react-responsive";
import * as effects from "@/app/components/effects";

// ---- IMPORTANT ----
// Preload GLTFs at the module top (outside React render).
// This runs once on module load and will NOT cause
// "Cannot update a component while rendering a different component".
const MODELS = [
    "/models/gaming_desktop.glb",
    "/models/html_logo.glb",
    "/models/css_logo.glb",
    "/models/javascript_logo.glb",
    "/models/react_logo.glb",
    "/models/java_logo.glb",
    "/models/threejs_logo.glb",
    "/models/tailwindcss_logo.glb",
    "/models/c_logo.glb",
    "/models/github_logo.glb",
    "/models/postgreSQL_logo.glb",
    "/models/mongoDB_logo.glb",
    "/models/docker_logo.glb",
    "/models/swift_logo.glb",
];
MODELS.forEach((m) => useGLTF.preload(m));

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

    const isMobile = useMediaQuery({ maxWidth: 640 });

    const deg = (d: number) => (d * Math.PI) / 180;

    return (
        <section className=" w-full flex flex-col relative">
            <div className="w-full mx-auto flex flex-col gap-2 pointer-events-none select-none">
                <p className="sm:text-3xl text-2xl font-medium text-black text-center">
                    Hi, I am Gene <WavingHand>👋</WavingHand>
                </p>
                {/*<p className="text-gray-600 text-3xl font-bold text-center">*/}
                {/*    Building Products & Brands*/}
                {/*</p>*/}
            </div>

            {/* 3D stage */}
            <div className="w-full mt-3 sm:mt-10 h-[40vh] sm:h-[60vh]">
                <Canvas
                    key={isMobile ? "mobile" : "desktop"}
                    className="w-full h-full"
                    dpr={[1, 2]}
                    camera={{ fov: isMobile ? 60 : 65, position: [16, 0, 0] }}
                    gl={{ antialias: true, preserveDrawingBuffer: false }}
                >
                    <axesHelper args={[100]} />
                    <Suspense fallback={<CanvasLoader />}>
                        {/* Lights */}
                        <ambientLight intensity={0.7} />
                        <directionalLight position={[6, 8, 5]} intensity={1} castShadow />
                        <hemisphereLight intensity={1} groundColor={"#222222"} />

                        {/* Controls: rotate / zoom / pan */}
                        <OrbitControls
                            enableZoom
                            enablePan
                            enableDamping
                            dampingFactor={0.06}
                            minDistance={0.9}
                            maxDistance={25}
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
                            position={[0, -3, -1.55]}
                            rotation={[0, 0, 0]}
                            scale={isMobile ? 0.8 : 1}
                        />

                        {/* HTML: page flip + gentle vertical drift */}
                        <Custom3DModel
                            model="/models/html_logo.glb"
                            position={isMobile ? [0, 6, 5] : [0, 6, 7]}
                            rotation={[0, deg(90), 0]}
                            scale={isMobile ? 0.008 : 0.01}
                            animate={effects.html}
                            animateDeps={[isMobile]}
                        />

                        {/* CSS: wiggle/reshape vibe (roll + subtle x-shear simulated by alternating rotations) */}
                        <Custom3DModel
                            model="/models/css_logo.glb"
                            position={isMobile ? [0, 6, 3] : [0, 6, 5]}
                            rotation={[0, deg(90), 0]}
                            scale={isMobile ? 0.008 : 0.01}
                            animate={effects.css}
                            animateDeps={[isMobile]}
                        />

                        {/* JavaScript: energetic tumble (x/y/z spins with slightly different periods) */}
                        <Custom3DModel
                            model="/models/javascript_logo.glb"
                            position={isMobile ? [0, 7.65, 1.1] : [0, 8, 3]}
                            rotation={[0, deg(180), deg(90)]}
                            scale={isMobile ? 0.066 : 0.08}
                            animate={effects.javaScript}
                            animateDeps={[isMobile]}
                        />

                        {/* React: atomic spin + breathing scale (reactive pulse) */}
                        <Custom3DModel
                            model="/models/react_logo.glb"
                            position={isMobile ? [0, 5.5, 5] : [0, 5, 7.2]}
                            rotation={[0, deg(90), 0]}
                            scale={isMobile ? 0.35 : 0.45}
                            animate={effects.react}
                            animateDeps={[isMobile]}
                        />

                        {/* C: "coin spin" (classic systems/low-level vibe) */}
                        <Custom3DModel
                            model="/models/c_logo.glb"
                            position={isMobile ? [0, 7.7, -1.1] : [0, 8.2, -1.3]}
                            rotation={[0, 0, 0]}
                            scale={isMobile ? 0.155 : 0.2}
                            animate={effects.c}
                            animateDeps={[isMobile]}
                        />

                        {/* Java: steam swirl (orbit-like arc + gentle sway) */}
                        <Custom3DModel
                            model="/models/java_logo.glb"
                            position={isMobile ? [0, 7.7, -3.2] : [0, 8, -4]}
                            rotation={[0, deg(90), 0]}
                            scale={isMobile ? 0.45 : 0.6}
                            animate={effects.java}
                            animateDeps={[isMobile]}
                        />

                        {/* three.js: axial spin (about Z) + hover (graphics axis play) */}
                        <Custom3DModel
                            model="/models/threejs_logo.glb"
                            position={isMobile ? [0, 7.8, -5.1] : [0, 8.2, -6.2]}
                            rotation={[0, deg(90), 0]}
                            scale={isMobile ? 0.013 : 0.018}
                            animate={effects.threejs}
                            animateDeps={[isMobile]}
                        />

                        {/* GitHub: arrival pop + slow lateral drift (mascot drifting in) */}
                        <Custom3DModel
                            model="/models/github_logo.glb"
                            position={isMobile ? [-4.34, 3.48, -1.16] : [-5.4, 2.7, -1.4]}
                            rotation={[0, deg(90), 0]}
                            scale={isMobile ? 0.72 : 0.9}
                            animate={effects.github}
                            animateDeps={[isMobile]}
                        />

                        {/* Swift: bird-like swoop (figure-8 in x/y) + slight yaw */}
                        <Custom3DModel
                            model="/models/swift_logo.glb"
                            position={isMobile ? [0, 5.0, 3.08] : [0, 4.5, 5]}
                            rotation={[0, deg(180), 0]}
                            scale={isMobile ? 0.9 : 1.1}
                            animate={effects.swift}
                            animateDeps={[isMobile]}
                        />

                        {/* Docker: ship bobbing (roll/pitch) + buoyant up/down */}
                        <Custom3DModel
                            model="/models/docker_logo.glb"
                            position={isMobile ? [0, 5.0, 1.08] : [0, 4.3, 2.6]}
                            rotation={[0, deg(90), 0]}
                            scale={isMobile ? 0.9 : 1.1}
                            animate={effects.docker}
                            animateDeps={[isMobile]}
                        />

                        {/* PostgreSQL: elephant head "nod" + curious peek in/out */}
                        <Custom3DModel
                            model="/models/postgreSQL_logo.glb"
                            position={isMobile ? [0, 3.0, 1.08] : [0, 2.0, 2.6]}
                            rotation={[0, deg(90), 0]}
                            scale={isMobile ? 0.8 : 1.1}
                            animate={effects.postgreSQL}
                            animateDeps={[isMobile]}
                        />

                        {/* Tailwind: flowing current (x sine-like drift) + smooth spin */}
                        <Custom3DModel
                            model="/models/tailwindcss_logo.glb"
                            position={isMobile ? [0, 3.4, 5.1] : [0, 2.5, 7.5]}
                            rotation={[0, deg(90), 0]}
                            scale={isMobile ? 0.8 : 1.1}
                            animate={effects.tailwindcss}
                            animateDeps={[isMobile]}
                        />

                        {/* MongoDB: leaf sprout (grow/shrink) + gentle rise/fall */}
                        <Custom3DModel
                            model="/models/mongoDB_logo.glb"
                            position={isMobile ? [0, 3.0, 3.0] : [0, 2.0, 5.0]}
                            rotation={[0, deg(90), 0]}
                            scale={isMobile ? 0.75 : 1.1}
                            animate={effects.mongoDB}
                            animateDeps={[isMobile]}
                        />
                    </Suspense>
                </Canvas>
            </div>
        </section>
    );
}