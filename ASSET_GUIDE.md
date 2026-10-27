# SYAHDAN asset workflow

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

The user supplied `D:/Logo-UNAIR.png`. A proportionally resized 768px PNG is published at `public/assets/logos/unair-official.png`, configured through `profile.universityLogo`. The supplied artwork is displayed unchanged in the arrival-area projection, Operator's Quarters education plaque, and Read Mode education section. The projection adds a restrained teal surround without recoloring or tracing the logo. Replace this file to update the artwork; do not generate or imitate the university logo.

## Technology Archive

Edit `src/data/technologies.ts` to add, remove, reorder, hide, or update tools. Each entry contains ID, name, category, editable experience status, logo path, short description, related project IDs and visibility. `alsoIn` supplies secondary categories; `featuredTechnologyIds` chooses six physical wall cards per room. The full searchable archive is available from each room's **Objek → Arsip teknologi**; each icon opens an entry. HTML reading mode preserves portfolio content.

The four statuses are `Pernah Digunakan`, `Sedang Dipelajari`, `Ingin Dieksplorasi`, and `Belum Dikonfirmasi`. Only the eleven tools explicitly confirmed by the owner are marked used. No percentage-based proficiency claims are made.

Technology SVGs in `public/assets/logos/technologies/` come from Simple Icons, with their pinned source URLs in `SOURCES.json` and CC0 notice in `LICENSE.md`. Marks remain the property of their owners. Re-download with `node scripts/fetch-technology-logos.mjs`. Missing logos display readable initials; SQL and general concepts intentionally have no invented corporate mark. CapCut currently needs a verified official or licensed asset. The flat SYAHDAN title uses original bitmap glyphs generated locally in PixelTitle.tsx, with PORTFOLIO WEBSITE beneath it. It has no remote font dependency or text extrusion. The original illustrated avatar is separate from authentic photography; see AVATAR_ASSET.md for its prompt, source, optimized WebP and placement. All room models, paper sheets, airplane, EV and painterly surface textures are procedural.

## Models

`public/assets/models/` is reserved for future approved lightweight models. Current rooms require no downloaded GLB assets. Do not add complex character models or claim EV has a working AI integration.
