/* ============================================
   LOCALFIT — Hero Carousel
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.hero-indicator');
  const heroText = document.getElementById('heroText');
  const slideData = document.querySelectorAll('#heroSlideData > div');

  if (!slides.length || !slideData.length) return;

  let current = 0;
  let interval = null;
  const DURATION = 6000;

  function goToSlide(index) {
    slides.forEach(s => {
      s.classList.remove('active');
      const bg = s.querySelector('.hero-slide-bg');
      if (bg) {
        bg.style.animation = 'none';
        bg.offsetHeight;
        bg.style.animation = '';
      }
    });
    indicators.forEach(i => i.classList.remove('active'));

    current = index;
    slides[current].classList.add('active');
    indicators[current].classList.add('active');

    const activeBg = slides[current].querySelector('.hero-slide-bg');
    if (activeBg) {
      activeBg.style.animation = 'none';
      activeBg.offsetHeight;
      activeBg.style.animation = `kenBurns ${DURATION / 1000 + 4}s var(--ease) forwards`;
    }

    // Update hero text with fade
    if (heroText && slideData[current]) {
      const data = slideData[current];
      heroText.style.opacity = '0';
      heroText.style.transform = 'translateY(12px)';

      setTimeout(() => {
        heroText.innerHTML = `
          <span class="section-label">${data.dataset.label}</span>
          <h1>${data.dataset.title}</h1>
          <p>${data.dataset.text}</p>
          <div class="hero-buttons">
            <a href="${data.dataset.link}" class="btn btn-primary btn-lg">${data.dataset.btn}</a>
            <a href="leistungen.html" class="btn btn-secondary btn-lg">Mehr erfahren</a>
          </div>
        `;
        heroText.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        heroText.style.opacity = '1';
        heroText.style.transform = 'translateY(0)';
      }, 250);
    }
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  function startAutoplay() {
    stopAutoplay();
    interval = setInterval(nextSlide, DURATION);
  }

  function stopAutoplay() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  indicators.forEach((ind, i) => {
    ind.addEventListener('click', () => {
      if (i === current) return;
      goToSlide(i);
      startAutoplay();
    });
  });

  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mouseenter', stopAutoplay);
    hero.addEventListener('mouseleave', startAutoplay);
  }

  // Touch/Swipe
  let touchStartX = 0;
  if (hero) {
    hero.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    hero.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        goToSlide(diff > 0
          ? (current + 1) % slides.length
          : (current - 1 + slides.length) % slides.length
        );
        startAutoplay();
      }
    }, { passive: true });
  }

  goToSlide(0);
  startAutoplay();
});
