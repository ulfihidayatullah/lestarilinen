(function () {
  "use strict";

  const config = window.SITE_CONFIG;
  const products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
  const clients = Array.isArray(window.CLIENTS) ? window.CLIENTS : [];
  const slides = Array.isArray(window.HOME_SLIDES) ? window.HOME_SLIDES : [];
  const divisionLabel = (value) =>
    value === "medical" ? "Medical" : "Industri";

  function renderHeroSlider() {
    const slider = document.getElementById("homeHeroSlider");
    const stage = document.getElementById("homeHeroSlides");
    const dotsHost = document.getElementById("homeHeroDots");
    const currentLabel = document.getElementById("homeHeroCurrent");
    const totalLabel = slider?.querySelector(".home-slider-total");
    const prevButton = document.getElementById("homeHeroPrev");
    const nextButton = document.getElementById("homeHeroNext");

    if (
      !slider ||
      !stage ||
      !dotsHost ||
      !prevButton ||
      !nextButton ||
      !slides.length
    )
      return;

    stage.innerHTML = slides
      .map(
        (slide, index) => `
      <article
        class="home-slide${index === 0 ? " is-active" : ""}"
        data-slide-index="${index}"
        aria-hidden="${index === 0 ? "false" : "true"}"
        ${index === 0 ? "" : "inert"}
      >
        <img
          class="home-slide-background"
          src="${slide.image}"
          alt="${slide.imageAlt}"
          width="1920"
          height="1080"
          ${index > 0 ? 'loading="lazy"' : 'fetchpriority="high"'}
        >
        <div class="home-slide-shade" aria-hidden="true"></div>

        <div class="container home-slide-container">
          <div class="home-slide-copy">
            <span class="home-slide-kicker">${slide.kicker}</span>
            <h2>${slide.title} <span>${slide.emphasis}</span></h2>
            <p class="home-slide-description">${slide.description}</p>
            <div class="home-slide-actions">
              <a class="hero-link hero-link-primary" href="${slide.primaryCta.href}">
                ${slide.primaryCta.label}
                <i data-lucide="arrow-up-right"></i>
              </a>
              <a class="hero-link hero-link-secondary" href="${slide.secondaryCta.href}">
                ${slide.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </article>`,
      )
      .join("");

    dotsHost.innerHTML = slides
      .map(
        (slide, index) => `
      <button
        class="home-slider-dot${index === 0 ? " is-active" : ""}"
        type="button"
        role="tab"
        data-slide-dot="${index}"
        aria-label="Tampilkan slide ${index + 1}: ${slide.kicker}"
        aria-selected="${index === 0}"
        tabindex="${index === 0 ? "0" : "-1"}"
      ><span></span></button>`,
      )
      .join("");

    if (totalLabel)
      totalLabel.textContent = String(slides.length).padStart(2, "0");

    const slideElements = Array.from(
      stage.querySelectorAll("[data-slide-index]"),
    );
    const dotElements = Array.from(
      dotsHost.querySelectorAll("[data-slide-dot]"),
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const autoplayDelay = Number(slider.dataset.autoplay) || 5200;
    let activeIndex = 0;

    const updateCurrentLabel = () => {
      if (currentLabel)
        currentLabel.textContent = String(activeIndex + 1).padStart(2, "0");
    };

    const setActiveSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;

      slideElements.forEach((element, itemIndex) => {
        const isActive = itemIndex === activeIndex;
        element.classList.toggle("is-active", isActive);
        element.setAttribute("aria-hidden", String(!isActive));
        element.inert = !isActive;
      });

      dotElements.forEach((element, itemIndex) => {
        const isActive = itemIndex === activeIndex;
        element.classList.toggle("is-active", isActive);
        element.setAttribute("aria-selected", String(isActive));
        element.tabIndex = isActive ? 0 : -1;
      });

      updateCurrentLabel();
    };

    const autoplay = window.APP_UTILS.createAutoplayController({
      delay: autoplayDelay,
      advance: () => setActiveSlide(activeIndex + 1),
      canRun: () => !reduceMotion && slides.length > 1,
    });

    const goToPrevious = () => {
      setActiveSlide(activeIndex - 1);
      autoplay.restart();
    };

    const goToNext = () => {
      setActiveSlide(activeIndex + 1);
      autoplay.restart();
    };

    prevButton.addEventListener("click", goToPrevious);
    nextButton.addEventListener("click", goToNext);

    dotElements.forEach((dot) =>
      dot.addEventListener("click", () => {
        setActiveSlide(Number(dot.dataset.slideDot));
        autoplay.restart();
      }),
    );

    slider.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") goToPrevious();
      if (event.key === "ArrowRight") goToNext();
    });

    updateCurrentLabel();
    autoplay.start();
  }

  function renderFeaturedProducts() {
    const host = document.getElementById("featuredProducts");
    if (!host || !products.length) return;

    const featured = [...products]
      .filter((product) => product.featured)
      .sort((a, b) => a.featuredOrder - b.featuredOrder)
      .slice(0, 6);

    host.innerHTML = featured
      .map(
        (product) => `
      <article class="product-card" data-reveal>
        <a class="product-media" href="product-detail.html?slug=${encodeURIComponent(product.slug)}" aria-label="Lihat detail ${product.name}">
          <img src="${product.image}" alt="Produk ${product.name}" width="640" height="500" loading="lazy">
          <span class="product-badge ${product.division}">${divisionLabel(product.division)}</span>
        </a>
        <div class="product-body">
          <div class="product-category">${product.category}</div>
          <h3><a href="product-detail.html?slug=${encodeURIComponent(product.slug)}">${product.name}</a></h3>
          <p>${product.shortDescription}</p>
          <a class="text-link" href="product-detail.html?slug=${encodeURIComponent(product.slug)}">Lihat detail <i data-lucide="arrow-up-right"></i></a>
        </div>
      </article>`,
      )
      .join("");
  }

  function renderPlatforms() {
    const host = document.getElementById("platformLogoGrid");
    const platforms = Array.isArray(config?.platformDirectory)
      ? config.platformDirectory
      : [];
    if (!host || !platforms.length) return;

    host.innerHTML = platforms
      .map((item) => {
        const content = `<img src="${item.logo}" alt="Logo ${item.label}" width="900" height="520" loading="lazy"><span>${item.label}</span>`;
        return item.url
          ? `<a class="platform-logo-card" href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="Buka ${item.label}">${content}</a>`
          : `<div class="platform-logo-card" aria-label="${item.label}">${content}</div>`;
      })
      .join("");
  }

  function renderClientMarquee() {
    const host = document.getElementById("homeClientMarquee");
    if (!host || !clients.length) return;

    const rowCount = 2;
    const chunkSize = Math.ceil(clients.length / rowCount);
    const rows = Array.from({ length: rowCount }, (_, rowIndex) => {
      const start = rowIndex * chunkSize;
      const rowClients = clients.slice(start, start + chunkSize);
      return rowClients.length ? rowClients : clients;
    });

    const renderRow = (rowClients, rowIndex) => {
      const repeatedClients = [...rowClients, ...rowClients];
      const cards = repeatedClients
        .map((client) => `<div class="client-logo-card">${client.name}</div>`)
        .join("");

      return `
        <div class="home-client-row${rowIndex % 2 ? " reverse" : ""}">
          <div class="client-track">${cards}</div>
        </div>`;
    };

    host.innerHTML = rows.map(renderRow).join("");
  }

  renderHeroSlider();
  renderFeaturedProducts();
  renderPlatforms();
  renderClientMarquee();

  if (window.lucide)
    window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
  requestAnimationFrame(() => {
    document
      .querySelectorAll("#featuredProducts [data-reveal]")
      .forEach((element, index) => {
        element.style.transitionDelay = `${index * 70}ms`;
        element.classList.add("is-visible");
      });
  });
})();
