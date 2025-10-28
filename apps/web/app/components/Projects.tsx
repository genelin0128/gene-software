import Image from "next/image";
import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls } from "@react-three/drei";
import CanvasLoader from "@/app/components/CanvasLoader";
import DemoiMac from "@/app/components/DemoiMac";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Project = {
    title: string;
    desc: string;
    subdesc: string;
    href: string;
    texture: string;
    logo: string;
    logoStyle: { backgroundColor: string; border: string; boxShadow: string };
    spotlight: string;
    tags: { id: number; name: string; path: string }[];
};

const myProjects: [Project, ...Project[]] = [
    {
        title: "Cardz",
        desc: "An Instagram-style social app where people follow each other and share posts rendered as compact 'cards'. The feed shows updates from followed accounts and supports in-line upvotes and comments.",
        subdesc: "React + Tailwind front end with a Node.js/Express API on MongoDB (deployed to Heroku). Includes Google Sign-In, follow/unfollow, CRUD for posts, and instant UI feedback for upvotes and comments.",
        href: "https://cardz.surge.sh/",
        texture: "/projects/cardz/cardz.mov",
        logo: "/projects/cardz/cardz-logo.png",
        logoStyle: {
            backgroundColor: "#13202F",
            border: "0.2px solid #17293E",
            boxShadow: "0px 0px 60px 0px #2F6DB54D",
        },
        spotlight: "/projects/spotlights/spotlight1.png",
        tags: [
            {
                id: 1,
                name: "React.js",
                path: "/projects/techstacks-logo/react.png",
            },
            {
                id: 2,
                name: "TailwindCSS",
                path: "/projects/techstacks-logo/tailwindcss.png",
            },
            {
                id: 3,
                name: "Bootstrap",
                path: "/projects/techstacks-logo/bootstrap.png",
            },
            {
                id: 4,
                name: "JavaScript",
                path: "/projects/techstacks-logo/javascript.png",
            },
            {
                id: 5,
                name: "MongoDB",
                path: "/projects/techstacks-logo/mongodb.png",
            },
            {
                id: 6,
                name: "NodeJS",
                path: "/projects/techstacks-logo/nodejs.png",
            },
        ],
    },
    {
        title: "Baccarat",
        desc: "A browser-based baccarat game with a smooth, responsive UI and authentic squeeze-style reveals. Each deal tallies hand totals in real time and shows banker/player/tie outcomes.",
        subdesc: "Built with HTML, CSS, and JavaScript. Features a squeeze reveal, next-card odds display, and an optional mode to swap unrevealed cards—useful for showcasing state handling and game logic.",
        href: "https://baccaratdevelopedbygene.surge.sh/",
        texture: "/projects/baccarat/baccarat.mov",
        logo: "/projects/baccarat/baccarat-logo.png",
        logoStyle: {
            backgroundColor: "#2A1816",
            border: "0.2px solid #36201D",
            boxShadow: "0px 0px 60px 0px #AA3C304D",
        },
        spotlight: "/projects/spotlights/spotlight1.png",
        tags: [
            {
                id: 1,
                name: "HTML.js",
                path: "/projects/techstacks-logo/html.png",
            },
            {
                id: 2,
                name: "CSS",
                path: "/projects/techstacks-logo/css.png",
            },
            {
                id: 3,
                name: "JavaScript",
                path: "/projects/techstacks-logo/javascript.png",
            },
        ],
    },
];

