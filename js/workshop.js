(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initActivityCarousel() {
    const carousel = document.getElementById('activityCarousel');
    const track = document.getElementById('activityCarouselTrack');
    const dotsHost = document.getElementById('activityCarouselDots');
    const prevButton = document.getElementById('activityCarouselPrev');
    const nextButton = document.getElementById('activityCarouselNext');
    if (!carousel || !track || !dotsHost || !prevButton || !nextButton) return;

    const slides = Array.from(track.querySelectorAll('.activity-carousel-slide'));
    if (!slides.length) return;

    const autoplayDelay = Number(carousel.dataset.autoplay) || 4400;
    let activeIndex = 0;
    let maxIndex = 0;
    let resizeTimer = null;
    let autoplay = null;

    const slidesPerView = () => window.matchMedia('(max-width: 767.98px)').matches ? 1 : 2;

    const renderDots = () => {
      maxIndex = Math.max(0, slides.length - slidesPerView());
      dotsHost.innerHTML = Array.from({ length: maxIndex + 1 }, (_, index) => `
        <button
          class="activity-carousel-dot${index === activeIndex ? ' is-active' : ''}"
          type="button"
          role="tab"
          data-activity-dot="${index}"
          aria-label="Tampilkan posisi aktivitas ${index + 1}"
          aria-selected="${index === activeIndex}"
        ></button>`).join('');
    };

    const updateSlideVisibility = () => {
      const visibleCount = slidesPerView();
      slides.forEach((slide, index) => {
        const visible = index >= activeIndex && index < activeIndex + visibleCount;
        slide.setAttribute('aria-hidden', String(!visible));
        slide.inert = !visible;
      });
    };

    const updateDots = () => {
      dotsHost.querySelectorAll('[data-activity-dot]').forEach(dot => {
        const selected = Number(dot.dataset.activityDot) === activeIndex;
        dot.classList.toggle('is-active', selected);
        dot.setAttribute('aria-selected', String(selected));
      });
    };

    const moveTo = (index, { restart = false } = {}) => {
      activeIndex = Math.max(0, Math.min(index, maxIndex));
      const target = slides[activeIndex];
      const offset = target.offsetLeft - slides[0].offsetLeft;
      track.style.transform = `translate3d(-${offset}px, 0, 0)`;
      updateDots();
      updateSlideVisibility();
      if (restart) autoplay?.restart();
    };

    autoplay = window.APP_UTILS.createAutoplayController({
      delay: autoplayDelay,
      advance: () => moveTo(activeIndex >= maxIndex ? 0 : activeIndex + 1),
      canRun: () => !reduceMotion && maxIndex > 0
    });

    prevButton.addEventListener('click', () => {
      moveTo(activeIndex <= 0 ? maxIndex : activeIndex - 1, { restart: true });
    });

    nextButton.addEventListener('click', () => {
      moveTo(activeIndex >= maxIndex ? 0 : activeIndex + 1, { restart: true });
    });

    dotsHost.addEventListener('click', event => {
      const dot = event.target.closest('[data-activity-dot]');
      if (!dot) return;
      moveTo(Number(dot.dataset.activityDot), { restart: true });
    });

    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const previousMax = maxIndex;
        renderDots();
        if (activeIndex > maxIndex || previousMax !== maxIndex) activeIndex = Math.min(activeIndex, maxIndex);
        moveTo(activeIndex);
        autoplay.restart();
      }, 120);
    });

    renderDots();
    moveTo(0);
    autoplay.start();
  }

  function initLightbox() {
    const lightbox = document.getElementById('workshopLightbox');
    const image = document.getElementById('workshopLightboxImage');
    const caption = document.getElementById('workshopLightboxCaption');
    const closeButton = lightbox?.querySelector('.workshop-lightbox-close');
    if (!lightbox || !image || !caption || !closeButton) return;

    let lastTrigger = null;

    const openLightbox = trigger => {
      const src = trigger.dataset.lightboxSrc;
      const alt = trigger.dataset.lightboxAlt || trigger.querySelector('img')?.alt || 'Dokumentasi workshop';
      if (!src) return;

      lastTrigger = trigger;
      image.src = src;
      image.alt = alt;
      caption.textContent = alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      closeButton.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      image.src = '';
      lastTrigger?.focus();
    };

    document.addEventListener('click', event => {
      const trigger = event.target.closest('[data-lightbox-src]');
      if (trigger) openLightbox(trigger);
    });
    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', event => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }

  initActivityCarousel();
  initLightbox();
})();
