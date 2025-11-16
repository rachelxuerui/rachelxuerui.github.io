// Handle hover interactions for timeline and legend items
document.addEventListener('DOMContentLoaded', function() {
  const timelineItems = document.querySelectorAll('.timeline > div[id]');
  const legendItems = document.querySelectorAll('.legend-item');
  const legendContainer = document.querySelector('#legend');

  if (!legendContainer) return;

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
});
