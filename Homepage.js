document.addEventListener("DOMContentLoaded", () => {
  const latestSection = document.querySelector(".latest-side-list");
  const eventsList = document.getElementById("eventsList");
  const releasesGrid = document.getElementById("spotifyReleases");
  const tickerContainer = document.getElementById("newsTicker");
  const lastUpdated = document.getElementById("lastUpdated");

  // === API KEYS ===
  const NEWS_API_KEY = "4bda1a0c084d4ef69c6552beeb40289d";
  const EVENTBRITE_TOKEN = "CEIU5D6SI7LJHYQXQIMZ";
  const SPOTIFY_CLIENT_ID = "61fb26a49a5c413c9a52aea3a25eda32";
  const SPOTIFY_CLIENT_SECRET = "2d33c647e7a645328c8011a0f190d501";

  const NEWS_URL = `https://newsapi.org/v2/everything?q=South+African+music&language=en&sortBy=publishedAt&pageSize=6&apiKey=${NEWS_API_KEY}`;
  const EVENTS_URL = `https://www.eventbriteapi.com/v3/events/search/?q=music&location.address=south+africa&expand=venue&sort_by=date&token=${EVENTBRITE_TOKEN}`;

  // --- Utility Functions ---
  function showLoading(container, count = 3) {
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const placeholder = document.createElement("div");
      placeholder.classList.add("side-article", "loading");
      placeholder.innerHTML = `         <div class="loading-thumb"></div>         <div class="loading-text">           <div class="loading-line short"></div>           <div class="loading-line long"></div>         </div>`;
      container.appendChild(placeholder);
    }
  }

  function showError(container, message) {
    container.innerHTML = `<p class="error-message">${message}</p>`;
  }

  function updateTimestamp() {
    if (lastUpdated) {
      const now = new Date();
      lastUpdated.textContent = `Last updated: ${now.toLocaleString("en-ZA")}`;
    }
  }

  // --- Load South African Music News ---
  async function loadNews() {
    if (!latestSection) return;
    showLoading(latestSection, 5);
    try {
      const res = await fetch(NEWS_URL);
      const data = await res.json();
      if (!data.articles?.length) {
        showError(
          latestSection,
          "No recent South African music news available."
        );
        return;
      }
      latestSection.innerHTML = "";
      data.articles.slice(0, 5).forEach((article) => {
        const div = document.createElement("article");
        div.classList.add("side-article");
        div.innerHTML = `           <img src="${
          article.urlToImage || "images/default.jpg"
        }" alt="${article.title}">           <div>             <h4>${
          article.title
        }</h4>             <p>${
          article.description ? article.description.slice(0, 100) + "..." : ""
        }</p>           </div>`;
        div.addEventListener("click", () => window.open(article.url, "_blank"));
        latestSection.appendChild(div);
      });
      // Update news ticker
      if (tickerContainer) {
        tickerContainer.innerHTML = "";
        data.articles.forEach((article) => {
          const span = document.createElement("span");
          span.classList.add("ticker-item");
          span.textContent = article.title;
          span.addEventListener("click", () =>
            window.open(article.url, "_blank")
          );
          tickerContainer.appendChild(span);
        });
      }
      updateTimestamp();
    } catch (err) {
      console.error("News error:", err);
      showError(latestSection, "Unable to load news at the moment.");
    }
  }

  // --- Load Upcoming South African Music Events ---
  async function loadEvents() {
    if (!eventsList) return;
    showLoading(eventsList, 3);
    try {
      const res = await fetch(EVENTS_URL);
      const data = await res.json();
      if (!data.events?.length) {
        showError(
          eventsList,
          "No upcoming music events found in South Africa."
        );
        return;
      }
      eventsList.innerHTML = "";
      data.events.slice(0, 5).forEach((event) => {
        const city = event.venue?.address?.city || "TBA";
        const date = new Date(event.start.local).toLocaleDateString("en-ZA", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        const div = document.createElement("article");
        div.classList.add("side-article");
        div.innerHTML = `           <div>             <h4>${event.name.text}</h4>             <p>${date} – ${city}</p>           </div>`;
        div.addEventListener("click", () => window.open(event.url, "_blank"));
        eventsList.appendChild(div);
      });
    } catch (err) {
      console.error("Event error:", err);
      showError(eventsList, "Unable to load events right now.");
    }
  }

  // --- Load Dynamic Spotify South African Releases ---
  async function loadSpotifyReleasesDynamic() {
    if (!releasesGrid) return;
    showLoading(releasesGrid, 6);

    try {
      const tokenResponse = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET),
          },
          body: "grant_type=client_credentials",
        }
      );
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
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${genreQuery}&type=album&market=ZA&limit=6`,
          { headers: { Authorization: "Bearer " + accessToken } }
        );
        const data = await response.json();
        return data.albums?.items || [];
      }

      async function updateReleases() {
        showLoading(releasesGrid, 6);
        const genre = saGenres[currentGenreIndex];
        const albums = await fetchGenreReleases(genre);

        releasesGrid.innerHTML = "";
        if (!albums.length) {
          showError(releasesGrid, `No new releases for ${genre} right now.`);
        } else {
          albums.forEach((album) => {
            const div = document.createElement("div");
            div.classList.add("release-card");
            div.innerHTML = `
          <img src="${album.images[0]?.url || "images/default.jpg"}" alt="${
              album.name
            }">
          <div class="release-info">
            <h4>${album.name}</h4>
            <p>${album.artists.map((a) => a.name).join(", ")}</p>
          </div>`;
            div.addEventListener("click", () =>
              window.open(album.external_urls.spotify, "_blank")
            );
            releasesGrid.appendChild(div);
          });
        }

        currentGenreIndex = (currentGenreIndex + 1) % saGenres.length;
      }

      await updateReleases();
      setInterval(updateReleases, 10000); // rotate every 10 seconds
    } catch (err) {
      console.error("Spotify error:", err);
      showError(releasesGrid, "Unable to load Spotify releases right now.");
    }
  }

  // --- Initialize all sections ---
  loadNews();
  loadEvents();
  loadSpotifyReleasesDynamic();
  console.log(
    "South African Music Homepage with ticker initialized successfully."
  );
});
