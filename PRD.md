# PRD.md

## Product
Open Art Explorer MVP

## Overview
Open Art Explorer is a lightweight web app for discovering artworks and artists through open museum data, with a strong focus on visual browsing, simple search, and approachable art-study context.[cite:1][cite:6][cite:16] The product is intentionally scoped as an MVP that can be built quickly in one implementation pass, while still feeling polished, calm, and user-friendly.[cite:1][cite:16]

The first version should help a user search for an artist or keyword, browse artworks with images, open an artwork detail view, and continue exploring related works without friction.[cite:1][cite:38] The MVP is not a full research archive, social platform, or advanced recommendation engine; it is a focused art discovery and study experience.[cite:1][cite:16]

## Product Goal
Build a beautiful but practical MVP that proves three things:
- Open museum APIs can power a compelling cross-collection browsing experience.[cite:1][cite:6][cite:16]
- A simple, image-first interface makes art discovery easier than raw museum search endpoints.[cite:1][cite:38]
- Even a small app can support art learning by presenting clean metadata, museum attribution, and related-work exploration.[cite:1][cite:16]

## Success Criteria
The MVP is successful if a user can:
- Search for an artist or art-related keyword and get useful results quickly.[cite:1][cite:17]
- See artwork images, titles, artists, dates, and source museums in a clean grid.[cite:1][cite:6][cite:16]
- Open a detail view and understand the basic context of the artwork within a few seconds.[cite:1][cite:16]
- Continue browsing by artist or related works without getting stuck.[cite:1][cite:38]

## Target Users
- Casual art lovers who want to browse visual works without using museum websites directly.
- Students and beginners who want a simple study-friendly interface.
- Users who discover art through curiosity, not through formal catalog search.
- Early multilingual audiences, although the first build should remain English-first.

## MVP Scope
### In Scope
- One-page web app experience.
- Search by artist name or general keyword.
- Results grid with artwork cards.
- Artwork detail modal or side panel.
- Basic related works section.
- Simple source filter if more than one data source is enabled.
- Introductory landing state with a short description and example searches.
- Clean responsive design for desktop and mobile.

### Out of Scope
- User accounts.
- Saved favorites synced to cloud.
- Social features.
- AI chat or long-form generated essays.
- Full multilingual translation workflow.
- Advanced recommendation engine.
- Complex backend services.
- CMS or admin tooling.

## Core User Stories
- As a user, I want to search for an artist and quickly see artworks with images.
- As a user, I want to open an artwork and see the most important facts without reading a dense catalog record.
- As a user, I want to continue exploring similar or related works from the same artist or source.
- As a user, I want the app to feel attractive and trustworthy enough that I keep browsing.
- As a user studying art, I want basic metadata shown clearly so I can learn while exploring.

## Data Sources
### Primary Data Source
Use **The Metropolitan Museum of Art Collection API** as the main source for the MVP.[cite:1][cite:5] The Met API provides public JSON endpoints for search and object details, including image fields and rich metadata such as title, artist, date, medium, department, tags, and source page URLs.[cite:1][cite:5]

Why use The Met first:
- Public and straightforward API structure with search and object detail endpoints.[cite:1][cite:5]
- Good image availability through open access records.[cite:1][cite:5]
- Rich enough metadata for a strong MVP without additional normalization work.[cite:1][cite:38]

### Optional Secondary Data Sources
**Art Institute of Chicago API** may be added later for broader coverage and stronger image delivery using IIIF conventions.[cite:6] The API exposes artwork metadata and image references, but actual image URLs must be constructed from its IIIF configuration and `image_id`, which adds a little integration complexity.[cite:6]

**Cleveland Museum of Art Open Access API** is also a strong optional source because it provides over 64,000 artwork records and image assets for over 37,000 works, with filters such as `q`, `has_image`, `artists`, `type`, and custom `fields` selection.[cite:16][cite:17] It is useful for future expansion, but should not block the first version from shipping.[cite:16][cite:17]

### MVP Recommendation
For the first Codex build, implement **The Met only**.[cite:1][cite:5] If time remains and the app structure is stable, add one optional secondary source, but the default plan should stay single-source for speed and reliability.[cite:6][cite:16]

