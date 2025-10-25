(() => {
  // =========================
  // Image hover swap (using event delegation for infinite scroll)
  // =========================
  const container = document.querySelector('.content');

  if (container) {
    // Preload hover images
    const preloadHoverImages = () => {
      document.querySelectorAll('.hover-swap').forEach(img => {
        const hoverSrc = img.dataset.hoverSrc;
        if (hoverSrc) {
          const preloadImg = new Image();
          preloadImg.src = hoverSrc;
        }
      });
    };
    preloadHoverImages();

    // Use event delegation on the container
    container.addEventListener('mouseenter', (e) => {
      const img = e.target.closest('.hover-swap');
      if (img && img.classList.contains('hover-swap')) {
        const hoverSrc = img.dataset.hoverSrc;
        if (hoverSrc) {
          img.dataset.originalSrc = img.getAttribute('src');
          img.setAttribute('src', hoverSrc);
        }
      }
    }, true);

    container.addEventListener('mouseleave', (e) => {
      const img = e.target.closest('.hover-swap');
      if (img && img.classList.contains('hover-swap')) {
        const originalSrc = img.dataset.originalSrc;
        if (originalSrc) {
          img.setAttribute('src', originalSrc);
        }
      }
    }, true);
  }
})();
