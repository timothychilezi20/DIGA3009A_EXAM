// data.js - Pre-defined album database
const albumDatabase = {
  Tyla: [
    {
      title: "Water",
      year: 2023,
      genre: "Pop",
      summary: "Tyla's breakthrough single that took the world by storm...",
      rating: 4.8,
    },
    {
      title: "Getting Late",
      year: 2023,
      genre: "Pop",
      summary: "A smooth R&B infused track showcasing Tyla's vocal range...",
      rating: 4.5,
    },
  ],
  "Kabza De Small": [
    {
      title: "KOA II Part 1",
      year: 2022,
      genre: "Amapiano",
      summary: "The Piano King returns with another masterpiece...",
      rating: 4.7,
    },
  ],
  // ... Add 100+ more artists and albums
};

// Export for use in main script
if (typeof module !== "undefined" && module.exports) {
  module.exports = { albumDatabase };
}
