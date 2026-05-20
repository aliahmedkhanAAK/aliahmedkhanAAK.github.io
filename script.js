/* ============================================
   aliiiii — scroll reveals & subtle effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Intersection Observer for .reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach((el) => observer.observe(el));


  /* ---------- Stagger children in grids ---------- */
  const staggerContainers = document.querySelectorAll('[data-stagger]');

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const children = entry.target.children;
        Array.from(children).forEach((child, i) => {
          child.style.transitionDelay = `${i * 80}ms`;
          child.classList.add('visible');
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  staggerContainers.forEach((el) => staggerObserver.observe(el));


  /* ---------- Parallax drift on hero (subtle) ---------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        const name = hero.querySelector('.hero__name');
        const quote = hero.querySelector('.hero__quote');
        if (name)  name.style.transform  = `translateY(${scrollY * 0.12}px)`;
        if (quote) quote.style.transform  = `translateY(${scrollY * 0.06}px)`;
      }
    }, { passive: true });
  }


  /* ---------- Smooth anchor links (fallback) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
