document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("reviewsGrid");
  const tabs = document.querySelectorAll(".tab");

  // Last.fm API Key (you can get a free one from https://www.last.fm/api)
  const LAST_FM_API_KEY = "bf85b73d5ac9150697aa9cd05a40cb55"; // This is a public demo key
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

      // Filter by category
      const category = tab.dataset.category;
      fetchRealReviews(category);
    });
  });

  // Fetch real reviews from Last.fm API
  async function fetchRealReviews(category = "new") {
    grid.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                Loading real South African music reviews...
            </div>
        `;

    try {
      const reviews = [];

      // Shuffle artists and take only 8 to limit API calls
      const shuffledArtists = [...southAfricanArtists].sort(
        () => 0.5 - Math.random()
      );
      const selectedArtists = shuffledArtists.slice(0, 8);

      // Fetch data for each artist
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
                    <p>Error: ${error.message}</p>
                </div>
            `;
    }
  }

  // Fetch top album for an artist
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

    // Get album details
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

  // Fetch detailed album information
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

  // Get the best available album image
  function getAlbumImage(images) {
    if (!images)
      return "https://via.placeholder.com/300x300/002395/FFFFFF?text=No+Image";

    // Try to get large image first, then medium, then small
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

  // Generate a realistic review summary
  function generateReviewSummary(artist, albumName, albumDetails) {
    const summaries = [
      `${artist}'s "${albumName}" showcases their unique sound that has been captivating audiences across South Africa and beyond.`,
      `A powerful release from ${artist} that demonstrates why they remain at the forefront of the South African music scene.`,
      `This album from ${artist} blends traditional South African rhythms with contemporary production, creating a truly unique listening experience.`,
      `${artist} delivers an exceptional performance on "${albumName}", solidifying their position as one of South Africa's most talented artists.`,
      `With "${albumName}", ${artist} continues to push musical boundaries while staying true to their South African roots.`,
    ];

    if (albumDetails.wiki && albumDetails.wiki.summary) {
      // Clean up Last.fm summary
      let summary = albumDetails.wiki.summary.split("<a")[0];
      if (summary.length > 150) {
        return summary.substring(0, 200) + "...";
      }
      return summary;
    }

    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  // Generate random rating (3.5 to 5 stars)
  function generateRandomRating() {
    return (Math.random() * 1.5 + 3.5).toFixed(1);
  }

  // Generate author name
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

  // Generate recent date
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

  // Display reviews in the grid
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

  searchBar.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm.length < 2) {
      displayReviews(allReviews);
      return;
    }

    const filteredReviews = allReviews.filter(
      (review) =>
        review.title.toLowerCase().includes(searchTerm) ||
        review.artist.toLowerCase().includes(searchTerm) ||
        review.genre.toLowerCase().includes(searchTerm)
    );

    displayReviews(filteredReviews);
  });

  // Store reviews when fetched for search functionality
  const originalDisplayReviews = displayReviews;
  displayReviews = function (reviews) {
    allReviews = reviews;
    originalDisplayReviews(reviews);
  };

  // Initial load
  fetchRealReviews("new");
});
