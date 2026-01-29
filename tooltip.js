(() => {
  // =========================
  // Unified Tooltip System
  // =========================
  const tooltip = document.getElementById('tooltip');
  if (!tooltip) return;

  const H_OFFSET = 3;
  const V_OFFSET = 3;
  let currentMedia = null;

  const showTooltip = (content, x, y) => {
    tooltip.style.opacity = '1';
    tooltip.textContent = content;

    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;

    tooltip.style.left = '-9999px';
    tooltip.style.top = '-9999px';
    const { width: tw, height: th } = tooltip.getBoundingClientRect();

    const nx = Math.min(Math.max(x + H_OFFSET, 0), vw - tw - 2);
    const ny = Math.min(Math.max(y + V_OFFSET, 0), vh - th - 2);

    tooltip.style.left = nx + 'px';
    tooltip.style.top = ny + 'px';
  };

  const hideTooltip = () => {
    tooltip.style.opacity = '0';
    currentMedia = null;
  };

  // Unified mousemove handler for both main content and overlay
  document.addEventListener('mousemove', (e) => {
    // Check if click is active from lines.js
    if (window.isClickActive && window.isClickActive()) {
      return;
    }

    // Check for overlay media first
    const overlay = document.getElementById('project-overlay');
    const overlayRight = document.getElementById('overlay-content-right');

    if (overlay && overlay.classList.contains('active') && overlayRight) {
      const img = e.target.closest('.overlay-cell img');
      const video = e.target.closest('.overlay-cell video');
      const media = img || video;

      if (media && overlayRight.contains(media)) {
        const src = media.getAttribute('src') || '';
        const filename = src.split('/').pop();
        showTooltip(filename, e.clientX, e.clientY);
        currentMedia = media;
        return;
      }
    }

    // Check for main content media
    const content = document.querySelector('.content');
    if (content) {
      const cell = e.target.closest('.cell');
      if (cell && content.contains(cell)) {
        const img = cell.querySelector('img');
        const video = cell.querySelector('video');
        const media = img || video;

        if (media) {
          const label = media.dataset.name || media.getAttribute('alt') || '';
          if (label) {
            showTooltip(label, e.clientX, e.clientY);
            currentMedia = media;
            return;
          }
        }
      }
    }

    // No media found, hide tooltip
    if (currentMedia) {
      hideTooltip();
    }
  }, { passive: true });

  // Hide tooltip on various events
  document.addEventListener('scroll', hideTooltip, { passive: true, capture: true });
  document.addEventListener('wheel', hideTooltip, { passive: true, capture: true });
  document.addEventListener('touchmove', hideTooltip, { passive: true, capture: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hideTooltip();
  });
  window.addEventListener('blur', hideTooltip);

  // Listen for custom hideTooltip event
  document.addEventListener('hideTooltip', hideTooltip);

  // Hide tooltip when overlay closes
  const overlayElement = document.getElementById('project-overlay');
  if (overlayElement) {
    const observer = new MutationObserver(() => {
      if (!overlayElement.classList.contains('active')) {
        hideTooltip();
      }
    });
    observer.observe(overlayElement, { attributes: true, attributeFilter: ['class'] });
  }
})();
