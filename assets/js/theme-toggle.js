(function () {
  var button = document.querySelector('[data-theme-toggle]');
  var mediaQuery = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

  if (!button) return;

  function savedTheme() {
    try { return localStorage.getItem('theme'); } catch (error) { return null; }
  }

  function updateButton() {
    var isDark = document.documentElement.dataset.theme === 'dark';
    var icon = button.querySelector('i');

    button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    button.setAttribute('aria-pressed', String(isDark));
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  }

  button.addEventListener('click', function () {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', document.documentElement.dataset.theme); } catch (error) {}
    updateButton();
  });

  if (mediaQuery) {
    mediaQuery.addEventListener('change', function (event) {
      if (!savedTheme()) {
        document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
        updateButton();
      }
    });
  }

  updateButton();
}());
