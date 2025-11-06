document.addEventListener("DOMContentLoaded", () => {
  // API Configuration
  const TICKETMASTER_API_KEY = "iAABWmE3QG0CbtAOfbpfmoSCrSC7PYcb"; // Get from https://developer.ticketmaster.com/
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
                            ${event.venue?.name || "Venue TBA"}, ${
          event.location
        }
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
                        <a href="${
                          event.url
                        }" target="_blank" class="ticket-btn">
                            <i class="fas fa-ticket-alt"></i> Get Tickets
                        </a>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
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
  }

  function showError(message) {
    eventsGrid.innerHTML = `
            <div class="error">
                <p>${message}</p>
                <button onclick="loadInitialEvents()" class="retry-btn">Try Again</button>
            </div>
        `;
  }

  function updatePaginationInfo() {
    const showingCount = document.getElementById("showingCount");
    showingCount.textContent = filteredEvents.length;

    loadMoreBtn.style.display = currentPage < 4 ? "block" : "none";
  }

  // Event handlers
  async function handleGenreFilter(e) {
    document
      .querySelectorAll(".genre-filter")
      .forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");

    currentGenre = e.target.dataset.genre;
    filterEvents();
  }

  async function handleMainTabClick(e) {
    mainTabs.forEach((tab) => tab.classList.remove("active"));
    e.target.classList.add("active");

    currentCategory = e.target.dataset.category;
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

  // Initialize
  initializeGenreFilters();
  loadInitialEvents();
});
