/* Curiosity Lab — "dopamine" effects toolkit (ES module, no dependencies, works offline).
   Canvas confetti & fireworks, floating glowing text, CSS shake, screen flash, haptics (navigator.vibrate) and optional WebAudio sounds.
   Everything respects prefers-reduced-motion: motion effects are skipped, colour / glow feedback stays. */

const LS = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } } };
export const reduced = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

const PAL = ["#ff4d6d", "#ffd23f", "#46e08a", "#4cc9f0", "#a78bfa", "#ff9f1c", "#ffffff"];
let host = null, cv = null, g = null, parts = [], raf = 0, last = 0;

/** Where the effects are drawn (the overlay's #clFx layer). */
export function mount(el) { host = el; }
const bump = key => { if (host) host.dataset[key] = String((+host.dataset[key] || 0) + 1); };

function ensure() {
  if (!host) return false;
  if (!cv) { cv = document.createElement("canvas"); cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block"; host.appendChild(cv); g = cv.getContext("2d"); }
  const dpr = Math.min(2, window.devicePixelRatio || 1), w = host.clientWidth, h = host.clientHeight;
  if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  return true;
}

function tick(now) {
  const dt = Math.min(0.04, (now - last) / 1000) * 60; last = now;
  const w = host.clientWidth, h = host.clientHeight;
  g.clearRect(0, 0, w, h);
  parts = parts.filter(p => p.life > 0 && p.y < h + 40);
  for (const p of parts) {
    p.vx *= Math.pow(p.drag, dt); p.vy = p.vy * Math.pow(p.drag, dt) + p.gravity * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.wob += 0.15 * dt; p.life -= dt;
    const a = Math.max(0, Math.min(1, p.life / 28));
    g.save(); g.globalAlpha = a; g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = p.color;
    if (p.shape === "circle") { g.beginPath(); g.arc(0, 0, p.s * 0.55, 0, 7); g.fill(); }
    else if (p.shape === "star") { g.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? p.s * 0.3 : p.s * 0.8, an = (i * Math.PI) / 5; g.lineTo(Math.cos(an) * r, Math.sin(an) * r); } g.closePath(); g.fill(); }
    else g.fillRect(-p.s / 2, (-p.s / 4) * (0.6 + 0.4 * Math.sin(p.wob)), p.s, (p.s / 2) * (0.6 + 0.4 * Math.sin(p.wob)));
    g.restore();
  }
  if (parts.length) raf = requestAnimationFrame(tick); else { raf = 0; g.clearRect(0, 0, w, h); }
}

/** Confetti burst. x, y in px inside the overlay; angle in degrees (-90 = up); spread in degrees. */
export function confetti({ x, y, count = 80, spread = 70, angle = -90, power = 13, colors = PAL, gravity = 0.34, life = 90, shapes = ["rect", "rect", "circle", "star"] } = {}) {
  if (!ensure()) return;
  if (reduced()) { bump("fxSkipped"); return; }
  const w = host.clientWidth, h = host.clientHeight; x = x ?? w / 2; y = y ?? h / 2;
  for (let i = 0; i < count; i++) {
    const a = ((angle + (Math.random() - 0.5) * spread) * Math.PI) / 180, v = power * (0.45 + Math.random() * 0.75);
    parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4, s: 6 + Math.random() * 8, color: colors[(Math.random() * colors.length) | 0], shape: shapes[(Math.random() * shapes.length) | 0], life: life * (0.7 + Math.random() * 0.6), gravity, drag: 0.985, wob: Math.random() * 6 });
  }
  host.dataset.fxSpawned = String((+host.dataset.fxSpawned || 0) + count);
  if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
}
/** Confetti from the centre of a DOM element. */
export function burstFrom(el, opts = {}) { const r = el.getBoundingClientRect(), h = host ? host.getBoundingClientRect() : { left: 0, top: 0 }; confetti({ x: r.left - h.left + r.width / 2, y: r.top - h.top + r.height / 2, ...opts }); }
/** Rockets of confetti from the bottom corners — the "round complete / level up" party. */
export function fireworks(bursts = 6) {
  if (!host) return; if (reduced()) { bump("fxSkipped"); return; }
  const w = host.clientWidth, h = host.clientHeight;
  for (let i = 0; i < bursts; i++) setTimeout(() => { if (!host) return; confetti({ x: w * (0.15 + Math.random() * 0.7), y: h * (0.22 + Math.random() * 0.3), count: 70, spread: 360, angle: 0, power: 9, gravity: 0.22, life: 80, shapes: ["circle", "star", "star"] }); }, i * 260);
}
/** Confetti falling from the whole top edge (perfect round). */
export function rain(count = 160) {
  if (!ensure()) return; if (reduced()) { bump("fxSkipped"); return; }
  const w = host.clientWidth; for (let i = 0; i < count; i++) confetti({ x: Math.random() * w, y: -10 - Math.random() * 80, count: 1, spread: 40, angle: 90, power: 3, gravity: 0.16, life: 170 });
}
export function stopAll() { parts = []; if (raf) cancelAnimationFrame(raf); raf = 0; if (g && cv) g.clearRect(0, 0, cv.width, cv.height); }

