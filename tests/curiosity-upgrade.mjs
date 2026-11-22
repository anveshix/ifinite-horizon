// Curiosity Lab · integration & upgrade verification (missions, snapshots, LINKS, WebAudio fx, store).
// Run: node tests/curiosity-upgrade.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

let n = 0, bad = 0;
const ok = (c, m) => { n++; if (!c) { bad++; console.log(" ✗", m); } };

// Minimal browser globals for headless Node testing of store & fx
const storage = new Map();
globalThis.window = {
  matchMedia: () => ({ matches: false }),
  dispatchEvent: () => {},
  addEventListener: () => {},
  CustomEvent: class CustomEvent { constructor(t, o) { this.type = t; this.detail = o?.detail; } },
  Event: class Event { constructor(t) { this.type = t; } }
};
globalThis.localStorage = {
  getItem: k => (storage.has(k) ? storage.get(k) : null),
  setItem: (k, v) => storage.set(k, String(v))
};

const core = await import("../assets/curiosity/core.js");
const fx = await import("../assets/curiosity/quiz/fx.js");
const CANNON = await import("../assets/vendor/cannon-es.js");

const ALL_LAB_IDS = [
  "lens", "eye", "ohm", "magnet", "force", "energy", "sound", "gravity",
  "ph", "atom", "matter", "reactions", "molecules",
  "cell", "tissues", "heart", "organs", "nervous", "repro", "genetics",
  "climate", "ecology"
];
const labModules = await Promise.all(
  ALL_LAB_IDS.map(id => import(`../assets/curiosity/labs/${id}.js`).then(m => m.default))
);

core._resetLabs();
labModules.forEach(l => core.registerLab(l));
const registered = core.labs();
ok(registered.length === 22, `expected 22 registered labs, got ${registered.length}`);

// Verify vendored cannon-es 3D physics world runs in Node
const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
const body = new CANNON.Body({ mass: 1, shape: new CANNON.Sphere(0.5) });
body.position.set(0, 5, 0);
world.addBody(body);
world.step(1 / 60);
ok(body.position.y < 5, "cannon-es rigid body falls under gravity");

// Verify SYLLABUS covers all 25 Class IX & X chapters
ok(Object.keys(core.SYLLABUS).length === 25, `expected 25 SYLLABUS chapters, got ${Object.keys(core.SYLLABUS).length}`);

// Mock 2D canvas context to verify every lab's snapshot() renders cleanly across focus modes
function mockCanvas() {
  const calls = [];
  const ctx = new Proxy({
    fillStyle: "", strokeStyle: "", lineWidth: 1, font: "", textAlign: "", textBaseline: "", globalAlpha: 1
  }, {
    get(target, prop) {
      if (prop in target) return target[prop];
      return (...args) => calls.push([prop, args.length]);
    }
  });
  return { width: 0, height: 0, getContext: () => ctx, _calls: calls };
}

for (const lab of registered) {
  const def = core.defaults(lab);
  const f = lab.facts(def);
  ok(Array.isArray(f) && f.length >= 4, `${lab.id}: facts should return >= 4 rows`);
  ok(Array.isArray(lab.missions) && lab.missions.length === 3, `${lab.id}: expected 3 missions`);
  const cv = mockCanvas();
  lab.snapshot(cv, def);
  ok(cv._calls.length > 10, `${lab.id}: snapshot drew only ${cv._calls.length} ops`);
  // Check mission idempotency in store
  core.store.reset();
  const m0 = lab.missions[0];
  const r1 = core.store.recordMission(lab.id, m0.id, 15);
  const r2 = core.store.recordMission(lab.id, m0.id, 15);
  ok(r1.awarded === true && r1.xp === 15, `${lab.id}: first mission award failed`);
  ok(r2.awarded === false && r2.xp === 15, `${lab.id}: duplicate mission should not award XP again`);
  ok(core.store.get().answered === 0 && core.store.get().correct === 0, `${lab.id}: mission must not alter quiz answered/correct`);
}

// Verify fx.sound defaults & headless safety
ok(fx.sound.on === false, "fx.sound.on must default to false");
ok(typeof fx.sound.playTone === "function" && typeof fx.sound.playClapEcho === "function" && typeof fx.sound.playHeartbeat === "function", "fx.sound acoustic helpers missing");
fx.sound.play("mission");
fx.sound.play("whoosh");
fx.sound.play("thud");
fx.sound.play("zap");
fx.sound.play("fizz");
fx.sound.play("pop");
fx.sound.playHeartbeat(72);
ok(fx.sound.toggle() === true && fx.sound.on === true, "sound.toggle() -> true");
ok(fx.sound.toggle() === false && fx.sound.on === false, "sound.toggle() -> false");

// Verify every LINKS entry in assets/va-curiosity.js maps to an existing index.html key & registered lab
const html = fs.readFileSync(path.resolve("index.html"), "utf8");
const htmlKeys = new Set([...html.matchAll(/["']((?:ix\d+|ch\d+)\/[a-z0-9_]+)["']/gi)].map(m => m[1]));
const coreTopicKeys = new Set([...htmlKeys]);
["ix25_1/states", "ix25_1/diffusion", "ix25_1/evaporation"].forEach(k => htmlKeys.add(k));
const vaCode = fs.readFileSync(path.resolve("assets/va-curiosity.js"), "utf8");
const sandbox = {
  document: {
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ style: {}, setAttribute: () => {}, querySelector: () => ({}), addEventListener: () => {} }),
    head: { appendChild: () => {} },
    body: { classList: { contains: () => false } },
    currentScript: null
  },
  window: { __atlas: null },
  localStorage: globalThis.localStorage,
  location: { href: "http://localhost/index.html" },
  addEventListener: () => {},
  MutationObserver: class { observe() {} },
  setInterval: () => 0,
  URL
};
sandbox.window = sandbox;
vm.runInNewContext(vaCode, sandbox);
const links = sandbox.__curiosity.links;
const linkKeys = Object.keys(links);
ok(linkKeys.length >= 122, `expected >= 122 LINKS, got ${linkKeys.length}`);
for (const ck of coreTopicKeys) {
  ok(Boolean(links[ck]), `core index.html topic "${ck}" missing from LINKS`);
}
for (const k of linkKeys) {
  ok(htmlKeys.has(k), `LINKS key "${k}" not found in index.html`);
  const [labId, title] = links[k];
  const lab = core.getLab(labId);
  ok(!!lab, `LINKS["${k}"] points to unknown lab "${labId}"`);
  ok(lab && lab.title.en.includes(title.split(" ")[0]), `LINKS["${k}"] label "${title}" must match lab.title.en "${lab?.title.en}"`);
}

// Verify reportString & parseReport round-trip with mission XP
core.store.reset();
core.store.recordMission("sound", "sound-echo", 15);
core.store.recordAnswer("sound", true, 5);
const rs = sandbox.__curiosity.reportString();
const parsed = sandbox.__curiosity.parseReport(rs);
ok(parsed && parsed.xp === 30 && parsed.ans === 1 && parsed.cor === 1 && parsed.labs.sound[0] === 1, `reportString round-trip failed: ${rs}`);

console.log(`curiosity upgrade · ${registered.length} labs · ${linkKeys.length} topic links · checks ${n} · failures ${bad}`);
process.exit(bad ? 1 : 0);
