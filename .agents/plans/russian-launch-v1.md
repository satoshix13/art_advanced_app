# PRD: Open Art Explorer — Russian Public Launch v1

**Date:** 2026-04-26  
**Status:** Draft  
**Scope:** Smallest launchable Russian-language product that collects real market feedback

---

## 1. Problem Statement

Millions of Russian-speaking casual art lovers, students, and curious browsers have no single, beautiful, accessible way to discover and learn about world art. Museums are geographically distant. Art-history content online is scattered, academic, or in English. YouTube is entertaining but unstructured. There is no product that combines visual discovery with light, gamified learning — in Russian — at zero cost to start.

The existing Open Art Explorer prototype proves the format works (validated with colleagues). The gap is: no Russian language, no local data reliability, no learning layer, and no monetization path for a Russian audience.

---

## 2. Evidence

- The sister app was shared with colleagues and received strong qualitative praise, specifically for its visual design and gamification elements. This validates the core format.
- The current architecture calls The Met API directly from the browser (`MET_BASE_URL` in `app.js:1`). A single upstream outage or rate-limit takes the entire product down — unacceptable for a public launch.
- The Met's open-access CSV dataset is publicly available and downloadable, enabling a local data layer that removes live API dependency for browse and search.
- Wikidata provides community-maintained Russian-language artist names, artwork titles, and biographical data at no cost, with a structured query interface.
- The target demographic — Russian-speaking females 15–18+ and males — skews toward mobile web browsing; the current product has no mobile optimisation but the layout is responsive.
- YooKassa is the dominant Russian payment processor, supporting Mir cards, SBP, and standard credit cards. It is the right choice for this market.
- There is no hard deadline, but speed to first real users is the stated top priority.

---

## 3. Proposed Solution

A Russian-language, image-first web app for discovering and learning about world art. It extends the existing Open Art Explorer codebase with:

1. **A local art dataset** — The Met open-access CSV ingested into a server-side store, eliminating live API dependency for core browse and search. Live Met API becomes optional enrichment, not critical path.
2. **A thin edge proxy** — sits in front of the dataset to serve the frontend, handle Russian search aliases (e.g. `Моне` → `Monet`), and cache popular queries.
3. **Russian i18n** — all UI strings translated; artwork metadata (title, artist, medium) enriched with Russian equivalents from Wikidata where available, machine-translated for the long tail.
4. **Free-tier gamification** — at least one game at launch: "Guess the Artist" (show image, pick from 4 names). Enough to demonstrate the learning concept without a paid account.
5. **Paid tier (iterative post-launch)** — structured zero-to-hero study plans (chronological art history paths with games, progress tracking, saved state). Gated behind YooKassa checkout.

The frontend stays vanilla HTML/CSS/JS. No framework is introduced. The backend is the minimum needed to serve local data and proxy requests.

---

## 4. Key Hypothesis

> **Russian-speaking casual art lovers will engage with an image-first discovery app in their own language, and a meaningful fraction will pay for structured learning paths with games.**

Validated when: registered users appear, share feedback, and at least one paying user completes a checkout.

---

## 5. What We Are NOT Building

- User accounts beyond what payment flow strictly requires (no social profiles, avatars, etc.)
- Social features: likes, follows, comments, sharing
- AI-generated essays, chat, or recommendations
- Multiple museum sources — The Met only for v1 (AIC, Cleveland, Tate are post-launch)
- Native mobile apps
- Multi-language support beyond Russian + English metadata underlay
- Admin CMS or content management tooling
- Real-time collaborative or multiplayer features
- Offline mode or PWA capabilities

---

## 6. Success Metrics

| Metric | Target for "we made it" | Notes |
|---|---|---|
| Russian UI live | 100% UI strings in Russian | Zero English visible to end user in normal flow |
| Uptime | Site loads when Met API is down | Proxy + local dataset absorbs upstream failures |
| Registered users | At least 1 user registers and leaves feedback | Qualitative feedback collection, not a number target |
| Paying user | At least 1 user completes YooKassa checkout | Validates willingness to pay |
| Game engagement | Users play "Guess the Artist" game | Presence of interaction, not a completion-rate target yet |
| Study plan (paid) | Paid user progresses through at least 1 plan step | Validates the premium product concept |

