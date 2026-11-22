/* Curiosity Lab · Nervous & Coordination 3D Lab (NCERT Class X Ch 6 Control and Coordination).
   Fire an electrical nerve impulse along a myelinated Neuron & Synapse, trace the Reflex Arc (Spinal Cord shortcut!),
   inspect Brain Lobes (Cerebrum, Cerebellum, Medulla), and test Plant Auxin Phototropism! */
import { bus } from "../core.js";
import { NERVOUS_MODES, nervousModel } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const view = v => nervousModel({ mode: v.mode, stim: v.stim });

function snapshot(canvas, vars, focus) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#0e1326"), N = view(vars);
  C2.text(g, focus === "blind" ? "Control & Coordination Pathway" : `${N.name} · Stimulus ${N.stim}% (${N.fires ? "Impulse FIRES!" : "Below threshold <30%"})`, 360, 22, { size: 15, color: "#93c5fd" });
  const steps = N.pathway.split("→").map(s => s.trim());
  const bw = Math.min(145, 580 / steps.length - 16), startX = 360 - ((steps.length * (bw + 24) - 24) / 2);
  steps.forEach((st, i) => {
    const x = startX + i * (bw + 24);
    C2.rect(g, x, 130, bw, 74, { stroke: N.fires ? "#facc15" : "#475569", fill: N.fires ? "rgba(250,204,21,0.18)" : "rgba(71,85,105,0.18)", lw: 2, r: 8 });
    C2.text(g, st.slice(0, 18), x + bw / 2, 167, { size: 11, color: "#f8fafc" });
    if (i < steps.length - 1) C2.arrow(g, x + bw + 2, 167, x + bw + 22, 167, "#38bdf8", 2.5, 7);
  });
  C2.text(g, N.mode === 1 ? `Spinal Cord Reflex Time: ${N.fires ? N.reflexMs + " ms" : "No reflex"}` : `Speed ~ ${N.impulseSpeed} m/s · Myelinated axon`, 360, 290, { size: 13, color: "#ffd23f" });
  return canvas;
}

