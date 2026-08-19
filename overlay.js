(() => {
  const content = document.querySelector('.content');

  const leftOverlay = document.getElementById('project-overlay');
  const leftContent = document.getElementById('overlay-content-left');

  const rightOverlay = document.getElementById('project-overlay-right');
  const rightContent = document.getElementById('overlay-content-right');

  const closeLeftButton = document.getElementById('close-project-overlay');
  const closeRightButton = document.getElementById('close-project-overlay-right');
  const logo = document.getElementById('logo');

  const leftCache = {};
  const rightCache = {};
  const detailProjects = new Set(['005', '013']);

  let currentProject = null;
  let currentClickedProject = null;

  let leftLocked = false;

  let isScrolling = false;
  let scrollTimeout;
  let showTimeout;
  let hideTimeout;

  const hoverDelay =
    parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--hover-delay')
    ) || 100;


  // =========================
  // Content Loading
  // =========================

  async function loadContent(type, projectId) {
    const cache = type === 'preview' ? leftCache : rightCache;

    if (cache[projectId]) {
      return cache[projectId];
    }

    try {
      const response = await fetch(`${type}/${projectId}.html`);

      if (!response.ok) {
        throw new Error(response.status);
      }

      const html = await response.text();

      cache[projectId] = html;

      return html;

    } catch (error) {
      console.error(`Failed loading ${type}/${projectId}`, error);

      return `
        <p>
          Error loading project content.
        </p>
      `;
    }
  }


  function hasDetails(projectId) {
    return detailProjects.has(projectId);
  }


  function markDetailCell(cell) {
    const projectId = cell?.dataset?.project;

    if (!projectId) return;

    cell.classList.toggle(
      'has-details',
      hasDetails(projectId)
    );
  }


  function markDetailCells(root = content) {
    if (!root) return;

    if (root.matches?.('.cell[data-project]')) {
      markDetailCell(root);
    }

    root.querySelectorAll?.('.cell[data-project]')
      .forEach(markDetailCell);
  }


  if (content) {
    markDetailCells();

    const detailCellObserver =
      new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              markDetailCells(node);
            }
          });
        });
      });

    detailCellObserver.observe(content, { childList: true });
  }

  // =========================
  // Overlay Controls
  // =========================

  function resetLeftScroll() {
    leftContent.scrollTop = 0;
  }


  function updateDateTime() {
    if (typeof window.updateDateTime === 'function') {
      window.updateDateTime();
    }
  }


  function bindDetailLinks(projectId) {
    leftContent.querySelectorAll('a[href^="#"]')
      .forEach(link => {

        link.addEventListener('click', async event => {
          event.preventDefault();

          const target =
            link.getAttribute('href').replace('#', '');

          await showRightOverlay(projectId, target);
        });
      });
  }


  function scrollRightOverlayTo(targetId) {
    if (!targetId || !rightContent) return;

    const target =
      rightContent.querySelector(`#${CSS.escape(targetId)}`);

    if (!target) return;

    const detailImage = target.closest('.detail-image') || target;
    const detailImages = [...rightContent.querySelectorAll('.detail-image')];
    const targetIndex = detailImages.indexOf(detailImage);

    if (targetIndex === -1) return;

    const step = detailImages[0]?.offsetHeight || 0;

    rightContent.scrollTo({
      top: targetIndex * step,
      behavior: 'smooth'
    });
  }


  async function showLeftOverlay(projectId) {

    if (!leftOverlay || !leftContent) return;


    const html = await loadContent('preview', projectId);


    if (currentProject !== projectId && currentProject !== null) {

      leftContent.style.opacity = 0;

      setTimeout(() => {
        currentProject = projectId;

        leftContent.innerHTML = html;

        resetLeftScroll();
        updateDateTime();
        bindDetailLinks(projectId);

        leftContent.style.opacity = 1;

      }, 150);

    } else {

      currentProject = projectId;

      leftContent.innerHTML = html;

      resetLeftScroll();
      updateDateTime();
      bindDetailLinks(projectId);

      leftContent.style.opacity = 1;
    }


    leftOverlay.classList.add('active');
  }



