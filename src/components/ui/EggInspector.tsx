"use client";
import {useState} from "react";
import {secretNotes,type SecretId} from "@/data/expansion";
import type {RoomId} from "@/data/rooms";

export function EggInspector({id,unlocked=false}:{id:SecretId;unlocked?:boolean}){
 const[count,setCount]=useState(unlocked?3:0),[open,setOpen]=useState(unlocked);
 const note=secretNotes[id],terminal=id==="terminal";
 const reveal=()=>{if(id==="ev")window.dispatchEvent(new Event("nova:ev-greet"));if(terminal){const next=count+1;setCount(next);if(next>=3)setOpen(true);}else setOpen(value=>!value);};
 return <section className={`secret-note ${open?"is-open":""}`}><button className="text-link" onClick={reveal} aria-expanded={open}>{note.hint}{terminal&&!open?` (${count}/3)`:""} ↗</button>{open&&<div className="secret-message" role="status"><span className="eyebrow">CATATAN FASILITAS</span><p>{note.message}</p>{id==="ev"&&<small>Pesan lokal EV, bukan respons LLM.</small>}</div>}</section>;
}
export function RoomNotes({room}:{room:RoomId}){
 const entries=(Object.entries(secretNotes) as [SecretId,(typeof secretNotes)[SecretId]][]).filter(([,note])=>note.room===room);
 return entries.length?<details className="room-notes"><summary>Catatan kecil fasilitas</summary>{entries.map(([id])=><EggInspector key={id} id={id}/>)}</details>:null;
}