const Projects = () => {

    const deg = (d: number) => (d * Math.PI) / 180;

    const projectsCount = myProjects.length;

    const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

    useGSAP(() => {
        gsap.fromTo(`.animatedText`, { opacity: 0 }, { opacity: 1, duration: 1, stagger: 0.2, ease: "power2.inOut" });
    }, [selectedProjectIndex]);

    const currentProject = myProjects[selectedProjectIndex]!;

    const handleNavigation = (direction: "previous" | "next") => {
        setSelectedProjectIndex((prevIndex) => {
            if (direction === "previous") {
                return prevIndex === 0 ? projectsCount - 1 : prevIndex - 1;
            } else {
                return prevIndex === projectsCount - 1 ? 0 : prevIndex + 1;
            }
        });
    };

    return (
        <section className="my-5">
            <p className="sm:text-4xl text-3xl font-semibold mb-5">
                My Work
            </p>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-3 w-full">
                <div
                    className="flex flex-col gap-3 border-[#e3fffc] bg-[#e3fffc] relative sm:p-8 p-5 shadow-2xl shadow-black-200 rounded-lg"
                >
                    <div className="absolute top-0 right-0 z-0 pointer-events-none">
                        <Image
                            src={currentProject.spotlight}
                            alt="spotlight"
                            width={1920}
                            height={384}
                            className="w-full h-96 object-cover rounded-xl"
                        />
                    </div>
                    <div
                        className="p-3 backdrop-filter backdrop-blur-3xl w-fit rounded-lg"
                        style={currentProject.logoStyle}
                    >
                        <Image
                            src={currentProject.logo}
                            alt="logo"
                            width={1920}
                            height={384}
                            className="w-10 h-10 shadow-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-5 text-white-600 my-2">
                        <p className="text-black text-2xl font-semibold animatedText">
                            {currentProject.title}
                        </p>
                        <p className="animatedText">
                            {currentProject.desc}
                        </p>
                        <p className="animatedText">
                            {currentProject.subdesc}
                        </p>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-5">
                        <div className="flex items-center gap-3">
                            {currentProject.tags.map((tag, index) => (
                                <div key={index}
                                     className="w-10 h-10 rounded-lg bg-neutral-100 bg-opacity-10 backdrop-filter backdrop-blur-lg flex justify-center items-center"
                                >
                                    <Image
                                        src={tag.path}
                                        alt={tag.name}
                                        width={1920}
                                        height={1920}
                                        className="shadow-sm rounded-lg "
                                    />
                                </div>
                            ))}
                        </div>
                        <a
                            className="flex items-center gap-2 cursor-pointer text-black-600"
                            href={currentProject.href}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <p>
                                Check Live Site
                            </p>
                            <Image
                                src="/images/arrow-up.png"
                                alt="arrow-up"
                                width={500}
                                height={500}
                                className="w-3 h-3"
                            />
                        </a>
                    </div>
                    <div className="flex justify-between items-center mt-7">
                        <button
                            className="w-10 h-10 p-3 cursor-pointer active:scale-95 transition-all rounded-full bg-black"
                            onClick={() => handleNavigation("previous")}
                        >
                            <Image
                                src="/images/left-arrow.png"
                                alt="left-arrow"
                                width={500}
                                height={500}
                                className="w-4 h-4"
                            />
                        </button>
                        <button
                            className="w-10 h-10 p-3 cursor-pointer active:scale-95 transition-all rounded-full bg-black"
                            onClick={() => handleNavigation("next")}
                        >
                            <Image
                                src="/images/right-arrow.png"
                                alt="right-arrow"
                                width={500}
                                height={500}
                                className="w-4 h-4"
                            />
                        </button>
                    </div>
                </div>

                <div className="border border-black-300 bg-black-200 rounded-lg h-96 md:h-full">
                    <Canvas>
                        <ambientLight intensity={Math.PI} />
                        <directionalLight position={[10, 10, 5]} />
                        <Center>
                            <Suspense fallback={<CanvasLoader />}>
                                <group scale={0.001} position={[0, -1.4, 0]} rotation={[0, -0.1, 0]}>
                                    <DemoiMac
                                        texture={currentProject.texture}
                                    />
                                </group>
                                <OrbitControls
                                    enableZoom
                                    enablePan
                                    enableDamping
                                    dampingFactor={0.06}
                                    minDistance={1}
                                    maxDistance={10}
                                    minPolarAngle={Math.PI / 2 - deg(90)}
                                    maxPolarAngle={Math.PI / 2 + deg(90)}
                                />
                            </Suspense>
                        </Center>
                    </Canvas>
                </div>
            </div>
        </section>
    );
};

export default Projects;