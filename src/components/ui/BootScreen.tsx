"use client";
import {useEffect,useRef,useState} from "react";

const steps=["Memeriksa dukungan 3D","Menghubungkan renderer","Menyiapkan visual koridor","Menampilkan frame pertama"];
export default function BootScreen({step,ready,reducedMotion,onRead,onDone}:{step:number;ready:boolean;reducedMotion:boolean;onRead:()=>void;onDone:()=>void}){
 const skip=useRef<HTMLButtonElement>(null),[slow,setSlow]=useState(false);
 useEffect(()=>{
  const targets=Array.from(document.querySelectorAll<HTMLElement>(".site-header,.facility-track,.reading-mode,.skip-link"));
  const previous=targets.map(node=>node.inert),overflow=document.body.style.overflow;
  targets.forEach(node=>{node.inert=true;});document.body.style.overflow="hidden";skip.current?.focus({preventScroll:true});
  return()=>{targets.forEach((node,i)=>{node.inert=previous[i];});document.body.style.overflow=overflow;
   const target=document.querySelector<HTMLElement>('.reading-mode[data-active="true"]')||document.querySelector<HTMLElement>("canvas");
   if(target){if(target.tagName!=="CANVAS")target.tabIndex=-1;target.focus({preventScroll:true});}
  };
 },[]);
 useEffect(()=>{const timer=setTimeout(()=>setSlow(true),8000);return()=>clearTimeout(timer);},[]);
 useEffect(()=>{if(!ready)return;if(reducedMotion){onDone();return;}const timer=setTimeout(onDone,520);return()=>clearTimeout(timer);},[ready,reducedMotion,onDone]);
 const completed=Math.max(0,Math.min(4,step));
 return <section className={`boot-screen ${ready?"boot-screen-ready":""}`} role="dialog" aria-modal="true" aria-labelledby="boot-title" aria-describedby="boot-message" aria-busy={!ready} onTransitionEnd={event=>{if(ready&&event.target===event.currentTarget&&event.propertyName==="opacity")onDone();}}>
  <div className="boot-scan" aria-hidden="true"/>
  <div className="boot-console">
   <div className="boot-top"><span>SYAHDAN <small>/ NOVA NODE</small></span><span className="boot-channel"><i/> NODE 00</span></div>
   <div className="boot-main"><div className="boot-unit" aria-hidden="true"><span className="boot-antenna"/><div className="boot-face"><i/><i/></div><span className="boot-unit-body"/></div><div><span className="boot-eyebrow">FACILITY STARTUP / PORTFOLIO</span><h2 id="boot-title">Sedikit rasa ingin tahu.<br/><em>Banyak ruang untuk dijelajahi.</em></h2></div></div>
   <div className="boot-progress-copy"><p id="boot-message" role="status" aria-live="polite">{ready?"Fasilitas siap. Selamat menjelajah.":steps[Math.min(completed,3)]}</p><strong aria-hidden="true">{String(completed*25).padStart(2,"0")}<small>%</small></strong></div>
   <div className="boot-progress" role="progressbar" aria-label="Persiapan fasilitas 3D" aria-valuemin={0} aria-valuemax={4} aria-valuenow={completed} aria-valuetext={`${completed} dari 4 tahap siap`}><div style={{width:`${completed*25}%`}}/></div>
   <ol className="boot-checks">{steps.map((label,index)=><li key={label} className={completed>index?"complete":completed===index?"active":""}><span aria-hidden="true">{completed>index?"✓":String(index+1).padStart(2,"0")}</span>{label}</li>)}</ol>
   <div className="boot-bottom"><p>{slow&&!ready?"Koneksi lambat? Seluruh portfolio tersedia di mode baca.":"Scroll untuk berjalan. Klik pintu untuk masuk."}</p><button ref={skip} onClick={onRead}>Masuk mode baca <span aria-hidden="true">↗</span></button></div>
   <span className="boot-corner boot-corner-a" aria-hidden="true">+</span><span className="boot-corner boot-corner-b" aria-hidden="true">+</span>
  </div>
  <div className="boot-footer" aria-hidden="true"><span>WEB / PHOTOGRAPHY / EXPERIMENTS</span><span>LOCAL FIELD STATION</span></div>
 </section>;
}
