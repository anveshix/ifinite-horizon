/* Curiosity Lab · Sound & Echo Lab (NCERT Class IX, Ch 12 Sound).
   Students vary frequency f, amplitude A, medium (Air / Water / Steel), and cliff distance d,
   see longitudinal compressions & rarefactions in 3D, AND literally hear real synthesized pitch, loudness, and timed echoes! */
import { bus } from "../core.js";
import { SOUND_MEDIA, soundWave, fmt } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const view = v => soundWave({ f: v.f, A: v.A, medium: v.medium, dist: v.dist });

/* ---------------------------------------------------------------- 2D diagram (quiz + 2D fallback) */
function snapshot(canvas, vars, focus) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#0b1424"), S = view(vars);
  /* header */
  C2.text(g, `${S.mediaName} · v = ${S.v} m/s · f = ${S.f} Hz · λ = ${fmt(S.lambda, 2)} m`, 22, 22, { size: 14, color: "#93c5fd", align: "left" });

  if (focus === "echo") {
    /* echo setup: speaker/clap -> wall at d */
    const sx = 86, wx = 590, cy = 185;
    C2.circle(g, sx, cy, 24, { stroke: "#ffd23f", fill: "#1e293b", w: 2.5 });
    C2.text(g, "👏", sx, cy + 1, { size: 22 });
    C2.rect(g, wx, 80, 26, 200, { stroke: "#94a3b8", fill: "#475569", lw: 2, r: 4 });
    C2.text(g, "Cliff / Wall", wx + 13, 64, { size: 13, color: "#cbd5e1" });
    C2.arrow(g, sx + 32, cy - 22, wx - 10, cy - 22, "#46e08a", 3, 10);
    C2.arrow(g, wx - 10, cy + 22, sx + 32, cy + 22, S.distinctEcho ? "#ffd23f" : "#fb7185", 3, 10);
    C2.line(g, [[sx, 265], [wx, 265]], "#7f93b5", 2, [5, 5]);
    C2.text(g, `d = ${S.dist} m (round trip = ${2 * S.dist} m)`, (sx + wx) / 2, 286, { size: 15, color: "#e2e8f0" });
    C2.text(g, `t = 2d/v = ${fmt(S.tEcho, 3)} s · ${S.distinctEcho ? "Distinct Echo (≥ 0.1 s)" : "Reverberation (< 0.1 s)"}`, (sx + wx) / 2, 114, { size: 16, color: S.distinctEcho ? "#46e08a" : "#fda4af" });
    return canvas;
  }

  /* longitudinal compression & rarefaction dots + sine pressure curve */
  const x0 = 60, x1 = 660, cy = 225, baseA = 14 + S.A * 18;
  const cycles = Math.max(1.5, Math.min(6, S.f / 160));
  const k = (Math.PI * 2 * cycles) / (x1 - x0);
  /* particles */
  for (let row = 0; row < 4; row++) {
    const py = 185 + row * 26;
    for (let i = 0; i <= 38; i++) {
      const bx = x0 + ((x1 - x0) * i) / 38;
      const disp = baseA * Math.sin(k * (bx - x0));
      const px = bx + disp;
      const comp = Math.cos(k * (bx - x0)); // +1 compression, -1 rarefaction
      const col = comp > 0.3 ? "#ffd23f" : comp < -0.3 ? "#38bdf8" : "#94a3b8";
      C2.circle(g, px, py, comp > 0.3 ? 4.5 : 3.5, { stroke: null, fill: col });
    }
  }
  C2.text(g, "C (Compression)", 145, 305, { size: 13, color: "#ffd23f" });
  C2.text(g, "R (Rarefaction)", 315, 305, { size: 13, color: "#38bdf8" });

  /* transverse pressure wave above */
  const wy = 104, ampPx = 10 + S.A * 38, pts = [];
  C2.line(g, [[x0, wy], [x1, wy]], "#334155", 1.5, [4, 4]);
  for (let x = x0; x <= x1; x += 4) pts.push([x, wy - ampPx * Math.sin(k * (x - x0))]);
  C2.line(g, pts, "#4cc9f0", 3);
  /* amplitude & wavelength callouts */
  const lamPx = (x1 - x0) / cycles;
  const crest1 = x0 + lamPx * 0.25, crest2 = x0 + lamPx * 1.25;
  if (crest2 < x1 - 10) {
    C2.arrow(g, crest1, wy - ampPx - 14, crest2, wy - ampPx - 14, "#46e08a", 2, 8);
    C2.arrow(g, crest2, wy - ampPx - 14, crest1, wy - ampPx - 14, "#46e08a", 2, 8);
    C2.text(g, `λ = ${fmt(S.lambda, 2)} m`, (crest1 + crest2) / 2, wy - ampPx - 28, { size: 13, color: "#46e08a" });
  }
  C2.arrow(g, crest1, wy, crest1, wy - ampPx, "#fb923c", 2.5, 8);
  C2.text(g, `A = ${S.A}`, crest1 + 36, wy - ampPx / 2, { size: 12, color: "#fdba74" });
  void cy;
  return canvas;
}

