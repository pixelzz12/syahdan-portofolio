"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Box, Sign } from "./Primitives";

export default function LoopGate({ copy, reducedMotion }: { copy:number; reducedMotion:boolean }) {
  const left=useRef<THREE.Group>(null),right=useRef<THREE.Group>(null),root=useRef<THREE.Group>(null);
  const world=useRef(new THREE.Vector3());
  useFrame(({camera},dt)=>{
    if(!root.current||!left.current||!right.current)return;
    root.current.getWorldPosition(world.current);
    const open=Math.abs(camera.position.z-world.current.z)<13;
    const x=open?5:1.68;
    left.current.position.x=reducedMotion?-x:THREE.MathUtils.damp(left.current.position.x,-x,8,Math.min(dt,0.1));right.current.position.x=-left.current.position.x;
    root.current.userData.open=open;
  });
  return <group ref={root} name={`loop-gate-${copy}`} position={[0,0,-70]}>
    {[-1,1].map(side=><Box key={side} position={[side*4.3,2.9,0]} scale={[1.9,5.8,0.5]} color="#3d5350" />)}
    <Box position={[0,5.55,0]} scale={[8.8,0.45,0.65]} color="#748577" />
    {[-1,1].map(side=><group key={side} ref={side===-1?left:right} position={[side*1.68,0,0]}><Box position={[0,2.7,0]} scale={[3.35,5.4,0.2]} color="#657d72" /><Box position={[0,0.8,0.14]} scale={[3.1,0.65,0.07]} color="#334c46" /><Box position={[0,4.7,0.14]} scale={[2.9,0.05,0.05]} color="#c7b98e" /></group>)}
    <group position={[0,6.03,0.3]}><Sign title="CONTINUE / SYAHDAN" subtitle="AUTOMATIC ACCESS" width={3.2} height={0.56} /></group>
  </group>;
}
