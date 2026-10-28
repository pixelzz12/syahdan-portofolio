import type {SectorId} from "./portfolio";

// Local, editable guide responses. No model, API or generated chat history.
export const evGuideWelcome="Hai, aku EV. Mau menjelajahi bagian mana?";
export const evGuideTopics: {id:string;question:string;answer:string;destination?:SectorId}[]=[
 {id:"intro",question:"Siapa EV?",answer:"Aku EV, robot maintenance dan teman kecil Syahdan. Panduan ini memakai pilihan dan jawaban lokal. Integrasi asisten LLM masih Dalam Pengembangan."},
 {id:"rooms",question:"Ada ruangan apa saja?",answer:"Ada enam ruangan. Pilih salah satu, nanti kuantar ke sana."},
 {id:"web",question:"Proyek web di mana?",answer:"Di Development Bay: website personal, Campus Expo yang masih dikembangkan, eksplorasi coding, dan UI/UX. Klik monitor untuk melihat detailnya.",destination:"development"},
 {id:"photos",question:"Mau lihat fotografi",answer:"Ke Film Processing Lab untuk arsip foto dan meja inspeksi before–after. Slot yang belum diisi foto asli tetap ditandai sebagai placeholder.",destination:"film"},
 {id:"profile",question:"Kenalan dengan Syahdan",answer:"Operator’s Quarters menyimpan profil, pendidikan di Universitas Airlangga, CV, dan sertifikat Syahdan.",destination:"operator"},
 {id:"contact",question:"Bagaimana menghubunginya?",answer:"Terminal kontak ada di Transmission Room. Email dan Instagram tersedia; kanal lain aktif setelah tautannya dikonfigurasi.",destination:"transmission"},
];
export const evGuideRooms:Record<SectorId,string>={
 operator:"Profil, pendidikan, CV, dan prestasi.",
 development:"Proyek web, coding, dan UI/UX.",
 film:"Arsip fotografi dan inspeksi warna.",
 workshop:"ESP32, elektronik, dan catatan eksperimen.",
 research:"EV, asisten LLM lokal, dan homelab — Dalam Pengembangan.",
 transmission:"Email, Instagram, dan terminal kontak.",
};
