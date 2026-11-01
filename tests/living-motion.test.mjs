import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { orbitPose } from "../website/botanical-motion.mjs";
import { startWelcome } from "../website/welcome.mjs";
import { validateContent, validateNature } from "../functions/domain.mjs";
import { renderSite } from "../website/render.mjs";
const read = async (name) =>
  JSON.parse(await readFile(new URL(name, import.meta.url)));
const nature = await read("../website/nature-content.json");
const content = await read("../website/content.json");
const tour = await read("../website/tour-content.json");

test("photographic orbit is reversible, centered, symmetric and bounded across every route stop", () => {
  for (const radius of [281.6, 640, 1100]) {
    for (let i = 0; i < 11; i++) {
      const centered = orbitPose(i, i, { radius });
      assert.equal(centered.x, 0);
      assert.equal(centered.z, 0);
      assert.equal(centered.visible, true);
      const before = orbitPose(i, i - 0.7, { radius });
      const after = orbitPose(i, i + 0.7, { radius });
      assert.ok(Math.abs(before.x + after.x) < 1e-8);
      assert.ok(Math.abs(before.z - after.z) < 1e-8);
      for (let center = -0.4; center <= 10.6; center += 0.1) {
        const pose = orbitPose(i, center, { radius });
        assert.ok(Number.isFinite(pose.x) && Number.isFinite(pose.z));
        assert.ok(Math.abs(pose.x) <= radius);
        assert.ok(pose.z <= 0 && pose.z >= -2 * radius);
      }
      assert.deepEqual(orbitPose(i, i - 0.7, { radius }), before);
    }
  }
  assert.equal(orbitPose(10, 0).visible, false);
});

test("nature settings are additive, escaped, bounded and restricted to allowed media", () => {
  validateContent({ ...content, tour }); // Old records continue to work.
  const c = {
    ...structuredClone(content),
    tour: { ...structuredClone(tour), nature: structuredClone(nature) },
  };
  validateContent(c);
  c.tour.nature.title = '<img src=x onerror="alert(1)">';
  assert.ok(renderSite(c).includes("&lt;img src=x"));
  assert.ok(!renderSite(c).includes("<img src=x"));
  for (const edit of [
    (n) => (n.leafImage = "javascript:alert(1)"),
    (n) => (n.plantImage = "https://unknown.example/tracker.webp"),
    (n) => (n.enabled = "true"),
    (n) => n.items.push(...structuredClone(n.items)),
    (n) => (n.items[0].value = "x".repeat(81)),
    (n) => (n.script = "alert(1)"),
  ]) {
    const n = structuredClone(nature);
    edit(n);
    assert.throws(() => validateNature(n));
  }
  c.tour.nature.enabled = false;
  assert.ok(!renderSite(c).includes('class="hero-garden"'));
  assert.ok(!renderSite(c).includes('class="nature-story"'));
});

function welcomeFixture(t, reduced = false) {
  const handlers = new Map(),
    classes = new Set();
  const skip = {};
  const welcome = {
    removed: false,
    inert: false,
    querySelector: () => skip,
    classList: { add: (name) => classes.add(name) },
    setAttribute() {},
    addEventListener() {},
    remove() {
      this.removed = true;
    },
  };
  const root = { inert: false, querySelector: () => ({ focus() {} }) };
  const doc = {
    hidden: false,
    activeElement: null,
    getElementById: () => welcome,
    documentElement: { classList: { add: (name) => classes.add(name) } },
    addEventListener: (name, fn) => handlers.set(name, fn),
    removeEventListener: (name) => handlers.delete(name),
  };
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const oldMedia = Object.getOwnPropertyDescriptor(globalThis, "matchMedia");
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: doc,
  });
  Object.defineProperty(globalThis, "matchMedia", {
    configurable: true,
    value: () => ({ matches: reduced }),
  });
  t.after(() => {
    if (oldDocument) Object.defineProperty(globalThis, "document", oldDocument);
    else delete globalThis.document;
    if (oldMedia) Object.defineProperty(globalThis, "matchMedia", oldMedia);
    else delete globalThis.matchMedia;
  });
  return { root, welcome, skip, doc, handlers, classes };
}

test("welcome releases reading and cancels playback on skip, timeout, tab hide and player failure", async (t) => {
  for (const cause of ["skip", "timeout", "hidden", "failure", "complete"]) {
    await t.test(cause, (t) => {
      const f = welcomeFixture(t);
      let disposed = 0,
        update;
      const finish = startWelcome(f.root, nature, {
        scenePlayer: (_root, kind, callback) => {
          assert.equal(kind, "seed");
          update = callback;
          if (cause === "failure") throw Error("WAAPI unavailable");
          return {
            play() {},
            dispose() {
              disposed++;
            },
          };
        },
      });
      if (cause !== "failure") assert.equal(f.root.inert, true);
      if (cause === "skip") f.skip.onclick();
      if (cause === "timeout") t.mock.timers.tick(3200);
      if (cause === "hidden") {
        f.doc.hidden = true;
        f.handlers.get("visibilitychange")();
      }
      if (cause === "complete") update({ state: "complete" });
      assert.equal(f.root.inert, false);
      assert.equal(f.welcome.inert, true);
      assert.ok(f.classes.has("welcome-complete"));
      assert.equal(f.handlers.size, 0);
      finish();
      finish();
      assert.equal(disposed, cause === "failure" ? 0 : 1);
      t.mock.timers.tick(500);
      assert.equal(f.welcome.removed, true);
    });
  }
});
test("Simple View and reduced motion bypass the welcome without locking the page", async (t) => {
  for (const reduced of [false, true])
    await t.test(String(reduced), (t) => {
      const f = welcomeFixture(t, reduced);
      startWelcome(f.root, nature, {
        enabled: reduced,
        scenePlayer: () => {
          throw Error("must not start");
        },
      });
      assert.equal(f.root.inert, false);
      assert.equal(f.welcome.removed, true);
      assert.equal(f.handlers.size, 0);
    });
});
