const MET_BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";
const FEATURED_QUERIES = ["Monet", "samurai armor", "still life"];
const SEARCH_LIMIT = 12;
const RELATED_LIMIT = 4;

const elements = {
  form: document.querySelector("#search-form"),
  input: document.querySelector("#search-input"),
  searchButton: document.querySelector("#search-button"),
  exampleChips: document.querySelector("#example-chips"),
  resultsGrid: document.querySelector("#results-grid"),
  feedback: document.querySelector("#feedback"),
  resultsTitle: document.querySelector("#results-title"),
  resultsSummary: document.querySelector("#results-summary"),
  modal: document.querySelector("#artwork-modal"),
  modalClose: document.querySelector("#modal-close"),
  modalContent: document.querySelector("#modal-content"),
  cardTemplate: document.querySelector("#card-template"),
};

const state = {
  query: "",
  artworks: [],
  featuredArtworks: [],
  selectedArtworkId: null,
  activeRequestId: 0,
};

elements.form.addEventListener("submit", handleSearchSubmit);
elements.exampleChips.addEventListener("click", handleExampleClick);
elements.modalClose.addEventListener("click", closeModal);
elements.modal.addEventListener("click", (event) => {
  const bounds = elements.modal.getBoundingClientRect();
  const clickedOutside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (clickedOutside) {
    closeModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && elements.modal.open) {
    closeModal();
  }
});

init();

async function init() {
  const requestId = ++state.activeRequestId;
  renderSkeletonCards(8);

  try {
    const featuredCollections = await Promise.all(
      FEATURED_QUERIES.map((query) => searchMetArtworks(query, 4)),
    );

    if (requestId !== state.activeRequestId) {
      return;
    }

    state.featuredArtworks = dedupeById(featuredCollections.flat()).slice(0, 8);
    state.artworks = state.featuredArtworks;

    elements.resultsTitle.textContent = "Featured works to start exploring";
    elements.resultsSummary.textContent =
      "A quick opening set pulled from The Met so the page feels alive before the first search.";
    setFeedback("");
    renderResults(state.featuredArtworks);
  } catch (error) {
    console.error(error);
    renderFeedbackCard(
      "The featured collection could not load.",
      "You can still search directly. Try Monet, samurai, or any artist name.",
    );
    setFeedback("Featured works failed to load.");
  }
}

async function handleSearchSubmit(event) {
  event.preventDefault();
  const query = elements.input.value.trim();

  if (!query) {
    return;
  }

  await runSearch(query);
}

async function handleExampleClick(event) {
  const chip = event.target.closest("[data-query]");
  if (!chip) {
    return;
  }

  const query = chip.dataset.query;
  elements.input.value = query;
  await runSearch(query);
}

async function runSearch(query) {
  const requestId = ++state.activeRequestId;
  state.query = query;
  state.selectedArtworkId = null;

  elements.resultsTitle.textContent = `Results for “${query}”`;
  elements.resultsSummary.textContent = "Searching The Met and loading image-friendly records.";
  setFeedback(`Searching for ${query}...`);
  renderSkeletonCards(8);
  setSearchBusy(true);

  try {
    const artworks = await searchMetArtworks(query, SEARCH_LIMIT);

    if (requestId !== state.activeRequestId) {
      return;
    }

    state.artworks = artworks;

    if (artworks.length === 0) {
      renderEmptyState(query);
      setFeedback(`No image-ready matches found for ${query}.`);
      return;
    }

    const totalText =
      artworks.length === SEARCH_LIMIT
        ? `Showing the first ${artworks.length} image-ready works from The Met.`
        : `Showing ${artworks.length} works from The Met.`;

    elements.resultsSummary.textContent = totalText;
    setFeedback(`Loaded ${artworks.length} works for ${query}.`);
    renderResults(artworks);
  } catch (error) {
    console.error(error);
    renderFeedbackCard(
      "Search failed this time.",
      "The Met request did not complete. Try the search again or switch to a simpler query.",
    );
    setFeedback("Search request failed.");
  } finally {
    setSearchBusy(false);
  }
}

