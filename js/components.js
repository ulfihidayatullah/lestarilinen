(function () {
  'use strict';

  const config = window.SITE_CONFIG;
  if (!config) return;

  const page = document.body.dataset.page || '';
  const marketplaceItems = Array.isArray(config.platformDirectory)
    ? config.platformDirectory.filter(item => item.type === 'marketplace' && item.url)
    : [];
  const navItems = [
    ['home', 'index.html', 'Home'],
    ['workshop', 'workshop.html', 'Workshop'],
    ['about', 'about.html', 'About'],
    ['clients', 'clients.html', 'Our Clients'],
    ['contact', 'contact.html', 'Contact Us']
  ];

  function renderHeader() {
    const host = document.getElementById('site-header');
    if (!host) return;

    const productPages = ['products', 'products-linen', 'products-industrial', 'products-rfid'];
    const productActive = productPages.includes(page);
    const productMenu = `
      <li class="nav-item nav-product-dropdown${productActive ? ' active' : ''}">
        <button class="nav-link nav-product-toggle${productActive ? ' active' : ''}" type="button" aria-haspopup="true" aria-expanded="false">
          <span>Produk</span><i data-lucide="chevron-down" aria-hidden="true"></i>
        </button>
        <ul class="product-dropdown-menu" aria-label="Submenu Produk">
          <li><a class="product-dropdown-link${page === 'products-linen' ? ' active' : ''}" href="lestari-linen.html"${page === 'products-linen' ? ' aria-current="page"' : ''}>Lestari Linen</a></li>
          <li><a class="product-dropdown-link${page === 'products-industrial' ? ' active' : ''}" href="lestari-industrial-apparel.html"${page === 'products-industrial' ? ' aria-current="page"' : ''}>Lestari Industrial Apparel</a></li>
          <li><a class="product-dropdown-link${page === 'products-rfid' ? ' active' : ''}" href="rfid.html"${page === 'products-rfid' ? ' aria-current="page"' : ''}>RFID</a></li>
        </ul>
      </li>`;

    const standardLinks = navItems.map(([key, href, label]) => {
      const active = page === key ? ' active' : '';
      const aria = page === key ? ' aria-current="page"' : '';
      const className = key === 'contact' ? `nav-link nav-contact${active}` : `nav-link${active}`;
      return `<li class="nav-item"><a class="${className}" href="${href}"${aria}>${label}</a></li>`;
    });
    const links = [standardLinks[0], productMenu, ...standardLinks.slice(1)].join('');

    host.innerHTML = `
      <header class="site-header" id="siteHeader">
        <nav class="navbar navbar-expand-lg navbar-light" aria-label="Navigasi utama">
          <div class="container site-nav-wrap">
            <a class="navbar-brand" href="index.html" aria-label="${config.company.name} - Home">
              <img class="brand-logo brand-logo-default" src="assets/logo/lestari-blue.png" alt="Logo ${config.company.name}" width="198" height="48">
              <img class="brand-logo brand-logo-light" src="assets/logo/lestari-white.png" alt="" width="198" height="48" aria-hidden="true">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Buka menu navigasi">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mainNavbar">
              <ul class="navbar-nav ms-auto align-items-lg-center">${links}</ul>
            </div>
          </div>
        </nav>
      </header>`;
  }

  function renderFooterMarketplaceGrid() {
    if (!marketplaceItems.length) return '';

    return `
      <div class="footer-marketplace-grid" aria-label="Marketplace PT Lestari Dini Tunggul">
        ${marketplaceItems.map(item => `
          <a class="footer-marketplace-card" href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="Buka ${item.label}">
            <img src="${item.footerLogo || item.logo}" alt="Logo ${item.label}" width="180" height="72" loading="lazy">
          </a>`).join('')}
      </div>`;
  }

  function renderFooter() {
    const host = document.getElementById('site-footer');
    if (!host) return;

    host.innerHTML = `
      <footer class="site-footer">
        <div class="footer-pattern" aria-hidden="true"></div>
        <div class="container position-relative">
          <div class="footer-grid">
            <section class="footer-column footer-column-company" aria-labelledby="footer-company-title">
              <h2 id="footer-company-title" class="visually-hidden">${config.company.name}</h2>
              <a href="index.html" class="footer-logo">
                <img src="assets/logo/lestari-white.png" alt="Logo ${config.company.name}" width="210" height="52">
              </a>
              <p class="footer-description">Berawal dari sebuah langkah sederhana pada tahun 1982, PT Lestari Dini Tunggul dibangun dengan semangat juang dan idealisme yang tinggi.</p>
             <!-- Bagian social media ini dinonaktifkan (dikomen)
              <div class="social-links" aria-label="Social media">
                <a href="${config.company.instagram}" aria-label="Instagram"><i data-lucide="instagram"></i></a>
                <a href="${config.company.facebook}" aria-label="Facebook"><i data-lucide="facebook"></i></a>
                <a href="${config.company.linkedin}" aria-label="LinkedIn"><i data-lucide="linkedin"></i></a>
              </div>
              -->
            </section>

            <section class="footer-column" aria-labelledby="footer-find-us-title">
              <h2 id="footer-find-us-title" class="footer-title">Find Us</h2>
              <p class="footer-find-us-copy">Temukan toko dan kanal pengadaan resmi kami melalui platform berikut.</p>
              ${renderFooterMarketplaceGrid()}
            </section>

            <section class="footer-column" aria-labelledby="footer-product-title">
              <h2 id="footer-product-title" class="footer-title">Product</h2>
              <ul class="footer-links">
                <li><a href="lestari-linen.html">Lestari Linen</a></li>
                <li><a href="lestari-industrial-apparel.html">Lestari Industrial Apparel</a></li>
                <li><a href="rfid.html">RFID</a></li>
              </ul>
            </section>

            <section class="footer-column" aria-labelledby="footer-contact-title">
              <h2 id="footer-contact-title" class="footer-title">Contact Us</h2>
              <ul class="footer-contact">
                <li><i data-lucide="map-pin"></i><span>${config.company.address}</span></li>
                <li><i data-lucide="phone"></i><span>${config.company.phone}</span></li>
                <li><i data-lucide="message-circle"></i><span>${config.company.whatsappDisplay}</span></li>
                <li><i data-lucide="mail"></i><span>${config.company.email}</span></li>
              </ul>
            </section>
          </div>

          <div class="footer-bottom">
            <p>© <span id="copyrightYear"></span> ${config.company.name}. All Rights Reserved.</p>
            <p class="footer-note">Medical Apparel · Hospital Linen · Industrial Apparel</p>
          </div>
        </div>
      </footer>`;
  }

  function renderFloatingWhatsapp() {
    const host = document.getElementById('floating-whatsapp');
    if (!host) return;

    const message = encodeURIComponent(config.defaultWhatsappMessage);
    host.innerHTML = `
      <a class="floating-wa" href="https://wa.me/${config.company.whatsapp}?text=${message}" target="_blank" rel="noopener noreferrer" aria-label="Konsultasi via WhatsApp">
        <span class="wa-tooltip">Konsultasi via WhatsApp</span>
        <i data-lucide="message-circle" aria-hidden="true"></i>
      </a>`;
  }

  renderHeader();
  renderFooter();
  renderFloatingWhatsapp();
})();
