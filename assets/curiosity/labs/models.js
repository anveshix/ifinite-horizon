/* Curiosity Lab — physics models (pure functions, no DOM, no Three.js).
   Every number the simulators show, and every answer the quiz marks correct, comes from here, so the 3D picture, the 2D snapshot and the
   marking can never disagree. NCERT Class IX / X level only (thin-lens formula, Ohm's law, F = ma, mechanical energy). */

export const G = 9.8;                     // m s⁻², value used in the NCERT Class IX text
const EPS = 1e-9;

/* ============ Class X · Ch 9 · Light — spherical lenses (thin lens, Cartesian sign convention) ============ */
/** u, f in cm (positive magnitudes). type: 1 = convex (converging), -1 = concave (diverging). h = object height in cm (8). */
export function lens({ u, f, type = 1, h = 8 }) {
  const fs = type * f, us = -u;                      // signed: object is on the left, so u is negative
  const atInfinity = type === 1 && Math.abs(u - f) < EPS;
  const v = atInfinity ? Infinity : 1 / (1 / fs + 1 / us);   // 1/v − 1/u = 1/f
  const m = atInfinity ? -Infinity : v / us;                 // m = h'/h = v/u
  const real = atInfinity || v > 0;
  const inverted = m < 0;
  const am = Math.abs(m);
  const size = atInfinity ? "highly magnified" : am > 1 + 1e-6 ? "magnified" : am < 1 - 1e-6 ? "diminished" : "same size";
  let zone;                                                  // NCERT "position of the image"
  if (type === -1) zone = "between F and O (same side as the object)";
  else if (atInfinity) zone = "at infinity";
  else if (u > 2 * f + EPS) zone = "between F and 2F (other side)";
  else if (Math.abs(u - 2 * f) < EPS) zone = "at 2F (other side)";
  else if (u > f) zone = "beyond 2F (other side)";
  else zone = "on the same side as the object (virtual)";
  return { u, f, type, h, fs, us, v, m, hImg: atInfinity ? Infinity : m * h, real, inverted, size, zone, atInfinity, power: 100 / fs /* dioptre, f in cm */ };
}
/** Short NCERT-style description, e.g. "real, inverted, magnified". */
export const lensNature = L => `${L.real ? "real" : "virtual"}, ${L.inverted ? "inverted" : "erect"}, ${L.size}`;

/** Ray segments of the three principal rays for a lens, in cm. Used by the 3D scene AND the 2D snapshot (paraxial rule: slope' = slope − y/f). */
export function lensRays(L, xFar = 85) {
  const { u, h, fs } = L, rays = [], clamp = y => Math.max(-90, Math.min(90, y));
  const make = (name, color, yLens) => {
    const s1 = (yLens - h) / u;                              // slope before the lens
    const s2 = s1 - yLens / fs;                              // slope after the lens (thin-lens rule)
    const seg = { name, color, before: [[-u, h], [0, yLens]], after: [[0, yLens], [xFar, clamp(yLens + s2 * xFar)]], back: null };
    if (L.v < 0 && Number.isFinite(L.v)) seg.back = [[0, yLens], [L.v, L.hImg]];           // virtual: dashed extension back to the image tip
    return seg;
  };
  rays.push(make("parallel", "#ff5d5d", h));                 // 1 · parallel to the principal axis
  rays.push(make("centre", "#ffd23f", 0));                   // 2 · through the optical centre (goes straight)
  if (Math.abs(u - fs) > 1e-6) {                             // 3 · aimed at / through the focus on the object side
    const y3 = h + (-h / (u - fs)) * u;
    rays.push(make("focus", "#46e08a", y3));
  }
  return rays;
}

/* ============ Class X · Ch 11 · Electricity ============ */
/** mode 0 = R1 alone · 1 = R1 and R2 in series · 2 = R1 and R2 in parallel. V in volt, R in ohm. */
export function circuit({ V, R1, R2, mode = 0 }) {
  const Req = mode === 0 ? R1 : mode === 1 ? R1 + R2 : (R1 * R2) / (R1 + R2);
  const I = V / Req;
  const branch = mode === 2 ? [V / R1, V / R2] : mode === 1 ? [I, I] : [I, 0];
  const drop = mode === 2 ? [V, V] : mode === 1 ? [I * R1, I * R2] : [V, 0];
  return { V, R1, R2, mode, Req, I, I1: branch[0], I2: branch[1], V1: drop[0], V2: drop[1], P: V * I, P1: drop[0] * branch[0], P2: drop[1] * branch[1], heatPerMin: V * I * 60 /* J */ };
}
export const MODE_NAME = ["single resistor", "in series", "in parallel"];

