(() => {
  const content = document.querySelector('.content');
  const sidebar = document.querySelector('.sidebar');
  if (!content || !sidebar) return;

  let sidebarScrollMode = false;

  function isOverMedia(x, y) {
    const el = document.elementFromPoint(x, y);
    return el && el.closest('.cell img, .cell video');
  }

  // continuously detect what mode we are in
  document.addEventListener('pointermove', (e) => {
    sidebarScrollMode = !!isOverMedia(e.clientX, e.clientY);
  }, { passive: true });

  // intercept ALL scroll intent
  window.addEventListener('wheel', (e) => {
    if (!sidebarScrollMode) return;

    // stop content scroll completely
    e.preventDefault();

    // route scroll to sidebar
    sidebar.scrollTop += e.deltaY;
  }, { passive: false });
})();