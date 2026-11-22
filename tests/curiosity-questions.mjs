// Question generators vs independent re-derivations. Run: node tests/curiosity-questions.mjs
// For hundreds of random experiment states per lab: every question must validate, contain exactly one marked answer, and that answer must equal
// what the physics gives when worked out again here WITHOUT the lab's own model code (plain formulas / geometry).
import { validateQuestion, registerLab, _resetLabs } from "../assets/curiosity/core.js";
import lens from "../assets/curiosity/labs/lens.js";
import eye from "../assets/curiosity/labs/eye.js";
import ohm from "../assets/curiosity/labs/ohm.js";
import magnet from "../assets/curiosity/labs/magnet.js";
import force from "../assets/curiosity/labs/force.js";
import energy from "../assets/curiosity/labs/energy.js";
import sound from "../assets/curiosity/labs/sound.js";
import gravity from "../assets/curiosity/labs/gravity.js";
import ph from "../assets/curiosity/labs/ph.js";
import atom from "../assets/curiosity/labs/atom.js";
import matter from "../assets/curiosity/labs/matter.js";
import cell from "../assets/curiosity/labs/cell.js";
import tissues from "../assets/curiosity/labs/tissues.js";
import heart from "../assets/curiosity/labs/heart.js";
import genetics from "../assets/curiosity/labs/genetics.js";
import reactions from "../assets/curiosity/labs/reactions.js";
import molecules from "../assets/curiosity/labs/molecules.js";
import organs from "../assets/curiosity/labs/organs.js";
import nervous from "../assets/curiosity/labs/nervous.js";
import repro from "../assets/curiosity/labs/repro.js";
import climate from "../assets/curiosity/labs/climate.js";
import ecology from "../assets/curiosity/labs/ecology.js";
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

/* ---------------- contract registration for all 22 labs ---------------- */
_resetLabs();
for (const lab of [lens, eye, ohm, magnet, force, energy, sound, gravity, ph, atom, matter, reactions, molecules, cell, tissues, heart, organs, nervous, repro, genetics, climate, ecology]) {
  try { registerLab(lab); ok(true, `register ${lab.id}`); }
  catch (e) { fail(`registerLab(${lab.id}) threw: ${e.message}`); }
}

/* ---------------- sound ---------------- */
const MV = [344, 1498, 5960];
run(sound, 400, 67, (q) => {
  const iv = q.image.vars, c = correct(q), v = MV[iv.medium];
  if (q.id === "sound-echo") { const echo = (2 * iv.dist) / v >= 0.1 - 1e-9; ok(echo ? /Distinct echo/i.test(c) : /reverberation/i.test(c), `sound-echo ${JSON.stringify(iv)} got "${c}"`); }
  if (q.id === "sound-wavelength") { const lam = +(v / iv.f).toFixed(2); ok(c === `${lam} m`, `sound-wavelength expected ${lam} m got "${c}"`); }
  if (q.id === "sound-medium") ok(/Steel/.test(c), `sound-medium got "${c}"`);
  if (q.id === "sound-pitch") ok(/Frequency/.test(c), `sound-pitch got "${c}"`);
  if (q.id === "sound-loudness") ok(/Amplitude/.test(c), `sound-loudness got "${c}"`);
  if (q.id === "sound-predict") { const r = (MV[q.meta.b.medium] / q.meta.b.f) / (MV[q.meta.a.medium] / q.meta.a.f); ok(near(r, q.meta.ratio, 1e-9) && /half/i.test(c), `sound-predict ratio ${r} text "${c}"`); }
});