---

## 7. Open Questions

| Question | Status |
|---|---|
| Hosting provider for backend/dataset | TBD — Cloudflare Workers + KV vs. small VPS with Postgres. User noted hosting is "the last thing to decide." |
| Domain / branding for Russian audience | TBD — to be decided when product is ready |
| Subscription pricing | TBD — monthly subscription likely; exact price needs market testing |
| Machine translation provider for metadata long tail | TBD — needs evaluation (DeepL, Google Translate) |
| Legal entity / terms of service for Russian users | TBD — user noted this is "nice to think about later" |
| Premium content scope | TBD — how many study plans at launch? How many games in paid tier vs. free? |
| User account system | TBD — minimum viable: email + password sufficient, or use OAuth? |
| Data freshness / Met CSV update cadence | TBD — how often to re-ingest the open-access CSV |

---

## 8. Users & Context

### Primary User
**Casual Russian-speaking art lover, beginner to intermediate.**  
- Demographics: primarily females 15–18+; males as secondary audience; not professionals.
- Digital behaviour: browses on mobile, uses YouTube, visits museums occasionally. Comfortable with Russian-language apps.
- Not an art historian. Does not know technical terminology. May not know artist names in English.

### Jobs To Be Done

**JTBD 1 (free tier):** "When I'm bored and want something beautiful, I want to discover artworks I've never seen, so I can feel cultured and share something cool."

**JTBD 2 (paid tier):** "When I want to genuinely understand art history, I want a structured path with games so I can feel like I'm actually learning, not just browsing."

### Non-Users (explicitly out of scope)
- Professional art researchers and museum curators — product is not built for expert depth.
- Museum database providers — we consume open-access data, no B2B relationship needed for v1.

---

## 9. Solution Detail

### MoSCoW Table

| Priority | Feature |
|---|---|
| **Must** | All UI strings in Russian |
| **Must** | Search with Russian-to-English alias map (e.g. `Моне` → `Monet`, `Ван Гог` → `Van Gogh`) |
| **Must** | Local art dataset served from backend (Met open-access CSV ingested) — no direct browser-to-Met API calls |
| **Must** | Edge proxy serving frontend + dataset API |
| **Must** | Russian artwork metadata from Wikidata where available |
| **Must** | Image-first card grid and modal detail view (already built; needs Russian copy) |
| **Must** | "Guess the Artist" game — free tier (show image, 4 choices, one correct) |
| **Must** | Source attribution visible on every artwork (museum link) |
| **Must** | Intentional empty and error states with Russian copy |
| **Should** | Progress/score feedback in the game |
| **Should** | YooKassa checkout integration |
| **Should** | Basic user account (email + password) for premium state persistence |
| **Should** | First structured study plan (chronological: Ancient → Medieval → Renaissance → Modern) |
| **Should** | Paid-tier games (more advanced than free) |
| **Could** | Machine-translated metadata fallback for artworks not in Wikidata |
| **Could** | Wikidata Russian biographical text in modal detail view |
| **Could** | Multiple study plans |
| **Won't (v1)** | Social features, AI content, multiple museum sources, mobile app |

### MVP Definition

The smallest launchable version is:
1. Russian UI, running on local dataset via proxy (Steps 1–3 of roadmap complete).
2. One free game ("Guess the Artist") to demonstrate the learning concept.
3. A working YooKassa checkout gating access to a first paid study plan.
4. At least one structured study plan with progress tracking per user session (even without persistent accounts).

---

## 10. Technical Approach

### Verified Existing Codebase

**`index.html`** (109 lines) — single-page shell. Lang attribute is `lang="en"` — needs to become `lang="ru"`. All visible copy strings are hardcoded in HTML (English). Search chips at lines 54–58 are hardcoded English queries.

