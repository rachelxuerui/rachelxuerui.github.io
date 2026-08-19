(() => {
  // =========================
  // Virtual infinite scroll
  // =========================
  const container = document.querySelector('.content');
  if (!container) return;

  const templateCells =
    Array.from(container.children)
      .map(cell => cell.cloneNode(true));

  if (!templateCells.length) return;

  const preloadDistance = 1600;
  const maxVirtualHeight = 18000000;
  const renderedCells = new Map();
  const preloadedSources = new Set();

  let spacer = null;
  let columns = 1;
  let cellSize = 0;
  let virtualRows = 1;
  let ticking = false;

  container.classList.add('virtual-scroll');
  container.textContent = '';

  spacer = document.createElement('div');
  spacer.className = 'virtual-scroll-spacer';
  container.appendChild(spacer);

  const getColumnCount = () => {
    if (window.matchMedia('(max-width: 800px)').matches) return 1;
    if (window.matchMedia('(max-width: 1074px)').matches) return 2;
    if (window.matchMedia('(min-width: 1500px)').matches) return 4;
    return 3;
  };

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

  const sizeCellMedia = (cell) => {
    const customPadding = cell.dataset.padding ? parseInt(cell.dataset.padding, 10) : 36;
    const maxSize = Math.max(0, cellSize - customPadding * 2);

    cell.style.width = `${cellSize}px`;
    cell.style.height = `${cellSize}px`;

    cell.querySelectorAll('img, video').forEach(item => {
      item.style.maxWidth = `${maxSize}px`;
      item.style.maxHeight = `${maxSize}px`;
    });
  };

  const buildCell = (virtualIndex) => {
    const template = templateCells[virtualIndex % templateCells.length];
    const cell = template.cloneNode(true);

    cell.dataset.virtualIndex = virtualIndex;
    sizeCellMedia(cell);
    preloadCellMedia(cell);

    return cell;
  };

  const positionCell = (cell, virtualIndex) => {
    const row = Math.floor(virtualIndex / columns);
    const column = virtualIndex % columns;

    cell.style.transform =
      `translate3d(${column * cellSize}px, ${row * cellSize}px, 0)`;
  };

  const render = () => {
    const firstRow =
      Math.max(0, Math.floor((container.scrollTop - preloadDistance) / cellSize));
    const lastRow =
      Math.min(
        virtualRows - 1,
        Math.ceil((container.scrollTop + container.clientHeight + preloadDistance) / cellSize)
      );
    const firstIndex = firstRow * columns;
    const lastIndex = Math.min(
      virtualRows * columns - 1,
      (lastRow + 1) * columns - 1
    );
    const needed = new Set();
    const fragment = document.createDocumentFragment();

    for (let index = firstIndex; index <= lastIndex; index++) {
      needed.add(index);

      let cell = renderedCells.get(index);

      if (!cell) {
        cell = buildCell(index);
        renderedCells.set(index, cell);
        fragment.appendChild(cell);
      }

      positionCell(cell, index);
    }

    renderedCells.forEach((cell, index) => {
      if (!needed.has(index)) {
        cell.remove();
        renderedCells.delete(index);
      }
    });

    if (fragment.childNodes.length) {
      container.appendChild(fragment);
    }
  };

  const measure = () => {
    columns = getColumnCount();
    cellSize = container.clientWidth / columns;
    if (!cellSize) return;

    virtualRows = Math.max(
      Math.ceil(templateCells.length / columns),
      Math.floor(maxVirtualHeight / cellSize)
    );
    spacer.style.height = `${virtualRows * cellSize}px`;

    renderedCells.forEach(sizeCellMedia);
    render();
  };

  measure();

  container.addEventListener('scroll', () => {
    if (ticking) return;

    ticking = true;

    requestAnimationFrame(() => {
      render();
      ticking = false;
    });
  }, { passive: true });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(measure, 100);
  });
})();
