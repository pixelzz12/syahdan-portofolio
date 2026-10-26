"use client";
import { useEffect, useRef } from "react";
import { useFrame,useThree } from "@react-three/fiber";
import * as THREE from "three";
import { bays } from "@/lib/facility-layout";
import { CORRIDOR_LENGTH } from "@/lib/scene-navigation";

export default function PeriodicLights() {
  const key=useRef<THREE.DirectionalLight>(null), warm=useRef<(THREE.PointLight|null)[]>([]),teal=useRef<THREE.PointLight>(null);
  const {camera,size}=useThree();
  useEffect(()=>{if(camera instanceof THREE.PerspectiveCamera){camera.fov=size.width<700?76:62;camera.updateProjectionMatrix();}},[camera,size.width]);
  useFrame(()=>{
    if(key.current){key.current.position.set(camera.position.x-6,16,camera.position.z+10);key.current.target.position.set(camera.position.x,0,camera.position.z-10);key.current.target.updateMatrixWorld();}
    bays.forEach((bay,i)=>{const light=warm.current[i];if(light){const z=bay.center+3;light.position.set(-1,bay.height-1,z-Math.round((z-camera.position.z)/CORRIDOR_LENGTH)*CORRIDOR_LENGTH);}});
    if(teal.current)teal.current.position.set(4.8,4,-28-Math.round((-28-camera.position.z)/CORRIDOR_LENGTH)*CORRIDOR_LENGTH);
  },-1);
  return <><directionalLight ref={key} intensity={2.2} color="#f3e2c4" castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-18} shadow-camera-right={18} shadow-camera-top={24} shadow-camera-bottom={-45} shadow-camera-far={110} shadow-normalBias={0.05} />{bays.map((bay,i)=><pointLight key={bay.name} ref={node=>{warm.current[i]=node;}} intensity={30} distance={18} decay={2} color="#e0b777" />)}<pointLight ref={teal} intensity={18} distance={12} color="#7faaa0" /></>;
}
