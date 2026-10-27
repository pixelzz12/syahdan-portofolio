"use client";
import {useEffect,useMemo,useRef} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {arrivalReveal,letterReveal} from "@/lib/arrival-motion";

const glyphs:Record<string,string[]>={
 A:["01110","11011","11011","11111","11011","11011","11011"],
 B:["11110","11011","11011","11110","11011","11011","11110"],
 D:["11110","11011","11011","11011","11011","11011","11110"],
 E:["11111","11000","11000","11110","11000","11000","11111"],
 F:["11111","11000","11000","11110","11000","11000","11000"],
 H:["11011","11011","11011","11111","11011","11011","11011"],
 I:["11111","00100","00100","00100","00100","00100","11111"],
 L:["11000","11000","11000","11000","11000","11000","11111"],
 N:["11001","11101","11101","11111","11011","11011","11001"],
 O:["01110","11011","11011","11011","11011","11011","01110"],
 P:["11110","11011","11011","11110","11000","11000","11000"],
 R:["11110","11011","11011","11110","11100","11010","11011"],
 S:["01111","11000","11000","01110","00011","00011","11110"],
 T:["11111","00100","00100","00100","00100","00100","00100"],
 W:["11011","11011","11011","11011","11111","11111","01010"],
 Y:["11011","11011","11011","01110","00100","00100","00100"],
 " ":["000","000","000","000","000","000","000"],
};
function lettering(text:string){
 const canvas=document.createElement("canvas");canvas.width=text.length===1?100:1024;canvas.height=text.length===1?140:80;
 const ctx=canvas.getContext("2d")!;ctx.imageSmoothingEnabled=false;
 const pixel=text.length===1?18:7,spacing=text.length===1?0:10;
 const width=[...text].reduce((sum,char)=>sum+(glyphs[char]?.[0].length||5)*pixel+spacing,0)-spacing;let x=(canvas.width-width)/2;
 const y=(canvas.height-7*pixel)/2;ctx.fillStyle=text.length===1?"#e1dac4":"#b5c9bc";
 for(const char of text){const rows=glyphs[char];rows?.forEach((row,j)=>[...row].forEach((bit,i)=>{if(bit==="1")ctx.fillRect(x+i*pixel,y+j*pixel,pixel,pixel);}));x+=(rows?.[0].length||5)*pixel+spacing;}
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.magFilter=THREE.NearestFilter;
 return texture;
}
export default function PixelTitle({reducedMotion=false,exploring=true}:{reducedMotion?:boolean;exploring?:boolean}){
 const root=useRef<THREE.Group>(null),letters=useRef<(THREE.Mesh|null)[]>([]),subtitle=useRef<THREE.MeshBasicMaterial>(null),reveal=useRef(0);
 const {maps,caption,local}=useMemo(()=>({maps:[..."SYAHDAN"].map(lettering),caption:lettering("PORTFOLIO WEBSITE"),local:new THREE.Vector3()}),[]);
 useEffect(()=>()=>{maps.forEach(map=>map.dispose());caption.dispose();},[maps,caption]);
 useFrame(({camera},delta)=>{if(!root.current?.parent)return;
  root.current.parent.worldToLocal(local.copy(camera.position));
  if(exploring){const target=arrivalReveal(local.z);reveal.current=reducedMotion?target:THREE.MathUtils.damp(reveal.current,target,5,Math.min(delta,0.1));}
  const amount=reveal.current;
  letters.current.forEach((letter,i)=>{if(!letter)return;const side=Math.sign(i-3),travel=letterReveal(amount,i);letter.position.x=(i-3)*0.88+side*travel*(2.2+Math.abs(i-3)*0.28);letter.position.z=-travel*Math.abs(i-3)*0.14;letter.rotation.y=reducedMotion?0:side*travel*0.08;});
  if(subtitle.current)subtitle.current.opacity=1-amount;
 });
 return <group ref={root} name="spatial-syahdan-title" position={[0.4,2.85,2.2]} userData={{lettering:"pixel-flat-separated",subtitle:"PORTFOLIO WEBSITE"}}>
  {maps.map((map,i)=><mesh key={i} ref={node=>{letters.current[i]=node;}} name={`arrival-letter-${i}`} position={[(i-3)*0.88,0,0]}><planeGeometry args={[0.88,1.23]}/><meshBasicMaterial map={map} transparent alphaTest={0.05} toneMapped={false}/></mesh>)}
  <mesh position={[0,-1.05,0]}><planeGeometry args={[4,0.3125]}/><meshBasicMaterial ref={subtitle} map={caption} transparent depthWrite={false} toneMapped={false}/></mesh>
 </group>;
}
