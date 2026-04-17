/* =========================================
   HERO PARALLAX (TEXT-ONLY + ENHANCED DEPTH)
========================================= */
function initHeroParallax() {
  const hero = document.querySelector('.v2-hero-parallax');
  if (!hero) return;

  const bg = hero.querySelector('.v2-hero-bg');
  const content = hero.querySelector('.v2-hero-content');

  function handleScroll() {
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;
    if (!heroHeight) return;

    const progress = Math.min(scrollY / heroHeight, 1);
    const eased = 1 - Math.pow(1 - progress, 4);

    /* HERO (STABLE) */
    hero.style.transform = `none`;
    hero.style.opacity = 1;
    hero.style.filter = `none`;

    /* BG PARALLAX */
    if (bg) {
      const move = eased * Math.min(heroHeight * 0.18, 160);
      bg.style.transform = `translate3d(0, ${move}px, 0) scale(1.15)`;
    }

    /* CONTENT MOTION */
    if (content) {
      const start = 0.1;
      const p = Math.max(0, progress - start);
      const norm = Math.min(p / (1 - start), 1);
      const cEase = 1 - Math.pow(1 - norm, 4);

      const translateY = -cEase * 120;
      const opacity = 1 - cEase * 1.1;
      const scale = 1 - cEase * 0.05;

      content.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
      content.style.opacity = opacity;
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
}


/* =========================================
   FADE SYSTEM
========================================= */
function initFadeSystem() {
  const items = document.querySelectorAll('.fade-in, .fade-scale');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;

      setTimeout(() => {
        entry.target.classList.add('show');
      }, i * 120);
    });
  }, { threshold: 0.15 });

  items.forEach(el => observer.observe(el));
}


/* =========================================
   LOGO CAROUSEL (TRUE INFINITE)
========================================= */
function initLogoCarousel() {
  const track = document.querySelector('.logo-track');
  if (!track) return;

  track.innerHTML += track.innerHTML;

  let pos = 0;
  const speed = 0.3;

  function animate() {
    pos += speed;

    if (pos >= track.scrollWidth / 2) {
      pos = 0;
    }

    track.style.transform = `translateX(${-pos}px)`;
    requestAnimationFrame(animate);
  }

  animate();
}


/* =========================================
   STATS CAROUSEL (RESPONSIVE CONTROLLED)
========================================= */
function initStatsCarousel() {
  const track = document.querySelector('.stats-track');
  if (!track) return;

  let animationId = null;
  let isActive = false;

  function start() {
    if (isActive) return;

    // clone only once
    if (!track.dataset.cloned) {
      track.innerHTML += track.innerHTML;
      track.dataset.cloned = "true";
    }

    let pos = 0;
    const speed = 0.2;

    function animate() {
      pos += speed;

      if (pos >= track.scrollWidth / 2) {
        pos = 0;
      }

      track.style.transform = `translateX(${-pos}px)`;
      animationId = requestAnimationFrame(animate);
    }

    animate();
    isActive = true;
  }

  function stop() {
    if (!isActive) return;

    cancelAnimationFrame(animationId);
    track.style.transform = 'none';
    isActive = false;
  }

  function check() {
    if (window.innerWidth < 1280) {
      start();
    } else {
      stop();
    }
  }

  // run on load
  check();

  // handle resize properly
  window.addEventListener('resize', check);

  /* fade-in (independent of scroll animation) */
  const stats = document.querySelectorAll('.stat-inner');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;

      setTimeout(() => {
        entry.target.classList.add('show');
      }, i * 120);
    });
  }, { threshold: 0.2 });

  stats.forEach(stat => observer.observe(stat));
}


/* =========================================
   INIT
========================================= */
function initAll() {
  initHeroParallax();
  initFadeSystem();
  initLogoCarousel();
  initStatsCarousel();
}


/* =========================================
   WEBFLOW SAFE INIT
========================================= */
window.Webflow ||= [];
window.Webflow.push(() => {
  initAll();
});
