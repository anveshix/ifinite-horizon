/* Curiosity Lab · Earth & Breeze Fluid Lab (NCERT Class IX Ch 8 Earth Systems, Breeze & Cycles).
   Watch real circulating thermal convection currents reverse between Day Sea Breeze and Night Land Breeze,
   test CO₂ Greenhouse trapping, inspect the EM Spectrum, and trace Carbon/Nitrogen/Water cycles! */
import { bus } from "../core.js";
import { CLIMATE_MODES, climateModel } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const view = v => climateModel({ mode: v.mode, sun: v.sun, co2: v.co2 });

function snapshot(canvas, vars, focus) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#0a1728"), C = view(vars);
  C2.text(g, focus === "blind" ? "Coastal Breeze & Earth Systems" : `${C.name} · Land ${C.landTemp}°C vs Sea ${C.seaTemp}°C`, 360, 22, { size: 15, color: "#93c5fd" });
  /* Land on left, Sea on right */
  C2.rect(g, 55, 225, 300, 75, { stroke: "#d97706", fill: "rgba(180,83,9,0.45)", lw: 2, r: 8 });
  C2.text(g, `Land (${C.landTemp} °C)`, 205, 262, { size: 14, color: "#fde68a" });
  C2.rect(g, 365, 225, 300, 75, { stroke: "#38bdf8", fill: "rgba(14,165,233,0.42)", lw: 2, r: 8 });
  C2.text(g, `Sea (${C.seaTemp} °C)`, 515, 262, { size: 14, color: "#bae6fd" });

  const seaBreeze = C.landTemp >= C.seaTemp;
  if (seaBreeze) {
    C2.arrow(g, 490, 195, 220, 195, "#38bdf8", 4, 12);
    C2.arrow(g, 205, 190, 205, 95, "#fb923c", 4, 12);
    C2.arrow(g, 220, 90, 490, 90, "#facc15", 3, 10);
    C2.text(g, "Daytime SEA BREEZE (Cool air Sea → Land)", 360, 56, { size: 13, color: "#4ade80" });
  } else {
    C2.arrow(g, 220, 195, 490, 195, "#38bdf8", 4, 12);
    C2.arrow(g, 515, 190, 515, 95, "#fb923c", 4, 12);
    C2.arrow(g, 490, 90, 220, 90, "#facc15", 3, 10);
    C2.text(g, "Nighttime LAND BREEZE (Cool air Land → Sea)", 360, 56, { size: 13, color: "#7dd3fc" });
  }
  C2.text(g, `CO₂ = ${C.co2} ppm · ${C.summary}`, 360, 320, { size: 12, color: "#cbd5e1" });
  return canvas;
}

