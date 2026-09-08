(function () {
  'use strict';

  const detailHost = document.getElementById('productDetail');
  const products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
  const config = window.SITE_CONFIG;

  if (!detailHost || !products.length || !config) return;

  const params = new URLSearchParams(window.location.search);
  const product = products.find(item => item.slug === params.get('slug')) || products[0];

  const catalogUrl = item => item.division === 'industry'
    ? 'lestari-industrial-apparel.html'
    : 'lestari-linen.html';
  const catalogLabel = item => item.division === 'industry'
    ? 'Lestari Industrial Apparel'
    : 'Lestari Linen';

  const whatsappMessage = encodeURIComponent(
    `Halo PT Lestari Dini Tunggul, saya ingin mendapatkan informasi dan penawaran mengenai produk ${product.name}.`
  );
  const whatsappUrl = `https://wa.me/${config.company.whatsapp}?text=${whatsappMessage}`;

  const galleryFallback = [
    { src: product.image, alt: product.name },
    { src: 'assets/images/products/gallery/detail-material.svg', alt: `Detail material ${product.name}` },
    { src: 'assets/images/products/gallery/detail-construction.svg', alt: `Detail konstruksi ${product.name}` },
    { src: 'assets/images/products/gallery/detail-application.svg', alt: `Contoh aplikasi ${product.name}` }
  ];

  const gallery = (Array.isArray(product.images) && product.images.length ? product.images : galleryFallback)
    .slice(0, 4)
    .map((item, index) => typeof item === 'string'
      ? { src: item, alt: `${product.name} - Foto ${index + 1}` }
      : { src: item.src, alt: item.alt ? `${product.name} — ${item.alt}` : `${product.name} - Foto ${index + 1}` });

  const platformLinks = Array.isArray(config.platformDirectory)
    ? config.platformDirectory.filter(item => item.type === 'marketplace' && item.url)
    : [];

  document.title = `${product.name} | PT Lestari Dini Tunggul`;
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) descriptionMeta.setAttribute('content', product.shortDescription);

  detailHost.innerHTML = `
    <nav class="detail-breadcrumb" aria-label="Breadcrumb">
      <a href="index.html">Home</a><i data-lucide="chevron-right"></i>
      <a href="${catalogUrl(product)}">${catalogLabel(product)}</a><i data-lucide="chevron-right"></i>
      <span aria-current="page">${product.name}</span>
    </nav>

    <div class="product-detail-layout">
      <div class="product-gallery" data-reveal>
        <div class="product-gallery-main" id="productGalleryMain">
          <img id="productMainImage" src="${gallery[0].src}" alt="${gallery[0].alt}" width="900" height="800">
          <span class="product-gallery-counter"><i data-lucide="images"></i><span id="galleryCounter">1 / ${gallery.length}</span></span>
        </div>
        <div class="product-thumbnails" aria-label="Galeri foto ${product.name}">
          ${gallery.map((image, index) => `
            <button class="product-thumbnail${index === 0 ? ' active' : ''}" type="button" data-gallery-index="${index}" aria-label="Tampilkan foto ${index + 1} ${product.name}" aria-pressed="${index === 0}">
              <img src="${image.src}" alt="${image.alt}" width="220" height="180"${index > 0 ? ' loading="lazy"' : ''}>
            </button>`).join('')}
        </div>
      </div>

      <article class="product-detail-info" data-reveal>
        <h1>${product.name}</h1>

        <div class="product-offer-card">
          <div class="icon"><i data-lucide="badge-percent"></i></div>
          <div>
            <strong>Penawaran Disesuaikan dengan Kebutuhan</strong>
            <p>Harga dan konfigurasi produk ditentukan berdasarkan jumlah, material, ukuran, detail kustomisasi, serta kebutuhan proyek. Tim kami siap membantu menyiapkan penawaran yang relevan.</p>
          </div>
        </div>

        <section class="product-info-section" aria-labelledby="description-title">
          <h2 id="description-title">Deskripsi Produk</h2>
          <p>${product.shortDescription} Produk dapat dikembangkan lebih lanjut melalui penyesuaian desain, ukuran, warna, dan detail identitas agar selaras dengan kebutuhan operasional pengguna.</p>
        </section>

        <section class="product-info-section" aria-labelledby="specification-title">
          <h2 id="specification-title">Spesifikasi Produk</h2>
          <ul class="product-spec-list">
            ${product.specifications.map(item => `<li><i data-lucide="check-circle-2"></i><span>${item}</span></li>`).join('')}
          </ul>
        </section>

        <section class="product-info-section" aria-labelledby="material-title">
          <h2 id="material-title">Material</h2>
          <div class="product-material-row"><span>Rekomendasi</span><strong>${product.material}</strong></div>
        </section>

        <section class="product-info-section" aria-labelledby="custom-title">
          <div class="product-custom-box">
            <i data-lucide="wand-sparkles"></i>
            <div>
              <strong id="custom-title">Fleksibel untuk Kebutuhan Institusi</strong>
              <p>Ukuran, warna, material, bordir atau identitas, serta detail konstruksi dapat dikonsultasikan berdasarkan fungsi produk dan standar internal pelanggan.</p>
            </div>
          </div>
        </section>

        <section class="product-info-section" aria-labelledby="order-title">
          <h2 id="order-title">Pemesanan Produk</h2>
          <p>Sampaikan kebutuhan awal, jumlah, spesifikasi, dan target penggunaan kepada tim kami. Setiap permintaan akan ditinjau untuk memastikan material dan konstruksi produk sesuai dengan kebutuhan operasional.</p>
        </section>

        <section class="product-info-section" aria-labelledby="platform-title">
          <div class="product-platform-panel">
            <span class="eyebrow">Temukan Platform Kami</span>
            <h2 id="platform-title">Akses Kanal Pengadaan & Marketplace</h2>
            <p>Pilih platform yang paling sesuai untuk menelusuri kanal pengadaan atau marketplace PT Lestari Dini Tunggul.</p>
            <div class="product-platform-links">
              ${platformLinks.map(item => `<a class="product-platform-link" href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="Buka ${item.label}"><span class="product-platform-logo"><img src="${item.logo}" alt="Logo ${item.label}" width="180" height="72" loading="lazy"></span><span class="product-platform-name">${item.label}</span><i data-lucide="arrow-up-right"></i></a>`).join('')}
            </div>
          </div>
        </section>
           <div class="product-detail-actions">
          <a class="btn btn-brand btn-lg" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer"><i data-lucide="message-circle"></i> Konsultasi via WhatsApp</a>
          <a class="btn btn-outline-brand btn-lg" href="${catalogUrl(product)}">Kembali ke Produk</a>
        </div>
      </article>
    </div>`;

  const mainImage = document.getElementById('productMainImage');
  const mainFrame = document.getElementById('productGalleryMain');
  const galleryCounter = document.getElementById('galleryCounter');
  const thumbnailButtons = Array.from(detailHost.querySelectorAll('[data-gallery-index]'));

  thumbnailButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.galleryIndex);
      const selected = gallery[index];
      if (!selected || button.classList.contains('active')) return;

      mainFrame.classList.add('is-switching');
      window.setTimeout(() => {
        mainImage.src = selected.src;
        mainImage.alt = selected.alt;
        galleryCounter.textContent = `${index + 1} / ${gallery.length}`;
        thumbnailButtons.forEach((item, itemIndex) => {
          const active = itemIndex === index;
          item.classList.toggle('active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        mainFrame.classList.remove('is-switching');
      }, 120);
    });
  });

  const relatedHost = document.getElementById('relatedProducts');
  if (relatedHost) {
    const related = products
      .filter(item => item.division === product.division && item.id !== product.id)
      .slice(0, 3);

    relatedHost.innerHTML = related.map(item => `
      <article class="related-card">
        <img src="${item.image}" alt="${item.name}" width="420" height="320" loading="lazy">
        <div>
          <span>${item.category}</span>
          <h3>${item.name}</h3>
          <a href="product-detail.html?slug=${encodeURIComponent(item.slug)}">Lihat detail <i data-lucide="arrow-up-right"></i></a>
        </div>
      </article>`).join('');
  }

  if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
  requestAnimationFrame(() => {
    detailHost.querySelectorAll('[data-reveal]').forEach(element => element.classList.add('is-visible'));
  });
})();
