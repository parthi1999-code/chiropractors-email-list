(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      var open = !header.classList.contains('nav-open');
      header.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open);
      toggle.querySelector('.lbl').textContent = open ? 'Close' : 'Menu';
    });
    document.querySelectorAll('.main-nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.querySelector('.lbl').textContent = 'Menu';
      });
    });
  }

  // Dropdowns: click to open (works for touch and keyboard), close on outside click / Escape
  document.querySelectorAll('.dd').forEach(function (dd) {
    var btn = dd.querySelector('button');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !dd.classList.contains('open');
      document.querySelectorAll('.dd.open').forEach(function (o) { if (o !== dd) { o.classList.remove('open'); o.querySelector('button').setAttribute('aria-expanded', 'false'); } });
      dd.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.dd.open').forEach(function (o) { o.classList.remove('open'); o.querySelector('button').setAttribute('aria-expanded', 'false'); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('.dd.open').forEach(function (o) { o.classList.remove('open'); o.querySelector('button').setAttribute('aria-expanded', 'false'); });
  });

  // FAQ: show first 5, "More Questions" reveals the rest
  var more = document.getElementById('faq-more');
  if (more) {
    var extra = document.querySelectorAll('.faq-item.extra');
    more.addEventListener('click', function () {
      var showing = more.getAttribute('aria-expanded') === 'true';
      extra.forEach(function (d) { d.hidden = showing; });
      more.setAttribute('aria-expanded', !showing);
      more.querySelector('.lbl').textContent = showing ? 'More Questions' : 'Fewer Questions';
      if (!showing && extra[0]) extra[0].querySelector('summary').focus();
    });
  }

  // Footer form: preview only, nothing is sent
  document.querySelectorAll('form[data-preview]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = f.querySelector('.form-msg');
      var email = f.querySelector('input[type=email]');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        msg.style.color = '#ffb4a1';
        msg.textContent = 'Enter a valid work email.';
        email.focus();
        return;
      }
      msg.style.color = '';
      msg.textContent = 'Thanks! This is a design preview, so nothing was sent.';
      f.reset();
    });
  });
})();
