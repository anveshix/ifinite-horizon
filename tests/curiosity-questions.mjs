// Question generators vs independent re-derivations. Run: node tests/curiosity-questions.mjs
// For hundreds of random experiment states per lab: every question must validate, contain exactly one marked answer, and that answer must equal
// what the physics gives when worked out again here WITHOUT the lab's own model code (plain formulas / geometry).
import { validateQuestion } from "../assets/curiosity/core.js";
import lens from "../assets/curiosity/labs/lens.js";
import ohm from "../assets/curiosity/labs/ohm.js";
import force from "../assets/curiosity/labs/force.js";
import energy from "../assets/curiosity/labs/energy.js";
import { rng } from "../assets/curiosity/labs/kit.js";

let n = 0, bad = 0; const seenIds = {};
const fail = (m) => { bad++; if (bad < 40) console.log(" ✗", m); };
const ok = (c, m) => { n++; if (!c) fail(m); };
const pickv = (r, v) => { const k = Math.floor((v.max - v.min) / v.step); return +(v.min + v.step * Math.floor(r() * (k + 1))).toFixed(3); };
const correct = q => q.options.find(o => o.id === q.answer).en;
const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));

/* independent lens physics: image tip = intersection of the "parallel" and "centre" rays after the lens (pure geometry, no lens formula) */
function tip({ u, f, type, h = 8 }) {
  const fs = type * f;                                    // ray 1: leaves the lens at height h with slope −h/fs;  ray 2: straight through O with slope −h/u
  const s1 = -h / fs, s2 = -h / u;
  if (Math.abs(s1 - s2) < 1e-12) return null;             // parallel → image at infinity
  const xi = h / (s2 - s1), yi = s2 * xi; return { x: xi, y: yi };
}
const natureText = c => { const t = tip(c), h = 8; if (!t) return "infinity"; return `${t.x > 0 ? "Real" : "Virtual"}, ${t.y < 0 ? "inverted" : "erect"}, ${Math.abs(t.y) > h + 1e-6 ? "magnified" : Math.abs(t.y) < h - 1e-6 ? "diminished" : "same size"}`; };
const Ireq = (V, R1, R2, mode) => V / (mode === 0 ? R1 : mode === 1 ? R1 + R2 : (R1 * R2) / (R1 + R2));
const RATIO_TXT = { 0.25: ["one-fourth", "fourth"], 0.5: ["half"], 1: ["same"], 2: ["double"], 4: ["four times"] };
const hasRatio = (txt, r) => (RATIO_TXT[r] || []).some(w => txt.toLowerCase().includes(w));

const run = (lab, N, seedBase, check) => {
  for (let i = 0; i < N; i++) {
    const r = rng(seedBase + i * 7919), vars = {}, explored = {};
    lab.vars.forEach(v => { vars[v.id] = pickv(r, v); explored[v.id] = [pickv(r, v), pickv(r, v), vars[v.id]]; });
    const qs = lab.questions({ vars, explored, rnd: rng(seedBase * 31 + i), seed: i });
    ok(qs.length >= 4, `${lab.id}: only ${qs.length} questions for ${JSON.stringify(vars)}`);
    qs.forEach(q => {
      seenIds[q.id] = (seenIds[q.id] || 0) + 1;
      try { validateQuestion(q); } catch (e) { fail(`${lab.id}/${q.id} invalid: ${e.message} (${JSON.stringify(vars)})`); return; }
      ok(q.options.filter(o => o.id === q.answer).length === 1, `${q.id}: not exactly one answer`);
      ok(new Set(q.options.map(o => o.hi)).size >= 1 && q.options.every(o => o.hi.length > 0), `${q.id}: empty Hindi`);
      ok(q.image && Object.values(q.image.vars).every(x => Number.isFinite(x) || typeof x === "string"), `${q.id}: image vars not finite`);
      check(q, vars);
    });
  }
};

/* ---------------- lens ---------------- */
run(lens, 400, 11, (q) => {
  const iv = q.image.vars, c = correct(q), L = { u: iv.u, f: iv.f, type: iv.type };
  if (q.id === "lens-nature") { const e = natureText(L); ok(e === "infinity" ? /infinity/.test(c) && /^Real, inverted, highly magnified/.test(c) : c === e, `lens-nature: ${JSON.stringify(L)} expected "${e}" got "${c}"`); }
  if (q.id === "lens-position") {
    const t = tip(L); let k;
    if (!t) k = "At infinity"; else if (t.x < 0) k = L.type === -1 ? "Between F and O" : "Same side as the object, farther"; else if (Math.abs(t.x - 2 * L.f) < 1e-6) k = "At 2F"; else if (t.x > 2 * L.f) k = "Beyond 2F"; else k = "Between F and 2F";
    ok(c.startsWith(k), `lens-position: ${JSON.stringify(L)} expected "${k}" got "${c}"`);
  }
  if (q.id === "lens-name") ok(L.type === 1 ? /^Convex/.test(c) : /^Concave/.test(c), `lens-name type ${L.type} got ${c}`);
  if (q.id === "lens-use") { const t = tip(L); ok(L.type === -1 ? /^Spectacles/.test(c) : (L.u < L.f && /^Magnifying/.test(c)), `lens-use ${JSON.stringify(L)} got ${c}`); void t; }
  if (q.id === "lens-power") { const P = L.type * (100 / L.f), s = `${P > 0 ? "+" : "−"}${Math.abs(P).toFixed(1)} D`; ok(c === s, `lens-power expected ${s} got ${c}`); }
  if (q.id === "lens-closer") {
    const A = tip(q.meta.a), B = tip(q.meta.b); ok(A && B && q.meta.b.u < q.meta.a.u, "lens-closer states");
    const bigger = Math.abs(B.y) > Math.abs(A.y), farther = Math.abs(B.x) > Math.abs(A.x);
    ok(bigger === q.meta.bigger && farther === q.meta.farther, `lens-closer meta ${JSON.stringify(q.meta)} vs geometry bigger=${bigger} farther=${farther}`);
    ok(c.includes(bigger ? "larger" : "smaller") && c.includes(farther ? "farther from" : "closer to"), `lens-closer answer text "${c}"`);
  }
});

