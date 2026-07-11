(function () {
  var button = document.querySelector('[data-theme-toggle]');

  if (!button) return;

  function updateButton() {
    var isDark = document.documentElement.dataset.theme === 'dark';
    var icon = button.querySelector('i');

    button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    button.setAttribute('aria-pressed', String(isDark));
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  }

  button.addEventListener('click', function () {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', document.documentElement.dataset.theme);
    updateButton();
  });

  updateButton();
}());
