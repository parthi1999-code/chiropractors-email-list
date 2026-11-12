(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth (eased) scrolling for mouse wheel and anchor links; touch keeps native scrolling
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true, anchors: { offset: -84 } });
    window.lenis = lenis;
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
  }
  var hdr = document.getElementById('hdr');
  var burger = hdr.querySelector('.burger');

  // Header: transparent over hero, solid once scrolled
  function onScroll() { hdr.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  function setMenu(open) {
    hdr.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
  }
  burger.addEventListener('click', function () { setMenu(!hdr.classList.contains('menu-open')); });
  hdr.querySelectorAll('.nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); closeAll(); }); });

  // Dropdowns: hover on desktop, click/tap anywhere, Escape/outside closes
  var dds = [].slice.call(hdr.querySelectorAll('.dd'));
  var hoverable = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  function setDD(dd, open) { dd.classList.toggle('open', open); dd.querySelector('button').setAttribute('aria-expanded', open); }
  function closeAll(except) { dds.forEach(function (d) { if (d !== except) setDD(d, false); }); }
  dds.forEach(function (dd) {
    var btn = dd.querySelector('button'), t, hoverAt = 0;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (hoverable.matches && Date.now() - hoverAt < 600) { setDD(dd, true); return; }
      closeAll(dd); setDD(dd, !dd.classList.contains('open'));
    });
    dd.addEventListener('mouseenter', function () { if (!hoverable.matches) return; clearTimeout(t); if (!dd.classList.contains('open')) hoverAt = Date.now(); closeAll(dd); setDD(dd, true); });
    dd.addEventListener('mouseleave', function () { if (!hoverable.matches) return; t = setTimeout(function () { setDD(dd, false); }, 160); });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.dd')) closeAll(); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = hdr.querySelector('.dd.open'); closeAll();
    if (open) open.querySelector('button').focus(); else if (hdr.classList.contains('menu-open')) { setMenu(false); burger.focus(); }
  });

  var hasIO = 'IntersectionObserver' in window;

  // Reveal on scroll
  var rv = [].slice.call(document.querySelectorAll('.rv'));
  if (reduce || !hasIO) rv.forEach(function (el) { el.classList.add('in'); });
  else {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { rio.observe(el); });
  }

  // Count-up numbers
  var nums = [].slice.call(document.querySelectorAll('[data-count]'));
  function countUp(el) {
    var end = +el.getAttribute('data-count'), t0 = null, dur = 1400;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (!reduce && hasIO) {
    nums.forEach(function (el) { el.textContent = '0'; });
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
    }, { threshold: .4 });
    nums.forEach(function (el) { cio.observe(el); });
  }

  // Platform: sticky list scrollspy
  var pnav = [].slice.call(document.querySelectorAll('.plat-nav a'));
  if (hasIO) {
    var pio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        pnav.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + en.target.id;
          a.classList.toggle('on', on);
          if (on && a.parentNode.scrollWidth > a.parentNode.clientWidth) a.parentNode.scrollTo({ left: a.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' });
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('.pcard').forEach(function (c) { pio.observe(c); });
  }

  // Industries: auto-advancing tabs with progress, pause on hover/focus
  var tabs = [].slice.call(document.querySelectorAll('.uc-tab'));
  var ucWrap = document.getElementById('industries');
  var cur = 0, prog = 0, paused = false, visible = false, last = null, DUR = 5000;
  function selectTab(i, focus) {
    cur = (i + tabs.length) % tabs.length; prog = 0;
    tabs.forEach(function (t, j) {
      var on = j === cur;
      t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; t.style.setProperty('--p', '0%');
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tabs[cur].focus();
    var row = tabs[cur].parentNode;
    if (row.scrollWidth > row.clientWidth) row.scrollTo({ left: tabs[cur].offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(i); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); selectTab(cur + d, true); }
    });
  });
  // Keeps sliding under the mouse; only pauses while a keyboard user is on a tab
  if (ucWrap) {
    ucWrap.addEventListener('focusin', function (e) { paused = e.target.matches(':focus-visible'); });
    ucWrap.addEventListener('focusout', function () { paused = false; });
  }

  // Testimonials: expanding cards, auto-rotate with progress pill
  var cards = [].slice.call(document.querySelectorAll('.tcard'));
  var tdots = [].slice.call(document.querySelectorAll('#tdots button'));
  var tWrap = document.getElementById('testimonials');
  var ti = 0, tprog = 0, tpaused = false, tvisible = false, TDUR = 6000;
  function goT(n) {
    ti = (n + cards.length) % cards.length; tprog = 0;
    cards.forEach(function (c, j) { var on = j === ti; c.classList.toggle('on', on); c.tabIndex = on ? 0 : -1; c.setAttribute('aria-hidden', 'false'); });
    tdots.forEach(function (d, j) { d.style.setProperty('--p', '0%'); if (j === ti) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
  }
  cards.forEach(function (c, i) {
    c.addEventListener('click', function () { if (i !== ti) goT(i); });
    c.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && i !== ti) { e.preventDefault(); goT(i); } });
  });
  tdots.forEach(function (d, i) { d.addEventListener('click', function () { goT(i); }); });
  document.getElementById('tprev').addEventListener('click', function () { goT(ti - 1); });
  document.getElementById('tnext').addEventListener('click', function () { goT(ti + 1); });
  if (tWrap) {
    // keeps sliding under the mouse; only pauses while a keyboard user is on the controls
    tWrap.addEventListener('focusin', function (e) { tpaused = e.target.matches(':focus-visible'); });
    tWrap.addEventListener('focusout', function () { tpaused = false; });
  }

  // Only run timers while the section is on screen
  if (hasIO) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.target === ucWrap) visible = en.isIntersecting; else tvisible = en.isIntersecting; });
    });
    if (ucWrap) vio.observe(ucWrap);
    if (tWrap) vio.observe(tWrap);
  } else { visible = tvisible = true; }

  if (!reduce) {
    (function loop(ts) {
      if (last === null) last = ts;
      var dt = ts - last; last = ts;
      if (tabs.length && visible && !paused && !document.hidden) {
        prog += dt / DUR;
        if (prog >= 1) selectTab(cur + 1);
        else tabs[cur].style.setProperty('--p', (prog * 100).toFixed(1) + '%');
      }
      if (cards.length && tvisible && !tpaused && !document.hidden) {
        tprog += dt / TDUR;
        if (tprog >= 1) goT(ti + 1);
        else tdots[ti].style.setProperty('--p', (tprog * 100).toFixed(1) + '%');
      }
      requestAnimationFrame(loop);
    })(performance.now());
  }

  // FAQ: single-open accordion
  var fqs = [].slice.call(document.querySelectorAll('.fq'));
  fqs.forEach(function (f) {
    f.querySelector('button').addEventListener('click', function () {
      var open = !f.classList.contains('open');
      fqs.forEach(function (g) { g.classList.remove('open'); g.querySelector('button').setAttribute('aria-expanded', 'false'); });
      if (open) { f.classList.add('open'); this.setAttribute('aria-expanded', 'true'); }
    });
  });

  // Results background video: load only when near the screen, pause when off it
  var rv2 = document.querySelector('.res-video');
  var saveData = navigator.connection && navigator.connection.saveData;
  if (rv2 && !reduce && !saveData && hasIO) {
    var rvio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) {
          if (!rv2.src) { rv2.src = rv2.getAttribute('data-src'); rv2.addEventListener('playing', function () { rv2.classList.add('ready'); }, { once: true }); }
          var pp = rv2.play(); if (pp && pp.catch) pp.catch(function () {});
        } else if (rv2.src) rv2.pause();
      });
    }, { rootMargin: '300px 0px' });
    rvio.observe(rv2);
  }
})();
