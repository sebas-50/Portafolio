(function () {
    var track = document.getElementById('carruselTrack');
    var btnLeft = document.getElementById('btnLeft');
    var btnRight = document.getElementById('btnRight');
    var indicadores = document.getElementById('indicadores');

    if (!track || !btnLeft || !btnRight || !indicadores) return;

    var slides = Array.from(track.children);
    var total = slides.length;
    var currentIndex = 0;
    var touchStartX = 0;
    var touchEndX = 0;

    function goTo(index) {
        currentIndex = ((index % total) + total) % total;
        track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
        updateDots();
    }

    function next() { goTo(currentIndex + 1); }
    function prev() { goTo(currentIndex - 1); }

    function updateDots() {
        var dots = Array.from(indicadores.children);
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function buildDots() {
        slides.forEach(function (_, i) {
            var dot = document.createElement('div');
            dot.classList.add('indicador');
            dot.setAttribute('role', 'button');
            dot.setAttribute('tabindex', '0');
            dot.setAttribute('aria-label', 'Ir al proyecto ' + (i + 1));
            dot.addEventListener('click', function () { goTo(i); });
            indicadores.appendChild(dot);
        });
    }

    btnLeft.addEventListener('click', prev);
    btnRight.addEventListener('click', next);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
    });

    track.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? next() : prev();
        }
    });

    var debounceTimer;
    var resizeHandler = function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
            goTo(currentIndex);
        }, 150);
    };
    window.addEventListener('resize', resizeHandler);
    window.addEventListener('orientationchange', resizeHandler);

    buildDots();
    updateDots();
})();

/* ── MAIN MENU: slide from right + backdrop + close btn ── */
(function () {
  var toggle = document.getElementById('menuToggle');
  var menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  var backdrop = document.getElementById('menuBackdrop');
  var closeBtn = document.getElementById('menuCloseBtn');

  function open() {
    menu.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.classList.add('menu-open');
  }

  function close() {
    menu.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  toggle.addEventListener('click', function () {
    menu.classList.contains('active') ? close() : open();
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backdrop) backdrop.addEventListener('click', close);

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('active')) close();
  });
})();

/* ── SKILLS MODAL ── */
(function () {
    var btn = document.getElementById('btnExpandSkills');
    var modal = document.getElementById('skillsModal');
    var backdrop = document.getElementById('skillsModalBackdrop');
    var closeBtn = document.getElementById('skillsModalClose');

    if (!btn || !modal || !backdrop || !closeBtn) return;

    function open() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    btn.addEventListener('click', function (e) {
        e.preventDefault();
        open();
    });

    btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open();
        }
    });

    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) close();
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) close();
    });
})();

/* ── VFX scroll snap (mobile only) ── */
(function () {
    var grid = document.getElementById('vfxGrid');
    if (!grid) return;

    var isMobile = function () { return window.innerWidth <= 768; };

    var lastScroll = 0;
    var scrollTimeout;

    grid.addEventListener('scroll', function () {
        if (!isMobile()) return;
        clearTimeout(scrollTimeout);
        lastScroll = grid.scrollLeft;
        scrollTimeout = setTimeout(function () {
            if (grid.scrollLeft === lastScroll) {
                var card = grid.querySelector('.vfx-card');
                if (!card) return;
                var w = card.offsetWidth + 16;
                var idx = Math.round(grid.scrollLeft / w);
                grid.scrollTo({ left: idx * w, behavior: 'smooth' });
            }
        }, 150);
    }, { passive: true });
})();

/* ── PROYECTO DETAIL: scroll title → header ── */
(function () {
  var hero = document.querySelector('body.proyecto-page .detalle-hero');
  if (!hero) return;

  var body = document.body;
  body.classList.add('has-fly-title');

  var titleEl = hero.querySelector('h1');
  var flyTitle = document.querySelector('.header-fly-title');
  if (!titleEl || !flyTitle) return;

  function checkLongTitle() {
    flyTitle.classList.remove('is-long');
    if (flyTitle.scrollWidth > flyTitle.parentElement.offsetWidth * 0.45) {
      flyTitle.classList.add('is-long');
    }
  }
  checkLongTitle();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(checkLongTitle, 150);
  });

  var scrollThreshold = 200;

  var check = function () {
    var sy = window.scrollY || window.pageYOffset;
    if (sy > scrollThreshold) {
      body.classList.add('title-scrolled');
    } else {
      body.classList.remove('title-scrolled');
    }
  };

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        check();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  check();
})();