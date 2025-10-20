"use client";

/**
 * Reusable GSAP animation effects for Custom3DModel.
 * Each function matches the signature expected by <Custom3DModel animate={...} />.
 */

import React from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export type AnimateFn = (ctx: {
    ref: React.RefObject<THREE.Group>;
    gsap: typeof gsap;
}) => gsap.core.Timeline | void;

/** HTML: page flip + gentle vertical drift */
export const html: AnimateFn = ({ ref, gsap }) => {
    const tl = gsap.timeline();
    tl.to(ref.current!.rotation, {
        y: "+=" + Math.PI * 2,
        duration: 6,
        ease: "none",
        repeat: -1,
    });
    tl.to(
        ref.current!.position,
        {
            y: "+=0.02",
            duration: 2.6,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
        },
        0,
    );
    return tl;
};

/** CSS: styling wiggle (roll + pitch) + horizontal reflow */
export const css: AnimateFn = ({ ref, gsap }) => {
    const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });
    tl.to(ref.current!.rotation, {
        z: "+=0.35",
        duration: 2.4,
        yoyo: true,
        repeat: -1,
    });
    tl.to(
        ref.current!.rotation,
        {
            x: "+=0.18",
            duration: 3.2,
            yoyo: true,
            repeat: -1,
        },
        0,
    );
    tl.to(
        ref.current!.position,
        {
            x: "+=0.25",
            duration: 3.2,
            yoyo: true,
            repeat: -1,
        },
        0,
    );
    return tl;
};

/** JavaScript: energetic 3-axis tumble + small buoyancy */
export const javaScript: AnimateFn = ({ ref, gsap }) => {
    const tl = gsap.timeline();
    tl.to(ref.current!.rotation, {
        x: "+=" + Math.PI * 2,
        duration: 5.5,
        ease: "none",
        repeat: -1,
    });
    tl.to(
        ref.current!.rotation,
        {
            y: "+=" + Math.PI * 2,
            duration: 7.2,
            ease: "none",
            repeat: -1,
        },
        0,
    );
    tl.to(
        ref.current!.rotation,
        {
            z: "+=" + Math.PI * 2,
            duration: 9.0,
            ease: "none",
            repeat: -1,
        },
        0,
    );
    tl.to(
        ref.current!.position,
        {
            y: "+=0.012",
            duration: 2.0,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
        },
        0,
    );
    return tl;
};

/** React: atomic yaw + breathing scale */
export const react: AnimateFn = ({ ref, gsap }) => {
    const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });
    tl.to(ref.current!.rotation, {
        y: "+=" + Math.PI * 2,
        duration: 10,
        ease: "none",
        repeat: -1,
    });
    tl.to(
        ref.current!.scale,
        {
            x: "+=0.06",
            y: "+=0.06",
            z: "+=0.06",
            duration: 2.4,
            yoyo: true,
            repeat: -1,
        },
        0,
    );
    return tl;
};

/** C: coin flip + tight deterministic drift */
export const c: AnimateFn = ({ ref, gsap }) => {
    const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });
    tl.to(ref.current!.rotation, {
        x: "+=" + Math.PI * 2,
        duration: 6,
        ease: "none",
        repeat: -1,
    });
    tl.to(
        ref.current!.position,
        {
            x: "+=0.18",
            duration: 1.0,
            yoyo: true,
            repeat: -1,
        },
        0,
    );
    tl.to(
        ref.current!.position,
        {
            z: "+=0.18",
            duration: 1.0,
            yoyo: true,
            repeat: -1,
        },
        0.5,
    );
    return tl;
};

/** Java: steam swirl (rise + yaw waft + slight forward/back) */
export const java: AnimateFn = ({ ref, gsap }) => {
    const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });
    tl.to(ref.current!.position, {
        y: "+=0.02",
        duration: 2.6,
        yoyo: true,
        repeat: -1,
    });
    tl.to(
        ref.current!.rotation,
        {
            y: "+=0.22",
            duration: 3.4,
            yoyo: true,
            repeat: -1,
        },
        0,
    );
    tl.to(
        ref.current!.position,
        {
            z: "+=0.18",
            duration: 3.0,
            yoyo: true,
            repeat: -1,
        },
        0,
    );
    return tl;
};

