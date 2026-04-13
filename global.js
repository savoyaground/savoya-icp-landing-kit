/* =========================================
   SAVOYA CORE JS SYSTEM
   - Modular
   - Webflow-safe
   - Performance optimized
========================================= */

/* =========================
   HERO PARALLAX
========================= */
function initHeroParallax() {
  const hero = document.querySelector('.v2-hero-parallax');
  const contentWrapper = document.querySelector('.v2-content-wrapper');
  const nav = document.querySelector('nav');

  const bg = hero?.querySelector('.v2-hero-bg');
  const content = hero?.querySelector('.v2-hero-content');

  if (!hero || !nav || !contentWrapper) return;

  function setHeroLayout() {
    const navHeight = nav.offsetHeight;

    hero.style.top = navHeight + 'px';
    hero.style.height = `calc(85vh - ${navHeight}px)`;

    const totalHeroHeight = hero.offsetHeight + navHeight;
    contentWrapper.style.marginTop = totalHeroHeight + 'px';
  }

  function handleScroll() {
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;

    let progress = Math.min(scrollY / (heroHeight * 0.75), 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    const translateY = eased * heroHeight * 0.12;
    const opacity = 1 - (eased * 0.8);
    const scale = 1 - (eased * 0.04);

    hero.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
    hero.style.opacity = opacity;

    if (bg) {
      bg.style.transform = `translate3d(0, ${translateY * 0.5}px, 0)`;
    }

    if (content) {
      content.style.opacity = 1 - (eased * 1.05);
      content.style.transform = `translate3d(0, ${eased * 28}px, 0)`;
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  setHeroLayout();
  handleScroll();
  window.addEventListener('resize', setHeroLayout);
}

/* =========================
   STATS CAROUSEL
========================= */
function initStatsCarousel() {
  const track = document.querySelector('.stats-track');
  if (!track) return;

  let animationFrame = null;
  let isActive = false;
  let position = 0;
  const speed = 0.3;

  function startScroll() {
    if (isActive) return;
    isActive = true;

    function animate() {
      position -= speed;
      track.style.transform = `translateX(${position}px)`;
      animationFrame = requestAnimationFrame(animate);
    }

    animate();
  }

  function stopScroll() {
    isActive = false;

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    track.style.transform = 'none';
    position = 0;
  }

  function checkBreakpoint() {
    if (window.matchMedia("(max-width: 1279px)").matches) {
      startScroll();
    } else {
      stopScroll();
    }
  }

  checkBreakpoint();
  window.addEventListener('resize', checkBreakpoint);
}

/* =========================
   LOGO CAROUSEL
========================= */
function initLogoCarousel() {
  const carousel = document.querySelector('.logo-carousel');
  const track = document.querySelector('.logo-track');

  if (!carousel || !track) return;

  if (!track.classList.contains('is-duplicated')) {
    track.innerHTML += track.innerHTML;
    track.classList.add('is-duplicated');
  }

  let scrollX = 0;
  let speed = 0.4;
  let isDragging = false;
  let startX = 0;
  let velocity = 0;

  function animate() {
    if (!isDragging) {
      scrollX -= speed + velocity;
      velocity *= 0.95;

      const maxScroll = track.scrollWidth / 2;
      if (Math.abs(scrollX) >= maxScroll) scrollX = 0;

      track.style.transform = `translate3d(${scrollX}px, 0, 0)`;
    }

    requestAnimationFrame(animate);
  }

  animate();

  /* Drag */
  carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - scrollX;
    velocity = 0;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const delta = e.pageX - startX;
    velocity = delta * 0.1;
    scrollX = delta;
  });

  window.addEventListener('mouseup', () => isDragging = false);

  /* Touch */
  carousel.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - scrollX;
    velocity = 0;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const delta = e.touches[0].pageX - startX;
    velocity = delta * 0.1;
    scrollX = delta;
  });

  window.addEventListener('touchend', () => isDragging = false);

  /* Hover slow */
  carousel.addEventListener('mouseenter', () => speed = 0.1);
  carousel.addEventListener('mouseleave', () => speed = 0.4);
}

/* =========================
   FADE SYSTEM (MERGED)
========================= */
function initFadeSystem() {
  const sections = document.querySelectorAll('.fade-section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const fadeInItems = entry.target.querySelectorAll('.fade-in');
      const scaleItems = entry.target.querySelectorAll('.fade-scale');

      fadeInItems.forEach((el, index) => {
        el.style.setProperty('--delay', `${index * 120}ms`);
        el.classList.add('show');
      });

      scaleItems.forEach((el, index) => {
        el.style.setProperty('--delay', `${index * 100}ms`);
        el.classList.add('show');
      });
    });
  }, {
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px"
  });

  sections.forEach(section => observer.observe(section));
}

/* =========================
   INIT (WEBFLOW SAFE)
========================= */
function initAll() {
  initHeroParallax();
  initStatsCarousel();
  initLogoCarousel();
  initFadeSystem();
}

/* Webflow-safe load */
window.Webflow ||= [];
window.Webflow.push(() => {
  setTimeout(initAll, 100);
});
