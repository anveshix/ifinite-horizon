// Physics models vs NCERT textbook results. Run: node tests/curiosity-physics.mjs
import { lens, lensNature, lensRays, circuit, motion, pendulumStart, pendulumEnergy, pendulumStep, G, PEND_L, soundWave, freeFall, osmosisModel, tissueModel } from "../assets/curiosity/labs/models.js";
let n = 0, bad = 0;
const ok = (c, m) => { n++; if (!c) { bad++; console.log(" ✗", m); } };
const near = (a, b, e = 1e-6) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));

/* Convex lens, NCERT Table 9.x (object position → image) with f = 10 cm */
let L = lens({ u: 40, f: 10 });   ok(near(L.v, 13.333333) && L.real && L.inverted && L.size === "diminished" && /between F and 2F/.test(L.zone), "u beyond 2F");
L = lens({ u: 20, f: 10 });       ok(near(L.v, 20) && near(L.m, -1) && L.size === "same size" && /at 2F/.test(L.zone) && lensNature(L) === "real, inverted, same size", "u at 2F");
L = lens({ u: 15, f: 10 });       ok(near(L.v, 30) && L.real && L.inverted && L.size === "magnified" && /beyond 2F/.test(L.zone), "u between F and 2F");
L = lens({ u: 10, f: 10 });       ok(L.atInfinity && L.v === Infinity && L.real && L.inverted && L.size === "highly magnified" && L.zone === "at infinity", "u at F");
L = lens({ u: 5, f: 10 });        ok(near(L.v, -10) && !L.real && !L.inverted && L.size === "magnified" && near(L.m, 2) && /virtual/.test(L.zone), "u between F and O");
/* Concave lens: always virtual, erect, diminished, between F and O */
for (const u of [5, 10, 20, 40, 60]) { L = lens({ u, f: 15, type: -1 }); ok(!L.real && !L.inverted && L.size === "diminished" && L.v < 0 && Math.abs(L.v) < 15 && /between F and O/.test(L.zone), `concave u=${u}`); }
ok(near(lens({ u: 30, f: 20 }).power, 5) && near(lens({ u: 30, f: 20, type: -1 }).power, -5) && near(lens({ u: 30, f: 50 }).power, 2), "power P = 1/f(m): +5 D, -5 D, +2 D");
/* lens formula holds for a grid of cases and image height follows m·h */
for (let u = 6; u <= 70; u += 4) for (const f of [8, 12, 20, 30]) for (const type of [1, -1]) {
  if (type === 1 && Math.abs(u - f) < 1e-9) continue; const A = lens({ u, f, type });
  ok(near(1 / A.v - 1 / A.us, 1 / A.fs, 1e-9) && near(A.hImg, A.m * A.h), `formula u=${u} f=${f} type=${type}`);
}
/* Principal rays: after the lens all rays pass through the (real) image tip, or appear to come from it (virtual) */
for (const [u, f, type] of [[40, 10, 1], [15, 10, 1], [5, 10, 1], [30, 12, -1]]) {
  const A = lens({ u, f, type }), rays = lensRays(A, 3);
  ok(rays.length >= 2, `rays exist u=${u}`);
  rays.forEach(r => {
    const [[x0, y0], [x1, y1]] = r.after, t = (A.v - x0) / (x1 - x0), yAt = y0 + t * (y1 - y0);
    ok(near(yAt, A.hImg, 1e-6), `ray ${r.name} passes through the image tip (u=${u} f=${f} type=${type}): ${yAt} vs ${A.hImg}`);
  });
}

/* Ohm's law and combinations */
let C = circuit({ V: 6, R1: 3, R2: 6, mode: 0 });  ok(near(C.I, 2) && near(C.P, 12) && near(C.heatPerMin, 720), "single: I = V/R = 2 A, P = 12 W");
C = circuit({ V: 6, R1: 3, R2: 6, mode: 1 });      ok(near(C.Req, 9) && near(C.I, 6 / 9) && near(C.V1 + C.V2, 6) && near(C.V1, 2) && near(C.V2, 4), "series: R = 9 Ω, drops add to V");
C = circuit({ V: 6, R1: 3, R2: 6, mode: 2 });      ok(near(C.Req, 2) && near(C.I, 3) && near(C.I1 + C.I2, C.I) && near(C.I1, 2) && near(C.I2, 1) && near(C.V1, 6) && near(C.V2, 6), "parallel: R = 2 Ω, branch currents add");
ok(near(circuit({ V: 12, R1: 4, R2: 4, mode: 0 }).I / circuit({ V: 6, R1: 4, R2: 4, mode: 0 }).I, 2), "double V → double I");
ok(near(circuit({ V: 6, R1: 8, R2: 4, mode: 0 }).I / circuit({ V: 6, R1: 4, R2: 4, mode: 0 }).I, 0.5), "double R → half I");
ok(near(circuit({ V: 9, R1: 5, R2: 7, mode: 1 }).P, 9 * 9 / 12) && near(circuit({ V: 9, R1: 5, R2: 7, mode: 2 }).P1 + circuit({ V: 9, R1: 5, R2: 7, mode: 2 }).P2, circuit({ V: 9, R1: 5, R2: 7, mode: 2 }).P), "power adds up");

