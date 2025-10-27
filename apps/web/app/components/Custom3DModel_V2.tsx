"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Vec3 = [number, number, number];

type Props = {
    /** GLB path (e.g. "/models/3D_Computer.glb") */
    model: string;
    position?: Vec3;
    rotation?: Vec3;
    scale?: number | Vec3;

    /** Optional GSAP animation hook (相容你現有的 V1) */
    animate?: (ctx: { ref: React.RefObject<THREE.Group>; gsap: typeof gsap }) => gsap.core.Timeline | void;
    /** Re-run animate when these deps change */
    animateDeps?: ReadonlyArray<unknown>;

    /** 影片相對 /public 的路徑，例如 "/projects/cardz/cardz.mp4" */
    videoSrc: string;

    /** 指定螢幕 mesh 名稱；若不填，會自動找第一個符合 /^Screen\\d+_animation_0$/ 的 mesh */
    screenMeshName?: string;
} & Omit<ThreeElements["group"], "position" | "rotation" | "scale">;

export default function Custom3DModel_V2({
                                             model,
                                             position = [0, 0, 0],
                                             rotation = [0, 0, 0],
                                             scale = 1,
                                             animate,
                                             animateDeps = [],
                                             videoSrc,
                                             screenMeshName,
                                             ...groupProps
                                         }: Props) {
    const { scene } = useGLTF(model);
    const groupRef = useRef<THREE.Group>(null!);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const textureRef = useRef<THREE.VideoTexture | null>(null);

    // 建立 <video>（僅一次）
    useMemo(() => {
        const video = document.createElement("video");
        video.src = videoSrc;
        video.loop = true;
        video.muted = true;       // 為自動播放政策
        video.playsInline = true; // iOS
        video.crossOrigin = "anonymous";
        videoRef.current = video;

        return () => {
            video.pause();
            video.src = "";
            videoRef.current = null;
        };
    }, [videoSrc]);

    // 嘗試自動播放
    useEffect(() => {
        videoRef.current?.play().catch(() => {
            // 若被阻擋，等待使用者互動後在外部手動 play() 即可
        });
    }, []);

    // 建立 VideoTexture
    useEffect(() => {
        if (!videoRef.current) return;

        const tex = new THREE.VideoTexture(videoRef.current);
        // three r152+：用 colorSpace，不要用 encoding
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.flipY = false;

        textureRef.current = tex;

        return () => {
            tex.dispose();
            textureRef.current = null;
        };
    }, [videoSrc]);

    // GSAP 動畫（與 V1 相容）
    useGSAP(
        () => {
            if (!animate) return;
            const tl = animate({ ref: groupRef, gsap });
            return () => tl?.kill();
        },
        { scope: groupRef, dependencies: animateDeps ? [...animateDeps] : undefined },
    );

    // 載入後：找到螢幕 mesh 並覆寫材質的 map
    useEffect(() => {
        if (!scene || !textureRef.current) return;

        const findScreenMesh = (): THREE.Mesh | undefined => {
            if (screenMeshName) {
                const obj = scene.getObjectByName(screenMeshName);
                return obj && (obj as any).isMesh ? (obj as THREE.Mesh) : undefined;
            }
            let found: THREE.Mesh | undefined;
            scene.traverse((o) => {
                if (!found && (o as any).isMesh && /^Screen\d+_animation_0$/.test(o.name)) {
                    found = o as THREE.Mesh;
                }
            });
            return found;
        };

        const target = findScreenMesh();
        if (!target) {
            console.warn("[Custom3DModel_V2] Screen mesh not found. Provide `screenMeshName`?");
            return;
        }

        const originalMat = target.material as THREE.MeshStandardMaterial;
        const mat = originalMat.clone();
        mat.map = textureRef.current!;
        // 想做自發光螢幕可開下面三行：
        // mat.emissive = new THREE.Color(0xffffff);
        // mat.emissiveMap = textureRef.current!;
        // mat.emissiveIntensity = 0.25;

        mat.needsUpdate = true;
        target.material = mat;

        // 不主動 dispose mat，讓 three 在場景卸載時回收
    }, [scene, screenMeshName]);

    return (
        <group ref={groupRef} position={position} rotation={rotation} scale={scale} {...groupProps}>
            <primitive object={scene} />
        </group>
    );
}
