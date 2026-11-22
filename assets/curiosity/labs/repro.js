/* Curiosity Lab · Reproduction & Flower 3D Lab (NCERT Class X Ch 7 & Class IX Ch 3).
   Explore a 3D Angiosperm Flower (sepals, petals, stamen, carpel & pollen tube fertilization),
   watch Amoeba Binary Fission, Hydra Budding, and Seed Dispersal! */
import { bus } from "../core.js";
import { REPRO_MODES, reproModel } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const view = v => reproModel({ mode: v.mode, step: v.step });

function snapshot(canvas, vars, focus) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#121024"), R = view(vars);
  C2.text(g, focus === "blind" ? "Reproduction & Development Explorer" : `${R.name} (${R.hi}) · Step ${R.step}`, 360, 22, { size: 15, color: "#f9a8d4" });
  if (R.mode === 0) {
    C2.circle(g, 360, 210, 48, { stroke: "#4ade80", fill: "rgba(74,222,128,0.22)", w: 3 });
    C2.rect(g, 344, 110, 32, 65, { stroke: "#4ade80", fill: "rgba(74,222,128,0.18)", lw: 2, r: 8 });
    C2.text(g, "Stigma → Style → Ovary (Ovule)", 360, 88, { size: 13, color: "#bbf7d0" });
    [-95, 95].forEach(dx => {
      C2.line(g, [[360 + dx * 0.4, 210], [360 + dx, 125]], "#facc15", 4);
      C2.circle(g, 360 + dx, 120, 14, { stroke: "#fff", fill: "#facc15", w: 1.5 });
    });
    C2.text(g, "Anther (Pollen)", 480, 115, { size: 12, color: "#fef08a" });
  } else if (R.mode === 1) {
    C2.circle(g, 190, 175, 50, { stroke: "#38bdf8", fill: "rgba(56,189,248,0.25)", w: 2.5 });
    C2.arrow(g, 260, 175, 345, 175, "#ffd23f", 3, 9);
    C2.circle(g, 430, 175, 36, { stroke: "#38bdf8", fill: "rgba(56,189,248,0.25)", w: 2 });
    C2.circle(g, 520, 175, 36, { stroke: "#38bdf8", fill: "rgba(56,189,248,0.25)", w: 2 });
    C2.text(g, `Binary Fission → ${R.clones} daughter cells`, 360, 255, { size: 13, color: "#bae6fd" });
  } else {
    C2.rect(g, 290, 130, 46, 125, { stroke: "#4ade80", fill: "rgba(74,222,128,0.25)", lw: 2.5, r: 10 });
    C2.rect(g, 342, 165, 28, 55, { stroke: "#facc15", fill: "rgba(250,204,21,0.25)", lw: 2, r: 6 });
    C2.text(g, R.name, 360, 95, { size: 14, color: "#bbf7d0" });
  }
  C2.text(g, R.summary, 360, 305, { size: 12, color: "#cbd5e1" });
  return canvas;
}

