const apiKey = "a5b595dc505090efa6ae086f2b1b38c6"; // Replace with your actual key
const newsContainer = document.getElementById("news-container");

async function fetchNews() {
  try {
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=south%20african%20music&lang=en&country=za&max=9&apikey=${apiKey}`
    );

    if (!response.ok) throw new Error("Failed to fetch news");
    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      newsContainer.innerHTML = "<p>No recent articles found.</p>";
      return;
    }

    newsContainer.innerHTML = data.articles
      .map(
        (article) => `
        <div class="news-card">
          <img src="${
            article.image || "../images/fallback.jpg"
          }" alt="News Image">
          <div class="news-card-content">
            <h3>${article.title}</h3>
            <p>${article.description || "No description available."}</p>
            <a href="${article.url}" target="_blank">Read more</a>
          </div>
        </div>
      `
      )
      .join("");
  } catch (err) {
    console.error("Error loading news:", err);
    newsContainer.innerHTML =
      "<p>Unable to load news at the moment. Please try again later.</p>";
  }
}

// Fetch on page load
fetchNews();

// Optional: refresh every 5 minutes
setInterval(fetchNews, 5 * 60 * 1000);
