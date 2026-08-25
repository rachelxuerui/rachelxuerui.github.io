(() => {
  // =========================
  // Project-based hover highlighting
  // =========================
  const container = document.querySelector('.content');

  if (container) {
    const clearSameProject = () => {
      const allMedia = container.querySelectorAll('.same-project');
      allMedia.forEach(m => m.classList.remove('same-project'));
    };

    const markSameProject = (projectId) => {
      const sameCells = container.querySelectorAll(`.cell[data-project="${projectId}"]`);
      sameCells.forEach(sameCell => {
        const media = sameCell.querySelectorAll('img, video');
        media.forEach(m => m.classList.add('same-project'));
      });
    };

    // Use event delegation
    container.addEventListener('mouseenter', (e) => {
      const target = e.target.closest('.cell img, .cell video');
      if (target && !target.classList.contains('pdf-thumbnail')) {
        const cell = target.closest('.cell[data-project]');
        if (cell) {
          markSameProject(cell.dataset.project);
        }
      }
    }, true);

    container.addEventListener('mouseleave', (e) => {
      const target = e.target.closest('.cell img, .cell video');
      if (target && !target.classList.contains('pdf-thumbnail')) {
        clearSameProject();
      }
    }, true);
  }
})();
