// script.js - JavaScript for The Beat Report homepage

document.addEventListener("DOMContentLoaded", function () {
  // Animation for the bottom scroll items
  const scrollItems = document.querySelectorAll(".scroll-item");

  scrollItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.color = "#de3831";
      this.style.transition = "color 0.3s ease";
    });

    item.addEventListener("mouseleave", function () {
      this.style.color = "#fff";
    });
  });

  // Add hover effects to sidebar stories
  const sidebarStories = document.querySelectorAll(".sidebar-story");

  sidebarStories.forEach((story) => {
    story.addEventListener("mouseenter", function () {
      const img = this.querySelector("img");
      if (img) {
        img.style.opacity = "0.9";
        img.style.transform = "scale(1.02)";
        img.style.transition = "0.3s ease";
      }
    });

    story.addEventListener("mouseleave", function () {
      const img = this.querySelector("img");
      if (img) {
        img.style.opacity = "1";
        img.style.transform = "scale(1)";
      }
    });
  });

  // Add hover effect to exclusive container
  const exclusiveContainer = document.querySelector(".exclusive-container");
  if (exclusiveContainer) {
    exclusiveContainer.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.02)";
      this.style.transition = "transform 0.3s ease";
    });

    exclusiveContainer.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  }

  // Add click handlers for navigation
  const navLinks = document.querySelectorAll(".main-nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // In a real implementation, this would navigate to the page
      // For now, we'll just prevent default and log
      e.preventDefault();
      console.log("Navigating to:", this.getAttribute("href"));

      // Add active state
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Add animation to news items
  const newsItems = document.querySelectorAll(".news-item");

  newsItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateX(10px)";
      this.style.transition = "transform 0.3s ease";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "translateX(0)";
    });
  });

  // Initialize any GSAP animations if available
  if (typeof gsap !== "undefined") {
    // Animate sections on scroll
    gsap.utils
      .toArray(
        ".thats-whats-section, .whats-happening, .legend-section, .thatchatsi-section"
      )
      .forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
  }

  console.log("The Beat Report homepage initialized successfully");
});


