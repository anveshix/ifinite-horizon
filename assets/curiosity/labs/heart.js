/* Curiosity Lab · Human Heart & Double Circulation Lab (NCERT Class X, Ch 5 Life Processes).
   Explore the 4 chambers (RA, RV, LA, LV), oxygenated vs deoxygenated circuits, heart rate BPM, stroke volume SV,
   and listen to the lub-dub heartbeat sound! */
import { bus } from "../core.js";
import { heartModel } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const view = v => heartModel({ bpm: v.bpm, sv: v.sv, loop: v.loop });

function snapshot(canvas, vars, focus) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#130b14"), Hrt = view(vars);
  C2.text(g, focus === "blind" ? "Human Heart · Double Circulation" : `Heart Rate: ${Hrt.bpm} BPM · SV: ${Hrt.sv} mL · Cardiac Output: ${Hrt.CO} L/min`, 360, 22, { size: 15, color: "#fda4af" });

  C2.rect(g, 285, 48, 150, 44, { stroke: "#7dd3fc", fill: "rgba(56,189,248,0.16)", lw: 2, r: 10 });
  C2.text(g, "Lungs (O₂ uptake)", 360, 70, { size: 13, color: "#e0f2fe" });

  C2.rect(g, 275, 274, 170, 44, { stroke: "#cbd5e1", fill: "rgba(148,163,184,0.16)", lw: 2, r: 10 });
  C2.text(g, "Body Organs (O₂ used)", 360, 296, { size: 13, color: "#f1f5f9" });

  C2.rect(g, 260, 122, 95, 58, { stroke: "#60a5fa", fill: "rgba(59,130,246,0.38)", lw: 2, r: 8 });
  C2.text(g, "RA", 307, 151, { size: 14, color: "#dbeafe" });
  C2.rect(g, 260, 184, 95, 62, { stroke: "#60a5fa", fill: "rgba(37,99,235,0.48)", lw: 2, r: 8 });
  C2.text(g, "RV", 307, 215, { size: 14, color: "#dbeafe" });

  C2.rect(g, 365, 122, 95, 58, { stroke: "#f87171", fill: "rgba(239,68,68,0.38)", lw: 2, r: 8 });
  C2.text(g, "LA", 412, 151, { size: 14, color: "#fee2e2" });
  C2.rect(g, 365, 184, 95, 62, { stroke: "#f87171", fill: "rgba(220,38,38,0.52)", lw: 2, r: 8 });
  C2.text(g, "LV (Thick)", 412, 215, { size: 13, color: "#fee2e2" });

  C2.arrow(g, 260, 215, 285, 70, "#60a5fa", 3);
  C2.arrow(g, 435, 70, 460, 145, "#f87171", 3);
  C2.arrow(g, 460, 215, 445, 296, "#f87171", 3);
  C2.arrow(g, 275, 296, 260, 145, "#60a5fa", 3);

  C2.text(g, "Pulmonary Artery (Deoxy)", 145, 130, { size: 11, color: "#93c5fd" });
  C2.text(g, "Pulmonary Vein (O₂)", 575, 110, { size: 11, color: "#fca5a5" });
  C2.text(g, "Vena Cava → RA", 145, 250, { size: 11, color: "#93c5fd" });
  C2.text(g, "LV → Aorta → Body", 575, 250, { size: 11, color: "#fca5a5" });
  return canvas;
}

