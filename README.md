# daisycolor

A small, handmade colouring world for Daisy — built with Next.js, TypeScript, Tailwind and Lucide.

## What it is

- 16 original, intricate SVG colouring pages with hidden little notes.
- Tap-to-colour regions, custom colours, palettes, eraser, undo/redo, and freehand drawing.
- A garden that keeps the pages you colour, a breathing flower, a quiet generated soundtrack, and a last-page letter.
- Everything stays in your browser's local storage. No account, no server, no tracking.

## Run it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for GitHub Pages

The site is a static export. For the `/daisycolor/` project path, build with:

```bash
$env:GITHUB_PAGES="true"; npm run build
```

The generated site is in `out/`. Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages.

---

made for buttercup, by nolan
