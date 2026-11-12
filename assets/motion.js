/* Hero motion piece: plays the scenes in .mv one after another, on a loop. */
(function () {
  var mv = document.getElementById('mv');
  if (!mv) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scenes = [].slice.call(mv.querySelectorAll('.sc'));
  var timers = [], running = false, visible = false, idx = 0;

  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function stop() { timers.forEach(clearTimeout); timers = []; running = false; }

  // confetti pieces (made once)
  var conf = mv.querySelector('.confetti');
  if (conf) {
    var cols = ['#0075ff', '#02a1e9', '#fb6414', '#ff9900', '#1e40af', '#7cc4ff'], h = '';
    for (var i = 0; i < 34; i++) {
      h += '<i style="left:' + (46 + Math.random() * 8).toFixed(1) + '%;background:' + cols[i % cols.length] +
        ';--r:' + Math.round(Math.random() * 720 - 360) + 'deg;--x:' + Math.round(Math.random() * 90 - 45) + 'cqw;--y:' + Math.round(-38 - Math.random() * 14 + Math.random() * 40) + 'cqw;animation-delay:' +
        (Math.random() * 0.15).toFixed(2) + 's;width:' + (6 + Math.random() * 10).toFixed(0) + 'px;height:' + (4 + Math.random() * 7).toFixed(0) + 'px"></i>';
    }
    conf.innerHTML = h;
  }

  var hooks = {
    s4: function (s) {               // type into the search box after the cursor clicks it
      var el = s.querySelector('.asx'), txt = 'VP Sales · EMEA'; el.textContent = '';
      for (var k = 1; k <= txt.length; k++) (function (n) { at(1150 + n * 55, function () { el.textContent = txt.slice(0, n); }); })(k);
    },
    s6: function (s) {               // score counts up with the bar
      var el = s.querySelector('.sn'), t0 = null;
      at(250, function () {
        (function step(now) {
          if (!t0) t0 = now;
          var p = Math.min(1, (now - t0) / 1500), e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(95 * e);
          if (p < 1 && running) requestAnimationFrame(step);
        })(performance.now());
      });
    }
  };

  function show(i) {
    var s = scenes[i];
    s.classList.remove('out', 'on');
    void s.offsetWidth;              // restart CSS animations
    s.classList.add('on');
    var name = s.className.match(/\bs\d+\b/)[0];
    if (hooks[name]) hooks[name](s);
    var d = +s.getAttribute('data-d') || 2000;
    at(d, function () {
      s.classList.remove('on'); s.classList.add('out');
      at(500, function () { s.classList.remove('out'); });
      idx = (i + 1) % scenes.length;
      if (visible) show(idx); else running = false;
    });
  }
  function start() { if (running) return; running = true; show(idx); }

  if (reduce) {                      // still frame for reduced-motion users
    mv.classList.add('static');
    scenes[7].classList.add('on');
    return;
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible) start();
    }, { threshold: 0.2 }).observe(mv);
  } else { visible = true; start(); }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { stop(); scenes.forEach(function (s) { s.classList.remove('on', 'out'); }); }
    else if (visible) start();
  });
})();