**`app.js`** (418 lines) — all application logic. Key verified entry points:
- `MET_BASE_URL` (`app.js:1`) — `"https://collectionapi.metmuseum.org/public/collection/v1"` — this URL must be replaced with the proxy base URL in the russified version.
- `FEATURED_QUERIES` (`app.js:2`) — `["Monet", "samurai armor", "still life"]` — needs Russian-friendly curated replacements (or aliases so Russian inputs still resolve).
- `SEARCH_LIMIT = 12` (`app.js:3`), `RELATED_LIMIT = 4` (`app.js:4`).
- `searchMetArtworks(query, limit)` (`app.js:152`) — fires GET `/search?q=&hasImages=true` then fans out individual object fetches. In v1 Russian this function's base URL must point to the proxy, not The Met directly.
- `normalizeArtwork(raw)` (`app.js:184`) — maps raw Met API response to UI model: `{ id, source, title, artist, date, medium, culture, department, image, largeImage, objectUrl, city, reign }`. Russian metadata fields (`titleRu`, `artistRu`) will need to be added here alongside the existing English fields.
- `init()` (`app.js:53`) — featured artworks load on first paint via three parallel queries.
- `openArtwork(artworkId)` (`app.js:282`) — renders modal detail view. All label strings (`"Date"`, `"Medium"`, `"Department"`, `"Culture"`) are English literals in template strings — needs i18n.
- `renderEmptyState(query)` (`app.js:253`), `renderFeedbackCard(title, text)` (`app.js:263`) — error/empty state copy is English literals.
- `state` object (`app.js:21–27`) — in-memory only. No persistence layer exists.

**`styles.css`** — gallery design system. No changes needed for Russian text unless Cyrillic character rendering requires font adjustment (Cormorant Garamond + Manrope, loaded from Google Fonts — both support Cyrillic).

### What Needs To Be Created (does not exist yet)

| Component | Purpose |
|---|---|
| Edge proxy (Cloudflare Worker or Vercel Edge Function) | Sits between frontend and data; serves API, handles alias map, caches popular queries |
| Local dataset store (Cloudflare KV or Postgres) | Ingested Met open-access CSV; primary data source for browse/search |
| Met CSV ingest script | One-time + periodic: download Met open-access CSV, parse, store normalised records |
| Wikidata enrichment script | Query Wikidata SPARQL for Russian artist names + titles; join to local records by artist name / QID |
| Russian alias map | JSON or KV entries: Russian artist names → English canonical search terms |
| i18n string file | All UI copy in Russian (`ru.json` or equivalent) |
| `normalizeArtwork` extension | Add `titleRu`, `artistRu`, `descriptionRu` fields drawn from enriched local record |
| "Guess the Artist" game module | New file (e.g. `game.js`): fetch 4 artworks, display image, present 4 artist choices, score |
| User account system (minimal) | Email + password; session token; required for paid-tier state persistence |
| YooKassa checkout integration | Server-side: create payment, webhook to set `premium = true` on user record |
| Study plan data + renderer | Structured content (periods, artworks, descriptions in Russian) + UI to step through |

### Proxy API Contract (to be designed)

The frontend `searchMetArtworks` will call the proxy instead of The Met. Proxy endpoints needed:

```
GET /api/search?q={query}&limit={n}   → returns array of normalised artwork objects
GET /api/objects/{id}                 → returns single artwork object
GET /api/featured                     → returns curated featured artworks
```

The proxy performs: Russian-to-English alias resolution → local dataset lookup → (optional) live Met API fallback → response.

### i18n Approach

For v1: a single `ru.js` constants file with all UI strings. No framework i18n library. `index.html` and `app.js` import/reference constants. String IDs match existing English copy locations. **Russian copy must be reviewed by a native speaker before shipping — do not rely solely on machine translation for UI strings.**

---

## 11. Implementation Phases

