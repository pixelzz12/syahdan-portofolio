# Verifikasi NOVA NODE

## Scroll stop, curved avatar, and EV idle update

Production build and TypeScript passed. `scripts/scroll-motion-test.cjs` verifies large forward/reverse targets settle exactly with zero residual velocity for both corridor and room damping. Browser checks in `.qa/check-scroll-ev.cjs` passed large repeated wheel input, reversal, a native touch swipe, stable camera/scroll after input stops, the corrected `syhdaann12` Instagram URL, and all six Read Mode sectors. EV's actual blink, arm-wave envelope and code bubble were observed on the rendered scene; `.qa/ev-idle-bubble.png` was visually reviewed. Idle sequences are local scripts and do not invoke an AI service.

`.qa/check-arrival-motion.cjs` passed desktop and touch mobile, including reduced motion, avatar travel left and forward along an arc, individually staggered letter arcs inside wall bounds, fading centered H, reverse-scroll restoration, physical avatar profile entry/return, no horizontal overflow and no uncaught browser errors.

## Flat pixel title, illustrated operator and wall details

Replaced the extruded title with original flat bitmap lettering reading **SYAHDAN / PORTFOLIO WEBSITE**, preserving its world placement and lightweight proximity blur. Added six sparse procedural wall-note clusters: field sketches, service diagrams and a light study with tape and small maintenance shelves, positioned outside all door openings. No reference-site art or project photographs were imported.

Added the original hand-painted illustrated avatar requested by the owner: medium-long curtain hair, industrial jacket and a camera. Its transparent WebP is 683 × 1024 and 84,594 bytes. It stands beside EV and opens Operator’s Quarters when selected in the corridor. The real portrait remains unconfigured; the illustration is not represented as an authentic photo. Generation/edit prompts and paths are recorded in `AVATAR_ASSET.md`.

Production build including TypeScript passed. Focused Chromium checks passed on desktop and touch mobile: avatar asset loading and physical avatar selection, profile details, exact saved-position return, all six interiors and first-object inspections, loop after the decorated atrium, Read Mode content, no horizontal overflow, and no uncaught browser errors. Screenshots `.qa/avatar-desktop.png`, `.qa/avatar-mobile.png` and `.qa/wall-details-atrium.png` were inspected. Mobile testing identified native scrollTop rounding at fractional corridor spans; a retained scroll bias now preserves the exact logical cursor on restore/recenter instead of introducing a tiny negative cycle or cumulative return drift. No camera path or room layout was redesigned.

## Portfolio copy and confirmed contacts

Updated the reading toggle to **Read Mode**, the main reading heading to **Portfolio**, the owner's short introduction and EV heading to **Little Friend**. Removed the requested introduction subtitle and closing thank-you paragraph. Configured owner-supplied email `syahdanherdhiyanta12@gmail.com` and Instagram `https://instagram.com/syhdaan12`; GitHub remains unconfigured and disabled. Existing contact validation is retained.

Production build including TypeScript passed. Contact validation passed. Focused browser checks passed on desktop and mobile/WebGL fallback: headings, removed copy, introduction, EV title, exact mailto and Instagram URLs, one disabled GitHub control, no horizontal overflow or browser errors. The GitHub write attempt was rejected with 403; no remote files were changed. Four application files are staged locally in `.qa/github-update-copy/src/` for browser upload.

## Vercel preparation and requested title adjustment

- Preserved `d700bca` and its six rooms. Only the requested title treatment and deployment preparation changed: title height 3.85 → 3.5, bundled Optimer Bold with deeper extrusion/bevel and matte side faces, locally baked proximity blur that respects reduced motion.
- Production build and TypeScript passed after the title change. `npm ci --dry-run --ignore-scripts --no-audit --no-fund` passed; `npm audit --omit=dev --audit-level=high` reported zero vulnerabilities. Node 22.x is pinned in package and lockfile for Vercel parity.
- Production browser regression passed on desktop and mobile: all six physical interiors mounted their interactive meshes; first-object details, entry and return worked in every room; exactly one research AI projection; no uncaught browser errors or external runtime font/asset/API requests. Title before/passing screenshots were visually reviewed in `.qa/deploy-title*.png`.
- Accessibility suite passed again: mobile 320px/390px/landscape, all six reading sectors, grading panel lifecycle, technology archive, WebGL-disabled fallback and no-JavaScript content.
- No production environment variables, localhost service, database or AI integration is required. Assets use root-relative paths or bundled/procedural resources; authentic images remain intentional placeholders. Asset validation found 26 missing optional sources and zero invalid entries. Technology status validation passed.
- GitHub connector identifies `pixelzz12` but exposes no repository; local Git has no remote and Git Credential Manager lists no GitHub account. No Vercel connector, CLI login, project link or token is available. Deployment itself has **not** occurred; no public URL is claimed. `DEPLOYMENT.md` provides the exact source deploy command, GitHub push route, Vercel settings and public URL verification steps. `.vercelignore` excludes local builds, test artifacts and originals; `.vercel/` is ignored by Git.

