(() => {
  // =========================
  // Overlay Tooltip
  // =========================
  const tooltip = document.getElementById('tooltip');
  if (!tooltip) return;

  const H_OFFSET = 3;
  const V_OFFSET = 3;

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
  };

  // Use event delegation on document to catch all overlay images and videos
  let lastMedia = null;
  document.addEventListener('mousemove', (e) => {
    const overlay = document.getElementById('project-overlay');

    // Only work when overlay is active
    if (!overlay || !overlay.classList.contains('active')) {
      return;
    }

    // Check if hovering over media in overlay-content-right
    const overlayRight = document.getElementById('overlay-content-right');
    if (!overlayRight) {
      return;
    }

    // Check for both img and video elements
    const img = e.target.closest('.overlay-cell img');
    const video = e.target.closest('.overlay-cell video');
    const media = img || video;

    if (media && overlayRight.contains(media)) {
      const src = media.getAttribute('src') || '';
      const filename = src.split('/').pop();
      showTooltip(filename, e.clientX, e.clientY);
      lastMedia = media;
    } else {
      if (lastMedia) {
        lastMedia = null;
        hideTooltip();
      }
    }
  }, { passive: true });

  // Hide tooltip when overlay closes
  const overlay = document.getElementById('project-overlay');
  if (overlay) {
    const observer = new MutationObserver(() => {
      if (!overlay.classList.contains('active')) {
        hideTooltip();
      }
    });
    observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });
  }

  // Hide on scroll
  document.addEventListener('scroll', hideTooltip, { passive: true, capture: true });
  window.addEventListener('blur', hideTooltip);
})();
