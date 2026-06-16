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

  /* ── AMBIENT AUDIO TOGGLE
  ──────────────────────────────────────────────────── */
  const audio = document.getElementById('ambient-audio');
  const audioToggle = document.getElementById('audio-toggle');
  const audioIconOn = document.querySelector('.audio-icon-on');
  const audioIconOff = document.querySelector('.audio-icon-off');
  let audioPlaying = true;

  if (audio) audio.volume = 0.12;

  if (audioToggle && audio) {
    /* Attempt autoplay on load; if blocked, start on first user interaction */
    window.addEventListener('load', () => {
      updateAudioUI();
      audio.play().catch(() => {
        /* Autoplay blocked — start on first scroll/click/touch instead */
        let attempted = false;
        const startOnInteraction = () => {
          if (attempted || !audioPlaying) return;
          attempted = true;
          audio.play().catch(() => {
            audioPlaying = false;
            updateAudioUI();
          });
        };
        ['click', 'scroll', 'touchstart', 'keydown'].forEach(evt => {
          document.addEventListener(evt, startOnInteraction, { once: true, passive: true });
        });
      });
    });

    audioToggle.addEventListener('click', () => {
      audioPlaying = !audioPlaying;
      if (audioPlaying) {
        audio.play().catch(() => {
          audioPlaying = false;
          updateAudioUI();
        });
      } else {
        audio.pause();
      }
      updateAudioUI();
    });

    audio.addEventListener('play',  () => { audioPlaying = true;  updateAudioUI(); });
    audio.addEventListener('pause', () => { audioPlaying = false; updateAudioUI(); });
  }

  function updateAudioUI() {
    if (!audioToggle) return;
    audioToggle.classList.toggle('playing', audioPlaying);
    document.querySelector('.nav-logo').classList.toggle('audio-playing', audioPlaying);
    if (audioIconOn)  audioIconOn.style.display  = audioPlaying ? ''     : 'none';
    if (audioIconOff) audioIconOff.style.display = audioPlaying ? 'none' : '';
    audioToggle.setAttribute('title', audioPlaying ? 'Mute ambient music' : 'Play ambient music');
    audioToggle.setAttribute('aria-label', audioPlaying ? 'Mute ambient Indian music' : 'Play ambient Indian music');
  }

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

  /* ── DARK / LIGHT MODE TOGGLE
  ──────────────────────────────────────────────────── */
  const themeToggle = document.getElementById('theme-toggle');
  const themeMoonIcon = document.querySelector('.theme-icon-moon');
  const themeSunIcon  = document.querySelector('.theme-icon-sun');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taal-theme', theme);
    if (theme === 'light') {
      if (themeMoonIcon) themeMoonIcon.style.display = 'none';
      if (themeSunIcon)  themeSunIcon.style.display  = '';
      if (themeToggle)   themeToggle.title = 'Switch to dark mode';
      if (themeToggle)   themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    } else {
      if (themeMoonIcon) themeMoonIcon.style.display = '';
      if (themeSunIcon)  themeSunIcon.style.display  = 'none';
      if (themeToggle)   themeToggle.title = 'Switch to light mode';
      if (themeToggle)   themeToggle.setAttribute('aria-label', 'Switch to light mode');
    }
  }

  const savedTheme = localStorage.getItem('taal-theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ── BACK TO TOP
  ──────────────────────────────────────────────────── */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── FAQ ACCORDION
  ──────────────────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer   = btn.nextElementSibling;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-question').forEach(q => {
        q.setAttribute('aria-expanded', 'false');
        q.nextElementSibling.hidden = true;
      });
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });

  /* ── ALLERGEN TOGGLES
  ──────────────────────────────────────────────────── */
  document.querySelectorAll('.allergen-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const list     = btn.nextElementSibling;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      list.hidden = expanded;
    });
  });

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

  /* ── INGREDIENT SPOTLIGHT SLIDER
  ──────────────────────────────────────────────────── */
  (function () {
    const slides = document.querySelectorAll('.ingredient-slide');
    const dots   = document.querySelectorAll('.ingredient-dot');
    if (!slides.length) return;
    let current = 0;
    let timer;

    function goTo(n) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      dots[current].setAttribute('aria-selected', 'false');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
      dots[current].setAttribute('aria-selected', 'true');
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        clearInterval(timer);
        goTo(parseInt(dot.dataset.target, 10));
        timer = setInterval(() => goTo(current + 1), 5000);
      });
    });

    timer = setInterval(() => goTo(current + 1), 5000);
  })();

  /* ── PRESS QUOTE CAROUSEL
  ──────────────────────────────────────────────────── */
  (function () {
    const quotes = document.querySelectorAll('.press-quote');
    const dots   = document.querySelectorAll('.pq-dot');
    if (!quotes.length) return;
    let current = 0;
    let timer;

    function goTo(n) {
      quotes[current].classList.remove('active');
      dots[current].classList.remove('active');
      dots[current].setAttribute('aria-selected', 'false');
      current = (n + quotes.length) % quotes.length;
      quotes[current].classList.add('active');
      dots[current].classList.add('active');
      dots[current].setAttribute('aria-selected', 'true');
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        clearInterval(timer);
        goTo(parseInt(dot.dataset.pq, 10));
        timer = setInterval(() => goTo(current + 1), 4000);
      });
    });

    timer = setInterval(() => goTo(current + 1), 4000);
  })();

  /* ── TESTIMONIALS CAROUSEL
  ──────────────────────────────────────────────────── */
  (function () {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots  = document.querySelectorAll('.t-dot');
    if (!cards.length) return;
    let current = 0;
    let timer;

    function goTo(n) {
      cards[current].classList.remove('active');
      dots[current].classList.remove('active');
      dots[current].setAttribute('aria-selected', 'false');
      current = (n + cards.length) % cards.length;
      cards[current].classList.add('active');
      dots[current].classList.add('active');
      dots[current].setAttribute('aria-selected', 'true');
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        clearInterval(timer);
        goTo(parseInt(dot.dataset.t, 10));
        timer = setInterval(() => goTo(current + 1), 4500);
      });
    });

    timer = setInterval(() => goTo(current + 1), 4500);
  })();

})();
