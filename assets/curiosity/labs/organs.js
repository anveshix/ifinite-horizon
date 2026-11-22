/* Curiosity Lab · Organs & Joints 3D Lab (NCERT Class X Ch 5 Life Processes & Class IX Ch 2 Joints).
   Exploded 3D inspection of Digestive Tract, Alveoli Gas Exchange, Nephron Ultrafiltration/Dialysis,
   and Synovial Joints (Ball-and-Socket vs Hinge)! */
import { bus } from "../core.js";
import { ORGAN_MODES, organModel } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const view = v => organModel({ mode: v.mode, explode: v.explode, rate: v.rate });

function snapshot(canvas, vars, focus) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#120f1c"), O = view(vars);
  C2.text(g, focus === "blind" ? "Human Organ System Explorer" : `${O.name} (${O.hi})`, 360, 22, { size: 15, color: "#f9a8d4" });
  if (O.mode === 0) {
    ["Mouth (Salivary Amylase)", "Stomach (HCl + Pepsin)", "Small Intestine (Villi absorb)"].forEach((s, i) => {
      C2.rect(g, 195, 58 + i * 74, 330, 52, { stroke: "#fb923c", fill: "rgba(251,146,60,0.18)", lw: 2, r: 10 });
      C2.text(g, s, 360, 84 + i * 74, { size: 13, color: "#fed7aa" });
    });
  } else if (O.mode === 1) {
    C2.circle(g, 260, 175, 76, { stroke: "#7dd3fc", fill: "rgba(56,189,248,0.18)", w: 3 });
    C2.text(g, "Alveolus (O₂ high)", 260, 175, { size: 13, color: "#bae6fd" });
    C2.rect(g, 410, 130, 190, 90, { stroke: "#f87171", fill: "rgba(239,68,68,0.22)", lw: 2, r: 12 });
    C2.text(g, `Blood Capillary (${O.o2SatPct}% O₂)`, 505, 175, { size: 13, color: "#fecaca" });
    C2.arrow(g, 336, 155, 410, 155, "#4ade80", 3, 9); C2.text(g, "O₂ →", 373, 140, { size: 12, color: "#86efac" });
    C2.arrow(g, 410, 195, 336, 195, "#60a5fa", 3, 9); C2.text(g, "← CO₂", 373, 212, { size: 12, color: "#93c5fd" });
  } else if (O.mode === 2) {
    C2.circle(g, 200, 170, 58, { stroke: "#facc15", fill: "rgba(250,204,21,0.2)", w: 3 });
    C2.text(g, "Bowman's Capsule", 200, 170, { size: 12, color: "#fef08a" });
    C2.arrow(g, 260, 170, 365, 170, "#4ade80", 3, 10);
    C2.rect(g, 365, 135, 220, 70, { stroke: "#38bdf8", fill: "rgba(56,189,248,0.18)", lw: 2, r: 10 });
    C2.text(g, `Tubule (${O.filtrationMlMin} mL/min)`, 475, 170, { size: 13, color: "#bae6fd" });
  } else {
    C2.circle(g, 260, 170, 48, { stroke: "#cbd5e1", fill: "rgba(148,163,184,0.25)", w: 3 });
    C2.text(g, "Ball & Socket (360°)", 260, 240, { size: 13, color: "#e2e8f0" });
    C2.rect(g, 430, 130, 120, 80, { stroke: "#ffd23f", fill: "rgba(250,204,21,0.2)", lw: 2, r: 10 });
    C2.text(g, "Hinge Joint (180°)", 490, 240, { size: 13, color: "#fef08a" });
  }
  C2.text(g, O.keyFact, 360, 308, { size: 12, color: "#cbd5e1" });
  return canvas;
}