/* ============ Class IX · Ch 10 · Force and Laws of Motion ============ */
/** Constant force F (N) on a trolley of mass m (kg), starting from rest, no friction. */
export function motion({ F, m }) {
  const a = F / m;
  return { F, m, a, at: t => ({ t, v: a * t, s: 0.5 * a * t * t, p: m * a * t }) };
}

/* ============ Class IX · Ch 11 · Work and Energy — pendulum ============ */
export const PEND_L = 2.0;                                   // m, string length (fixed)
/** Release the bob from height h (m) above its lowest point. */
export function pendulumStart({ m, h }) {
  const theta0 = Math.acos(1 - h / PEND_L);
  return { m, h, theta0, PE0: m * G * h, vMax: Math.sqrt(2 * G * h), KEmax: m * G * h, Etotal: m * G * h };
}
export function pendulumEnergy(m, theta, omega) {
  const hh = PEND_L * (1 - Math.cos(theta)), v = PEND_L * omega;
  return { height: hh, v, PE: m * G * hh, KE: 0.5 * m * v * v };
}
/** RK4 step of θ'' = −(g/L) sin θ (energy is conserved to ~1e-6 over many swings). */
export function pendulumStep(s, dt) {
  const k = G / PEND_L, f = (th, om) => [om, -k * Math.sin(th)];
  const a = f(s.theta, s.omega), b = f(s.theta + 0.5 * dt * a[0], s.omega + 0.5 * dt * a[1]),
    c = f(s.theta + 0.5 * dt * b[0], s.omega + 0.5 * dt * b[1]), d = f(s.theta + dt * c[0], s.omega + dt * c[1]);
  s.theta += (dt / 6) * (a[0] + 2 * b[0] + 2 * c[0] + d[0]);
  s.omega += (dt / 6) * (a[1] + 2 * b[1] + 2 * c[1] + d[1]);
  return s;
}

/* ============ Class IX · Ch 12 · Sound — waves, medium & echo ============ */
export const SOUND_MEDIA = [
  { id: "air", name: "Air (22 °C)", hi: "वायु (22 °C)", v: 344 },
  { id: "water", name: "Water", hi: "जल", v: 1498 },
  { id: "steel", name: "Steel", hi: "इस्पात (स्टील)", v: 5960 }
];
/** f in Hz, A in 0.2..1.0, medium 0|1|2, dist in m. */
export function soundWave({ f = 440, A = 0.6, medium = 0, dist = 25 }) {
  const m = SOUND_MEDIA[medium] || SOUND_MEDIA[0];
  const v = m.v;
  const T = 1 / f;
  const Tms = 1000 / f;
  const lambda = v / f;
  const tEcho = (2 * dist) / v;
  const dMin = (0.1 * v) / 2;
  const distinctEcho = tEcho >= 0.1 - EPS;
  const intensity = A * A;
  return { f, A, medium, mediaName: m.name, mediaHi: m.hi, v, T, Tms, lambda, dist, tEcho, dMin, distinctEcho, intensity };
}

/* ============ Class IX · Ch 9 / 10 · Motion & Free-Fall Gravity ============ */
export const PLANETS = [
  { id: "moon", name: "Moon", hi: "चन्द्रमा", g: 1.63, color: "#cbd5e1" },
  { id: "earth", name: "Earth", hi: "पृथ्वी", g: 9.8, color: "#38bdf8" },
  { id: "jupiter", name: "Jupiter", hi: "बृहस्पति", g: 24.8, color: "#fb923c" }
];
/** Vacuum free fall from rest: planet 0|1|2, drop height h (m), mass m (kg). */
export function freeFall({ planet = 1, h = 40, m = 2 }) {
  const P = PLANETS[planet] || PLANETS[1];
  const g = P.g;
  const tFall = Math.sqrt((2 * h) / g);
  const vImpact = Math.sqrt(2 * g * h);
  const weight = m * g;
  const at = t => {
    const tc = Math.min(Math.max(0, t), tFall);
    const s = 0.5 * g * tc * tc;
    const y = Math.max(0, h - s);
    const v = g * tc;
    return { t: tc, s, y, v, pe: m * g * y, ke: 0.5 * m * v * v };
  };
  return { planet, planetName: P.name, planetHi: P.hi, g, h, m, tFall, vImpact, weight, at };
}

