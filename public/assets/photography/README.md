# Foto asli NOVA NODE

Simpan hanya foto yang berhak kamu publikasikan di folder ini. Tidak ada foto contoh atau karya buatan AI yang disertakan.

Di `src/data/portfolio.ts`, ganti satu `photo: null` pada `photoSlots` dengan data fotomu. Contoh berikut adalah format, bukan aset yang sudah tersedia:

```ts
{
  id: "01",
  category: "Landscape",
  photo: {
    id: "id-foto-asli-yang-unik",
    title: "Judul fotomu",
    alt: "Deskripsikan isi foto asli secara konkret",
    category: "Landscape",
    src: "/assets/photography/nama-file-sesudah.webp",
    beforeSrc: "/assets/photography/nama-file-sebelum.webp", // hapus jika tidak punya pasangan
    caption: "Keterangan foto yang telah kamu konfirmasi",
  },
}
```

Siapkan 10–20 foto (default 16 slot), gunakan ID unik, dan isi alt text. Kategori: Landscape, Street, Event, Cinematic. Foto baru otomatis masuk galeri serta cetakan tergantung di darkroom. Penanda slot kosong tetap diberi label menunggu foto asli.

Sebaiknya gunakan WebP/JPEG yang sudah dioptimalkan untuk web, bukan file RAW. Pasangan grading harus memiliki framing dan rasio sama. `src` adalah foto sesudah, `beforeSrc` foto sebelum. Jika pasangan tidak ada, slider tidak ditampilkan. Foto ditampilkan dengan rasio asli di cetakan 3D.

Untuk mencoba perbandingan tanpa menerbitkan foto, buka terminal Inspeksi / grading dan pilih dua file lokal. Pratinjau ini tidak mengubah data repository dan tidak diunggah.