/* ---------------- gravity ---------------- */
const PG = [1.63, 9.8, 24.8];
run(gravity, 400, 73, (q) => {
  const iv = q.image.vars, c = correct(q), g = PG[iv.planet];
  if (q.id === "grav-time") { const t = +Math.sqrt((2 * iv.h) / g).toFixed(2); ok(c === `${t} s`, `grav-time expected ${t} s got "${c}"`); }
  if (q.id === "grav-impact") { const vi = +Math.sqrt(2 * g * iv.h).toFixed(2); ok(c === `${vi} m/s`, `grav-impact expected ${vi} m/s got "${c}"`); }
  if (q.id === "grav-mass") ok(/exact same time/.test(c), `grav-mass got "${c}"`);
  if (q.id === "grav-weight") { const w = +(iv.m * g).toFixed(1); ok(c === `${w} N`, `grav-weight expected ${w} N got "${c}"`); }
  if (q.id === "grav-predict") { const r = Math.sqrt(q.meta.b.h / q.meta.a.h); ok(near(r, q.meta.ratio, 1e-9) && /doubles/i.test(c), `grav-predict ratio ${r} got "${c}"`); }
  if (q.id === "grav-vt") ok(/slope = g/.test(c), `grav-vt got "${c}"`);
});

/* ---------------- cell ---------------- */
run(cell, 400, 89, (q) => {
  const iv = q.image.vars, c = correct(q);
  if (q.id === "cell-osmosis-dir") ok(iv.tonicity < 0 ? /INWARD/.test(c) : iv.tonicity > 0 ? /OUTWARD/.test(c) : /Equal water/.test(c), `cell-osmosis-dir ${iv.tonicity} got "${c}"`);
  if (q.id === "cell-wall") ok(/cell wall/i.test(c), `cell-wall got "${c}"`);
  if (q.id === "cell-plasmolysis") ok(/Plasmolysis/.test(c), `cell-plasmolysis got "${c}"`);
  if (q.id === "cell-prokaryote") ok(/Nucleoid/.test(c), `cell-prokaryote got "${c}"`);
  if (q.id === "cell-organelle") ok(c === "Mitochondria", `cell-organelle got "${c}"`);
  if (q.id === "cell-predict") ok(/exits.*shrinks/i.test(c), `cell-predict got "${c}"`);
});

/* ---------------- tissues ---------------- */
const TNAMES = ["Parenchyma", "Collenchyma", "Sclerenchyma", "Xylem & Phloem", "Striated Muscle", "Neuron"];
run(tissues, 400, 97, (q) => {
  const iv = q.image.vars, c = correct(q);
  if (q.id === "tis-identify") ok(c === TNAMES[iv.tissue], `tis-identify ${iv.tissue} got "${c}"`);
  if (q.id === "tis-living") ok(/Sclerenchyma/.test(c), `tis-living got "${c}"`);
  if (q.id === "tis-flex") ok(c === "Collenchyma", `tis-flex got "${c}"`);
  if (q.id === "tis-transport") ok(/Xylem carries water upward only/.test(c), `tis-transport got "${c}"`);
  if (q.id === "tis-muscle") ok(/Striated/.test(c), `tis-muscle got "${c}"`);
  if (q.id === "tis-predict") ok(/speeds up/.test(c), `tis-predict got "${c}"`);
});

/* ---------------- eye ---------------- */
run(eye, 300, 103, (q) => {
  const c = correct(q);
  if (q.id === "eye-myopia") ok(/Concave/.test(c), `eye-myopia got "${c}"`);
  if (q.id === "eye-hyper") ok(/Convex/.test(c), `eye-hyper got "${c}"`);
  if (q.id === "eye-prism-order") ok(/Violet bends the most/.test(c), `eye-prism-order got "${c}"`);
  if (q.id === "eye-accom") ok(/Ciliary/.test(c), `eye-accom got "${c}"`);
  if (q.id === "eye-range") ok(/25 cm to infinity/.test(c), `eye-range got "${c}"`);
  if (q.id === "eye-predict") ok(/closer to the eye lens/.test(c), `eye-predict got "${c}"`);
});

