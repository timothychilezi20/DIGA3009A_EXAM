// Homepage.js - FIXED VERSION
console.log("Homepage script loading...");

document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM fully loaded, initializing homepage...");
  
  // Immediately show the main content (bypass loader)
  const mainContent = document.getElementById('mainContent');
  const websiteLoader = document.getElementById('websiteLoader');
  
  if (mainContent) {
    mainContent.style.display = 'block';
  }
  if (websiteLoader) {
    websiteLoader.style.display = 'none';
  }
  
  // Populate with fallback data immediately
  populateWithFallbackData();
});

function populateWithFallbackData() {
  console.log("Populating with fallback data...");
  
  // Left Sidebar
  const leftSidebar = document.querySelector('.left-sidebar');
  if (leftSidebar) {
    leftSidebar.innerHTML = `
      <article class="sidebar-article">
        <h3>Taylor Swift Announces New World Tour</h3>
        <p>Global superstar reveals massive stadium tour spanning 5 continents with surprise collaborations.</p>
        <p><strong>MUSIC GLOBE</strong></p>
      </article>
      <article class="sidebar-article">
        <h3>Spotify Reveals 2024 Streaming Records</h3>
        <p>Bad Bunny maintains top spot while new artists break into global charts.</p>
        <p><strong>STREAMING REPORT</strong></p>
      </article>
      <article class="sidebar-article">
        <h3>Coachella 2025 Lineup Announced</h3>
        <p>Legendary bands and breakthrough artists set for iconic festival.</p>
        <p><strong>FESTIVAL NEWS</strong></p>
      </article>
    `;
  }
  
  // Exclusive Section
  const exclusiveSection = document.querySelector('.exclusive-container');
  if (exclusiveSection) {
    exclusiveSection.innerHTML = `
      <div class="exclusive-image">
        <img src="images/music-default.jpg" alt="Exclusive News">
        <span class="exclusive-label">GLOBAL EXCLUSIVE</span>
      </div>
      <div class="exclusive-text">
        <h1>Amapiano Takes Over Global Charts</h1>
        <p>South African sound dominates international streaming platforms with record-breaking numbers.</p>
      </div>
    `;
  }
  
  // Right Sidebar
  const rightSidebar = document.querySelector('.right-sidebar');
  if (rightSidebar) {
    rightSidebar.innerHTML = `
      <section class="sidebar-section">
        <div class="sidebar-story">
          <img src="images/music-default.jpg" alt="Trending News">
          <h4>TRENDING GLOBALLY</h4>
          <h3>Vinyl Sales Continue Record Growth</h3>
          <p><strong>MUSIC BUSINESS</strong></p>
        </div>
      </section>
    `;
  }
  
  // Featured Latest
  const featuredLatest = document.querySelector('.featured-latest');
  if (featuredLatest) {
    featuredLatest.innerHTML = `
      <img src="images/music-default.jpg" alt="Featured News">
      <div class="latest-text">
        <h3>New Music Festival Coming to Cape Town</h3>
        <p>Major international artists announced for South Africa's newest music festival event.</p>
        <span class="author">By Music Globe</span>
      </div>
    `;
  }
  
  console.log("Fallback data populated successfully");
}