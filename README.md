# SYAHDAN

Portfolio interaktif Muhammad Syahdan Herdhiyanta, dibuat dari nol dengan Next.js App Router, TypeScript, Tailwind CSS, React Three Fiber, dan Three.js. Tidak menggunakan atau memigrasikan proyek Laravel sebelumnya.

## Menjalankan

Gunakan Node.js 22.x, sama dengan versi yang dipatok untuk deployment Vercel.

```sh
npm install
npm run dev
```

Buka http://localhost:3000. Untuk produksi:

```sh
npm run typecheck
npm run build
npm start
```

## Deploy

Panduan khusus repository, perintah GitHub/Vercel, dan pemeriksaan produksi ada di [DEPLOYMENT.md](DEPLOYMENT.md). Tidak ada environment variable produksi yang wajib. Jalur tercepat adalah login Vercel lalu deploy langsung dari folder ini menggunakan CLI.

Impor repository ini di Vercel, pilih preset Next.js, gunakan `npm run build`, dan biarkan output directory default. Tidak memerlukan database, environment variable, backend, atau API key. Alternatif: hosting Node.js yang mendukung `npm start`. Deploy publik belum dilakukan dari workspace ini.

## Navigasi

- Scroll menggerakkan kamera perspektif melalui modul koridor berulang sepanjang 88 meter. Pintu akhir terbuka otomatis dan perjalanan dapat diteruskan atau dibalik tanpa batas. Scroll balik membalik perjalanan. Rute memiliki pergeseran lateral kecil untuk memperjelas parallax.
- Tiga volume arsitektur saling terhubung: Arrival Hall, Process Atrium yang lebih lebar/tinggi dengan jembatan perawatan, dan Research Wing. Enam pintu berada pada posisi berbeda sepanjang rute.
- Klik pintu atau direktori. Keenam sektor membawa kamera melalui vestibule ke ruangan 3D berisi furnitur dan objek interaktif. Koridor, pintu, serta tiga ruangan pertama dipertahankan dari checkpoint `608cdc9`.
- Di dalam ruangan, klik objek fisik atau tombol HTML yang setara untuk membaca detail. Escape dan Tutup mengembalikan tampilan detail ke ruangan. Tombol **Kembali ke koridor** atau **Keluar ke koridor** memulai perjalanan kembali ke posisi scroll semula.
- Gunakan tiga tombol sudut pandang untuk melihat terminal kiri/kanan atau cetakan, termasuk di mobile. Ruangan memakai sudut pandang terarah; belum ada kontrol berjalan bebas/FPS.
- Facility Directory dapat dilipat untuk memperluas pandangan. Judul SYAHDAN memakai tulisan pixel datar di ruang koridor, dengan PORTFOLIO WEBSITE di bawahnya; keenam sektor tetap tersedia melalui direktori.
- Tombol **Mode baca** langsung menampilkan seluruh konten portfolio. Tombol **Jelajahi 3D** kembali ke fasilitas.
- Ruangan, panel, dan transisi mengunci scroll koridor. Fokus keyboard kembali ke pemicu setelah panel ditutup; native dialog membatasi fokus selama terbuka. Scroll dibuka kembali setelah keluar ke koridor.
- Semua pintu punya tombol HTML setara dalam direktori. Tab dan Enter dapat digunakan tanpa mengklik canvas.
- Jika WebGL gagal atau konteksnya hilang, aplikasi beralih ke mode baca. Tanpa JavaScript, konten HTML tetap tampil.
- Menghormati `prefers-reduced-motion`: transisi kamera langsung, animasi idle EV dimatikan. Tidak ada suara.

## Mengubah konten

Seluruh data berada di `src/data/portfolio.ts` dengan tipe TypeScript.

