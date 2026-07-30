(() => {
  const overlay = document.querySelector('.project-overlay-right');
  const tooltip = document.getElementById('tooltip');

  if (!overlay || !tooltip) return;

  const H_OFFSET = 3;
  const V_OFFSET = 3;

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

    showTooltip(filename, e.clientX, e.clientY);
  });

  overlay.addEventListener('mouseleave', hideTooltip);
  overlay.addEventListener('scroll', hideTooltip, { passive: true });
  overlay.addEventListener('wheel', hideTooltip, { passive: true });
})();