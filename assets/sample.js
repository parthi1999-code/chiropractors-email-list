(function () {
  var LISTS = {
    chiropractors: {
      label: 'Chiropractors',
      title: 'Test 50 Masked Chiropractor Records in Your CRM',
      lead: 'Name the specialties and practice models you sell to, and matching rows land in your inbox shortly for a quick CRM test.',
      specLegend: 'Specialties', specHint: 'General chiropractic or any of the 11 NPI chiropractic specializations.',
      spec: ['General chiropractic', 'Independent medical examiner', 'Internist', 'Neurology', 'Nutrition', 'Occupational health', 'Orthopedic', 'Pediatric', 'Radiology', 'Rehabilitation', 'Sports', 'Thermography'],
      modelLegend: 'Practice model',
      models: ['Solo owner clinic', 'Multi-DC group', 'Multidisciplinary clinic', 'Franchise location'],
      pay: ['Insurance & Medicare', 'Cash-based', 'Both'], payLabel: 'Payment model', payAny: 'any payment model',
      noun: 'DCs', btn: 'Start My Sample CRM Test', page: '../chiropractors-email-list/'
    },
    cardiologist: {
      label: 'Cardiologists',
      title: 'See How 50 Tagged Cardiology Records Fit Your Campaign',
      lead: "Name the sub-specialties and settings you need, and within 1 business day you'll receive matching rows to load into your own CRM.",
      specLegend: 'Sub-specialties', specHint: 'Each sub-specialty is filterable by state, ZIP code or practice setting.',
      spec: ['General cardiology', 'Interventional', 'Electrophysiology', 'Heart failure', 'Imaging', 'Preventive', 'Pediatric'],
      modelLegend: 'Practice setting',
      models: ['Employed (hospital or health system)', 'Independent (cardiology group)', 'Academic (teaching hospital)', 'Mixed (multispecialty group)'],
      pay: null,
      noun: '', btn: 'Send My Cardiology Rows', page: '../cardiologist-email-list/'
    },
    urologist: {
      label: 'Urologists',
      title: 'Review a Sample of Urologists Against Your Target Account List',
      lead: "Send your target subspecialties and practice settings, and we'll return matching rows for a side-by-side check shortly.",
      specLegend: 'Subspecialties', specHint: 'Each urologist carries 1 primary subspecialty tag, so counts never double up.',
      spec: ['General urology', 'Endourology', 'Urologic oncology', 'Pediatric urology', 'Urogynecology', 'Robotic & laparoscopic surgery'],
      modelLegend: 'Practice setting',
      models: ['Independent group', 'Hospital-employed', 'Academic'],
      pay: ['Frequent operators', 'Office-based', 'Both'], payLabel: 'Surgical focus', payAny: 'any surgical focus',
      noun: '', btn: 'Run My Account Match', page: '../urologist-email-list/'
    }
  };
  var $ = function (id) { return document.getElementById(id); };
  var params = new URLSearchParams(location.search);
  var key = LISTS[params.get('list')] ? params.get('list') : 'chiropractors';
  var st;
  var TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';

  function chip(label, on, cls, onClick) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = cls;
    b.innerHTML = TICK; b.appendChild(document.createTextNode(label));
    b.setAttribute('aria-pressed', on);
    b.addEventListener('click', onClick);
    return b;
  }
  function segBtn(container, labels, current, onPick) {
    container.innerHTML = '';
    labels.forEach(function (l) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = l;
      b.setAttribute('aria-pressed', l === current);
      b.addEventListener('click', function () {
        [].forEach.call(container.children, function (c) { c.setAttribute('aria-pressed', c === b); });
        onPick(l);
      });
      container.appendChild(b);
    });
  }

  function load(k) {
    key = k;
    var L = LISTS[k];
    st = { spec: {}, models: {}, pay: L.pay ? 'Both' : null };
    st.spec[L.spec[0]] = true;
    st.models[L.models[0]] = true;
    $('s-title').textContent = L.title;
    $('s-lead').textContent = L.lead;
    $('spec-legend').textContent = L.specLegend;
    $('spec-hint').textContent = L.specHint;
    $('model-legend').textContent = L.modelLegend;
    $('submit-lbl').textContent = L.btn;
    $('back-link').href = L.page;
    var ls = $('f-spec'); ls.innerHTML = ''; ls.setAttribute('aria-label', L.specLegend);
    L.spec.forEach(function (s) {
      var b = chip(s, !!st.spec[s], 'chip', function () { st.spec[s] = !st.spec[s]; b.setAttribute('aria-pressed', !!st.spec[s]); hideErr(); render(); });
      ls.appendChild(b);
    });
    var lm = $('f-model'); lm.innerHTML = ''; lm.setAttribute('aria-label', L.modelLegend);
    L.models.forEach(function (m) {
      var b = chip(m, !!st.models[m], 'chip tile', function () { st.models[m] = !st.models[m]; b.setAttribute('aria-pressed', !!st.models[m]); hideErr(); render(); });
      lm.appendChild(b);
    });
    $('pay-wrap').hidden = !L.pay;
    if (L.pay) { $('pay-label').textContent = L.payLabel; $('f-pay').setAttribute('aria-label', L.payLabel); }
    if (L.pay) segBtn($('f-pay'), L.pay, st.pay, function (p) { st.pay = p; render(); });
    var url = new URL(location.href); url.searchParams.set('list', k); history.replaceState(null, '', url);
    render();
  }

  function picked(list, map) { return list.filter(function (x) { return map[x]; }); }
  function summary() {
    var L = LISTS[key];
    var s = picked(L.spec, st.spec), m = picked(L.models, st.models);
    var sT = s.length === 0 ? 'No ' + L.specLegend.toLowerCase() + ' yet' : (s.length <= 2 ? s.join(' & ') : s.length + ' ' + L.specLegend.toLowerCase());
    var mT = m.length === 0 ? 'no ' + L.modelLegend.toLowerCase() + ' yet' : (m.length <= 2 ? m.join(' & ').toLowerCase() : m.length + ' ' + L.modelLegend.toLowerCase() + 's');
    var parts = [L.noun ? sT + ' ' + L.noun : sT, mT];
    if (L.pay) parts.push(st.pay === 'Both' ? L.payAny : st.pay.toLowerCase());
    parts.push($('f-states').value.trim() || 'all states');
    return parts.join(' · ');
  }
  function render() { $('summary').textContent = summary(); }
  function showErr(t, id) { $('error').textContent = t; $('error').hidden = false; if (id) { $(id).setAttribute('aria-invalid', 'true'); $(id).focus(); } }
  function hideErr() { $('error').hidden = true; }

  segBtn($('f-list'), Object.keys(LISTS).map(function (k) { return LISTS[k].label; }), LISTS[key].label, function (label) {
    var k = Object.keys(LISTS).filter(function (x) { return LISTS[x].label === label; })[0];
    load(k);
  });
  $('f-states').addEventListener('input', render);
  ['f-name', 'f-email', 'f-company'].forEach(function (id) { $(id).addEventListener('input', function () { hideErr(); $(id).removeAttribute('aria-invalid'); }); });

  $('submit').addEventListener('click', function () {
    var L = LISTS[key];
    if (!picked(L.spec, st.spec).length) return showErr('Pick at least one ' + L.specLegend.toLowerCase().replace(/ies$/, 'y').replace(/s$/, '') + '.');
    if (!picked(L.models, st.models).length) return showErr('Pick at least one ' + L.modelLegend.toLowerCase() + '.');
    if (!$('f-name').value.trim()) return showErr('Enter your name.', 'f-name');
    var e = $('f-email').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return showErr('Enter a valid work email so we can send your rows.', 'f-email');
    if (!$('f-company').value.trim()) return showErr('Enter your company name.', 'f-company');
    $('done-email').textContent = e;
    $('done-summary').textContent = summary();
    $('form-view').hidden = true; $('done-view').hidden = false;
    window.scrollTo(0, 0); $('done-title').focus();
  });
  $('edit').addEventListener('click', function () { $('done-view').hidden = true; $('form-view').hidden = false; window.scrollTo(0, 0); });

  load(key);
})();
