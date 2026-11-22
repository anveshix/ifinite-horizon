/* Curiosity Lab · Lens Lab — convex & concave lenses (NCERT Class X, Ch 9 Light – Reflection and Refraction).
   Student moves the object (u) and changes the focal length (f); the 3D bench shows the three principal rays and the image forming live. */
import { bus } from "../core.js";
import { lens, lensNature, lensRays, slabModel, fmt } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, tube, disposeObject, sliders, factsView, note, actionButton, el, esc, C2, ask, seen, withDistractors, shuffle } from "./kit.js";

const S = 0.1;                                          // scene units per cm
const HI = { real: "वास्तविक", virtual: "काल्पनिक", inverted: "उल्टा", erect: "सीधा", magnified: "आवर्धित", diminished: "छोटा", "same size": "बराबर आकार", "highly magnified": "बहुत अधिक आवर्धित" };
const natureHi = L => `${HI[L.real ? "real" : "virtual"]}, ${HI[L.inverted ? "inverted" : "erect"]}, ${HI[L.size]}`;
/* position of the image → bilingual wording used in the facts panel and in the quiz */
const POS = {
  inf: ["At infinity", "अनंत पर"], beyond: ["Beyond 2F (other side)", "2F से परे (दूसरी ओर)"], at2f: ["At 2F (other side)", "2F पर (दूसरी ओर)"],
  f2f: ["Between F and 2F (other side)", "F और 2F के बीच (दूसरी ओर)"], fo: ["Between F and O (same side as the object)", "F और O के बीच (वस्तु की ओर)"],
  same: ["Same side as the object, farther than the object", "वस्तु की ओर, वस्तु से भी दूर"]
};
const posKey = L => L.type === -1 ? "fo" : L.atInfinity ? "inf" : L.u > 2 * L.f + 1e-9 ? "f2f" : Math.abs(L.u - 2 * L.f) < 1e-9 ? "at2f" : L.u > L.f ? "beyond" : "same";
const view = v => lens({ u: v.u, f: v.f, type: v.type });