## Functional Requirements
### Search
- The user can enter a free-text query.
- The app submits the query to The Met search endpoint using `hasImages=true` so results are image-friendly.[cite:5][cite:38]
- The app should prioritize artist-style discovery and general keyword discovery.
- The app should show loading, empty, and error states.
- The app should allow users to click example queries from the landing state.

### Results Grid
- Show artwork cards in a responsive grid.
- Each card should include image, title, artist name, date, and source museum.
- Cards should be visually consistent even if metadata fields are missing.
- Cards should support hover state on desktop and tap state on mobile.
- Initial result count can be limited for speed, for example top 12 to 24 fetched objects after search.

### Artwork Detail View
- Open as a modal or slide-over panel rather than a new page to keep browsing fast.
- Show large artwork image.
- Show title, artist, date, medium, department or culture when available, and source link.
- Include a short “study panel” layout that makes metadata easier to scan.
- Include a “More from this artist” or “Related from this source” section.

### Related Browsing
- At minimum, support one of these lightweight strategies:
  - More works from the same artist.
  - More works from the same department or culture.
  - More results from the current search query.
- This should feel like guided continuation, not a complex recommendation engine.

### Source Attribution
- Clearly display the museum source for every artwork.[cite:1][cite:6][cite:16]
- Provide a link to the source museum page where available.[cite:1][cite:5]
- Respect the source metadata and avoid implying ownership of the museum content.[cite:16][cite:18]

## Study-Friendly Layer
The MVP should gently support art learning without becoming an education platform.

Required study-friendly touches:
- Present date, medium, department, and culture in a simple facts block when available.[cite:1][cite:5]
- Use clean labels such as “Artist,” “Date,” and “Medium,” not raw API field names.
- Add a short helper text under the detail header like “Open museum record” for the source link.
- Show a small note when metadata is incomplete rather than leaving the layout broken.

Optional if simple to implement:
- A “Why it stands out” text template assembled from existing metadata, such as combining period, medium, and department into one readable sentence. This should be rule-based, not AI-generated.

## UX Requirements
### Design Direction
The app should feel:
- Calm.
- Gallery-like.
- Minimal but not sterile.
- Modern and pleasant enough to invite browsing.
- Easy to scan on both laptop and phone.

### UX Rules
- Search is the primary action.
- Keep the first screen simple: heading, short intro, search bar, example searches, featured art if available.
- Avoid dense walls of metadata.
- Keep typography readable and elegant.
- Make the image the visual anchor.
- Use empty states that encourage another search instead of dead ends.

### Accessibility
- Semantic HTML structure.
- Keyboard-accessible search and modal interactions.
- Visible focus states.
- Alt text for artwork images using title and artist where possible.
- Mobile-friendly touch targets.

## Recommended Technology
This is an MVP test project, so the stack should be simple and executable quickly.

### Core Stack
- **Single-page frontend app**.
- **HTML, CSS, and JavaScript** for maximum build speed, or **lightweight React with Vite** only if Codex works faster that way.
- Default recommendation: **plain HTML/CSS/JavaScript** if the goal is fastest one-shot build with the least setup overhead.
- Use **Fetch API** for museum requests.
- No custom backend for the first version unless CORS or proxying becomes unavoidable.

### Styling
- Custom CSS with a polished, editorial-inspired UI.
- Responsive grid layout.
- Light and dark mode optional, but nice to have only if it does not slow delivery.
- Prefer a tasteful neutral palette with one accent color.

### State Management
- Keep state in-memory only.
- No global state library.
- No localStorage requirement for MVP.

### Deployment Target
- Static deployment friendly.
- Should run easily in a local environment and be deployable to a simple static host later.

## Why This Stack
A static frontend with direct API consumption is sufficient for a test MVP because The Met provides public endpoints for search and object detail lookups.[cite:1][cite:5] Avoiding a backend reduces implementation time and makes it realistic for Codex to complete the app in roughly 20 to 30 minutes.[cite:1][cite:38]

## API Usage Plan
### The Met Flow
1. User submits query.
2. App calls The Met search endpoint with `hasImages=true&q=<query>`.[cite:5][cite:38]
3. Search returns `objectIDs`.[cite:5][cite:38]
4. App fetches a limited number of object records using `/objects/{objectID}`.[cite:1][cite:5]
5. App maps the raw fields into a simplified UI model.
6. App renders cards and detail views.

