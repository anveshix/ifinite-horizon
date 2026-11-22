/* Curiosity Lab · pH & Acids–Bases Lab (NCERT Class X, Ch 2 Acids, Bases and Salts).
   Slide pH from 0 to 14, switch between Universal, Litmus, Phenolphthalein, and Turmeric indicators,
   watch H⁺ / OH⁻ ions dance in the 3D beaker, and test acid+carbonate fizz! */
import { bus } from "../core.js";
import { PH_INDICATORS, phModel } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const view = v => phModel({ pH: v.pH, indicator: v.indicator });

function snapshot(canvas, vars) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#0b1424"), P = view(vars);
  C2.text(g, `${P.indName} Indicator · pH = ${P.pH} (${P.strength}) → ${P.colorName}`, 360, 24, { size: 15, color: "#93c5fd" });
  /* pH colour bar 0..14 */
  const cols = ["#ef4444", "#f87171", "#fb923c", "#f97316", "#facc15", "#eab308", "#84cc16", "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1", "#7c3aed", "#6d28d9", "#581c87"];
  for (let i = 0; i <= 14; i++) {
    const x = 65 + i * 40;
    C2.rect(g, x, 50, 36, 26, { stroke: i === P.pH ? "#fff" : "#334155", fill: cols[i], lw: i === P.pH ? 3 : 1, r: 4 });
    C2.text(g, String(i), x + 18, 63, { size: 12, color: i === 4 || i === 5 || i === 6 ? "#0f172a" : "#fff" });
  }
  /* beaker */
  C2.rect(g, 245, 110, 230, 175, { stroke: "#cbd5e1", fill: "rgba(255,255,255,0.04)", lw: 3, r: 12 });
  C2.rect(g, 250, 165, 220, 115, { stroke: null, fill: P.hex, lw: 0, r: 8 });
  C2.text(g, `${P.colorName} (${P.colorHi})`, 360, 224, { size: 16, color: P.hex === "#facc15" || P.hex === "#eab308" ? "#0f172a" : "#fff" });
  C2.text(g, `[H⁺] = 10^(${P.hExp}) M · [OH⁻] = 10^(${P.ohExp}) M`, 360, 312, { size: 14, color: "#bae6fd" });
  return canvas;
}

