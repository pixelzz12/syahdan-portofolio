import type { ContactKind, SectorId } from "./portfolio";
import {achievements,type SecretId} from "./expansion";

export type RoomId = SectorId;
export type RoomView = "overview" | "left" | "right";
export type RoomAction = { id: string; label: string; kind: "profile" | "interests" | "education" | "project" | "gallery" | "grading" | "photo" | "experiment" | "experiment-log" | "research" | "prototype" | "ev" | "contacts" | "contact" | "journey" | "technology" | "technology-archive" | "achievement" | "cv" | "secret"; projectId?: string; slotId?: string; channel?: ContactKind; technologyId?:string; archiveRoom?:RoomId; achievementId?:string;secretId?:SecretId;unlocked?:boolean };
export const hasInterior = (id: SectorId | null): id is RoomId => id !== null;
export const roomActions: Record<RoomId, RoomAction[]> = {
  development: [
    { id: "project-personal", label: "Website personal", kind: "project", projectId: "personal" },
    { id: "project-campus", label: "Campus Expo", kind: "project", projectId: "campus-expo" },
    { id: "project-coding", label: "Coding", kind: "project", projectId: "coding" },
    { id: "project-design", label: "UI/UX", kind: "project", projectId: "ui-ux" },
    { id: "secret-terminal",label:"Terminal diagnostik",kind:"secret",secretId:"terminal" },
  ],
  operator: [
    { id: "profile-terminal", label: "Profil operator", kind: "profile" },
    { id: "operator-camera", label: "Kamera & fotografi", kind: "interests" },
    { id: "operator-notebook", label: "Catatan & minat", kind: "interests" },
    { id: "university-plaque", label: "Pendidikan / UNAIR", kind: "education" },
    { id:"cv-folder",label:"Preview & Download CV",kind:"cv" },
    ...achievements.map(item=>({id:`achievement-${item.id}`,label:item.title,kind:"achievement" as const,achievementId:item.id})),
    { id:"secret-polaroid",label:"Kartu di balik bingkai",kind:"secret",secretId:"polaroid" },
  ],
  film: [
    { id: "photo-archive", label: "Buka arsip foto", kind: "gallery" },
    { id: "grading-console", label: "Inspeksi / grading", kind: "grading" },
  ],
  workshop: [
    { id: "experiment-esp32", label: "ESP32-C3 / OLED", kind: "experiment", projectId: "esp32-oled" },
    { id: "experiment-arduino", label: "Eksperimen Arduino", kind: "experiment", projectId: "arduino" },
    { id: "experiment-ledger", label: "Status eksperimen", kind: "experiment-log" },
    {id:"secret-ev",label:"Sapa EV",kind:"secret",secretId:"ev"},
    {id:"secret-circuit",label:"Uji sirkuit kecil",kind:"secret",secretId:"circuit"},
  ],
  research: [
    { id: "research-laptop", label: "Asisten LLM lokal", kind: "research", projectId: "local-llm" },
    { id: "homelab-rack", label: "Homelab server", kind: "research", projectId: "homelab" },
    { id: "ai-core", label: "Proyeksi AI / prototipe", kind: "prototype" },
    { id: "ev-robot", label: "EV / rencana integrasi", kind: "ev" },
    {id:"secret-relay",label:"Sinyal dari meja riset",kind:"secret",secretId:"relay"},
  ],
  transmission: [
    { id: "contact-terminal", label: "Terminal kontak", kind: "contacts" },
    { id: "contact-email", label: "Email", kind: "contact", channel: "email" },
    { id: "contact-github", label: "GitHub", kind: "contact", channel: "github" },
    { id: "contact-instagram", label: "Instagram", kind: "contact", channel: "instagram" },
  ],
};
export const roomViews: Record<RoomId, [string, string, string]> = {
  development: ["Inti proyek", "Sisi instalasi", "Arsip teknologi"],
  operator: ["Seluruh ruang", "Meja & catatan", "Pendidikan"],
  film: ["Seluruh ruang", "Cetakan foto", "Meja inspeksi"],
  workshop: ["Seluruh ruang", "Workbench ESP32", "Workbench Arduino"],
  research: ["Seluruh ruang", "Laptop & kode", "Homelab & EV"],
  transmission: ["Seluruh ruang", "Kanal kiri", "Kanal kanan"],
};
export const roomCameras: Record<RoomView, { position: [number, number, number]; look: [number, number, number] }> = {
  overview: { position: [0, 2.85, -4.2], look: [0, 1.9, -9] },
  left: { position: [0.65, 2.65, -5], look: [-2.3, 2.1, -8.3] },
  right: { position: [-0.65, 2.65, -5], look: [2.2, 2.1, -8.3] },
};