export default {
  id: "climate", cls: 9, unit: "ix/ix8", icon: "🌬️",
  title: { en: "Earth & Breeze Fluid Lab — Convection & Cycles", hi: "पृथ्वी व समीर तरल प्रयोगशाला — संवहन व चक्र" },
  blurb: { en: "Watch warm/cool fluid convection streams reverse between Day Sea Breeze and Night Land Breeze, test CO₂ Greenhouse warming, and explore Earth cycles!", hi: "दिन की समुद्री समीर व रात की स्थलीय समीर में संवहन धाराएँ, CO₂ ग्रीनहाउस प्रभाव, EM स्पेक्ट्रम व नाइट्रोजन/कार्बन चक्र देखो!" },
  vars: [
    { id: "mode", label: { en: "Module (0 Breeze · 1 Greenhouse · 2 Spectrum · 3 Cycles)", hi: "मोड (0 समीर · 1 ग्रीनहाउस · 2 स्पेक्ट्रम · 3 चक्र)" }, unit: "", min: 0, max: 3, step: 1, value: 0 },
    { id: "sun", label: { en: "Solar heating (0=Night, 100=Noon)", hi: "सौर ऊष्मा (0=रात, 100=दोपहर)" }, unit: "%", min: 0, max: 100, step: 5, value: 75 },
    { id: "co2", label: { en: "Atmospheric CO₂ concentration", hi: "वायुमंडलीय CO₂ स्तर" }, unit: " ppm", min: 280, max: 800, step: 20, value: 420 }
  ],
  facts(v) {
    const C = view(v);
    return [
      { id: "mod", en: "Earth system module", hi: "पृथ्वी तंत्र भाग", value: `${C.name} (${C.hi})` },
      { id: "temp", en: "Surface temperatures", hi: "सतह का तापमान", value: `Land ${C.landTemp}°C vs Sea ${C.seaTemp}°C` },
      { id: "brz", en: "Convection wind direction", hi: "संवहन पवन दिशा", value: C.breezeDir },
      { id: "sum", en: "Science summary", hi: "वैज्ञानिक सारांश", value: C.summary }
    ];
  },
  snapshot,
  missions: [
    { id: "cli-sea", en: "Set Solar heating ≥ 75% to drive a strong Daytime Sea Breeze!", hi: "सौर ऊष्मा ≥ 75% कर दिन की तेज़ समुद्री समीर चलाओ!", check: v => v.mode === 0 && v.sun >= 75 },
    { id: "cli-land", en: "Drop Solar heating to 0% (Night) to reverse into a Land Breeze!", hi: "सौर ऊष्मा 0% (रात) कर स्थलीय समीर की दिशा उलटो!", check: v => v.mode === 0 && v.sun === 0 },
    { id: "cli-gh", en: "Raise CO₂ ≥ 660 ppm in Greenhouse mode to observe infrared trapping!", hi: "ग्रीनहाउस मोड में CO₂ ≥ 660 ppm कर ऊष्मा अवरोधन देखो!", check: v => v.co2 >= 660 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 2.2, 8.6], target: [0, 0.3, 0], bg: 0x0a1728, minDist: 4, maxDist: 16 });
    const { scene } = st;
    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    const h1 = el("span"), h2 = el("span"); hud.append(h1, h2);

    /* Mode 0: Coastal terrain: Land (left) & Ocean (right) + Sun + Greenhouse dome */
    const breezeGrp = new THREE.Group(); scene.add(breezeGrp);
    const land = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.6, 3.2), new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.85 }));
    land.position.set(-2.0, -1.4, 0); breezeGrp.add(land);
    const sea = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.5, 3.2), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.25 }));
    sea.position.set(2.0, -1.45, 0); breezeGrp.add(sea);
    const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 16), new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfacc15, emissiveIntensity: 0.9 }));
    sunMesh.position.set(-3.0, 2.4, -1.0); breezeGrp.add(sunMesh);

    const ghMat = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.12, side: THREE.DoubleSide });
    const ghLayer = new THREE.Mesh(new THREE.PlaneGeometry(8.2, 0.25), ghMat);
    ghLayer.rotation.x = Math.PI / 2; ghLayer.position.set(0, 1.9, 0); breezeGrp.add(ghLayer);

    /* Fluid convection particles (circulate clockwise in Sea Breeze, counter-clockwise in Land Breeze) */
    const particles = [];
    for (let i = 0; i < 40; i++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      breezeGrp.add(m);
      particles.push({ m, u: i / 40, z: ((i % 5) - 2) * 0.45 });
    }

    /* Mode 1: Atmospheric Spheres + Ozone Shield + Trapped IR Rays */
    const sphereGrp = new THREE.Group(); sphereGrp.visible = false; scene.add(sphereGrp);
    const earthCore = new THREE.Mesh(new THREE.SphereGeometry(1.15, 24, 18), new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.5 }));
    sphereGrp.add(earthCore);
    [
      [1.55, 0x38bdf8, 0.18, "Troposphere (Weather)"],
      [1.95, 0x22c55e, 0.22, "Stratosphere (Ozone O₃)"],
      [2.45, 0xa855f7, 0.14, "Mesosphere / Thermosphere"]
    ].forEach(([rad, col, op, txt], idx) => {
      const sh = new THREE.Mesh(new THREE.SphereGeometry(rad, 24, 18), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, wireframe: idx === 2 }));
      sphereGrp.add(sh);
      const lb = labelSprite(THREE, txt, "", { scale: 0.65, size: 20, color: "#e2e8f0" });
      lb.position.set(rad + 1.15, (idx - 1) * 0.9, 0); sphereGrp.add(lb);
    });

    /* Mode 2: 7-Band Electromagnetic Spectrum Waves (Gamma -> Radio) */
    const specGrp = new THREE.Group(); specGrp.visible = false; scene.add(specGrp);
    const specBands = [
      ["Gamma", 0xc084fc, 16], ["X-Ray", 0x818cf8, 12], ["UV", 0x6366f1, 9],
      ["Visible", 0x22c55e, 6.5], ["Infrared", 0xf97316, 4.2], ["Microwave", 0xef4444, 2.5], ["Radio", 0xfacc15, 1.4]
    ];
    const specCurves = [];
    specBands.forEach(([nm, col, freq], idx) => {
      const y = 1.65 - idx * 0.55, pts = [];
      for (let i = 0; i <= 48; i++) pts.push(new THREE.Vector3(-3.0 + (i / 48) * 6.0, y + Math.sin((i / 48) * Math.PI * freq) * 0.18, 0));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: col }));
      specGrp.add(line); specCurves.push({ geo, y, freq });
      const lb = labelSprite(THREE, nm, "", { scale: 0.58, size: 20, color: "#f8fafc" });
      lb.position.set(-3.75, y, 0); specGrp.add(lb);
    });

    /* Mode 3: Biogeochemical Nitrogen & Carbon Cycle Ring */
    const cycleGrp = new THREE.Group(); cycleGrp.visible = false; scene.add(cycleGrp);
    const cRing = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.05, 10, 48), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    cycleGrp.add(cRing);
    const cycleNodes = [
      [0, 1.9, 0x38bdf8, "Atmosphere (78% N₂ / CO₂)"],
      [1.9, 0, 0x22c55e, "Rhizobium Fixation → Nitrates"],
      [0, -1.9, 0xfacc15, "Plants & Consumers"],
      [-1.9, 0, 0xf97316, "Decomposers & Denitrification"]
    ];
    const cycleTokens = [];
    cycleNodes.forEach(([nx, ny, col, txt], idx) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12), new THREE.MeshStandardMaterial({ color: col }));
      m.position.set(nx, ny, 0); cycleGrp.add(m);
      const lb = labelSprite(THREE, txt, "", { scale: 0.65, size: 20, color: "#fef08a" });
      lb.position.set(nx * 1.48, ny * 1.32, 0); cycleGrp.add(lb);
      const tok = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      cycleGrp.add(tok); cycleTokens.push({ m: tok, a: (idx / 4) * Math.PI * 2 });
    });

    let tag = null, t = 0;
    const sync = () => {
      const C = view(ctx.vars);
      breezeGrp.visible = ctx.vars.mode === 0;
      sphereGrp.visible = ctx.vars.mode === 1;
      specGrp.visible = ctx.vars.mode === 2;
      cycleGrp.visible = ctx.vars.mode === 3;
      sunMesh.visible = C.sun > 10;
      sunMesh.scale.setScalar(0.5 + (C.sun / 100) * 0.7);
      ghMat.opacity = 0.08 + ((C.co2 - 280) / 520) * 0.48;
      if (tag) scene.remove(tag);
      tag = labelSprite(THREE, C.breezeDir, `Land ${C.landTemp}°C · Sea ${C.seaTemp}°C`, { scale: 0.84, size: 22, color: "#fef08a" });
      tag.position.set(0, 2.55, 0); scene.add(tag);
      h1.textContent = `${C.name} · Land ${C.landTemp}°C / Sea ${C.seaTemp}°C`;
      h2.textContent = C.breezeDir;
    };

    const stopFrame = st.onFrame(dt => {
      const C = view(ctx.vars);
      const seaBreeze = C.landTemp >= C.seaTemp;
      const spd = (0.18 + Math.abs(C.landTemp - C.seaTemp) * 0.025) * (seaBreeze ? 1 : -1);
      t += dt;
      if (ctx.vars.mode === 1) { sphereGrp.rotation.y += dt * 0.35; return; }
      if (ctx.vars.mode === 2) {
        specCurves.forEach(c => {
          const pos = c.geo.attributes.position;
          for (let i = 0; i < pos.count; i++) pos.setY(i, c.y + Math.sin((i / 48) * Math.PI * c.freq - t * 4.5) * 0.18);
          pos.needsUpdate = true;
        });
        return;
      }
      if (ctx.vars.mode === 3) {
        cycleTokens.forEach(tk => { tk.a += dt * 0.9; tk.m.position.set(Math.cos(tk.a) * 1.9, Math.sin(tk.a) * 1.9, 0); });
        return;
      }
      particles.forEach(p => {
        p.u = ((p.u + dt * spd) % 1 + 1) % 1;
        /* rectangular convection loop: x in [-2.6, 2.6], y in [-0.7, 1.5] */
        let x, y, warm;
        if (p.u < 0.25) {
          const k = p.u / 0.25; x = 2.6 - k * 5.2; y = -0.7; warm = !seaBreeze;
        } else if (p.u < 0.5) {
          const k = (p.u - 0.25) / 0.25; x = -2.6; y = -0.7 + k * 2.2; warm = seaBreeze;
        } else if (p.u < 0.75) {
          const k = (p.u - 0.5) / 0.25; x = -2.6 + k * 5.2; y = 1.5; warm = seaBreeze;
        } else {
          const k = (p.u - 0.75) / 0.25; x = 2.6; y = 1.5 - k * 2.2; warm = !seaBreeze;
        }
        p.m.position.set(x, y + Math.sin(t * 2 + p.z) * 0.08, p.z);
        p.m.material.color.setHex(warm ? 0xf97316 : 0x38bdf8);
      });
    });

    const side = ctx.side; side.replaceChildren();
    const sl = sliders(ctx, side);
    const presets = el("div", "cl-presets"); presets.appendChild(el("span", "cl-lab", "Module · भाग"));
    CLIMATE_MODES.forEach((m, i) => {
      actionButton(presets, m.name.split(" ")[0], () => { ctx.set("mode", i); sfx.play("pop"); sl.sync(); sync(); }, "cl-chipb");
    });
    side.insertBefore(presets, sl.root.nextSibling);
    const facts = factsView(ctx, side);
    note(side, "Land has lower specific heat than water, so by day it heats up fast: warm air rises over land and cool sea air rushes in (Sea Breeze). At night land cools faster, reversing to Land Breeze!", "स्थल की विशिष्ट ऊष्मा जल से कम होने के कारण दिन में धरती जल्दी गरम होती है व हवा ऊपर उठती है — जिससे समुद्र से ठंडी हवा (समुद्री समीर) चलती है।");

    const off = bus.on("sim:change", e => { if (e.labId !== "climate") return; sync(); facts.update(); sl.sync(); });
    sync(); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ mode: seen(q, "mode"), sun: seen(q, "sun"), co2: seen(q, "co2") });
    {
      const x = { mode: 0, sun: 85, co2: 400 };
      const c = ["Land heats faster than water → warm air rises over land → cool air flows Sea → Land", "स्थल जल्दी गरम होता है → गरम हवा ऊपर उठती है → ठंडी हवा समुद्र से स्थल की ओर बहती है"];
      const pool = [["Sea boils faster than sand", "समुद्र जल्दी गरम होता है"], ["Gravity pulls wind only toward oceans", "गुरुत्व हवा को समुद्र खींचता है"], ["Earth stops spinning at noon", "दोपहर को पृथ्वी रुकती है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "cli-seabreeze", prompt: ["Why does a cool Sea Breeze blow toward coastal land during a sunny afternoon?", "धूप वाले दिन तटीय क्षेत्र में समुद्र से स्थल की ओर ठंडी समीर क्यों चलती है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Land warms faster than ocean water, creating low pressure over land that draws cooler marine air inland.", "स्थल जल्दी गरम होकर निम्न दाब बनाता है, जिससे समुद्र की ठंडी हवा स्थल की ओर आती है।"] }));
    }
    {
      const x = { mode: 1, sun: 75, co2: 700 };
      const c = ["CO₂, Methane (CH₄) & Water vapour trap outgoing infrared heat", "CO₂, मीथेन (CH₄) व जलवाष्प बाहर जाती अवरक्त ऊष्मा को रोकती हैं"];
      const pool = [["Nitrogen (N₂) blocks all visible sunlight", "नाइट्रोजन सूर्य प्रकाश रोकती है"], ["Argon freezes clouds into snow", "आर्गन बादल जमाता है"], ["Oxygen reflects radio waves back to space", "ऑक्सीजन रेडियो तरंगें रोकती है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "cli-greenhouse", prompt: ["Which greenhouse gases cause atmospheric warming and how?", "कौन-सी ग्रीनहाउस गैसें वायुमंडलीय तापन करती हैं और कैसे?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Greenhouse gases let incoming sunlight in but absorb and re-radiate outgoing long-wave infrared heat.", "ग्रीनहाउस गैसें अवरक्त (IR) ऊष्मा को अवशोषित कर पृथ्वी को गरम रखती हैं।"] }));
    }
    {
      const x = { mode: 2, sun: 70, co2: 400 };
      const c = ["Gamma < X-ray < UV < Visible < Infrared < Radio (increasing wavelength)", "गामा < एक्स-रे < पराबैंगनी < दृश्य < अवरक्त < रेडियो (बढ़ती तरंगदैर्ध्य)"];
      const pool = [["Radio < Infrared < Visible < Gamma", "रेडियो < अवरक्त < दृश्य < गामा"], ["Visible < Gamma < UV < X-ray", "दृश्य < गामा < UV < एक्स-रे"], ["All electromagnetic waves have identical wavelength", "सभी की तरंगदैर्ध्य समान है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "cli-spectrum", prompt: ["Which order arranges the Electromagnetic Spectrum from SHORTEST to LONGEST wavelength?", "विद्युत-चुंबकीय स्पेक्ट्रम का सबसे छोटी से सबसे बड़ी तरंगदैर्ध्य का सही क्रम क्या है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["High-energy Gamma/X-rays have the shortest wavelengths; Radio waves have the longest.", "गामा किरणों की तरंगदैर्ध्य सबसे कम और रेडियो तरंगों की सबसे अधिक होती है।"] }));
    }
    {
      const x = { mode: 3, sun: 60, co2: 400 };
      const c = ["Rhizobium bacteria in legume root nodules fix atmospheric N₂ into usable nitrates", "राइज़ोबियम जीवाणु फलीदार जड़ों में वायुमंडलीय N₂ को नाइट्रेट में स्थिर करते हैं"];
      const pool = [["Plants breathe N₂ directly through stomata as food", "पौधे सीधे N₂ पत्तियों से सोखते हैं"], ["Water freezes N₂ into sugar", "जल N₂ को शर्करा बनाता है"], ["Ozone converts oxygen into nitrogen", "ओज़ोन नाइट्रोजन बनाता है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "cli-nitrogen", prompt: ["How does atmospheric Nitrogen (78% N₂) enter living organisms in the Nitrogen Cycle?", "नाइट्रोजन चक्र में वायुमंडलीय नाइट्रोजन (N₂) सजीवों में कैसे प्रवेश करती है?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Nitrogen-fixing bacteria (like Rhizobium) and lightning convert inert N₂ gas into soluble nitrates/ammonium absorbed by plants.", "राइज़ोबियम जैसे जीवाणु और तड़ित N₂ को नाइट्रेट यौगिकों में बदलते हैं जिन्हें पौधे सोखते हैं।"] }));
    }
    {
      const x = { mode: 1, sun: 60, co2: 400 };
      const c = ["Troposphere (weather) & Stratosphere (protective Ozone O₃ layer)", "क्षोभमंडल (मौसम) व समतापमंडल (ओज़ोन O₃ परत)"];
      const pool = [["Exosphere (all rain clouds)", "बहिर्मंडल (वर्षा बादल)"], ["Mesosphere (ocean tides)", "मध्यमंडल (समुद्री ज्वार)"], ["Core of the Earth", "पृथ्वी का क्रोड"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "cli-spheres", prompt: ["Which two atmospheric layers hold Earth's weather clouds and the protective Ozone (O₃) shield?", "पृथ्वी के मौसम और रक्षक ओज़ोन (O₃) परत वायुमंडल की किन दो परतों में होते हैं?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Clouds and weather occur in the lowest Troposphere, while the Ozone layer sits above it in the Stratosphere.", "मौसम क्षोभमंडल में और ओज़ोन परत समतापमंडल में स्थित होती है।"] }));
    }
    {
      const x = v();
      const c = ["Cool air blows from Land toward the warmer Sea (Land Breeze)", "ठंडी हवा स्थल से गरम समुद्र की ओर बहती है (स्थलीय समीर)"];
      const pool = [["Sea Breeze strengthens at midnight", "समुद्री समीर रात को तेज़ होती है"], ["Ocean freezes solid every night", "समुद्र हर रात जम जाता है"], ["Wind stops everywhere on Earth", "हवा पूरी तरह रुक जाती है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({ id: "cli-predict", kind: "predict", prompt: ["After sunset, coastal land cools rapidly while the ocean stays warmer. What happens to the local wind?", "सूर्यास्त के बाद स्थल जल्दी ठंडा हो जाता है जबकि समुद्र गरम रहता है। स्थानीय हवा किस दिशा में बहेगी?"], image: { vars: x }, options: d.options, correct: d.correct, why: ["Warm air rises over the warmer sea at night, drawing cooler air from land toward sea (Land Breeze).", "रात को गरम समुद्र के ऊपर हवा उठती है और स्थल से समुद्र की ओर स्थलीय समीर चलती है।"] }));
    }
    return out;
  }
};
