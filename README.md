# PT Lestari Dini Tunggul — Frontend Company Profile

Frontend multi-page untuk company profile, katalog produk, detail produk, workshop, klien, dan kanal pengadaan PT Lestari Dini Tunggul.

## Struktur proyek

```text
pt-lestari-dini-tunggul/
├── index.html
├── products.html
├── product-detail.html
├── workshop.html
├── about.html
├── clients.html
├── contact.html
├── assets/
│   ├── images/
│   │   ├── about/
│   │   ├── platforms/
│   │   ├── products/
│   │   │   └── gallery/
│   │   └── workshop/
│   │       └── activities/
│   └── logo/
├── css/
│   ├── bootstrap-fallback.css
│   ├── style.css
│   ├── responsive.css
│   └── pages/
│       ├── home.css
│       ├── product-detail.css
│       └── workshop.css
├── data/
│   ├── home-slides.js
│   ├── products.js
│   └── clients.js
└── js/
    ├── config.js
    ├── components.js
    ├── main.js
    ├── utils/
    │   └── autoplay.js
    ├── home.js
    ├── products.js
    ├── product-detail.js
    ├── workshop.js
    ├── clients.js
    └── contact.js
```

## Site map

- `index.html` — Home: full-width hero slider tiga slide setinggi viewport dengan overlay copy/CTA, crossfade + slow zoom, autoplay sejak halaman pertama dimuat, kapabilitas, profil singkat, kanal pengadaan/marketplace, keunggulan, produk unggulan, marquee mitra dua baris, dan CTA.
- `products.html` — katalog dengan filter divisi, kategori dinamis, pencarian real-time, dan paginasi otomatis jika hasil melebihi 12 item.
- `product-detail.html?slug=...` — detail produk dinamis dengan galeri maksimal empat foto, informasi produk tanpa kategori/ringkasan ganda di area judul, spesifikasi, material, opsi kustomisasi, CTA WhatsApp, logo kanal pengadaan, dan related products.
- `workshop.html` — fasilitas produksi, proses produksi, teknologi/peralatan, showcase RFID satu foto utama, quality control, serta carousel “Kegiatan Kami” empat foto yang berjalan otomatis.
- `about.html` — perjalanan perusahaan, arah, komitmen, nilai, dan kapabilitas.
- `clients.html` — lima baris marquee dua arah yang dirender dari `data/clients.js` agar jejaring klien berjumlah besar tetap ringkas dan mudah diganti dengan data aktual atau API.
- `contact.html` — informasi kontak dan tombol langsung ke WhatsApp, INAPROC, e-Katalog, Mbizmarket, Shopee, dan Instagram.

## Hero slider Home

Konten hero berada di `data/home-slides.js`, sedangkan renderer dan interaksinya berada di `js/home.js`. Hero menggunakan pendekatan **full-bleed / full viewport**: media memenuhi satu layar, copy berada sebagai overlay, pergantian slide menggunakan crossfade, dan gambar aktif menggunakan slow zoom yang ringan. Tipografi hero memakai Manrope dengan fallback sistem dan ukuran yang lebih proporsional. Slider berpindah otomatis setiap **5,2 detik**, serta tetap menyediakan indikator slide, dot navigation, dan previous/next.

Autoplay dijalankan segera setelah slider selesai dirender dan tidak membutuhkan interaksi tombol untuk memulai. Penjadwalan menggunakan helper bersama `js/utils/autoplay.js` agar timer konsisten, dapat di-reset setelah navigasi manual, dan berhenti ketika tab browser tidak aktif. Autoplay tetap dinonaktifkan ketika pengguna mengaktifkan `prefers-reduced-motion`. Navbar pada Home dibuat transparan di atas hero dan kembali ke tampilan putih setelah halaman di-scroll.

Struktur ini memudahkan integrasi backend/CMS: data `HOME_SLIDES` dapat diganti dengan respons API tanpa mengubah markup komponen slider.

## Arsitektur data untuk integrasi backend

### Produk

Semua data katalog berada di `data/products.js`. Struktur utama:

```javascript
{
  id: 1,
  slug: 'baju-operasi-premium',
  name: 'Baju Operasi Premium',
  division: 'medical',
  category: 'Baju Operasi',
  image: 'assets/images/products/baju-operasi-premium.svg',
  images: [
    { src: '...', alt: '...' },
    { src: '...', alt: '...' }
  ],
  shortDescription: '...',
  description: '...',
  material: '...',
  specifications: ['...', '...'],
  featured: true,
  featuredOrder: 1,
  keywords: ['...']
}
```

