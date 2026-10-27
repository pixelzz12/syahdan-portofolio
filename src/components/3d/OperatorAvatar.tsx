"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {avatar} from "@/data/avatar";
import {Sign} from "./Primitives";

export default function OperatorAvatar({onSelect}:{onSelect:()=>void}){
 const [map,setMap]=useState<THREE.Texture|null>(null),[hovered,setHovered]=useState(false);
 const facing=useRef<THREE.Group>(null);const tools=useMemo(()=>({camera:new THREE.Vector3()}),[]);
 useEffect(()=>{let live=true;const texture=new THREE.TextureLoader().load(avatar.src,loaded=>{loaded.colorSpace=THREE.SRGBColorSpace;if(live)setMap(loaded);});return()=>{live=false;texture.dispose();};},[]);
 // A cutout illustration in world space; only its yaw follows the viewpoint.
 // Keeping the feet fixed avoids the floating-camera-facing-card effect.
 useFrame(({camera})=>{const node=facing.current;if(!node?.parent)return;tools.camera.copy(camera.position);node.parent.worldToLocal(tools.camera);node.rotation.y=Math.atan2(tools.camera.x-node.position.x,tools.camera.z-node.position.z);});
 const image=map?.image as HTMLImageElement|undefined;
 const aspect=image?.width&&image?.height?image.width/image.height:2/3;
 return <group name="operator-avatar" position={[-1.15,0,3.15]} userData={{illustration:true}}>
  <mesh position={[0,0.035,0]} rotation={[-Math.PI/2,0,0]} scale={[0.5,0.25,1]}><circleGeometry args={[1,24]}/><meshBasicMaterial color="#263b32" transparent opacity={0.24} depthWrite={false}/></mesh>
  <group ref={facing} position={[0,1.3,0]}>
   {map&&<mesh><planeGeometry args={[2.6*aspect,2.6]}/><meshBasicMaterial map={map} transparent alphaTest={0.25} toneMapped={false}/></mesh>}
   <mesh name="room-object-avatar-profile" position={[0,0,0.025]} onClick={e=>{e.stopPropagation();document.body.style.cursor="";onSelect();}} onPointerOver={e=>{e.stopPropagation();setHovered(true);document.body.style.cursor="pointer";}} onPointerOut={()=>{setHovered(false);document.body.style.cursor="";}}><planeGeometry args={[1.1,2.55]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/></mesh>
  </group>
  <group position={[0,0.055,0.75]} rotation={[-Math.PI/2,0,0]}><Sign title="SYAHDAN" subtitle={hovered?"BUKA PROFIL / OPERATOR":"OPERATOR / AVATAR ILUSTRASI"} width={1.35} height={0.35}/></group>
 </group>;
}
