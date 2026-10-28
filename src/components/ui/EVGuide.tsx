"use client";
import {useEffect,useRef,useState} from "react";
import {sectors,type SectorId} from "@/data/portfolio";
import {evGuideRooms,evGuideTopics,evContext,evJokes} from "@/data/ev-guide";

export default function EVGuide({room,visitCount,onClose,onNavigate,onDetails}:{room:SectorId|null;visitCount:number;onClose:()=>void;onNavigate:(id:SectorId)=>void;onDetails?:()=>void}){
 const [topicId,setTopicId]=useState<string|null>(null),[ping,setPing]=useState(0);
 const panel=useRef<HTMLElement>(null),close=useRef<HTMLButtonElement>(null);
 const topic=evGuideTopics.find(item=>item.id===topicId);
 const destination=sectors.find(item=>item.id===topic?.destination);
 useEffect(()=>{
  const previous=document.activeElement as HTMLElement|null;
  close.current?.focus({preventScroll:true});
  return()=>{if(previous?.isConnected)previous.focus({preventScroll:true});};
 },[]);
 useEffect(()=>{panel.current?.scrollTo({top:0,behavior:"instant"});},[topicId]);
 return <aside ref={panel} id="ev-guide-panel" className="ev-guide-panel" role="dialog" aria-modal="false" aria-labelledby="ev-guide-title" onKeyDown={event=>{if(event.key==="Escape"){event.preventDefault();event.stopPropagation();onClose();}}}>
  <div className="ev-guide-heading"><div><span className="eyebrow">LOCAL / MAINTENANCE UNIT</span><h2 id="ev-guide-title">EV Guide</h2></div><button ref={close} type="button" onClick={onClose} aria-label="Tutup EV Guide">×</button></div>
  <p className="ev-guide-message" role="status" aria-live="polite">{topicId==="joke"?evJokes[ping%evJokes.length]:topic?.answer||evContext[room||"corridor"][visitCount%2]}</p>
  {destination&&<button type="button" className="ev-guide-go" onClick={()=>onNavigate(destination.id)}>Ke {destination.name} →</button>}
  {topicId==="rooms"&&<nav className="ev-guide-rooms" aria-label="Tujuan EV Guide">{sectors.map(room=><button type="button" key={room.id} onClick={()=>onNavigate(room.id)}><span>{room.number} / {room.name} ↗</span><small>{evGuideRooms[room.id]}</small></button>)}</nav>}
  {topicId==="intro"&&onDetails&&<button type="button" className="ev-guide-go" onClick={onDetails}>Catatan & rencana integrasi EV ↗</button>}
  <div className="ev-guide-questions" role="group" aria-label="Pertanyaan untuk EV">{evGuideTopics.map(item=><button type="button" key={item.id} aria-pressed={topicId===item.id} onClick={()=>{setPing(n=>n+1);setTopicId(item.id);window.dispatchEvent(new Event("nova:ev-greet"));}}>{item.question}</button>)}<button type="button" aria-pressed={topicId==="joke"} onClick={()=>{setPing(n=>n+1);setTopicId("joke");window.dispatchEvent(new Event("nova:ev-greet"));}}>Ada cerita kecil?</button></div>
  {ping>0&&ping%5===0&&<p className="ev-guide-secret" role="status">Log rahasia: EV menemukan biskuit berbentuk baut. Akses camilan diberikan.</p>}
  <p className="ev-guide-note">Panduan lokal · tanpa koneksi AI</p>
 </aside>;
}
