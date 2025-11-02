document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".music-tabs .tab");
  const sections = document.querySelectorAll(".music-grid");

  // API Keys
  const SPOTIFY_CLIENT_ID = "61fb26a49a5c413c9a52aea3a25eda32";
  const SPOTIFY_CLIENT_SECRET = "2d33c647e7a645328c8011a0f190d501";
  const GNEWS_API_KEY = "8f1c1833dfbacfe906b39011305f84e1";
  const YOUTUBE_API_KEY = "AIzaSyCNiJRNnYjNZvb4kAu_U5uhELzkTWscOTQ";

  // Simple cache storage
  const cache = {
    spotify: null,
    news: null,
    classics: null,
    videos: null,
  };

  // Track loaded tabs
  const loadedTabs = new Set(["new"]);

  // Track last refresh times
  const lastRefresh = {
    spotify: 0,
    news: 0,
    classics: 0,
    videos: 0,
  };

  // Refresh intervals
  const REFRESH_TIMES = {
    spotify: 5 * 60 * 1000, // 5 minutes
    news: 3 * 60 * 1000, // 3 minutes
    classics: 10 * 60 * 1000, // 10 minutes
    videos: 7 * 60 * 1000, // 7 minutes
  };

  // Active timers
  const timers = {};

  // Spotify token
  let spotifyToken = null;

  // South African artists and keywords for filtering
  const southAfricanArtists = [
    // Amapiano Artists
    "Kabza De Small",
    "DJ Maphorisa",
    "Focalistic",
    "DBN Gogo",
    "Major League DJz",
    "Mellow & Sleazy",
    "Tyler ICU",
    "Sir Trill",
    "Ami Faku",
    "Sha Sha",
    "Mörda",
    "Babalwa M",
    "Nkosazana Daughter",
    "TOSS",
    "Young Stunna",
    "Semi Tee",
    "Miano",
    "Kammu Dee",
    "Mr JazziQ",
    "Reece Madlisa",
    "Zuma",
    "Busta 929",
    "Villosoul",
    "Riky Rick",
    "K.O",
    "Nasty C",
    "A-Reece",
    "Blxckie",
    "Sjava",
    "Emtee",
    "Cassper Nyovest",
    "Kwesta",
    "Aka",
    "Nadia Nakai",
    "Focalistic",
    "Ch'cco",
    "Pabi Cooper",
    "Daliwonga",
    "Musketeers",

    // Legendary SA Artists (still releasing music)
    "Black Coffee",
    "Master KG",
    "Nomcebo Zikode",
    "Brenda Fassie",
    "Miriam Makeba",
    "Hugh Masekela",
    "Ladysmith Black Mambazo",
    "Johnny Clegg",
    "Lucky Dube",
    "Yvonne Chaka Chaka",

    // Rising Stars
    "Lloyiso",
    "Tyla",
    "Elaine",
    "Amanda Black",
    "Shekhinah",
    "Msaki",
    "Zoë Modiga",
    "Manana",
    "Bongeziwe Mabandla",
  ];

  // SA music keywords for additional filtering
  const saMusicKeywords = [
    "amapiano",
    "gqom",
    "kwaito",
    "afrohouse",
    "south africa",
    "sa music",
    "mzansi",
    "afro tech",
    "durban house",
  ];

  // Classic artists (pre-2000s)
  const classicSAArtists = [
    "Miriam Makeba",
    "Hugh Masekela",
    "Ladysmith Black Mambazo",
    "Johnny Clegg",
    "Brenda Fassie",
    "Lucky Dube",
    "Yvonne Chaka Chaka",
    "Abdullah Ibrahim",
    "The Soul Brothers",
    "Mahotella Queens",
    "Mahlathini",
    "Stimela",
    "Bayete",
  ];

  // === INITIAL SETUP ===
  //sections.forEach((s, i) => {
  //  s.style.display = i === 0 ? "block" : "none";
  // });

  // Load initial content
  fetchSpotifyNewReleases();
  startAllTimers();

  // === REFRESH SYSTEM ===
  function startAllTimers() {
    console.log("Starting refresh timers...");

    // Clear any existing timers
    stopAllTimers();

    // Start timer for each content type
    startTimer("spotify", () => {
      if (isTabActive("new")) {
        console.log("Auto-refreshing South African new releases...");
        fetchSpotifyNewReleases();
      }
    });

    startTimer("news", () => {
      if (isTabActive("reviews")) {
        console.log("Auto-refreshing news...");
        fetchGNewsArticles();
      }
    });

    startTimer("classics", () => {
      if (isTabActive("classics")) {
        console.log("Auto-refreshing classics...");
        fetchSAClassics();
      }
    });

    startTimer("videos", () => {
      if (isTabActive("videos")) {
        console.log("Auto-refreshing videos...");
        fetchYouTubeVideos();
      }
    });
  }

  function startTimer(type, callback) {
    timers[type] = setInterval(callback, REFRESH_TIMES[type]);
    console.log(
      `Timer started for ${type} - refreshing every ${
        REFRESH_TIMES[type] / 1000 / 60
      } minutes`
    );
  }

  function stopAllTimers() {
    Object.values(timers).forEach((timer) => clearInterval(timer));
    console.log("All timers stopped");
  }

  function isTabActive(tabName) {
    const activeTab = document.querySelector(".music-tabs .tab.active");
    return activeTab && activeTab.dataset.tab === tabName;
  }

  function needsRefresh(type) {
    const now = Date.now();
    return now - lastRefresh[type] > REFRESH_TIMES[type];
  }

  function showRefreshMessage(type) {
    // Remove any existing message
    const existingMsg = document.getElementById("refresh-message");
    if (existingMsg) existingMsg.remove();

    const message = document.createElement("div");
    message.id = "refresh-message";
    message.innerHTML = `🔄 Fresh ${getTypeName(type)} content loaded!`;
    message.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: #1db954;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 1000;
      font-size: 14px;
      font-weight: 600;
      animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(message);

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (message.parentElement) {
        message.remove();
      }
    }, 3000);
  }

  function getTypeName(type) {
    const names = {
      spotify: "South African music",
      news: "news",
      classics: "classic music",
      videos: "videos",
    };
    return names[type] || "content";
  }

  // === TAB SWITCHING ===
  tabs.forEach((tab) => {
    tab.addEventListener("click", async () => {
      const target = tab.dataset.tab;

      // Update active tab
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Show/hide sections
      sections.forEach((sec) => {
        sec.style.display = sec.id === target ? "block" : "none";
      });

      // Load content if needed
      if (!loadedTabs.has(target) || needsRefresh(target)) {
        switch (target) {
          case "new":
            await fetchSpotifyNewReleases();
            break;
          case "reviews":
            await fetchGNewsArticles();
            break;
          case "classics":
            await fetchSAClassics();
            break;
          case "videos":
            await fetchYouTubeVideos();
            break;
        }
        loadedTabs.add(target);
      }
    });
  });

  // === SPOTIFY AUTH ===
  async function getSpotifyToken() {
    if (spotifyToken) return spotifyToken;

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET),
        },
        body: "grant_type=client_credentials",
      });

      if (!response.ok) throw new Error("Spotify auth failed");

      const data = await response.json();
      spotifyToken = data.access_token;
      return spotifyToken;
    } catch (error) {
      console.error("Spotify Auth Error:", error);
      throw error;
    }
  }

  // === SOUTH AFRICAN MUSIC FILTERING ===
  function isSouthAfricanMusic(album) {
    if (!album || !album.artists) return false;

    const artistNames = album.artists.map((artist) =>
      artist.name.toLowerCase()
    );
    const albumName = album.name.toLowerCase();

    // Check if any artist is South African
    const hasSAArist = southAfricanArtists.some((artist) =>
      artistNames.some(
        (name) =>
          name.includes(artist.toLowerCase()) ||
          artist.toLowerCase().includes(name)
      )
    );

    // Check for SA music keywords in album name
    const hasSAKeywords = saMusicKeywords.some((keyword) =>
      albumName.includes(keyword.toLowerCase())
    );

    // Check release date (last 6 months)
    const isRecent = isWithinLastSixMonths(album.release_date);

    return (hasSAArist || hasSAKeywords) && isRecent;
  }

  function isWithinLastSixMonths(releaseDate) {
    if (!releaseDate) return false;

    const release = new Date(releaseDate);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return release >= sixMonthsAgo;
  }

  function getDaysAgo(releaseDate) {
    if (!releaseDate) return "";

    const release = new Date(releaseDate);
    const now = new Date();
    const diffTime = Math.abs(now - release);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 60) return "1 month ago";
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  // === API FUNCTIONS ===
  async function fetchSpotifyNewReleases() {
    const container = document.getElementById("spotifyContainer");
    if (!container) return;

    // Show refreshing state
    container.innerHTML =
      '<div class="loading refreshing">Loading new South African music releases...</div>';

    try {
      const token = await getSpotifyToken();

      // Fetch more results to ensure we get enough SA music after filtering
      const response = await fetch(
        "https://api.spotify.com/v1/browse/new-releases?country=ZA&limit=50",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Spotify API failed");

      const data = await response.json();

      // Filter for South African music from last 6 months
      const saAlbums = data.albums?.items?.filter(isSouthAfricanMusic) || [];

      console.log(
        `Found ${saAlbums.length} South African albums from last 6 months`
      );

      // If we don't have enough SA albums, try searching for specific SA artists
      let finalAlbums = saAlbums.slice(0, 9);

      if (finalAlbums.length < 9) {
        console.log(
          "Not enough SA albums found, searching specific artists..."
        );
        const additionalAlbums = await searchSAAristNewReleases(token);
        finalAlbums = [...finalAlbums, ...additionalAlbums]
          .filter(
            (album, index, self) =>
              index === self.findIndex((a) => a.id === album.id)
          )
          .slice(0, 9);
      }

      cache.spotify = { albums: { items: finalAlbums } };
      lastRefresh.spotify = Date.now();

      if (isTabActive("new") && finalAlbums.length > 0) {
        showRefreshMessage("spotify");
      }

      renderSpotifyData(container, { albums: { items: finalAlbums } });
    } catch (error) {
      console.error("Spotify Error:", error);
      container.innerHTML = `
        <div class="error">
          <p>Failed to load South African music releases</p>
          <button onclick="fetchSpotifyNewReleases()" class="retry-btn">Try Again</button>
          ${
            cache.spotify
              ? `<button onclick="useCachedData('spotify')" class="cache-btn">Use Last Data</button>`
              : ""
          }
        </div>
      `;
    }
  }

  // Search for new releases from specific SA artists
  async function searchSAAristNewReleases(token) {
    const albums = [];

    // Search top SA artists for recent albums
    const artistsToSearch = southAfricanArtists.slice(0, 10);

    for (const artist of artistsToSearch) {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=artist:${encodeURIComponent(
            artist
          )}&type=album&limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.albums?.items) {
            // Filter for recent SA albums
            const recentSAAlbums = data.albums.items.filter(
              (album) =>
                isSouthAfricanMusic(album) &&
                isWithinLastSixMonths(album.release_date)
            );
            albums.push(...recentSAAlbums);
          }
        }
      } catch (e) {
        console.log(`Search failed for ${artist}`, e);
      }

      if (albums.length >= 9) break;
    }

    return albums;
  }

  function renderSpotifyData(container, data) {
    if (!data.albums?.items?.length) {
      container.innerHTML = `
        <div class="error">
          <p>No new South African music found from the last 6 months</p>
          <p style="font-size: 0.9rem; color: #666; margin-top: 10px;">
            Try refreshing in a few minutes or check back when new music is released.
          </p>
          <button onclick="fetchSpotifyNewReleases()" class="retry-btn">Try Again</button>
        </div>
      `;
      return;
    }

    container.innerHTML = data.albums.items
      .map((album) => {
        const releaseInfo = getDaysAgo(album.release_date);
        const isSA = isSouthAfricanMusic(album);

        return `
      <div class="music-card">
        <div class="album-art-container">
          <img src="${
            album.images[0]?.url || "https://via.placeholder.com/300"
          }" 
               alt="${album.name}" class="album-art" />
          <div style="position: absolute; top: 4px; right: 4px; display: flex; gap: 2px;">
            ${isSA ? '<span class="sa-badge">SA</span>' : ""}
            <span class="new-badge">NEW</span>
          </div>
        </div>
        <div class="album-info">
          <div class="genre">${getAlbumGenre(album)}</div>
          <h3 class="song-title">${escapeHtml(album.name)}</h3>
          <p class="artist">${escapeHtml(
            album.artists.map((a) => a.name).join(", ")
          )}</p>
          <p class="date">Released ${releaseInfo}</p>
          <a href="${
            album.external_urls.spotify
          }" target="_blank" class="spotify-btn">
            Listen on Spotify
          </a>
        </div>
      </div>
    `;
      })
      .join("");
  }

  async function fetchGNewsArticles() {
    const container = document.getElementById("newsContainer");
    if (!container) return;

    container.innerHTML =
      '<div class="loading refreshing">Loading South African music news...</div>';

    try {
      const response = await fetch(
        `https://gnews.io/api/v4/search?q=music%20south%20africa&lang=en&country=za&max=9&token=${GNEWS_API_KEY}`
      );

      if (!response.ok) throw new Error("News API failed");

      const data = await response.json();

      cache.news = data;
      lastRefresh.news = Date.now();

      if (isTabActive("reviews")) {
        showRefreshMessage("news");
      }

      renderNewsData(container, data);
    } catch (error) {
      console.error("News Error:", error);
      container.innerHTML = `
        <div class="error">
          <p>Failed to load music news</p>
          <button onclick="fetchGNewsArticles()" class="retry-btn">Try Again</button>
          ${
            cache.news
              ? `<button onclick="useCachedData('news')" class="cache-btn">Use Last Data</button>`
              : ""
          }
        </div>
      `;
    }
  }

  function renderNewsData(container, data) {
    if (!data.articles?.length) {
      container.innerHTML = '<div class="error">No news found</div>';
      return;
    }

    container.innerHTML = data.articles
      .map(
        (article) => `
      <div class="music-card">
        <div class="album-art-container">
          <img src="${article.image || "https://via.placeholder.com/300"}" 
               alt="${article.title}" class="album-art" />
        </div>
        <div class="album-info">
          <div class="genre">NEWS</div>
          <h3 class="song-title">${escapeHtml(article.title)}</h3>
          <p class="artist">${escapeHtml(
            article.description || "South African music news"
          )}</p>
          <p class="author">By ${article.source?.name || "The Beat Report"}</p>
          <a href="${
            article.url
          }" target="_blank" class="spotify-btn">Read Article</a>
        </div>
      </div>
    `
      )
      .join("");
  }

  async function fetchSAClassics() {
    const container = document.getElementById("lastfmContainer");
    if (!container) return;

    container.innerHTML =
      '<div class="loading refreshing">Loading South African classics...</div>';

    try {
      const token = await getSpotifyToken();
      const albums = [];

      // Search for classic artists
      for (const artist of classicSAArtists.slice(0, 6)) {
        try {
          const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(
              artist
            )}&type=album&limit=3`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.albums?.items) {
              // Filter for albums before 2000
              const classicAlbums = data.albums.items.filter((album) => {
                const releaseYear = parseInt(
                  album.release_date?.substring(0, 4) || "2024"
                );
                return releaseYear < 2000;
              });
              albums.push(...classicAlbums);
            }
          }
        } catch (e) {
          console.log(`Failed for ${artist}`, e);
        }

        if (albums.length >= 9) break;
      }

      cache.classics = { albums };
      lastRefresh.classics = Date.now();

      if (isTabActive("classics")) {
        showRefreshMessage("classics");
      }

      renderClassicsData(container, { albums: albums.slice(0, 9) });
    } catch (error) {
      console.error("Classics Error:", error);
      container.innerHTML = `
        <div class="error">
          <p>Failed to load classics</p>
          <button onclick="fetchSAClassics()" class="retry-btn">Try Again</button>
          ${
            cache.classics
              ? `<button onclick="useCachedData('classics')" class="cache-btn">Use Last Data</button>`
              : ""
          }
        </div>
      `;
    }
  }

  function renderClassicsData(container, data) {
    if (!data.albums?.length) {
      container.innerHTML = '<div class="error">No classics found</div>';
      return;
    }

    container.innerHTML = data.albums
      .map((album) => {
        const releaseYear = album.release_date?.substring(0, 4) || "Classic";

        return `
      <div class="music-card">
        <div class="album-art-container">
          <img src="${
            album.images[0]?.url || "https://via.placeholder.com/300"
          }" 
               alt="${album.name}" class="album-art" />
          <span class="sa-badge" style="position: absolute; top: 4px; right: 4px;">CLASSIC</span>
        </div>
        <div class="album-info">
          <div class="genre">CLASSIC</div>
          <h3 class="song-title">${escapeHtml(album.name)}</h3>
          <p class="artist">${escapeHtml(
            album.artists.map((a) => a.name).join(", ")
          )}</p>
          <p class="date">${releaseYear} • South African Classic</p>
          <a href="${
            album.external_urls.spotify
          }" target="_blank" class="spotify-btn">
            Listen on Spotify
          </a>
        </div>
      </div>
    `;
      })
      .join("");
  }

  async function fetchYouTubeVideos() {
    const container = document.getElementById("youtubeContainer");
    if (!container) return;

    container.innerHTML =
      '<div class="loading refreshing">Loading South African music videos...</div>';

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=south+african+music+2024&type=video&maxResults=9&key=${YOUTUBE_API_KEY}`
      );

      if (!response.ok) throw new Error("YouTube API failed");

      const data = await response.json();

      cache.videos = data;
      lastRefresh.videos = Date.now();

      if (isTabActive("videos")) {
        showRefreshMessage("videos");
      }

      renderYouTubeData(container, data);
    } catch (error) {
      console.error("YouTube Error:", error);
      container.innerHTML = `
        <div class="error">
          <p>Failed to load videos</p>
          <button onclick="fetchYouTubeVideos()" class="retry-btn">Try Again</button>
          ${
            cache.videos
              ? `<button onclick="useCachedData('videos')" class="cache-btn">Use Last Data</button>`
              : ""
          }
        </div>
      `;
    }
  }

  function renderYouTubeData(container, data) {
    if (!data.items?.length) {
      container.innerHTML = '<div class="error">No videos found</div>';
      return;
    }

    container.innerHTML = data.items
      .map(
        (video) => `
      <div class="music-card">
        <div class="youtube-thumbnail">
          <img src="${video.snippet.thumbnails.medium.url}" 
               alt="${video.snippet.title}" />
          <div class="play-button">▶</div>
        </div>
        <div class="album-info">
          <div class="genre">VIDEO</div>
          <h3 class="song-title">${escapeHtml(video.snippet.title)}</h3>
          <p class="artist">${escapeHtml(video.snippet.channelTitle)}</p>
          <a href="https://www.youtube.com/watch?v=${video.id.videoId}" 
             target="_blank" class="spotify-btn">
            Watch on YouTube
          </a>
        </div>
      </div>
    `
      )
      .join("");
  }

  // Helper function to determine album genre
  function getAlbumGenre(album) {
    const albumName = album.name.toLowerCase();
    if (albumName.includes("amapiano")) return "AMAPIANO";
    if (albumName.includes("hip") || albumName.includes("rap"))
      return "HIP-HOP";
    if (albumName.includes("r&b") || albumName.includes("rb")) return "R&B";
    if (albumName.includes("dance") || albumName.includes("house"))
      return "DANCE";
    return "MUSIC";
  }

  // === UTILITY FUNCTIONS ===
  function escapeHtml(text) {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function useCachedData(type) {
    const container = document.getElementById(
      {
        spotify: "spotifyContainer",
        news: "newsContainer",
        classics: "lastfmContainer",
        videos: "youtubeContainer",
      }[type]
    );

    if (!container || !cache[type]) return;

    const renderers = {
      spotify: renderSpotifyData,
      news: renderNewsData,
      classics: renderClassicsData,
      videos: renderYouTubeData,
    };

    renderers[type](container, cache[type]);
  }

  // Handle page visibility
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAllTimers();
    } else {
      startAllTimers();
    }
  });

  // Make functions global for buttons
  window.fetchSpotifyNewReleases = fetchSpotifyNewReleases;
  window.fetchGNewsArticles = fetchGNewsArticles;
  window.fetchSAClassics = fetchSAClassics;
  window.fetchYouTubeVideos = fetchYouTubeVideos;
  window.useCachedData = useCachedData;
});
