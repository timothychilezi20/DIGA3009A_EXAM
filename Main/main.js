// Main JavaScript for The Beat Report - Global functionality

// =========================
// DOM CONTENT LOADED INITIALIZATION
// =========================
document.addEventListener("DOMContentLoaded", function () {
  // === Search Toggle ===
  const searchIcon = document.getElementById("searchIcon");
  const searchBar = document.getElementById("searchBar");

  if (searchIcon && searchBar) {
    searchIcon.addEventListener("click", () => {
      searchBar.classList.toggle("active");
      searchBar.focus(); // optional: focuses input immediately
    });
  }

  // === Login Modal ===
  const loginText = document.getElementById("loginText");
  const userIcon = document.getElementById("userIcon");

  // Example: open login modal when clicking "Login"
  if (loginText) {
    loginText.addEventListener("click", () => {
      const loginModal = document.getElementById("loginModal");
      if (loginModal) loginModal.style.display = "flex";
    });
  }

  // Example: handle login form submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Simulate successful login
      if (loginText) loginText.style.display = "none";
      if (userIcon) userIcon.style.display = "inline-block";

      // Close login modal
      const loginModal = document.getElementById("loginModal");
      if (loginModal) loginModal.style.display = "none";
    });
  }

  // === Feedback Bar ===
  const feedbackButton = document.getElementById("feedbackButton");
  const feedbackModal = document.getElementById("feedbackModal");
  const closeFeedback = document.getElementById("closeFeedback");

  if (feedbackButton && feedbackModal) {
    feedbackButton.addEventListener("click", () => {
      feedbackModal.style.display = "flex";
    });
  }

  if (closeFeedback && feedbackModal) {
    closeFeedback.addEventListener("click", () => {
      feedbackModal.style.display = "none";
    });
  }

  // Optional: close modal if clicked outside
  window.addEventListener("click", (e) => {
    if (e.target === feedbackModal) {
      feedbackModal.style.display = "none";
    }
  });

  // Initialize Global Search
  window.globalSearch = new GlobalSearch();

  // Initialize Back to Top
  window.backToTop = new BackToTop();

  // Add special effects after a short delay
  setTimeout(() => {
    if (window.backToTop) {
      window.backToTop.addSpecialEffects();
    }
  }, 1000);
});

// =========================
// GLOBAL SEARCH FUNCTIONALITY
// =========================
class GlobalSearch {
  constructor() {
    this.allContentData = {};
    this.init();
  }

  init() {
    this.setupSearchListeners();
    this.loadSearchData();
  }