export default {
  id: "heart", cls: 10, unit: "x/ch5", icon: "🫀",
  title: { en: "Heart & Circulation Lab — Double Circulation", hi: "हृदय व परिसंचरण प्रयोगशाला — दोहरा परिसंचरण" },
  blurb: { en: "Explore the 4-chambered human heart in 3D, watch O₂-rich & CO₂-rich blood packets race through both circuits, and hear lub-dub!", hi: "4-कक्षीय मानव हृदय, फुफ्फुसीय व दैहिक परिपथ में रक्त प्रवाह और 'लब-डब' ध्वनि को 3D में अनुभव करो!" },
  vars: [
    { id: "bpm", label: { en: "Heart rate (BPM)", hi: "हृदय दर (BPM)" }, unit: " bpm", min: 50, max: 160, step: 5, value: 70 },
    { id: "sv", label: { en: "Stroke volume (mL/beat)", hi: "स्ट्रोक आयतन (mL)" }, unit: " mL", min: 50, max: 100, step: 5, value: 70 },
    { id: "loop", label: { en: "Circuit focus (0=Both, 1=Pulmonary, 2=Systemic)", hi: "परिपथ (0=दोनों, 1=फुफ्फुस, 2=दैहिक)" }, unit: "", min: 0, max: 2, step: 1, value: 0 },
    { id: "sound", label: { en: "Lub-Dub Audio (0=Off, 1=On)", hi: "लब-डब ध्वनि (0=बंद, 1=चालू)" }, unit: "", min: 0, max: 1, step: 1, value: 0 }
  ],
  facts(v) {
    const H = view(v);
    return [
      { id: "bpm", en: "Heart rate & beat period", hi: "हृदय दर व आवर्तकाल", value: `${H.bpm} bpm (${H.period} s per beat)` },
      { id: "out", en: "Cardiac output (SV × BPM)", hi: "हृदय निकासी", value: `${H.CO} L/min (Stroke Vol ${H.sv} mL)` },
      { id: "circ", en: "Active circuit", hi: "सक्रिय परिपथ", value: H.loopName },
      { id: "wall", en: "Thickest chamber wall", hi: "सबसे मोटी भित्ति", value: "Left Ventricle (pumps to entire body via Aorta)" }
    ];
  },
  snapshot,
  missions: [
    { id: "hrt-rest", en: "Set normal resting heart rate near 70 BPM (65–75)", hi: "सामान्य विश्राम हृदय दर 65–75 BPM पर सेट करो", check: v => v.bpm >= 65 && v.bpm <= 75 },
    { id: "hrt-sprint", en: "Sprint! Raise heart rate above 130 BPM and watch blood speed up!", hi: "तेज़ दौड़ो — हृदय दर 130 BPM से ऊपर ले जाओ!", check: v => v.bpm >= 130 },
    { id: "hrt-audio", en: "Switch Lub-Dub Audio ON to listen to systolic & diastolic beats!", hi: "हृदय की 'लब-डब' ध्वनि सुनने के लिए ऑडियो चालू करो!", check: v => v.sound === 1 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 1.4, 8.6], target: [0, 0, 0], bg: 0x130b14, minDist: 4, maxDist: 16 });
    const { scene } = st;
    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    const h1 = el("span"), h2 = el("span"); hud.append(h1, h2);

    const heartGrp = new THREE.Group(); scene.add(heartGrp);
    const chMat = (hex) => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.35 });
    const ra = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.9, 0.85), chMat(0x2563eb)); ra.position.set(-0.62, 0.55, 0); heartGrp.add(ra);
    const rv = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.15, 0.85), chMat(0x1d4ed8)); rv.position.set(-0.62, -0.58, 0); heartGrp.add(rv);
    const la = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.9, 0.85), chMat(0xdc2626)); la.position.set(0.62, 0.55, 0); heartGrp.add(la);
    const lv = new THREE.Mesh(new THREE.BoxGeometry(1.18, 1.25, 0.95), chMat(0xb91c1c)); lv.position.set(0.68, -0.62, 0); heartGrp.add(lv);
    const septum = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.35, 0.92), new THREE.MeshStandardMaterial({ color: 0xfda4af }));
    heartGrp.add(septum);

    const lungs = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.7, 0.9), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 }));
    lungs.position.set(0, 2.55, 0); scene.add(lungs);
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.7, 0.9), new THREE.MeshStandardMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.4 }));
    body.position.set(0, -2.55, 0); scene.add(body);

    const l1 = labelSprite(THREE, "Lungs (O₂)", null, { scale: 0.72, size: 22, color: "#bae6fd" }); l1.position.set(0, 3.15, 0); scene.add(l1);
    const l2 = labelSprite(THREE, "Body Tissues", null, { scale: 0.72, size: 22, color: "#e2e8f0" }); l2.position.set(0, -3.15, 0); scene.add(l2);
    const lRA = labelSprite(THREE, "RA / RV", "Deoxy", { scale: 0.6, size: 20, color: "#93c5fd" }); lRA.position.set(-1.75, 0, 0); scene.add(lRA);
    const lLA = labelSprite(THREE, "LA / LV", "O₂-Rich", { scale: 0.6, size: 20, color: "#fca5a5" }); lLA.position.set(1.85, 0, 0); scene.add(lLA);

    const packets = [];
    for (let i = 0; i < 16; i++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      scene.add(m);
      packets.push({ m, p: i / 16 });
    }
    const loopPos = (u) => {
      const s = ((u % 1) + 1) % 1;
      if (s < 0.25) {
        const k = s / 0.25; return { x: -0.7 - Math.sin(k * Math.PI) * 1.3, y: -0.6 + k * 3.15, oxy: false, part: 1 };
      } else if (s < 0.5) {
        const k = (s - 0.25) / 0.25; return { x: 0.7 + Math.sin(k * Math.PI) * 1.3, y: 2.55 - k * 3.15, oxy: true, part: 1 };
      } else if (s < 0.75) {
        const k = (s - 0.5) / 0.25; return { x: 0.7 + Math.sin(k * Math.PI) * 1.4, y: -0.6 - k * 1.95, oxy: true, part: 2 };
      } else {
        const k = (s - 0.75) / 0.25; return { x: -0.7 - Math.sin(k * Math.PI) * 1.4, y: -2.55 + k * 1.95, oxy: false, part: 2 };
      }
    };

    const lifeGrp = new THREE.Group(); scene.add(lifeGrp);
    let lifeMode = ctx.preset?.sub === "alveoli" ? 1 : ctx.preset?.sub === "nephron" ? 2 : ctx.preset?.sub === "dialysis" ? 3 : 0; // 0=Heart, 1=Alveoli, 2=Nephron, 3=Hemodialysis
    const rebuildLife = () => {
      while (lifeGrp.children.length) lifeGrp.remove(lifeGrp.children.pop());
      heartGrp.visible = lifeMode === 0;
      lungs.visible = lifeMode === 0; body.visible = lifeMode === 0;
      l1.visible = lifeMode === 0; l2.visible = lifeMode === 0;
      lRA.visible = lifeMode === 0; lLA.visible = lifeMode === 0;
      packets.forEach(p => { p.m.visible = lifeMode === 0; });
      if (lifeMode === 1) {
        /* 3D Alveoli Air Sacs + Capillary Gas Exchange (O₂ in, CO₂ out) */
        [[-0.8, 0.5], [0.8, 0.5], [0, -0.4], [-0.9, -0.7], [0.9, -0.7]].forEach(([x, y]) => {
          const sac = new THREE.Mesh(new THREE.SphereGeometry(0.72, 20, 14), new THREE.MeshStandardMaterial({ color: 0xf9a8d4, transparent: true, opacity: 0.75 }));
          sac.position.set(x, y, 0); lifeGrp.add(sac);
        });
        const cap = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.16, 12, 36), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
        lifeGrp.add(cap);
        const lb = labelSprite(THREE, "Alveoli Gas Exchange (x/ch5)", "O₂ diffuses in · CO₂ diffuses out", { scale: 0.85, size: 22, color: "#bae6fd" });
        lb.position.set(0, 2.35, 0); lifeGrp.add(lb);
        h1.textContent = "Respiration: Alveoli & Haemoglobin";
        h2.textContent = "O₂ → RBCs · CO₂ → Exhaled";
      } else if (lifeMode === 2) {
        /* 3D Kidney Nephron: Bowman's Capsule + Glomerulus + Tubule + Collecting Duct */
        const bowman = new THREE.Mesh(new THREE.SphereGeometry(0.92, 22, 16, 0, Math.PI * 1.4), new THREE.MeshStandardMaterial({ color: 0xfacc15, transparent: true, opacity: 0.65, side: THREE.DoubleSide }));
        bowman.position.set(-1.6, 0.7, 0); lifeGrp.add(bowman);
        const glom = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 12), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
        glom.position.set(-1.6, 0.7, 0); lifeGrp.add(glom);
        const tubule = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 3.6, 12), new THREE.MeshStandardMaterial({ color: 0xfb923c }));
        tubule.rotation.z = Math.PI / 2; tubule.position.set(0.4, 0.2, 0); lifeGrp.add(tubule);
        const duct = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 2.8, 12), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
        duct.position.set(2.3, -0.2, 0); lifeGrp.add(duct);
        const lb = labelSprite(THREE, "Kidney Nephron (Excretion)", "Ultrafiltration → Selective Reabsorption → Urine", { scale: 0.85, size: 22, color: "#fef08a" });
        lb.position.set(0, 2.35, 0); lifeGrp.add(lb);
        h1.textContent = "Excretion: 1 Million Nephrons/Kidney";
        h2.textContent = "Filters Urea · Reabsorbs Glucose & H₂O";
      } else if (lifeMode === 3) {
        /* Artificial Kidney / Hemodialysis Unit */
        const tank = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.4, 1.6), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.25 }));
        lifeGrp.add(tank);
        for (let i = -1; i <= 1; i++) {
          const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 3.4, 12), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
          tube.rotation.z = Math.PI / 2; tube.position.set(0, i * 0.55, 0); lifeGrp.add(tube);
        }
        const lb = labelSprite(THREE, "Artificial Kidney (Hemodialysis)", "Semi-permeable tubes diffuse Urea out; RBCs stay!", { scale: 0.85, size: 22, color: "#bae6fd" });
        lb.position.set(0, 2.25, 0); lifeGrp.add(lb);
        h1.textContent = "Hemodialysis · कृत्रिम वृक्क";
        h2.textContent = "Clears Urea without reabsorption";
      }
    };

    let beatPhase = 0, lastBeat = -1;
    const sync = () => {
      if (lifeMode !== 0) return;
      const H = view(ctx.vars);
      h1.textContent = `Heart Rate: ${H.bpm} BPM · ${H.loopName}`;
      h2.textContent = `Output: ${H.CO} L/min`;
    };

    const stopFrame = st.onFrame(dt => {
      if (lifeMode !== 0) { lifeGrp.rotation.y += dt * 0.35; return; }
      const H = view(ctx.vars);
      const bps = H.bpm / 60;
      beatPhase += dt * bps;
      const frac = beatPhase % 1;
      const pulse = 1 + 0.1 * Math.exp(-Math.pow((frac - 0.12) * 9, 2)) + 0.06 * Math.exp(-Math.pow((frac - 0.34) * 9, 2));
      heartGrp.scale.set(pulse, pulse, pulse);
      const curBeat = Math.floor(beatPhase);
      if (curBeat !== lastBeat) {
        lastBeat = curBeat;
        if (ctx.vars.sound === 1) sfx.playHeartbeat(H.bpm);
      }
      packets.forEach(pk => {
        pk.p = (pk.p + dt * bps * 0.28) % 1;
        const pos = loopPos(pk.p);
        pk.m.position.set(pos.x, pos.y, 0.55);
        pk.m.visible = H.loop === 0 || H.loop === pos.part;
        pk.m.material.color.setHex(pos.oxy ? 0xef4444 : 0x3b82f6);
      });
    });

    const side = ctx.side; side.replaceChildren();
    const sl = sliders(ctx, side);
    const presets = el("div", "cl-presets"); presets.appendChild(el("span", "cl-lab", "Activity · स्थिति"));
    [["Sleep (55)", 55], ["Rest (70)", 70], ["Brisk Walk (105)", 105], ["Sprint (150)", 150]].forEach(([lbl, b]) => {
      actionButton(presets, lbl, () => { lifeMode = 0; rebuildLife(); ctx.set("bpm", b); sfx.play("pop"); sl.sync(); sync(); }, "cl-chipb");
    });
    [["🫁 Alveoli", 1], ["💧 Nephron", 2], ["🩺 Dialysis", 3]].forEach(([lbl, lm]) => {
      actionButton(presets, lbl, () => { lifeMode = lifeMode === lm ? 0 : lm; sfx.play("pop"); rebuildLife(); if (lifeMode === 0) sync(); }, "cl-chipb");
    });
    side.insertBefore(presets, sl.root.nextSibling);

    const facts = factsView(ctx, side);
    note(side, "In Double Circulation, blood passes through the heart TWICE per full cycle: Right side pumps CO₂-rich blood to Lungs; Left Ventricle (thickest wall) pumps O₂-rich blood to the whole body!", "दोहरे परिसंचरण में रक्त हृदय से दो बार गुजरता है: दायाँ भाग फेफड़ों को और बायाँ निलय (सबसे मोटी भित्ति) पूरे शरीर को रक्त भेजता है।");

    const off = bus.on("sim:change", e => {
      if (e.labId !== "heart") return;
      sync(); facts.update(); sl.sync();
    });
    sync(); if (lifeMode !== 0) rebuildLife(); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ bpm: seen(q, "bpm"), sv: seen(q, "sv"), loop: seen(q, "loop") });
    {
      const x = { bpm: 70, sv: 70, loop: 0 };
      const c = ["Left Ventricle (pumps to the entire body via Aorta)", "बायाँ निलय (महाधमनी द्वारा पूरे शरीर में रक्त पंप करता है)"];
      const pool = [["Right Atrium (receives from Vena Cava)", "दायाँ अलिंद"], ["Left Atrium (receives from Lungs)", "बायाँ अलिंद"], ["Right Ventricle (pumps only to Lungs)", "दायाँ निलय"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "hrt-lv", prompt: ["Which chamber of the human heart has the thickest muscular wall and why?", "मानव हृदय के किस कक्ष की पेशीय भित्ति सबसे मोटी होती है और क्यों?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["The Left Ventricle generates the high pressure needed to pump oxygenated blood across the entire body.", "बाएँ निलय को पूरे शरीर में उच्च दाब से रक्त पहुँचाना होता है, इसलिए इसकी भित्ति सबसे मोटी होती है।"]
      }));
    }
    {
      const x = { bpm: 70, sv: 70, loop: 1 };
      const c = ["Pulmonary Artery (RV → Lungs)", "फुफ्फुस धमनी (दायाँ निलय → फेफड़े)"];
      const pool = [["Aorta (LV → Body)", "महाधमनी"], ["Pulmonary Vein (Lungs → LA)", "फुफ्फुस शिरा"], ["Renal Artery (→ Kidneys)", "वृक्क धमनी"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "hrt-pulm", prompt: ["Which artery is the exception that carries DEOXYGENATED blood from the Right Ventricle to the lungs?", "कौन-सी अपवाद धमनी दाएँ निलय से ऑक्सीजन-रहित रक्त फेफड़ों तक ले जाती है?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Arteries carry blood AWAY from the heart; Pulmonary Artery carries deoxygenated blood to the lungs for oxygenation.", "फुफ्फुस धमनी हृदय से ऑक्सीजन-रहित रक्त फेफड़ों की ओर ले जाती है।"]
      }));
    }
    {
      const x = { bpm: 70, sv: 70, loop: 1 };
      const c = ["Pulmonary Vein (from Lungs to Left Atrium)", "फुफ्फुस शिरा (फेफड़ों से बाएँ अलिंद में)"];
      const pool = [["Superior Vena Cava", "ऊर्ध्व महाशिरा"], ["Pulmonary Artery", "फुफ्फुस धमनी"], ["Hepatic Vein", "यकृत शिरा"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "hrt-pvein", prompt: ["Which vein brings OXYGENATED blood from the lungs into the Left Atrium?", "कौन-सी शिरा फेफड़ों से ऑक्सीजन-युक्त रक्त बाएँ अलिंद में लाती है?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Veins return blood TO the heart; the Pulmonary Vein returns freshly oxygenated blood from lungs to Left Atrium.", "फुफ्फुस शिरा फेफड़ों से शुद्ध (O₂-युक्त) रक्त बाएँ अलिंद में लाती है।"]
      }));
    }
    {
      const x = { bpm: 70, sv: 70, loop: 0 };
      const c = ["Prevents mixing of oxygenated and deoxygenated blood (high O₂ efficiency)", "ऑक्सीजन-युक्त व ऑक्सीजन-रहित रक्त को मिलने से रोकता है"];
      const pool = [["Allows blood to mix freely for cooling", "रक्त को मिलाने में मदद करता है"], ["Stops blood from entering the lungs", "फेफड़ों में रक्त जाने से रोकता है"], ["Stores excess bile salts", "पित्त लवण का संचय करता है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "hrt-septum", prompt: ["Why is separating the right and left sides of the heart by a septum essential for warm-blooded mammals like humans?", "मनुष्यों में हृदय के दाएँ व बाएँ भाग को पट (septum) से अलग रखना क्यों आवश्यक है?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Keeping O₂-rich and CO₂-rich blood separate ensures maximum oxygen delivery for high energy needs and constant body temperature.", "दोनों रक्त धाराओं के अलग रहने से कोशिकाओं को अधिकतम O₂ व स्थिर शरीर तापमान हेतु ऊर्जा मिलती है।"]
      }));
    }
    {
      const x = v(), H = view(x), M = l => [`${l} L/min`, `${l} L/min`];
      const c = M(H.CO);
      const d = withDistractors(c, [M(+(H.CO * 0.5).toFixed(2)), M(+(H.CO * 1.5).toFixed(2)), M("1.2")], 3, q.rnd);
      out.push(ask({
        id: "hrt-output", prompt: [`At ${H.bpm} BPM with a stroke volume of ${H.sv} mL per beat, what is the Cardiac Output per minute?`, `${H.bpm} BPM और ${H.sv} mL प्रति धड़कन आयतन पर प्रति मिनट हृदय निकासी कितनी होगी?`],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: [`Cardiac output = (${H.bpm} × ${H.sv}) / 1000 = ${H.CO} L/min.`, `हृदय निकासी = (${H.bpm} × ${H.sv}) / 1000 = ${H.CO} L/min।`]
      }));
    }
    {
      const x = { bpm: 70, sv: 70, loop: 0 };
      const c = ["Prevent backward flow of blood between chambers and vessels", "कक्षों व वाहिकाओं में रक्त को उल्टा बहने से रोकना"];
      const pool = [["Generate red blood cells inside ventricles", "निलय में लाल रक्त कणिकाएँ बनाना"], ["Absorb oxygen directly from skin", "त्वचा से सीधे ऑक्सीजन लेना"], ["Digest lipids inside the atrium", "अलिंद में वसा का पाचन करना"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "hrt-predict", kind: "predict", prompt: ["What is the critical function of heart valves (such as bicuspid and tricuspid valves) during ventricular contraction?", "निलय के संकुचन के समय हृदय कपाटों (valves) का मुख्य कार्य क्या है?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Valves snap shut to ensure unidirectional flow so blood moves forward into arteries and never backflows into atria.", "कपाट रक्त के विपरीत प्रवाह को रोककर एकदिशीय परिसंचरण सुनिश्चित करते हैं।"]
      }));
    }
    return out;
  }
};
