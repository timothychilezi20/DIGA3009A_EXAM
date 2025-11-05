// news.js — South African MUSIC‑only filtering using GNews + MediaStack

const GNEWS_API_KEY = "8f1c1833dfbacfe906b39011305f84e1";
const MEDIASTACK_API_KEY = "298d229b464fd906e6336b5da1ceda66";
const newsContainer = document.getElementById("news-container");

/* ✅ South African MUSIC keywords */
const SA_MUSIC_KEYWORDS = [
  // Genres
  "amapiano",
  "gqom",
  "kwaito",
  "afro house",
  "afro pop",
  "maskandi",
  "sa hip hop",
  "hip hop sa",
  "house music",
  "soul",
  "jazz",
  "r&b",

  // General
  "south africa",
  "south african",
  "mzansi",
  "sa music",

  // Cities
  "johannesburg",
  "joburg",
  "cape town",
  "durban",
  "pretoria",

  // Artists (expand when needed)
  "kabza",
  "maphorisa",
  "tyla",
  "nasty c",
  "black coffee",
  "shakes",
  "felo",
  "dbn gogo",
  "shekhinah",
  "cassper",
  "aka",
  "young stunna",
  "musa keys",
  "dj zinhle",
  "johhny clegg",
  "mi casa",

  // Events / culture
  "festival",
  "concert",
  "tour",
  "gig",
  "performance",
  "album",
  "single",
];

/* ✅ Exclude obvious unrelated countries */
const EXCLUDE = ["india", "pakistan", "uk", "usa", "china", "nigeria"];

function isSouthAfricanMusicArticle(a) {
  const text = `${a.title} ${a.description || ""}`.toLowerCase();

  // Exclude foreign
  for (const bad of EXCLUDE) {
    if (text.includes(bad)) return false;
  }

  // Must match at least 1 SA music keyword
  return SA_MUSIC_KEYWORDS.some((k) => text.includes(k));
}

async function fetchGNews() {
  try {
    const url = `https://gnews.io/api/v4/search?q=south%20african%20music&lang=en&max=20&apikey=${GNEWS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.articles || [];
  } catch (e) {
    console.warn("GNews error", e);
    return [];
  }
}

async function fetchMediaStack() {
  try {
    const url = `https://api.mediastack.com/v1/news?access_key=${MEDIASTACK_API_KEY}&countries=za&keywords=music&languages=en&limit=20`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.data) return [];

    return data.data.map((a) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      image: a.image,
      source: { name: a.source || "MediaStack" },
      publishedAt: a.published_at,
    }));
  } catch (e) {
    console.warn("MediaStack error", e);
    return [];
  }
}

async function fetchNews() {
  try {
    newsContainer.innerHTML = "<p>Loading articles...</p>";

    let articles = [];
    const g = await fetchGNews();
    const m = await fetchMediaStack();

    articles = [...g, ...m];

    // Filter SA music only
    articles = articles.filter(isSouthAfricanMusicArticle);

    // Dedupe titles
    const seen = new Set();
    articles = articles.filter((a) => {
      const t = a.title?.toLowerCase().trim();
      if (seen.has(t)) return false;
      seen.add(t);
      return true;
    });

    if (articles.length === 0) {
      newsContainer.innerHTML = `<p>No South African music news found.</p>`;
      return;
    }

    newsContainer.innerHTML = articles
      .slice(0, 12)
      .map(
        (article) => `
      <div class="news-card">
        <img src="${
          article.image || "../images/fallback.jpg"
        }" onerror="this.src='../images/fallback.jpg'" />
        <div class="news-card-content">
          <h3>${article.title}</h3>
          <p>${article.description || "No description available."}</p>
          <a href="${article.url}" target="_blank">Read more</a>
        </div>
      </div>
      `
      )
      .join("");
  } catch (err) {
    console.error("Error loading news:", err);
    newsContainer.innerHTML = `<p>Unable to load news at the moment.</p>`;
  }
}

fetchNews();
setInterval(fetchNews, 5 * 60 * 1000);
