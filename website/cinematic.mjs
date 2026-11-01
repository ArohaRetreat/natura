const clamp = (n) => Math.min(1, Math.max(0, Number.isFinite(n) ? n : 0));
const ramp = (value, start, end) => clamp((value - start) / (end - start));
export function arrivalFrame(progress) {
  const p = clamp(progress),
    opening = ramp(p, 0.02, 0.82);
  const eased = 1 - Math.pow(1 - opening, 2);
  return {
    angle: eased * 102,
    travel: eased * 12,
    leafOpacity: 1 - eased * 0.7,
    scale: 1.14 - p * 0.12,
    titleOpacity: 1 - ramp(p, 0.25, 0.76),
    titleY: -p * 70,
    nextOpacity: ramp(p, 0.63, 0.92),
    wordOpacity: 1 - p * 0.8,
  };
}
export function createCinematic(root, enabled) {
  const arrival = root.querySelector(".arrival");
  const left = root.querySelector(".arrival-left"),
    right = root.querySelector(".arrival-right");
  const heroPhoto = root.querySelector(".hero-photo"),
    title = root.querySelector(".hero-content");
  const nightPhoto = root.querySelector(".hero-night-photo");
  const routePath = root.querySelector(".journey-route-art path"),
    routeDot = root.querySelector("#route-dot");
  const routeLength = routePath?.getTotalLength() || 0;
  const wordmark = root.querySelector(".hero-wordmark"),
    next = root.querySelector(".arrival-next");
  const skyline = root.querySelector(".arrival-skyline"),
    header = root.querySelector(".site-header");
  const intro = root.querySelector(".intro"),
    introPhotos = [...root.querySelectorAll(".intro-photo")];
  const journey = root.querySelector("#journey"),
    photos = [...root.querySelectorAll(".journey-photo")];
  const caption = root.querySelector(".journey-caption"),
    progressLine = root.querySelector(".journey-progress");
  const gallery = root.querySelector(".gallery-grid"),
    memories = [...root.querySelectorAll(".memory")];
  const footer = root.querySelector(".site-footer");
  let observer;
  if (enabled && "IntersectionObserver" in window) {
    root.classList.add("reveal-ready");
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" },
    );
    root
      .querySelectorAll(".section-heading,.intro-center,.package,.visit-grid")
      .forEach((el) => {
        el.setAttribute("data-reveal", "");
        observer.observe(el);
      });
  }
  function paint() {
    const vh = innerHeight;
    // Read geometry together before writing composite-only visual properties.
    const a = arrival.getBoundingClientRect(),
      j = journey?.getBoundingClientRect();
    const introRect = intro.getBoundingClientRect(),
      g = gallery?.getBoundingClientRect();
    const foot = footer.getBoundingClientRect();
    const arrivalRange = Math.max(1, arrival.offsetHeight - vh);
    const journeyRange = journey ? Math.max(1, journey.offsetHeight - vh) : 1;
    const inJourney = j && j.top < 110 && j.bottom > 110;
    header.classList.toggle(
      "is-inland",
      a.bottom < 110 && !inJourney && foot.top > 110,
    );
    if (!enabled) return;
    if (a.top < vh && a.bottom > 0) {
      const frame = arrivalFrame(
        -a.top / arrivalRange,
      );
      left.style.transform = `rotateY(${-frame.angle}deg) translateX(${-frame.travel}%)`;
      right.style.transform = `rotateY(${frame.angle}deg) translateX(${frame.travel}%)`;
      left.style.opacity = right.style.opacity = frame.leafOpacity;
      heroPhoto.style.transform = `scale(${frame.scale})`;
      if (nightPhoto) nightPhoto.style.transform = `scale(${frame.scale})`;
      title.style.transform = `translateY(${frame.titleY}px)`;
      title.style.opacity = skyline.style.opacity = frame.titleOpacity;
      // Hidden controls must not remain in the keyboard focus order.
      title.inert = frame.titleOpacity < 0.05;
      wordmark.style.opacity = frame.wordOpacity;
      next.style.opacity = frame.nextOpacity;
      next.style.transform = `translate(-50%,${(1 - frame.nextOpacity) * 25}px)`;
      next.classList.toggle("is-visible", frame.nextOpacity > 0.6);
      next.tabIndex = frame.nextOpacity > 0.6 ? 0 : -1;
    }
    if (introRect.top < vh && introRect.bottom > 0) {
      const t = Math.max(-1, Math.min(1, (introRect.top - vh * 0.1) / vh));
      introPhotos.forEach((el, i) => {
        el.style.transform = `translateY(${t * (i ? -42 : 42)}px) rotate(${i ? 5 : -5}deg)`;
      });
    }
    if (j && j.top < vh && j.bottom > 0 && photos.length) {
      const p = clamp(-j.top / journeyRange);
      const q = p * (photos.length - 0.0001),
        current = Math.floor(q),
        fraction = q - current;
      const blend = ramp(fraction, 0.8, 1);
      photos.forEach((el, i) => {
        el.style.opacity = i === current ? 1 : i === current + 1 ? blend : 0;
        el.style.zIndex = i === current + 1 ? 1 : 0;
        if (i === current || i === current + 1)
          el.style.transform = `scale(${i === current ? 1.025 + fraction * 0.12 : 1.025}) translateX(${i === current ? (i % 2 ? 1 : -1) * fraction * 1.2 : 0}%)`;
      });
      const alpha =
        fraction > 0.8 && current < photos.length - 1
          ? 1 - blend
          : current > 0 && fraction < 0.1
            ? 0.55 + fraction * 4.5
            : 1;
      caption.style.opacity = alpha;
      caption.style.transform = `translateY(${(1 - alpha) * 12}px)`;
      progressLine.style.transform = `scaleX(${p})`;
      if (routePath && routeDot) {
        const point = routePath.getPointAtLength(routeLength * p);
        routeDot.style.transform = `translate(${point.x}px,${point.y}px)`;
      }
    }
    if (g && g.top < vh && g.bottom > 0) {
      const t = Math.max(-1, Math.min(1, (g.top - vh * 0.25) / vh));
      memories.forEach(
        (el, i) =>
          (el.style.transform = `translateY(${t * (i % 2 ? 55 : -40)}px) rotate(${[-6, 7, -3][i % 3]}deg)`),
      );
    }
  }
  return {
    paint,
    destroy() {
      observer?.disconnect();
      root.classList.remove("reveal-ready");
    },
  };
}
