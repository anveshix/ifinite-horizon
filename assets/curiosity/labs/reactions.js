/* Curiosity Lab · Chemical Reactions & Reactivity Lab (NCERT Class X, Ch 1 & Ch 3).
   Trigger Combination, Thermal Decomposition, Iron-Copper Sulphate Displacement, Double Displacement,
   Redox (CuO + H₂), and Ionic Na⁺Cl⁻ electron transfer in 3D with rising bubbles, precipitate & thermal glow! */
import { bus } from "../core.js";
import { REACTION_TYPES, reactionModel } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const view = v => reactionModel({ rxn: v.rxn, progress: v.progress, temp: v.temp });

function snapshot(canvas, vars, focus) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#0e1522"), R = view(vars);
  C2.text(g, focus === "blind" ? "Chemical Reaction Flask · Observation" : `${R.name} · ${R.eq}`, 360, 24, { size: 15, color: "#93c5fd" });

  /* left reactant beaker -> arrow -> right product beaker */
  C2.rect(g, 95, 95, 165, 165, { stroke: "#cbd5e1", fill: R.rxn === 2 ? "rgba(37,99,235,0.42)" : "rgba(56,189,248,0.18)", lw: 2.5, r: 10 });
  C2.text(g, "Reactants", 177, 280, { size: 13, color: "#cbd5e1" });

  C2.arrow(g, 285, 175, 435, 175, R.exo ? "#fb923c" : "#38bdf8", 4, 12);
  C2.text(g, R.exo ? "Exothermic (ΔH < 0)" : "Endothermic (Heat Δ)", 360, 150, { size: 12, color: R.exo ? "#fdba74" : "#bae6fd" });

  const prodFill = R.rxn === 2 ? "rgba(34,197,94,0.38)" : R.rxn === 3 ? "rgba(248,250,252,0.34)" : R.rxn === 1 ? "rgba(250,204,21,0.3)" : "rgba(56,189,248,0.22)";
  C2.rect(g, 460, 95, 165, 165, { stroke: "#cbd5e1", fill: prodFill, lw: 2.5, r: 10 });
  C2.text(g, "Products", 542, 280, { size: 13, color: "#cbd5e1" });

  if (R.rxn === 2) {
    C2.rect(g, 165, 120, 22, 110, { stroke: "#94a3b8", fill: "#64748b", lw: 1.5, r: 4 });
    C2.rect(g, 530, 120, 22, 110, { stroke: "#fed7aa", fill: "#b45309", lw: 1.5, r: 4 });
  }
  C2.text(g, R.obs, 360, 314, { size: 13, color: "#ffd23f" });
  return canvas;
}

