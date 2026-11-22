/* Curiosity Lab · Ecology, 10% Pyramid & Diversity 3D Lab (NCERT Class X Ch 13 & Class IX Ch 4).
   Build a 3D Trophic Energy Pyramid (Lindeman's 10% law!), test Biomagnification of DDT across food chains,
   shield Earth with Ozone (O₃), and explore Whittaker's 5 Kingdoms! */
import { bus } from "../core.js";
import { ecologyModel } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const view = v => ecologyModel({ producerE: v.producerE, ddt: v.ddt, ozonePct: v.ozonePct });

function snapshot(canvas, vars, focus) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#0c1816"), E = view(vars);
  C2.text(g, focus === "blind" ? "Trophic Energy Pyramid (10% Law)" : `Energy Pyramid · Producers ${E.t1} J → Top Carnivore ${E.t4} J`, 360, 22, { size: 15, color: "#86efac" });
  const levels = [
    ["Top Carnivore (T₄)", E.t4, 150, "#ef4444"],
    ["Secondary Consumer (T₃)", E.t3, 240, "#f97316"],
    ["Herbivore (T₂)", E.t2, 340, "#facc15"],
    ["Producers / Plants (T₁)", E.t1, 460, "#22c55e"]
  ];
  levels.forEach(([lbl, val, w, col], i) => {
    const y = 62 + i * 56;
    C2.rect(g, 360 - w / 2, y, w, 46, { stroke: "#e2e8f0", fill: col, lw: 1.5, r: 8 });
    C2.text(g, `${lbl}: ${val} J`, 360, y + 23, { size: 13, color: "#0f172a" });
  });
  C2.text(g, `DDT Biomagnification: Water ${E.ddt} ppb → Top Hawk ${E.hawkDDT} ppb · Ozone UV Shield: ${E.uvBlockPct}%`, 360, 310, { size: 13, color: "#bae6fd" });
  return canvas;
}

