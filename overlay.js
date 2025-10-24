(() => {
  // =========================
  // Project Overlay
  // =========================
  const overlay = document.getElementById('project-overlay');

  const fadeOutAndNavigate = () => {
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => {
        window.history.back();
      }, 300);
    } else {
      window.history.back();
    }
  };

  const openOverlay = () => {
    console.log('openOverlay called, overlay:', overlay);
    if (overlay) {
      overlay.classList.add('active');
      console.log('Added active class, classList:', overlay.classList);
    }
  };

  // Open overlay when clicking on townhouse project - use mousedown with capture
  document.addEventListener('mousedown', (e) => {
    const townhouseItem = e.target.closest('#townhouse');

    if (townhouseItem) {
      console.log('Townhouse mousedown detected!');
      e.preventDefault();
      e.stopImmediatePropagation();
      openOverlay();
      return;
    }

    // Check for close buttons
    if (overlay) {
      const logo = e.target.closest('#logo');
      const close = e.target.closest('#close-overlay');

      if (logo || close) {
        e.preventDefault();
        e.stopImmediatePropagation();
        fadeOutAndNavigate();
      }
    }
  }, true);

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay) {
      fadeOutAndNavigate();
    }
  });

  console.log('Overlay script loaded');
})();