## SYAHDAN redesign / 26 Oktober 2026

Perubahan ini melanjutkan enam interior yang sudah ada. Checkpoint implementasi: `ca22542`.

- Build produksi Webpack dan pemeriksaan TypeScript berhasil. Server produksi dipakai untuk tes browser.
- `scripts/redesign-test.cjs` **PASS**: judul geometri SYAHDAN; pintu akhir otomatis; loop maju/mundur; translasi kontinu melintasi pergantian siklus; snapshot posisi, quaternion, dan progress setelah kunjungan antar-ruangan; kamera Project Core; lembar proyek bergerak saat inspeksi dan kamera tetap; perjalanan pesawat kertas dengan keyboard/reverse; klik MySQL 3D; filter/status/fallback logo; arsip HTML; touch camera dan arsip mobile.
- `scripts/accessibility-test.cjs` **PASS**: fallback WebGL, enam sektor HTML, viewport 320px/390px/landscape, buka/tutup grading mobile serta pembuangan state, arsip teknologi, dan portfolio tanpa JavaScript.
- Pengujian mesh ruangan memverifikasi semua objek utama di keenam interior, navigasi antar-ruangan, keenam ruangan pada touch mobile, 16 slot foto asli yang masih kosong, slider grading dari dua upload lokal khusus tes, pembuangan preview, status proyek, reduced motion EV, tepat satu proyeksi AI, dan kontak yang dinonaktifkan. Pemeriksaan mode baca terakhir dipisahkan ke suite aksesibilitas di atas.
- Tahap pintu pada `scripts/smoke-test.cjs` memverifikasi klik keenam pintu fisik, konten, lintasan masuk, pengembalian kamera, scroll maju/mundur dan parallax. Tahap ini dihentikan sesudah keenam pintu terverifikasi; pemeriksaan fallback dijalankan melalui suite aksesibilitas terfokus.
- `node scripts/technology-test.mjs` **PASS**: 81 ID unik, sebelas alat terkonfirmasi, 61 belum dikonfirmasi, dua sedang dipelajari, tujuh eksplorasi, maksimum enam kartu fisik per papan, inventaris logo hilang.
- `node scripts/assets-test.mjs` **PASS**: validasi dimensi/orientasi dan framing, tidak memperbesar gambar kecil, sumber tidak berubah, pemrosesan inkremental, penolakan overwrite, revisi terpisah, dan penolakan traversal path. Fixture tetap di `.qa/` dan tidak dipublikasikan.
- `node scripts/contact-links-test.mjs` **PASS**: validasi kanal kontak tetap berfungsi.
- `npm run assets:check`: 26 sumber autentik belum tersedia; tidak ada konfigurasi invalid. Kekurangan ini disengaja dan terdokumentasi dalam `ASSET_CHECKLIST.md`.

Screenshot dan pengukuran lokal berada di `.qa/` (diabaikan Git). Pengujian Chromium memakai renderer perangkat lunak pada komputer ini; hasil ini memverifikasi fungsi, bukan tolok ukur performa semua perangkat. Detail teknologi ada di `TECHNOLOGY_ARCHIVE.md`; cara menambah aset ada di `ASSET_GUIDE.md`.

Tanggal: 26 Oktober 2026. Repository dibuat dari nol; tidak ada kode Laravel yang dipindahkan.

Pembaruan lingkungan 3D dilakukan secara inkremental pada implementasi yang sudah berjalan. Halaman, data portfolio, mode baca, galeri, dan fallback dipertahankan. Koridor diperluas menjadi tiga volume sepanjang 88 meter, dengan rute kamera 74 meter, enam pintu geser fisik, dan vestibule kecil di balik tiap pintu.

## Hasil

