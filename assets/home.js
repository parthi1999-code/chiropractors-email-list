(function () {
  var hdr = document.getElementById('hdr');
  var burger = hdr.querySelector('.burger');
  var dd = hdr.querySelector('.nav-dd');
  var ddBtn = dd.querySelector('button');

  // Header turns light once you scroll past the dark hero
  var hero = document.querySelector('.hero');
  function onScroll() {
    var past = hero ? window.scrollY > hero.offsetHeight - 90 : true;
    hdr.classList.toggle('light', past || hdr.classList.contains('nav-open'));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  burger.addEventListener('click', function () {
    var open = !hdr.classList.contains('nav-open');
    hdr.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    onScroll();
  });
  hdr.querySelectorAll('.nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      hdr.classList.remove('nav-open'); dd.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false'); ddBtn.setAttribute('aria-expanded', 'false'); onScroll();
    });
  });

  // Services mega menu: click/tap to toggle, hover on desktop, Escape / outside click closes
  function setDD(open) { dd.classList.toggle('open', open); ddBtn.setAttribute('aria-expanded', open); }
  var hoverable = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  var openedByHover = 0;
  ddBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    // If hover just opened it, a click should keep it open rather than toggle it shut
    if (hoverable.matches && Date.now() - openedByHover < 600) { setDD(true); return; }
    setDD(!dd.classList.contains('open'));
  });
  var t;
  dd.addEventListener('mouseenter', function () { if (hoverable.matches) { clearTimeout(t); if (!dd.classList.contains('open')) openedByHover = Date.now(); setDD(true); } });
  dd.addEventListener('mouseleave', function () { if (hoverable.matches) { t = setTimeout(function () { setDD(false); }, 160); } });
  document.addEventListener('click', function (e) { if (!dd.contains(e.target)) setDD(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setDD(false); ddBtn.focus(); } });

  // Service pills: highlight the block in view
  var pills = [].slice.call(document.querySelectorAll('.pills a'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) pills.forEach(function (p) { p.classList.toggle('on', p.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    document.querySelectorAll('.svc').forEach(function (s) { io.observe(s); });
  }

  // Industry tabs (arrow keys move between tabs)
  var tabs = [].slice.call(document.querySelectorAll('[role="tab"]'));
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(tab); });
    tab.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var n = tabs[(i + d + tabs.length) % tabs.length]; select(n); n.focus();
    });
  });

  // Testimonial carousel
  var track = document.getElementById('track');
  var dots = [].slice.call(document.querySelectorAll('#dots button'));
  var idx = 0;
  function go(n) {
    idx = (n + dots.length) % dots.length;
    track.style.transform = 'translateX(' + (-100 * idx) + '%)';
    dots.forEach(function (d, i) { if (i === idx) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
    [].forEach.call(track.children, function (s, i) { s.setAttribute('aria-hidden', i !== idx); });
  }
  document.getElementById('prev').addEventListener('click', function () { go(idx - 1); });
  document.getElementById('next').addEventListener('click', function () { go(idx + 1); });
  dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });
  go(0);

  // Insights filter
  var fbtns = [].slice.call(document.querySelectorAll('.filters button'));
  var posts = [].slice.call(document.querySelectorAll('#posts .post'));
  fbtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-f'), shown = 0;
      fbtns.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      posts.forEach(function (p) { var ok = f === 'all' || p.getAttribute('data-cat') === f; p.hidden = !ok; if (ok) shown++; });
      document.getElementById('no-posts').hidden = shown > 0;
    });
  });

  // Footer form: preview only
  document.querySelectorAll('form[data-preview]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = f.querySelector('.form-msg'), email = f.querySelector('input[type=email]');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { msg.style.color = '#ffb4a1'; msg.textContent = 'Enter a valid work email.'; email.focus(); return; }
      msg.style.color = ''; msg.textContent = 'Thanks! This is a design preview, so nothing was sent.'; f.reset();
    });
  });
})();
