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
function palmArt(cls = "") {
  const fronds = Array.from({ length: 15 }, (_, i) => {
    const y = 45 + i * 21,
      spread = Math.sin(((i + 1) / 17) * Math.PI) * 125;
    return `<path d="M150 ${y} Q${150 - spread * 0.45} ${y - 40} ${150 - spread} ${y + 65}"/><path d="M150 ${y} Q${150 + spread * 0.45} ${y - 40} ${150 + spread} ${y + 65}"/>`;
  }).join("");
  return `<svg class="palm-art ${cls}" viewBox="0 0 300 500" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="M150 470Q148 240 150 24"/>${fronds}</svg>`;
}
function heading(s) {
  return `<div class="section-heading"><p class="eyebrow">${esc(s.eyebrow)}</p><h2>${lines(s.title)}</h2></div>`;
}
function section(c, s) {
  if (!s.visible) return "";
  const body =
    {
      journey: () =>
        `<div class="journey-sticky"><div class="journey-images">${c.journey.map((x, i) => picture(x.image, x.imageAlt, "journey-photo" + (i === 0 ? " active" : ""))).join("")}<div class="journey-shade"></div></div><div class="chapter-top"><span class="eyebrow">${esc(s.eyebrow)}</span><span id="chapter-counter">01 / ${String(c.journey.length).padStart(2, "0")}</span></div><div class="journey-caption"><p class="eyebrow" id="journey-name">${esc(c.journey[0]?.name || "Aroha")}</p><h3 id="journey-title">${lines(c.journey[0]?.title || "Explore at your own pace.")}</h3><p id="journey-description">${esc(c.journey[0]?.description || "")}</p><a class="text-link" id="journey-link" href="#${esc(c.journey[0]?.target || "visit")}">Discover more ${arrow}</a></div><a class="journey-hotspot" id="journey-hotspot" href="#${esc(c.journey[0]?.target || "visit")}" aria-label="Explore this part of Aroha"><span>↗</span><small>TAKE A CLOSER LOOK</small></a><div class="journey-route-art" aria-hidden="true"><svg viewBox="0 0 130 240"><path d="M40 225C-20 160 140 190 80 120S15 75 90 15"/><circle id="route-dot" cx="0" cy="0" r="5"/></svg><span>WANDER AT YOUR PACE</span></div><div class="journey-bottom"><nav class="journey-stops" aria-label="Journey stops">${c.journey.map((x, i) => `<button type="button" data-stop="${i}" ${i === 0 ? 'aria-current="step"' : ""}><small>0${i + 1}</small>${esc(x.name)}</button>`).join("")}</nav><div class="chapter-arrows"><button class="circle-control" data-chapter="-1" aria-label="Previous journey stop">←</button><button class="circle-control" data-chapter="1" aria-label="Next journey stop">→</button></div></div><div class="journey-progress" aria-hidden="true"></div></div><div class="simple-chapters">${c.journey.map((x) => `<article>${picture(x.image, x.imageAlt)}<div><h3>${lines(x.title)}</h3><p>${esc(x.description)}</p><a href="#${esc(x.target)}" class="text-link">Discover more ${arrow}</a></div></article>`).join("")}</div>`,
      cottages: () =>
        `<div class="collection-tools"><p>Find a place that feels like yours.</p><div><button class="circle-control" data-cottage-scroll="-1" aria-label="Previous cottage">←</button><button class="circle-control" data-cottage-scroll="1" aria-label="Next cottage">→</button></div></div><div class="cottage-grid" tabindex="0" aria-label="Cottage collection">${c.cottages.map((x, i) => `<article class="cottage"><div class="cottage-number" aria-hidden="true">0${i + 1}</div><button class="photo-button" data-cottage="${esc(x.id)}" aria-label="Explore ${esc(x.name)}">${picture(x.image, x.imageAlt)}<span class="cottage-door" aria-hidden="true"><span></span>↗</span><span class="photo-open" aria-hidden="true">Explore</span></button><div class="cottage-info"><span class="eyebrow">0${i + 1} / YOUR QUIET CORNER</span><h3>${esc(x.name)}</h3><p>${esc(x.description)}</p><button class="text-link" data-cottage="${esc(x.id)}">Take a closer look ${arrow}</button></div></article>`).join("")}</div>`,
      experiences: () =>
        `<div class="experience-layout"><div class="experience-image">${picture(c.intro.image, c.intro.imageAlt)}${palmArt("experience-palm")}<span class="image-note">${lines(c.brand.tagline.replaceAll(" · ", ".\n"))}</span></div><div class="experience-grid">${c.experiences.map((x, i) => `<details class="experience-item" name="farm-experiences" ${i === 0 ? "open" : ""}><summary><span class="experience-number">0${i + 1}</span><h3>${esc(x.name)}</h3><span class="experience-plus" aria-hidden="true">+</span></summary><p>${esc(x.description)}</p></details>`).join("")}</div></div>`,
      packages: () =>
        `<div class="package-grid">${c.packages.map((x) => `<article class="package ${x.featured ? "featured" : ""}"><p class="eyebrow">${esc(x.subtitle)}</p><h3>${esc(x.name)}</h3><p>${esc(x.description)}</p><div class="price"><small>FROM</small><strong>${money(x.price)}</strong><span>${esc(x.unit)}</span></div><ul>${x.inclusions.map((t) => `<li>${esc(t)}</li>`).join("")}</ul><p class="package-note">${esc(x.note)}</p><button class="button ${x.featured ? "light" : "outline"}" data-enquire="${esc(x.id)}">Enquire about this visit ${arrow}</button></article>`).join("")}</div><p class="tariff-note">${esc(c.visit.priceNote)}</p>`,
      gallery: () =>
        `<div class="gallery-grid">${c.gallery.map((x, i) => `<figure class="memory" data-memory="${i}"><button class="photo-button" data-gallery="${i}" aria-label="Enlarge: ${esc(x.imageAlt)}">${picture(x.image, x.imageAlt)}<span class="photo-open" aria-hidden="true">↗</span></button><figcaption><span>0${i + 1} /</span> ${esc(x.imageAlt)}</figcaption></figure>`).join("")}</div>`,
      visit: () =>
        `<div class="visit-grid"><div><p class="visit-lede">${esc(c.visit.description)}</p><div class="visit-actions"><button class="button" data-enquire="">${esc(c.visit.enquiryLabel)} ${arrow}</button><a class="text-link" href="${esc(c.visit.mapUrl)}" target="_blank" rel="noopener noreferrer">Find your way ${arrow}</a></div><p class="visit-policy">${esc(c.visit.note)}</p><a href="tel:+${esc(c.visit.phone)}">+${esc(c.visit.phone)}</a><br><a href="mailto:${esc(c.visit.email)}">${esc(c.visit.email)}</a></div><div class="faqs">${c.faqs.map((x) => `<details><summary>${esc(x.question)}<span aria-hidden="true">+</span></summary><p>${esc(x.answer)}</p></details>`).join("")}</div></div>`,
    }[s.id]?.() || "";
  return `<section id="${s.id}" class="section section-${s.id}">${heading(s)}${body}</section>`;
}
export function renderSite(c) {
  const hasJourney = c.sections.some((x) => x.id === "journey" && x.visible);
  const secondary = c.gallery[0] || c.intro;
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><a class="brand" href="#home" aria-label="${esc(c.brand.name)} home"><img src="/assets/brand/logo-white.svg" alt="${esc(c.brand.name)}" width="220" height="75"></a><nav aria-label="Main navigation">${[
    ["journey", "The farm"],
    ["cottages", "Stay"],
    ["experiences", "Experience"],
    ["packages", "Visit"],
  ]
    .filter(([id]) => c.sections.some((x) => x.id === id && x.visible))
    .map(([id, label]) => `<a href="#${id}">${label}</a>`)
    .join(
      "",
    )}</nav><div class="header-actions"><button id="view-toggle" class="quiet" aria-pressed="false">Simple view</button><button class="header-enquire" data-enquire="">Plan your visit ${arrow}</button></div></header>
  <main id="main"><section class="arrival" id="home"><div class="hero"><div class="hero-landscape">${picture(c.hero.image, c.hero.imageAlt, "hero-photo", true, c.hero.mobileImage)}${picture(c.journey[c.journey.length - 1]?.image || c.hero.image, c.journey[c.journey.length - 1]?.imageAlt || c.hero.imageAlt, "hero-night-photo")}</div><div class="hero-shade"></div><div class="arrival-frame" aria-hidden="true"><div class="arrival-leaf arrival-left">${palmArt()}<span class="gate-handle"></span></div><div class="arrival-leaf arrival-right">${palmArt()}<span class="gate-handle"></span></div></div><div class="arrival-skyline" aria-hidden="true"><span></span><small>${esc(c.brand.kannada)}</small><span></span></div><div class="hero-content"><p class="eyebrow">${esc(c.hero.eyebrow)}</p><h1>${c.hero.title
    .split("\n")
    .map((line, i) => `<span>${i ? `<em>${esc(line)}</em>` : esc(line)}</span>`)
    .join(
      "",
    )}</h1><p class="hero-description">${esc(c.hero.description)}</p><div class="hero-actions"><a class="arrival-trigger" id="start-journey" href="${hasJourney ? "#journey" : "#intro"}"><span class="arrival-trigger-icon" aria-hidden="true">↓</span><span>${esc(c.hero.primaryLabel)}</span></a><button class="hero-secondary" data-enquire="">${esc(c.hero.secondaryLabel)} ${arrow}</button></div></div><div class="hero-wordmark" aria-hidden="true">${esc(c.brand.name.replace(/ retreat/i, ""))}</div><div class="hero-foot"><span>${esc(c.brand.tagline)}</span><a href="#intro" class="continue-arrival">SCROLL TO STEP INSIDE <span aria-hidden="true">↓</span></a><button class="ambience-toggle" id="ambience-toggle" aria-pressed="false"><span aria-hidden="true">◐</span> <span id="ambience-label">After sunset</span></button></div><a class="arrival-next" href="${hasJourney ? "#journey" : "#intro"}">The farm is yours to explore <span aria-hidden="true">↓</span></a></div></section>
  <section id="intro" class="intro section"><div class="intro-topline"><span class="eyebrow">${esc(c.intro.eyebrow)}</span><span lang="kn">${esc(c.brand.kannada)}</span></div><div class="intro-composition"><figure class="intro-photo intro-photo-one">${picture(c.intro.image, c.intro.imageAlt)}<span class="photo-caption">NATURE, UP CLOSE.</span></figure><div class="intro-center"><div class="intro-mark"><img src="/assets/brand/icon.svg" width="88" height="88" alt=""></div><h2 class="reveal-title">${lines(c.intro.title)}</h2><p class="intro-copy">${esc(c.intro.description)}</p><a class="text-link" href="${hasJourney ? "#journey" : "#cottages"}">A walk through Aroha ${arrow}</a></div><figure class="intro-photo intro-photo-two">${picture(secondary.image, secondary.imageAlt)}<span class="photo-caption">A LITTLE ROOM TO BREATHE.</span></figure></div><div class="welcome-band"><p class="welcome">${esc(c.brand.welcome)}</p><p class="kannada" lang="kn">${esc(c.brand.welcomeKannada)}</p>${palmArt("welcome-palm")}</div></section>
  ${c.sections.map((s) => section(c, s)).join("")}</main>
  <footer class="site-footer"><div class="footer-image">${picture(c.journey[c.journey.length - 1]?.image || c.hero.image, c.journey[c.journey.length - 1]?.imageAlt || c.hero.imageAlt)}</div><div class="footer-shade"></div><div class="footer-invitation"><p class="eyebrow">${esc(c.brand.tagline)}</p><p>${lines(c.brand.welcome.replace(", ", ",\n"))}</p><button class="button light" data-enquire="">${esc(c.visit.enquiryLabel)} ${arrow}</button><span lang="kn">${esc(c.brand.welcomeKannada)}</span></div><div class="footer-wordmark" aria-hidden="true">${esc(c.brand.name.replace(/ retreat/i, ""))}</div><div class="footer-bottom"><a href="/admin/">Host login</a><span>© ${new Date().getFullYear()} ${esc(c.brand.name)}</span><button class="text-link" id="privacy-settings">Privacy & monitoring</button></div></footer>
  <dialog id="details-dialog" class="details-dialog" aria-labelledby="dialog-title"><button class="dialog-close" aria-label="Close details">×</button><div id="dialog-content"></div></dialog><div class="toast" role="status" hidden></div>`;
}
