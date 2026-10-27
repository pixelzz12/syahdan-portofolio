"use client";
import {useEffect,useMemo} from "react";
import * as THREE from "three";
import {Box} from "./Primitives";

function drawing(kind:number){
 const canvas=document.createElement("canvas");canvas.width=256;canvas.height=320;const c=canvas.getContext("2d")!;
 c.fillStyle=kind===1?"#aebcad":"#c9bea1";c.fillRect(0,0,256,320);
 // Deterministic, quiet dry-brush scuffs rather than imported photographs.
 for(let i=0;i<35;i++){c.fillStyle=i%2?"#536d5910":"#fff7db12";c.fillRect((i*71)%256,(i*43)%320,30+i%25,2+i%4);}
 c.strokeStyle="#4b645b";c.fillStyle="#354b45";c.lineWidth=3;c.font="bold 18px monospace";
 c.fillText(["FIELD NOTES","SERVICE MAP","LIGHT STUDY"][kind],18,31);c.fillRect(18,44,220,2);
 if(kind===0){
  c.lineWidth=2;const stem=(x:number,y:number,dx:number,dy:number)=>{c.beginPath();c.moveTo(x,y);c.lineTo(x+dx,y+dy);c.stroke();};
  stem(127,238,-11,-152);for(let i=0;i<5;i++){const y=112+i*24,x=118+i*1.5;stem(x,y,-31,-16);stem(x,y+10,36,-19);c.beginPath();c.ellipse(x-29,y-18,18,6,-0.5,0,Math.PI*2);c.ellipse(x+33,y-9,18,6,0.5,0,Math.PI*2);c.stroke();}
 }else if(kind===1){
  for(let i=0;i<4;i++){c.strokeRect(29+i%2*117,81+Math.floor(i/2)*92,80,54);c.fillRect(62+i%2*117,103+Math.floor(i/2)*92,15,6);}
  c.beginPath();c.moveTo(109,108);c.lineTo(146,108);c.moveTo(109,200);c.lineTo(146,200);c.moveTo(69,135);c.lineTo(69,173);c.moveTo(186,135);c.lineTo(186,173);c.stroke();
 }else{
  c.beginPath();c.arc(128,153,65,0,Math.PI*2);c.stroke();c.beginPath();c.arc(128,153,39,0,Math.PI*2);c.stroke();
  for(let i=0;i<6;i++){const a=i*Math.PI/3;c.beginPath();c.moveTo(128+39*Math.cos(a),153+39*Math.sin(a));c.lineTo(128+65*Math.cos(a+0.45),153+65*Math.sin(a+0.45));c.stroke();}
 }
 c.font="11px monospace";c.fillText("SYAHDAN / WORK IN PROGRESS",18,281);c.fillRect(18,292,65,3);c.fillRect(92,292,146,1);
 const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;return map;
}
const placements:[number,number,number,number][]=[[-4.57,2.8,7,0],[4.57,2.5,-5,1],[-5.77,2.7,-31,2],[5.77,2.6,-20,0],[-4.97,2.8,-61,1],[4.97,2.6,-42,2]];
export default function WallDetails(){
 const maps=useMemo(()=>[drawing(0),drawing(1),drawing(2)],[]);useEffect(()=>()=>maps.forEach(map=>map.dispose()),[maps]);
 return <group name="corridor-wall-details">{placements.map(([x,y,z,kind],index)=><group key={index} position={[x,y,z]} rotation={[0,x<0?Math.PI/2:-Math.PI/2,0]}>
  <Box position={[0,0,0]} scale={[1.3,1.6,0.08]} color="#435b51"/>
  <mesh position={[0,0,0.047]}><planeGeometry args={[1.15,1.44]}/><meshStandardMaterial map={maps[kind]} roughness={1}/></mesh>
  {[-1,1].map(side=><Box key={side} position={[side*0.42,0.72,0.065]} rotation={[0,0,side*0.2]} scale={[0.24,0.1,0.015]} color="#a39168"/>)}
  {index%2===0&&<><Box position={[0.37,-1.27,0.16]} scale={[1.15,0.08,0.4]} color="#687c69"/><Box position={[0.7,-1.08,0.16]} scale={[0.17,0.3,0.18]} color="#a58b62"/><mesh position={[-0.02,-1.04,0.17]}><torusGeometry args={[0.14,0.028,5,12]}/><meshStandardMaterial color="#344c45" roughness={1}/></mesh></>}
 </group>)}</group>;
}
