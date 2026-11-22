/* Curiosity Lab · Cell & Osmosis Lab (NCERT Class IX, Ch 1 The Fundamental Unit of Life).
   Compare Animal, Plant, and Prokaryotic cells in 3D, change tonicity (Hypotonic / Isotonic / Hypertonic) and temperature,
   and watch H₂O molecules cross the selectively permeable membrane in real time! */
import { bus } from "../core.js";
import { CELL_TYPES, osmosisModel, fmt } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const view = v => osmosisModel({ cellType: v.cellType, tonicity: v.tonicity, temp: v.temp });
const TON_NAMES = { "-1": ["Hypotonic (0% water)", "अल्पपरासारी (शुद्ध जल)"], "0": ["Isotonic (0.9% NaCl)", "समपरासारी (0.9% लवण)"], "1": ["Hypertonic (4% salt)", "अतिपरासारी (4% लवण)"] };

/* ---------------------------------------------------------------- 2D diagram (quiz + 2D fallback) */
function snapshot(canvas, vars, focus) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#0b1424"), O = view(vars);
  const cx = 290, cy = 176;
  const tonCol = O.tonicity < 0 ? "rgba(56,189,248,0.16)" : O.tonicity > 0 ? "rgba(251,146,60,0.16)" : "rgba(148,163,184,0.12)";
  C2.rect(g, 24, 42, 520, 268, { stroke: "#475569", fill: tonCol, lw: 2, r: 16 });
  C2.text(g, `${O.cellName} · ${TON_NAMES[O.tonicity][0]}`, 36, 22, { size: 14, color: "#93c5fd", align: "left" });

  /* outer cell wall if plant or prokaryote */
  if (O.hasCellWall) {
    if (O.cellType === 1) C2.rect(g, cx - 125, cy - 85, 250, 170, { stroke: "#22c55e", fill: "rgba(34,197,94,0.08)", lw: 5, r: 16 });
    else C2.rect(g, cx - 130, cy - 58, 260, 116, { stroke: "#eab308", fill: "rgba(234,179,8,0.08)", lw: 4, r: 55 });
  }

  /* plasma membrane (shrinks inside wall during plasmolysis, swells in hypotonic) */
  const s = O.volScale;
  if (O.cellType === 1) {
    C2.rect(g, cx - 114 * s, cy - 76 * s, 228 * s, 152 * s, { stroke: "#fbbf24", fill: "rgba(74,222,128,0.14)", lw: 3, r: 14 });
    /* large central vacuole */
    C2.rect(g, cx - 72 * s, cy - 42 * s, 110 * s, 84 * s, { stroke: "#38bdf8", fill: "rgba(56,189,248,0.25)", lw: 2, r: 22 });
    C2.text(g, "Vacuole", cx - 17 * s, cy, { size: 12, color: "#bae6fd" });
    /* chloroplasts */
    [[-65, -55], [65, 50], [72, -45]].forEach(([dx, dy]) => C2.circle(g, cx + dx * s, cy + dy * s, 10, { stroke: "#15803d", fill: "#22c55e", w: 1.5 }));
  } else if (O.cellType === 0) {
    C2.circle(g, cx, cy, 82 * s, { stroke: "#fb7185", fill: "rgba(244,63,94,0.22)", lw: 3 });
  } else {
    C2.rect(g, cx - 118 * s, cy - 48 * s, 236 * s, 96 * s, { stroke: "#fbbf24", fill: "rgba(250,204,21,0.14)", lw: 2.5, r: 44 });
  }

  /* nucleus or nucleoid */
  if (O.hasNucleus) {
    const nx = O.cellType === 1 ? cx + 62 * s : cx, ny = O.cellType === 1 ? cy - 6 : cy;
    C2.circle(g, nx, ny, 24, { stroke: "#a78bfa", fill: "rgba(139,92,246,0.45)", w: 2.5 });
    C2.text(g, "Nucleus", nx, ny, { size: 11, color: "#ede9fe" });
  } else {
    C2.line(g, [[cx - 45, cy - 10], [cx - 15, cy + 14], [cx + 15, cy - 16], [cx + 42, cy + 12], [cx + 5, cy + 20]], "#f472b6", 3);
    C2.text(g, "Nucleoid (no membrane)", cx, cy - 26, { size: 11, color: "#fbcfe8" });
  }

  /* mitochondria highlight if eukaryotic */
  if (O.hasNucleus) {
    const mx = cx - 42 * s, my = cy + 44 * s;
    C2.rect(g, mx - 18, my - 9, 36, 18, { stroke: focus === "mito" ? "#ffe066" : "#fb923c", fill: "#ea580c", lw: focus === "mito" ? 3 : 1.5, r: 9 });
    if (focus === "mito") C2.text(g, "Mitochondria (ATP)", mx, my + 20, { size: 12, color: "#ffe066" });
  }

  /* H2O flux arrows */
  if (O.tonicity < 0) {
    [[cx - 180, cy, cx - 115, cy], [cx + 180, cy, cx + 115, cy]].forEach(([x0, y0, x1, y1]) => C2.arrow(g, x0, y0, x1, y1, "#38bdf8", 3.5, 10));
    C2.text(g, "H₂O enters (Endosmosis)", 630, 140, { size: 13, color: "#38bdf8" });
  } else if (O.tonicity > 0) {
    [[cx - 105, cy, cx - 175, cy], [cx + 105, cy, cx + 175, cy]].forEach(([x0, y0, x1, y1]) => C2.arrow(g, x0, y0, x1, y1, "#fb923c", 3.5, 10));
    C2.text(g, "H₂O exits (Exosmosis)", 630, 140, { size: 13, color: "#fdba74" });
  } else {
    C2.arrow(g, cx - 175, cy - 16, cx - 115, cy - 16, "#46e08a", 2.5, 8);
    C2.arrow(g, cx - 115, cy + 16, cx - 175, cy + 16, "#46e08a", 2.5, 8);
    C2.text(g, "Equal H₂O in & out", 630, 140, { size: 13, color: "#86efac" });
  }
  C2.text(g, O.state, 284, 326, { size: 14, color: "#ffd23f" });
  return canvas;
}

