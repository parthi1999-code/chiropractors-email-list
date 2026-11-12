/* Hero card deck: the front card slides away, the next one steps forward, on a loop. */
(function () {
  var deck = document.getElementById('deck');
  if (!deck) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cards = [].slice.call(deck.querySelectorAll('.dk'));
  var HOLD = [4200, 4600, 4200, 4400], SWAP = 950;
  var order = cards.slice(), timer = null, visible = true;

  function place() {
    order.forEach(function (c, i) { c.classList.remove('p0', 'p1', 'p2', 'p3'); c.classList.add('p' + i); });
  }
  function next() {
    var front = order[0];
    front.classList.add('leave');
    order.push(order.shift());
    order.forEach(function (c, i) { if (c !== front) { c.classList.remove('p0', 'p1', 'p2', 'p3'); c.classList.add('p' + i); } });
    setTimeout(function () {
      front.classList.add('snap');
      front.classList.remove('leave', 'p0');
      front.classList.add('p3');
      void front.offsetWidth;
      front.classList.remove('snap');
    }, SWAP);
    schedule();
  }
  function schedule() {
    clearTimeout(timer);
    if (!visible || document.hidden) return;
    timer = setTimeout(next, HOLD[cards.indexOf(order[0])] || 4200);
  }

  place();
  if (reduce) { deck.classList.add('static'); return; }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) schedule(); else clearTimeout(timer); }, { threshold: 0.1 }).observe(deck);
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimeout(timer); else schedule(); });
  schedule();
})();