1. Perbarui `profile`, proyek, dan status sesuai keadaan nyata. Jangan mengklaim fitur selesai sebelum terverifikasi.
2. Masukkan gambar milik sendiri ke `public/assets/` dan gunakan path `/assets/nama-file.jpg`.
3. Isi `profile.portrait` untuk foto operator. Isi `profile.universityLogo` hanya dengan logo resmi UNAIR yang diizinkan; logo hanya dirender di Operator’s Quarters. Default memakai teks universitas.
4. Isi `photoSlots` dengan foto asli: 16 slot tersedia, masing-masing `photo: null` sampai ada aset. Ganti `null` dengan `{ id, title, alt, category, src, caption? }`. Tambah/kurangi slot untuk arsip 10–20 foto. Array `photos` lama juga tetap didukung. Kategori: `Landscape`, `Street`, `Event`, `Cinematic`. Contoh lengkap ada di `public/assets/photography/README.md`.
5. Opsional tambahkan `beforeSrc` jika memiliki pasangan foto asli sebelum/sesudah. Kedua file harus memiliki rasio dan framing yang sama. Slider hanya muncul bila ada pasangan.
6. Isi `contactChannels.email`, `contactChannels.github`, dan `contactChannels.instagram` dengan alamat asli. Default ketiganya `null`. Email menerima alamat email biasa atau `mailto:`; GitHub/Instagram menerima URL profil HTTPS dengan host yang sesuai. Alamat kosong, protokol berbahaya, host salah, dan format tidak valid membuat tautan tetap nonaktif. Array `contacts` lama tetap didukung untuk label Email, GitHub, dan Instagram.
7. Tambahkan `url` ke proyek hanya setelah ada tautan asli. Tautan opsional disembunyikan bila belum ada.
8. `screenshot` pada proyek opsional dan hanya boleh menunjuk screenshot asli. Pertahankan ID `personal`, `campus-expo`, `coding`, dan `ui-ux`, karena ID menghubungkan data dengan terminal 3D.

## Enam interior interaktif

- **Development Bay:** Project Core berupa ruangan luas dengan empat lembar proyek 3D yang melayang. Scroll menggerakkan kamera pada jalur oval; pemilihan lembar memindahkannya ke depan kamera yang dijeda. Proyek personal, Campus Expo, coding, dan UI/UX membuka detail masing-masing. Campus Expo berlabel **Dalam Pengembangan**. Screenshot dan rincian yang belum diberikan tetap ditandai belum tersedia.
- **Operator’s Quarters:** meja profil, kamera, notebook, kabinet arsip, dan satu lokasi di dinding untuk logo resmi UNAIR. Terminal menampilkan Muhammad Syahdan Herdhiyanta, Teknik Informatika, Fakultas Vokasi, Universitas Airlangga, serta minat yang diberikan. Logo belum diberikan sehingga hanya teks yang tampil.
- **Film Processing Lab:** darkroom matte dengan 16 penanda cetakan tergantung, kabinet arsip, penyimpanan, dan meja inspeksi. Penanda slot bukan foto. Foto asli dari data akan tampil pada cetakan fisik, galeri, dan inspector; rasio gambar dipertahankan.
- **Experimental Workshop:** workbench electronics dengan model ESP32-C3/OLED, Arduino, kabel, alat, dan panel eksperimen. Ledger memisahkan proyek selesai dari proyek belum selesai/status belum dikonfirmasi. Data awal belum menyatakan ada eksperimen selesai.
- **R&D Chamber:** laptop coding, rak homelab sederhana, satu proyeksi lingkaran statis, dan EV ukuran kecil dengan idle ringan. Asisten LLM lokal dan homelab berlabel **Dalam Pengembangan**. EV belum terhubung ke model; tidak ada chat AI.
- **Transmission Room:** workstation komunikasi dengan terminal kontak serta panel Email, GitHub, dan Instagram. Klik objek membuka detail yang dapat dibaca; tautan email/profil hanya aktif jika URL valid sudah dikonfigurasi.

Status eksperimen berada di `hardwareProjects`, dengan ID `esp32-oled` dan `arduino`. Status `Selesai` disediakan untuk pekerjaan yang sudah selesai; `Dalam pengembangan` dan `Detail menyusul` tetap dibedakan. Data awal menggunakan status belum dikonfirmasi, sehingga model komponen tidak dianggap sebagai bukti proyek selesai. Riset menggunakan ID `local-llm` dan `homelab`, keduanya masih dalam pengembangan. Pertahankan ID agar terminal tetap mengarah ke detail yang benar.

Validasi kontak memeriksa format/protokol/host URL; tidak mengklaim akun telah diverifikasi atau layanan sedang online. Tidak ada alamat contoh yang diaktifkan sebagai kontak operator.

Meja inspeksi tersedia dari terminal darkroom maupun bagian fotografi dalam mode baca. Slider membandingkan dua sumber gambar asli; tidak melakukan grading palsu dengan filter CSS. Pasangan publik menggunakan `beforeSrc` dan `src`. Pengunjung juga dapat membuka dua file lokal untuk pratinjau sementara: file tetap di perangkat, tidak diunggah, tidak dipublikasikan, dan URL pratinjau dibuang ketika panel ditutup. JPEG, PNG, WebP, dan AVIF didukung, maksimal 20 MB per file. Gunakan rasio serta framing yang sama untuk pasangan sebelum/sesudah.