/* ---------------------------------------------------------------- the lab */
export default {
  id: "cell", cls: 9, unit: "ix/ix1", icon: "🧫",
  title: { en: "Cell & Osmosis Lab — living cell", hi: "कोशिका और परासरण प्रयोगशाला" },
  blurb: { en: "Place Animal, Plant, and Prokaryotic cells into pure water or salt solution — watch H₂O cross the membrane!", hi: "जंतु, पादप और प्रोकैरियोट कोशिका को शुद्ध जल या नमक के घोल में डालो और परासरण देखो!" },
  vars: [
    { id: "cellType", label: { en: "Cell type (0 Animal · 1 Plant · 2 Bacterium)", hi: "कोशिका प्रकार (जंतु · पादप · जीवाणु)" }, unit: "", min: 0, max: 2, step: 1, value: 1 },
    { id: "tonicity", label: { en: "Solution (−1 Hypotonic · 0 Isotonic · +1 Hypertonic)", hi: "विलयन (−1 अल्प · 0 सम · +1 अतिपरासारी)" }, unit: "", min: -1, max: 1, step: 1, value: 0 },
    { id: "temp", label: { en: "Temperature (diffusion speed)", hi: "तापमान (विसरण गति)" }, unit: "°C", min: 10, max: 40, step: 10, value: 20 }
  ],
  facts(v) {
    const O = view(v);
    return [
      { id: "type", en: "Specimen", hi: "कोशिका नमूना", value: `${O.cellName} · ${O.cellHi}` },
      { id: "flux", en: "Net water (H₂O) movement", hi: "शुद्ध जल (H₂O) प्रवाह", value: O.tonicity < 0 ? "Inward (Endosmosis) · अंदर की ओर" : O.tonicity > 0 ? "Outward (Exosmosis) · बाहर की ओर" : "Balanced (zero net) · संतुलित" },
      { id: "state", en: "Cell outcome", hi: "कोशिका की स्थिति", value: `${O.state} · ${O.stateHi}` },
      { id: "feat", en: "Key structural check", hi: "प्रमुख संरचना", value: `${O.hasCellWall ? "Cell wall present" : "No cell wall"} · ${O.hasNucleus ? "True nucleus (Eukaryote)" : "Nucleoid only (Prokaryote)"}` }
    ];
  },
  snapshot,
  missions: [
    { id: "cell-plasmo", en: "Plasmolyse a Plant cell in a Hypertonic (+1) salt solution", hi: "अतिपरासारी (+1) घोल में पादप कोशिका में जीवद्रव्यकुंचन देखो", check: v => v.cellType === 1 && v.tonicity === 1 },
    { id: "cell-turgid", en: "Make a Plant cell Turgid in pure Hypotonic (−1) water", hi: "अल्पपरासारी (−1) जल में पादप कोशिका को स्फीत बनाओ", check: v => v.cellType === 1 && v.tonicity === -1 },
    { id: "cell-prok", en: "Inspect a Prokaryote (Bacterium) to see its membrane-free Nucleoid", hi: "प्रोकैरियोट (जीवाणु) में बिना झिल्ली वाला केंद्रकाभ देखो", check: v => v.cellType === 2 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 3.6, 8.6], target: [0, 0.2, 0], bg: 0x0b1424, minDist: 4, maxDist: 18 });
    const { scene } = st;

    const bath = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.25, 6), new THREE.MeshStandardMaterial({ color: 0x0f2942, roughness: 0.7 }));
    bath.position.set(0, -1.7, 0); scene.add(bath);

    /* cell assembly */
    const cellGrp = new THREE.Group(); scene.add(cellGrp);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, wireframe: false, transparent: true, opacity: 0.28, roughness: 0.4 });
    const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.6, 2.6), wallMat); cellGrp.add(wallMesh);

    const membMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, transparent: true, opacity: 0.34, roughness: 0.3 });
    const membMesh = new THREE.Mesh(new THREE.SphereGeometry(1.45, 32, 24), membMat); cellGrp.add(membMesh);

    const innerGrp = new THREE.Group(); cellGrp.add(innerGrp);
    const nucMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x6d28d9, emissiveIntensity: 0.35, roughness: 0.35 });
    const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 18), nucMat); innerGrp.add(nucleus);

    const vacMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.42, roughness: 0.2 });
    const vacuole = new THREE.Mesh(new THREE.SphereGeometry(0.68, 22, 18), vacMat); vacuole.position.set(-0.55, 0, 0); innerGrp.add(vacuole);

    const mitos = [];
    for (let i = 0; i < 3; i++) {
      const m = new THREE.Mesh(new THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.11, 0.26, 6, 10) : new THREE.CylinderGeometry(0.11, 0.11, 0.36, 10),
        new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.4 }));
      m.position.set((i - 1) * 0.7, -0.45 + (i % 2) * 0.85, 0.35 - i * 0.25);
      m.rotation.z = 0.6 * i;
      innerGrp.add(m); mitos.push(m);
    }
    const chloros = [];
    for (let i = 0; i < 4; i++) {
      const c = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), new THREE.MeshStandardMaterial({ color: 0x16a34a, emissive: 0x15803d, emissiveIntensity: 0.3 }));
      c.scale.set(1.4, 0.7, 1.0);
      c.position.set(Math.cos(i * 1.6) * 1.0, Math.sin(i * 1.6) * 0.55, 0.3);
      innerGrp.add(c); chloros.push(c);
    }

    const orgTag = labelSprite(THREE, "Plant Cell", "पादप कोशिका", { scale: 0.95, size: 28 });
    orgTag.position.set(0, 2.05, 0); scene.add(orgTag);

    /* H2O water molecules streaming across membrane */
    const h2os = [];
    const hGeo = new THREE.SphereGeometry(0.08, 10, 8);
    const hMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    for (let i = 0; i < 36; i++) {
      const m = new THREE.Mesh(hGeo, hMat);
      const ang = (i / 36) * Math.PI * 2;
      const phi = ((i * 7) % 11) / 11 - 0.5;
      scene.add(m);
      h2os.push({ m, ang, phi, r: 1.0 + (i % 6) * 0.38 });
    }

    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    const hc = el("span"), hf = el("span"); hud.append(hc, hf);

    let spot = null, t = 0, divMode = 0; // 0=Osmosis, 1=Mitosis (2×2n), 2=Meiosis (4×n)
    const divCloneGrp = new THREE.Group(); scene.add(divCloneGrp);
    const refresh = () => {
      while (divCloneGrp.children.length) divCloneGrp.remove(divCloneGrp.children.pop());
      cellGrp.visible = divMode === 0;
      if (divMode > 0) {
        const cnt = divMode === 1 ? 2 : 4, r = divMode === 1 ? 1.15 : 0.72;
        for (let i = 0; i < cnt; i++) {
          const ang = (i / cnt) * Math.PI * 2;
          const dc = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), new THREE.MeshStandardMaterial({ color: divMode === 1 ? 0x38bdf8 : 0xf472b6, transparent: true, opacity: 0.45 }));
          dc.position.set(Math.cos(ang) * 1.6, Math.sin(ang) * (cnt === 4 ? 1.1 : 0.2), 0);
          const dn = new THREE.Mesh(new THREE.SphereGeometry(r * 0.32, 12, 10), new THREE.MeshStandardMaterial({ color: 0xa855f7 }));
          dn.position.copy(dc.position); divCloneGrp.add(dc, dn);
        }
        const tag = labelSprite(THREE, divMode === 1 ? "Mitosis (2n → 2 × 2n)" : "Meiosis (2n → 4 × n)", divMode === 1 ? "Growth & repair · समसूत्री" : "Gamete formation · अर्धसूत्री", { scale: 0.9, size: 24, color: "#e0f2fe" });
        orgTag.material.map.dispose(); orgTag.material.map = tag.material.map; orgTag.scale.copy(tag.scale);
        hc.textContent = divMode === 1 ? "Mitosis: 2 identical diploid (2n) cells" : "Meiosis: 4 haploid (n) gametes";
        hf.textContent = divMode === 1 ? "1 division · chromosome number unchanged" : "2 divisions · half chromosomes";
        return;
      }
      const O = view(ctx.vars);
      wallMesh.visible = O.hasCellWall;
      if (O.cellType === 1) {
        wallMesh.scale.set(1, 1, 1); wallMat.color.setHex(0x22c55e);
        membMesh.scale.set(1.22 * O.volScale, 0.78 * O.volScale, 0.78 * O.volScale);
        membMat.color.setHex(0xfacc15);
      } else if (O.cellType === 0) {
        membMesh.scale.set(1.05 * O.volScale, 0.65 * O.volScale, 1.05 * O.volScale);
        membMat.color.setHex(0xf43f5e);
      } else {
        wallMesh.scale.set(1.05, 0.62, 0.62); wallMat.color.setHex(0xeab308);
        membMesh.scale.set(1.25 * O.volScale, 0.52 * O.volScale, 0.52 * O.volScale);
        membMat.color.setHex(0xfef08a);
      }
      vacuole.visible = O.cellType === 1;
      vacuole.scale.setScalar(O.volScale);
      mitos.forEach(m => { m.visible = O.hasNucleus; m.material.emissiveIntensity = spot === "mito" ? 1.4 : 0.4; });
      chloros.forEach(c => { c.visible = O.hasChloroplast; c.material.emissiveIntensity = spot === "chloro" ? 1.4 : 0.3; });
      nucleus.scale.setScalar(O.hasNucleus ? 1 : 0.65);
      nucleus.position.set(O.cellType === 1 ? 0.65 : 0, 0, 0);
      nucMat.color.setHex(O.hasNucleus ? 0x8b5cf6 : 0xf472b6);
      nucMat.emissiveIntensity = spot === "nuc" ? 1.4 : 0.35;
      wallMat.opacity = spot === "wall" ? 0.6 : 0.25;

      const tag = labelSprite(THREE, O.cellName, O.state, { scale: 0.95, size: 26, color: "#e0f2fe" });
      orgTag.material.map.dispose(); orgTag.material.map = tag.material.map; orgTag.scale.copy(tag.scale);

      hc.textContent = `${O.cellName} · ${TON_NAMES[O.tonicity][0]}`;
      hf.textContent = O.state;
    };

    const stopFrame = st.onFrame(dt => {
      const O = view(ctx.vars);
      t += dt * O.rate;
      cellGrp.rotation.y = Math.sin(t * 0.25) * 0.22;
      h2os.forEach((p, idx) => {
        if (O.tonicity < 0) { p.r -= dt * 0.85 * O.rate; if (p.r < 0.7) p.r = 2.9; }
        else if (O.tonicity > 0) { p.r += dt * 0.85 * O.rate; if (p.r > 2.9) p.r = 0.7; }
        else { p.r = 1.65 + Math.sin(t * 2 + idx) * 0.45; }
        const rr = p.r;
        p.m.position.set(Math.cos(p.ang + t * 0.2) * rr * 1.25, p.phi * 1.4, Math.sin(p.ang + t * 0.2) * rr * 0.9);
      });
    });

    /* side panel */
    const side = ctx.side; side.replaceChildren();
    const segC = el("div", "cl-seg"); segC.setAttribute("role", "group"); segC.setAttribute("aria-label", "Cell Type");
    const cBtns = CELL_TYPES.map((c, idx) => {
      const b = el("button", "cl-opt" + (ctx.vars.cellType === idx ? " on" : ""), c.name.split(" ")[0]);
      b.type = "button";
      b.onclick = () => { ctx.set("cellType", idx); sfx.play("pop"); cBtns.forEach((x, j) => x.classList.toggle("on", j === idx)); };
      segC.appendChild(b); return b;
    });
    side.appendChild(el("h3", "cl-h", "Cell Type · कोशिका")); side.appendChild(segC);

    const segT = el("div", "cl-seg"); segT.setAttribute("role", "group"); segT.setAttribute("aria-label", "Solution Tonicity");
    const tVals = [-1, 0, 1], tLabs = ["Hypotonic", "Isotonic", "Hypertonic"];
    const tBtns = tVals.map((tv, idx) => {
      const b = el("button", "cl-opt" + (ctx.vars.tonicity === tv ? " on" : ""), tLabs[idx]);
      b.type = "button";
      b.onclick = () => { ctx.set("tonicity", tv); sfx.play("pop"); tBtns.forEach((x, j) => x.classList.toggle("on", tVals[j] === tv)); };
      segT.appendChild(b); return b;
    });
    side.appendChild(el("h3", "cl-h", "External Solution · बाहरी विलयन")); side.appendChild(segT);

    const sl = sliders(ctx, side, { skip: ["cellType", "tonicity"] });

    /* Organelle Spotlight buttons */
    const spotBox = el("div", "cl-presets"); spotBox.appendChild(el("span", "cl-lab", "🔬 Spotlight · कोशिकांग"));
    const spotInfo = el("p", "cl-note", "Tap an organelle to spotlight it in 3D.");
    [["nuc", "Nucleus/DNA"], ["mito", "Mitochondria"], ["chloro", "Chloroplast"], ["wall", "Cell Wall"]].forEach(([k, lbl]) => {
      actionButton(spotBox, lbl, () => {
        divMode = 0;
        spot = spot === k ? null : k;
        sfx.play("tick");
        const desc = {
          nuc: "Nucleus (Eukaryote) has a nuclear membrane & chromosomes; Prokaryotes have a naked Nucleoid.",
          mito: "Mitochondria: Powerhouse of the cell — generates ATP energy for cellular work!",
          chloro: "Chloroplasts (Plant only): Contain chlorophyll for photosynthesis.",
          wall: "Cell Wall (Plant & Bacteria): Rigid outer boundary that prevents bursting in pure water!"
        };
        spotInfo.textContent = spot ? desc[spot] : "Tap an organelle to spotlight it in 3D.";
        refresh();
      }, "cl-chipb");
    });
    [["Mitosis (2n→2×2n)", 1], ["Meiosis (2n→4×n)", 2]].forEach(([lbl, dm]) => {
      actionButton(spotBox, lbl, () => {
        divMode = divMode === dm ? 0 : dm;
        sfx.play("pop");
        spotInfo.textContent = divMode === 1 ? "Mitosis: 1 division → 2 genetically identical daughter cells (2n) for growth/repair." : divMode === 2 ? "Meiosis: 2 divisions → 4 genetically varied gametes with half chromosomes (n)!" : "Returned to Osmosis Cell View.";
        refresh();
      }, "cl-chipb");
    });
    side.appendChild(spotBox); side.appendChild(spotInfo);

    const facts = factsView(ctx, side);
    note(side, "Osmosis is the movement of water across a selectively permeable membrane from higher water concentration (hypotonic) to lower water concentration (hypertonic).", "परासरण अर्धपारगम्य झिल्ली से होकर उच्च जल सांद्रता से निम्न जल सांद्रता की ओर जल का प्रवाह है।");

    const off = bus.on("sim:change", e => {
      if (e.labId !== "cell") return;
      refresh(); facts.update(); sl.sync();
      cBtns.forEach((b, j) => b.classList.toggle("on", j === ctx.vars.cellType));
      tBtns.forEach((b, j) => b.classList.toggle("on", tVals[j] === ctx.vars.tonicity));
    });
    refresh(); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ cellType: seen(q, "cellType"), tonicity: seen(q, "tonicity"), temp: seen(q, "temp") });

    /* 1 · osmosis direction */
    {
      const x = v(), O = view(x);
      const ans = O.tonicity < 0 ? ["Water moves INWARD (endosmosis)", "जल अंदर जाता है (अंतःपरासरण)"] : O.tonicity > 0 ? ["Water moves OUTWARD (exosmosis)", "जल बाहर जाता है (बहिःपरासरण)"] : ["Equal water moves in and out (no net change)", "जल अंदर व बाहर बराबर जाता है (कोई शुद्ध बदलाव नहीं)"];
      const pool = [
        ["Water moves INWARD (endosmosis)", "जल अंदर जाता है (अंतःपरासरण)"],
        ["Water moves OUTWARD (exosmosis)", "जल बाहर जाता है (बहिःपरासरण)"],
        ["Equal water moves in and out (no net change)", "जल अंदर व बाहर बराबर जाता है (कोई शुद्ध बदलाव नहीं)"],
        ["Salt crosses inward rapidly while water freezes", "नमक तेज़ी से अंदर जाता है और जल रुक जाता है"]
      ];
      const d = withDistractors(ans, pool, 3, q.rnd);
      out.push(ask({
        id: "cell-osmosis-dir",
        prompt: [`This ${O.cellName} is placed in a ${TON_NAMES[O.tonicity][0]} bath. What is the net movement of water?`, `यह ${O.cellHi} ${TON_NAMES[O.tonicity][1]} विलयन में रखी है। जल का शुद्ध प्रवाह किस दिशा में होगा?`],
        image: { vars: x },
        options: d.options, correct: d.correct,
        why: ["Water moves by osmosis from higher water concentration (lower solute) to lower water concentration (higher solute) across the plasma membrane.", "परासरण में जल अधिक जल सांद्रता से कम जल सांद्रता वाले क्षेत्र की ओर जाता है।"]
      }));
    }

    /* 2 · why plant cells don't burst in pure water */
    {
      const x = { ...v(), cellType: 1, tonicity: -1 };
      const c = ["Its rigid cellulose cell wall exerts inward wall pressure", "इसकी कठोर सेल्यूलोज़ कोशिका भित्ति अंदर की ओर दाब डालती है"];
      const pool = [
        ["Mitochondria pump out all water", "माइटोकॉन्ड्रिया सारा जल बाहर पंप कर देते हैं"],
        ["Plant cells have no plasma membrane", "पादप कोशिका में प्लाज़्मा झिल्ली नहीं होती"],
        ["Chloroplasts freeze the cytoplasm", "हरितलवक कोशिकाद्रव्य को जमा देते हैं"]
      ];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "cell-wall",
        prompt: ["In pure water (hypotonic), an animal RBC swells and bursts, whereas a plant cell becomes turgid without bursting. Why?", "शुद्ध जल में जंतु कोशिका (RBC) फट जाती है, लेकिन पादप कोशिका स्फीत होकर भी नहीं फटती। क्यों?"],
        image: { vars: x },
        options: d.options, correct: d.correct,
        why: ["The strong outer cell wall resists swelling by exerting equal wall pressure, keeping plant cells firm (turgid).", "मज़बूत बाहरी कोशिका भित्ति बराबर भित्ति-दाब लगाकर कोशिका को फटने से बचाती है।"]
      }));
    }

    /* 3 · plasmolysis */
    {
      const x = { ...v(), cellType: 1, tonicity: 1 };
      const c = ["Plasmolysis — protoplast shrinks away from the cell wall", "जीवद्रव्यकुंचन — जीवद्रव्य कोशिका भित्ति से सिकुड़कर अलग होता है"];
      const pool = [
        ["Endosmosis — cell swells and bursts", "अंतःपरासरण — कोशिका फूलकर फट जाती है"],
        ["Mitosis — cell divides immediately", "समसूत्री विभाजन — कोशिका तुरंत विभाजित होती है"],
        ["No change occurs at all", "कोई परिवर्तन नहीं होता"]
      ];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "cell-plasmolysis",
        prompt: ["A living plant cell is placed in concentrated salt solution (hypertonic). What phenomenon occurs as water leaves it?", "जीवित पादप कोशिका को गाढ़े नमक के घोल (अतिपरासारी) में रखने पर क्या होता है?"],
        image: { vars: x },
        options: d.options, correct: d.correct,
        why: ["Water exits by exosmosis, causing the plasma membrane and cytoplasm to shrink away from the rigid cell wall — called plasmolysis.", "बहिःपरासरण से जल बाहर निकलता है और झिल्ली भित्ति से सिकुड़कर अलग हो जाती है — इसे जीवद्रव्यकुंचन कहते हैं।"]
      }));
    }

    /* 4 · prokaryote vs eukaryote */
    {
      const x = { ...v(), cellType: 2 };
      const c = ["Nucleoid without a nuclear membrane (prokaryotic)", "बिना केंद्रक झिल्ली वाला केंद्रकाभ (प्रोकैरियोटिक)"];
      const pool = [
        ["Large central vacuole and chloroplasts", "बड़ी केंद्रीय रसधानी व हरितलवक"],
        ["Double-membrane bound nucleus and mitochondria", "दोहरी झिल्ली वाला केंद्रक व माइटोकॉन्ड्रिया"],
        ["Cellulose cell wall with Golgi apparatus", "सेल्यूलोज़ भित्ति व गॉल्जीकाय"]
      ];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "cell-prokaryote",
        prompt: ["Look at this bacterial cell. Which feature defines it as a Prokaryote?", "इस जीवाणु कोशिका को देखो। कौन-सा लक्षण इसे प्रोकैरियोट बनाता है?"],
        image: { vars: x },
        options: d.options, correct: d.correct,
        why: ["Prokaryotes lack a nuclear membrane (DNA lies in a nucleoid region) and lack membrane-bound organelles.", "प्रोकैरियोट में केंद्रक झिल्ली व झिल्ली-बद्ध कोशिकांग नहीं होते; DNA केंद्रकाभ (nucleoid) में रहता है।"]
      }));
    }

    /* 5 · organelle identification */
    {
      const x = { ...v(), cellType: 1 };
      const c = ["Mitochondria", "माइटोकॉन्ड्रिया"];
      const pool = [["Lysosome", "लाइसोसोम"], ["Cell wall", "कोशिका भित्ति"], ["Ribosome", "राइबोसोम"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "cell-organelle",
        prompt: ["Which highlighted organelle releases cellular energy in the form of ATP and is called the powerhouse of the cell?", "कौन-सा कोशिकांग ATP के रूप में ऊर्जा मुक्त करता है और कोशिका का बिजलीघर कहलाता है?"],
        image: { vars: x, focus: "mito" },
        options: d.options, correct: d.correct,
        why: ["Mitochondria have folded inner membranes that carry out cellular respiration to produce ATP.", "माइटोकॉन्ड्रिया में ATP बनाने की रासायनिक अभिक्रियाएँ होती हैं, इसलिए इसे ऊर्जागृह कहते हैं।"]
      }));
    }

    /* 6 · predict: moving from isotonic to hypertonic */
    {
      const x = { ...v(), cellType: 0, tonicity: 1 };
      const c = ["Water exits and the cell shrinks (crenates)", "जल बाहर निकलता है और कोशिका सिकुड़ती है"];
      const pool = [
        ["Water rushes in and the cell bursts", "जल अंदर आता है और कोशिका फट जाती है"],
        ["The cell grows a rigid cell wall", "कोशिका में कठोर भित्ति बन जाती है"],
        ["Nothing changes — water never crosses", "कुछ नहीं बदलता — जल झिल्ली पार नहीं करता"]
      ];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "cell-predict", kind: "predict",
        prompt: ["A normal red blood cell (0.9% salt) is dropped into 4% concentrated salt water. What will happen next?", "सामान्य लाल रक्त कोशिका (0.9% लवण) को 4% गाढ़े नमक के पानी में डालने पर क्या होगा?"],
        image: { vars: x },
        options: d.options, correct: d.correct,
        why: ["The outside solution is hypertonic (less water concentration), so water leaves the RBC by exosmosis and it shrinks.", "बाहरी घोल अतिपरासारी है, इसलिए बहिःपरासरण से जल बाहर निकलता है और कोशिका सिकुड़ जाती है।"]
      }));
    }

    return out;
  }
};
