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

  // Get hover delay from CSS variable
  const hoverDelay = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hover-delay')) || 100;

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
    }, hoverDelay);
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
    }, hoverDelay);
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

  // Detect mobile device
  const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  if (isMobile) {
    // Mobile: click to show overlay
    if (content) {
      content.addEventListener('click', (e) => {
        const img = e.target.closest('.cell img, .cell video');
        if (img && !img.classList.contains('pdf-thumbnail')) {
          e.stopPropagation();
          const cell = img.closest('.cell[data-project]');
          if (cell) {
            const projectId = cell.dataset.project;
            if (projectId) {
              showHoverOverlay(projectId);
            }
          }
        }
      });
    }

    // Mobile: close button
    const closeButton = document.getElementById('close-project-overlay');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        hideHoverOverlay();
      });
    }

    // Mobile: logo click
    const logo = document.getElementById('logo');
    if (logo) {
      logo.addEventListener('click', () => {
        showHoverOverlay('000');
      });
    }
  } else {
    // Desktop: hover to show overlay
    if (content) {
      content.addEventListener('mouseenter', (e) => {
        const img = e.target.closest('.cell img, .cell video');
        if (img && !img.classList.contains('pdf-thumbnail')) {
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
        if (img && !img.classList.contains('pdf-thumbnail')) {
          debouncedHideOverlay();
        }
      }, true);
    }

    // Desktop: hover event to logo to show '000' overlay
    const logo = document.getElementById('logo');
    if (logo) {
      logo.addEventListener('mouseenter', () => {
        console.log('showHoverOverlay');
        showHoverOverlay('000');
      });
      logo.addEventListener('mouseleave', () => {
        console.log('hideHoverOverlay');
        hideHoverOverlay();
      });
    }
  }
})();