/* ---------------- magnet ---------------- */
run(magnet, 300, 113, (q) => {
  const c = correct(q);
  if (q.id === "mag-solenoid") ok(/Straight, parallel/.test(c), `mag-solenoid got "${c}"`);
  if (q.id === "mag-flip") ok(/North and South poles swap/.test(c), `mag-flip got "${c}"`);
  if (q.id === "mag-induction-zero") ok(/Zero/.test(c), `mag-induction-zero got "${c}"`);
  if (q.id === "mag-flhr") ok(/Fleming's Left-Hand/.test(c), `mag-flhr got "${c}"`);
  if (q.id === "mag-predict-turns") ok(/doubles/.test(c), `mag-predict-turns got "${c}"`);
  if (q.id === "mag-domestic") ok(/220 V AC/.test(c), `mag-domestic got "${c}"`);
});

/* ---------------- ph ---------------- */
run(ph, 300, 127, (q) => {
  const iv = q.image.vars, c = correct(q);
  if (q.id === "ph-neutral") ok(/Salt and Water/.test(c), `ph-neutral got "${c}"`);
  if (q.id === "ph-phenol") ok(/Pink/.test(c), `ph-phenol got "${c}"`);
  if (q.id === "ph-litmus") ok(/Red/.test(c), `ph-litmus got "${c}"`);
  if (q.id === "ph-nature") ok(iv.pH === 7 ? /Neutral/.test(c) : iv.pH < 7 ? /Acidic/.test(c) : /Basic/.test(c), `ph-nature pH=${iv.pH} got "${c}"`);
  if (q.id === "ph-turmeric") ok(/Reddish-brown/.test(c), `ph-turmeric got "${c}"`);
  if (q.id === "ph-predict") ok(/100 times lower/.test(c), `ph-predict got "${c}"`);
});

/* ---------------- atom ---------------- */
run(atom, 300, 139, (q) => {
  const iv = q.image.vars, c = correct(q), Z = iv.Z;
  const k = Math.min(2, Z), l = Math.min(8, Math.max(0, Z - 2)), m = Math.min(8, Math.max(0, Z - 10)), n4 = Math.max(0, Z - 18);
  const cfg = [k, l, m, n4].filter(x => x > 0).join(", ");
  const val = Z === 2 ? 0 : (Z <= 2 ? k : Z <= 10 ? l : Z <= 18 ? m : n4);
  const valency = Z === 2 ? 0 : (val <= 4 ? val : 8 - val);
  if (q.id === "atom-config") ok(c === cfg, `atom-config Z=${Z} expected "${cfg}" got "${c}"`);
  if (q.id === "atom-valency") ok(c === String(valency), `atom-valency Z=${Z} expected ${valency} got "${c}"`);
  if (q.id === "atom-isotopes") ok(/Same atomic number Z/.test(c), `atom-isotopes got "${c}"`);
  if (q.id === "atom-noble") ok(/Noble gas/.test(c), `atom-noble got "${c}"`);
  if (q.id === "atom-predict") ok(/Na⁺/.test(c), `atom-predict got "${c}"`);
});

/* ---------------- matter ---------------- */
run(matter, 300, 149, (q) => {
  const iv = q.image.vars, c = correct(q);
  if (q.id === "mat-tyndall") ok(/Colloid/.test(c), `mat-tyndall got "${c}"`);
  if (q.id === "mat-true") ok(/< 1 nm/.test(c), `mat-true got "${c}"`);
  if (q.id === "mat-filter") ok(/Suspension/.test(c), `mat-filter got "${c}"`);
  if (q.id === "mat-conc") { const pct = +((100 * iv.conc) / (100 + iv.conc)).toFixed(1); ok(c === `${pct}%`, `mat-conc ${iv.conc} expected ${pct}% got "${c}"`); }
  if (q.id === "mat-kelvin") ok(/373\.15 K/.test(c), `mat-kelvin got "${c}"`);
  if (q.id === "mat-predict") ok(/Centrifugation/.test(c), `mat-predict got "${c}"`);
});

/* ---------------- heart ---------------- */
run(heart, 300, 157, (q) => {
  const iv = q.image.vars, c = correct(q);
  if (q.id === "hrt-lv") ok(/Left Ventricle/.test(c), `hrt-lv got "${c}"`);
  if (q.id === "hrt-pulm") ok(/Pulmonary Artery/.test(c), `hrt-pulm got "${c}"`);
  if (q.id === "hrt-pvein") ok(/Pulmonary Vein/.test(c), `hrt-pvein got "${c}"`);
  if (q.id === "hrt-septum") ok(/Prevents mixing/.test(c), `hrt-septum got "${c}"`);
  if (q.id === "hrt-output") ok(c === `${+((iv.bpm * iv.sv) / 1000).toFixed(2)} L/min`, `hrt-output bpm=${iv.bpm} sv=${iv.sv} got "${c}"`);
  if (q.id === "hrt-predict") ok(/backward flow/.test(c), `hrt-predict got "${c}"`);
});

/* ---------------- genetics ---------------- */
const GC = ["TT", "Tt", "tt"];
run(genetics, 300, 163, (q) => {
  const iv = q.image.vars, c = correct(q);
  if (q.id === "gen-f2") ok(/3 Tall : 1 Dwarf/.test(c), `gen-f2 got "${c}"`);
  if (q.id === "gen-f1") ok(/100% Tall/.test(c), `gen-f1 got "${c}"`);
  if (q.id === "gen-geno") ok(c === "1 TT : 2 Tt : 1 tt", `gen-geno got "${c}"`);
  if (q.id === "gen-sex") ok(/Father's sperm/.test(c), `gen-sex got "${c}"`);
  if (q.id === "gen-pct") {
    const a1 = GC[iv.p1].split(""), a2 = GC[iv.p2].split("");
    let tall = 0; a1.forEach(x => a2.forEach(y => { if (x === "T" || y === "T") tall++; }));
    ok(c === `${tall * 25}% Tall`, `gen-pct ${GC[iv.p1]}x${GC[iv.p2]} expected ${tall * 25}% Tall got "${c}"`);
  }
  if (q.id === "gen-predict") ok(/50% Tall.*50% Dwarf/.test(c), `gen-predict got "${c}"`);
});

/* ---------------- reactions ---------------- */
run(reactions, 200, 173, (q) => {
  const c = correct(q);
  if (q.id === "rxn-disp") ok(/pale green.*reddish-brown copper/.test(c), `rxn-disp got "${c}"`);
  if (q.id === "rxn-ddisp") ok(/BaSO₄/.test(c), `rxn-ddisp got "${c}"`);
  if (q.id === "rxn-redox") ok(/CuO is reduced.*H₂ is oxidised/.test(c), `rxn-redox got "${c}"`);
  if (q.id === "rxn-balance") ok(/Law of Conservation of Mass/.test(c), `rxn-balance got "${c}"`);
  if (q.id === "rxn-ionic") ok(/Sodium donates 1 electron/.test(c), `rxn-ionic got "${c}"`);
  if (q.id === "rxn-predict") ok(/NO reaction/.test(c), `rxn-predict got "${c}"`);
});

/* ---------------- molecules ---------------- */
run(molecules, 200, 181, (q) => {
  const iv = q.image.vars, c = correct(q);
  const MM = [18, 16, 44, 46, 58.5, 12, 12, 306];
  if (q.id === "mol-mass") ok(c === `${+(MM[iv.mol] * iv.count).toFixed(1)} u`, `mol-mass mol=${iv.mol} cnt=${iv.count} got "${c}"`);
  if (q.id === "mol-graphite") ok(/Graphite/.test(c), `mol-graphite got "${c}"`);
  if (q.id === "mol-micelle") ok(/Hydrophobic/.test(c), `mol-micelle got "${c}"`);
  if (q.id === "mol-carbon") ok(/Catenation/.test(c), `mol-carbon got "${c}"`);
  if (q.id === "mol-ethanol") ok(/–OH/.test(c), `mol-ethanol got "${c}"`);
  if (q.id === "mol-predict") ok(/Conservation of Mass/.test(c), `mol-predict got "${c}"`);
});

/* ---------------- organs ---------------- */
run(organs, 200, 191, (q) => {
  const c = correct(q);
  if (q.id === "org-villi") ok(/Small Intestine/.test(c), `org-villi got "${c}"`);
  if (q.id === "org-alveoli") ok(/Alveoli/.test(c), `org-alveoli got "${c}"`);
  if (q.id === "org-nephron") ok(/Nephron/.test(c), `org-nephron got "${c}"`);
  if (q.id === "org-joint") ok(/Ball-and-socket/i.test(c), `org-joint got "${c}"`);
  if (q.id === "org-reabsorb") ok(/Glucose/.test(c), `org-reabsorb got "${c}"`);
  if (q.id === "org-predict") ok(/Bile/.test(c) || /emulsify/i.test(c) || /fat/i.test(c), `org-predict got "${c}"`);
});

/* ---------------- nervous ---------------- */
run(nervous, 200, 199, (q) => {
  const c = correct(q);
  if (q.id === "ner-synapse") ok(/neurotransmitter/.test(c), `ner-synapse got "${c}"`);
  if (q.id === "ner-reflex") ok(/Spinal Cord/.test(c), `ner-reflex got "${c}"`);
  if (q.id === "ner-cerebellum") ok(/Cerebellum/.test(c), `ner-cerebellum got "${c}"`);
  if (q.id === "ner-medulla") ok(/Medulla/.test(c), `ner-medulla got "${c}"`);
  if (q.id === "ner-auxin") ok(/Auxin/.test(c), `ner-auxin got "${c}"`);
  if (q.id === "ner-predict") ok(/Insulin/.test(c) || /Adrenaline/.test(c) || /Thyroxine/.test(c), `ner-predict got "${c}"`);
});

/* ---------------- repro ---------------- */
run(repro, 200, 211, (q) => {
  const c = correct(q);
  if (q.id === "rep-fruit") ok(/Ovule becomes Seed/.test(c), `rep-fruit got "${c}"`);
  if (q.id === "rep-amoeba") ok(/Binary Fission/.test(c), `rep-amoeba got "${c}"`);
  if (q.id === "rep-hydra") ok(/Budding/.test(c), `rep-hydra got "${c}"`);
  if (q.id === "rep-poll") ok(/transfer of pollen/.test(c), `rep-poll got "${c}"`);
  if (q.id === "rep-disp") ok(/overcrowding/.test(c), `rep-disp got "${c}"`);
  if (q.id === "rep-predict") ok(/variations/.test(c), `rep-predict got "${c}"`);
});

/* ---------------- climate ---------------- */
run(climate, 200, 223, (q) => {
  const c = correct(q);
  if (q.id === "cli-seabreeze") ok(/Land heats faster/.test(c), `cli-seabreeze got "${c}"`);
  if (q.id === "cli-greenhouse") ok(/CO₂/.test(c), `cli-greenhouse got "${c}"`);
  if (q.id === "cli-spectrum") ok(/Gamma < X-ray/.test(c), `cli-spectrum got "${c}"`);
  if (q.id === "cli-nitrogen") ok(/Rhizobium/.test(c), `cli-nitrogen got "${c}"`);
  if (q.id === "cli-spheres") ok(/Troposphere/.test(c), `cli-spheres got "${c}"`);
  if (q.id === "cli-predict") ok(/Land Breeze/.test(c), `cli-predict got "${c}"`);
});

/* ---------------- ecology ---------------- */
run(ecology, 200, 229, (q) => {
  const iv = q.image.vars, c = correct(q);
  if (q.id === "eco-tenpct") ok(c === `${+(iv.producerE * 0.01).toFixed(1)} J`, `eco-tenpct P=${iv.producerE} got "${c}"`);
  if (q.id === "eco-ddt") ok(/Biomagnification/.test(c), `eco-ddt got "${c}"`);
  if (q.id === "eco-ozone") ok(/Chlorofluorocarbons/.test(c), `eco-ozone got "${c}"`);
  if (q.id === "eco-flow") ok(/Unidirectional/.test(c), `eco-flow got "${c}"`);
  if (q.id === "eco-kingdoms") ok(/Monera/.test(c), `eco-kingdoms got "${c}"`);
  if (q.id === "eco-predict") ok(/nutrients stop recycling/.test(c), `eco-predict got "${c}"`);
});

const ids = Object.keys(seenIds).sort();
console.log(`question generators · ${ids.length} question types · checks ${n} · failures ${bad}`);
console.log(ids.map(i => `${i}×${seenIds[i]}`).join("  "));
process.exit(bad ? 1 : 0);