/* ---------------- ohm ---------------- */
run(ohm, 400, 23, (q) => {
  const iv = q.image.vars, c = correct(q), f2 = x => +x.toFixed(2);
  if (q.id === "ohm-predict") { const ratio = Ireq(q.meta.b.V, q.meta.b.R1, q.meta.b.R2, q.meta.b.mode) / Ireq(q.meta.a.V, q.meta.a.R1, q.meta.a.R2, q.meta.a.mode); ok(near(ratio, q.meta.ratio, 1e-9), `ohm-predict ratio ${ratio} vs ${q.meta.ratio}`); ok(hasRatio(c, q.meta.ratio), `ohm-predict text "${c}" for ratio ${q.meta.ratio}`); }
  if (q.id === "ohm-req") { const R = iv.mode === 1 ? iv.R1 + iv.R2 : (iv.R1 * iv.R2) / (iv.R1 + iv.R2); ok(c === `${f2(R)} Ω`, `ohm-req ${JSON.stringify(iv)} expected ${f2(R)} Ω got ${c}`); ok(iv.mode === 1 || iv.mode === 2, "ohm-req mode"); }
  if (q.id === "ohm-name") { const M = { ammeter: "Ammeter", voltmeter: "Voltmeter", resistor: "Resistor", battery: "Battery of cells" }; ok(c === M[q.image.focus], `ohm-name focus ${q.image.focus} got ${c}`); }
  if (q.id === "ohm-arrangement") ok(iv.mode === 1 ? /series/.test(c) : iv.mode === 2 ? /parallel/.test(c) : false, `ohm-arrangement mode ${iv.mode} got ${c}`);
  if (q.id === "ohm-law") ok(c === "Ohm's law", "ohm-law");
  if (q.id === "ohm-heat") ok(/Heating effect/.test(c), "ohm-heat");
});

/* ---------------- force ---------------- */
run(force, 400, 37, (q) => {
  const iv = q.image.vars, c = correct(q), f2 = x => +x.toFixed(2);
  if (q.id === "force-a") ok(c === `${f2(iv.F / iv.m)} m/s²`, `force-a ${JSON.stringify(iv)} got ${c}`);
  if (q.id === "force-predict") { const ratio = (q.meta.b.F / q.meta.b.m) / (q.meta.a.F / q.meta.a.m); ok(near(ratio, q.meta.ratio), `force-predict ratio ${ratio} vs ${q.meta.ratio}`); ok(hasRatio(c, q.meta.ratio), `force-predict text "${c}"`); }
  if (q.id === "force-momentum") ok(c === `${f2(iv.F * 3)} kg·m/s`, `force-momentum (p = F t) ${JSON.stringify(iv)} expected ${f2(iv.F * 3)} got ${c}`);   // impulse–momentum: p = F·t, derived without a or v
  if (q.id === "force-law") ok(/second law/.test(c), "force-law");
  if (q.id === "force-vt") ok(/Uniform \(constant\) acceleration/.test(c), "force-vt");
  if (q.id === "force-inertia") ok(c === "Inertia", "force-inertia");
});

/* ---------------- energy ---------------- */
run(energy, 400, 51, (q) => {
  const iv = q.image.vars, c = correct(q);
  if (q.id === "energy-top") ok(iv.at === "top" && /^Only potential/.test(c), "energy-top");
  if (q.id === "energy-bottom") ok(iv.at === "bottom" && /^Only kinetic/.test(c), "energy-bottom");
  if (q.id === "energy-pe") ok(c === `${+(iv.m * 9.8 * iv.h).toFixed(2)} J`, `energy-pe ${JSON.stringify(iv)} got ${c}`);
  if (q.id === "energy-mass") { const va = Math.sqrt(2 * 9.8 * q.meta.a.h), vb = Math.sqrt(2 * 9.8 * q.meta.b.h); ok(near(vb / va, 1), "energy-mass ratio"); ok(/stays the same/.test(c), `energy-mass text ${c}`); }
  if (q.id === "energy-height") {
    const ratio = Math.sqrt(q.meta.b.h / q.meta.a.h); ok(near(ratio, q.meta.ratio, 1e-6), `energy-height ratio ${ratio} vs ${q.meta.ratio}`);
    const T = [[0.5, "half"], [Math.SQRT1_2, "1/√2"], [1, "same"], [Math.SQRT2, "√2 times"], [2, "double"]].find(x => near(x[0], ratio, 1e-6)); ok(T && c.includes(T[1]), `energy-height text "${c}" for ratio ${ratio}`);
    ok(q.meta.b.h >= 0.05 - 1e-9 && q.meta.b.h <= 1 + 1e-9, `energy-height new h ${q.meta.b.h} outside the lab's range`);
  }
  if (q.id === "energy-law") ok(/conservation of energy/.test(c), "energy-law");
});

const ids = Object.keys(seenIds).sort();
console.log(`question generators · ${ids.length} question types · checks ${n} · failures ${bad}`);
console.log(ids.map(i => `${i}×${seenIds[i]}`).join("  "));
process.exit(bad ? 1 : 0);
