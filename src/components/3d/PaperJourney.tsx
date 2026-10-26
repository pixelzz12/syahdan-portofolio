"use client";
import { useEffect,useMemo,useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneNavigation } from "@/lib/scene-navigation";
import { fraction } from "@/lib/scene-navigation";
import type { RoomAction } from "@/data/rooms";
import { Hotspot } from "./RoomProps";

export default function PaperJourney({active,navigation,onObject}:{active:boolean;navigation:React.RefObject<SceneNavigation>;onObject:(action:RoomAction)=>void}) {
  const group=useRef<THREE.Group>(null);
  const {geometry,path,tangent}=useMemo(()=>{
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute([0,0,-0.4,-0.3,0,0.25,0,0.08,0.1,0,0,-0.4,0,0.08,0.1,0.3,0,0.25,0,0,-0.4,0,0.08,0.1,0,-0.08,0.24],3));g.computeVertexNormals();
    return {geometry:g,path:new THREE.CatmullRomCurve3([new THREE.Vector3(-1,3.2,-6.7),new THREE.Vector3(1.6,3.4,-7.7),new THREE.Vector3(1.7,3.4,-10.4),new THREE.Vector3(-2.2,3.1,-8)],true,"centripetal"),tangent:new THREE.Vector3()};
  },[]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  useFrame(()=>{if(!group.current)return;if(active){const t=fraction(navigation.current.roomCursor+0.06);path.getPointAt(t,group.current.position);path.getTangentAt(t,tangent);group.current.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,-1),tangent);}else{group.current.position.set(-0.45,1.54,-9.05);group.current.rotation.set(0,-0.4,0);}});
  return <group ref={group} name="paper-airplane"><mesh geometry={geometry} castShadow><meshStandardMaterial color="#d6d3c9" roughness={1} side={THREE.DoubleSide}/></mesh><Hotspot action={{id:"paper-journey",label:"Perjalanan pesawat kertas",kind:"journey"}} position={[0,0,0]} size={[0.65,0.32,0.75]} onObject={onObject}/></group>;
}
