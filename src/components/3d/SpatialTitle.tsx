"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FontLoader, type FontData } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import typeface from "three/examples/fonts/optimer_bold.typeface.json";
import { Box } from "./Primitives";

export default function SpatialTitle({reducedMotion=false}:{reducedMotion?:boolean}) {
  const root=useRef<THREE.Group>(null),front=useRef<THREE.MeshStandardMaterial>(null),sides=useRef<THREE.MeshStandardMaterial>(null),soft=useRef<THREE.MeshBasicMaterial>(null);
  const world=useMemo(()=>new THREE.Vector3(),[]);
  const {geometry,blurTexture} = useMemo(() => {
    const font = new FontLoader().parse(typeface as unknown as FontData);
    const text = new TextGeometry("SYAHDAN", { font, size: 1, depth: 0.3, curveSegments: 6, bevelEnabled: true, bevelThickness: 0.028, bevelSize: 0.025, bevelSegments: 2 });
    text.computeBoundingBox();
    const bounds=text.boundingBox!,factor=4.8/(bounds.max.x-bounds.min.x),center=bounds.getCenter(new THREE.Vector3());
    text.scale(factor,factor,1);text.center();
    // Bake a soft silhouette once; only the lettering softens as it passes close
    // to the lens. No full-screen filter or extra postprocessing render pass.
    const canvas=document.createElement("canvas");canvas.width=1024;canvas.height=256;
    const ctx=canvas.getContext("2d")!;ctx.filter="blur(10px)";ctx.fillStyle="#d6d3c9";
    ctx.translate(512,128);ctx.scale(1024/5.8,-1024/5.8);
    for(const shape of font.generateShapes("SYAHDAN",1)){
      const points=shape.extractPoints(12);ctx.beginPath();
      for(const contour of [points.shape,...points.holes]){
        contour.forEach((p,i)=>{const x=(p.x-center.x)*factor,y=(p.y-center.y)*factor;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.closePath();
      }ctx.fill("evenodd");
    }
    const blurTexture=new THREE.CanvasTexture(canvas);blurTexture.colorSpace=THREE.SRGBColorSpace;
    return {geometry:text,blurTexture};
  }, []);
  useEffect(() => () => {geometry.dispose();blurTexture.dispose();}, [geometry,blurTexture]);
  useFrame(({camera})=>{
    if(!root.current)return;root.current.getWorldPosition(world);
    const amount=reducedMotion||Math.abs(camera.position.x-world.x)>3?0:THREE.MathUtils.smoothstep(6-Math.abs(camera.position.z-world.z),0,4);
    root.current.userData.blur=amount;
    if(front.current)front.current.opacity=1-amount*0.88;
    if(sides.current)sides.current.opacity=1-amount*0.88;
    if(soft.current)soft.current.opacity=amount*0.8;
  });
  return <group ref={root} name="spatial-syahdan-title" position={[0, 3.5, 5]}>
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial ref={front} attach="material-0" color="#d6d3c9" roughness={0.9} transparent />
      <meshStandardMaterial ref={sides} attach="material-1" color="#8b8168" roughness={1} transparent />
    </mesh>
    <mesh position={[0,0,0.2]}><planeGeometry args={[5.8,1.45]}/><meshBasicMaterial ref={soft} map={blurTexture} transparent opacity={0} depthWrite={false} toneMapped={false}/></mesh>
    {[-1, 1].map(side => <Box key={side} position={[side * 2.65, 1.455, 0]} scale={[0.045, 2.55, 0.06]} color="#818b91" />)}
    <Box position={[0, 0.61, 0]} scale={[5.5, 0.045, 0.12]} color="#648d8b" />
  </group>;
}
