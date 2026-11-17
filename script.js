/* ============================================================
   YAQEEN WAEL — PORTFOLIO SCRIPTS (Vanilla JS)
   Modules: config · preloader · nav · menu · reveal · counters
            particles · portfolio · lightbox · CV · contact · tilt
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     0. CONFIG — edit this block to personalize the site
  --------------------------------------------------------- */
  const CONFIG = {
    email: 'yaqeenwael95@gmail.com',
    /* CV image: put the file next to index.html and set its name here,
       e.g. cvImage: 'my-cv.jpg' — the preview, lightbox and download
       will switch to the real document automatically. */
    cvImage: null,
    /* Add your real links when ready (leave null to keep the slot): */
    linkedin: null,   // e.g. 'https://www.linkedin.com/in/username'
    whatsapp: null    // e.g. 'https://wa.me/2010XXXXXXXX'
  };

  /* Portfolio projects — HOW TO ADD A REAL PROJECT:
     1) Put your image file next to index.html (or use a full URL)
     2) Set  image: 'your-image.jpg'
     3) Give it a title + description. The card instantly becomes
        clickable and opens in the lightbox with prev/next navigation. */
  const PROJECTS = [
    { title: 'Video Editing Project',  category: 'Video Editing',   icon: 'i-clapper',  image: null, desc: 'A dedicated slot for my video editing work — the visual will be added soon.' },
    { title: 'Motion Graphics Piece',  category: 'Motion Graphics', icon: 'i-motion',   image: null, desc: 'A dedicated slot for my motion graphics work — the visual will be added soon.' },
    { title: 'Graphic Design Project', category: 'Graphic Design',  icon: 'i-palette',  image: null, desc: 'A dedicated slot for my graphic design work — the visual will be added soon.' },
    { title: 'Creative Design Set',    category: 'Creative Designs',icon: 'i-sparkle',  image: null, desc: 'A dedicated slot for my creative designs — the visual will be added soon.' },
    { title: 'Digital Media Project',  category: 'Digital Media',   icon: 'i-globe',    image: null, desc: 'A dedicated slot for my digital media projects — the visual will be added soon.' }
  ];

  /* --------- helpers --------- */
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const icon = (id, cls) => '<svg class="ic ' + (cls || '') + '" aria-hidden="true"><use href="#' + id + '"/></svg>';

  /* --------- 1. Preloader --------- */
  const preloader = $('#preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('done'), REDUCED ? 0 : 650);
  });
  /* extra failsafe (in case 'load' never fires e.g. blocked font) */
  setTimeout(() => preloader.classList.add('done'), 4200);

  /* --------- 2. Sticky nav + scroll progress + back-to-top --------- */
  const nav = $('#navbar'), progress = $('#progress'), toTop = $('#toTop');
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    toTop.classList.toggle('show', y > 600);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }));

  /* --------- 3. Mobile menu --------- */
  const burger = $('#burger'), mobileMenu = $('#mobileMenu');
  function setMenu(open) {
    burger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('no-scroll', open);
  }
  burger.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
  $$('.mm-links a', mobileMenu).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* --------- 4. Active nav link (scroll spy) --------- */
  const navLinks = $$('.nav-links a');
  const sections = navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      navLinks.forEach(a => {
        const on = a.getAttribute('href') === '#' + en.target.id;
        a.classList.toggle('active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  /* --------- 5. Scroll reveal + stagger --------- */
  const revealEls = $$('[data-reveal]');
  revealEls.forEach(el => {
    const d = el.getAttribute('data-delay');
    if (d) el.style.transitionDelay = d + 'ms';
  });
  if (REDUCED) {
    revealEls.forEach(el => el.classList.add('in'));
    $('#timeline').classList.add('drawn');
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));

    /* education timeline draws its line when visible */
    const tl = $('#timeline');
    new IntersectionObserver((ents, obs) => {
      if (ents[0].isIntersecting) { tl.classList.add('drawn'); obs.disconnect(); }
    }, { threshold: 0.3 }).observe(tl);
  }

  /* --------- 6. Animated counters --------- */
  function runCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const dur = 1500, t0 = performance.now();
    function tick(t) {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const statNums = $$('[data-count]');
  if (statNums.length) {
    if (REDUCED) {
      statNums.forEach(el => el.textContent = el.getAttribute('data-count'));
    } else {
      new IntersectionObserver((ents, obs) => {
        if (ents[0].isIntersecting) { statNums.forEach(runCounter); obs.disconnect(); }
      }, { threshold: 0.4 }).observe($('.stats'));
    }
  }

  /* --------- 7. Hero particles (champagne dust) --------- */
  (function particles() {
    if (REDUCED) return;
    const canvas = $('#heroCanvas');
    const ctx = canvas.getContext('2d');
    let W, H, parts = [], raf;
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(26, Math.min(70, Math.round(W / 20)));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: 0.6 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -0.06 - Math.random() * 0.28,
        a: 0.12 + Math.random() * 0.4,
        tw: Math.random() * Math.PI * 2
      }));
    }
    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy; p.tw += 0.02;
        if (p.y < -8) { p.y = H + 8; p.x = Math.random() * W; }
        if (p.x < -8) p.x = W + 8; else if (p.x > W + 8) p.x = -8;
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw + t * 0.001));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(217,184,143,' + alpha.toFixed(3) + ')';
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
      else if (!raf) raf = requestAnimationFrame(frame);
    });
    raf = requestAnimationFrame(frame);
  })();

  /* --------- 8. Portfolio: render + filter --------- */
  const grid = $('#workGrid');
  function renderPortfolio() {
    grid.innerHTML = PROJECTS.map((p, i) => {
      const media = p.image
        ? '<img src="' + p.image + '" alt="' + p.title + ' — ' + p.category + '" loading="lazy">'
        : '<div class="p-empty"><span class="pe-icon">' + icon(p.icon) + '</span></div>';
      return (
        '<figure class="p-tile" data-index="' + i + '" tabindex="0" role="button" ' +
          'aria-label="' + p.title + ' — open preview">' +
          '<div class="p-media">' + media + '</div>' +
          '<span class="p-tag chip dark">' + p.category + '</span>' +
          '<span class="p-view">' + (p.image ? 'View' : 'Preview') + '</span>' +
          '<figcaption class="p-info"><h3>' + p.title + '</h3>' +
          '<p>' + (p.image ? (p.desc || p.category) : 'Visual coming soon — this slot is ready for the final work.') + '</p></figcaption>' +
        '</figure>');
    }).join('');
    $$('.p-tile', grid).forEach(tile => {
      tile.addEventListener('click', () => openLightbox([PROJECTS[+tile.dataset.index]], 0));
      tile.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox([PROJECTS[+tile.dataset.index]], 0); }
      });
    });
    /* filter counts */
    const cats = {};
    PROJECTS.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
    $$('.filter-btn').forEach(btn => {
      const f = btn.dataset.filter;
      const sup = btn.querySelector('sup');
      if (sup) sup.textContent = f === 'all' ? PROJECTS.length : (cats[f] || 0);
    });
  }
  renderPortfolio();

  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      $$('.p-tile', grid).forEach(tile => {
        const p = PROJECTS[+tile.dataset.index];
        const show = f === 'all' || p.category === f;
        tile.classList.toggle('hide', !show);
        if (show && !REDUCED) { tile.classList.remove('pop'); void tile.offsetWidth; tile.classList.add('pop'); }
      });
    });
  });

  /* --------- 9. Lightbox --------- */
  const lb = $('#lightbox'), lbMedia = $('#lbMedia'), lbTitle = $('#lbTitle'),
        lbCat = $('#lbCat'), lbNote = $('#lbNote'), lbCount = $('#lbCount'),
        lbPrev = $('#lbPrev'), lbNext = $('#lbNext');
  let lbItems = [], lbIndex = 0, lastFocus = null;

  function renderLbItem() {
    const it = lbItems[lbIndex];
    if (it.image) {
      lbMedia.innerHTML = '<img src="' + it.image + '" alt="' + it.title + '">';
    } else {
      lbMedia.innerHTML =
        '<div class="lb-ph"><div class="pe-icon">' + icon(it.icon) + '</div>' +
        '<h4>' + it.title + '</h4><p>' + (it.desc || '') + '</p></div>';
    }
    lbTitle.textContent = it.title;
    lbCat.textContent = it.category;
    lbNote.textContent = it.image ? (it.desc || '') : '';
    lbCount.textContent = lbItems.length > 1 ? (lbIndex + 1) + ' / ' + lbItems.length : '';
    lbPrev.disabled = lbIndex === 0;
    lbNext.disabled = lbIndex === lbItems.length - 1;
  }
  function openLightbox(items, index) {
    lbItems = items; lbIndex = index || 0;
    lastFocus = document.activeElement;
    renderLbItem();
    lb.classList.add('open');
    document.body.classList.add('no-scroll');
    $('#lbClose').focus();
  }
  function closeLightbox() {
    lb.classList.remove('open');
    document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
  }
  $('#lbClose').addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => { if (lbIndex > 0) { lbIndex--; renderLbItem(); } });
  lbNext.addEventListener('click', () => { if (lbIndex < lbItems.length - 1) { lbIndex++; renderLbItem(); } });
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

  /* --------- 10. CV: full view modal + download (print-to-PDF) --------- */
  const cvModal = $('#cvModal');
  function openCvModal() {
    lastFocus = document.activeElement;
    $('#cvDocMount').innerHTML = $('#cv-print').innerHTML; /* clone the CV document */
    $('#cv-print').setAttribute('aria-hidden', 'false');
    cvModal.classList.add('open');
    document.body.classList.add('no-scroll');
    $('#cvModalClose').focus();
  }
  function closeCvModal() {
    cvModal.classList.remove('open');
    document.body.classList.remove('no-scroll');
    $('#cv-print').setAttribute('aria-hidden', 'true');
    if (lastFocus) lastFocus.focus();
  }
  $('#viewCv').addEventListener('click', openCvModal);
  $('#docCard').addEventListener('click', openCvModal);
  $('#docCard').addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCvModal(); }
  });
  $('#cvModalClose').addEventListener('click', closeCvModal);
  $('#cvModalClose2').addEventListener('click', closeCvModal);
  cvModal.addEventListener('click', e => { if (e.target === cvModal) closeCvModal(); });

  $('#printFromModal').addEventListener('click', () => window.print());
  $('#downloadCv').addEventListener('click', () => {
    if (CONFIG.cvImage) {
      const a = document.createElement('a');
      a.href = CONFIG.cvImage;
      a.download = 'Yaqeen-Wael-CV';
      document.body.appendChild(a); a.click(); a.remove();
      showToast('Your CV image is downloading…');
    } else {
      showToast('Choose “Save as PDF” in the dialog to download your CV');
      setTimeout(() => window.print(), 500);
    }
  });
  /* When a real CV image is configured, preview it inside the doc card */
  if (CONFIG.cvImage) {
    const docBody = $('.doc-card .doc-body');
    docBody.insertAdjacentHTML('beforebegin',
      '<img src="' + CONFIG.cvImage + '" alt="CV document — Yaqeen Wael" style="width:100%;display:block">');
  }
  /* Wire LinkedIn / WhatsApp once real links exist */
  if (CONFIG.linkedin || CONFIG.whatsapp) {
    $$('.c-row').forEach(row => {
      const label = row.querySelector('small');
      if (!label) return;
      if (label.textContent === 'LinkedIn' && CONFIG.linkedin) {
        row.outerHTML = '<a class="c-row" href="' + CONFIG.linkedin + '" target="_blank" rel="noopener">' + row.innerHTML + '</a>';
      }
      if (label.textContent === 'WhatsApp' && CONFIG.whatsapp) {
        row.outerHTML = '<a class="c-row" href="' + CONFIG.whatsapp + '" target="_blank" rel="noopener">' + row.innerHTML + '</a>';
      }
    });
  }

  /* --------- 11. Toast --------- */
  const toast = $('#toast');
  let toastTimer;
  function showToast(msg) {
    toast.innerHTML = icon('i-check') + '<span>' + msg + '</span>';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  /* --------- 12. Contact form (opens the visitor's email app) --------- */
  const form = $('#contactForm'), formError = $('#formError');
  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  function flag(id, bad) { $('#' + id).closest('.f-field').classList.toggle('error', bad); return bad; }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#fName').value.trim(), mail = $('#fEmail').value.trim(),
          subj = $('#fSubject').value.trim(), msg = $('#fMsg').value.trim();
    const badName = flag('fName', name.length < 2);
    const badMail = flag('fEmail', !emailOk(mail));
    const badMsg  = flag('fMsg', msg.length < 10);
    const errors = [badName, badMail, badMsg].filter(Boolean).length;
    if (errors) {
      formError.textContent = errors === 1 ? 'Please fix the highlighted field.' : 'Please fix the ' + errors + ' highlighted fields.';
      formError.hidden = false; formError.classList.add('show');
      return;
    }
    formError.hidden = true; formError.classList.remove('show');
    const subject = subj || 'Portfolio contact — ' + name;
    const body = 'Name: ' + name + '\nEmail: ' + mail + '\n\n' + msg;
    window.location.href = 'mailto:' + CONFIG.email +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
    showToast('Opening your email app…');
  });

  /* Copy email */
  $('#copyEmail').addEventListener('click', () => {
    const done = () => showToast('Email copied to clipboard');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(CONFIG.email).then(done).catch(() => fallbackCopy(done));
    } else fallbackCopy(done);
  });
  function fallbackCopy(done) {
    const ta = document.createElement('textarea');
    ta.value = CONFIG.email; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (err) { showToast('Copy failed — the email is: ' + CONFIG.email); }
    ta.remove();
  }

  /* --------- 13. Global keyboard shortcuts --------- */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (lb.classList.contains('open')) closeLightbox();
      else if (cvModal.classList.contains('open')) closeCvModal();
      else if (mobileMenu.classList.contains('open')) setMenu(false);
    }
    if (lb.classList.contains('open')) {
      if (e.key === 'ArrowLeft' && !lbPrev.disabled) lbPrev.click();
      if (e.key === 'ArrowRight' && !lbNext.disabled) lbNext.click();
    }
  });

  /* --------- 14. Subtle 3D tilt on cards (desktop only) --------- */
  if (FINE_POINTER && !REDUCED) {
    $$('.t-card, .soft-card, .skill-group, .p-tile, .doc-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
        card.style.transform = 'perspective(700px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)' + (card.classList.contains('p-tile') || card.classList.contains('skill-group') ? ' translateY(-7px)' : '');
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* --------- 15. Marquee: duplicate content for a seamless loop --------- */
  const track = $('#marqueeTrack');
  track.innerHTML += track.innerHTML;

  /* --------- 16. Footer year --------- */
  $('#year').textContent = new Date().getFullYear();
})();
