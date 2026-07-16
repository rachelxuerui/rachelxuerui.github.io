(() => {
  // =========================
  // Left Hover Overlay
  // =========================
  const content = document.querySelector('.content');
  const overlay = document.getElementById('project-overlay');
  const overlayContentLeft = document.getElementById('overlay-content-left');
  const rightOverlay = document.getElementById('project-overlay-right');
  const overlayContentRight = document.getElementById('overlay-content-right');

  let currentClickedProject = null;

  // Cache
  const leftContentCache = {};
  const rightContentCache = {};

  // Left overlay content
  const loadLeftProjectContent = async (projectId) => {
    if (leftContentCache[projectId]) {
      return leftContentCache[projectId];
    }

    try {
      const response = await fetch(`preview/${projectId}.html`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      leftContentCache[projectId] = html;

      return html;

    } catch (error) {
      console.error(`Error loading left project ${projectId}:`, error);
      return `<p>Error loading project content.</p>`;
    }
  };

  const hasRightProjectContent = async (projectId) => {
  try {
    const response = await fetch(`details/${projectId}.html`, {
      method: 'HEAD'
    });

    return response.ok;

  } catch (error) {
    return false;
  }
};

  // Right overlay content
  const loadRightProjectContent = async (projectId) => {
    if (rightContentCache[projectId]) {
      return rightContentCache[projectId];
    }

    try {
      const response = await fetch(`details/${projectId}.html`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      rightContentCache[projectId] = html;

      return html;

    } catch (error) {
      console.error(`Error loading right project ${projectId}:`, error);
      return `<p>Error loading project details.</p>`;
    }
  };

  let currentProjectId = null;
  let isScrolling = false;
  let scrollTimeout = null;
  let showTimeout = null;
  let hideTimeout = null;

  // Get hover delay from CSS variable
  const hoverDelay = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hover-delay')) || 100;

  const showHoverOverlay = async (projectId) => {
    if (overlay && overlayContentLeft) {
      const content = await loadLeftProjectContent(projectId);
      const refreshDateTime = () => {
        if (typeof window.updateDateTime === 'function') {
          window.updateDateTime();
        }
      };
      const resetOverlayScroll = () => {
        overlayContentLeft.scrollTop = 0;
      };

      // If switching between different projects, fade out then in
      if (currentProjectId !== projectId && currentProjectId !== null) {
        overlayContentLeft.style.opacity = '0';
        setTimeout(() => {
          currentProjectId = projectId;
          overlayContentLeft.innerHTML = content;
          resetOverlayScroll();
          refreshDateTime();
          overlayContentLeft.style.opacity = '1';
        }, 150);
      } else {
        // First time showing or same project
        currentProjectId = projectId;
        overlayContentLeft.innerHTML = content;
        resetOverlayScroll();
        refreshDateTime();
        overlayContentLeft.style.opacity = '1';
      }
      overlay.classList.add('active');
    }
  }

  const showClickOverlay = async (projectId) => {

  overlayContentRight.querySelectorAll('.detail-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const targetId = link.getAttribute('href').substring(1);
    const target = overlayContentRight.querySelector(`#${targetId}`);

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

  const hasContent = await hasRightProjectContent(projectId);

  // No detail page = do nothing
  if (!hasContent) {
    return;
  }

  const content = await loadRightProjectContent(projectId);

  currentClickedProject = projectId;
  isLeftOverlayLocked = true;

  overlayContentRight.innerHTML = content;
  overlayContentRight.scrollTop = 0;

  rightOverlay.classList.add('active');
};

  let isLeftOverlayLocked = false;

  const hideHoverOverlay = () => {
    if (isLeftOverlayLocked) return;

    if (overlay) {
      currentProjectId = null;
      overlay.classList.remove('active');
    }
  };

const hideClickOverlay = () => {
  currentClickedProject = null;
  isLeftOverlayLocked = false;

  rightOverlay.classList.remove('active');
  hideHoverOverlay();
};

  // Close right project overlay button
  const closeRightButton = document.getElementById('close-project-overlay-right');

  if (closeRightButton) {
    closeRightButton.addEventListener('click', hideClickOverlay);
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

    content.addEventListener('click', (e) => {

      const media = e.target.closest('.cell img, .cell video');

      if (!media) return;

      if (media.classList.contains('pdf-thumbnail')) return;

      const cell = media.closest('.cell[data-project]');

      if (!cell) return;

      showClickOverlay(cell.dataset.project);

    });
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

    // // Add the close button listener here
    // const closeRightButton = document.getElementById('close-project-overlay-right');

    // if (closeRightButton) {
    //     closeRightButton.addEventListener('click', hideClickOverlay);
    // }


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
