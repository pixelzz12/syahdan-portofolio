"use client";
import {useEffect,useRef,useState} from "react";
import { contactChannels, contacts, type ContactKind } from "@/data/portfolio";
import { contactEntries } from "@/lib/contact-links";

export default function ContactPanel({ channel }: { channel?: ContactKind }) {
  const entries = contactEntries(contactChannels, contacts).filter(entry => !channel || entry.kind === channel);
  const [copyState,setCopyState]=useState("Salin email");
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
  async function copyEmail(email:string){
    try{await navigator.clipboard.writeText(email);setCopyState("Copied!");}catch{setCopyState("Gagal menyalin");}
    if(timer.current)clearTimeout(timer.current);
    timer.current=setTimeout(()=>setCopyState("Salin email"),2400);
  }
  return <div className="contact-channels">{entries.map(entry => <article key={entry.kind} className="contact-channel">
    <span className="eyebrow">TRANSMISSION / {entry.label.toUpperCase()}</span><h3>{entry.label}</h3>
    {entry.url ? <><span className="status complete">Tautan tersedia</span><a href={entry.url} target={entry.kind === "email" ? undefined : "_blank"} rel="noopener noreferrer" className="contact-channel-link">{entry.url.replace(/^mailto:/, "").replace(/^https:\/\//, "")} <span aria-hidden="true">↗</span></a></> : <><span className="status">{entry.configured ? "Tautan belum valid" : "Belum dipublikasikan"}</span><p>Alamat asli belum tersedia untuk kanal ini. Tautan akan aktif setelah alamat yang valid ditambahkan.</p><button disabled aria-label={`${entry.label} belum tersedia`}>Belum tersedia ↗</button></>}
    {entry.kind==="email"&&entry.url&&<button type="button" className="utility-button contact-copy" aria-live="polite" onClick={()=>copyEmail(entry.url!.slice(7))}>{copyState}</button>}
  </article>)}</div>;
}
