# The Resolute Advisory — website

Astro + React + Tailwind CSS v4, built as a fully static site and served by a Cloudflare Worker (static assets).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → ./dist
npm run deploy   # build + wrangler deploy
```

## Layout

- `src/pages/index.astro` — the single page, composed from section components
- `src/layouts/Layout.astro` — `<head>` (SEO, OG, JSON-LD, fonts) and the behaviour scripts
- `src/components/*.astro` — one component per section (Hero, Position, ProofBar, Practices, Engagement, Work, Insights, Team, Brief, Footer) plus Loader, Cursor, Nav
- `src/components/CaseStack.tsx`, `BriefForm.tsx` — React islands (`client:load`) for the case accordion and the Web3Forms brief form
- `src/data/cases.ts` — copy for the five case studies
- `src/scripts/*.js` — original vanilla behaviour (loader, cursor, hero speed-lines, parallax, reveals, counters)
- `src/styles/` — original CSS, imported by `global.css` after Tailwind's theme + utilities layers. Tailwind Preflight is deliberately **not** loaded so the port renders identically.
- `public/` — images, favicons, `robots.txt`, `sitemap.xml`, `CNAME`

## Deploy

`wrangler.jsonc` serves `./dist`. If the Worker is deployed by Cloudflare Workers Builds (Git integration), set the build command to `npm run build` (deploy command stays `npx wrangler deploy`).

## React Bits (shadcn CLI)

`components.json` registers the `@react-bits` registry. Use the TypeScript + Tailwind variants (`-TS-TW` suffix):

```bash
npx shadcn@latest add @react-bits/SplitText-TS-TW
```
