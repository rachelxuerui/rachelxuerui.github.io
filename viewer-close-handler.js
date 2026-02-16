(() => {
  // Shared close handler for image viewer overlay
  const imageViewerOverlay = document.getElementById('image-viewer-overlay');
  const imageViewerContent = document.getElementById('image-viewer-content');
  const closeButton = document.getElementById('close-image-viewer');

  function closeOverlay() {
    imageViewerOverlay.classList.remove('active');
    setTimeout(() => {
      imageViewerContent.innerHTML = '';
    }, 300);
  }

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
})();