/* ---------------------------------------------------------------- 2D ray diagram (used for the quiz) */
function snapshot(canvas, vars, focus) {
  const L = view(vars), W = 720, H = 340, g = C2.prep(canvas, W, H, "#0b1424");
  const xr = Math.min(95, Math.max(45, L.u * 1.15, L.f * 2.5)), sx = (W - 36) / (2 * xr), tall = Math.min(Math.abs(L.hImg), L.h * 3), sy = Math.min(sx * 1.7, (H / 2 - 30) / (Math.max(tall, L.h) * 1.12)), ox = W / 2, oy = H / 2 + 6;   // vertical scale: keep the image arrow on the canvas
  const X = x => ox + x * sx, Y = y => oy - y * sy, cl = y => Math.max(8, Math.min(H - 8, y));
  C2.line(g, [[10, oy], [W - 10, oy]], "#8da2c4", 1.5);                                   // principal axis
  [[-1, "F"], [1, "F"]].forEach(([s, n]) => { C2.line(g, [[X(s * L.f), oy - 6], [X(s * L.f), oy + 6]], "#cfe0ff", 2); C2.text(g, n, X(s * L.f), oy + 20, { size: 14, color: "#cfe0ff" }); });
  [[-1], [1]].forEach(([s]) => { C2.line(g, [[X(s * 2 * L.f), oy - 6], [X(s * 2 * L.f), oy + 6]], "#cfe0ff", 2); C2.text(g, "2F", X(s * 2 * L.f), oy + 20, { size: 14, color: "#cfe0ff" }); });
  C2.text(g, "O", ox + 11, oy + 20, { size: 14, color: "#cfe0ff" });
  /* the lens symbol */
  const top = 22, bot = H - 22;
  C2.line(g, [[ox, top], [ox, bot]], "#7fd4ff", 3);
  if (focus !== "plainLens") {
    const cv = L.type === 1;                              // convex: arrow tips point outward · concave: inward
    C2.line(g, [[ox - 9, cv ? top + 11 : top], [ox, cv ? top : top + 11], [ox + 9, cv ? top + 11 : top]], "#7fd4ff", 3);
    C2.line(g, [[ox - 9, cv ? bot - 11 : bot], [ox, cv ? bot : bot - 11], [ox + 9, cv ? bot - 11 : bot]], "#7fd4ff", 3);
  }
  /* rays */
  lensRays(L, xr * 1.05).forEach(r => {
    C2.line(g, r.before.map(([x, y]) => [X(x), cl(Y(y))]), r.color, 2);
    C2.line(g, r.after.map(([x, y]) => [X(x), cl(Y(y))]), r.color, 2);
    if (r.back) C2.line(g, r.back.map(([x, y]) => [X(x), cl(Y(y))]), r.color, 1.5, [5, 5]);
  });
  /* object and image */
  C2.arrow(g, X(-L.u), oy, X(-L.u), Y(L.h), "#ff9f43", 4, 11); C2.text(g, "Object · वस्तु", X(-L.u), Math.max(14, Y(L.h) - 14), { size: 13, color: "#ffb86b" });
  if (focus !== "hideImage" && !L.atInfinity) {
    const ix = X(L.v), iy = Y(L.hImg), real = L.real;
    if (real) C2.arrow(g, ix, oy, ix, cl(iy), "#5ce1ff", 4, 11); else { g.save(); g.setLineDash([6, 5]); C2.arrow(g, ix, oy, ix, cl(iy), "#7cf7c1", 3, 10); g.restore(); }
    C2.text(g, "Image · प्रतिबिंब", ix, cl(iy) + (L.hImg >= 0 ? -14 : 16), { size: 13, color: real ? "#5ce1ff" : "#7cf7c1" });
  } else if (L.atInfinity) C2.text(g, "Image at infinity · अनंत पर →", W - 120, oy - 24, { size: 14, color: "#5ce1ff" });
  return canvas;
}