| Phase | Deliverable | Blocks | Status |
|---|---|---|---|
| **1a** | Met CSV download + local dataset ingest script | Phase 2 | Not started |
| **1b** | Wikidata enrichment script (Russian names/titles) | Phase 2 | Not started |
| **1c** | Edge proxy scaffold + `/api/search`, `/api/objects/:id`, `/api/featured` | Phase 2 | Not started |
| **2** | `app.js` refactor: point `MET_BASE_URL` → proxy; extend `normalizeArtwork` with `titleRu`/`artistRu` | Phase 3 | Not started |
| **3** | Russian i18n: `ru.js` string file; update all hardcoded English copy in `index.html` and `app.js` | Phase 3 | Not started |
| **4** | Russian search alias map integrated into proxy | Phase 3 | Not started |
| **5** | "Guess the Artist" game (free tier) | Phase 6 | Not started |
| **6** | User account system (email + password, minimal) | Phase 7 | Not started |
| **7** | YooKassa checkout integration | Phase 8 | Not started |
| **8** | First study plan: content + UI renderer | Launch | Not started |
| **Launch** | Deploy to hosting, point domain | — | Not started |

**Parallel opportunities:**
- Phases 1a, 1b, and 1c can run in parallel (independent: data, enrichment, proxy scaffold).
- Phase 3 (i18n strings) can be drafted in parallel with Phase 2 (proxy wiring).
- Study plan content can be written in parallel with Phase 6 (user accounts).

**Launch-blocking phases (must ship before public release):** 1a, 1b, 1c, 2, 3, 4.  
**Post-launch iterative:** 5, 6, 7, 8 (ship incrementally after first real users arrive).

---

## 12. Decisions Log

| Decision | Rationale |
|---|---|
| Local dataset (Met CSV ingest) rather than live API proxy | More reliable; user explicitly stated "best way is to download the database of art on the server." Eliminates N+1 fan-out and upstream fragility. |
| Vanilla JS/HTML — no framework introduced | Existing codebase has no build step. Adding a framework is not justified by current complexity. |
| Wikidata for Russian metadata | Free, community-maintained, structured. Avoids paying for translation for the common case. Machine translation only for the long tail. |
| YooKassa as payment provider | Standard for Russian market; supports Mir/SBP/cards. No viable alternative for this audience. |
| Free tier includes at least one game | User confirmed: "definitely in the free version there should be some simple games." Required to demonstrate value before paywall. |
| "Guess the Artist" as first game | Simplest possible game: image + 4 choices. Directly validated by user as "super simple" and appropriate. |
| Paid tier = structured study plans + more games | User's clearest mental model of premium value: "zero to hero" chronological art-history path with progress saved across sessions. |
| Pricing TBD | First goal is a working checkout, not optimal pricing. Will test with market. |
| Domain / hosting deferred | "Hosting is the last thing to decide" — user confirmed. Not blocking feature work. |
| Russian copy must be human-reviewed | CLAUDE.md working agreement: "Russian copy must read naturally, not as machine translation." |

---

## Validation Notes

All technical references verified against codebase on 2026-04-26.

**Checks performed:**
- 3 file paths (`index.html`, `app.js`, `styles.css`) — all confirmed present ✓
- 3 proposed proxy API endpoints — correctly marked as new; no existing backend to conflict with ✓
- 0 DB schemas — none exist yet; PRD correctly identifies all as to-be-created ✓
- 6 UI component/element IDs — all verified against `index.html` ✓
- 12 function/constant names with line numbers — all verified exact against `app.js` ✓
- `normalizeArtwork` return shape — all 13 fields verified ✓

**One flag (no correction required, but verify before shipping):**
The Google Fonts URL in `index.html:14` does not include an explicit `subset=cyrillic` parameter:
```
family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700
```
Modern Google Fonts auto-serves Cyrillic glyphs via `unicode-range` CSS when the font supports it (both Cormorant Garamond and Manrope do). However, Cyrillic rendering should be manually tested in browser with real Russian text before public launch to confirm correct glyph coverage, especially for Cormorant Garamond at display sizes.
