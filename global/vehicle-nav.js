
document.addEventListener('DOMContentLoaded', () => {
  const navWrapper = document.querySelector('.vehicle-nav-wrapper');
  const nav = document.querySelector('.vehicle-nav');
  const links = Array.from(document.querySelectorAll('.vehicle-link'));
  const anchors = Array.from(document.querySelectorAll('.vehicle-anchor'));

  if (!navWrapper || !nav || !links.length || !anchors.length) return;

  /* =========================================
     STICKY SHRINK
  ========================================= */
  function handleSticky() {
    if (window.scrollY > 50) {
      navWrapper.classList.add('is-stuck');
    } else {
      navWrapper.classList.remove('is-stuck');
    }
  }

  /* =========================================
     ACTIVE LINK
  ========================================= */
function setActiveLink(id) {
  let activeLink = null;

  links.forEach(link => {
    const isActive = link.getAttribute('href') === '#' + id;
    link.classList.toggle('active', isActive);

    if (isActive) activeLink = link;
  });

  // 👇 NEW: auto-scroll nav
  scrollNavToActive(activeLink);
}

function scrollNavToActive(activeLink) {
  if (!activeLink || !nav) return;

  const navRect = nav.getBoundingClientRect();
  const linkRect = activeLink.getBoundingClientRect();

  const linkCenter = linkRect.left + linkRect.width / 2;
  const navCenter = navRect.left + navRect.width / 2;

  const offset = linkCenter - navCenter;

  nav.scrollTo({
    left: nav.scrollLeft + offset,
    behavior: 'smooth'
  });
}

  /* =========================================
     CLICK → NATIVE ANCHOR OFFSET SYSTEM
     Uses your .vehicle-anchor top:-190px
  ========================================= */
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const id = link.getAttribute('href').replace('#', '');
      const anchor = document.getElementById(id);
      if (!anchor) return;

      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      setActiveLink(id);
    });
  });

  /* =========================================
     SCROLL SPY
     Uses anchors, not sections
  ========================================= */

function updateSpy() {
  const triggerLine = 140;

  let current = null;

  anchors.forEach(anchor => {
    const rect = anchor.getBoundingClientRect();

    if (rect.top <= triggerLine) {
      current = anchor;
    }
  });

  const lastSection = anchors[anchors.length - 1].closest('.vehicle-section');
  const lastRect = lastSection.getBoundingClientRect();

  const isPastLast = lastRect.bottom < triggerLine;

  /* =========================================
     HIDE NAV WHEN PAST LAST SECTION
  ========================================= */
  if (isPastLast) {
    navWrapper.classList.add('is-hidden');

    // also clear active state
    links.forEach(link => link.classList.remove('active'));
    return;
  } else {
    navWrapper.classList.remove('is-hidden');
  }

  if (current) {
    setActiveLink(current.id);
  }
}

  /* =========================================
     DRAG SCROLL
  ========================================= */
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  nav.addEventListener('mousedown', (e) => {
    isDown = true;
    nav.classList.add('dragging');
    startX = e.pageX - nav.offsetLeft;
    scrollLeft = nav.scrollLeft;
  });

  nav.addEventListener('mouseleave', () => {
    isDown = false;
    nav.classList.remove('dragging');
  });

  nav.addEventListener('mouseup', () => {
    isDown = false;
    nav.classList.remove('dragging');
  });

  nav.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - nav.offsetLeft;
    const walk = (x - startX) * 1.5;
    nav.scrollLeft = scrollLeft - walk;
  });

  let touchStartX = 0;
  let touchScrollLeft = 0;

  nav.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = nav.scrollLeft;
  });

  nav.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX;
    const walk = (x - touchStartX) * 1.2;
    nav.scrollLeft = touchScrollLeft - walk;
  });

  /* =========================================
     INIT
  ========================================= */
  window.addEventListener('scroll', handleSticky);
  window.addEventListener('scroll', updateSpy);
  window.addEventListener('resize', updateSpy);

  handleSticky();
  updateSpy();
});
</script>

<script>
/* =========================================
   TABLE SCROLL FADE INDICATOR
   - Adds/removes a class when user reaches
     the end of horizontal scroll
   - Used to hide the right-side fade
========================================= */

function initTableScroll() {
  const containers = document.querySelectorAll('.table-scroll');

  containers.forEach(container => {

    function handleScroll() {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const currentScroll = container.scrollLeft;

      if (currentScroll >= maxScroll - 2) {
        container.classList.add('scrolled-end');
      } else {
        container.classList.remove('scrolled-end');
      }
    }

    container.addEventListener('scroll', handleScroll);
    handleScroll();
  });
}

document.addEventListener('DOMContentLoaded', initTableScroll);
