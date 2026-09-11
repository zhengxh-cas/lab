// Zheng Lab site scripts

document.addEventListener('DOMContentLoaded', () => {
  /* Mobile nav toggle */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.querySelector('.nav-toggle-label').textContent = open ? 'Close' : 'Menu';
    });
  }

  /* Mark current nav link */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* Publication tag filters (publications.html only) */
  const filterBar = document.querySelector('.pub-filters');
  if (filterBar) {
    const buttons = filterBar.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.pub-item');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const tag = btn.dataset.tag;
        items.forEach((item) => {
          const tags = (item.dataset.tags || '').split(',');
          const show = tag === 'all' || tags.includes(tag);
          item.style.display = show ? '' : 'none';
        });
        document.querySelectorAll('.pub-year').forEach((yearEl) => {
          let node = yearEl.nextElementSibling;
          let anyVisible = false;
          while (node && !node.classList.contains('pub-year')) {
            if (node.style.display !== 'none') anyVisible = true;
            node = node.nextElementSibling;
          }
          yearEl.style.display = anyVisible ? '' : 'none';
        });
      });
    });
  }

  /* Slideshow (homepage photo gallery) */
  const slideshow = document.querySelector('[data-slideshow]');
  if (slideshow) {
    const slides = Array.from(slideshow.querySelectorAll('.slide'));
    const dotsWrap = slideshow.querySelector('.slide-dots');
    const prevBtn = slideshow.querySelector('.slide-prev');
    const nextBtn = slideshow.querySelector('.slide-next');
    let current = slides.findIndex((s) => s.classList.contains('is-active'));
    if (current < 0) current = 0;
    let timer = null;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slide-dot' + (i === current ? ' is-active' : '');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.querySelectorAll('.slide-dot'));

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }

    prevBtn.addEventListener('click', () => { goTo(current - 1); restart(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); restart(); });

    function start() {
      if (reduceMotion) return;
      timer = setInterval(() => goTo(current + 1), 15000);
    }
    function stop() { if (timer) clearInterval(timer); }
    function restart() { stop(); start(); }

    slideshow.addEventListener('mouseenter', stop);
    slideshow.addEventListener('mouseleave', start);
    slideshow.addEventListener('focusin', stop);
    slideshow.addEventListener('focusout', start);
    slideshow.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { goTo(current - 1); restart(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); restart(); }
    });

    start();
  }

  /* Hero colony animation: one orchestrated reveal on load, respects reduced motion */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const colony = document.querySelector('.hero-art');
  if (colony && !prefersReduced) {
    const cells = colony.querySelectorAll('.cell');
    const links = colony.querySelectorAll('.matrix-link');
    links.forEach((l) => { l.style.strokeDasharray = l.getTotalLength(); l.style.strokeDashoffset = l.getTotalLength(); });
    cells.forEach((c, i) => {
      c.style.opacity = '0';
      c.style.transform = 'scale(0.4)';
      c.style.transformOrigin = 'center';
      c.style.transformBox = 'fill-box';
      setTimeout(() => {
        c.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(.2,.8,.3,1)';
        c.style.opacity = '1';
        c.style.transform = 'scale(1)';
      }, 120 + i * 90);
    });
    links.forEach((l, i) => {
      setTimeout(() => {
        l.style.transition = 'stroke-dashoffset 0.8s ease';
        l.style.strokeDashoffset = '0';
      }, 300 + i * 60);
    });
  }
});
