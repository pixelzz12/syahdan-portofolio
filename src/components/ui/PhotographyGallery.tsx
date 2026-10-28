"use client";

import { useEffect, useRef, useState } from "react";
import { assetThumbnail } from "@/lib/assets";
import { photoCategories, photoSlots, publishedPhotos, type Photo } from "@/data/portfolio";
import { GradingDesk, PhotoInspector } from "./PhotoInspector";

export default function PhotographyGallery() {
  const viewer=useRef<HTMLDivElement>(null),closeTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const [closing,setClosing]=useState(false);
  useEffect(()=>()=>{if(closeTimer.current)clearTimeout(closeTimer.current);},[]);
  function openPhoto(photo:Photo|null){if(closeTimer.current)clearTimeout(closeTimer.current);setClosing(false);setSelected(photo);}
  function closePhoto(){
    if(!viewer.current?.closest('.reading-mode[data-active="true"]')||matchMedia('(prefers-reduced-motion: reduce)').matches){openPhoto(null);return;}
    setClosing(true);if(closeTimer.current)clearTimeout(closeTimer.current);closeTimer.current=setTimeout(()=>{setSelected(null);setClosing(false);},180);
  }
  const [category, setCategory] = useState("Semua");
  const [selected, setSelected] = useState<Photo | null>(null);
  const [showSlots, setShowSlots] = useState(false);
  const [gradingOpen, setGradingOpen] = useState(false);
  const visible = publishedPhotos.filter(photo => category === "Semua" || photo.category === category);
  return <>
    <p className="section-intro">Mencari cerita dalam cahaya, ruang, dan momen kecil. {publishedPhotos.length} foto asli telah ditambahkan; {photoSlots.length} slot disiapkan untuk arsip.</p>
    <div className="filters" role="group" aria-label="Filter kategori fotografi">{["Semua", ...photoCategories].map(item => <button type="button" key={item} aria-pressed={category === item} className={category === item ? "selected" : ""} onClick={() => { setCategory(item); setSelected(null); }}>{item}</button>)}</div>
    {visible.length ? <div className="photo-grid">{visible.map(photo => <button type="button" key={photo.id} className="photo-card" onClick={() => openPhoto(photo)}><img src={assetThumbnail(photo.src,photo.thumbnailSrc)} alt={photo.alt} loading="lazy" /><span>{photo.title} ↗</span></button>)}</div> : <div className="empty-state"><span className="empty-icon" aria-hidden="true">▧</span><span className="mono">ARCHIVE / {category.toUpperCase()}</span><h3>Belum ada foto di ruang ini.</h3><p>Foto asli {category === "Semua" ? "beserta keterangan dan kategorinya" : `kategori ${category}`} belum ditambahkan. Tidak ada fotografi contoh yang diklaim sebagai karya operator.</p></div>}
    <button className="slot-toggle" onClick={() => setShowSlots(value => !value)} aria-expanded={showSlots}>{showSlots ? "Sembunyikan" : "Lihat"} {photoSlots.length} slot arsip ↓</button>
    {showSlots && <div className="archive-slots">{photoSlots.filter(slot => category === "Semua" || slot.category === category).map(slot => <div key={slot.id}><span className="mono">SLOT {slot.id} / {slot.category}</span><p>{slot.photo ? slot.photo.title : "Menunggu foto asli"}</p>{slot.photo && <button onClick={() => openPhoto(slot.photo)}>Inspeksi foto ↗</button>}</div>)}</div>}
    {selected && <div ref={viewer} className={`photo-viewer ${closing?"read-photo-closing":""}`} role="region" aria-label={`Penampil foto: ${selected.title}`}><button className="text-link" onClick={closePhoto}>← Tutup foto</button><PhotoInspector key={selected.id} photo={selected} /></div>}
    <details className="grading-inline" onToggle={event => setGradingOpen(event.currentTarget.open)}><summary>Meja inspeksi / color grading</summary>{gradingOpen && <GradingDesk />}</details>
  </>;
}
