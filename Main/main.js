// Main JavaScript - The Beat Report
// Persistent Login System & Global Functionality

console.log("main.js loaded successfully");

// ===== GLOBAL VARIABLES =====
let currentUser = null;
const VALID_CREDENTIALS = {
  username: "admin",
  password: "password123",
};

// Global search content storage
window.searchContent = {
  articles: [],
  news: [],
  reviews: [],
  music: [],
  events: [],
  charts: [],
  pages: [],
};

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  initMainFunctionality();
});

function initMainFunctionality() {
  console.log("Initializing main functionality...");

  // Check if user is already logged in
  checkExistingLogin();

  // Initialize all components
  initSearch();
  initLogin();
  initFeedback();
  initBackToTop();
  initLoadingScreen();
  initNavigation();
  initModals();

  console.log("✓ Main functionality initialized");
}

// ===== PERSISTENT LOGIN SYSTEM =====

function checkExistingLogin() {
  const savedUser = localStorage.getItem("beatReportUser");
  const loginTime = localStorage.getItem("beatReportLoginTime");

  if (savedUser && loginTime) {
    const loginTimestamp = parseInt(loginTime);
    const currentTime = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (currentTime - loginTimestamp < twentyFourHours) {
      currentUser = savedUser;
      updateUIForLoggedInUser();
      console.log("✓ User automatically logged in:", currentUser);
    } else {
      clearLoginData();
      console.log("Login session expired");
    }
  }
}

function initLogin() {
  const loginText = document.getElementById("loginText");
  const userIcon = document.getElementById("userIcon");
  const loginModal = document.getElementById("loginModal");
  const loginForm = document.getElementById("loginForm");
  const closeModal = document.querySelector("#loginModal .close");

  if (!loginText || !loginModal) {
    console.log("Login elements not found on this page");
    return;
  }

  console.log("✓ Login functionality initialized");

  // Login text click handler
  loginText.addEventListener("click", function () {
    if (currentUser) {
      showLogoutOption();
    } else {
      loginModal.style.display = "flex";
    }
  });

  // User icon click handler
  if (userIcon) {
    userIcon.addEventListener("click", function () {
      showLogoutOption();
    });
  }

  // Close modal handler
  if (closeModal) {
    closeModal.addEventListener("click", function () {
      loginModal.style.display = "none";
    });
  }

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleLogin();
    });
  }
}

function handleLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const loginMessage = document.querySelector(".login-message");

  console.log("Login attempt:", username);

  if (!username || !password) {
    showLoginMessage("Please enter both username and password", "error");
    return;
  }

  if (
    username === VALID_CREDENTIALS.username &&
    password === VALID_CREDENTIALS.password
  ) {
    currentUser = username;

    // Save to localStorage
    const loginTime = new Date().getTime();
    localStorage.setItem("beatReportUser", currentUser);
    localStorage.setItem("beatReportLoginTime", loginTime.toString());

    // Update UI
    updateUIForLoggedInUser();

    // Close modal and show success
    document.getElementById("loginModal").style.display = "none";
    showLoginMessage("Login successful! Welcome back.", "success");

    // Clear form
    document.getElementById("loginForm").reset();

    console.log("✓ User logged in successfully:", currentUser);
  } else {
    showLoginMessage("Invalid username or password", "error");
    console.log("✗ Login failed for user:", username);
  }
}

function handleLogout() {
  clearLoginData();
  updateUIForLoggedOutUser();
  showLoginMessage("You have been logged out successfully", "success");
  console.log("✓ User logged out");
}

function clearLoginData() {
  currentUser = null;
  localStorage.removeItem("beatReportUser");
  localStorage.removeItem("beatReportLoginTime");
}

function updateUIForLoggedInUser() {
  const loginText = document.getElementById("loginText");
  const userIcon = document.getElementById("userIcon");

  if (loginText) {
    loginText.textContent = currentUser;
    loginText.style.fontWeight = "600";
    loginText.style.color = "#007847";
  }

  if (userIcon) {
    userIcon.style.display = "block";
    userIcon.title = `Logged in as ${currentUser} (Click to logout)`;
  }
}