## Struktur

```text
src/app/                         Layout, metadata, halaman, gaya responsif
src/components/Facility.tsx      State fasilitas, scroll, fallback, mode baca
src/components/3d/Corridor.tsx   Geometri prosedural, pintu, kamera, EV
src/components/3d/CameraRig.tsx  Rute perspektif, kedatangan sektor, perjalanan kembali
src/components/3d/RoomInteriors.tsx Shell ruangan dan tiga interior awal
src/components/3d/RemainingInteriors.tsx Workshop, R&D, dan Transmission Room
src/components/3d/RoomProps.tsx  Meja, monitor, gambar, dan hotspot bersama
src/components/3d/MaintenanceRobot.tsx EV dan animasi idle sederhana
src/components/3d/Primitives.tsx Geometri dasar dan material painterly bersama
src/components/ui/              Konten semantik, galeri, dialog aksesibel
src/data/portfolio.ts           Profil dan data yang bisa diedit
src/data/rooms.ts               Pemetaan terminal, aksi objek, sudut pandang ruangan
src/lib/contact-links.ts        Validasi kanal kontak sebelum tautan diaktifkan
src/lib/facility-layout.ts       Volume arsitektur, posisi pintu, waypoint kamera
public/assets/                  Foto dan aset asli (belum tersedia)
```

## Aset dan informasi yang masih dibutuhkan

- Foto profil dan logo resmi UNAIR opsional.
- Foto landscape, street, event, cinematic beserta caption dan alt text; pasangan grading asli opsional.
- Email, GitHub, Instagram, atau kontak lain yang sudah dikonfirmasi.
- Detail dan tautan website personal, Campus Expo, contoh coding, dan studi kasus UI/UX.
- Status nyata, foto rangkaian, komponen, dan kode eksperimen ESP32-C3/OLED serta Arduino.
- Dokumentasi LLM lokal dan homelab setelah tersedia. Keduanya ditandai **Dalam pengembangan**.

## Batasan MVP

Model 3D memakai geometri prosedural dengan warna matte dan sapuan kuas ringan. Keenam ruangan memiliki interior dan objek interaktif, dengan tiga sudut pandang terarah. Belum memakai tekstur buatan seniman, karakter manusia, model GLB, kontrol FPS, audio, atau efek lanjutan. EV hanya karakter visual untuk rencana integrasi mendatang; tidak ada chat AI. Galeri publik dan kontak menunggu data asli. WebGL memerlukan perangkat/browser yang mendukungnya; mode baca selalu tersedia.

Arsitektur kini mencakup penyangga diagonal, portal antarvolume, jembatan dan catwalk perawatan, pipa utilitas, kabinet servis, lampu praktis amber, serta aksen teal yang terbatas. Tiga tekstur canvas 256 × 256 dipakai bersama untuk cat, beton, dan logam matte; tidak ada unduhan tekstur besar atau efek pascaproses.

## Pemeriksaan

