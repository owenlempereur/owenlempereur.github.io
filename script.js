/* ============================================
   OWEN LEMPEREUR — PORTFOLIO SCRIPT
   Reads content.json and renders all pages.
   ============================================ */

(function () {
  'use strict';

  let DATA = null;
  let currentFilter = 'all';
  let previousPage = 'home';

  // --- INIT ---
  async function init() {
    try {
      const resp = await fetch('content.json');
      if (!resp.ok) throw new Error('Could not load content.json (status ' + resp.status + ')');
      DATA = await resp.json();
    } catch (err) {
      showJsonError(err.message);
      return;
    }

    renderFooter();
    renderHome();
    renderWork();
    renderAbout();
    setupNav();
    handleHash();
  }

  // --- JSON ERROR ---
  function showJsonError(msg) {
    const home = document.getElementById('page-home');
    home.innerHTML = '<div class="json-error"><h2>Content Error</h2><p>There\'s a problem loading your content.json file. This usually means a missing comma, an extra comma, or a mismatched quote.</p><code>' + escapeHtml(msg) + '</code><p style="margin-top:16px">Open content.json in a text editor and check for syntax issues, or paste it into <a href="https://jsonlint.com" target="_blank" style="color:var(--accent)">jsonlint.com</a> to find the error.</p></div>';
  }

  // --- NAVIGATION ---
  function setupNav() {
    document.querySelectorAll('[data-nav]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var target = el.getAttribute('data-nav');
        navigateTo(target);
      });
    });

    document.getElementById('back-btn').addEventListener('click', function () {
      navigateTo(previousPage);
    });

    document.getElementById('back-btn-writing').addEventListener('click', function () {
      navigateTo(previousPage);
    });

    window.addEventListener('hashchange', handleHash);
  }

  function handleHash() {
    var hash = window.location.hash.replace('#', '');
    if (!hash || hash === '/') {
      showPage('home');
      return;
    }
    var parts = hash.split('/');
    if (parts[0] === 'work' && parts[1]) {
      openPiece(parts[1]);
    } else if (parts[0] === 'work') {
      navigateTo('work');
    } else if (parts[0] === 'about') {
      navigateTo('about');
    } else {
      showPage('home');
    }
  }

  function navigateTo(target) {
    if (target === 'home') {
      window.location.hash = '/';
      showPage('home');
    } else if (target === 'work') {
      window.location.hash = 'work';
      showPage('work');
    } else if (target === 'about') {
      window.location.hash = 'about';
      showPage('about');
    }
    window.scrollTo(0, 0);
  }

  function showPage(name) {
    document.querySelectorAll('.page').forEach(function (p) {
      p.classList.remove('active');
    });
    var page = document.getElementById('page-' + name);
    if (page) page.classList.add('active');

    // Update nav active state
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.classList.remove('active');
      if (a.getAttribute('data-nav') === name) a.classList.add('active');
    });
  }

  // --- RENDER HOME ---
  function renderHome() {
    document.getElementById('hero-sub').textContent = DATA.site.description;

    var featured = DATA.works.filter(function (w) { return w.featured; });
    var grid = document.getElementById('featured-grid');
    grid.innerHTML = '';

    // Sort: writing first (tall card), then the rest
    var writingPieces = featured.filter(function (w) { return w.category === 'writing'; });
    var visualPieces = featured.filter(function (w) { return w.category !== 'writing'; });

    // Render writing card (tall, left)
    writingPieces.forEach(function (w) {
      var card = document.createElement('div');
      card.className = 'card writing-card tall';
      card.innerHTML =
        '<div class="writing-genre">' + escapeHtml(w.genre || '') + '</div>' +
        '<div class="writing-title-card">' + escapeHtml(w.title) + '</div>' +
        '<div class="writing-excerpt-card">' + truncate(w.excerpt || w.pitch || '', 120) + '</div>' +
        '<div class="writing-cta">Read more →</div>';
      card.addEventListener('click', function () { openPiece(w.id); });
      grid.appendChild(card);
    });

    // Render visual cards
    visualPieces.forEach(function (w) {
      var card = document.createElement('div');
      card.className = 'card';
      card.innerHTML =
        '<div class="card-img-wrap">' + makeImg(w) + '</div>' +
        '<div class="card-overlay">' +
        '<div class="card-category">' + formatCategory(w.category) + '</div>' +
        '<div class="card-title">' + escapeHtml(w.title) + '</div>' +
        '</div>';
      card.addEventListener('click', function () { openPiece(w.id); });
      grid.appendChild(card);
    });
  }

  // --- RENDER WORK PAGE ---
  function renderWork() {
    var grid = document.getElementById('work-grid');
    renderWorkGrid(grid, 'all');

    document.querySelectorAll('.filter-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.filter-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        currentFilter = tab.getAttribute('data-filter');
        renderWorkGrid(grid, currentFilter);
      });
    });
  }

  function renderWorkGrid(grid, filter) {
    grid.innerHTML = '';
    var works = DATA.works;
    if (filter !== 'all') {
      works = works.filter(function (w) { return w.category === filter; });
    }

    works.forEach(function (w) {
      if (w.category === 'writing') {
        var card = document.createElement('div');
        card.className = 'work-card writing-work-card';
        card.innerHTML =
          '<div class="work-writing-genre">' + escapeHtml(w.genre || 'Writing') + '</div>' +
          '<div class="work-writing-title">' + escapeHtml(w.title) + '</div>' +
          '<div class="work-writing-pitch">' + truncate(w.pitch || '', 100) + '</div>' +
          '<div class="work-writing-status">' + escapeHtml(w.status || '') + '</div>';
        card.addEventListener('click', function () { openPiece(w.id); });
        grid.appendChild(card);
      } else {
        var card = document.createElement('div');
        card.className = 'work-card';
        card.innerHTML =
          '<div class="card-img-wrap">' + makeImg(w) + '</div>' +
          '<div class="card-overlay">' +
          '<div class="card-category">' + formatCategory(w.category) + '</div>' +
          '<div class="card-title">' + escapeHtml(w.title) + '</div>' +
          '</div>';
        card.addEventListener('click', function () { openPiece(w.id); });
        grid.appendChild(card);
      }
    });
  }

  // --- OPEN PIECE DETAIL ---
  function openPiece(id) {
    var work = DATA.works.find(function (w) { return w.id === id; });
    if (!work) return;

    // Remember where we came from
    var currentPage = document.querySelector('.page.active');
    if (currentPage) {
      if (currentPage.id === 'page-home') previousPage = 'home';
      else if (currentPage.id === 'page-work') previousPage = 'work';
    }

    window.location.hash = 'work/' + id;

    if (work.category === 'writing') {
      renderWritingDetail(work);
      showPage('writing-detail');
    } else {
      renderVisualDetail(work);
      showPage('detail');
    }
    window.scrollTo(0, 0);
  }

  function renderVisualDetail(w) {
    var siblings = DATA.works.filter(function (item) { return item.category === w.category; });
    var idx = siblings.findIndex(function (item) { return item.id === w.id; });
    var prev = idx > 0 ? siblings[idx - 1] : null;
    var next = idx < siblings.length - 1 ? siblings[idx + 1] : null;

    var container = document.getElementById('detail-content');
    container.innerHTML =
      makeDetailImg(w) +
      '<div class="detail-meta">' +
      '<span class="detail-category">' + formatCategory(w.category) + '</span>' +
      '<span class="detail-date">' + escapeHtml(w.date || '') + '</span>' +
      '</div>' +
      '<h1 class="detail-title">' + escapeHtml(w.title) + '</h1>' +
      (w.description ? '<p class="detail-description">' + escapeHtml(w.description) + '</p>' : '') +
      '<div class="detail-nav">' +
      '<button class="detail-nav-btn' + (prev ? '' : ' disabled') + '" data-id="' + (prev ? prev.id : '') + '">← Previous</button>' +
      '<button class="detail-nav-btn' + (next ? '' : ' disabled') + '" data-id="' + (next ? next.id : '') + '">Next →</button>' +
      '</div>';

    container.querySelectorAll('.detail-nav-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-id');
        if (targetId) openPiece(targetId);
      });
    });
  }

  function renderWritingDetail(w) {
    var container = document.getElementById('writing-detail-content');
    var html = '';

    html += '<div class="wd-genre">' + escapeHtml(w.genre || '') + '</div>';
    html += '<h1 class="wd-title">' + escapeHtml(w.title) + '</h1>';
    html += '<div class="wd-status">' + escapeHtml(w.status || '') + '</div>';

    if (w.pitch) {
      html += '<p class="wd-pitch">' + escapeHtml(w.pitch) + '</p>';
    }

    if (w.image) {
      html += makeWritingDetailImg(w);
    }

    if (w.description) {
      html += '<div class="wd-section-title">About this project</div>';
      html += '<p class="wd-description">' + escapeHtml(w.description) + '</p>';
    }

    if (w.process) {
      html += '<div class="wd-process-toggle" id="process-toggle">How I got here +</div>';
      html += '<div class="wd-process" id="process-body">' + escapeHtml(w.process) + '</div>';
    }

    if (w.excerpt) {
      html += '<hr class="wd-divider">';
      html += '<div class="wd-excerpt-label">Excerpt</div>';
      html += '<div class="wd-excerpt">' + escapeHtml(w.excerpt) + '</div>';
    }

    if (w.link_url) {
      html += '<a href="' + escapeHtml(w.link_url) + '" target="_blank" class="wd-cta">' + escapeHtml(w.link_label || 'Read more') + ' →</a>';
    }

    container.innerHTML = html;

    // Process toggle
    var toggle = document.getElementById('process-toggle');
    var body = document.getElementById('process-body');
    if (toggle && body) {
      toggle.addEventListener('click', function () {
        body.classList.toggle('open');
        toggle.textContent = body.classList.contains('open') ? 'How I got here −' : 'How I got here +';
      });
    }
  }

  // --- RENDER ABOUT ---
  function renderAbout() {
    var aboutBody = document.getElementById('about-body');
    var html = '';

    if (DATA.about.photo) {
      html += '<img class="about-photo" src="' + escapeHtml(DATA.about.photo) + '" alt="Owen Lempereur">';
    }

    html += '<p>' + escapeHtml(DATA.about.bio) + '</p>';
    aboutBody.innerHTML = html;

    var contact = document.getElementById('about-contact');
    var contactHtml = '';
    if (DATA.site.email) {
      contactHtml += '<a href="mailto:' + escapeHtml(DATA.site.email) + '">Email</a>';
    }
    if (DATA.site.instagram) {
      contactHtml += '<a href="' + escapeHtml(DATA.site.instagram) + '" target="_blank">Instagram</a>';
    }
    contact.innerHTML = contactHtml;
  }

  // --- RENDER FOOTER ---
  function renderFooter() {
    var right = document.getElementById('footer-right');
    var html = '';
    if (DATA.site.instagram) {
      html += '<a href="' + escapeHtml(DATA.site.instagram) + '" target="_blank">Instagram</a>';
    }
    if (DATA.site.email) {
      html += '<a href="mailto:' + escapeHtml(DATA.site.email) + '">Contact</a>';
    }
    right.innerHTML = html;
  }

  // --- HELPERS ---
  function makeImg(w) {
    if (w.image && !w.image.includes('placeholder')) {
      return '<img class="card-img" src="' + escapeHtml(w.image) + '" alt="' + escapeHtml(w.title) + '" loading="lazy">';
    }
    return '<div class="card-img placeholder-img ' + escapeHtml(w.category) + '"></div>';
  }

  function makeDetailImg(w) {
    if (w.image && !w.image.includes('placeholder')) {
      return '<img class="detail-img" src="' + escapeHtml(w.image) + '" alt="' + escapeHtml(w.title) + '">';
    }
    return '<div class="detail-img placeholder-img ' + escapeHtml(w.category) + '" style="height:400px;border-radius:2px;"></div>';
  }

  function makeWritingDetailImg(w) {
    if (w.image && !w.image.includes('placeholder')) {
      return '<img class="wd-image" src="' + escapeHtml(w.image) + '" alt="' + escapeHtml(w.title) + '">';
    }
    return '';
  }

  function formatCategory(cat) {
    var names = {
      painting: 'Painting',
      drawing: 'Drawing',
      photography: 'Photography',
      digital: 'Digital Painting',
      writing: 'Writing'
    };
    return names[cat] || cat;
  }

  function truncate(str, len) {
    if (!str) return '';
    if (str.length <= len) return escapeHtml(str);
    return escapeHtml(str.substring(0, len)) + '…';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // --- START ---
  document.addEventListener('DOMContentLoaded', init);
})();