/** three.js: clean axial Z-spin + small hover */
export const threejs: AnimateFn = ({ ref, gsap }) => {
    const tl = gsap.timeline();
    tl.to(ref.current!.rotation, {
        z: "+=" + Math.PI * 2,
        duration: 6,
        ease: "none",
        repeat: -1,
    });
    tl.to(
        ref.current!.position,
        {
            y: "+=0.014",
            duration: 2.4,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
        },
        0,
    );
    return tl;
};

/** GitHub: bounce-in like a PR + nod + slow lateral drift */
export const github: AnimateFn = ({ ref, gsap }) => {
    const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });
    tl.from(ref.current!.position, {
        z: "+=1.2",
        duration: 0.8,
        ease: "back.out(1.7)",
    });
    tl.to(ref.current!.position, {
        x: "+=0.25",
        duration: 5,
        yoyo: true,
        repeat: -1,
    });
    tl.to(
        ref.current!.rotation,
        {
            x: "+=0.12",
            duration: 3.2,
            yoyo: true,
            repeat: -1,
        },
        0.6,
    );
    return tl;
};

/** Swift: bird-like figure-8 glide + slight yaw */
export const swift: AnimateFn = ({ ref, gsap }) => {
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut" } });
    tl.to(ref.current!.position, {
        x: "+=0.35",
        y: "+=0.06",
        duration: 1.4,
    });
    tl.to(ref.current!.position, {
        x: "-=0.35",
        y: "+=0.06",
        duration: 1.4,
    });
    tl.to(ref.current!.position, {
        x: "-=0.35",
        y: "-=0.06",
        duration: 1.4,
    });
    tl.to(ref.current!.position, {
        x: "+=0.35",
        y: "-=0.06",
        duration: 1.4,
    });
    tl.to(
        ref.current!.rotation,
        {
            y: "+=0.25",
            duration: 3.2,
            yoyo: true,
            repeat: -1,
        },
        0,
    );
    return tl;
};

/** Docker: ship bobbing (roll + pitch) + buoyant up/down */
export const docker: AnimateFn = ({ ref, gsap }) => {
    const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });
    tl.to(ref.current!.rotation, {
        z: "+=0.15",
        duration: 2.8,
        yoyo: true,
        repeat: -1,
    });
    tl.to(
        ref.current!.rotation,
        {
            x: "+=0.1",
            duration: 3.2,
            yoyo: true,
            repeat: -1,
        },
        0,
    );
    tl.to(
        ref.current!.position,
        {
            y: "+=0.015",
            duration: 2.6,
            yoyo: true,
            repeat: -1,
        },
        0,
    );
    return tl;
};

/** PostgreSQL: elephant nod + curious peek forward/back */
export const postgreSQL: AnimateFn = ({ ref, gsap }) => {
    const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });
    tl.to(ref.current!.rotation, {
        x: "+=0.12",
        duration: 1.2,
        yoyo: true,
        repeat: -1,
    });
    tl.to(
        ref.current!.position,
        {
            z: "+=0.25",
            duration: 1.2,
            yoyo: true,
            repeat: -1,
        },
        0,
    );
    return tl;
};

/** Tailwind: flowing current (x drift) + slow continuous spin */
export const tailwindcss: AnimateFn = ({ ref, gsap }) => {
    const tl = gsap.timeline();
    tl.to(ref.current!.position, {
        x: "+=0.30",
        duration: 2.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
    });
    tl.to(
        ref.current!.rotation,
        {
            y: "+=" + Math.PI * 2,
            duration: 10,
            ease: "none",
            repeat: -1,
        },
        0,
    );
    return tl;
};

/** MongoDB: leaf sprout (pulsing growth) + gentle rise/fall */
export const mongoDB: AnimateFn = ({ ref, gsap }) => {
    const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });
    tl.to(ref.current!.scale, {
        x: "+=0.06",
        y: "+=0.06",
        z: "+=0.06",
        duration: 2.2,
        yoyo: true,
        repeat: -1,
    });
    tl.to(
        ref.current!.position,
        {
            y: "+=0.018",
            duration: 2.2,
            yoyo: true,
            repeat: -1,
        },
        0,
    );
    return tl;
};
