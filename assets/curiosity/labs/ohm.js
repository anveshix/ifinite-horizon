/* Curiosity Lab · Circuit Lab — Ohm's law, series and parallel (NCERT Class X, Ch 11 Electricity).
   Student sets the battery voltage and the resistors; an ammeter, a voltmeter, a glowing resistor and moving electrons show what happens. */
import { bus } from "../core.js";
import { circuit, MODE_NAME, fmt } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, tube, disposeObject, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const VMAX = 12, IMAX = 12;
const view = v => circuit({ V: v.V, R1: v.R1, R2: v.R2, mode: v.mode });
const MODE_HI = ["एक प्रतिरोधक", "श्रेणी क्रम में", "पार्श्व क्रम में"];

/* ---------------------------------------------------------------- 2D circuit diagram (quiz) */
function snapshot(canvas, vars, focus) {
  const C = view(vars), W = 720, H = 340, g = C2.prep(canvas, W, H, "#f7fafc"), ink = "#102a43", L = 70, R = 650, T = 100, B = 285;
  const hl = name => focus === name, mark = (x, y, r) => { g.save(); g.setLineDash([6, 5]); C2.circle(g, x, y, r, { stroke: "#e11d48", w: 3 }); g.restore(); };
  const wire = pts => C2.line(g, pts, ink, 3);
  /* wires */
  wire([[L, T], [R, T]]); wire([[R, T], [R, B]]); wire([[R, B], [L, B]]); wire([[L, B], [L, 225]]); wire([[L, 160], [L, T]]);
  if (C.mode === 2) { wire([[360, T], [360, 190], [420, 190]]); wire([[520, 190], [560, 190], [560, T]]); }
  /* battery of cells: long plate = positive */
  [[168, 36, "#102a43"], [180, 20, "#102a43"], [196, 36, "#102a43"], [208, 20, "#102a43"]].forEach(([y, hw, c], i) => C2.line(g, [[L - hw, y + 8], [L + hw, y + 8]], c, i % 2 ? 6 : 3));
  C2.text(g, "+", L - 50, 172, { size: 22, color: ink }); C2.text(g, "−", L - 50, 218, { size: 24, color: ink });
  C2.text(g, focus === "battery" ? "?" : `${fmt(C.V, 1)} V`, L + 62, 196, { size: 17, color: ink });
  if (hl("battery")) mark(L, 190, 52);
  /* ammeter (in series) */
  const meter = (x, y, ch, name) => { C2.circle(g, x, y, 23, { stroke: ink, fill: "#fff", w: 3 }); C2.text(g, focus === name ? "?" : ch, x, y + 1, { size: 22, color: ink }); if (hl(name)) mark(x, y, 31); };
  C2.circle(g, 190, T, 25, { stroke: "#f7fafc", fill: "#f7fafc", w: 1 }); meter(190, T, "A", "ammeter");
  /* resistors */
  const res = (x, y, w, name, label, heat) => { C2.rect(g, x, y - 18, w, 36, { stroke: ink, fill: heat ? "#ff9a3c" : "#fff", lw: 3 }); C2.text(g, label, x + w / 2, y + 36, { size: 15, color: ink }); if (focus === name) mark(x + w / 2, y, w / 2 + 12); };
  C2.rect(g, 410, T - 20, 120, 40, { stroke: "#f7fafc", fill: "#f7fafc", lw: 1 });
  res(420, T, 100, "resistor", `R₁ = ${C.R1} Ω`, focus === "heat");
  if (C.mode === 1) { C2.rect(g, R - 22, 160, 44, 90, { stroke: "#f7fafc", fill: "#f7fafc", lw: 1 }); C2.rect(g, R - 18, 165, 36, 80, { stroke: ink, fill: focus === "heat" ? "#ff9a3c" : "#fff", lw: 3 }); C2.text(g, `R₂ = ${C.R2} Ω`, R - 70, 205, { size: 15, color: ink }); }
  if (C.mode === 2) res(420, 190, 100, "resistor2", `R₂ = ${C.R2} Ω`, focus === "heat");
  /* voltmeter (in parallel with R₁) */
  wire([[420, T], [420, 38], [447, 38]]); wire([[520, T], [520, 38], [493, 38]]); meter(470, 38, "V", "voltmeter");
  if (focus === "heat") { C2.text(g, "🔥 hot!", 470, T + 62, { size: 20, color: "#b45309" }); }
  /* conventional current arrow */
  C2.arrow(g, 250, T - 14, 330, T - 14, "#d6336c", 3, 10); C2.text(g, "I (conventional) →", 290, T - 30, { size: 13, color: "#d6336c" });
  if (focus === "graph") {                           // replace the whole picture by a V–I graph
    g.fillStyle = "#0b1424"; g.fillRect(0, 0, W, H); const x0 = 90, y0 = 290, x1 = 650, y1 = 40;
    C2.arrow(g, x0, y0, x1, y0, "#cfe0ff", 2, 9); C2.arrow(g, x0, y0, x0, y1, "#cfe0ff", 2, 9); C2.text(g, "V (volt) →", x1 - 30, y0 + 22, { size: 15, color: "#cfe0ff" }); C2.text(g, "I (ampere)", x0 + 6, y1 - 12, { size: 15, color: "#cfe0ff", align: "left" });
    C2.line(g, [[x0, y0], [x1 - 20, y1 + 20]], "#ffd23f", 4);
    for (let i = 1; i <= 5; i++) { const fx = i / 5; C2.circle(g, x0 + (x1 - x0 - 20) * fx, y0 - (y0 - y1 - 20) * fx, 5, { stroke: "#fff", fill: "#ff5d5d", w: 1 }); }
  }
  return canvas;
}

