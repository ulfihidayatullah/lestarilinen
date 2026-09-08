(function () {
  'use strict';

  const host = document.getElementById('clientShowcase');
  const clients = Array.isArray(window.CLIENTS) ? window.CLIENTS : [];
  
  if (!host || clients.length === 0) return;

  const MAX_PER_ROW = 20;

  // Render kartu (menggunakan destructuring langsung pada properti 'name')
  const renderCard = ({ name }) => `
    <div class="client-marquee-card">
      <strong>${name}</strong>
    </div>`;

  // Hitung total baris yang dibutuhkan
  const rowCount = Math.ceil(clients.length / MAX_PER_ROW);

  // Render keseluruhan HTML
  host.innerHTML = Array.from({ length: rowCount }, (_, rowIndex) => {
    // Potong array data (chunk) khusus untuk baris ini
    const chunk = clients.slice(rowIndex * MAX_PER_ROW, (rowIndex + 1) * MAX_PER_ROW);
    
    // Render HTML card untuk chunk ini, lalu gandakan string HTML-nya 4 kali
    const trackContent = chunk.map(renderCard).join('').repeat(4);
    
    // Baris 1 (index 0) ke kanan (reverse), Baris 2 (index 1) ke kiri, dst.
    const directionClass = rowIndex % 2 === 0 ? ' reverse' : '';

    return `
      <div class="client-marquee-row client-marquee-row-${rowIndex + 1}${directionClass}">
        <div class="client-marquee-track">
          ${trackContent}
        </div>
      </div>`;
  }).join('');
})();