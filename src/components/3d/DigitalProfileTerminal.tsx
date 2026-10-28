"use client";
import {useEffect,useMemo,useState} from "react";
import * as THREE from "three";
import {profile} from "@/data/portfolio";
import {roomActions,type RoomAction} from "@/data/rooms";
import {ImagePlane,Monitor} from "./RoomProps";

function ProfileScreen(){
 const [greeting,setGreeting]=useState("");
 useEffect(()=>{const update=()=>{const hour=new Date().getHours();setGreeting(hour<12?"Good Morning":hour<18?"Good Afternoon":"Good Evening");};update();const timer=window.setInterval(update,60000);return()=>window.clearInterval(timer);},[]);
 const text=useMemo(()=>{
  const canvas=document.createElement("canvas");canvas.width=640;canvas.height=460;
  const ctx=canvas.getContext("2d")!;
  ctx.fillStyle="#1c302b";ctx.fillRect(0,0,640,460);
  ctx.fillStyle="#a6bba3";ctx.font="22px monospace";ctx.fillText("01 / OPERATOR",24,46);
  ctx.fillStyle="#e1d2ac";ctx.font="bold 66px monospace";ctx.fillText(profile.shortName.toUpperCase(),24,126,592);
  ctx.fillStyle="#d3ddcc";ctx.font="29px monospace";
  ctx.fillText(profile.program,24,208,592);ctx.fillText(profile.university,24,253,592);
  ctx.fillStyle="#8eaaa0";ctx.fillRect(24,303,592,2);
  ctx.font="29px monospace";ctx.fillStyle="#d2c393";ctx.fillText(greeting,24,355,592);
  ctx.font="22px monospace";ctx.fillStyle="#a5b7a8";ctx.fillText("KLIK UNTUK INSPEKSI",24,412,592);
  const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;return map;
 },[greeting]);
 useEffect(()=>()=>text.dispose(),[text]);
 return <group name="digital-profile-screen">
  <mesh><planeGeometry args={[1.6,.85]}/><meshBasicMaterial color="#1c302b" toneMapped={false}/></mesh>
  <group position={[-.52,0,.003]}>{profile.portrait?<ImagePlane src={profile.portrait} width={.43} height={.68}/>:null}</group>
  <mesh position={[.27,0,.004]}><planeGeometry args={[1,.71875]}/><meshBasicMaterial map={text} toneMapped={false}/></mesh>
 </group>;
}

export default function DigitalProfileTerminal({onObject}:{onObject:(action:RoomAction)=>void}){
 return <group name="digital-profile-terminal"><Monitor title={profile.shortName} subtitle={profile.program} width={1.6} action={roomActions.operator[0]} onObject={onObject} screen={<ProfileScreen/>}/></group>;
}
