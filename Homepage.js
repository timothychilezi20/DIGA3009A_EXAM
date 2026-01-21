// ==========================
// CONFIG
// ==========================
const NEWSDATA_KEY = "pub_514dee0d30fe4c40a4638a792c270189";
const GUARDIAN_KEY = "YOUR_GUARDIAN_KEY";

// ==========================
// UTILITIES
// ==========================
function fetchWithTimeout(url, options = {}, timeout = 8000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), timeout),
    ),
  ]);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ==========================
// LOADER
// ==========================
window.addEventListener("load", () => {
  const loader = document.getElementById("websiteLoader");
  const main = document.getElementById("mainContent");

  setTimeout(() => {
    loader.style.display = "none";
    main.style.display = "block";
  }, 1800);
});

// ==========================
// API FETCHERS
// ==========================
async function fetchArticles() {
  try {
    const urls = [
      `https://newsdata.io/api/1/news?apikey=${NEWSDATA_KEY}&q=music&language=en`,
      `https://content.guardianapis.com/search?section=music&show-fields=thumbnail,trailText&page-size=10&api-key=${GUARDIAN_KEY}`,
    ];

    const [newsRes, guardianRes] = await Promise.all(
      urls.map((u) => fetchWithTimeout(u)),
    );

    const news = await newsRes.json();
    const guardian = await guardianRes.json();

    const newsArticles = (news.results || []).map((a) => ({
      title: a.title,
      description: a.description,
      url: a.link,
      image: a.image_url || "images/news-fallback.jpg",
      source: a.source_id,
      date: a.pubDate,
    }));

    const guardianArticles = (guardian.response?.results || []).map((a) => ({
      title: a.webTitle,
      description: a.fields?.trailText,
      url: a.webUrl,
      image: a.fields?.thumbnail || "images/news-fallback.jpg",
      source: "The Guardian",
      date: a.webPublicationDate,
    }));

    return [...newsArticles, ...guardianArticles];
  } catch (e) {
    console.error("Article error:", e);
    return [];
  }
}

async function fetchCharts() {
  try {
    const r = await fetchWithTimeout(
      "https://itunes.apple.com/za/rss/topsongs/limit=10/json",
    );
    const d = await r.json();

    return d.feed.entry.map((t, i) => ({
      rank: i + 1,
      name: t["im:name"].label,
      artist: t["im:artist"].label,
      image: t["im:image"][2].label,
      url: t.link.attributes.href,
    }));
  } catch (e) {
    console.error("Charts error:", e);
    return [];
  }
}

async function fetchReleases() {
  try {
    const r = await fetchWithTimeout(
      "https://itunes.apple.com/za/rss/newmusic/limit=8/json",
    );
    const d = await r.json();

    return d.feed.entry.map((a) => ({
      name: a["im:name"].label,
      artist: a["im:artist"].label,
      image: a["im:image"][2].label,
      url: a.link.attributes.href,
    }));
  } catch (e) {
    console.error("Releases error:", e);
    return [];
  }
}

async function fetchEvents() {
  try {
    const r = await fetchWithTimeout(
      "https://api.rss2json.com/v1/api.json?rss_url=https://www.eventbrite.com/d/south-africa--johannesburg/music/rss/",
    );
    const d = await r.json();

    return (d.items || []).slice(0, 6).map((e) => ({
      name: e.title,
      date: e.pubDate,
      image: e.thumbnail || "images/event-fallback.jpg",
      url: e.link,
    }));
  } catch (e) {
    console.error("Events error:", e);
    return [];
  }
}

// ==========================
// RENDER FUNCTIONS
// ==========================
function renderExclusive(article) {
  const container = document.querySelector(".exclusive-container");

  container.innerHTML = `
    <a href="${article.url}" target="_blank" class="exclusive-card">
      <img src="${article.image}">
      <div class="exclusive-overlay">
        <span class="tag">EXCLUSIVE</span>
        <h2>${article.title}</h2>
      </div>
    </a>
  `;
}

function renderSidebars(articles) {
  const left = document.querySelector(".left-sidebar");
  const right = document.querySelector(".right-sidebar");

  const items = articles.slice(1, 5).map(
    (a) => `
      <a href="${a.url}" target="_blank" class="sidebar-item">
        <img src="${a.image}">
        <p>${a.title}</p>
      </a>
    `,
  );

  left.innerHTML = items.slice(0, 2).join("");
  right.innerHTML = items.slice(2).join("");
}

function renderLatest(articles) {
  const featured = document.querySelector(".featured-latest");
  const side = document.querySelector(".latest-side-list");

  const main = articles[5];

  featured.innerHTML = `
    <a href="${main.url}" target="_blank">
      <img src="${main.image}">
      <h3>${main.title}</h3>
      <p>${main.description || ""}</p>
    </a>
  `;

  side.innerHTML = articles
    .slice(6, 10)
    .map(
      (a) => `
    <a href="${a.url}" target="_blank" class="latest-item">
      <img src="${a.image}">
      <div>
        <h4>${a.title}</h4>
        <span>${formatDate(a.date)}</span>
      </div>
    </a>
  `,
    )
    .join("");
}

function renderCharts(charts) {
  const list = document.getElementById("saCharts");

  list.innerHTML = charts
    .map(
      (c) => `
    <div class="chart-row">
      <span>${c.rank}</span>
      <div class="track">
        <img src="${c.image}">
        <div>
          <strong>${c.name}</strong>
          <small>${c.artist}</small>
        </div>
      </div>
      <a href="${c.url}" target="_blank">Apple</a>
    </div>
  `,
    )
    .join("");
}

function renderReleases(releases) {
  const grid = document.getElementById("spotifyReleases");

  grid.innerHTML = releases
    .map(
      (r) => `
    <a href="${r.url}" target="_blank" class="release-card">
      <img src="${r.image}">
      <h4>${r.name}</h4>
      <p>${r.artist}</p>
    </a>
  `,
    )
    .join("");
}

function renderEvents(events) {
  const list = document.getElementById("eventsList");

  list.innerHTML = events
    .map(
      (e) => `
    <a href="${e.url}" target="_blank" class="latest-item">
      <img src="${e.image}">
      <div>
        <h4>${e.name}</h4>
        <span>${formatDate(e.date)}</span>
      </div>
    </a>
  `,
    )
    .join("");
}

// ==========================
// INIT
// ==========================
async function initHomepage() {
  const articles = await fetchArticles();
  if (!articles.length) return;

  renderExclusive(articles[0]);
  renderSidebars(articles);
  renderLatest(articles);

  renderCharts(await fetchCharts());
  renderEvents(await fetchEvents());
  renderReleases(await fetchReleases());
}

initHomepage();
