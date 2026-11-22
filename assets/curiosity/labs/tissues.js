/* Curiosity Lab · Tissues & Xylem Lab (NCERT Class IX, Ch 2 Tissues).
   Explore 6 Plant & Animal tissues under adjustable microscope magnification:
   Parenchyma, Collenchyma, Sclerenchyma, Xylem & Phloem transport, Striated Muscle, and Neuron! */
import { bus } from "../core.js";
import { TISSUE_TYPES, tissueModel } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const view = v => tissueModel({ tissue: v.tissue, zoom: v.zoom, transp: v.transp });

/* ---------------------------------------------------------------- 2D diagram (quiz + 2D fallback) */
function snapshot(canvas, vars, focus) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#0b1424"), T = view(vars);
  if (focus !== "blind") C2.text(g, `${T.name} (${T.group}) · ${T.zoom}× · field ${T.fieldUm} µm`, 24, 22, { size: 14, color: "#93c5fd", align: "left" });
  else C2.text(g, `Microscope slide · ${T.zoom}× magnification`, 24, 22, { size: 14, color: "#93c5fd", align: "left" });

  const cx = 360, cy = 182;
  if (T.tissue <= 2) {
    /* plant simple tissues: grid of hexagonal / polygonal cells */
    const cols = 4, rows = 2, dx = 112, dy = 92;
    const wallCol = T.tissue === 0 ? "#4ade80" : T.tissue === 1 ? "#facc15" : "#fb7185";
    const lw = T.tissue === 0 ? 3 : T.tissue === 1 ? 6 : 14;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = 188 + c * dx + (r % 2) * 32, y = 136 + r * dy;
        const rad = T.tissue === 0 ? 38 : 44;
        C2.circle(g, x, y, rad, { stroke: wallCol, fill: T.tissue === 2 ? "rgba(251,113,133,0.12)" : "rgba(34,197,94,0.14)", w: lw });
        if (T.tissue === 1) {
          /* corner thickenings */
          [0.7, 2.4, 4.0, 5.5].forEach(a => C2.circle(g, x + Math.cos(a) * rad, y + Math.sin(a) * rad, 8, { stroke: null, fill: "#facc15" }));
        }
        if (T.living) C2.circle(g, x + 12, y - 8, 7, { stroke: null, fill: "#a78bfa" });
      }
    }
    C2.text(g, T.tissue === 0 ? "Thin walls + intercellular spaces (living)" : T.tissue === 1 ? "Thickened corners, living (flexibility)" : "Thick lignified walls, empty lumen (dead)", cx, 314, { size: 14, color: "#ffd23f" });
  } else if (T.tissue === 3) {
    /* Xylem (unidirectional up) + Phloem (bidirectional) */
    C2.rect(g, 190, 62, 110, 220, { stroke: "#38bdf8", fill: "rgba(56,189,248,0.12)", lw: 5, r: 8 });
    C2.text(g, "Xylem (water)", 245, 300, { size: 14, color: "#38bdf8" });
    [240, 175, 110].forEach(y => C2.arrow(g, 245, y + 25, 245, y - 20, "#38bdf8", 4, 10));
    C2.rect(g, 410, 62, 110, 220, { stroke: "#facc15", fill: "rgba(250,204,21,0.12)", lw: 3, r: 8 });
    C2.line(g, [[410, 172], [520, 172]], "#facc15", 2, [5, 5]);
    C2.text(g, "Phloem (food)", 465, 300, { size: 14, color: "#ffd23f" });
    C2.arrow(g, 445, 230, 445, 95, "#ffd23f", 3, 9);
    C2.arrow(g, 485, 95, 485, 230, "#fb923c", 3, 9);
    C2.text(g, `Transpiration rate: ${T.transp}/5`, 360, 46, { size: 13, color: "#86efac" });
  } else if (T.tissue === 4) {
    /* Striated muscle fibres */
    [115, 185, 255].forEach(y => {
      C2.rect(g, 110, y - 22, 500, 44, { stroke: "#fb7185", fill: "rgba(244,63,94,0.22)", lw: 2.5, r: 10 });
      for (let x = 135; x < 595; x += 26) C2.line(g, [[x, y - 20], [x, y + 20]], "rgba(255,255,255,0.45)", 4);
      [180, 350, 510].forEach(nx => C2.circle(g, nx, y - 12, 5, { stroke: null, fill: "#a78bfa" }));
    });
    C2.text(g, "Cylindrical, unbranched, multinucleated, light & dark bands", cx, 314, { size: 14, color: "#ffd23f" });
  } else {
    /* Neuron */
    C2.circle(g, 185, 175, 44, { stroke: "#a78bfa", fill: "rgba(139,92,246,0.3)", lw: 3 });
    C2.circle(g, 185, 175, 15, { stroke: "#fff", fill: "#c4b5fd", w: 1.5 });
    [[-58, -42], [-66, 0], [-56, 44], [-25, -62], [-25, 62]].forEach(([dx, dy]) => C2.line(g, [[185 + dx * 0.6, 175 + dy * 0.6], [185 + dx * 1.3, 175 + dy * 1.3]], "#c4b5fd", 3));
    C2.line(g, [[229, 175], [565, 175]], "#38bdf8", 6);
    [270, 355, 440].forEach(x => C2.rect(g, x, 160, 62, 30, { stroke: "#facc15", fill: "rgba(250,204,21,0.25)", lw: 2, r: 8 }));
    C2.arrow(g, 250, 140, 520, 140, "#46e08a", 3, 10);
    C2.text(g, "Dendrites → Cell body → Axon (nerve impulse)", cx, 314, { size: 14, color: "#ffd23f" });
  }
  return canvas;
}