  setupSearchListeners() {
    const searchIcon = document.getElementById("searchIcon");
    const searchBar = document.getElementById("searchBar");

    if (!searchIcon || !searchBar) return;

    // Toggle search bar visibility
    searchIcon.addEventListener("click", () => {
      const isVisible = searchBar.style.display === "block";
      searchBar.style.display = isVisible ? "none" : "block";
      if (!isVisible) {
        searchBar.focus();
      } else {
        this.clearSearch();
      }
    });

    // Handle search input
    searchBar.addEventListener("input", (e) => {
      this.handleSearch(e.target.value.trim());
    });

    searchBar.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.performSearch(e.target.value.trim());
      }
    });

    // Close search when clicking outside
    document.addEventListener("click", (e) => {
      if (
        searchBar &&
        !searchBar.contains(e.target) &&
        searchIcon &&
        !searchIcon.contains(e.target)
      ) {
        searchBar.style.display = "none";
        this.clearSearch();
      }
    });
  }

  handleSearch(searchTerm) {
    if (searchTerm.length === 0) {
      this.clearSearch();
      return;
    }

    if (searchTerm.length >= 2) {
      this.performSearch(searchTerm);
    }
  }

  performSearch(searchTerm) {
    if (!searchTerm) {
      this.clearSearch();
      return;
    }

    console.log(`Global Search for: ${searchTerm}`);

    const searchResults = this.searchAllContent(searchTerm);
    this.displaySearchResults(searchResults, searchTerm);
  }

  searchAllContent(searchTerm) {
    const results = {
      articles: [],
      releases: [],
      events: [],
      charts: [],
      news: [],
      reviews: [],
    };

    const lowerSearchTerm = searchTerm.toLowerCase();

    // Search through all stored data
    Object.keys(this.allContentData).forEach((category) => {
      if (
        this.allContentData[category] &&
        Array.isArray(this.allContentData[category])
      ) {
        results[category] = this.allContentData[category].filter((item) =>
          this.doesItemMatchSearch(item, lowerSearchTerm)
        );
      }
    });

    // Also search current page content
    this.searchCurrentPageContent(results, lowerSearchTerm);

    return results;
  }

  doesItemMatchSearch(item, lowerSearchTerm) {
    // Check various properties that might contain searchable text
    const searchableFields = [
      "title",
      "name",
      "description",
      "content",
      "artist",
      "venue",
      "source",
      "author",
      "genre",
      "platform",
      "album",
      "track",
    ];

    return searchableFields.some((field) => {
      if (item[field] && typeof item[field] === "string") {
        return item[field].toLowerCase().includes(lowerSearchTerm);
      }
      if (item[field] && typeof item[field] === "object" && item[field].name) {
        return item[field].name.toLowerCase().includes(lowerSearchTerm);
      }
      return false;
    });
  }

  searchCurrentPageContent(results, lowerSearchTerm) {
    // Search visible content on the current page
    const pageSpecificSelectors = {
      articles: ".sidebar-article, .side-article, .latest-article, .story-card",
      news: ".news-item, .news-article",
      reviews: ".review-item, .review-card",
      music: ".release-card, .track-item, .album-card",
      events: ".event-item, .event-card",
    };

    Object.keys(pageSpecificSelectors).forEach((category) => {
      const elements = document.querySelectorAll(
        pageSpecificSelectors[category]
      );
      elements.forEach((element) => {
        const textContent = element.textContent.toLowerCase();
        if (textContent.includes(lowerSearchTerm)) {
          const item = this.createElementSearchItem(element, category);
          if (item) {
            results[category].push(item);
          }
        }
      });
    });
  }

  createElementSearchItem(element, category) {
    // Create a search result item from DOM element
    const title =
      element.querySelector("h1, h2, h3, h4, h5, h6")?.textContent ||
      "Untitled";
    const description = element.querySelector("p")?.textContent || "";
    const image =
      element.querySelector("img")?.src || this.getDefaultImage(category);
    const url =
      element.getAttribute("onclick")?.match(/window\.open\('([^']+)'/)?.[1] ||
      element.querySelector("a")?.href ||
      "#";

    return {
      title: title.trim(),
      description: description.trim(),
      image: image,
      url: url,
      category: category,
    };
  }

  getDefaultImage(category) {
    const defaultImages = {
      articles: "images/music-default.jpg",
      news: "images/music-default.jpg",
      reviews: "images/music-default.jpg",
      music: "images/sa-music-default.jpg",
      events: "images/event-default.jpg",
      charts: "images/chart-default.jpg",
    };
    return defaultImages[category] || "images/music-default.jpg";
  }

  displaySearchResults(results, searchTerm) {
    // Hide regular content
    this.hidePageContent();

    // Create search results container
    let searchResultsContainer = document.getElementById("globalSearchResults");
    if (!searchResultsContainer) {
      searchResultsContainer = document.createElement("div");
      searchResultsContainer.id = "globalSearchResults";
      searchResultsContainer.className = "global-search-results";

      // Insert at the top of main content
      const mainContent =
        document.querySelector(".main-content") || document.body;
      const firstContent = mainContent.querySelector(
        ".content-grid, .the-latest, main"
      );
      if (firstContent) {
        mainContent.insertBefore(searchResultsContainer, firstContent);
      } else {
        mainContent.prepend(searchResultsContainer);
      }
    }

    // Build results HTML
    searchResultsContainer.innerHTML = this.buildResultsHTML(
      results,
      searchTerm
    );

    // Add clear search event listener
    const clearSearchBtn = document.getElementById("clearGlobalSearch");
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => this.clearSearch());
    }
  }

  buildResultsHTML(results, searchTerm) {
    let resultsHTML = `
      <div class="search-results-header">
        <h2><i class="fas fa-search"></i> Search Results for "${searchTerm}"</h2>
        <button id="clearGlobalSearch" class="clear-search-btn">
          <i class="fas fa-times"></i> Clear Search
        </button>
      </div>
      <div class="search-results-content">
    `;

    const totalResults = Object.values(results).reduce(
      (sum, arr) => sum + arr.length,
      0
    );

    if (totalResults === 0) {
      resultsHTML += `
        <div class="no-results">
          <i class="fas fa-search fa-3x"></i>
          <h3>No results found for "${searchTerm}"</h3>
          <p>Try different keywords or check the spelling.</p>
        </div>
      `;
    } else {
      // Display results by category
      Object.keys(results).forEach((category) => {
        if (results[category].length > 0) {
          resultsHTML += this.buildCategoryHTML(category, results[category]);
        }
      });
    }

    resultsHTML += `</div>`;
    return resultsHTML;
  }

  buildCategoryHTML(category, items) {
    const categoryTitles = {
      articles: "Articles",
      news: "News",
      reviews: "Reviews",
      music: "Music Releases",
      events: "Events",
      charts: "Charts",
    };

    return `
      <section class="search-category-section">
        <h3>${categoryTitles[category] || category} (${items.length})</h3>
        <div class="search-category-grid ${category}-grid">
          ${items.map((item) => this.buildItemHTML(item, category)).join("")}
        </div>
      </section>
    `;
  }

  buildItemHTML(item, category) {
    const clickHandler =
      item.url && item.url !== "#"
        ? `onclick="window.open('${item.url}', '_blank')"`
        : "";

    return `
      <div class="search-result-item ${category}-item" ${clickHandler}>
        <img src="${item.image}" alt="${item.title}" 
             onerror="this.src='${this.getDefaultImage(category)}'">
        <div class="search-item-content">
          <h4>${item.title}</h4>
          ${
            item.description
              ? `<p>${this.truncateText(item.description, 120)}</p>`
              : ""
          }
          ${item.artist ? `<p class="search-artist">${item.artist}</p>` : ""}
          ${item.date ? `<p class="search-date">${item.date}</p>` : ""}
          ${item.venue ? `<p class="search-venue">${item.venue}</p>` : ""}
        </div>
      </div>
    `;
  }

  hidePageContent() {
    const contentSelectors = [
      ".content-grid",
      ".the-latest",
      ".spotify-releases",
      ".news-grid",
      ".reviews-container",
      ".music-grid",
      ".events-container",
    ];

    contentSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        el.style.display = "none";
      });
    });
  }

  showPageContent() {
    const contentSelectors = [
      ".content-grid",
      ".the-latest",
      ".spotify-releases",
      ".news-grid",
      ".reviews-container",
      ".music-grid",
      ".events-container",
    ];

    contentSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        el.style.display = "";
      });
    });
  }

  clearSearch() {
    const searchResultsContainer = document.getElementById(
      "globalSearchResults"
    );
    if (searchResultsContainer) {
      searchResultsContainer.remove();
    }

    const searchBar = document.getElementById("searchBar");
    if (searchBar) {
      searchBar.value = "";
      searchBar.style.display = "none";
    }

    this.showPageContent();
  }

  loadSearchData() {
    // Try to load search data from localStorage or global variable
    try {
      const savedData = localStorage.getItem("beatReportSearchData");
      if (savedData) {
        this.allContentData = JSON.parse(savedData);
      }
    } catch (e) {
      console.log("No saved search data found");
    }

    // Also check for global data
    if (window.globalContentData) {
      this.allContentData = {
        ...this.allContentData,
        ...window.globalContentData,
      };
    }
  }

  saveSearchData() {
    try {
      localStorage.setItem(
        "beatReportSearchData",
        JSON.stringify(this.allContentData)
      );
    } catch (e) {
      console.warn("Could not save search data to localStorage");
    }
  }

  addContentData(category, data) {
    if (!this.allContentData[category]) {
      this.allContentData[category] = [];
    }
    this.allContentData[category] = this.allContentData[category].concat(data);
    this.saveSearchData();
  }

  truncateText(text, maxLength) {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }
}

