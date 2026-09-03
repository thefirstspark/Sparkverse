# The First Spark — Site Constitution

One rulebook for every web property. Any agent or person touching a TFS repo reads this first. Last revised 2026-09-03.

## 1. The properties

| Site | Repo (org `thefirstspark`) | Branch | Host | Role | New content? |
|---|---|---|---|---|---|
| thefirstspark.shop | thefirstspark.github.io | main | GitHub Pages | Main site. Sales, hubs, tools, lore, investor | **Yes. Default home for anything new.** |
| soul-maps.thefirstspark.shop | soul-maps | master | GitHub Pages | Soul Map product: customer maps, Color Codex, cards | Product pages only |
| sigilcraft.thefirstspark.shop | sigilcraft | main | GitHub Pages | Sigil product line | Product pages only |
| frequency.thefirstspark.shop | frequency-match | main | GitHub Pages | Soul Card Collider (single page) | Rarely |
| rituals.thefirstspark.shop | rituals | main | GitHub Pages | Grimoire | Rarely |
| family.thefirstspark.shop | family | main | GitHub Pages | PIN-gated family resonance | Rarely |
| sparkverse.thefirstspark.shop | Sparkverse | main | GitHub Pages | **Frozen.** Legacy lore + duplicate tools | **No new pages. Fix links only.** |
| links.thefirstspark.shop | bio-link (private) | master | Vercel | Link-in-bio, newsletter, email API, library | App code + library only |
| katelins-oracle.vercel.app | none (CLI deploy from C:/tmp/oracle-deploy) | – | Vercel | Kate's private oracle | Private |

Not sites: `initiation-engine` (hidden Whop app, not deployed), `soul-map-server` (archived, superseded).

## 2. Sources of truth

- **Page inventory:** Notion database "⚡ TFS Master Site & Tool Inventory" (`8f472609015c4968b0cbf63774e6e470`), inside 🔥 Daily Ops Playbook. Every live page has a row. Status is one of Live / Review / Retire / Not live.
- **Local clones:** `C:\Users\Katel\Desktop\LIVE_SITES_MASTER\<repo>`. Always `git fetch origin && git reset --hard origin/<branch>` before editing. Clones drift; that is normal and not worth mentioning.
- **Removed pages:** `LIVE_SITES_MASTER\_REMOVED_PAGES\<repo>\` plus `REMOVED.md`. Nothing is ever deleted without a copy landing here first.
- **Weekly audit:** `LIVE_SITES_MASTER\audit.py` → `audit/latest.md`. Run by the `/site-audit` command every Monday.

## 3. Canonical URLs (link to these, nothing else)

| Thing | Canonical |
|---|---|
| Buy a Soul Map ($22) | `https://thefirstspark.shop/map.html` → checkout `https://whop.com/checkout/plan_anQKP3Pzf1cGm` |
| Free Soul Map preview | `https://thefirstspark.shop/soul-pattern-generator.html` (never soul-map.html) |
| Players Lounge ($33/mo, 3-day trial) | `https://thefirstspark.shop/playerslounge/` → checkout `https://whop.com/checkout/plan_okFWwlpgnc2bQ` |
| Players Lounge member home | Whop hub `https://whop.com/sparkverse-511c/the-players-lounge/` → Notion Players Hub `3cf5e039120f81fd805af5b50c03a182` |
| Free community | `https://whop.com/sparkverse-511c/spark-access/` (the old `spark-acces/` route is dead) |
| Storefront | `https://thefirstspark.shop/shop.html` (direct checkout links, not Whop's store page) |
| Ecosystem explainer | `https://thefirstspark.shop/ecosystem.html` |
| Email signup | POST `https://links.thefirstspark.shop/api/subscribe` (Supabase + Resend) |
| Member portal (Notion) | ✨ THE SPARK HUB — Member Portal `3f5ca51f53d04b0c80cc5f06cd781ae1` |
| Discord | `https://discord.gg/wyNBWUca` |
| Contact | `kate@thefirstspark.shop` |

Live Whop plan IDs are listed in `audit.py` → `LIVE_PLANS`. A checkout link to any other plan is a bug.

## 4. Rules

1. **No page ships without a home.** Every new page gets (a) a link from a hub page (index, tools.html, ecosystem.html, or the relevant product index) and (b) a row in the Notion inventory. No exceptions, including "I'll link it later."
2. **One page per job.** Before creating a page, search the inventory. If a page with the same purpose exists, edit it. Never create `-v2`, `-new`, `-FIXED`, or `copy` variants alongside the original.
3. **New tools live on thefirstspark.shop.** Sparkverse is frozen. Product subdomains hold only their product's pages.
4. **Retire, don't delete.** To remove a page: copy to `_REMOVED_PAGES/<repo>/`, add a REMOVED.md line, `git rm`, remove from sitemap.xml, set the Notion row to Retire. Old URL returns 404. No redirect stubs except when collapsing duplicates of a linked page.
5. **Prices and plans.** All Soul Maps are $22 one-time. Checkout links only from the LIVE_PLANS list. When a plan changes in Whop, update LIVE_PLANS and grep every repo the same day.
6. **Color Codex.** A soul map's own badge is the source of truth for its tier and color. Archive and index cards must match the map, never the other way round.
7. **Tracking.** Main-site pages carry the GTM block and the Whop Pixel scoped to `biz_0xcayhWXVnKO9y`. New main-site pages copy the head from index.html.
8. **Line endings.** Repos mix CRLF and LF. Bulk edits read and write with `newline=''` and preserve each file's ending. Verify `git diff --ignore-cr-at-eol --shortstat` matches plain `--shortstat`.
9. **Push by default.** Work Kate asked for goes live without a sign-off round. Third-party PRs wait for her.
10. **The agent flags, Kate decides.** The weekly audit may write to Notion rows and the audit log. It may not delete pages, push code, or touch Whop.

## 5. Design language

**Live brand = cosmic arcade.** Space Mono for UI and body, Orbitron for display headings, Cormorant Garamond italic only as an accent. Palette from index.html: `--void #050508`, `--cyan #22d3ee`, `--nebula #8b5cf6`, `--spark #fbbf24`, `--hot-pink #ec4899`. New pages copy the head and CSS variables from `thefirstspark.github.io/index.html`.

**Legacy system (bone/ember, Cormorant body, JetBrains Mono labels)** exists on older investor and lore pages. Leave those pages as they are. Do not build new pages in it; Kate rejected serif-editorial as the brand direction.

## 6. Who does what

- **Kate:** decides what exists, what it says, what it costs, what dies. Ten minutes every Monday in the Notion "🚨 Problem pages" view.
- **Claude (interactive):** builds and edits on request, follows this file, pushes.
- **Claude (`/site-audit`, scheduled):** detects drift, updates Notion, writes the log. Read-only on code and Whop.
