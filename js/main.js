(function () {
  const initIcons = () => {
    if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
  };

  const initHeader = () => {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    const toggleState = () => header.classList.toggle('is-scrolled', window.scrollY > 18);
    toggleState();
    window.addEventListener('scroll', toggleState, { passive: true });
  };

  const initReveal = () => {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(el => observer.observe(el));
  };

  const initSmoothAnchors = () => {
    document.addEventListener('click', event => {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor || anchor.getAttribute('href') === '#') return;
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const initNavbarAutoClose = () => {
    const collapseEl = document.getElementById('mainNavbar');
    const toggler = document.querySelector('[data-bs-target="#mainNavbar"]');
    if (!collapseEl) return;

    if (!window.bootstrap && toggler) {
      toggler.addEventListener('click', () => {
        const open = collapseEl.classList.toggle('show');
        toggler.setAttribute('aria-expanded', String(open));
      });
    }

    collapseEl.addEventListener('click', event => {
      if (!event.target.closest('a.nav-link, a.product-dropdown-link') || window.innerWidth >= 992) return;
      if (window.bootstrap) {
        const instance = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
        instance.hide();
      } else {
        collapseEl.classList.remove('show');
        if (toggler) toggler.setAttribute('aria-expanded', 'false');
      }
    });
  };

  const initProductDropdown = () => {
    const dropdown = document.querySelector('.nav-product-dropdown');
    const toggle = dropdown?.querySelector('.nav-product-toggle');
    if (!dropdown || !toggle) return;

    const setOpen = open => {
      dropdown.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', event => {
      if (window.innerWidth >= 992) return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(!dropdown.classList.contains('is-open'));
    });

    document.addEventListener('click', event => {
      if (window.innerWidth >= 992 || dropdown.contains(event.target)) return;
      setOpen(false);
    });

    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      toggle.focus();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992) setOpen(false);
    }, { passive: true });
  };

  const year = document.getElementById('copyrightYear');
  if (year) year.textContent = new Date().getFullYear();

  initIcons();
  initHeader();
  initReveal();
  initSmoothAnchors();
  initNavbarAutoClose();
  initProductDropdown();
})();
