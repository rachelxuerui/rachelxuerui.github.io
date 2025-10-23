(() => {
  // =========================
  // Lines on click
  // =========================
  const lines = document.getElementById('lines');
  let isClickActive = false;

  const showLines = (x, y) => {
    lines.style.opacity = '1';
    const yLine = document.getElementById('y');
    const xLine = document.getElementById('x');
    const zLine = document.getElementById('z');
    const vh = window.innerHeight;

    // Y axis - vertical line going down
    yLine.style.left = x + 'px';
    yLine.style.top = y + 'px';
    yLine.style.height = (vh - y) + 'px';

    // X axis - horizontal line going right
    xLine.style.left = x + 'px';
    xLine.style.top = y + 'px';
    xLine.style.width = (vh - y) + 'px';

    // Z axis - diagonal line going bottom-left at -45deg
    zLine.style.left = x + 'px';
    zLine.style.top = y + 'px';
    zLine.style.width = (vh - y) + 'px';
  };

  const hideLines = () => {
    lines.style.opacity = '0';
  };

  const isClickable = (el) => {
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    return tag === 'a' || tag === 'button' || el.onclick !== null ||
           el.hasAttribute('onclick') || el.closest('a, button, li') ||
           el.classList.contains('cell');
  };

  document.addEventListener('mousedown', (e) => {
    const link = e.target.closest('a');
    if (link && link.href) {
      e.preventDefault();

      // Show lines during the click
      isClickActive = true;
      const hideTooltipEvent = new CustomEvent('hideTooltip');
      document.dispatchEvent(hideTooltipEvent);
      showLines(e.clientX, e.clientY);

      // Navigate on mouseup
      const navigateOnMouseUp = () => {
        window.location.href = link.href;
        document.removeEventListener('mouseup', navigateOnMouseUp);
      };
      document.addEventListener('mouseup', navigateOnMouseUp);
      return;
    }

    // Check if it's clickable or inside a clickable element
    if (isClickable(e.target) || e.target.closest('.cell')) {
      isClickActive = true;
      const hideTooltipEvent = new CustomEvent('hideTooltip');
      document.dispatchEvent(hideTooltipEvent);
      showLines(e.clientX, e.clientY);
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isClickActive) showLines(e.clientX, e.clientY);
  });

  document.addEventListener('mouseup', () => {
    isClickActive = false;
    hideLines();
  });

  document.addEventListener('mouseleave', () => {
    if (isClickActive) hideLines();
  });

  // Export state for other modules
  window.isClickActive = () => isClickActive;
})();
