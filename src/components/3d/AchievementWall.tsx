"use client";
import {useRef} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {achievements,type Achievement} from "@/data/expansion";
import type {RoomAction} from "@/data/rooms";
import {Box,Sign} from "./Primitives";
import {Hotspot,ImagePlane} from "./RoomProps";

function AwardFrame({item,index,onObject,selected,reducedMotion}:{item:Achievement;index:number;onObject:(action:RoomAction)=>void;selected:boolean;reducedMotion:boolean}){
 const root=useRef<THREE.Group>(null);
 useFrame((_,delta)=>{if(root.current){const scale=selected?1.045:1;root.current.scale.setScalar(reducedMotion?scale:THREE.MathUtils.damp(root.current.scale.x,scale,6,Math.min(delta,.1)));}});
 return <group position={[(index%2-.5)*2.05,index<2?3.45:1.95,0]}><group ref={root} name={`award-frame-${item.id}`}>
  <Box position={[0,0,0]} scale={[1.76,1.27,.12]} color={selected?"#c0ae7c":"#69705a"}/>
  <Box position={[0,0,.07]} scale={[1.58,1.09,.035]} color="#c4bea8"/>
  <group position={[0,0,.095]}>{item.certificateSrc?<ImagePlane src={item.thumbnailSrc||item.certificateSrc} width={1.48} height={1.02}/>:<Sign title={item.shortTitle} subtitle="DOKUMEN ASLI MENYUSUL" width={1.46} height={1.0} color="#cfbf96"/>}</group>
  <group position={[0,-.83,.06]}><Sign title={item.shortTitle} subtitle={`${item.category} / ${item.year}`} width={1.75} height={.28}/></group>
  <Hotspot action={{id:`achievement-${item.id}`,label:item.title,kind:"achievement",achievementId:item.id}} position={[0,0,.16]} size={[1.8,1.32,.12]} onObject={onObject}/>
 </group></group>;
}
export default function AchievementWall({onObject,selected,reducedMotion}:{onObject:(action:RoomAction)=>void;selected:string|null;reducedMotion:boolean}){
 return <group name="achievement-wall" position={[3.99,0,-7.6]} rotation={[0,-Math.PI/2,0]}>
  <Box position={[0,2.76,-.09]} scale={[4.3,3.8,.1]} color="#50665b"/>
  <group position={[0,4.48,.04]}><Sign title="MILESTONES / FIELD RECORDS" subtitle="PRESTASI / ORGANISASI / PARTISIPASI" width={3.9} height={.36}/></group>
  {achievements.map((item,index)=><AwardFrame key={item.id} item={item} index={index} onObject={onObject} selected={selected===`achievement-${item.id}`} reducedMotion={reducedMotion}/>)}
 </group>;
}
