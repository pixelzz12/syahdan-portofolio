# SYAHDAN asset workflow

## Authentic profile portrait

The current owner-supplied portrait is `IMG_8651.JPEG`. Its original is preserved in ignored `assets/source/profile/syahdan-profile-original-v2.jpeg`. The full, uncropped photograph is EXIF-oriented and optimized to `public/assets/profile/syahdan-profile-v2.webp` (720 × 960, quality 88), shared by Read Mode, Digital Profile Terminal and inspection through `profile.portrait`. The prior v1 asset is retained. No generative edits or retouching were applied; the illustrated 3D avatar remains separate.

## Read Mode motion

`src/components/useReadingMotion.ts` enhances only the active 2D reading view. IntersectionObserver reveals each node once; a small MutationObserver registers newly opened archive items. CSS provides the hero entrance, limited stagger, hover/focus feedback, active reading navigation and photo preview transitions. Finished card animation classes are removed so hover transforms remain available. The decorative parallax uses a passive scroll listener and one queued animation frame. Observers/listeners are disposed when returning to 3D. `prefers-reduced-motion` disables motion, and content remains visible without JavaScript or observer support. No new animation dependency is installed.

## Achievement, CV, audio and project expansion

Editable data: `src/data/expansion.ts`. Three authentic certificates are published with 768px thumbnails for the 3D wall. The GARUDA SMANTANG certificate uses `public/assets/achievements/jejak-emas-2026.webp`; its original PNG is preserved in ignored `assets/source/achievements/jejak-emas-2026.png`.

The owner also supplied the GASSMAPALA certificate (`Foto 1.jpg`) and SMARTIMOTION VIII certificate (`sertifikat_softfile_tajam.png`). Their originals are preserved in ignored `assets/source/achievements/gassmapala-pdd-original.jpg` and `smartimotion-viii-2026-original.png`. Full, uncropped WebP derivatives are published as `gassmapala-pdd.webp` and `smartimotion-viii-2026.webp`, with matching `-thumb.webp` variants in `public/assets/achievements/`. The documented role is Koordinator Publikasi, Dokumentasi, dan Desain, masa bakti 2025/2026. The SMARTIMOTION award is specifically Peserta Terbaik 1, dated 1 February 2026 at SMK Negeri 1 Kandeman. No document content was generated or retouched. The wall now displays five frames in three rows; OSN and FLS3N retain intentional document placeholders.

The owner supplied `CV_Muhammad_Syahdan_Herdhiyanta.pdf`. Its bytes are copied unchanged to `public/documents/Syahdan_CV.pdf`, and the original is retained in ignored `assets/source/documents/`. `cvDocument.src` is enabled for preview and download through the header shortcut, Operator's Quarters folder and Read Mode.

Still needed:

| Asset | Expected public path | Enable in data |
| --- | --- | --- |
| OSN participation document | `public/assets/achievements/osn-informatika-2024.webp` | Matching achievement `certificateSrc` |
| FLS3N participation document | `public/assets/achievements/fls3n-2025.webp` | Matching achievement `certificateSrc` |
| Seven ambience loops | `public/audio/corridor.mp3`, `operator.mp3`, `development.mp3`, `film.mp3`, `workshop.mp3`, `research.mp3`, `transmission.mp3` | Set each matching `ambientTracks` URL only after adding that file |
| Optional door/object sounds | `public/audio/door.mp3`, `object.mp3` | Set `ambientEffects.door` / `.object` |
| Four real project URLs | No file | `developmentProjects[].url` in `src/data/portfolio.ts` |

Certificate inputs can also be PNG/JPEG if their configured paths match; retain originals and optimize derivatives without changing document content. Audio must be owned or appropriately licensed; record the author, source and licence here when adding it. Keep loops short, seamless and quiet, without dominant music. MP3 is broadly supported; the Web Audio decoder also accepts supported WAV/OGG/WebM files. Ambient volume is 0.1, effects 0.055, with an 800ms crossfade. Audio remains unavailable without configured assets: no missing-file requests, no autoplay, no generated substitute audio. An explicit audio-button gesture creates the session. Hidden tabs, Read Mode, mute and unmount pause or dispose it.

