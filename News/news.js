document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("reviewsGrid");
  const newsContainer = document.getElementById("news-container");
  const tabs = document.querySelectorAll(".tab");

  // Last.fm API Key
  const LAST_FM_API_KEY = "bf85b73d5ac9150697aa9cd05a40cb55";
  const LAST_FM_BASE_URL = "https://ws.audioscrobbler.com/2.0/";

  // South African artists to fetch
  const southAfricanArtists = [
    "Tyla",
    "Kabza De Small",
    "Nasty C",
    "Black Coffee",
    "Sho Madjozi",
    "Master KG",
    "Mafikizolo",
    "A-Reece",
    "Sjava",
    "DJ Maphorisa",
    "Nomcebo Zikode",
    "Mlindo The Vocalist",
  ];

  // Tab switching functionality
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const category = tab.textContent.toLowerCase();

      if (category === "new") {
        displayMusicNews();
        fetchRealReviews("new");
      } else {
        fetchRealReviews(category);
        // Hide news for other tabs
        document.getElementById("news-section").style.display = "none";
        document.getElementById("reviews-section").style.display = "block";
      }
    });
  });

  // Display music news (using curated content for now)
  function displayMusicNews() {
    document.getElementById("news-section").style.display = "block";
    document.getElementById("reviews-section").style.display = "block";

    const musicNews = getCuratedMusicNews();
    renderNews(musicNews);
  }

  // Curated music news from major publications
  function getCuratedMusicNews() {
    return [
      {
        title: "Rolling Stone: The 50 Best Albums of 2024",
        description:
          "From breakthrough artists to established legends, discover the albums that defined the year in music across all genres.",
        image:
          "https://via.placeholder.com/300x180/FF0000/FFFFFF?text=Rolling+Stone+2024",
        url: "#",
        source: "Rolling Stone",
        date: "December 2024",
      },
      {
        title: "Pitchfork: Best New Music This Week",
        description:
          "This week's essential new tracks and albums including must-hear releases from emerging and established artists.",
        image:
          "https://via.placeholder.com/300x180/000000/FFFFFF?text=Pitchfork+Weekly",
        url: "#",
        source: "Pitchfork",
        date: "This Week",
      },
      {
        title: "Billboard: Chart-Topping Releases",
        description:
          "Latest updates from the Billboard charts with new entries breaking into the Top 100 and surprising chart movements.",
        image:
          "https://via.placeholder.com/300x180/0000FF/FFFFFF?text=Billboard+Charts",
        url: "#",
        source: "Billboard",
        date: "Latest",
      },
      {
        title: "NME: Festival Season Lineup Reveals",
        description:
          "Complete guide to summer music festivals with major lineup announcements and exclusive artist interviews.",
        image:
          "https://via.placeholder.com/300x180/FF00FF/FFFFFF?text=NME+Festivals",
        url: "#",
        source: "NME",
        date: "March 2024",
      },
      {
        title: "Spin: Artist of the Month Feature",
        description:
          "Exclusive deep dive into the most exciting new artist making waves in the music industry right now.",
        image:
          "https://via.placeholder.com/300x180/FFFF00/000000?text=Spin+Artist",
        url: "#",
        source: "Spin",
        date: "March 2024",
      },
      {
        title: "Consequence: Music Industry Analysis",
        description:
          "In-depth look at streaming trends, label moves, and the business behind today's biggest hits.",
        image:
          "https://via.placeholder.com/300x180/00FF00/FFFFFF?text=Music+Business",
        url: "#",
        source: "Consequence",
        date: "Recent",
      },
    ];
  }

  // Render news articles
  function renderNews(articles) {
    newsContainer.innerHTML = "";

    articles.forEach((article) => {
      const newsCard = document.createElement("article");
      newsCard.classList.add("news-card");

      newsCard.innerHTML = `
        <img src="${article.image}" 
             alt="${article.title}" 
             onerror="this.src='https://via.placeholder.com/300x180/002395/FFFFFF?text=Music+News'">
        <div class="news-card-content">
          <h3>${article.title}</h3>
          <p>${article.description}</p>
          <a href="${article.url}" target="_blank" rel="noopener">Read on ${article.source}</a>
          <div class="news-source">Source: ${article.source}</div>
          <div class="news-date">${article.date}</div>
        </div>
      `;

      newsContainer.appendChild(newsCard);
    });
  }

  // Your existing review functions
  async function fetchRealReviews(category = "new") {
    grid.innerHTML = `
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        Loading real South African music reviews...
      </div>
    `;

    try {
      const reviews = [];
      const shuffledArtists = [...southAfricanArtists].sort(
        () => 0.5 - Math.random()
      );
      const selectedArtists = shuffledArtists.slice(0, 8);

      for (const artist of selectedArtists) {
        try {
          const albumData = await fetchTopAlbum(artist);
          if (albumData) {
            reviews.push(albumData);
          }
        } catch (error) {
          console.error(`Error fetching data for ${artist}:`, error);
        }
      }

      displayReviews(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      grid.innerHTML = `
        <div class="error">
          <i class="fas fa-exclamation-circle"></i>
          <p>Unable to load reviews. Please try again later.</p>
        </div>
      `;
    }
  }

  async function fetchTopAlbum(artist) {
    const url = `${LAST_FM_BASE_URL}?method=artist.gettopalbums&artist=${encodeURIComponent(
      artist
    )}&api_key=${LAST_FM_API_KEY}&format=json&limit=1`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (
      !data.topalbums ||
      !data.topalbums.album ||
      data.topalbums.album.length === 0
    ) {
      return null;
    }

    const album = data.topalbums.album[0];
    const albumDetails = await fetchAlbumInfo(artist, album.name);

    return {
      id: album.mbid || `album-${Date.now()}-${Math.random()}`,
      title: album.name,
      artist: artist,
      genre: albumDetails.tags?.[0]?.name || "South African Music",
      cover: getAlbumImage(album.image),
      summary: generateReviewSummary(artist, album.name, albumDetails),
      rating: generateRandomRating(),
      author: generateAuthorName(),
      date: generateRecentDate(),
      playcount: parseInt(album.playcount) || 0,
    };
  }

  async function fetchAlbumInfo(artist, album) {
    try {
      const url = `${LAST_FM_BASE_URL}?method=album.getinfo&artist=${encodeURIComponent(
        artist
      )}&album=${encodeURIComponent(
        album
      )}&api_key=${LAST_FM_API_KEY}&format=json`;

      const response = await fetch(url);
      if (!response.ok) return {};

      const data = await response.json();
      return data.album || {};
    } catch (error) {
      console.error("Error fetching album info:", error);
      return {};
    }
  }

  function getAlbumImage(images) {
    if (!images)
      return "https://via.placeholder.com/300x300/002395/FFFFFF?text=No+Image";

    const largeImage = images.find((img) => img.size === "large")?.["#text"];
    const mediumImage = images.find((img) => img.size === "medium")?.["#text"];
    const smallImage = images.find((img) => img.size === "small")?.["#text"];

    return (
      largeImage ||
      mediumImage ||
      smallImage ||
      "https://via.placeholder.com/300x300/002395/FFFFFF?text=No+Image"
    );
  }

  function generateReviewSummary(artist, albumName, albumDetails) {
    const summaries = [
      `${artist}'s "${albumName}" showcases their unique sound that has been captivating audiences.`,
      `A powerful release from ${artist} that demonstrates why they remain at the forefront of the music scene.`,
      `This album from ${artist} blends unique rhythms with contemporary production.`,
      `${artist} delivers an exceptional performance on "${albumName}".`,
      `With "${albumName}", ${artist} continues to push musical boundaries.`,
    ];

    if (albumDetails.wiki && albumDetails.wiki.summary) {
      let summary = albumDetails.wiki.summary.split("<a")[0];
      if (summary.length > 150) {
        return summary.substring(0, 200) + "...";
      }
      return summary;
    }

    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  function generateRandomRating() {
    return (Math.random() * 1.5 + 3.5).toFixed(1);
  }

  function generateAuthorName() {
    const authors = [
      "By Sarah Johnson",
      "By David Mokoena",
      "By Lerato Moloi",
      "By James Wilson",
      "By Grace Nkosi",
      "By Thando Zwane",
      "By Precious Ngwenya",
      "By Bongani Khumalo",
    ];
    return authors[Math.floor(Math.random() * authors.length)];
  }

  function generateRecentDate() {
    const dates = [
      "March 15, 2024",
      "February 28, 2024",
      "January 10, 2024",
      "December 5, 2023",
      "November 20, 2023",
      "October 15, 2023",
    ];
    return dates[Math.floor(Math.random() * dates.length)];
  }

  function displayReviews(reviews) {
    grid.innerHTML = "";

    if (reviews.length === 0) {
      grid.innerHTML = `
        <div class="error">
          <i class="fas fa-exclamation-circle"></i>
          <p>No reviews found for this category.</p>
        </div>
      `;
      return;
    }

    reviews.forEach((review) => {
      const stars = generateStars(review.rating);

      const card = document.createElement("article");
      card.classList.add("review-card");
      card.innerHTML = `
        <img src="${review.cover}" alt="${
        review.title
      }" class="album-cover" onerror="this.src='https://via.placeholder.com/300x300/002395/FFFFFF?text=No+Image'">
        <div class="review-card-content">
          <p class="genre">${review.genre.toUpperCase()}</p>
          <h3>${review.title}</h3>
          <p class="artist">${review.artist}</p>
          <div class="rating">
            ${stars}
            <span style="margin-left: 8px; font-size: 0.8rem; color: #666;">${
              review.rating
            }/5</span>
          </div>
          <p class="review-summary">${review.summary}</p>
          <p class="author">${review.author}</p>
          <p class="date">${review.date}</p>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  function generateStars(rating) {
    let stars = "";
    const numericRating = parseFloat(rating);
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star star"></i>';
    }

    if (hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt star"></i>';
    }

    const emptyStars = 5 - Math.ceil(numericRating);
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star star"></i>';
    }

    return stars;
  }

  // Search functionality
  const searchBar = document.getElementById("searchBar");
  let allReviews = [];
  let allNews = [];

  searchBar.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm.length < 2) {
      displayReviews(allReviews);
      if (
        document.querySelector(".tab.active").textContent.toLowerCase() ===
        "new"
      ) {
        renderNews(allNews);
      }
      return;
    }

    const filteredReviews = allReviews.filter(
      (review) =>
        review.title.toLowerCase().includes(searchTerm) ||
        review.artist.toLowerCase().includes(searchTerm) ||
        review.genre.toLowerCase().includes(searchTerm)
    );

    if (
      document.querySelector(".tab.active").textContent.toLowerCase() === "new"
    ) {
      const filteredNews = allNews.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm) ||
          article.description.toLowerCase().includes(searchTerm)
      );
      renderNews(filteredNews);
    }

    displayReviews(filteredReviews);
  });

  // Store data for search functionality
  const originalDisplayReviews = displayReviews;
  displayReviews = function (reviews) {
    allReviews = reviews;
    originalDisplayReviews(reviews);
  };

  // Store news data
  allNews = getCuratedMusicNews();

  // Initial load
  displayMusicNews();
  fetchRealReviews("new");
});
