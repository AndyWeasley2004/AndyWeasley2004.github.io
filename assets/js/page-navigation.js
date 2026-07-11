(function () {
  function isNavigation(event, link) {
    return link && link.classList.contains('site-tab') && event.button === 0 &&
      !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey &&
      link.origin === window.location.origin && link.pathname !== window.location.pathname;
  }

  function setActiveTab(pathname) {
    document.querySelectorAll('.site-tab').forEach(function (tab) {
      var active = new URL(tab.href).pathname === pathname;
      tab.classList.toggle('active', active);
      if (active) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    });
  }

  function replaceNewsRail(nextDocument) {
    var current = document.querySelector('.news-rail');
    var next = nextDocument.querySelector('.news-rail');
    if (current && next) current.replaceWith(next);
    else if (current) current.remove();
    else if (next) document.querySelector('.site-shell').appendChild(next);
  }

  function replaceCredit(nextDocument) {
    var current = document.querySelector('.site-credit');
    var next = nextDocument.querySelector('.site-credit');
    if (current && next) current.replaceWith(next);
    else if (current) current.remove();
    else if (next) document.querySelector('.site-content').appendChild(next);
  }

  function loadPage(url, pushState) {
    var article = document.querySelector('article.page');
    if (!article) return;

    fetch(url, { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error('Unable to load page');
        return response.text();
      })
      .then(function (html) {
        var nextDocument = new DOMParser().parseFromString(html, 'text/html');
        var nextArticle = nextDocument.querySelector('article.page');
        if (!nextArticle) throw new Error('Page content unavailable');

        document.body.classList.add('page-changing');
        window.setTimeout(function () {
          document.body.className = nextDocument.body.className + ' page-entering';
          article.replaceWith(nextArticle);
          replaceCredit(nextDocument);
          replaceNewsRail(nextDocument);
          document.title = nextDocument.title;
          setActiveTab(new URL(url, window.location.origin).pathname);
          if (pushState) window.history.pushState({}, '', url);
          window.scrollTo({ top: 0, behavior: 'auto' });
          window.requestAnimationFrame(function () {
            document.body.classList.remove('page-entering');
          });
        }, 130);
      })
      .catch(function () {
        window.location.assign(url);
      });
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a');
    if (!isNavigation(event, link)) return;
    event.preventDefault();
    loadPage(link.href, true);
  });

  window.addEventListener('popstate', function () {
    loadPage(window.location.href, false);
  });
}());
