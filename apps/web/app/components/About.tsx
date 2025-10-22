"use client";

import React, { Suspense, useMemo } from "react";
import CanvasLoader from "@/app/components/CanvasLoader";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";
import TechStack from "@/app/components/TechStack";

const About = () => {
    const isMobile = useMediaQuery({ maxWidth: 640 });

    /**
     * Logical ring order:
     * Core web → UI frameworks → Styling → 3D → Runtime → API/tooling →
     * Databases → Cloud/DevOps → Collaboration/Design → Other languages → Extra frameworks.
     */
    const planetImages = useMemo(
        () => [
            "/images/tech/typescript.png",
            "/images/tech/javascript.png",
            "/images/tech/react.png",
            "/images/tech/nextjs.png",
            "/images/tech/tailwindcss.png",
            "/images/tech/css.png",
            "/images/tech/html.png",
            "/images/tech/bootstrap.png",
            "/images/tech/threejs.png",
            "/images/tech/nodejs.png",
            "/images/tech/postman.png",
            "/images/tech/postgresql.png",
            "/images/tech/mysql.png",
            "/images/tech/mongodb.png",
            "/images/tech/docker.png",
            "/images/tech/aws.png",
            "/images/tech/github.png",
            "/images/tech/figma.png",
            "/images/tech/python.png",
            "/images/tech/java.png",
            "/images/tech/swift.png",
            "/images/tech/c.png",
            "/images/tech/cpp.png",
            "/images/tech/vue.png",
            "/images/tech/angular.png",
        ],
        [],
    );

    const deg = (d: number) => (d * Math.PI) / 180;

    return (
        <section className="mt-5">
            <div className="grid xl:grid-rows-6 md:grid-cols-2 grid-cols-1 gap-5 h-full">
                <div className="col-span-1 xl:row-span-3">
                    <div
                        className="w-full h-full border border-[#1f2937] bg-[#374151] rounded-lg p-4 sm:p-7 flex flex-col gap-4"
                    >
                        <div className="relative w-full h-[260px] sm:h-[420px] rounded-xl overflow-hidden">
                            <Image
                                src="/images/background.jpeg"
                                alt="background"
                                fill
                                priority
                                sizes="100vw"
                                className="absolute inset-0 object-cover scale-[1.06] blur-[1px] brightness-90"
                            />

                            <div
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                                w-36 h-36 sm:w-56 sm:h-56 rounded-full overflow-hidden
                                bg-[#0b0b0c] ring-2 ring-white/70 shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
                                aria-label="Profile avatar"
                            >
                                <Image
                                    src="/images/avatar.jpeg"
                                    alt="avatar"
                                    fill
                                    sizes="(max-width: 640px) 9rem, 14rem"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="px-3 flex flex-col gap-2">
                            <p className="text-xl font-semibold text-white">Hi, I’m Gene</p>
                            <p className="text-base text-[#afb0b6] leading-relaxed max-w-prose">
                                I’m an MCS candidate at Rice (Dec 2025) focused on modern web development. I work across
                                React/Next.js on the front end and Node/Express on the back end.
                                At Paycom, I delivered an internal “UI Playroom” that let engineers rapidly build pages
                                and components via drag-and-drop.
                                Previously at SXB, I built a MySQL-backed billing system and Python ETL that automated
                                invoice generation and reconciliation, streamlined payment tracking, and reduced manual
                                work. I enjoy turning ambiguous requirements into reliable, scalable web applications.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 xl:row-span-3">
                    <div
                        className="w-full h-full border border-[#1f2937] bg-[#374151] rounded-lg p-4 sm:p-7 flex flex-col gap-4"
                    >
                        <div className="relative w-full h-[260px] sm:h-[420px] rounded-xl overflow-hidden">
                            <Canvas
                                key={isMobile ? "mobile" : "desktop"}
                                className="w-full h-full"
                                dpr={[1, 2]}
                                camera={{ fov: 65, position: isMobile ? [0, 0, 10] : [0, 0, 15] }}
                                gl={{ antialias: true, preserveDrawingBuffer: false }}
                            >
                                <Suspense fallback={<CanvasLoader />}>
                                    <ambientLight intensity={0.9} />
                                    <directionalLight position={[6, 8, 5]} intensity={1} castShadow />
                                    <hemisphereLight intensity={0.7} groundColor={"#222"} />

                                    <TechStack
                                        images={planetImages}
                                        orbitRadius={isMobile ? 6.8 : 9.2}
                                        size={isMobile ? 1.0 : 1.2}
                                        spinSpeed={0.8}
                                        orbitSpeed={0.25}
                                    />

                                    <OrbitControls
                                        enableZoom
                                        enablePan={false}
                                        enableDamping
                                        dampingFactor={0.06}
                                        minDistance={4}
                                        maxDistance={25}
                                        minPolarAngle={Math.PI / 2 - deg(90)}
                                        maxPolarAngle={Math.PI / 2 + deg(90)}
                                    />
                                </Suspense>
                            </Canvas>
                        </div>

                        <div className="px-3 flex flex-col gap-2">
                            <p className="text-xl font-semibold text-white">Tech Stack</p>
                            <div className="text-base text-[#afb0b6] leading-relaxed max-w-prose space-y-1.5">
                                <div className="text-base text-[#afb0b6] leading-relaxed max-w-prose space-y-1.5">
                                    <p>
                                        <span
                                            className="font-semibold text-white">Programming Languages:</span> TypeScript,
                                        JavaScript, Python, Java, SQL, HTML5/CSS3, Swift, C, C++.
                                    </p>
                                    <p>
                                        <span className="font-semibold text-white">Frameworks & Libraries:</span> React,
                                        Next.js, Three.js, Redux Toolkit, Node.js, Express, Spring Boot, Vue.js,
                                        Angular, SwiftUI, Bootstrap, Tailwind CSS, Monaco Editor.
                                    </p>
                                    <p>
                                        <span className="font-semibold text-white">Testing & Databases:</span> Jest,
                                        Vitest, React Testing Library, MongoDB, MySQL, PostgreSQL.
                                    </p>
                                    <p>
                                        <span className="font-semibold text-white">Developer Tools:</span> Docker,
                                        CI/CD, Git, Unix/Linux, Postman, Jira, RESTful APIs, AWS Amplify.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;