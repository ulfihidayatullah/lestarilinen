(function () {
  "use strict";

  const config = window.SITE_CONFIG;
  if (!config) return;

  const contentMap = {
    contactAddress: config.company.address,
    contactPhone: config.company.phone,
    contactWhatsapp: config.company.whatsappDisplay,
    contactEmail: config.company.email,
    contactHours: config.company.hours,
  };

  Object.entries(contentMap).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  });

  const host = document.getElementById("contactPlatformGrid");
  if (!host) return;

  const whatsappMessage = encodeURIComponent(config.defaultWhatsappMessage);
  const marketplaceItems = Array.isArray(config.platformDirectory)
    ? config.platformDirectory.filter(
        (item) => item.type === "marketplace" && item.url,
      )
    : [];
  const items = [
    {
      label: "WhatsApp",
      description: "Konsultasikan kebutuhan produk secara langsung.",
      icon: "message-circle",
      href: `https://wa.me/${config.company.whatsapp}?text=${whatsappMessage}`,
      className: "whatsapp",
    },
    ...marketplaceItems.map((item) => ({ ...item, href: item.url })),
    {
      label: "Instagram",
      description: "Ikuti informasi dan pembaruan perusahaan.",
      icon: "instagram",
      href: config.company.instagram,
      className: "instagram",
    },
  ];

  host.innerHTML = items
    .map(
      (item) => `
    <a class="contact-platform-button ${item.className}" href="${item.href}" target="_blank" rel="noopener noreferrer">
      <span class="contact-platform-icon"><i data-lucide="${item.icon}"></i></span>
      <span class="contact-platform-copy"><strong>${item.label}</strong><small>${item.description}</small></span>
      <i class="contact-platform-arrow" data-lucide="arrow-up-right"></i>
    </a>`,
    )
    .join("");

  if (window.lucide)
    window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
})();
