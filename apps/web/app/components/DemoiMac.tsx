"use client";

import React, { JSX, useEffect, useRef } from "react";
import { useGLTF, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type MeshWithGeom = THREE.Mesh & { geometry: THREE.BufferGeometry };

type GLTFStuff = {
    nodes: Record<string, MeshWithGeom>;
    materials: Record<string, THREE.Material>;
    animations: THREE.AnimationClip[];
};

type Props = JSX.IntrinsicElements["group"] & {
    texture?: string;
};

const DemoiMac = (props: Props) => {
    const group = useRef<THREE.Group>(null!);
    const { nodes, materials } = useGLTF("/models/imac.glb") as unknown as GLTFStuff;


    const txt = useVideoTexture(props.texture ? props.texture : "projects/cardz/cardz.mov", {
        muted: true,
        loop: true,
        start: true,
        crossOrigin: "anonymous",
    });

    useGSAP(() => {
        gsap.from(group.current.rotation, {
            y: Math.PI / 2,
            duration: 1,
            ease: "power3.out",
        });
    }, [txt]);

    useEffect(() => {
        const geom: THREE.BufferGeometry = nodes.Retina_screen_vray_screen_0!.geometry;
        const uvAttr = geom.attributes.uv as THREE.BufferAttribute | undefined;
        if (!uvAttr) return;

        let minU = Infinity, minV = Infinity, maxU = -Infinity, maxV = -Infinity;
        for (let i = 0; i < uvAttr.count; i++) {
            const u = uvAttr.getX(i);
            const v = uvAttr.getY(i);
            if (u < minU) minU = u;
            if (v < minV) minV = v;
            if (u > maxU) maxU = u;
            if (v > maxV) maxV = v;
        }
        const rangeU = maxU - minU || 1;
        const rangeV = maxV - minV || 1;

        for (let i = 0; i < uvAttr.count; i++) {
            const u = uvAttr.getX(i);
            const v = uvAttr.getY(i);
            uvAttr.setXY(i, (u - minU) / rangeU, (v - minV) / rangeV);
        }
        uvAttr.needsUpdate = true;
    }, [nodes]);

    return (
        <group ref={group} {...props} dispose={null}>
            {/*<mesh*/}
            {/*    castShadow*/}
            {/*    receiveShadow*/}
            {/*    geometry={nodes.Glass_vray_Black_0!.geometry}*/}
            {/*    material={materials.vray_Black}*/}
            {/*    rotation={[-Math.PI, 0, 0]}*/}
            {/*/>*/}
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.SVvlQFeQaCVtSFx_vray_brown_0!.geometry}
                material={materials.vray_brown}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.jsgSSsFWnPVuvlo_vray_gradient_grey_0!.geometry}
                material={materials.vray_gradient_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.bXhfAiclTGoEHtf_vray_green_light_0!.geometry}
                material={materials.vray_green_light}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.REOuBrSIhooKFvE_vray_grey_light_0!.geometry}
                material={materials.vray_grey_light}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.oLzqSmuqpmfRAfx_vray_green_bright_0!.geometry}
                material={materials.vray_green_bright}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes["UEgtAKJkuvgHVPd_vray_circular-brushed-aluminium_0"]!.geometry}
                material={materials["vray_circular-brushed-aluminium"]}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.UBCQiSKpEUGzJFK_vray_grey_light_0!.geometry}
                material={materials.vray_grey_light}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.IWbaYtOlBzSNIyq_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.zlOUeiGttqhGIQz_vray_green2_0!.geometry}
                material={materials.vray_green2}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.CkHCIOhXhGBCiBm_vray_green4_0!.geometry}
                material={materials.vray_green4}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.TmMtsrYsHIzBtZK_vray_dark_grey_0!.geometry}
                material={materials.vray_dark_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.dTftzVqzNmjgiyE_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.pRMrIGLANuLhYKK_vray_green_light_0!.geometry}
                material={materials.vray_green_light}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.phdMEqggLqWOXid_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.MOWfSejhnaQmBMC_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.xqMubHUGCNIjgCO_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.ncfgXaUljSFPlBY_vray_grey_light_0!.geometry}
                material={materials.vray_grey_light}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.gNConWuPWDuZWap_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.CBdGjQnOwJBbnSQ_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.jOeYCrYIgLwBEEx_vray_dark_grey_0!.geometry}
                material={materials.vray_dark_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.gtkJFuBfDnRqZMd_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes["SLbIPZxIcDbAlJS_vray_power-cord_0"]!.geometry}
                material={materials["vray_power-cord"]}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes["zcoicRAlpvuSrKr_vray_dark-green_0"]!.geometry}
                material={materials["vray_dark-green"]}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.jyYtUDaBiTcowni_vray_gradient_grey_0!.geometry}
                material={materials.vray_gradient_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.XSdhNZdXwSNqPRJ_vray_green3_0!.geometry}
                material={materials.vray_green3}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.bIufPvKSDrquPrX_vray_green_light_0!.geometry}
                material={materials.vray_green_light}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.iMac24_stand_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.dPvFywXtHXZhqUE_vray_green2_0!.geometry}
                material={materials.vray_green2}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.aDIZpalhgNEzaje_vray_grey_light_0!.geometry}
                material={materials.vray_grey_light}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes["gyzKGCzhZOvLETT_vray_circular-brushed-aluminium_0"]!.geometry}
                material={materials["vray_circular-brushed-aluminium"]}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.mQHMDWriMmDJmYd_vray_green_light_0!.geometry}
                material={materials.vray_green_light}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.LduomgHjimaRhFJ_vray_green2_0!.geometry}
                material={materials.vray_green2}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.LSlhNZEQpdgfieG_vray_grey_light_0!.geometry}
                material={materials.vray_grey_light}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.JTxUjaHIyDdmBDZ_vray_green_light_0!.geometry}
                material={materials.vray_green_light}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.wfWsZSDwCYKEFok_vray_grey_light_0!.geometry}
                material={materials.vray_grey_light}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.GuzlKwLwYEozbej_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.CkdMCtaFcotYYna_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.CASjyMtTXQNuKhv_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.MbyeoqNrsjXusii_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.RXUnhzdBWSBnvAg_vray_grey_light_0!.geometry}
                material={materials.vray_grey_light}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.TXFkpraIorKIfcW_vray_green2_0!.geometry}
                material={materials.vray_green2}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.TywyWrFfETHXCIl_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.UJIfgKXaaFAejuW_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.WMqFzEWkSsTslxA_vray_green1_0!.geometry}
                material={materials.vray_green1}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.ZEuipVKguqwgRLv_vray_gradient_grey_0!.geometry}
                material={materials.vray_gradient_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.ayCiZofhiWvVrEF_vray_green_bright_0!.geometry}
                material={materials.vray_green_bright}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.eTXZtRORoUtZDCs_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.gveSzNFSnDnwZVP_vray_brown_0!.geometry}
                material={materials.vray_brown}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.jBIrfqRlUNCzYqX_vray_gradient_grey_0!.geometry}
                material={materials.vray_gradient_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.kPZaEBVgsaHnoSL_vray_dark_grey_0!.geometry}
                material={materials.vray_dark_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.kwkECikLrXukhHD_vray_dark_grey_0!.geometry}
                material={materials.vray_dark_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.mKGFCAUnzxxoNUI_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes["saahvhnqbSNwhxw_vray_circular-brushed-aluminium_0"]!.geometry}
                material={materials["vray_circular-brushed-aluminium"]}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.tBoiCfHYFDKkNER_vray_green_light_0!.geometry}
                material={materials.vray_green_light}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.tDhVRJNEAPrvlCR_vray_green2_0!.geometry}
                material={materials.vray_green2}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.tbYNYdoFNBgixjV_vray_green2_0!.geometry}
                material={materials.vray_green2}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.vrKYMDMllykAvTZ_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.wIebFLVIiNTowDh_vray_green2_0!.geometry}
                material={materials.vray_green2}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.IpkUtuMMqwAGzXB_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.zTjkqrKCiQPliOH_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes["zDhURIdCYeZwYsD_vray_dark-green_0"]!.geometry}
                material={materials["vray_dark-green"]}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.vUTyUnDeiiJVdBj_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.tfMdBaQNVwFDjrh_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.tTeYxkrqNbGXZos_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.snDmhTduWwFwjqi_vray_dark_grey_0!.geometry}
                material={materials.vray_dark_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.rdIoCcDSNcDiYBR_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.rVRACxZFaCSDuaM_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.rFdRGAQwvTYtwlh_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.qzEEXXIOFTerXbS_vray_green_dark_0!.geometry}
                material={materials.vray_green_dark}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.lQTPnlGNjFTlJcp_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.lLztMhLBoaFqxHa_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.lLErCugBsJXPsZA_vray_gradient_grey_0!.geometry}
                material={materials.vray_gradient_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.kKewBUBeUvdHJJS_vray_green4_0!.geometry}
                material={materials.vray_green4}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.jxbYfWYoTZFQmEU_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.jAlUjOfuyAfCdlM_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Retina_screen_vray_screen_0!.geometry}
                material={materials.vray_screen}
                position={[0, 0, 9.889]}
                rotation={[-Math.PI, 0, 0]}
            >
                <meshBasicMaterial map={txt} />
            </mesh>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.inMHYVIRkmKLPAd_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.iWQgjifNecoaZWs_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.fIhvyNDIgdiByvW_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.enEUrOvmHmPvDPW_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.djinFdwkCqUaicI_vray_dark_grey_0!.geometry}
                material={materials.vray_dark_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.dhUWLbChAmZXycV_vray_dark_grey_0!.geometry}
                material={materials.vray_dark_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.dBBVVHeaooaFWgT_vray_dark_grey_0!.geometry}
                material={materials.vray_dark_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.cghYnlxhMkYAqBF_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.baiczUKOTtUhuco_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.atgbLLxiVwyqSXT_vray_grey_light_0!.geometry}
                material={materials.vray_grey_light}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.ZCnRoRRlOcIiNQg_vray_green1_0!.geometry}
                material={materials.vray_green1}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.YlVMcsvLMybImKi_vray_dark_grey_0!.geometry}
                material={materials.vray_dark_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.YaZWTvFNCQNdAiw_vray_green_dark_0!.geometry}
                material={materials.vray_green_dark}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.YBeEwWBYANOWfKT_vray_green_dark_0!.geometry}
                material={materials.vray_green_dark}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.XvZrMzAaKesvFig_vray_dark_grey_0!.geometry}
                material={materials.vray_dark_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.XhzJOCqrpGoKHNG_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.XUuyXONEzIOLfjB_vray_gradient_grey_0!.geometry}
                material={materials.vray_gradient_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes["XBVarRDKFDawGUB_vray_dark-green_0"]!.geometry}
                material={materials["vray_dark-green"]}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.WvsXDCbfkJPUMci_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.WvGQowZMQdanMNQ_vray_jade_0!.geometry}
                material={materials.vray_jade}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes["TsqghoyxwLaLyhC_vray_dark-green_0"]!.geometry}
                material={materials["vray_dark-green"]}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.TUuQnyNMYNqOTHl_vray_dark_grey_0!.geometry}
                material={materials.vray_dark_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.TLkWLtaldiGrMRM_vray_dark_gradient_0!.geometry}
                material={materials.vray_dark_gradient}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.TAttlfOXDLwKpba_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.SpQVvHhenuiXGiG_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.SRdmRAslwispVHt_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.SLZguuPHbCImGCt_vray_green_dark_0!.geometry}
                material={materials.vray_green_dark}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.SJpHMcTfTNlQDth_vray_green_dark_0!.geometry}
                material={materials.vray_green_dark}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.RYrPcvpkkVPKcwN_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.QtoBSMYHTRLRxrv_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.PttXbwlJEZMcdQT_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.PrrGqbSGhmESNCg_vray_gradient_grey_0!.geometry}
                material={materials.vray_gradient_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.PqDhjzKFGPzIAHn_vray_grey_light_0!.geometry}
                material={materials.vray_grey_light}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.PZvDnxfPVbvzbIZ_vray_grey_light_0!.geometry}
                material={materials.vray_grey_light}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.OPMYkGxLHlklIIv_vray_green_dark_0!.geometry}
                material={materials.vray_green_dark}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.NGOGkvDkslscyDj_vray_green_dark_0!.geometry}
                material={materials.vray_green_dark}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.MRDByNQjaiOBoyi_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.KGdyDmqfcthwjjT_vray_dark_grey_0!.geometry}
                material={materials.vray_dark_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.IEKwOKGFoeUNJKz_vray_jade_0!.geometry}
                material={materials.vray_jade}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.IDvZIJqJxYgFdzF_vray_gradient_grey_0!.geometry}
                material={materials.vray_gradient_grey}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.IBQkjODsHRkneRC_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.HrgHwMEELMqerwv_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.GmTTfJUqxAOkktU_vray_jade_0!.geometry}
                material={materials.vray_jade}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.GjktsTIKvdJvjTi_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.GhYfvEtiMJwocpf_vray_green_dark_0!.geometry}
                material={materials.vray_green_dark}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.FdPRcACRJAEWZpy_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes["FXEcInHWqYhBKgT_vray_dark-green_0"]!.geometry}
                material={materials["vray_dark-green"]}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.EjYShLihpkEUaza_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.EgeziiQQEZZnNJM_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.EekiGOqwXKUOwzI_vray_blue_0!.geometry}
                material={materials.vray_blue}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.DipuIfRYazSguKT_vray_white_0!.geometry}
                material={materials.vray_white}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.CkkkMacLFvkEnLM_vray_green1_0!.geometry}
                material={materials.vray_green1}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.CHynENmzaFpAqqw_vray_Black_0!.geometry}
                material={materials.vray_Black}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes["Back_drak-green_vray_dark-green_0"]!.geometry}
                material={materials["vray_dark-green"]}
                rotation={[-Math.PI, 0, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes["AduRFaSdUzdWigL_vray_dark-green_0"]!.geometry}
                material={materials["vray_dark-green"]}
                rotation={[-Math.PI, 0, 0]}
            />
        </group>
    );
};

useGLTF.preload("/models/imac.glb");

export default DemoiMac;