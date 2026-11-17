/* Curiosity Lab — lab kit (ES module): everything the four labs share.
   Three.js stage with a small orbit camera, slider panel, live-facts panel, text sprites and 2D-canvas drawing helpers. */
import { fmt } from "./models.js";

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export { esc, fmt };
export const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

let threeP = null;
/** Three.js is fetched once, on the first lab that needs it. */
export const loadThree = () => threeP || (threeP = import("../../vendor/three.module.min.js"));

/* ---------------------------------------------------------------- stage */
/** Creates renderer + scene + camera inside ctx.stage. Returns { THREE, scene, camera, renderer, onFrame, dispose, resize, setView }. */
export function makeStage(THREE, ctx, { pos = [0, 4, 11], target = [0, 0, 0], fov = 42, bg = 0x0b1424, minDist = 3, maxDist = 30 } = {}) {
  const host = ctx.stage;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("role", "img"); canvas.setAttribute("aria-label", `3D view: ${ctx.lab.title.en}`);
  host.appendChild(canvas);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: false }); }
  catch (e) { host.replaceChildren(el("p", "cl-empty", "3D graphics are not available on this device. · इस डिवाइस पर 3D उपलब्ध नहीं है।")); throw e; }
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setClearColor(bg, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 200);
  const tgt = new THREE.Vector3(...target), sph = new THREE.Spherical().setFromVector3(new THREE.Vector3(...pos).sub(tgt));
  const goal = sph.clone(), home = sph.clone(), frameFns = new Set();
  let dispose_ = false, raf = 0, last = performance.now();

  const place = () => { camera.position.setFromSpherical(sph).add(tgt); camera.lookAt(tgt); };
  const resize = () => {
    const w = Math.max(10, host.clientWidth), h = Math.max(10, host.clientHeight);
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  /* orbit: drag = rotate, wheel / pinch = zoom (no OrbitControls import: avoids the importmap and keeps the lab self-contained) */
  const ptrs = new Map(); let pinch = 0;
  const down = e => { canvas.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]); if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); } };
  const move = e => {
    const p = ptrs.get(e.pointerId); if (!p) return;
    if (ptrs.size === 1) { goal.theta -= (e.clientX - p[0]) * 0.006; goal.phi = Math.min(Math.PI - 0.12, Math.max(0.12, goal.phi - (e.clientY - p[1]) * 0.006)); }
    ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch) goal.radius = Math.min(maxDist, Math.max(minDist, goal.radius * (pinch / d))); pinch = d; }
  };
  const up = e => { ptrs.delete(e.pointerId); pinch = 0; };
  const wheel = e => { e.preventDefault(); goal.radius = Math.min(maxDist, Math.max(minDist, goal.radius * Math.exp(e.deltaY * 0.001))); };
  canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up); canvas.addEventListener("wheel", wheel, { passive: false });
  const ro = new ResizeObserver(resize); ro.observe(host);

  const loop = now => {
    if (dispose_) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (document.hidden || host.offsetParent === null) return;       // nothing to draw while the tab / lab is hidden
    sph.theta += (goal.theta - sph.theta) * Math.min(1, dt * 9); sph.phi += (goal.phi - sph.phi) * Math.min(1, dt * 9); sph.radius += (goal.radius - sph.radius) * Math.min(1, dt * 9);
    place();
    frameFns.forEach(fn => fn(dt, now / 1000));
    renderer.render(scene, camera);
  };
  place(); resize(); raf = requestAnimationFrame(loop);

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const sun = new THREE.DirectionalLight(0xffffff, 1.5); sun.position.set(6, 10, 8); scene.add(sun);

  return {
    THREE, scene, camera, renderer, canvas,
    onFrame(fn) { frameFns.add(fn); return () => frameFns.delete(fn); },
    resize,
    /** Moves the point the camera looks at (the camera keeps its orbit around it). */
    target(x, y, z) { tgt.set(x, y, z); },
    setView(p, t) { if (t) tgt.set(...t); goal.copy(new THREE.Spherical().setFromVector3(new THREE.Vector3(...p).sub(tgt))); },
    resetView() { goal.copy(home); },
    dispose() {
      dispose_ = true; cancelAnimationFrame(raf); ro.disconnect(); frameFns.clear();
      canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up); canvas.removeEventListener("wheel", wheel);
      scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); }); });
      renderer.dispose(); if (renderer.forceContextLoss) renderer.forceContextLoss(); canvas.remove();
    }
  };
}