/* ---------------------------------------------------------------- the lab */
export default {
  id: "lens", cls: 10, unit: "x/ch9", icon: "🔭",
  title: { en: "Lens Lab — convex & concave", hi: "लेंस प्रयोगशाला — उत्तल व अवतल" },
  blurb: { en: "Slide the object and watch the image jump, flip and grow. Find where it vanishes to infinity.", hi: "वस्तु को खिसकाओ और देखो प्रतिबिंब कैसे उछलता, पलटता और बढ़ता है।" },
  vars: [
    { id: "u", label: { en: "Object distance u", hi: "वस्तु की दूरी u" }, unit: "cm", min: 5, max: 70, step: 1, value: 30 },
    { id: "f", label: { en: "Focal length f", hi: "फोकस दूरी f" }, unit: "cm", min: 8, max: 30, step: 1, value: 15 },
    { id: "type", label: { en: "Lens type (+1 convex · −1 concave)", hi: "लेंस का प्रकार" }, unit: "", min: -1, max: 1, step: 2, value: 1 }
  ],

  facts(v) {
    const L = view(v);
    return [
      { id: "v", en: "Image distance v", hi: "प्रतिबिंब की दूरी v", value: L.atInfinity ? "∞ (rays emerge parallel)" : `${fmt(L.v, 1)} cm ${L.v > 0 ? "(other side of lens)" : "(same side as object)"}` },
      { id: "m", en: "Magnification m = v/u", hi: "आवर्धन m", value: L.atInfinity ? "∞" : fmt(L.m, 2) },
      { id: "nature", en: "Nature of image", hi: "प्रतिबिंब की प्रकृति", value: `${lensNature(L)} · ${natureHi(L)}` },
      { id: "pos", en: "Position of image", hi: "प्रतिबिंब की स्थिति", value: `${POS[posKey(L)][0]} · ${POS[posKey(L)][1]}` },
      { id: "P", en: "Power of lens P = 1/f", hi: "लेंस की क्षमता", value: `${fmt(L.power, 1)} D (dioptre)` }
    ];
  },
  snapshot,
  missions: [
    { id: "lens-2f", en: "Make a real, same-size inverted image (set u = 2f)", hi: "उल्टा और वस्तु के बराबर वास्तविक प्रतिबिंब बनाओ (u = 2f)", check: v => v.type === 1 && Math.abs(v.u - 2 * v.f) < 1e-6 },
    { id: "lens-mag", en: "Create a magnified virtual image (magnifying glass: u < f)", hi: "आवर्धक लेंस से बड़ा आभासी प्रतिबिंब बनाओ (u < f)", check: v => v.type === 1 && v.u < v.f },
    { id: "lens-concave", en: "Switch to a concave lens and observe virtual diminished image", hi: "अवतल लेंस चुनकर हमेशा छोटा आभासी प्रतिबिंब देखो", check: v => v.type === -1 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0.4, 2.8, 12.2], target: [0, 0.3, 0], minDist: 5, maxDist: 24 });
    const { scene } = st, dyn = new THREE.Group(); scene.add(dyn);

    /* optical bench (static) */
    const bench = new THREE.Mesh(new THREE.BoxGeometry(18.4, 0.14, 1.7), new THREE.MeshStandardMaterial({ color: 0x25334f, roughness: 0.7 })); bench.position.y = -0.09; scene.add(bench);
    for (let i = -9; i <= 9; i++) { const t = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, i % 5 === 0 ? 0.5 : 0.22), new THREE.MeshBasicMaterial({ color: 0x8aa0c4 })); t.position.set(i, 0.0, 0.62); scene.add(t); }
    scene.add(tube(THREE, [[-9.2, 0, 0], [9.2, 0, 0]], 0x9fb3c8, 0.014));
    const mkPost = (x, h) => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, h, 12), new THREE.MeshStandardMaterial({ color: 0x8091ad })); p.position.set(x, -h / 2 - 0.02, 0); return p; };
    scene.add(mkPost(0, 0.9));
    const sprO = labelSprite(THREE, "O", "", { scale: 0.8, size: 30 }); sprO.position.set(0.28, -0.42, 0.9); scene.add(sprO);
    const marks = { F1: labelSprite(THREE, "F", "", { scale: 0.8 }), F2: labelSprite(THREE, "F", "", { scale: 0.8 }), T1: labelSprite(THREE, "2F", "", { scale: 0.8 }), T2: labelSprite(THREE, "2F", "", { scale: 0.8 }) };
    Object.values(marks).forEach(m => { m.position.y = -0.42; m.position.z = 0.9; scene.add(m); });
    const fdots = [-1, 1, -2, 2].map(s => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshBasicMaterial({ color: Math.abs(s) === 1 ? 0xffe066 : 0xb8c7e6 })); scene.add(d); return [s, d]; });

    /* lens body (rebuilt when f or type changes) */
    let lensMesh = null, lensKey = "";
    const buildLens = v => {
      const key = v.f + "/" + v.type; if (key === lensKey) return; lensKey = key;
      if (lensMesh) { scene.remove(lensMesh); disposeObject(lensMesh); }
      const R = 1.9, pf = Math.pow(10 / v.f, 0.6), prof = [], n = 18;
      const th = r => v.type === 1 ? 0.07 + 0.5 * pf * (1 - (r / R) ** 2) : 0.05 + 0.5 * pf * (r / R) ** 2 * 1.1;
      for (let i = 0; i <= n; i++) { const r = (R * i) / n; prof.push(new THREE.Vector2(r, -th(r))); }
      for (let i = n; i >= 0; i--) { const r = (R * i) / n; prof.push(new THREE.Vector2(r, th(r))); }
      const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 56), new THREE.MeshStandardMaterial({ color: 0x9bdcff, transparent: true, opacity: 0.42, roughness: 0.08, side: THREE.DoubleSide, depthWrite: false }));
      const ring = new THREE.Mesh(new THREE.TorusGeometry(R, 0.045, 10, 64), new THREE.MeshStandardMaterial({ color: 0xc7d2e5, metalness: 0.4, roughness: 0.4 })); ring.rotation.x = Math.PI / 2;
      lensMesh = new THREE.Group(); lensMesh.add(body, ring); lensMesh.rotation.z = Math.PI / 2; scene.add(lensMesh);   // lathe axis (Y) becomes the optical axis (X)
    };

    /* arrow made of a rod + cone, height 1 along +y, so scale.y = signed height in scene units */
    const arrow = (color, opacity = 1) => {
      const g = new THREE.Group(), m = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.35, transparent: opacity < 1, opacity, roughness: 0.4 });
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.82, 12), m); rod.position.y = 0.41;
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.2, 16), m); tip.position.y = 0.9;
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.03, 20), m); base.position.y = 0.0;
      g.add(rod, tip, base); g.userData.mat = m; return g;
    };
    const obj = arrow(0xff9f43); obj.scale.y = 8 * S; scene.add(obj);
    const objTag = labelSprite(THREE, "Object", "वस्तु", { scale: 0.9, size: 28 }); scene.add(objTag);
    const img = arrow(0x5ce1ff); scene.add(img);
    const imgTag = labelSprite(THREE, "Image", "प्रतिबिंब", { scale: 0.9, size: 28, color: "#9ff0ff" }); scene.add(imgTag);
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.04, 3.9, 2.0), new THREE.MeshStandardMaterial({ color: 0xe8eef9, transparent: true, opacity: 0.32 })); scene.add(screen);
    const farTag = labelSprite(THREE, "Image at infinity →", "प्रतिबिंब अनंत पर →", { scale: 1.1, size: 28, color: "#9ff0ff" }); farTag.position.set(6.4, 1.6, 0); scene.add(farTag);
    let pop = 0;

    const update = () => {
      const v = ctx.vars, L = view(v);
      buildLens(v);
      marks.F1.position.x = -v.f * S; marks.F2.position.x = v.f * S; marks.T1.position.x = -2 * v.f * S; marks.T2.position.x = 2 * v.f * S;
      fdots.forEach(([s, d]) => d.position.set(s * v.f * S, 0, 0));
      obj.position.set(-v.u * S, 0, 0); objTag.position.set(-v.u * S, L.h * S + 0.6, 0);
      /* image */
      const far = L.atInfinity || Math.abs(L.v * S) > 8.6, tall = Math.abs(L.hImg * S) > 3.3;
      img.visible = imgTag.visible = !L.atInfinity; farTag.visible = L.atInfinity;
      if (!L.atInfinity) {
        const x = Math.max(-8.6, Math.min(8.6, L.v * S)), hh = Math.max(-3.3, Math.min(3.3, L.hImg * S));
        img.position.set(x, 0, 0); img.scale.set(1, hh || 0.001, 1);
        img.userData.mat.color.setHex(L.real ? 0x5ce1ff : 0x7cf7c1); img.userData.mat.emissive.setHex(L.real ? 0x5ce1ff : 0x7cf7c1); img.userData.mat.opacity = L.real ? 1 : 0.55; img.userData.mat.transparent = !L.real;
        imgTag.position.set(x, hh >= 0 ? hh + 0.55 : hh - 0.55, 0);
        imgTag.material.opacity = far || tall ? 0.7 : 1;
      }
      screen.visible = L.real && !L.atInfinity && Math.abs(L.v * S) <= 8.5; if (screen.visible) screen.position.set(L.v * S, 0, 0);
      /* rays */
      disposeObject(dyn); dyn.clear();
      lensRays(L, 86).forEach(r => {
        const P = ([x, y]) => [x * S, Math.max(-9, Math.min(9, y * S)), 0];
        dyn.add(tube(THREE, r.before.map(P), r.color, 0.022));
        dyn.add(tube(THREE, r.after.map(P), r.color, 0.022));
        if (r.back) dyn.add(tube(THREE, r.back.map(P), r.color, 0.016, { dashed: true, opacity: 0.8 }));
      });
      pop = 1;
    };
    const stopFrame = st.onFrame((dt, t) => {
      if (pop > 0) { pop = Math.max(0, pop - dt * 3.2); const k = 1 + 0.12 * Math.sin(pop * Math.PI); img.scale.x = k; img.scale.z = k; }
      farTag.position.y = 1.6 + Math.sin(t * 2.2) * 0.08;
    });

    let slabMode = false, slabI = 45, slabN = 1.5;
    const slabGrp = new THREE.Group(); slabGrp.visible = false; scene.add(slabGrp);
    const drawSlab3D = () => {
      disposeObject(slabGrp); slabGrp.clear();
      const sm = slabModel({ angleI: slabI, n: slabN, thickness: 4 });
      const block = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 2.2), new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.28, roughness: 0.08 }));
      block.position.set(0, 1.1, 0); slabGrp.add(block);
      const radI = (slabI * Math.PI) / 180, radR = (sm.angleR * Math.PI) / 180;
      const inY = 1.1 + Math.tan(radI) * 2.5, pEnter = [-1.6, 1.1, 0], pExit = [1.6, 1.1 - Math.tan(radR) * 3.2, 0];
      const pOut = [pExit[0] + 2.5, pExit[1] - Math.tan(radI) * 2.5, 0];
      slabGrp.add(tube(THREE, [[-1.6 - 2.5, inY, 0], pEnter], 0xfde047, 0.032));
      slabGrp.add(tube(THREE, [pEnter, pExit], 0x4ade80, 0.032));
      slabGrp.add(tube(THREE, [pExit, pOut], 0xfde047, 0.032));
      slabGrp.add(tube(THREE, [[-2.6, 1.1, 0], [0.2, 1.1, 0]], 0x94a3b8, 0.015, { dashed: true }));
      const lbl = labelSprite(THREE, `i = ${slabI}° → r = ${sm.angleR}° (n = ${slabN})`, `Lateral shift d = ${sm.lateralShift} cm`, { scale: 0.85, size: 24, color: "#fef08a" });
      lbl.position.set(0, 2.75, 0); slabGrp.add(lbl);
    };
    const setOpticMode = onSlab => {
      slabMode = onSlab;
      if (lensMesh) lensMesh.visible = !onSlab;
      obj.visible = !onSlab; objTag.visible = !onSlab; dyn.visible = !onSlab;
      if (onSlab) { img.visible = false; imgTag.visible = false; screen.visible = false; farTag.visible = false; drawSlab3D(); }
      slabGrp.visible = onSlab;
      slabBox.hidden = !onSlab;
      bSlab.classList.toggle("on", onSlab);
      if (!onSlab) update();
    };

    /* side panel */
    const side = ctx.side; side.replaceChildren();
    const sl = sliders(ctx, side, { skip: ["type"] }), facts = factsView(ctx, side);
    const row = el("div", "cl-seg"); row.setAttribute("role", "group"); row.setAttribute("aria-label", "Lens type");
    const bC = actionButton(row, "Convex · उत्तल", () => { setOpticMode(false); pickType(1); }, "cl-opt"),
      bV = actionButton(row, "Concave · अवतल", () => { setOpticMode(false); pickType(-1); }, "cl-opt"),
      bSlab = actionButton(row, "Glass Slab · स्लैब", () => setOpticMode(!slabMode), "cl-opt");
    const paintType = () => { bC.classList.toggle("on", !slabMode && ctx.vars.type === 1); bV.classList.toggle("on", !slabMode && ctx.vars.type === -1); bC.setAttribute("aria-pressed", String(!slabMode && ctx.vars.type === 1)); bV.setAttribute("aria-pressed", String(!slabMode && ctx.vars.type === -1)); };
    const pickType = t => { ctx.set("type", t); paintType(); };
    side.insertBefore(row, sl.root);
    const slabBox = el("div", "cl-presets"); slabBox.hidden = true;
    slabBox.innerHTML = `<span class="cl-lab">Snell's Law · n₁ sin i = n₂ sin r</span>`;
    [["i = 30°", 30, 1.5], ["i = 55°", 55, 1.5], ["Water n=1.33", 45, 1.33], ["Diamond n=2.42", 45, 2.42]].forEach(([lbl, ii, nn]) => {
      actionButton(slabBox, lbl, () => { slabI = ii; slabN = nn; sfx.play("pop"); drawSlab3D(); }, "cl-chipb");
    });
    side.insertBefore(slabBox, sl.root);
    const presets = el("div", "cl-presets"); presets.appendChild(el("span", "cl-lab", "Try · आज़माओ"));
    const jump = (txt, fn) => actionButton(presets, txt, () => { fn(); sl.sync(); }, "cl-chipb");
    jump("u = 2f", () => ctx.set("u", Math.min(70, Math.max(5, 2 * ctx.vars.f))));
    jump("u = f", () => ctx.set("u", ctx.vars.f));
    jump("u = f ÷ 2", () => ctx.set("u", Math.max(5, Math.round(ctx.vars.f / 2))));
    jump("🎲 Random", () => { ctx.set("u", 5 + Math.floor(Math.random() * 66)); ctx.set("f", 8 + Math.floor(Math.random() * 23)); });
    side.insertBefore(presets, sl.root.nextSibling);
    note(side, "Rays: red = parallel to axis · yellow = through the optical centre · green = through the focus. Dashed lines show where a virtual image appears to be.", "लाल किरण अक्ष के समानांतर, पीली प्रकाशिक केंद्र से, हरी फोकस से। बिंदीदार रेखा काल्पनिक प्रतिबिंब दिखाती है।");
    const off = bus.on("sim:change", e => { if (e.labId !== "lens") return; update(); facts.update(); sl.sync(); paintType(); });
    paintType(); update(); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  /* ---------------------------------------------------------------- visual questions built from what the student explored */
  questions(q) {
    const out = [], T = q.vars.type, base = () => ({ u: seen(q, "u"), f: seen(q, "f"), type: T });
    const nat = L => L.atInfinity ? ["Real, inverted, highly magnified (image at infinity)", "वास्तविक, उल्टा, बहुत अधिक आवर्धित (अनंत पर)"] : [cap(lensNature(L)), natureHi(L)];
    const cap = s => s[0].toUpperCase() + s.slice(1);
    const NAT = [["Real, inverted, magnified", "वास्तविक, उल्टा, आवर्धित"], ["Real, inverted, diminished", "वास्तविक, उल्टा, छोटा"], ["Real, inverted, same size", "वास्तविक, उल्टा, बराबर आकार"], ["Virtual, erect, magnified", "काल्पनिक, सीधा, आवर्धित"], ["Virtual, erect, diminished", "काल्पनिक, सीधा, छोटा"]];

    /* 1 · perfect name of the image */
    { const v = base(), L = view(v), c = nat(L), pool = NAT.filter(o => o[0] !== c[0]), d = withDistractors(c, [...pool, c], 3, q.rnd);
      out.push(ask({ id: "lens-nature", prompt: ["Look at the ray diagram. Which is the perfect description of the image?", "किरण आरेख देखो। प्रतिबिंब का सही वर्णन कौन-सा है?"], image: { vars: v }, options: d.options, correct: d.correct,
        why: [`With u = ${v.u} cm and f = ${v.f} cm the lens formula gives v = ${fmt(L.v, 1)} cm and m = ${fmt(L.m, 2)}, so the image is ${lensNature(L)}.`, `u = ${v.u} cm, f = ${v.f} cm पर लेंस सूत्र से v = ${fmt(L.v, 1)} cm और m = ${fmt(L.m, 2)} आता है, इसलिए प्रतिबिंब ${natureHi(L)} है।`] })); }

    /* 2 · where is the image */
    { const v = base(), L = view(v), k = posKey(L), keys = Object.keys(POS), c = POS[k], pool = keys.filter(x => x !== k).map(x => POS[x]), d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "lens-position", prompt: ["Where is the image formed in this arrangement?", "इस व्यवस्था में प्रतिबिंब कहाँ बनता है?"], image: { vars: v }, options: d.options, correct: d.correct,
        why: [`The image distance is v = ${L.atInfinity ? "∞" : fmt(L.v, 1) + " cm"}: ${c[0].toLowerCase()}.`, `प्रतिबिंब की दूरी v = ${L.atInfinity ? "∞" : fmt(L.v, 1) + " cm"} है: ${c[1]}।`] })); }

    /* 3 · name the lens from how the rays bend */
    { const v = base(), L = view(v), conv = L.type === 1, c = conv ? ["Convex lens (converging)", "उत्तल लेंस (अभिसारी)"] : ["Concave lens (diverging)", "अवतल लेंस (अपसारी)"],
        pool = [conv ? ["Concave lens (diverging)", "अवतल लेंस (अपसारी)"] : ["Convex lens (converging)", "उत्तल लेंस (अभिसारी)"], ["Rectangular glass slab", "आयताकार काँच की सिल्ली"], ["Plane mirror", "समतल दर्पण"]], d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "lens-name", prompt: ["Perfect name: which optical element bends the rays like this?", "सही नाम: कौन-सा प्रकाशीय अवयव किरणों को इस तरह मोड़ता है?"], image: { vars: v, focus: "plainLens" }, options: d.options, correct: d.correct,
        why: conv ? ["Rays parallel to the axis meet at the focus after passing through it, so it is a convex (converging) lens.", "अक्ष के समानांतर किरणें लेंस से निकलकर फोकस पर मिलती हैं, इसलिए यह उत्तल (अभिसारी) लेंस है।"]
          : ["Rays parallel to the axis spread out as if coming from the focus on the object side, so it is a concave (diverging) lens.", "अक्ष के समानांतर किरणें फैल जाती हैं मानो वस्तु की ओर के फोकस से आ रही हों, इसलिए यह अवतल (अपसारी) लेंस है।"] })); }

    /* 4 · everyday use (only where NCERT names one) */
    { const v = base(); let L = view(v);
      if (L.type === 1 && L.u >= L.f) { v.u = Math.max(5, Math.min(Math.round(L.f * 0.6), L.f - 1)); L = view(v); }
      const c = L.type === -1 ? ["Spectacles for short-sightedness (myopia)", "निकट-दृष्टि दोष का चश्मा"] : ["Magnifying glass (simple magnifier)", "आवर्धक लेंस (साधारण सूक्ष्मदर्शी)"],
        pool = L.type === -1 ? [["Magnifying glass (simple magnifier)", "आवर्धक लेंस"], ["Plane mirror", "समतल दर्पण"], ["Periscope", "परिदर्शी"]] : [["Spectacles for short-sightedness (myopia)", "निकट-दृष्टि दोष का चश्मा"], ["Plane mirror", "समतल दर्पण"], ["Periscope", "परिदर्शी"]], d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "lens-use", prompt: ["This lens gives a virtual, erect image. Perfect name of the everyday use?", "यह लेंस काल्पनिक, सीधा प्रतिबिंब देता है। दैनिक उपयोग का सही नाम?"], image: { vars: v }, options: d.options, correct: d.correct,
        why: L.type === -1 ? ["A concave lens always forms a virtual, erect, diminished image, which is why it corrects myopia.", "अवतल लेंस सदा काल्पनिक, सीधा, छोटा प्रतिबिंब बनाता है, इसीलिए इससे निकट-दृष्टि दोष ठीक होता है।"]
          : ["With the object between F and O a convex lens gives a magnified, virtual, erect image — a magnifying glass.", "वस्तु F और O के बीच हो तो उत्तल लेंस आवर्धित, काल्पनिक, सीधा प्रतिबिंब देता है — आवर्धक लेंस।"] })); }

    /* 5 · predict: object moved closer */
    { const v = base(), a = view(v); let u2 = Math.max(5, v.u - 8); if (v.type === 1 && u2 <= v.f) u2 = Math.max(5, Math.min(v.u - 1, v.f + 1));
      const b = view({ ...v, u: u2 });
      if (u2 < v.u && Number.isFinite(a.v) && Number.isFinite(b.v) && !a.atInfinity && !b.atInfinity && !(v.type === 1 && u2 <= v.f)) {
        const bigger = Math.abs(b.m) > Math.abs(a.m), farther = Math.abs(b.v) > Math.abs(a.v), name = (bg, fa) => [`The image becomes ${bg ? "larger" : "smaller"} and moves ${fa ? "farther from" : "closer to"} the lens`, `प्रतिबिंब ${bg ? "बड़ा" : "छोटा"} हो जाता है और लेंस से ${fa ? "दूर" : "पास"} चला जाता है`];
        const opts = [[true, true], [true, false], [false, true], [false, false]].map(([x, y]) => name(x, y)), c = name(bigger, farther), d = withDistractors(c, opts, 3, q.rnd);
        out.push(ask({ id: "lens-closer", kind: "predict", prompt: [`The object is moved from u = ${v.u} cm to u = ${u2} cm (same lens, f = ${v.f} cm). What happens to the image?`, `वस्तु को u = ${v.u} cm से u = ${u2} cm पर लाया गया (वही लेंस, f = ${v.f} cm)। प्रतिबिंब का क्या होगा?`], image: { vars: v }, options: d.options, correct: d.correct, meta: { a: { u: v.u, f: v.f, type: v.type }, b: { u: u2, f: v.f, type: v.type }, bigger, farther },
          why: [`Lens formula: v goes from ${fmt(a.v, 1)} cm to ${fmt(b.v, 1)} cm and m from ${fmt(a.m, 2)} to ${fmt(b.m, 2)}.`, `लेंस सूत्र से v, ${fmt(a.v, 1)} cm से ${fmt(b.v, 1)} cm और m, ${fmt(a.m, 2)} से ${fmt(b.m, 2)} हो जाता है।`] }));
      } }

    /* 6 · power of the lens */
    { const v = base(), L = view(v), P = L.power, n = x => `${x > 0 ? "+" : "−"}${Math.abs(x).toFixed(1)} D`,
        c = [n(P), `${P > 0 ? "उत्तल" : "अवतल"} लेंस की क्षमता`], cand = [[n(-P), "विपरीत चिह्न"], [n(P * 2), ""], [n(P / 2), ""], [n(Math.sign(P) * 100 * v.f / 100), ""]].filter(o => o[0] !== c[0]);
      const seenT = new Set([c[0]]), uniq = cand.filter(o => !seenT.has(o[0]) && seenT.add(o[0])).map(o => [o[0], o[0]]), d = withDistractors([c[0], c[0]], uniq, 3, q.rnd);
      out.push(ask({ id: "lens-power", prompt: [`This lens has focal length f = ${v.f} cm. What is its power?`, `इस लेंस की फोकस दूरी f = ${v.f} cm है। इसकी क्षमता कितनी है?`], image: { vars: v, focus: "plainLens" }, options: d.options, correct: d.correct,
        why: [`P = 1/f(in metre) = 100/${v.f} = ${fmt(100 / v.f, 1)} D, positive for a convex lens and negative for a concave lens.`, `P = 1/f(मीटर में) = 100/${v.f} = ${fmt(100 / v.f, 1)} D; उत्तल लेंस के लिए धनात्मक, अवतल के लिए ऋणात्मक।`] })); }

    return out;
  }
};
