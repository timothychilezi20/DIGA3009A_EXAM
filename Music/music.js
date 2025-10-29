// music.js
document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const contentSections = document.querySelectorAll(".music-grid");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("active"));

      // Add active class to clicked tab
      this.classList.add("active");

      // Here you would typically show/hide different content
      // based on the data-tab attribute
      const tabName = this.getAttribute("data-tab");
      console.log("Switching to tab:", tabName);
      // Add your tab content switching logic here
    });
  });
});
