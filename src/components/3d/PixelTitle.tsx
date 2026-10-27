"use client";
import {useEffect,useMemo,useRef} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";

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
function lettering(blur:boolean){
 const canvas=document.createElement("canvas");canvas.width=1024;canvas.height=256;
 const ctx=canvas.getContext("2d")!;ctx.imageSmoothingEnabled=false;if(blur)ctx.filter="blur(9px)";
 const draw=(text:string,pixel:number,y:number,color:string,spacing:number)=>{
  const width=[...text].reduce((sum,char)=>sum+(glyphs[char]?.[0].length||5)*pixel+spacing,0)-spacing;let x=(1024-width)/2;
  ctx.fillStyle=color;for(const char of text){const rows=glyphs[char];rows?.forEach((row,j)=>[...row].forEach((bit,i)=>{if(bit==="1")ctx.fillRect(x+i*pixel,y+j*pixel,pixel,pixel);}));x+=(rows?.[0].length||5)*pixel+spacing;}
 };
 draw("SYAHDAN",20,28,"#e1dac4",14);draw("PORTFOLIO WEBSITE",5,202,"#b5c9bc",7);
 // Two restrained interface marks keep the lettering grounded in the facility.
 ctx.fillStyle="#b9a574";ctx.fillRect(30,36,4,126);ctx.fillRect(990,36,4,126);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.magFilter=THREE.NearestFilter;
 return texture;
}
export default function PixelTitle({reducedMotion=false}:{reducedMotion?:boolean}){
 const root=useRef<THREE.Group>(null),solid=useRef<THREE.MeshBasicMaterial>(null),soft=useRef<THREE.MeshBasicMaterial>(null);
 const {normal,blur,world}=useMemo(()=>({normal:lettering(false),blur:lettering(true),world:new THREE.Vector3()}),[]);
 useEffect(()=>()=>{normal.dispose();blur.dispose();},[normal,blur]);
 useFrame(({camera})=>{if(!root.current)return;root.current.getWorldPosition(world);const amount=reducedMotion||Math.abs(camera.position.x-world.x)>3?0:THREE.MathUtils.smoothstep(6-Math.abs(camera.position.z-world.z),0,4);root.current.userData.blur=amount;if(solid.current)solid.current.opacity=1-amount*0.9;if(soft.current)soft.current.opacity=amount*0.8;});
 return <group ref={root} name="spatial-syahdan-title" position={[0,3.5,5]} userData={{lettering:"pixel-flat",subtitle:"PORTFOLIO WEBSITE"}}>
  <mesh><planeGeometry args={[5.8,1.45]}/><meshBasicMaterial ref={solid} map={normal} transparent depthWrite={false} toneMapped={false}/></mesh>
  <mesh position={[0,0,0.005]}><planeGeometry args={[5.8,1.45]}/><meshBasicMaterial ref={soft} map={blur} transparent opacity={0} depthWrite={false} toneMapped={false}/></mesh>
 </group>;
}
