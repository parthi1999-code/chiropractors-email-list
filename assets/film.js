/* Full-banner motion film: plays the .fs scenes in order, on a loop. */
(function () {
  var fm = document.getElementById('fm');
  if (!fm) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scenes = [].slice.call(fm.querySelectorAll('.fs'));
  var timers = [], running = false, visible = true, idx = 0;
  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function stop() { timers.forEach(clearTimeout); timers = []; running = false; }

  function typeInto(el, txt, startMs, cps) {
    el.textContent = '';
    for (var k = 1; k <= txt.length; k++) (function (n) { at(startMs + n * cps, function () { el.textContent = txt.slice(0, n); }); })(k);
    return startMs + txt.length * cps;
  }
  function count(el, to, startMs, dur) {
    at(startMs, function () {
      var t0 = performance.now();
      (function step(now) {
        var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * e) + '%';
        if (p < 1 && running) requestAnimationFrame(step);
      })(t0);
    });
  }
  var hooks = {
    f2: function (s) {
      var end = typeInto(s.querySelector('.q1'), 'Find VP Sales in Germany', 650, 48);
      at(end + 250, function () { s.classList.add('sent'); });
    },
    f6: function () { if (window.infDemo) window.infDemo.play(); },
    f3: function (s) {
      var end = typeInto(s.querySelector('.q2'), 'Hospital administrators in the US', 550, 42);
      at(end + 250, function () { s.classList.add('sent'); });
      count(s.querySelector('.fm-n'), 95, end + 600, 1300);
    }
  };

  function show(i) {
    var s = scenes[i];
    s.classList.remove('out', 'on', 'sent');
    void s.offsetWidth;
    s.classList.add('on');
    var name = s.className.match(/\bf\d\b/)[0];
    if (hooks[name]) hooks[name](s);
    at(+s.getAttribute('data-d') || 3000, function () {
      s.classList.remove('on'); s.classList.add('out');
      at(950, function () { s.classList.remove('out', 'sent'); });
      idx = (i + 1) % scenes.length;
      if (visible && !document.hidden) show(idx); else running = false;
    });
  }
  function start() { if (!running) { running = true; show(idx); } }

  if (reduce) {
    fm.classList.add('static');
    var s = scenes[1]; s.classList.add('on', 'sent');
    s.querySelector('.q1').textContent = 'Find VP Sales in Germany';
    return;
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) start(); }, { threshold: 0.05 }).observe(fm);
  }
  start();
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { stop(); if (window.infDemo) window.infDemo.stop(); scenes.forEach(function (x) { x.classList.remove('on', 'out', 'sent'); }); }
    else if (visible) start();
  });
})();
