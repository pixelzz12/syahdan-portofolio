"use client";
import {useEffect,useState} from "react";
import * as THREE from "three";
import {profile} from "@/data/portfolio";
import {Box,Sign} from "./Primitives";

// The supplied university artwork stays intact; only its display surround glows.
export default function UniversityHologram(){
 const [texture,setTexture]=useState<THREE.Texture|null>(null);
 useEffect(()=>{if(!profile.universityLogo)return;let live=true;const map=new THREE.TextureLoader().load(profile.universityLogo,loaded=>{loaded.colorSpace=THREE.SRGBColorSpace;if(live)setTexture(loaded);},undefined,()=>{if(live)setTexture(null);});return()=>{live=false;map.dispose();};},[]);
 return <group name="unair-hologram" position={[2.45,0,3.2]}>
  <Box position={[0,0.28,0]} scale={[1.25,0.55,1.1]} color="#486359"/>
  <mesh position={[0,0.57,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[0.42,0.49,48]}/><meshBasicMaterial color="#aad3c9" transparent opacity={0.65} side={THREE.DoubleSide}/></mesh>
  <mesh position={[0,1.22,0]}><cylinderGeometry args={[0.63,0.26,1.25,24,1,true]}/><meshBasicMaterial color="#9bc6ba" transparent opacity={0.045} depthWrite={false} side={THREE.DoubleSide}/></mesh>
  <group position={[0,2.05,0]}>
   <mesh><ringGeometry args={[0.84,0.865,64]}/><meshBasicMaterial color="#aad3c9" transparent opacity={0.65} side={THREE.DoubleSide}/></mesh>
   {texture?<mesh position={[0,0,0.015]}><planeGeometry args={[1.52,1.52]}/><meshBasicMaterial map={texture} transparent opacity={0.87} toneMapped={false} side={THREE.DoubleSide}/></mesh>:<Sign title="UNIVERSITAS AIRLANGGA" width={1.5} height={0.6}/>}
  </group>
  <group position={[0,0.35,0.565]}><Sign title="UNIVERSITAS AIRLANGGA" subtitle="TEKNIK INFORMATIKA / SYAHDAN" width={1.13} height={0.33}/></group>
 </group>;
}
