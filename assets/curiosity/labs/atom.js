/* Curiosity Lab · Atom Builder Lab (NCERT Class IX, Ch 6 Structure of the Atom).
   Build any element from Hydrogen (Z = 1) to Calcium (Z = 20) + Isotopes, watch electrons fill K, L, M, N shells (2, 8, 8, 2),
   and discover valency, noble gases, and isotopes in 3D! */
import { bus } from "../core.js";
import { atomModel } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const view = v => atomModel({ Z: v.Z, iso: v.iso });

function snapshot(canvas, vars, focus) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#0b1424"), A = view(vars);
  const cx = 255, cy = 175;
  C2.text(g, focus === "blind" ? `Bohr Atom · Shells (${A.config})` : `${A.name} (${A.symbol}) · Z = ${A.Z}, A = ${A.A} · Config: ${A.config}`, 360, 22, { size: 15, color: "#93c5fd" });
  /* shells */
  const radii = [48, 80, 112, 142], shNames = ["K", "L", "M", "N"];
  A.shells.forEach((cnt, si) => {
    const r = radii[si];
    C2.circle(g, cx, cy, r, { stroke: "#475569", fill: null, w: 1.8 });
    C2.text(g, shNames[si], cx + r + 10, cy, { size: 11, color: "#94a3b8" });
    for (let k = 0; k < cnt; k++) {
      const a = (k / cnt) * Math.PI * 2 - Math.PI / 2;
      C2.circle(g, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 6.5, { stroke: "#fff", fill: "#38bdf8", w: 1.2 });
    }
  });
  /* nucleus */
  C2.circle(g, cx, cy, 22, { stroke: "#ffd23f", fill: "#ef4444", w: 2.5 });
  C2.text(g, `${A.protons}p⁺`, cx, cy - 6, { size: 11, color: "#fff" });
  C2.text(g, `${A.neutrons}n⁰`, cx, cy + 8, { size: 11, color: "#fef08a" });

  /* summary card on right */
  C2.rect(g, 445, 72, 235, 200, { stroke: "#334155", fill: "rgba(255,255,255,0.04)", lw: 2, r: 12 });
  C2.text(g, `Valence e⁻: ${A.valence}`, 562, 112, { size: 15, color: "#ffd23f" });
  C2.text(g, `Valency: ${A.valency}`, 562, 150, { size: 16, color: "#46e08a" });
  C2.text(g, `Mass A = ${A.A} u`, 562, 190, { size: 14, color: "#e2e8f0" });
  C2.text(g, A.kind, 562, 230, { size: 13, color: "#bae6fd" });
  return canvas;
}

