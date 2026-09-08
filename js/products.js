(function () {
  'use strict';

  const products = window.PRODUCTS || [];
  const grid = document.getElementById('productGrid');
  const categoriesHost = document.getElementById('categoryFilters');
  const brandsHost = document.getElementById('brandFilters');
  const searchInput = document.getElementById('productSearch');
  const countHost = document.getElementById('productCount');
  const emptyState = document.getElementById('productEmpty');
  const paginationHost = document.getElementById('productPagination');
  const fixedDivision = document.body.dataset.productDivision;

  if (!grid || !categoriesHost || !brandsHost || !searchInput) return;
  if (!['medical', 'industry'].includes(fixedDivision)) return;

  const ITEMS_PER_PAGE = 12;
  const scopedProducts = products.filter(product => product.division === fixedDivision);
  const state = { category: 'all', brand: 'all', query: '', page: 1 };

  const normalize = value => String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const divisionLabel = value => value === 'medical' ? 'Medical' : 'Industri';

  const productBrand = product => {
    const assignedBrand = product.brand || product.merek || product.manufacturer ||
      (Array.isArray(product.brands) ? product.brands[0] : '');
    return assignedBrand || (product.division === 'industry' ? 'Lestari Industrial Apparel' : 'Lestari Linen');
  };

  const getAvailableCategories = () => [...new Set(scopedProducts.map(product => product.category).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'id'));

  const getAvailableBrands = () => [...new Set(scopedProducts.map(productBrand).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'id'));

  const renderCategories = () => {
    const categories = getAvailableCategories();
    if (state.category !== 'all' && !categories.includes(state.category)) state.category = 'all';
    categoriesHost.innerHTML = [
      '<option value="all">Semua Kategori Produk</option>',
      ...categories.map(category => `<option value="${category}">${category}</option>`)
    ].join('');
    categoriesHost.value = state.category;
  };

  const renderBrands = () => {
    const brands = getAvailableBrands();
    if (state.brand !== 'all' && !brands.includes(state.brand)) state.brand = 'all';
    brandsHost.innerHTML = [
      '<option value="all">Semua Brand</option>',
      ...brands.map(brand => `<option value="${brand}">${brand}</option>`)
    ].join('');
    brandsHost.value = state.brand;
  };

  const matches = product => {
    const categoryMatch = state.category === 'all' || product.category === state.category;
    const brandMatch = state.brand === 'all' || productBrand(product) === state.brand;
    const haystack = normalize([
      product.name,
      product.category,
      productBrand(product),
      product.shortDescription,
      product.description,
      ...(product.keywords || [])
    ].join(' '));
    const searchMatch = !state.query || haystack.includes(normalize(state.query));
    return categoryMatch && brandMatch && searchMatch;
  };

  const getBrandButtonData = brand => {
    switch (brand) {
      case 'Lestari Linen': return { cls: 'btn-brand-lestari', text: 'Lestari Linen' };
      case 'Hosline': return { cls: 'btn-brand-hosline', text: 'Hosline' };
      case 'Medicloth': return { cls: 'btn-brand-medicloth', text: 'Medicloth' };
      case 'Comfort': return { cls: 'btn-brand-comfort', text: 'Comfort' };
      case 'Nurse Color': return { cls: 'btn-brand-nurse', text: 'Nurse Color' };
      case 'White Linen': return { cls: 'btn-brand-white', text: 'White Linen' };
      case 'Lestari Industrial Apparel': return { cls: 'btn-brand-industrial', text: 'Lestari Industrial' };
      default: return { cls: 'btn-brand-soft', text: brand || 'Produk' };
    }
  };

  const cardTemplate = product => {
    const brand = productBrand(product);
    const btnData = getBrandButtonData(brand);
    const detailUrl = `product-detail.html?slug=${encodeURIComponent(product.slug)}`;
    return `
      <article class="product-card catalog-card">
        <a class="product-media" href="${detailUrl}" aria-label="Lihat detail ${product.name}">
          <img src="${product.image}" alt="Produk ${product.name}" width="640" height="500" loading="lazy">
          <span class="product-badge ${product.division}">${divisionLabel(product.division)}</span>
        </a>
        <div class="product-body">
          <div class="product-category">${product.category}</div>
          <h2><a href="${detailUrl}">${product.name}</a></h2>
          <p>${product.shortDescription}</p>
          <div class="product-actions">
            <a class="btn btn-sm btn-outline-brand" href="${detailUrl}">Detail</a>
            <span class="btn btn-sm ${btnData.cls}">${btnData.text}</span>
          </div>
        </div>
      </article>`;
  };

  const renderPagination = totalItems => {
    if (!paginationHost) return;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) {
      paginationHost.hidden = true;
      paginationHost.innerHTML = '';
      return;
    }
    if (state.page > totalPages) state.page = totalPages;
    const pageButtons = Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;
      const active = page === state.page;
      return `<button type="button" class="pagination-btn page-number ${active ? 'active' : ''}" data-page="${page}" ${active ? 'aria-current="page"' : ''} aria-label="Halaman ${page}">${page}</button>`;
    }).join('');
    paginationHost.hidden = false;
    paginationHost.innerHTML = `
      <button type="button" class="pagination-btn pagination-nav" data-page="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''} aria-label="Halaman sebelumnya"><i data-lucide="chevron-left"></i></button>
      <div class="pagination-pages">${pageButtons}</div>
      <button type="button" class="pagination-btn pagination-nav" data-page="${state.page + 1}" ${state.page === totalPages ? 'disabled' : ''} aria-label="Halaman berikutnya"><i data-lucide="chevron-right"></i></button>`;
  };

  const renderProducts = () => {
    const filtered = scopedProducts.filter(matches);
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    if (state.page > totalPages) state.page = totalPages;
    const start = (state.page - 1) * ITEMS_PER_PAGE;
    const visibleProducts = filtered.slice(start, start + ITEMS_PER_PAGE);

    grid.innerHTML = visibleProducts.map(cardTemplate).join('');
    if (countHost) {
      countHost.textContent = filtered.length > ITEMS_PER_PAGE
        ? `${filtered.length} produk ditemukan • Halaman ${state.page} dari ${totalPages}`
        : `${filtered.length} produk ditemukan`;
    }
    if (emptyState) emptyState.hidden = filtered.length > 0;
    grid.hidden = filtered.length === 0;
    renderPagination(filtered.length);
    if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
  };

  categoriesHost.addEventListener('change', event => {
    state.category = event.target.value;
    state.page = 1;
    renderProducts();
  });

  brandsHost.addEventListener('change', event => {
    state.brand = event.target.value;
    state.page = 1;
    renderProducts();
  });

  searchInput.addEventListener('input', event => {
    state.query = event.target.value.trim();
    state.page = 1;
    renderProducts();
  });

  if (paginationHost) {
    paginationHost.addEventListener('click', event => {
      const button = event.target.closest('[data-page]');
      if (!button || button.disabled) return;
      const nextPage = Number(button.dataset.page);
      if (!Number.isInteger(nextPage) || nextPage < 1 || nextPage === state.page) return;
      state.page = nextPage;
      renderProducts();
      document.getElementById('catalog-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  renderCategories();
  renderBrands();
  renderProducts();
})();
