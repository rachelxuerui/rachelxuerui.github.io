(() => {
  const updateCellSizes = () => {
    const content = document.querySelector('.content');
    if (!content) return;

    // Get the content container width
    const contentWidth = content.offsetWidth;

    // Get the computed grid columns to determine number of columns
    const gridColumns = window.getComputedStyle(content).gridTemplateColumns;
    const numColumns = gridColumns.split(' ').length;

    // Calculate cell width: content width / number of columns
    const cellWidth = contentWidth / numColumns;

    // Get all cells
    const cells = document.querySelectorAll('.cell');

    cells.forEach(cell => {
      // Set cell to be square (width and height equal)
      cell.style.width = `${cellWidth}px`;
      cell.style.height = `${cellWidth}px`;

      // Get custom padding from data attribute, or use default
      const customPadding = cell.dataset.padding ? parseInt(cell.dataset.padding) : 36;
      const padding = customPadding * 2; // padding on both sides
      const maxSize = cellWidth - padding;

      // Set max constraints on images
      const media = cell.querySelectorAll('img, video');
      media.forEach(item => {
        item.style.maxWidth = `${maxSize}px`;
        item.style.maxHeight = `${maxSize}px`;
      });
    });
  };

  // Run after DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCellSizes);
  } else {
    updateCellSizes();
  }

  // Run on resize (debounced)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateCellSizes, 20);
  });

  // Run after infinite scroll adds new cells
  const observer = new MutationObserver(() => {
    updateCellSizes();
  });

  const content = document.querySelector('.content');
  if (content) {
    observer.observe(content, { childList: true });
  }
})();
