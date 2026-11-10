(() => {
  // =========================
  // Project-based hover highlighting
  // =========================
  const container = document.querySelector('.content');
  const sidebar = document.querySelector('.sidebar');
  const supportsHover = window.matchMedia(
    '(hover: hover) and (pointer: fine)'
  ).matches;

  if (container) {
    let sidebarProjectId = null;

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

    const clearSidebarProject = () => {
      sidebarProjectId = null;
      container.classList.remove('sidebar-project-highlight');
      container
        .querySelectorAll('.sidebar-project')
        .forEach(media => media.classList.remove('sidebar-project'));
    };

    const markSidebarProject = (projectId, root = container) => {
      root
        .querySelectorAll?.(`.cell[data-project="${projectId}"] img, .cell[data-project="${projectId}"] video`)
        .forEach(media => media.classList.add('sidebar-project'));
    };

    if (supportsHover && sidebar) {
      sidebar.addEventListener('mouseover', event => {
        const name = event.target.closest(
          '.project-item[data-project] .name'
        );
        const item = name?.closest('.project-item[data-project]');

        if (!item || !sidebar.contains(item) || name.contains(event.relatedTarget)) {
          return;
        }

        clearSidebarProject();
        sidebarProjectId = item.dataset.project;
        container.classList.add('sidebar-project-highlight');
        markSidebarProject(sidebarProjectId);
      });

      sidebar.addEventListener('mouseout', event => {
        const name = event.target.closest(
          '.project-item[data-project] .name'
        );
        const item = name?.closest('.project-item[data-project]');

        if (!item || !sidebar.contains(item) || name.contains(event.relatedTarget)) {
          return;
        }

        clearSidebarProject();
      });

      const sidebarProjectObserver = new MutationObserver(mutations => {
        if (!sidebarProjectId) return;

        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType !== Node.ELEMENT_NODE) return;

            if (node.matches('.cell[data-project]')) {
              markSidebarProject(sidebarProjectId, node.parentElement);
            } else {
              markSidebarProject(sidebarProjectId, node);
            }
          });
        });
      });

      sidebarProjectObserver.observe(container, { childList: true, subtree: true });
    }

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

    container.addEventListener('focusin', (e) => {
      const target = e.target.closest('.cell img, .cell video');
      if (target && !target.classList.contains('pdf-thumbnail')) {
        const cell = target.closest('.cell[data-project]');
        if (cell) {
          markSameProject(cell.dataset.project);
        }
      }
    });

    container.addEventListener('focusout', (e) => {
      const target = e.target.closest('.cell img, .cell video');
      if (target && !target.classList.contains('pdf-thumbnail')) {
        clearSameProject();
      }
    });
  }
})();
