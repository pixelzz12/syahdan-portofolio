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

Expected original: `assets/source/logos/unair-official.svg`. Obtain the official file from the university; none has been provided. The pipeline copies this SVG unchanged to `public/assets/optimized/v1/logos/unair-official.svg`. Set `profile.universityLogo` to that URL after verifying permission and the correct official asset. The existing education plaque remains a clearly labeled placeholder. Do not generate or trace a university logo.

## Technology Archive

Edit `src/data/technologies.ts` to add, remove, reorder, hide, or update tools. Each entry contains ID, name, category, editable experience status, logo path, short description, related project IDs and visibility. `alsoIn` supplies secondary categories; `featuredTechnologyIds` chooses six physical wall cards per room. The full searchable archive is available from each room's **Objek → Arsip teknologi**; each icon opens an entry. HTML reading mode preserves portfolio content.

The four statuses are `Pernah Digunakan`, `Sedang Dipelajari`, `Ingin Dieksplorasi`, and `Belum Dikonfirmasi`. Only the eleven tools explicitly confirmed by the owner are marked used. No percentage-based proficiency claims are made.

Technology SVGs in `public/assets/logos/technologies/` come from Simple Icons, with their pinned source URLs in `SOURCES.json` and CC0 notice in `LICENSE.md`. Marks remain the property of their owners. Re-download with `node scripts/fetch-technology-logos.mjs`. Missing logos display readable initials; SQL and general concepts intentionally have no invented corporate mark. CapCut currently needs a verified official or licensed asset. Bundled Three.js Optimer Bold (Magenta Ltd., 2004) powers the extruded 3D SYAHDAN lettering. Its original typeface metadata and license are retained in the bundled font JSON. A soft silhouette is generated locally from the same outlines for proximity blur; no remote font or postprocessing package is required. All room models, paper sheets, airplane, EV and painterly surface textures are procedural.

## Models

`public/assets/models/` is reserved for future approved lightweight models. Current rooms require no downloaded GLB assets. Do not add complex character models or claim EV has a working AI integration.
