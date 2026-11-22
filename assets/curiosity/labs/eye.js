/* Curiosity Lab · Eye & Prism Lab (NCERT Class X, Ch 10 The Human Eye and the Colourful World).
   Switch between Normal, Myopia, and Hypermetropia, dial corrective lens power P (D) to bring rays sharply onto the retina,
   and switch to Prism mode to watch white light split into VIBGYOR! */
import { bus } from "../core.js";
import { EYE_DEFECTS, eyeModel, fmt } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const view = v => eyeModel({ defect: v.defect, P: v.P, viewMode: v.viewMode });

function snapshot(canvas, vars, focus) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#0b1424"), E = view(vars);
  if (E.viewMode === 1 || focus === "prism") {
    C2.text(g, "Dispersion of White Light through a Glass Prism (VIBGYOR)", 360, 24, { size: 15, color: "#93c5fd" });
    /* prism triangle */
    g.save(); g.strokeStyle = "#7dd3fc"; g.fillStyle = "rgba(125,211,252,0.16)"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(320, 75); g.lineTo(220, 265); g.lineTo(420, 265); g.closePath(); g.fill(); g.stroke(); g.restore();
    C2.line(g, [[55, 195], [272, 168]], "#ffffff", 4);
    C2.text(g, "White light", 130, 152, { size: 13, color: "#fff" });
    const cols = [["#ef4444", "Red (least bent)"], ["#f97316", ""], ["#eab308", ""], ["#22c55e", "Green"], ["#3b82f6", ""], ["#6366f1", ""], ["#a855f7", "Violet (most bent)"]];
    cols.forEach(([col, lbl], idx) => {
      const yIn = 166 + idx * 1.8, yOut = 152 + idx * 16;
      C2.line(g, [[272, 168], [362 + idx * 3, yIn], [600, yOut]], col, 3);
      if (lbl) C2.text(g, lbl, 610, yOut, { size: 12, color: col, align: "left" });
    });
    return canvas;
  }

  C2.text(g, `${E.defectName} · Spectacle Lens P = ${E.P >= 0 ? "+" : ""}${fmt(E.P, 1)} D · ${E.focusWhere}`, 360, 24, { size: 14, color: E.sharp ? "#46e08a" : "#ffd23f" });
  /* eyeball */
  const ex = 435, ey = 178, er = 104;
  C2.circle(g, ex, ey, er, { stroke: "#cbd5e1", fill: "rgba(56,189,248,0.1)", w: 3 });
  /* retina highlight arc on back */
  g.save(); g.strokeStyle = E.sharp ? "#46e08a" : "#fb7185"; g.lineWidth = 6;
  g.beginPath(); g.arc(ex, ey, er - 2, -0.7, 0.7); g.stroke(); g.restore();
  C2.text(g, "Retina", ex + er + 36, ey, { size: 13, color: E.sharp ? "#46e08a" : "#fda4af" });
  /* eye lens */
  C2.rect(g, ex - er + 14, ey - 32, 14, 64, { stroke: "#38bdf8", fill: "rgba(56,189,248,0.4)", lw: 2, r: 7 });
  /* corrective lens if P !== 0 */
  if (Math.abs(E.P) > 0.1) {
    C2.rect(g, 250, ey - 46, 12, 92, { stroke: E.P < 0 ? "#facc15" : "#46e08a", fill: "rgba(250,204,21,0.22)", lw: 2.5, r: 5 });
    C2.text(g, `${E.P < 0 ? "Concave" : "Convex"} ${fmt(E.P, 1)} D`, 256, ey - 62, { size: 12, color: "#fef08a" });
  }
  const fx = ex + er - E.err * 24;
  [-32, 0, 32].forEach(dy => {
    C2.line(g, [[60, ey + dy], [256, ey + dy], [ex - er + 20, ey + dy * (1 - E.P * 0.06)], [fx, ey]], "#ffd23f", 2.5);
  });
  C2.circle(g, fx, ey, 6, { stroke: "#fff", fill: E.sharp ? "#46e08a" : "#ef4444", w: 1.5 });
  return canvas;
}

