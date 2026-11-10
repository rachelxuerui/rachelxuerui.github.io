(() => {
  const sidebar = document.querySelector('.sidebar');
  const leftOverlay = document.getElementById('project-overlay');
  const rightOverlay = document.getElementById('project-overlay-right');
  const usesSingleColumnProjectLayout = () =>
    window.matchMedia('(max-width: 899px)').matches;

  const syncOverlayWidth = () => {
    if (!sidebar || !leftOverlay) return;

    if (usesSingleColumnProjectLayout()) {
      leftOverlay.style.width = '';

      if (rightOverlay) {
        rightOverlay.style.left = '';
      }

      return;
    }

    const sidebarWidth = sidebar.offsetWidth;

    // Left overlay = sidebar width
    leftOverlay.style.width = `${sidebarWidth}px`;

    // Right overlay starts after sidebar
    if (rightOverlay) {
      rightOverlay.style.left = `${sidebarWidth}px`;
    }
  };

  // Initial sync
  syncOverlayWidth();

  // Sync on resize (debounced)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(syncOverlayWidth, 100);
  });

  // Sync when left overlay is activated
  if (leftOverlay) {
    const observer = new MutationObserver(() => {
      if (leftOverlay.classList.contains('active')) {
        syncOverlayWidth();
      }
    });

    observer.observe(leftOverlay, { attributes: true });
  }
})();
