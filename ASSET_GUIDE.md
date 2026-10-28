# SYAHDAN asset workflow

## Authentic profile portrait

The owner supplied `Foto 1.jpg`. The original is preserved in ignored `assets/source/profile/syahdan-profile-original.jpg`. The full, uncropped photograph is optimized to `public/assets/profile/syahdan-profile-v1.webp` (720 × 960, quality 88) and configured in `profile.portrait`. It appears in the operator profile and Read Mode; the illustrated 3D avatar remains a separate illustration. No generative edits or retouching were applied.

## Achievement, CV, audio and project expansion

Editable data: `src/data/expansion.ts`. The supplied GARUDA SMANTANG certificate is published intact as `public/assets/achievements/jejak-emas-2026.webp` with a 768px 3D thumbnail beside it. The original PNG is preserved in ignored `assets/source/achievements/jejak-emas-2026.png`. The award text, organizational role and participation entries follow the owner's supplied facts; only the first currently has a certificate image.

The owner supplied `CV_Muhammad_Syahdan_Herdhiyanta.pdf`. Its bytes are copied unchanged to `public/documents/Syahdan_CV.pdf`, and the original is retained in ignored `assets/source/documents/`. `cvDocument.src` is enabled for preview and download through the header shortcut, Operator's Quarters folder and Read Mode.

Still needed:

| Asset | Expected public path | Enable in data |
| --- | --- | --- |
| GASSMAPALA PDD document | `public/assets/achievements/gassmapala-pdd.webp` | Matching achievement `certificateSrc` |
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
