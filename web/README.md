# Sparkverse OS (Phase 1)

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

When this app becomes the host, `next.config.ts` rewrites inbound HTML URLs (`studio.html` → `/workshop`, `galaxy.html` → `/`, etc.). Until then, those `.html` files keep working on Pages.

## Layout

```
web/src/
  app/                 Galaxy, workshop, catalog, vault, codex,
                       treasury, dashboard, engine/[slug], login, gate
  components/
    chrome/            AppShell, 64px rail + top bar, mobile tabs
    galaxy/            SolarSystem (CSS port of live index.html)
    catalog/           ToolCard, StatusBadge, FilterBar
    ui/
  lib/                 catalog.ts, planets.ts, nav.ts, plans.ts
  types/
data/tools-catalog.json  copy of root tools-catalog.json
```

Catalog source of truth for Pages remains `/tools-catalog.json`. Keep `web/data/tools-catalog.json` in sync when tools change.

Whop OAuth is not in this pass. Sign in routes to `/login`.