export default {
  id: "reactions", cls: 10, unit: "x/ch1", icon: "⚗️",
  title: { en: "Reactions & Metals Lab — Displacement & Redox", hi: "अभिक्रिया व धातु प्रयोगशाला — विस्थापन व रेडॉक्स" },
  blurb: { en: "Run 6 classic NCERT reactions in 3D: dip Iron into blue CuSO₄, burn Magnesium ribbon, precipitate BaSO₄, or transfer electrons from Na to Cl!", hi: "लोहे को नीले CuSO₄ में डुबोओ, मैग्नीशियम जलाओ, BaSO₄ अवक्षेप बनाओ या Na से Cl तक इलेक्ट्रॉन स्थानांतरण देखो!" },
  vars: [
    { id: "rxn", label: { en: "Reaction experiment", hi: "अभिक्रिया प्रयोग" }, unit: "", min: 0, max: 5, step: 1, value: 2 },
    { id: "progress", label: { en: "Reaction progress", hi: "अभिक्रिया प्रगति" }, unit: "%", min: 0, max: 100, step: 5, value: 80 },
    { id: "temp", label: { en: "Temperature", hi: "तापमान" }, unit: "°C", min: 20, max: 120, step: 10, value: 30 }
  ],
  facts(v) {
    const R = view(v);
    return [
      { id: "type", en: "Reaction type", hi: "अभिक्रिया प्रकार", value: `${R.name} (${R.hi})` },
      { id: "eq", en: "Balanced equation", hi: "संतुलित समीकरण", value: R.eq },
      { id: "obs", en: "Key lab observation", hi: "मुख्य प्रेक्षण", value: R.obs },
      { id: "therm", en: "Thermal nature & rate", hi: "ऊष्मीय प्रकृति व दर", value: `${R.exo ? "Exothermic (releases heat)" : "Endothermic (needs heat)"} · Rate ${R.rate}×` }
    ];
  },
  snapshot,
  missions: [
    { id: "rxn-disp", en: "Run Fe + CuSO₄ displacement to watch blue fade to pale green!", hi: "Fe + CuSO₄ विस्थापन अभिक्रिया चलाकर नीला विलयन हरा होते देखो!", check: v => v.rxn === 2 && v.progress >= 80 },
    { id: "rxn-decomp", en: "Heat Pb(NO₃)₂ above 80 °C to release brown NO₂ fumes!", hi: "Pb(NO₃)₂ को 80 °C से अधिक गर्म कर भूरा NO₂ धुआँ देखो!", check: v => v.rxn === 1 && v.temp >= 80 },
    { id: "rxn-ionic", en: "Inspect Na + Cl → Na⁺Cl⁻ ionic electron transfer!", hi: "Na + Cl → Na⁺Cl⁻ आयनिक इलेक्ट्रॉन स्थानांतरण देखो!", check: v => v.rxn === 5 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 2.2, 8.2], target: [0, 0.2, 0], bg: 0x0e1522, minDist: 4, maxDist: 16 });
    const { scene } = st;
    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    const h1 = el("span"), h2 = el("span"); hud.append(h1, h2);

    const beaker = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.75, 3.0, 32, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.22, side: THREE.DoubleSide }));
    beaker.position.y = 0.2; scene.add(beaker);
    const liqMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, transparent: true, opacity: 0.65, roughness: 0.2 });
    const liq = new THREE.Mesh(new THREE.CylinderGeometry(1.66, 1.66, 2.3, 32), liqMat);
    liq.position.y = -0.1; scene.add(liq);

    /* dipping nail / ribbon / crystal core */
    const rodMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 });
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.4, 16), rodMat);
    rod.position.set(0, 0.65, 0); scene.add(rod);

    /* reactive rising gas bubbles / precipitate / glowing sparks */
    const parts = [];
    for (let i = 0; i < 36; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshStandardMaterial({ color: 0xf8fafc, emissive: 0x111111 }));
      scene.add(p);
      parts.push({ m: p, x: (Math.random() - 0.5) * 2.2, y: -1.1 + Math.random() * 2.2, z: (Math.random() - 0.5) * 2.2, spd: 0.6 + Math.random() * 1.2 });
    }

    let tag = null;
    const sync = () => {
      const R = view(ctx.vars), k = R.progress / 100;
      if (R.rxn === 2) {
        liqMat.color.setRGB(0.14 * (1 - k) + 0.18 * k, 0.38 * (1 - k) + 0.72 * k, 0.92 * (1 - k) + 0.35 * k);
        rodMat.color.setRGB(0.55 * (1 - k) + 0.78 * k, 0.58 * (1 - k) + 0.38 * k, 0.62 * (1 - k) + 0.14 * k);
      } else if (R.rxn === 3) {
        liqMat.color.setHex(0xe2e8f0); rodMat.color.setHex(0xf8fafc);
      } else if (R.rxn === 0) {
        liqMat.color.setHex(0x1e293b); rodMat.color.setHex(0xffffff);
      } else if (R.rxn === 1) {
        liqMat.color.setHex(0xfacc15); rodMat.color.setHex(0xb45309);
      } else if (R.rxn === 4) {
        liqMat.color.setHex(0x38bdf8); rodMat.color.setHex(k > 0.5 ? 0xb45309 : 0x1f2937);
      } else {
        liqMat.color.setHex(0x818cf8); rodMat.color.setHex(0xfacc15);
      }
      if (tag) scene.remove(tag);
      tag = labelSprite(THREE, R.eq, R.obs, { scale: 0.85, size: 22, color: "#fef08a" });
      tag.position.set(0, 2.35, 0); scene.add(tag);
      h1.textContent = `${R.name} · ${R.progress}%`;
      h2.textContent = R.obs;
    };

    const stopFrame = st.onFrame(dt => {
      const R = view(ctx.vars), s = R.rate;
      parts.forEach((p, idx) => {
        if (R.rxn === 3) {
          p.y = Math.max(-1.05, p.y - dt * 0.4 * s);
          p.m.material.color.setHex(0xf8fafc);
        } else if (R.rxn === 0) {
          p.y = 0.4 + Math.sin(performance.now() * 0.004 + idx) * 0.6;
          p.m.material.color.setHex(0xffffff);
        } else if (R.rxn === 1) {
          p.y = ((p.y + 1.1 + dt * p.spd * s) % 3.0) - 0.8;
          p.m.material.color.setHex(0xb45309);
        } else {
          p.y = ((p.y + 1.1 + dt * p.spd * s) % 2.1) - 1.0;
          p.m.material.color.setHex(R.rxn === 5 ? (idx % 2 ? 0xfacc15 : 0x4ade80) : 0xbae6fd);
        }
        p.m.position.set(p.x * 0.85, p.y, p.z * 0.85);
      });
    });

    const side = ctx.side; side.replaceChildren();
    const sl = sliders(ctx, side);
    const presets = el("div", "cl-presets"); presets.appendChild(el("span", "cl-lab", "Pick reaction · चुनें"));
    REACTION_TYPES.forEach((r, i) => {
      actionButton(presets, r.name.split(" ")[0], () => { ctx.set("rxn", i); ctx.set("progress", 90); sfx.play(i === 1 || i === 3 ? "fizz" : "pop"); sl.sync(); sync(); }, "cl-chipb");
    });
    const extraBox = el("div", "cl-presets"); extraBox.appendChild(el("span", "cl-lab", "Metals & Corrosion · धातु एवं संक्षारण"));
    actionButton(extraBox, "🛡️ Galvanised Fe (Zn coat)", () => { rodMat.color.setHex(0xcbd5e1); liqMat.color.setHex(0x38bdf8); h1.textContent = "Galvanisation: Zn protects Iron from Rusting"; h2.textContent = "Zn is more reactive → sacrifices itself!"; sfx.play("pop"); }, "cl-chipb");
    actionButton(extraBox, "🔥 Thermite (Fe₂O₃ + 2Al)", () => { rodMat.color.setHex(0xf97316); liqMat.color.setHex(0xef4444); h1.textContent = "Thermite: Fe₂O₃ + 2Al → 2Fe (molten) + Al₂O₃"; h2.textContent = "Exothermic welding of railway tracks!"; sfx.play("fizz"); }, "cl-chipb");
    /* Interactive Equation Balancer + Reactivity Series Drop Test */
    const balBox = el("div", "cl-presets"); balBox.appendChild(el("span", "cl-lab", "⚖️ Equation Balancer · समीकरण संतुलन"));
    let cH2 = 1, cO2 = 1, cH2O = 1;
    const balStat = el("p", "cl-note", "");
    const paintBal = () => {
      const L_H = 2 * cH2, L_O = 2 * cO2, R_H = 2 * cH2O, R_O = cH2O, ok = L_H === R_H && L_O === R_O;
      balStat.textContent = `${cH2} H₂ + ${cO2} O₂ → ${cH2O} H₂O  |  LHS(H=${L_H},O=${L_O}) vs RHS(H=${R_H},O=${R_O}) ${ok ? "✅ BALANCED!" : "❌ Unbalanced"}`;
      if (ok) { h1.textContent = `Balanced: ${cH2}H₂ + ${cO2}O₂ → ${cH2O}H₂O`; h2.textContent = "Law of Conservation of Mass satisfied!"; }
    };
    [["H₂+", () => { cH2 = (cH2 % 4) + 1; }], ["O₂+", () => { cO2 = (cO2 % 4) + 1; }], ["H₂O+", () => { cH2O = (cH2O % 4) + 1; }]].forEach(([lbl, fn]) => {
      actionButton(balBox, lbl, () => { fn(); paintBal(); sfx.play("tick"); }, "cl-chipb");
    });
    paintBal();
    const serBox = el("div", "cl-presets"); serBox.appendChild(el("span", "cl-lab", "🧪 Reactivity Dip in CuSO₄ (Blue)"));
    [["K/Mg", true, 0xe2e8f0, "Rapid vigorous displacement!"], ["Zn", true, 0x94a3b8, "Zn + CuSO₄ → ZnSO₄ + Cu↓"], ["Fe", true, 0x64748b, "Fe + CuSO₄ → FeSO₄ (Green) + Cu↓"], ["Cu/Ag", false, 0xb45309, "NO reaction (below Cu in series)"]].forEach(([m, reacts, col, msg]) => {
      actionButton(serBox, m, () => {
        rodMat.color.setHex(col); liqMat.color.setHex(reacts ? 0x22c55e : 0x2563eb);
        h1.textContent = `${m} in CuSO₄`; h2.textContent = msg; sfx.play(reacts ? "fizz" : "tick");
      }, "cl-chipb");
    });
    side.insertBefore(presets, sl.root.nextSibling);
    side.insertBefore(extraBox, presets.nextSibling);
    side.insertBefore(balBox, extraBox.nextSibling);
    side.insertBefore(balStat, balBox.nextSibling);
    side.insertBefore(serBox, balStat.nextSibling);
    const facts = factsView(ctx, side);
    note(side, "Reactivity Series: K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Ag > Au. Iron displaces Copper from CuSO₄ because Fe is more reactive than Cu!", "सक्रियता श्रेणी में लोहा (Fe) ताँबे (Cu) से अधिक अभिक्रियाशील है, इसलिए यह CuSO₄ से Cu को विस्थापित कर देता है।");

    const off = bus.on("sim:change", e => { if (e.labId === "reactions") { sync(); facts.update(); sl.sync(); } });
    sync();
    if (ctx.preset?.sub === "corrosion") { rodMat.color.setHex(0xcbd5e1); h1.textContent = "Galvanisation & Rusting Prevention"; }
    if (ctx.preset?.sub === "extraction") { rodMat.color.setHex(0xf97316); h1.textContent = "Thermite & Ore Reduction (Fe₂O₃ + 2Al)"; }
    if (ctx.preset?.sub === "balance") { paintBal(); }
    if (ctx.preset?.sub === "series") { h1.textContent = "Reactivity Series Drop-Test"; h2.textContent = "K > Na > Ca > Mg > Al > Zn > Fe > Cu > Ag"; }
    facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ rxn: seen(q, "rxn"), progress: 90, temp: 30 });
    {
      const x = { rxn: 2, progress: 90, temp: 30 };
      const c = ["Blue turns pale green + reddish-brown copper deposits on nail", "नीला रंग हल्का हरा हो जाता है + कील पर भूरा ताँबा जमता है"];
      const pool = [["Green turns dark blue + silver deposits", "हरा नीला हो जाता है"], ["No reaction occurs at all", "कोई अभिक्रिया नहीं होती"], ["Black CuO powder forms at bottom", "काला CuO बनता है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "rxn-disp", prompt: ["When an iron nail is dipped in blue CuSO₄ solution, what change is observed?", "जब लोहे की कील को नीले CuSO₄ विलयन में डुबोया जाता है तो क्या दिखता है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Fe displaces Cu (Fe + CuSO₄ → FeSO₄ + Cu): green FeSO₄ forms and brown Cu coats the nail.", "Fe, Cu से अधिक सक्रिय होने के कारण Cu को विस्थापित कर हरा FeSO₄ और भूरा Cu बनाता है।"] }));
    }
    {
      const x = { rxn: 3, progress: 90, temp: 30 };
      const c = ["White precipitate of Barium Sulphate (BaSO₄)", "बेरियम सल्फेट (BaSO₄) का सफेद अवक्षेप"];
      const pool = [["Reddish-brown nitrogen dioxide gas", "भूरा NO₂ गैस"], ["Blue copper hydroxide gel", "नीला कॉपर हाइड्रॉक्साइड"], ["Yellow lead iodide crystals", "पीला लेड आयोडाइड"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "rxn-ddisp", prompt: ["Mixing Na₂SO₄ and BaCl₂ solutions produces an instant precipitate via double displacement. What forms?", "Na₂SO₄ और BaCl₂ मिलाने पर द्विविस्थापन से कौन-सा अवक्षेप बनता है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Ba²⁺ and SO₄²⁻ combine immediately to form insoluble white BaSO₄ precipitate.", "Ba²⁺ और SO₄²⁻ मिलकर अघुलनशील सफेद BaSO₄ अवक्षेप बनाते हैं।"] }));
    }
    {
      const x = { rxn: 4, progress: 90, temp: 60 };
      const c = ["CuO is reduced (loses O); H₂ is oxidised (gains O)", "CuO का अपचयन (O की हानि); H₂ का उपचयन (O की वृद्धि)"];
      const pool = [["CuO is oxidised; H₂ is reduced", "CuO का उपचयन; H₂ का अपचयन"], ["Both CuO and H₂ are oxidised", "दोनों का उपचयन"], ["No electron or oxygen transfer occurs", "कोई ऑक्सीजन स्थानांतरण नहीं"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "rxn-redox", prompt: ["In the reaction CuO + H₂ → Cu + H₂O, which substance is reduced and which is oxidised?", "CuO + H₂ → Cu + H₂O अभिक्रिया में किसका अपचयन और किसका उपचयन होता है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Loss of oxygen is reduction (CuO → Cu), while gain of oxygen is oxidation (H₂ → H₂O).", "ऑक्सीजन निकलना अपचयन (CuO→Cu) व जुड़ना उपचयन (H₂→H₂O) है।"] }));
    }
    {
      const x = { rxn: 0, progress: 90, temp: 80 };
      const c = ["Balanced equation obeys Law of Conservation of Mass", "संतुलित समीकरण द्रव्यमान संरक्षण के नियम का पालन करता है"];
      const pool = [["To make metals heavier after heating", "धातु का भार बढ़ाने हेतु"], ["Because oxygen disappears in open air", "ऑक्सीजन गायब होने के कारण"], ["Only acids need balancing", "केवल अम्लों को संतुलित करते हैं"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "rxn-balance", prompt: ["Why must every chemical equation like 2Mg + O₂ → 2MgO be balanced?", "2Mg + O₂ → 2MgO जैसे प्रत्येक रासायनिक समीकरण को संतुलित करना क्यों ज़रूरी है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Atoms are neither created nor destroyed (Law of Conservation of Mass), so atom counts on both sides must match.", "परमाणु न बनाए जाते हैं न नष्ट, इसलिए दोनों ओर परमाणुओं की संख्या बराबर होनी चाहिए।"] }));
    }
    {
      const x = { rxn: 5, progress: 90, temp: 30 };
      const c = ["Sodium donates 1 electron to Chlorine forming Na⁺ and Cl⁻", "सोडियम 1 इलेक्ट्रॉन क्लोरीन को देकर Na⁺ व Cl⁻ बनाता है"];
      const pool = [["Both share 4 pairs of covalent electrons", "दोनों 4 सहसंयोजक इलेक्ट्रॉन साझा करते हैं"], ["Chlorine donates 7 protons to Sodium", "क्लोरीन 7 प्रोटॉन सोडियम को देता है"], ["Ionic solids conduct electricity when solid", "आयनिक ठोस अवस्था में बिजली चलाते हैं"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "rxn-ionic", prompt: ["How is an ionic bond formed between Sodium (2,8,1) and Chlorine (2,8,7)?", "सोडियम (2,8,1) और क्लोरीन (2,8,7) के बीच आयनिक आबंध कैसे बनता है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Electrostatic attraction between oppositely charged Na⁺ and Cl⁻ ions forms a high-melting ionic crystal.", "Na⁺ धनायन और Cl⁻ ऋणायन के बीच स्थिरवैद्युत आकर्षण से आयनिक क्रिस्टल बनता है।"] }));
    }
    {
      const x = v();
      const c = ["Copper is below Iron in reactivity, so NO reaction occurs", "ताँबा लोहे से कम अभिक्रियाशील है, अतः कोई अभिक्रिया नहीं होगी"];
      const pool = [["Copper explodes violently in FeSO₄", "ताँबा FeSO₄ में विस्फोट करेगा"], ["Iron metal precipitates immediately", "लोहा तुरंत नीचे बैठ जाएगा"], ["Solution turns bright pink", "विलयन गुलाबी हो जाएगा"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "rxn-predict", kind: "predict", prompt: ["What happens if you drop a Copper wire into green Ferrous Sulphate (FeSO₄) solution?", "यदि हरे फेरस सल्फेट (FeSO₄) विलयन में ताँबे (Cu) का तार डाला जाए तो क्या होगा?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Because Cu is less reactive than Fe, it cannot displace Iron from FeSO₄.", "Cu, Fe से कम सक्रिय होने के कारण Fe को विस्थापित नहीं कर सकता।"] }));
    }
    return out;
  }
};
