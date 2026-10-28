"use client";
import {useEffect} from "react";
import type {FreeExploreState} from "@/lib/free-explore";
export function useFreeExplore(state:React.RefObject<FreeExploreState>,active:boolean,paused:boolean,onExit:()=>void){
 useEffect(()=>{
  const input=state.current;input.forward=input.strafe=input.lookX=input.lookY=0;
  if(!active||paused)return;
  const canvas=document.querySelector(".scene-container canvas") as HTMLCanvasElement|null;if(!canvas)return;
  const keys=new Set<string>();let drag:{x:number;y:number;distance:number}|null=null,suppress=false;
  const axes=()=>{input.forward=Number(keys.has("w"))-Number(keys.has("s"));input.strafe=Number(keys.has("d"))-Number(keys.has("a"));};
  const clear=()=>{keys.clear();axes();drag=null;input.lookX=input.lookY=0;};
  const key=(e:KeyboardEvent)=>{if(e.ctrlKey||e.metaKey||e.altKey)return;if((e.target as HTMLElement)?.closest("input,textarea,select,dialog,[role=dialog]"))return;if(e.key==="Escape"){if(e.type==="keydown"){e.preventDefault();onExit();}return;}const k=e.key.toLowerCase();if(!["w","a","s","d"].includes(k))return;e.preventDefault();if(e.type==="keydown")keys.add(k);else keys.delete(k);axes();};
  const down=(e:PointerEvent)=>{if(e.button!==0)return;suppress=false;drag={x:e.clientX,y:e.clientY,distance:0};canvas.setPointerCapture(e.pointerId);};
  const move=(e:PointerEvent)=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.distance+=Math.abs(dx)+Math.abs(dy);drag.x=e.clientX;drag.y=e.clientY;if(drag.distance>7){suppress=true;input.lookX+=dx*.004;input.lookY+=dy*.004;}};
  const up=()=>{drag=null;};
  const click=(e:MouseEvent)=>{if(suppress){e.stopImmediatePropagation();e.preventDefault();suppress=false;}};
  const oldTouch=canvas.style.touchAction;canvas.style.touchAction="none";
  window.addEventListener("keydown",key);window.addEventListener("keyup",key);window.addEventListener("blur",clear);document.addEventListener("visibilitychange",clear);
  canvas.addEventListener("pointerdown",down);canvas.addEventListener("pointermove",move);canvas.addEventListener("pointerup",up);canvas.addEventListener("pointercancel",clear);canvas.addEventListener("lostpointercapture",up);canvas.addEventListener("click",click,true);
  return()=>{clear();canvas.style.touchAction=oldTouch;window.removeEventListener("keydown",key);window.removeEventListener("keyup",key);window.removeEventListener("blur",clear);document.removeEventListener("visibilitychange",clear);canvas.removeEventListener("pointerdown",down);canvas.removeEventListener("pointermove",move);canvas.removeEventListener("pointerup",up);canvas.removeEventListener("pointercancel",clear);canvas.removeEventListener("lostpointercapture",up);canvas.removeEventListener("click",click,true);};
 },[active,paused,state,onExit]);
}