- `npm install --no-audit --no-fund`: berhasil.
- `npm run typecheck`: berhasil, tanpa error TypeScript.
- `npm run build`: berhasil dengan Next.js 16.4.3 / Webpack, termasuk pemeriksaan TypeScript dan prerender halaman `/` serta halaman 404.
- `npm start`: berhasil menjalankan build produksi; respons HTTP 200.
- `npm run dev -- --port 3001`: berhasil; halaman dikompilasi dan mengembalikan HTTP 200 dengan konten portfolio.
- `node scripts/smoke-test.cjs`: seluruh pemeriksaan browser berhasil.
- `node scripts/rooms-test.cjs`: pemeriksaan interior dan inspector berhasil; rincian di bawah.
- `node --experimental-strip-types scripts/contact-links-test.mjs`: validasi kontak berhasil tanpa menerbitkan alamat pengujian.

Build pada mesin ini dijalankan dengan `NEXT_TELEMETRY_DISABLED=1` untuk menghindari kegagalan rename file konfigurasi telemetry Windows. Compiler Webpack dipakai untuk build dan dev karena subprocess CSS Turbopack gagal dalam lingkungan ini. Bukan error TypeScript atau kode aplikasi.

## Pemeriksaan browser otomatis

Chromium headless, renderer software SwiftShader. Desktop 1440 × 1000; mobile 390 × 844, 320 × 640, dan landscape 844 × 390 dengan touch emulation. Pembaruan terakhir diuji pada server produksi port 3010 agar server pengguna di port 3000 tetap berjalan.

- Halaman produksi merespons HTTP 200 dan canvas 3D dimuat.
- Keenam mesh pintu diklik langsung menggunakan koordinat proyeksi dari scene Three.js. Masing-masing terlihat dalam frustum kamera, tidak tertutup UI pada titik klik, dan membuka sektor yang benar.
- Posisi kamera setelah masuk membuktikan kamera melewati bidang dinding ke vestibule. Tombol Kembali mengembalikan posisi kamera dengan selisih kurang dari 0,2 meter dan scroll dengan selisih kurang dari 2 piksel.
- Translasi kamera diukur pada renderer: dari Z = 13 ke sekitar Z = 8,28 (maju 4,72 meter), kemudian kembali ke sekitar Z = 12,9994 setelah reverse scroll. Bukan transform atau zoom CSS.
- Pada sampel scroll yang sama, pintu dekat bergeser sekitar 34,74 piksel, sedangkan pintu jauh sekitar 9,59 piksel. Perbedaan ini memverifikasi parallax perspektif.
- Rekaman posisi, orientasi kamera, dan proyeksi pintu tersedia di `.qa/camera-measurements.json`. Instrumentasi hanya aktif lewat `?scene-qa=1`.
- Keenam tombol direktori membuka panel sektor yang sesuai.
- Direktori dapat dilipat/dibuka; luasnya kurang dari 10% viewport desktop yang diuji.
- Panel dan perjalanan kamera mengunci scroll; Escape menutup panel, perjalanan kembali memulihkan posisi, lalu scroll lock dilepas.
- Perjalanan menuju sektor dapat dibatalkan tanpa membuka panel.
- Beralih ke mode baca saat kamera bergerak melepaskan scroll lock. Tombol Jelajahi 3D kemudian dapat memuat ulang scene dengan sukses.
- Filter Street mengubah status pilihan dan menampilkan empty state yang sesuai.
- R&D menjelaskan bahwa EV belum terhubung ke AI.
- Kontak yang belum diberikan tidak menghasilkan tautan palsu.
- Mode baca menampilkan keenam sektor dan tautan anchor R&D berfungsi.
- Mobile tidak memiliki horizontal overflow dalam mode fasilitas dan mode baca; keenam tombol tetap terlihat pada lebar 320 piksel dan landscape.
- Tap pada direktori mobile membuka panel, dan tombol Tutup berfungsi.
- Saat WebGL dipaksa tidak tersedia, semua sektor ditampilkan dalam mode baca.
- Kehilangan konteks WebGL aktif disimulasikan melalui ekstensi `WEBGL_lose_context`; aplikasi beralih ke mode baca dengan keenam sektor tetap tersedia.
- Preferensi reduced motion tetap memungkinkan navigasi sektor dan tombol sektor berikutnya.
- Saat JavaScript dimatikan, keenam sektor HTML tetap terlihat.
- Tidak ada uncaught JavaScript page errors selama pengujian.

Screenshot diperiksa untuk tampilan desktop, atrium di tengah rute, mobile, landscape, dan panel mobile. Berkas lokal tersedia di `.qa/` (diabaikan Git): `desktop.png`, `corridor-scroll.png`, `reading-mode.png`, `mobile.png`, `mobile-320.png`, `mobile-844.png`, `mobile-panel.png`, `webgl-fallback.png`.