/** A canvas-texture sprite with bilingual text. */
export function labelSprite(THREE, en, hi, { color = "#ffffff", bg = "rgba(8,16,32,.82)", scale = 1, size = 34 } = {}) {
  const c = document.createElement("canvas"), g = c.getContext("2d"), f1 = `700 ${size}px system-ui, sans-serif`, f2 = `600 ${Math.round(size * 0.8)}px "Noto Sans Devanagari", system-ui, sans-serif`;
  g.font = f1; const w1 = g.measureText(en).width; g.font = f2; const w2 = hi ? g.measureText(hi).width : 0;
  const W = Math.ceil(Math.max(w1, w2) + 34), H = Math.ceil(size * (hi ? 2.15 : 1.35) + 14);
  c.width = W; c.height = H;
  g.fillStyle = bg; g.beginPath(); g.roundRect ? g.roundRect(2, 2, W - 4, H - 4, 14) : g.rect(2, 2, W - 4, H - 4); g.fill();
  g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = color; g.font = f1; g.fillText(en, W / 2, hi ? H * 0.34 : H / 2);
  if (hi) { g.fillStyle = "#ffcf80"; g.font = f2; g.fillText(hi, W / 2, H * 0.72); }
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  sp.scale.set((W / 100) * scale * 0.72, (H / 100) * scale * 0.72, 1); sp.renderOrder = 10; return sp;
}

/** Thick line between points (flat array of Vector3 / [x,y,z]) using a tube; cheap enough for a handful of rays. */
export function tube(THREE, pts, color, radius = 0.025, { dashed = false, opacity = 1 } = {}) {
  const vs = pts.map(p => new THREE.Vector3(...p));
  if (!dashed) {
    const curve = new THREE.CatmullRomCurve3(vs, false, "catmullrom", 0);
    const g = new THREE.TubeGeometry(curve, Math.max(2, vs.length * 2), radius, 6, false);
    return new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity }));
  }
  const grp = new THREE.Group(); const a = vs[0], b = vs[vs.length - 1], len = a.distanceTo(b), n = Math.max(1, Math.floor(len / 0.32));
  for (let i = 0; i < n; i++) { const s = new THREE.Vector3().lerpVectors(a, b, (i + 0.12) / n), e = new THREE.Vector3().lerpVectors(a, b, (i + 0.62) / n); grp.add(tube(THREE, [[s.x, s.y, s.z], [e.x, e.y, e.z]], color, radius, { opacity })); }
  return grp;
}
export function disposeObject(o) { o.traverse(c => { if (c.geometry) c.geometry.dispose(); if (c.material) [].concat(c.material).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); }); }); }

/* ---------------------------------------------------------------- side panel */
/** Slider panel for every variable of the lab. Returns { root, sync() }. `skip` = variable ids the lab draws itself. */
export function sliders(ctx, host, { skip = [], title = null } = {}) {
  const wrap = el("div", "cl-sliders");
  if (title) wrap.appendChild(el("h3", "cl-h", title));
  const rows = {};
  ctx.lab.vars.forEach(v => {
    if (skip.includes(v.id)) return;
    const id = `clv-${ctx.lab.id}-${v.id}`, row = el("div", "cl-row"); row.dataset.var = v.id;
    row.innerHTML = `<label for="${id}"><b>${esc(v.label.en)}</b> <span class="hi" lang="hi">${esc(v.label.hi)}</span></label>
      <div class="cl-ctl"><button type="button" class="cl-step" data-d="-1" aria-label="Decrease ${esc(v.label.en)}">−</button>
      <input id="${id}" type="range" min="${v.min}" max="${v.max}" step="${v.step}" value="${ctx.vars[v.id]}" aria-valuetext="">
      <button type="button" class="cl-step" data-d="1" aria-label="Increase ${esc(v.label.en)}">+</button>
      <output for="${id}"></output></div>`;
    const inp = row.querySelector("input"), out = row.querySelector("output");
    const paint = () => { const x = ctx.vars[v.id]; inp.value = x; out.textContent = `${fmt(x, 2)} ${v.unit}`.trim(); inp.setAttribute("aria-valuetext", out.textContent); inp.style.setProperty("--p", ((x - v.min) / (v.max - v.min)) * 100 + "%"); };
    inp.addEventListener("input", () => { ctx.set(v.id, +inp.value); paint(); });
    row.querySelectorAll(".cl-step").forEach(b => b.addEventListener("click", () => { ctx.set(v.id, ctx.vars[v.id] + (+b.dataset.d) * v.step); paint(); }));
    rows[v.id] = paint; paint(); wrap.appendChild(row);
  });
  host.appendChild(wrap);
  return { root: wrap, sync() { Object.values(rows).forEach(f => f()); } };
}