// =========================
// BACK TO TOP FUNCTIONALITY
// =========================
class BackToTop {
  constructor() {
    this.button = null;
    this.scrollThreshold = 300;
    this.pageThemes = {
      home: {
        bgColor: "#e74c3c", // Red from your header
        hoverColor: "#c0392b",
        icon: "fas fa-arrow-up",
      },
      news: {
        bgColor: "#3498db", // Blue
        hoverColor: "#2980b9",
        icon: "fas fa-newspaper",
      },
      reviews: {
        bgColor: "#2ecc71", // Green
        hoverColor: "#27ae60",
        icon: "fas fa-star",
      },
      music: {
        bgColor: "#9b59b6", // Purple
        hoverColor: "#8e44ad",
        icon: "fas fa-music",
      },
      events: {
        bgColor: "#f39c12", // Orange
        hoverColor: "#d35400",
        icon: "fas fa-calendar-alt",
      },
    };
    this.init();
  }

  init() {
    this.createButton();
    this.setPageTheme();
    this.addEventListeners();
    this.toggleVisibility();
  }

  createButton() {
    this.button = document.createElement("button");
    this.button.id = "backToTop";
    this.button.className = "back-to-top-btn";
    this.button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    this.button.setAttribute("aria-label", "Back to top");

    // Add to body
    document.body.appendChild(this.button);
  }

