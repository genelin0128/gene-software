"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeScene() {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const mount = mountRef.current!;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xF0F0F0);

        const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 5);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        const geo = new THREE.DodecahedronGeometry();
        const mat = new THREE.MeshStandardMaterial({ color: "#468585", metalness: 0.2, roughness: 0.6 });
        const mesh = new THREE.Mesh(geo, mat);

        const plane = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.1, 2),
            new THREE.MeshStandardMaterial({ color: "#B4B4B3", roughness: 0.9 }),
        );
        plane.position.y = -1.5;

        scene.add(mesh, plane);
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const spot = new THREE.SpotLight(0x006769, 1.2);
        spot.position.set(1, 2, 2);
        scene.add(spot);

        let raf = 0;
        const loop = () => {
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.01;
            renderer.render(scene, camera);
            raf = requestAnimationFrame(loop);
        };
        loop();

        const onResize = () => {
            const { clientWidth, clientHeight } = mount;
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(clientWidth, clientHeight);
        };
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
            mount.removeChild(renderer.domElement);
            renderer.dispose();
            geo.dispose();
            mat.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ width: "100%", height: "60vh", borderRadius: 12, overflow: "hidden" }} />;
}