/* ---------------------------------------------------------------- dial texture */
function dialTexture(THREE, title, unit, max) {
  const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d");
  g.fillStyle = "#f8fafc"; g.beginPath(); g.arc(128, 128, 124, 0, 7); g.fill(); g.strokeStyle = "#1e293b"; g.lineWidth = 6; g.stroke();
  const a0 = (-210 * Math.PI) / 180, a1 = (30 * Math.PI) / 180;
  for (let i = 0; i <= 12; i++) { const a = a0 + ((a1 - a0) * i) / 12, l = i % 3 === 0 ? 20 : 10; g.strokeStyle = "#1e293b"; g.lineWidth = i % 3 === 0 ? 4 : 2; g.beginPath(); g.moveTo(128 + Math.cos(a) * 100, 128 + Math.sin(a) * 100); g.lineTo(128 + Math.cos(a) * (100 - l), 128 + Math.sin(a) * (100 - l)); g.stroke();
    if (i % 3 === 0) { g.fillStyle = "#0f172a"; g.font = "700 20px system-ui"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(Math.round((max * i) / 12)), 128 + Math.cos(a) * 66, 128 + Math.sin(a) * 66); } }
  g.fillStyle = "#b91c1c"; g.font = "900 44px system-ui"; g.textAlign = "center"; g.fillText(title, 128, 176); g.fillStyle = "#334155"; g.font = "700 20px system-ui"; g.fillText(unit, 128, 206);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ---------------------------------------------------------------- the lab */
