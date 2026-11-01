import { build } from "esbuild";
import { mkdir, cp, readFile, writeFile, copyFile } from "node:fs/promises";
import { renderSite, esc } from "../website/render.mjs";
import { validateContent } from "../functions/domain.mjs";
const root = new URL("../", import.meta.url),
  dist = new URL("dist/", root),
  assets = new URL("assets/", dist);
await mkdir(assets, { recursive: true });
await mkdir(new URL("admin/", dist), { recursive: true });
const content = validateContent(
  JSON.parse(await readFile(new URL("website/content.json", root), "utf8")),
);
await cp(new URL("website/assets/", root), assets, { recursive: true });
await mkdir(new URL("brand/", assets), { recursive: true });
await mkdir(new URL("fonts/", assets), { recursive: true });
for (const [source, target] of [
  [
    "public/assets/logos/english/aroha-horizontal-white.svg",
    "brand/logo-white.svg",
  ],
  [
    "public/assets/logos/english/aroha-horizontal-forest.svg",
    "brand/logo-forest.svg",
  ],
  ["public/assets/icons/full-aroha-icon-forest.svg", "brand/icon.svg"],
  ["public/assets/fonts/Lora/Lora-Variable.woff2", "fonts/Lora.woff2"],
  [
    "public/assets/fonts/SourceSans3/SourceSans3-Variable.woff2",
    "fonts/Source.woff2",
  ],
  [
    "public/assets/fonts/NotoSansKannada/NotoSansKannada-Variable.woff2",
    "fonts/Kannada.woff2",
  ],
])
  await copyFile(new URL(source, root), new URL(target, assets));
for (const file of ["site.css", "admin.css"])
  await copyFile(new URL("website/" + file, root), new URL(file, assets));
await copyFile(
  new URL("website/admin.html", root),
  new URL("admin/index.html", dist),
);
await build({
  entryPoints: {
    site: new URL("website/site.mjs", root).pathname,
    admin: new URL("website/admin.mjs", root).pathname,
  },
  bundle: true,
  format: "esm",
  outdir: assets.pathname,
  minify: true,
  target: ["es2022"],
  legalComments: "eof",
  define: {
    __AROHA_EMULATORS__: process.env.AROHA_EMULATORS === "1" ? "true" : "false",
  },
});
await writeFile(
  new URL("index.html", dist),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="${content.theme.forest}"><meta name="description" content="${esc(content.seo.description)}"><meta property="og:title" content="${esc(content.seo.title)}"><meta property="og:description" content="${esc(content.seo.description)}"><meta property="og:image" content="https://aroha-retreat.web.app${esc(content.hero.image)}"><title>${esc(content.seo.title)}</title><link rel="icon" href="/assets/brand/icon.svg" type="image/svg+xml"><link rel="preload" href="/assets/fonts/Lora.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/assets/site.css"></head><body><div id="site">${renderSite(content)}</div><noscript><p style="padding:20px">Interactive details require JavaScript. Call <a href="tel:+${content.visit.phone}">+${content.visit.phone}</a> to plan your visit.</p></noscript><script type="module" src="/assets/site.js"></script></body></html>`,
);
// Optional public RUM tag is configured independently; no ingestion credential belongs here.
let runtime = JSON.parse(
  await readFile(new URL("config/website-runtime.public.json", root), "utf8"),
);
try {
  runtime = JSON.parse(
    await readFile(new URL("config/website-runtime.json", root), "utf8"),
  );
} catch {}
await writeFile(new URL("runtime-config.json", dist), JSON.stringify(runtime));
await writeFile(
  new URL("website-release.json", dist),
  JSON.stringify({
    name: "Aroha Retreat",
    version: "0.2.0",
    contentSchema: 1,
    admin: "/admin/",
    design: "/design/",
  }),
);
await writeFile(
  new URL("robots.txt", dist),
  "User-agent: *\nAllow: /\nDisallow: /admin/\n",
);
console.log(
  "Built Aroha website and host studio. Existing /design/ output preserved.",
);
