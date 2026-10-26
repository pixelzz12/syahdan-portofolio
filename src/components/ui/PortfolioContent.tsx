"use client";

import PhotographyGallery from "./PhotographyGallery";
import TechnologyShelf from "./TechnologyShelf";
import ContactPanel from "./ContactPanel";
import { developmentProjects, hardwareProjects, profile, researchProjects, type Project, type SectorId } from "@/data/portfolio";

function Projects({ items }: { items: Project[] }) {
  return <div className="project-grid">{items.map((project, i) => <article className="project-card" key={project.title}>
    <div className="project-top"><span className="mono">PROJECT / 0{i + 1}</span><span className={`status ${project.status === "Dalam pengembangan" ? "wip" : ""}`}>{project.status === "Dalam pengembangan" ? "Dalam Pengembangan" : project.status}</span></div>
    <h3>{project.title}</h3><p>{project.description}</p>
    {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-link">Lihat proyek ↗</a>}
  </article>)}</div>;
}

function SectorContent({ id }: { id: SectorId }) {
  switch (id) {
    case "operator": return <>
      <p className="section-intro">{profile.introduction}</p>
      <div className="operator-grid"><div className="portrait-slot">{profile.portrait ? <img src={profile.portrait} alt={profile.name} /> : <><div className="operator-mark" aria-hidden="true">S<span>↗</span></div><span className="mono">OPERATOR / SYAHDAN</span><small>Foto profil belum ditambahkan</small></>}</div>
      <div className="operator-info"><span className="eyebrow">Di balik fasilitas</span><h3>{profile.name}</h3><p>{profile.role}</p><div className="education">{profile.universityLogo && <img src={profile.universityLogo} alt="Logo resmi Universitas Airlangga" width="56" height="56" />}<span className="mono">PENDIDIKAN</span><h4>{profile.university}</h4><p>{profile.faculty}<br />{profile.program}</p></div></div></div>
      <div className="interest-tags"><span>Web development</span><span>Fotografi</span><span>Eksperimen teknologi</span></div>
    </>;
    case "development": return <><p className="section-intro">Tempat ide diterjemahkan menjadi antarmuka dan kode. Beberapa masih berupa proses, dan proses itu juga bagian dari karya.</p><Projects items={developmentProjects} /></>;
    case "film": return <PhotographyGallery />;
    case "workshop": return <><p className="section-intro">Belajar lewat benda yang bisa dirakit dan diuji. Dokumentasi di bawah disiapkan untuk eksperimen nyata; hasilnya belum dipublikasikan.</p><Projects items={hardwareProjects} /><div className="note"><span aria-hidden="true">↳</span> Foto rangkaian, daftar komponen, dan repositori akan ditambahkan setelah tersedia.</div></>;
    case "research": return <><p className="section-intro">Ruang untuk pertanyaan yang belum selesai dijawab. Dua eksplorasi berikut masih dalam pengembangan.</p><Projects items={researchProjects} /><div className="ev-note"><div className="ev-face" aria-hidden="true"><i /><i /></div><div><span className="eyebrow">Kenalkan, EV.</span><h3>Teman kecil. Rencana besar.</h3><p>EV adalah karakter robot kecil yang direncanakan sebagai antarmuka untuk asisten LLM lokal. Saat ini EV hanya karakter visual, belum terhubung ke AI dan belum menyediakan percakapan.</p></div></div></>;
    case "transmission": return <><p className="section-intro">Punya ide, ingin berkolaborasi, atau sekadar bertukar cerita? Ruang ini disiapkan untuk membuka percakapan.</p><ContactPanel /><p className="small-note">Terima kasih sudah menjelajahi NOVA NODE.<br />Selalu ada sesuatu yang baru untuk dipelajari.</p></>;
  }
}

export default function PortfolioContent({id}:{id:SectorId}) { return <><SectorContent id={id}/>{["development","workshop","film","research"].includes(id)&&<TechnologyShelf room={id}/>}</>; }
