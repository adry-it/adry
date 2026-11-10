(async () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hover = matchMedia('(hover:hover)').matches;
  const C = window.ADRY;
  // I servizi sono gestiti dal portale admin; in caso di rete non disponibile resta il catalogo di fallback.
  try {
    const servicesResponse = await fetch('data/services.json', { cache: 'no-cache' });
    if (servicesResponse.ok) {
      const servicesData = await servicesResponse.json();
      if (Array.isArray(servicesData.items)) C.services = servicesData.items;
    }
  } catch (error) { console.warn('Uso i servizi di riserva:', error); }
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const wa = text => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`;
  const icon = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
  const DAYS = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

  /* ===== link WhatsApp generici ===== */
  const hello = 'Ciao Adry! Vorrei qualche informazione.';
  ['fab', 'waRow'].forEach(id => { const a = $('#' + id); if (a) a.href = wa(hello); });
  $('#partnerLink').href = C.partnerUrl;
  $('#yr').textContent = new Date().getFullYear();

  /* ===== intro ===== */
  const intro = $('#intro');
  const hideIntro = () => { intro.classList.add('out'); document.body.classList.remove('lock'); $('#h1').classList.add('in'); };
  document.body.classList.add('lock');
  if (reduce) { intro.remove(); document.body.classList.remove('lock'); $('#h1').classList.add('in'); }
  else setTimeout(hideIntro, 2300);

  /* ===== titolo hero: parole che salgono ===== */
  (function splitH1() {
    const h = $('#h1'); let d = 0;
    const walk = (node, out) => {
      node.childNodes.forEach(n => {
        if (n.nodeType === 3) n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) out.appendChild(document.createTextNode(' '));
          else { const w = document.createElement('span'); w.className = 'w'; w.innerHTML = `<span style="--d:${d++}">${esc(t)}</span>`; out.appendChild(w); }
        });
        else { const c = n.cloneNode(false); out.appendChild(c); walk(n, c); }
      });
    };
    const f = document.createDocumentFragment(); walk(h, f); h.textContent = ''; h.appendChild(f);
  })();

  /* ===== header, progresso, drawer ===== */
  const hdr = $('#hdr'), bar = $('#progress'), drawer = $('#drawer'), burger = $('#burger');
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    hdr.classList.toggle('scrolled', y > 30);
    hdr.classList.toggle('hide', y > lastY && y > 500 && !drawer.classList.contains('open'));
    lastY = y;
  }, { passive: true });
  const toggleDrawer = o => {
    drawer.classList.toggle('open', o); drawer.setAttribute('aria-hidden', String(!o));
    burger.setAttribute('aria-expanded', String(o)); document.body.classList.toggle('lock', o);
  };
  burger.addEventListener('click', () => toggleDrawer(!drawer.classList.contains('open')));
  $$('a', drawer).forEach(a => a.addEventListener('click', () => toggleDrawer(false)));
  const links = $$('.nav a[href^="#"]');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['servizi', 'prodotti', 'consiglio', 'promo', 'prenota', 'dove'].forEach(id => spy.observe($('#' + id)));

  /* ===== reveal + contatori ===== */
  const countUp = el => {
    const to = +el.dataset.count, suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = to + suf; return; }
    const t0 = performance.now();
    (function f(t) { const k = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) requestAnimationFrame(f); })(t0);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    $$('[data-count]', e.target).forEach(countUp);
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  const watch = r => $$('.rv:not(.in)', r).forEach(el => io.observe(el));
  watch(document);

  /* ===== petali che cadono nell'hero ===== */
  if (!reduce) {
    const pw = $('.petals');
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('i');
      p.style.cssText = `left:${Math.random() * 100}%;--dx:${(Math.random() - .5) * 240}px;animation-duration:${14 + Math.random() * 14}s;animation-delay:${-Math.random() * 20}s;transform:scale(${.6 + Math.random() * .9})`;
      pw.appendChild(p);
    }
  }

  /* ===== scintille (canvas) al click / tap ===== */
  const cv = $('#sparkles'), cx = cv.getContext('2d');
  let parts = [], running = false;
  const sizeCv = () => { const d = Math.min(devicePixelRatio || 1, 2); cv.width = innerWidth * d; cv.height = innerHeight * d; cx.setTransform(d, 0, 0, d, 0, 0); };
  sizeCv(); addEventListener('resize', sizeCv);
  function burst(x, y, n = 36) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, v = 1.5 + Math.random() * 4.5;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1.5, r: 1.5 + Math.random() * 3, life: 0, max: 50 + Math.random() * 40, c: Math.random() < .5 ? '201,164,92' : Math.random() < .5 ? '163,19,31' : '232,201,192' });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  function tick() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(p => p.life < p.max);
    for (const p of parts) {
      p.life++; p.x += p.vx; p.y += p.vy; p.vy += .12; p.vx *= .98;
      const k = 1 - p.life / p.max;
      cx.fillStyle = `rgba(${p.c},${k})`;
      cx.beginPath(); cx.moveTo(p.x, p.y - p.r * 2); cx.lineTo(p.x + p.r * .6, p.y); cx.lineTo(p.x, p.y + p.r * 2); cx.lineTo(p.x - p.r * .6, p.y); cx.fill();
    }
    if (parts.length) requestAnimationFrame(tick); else running = false;
  }
  addEventListener('click', e => { if (e.target.closest('.btn,.chips button,.slots button,.cal-g button,.opt,.fab')) burst(e.clientX, e.clientY, 22); });

  /* ===== alone che segue il mouse, bottoni magnetici, parallasse anelli ===== */
  const glow = $('#cursor');
  if (hover && !reduce) {
    let gx = 0, gy = 0, tx = 0, ty = 0;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; glow.classList.add('on'); }, { passive: true });
    (function loop() { gx += (tx - gx) * .12; gy += (ty - gy) * .12; glow.style.transform = `translate(${gx}px,${gy}px)`; requestAnimationFrame(loop); })();
    $$('.magnetic').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
    const hv = $('#hv'), r1 = $('#r1'), r2 = $('#r2');
    hv.addEventListener('pointermove', e => {
      const r = hv.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
      r1.style.setProperty('--px', dx * 30 + 'px'); r1.style.setProperty('--py', dy * 24 + 'px');
      r2.style.setProperty('--px', dx * -38 + 'px'); r2.style.setProperty('--py', dy * -28 + 'px');
    });
    hv.addEventListener('pointerleave', () => { [r1, r2].forEach(r => { r.style.setProperty('--px', '0px'); r.style.setProperty('--py', '0px'); }); });
  }
  // parallasse allo scroll sugli anelli
  if (!reduce) addEventListener('scroll', () => { const y = Math.min(scrollY, 900); $('#hv').style.transform = `translateY(${y * .12}px)`; }, { passive: true });

  /* tilt 3D con luce sulle card */
  const tiltOn = (el, max = 8) => {
    if (!hover || reduce) return;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--ry', (x - .5) * max + 'deg'); el.style.setProperty('--rx', (.5 - y) * max + 'deg');
      el.style.setProperty('--cx', x * r.width + 'px'); el.style.setProperty('--cy', y * r.height + 'px');
      el.style.setProperty('--sx', (x * 240 - 120) + '%');
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); el.style.setProperty('--sx', '-120%'); });
  };
  tiltOn($('#promoCard'), 7); tiltOn($('#voucher'), 10);

  /* ===== tab con indicatore scorrevole ===== */
  function initTabs(tabs, attr, onPick) {
    const ink = $('.tab-ink', tabs), btns = $$('button', tabs);
    const place = () => { const b = $('button.on', tabs); ink.style.left = b.offsetLeft + 'px'; ink.style.width = b.offsetWidth + 'px'; };
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', String(x === b)); });
      place(); onPick(b.dataset[attr]);
    }));
    document.fonts?.ready.then(place); place(); addEventListener('resize', place);
    return place;
  }

  /* ===== servizi ===== */
  const grid = $('#svcGrid');
  grid.innerHTML = C.services.map(s => `
    <article class="card${s.promo ? ' promo-c' : ''}" data-cat="${s.cat}">
      ${s.badge ? `<span class="tag">${esc(s.badge)}</span>` : ''}${s.promo ? '<span class="tag" style="background:#fff;color:var(--wine)">Promo</span>' : ''}
      <div class="ico">${icon(s.icon)}</div>
      <h3>${esc(s.name)}</h3>
      <p>${esc(s.desc)}</p>
      ${s.price ? `<span class="pr">${esc(s.price)}</span>` : ''}
      ${s.id !== 'acconciatura' ? `<a class="bk" href="#prenota" data-pick="${s.id}">Prenota</a>` : ''}
    </article>`).join('');
  $$('.card', grid).forEach(c => tiltOn(c, 6));
  initTabs($('.tabs[aria-label="Categoria servizi"]'), 'cat', cat => {
    $$('.card', grid).forEach(c => c.classList.toggle('hide', cat !== 'tutti' && c.dataset.cat !== cat));
  });

  /* ===== negozio Lyca + carrello (ordine via WhatsApp) ===== */
  const eur = n => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);
  const hasPrice = p => p.price != null && p.price !== '' && !isNaN(Number(p.price));
  const img0 = p => (p.images && p.images[0]) ? String(p.images[0]).replace(/^\/+/, '') : '';
  const CAT_ICON = { Viso: 'face', Corpo: 'drop', Capelli: 'scissors', 'Mani e piedi': 'sparkle' };
  const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200); };
  let shop = [], shopCat = 'Tutti';
  const CART_KEY = 'adry-cart';
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch { cart = {}; }
  const saveCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {} };
  const prodById = id => shop.find(p => p.id === id);

  async function loadShop() {
    const clean = items => (items || []).filter(p => p && p.name).map(p => ({ ...p, id: p.id || slugify(p.name), category: p.category || 'Altro', available: p.available !== false }));
    try {
      const r = await fetch('data/lyca.json', { cache: 'no-cache' }); if (!r.ok) throw 0;
      return clean((await r.json()).items);
    } catch { return clean((window.LYCA_FALLBACK || {}).items); }
  }
  const slugify = t => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  function shopCard(p) {
    const out = !p.available, q = cart[p.id] || 0;
    const price = hasPrice(p) ? `<span class="pc-price">${eur(Number(p.price))}</span>` : '<span class="pc-price ask">Su richiesta</span>';
    const act = out ? '<button class="add" type="button" disabled>Esaurito</button>'
      : q ? qtyHtml(p.id, q) : `<button class="add" type="button" data-add="${esc(p.id)}" aria-label="Acquista ${esc(p.name)}">${icon('bag')}<span>Acquista</span></button>`;
    return `<article class="pcard product-compact${out ? ' out' : ''}" data-id="${esc(p.id)}">
      <div class="pc-body">
        <div class="product-labels">${p.is_new && !out ? '<span class="tag">Novità</span>' : ''}${out ? '<span class="tag off">Esaurito</span>' : ''}<span class="pc-cat">${esc(p.category)}</span></div>
        <h4><button class="product-detail-link" type="button" data-detail="${esc(p.id)}">${esc(p.name)}</button></h4>
        <div class="pc-foot">${price}<span class="pc-act">${act}</span></div>
      </div></article>`;
  }
  const qtyHtml = (id, q) => `<span class="qty"><button type="button" data-dec="${esc(id)}" aria-label="Diminuisci">${icon('minus')}</button><b>${q}</b><button type="button" data-inc="${esc(id)}" aria-label="Aumenta">${icon('plus')}</button></span>`;

  // Scheda prodotto: la descrizione e gli eventuali formati si vedono solo entrando nel prodotto.
  const detailLayer = document.createElement('div');
  detailLayer.className = 'product-detail-overlay';
  detailLayer.hidden = true;
  detailLayer.innerHTML = `<section class="product-detail" role="dialog" aria-modal="true" aria-labelledby="productDetailTitle">
    <button class="product-detail-close" type="button" aria-label="Chiudi">×</button>
    <div class="product-detail-content"></div>
  </section>`;
  document.body.appendChild(detailLayer);
  function openProductDetail(id) {
    const p = prodById(id); if (!p) return;
    const im = img0(p);
    detailLayer.querySelector('.product-detail-content').innerHTML = `
      ${im ? `<img class="product-detail-image" src="${esc(im)}" alt="${esc(p.name)}">` : ''}
      <span class="pc-cat">${esc(p.category)}</span>
      <h2 id="productDetailTitle">${esc(p.name)}</h2>
      ${p.size ? `<p class="product-detail-size">${esc(p.size)}</p>` : ''}
      <p class="product-detail-description">${esc(p.description || 'Per informazioni sul prodotto, contattaci su WhatsApp.')}</p>
      <div class="pc-foot">${hasPrice(p) ? `<span class="pc-price">${eur(Number(p.price))}</span>` : '<span class="pc-price ask">Su richiesta</span>'}
      ${p.available === false ? '<span class="tag off">Esaurito</span>' : `<button class="add" type="button" data-add="${esc(p.id)}">${icon('bag')}<span>Acquista</span></button>`}</div>`;
    detailLayer.hidden = false; document.body.classList.add('lock');
    detailLayer.querySelector('.product-detail-close').focus();
  }
  function closeProductDetail() { detailLayer.hidden = true; document.body.classList.remove('lock'); }
  detailLayer.addEventListener('click', e => { if (e.target === detailLayer || e.target.closest('.product-detail-close')) closeProductDetail(); });
  document.addEventListener('click', e => { const b = e.target.closest('[data-detail]'); if (b) openProductDetail(b.dataset.detail); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !detailLayer.hidden) closeProductDetail(); });

  function renderShop() {
    const q = $('#shopSearch').value.trim().toLowerCase();
    const l = shop.filter(p => (shopCat === 'Tutti' || p.category === shopCat) && (!q || [p.name, p.category, p.description, p.size].some(x => (x || '').toLowerCase().includes(q))));
    $('#shopGrid').innerHTML = l.length ? l.map(shopCard).join('') : '<div class="empty">Nessun prodotto trovato.</div>';
  }
  function renderTabs() {
    const cats = ['Tutti', ...new Set(shop.map(p => p.category))], box = $('#shopTabs');
    $$('button', box).forEach(b => b.remove());
    cats.forEach(c => { const b = document.createElement('button'); b.setAttribute('role', 'tab'); b.dataset.c = c; b.textContent = c; b.className = c === shopCat ? 'on' : ''; b.setAttribute('aria-selected', String(c === shopCat)); box.insertBefore(b, $('.tab-ink', box)); });
    initTabs(box, 'c', c => { shopCat = c; renderShop(); });
  }

  /* carrello */
  const cartEl = $('#cart'), cartOv = $('#cartOv'), cartBtn = $('#cartBtn');
  const lines = () => Object.entries(cart).map(([id, q]) => ({ p: prodById(id), q })).filter(x => x.p && x.q > 0);
  function setQty(id, q) {
    if (q <= 0) delete cart[id]; else cart[id] = Math.min(q, 20);
    saveCart(); paintCart(); renderShop();
  }
  function cartMessage() {
    const ls = lines(), name = $('#cartName').value.trim();
    const allPriced = ls.every(x => hasPrice(x.p));
    const total = ls.reduce((t, x) => t + (hasPrice(x.p) ? Number(x.p.price) * x.q : 0), 0);
    return [
      'Ciao Adry! Vorrei ordinare questi prodotti Lyca:', '',
      ...ls.map(x => `• ${x.q} × ${x.p.name}${x.p.size ? ' (' + x.p.size + ')' : ''}${hasPrice(x.p) ? ' — ' + eur(Number(x.p.price) * x.q) : ''}`), '',
      total ? `Totale${allPriced ? '' : ' (prodotti con prezzo)'}: ${eur(total)}` : '',
      name ? `Nome: ${name}` : '',
      'Ritiro in negozio. Potete confermarmi la disponibilità? Grazie!'
    ].filter((l, i, a) => l !== '' || (a[i - 1] !== '' && i)).join('\n');
  }
  function paintCart() {
    const ls = lines(), n = ls.reduce((t, x) => t + x.q, 0);
    cartBtn.hidden = n === 0 && !cartEl.classList.contains('open');
    $('#cartCount').textContent = n;
    $('#cartList').innerHTML = ls.length ? ls.map(({ p, q }) => `<div class="ci"><div class="ci-img">${img0(p) ? `<img src="${esc(img0(p))}" alt="">` : icon(CAT_ICON[p.category] || 'leaf')}</div><div><h4>${esc(p.name)}</h4><small>${esc(p.size || p.category)}</small></div><div class="ci-sum">${hasPrice(p) ? eur(Number(p.price) * q) : '—'}</div>${qtyHtml(p.id, q)}</div>`).join('') : '<p class="cart-empty">Il carrello è vuoto.<br>Aggiungi qualche prodotto Lyca!</p>';
    const total = ls.reduce((t, x) => t + (hasPrice(x.p) ? Number(x.p.price) * x.q : 0), 0), allPriced = ls.every(x => hasPrice(x.p));
    $('#cartTot').textContent = !ls.length ? '—' : total ? eur(total) + (allPriced ? '' : ' + altro') : 'Su richiesta';
    const send = $('#cartSend');
    send.setAttribute('aria-disabled', String(!ls.length));
    send.href = ls.length ? wa(cartMessage()) : '#';
    send.onclick = e => { if (!ls.length) e.preventDefault(); else burst(e.clientX, e.clientY, 40); };
  }
  function openCart(o) {
    cartEl.classList.toggle('open', o); cartEl.setAttribute('aria-hidden', String(!o)); cartOv.hidden = !o;
    document.body.classList.toggle('lock', o); paintCart();
    if (o) $('#cartX').focus({ preventScroll: true });
  }
  cartBtn.onclick = () => openCart(true);
  $('#cartX').onclick = () => openCart(false);
  cartOv.onclick = () => openCart(false);
  $('#cartName').addEventListener('input', paintCart);
  $('#cartClear').onclick = () => { cart = {}; saveCart(); paintCart(); renderShop(); };
  addEventListener('keydown', e => { if (e.key === 'Escape' && cartEl.classList.contains('open')) openCart(false); });
  document.addEventListener('click', e => {
    const t = e.target, add = t.closest('[data-add]'), inc = t.closest('[data-inc]'), dec = t.closest('[data-dec]');
    if (add) { const id = add.dataset.add; setQty(id, 1); toast(`${prodById(id).name} aggiunto al carrello`); cartBtn.classList.remove('bump'); void cartBtn.offsetWidth; cartBtn.classList.add('bump'); }
    else if (inc) setQty(inc.dataset.inc, (cart[inc.dataset.inc] || 0) + 1);
    else if (dec) setQty(dec.dataset.dec, (cart[dec.dataset.dec] || 0) - 1);
  });
  $('#shopSearch').addEventListener('input', renderShop);
  loadShop().then(items => {
    shop = items;
    Object.keys(cart).forEach(id => { if (!prodById(id)) delete cart[id]; });
    renderTabs(); renderShop(); paintCart();
    if (!shop.length) $('#shopGrid').innerHTML = '<div class="empty">Presto nuovi prodotti Lyca. Scrivici su WhatsApp per informazioni!</div>';
  });

  /* ===== quiz ===== */
  const QS = [
    { q: 'Cosa ti serve di più in questo momento?', o: [['Staccare e rilassarmi', 'relax'], ['Una pelle più luminosa', 'pelle'], ['Cambiare look ai capelli', 'capelli'], ['Pelle liscia, senza peli', 'liscia']] },
    { q: 'Quanto tempo hai a disposizione?', o: [['Un’oretta', 'poco'], ['Mezza giornata', 'medio'], ['Mi prendo tutto il tempo', 'molto']] },
    { q: 'Per cosa ti prendi cura di te?', o: [['Per me, senza un motivo', 'me'], ['Un evento speciale', 'evento'], ['Cambio di stagione', 'stagione']] }
  ];
  const RES = {
    relax: ['Massaggio rilassante', 'Manualità lente e oli caldi per sciogliere le tensioni.', 'massaggio'],
    pelle: ['Pulizia viso + Scrub corpo', 'Il pacchetto Nuova Stagione a 90 €: pelle rigenerata e luminosa, in un’unica seduta.', 'promo'],
    capelli: ['Colore & trattamento ristrutturante', 'Un look nuovo con capelli sani, lucidi e morbidi.', 'colore'],
    liscia: ['Depilazione laser diodo 808', 'Consulenza, prova gratuita su una piccola zona e preventivo su misura.', 'laser']
  };
  let qi = 0, ans = [];
  const qb = $('#quizBody'), qbar = $('#quizBar');
  function renderQ() {
    qbar.style.width = (qi / QS.length * 100) + '%';
    if (qi >= QS.length) {
      const key = ans[0], r = RES[key] || RES.relax;
      let extra = '';
      if (ans[2] === 'evento') extra = ' Per l’occasione possiamo consigliarti una piega adatta all’evento.';
      if (ans[1] === 'poco' && key === 'pelle') extra += ' (Ti serve un po’ più di un’ora: prenota senza fretta.)';
      qbar.style.width = '100%';
      qb.innerHTML = `<div class="qres"><p style="margin:0;letter-spacing:.3em;text-transform:uppercase;font-size:12px">Il tuo rituale ideale</p><div class="rname">${esc(r[0])}</div><p>${esc(r[1] + extra)}</p><div class="row"><a class="btn solid" href="#prenota" data-pick="${r[2]}">Prenota questo</a><button class="btn ghost" id="qAgain" type="button">Rifai il quiz</button></div></div>`;
      burst(innerWidth / 2, innerHeight / 2, 50);
      $('#qAgain').onclick = () => { qi = 0; ans = []; renderQ(); };
      return;
    }
    const q = QS[qi];
    qb.innerHTML = `<h3>${esc(q.q)}</h3><div class="opts">${q.o.map(([t, v]) => `<button class="opt" type="button" data-v="${v}">${esc(t)}</button>`).join('')}</div>`;
    $$('.opt', qb).forEach(b => b.onclick = () => { ans.push(b.dataset.v); qi++; renderQ(); });
  }
  renderQ();

  /* ===== countdown promo ===== */
  const cd = $('#countdown'), end = new Date(C.promoEnd).getTime();
  function paintCd() {
    const ms = end - Date.now();
    if (ms <= 0) { cd.innerHTML = '<p>Promo conclusa — chiedici le novità!</p>'; return false; }
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
    cd.innerHTML = [[d, 'giorni'], [h, 'ore'], [m, 'min'], [s, 'sec']].map(([n, l]) => `<div><b>${pad(n)}</b><span>${l}</span></div>`).join('') + '<p>alla fine della promo</p>';
    return true;
  }
  if (paintCd()) setInterval(paintCd, 1000);

  /* ===== orari + aperto ora ===== */
  const fmtH = v => v ? v.map(r => `${r[0].replace(/^0/, '')} – ${r[1].replace(/^0/, '')}`).join(' · ') : 'Chiuso';
  const order = [1, 2, 3, 4, 5, 6, 0], todayN = new Date().getDay();
  $('#hours').innerHTML = order.map(n => `<div class="${n === todayN ? 'today' : ''}"><span>${DAYS[n][0].toUpperCase() + DAYS[n].slice(1)}</span><span>${fmtH(C.hours[n])}</span></div>`).join('');
  (function openNow() {
    const now = new Date(), h = C.hours[now.getDay()] || [], t = pad(now.getHours()) + ':' + pad(now.getMinutes());
    const r = h.find(x => t >= x[0] && t < x[1]);
    $('#openNow').textContent = r ? `Negozio aperto · fino alle ${r[1]}` : 'Benvenuta da Adry';
  })();

  /* ===== PRENOTAZIONE ===== */
  const st = { svc: null, date: null, time: null, step: 0 };
  const bkS = $('#bkServices');
  bkS.innerHTML = ['estetica', 'parrucchiere'].map(cat => `<span class="grp">${cat}</span>` + C.services.filter(s => s.cat === cat && s.id !== 'acconciatura').map(s => `<button type="button" data-id="${s.id}">${esc(s.name)}</button>`).join('')).join('');
  const svcById = id => C.services.find(s => s.id === id);
  function pickSvc(id) {
    st.svc = svcById(id) || null;
    $$('button', bkS).forEach(b => b.classList.toggle('on', b.dataset.id === id));
    paint();
  }
  bkS.addEventListener('click', e => { const b = e.target.closest('button'); if (b) pickSvc(b.dataset.id); });
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-pick]'); if (!a) return;
    pickSvc(a.dataset.pick); go(0);
  });

  // calendario
  const now0 = new Date(); now0.setHours(0, 0, 0, 0);
  let view = new Date(now0.getFullYear(), now0.getMonth(), 1);
  const maxView = new Date(now0.getFullYear(), now0.getMonth() + 3, 1);
  const closed = d => !C.hours[d.getDay()] || C.closedDates.includes(iso(d)) || d < now0; // la domenica resta chiusa; estetica e parrucchiere accettano richieste anche fuori orario negozio
  function renderCal() {
    $('#calTitle').textContent = `${MONTHS[view.getMonth()]} ${view.getFullYear()}`;
    $('#calPrev').disabled = view <= new Date(now0.getFullYear(), now0.getMonth(), 1);
    $('#calNext').disabled = view >= new Date(maxView.getFullYear(), maxView.getMonth(), 1);
    const first = (view.getDay() + 6) % 7, days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    let h = '<i></i>'.repeat(first);
    for (let n = 1; n <= days; n++) {
      const d = new Date(view.getFullYear(), view.getMonth(), n), k = iso(d);
      h += `<button type="button" data-d="${k}" ${closed(d) ? 'disabled' : ''} class="${d.getTime() === now0.getTime() ? 'today' : ''}${st.date === k ? ' on' : ''}">${n}</button>`;
    }
    $('#calGrid').innerHTML = h;
  }
  $('#calPrev').onclick = () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderCal(); };
  $('#calNext').onclick = () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderCal(); };
  $('#calGrid').addEventListener('click', e => {
    const b = e.target.closest('button[data-d]'); if (!b) return;
    st.date = b.dataset.d; st.time = null; renderCal(); renderSlots(); paint();
  });
  const parseD = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const longDate = k => { const d = parseD(k); return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`; };
  function renderSlots() {
    const box = $('#slots');
    if (!st.date) { box.innerHTML = ''; $('#slotsDay').textContent = 'Scegli prima un giorno.'; return; }
    const d = parseD(st.date), o = C.bookingFrom, c = C.bookingTo;
    $('#slotsDay').textContent = longDate(st.date);
    const toMin = t => +t.slice(0, 2) * 60 + +t.slice(3), out = [];
    $('#slotsDay').textContent = longDate(st.date) + ' · orari indicativi, li confermiamo su WhatsApp';
    const isToday = d.getTime() === now0.getTime(), nowMin = new Date().getHours() * 60 + new Date().getMinutes();
    for (let m = toMin(o); m + C.slotMinutes <= toMin(c); m += C.slotMinutes) if (!isToday || m > nowMin + 30) out.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
    box.innerHTML = out.length ? out.map(t => `<button type="button" data-t="${t}" class="${st.time === t ? 'on' : ''}">${t}</button>`).join('') : '<p class="mut">Nessun orario libero oggi: prova un altro giorno.</p>';
  }
  $('#slots').addEventListener('click', e => {
    const b = e.target.closest('button[data-t]'); if (!b) return;
    st.time = b.dataset.t; renderSlots(); paint();
  });

  const panes = $$('.pane'), steps = $$('#steps li');
  const ready = i => [!!st.svc, !!st.date, !!st.time, true][i];
  function go(i) {
    st.step = Math.max(0, Math.min(3, i));
    panes.forEach((p, k) => p.classList.toggle('on', k === st.step));
    steps.forEach((s, k) => s.classList.toggle('on', k <= st.step));
    if (st.step === 1) renderCal();
    if (st.step === 2) renderSlots();
    paint();
  }
  $('#bkNext').onclick = () => go(st.step + 1);
  $('#bkBack').onclick = () => go(st.step - 1);
  $('#bkName').addEventListener('input', paint);
  $('#bkNote').addEventListener('input', paint);

  function message() {
    const name = $('#bkName').value.trim(), note = $('#bkNote').value.trim();
    return [
      'Ciao Adry! Vorrei prenotare un appuntamento.',
      '',
      `Servizio: ${st.svc.name}`,
      `Giorno: ${longDate(st.date)}`,
      `Orario: ${st.time}`,
      name ? `Nome: ${name}` : '',
      note ? `Note: ${note}` : '',
      '',
      'Potete confermarmi la disponibilità? Grazie!'
    ].filter((l, i, a) => l !== '' || (a[i - 1] !== '' && i)).join('\n');
  }
  function paint() {
    $('#sumSvc').textContent = st.svc ? st.svc.name : '—';
    $('#sumDay').textContent = st.date ? longDate(st.date) : '—';
    $('#sumTime').textContent = st.time || '—';
    $('#bkBack').hidden = st.step === 0;
    const last = st.step === 3;
    $('#bkNext').hidden = last;
    $('#bkNext').disabled = !ready(st.step);
    const full = st.svc && st.date && st.time;
    const send = $('#bkSend');
    send.setAttribute('aria-disabled', String(!full));
    send.href = full ? wa(message()) : '#';
    send.onclick = e => { if (!full) e.preventDefault(); else burst(e.clientX, e.clientY, 40); };
  }
  go(0);

  /* ===== buono regalo ===== */
  let amount = 50;
  const vName = $('#vName');
  function paintV() {
    $('#vAmount').textContent = amount + ' €';
    $('#vTo').textContent = vName.value.trim() ? 'per ' + vName.value.trim() : 'per una persona speciale';
    $('#vSend').href = wa(`Ciao Adry! Vorrei acquistare un buono regalo da ${amount} €${vName.value.trim() ? ' per ' + vName.value.trim() : ''}. Come posso fare?`);
  }
  $('#vChips').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#vChips button').forEach(x => x.classList.toggle('on', x === b)); amount = +b.dataset.v; paintV();
  });
  vName.addEventListener('input', paintV); paintV();
})();
