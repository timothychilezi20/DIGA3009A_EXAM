document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".music-tabs .tab");
  const sections = document.querySelectorAll(".music-grid");

  const SPOTIFY_CLIENT_ID = "61fb26a49a5c413c9a52aea3a25eda32";
  const SPOTIFY_CLIENT_SECRET = "2d33c647e7a645328c8011a0f190d501";
  const GNEWS_API_KEY = "a5b595dc505090efa6ae086f2b1b38c6";
  const LASTFM_API_KEY = "f7186a5e4ac16660e7fcc4b6779792c7";
  const YOUTUBE_API_KEY = "AIzaSyCNiJRNnYjNZvb4kAu_U5uhELzkTWscOTQ";

  // === INITIAL DISPLAY ===
  sections.forEach((s, i) => (s.style.display = i === 0 ? "grid" : "none"));

  // === TAB SWITCHING WITH ANIMATION + API LAZY LOAD ===
  tabs.forEach((tab) => {
    tab.addEventListener("click", async () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      sections.forEach((sec) => {
        if (sec.id === target) {
          sec.style.display = "grid";
          gsap.fromTo(
            sec,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.5 }
          );
        } else {
          gsap.to(sec, {
            autoAlpha: 0,
            y: 20,
            duration: 0.3,
            onComplete: () => (sec.style.display = "none"),
          });
        }
      });

      // Lazy load API content
      if (target === "new") await fetchSpotifyNewReleases();
      if (target === "reviews") await fetchGNewsArticles();
      if (target === "classics") await fetchLastFMClassics();
      if (target === "videos") await fetchYouTubeVideos();
    });
  });

  // === API FUNCTIONS ===
  async function fetchSpotifyNewReleases() {
    const container = document.getElementById("spotifyContainer");
    if (!container) return;

    try {
      const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET),
        },
        body: "grant_type=client_credentials",
      });
      const token = (await tokenRes.json()).access_token;

      const res = await fetch(
        "https://api.spotify.com/v1/browse/new-releases?country=ZA&limit=8",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();

      container.innerHTML = data.albums.items
        .map(
          (a) => `<div class="card">
          <img src="${a.images[0].url}" alt="${a.name}" />
          <h3>${a.name}</h3>
          <p>${a.artists.map((ar) => ar.name).join(", ")}</p>
          <a href="${
            a.external_urls.spotify
          }" target="_blank">Listen on Spotify</a>
        </div>`
        )
        .join("");
    } catch (e) {
      console.error("Spotify API Error:", e);
      container.innerHTML = "<p>Unable to load Spotify releases.</p>";
    }
  }

  async function fetchGNewsArticles() {
    const container = document.getElementById("newsContainer");
    if (!container) return;

    try {
      const res = await fetch(
        `https://gnews.io/api/v4/search?q=music%20south%20africa&lang=en&country=za&max=6&apikey=${GNEWS_API_KEY}`
      );
      const data = await res.json();

      container.innerHTML = data.articles
        .map(
          (a) => `<div class="card">
          <img src="${a.image || "default.jpg"}" alt="${a.title}" />
          <h3>${a.title}</h3>
          <p>${a.description || ""}</p>
          <a href="${a.url}" target="_blank">Read more</a>
        </div>`
        )
        .join("");
    } catch (e) {
      console.error("GNews API Error:", e);
      container.innerHTML = "<p>Unable to load news articles.</p>";
    }
  }

  async function fetchLastFMClassics() {
    const container = document.getElementById("lastfmContainer");
    if (!container) return;

    try {
      const res = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=south+africa&api_key=${LASTFM_API_KEY}&format=json`
      );
      const data = await res.json();

      container.innerHTML = data.tracks.track
        .slice(0, 8)
        .map(
          (t) => `<div class="card">
          <h3>${t.name}</h3>
          <p>${t.artist.name}</p>
          <a href="${t.url}" target="_blank">Listen</a>
        </div>`
        )
        .join("");
    } catch (e) {
      console.error("Last.fm API Error:", e);
      container.innerHTML = "<p>Unable to load classic tracks.</p>";
    }
  }

  async function fetchYouTubeVideos() {
    const container = document.getElementById("youtubeContainer");
    if (!container) return;

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=south+african+music&type=video&maxResults=6&key=${YOUTUBE_API_KEY}`
      );
      const data = await res.json();

      container.innerHTML = data.items
        .map(
          (v) => `<div class="card">
          <iframe width="100%" height="200" src="https://www.youtube.com/embed/${v.id.videoId}" frameborder="0" allowfullscreen></iframe>
          <h3>${v.snippet.title}</h3>
        </div>`
        )
        .join("");
    } catch (e) {
      console.error("YouTube API Error:", e);
      container.innerHTML = "<p>Unable to load videos.</p>";
    }
  }
});
