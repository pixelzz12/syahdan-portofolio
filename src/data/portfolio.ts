export type SectorId = "operator" | "development" | "film" | "workshop" | "research" | "transmission";
export type ProjectStatus = "Dalam pengembangan" | "Detail menyusul" | "Aset belum tersedia" | "Selesai";
export type Project = { id?: string; title: string; description: string; status: ProjectStatus; url?: string; screenshot?: string; thumbnail?:string;illustration?:string;illustrationThumbnail?:string;category?:string };
export type Sector = { id: SectorId; number: string; name: string; label: string; description: string; accent: string };
export type PhotoCategory = "Landscape" | "Street" | "Event" | "Cinematic";
export type Photo = { id: string; title: string; alt: string; category: PhotoCategory; src: string; beforeSrc?: string; caption?: string; thumbnailSrc?:string; framingConfirmed?:boolean };
export type PhotoSlot = { id: string; category: PhotoCategory; photo: Photo | null };
export type Contact = { label: string; value: string; url: string };
export type ContactKind = "email" | "github" | "instagram";
export const contactChannels: Record<ContactKind, string | null> = { email: "syahdanherdhiyanta12@gmail.com", github: null, instagram: "https://instagram.com/syhdaann12" };

export const profile = {
  name: "Muhammad Syahdan Herdhiyanta",
  shortName: "Syahdan",
  role: "Mahasiswa & penjelajah teknologi",
  focusAreas: ["Web development", "Fotografi", "Eksperimen teknologi"],
  introduction: "Halo, aku Syahdan. Mahasiswa Teknik Informatika Universitas Airlangga yang suka mengeksplorasi berbagai eksperimen teknologi dan menyukai fotografi.",
  university: "Universitas Airlangga",
  faculty: "Fakultas Vokasi",
  program: "Teknik Informatika",
  portrait: "/assets/profile/syahdan-profile-v1.webp" as string | null,
  universityLogo: "/assets/logos/unair-official.png" as string | null,
};

export const sectors: Sector[] = [
  { id: "operator", number: "01", name: "Operator’s Quarters", label: "Tentang aku", description: "Kenali operator di balik NOVA NODE.", accent: "#c7b58b" },
  { id: "development", number: "02", name: "Development Bay", label: "Web & antarmuka", description: "Dari ide, ke antarmuka, ke baris kode.", accent: "#8baaa4" },
  { id: "film", number: "03", name: "Film Processing Lab", label: "Fotografi", description: "Merekam cahaya dan cerita sehari-hari.", accent: "#c4a17c" },
  { id: "workshop", number: "04", name: "Experimental Workshop", label: "Perangkat & eksperimen", description: "Ruang untuk mencoba, merakit, dan belajar.", accent: "#b8aa76" },
  { id: "research", number: "05", name: "R&D Chamber", label: "AI lokal & homelab", description: "Catatan dari hal-hal yang sedang dibangun.", accent: "#83aaa9" },
  { id: "transmission", number: "06", name: "Transmission Room", label: "Kontak", description: "Tempat percakapan berikutnya dimulai.", accent: "#c3b6a4" },
];

export const developmentProjects: Project[] = [
  { id: "personal", illustration:"/assets/illustrations/personal-sketch-v1.webp",illustrationThumbnail:"/assets/illustrations/personal-sketch-thumb-v1.webp",category:"DEVELOPMENT / SKETCHBOOK", title: "Website personal", description: "Ruang untuk memperkenalkan diri dan mendokumentasikan karya. Rincian proyek serta tautan akan ditambahkan setelah dikonfirmasi.", status: "Detail menyusul" },
  { id: "campus-expo", illustration:"/assets/illustrations/campus-expo-sketch-v1.webp",illustrationThumbnail:"/assets/illustrations/campus-expo-sketch-thumb-v1.webp",category:"DEVELOPMENT / SKETCHBOOK", title: "Website Campus Expo", description: "Proyek website Campus Expo sedang dikembangkan. Fitur, teknologi, dan tautan publik belum dicantumkan karena belum dikonfirmasi.", status: "Dalam pengembangan" },
  { id: "coding", illustration:"/assets/illustrations/coding-sketch-v1.webp",illustrationThumbnail:"/assets/illustrations/coding-sketch-thumb-v1.webp",category:"DEVELOPMENT / SKETCHBOOK", title: "Eksplorasi coding", description: "Contoh kode dan repositori nyata akan ditambahkan di sini. Belum ada proyek contoh yang dipublikasikan.", status: "Detail menyusul" },
  { id: "ui-ux", illustration:"/assets/illustrations/ui-ux-sketch-v1.webp",illustrationThumbnail:"/assets/illustrations/ui-ux-sketch-thumb-v1.webp",category:"DEVELOPMENT / SKETCHBOOK", title: "Eksplorasi UI/UX", description: "Tempat untuk studi antarmuka dan proses desain. Aset dan studi kasus belum tersedia.", status: "Aset belum tersedia" },
];
export const hardwareProjects: Project[] = [
  { id: "esp32-oled", title: "ESP32-C3 & OLED", description: "Eksperimen ESP32-C3 Super Mini dengan mata berkedip pada layar OLED. Foto rangkaian, kode, hasil pengujian, dan status penyelesaian belum dikonfirmasi.", status: "Detail menyusul" },
  { id: "arduino", title: "Eksperimen Arduino", description: "Ruang catatan untuk eksplorasi Arduino. Detail komponen, kode, dan status eksperimen akan ditambahkan setelah tersedia.", status: "Detail menyusul" },
];
export const researchProjects: Project[] = [
  { id: "local-llm", title: "Local LLM assistant", description: "Eksplorasi asisten berbasis model bahasa yang berjalan secara lokal. Masih dalam pengembangan; belum ada integrasi AI yang dapat digunakan di portfolio ini.", status: "Dalam pengembangan" },
  { id: "homelab", title: "Homelab server", description: "Lingkungan server pribadi untuk belajar dan bereksperimen. Masih dalam pengembangan; belum ada layanan atau konfigurasi yang diklaim telah beroperasi.", status: "Dalam pengembangan" },
];

// Add only real, approved images and contact URLs. Empty collections intentionally render honest empty states.
export const photos: Photo[] = [];
export const photoCategories: PhotoCategory[] = ["Landscape", "Street", "Event", "Cinematic"];
export const contacts: Contact[] = [];

// Editable capacity, not a claim that photographs have been supplied.
export const photoSlots: PhotoSlot[] = [
  { id: "01", category: "Landscape", photo: null },
  { id: "02", category: "Street", photo: null },
  { id: "03", category: "Event", photo: null },
  { id: "04", category: "Cinematic", photo: null },
  { id: "05", category: "Landscape", photo: null },
  { id: "06", category: "Street", photo: null },
  { id: "07", category: "Event", photo: null },
  { id: "08", category: "Cinematic", photo: null },
  { id: "09", category: "Landscape", photo: null },
  { id: "10", category: "Street", photo: null },
  { id: "11", category: "Event", photo: null },
  { id: "12", category: "Cinematic", photo: null },
  { id: "13", category: "Landscape", photo: null },
  { id: "14", category: "Street", photo: null },
  { id: "15", category: "Event", photo: null },
  { id: "16", category: "Cinematic", photo: null },
];
export const publishedPhotos: Photo[] = [...new Map([...photos, ...photoSlots.flatMap(slot => slot.photo ? [slot.photo] : [])].map(photo => [photo.id, photo])).values()];