export default {
  id: "ecology", cls: 10, unit: "x/ch13", icon: "🌿",
  title: { en: "Ecology & Diversity 3D Lab — 10% Law & Ozone", hi: "पारिस्थितिकी व विविधता 3D प्रयोगशाला — 10% नियम व ओज़ोन" },
  blurb: { en: "Explore the 3D Trophic Energy Pyramid (only 10% moves up!), watch DDT biomagnify to top predators, protect Earth with Ozone O₃, and review 5 Kingdoms!", hi: "3D ऊर्जा पिरामिड (10% नियम), जैव-आवर्धन (DDT), ओज़ोन O₃ सुरक्षा कवच और 5-जगत वर्गीकरण देखो!" },
  vars: [
    { id: "producerE", label: { en: "Producer (T₁) energy captured", hi: "उत्पादक (T₁) ऊर्जा" }, unit: " J", min: 1000, max: 20000, step: 1000, value: 10000 },
    { id: "ddt", label: { en: "Water pesticide (DDT) concentration", hi: "जल में DDT सांद्रता" }, unit: " ppb", min: 0, max: 10, step: 1, value: 2 },
    { id: "ozonePct", label: { en: "Stratospheric Ozone (O₃) layer", hi: "समतापमंडलीय ओज़ोन (O₃)" }, unit: "%", min: 20, max: 100, step: 5, value: 95 }
  ],
  facts(v) {
    const E = view(v);
    return [
      { id: "e", en: "10% Energy transfer (T₁ → T₂ → T₃ → T₄)", hi: "10% ऊर्जा स्थानांतरण", value: `${E.t1} J → ${E.t2} J → ${E.t3} J → ${E.t4} J` },
      { id: "bio", en: "Biomagnification (Water → Top Hawk)", hi: "जैव-आवर्धन (DDT)", value: `${E.ddt} ppb → ${E.hawkDDT} ppb (1000×!)` },
      { id: "oz", en: "Ozone (O₃) UV-B shield", hi: "ओज़ोन O₃ सुरक्षा", value: `${E.uvBlockPct}% UV blocked (CFCs deplete O₃)` },
      { id: "king", en: "Whittaker 5 Kingdoms + Viruses", hi: "5-जगत वर्गीकरण", value: "Monera, Protista, Fungi, Plantae, Animalia (Viruses = acellular)" }
    ];
  },
  snapshot,
  missions: [
    { id: "eco-ten", en: "Set Producer energy to 10,000 J and verify T₄ gets only 10 J!", hi: "उत्पादक ऊर्जा 10,000 J सेट कर देखो कि T₄ को केवल 10 J मिलती है!", check: v => v.producerE === 10000 },
    { id: "eco-ddt", en: "Set DDT ≥ 6 ppb and observe extreme top-predator biomagnification!", hi: "DDT ≥ 6 ppb पर शीर्ष मांसाहारी में उच्च जैव-आवर्धन देखो!", check: v => v.ddt >= 6 },
    { id: "eco-oz", en: "Drop Ozone below 50% (CFC damage) and watch UV rays breach!", hi: "ओज़ोन 50% से कम होने पर पराबैंगनी (UV) किरणों का खतरा देखो!", check: v => v.ozonePct < 50 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 2.2, 8.6], target: [0, 0.3, 0], bg: 0x0c1816, minDist: 4, maxDist: 16 });
    const { scene } = st;
    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    const h1 = el("span"), h2 = el("span"); hud.append(h1, h2);

    /* 4-tier 3D Trophic Energy Pyramid */
    const tiers = [
      { y: -1.35, w: 3.6, h: 0.72, col: 0x22c55e, lbl: "T₁ Producers" },
      { y: -0.52, w: 2.6, h: 0.72, col: 0xfacc15, lbl: "T₂ Herbivores" },
      { y: 0.31, w: 1.7, h: 0.72, col: 0xf97316, lbl: "T₃ Carnivores" },
      { y: 1.14, w: 0.95, h: 0.72, col: 0xef4444, lbl: "T₄ Top" }
    ];
    const meshes = tiers.map(tr => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(tr.w, tr.h, tr.w * 0.75), new THREE.MeshStandardMaterial({ color: tr.col, roughness: 0.4 }));
      m.position.y = tr.y; scene.add(m);
      const lb = labelSprite(THREE, tr.lbl, null, { scale: 0.56, size: 20, color: "#f8fafc" });
      lb.position.set(tr.w * 0.5 + 1.0, tr.y, 0); scene.add(lb);
      return m;
    });

    /* Stratospheric Ozone Shield arc overhead */
    const ozMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, side: THREE.DoubleSide });
    const ozShield = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.16, 3.2), ozMat);
    ozShield.position.set(0, 2.15, 0); scene.add(ozShield);
    const uvRays = [];
    for (let i = 0; i < 6; i++) {
      const r = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.8, 8), new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.7 }));
      r.position.set(-2.5 + i * 1.0, 0.7, -0.8); scene.add(r); uvRays.push(r);
    }

    let tag = null;
    const sync = () => {
      const E = view(ctx.vars);
      ozMat.opacity = 0.08 + (E.ozonePct / 100) * 0.55;
      ozMat.color.setHex(E.ozonePct < 55 ? 0xfb7185 : 0x38bdf8);
      const leak = 1 - E.ozonePct / 100;
      uvRays.forEach(r => { r.material.opacity = 0.12 + leak * 0.85; r.position.y = E.ozonePct < 55 ? 0.5 : 2.3; r.scale.y = E.ozonePct < 55 ? 1.0 : 0.4; });
      if (tag) scene.remove(tag);
      tag = labelSprite(THREE, `T₁: ${E.t1} J → T₄: ${E.t4} J`, `Ozone ${E.ozonePct}% · Top DDT: ${E.hawkDDT} ppb`, { scale: 0.84, size: 22, color: "#bbf7d0" });
      tag.position.set(0, 2.65, 0); scene.add(tag);
      h1.textContent = `10% Law: ${E.t1}→${E.t2}→${E.t3}→${E.t4} J`;
      h2.textContent = `DDT Top: ${E.hawkDDT} ppb · O₃: ${E.ozonePct}%`;
    };

    const stopFrame = st.onFrame((dt, t) => { meshes.forEach((m, i) => { m.rotation.y = Math.sin(t * 0.5 + i * 0.2) * 0.12; }); });
    const side = ctx.side; side.replaceChildren();
    const sl = sliders(ctx, side);
    const presets = el("div", "cl-presets"); presets.appendChild(el("span", "cl-lab", "Scenarios · स्थितियाँ"));
    [["Healthy (95% O₃)", 10000, 1, 95], ["DDT Biohazard", 10000, 8, 90], ["CFC Ozone Hole", 10000, 2, 30]].forEach(([lbl, p, d, o]) => {
      actionButton(presets, lbl, () => { ctx.set("producerE", p); ctx.set("ddt", d); ctx.set("ozonePct", o); sfx.play("pop"); sl.sync(); sync(); }, "cl-chipb");
    });
    side.insertBefore(presets, sl.root.nextSibling);
    const facts = factsView(ctx, side);
    note(side, "Only ~10% of energy passes from one trophic level to the next (90% lost as heat/life processes), limiting food chains to 3–4 levels. Non-biodegradable DDT does the opposite—concentrating at the top!", "केवल 10% ऊर्जा अगले पोषी स्तर तक जाती है (शेष ऊष्मा में खर्च)। इसके विपरीत, DDT जैसे अजैव-निम्नीकरणीय रसायन शीर्ष जीव में 1000 गुना तक संचित हो जाते हैं!");

    const off = bus.on("sim:change", e => { if (e.labId !== "ecology") return; sync(); facts.update(); sl.sync(); });
    sync(); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ producerE: seen(q, "producerE"), ddt: seen(q, "ddt"), ozonePct: seen(q, "ozonePct") });
    {
      const x = v(), E = view(x), P = j => [`${j} J`, `${j} J`];
      const c = P(E.t3);
      const cand = [...new Set([E.t1, E.t2, E.t4, +(E.t3 * 5).toFixed(1)])].filter(j => j !== E.t3).slice(0, 3);
      const d = withDistractors(c, cand.map(P), 3, q.rnd);
      out.push(ask({ id: "eco-tenpct", prompt: [`If producers (T₁) capture ${E.t1} J of energy, how much energy reaches the 3rd trophic level (T₃ carnivores) by the 10% law?`, `यदि उत्पादक (T₁) ${E.t1} J ऊर्जा ग्रहण करते हैं, तो 10% नियम से तीसरे पोषी स्तर (T₃) को कितनी ऊर्जा मिलेगी?`], image: { vars: x }, options: d.options, correct: d.correct, why: [`T₁ = ${E.t1} J → T₂ = ${E.t2} J (10%) → T₃ = ${E.t3} J (10% of T₂).`, `T₁ = ${E.t1} J → T₂ = ${E.t2} J → T₃ = ${E.t3} J।`] }));
    }
    {
      const x = { producerE: 10000, ddt: 5, ozonePct: 95 };
      const c = ["Top-level consumers / Humans (Biomagnification)", "शीर्ष उपभोक्ता / मनुष्य (जैव-आवर्धन के कारण)"];
      const pool = [["Phytoplankton (Producers)", "पादपप्लवक (उत्पादक)"], ["Soil decomposers only", "केवल मृदा अपघटक"], ["Sunbeams", "सूर्य की किरणें"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "eco-ddt", prompt: ["Which organism in a food chain accumulates the HIGHEST concentration of non-biodegradable pesticides like DDT?", "खाद्य श्रृंखला में DDT जैसे अजैव-निम्नीकरणीय कीटनाशकों की सबसे अधिक सांद्रता किसमें जमा होती है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Because DDT cannot be broken down or excreted, each predator eats many contaminated prey, magnifying DDT at the top (Biomagnification).", "DDT का पाचन न होने से प्रत्येक स्तर पर मात्रा बढ़ती जाती है और शीर्ष उपभोक्ता में सर्वाधिक हो जाती है।"] }));
    }
    {
      const x = { producerE: 10000, ddt: 2, ozonePct: 40 };
      const c = ["Chlorofluorocarbons (CFCs) depleting Stratospheric Ozone (O₃)", "क्लोरोफ्लोरोकार्बन (CFC) द्वारा समतापमंडलीय ओज़ोन (O₃) का क्षरण"];
      const pool = [["Excess oxygen from green trees", "हरे पेड़ों की ऑक्सीजन"], ["Nitrogen gas from Rhizobium", "नाइट्रोजन गैस"], ["Water vapour in rivers", "नदियों की जलवाष्प"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "eco-ozone", prompt: ["What caused the thinning of Earth's protective Ozone (O₃) UV-shield in the stratosphere?", "समतापमंडल में रक्षक ओज़ोन (O₃) परत के पतले होने का मुख्य कारण क्या था?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["CFCs (formerly in refrigerants & aerosols) release chlorine radicals that destroy O₃ molecules, letting harmful UV-B rays through.", "CFC से निकलने वाले क्लोरीन कण O₃ अणुओं को नष्ट करते हैं जिससे पराबैंगनी (UV) किरणें धरती तक पहुँचती हैं।"] }));
    }
    {
      const x = { producerE: 10000, ddt: 2, ozonePct: 95 };
      const c = ["Unidirectional (Sun → Producers → Consumers → Heat; never returns to Sun)", "एकदिशीय (सूर्य → उत्पादक → उपभोक्ता → ऊष्मा; वापस नहीं लौटती)"];
      const pool = [["Cyclic — energy returns back to the Sun", "चक्रीय — सूर्य को वापस लौटती है"], ["100% conserved at every consumer step", "100% ऊर्जा अगले स्तर को मिलती है"], ["Flows backward from Hawks to Plants", "बाज़ से पौधों की ओर बहती है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "eco-flow", prompt: ["How does energy flow through an ecosystem compared to nutrients?", "पोषक तत्वों की तुलना में पारितंत्र में ऊर्जा का प्रवाह कैसा होता है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Nutrients cycle endlessly via decomposers, whereas energy flows strictly unidirectionally and dissipates as heat.", "खनिज चक्रीय होते हैं, पर ऊर्जा प्रवाह सदैव एकदिशीय होता है।"] }));
    }
    {
      const x = { producerE: 10000, ddt: 2, ozonePct: 95 };
      const c = ["Monera (Prokaryotes) · Protista · Fungi · Plantae · Animalia", "मोनेरा · प्रॉटिस्टा · कवक (Fungi) · पादप · जंतु"];
      const pool = [["Bacteria · Viruses · Rocks · Plants", "जीवाणु · विषाणु · चट्टान"], ["Algae · Moss · Ferns · Mammals only", "केवल शैवाल व स्तनधारी"], ["Vertebrates & Invertebrates only", "केवल कशेरुकी"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "eco-kingdoms", prompt: ["What are R.H. Whittaker's Five Kingdoms of living organisms (and why are Viruses excluded)?", "व्हिटेकर के 5-जगत वर्गीकरण में कौन-से पाँच जगत हैं?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Whittaker grouped cellular life into Monera, Protista, Fungi, Plantae & Animalia; Viruses are acellular and hijack host cells.", "व्हिटेकर के 5 जगत मोनेरा, प्रॉटिस्टा, कवक, पादप व जंतु हैं; विषाणु अकोशिकीय होते हैं।"] }));
    }
    {
      const x = { producerE: 10000, ddt: 2, ozonePct: 95 };
      const c = ["Dead waste piles up & mineral nutrients stop recycling to soil", "मृत अपशिष्ट जमा हो जाएगा और खनिजों का मृदा में पुनर्चक्रण रुक जाएगा"];
      const pool = [["Plants grow 10× faster without soil minerals", "पौधे 10× तेज़ बढ़ेंगे"], ["Top predators gain infinite energy", "शीर्ष जीवों को अनंत ऊर्जा मिलेगी"], ["Sunlight turns into DDT", "धूप DDT बन जाएगी"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "eco-predict", kind: "predict", prompt: ["What would happen to an ecosystem if all decomposers (bacteria & fungi) vanished overnight?", "यदि किसी पारितंत्र से सभी अपघटक (जीवाणु व कवक) गायब हो जाएँ, तो क्या होगा?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Decomposers break down dead matter to replenish nitrates and minerals in soil; without them nutrient cycles halt.", "अपघटक मृत कार्बनिक पदार्थों को तोड़कर खनिज मिट्टी में वापस लौटाते हैं; उनके बिना पोषक चक्र रुक जाएगा।"] }));
    }
    return out;
  }
};