async function searchMetArtworks(query, limit) {
  const searchUrl = new URL(`${MET_BASE_URL}/search`);
  searchUrl.searchParams.set("q", query);
  searchUrl.searchParams.set("hasImages", "true");

  const searchResponse = await fetch(searchUrl);
  if (!searchResponse.ok) {
    throw new Error(`Search request failed with status ${searchResponse.status}`);
  }

  const searchData = await searchResponse.json();
  const objectIds = (searchData.objectIDs || []).slice(0, Math.max(limit * 3, 18));

  if (objectIds.length === 0) {
    return [];
  }

  const objects = await Promise.all(
    objectIds.map(async (objectId) => {
      const objectResponse = await fetch(`${MET_BASE_URL}/objects/${objectId}`);
      if (!objectResponse.ok) {
        return null;
      }

      const raw = await objectResponse.json();
      return normalizeArtwork(raw);
    }),
  );

  return objects.filter(Boolean).slice(0, limit);
}

function normalizeArtwork(raw) {
  const image = raw.primaryImageSmall || raw.primaryImage;
  if (!raw.objectID || !image) {
    return null;
  }

  return {
    id: raw.objectID,
    source: "The Met",
    title: raw.title || "Untitled",
    artist: raw.artistDisplayName || raw.culture || "Artist unknown",
    date: raw.objectDate || "Date unknown",
    medium: raw.medium || "Medium not listed",
    culture: raw.culture || "",
    department: raw.department || "",
    image,
    largeImage: raw.primaryImage || raw.primaryImageSmall,
    objectUrl: raw.objectURL || "",
    city: raw.city || "",
    reign: raw.reign || "",
  };
}

function renderResults(artworks) {
  elements.resultsGrid.innerHTML = "";

  artworks.forEach((artwork) => {
    const fragment = elements.cardTemplate.content.cloneNode(true);
    const cardButton = fragment.querySelector(".art-card-button");
    const image = fragment.querySelector(".art-image");
    const source = fragment.querySelector(".art-source");
    const title = fragment.querySelector(".art-title");
    const artist = fragment.querySelector(".art-artist");
    const meta = fragment.querySelector(".art-meta");

    image.src = artwork.image;
    image.alt = `${artwork.title} by ${artwork.artist}`;
    source.textContent = artwork.source;
    title.textContent = artwork.title;
    artist.textContent = artwork.artist;
    meta.textContent = compactMeta(artwork);

    cardButton.addEventListener("click", () => openArtwork(artwork.id));
    elements.resultsGrid.appendChild(fragment);
  });
}

function renderSkeletonCards(count) {
  elements.resultsGrid.innerHTML = "";

  for (let index = 0; index < count; index += 1) {
    const fragment = elements.cardTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".art-card");
    const source = fragment.querySelector(".art-source");
    const title = fragment.querySelector(".art-title");
    const artist = fragment.querySelector(".art-artist");
    const meta = fragment.querySelector(".art-meta");
    const image = fragment.querySelector(".art-image");

    card.classList.add("skeleton");
    image.alt = "";
    source.textContent = ".";
    title.textContent = ".";
    artist.textContent = ".";
    meta.textContent = ".";
    elements.resultsGrid.appendChild(fragment);
  }
}

function renderEmptyState(query) {
  elements.resultsGrid.innerHTML = `
    <section class="empty-state">
      <p class="eyebrow">No Matches</p>
      <h4>No image-ready results for “${escapeHtml(query)}”.</h4>
      <p class="empty-hint">Try a broader term, an artist surname, or one of the example searches above.</p>
    </section>
  `;
}

function renderFeedbackCard(title, text) {
  elements.resultsGrid.innerHTML = `
    <section class="feedback-card">
      <p class="eyebrow">Temporary Issue</p>
      <h4>${escapeHtml(title)}</h4>
      <p>${escapeHtml(text)}</p>
    </section>
  `;
}

function setFeedback(message) {
  elements.feedback.textContent = message;
}