export default {
  id: "atom", cls: 9, unit: "ix/ix6", icon: "⚛️",
  title: { en: "Atom Builder Lab — Bohr shells", hi: "परमाणु निर्माण प्रयोगशाला — बोर मॉडल" },
  blurb: { en: "Add protons, neutrons & electrons from Hydrogen to Calcium in 3D — see K, L, M, N orbits fill and valency emerge!", hi: "हाइड्रोजन से कैल्शियम तक प्रोटॉन, न्यूट्रॉन व इलेक्ट्रॉन जोड़ो और K, L, M, N कक्षाएँ व संयोजकता देखो!" },
  vars: [
    { id: "Z", label: { en: "Atomic number Z (protons = electrons)", hi: "परमाणु संख्या Z" }, unit: "", min: 1, max: 20, step: 1, value: 6 },
    { id: "iso", label: { en: "Extra neutrons (Isotopes)", hi: "अतिरिक्त न्यूट्रॉन (समस्थानिक)" }, unit: "", min: 0, max: 2, step: 1, value: 0 }
  ],
  facts(v) {
    const A = view(v);
    return [
      { id: "el", en: "Element & symbol", hi: "तत्व व प्रतीक", value: `${A.name} (${A.symbol}) · ${A.hi}` },
      { id: "cfg", en: "Electronic configuration (K, L, M, N)", hi: "इलेक्ट्रॉनिक विन्यास", value: A.config },
      { id: "val", en: "Valency (combining capacity)", hi: "संयोजकता", value: `${A.valency} (${A.valence} valence e⁻ · ${A.kind})` },
      { id: "mass", en: "Nucleon Mass number A = p⁺ + n⁰", hi: "द्रव्यमान संख्या A", value: `${A.A} u (${A.protons}p⁺, ${A.neutrons}n⁰)` }
    ];
  },
  snapshot,
  missions: [
    { id: "atom-noble", en: "Build an inert Noble Gas (He, Ne, or Ar) with full outer shell!", hi: "पूर्ण बाहरी कक्षा वाली अक्रिय गैस (He, Ne या Ar) बनाओ!", check: v => view(v).noble },
    { id: "atom-iso", en: "Create a heavier Isotope (extra neutrons ≥ 2, e.g. Carbon-14)", hi: "भारी समस्थानिक बनाओ (अतिरिक्त न्यूट्रॉन ≥ 2, जैसे C-14)", check: v => v.iso >= 2 },
    { id: "atom-ca", en: "Reach Calcium (Z = 20) and see the 4th N-shell open!", hi: "कैल्शियम (Z = 20) तक पहुँचकर चौथी N-कक्षा खोलो!", check: v => v.Z === 20 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 4.2, 8.8], target: [0, 0, 0], bg: 0x0b1424, minDist: 4, maxDist: 18 });
    const { scene } = st, dyn = new THREE.Group(); scene.add(dyn);
    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    const h1 = el("span"), h2 = el("span"); hud.append(h1, h2);

    let electrons = [], t = 0;

    const rebuild = () => {
      while (dyn.children.length) {
        const c = dyn.children.pop();
        c.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); }); });
      }
      electrons = [];
      const A = view(ctx.vars);
      /* nucleus cluster */
      const nucGrp = new THREE.Group(); dyn.add(nucGrp);
      const tot = Math.min(20, A.protons + A.neutrons);
      for (let i = 0; i < tot; i++) {
        const isP = i < Math.round((A.protons / (A.protons + A.neutrons)) * tot);
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), new THREE.MeshStandardMaterial({ color: isP ? 0xef4444 : 0xfacc15, roughness: 0.35 }));
        const phi = Math.acos(1 - (2 * (i + 0.5)) / tot), th = Math.PI * (1 + Math.sqrt(5)) * i;
        const rr = tot > 2 ? 0.28 : 0.14;
        s.position.set(rr * Math.sin(phi) * Math.cos(th), rr * Math.sin(phi) * Math.sin(th), rr * Math.cos(phi));
        nucGrp.add(s);
      }

      /* Bohr shells */
      const radii = [1.1, 1.85, 2.6, 3.35];
      A.shells.forEach((cnt, si) => {
        const r = radii[si];
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.02, 8, 64), new THREE.MeshBasicMaterial({ color: 0x475569 }));
        ring.rotation.x = Math.PI / 2; dyn.add(ring);
        for (let k = 0; k < cnt; k++) {
          const e = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.7 }));
          dyn.add(e);
          electrons.push({ m: e, r, ang: (k / cnt) * Math.PI * 2, spd: (1.5 - si * 0.25) * (si % 2 ? -1 : 1) });
        }
      });

      const tag = labelSprite(THREE, `${A.symbol} · ${A.name}`, `Z=${A.Z} · A=${A.A} · (${A.config})`, { scale: 0.9, size: 26, color: "#e0f2fe" });
      tag.position.set(0, 2.2, 0); dyn.add(tag);
      h1.textContent = `${A.name} (${A.symbol}) · Z=${A.Z}, A=${A.A}`;
      h2.textContent = `Shells: ${A.config} · Valency: ${A.valency}`;
    };

    const stopFrame = st.onFrame(dt => {
      t += dt;
      electrons.forEach(e => {
        const a = e.ang + t * e.spd;
        e.m.position.set(Math.cos(a) * e.r, 0, Math.sin(a) * e.r);
      });
    });

    const side = ctx.side; side.replaceChildren();
    const sl = sliders(ctx, side);
    const presets = el("div", "cl-presets"); presets.appendChild(el("span", "cl-lab", "Jump to · चुनें"));
    [["H (1)", 1], ["C (6)", 6], ["O (8)", 8], ["Ne (10)", 10], ["Na (11)", 11], ["Cl (17)", 17], ["Ca (20)", 20]].forEach(([lbl, z]) => {
      actionButton(presets, lbl, () => { ctx.set("Z", z); sfx.play("pop"); sl.sync(); }, "cl-chipb");
    });
    side.insertBefore(presets, sl.root.nextSibling);

    const facts = factsView(ctx, side);
    note(side, "Bohr shells hold max 2 (K), 8 (L), 8 (M for Z≤20). Isotopes have the SAME atomic number Z (protons) but DIFFERENT neutrons and mass number A!", "बोर कक्षाओं में अधिकतम 2 (K), 8 (L) इलेक्ट्रॉन रहते हैं। समस्थानिकों में परमाणु संख्या Z समान पर न्यूट्रॉन व द्रव्यमान संख्या A भिन्न होती है!");

    const off = bus.on("sim:change", e => {
      if (e.labId !== "atom") return;
      rebuild(); facts.update(); sl.sync();
    });
    rebuild(); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ Z: seen(q, "Z"), iso: seen(q, "iso") });
    {
      const x = v(), A = view(x);
      const c = [A.config, A.config];
      const pool = [["2, 8, 1", "2, 8, 1"], ["2, 6", "2, 6"], ["2, 8, 7", "2, 8, 7"], ["1", "1"], ["2, 8, 8, 2", "2, 8, 8, 2"]].filter(p => p[0] !== A.config);
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "atom-config", prompt: [`What is the electronic configuration (K, L, M, N) of ${A.name} (Z = ${A.Z})?`, `${A.hi} (Z = ${A.Z}) का इलेक्ट्रॉनिक विन्यास (K, L, M, N) क्या है?`],
        image: { vars: x, focus: "blind" }, options: d.options, correct: d.correct,
        why: [`Filling 2 electrons in K, up to 8 in L, up to 8 in M gives ${A.config} for Z = ${A.Z}.`, `K में 2 और L, M में क्रमशः 8 तक इलेक्ट्रॉन भरने पर ${A.config} प्राप्त होता है।`]
      }));
    }
    {
      const x = v(), A = view(x);
      const c = [String(A.valency), String(A.valency)];
      const pool = ["0", "1", "2", "3", "4"].filter(n => n !== String(A.valency)).map(n => [n, n]);
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "atom-valency", prompt: [`${A.name} has electronic configuration (${A.config}). What is its valency?`, `${A.hi} का विन्यास (${A.config}) है। इसकी संयोजकता (valency) कितनी है?`],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: [A.Z === 2 ? "Helium has a complete K-shell of 2 electrons, so its valency is 0." : `With ${A.valence} valence electron(s), valency = ${A.valence <= 4 ? A.valence : "8 − " + A.valence} = ${A.valency}.`, `बाहरी कक्षा में ${A.valence} इलेक्ट्रॉन होने से संयोजकता ${A.valency} है।`]
      }));
    }
    {
      const x = { Z: 6, iso: 2 };
      const c = ["Same atomic number Z, different mass number A (neutrons)", "समान परमाणु संख्या Z, भिन्न द्रव्यमान संख्या A (न्यूट्रॉन)"];
      const pool = [["Same mass number A, different protons Z", "समान द्रव्यमान संख्या, भिन्न प्रोटॉन"], ["Different number of electrons only", "केवल इलेक्ट्रॉनों की संख्या भिन्न"], ["No nucleus inside the atom", "नाभिक अनुपस्थित होता है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "atom-isotopes", prompt: ["How do isotopes of the same element (such as ¹²C and ¹⁴C) differ?", "एक ही तत्व के समस्थानिक (जैसे ¹²C और ¹⁴C) किसमें भिन्न होते हैं?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Isotopes share the exact same number of protons (Z) and chemical properties, differing only in neutron count and mass number A.", "समस्थानिकों में प्रोटॉन संख्या (Z) समान होती है, केवल न्यूट्रॉन व द्रव्यमान संख्या (A) भिन्न होते हैं।"]
      }));
    }
    {
      const x = { Z: 10, iso: 0 };
      const c = ["Noble gas — chemically inert with a full octet", "अक्रिय गैस — पूर्ण अष्टक के कारण रासायनिक रूप से निष्क्रिय"];
      const pool = [["Highly reactive metal", "अत्यंत अभिक्रियाशील धातु"], ["Unstable radioactive halogen", "अस्थिर हैलोजन"], ["Alkali earth metal", "क्षारीय मृदा धातु"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "atom-noble", prompt: ["Neon (Z = 10) has electronic configuration (2, 8). What does this make Neon?", "निऑन (Z = 10) का विन्यास (2, 8) है। इससे निऑन कैसा तत्व बनता है?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Its outermost L-shell already holds 8 electrons (octet), so valency = 0 and it is chemically inert.", "बाहरी कक्षा में 8 इलेक्ट्रॉन पूरे होने से संयोजकता 0 और यह अक्रिय गैस है।"]
      }));
    }
    {
      const x = v(), A = view(x), M = n => [`${n} u`, `${n} u`];
      const c = M(A.A);
      const cand = [...new Set([A.protons, A.neutrons, A.A + 2, A.A + 4, Math.max(1, A.A - 2), A.protons * 2 + 1])].filter(n => n !== A.A).slice(0, 3);
      const d = withDistractors(c, cand.map(M), 3, q.rnd);
      out.push(ask({
        id: "atom-mass", prompt: [`An atom of ${A.name} has ${A.protons} protons and ${A.neutrons} neutrons. What is its mass number A?`, `${A.hi} के परमाणु में ${A.protons} प्रोटॉन और ${A.neutrons} न्यूट्रॉन हैं। द्रव्यमान संख्या A कितनी होगी?`],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: [`Mass number A = protons + neutrons = ${A.protons} + ${A.neutrons} = ${A.A} u.`, `द्रव्यमान संख्या A = प्रोटॉन + न्यूट्रॉन = ${A.protons} + ${A.neutrons} = ${A.A} u।`]
      }));
    }
    {
      const x = { Z: 11, iso: 0 };
      const c = ["Loses 1 electron to form a Na⁺ cation (+1)", "1 इलेक्ट्रॉन खोकर Na⁺ धनायन (+1) बनाता है"];
      const pool = [["Gains 7 electrons to form Na⁷⁻", "7 इलेक्ट्रॉन लेकर Na⁷⁻ बनाता है"], ["Gains 1 proton into its nucleus", "नाभिक में 1 प्रोटॉन लेता है"], ["Never reacts with any element", "कभी किसी तत्व से क्रिया नहीं करता"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "atom-predict", kind: "predict", prompt: ["Sodium (Z = 11) has configuration (2, 8, 1). How does it achieve a stable octet during a reaction?", "सोडियम (Z = 11) का विन्यास (2, 8, 1) है। स्थायी अष्टक पाने के लिए यह क्या करेगा?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Losing 1 outer electron leaves a full (2, 8) configuration, forming a positively charged Na⁺ ion.", "1 बाहरी इलेक्ट्रॉन त्यागकर यह (2, 8) का स्थायी अष्टक व Na⁺ आयन बनाता है।"]
      }));
    }
    return out;
  }
};