export default {
  id: "nervous", cls: 10, unit: "x/ch6", icon: "🧠",
  title: { en: "Nervous & Brain 3D Lab — Neuron, Reflex & Auxin", hi: "तंत्रिका व मस्तिष्क 3D प्रयोगशाला — न्यूरॉन, प्रतिवर्ती चाप" },
  blurb: { en: "Fire real electrical impulses across a Neuron & Synapse, watch a Spinal Reflex Arc bypass the brain, explore Brain Lobes, and bend plants with Auxin!", hi: "न्यूरॉन व सिनेप्स में विद्युत आवेग, मेरुरज्जु का प्रतिवर्ती चाप, मस्तिष्क के भाग और ऑक्सिन द्वारा प्रकाशानुवर्तन 3D में देखो!" },
  vars: [
    { id: "mode", label: { en: "Module (0 Neuron · 1 Reflex · 2 Brain · 3 Plant)", hi: "मोड (0 न्यूरॉन · 1 प्रतिवर्ती · 2 मस्तिष्क · 3 पादप)" }, unit: "", min: 0, max: 3, step: 1, value: 0 },
    { id: "stim", label: { en: "Stimulus intensity (threshold ≥ 30%)", hi: "उद्दीपन तीव्रता (सीमा ≥ 30%)" }, unit: "%", min: 10, max: 100, step: 5, value: 70 }
  ],
  facts(v) {
    const N = view(v);
    return [
      { id: "mod", en: "Active system", hi: "सक्रिय प्रणाली", value: `${N.name} (${N.hi})` },
      { id: "path", en: "Signal pathway", hi: "संकेत मार्ग", value: N.pathway },
      { id: "thr", en: "Threshold & speed", hi: "सीमा व चाल", value: N.fires ? `FIRES! (${N.impulseSpeed} m/s)` : "Sub-threshold (< 30%, no impulse)" },
      { id: "syn", en: "Synapse mechanism", hi: "सिनेप्स क्रिया", value: "Electrical impulse → Chemical neurotransmitters → Next neuron" }
    ];
  },
  snapshot,
  missions: [
    { id: "ner-fire", en: "Set stimulus ≥ 70% on Neuron to fire rapid synaptic sparks!", hi: "न्यूरॉन पर उद्दीपन ≥ 70% रखकर सिनेप्स पार करते संकेत देखो!", check: v => v.mode === 0 && v.stim >= 70 },
    { id: "ner-reflex", en: "Trigger the Spinal Reflex Arc (< 70 ms emergency response)!", hi: "मेरुरज्जु प्रतिवर्ती चाप सक्रिय करो!", check: v => v.mode === 1 && v.stim >= 60 },
    { id: "ner-auxin", en: "Explore Plant Phototropism to see Auxin bend stems toward light!", hi: "पादप प्रकाशानुवर्तन में ऑक्सिन द्वारा तने का झुकना देखो!", check: v => v.mode === 3 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 2.0, 8.6], target: [0, 0, 0], bg: 0x0e1326, minDist: 4, maxDist: 16 });
    const { scene } = st, dyn = new THREE.Group(); scene.add(dyn);
    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    const h1 = el("span"), h2 = el("span"); hud.append(h1, h2);

    let pulses = [], stemGrp = null, t = 0;
    const rebuild = () => {
      while (dyn.children.length) {
        const c = dyn.children.pop();
        c.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); }); });
      }
      pulses = []; stemGrp = null;
      const N = view(ctx.vars);
      if (N.mode === 0) {
        /* Neuron: soma + dendrites + myelinated axon + synaptic cleft + next dendrite */
        const soma = new THREE.Mesh(new THREE.SphereGeometry(0.75, 22, 16), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
        soma.position.set(-2.5, 0, 0); dyn.add(soma);
        for (let i = 0; i < 5; i++) {
          const a = -0.9 + i * 0.45;
          const d = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.09, 1.1, 8), new THREE.MeshStandardMaterial({ color: 0x7dd3fc }));
          d.position.set(-3.1, Math.sin(a) * 0.7, Math.cos(a) * 0.4); d.rotation.z = Math.PI / 2 - a * 0.6; dyn.add(d);
        }
        const axon = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.2, 12), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
        axon.rotation.z = Math.PI / 2; axon.position.set(-0.1, 0, 0); dyn.add(axon);
        [-1.2, -0.2, 0.8].forEach(x => {
          const my = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.75, 16), new THREE.MeshStandardMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.7 }));
          my.rotation.z = Math.PI / 2; my.position.set(x, 0, 0); dyn.add(my);
        });
        const nextCell = new THREE.Mesh(new THREE.SphereGeometry(0.6, 20, 14), new THREE.MeshStandardMaterial({ color: 0x22c55e }));
        nextCell.position.set(2.85, 0, 0); dyn.add(nextCell);
        for (let i = 0; i < 6; i++) {
          const sp = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfacc15, emissiveIntensity: 0.9 }));
          dyn.add(sp); pulses.push({ m: sp, ph: i / 6, kind: "axon" });
        }
      } else if (N.mode === 1) {
        /* Reflex Arc loop */
        const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 2.2, 20), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
        spine.position.set(0, 1.3, 0); dyn.add(spine);
        const hand = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 0.8), new THREE.MeshStandardMaterial({ color: 0xfb7185 }));
        hand.position.set(-2.4, -1.0, 0); dyn.add(hand);
        const muscle = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 0.8), new THREE.MeshStandardMaterial({ color: 0x22c55e }));
        muscle.position.set(2.4, -1.0, 0); dyn.add(muscle);
        for (let i = 0; i < 8; i++) {
          const sp = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xf97316, emissiveIntensity: 0.9 }));
          dyn.add(sp); pulses.push({ m: sp, ph: i / 8, kind: "reflex" });
        }
      } else if (N.mode === 2) {
        /* 3D Brain Lobes: Cerebrum + Cerebellum + Brainstem/Medulla */
        const cerebrum = new THREE.Mesh(new THREE.SphereGeometry(1.45, 28, 20), new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.45 }));
        cerebrum.scale.set(1.25, 0.95, 1.0); cerebrum.position.set(0, 0.45, 0);
        const cerebellum = new THREE.Mesh(new THREE.SphereGeometry(0.68, 20, 16), new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.45 }));
        cerebellum.position.set(-0.95, -0.75, 0);
        const medulla = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 1.4, 16), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
        medulla.position.set(0.1, -1.15, 0);
        dyn.add(cerebrum, cerebellum, medulla);
      } else {
        /* Plant Phototropism: Sun lamp on right + bending stem */
        const sun = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 16), new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfacc15, emissiveIntensity: 0.9 }));
        sun.position.set(2.8, 2.0, 0); dyn.add(sun);
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.5, 0.9, 20), new THREE.MeshStandardMaterial({ color: 0xb45309 }));
        pot.position.set(-0.8, -1.4, 0); dyn.add(pot);
        stemGrp = new THREE.Group(); stemGrp.position.set(-0.8, -0.95, 0); dyn.add(stemGrp);
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 2.4, 12), new THREE.MeshStandardMaterial({ color: 0x22c55e }));
        stem.position.y = 1.2;
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), new THREE.MeshStandardMaterial({ color: 0x4ade80 }));
        leaf.scale.set(1.4, 0.5, 0.9); leaf.position.set(0.2, 2.35, 0);
        stemGrp.add(stem, leaf);
      }
      const tag = labelSprite(THREE, N.name, N.hi, { scale: 0.82, size: 24, color: "#bae6fd" });
      tag.position.set(0, 2.4, 0); dyn.add(tag);
      h1.textContent = `${N.name} · Stimulus ${N.stim}%`;
      h2.textContent = N.fires ? "Impulse ACTIVE" : "Sub-threshold (<30%)";
    };

    const stopFrame = st.onFrame(dt => {
      const N = view(ctx.vars);
      t += dt * (0.6 + N.stim / 50);
      pulses.forEach(p => {
        p.m.visible = N.fires;
        const u = (p.ph + t * 0.45) % 1;
        if (p.kind === "axon") {
          p.m.position.set(-2.3 + u * 4.9, Math.sin(u * 12) * 0.08, 0.18);
        } else {
          if (u < 0.5) {
            const k = u * 2; p.m.position.set(-2.4 + k * 2.4, -1.0 + k * 2.3, 0.35);
          } else {
            const k = (u - 0.5) * 2; p.m.position.set(k * 2.4, 1.3 - k * 2.3, 0.35);
          }
        }
      });
      if (stemGrp) stemGrp.rotation.z = -((N.stim / 100) * 0.55);
      if (N.mode === 2) dyn.rotation.y += dt * 0.4;
    });

    const side = ctx.side; side.replaceChildren();
    const sl = sliders(ctx, side);
    const presets = el("div", "cl-presets"); presets.appendChild(el("span", "cl-lab", "Module · भाग"));
    NERVOUS_MODES.forEach((m, i) => {
      actionButton(presets, m.name.split(" ")[0], () => { ctx.set("mode", i); sfx.play("pop"); sl.sync(); rebuild(); }, "cl-chipb");
    });
    side.insertBefore(presets, sl.root.nextSibling);
    const facts = factsView(ctx, side);
    note(side, "Reflex arcs are wired directly through the Spinal Cord for instant protection. Cerebellum balances posture; Medulla controls involuntary breathing & heartbeat!", "प्रतिवर्ती चाप मेरुरज्जु से तुरंत प्रतिक्रिया देता है। अनुमस्तिष्क (Cerebellum) संतुलन तथा मेडुला अनैच्छिक क्रियाएँ नियंत्रित करते हैं।");

    const off = bus.on("sim:change", e => { if (e.labId !== "nervous") return; rebuild(); facts.update(); sl.sync(); });
    rebuild(); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ mode: seen(q, "mode"), stim: seen(q, "stim") });
    {
      const x = { mode: 0, stim: 70 };
      const c = ["Electrical impulse converts to chemical neurotransmitters across the synapse", "विद्युत आवेग सिनेप्स पर रासायनिक न्यूरोट्रांसमीटर में बदलकर अगले न्यूरॉन तक जाता है"];
      const pool = [["Axons touch physically with copper wires", "ताँबे जैसे सीधे स्पर्श से"], ["Blood carries the signal between neurons", "रक्त संकेत ले जाता है"], ["Signals travel backward from axon to dendrite", "संकेत विपरीत दिशा में जाता है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "ner-synapse", prompt: ["How does a nerve impulse cross the microscopic gap (synapse) between two neurons?", "दो न्यूरॉनों के बीच के सूक्ष्म अंतराल (सिनेप्स) को तंत्रिका आवेग कैसे पार करता है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["At the nerve ending, electrical impulses trigger release of chemicals that cross the synapse and start an electrical impulse in the next dendrite.", "सिनेप्स पर रासायनिक पदार्थ स्रावित होकर अगले न्यूरॉन के डेंड्राइट में नया विद्युत आवेग शुरू करते हैं।"] }));
    }
    {
      const x = { mode: 1, stim: 80 };
      const c = ["Spinal Cord (allows ultra-fast reflex before thinking)", "मेरुरज्जु (Spinal Cord — तेज़ सुरक्षात्मक प्रतिक्रिया)"];
      const pool = [["Cerebrum cortex", "प्रमस्तिष्क"], ["Kidney nephron", "नेफ्रॉन"], ["Gall bladder", "पित्ताशय"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "ner-reflex", prompt: ["When your hand touches a hot pan, which organ processes the immediate reflex arc?", "गरम तवे को छूने पर तुरंत हाथ हटाने का प्रतिवर्ती चाप कहाँ बनता है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Reflex arcs form in the spinal cord so muscles react in milliseconds while the thinking brain is informed shortly after.", "मेरुरज्जु में प्रतिवर्ती चाप बनने से हाथ सेकंड के हिस्से में हट जाता है।"] }));
    }
    {
      const x = { mode: 2, stim: 70 };
      const c = ["Cerebellum (balance, posture & precision movement)", "अनुमस्तिष्क / Cerebellum (संतुलन व सटीक गति)"];
      const pool = [["Medulla (blood pressure & salivation)", "मेडुला"], ["Olfactory lobe (smell only)", "घ्राण पिंड"], ["Spinal nerve root", "मेरुरज्जु जड़"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "ner-cerebellum", prompt: ["Which part of the hindbrain maintains posture, balance & smooth cycling/walking?", "पश्चमस्तिष्क का कौन-सा भाग शरीर का संतुलन और सटीक गति बनाए रखता है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["The cerebellum coordinates voluntary muscle precision, posture and balance.", "अनुमस्तिष्क (Cerebellum) ऐच्छिक पेशियों की सटीकता व संतुलन नियंत्रित करता है।"] }));
    }
    {
      const x = { mode: 2, stim: 70 };
      const c = ["Medulla (in the hindbrain)", "मेडुला (पश्चमस्तिष्क में)"];
      const pool = [["Cerebellum", "अनुमस्तिष्क"], ["Forebrain frontal lobe", "अग्रमस्तिष्क"], ["Retina of eye", "नेत्र रेटिना"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "ner-medulla", prompt: ["Which brain region controls involuntary actions like heartbeat, breathing, blood pressure and vomiting?", "हृदय स्पंदन, श्वसन व रक्तचाप जैसी अनैच्छिक क्रियाएँ कौन नियंत्रित करता है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Involuntary vital centres reside in the medulla oblongata of the hindbrain.", "मेडुला अनैच्छिक जीवन-रक्षक क्रियाओं का केंद्र है।"] }));
    }
    {
      const x = { mode: 3, stim: 85 };
      const c = ["Auxin diffuses to the shaded side, causing those cells to grow longer", "ऑक्सिन छाया वाले भाग में जाकर कोशिकाओं को अधिक लंबा बढ़ाता है"];
      const pool = [["Light burns the illuminated side shorter", "प्रकाश तने को जला देता है"], ["Abscisic acid pulls roots upward", "ऐब्सिसिक अम्ल जड़ खींचता है"], ["Cytokinin freezes stem growth", "साइटोकाइनिन वृद्धि रोकता है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "ner-auxin", prompt: ["Why does a growing shoot bend toward sunlight (positive phototropism)?", "बढ़ता हुआ तना सूर्य के प्रकाश की ओर (धनात्मक प्रकाशानुवर्तन) क्यों मुड़ता है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Auxin accumulates on the shady side, stimulating faster cell elongation there so the stem curves toward light.", "ऑक्सिन छाया की ओर एकत्र होकर कोशिकाओं को तेज़ी से बढ़ाता है, जिससे तना प्रकाश की ओर मुड़ता है।"] }));
    }
    {
      const x = v();
      const c = ["Adrenaline speeds up heart rate & breathing for 'fight or flight'", "एड्रेनालिन हृदय गति व श्वसन बढ़ाकर 'लड़ो या भागो' के लिए तैयार करता है"];
      const pool = [["Insulin lowers blood glucose instantly", "इंसुलिन शर्करा कम करता है"], ["Thyroxine slows all muscles down", "थायरॉक्सिन पेशियाँ धीमी करता है"], ["Auxin contracts human biceps", "ऑक्सिन मांसपेशी सिकोड़ता है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "ner-predict", kind: "predict", prompt: ["When a student faces a sudden fright, which hormone surges into the blood and what does it do?", "अचानक डर लगने पर रक्त में कौन-सा हॉर्मोन बढ़ता है और क्या करता है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Adrenaline from the adrenal glands boosts heart rate, blood flow to muscles, and oxygen intake.", "एड्रेनालिन हृदय दर व ऑक्सीजन आपूर्ति बढ़ाकर शरीर को तुरंत प्रतिक्रिया हेतु तैयार करता है।"] }));
    }
    return out;
  }
};