/** Live facts list: shows ctx.facts (derived by lab.facts) and animates the row that changed. */
export function factsView(ctx, host, title = "What the physics says · अभी क्या हो रहा है") {
  const box = el("div", "cl-facts"); box.appendChild(el("h3", "cl-h", esc(title)));
  const list = el("dl", "cl-fl"); list.setAttribute("aria-live", "polite"); box.appendChild(list); host.appendChild(box);
  const prev = {};
  return {
    root: box,
    update() {
      const fs = ctx.facts; list.replaceChildren();
      fs.forEach(f => {
        const dt = el("dt", null, `${esc(f.en)} <span class="hi" lang="hi">${esc(f.hi)}</span>`), dd = el("dd", null, esc(f.value));
        if (prev[f.id] !== undefined && prev[f.id] !== f.value) dd.classList.add("pop");
        prev[f.id] = f.value; list.append(dt, dd);
      });
    }
  };
}

export const note = (host, en, hi) => host.appendChild(el("p", "cl-note", `${esc(en)}<br><span class="hi" lang="hi">${esc(hi)}</span>`));
export function actionButton(host, html, onClick, cls = "cl-act") { const b = el("button", cls, html); b.type = "button"; b.addEventListener("click", onClick); host.appendChild(b); return b; }

/* ---------------------------------------------------------------- 2D drawing helpers (snapshots + side graphs) */
export const C2 = {
  prep(canvas, w = 640, h = 360, bg = "#0b1424") { canvas.width = w; canvas.height = h; const g = canvas.getContext("2d"); g.fillStyle = bg; g.fillRect(0, 0, w, h); g.lineCap = "round"; g.lineJoin = "round"; return g; },
  line(g, pts, color = "#fff", w = 2, dash = null) { g.save(); g.strokeStyle = color; g.lineWidth = w; if (dash) g.setLineDash(dash); g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); g.restore(); },
  arrow(g, x0, y0, x1, y1, color = "#fff", w = 3, head = 10) {
    const a = Math.atan2(y1 - y0, x1 - x0); C2.line(g, [[x0, y0], [x1, y1]], color, w);
    g.save(); g.fillStyle = color; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x1 - head * Math.cos(a - 0.4), y1 - head * Math.sin(a - 0.4)); g.lineTo(x1 - head * Math.cos(a + 0.4), y1 - head * Math.sin(a + 0.4)); g.closePath(); g.fill(); g.restore();
  },
  text(g, s, x, y, { color = "#fff", size = 15, align = "center", weight = 700 } = {}) { g.save(); g.fillStyle = color; g.font = `${weight} ${size}px system-ui, "Noto Sans Devanagari", sans-serif`; g.textAlign = align; g.textBaseline = "middle"; g.fillText(s, x, y); g.restore(); },
  circle(g, x, y, r, { stroke = "#fff", fill = null, w = 2 } = {}) { g.save(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = w; g.stroke(); } g.restore(); },
  rect(g, x, y, w, h, { stroke = "#fff", fill = null, lw = 2, r = 0 } = {}) { g.save(); g.beginPath(); if (r && g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } g.restore(); }
};

/* ---------------------------------------------------------------- question helpers */
/** Deterministic random numbers (xorshift32) so a question set can be reproduced from a seed. */
export function rng(seed) { let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
export const shuffle = (a, rnd) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/** A value of variable `id` the student has actually seen (falls back to the current one). */
export const seen = (q, id) => { const l = q.explored && q.explored[id]; return l && l.length ? l[Math.floor(q.rnd() * l.length)] : q.vars[id]; };
/** Builds a question object. options = [[en, hi], …]; correct = index of the right option. */
export function ask({ id, kind = "name", prompt, image = null, options, correct, why, meta = null }) {
  return { id, kind, prompt: { en: prompt[0], hi: prompt[1] }, image, options: options.map((o, i) => ({ id: "o" + i, en: o[0], hi: o[1] })), answer: "o" + correct, why: { en: why[0], hi: why[1] }, meta };
}
/** Picks `n` distractors from a pool (never the correct one), then puts the correct option at a random place. Returns { options, correct }. */
export function withDistractors(correct, pool, n, rnd) {
  const key = o => o[0], bad = shuffle(pool.filter(o => key(o) !== key(correct)), rnd).slice(0, n);
  const all = shuffle([correct, ...bad], rnd); return { options: all, correct: all.findIndex(o => key(o) === key(correct)) };
}
