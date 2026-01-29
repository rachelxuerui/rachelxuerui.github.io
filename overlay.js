(() => {
  // =========================
  // Project Overlay
  // =========================
  const overlay = document.getElementById('project-overlay');
  const overlayContentLeft = document.getElementById('overlay-content-left');
  const overlayContentRight = document.getElementById('overlay-content-right');

  // Project data - can be expanded as needed
  const projectData = {
    '000': {
      leftContentHTML: '<p>About 000 Studio...</p>',
      sections: []
    },
    '007': {
      leftContentHTML: `
      <div class="project-header">
        <ul><li class="project-item"><div class = "number">007</div><div id = "name">Townhouse in Tribeca I</div></li></ul>
        <p>The studio's largest built work yet. A gut renovation of a late 19th century dairy-factory-turned-townhouse in the Tribeca Historic District. The 14-month construction process has been a lesson in flexibility: rapid redesigns to accommodate historical elements (arches, cast iron columns, brickwork) discovered during demolition, and minor re-filings to accommodate a client who kept adding scope (elevator, new floor finishes, an additional kitchen) over the course of construction. Substantial completion is scheduled for early May; two weeks ago, I got a text asking if we can turn the gym into a listening room. ("Of course we can!")</p>
      </div>`,
      // sections: ['Images', 'Drawings', 'Construction', 'Data', 'Instruments of Science'],
      sections: [],
      rightContentHTML: `
        <div class="content">
          <div class="overlay-cell" data-section="Images" data-position="left" data-width="75"><img src="assets/007-townhouse-in-tribeca-i/images/007_cp_250725_ww-500.jpg" loading="lazy"></div>
          <div class="overlay-cell" data-section="Images" data-position="center" data-width="90"><img src="assets/007-townhouse-in-tribeca-i/images/007_cp_250725_ww-502.jpg" loading="lazy"></div>
          <div class="overlay-cell" data-section="Images" data-position="right" data-width="65"><img src="assets/007-townhouse-in-tribeca-i/images/007_cp_250725_ww-505.jpg" loading="lazy"></div>
          <div class="overlay-cell" data-section="Images" data-position="left" data-width="80"><img src="assets/007-townhouse-in-tribeca-i/images/007_cp_250725_ww-507.jpg" loading="lazy"></div>
          <div class="overlay-cell" data-section="Images" data-position="center" data-width="70"><img src="assets/007-townhouse-in-tribeca-i/images/007_cp_250725_ww-510.jpg" loading="lazy"></div>
          <div class="overlay-cell" data-section="Images" data-position="right" data-width="85"><img src="assets/007-townhouse-in-tribeca-i/images/007_cp_250726_ww-514.jpg" loading="lazy"></div>
          <div class="overlay-cell" data-section="Drawings" data-position="center" data-width="100"><img src="assets/007-townhouse-in-tribeca-i/drawings/010_dr_p-proposed-01-11x17.jpg" loading="lazy"></div>
          <div class="overlay-cell" data-section="Drawings" data-position="center" data-width="100"><img src="assets/007-townhouse-in-tribeca-i/drawings/010_dr_p-proposed-02-11x17.jpg" loading="lazy"></div>
          <div class="overlay-cell" data-section="Drawings" data-position="center" data-width="100"><img src="assets/007-townhouse-in-tribeca-i/drawings/010_dr_p-proposed-03-11x17.jpg" loading="lazy"></div>
          <div class="overlay-cell" data-section="Construction" data-position="left" data-width="90"><video src="assets/007-townhouse-in-tribeca-i/construction/007_co_241105_0433_resin-floor.mp4" autoplay loop muted playsinline preload="metadata"></video></div>
          <div class="overlay-cell" data-section="Construction" data-position="center" data-width="70"><img src="assets/007-townhouse-in-tribeca-i/construction/007_co_L02240409_042.jpeg" loading="lazy"></div>
          <div class="overlay-cell" data-section="Construction" data-position="right" data-width="75"><img src="assets/007-townhouse-in-tribeca-i/construction/007_co_L02240627_080.jpeg" loading="lazy"></div>
          <div class="overlay-cell" data-section="Construction" data-position="left" data-width="85"><img src="assets/007-townhouse-in-tribeca-i/construction/007_co_L04240924_051.JPG" loading="lazy"></div>
          <div class="overlay-cell" data-section="Construction" data-position="center" data-width="65"><img src="assets/007-townhouse-in-tribeca-i/construction/007_co_l01_240409_246.jpeg" loading="lazy"></div>
          <div class="overlay-cell" data-section="Construction" data-position="right" data-width="90"><img src="assets/007-townhouse-in-tribeca-i/construction/007_co_l01_240507_055.jpeg" loading="lazy"></div>
          <div class="overlay-cell" data-section="Construction" data-position="left" data-width="70"><img src="assets/007-townhouse-in-tribeca-i/construction/007_co_l01_240523_306.jpeg" loading="lazy"></div>
          <div class="overlay-cell" data-section="Construction" data-position="center" data-width="80"><img src="assets/007-townhouse-in-tribeca-i/construction/007_co_l01_240730_346.jpeg" loading="lazy"></div>
          <div class="overlay-cell" data-section="Construction" data-position="right" data-width="75"><img src="assets/007-townhouse-in-tribeca-i/construction/007_co_l01_241024_411.jpeg" loading="lazy"></div>
        </div>
      `
    }
  };

  const closeOverlay = () => {
    if (overlay) {
      overlay.classList.add('closing');
      overlay.classList.remove('active');

      // Wait for animation to complete before cleanup
      setTimeout(() => {
        overlay.classList.remove('closing');
        overlay.style.visibility = '';
        // Re-enable scrolling on body
        document.body.style.overflow = '';
        // Re-enable scrolling on content
        const content = document.querySelector('.content');
        if (content) {
          content.style.overflow = '';
        }
        // Re-enable scrolling on sidebar
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
          sidebar.style.overflow = '';
        }
      }, 300);
    }
  };

  const openOverlay = (projectId) => {
    if (overlay && projectData[projectId]) {
      const data = projectData[projectId];

      // Build the left content
      let leftHTML = '';

      // Add project-specific left content
      if (data.leftContentHTML) {
        leftHTML += data.leftContentHTML;
      }

      overlayContentLeft.innerHTML = leftHTML;

      // Load right content from embedded HTML - append after sections header
      const sectionsHeader = overlayContentRight.querySelector('.sections-header');
      if (data.rightContentHTML) {
        // Remove any existing content except the sections header
        Array.from(overlayContentRight.children).forEach(child => {
          if (!child.classList.contains('sections-header')) {
            child.remove();
          }
        });
        // Insert content after the header
        sectionsHeader.insertAdjacentHTML('afterend', data.rightContentHTML);
      } else {
        // Remove any existing content except the sections header
        Array.from(overlayContentRight.children).forEach(child => {
          if (!child.classList.contains('sections-header')) {
            child.remove();
          }
        });
      }

      // Add click listeners to images in overlay
      const overlayImages = overlayContentRight.querySelectorAll('.overlay-cell img');
      overlayImages.forEach(img => {
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          openImageViewer(img.src);
        });
        img.style.cursor = 'pointer';
      });

      // Add click listeners to videos in overlay
      const overlayVideos = overlayContentRight.querySelectorAll('.overlay-cell video');
      overlayVideos.forEach(video => {
        video.addEventListener('click', (e) => {
          e.stopPropagation();
          openImageViewer(video.src);
        });
        video.style.cursor = 'pointer';
      });

      // Initialize schedule hover functionality if schedule exists in overlay
      const timelineItems = overlayContentRight.querySelectorAll('.timeline > div[id]');
      const legendItems = overlayContentRight.querySelectorAll('.legend-item');
      const legendContainer = overlayContentRight.querySelector('#legend');

      if (legendContainer && timelineItems.length > 0) {
        timelineItems.forEach(item => {
          item.addEventListener('mouseenter', function() {
            const id = this.id;
            const itemRect = this.getBoundingClientRect();
            const legendRect = legendContainer.getBoundingClientRect();

            // Calculate center position of the hovered item relative to the legend container
            const centerX = itemRect.left + itemRect.width / 2 - legendRect.left;

            // Show all legend items that match this ID
            legendItems.forEach(legend => {
              if (legend.getAttribute('data-for') === id) {
                legend.classList.add('show');
                legend.style.left = centerX + 'px';
              }
            });
          });

          item.addEventListener('mouseleave', function() {
            // Hide all legend items
            legendItems.forEach(legend => {
              legend.classList.remove('show');
            });
          });
        });
      }

      // Make overlay visible first
      overlay.style.visibility = 'visible';

      // Disable scrolling on body
      document.body.style.overflow = 'hidden';
      // Disable scrolling on content
      const content = document.querySelector('.content');
      if (content) {
        content.style.overflow = 'hidden';
      }
      // Disable scrolling on sidebar
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.style.overflow = 'hidden';
      }

      // Add active class after a small delay to trigger animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.classList.add('active');
        });
      });
    }
  };

  // Open overlay when clicking on any project item or content cell
  document.addEventListener('mousedown', (e) => {
    // Don't handle clicks if image viewer is open
    const imageViewer = document.getElementById('image-viewer-overlay');
    if (imageViewer && imageViewer.classList.contains('active')) {
      return;
    }

    // Check if clicking on a project item in sidebar
    const projectItem = e.target.closest('.project-item');

    // Check if clicking on a content cell
    const contentCell = e.target.closest('.cell[data-project]');

    if (projectItem) {
      const projectId = projectItem.dataset.project;
      e.preventDefault();
      e.stopImmediatePropagation();
      openOverlay(projectId);
      return;
    }

    if (contentCell) {
      const projectId = contentCell.dataset.project;
      if (projectId) {
        e.preventDefault();
        e.stopImmediatePropagation();
        openOverlay(projectId);
        return;
      }
    }

    // Check for logo click
    const logo = e.target.closest('#logo');
    if (logo) {
      e.preventDefault();
      e.stopImmediatePropagation();
      openOverlay('000');
      return;
    }

    // Check for close button
    if (overlay) {
      const close = e.target.closest('#close-overlay');

      if (close) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closeOverlay();
        return;
      }

      // Close overlay if clicking outside the content areas
      if (overlay.classList.contains('active')) {
        const clickedInContent = e.target.closest('.project-content-left') ||
                                  e.target.closest('.project-content-right') ||
                                  e.target.closest('.close-overlay');

        if (!clickedInContent) {
          e.preventDefault();
          e.stopImmediatePropagation();
          closeOverlay();
        }
      }
    }
  }, true);

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const imageViewer = document.getElementById('image-viewer-overlay');
      if (imageViewer && imageViewer.classList.contains('active')) {
        closeImageViewer();
      } else if (overlay && overlay.classList.contains('active')) {
        closeOverlay();
      }
    }
  });

  // =========================
  // Image Viewer
  // =========================
  const imageViewerOverlay = document.getElementById('image-viewer-overlay');
  const imageViewerContent = document.getElementById('image-viewer-content');
  const closeImageViewerBtn = document.getElementById('close-image-viewer');

  const openImageViewer = (mediaSrc) => {
    if (imageViewerOverlay && imageViewerContent) {
      const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(mediaSrc);
      const element = document.createElement(isVideo ? 'video' : 'img');

      element.src = mediaSrc;
      if (isVideo) {
        element.autoplay = true;
        element.loop = true;
        element.muted = true;
        element.playsInline = true;
      }

      imageViewerContent.innerHTML = '';
      imageViewerContent.appendChild(element);
      imageViewerOverlay.classList.add('active');
    }
  };

  const closeImageViewer = () => {
    if (imageViewerOverlay) {
      imageViewerOverlay.classList.remove('active');
      setTimeout(() => {
        if (imageViewerContent) {
          imageViewerContent.innerHTML = '';
        }
      }, 300);
    }
  };

  // Close image viewer when clicking background
  if (imageViewerOverlay) {
    imageViewerOverlay.addEventListener('click', (e) => {
      if (e.target === imageViewerOverlay) {
        closeImageViewer();
      }
    });
  }

  // Close image viewer when clicking close button
  if (closeImageViewerBtn) {
    closeImageViewerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      closeImageViewer();
    });
  }
})();
