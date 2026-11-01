import { createCinematic } from "./cinematic.mjs";
import { preference, setPreference } from "./preferences.mjs";
import initial from "./content.json";
import { renderSite, esc, picture } from "./render.mjs";
import { validateContent, enquiryText } from "../functions/domain.mjs";
import { subscribeSite } from "./firebase.mjs";
import { track, initializeMonitoring, reportError } from "./monitoring.mjs";
let content = initial,
  activeStop = 0,
  lastFocus,
  observer,
  unsubscribe,
  paintQueued = false,
  pendingContent,
  cinematic,
  afterSunset = false;
const root = document.getElementById("site"),
  motion = matchMedia("(prefers-reduced-motion: reduce)"),
  preview = new URLSearchParams(location.search).has("preview");
let simple = motion.matches || preference("aroha-view") === "simple";
function theme() {
  for (const k of ["forest", "ivory", "leaf", "bronze"])
    document.documentElement.style.setProperty("--" + k, content.theme[k]);
  document.body.classList.toggle("simple", simple || !content.theme.motion);
  document.body.classList.toggle("after-sunset", afterSunset);
  document.title = content.seo.title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", content.seo.description);
}
function render() {
  const y = scrollY;
  observer?.disconnect();
  cinematic?.destroy();
  root.innerHTML = renderSite(content);
  theme();
  document.getElementById("view-toggle").textContent = simple
    ? "Journey view"
    : "Simple view";
  document
    .getElementById("view-toggle")
    .setAttribute("aria-pressed", String(simple));
  document.getElementById("view-toggle").hidden = !content.theme.motion;
  if (preview) {
    const banner = document.createElement("div");
    banner.className = "preview-banner";
    banner.textContent = "Private draft preview — changes are not published";
    root.prepend(banner);
  }
  bind();
  cinematic = createCinematic(
    root,
    !simple && content.theme.motion && !motion.matches,
  );
  window.scrollTo({ top: y, behavior: "instant" });
  requestAnimationFrame(paint);
}
function setStop(index) {
  if (index === activeStop) return;
  activeStop = index;
  const x = content.journey[index];
  if (!x) return;
  document
    .querySelectorAll(".journey-photo")
    .forEach((el, i) => el.classList.toggle("active", i === index));
  document.querySelectorAll("[data-stop]").forEach((el, i) => {
    if (i === index) el.setAttribute("aria-current", "step");
    else el.removeAttribute("aria-current");
  });
  const chapterTitle = document.getElementById("journey-title");
  if (!chapterTitle) return;
  chapterTitle.innerHTML = esc(x.title).replaceAll("\n", "<br>");
  document.getElementById("journey-description").textContent = x.description;
  document.getElementById("journey-link").href = "#" + x.target;
  const counter = document.getElementById("chapter-counter");
  if (counter)
    counter.textContent =
      String(index + 1).padStart(2, "0") +
      " / " +
      String(content.journey.length).padStart(2, "0");
  const name = document.getElementById("journey-name");
  if (name) name.textContent = x.name;
  const hotspot = document.getElementById("journey-hotspot");
  if (hotspot) hotspot.href = "#" + x.target;
  track("journey.stop", { section: x.id });
}
function paint() {
  paintQueued = false;
  cinematic?.paint();
  if (simple || !content.theme.motion || !content.journey.length) return;
  const el = document.getElementById("journey");
  if (!el) return;
  const r = el.getBoundingClientRect(),
    range = el.offsetHeight - innerHeight;
  if (range <= 0) return;
  const p = Math.max(0, Math.min(0.9999, -r.top / range));
  setStop(
    Math.min(
      content.journey.length - 1,
      Math.floor(p * content.journey.length),
    ),
  );
}
window.addEventListener(
  "scroll",
  () => {
    if (!paintQueued) {
      paintQueued = true;
      requestAnimationFrame(paint);
    }
  },
  { passive: true },
);
window.addEventListener("resize", paint);
function show(markup) {
  lastFocus = document.activeElement;
  document.getElementById("dialog-content").innerHTML = markup;
  document.getElementById("details-dialog").showModal();
  document.querySelector(".dialog-close").focus({ preventScroll: true });
}
function openCottage(id) {
  const x = content.cottages.find((x) => x.id === id);
  if (!x) return;
  track("cottage.opened", { section: x.id });
  show(
    `${picture(x.image, x.imageAlt, "dialog-photo")}<div class="dialog-copy"><p class="eyebrow">YOUR QUIET CORNER</p><h2 id="dialog-title">${esc(x.name)}</h2><p>${esc(x.description)}</p><p>${esc(x.detail)}</p>${x.images.length ? `<div class="interior-gallery">${x.images.map((src) => picture(src, x.name + " interior")).join("")}</div>` : ""}<button class="button" id="cottage-enquire">Enquire about a stay <span aria-hidden="true">↗</span></button></div>`,
  );
  document.getElementById("cottage-enquire").onclick = () => enquire("", id);
}
function enquire(packageId = "", cottageId = "") {
  show(
    `<div class="dialog-copy"><p class="eyebrow">LET’S PLAN YOUR VISIT</p><h2 id="dialog-title">A conversation comes first.</h2><p>Tell your hosts a little about your visit. They will personally confirm availability and the details.</p><form class="enquiry-form"><label>How would you like to visit?<select name="package" required><option value="">Choose a package</option>${content.packages.map((p) => `<option value="${esc(p.id)}" ${p.id === packageId ? "selected" : ""}>${esc(p.name)}</option>`).join("")}</select></label><label>Guests<input name="guests" type="number" min="1" max="100" value="2" required></label><label>Visit / check-in date<input name="checkin" type="date" min="${new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })}" required></label><label data-overnight>Check-out date<input name="checkout" type="date"></label><label data-overnight class="full">Preferred cottage<select name="cottage"><option value="">Please advise</option>${content.cottages.map((x) => `<option value="${esc(x.id)}" ${x.id === cottageId ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></label><label>Your name<input name="name" autocomplete="name" maxlength="100" required></label><label>Phone / WhatsApp<input name="phone" type="tel" autocomplete="tel" maxlength="30" required></label><label class="full">Anything you would like us to know? <small>(optional)</small><textarea name="message" rows="3" maxlength="1000"></textarea></label><p class="full form-note">Your details will be included in a WhatsApp message. You review and send it there. This does not reserve a room, confirm a booking or make a payment.</p><p class="full form-error" role="alert" hidden></p><button class="button full" type="submit">Continue to WhatsApp <span aria-hidden="true">↗</span></button></form></div>`,
  );
  const form = document.querySelector(".enquiry-form"),
    select = form.elements.package;
  function change() {
    const overnight =
      content.packages.find((p) => p.id === select.value)?.overnight ?? false;
    form
      .querySelectorAll("[data-overnight]")
      .forEach((el) => (el.hidden = !overnight));
    form.elements.checkout.required = overnight;
  }
  select.onchange = change;
  change();
  form.elements.checkin.onchange = () => {
    form.elements.checkout.min = form.elements.checkin.value;
  };
  form.onsubmit = (e) => {
    e.preventDefault();
    try {
      const data = Object.fromEntries(new FormData(form));
      const text = enquiryText(content, data);
      const url =
        "https://wa.me/" +
        content.visit.phone +
        "?text=" +
        encodeURIComponent(text);
      track("enquiry.prepared", { section: data.package, outcome: "prepared" });
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
    } catch (error) {
      const box = form.querySelector(".form-error");
      box.hidden = false;
      box.textContent =
        {
          CHOOSE_PACKAGE: "Choose a package.",
          CHOOSE_DATE: "Choose a visit date.",
          INVALID_CHECKOUT: "Choose a check-out date after check-in.",
          CONTACT_DETAILS_REQUIRED: "Enter your name and a valid phone number.",
        }[error.message] || "Please check your visit details.";
    }
  };
}
function bind() {
  const ambience = document.getElementById("ambience-toggle");
  ambience.setAttribute("aria-pressed", String(afterSunset));
  document.getElementById("ambience-label").textContent = afterSunset
    ? "Morning light"
    : "After sunset";
  ambience.onclick = () => {
    afterSunset = !afterSunset;
    document.body.classList.toggle("after-sunset", afterSunset);
    ambience.setAttribute("aria-pressed", String(afterSunset));
    document.getElementById("ambience-label").textContent = afterSunset
      ? "Morning light"
      : "After sunset";
  };
  activeStop = -1;
  setStop(0);
  document.getElementById("view-toggle").onclick = () => {
    simple = !simple;
    setPreference("aroha-view", simple ? "simple" : "journey");
    const anchor = document.getElementById("journey"),
      wasJourney = anchor?.getBoundingClientRect().top < 0;
    render();
    document.getElementById("view-toggle").focus({ preventScroll: true });
    if (wasJourney)
      document
        .getElementById("journey")
        ?.scrollIntoView({ behavior: "instant" });
  };
  root
    .querySelectorAll("[data-cottage]")
    .forEach((b) => (b.onclick = () => openCottage(b.dataset.cottage)));
  root
    .querySelectorAll("[data-enquire]")
    .forEach((b) => (b.onclick = () => enquire(b.dataset.enquire)));
  root.querySelectorAll("[data-stop]").forEach(
    (b) =>
      (b.onclick = () => {
        const el = document.getElementById("journey"),
          i = Number(b.dataset.stop),
          top =
            scrollY +
            el.getBoundingClientRect().top +
            ((el.offsetHeight - innerHeight) * (i + 0.1)) /
              Math.max(1, content.journey.length);
        window.scrollTo({
          top,
          behavior: motion.matches ? "instant" : "smooth",
        });
      }),
  );
  root.querySelectorAll("[data-gallery]").forEach(
    (b) =>
      (b.onclick = () => {
        const x = content.gallery[Number(b.dataset.gallery)];
        show(
          `${picture(x.image, x.imageAlt, "dialog-photo")}<div class="dialog-copy"><h2 id="dialog-title" style="font-size:22px">${esc(x.imageAlt)}</h2></div>`,
        );
      }),
  );
  root.querySelectorAll("[data-chapter]").forEach(
    (b) =>
      (b.onclick = () => {
        const index = Math.max(
          0,
          Math.min(
            content.journey.length - 1,
            activeStop + Number(b.dataset.chapter),
          ),
        );
        root.querySelector(`[data-stop="${index}"]`)?.click();
      }),
  );
  root.querySelectorAll("[data-cottage-scroll]").forEach(
    (b) =>
      (b.onclick = () => {
        const collection = root.querySelector(".cottage-grid");
        collection.scrollBy({
          left: collection.clientWidth * 0.75 * Number(b.dataset.cottageScroll),
          behavior: motion.matches ? "instant" : "smooth",
        });
      }),
  );
  document.getElementById("start-journey").onclick = (e) => {
    track("journey.started");
    if (!simple && content.theme.motion && !motion.matches) {
      e.preventDefault();
      const arrival = root.querySelector(".arrival");
      window.scrollTo({
        top:
          scrollY +
          arrival.getBoundingClientRect().top +
          (arrival.offsetHeight - innerHeight) * 0.94,
        behavior: "smooth",
      });
    }
  };
  const dialog = document.getElementById("details-dialog");
  document.querySelector(".dialog-close").onclick = () => dialog.close();
  dialog.onclose = () => {
    if (pendingContent) {
      const id = lastFocus?.id,
        cottage = lastFocus?.getAttribute("data-cottage"),
        enquiry = lastFocus?.getAttribute("data-enquire");
      content = pendingContent;
      pendingContent = null;
      render();
      const selector = id
        ? "#" + CSS.escape(id)
        : cottage !== null && cottage !== undefined
          ? '[data-cottage="' + CSS.escape(cottage) + '"]'
          : enquiry !== null && enquiry !== undefined
            ? '[data-enquire="' + CSS.escape(enquiry) + '"]'
            : null;
      if (selector)
        document.querySelector(selector)?.focus({ preventScroll: true });
    } else if (lastFocus?.isConnected) lastFocus.focus({ preventScroll: true });
  };
  dialog.onclick = (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        dialog.close();
    }
  };
  document.getElementById("privacy-settings").onclick = () => {
    show(
      '<div class="dialog-copy"><h2 id="dialog-title">Privacy & monitoring</h2><p>Optional Dynatrace monitoring helps us understand page performance and errors. Enquiry messages, names and phone numbers are excluded. Google Analytics and session replay are not enabled.</p><p>You can use the site without optional monitoring. Essential Google sign-in is used only in the host portal.</p><button class="button" id="allow-monitoring">Allow monitoring</button> <button class="text-link" id="deny-monitoring">Decline / withdraw</button></div>',
    );
    document.getElementById("allow-monitoring").onclick = () => {
      setPreference("aroha-monitoring", "allowed");
      initializeMonitoring();
      dialog.close();
    };
    document.getElementById("deny-monitoring").onclick = () => {
      setPreference("aroha-monitoring", "denied");
      location.reload();
    };
  };
}
render();
initializeMonitoring();
motion.addEventListener("change", (e) => {
  if (e.matches) {
    simple = true;
    render();
  }
});
if (preview) {
  window.addEventListener("message", (e) => {
    if (
      e.origin !== location.origin ||
      e.source !== parent ||
      e.data?.type !== "aroha-preview"
    )
      return;
    try {
      content = validateContent(e.data.content);
      render();
    } catch {
      reportError("INVALID_PREVIEW");
    }
  });
} else {
  watchContent();
}
function watchContent() {
  unsubscribe?.();
  unsubscribe = subscribeSite(
    (data) => {
      try {
        const next = validateContent(data.content);
        if (document.getElementById("details-dialog")?.open) {
          pendingContent = next;
          return;
        }
        content = next;
        render();
      } catch {
        reportError("INVALID_PUBLISHED_CONTENT");
      }
    },
    () => reportError("CONTENT_READ_FAILED"),
  );
}
window.addEventListener("pageshow", (e) => {
  if (e.persisted && !preview) watchContent();
});
window.addEventListener("pagehide", () => {
  observer?.disconnect();
  cinematic?.destroy();
  unsubscribe?.();
});
