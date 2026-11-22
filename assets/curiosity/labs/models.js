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

/* ============ Class X · Ch 10 · Human Eye & Prism Dispersion ============ */
export const EYE_DEFECTS = [
  { id: "myopia", val: -1, name: "Myopia (Nearsighted)", hi: "निकट-दृष्टि दोष", reqP: -2.0, fix: "Concave lens", fixHi: "अवतल लेंस" },
  { id: "normal", val: 0, name: "Normal Vision", hi: "सामान्य दृष्टि", reqP: 0.0, fix: "No lens needed", fixHi: "लेंस आवश्यक नहीं" },
  { id: "hypermetropia", val: 1, name: "Hypermetropia (Farsighted)", hi: "दूर-दृष्टि दोष", reqP: 2.0, fix: "Convex lens", fixHi: "उत्तल लेंस" }
];
export function eyeModel({ defect = -1, P = 0, viewMode = 0 }) {
  const D = EYE_DEFECTS.find(x => x.val === defect) || EYE_DEFECTS[1];
  const err = +(P - D.reqP).toFixed(2);       // 0 => exact focus on retina; >0 => in front; <0 => behind
  const sharp = Math.abs(err) < 0.25;
  const focusWhere = sharp ? "On retina (Sharp!)" : err > 0 ? "In front of retina (blurry)" : "Behind retina (blurry)";
  const focusHi = sharp ? "रेटिना पर (स्पष्ट!)" : err > 0 ? "रेटिना के आगे (धुंधला)" : "रेटिना के पीछे (धुंधला)";
  const redDev = 36, violetDev = 44, spread = violetDev - redDev;
  return { defect, defectName: D.name, defectHi: D.hi, reqP: D.reqP, fix: D.fix, fixHi: D.fixHi, P, err, sharp, focusWhere, focusHi, viewMode, redDev, violetDev, spread };
}

/* ============ Class X · Ch 12 · Magnetic Effects & Induction ============ */
export function magnetModel({ I = 3, N = 30, dir = 1, speed = 2 }) {
  const B = +(0.04 * N * I).toFixed(2);       // mT inside solenoid proportional to N*I
  const forceRel = +(B * I * dir).toFixed(2); // F = B I L indicator
  const emf = +(0.015 * N * speed).toFixed(2); // induced current indicator (0 when stationary)
  const poleRight = dir >= 0 ? "North (N)" : "South (S)";
  const poleLeft = dir >= 0 ? "South (S)" : "North (N)";
  return { I, N, dir, speed, B, forceRel, emf, poleLeft, poleRight };
}

