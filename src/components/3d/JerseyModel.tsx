"use client";
import {useMemo,useEffect} from "react";
import * as THREE from "three";
import {jerseyDesign as design} from "@/data/jersey";
import {ImagePlane} from "./RoomProps";
import {Sign} from "./Primitives";
export default function JerseyModel(){
 const geometry=useMemo(()=>{const s=new THREE.Shape();const points=[[-.46,1.12],[-.9,.95],[-1.18,.4],[-.82,.2],[-.57,.58],[-.57,-1.1],[.57,-1.1],[.57,.58],[.82,.2],[1.18,.4],[.9,.95],[.46,1.12],[.23,.92],[-.23,.92]];points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();return new THREE.ExtrudeGeometry(s,{depth:.13,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.035,bevelThickness:.025});},[]);
 useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <group name="jersey-model"><mesh geometry={geometry}><meshStandardMaterial color={design.colors[0]} roughness={1}/></mesh>{[1,-1].map(side=><group key={side} position={[0,0,side===1?.17:-.04]} rotation={[0,side===1?0:Math.PI,0]}>{(side===1?design.frontSrc:design.backSrc)?<ImagePlane src={(side===1?design.frontSrc:design.backSrc)!} width={1.02} height={1.75}/>:<><mesh position={[0,.16,0]} rotation={[0,0,-.2]}><planeGeometry args={[1.05,.13]}/><meshBasicMaterial color={design.colors[1]}/></mesh><group position={[0,side===1?.57:.45,.004]}><Sign title={side===1?"NOVA":"01"} subtitle={side===1?undefined:"SAMPLE"} width={.75} height={side===1?.24:.7}/></group></>}</group>)}</group>;
}
