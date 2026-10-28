import type {SectorId} from "./portfolio";

export type Achievement={id:string;title:string;shortTitle:string;category:string;year:string;description:string;certificateSrc:string|null;thumbnailSrc?:string;expectedFile:string};
export const achievements:Achievement[]=[
 {id:"jejak-emas",title:"Runner Up 1 — Lomba Esai Jejak Emas Mahasiswa Lintas Karsa 2026",shortTitle:"RUNNER UP 1 / ESAI",category:"Penghargaan",year:"2026",description:"Diselenggarakan oleh BEM Fakultas Vokasi Universitas Airlangga. Prestasi diraih bersama tim GARUDA SMANTANG.",certificateSrc:"/assets/achievements/jejak-emas-2026.webp",thumbnailSrc:"/assets/achievements/jejak-emas-2026-thumb.webp",expectedFile:"/assets/achievements/jejak-emas-2026.webp"},
 {id:"gassmapala",title:"Divisi PDD — GASSMAPALA",shortTitle:"PDD / GASSMAPALA",category:"Pengalaman organisasi",year:"2025–2026",description:"Divisi Publikasi, Desain, dan Dokumentasi GASSMAPALA, periode 2025–2026.",certificateSrc:null as string|null,expectedFile:"/assets/achievements/gassmapala-pdd.webp"},
 {id:"osn",title:"Partisipasi OSN Informatika 2024",shortTitle:"OSN / INFORMATIKA",category:"Partisipasi",year:"2024",description:"Partisipasi OSN Informatika 2024.",certificateSrc:null as string|null,expectedFile:"/assets/achievements/osn-informatika-2024.webp"},
 {id:"fls3n",title:"Partisipasi FLS3N 2025",shortTitle:"FLS3N / PARTISIPASI",category:"Partisipasi",year:"2025",description:"Partisipasi FLS3N 2025.",certificateSrc:null as string|null,expectedFile:"/assets/achievements/fls3n-2025.webp"},
];

// Original PDF supplied by the owner; keep the download bytes unchanged.
export const cvDocument={src:"/documents/Syahdan_CV.pdf" as string|null,expectedFile:"/documents/Syahdan_CV.pdf",filename:"Syahdan_CV.pdf"};
export type AmbienceRoom=SectorId|"corridor";
export const ambientTracks:Record<AmbienceRoom,string|null>={corridor:null,operator:null,development:null,film:null,workshop:null,research:null,transmission:null};
export const ambientEffects:{door:string|null;object:string|null}={door:null,object:null};

export const secretNotes={
 polaroid:{label:"Kartu di balik bingkai",message:"Hal kecil juga layak diperhatikan.",hint:"Balik kartu",room:"operator"},
 notebook:{label:"Catatan di balik sampul",message:"Satu eksperimen kecil hari ini, satu hal baru untuk dipelajari.",hint:"Buka catatan kecil",room:"operator"},
 terminal:{label:"Terminal diagnostik",message:'console.log("Tetap penasaran.");',hint:"Tekan Enter tiga kali",room:"development"},
 ev:{label:"Sapa EV",message:'EV.signal = "hello, human!";',hint:"Kirim sapaan lokal",room:"workshop"},
 circuit:{label:"Uji sirkuit kecil",message:"Sinyal diterima. Eksperimen sesungguhnya tetap mengikuti dokumentasi proyek.",hint:"Tes tombol sirkuit",room:"workshop"},
 "film-note":{label:"Catatan di belakang cetakan",message:"Tidak semua yang menarik berada di sisi depan.",hint:"Lihat sisi belakang",room:"film"},
 relay:{label:"Sinyal dari meja riset",message:"PING / rasa ingin tahu terhubung. Layanan LLM dan homelab masih dalam pengembangan.",hint:"Tes sinyal lokal",room:"research"},
} as const;
export type SecretId=keyof typeof secretNotes;
