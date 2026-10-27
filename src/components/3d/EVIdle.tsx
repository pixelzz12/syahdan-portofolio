"use client";
import {useEffect,useMemo,useRef} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";

const snippets=['console.log("Hello, world!");','System.out.println("Hi!");','print("hello")','EV.status = "curious";','01001000 01101001','// beep... hello, human!','{ signal: "hello" }'];
function writeBubble(canvas:HTMLCanvasElement,message:string){
 const c=canvas.getContext("2d")!;c.clearRect(0,0,512,160);
 c.fillStyle="#263b38";c.strokeStyle="#acbca0";c.lineWidth=3;c.beginPath();c.roundRect(4,4,504,130,18);c.fill();c.stroke();
 c.beginPath();c.moveTo(105,134);c.lineTo(85,156);c.lineTo(145,134);c.closePath();c.fill();
 c.fillStyle="#cfb987";c.font="18px monospace";c.fillText("EV / ping_",24,35);
 c.fillStyle="#dce3cc";c.font="24px monospace";c.fillText(message,24,86,465);
}

// Local idle scripts only; no chat service or LLM connection is invoked.
export function useEVIdle(reducedMotion:boolean){
 const robot=useRef<THREE.Group>(null),eyes=useRef<THREE.Group>(null),arm=useRef<THREE.Group>(null),bubble=useRef<THREE.Group>(null);
 const timing=useRef({blink:2,blinkAge:1,nextAction:4,actionStart:-10,count:0,kind:"wave",message:-1});
 const pendingGreeting=useRef(false),manualUntil=useRef(0),greetingCount=useRef(0);
 const greet=()=>{pendingGreeting.current=true;};
 useEffect(()=>{window.addEventListener("nova:ev-greet",greet);return()=>window.removeEventListener("nova:ev-greet",greet);},[]);
 const {canvas,map,local}=useMemo(()=>{const canvas=document.createElement("canvas");canvas.width=512;canvas.height=160;writeBubble(canvas,snippets[0]);const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;return{canvas,map,local:new THREE.Vector3()};},[]);
 useEffect(()=>()=>map.dispose(),[map]);
 useFrame(({clock,camera},delta)=>{
  const body=robot.current,eye=eyes.current,hand=arm.current,caption=bubble.current;if(!body||!eye||!hand||!caption)return;
  const now=clock.elapsedTime,t=timing.current;
  if(pendingGreeting.current){pendingGreeting.current=false;t.kind="code";t.actionStart=now;t.nextAction=now+7;t.blinkAge=0;t.message=greetingCount.current++%3;manualUntil.current=now+3.8;writeBubble(canvas,snippets[t.message]);map.needsUpdate=true;}
  if(reducedMotion){body.position.y=0;eye.scale.set(1,1,1);eye.position.x=0;hand.rotation.z=.12;caption.visible=now<manualUntil.current;if(caption.visible&&caption.parent){caption.parent.worldToLocal(local.copy(camera.position));caption.rotation.y=Math.atan2(local.x-caption.position.x,local.z-caption.position.z);}body.userData.idle={blink:1,wave:0,bubble:caption.visible,message:caption.visible?snippets[t.message]:null};return;}
  if(now>=t.blink){t.blinkAge=0;t.blink=now+(Math.random()<.2?.36:2.5+Math.random()*3.5);}
  // Keep a blink visible for several frames even on slower mobile GPUs.
  t.blinkAge+=Math.min(delta,.06);const blink=t.blinkAge<.22?1-.96*Math.sin(Math.PI*t.blinkAge/.22):1;
  if(now>=t.nextAction){
   t.kind=t.count===0?"wave":t.count===1?"code":["wave","look","code"][Math.floor(Math.random()*3)];
   t.count++;t.actionStart=now;t.nextAction=now+6+Math.random()*4;
   if(t.kind==="code"){let message=Math.floor(Math.random()*snippets.length);if(message===t.message)message=(message+1)%snippets.length;t.message=message;writeBubble(canvas,snippets[message]);map.needsUpdate=true;}
  }
  const elapsed=now-t.actionStart,envelope=THREE.MathUtils.smootherstep(elapsed,0,.45)*(1-THREE.MathUtils.smootherstep(elapsed,2.3,3.2));
  const wave=t.kind==="wave"?envelope:0,look=t.kind==="look"?envelope:0;
  body.position.y=.05+Math.sin(now*1.5)*.025;
  eye.scale.set(1+look*.25,blink*(1-look*.18),1);eye.position.x=look*Math.sin(elapsed*2.3)*.05;
  hand.rotation.z=.12+wave*(2.05+Math.sin(elapsed*11)*.23);
  caption.visible=t.kind==="code"&&elapsed>=0&&elapsed<3.8;
  if(caption.visible&&caption.parent){caption.parent.worldToLocal(local.copy(camera.position));caption.rotation.y=Math.atan2(local.x-caption.position.x,local.z-caption.position.z);caption.scale.setScalar(.94+.06*THREE.MathUtils.smootherstep(elapsed,0,.35));}
  body.userData.idle={blink,wave,bubble:caption.visible,message:caption.visible?snippets[t.message]:null};
 });
 return{robot,eyes,arm,bubble,map,greet};
}
