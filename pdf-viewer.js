(() => {
  // Set PDF.js worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  // Handle PDF thumbnail clicks
  const pdfThumbnails = document.querySelectorAll('.pdf-thumbnail');
  const imageViewerOverlay = document.getElementById('image-viewer-overlay');
  const imageViewerContent = document.getElementById('image-viewer-content');
  const closeButton = document.getElementById('close-image-viewer');

  async function renderPDF(pdfPath) {
    try {
      // Load PDF
      const pdf = await pdfjsLib.getDocument(pdfPath).promise;

      // Create container for pages
      const pagesContainer = document.createElement('div');
      pagesContainer.style.display = 'flex';
      pagesContainer.style.flexDirection = 'column';
      pagesContainer.style.gap = '0';
      pagesContainer.style.alignItems = 'center';
      pagesContainer.style.width = '100%';
      pagesContainer.style.overflowY = 'auto';
      pagesContainer.style.maxHeight = '90vh';

      // Render each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });

        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.display = 'block';

        // Render page
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        pagesContainer.appendChild(canvas);
      }

      // Clear and add pages
      imageViewerContent.innerHTML = '';
      imageViewerContent.appendChild(pagesContainer);

    } catch (error) {
      console.error('Error loading PDF:', error);
      imageViewerContent.innerHTML = '<p>Error loading PDF</p>';
    }
  }

  pdfThumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', (e) => {
      const pdfPath = thumbnail.dataset.pdf;
      if (pdfPath) {
        e.stopPropagation();

        // Show overlay with loading message
        imageViewerContent.innerHTML = '<p>Loading PDF...</p>';
        imageViewerOverlay.classList.add('active');

        // Render PDF
        renderPDF(pdfPath);
      }
    });
  });

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
