(() => {
  const syncOverlayWidth = () => {
    // Only sync on desktop, not mobile
    const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isMobile) return;

    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.project-overlay');

    if (sidebar && overlay) {
      const sidebarWidth = sidebar.offsetWidth;
      overlay.style.width = `${sidebarWidth}px`;
    }
  };

  // Sync on page load
  syncOverlayWidth();

  // Sync on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(syncOverlayWidth, 100);
  });

  // Sync when overlay becomes active (in case sidebar changed)
  const overlay = document.querySelector('.project-overlay');
  if (overlay) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          if (overlay.classList.contains('active')) {
            syncOverlayWidth();
          }
        }
      });
    });

    observer.observe(overlay, { attributes: true });
  }
})();
