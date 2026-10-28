"use client";

import PhotographyGallery from "./PhotographyGallery";
import TechnologyShelf from "./TechnologyShelf";
import ContactPanel from "./ContactPanel";
import AchievementArchive from "./AchievementArchive";
import {CVPanel} from "./CVPanel";
import {RoomNotes} from "./EggInspector";
import {ProjectCard} from "./ProjectPresentation";
import { developmentProjects, hardwareProjects, profile, researchProjects, type Project, type SectorId } from "@/data/portfolio";

function Projects({ items }: { items: Project[] }) {
  return <div className="project-grid">{items.map(project=><ProjectCard key={project.id||project.title} project={project}/>)}</div>;
}

function SectorContent({ id }: { id: SectorId }) {
  switch (id) {
    case "operator": return <>
      <p className="section-intro">{profile.introduction}</p>
      <div className="operator-grid"><div className="portrait-slot">{profile.portrait ? <img src={profile.portrait} alt={`Foto profil ${profile.name}`} width="720" height="960" loading="lazy" /> : <><div className="operator-mark" aria-hidden="true">S<span>↗</span></div><span className="mono">OPERATOR / SYAHDAN</span><small>Foto profil belum ditambahkan</small></>}</div>
      <div className="operator-info"><span className="eyebrow">Di balik fasilitas</span><h3>{profile.name}</h3><p>{profile.role}</p><div className="education">{profile.universityLogo && <img src={profile.universityLogo} alt="Logo resmi Universitas Airlangga" width="56" height="56" />}<span className="mono">PENDIDIKAN</span><h4>{profile.university}</h4><p>{profile.faculty}<br />{profile.program}</p></div></div></div>
      <div className="interest-tags">{profile.focusAreas.map(area=><span key={area}>{area}</span>)}</div>
      <AchievementArchive/><CVPanel/>
    </>;
    case "development": return <><p className="section-intro">Tempat ide diterjemahkan menjadi antarmuka dan kode. Beberapa masih berupa proses, dan proses itu juga bagian dari karya.</p><Projects items={developmentProjects} /></>;
    case "film": return <PhotographyGallery />;
    case "workshop": return <><p className="section-intro">Belajar lewat benda yang bisa dirakit dan diuji. Dokumentasi di bawah disiapkan untuk eksperimen nyata; hasilnya belum dipublikasikan.</p><Projects items={hardwareProjects} /><div className="note"><span aria-hidden="true">↳</span> Foto rangkaian, daftar komponen, dan repositori akan ditambahkan setelah tersedia.</div></>;
    case "research": return <><p className="section-intro">Ruang untuk pertanyaan yang belum selesai dijawab. Dua eksplorasi berikut masih dalam pengembangan.</p><Projects items={researchProjects} /><div className="ev-note"><div className="ev-face" aria-hidden="true"><i /><i /></div><div><span className="eyebrow">Kenalkan, EV.</span><h3>Little Friend</h3><p>EV adalah karakter robot kecil yang direncanakan sebagai antarmuka untuk asisten LLM lokal. Saat ini EV hanya karakter visual, belum terhubung ke AI dan belum menyediakan percakapan.</p></div></div></>;
    case "transmission": return <><p className="section-intro">Punya ide, ingin berkolaborasi, atau sekadar bertukar cerita? Ruang ini disiapkan untuk membuka percakapan.</p><ContactPanel /></>;
  }
}

export default function PortfolioContent({id}:{id:SectorId}) { return <><SectorContent id={id}/><RoomNotes room={id}/>{["development","workshop","film","research"].includes(id)&&<TechnologyShelf room={id}/>}</>; }
