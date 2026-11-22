/* Curiosity Lab · Magnet & Motor Lab (NCERT Class X, Ch 12 Magnetic Effects of Electric Current).
   Vary current I, coil turns N, current direction, and magnet motion speed — see solenoid field B,
   North/South poles flip, and Faraday's galvanometer needle deflect only while the magnet moves! */
import { bus } from "../core.js";
import { magnetModel, fmt } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const view = v => magnetModel({ I: v.I, N: v.N, dir: v.dir, speed: v.speed });

function snapshot(canvas, vars, focus) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#0b1424"), M = view(vars);
  if (focus === "induction") {
    C2.text(g, `Faraday Induction · N = ${M.N} turns · magnet speed = ${M.speed} · I_induced = ${fmt(M.emf, 2)} A`, 360, 24, { size: 14, color: "#93c5fd" });
    /* coil */
    for (let i = 0; i < 6; i++) C2.rect(g, 190 + i * 24, 110, 18, 120, { stroke: "#fb923c", fill: "rgba(251,146,60,0.16)", lw: 3, r: 9 });
    /* moving bar magnet */
    C2.rect(g, 395, 146, 85, 48, { stroke: "#fff", fill: "#ef4444", lw: 2, r: 4 });
    C2.rect(g, 480, 146, 85, 48, { stroke: "#fff", fill: "#3b82f6", lw: 2, r: 4 });
    C2.text(g, "N", 437, 170, { size: 18, color: "#fff" }); C2.text(g, "S", 522, 170, { size: 18, color: "#fff" });
    if (M.speed > 0) C2.arrow(g, 420, 125, 345, 125, "#46e08a", 3.5, 10);
    else C2.text(g, "Stationary (v = 0)", 480, 125, { size: 13, color: "#fda4af" });
    /* galvanometer */
    C2.circle(g, 105, 180, 48, { stroke: "#cbd5e1", fill: "#1e293b", w: 3 });
    const ang = -Math.PI / 2 + (M.speed ? Math.min(0.9, M.emf * 0.4) : 0);
    C2.arrow(g, 105, 180, 105 + Math.cos(ang) * 36, 180 + Math.sin(ang) * 36, "#ffd23f", 3, 8);
    C2.text(g, M.speed > 0 ? "G (Deflects!)" : "G (0 — no motion)", 105, 246, { size: 13, color: M.speed > 0 ? "#46e08a" : "#fca5a5" });
    return canvas;
  }

  C2.text(g, `Solenoid Electromagnet · I = ${M.I} A · N = ${M.N} turns · B = ${fmt(M.B, 2)} mT`, 360, 24, { size: 14, color: "#93c5fd" });
  /* field loops */
  [65, 110].forEach(ry => {
    g.save(); g.strokeStyle = "#38bdf8"; g.lineWidth = 2; g.setLineDash([6, 5]);
    g.beginPath(); g.ellipse(360, 175, 210, ry, 0, 0, Math.PI * 2); g.stroke(); g.restore();
  });
  /* solenoid windings */
  const coils = Math.max(4, Math.round(M.N / 6));
  for (let i = 0; i < coils; i++) {
    const cx = 230 + (i / (coils - 1)) * 260;
    C2.rect(g, cx - 10, 120, 20, 110, { stroke: "#f59e0b", fill: "rgba(245,158,11,0.22)", lw: 3, r: 10 });
  }
  C2.text(g, M.poleLeft, 155, 175, { size: 15, color: M.dir >= 0 ? "#93c5fd" : "#fca5a5" });
  C2.text(g, M.poleRight, 565, 175, { size: 15, color: M.dir >= 0 ? "#fca5a5" : "#93c5fd" });
  C2.arrow(g, M.dir >= 0 ? 250 : 470, 175, M.dir >= 0 ? 470 : 250, 175, "#46e08a", 3.5, 10);
  C2.text(g, "Uniform internal B field", 360, 295, { size: 13, color: "#bae6fd" });
  return canvas;
}