/* ============ Class X · Ch 2 · Acids, Bases, pH & Indicators ============ */
export const PH_INDICATORS = [
  { id: "universal", name: "Universal", hi: "सार्वत्रिक सूचक" },
  { id: "litmus", name: "Litmus", hi: "लिटमस" },
  { id: "phenol", name: "Phenolphthalein", hi: "फिनॉल्फ़थेलीन" },
  { id: "turmeric", name: "Turmeric", hi: "हल्दी" }
];
export function phModel({ pH = 7, indicator = 0 }) {
  const nature = pH < 7 ? "Acidic" : pH > 7 ? "Basic" : "Neutral";
  const natureHi = pH < 7 ? "अम्लीय" : pH > 7 ? "क्षारीय" : "उदासीन";
  const strength = pH <= 2 ? "Strong Acid" : pH < 7 ? "Weak Acid" : pH === 7 ? "Neutral" : pH <= 11 ? "Weak Base" : "Strong Base";
  let colorName, colorHi, hex;
  if (indicator === 0) {
    if (pH <= 2) { colorName = "Red"; colorHi = "लाल"; hex = "#ef4444"; }
    else if (pH <= 4) { colorName = "Orange"; colorHi = "नारंगी"; hex = "#f97316"; }
    else if (pH <= 6) { colorName = "Yellow"; colorHi = "पीला"; hex = "#eab308"; }
    else if (pH === 7) { colorName = "Green"; colorHi = "हरा"; hex = "#22c55e"; }
    else if (pH <= 10) { colorName = "Blue"; colorHi = "नीला"; hex = "#3b82f6"; }
    else { colorName = "Violet"; colorHi = "बैंगनी"; hex = "#8b5cf6"; }
  } else if (indicator === 1) {
    if (pH < 7) { colorName = "Red"; colorHi = "लाल"; hex = "#ef4444"; }
    else if (pH === 7) { colorName = "Purple"; colorHi = "बैंगनी"; hex = "#a855f7"; }
    else { colorName = "Blue"; colorHi = "नीला"; hex = "#3b82f6"; }
  } else if (indicator === 2) {
    if (pH <= 8) { colorName = "Colourless"; colorHi = "रंगहीन"; hex = "#94a3b8"; }
    else { colorName = "Pink / Magenta"; colorHi = "गुलाबी"; hex = "#ec4899"; }
  } else {
    if (pH <= 7) { colorName = "Yellow"; colorHi = "पीला"; hex = "#facc15"; }
    else { colorName = "Reddish-brown"; colorHi = "लाल-भूरा"; hex = "#b45309"; }
  }
  const ind = PH_INDICATORS[indicator] || PH_INDICATORS[0];
  return { pH, indicator, indName: ind.name, indHi: ind.hi, nature, natureHi, strength, colorName, colorHi, hex, hExp: -pH, ohExp: -(14 - pH) };
}

/* ============ Class IX · Ch 6 · Structure of the Atom (Bohr Z = 1..20) ============ */
export const ELEMENTS_20 = [
  null,
  ["H", "Hydrogen", "हाइड्रोजन", 0], ["He", "Helium", "हीलियम", 2], ["Li", "Lithium", "लिथियम", 4], ["Be", "Beryllium", "बेरिलियम", 5],
  ["B", "Boron", "बोरॉन", 6], ["C", "Carbon", "कार्बन", 6], ["N", "Nitrogen", "नाइट्रोजन", 7], ["O", "Oxygen", "ऑक्सीजन", 8],
  ["F", "Fluorine", "फ्लोरीन", 10], ["Ne", "Neon", "निऑन", 10], ["Na", "Sodium", "सोडियम", 12], ["Mg", "Magnesium", "मैग्नीशियम", 12],
  ["Al", "Aluminium", "ऐलुमिनियम", 14], ["Si", "Silicon", "सिलिकॉन", 14], ["P", "Phosphorus", "फॉस्फोरस", 16], ["S", "Sulphur", "सल्फर", 16],
  ["Cl", "Chlorine", "क्लोरीन", 18], ["Ar", "Argon", "आर्गन", 22], ["K", "Potassium", "पोटैशियम", 20], ["Ca", "Calcium", "कैल्शियम", 20]
];
export function atomModel({ Z = 6, iso = 0 }) {
  const z = Math.min(20, Math.max(1, Math.round(Z)));
  const el = ELEMENTS_20[z];
  const neutrons = el[3] + iso;
  const A = z + neutrons;
  const K = Math.min(2, z);
  const L = Math.min(8, Math.max(0, z - 2));
  const M = Math.min(8, Math.max(0, z - 10));
  const N = Math.max(0, z - 18);
  const shells = [K, L, M, N].filter(x => x > 0);
  const valence = shells[shells.length - 1];
  const valency = z === 2 ? 0 : (valence <= 4 ? valence : 8 - valence);
  const noble = z === 2 || z === 10 || z === 18;
  const kind = noble ? "Noble Gas (Inert)" : (valency === 0 ? "Inert" : valence <= 3 && z !== 1 && z !== 5 ? "Metal (loses e⁻)" : "Non-metal / Metalloid");
  return { Z: z, symbol: el[0], name: el[1], hi: el[2], protons: z, electrons: z, neutrons, A, shells, config: shells.join(", "), valence, valency, noble, kind, iso };
}

