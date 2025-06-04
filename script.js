// Simple scroll reveal animation
window.addEventListener("scroll", () => {
  document.querySelectorAll("section").forEach((sec) => {
    const top = window.scrollY;
    const offset = sec.offsetTop - 200;
    const height = sec.offsetHeight;
    if (top > offset && top < offset + height) {
      sec.style.opacity = 1;
      sec.style.transform = "translateY(0)";
    }
  });
});
