document.addEventListener("DOMContentLoaded", () => {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // API Configuration
  const TICKETMASTER_API_KEY = "iAABWmE3QG0CbtAOfbpfmoSCrSC7PYcb";
  const TICKETMASTER_BASE_URL =
    "https://app.ticketmaster.com/discovery/v2/events.json";

  // Elements
  const eventsGrid = document.getElementById("eventsGrid");
  const mainTabs = document.querySelectorAll(".main-tab");
  const genreFiltersContainer = document.querySelector(".genre-filters");
  const locationSelect = document.getElementById("locationSelect");
  const dateSelect = document.getElementById("dateSelect");
  const loadMoreBtn = document.getElementById("loadMore");
  const searchBar = document.getElementById("searchBar");

  // State
  let allEvents = [];
  let filteredEvents = [];
  let currentPage = 0;
  let currentCategory = "upcoming";
  let currentGenre = "all";
  let currentLocation = "ZA";
  let currentDateFilter = "all";
  let isLoading = false;

  // Music genre mapping for Ticketmaster
  const musicGenres = {
    all: "All Genres",
    KnK: "Hip-Hop/Rap",
    "R&B": "R&B",
    Jazz: "Jazz",
    Rock: "Rock",
    Country: "Country",
    Folk: "Folk",
    Blues: "Blues",
    Classical: "Classical",
    Electronic: "Electronic",
    Reggae: "Reggae",
    Pop: "Pop",
    Alternative: "Alternative",
    Metal: "Metal",
    Soul: "Soul",
    Funk: "Funk",
    Gospel: "Gospel",
    World: "World Music",
  };

  // === GSAP ANIMATIONS ===
  function initializePageAnimations() {
    // Animation 1: Page load sequence
    const tl = gsap.timeline();

    tl.fromTo(
      ".section-title",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    )
      .fromTo(
        ".main-tabs .main-tab",
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.3"
      )
      .fromTo(
        ".filters-section",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.2"
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

  // Animation 2: Staggered event cards animation
  function animateEventCards() {
    const cards = eventsGrid.querySelectorAll(".event-card");

    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 40,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
        onComplete: function () {
          // Add hover animations after initial load
          cards.forEach((card) => {
            card.addEventListener("mouseenter", () => {
              gsap.to(card, {
                scale: 1.03,
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

  // Animation 3: Filter section interactions
  function initializeFilterAnimations() {
    // Animate filter buttons on hover
    const filterButtons = document.querySelectorAll(".genre-filter, .main-tab");

    filterButtons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.2,
          ease: "power2.out",
        });
      });

      button.addEventListener("mouseleave", () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      });
    });

    // Animate filter changes
    const filterElements = document.querySelectorAll(
      ".location-select, .date-select"
    );
    filterElements.forEach((element) => {
      element.addEventListener("change", () => {
        gsap.to(element, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        });
      });
    });
  }

  // Animation 4: Search bar animation
  function initializeSearchAnimation() {
    const searchWrapper = document.querySelector(".search-wrapper");
    const searchIcon = document.getElementById("searchIcon");

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
    const loadingElement = eventsGrid.querySelector(".loading");
    if (loadingElement) {
      gsap.fromTo(
        loadingElement,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
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
        scale: 1.05,
        opacity: 1,
        duration: 0.3,
        ease: "back.out(1.7)",
      })
      .to(newActiveTab, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
  }

  // Initialize genre filters
  function initializeGenreFilters() {
    genreFiltersContainer.innerHTML = "";

    Object.entries(musicGenres).forEach(([genreId, genreName]) => {
      const button = document.createElement("button");
      button.className = `genre-filter ${genreId === "all" ? "active" : ""}`;
      button.dataset.genre = genreId;
      button.textContent = genreName;
      button.addEventListener("click", handleGenreFilter);
      genreFiltersContainer.appendChild(button);
    });
  }

  // Fetch events from Ticketmaster API
  async function fetchEvents(page = 0) {
    isLoading = true;
    showLoading();

    try {
      const params = new URLSearchParams({
        apikey: TICKETMASTER_API_KEY,
        countryCode: "ZA",
        classificationName: "Music",
        size: "20",
        page: page.toString(),
        sort: "date,asc",
      });

      // Add location filter
      if (currentLocation !== "ZA") {
        params.append("city", currentLocation);
      }

      // Add date filters
      if (currentDateFilter !== "all") {
        const dateRange = getDateRange(currentDateFilter);
        if (dateRange.start) params.append("startDateTime", dateRange.start);
        if (dateRange.end) params.append("endDateTime", dateRange.end);
      }

      const response = await fetch(`${TICKETMASTER_BASE_URL}?${params}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data._embedded && data._embedded.events) {
        const events = data._embedded.events.map(processEventData);
        return {
          events: events,
          totalPages: data.page?.totalPages || 0,
          currentPage: data.page?.number || 0,
        };
      } else {
        return { events: [], totalPages: 0, currentPage: 0 };
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      showError("Failed to load events. Please try again.");
      return { events: [], totalPages: 0, currentPage: 0 };
    } finally {
      isLoading = false;
    }
  }

  // Process event data from API
  function processEventData(eventData) {
    const genre = eventData.classifications?.[0]?.genre?.name || "Music";
    const subGenre = eventData.classifications?.[0]?.subGenre?.name || "";

    return {
      id: eventData.id,
      name: eventData.name,
      url: eventData.url,
      images: eventData.images,
      dates: eventData.dates,
      classifications: eventData.classifications,
      _embedded: eventData._embedded,
      priceRange: eventData.priceRanges?.[0],
      genre: genre,
      subGenre: subGenre,
      venue: eventData._embedded?.venues?.[0],
      location: eventData._embedded?.venues?.[0]?.city?.name || "South Africa",
    };
  }

  // Filter events based on current filters
  function filterEvents() {
    filteredEvents = allEvents.filter((event) => {
      // Genre filter
      if (currentGenre !== "all" && event.genre !== currentGenre) {
        return false;
      }

      // Category filter (simplified for demo)
      if (
        currentCategory === "festivals" &&
        !event.name.toLowerCase().includes("festival")
      ) {
        return false;
      }

      if (
        currentCategory === "concerts" &&
        event.name.toLowerCase().includes("festival")
      ) {
        return false;
      }

      // Location filter
      if (currentLocation !== "ZA" && event.location !== currentLocation) {
        return false;
      }

      // Search filter
      const searchTerm = searchBar.value.toLowerCase();
      if (searchTerm && !event.name.toLowerCase().includes(searchTerm)) {
        return false;
      }

      return true;
    });

    displayEvents(filteredEvents);
    updatePaginationInfo();
  }

  // Display events in grid
  function displayEvents(events) {
    if (events.length === 0) {
      eventsGrid.innerHTML = `
        <div class="error">
          <p>No events found matching your criteria.</p>
          <button onclick="loadInitialEvents()" class="retry-btn">Try Again</button>
        </div>
      `;
      // Animate error state
      gsap.fromTo(
        eventsGrid.querySelector(".error"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
      return;
    }

    eventsGrid.innerHTML = events
      .map(
        (event) => `
        <div class="event-card">
          <div class="event-image">
            <img src="${getEventImage(event.images)}" alt="${
          event.name
        }" onerror="this.src='https://via.placeholder.com/400x225/002395/FFFFFF?text=Event+Image'">
            <div class="event-badges">
              <span class="date-badge">${formatEventDate(
                event.dates.start.localDate
              )}</span>
              <span class="genre-badge">${event.genre}</span>
            </div>
          </div>
          <div class="event-info">
            <h3 class="event-title">${event.name}</h3>
            <div class="event-meta">
              <div class="event-date">
                <i class="fas fa-calendar"></i>
                ${formatEventDateTime(event.dates.start)}
              </div>
              <div class="event-venue">
                <i class="fas fa-map-marker-alt"></i>
                ${event.venue?.name || "Venue TBA"}, ${event.location}
              </div>
              ${
                event.priceRange
                  ? `
              <div class="event-price">
                <i class="fas fa-tag"></i>
                R${event.priceRange.min} - R${event.priceRange.max}
              </div>
              `
                  : ""
              }
            </div>
            <div class="event-actions">
              <a href="${event.url}" target="_blank" class="ticket-btn">
                <i class="fas fa-ticket-alt"></i> Get Tickets
              </a>
            </div>
          </div>
        </div>
      `
      )
      .join("");

    // Animate the event cards
    animateEventCards();
  }

  // Helper functions
  function getEventImage(images) {
    const image =
      images?.find((img) => img.width === 640 && img.height === 360) ||
      images?.find((img) => img.width === 1024 && img.height === 576) ||
      images?.[0];
    return (
      image?.url ||
      "https://via.placeholder.com/400x225/002395/FFFFFF?text=Event+Image"
    );
  }

  function formatEventDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
  }

  function formatEventDateTime(dateInfo) {
    const date = new Date(
      dateInfo.localDate + (dateInfo.localTime ? "T" + dateInfo.localTime : "")
    );
    return date.toLocaleDateString("en-ZA", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: dateInfo.localTime ? "2-digit" : undefined,
      minute: dateInfo.localTime ? "2-digit" : undefined,
    });
  }

  function getDateRange(filter) {
    const now = new Date();
    switch (filter) {
      case "week":
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + 7);
        return { start: now.toISOString(), end: nextWeek.toISOString() };
      case "month":
        const nextMonth = new Date(now);
        nextMonth.setMonth(now.getMonth() + 1);
        return { start: now.toISOString(), end: nextMonth.toISOString() };
      case "next-month":
        const startNextMonth = new Date(now);
        startNextMonth.setMonth(now.getMonth() + 1);
        const endNextMonth = new Date(startNextMonth);
        endNextMonth.setMonth(startNextMonth.getMonth() + 1);
        return {
          start: startNextMonth.toISOString(),
          end: endNextMonth.toISOString(),
        };
      default:
        return { start: null, end: null };
    }
  }

  function showLoading() {
    eventsGrid.innerHTML = `
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading South African music events...</p>
      </div>
    `;
    animateLoadingState();
  }

  function showError(message) {
    eventsGrid.innerHTML = `
      <div class="error">
        <p>${message}</p>
        <button onclick="loadInitialEvents()" class="retry-btn">Try Again</button>
      </div>
    `;
    // Animate error state
    gsap.fromTo(
      eventsGrid.querySelector(".error"),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 }
    );
  }

  function updatePaginationInfo() {
    const showingCount = document.getElementById("showingCount");
    showingCount.textContent = filteredEvents.length;

    loadMoreBtn.style.display = currentPage < 4 ? "block" : "none";

    // Animate load more button if shown
    if (loadMoreBtn.style.display === "block") {
      gsap.fromTo(
        loadMoreBtn,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    }
  }

  // Event handlers
  async function handleGenreFilter(e) {
    const oldActive = document.querySelector(".genre-filter.active");
    const newActive = e.target;

    // Animate the filter change
    if (oldActive !== newActive) {
      animateTabSwitch(oldActive, newActive);
    }

    document
      .querySelectorAll(".genre-filter")
      .forEach((btn) => btn.classList.remove("active"));
    newActive.classList.add("active");

    currentGenre = newActive.dataset.genre;
    filterEvents();
  }

  async function handleMainTabClick(e) {
    const oldActive = document.querySelector(".main-tab.active");
    const newActive = e.target;

    // Animate tab switch
    if (oldActive !== newActive) {
      animateTabSwitch(oldActive, newActive);
    }

    mainTabs.forEach((tab) => tab.classList.remove("active"));
    newActive.classList.add("active");

    currentCategory = newActive.dataset.category;
    await loadInitialEvents();
  }

  async function handleLocationChange() {
    currentLocation = locationSelect.value;
    await loadInitialEvents();
  }

  async function handleDateChange() {
    currentDateFilter = dateSelect.value;
    await loadInitialEvents();
  }

  async function handleSearch() {
    filterEvents();
  }

  async function handleLoadMore() {
    currentPage++;
    const result = await fetchEvents(currentPage);
    allEvents = [...allEvents, ...result.events];
    filterEvents();
  }

  // Initial load
  async function loadInitialEvents() {
    currentPage = 0;
    const result = await fetchEvents(currentPage);
    allEvents = result.events;
    filterEvents();
  }

  // Event listeners
  mainTabs.forEach((tab) => tab.addEventListener("click", handleMainTabClick));
  locationSelect.addEventListener("change", handleLocationChange);
  dateSelect.addEventListener("change", handleDateChange);
  searchBar.addEventListener("input", handleSearch);
  loadMoreBtn.addEventListener("click", handleLoadMore);

  // Search functionality
  const searchIcon = document.getElementById("searchIcon");
  searchIcon.addEventListener("click", () => {
    searchBar.style.display =
      searchBar.style.display === "none" ? "block" : "none";
    if (searchBar.style.display === "block") {
      searchBar.focus();
    }
  });

  // Make functions global
  window.loadInitialEvents = loadInitialEvents;
  window.handleLoadMore = handleLoadMore;

  // Initialize everything
  initializePageAnimations();
  initializeGenreFilters();
  initializeFilterAnimations();
  initializeSearchAnimation();
  loadInitialEvents();
});