/* ============ Class IX · Ch 5 · Matter, States & Solutions ============ */
export const MIXTURE_TYPES = [
  { id: "pure", name: "Pure Water", hi: "शुद्ध जल", tyndall: false, settles: false, size: "< 0.3 nm" },
  { id: "true", name: "True Solution (Salt)", hi: "वास्तविक विलयन (नमक)", tyndall: false, settles: false, size: "< 1 nm" },
  { id: "colloid", name: "Colloid (Milk/Starch)", hi: "कोलॉइड (दूध/स्टार्च)", tyndall: true, settles: false, size: "1–1000 nm" },
  { id: "suspension", name: "Suspension (Chalk)", hi: "निलंबन (चॉक)", tyndall: true, settles: true, size: "> 1000 nm" }
];
export function matterModel({ temp = 25, mix = 2, conc = 20 }) {
  const state = temp < 0 ? "Solid (Ice)" : temp >= 100 ? "Gas (Steam)" : "Liquid (Water)";
  const stateHi = temp < 0 ? "ठोस (बर्फ)" : temp >= 100 ? "गैस (भाप)" : "द्रव (जल)";
  const Tkelvin = +(temp + 273.15).toFixed(2);
  const M = MIXTURE_TYPES[mix] || MIXTURE_TYPES[2];
  const massPct = +((100 * conc) / (100 + conc)).toFixed(1);
  return { temp, Tkelvin, state, stateHi, mix, mixName: M.name, mixHi: M.hi, tyndall: M.tyndall, settles: M.settles, size: M.size, conc, massPct };
}

/* ============ Class X · Ch 5 · Heart & Double Circulation ============ */
export function heartModel({ bpm = 70, sv = 70, loop = 0 }) {
  const CO = +((bpm * sv) / 1000).toFixed(2); // L/min
  const period = +(60 / bpm).toFixed(2);      // s per beat
  const loopName = loop === 1 ? "Pulmonary (Heart → Lungs → Heart)" : loop === 2 ? "Systemic (Heart → Body → Heart)" : "Double Circulation (Both Loops)";
  return { bpm, sv, loop, loopName, CO, period };
}

/* ============ Class X · Ch 8 · Heredity & Mendel Cross ============ */
const GENOS = ["TT", "Tt", "tt"];
export function geneticsModel({ p1 = 1, p2 = 1, cross = 0 }) {
  if (cross === 1) {
    /* Sex determination: XX × XY */
    return {
      cross, g1: "XX (Mother)", g2: "XY (Father)",
      cells: ["XX", "XY", "XX", "XY"],
      tallPct: 50, dwarfPct: 50,
      ratioText: "50% XX (Girl) : 50% XY (Boy)"
    };
  }
  const a1 = GENOS[p1] || "Tt", a2 = GENOS[p2] || "Tt";
  const cells = [];
  let tt = 0, Tt = 0, TT = 0;
  for (const x of a1) {
    for (const y of a2) {
      const g = [x, y].sort().join(""); // "TT", "Tt", "tt" ("T" < "t" in ASCII)
      cells.push(g);
      if (g === "TT") TT++; else if (g === "Tt") Tt++; else tt++;
    }
  }
  const tall = TT + Tt;
  return {
    cross, g1: a1, g2: a2, cells, TT, Tt, tt,
    tallPct: Math.round((tall / 4) * 100),
    dwarfPct: Math.round((tt / 4) * 100),
    ratioText: `${TT} TT : ${Tt} Tt : ${tt} tt (${tall} Tall : ${tt} Dwarf)`
  };
}

/* ============ Class X · Ch 9 · Snell's Law & Glass Slab Lateral Shift ============ */
export function slabModel({ angleI = 40, n = 1.5, thickness = 4 }) {
  const radI = (angleI * Math.PI) / 180;
  const sinR = Math.sin(radI) / n;
  const radR = Math.asin(Math.min(1, sinR));
  const angleR = +((radR * 180) / Math.PI).toFixed(1);
  const lateralShift = +(thickness * Math.sin(radI - radR) / Math.cos(radR)).toFixed(2);
  const criticalAngle = n > 1 ? +((Math.asin(1 / n) * 180) / Math.PI).toFixed(1) : 90;
  return { angleI, n, thickness, angleR, lateralShift, criticalAngle };
}

