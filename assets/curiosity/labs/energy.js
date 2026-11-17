/* Curiosity Lab · Energy Lab — the pendulum (NCERT Class IX, Ch 11 Work, Energy and Power).
   Student sets the bob's mass and release height, lets it swing, and watches potential energy turn into kinetic energy and back — with the total never changing. */
import { bus } from "../core.js";
import { G, PEND_L, pendulumStart, pendulumEnergy, pendulumStep, fmt } from "./models.js";
import { loadThree, makeStage, labelSprite, tube, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const PIVOT_Y = 3.4, BOTTOM_Y = PIVOT_Y - PEND_L;          // scene units = metres; the bob's lowest point is at BOTTOM_Y
const start = v => pendulumStart({ m: v.m, h: v.h });
const stateAt = (v, where) => {                              // angle/speed of the bob at the top, the bottom or half-way down
  const S = start(v);
  if (where === "top") return { theta: S.theta0, omega: 0 };
  if (where === "bottom") return { theta: 0, omega: -Math.sqrt((2 * G * v.h) / (PEND_L * PEND_L)) };
  const hh = v.h / 2, th = Math.acos(1 - hh / PEND_L); return { theta: th, omega: -Math.sqrt((2 * G * (v.h - hh)) / (PEND_L * PEND_L)) };
};

/* ---------------------------------------------------------------- 2D diagram (quiz) */
function snapshot(canvas, vars, focus) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#0b1424"), at = vars.at || "top", S = start(vars), st = stateAt(vars, at), E = pendulumEnergy(vars.m, st.theta, st.omega);
  const sc = 118, px = 250, py = 36, bx = px + PEND_L * sc * Math.sin(st.theta), by = py + PEND_L * sc * Math.cos(st.theta), low = py + PEND_L * sc;
  C2.rect(g, px - 70, py - 14, 140, 12, { stroke: "#94a3b8", fill: "#475569", lw: 2, r: 3 });
  C2.line(g, [[px, py], [bx, by]], "#e2e8f0", 2.5); C2.circle(g, px, py, 5, { stroke: "#e2e8f0", fill: "#94a3b8", w: 1 });
  g.save(); g.setLineDash([5, 6]); C2.line(g, [[px - 150, low], [px + 150, low]], "#7f93b5", 1.5); g.restore(); C2.text(g, "lowest point (h = 0)", px - 150, low + 16, { size: 13, color: "#9fb3c8", align: "left" });
  const top = py + PEND_L * sc * Math.cos(S.theta0); g.save(); g.setLineDash([5, 6]); C2.line(g, [[px - 150, top], [px + 150, top]], "#ffd23f", 1.5); g.restore();
  C2.arrow(g, px - 120, low, px - 120, top, "#ffd23f", 2.5, 9); C2.text(g, `h = ${vars.h} m`, px - 130, (low + top) / 2, { size: 14, color: "#ffd23f", align: "right" });
  const r = 10 + Math.cbrt(vars.m) * 6; C2.circle(g, bx, by, r, { stroke: "#fff", fill: "#38bdf8", w: 2 }); C2.text(g, `${vars.m} kg`, bx, by + r + 14, { size: 14, color: "#bae6fd" });
  if (focus === "bars") {
    const bx0 = 520, bb = 290, bh = 200, tot = S.Etotal || 1, hh = k => (k / tot) * bh;
    C2.line(g, [[bx0 - 20, bb], [bx0 + 150, bb]], "#9fb3c8", 2);
    C2.rect(g, bx0, bb - hh(E.PE), 40, hh(E.PE), { stroke: "#fff", fill: "#3b82f6", lw: 1 }); C2.rect(g, bx0 + 60, bb - hh(E.KE), 40, hh(E.KE), { stroke: "#fff", fill: "#f97316", lw: 1 });
    g.save(); g.setLineDash([5, 5]); C2.line(g, [[bx0 - 10, bb - bh], [bx0 + 130, bb - bh]], "#e2e8f0", 2); g.restore(); C2.text(g, "total", bx0 + 148, bb - bh, { size: 13, color: "#e2e8f0", align: "left" });
    C2.text(g, "blue", bx0 + 20, bb + 18, { size: 13, color: "#93c5fd" }); C2.text(g, "orange", bx0 + 80, bb + 18, { size: 13, color: "#fdba74" });
  }
  return canvas;
}

