"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import {ambientTracks,ambientEffects,type AmbienceRoom} from "@/data/expansion";
import {AmbientAudio} from "@/lib/ambient-audio";

export function useAmbientAudio(room:AmbienceRoom|null){
 const engine=useRef<AmbientAudio|null>(null),version=useRef(0);
 const[enabled,setEnabled]=useState(false),[error,setError]=useState<string|null>(null);
 const available=[...Object.values(ambientTracks),...Object.values(ambientEffects)].some(Boolean);
 const fail=useCallback(()=>{engine.current?.disable();setEnabled(false);setError("Audio belum dapat diputar.");},[]);
 const toggle=async()=>{if(!available)return;const request=++version.current;setError(null);if(enabled){engine.current?.disable();setEnabled(false);return;}try{const session=engine.current||(engine.current=new AmbientAudio());await session.enable();if(request!==version.current){session.disable();return;}setEnabled(true);}catch{if(request===version.current)fail();}};
 useEffect(()=>{let live=true;const update=()=>{const session=engine.current;if(!session||!enabled)return;if(document.hidden||!room){session.pause();return;}void session.enable().then(()=>live?session.setRoom(ambientTracks[room]):undefined).catch(()=>{if(live)fail();});};update();document.addEventListener("visibilitychange",update);return()=>{live=false;document.removeEventListener("visibilitychange",update);};},[enabled,room,fail]);
 useEffect(()=>()=>{version.current++;engine.current?.dispose();},[]);
 const effect=useCallback((kind:keyof typeof ambientEffects)=>{if(enabled&&room&&!document.hidden)void engine.current?.playEffect(ambientEffects[kind]).catch(()=>{});},[enabled,room]);
 return{enabled,available,error,toggle,effect};
}