/* ============ Class X · Ch 1 & Ch 3 · Chemical Reactions & Reactivity Series ============ */
export const REACTION_TYPES = [
  { id: "comb", name: "Combination (Mg + O₂)", hi: "संयोजन अभिक्रिया", eq: "2Mg + O₂ → 2MgO (White ash)", exo: true, obs: "Dazzling white flame + MgO powder" },
  { id: "decomp", name: "Thermal Decomp (Pb(NO₃)₂)", hi: "ऊष्मीय वियोजन", eq: "2Pb(NO₃)₂ → 2PbO + 4NO₂↑ + O₂↑", exo: false, obs: "Brown NO₂ fumes + yellow PbO" },
  { id: "disp", name: "Displacement (Fe + CuSO₄)", hi: "विस्थापन अभिक्रिया", eq: "Fe + CuSO₄(blue) → FeSO₄(green) + Cu↓", exo: true, obs: "Blue turns pale green + brown Cu coats nail" },
  { id: "ddisp", name: "Double Disp (BaCl₂ + Na₂SO₄)", hi: "द्विविस्थापन", eq: "Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl", exo: false, obs: "Instant white BaSO₄ precipitate" },
  { id: "redox", name: "Redox (CuO + H₂)", hi: "रेडॉक्स अभिक्रिया", eq: "CuO(black) + H₂ → Cu(brown) + H₂O", exo: false, obs: "CuO reduced to Cu; H₂ oxidised to H₂O" },
  { id: "ionic", name: "Ionic Bond (Na + Cl)", hi: "आयनिक बंधन", eq: "Na(2,8,1) + Cl(2,8,7) → Na⁺Cl⁻", exo: true, obs: "Electron transfer forms crystal lattice" }
];
export function reactionModel({ rxn = 2, progress = 100, temp = 30 }) {
  const R = REACTION_TYPES[rxn] || REACTION_TYPES[2];
  const rate = +(0.5 + (temp - 20) * 0.025).toFixed(2);
  const done = progress >= 85;
  return { rxn, ...R, progress, temp, rate, done };
}

/* ============ Class IX Ch 7 & Class X Ch 4 · Molecules, Carbon Allotropes & Conservation ============ */
export const MOLECULES_LIST = [
  { id: "h2o", formula: "H₂O", name: "Water", hi: "जल", mass: 18, geom: "Bent (104.5°)", atoms: { H: 2, O: 1 }, bond: "Polar Covalent" },
  { id: "ch4", formula: "CH₄", name: "Methane", hi: "मीथेन", mass: 16, geom: "Tetrahedral (109.5°)", atoms: { C: 1, H: 4 }, bond: "Covalent (Alkane)" },
  { id: "co2", formula: "CO₂", name: "Carbon Dioxide", hi: "कार्बन डाइऑक्साइड", mass: 44, geom: "Linear (180°)", atoms: { C: 1, O: 2 }, bond: "Double Covalent" },
  { id: "ethanol", formula: "C₂H₅OH", name: "Ethanol", hi: "एथेनॉल", mass: 46, geom: "Alcohol (-OH group)", atoms: { C: 2, H: 6, O: 1 }, bond: "Covalent" },
  { id: "nacl", formula: "NaCl", name: "Ionic Lattice", hi: "आयनिक क्रिस्टल", mass: 58.5, geom: "Cubic 3D Lattice", atoms: { Na: 1, Cl: 1 }, bond: "Ionic (Electrovalent)" },
  { id: "diamond", formula: "C (Diamond)", name: "Diamond Allotrope", hi: "हीरा (चतुष्फलकीय)", mass: 12, geom: "3D Rigid Tetrahedral", atoms: { C: 5 }, bond: "4 C–C bonds (Hardest)" },
  { id: "graphite", formula: "C (Graphite)", name: "Graphite Allotrope", hi: "ग्रेफाइट (षट्कोणीय)", mass: 12, geom: "Hexagonal Layered Sheets", atoms: { C: 6 }, bond: "Free e⁻ (Conducts!)" },
  { id: "micelle", formula: "Soap Micelle", name: "Soap Micelle", hi: "साबुन मिसेल", mass: 306, geom: "Hydrophobic tail + Ionic head", atoms: { C: 17, H: 35 }, bond: "Emulsifies oil/dirt" }
];
export function moleculeModel({ mol = 1, count = 2 }) {
  const M = MOLECULES_LIST[mol] || MOLECULES_LIST[1];
  const atomPerUnit = Object.values(M.atoms).reduce((a, b) => a + b, 0);
  return { mol, ...M, count, atomPerUnit, totalAtoms: atomPerUnit * count, totalMass: +(M.mass * count).toFixed(1) };
}

