// 🌍 INTERNATIONAL MUSIC NEWS HOMEPAGE.JS

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
  const NEWSAPI_KEY = "4bda1a0c084d4ef69c6552beeb40289d";
  const GUARDIAN_API_KEY = "test";
  const SPOTIFY_CLIENT_ID = "61fb26a49a5c413c9a52aea3a25eda32";
  const SPOTIFY_CLIENT_SECRET = "2d33c647e7a645328c8011a0f190d501";
  const TICKETMASTER_API_KEY = "iAABWmE3QG0CbtAOfbpfmoSCrSC7PYcb";
  const EVENTBRITE_API_KEY = "CE5SAGRDXLB4QPZ73O";

  // === SPOTIFY CHARTS CONFIG ===
  const SPOTIFY_CHARTS = {
    top50: "37i9dQZEVXbMH2jvi6jvjk",
    viral: "37i9dQZEVXbKCF6DuV1Buf",
    amapiano: "37i9dQZF1DWVlYsZJXqdym",
  };

  // === MUSIC KEYWORDS ===
  const MUSIC_KEYWORDS = [
    "pop music",
    "hip hop",
    "rap",
    "rock",
    "electronic",
    "dance",
    "r&b",
    "jazz",
    "classical",
    "country",
    "reggae",
    "latin",
    "k-pop",
    "afrobeats",
    "amapiano",
    "reggaeton",
    "indie",
    "alternative",
    "metal",
    "punk",
    "folk",
    "blues",
    "album release",
    "new single",
    "music video",
    "tour dates",
    "concert",
    "festival",
    "grammy",
    "billboard",
    "charts",
    "streaming",
    "vinyl",
    "record label",
    "music award",
    "platinum",
    "gold record",
    "taylor swift",
    "beyonce",
    "drake",
    "bad bunny",
    "the weeknd",
    "ed sheeran",
    "ariana grande",
    "bts",
    "blackpink",
    "coldplay",
    "kendrick lamar",
    "coachella",
    "glastonbury",
    "rolling loud",
    "lollapalooza",
    "spotify",
    "apple music",
    "youtube music",
    "tidal",
    "soundcloud",
    "bandcamp",
    "tiktok sounds",
    "shazam",
  ];

  const SA_MUSIC_KEYWORDS = [
    "amapiano",
    "gqom",
    "afrohouse",
    "kwaito",
    "south african music",
    "south africa",
    "afrobeats",
    "house music",
    "dance music",
    "black coffee",
    "master kg",
    "sjava",
    "kabza de small",
    "dj maphorisa",
    "masego",
    "nasty c",
    "semi tee",
    "miano",
    "kamo mphela",
    "uncle waffles",
    "focalistic",
    "daliwonga",
    "busta 929",
    "mr jazziq",
    "vigro deep",
    "reese",
    "mas musiq",
    "young stunna",
    "sha sha",
    "musketeers",
    "josiah de disciple",
    "bontle smith",
    "de mthuda",
    "soa mattrix",
    "tyson sybateli",
    "9wumba",
    "mellow",
    "sleazy",
    "umlando",
    "piano",
    "log drum",
    "shakers",
    "private school piano",
    "durban",
    "johannesburg",
    "cape town",
    "pretoria",
    "soweto",
  ];

  // === FALLBACK DATA ===
  const FALLBACK_ARTICLES = [
    {
      title:
        "Taylor Swift Announces 'The Tortured Poets Department' World Tour",
      description:
        "Global superstar reveals massive stadium tour spanning 5 continents, with surprise collaborations and new visual productions.",
      image: "images/music-default.jpg",
      source: { name: "Music Globe" },
      url: "#",
    },
    {
      title: "Spotify Reveals Most Streamed Artists of 2024",
      description:
        "Bad Bunny maintains top spot while new artists break into global charts. Streaming numbers show 30% growth in emerging markets.",
      image: "images/music-default.jpg",
      source: { name: "Streaming Report" },
      url: "#",
    },
    {
      title: "Coachella 2025 Lineup: Surprise Headliners and Reunions",
      description:
        "Legendary bands and breakthrough artists set for iconic festival. Two secret headliners to be announced week of event.",
      image: "images/music-default.jpg",
      source: { name: "Festival News" },
      url: "#",
    },
    {
      title: "Vinyl Sales Continue Record Growth Amid Streaming Dominance",
      description:
        "Physical music format sees 15th consecutive quarter of growth as collectors and new fans embrace analog experience.",
      image: "images/music-default.jpg",
      source: { name: "Music Business" },
      url: "#",
    },
  ];

  const SA_FALLBACK_RELEASES = [
    {
      name: "Amapiano 2024 Hits",
      artist: "Various Artists",
      image: "images/sa-music-default.jpg",
      url: "#",
      release_date: "2024-01-15",
    },
    {
      name: "Umlando Vol. 3",
      artist: "Kabza De Small & DJ Maphorisa",
      image: "images/sa-music-default.jpg",
      url: "#",
      release_date: "2024-01-10",
    },
    {
      name: "House of Piano",
      artist: "Uncle Waffles",
      image: "images/sa-music-default.jpg",
      url: "#",
      release_date: "2024-01-08",
    },
    {
      name: "Afro House Anthems",
      artist: "Black Coffee",
      image: "images/sa-music-default.jpg",
      url: "#",
      release_date: "2024-01-05",
    },
  ];

  const FALLBACK_EVENTS = [
    {
      name: "Ultra South Africa 2024",
      venue: "Johannesburg & Cape Town",
      date: "March 15-16, 2024",
      image: "images/event-default.jpg",
      url: "#",
      price: "From R750",
    },
    {
      name: "Rocking The Daisies",
      venue: "Cape Town",
      date: "October 4-6, 2024",
      image: "images/event-default.jpg",
      url: "#",
      price: "From R600",
    },
    {
      name: "AfroFuture Fest",
      venue: "Pretoria",
      date: "February 24, 2024",
      image: "images/event-default.jpg",
      url: "#",
      price: "From R350",
    },
    {
      name: "Cape Town Jazz Festival",
      venue: "Cape Town International Convention Centre",
      date: "March 29-30, 2024",
      image: "images/event-default.jpg",
      url: "#",
      price: "From R450",
    },
  ];

  const FALLBACK_CHARTS = [
    {
      rank: 1,
      name: "Stimela",
      artist: "2Point1, Ntate Stunna, Ntate Brown, Lowedown",
      image: "images/chart-default.jpg",
      url: "https://open.spotify.com/track/example1",
      platform: "spotify",
      duration: "3:42",
    },
    {
      rank: 2,
      name: "Mnike",
      artist: "Tyler ICU, Tumelo_za, DJ Maphorisa, Nandipha808",
      image: "images/chart-default.jpg",
      url: "https://open.spotify.com/track/example2",
      platform: "spotify",
      duration: "3:30",
    },
    {
      rank: 3,
      name: "Paris",
      artist: "Q-Mark, TpZee, Afriikan Papi",
      image: "images/chart-default.jpg",
      url: "https://open.spotify.com/track/example3",
      platform: "spotify",
      duration: "2:55",
    },
    {
      rank: 4,
      name: "Awukhuzeki",
      artist: "Sir Trill, Tycoon, Dlala Thukzin",
      image: "images/chart-default.jpg",
      url: "https://open.spotify.com/track/example4",
      platform: "spotify",
      duration: "4:15",
    },
    {
      rank: 5,
      name: "Sengizwile",
      artist: "Master KG, Lowsheen, Nkosazana Daughter",
      image: "images/chart-default.jpg",
      url: "https://open.spotify.com/track/example5",
      platform: "spotify",
      duration: "3:25",
    },
  ];

  // === EVENT APIS CONFIGURATION ===
  const EVENT_APIS = {
    ticketmaster: {
      key: TICKETMASTER_API_KEY,
      url: "https://app.ticketmaster.com/discovery/v2/events.json",
      params: {
        countryCode: "ZA",
        classificationName: "music",
        size: "10",
        sort: "date,asc",
      },
    },
    eventbrite: {
      key: EVENTBRITE_API_KEY,
      url: "https://www.eventbriteapi.com/v3/events/search/",
      params: {
        "location.address": "South Africa",
        categories: "103",
        sort_by: "date",
        expand: "venue",
      },
    },
  };

  // === UTILITY FUNCTIONS ===
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
      } else if (type === "releases") {
        placeholder.classList.add("release-card", "loading");
        placeholder.innerHTML = `
          <div class="loading-thumb" style="width: 100%; height: 160px; margin-bottom: 10px;"></div>
          <div class="loading-line" style="width: 80%; height: 16px; margin-bottom: 8px;"></div>
          <div class="loading-line" style="width: 60%; height: 14px;"></div>`;
      } else if (type === "events") {
        placeholder.classList.add("side-article", "loading");
        placeholder.innerHTML = `
          <div class="loading-thumb" style="width: 120px; height: 80px; margin-bottom: 10px;"></div>
          <div class="loading-text">
            <div class="loading-line" style="width: 70%; height: 16px; margin-bottom: 8px;"></div>
            <div class="loading-line" style="width: 90%; height: 14px; margin-bottom: 8px;"></div>
            <div class="loading-line" style="width: 50%; height: 12px;"></div>
          </div>`;
      } else if (type === "charts") {
        placeholder.classList.add("chart-item", "loading");
        placeholder.innerHTML = `
          <div class="chart-rank loading-line" style="width: 30px; height: 20px; margin: 0 auto;"></div>
          <div class="loading-thumb" style="width: 50px; height: 50px; border-radius: 6px;"></div>
          <div class="loading-text" style="flex: 1;">
            <div class="loading-line" style="width: 70%; height: 16px; margin-bottom: 8px;"></div>
            <div class="loading-line" style="width: 90%; height: 14px;"></div>
          </div>
          <div class="platform-badge loading-line" style="width: 60px; height: 20px;"></div>`;
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
      lastUpdated.textContent = `Last updated: ${now.toLocaleString("en-US")}`;
    }
  }

  function truncateText(text, maxLength) {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  function isMusicArticle(article) {
    if (!article) return false;
    const searchText = `${article.title || ""} ${article.description || ""} ${
      article.content || ""
    } ${article.source?.name || ""}`.toLowerCase();
    const hasKeyword = MUSIC_KEYWORDS.some((keyword) =>
      searchText.includes(keyword.toLowerCase())
    );
    const musicTerms = [
      "music",
      "song",
      "album",
      "track",
      "single",
      "release",
      "artist",
      "band",
      "dj",
      "producer",
      "festival",
      "concert",
      "tour",
      "performance",
      "award",
      "grammy",
      "billboard",
      "chart",
      "stream",
      "video",
      "lyrics",
      "beat",
      "sound",
      "rhythm",
      "streaming",
      "vinyl",
      "record",
      "label",
    ];
    const hasMusicTerm = musicTerms.some((term) => searchText.includes(term));
    return hasKeyword || hasMusicTerm;
  }

  function isSAMusic(release) {
    if (!release) return false;
    const searchText = `${release.name || ""} ${release.artist || ""} ${
      release.genre || ""
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

  // === SPOTIFY AUTHENTICATION ===
  async function getSpotifyAccessToken() {
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: SPOTIFY_CLIENT_ID,
          client_secret: SPOTIFY_CLIENT_SECRET,
        }),
      });

      if (!response.ok)
        throw new Error(`Spotify auth failed: ${response.status}`);
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Error getting Spotify token:", error);
      return null;
    }
  }

  // === SPOTIFY CHARTS API ===
  async function fetchSACharts() {
    const token = await getSpotifyAccessToken();
    if (!token) return FALLBACK_CHARTS;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${SPOTIFY_CHARTS.top50}?market=ZA`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok)
        throw new Error(`Spotify API failed: ${response.status}`);
      const data = await response.json();

      if (data.tracks?.items) {
        return data.tracks.items.slice(0, 10).map((item, index) => ({
          rank: index + 1,
          name: item.track.name,
          artist: item.track.artists.map((artist) => artist.name).join(", "),
          image: item.track.album.images[0]?.url || "images/chart-default.jpg",
          url: item.track.external_urls.spotify,
          platform: "spotify",
          duration: formatDuration(item.track.duration_ms),
        }));
      }
      return FALLBACK_CHARTS;
    } catch (error) {
      console.error("Error fetching Spotify charts:", error);
      return FALLBACK_CHARTS;
    }
  }

  function formatDuration(ms) {
    if (!ms) return "0:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  // === EVENT API FUNCTIONS ===
  async function fetchMusicEvents() {
    let allEvents = [];

    try {
      const ticketmasterEvents = await fetchFromTicketmaster();
      if (ticketmasterEvents.length > 0)
        allEvents = [...allEvents, ...ticketmasterEvents];

      const eventbriteEvents = await fetchFromEventbrite();
      if (eventbriteEvents.length > 0)
        allEvents = [...allEvents, ...eventbriteEvents];

      if (allEvents.length === 0) return FALLBACK_EVENTS;

      const uniqueEvents = removeDuplicateEvents(allEvents);
      return uniqueEvents.slice(0, 6);
    } catch (error) {
      console.error("Error fetching events:", error);
      return FALLBACK_EVENTS;
    }
  }

  async function fetchFromTicketmaster() {
    if (!TICKETMASTER_API_KEY) return [];
    try {
      const params = new URLSearchParams({
        ...EVENT_APIS.ticketmaster.params,
        apikey: EVENT_APIS.ticketmaster.key,
      });
      const url = `${EVENT_APIS.ticketmaster.url}?${params}`;
      const response = await fetchWithTimeout(url, {}, 8000);
      if (!response.ok)
        throw new Error(`Ticketmaster API failed: ${response.status}`);
      const data = await response.json();

      if (data._embedded && data._embedded.events) {
        return data._embedded.events.map((event) => ({
          name: event.name,
          venue: event._embedded.venues[0]?.name || "Venue TBA",
          date: formatEventDate(event.dates.start.localDate),
          image:
            event.images?.find((img) => img.ratio === "16_9")?.url ||
            "images/event-default.jpg",
          url: event.url,
          price: event.priceRanges?.[0]?.min
            ? `From R${Math.round(event.priceRanges[0].min)}`
            : "Price TBA",
        }));
      }
      return [];
    } catch (error) {
      console.error("Ticketmaster API error:", error);
      return [];
    }
  }

  async function fetchFromEventbrite() {
    if (!EVENTBRITE_API_KEY) return [];
    try {
      const params = new URLSearchParams(EVENT_APIS.eventbrite.params);
      const url = `${EVENT_APIS.eventbrite.url}?${params}`;
      const response = await fetchWithTimeout(
        url,
        { headers: { Authorization: `Bearer ${EVENT_APIS.eventbrite.key}` } },
        8000
      );
      if (!response.ok)
        throw new Error(`Eventbrite API failed: ${response.status}`);
      const data = await response.json();

      if (data.events) {
        return data.events.map((event) => ({
          name: event.name.text,
          venue: event.venue?.name || "Online Event",
          date: formatEventDate(event.start.local),
          image: event.logo?.url || "images/event-default.jpg",
          url: event.url,
          price: event.is_free ? "Free" : "Paid",
        }));
      }
      return [];
    } catch (error) {
      console.error("Eventbrite API error:", error);
      return [];
    }
  }

  function formatEventDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-ZA", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  }

  function removeDuplicateEvents(events) {
    const seen = new Set();
    return events
      .filter((event) => {
        const key = `${event.name}-${event.venue}-${event.date}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  // === SOUTH AFRICAN MUSIC RELEASES ===
  async function fetchSAMusicReleases() {
    const token = await getSpotifyAccessToken();
    if (!token) return SA_FALLBACK_RELEASES;

    try {
      const queries = [
        "amapiano",
        "south african house",
        "afro house",
        "gqom",
        "kwaito",
      ];
      let allReleases = [];

      for (const query of queries) {
        const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=album&market=ZA&limit=5`;
        const response = await fetchWithTimeout(
          url,
          { headers: { Authorization: `Bearer ${token}` } },
          8000
        );

        if (!response.ok) continue;
        const data = await response.json();

        if (data.albums?.items) {
          const releases = data.albums.items.map((album) => ({
            name: album.name,
            artist: album.artists.map((artist) => artist.name).join(", "),
            image: album.images[0]?.url || "images/sa-music-default.jpg",
            url: album.external_urls.spotify,
            release_date: album.release_date,
            genre: query,
          }));
          allReleases = [...allReleases, ...releases];
        }
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      const uniqueReleases = [];
      const seenNames = new Set();
      for (const release of allReleases) {
        const nameKey = `${release.name}-${release.artist}`.toLowerCase();
        if (isSAMusic(release) && !seenNames.has(nameKey)) {
          seenNames.add(nameKey);
          uniqueReleases.push(release);
        }
      }

      if (uniqueReleases.length < 4) {
        const combined = [
          ...uniqueReleases,
          ...SA_FALLBACK_RELEASES.slice(0, 4 - uniqueReleases.length),
        ];
        return combined.slice(0, 4);
      }
      return uniqueReleases.slice(0, 4);
    } catch (error) {
      console.error("Error fetching SA music releases:", error);
      return SA_FALLBACK_RELEASES;
    }
  }

  // === INTERNATIONAL CONTENT FETCHING ===
  async function fetchAllArticles() {
    let allArticles = [];
    const sources = [];

    try {
      const newsApiArticles = await fetchFromNewsAPI();
      if (newsApiArticles.length > 0) {
        allArticles = [...allArticles, ...newsApiArticles];
        sources.push(`NewsAPI (${newsApiArticles.length})`);
      }

      const guardianArticles = await fetchFromGuardian();
      if (guardianArticles.length > 0) {
        allArticles = [...allArticles, ...guardianArticles];
        sources.push(`Guardian (${guardianArticles.length})`);
      }

      let musicArticles = allArticles.filter(isMusicArticle);
      if (musicArticles.length < 5) return FALLBACK_ARTICLES;

      const uniqueArticles = [];
      const seenTitles = new Set();
      for (const article of musicArticles) {
        const title = (article.title || "").trim().toLowerCase();
        if (title && title.length > 10 && !seenTitles.has(title)) {
          seenTitles.add(title);
          uniqueArticles.push(article);
        }
      }
      return uniqueArticles.slice(0, 15);
    } catch (error) {
      console.error("Error fetching articles:", error);
      return FALLBACK_ARTICLES;
    }
  }

  async function fetchFromNewsAPI() {
    try {
      const queries = [
        "music",
        "new album",
        "tour dates",
        "music festival",
        "grammy awards",
        "billboard chart",
        "spotify",
        "concert tour",
      ];
      let articles = [];

      for (const query of queries) {
        const encodedQuery = encodeURIComponent(query);
        const url = `https://newsapi.org/v2/everything?q=${encodedQuery}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${NEWSAPI_KEY}`;

        try {
          const response = await fetchWithTimeout(url, {}, 8000);
          if (!response.ok) continue;
          const data = await response.json();

          if (data.articles?.length > 0) {
            const transformed = data.articles.map((article) => ({
              title: article.title,
              description: article.description,
              url: article.url,
              image: article.urlToImage || "images/music-default.jpg",
              source: { name: article.source?.name || "News" },
              publishedAt: article.publishedAt,
              content: article.content,
            }));
            articles = [...articles, ...transformed];
          }
        } catch (error) {
          continue;
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      return articles;
    } catch (error) {
      console.error("NewsAPI failed completely:", error);
      return [];
    }
  }

  async function fetchFromGuardian() {
    try {
      const url = `https://content.guardianapis.com/search?section=music&show-fields=thumbnail,trailText&page-size=10&api-key=${GUARDIAN_API_KEY}`;
      const response = await fetchWithTimeout(url, {}, 8000);
      if (!response.ok) return [];
      const data = await response.json();

      if (data.response?.results?.length > 0) {
        return data.response.results.map((article) => ({
          title: article.webTitle,
          description:
            article.fields?.trailText || "Music news from The Guardian",
          url: article.webUrl,
          image: article.fields?.thumbnail || "images/guardian-music.jpg",
          source: { name: "The Guardian" },
          publishedAt: article.webPublicationDate,
        }));
      }
      return [];
    } catch (error) {
      console.error("Guardian API failed:", error);
      return [];
    }
  }

  // === MAIN CONTENT LOADER ===
  async function loadAllContent() {
    try {
      const [articles, saReleases, events, charts] = await Promise.all([
        fetchAllArticles(),
        fetchSAMusicReleases(),
        fetchMusicEvents(),
        fetchSACharts(),
      ]);

      populateLeftSidebar(articles.slice(0, 4));
      populateExclusiveSection(articles[0]);
      populateRightSidebar(articles.slice(1, 3));
      populateFeaturedLatest(articles[3] || articles[0]);
      populateLatestSideList(articles.slice(4, 9));
      populateBottomScroll(articles.slice(0, 10));
      populateSAReleases(saReleases);
      populateMusicEvents(events);
      populateSACharts(charts);
      updateTimestamp();
    } catch (error) {
      console.error("Critical error loading content:", error);
      const articles = FALLBACK_ARTICLES;
      populateLeftSidebar(articles.slice(0, 4));
      populateExclusiveSection(articles[0]);
      populateRightSidebar(articles.slice(1, 3));
      populateFeaturedLatest(articles[3]);
      populateLatestSideList(articles.slice(4, 9));
      populateBottomScroll(articles.slice(0, 10));
      populateSAReleases(SA_FALLBACK_RELEASES);
      populateMusicEvents(FALLBACK_EVENTS);
      populateSACharts(FALLBACK_CHARTS);
      updateTimestamp();
    }
  }

  // === POPULATE FUNCTIONS ===
  function populateLeftSidebar(articles) {
    if (!leftSidebar || !articles?.length) return;
    leftSidebar.innerHTML = "";
    articles.forEach((article) => {
      const el = document.createElement("article");
      el.classList.add("sidebar-article");
      el.innerHTML = `<h3>${article.title}</h3><p>${truncateText(
        article.description,
        120
      )}</p><p><strong>By ${
        article.source?.name ? article.source.name.toUpperCase() : "MUSIC GLOBE"
      }</strong></p>`;
      if (article.url && article.url !== "#") {
        el.style.cursor = "pointer";
        el.addEventListener("click", () => window.open(article.url, "_blank"));
      }
      leftSidebar.appendChild(el);
    });
  }

  function populateExclusiveSection(article) {
    if (!exclusiveSection || !article) return;
    exclusiveSection.innerHTML = `<div class="exclusive-image"><img src="${
      article.image || "images/music-default.jpg"
    }" alt="${
      article.title || ""
    }" onerror="this.src='images/music-default.jpg'"><span class="exclusive-label">GLOBAL EXCLUSIVE</span></div><div class="exclusive-text"><h1>${
      article.title || ""
    }</h1><p>${truncateText(article.description, 150)}</p></div>`;
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
      const label = idx === 0 ? "TRENDING GLOBALLY" : "BREAKING NEWS";
      section.innerHTML = `<div class="sidebar-story"><img src="${
        article.image || "images/music-default.jpg"
      }" alt="${
        article.title || ""
      }" onerror="this.src='images/music-default.jpg'"><h4>${label}</h4><h3>${
        article.title || ""
      }</h3><p><strong>${
        article.source?.name ? article.source.name.toUpperCase() : "MUSIC GLOBE"
      }</strong></p></div>`;
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
    featuredLatest.innerHTML = `<img src="${
      article.image || "images/music-default.jpg"
    }" alt="${
      article.title || ""
    }" onerror="this.src='images/music-default.jpg'"><div class="latest-text"><h3>${
      article.title || ""
    }</h3><p>${truncateText(
      article.description,
      200
    )}</p><span class="author">By ${
      article.source?.name || "Music Globe"
    }</span></div>`;
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
      el.innerHTML = `<img src="${
        article.image || "images/music-default.jpg"
      }" alt="${
        article.title || ""
      }" onerror="this.src='images/music-default.jpg'"><div><h4>${
        article.title || ""
      }</h4><p>${truncateText(article.description, 100)}</p></div>`;
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

  function populateSAReleases(releases) {
    if (!releasesGrid || !releases?.length) return;
    releasesGrid.innerHTML = releases
      .map(
        (release) => `
      <div class="release-card" ${
        release.url && release.url !== "#"
          ? `onclick="window.open('${release.url}', '_blank')" style="cursor: pointer;"`
          : ""
      }>
        <img src="${release.image}" alt="${
          release.name
        }" onerror="this.src='images/sa-music-default.jpg'">
        <div class="release-info">
          <h4>${truncateText(release.name, 40)}</h4>
          <p class="artist">${truncateText(release.artist, 30)}</p>
          <p class="release-date">${new Date(
            release.release_date
          ).toLocaleDateString()}</p>
        </div>
      </div>
    `
      )
      .join("");
  }

  function populateMusicEvents(events) {
    if (!eventsList || !events?.length) return;
    eventsList.innerHTML = events
      .map(
        (event) => `
      <article class="side-article">
        <img src="${event.image}" alt="${
          event.name
        }" onerror="this.src='images/event-default.jpg'">
        <div>
          <h4>${truncateText(event.name, 50)}</h4>
          <p class="venue">${truncateText(event.venue, 40)}</p>
          <p class="date">${event.date}</p>
          <p class="price">${event.price}</p>
        </div>
      </article>
    `
      )
      .join("");
  }

  function populateSACharts(charts) {
    const chartsContainer = document.getElementById("saCharts");
    if (!chartsContainer || !charts?.length) return;
    chartsContainer.innerHTML = charts
      .map(
        (chart) => `
      <div class="chart-item" ${
        chart.url && chart.url !== "#"
          ? `onclick="window.open('${chart.url}', '_blank')" style="cursor: pointer;"`
          : ""
      }>
        <div class="chart-rank">${chart.rank}</div>
        <img src="${chart.image}" alt="${
          chart.name
        }" onerror="this.src='images/chart-default.jpg'">
        <div class="chart-details">
          <h4>${truncateText(chart.name, 30)}</h4>
          <p>${truncateText(chart.artist, 35)}</p>
          <span class="chart-duration">${chart.duration || "3:45"}</span>
        </div>
        <span class="platform-badge">${chart.platform || "spotify"}</span>
      </div>
    `
      )
      .join("");
  }

  // === INITIALIZATION ===
  showLoading(leftSidebar, "sidebar", 4);
  showLoading(exclusiveSection, "exclusive", 1);
  showLoading(rightSidebar, "sidebar", 2);
  showLoading(featuredLatest, "featured", 1);
  showLoading(latestSideList, "articles", 5);
  if (releasesGrid) showLoading(releasesGrid, "releases", 4);
  if (eventsList) showLoading(eventsList, "events", 4);
  const chartsContainer = document.getElementById("saCharts");
  if (chartsContainer) showLoading(chartsContainer, "charts", 5);

  loadAllContent();
});