function updateUIForLoggedOutUser() {
  const loginText = document.getElementById("loginText");
  const userIcon = document.getElementById("userIcon");

  if (loginText) {
    loginText.textContent = "Login";
    loginText.style.fontWeight = "600";
    loginText.style.color = "#111";
  }

  if (userIcon) {
    userIcon.style.display = "none";
  }
}

function showLogoutOption() {
  if (confirm(`Do you want to logout of ${currentUser}?`)) {
    handleLogout();
  }
}

function showLoginMessage(message, type) {
  const loginMessage = document.querySelector(".login-message");
  if (loginMessage) {
    loginMessage.textContent = message;
    loginMessage.style.color = type === "error" ? "#e74c3c" : "#27ae60";
    loginMessage.style.fontWeight = "600";

    setTimeout(() => {
      loginMessage.textContent = "";
    }, 3000);
  }
}

// ===== SEARCH FUNCTIONALITY =====

function initSearch() {
  const searchIcon = document.getElementById("searchIcon");
  const searchBar = document.getElementById("searchBar");

  if (!searchIcon || !searchBar) {
    console.log("Search elements not found on this page");
    return;
  }

  console.log("✓ Search functionality initialized");

  searchIcon.addEventListener("click", function () {
    searchBar.classList.toggle("active");
    if (searchBar.classList.contains("active")) {
      searchBar.focus();
    }
  });

  // Close search when clicking outside
  document.addEventListener("click", function (event) {
    if (
      !event.target.closest(".search-wrapper") &&
      searchBar.classList.contains("active")
    ) {
      searchBar.classList.remove("active");
    }
  });

  // Search functionality
  searchBar.addEventListener("input", function () {
    performSearch(this.value);
  });

  // Enter key to search
  searchBar.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      performGlobalSearch(this.value);
    }
  });
}

function performSearch(query) {
  if (query.length > 2) {
    console.log("Searching for:", query);
    // Basic search implementation
    const results = window.performGlobalSearch(query);
    displaySearchResults(results, query);
  } else {
    hideSearchResults();
  }
}

function performGlobalSearch(query) {
  if (query.length < 2) return [];

  const results = [];
  const searchTerms = query.toLowerCase().split(" ");

  Object.keys(window.searchContent).forEach((category) => {
    window.searchContent[category].forEach((item) => {
      const searchableText = (
        item.title +
        " " +
        (item.description || "") +
        " " +
        (item.content || "") +
        " " +
        (item.artist || "") +
        " " +
        (item.venue || "") +
        " " +
        (item.genre || "")
      ).toLowerCase();

      const allTermsFound = searchTerms.every((term) =>
        searchableText.includes(term)
      );

      if (allTermsFound) {
        results.push({
          ...item,
          category: category,
        });
      }
    });
  });

  console.log(`Global search for "${query}" found ${results.length} results`);
  return results;
}

