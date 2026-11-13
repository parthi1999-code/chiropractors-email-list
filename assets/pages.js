/* Inner pages: blog category filter, article table of contents, contact form preview note. */
(function () {
  // Blog category filter
  var cats = document.querySelectorAll('.bl-cats button');
  if (cats.length) {
    var cards = document.querySelectorAll('.bl-card, .bl-feat');
    var empty = document.querySelector('.bl-empty');
    cats.forEach(function (b) {
      b.addEventListener('click', function () {
        var c = b.getAttribute('data-cat');
        cats.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        var shown = 0;
        cards.forEach(function (card) {
          var ok = c === 'all' || card.getAttribute('data-cat') === c;
          card.hidden = !ok;
          if (ok) shown++;
        });
        if (empty) empty.classList.toggle('on', shown === 0);
      });
    });
  }

  // Article table of contents: highlight the section in view
  var toc = document.querySelectorAll('.ar-toc a');
  if (toc.length && 'IntersectionObserver' in window) {
    var map = {};
    toc.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          toc.forEach(function (a) { a.classList.remove('on'); });
          var a = map[en.target.id];
          if (a) a.classList.add('on');
        }
      });
    }, { rootMargin: '-100px 0px -70% 0px' });
    Object.keys(map).forEach(function (id) { var h = document.getElementById(id); if (h) io.observe(h); });
  }

  // Contact form: this is a design preview, so explain instead of pretending to send
  var form = document.getElementById('ct-form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.reportValidity()) return;
      var note = document.getElementById('ct-note');
      if (note) { note.classList.add('on'); note.focus(); }
    });
  }
})();
