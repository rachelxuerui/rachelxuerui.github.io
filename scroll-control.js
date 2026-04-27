(() => {
  const content = document.querySelector('.content');
  const sidebar = document.querySelector('.sidebar');
  if (!content || !sidebar) return;

  let isHoveringImage = false;

  function setupHoverListeners() {
    const media = content.querySelectorAll('.cell img, .cell video');

    media.forEach(el => {
      el.addEventListener('mouseenter', () => {
        isHoveringImage = true;
      });

      el.addEventListener('mouseleave', () => {
        isHoveringImage = false;
      });
    });
  }

  content.addEventListener('wheel', (e) => {
    if (isHoveringImage) {
      e.preventDefault();

      // 👇 Redirect scroll to sidebar
      sidebar.scrollTop += e.deltaY;
    }
  }, { passive: false });

  setupHoverListeners();

  const observer = new MutationObserver(setupHoverListeners);
  observer.observe(content, { childList: true });
})();