export default {
  id: "ohm", cls: 10, unit: "x/ch11", icon: "⚡",
  title: { en: "Circuit Lab — Ohm's law", hi: "परिपथ प्रयोगशाला — ओम का नियम" },
  blurb: { en: "Turn the voltage, change the resistors, wire them in series or parallel — see the current, the glow and the electrons.", hi: "वोल्टता बदलो, प्रतिरोधक बदलो, श्रेणी या पार्श्व क्रम में जोड़ो — धारा, चमक और इलेक्ट्रॉन देखो।" },
  vars: [
    { id: "V", label: { en: "Battery voltage V", hi: "बैटरी की वोल्टता V" }, unit: "V", min: 1.5, max: 12, step: 1.5, value: 6 },
    { id: "R1", label: { en: "Resistor R₁", hi: "प्रतिरोधक R₁" }, unit: "Ω", min: 1, max: 20, step: 1, value: 6 },
    { id: "R2", label: { en: "Resistor R₂", hi: "प्रतिरोधक R₂" }, unit: "Ω", min: 1, max: 20, step: 1, value: 12 },
    { id: "mode", label: { en: "Wiring", hi: "जोड़ने का ढंग" }, unit: "", min: 0, max: 2, step: 1, value: 0 }
  ],
  facts(v) {
    const C = view(v), rows = [
      { id: "Req", en: "Total resistance", hi: "कुल प्रतिरोध", value: `${fmt(C.Req, 2)} Ω (${MODE_NAME[C.mode]})` },
      { id: "I", en: "Current from the battery  I = V / R", hi: "बैटरी से धारा", value: `${fmt(C.I, 2)} A` },
      { id: "V1", en: "Voltmeter across R₁", hi: "R₁ के सिरों पर वोल्टता", value: `${fmt(C.V1, 2)} V` }
    ];
    if (C.mode === 2) rows.push({ id: "br", en: "Branch currents", hi: "शाखाओं की धाराएँ", value: `I₁ = ${fmt(C.I1, 2)} A · I₂ = ${fmt(C.I2, 2)} A` });
    if (C.mode === 1) rows.push({ id: "br", en: "Voltage drops", hi: "वोल्टता पात", value: `V₁ = ${fmt(C.V1, 2)} V · V₂ = ${fmt(C.V2, 2)} V` });
    rows.push({ id: "P", en: "Power P = V I", hi: "शक्ति", value: `${fmt(C.P, 1)} W` });
    rows.push({ id: "H", en: "Heat produced in 1 minute  H = V I t", hi: "1 मिनट में उत्पन्न ऊष्मा", value: `${fmt(C.heatPerMin, 0)} J` });
    return rows;
  },
  snapshot,
  missions: [
    { id: "ohm-series", en: "Wire R₁ and R₂ in series and see Req = R₁ + R₂", hi: "R₁ व R₂ को श्रेणीक्रम में जोड़ो (Req = R₁ + R₂)", check: v => v.mode === 1 },
    { id: "ohm-parallel", en: "Wire R₁ and R₂ in parallel (Req drops below both!)", hi: "पार्श्वक्रम में जोड़ो और देखो कुल प्रतिरोध दोनों से कम होता है", check: v => v.mode === 2 },
    { id: "ohm-heat", en: "Reach at least 24 W power so the resistor glows bright!", hi: "कम से कम 24 W शक्ति प्राप्त कर प्रतिरोधक को चमकाओ!", check: v => view(v).P >= 24 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 9.2, 9.6], target: [0, 0, -0.4], bg: 0x0d1b2a, minDist: 5, maxDist: 24 });
    const { scene } = st, dyn = new THREE.Group(); scene.add(dyn);
    const board = new THREE.Mesh(new THREE.BoxGeometry(13.4, 0.3, 9.6), new THREE.MeshStandardMaterial({ color: 0x6b4f35, roughness: 0.85 })); board.position.set(0, -0.2, -0.7); scene.add(board);
    const copper = new THREE.MeshStandardMaterial({ color: 0xd68a4a, metalness: 0.8, roughness: 0.3 });

    /* battery: 8 cell slots, the first ceil(V/1.5) are live */
    const cells = []; for (let i = 0; i < 8; i++) { const c = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.7, 0.28), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 })); c.position.set(-4.7, 0.35, 1.15 - 0.3 * i); scene.add(c); cells.push(c); }
    const bplus = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.18, 14), new THREE.MeshStandardMaterial({ color: 0xdc2626 })); bplus.position.set(-4.7, 0.35, -1.38); bplus.rotation.x = Math.PI / 2; scene.add(bplus);
    const volTag = labelSprite(THREE, "6 V", "बैटरी", { scale: 1.05, size: 30 }); volTag.position.set(-4.7, 1.55, 0); scene.add(volTag);
    const plusTag = labelSprite(THREE, "+", "", { scale: 0.9, size: 40, color: "#ff8f8f" }); plusTag.position.set(-5.6, 0.7, -1.4); scene.add(plusTag);
    const minusTag = labelSprite(THREE, "−", "", { scale: 0.9, size: 40, color: "#9fc7ff" }); minusTag.position.set(-5.6, 0.7, 1.4); scene.add(minusTag);

    /* meters */
    const mkMeter = (x, z, title, unit, max, name, hi) => {
      const grp = new THREE.Group(), body = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.9, 0.5, 40), new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.4 }));
      const face = new THREE.Mesh(new THREE.CircleGeometry(0.78, 48), new THREE.MeshBasicMaterial({ map: dialTexture(THREE, title, unit, max) })); face.rotation.x = -Math.PI / 2; face.position.y = 0.26;
      const needle = new THREE.Group(), blade = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.02, 0.035), new THREE.MeshBasicMaterial({ color: 0xdc2626 })); blade.position.x = 0.3; needle.add(blade); needle.position.y = 0.3;
      grp.add(body, face, needle); grp.position.set(x, 0.3, z); scene.add(grp);
      const tag = labelSprite(THREE, name, hi, { scale: 0.9, size: 26 }); tag.position.set(x, 1.45, z); scene.add(tag);
      return { grp, needle, ang: -210, goal: -210, max };
    };
    const am = mkMeter(-2.2, -2.6, "A", "ampere", IMAX, "Ammeter · series", "अमीटर — श्रेणी में"), vm = mkMeter(2.3, -4.35, "V", "volt", VMAX, "Voltmeter · parallel", "वोल्टमीटर — पार्श्व में");
    const setNeedle = (m, val) => { m.goal = -210 + (240 * Math.min(1, val / m.max)); };

    /* resistor body */
    const resistor = (x, z, vertical, name) => {
      const g = new THREE.Group(), mat = new THREE.MeshStandardMaterial({ color: 0xd9c29a, roughness: 0.55, emissive: 0xff3b00, emissiveIntensity: 0 });
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.9, 24), mat)); g.children[0].rotation.z = Math.PI / 2;
      [-0.55, -0.25, 0.1, 0.4].forEach((bx, i) => { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.315, 0.315, 0.1, 24), new THREE.MeshStandardMaterial({ color: [0x92400e, 0x111827, 0xdc2626, 0xd4af37][i] })); b.rotation.z = Math.PI / 2; b.position.x = bx; g.add(b); });
      g.position.set(x, 0.42, z); if (vertical) g.rotation.y = Math.PI / 2; scene.add(g);
      const tag = labelSprite(THREE, name, "", { scale: 0.9, size: 28 }); tag.position.set(x + (vertical ? 1.2 : 0), 1.25, z); scene.add(tag); g.userData = { mat, tag }; return g;
    };
    const r1 = resistor(2.3, -2.6, false, "R₁"), r2 = resistor(2.3, -0.3, false, "R₂"), r2v = resistor(4.4, 0.1, true, "R₂");
    /* 3D Safety Fuse on top wire (rated 6.5 A — blows open on overload!) */
    const fuseGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.9, 16), new THREE.MeshPhysicalMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.35 }));
    fuseGlass.rotation.z = Math.PI / 2; fuseGlass.position.set(-0.35, 0.34, -2.6); scene.add(fuseGlass);
    const fuseWireMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xff4500, emissiveIntensity: 0 });
    const fuseWire = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.85, 8), fuseWireMat);
    fuseWire.rotation.z = Math.PI / 2; fuseWire.position.set(-0.35, 0.34, -2.6); scene.add(fuseWire);
    const fuseTag = labelSprite(THREE, "Fuse (6.5 A max)", "फ़्यूज़", { scale: 0.72, size: 22, color: "#fde68a" }); fuseTag.position.set(-0.35, 1.05, -2.6); scene.add(fuseTag);
    let wasBlown = false;
    const arrow = new THREE.Group(); for (let i = 0; i < 2; i++) { const a = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.42, 14), new THREE.MeshBasicMaterial({ color: 0xff6b9d })); a.rotation.z = -Math.PI / 2; a.position.set(-3.9 + i * 0.5, 0.78, -2.6); arrow.add(a); } scene.add(arrow);
    const arrTag = labelSprite(THREE, "Current I (+ → −)", "धारा की दिशा", { scale: 0.9, size: 26, color: "#ff9fbf" }); arrTag.position.set(-3.6, 1.45, -3.3); scene.add(arrTag);
    const eTag = labelSprite(THREE, "Electrons (− → +)", "इलेक्ट्रॉन", { scale: 0.9, size: 26, color: "#8fd8ff" }); eTag.position.set(0.2, 1.1, 3.55); scene.add(eTag);

    /* paths (conventional direction, battery + → − ) ; electrons travel the other way */
    const P = (x, z) => new THREE.Vector3(x, 0.32, z);
    const pathsFor = mode => {
      const top = [P(-4.7, -1.4), P(-4.7, -2.6), P(1.0, -2.6)], back = [P(4.4, 2.8), P(-4.7, 2.8), P(-4.7, 1.4)];
      if (mode === 0) return { wires: [[...top, P(3.6, -2.6), P(4.4, -2.6), ...back]], flows: [{ pts: [...top, P(3.6, -2.6), P(4.4, -2.6), ...back], k: "I" }] };
      if (mode === 1) { const pts = [...top, P(3.6, -2.6), P(4.4, -2.6), P(4.4, -1.1), P(4.4, 1.3), ...back]; return { wires: [pts], flows: [{ pts, k: "I" }] }; }
      const b1 = [P(1.0, -2.6), P(3.6, -2.6), P(4.4, -2.6), P(4.4, -0.3)], b2 = [P(1.0, -2.6), P(1.0, -0.3), P(3.6, -0.3), P(4.4, -0.3)], out = [P(4.4, -0.3), ...back];
      return { wires: [top, b1, b2, out], flows: [{ pts: top, k: "I" }, { pts: b1, k: "I1" }, { pts: b2, k: "I2" }, { pts: out, k: "I" }] };
    };
    const wireMeter = [[P(1.0, -2.6), P(1.0, -4.35), P(1.45, -4.35)], [P(3.6, -2.6), P(3.6, -4.35), P(3.15, -4.35)]];
    const lenOf = pts => pts.reduce((s, p, i) => s + (i ? p.distanceTo(pts[i - 1]) : 0), 0);
    const at = (pts, s) => { let acc = 0; for (let i = 1; i < pts.length; i++) { const l = pts[i].distanceTo(pts[i - 1]); if (s <= acc + l || i === pts.length - 1) return pts[i - 1].clone().lerp(pts[i], Math.max(0, Math.min(1, (s - acc) / l))); acc += l; } return pts[pts.length - 1].clone(); };
    let flows = [], pos = null, geo = null, cur = view(ctx.vars);
    const rebuild = () => {
      const v = ctx.vars, C = view(v); cur = C;
      disposeObject(dyn); dyn.clear();
      const set = pathsFor(C.mode); flows = set.flows;
      [...set.wires, ...wireMeter].forEach(w => { for (let i = 1; i < w.length; i++) dyn.add(tube(THREE, [w[i - 1].toArray(), w[i].toArray()], 0xd68a4a, 0.05)); w.forEach(p => { const j = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), copper); j.position.copy(p); dyn.add(j); }); });
      let n = 0; flows.forEach(f => { f.len = lenOf(f.pts); f.n = Math.max(4, Math.round(f.len * 2.4)); f.off = n; n += f.n; f.phase = Array.from({ length: f.n }, (_, i) => (i / f.n) * f.len); });
      pos = new Float32Array(n * 3); geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      dyn.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x6fd8ff, size: 0.24, sizeAttenuation: true, transparent: true, opacity: 0.95, depthWrite: false })));
      /* which resistor bodies show */
      r1.visible = true; r2.visible = C.mode === 2; r2v.visible = C.mode === 1; r1.userData.tag.visible = true; r2.userData.tag.visible = C.mode === 2; r2v.userData.tag.visible = C.mode === 1;
      const nLive = Math.ceil(v.V / 1.5 - 1e-9); cells.forEach((c, i) => { c.material.color.setHex(i < nLive ? 0x16a34a : 0x334155); c.material.emissive.setHex(i < nLive ? 0x0b5d2a : 0); });
      volTag.material.map.dispose(); const t2 = labelSprite(THREE, `${fmt(v.V, 1)} V`, "बैटरी", { scale: 1.05, size: 30 }); volTag.material.map = t2.material.map; volTag.scale.copy(t2.scale);
      const blown = C.I > 6.5;
      if (blown && !wasBlown) sfx.play("zap");
      wasBlown = blown;
      fuseWire.visible = !blown;
      fuseTag.material.map.dispose();
      const ft = labelSprite(THREE, blown ? "FUSE BLOWN! (>6.5 A)" : "Fuse OK (6.5 A max)", blown ? "अतिभार से फ़्यूज़ टूटा!" : "फ़्यूज़ ठीक", { scale: 0.72, size: 22, color: blown ? "#fca5a5" : "#fde68a" });
      fuseTag.material.map = ft.material.map; fuseTag.scale.copy(ft.scale);
      setNeedle(am, blown ? 0 : C.I); setNeedle(vm, blown ? 0 : C.V1);
    };

    const stopFrame = st.onFrame((dt, t) => {
      [am, vm].forEach(m => { m.ang += (m.goal - m.ang) * Math.min(1, dt * 5); m.needle.rotation.y = (-m.ang * Math.PI) / 180; });
      const blown = cur.I > 6.5;
      const glow = (body, p) => { const eff = blown ? 0 : p; body.userData.mat.emissiveIntensity = Math.min(1, Math.sqrt(eff / 40)); body.userData.mat.color.setHSL(0.09 - 0.06 * Math.min(1, eff / 60), 0.4 + 0.4 * Math.min(1, eff / 60), 0.7 - 0.25 * Math.min(1, eff / 60)); };
      glow(r1, cur.P1); glow(r2, cur.P2); glow(r2v, cur.P2);
      fuseWireMat.emissiveIntensity = blown ? 0 : Math.min(1, cur.I / 6.5);
      if (!pos) return;
      flows.forEach(f => {
        const I = blown ? 0 : (f.k === "I" ? cur.I : f.k === "I1" ? cur.I1 : cur.I2), speed = Math.min(5, I * 0.42);
        for (let i = 0; i < f.n; i++) { f.phase[i] = (f.phase[i] - speed * dt + f.len * 10) % f.len; const p = at(f.pts, f.phase[i]); const o = (f.off + i) * 3; pos[o] = p.x; pos[o + 1] = p.y + 0.02; pos[o + 2] = p.z; }
      });
      geo.attributes.position.needsUpdate = true;
      arrow.position.x = Math.sin(t * 3) * 0.08;
    });

    /* side panel */
    const side = ctx.side; side.replaceChildren();
    const seg = el("div", "cl-seg"); seg.setAttribute("role", "group"); seg.setAttribute("aria-label", "Wiring");
    const modes = [["R₁ only", 0], ["Series", 1], ["Parallel", 2]].map(([txt, m]) => actionButton(seg, txt, () => { ctx.set("mode", m); }, "cl-opt"));
    side.appendChild(seg);
    const sl = sliders(ctx, side, { skip: ["mode"] }), facts = factsView(ctx, side);
    const r2row = sl.root.querySelector('[data-var="R2"]');
    const graph = el("canvas", "cl-graph"); graph.width = 340; graph.height = 190; graph.setAttribute("role", "img"); graph.setAttribute("aria-label", "V–I graph");
    const gh = el("h3", "cl-h", "V–I graph · V–I आलेख"); side.insertBefore(gh, facts.root); side.insertBefore(graph, facts.root);
    const drawGraph = () => {
      const C = cur, g = C2.prep(graph, 340, 190, "#0b1424"), x0 = 38, y0 = 160, x1 = 322, y1 = 16, Imx = Math.max(VMAX / C.Req, 1e-6);
      C2.arrow(g, x0, y0, x1, y0, "#9fb3c8", 1.5, 7); C2.arrow(g, x0, y0, x0, y1, "#9fb3c8", 1.5, 7);
      C2.text(g, "V (V)", x1 - 14, y0 + 16, { size: 11, color: "#9fb3c8" }); C2.text(g, "I (A)", x0 + 4, y1 - 4, { size: 11, color: "#9fb3c8", align: "left" });
      C2.line(g, [[x0, y0], [x1 - 10, y1 + 8]], "#ffd23f", 3);
      const px = x0 + ((x1 - 10 - x0) * C.V) / VMAX, py = y0 - ((y0 - y1 - 8) * C.I) / Imx;
      C2.line(g, [[px, y0], [px, py], [x0, py]], "rgba(255,255,255,.35)", 1, [4, 4]); C2.circle(g, px, py, 6, { stroke: "#fff", fill: "#ff5d5d", w: 2 });
      C2.text(g, `slope = 1/R = ${fmt(1 / C.Req, 3)} A/V`, 190, 182, { size: 11, color: "#ffd23f" });
    };
    const presets = el("div", "cl-presets"); presets.appendChild(el("span", "cl-lab", "Try · आज़माओ"));
    const jump = (txt, fn) => actionButton(presets, txt, () => { fn(); sl.sync(); }, "cl-chipb");
    jump("V × 2", () => ctx.set("V", ctx.vars.V * 2)); jump("V ÷ 2", () => ctx.set("V", ctx.vars.V / 2));
    jump("R₁ × 2", () => ctx.set("R1", ctx.vars.R1 * 2)); jump("R₁ ÷ 2", () => ctx.set("R1", Math.max(1, Math.round(ctx.vars.R1 / 2))));
    jump("🎲 Random", () => { ctx.set("V", 1.5 * (1 + Math.floor(Math.random() * 8))); ctx.set("R1", 1 + Math.floor(Math.random() * 20)); ctx.set("R2", 1 + Math.floor(Math.random() * 20)); });
    side.insertBefore(presets, gh);
    const probeHud = el("div", "cl-presets"); probeHud.appendChild(el("span", "cl-lab", "🔍 Live Probe · मापक जाँच"));
    const probeRead = el("p", "cl-note", "Circuit Total: V = 6.0 V · I = 1.00 A · P = 6.0 W");
    let probeTarget = "all";
    const updateProbe = () => {
      const C = cur, blown = C.I > 6.5;
      if (blown) { probeRead.textContent = `🚨 FUSE BLOWN (I = ${fmt(C.I, 2)} A > 6.5 A)! Lower voltage or increase R.`; return; }
      if (probeTarget === "r1") probeRead.textContent = `Probe R₁ (${C.R1} Ω): V₁ = ${fmt(C.V1, 2)} V · I₁ = ${fmt(C.mode === 2 ? C.I1 : C.I, 2)} A · P₁ = ${fmt(C.P1, 2)} W`;
      else if (probeTarget === "r2") probeRead.textContent = C.mode === 0 ? "R₂ is disconnected in Single mode." : `Probe R₂ (${C.R2} Ω): V₂ = ${fmt(C.V2, 2)} V · I₂ = ${fmt(C.mode === 2 ? C.I2 : C.I, 2)} A · P₂ = ${fmt(C.P2, 2)} W`;
      else if (probeTarget === "fuse") probeRead.textContent = `Probe Safety Fuse (6.5 A rating): carrying ${fmt(C.I, 2)} A (${Math.round((C.I / 6.5) * 100)}% load)`;
      else probeRead.textContent = `Total Circuit: Req = ${fmt(C.Req, 2)} Ω · I = ${fmt(C.I, 2)} A · P = ${fmt(C.P, 1)} W`;
    };
    [["Total", "all"], ["Probe R₁", "r1"], ["Probe R₂", "r2"], ["Probe Fuse", "fuse"]].forEach(([lbl, pk]) => {
      actionButton(probeHud, lbl, () => { probeTarget = pk; sfx.play("tick"); updateProbe(); }, "cl-chipb");
    });
    side.insertBefore(probeHud, gh); side.insertBefore(probeRead, gh);
    note(side, "The ammeter is connected in series and the voltmeter in parallel. Current flows from + to −; electrons drift the opposite way. The glowing resistor shows the heating effect of current.", "अमीटर श्रेणी में और वोल्टमीटर पार्श्व में जुड़ता है। धारा + से − की ओर बहती है, इलेक्ट्रॉन उल्टी दिशा में। चमकता प्रतिरोधक धारा का ऊष्मीय प्रभाव दिखाता है।");
    const paint = () => { modes.forEach((b, i) => { b.classList.toggle("on", ctx.vars.mode === i); b.setAttribute("aria-pressed", String(ctx.vars.mode === i)); }); r2row.style.display = ctx.vars.mode === 0 ? "none" : ""; updateProbe(); };
    const off = bus.on("sim:change", e => { if (e.labId !== "ohm") return; rebuild(); facts.update(); sl.sync(); paint(); drawGraph(); });
    rebuild(); facts.update(); paint(); drawGraph(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ V: seen(q, "V"), R1: seen(q, "R1"), R2: seen(q, "R2"), mode: q.vars.mode }), n1 = x => fmt(x, 2);
    const NAMES = { ammeter: ["Ammeter", "अमीटर"], voltmeter: ["Voltmeter", "वोल्टमीटर"], resistor: ["Resistor", "प्रतिरोधक"], battery: ["Battery of cells", "सेलों की बैटरी"] };
    const NAME_POOL = [["Ammeter", "अमीटर"], ["Voltmeter", "वोल्टमीटर"], ["Resistor", "प्रतिरोधक"], ["Battery of cells", "सेलों की बैटरी"], ["Rheostat", "धारा नियंत्रक (रिओस्टेट)"]];
    const WHY = { ammeter: ["It is connected in series and measures the current in the circuit.", "यह श्रेणी क्रम में जुड़ा है और परिपथ में धारा मापता है।"], voltmeter: ["It is connected in parallel across the resistor and measures the potential difference.", "यह प्रतिरोधक के पार्श्व में जुड़ा है और विभवांतर मापता है।"], resistor: ["It is the component that opposes the flow of current: a resistor.", "यह धारा के प्रवाह का विरोध करने वाला अवयव — प्रतिरोधक है।"], battery: ["Cells joined together form a battery; the long plate is the positive terminal.", "कई सेल जुड़कर बैटरी बनाते हैं; लंबी पट्टी धनात्मक सिरा है।"] };

    /* 1 · perfect name of the circled component */
    { const x = v(), names = ["ammeter", "voltmeter", "resistor", "battery"], key = names[Math.floor(q.rnd() * names.length)], c = NAMES[key], d = withDistractors(c, NAME_POOL, 3, q.rnd);
      out.push(ask({ id: "ohm-name", prompt: ["Perfect name of the component circled in red?", "लाल घेरे में दिखाए गए अवयव का सही नाम?"], image: { vars: x, focus: key }, options: d.options, correct: d.correct, why: WHY[key] })); }

    /* 2 · predict: change the voltage, or every resistor together (so the ratio is always a clean 2, ½, … whatever the wiring) */
    { const x = v(), both = x.mode === 0 ? ["R1"] : ["R1", "R2"], ok2 = f => both.every(k => (f === 2 ? x[k] * 2 <= 20 : x[k] % 2 === 0)),
        cases = [["V", 2, x.V * 2 <= VMAX], ["V", 0.5, Math.abs(x.V / 2 / 1.5 - Math.round(x.V / 2 / 1.5)) < 1e-9 && x.V / 2 >= 1.5], ["R", 2, ok2(2)], ["R", 0.5, ok2(0.5)]].filter(c => c[2]);
      if (cases.length) {
        const [k, f] = cases[Math.floor(q.rnd() * cases.length)], y = { ...x }; if (k === "V") y.V = x.V * f; else both.forEach(r => { y[r] = x[r] * f; });
        const a = view(x), b = view(y), ratio = b.I / a.I;
        const OPT = [[0.25, "becomes one-fourth (× ¼)", "एक-चौथाई हो जाती है"], [0.5, "becomes half (× ½)", "आधी हो जाती है"], [1, "stays the same", "वही रहती है"], [2, "becomes double (× 2)", "दोगुनी हो जाती है"], [4, "becomes four times (× 4)", "चार गुनी हो जाती है"]], hit = OPT.find(o => Math.abs(o[0] - ratio) < 1e-9);
        if (hit) {
          const c = [hit[1], hit[2]], d = withDistractors(c, OPT.map(o => [o[1], o[2]]), 3, q.rnd), many = x.mode !== 0,
            what = k === "V" ? (f === 2 ? ["The battery voltage is doubled", "बैटरी की वोल्टता दोगुनी कर दी गई"] : ["The battery voltage is halved", "बैटरी की वोल्टता आधी कर दी गई"])
              : f === 2 ? [many ? "Both resistors are doubled" : "The resistor is doubled", many ? "दोनों प्रतिरोधक दोगुने कर दिए गए" : "प्रतिरोधक दोगुना कर दिया गया"] : [many ? "Both resistors are halved" : "The resistor is halved", many ? "दोनों प्रतिरोधक आधे कर दिए गए" : "प्रतिरोधक आधा कर दिया गया"];
          out.push(ask({ id: "ohm-predict", kind: "predict", prompt: [`${what[0]} (${MODE_NAME[x.mode]}). What happens to the current from the battery?`, `${what[1]} (${MODE_HI[x.mode]})। बैटरी से बहने वाली धारा का क्या होगा?`], image: { vars: x }, options: d.options, correct: d.correct, meta: { a: x, b: y, ratio: hit[0] },
            why: [`I changes from ${n1(a.I)} A to ${n1(b.I)} A. Ohm's law: I = V / R.`, `धारा ${n1(a.I)} A से ${n1(b.I)} A हो जाती है। ओम का नियम: I = V / R।`] }));
        }
      } }

    /* 3 · name of the arrangement (series / parallel) */
    { const x = v(); x.mode = q.vars.mode === 0 ? (q.rnd() < 0.5 ? 1 : 2) : q.vars.mode; const C = view(x), s = x.mode === 1, c = s ? ["Resistors in series", "श्रेणी क्रम में प्रतिरोधक"] : ["Resistors in parallel", "पार्श्व क्रम में प्रतिरोधक"],
        pool = [s ? ["Resistors in parallel", "पार्श्व क्रम में प्रतिरोधक"] : ["Resistors in series", "श्रेणी क्रम में प्रतिरोधक"], ["A short circuit", "लघुपथन (शॉर्ट सर्किट)"], ["An open circuit", "खुला परिपथ"]], d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "ohm-arrangement", prompt: ["Perfect name of the way R₁ and R₂ are connected?", "R₁ और R₂ के जुड़ने के ढंग का सही नाम?"], image: { vars: x }, options: d.options, correct: d.correct,
        why: s ? [`The same current passes through both, one after the other: R = R₁ + R₂ = ${n1(C.Req)} Ω.`, `दोनों से एक के बाद एक वही धारा गुजरती है: R = R₁ + R₂ = ${n1(C.Req)} Ω।`] : [`Both are connected between the same two points; the currents add: 1/R = 1/R₁ + 1/R₂, R = ${n1(C.Req)} Ω.`, `दोनों एक ही दो बिंदुओं के बीच जुड़े हैं; धाराएँ जुड़ती हैं: 1/R = 1/R₁ + 1/R₂, R = ${n1(C.Req)} Ω।`] })); }

    /* 4 · equivalent resistance */
    { const x = v(); x.mode = q.vars.mode === 0 ? 1 : q.vars.mode; const C = view(x), t = r => [`${n1(r)} Ω`, `${n1(r)} Ω`], c = t(C.Req), series = x.R1 + x.R2, par = (x.R1 * x.R2) / (x.R1 + x.R2),
        pool = [t(x.mode === 1 ? par : series), t(Math.abs(x.R1 - x.R2) || x.R1 * 2), t(x.R1 * x.R2), t(C.Req * 2)], uniq = [], seenT = new Set([c[0]]); pool.forEach(o => { if (!seenT.has(o[0])) { seenT.add(o[0]); uniq.push(o); } });
      const d = withDistractors(c, uniq, 3, q.rnd);
      out.push(ask({ id: "ohm-req", kind: "predict", prompt: [`R₁ = ${x.R1} Ω and R₂ = ${x.R2} Ω are joined ${MODE_NAME[x.mode]}. What is the total resistance?`, `R₁ = ${x.R1} Ω और R₂ = ${x.R2} Ω ${MODE_HI[x.mode]} जुड़े हैं। कुल प्रतिरोध कितना है?`], image: { vars: x }, options: d.options, correct: d.correct,
        why: x.mode === 1 ? [`Series: R = R₁ + R₂ = ${x.R1} + ${x.R2} = ${n1(C.Req)} Ω.`, `श्रेणी में: R = R₁ + R₂ = ${x.R1} + ${x.R2} = ${n1(C.Req)} Ω।`] : [`Parallel: 1/R = 1/${x.R1} + 1/${x.R2}, so R = ${n1(C.Req)} Ω.`, `पार्श्व में: 1/R = 1/${x.R1} + 1/${x.R2}, अतः R = ${n1(C.Req)} Ω।`] })); }

    /* 5 · name the law from the V–I graph */
    { const x = v(), c = ["Ohm's law", "ओम का नियम"], pool = [["Joule's law of heating", "जूल का ऊष्मा-नियम"], ["Newton's second law", "न्यूटन का दूसरा नियम"], ["Law of reflection", "परावर्तन का नियम"]], d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "ohm-law", prompt: ["Perfect name of the law shown by this straight-line V–I graph?", "इस सरल रेखा वाले V–I आलेख द्वारा दिखाए गए नियम का सही नाम?"], image: { vars: { ...x, mode: 0 }, focus: "graph" }, options: d.options, correct: d.correct,
        why: ["A straight line through the origin means V ∝ I, so V / I = R is constant: Ohm's law.", "मूल बिंदु से जाती सरल रेखा का अर्थ V ∝ I है, अतः V / I = R स्थिर है: ओम का नियम।"] })); }

    /* 6 · name the effect (resistor glowing) */
    { const x = v(), c = ["Heating effect of current", "धारा का ऊष्मीय प्रभाव"], pool = [["Magnetic effect of current", "धारा का चुंबकीय प्रभाव"], ["Chemical effect of current", "धारा का रासायनिक प्रभाव"], ["Photoelectric effect", "प्रकाश-विद्युत प्रभाव"]], d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "ohm-heat", prompt: ["The resistor glows hot. Perfect name of this effect of current?", "प्रतिरोधक गरम होकर चमक रहा है। धारा के इस प्रभाव का सही नाम?"], image: { vars: x, focus: "heat" }, options: d.options, correct: d.correct,
        why: [`Electrical energy turns into heat in a resistor: H = V I t (Joule's law of heating). Here P = ${n1(view(x).P)} W.`, `प्रतिरोधक में विद्युत ऊर्जा ऊष्मा में बदलती है: H = V I t (जूल का ऊष्मा-नियम)। यहाँ P = ${n1(view(x).P)} W।`] })); }
    return out;
  }
};
