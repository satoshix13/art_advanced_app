# CLAUDE.md

Project memory for Open Art Explorer. Single source of truth — supersedes the older AGENTS.md.

## Project

**Open Art Explorer** — a calm, image-first web app for discovering artworks across open museum collections. Built for a Russian-speaking audience. Free for everyone, with a paid premium tier centered on guided art study.

## Current State (as of 2026-04-26)

- Static single-page web app: `index.html`, `styles.css`, `app.js`. No backend.
- One data source: **The Met Collection API**, called directly from the browser.
- Search → fetch object IDs → fan-out detail fetches → render image-first card grid + modal detail view.
- Featured artworks load on first paint (`Monet`, `samurai armor`, `still life`).
- English UI only. No i18n layer, no auth, no persistence, no payments.
- Repo: `github.com/satoshix13/art_advanced_app` (public, default `main`).
- A sister project with the same shape was already shipped publicly and well-received by colleagues — this validates the concept and lets us move fast.

## Strategy

**Ship a Russian public version as fast as possible to collect real market feedback.** Speed beats polish for v1. We have signal that the format works; now we need to learn what Russian-speaking users want and what they'll pay for.

### Audience
- Primary: Russian-speaking casual art lovers, students, and curious browsers.
- UI is Russian-first. Original museum metadata stays in English under the hood.

### Monetization
- **Free tier** — generous: search, browse, artwork details, related works, source attribution.
- **Paid tier** — guided "zero-to-hero" art-study plans (private, structured paths through art history with periods, movements, key works, timelines). The paid product is *learning*, not access.
- **Payment provider:** YooKassa (ЮKassa) — standard for Russian audiences, supports Mir/cards/SBP.
- Pricing model TBD (likely monthly subscription); first goal is a working checkout, not optimal pricing.

## Roadmap Focus

The current direct-API architecture is too fragile for a public Russian launch. If The Met blips, the site dies. Migration plan, in order of priority:

1. **Reliability layer** — thin proxy + cache (Cloudflare Workers / Vercel Edge) in front of The Met. Hides N+1 fan-out, survives upstream outages, gives us a place to add Russian translations and pre-warmed popular searches.
2. **Russian i18n** — UI strings, search alias map (e.g., `Эль Греко` → `El Greco`), Russian metadata fields stored beside cached records.
3. **Wikidata enrichment** — join museum records to Wikidata for free, community-maintained Russian artist names, titles, and bios. Falls back to machine translation for the long tail.
4. **Bulk dataset ingest** — import The Met's open-access CSV into our own DB so we no longer depend on the live API for browse/search. Live API becomes optional sync, not the critical path.
5. **YooKassa integration** — checkout, subscription state, gated premium routes.
6. **Premium content** — first guided study plan (1-3 curated paths) to validate willingness to pay.

Steps 1-3 are launch-blocking. Steps 4-6 can ship iteratively after first public release.

### Out of Scope for v1 Launch
- User accounts beyond what payments require.
- Social features (likes, follows, comments).
- AI-generated essays or chat.
- Multi-language support beyond Russian + English.
- Multiple museum sources beyond The Met (AIC/Cleveland are post-launch).
- Mobile apps.

## Tech Stack

### Current
- Plain HTML/CSS/JavaScript (ES modules), Fetch API.
- No build step, no framework, no backend.
- Hosted: not yet deployed.

### Planned (incremental, not all upfront)
- Edge proxy: Cloudflare Workers or Vercel Edge Functions.
- Cache/storage: Cloudflare KV or a small Postgres (depending on bulk-data needs).
- Search: keep as-is for v1; consider Meilisearch/Typesense once we have local data.
- Payments: YooKassa.
- Frontend stays vanilla until complexity actually demands a framework.

Don't introduce frameworks, ORMs, or infra layers ahead of need.

## Key Files

- `index.html` — single-page shell, search form, results grid, modal template.
- `styles.css` — editorial/gallery-style design system.
- `app.js` — all behavior. `searchMetArtworks` (`app.js:152`) is the API call site; `normalizeArtwork` (`app.js:184`) is the simplified UI model.
- `PRD.md` — original product spec (more detail than this file; useful reference).
- `art_app_research.md` — open-data sources research (Met, AIC, Cleveland, Tate, Wikidata).
- `.claude/skills/archon/` — Archon CLI skill for delegating long-running workflows to isolated worktrees.

## Working Principles

Carried forward from the original PRD — still load-bearing:

- **Image-first.** The image is the anchor. Metadata supports it, never crowds it.
- **Calm and gallery-like.** Whitespace, restrained typography, one accent color.
- **Source attribution always visible.** Every artwork shows which museum it came from, with a working link to the museum's record.
- **Empty/error states are intentional**, not afterthoughts. They suggest the next action.
- **Ship the smallest version that proves the idea.** Don't add features ahead of demand.
- **Respect open-access licensing.** No claiming ownership of museum content.

## Working Agreements with Claude

- This is a fast-shipping project for a real public audience. Bias toward landing the next user-visible improvement, not toward refactors or speculative abstractions.
- Use Archon workflows (in isolated worktrees) for substantial features so the main branch stays releasable.
- Russian copy must read naturally, not as machine translation. When unsure, leave English and flag for review rather than ship awkward Russian.
- Always run the dev server (`python3 -m http.server 8000`) and verify in browser before claiming a UI change is done.