Pengujian awal menemukan konflik antara atribut `hidden` dan aturan Tailwind pada fallback tanpa JavaScript. Sudah diperbaiki menggunakan atribut status tampilan dan aturan noscript; pengujian lengkap sesudah perbaikan berhasil.

Regresi lingkungan menemukan bahwa disposal canvas yang disengaja oleh React Three Fiber semula dianggap sebagai kegagalan WebGL. Listener kini dipasang dan dilepas mengikuti lifecycle scene. Pergantian mode bolak-balik, perpindahan mode saat mendekati pintu, serta kehilangan konteks sungguhan berhasil diuji setelah perbaikan. Build produksi dan seluruh suite browser terakhir berhasil.

## Checkpoint 608cdc9 — tiga interior awal

Pada checkpoint 608cdc9, Development Bay, Operator’s Quarters, dan Film Processing Lab mendapatkan lantai, dinding, atap, lampu praktis, furnitur, serta objek 3D interaktif. Kamera masuk lebih jauh melalui vestibule lama. Panel detail tidak otomatis menutupi ketiga ruangan setelah masuk. Pada tahap tersebut sektor 04–06 masih memakai vestibule dan konten sebelumnya; ketiganya diselesaikan pada pembaruan berikut.

Suite interior menggunakan Chromium software renderer, desktop 1280 × 900 dan touch mobile 390 × 844. Reduced motion dipakai untuk menguji objek dengan cepat; suite koridor tetap memeriksa transisi normal dan parallax.

- Mesh profil, kamera, notebook, serta lokasi logo/pendidikan diklik langsung dan membuka detail yang benar.
- Keempat monitor Development Bay diklik. Campus Expo menampilkan **Dalam Pengembangan**; screenshot yang belum diberikan tidak diganti gambar contoh.
- Kabinet arsip, kartu cetakan pertama, dan konsol grading darkroom dapat diklik. Keenam belas slot arsip terdaftar, tanpa foto palsu.
- Klik objek dan tombol HTML setara mendukung navigasi. Escape menutup detail ke ruangan, sementara tombol Kembali membawa kamera ke koridor.
- Perpindahan langsung antarketiga ruangan berhasil. Geometri ruangan asal dipertahankan selama kamera keluar lewat vestibule.
- Tiga sudut pandang dan kontrol objek bekerja di mobile tanpa horizontal overflow.
- Dua PNG berwarna yang dibuat khusus tes dibuka sebagai file lokal sementara di inspector. Keyboard Home/End mengubah slider ke 0/100; drag pada gambar memindahkan batas pemotongan ke sekitar 75%.
- File tes tidak menjadi aset publik, tidak mengisi slot portfolio, dan tidak diunggah. Membuka ulang inspector setelah ditutup tidak menyisakan pratinjau/slider sementara.
- Inspector juga tersedia dalam mode baca melalui bagian fotografi. Menutup panel inspeksi inline melepas komponen dan pratinjau sementara.
- Tidak ada uncaught JavaScript errors selama suite interior.

Screenshot tambahan: `.qa/room-operator.png`, `.qa/room-development.png`, `.qa/room-film.png`, `.qa/room-mobile-operator.png`, `.qa/room-mobile-development.png`, `.qa/room-mobile-film.png`. Screenshot `.qa/grading-local-fixtures.png` hanya memperlihatkan fixture pengujian, bukan karya fotografi.

Disk C: sempat penuh dan satu penulisan file terhenti. Cache build yang dihasilkan repository dibersihkan, file dipulihkan dari Git, dan data lengkap diverifikasi sebelum implementasi dilanjutkan. Saat verifikasi akhir, Windows juga hampir kehabisan committed memory. Server dev proyek dipause sementara; build berhasil dengan `NEXT_TELEMETRY_DISABLED=1` dan `NODE_OPTIONS=--max-old-space-size=512 --max-semi-space-size=4`. Pemeriksaan TypeScript tetap aktif; tidak ada error yang diabaikan.

## Pembaruan enam ruangan — Workshop, R&D, Transmission

Ketiga interior berikut ditambahkan di atas checkpoint 608cdc9. Koridor dan susunan enam pintu dipertahankan; geometri tiga interior awal memakai helper yang sama setelah pemisahan kode, dan seluruh interaksinya diuji ulang. Keenam pintu kini masuk ke ruangan 3D, dengan detail HTML dibuka lewat objek atau tombol aksesibel.

