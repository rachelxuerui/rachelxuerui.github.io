(() => {
  const overlay = document.querySelector('.project-overlay-right');
  const tooltip = document.getElementById('tooltip');

  if (!overlay || !tooltip) return;

  const H_OFFSET = 3;
  const V_OFFSET = 3;
  const hoverDelay =
    parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--hover-delay')
    ) || 100;

  let activeImage = null;
  let pendingTooltip = null;
  let latestTooltip = null;

  function showTooltip(text, x, y) {
    tooltip.textContent = text;
    tooltip.style.opacity = '1';

    tooltip.style.left = '-9999px';
    tooltip.style.top = '-9999px';

    const { width, height } = tooltip.getBoundingClientRect();

    const nx = Math.min(x + H_OFFSET, window.innerWidth - width - 2);
    const ny = Math.min(y + V_OFFSET, window.innerHeight - height - 2);

    tooltip.style.left = `${nx}px`;
    tooltip.style.top = `${ny}px`;
  }

  function hideTooltip() {
    activeImage = null;
    latestTooltip = null;
    clearTimeout(pendingTooltip);
    tooltip.style.opacity = '0';
  }

  overlay.addEventListener('mousemove', (e) => {
    const img = e.target.closest('img');

    if (!img || !overlay.contains(img)) {
      hideTooltip();
      return;
    }

    // Get just the filename from the src
    let filename = img.getAttribute('src').split('/').pop();

    latestTooltip = {
      text: filename,
      x: e.clientX,
      y: e.clientY
    };

    if (img === activeImage && !pendingTooltip) {
      showTooltip(filename, e.clientX, e.clientY);
      return;
    }

    if (img === activeImage) {
      return;
    }

    activeImage = img;
    clearTimeout(pendingTooltip);

    pendingTooltip = setTimeout(() => {
      if (latestTooltip) {
        showTooltip(
          latestTooltip.text,
          latestTooltip.x,
          latestTooltip.y
        );
      }

      pendingTooltip = null;
    }, hoverDelay);
  });

  overlay.addEventListener('mouseleave', hideTooltip);
  overlay.addEventListener('scroll', hideTooltip, { passive: true });
  overlay.addEventListener('wheel', hideTooltip, { passive: true });
})();
