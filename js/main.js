/* ============================================================
   TAAL Indian Kitchen & Bar — Main JS
   ============================================================ */

(function () {
  'use strict';

  /* ── PAGE LOADER
  ──────────────────────────────────────────────────── */
  const loader = document.getElementById('page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('loaded'), 400);
    });
  }

  /* ── SCROLL PROGRESS BAR
  ──────────────────────────────────────────────────── */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    if (!progressBar) return;
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  }

  /* ── NAVIGATION
  ──────────────────────────────────────────────────── */
  const nav = document.getElementById('main-nav');
  const SCROLL_THRESHOLD = 60;

  function updateNav() {
    if (!nav) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      nav.classList.add('scrolled');
      nav.classList.remove('transparent');
    } else {
      nav.classList.remove('scrolled');
      nav.classList.add('transparent');
    }
  }

  /* Hamburger / mobile menu */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');

  if (hamburger && mobileMenu) {
    let savedScrollY = 0;

    function lockBody() {
      savedScrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.width = '100%';
    }

    function unlockBody() {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, savedScrollY);
    }

    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      isOpen ? lockBody() : unlockBody();
    });

    /* Close on link click */
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        unlockBody();
      });
    });
  }

  /* Smooth scroll for all internal anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '80');
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── SCROLL REVEAL (Intersection Observer)
  ──────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade');

  if ('IntersectionObserver' in window) {
    const isMobile = window.innerWidth < 900;
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.04, rootMargin: isMobile ? '0px' : '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    /* Fallback: show everything */
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* ── MAIN SCROLL HANDLER
  ──────────────────────────────────────────────────── */
  window.addEventListener('scroll', () => {
    updateNav();
    updateProgress();
  }, { passive: true });

  /* Initial call */
  updateNav();
  updateProgress();

  /* ── CONTACT FORM
  ──────────────────────────────────────────────────── */
  window.handleContactForm = function (e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;

    const original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    /* Simulate send (replace with actual backend call) */
    setTimeout(() => {
      btn.textContent = 'Message Sent ✓';
      btn.style.background = '#1A5C3A';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    }, 1200);
  };

  /* ── RESERVATION FORM DATE MIN
  ──────────────────────────────────────────────────── */
  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  /* ── NEWSLETTER
  ──────────────────────────────────────────────────── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const btn   = form.querySelector('.newsletter-btn');
      if (!input || !input.value) return;

      const originalBtn = btn.textContent;
      btn.textContent = '✓';
      btn.style.background = '#1A5C3A';
      input.value = '';

      setTimeout(() => {
        btn.textContent = originalBtn;
        btn.style.background = '';
      }, 3000);
    });
  });

  /* ── DROPDOWN: keyboard accessibility
  ──────────────────────────────────────────────────── */
  document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
    const trigger = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown');
    if (!trigger || !dropdown) return;

    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isOpen = item.classList.toggle('kb-open');
        dropdown.style.opacity    = isOpen ? '1' : '';
        dropdown.style.visibility = isOpen ? 'visible' : '';
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        item.classList.remove('kb-open');
        dropdown.style.opacity    = '';
        dropdown.style.visibility = '';
      }
    });
  });

  /* ── GALLERY LIGHTBOX (simple text overlay on hover)
  ──────────────────────────────────────────────────── */
  /* Gallery items show caption on hover via CSS — no JS needed */

  /* ── ACTIVE NAV LINK on scroll
  ──────────────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ── BACK TO TOP
  ──────────────────────────────────────────────────── */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── INLINE EVENT FORMS
  ──────────────────────────────────────────────────── */
  document.querySelectorAll('.event-form-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const target   = document.getElementById(btn.dataset.target);
      if (!target) return;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      target.hidden = expanded;
    });
  });

  window.handleEventForm = function (e) {
    e.preventDefault();
    const form = e.target;
    const btn  = form.querySelector('button[type="submit"]');
    if (!btn) return;
    const original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled    = true;
    setTimeout(() => {
      btn.textContent      = 'Request Sent ✓';
      btn.style.background = '#1A5C3A';
      setTimeout(() => {
        btn.textContent      = original;
        btn.style.background = '';
        btn.disabled         = false;
        form.reset();
      }, 3000);
    }, 1200);
  };


  /* ── MAGNETIC RESERVE BUTTON
  ──────────────────────────────────────────────────── */
  const heroReserveBtn = document.querySelector('.hero-cta .btn-primary');
  if (heroReserveBtn && window.matchMedia('(pointer: fine)').matches) {
    heroReserveBtn.addEventListener('mousemove', e => {
      const r  = heroReserveBtn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.28;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.28;
      const max = 18;
      const tx = Math.max(-max, Math.min(max, dx));
      const ty = Math.max(-max, Math.min(max, dy));
      heroReserveBtn.style.transition = 'transform 0.08s ease';
      heroReserveBtn.style.transform  = 'translate(' + tx + 'px,' + ty + 'px)';
    });
    heroReserveBtn.addEventListener('mouseleave', () => {
      heroReserveBtn.style.transition = 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)';
      heroReserveBtn.style.transform  = '';
    });
  }

  /* ── STICKY MOBILE BOTTOM CTA BAR
  ──────────────────────────────────────────────────── */
  const mobileCTABar = document.getElementById('mobile-cta-bar');
  if (mobileCTABar) {
    const resSec = document.getElementById('reservations');
    if (resSec && 'IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        mobileCTABar.classList.toggle('hidden', entries[0].isIntersecting);
      }, { threshold: 0.1 }).observe(resSec);
    }
  }

})();