- Workshop: workbench terhubung, model ESP32-C3/OLED dan Arduino, alat, kabel, serta tiga panel interaktif. Data awal kedua eksperimen tetap belum dikonfirmasi. Ledger memisahkan bagian belum selesai/belum dikonfirmasi dari bagian selesai yang masih kosong; tidak ada pencapaian baru yang dikarang.
- R&D: laptop coding, rak homelab, satu proyeksi AI melingkar statis, serta EV kecil dengan idle sederhana. Asisten LLM lokal dan homelab ditampilkan **Dalam Pengembangan**. Tidak ada chat atau klaim integrasi LLM operasional.
- Transmission: workstation dengan receiver dekoratif, terminal kontak, dan panel Email/GitHub/Instagram. Default ketiga kanal belum dikonfigurasi. Seluruh tampilan memakai validasi URL sebelum membuat tautan.

Hasil pemeriksaan terakhir:

- Build produksi berhasil, termasuk TypeScript dan prerender. Tidak ada dependensi runtime baru.
- Suite `rooms-test.cjs` berhasil untuk semua enam ruangan pada desktop 1280 × 900 dan touch mobile 390 × 844. Mesh semua panel baru, laptop, rak, proyeksi, EV, dan terminal kontak diklik langsung melalui koordinat proyeksi dari renderer.
- Keempat objek riset menampilkan status/rencana yang sesuai dan tidak memiliki kontrol chat. Scene QA menghitung tepat **satu** mesh proyeksi AI.
- Pada pengujian reduced motion, tinggi idle EV tetap sama antar-sampel. Pada suite gerakan normal, posisi idle EV berubah antarsampel; animasi nyata berjalan.
- Kanal kontak tanpa konfigurasi tidak menghasilkan anchor; tombol kanal dinonaktifkan dengan status yang dapat dibaca. Tiga kanal pada terminal utama dan tiap panel individual diperiksa.
- Uji fungsi validasi menerima email standar dan URL profil HTTPS yang sesuai; menolak alamat kosong, email tidak valid, protokol berbahaya, host salah, kredensial URL, port khusus, dan path profil tidak sesuai. Query pelacakan dinormalisasi keluar. Ini pemeriksaan format, bukan verifikasi keberadaan atau kepemilikan akun.
- Suite koridor berhasil: klik keenam pintu, translasi kamera maju/mundur dan parallax, perjalanan masuk serta kembali ke posisi semula, navigasi direktori, pembatalan transisi, pergantian mode baca/3D, kehilangan konteks WebGL, serta fallback tanpa JavaScript.
- Mobile koridor juga diperiksa pada 320 × 640 dan landscape 844 × 390. Semua enam room HUD diperiksa pada 390 × 844; tidak ada horizontal overflow.
- Pemeriksaan galeri, file lokal sebelum/sesudah, pembersihan pratinjau, serta akses inspector dari mode baca tetap berhasil.
- Tidak ada uncaught JavaScript errors dalam suite browser.

Screenshot baru: `.qa/room-workshop.png`, `.qa/room-research.png`, `.qa/room-transmission.png`, serta varian `room-mobile-*`. Screenshot ini adalah verifikasi lokal, bukan foto proyek atau bukti hardware asli.

Saat pengujian terakhir Windows kembali mengalami keterbatasan committed memory. Hanya server dev NOVA NODE yang dipause sementara agar server produksi dan browser test dapat berjalan. Aplikasi lain tidak dihentikan. Server dev dipulihkan di port 3000 setelah pemeriksaan.

## Batas verifikasi dan konten

- Belum diuji pada perangkat ponsel fisik, Safari, Firefox, atau GPU pengguna; performa aktual bergantung perangkat.
- Foto dan pasangan grading asli belum diberikan. Filter dan empty state diuji; slider diverifikasi menggunakan fixture lokal khusus tes, belum menggunakan karya asli operator. Data menyediakan 16 slot kosong yang dapat disesuaikan menjadi arsip 10–20 foto.
- Email dan profil sosial asli belum diberikan. Tidak ada tautan kontak aktif.
- Detail proyek, foto operator, dan logo resmi UNAIR masih menunggu aset/data.
- Model dan tekstur memakai geometri serta sapuan kuas prosedural sederhana. Semua enam interior memiliki sudut pandang terarah; belum ada kontrol berjalan bebas/FPS.
- EV hanya karakter visual. LLM lokal dan homelab masih dalam pengembangan.
- Deploy publik belum dilakukan. Repository siap diimpor ke Vercel atau hosting Next.js.