/** A short glowing text that floats up and fades ("+12 XP", "Perfect!"). */
export function floatText(x, y, text, { color = "#ffe066", size = 28, ms = 1200, glow = true } = {}) {
  if (!host) return null;
  const e = document.createElement("div"); e.className = "cl-float"; e.textContent = text;
  e.style.cssText = `left:${x}px;top:${y}px;font-size:${size}px;color:${color};${glow ? `text-shadow:0 0 8px ${color},0 0 22px ${color};` : ""}animation-duration:${ms}ms`;
  host.appendChild(e); setTimeout(() => e.remove(), ms + 80); bump("fxFloats"); return e;
}
export function floatFrom(el, text, opts = {}) { const r = el.getBoundingClientRect(), h = host ? host.getBoundingClientRect() : { left: 0, top: 0 }; return floatText(r.left - h.left + r.width / 2, r.top - h.top, text, opts); }

/** CSS haptic shake (the element gets .cl-shake for 0.55 s). */
export function shake(el) { if (reduced()) { bump("fxSkipped"); return; } el.classList.remove("cl-shake"); void el.offsetWidth; el.classList.add("cl-shake"); setTimeout(() => el.classList.remove("cl-shake"), 600); bump("fxShakes"); }
/** Full-screen colour flash (red for wrong, gold for level-up). */
export function flash(color = "rgba(255,60,60,.35)") {
  if (!host) return; const e = document.createElement("div"); e.className = "cl-flash"; e.style.background = `radial-gradient(circle at 50% 50%, transparent 35%, ${color} 100%)`;
  host.appendChild(e); setTimeout(() => e.remove(), 650);
}
/** Real vibration on phones that support it. */
export function vibrate(pattern) { try { if (navigator.vibrate) { navigator.vibrate(pattern); if (host) host.dataset.fxVibrations = String((+host.dataset.fxVibrations || 0) + 1); } } catch { /* unsupported */ } }

/** Rolls a number up (used for XP). */
export function countUp(el, to, ms = 600) {
  const from = +el.textContent || 0; if (reduced() || from === to) { el.textContent = to; return; }
  const t0 = performance.now(); const step = now => { const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step);
}

/* ---------- sounds (off by default so a classroom stays quiet) ---------- */
let ac = null;
const tone = (f, t0, d, type = "sine", vol = 0.12) => { const o = ac.createOscillator(), v = ac.createGain(); o.type = type; o.frequency.value = f; v.gain.setValueAtTime(0.0001, ac.currentTime + t0); v.gain.exponentialRampToValueAtTime(vol, ac.currentTime + t0 + 0.02); v.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + t0 + d); o.connect(v).connect(ac.destination); o.start(ac.currentTime + t0); o.stop(ac.currentTime + t0 + d + 0.05); };
export const sound = {
  get on() { return LS.get("va.cl.snd") === "1"; },
  toggle() { const v = !this.on; LS.set("va.cl.snd", v ? "1" : "0"); if (v) this.play("tick"); return v; },
  play(kind) {
    if (!this.on) return; try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === "suspended") ac.resume();
      if (kind === "right") [523, 659, 784].forEach((f, i) => tone(f, i * 0.07, 0.22, "triangle"));
      else if (kind === "wrong") { tone(196, 0, 0.28, "sawtooth", 0.08); tone(147, 0.12, 0.3, "sawtooth", 0.08); }
      else if (kind === "streak") [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.06, 0.25, "triangle", 0.13));
      else if (kind === "level") [392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.09, 0.34, "triangle", 0.14));
      else tone(660, 0, 0.08, "square", 0.05);
    } catch { /* audio blocked: silently ignore */ }
  }
};
