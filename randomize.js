(() => {
  const content = document.querySelector('.content');
  if (!content) return;

  const cells = [...content.querySelectorAll('.cell')]
    .sort(() => Math.random() - 0.5)
    .forEach(cell => content.appendChild(cell));
})();