/* ---------------------------------------------------------------- the lab */
export default {
  id: "energy", cls: 9, unit: "ix/ix11", icon: "⚖️",
  title: { en: "Energy Lab — the pendulum", hi: "ऊर्जा प्रयोगशाला — लोलक" },
  blurb: { en: "Raise the bob, let go — watch potential energy become kinetic energy and back. Does a heavier bob swing faster?", hi: "गोलक को ऊपर उठाओ, छोड़ो — स्थितिज ऊर्जा गतिज ऊर्जा बनती है और वापस। क्या भारी गोलक तेज़ झूलता है?" },
  vars: [
    { id: "m", label: { en: "Mass of the bob m", hi: "गोलक का द्रव्यमान m" }, unit: "kg", min: 0.5, max: 5, step: 0.5, value: 2 },
    { id: "h", label: { en: "Release height h (above the lowest point)", hi: "छोड़ने की ऊँचाई h (निम्नतम बिंदु से)" }, unit: "m", min: 0.05, max: 1, step: 0.05, value: 0.4 }
  ],
  facts(v) {
    const S = start(v);
    return [
      { id: "pe", en: "Potential energy at the top  PE = m g h", hi: "शीर्ष पर स्थितिज ऊर्जा", value: `${fmt(S.PE0, 2)} J` },
      { id: "ke", en: "Kinetic energy at the bottom  KE = ½ m v²", hi: "तल पर गतिज ऊर्जा", value: `${fmt(S.KEmax, 2)} J (= PE at the top)` },
      { id: "v", en: "Speed at the bottom  v = √(2 g h)", hi: "तल पर चाल", value: `${fmt(S.vMax, 2)} m/s` },
      { id: "mass", en: "Does the mass change that speed?", hi: "क्या द्रव्यमान से चाल बदलती है?", value: "No — v depends only on h · नहीं — v केवल h पर निर्भर है" },
      { id: "tot", en: "Total energy PE + KE", hi: "कुल ऊर्जा", value: `${fmt(S.Etotal, 2)} J — always the same · हमेशा समान` }
    ];
  },
  snapshot,

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 2.9, 6.4], target: [0, 2.35, 0], bg: 0x0b1424, minDist: 3.5, maxDist: 16 });
    const { scene } = st;
    const floor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 5), new THREE.MeshStandardMaterial({ color: 0x23334f, roughness: 0.9 })); floor.position.set(0, BOTTOM_Y - 0.65, 0); scene.add(floor);
    const beam = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.18, 0.5), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.5, roughness: 0.4 })); beam.position.set(0, PIVOT_Y + 0.1, 0); scene.add(beam);
    [-1.2, 1.2].forEach(x => { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, PIVOT_Y - BOTTOM_Y + 0.5, 0.12), new THREE.MeshStandardMaterial({ color: 0x64748b })); leg.position.set(x, (PIVOT_Y + BOTTOM_Y - 0.5) / 2 - 0.1, -0.2); scene.add(leg); });
    /* reference rulers: lowest point and the release height */
    scene.add(tube(THREE, [[-2.2, BOTTOM_Y, 0], [2.2, BOTTOM_Y, 0]], 0x7f93b5, 0.012));
    const lowTag = labelSprite(THREE, "Lowest point · h = 0", "निम्नतम बिंदु", { scale: 0.9, size: 26 }); lowTag.position.set(2.35, BOTTOM_Y - 0.3, 0); scene.add(lowTag);
    for (let i = 0; i <= 10; i++) { const k = new THREE.Mesh(new THREE.BoxGeometry(i % 5 === 0 ? 0.3 : 0.16, 0.012, 0.02), new THREE.MeshBasicMaterial({ color: 0xffd23f })); k.position.set(-2.0, BOTTOM_Y + i * 0.1, 0); scene.add(k);
      if (i % 5 === 0) { const s = labelSprite(THREE, `${(i / 10).toFixed(1)} m`, "", { scale: 0.7, size: 24, color: "#ffe9a8" }); s.position.set(-2.55, BOTTOM_Y + i * 0.1, 0); scene.add(s); } }
    const hLine = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.012, 0.012), new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0.7 })); scene.add(hLine);
    const hTag = labelSprite(THREE, "h = 0.40 m", "", { scale: 0.9, size: 28, color: "#ffe28a" }); scene.add(hTag);
    /* pendulum */
    const string = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1, 8), new THREE.MeshBasicMaterial({ color: 0xe2e8f0 })); scene.add(string);
    const bobMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.35, metalness: 0.2, emissive: 0xf97316, emissiveIntensity: 0 });
    const bob = new THREE.Mesh(new THREE.SphereGeometry(1, 36, 24), bobMat); scene.add(bob);
    const massTag = labelSprite(THREE, "2 kg", "", { scale: 0.8, size: 26, color: "#bae6fd" }); scene.add(massTag);
    const arcPts = []; for (let i = 0; i <= 40; i++) arcPts.push([0, 0, 0]);
    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud); const hh = el("span"), vv = el("span"), ee = el("span"); hud.append(hh, vv, ee);

    let s = { theta: 0, omega: 0 }, running = false, tagKey = "";
    const place = () => {
      const x = Math.sin(s.theta) * PEND_L, y = PIVOT_Y - Math.cos(s.theta) * PEND_L, r = 0.1 + Math.cbrt(ctx.vars.m) * 0.07;
      bob.scale.setScalar(r); bob.position.set(x, y, 0); massTag.position.set(x, y + r + 0.28, 0);
      string.position.set(x / 2, (PIVOT_Y + y) / 2, 0); string.scale.y = Math.hypot(x, PIVOT_Y - y); string.rotation.z = Math.atan2(x, PIVOT_Y - y);
      const hl = string.scale.y / 2, dx = -Math.sin(string.rotation.z) * hl, dy = Math.cos(string.rotation.z) * hl;   // the string's two end points: centre ± half-length along its axis
      ctx.stage.dataset.stringGap = Math.min(Math.hypot(string.position.x + dx - x, string.position.y + dy - y), Math.hypot(string.position.x - dx - x, string.position.y - dy - y)).toFixed(4);   // test hook: must stay ≈ 0
    };
    const paintEnergy = () => {
      const x = ctx.vars, E = pendulumEnergy(x.m, s.theta, s.omega), S0 = start(x);
      hh.textContent = `height = ${fmt(E.height, 2)} m`; vv.textContent = `speed = ${fmt(Math.abs(E.v), 2)} m/s`; ee.textContent = `PE ${fmt(E.PE, 2)} J + KE ${fmt(E.KE, 2)} J = ${fmt(E.PE + E.KE, 2)} J`;
      bobMat.emissiveIntensity = S0.KEmax ? 0.9 * Math.min(1, E.KE / S0.KEmax) : 0; drawBars(E, S0);
    };
    const hold = () => { const S0 = start(ctx.vars); s = { theta: S0.theta0, omega: 0 }; place(); paintEnergy(); };
    const refresh = () => {
      const x = ctx.vars, S0 = start(x); hold();
      hLine.position.set(0, BOTTOM_Y + x.h, 0); hTag.position.set(2.9, BOTTOM_Y + x.h + 0.12, 0);
      const key = `${x.m}/${x.h}`; if (key !== tagKey) { tagKey = key; const a = labelSprite(THREE, `h = ${x.h.toFixed(2)} m`, "", { scale: 0.9, size: 28, color: "#ffe28a" }), b = labelSprite(THREE, `${x.m} kg`, "", { scale: 0.8, size: 26, color: "#bae6fd" });
        hTag.material.map.dispose(); hTag.material.map = a.material.map; hTag.scale.copy(a.scale); massTag.material.map.dispose(); massTag.material.map = b.material.map; massTag.scale.copy(b.scale); }
      void S0;
    };

    const stopFrame = st.onFrame(dt => {
      if (!running) return;
      let rem = dt; while (rem > 0) { const h = Math.min(rem, 1 / 240); pendulumStep(s, h); rem -= h; }
      place(); paintEnergy();
    });

    /* side panel */
    const side = ctx.side; side.replaceChildren();
    const sl = sliders(ctx, side), btns = el("div", "cl-btns"); side.appendChild(btns);
    const btnGo = actionButton(btns, "▶ Release · छोड़ो", () => { if (running) { running = false; btnGo.textContent = "▶ Release · छोड़ो"; hold(); return; } running = true; btnGo.textContent = "■ Catch · पकड़ो"; ctx.run(); }, "cl-act");
    const bars = el("canvas", "cl-graph"); bars.width = 340; bars.height = 190; bars.setAttribute("role", "img"); bars.setAttribute("aria-label", "Energy bars: potential, kinetic and total");
    side.appendChild(el("h3", "cl-h", "Energy bars · ऊर्जा आलेख")); side.appendChild(bars);
    const facts = factsView(ctx, side);
    function drawBars(E, S0) {
      const g = C2.prep(bars, 340, 190, "#0b1424"), bb = 158, bh = 118, tot = S0.Etotal || 1, H = k => Math.max(0, (k / tot) * bh);
      C2.line(g, [[24, bb], [316, bb]], "#9fb3c8", 2);
      [["PE", E.PE, "#3b82f6", 36], ["KE", E.KE, "#f97316", 128]].forEach(([n, val, col, x]) => { C2.rect(g, x, bb - H(val), 62, H(val), { stroke: "#fff", fill: col, lw: 1 }); C2.text(g, n, x + 31, bb + 15, { size: 12, color: "#cfe0ff" }); C2.text(g, `${fmt(val, 2)} J`, x + 31, bb - H(val) - 9, { size: 11, color: "#fff" }); });
      g.save(); g.setLineDash([5, 4]); C2.line(g, [[24, bb - bh], [316, bb - bh]], "#e2e8f0", 2); g.restore(); C2.text(g, `total = ${fmt(E.PE + E.KE, 2)} J`, 270, bb - bh - 10, { size: 11, color: "#e2e8f0" });
      C2.rect(g, 220, bb - H(E.PE + E.KE), 62, H(E.PE + E.KE), { stroke: "#fff", fill: "rgba(226,232,240,.35)", lw: 1 }); C2.text(g, "Total", 251, bb + 15, { size: 12, color: "#cfe0ff" });
    }
    const presets = el("div", "cl-presets"); presets.appendChild(el("span", "cl-lab", "Try · आज़माओ"));
    const jump = (txt, fn) => actionButton(presets, txt, () => { fn(); sl.sync(); }, "cl-chipb");
    jump("m × 2", () => ctx.set("m", Math.min(5, ctx.vars.m * 2))); jump("h × 2", () => ctx.set("h", Math.min(1, ctx.vars.h * 2))); jump("h × 4", () => ctx.set("h", Math.min(1, ctx.vars.h * 4)));
    jump("🎲 Random", () => { ctx.set("m", 0.5 * (1 + Math.floor(Math.random() * 10))); ctx.set("h", 0.05 * (1 + Math.floor(Math.random() * 20))); });
    side.insertBefore(presets, sl.root.nextSibling);
    note(side, "Ideal pendulum: no air resistance, so the total energy stays constant. Try changing the mass while it swings — the speed at the bottom does not change.", "आदर्श लोलक: वायु-प्रतिरोध नहीं, इसलिए कुल ऊर्जा नियत रहती है। झूलते समय द्रव्यमान बदलकर देखो — तल पर चाल नहीं बदलती।");
    const off = bus.on("sim:change", e => { if (e.labId !== "energy") return; refresh(); facts.update(); sl.sync(); });      // a change re-holds the bob at the new release point (and keeps swinging if it was)
    refresh(); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ m: seen(q, "m"), h: seen(q, "h") }), J = x => [`${fmt(x, 2)} J`, `${fmt(x, 2)} J`], uniq = (arr, c) => { const s = new Set([c]); return arr.filter(o => !s.has(o[0]) && s.add(o[0])); };
    const FORM = { pe: ["Only potential energy", "केवल स्थितिज ऊर्जा"], ke: ["Only kinetic energy", "केवल गतिज ऊर्जा"], both: ["Equal potential and kinetic energy", "बराबर स्थितिज व गतिज ऊर्जा"], none: ["No energy at all", "कोई ऊर्जा नहीं"] };

    /* 1 · highest point */
    { const x = { ...v(), at: "top" }, c = FORM.pe, d = withDistractors(c, [FORM.ke, FORM.both, FORM.none], 3, q.rnd);
      out.push(ask({ id: "energy-top", prompt: ["The bob is momentarily at rest at its highest point. Which energy does it have there?", "गोलक सबसे ऊँचे बिंदु पर क्षण भर के लिए विराम में है। वहाँ उसके पास कौन-सी ऊर्जा है?"], image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Speed is zero, so KE = 0; the height is maximum, so all the energy is potential: PE = m g h.", "चाल शून्य है, अतः KE = 0; ऊँचाई अधिकतम है, इसलिए पूरी ऊर्जा स्थितिज है: PE = m g h।"] })); }

    /* 2 · lowest point */
    { const x = { ...v(), at: "bottom" }, c = FORM.ke, d = withDistractors(c, [FORM.pe, FORM.both, FORM.none], 3, q.rnd);
      out.push(ask({ id: "energy-bottom", prompt: ["The bob passes through the lowest point. Which energy is greatest there?", "गोलक निम्नतम बिंदु से गुजरता है। वहाँ कौन-सी ऊर्जा सबसे अधिक है?"], image: { vars: x }, options: d.options, correct: d.correct,
        why: ["At h = 0 the potential energy is zero and the speed is maximum, so all the energy is kinetic: ½ m v².", "h = 0 पर स्थितिज ऊर्जा शून्य और चाल अधिकतम है, अतः पूरी ऊर्जा गतिज है: ½ m v²।"] })); }

    /* 3 · PE value */
    { const x = { ...v(), at: "top" }, S = start(x), c = J(S.PE0), d = withDistractors(c, uniq([J(S.PE0 / 2), J(x.m * x.h), J(S.PE0 * 2), J(G * x.h)], c[0]), 3, q.rnd);
      out.push(ask({ id: "energy-pe", prompt: [`A ${x.m} kg bob is raised ${x.h} m above its lowest point (g = 9.8 m/s²). What is its potential energy?`, `${x.m} kg का गोलक निम्नतम बिंदु से ${x.h} m ऊपर उठाया गया (g = 9.8 m/s²)। उसकी स्थितिज ऊर्जा कितनी है?`], image: { vars: x }, options: d.options, correct: d.correct,
        why: [`PE = m g h = ${x.m} × 9.8 × ${x.h} = ${fmt(S.PE0, 2)} J.`, `PE = m g h = ${x.m} × 9.8 × ${x.h} = ${fmt(S.PE0, 2)} J।`] })); }

    /* 4 · predict: double the mass */
    { const x = { ...v(), at: "bottom" }, c = ["The speed stays the same", "चाल वही रहती है"], pool = [["The speed doubles", "चाल दोगुनी हो जाती है"], ["The speed becomes √2 times", "चाल √2 गुनी हो जाती है"], ["The speed becomes half", "चाल आधी हो जाती है"]], d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "energy-mass", kind: "predict", prompt: ["The bob is replaced by one of double the mass and released from the same height. What happens to its speed at the bottom?", "गोलक को दोगुने द्रव्यमान वाले गोलक से बदला और उसी ऊँचाई से छोड़ा। तल पर उसकी चाल का क्या होगा?"], image: { vars: x }, options: d.options, correct: d.correct, meta: { a: { m: x.m, h: x.h }, b: { m: x.m * 2, h: x.h }, ratio: 1 },
        why: ["m g h = ½ m v² — the mass cancels, so v = √(2 g h) depends only on the height.", "m g h = ½ m v² — द्रव्यमान कट जाता है, अतः v = √(2 g h) केवल ऊँचाई पर निर्भर है।"] })); }

    /* 5 · predict: change the height */
    { const x = { ...v(), at: "bottom" }, cases = [[4, 2, x.h * 4 <= 1], [0.25, 0.5, x.h / 4 >= 0.05 - 1e-9 && Math.abs(x.h / 4 / 0.05 - Math.round(x.h / 4 / 0.05)) < 1e-6], [2, Math.SQRT2, x.h * 2 <= 1]].filter(c => c[2]);
      if (cases.length) {
        const [hf, vf] = cases[Math.floor(q.rnd() * cases.length)], OPT = [[0.5, "becomes half", "आधी हो जाती है"], [Math.SQRT1_2, "becomes 1/√2 times", "1/√2 गुनी हो जाती है"], [1, "stays the same", "वही रहती है"], [Math.SQRT2, "becomes √2 times", "√2 गुनी हो जाती है"], [2, "becomes double", "दोगुनी हो जाती है"]],
          hit = OPT.find(o => Math.abs(o[0] - vf) < 1e-6), c = [hit[1], hit[2]], d = withDistractors(c, OPT.map(o => [o[1], o[2]]), 3, q.rnd), h2 = +(x.h * hf).toFixed(3);
        out.push(ask({ id: "energy-height", kind: "predict", prompt: [`The release height is changed from ${x.h} m to ${h2} m. What happens to the speed at the bottom?`, `छोड़ने की ऊँचाई ${x.h} m से बदलकर ${h2} m कर दी गई। तल पर चाल का क्या होगा?`], image: { vars: x }, options: d.options, correct: d.correct, meta: { a: { m: x.m, h: x.h }, b: { m: x.m, h: h2 }, ratio: hit[0] },
          why: [`v = √(2 g h): the height changes by ×${hf}, so the speed changes by ×${fmt(vf, 2)} (${fmt(start(x).vMax, 2)} → ${fmt(start({ ...x, h: h2 }).vMax, 2)} m/s).`, `v = √(2 g h): ऊँचाई ×${hf} होती है, इसलिए चाल ×${fmt(vf, 2)} होती है (${fmt(start(x).vMax, 2)} → ${fmt(start({ ...x, h: h2 }).vMax, 2)} m/s)।`] }));
      } }

    /* 6 · name the law */
    { const x = { ...v(), at: "mid" }, c = ["Law of conservation of energy", "ऊर्जा संरक्षण का नियम"], pool = [["Law of conservation of momentum", "संवेग संरक्षण का नियम"], ["Newton's third law", "न्यूटन का तीसरा नियम"], ["Universal law of gravitation", "गुरुत्वाकर्षण का सार्वत्रिक नियम"]], d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "energy-law", prompt: ["Half-way down, PE has fallen and KE has risen but the total stays the same. Perfect name of this law?", "आधे रास्ते में PE घटी और KE बढ़ी, पर कुल वही रहा। इस नियम का सही नाम?"], image: { vars: x, focus: "bars" }, options: d.options, correct: d.correct,
        why: ["Energy can change its form but the total amount stays constant: conservation of energy.", "ऊर्जा का रूप बदल सकता है पर कुल मात्रा नियत रहती है: ऊर्जा संरक्षण का नियम।"] })); }
    return out;
  }
};