/* ---------------------------------------------------------------- the lab */
export default {
  id: "sound", cls: 9, unit: "ix/ix12", icon: "🔊",
  title: { en: "Sound & Echo Lab — waves & audio", hi: "ध्वनि और प्रतिध्वनि प्रयोगशाला — तरंगें" },
  blurb: { en: "Pluck a tuning fork, watch air particles squeeze and stretch, and hear real pitch & delayed echoes!", hi: "स्वरित्र द्विभुज बजाओ, कणों के संपीडन-विरलन देखो और असली पिच व प्रतिध्वनि सुनो!" },
  vars: [
    { id: "f", label: { en: "Frequency f (pitch)", hi: "आवृत्ति f (तारत्व)" }, unit: "Hz", min: 150, max: 900, step: 50, value: 450 },
    { id: "A", label: { en: "Amplitude A (loudness)", hi: "आयाम A (प्रबलता)" }, unit: "", min: 0.2, max: 1.0, step: 0.2, value: 0.6 },
    { id: "medium", label: { en: "Medium (0 Air · 1 Water · 2 Steel)", hi: "माध्यम (वायु · जल · इस्पात)" }, unit: "", min: 0, max: 2, step: 1, value: 0 },
    { id: "dist", label: { en: "Wall distance d", hi: "दीवार की दूरी d" }, unit: "m", min: 5, max: 60, step: 5, value: 25 }
  ],
  facts(v) {
    const S = view(v);
    return [
      { id: "speed", en: `Speed of sound in ${S.mediaName}`, hi: `${S.mediaHi} में ध्वनि की चाल`, value: `${S.v} m/s` },
      { id: "lam", en: "Wavelength  λ = v / f", hi: "तरंगदैर्घ्य λ", value: `${fmt(S.lambda, 2)} m` },
      { id: "T", en: "Time period  T = 1 / f", hi: "आवर्तकाल T", value: `${fmt(S.Tms, 2)} ms` },
      { id: "echo", en: `Echo time  t = 2d / v  (min d = ${fmt(S.dMin, 1)} m)`, hi: "प्रतिध्वनि समय", value: `${fmt(S.tEcho, 3)} s — ${S.distinctEcho ? "Clear echo! · स्पष्ट प्रतिध्वनि!" : "Reverberation (< 0.1 s) · अनुरणन"}` }
    ];
  },
  snapshot,
  missions: [
    { id: "sound-echo", en: "Hear a distinct echo: get t ≥ 0.10 s (e.g. Air & d ≥ 20 m)", hi: "स्पष्ट प्रतिध्वनि बनाओ: t ≥ 0.10 s (जैसे वायु में d ≥ 20 m)", check: v => view(v).distinctEcho },
    { id: "sound-reverb", en: "Trigger reverberation (< 0.10 s) by moving closer or switching to Water/Steel", hi: "अनुणन (< 0.10 s) बनाओ — पास आओ या जल/इस्पात चुनो", check: v => !view(v).distinctEcho },
    { id: "sound-high", en: "Create a high-pitched wave (f ≥ 750 Hz)", hi: "उच्च तारत्व वाली तरंग बनाओ (f ≥ 750 Hz)", check: v => v.f >= 750 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 3.2, 10.6], target: [0.4, 0.3, 0], bg: 0x0b1424, minDist: 4.5, maxDist: 22 });
    const { scene } = st;

    /* tuning fork on the left */
    const fork = new THREE.Group(); fork.position.set(-4.6, -0.3, 0); scene.add(fork);
    const steelMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.75, roughness: 0.25, emissive: 0x38bdf8, emissiveIntensity: 0 });
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 14), steelMat); stem.position.y = 0.5; fork.add(stem);
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.14, 0.18), steelMat); base.position.y = 1.0; fork.add(base);
    const prongL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.45, 14), steelMat); prongL.position.set(-0.38, 1.72, 0);
    const prongR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.45, 14), steelMat); prongR.position.set(0.38, 1.72, 0);
    fork.add(prongL, prongR);
    const forkTag = labelSprite(THREE, "Tuning Fork", "स्वरित्र द्विभुज", { scale: 0.85, size: 26 }); forkTag.position.set(-4.6, -0.85, 0); scene.add(forkTag);

    /* reflecting cliff wall on the right */
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.45, 3.2, 2.8), new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 }));
    wall.position.set(4.8, 0.7, 0); scene.add(wall);
    const wallTag = labelSprite(THREE, "Reflecting Wall", "परावर्तक दीवार", { scale: 0.85, size: 26 }); wallTag.position.set(4.8, 2.65, 0); scene.add(wallTag);

    /* 3D longitudinal medium particles (18 × 5 = 90 spheres) */
    const NX = 18, NY = 5, particles = [];
    const pGeo = new THREE.SphereGeometry(0.11, 14, 12);
    for (let ix = 0; ix < NX; ix++) {
      for (let iy = 0; iy < NY; iy++) {
        const mat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, emissive: 0x1d4ed8, emissiveIntensity: 0.15 });
        const m = new THREE.Mesh(pGeo, mat);
        const bx = -3.4 + (ix / (NX - 1)) * 7.4;
        const by = -0.35 + (iy / (NY - 1)) * 1.9;
        const bz = ((iy % 2) - 0.5) * 0.45;
        m.position.set(bx, by, bz);
        scene.add(m);
        particles.push({ m, bx, by, bz });
      }
    }

    /* 3D transverse pressure ribbon above particles */
    const NW = 48, wavePts = [];
    for (let i = 0; i < NW; i++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), new THREE.MeshBasicMaterial({ color: 0x4cc9f0 }));
      scene.add(m);
      wavePts.push({ m, bx: -3.4 + (i / (NW - 1)) * 7.4 });
    }

    /* echo pulse ring */
    const pulseRing = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.045, 10, 32), new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0 }));
    pulseRing.rotation.y = Math.PI / 2; pulseRing.position.set(-3.8, 0.7, 0); scene.add(pulseRing);

    /* 3D Human Ear sub-view (Pinna -> Ear Canal -> Eardrum -> Ossicles -> Cochlea) */
    const earGrp = new THREE.Group(); earGrp.visible = false; scene.add(earGrp);
    const canal = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.38, 2.8, 20, 1, true), new THREE.MeshStandardMaterial({ color: 0xfda4af, transparent: true, opacity: 0.4, side: THREE.DoubleSide }));
    canal.rotation.z = Math.PI / 2; canal.position.set(-1.6, 0.5, 0); earGrp.add(canal);
    const eardrum = new THREE.Mesh(new THREE.CircleGeometry(0.42, 24), new THREE.MeshStandardMaterial({ color: 0xfacc15, side: THREE.DoubleSide }));
    eardrum.rotation.y = Math.PI / 2; eardrum.position.set(-0.2, 0.5, 0); earGrp.add(eardrum);
    const ossicles = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.18, 0.18), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
    ossicles.position.set(0.55, 0.5, 0); earGrp.add(ossicles);
    const cochlea = new THREE.Mesh(new THREE.TorusKnotGeometry(0.55, 0.14, 48, 10, 2, 3), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
    cochlea.position.set(2.1, 0.5, 0); earGrp.add(cochlea);
    const earLbl = labelSprite(THREE, "Human Ear · Pinna → Eardrum → Ossicles → Cochlea", "Tympanic membrane vibrates at f → electrical nerve signal", { scale: 0.85, size: 21, color: "#fde68a" });
    earLbl.position.set(0.2, 2.35, 0); earGrp.add(earLbl);

    let earMode = ctx.preset?.sub === "ear";
    const setEarMode = on => {
      earMode = on; earGrp.visible = on;
      [fork, forkTag, wall, wallTag].forEach(o => { o.visible = !on; });
      particles.forEach(p => { p.m.visible = !on; });
      wavePts.forEach(w => { w.m.visible = !on; });
    };

    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    const hv = el("span"), hl = el("span"), he = el("span"); hud.append(hv, hl, he);

    let phase = 0, toneGlow = 0, echoAnim = null;

    const refresh = () => {
      const S = view(ctx.vars);
      const wallX = 2.0 + (S.dist / 60) * 3.4;
      wall.position.x = wallX; wallTag.position.x = wallX;
      hv.textContent = `${S.mediaName} · v = ${S.v} m/s`;
      hl.textContent = `f = ${S.f} Hz · λ = ${fmt(S.lambda, 2)} m`;
      he.textContent = `echo t = ${fmt(S.tEcho, 3)} s ${S.distinctEcho ? "✓ Echo" : "· Reverb"}`;
      he.style.borderColor = S.distinctEcho ? "rgba(70,224,138,.7)" : "rgba(251,113,133,.7)";
      drawScope();
    };

    const stopFrame = st.onFrame(dt => {
      const S = view(ctx.vars);
      const speedFactor = S.medium === 0 ? 1 : S.medium === 1 ? 1.8 : 2.8;
      const omega = (2.5 + (S.f / 900) * 6.5) * speedFactor;
      const k = 0.7 + (S.f / 900) * 1.6;
      phase += dt * omega;
      const amp3d = 0.08 + S.A * 0.24;

      /* animate tuning fork & eardrum vibration */
      const forkVib = Math.sin(phase * 2.2) * (0.02 + S.A * 0.05) * (toneGlow > 0 ? 1.8 : 0.7);
      prongL.position.x = -0.38 - forkVib;
      prongR.position.x = 0.38 + forkVib;
      if (earMode) { eardrum.position.x = -0.2 + forkVib * 1.4; ossicles.position.x = 0.55 + forkVib; }
      if (toneGlow > 0) { toneGlow = Math.max(0, toneGlow - dt * 1.1); steelMat.emissiveIntensity = toneGlow * 0.8; }

      /* longitudinal oscillation */
      particles.forEach(p => {
        const arg = k * (p.bx + 3.4) - phase;
        const disp = amp3d * Math.sin(arg);
        p.m.position.x = p.bx + disp;
        const comp = Math.cos(arg); // density indicator
        if (comp > 0.25) { p.m.material.color.setHex(0xffd23f); p.m.material.emissive.setHex(0xd97706); p.m.scale.setScalar(1.18); }
        else if (comp < -0.25) { p.m.material.color.setHex(0x38bdf8); p.m.material.emissive.setHex(0x1d4ed8); p.m.scale.setScalar(0.84); }
        else { p.m.material.color.setHex(0x94a3b8); p.m.material.emissive.setHex(0x334155); p.m.scale.setScalar(1.0); }
      });

      /* transverse wave above */
      wavePts.forEach(w => {
        const arg = k * (w.bx + 3.4) - phase;
        w.m.position.set(w.bx, 2.35 + (0.12 + S.A * 0.45) * Math.sin(arg), 0);
      });

      /* echo pulse bounce */
      if (echoAnim) {
        echoAnim.t += dt;
        const dur = Math.max(0.25, Math.min(1.6, S.tEcho * 1.4));
        const u = echoAnim.t / dur;
        if (u >= 1) { echoAnim = null; pulseRing.material.opacity = 0; }
        else {
          const wallX = wall.position.x - 0.3;
          const x = u < 0.5 ? -3.8 + (wallX + 3.8) * (u * 2) : wallX - (wallX + 3.8) * ((u - 0.5) * 2);
          pulseRing.position.x = x;
          pulseRing.material.opacity = 0.9 * (1 - u * 0.5);
          pulseRing.material.color.setHex(u < 0.5 ? 0x46e08a : 0xfacc15);
        }
      }
    });

    /* side panel */
    const side = ctx.side; side.replaceChildren();
    /* medium segmented picker */
    const seg = el("div", "cl-seg"); seg.setAttribute("role", "group"); seg.setAttribute("aria-label", "Medium");
    const mBtns = SOUND_MEDIA.map((m, idx) => {
      const b = el("button", "cl-opt" + (ctx.vars.medium === idx ? " on" : ""), `${m.name.split(" ")[0]}<br><span class="hi">${m.v} m/s</span>`);
      b.type = "button";
      b.onclick = () => { ctx.set("medium", idx); mBtns.forEach((x, j) => x.classList.toggle("on", j === idx)); };
      seg.appendChild(b);
      return b;
    });
    side.appendChild(el("h3", "cl-h", "Medium · माध्यम")); side.appendChild(seg);

    const sl = sliders(ctx, side, { skip: ["medium"] });

    /* REAL AUDIO BUTTONS */
    const btns = el("div", "cl-btns"); side.appendChild(btns);
    actionButton(btns, "🔊 Hear Tone · स्वर सुनो", () => {
      const S = view(ctx.vars);
      sfx.playTone(S.f, S.A, 0.9);
      toneGlow = 1;
      ctx.run();
    }, "cl-act");
    actionButton(btns, "👏 Clap & Echo · प्रतिध्वनि", () => {
      const S = view(ctx.vars);
      sfx.playClapEcho(S.tEcho, Math.min(0.85, 0.35 + S.A * 0.5));
      echoAnim = { t: 0 };
      ctx.run();
    }, "cl-act sec");
    const btnEar = actionButton(btns, "👂 Human Ear", () => { setEarMode(!earMode); btnEar.classList.toggle("on", earMode); sfx.play("pop"); }, "cl-chipb");

    const scope = el("canvas", "cl-graph"); scope.width = 340; scope.height = 140; scope.setAttribute("role", "img"); scope.setAttribute("aria-label", "Live waveform oscilloscope");
    side.appendChild(el("h3", "cl-h", "Oscilloscope · तरंग आरेख")); side.appendChild(scope);
    function drawScope() {
      const S = view(ctx.vars), g = C2.prep(scope, 340, 140, "#0b1424");
      C2.line(g, [[16, 70], [324, 70]], "#334155", 1.5, [4, 4]);
      const cycles = Math.max(1.5, Math.min(8, S.f / 120)), amp = 10 + S.A * 42, pts = [];
      for (let x = 16; x <= 324; x += 3) pts.push([x, 70 - amp * Math.sin(((x - 16) / 308) * Math.PI * 2 * cycles)]);
      C2.line(g, pts, "#ffd23f", 2.5);
      C2.text(g, `${S.f} Hz · ${S.distinctEcho ? "Echo ≥ 0.1 s" : "Reverb < 0.1 s"}`, 170, 18, { size: 12, color: "#bae6fd" });
    }

    const facts = factsView(ctx, side);
    const presets = el("div", "cl-presets"); presets.appendChild(el("span", "cl-lab", "Try · आज़माओ"));
    const jump = (txt, fn) => actionButton(presets, txt, () => { fn(); sl.sync(); mBtns.forEach((b, j) => b.classList.toggle("on", j === ctx.vars.medium)); }, "cl-chipb");
    jump("Clear Echo (Air, 25 m)", () => { ctx.set("medium", 0); ctx.set("dist", 25); });
    jump("Echo disappears (10 m)", () => { ctx.set("medium", 0); ctx.set("dist", 10); });
    jump("High Pitch (800 Hz)", () => ctx.set("f", 800));
    side.insertBefore(presets, sl.root.nextSibling);

    note(side, "Human ears need at least 0.1 s between two sounds to hear a distinct echo — that needs 17.2 m in air! Tap Hear Tone or Clap & Echo to actually hear the physics.", "स्पष्ट प्रतिध्वनि सुनने के लिए कम से कम 0.1 s का अंतराल चाहिए (वायु में 17.2 m)। 'स्वर सुनो' या 'प्रतिध्वनि' दबाकर खुद सुनो!");

    const off = bus.on("sim:change", e => {
      if (e.labId !== "sound") return;
      refresh(); facts.update(); sl.sync();
      mBtns.forEach((b, j) => b.classList.toggle("on", j === ctx.vars.medium));
    });
    refresh(); setEarMode(earMode); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ f: seen(q, "f"), A: seen(q, "A"), medium: seen(q, "medium"), dist: seen(q, "dist") });
    const uniq = (arr, c) => { const s = new Set([c]); return arr.filter(o => !s.has(o[0]) && s.add(o[0])); };

    /* 1 · distinct echo or reverberation */
    {
      const x = v(), S = view(x);
      const ans = S.distinctEcho ? ["Yes — a distinct echo is heard", "हाँ — स्पष्ट प्रतिध्वनि सुनाई देगी"] : ["No — it blends as reverberation", "नहीं — यह अनुरणन में मिल जाएगी"];
      const pool = [
        ["Yes — a distinct echo is heard", "हाँ — स्पष्ट प्रतिध्वनि सुनाई देगी"],
        ["No — it blends as reverberation", "नहीं — यह अनुरणन में मिल जाएगी"],
        ["Sound stops at the wall without reflecting", "ध्वनि दीवार से परावर्तित ही नहीं होती"],
        ["The pitch doubles on reflection", "परावर्तन से तारत्व दोगुना हो जाता है"]
      ];
      const d = withDistractors(ans, pool, 3, q.rnd);
      out.push(ask({
        id: "sound-echo",
        prompt: [`A clap reflects off a wall ${S.dist} m away in ${S.mediaName} (v = ${S.v} m/s), returning in ${fmt(S.tEcho, 3)} s. Will a distinct echo be heard?`, `${S.mediaHi} में ${S.dist} m दूर दीवार से ताली ${fmt(S.tEcho, 3)} s में लौटती है। क्या स्पष्ट प्रतिध्वनि सुनाई देगी?`],
        image: { vars: x, focus: "echo" },
        options: d.options, correct: d.correct,
        why: [`Echo time t = 2d/v = ${fmt(S.tEcho, 3)} s. A distinct echo needs t ≥ 0.1 s (min distance ${fmt(S.dMin, 1)} m in ${S.mediaName}).`, `t = 2d/v = ${fmt(S.tEcho, 3)} s। स्पष्ट प्रतिध्वनि के लिए t ≥ 0.1 s आवश्यक है।`]
      }));
    }

    /* 2 · wavelength calculation λ = v / f */
    {
      const x = v(), S = view(x), L = x => [`${fmt(x, 2)} m`, `${fmt(x, 2)} m`];
      const c = L(S.lambda);
      const d = withDistractors(c, uniq([L(S.v * S.f), L(S.f / S.v), L(S.lambda * 2), L(S.lambda / 2)], c[0]), 3, q.rnd);
      out.push(ask({
        id: "sound-wavelength",
        prompt: [`In ${S.mediaName} (v = ${S.v} m/s), a tuning fork vibrates at ${S.f} Hz. What is the wavelength λ of the wave?`, `${S.mediaHi} (v = ${S.v} m/s) में ${S.f} Hz की ध्वनि तरंग का तरंगदैर्घ्य λ कितना होगा?`],
        image: { vars: x },
        options: d.options, correct: d.correct,
        why: [`Wave speed v = f λ, so λ = v / f = ${S.v} / ${S.f} = ${fmt(S.lambda, 2)} m.`, `v = f λ, इसलिए λ = v / f = ${S.v} / ${S.f} = ${fmt(S.lambda, 2)} m।`]
      }));
    }

    /* 3 · medium speed comparison */
    {
      const x = v();
      const c = ["Steel (solid) — 5960 m/s", "इस्पात (ठोस) — 5960 m/s"];
      const pool = [
        ["Air (gas) — 344 m/s", "वायु (गैस) — 344 m/s"],
        ["Water (liquid) — 1498 m/s", "जल (द्रव) — 1498 m/s"],
        ["Vacuum — infinite speed", "निर्वात — अनंत चाल"]
      ];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "sound-medium",
        prompt: ["In which of these media does sound travel the fastest?", "इनमें से किस माध्यम में ध्वनि सबसे तेज़ चलती है?"],
        image: { vars: x },
        options: d.options, correct: d.correct,
        why: ["Particles in solids are packed closest together, so vibrations pass fastest in Steel (5960 m/s), slower in Water (1498 m/s), and slowest in Air (344 m/s). Sound cannot travel in vacuum.", "ठोसों में कण सबसे पास होते हैं, इसलिए ध्वनि इस्पात में सबसे तेज़ (5960 m/s) चलती है; निर्वात में ध्वनि नहीं चल सकती।"]
      }));
    }

    /* 4 · pitch vs frequency */
    {
      const x = v();
      const c = ["Frequency (f)", "आवृत्ति (f)"];
      const pool = [["Amplitude (A)", "आयाम (A)"], ["Distance to the wall (d)", "दीवार की दूरी (d)"], ["Air pressure alone", "केवल वायु दाब"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "sound-pitch",
        prompt: ["How our brain interprets the shrillness (pitch) of a sound depends directly on which wave property?", "ध्वनि का तारत्व (तीखापन / पिच) तरंग के किस गुण पर निर्भर करता है?"],
        image: { vars: x },
        options: d.options, correct: d.correct,
        why: ["Higher frequency (more vibrations per second) produces a higher-pitched, shriller sound.", "अधिक आवृत्ति (प्रति सेकंड अधिक कंपन) से अधिक तारत्व वाली तीखी ध्वनि बनती है।"]
      }));
    }

    /* 5 · loudness vs amplitude */
    {
      const x = v();
      const c = ["Amplitude (A)", "आयाम (A)"];
      const pool = [["Frequency (f)", "आवृत्ति (f)"], ["Wavelength (λ)", "तरंगदैर्घ्य (λ)"], ["Time period (T)", "आवर्तकाल (T)"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "sound-loudness",
        prompt: ["You strike the tuning fork harder so the air particles oscillate farther from rest. Which property increases to make the sound louder?", "स्वरित्र को ज़ोर से मारने पर कण अधिक दूर तक दोलन करते हैं। ध्वनि को प्रबल बनाने वाला कौन-सा गुण बढ़ता है?"],
        image: { vars: x },
        options: d.options, correct: d.correct,
        why: ["Loudness increases with amplitude (A) — greater maximum displacement carries more wave energy.", "ध्वनि की प्रबलता आयाम (A) बढ़ने से बढ़ती है।"]
      }));
    }

    /* 6 · predict: double frequency -> half wavelength */
    {
      const x = v();
      const f1 = x.f <= 450 ? x.f : 300, f2 = f1 * 2;
      const c = ["Wavelength becomes half", "तरंगदैर्घ्य आधा हो जाता है"];
      const pool = [
        ["Wavelength doubles", "तरंगदैर्घ्य दोगुना हो जाता है"],
        ["Wavelength stays the same", "तरंगदैर्घ्य वही रहता है"],
        ["Speed of sound doubles", "ध्वनि की चाल दोगुनी हो जाती है"]
      ];
      const d = withDistractors(c, pool, 3, q.rnd);
      const S1 = view({ ...x, f: f1 }), S2 = view({ ...x, f: f2 });
      out.push(ask({
        id: "sound-predict", kind: "predict",
        prompt: [`Keeping the medium (${S1.mediaName}) the same, you double the frequency from ${f1} Hz to ${f2} Hz. What happens to the wavelength λ?`, `माध्यम (${S1.mediaHi}) वही रखते हुए आवृत्ति ${f1} Hz से दोगुनी (${f2} Hz) की जाती है। तरंगदैर्घ्य λ का क्या होगा?`],
        image: { vars: { ...x, f: f1 } },
        options: d.options, correct: d.correct,
        meta: { a: { f: f1, medium: x.medium }, b: { f: f2, medium: x.medium }, ratio: 0.5 },
        why: [`Speed v depends on the medium, so λ = v / f halves (${fmt(S1.lambda, 2)} m → ${fmt(S2.lambda, 2)} m).`, `चाल v माध्यम पर निर्भर है, अतः λ = v / f आधा हो जाता है (${fmt(S1.lambda, 2)} m → ${fmt(S2.lambda, 2)} m)।`]
      }));
    }

    return out;
  }
};
