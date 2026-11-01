export const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (x) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        x
      ],
  );
export const lines = (v) => esc(v).replaceAll("\n", "<br>");
export const money = (v) => "₹" + Number(v).toLocaleString("en-IN");
export function picture(src, alt, cls = "", eager = false, mobile = "") {
  const img = `<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async" width="1800" height="1200">`;
  return mobile
    ? `<picture><source media="(max-width: 700px)" srcset="${esc(mobile)}">${img}</picture>`
    : img;
}
const arrow = '<span aria-hidden="true">↗</span>';
function heading(s) {
  return `<div class="section-heading"><p class="eyebrow">${esc(s.eyebrow)}</p><h2>${lines(s.title)}</h2></div>`;
}
function section(c, s) {
  if (!s.visible) return "";
  const body =
    {
      journey: () =>
        `<div class="journey-sticky"><div class="journey-images">${c.journey.map((x, i) => picture(x.image, x.imageAlt, "journey-photo" + (i === 0 ? " active" : ""))).join("")}<div class="journey-shade"></div></div><div class="journey-caption"><p class="eyebrow">A WALK THROUGH AROHA</p><h3 id="journey-title">${lines(c.journey[0]?.title || "Explore at your own pace.")}</h3><p id="journey-description">${esc(c.journey[0]?.description || "")}</p><a class="text-link" id="journey-link" href="#${esc(c.journey[0]?.target || "visit")}">Discover more ${arrow}</a></div><nav class="journey-stops" aria-label="Journey stops">${c.journey.map((x, i) => `<button type="button" data-stop="${i}" ${i === 0 ? 'aria-current="step"' : ""}><small>0${i + 1}</small>${esc(x.name)}</button>`).join("")}</nav></div><div class="simple-chapters">${c.journey.map((x) => `<article>${picture(x.image, x.imageAlt)}<div><h3>${lines(x.title)}</h3><p>${esc(x.description)}</p><a href="#${esc(x.target)}" class="text-link">Discover more ${arrow}</a></div></article>`).join("")}</div>`,
      cottages: () =>
        `<div class="cottage-grid">${c.cottages.map((x, i) => `<article class="cottage"><button class="photo-button" data-cottage="${esc(x.id)}" aria-label="Explore ${esc(x.name)}">${picture(x.image, x.imageAlt)}<span class="photo-index">0${i + 1}</span><span class="photo-open" aria-hidden="true">↗</span></button><h3>${esc(x.name)}</h3><p>${esc(x.description)}</p><button class="text-link" data-cottage="${esc(x.id)}">Take a closer look ${arrow}</button></article>`).join("")}</div>`,
      experiences: () =>
        `<div class="experience-layout"><div class="experience-image">${picture(c.intro.image, c.intro.imageAlt)}<span class="image-note">Small discoveries.<br>Lasting memories.</span></div><div class="experience-grid">${c.experiences.map((x, i) => `<article><span class="experience-number">0${i + 1} /</span><h3>${esc(x.name)}</h3><p>${esc(x.description)}</p></article>`).join("")}</div></div>`,
      packages: () =>
        `<div class="package-grid">${c.packages.map((x) => `<article class="package ${x.featured ? "featured" : ""}"><p class="eyebrow">${esc(x.subtitle)}</p><h3>${esc(x.name)}</h3><p>${esc(x.description)}</p><div class="price"><small>FROM</small><strong>${money(x.price)}</strong><span>${esc(x.unit)}</span></div><ul>${x.inclusions.map((t) => `<li>${esc(t)}</li>`).join("")}</ul><p class="package-note">${esc(x.note)}</p><button class="button ${x.featured ? "light" : "outline"}" data-enquire="${esc(x.id)}">Enquire about this visit ${arrow}</button></article>`).join("")}</div><p class="tariff-note">${esc(c.visit.priceNote)}</p>`,
      gallery: () =>
        `<div class="gallery-grid">${c.gallery.map((x, i) => `<button class="photo-button" data-gallery="${i}" aria-label="Enlarge: ${esc(x.imageAlt)}">${picture(x.image, x.imageAlt)}<span class="photo-open" aria-hidden="true">↗</span></button>`).join("")}</div>`,
      visit: () =>
        `<div class="visit-grid"><div><p class="visit-lede">${esc(c.visit.description)}</p><div class="visit-actions"><button class="button" data-enquire="">${esc(c.visit.enquiryLabel)} ${arrow}</button><a class="text-link" href="${esc(c.visit.mapUrl)}" target="_blank" rel="noopener noreferrer">Find your way ${arrow}</a></div><p class="visit-policy">${esc(c.visit.note)}</p><a href="tel:+${esc(c.visit.phone)}">+${esc(c.visit.phone)}</a><br><a href="mailto:${esc(c.visit.email)}">${esc(c.visit.email)}</a></div><div class="faqs">${c.faqs.map((x) => `<details><summary>${esc(x.question)}<span aria-hidden="true">+</span></summary><p>${esc(x.answer)}</p></details>`).join("")}</div></div>`,
    }[s.id]?.() || "";
  return `<section id="${s.id}" class="section section-${s.id}">${heading(s)}${body}</section>`;
}
export function renderSite(c) {
  return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="brand" href="#home" aria-label="${esc(c.brand.name)} home"><img src="/assets/brand/logo-white.svg" alt="${esc(c.brand.name)}" width="220" height="75"></a><nav aria-label="Main navigation">${[
    ["cottages", "Stay"],
    ["experiences", "Experience"],
    ["packages", "Visit"],
  ]
    .filter(([id]) => c.sections.some((s) => s.id === id && s.visible))
    .map(([id, label]) => `<a href="#${id}">${label}</a>`)
    .join(
      "",
    )}</nav><div class="header-actions"><button id="view-toggle" class="quiet" aria-pressed="false">Simple view</button><button class="header-enquire" data-enquire="">Enquire ${arrow}</button></div></header>
 <main id="main"><section class="hero" id="home">${picture(c.hero.image, c.hero.imageAlt, "hero-photo", true, c.hero.mobileImage)}<div class="hero-shade"></div><div class="hero-content"><p class="eyebrow">${esc(c.hero.eyebrow)}</p><h1>${lines(c.hero.title)}</h1><p class="hero-description">${esc(c.hero.description)}</p><div class="hero-actions"><a class="button light" id="start-journey" href="${c.sections.some((s) => s.id === "journey" && s.visible) ? "#journey" : "#intro"}">${esc(c.hero.primaryLabel)} <span aria-hidden="true">↓</span></a><button class="hero-secondary" data-enquire="">${esc(c.hero.secondaryLabel)} ${arrow}</button></div></div><div class="hero-foot"><span>${esc(c.brand.tagline)}</span><span lang="kn">${esc(c.brand.kannada)}</span><a href="#intro">SCROLL TO SLOW DOWN <span aria-hidden="true">↓</span></a></div></section>
 <section id="intro" class="intro section"><div class="intro-mark"><img src="/assets/brand/icon.svg" width="88" height="88" alt=""></div><p class="eyebrow">${esc(c.intro.eyebrow)}</p><h2>${lines(c.intro.title)}</h2><p class="intro-copy">${esc(c.intro.description)}</p><p class="welcome">${esc(c.brand.welcome)}</p><p class="kannada" lang="kn">${esc(c.brand.welcomeKannada)}</p></section>
 ${c.sections.map((s) => section(c, s)).join("")}</main><footer class="site-footer"><div><img src="/assets/brand/logo-forest.svg" width="220" height="75" alt="${esc(c.brand.name)}"><p>${esc(c.brand.tagline)}</p></div><p>${esc(c.brand.welcome)}<br><span lang="kn">${esc(c.brand.welcomeKannada)}</span></p><div><a href="/admin/">Host login</a><span>© ${new Date().getFullYear()} ${esc(c.brand.name)}</span><button class="text-link" id="privacy-settings">Privacy & monitoring</button></div></footer><dialog id="details-dialog" class="details-dialog" aria-labelledby="dialog-title"><button class="dialog-close" aria-label="Close details">×</button><div id="dialog-content"></div></dialog><div class="toast" role="status" hidden></div>`;
}