export default {
  id: "ph", cls: 10, unit: "x/ch2", icon: "🧪",
  title: { en: "pH & Acids–Bases Lab — indicators", hi: "pH व अम्ल-क्षारक प्रयोगशाला" },
  blurb: { en: "Test HCl, Lemon, Water, Baking Soda & NaOH from pH 0 to 14 with Universal, Litmus, Phenolphthalein, and Turmeric!", hi: "pH 0 से 14 तक सार्वत्रिक, लिटमस, फिनॉल्फ़थेलीन और हल्दी से अम्ल व क्षार की जाँच करो!" },
  vars: [
    { id: "pH", label: { en: "Solution pH", hi: "विलयन का pH" }, unit: "", min: 0, max: 14, step: 1, value: 7 },
    { id: "indicator", label: { en: "Indicator (0 Univ · 1 Litmus · 2 Phenolphthalein · 3 Turmeric)", hi: "सूचक चुनें" }, unit: "", min: 0, max: 3, step: 1, value: 0 }
  ],
  facts(v) {
    const P = view(v);
    return [
      { id: "nat", en: "Chemical nature", hi: "रासायनिक प्रकृति", value: `${P.strength} (${P.nature} · ${P.natureHi})` },
      { id: "col", en: `${P.indName} indicator colour`, hi: `${P.indHi} का रंग`, value: `${P.colorName} · ${P.colorHi}` },
      { id: "ions", en: "Ion concentrations", hi: "आयन सांद्रता", value: `[H⁺] = 10^(${P.hExp}) M · [OH⁻] = 10^(${P.ohExp}) M` },
      { id: "ex", en: "Real-life match", hi: "दैनिक उदाहरण", value: P.pH <= 2 ? "Gastric HCl / Lemon" : P.pH < 7 ? "Vinegar / Curd / Rain" : P.pH === 7 ? "Pure Distilled Water" : P.pH <= 10 ? "Baking Soda / Milk of Magnesia" : "Soap / NaOH Drain Cleaner" }
    ];
  },
  snapshot,
  missions: [
    { id: "ph-acid", en: "Make a strong acid (pH ≤ 2) and watch H⁺ ions dominate!", hi: "प्रबल अम्ल (pH ≤ 2) बनाओ जहाँ H⁺ आयन अधिक हों!", check: v => v.pH <= 2 },
    { id: "ph-phenol", en: "Turn Phenolphthalein bright Pink in a basic solution (pH ≥ 9)", hi: "क्षारीय विलयन (pH ≥ 9) में फिनॉल्फ़थेलीन को गुलाबी करो", check: v => v.indicator === 2 && v.pH >= 9 },
    { id: "ph-turmeric", en: "Test Turmeric stain in soap/base (pH ≥ 8) → turns Reddish-brown!", hi: "हल्दी पर क्षार (pH ≥ 8) डालकर लाल-भूरा रंग देखो!", check: v => v.indicator === 3 && v.pH >= 8 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 2.8, 7.6], target: [0, 0.3, 0], bg: 0x0b1424, minDist: 4, maxDist: 16 });
    const { scene } = st;

    const glass = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.65, 3.2, 32, 1, true), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.22, side: THREE.DoubleSide }));
    glass.position.set(0, 0.4, 0); scene.add(glass);
    const liqMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, transparent: true, opacity: 0.72, roughness: 0.15 });
    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.58, 2.2, 32), liqMat);
    liquid.position.set(0, -0.05, 0); scene.add(liquid);

    const hIons = [], ohIons = [];
    for (let i = 0; i < 16; i++) {
      const h = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfca5a5 }));
      scene.add(h); hIons.push({ m: h, ang: i * 0.8, y: -0.9 + (i % 6) * 0.32, r: 0.4 + (i % 4) * 0.28 });
      const o = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), new THREE.MeshBasicMaterial({ color: 0x93c5fd }));
      scene.add(o); ohIons.push({ m: o, ang: i * 0.9 + 1, y: -0.9 + (i % 5) * 0.36, r: 0.45 + (i % 4) * 0.25 });
    }

    const znStrip = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.4, 0.14), new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.75, roughness: 0.25 }));
    znStrip.position.set(0.55, -0.45, 0); znStrip.rotation.z = -0.2; znStrip.visible = false; scene.add(znStrip);
    const h2Bubbles = [];
    for (let i = 0; i < 18; i++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.85 }));
      b.visible = false; scene.add(b);
      h2Bubbles.push({ m: b, x: 0.35 + (Math.random() - 0.5) * 0.45, y: -0.9 + Math.random() * 1.9, z: (Math.random() - 0.5) * 0.4 });
    }
    let zincIn = ctx.preset?.sub === "acidrx";

    const tag = labelSprite(THREE, "Neutral · Green", "उदासीन", { scale: 0.9, size: 26 });
    tag.position.set(0, 2.45, 0); scene.add(tag);
    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    const h1 = el("span"), h2 = el("span"); hud.append(h1, h2);

    let t = 0;
    const refresh = () => {
      const P = view(ctx.vars);
      liqMat.color.set(P.hex);
      const hCount = Math.max(1, Math.round(((14 - P.pH) / 14) * 16));
      const ohCount = Math.max(1, Math.round((P.pH / 14) * 16));
      hIons.forEach((x, i) => { x.m.visible = i < hCount; });
      ohIons.forEach((x, i) => { x.m.visible = i < ohCount; });
      const nt = labelSprite(THREE, `pH ${P.pH} · ${P.colorName}`, `${P.natureHi} · ${P.colorHi}`, { scale: 0.9, size: 26, color: "#f8fafc" });
      tag.material.map.dispose(); tag.material.map = nt.material.map; tag.scale.copy(nt.scale);
      h1.textContent = `pH = ${P.pH} · ${P.strength}`;
      h2.textContent = `${P.indName}: ${P.colorName}`;
    };

    const stopFrame = st.onFrame(dt => {
      t += dt;
      const spd = 0.7 + Math.abs(ctx.vars.pH - 7) * 0.14;
      hIons.forEach((p, i) => p.m.position.set(Math.cos(p.ang + t * spd) * p.r, p.y + Math.sin(t * 2 + i) * 0.08, Math.sin(p.ang + t * spd) * p.r));
      ohIons.forEach((p, i) => p.m.position.set(Math.cos(p.ang - t * spd) * p.r, p.y + Math.cos(t * 2 + i) * 0.08, Math.sin(p.ang - t * spd) * p.r));
      const fizzing = zincIn && ctx.vars.pH <= 4;
      znStrip.visible = zincIn;
      h2Bubbles.forEach((b, i) => {
        b.m.visible = fizzing;
        if (fizzing) {
          b.y += dt * (1.2 + (4 - ctx.vars.pH) * 0.45);
          if (b.y > 1.15) b.y = -0.95;
          b.m.position.set(b.x + Math.sin(t * 5 + i) * 0.05, b.y, b.z);
        }
      });
    });

    const side = ctx.side; side.replaceChildren();
    const seg = el("div", "cl-seg");
    const iBtns = PH_INDICATORS.map((ind, idx) => {
      const b = el("button", "cl-opt" + (ctx.vars.indicator === idx ? " on" : ""), ind.name.slice(0, 6));
      b.type = "button"; b.onclick = () => { ctx.set("indicator", idx); sfx.play("pop"); };
      seg.appendChild(b); return b;
    });
    side.appendChild(el("h3", "cl-h", "Indicator · सूचक")); side.appendChild(seg);
    const sl = sliders(ctx, side, { skip: ["indicator"] });

    const btns = el("div", "cl-btns"); side.appendChild(btns);
    actionButton(btns, "🫧 Neutralise to pH 7 · उदासीन करो", () => {
      ctx.set("pH", 7); sfx.play("fizz"); ctx.run();
    }, "cl-act");
    const btnZn = actionButton(btns, zincIn ? "⚗️ Remove Zinc Strip" : "⚗️ Drop Zinc (Zn + Acid → H₂↑)", () => {
      zincIn = !zincIn;
      if (zincIn && ctx.vars.pH > 4) ctx.set("pH", 2);
      btnZn.textContent = zincIn ? "⚗️ Remove Zinc Strip" : "⚗️ Drop Zinc (Zn + Acid → H₂↑)";
      sfx.play("fizz");
    }, "cl-chipb");
    actionButton(btns, "🥛 Carbonate + Acid (CO₂↑)", () => {
      if (ctx.vars.pH > 4) ctx.set("pH", 2);
      zincIn = true; h1.textContent = "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑"; h2.textContent = "CO₂ turns Limewater Ca(OH)₂ Milky!";
      sfx.play("fizz");
    }, "cl-chipb");

    const facts = factsView(ctx, side);
    note(side, "Every 1-step drop in pH means 10× MORE H⁺ ions! Neutralisation (Acid + Base → Salt + Water) brings pH toward 7.", "pH में 1 इकाई की कमी से H⁺ आयन 10 गुना बढ़ जाते हैं! उदासीनीकरण (अम्ल + क्षार → लवण + जल) से pH 7 की ओर आता है।");

    const off = bus.on("sim:change", e => {
      if (e.labId !== "ph") return;
      refresh(); facts.update(); sl.sync();
      iBtns.forEach((b, i) => b.classList.toggle("on", i === ctx.vars.indicator));
    });
    refresh(); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ pH: seen(q, "pH"), indicator: seen(q, "indicator") });
    {
      const x = { ...v(), indicator: 0 };
      const P = view(x);
      const ans = P.pH < 7 ? ["Acidic (more H⁺ ions than OH⁻)", "अम्लीय (H⁺ आयन अधिक)"] : P.pH > 7 ? ["Basic / Alkaline (more OH⁻ ions than H⁺)", "क्षारीय (OH⁻ आयन अधिक)"] : ["Neutral (equal H⁺ and OH⁻ ions)", "उदासीन (H⁺ व OH⁻ बराबर)"];
      const pool = [["Acidic (more H⁺ ions than OH⁻)", "अम्लीय (H⁺ आयन अधिक)"], ["Basic / Alkaline (more OH⁻ ions than H⁺)", "क्षारीय (OH⁻ आयन अधिक)"], ["Neutral (equal H⁺ and OH⁻ ions)", "उदासीन (H⁺ व OH⁻ बराबर)"], ["Radioactive plasma", "रेडियोधर्मी प्लाज़्मा"]];
      const d = withDistractors(ans, pool, 3, q.rnd);
      out.push(ask({
        id: "ph-nature", prompt: [`A solution reads pH = ${P.pH}. How is this solution classified?`, `किसी विलयन का pH = ${P.pH} है। यह विलयन कैसा है?`],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["At 25 °C, pH < 7 is acidic, pH = 7 is neutral, and pH > 7 is basic.", "pH < 7 अम्लीय, pH = 7 उदासीन तथा pH > 7 क्षारीय होता है।"]
      }));
    }
    {
      const x = { pH: 11, indicator: 2 };
      const c = ["Pink / Magenta", "गुलाबी"];
      const pool = [["Colourless", "रंगहीन"], ["Bright Yellow", "चमकीला पीला"], ["Deep Blue", "गहरा नीला"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "ph-phenol", prompt: ["A few drops of Phenolphthalein are added to a basic NaOH solution (pH 11). What colour appears?", "क्षारीय NaOH विलयन (pH 11) में फिनॉल्फ़थेलीन की बूँदें डालने पर कौन-सा रंग आता है?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Phenolphthalein stays colourless in acids/neutral solutions and turns pink in basic solutions (pH > 8.2).", "फिनॉल्फ़थेलीन अम्ल में रंगहीन और क्षारक में गुलाबी हो जाता है।"]
      }));
    }
    {
      const x = { pH: 10, indicator: 3 };
      const c = ["Reddish-brown (basic soap)", "लाल-भूरा (क्षारीय साबुन के कारण)"];
      const pool = [["Bright blue", "चमकीला नीला"], ["Turns colourless", "रंगहीन हो जाता है"], ["Turns jet black", "काला पड़ जाता है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "ph-turmeric", prompt: ["Why does a yellow turmeric curry stain on a white shirt turn reddish-brown when scrubbed with soap?", "सफ़ेद कपड़े पर हल्दी का पीला दाग साबुन लगाने पर लाल-भूरा क्यों हो जाता है?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Turmeric is a natural acid–base indicator that stays yellow in acids/neutral water and turns reddish-brown in bases like soap.", "हल्दी प्राकृतिक सूचक है जो क्षारीय साबुन के संपर्क में लाल-भूरा हो जाती है।"]
      }));
    }
    {
      const x = { pH: 2, indicator: 1 };
      const c = ["Blue litmus turns Red", "नीला लिटमस लाल हो जाता है"];
      const pool = [["Red litmus turns Blue", "लाल लिटमस नीला हो जाता है"], ["Both red and blue turn Green", "दोनों हरे हो जाते हैं"], ["Litmus dissolves into gas", "लिटमस गैस बन जाता है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "ph-litmus", prompt: ["A student dips litmus paper into lemon juice (pH 2). What colour change occurs?", "नींबू के रस (pH 2) में लिटमस पेपर डुबोने पर क्या बदलाव होता है?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Acids turn blue litmus paper red, while bases turn red litmus paper blue.", "अम्ल नीले लिटमस को लाल कर देते हैं, जबकि क्षारक लाल को नीला करते हैं।"]
      }));
    }
    {
      const x = { pH: 7, indicator: 0 };
      const c = ["Salt and Water (Neutralisation)", "लवण और जल (उदासीनीकरण)"];
      const pool = [["Pure Oxygen gas only", "केवल ऑक्सीजन गैस"], ["A stronger acid", "अधिक प्रबल अम्ल"], ["Liquid mercury", "द्रव पारा"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "ph-neutral", prompt: ["When hydrochloric acid (HCl) reacts completely with sodium hydroxide (NaOH), what are the products?", "HCl की NaOH से पूर्ण अभिक्रिया होने पर क्या उत्पाद बनते हैं?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Acid + Base → Salt + Water (HCl + NaOH → NaCl + H₂O), a neutralisation reaction.", "अम्ल + क्षारक → लवण + जल, इसे उदासीनीकरण अभिक्रिया कहते हैं।"]
      }));
    }
    {
      const x = { pH: 3, indicator: 0 };
      const c = ["100 times lower H⁺ concentration", "H⁺ सांद्रता 100 गुना कम हो जाती है"];
      const pool = [["2 times lower H⁺ concentration", "H⁺ सांद्रता 2 गुना कम"], ["100 times higher H⁺ concentration", "H⁺ सांद्रता 100 गुना अधिक"], ["Same H⁺ concentration", "वही सांद्रता रहती है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "ph-predict", kind: "predict", prompt: ["You dilute an acidic solution so its pH rises from 3 to 5. How does its H⁺ ion concentration change?", "अम्ल को तनु करने पर उसका pH 3 से बढ़कर 5 हो जाता है। H⁺ आयन सांद्रता कैसे बदलती है?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["The pH scale is logarithmic: each +1 pH reduces [H⁺] by 10×, so +2 pH reduces [H⁺] by 10² = 100×.", "pH पैमाना लघुगणकीय है: +2 pH बढ़ने का अर्थ है H⁺ आयन 10² = 100 गुना कम होना।"]
      }));
    }
    return out;
  }
};
