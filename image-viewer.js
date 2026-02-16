(() => {
  const imageViewerOverlay = document.getElementById('image-viewer-overlay');
  const imageViewerContent = document.getElementById('image-viewer-content');
  const closeButton = document.getElementById('close-image-viewer');

  // Handle clicks on images and videos in grid (but not PDF thumbnails)
  const content = document.querySelector('.content');

  if (content) {
    content.addEventListener('click', (e) => {
      const img = e.target.closest('img:not(.pdf-thumbnail)');
      const video = e.target.closest('video');

      if (img) {
        e.stopPropagation();

        // Create enlarged image
        const enlargedImg = document.createElement('img');
        enlargedImg.src = img.src;
        enlargedImg.style.maxWidth = '90vw';
        enlargedImg.style.maxHeight = '90vh';
        enlargedImg.style.objectFit = 'contain';

        // Clear and add image
        imageViewerContent.innerHTML = '';
        imageViewerContent.appendChild(enlargedImg);

        // Show overlay
        imageViewerOverlay.classList.add('active');
      } else if (video) {
        e.stopPropagation();

        // Create enlarged video
        const enlargedVideo = document.createElement('video');
        enlargedVideo.src = video.src;
        enlargedVideo.autoplay = true;
        enlargedVideo.loop = true;
        enlargedVideo.muted = true;
        enlargedVideo.playsInline = true;
        enlargedVideo.controls = false;
        enlargedVideo.style.maxWidth = '90vw';
        enlargedVideo.style.maxHeight = '90vh';
        enlargedVideo.style.objectFit = 'contain';

        // Clear and add video
        imageViewerContent.innerHTML = '';
        imageViewerContent.appendChild(enlargedVideo);

        // Show overlay
        imageViewerOverlay.classList.add('active');
      }
    });
  }

  // Close overlay
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      imageViewerOverlay.classList.remove('active');
      setTimeout(() => {
        imageViewerContent.innerHTML = '';
      }, 300);
    });
  }

  // Close on overlay click (but not on content)
  if (imageViewerOverlay) {
    imageViewerOverlay.addEventListener('click', (e) => {
      if (e.target === imageViewerOverlay) {
        imageViewerOverlay.classList.remove('active');
        setTimeout(() => {
          imageViewerContent.innerHTML = '';
        }, 300);
      }
    });
  }
})();
