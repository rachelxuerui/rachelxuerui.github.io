(() => {
  // =========================
  // Infinite scroll
  // =========================
  const container = document.querySelector('.content');
  if (!container) return;

  const templateCells = Array.from(container.children);
  const preloadDistance = 1600;
  const appendDistance = () => Math.max(container.clientHeight * 2, preloadDistance);
  const preloadedSources = new Set();

  const preloadImageSource = (src) => {
    if (!src || preloadedSources.has(src)) return;
    preloadedSources.add(src);

    const img = new Image();
    img.decoding = 'async';
    img.src = src;
  };

  const preloadCellMedia = (cell) => {
    cell.querySelectorAll('img').forEach(img => {
      img.loading = 'eager';
      img.decoding = 'async';
      preloadImageSource(img.currentSrc || img.src);
      preloadImageSource(img.dataset.hoverSrc);
    });

    cell.querySelectorAll('video').forEach(video => {
      if (video.preload === 'none') {
        video.preload = 'metadata';
      }
    });
  };

  const mediaObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            preloadCellMedia(entry.target);
            mediaObserver.unobserve(entry.target);
          }
        });
      }, {
        root: container,
        rootMargin: `${preloadDistance}px 0px`
      })
    : null;

  const watchCell = (cell) => {
    if (mediaObserver) {
      mediaObserver.observe(cell);
    } else {
      preloadCellMedia(cell);
    }
  };

  const cloneCells = () => templateCells.map(cell => {
    const clone = cell.cloneNode(true);
    watchCell(clone);
    return clone;
  });

  templateCells.forEach(watchCell);

  container.addEventListener('scroll', () => {
    const scrollBottom = container.scrollTop + container.clientHeight;
    if (scrollBottom >= container.scrollHeight - appendDistance()) {
      cloneCells().forEach(clone => container.appendChild(clone));
    }
  }, { passive: true });
})();
