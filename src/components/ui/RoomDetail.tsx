"use client";

import { developmentProjects, hardwareProjects, photoSlots, profile, researchProjects } from "@/data/portfolio";
import { type RoomAction } from "@/data/rooms";
import PortfolioContent from "./PortfolioContent";
import PhotographyGallery from "./PhotographyGallery";
import { GradingDesk } from "./PhotoInspector";
import ContactPanel from "./ContactPanel";
import TechnologyArchive,{TechnologyDetail} from "./TechnologyArchive";

export default function RoomDetail({ action }: { action: RoomAction }) {
  if(action.kind==="technology")return <TechnologyDetail id={action.technologyId||""}/>;
  if(action.kind==="technology-archive")return <TechnologyArchive room={action.archiveRoom}/>;
  if (action.kind === "contacts" || action.kind === "contact") return <><p className="section-intro">Punya ide, ingin berkolaborasi, atau bertukar cerita? Pilih kanal yang sudah dipublikasikan untuk membuka percakapan.</p><ContactPanel channel={action.channel} /></>;
  if (action.kind === "experiment" || action.kind === "research") {
    const project = (action.kind === "experiment" ? hardwareProjects : researchProjects).find(item => item.id === action.projectId);
    if (!project) return <p>Dokumentasi belum tersedia.</p>;
    const done = project.status === "Selesai";
    return <article className="terminal-detail"><span className={`status ${done ? "complete" : project.status === "Dalam pengembangan" ? "wip" : ""}`}>{done ? "Selesai" : project.status === "Dalam pengembangan" ? "Dalam Pengembangan" : "Status belum dikonfirmasi"}</span><h3>{project.title}</h3><p className="section-intro">{project.description}</p><div className="note">{action.kind === "research" ? "Visual di ruangan menggambarkan proyek yang masih dikembangkan. Belum ada integrasi AI atau layanan server operasional yang ditawarkan melalui website ini." : done ? "Status selesai mengikuti data yang dipublikasikan operator. Dokumentasi dan hasil pengujian tersedia melalui tautan jika telah diberikan." : "Eksperimen ini belum dipublikasikan sebagai pekerjaan selesai. Model komponen adalah ilustrasi ruang kerja; foto rangkaian dan hasil pengujian asli masih menunggu dokumentasi."}</div>{project.url && <a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">Lihat dokumentasi ↗</a>}</article>;
  }
  if (action.kind === "experiment-log") {
    const done = hardwareProjects.filter(project => project.status === "Selesai");
    const pending = hardwareProjects.filter(project => project.status !== "Selesai");
    return <div className="experiment-ledger"><section><h3>Belum selesai / belum dikonfirmasi</h3><p className="small-note">{pending.length} eksperimen. Status dan bukti pengerjaan mengikuti dokumentasi yang tersedia.</p>{pending.map(project => <article className="project-card" key={project.id}><span className={`status ${project.status === "Dalam pengembangan" ? "wip" : ""}`}>{project.status === "Dalam pengembangan" ? "Dalam Pengembangan" : "Status belum dikonfirmasi"}</span><h4>{project.title}</h4><p>{project.description}</p></article>)}</section><section><h3>Selesai</h3>{done.length ? done.map(project => <article className="project-card" key={project.id}><span className="status complete">Selesai</span><h4>{project.title}</h4><p>{project.description}</p></article>) : <p className="note">Belum ada eksperimen selesai yang dipublikasikan.</p>}</section></div>;
  }
  if (action.kind === "prototype") return <><span className="status wip">Dalam Pengembangan</span><p className="section-intro">Proyeksi melingkar ini adalah visual prototipe untuk eksplorasi asisten LLM lokal. Integrasi model masih direncanakan dan belum menyediakan percakapan AI.</p><div className="note">Satu proyeksi sederhana untuk menandai ruang riset. Belum terhubung ke layanan atau model lokal.</div></>;
  if (action.kind === "ev") return <><div className="ev-note"><div className="ev-face" aria-hidden="true"><i /><i /></div><div><span className="eyebrow">EV / maintenance unit</span><h3>Teman kecil untuk proses belajar.</h3><p>EV adalah karakter robot maintenance bergaya industrial. Animasi idle sederhana sudah tersedia. EV direncanakan menjadi antarmuka bagi asisten LLM lokal yang masih Dalam Pengembangan.</p></div></div><div className="note">EV belum terhubung ke model LLM. Belum ada AI chat atau respons otomatis di portfolio ini.</div></>;
  if (action.kind === "project") {
    const project = developmentProjects.find(item => item.id === action.projectId);
    if (!project) return <p>Data proyek belum tersedia.</p>;
    return <article className="terminal-detail"><span className={`status ${project.status === "Dalam pengembangan" ? "wip" : ""}`}>{project.status === "Dalam pengembangan" ? "Dalam Pengembangan" : project.status}</span><h3>{project.title}</h3><p className="section-intro">{project.description}</p>{project.screenshot ? <img src={project.screenshot} alt={`Screenshot asli ${project.title}`} /> : <div className="note">Screenshot dan dokumentasi asli belum ditambahkan.</div>}{project.url && <a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">Lihat proyek ↗</a>}</article>;
  }
  if (action.kind === "profile") return <PortfolioContent id="operator" />;
  if (action.kind === "education") return <div className="terminal-detail"><span className="eyebrow">Pendidikan</span><h3>{profile.university}</h3><p className="section-intro">{profile.faculty}<br />{profile.program}</p><p>Lokasi di dinding ruangan disediakan untuk satu logo resmi Universitas Airlangga. {profile.universityLogo ? "Aset resmi telah ditambahkan melalui data profil." : "Logo resmi belum diberikan; saat ini hanya nama universitas yang ditampilkan."}</p></div>;
  if (action.kind === "interests") return <><p className="section-intro">Aku {profile.shortName}, mahasiswa {profile.program} di {profile.university}. Aku senang mengeksplorasi hubungan antara kode, gambar, dan eksperimen teknologi.</p><div className="project-grid"><article className="project-card"><h3>Web development</h3><p>Ide, antarmuka, dan proses membangun website. Proyek serta status aktual dapat dibaca di Development Bay.</p></article><article className="project-card"><h3>Fotografi</h3><p>Landscape, street, event, dan cinematic. Foto asli akan ditambahkan ke Film Processing Lab setelah siap dipublikasikan.</p></article><article className="project-card"><h3>Eksperimen teknologi</h3><p>Ruang belajar untuk mikrokontroler, asisten LLM lokal, dan homelab. Dokumentasi serta status pengerjaan tetap ditandai sesuai data yang tersedia.</p></article></div></>;
  if (action.kind === "gallery") return <PhotographyGallery />;
  if (action.kind === "grading") return <GradingDesk />;
  const slot = photoSlots.find(item => item.id === action.slotId);
  return <><p className="section-intro">Slot {slot?.id} / {slot?.category}. {slot?.photo ? "Foto asli dari arsip operator." : "Belum diisi foto asli. Kartu di ruangan adalah penanda slot, bukan karya fotografi."}</p><GradingDesk initialPhoto={slot?.photo || null} /></>;
}
