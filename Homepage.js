document.addEventListener("DOMContentLoaded", () => {
  gsap.fromTo(
    ".exclusive-badge",
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.5 }
  );

  gsap.fromTo(
    ".hero-text",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.2, ease: "power2.out", delay: 0.8 }
  );
});
