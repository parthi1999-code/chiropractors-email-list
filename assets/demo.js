/* Hero product demo loop (~13s): type a search, rows fill in, ticks verify,
   enrichment ring fills, a contact opens, export fires, then it resets. */
(function () {
  var demo = document.getElementById('demo');
  if (!demo) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s) { return [].slice.call(demo.querySelectorAll(s)); };
  var typed = $('.sx-typed'), tags = $('.sx-tags'), goBtns = $('.sx-go');
  var rows = $('.tr.dm'), ring = demo.querySelector('.ring'), ringN = demo.querySelector('.ring-n');
  var coCount = demo.querySelector('.co-count');
  var timers = [], running = false, visible = false;

  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function clearAll() { timers.forEach(clearTimeout); timers = []; }
  function tween(ms, dur, fn) {           // fn(progress 0..1), eased
    at(ms, function () {
      var t0 = performance.now();
      (function step(now) {
        var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        fn(e);
        if (p < 1 && running) requestAnimationFrame(step);
      })(t0);
    });
  }
  function type(ms, text) {
    for (var i = 1; i <= text.length; i++) (function (k) {
      at(ms + k * 75, function () { typed.forEach(function (el) { el.textContent = text.slice(0, k); }); });
    })(i);
    return ms + text.length * 75;
  }
  function chip(ms, text) {
    at(ms, function () {
      typed.forEach(function (el) { el.textContent = ''; });
      tags.forEach(function (el) {
        var c = document.createElement('span'); c.className = 'sx-chip'; c.textContent = text;
        el.appendChild(c); requestAnimationFrame(function () { c.classList.add('in'); });
      });
    });
  }
  function setRing(p) {
    var v = Math.round(95 * p);
    ring.style.setProperty('--pct', v + '%'); ringN.textContent = v + '%';
  }

  function reset() {
    demo.className = 'prod';
    typed.forEach(function (el) { el.textContent = ''; });
    tags.forEach(function (el) { el.innerHTML = ''; });
    rows.forEach(function (r) { r.className = 'tr dm'; });
    setRing(0); coCount.textContent = '0';
  }

  function finalState() {           // what reduced-motion users see
    typed.forEach(function (el) { el.textContent = ''; });
    tags.forEach(function (el) { el.innerHTML = '<span class="sx-chip in">VP Sales</span><span class="sx-chip in">EMEA</span>'; });
    rows.forEach(function (r, i) { r.className = 'tr dm show ok lit' + (i === 0 ? ' hl' : ''); });
    setRing(1); coCount.textContent = '1,284';
    demo.className = 'prod s-results s-ring s-profile';
  }

  function run() {
    clearAll(); reset(); running = true;
    var t = 500;
    t = type(t, 'VP Sales'); chip(t + 200, 'VP Sales');
    t = type(t + 450, 'EMEA'); chip(t + 200, 'EMEA');
    t += 550;
    at(t, function () { goBtns.forEach(function (b) { b.classList.add('press'); }); demo.classList.add('s-search'); });
    at(t + 260, function () { goBtns.forEach(function (b) { b.classList.remove('press'); }); });
    t += 450;
    at(t, function () { demo.classList.add('s-results'); });
    rows.forEach(function (r, i) { at(t + i * 260, function () { r.classList.add('show'); }); });
    tween(t, 1300, function (p) { coCount.textContent = Math.round(1284 * p).toLocaleString('en-US'); });
    t += rows.length * 260 + 300;
    rows.forEach(function (r, i) { at(t + i * 190, function () { r.classList.add('ok'); }); });
    t += rows.length * 190;
    rows.forEach(function (r, i) { at(t + i * 160, function () { r.classList.add('lit'); }); });
    at(t, function () { demo.classList.add('s-ring'); });
    tween(t, 1500, setRing);
    t += 1800;
    at(t, function () { rows[0].classList.add('hl'); demo.classList.add('s-profile'); });
    t += 1300;
    at(t, function () { rows[0].classList.add('exporting'); });
    at(t + 280, function () { rows[0].classList.remove('exporting'); demo.classList.add('s-toast'); });
    t += 2400;
    at(t, function () { demo.classList.remove('s-toast'); });
    t += 900;
    at(t, function () { demo.classList.add('s-out'); });
    t += 700;
    at(t, function () { if (visible) run(); else running = false; });
  }

  if (reduce) { finalState(); return; }
  reset();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible && !running) run();
    }, { threshold: 0.15 }).observe(demo);
  } else { visible = true; run(); }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { clearAll(); running = false; } else if (visible && !running) run();
  });
})();
