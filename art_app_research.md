# Art Data Sources – Research Summary

## Goal

Find robust, open art datasets/APIs (ideally GitHub/JSON) to power an art-related app or web app that can display artists, artworks, images, and rich metadata, and that can be localized (e.g., Russian UI).

---

## Main Sources

### 1. The Metropolitan Museum of Art (The Met) – Collection API

- Public, no-auth REST API returning JSON.
- Key endpoints:
  - Search: `/public/collection/v1/search`
  - Object details: `/public/collection/v1/objects/{objectID}`
- Supports:
  - `q` (full-text query), `artistOrCulture`, `hasImages`, `isHighlight`, `isOnView`, `medium`, date ranges, etc.
- Object metadata includes:
  - `title`, `artistDisplayName`, `artistDisplayBio`, `objectDate`, `medium`, `dimensions`, `culture`, `period`, `country`, `department`, `tags`, `primaryImage`, `primaryImageSmall`, `additionalImages`, `objectURL`, Wikidata/ULAN links.
- Strengths:
  - Easy search-by-artist flow (e.g., El Greco).
  - Direct image URLs.
  - Rich, stable schema that’s ideal as a main backend for an app.

---

### 2. Art Institute of Chicago – API

- REST JSON API with a modern schema.
- Uses IIIF (`image_id` + base URL) for images:
  - Flexible, zoomable, and size-controllable image delivery.
- Metadata similar in richness to The Met (title, artist, dates, materials, etc.).
- Strengths:
  - Professional image pipeline via IIIF.
  - Good complement to The Met for broader coverage.

---

### 3. Cleveland Museum of Art – Open Access API + GitHub

- Provides an Open Access API plus a GitHub repo with JSON/CSV dumps.
- Dataset scale: tens of thousands of artworks and image assets.
- Strengths:
  - Both live API and downloadable data.
  - Good for seeding a local index plus keeping a live sync.

---

### 4. Tate Gallery – GitHub Collection Dataset

- GitHub repo with Tate collection metadata (artworks + artists) as JSON/CSV.
- Includes:
  - Per-artist JSON files.
  - Separate processed metadata (subjects, classifications, etc.).
- Limitations:
  - Snapshot last updated in 2014.
  - No images included in the repo.
- Strengths:
  - Very convenient GitHub-native dataset for offline work, enrichment, analysis, and experimenting with subject graphs and taxonomies.

---

## Key Implementation Insights

### 1. Recommended Core Stack

- Use **The Met** as the primary live data source:
  - Search via `/search?artistOrCulture=true&hasImages=true&q=<name>`.
  - Fetch objects via `/objects/{id}`.
- Add **AIC** and **Cleveland**:
  - AIC for higher-quality IIIF image workflows.
  - Cleveland for API + bulk data combo.
- Optionally enrich from **Tate GitHub**:
  - Extra subject metadata, artist lists, and historical context.

### 2. Example Artist Flow (The Met)

1. Search:  
   `/search?artistOrCulture=true&hasImages=true&q=El%20Greco`
2. Receive `objectIDs` array.
3. For each `objectID`, call `/objects/{id}`.
4. Use fields:
   - `title`, `artistDisplayName`, `objectDate`, `medium`, `primaryImageSmall`, `objectURL`, etc.

This pattern generalizes to any artist or search term.

### 3. Localization for a Russian-Language App

- API responses are in English; UI language is independent.
- Approach:
  - Keep original fields (`title`, `artistDisplayName`, etc.) as source.
  - Add Russian-facing fields in your own DB (e.g., `title_ru`, `artist_name_ru`, `medium_ru`).
  - Translate:
    - Titles, dates (text), mediums, periods, cultures, tags, short descriptions.
  - Keep as-is:
    - IDs, source URLs, image URLs, Wikidata/ULAN links, original artist names (plus optional transliteration).
- Search:
  - Map Russian queries (e.g., `Эль Греко`) to canonical English search terms (`El Greco`) in your backend, then call The Met’s search.
  - Optionally maintain a synonym/alias table or search index that understands both Cyrillic and Latin forms.

### 4. Suggested Data Model (Simplified)

Core tables or collections:

- `artists`
  - `id`, `source`, `name_en`, `name_ru`, `wikidata`, `ulan`, birth/death, nationality.
- `artworks`
  - `id`, `source`, `title_en`, `title_ru`, `artist_id`, `date_en`, `date_ru`, `medium_en`, `medium_ru`, `dimensions`, `culture_en`, `culture_ru`, `period_en`, `period_ru`, `rights`, `object_url`.
- `images`
  - `artwork_id`, `image_url`, `thumbnail_url`, optional IIIF info.
- `tags`
  - `artwork_id`, `tag_en`, `tag_ru`.

This lets your frontend stay fully Russian while still reflecting accurate, updatable museum data.

---

## High-Level Product Idea

A strong, still-underbuilt idea is a **cross-museum, multi-language art explorer**:

- Combine Met + AIC + Cleveland (+ Tate for enrichment).
- Normalize artworks and artists into a single schema.
- Provide:
  - Artist pages with works across museums.
  - Filters: period, style, subject, medium, geography.
  - Russian (and later multi-language) UI, with Russian titles and descriptions where available.
- Use Met as the easiest starting point, then incrementally add others.

---

## Main Takeaways

- You don’t need a single giant “artist JSON file” — museum open APIs and GitHub datasets are richer and better maintained.
- The Met is the most straightforward, app-friendly starting point (no key, direct images, good structure).
- Cleveland and AIC deepen coverage and image options; Tate GitHub is great for offline and enrichment.
- For a Russian app, treat the museum APIs as an English structured backend and build a Russian localization layer on top (translated fields, alias-based search, Russian UI).