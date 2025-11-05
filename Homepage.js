// ✅ FIXED & CLEANED VERSION OF YOUR SCRIPT

document.addEventListener("DOMContentLoaded", () => {
  // === DOM ELEMENTS ===
  const leftSidebar = document.querySelector(".left-sidebar");
  const rightSidebar = document.querySelector(".right-sidebar");
  const exclusiveSection = document.querySelector(".exclusive-container");
  const featuredLatest = document.querySelector(".featured-latest");
  const latestSideList = document.querySelector(".latest-side-list");
  const eventsList = document.getElementById("eventsList");
  const releasesGrid = document.getElementById("spotifyReleases");
  const bottomScroll = document.querySelector(".bottom-scroll");
  const lastUpdated = document.getElementById("lastUpdated");

  // === API KEYS ===
  const GNEWS_API_KEY = "8f1c1833dfbacfe906b39011305f84e1";
  const MEDIASTACK_API_KEY = "298d229b464fd906e6336b5da1ceda66";
  const SPOTIFY_CLIENT_ID = "61fb26a49a5c413c9a52aea3a25eda32";
  const SPOTIFY_CLIENT_SECRET = "2d33c647e7a645328c8011a0f190d501";

  // === FALLBACK ARTICLES (OPTIONAL) ===
  const FALLBACK_ARTICLES = [];

  // Keywords used to detect SA music news
  const SA_MUSIC_KEYWORDS = [
    // Geography
    "south africa",
    "south african",
    "mzansi",
    "soweto",
    "johannesburg",
    "joburg",
    "cape town",
    "durban",
    "pretoria",
    "gauteng",
    "kwazulu-natal",

    // Genres
    "amapiano",
    "gqom",
    "kwaito",
    "afro house",
    "deep house",
    "maskandi",
    "afro-pop",
    "afropop",
    "hip hop sa",
    "sa hip hop",
    "sa rap",
    "panstula",
    "afro fusion",
    "xhosa trap",
    "afrikaans music",

    // Artist Indicators
    "sa artist",
    "south african artist",
    "local artist",
    "mzansi artist",
    "dj",
    "producer",
    "singer",
    "rapper",
    "band",
    "choir",

    // Popular Artists (names help filtering)
    "kabza de small",
    "dj maphorisa",
    "young stunna",
    "nasty c",
    "costa titch",
    "focalistic",
    "shekhinah",
    "mi casa",
    "black coffee",
    "tyla",
    "zakes bantwini",
    "amafaku",
    "cassper nyovest",
    "aka",
    "big zulu",
    "blxckie",
    "sjava",
    "moonchild sanelly",
    "busiswa",
    "sjava",
    "uncle waffles",

    // Slang
    "yanos",
    "piano",
    "grootman",
    "spirit of gqom",

    // Events
    "music festival south africa",
    "sa concert",
    "ultra south africa",
    "rocking the daisies",
    "back to the city",
    "cotton fest",
    "oppi koppi",
    "cape town jazz festival",
    "arts cape",
    "bassline fest",

    // Platforms / Media
    "south african music",
    "local music",
    "mzansi music",
    "radio sa",
  ];

  // --- Utility UI ---
  function showLoading(container, type = "articles", count = 3) {
    if (!container) return;
    container.innerHTML = "";

    for (let i = 0; i < count; i++) {
      const placeholder = document.createElement("div");

      if (type === "articles") {
        placeholder.classList.add("side-article", "loading");
        placeholder.innerHTML = `
          <div class="loading-thumb"></div>
          <div class="loading-text">
            <div class="loading-line short"></div>
            <div class="loading-line long"></div>
          </div>`;
      } else if (type === "exclusive") {
        placeholder.classList.add("loading");
        placeholder.innerHTML = `
          <div class="loading-exclusive">
            <div class="loading-line" style="width: 60%; height: 30px; margin-bottom: 20px;"></div>
            <div class="loading-line" style="width: 80%; height: 15px;"></div>
          </div>`;
      } else if (type === "featured") {
        placeholder.classList.add("loading");
        placeholder.innerHTML = `
          <div class="loading-thumb" style="width: 100%; height: 300px; margin-bottom: 15px;"></div>
          <div class="loading-line" style="width: 70%; height: 20px; margin-bottom: 10px;"></div>
          <div class="loading-line" style="width: 90%; height: 15px;"></div>`;
      } else if (type === "sidebar") {
        placeholder.classList.add("sidebar-article", "loading");
        placeholder.innerHTML = `
          <div class="loading-line" style="width: 80%; height: 18px; margin-bottom: 10px;"></div>
          <div class="loading-line" style="width: 95%; height: 12px; margin-bottom: 8px;"></div>
          <div class="loading-line" style="width: 60%; height: 12px;"></div>`;
      }

      container.appendChild(placeholder);
    }
  }

  function showError(container, message) {
    if (!container) return;
    container.innerHTML = `<p class="error-message">${message}</p>`;
  }

  function updateTimestamp() {
    if (lastUpdated) {
      const now = new Date();
      lastUpdated.textContent = `Last updated: ${now.toLocaleString("en-ZA")}`;
    }
  }

  function truncateText(text, maxLength) {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  function isSouthAfricanMusicArticle(article) {
    const searchText = `${article.title} ${
      article.description || ""
    }`.toLowerCase();
    return SA_MUSIC_KEYWORDS.some((keyword) =>
      searchText.includes(keyword.toLowerCase())
    );
  }

  async function fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  // --- MAIN CONTENT LOADER ---
  async function loadAllContent() {
    try {
      let allArticles = [];
      let apisFailed = 0;
      const totalApis = 2;

      // GNews
      try {
        const gnewsQuery = `https://gnews.io/api/v4/search?q=south%20africa%20music&lang=en&max=20&apikey=${GNEWS_API_KEY}`;
        const res = await fetchWithTimeout(gnewsQuery, {}, 8000);

        if (res.ok) {
          const data = await res.json();
          if (data.articles?.length > 0) {
            allArticles = allArticles.concat(data.articles);
          } else apisFailed++;
        } else apisFailed++;
      } catch (err) {
        console.warn("GNews fetch error:", err.message || err);
        apisFailed++;
      }

      // MediaStack
      try {
        const mediastackQuery = `https://api.mediastack.com/v1/news?access_key=${MEDIASTACK_API_KEY}&countries=za&keywords=music&languages=en&limit=20`;
        const res = await fetchWithTimeout(mediastackQuery, {}, 8000);

        if (res.ok) {
          const data = await res.json();
          if (data.data?.length > 0) {
            const mapped = data.data.map((a) => ({
              title: a.title,
              description: a.description,
              url: a.url,
              image: a.image,
              source: { name: a.source || "MediaStack" },
              publishedAt: a.published_at,
            }));
            allArticles = allArticles.concat(mapped);
          } else apisFailed++;
        } else apisFailed++;
      } catch (err) {
        console.warn("MediaStack fetch error:", err.message || err);
        apisFailed++;
      }

      // Fallback if needed
      if (apisFailed === totalApis || allArticles.length === 0) {
        allArticles = [...FALLBACK_ARTICLES];
      }

      let saArticles = allArticles.filter(isSouthAfricanMusicArticle);
      if (saArticles.length < 5) saArticles = allArticles;

      const unique = [];
      const seen = new Set();
      for (const article of saArticles) {
        const t = (article.title || "").trim().toLowerCase();
        if (!seen.has(t)) {
          seen.add(t);
          unique.push(article);
        }
      }

      if (!unique.length) throw new Error("No articles available");

      const articles = unique;

      populateLeftSidebar(articles.slice(0, 4));
      populateExclusiveSection(articles[0]);
      populateRightSidebar(
        articles.slice(4, 6).length
          ? articles.slice(4, 6)
          : [articles[1], articles[2]]
      );
      populateFeaturedLatest(articles[6] || articles[1]);
      populateLatestSideList(
        articles.slice(7, 12).length
          ? articles.slice(7, 12)
          : articles.slice(0, 5)
      );
      populateBottomScroll(articles);

      updateTimestamp();
    } catch (err) {
      console.warn("loadAllContent fallback invoked:", err.message || err);
      const articles = FALLBACK_ARTICLES;
      populateLeftSidebar(articles.slice(0, 4));
      populateExclusiveSection(articles[0]);
      populateRightSidebar([articles[1], articles[2]]);
      populateFeaturedLatest(articles[3]);
      populateLatestSideList(articles.slice(4, 9));
      populateBottomScroll(articles);
      updateTimestamp();
    }
  }

  // --- POPULATE UI COMPONENTS ---
  function populateLeftSidebar(articles) {
    if (!leftSidebar || !articles?.length) return;
    leftSidebar.innerHTML = "";

    articles.forEach((article) => {
      const el = document.createElement("article");
      el.classList.add("sidebar-article");
      el.innerHTML = `
        <h3>${article.title}</h3>
        <p>${truncateText(article.description, 120)}</p>
        <p><strong>By ${
          article.source?.name ? article.source.name.toUpperCase() : "Unknown"
        }</strong></p>
      `;
      if (article.url && article.url !== "#") {
        el.style.cursor = "pointer";
        el.addEventListener("click", () => window.open(article.url, "_blank"));
      }
      leftSidebar.appendChild(el);
    });
  }

  function populateExclusiveSection(article) {
    if (!exclusiveSection || !article) return;
    exclusiveSection.innerHTML = `
      <div class="exclusive-image">
        <img src="${article.image || "images/default.jpg"}" alt="${
      article.title || ""
    }" onerror="this.src='images/default.jpg'">
        <span class="exclusive-label">BREAKING NEWS</span>
      </div>
      <div class="exclusive-text">
        <h1>${article.title || ""}</h1>
        <p>${truncateText(article.description, 150)}</p>
      </div>`;

    if (article.url && article.url !== "#") {
      exclusiveSection.style.cursor = "pointer";
      exclusiveSection.addEventListener("click", () =>
        window.open(article.url, "_blank")
      );
    }
  }

  function populateRightSidebar(articles) {
    if (!rightSidebar || !articles?.length) return;
    rightSidebar.innerHTML = "";

    articles.forEach((article, idx) => {
      const section = document.createElement("section");
      section.classList.add("sidebar-section");
      const label = idx === 0 ? "TRENDING NOW" : "HOT TOPIC";

      section.innerHTML = `
        <div class="sidebar-story">
          <img src="${article.image || "images/default.jpg"}" alt="${
        article.title || ""
      }" onerror="this.src='images/default.jpg'"> 
          <h4>${label}</h4>
          <h3>${article.title || ""}</h3>
          <p><strong>${
            article.source?.name ? article.source.name.toUpperCase() : "Unknown"
          }</strong></p>
        </div>`;

      if (article.url && article.url !== "#") {
        section.style.cursor = "pointer";
        section.addEventListener("click", () =>
          window.open(article.url, "_blank")
        );
      }
      rightSidebar.appendChild(section);
    });
  }

  function populateFeaturedLatest(article) {
    if (!featuredLatest || !article) return;
    featuredLatest.innerHTML = `
      <img src="${article.image || "images/default.jpg"}" alt="${
      article.title || ""
    }" onerror="this.src='images/default.jpg'">
      <div class="latest-text">
        <h3>${article.title || ""}</h3>
        <p>${truncateText(article.description, 200)}</p>
        <span class="author">By ${article.source?.name || "Unknown"}</span>
      </div>`;

    if (article.url && article.url !== "#") {
      featuredLatest.style.cursor = "pointer";
      featuredLatest.addEventListener("click", () =>
        window.open(article.url, "_blank")
      );
    }
  }

  function populateLatestSideList(articles) {
    if (!latestSideList || !articles?.length) return;
    latestSideList.innerHTML = "";

    articles.forEach((article) => {
      const el = document.createElement("article");
      el.classList.add("side-article");
      el.innerHTML = `
        <img src="${article.image || "images/default.jpg"}" alt="${
        article.title || ""
      }" onerror="this.src='images/default.jpg'">
        <div>
          <h4>${article.title || ""}</h4>
          <p>${truncateText(article.description, 100)}</p>
        </div>`;

      if (article.url && article.url !== "#") {
        el.style.cursor = "pointer";
        el.addEventListener("click", () => window.open(article.url, "_blank"));
      }
      latestSideList.appendChild(el);
    });
  }

  function populateBottomScroll(articles) {
    if (!bottomScroll || !articles?.length) return;
    bottomScroll.innerHTML = "";

    articles.slice(0, 10).forEach((article) => {
      const div = document.createElement("div");
      div.classList.add("scroll-item");
      div.textContent = (article.title || "").toUpperCase();

      if (article.url && article.url !== "#") {
        div.style.cursor = "pointer";
        div.addEventListener("click", () => window.open(article.url, "_blank"));
      }

      bottomScroll.appendChild(div);
    });
  }

  // --- Load Events ---
  async function loadEvents() {
    if (!eventsList) return;

    const upcomingEvents = [
      {
        name: "Cape Town International Jazz Festival 2025",
        date: "March 28-29, 2025",
        city: "Cape Town",
        url: "https://www.capetownjazzfest.com/",
      },
      {
        name: "Rocking the Daisies",
        date: "October 2025",
        city: "Western Cape",
        url: "https://www.rockingthedaisies.com/",
      },
      {
        name: "OppiKoppi Festival",
        date: "August 2025",
        city: "Limpopo",
        url: "https://www.oppikoppi.co.za/",
      },
      {
        name: "Ultra South Africa",
        date: "February 2025",
        city: "Johannesburg & Cape Town",
        url: "https://ultrasouthafrica.com/",
      },
      {
        name: "Back to the City",
        date: "December 2025",
        city: "Johannesburg",
        url: "https://backtothecity.co.za/",
      },
    ];

    eventsList.innerHTML = "";
    upcomingEvents.forEach((event) => {
      const div = document.createElement("article");
      div.classList.add("side-article");
      div.innerHTML = `
        <div>
          <h4>${event.name}</h4>
          <p>${event.date} – ${event.city}</p>
        </div>`;
      div.addEventListener("click", () => window.open(event.url, "_blank"));
      div.style.cursor = "pointer";
      eventsList.appendChild(div);
    });
  }

  // --- load Spotify Releases ---
  async function loadSpotifyReleasesDynamic() {
    if (!releasesGrid) return;

    console.log("Loading Spotify releases...");
    showLoading(releasesGrid, "articles", 6);

    try {
      const tokenResponse = await fetchWithTimeout(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET),
          },
          body: "grant_type=client_credentials",
        },
        10000
      );

      if (!tokenResponse.ok) {
        throw new Error("Failed to authenticate with Spotify");
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      const saGenres = [
        "amapiano",
        "south african house",
        "gqom",
        "afro-pop",
        "mzansi hip hop",
      ];
      let currentGenreIndex = 0;

      async function fetchGenreReleases(genre) {
        const genreQuery = encodeURIComponent(genre);
        const response = await fetchWithTimeout(
          `https://api.spotify.com/v1/search?q=${genreQuery}&type=album&market=ZA&limit=6`,
          { headers: { Authorization: "Bearer " + accessToken } },
          10000
        );

        if (!response.ok) {
          throw new Error("Failed to fetch releases");
        }

        const data = await response.json();
        return data.albums?.items || [];
      }

      async function updateReleases() {
        showLoading(releasesGrid, "articles", 6);
        const genre = saGenres[currentGenreIndex];

        try {
          const albums = await fetchGenreReleases(genre);

          releasesGrid.innerHTML = "";
          if (!albums.length) {
            showError(releasesGrid, `No new releases for ${genre} right now.`);
          } else {
            albums.forEach((album) => {
              const div = document.createElement("div");
              div.classList.add("release-card");
              div.innerHTML = `
                <img src="${album.images?.[0]?.url || "images/default.jpg"}" 
                     alt="${album.name || ""}"
                     onerror="this.src='images/default.jpg'">
                <div class="release-info">
                  <h4>${album.name || ""}</h4>
                  <p>${(album.artists || []).map((a) => a.name).join(", ")}</p>
                </div>`;
              if (album.external_urls?.spotify) {
                div.addEventListener("click", () =>
                  window.open(album.external_urls.spotify, "_blank")
                );
                div.style.cursor = "pointer";
              }
              releasesGrid.appendChild(div);
            });
          }

          currentGenreIndex = (currentGenreIndex + 1) % saGenres.length;
        } catch (err) {
          console.error("Error updating releases:", err);
          showError(releasesGrid, "Unable to load releases for " + genre);
        }
      }

      // initial fetch + rotate every 20s
      await updateReleases();
      const releasesInterval = setInterval(updateReleases, 20000);

      // return a cleanup function in case caller wants to stop rotation
      return () => clearInterval(releasesInterval);
    } catch (err) {
      console.error("Spotify releases failed:", err.message || err);
      showError(releasesGrid, "Unable to load Spotify releases right now.");
    }
  }

  // === initialization ===
  showLoading(leftSidebar, "sidebar", 4);
  showLoading(exclusiveSection, "exclusive", 1);
  showLoading(rightSidebar, "sidebar", 2);
  showLoading(featuredLatest, "featured", 1);
  showLoading(latestSideList, "articles", 5);

  loadAllContent();
  loadEvents();
  loadSpotifyReleasesDynamic();
});