### Simplified UI Model
For each artwork, normalize to:
- `id`
- `source`
- `title`
- `artist`
- `date`
- `medium`
- `culture`
- `department`
- `image`
- `thumbnail`
- `objectUrl`

This normalized model keeps rendering logic simple even if more sources are added later.

## Screens and Components
### 1. Landing / Home State
Purpose:
- Explain what the app is.
- Offer search immediately.
- Show example searches such as “Monet,” “samurai,” or “still life.”

Components:
- App title.
- Short description.
- Search bar.
- Example query chips.
- Optional featured artworks strip.

### 2. Search Results View
Purpose:
- Let users scan artworks quickly.

Components:
- Search bar at top.
- Result summary.
- Responsive grid of artwork cards.
- Loading skeletons.
- Empty state.
- Error message state.

### 3. Artwork Detail Modal / Panel
Purpose:
- Let users study one work without losing browsing context.

Components:
- Large image.
- Title and artist.
- Facts block.
- Source attribution and external link.
- Related works list.
- Close button.

## Exact Build Plan
### Phase 1: Setup
1. Create a single-page app structure.
2. Add semantic layout sections: header, hero/search, results, modal.
3. Add polished base styling and responsive layout.
4. Prepare a small design system: typography, spacing, card styles, buttons, modal styles, loading states.

### Phase 2: Search Integration
5. Implement search input and submit handling.
6. Connect search to The Met search endpoint.[cite:5][cite:38]
7. Limit fetched object IDs for speed.
8. Fetch object details in parallel with reasonable limits.[cite:1][cite:5]
9. Filter unusable records such as missing images if needed.
10. Normalize data into a simple frontend model.

### Phase 3: Results Experience
11. Render a responsive artwork card grid.
12. Add loading skeletons while records are being fetched.
13. Add empty state for no results.
14. Add error state for failed API requests.
15. Add example searches on the landing screen.

### Phase 4: Detail Experience
16. Build artwork detail modal or slide-over panel.
17. Populate artwork facts cleanly.
18. Add source link to museum page.[cite:1][cite:5]
19. Add lightweight related works section using same artist or current query.
20. Ensure keyboard and mobile usability.

### Phase 5: Polish
21. Refine spacing, typography, and card rhythm.
22. Improve image presentation and hover states.
23. Add subtle transitions.
24. Improve empty and error messages so they feel intentional.
25. Test on desktop and mobile widths.
26. Remove any unnecessary complexity before finalizing.

## Timeboxed Delivery Guidance
To keep this realistic for a 20 to 30 minute Codex implementation:
- Build only one source first: The Met.[cite:1][cite:5]
- Use one main page with one modal.
- Avoid routing unless absolutely needed.
- Avoid authentication, persistence, and admin features.
- Avoid perfect data normalization.
- Keep related works logic simple.
- Use direct API fields rather than building a full data layer.

## Nice-to-Have Features Only If Time Allows
- Source filter stub for future multi-museum support.
- Theme toggle.
- Featured artworks on load.
- Basic department badges.
- Tiny educational helper sentence based on metadata.
- Share link to current search.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| Museum search returns many IDs but object-detail fetching is slow | Slower UX | Limit initial fetch count and load only the first useful records.[cite:5][cite:38] |
| Some records have incomplete metadata or missing usable images | Uneven cards | Normalize defensively and use fallbacks.[cite:1][cite:16] |
| Multi-source support adds integration complexity | Delayed MVP | Launch with The Met only first.[cite:1][cite:6][cite:16] |
| UI becomes too dense | Poor usability | Keep only the most understandable fields in the MVP |

## Definition of Done
The MVP is done when:
- A user can search successfully.
- A grid of artwork cards appears with images.
- Clicking a card opens a useful artwork detail view.
- The app is responsive and visually pleasant.
- Source attribution is clear.
- The implementation remains simple enough to understand and extend.

## Future Expansion After MVP
Once the MVP proves useful, the next steps can include:
- Add Art Institute of Chicago integration with IIIF image URL construction.[cite:6]
- Add Cleveland Museum of Art as a second strong open-access source.[cite:16][cite:17]
- Add multilingual fields and Russian query aliases.
- Add saved collections.
- Add smarter browsing filters by period, culture, or subject.
- Add editorial or educational collections.
