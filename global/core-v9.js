

/* =========================================
   HERO PARALLAX (FINAL - STABLE)
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

  // ✅ correct progress for FIXED hero
  const progress = Math.min(scrollY / heroHeight, 1);

  const eased = 1 - Math.pow(1 - progress, 4);

  /* =============================
     HERO (scale + fade away blur)
  ============================= */
const scale = 1 - eased * 0.04;
const opacity = 1 - eased * 0.9;
const blur = eased * 6; // 👈 tweak this

hero.style.transform = `scale(${scale})`;
hero.style.opacity = opacity;
hero.style.filter = `blur(${blur}px)`;

  /* =============================
     BG (depth)
  ============================= */
  if (bg) {
    bg.style.transform = `translate3d(0, ${eased * heroHeight * 0.08}px, 0) scale(1.1)`;
  }

  /* =============================
     CONTENT (delayed, faster)
  ============================= */
  const start = 0.2;
  const p = Math.max(0, progress - start);
  const norm = Math.min(p / (1 - start), 1);
  const cEase = 1 - Math.pow(1 - norm, 4);

  if (content) {
    content.style.transform = `translate3d(0, ${-cEase * 100}px, 0)`;
    content.style.opacity = 1 - cEase * 1.2;
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

  // duplicate once
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
   STATS CAROUSEL (TRUE INFINITE)
========================================= */
function initStatsCarousel() {
  const track = document.querySelector('.stats-track');
  if (!track) return;

  // duplicate once
  track.innerHTML += track.innerHTML;

  let pos = 0;
  const speed = 0.2;

  function animate() {
    pos += speed;

    if (pos >= track.scrollWidth / 2) {
      pos = 0;
    }

    track.style.transform = `translateX(${-pos}px)`;
    requestAnimationFrame(animate);
  }

  animate();

  // fade-in stats
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