/* ---------------------------------------------------------------- the lab */
export default {
  id: "tissues", cls: 9, unit: "ix/ix2", icon: "🔬",
  title: { en: "Tissues & Xylem Lab — histology", hi: "ऊतक और जाइलम प्रयोगशाला" },
  blurb: { en: "Zoom in on Parenchyma, Collenchyma, Sclerenchyma, Xylem water flow, Striated Muscle, and Neuron impulses in 3D!", hi: "पैरेन्काइमा, कॉलेन्काइमा, स्क्लेरेन्काइमा, जाइलम जल प्रवाह, पेशी और न्यूरॉन को 3D में देखो!" },
  vars: [
    { id: "tissue", label: { en: "Tissue (0–3 Plant · 4 Muscle · 5 Neuron)", hi: "ऊतक चुनें (0–3 पादप · 4 पेशी · 5 न्यूरॉन)" }, unit: "", min: 0, max: 5, step: 1, value: 3 },
    { id: "zoom", label: { en: "Microscope zoom", hi: "सूक्ष्मदर्शी आवर्धन" }, unit: "×", min: 100, max: 400, step: 100, value: 200 },
    { id: "transp", label: { en: "Activity / Transpiration rate", hi: "वाष्पोत्सर्जन / सक्रियता दर" }, unit: "", min: 1, max: 5, step: 1, value: 3 }
  ],
  facts(v) {
    const T = view(v);
    return [
      { id: "name", en: "Selected tissue", hi: "चयनित ऊतक", value: `${T.name} · ${T.hi}` },
      { id: "state", en: "Cell status", hi: "कोशिका स्थिति", value: T.living ? "Living cells · जीवित कोशिकाएँ" : "Dead cells at maturity (lignified) · मृत कोशिकाएँ" },
      { id: "role", en: "Primary function", hi: "मुख्य कार्य", value: `${T.role} · ${T.roleHi}` },
      { id: "fov", en: `Microscope view (${T.zoom}×)`, hi: "सूक्ष्मदर्शी क्षेत्र", value: `~${T.fieldUm} µm across · activity ${T.transp}/5` }
    ];
  },
  snapshot,
  missions: [
    { id: "tis-xylem", en: "Drive maximum Xylem transpiration pull (tissue = Xylem, rate = 5)", hi: "जाइलम में अधिकतम वाष्पोत्सर्जन खिंचाव पाओ (दर = 5)", check: v => v.tissue === 3 && v.transp >= 5 },
    { id: "tis-dead", en: "Inspect dead lignified Sclerenchyma at 400× magnification", hi: "मृत स्क्लेरेन्काइमा को 400× आवर्धन पर देखो", check: v => v.tissue === 2 && v.zoom >= 400 },
    { id: "tis-neuron", en: "Watch electrical impulses race down a Neuron axon", hi: "न्यूरॉन के एक्सॉन पर विद्युत आवेग दौड़ते देखो", check: v => v.tissue === 5 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 2.8, 8.2], target: [0, 0.2, 0], bg: 0x0b1424, minDist: 3.5, maxDist: 18 });
    const { scene } = st, dyn = new THREE.Group(); scene.add(dyn);
    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    const ht = el("span"), hz = el("span"); hud.append(ht, hz);

    let animItems = [], t = 0;

    function rebuild() {
      while (dyn.children.length) {
        const ch = dyn.children.pop();
        ch.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); }); });
      }
      animItems = [];
      const T = view(ctx.vars);
      const scaleZoom = 0.72 + (T.zoom / 400) * 0.55;
      dyn.scale.setScalar(scaleZoom);

      if (T.tissue <= 2) {
        /* 3D honeycomb / polygonal plant cells */
        const wallCol = T.tissue === 0 ? 0x4ade80 : T.tissue === 1 ? 0xfacc15 : 0xfb7185;
        const r = T.tissue === 0 ? 0.62 : 0.72;
        const coords = [[-1.55, 0.75], [0, 0.75], [1.55, 0.75], [-0.78, -0.58], [0.78, -0.58]];
        coords.forEach(([x, y], i) => {
          const wall = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.9, 6), new THREE.MeshStandardMaterial({ color: wallCol, transparent: true, opacity: T.tissue === 2 ? 0.85 : 0.45, roughness: 0.4 }));
          wall.rotation.x = Math.PI / 2; wall.position.set(x, y, 0); dyn.add(wall);
          if (T.living) {
            const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 12), new THREE.MeshStandardMaterial({ color: 0xa78bfa, emissive: 0x6d28d9, emissiveIntensity: 0.4 }));
            nuc.position.set(x + 0.14, y - 0.1, 0.15); dyn.add(nuc);
            animItems.push({ kind: "bob", m: wall, base: y, phase: i });
          } else {
            const lumen = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.96, 6), new THREE.MeshBasicMaterial({ color: 0x0b1424 }));
            lumen.rotation.x = Math.PI / 2; lumen.position.set(x, y, 0); dyn.add(lumen);
          }
        });
      } else if (T.tissue === 3) {
        /* Xylem (left, upward blue H2O) + Phloem (right, bidirectional gold sugar) */
        const xTube = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 4.2, 18, 1, true), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.3, side: THREE.DoubleSide }));
        xTube.position.set(-1.3, 0.2, 0); dyn.add(xTube);
        const pTube = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.54, 4.2, 18, 1, true), new THREE.MeshStandardMaterial({ color: 0xfacc15, transparent: true, opacity: 0.26, side: THREE.DoubleSide }));
        pTube.position.set(1.3, 0.2, 0); dyn.add(pTube);
        const xt = labelSprite(THREE, "Xylem ↑", "जल एकदिशीय", { scale: 0.8, size: 24, color: "#bae6fd" }); xt.position.set(-1.3, 2.55, 0); dyn.add(xt);
        const pt = labelSprite(THREE, "Phloem ↕", "भोजन द्विदिशीय", { scale: 0.8, size: 24, color: "#fef08a" }); pt.position.set(1.3, 2.55, 0); dyn.add(pt);

        for (let i = 0; i < 10; i++) {
          const drop = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.7 }));
          drop.position.set(-1.3 + ((i % 3) - 1) * 0.18, -1.7 + i * 0.38, 0); dyn.add(drop);
          animItems.push({ kind: "flow", m: drop, dir: 1 });
        }
        for (let i = 0; i < 8; i++) {
          const dir = i % 2 === 0 ? 1 : -1;
          const sug = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xd97706, emissiveIntensity: 0.7 }));
          sug.position.set(1.3 + dir * 0.18, -1.7 + i * 0.48, 0); dyn.add(sug);
          animItems.push({ kind: "flow", m: sug, dir });
        }
      } else if (T.tissue === 4) {
        /* Striated Muscle cylinders */
        [-0.95, 0.1, 1.15].forEach((y, idx) => {
          const fib = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 4.4, 18), new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.45 }));
          fib.rotation.z = Math.PI / 2; fib.position.set(0, y, 0); dyn.add(fib);
          for (let b = -1.8; b <= 1.8; b += 0.45) {
            const band = new THREE.Mesh(new THREE.TorusGeometry(0.365, 0.03, 6, 18), new THREE.MeshBasicMaterial({ color: 0xfef2f2 }));
            band.rotation.y = Math.PI / 2; band.position.set(b, y, 0); dyn.add(band);
          }
          animItems.push({ kind: "contract", m: fib, phase: idx });
        });
      } else {
        /* Neuron: Soma + Dendrites + Axon + Myelin + Travelling impulse */
        const soma = new THREE.Mesh(new THREE.SphereGeometry(0.65, 22, 18), new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x5b21b6, emissiveIntensity: 0.45 }));
        soma.position.set(-2.1, 0.2, 0); dyn.add(soma);
        [[-0.8, 0.8], [-0.9, 0], [-0.8, -0.8], [-0.2, 0.95]].forEach(([dx, dy]) => {
          const d = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 1.1, 8), new THREE.MeshStandardMaterial({ color: 0xc4b5fd }));
          d.position.set(-2.1 + dx * 0.7, 0.2 + dy * 0.7, 0); d.rotation.z = Math.atan2(dy, dx) - Math.PI / 2; dyn.add(d);
        });
        const axon = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 4.5, 12), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
        axon.rotation.z = Math.PI / 2; axon.position.set(0.6, 0.2, 0); dyn.add(axon);
        [-0.8, 0.4, 1.6].forEach(x => {
          const my = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.85, 14), new THREE.MeshStandardMaterial({ color: 0xfacc15, transparent: true, opacity: 0.6 }));
          my.rotation.z = Math.PI / 2; my.position.set(x, 0.2, 0); dyn.add(my);
        });
        const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 14), new THREE.MeshBasicMaterial({ color: 0x46e08a }));
        pulse.position.set(-1.5, 0.2, 0); dyn.add(pulse);
        animItems.push({ kind: "impulse", m: pulse });
      }

      ht.textContent = `${T.name} · ${T.living ? "Living" : "Dead"}`;
      hz.textContent = `${T.zoom}× (~${T.fieldUm} µm) · rate ${T.transp}/5`;
    }

    const stopFrame = st.onFrame(dt => {
      const T = view(ctx.vars);
      t += dt * T.speed;
      animItems.forEach(item => {
        if (item.kind === "flow") {
          item.m.position.y += item.dir * dt * T.speed * 0.9;
          if (item.m.position.y > 2.0) item.m.position.y = -1.7;
          if (item.m.position.y < -1.7) item.m.position.y = 2.0;
        } else if (item.kind === "contract") {
          const s = 1 + Math.sin(t * 2.5 + item.phase) * 0.08;
          item.m.scale.set(1, s, 1);
        } else if (item.kind === "impulse") {
          item.m.position.x += dt * T.speed * 1.4;
          if (item.m.position.x > 2.8) item.m.position.x = -1.6;
        } else if (item.kind === "bob") {
          item.m.position.y = item.base + Math.sin(t + item.phase) * 0.04;
        }
      });
    });

    /* side panel */
    const side = ctx.side; side.replaceChildren();
    const grid = el("div", "cl-presets"); grid.appendChild(el("span", "cl-lab", "Select Tissue · ऊतक"));
    const tBtns = TISSUE_TYPES.map((tt, idx) => {
      const b = actionButton(grid, tt.name.split(" ")[0], () => {
        ctx.set("tissue", idx);
        sfx.play(idx === 5 ? "zap" : "pop");
        tBtns.forEach((x, j) => x.classList.toggle("on", j === idx));
      }, "cl-chipb" + (ctx.vars.tissue === idx ? " on" : ""));
      return b;
    });
    side.appendChild(grid);

    const sl = sliders(ctx, side, { skip: ["tissue"] });
    const facts = factsView(ctx, side);
    note(side, "Plant simple tissues differ by cell wall & living state; complex vascular tissues split transport: Xylem (water UP only) vs Phloem (food BOTH ways).", "सरल पादप ऊतक भित्ति व जीवित/मृत अवस्था से भिन्न हैं; जाइलम जल को केवल ऊपर तथा फ्लोएम भोजन को दोनों दिशाओं में ले जाता है।");

    const off = bus.on("sim:change", e => {
      if (e.labId !== "tissues") return;
      rebuild(); facts.update(); sl.sync();
      tBtns.forEach((b, j) => b.classList.toggle("on", j === ctx.vars.tissue));
    });
    rebuild(); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ tissue: seen(q, "tissue"), zoom: seen(q, "zoom"), transp: seen(q, "transp") });

    /* 1 · identify tissue visually */
    {
      const x = v(), T = view(x);
      const c = [T.name, T.hi];
      const pool = TISSUE_TYPES.map(t => [t.name, t.hi]);
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "tis-identify",
        prompt: ["Look closely at the cells under the microscope. Which tissue is this?", "सूक्ष्मदर्शी के नीचे दिख रहे इस ऊतक की पहचान करो। यह कौन-सा ऊतक है?"],
        image: { vars: x, focus: "blind" },
        options: d.options, correct: d.correct,
        why: [`${T.name}: ${T.role}.`, `${T.hi}: ${T.roleHi}।`]
      }));
    }

    /* 2 · dead lignified plant tissue */
    {
      const x = { ...v(), tissue: 2 };
      const c = ["Sclerenchyma (dead, thick lignified walls)", "स्क्लेरेन्काइमा (मृत, मोटी लिग्निन भित्ति)"];
      const pool = [
        ["Parenchyma (living, thin walls)", "पैरेन्काइमा (जीवित, पतली भित्ति)"],
        ["Collenchyma (living, thickened corners)", "कॉलेन्काइमा (जीवित, मोटे कोने)"],
        ["Phloem companion cell (living)", "फ्लोएम सहकोशिका (जीवित)"]
      ];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "tis-living",
        prompt: ["Which simple permanent plant tissue consists of dead cells with thick lignified walls (like coconut husk fibres)?", "कौन-सा सरल स्थायी पादप ऊतक मोटी लिग्निन भित्ति वाली मृत कोशिकाओं से बना होता है (जैसे नारियल का रेशा)?"],
        image: { vars: x, focus: "blind" },
        options: d.options, correct: d.correct,
        why: ["Sclerenchyma cells lose their cytoplasm at maturity and develop uniform thick lignin walls for rigid mechanical strength.", "स्क्लेरेन्काइमा परिपक्वता पर मृत होकर कठोर लिग्निन भित्ति से पौधे को दृढ़ता देता है।"]
      }));
    }

    /* 3 · collenchyma flexibility */
    {
      const x = { ...v(), tissue: 1 };
      const c = ["Collenchyma", "कॉलेन्काइमा"];
      const pool = [["Sclerenchyma", "स्क्लेरेन्काइमा"], ["Xylem vessel", "जाइलम वाहिका"], ["Striated muscle", "रेखित पेशी"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "tis-flex",
        prompt: ["Tendrils and leaf stalks bend easily in the wind without breaking. Which living plant tissue gives them this flexibility?", "पत्तों के डंठल और प्रतान हवा में बिना टूटे आसानी से मुड़ जाते हैं। कौन-सा ऊतक यह लचीलापन देता है?"],
        image: { vars: x, focus: "blind" },
        options: d.options, correct: d.correct,
        why: ["Collenchyma has living cells thickened unevenly at the corners, providing tensile flexibility without snapping.", "कॉलेन्काइमा के कोनों पर अतिरिक्त मोटाई होती है, जो पौधों के भागों को लचीलापन देती है।"]
      }));
    }

    /* 4 · xylem vs phloem transport direction */
    {
      const x = { ...v(), tissue: 3 };
      const c = ["Xylem carries water upward only; Phloem carries food both ways", "जाइलम जल केवल ऊपर ले जाता है; फ्लोएम भोजन दोनों दिशाओं में"];
      const pool = [
        ["Xylem carries food downward; Phloem carries water upward", "जाइलम भोजन नीचे; फ्लोएम जल ऊपर ले जाता है"],
        ["Both Xylem and Phloem carry water upward only", "दोनों केवल जल ऊपर ले जाते हैं"],
        ["Xylem is living; Phloem vessels are completely dead", "जाइलम जीवित है; फ्लोएम पूरी तरह मृत है"]
      ];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "tis-transport",
        prompt: ["Compare the transport directions in Xylem and Phloem shown in the vascular bundle:", "संवहन बंडल में जाइलम और फ्लोएम के परिवहन की दिशा की तुलना करो:"],
        image: { vars: x },
        options: d.options, correct: d.correct,
        why: ["Transpiration pull drives water & minerals strictly upward in Xylem, whereas Phloem translocates sucrose from leaves to roots or growing buds bidirectionally.", "जाइलम में जल केवल ऊपर की ओर जाता है, जबकि फ्लोएम भोजन को ऊपर और नीचे दोनों ओर भेजता है।"]
      }));
    }

    /* 5 · striated muscle */
    {
      const x = { ...v(), tissue: 4 };
      const c = ["Striated (voluntary) skeletal muscle", "रेखित (ऐच्छिक) कंकाल पेशी"];
      const pool = [["Smooth (involuntary) muscle", "चिकनी (अनैच्छिक) पेशी"], ["Cardiac muscle (branched)", "हृदयक पेशी (शाखित)"], ["Neuron (nervous tissue)", "न्यूरॉन (तंत्रिका ऊतक)"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "tis-muscle",
        prompt: ["Look at these cylindrical, unbranched fibres with alternating light & dark bands and multiple nuclei. Which tissue is this?", "इन बेलनाकार, अशाखित, बहुकेंद्रकीय और धारीदार तंतुओं को पहचानो। यह कौन-सा ऊतक है?"],
        image: { vars: x, focus: "blind" },
        options: d.options, correct: d.correct,
        why: ["Voluntary skeletal muscles are long, cylindrical, unbranched, multinucleated, and show clear light/dark striations.", "ऐच्छिक कंकाल पेशियाँ लंबी, बेलनाकार, अशाखित, बहुकेंद्रकीय और रेखित होती हैं।"]
      }));
    }

    /* 6 · predict transpiration increase */
    {
      const x = { ...v(), tissue: 3, transp: 2 };
      const c = ["Upward water flow in Xylem speeds up", "जाइलम में ऊपर की ओर जल प्रवाह तेज़ हो जाता है"];
      const pool = [
        ["Water reverses and flows downward in Xylem", "जाइलम में जल उल्टी दिशा में नीचे बहता है"],
        ["Xylem flow stops completely", "जाइलम प्रवाह पूरी तरह रुक जाता है"],
        ["Phloem turns into dead sclerenchyma", "फ्लोएम मृत स्क्लेरेन्काइमा बन जाता है"]
      ];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "tis-predict", kind: "predict",
        prompt: ["On a warm breezy afternoon, transpiration from the leaves increases from rate 2 to rate 5. What happens in the Xylem?", "गर्म हवादार दोपहर में पत्तियों से वाष्पोत्सर्जन दर 2 से 5 हो जाती है। जाइलम में क्या होगा?"],
        image: { vars: x },
        options: d.options, correct: d.correct,
        why: ["Faster evaporation from stomata strengthens the transpiration pull, accelerating upward water movement in Xylem vessels.", "रंध्रों से वाष्पोत्सर्जन बढ़ने पर खिंचाव बल बढ़ता है और जाइलम में जल प्रवाह तेज़ होता है।"]
      }));
    }

    return out;
  }
};
