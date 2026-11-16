/* Curiosity Lab · Force Lab — F = ma on a trolley (NCERT Class IX, Ch 10 Force and Laws of Motion).
   Student sets the pull (F) and the load (m), presses Run and watches speed, distance and the v–t graph build — and can keep changing F and m mid-run. */
import { bus } from "../core.js";
import { motion, fmt } from "./models.js";
import { loadThree, makeStage, labelSprite, disposeObject, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const TRACK = 26;                                          // metres of track in front of the trolley
const view = v => motion({ F: v.F, m: v.m });

/* ---------------------------------------------------------------- 2D diagrams (quiz) */
function snapshot(canvas, vars, focus) {
  const M = view(vars), W = 720, H = 340, g = C2.prep(canvas, W, H, "#0b1424");
  if (focus === "vt") {                                  // velocity–time graph, straight line through the origin
    const x0 = 90, y0 = 290, x1 = 650, y1 = 40;
    C2.arrow(g, x0, y0, x1, y0, "#cfe0ff", 2, 9); C2.arrow(g, x0, y0, x0, y1, "#cfe0ff", 2, 9);
    C2.text(g, "time t (s) →", x1 - 50, y0 + 22, { size: 15, color: "#cfe0ff" }); C2.text(g, "velocity v (m/s)", x0 + 8, y1 - 12, { size: 15, color: "#cfe0ff", align: "left" });
    C2.line(g, [[x0, y0], [x1 - 30, y1 + 28]], "#ffd23f", 4); [0.25, 0.5, 0.75, 1].forEach(k => C2.circle(g, x0 + (x1 - 30 - x0) * k, y0 - (y0 - y1 - 28) * k, 5, { stroke: "#fff", fill: "#ff5d5d", w: 1 }));
    return canvas;
  }
  const gy = 250; C2.rect(g, 0, gy, W, H - gy, { stroke: null, fill: "#1f2d46" }); C2.line(g, [[0, gy], [W, gy]], "#7f93b5", 3);
  for (let x = 20; x < W; x += 60) C2.line(g, [[x, gy], [x, gy + 12]], "#7f93b5", 2);
  const bw = 150 + vars.m * 5, tx = 260, ty = gy - 36;
  C2.rect(g, tx, ty, bw, 26, { stroke: "#e2e8f0", fill: "#475569", lw: 3, r: 5 });
  [tx + 24, tx + bw - 24].forEach(x => C2.circle(g, x, gy - 8, 11, { stroke: "#e2e8f0", fill: "#0f172a", w: 3 }));
  const n = Math.round(vars.m), cols = Math.min(n, 5);
  for (let i = 0; i < n; i++) C2.rect(g, tx + 16 + (i % 5) * 24, ty - 24 - Math.floor(i / 5) * 24, 22, 22, { stroke: "#fbbf24", fill: "#b45309", lw: 2, r: 3 });
  C2.text(g, `m = ${vars.m} kg`, tx + bw / 2, ty - 24 - (Math.ceil(n / 5)) * 24 - 12, { size: 17, color: "#fde68a" });
  const fl = 40 + vars.F * 11; C2.arrow(g, tx + bw, ty + 13, tx + bw + fl, ty + 13, "#ff5d5d", 6, 16); C2.text(g, `F = ${vars.F} N`, tx + bw + fl / 2, ty - 8, { size: 17, color: "#ff9c9c" });
  const al = Math.min(300, 25 + M.a * 38); C2.arrow(g, tx + bw / 2, gy + 38, tx + bw / 2 + al, gy + 38, "#46e08a", 5, 14);
  C2.text(g, focus === "accel" ? "? = ?" : `a = ${fmt(M.a, 2)} m/s²`, tx + bw / 2 + al / 2, gy + 62, { size: 17, color: "#7dffb0" });
  if (focus === "moving") C2.text(g, "p = m × v = ?", 120, 70, { size: 24, color: "#cfe0ff" });
  return canvas;
}

/* ---------------------------------------------------------------- the lab */
export default {
  id: "force", cls: 9, unit: "ix/ix10", icon: "🛒",
  title: { en: "Force Lab — F = m × a", hi: "बल प्रयोगशाला — F = m × a" },
  blurb: { en: "Pull a trolley with more force, load it with more mass — and see the speed build up second by second.", hi: "ट्रॉली को अधिक बल से खींचो, अधिक द्रव्यमान लादो — और देखो गति कैसे बढ़ती है।" },
  vars: [
    { id: "F", label: { en: "Pulling force F", hi: "खींचने वाला बल F" }, unit: "N", min: 1, max: 20, step: 1, value: 8 },
    { id: "m", label: { en: "Mass of trolley + load m", hi: "ट्रॉली + भार का द्रव्यमान m" }, unit: "kg", min: 1, max: 10, step: 1, value: 4 }
  ],
  facts(v) {
    const M = view(v), s3 = M.at(3), tEnd = Math.sqrt((2 * TRACK) / M.a);
    return [
      { id: "a", en: "Acceleration a = F / m", hi: "त्वरण", value: `${fmt(M.a, 2)} m/s²` },
      { id: "v3", en: "Speed after 3 s  v = a t", hi: "3 s बाद चाल", value: `${fmt(s3.v, 2)} m/s` },
      { id: "s3", en: "Distance in 3 s  s = ½ a t²", hi: "3 s में दूरी", value: `${fmt(s3.s, 2)} m` },
      { id: "p3", en: "Momentum after 3 s  p = m v", hi: "3 s बाद संवेग", value: `${fmt(s3.p, 1)} kg·m/s` },
      { id: "end", en: `Time to cover ${TRACK} m`, hi: `${TRACK} m पार करने का समय`, value: `${fmt(tEnd, 1)} s` }
    ];
  },
  snapshot,

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [3.5, 2.6, 8.2], target: [2.5, 0.7, 0], bg: 0x0b1424, minDist: 4, maxDist: 20 });
    const { scene } = st;
    /* ground, posts and distance boards */
    const ground = new THREE.Mesh(new THREE.BoxGeometry(TRACK + 40, 0.2, 3.2), new THREE.MeshStandardMaterial({ color: 0x23334f, roughness: 0.9 })); ground.position.set(TRACK / 2 - 8, -0.1, 0); scene.add(ground);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(TRACK + 40, 0.05, 0.1), new THREE.MeshStandardMaterial({ color: 0x8aa0c4 })); rail.position.set(TRACK / 2 - 8, 0.03, 0.55); scene.add(rail); const rail2 = rail.clone(); rail2.position.z = -0.55; scene.add(rail2);
    for (let x = -6; x <= TRACK + 12; x++) { const post = new THREE.Mesh(new THREE.BoxGeometry(0.04, x % 5 === 0 ? 0.55 : 0.22, 0.04), new THREE.MeshBasicMaterial({ color: x % 5 === 0 ? 0xffd23f : 0x6d82a8 })); post.position.set(x, x % 5 === 0 ? 0.27 : 0.11, 1.45); scene.add(post);
      if (x % 5 === 0 && x >= 0) { const s = labelSprite(THREE, `${x} m`, "", { scale: 0.8, size: 28, color: "#ffe9a8" }); s.position.set(x, 0.95, 1.45); scene.add(s); } }
    const finish = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 3.0), new THREE.MeshStandardMaterial({ color: 0xff4d4d, emissive: 0x551111 })); finish.position.set(TRACK + 1.3, 0.7, 0); scene.add(finish);
    const finTag = labelSprite(THREE, "End of track", "ट्रैक का अंत", { scale: 1, size: 28 }); finTag.position.set(TRACK + 1.3, 1.7, 0); scene.add(finTag);

    /* trolley */
    const trolley = new THREE.Group(); scene.add(trolley);
    const bed = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.18, 1.3), new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.4, roughness: 0.4 })); bed.position.y = 0.38; trolley.add(bed);
    const wheels = []; [[-0.85, 0.5], [0.85, 0.5], [-0.85, -0.5], [0.85, -0.5]].forEach(([x, z]) => { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.14, 20), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 })); w.rotation.x = Math.PI / 2; w.position.set(x, 0.24, z); trolley.add(w); wheels.push(w); });
    const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0xcbd5e1 })); hook.rotation.z = Math.PI / 2; hook.position.set(1.4, 0.4, 0); trolley.add(hook);
    const blocks = new THREE.Group(); trolley.add(blocks);
    const blockMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.55 });
    for (let i = 0; i < 10; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.36), blockMat); b.position.set(-0.95 + (i % 5) * 0.4, 0.65, i < 5 ? -0.24 : 0.24); blocks.add(b); }
    const massTag = labelSprite(THREE, "m = 4 kg", "", { scale: 1, size: 30, color: "#fde68a" }); massTag.position.set(0, 1.6, 0); trolley.add(massTag);
    /* force arrow (scales with F) */
    const fArrow = new THREE.Group(), shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1, 12), new THREE.MeshStandardMaterial({ color: 0xff4d4d, emissive: 0x661111 })), head = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0xff4d4d, emissive: 0x661111 }));
    shaft.rotation.z = -Math.PI / 2; head.rotation.z = -Math.PI / 2; fArrow.add(shaft, head); fArrow.position.set(1.65, 0.4, 0); trolley.add(fArrow);
    const fTag = labelSprite(THREE, "F = 8 N", "", { scale: 1, size: 30, color: "#ff9c9c" }); trolley.add(fTag);
    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    let t = 0, v = 0, s = 0, running = false, done = false, trail = [], tagKey = "";
    const info = el("span"), speedEl = el("span"), distEl = el("span"); hud.append(info, speedEl, distEl);

    const refresh = () => {
      const x = ctx.vars; blocks.children.forEach((b, i) => { b.visible = i < x.m; });
      const len = 0.5 + x.F * 0.1; shaft.scale.y = len; shaft.position.x = len / 2; head.position.x = len + 0.1; fTag.position.set(len / 2 + 0.2, 0.95, 0);
      const key = `${x.F}/${x.m}`; if (key !== tagKey) { tagKey = key; const a = labelSprite(THREE, `F = ${x.F} N`, "", { scale: 1, size: 30, color: "#ff9c9c" }), b = labelSprite(THREE, `m = ${x.m} kg`, "", { scale: 1, size: 30, color: "#fde68a" });
        fTag.material.map.dispose(); fTag.material.map = a.material.map; fTag.scale.copy(a.scale); massTag.material.map.dispose(); massTag.material.map = b.material.map; massTag.scale.copy(b.scale); }
      info.textContent = `a = ${fmt(view(x).a, 2)} m/s²`;
    };
    const paintHud = () => { speedEl.textContent = `v = ${fmt(v, 2)} m/s`; distEl.textContent = `s = ${fmt(s, 1)} m · t = ${fmt(t, 1)} s`; };
    const reset = () => { running = false; done = false; t = 0; v = 0; s = 0; trail = [[0, 0]]; trolley.position.x = 0; paintHud(); drawGraph(); btnRun.textContent = "▶ Run · चलाओ"; };

    const stopFrame = st.onFrame(dt => {
      if (running) {
        const a = view(ctx.vars).a;                        // F and m may be changed while it runs
        v += a * dt; s += v * dt; t += dt;
        if (s >= TRACK) { s = TRACK; running = false; done = true; btnRun.textContent = "↻ Run again · फिर चलाओ"; }
        trolley.position.x = s; wheels.forEach(w => { w.rotation.z -= (v * dt) / 0.22; });
        if (!trail.length || t - trail[trail.length - 1][0] > 0.05) trail.push([t, v]);
        paintHud(); drawGraph();
      }
      st.target(trolley.position.x + 2.2, 0.7, 0);
    });

    /* side panel */
    const side = ctx.side; side.replaceChildren();
    const sl = sliders(ctx, side), btns = el("div", "cl-btns"); side.appendChild(btns);
    const btnRun = actionButton(btns, "▶ Run · चलाओ", () => {
      if (running) { running = false; btnRun.textContent = "▶ Resume · जारी रखो"; return; }          // pause
      if (done) reset();
      if (s === 0) ctx.run();                                                                          // a fresh run counts for the student's progress
      running = true; btnRun.textContent = "❚❚ Pause · रोको";
    }, "cl-act");
    actionButton(btns, "⟲ Reset", reset, "cl-act sec");
    const graph = el("canvas", "cl-graph"); graph.width = 340; graph.height = 190; graph.setAttribute("role", "img"); graph.setAttribute("aria-label", "velocity–time graph");
    side.appendChild(el("h3", "cl-h", "v–t graph · v–t आलेख")); side.appendChild(graph);
    const facts = factsView(ctx, side);
    const presets = el("div", "cl-presets"); presets.appendChild(el("span", "cl-lab", "Try · आज़माओ"));
    const jump = (txt, fn) => actionButton(presets, txt, () => { fn(); sl.sync(); }, "cl-chipb");
    jump("F × 2", () => ctx.set("F", ctx.vars.F * 2)); jump("m × 2", () => ctx.set("m", ctx.vars.m * 2)); jump("F ÷ 2", () => ctx.set("F", Math.max(1, Math.round(ctx.vars.F / 2))));
    jump("🎲 Random", () => { ctx.set("F", 1 + Math.floor(Math.random() * 20)); ctx.set("m", 1 + Math.floor(Math.random() * 10)); });
    side.insertBefore(presets, graph.previousSibling);
    note(side, "Frictionless track. Force and mass can be changed while the trolley is moving — the acceleration changes at once. Newton's second law: F = m × a.", "घर्षण-रहित पटरी। ट्रॉली चलते समय भी F और m बदले जा सकते हैं — त्वरण तुरंत बदल जाता है। न्यूटन का दूसरा नियम: F = m × a।");
    function drawGraph() {
      const g = C2.prep(graph, 340, 190, "#0b1424"), x0 = 40, y0 = 160, x1 = 326, y1 = 16, tm = Math.max(5, t * 1.1), vm = Math.max(10, v * 1.15);
      C2.arrow(g, x0, y0, x1, y0, "#9fb3c8", 1.5, 7); C2.arrow(g, x0, y0, x0, y1, "#9fb3c8", 1.5, 7); C2.text(g, "t (s)", x1 - 14, y0 + 15, { size: 11, color: "#9fb3c8" }); C2.text(g, "v (m/s)", x0 + 4, y1 - 4, { size: 11, color: "#9fb3c8", align: "left" });
      const X = tt => x0 + ((x1 - 12 - x0) * tt) / tm, Y = vv => y0 - ((y0 - y1 - 10) * vv) / vm;
      if (trail.length > 1) C2.line(g, trail.map(([a, b]) => [X(a), Y(b)]), "#ffd23f", 3);
      C2.circle(g, X(t), Y(v), 5, { stroke: "#fff", fill: "#ff5d5d", w: 2 });
    }
    const off = bus.on("sim:change", e => { if (e.labId !== "force") return; refresh(); facts.update(); sl.sync(); });
    reset(); refresh(); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ F: seen(q, "F"), m: seen(q, "m") }), uniq = (arr, correctStr) => { const s = new Set([correctStr]); return arr.filter(o => !s.has(o[0]) && s.add(o[0])); };
    const num = (x, u) => [`${fmt(x, 2)} ${u}`, `${fmt(x, 2)} ${u}`];

    /* 1 · acceleration value */
    { const x = v(), M = view(x), c = num(M.a, "m/s²"), d = withDistractors(c, uniq([num(M.a * 2, "m/s²"), num(M.a / 2, "m/s²"), num(x.F * x.m, "m/s²"), num(x.F + x.m, "m/s²")], c[0]), 3, q.rnd);
      out.push(ask({ id: "force-a", prompt: [`A force of ${x.F} N acts on a ${x.m} kg trolley. What is its acceleration?`, `${x.m} kg की ट्रॉली पर ${x.F} N का बल लगता है। उसका त्वरण कितना है?`], image: { vars: x, focus: "accel" }, options: d.options, correct: d.correct,
        why: [`a = F / m = ${x.F} / ${x.m} = ${fmt(M.a, 2)} m/s².`, `a = F / m = ${x.F} / ${x.m} = ${fmt(M.a, 2)} m/s²।`] })); }

    /* 2 · predict: double the force or the mass */
    { const x = v(), cases = [["F", 2, x.F * 2 <= 20], ["m", 2, x.m * 2 <= 10], ["F", 0.5, x.F % 2 === 0], ["m", 0.5, x.m % 2 === 0]].filter(c => c[2]);
      if (cases.length) {
        const [k, f] = cases[Math.floor(q.rnd() * cases.length)], y = { ...x, [k]: x[k] * f }, a = view(x), b = view(y), ratio = b.a / a.a;
        const OPT = [[0.25, "becomes one-fourth", "एक-चौथाई हो जाता है"], [0.5, "becomes half", "आधा हो जाता है"], [1, "stays the same", "वही रहता है"], [2, "becomes double", "दोगुना हो जाता है"], [4, "becomes four times", "चार गुना हो जाता है"]], hit = OPT.find(o => Math.abs(o[0] - ratio) < 1e-6) || [ratio, `becomes ×${fmt(ratio, 2)}`, `×${fmt(ratio, 2)} हो जाता है`], c = [hit[1], hit[2]], d = withDistractors(c, OPT.map(o => [o[1], o[2]]), 3, q.rnd);
        const what = k === "F" ? (f === 2 ? ["The pulling force is doubled", "खींचने वाला बल दोगुना कर दिया गया"] : ["The pulling force is halved", "खींचने वाला बल आधा कर दिया गया"]) : (f === 2 ? ["The mass is doubled", "द्रव्यमान दोगुना कर दिया गया"] : ["The mass is halved", "द्रव्यमान आधा कर दिया गया"]);
        out.push(ask({ id: "force-predict", kind: "predict", prompt: [`${what[0]}. What happens to the acceleration?`, `${what[1]}। त्वरण का क्या होगा?`], image: { vars: x }, options: d.options, correct: d.correct, meta: { a: x, b: y, ratio: hit[0] },
          why: [`a = F / m: a goes from ${fmt(a.a, 2)} to ${fmt(b.a, 2)} m/s².`, `a = F / m: त्वरण ${fmt(a.a, 2)} से ${fmt(b.a, 2)} m/s² हो जाता है।`] }));
      } }

    /* 3 · name the law */
    { const x = v(), c = ["Newton's second law of motion", "न्यूटन का गति का दूसरा नियम"], pool = [["Newton's first law (law of inertia)", "न्यूटन का पहला नियम (जड़त्व का नियम)"], ["Newton's third law (action–reaction)", "न्यूटन का तीसरा नियम (क्रिया–प्रतिक्रिया)"], ["Law of conservation of energy", "ऊर्जा संरक्षण का नियम"]], d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "force-law", prompt: ["Perfect name of the law that gives a = F / m?", "a = F / m देने वाले नियम का सही नाम?"], image: { vars: x }, options: d.options, correct: d.correct,
        why: ["The rate of change of momentum is proportional to the applied force: F = m a — Newton's second law.", "संवेग परिवर्तन की दर लगाए गए बल के अनुक्रमानुपाती होती है: F = m a — न्यूटन का दूसरा नियम।"] })); }

    /* 4 · momentum after 3 s */
    { const x = v(), M = view(x), s3 = M.at(3), c = num(s3.p, "kg·m/s"), d = withDistractors(c, uniq([num(0.5 * x.m * s3.v * s3.v, "kg·m/s"), num(M.a, "kg·m/s"), num(s3.v, "kg·m/s"), num(s3.p * 2, "kg·m/s"), num(s3.p / 2, "kg·m/s")], c[0]), 3, q.rnd);
      out.push(ask({ id: "force-momentum", prompt: [`F = ${x.F} N pulls m = ${x.m} kg from rest. What is the momentum after 3 s?`, `F = ${x.F} N, m = ${x.m} kg को विराम से खींचता है। 3 s बाद संवेग कितना है?`], image: { vars: x, focus: "moving" }, options: d.options, correct: d.correct,
        why: [`v = a t = ${fmt(M.a, 2)} × 3 = ${fmt(s3.v, 2)} m/s, so p = m v = ${fmt(s3.p, 1)} kg·m/s.`, `v = a t = ${fmt(M.a, 2)} × 3 = ${fmt(s3.v, 2)} m/s, अतः p = m v = ${fmt(s3.p, 1)} kg·m/s।`] })); }

    /* 5 · name the graph */
    { const x = v(), c = ["Uniform (constant) acceleration", "एकसमान (नियत) त्वरण"], pool = [["Uniform velocity (no acceleration)", "एकसमान वेग (त्वरण शून्य)"], ["Body at rest", "वस्तु विराम में"], ["Uniform retardation", "एकसमान मंदन"]], d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "force-vt", prompt: ["Perfect name of the motion shown by this straight sloping v–t graph from the origin?", "मूल बिंदु से शुरू होने वाले इस ढलान वाले सरल रेखीय v–t आलेख द्वारा दिखाई गई गति का सही नाम?"], image: { vars: x, focus: "vt" }, options: d.options, correct: d.correct,
        why: ["Speed rises by equal amounts in equal times: the slope (a) is constant — uniform acceleration.", "बराबर समय में चाल बराबर बढ़ती है: ढलान (a) नियत है — एकसमान त्वरण।"] })); }

    /* 6 · name the property (inertia) */
    { const x = { F: v().F, m: Math.max(6, v().m) }, c = ["Inertia", "जड़त्व"], pool = [["Momentum", "संवेग"], ["Friction", "घर्षण"], ["Weight", "भार"]], d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "force-inertia", prompt: ["A heavier load is harder to start moving. Perfect name of this property of matter?", "भारी भार को चलाना कठिन होता है। पदार्थ के इस गुण का सही नाम?"], image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Inertia is the tendency of a body to resist a change in its state of motion; it is measured by mass.", "जड़त्व किसी वस्तु की गति की अवस्था में परिवर्तन का विरोध करने की प्रवृत्ति है; इसे द्रव्यमान से मापते हैं।"] })); }
    return out;
  }
};
