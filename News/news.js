document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded - initializing news page");

  const grid = document.getElementById("reviewsGrid");
  const newsContainer = document.getElementById("news-container");
  const tabs = document.querySelectorAll(".tab");
  const featuredSection = document.getElementById("featured-news");
  const newsSection = document.getElementById("news-section");
  const reviewsSection = document.getElementById("reviews-section");

  // Debug: Check if elements exist
  console.log("Elements found:", {
    grid: !!grid,
    newsContainer: !!newsContainer,
    tabs: tabs.length,
    featuredSection: !!featuredSection,
    newsSection: !!newsSection,
    reviewsSection: !!reviewsSection,
  });

  // API Keys
  const LAST_FM_API_KEY = "bf85b73d5ac9150697aa9cd05a40cb55";
  const LAST_FM_BASE_URL = "https://ws.audioscrobbler.com/2.0/";
  const GUARDIAN_API_KEY = "test"; // Replace with your actual Guardian API key
  const GUARDIAN_BASE_URL = "https://content.guardianapis.com/search";

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

  // Initialize GSAP Animations
  function initGSAPAnimations() {
    console.log("Initializing GSAP animations");

    // Animation 1: Page Load Sequence - Staggered fade in for main elements
    const pageLoadTL = gsap.timeline();
    pageLoadTL
      .from(".section-title", {
        duration: 1,
        y: -50,
        opacity: 0,
        ease: "power3.out",
      })
      .from(
        ".tabs",
        {
          duration: 0.8,
          y: -30,
          opacity: 0,
          ease: "back.out(1.7)",
        },
        "-=0.5"
      )
      .from(
        ".tab",
        {
          duration: 0.6,
          y: -20,
          opacity: 0,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.3"
      );

    // Animation 2: Featured News Scale and Fade
    gsap.from(".featured-main", {
      scrollTrigger: {
        trigger: ".featured-news",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      duration: 1.2,
      scale: 0.9,
      opacity: 0,
      ease: "power2.out",
    });

    gsap.from(".featured-side-item", {
      scrollTrigger: {
        trigger: ".featured-sidebar",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      duration: 0.8,
      x: -50,
      opacity: 0,
      stagger: 0.2,
      ease: "power2.out",
    });

    // Animation 3: News Cards Staggered Entrance
    gsap.from(".news-card", {
      scrollTrigger: {
        trigger: ".news-section",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      duration: 0.8,
      y: 50,
      opacity: 0,
      stagger: 0.15,
      ease: "power2.out",
    });

    // Animation 4: Review Cards Slide In with Rotation
    gsap.from(".review-card", {
      scrollTrigger: {
        trigger: ".reviews-section",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      duration: 0.7,
      x: -100,
      rotation: -5,
      opacity: 0,
      stagger: 0.1,
      ease: "back.out(1.2)",
    });

    console.log("GSAP animations initialized");
  }

  // Enhanced hover animations for interactive elements
  function initHoverAnimations() {
    // News card hover effects
    gsap.utils.toArray(".news-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          duration: 0.3,
          y: -10,
          scale: 1.02,
          boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          duration: 0.3,
          y: 0,
          scale: 1,
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          ease: "power2.out",
        });
      });
    });

    // Review card hover effects
    gsap.utils.toArray(".review-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          duration: 0.3,
          y: -8,
          rotation: 1,
          boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
          ease: "power2.out",
        });

        // Pulse animation for the genre tag
        gsap.to(card.querySelector(".genre"), {
          duration: 0.4,
          scale: 1.1,
          backgroundColor: "#000",
          color: "#ff0",
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          duration: 0.3,
          y: 0,
          rotation: 0,
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          ease: "power2.out",
        });

        // Reset genre tag
        gsap.to(card.querySelector(".genre"), {
          duration: 0.4,
          scale: 1,
          backgroundColor: "#ff0",
          color: "#000",
          ease: "power2.out",
        });
      });
    });

    // Tab hover animations
    gsap.utils.toArray(".tab").forEach((tab) => {
      tab.addEventListener("mouseenter", () => {
        if (!tab.classList.contains("active")) {
          gsap.to(tab, {
            duration: 0.2,
            scale: 1.05,
            color: "#000",
            ease: "power2.out",
          });
        }
      });

      tab.addEventListener("mouseleave", () => {
        if (!tab.classList.contains("active")) {
          gsap.to(tab, {
            duration: 0.2,
            scale: 1,
            color: "#666",
            ease: "power2.out",
          });
        }
      });
    });

    // Featured news image hover effects
    gsap.utils
      .toArray(".featured-main img, .featured-side-item img")
      .forEach((img) => {
        img.addEventListener("mouseenter", () => {
          gsap.to(img, {
            duration: 0.4,
            scale: 1.05,
            filter: "brightness(1.1)",
            ease: "power2.out",
          });
        });

        img.addEventListener("mouseleave", () => {
          gsap.to(img, {
            duration: 0.4,
            scale: 1,
            filter: "brightness(1)",
            ease: "power2.out",
          });
        });
      });
  }

  // Animate content when it's dynamically loaded
  function animateDynamicContent(container, type = "news") {
    if (!container || container.children.length === 0) return;

    const elements = Array.from(container.children);

    switch (type) {
      case "news":
        gsap.fromTo(
          elements,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
          }
        );
        break;

      case "reviews":
        gsap.fromTo(
          elements,
          { x: -50, rotation: -3, opacity: 0 },
          {
            x: 0,
            rotation: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "back.out(1.2)",
          }
        );
        break;

      case "featured":
        if (elements[0]) {
          // Main featured
          gsap.fromTo(
            elements[0],
            { scale: 0.95, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 1,
              ease: "power2.out",
            }
          );
        }
        if (elements[1]) {
          // Sidebar
          gsap.fromTo(
            Array.from(elements[1].children),
            { x: -30, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.2,
              ease: "power2.out",
            }
          );
        }
        break;
    }
  }

  // Tab switching functionality
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      console.log("Tab clicked:", tab.textContent);

      // Animate tab switch
      gsap.to(tab, {
        duration: 0.3,
        scale: 0.95,
        ease: "power2.out",
        onComplete: () => {
          tabs.forEach((t) => t.classList.remove("active"));
          tab.classList.add("active");

          gsap.to(tab, {
            duration: 0.3,
            scale: 1,
            ease: "power2.out",
          });

          const category = tab.textContent.toLowerCase();

          if (category === "new") {
            console.log("Loading news section");
            displayMusicNews();
            fetchRealReviews("new");
          } else {
            console.log("Loading category:", category);
            fetchRealReviews(category);
            // Hide news for other tabs
            if (newsSection) {
              gsap.to(newsSection, {
                duration: 0.5,
                opacity: 0,
                y: 20,
                onComplete: () => {
                  newsSection.style.display = "none";
                },
              });
            }
            if (reviewsSection) reviewsSection.style.display = "block";
            if (featuredSection) {
              gsap.to(featuredSection, {
                duration: 0.5,
                opacity: 0,
                y: 20,
                onComplete: () => {
                  featuredSection.style.display = "none";
                },
              });
            }
          }
        },
      });
    });
  });

  // Create featured news section (Rolling Stone style)
  function createFeaturedNews(articles) {
    console.log("Creating featured news with", articles?.length, "articles");

    if (!featuredSection) {
      console.error("Featured section element not found!");
      return;
    }

    if (!articles || articles.length === 0) {
      console.warn("No articles provided for featured news");
      featuredSection.innerHTML = `
        <div class="error">
          <i class="fas fa-exclamation-circle"></i>
          <p>No featured news available at the moment.</p>
        </div>
      `;
      return;
    }

    const mainArticle = articles[0];
    const sideArticles = articles.slice(1, 4);

    featuredSection.innerHTML = `
      <div class="featured-main">
        <img src="${mainArticle.image}" alt="${mainArticle.title}" 
             onerror="this.src='https://via.placeholder.com/800x500/000000/FFFFFF?text=Featured+News'">
        <div class="featured-main-content">
          <h2>${mainArticle.title}</h2>
          <p>${mainArticle.description}</p>
          <div class="news-source">${mainArticle.source}</div>
        </div>
      </div>
      <div class="featured-sidebar">
        ${sideArticles
          .map(
            (article) => `
          <article class="featured-side-item">
            <img src="${article.image}" alt="${article.title}"
                 onerror="this.src='https://via.placeholder.com/120x100/000000/FFFFFF?text=News'">
            <div class="featured-side-content">
              <h3>${article.title}</h3>
              <p>${article.description.substring(0, 100)}...</p>
              <div class="news-source">${article.source}</div>
            </div>
          </article>
        `
          )
          .join("")}
      </div>
    `;

    // Animate the featured content after creation
    setTimeout(() => {
      animateDynamicContent(featuredSection, "featured");
    }, 100);

    console.log("Featured news created successfully");
  }

  // Fetch real music news from Guardian API
  async function fetchGuardianMusicNews() {
    console.log("Fetching music news from Guardian API");

    if (!newsContainer) {
      console.error("News container element not found!");
      return getCuratedMusicNews(); // Fallback to curated news
    }

    // Show loading state
    newsContainer.innerHTML = `
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        Loading latest music news from The Guardian...
      </div>
    `;

    try {
      const url = `${GUARDIAN_BASE_URL}?section=music&show-fields=thumbnail,trailText&page-size=20&api-key=${GUARDIAN_API_KEY}&order-by=newest`;

      console.log("Fetching from:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Guardian API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Guardian API response:", data);

      if (
        data.response &&
        data.response.results &&
        data.response.results.length > 0
      ) {
        const articles = transformGuardianArticles(data.response.results);
        console.log("Transformed articles:", articles);
        return articles;
      } else {
        console.warn("No articles found in Guardian API response");
        return getCuratedMusicNews(); // Fallback to curated news
      }
    } catch (error) {
      console.error("Error fetching from Guardian API:", error);
      return getCuratedMusicNews(); // Fallback to curated news
    }
  }

  // Transform Guardian API response to our format
  function transformGuardianArticles(guardianArticles) {
    return guardianArticles.map((article) => {
      // Get a music-related placeholder image based on the title
      const getMusicImage = (title) => {
        const musicKeywords = {
          album: "FF0000",
          song: "0000FF",
          concert: "00FF00",
          festival: "FF00FF",
          artist: "FFFF00",
          music: "FF6B6B",
          award: "4ECDC4",
          chart: "FFA500",
          release: "9B59B6",
        };

        let color = "000000";
        const lowerTitle = title.toLowerCase();

        for (const [keyword, hexColor] of Object.entries(musicKeywords)) {
          if (lowerTitle.includes(keyword)) {
            color = hexColor;
            break;
          }
        }

        return `https://via.placeholder.com/350x220/${color}/FFFFFF?text=Music+News`;
      };

      return {
        title: article.webTitle,
        description:
          article.fields?.trailText ||
          "Latest music news and updates from The Guardian.",
        image: article.fields?.thumbnail || getMusicImage(article.webTitle),
        url: article.webUrl,
        source: "The Guardian",
        date: formatGuardianDate(article.webPublicationDate),
      };
    });
  }

  // Format Guardian date to readable format
  function formatGuardianDate(dateString) {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Recent";
    }
  }

  // Display music news
  async function displayMusicNews() {
    console.log("Displaying music news");

    if (newsSection) newsSection.style.display = "block";
    if (reviewsSection) reviewsSection.style.display = "block";
    if (featuredSection) featuredSection.style.display = "grid";

    try {
      const musicNews = await fetchGuardianMusicNews();
      console.log("Retrieved", musicNews.length, "news articles");

      if (musicNews.length >= 4) {
        createFeaturedNews(musicNews.slice(0, 4)); // First 4 articles for featured section
        renderNews(musicNews.slice(4)); // Remaining articles for the grid
      } else {
        // If we don't have enough articles, use what we have
        createFeaturedNews(musicNews.slice(0, Math.min(4, musicNews.length)));
        renderNews(musicNews.slice(Math.min(4, musicNews.length)));
      }
    } catch (error) {
      console.error("Error displaying music news:", error);
      // Fallback to curated news
      const musicNews = getCuratedMusicNews();
      createFeaturedNews(musicNews.slice(0, 4));
      renderNews(musicNews.slice(4));
    }
  }

  // Curated music news fallback
  function getCuratedMusicNews() {
    console.log("Using curated music news fallback");
    return [
      {
        title: "Rolling Stone: The 50 Best Albums of 2024",
        description:
          "From breakthrough artists to established legends, discover the albums that defined the year in music across all genres.",
        image:
          "https://via.placeholder.com/800x500/FF0000/FFFFFF?text=Rolling+Stone+2024",
        url: "#",
        source: "Rolling Stone",
        date: "December 2024",
      },
      {
        title: "Pitchfork: Best New Music This Week",
        description:
          "This week's essential new tracks and albums including must-hear releases from emerging and established artists.",
        image:
          "https://via.placeholder.com/400x300/000000/FFFFFF?text=Pitchfork+Weekly",
        url: "#",
        source: "Pitchfork",
        date: "This Week",
      },
      {
        title: "Billboard: Chart-Topping Releases",
        description:
          "Latest updates from the Billboard charts with new entries breaking into the Top 100 and surprising chart movements.",
        image:
          "https://via.placeholder.com/400x300/0000FF/FFFFFF?text=Billboard+Charts",
        url: "#",
        source: "Billboard",
        date: "Latest",
      },
      {
        title: "NME: Festival Season Lineup Reveals",
        description:
          "Complete guide to summer music festivals with major lineup announcements and exclusive artist interviews.",
        image:
          "https://via.placeholder.com/400x300/FF00FF/FFFFFF?text=NME+Festivals",
        url: "#",
        source: "NME",
        date: "March 2024",
      },
      {
        title: "Spin: Artist of the Month Feature",
        description:
          "Exclusive deep dive into the most exciting new artist making waves in the music industry right now.",
        image:
          "https://via.placeholder.com/350x220/FFFF00/000000?text=Spin+Artist",
        url: "#",
        source: "Spin",
        date: "March 2024",
      },
      {
        title: "Consequence: Music Industry Analysis",
        description:
          "In-depth look at streaming trends, label moves, and the business behind today's biggest hits.",
        image:
          "https://via.placeholder.com/350x220/00FF00/FFFFFF?text=Music+Business",
        url: "#",
        source: "Consequence",
        date: "Recent",
      },
    ];
  }

  // Render news articles
  function renderNews(articles) {
    console.log("Rendering", articles?.length, "news articles");

    if (!newsContainer) {
      console.error("News container element not found!");
      return;
    }

    if (!articles || articles.length === 0) {
      newsContainer.innerHTML = `
        <div class="error">
          <i class="fas fa-exclamation-circle"></i>
          <p>No news articles found at the moment. Please check back later.</p>
        </div>
      `;
      return;
    }

    newsContainer.innerHTML = "";

    articles.forEach((article, index) => {
      const newsCard = document.createElement("article");
      newsCard.classList.add("news-card");

      newsCard.innerHTML = `
        <img src="${article.image}" 
             alt="${article.title}" 
             onerror="this.src='https://via.placeholder.com/350x220/000000/FFFFFF?text=Music+News'">
        <div class="news-card-content">
          <h3>${article.title}</h3>
          <p>${article.description}</p>
          <a href="${article.url}" target="_blank" rel="noopener">Read on ${article.source}</a>
          <div class="news-meta">
            <div class="news-source">${article.source}</div>
            <div class="news-date">${article.date}</div>
          </div>
        </div>
      `;

      newsContainer.appendChild(newsCard);
    });

    // Animate the news cards after rendering
    setTimeout(() => {
      animateDynamicContent(newsContainer, "news");
    }, 100);

    console.log("News articles rendered successfully");
  }

  // Review functions
  async function fetchRealReviews(category = "new") {
    console.log("Fetching reviews for category:", category);

    if (!grid) {
      console.error("Reviews grid element not found!");
      return;
    }

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
      return "https://via.placeholder.com/300x300/000000/FFFFFF?text=No+Image";

    const largeImage = images.find((img) => img.size === "large")?.["#text"];
    const mediumImage = images.find((img) => img.size === "medium")?.["#text"];
    const smallImage = images.find((img) => img.size === "small")?.["#text"];

    return (
      largeImage ||
      mediumImage ||
      smallImage ||
      "https://via.placeholder.com/300x300/000000/FFFFFF?text=No+Image"
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
    if (!grid) {
      console.error("Reviews grid element not found!");
      return;
    }

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
      }" class="album-cover" onerror="this.src='https://via.placeholder.com/300x300/000000/FFFFFF?text=No+Image'">
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
          <div class="review-meta">
            <div class="author">${review.author}</div>
            <div class="date">${review.date}</div>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    // Animate the review cards after rendering
    setTimeout(() => {
      animateDynamicContent(grid, "reviews");
    }, 100);

    console.log("Displayed", reviews.length, "reviews");
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

  if (searchBar) {
    searchBar.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      console.log("Searching for:", searchTerm);

      if (searchTerm.length < 2) {
        displayReviews(allReviews);
        if (
          document.querySelector(".tab.active").textContent.toLowerCase() ===
          "new"
        ) {
          // Reload fresh news when search is cleared
          displayMusicNews();
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
        document.querySelector(".tab.active").textContent.toLowerCase() ===
        "new"
      ) {
        const filteredNews = allNews.filter(
          (article) =>
            article.title.toLowerCase().includes(searchTerm) ||
            article.description.toLowerCase().includes(searchTerm)
        );
        if (featuredSection) featuredSection.style.display = "none";
        renderNews(filteredNews);
      }

      displayReviews(filteredReviews);
    });
  }

  // Store data for search functionality
  const originalDisplayReviews = displayReviews;
  displayReviews = function (reviews) {
    allReviews = reviews;
    originalDisplayReviews(reviews);
  };

  // Store news data
  allNews = getCuratedMusicNews(); // Initial fallback

  // Initial load
  console.log("Starting initial load...");

  // Initialize animations first
  initGSAPAnimations();
  initHoverAnimations();

  // Then load content
  displayMusicNews();
  fetchRealReviews("new");
  console.log("Initial load complete");
});