/* ============ Class X Ch 5 & Class IX Ch 2 · Organs, Digestion, Alveoli, Nephron & Joints ============ */
export const ORGAN_MODES = [
  { id: "digest", name: "Digestive System", hi: "पाचन तंत्र", keyFact: "Mouth (Amylase) → Stomach (Pepsin+HCl) → Small Intestine (Villi absorb)" },
  { id: "alveoli", name: "Alveoli Gas Exchange", hi: "कूपिका गैस विनिमय", keyFact: "O₂ diffuses into Hb (RBC); CO₂ diffuses out to alveoli (~80 m² surface)" },
  { id: "nephron", name: "Nephron & Dialysis", hi: "नेफ्रॉन व डायलिसिस", keyFact: "Bowman's Capsule ultrafiltration + PCT selective glucose/water reabsorption" },
  { id: "joint", name: "Synovial Joints", hi: "श्लेषक संधि (जोड़)", keyFact: "Ball & Socket (360° shoulder/hip) vs Hinge (180° knee/elbow)" }
];
export function organModel({ mode = 0, explode = 0, rate = 2 }) {
  const O = ORGAN_MODES[mode] || ORGAN_MODES[0];
  const filtrationMlMin = +(60 * rate).toFixed(0);
  const o2SatPct = Math.min(99, Math.round(88 + rate * 2.5));
  return { mode, ...O, explode, rate, filtrationMlMin, o2SatPct };
}

/* ============ Class X Ch 6 · Control & Coordination (Neuron, Reflex, Brain, Tropism) ============ */
export const NERVOUS_MODES = [
  { id: "neuron", name: "Neuron & Synapse", hi: "न्यूरॉन व सिनेप्स", pathway: "Dendrite → Cell Body → Axon → Nerve Ending (Neurotransmitter)" },
  { id: "reflex", name: "Reflex Arc", hi: "प्रतिवर्ती चाप", pathway: "Hot Pan → Receptor → Sensory → Spinal Cord → Motor → Muscle" },
  { id: "brain", name: "Human Brain Lobes", hi: "मानव मस्तिष्क", pathway: "Forebrain (Thinking) · Midbrain · Hindbrain (Cerebellum+Medulla)" },
  { id: "tropism", name: "Plant Phototropism", hi: "प्रकाशानुवर्तन (ऑक्सिन)", pathway: "Auxin moves to shaded side → cells elongate → stem bends toward light" }
];
export function nervousModel({ mode = 0, stim = 60 }) {
  const N = NERVOUS_MODES[mode] || NERVOUS_MODES[0];
  const impulseSpeed = mode === 1 ? 100 : 80; // m/s myelinated
  const fires = stim >= 30;
  const reflexMs = fires ? Math.max(25, Math.round(110 - stim * 0.6)) : 0;
  return { mode, ...N, stim, fires, impulseSpeed, reflexMs };
}

