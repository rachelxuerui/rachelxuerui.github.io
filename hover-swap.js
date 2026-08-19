(() => {
  // =========================
  // Image hover swap (using event delegation for infinite scroll)
  // =========================
  const container = document.querySelector('.content');

  if (container) {
    const hoverDelay =
      parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--hover-delay')
      ) || 100;
    const swapTimers = new WeakMap();

    const clearSwapTimer = (img) => {
      const timer = swapTimers.get(img);

      if (timer) {
        clearTimeout(timer);
        swapTimers.delete(img);
      }
    };

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
      if (img) {
        const hoverSrc = img.dataset.hoverSrc;
        if (hoverSrc) {
          clearSwapTimer(img);

          const timer = setTimeout(() => {
            img.dataset.originalSrc = img.getAttribute('src');
            img.setAttribute('src', hoverSrc);
            swapTimers.delete(img);
          }, hoverDelay);

          swapTimers.set(img, timer);
        }
      }
    }, true);

    container.addEventListener('mouseleave', (e) => {
      const img = e.target.closest('.hover-swap');
      if (img) {
        clearSwapTimer(img);

        const originalSrc = img.dataset.originalSrc;
        if (originalSrc) {
          img.setAttribute('src', originalSrc);
        }
      }
    }, true);
  }
})();
