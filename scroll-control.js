(() => {
  const content = document.querySelector('.content');
  const overlay = document.getElementById('project-overlay');
  const overlayContent = document.getElementById('overlay-content-left');

  if (!content || !overlay || !overlayContent) {
    return;
  }

  let hoveringProjectMedia = false;

  const isProjectMedia = (target) => {
    if (!target || typeof target.closest !== 'function') return false;
    const media = target.closest('.cell img, .cell video');
    return !!media && !media.classList.contains('pdf-thumbnail');
  };

  const normalizeWheelDelta = (e) => {
    if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) return e.deltaY * 16;
    if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) return e.deltaY * overlayContent.clientHeight;
    return e.deltaY;
  };

  content.addEventListener('mouseenter', (e) => {
    if (isProjectMedia(e.target)) {
      hoveringProjectMedia = true;
    }
  }, true);

  content.addEventListener('mouseleave', (e) => {
    if (isProjectMedia(e.target)) {
      hoveringProjectMedia = false;
    }
  }, true);

  window.addEventListener('wheel', (e) => {
    if (!hoveringProjectMedia || !overlay.classList.contains('active')) return;

    e.preventDefault();
    overlayContent.scrollTop += normalizeWheelDelta(e);
  }, { passive: false });
})();
