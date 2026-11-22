/* Curiosity Lab · Molecules & Carbon Allotropes 3D Lab (NCERT Class IX Ch 7 & Class X Ch 4).
   Spin 3D ball-and-stick molecules (H₂O, CH₄, CO₂, Ethanol), inspect NaCl ionic lattice,
   compare Diamond vs Graphite sheets, and watch Soap Micelles trap oil! */
import { bus } from "../core.js";
import { MOLECULES_LIST, moleculeModel } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const view = v => moleculeModel({ mol: v.mol, count: v.count });

function snapshot(canvas, vars, focus) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#0b1424"), M = view(vars);
  C2.text(g, focus === "blind" ? `3D Molecule Inspector · ${M.geom}` : `${M.name} (${M.formula}) · Mass = ${M.mass} u · ${M.geom}`, 360, 22, { size: 15, color: "#93c5fd" });
  const cx = 360, cy = 175;
  if (M.id === "h2o") {
    C2.line(g, [[cx, cy], [cx - 80, cy + 52]], "#cbd5e1", 5);
    C2.line(g, [[cx, cy], [cx + 80, cy + 52]], "#cbd5e1", 5);
    C2.circle(g, cx, cy, 32, { stroke: "#fff", fill: "#ef4444", w: 2 }); C2.text(g, "O", cx, cy, { size: 18, color: "#fff" });
    C2.circle(g, cx - 80, cy + 52, 20, { stroke: "#fff", fill: "#e2e8f0", w: 2 }); C2.text(g, "H", cx - 80, cy + 52, { size: 14, color: "#0f172a" });
    C2.circle(g, cx + 80, cy + 52, 20, { stroke: "#fff", fill: "#e2e8f0", w: 2 }); C2.text(g, "H", cx + 80, cy + 52, { size: 14, color: "#0f172a" });
  } else if (M.id === "co2") {
    C2.line(g, [[cx - 95, cy], [cx + 95, cy]], "#cbd5e1", 7);
    C2.circle(g, cx, cy, 28, { stroke: "#fff", fill: "#475569", w: 2 }); C2.text(g, "C", cx, cy, { size: 16, color: "#fff" });
    C2.circle(g, cx - 95, cy, 26, { stroke: "#fff", fill: "#ef4444", w: 2 }); C2.text(g, "O", cx - 95, cy, { size: 16, color: "#fff" });
    C2.circle(g, cx + 95, cy, 26, { stroke: "#fff", fill: "#ef4444", w: 2 }); C2.text(g, "O", cx + 95, cy, { size: 16, color: "#fff" });
  } else {
    [[0, -75], [75, 45], [-75, 45], [0, 75]].forEach(([dx, dy]) => {
      C2.line(g, [[cx, cy], [cx + dx, cy + dy]], "#94a3b8", 4);
      C2.circle(g, cx + dx, cy + dy, 18, { stroke: "#fff", fill: M.id === "nacl" ? "#22c55e" : "#38bdf8", w: 2 });
    });
    C2.circle(g, cx, cy, 28, { stroke: "#fff", fill: M.id === "nacl" ? "#facc15" : "#334155", w: 2 });
    C2.text(g, M.id === "nacl" ? "Na⁺" : "C", cx, cy, { size: 15, color: M.id === "nacl" ? "#0f172a" : "#fff" });
  }
  C2.text(g, `${M.bond} · ${M.count} units → ${M.totalAtoms} atoms · Total mass = ${M.totalMass} u`, 360, 310, { size: 13, color: "#ffd23f" });
  return canvas;
}