/* ============ Class X Ch 7 & Class IX Ch 3 · Reproduction & Dispersal ============ */
export const REPRO_MODES = [
  { id: "flower", name: "Flower Pollination", hi: "पुष्प परागण व निषेचन", summary: "Pollen on Stigma → Pollen Tube → Double Fertilisation in Ovule → Seed/Fruit" },
  { id: "fission", name: "Binary Fission (Amoeba)", hi: "द्विखंडन (अमीबा)", summary: "Nucleus divides first (karyokinesis) → Cytoplasm splits → 2 identical clones" },
  { id: "budding", name: "Budding (Hydra / Yeast)", hi: "मुकुलन (हाइड्रा)", summary: "Regenerative cells form a bud → grows → detaches as new organism" },
  { id: "dispersal", name: "Seed Dispersal & Vegetative", hi: "बीज प्रकीर्णन व कायिक", summary: "Wind (wings), Water (coconut), Animals (hooks), Explosion (balsam)" }
];
export function reproModel({ mode = 0, step = 2 }) {
  const R = REPRO_MODES[mode] || REPRO_MODES[0];
  const generations = Math.max(1, step);
  const clones = mode === 1 ? Math.pow(2, generations) : generations + 1;
  return { mode, ...R, step, generations, clones };
}

/* ============ Class IX Ch 8 · Earth Systems, Breeze Convection, Greenhouse & Cycles ============ */
export const CLIMATE_MODES = [
  { id: "breeze", name: "Land & Sea Breeze (Convection)", hi: "समुद्री व स्थलीय समीर", summary: "Day: Land heats faster → warm air rises → cool Sea Breeze blows toward land" },
  { id: "greenhouse", name: "Greenhouse & Atmosphere", hi: "ग्रीनहाउस प्रभाव", summary: "CO₂ & CH₄ trap outgoing IR heat; Troposphere weather, Stratosphere O₃" },
  { id: "spectrum", name: "EM Spectrum & Solar Energy", hi: "विद्युत-चुंबकीय स्पेक्ट्रम", summary: "Gamma < X-ray < UV < Visible (400–700 nm) < IR < Microwave < Radio" },
  { id: "cycles", name: "Water, Carbon & Nitrogen Cycles", hi: "जैव-भूरासायनिक चक्र", summary: "Rhizobium fixes N₂ → nitrates; photosynthesis fixes CO₂; transpiration cycles H₂O" }
];
export function climateModel({ mode = 0, sun = 70, co2 = 420 }) {
  const C = CLIMATE_MODES[mode] || CLIMATE_MODES[0];
  const landTemp = +(15 + sun * 0.25 + (co2 - 280) * 0.008).toFixed(1);
  const seaTemp = +(18 + sun * 0.08).toFixed(1);
  const breezeDir = landTemp >= seaTemp ? "Sea → Land (Sea Breeze)" : "Land → Sea (Land Breeze)";
  return { mode, ...C, sun, co2, landTemp, seaTemp, breezeDir };
}

/* ============ Class X Ch 13 & Class IX Ch 4 · Ecology, 10% Law, Ozone & 5 Kingdoms ============ */
export function ecologyModel({ producerE = 10000, ddt = 2, ozonePct = 95 }) {
  const t1 = producerE;
  const t2 = +(t1 * 0.1).toFixed(1);
  const t3 = +(t2 * 0.1).toFixed(1);
  const t4 = +(t3 * 0.1).toFixed(2);
  const hawkDDT = +(ddt * 1000).toFixed(0); // biomagnification ~1000x
  const uvBlockPct = ozonePct;
  return { producerE, t1, t2, t3, t4, ddt, hawkDDT, ozonePct, uvBlockPct };
}

/* ============ small shared helpers ============ */
export const fmt = (x, d = 2) => !Number.isFinite(x) ? "∞" : (Math.abs(x) >= 1000 ? x.toFixed(0) : +x.toFixed(d)).toString();

