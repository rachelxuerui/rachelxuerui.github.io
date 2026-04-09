(() => {
  // =========================
  // Project-based hover highlighting
  // =========================
  const container = document.querySelector('.content');

  if (container) {
    // Use event delegation
    container.addEventListener('mouseenter', (e) => {
      const target = e.target.closest('.cell img, .cell video');
      if (target && !target.classList.contains('pdf-thumbnail')) {
        const cell = target.closest('.cell[data-project]');
        if (cell) {
          const projectId = cell.dataset.project;

          // Find all cells with the same project and mark their images/videos
          const sameCells = container.querySelectorAll(`.cell[data-project="${projectId}"]`);
          sameCells.forEach(sameCell => {
            const media = sameCell.querySelectorAll('img, video');
            media.forEach(m => m.classList.add('same-project'));
          });
        }
      }
    }, true);

    container.addEventListener('mouseleave', (e) => {
      const target = e.target.closest('.cell img, .cell video');
      if (target && !target.classList.contains('pdf-thumbnail')) {
        // Remove all same-project classes
        const allMedia = container.querySelectorAll('.same-project');
        allMedia.forEach(m => m.classList.remove('same-project'));
      }
    }, true);
  }
})();
