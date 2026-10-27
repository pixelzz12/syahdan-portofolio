"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {avatar} from "@/data/avatar";
import {arrivalReveal} from "@/lib/arrival-motion";

export default function OperatorAvatar({onSelect,reducedMotion=false,exploring=true}:{onSelect:()=>void;reducedMotion?:boolean;exploring?:boolean}){
 const [map,setMap]=useState<THREE.Texture|null>(null);
 const root=useRef<THREE.Group>(null),facing=useRef<THREE.Group>(null),reveal=useRef(0);const tools=useMemo(()=>({camera:new THREE.Vector3()}),[]);
 useEffect(()=>{let live=true;const texture=new THREE.TextureLoader().load(avatar.src,loaded=>{loaded.colorSpace=THREE.SRGBColorSpace;if(live)setMap(loaded);});return()=>{live=false;texture.dispose();};},[]);
 // A cutout illustration in world space; only its yaw follows the viewpoint.
 // Keeping the feet fixed avoids the floating-camera-facing-card effect.
 useFrame(({camera},delta)=>{const node=facing.current,actor=root.current;if(!node?.parent||!actor?.parent)return;
  const dt=Math.min(delta,0.1);
  if(exploring){
   actor.parent.worldToLocal(tools.camera.copy(camera.position));const target=arrivalReveal(tools.camera.z);
   reveal.current=reducedMotion?target:THREE.MathUtils.damp(reveal.current,target,5,dt);
   const arc=reveal.current*Math.PI/2;
   actor.position.x=0.4-2.8*Math.sin(arc);actor.position.z=4+1.6*(1-Math.cos(arc));
  }
  tools.camera.copy(camera.position);node.parent.worldToLocal(tools.camera);const angle=Math.atan2(tools.camera.x-node.position.x,tools.camera.z-node.position.z);
  const turn=Math.atan2(Math.sin(angle-node.rotation.y),Math.cos(angle-node.rotation.y));node.rotation.y=reducedMotion?angle:node.rotation.y+turn*(1-Math.exp(-6*dt));
 });
 const image=map?.image as HTMLImageElement|undefined;
 const aspect=image?.width&&image?.height?image.width/image.height:2/3;
 return <group ref={root} name="operator-avatar" position={[0.4,0,4]} scale={1.25} userData={{illustration:true}}>
  <mesh position={[0,0.035,0]} rotation={[-Math.PI/2,0,0]} scale={[0.5,0.25,1]}><circleGeometry args={[1,24]}/><meshBasicMaterial color="#263b32" transparent opacity={0.24} depthWrite={false}/></mesh>
  <group ref={facing} position={[0,1.3,0]}>
   {map&&<mesh><planeGeometry args={[2.6*aspect,2.6]}/><meshBasicMaterial map={map} transparent alphaTest={0.25} toneMapped={false}/></mesh>}
   <mesh name="room-object-avatar-profile" position={[0,0,0.025]} onClick={e=>{e.stopPropagation();document.body.style.cursor="";onSelect();}} onPointerOver={e=>{e.stopPropagation();document.body.style.cursor="pointer";}} onPointerOut={()=>{document.body.style.cursor="";}}><planeGeometry args={[1.1,2.55]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/></mesh>
  </group>
 </group>;
}
