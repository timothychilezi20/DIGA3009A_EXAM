document.addEventListener("DOMContentLoaded", () => {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  const grid = document.getElementById("reviewsGrid");
  const tabs = document.querySelectorAll(".tab");

  const LAST_FM_API_KEY = "bf85b73d5ac9150697aa9cd05a40cb55";
  const LAST_FM_BASE_URL = "https://ws.audioscrobbler.com/2.0/";

  // Massive artist database (100+ artists)
  const southAfricanArtists = {
    modern: [
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
      "Kamo Mphela",
      "Focalistic",
      "Blxckie",
      "Lady Du",
      "Major League Djz",
      "DBN Gogo",
      "Busta 929",
      "Mr JazziQ",
      "Reece Madlisa",
      "Zuma",
      "Tyler ICU",
      "Sir Trill",
      "Bontle Smith",
      "Vusa Mkhaya",
      "Elaine",
      "Sha Sha",
      "Amanda Black",
      "Simmy",
      "Mannywellz",
      "Manana",
      "Tellaman",
      "Yanga Chief",
      "25K",
      "Riky Rick",
      "Cassper Nyovest",
      "Kwesta",
      "Emtee",
      "Nadia Nakai",
      "Anatii",
      "Big Zulu",
      "Lwah Ndlunkulu",
      "Saudi",
      "Mellow & Sleazy",
      "Tman Xpress",
      "M.J",
      "Musketeers",
      "Moscow",
      "Chley",
      "Myztro",
      "Daliwonga",
      "Mpura",
      "Soa mattrix",
    ],
    classic: [
      "Miriam Makeba",
      "Hugh Masekela",
      "Ladysmith Black Mambazo",
      "Johnny Clegg",
      "Brenda Fassie",
      "Yvonne Chaka Chaka",
      "Lucky Dube",
      "Abdullah Ibrahim",
      "The Soul Brothers",
      "Mahotella Queens",
      "Stimela",
      "Bayete",
      "Sipho Hotstix Mabuse",
      "Mango Groove",
      "Caiphus Semenya",
      "Letta Mbulu",
      "Jonas Gwangwa",
      "Vusi Mahlasela",
      "Mahlathini",
      "The Skylarks",
      "Mackay Davashe",
      "Dolly Rathebe",
      "The Movers",
      "The Beaters",
      "Juluka",
      "Savuka",
      "Margaret Singana",
      "Patricia Majalisa",
      "Rebecca Malope",
      "Ishmael",
      "Stimela",
      "Splash",
      "Chico Twala",
      "Oscar",
      "Miriam Makeba",
      "The Manhattan Brothers",
      "The Dark City Sisters",
    ],
    jazz: [
      "Abdullah Ibrahim",
      "Hugh Masekela",
      "Miriam Makeba",
      "Jonas Gwangwa",
      "Bheki Mseleku",
      "Moses Molelekwa",
      "Zim Ngqawana",
      "Tutu Puoane",
      "Kyle Shepherd",
      "Nduduzo Makhathini",
      "Shabaka Hutchings",
      "Andile Yenana",
    ],
  };

  let allReviews = [];
  let currentCategory = "new";
  let isLoading = false;

  // Cache for API responses to avoid duplicate calls
  const albumCache = new Map();

  // === GSAP ANIMATIONS ===
  function initializePageAnimations() {
    // Animation 1: Page load sequence
    const tl = gsap.timeline();

    tl.fromTo(
      ".section-title",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    ).fromTo(
      ".tabs .tab",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" },
      "-=0.3"
    );

    // Animate footer on scroll
    gsap.fromTo(
      ".site-footer",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: ".site-footer",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }

  // Animation 2: Staggered review cards animation
  function animateReviewCards() {
    const cards = grid.querySelectorAll(".music-card");

    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 40,
        scale: 0.9,
        rotationY: 5,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        onComplete: function () {
          // Add enhanced hover animations after initial load
          cards.forEach((card) => {
            card.addEventListener("mouseenter", () => {
              gsap.to(card, {
                scale: 1.03,
                y: -8,
                rotationY: 2,
                duration: 0.3,
                ease: "power2.out",
              });

              // Animate stars on hover
              const stars = card.querySelector(".stars");
              if (stars) {
                gsap.to(stars, {
                  scale: 1.1,
                  color: "#ffa726",
                  duration: 0.2,
                });
              }

              // Animate badges
              const badges = card.querySelectorAll(".sa-badge, .genre-badge");
              gsap.to(badges, {
                y: -2,
                duration: 0.2,
                stagger: 0.05,
              });
            });

            card.addEventListener("mouseleave", () => {
              gsap.to(card, {
                scale: 1,
                y: 0,
                rotationY: 0,
                duration: 0.3,
                ease: "power2.out",
              });

              const stars = card.querySelector(".stars");
              if (stars) {
                gsap.to(stars, {
                  scale: 1,
                  color: "#ffc107",
                  duration: 0.2,
                });
              }

              const badges = card.querySelectorAll(".sa-badge, .genre-badge");
              gsap.to(badges, {
                y: 0,
                duration: 0.2,
              });
            });
          });
        },
      }
    );
  }

  // Animation 3: Tab switching animation
  function initializeTabAnimations() {
    // Animate tab buttons on hover
    tabs.forEach((tab) => {
      tab.addEventListener("mouseenter", () => {
        if (!tab.classList.contains("active")) {
          gsap.to(tab, {
            scale: 1.05,
            backgroundColor: "#e9ecef",
            duration: 0.2,
            ease: "power2.out",
          });
        }
      });

      tab.addEventListener("mouseleave", () => {
        if (!tab.classList.contains("active")) {
          gsap.to(tab, {
            scale: 1,
            backgroundColor: "transparent",
            duration: 0.2,
            ease: "power2.out",
          });
        }
      });
    });
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
              width: 250,
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

  // Animation 5: Loading state animation
  function animateLoadingState() {
    const loadingElement = grid.querySelector(".loading");
    if (loadingElement) {
      gsap.fromTo(
        loadingElement,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }

  // Animation 6: Smooth tab switching
  function animateTabSwitch(oldActiveTab, newActiveTab) {
    const tl = gsap.timeline();

    tl.to(oldActiveTab, {
      scale: 0.95,
      opacity: 0.7,
      duration: 0.2,
      ease: "power2.in",
    })
      .to(newActiveTab, {
        scale: 1.1,
        opacity: 1,
        backgroundColor: "#002395",
        color: "white",
        duration: 0.3,
        ease: "back.out(1.7)",
      })
      .to(newActiveTab, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
  }

  // Animation 7: Rating stars animation
  function animateRatingStars(card, rating) {
    const stars = card.querySelector(".stars");
    if (stars) {
      gsap.fromTo(
        stars,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          delay: 0.3,
          ease: "back.out(1.7)",
        }
      );
    }
  }

  // Tab functionality
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (isLoading) return;

      const oldActiveTab = document.querySelector(".tab.active");
      const newActiveTab = tab;

      // Animate tab switch
      if (oldActiveTab !== newActiveTab) {
        animateTabSwitch(oldActiveTab, newActiveTab);
      }

      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      currentCategory = tab.dataset.category;
      filterReviewsByCategory(currentCategory);
    });
  });

  // Generate large dataset
  async function generateLargeDataset() {
    isLoading = true;
    grid.innerHTML = `
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading extensive South African music collection...</p>
        <p style="font-size: 0.9rem; margin-top: 10px;">This may take a moment as we fetch real album data</p>
      </div>
    `;

    // Animate loading state
    animateLoadingState();

    try {
      const batchPromises = [];

      // Create multiple batches for different artist groups
      const artistBatches = [
        ...southAfricanArtists.modern.slice(0, 15),
        ...southAfricanArtists.classic.slice(0, 10),
        ...southAfricanArtists.jazz.slice(0, 5),
      ];

      // Process artists in parallel batches
      for (let i = 0; i < artistBatches.length; i += 5) {
        const batch = artistBatches.slice(i, i + 5);
        batchPromises.push(processArtistBatch(batch));

        // Add small delay between batches to avoid rate limiting
        if (i + 5 < artistBatches.length) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      const batchResults = await Promise.all(batchPromises);
      const newReviews = batchResults.flat();

      // Generate additional synthetic reviews to reach target count
      const syntheticReviews = generateSyntheticReviews(50 - newReviews.length);

      allReviews = [...newReviews, ...syntheticReviews];

      filterReviewsByCategory(currentCategory);
    } catch (error) {
      console.error("Error generating dataset:", error);
      // Fallback to synthetic data if API fails
      allReviews = generateSyntheticReviews(80);
      filterReviewsByCategory(currentCategory);
    } finally {
      isLoading = false;
    }
  }

  // Process a batch of artists
  async function processArtistBatch(artists) {
    const batchReviews = [];

    for (const artist of artists) {
      try {
        const isClassic = southAfricanArtists.classic.includes(artist);
        const albums = await fetchMultipleAlbums(artist, isClassic ? 3 : 2);
        batchReviews.push(...albums);
      } catch (error) {
        console.error(`Error processing ${artist}:`, error);
        // Generate synthetic data for this artist if API fails
        const synthetic = generateSyntheticArtistReviews(artist, 2);
        batchReviews.push(...synthetic);
      }
    }

    return batchReviews;
  }

  // Fetch multiple albums for an artist
  async function fetchMultipleAlbums(artist, count = 3) {
    const cacheKey = `albums_${artist}`;
    if (albumCache.has(cacheKey)) {
      return albumCache.get(cacheKey);
    }

    const url = `${LAST_FM_BASE_URL}?method=artist.gettopalbums&artist=${encodeURIComponent(
      artist
    )}&api_key=${LAST_FM_API_KEY}&format=json&limit=${count + 2}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    if (!data.topalbums?.album?.length) {
      const synthetic = generateSyntheticArtistReviews(artist, count);
      albumCache.set(cacheKey, synthetic);
      return synthetic;
    }

    const albums = [];
    const validAlbums = data.topalbums.album
      .filter(
        (album) => album.name && !album.name.toLowerCase().includes("unknown")
      )
      .slice(0, count);

    for (const album of validAlbums) {
      try {
        const albumData = await processAlbumData(
          artist,
          album,
          southAfricanArtists.classic.includes(artist)
        );
        if (albumData) albums.push(albumData);
      } catch (error) {
        console.error(`Error processing album ${album.name}:`, error);
      }
    }

    albumCache.set(cacheKey, albums);
    return albums;
  }

  // Fetch album info from Last.fm
  async function fetchAlbumInfo(artist, albumName) {
    try {
      const url = `${LAST_FM_BASE_URL}?method=album.getinfo&artist=${encodeURIComponent(
        artist
      )}&album=${encodeURIComponent(
        albumName
      )}&api_key=${LAST_FM_API_KEY}&format=json`;

      const response = await fetch(url);
      if (!response.ok) return {};

      const data = await response.json();
      return data.album || {};
    } catch (error) {
      console.error(`Error fetching album info for ${albumName}:`, error);
      return {};
    }
  }

  // Process individual album data
  async function processAlbumData(artist, album, isClassic) {
    const albumDetails = await fetchAlbumInfo(artist, album.name);
    const releaseYear = generateReleaseYear(isClassic);

    return {
      id: `${artist}-${album.name}-${Date.now()}`,
      title: album.name,
      artist: artist,
      genre: getPrimaryGenre(albumDetails.tags) || categorizeGenre(artist),
      cover: getAlbumImage(album.image),
      summary: generateDetailedReview(
        artist,
        album.name,
        albumDetails,
        isClassic
      ),
      rating: generateWeightedRating(isClassic),
      author: generateAuthorName(),
      date: generateDate(releaseYear),
      playcount:
        parseInt(album.playcount) || Math.floor(Math.random() * 100000),
      releaseYear: releaseYear,
      isClassic: isClassic,
      tags: albumDetails.tags?.tag?.map((t) => t.name) || [],
    };
  }

  // Get album image
  function getAlbumImage(images) {
    if (!images || !Array.isArray(images)) {
      return "https://via.placeholder.com/300/333/FFFFFF?text=Album+Art";
    }

    const largeImage =
      images.find((img) => img.size === "large") ||
      images.find((img) => img.size === "extralarge");
    return (
      largeImage?.["#text"] ||
      images[0]?.["#text"] ||
      "https://via.placeholder.com/300/333/FFFFFF?text=Album+Art"
    );
  }

  // Get primary genre from tags
  function getPrimaryGenre(tags) {
    if (!tags || !tags.tag || !Array.isArray(tags.tag)) return null;
    return tags.tag[0]?.name || null;
  }

  // Generate synthetic reviews when API data is limited
  function generateSyntheticReviews(count) {
    const reviews = [];
    const allArtists = [
      ...southAfricanArtists.modern,
      ...southAfricanArtists.classic,
      ...southAfricanArtists.jazz,
    ];

    for (let i = 0; i < count; i++) {
      const artist = allArtists[Math.floor(Math.random() * allArtists.length)];
      const isClassic = southAfricanArtists.classic.includes(artist);
      reviews.push(generateSyntheticReview(artist, isClassic));
    }

    return reviews;
  }

  function generateSyntheticArtistReviews(artist, count) {
    const reviews = [];
    const isClassic = southAfricanArtists.classic.includes(artist);

    for (let i = 0; i < count; i++) {
      reviews.push(generateSyntheticReview(artist, isClassic));
    }

    return reviews;
  }

  function generateSyntheticReview(artist, isClassic) {
    const releaseYear = generateReleaseYear(isClassic);
    const albumTitles = generateAlbumTitles(artist);
    const title = albumTitles[Math.floor(Math.random() * albumTitles.length)];

    return {
      id: `synth-${artist}-${title}-${Date.now()}-${Math.random()}`,
      title: title,
      artist: artist,
      genre: categorizeGenre(artist),
      cover: generatePlaceholderImage(artist, title),
      summary: generateDetailedReview(artist, title, {}, isClassic),
      rating: generateWeightedRating(isClassic),
      author: generateAuthorName(),
      date: generateDate(releaseYear),
      playcount: Math.floor(Math.random() * 500000),
      releaseYear: releaseYear,
      isClassic: isClassic,
      tags: [categorizeGenre(artist), "South African"],
      isSynthetic: true,
    };
  }

  // Enhanced review generation
  function generateDetailedReview(artist, albumName, albumDetails, isClassic) {
    if (albumDetails.wiki?.summary) {
      let summary = albumDetails.wiki.summary.split("<a")[0];
      return summary.length > 100 ? summary.substring(0, 250) + "..." : summary;
    }

    const themes = {
      modern: [
        `"${albumName}" represents ${artist}'s evolution as an artist, blending contemporary production with authentic South African sounds.`,
        `This release showcases ${artist}'s unique ability to create music that resonates across generations and borders.`,
        `A powerful statement from ${artist} that demonstrates their growing influence in the global music landscape.`,
        `With "${albumName}", ${artist} continues to push boundaries while staying true to their musical roots.`,
      ],
      classic: [
        `This timeless masterpiece from ${artist} captures the spirit of an era and continues to inspire musicians today.`,
        `"${albumName}" stands as a testament to ${artist}'s enduring legacy in South African music history.`,
        `A landmark album that defined a generation and established ${artist} as a cultural icon.`,
        `This classic work showcases ${artist}'s pioneering spirit and innovative approach to music.`,
      ],
      jazz: [
        `"${albumName}" demonstrates ${artist}'s masterful command of jazz traditions infused with South African rhythms.`,
        `A sophisticated exploration of sound that highlights ${artist}'s technical prowess and emotional depth.`,
        `This album represents the pinnacle of ${artist}'s artistic expression within the jazz idiom.`,
      ],
    };

    let category = "modern";
    if (isClassic) category = "classic";
    if (southAfricanArtists.jazz.includes(artist)) category = "jazz";

    const categoryThemes = themes[category];
    return categoryThemes[Math.floor(Math.random() * categoryThemes.length)];
  }

  // Helper functions
  function generateAlbumTitles(artist) {
    const prefixes = ["The", "Our", "My", "New", "Ancient", "Modern"];
    const concepts = [
      "Journey",
      "Voice",
      "Story",
      "Dream",
      "Light",
      "Fire",
      "Water",
      "Earth",
      "Spirit",
    ];
    const suffixes = [
      "of Hope",
      "of Time",
      "Forever",
      "Again",
      "Within",
      "Beyond",
    ];

    return [
      `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${
        concepts[Math.floor(Math.random() * concepts.length)]
      }`,
      `${concepts[Math.floor(Math.random() * concepts.length)]} ${
        suffixes[Math.floor(Math.random() * suffixes.length)]
      }`,
      `Volume ${Math.floor(Math.random() * 5) + 1}`,
      `Chapter ${Math.floor(Math.random() * 10) + 1}`,
      `${artist.split(" ")[0]}'s ${
        concepts[Math.floor(Math.random() * concepts.length)]
      }`,
    ];
  }

  function generatePlaceholderImage(artist, title) {
    const colors = ["002395", "FF6B35", "00A896", "FF9F1C", "6A4C93"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `https://via.placeholder.com/300/${color}/FFFFFF?text=${encodeURIComponent(
      title.substring(0, 15)
    )}`;
  }

  function categorizeGenre(artist) {
    if (southAfricanArtists.jazz.includes(artist)) return "Jazz";
    if (
      artist.includes("Kabza") ||
      artist.includes("Maphorisa") ||
      artist.includes("Gogo")
    )
      return "Amapiano";
    if (
      artist.includes("Nasty C") ||
      artist.includes("Cassper") ||
      artist.includes("A-Reece")
    )
      return "Hip-Hop";
    if (southAfricanArtists.classic.includes(artist)) return "Classic";
    return "South African Pop";
  }

  function generateReleaseYear(isClassic) {
    if (isClassic) return Math.floor(Math.random() * 20) + 1980;
    return Math.floor(Math.random() * 5) + 2019;
  }

  function generateWeightedRating(isClassic) {
    if (isClassic) return (Math.random() * 0.5 + 4.5).toFixed(1);
    return (Math.random() * 1.2 + 3.8).toFixed(1);
  }

  function generateAuthorName() {
    const authors = [
      "Lerato M.",
      "Thabo K.",
      "Zanele P.",
      "Kagiso L.",
      "Nomsa D.",
      "Sipho M.",
      "Buhle N.",
      "Mandla R.",
    ];
    return authors[Math.floor(Math.random() * authors.length)];
  }

  function generateDate(releaseYear) {
    const currentYear = new Date().getFullYear();
    const year = Math.min(releaseYear + 1, currentYear);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  }

  // Filter reviews by category
  function filterReviewsByCategory(category) {
    let filteredReviews = [];

    switch (category) {
      case "new":
        filteredReviews = allReviews.filter((review) => !review.isClassic);
        break;
      case "popular":
        filteredReviews = allReviews.filter((review) => review.rating >= 4.0);
        break;
      case "classics":
        filteredReviews = allReviews.filter((review) => review.isClassic);
        break;
      default:
        filteredReviews = allReviews;
    }

    displayReviews(filteredReviews);
  }

  // Display reviews in the grid
  function displayReviews(reviews) {
    if (!reviews || reviews.length === 0) {
      grid.innerHTML = `
        <div class="error">
          <p>No reviews found for this category.</p>
          <button onclick="generateLargeDataset()" class="retry-btn">Try Again</button>
        </div>
      `;
      // Animate error state
      gsap.fromTo(
        grid.querySelector(".error"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
      return;
    }

    grid.innerHTML = reviews
      .map(
        (review) => `
      <div class="music-card">
        <div class="album-art-container">
          <img src="${review.cover}" alt="${review.title}" class="album-art" />
          <div class="badge-container">
            <span class="sa-badge">SA</span>
            <span class="genre-badge">${review.genre}</span>
          </div>
        </div>
        <div class="info">
          <div class="genre">${review.genre}</div>
          <h3 class="song-title">${review.title}</h3>
          <p class="artist">${review.artist}</p>
          <p class="date">Released ${review.releaseYear}</p>
          <div class="rating">
            <span class="stars">${"★".repeat(Math.floor(review.rating))}${
          review.rating % 1 >= 0.5 ? "½" : ""
        }</span>
            <span class="rating-value">${review.rating}/5</span>
          </div>
          <p class="summary">${review.summary}</p>
          <p class="author">Reviewed by ${review.author}</p>
        </div>
      </div>
    `
      )
      .join("");

    // Animate the review cards
    animateReviewCards();
  }

  // Search functionality with debouncing
  let searchTimeout;
  const searchBar = document.getElementById("searchBar");

  if (searchBar) {
    searchBar.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      const searchTerm = e.target.value.toLowerCase();

      searchTimeout = setTimeout(() => {
        if (searchTerm.length < 2) {
          filterReviewsByCategory(currentCategory);
          return;
        }

        const filteredReviews = allReviews.filter(
          (review) =>
            review.title.toLowerCase().includes(searchTerm) ||
            review.artist.toLowerCase().includes(searchTerm) ||
            review.genre.toLowerCase().includes(searchTerm) ||
            (review.tags &&
              review.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
        );

        displayReviews(filteredReviews);
      }, 300);
    });
  }

  // Make functions global
  window.generateLargeDataset = generateLargeDataset;
  window.filterReviewsByCategory = filterReviewsByCategory;

  // Initialize everything
  initializePageAnimations();
  initializeTabAnimations();
  initializeSearchAnimation();
  generateLargeDataset();
});
