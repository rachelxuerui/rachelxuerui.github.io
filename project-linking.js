(() => {
  // =========================
  // Bidirectional Project Linking (using event delegation for infinite scroll)
  // =========================
  const sidebar = document.querySelector('.sidebar');
  const content = document.querySelector('.content');

  // Function to dim all items except those matching the projectId
  const highlightProject = (projectId) => {
    if (!projectId || projectId === '000') return;

    // Dim all sidebar items
    const sidebarItems = document.querySelectorAll('.project-item');
    sidebarItems.forEach(item => {
      if (item.dataset.project === projectId) {
        item.style.opacity = '1';
      } else {
        item.style.opacity = '0.25';
      }
    });

    // Dim all content cells (including cloned ones)
    const contentCells = document.querySelectorAll('.cell[data-project]');
    contentCells.forEach(cell => {
      if (cell.dataset.project === projectId) {
        // Keep matching cells at full opacity
        const img = cell.querySelector('img');
        const video = cell.querySelector('video');
        if (img) img.style.opacity = '1';
        if (video) video.style.opacity = '1';
      } else {
        // Dim non-matching cells
        const img = cell.querySelector('img');
        const video = cell.querySelector('video');
        if (img) img.style.opacity = '0.25';
        if (video) video.style.opacity = '0.25';
      }
    });
  };

  // Function to reset all opacities
  const resetHighlight = () => {
    const sidebarItems = document.querySelectorAll('.project-item');
    sidebarItems.forEach(item => {
      item.style.opacity = '';
    });

    const contentCells = document.querySelectorAll('.cell[data-project]');
    contentCells.forEach(cell => {
      const img = cell.querySelector('img');
      const video = cell.querySelector('video');
      if (img) img.style.opacity = '';
      if (video) video.style.opacity = '';
    });
  };

  // Use event delegation on sidebar
  if (sidebar) {
    sidebar.addEventListener('mouseenter', (e) => {
      const item = e.target.closest('.project-item');
      if (item) {
        highlightProject(item.dataset.project);
      }
    }, true);

    sidebar.addEventListener('mouseleave', (e) => {
      const item = e.target.closest('.project-item');
      if (item) {
        resetHighlight();
      }
    }, true);
  }

  // Use event delegation on content
  if (content) {
    content.addEventListener('mouseenter', (e) => {
      const img = e.target.closest('.cell[data-project] img');
      const video = e.target.closest('.cell[data-project] video');

      if (img) {
        const cell = img.closest('.cell[data-project]');
        if (cell) {
          highlightProject(cell.dataset.project);
        }
      } else if (video) {
        const cell = video.closest('.cell[data-project]');
        if (cell) {
          highlightProject(cell.dataset.project);
        }
      }
    }, true);

    content.addEventListener('mouseleave', (e) => {
      const img = e.target.closest('.cell[data-project] img');
      const video = e.target.closest('.cell[data-project] video');

      if (img || video) {
        resetHighlight();
      }
    }, true);
  }
})();
