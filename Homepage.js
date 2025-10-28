document.addEventListener("DOMContentLoaded", () => {
  // Animate the "Exclusive" label sliding in from top-left
  gsap.from(".exclusive-label", {
    opacity: 0,
    x: -30, // start slightly to the left
    y: -20, // start slightly above
    duration: 1,
    ease: "power2.out",
    delay: 0.3,
  });

  // Animate the text block fading in from below
  gsap.from(".hero-text", {
    opacity: 0,
    y: 30, // start below
    duration: 1.2,
    ease: "power2.out",
    delay: 0.6,
  });
});
