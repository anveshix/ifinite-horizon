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

/* ============ small shared helpers ============ */
export const fmt = (x, d = 2) => !Number.isFinite(x) ? "∞" : (Math.abs(x) >= 1000 ? x.toFixed(0) : +x.toFixed(d)).toString();
