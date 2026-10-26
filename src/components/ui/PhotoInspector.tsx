"use client";

import { useEffect, useId, useState } from "react";
import { publishedPhotos, type Photo } from "@/data/portfolio";
import { assetPairConfirmed } from "@/lib/assets";

export function PhotoInspector({ photo }: { photo: Photo }) {
  const [comparison, setComparison] = useState(50);
  const rangeId = useId();
  const [pairState,setPairState]=useState<"loading"|"matched"|"mismatch"|"error">("loading");
  const [framing,setFraming]=useState(photo.framingConfirmed===true||assetPairConfirmed(photo.src));
  useEffect(()=>{
    let cancelled=false;
    if(!photo.beforeSrc)return;
    const measure=(src:string)=>new Promise<[number,number]>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve([image.naturalWidth,image.naturalHeight]);image.onerror=()=>reject(new Error("Foto tidak dapat dibuka"));image.src=src;});
    Promise.all([measure(photo.src),measure(photo.beforeSrc)]).then(([a,b])=>{if(!cancelled)setPairState(a[0]===b[0]&&a[1]===b[1]?"matched":"mismatch");}).catch(()=>{if(!cancelled)setPairState("error");});
    return()=>{cancelled=true;};
  },[photo.src,photo.beforeSrc]);
  const paired = Boolean(photo.beforeSrc)&&pairState==="matched"&&framing;
  return <div className="photo-inspector">
    <h3>{photo.title}</h3>
    {photo.beforeSrc&&pairState==="matched"&&!photo.framingConfirmed&&!assetPairConfirmed(photo.src)&&<label className="framing-confirmation"><input type="checkbox" checked={framing} onChange={event=>setFraming(event.target.checked)}/> Saya memastikan kedua foto memiliki framing yang sama.</label>}
    {photo.beforeSrc&&pairState!=="matched"&&<p className="comparison-warning" role="status">{pairState==="loading"?"Memeriksa dimensi pasangan foto…":pairState==="mismatch"?"Dimensi foto berbeda. Gunakan dua foto dengan dimensi dan framing yang sama; gambar tidak dipotong otomatis.":"Pasangan foto tidak dapat dibuka. Periksa file sumber."}</p>}
    <div className={`comparison ${paired ? "paired" : ""}`} onPointerDown={event => {
      if (!paired) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      const rect = event.currentTarget.getBoundingClientRect();
      setComparison(Math.round(Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100))));
    }} onPointerMove={event => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
      const rect = event.currentTarget.getBoundingClientRect();
      setComparison(Math.round(Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100))));
    }}>
      <img src={photo.src} alt={photo.alt} draggable={false} />
      {paired && <><img className="before-image" src={photo.beforeSrc} alt={`${photo.alt}, sebelum color grading`} draggable={false} style={{ clipPath: `inset(0 ${100 - comparison}% 0 0)` }} /><div className="comparison-divider" style={{ left: `${comparison}%` }} aria-hidden="true"><span>↔</span></div><span className="image-label before-label">Sebelum</span><span className="image-label after-label">Sesudah</span></>}
    </div>
    {paired && <label className="comparison-label" htmlFor={rangeId}>Sebelum / sesudah<input id={rangeId} type="range" min="0" max="100" value={comparison} onChange={event => setComparison(Number(event.target.value))} aria-label="Bandingkan sebelum dan sesudah color grading" aria-valuetext={`${comparison}% foto sebelum`} /></label>}
    {photo.caption && <p className="small-note">{photo.caption}</p>}
  </div>;
}

export function GradingDesk({ initialPhoto }: { initialPhoto?: Photo | null }) {
  const pairs = publishedPhotos.filter(photo => photo.beforeSrc);
  const [selected, setSelected] = useState(pairs[0]?.id || "");
  const [before, setBefore] = useState<string | null>(null);
  const [after, setAfter] = useState<string | null>(null);
  const [error, setError] = useState("");
  const base = initialPhoto === undefined ? pairs.find(photo => photo.id === selected) : initialPhoto;
  useEffect(() => () => { if (before) URL.revokeObjectURL(before); }, [before]);
  useEffect(() => () => { if (after) URL.revokeObjectURL(after); }, [after]);
  function load(file: File | undefined, setter: (url: string) => void) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) { setError("Gunakan foto JPEG, PNG, WebP, atau AVIF."); return; }
    if (file.size > 20 * 1024 * 1024) { setError("Ukuran foto maksimal 20 MB untuk pratinjau di perangkat ini."); return; }
    setError(""); setter(URL.createObjectURL(file));
  }
  const source = after || base?.src;
  const beforeSource = before || base?.beforeSrc;
  const preview: Photo | null = source ? { id: "inspection", title: before || after ? "Pratinjau lokal / color grading" : base!.title, alt: before || after ? "Foto yang dibuka dari perangkat untuk inspeksi" : base!.alt, src: source, beforeSrc: beforeSource, category: base?.category || "Cinematic", caption: base?.caption,framingConfirmed:before||after?false:base?.framingConfirmed } : null;
  return <div className="grading-desk">
    <p className="section-intro">Bandingkan dua file foto asli sebelum dan sesudah color grading. Gunakan framing serta rasio gambar yang sama agar perbandingan akurat.</p>
    {initialPhoto === undefined && pairs.length > 0 && <label className="archive-select">Pasangan dari arsip<select value={selected} onChange={event => { setSelected(event.target.value); setBefore(null); setAfter(null); }}>{pairs.map(photo => <option key={photo.id} value={photo.id}>{photo.title}</option>)}</select></label>}
    {!preview && <div className="empty-state"><span className="mono">INSPECTION DESK / WAITING FOR ORIGINALS</span><h3>Belum ada pasangan foto asli.</h3><p>Tambahkan foto ke arsip, atau buka dua file milikmu dari perangkat untuk mencoba inspeksi sekarang.</p></div>}
    <div className="local-photo-inputs"><label>Foto sebelum<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={event => load(event.target.files?.[0], setBefore)} /></label><label>Foto sesudah<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={event => load(event.target.files?.[0], setAfter)} /></label></div>
    <p className="small-note">File lokal tetap di perangkatmu. Pratinjau ini tidak diunggah dan tidak ditambahkan ke portfolio. Tutup panel atau muat ulang untuk menghapus pratinjau.</p>
    {error && <p className="input-error" role="alert">{error}</p>}
    {preview && <PhotoInspector key={`${source}:${beforeSource}`} photo={preview} />}
    {preview && !beforeSource && <p className="note">Buka foto sebelum untuk mengaktifkan slider perbandingan.</p>}
  </div>;
}
