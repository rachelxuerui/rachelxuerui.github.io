(() => {
  const content = document.querySelector('.content');

  const leftOverlay = document.getElementById('project-overlay');
  const leftContent = document.getElementById('overlay-content-left');
  const sidebar = document.querySelector('.sidebar');

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
  let focusReturnTarget = null;

  let leftLocked = false;

  let isScrolling = false;
  let scrollTimeout;
  let showTimeout;
  let hideTimeout;
  let hoverPreviewRequested = false;
  let removeMobileDetailPeek = null;

  const hoverDelay =
    parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--hover-delay')
    ) || 100;

  const usesSingleColumnProjectLayout = () =>
    window.matchMedia('(max-width: 899px)').matches;


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

  function markDetailProjectItem(item) {
    const projectId = item?.dataset?.project;

    if (!projectId) return;

    item.classList.toggle(
      'has-details',
      hasDetails(projectId)
    );

    if (hasDetails(projectId)) {
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
    }
  }


  function markDetailCells(root = content) {
    if (!root) return;

    if (root.matches?.('.cell[data-project]')) {
      markDetailCell(root);
    }

    root.querySelectorAll?.('.cell[data-project]')
      .forEach(markDetailCell);
  }


  function markDetailProjectItems() {
    sidebar
      ?.querySelectorAll('.project-item[data-project]')
      .forEach(markDetailProjectItem);
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

  markDetailProjectItems();

  // =========================
  // Overlay Controls
  // =========================

  function resetLeftScroll() {
    removeMobileDetailPeek?.();
    leftContent.scrollTop = 0;
  }


  function updateDateTime() {
    if (typeof window.updateDateTime === 'function') {
      window.updateDateTime();
    }
  }


  function showMobileDetailPeek(detailImage) {
    removeMobileDetailPeek?.();

    const peek = detailImage.cloneNode(true);
    let touchY = null;
    let dismissed = false;
    let distance = 0;
    let travel = 0;

    peek.classList.add('mobile-detail-peek');
    peek.removeAttribute('id');
    peek.setAttribute('aria-hidden', 'true');
    peek.style.position = 'fixed';
    peek.style.top = '0';
    peek.style.bottom = '0';
    leftContent.append(peek);
    travel = peek.getBoundingClientRect().height;

    const dismiss = () => {
      if (dismissed) return;

      dismissed = true;
      peek.remove();
      leftContent.removeEventListener('wheel', handleWheel);
      leftContent.removeEventListener('touchstart', handleTouchStart);
      leftContent.removeEventListener('touchmove', handleTouchMove);

      if (removeMobileDetailPeek === dismiss) {
        removeMobileDetailPeek = null;
      }
    };

    const movePeek = delta => {
      if (delta <= 0) return 0;

      const consumed = Math.min(delta, travel - distance);

      distance += consumed;
      peek.style.transform = `translateY(${-distance}px)`;

      if (distance >= travel) {
        dismiss();
      }

      return delta - consumed;
    };

    const handleWheel = event => {
      event.preventDefault();

      if (event.deltaY <= 0) return;

      const remaining = movePeek(event.deltaY);

      if (remaining > 0) {
        leftContent.scrollTop += remaining;
      }
    };

    const handleTouchStart = event => {
      touchY = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = event => {
      const nextTouchY = event.touches[0]?.clientY;

      if (nextTouchY === undefined || touchY === null) return;

      event.preventDefault();

      const delta = touchY - nextTouchY;

      if (delta <= 0) {
        touchY = nextTouchY;
        return;
      }

      const remaining = movePeek(delta);

      if (remaining > 0) {
        leftContent.scrollTop += remaining;
      }

      touchY = nextTouchY;
    };

    leftContent.addEventListener('wheel', handleWheel, { passive: false });
    leftContent.addEventListener('touchstart', handleTouchStart, { passive: true });
    leftContent.addEventListener('touchmove', handleTouchMove, { passive: false });

    removeMobileDetailPeek = dismiss;
  }


  function bindDetailLinks(projectId) {
    leftContent.querySelectorAll('a[href^="#"]')
      .forEach(link => {

        link.addEventListener('click', async event => {
          event.preventDefault();

          const target =
            link.getAttribute('href').replace('#', '');

          if (usesSingleColumnProjectLayout()) {
            const detailImage = leftContent.querySelector(
              `#${CSS.escape(target)}`
            );

            if (detailImage) {
              showMobileDetailPeek(detailImage);
            }

            return;
          }

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


  async function showLeftOverlay(
    projectId,
    focusClose = false,
    hoverPreview = false
  ) {

    if (!leftOverlay || !leftContent) return;

    if (!hoverPreview) {
      hoverPreviewRequested = false;
    }


    let html = await loadContent('preview', projectId);

    if (hoverPreview && !hoverPreviewRequested) return;

    if (usesSingleColumnProjectLayout() && hasDetails(projectId)) {
      const detailsHtml = await loadContent('details', projectId);

      html += `
        <div class="mobile-detail-images">
          ${detailsHtml}
        </div>
      `;
    }


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
    leftOverlay.classList.toggle('hover-preview', hoverPreview);

    if (hoverPreview) {
      leftOverlay.setAttribute('aria-hidden', 'true');
      leftOverlay.setAttribute('inert', '');
    } else {
      leftOverlay.setAttribute('aria-hidden', 'false');
      leftOverlay.removeAttribute('inert');
    }

    if (focusClose) {
      focusReturnTarget = document.activeElement;
      closeLeftButton?.focus();
    }
  }



async function showRightOverlay(projectId, scrollTarget = null, focusClose = true) {

  if (!hasDetails(projectId)) {
    return;
  }


  const html = await loadContent('details', projectId);


  currentClickedProject = projectId;
  leftLocked = true;


  rightContent.innerHTML = html;

  rightOverlay.classList.add('active');
  rightOverlay.setAttribute('aria-hidden', 'false');
  rightOverlay.removeAttribute('inert');

  if (focusClose) {
    focusReturnTarget = document.activeElement;
    closeRightButton?.focus();
  }


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
    leftOverlay?.classList.remove('hover-preview');
    leftOverlay?.setAttribute('aria-hidden', 'true');
    leftOverlay?.setAttribute('inert', '');

    if (focusReturnTarget) {
      focusReturnTarget.focus();
      focusReturnTarget = null;
    }
  }


  function hideRightOverlay() {

    currentClickedProject = null;

    leftLocked = false;

    rightOverlay?.classList.remove('active');
    rightOverlay?.setAttribute('aria-hidden', 'true');
    rightOverlay?.setAttribute('inert', '');

    hideLeftOverlay();
  }

  function trapFocus(event, overlay) {
    const focusable = [
      ...overlay.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ].filter(element => !element.closest('[aria-hidden="true"]'));

    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }



  // =========================
  // Debounce
  // =========================

  function showHover(projectId, allowWhileScrolling = false) {

    clearTimeout(hideTimeout);

    hoverPreviewRequested = true;


    if (isScrolling && !allowWhileScrolling) return;


    clearTimeout(showTimeout);


    showTimeout = setTimeout(() => {

      if (!isScrolling || allowWhileScrolling) {
        showLeftOverlay(projectId, false, true);
      }

    }, hoverDelay);
  }



  function hideHover() {

    clearTimeout(showTimeout);


    clearTimeout(hideTimeout);

    hoverPreviewRequested = false;


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

  document.addEventListener('keydown', event => {
    const activeOverlay = rightOverlay?.classList.contains('active')
      ? rightOverlay
      : leftOverlay?.classList.contains('active')
        ? leftOverlay
        : null;

    if (event.key === 'Tab' && activeOverlay) {
      trapFocus(event, activeOverlay);
      return;
    }

    if (event.key !== 'Escape') return;

    if (document.getElementById('image-viewer-overlay')?.classList.contains('active')) {
      return;
    }

    if (rightOverlay?.classList.contains('active')) {
      hideRightOverlay();
    } else if (leftOverlay?.classList.contains('active')) {
      hideLeftOverlay();
    }
  });


  sidebar?.addEventListener(
    'click',
    async event => {
      const item =
        event.target.closest('.project-item[data-project].has-details');

      if (!item || !sidebar.contains(item)) return;

      event.preventDefault();

      const projectId = item.dataset.project;

      await showLeftOverlay(projectId, false);

      if (!usesSingleColumnProjectLayout()) {
        await showRightOverlay(projectId, null, true);
      }
    }
  );

  sidebar?.addEventListener(
    'keydown',
    event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;

      const item =
        event.target.closest('.project-item[data-project].has-details');

      if (!item || !sidebar.contains(item)) return;

      event.preventDefault();
      item.click();
    }
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

        if (usesSingleColumnProjectLayout()) return;

        showRightOverlay(cell.dataset.project);

      }
    );

    content.addEventListener(
      'keydown',
      event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;

        const media =
          event.target.closest('.cell img, .cell video');

        if (!media) return;

        const cell = media.closest('.cell[data-project]');

        if (!cell) return;

        if (media.classList.contains('pdf-thumbnail')) {
          event.preventDefault();
          media.click();
          return;
        }

        if (!usesSingleColumnProjectLayout() && hasDetails(cell.dataset.project)) {
          event.preventDefault();
          showRightOverlay(cell.dataset.project);
        }
      }
    );

  }



  if (usesSingleColumnProjectLayout()) {


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
            cell.dataset.project,
            true
          );

        }

      }
    );



    logo?.addEventListener(
      'click',
      () => showLeftOverlay('000', true)
    );


  } else {

    content?.addEventListener(
      'focusin',
      event => {
        const media =
          event.target.closest('.cell img, .cell video');

        if (media && !media.classList.contains('pdf-thumbnail')) {
          const cell = media.closest('.cell[data-project]');

          if (cell?.dataset.project) {
            showHover(cell.dataset.project, true);
          }
        }
      }
    );

    content?.addEventListener(
      'focusout',
      event => {
        const media =
          event.target.closest('.cell img, .cell video');

        if (media && !media.classList.contains('pdf-thumbnail')) {
          hideHover();
        }
      }
    );


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