export default {
  id: "repro", cls: 10, unit: "x/ch7", icon: "🌸",
  title: { en: "Reproduction & Flower 3D Lab — Pollination & Fission", hi: "जनन व पुष्प 3D प्रयोगशाला — परागण व द्विखंडन" },
  blurb: { en: "Dissect a 3D flower (stamen, carpel, pollen tube), split Amoeba via binary fission, grow Hydra buds, and test seed dispersal!", hi: "3D पुष्प (पुंकेसर, स्त्रीकेसर, पराग नली), अमीबा द्विखंडन, हाइड्रा मुकुलन और बीज प्रकीर्णन देखो!" },
  vars: [
    { id: "mode", label: { en: "Mode (0 Flower · 1 Fission · 2 Budding · 3 Dispersal)", hi: "मोड (0 पुष्प · 1 द्विखंडन · 2 मुकुलन · 3 प्रकीर्णन)" }, unit: "", min: 0, max: 3, step: 1, value: 0 },
    { id: "step", label: { en: "Growth / generation stage", hi: "विकास / पीढ़ी चरण" }, unit: "", min: 1, max: 4, step: 1, value: 2 }
  ],
  facts(v) {
    const R = view(v);
    return [
      { id: "mod", en: "Reproduction mode", hi: "जनन प्रकार", value: `${R.name} (${R.hi})` },
      { id: "sum", en: "Key biological process", hi: "मुख्य जैविक प्रक्रिया", value: R.summary },
      { id: "cnt", en: "Stage / clone count", hi: "चरण / संतति संख्या", value: R.mode === 1 ? `${R.clones} clones (${R.generations} divisions)` : `Stage ${R.step} / 4` },
      { id: "var", en: "Genetic variation", hi: "आनुवंशिक विविधता", value: R.mode === 0 ? "Sexual (gamete fusion → high variation)" : "Asexual (mitotic clones)" }
    ];
  },
  snapshot,
  missions: [
    { id: "rep-fert", en: "Advance Flower Pollination to stage 4 to see pollen tube reach the ovule!", hi: "पुष्प परागण को चरण 4 पर ले जाकर बीजांड निषेचन देखो!", check: v => v.mode === 0 && v.step === 4 },
    { id: "rep-fis", en: "Divide Amoeba 4 times in Binary Fission to produce 16 clones!", hi: "अमीबा द्विखंडन से 16 क्लोन कोशिकाएँ बनाओ!", check: v => v.mode === 1 && v.step === 4 },
    { id: "rep-bud", en: "Inspect Hydra Budding or Seed Dispersal!", hi: "हाइड्रा मुकुलन या बीज प्रकीर्णन प्रयोग देखो!", check: v => v.mode >= 2 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 2.2, 8.0], target: [0, 0.2, 0], bg: 0x121024, minDist: 4, maxDist: 16 });
    const { scene } = st, dyn = new THREE.Group(); scene.add(dyn);
    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    const h1 = el("span"), h2 = el("span"); hud.append(h1, h2);

    let t = 0, subMode = ctx.preset?.sub === "human" ? "human" : ctx.preset?.sub === "vegetative" ? "vegetative" : null;
    const rebuild = () => {
      while (dyn.children.length) {
        const c = dyn.children.pop();
        c.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); }); });
      }
      const R = view(ctx.vars);
      if (subMode === "human") {
        /* Human Reproduction: Ovum + Sperm -> Zygote -> Morula/Blastocyst -> Embryo & Placenta */
        const ovum = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 18), new THREE.MeshStandardMaterial({ color: 0xf472b6, transparent: true, opacity: 0.72 }));
        ovum.position.set(R.step >= 2 ? 0 : 0.7, 0.2, 0); dyn.add(ovum);
        const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 12), new THREE.MeshStandardMaterial({ color: 0xa855f7 }));
        nuc.position.copy(ovum.position); dyn.add(nuc);
        if (R.step === 1) {
          const sp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 10), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
          sp.position.set(-1.5, 0.2, 0); dyn.add(sp);
          const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.01, 1.3, 8), new THREE.MeshBasicMaterial({ color: 0x7dd3fc }));
          tail.rotation.z = Math.PI / 2; tail.position.set(-2.25, 0.2, 0); dyn.add(tail);
        } else if (R.step >= 3) {
          const cells = R.step === 3 ? 4 : 8;
          for (let i = 0; i < cells; i++) {
            const a = (i / cells) * Math.PI * 2;
            const c = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
            c.position.set(Math.cos(a) * 0.42, 0.2 + Math.sin(a) * 0.42, (i % 2 ? 0.18 : -0.18)); dyn.add(c);
          }
          if (R.step === 4) {
            const plac = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.35, 1.8), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
            plac.position.set(0, -1.25, 0); dyn.add(plac);
            const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.1, 10), new THREE.MeshStandardMaterial({ color: 0xfda4af }));
            cord.position.set(0, -0.65, 0); dyn.add(cord);
          }
        }
        const stages = ["", "Gametes (Sperm n + Ovum n)", "Fertilisation → Zygote (2n)", "Cleavage → Embryo", "Implantation & Placenta (O₂/Nutrients)"];
        const tag = labelSprite(THREE, "Human Reproduction · मानव जनन", stages[R.step], { scale: 0.85, size: 22, color: "#fbcfe8" });
        tag.position.set(0, 2.45, 0); dyn.add(tag);
        h1.textContent = `Human Reproduction · Stage ${R.step}/4`;
        h2.textContent = stages[R.step];
        return;
      }
      if (subMode === "vegetative") {
        /* Bryophyllum Leaf Margin Buds + Stem Grafting */
        const leaf = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.14, 1.6), new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.5 }));
        leaf.position.set(0, -0.3, 0); dyn.add(leaf);
        const buds = R.step + 1;
        for (let i = 0; i < buds; i++) {
          const x = -1.1 + (i / Math.max(1, buds - 1)) * 2.2, z = i % 2 === 0 ? 0.82 : -0.82;
          const shoot = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.3 + R.step * 0.16, 8), new THREE.MeshStandardMaterial({ color: 0x86efac }));
          shoot.position.set(x, -0.1 + R.step * 0.08, z); dyn.add(shoot);
          const cap = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), new THREE.MeshStandardMaterial({ color: 0x4ade80 }));
          cap.position.set(x, 0.1 + R.step * 0.16, z); dyn.add(cap);
        }
        const tag = labelSprite(THREE, "Vegetative Propagation (Bryophyllum)", "Leaf-margin buds grow clonal plantlets!", { scale: 0.85, size: 22, color: "#bbf7d0" });
        tag.position.set(0, 2.35, 0); dyn.add(tag);
        h1.textContent = `Vegetative Propagation · ${buds} Leaf Buds`;
        h2.textContent = "Genetically identical clonal plants";
        return;
      }
      if (R.mode === 0) {
        /* 3D Flower: green sepals, pink petals, central ovary/style/stigma, yellow stamens + growing pollen tube */
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          const pet = new THREE.Mesh(new THREE.SphereGeometry(0.75, 16, 12), new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 }));
          pet.scale.set(0.65, 0.22, 1.3); pet.position.set(Math.cos(a) * 1.25, 0.1, Math.sin(a) * 1.25); pet.rotation.y = -a + Math.PI / 2;
          dyn.add(pet);
        }
        const ovary = new THREE.Mesh(new THREE.SphereGeometry(0.62, 20, 16), new THREE.MeshStandardMaterial({ color: 0x22c55e, transparent: true, opacity: 0.65 }));
        ovary.position.set(0, 0.3, 0);
        const style = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 1.3, 14), new THREE.MeshStandardMaterial({ color: 0x4ade80 }));
        style.position.set(0, 1.15, 0);
        const stigma = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 10), new THREE.MeshStandardMaterial({ color: 0x86efac }));
        stigma.position.set(0, 1.85, 0);
        dyn.add(ovary, style, stigma);
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2 + 0.4;
          const fil = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8), new THREE.MeshStandardMaterial({ color: 0xfef08a }));
          fil.position.set(Math.cos(a) * 0.65, 0.85, Math.sin(a) * 0.65);
          const ant = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
          ant.position.set(Math.cos(a) * 0.65, 1.5, Math.sin(a) * 0.65);
          dyn.add(fil, ant);
        }
        if (R.step >= 2) {
          const len = (R.step - 1) * 0.48;
          const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, len, 8), new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c }));
          tube.position.set(0, 1.85 - len / 2, 0.08); dyn.add(tube);
        }
      } else if (R.mode === 1) {
        const cnt = Math.min(8, R.clones), rad = cnt === 1 ? 0 : 1.5;
        for (let i = 0; i < cnt; i++) {
          const a = (i / cnt) * Math.PI * 2;
          const cell = new THREE.Mesh(new THREE.SphereGeometry(0.58, 20, 14), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.72 }));
          cell.scale.set(1.2, 0.75, 1.0); cell.position.set(Math.cos(a) * rad, Math.sin(a) * 0.4, Math.sin(a) * rad);
          const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), new THREE.MeshStandardMaterial({ color: 0xa855f7 }));
          nuc.position.copy(cell.position); dyn.add(cell, nuc);
        }
      } else if (R.mode === 2) {
        const parent = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 2.2, 16), new THREE.MeshStandardMaterial({ color: 0x22c55e }));
        dyn.add(parent);
        const budScale = 0.25 + R.step * 0.18;
        const bud = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * budScale, 0.28 * budScale, 1.2 * budScale, 14), new THREE.MeshStandardMaterial({ color: 0x86efac }));
        bud.position.set(0.45 + (R.step === 4 ? 0.6 : 0), -0.1, 0); bud.rotation.z = -0.5;
        dyn.add(bud);
      } else {
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2, d = 0.4 + R.step * 0.55;
          const seed = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
          seed.position.set(Math.cos(a) * d, 0.3 * Math.sin(i + R.step), Math.sin(a) * d);
          const wing = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 0.2), new THREE.MeshStandardMaterial({ color: 0xfde68a }));
          wing.position.set(seed.position.x + 0.25, seed.position.y + 0.12, seed.position.z);
          dyn.add(seed, wing);
        }
      }
      const tag = labelSprite(THREE, R.name, R.hi, { scale: 0.82, size: 24, color: "#f9a8d4" });
      tag.position.set(0, 2.45, 0); dyn.add(tag);
      h1.textContent = `${R.name} · Stage ${R.step}`;
      h2.textContent = R.summary;
    };

    const stopFrame = st.onFrame(dt => { t += dt; dyn.rotation.y = t * 0.35; });
    const side = ctx.side; side.replaceChildren();
    const sl = sliders(ctx, side);
    const presets = el("div", "cl-presets"); presets.appendChild(el("span", "cl-lab", "Topic · विषय"));
    REPRO_MODES.forEach((m, i) => {
      actionButton(presets, m.name.split(" ")[0], () => { subMode = null; ctx.set("mode", i); sfx.play("pop"); sl.sync(); rebuild(); }, "cl-chipb");
    });
    actionButton(presets, "🌿 Vegetative", () => { subMode = "vegetative"; sfx.play("pop"); rebuild(); }, "cl-chipb");
    actionButton(presets, "🧬 Human", () => { subMode = "human"; sfx.play("pop"); rebuild(); }, "cl-chipb");
    side.insertBefore(presets, sl.root.nextSibling);
    const facts = factsView(ctx, side);
    note(side, "After pollination on the stigma, a pollen tube grows down the style into the ovule (fertilisation): the ovule becomes the SEED and the ovary ripens into the FRUIT!", "परागण के बाद पराग नली वर्तिका से बीजांड तक पहुँचती है: निषेचन के बाद बीजांड से बीज तथा अंडाशय से फल बनता है!");

    const off = bus.on("sim:change", e => { if (e.labId !== "repro") return; rebuild(); facts.update(); sl.sync(); });
    rebuild(); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ mode: seen(q, "mode"), step: seen(q, "step") });
    {
      const x = { mode: 0, step: 4 };
      const c = ["Ovule becomes Seed; Ovary ripens into Fruit", "बीजांड से बीज तथा अंडाशय से फल बनता है"];
      const pool = [["Petal becomes Seed; Sepal becomes Fruit", "पंखुड़ी से बीज"], ["Anther becomes Seed; Stigma becomes Root", "परागकोश से बीज"], ["Style turns into Leaf", "वर्तिका से पत्ती"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "rep-fruit", prompt: ["After fertilisation in a flowering plant, what do the ovule and ovary develop into?", "पुष्प में निषेचन के पश्चात बीजांड और अंडाशय किसमें विकसित होते हैं?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["The fertilised ovule forms the embryo-bearing seed while the surrounding ovary wall swells into a fruit.", "निषेचित बीजांड बीज बनाता है और अंडाशय पककर फल बनता है।"] }));
    }
    {
      const x = { mode: 1, step: 3 };
      const c = ["Binary Fission (single parent splits into two identical daughter cells)", "द्विखंडन (एक कोशिका दो समान संतति कोशिकाओं में विभाजित होती है)"];
      const pool = [["Spore formation", "बीजाणु निर्माण"], ["Pollination", "परागण"], ["Seed dispersal", "बीज प्रकीर्णन"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "rep-amoeba", prompt: ["Which asexual reproduction method does Amoeba use to multiply rapidly?", "अमीबा किस अलैंगिक जनन विधि से गुणन करता है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Amoeba divides its nucleus first and then splits cytoplasm into two equal daughter amoebae.", "अमीबा द्विखंडन द्वारा पहले केंद्रक और फिर कोशिकाद्रव्य को दो भागों में बाँटता है।"] }));
    }
    {
      const x = { mode: 2, step: 3 };
      const c = ["Budding (outgrowth detaches as new individual)", "मुकुलन (कली/मुकुल बढ़कर नया जीव बनता है)"];
      const pool = [["Fragmentation only", "केवल खंडन"], ["Double fertilisation", "दोहरा निषेचन"], ["Binary fission in any plane", "द्विखंडन"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "rep-hydra", prompt: ["Hydra uses regenerative cells at one site to grow a tiny new organism attached to its body before detaching. What is this called?", "हाइड्रा शरीर पर उभार बनाकर नया जीव विकसित करता है और फिर अलग होता है। इसे क्या कहते हैं?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Hydra and Yeast reproduce asexually by budding.", "हाइड्रा और यीस्ट में यह अलैंगिक विधि मुकुलन (Budding) कहलाती है।"] }));
    }
    {
      const x = { mode: 0, step: 2 };
      const c = ["Pollination = transfer of pollen to stigma; Fertilisation = fusion of male & female gametes", "परागण = परागकण का वर्तिकाग्र तक पहुँचना; निषेचन = नर व मादा युग्मक का संलयन"];
      const pool = [["Both words mean exactly the same process", "दोनों एक ही क्रिया हैं"], ["Fertilisation happens before pollination", "निषेचन परागण से पहले होता है"], ["Pollination occurs inside roots", "परागण जड़ में होता है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "rep-poll", prompt: ["How is Pollination different from Fertilisation in flowers?", "फूलों में परागण (Pollination) और निषेचन (Fertilisation) में क्या अंतर है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Pollen must first land on the stigma (pollination) before the pollen tube delivers sperm to fuse with the egg (fertilisation).", "पहले परागकण वर्तिकाग्र पर पहुँचते हैं (परागण), फिर नर-मादा युग्मक मिलते हैं (निषेचन)।"] }));
    }
    {
      const x = { mode: 3, step: 3 };
      const c = ["Reduces overcrowding & competition for sunlight, water and minerals", "भीड़भाड़ कम होती है और धूप, जल व खनिजों के लिए प्रतिस्पर्धा घटती है"];
      const pool = [["Turns all plants into animals", "पौधे जंतु बन जाते हैं"], ["Stops photosynthesis in leaves", "प्रकाश-संश्लेषण बंद होता है"], ["Eliminates roots completely", "जड़ें समाप्त हो जाती हैं"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "rep-disp", prompt: ["Why is seed dispersal away from the parent plant beneficial for species survival?", "पैतृक पौधे से दूर बीज प्रकीर्णन पौधों के लिए क्यों लाभदायक है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Dispersal lets seedlings colonise new habitats without competing with the parent tree for light and water.", "प्रकीर्णन से नए पौधे दूर उगते हैं और धूप व पानी की होड़ से बचते हैं।"] }));
    }
    {
      const x = v();
      const c = ["DNA copying + sexual recombination create variations that help survive environmental shifts", "DNA प्रतिकृति व लैंगिक जनन से विविधता आती है जो बदलते पर्यावरण में जीवित रहने में मदद करती है"];
      const pool = [["Variation prevents organisms from breathing", "विविधता श्वसन रोकती है"], ["All individuals must be identical clones to survive disease", "रोग से बचने हेतु क्लोन ज़रूरी हैं"], ["Variation destroys chromosomes", "विविधता गुणसूत्र नष्ट करती है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "rep-predict", kind: "predict", prompt: ["If a sudden heatwave hits a pond of bacteria, why is genetic variation vital for the population?", "यदि तालाब में अचानक तापमान बढ़ जाए, तो जीवाणुओं की आबादी में विविधता क्यों महत्वपूर्ण है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Heat-tolerant variants survive and reproduce, preventing extinction of the whole species.", "कुछ विविधता वाले जीव अधिक ताप सहन कर जीवित रहते हैं और प्रजाति को बचाते हैं।"] }));
    }
    return out;
  }
};
