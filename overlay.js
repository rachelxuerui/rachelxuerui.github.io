(() => {
  // =========================
  // Left Hover Overlay
  // =========================
  const content = document.querySelector('.content');
  const overlay = document.getElementById('project-overlay');
  const overlayContentLeft = document.getElementById('overlay-content-left');

  // Cache for loaded HTML content
  const contentCache = {}

  // Load HTML file for a project
  const loadProjectContent = async (projectId) => {
    if (contentCache[projectId]) {
      return contentCache[projectId];
    }

    try {
      const response = await fetch(`projects/${projectId}.html`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      contentCache[projectId] = html;
      return html;
    } catch (error) {
      console.error(`Error loading project ${projectId}:`, error);
      return `<p>Error loading project content.</p>`;
    }
  }

  let currentProjectId = null;
  let isScrolling = false;
  let scrollTimeout = null;
  let showTimeout = null;
  let hideTimeout = null;

  const showHoverOverlay = async (projectId) => {
    if (overlay && overlayContentLeft) {
      const content = await loadProjectContent(projectId);

      // If switching between different projects, fade out then in
      if (currentProjectId !== projectId && currentProjectId !== null) {
        overlayContentLeft.style.opacity = '0';
        setTimeout(() => {
          currentProjectId = projectId;
          overlayContentLeft.innerHTML = content;
          overlayContentLeft.style.opacity = '1';
        }, 150);
      } else {
        // First time showing or same project
        currentProjectId = projectId;
        overlayContentLeft.innerHTML = content;
        overlayContentLeft.style.opacity = '1';
      }
      overlay.classList.add('active');
    }
  }

  const hideHoverOverlay = () => {
    if (overlay) {
      currentProjectId = null;
      overlay.classList.remove('active');
    }
  }

  const debouncedShowOverlay = (projectId) => {
    // Clear any pending hide
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    // Don't show overlay during scroll
    if (isScrolling) return;

    // Debounce the show with a small delay
    if (showTimeout) {
      clearTimeout(showTimeout);
    }
    showTimeout = setTimeout(() => {
      if (!isScrolling) {
        showHoverOverlay(projectId);
      }
    }, 100);
  }

  const debouncedHideOverlay = () => {
    // Clear any pending show
    if (showTimeout) {
      clearTimeout(showTimeout);
      showTimeout = null;
    }

    // Debounce the hide with a small delay
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    hideTimeout = setTimeout(() => {
      hideHoverOverlay();
    }, 100);
  }

  // Track scrolling state
  if (content) {
    content.addEventListener('scroll', () => {
      isScrolling = true;

      // Clear any pending overlay changes during scroll
      if (showTimeout) {
        clearTimeout(showTimeout);
        showTimeout = null;
      }

      // Reset scrolling flag after scroll ends
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 150);
    }, { passive: true });
  }

  // Use event delegation on content
  if (content) {
    content.addEventListener('mouseenter', (e) => {
      const img = e.target.closest('.cell img, .cell video');
      if (img) {
        const cell = img.closest('.cell[data-project]');
        if (cell) {
          const projectId = cell.dataset.project;
          if (projectId) {
            debouncedShowOverlay(projectId);
          }
        }
      }
    }, true);

    content.addEventListener('mouseleave', (e) => {
      const img = e.target.closest('.cell img, .cell video');
      if (img) {
        debouncedHideOverlay();
      }
    }, true);
  }

  // Add hover event to logo to show '000' overlay
  const logo = document.getElementById('logo');
  if (logo) {
    logo.addEventListener('mouseenter', () => {
      showHoverOverlay('000');
    });
    logo.addEventListener('mouseleave', () => {
      hideHoverOverlay();
    });
  }
})();
