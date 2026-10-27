"use client";
import {useRef,useState} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {roomActions,type RoomAction,type RoomId} from "@/data/rooms";
import type {SecretId} from "@/data/expansion";
import {Box,Sign} from "./Primitives";
import {Hotspot} from "./RoomProps";
import MaintenanceRobot from "./MaintenanceRobot";

function SecretProp({id,position,rotation=[0,0,0],onObject,reducedMotion}:{id:SecretId;position:[number,number,number];rotation?:[number,number,number];onObject:(action:RoomAction)=>void;reducedMotion:boolean}){
 const root=useRef<THREE.Group>(null),[taps,setTaps]=useState(0),[flipped,setFlipped]=useState(false),pulse=useRef(0);
 const card=id==="polaroid";
 useFrame((_,delta)=>{if(!root.current)return;const dt=Math.min(delta,.1);pulse.current=THREE.MathUtils.damp(pulse.current,0,5,dt);root.current.rotation.y=reducedMotion?(flipped?Math.PI:0):THREE.MathUtils.damp(root.current.rotation.y,flipped?Math.PI:0,6,dt);root.current.scale.setScalar(1+(reducedMotion?0:pulse.current*.05));});
 const action:RoomAction={id:`secret-${id}`,kind:"secret",secretId:id,label:card?"Kartu di balik bingkai":id==="terminal"?"Terminal diagnostik":id==="relay"?"Sinyal dari meja riset":"Uji sirkuit kecil"};
 const click=(event:{stopPropagation:()=>void})=>{event.stopPropagation();pulse.current=1;if(card)setFlipped(value=>!value);const next=taps+1;setTaps(next);if(id!=="terminal"||next>=3){setTaps(0);onObject({...action,unlocked:true});}};
 return <group position={position} rotation={rotation}>
  <group ref={root} name={`secret-prop-${id}`}>
   <Box position={[0,0,0]} scale={card?[.72,.9,.035]:[1.1,.65,.13]} color={card?"#c6bfa6":"#4c6257"}/>
   <group position={[0,0,card?.025:.085]}><Sign title={card?"PHOTO / NOTE":id==="terminal"?"> _":id==="relay"?"PING / STANDBY":"I/O / TEST"} subtitle={card?"MENUNGGU FOTO ASLI":id==="terminal"?"ENTER / ENTER / ENTER":"LOCAL CIRCUIT"} width={card?.61:.94} height={card?.69:.43}/></group>
   {card&&<group rotation={[0,Math.PI,0]} position={[0,0,-.025]}><Sign title="LOOK CLOSER" subtitle="HAL KECIL JUGA BERARTI" width={.61} height={.69}/></group>}
   {!card&&[0,1,2].map(i=><mesh key={i} position={[-.18+i*.18,-.2,.08]}><boxGeometry args={[.08,.035,.025]}/><meshBasicMaterial color={taps>i?"#cfbd87":"#7e9f91"}/></mesh>)}
  </group>
  <mesh name={`room-object-secret-${id}`} position={[0,0,.16]} onClick={click} onPointerOver={e=>{e.stopPropagation();document.body.style.cursor="pointer";}} onPointerOut={()=>{document.body.style.cursor="";}}><boxGeometry args={card?[.8,1,.1]:[1.2,.75,.12]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/></mesh>
 </group>;
}

export default function RoomExtras({room,onObject,reducedMotion}:{room:RoomId;onObject:(action:RoomAction)=>void;reducedMotion:boolean}){
 if(room==="operator")return <>
  <group name="cv-folder" position={[-.9,1.46,-9.63]} rotation={[-Math.PI/2,0,-.1]}><Box position={[0,0,0]} scale={[.82,1,.035]} color="#a99972"/><group position={[0,0,.025]}><Sign title="CV / DOSSIER" subtitle="PREVIEW / DOWNLOAD" width={.69} height={.65}/></group><Hotspot action={roomActions.operator.find(item=>item.kind==="cv")!} position={[0,0,.08]} size={[.9,1.08,.16]} onObject={onObject}/></group>
  <SecretProp id="polaroid" position={[-3.05,1.92,-9.73]} rotation={[0,.2,-.08]} onObject={onObject} reducedMotion={reducedMotion}/>
 </>;
 if(room==="development")return <group><Box position={[-4.65,1.3,-15.4]} scale={[1.55,.13,.8]} color="#89927a"/><SecretProp id="terminal" position={[-4.65,1.9,-15.55]} rotation={[0,.45,0]} onObject={onObject} reducedMotion={reducedMotion}/></group>;
 if(room==="workshop")return <><MaintenanceRobot position={[-.2,0,-6.5]} scale={.7} reducedMotion={reducedMotion} action={roomActions.workshop.find(item=>item.secretId==="ev")} onObject={onObject}/><SecretProp id="circuit" position={[.15,2.9,-10.3]} onObject={onObject} reducedMotion={reducedMotion}/></>;
 if(room==="research")return <SecretProp id="relay" position={[-2.75,1.66,-8.37]} rotation={[-.4,0,0]} onObject={onObject} reducedMotion={reducedMotion}/>;
 return null;
}