export default {
  id: "eye", cls: 10, unit: "x/ch10", icon: "👁️",
  title: { en: "Eye & Prism Lab — vision & rainbow", hi: "नेत्र व प्रिज्म प्रयोगशाला" },
  blurb: { en: "Fix Myopia and Hypermetropia by choosing the right spectacle power P, or split white light into VIBGYOR with a prism!", hi: "निकट व दूर दृष्टि दोष को सही चश्मे की क्षमता P से ठीक करो, या प्रिज्म से इंद्रधनुषी स्पेक्ट्रम देखो!" },
  vars: [
    { id: "defect", label: { en: "Eye condition (−1 Myopia · 0 Normal · +1 Hypermetropia)", hi: "नेत्र स्थिति (−1 निकट · 0 सामान्य · +1 दूर)" }, unit: "", min: -1, max: 1, step: 1, value: -1 },
    { id: "P", label: { en: "Spectacle lens power P", hi: "चश्मे के लेंस की क्षमता P" }, unit: "D", min: -4, max: 4, step: 0.5, value: 0 },
    { id: "viewMode", label: { en: "Mode (0 Eye Focus · 1 Prism VIBGYOR)", hi: "मोड (0 नेत्र · 1 प्रिज्म)" }, unit: "", min: 0, max: 1, step: 1, value: 0 }
  ],
  facts(v) {
    const E = view(v);
    return [
      { id: "def", en: "Eye condition", hi: "नेत्र स्थिति", value: `${E.defectName} · ${E.defectHi}` },
      { id: "foc", en: "Image focus point", hi: "प्रतिबिंब फोकस बिंदु", value: `${E.focusWhere} · ${E.focusHi}` },
      { id: "fix", en: "Prescribed correction", hi: "उपयुक्त लेंस", value: `${E.fix} (${E.reqP >= 0 ? "+" : ""}${fmt(E.reqP, 1)} D)` },
      { id: "disp", en: "Prism dispersion order", hi: "प्रिज्म वर्ण-विक्षेपण", value: "Red bends least (~36°) → Violet bends most (~44°)" }
    ];
  },
  snapshot,
  missions: [
    { id: "eye-myopia", en: "Cure Myopia: bring rays sharply onto the retina (P = −2.0 D)", hi: "निकट-दृष्टि दोष ठीक करो (P = −2.0 D से रेटिना पर फोकस)", check: v => v.defect === -1 && view(v).sharp },
    { id: "eye-hyper", en: "Cure Hypermetropia with a converging Convex lens (P = +2.0 D)", hi: "उत्तल लेंस (P = +2.0 D) से दूर-दृष्टि दोष ठीक करो", check: v => v.defect === 1 && view(v).sharp },
    { id: "eye-prism", en: "Switch to Prism mode to split white light into VIBGYOR", hi: "प्रिज्म मोड में श्वेत प्रकाश को 7 रंगों में विभक्त देखो", check: v => v.viewMode === 1 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 2.2, 9.2], target: [0, 0.2, 0], bg: 0x0b1424, minDist: 4.5, maxDist: 18 });
    const { scene } = st, dyn = new THREE.Group(); scene.add(dyn);
    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    const h1 = el("span"), h2 = el("span"); hud.append(h1, h2);

    let skyMode = ctx.preset?.sub === "sky";
    const rebuild = () => {
      while (dyn.children.length) {
        const c = dyn.children.pop();
        c.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); }); });
      }
      const E = view(ctx.vars);
      if (skyMode) {
        /* Rayleigh Scattering / Blue Sky & Red Sunset (x/ch10) */
        const sun = new THREE.Mesh(new THREE.SphereGeometry(0.65, 24, 18), new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfacc15, emissiveIntensity: 0.9 }));
        sun.position.set(-3.4, 0.2, 0); dyn.add(sun);
        const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.5, 24, 18), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.25 }));
        atmo.position.set(0, 0.2, 0); dyn.add(atmo);
        const redRay = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 6.2, 10), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        redRay.rotation.z = Math.PI / 2; redRay.position.set(0, 0.2, 0); dyn.add(redRay);
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          const bRay = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 8), new THREE.MeshBasicMaterial({ color: 0x60a5fa }));
          bRay.position.set(Math.cos(a) * 1.1, 0.2 + Math.sin(a) * 1.1, 0); bRay.rotation.z = a + Math.PI / 2;
          dyn.add(bRay);
        }
        const lbl = labelSprite(THREE, "Rayleigh Scattering (λ⁻⁴)", "Blue scatters sideways · Red reaches sunset", { scale: 0.85, size: 22, color: "#93c5fd" });
        lbl.position.set(0, 2.35, 0); dyn.add(lbl);
        h1.textContent = "Sky Scattering · λ⁻⁴ Rayleigh Law";
        h2.textContent = "Blue scattered (sky) · Red straight (sunset)";
        return;
      }
      if (E.viewMode === 1) {
        const pGeo = new THREE.CylinderGeometry(1.3, 1.3, 1.8, 3);
        const prism = new THREE.Mesh(pGeo, new THREE.MeshStandardMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.45, roughness: 0.1 }));
        prism.rotation.y = Math.PI / 6; dyn.add(prism);
        const beamIn = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 4.0, 10), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        beamIn.rotation.z = Math.PI / 2 - 0.12; beamIn.position.set(-2.5, 0.2, 0); dyn.add(beamIn);
        const vib = [0xef4444, 0xf97316, 0xeab308, 0x22c55e, 0x3b82f6, 0x6366f1, 0xa855f7];
        vib.forEach((col, i) => {
          const ray = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 4.4, 8), new THREE.MeshBasicMaterial({ color: col }));
          ray.rotation.z = Math.PI / 2 - (0.04 + i * 0.06);
          ray.position.set(2.4, 0.2 - i * 0.18, 0); dyn.add(ray);
        });
        h1.textContent = "Glass Prism · VIBGYOR Dispersion";
        h2.textContent = "Violet bends most (shortest λ)";
      } else {
        const globe = new THREE.Mesh(new THREE.SphereGeometry(1.75, 28, 22), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.22 }));
        globe.position.set(1.2, 0.1, 0); dyn.add(globe);
        const retina = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 12), new THREE.MeshStandardMaterial({ color: E.sharp ? 0x46e08a : 0xfb7185, emissive: E.sharp ? 0x16a34a : 0xe11d48, emissiveIntensity: 0.7 }));
        retina.scale.set(0.25, 1.5, 1.5); retina.position.set(2.85, 0.1, 0); dyn.add(retina);
        const eyeLens = new THREE.Mesh(new THREE.SphereGeometry(0.55, 18, 14), new THREE.MeshStandardMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.7 }));
        eyeLens.scale.set(0.35, 1.2, 1.2); eyeLens.position.set(-0.35, 0.1, 0); dyn.add(eyeLens);
        if (Math.abs(E.P) > 0.1) {
          const spec = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.12, 24), new THREE.MeshStandardMaterial({ color: E.P < 0 ? 0xfacc15 : 0x46e08a, transparent: true, opacity: 0.6 }));
          spec.rotation.z = Math.PI / 2; spec.position.set(-1.6, 0.1, 0); dyn.add(spec);
        }
        const fx = 2.85 - E.err * 0.55;
        const spot = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 12), new THREE.MeshBasicMaterial({ color: E.sharp ? 0x46e08a : 0xef4444 }));
        spot.position.set(fx, 0.1, 0); dyn.add(spot);
        [-0.55, 0, 0.55].forEach(dy => {
          const r = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 3.6 + (fx - 0.5), 8), new THREE.MeshBasicMaterial({ color: 0xffd23f }));
          r.rotation.z = Math.PI / 2 + Math.atan2(dy, fx + 0.35);
          r.position.set((fx - 3.0) / 2 + 1.0, 0.1 + dy * 0.45, 0); dyn.add(r);
        });
        const lbl = labelSprite(THREE, E.focusWhere, E.focusHi, { scale: 0.85, size: 24, color: E.sharp ? "#86efac" : "#fecaca" });
        lbl.position.set(1.2, 2.25, 0); dyn.add(lbl);
        h1.textContent = `${E.defectName} · P = ${E.P >= 0 ? "+" : ""}${fmt(E.P, 1)} D`;
        h2.textContent = E.focusWhere;
      }
    };

    const side = ctx.side; side.replaceChildren();
    const segD = el("div", "cl-seg"); segD.setAttribute("role", "group"); segD.setAttribute("aria-label", "Eye Condition");
    const dBtns = EYE_DEFECTS.map(d => {
      const b = el("button", "cl-opt" + (ctx.vars.defect === d.val ? " on" : ""), d.name.split(" ")[0]);
      b.type = "button";
      b.onclick = () => { ctx.set("defect", d.val); ctx.set("viewMode", 0); sfx.play("tick"); };
      segD.appendChild(b); return b;
    });
    side.appendChild(el("h3", "cl-h", "Eye Condition · नेत्र स्थिति")); side.appendChild(segD);

    const segM = el("div", "cl-seg");
    const mBtns = [["Eye Focus", 0], ["Prism VIBGYOR", 1]].map(([t, val]) => {
      const b = el("button", "cl-opt" + (ctx.vars.viewMode === val && !skyMode ? " on" : ""), t);
      b.type = "button"; b.onclick = () => { skyMode = false; ctx.set("viewMode", val); sfx.play("pop"); rebuild(); };
      segM.appendChild(b); return b;
    });
    const bSky = el("button", "cl-opt", "Blue Sky / Sunset"); bSky.type = "button";
    bSky.onclick = () => { skyMode = !skyMode; sfx.play("pop"); bSky.classList.toggle("on", skyMode); mBtns.forEach(x => x.classList.toggle("on", !skyMode && Number(x === mBtns[1]) === ctx.vars.viewMode)); rebuild(); };
    segM.appendChild(bSky);
    side.appendChild(el("h3", "cl-h", "Experiment Mode · प्रयोग मोड")); side.appendChild(segM);

    const sl = sliders(ctx, side, { skip: ["defect", "viewMode"] });
    const facts = factsView(ctx, side);
    note(side, "Myopia (image forms in front of retina) is corrected with a diverging Concave lens (−D). Hypermetropia (forms behind retina) needs a converging Convex lens (+D).", "निकट-दृष्टि दोष को अवतल (−D) लेंस और दूर-दृष्टि दोष को उत्तल (+D) लेंस से ठीक किया जाता है।");

    const off = bus.on("sim:change", e => {
      if (e.labId !== "eye") return;
      rebuild(); facts.update(); sl.sync();
      dBtns.forEach((b, i) => b.classList.toggle("on", EYE_DEFECTS[i].val === ctx.vars.defect));
      mBtns.forEach((b, i) => b.classList.toggle("on", i === ctx.vars.viewMode));
    });
    rebuild(); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ defect: seen(q, "defect"), P: seen(q, "P"), viewMode: seen(q, "viewMode") });
    {
      const x = { ...v(), defect: -1, P: 0, viewMode: 0 };
      const c = ["Concave (diverging) lens of negative power", "अवतल (अपसारी) लेंस, ऋणात्मक क्षमता"];
      const pool = [["Convex (converging) lens of positive power", "उत्तल (अभिसारी) लेंस, धनात्मक क्षमता"], ["Plane glass plate", "समतल काँच पट्टिका"], ["Triangular glass prism", "काँच का प्रिज्म"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "eye-myopia", prompt: ["In Myopia (nearsightedness), distant rays focus in front of the retina. Which lens restores sharp vision?", "निकट-दृष्टि दोष में दूर की किरणें रेटिना से पहले फोकस हो जाती हैं। इसे कौन-सा लेंस ठीक करता है?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["A concave lens diverges incoming parallel rays slightly before the eye lens so they converge back onto the retina.", "अवतल लेंस किरणों को थोड़ा अपसारित करके फोकस को वापस रेटिना पर पहुँचाता है।"]
      }));
    }
    {
      const x = { ...v(), defect: 1, P: 0, viewMode: 0 };
      const c = ["Convex (converging) lens (+D)", "उत्तल (अभिसारी) लेंस (+D)"];
      const pool = [["Concave (diverging) lens (−D)", "अवतल लेंस (−D)"], ["Opaque pinhole", "अपारदर्शी छिद्र"], ["Cylindrical mirror", "बेलनाकार दर्पण"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "eye-hyper", prompt: ["In Hypermetropia (farsightedness), nearby objects focus behind the retina. Which corrective lens is needed?", "दूर-दृष्टि दोष में पास की वस्तुएँ रेटिना के पीछे फोकस होती हैं। किस लेंस से सुधार होगा?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["A converging convex lens adds focusing power (+D) so rays meet earlier right on the retina.", "उत्तल लेंस अतिरिक्त अभिसारी क्षमता (+D) देकर किरणों को रेटिना पर केंद्रित करता है।"]
      }));
    }
    {
      const x = { ...v(), viewMode: 1 };
      const c = ["Violet bends the most; Red bends the least", "बैंगनी सबसे अधिक मुड़ता है; लाल सबसे कम"];
      const pool = [["Red bends the most; Violet bends the least", "लाल सबसे अधिक मुड़ता है; बैंगनी सबसे कम"], ["All seven colours bend equally", "सभी सात रंग बराबर मुड़ते हैं"], ["Green bends more than Violet", "हरा रंग बैंगनी से अधिक मुड़ता है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "eye-prism-order", prompt: ["White light enters a triangular glass prism and disperses into VIBGYOR. Which colour bends the most and the least?", "श्वेत प्रकाश प्रिज्म से गुजरकर VIBGYOR में बँटता है। कौन-सा रंग सबसे अधिक और सबसे कम मुड़ता है?"],
        image: { vars: x, focus: "prism" }, options: d.options, correct: d.correct,
        why: ["Shorter wavelength Violet light slows down more in glass (higher refractive index n) and deviates most; longer wavelength Red bends least.", "कम तरंगदैर्घ्य के कारण बैंगनी प्रकाश काँच में सबसे अधिक मुड़ता है और लाल सबसे कम।"]
      }));
    }
    {
      const x = { ...v(), defect: 0, P: 0, viewMode: 0 };
      const c = ["Ciliary muscles changing lens curvature (accommodation)", "पक्ष्माभी पेशियाँ लेंस की वक्रता बदलती हैं (समंजन क्षमता)"];
      const pool = [["Retina sliding forward and backward", "रेटिना का आगे-पीछे खिसकना"], ["Cornea changing colour", "कॉर्निया का रंग बदलना"], ["Optic nerve lengthening", "दृष्टि तंत्रिका का लंबा होना"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "eye-accom", prompt: ["How does a healthy human eye focus smoothly on both a book (25 cm) and distant stars?", "स्वस्थ मानव नेत्र पास की पुस्तक (25 cm) और दूर के तारों दोनों को साफ़ कैसे देख पाता है?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Ciliary muscles relax or contract to adjust the focal length of the flexible crystalline lens — called Power of Accommodation.", "पक्ष्माभी पेशियाँ क्रिस्टलीय लेंस की फोकस दूरी बदलती हैं — इसे नेत्र की समंजन क्षमता कहते हैं।"]
      }));
    }
    {
      const x = { ...v(), defect: 0, viewMode: 0 };
      const c = ["25 cm to infinity", "25 cm से अनंत तक"];
      const pool = [["0 cm to 10 m", "0 cm से 10 m तक"], ["1 m to 100 m", "1 m से 100 m तक"], ["2.5 cm to 25 cm", "2.5 cm से 25 cm तक"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "eye-range", prompt: ["What are the near point and far point of a normal young adult human eye?", "सामान्य वयस्क मानव नेत्र का निकट बिंदु और दूर बिंदु क्या है?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["The least distance of distinct vision is 25 cm, and the far point for a normal eye is infinity.", "सुस्पष्ट दर्शन की अल्पतम दूरी 25 cm तथा दूर बिंदु अनंत होता है।"]
      }));
    }
    {
      const x = { ...v(), defect: -1, P: 0, viewMode: 0 };
      const c = ["Focus shifts closer to the eye lens (even more blurry)", "फोकस लेंस के और पास खिसक जाता है (अधिक धुंधला)"];
      const pool = [["Vision immediately becomes crystal clear", "दृष्टि तुरंत स्पष्ट हो जाती है"], ["Focus moves onto the retina", "फोकस रेटिना पर पहुँच जाता है"], ["Image moves behind the retina", "प्रतिबिंब रेटिना के पीछे चला जाता है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "eye-predict", kind: "predict", prompt: ["A myopic student accidentally puts on +2.0 D convex spectacles instead of −2.0 D concave ones. What happens to the focus?", "निकट-दृष्टि दोष वाला छात्र गलती से −2.0 D की जगह +2.0 D उत्तल चश्मा पहन लेता है। फोकस का क्या होगा?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Extra positive converging power bends rays even earlier in front of the retina, worsening myopia.", "अतिरिक्त अभिसारी क्षमता किरणों को रेटिना से और आगे फोकस कर देती है।"]
      }));
    }
    return out;
  }
};
