import type { RoomId, RoomView } from "@/data/rooms";
import { roomCameras } from "@/data/rooms";
import { fraction, type RoomExperience } from "./scene-navigation";
export const aboutPoints = [
  { title: "Muhammad Syahdan Herdhiyanta", text: "Mahasiswa Teknik Informatika. Aku belajar lewat karya dan eksperimen." },
  { title: "Universitas Airlangga", text: "Teknik Informatika, Fakultas Vokasi. Logo resmi menunggu aset dari pemilik." },
  { title: "Fotografi & warna", text: "Fotografi, komposisi, dan color grading dengan Lightroom." },
  { title: "Belajar dengan mencoba", text: "Web, perangkat lunak, dan eksperimen ESP32-C3 / OLED. Dokumentasi berkembang bersama prosesnya." },
];
export function roomPose(room: RoomId, view: RoomView, experience: RoomExperience, progress: number) {
  if (room === "development") {
    if (experience === "project") {
      const angle = fraction(progress) * Math.PI * 2;
      return { position: [Math.sin(angle), 3.05 + Math.sin(angle) * 0.08, -10.5 + Math.cos(angle) * 6] as [number,number,number], look: [0, 2.4, -11] as [number,number,number] };
    }
    if (view === "right") return { position: [0,3.1,-13] as [number,number,number], look: [0,3.1,-18.3] as [number,number,number] };
    if (view === "left") return { position: [0,3,-7] as [number,number,number], look: [-3,2.8,-11] as [number,number,number] };
    return { position: [0,3.05,-4.5] as [number,number,number], look: [0,2.4,-11] as [number,number,number] };
  }
  if (room === "operator" && experience === "about") {
    const t = fraction(progress), angle = t * Math.PI * 2;
    const targets = [[-1.15,2.2,-9.4],[2.5,2.7,-12.3],[-2.3,1.6,-9.2],[0,1.6,-9.2],[-1.15,2.2,-9.4]];
    const index = Math.floor(t * 4), a = targets[index], b = targets[index + 1], u = t * 4 - index, blend = u*u*(3-2*u);
    return { position: [Math.sin(angle)*1.1,2.85,-5.75+Math.cos(angle)*1.25] as [number,number,number], look: a.map((v,i)=>v+(b[i]-v)*blend) as [number,number,number] };
  }
  return roomCameras[view];
}
