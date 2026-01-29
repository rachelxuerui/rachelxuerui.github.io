(() => {
  // =========================
  // Left Hover Overlay
  // =========================
  const content = document.querySelector('.content');
  const overlay = document.getElementById('project-overlay');
  const overlayContentLeft = document.getElementById('overlay-content-left');

  // Project data - can be expanded as needed
  const projectData = {
    '000': {
      text: '<p>About 000 Studio...</p>'
    },
    '001': {
      text: '<p>Project 001: 1000 Miles x 50 ft</p>'
    },
    '002': {
      text: '<p>Project 002: Apartment in Gramercy I</p>'
    },
    '003': {
      text: '<p>Project 003: Apartment in Brooklyn Heights</p>'
    },
    '004': {
      text: '<p>Project 004: Apartment in Gramercy II</p>'
    },
    '005': {
      text: '<p>Project 005: Project EATS</p>'
    },
    '006': {
      text: '<p>Project 006: Furniture for Two Friends</p>'
    },
    '007': {
      text: `
      <div class="project-header">
        <ul><li class="project-item"><div class = "number">007</div><div id = "name">Townhouse in Tribeca I</div></li></ul>
        <p>The studio's largest built work yet. A gut renovation of a late 19th century dairy-factory-turned-townhouse in the Tribeca Historic District. The 14-month construction process has been a lesson in flexibility: rapid redesigns to accommodate historical elements (arches, cast iron columns, brickwork) discovered during demolition, and minor re-filings to accommodate a client who kept adding scope (elevator, new floor finishes, an additional kitchen) over the course of construction. Substantial completion is scheduled for early May; two weeks ago, I got a text asking if we can turn the gym into a listening room. ("Of course we can!")</p>
      </div>`
    },
    '008': {
      text: '<p>Project 008: House in Sydney</p>'
    },
    '009': {
      text: '<p>Project 009: Apartment on the UWS</p>'
    },
    '010': {
      text: '<p>Project 010: Townhouse in Tribeca II</p>'
    },
    '011': {
      text: '<p>Project 011: Projects for Larry</p>'
    },
    '012': {
      text: '<p>Project 012: Apartment in Sutton Place</p>'
    }
  };

  let currentProjectId = null;

  const showHoverOverlay = (projectId) => {
    if (projectData[projectId] && currentProjectId !== projectId && overlay && overlayContentLeft) {
      currentProjectId = projectId;
      overlayContentLeft.innerHTML = projectData[projectId].text;
      overlay.classList.add('active');
    }
  };

  const hideHoverOverlay = () => {
    if (overlay) {
      currentProjectId = null;
      overlay.classList.remove('active');
    }
  };

  // Use event delegation on content
  if (content) {
    content.addEventListener('mouseenter', (e) => {
      const cell = e.target.closest('.cell[data-project]');
      if (cell) {
        const projectId = cell.dataset.project;
        if (projectId && projectId !== '000') {
          showHoverOverlay(projectId);
        }
      }
    }, true);

    content.addEventListener('mouseleave', (e) => {
      const cell = e.target.closest('.cell[data-project]');
      if (cell) {
        hideHoverOverlay();
      }
    }, true);
  }

  // Hide overlay when mouse enters the overlay itself
  if (overlay) {
    overlay.addEventListener('mouseenter', () => {
      hideHoverOverlay();
    });
  }
})();