CV controls validate the configured PDF before enabling preview/download. With no PDF configured, both controls show an honest preparation state and no PDF URL is requested. Preview uses a same-origin PDF iframe; Download serves the original file. Browser PDF support varies, so the download remains available when a valid document is configured.

Project sketches are labelled concept illustrations and do not claim to be authentic screenshots. Full prompts and source provenance are in [PROJECT_ILLUSTRATIONS.md](PROJECT_ILLUSTRATIONS.md). Configure real screenshots and thumbnails in `src/data/portfolio.ts` to supersede the sketches; configure full public HTTP(S) project URLs to enable Open Link. Missing URLs remain disabled.

The site intentionally ships without invented photographs, screenshots, credentials, or contact details. All six rooms remain usable while assets are missing.

## Originals and generated files

Keep original files in `assets/source/` (ignored by Git). Copy originals there; do not move your only copy. Configure filenames and IDs in `assets.config.json`. Run:

```powershell
npm run assets:check
npm run assets:build
```

The Sharp pipeline normalizes EXIF orientation, preserves aspect ratio, never enlarges images, and writes WebP variants under `public/assets/optimized/v1/`. Photography has a maximum 2000px display image, 640px gallery thumbnail, and 320px 3D texture. Profile images use 1200px / 320px; project, experiment and research images use 1600px / 640px / 320px. Width limits apply to the longest side. Originals are never modified.

`src/data/assets.generated.json` records generated URLs, source hashes and dimensions. The pipeline refuses to replace changed outputs. After changing an original, run `npm run assets:build -- --revision v2` (then v3, etc.). Old variants remain available. Identical inputs are skipped. Review `asset-report.json` for missing and invalid files. `--strict` makes missing optional assets fail validation. Missing optional originals are normal until supplied.

Add generated URLs to the editable content in `src/data/portfolio.ts`: `profile.portrait`, project `screenshot` / `thumbnail`, and `photos` or `photoSlots[].photo`. A photo requires an ID, title, truthful alt text, category and `src`. Thumbnail and 3D texture variants are resolved automatically from the manifest. Enable contact URLs only after they have been verified.

## Before / after photography

Use two authentic exports of the **same photograph**, with identical pixel dimensions, orientation and framing. For each pair, put the graded export in `assets/source/photography/NN.jpg`, the original-looking export in `assets/source/photography/grading/NN-before.jpg`, and explicitly set `framingConfirmed: true` in its config entry. The pipeline rejects unequal oriented dimensions and unconfirmed framing without cropping. Copy the generated `beforeSrc` into photo data and set `framingConfirmed: true` there too (or use the generated manifest). A browser check validates both natural image dimensions before enabling the slider.

The inspection desk also accepts two local JPEG, PNG, WebP or AVIF files, up to 20MB each. These remain on the device and are revoked when the panel closes. Users must confirm matching framing; equal dimensions alone cannot prove the same composition. Synthetic test images are kept in `.qa/` only and are never published as portfolio work.

## Official Universitas Airlangga logo

The user supplied `D:/Logo-UNAIR.png`. A proportionally resized 768px PNG is published at `public/assets/logos/unair-official.png`, configured through `profile.universityLogo`. The supplied artwork is displayed unchanged in the arrival-area wall plaque, Operator's Quarters education plaque, and Read Mode education section. The matte plaque mounts directly on the right corridor wall; no hologram or projector is used. Replace this file to update the artwork; do not generate or imitate the university logo.

## Technology Archive

Edit `src/data/technologies.ts` to add, remove, reorder, hide, or update tools. Each entry contains ID, name, category, editable experience status, logo path, short description, related project IDs and visibility. `alsoIn` supplies secondary categories; `featuredTechnologyIds` chooses six physical wall cards per room. The full searchable archive is available from each room's **Objek → Arsip teknologi**; each icon opens an entry. HTML reading mode preserves portfolio content.

