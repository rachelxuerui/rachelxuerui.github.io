(() => {
  // Shared close handler for image viewer overlay
  const imageViewerOverlay = document.getElementById('image-viewer-overlay');
  const imageViewerContent = document.getElementById('image-viewer-content');
  const closeButton = document.getElementById('close-image-viewer');
  let focusReturnTarget = null;

  function openOverlay(trigger) {
    focusReturnTarget = trigger || document.activeElement;
    imageViewerOverlay.classList.add('active');
    imageViewerOverlay.setAttribute('aria-hidden', 'false');
    imageViewerOverlay.removeAttribute('inert');

    requestAnimationFrame(() => closeButton?.focus());
  }

  function closeOverlay() {
    imageViewerOverlay.classList.remove('active');
    imageViewerOverlay.setAttribute('aria-hidden', 'true');
    imageViewerOverlay.setAttribute('inert', '');

    setTimeout(() => {
      imageViewerContent.innerHTML = '';
    }, 300);

    if (focusReturnTarget) {
      focusReturnTarget.focus();
      focusReturnTarget = null;
    }
  }

  window.openImageViewer = openOverlay;

  // Close button
  if (closeButton) {
    closeButton.addEventListener('click', closeOverlay);
  }

  // Close on overlay click (but not on content)
  if (imageViewerOverlay) {
    imageViewerOverlay.addEventListener('click', (e) => {
      if (e.target === imageViewerOverlay) {
        closeOverlay();
      }
    });
  }

  document.addEventListener('keydown', event => {
    if (!imageViewerOverlay?.classList.contains('active')) return;

    if (event.key === 'Tab') {
      event.preventDefault();
      closeButton?.focus();
      return;
    }

    if (event.key === 'Escape') {
      closeOverlay();
    }
  });
})();