function displaySearchResults(results, query) {
  // Remove existing results if any
  const existingResults = document.getElementById("globalSearchResults");
  if (existingResults) {
    existingResults.remove();
  }

  if (results.length === 0) {
    return;
  }

  // Create results container
  const resultsContainer = document.createElement("div");
  resultsContainer.id = "globalSearchResults";
  resultsContainer.className = "global-search-results";

  // Create results header
  const headerHTML = `
        <div class="search-results-header">
            <h2><i class="fas fa-search"></i> Search Results for "${query}"</h2>
            <button class="clear-search-btn" onclick="hideSearchResults()">
                <i class="fas fa-times"></i> Clear
            </button>
        </div>
    `;

  // Group results by category
  const resultsByCategory = {};
  results.forEach((result) => {
    if (!resultsByCategory[result.category]) {
      resultsByCategory[result.category] = [];
    }
    resultsByCategory[result.category].push(result);
  });

  // Create results content
  let contentHTML = '<div class="search-results-content">';

  Object.keys(resultsByCategory).forEach((category) => {
    const categoryResults = resultsByCategory[category];
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

    contentHTML += `
            <div class="search-category-section">
                <h3>${categoryName} (${categoryResults.length})</h3>
                <div class="search-category-grid ${category}-grid">
        `;

    categoryResults.forEach((item) => {
      contentHTML += `
                <div class="search-result-item" onclick="window.location.href='${
                  item.url
                }'">
                    ${
                      item.image
                        ? `<img src="${item.image}" alt="${item.title}">`
                        : ""
                    }
                    <div class="search-item-content">
                        <h4>${item.title}</h4>
                        <p>${item.description || ""}</p>
                        ${
                          item.artist
                            ? `<p class="search-artist">${item.artist}</p>`
                            : ""
                        }
                        ${
                          item.date
                            ? `<p class="search-date">${item.date}</p>`
                            : ""
                        }
                        ${
                          item.venue
                            ? `<p class="search-venue">${item.venue}</p>`
                            : ""
                        }
                    </div>
                </div>
            `;
    });

    contentHTML += `
                </div>
            </div>
        `;
  });

  contentHTML += "</div>";

  resultsContainer.innerHTML = headerHTML + contentHTML;

  // Insert after main content or at the end of body
  const mainContent = document.querySelector("main") || document.body;
  mainContent.parentNode.insertBefore(
    resultsContainer,
    mainContent.nextSibling
  );

  // Smooth scroll to results
  resultsContainer.scrollIntoView({ behavior: "smooth" });
}

function hideSearchResults() {
  const existingResults = document.getElementById("globalSearchResults");
  if (existingResults) {
    existingResults.remove();
  }

  // Clear search bar
  const searchBar = document.getElementById("searchBar");
  if (searchBar) {
    searchBar.value = "";
    searchBar.classList.remove("active");
  }
}

// Global function to add content to search
window.addContentToSearch = function (category, items) {
  if (window.searchContent[category]) {
    window.searchContent[category] =
      window.searchContent[category].concat(items);
    console.log(`✓ Added ${items.length} items to ${category} search`);
  }
};

// ===== FEEDBACK FUNCTIONALITY =====

function initFeedback() {
  const feedbackButton = document.getElementById("feedbackButton");
  const feedbackModal = document.getElementById("feedbackModal");
  const closeFeedback = document.getElementById("closeFeedback");
  const sendFeedback = document.getElementById("sendFeedback");

  if (!feedbackButton || !feedbackModal) {
    console.log("Feedback elements not found on this page");
    return;
  }

  console.log("✓ Feedback functionality initialized");

  feedbackButton.addEventListener("click", function () {
    feedbackModal.style.display = "flex";
  });

  if (closeFeedback) {
    closeFeedback.addEventListener("click", function () {
      feedbackModal.style.display = "none";
    });
  }

  // Click outside to close
  window.addEventListener("click", function (event) {
    if (event.target === feedbackModal) {
      feedbackModal.style.display = "none";
    }
  });

  // Send feedback
  if (sendFeedback) {
    sendFeedback.addEventListener("click", function () {
      const feedbackText = document.getElementById("feedbackText").value;
      const feedbackMessage = document.getElementById("feedbackMessage");

      if (feedbackText.trim() === "") {
        if (feedbackMessage) {
          feedbackMessage.textContent = "Please enter your feedback";
          feedbackMessage.style.color = "#e74c3c";
        }
        return;
      }

      // Simulate sending feedback
      if (feedbackMessage) {
        feedbackMessage.textContent = "Thank you for your feedback!";
        feedbackMessage.style.color = "#27ae60";
      }

      console.log("Feedback submitted:", feedbackText);

      // Clear and close after 2 seconds
      setTimeout(() => {
        document.getElementById("feedbackText").value = "";
        feedbackModal.style.display = "none";
        if (feedbackMessage) {
          feedbackMessage.textContent = "";
        }
      }, 2000);
    });
  }
}

