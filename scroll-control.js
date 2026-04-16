(() => {
  // =========================
  // Prevent content scroll when hovering over images
  // =========================
  const content = document.querySelector('.content');
  if (!content) return;

  let isHoveringImage = false;

  // Add hover listeners to all images and videos in content
  function setupHoverListeners() {
    const media = content.querySelectorAll('.cell img, .cell video');

    media.forEach(element => {
      element.addEventListener('mouseenter', () => {
        isHoveringImage = true;
      });

      element.addEventListener('mouseleave', () => {
        isHoveringImage = false;
      });
    });
  }

  // Prevent scrolling on content when hovering over images
  content.addEventListener('wheel', (e) => {
    if (isHoveringImage) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, { passive: false });

  // Initialize hover listeners
  setupHoverListeners();

  // Re-setup listeners when new content is added (for infinite scroll)
  const observer = new MutationObserver(() => {
    setupHoverListeners();
  });

  observer.observe(content, { childList: true });
})();
