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

export const evContext:Record<SectorId|"corridor",string[]>={
 corridor:["Koridor ini suka berputar. Tenang, aku hafal keenam pintunya.","Selamat datang! Aku EV. Pilih ruangan; jangan ikuti kabel yang belum diberi label."],
 operator:["Ini markas Syahdan. Terminal profil punya CV; aku cuma punya nomor seri.","Profil, pendidikan, dan sertifikat ada di sini. Mejanya lebih rapi daripada memoriku."],
 development:["Klik monitor untuk melihat proyek. Bug tidak termasuk dekorasi resmi.","Development Bay! Campus Expo masih dikembangkan. Satu commit lagi… katanya."],
 film:["Selamat datang di lab foto. Aku pandai berkedip, tetapi bukan saat memotret.","Arsip foto dan inspeksi warna ada di sini. Foto asli yang belum tersedia tetap ditandai."],
 workshop:["Di Workshop, ide dirakit pelan-pelan. Jersey di display masih Sample Preview.","ESP32, kabel, dan jersey contoh. Tolong jangan jahit kabel ke lengan bajunya."],
 research:["Rumahku! LLM lokal dan homelab masih Dalam Pengembangan. Aku menyapa lewat skrip lokal.","Selamat datang di R&D. Jangan khawatir: lingkaran itu bukan portal untuk tugas kuliah."],
 transmission:["Ingin menyapa Syahdan? Email bisa disalin di terminal kontak. Aku belum punya kotak masuk.","Transmission Room. Pesanmu dikirim lewat kanal kontak, bukan antenaku yang pendek ini."],
};
export const evJokes=["Kenapa aku tidak minum kopi? Takut Java-nya kebanyakan.","Aku sedang belajar istirahat. Progres: sleep(1000).","Pesan rahasia: baut cadangan kusimpan di… memory not found."];
