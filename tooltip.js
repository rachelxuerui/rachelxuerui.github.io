(() => {
  // =========================
  // Tooltip on hover
  // =========================
  const container = document.querySelector('.content');
  const tooltip = document.getElementById('tooltip');
  if (!container || !tooltip) return;

  const H_OFFSET = 3;
  const V_OFFSET = 3;
  let hoveringImg = null;

  const showTooltip = (content, x, y) => {
    tooltip.style.opacity = '1';
    tooltip.replaceChildren();

    if (typeof content === 'string') {
      tooltip.innerHTML = content;
    } else if (content instanceof Node) {
      tooltip.appendChild(content.cloneNode(true));
    } else {
      tooltip.textContent = String(content ?? '');
    }

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

  container.addEventListener('mousemove', (e) => {
    // Check if click is active from lines.js
    if (window.isClickActive && window.isClickActive()) return;

    const img = e.target.closest('.cell img');
    if (img && container.contains(img)) {
      hoveringImg = img;
      const label = img.dataset.name || img.getAttribute('alt') || '';
      showTooltip(label, e.clientX, e.clientY);
    } else if (hoveringImg) {
      hoveringImg = null;
      hideTooltip();
    }
  }, { passive: true });

  container.addEventListener('mouseleave', hideTooltip);

  // Hover class for cells
  container.addEventListener('mouseover', (e) => {
    const cell = e.target.closest('.cell');
    if (cell && container.contains(cell) && !cell.contains(e.relatedTarget)) {
      cell.classList.add('is-hover');
    }
  });

  container.addEventListener('mouseout', (e) => {
    const cell = e.target.closest('.cell');
    if (cell && container.contains(cell) && !cell.contains(e.relatedTarget)) {
      cell.classList.remove('is-hover');
    }
  });

  // Hide tooltip on scroll/wheel/touch
  const hideOnScroll = () => {
    hoveringImg = null;
    hideTooltip();
  };

  container.addEventListener('scroll', hideOnScroll, { passive: true });
  container.addEventListener('wheel', hideOnScroll, { passive: true });
  container.addEventListener('touchmove', hideOnScroll, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hideTooltip();
  });
  window.addEventListener('blur', hideTooltip);

  // Listen for custom event from lines.js
  document.addEventListener('hideTooltip', hideTooltip);
})();