The four statuses are `Pernah Digunakan`, `Sedang Dipelajari`, `Ingin Dieksplorasi`, and `Belum Dikonfirmasi`. Only the eleven tools explicitly confirmed by the owner are marked used. No percentage-based proficiency claims are made.

Technology SVGs in `public/assets/logos/technologies/` come from Simple Icons, with their pinned source URLs in `SOURCES.json` and CC0 notice in `LICENSE.md`. Marks remain the property of their owners. Re-download with `node scripts/fetch-technology-logos.mjs`. Missing logos display readable initials; SQL and general concepts intentionally have no invented corporate mark. CapCut currently needs a verified official or licensed asset. The flat SYAHDAN title uses original bitmap glyphs generated locally in PixelTitle.tsx, with PORTFOLIO WEBSITE beneath it. It has no remote font dependency or text extrusion. The original illustrated avatar is separate from authentic photography; see AVATAR_ASSET.md for its prompt, source, optimized WebP and placement. All room models, paper sheets, airplane, EV and painterly surface textures are procedural.

## Models

`public/assets/models/` is reserved for future approved lightweight models. Current rooms require no downloaded GLB assets. Do not add complex character models or claim EV has a working AI integration.

## Jersey Sample Preview

`src/data/jersey.ts` configures the sample title, concept, colors, details and optional `frontSrc` / `backSrc`. The current procedural jersey is a clearly labelled Sample Preview, not an authentic portfolio design. Room display and inspection share `JerseyModel`; no duplicate model or image files are required.

For authentic artwork, add owned front/back PNG or WebP images under `public/assets/jerseys/` and set the URLs (for example `/assets/jerseys/design-front.webp` and `design-back.webp`). Artwork fits the torso area without stretching; transparent margins are supported. Update the label and description only when authentic work is supplied. Rotation, zoom and front/back controls need no changes.

Facility Map stores visited sector IDs in `sessionStorage` (`nova-visited`) for this tab. A room counts after camera arrival; choosing an accessible sector in Read Mode also records the visit. No account or network storage is used. EV context lines and jokes are editable in `src/data/ev-guide.ts`; all responses remain local.

## Room expansion and Free Explore

Film Processing Lab now measures 10.8 × 14 units (previously 8.6 × 10), with a 5.8-unit ceiling, five prints per row, wider spacing, relocated archive/RAW storage, and a grading desk at the back. Two practical lamps cover the expanded floor. Photo planes keep their original proportions and existing thumbnail sources. Other room layouts retain their central aisles; no expansion was needed there.

`roomLimits` in `src/lib/free-explore.ts` matches the interior shell bounds. CameraNavigator remains the sole camera owner. On entering Free Explore it caches furniture bounding boxes from the active interior; invisible hotspots, flat signs, floor and overhead geometry are excluded. A 0.28-unit clearance and small movement steps prevent passing through walls and furniture. This is conservative bounding-box collision, not a physics simulation. Movement stays on the room's horizontal plane; drag changes yaw/pitch within safe limits. The doorway boundary is closed to free movement; use the existing Back control for corridor transitions.

Free input listeners are installed only while actively exploring, pause for inspections/maps/guide/CV, and release held input on blur or cancellation. WASD and touch direction buttons share one input ref. A drag threshold suppresses accidental object clicks after looking around. Return to Guided View clears the free pose hold and uses the existing damped camera transition. No extra renderer or camera is created for Free Explore.

## Corridor approach and exit motion

`src/lib/sector-cue.ts` provides the shared smooth proximity envelope. Existing door front panels move up to 0.76 units into the hall, shift slightly along the wall, and turn at most 0.22 radians toward the viewer. The perspective camera has a damped lateral cue of at most 0.32 units. Room shells and navigation targets remain fixed. Reduced-motion preference suppresses these offsets.

Camera position and orientation are independent. On exit, the camera backs through the open doorway while holding its room-facing yaw and pitch. Only after clearing the doorway into the hall does it align once to the saved corridor direction, using the shortest angular path with zero roll. The return path goes directly through the vestibule instead of following the corridor approach detour. Corridor snapshots, room-entry points, Free Explore and return positions are retained.
