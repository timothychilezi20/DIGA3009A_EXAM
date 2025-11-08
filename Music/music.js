document.addEventListener("DOMContentLoaded", () => {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  const tabs = document.querySelectorAll(".music-tabs .tab");
  const sections = document.querySelectorAll(".music-grid");

  // API Keys
  const SPOTIFY_CLIENT_ID = "61fb26a49a5c413c9a52aea3a25eda32";
  const SPOTIFY_CLIENT_SECRET = "2d33c647e7a645328c8011a0f190d501";
  const YOUTUBE_API_KEY = "AIzaSyCNiJRNnYjNZvb4kAu_U5uhELzkTWscOTQ";

  // Simple cache storage
  const cache = {
    new: null,
    classics: null,
    videos: null,
    amapiano: null,
    hiphop: null,
    rnb: null,
    afrohouse: null,
  };

  // Track loaded tabs
  const loadedTabs = new Set(["new"]);

  // Track last refresh times
  const lastRefresh = {
    new: 0,
    classics: 0,
    videos: 0,
    amapiano: 0,
    hiphop: 0,
    rnb: 0,
    afrohouse: 0,
  };

  // Refresh intervals
  const REFRESH_TIMES = {
    new: 5 * 60 * 1000, // 5 minutes
    classics: 10 * 60 * 1000, // 10 minutes
    videos: 7 * 60 * 1000, // 7 minutes
    amapiano: 6 * 60 * 1000, // 6 minutes
    hiphop: 6 * 60 * 1000,
    rnb: 6 * 60 * 1000,
    afrohouse: 6 * 60 * 1000,
  };

  // Active timers
  const timers = {};

  // Spotify token
  let spotifyToken = null;

  // South African artists by genre
  const southAfricanArtists = {
    amapiano: [
      "Kabza De Small",
      "DJ Maphorisa",
      "Focalistic",
      "DBN Gogo",
      "Major League DJz",
      "Mellow & Sleazy",
      "Tyler ICU",
      "Sir Trill",
      "Mr JazziQ",
      "Reece Madlisa",
      "Zuma",
      "Busta 929",
      "Musketeers",
      "Daliwonga",
      "Mpura",
      "Soa mattrix",
      "M.J",
      "Moscow",
      "Chley",
    ],
    hiphop: [
      "Nasty C",
      "A-Reece",
      "Blxckie",
      "Cassper Nyovest",
      "Kwesta",
      "AKA",
      "Nadia Nakai",
      "K.O",
      "Riky Rick",
      "25K",
      "Yanga Chief",
      "Tellaman",
      "Lucasraps",
      "Flvme",
      "Shane Eagle",
      "Frank Casino",
    ],
    rnb: [
      "Ami Faku",
      "Sha Sha",
      "Elaine",
      "Amanda Black",
      "Shekhinah",
      "Msaki",
      "Lloyiso",
      "Manana",
      "Bongeziwe Mabandla",
      "Zoë Modiga",
      "Rowlene",
      "Una Rams",
      "Tyson Sybateli",
      "Aewon Wolf",
    ],
    afrohouse: [
      "Black Coffee",
      "Mörda",
      "Babalwa M",
      "Caiiro",
      "Enoo Napa",
      "Da Capo",
      "Jullian Gomes",
      "Hyenah",
      "Atjazz",
      "Fka Mash",
      "Citizen Deep",
      "Dwson",
      "Kususa",
      "Zakes Bantwini",
      "Sun-El Musician",
    ],
    classic: [
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
      "Sipho Hotstix Mabuse",
    ],
    pop: [
      "Tyla",
      "Master KG",
      "Nomcebo Zikode",
      "Sjava",
      "Emtee",
      "Kamo Mphela",
      "Pabi Cooper",
      "Nkosazana Daughter",
      "TOSS",
      "Young Stunna",
      "Semi Tee",
      "Miano",
      "Kammu Dee",
    ],
  };

  // Genre-specific search queries
  const genreQueries = {
    amapiano: ["amapiano", "piano", "log drum", "villa"],
    hiphop: ["hip hop", "rap", "drill", "trap"],
    rnb: ["r&b", "soul", "neo soul", "alternative r&b"],
    afrohouse: ["afro house", "deep house", "soulful house", "tribal house"],
    pop: ["pop", "afropop", "dance pop"],
    classic: ["classic", "traditional", "mbaqanga", "maskandi"],
  };

  // === GSAP ANIMATIONS ===
  function initializeAnimations() {
    // Animation 1: Page load animation
    gsap.fromTo(
      ".page-title",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    gsap.fromTo(
      ".music-tabs .tab",
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.3,
        ease: "back.out(1.7)",
      }
    );

    // Animate footer
    gsap.fromTo(
      ".site-footer",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.5,
        scrollTrigger: {
          trigger: ".site-footer",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }

  // Animation 2: Staggered card animation
  function animateMusicCards(container) {
    const cards = container.querySelectorAll(".music-card");

    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 30,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        onComplete: function () {
          // Add hover animations after initial load
          cards.forEach((card) => {
            card.addEventListener("mouseenter", () => {
              gsap.to(card, {
                scale: 1.02,
                y: -5,
                duration: 0.3,
                ease: "power2.out",
              });
            });

            card.addEventListener("mouseleave", () => {
              gsap.to(card, {
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
              });
            });
          });
        },
      }
    );
  }

  // Animation 3: Tab switching animation
  function animateTabSwitch(oldTab, newTab) {
    const tl = gsap.timeline();

    tl.to(oldTab, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.in",
    }).to(
      newTab,
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.1"
    );
  }

  // Animation 4: Search bar animation
  function initializeSearchAnimation() {
    const searchWrapper = document.querySelector(".search-wrapper");
    const searchIcon = document.getElementById("searchIcon");
    const searchBar = document.getElementById("searchBar");

    if (searchIcon && searchBar) {
      searchIcon.addEventListener("click", () => {
        searchWrapper.classList.toggle("active");

        if (searchWrapper.classList.contains("active")) {
          gsap.fromTo(
            searchBar,
            { scaleX: 0, opacity: 0, width: 0 },
            {
              scaleX: 1,
              opacity: 1,
              width: 200,
              duration: 0.4,
              ease: "back.out(1.7)",
            }
          );
          searchBar.focus();
        } else {
          gsap.to(searchBar, {
            scaleX: 0,
            opacity: 0,
            width: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              searchBar.style.display = "none";
            },
          });
        }
      });

      // Close search when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !searchWrapper.contains(e.target) &&
          searchWrapper.classList.contains("active")
        ) {
          searchWrapper.classList.remove("active");
          gsap.to(searchBar, {
            scaleX: 0,
            opacity: 0,
            width: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              searchBar.style.display = "none";
            },
          });
        }
      });
    }
  }

  // Animation 5: Loading states animation
  function animateLoadingState(container) {
    const loadingElement = container.querySelector(".loading");
    if (loadingElement) {
      gsap.fromTo(
        loadingElement,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }

  // === INITIAL SETUP ===
  sections.forEach((s, i) => {
    s.style.display = i === 0 ? "block" : "none";
  });

  // Initialize animations
  initializeAnimations();
  initializeSearchAnimation();

  // Load initial content
  fetchNewReleases();
  startAllTimers();

  // === REFRESH SYSTEM ===
  function startAllTimers() {
    console.log("Starting refresh timers...");
    stopAllTimers();

    Object.keys(REFRESH_TIMES).forEach((type) => {
      startTimer(type, () => {
        if (isTabActive(type)) {
          console.log(`Auto-refreshing ${type} content...`);
          loadContentForTab(type);
        }
      });
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

  // === TAB SWITCHING ===
  tabs.forEach((tab) => {
    tab.addEventListener("click", async () => {
      const target = tab.dataset.tab;
      const oldActiveSection = document.querySelector(".music-grid.active");
      const newActiveSection = document.getElementById(target);

      // Animation: Tab switch
      if (
        oldActiveSection &&
        newActiveSection &&
        oldActiveSection !== newActiveSection
      ) {
        animateTabSwitch(oldActiveSection, newActiveSection);
      }

      // Update active tab
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Show/hide sections
      sections.forEach((sec) => {
        sec.classList.toggle("active", sec.id === target);
        sec.style.display = sec.id === target ? "block" : "none";
      });

      // Load content if needed
      if (!loadedTabs.has(target) || needsRefresh(target)) {
        await loadContentForTab(target);
        loadedTabs.add(target);
      }
    });
  });

  // === CONTENT LOADING BY TAB ===
  async function loadContentForTab(tabName) {
    switch (tabName) {
      case "new":
        await fetchNewReleases();
        break;
      case "classics":
        await fetchSAClassics();
        break;
      case "videos":
        await fetchYouTubeVideos();
        break;
      case "amapiano":
        await fetchGenreMusic("amapiano");
        break;
      case "hiphop":
        await fetchGenreMusic("hiphop");
        break;
      case "rnb":
        await fetchGenreMusic("rnb");
        break;
      case "afrohouse":
        await fetchGenreMusic("afrohouse");
        break;
    }
  }

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

  // === NEW RELEASES (Mixed genres) ===
  async function fetchNewReleases() {
    const container = document.getElementById("newContainer");
    if (!container) return;

    container.innerHTML =
      '<div class="loading refreshing">Loading new South African releases...</div>';

    // Animate loading state
    animateLoadingState(container);

    try {
      const token = await getSpotifyToken();

      // Fetch new releases from South Africa
      const response = await fetch(
        "https://api.spotify.com/v1/browse/new-releases?country=ZA&limit=50",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Spotify API failed");

      const data = await response.json();

      // Filter for South African artists across all genres
      const saAlbums =
        data.albums?.items?.filter((album) => isSouthAfricanMusic(album)) || [];

      // If not enough, supplement with genre-specific searches
      let finalAlbums = saAlbums.slice(0, 12);
      if (finalAlbums.length < 12) {
        const supplemental = await searchMultipleGenres(
          token,
          ["amapiano", "hiphop", "rnb"],
          4
        );
        finalAlbums = [...finalAlbums, ...supplemental]
          .filter(
            (album, index, self) =>
              index === self.findIndex((a) => a.id === album.id)
          )
          .slice(0, 12);
      }

      cache.new = { albums: { items: finalAlbums } };
      lastRefresh.new = Date.now();
      renderSpotifyData(
        container,
        { albums: { items: finalAlbums } },
        "New Release"
      );
    } catch (error) {
      console.error("New Releases Error:", error);
      handleError(container, "new", "South African new releases");
    }
  }

  // === GENRE-SPECIFIC MUSIC ===
  async function fetchGenreMusic(genre) {
    const container = document.getElementById(`${genre}Container`);
    if (!container) return;

    container.innerHTML = `<div class="loading refreshing">Loading ${genre} music...</div>`;

    // Animate loading state
    animateLoadingState(container);

    try {
      const token = await getSpotifyToken();
      const albums = [];

      // Search by genre keywords
      const queries = genreQueries[genre] || [genre];
      for (const query of queries) {
        try {
          const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(
              query
            )}%20genre:%22${genre}%22&type=album&limit=10`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.albums?.items) {
              // Filter for South African artists in this genre
              const genreAlbums = data.albums.items.filter(
                (album) =>
                  isSouthAfricanMusic(album) && isGenreMatch(album, genre)
              );
              albums.push(...genreAlbums);
            }
          }
        } catch (e) {
          console.log(`Search failed for ${query}`, e);
        }
      }

      // If not enough, search specific artists for this genre
      if (albums.length < 9) {
        const artistAlbums = await searchArtistsByGenre(
          token,
          genre,
          12 - albums.length
        );
        albums.push(...artistAlbums);
      }

      cache[genre] = { albums: albums.slice(0, 12) };
      lastRefresh[genre] = Date.now();
      renderSpotifyData(
        container,
        { albums: { items: albums.slice(0, 12) } },
        genre.toUpperCase()
      );
    } catch (error) {
      console.error(`${genre} Error:`, error);
      handleError(container, genre, `${genre} music`);
    }
  }

  // Search specific artists for a genre
  async function searchArtistsByGenre(token, genre, limit) {
    const albums = [];
    const artists = southAfricanArtists[genre] || [];

    for (const artist of artists.slice(0, 6)) {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=artist:${encodeURIComponent(
            artist
          )}&type=album&limit=3`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.albums?.items) {
            const recentAlbums = data.albums.items.filter((album) =>
              isWithinLastYear(album.release_date)
            );
            albums.push(...recentAlbums);
          }
        }
      } catch (e) {
        console.log(`Artist search failed for ${artist}`, e);
      }

      if (albums.length >= limit) break;
    }

    return albums;
  }

  // Search multiple genres for supplemental content
  async function searchMultipleGenres(token, genres, perGenre) {
    const allAlbums = [];

    for (const genre of genres) {
      try {
        const albums = await searchArtistsByGenre(token, genre, perGenre);
        allAlbums.push(...albums);
      } catch (e) {
        console.log(`Genre search failed for ${genre}`, e);
      }
    }

    return allAlbums;
  }

  // === CLASSICS ===
  async function fetchSAClassics() {
    const container = document.getElementById("classicsContainer");
    if (!container) return;

    container.innerHTML =
      '<div class="loading refreshing">Loading South African classics...</div>';

    // Animate loading state
    animateLoadingState(container);

    try {
      const token = await getSpotifyToken();
      const albums = [];

      // Search for classic artists
      for (const artist of southAfricanArtists.classic.slice(0, 8)) {
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

        if (albums.length >= 12) break;
      }

      cache.classics = { albums: albums.slice(0, 12) };
      lastRefresh.classics = Date.now();
      renderSpotifyData(
        container,
        { albums: { items: albums.slice(0, 12) } },
        "CLASSIC"
      );
    } catch (error) {
      console.error("Classics Error:", error);
      handleError(container, "classics", "classic music");
    }
  }

  // === VIDEOS ===
  async function fetchYouTubeVideos() {
    const container = document.getElementById("videosContainer");
    if (!container) return;

    container.innerHTML =
      '<div class="loading refreshing">Loading South African music videos...</div>';

    // Animate loading state
    animateLoadingState(container);

    try {
      // Different search queries for variety
      const queries = [
        "south african amapiano 2024",
        "south african hip hop 2024",
        "south african music videos",
        "afrohouse south africa",
      ];

      const randomQuery = queries[Math.floor(Math.random() * queries.length)];

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          randomQuery
        )}&type=video&maxResults=12&key=${YOUTUBE_API_KEY}`
      );

      if (!response.ok) throw new Error("YouTube API failed");

      const data = await response.json();
      cache.videos = data;
      lastRefresh.videos = Date.now();
      renderYouTubeData(container, data);
    } catch (error) {
      console.error("YouTube Error:", error);
      handleError(container, "videos", "music videos");
    }
  }

  // === FILTERING AND HELPER FUNCTIONS ===
  function isSouthAfricanMusic(album) {
    if (!album || !album.artists) return false;

    const artistNames = album.artists.map((artist) =>
      artist.name.toLowerCase()
    );

    // Check if any artist is South African across all genres
    const hasSAArist = Object.values(southAfricanArtists)
      .flat()
      .some((artist) =>
        artistNames.some(
          (name) =>
            name.includes(artist.toLowerCase()) ||
            artist.toLowerCase().includes(name)
        )
      );

    return hasSAArist && isWithinLastYear(album.release_date);
  }

  function isGenreMatch(album, genre) {
    const albumName = album.name.toLowerCase();
    const artistNames = album.artists.map((artist) =>
      artist.name.toLowerCase()
    );

    // Check genre keywords
    const genreKeywords = genreQueries[genre] || [genre];
    const hasGenreKeyword = genreKeywords.some((keyword) =>
      albumName.includes(keyword.toLowerCase())
    );

    // Check if artists belong to this genre
    const genreArtists = southAfricanArtists[genre] || [];
    const hasGenreArtist = genreArtists.some((artist) =>
      artistNames.some(
        (name) =>
          name.includes(artist.toLowerCase()) ||
          artist.toLowerCase().includes(name)
      )
    );

    return hasGenreKeyword || hasGenreArtist;
  }

  function isWithinLastYear(releaseDate) {
    if (!releaseDate) return false;
    const release = new Date(releaseDate);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return release >= oneYearAgo;
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

  // === RENDER FUNCTIONS ===
  function renderSpotifyData(container, data, badgeText = "NEW") {
    if (!data.albums?.items?.length) {
      container.innerHTML = `
        <div class="error">
          <p>No music found</p>
          <button onclick="fetchNewReleases()" class="retry-btn">Try Again</button>
        </div>
      `;
      // Animate error state
      gsap.fromTo(
        container.querySelector(".error"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
      return;
    }

    container.innerHTML = data.albums.items
      .map((album) => {
        const releaseInfo = getDaysAgo(album.release_date);
        const genre = getAlbumGenre(album);

        return `
        <div class="music-card">
          <div class="album-art-container">
            <img src="${
              album.images[0]?.url || "https://via.placeholder.com/300"
            }" 
                 alt="${album.name}" class="album-art" />
            <div class="badge-container">
              <span class="sa-badge">SA</span>
              <span class="genre-badge">${badgeText}</span>
            </div>
          </div>
          <div class="info">
            <div class="genre">${genre}</div>
            <h3 class="song-title">${escapeHtml(album.name)}</h3>
            <p class="artist">${escapeHtml(
              album.artists.map((a) => a.name).join(", ")
            )}</p>
            <p class="date">Released ${releaseInfo}</p>
            <a href="${
              album.external_urls.spotify
            }" target="_blank" class="spotify-btn">
              <i class="fab fa-spotify"></i>
              Listen on Spotify
            </a>
          </div>
        </div>
      `;
      })
      .join("");

    // Animate the new cards
    animateMusicCards(container);
  }

  function renderYouTubeData(container, data) {
    if (!data.items?.length) {
      container.innerHTML = '<div class="error">No videos found</div>';
      // Animate error state
      gsap.fromTo(
        container.querySelector(".error"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
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
        <div class="info">
          <div class="genre">VIDEO</div>
          <h3 class="song-title">${escapeHtml(video.snippet.title)}</h3>
          <p class="artist">${escapeHtml(video.snippet.channelTitle)}</p>
          <a href="https://www.youtube.com/watch?v=${video.id.videoId}" 
             target="_blank" class="youtube-btn">
            <i class="fab fa-youtube"></i>
            Watch on YouTube
          </a>
        </div>
      </div>
    `
      )
      .join("");

    // Animate the new cards
    animateMusicCards(container);
  }

  function getAlbumGenre(album) {
    const albumName = album.name.toLowerCase();
    const artistNames = album.artists
      .map((artist) => artist.name.toLowerCase())
      .join(" ");

    if (albumName.includes("amapiano") || artistNames.includes("amapiano"))
      return "AMAPIANO";
    if (
      albumName.includes("hip") ||
      albumName.includes("rap") ||
      artistNames.includes("hip") ||
      artistNames.includes("rap")
    )
      return "HIP-HOP";
    if (
      albumName.includes("r&b") ||
      albumName.includes("rb") ||
      albumName.includes("soul")
    )
      return "R&B";
    if (albumName.includes("house") || artistNames.includes("house"))
      return "AFROHOUSE";
    if (albumName.includes("pop")) return "POP";
    return "MUSIC";
  }

  function handleError(container, type, contentName) {
    container.innerHTML = `
      <div class="error">
        <p>Failed to load ${contentName}</p>
        <button onclick="loadContentForTab('${type}')" class="retry-btn">Try Again</button>
        ${
          cache[type]
            ? `<button onclick="useCachedData('${type}')" class="cache-btn">Use Last Data</button>`
            : ""
        }
      </div>
    `;

    // Animate error state
    gsap.fromTo(
      container.querySelector(".error"),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 }
    );
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
    const containerMap = {
      new: "newContainer",
      classics: "classicsContainer",
      videos: "videosContainer",
      amapiano: "amapianoContainer",
      hiphop: "hiphopContainer",
      rnb: "rnbContainer",
      afrohouse: "afrohouseContainer",
    };

    const container = document.getElementById(containerMap[type]);
    if (!container || !cache[type]) return;

    const renderers = {
      new: (c, d) => renderSpotifyData(c, d, "New Release"),
      amapiano: (c, d) => renderSpotifyData(c, d, "AMAPIANO"),
      hiphop: (c, d) => renderSpotifyData(c, d, "HIP-HOP"),
      rnb: (c, d) => renderSpotifyData(c, d, "R&B"),
      afrohouse: (c, d) => renderSpotifyData(c, d, "AFROHOUSE"),
      classics: (c, d) => renderSpotifyData(c, d, "CLASSIC"),
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
  window.fetchNewReleases = fetchNewReleases;
  window.fetchSAClassics = fetchSAClassics;
  window.fetchYouTubeVideos = fetchYouTubeVideos;
  window.fetchGenreMusic = fetchGenreMusic;
  window.loadContentForTab = loadContentForTab;
  window.useCachedData = useCachedData;
});
