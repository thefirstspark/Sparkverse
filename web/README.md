# Sparkverse OS (Phase 1–2)

Next.js 16 App Router shell. Live GitHub Pages still serves the root HTML files. This app is the future doorway UI — it does **not** replace or delete those pages.

## Run

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Build with `npm run build`.

## Why `/web`

The repo root is a static PWA (~90 HTML files on GitHub Pages). Putting Next at the root would collide with those files. `/web` is the least-destructive layout.

When this app becomes the host, `next.config.ts` rewrites inbound HTML URLs (`studio.html` → `/workshop`, `galaxy.html` → `/`, `soul-map.html` → `/vault`, etc.). Until then, those `.html` files keep working on Pages.

`/engine/[slug]` iframes the live tool at `NEXT_PUBLIC_LEGACY_ORIGIN` (default `https://sparkverse.thefirstspark.shop`). Keep that origin pointed at Pages until HTML is proxied. `/vault` is the Soul Map surface (canonical buy URL `thefirstspark.shop/map.html`).

## Layout

```
web/src/
  app/                 Galaxy, workshop, catalog, vault, codex,
                       treasury, dashboard, engine/[slug], login, gate
  components/
    chrome/            AppShell, 64px rail + top bar, mobile tabs
    galaxy/            SolarSystem (CSS port of live index.html)
    catalog/           ToolCard, StatusBadge, FilterBar
    engine/            EngineFrame + postMessage protocol
    vault/             ColorCodexBadge
    ui/
  lib/                 catalog.ts, planets.ts, nav.ts, plans.ts, color-codex.ts
  types/
data/tools-catalog.json  generated copy of root tools-catalog.json
```

Catalog source of truth is `/tools-catalog.json`. `npm run dev` / `npm run build` copies it into `web/data/` via `scripts/sync-catalog.mjs`.

Whop OAuth is not in this pass. Sign in routes to `/login`. Engines listen for `spark:ready`, `spark:complete`, `spark:telemetry`.
