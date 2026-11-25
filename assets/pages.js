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

  // Contact form guard. These are first-line checks in the browser; once the form is connected,
  // repeat them where submissions are received (plus Turnstile and a per-IP rate limit).
  var form = document.querySelector('.ct-form');
  if (form) {
    var loaded = Date.now();
    var FREE = /^(gmail|googlemail|yahoo|ymail|rocketmail|hotmail|outlook|live|msn|aol|icloud|me|mac|proton|protonmail|pm|gmx|mail|yandex|zoho|rediffmail|qq|163|126)\./i;
    var TEMP = /(mailinator|guerrillamail|sharklasers|10minutemail|tempmail|temp-mail|yopmail|trashmail|getnada|dispostable|maildrop|throwawaymail|fakeinbox|mailnesia|mintemail|emailondeck|spamgourmet|burnermail)\./i;
    var LINK = /(https?:\/\/|www\.)/gi;
    function err(field, id, msg) {
      var box = document.getElementById(id);
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (box) { box.textContent = msg || ''; box.classList.toggle('on', !!msg); }
      return !msg;
    }
    function recent() {
      try { return JSON.parse(localStorage.getItem('ifx-sent') || '[]').filter(function (t) { return Date.now() - t < 3600e3; }); } catch (x) { return []; }
    }
    function done() {
      var note = document.getElementById('ct-note');
      if (note) { note.classList.add('on'); note.focus(); }
    }
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      // Bots fill the hidden field or submit instantly: pretend it worked and drop it.
      if (form.website && form.website.value) return done();
      if (Date.now() - loaded < 3000) return done();
      var em = form.email, msg = form.message;
      var dom = (em.value.split('@')[1] || '').trim();
      var ok = err(em, 'f-em-err', TEMP.test(dom + '.') ? 'Temporary email addresses aren’t accepted. Please use your work email.'
        : FREE.test(dom) ? 'Please use your work email so we can match you to your company.' : '');
      var links = (msg.value.match(LINK) || []).length;
      ok = err(msg, 'f-msg-err', links > 2 ? 'Please keep links to two or fewer.' : '') && ok;
      [form.first, form.last, form.company].forEach(function (f) { if (f && LINK.test(f.value)) { f.setCustomValidity('Links aren’t allowed here.'); } else if (f) { f.setCustomValidity(''); } LINK.lastIndex = 0; });
      if (!form.reportValidity() || !ok) return;
      var sent = recent();
      if (sent.length >= 3) { return err(msg, 'f-msg-err', 'You’ve sent a few requests already. We’ll reply soon, or email info@infinyxglobal.com.'); }
      sent.push(Date.now());
      try { localStorage.setItem('ifx-sent', JSON.stringify(sent)); } catch (x) {}
      done();
    });
    form.addEventListener('input', function (ev) { if (ev.target.getAttribute('aria-invalid') === 'true') err(ev.target, ev.target.id + '-err', ''); });
  }
})();
