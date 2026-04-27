(() => {
  const content = document.querySelector('.content');
  const sidebar = document.querySelector('.sidebar');

  if (!content || !sidebar) {
    console.log('[scroll-control] missing content or sidebar');
    return;
  }

  function isOverMedia(x, y) {
    const el = document.elementFromPoint(x, y);
    const isMedia = !!el?.closest('.cell img, .cell video');

    console.log('[scroll-control] hit test:', {
      el,
      isMedia,
      x,
      y
    });

    return isMedia;
  }

  window.addEventListener('wheel', (e) => {
    console.log('[scroll-control] wheel fired', {
      deltaY: e.deltaY,
      x: e.clientX,
      y: e.clientY
    });

    const overMedia = isOverMedia(e.clientX, e.clientY);

    console.log('[scroll-control] overMedia =', overMedia);

    if (!overMedia) return;

    e.preventDefault();

    const before = sidebar.scrollTop;

    sidebar.scrollTop += e.deltaY;

    console.log('[scroll-control] sidebar scroll:', {
      before,
      after: sidebar.scrollTop
    });
  }, { passive: false });
})();