// ===== BACK TO TOP FUNCTIONALITY =====

function initBackToTop() {
  // Create back to top button if it doesn't exist
  if (!document.getElementById("backToTop")) {
    const backToTopBtn = document.createElement("button");
    backToTopBtn.id = "backToTop";
    backToTopBtn.className = "back-to-top-btn";
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.title = "Back to Top";
    document.body.appendChild(backToTopBtn);

    console.log("✓ Back to top button created");
  }

  const backToTopBtn = document.getElementById("backToTop");

  // Show/hide button based on scroll position
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  // Scroll to top when clicked
  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ===== LOADING SCREEN FUNCTIONALITY =====

function initLoadingScreen() {
  const websiteLoader = document.getElementById("websiteLoader");
  const mainContent = document.getElementById("mainContent");

  if (!websiteLoader || !mainContent) {
    console.log("Loading screen elements not found on this page");
    return;
  }

  console.log("✓ Loading screen functionality initialized");

  // Simulate loading process
  const progressFill = document.querySelector(".progress-fill");
  let progress = 0;

  const loadingInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;

    if (progressFill) {
      progressFill.style.width = progress + "%";
    }

    if (progress >= 100) {
      clearInterval(loadingInterval);
      setTimeout(() => {
        websiteLoader.style.display = "none";
        mainContent.style.display = "block";
        console.log("✓ Loading complete, main content revealed");
      }, 500);
    }
  }, 200);
}

// ===== NAVIGATION FUNCTIONALITY =====

function initNavigation() {
  console.log("✓ Navigation functionality initialized");

  // Set active navigation based on current page
  setActiveNavigation();

  // Add hover effects to navigation items
  const navItems = document.querySelectorAll(
    ".main-nav a, .news-nav a, .reviews-nav a, .music-nav a, .events-nav a, .contact-nav a"
  );
  navItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transition = "all 0.3s ease";
    });
  });
}

function setActiveNavigation() {
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (
      linkHref === currentPage ||
      (currentPage === "" && linkHref === "index.html")
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// ===== MODAL MANAGEMENT =====

function initModals() {
  console.log("✓ Modal management initialized");

  // Close modals with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllModals();
    }
  });
}

function closeAllModals() {
  const modals = document.querySelectorAll(".modal, .feedback-modal");
  modals.forEach((modal) => {
    modal.style.display = "none";
  });
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format date function
window.formatDate = function (dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Truncate text function
window.truncateText = function (text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
};

// ===== GLOBAL EXPORTS =====

// Make functions globally accessible
window.mainFunctions = {
  getCurrentUser: () => currentUser,
  isLoggedIn: () => currentUser !== null,
  logout: handleLogout,
  performSearch: performGlobalSearch,
  hideSearchResults: hideSearchResults,
  formatDate: window.formatDate,
  truncateText: window.truncateText,
};

// Global login state checker
window.isUserLoggedIn = function () {
  return currentUser !== null;
};

// Global user info getter
window.getCurrentUserInfo = function () {
  return currentUser;
};

console.log("✓ main.js setup complete - All systems ready");
console.log(
  "Available global functions: mainFunctions, addContentToSearch, performGlobalSearch"
);

// Sample content for search (can be removed when real content is added)
window.addEventListener("load", function () {
  // Add sample content to search index
  const sampleContent = [
    {
      title: "Welcome to The Beat Report",
      description:
        "South Africa's premier music news source featuring the latest in music, reviews, and events.",
      url: "index.html",
      category: "pages",
    },
    {
      title: "Contact Us",
      description:
        "Get in touch with The Beat Report team for music submissions, event coverage, and partnerships.",
      url: "contact/contact.html",
      category: "pages",
    },
  ];

  window.addContentToSearch("pages", sampleContent);
});
