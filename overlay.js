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
      description: 'About 000 Studio...',
      sections: [],
      rightContentHTML: `
        <div class="about-studio">
          <p>About section will go here.</p>
        </div>
      `
    },
    '007': {
      description: `The studio's largest built work yet. A gut renovation of a late 19th century dairy-factory-turned-townhouse in the Tribeca Historic District. The 14-month construction process has been a lesson in flexibility: rapid redesigns to discovered/accommodate historical elements (arches, cast iron columns, brickwork) discovered during demolition, and minor re-filings to accommodate a client who kept adding scope (elevator, new floor finishes, an additional kitchen) over the course of construction. Substantial completion is scheduled for early May; two weeks ago, I got a text asking if we can turn the gym into a listening room. ("Of course we can!")`,
      sections: ['Images', 'Drawings', 'Construction', 'Data', 'Instruments of Science'],
      rightContentHTML: `
        <div class="content">
          <div class="cell"><img src="assets/007-townhouse-in-tribeca-i/images/007_cp_250725_ww-500.jpg" loading="lazy"></div>
          <div class="cell"><img src="assets/007-townhouse-in-tribeca-i/images/007_cp_250725_ww-502.jpg" loading="lazy"></div>
          <div class="cell"><img src="assets/007-townhouse-in-tribeca-i/images/007_cp_250725_ww-505.jpg" loading="lazy"></div>
          <div class="cell"><img src="assets/007-townhouse-in-tribeca-i/images/007_cp_250725_ww-507.jpg" loading="lazy"></div>
          <div class="cell"><img src="assets/007-townhouse-in-tribeca-i/images/007_cp_250725_ww-510.jpg" loading="lazy"></div>
          <div class="cell"><img src="assets/007-townhouse-in-tribeca-i/images/007_cp_250726_ww-514.jpg" loading="lazy"></div>
          <div class="cell"><img src="assets/007-townhouse-in-tribeca-i/images/007_cp_250726_ww-523.jpg" loading="lazy"></div>
          <div class="cell"><img src="assets/007-townhouse-in-tribeca-i/images/007_cp_250726_ww-542.jpg" loading="lazy"></div>
          <div class="cell"><video src="assets/007-townhouse-in-tribeca-i/construction/007_co_241105_0433_resin-floor.mp4" controls preload="metadata"></video></div>
          <div class="cell"><img src="assets/007-townhouse-in-tribeca-i/construction/007_co_L02240409_042.jpeg" loading="lazy"></div>
          <div class="cell"><img src="assets/007-townhouse-in-tribeca-i/construction/007_co_L02240627_080.jpeg" loading="lazy"></div>
          <div class="cell"><img src="assets/007-townhouse-in-tribeca-i/construction/007_co_L04240924_051.JPG" loading="lazy"></div>
          <div class="cell"><img src="assets/007-townhouse-in-tribeca-i/construction/007_co_l01_240409_246.jpeg" loading="lazy"></div>
          <div class="cell"><img src="assets/007-townhouse-in-tribeca-i/construction/007_co_l01_240507_055.jpeg" loading="lazy"></div>
          <div class="cell"><img src="assets/007-townhouse-in-tribeca-i/construction/007_co_l01_240523_306.jpeg" loading="lazy"></div>
          <div class="cell"><img src="assets/007-townhouse-in-tribeca-i/construction/007_co_l01_240730_346.jpeg" loading="lazy"></div>
          <div class="cell"><img src="assets/007-townhouse-in-tribeca-i/construction/007_co_l01_241024_411.jpeg" loading="lazy"></div>
        </div>
      `
    },
    '001': {
      description: 'Project details for 1000 Miles x 50 ft coming soon...',
      sections: []
    },
    '002': {
      description: 'Project details for Apartment in Gramercy I coming soon...',
      sections: []
    },
    '003': {
      description: 'Project details for Apartment in Brooklyn Heights coming soon...',
      sections: []
    },
    '004': {
      description: 'Project details for Apartment in Gramercy II coming soon...',
      sections: []
    },
    '005': {
      description: 'Project details for Project EATS coming soon...',
      sections: []
    },
    '006': {
      description: 'Project details for Furniture for Two Friends coming soon...',
      sections: []
    },
    '008': {
      description: 'Project details for House in Sydney coming soon...',
      sections: []
    },
    '009': {
      description: 'Project details for Apartment on the UWS coming soon...',
      sections: []
    },
    '010': {
      description: 'Project details for Townhouse in Tribeca II coming soon...',
      sections: []
    },
    '011': {
      description: 'Project details for Projects for Larry coming soon...',
      sections: []
    },
    '012': {
      description: 'Project details for Apartment in Sutton Place coming soon...',
      sections: []
    }
  };

  const closeOverlay = () => {
    if (overlay) {
      overlay.classList.remove('active');
      // Re-enable scrolling on content
      const content = document.querySelector('.content');
      if (content) {
        content.style.overflow = '';
      }
    }
  };

  const openOverlay = (projectId) => {
    if (overlay && projectData[projectId]) {
      const data = projectData[projectId];

      // Build the left content
      let leftHTML = `<p>${data.description}</p>`;

      if (data.sections && data.sections.length > 0) {
        leftHTML += '<ul>';
        data.sections.forEach(section => {
          leftHTML += `<li><div>${section}</div></li>`;
        });
        leftHTML += '</ul>';
      }

      overlayContentLeft.innerHTML = leftHTML;

      // Load right content from embedded HTML
      if (data.rightContentHTML) {
        overlayContentRight.innerHTML = data.rightContentHTML;
      } else {
        overlayContentRight.innerHTML = '';
      }

      overlay.classList.add('active');

      // Disable scrolling on content
      const content = document.querySelector('.content');
      if (content) {
        content.style.overflow = 'hidden';
      }
    }
  };

  // Helper to show lines effect
  const showLinesEffect = (x, y) => {
    const lines = document.getElementById('lines');
    if (!lines) return;

    lines.style.opacity = '1';
    const yLine = document.getElementById('y');
    const xLine = document.getElementById('x');
    const zLine = document.getElementById('z');
    const vh = window.innerHeight;

    if (yLine) {
      yLine.style.left = x + 'px';
      yLine.style.top = y + 'px';
      yLine.style.height = (vh - y) + 'px';
    }

    if (xLine) {
      xLine.style.left = x + 'px';
      xLine.style.top = y + 'px';
      xLine.style.width = (vh - y) + 'px';
    }

    if (zLine) {
      zLine.style.left = x + 'px';
      zLine.style.top = y + 'px';
      zLine.style.width = (vh - y) + 'px';
    }

    // Hide lines after overlay opens
    setTimeout(() => {
      if (lines) lines.style.opacity = '0';
    }, 300);
  };

  // Open overlay when clicking on any project item or content cell
  document.addEventListener('mousedown', (e) => {
    // Check if clicking on a project item in sidebar
    const projectItem = e.target.closest('.project-item');

    // Check if clicking on a content cell
    const contentCell = e.target.closest('.cell[data-project]');

    if (projectItem) {
      const projectId = projectItem.dataset.project;
      e.preventDefault();
      e.stopImmediatePropagation();
      showLinesEffect(e.clientX, e.clientY);
      openOverlay(projectId);
      return;
    }

    if (contentCell) {
      const projectId = contentCell.dataset.project;
      if (projectId) {
        e.preventDefault();
        e.stopImmediatePropagation();
        showLinesEffect(e.clientX, e.clientY);
        openOverlay(projectId);
        return;
      }
    }

    // Check for logo click
    const logo = e.target.closest('#logo');
    if (logo) {
      e.preventDefault();
      e.stopImmediatePropagation();
      showLinesEffect(e.clientX, e.clientY);
      openOverlay('000');
      return;
    }

    // Check for close button
    if (overlay) {
      const close = e.target.closest('#close-overlay');

      if (close) {
        e.preventDefault();
        e.stopImmediatePropagation();
        showLinesEffect(e.clientX, e.clientY);
        closeOverlay();
      }
    }
  }, true);

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay) {
      closeOverlay();
    }
  });
})();
