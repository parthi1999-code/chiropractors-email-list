/* About page: story cards shrink back slightly as the next one stacks over them (Ampliz-style). */
(function () {
  var cards = [].slice.call(document.querySelectorAll('.ab-sc'));
  if (!cards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ticking = false;
  function update() {
    ticking = false;
    cards.forEach(function (c, i) {
      var next = cards[i + 1];
      if (!next) { c.style.transform = ''; return; }
      var h = c.offsetHeight || 1;
      var gap = next.getBoundingClientRect().top - c.getBoundingClientRect().top;
      var p = Math.min(1, Math.max(0, 1 - gap / h));          // 0 while apart, 1 when fully covered
      c.style.transform = 'scale(' + (1 - p * 0.05).toFixed(4) + ')';
      c.firstElementChild.style.filter = p > 0 ? 'brightness(' + (1 - p * 0.12).toFixed(3) + ')' : '';
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
