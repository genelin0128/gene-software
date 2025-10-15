"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.enablePan = true;

        const geometry = new THREE.DodecahedronGeometry();
        const material = new THREE.MeshLambertMaterial({ color: "#468585", emissive: "#468585" });
        const dodecahedron = new THREE.Mesh(geometry, material);

        const plane = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.1, 2),
            new THREE.MeshStandardMaterial({ color: "#B4B4B3", emissive: "#B4B4B3" }),
        );
        plane.position.y = -1.5;

        scene.add(dodecahedron);
        scene.add(plane);
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const light = new THREE.SpotLight(0x006769, 100);
        light.position.set(1, 1, 1);
        scene.add(light);

        let raf = 0;
        let interacting = false;
        controls.addEventListener("start", () => (interacting = true));
        controls.addEventListener("end", () => (interacting = false));
        const animate = () => {
            if (!interacting) {
                dodecahedron.rotation.x += 0.01;
                dodecahedron.rotation.y += 0.01;
                plane.rotation.y += 0.01;
            }

            controls.update();
            renderer.render(scene, camera);
            raf = requestAnimationFrame(animate);
        };
        animate();

        const onResize = () => {
            const { clientWidth, clientHeight } = mount;
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(clientWidth, clientHeight);
        };
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(raf);
            controls.dispose();
            window.removeEventListener("resize", onResize);
            mount.removeChild(renderer.domElement);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ width: "100%", height: "60vh", borderRadius: 12, overflow: "hidden" }} />;
}
