"use client";
import {useEffect,useRef} from "react";
import {sectors,type SectorId} from "@/data/portfolio";
import {evGuideRooms} from "@/data/ev-guide";
export default function FacilityMap({visited,room,current,onClose,onNavigate}:{visited:SectorId[];room:SectorId|null;current:number;onClose:()=>void;onNavigate:(id:SectorId)=>void}){
 const close=useRef<HTMLButtonElement>(null);
 useEffect(()=>{const previous=document.activeElement as HTMLElement|null;close.current?.focus({preventScroll:true});return()=>{if(previous?.isConnected)previous.focus({preventScroll:true});};},[]);
 return <aside className="facility-map ev-guide-panel" role="dialog" aria-modal="false" aria-labelledby="map-title" onKeyDown={e=>{if(e.key==="Escape"){e.stopPropagation();onClose();}}}><div className="ev-guide-heading"><div><span className="eyebrow">NOVA NODE / BLUEPRINT</span><h2 id="map-title">Facility Map</h2></div><button ref={close} onClick={onClose} aria-label="Tutup Map">×</button></div><p role="status">Eksplorasi {visited.length}/6 ruangan</p><progress aria-label="Progres eksplorasi" max={6} value={visited.length}/><p className="map-position">● {room?sectors.find(s=>s.id===room)?.name:`Koridor / dekat sektor ${sectors[current].number}`}</p><nav className="map-rooms" aria-label="Peta enam ruangan">{sectors.map(s=><button key={s.id} data-room={s.id} aria-current={room===s.id?"location":undefined} onClick={()=>onNavigate(s.id)}><strong>{s.number} / {s.name}</strong><small>{evGuideRooms[s.id]}</small><span>{room===s.id?"● Kamu di sini · ":""}{visited.includes(s.id)?"Sudah dikunjungi":"Belum dikunjungi"} ↗</span></button>)}</nav><p className="ev-guide-note">Progres disimpan untuk sesi tab ini.</p></aside>;
}