/* F = ma */
let M = motion({ F: 12, m: 4 }); ok(near(M.a, 3) && near(M.at(2).v, 6) && near(M.at(2).s, 6) && near(M.at(2).p, 24), "a = 3 m/s², v(2 s) = 6, s = 6 m, p = 24");
ok(near(motion({ F: 20, m: 2 }).a / motion({ F: 10, m: 2 }).a, 2) && near(motion({ F: 10, m: 4 }).a / motion({ F: 10, m: 2 }).a, 0.5), "F×2 → a×2; m×2 → a÷2");

/* Pendulum: energy conservation, v = √(2gh), independent of mass */
for (const [m, h] of [[1, 0.3], [5, 0.3], [2, 1.0], [0.5, 0.05]]) {
  const S = pendulumStart({ m, h }), st = { theta: S.theta0, omega: 0 };
  let minH = 9, maxV = 0, worst = 0;
  for (let i = 0; i < 20000; i++) { pendulumStep(st, 0.001); const e = pendulumEnergy(m, st.theta, st.omega); worst = Math.max(worst, Math.abs(e.PE + e.KE - S.Etotal) / S.Etotal); maxV = Math.max(maxV, Math.abs(e.v)); minH = Math.min(minH, e.height); }
  ok(worst < 1e-6, `energy conserved m=${m} h=${h} (drift ${worst})`);
  ok(Math.abs(maxV - S.vMax) / S.vMax < 1e-3 && minH < 1e-3, `max speed ≈ √(2gh) m=${m} h=${h}: ${maxV} vs ${S.vMax}`);
}
ok(near(pendulumStart({ m: 1, h: 0.4 }).vMax, pendulumStart({ m: 9, h: 0.4 }).vMax), "speed at the bottom is independent of mass");
ok(near(pendulumStart({ m: 2, h: 0.4 }).PE0, 2 * G * 0.4) && PEND_L === 2, "PE = mgh");

/* Sound wave & echo (NCERT Class IX Ch 12: 344 m/s in air at 22°C, min echo d = 17.2 m) */
let SW = soundWave({ f: 400, A: 0.6, medium: 0, dist: 25 });
ok(SW.v === 344 && near(SW.lambda, 344 / 400) && near(SW.tEcho, 50 / 344) && SW.distinctEcho === true && near(SW.dMin, 17.2), "sound air 25m distinct echo");
SW = soundWave({ f: 400, A: 0.6, medium: 0, dist: 15 });
ok(SW.distinctEcho === false && SW.tEcho < 0.1, "sound air 15m reverberation");
SW = soundWave({ f: 500, A: 0.8, medium: 2, dist: 30 });
ok(SW.v === 5960 && near(SW.lambda, 5960 / 500) && !SW.distinctEcho, "sound steel 5960 m/s");

/* Gravity free fall (NCERT Class IX Ch 9/10) */
let FF = freeFall({ planet: 1, h: 40, m: 4 });
ok(FF.g === 9.8 && near(FF.tFall, Math.sqrt(80 / 9.8)) && near(FF.vImpact, Math.sqrt(2 * 9.8 * 40)) && near(FF.weight, 4 * 9.8), "free fall earth");
ok(near(freeFall({ planet: 1, h: 40, m: 1 }).tFall, freeFall({ planet: 1, h: 40, m: 10 }).tFall), "free fall time independent of mass");
ok(near(freeFall({ planet: 1, h: 80, m: 2 }).vImpact / freeFall({ planet: 1, h: 20, m: 2 }).vImpact, 2), "4x height doubles impact speed");
ok(freeFall({ planet: 0, h: 40, m: 6 }).weight < freeFall({ planet: 1, h: 40, m: 6 }).weight, "moon weight < earth weight");

/* Cell osmosis & Tissue models (NCERT Class IX Ch 1 & Ch 2) */
let OM = osmosisModel({ cellType: 1, tonicity: 1, temp: 20 });
ok(OM.hasCellWall && OM.hasNucleus && OM.hasChloroplast && OM.flux === "outward" && /Plasmolysed/.test(OM.state), "plant cell hypertonic plasmolysis");
OM = osmosisModel({ cellType: 0, tonicity: -1, temp: 30 });
ok(!OM.hasCellWall && OM.flux === "inward" && /Lysis/.test(OM.state), "animal cell hypotonic lysis");
OM = osmosisModel({ cellType: 2, tonicity: 0, temp: 20 });
ok(OM.hasCellWall && !OM.hasNucleus && OM.flux === "balanced", "prokaryote nucleoid");
let TM = tissueModel({ tissue: 2, zoom: 400, transp: 3 });
ok(!TM.living && TM.fieldUm === 100 && /Sclerenchyma/.test(TM.name), "sclerenchyma dead");
TM = tissueModel({ tissue: 3, zoom: 200, transp: 5 });
ok(TM.speed === 3 && TM.fieldUm === 200 && /Xylem/.test(TM.name), "xylem speed scales with transp");

console.log(`physics models · checks ${n} · failures ${bad}`);
process.exit(bad ? 1 : 0);