export default {
  id: "magnet", cls: 10, unit: "x/ch12", icon: "🧲",
  title: { en: "Magnet & Motor Lab — electromagnetism", hi: "चुंबक और मोटर प्रयोगशाला — विद्युतचुंबकत्व" },
  blurb: { en: "Increase coil turns N and current I to boost the solenoid field, flip poles, and induce current by moving a magnet!", hi: "फेरों की संख्या N और धारा I बढ़ाकर चुंबकीय क्षेत्र बढ़ाओ, ध्रुव पलटो और प्रेरित धारा देखो!" },
  vars: [
    { id: "I", label: { en: "Current I", hi: "विद्युत धारा I" }, unit: "A", min: 1, max: 6, step: 1, value: 3 },
    { id: "N", label: { en: "Coil turns N", hi: "कुंडली के फेरे N" }, unit: "", min: 10, max: 50, step: 10, value: 30 },
    { id: "dir", label: { en: "Current direction (+1 Forward · −1 Reverse)", hi: "धारा दिशा (+1 सीधी · −1 उल्टी)" }, unit: "", min: -1, max: 1, step: 2, value: 1 },
    { id: "speed", label: { en: "Magnet motion speed (Faraday test)", hi: "चुंबक गति (प्रेरण जाँच)" }, unit: "", min: 0, max: 4, step: 1, value: 2 }
  ],
  facts(v) {
    const M = view(v);
    return [
      { id: "B", en: "Solenoid magnetic field  B ∝ N·I", hi: "परिनालिका चुंबकीय क्षेत्र B", value: `${fmt(M.B, 2)} mT (uniform inside)` },
      { id: "poles", en: "Induced magnetic poles", hi: "प्रेरित चुंबकीय ध्रुव", value: `Left: ${M.poleLeft} · Right: ${M.poleRight}` },
      { id: "emf", en: "Faraday induced current (moving magnet)", hi: "फैराडे प्रेरित धारा", value: M.speed === 0 ? "0.00 A (magnet stationary!)" : `${fmt(M.emf, 2)} A (deflects galvanometer!)` },
      { id: "flhr", en: "Motor force  F = B I L  (Fleming's LHR)", hi: "मोटर बल (फ्लेमिंग वामहस्त)", value: `${M.dir >= 0 ? "Upward" : "Downward"} thrust · proportional to B·I` }
    ];
  },
  snapshot,
  missions: [
    { id: "mag-strong", en: "Build a powerhouse electromagnet (B ≥ 8.0 mT via high I and N)", hi: "शक्तिशाली विद्युतचुंबक बनाओ (B ≥ 8.0 mT)", check: v => view(v).B >= 8.0 },
    { id: "mag-flip", en: "Reverse current direction (dir = −1) to flip N and S poles", hi: "धारा उलटकर (dir = −1) N और S ध्रुव बदलो", check: v => v.dir === -1 },
    { id: "mag-zero", en: "Stop the magnet (speed = 0) and verify induced current drops to 0", hi: "चुंबक रोककर (speed = 0) देखो कि प्रेरित धारा 0 हो जाती है", check: v => v.speed === 0 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 3.2, 8.8], target: [0, 0.2, 0], bg: 0x0b1424, minDist: 4, maxDist: 18 });
    const { scene } = st, dyn = new THREE.Group(); scene.add(dyn);
    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    const h1 = el("span"), h2 = el("span"); hud.append(h1, h2);

    let magnetGrp = null, needle = null, motorArmature = null, particles = [], t = 0, domesticMode = ctx.preset?.sub === "domestic", motorMode = ctx.preset?.sub === "motor" || ctx.preset?.sub === "flhr";

    const rebuild = () => {
      while (dyn.children.length) {
        const c = dyn.children.pop();
        c.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); }); });
      }
      particles = []; motorArmature = null;
      const M = view(ctx.vars);
      if (motorMode) {
        /* 3D DC Electric Motor + Fleming's Left-Hand Rule (N->S B-field, rotating armature, split-ring commutator) */
        const nPole = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.8, 1.4), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
        nPole.position.set(-2.5, 0.2, 0); dyn.add(nPole);
        const sPole = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.8, 1.4), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
        sPole.position.set(2.5, 0.2, 0); dyn.add(sPole);
        const lbN = labelSprite(THREE, "N", "", { scale: 0.65, size: 26, color: "#fff" }); lbN.position.set(-2.5, 1.4, 0); dyn.add(lbN);
        const lbS = labelSprite(THREE, "S", "", { scale: 0.65, size: 26, color: "#fff" }); lbS.position.set(2.5, 1.4, 0); dyn.add(lbS);
        motorArmature = new THREE.Group(); motorArmature.position.set(0, 0.2, 0); dyn.add(motorArmature);
        const loop = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.08, 10, 4), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7 }));
        loop.rotation.z = Math.PI / 4; motorArmature.add(loop);
        const comm = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.45, 16, 1, false, 0, Math.PI * 0.85), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
        comm.rotation.x = Math.PI / 2; comm.position.set(0, 0, 1.15); motorArmature.add(comm);
        const lbM = labelSprite(THREE, `DC Motor (F = BIL · ${M.dir >= 0 ? "CW" : "CCW"})`, "Split-ring commutator reverses coil current every ½ turn!", { scale: 0.82, size: 21, color: "#fef08a" });
        lbM.position.set(0, 2.35, 0); dyn.add(lbM);
        h1.textContent = `DC Motor · I=${M.I} A · Torque ∝ N·I·B`;
        h2.textContent = M.dir >= 0 ? "FLHR Force: Left Up, Right Down (CW)" : "Reversed Current: CCW Spin";
        return;
      }
      if (domesticMode) {
        /* 220V 50Hz Domestic AC Parallel Wiring: Live (Red), Neutral (Black/Slate), Earth (Green) + MCB */
        const wires = [
          [0xef4444, 1.25, "Live 220V (Red)"],
          [0x94a3b8, 0.25, "Neutral 0V (Black)"],
          [0x22c55e, -0.75, "Earth Safety (Green)"]
        ];
        wires.forEach(([hex, y, txt]) => {
          const w = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 6.2, 10), new THREE.MeshStandardMaterial({ color: hex }));
          w.rotation.z = Math.PI / 2; w.position.set(0, y, 0); dyn.add(w);
          const lb = labelSprite(THREE, txt, null, { scale: 0.62, size: 20, color: "#f8fafc" });
          lb.position.set(-2.2, y + 0.35, 0); dyn.add(lb);
        });
        const mcb = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.6), new THREE.MeshStandardMaterial({ color: M.I > 5 ? 0xef4444 : 0x38bdf8 }));
        mcb.position.set(-0.5, 1.25, 0); dyn.add(mcb);
        const socket = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.2, 0.4), new THREE.MeshStandardMaterial({ color: 0x334155 }));
        socket.position.set(1.8, 0.25, -0.25); dyn.add(socket);
        const overload = M.I > 5;
        const lbl = labelSprite(THREE, overload ? "MCB TRIPPED! (>5A Overload)" : "220 V 50 Hz Parallel AC", overload ? "Short circuit / Overload!" : "Live · Neutral · Earth", { scale: 0.85, size: 24, color: overload ? "#fca5a5" : "#86efac" });
        lbl.position.set(0.4, 2.35, 0); dyn.add(lbl);
        h1.textContent = "Domestic AC · 220 V 50 Hz";
        h2.textContent = overload ? "MCB Tripped! (I > 5 A)" : "Parallel Sockets OK";
        return;
      }
      /* copper solenoid coils */
      const coils = Math.round(M.N / 5);
      for (let i = 0; i < coils; i++) {
        const x = -2.2 + (i / (coils - 1)) * 3.4;
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.065, 10, 28), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.65, roughness: 0.3 }));
        ring.rotation.y = Math.PI / 2; ring.position.set(x, 0.2, 0); dyn.add(ring);
      }
      /* soft iron core glow proportional to B */
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 3.8, 20), new THREE.MeshStandardMaterial({ color: 0x64748b, emissive: 0x0284c7, emissiveIntensity: Math.min(1.0, M.B / 10) }));
      core.rotation.z = Math.PI / 2; core.position.set(-0.5, 0.2, 0); dyn.add(core);

      /* pole labels */
      const pL = labelSprite(THREE, M.poleLeft, "", { scale: 0.78, size: 26, color: M.dir >= 0 ? "#93c5fd" : "#fca5a5" });
      pL.position.set(-2.7, 0.2, 0); dyn.add(pL);
      const pR = labelSprite(THREE, M.poleRight, "", { scale: 0.78, size: 26, color: M.dir >= 0 ? "#fca5a5" : "#93c5fd" });
      pR.position.set(1.7, 0.2, 0); dyn.add(pR);

      /* moving test bar magnet on right for Faraday induction */
      magnetGrp = new THREE.Group(); magnetGrp.position.set(2.9, 0.2, 0); dyn.add(magnetGrp);
      const nHalf = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.45, 0.45), new THREE.MeshStandardMaterial({ color: 0xef4444 })); nHalf.position.x = -0.3;
      const sHalf = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.45, 0.45), new THREE.MeshStandardMaterial({ color: 0x3b82f6 })); sHalf.position.x = 0.3;
      magnetGrp.add(nHalf, sHalf);

      /* galvanometer dial */
      const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.14, 28), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }));
      dial.rotation.x = Math.PI / 2; dial.position.set(-0.5, 2.0, -0.3); dyn.add(dial);
      needle = new THREE.Group(); needle.position.set(-0.5, 2.0, -0.2); dyn.add(needle);
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.04), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
      blade.position.y = 0.2; needle.add(blade);

      /* drifting field particles */
      for (let i = 0; i < 16; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
        dyn.add(p); particles.push({ m: p, off: (i / 16) * Math.PI * 2 });
      }

      h1.textContent = `B = ${fmt(M.B, 2)} mT · ${M.poleLeft.split(" ")[0]} | ${M.poleRight.split(" ")[0]}`;
      h2.textContent = M.speed ? `Induced I ≈ ${fmt(M.emf, 2)} A` : "Magnet stationary (0 A)";
    };

    const stopFrame = st.onFrame(dt => {
      const M = view(ctx.vars);
      t += dt;
      if (motorArmature) { motorArmature.rotation.z -= dt * (1.2 + M.I * 0.55) * M.dir; return; }
      if (magnetGrp) {
        const v = M.speed * 1.3;
        magnetGrp.position.x = 2.8 + (M.speed ? Math.sin(t * v) * 0.75 : 0);
        if (needle) needle.rotation.z = M.speed ? -Math.cos(t * v) * Math.min(1.0, M.emf * 0.45) : 0;
      }
      particles.forEach((p, idx) => {
        const u = ((t * 0.6 * M.dir + p.off) % (Math.PI * 2));
        const r = idx % 2 === 0 ? 1.35 : 1.75;
        p.m.position.set(-0.5 + Math.cos(u) * 2.2, 0.2 + Math.sin(u) * r, 0);
      });
    });

    const side = ctx.side; side.replaceChildren();
    const segDir = el("div", "cl-seg");
    const dirBtns = [["Forward (+1)", 1], ["Reverse (−1)", -1]].map(([lbl, val]) => {
      const b = el("button", "cl-opt" + (ctx.vars.dir === val ? " on" : ""), lbl);
      b.type = "button"; b.onclick = () => { ctx.set("dir", val); sfx.play("zap"); };
      segDir.appendChild(b); return b;
    });
    const bDom = el("button", "cl-opt" + (domesticMode ? " on" : ""), "220V Domestic AC"); bDom.type = "button";
    bDom.onclick = () => { motorMode = false; domesticMode = !domesticMode; bDom.classList.toggle("on", domesticMode); bMot.classList.toggle("on", false); sfx.play("pop"); rebuild(); };
    const bMot = el("button", "cl-opt" + (motorMode ? " on" : ""), "⚙️ DC Motor"); bMot.type = "button";
    bMot.onclick = () => { domesticMode = false; motorMode = !motorMode; bMot.classList.toggle("on", motorMode); bDom.classList.toggle("on", false); sfx.play("pop"); rebuild(); };
    segDir.append(bDom, bMot);
    side.appendChild(el("h3", "cl-h", "Current Direction & AC · धारा")); side.appendChild(segDir);

    const sl = sliders(ctx, side, { skip: ["dir"] });
    const facts = factsView(ctx, side);
    note(side, "Inside a current-carrying solenoid, field lines are parallel and uniform (B ∝ N·I). In Faraday induction, current appears ONLY while magnetic flux is changing!", "परिनालिका के भीतर चुंबकीय क्षेत्र एकसमान (B ∝ N·I) होता है। प्रेरित धारा केवल तभी बनती है जब चुंबक गतिमान हो!");

    const off = bus.on("sim:change", e => {
      if (e.labId !== "magnet") return;
      rebuild(); facts.update(); sl.sync();
      dirBtns.forEach((b, i) => b.classList.toggle("on", (i === 0 ? 1 : -1) === ctx.vars.dir));
    });
    rebuild(); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ I: seen(q, "I"), N: seen(q, "N"), dir: seen(q, "dir"), speed: seen(q, "speed") });
    {
      const x = v();
      const c = ["Straight, parallel, and uniform", "सीधी, समानांतर और एकसमान"];
      const pool = [["Zero inside the coil", "कुंडली के भीतर शून्य"], ["Circular spirals perpendicular to axis", "अक्ष के लंबवत वृत्ताकार"], ["Randomly scattered", "अनियमित रूप से बिखरी हुई"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "mag-solenoid", prompt: ["What is the nature of the magnetic field lines inside a long current-carrying solenoid?", "धारावाही लंबी परिनालिका के भीतर चुंबकीय क्षेत्र रेखाएँ कैसी होती हैं?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Parallel equally spaced lines inside a solenoid indicate the magnetic field strength is uniform everywhere inside.", "अंदर समानांतर व समान दूरी वाली रेखाएँ एकसमान चुंबकीय क्षेत्र दर्शाती हैं।"]
      }));
    }
    {
      const x = v();
      const c = ["North and South poles swap places", "उत्तरी और दक्षिणी ध्रुव आपस में बदल जाते हैं"];
      const pool = [["Magnetic field vanishes completely", "चुंबकीय क्षेत्र पूरी तरह शून्य हो जाता है"], ["Poles remain unchanged", "ध्रुव वही रहते हैं"], ["Coil melts immediately", "कुंडली तुरंत पिघल जाती है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "mag-flip", kind: "predict", prompt: ["You reverse the battery polarity so current flows in the opposite direction through the solenoid. What happens?", "बैटरी की ध्रुवता उलटकर परिनालिका में धारा की दिशा बदलने पर क्या होगा?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["By the right-hand clock-face rule, reversing current direction reverses the magnetic polarity (N ↔ S).", "धारा की दिशा उलटने पर चुंबकीय ध्रुव (N ↔ S) बदल जाते हैं।"]
      }));
    }
    {
      const x = { ...v(), speed: 0 };
      const c = ["Zero — no current is induced without relative motion", "शून्य — सापेक्ष गति के बिना कोई धारा प्रेरित नहीं होती"];
      const pool = [["Maximum steady current flows", "अधिकतम स्थायी धारा बहती है"], ["Alternating current of 50 Hz flows", "50 Hz की प्रत्यावर्ती धारा बहती है"], ["The coil turns into a permanent magnet", "कुंडली स्थायी चुंबक बन जाती है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "mag-induction-zero", prompt: ["A bar magnet is held completely stationary inside the copper coil. What does the galvanometer read?", "ताँबे की कुंडली के भीतर दंड चुंबक को बिल्कुल स्थिर रखने पर गैल्वेनोमीटर क्या दर्शाएगा?"],
        image: { vars: x, focus: "induction" }, options: d.options, correct: d.correct,
        why: ["Electromagnetic induction requires changing magnetic flux — when relative motion stops, induced current drops to zero.", "विद्युतचुंबकीय प्रेरण के लिए चुंबकीय फ्लक्स में परिवर्तन आवश्यक है; गति रुकने पर प्रेरित धारा शून्य हो जाती है।"]
      }));
    }
    {
      const x = v();
      const c = ["Fleming's Left-Hand Rule", "फ्लेमिंग का वामहस्त नियम"];
      const pool = [["Ohm's Law", "ओम का नियम"], ["Snell's Law of Refraction", "स्नेल का अपवर्तन नियम"], ["Law of Conservation of Mass", "द्रव्यमान संरक्षण नियम"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "mag-flhr", prompt: ["Which rule gives the direction of force on a current-carrying wire in a magnetic field (used in DC electric motors)?", "चुंबकीय क्षेत्र में धारावाही चालक पर लगने वाले बल की दिशा (मोटर में) किस नियम से ज्ञात होती है?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Fleming's Left-Hand Rule aligns Forefinger (Field B), Center finger (Current I), and Thumb (Force/Motion F).", "फ्लेमिंग के वामहस्त नियम में तर्जनी क्षेत्र, मध्यमा धारा और अंगूठा बल की दिशा बताता है।"]
      }));
    }
    {
      const x = v();
      const c = ["Magnetic field strength doubles", "चुंबकीय क्षेत्र की प्रबलता दोगुनी हो जाती है"];
      const pool = [["Magnetic field becomes half", "चुंबकीय क्षेत्र आधा हो जाता है"], ["Magnetic field stays unchanged", "चुंबकीय क्षेत्र वही रहता है"], ["Magnetic field drops to zero", "चुंबकीय क्षेत्र शून्य हो जाता है"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "mag-predict-turns", kind: "predict", prompt: [`Keeping current I = ${x.I} A fixed, you double the number of turns per unit length in the solenoid. What happens to the magnetic field B?`, `धारा I = ${x.I} A स्थिर रखकर प्रति इकाई लंबाई फेरे दोगुने किए जाते हैं। चुंबकीय क्षेत्र B का क्या होगा?`],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Magnetic field inside a solenoid is directly proportional to both turn density and current (B ∝ n·I).", "परिनालिका के अंदर चुंबकीय क्षेत्र फेरों की संख्या और धारा के अनुक्रमानुपाती (B ∝ n·I) होता है।"]
      }));
    }
    {
      const x = v();
      const c = ["220 V AC, 50 Hz with Live, Neutral & Earth wires in parallel", "220 V AC, 50 Hz — समानांतर क्रम में विद्युन्मय, उदासीन व भूसंपर्क तार"];
      const pool = [["12 V DC in series only", "केवल श्रेणीक्रम में 12 V DC"], ["220 V DC with all bulbs in series", "श्रेणीक्रम में 220 V DC"], ["Single wire without neutral", "बिना उदासीन तार का एकल परिपथ"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "mag-domestic", prompt: ["In Indian domestic electric circuits, how are appliances powered and wired?", "भारतीय घरेलू विद्युत परिपथों में उपकरण किस आपूर्ति और किस क्रम में जुड़े होते हैं?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Indian homes receive 220 V, 50 Hz AC; appliances are wired in parallel so each gets 220 V and can switch independently.", "भारत में 220 V, 50 Hz AC आपूर्ति होती है और सभी उपकरण समानांतर क्रम में जोड़े जाते हैं।"]
      }));
    }
    return out;
  }
};
