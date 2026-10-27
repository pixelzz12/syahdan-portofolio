"use client";
import {useState} from "react";
import {achievements,type Achievement} from "@/data/expansion";

function AchievementCard({item}:{item:Achievement}){
 const[failed,setFailed]=useState(false);
 return <article className="achievement-card"><span className="eyebrow">{item.category} / {item.year}</span><h3>{item.title}</h3><p>{item.description}</p>
  {item.certificateSrc&&!failed?<><img src={item.certificateSrc} alt={`Sertifikat asli ${item.title}`} loading="lazy" onError={()=>setFailed(true)}/><a className="text-link" href={item.certificateSrc} target="_blank" rel="noopener noreferrer">Lihat sertifikat ukuran penuh ↗</a></>:<p className="note">Dokumen asli belum ditambahkan. Informasi di atas mengikuti data yang diberikan Syahdan.</p>}
 </article>;
}
export default function AchievementArchive({selectedId}:{selectedId?:string}){
 const items=selectedId?achievements.filter(item=>item.id===selectedId):achievements;
 return <section className="achievement-archive" aria-label="Prestasi dan pengalaman"><h3>Prestasi & pengalaman</h3><div className="achievement-grid">{items.map(item=><AchievementCard key={item.id} item={item}/>)}</div></section>;
}
