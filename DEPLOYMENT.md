# Publish SYAHDAN to Vercel

This is the existing Next.js App Router portfolio, with all six rooms preserved. `d700bca` remains in Git history; the small follow-up lowers and restyles the 3D title, adds proximity blur, and prepares deployment. No new backend or portfolio features were added.

## Fastest route: Vercel CLI, GitHub optional

Run in **PowerShell** from this exact repository folder:

```powershell
Set-Location 'C:\Users\COLORFUL\Documents\Codex\2026-10-26\read-start-here-codex-md-and'
npx vercel@latest login
npx vercel@latest --prod
```

Complete the login in your browser. For setup, choose your personal Vercel account, **create a new project**, project name `syahdan-portfolio` (or an available name), directory `./`, and the detected **Next.js** settings. Do not link an unrelated existing project. Confirm deployment. The CLI prints the actual production HTTPS URL; use that URL for submission. No GitHub repository is required for this route. Do not use `--prebuilt`: Vercel should build from source for Linux.

On this computer no Vercel CLI, Vercel authentication, project link, deployment token, or Vercel connector was available during preparation, so no public URL has been created by the agent. GitHub's connector identifies `pixelzz12`, but exposes no repository for this project and cannot create one through its available tools. Local Git has no remote. Authentication is the remaining step; never paste a token into source files or chat.

## Vercel project settings

| Setting | Value |
|---|---|
| Framework preset | Next.js |
| Root directory | Repository root (`./`) |
| Node.js | 22.x (also pinned in `package.json`) |
| Install command | `npm ci` (include dev dependencies for TypeScript/Tailwind) |
| Build command | `npm run build` |
| Output directory | Leave Next.js default; do not enter `out` or `public` |
| Environment variables | None required |

The build script deliberately uses `next build --webpack`, matching the tested implementation. Vercel manages serving; do not set `npm start` as the build command. No `basePath`, external image CDN, custom server, API key, database, local LLM endpoint, or localhost service is needed. Do not configure `NODE_ENV=development`, `NODE_OPTIONS`, `NOVA_BASE_URL`, `NOVA_PLAYWRIGHT_PATH`, or `NOVA_BROWSER_PATH` on Vercel; those last three variables belong only to local QA.

## GitHub + Vercel automatic deployments

1. Sign in to [GitHub's new repository page](https://github.com/new). Owner `pixelzz12`, name `syahdan-portfolio`, choose private or public. Leave README, license and `.gitignore` initialization **unchecked**, since this repository already has history.
2. From this repository in PowerShell, run:

```powershell
git remote add origin https://github.com/pixelzz12/syahdan-portfolio.git
git push -u origin master
```

The local branch is `master`; use it as the Vercel production branch. Authenticate through Git Credential Manager if prompted. If `origin` already exists by the time you read this, inspect `git remote -v` and push to the correct repository rather than replacing an unrelated remote.

3. Open [Vercel New Project](https://vercel.com/new), authorize GitHub access to this repository, import `pixelzz12/syahdan-portfolio`, use the settings above, and choose **Deploy**.
4. Wait for **Ready**, open the assigned production domain, and verify it in an incognito window without being signed into Vercel. If authentication protection blocks assessors, adjust that project's Deployment Protection so the submitted production URL is public. No custom domain is necessary tonight.

Subsequent committed changes deploy with `git push`. Do not run `git init` again or force-push over `d700bca`.

## Assets and placeholders

`public/` uses origin-relative `/assets/...` paths. SVG technology logos are committed; fonts for 3D lettering are bundled by Webpack from the installed Three.js package. Industrial geometry, EV, paper airplane and painted surfaces are procedural. No GLB, texture or font is fetched from localhost or an external font service at runtime.

Missing portrait, authentic photos, screenshots, official UNAIR logo and contact URLs intentionally retain labeled placeholders/disabled controls. CapCut has a readable logo fallback. These do not block deployment. Do not run `assets:build` on Vercel: originals have not been supplied, and generated assets should be prepared locally and committed when available. See `ASSET_GUIDE.md` and `ASSET_CHECKLIST.md`.

`.gitignore` and `.vercelignore` exclude dependencies, generated builds, local test artifacts, source originals and secrets from the respective upload routes. Commit `package-lock.json`, `public/`, `src/`, and all project configuration. Leave dependency installation to Vercel.

## Verify the public URL before submitting

- Open `/` on HTTPS and check the 3D title and scroll parallax.
- Enter all six doors, inspect a room object, and return to the saved corridor position.
- Open Facility Directory on a phone and check touch navigation and Mode baca.
- Check Campus Expo and AI/homelab retain **Dalam Pengembangan** labels; contacts stay disabled until configured.
- Open a technology entry. Missing photos and the UNAIR logo should display intentional placeholders.
- Test Mode baca if WebGL is unavailable. All six sectors must remain readable.
- Reload the public URL in an incognito browser; do not submit a localhost address or a protected preview link.

Local checks: `npm run build`, `npm run assets:check`, `node scripts/technology-test.mjs`, `node scripts/contact-links-test.mjs`. Browser scripts require a separately installed Playwright/browser and their documented local `NOVA_*` variables; they are not deployment dependencies.

Official references: [Vercel Next.js deployment](https://vercel.com/docs/frameworks/full-stack/nextjs), [CLI production deploy](https://vercel.com/docs/cli/deploy), [supported Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
