"use client";
import {useState} from "react";
import {profile,type SectorId} from "@/data/portfolio";
import {CVPanel} from "./CVPanel";

export default function ProfileInspection({onNavigate}:{onNavigate:(id:SectorId)=>void}){
 const [photoFailed,setPhotoFailed]=useState(false);
 return <article className="profile-terminal-inspection">
  <div className="profile-terminal-identity">
   <div className="profile-terminal-portrait">{profile.portrait&&!photoFailed?<img src={profile.portrait} alt={`Foto profil ${profile.name}`} width={720} height={960} onError={()=>setPhotoFailed(true)}/>:<span>Foto profil belum tersedia</span>}</div>
   <div><span className="eyebrow">DIGITAL PROFILE / OPERATOR 01</span><h3>{profile.name}</h3><p>{profile.role}</p><dl><dt>Pendidikan</dt><dd>{profile.program}<br/>{profile.university}</dd></dl></div>
  </div>
  <p className="profile-terminal-description">{profile.introduction}</p>
  <section aria-label="Fokus utama"><h4>Fokus utama</h4><ul className="profile-terminal-focus">{profile.focusAreas.map(area=><li key={area}>{area}</li>)}</ul></section>
  <div className="profile-terminal-tools"><CVPanel compact extraAction={<button type="button" className="utility-button" onClick={()=>onNavigate("transmission")}>Kontak / Transmission Room →</button>}/></div>
 </article>;
}