`images` dibatasi maksimal empat item oleh renderer `js/product-detail.js`. Pada integrasi API, backend cukup mengirim array media dengan bentuk `{ src, alt }` tanpa mengubah struktur layout.

### Klien

Daftar klien berada di `data/clients.js` dan dirender oleh `js/clients.js`. Untuk integrasi backend, array tersebut dapat diganti dengan respons API atau hasil fetch dari CMS. Halaman Home menampilkan dua baris marquee, sedangkan halaman Our Clients menampilkan lima baris. Renderer menggandakan item hanya untuk kebutuhan loop visual dan menggeser urutan setiap baris agar komposisinya tidak identik.

### Konfigurasi perusahaan

`js/config.js` menjadi satu sumber konfigurasi untuk identitas perusahaan dan metadata platform. Array `platformDirectory` menyimpan label, tipe kanal, URL, logo, deskripsi, ikon, dan class visual. Data yang sama digunakan ulang oleh Home, Product Detail, Contact, dan bagian **Find Us** di footer sehingga URL/logo marketplace tidak perlu diduplikasi di banyak file.

Nomor WhatsApp dan URL akun/store perusahaan masih perlu diganti dengan data final apabila tautan spesifik perusahaan sudah tersedia.

## Galeri & detail produk

`js/product-detail.js` membaca `product.images`, mengambil maksimal empat foto, lalu membuat:

1. foto utama;
2. thumbnail interaktif;
3. active state;
4. counter foto;
5. pergantian foto utama tanpa reload;
6. breadcrumb ringkas `Home > Products > Nama Produk`;
7. logo visual INAPROC, e-Katalog, Mbizmarket, dan Shopee pada blok kanal pengadaan.

Tiga aset generik di `assets/images/products/gallery/` berfungsi sebagai fallback sampai foto produk tambahan tersedia.

## Workshop, RFID & lightbox

Struktur Workshop dibuat modular melalui `workshop.html`, `css/pages/workshop.css`, dan `js/workshop.js`. Showcase RFID menggunakan **satu foto utama** berukuran besar agar fokus visual lebih kuat dan layout tetap seimbang dengan kolom informasi teknologi. Empat dokumentasi kegiatan menggunakan **carousel responsif** dengan `object-fit: cover`, autoplay setiap **4,4 detik** sejak halaman dimuat, kontrol panah/dot, serta fallback `prefers-reduced-motion`. Timer menggunakan helper bersama `js/utils/autoplay.js`, sehingga navigasi manual hanya me-reset jadwal autoplay dan tidak mematikannya. Semua foto utama Workshop, RFID, quality control, dan kegiatan dapat diklik untuk membuka lightbox tanpa dependency tambahan.

Showcase RFID tidak memiliki input upload pada halaman publik. Foto utama berada di:

- `assets/images/workshop/rfid-01.svg`

Ganti file tersebut dengan dokumentasi RFID perusahaan menggunakan nama/path yang sama, atau ubah `src` pada `workshop.html`.

Galeri “Kegiatan Kami” menggunakan maksimal empat aset di `assets/images/workshop/activities/`.

## Footer & marketplace

Footer dirender satu kali melalui `js/components.js` untuk seluruh halaman. Menu **Quick Links telah dihapus** dan posisinya digantikan oleh **Find Us**. Empat logo marketplace (`type: "marketplace"`) diambil langsung dari `SITE_CONFIG.platformDirectory`. Footer tidak lagi bergantung pada Bootstrap grid: CSS Grid native memaksa **empat kolom dengan lebar sama pada desktop**, dua kolom pada tablet, dan satu kolom pada mobile. Logo Find Us memakai properti `footerLogo` dan aset **PNG transparan**, disusun vertikal tanpa kartu/background putih; perubahan logo atau tautan tetap dilakukan dari konfigurasi terpusat.

## Menjalankan

Website dapat dibuka langsung melalui `index.html`, tetapi static server direkomendasikan:

```bash
python -m http.server 8080
```

Kemudian buka `http://localhost:8080`.

## Dependensi

- Bootstrap 5.3 via CDN
- Lucide Icons via CDN

Animasi viewport menggunakan `IntersectionObserver` pada `js/main.js`; tidak ada library animasi berat.

## Catatan publikasi

- Ganti nomor WhatsApp placeholder di `js/config.js`.
- Ganti URL marketplace dengan URL akun/store resmi PT Lestari Dini Tunggul.
- Ganti foto SVG placeholder produk/workshop dengan dokumentasi asli perusahaan.
- Ganti `CLIENT 001`, dan seterusnya, dengan nama/logo klien yang telah disetujui untuk publikasi.
- Pastikan penggunaan logo pihak ketiga mengikuti pedoman merek masing-masing platform.
