"use client";
import {useEffect,useRef,useState} from "react";
import {cvDocument} from "@/data/expansion";

export function CVPanel(){
 const[ready,setReady]=useState(false),[preview,setPreview]=useState(false);
 useEffect(()=>{if(!cvDocument.src)return;const controller=new AbortController();fetch(cvDocument.src,{method:"HEAD",signal:controller.signal}).then(response=>{if(!controller.signal.aborted)setReady(response.ok&&!!response.headers.get("content-type")?.includes("application/pdf"));}).catch(()=>{if(!controller.signal.aborted)setReady(false);});return()=>controller.abort();},[]);
 return <section className="cv-panel" aria-label="CV Syahdan"><span className="eyebrow">CURRICULUM VITAE</span><h3>Muhammad Syahdan Herdhiyanta</h3><p>{ready?"Preview dan unduh dokumen CV asli.":"CV sedang disiapkan. Preview dan unduhan akan tersedia setelah dokumen asli ditambahkan."}</p><div className="utility-actions"><button className="utility-button" disabled={!ready} onClick={()=>setPreview(value=>!value)} aria-expanded={preview}>{preview?"Tutup preview":"Preview CV"}</button>{ready&&cvDocument.src?<a className="utility-button" href={cvDocument.src} download={cvDocument.filename}>Download CV ↓</a>:<button className="utility-button" disabled>Download CV ↓</button>}</div>{preview&&ready&&cvDocument.src&&<><iframe className="cv-preview" src={cvDocument.src} title="Preview CV Muhammad Syahdan Herdhiyanta"/><p className="small-note">Jika browser tidak mendukung preview PDF, gunakan Download CV.</p></>}</section>;
}
export default function CVDialog({onClose}:{onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const previous=document.activeElement as HTMLElement|null,overflow=document.body.style.overflow;const node=dialog.current!;node.showModal();document.body.style.overflow="hidden";return()=>{node.close();document.body.style.overflow=overflow;previous?.focus({preventScroll:true});};},[]);
 return <dialog ref={dialog} className="sector-dialog utility-dialog" aria-label="Preview dan Download CV" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div className="dialog-frame"><div className="dialog-top"><span className="mono">SYAHDAN / CV</span><button className="close-button" onClick={onClose}>Tutup ×</button></div><div className="dialog-body"><CVPanel/></div></div></dialog>;
}