function setSearchBusy(isBusy) {
  elements.searchButton.disabled = isBusy;
  elements.searchButton.textContent = isBusy ? "Searching..." : "Search";
}

function openArtwork(artworkId) {
  const artwork = state.artworks.find((item) => item.id === artworkId) ||
    state.featuredArtworks.find((item) => item.id === artworkId);

  if (!artwork) {
    return;
  }

  state.selectedArtworkId = artwork.id;
  const relatedWorks = getRelatedWorks(artwork);

  elements.modalContent.innerHTML = `
    <section class="modal-image-panel">
      <img src="${escapeAttribute(artwork.largeImage || artwork.image)}" alt="${escapeAttribute(`${artwork.title} by ${artwork.artist}`)}" />
    </section>
    <section class="modal-copy">
      <p class="modal-source">${escapeHtml(artwork.source)}</p>
      <h3 class="modal-title">${escapeHtml(artwork.title)}</h3>
      <p class="modal-artist">${escapeHtml(artwork.artist)}</p>
      <section class="study-panel" aria-label="Artwork facts">
        <div class="study-grid">
          ${renderField("Date", artwork.date)}
          ${renderField("Medium", artwork.medium)}
          ${renderField("Department", artwork.department || "Not listed")}
          ${renderField("Culture", artwork.culture || "Not listed")}
        </div>
        <p class="meta-note">${escapeHtml(buildHelperText(artwork))}</p>
        ${
          artwork.objectUrl
            ? `<a class="source-link" href="${escapeAttribute(artwork.objectUrl)}" target="_blank" rel="noreferrer">Open museum record</a>
               <p class="modal-source-note">Source attribution stays with The Metropolitan Museum of Art.</p>`
            : ""
        }
      </section>
      <section class="related-panel" aria-label="Related works">
        <h4>Keep exploring</h4>
        <p class="related-copy">More works connected through this artist or the current search set.</p>
        <div class="related-list">
          ${renderRelatedButtons(relatedWorks)}
        </div>
      </section>
    </section>
  `;

  elements.modalContent.querySelectorAll(".related-button").forEach((button) => {
    button.addEventListener("click", () => {
      const nextId = Number(button.dataset.id);
      openArtwork(nextId);
    });
  });

  elements.modal.showModal();
}

function closeModal() {
  if (elements.modal.open) {
    elements.modal.close();
  }
}

function getRelatedWorks(artwork) {
  const pool = state.artworks.length ? state.artworks : state.featuredArtworks;
  const sameArtist = pool.filter(
    (item) => item.id !== artwork.id && item.artist === artwork.artist,
  );
  const fallback = pool.filter((item) => item.id !== artwork.id);

  return dedupeById([...sameArtist, ...fallback]).slice(0, RELATED_LIMIT);
}

function renderField(label, value) {
  return `
    <div class="field">
      <span class="field-label">${escapeHtml(label)}</span>
      <p class="field-value">${escapeHtml(value)}</p>
    </div>
  `;
}

function renderRelatedButtons(artworks) {
  if (artworks.length === 0) {
    return `<p class="field-value">No related works are available in the current set yet.</p>`;
  }

  return artworks
    .map(
      (artwork) => `
        <button type="button" class="related-button" data-id="${artwork.id}">
          <strong>${escapeHtml(artwork.title)}</strong>
          <span>${escapeHtml(`${artwork.artist} • ${artwork.date}`)}</span>
        </button>
      `,
    )
    .join("");
}

function buildHelperText(artwork) {
  const parts = [artwork.date, artwork.medium];
  if (artwork.department) {
    parts.push(`from the ${artwork.department} collection`);
  }
  if (artwork.culture) {
    parts.push(`with ${artwork.culture.toLowerCase()} context`);
  }

  return `This work stands out through ${parts.filter(Boolean).join(", ")}.`;
}

function compactMeta(artwork) {
  return [artwork.date, artwork.department].filter(Boolean).join(" • ");
}

function dedupeById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item || seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
