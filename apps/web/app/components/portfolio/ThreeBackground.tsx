/**
 * ThreeBackground.tsx
 *
 * Interactive 3D background component using Three.js
 * Features: Animated particles, floating geometric shapes, mouse interaction
 *
 * @dependencies three.js
 */

"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeBackgroundProps {
    isDark: boolean;
}

interface SceneRef {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    geometries: THREE.Mesh[];
    rings: THREE.Line[];
}

export default function ThreeBackground({ isDark }: ThreeBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<SceneRef | null>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const frameRef = useRef<number>(0);

    useEffect(() => {
        if (!containerRef.current || sceneRef.current) return;

        // Scene initialization
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0); // keep background transparent for gradient
        renderer.domElement.style.position = "absolute";
        renderer.domElement.style.inset = "0";
        renderer.domElement.style.pointerEvents = "none";
        containerRef.current.appendChild(renderer.domElement);

        // Create particle system
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 3000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 15;
        }

        particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: isDark ? "#67e8f9" : "#38bdf8",
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        // Create floating geometric shapes
        const geometries: THREE.Mesh[] = [];
        const geometryConfigs = [
            {
                geometry: new THREE.TorusGeometry(1, 0.3, 16, 100),
                position: [4, 1, -3] as [number, number, number],
                color: "#4ade80",
            },
            {
                geometry: new THREE.IcosahedronGeometry(0.8, 0),
                position: [-4, 2, -2] as [number, number, number],
                color: "#67e8f9",
            },
            {
                geometry: new THREE.OctahedronGeometry(0.6, 0),
                position: [3, -2, -2] as [number, number, number],
                color: "#a7f3d0",
            },
            {
                geometry: new THREE.TetrahedronGeometry(0.7, 0),
                position: [-3, -1.5, -1.5] as [number, number, number],
                color: "#bef264",
            },
            {
                geometry: new THREE.DodecahedronGeometry(0.5, 0),
                position: [0, 3, -4] as [number, number, number],
                color: "#f59e0b",
            },
            {
                geometry: new THREE.TorusKnotGeometry(0.4, 0.15, 100, 16),
                position: [-2, 0, -3] as [number, number, number],
                color: "#06b6d4",
            },
        ];

        geometryConfigs.forEach(({ geometry, position, color }) => {
            const material = new THREE.MeshBasicMaterial({
                color,
                wireframe: true,
                transparent: true,
                opacity: isDark ? 0.4 : 0.6,
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(position[0], position[1], position[2]);
            scene.add(mesh);
            geometries.push(mesh);
        });

        // Create orbital rings
        const rings: THREE.Line[] = [];
        const ringRadii = [2.5, 3.5, 4.5];
        const ringColors = ["#4ade80", "#7dd3fc", "#f59e0b"];

        ringRadii.forEach((radius, index) => {
            const ringGeometry = new THREE.BufferGeometry();
            const ringPoints: THREE.Vector3[] = [];
            const segments = 128;

            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;
                ringPoints.push(new THREE.Vector3(
                    Math.cos(theta) * radius,
                    Math.sin(theta) * radius * 0.3,
                    Math.sin(theta) * radius * 0.5,
                ));
            }

            ringGeometry.setFromPoints(ringPoints);
            const ringMaterial = new THREE.LineBasicMaterial({
                color: ringColors[index],
                transparent: true,
                opacity: 0.2,
            });
            const ring = new THREE.Line(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 4 + index * 0.2;
            scene.add(ring);
            rings.push(ring);
        });

        camera.position.z = 5;

        sceneRef.current = { scene, camera, renderer, particles, geometries, rings };

        // Mouse movement handler
        const handleMouseMove = (event: MouseEvent) => {
            mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener("mousemove", handleMouseMove);

        // Animation loop
        let time = 0;
        const particlesCount2 = particlesCount;
        const animate = () => {
            frameRef.current = requestAnimationFrame(animate);
            time += 0.01;

            if (!sceneRef.current) return;

            const {
                particles: particlesRef,
                geometries: geometriesRef,
                rings: ringsRef,
                camera: cameraRef,
                scene: sceneRefValue,
                renderer: rendererRef,
            } = sceneRef.current;

            // Animate particles with wave motion
            const positionAttribute = particlesRef.geometry.getAttribute("position");
            if (!(positionAttribute instanceof THREE.BufferAttribute)) return;

            const positions = positionAttribute.array as Float32Array;
            for (let i = 0; i < particlesCount2; i++) {
                const i3 = i * 3;
                const yIndex = i3 + 1;
                const baseX = positions[i3];
                const baseY = positions[yIndex];
                if (baseX === undefined || baseY === undefined) continue;

                positions[yIndex] = baseY + Math.sin(time + baseX) * 0.001;
            }
            positionAttribute.needsUpdate = true;

            particlesRef.rotation.y += 0.0003;
            particlesRef.rotation.x += 0.0001;

            // Animate geometric shapes
            geometriesRef.forEach((mesh, index) => {
                mesh.rotation.x += 0.003 + index * 0.001;
                mesh.rotation.y += 0.004 + index * 0.001;
                mesh.rotation.z += 0.002;
                mesh.position.y += Math.sin(time + index) * 0.002;
            });

            // Animate rings
            ringsRef.forEach((ring, index) => {
                ring.rotation.z += 0.001 * (index + 1);
                ring.rotation.y += 0.0005;
            });

            // Smooth camera follow mouse
            cameraRef.position.x += (mouseRef.current.x * 0.5 - cameraRef.position.x) * 0.03;
            cameraRef.position.y += (mouseRef.current.y * 0.5 - cameraRef.position.y) * 0.03;
            cameraRef.lookAt(sceneRefValue.position);

            rendererRef.render(sceneRefValue, cameraRef);
        };

        animate();

        // Resize handler
        const handleResize = () => {
            if (!sceneRef.current) return;
            const { camera: cameraRef, renderer: rendererRef } = sceneRef.current;
            cameraRef.aspect = window.innerWidth / window.innerHeight;
            cameraRef.updateProjectionMatrix();
            rendererRef.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(frameRef.current);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            sceneRef.current = null;
        };
    }, []);

    // Update colors when theme changes
    useEffect(() => {
        if (!sceneRef.current) return;

        const { particles, geometries } = sceneRef.current;

        // Update particle color
        if (particles.material instanceof THREE.PointsMaterial) {
            particles.material.color.set(isDark ? "#67e8f9" : "#38bdf8");
        }

        // Update geometry opacity
        geometries.forEach((mesh) => {
            if (mesh.material instanceof THREE.MeshBasicMaterial) {
                mesh.material.opacity = isDark ? 0.4 : 0.6;
            }
        });
    }, [isDark]);

    const bgGradient = isDark
        ? {
            backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(103, 232, 249, 0.22), transparent 35%)," +
                "radial-gradient(circle at 80% 30%, rgba(74, 222, 128, 0.16), transparent 32%)," +
                "linear-gradient(140deg, #05070f 0%, #0b1024 45%, #060913 100%)",
        }
        : {
            backgroundImage:
                "radial-gradient(circle at 25% 25%, rgba(74, 222, 128, 0.18), transparent 35%)," +
                "radial-gradient(circle at 80% 20%, rgba(125, 211, 252, 0.18), transparent 30%)," +
                "linear-gradient(135deg, #f7faff 0%, #e7eeff 40%, #fdfdff 100%)",
        };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-0 pointer-events-none transition-colors duration-700"
            style={bgGradient}
        />
    );
}
