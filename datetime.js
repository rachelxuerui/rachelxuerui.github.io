function updateDateTime() {
  const now = new Date();

  const formatted = now.toLocaleString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  document.querySelectorAll('.datetime').forEach(el => {
  el.textContent = formatted;
});
}

// run once on load
updateDateTime();

// optional: keep updating
setInterval(updateDateTime, 1000);