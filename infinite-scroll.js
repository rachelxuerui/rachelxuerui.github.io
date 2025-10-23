(() => {
  // =========================
  // Infinite scroll
  // =========================
  const container = document.querySelector('.content');
  if (!container) return;

  const templateCells = Array.from(container.children);
  const cloneCells = () => templateCells.map(cell => cell.cloneNode(true));

  container.addEventListener('scroll', () => {
    const scrollBottom = container.scrollTop + container.clientHeight;
    if (scrollBottom >= container.scrollHeight - 10) {
      cloneCells().forEach(clone => container.appendChild(clone));
    }
  }, { passive: true });
})();