/* ============ Class IX · Ch 1 · Cell & Osmosis ============ */
export const CELL_TYPES = [
  { id: "animal", name: "Animal Cell (RBC)", hi: "जंतु कोशिका (RBC)", wall: false, nucleus: true, chloroplast: false },
  { id: "plant", name: "Plant Cell (Onion)", hi: "पादप कोशिका (प्याज़)", wall: true, nucleus: true, chloroplast: true },
  { id: "prokaryote", name: "Prokaryote (Bacterium)", hi: "प्रोकैरियोट (जीवाणु)", wall: true, nucleus: false, chloroplast: false }
];
export function osmosisModel({ cellType = 1, tonicity = 0, temp = 20 }) {
  const ct = CELL_TYPES[cellType] || CELL_TYPES[1];
  const flux = tonicity < 0 ? "inward" : tonicity > 0 ? "outward" : "balanced";
  const rate = +(0.6 + (temp - 10) * 0.03).toFixed(2);
  let state, stateHi, volScale;
  if (tonicity < 0) {
    if (cellType === 0) { state = "Swollen → Lysis (bursts)"; stateHi = "फूलकर फट जाती है"; volScale = 1.28; }
    else { state = "Turgid (wall prevents bursting)"; stateHi = "स्फीत (कोशिका भित्ति फटने से रोकती है)"; volScale = 1.12; }
  } else if (tonicity === 0) {
    state = cellType === 1 ? "Flaccid (dynamic equilibrium)" : "Normal (dynamic equilibrium)";
    stateHi = "सामान्य (संतुलित जल प्रवाह)";
    volScale = 1.0;
  } else {
    if (cellType === 0) { state = "Crenated (shrunken)"; stateHi = "सिकुड़ी हुई (बहिःपरासरण)"; volScale = 0.72; }
    else { state = "Plasmolysed (membrane shrinks away from wall)"; stateHi = "जीवद्रव्यकुंचित (झिल्ली भित्ति से अलग)"; volScale = 0.75; }
  }
  return { cellType, cellName: ct.name, cellHi: ct.hi, hasCellWall: ct.wall, hasNucleus: ct.nucleus, hasChloroplast: ct.chloroplast, tonicity, temp, flux, rate, state, stateHi, volScale };
}

/* ============ Class IX · Ch 2 · Tissues ============ */
export const TISSUE_TYPES = [
  { id: "parenchyma", name: "Parenchyma", hi: "पैरेन्काइमा", living: true, group: "Plant · Simple", role: "Storage & photosynthesis", roleHi: "भोजन संग्रह व प्रकाश-संश्लेषण" },
  { id: "collenchyma", name: "Collenchyma", hi: "कॉलेन्काइमा", living: true, group: "Plant · Simple", role: "Flexible mechanical support", roleHi: "लचीलापन व यांत्रिक सहारा" },
  { id: "sclerenchyma", name: "Sclerenchyma", hi: "स्क्लेरेन्काइमा", living: false, group: "Plant · Simple", role: "Rigid lignified strength (dead)", roleHi: "कठोर लिग्निन युक्त मज़बूती (मृत)" },
  { id: "xylem", name: "Xylem & Phloem", hi: "जाइलम व फ्लोएम", living: false, group: "Plant · Complex", role: "Unidirectional water (xylem) & bidirectional food (phloem)", roleHi: "एकदिशीय जल (जाइलम) व द्विदिशीय भोजन (फ्लोएम)" },
  { id: "muscle", name: "Striated Muscle", hi: "रेखित पेशी", living: true, group: "Animal · Muscular", role: "Voluntary contraction (multinucleated)", roleHi: "ऐच्छिक संकुचन (बहुकेंद्रकीय)" },
  { id: "neuron", name: "Neuron", hi: "तंत्रिका कोशिका (न्यूरॉन)", living: true, group: "Animal · Nervous", role: "Rapid electrical impulse transmission", roleHi: "तीव्र विद्युत आवेग संचरण" }
];
export function tissueModel({ tissue = 0, zoom = 200, transp = 3 }) {
  const T = TISSUE_TYPES[tissue] || TISSUE_TYPES[0];
  const speed = +(0.6 * transp).toFixed(2);      // relative flow / contraction / impulse velocity
  const fieldUm = Math.round(40000 / zoom);      // field of view in µm
  return { ...T, tissue, zoom, transp, speed, fieldUm };
}

/* ============ small shared helpers ============ */
export const fmt = (x, d = 2) => !Number.isFinite(x) ? "∞" : (Math.abs(x) >= 1000 ? x.toFixed(0) : +x.toFixed(d)).toString();