export default {
  id: "organs", cls: 10, unit: "x/ch5", icon: "🫁",
  title: { en: "Organs & Joints 3D Lab — Digestion, Lungs & Nephron", hi: "अंग व संधि 3D प्रयोगशाला — पाचन, फेफड़े व नेफ्रॉन" },
  blurb: { en: "Explode 3D organ layers to inspect Digestion, Alveoli O₂/CO₂ exchange, Nephron ultrafiltration & Dialysis, and Synovial Joints!", hi: "3D में पाचन तंत्र, कूपिका गैस विनिमय, नेफ्रॉन व डायलिसिस तथा श्लेषक संधियाँ (जोड़) परतों में खोलकर देखो!" },
  vars: [
    { id: "mode", label: { en: "Organ / joint system", hi: "अंग / संधि प्रणाली" }, unit: "", min: 0, max: 3, step: 1, value: 1 },
    { id: "explode", label: { en: "Exploded 3D layer separation", hi: "3D परत विस्तार" }, unit: "%", min: 0, max: 100, step: 10, value: 20 },
    { id: "rate", label: { en: "Physiological flow / activity", hi: "प्रवाह / सक्रियता दर" }, unit: "×", min: 1, max: 5, step: 1, value: 2 }
  ],
  facts(v) {
    const O = view(v);
    return [
      { id: "sys", en: "Active system", hi: "सक्रिय प्रणाली", value: `${O.name} (${O.hi})` },
      { id: "key", en: "Core biological mechanism", hi: "मुख्य जैविक क्रिया", value: O.keyFact },
      { id: "alv", en: "Alveolar O₂ saturation", hi: "रक्त O₂ संतृप्ति", value: `${O.o2SatPct}%` },
      { id: "nep", en: "Nephron filtration rate", hi: "नेफ्रॉन निस्पंदन दर", value: `${O.filtrationMlMin} mL/min` }
    ];
  },
  snapshot,
  missions: [
    { id: "org-alv", en: "Switch to Alveoli Gas Exchange and push activity to 4× for 98%+ O₂!", hi: "कूपिका गैस विनिमय चुनकर सक्रियता 4× से 98%+ O₂ संतृप्ति देखो!", check: v => v.mode === 1 && v.rate >= 4 },
    { id: "org-nep", en: "Inspect Nephron & Dialysis ultrafiltration!", hi: "नेफ्रॉन व डायलिसिस निस्पंदन प्रणाली देखो!", check: v => v.mode === 2 },
    { id: "org-exp", en: "Separate 3D organ layers (Exploded view ≥ 70%)!", hi: "3D परतों को अलग कर (≥ 70%) अंदरूनी संरचना देखो!", check: v => v.explode >= 70 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 1.8, 8.2], target: [0, 0, 0], bg: 0x120f1c, minDist: 4, maxDist: 16 });
    const { scene } = st, dyn = new THREE.Group(); scene.add(dyn);
    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    const h1 = el("span"), h2 = el("span"); hud.append(h1, h2);

    let movers = [], t = 0;
    const rebuild = () => {
      while (dyn.children.length) {
        const c = dyn.children.pop();
        c.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); }); });
      }
      movers = [];
      const O = view(ctx.vars), sep = (O.explode / 100) * 1.4;
      if (O.mode === 0) {
        /* Digestive tract: esophagus -> J-stomach -> coiled intestine */
        const eso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 1.8, 16), new THREE.MeshStandardMaterial({ color: 0xfb7185 }));
        eso.position.set(-0.4, 1.4 + sep * 0.5, 0);
        const stom = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 18), new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 }));
        stom.scale.set(1.25, 0.85, 0.85); stom.position.set(0.3 + sep * 0.5, 0.2, 0);
        const int = new THREE.Mesh(new THREE.TorusKnotGeometry(0.75, 0.18, 60, 12, 2, 3), new THREE.MeshStandardMaterial({ color: 0xfdba74, roughness: 0.5 }));
        int.position.set(0, -1.3 - sep * 0.5, 0);
        dyn.add(eso, stom, int);
        for (let i = 0; i < 6; i++) {
          const bolus = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
          dyn.add(bolus); movers.push({ m: bolus, ph: i / 6, kind: "digest" });
        }
      } else if (O.mode === 1) {
        /* Alveolus sac + capillary wrap + O2/CO2 exchange */
        const alv = new THREE.Mesh(new THREE.SphereGeometry(1.35, 28, 20), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35, roughness: 0.2 }));
        alv.position.set(-0.8 - sep * 0.6, 0, 0);
        const cap = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.26, 16, 48), new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35 }));
        cap.position.set(0.9 + sep * 0.6, 0, 0);
        dyn.add(alv, cap);
        for (let i = 0; i < 12; i++) {
          const oxy = i % 2 === 0;
          const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), new THREE.MeshStandardMaterial({ color: oxy ? 0x4ade80 : 0x60a5fa }));
          dyn.add(m); movers.push({ m, ph: i / 12, kind: oxy ? "o2" : "co2" });
        }
      } else if (O.mode === 2) {
        /* Nephron: Bowman's capsule + Glomerulus + Tubule loop */
        const cup = new THREE.Mesh(new THREE.SphereGeometry(1.0, 24, 18, 0, Math.PI * 1.4), new THREE.MeshStandardMaterial({ color: 0xfacc15, side: THREE.DoubleSide, transparent: true, opacity: 0.55 }));
        cup.position.set(-1.3 - sep * 0.5, 0.5, 0);
        const glom = new THREE.Mesh(new THREE.TorusKnotGeometry(0.48, 0.12, 48, 10), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
        glom.position.set(-1.3 - sep * 0.5, 0.5, 0);
        const tub = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-0.4, 0.5, 0), new THREE.Vector3(0.4, 0.9, 0), new THREE.Vector3(0.7, -1.2, 0), new THREE.Vector3(1.4, 0.7, 0), new THREE.Vector3(2.1, -1.1, 0)]), 40, 0.16, 10, false), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
        tub.position.x += sep * 0.5;
        dyn.add(cup, glom, tub);
        for (let i = 0; i < 8; i++) {
          const m = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), new THREE.MeshStandardMaterial({ color: 0xfde047 }));
          dyn.add(m); movers.push({ m, ph: i / 8, kind: "nep" });
        }
      } else {
        /* Synovial joint: Socket + rotating Ball bone */
        const socket = new THREE.Mesh(new THREE.SphereGeometry(1.05, 24, 18, 0, Math.PI), new THREE.MeshStandardMaterial({ color: 0xcbd5e1, side: THREE.DoubleSide }));
        socket.rotation.x = Math.PI / 2; socket.position.set(-0.5 - sep * 0.5, 0, 0);
        const cart = new THREE.Mesh(new THREE.SphereGeometry(0.72, 20, 16), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 }));
        cart.position.set(-0.4, 0, 0);
        const limb = new THREE.Group(); limb.position.set(0.1 + sep * 0.5, 0, 0);
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.62, 20, 16), new THREE.MeshStandardMaterial({ color: 0xf1f5f9 }));
        const bone = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 2.4, 16), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
        bone.rotation.z = -Math.PI / 2; bone.position.x = 1.2;
        limb.add(ball, bone); dyn.add(socket, cart, limb);
        movers.push({ m: limb, kind: "joint" });
      }
      const tag = labelSprite(THREE, O.name, O.hi, { scale: 0.82, size: 24, color: "#f9a8d4" });
      tag.position.set(0, 2.35, 0); dyn.add(tag);
      h1.textContent = `${O.name} · Explode ${O.explode}%`;
      h2.textContent = O.keyFact;
    };

    const stopFrame = st.onFrame(dt => {
      const O = view(ctx.vars);
      t += dt * O.rate;
      movers.forEach(mv => {
        if (mv.kind === "digest") {
          const u = (mv.ph + t * 0.12) % 1;
          mv.m.position.set(-0.4 + Math.sin(u * 6) * 0.35, 2.1 - u * 4.0, 0.3);
        } else if (mv.kind === "o2") {
          const u = (mv.ph + t * 0.25) % 1;
          mv.m.position.set(-0.8 + u * 2.0, Math.sin(u * 6) * 0.35, 0.4);
        } else if (mv.kind === "co2") {
          const u = (mv.ph + t * 0.25) % 1;
          mv.m.position.set(1.2 - u * 2.0, -0.3 + Math.cos(u * 6) * 0.3, -0.3);
        } else if (mv.kind === "nep") {
          const u = (mv.ph + t * 0.22) % 1;
          mv.m.position.set(-1.0 + u * 3.0, Math.sin(u * Math.PI * 2) * 0.85, 0.35);
        } else if (mv.kind === "joint") {
          mv.m.rotation.z = Math.sin(t * 0.9) * 0.55;
          mv.m.rotation.y = Math.cos(t * 0.6) * 0.45;
        }
      });
    });

    const side = ctx.side; side.replaceChildren();
    const sl = sliders(ctx, side);
    const presets = el("div", "cl-presets"); presets.appendChild(el("span", "cl-lab", "System · प्रणाली"));
    ORGAN_MODES.forEach((m, i) => {
      actionButton(presets, m.name.split(" ")[0], () => { ctx.set("mode", i); sfx.play("pop"); sl.sync(); rebuild(); }, "cl-chipb");
    });
    side.insertBefore(presets, sl.root.nextSibling);
    const facts = factsView(ctx, side);
    note(side, "Small intestine villi & lung alveoli both maximise surface area for rapid diffusion! Nephrons filter urea while reabsorbing useful glucose, amino acids & water.", "छोटी आंत के रसांकुर (villi) और फेफड़ों की कूपिकाएँ अवशोषण व विसरण हेतु सतही क्षेत्र बढ़ाती हैं। नेफ्रॉन यूरिया छानते हैं।");

    const off = bus.on("sim:change", e => { if (e.labId !== "organs") return; rebuild(); facts.update(); sl.sync(); });
    rebuild(); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ mode: seen(q, "mode"), explode: 20, rate: seen(q, "rate") });
    {
      const x = { mode: 0, explode: 20, rate: 2 };
      const c = ["Small Intestine (with finger-like villi)", "छोटी आंत (उंगली जैसे रसांकुर/Villi द्वारा)"];
      const pool = [["Stomach (HCl chamber)", "आमाशय"], ["Oesophagus (food pipe)", "ग्रासनली"], ["Large Intestine (colon)", "बड़ी आंत"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "org-villi", prompt: ["Where does complete digestion of carbohydrates, proteins & fats and nutrient absorption via villi take place?", "भोजन का पूर्ण पाचन और रसांकुर (villi) द्वारा अवशोषण कहाँ होता है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["The small intestine receives bile and pancreatic enzymes and has millions of villi to absorb digested nutrients.", "छोटी आंत में पूर्ण पाचन के बाद रसांकुर पोषक तत्वों का अवशोषण करते हैं।"] }));
    }
    {
      const x = { mode: 1, explode: 20, rate: 3 };
      const c = ["Alveoli — thin walls & huge ~80 m² surface area with rich capillaries", "कूपिकाएँ — पतली भित्ति व विशाल सतही क्षेत्र तथा केशिका जाल"];
      const pool = [["Trachea cartilage rings", "श्वासनली के उपास्थि वलय"], ["Diaphragm muscle sheet", "डायाफ्राम पेशी"], ["Nasal hair filters", "नासिका के रोम"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "org-alveoli", prompt: ["Which lung structure performs rapid O₂ and CO₂ gas exchange directly with blood?", "फेफड़ों की कौन-सी संरचना रक्त के साथ तीव्र O₂ व CO₂ विनिमय करती है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Balloon-like alveoli provide huge moist surface area in close contact with thin blood capillaries.", "गुब्बारे जैसी कूपिकाएँ पतली भित्ति व विशाल क्षेत्र से तेज़ गैस विनिमय करती हैं।"] }));
    }
    {
      const x = { mode: 2, explode: 20, rate: 2 };
      const c = ["Nephron (Bowman's capsule + renal tubule)", "नेफ्रॉन (बोमन संपुट व वृक्क नलिका)"];
      const pool = [["Neuron (nerve cell)", "न्यूरॉन"], ["Alveolus (air sac)", "कूपिका"], ["Villus (gut fold)", "रसांकुर"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "org-nephron", prompt: ["What is the basic filtration unit of the human kidney?", "मानव वृक्क (किडनी) की मूल निस्पंदन इकाई क्या है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Each kidney contains about a million nephrons that filter nitrogenous waste (urea) from blood.", "प्रत्येक वृक्क में लाखों नेफ्रॉन रक्त से यूरिया छानते हैं।"] }));
    }
    {
      const x = { mode: 2, explode: 20, rate: 2 };
      const c = ["Glucose, amino acids, salts & most water are selectively reabsorbed", "ग्लूकोज़, अमीनो अम्ल, लवण व अधिकांश जल पुनः अवशोषित होते हैं"];
      const pool = [["All glucose is thrown out in urine", "सारा ग्लूकोज़ मूत्र में निकल जाता है"], ["Red blood cells are digested in tubule", "लाल रक्त कणिकाएँ पच जाती हैं"], ["Oxygen turns into urea inside tubule", "ऑक्सीजन यूरिया बनती है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "org-reabsorb", prompt: ["Why does healthy human urine NOT contain glucose even though glucose enters Bowman's capsule?", "बोमन संपुट में छनने के बावजूद स्वस्थ मूत्र में ग्लूकोज़ क्यों नहीं होता?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["As filtrate flows along the renal tubule, useful glucose and amino acids are selectively reabsorbed into blood.", "नलिका में बहते समय उपयोगी ग्लूकोज़ व अमीनो अम्ल रक्त में पुनः अवशोषित कर लिए जाते हैं।"] }));
    }
    {
      const x = { mode: 3, explode: 20, rate: 2 };
      const c = ["Ball-and-socket joint (allows 360° movement)", "कंदुक-खल्लिका संधि (सभी दिशाओं में गति)"];
      const pool = [["Hinge joint (one plane only)", "कब्जा संधि (एक ही दिशा में)"], ["Immovable suture joint", "अचल संधि"], ["Pivot joint (neck only)", "धुराग्र संधि"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "org-joint", prompt: ["Which synovial joint lets your shoulder rotate freely in all directions?", "कौन-सी संधि कंधे को सभी दिशाओं में घूमने देती है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["The spherical head of the humerus fits into a cup-like socket allowing multi-directional movement.", "कंदुक-खल्लिका संधि में गोल अस्थि प्यालेनुमा गुहा में सभी दिशाओं में घूमती है।"] }));
    }
    {
      const x = v();
      const c = ["Bile emulsifies large fat globules into tiny droplets & makes food alkaline", "पित्त रस बड़ी वसा गोलिकाओं को छोटी बूंदों में तोड़कर (इमल्सीकरण) माध्यम को क्षारीय बनाता है"];
      const pool = [["Bile contains strong HCl to dissolve bones", "पित्त में प्रबल HCl होता है"], ["Bile digests starch into glucose directly", "पित्त स्टार्च को पचाता है"], ["Bile pumps blood into the stomach", "पित्त रक्त पंप करता है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "org-predict", kind: "predict", prompt: ["If bile juice from the liver is blocked from entering the small intestine, why does fat digestion slow down?", "यदि यकृत से पित्त रस छोटी आंत में न पहुँचे, तो वसा का पाचन धीमा क्यों हो जाता है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Without bile salts to emulsify fats into tiny micelles and neutralise stomach acid, pancreatic lipase works slowly.", "पित्त लवणों के बिना वसा का इमल्सीकरण व क्षारीय माध्यम नहीं बन पाता, जिससे लाइपेज़ धीमा पड़ जाता है।"] }));
    }
    return out;
  }
};
