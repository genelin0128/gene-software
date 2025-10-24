import Image from "next/image";
import React from "react";

// const myProjects = [
//     {
//         title: "Baccarat",
//         desc: "Baccarat description",
//         subdesc: "Baccarat subdescription",
//         href: "https://baccaratdevelopedbygene.surge.sh/",
//         texture: "/textures/project/project1.mp4",
//         logo: "/assets/project-logo1.png",
//         logoStyle: {
//             backgroundColor: "#2A1816",
//             border: "0.2px solid #36201D",
//             boxShadow: "0px 0px 60px 0px #AA3C304D",
//         },
//         spotlight: "/assets/spotlight1.png",
//         tags: [
//             {
//                 id: 1,
//                 name: "React.js",
//                 path: "/assets/react.svg",
//             },
//             {
//                 id: 2,
//                 name: "TailwindCSS",
//                 path: "assets/tailwindcss.png",
//             },
//             {
//                 id: 3,
//                 name: "TypeScript",
//                 path: "/assets/typescript.png",
//             },
//             {
//                 id: 4,
//                 name: "Framer Motion",
//                 path: "/assets/framer.png",
//             },
//         ],
//     },
//     {
//         title: "LiveDoc - Real-Time Google Docs Clone",
//         desc: "LiveDoc is a powerful collaborative app that elevates the capabilities of real-time document editing. As an enhanced version of Google Docs, It supports millions of collaborators simultaneously, ensuring that every change is captured instantly and accurately.",
//         subdesc:
//             "With LiveDoc, users can experience the future of collaboration, where multiple contributors work together in real time without any lag, by using Next.js and Liveblocks newest features.",
//         href: "https://www.youtube.com/watch?v=y5vE8y_f_OM",
//         texture: "/textures/project/project2.mp4",
//         logo: "/assets/project-logo2.png",
//         logoStyle: {
//             backgroundColor: "#13202F",
//             border: "0.2px solid #17293E",
//             boxShadow: "0px 0px 60px 0px #2F6DB54D",
//         },
//         spotlight: "/assets/spotlight2.png",
//         tags: [
//             {
//                 id: 1,
//                 name: "React.js",
//                 path: "/assets/react.svg",
//             },
//             {
//                 id: 2,
//                 name: "TailwindCSS",
//                 path: "assets/tailwindcss.png",
//             },
//             {
//                 id: 3,
//                 name: "TypeScript",
//                 path: "/assets/typescript.png",
//             },
//             {
//                 id: 4,
//                 name: "Framer Motion",
//                 path: "/assets/framer.png",
//             },
//         ],
//     },
// ];

const Projects = () => {
    return (
        <section className="md:px-2 px-1 my-5">
            <p className="sm:text-4xl text-3xl font-semibold text-gray_gradient">
                My Work
            </p>
            <div className="grid lg:grid-cols-2 grid-cols-1 mt-4 gap-5 w-full px-3">
                <div className="flex flex-col gap-5 relative sm:p-10 py-10 px-5 shadow-2xl shadow-black-200">
                    <Image
                        src="/images/background.jpeg"
                        alt="background"
                        width={1920}
                        height={384}
                        className="w-full h-96 object-cover rounded-xl"
                    />
                </div>
            </div>
        </section>
    );
};

export default Projects;