export default {
  id: "molecules", cls: 9, unit: "ix/ix7", icon: "💎",
  title: { en: "Molecules & Carbon 3D Studio — Bonding & Allotropes", hi: "अणु व कार्बन 3D स्टूडियो — आबंध व अपररूप" },
  blurb: { en: "Rotate 3D molecules (H₂O, CH₄, CO₂, Ethanol), inspect NaCl ionic crystal, compare Diamond vs Graphite, and see Soap Micelles!", hi: "3D में H₂O, CH₄, CO₂, एथेनॉल, NaCl क्रिस्टल, हीरा बनाम ग्रेफाइट अपररूप और साबुन मिसेल घुमाकर देखो!" },
  vars: [
    { id: "mol", label: { en: "Molecule / structure", hi: "अणु / संरचना" }, unit: "", min: 0, max: 7, step: 1, value: 1 },
    { id: "count", label: { en: "Formula units (Conservation scale)", hi: "इकाइयों की संख्या" }, unit: " units", min: 1, max: 6, step: 1, value: 2 }
  ],
  facts(v) {
    const M = view(v);
    return [
      { id: "mol", en: "Structure & formula", hi: "संरचना व सूत्र", value: `${M.name} (${M.formula}) · ${M.hi}` },
      { id: "geom", en: "3D geometry & bond", hi: "3D ज्यामिति व आबंध", value: `${M.geom} · ${M.bond}` },
      { id: "mass", en: "Formula unit mass", hi: "इकाई द्रव्यमान", value: `${M.mass} u (${M.atomPerUnit} atoms/unit)` },
      { id: "tot", en: `Totals for ${M.count} unit(s)`, hi: `${M.count} इकाई का कुल`, value: `${M.totalAtoms} atoms · ${M.totalMass} u` }
    ];
  },
  snapshot,
  missions: [
    { id: "mol-tetra", en: "Inspect Methane (CH₄) to view its 109.5° tetrahedral 3D geometry!", hi: "मीथेन (CH₄) की 109.5° चतुष्फलकीय 3D ज्यामिति देखो!", check: v => v.mol === 1 },
    { id: "mol-allotrope", en: "Compare Diamond (id=5) and conducting Graphite (id=6) allotropes!", hi: "हीरा व विद्युत चालक ग्रेफाइट अपररूपों की तुलना करो!", check: v => v.mol === 5 || v.mol === 6 },
    { id: "mol-micelle", en: "Open Soap Micelle (id=7) to see how tails trap oily dirt!", hi: "साबुन मिसेल देखकर समझो कि मैल कैसे साफ होता है!", check: v => v.mol === 7 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 2.5, 7.6], target: [0, 0, 0], bg: 0x0b1424, minDist: 3.5, maxDist: 16 });
    const { scene } = st, dyn = new THREE.Group(); scene.add(dyn);
    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    const h1 = el("span"), h2 = el("span"); hud.append(h1, h2);

    const sphere = (r, col, p) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 16), new THREE.MeshStandardMaterial({ color: col, roughness: 0.25, metalness: 0.1 }));
      m.position.set(...p); dyn.add(m); return m;
    };
    const bond = (p1, p2, col = 0x94a3b8, rad = 0.08) => {
      const v1 = new THREE.Vector3(...p1), v2 = new THREE.Vector3(...p2), d = v1.distanceTo(v2);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, d, 10), new THREE.MeshStandardMaterial({ color: col }));
      m.position.copy(v1).add(v2).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v2.clone().sub(v1).normalize());
      dyn.add(m);
    };

    const rebuild = () => {
      while (dyn.children.length) {
        const c = dyn.children.pop();
        c.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); }); });
      }
      const M = view(ctx.vars);
      if (M.id === "h2o") {
        sphere(0.45, 0xef4444, [0, 0.2, 0]);
        const a = (104.5 * Math.PI) / 360, d = 1.4;
        const p1 = [-Math.sin(a) * d, 0.2 - Math.cos(a) * d, 0], p2 = [Math.sin(a) * d, 0.2 - Math.cos(a) * d, 0];
        bond([0, 0.2, 0], p1); bond([0, 0.2, 0], p2); sphere(0.28, 0xf8fafc, p1); sphere(0.28, 0xf8fafc, p2);
      } else if (M.id === "ch4") {
        const pts = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(v => v.map(c => c * 0.95));
        sphere(0.42, 0x475569, [0, 0, 0]);
        pts.forEach(p => { bond([0, 0, 0], p); sphere(0.25, 0xf8fafc, p); });
      } else if (M.id === "diamond") {
        /* 3D Diamond tetrahedral crystal network: central C + 4 tetrahedral C + 12 outer C bonds */
        const pts = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(v => v.map(c => c * 0.95));
        sphere(0.32, 0x38bdf8, [0, 0, 0]);
        pts.forEach((p, idx) => {
          bond([0, 0, 0], p, 0x7dd3fc, 0.08); sphere(0.3, 0x7dd3fc, p);
          const sub = [p[0] * 1.65, p[1] * 1.65 + (idx % 2 ? 0.45 : -0.45), p[2] * 1.65];
          bond(p, sub, 0x38bdf8, 0.055); sphere(0.22, 0xbae6fd, sub);
        });
      } else if (M.id === "co2") {
        sphere(0.42, 0x475569, [0, 0, 0]);
        [-1.6, 1.6].forEach(x => { bond([0, 0.1, 0], [x, 0.1, 0], 0xcbd5e1, 0.06); bond([0, -0.1, 0], [x, -0.1, 0], 0xcbd5e1, 0.06); sphere(0.38, 0xef4444, [x, 0, 0]); });
      } else if (M.id === "ethanol") {
        sphere(0.4, 0x475569, [-1.1, 0, 0]); sphere(0.4, 0x475569, [0.2, 0.2, 0]); sphere(0.38, 0xef4444, [1.4, -0.1, 0]); sphere(0.24, 0xf8fafc, [2.1, 0.5, 0]);
        bond([-1.1, 0, 0], [0.2, 0.2, 0]); bond([0.2, 0.2, 0], [1.4, -0.1, 0]); bond([1.4, -0.1, 0], [2.1, 0.5, 0]);
        [[-1.6, 0.9, 0.4], [-1.6, -0.8, 0.5], [-1.3, 0, -1.0], [0.2, 1.1, 0.5], [0.2, -0.6, -0.7]].forEach(p => {
          bond(p[0] < -0.5 ? [-1.1, 0, 0] : [0.2, 0.2, 0], p); sphere(0.22, 0xf8fafc, p);
        });
      } else if (M.id === "nacl") {
        for (let ix = -1; ix <= 1; ix++) for (let iy = -1; iy <= 1; iy++) for (let iz = -1; iz <= 1; iz++) {
          const isNa = (ix + iy + iz) % 2 === 0;
          sphere(isNa ? 0.24 : 0.34, isNa ? 0xfacc15 : 0x22c55e, [ix * 0.95, iy * 0.95, iz * 0.95]);
        }
      } else if (M.id === "graphite") {
        [-0.85, 0.85].forEach(y => {
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2, b = ((i + 1) / 6) * Math.PI * 2;
            const p1 = [Math.cos(a) * 1.4, y, Math.sin(a) * 1.4], p2 = [Math.cos(b) * 1.4, y, Math.sin(b) * 1.4];
            sphere(0.25, 0x64748b, p1); bond(p1, p2, 0x94a3b8, 0.06);
            if (i % 2 === 0 && y > 0) bond(p1, [p1[0], -0.85, p1[2]], 0x334155, 0.025);
          }
          sphere(0.12, 0xfacc15, [0.4, y + 0.12, -0.3]);
          sphere(0.12, 0xfacc15, [-0.5, y + 0.12, 0.4]);
        });
      } else {
        /* Soap micelle: yellow oil droplet center + radial hydrophobic tails + blue ionic heads */
        sphere(0.85, 0xfacc15, [0, 0, 0]);
        for (let i = 0; i < 16; i++) {
          const phi = Math.acos(1 - (2 * (i + 0.5)) / 16), th = Math.PI * (1 + Math.sqrt(5)) * i;
          const dir = [Math.sin(phi) * Math.cos(th), Math.sin(phi) * Math.sin(th), Math.cos(phi)];
          bond(dir.map(c => c * 0.85), dir.map(c => c * 2.1), 0xfde047, 0.045);
          sphere(0.22, 0x38bdf8, dir.map(c => c * 2.2));
        }
      }
      const tag = labelSprite(THREE, `${M.name} (${M.formula})`, M.geom, { scale: 0.85, size: 24, color: "#fef08a" });
      tag.position.set(0, 2.35, 0); dyn.add(tag);
      h1.textContent = `${M.name} (${M.formula}) · ${M.geom}`;
      h2.textContent = `${M.count} unit(s) → ${M.totalAtoms} atoms · ${M.totalMass} u`;
    };

    const stopFrame = st.onFrame(dt => { dyn.rotation.y += dt * 0.45; });
    const side = ctx.side; side.replaceChildren();
    const sl = sliders(ctx, side);
    const presets = el("div", "cl-presets"); presets.appendChild(el("span", "cl-lab", "Pick molecule · अणु चुनें"));
    MOLECULES_LIST.forEach((m, i) => {
      actionButton(presets, m.formula.split(" ")[0], () => { ctx.set("mol", i); sfx.play("pop"); sl.sync(); rebuild(); }, "cl-chipb");
    });
    side.insertBefore(presets, sl.root.nextSibling);
    const facts = factsView(ctx, side);
    note(side, "Carbon forms covalent bonds via tetravalency & catenation. In Graphite each C bonds to 3 others (1 free e⁻ conducts electricity); in Diamond each C bonds rigidly to 4 others!", "कार्बन में श्रृंखलन (catenation) व चतुःसंयोजकता होती है। ग्रेफाइट में मुक्त इलेक्ट्रॉन होने से वह विद्युत का सुचालक है, जबकि हीरा कठोरतम है।");

    const off = bus.on("sim:change", e => { if (e.labId !== "molecules") return; rebuild(); facts.update(); sl.sync(); });
    rebuild(); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ mol: seen(q, "mol"), count: seen(q, "count") });
    {
      const x = { mol: 6, count: 1 };
      const c = ["Graphite — each C bonds to 3 others leaving 1 free mobile electron", "ग्रेफाइट — प्रत्येक C केवल 3 अन्य C से जुड़ता है, 1 मुक्त इलेक्ट्रॉन रहता है"];
      const pool = [["Diamond — rigid 4-bond tetrahedral lattice", "हीरा — 4 आबंध"], ["Methane — covalent gas", "मीथेन गैस"], ["Solid NaCl — locked ions", "ठोस NaCl"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "mol-graphite", prompt: ["Which allotrope of Carbon is a good conductor of electricity and why?", "कार्बन का कौन-सा अपररूप विद्युत का सुचालक है और क्यों?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Graphite's hexagonal sheets leave one delocalised electron per carbon atom free to carry current.", "ग्रेफाइट की षट्कोणीय परतों में प्रति कार्बन एक मुक्त इलेक्ट्रॉन धारा वहन करता है।"] }));
    }
    {
      const x = { mol: 1, count: 1 };
      const c = ["Catenation (self-linking) & Tetravalency (valency = 4)", "श्रृंखलन (catenation) व चतुःसंयोजकता (संयोजकता = 4)"];
      const pool = [["Ionic bond donation only", "केवल आयनिक दान"], ["Radioactive decay of nuclei", "रेडियोधर्मी क्षय"], ["Magnetic attraction between atoms", "चुंबकीय आकर्षण"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "mol-carbon", prompt: ["Which two properties of Carbon allow it to form millions of organic compounds?", "कार्बन के किन दो गुणों के कारण लाखों कार्बनिक यौगिक बनते हैं?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Carbon shares 4 covalent bonds (tetravalency) and links into long chains/rings (catenation).", "कार्बन 4 सहसंयोजक आबंध बनाता है और लंबी श्रृंखलाएँ (श्रृंखलन) बना सकता है।"] }));
    }
    {
      const x = { mol: 7, count: 1 };
      const c = ["Hydrophobic tail traps oil inside; hydrophilic head faces water", "जल-विरोधी पूँछ तेल को अंदर घेरती है; जल-रागी सिरा पानी की ओर रहता है"];
      const pool = [["Entire molecule dissolves only in pure oil", "पूरा अणु तेल में घुलता है"], ["Micelle turns oil into solid iron", "तेल लोहे में बदलता है"], ["Soap neutralises water into salt", "साबुन जल को लवण बनाता है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "mol-micelle", prompt: ["How does a Soap Micelle clean oily dirt from clothes in water?", "साबुन का मिसेल कपड़ों से तैलीय मैल कैसे साफ करता है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Hydrophobic hydrocarbon tails cluster into the oil droplet while ionic heads stay outward in water, lifting dirt away.", "जल-विरोधी पूँछ मैल/तेल से जुड़ती है व आयनिक सिरा जल से जुड़कर मैल को बाहर खींच लाता है।"] }));
    }
    {
      const x = v(), M = view(x), P = m => [`${m} u`, `${m} u`];
      const c = P(M.totalMass);
      const cand = [...new Set([M.mass, +(M.totalMass * 2).toFixed(1), +(M.totalMass + 12).toFixed(1), +(M.totalAtoms * 2).toFixed(1)])].filter(m => m !== M.totalMass).slice(0, 3);
      const d = withDistractors(c, cand.map(P), 3, q.rnd);
      out.push(ask({ id: "mol-mass", prompt: [`One unit of ${M.name} (${M.formula}) has mass ${M.mass} u. What is the total mass of ${M.count} unit(s)?`, `${M.name} (${M.formula}) की एक इकाई का द्रव्यमान ${M.mass} u है। ${M.count} इकाई का कुल द्रव्यमान क्या होगा?`], image: { vars: x }, options: d.options, correct: d.correct, why: [`Total relative mass = ${M.count} × ${M.mass} u = ${M.totalMass} u.`, `कुल सापेक्ष द्रव्यमान = ${M.count} × ${M.mass} u = ${M.totalMass} u।`] }));
    }
    {
      const x = { mol: 3, count: 1 };
      const c = ["–OH (Alcohol functional group)", "–OH (ऐल्कोहॉल प्रकार्यात्मक समूह)"];
      const pool = [["–COOH (Carboxylic acid)", "–COOH (कार्बोक्सिलिक अम्ल)"], ["–CHO (Aldehyde)", "–CHO (ऐल्डिहाइड)"], ["–CO– (Ketone)", "–CO– (कीटोन)"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "mol-ethanol", prompt: ["Which functional group is present in Ethanol (C₂H₅OH)?", "एथेनॉल (C₂H₅OH) में कौन-सा प्रकार्यात्मक समूह (functional group) उपस्थित है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Ethanol contains the hydroxyl (–OH) alcohol group attached to an ethyl chain.", "एथेनॉल में –OH (ऐल्कोहॉल) प्रकार्यात्मक समूह होता है।"] }));
    }
    {
      const x = { mol: 0, count: 2 };
      const c = ["Total mass of reactants equals total mass of products (Conservation of Mass)", "अभिकारकों का कुल द्रव्यमान उत्पादों के कुल द्रव्यमान के बराबर रहता है"];
      const pool = [["Atoms double during boiling", "उबलने पर परमाणु दोगुने होते हैं"], ["Mass vanishes when gas escapes a closed flask", "बंद फ्लास्क में द्रव्यमान गायब होता है"], ["Only ionic salts conserve mass", "केवल आयनिक लवण द्रव्यमान बचाते हैं"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "mol-predict", kind: "predict", prompt: ["When BaCl₂ and Na₂SO₄ react inside a tightly sealed conical flask, how does the total mass change?", "बंद शंक्वाकार फ्लास्क में BaCl₂ और Na₂SO₄ की अभिक्रिया के बाद कुल द्रव्यमान पर क्या असर होता है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["By Lavoisier's Law of Conservation of Mass, total mass remains strictly unchanged in a closed system.", "द्रव्यमान संरक्षण के नियम के अनुसार बंद पात्र में कुल द्रव्यमान बिल्कुल अपरिवर्तित रहता है।"] }));
    }
    return out;
  }
};