  setPageTheme() {
    const currentPage = this.getCurrentPage();
    const theme = this.pageThemes[currentPage] || this.pageThemes.home;

    // REMOVE this line to prevent adding classes to body
    // document.body.classList.add(`${currentPage}-page`);

    if (this.button) {
      this.button.style.backgroundColor = theme.bgColor;
      this.button.innerHTML = `<i class="${theme.icon}"></i>`;

      // Add hover effect
      this.button.addEventListener("mouseenter", () => {
        this.button.style.backgroundColor = theme.hoverColor;
      });

      this.button.addEventListener("mouseleave", () => {
        this.button.style.backgroundColor = theme.bgColor;
      });
    }
  }

  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes("news")) return "news";
    if (path.includes("reviews")) return "reviews";
    if (path.includes("music")) return "music";
    if (path.includes("events")) return "events";
    return "home"; // Default to home
  }

  addEventListeners() {
    // Scroll event
    window.addEventListener("scroll", () => {
      this.toggleVisibility();
    });

    // Click event
    this.button.addEventListener("click", (e) => {
      e.preventDefault();
      this.scrollToTop();
    });

    // Keyboard accessibility
    this.button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.scrollToTop();
      }
    });
  }

  toggleVisibility() {
    if (!this.button) return;

    const scrollY = window.scrollY || document.documentElement.scrollTop;

    if (scrollY > this.scrollThreshold) {
      this.button.classList.add("visible");
      this.button.setAttribute("aria-hidden", "false");
    } else {
      this.button.classList.remove("visible");
      this.button.setAttribute("aria-hidden", "true");
    }
  }

  scrollToTop() {
    const scrollToTop = () => {
      const currentPosition =
        window.scrollY || document.documentElement.scrollTop;

      if (currentPosition > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, currentPosition - currentPosition / 8);
      }
    };

    scrollToTop();

    // Add a little bounce effect at the end
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 600);
  }

  // Optional: Add special effects based on page
  addSpecialEffects() {
    const page = this.getCurrentPage();

    switch (page) {
      case "music":
        // Add occasional pulse for music vibe
        setInterval(() => {
          if (this.button.classList.contains("visible")) {
            this.button.classList.add("pulse");
            setTimeout(() => {
              this.button.classList.remove("pulse");
            }, 2000);
          }
        }, 10000); // Pulse every 10 seconds when visible
        break;

      case "events":
        // Events page could have a calendar flip animation
        this.button.addEventListener("click", () => {
          this.button.style.transform = "scale(0.9) rotate(180deg)";
          setTimeout(() => {
            this.button.style.transform = "scale(1) rotate(0deg)";
          }, 300);
        });
        break;
    }
  }
}

// =========================
// GLOBAL EXPORTS AND UTILITIES
// =========================

// Export function for other pages to add their content
window.addContentToSearch = function (category, data) {
  if (window.globalSearch) {
    window.globalSearch.addContentData(category, data);
  } else {
    // Store for when globalSearch is initialized
    if (!window.pendingSearchData) window.pendingSearchData = {};
    if (!window.pendingSearchData[category])
      window.pendingSearchData[category] = [];
    window.pendingSearchData[category] =
      window.pendingSearchData[category].concat(data);
  }
};

// Helper function to extract content from current page
window.extractPageContent = function () {
  const content = {
    articles: [],
    news: [],
    reviews: [],
    music: [],
    events: [],
  };

  // Extract articles
  document
    .querySelectorAll(".sidebar-article, .side-article, .latest-article")
    .forEach((el) => {
      const title = el.querySelector("h1, h2, h3, h4")?.textContent?.trim();
      const description = el.querySelector("p")?.textContent?.trim();
      const image = el.querySelector("img")?.src;
      const url =
        el.getAttribute("onclick")?.match(/window\.open\('([^']+)'/)?.[1] ||
        "#";

      if (title) {
        content.articles.push({ title, description, image, url });
      }
    });

  // Extract music releases
  document.querySelectorAll(".release-card").forEach((el) => {
    const name = el.querySelector("h4")?.textContent?.trim();
    const artist = el.querySelector(".artist")?.textContent?.trim();
    const image = el.querySelector("img")?.src;
    const url =
      el.getAttribute("onclick")?.match(/window\.open\('([^']+)'/)?.[1] || "#";

    if (name) {
      content.music.push({ name: name, artist, image, url });
    }
  });

  // Extract events
  document.querySelectorAll(".side-article").forEach((el) => {
    const name = el.querySelector("h4")?.textContent?.trim();
    const venue = el.querySelector(".venue")?.textContent?.trim();
    const date = el.querySelector(".date")?.textContent?.trim();
    const image = el.querySelector("img")?.src;
    const url =
      el.getAttribute("onclick")?.match(/window\.open\('([^']+)'/)?.[1] || "#";

    if (name) {
      content.events.push({ name, venue, date, image, url });
    }
  });

  return content;
};

// Auto-extract content from page when loaded
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const pageContent = window.extractPageContent();
    Object.keys(pageContent).forEach((category) => {
      if (pageContent[category].length > 0) {
        window.addContentToSearch(category, pageContent[category]);
      }
    });
  }, 2000);
});

// Export for manual control if needed
window.scrollToTop = function () {
  if (window.backToTop) {
    window.backToTop.scrollToTop();
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
