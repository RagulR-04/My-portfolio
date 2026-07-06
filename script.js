/* =========================================================
   Ragul R — Portfolio Script (v2)
   Vanilla ES6+, no dependencies
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById('loader');
  const hideLoader = () => loader && loader.classList.add('is-hidden');
  window.addEventListener('load', () => setTimeout(hideLoader, 350));
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 350);
  }
  // Failsafe: never let the loader stay on top and block clicks (e.g. Email Me)
  setTimeout(hideLoader, 2000);

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById('scrollProgress');
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- Floating dock: condensed state on scroll ---------- */
  const dock = document.getElementById('siteNav');
  const toggleDockState = () => {
    dock.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', toggleDockState, { passive: true });
  toggleDockState();

  /* ---------- Mobile menu toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksWrap = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinksWrap.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  navLinksWrap.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksWrap.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Smooth scroll with dock offset ---------- */
  const dockLinks = document.querySelectorAll('.dock__link');
  dockLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();
      const dockHeight = dock.offsetHeight + 34;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - dockHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Sliding dock indicator + active link highlighting ---------- */
  const indicator = document.getElementById('dockIndicator');

  const moveIndicatorTo = (link) => {
    if (!link || !indicator) return;
    const wrapRect = navLinksWrap.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    indicator.style.width = `${linkRect.width}px`;
    indicator.style.transform = `translateX(${linkRect.left - wrapRect.left}px)`;
    indicator.classList.add('is-visible');
  };

  const setActiveLink = (id) => {
    let activeLink = null;
    dockLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
      if (isActive) activeLink = link;
    });
    if (activeLink) moveIndicatorTo(activeLink);
  };

  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveLink(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));

  window.addEventListener('resize', () => {
    const current = document.querySelector('.dock__link.active');
    if (current) moveIndicatorTo(current);
  });
  // Initial placement once fonts/layout settle
  window.addEventListener('load', () => {
    const current = document.querySelector('.dock__link.active');
    if (current) moveIndicatorTo(current);
  });
  setTimeout(() => {
    const current = document.querySelector('.dock__link.active');
    if (current) moveIndicatorTo(current);
  }, 300);

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------- Back to top button ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