Jika konsol menampilkan hydration mismatch dengan atribut `data-darkreader-*`, ekstensi Dark Reader mengubah HTML sebelum React aktif. Aplikasi menyatakan `color-scheme: dark` dan memasang [meta `darkreader-lock` resmi](https://github.com/darkreader/darkreader/blob/main/CONTRIBUTING.md#disabling-dark-reader-on-your-site) karena sudah memiliki tema gelap sendiri. Setelah pembaruan, muat ulang penuh dengan Ctrl+Shift+R. Jika ekstensi masih menyuntikkan atribut, nonaktifkan Dark Reader khusus untuk localhost, lalu muat ulang. Jangan menonaktifkan pemeriksaan hydration secara global.

Jalankan `npm run typecheck` dan `npm run build`. Hasil pemeriksaan aktual dan batasan browser dicatat di `VERIFICATION.md`.

Pemeriksaan browser opsional (tidak dibutuhkan untuk menjalankan atau deploy):

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
npm run build
npm start
# Di terminal kedua:
node scripts/smoke-test.cjs
node scripts/rooms-test.cjs
node --experimental-strip-types scripts/contact-links-test.mjs
```

Gunakan `NOVA_BASE_URL` untuk URL lokal selain `http://localhost:3000`. Jika memakai runtime Playwright yang sudah ada, isi `NOVA_PLAYWRIGHT_PATH` dengan path paket dan `NOVA_BROWSER_PATH` dengan path executable Chromium. Screenshot pemeriksaan tersimpan di `.qa/` dan tidak dimasukkan ke Git. Build dan dev memakai compiler Webpack yang didukung Next.js untuk menghindari masalah subprocess Turbopack pada lingkungan Windows ini.

Script browser memakai `?scene-qa=1` untuk membaca posisi kamera dan proyeksi pintu dari renderer. Instrumentasi ini hanya aktif ketika flag diberikan dan tidak membuat kontrol tambahan pada tampilan. Pengujian mengukur translasi kamera maju/mundur, perbedaan perpindahan layar objek dekat/jauh, klik keenam mesh pintu, masuk vestibule, dan pemulihan posisi koridor. Pengukuran disimpan di `.qa/camera-measurements.json`.

Suite ruangan mengklik mesh terminal dan objek menggunakan koordinat proyeksi dari renderer, memeriksa detail dan status, perpindahan antar-ruangan, touch mobile, serta slider dengan file PNG sintetis khusus tes. Fixture itu hanya dipakai sebagai upload lokal selama pengujian; tidak menjadi foto portfolio atau aset publik.

Suite kini mencakup keenam ruangan, pemisahan status eksperimen, satu proyeksi AI, idle EV dan reduced motion, serta kanal kontak yang belum diaktifkan. Uji validasi kontak memakai Node 22+ dengan type stripping, tanpa dependensi tes tambahan; alamat contoh pada tes tidak dipublikasikan.


## Redesign SYAHDAN dan Technology Archive

Implementasi ini melanjutkan enam ruangan, bukan membangun ulang aplikasi. NOVA NODE tetap menjadi nama sistem sekunder. Kamera menyimpan posisi, quaternion, siklus koridor, dan progress saat memasuki ruangan; keluar setelah berpindah antar-ruangan mengembalikan snapshot asli tersebut.

Development Bay menyediakan Project Core dengan scroll kamera maju/mundur dan inspeksi lembar proyek. Operator’s Quarters menyediakan perjalanan pesawat kertas (scroll, swipe atau tombol panah), empat titik cerita, dan tombol keluar perjalanan. Semua objek lama tetap dapat digunakan melalui mesh atau tombol **Objek**. Pilih sudut pandang untuk menghentikan jalur terpandu.

Arsip teknologi dan alat: **Objek → Arsip teknologi**, atau buka **Arsip teknologi & alat** pada mode baca. Empat papan 3D masing-masing menampilkan enam ikon yang dipilih, sedangkan arsip HTML menyediakan daftar lengkap, pencarian, kategori, status, dan inspeksi. Edit `src/data/technologies.ts`; hanya 11 alat yang dikonfirmasi diberi status **Pernah Digunakan**. Web/programming yang belum dikonfirmasi tidak otomatis dianggap pengalaman pribadi. EV dan riset AI/homelab tetap belum terhubung ke layanan AI.

Lihat [ASSET_GUIDE.md](ASSET_GUIDE.md) untuk lokasi file, pemrosesan Sharp, versi keluaran, lisensi logo, dan integrasi data. [ASSET_CHECKLIST.md](ASSET_CHECKLIST.md) merinci aset asli yang belum disediakan. Jalankan `npm run assets:check` dan `npm run assets:build`; jangan mengganti gambar asli dengan hasil generatif. Perbandingan grading memerlukan dimensi dan framing yang cocok.

Jalankan terminal dari folder repository ini, lalu `npm run dev` (bukan `npm rum dev` dari folder pengguna). Buka `http://localhost:3000/`; server harus tetap berjalan.


Avatar ilustrasi berambut curtain dan berjaket industrial berada di samping EV; klik untuk memasuki profil. Dekorasi dinding berupa sketsa dan diagram original yang dibuat prosedural. Detail aset dan prompt tersedia di [AVATAR_ASSET.md](AVATAR_ASSET.md). Avatar ini terpisah dari foto profil asli dan arsip fotografi.

Avatar kini membuka jalur dengan lengkungan ke kiri dan maju saat kamera mendekat. Kamera koridor dan perjalanan ruangan mengikuti posisi scroll terakhir tanpa antrean gerak berkecepatan tetap; uji regresi: `node scripts/scroll-motion-test.cjs`. EV memiliki kedipan, lambaian, gerakan mata dan bubble potongan kode lokal yang bervariasi, dikendalikan di `src/components/3d/EVIdle.tsx`. Semua idle dimatikan pada reduced motion. Bubble bukan keluaran AI; integrasi LLM tetap dalam pengembangan. Instagram yang dikonfigurasi: `https://instagram.com/syhdaann12`.
