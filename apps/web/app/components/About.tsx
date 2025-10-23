"use client";

import React, { Suspense, useMemo } from "react";
import CanvasLoader from "@/app/components/CanvasLoader";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";
import TechStack from "@/app/components/TechStack";
import Custom3DModel from "@/app/components/Custom3DModel";

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
            <div className="grid gap-3 grid-cols-1 lg:grid-cols-7 md:grid-cols-4 lg:grid-rows-2 md:grid-rows-3 h-full">

                {/* Me */}
                <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 md:col-span-2">
                    <div
                        className="w-full h-full border border-[#565a5e] bg-[#565a5e] rounded-lg p-2 sm:p-4 flex flex-col gap-3"
                    >
                        <div className="relative w-full h-[260px] sm:h-[300px] rounded-xl overflow-hidden">
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
                            <p className="text-base text-[#afb0b6] leading-relaxed">
                                I’m a Master of Computer Science candidate at Rice University graduating December 2025.
                                I focus on modern web development with TypeScript, React, and Next.js, and I use Node
                                for APIs. Recently I’ve been exploring Three.js for interactive 3D on the web. I’m also
                                a poker enthusiast and I’m building a small Texas Hold’em app; stay tuned for progress
                                updates.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Education */}
                <div className="lg:col-span-2  lg:row-start-1  md:col-span-2">
                    <div
                        className="w-full h-full border border-[#565a5e] bg-[#565a5e] rounded-lg p-2 sm:p-4 flex flex-col gap-3"
                    >
                        <div className="relative w-full h-[260px] sm:h-[300px] rounded-xl overflow-hidden">
                            <Canvas
                                key={isMobile ? "mobile" : "desktop"}
                                className="w-full h-full"
                                dpr={[1, 2]}
                                camera={{ fov: 65, position: isMobile ? [0, 0, 10] : [0, 0, 15] }}
                                gl={{ antialias: true, preserveDrawingBuffer: false }}
                            >
                                <Suspense fallback={<CanvasLoader />}>
                                    <ambientLight intensity={4.0} />
                                    <directionalLight position={[6, 8, 5]} intensity={1} castShadow />
                                    <hemisphereLight intensity={0.7} groundColor={"#222"} />

                                    <Custom3DModel
                                        model="/models/classroom.glb"
                                        position={isMobile ? [-10, -50, -30] : [0, -55, -30]}
                                        rotation={[0, deg(180), 0]}
                                        scale={isMobile ? 0.45 : 0.6}
                                        animateDeps={[isMobile]}
                                    />

                                    <OrbitControls
                                        enableZoom
                                        enablePan={false}
                                        enableDamping
                                        dampingFactor={0.06}
                                        minDistance={4}
                                        maxDistance={50}
                                        minPolarAngle={Math.PI / 2}
                                        maxPolarAngle={Math.PI / 2}
                                    />
                                </Suspense>
                            </Canvas>
                        </div>

                        <div className="px-3 flex flex-col gap-2">
                            <p className="text-xl font-semibold text-white">Education</p>
                            <div className="text-base text-[#afb0b6] leading-relaxed space-y-1.5">
                                <p>
                                    <span className="font-semibold text-white">Rice University</span> <br />
                                    Master of Computer Science, December 2025, Houston, TX
                                </p>
                                <p>
                                    <span className="font-semibold text-white">Feng Chia University</span> <br />
                                    Bachelor of Information Engineering &amp; Computer Science, June 2024, Taichung,
                                    Taiwan
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Work Experience */}
                <div className="lg:col-span-3 lg:row-start-1 lg:row-span-2 md:col-span-4">
                    <div
                        className="w-full h-full border border-[#565a5e] bg-[#565a5e] rounded-lg p-2 sm:p-4 flex flex-col gap-3"
                    >
                        <div className="relative w-full h-[260px] sm:h-[300px] rounded-xl overflow-hidden">
                            <Canvas
                                key={isMobile ? "mobile" : "desktop"}
                                className="w-full h-full"
                                dpr={[1, 2]}
                                camera={{ fov: 60, position: isMobile ? [0, 0, 8] : [0, 0, 9] }}
                                gl={{ antialias: true, preserveDrawingBuffer: false }}
                            >
                                <Suspense fallback={<CanvasLoader />}>
                                    <ambientLight intensity={4.0} />
                                    <directionalLight position={[6, 8, 5]} intensity={1} castShadow />
                                    <hemisphereLight intensity={0.7} groundColor={"#222"} />

                                    <Custom3DModel
                                        model="/models/work.glb"
                                        position={isMobile ? [0, -2, 3] : [0, -2, 0]}
                                        rotation={[0, deg(230), 0]}
                                        scale={isMobile ? 0.45 : 0.6}
                                        animateDeps={[isMobile]}
                                    />

                                    <OrbitControls
                                        enableZoom
                                        enablePan={false}
                                        enableDamping
                                        dampingFactor={0.06}
                                        minDistance={3}
                                        maxDistance={13}
                                        minPolarAngle={Math.PI / 2}
                                        maxPolarAngle={Math.PI / 2}
                                    />
                                </Suspense>
                            </Canvas>
                        </div>

                        <div className="px-3 flex flex-col gap-2">
                            <p className="text-xl font-semibold text-white">Work Experience</p>
                            <div className="text-base text-[#afb0b6] leading-relaxed space-y-1.5">
                                {/* Paycom */}
                                <div>
                                    {/* Row 1: Company */}
                                    <p><span className="font-semibold text-white">Paycom</span></p>

                                    {/* Row 2: Role */}
                                    <p className="text-white font-medium">Software Development Intern</p>

                                    {/* Row 3: Tech */}
                                    <p>Tech: React, TypeScript, Next.js, Redux Toolkit, Docker</p>

                                    {/* Row 4: Work bullets */}
                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                        <li>Built an internal UI Playroom used by software engineers and UI/UX
                                            designers. It lets non-technical teammates drag and drop from a component
                                            gallery onto a canvas and sketch screens without writing code; a Monaco
                                            editor is there when they need it.
                                        </li>
                                        <li>Profiled the load and render path and trimmed work on startup, cutting
                                            initial load by about 45 percent. Teams share stable demo links to review
                                            changes together and make decisions faster.
                                        </li>
                                    </ul>
                                </div>

                                {/* SXB Liberal Arts & Science Tutoring Center */}
                                <div>
                                    {/* Row 1: Company */}
                                    <p><span className="font-semibold text-white">SXB Liberal Arts &amp; Science Tutoring Center</span>
                                    </p>

                                    {/* Row 2: Role */}
                                    <p className="text-white font-medium">Software Engineer Intern</p>

                                    {/* Row 3: Tech */}
                                    <p>Tech: Python, SQL, Vue.js, HTML/CSS, JavaScript, MySQL</p>

                                    {/* Row 4: Work bullets (two items) */}
                                    <ul className="list-disc pl-5 mt-1 space-y-1">
                                        <li>Built an in-house billing & reconciliation system on MySQL that automated
                                            invoices and payment tracking, cutting manual work and reducing operating
                                            costs by ~15%.
                                        </li>
                                        <li>Designed a normalized schema and Python ETL to migrate legacy data, and
                                            delivered Vue.js admin views with RESTful endpoints (parameterized SQL) to
                                            improve accuracy and auditability.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="lg:col-span-4 lg:col-start-1 lg:row-start-2 md:col-span-4">
                    <div
                        className="w-full h-full border border-[#565a5e] bg-[#565a5e] rounded-lg p-2 sm:p-4 flex flex-col gap-3"
                    >
                        <div className="relative w-full h-[260px] sm:h-[300px] rounded-xl overflow-hidden">
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
                            <div className="text-base text-[#afb0b6] leading-relaxed space-y-1.5">
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
        </section>
    );
};

export default About;