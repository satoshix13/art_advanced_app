# AGENTS.md

## Project Name
Open Art Explorer MVP

## Project Overview
Open Art Explorer is a simple MVP web app for discovering artworks and artists across open museum collections. The goal is to build a clean, fast, visual product that lets users search for an artist or keyword, browse artworks with images, open artwork details, and move between related works without needing to visit multiple museum websites.[cite:2][cite:9][cite:16]

This MVP should stay intentionally small. It is not a full research platform, social network, or marketplace. The purpose of the first version is to prove that a unified art discovery experience built on top of open museum data is useful, easy to use, and visually engaging.[cite:2][cite:9][cite:16]

## Core Product Idea
The app is a cross-museum art browser that combines open-access museum records into one simple discovery interface. Users should be able to search, view artworks, see artist names, dates, mediums, source museum links, and high-quality images where available.[cite:2][cite:6][cite:16]

The MVP should feel closer to a modern discovery app than a museum database. The focus is on browsing, curiosity, and clarity rather than advanced scholarship or perfect metadata completeness.[cite:2][cite:9][cite:16]

## Main User Goal
Help a user quickly answer questions like:
- Show me artworks by a given artist.
- Let me browse art by keyword or theme.
- Let me open an artwork and understand what it is.
- Let me discover related works from multiple museums in one place.

## Target Users
- Casual users who enjoy art and want a simple way to explore it.
- Students or beginners who want image-first discovery with basic context.
- Users who do not want to search museum websites one by one.
- Future multilingual users, though the first MVP can remain English-first.

## MVP Scope
The MVP should include only the most essential features:
- A homepage or landing view with search and featured artworks.
- Search by artist name or keyword.
- Artwork cards with image, title, artist, date, and source museum.
- Artwork detail view with a larger image and key metadata.
- Basic related-artwork browsing, such as more from the same artist or more from the same source.
- Simple source attribution with a link back to the museum page.

The MVP should avoid advanced account systems, heavy personalization, complex AI features, community features, or complicated editorial workflows.

## Data Sources
The MVP should pull data from open museum sources with public JSON APIs and open-access image support where available.

### Primary Source
- The Metropolitan Museum of Art Collection API should be the main source for the first build because it offers a straightforward public JSON API, object search, object detail endpoints, and public-domain image links for many records.[cite:2][cite:18]

### Secondary Sources
- Art Institute of Chicago Public API can be added as a secondary source for broader coverage and strong image delivery through its public API and IIIF-based image system.[cite:6][cite:9]
- Cleveland Museum of Art Open Access API can be added as another secondary source because it provides open artwork records and image assets suitable for public and commercial use.[cite:16][cite:17]

### Data Source Strategy for MVP
Start with The Met first. If needed, add AIC and Cleveland only after the basic search and detail flow works well. The first version should prefer simplicity over maximum coverage.[cite:2][cite:9][cite:16]

## What the App Should Do
The MVP app should support this basic user flow:
1. User enters an artist name or keyword.
2. App fetches matching artworks from the chosen museum source or normalized combined source.
3. App shows visual search results as cards.
4. User opens an artwork detail page or panel.
5. App displays image, title, artist, date, medium, museum attribution, and external source link.
6. App suggests a few related works to continue browsing.

## Product Principles
- Keep it simple.
- Make it image-first.
- Prefer fast browsing over dense metadata.
- Always show source attribution clearly.
- Do not over-engineer the first version.
- Build the MVP in a way that can be expanded later without making expansion a requirement now.

## UX Principles
- The app should feel calm, visual, and easy to scan.
- Search should be the main action.
- Artwork cards should be consistent and lightweight.
- Detail pages should prioritize image, title, artist, and a few understandable fields.
- The user should always know which museum provided the record.
- Empty states should still feel useful, for example by suggesting another search.

## Suggested MVP Features
- Search bar with submit and simple loading state.
- Results grid.
- Artwork detail page or modal.
- Related works section.
- Source filter if more than one museum source is enabled.
- Featured or highlighted artworks on first load.

## Non-Goals for MVP
Do not include these in the first version unless absolutely necessary:
- User accounts and authentication.
- Complex recommendation systems.
- AI-generated essays or chat features.
- Social feeds, likes, comments, or follows.
- Marketplace, checkout, or print sales.
- Full translation workflow.
- Offline sync or heavy local caching.
- Advanced curator tools.

## Future Opportunities
If the MVP works, later versions could add:
- Multi-language UI, including Russian localization.
- Better cross-museum normalization for artists and tags.
- Personalized collections and saved favorites.
- Smarter recommendations based on style, mood, subject, or period.
- Educational modes such as timelines, comparisons, and guided discovery.
- Public editorial collections and themed browsing.
- Premium features for deeper discovery and learning.[cite:6][cite:16][cite:18]

## Monetization Hypotheses
Monetization is not part of the MVP build, but possible later paths include:
- Freemium subscription for advanced discovery features.
- Premium educational content or guided learning.
- Pro tools for researchers, designers, or curators.
- Commerce or affiliate layers only if source rights and product fit are clear.

## Build Philosophy for Codex
This project should be buildable in one go as a focused MVP. Codex should prioritize delivering a usable end-to-end app over designing a perfect long-term system.

That means:
- Prefer fewer features done well.
- Prefer clear flows over clever abstractions.
- Prefer a clean UI over heavy complexity.
- Prefer one strong data source over many partially integrated sources.
- Ship the smallest version that demonstrates real value.

## MVP Success Criteria
The MVP is successful if:
- A user can search and get useful visual results.
- A user can open an artwork and understand the basic context.
- The app feels pleasant enough that a user wants to keep exploring.
- The data source attribution is clear and trustworthy.
- The app is simple enough to implement quickly in one build cycle.

## PRD Preparation Notes
Any future PRD should turn this overview into:
- User stories.
- Exact screens and flows.
- Final MVP feature checklist.
- Data handling rules.
- Edge cases and empty states.
- Nice-to-have features moved out of MVP.

The PRD should remain scoped for a practical first release and should avoid turning the MVP into a full platform too early.
