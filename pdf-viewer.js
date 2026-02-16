(() => {
  // Set PDF.js worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  // Handle PDF thumbnail clicks using event delegation
  const content = document.querySelector('.content');
  const imageViewerOverlay = document.getElementById('image-viewer-overlay');
  const imageViewerContent = document.getElementById('image-viewer-content');

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

  // Use event delegation on content container
  if (content) {
    content.addEventListener('click', (e) => {
      const thumbnail = e.target.closest('.pdf-thumbnail');
      if (thumbnail) {
        const pdfPath = thumbnail.dataset.pdf;
        if (pdfPath) {
          e.stopPropagation();

          // Show overlay with loading message
          imageViewerContent.innerHTML = '<p>Loading PDF...</p>';
          imageViewerOverlay.classList.add('active');

          // Render PDF
          renderPDF(pdfPath);
        }
      }
    });
  }

})();
