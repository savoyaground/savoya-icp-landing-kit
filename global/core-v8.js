
/* =========================================
   HERO PARALLAX (STABLE)
========================================= */

function initHeroParallax() {
  const hero = document.querySelector('.v2-hero-parallax');
  const contentWrapper = document.querySelector('.v2-content-wrapper');
  const nav = document.querySelector('nav');

  if (!hero || !contentWrapper) return;

  const bg = hero.querySelector('.v2-hero-bg');
  const content = hero.querySelector('.v2-hero-content');

  function setHeroLayout() {
    const navHeight = nav ? nav.getBoundingClientRect().height : 0;

    hero.style.top = navHeight + 'px';
    hero.style.height = '85vh';

    const heroHeight = hero.offsetHeight;
    //contentWrapper.style.marginTop = (heroHeight + navHeight) + 'px';
    //contentWrapper.style.marginTop = heroHeight + 'px';
  }

  function handleScroll() {
  const scrollY = window.scrollY;
  const heroHeight = hero.offsetHeight;
  if (!heroHeight) return;

  // base progress
  let progress = Math.min(scrollY / (heroHeight * 0.75), 1);

  // easing (snappier again)
  const eased = 1 - Math.pow(1 - progress, 3);

  // 👇 delayed content (lags behind bg)
  const delayed = Math.max(0, progress - 0.08);
  const easedDelayed = 1 - Math.pow(1 - delayed, 3);

  // 🔥 stronger movement back
  const translateY = -eased * heroHeight * 0.12;

  // BACKGROUND (moves first, more aggressive)
  if (bg) {
    bg.style.transform = `translate3d(0, ${-translateY * 0.6}px, 0) scale(1.08)`;
  }

  // CONTENT (lags, smoother)
  if (content) {
    content.style.opacity = 1 - (easedDelayed * 1.05);
    content.style.transform = `translate3d(0, ${easedDelayed * 36}px, 0)`;
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
  window.addEventListener('load', setHeroLayout);
  window.addEventListener('resize', setHeroLayout);
}

window.addEventListener('load', initHeroParallax);




/* =========================================
   FADE SYSTEM
========================================= */
function initFadeSystem() {
  const sections = document.querySelectorAll('.fade-section');

  sections.forEach(section => {
    const items = section.querySelectorAll('.fade-in, .fade-scale');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const i = [...items].indexOf(el);

        setTimeout(() => {
          el.classList.add('show');
        }, i * 120);

        observer.unobserve(el);
      });
    }, { threshold: 0.15 });

    items.forEach(el => observer.observe(el));
  });
}


/* =========================================
   LOGO CAROUSEL (DRAG + AUTO)
========================================= */
function initLogoCarousel() {
  const track = document.querySelector('.logo-track');
  if (!track) return;

  // ✅ Duplicate logos for seamless loop
  track.innerHTML += track.innerHTML;

  let pos = 0;
  const speed = 0.3;

  function animate() {
    pos += speed;

    // ✅ Reset when halfway (true loop)
    if (pos >= track.scrollWidth / 2) {
      pos = 0;
    }

    track.style.transform = `translateX(${-pos}px)`;
    requestAnimationFrame(animate);
  }

  animate();
}

/* =========================================
   STATS CAROUSEL
========================================= */
function initStatsCarousel() {
  const track = document.querySelector('.stats-track');
  if (!track) return;

  let pos = 0;

  function animate() {
    pos += 0.2;
    track.style.transform = `translateX(${-pos}px)`;
    requestAnimationFrame(animate);
  }

  animate();

  // fade inner stats
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
