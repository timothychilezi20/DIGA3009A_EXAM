// === Search Toggle ===
const searchIcon = document.getElementById("searchIcon");
const searchBar = document.getElementById("searchBar");

searchIcon.addEventListener("click", () => {
  searchBar.classList.toggle("active");
  searchBar.focus(); // optional: focuses input immediately
});

// === Login Modal ===
const loginText = document.getElementById("loginText");
const userIcon = document.getElementById("userIcon");

// Example: open login modal when clicking "Login"
loginText.addEventListener("click", () => {
  document.getElementById("loginModal").style.display = "flex";
});

// Example: handle login form submission
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Simulate successful login
  loginText.style.display = "none";
  userIcon.style.display = "inline-block";

  // Close login modal
  document.getElementById("loginModal").style.display = "none";
});

// === Feedback Bar ===
const feedbackButton = document.getElementById("feedbackButton");
const feedbackModal = document.getElementById("feedbackModal");
const closeFeedback = document.getElementById("closeFeedback");

feedbackButton.addEventListener("click", () => {
  feedbackModal.style.display = "flex";
});

closeFeedback.addEventListener("click", () => {
  feedbackModal.style.display = "none";
});

// Optional: close modal if clicked outside
window.addEventListener("click", (e) => {
  if (e.target === feedbackModal) {
    feedbackModal.style.display = "none";
  }
});
