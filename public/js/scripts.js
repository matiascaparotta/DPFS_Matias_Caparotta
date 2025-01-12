document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const menuOverlay = document.querySelector(".menu-overlay");

  if (hamburger && menuOverlay) {
    hamburger.addEventListener("click", () => {
      menuOverlay.classList.toggle("show");
    });
  }
});