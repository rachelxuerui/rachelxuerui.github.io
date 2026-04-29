(() => {
  function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) return 'th';

    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  function updateDateTime() {
    const now = new Date();
    const month = now.toLocaleString(undefined, { month: 'long' });
    const day = now.getDate();
    const time = now.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const formatted = `${month} ${day}${getOrdinalSuffix(day)} ${time}`;

    document.querySelectorAll('.datetime').forEach(el => {
      el.textContent = formatted;
    });
  }

  window.updateDateTime = updateDateTime;

  updateDateTime();
  setInterval(updateDateTime, 1000);
})();
