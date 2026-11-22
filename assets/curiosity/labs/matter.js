/* Curiosity Lab · Matter & Mixtures Lab (NCERT Class IX, Ch 1-2: Matter & Is Matter Around Us Pure?).
   Switch between Pure Water, True Solution, Colloid (milk), and Suspension (chalk water), shine the laser torch for Tyndall Effect,
   and heat/cool particle kinetic energy from Solid (-10°C) to Liquid to Gas (110°C) in 3D! */
import { bus } from "../core.js";
import { MIXTURE_TYPES, matterModel } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const view = v => matterModel({ temp: v.temp, mix: v.mix, conc: v.conc });

function snapshot(canvas, vars, focus) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#0d1322"), M = view(vars);
  C2.text(g, focus === "blind" ? "Tyndall Laser Beaker · Mixture Test" : `${M.mixName} · Particle size ${M.size} · ${M.temp}°C (${M.Tkelvin} K)`, 360, 22, { size: 15, color: "#93c5fd" });

  /* beaker */
  C2.rect(g, 240, 75, 240, 210, { stroke: "#cbd5e1", fill: M.mix <= 1 ? "rgba(56,189,248,0.18)" : M.mix === 2 ? "rgba(241,245,249,0.28)" : "rgba(250,204,21,0.20)", lw: 3, r: 10 });
  /* torch on left */
  C2.rect(g, 55, 160, 100, 40, { stroke: "#94a3b8", fill: "#334155", lw: 2, r: 6 });
  C2.text(g, "Laser Torch", 105, 180, { size: 13, color: "#f8fafc" });

  /* laser beam */
  C2.line(g, [[155, 180], [240, 180]], "#fde047", 5);
  if (M.tyndall) {
    C2.rect(g, 242, 168, 236, 24, { stroke: null, fill: "rgba(253,224,71,0.55)", r: 4 });
    C2.text(g, "TYNDALL BEAM VISIBLE!", 360, 180, { size: 12, color: "#0f172a" });
  } else {
    C2.text(g, "(No scattering — < 1 nm)", 360, 180, { size: 11, color: "#94a3b8" });
  }
  C2.line(g, [[480, 180], [650, 180]], "#fde047", 4);

  /* particles */
  const n = M.mix <= 1 ? 18 : M.mix === 2 ? 26 : 16;
  const r = M.mix <= 1 ? 2.5 : M.mix === 2 ? 5.5 : 10;
  for (let i = 0; i < n; i++) {
    const px = 265 + ((i * 53) % 190);
    const py = M.mix === 3 ? 255 + (i % 3) * 8 : 95 + ((i * 37) % 170);
    C2.circle(g, px, py, r, { stroke: null, fill: M.mix === 3 ? "#facc15" : "#e0f2fe" });
  }
  C2.text(g, `State: ${M.state} · Conc: ${M.massPct}% w/w · ${M.settles ? "Settles down" : "Stable"}`, 360, 315, { size: 13, color: "#cbd5e1" });
  return canvas;
}

