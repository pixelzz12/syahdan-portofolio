"use client";

import { useEffect, useRef } from "react";
import { sectors, type SectorId } from "@/data/portfolio";
import PortfolioContent from "./PortfolioContent";
import { type RoomAction } from "@/data/rooms";
import RoomDetail from "./RoomDetail";

export default function SectorDialog({ id, onClose, onNavigate, onExit, detail, inRoom = false }: { id: SectorId; onClose: () => void; onNavigate: (id: SectorId) => void; onExit?: () => void; detail?: RoomAction | null; inRoom?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const sector = sectors.find(item => item.id === id)!;
  const index = sectors.indexOf(sector);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current!;
    element.showModal();
    return () => { element.close(); previous?.focus({ preventScroll: true }); };
  }, []);
  useEffect(() => { dialog.current?.querySelector(".dialog-body")?.scrollTo(0, 0); }, [id]);
  return <dialog ref={dialog} className={`sector-dialog ${inRoom ? `room-dialog ${detail?.kind==="project"?"project-dialog":""}` : ""}`} aria-labelledby="sector-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog-frame">
      <div className="dialog-top"><span className="mono"><i className="signal-dot" /> NOVA NODE / SECTOR {sector.number}</span><button className="close-button" onClick={onClose} aria-label={inRoom ? "Tutup detail dan kembali ke ruangan" : "Tutup sektor dan kembali ke koridor"}>Tutup <span aria-hidden="true">×</span></button></div>
      <div className="dialog-body"><div className="sector-heading"><span className="sector-big-number" style={{ color: sector.accent }}>{sector.number}</span><div><span className="eyebrow">{sector.label}</span><h2 id="sector-title">{detail?.label || sector.name}</h2><p>{sector.description}</p></div></div>{detail ? <RoomDetail key={detail.id} action={detail} /> : <PortfolioContent key={id} id={id} />}</div>
      <div className="dialog-bottom"><button onClick={onClose}>{inRoom ? "← Kembali ke ruangan" : "← Kembali ke koridor"}</button>{inRoom ? <button onClick={onExit}>Keluar ke koridor →</button> : <button onClick={() => onNavigate(sectors[(index + 1) % sectors.length].id)}>Sektor {sectors[(index + 1) % sectors.length].number} <span aria-hidden="true">→</span></button>}</div>
    </div>
  </dialog>;
}