async function showRightOverlay(projectId, scrollTarget = null) {

  if (!hasDetails(projectId)) {
    return;
  }


  const html = await loadContent('details', projectId);


  currentClickedProject = projectId;
  leftLocked = true;


  rightContent.innerHTML = html;

  rightOverlay.classList.add('active');


  requestAnimationFrame(() => {
    requestAnimationFrame(() => {

      if (scrollTarget) {

        scrollRightOverlayTo(scrollTarget);

      } else {

        // Only reset to top when opening normally
        rightContent.scrollTop = 0;

      }

    });
  });

}

  function hideLeftOverlay() {

    if (leftLocked) return;

    currentProject = null;

    leftOverlay?.classList.remove('active');
  }


  function hideRightOverlay() {

    currentClickedProject = null;

    leftLocked = false;

    rightOverlay?.classList.remove('active');

    hideLeftOverlay();
  }



  // =========================
  // Debounce
  // =========================

  function showHover(projectId) {

    clearTimeout(hideTimeout);


    if (isScrolling) return;


    clearTimeout(showTimeout);


    showTimeout = setTimeout(() => {

      if (!isScrolling) {
        showLeftOverlay(projectId);
      }

    }, hoverDelay);
  }



  function hideHover() {

    clearTimeout(showTimeout);


    clearTimeout(hideTimeout);


    hideLeftOverlay();

  }



  // =========================
  // Events
  // =========================

  closeRightButton?.addEventListener(
    'click',
    hideRightOverlay
  );


  closeLeftButton?.addEventListener(
    'click',
    hideLeftOverlay
  );



  if (content) {


    content.addEventListener(
      'scroll',
      () => {

        isScrolling = true;


        clearTimeout(scrollTimeout);


        scrollTimeout = setTimeout(() => {

          isScrolling = false;

        }, 150);


      },
      { passive:true }
    );



    content.addEventListener(
      'click',
      event => {

        const media =
          event.target.closest('.cell img, .cell video');


        if (!media ||
            media.classList.contains('pdf-thumbnail')) {
          return;
        }


        const cell =
          media.closest('.cell[data-project]');


        if (!cell) return;


        showRightOverlay(cell.dataset.project);

      }
    );

  }



  const isMobile =
    window.matchMedia(
      "(hover:none) and (pointer:coarse)"
    ).matches;



  if (isMobile) {


    content?.addEventListener(
      'click',
      event => {

        const media =
          event.target.closest('.cell img, .cell video');


        if (!media ||
            media.classList.contains('pdf-thumbnail')) {
          return;
        }


        event.stopPropagation();


        const cell =
          media.closest('.cell[data-project]');


        if (cell?.dataset.project) {

          showLeftOverlay(
            cell.dataset.project
          );

        }

      }
    );



    logo?.addEventListener(
      'click',
      () => showLeftOverlay('000')
    );


  } else {


    content?.addEventListener(
      'mouseenter',
      event => {

        const media =
          event.target.closest('.cell img, .cell video');


        if (!media ||
            media.classList.contains('pdf-thumbnail')) {
          return;
        }


        const cell =
          media.closest('.cell[data-project]');


        if (cell?.dataset.project) {

          showHover(
            cell.dataset.project
          );

        }

      },
      true
    );



    content?.addEventListener(
      'mouseleave',
      event => {

        const media =
          event.target.closest('.cell img, .cell video');


        if (media &&
            !media.classList.contains('pdf-thumbnail')) {

          hideHover();

        }

      },
      true
    );



    logo?.addEventListener(
      'mouseenter',
      () => showHover('000')
    );


    logo?.addEventListener(
      'mouseleave',
      hideHover
    );

  }

})();