export default {
  id: "matter", cls: 9, unit: "ix/ix5", icon: "🧪",
  title: { en: "Matter & Mixtures Lab — Tyndall Effect", hi: "पदार्थ व मिश्रण प्रयोगशाला — टिंडल प्रभाव" },
  blurb: { en: "Shine a laser through Solution, Colloid & Suspension in 3D, change temperature from Ice (-10°C) to Steam (110°C), and compute mass-% concentration!", hi: "विलयन, कोलॉइड व निलंबन में लेज़र गुज़ारकर टिंडल प्रभाव, तापमान (-10°C से 110°C) और द्रव्यमान प्रतिशत सांद्रता देखो!" },
  vars: [
    { id: "mix", label: { en: "Mixture type", hi: "मिश्रण प्रकार" }, unit: "", min: 0, max: 3, step: 1, value: 2 },
    { id: "temp", label: { en: "Temperature", hi: "तापमान" }, unit: "°C", min: -10, max: 110, step: 5, value: 25 },
    { id: "conc", label: { en: "Solute added per 100 g water", hi: "100 g जल में विलेय" }, unit: " g", min: 5, max: 60, step: 5, value: 20 }
  ],
  facts(v) {
    const M = view(v);
    return [
      { id: "mix", en: "Mixture & particle size", hi: "मिश्रण व कण आकार", value: `${M.mixName} (${M.mixHi}) · ${M.size}` },
      { id: "tyndall", en: "Tyndall effect (beam scattering)", hi: "टिंडल प्रभाव", value: M.tyndall ? "Visible — particles scatter light" : "Not visible (< 1 nm particles)" },
      { id: "state", en: "Physical state & Kelvin", hi: "अवस्था व केल्विन", value: `${M.state} (${M.stateHi}) · ${M.Tkelvin} K` },
      { id: "conc", en: "Mass-by-mass concentration", hi: "द्रव्यमान प्रतिशत सांद्रता", value: `${M.massPct}% (${M.conc} g in ${100 + M.conc} g solution)` }
    ];
  },
  snapshot,
  missions: [
    { id: "mat-colloid", en: "Select Colloid (Milk/Starch) to observe the Tyndall Effect without settling!", hi: "कोलॉइड (दूध/स्टार्च) चुनकर बिना तली में बैठे टिंडल प्रभाव देखो!", check: v => v.mix === 2 },
    { id: "mat-susp", en: "Switch to Chalk Suspension and watch large >1000 nm particles settle!", hi: "चॉक निलंबन चुनकर बड़े कणों को नीचे बैठते देखो!", check: v => v.mix === 3 },
    { id: "mat-boil", en: "Heat above 100 °C (373.15 K) to turn water into fast Gas/Steam particles!", hi: "जल को भाप बनाने के लिए तापमान 100 °C से ऊपर ले जाओ!", check: v => v.temp >= 100 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 2.2, 8.2], target: [0, 0.2, 0], bg: 0x0d1322, minDist: 4, maxDist: 16 });
    const { scene } = st;
    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    const h1 = el("span"), h2 = el("span"); hud.append(h1, h2);

    /* glass beaker + liquid */
    const beaker = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.75, 3.2, 32, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.22, side: THREE.DoubleSide, roughness: 0.1 }));
    beaker.position.y = 0.3; scene.add(beaker);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.76, 1.76, 0.12, 32), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
    base.position.y = -1.32; scene.add(base);
    const liqMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.22, roughness: 0.2 });
    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.68, 2.7, 32), liqMat);
    liquid.position.y = 0.08; scene.add(liquid);

    /* torch & Tyndall beam */
    const torch = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 1.2, 16), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 }));
    torch.rotation.z = Math.PI / 2; torch.position.set(-3.4, 0.2, 0); scene.add(torch);
    const outerBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1.8, 12), new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.85 }));
    outerBeam.rotation.z = Math.PI / 2; outerBeam.position.set(-2.3, 0.2, 0); scene.add(outerBeam);
    const exitBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 2.0, 12), new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.85 }));
    exitBeam.rotation.z = Math.PI / 2; exitBeam.position.set(2.75, 0.2, 0); scene.add(exitBeam);
    const innerBeamMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.65 });
    const innerBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 3.36, 16), innerBeamMat);
    innerBeam.rotation.z = Math.PI / 2; innerBeam.position.set(0, 0.2, 0); scene.add(innerBeam);

    /* particles */
    const pGrp = new THREE.Group(); scene.add(pGrp);
    const parts = [];
    for (let i = 0; i < 42; i++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
      pGrp.add(m);
      parts.push({ m, x: (Math.random() - 0.5) * 2.4, y: (Math.random() - 0.5) * 2.1, z: (Math.random() - 0.5) * 2.4, ph: Math.random() * 6.28 });
    }

    let tag = null, t = 0;
    const sync = () => {
      const M = view(ctx.vars);
      liqMat.color.setHex(M.mix <= 1 ? 0x38bdf8 : M.mix === 2 ? 0xe2e8f0 : 0xfde047);
      liqMat.opacity = M.mix <= 1 ? 0.18 : M.mix === 2 ? 0.36 : 0.24;
      innerBeam.visible = M.tyndall;
      innerBeamMat.opacity = M.mix === 2 ? 0.72 : 0.45;
      const sc = M.mix <= 1 ? 0.35 : M.mix === 2 ? 0.9 : 1.75;
      parts.forEach(p => { p.m.scale.setScalar(sc); p.m.material.color.setHex(M.mix === 3 ? 0xfacc15 : 0xf8fafc); });
      if (tag) scene.remove(tag);
      tag = labelSprite(THREE, M.mixName, M.tyndall ? "Tyndall Beam Visible!" : M.size, { scale: 0.88, size: 26, color: "#fef08a" });
      tag.position.set(0, 2.35, 0); scene.add(tag);
      h1.textContent = `${M.mixName} · ${M.size}`;
      h2.textContent = `${M.temp}°C (${M.state}) · ${M.tyndall ? "Tyndall ON" : "No Tyndall"}`;
    };

    const stopFrame = st.onFrame(dt => {
      const M = view(ctx.vars);
      t += dt * Math.max(0.25, 0.5 + (M.temp + 10) / 40);
      const conv = M.temp >= 45 && !M.settles;
      parts.forEach((p, i) => {
        if (conv) {
          /* Thermal fluid convection loop (WebGL-Fluid style): warm rises center, cools down sides; steam escapes >100°C */
          const cyc = ((t * 0.45 + p.ph) % 1 + 1) % 1;
          const rSide = (i % 2 === 0 ? 1 : -1) * (0.25 + (i % 5) * 0.22);
          const py = M.temp >= 100 && i % 4 === 0 ? -0.9 + cyc * 3.2 : -1.0 + Math.sin(cyc * Math.PI) * 2.15;
          const px = rSide * (cyc < 0.5 ? 0.35 : 1.0);
          p.m.position.set(px, py, p.z * 0.6);
        } else {
          const settleY = M.settles ? -0.98 + (i % 4) * 0.14 : p.y;
          const amp = M.temp < 0 ? 0.03 : M.settles ? 0.04 : 0.16;
          p.m.position.set(
            p.x + Math.sin(t * 1.4 + p.ph) * amp,
            settleY + Math.cos(t * 1.8 + p.ph) * amp,
            p.z + Math.sin(t * 1.1 + i) * amp
          );
        }
      });
    });

    const side = ctx.side; side.replaceChildren();
    const sl = sliders(ctx, side);
    const presets = el("div", "cl-presets"); presets.appendChild(el("span", "cl-lab", "Mixture · मिश्रण"));
    MIXTURE_TYPES.forEach((m, i) => {
      actionButton(presets, m.name.split(" ")[0], () => { ctx.set("mix", i); sfx.play("pop"); sl.sync(); sync(); }, "cl-chipb");
    });
    side.insertBefore(presets, sl.root.nextSibling);
    const facts = factsView(ctx, side);
    note(side, "Only Colloids (1–1000 nm) and Suspensions (>1000 nm) scatter light (Tyndall Effect). True Solutions (<1 nm) look completely clear! T(K) = T(°C) + 273.15.", "केवल कोलॉइड और निलंबन टिंडल प्रभाव दिखाते हैं। वास्तविक विलयन (<1 nm) में प्रकाश किरण नहीं चमकती।");

    const off = bus.on("sim:change", e => {
      if (e.labId !== "matter") return;
      sync(); facts.update(); sl.sync();
    });
    sync();
    if (ctx.preset?.sub === "evap") { h1.textContent = "Evaporation (Surface) vs Boiling (Bulk)"; h2.textContent = "Higher T, wind & surface area speed up evaporation!"; }
    if (ctx.preset?.sub === "conc") { h1.textContent = `Mass % = (${ctx.vars.conc} / ${100 + ctx.vars.conc}) × 100`; h2.textContent = "Solute + Solvent = Solution"; }
    facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ mix: seen(q, "mix"), temp: seen(q, "temp"), conc: seen(q, "conc") });
    {
      const x = { mix: 2, temp: 25, conc: 20 };
      const c = ["Colloid (like milk) — 1 to 1000 nm", "कोलॉइड (जैसे दूध) — 1 से 1000 nm"];
      const pool = [["True solution (salt water) — < 1 nm", "वास्तविक विलयन — < 1 nm"], ["Pure distilled water", "शुद्ध आसुत जल"], ["Sugar dissolved in water", "पानी में घुली चीनी"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "mat-tyndall", prompt: ["Which stable mixture scatters a beam of light visibly (Tyndall Effect) without settling down?", "कौन-सा स्थायी मिश्रण बिना नीचे बैठे प्रकाश किरण को फैलाता (टिंडल प्रभाव) है?"],
        image: { vars: x, focus: "blind" }, options: d.options, correct: d.correct,
        why: ["Colloidal particles (1–1000 nm) are large enough to scatter light yet small enough never to settle on standing.", "कोलॉइड कण (1–1000 nm) प्रकाश को प्रकीर्णित करते हैं और स्थिर रहते हैं।"]
      }));
    }
    {
      const x = { mix: 1, temp: 25, conc: 20 };
      const c = ["True Solution — particles < 1 nm", "वास्तविक विलयन — कण < 1 nm"];
      const pool = [["Suspension — particles > 1000 nm", "निलंबन — कण > 1000 nm"], ["Colloid — 1 to 1000 nm", "कोलॉइड — 1 से 1000 nm"], ["Emulsion — > 5000 nm", "पायस — > 5000 nm"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "mat-true", prompt: ["Why does salt water NOT show the Tyndall effect when a torch shines through it?", "नमक के पानी में टॉर्च की किरण डालने पर टिंडल प्रभाव क्यों नहीं दिखता?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Solute particles in a true solution are smaller than 1 nm and cannot scatter visible light.", "वास्तविक विलयन के कण 1 nm से छोटे होने के कारण प्रकाश नहीं फैला पाते।"]
      }));
    }
    {
      const x = { mix: 3, temp: 25, conc: 20 };
      const c = ["Suspension (chalk powder in water)", "निलंबन (पानी में चॉक चूर्ण)"];
      const pool = [["True solution (sugar in water)", "वास्तविक विलयन (चीनी व जल)"], ["Colloid (fog or milk)", "कोलॉइड (कोहरा या दूध)"], ["Pure brass alloy", "शुद्ध पीतल मिश्रधातु"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "mat-filter", prompt: ["Which mixture can be separated completely using ordinary filter paper and settles when left undisturbed?", "कौन-सा मिश्रण साधारण छन्नक पत्र (filter paper) से अलग हो जाता है व शांत रखने पर बैठ जाता है?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Suspensions have particles >1000 nm that are trapped by filter paper and settle under gravity.", "निलंबन के कण (>1000 nm) छन्नक पत्र पर रुक जाते हैं व गुरुत्व से नीचे बैठते हैं।"]
      }));
    }
    {
      const x = v(), M = view(x), P = p => [`${p}%`, `${p}%`];
      const c = P(M.massPct);
      const d = withDistractors(c, [P(M.conc), P(+(M.conc / 2).toFixed(1)), P(+(M.massPct + 10).toFixed(1))], 3, q.rnd);
      out.push(ask({
        id: "mat-conc", prompt: [`${M.conc} g of salt is dissolved in 100 g of water (total ${100 + M.conc} g solution). What is the mass-by-mass percentage?`, `${M.conc} g नमक को 100 g जल में घोला गया है। विलयन की द्रव्यमान प्रतिशत सांद्रता कितनी होगी?`],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: [`Mass % = (${M.conc} / ${100 + M.conc}) × 100 = ${M.massPct}%.`, `द्रव्यमान % = (${M.conc} / ${100 + M.conc}) × 100 = ${M.massPct}%।`]
      }));
    }
    {
      const x = { mix: 2, temp: 100, conc: 20 };
      const c = ["373.15 K (boiling point of water)", "373.15 K (जल का क्वथनांक)"];
      const pool = [["273.15 K", "273.15 K"], ["100 K", "100 K"], ["173.15 K", "173.15 K"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "mat-kelvin", prompt: ["What is 100 °C expressed on the Kelvin temperature scale?", "100 °C को केल्विन (Kelvin) पैमाने पर कैसे लिखा जाता है?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["T(K) = T(°C) + 273.15 = 100 + 273.15 = 373.15 K.", "T(K) = T(°C) + 273.15 = 373.15 K।"]
      }));
    }
    {
      const x = { mix: 2, temp: 25, conc: 20 };
      const c = ["Centrifugation (spinning rapidly)", "अपकेंद्रण (तेज़ी से घुमाना)"];
      const pool = [["Ordinary filter paper filtration", "साधारण छन्नक पत्र"], ["Hand-picking with tweezers", "हाथ से चुनना"], ["Simple magnet separation", "चुंबक द्वारा पृथक्करण"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "mat-predict", kind: "predict", prompt: ["Milk is a colloid whose fat droplets pass right through filter paper. Which technique separates cream from milk?", "दूध एक कोलॉइड है जिसकी वसा छन्नक पत्र से निकल जाती है। दूध से क्रीम कैसे अलग करेंगे?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Centrifugation spins the colloid rapidly so denser particles stay outward and lighter cream collects near the centre.", "अपकेंद्रण (Centrifugation) द्वारा तेज़ घुमाने पर हल्की क्रीम अलग हो जाती है।"]
      }));
    }
    return out;
  }
};
