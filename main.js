/* ═══════════════════════════════════════════
   CLUB ESCOLAR R-15 · main.js
   ═══════════════════════════════════════════ */

// ─── LOGO FALLBACK ────────────────────────
// If logo image fails to load, show text placeholder instead
function initLogoFallbacks() {
  const logoImages = [
    { imgId: 'navLogoImg',    placeholderId: 'navLogoPlaceholder',    wrapSelector: '.nav-logo-circle' },
    { imgId: 'heroLogoImg',   placeholderId: 'heroLogoPlaceholder',   wrapSelector: '.hero-logo-circle' },
    { imgId: 'aboutLogoImg',  placeholderId: 'aboutLogoPlaceholder',  wrapSelector: '.about-logo-circle' },
    { imgId: 'ctaLogoImg',    placeholderId: 'ctaLogoPlaceholder',    wrapSelector: '.cta-logo-circle' },
    { imgId: 'footerLogoImg', placeholderId: 'footerLogoPlaceholder', wrapSelector: '.footer-logo-circle' },
  ];

  logoImages.forEach(({ imgId, placeholderId }) => {
    const img = document.getElementById(imgId);
    const placeholder = document.getElementById(placeholderId);
    if (!img || !placeholder) return;

    // Image loads fine → hide placeholder
    img.addEventListener('load', () => {
      img.style.display = 'block';
      placeholder.style.display = 'none';
    });

    // Image fails → hide image, show placeholder
    img.addEventListener('error', () => {
      img.style.display = 'none';
      placeholder.style.display = 'flex';
      placeholder.style.alignItems = 'center';
      placeholder.style.justifyContent = 'center';
      placeholder.style.width = '100%';
      placeholder.style.height = '100%';
    });

    // If already failed (cached error state)
    if (img.complete && img.naturalWidth === 0) {
      img.dispatchEvent(new Event('error'));
    }
    // If already loaded
    if (img.complete && img.naturalWidth > 0) {
      img.dispatchEvent(new Event('load'));
    }
  });
}

// ─── NAVBAR SCROLL ────────────────────────
function initNavbar() {
  const nav = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ─── HAMBURGER MENU ───────────────────────
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    // Animate hamburger to X
    const spans = btn.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      const spans = btn.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
}

// ─── SCROLL REVEAL ────────────────────────
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-scale');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    elements.forEach(el => el.classList.add('visible'));
  }
}

// ─── COUNTER ANIMATION ───────────────────
function animateCounter(el, target, duration = 1600) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  } else {
    counters.forEach(c => { c.textContent = c.dataset.target; });
  }
}

// ─── SMOOTH SCROLL ────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 70; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ─── CTA FORM ────────────────────────────
function initCTAForm() {
  const input = document.querySelector('.cta-input');
  const btn = document.querySelector('.cta-form .btn-primary');
  if (!input || !btn) return;

  btn.addEventListener('click', () => {
    const email = input.value.trim();
    if (!email || !email.includes('@')) {
      input.style.borderColor = 'rgba(255,100,100,0.6)';
      input.focus();
      setTimeout(() => { input.style.borderColor = ''; }, 2000);
      return;
    }
    // Success state
    btn.textContent = '¡Inscrito! ✓';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    input.value = '';
    input.disabled = true;
    input.placeholder = '¡Gracias! Pronto recibirás más información.';
    setTimeout(() => {
      btn.textContent = 'Quiero unirme';
      btn.style.background = '';
      input.disabled = false;
      input.placeholder = 'Tu correo electrónico';
    }, 4000);
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btn.click();
  });
}

// ─── REDUCED MOTION ──────────────────────
function respectReducedMotion() {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) {
    document.querySelectorAll('.reveal-up, .reveal-scale').forEach(el => {
      el.classList.add('visible');
    });
    const ring = document.querySelector('.ring-svg');
    if (ring) ring.style.animation = 'none';
  }
}

// ─── INIT ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  respectReducedMotion();
  initLogoFallbacks();
  initNavbar();
  initHamburger();
  initScrollReveal();
  initCounters();
  initSmoothScroll();
  initCTAForm();
});