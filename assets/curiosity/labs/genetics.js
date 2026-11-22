/* Curiosity Lab · Genetics & Heredity Lab (NCERT Class X, Ch 8 Heredity).
   Cross Tall/Dwarf pea parents (TT, Tt, tt) in 3D, watch Punnett Square genotype & phenotype ratios update live,
   explore dominant vs recessive traits and human XX/XY sex determination! */
import { bus } from "../core.js";
import { geneticsModel } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const GENO_CODES = ["TT", "Tt", "tt"];
const view = v => geneticsModel({ p1: v.p1, p2: v.p2, cross: v.cross });

function snapshot(canvas, vars, focus) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#0e1522"), G = view(vars);
  if (G.cross === 1) {
    C2.text(g, "Human Sex Determination · Mother (XX) × Father (XY)", 360, 22, { size: 15, color: "#93c5fd" });
    const cols = ["X", "Y"], rows = ["X", "X"];
    C2.text(g, "Father →", 360, 56, { size: 13, color: "#bae6fd" });
    cols.forEach((c, ci) => C2.text(g, c, 285 + ci * 150, 82, { size: 16, color: "#60a5fa" }));
    rows.forEach((r, ri) => C2.text(g, r, 185, 132 + ri * 78, { size: 16, color: "#f472b6" }));
    rows.forEach((r, ri) => cols.forEach((c, ci) => {
      const z = r + c, isBoy = z === "XY";
      C2.rect(g, 225 + ci * 150, 96 + ri * 78, 120, 64, { stroke: isBoy ? "#60a5fa" : "#f472b6", fill: isBoy ? "rgba(59,130,246,0.22)" : "rgba(244,114,182,0.22)", lw: 2, r: 8 });
      C2.text(g, `${z} (${isBoy ? "Boy" : "Girl"})`, 285 + ci * 150, 128 + ri * 78, { size: 14, color: "#f8fafc" });
    }));
    C2.text(g, "Probability: 50% Girl (XX) · 50% Boy (XY) — Father's gamete decides!", 360, 300, { size: 14, color: "#ffd23f" });
    return canvas;
  }

  C2.text(g, focus === "blind" ? `Punnett Square Cross: ${G.g1} × ${G.g2}` : `Pea Cross ${G.g1} × ${G.g2} · Tall ${G.tallPct}% : Dwarf ${G.dwarfPct}%`, 360, 22, { size: 15, color: "#86efac" });
  const a1 = G.g1.split(""), a2 = G.g2.split("");
  C2.text(g, `Parent 2 (${G.g2}) →`, 360, 54, { size: 13, color: "#cbd5e1" });
  a2.forEach((al, ci) => C2.text(g, al, 285 + ci * 150, 80, { size: 16, color: "#ffd23f" }));
  a1.forEach((al, ri) => C2.text(g, al, 185, 132 + ri * 78, { size: 16, color: "#ffd23f" }));
  G.cells.forEach((z, idx) => {
    const ri = Math.floor(idx / 2), ci = idx % 2, tall = z.includes("T");
    C2.rect(g, 225 + ci * 150, 96 + ri * 78, 120, 64, { stroke: tall ? "#4ade80" : "#fb923c", fill: tall ? "rgba(74,222,128,0.22)" : "rgba(251,146,60,0.22)", lw: 2, r: 8 });
    C2.text(g, `${z} (${tall ? "Tall" : "Dwarf"})`, 285 + ci * 150, 128 + ri * 78, { size: 14, color: "#f8fafc" });
  });
  C2.text(g, G.ratioText, 360, 300, { size: 14, color: "#bae6fd" });
  return canvas;
}

export default {
  id: "genetics", cls: 10, unit: "x/ch8", icon: "🧬",
  title: { en: "Genetics & Heredity Lab — Mendel & Punnett", hi: "आनुवंशिकता प्रयोगशाला — मेंडल व पनेट वर्ग" },
  blurb: { en: "Cross Tall & Dwarf pea plants (TT, Tt, tt) in 3D, watch the rotating DNA helix and Punnett offspring, or test human XX/XY inheritance!", hi: "लंबे व बौने मटर के पौधों का संकरण (TT, Tt, tt), 3D DNA द्वि-कुंडलिनी और मानव XX/XY लिंग निर्धारण देखो!" },
  vars: [
    { id: "p1", label: { en: "Parent 1 genotype", hi: "जनक 1 जीनप्ररूप" }, unit: "", min: 0, max: 2, step: 1, value: 1 },
    { id: "p2", label: { en: "Parent 2 genotype", hi: "जनक 2 जीनप्ररूप" }, unit: "", min: 0, max: 2, step: 1, value: 1 },
    { id: "cross", label: { en: "Mode (0=Pea Cross, 1=Sex XX/XY)", hi: "मोड (0=मटर संकरण, 1=लिंग XX/XY)" }, unit: "", min: 0, max: 1, step: 1, value: 0 }
  ],
  facts(v) {
    const G = view(v);
    if (G.cross === 1) {
      return [
        { id: "cross", en: "Parental chromosomes", hi: "जनक गुणसूत्र", value: "Mother XX × Father XY" },
        { id: "off", en: "Offspring outcomes", hi: "संतति परिणाम", value: G.ratioText },
        { id: "rule", en: "Who determines biological sex?", hi: "लिंग निर्धारण किससे?", value: "Father's sperm (X or Y chromosome)" },
        { id: "auto", en: "Human chromosome count", hi: "मानव गुणसूत्र संख्या", value: "23 pairs (46 total = 22 autosomes + 1 sex pair)" }
      ];
    }
    return [
      { id: "cross", en: "Mendelian cross", hi: "मेंडल संकरण", value: `${G.g1} × ${G.g2} → [${G.cells.join(", ")}]` },
      { id: "pheno", en: "Phenotype split", hi: "लक्षणप्ररूप", value: `${G.tallPct}% Tall : ${G.dwarfPct}% Dwarf` },
      { id: "geno", en: "Genotype & Phenotype ratio", hi: "जीनप्ररूप व लक्षणप्ररूप अनुपात", value: G.ratioText },
      { id: "law", en: "Dominant vs Recessive", hi: "प्रभावी बनाम अप्रभावी", value: "T (Tall) masks t (Dwarf) in Tt heterozygote" }
    ];
  },
  snapshot,
  missions: [
    { id: "gen-f2", en: "Cross two hybrids (Tt × Tt) to obtain Mendel's classic 3:1 F₂ ratio!", hi: "दो संकर (Tt × Tt) का संकरण कर मेंडल का 3:1 F₂ अनुपात प्राप्त करो!", check: v => v.cross === 0 && v.p1 === 1 && v.p2 === 1 },
    { id: "gen-test", en: "Perform a test cross (Tt × tt) to see an exact 50% Tall : 50% Dwarf split!", hi: "परीक्षार्थ संकरण (Tt × tt) से 50% लंबा : 50% बौना अनुपात देखो!", check: v => v.cross === 0 && ((v.p1 === 1 && v.p2 === 2) || (v.p1 === 2 && v.p2 === 1)) },
    { id: "gen-sex", en: "Switch to Human XX/XY Sex Determination mode!", hi: "मानव XX/XY लिंग निर्धारण मोड पर स्विच करो!", check: v => v.cross === 1 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [0, 2.2, 8.8], target: [0, 0.3, 0], bg: 0x0e1522, minDist: 4, maxDist: 16 });
    const { scene } = st, dyn = new THREE.Group(); scene.add(dyn);
    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    const h1 = el("span"), h2 = el("span"); hud.append(h1, h2);

    const dna = new THREE.Group(); dna.position.set(-3.1, 0.2, 0); scene.add(dna);
    for (let i = 0; i < 14; i++) {
      const y = (i - 6.5) * 0.32, ang = i * 0.55;
      const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
      const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), new THREE.MeshStandardMaterial({ color: 0xf472b6 }));
      b1.position.set(Math.cos(ang) * 0.55, y, Math.sin(ang) * 0.55);
      b2.position.set(-Math.cos(ang) * 0.55, y, -Math.sin(ang) * 0.55);
      const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 6), new THREE.MeshStandardMaterial({ color: i % 2 ? 0xfacc15 : 0x4ade80 }));
      rung.position.set(0, y, 0); rung.rotation.z = Math.PI / 2; rung.rotation.y = -ang;
      dna.add(b1, b2, rung);
    }

    let evoMode = ctx.preset?.sub === "evolution";
    const rebuild = () => {
      while (dyn.children.length) {
        const c = dyn.children.pop();
        c.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); }); });
      }
      if (evoMode) {
        /* Evolution & Natural Selection: Homologous (Common Ancestor -> Divergent) vs Analogous (Convergent) */
        const comps = [
          [-0.8, 0.85, 0x38bdf8, "Homologous: Human Arm & Whale Flipper", "Same pentadactyl bone plan → divergent evolution"],
          [1.6, 0.85, 0x4ade80, "Homologous: Bird Wing & Lizard Forelimb", "Inherited from common tetrapod ancestor"],
          [0.4, -0.85, 0xf97316, "Analogous: Bird Wing vs Butterfly Wing", "Different origin, same flight function → convergent"]
        ];
        comps.forEach(([x, y, col, t1, t2]) => {
          const box = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.15, 0.25), new THREE.MeshStandardMaterial({ color: col, roughness: 0.4 }));
          box.position.set(x, y, 0); dyn.add(box);
          const lb = labelSprite(THREE, t1, t2, { scale: 0.56, size: 18, color: "#fff" });
          lb.position.set(x, y, 0.32); dyn.add(lb);
        });
        h1.textContent = "Evolution: Homologous vs Analogous";
        h2.textContent = "Darwin's Natural Selection & Fossils";
        return;
      }
      const G = view(ctx.vars);
      const coords = [[-0.2, 1.1], [1.7, 1.1], [-0.2, -0.7], [1.7, -0.7]];
      if (G.cross === 1) {
        ["XX", "XY", "XX", "XY"].forEach((z, idx) => {
          const [x, y] = coords[idx];
          const boy = z === "XY";
          const tile = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.25, 0.25), new THREE.MeshStandardMaterial({ color: boy ? 0x2563eb : 0xdb2777, roughness: 0.4 }));
          tile.position.set(x, y, 0); dyn.add(tile);
          const lbl = labelSprite(THREE, z, boy ? "Boy (50%)" : "Girl (50%)", { scale: 0.58, size: 22, color: "#fff" });
          lbl.position.set(x, y, 0.32); dyn.add(lbl);
        });
        h1.textContent = "Mother (XX) × Father (XY)";
        h2.textContent = "50% Girl (XX) · 50% Boy (XY)";
      } else {
        G.cells.forEach((z, idx) => {
          const [x, y] = coords[idx], tall = z.includes("T");
          const pad = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.22, 1.0), new THREE.MeshStandardMaterial({ color: 0x334155 }));
          pad.position.set(x, y - 0.52, 0); dyn.add(pad);
          const h = tall ? 1.15 : 0.45;
          const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, h, 10), new THREE.MeshStandardMaterial({ color: tall ? 0x22c55e : 0xfb923c }));
          stem.position.set(x, y - 0.4 + h / 2, 0); dyn.add(stem);
          const crown = new THREE.Mesh(new THREE.SphereGeometry(tall ? 0.3 : 0.2, 12, 10), new THREE.MeshStandardMaterial({ color: tall ? 0x4ade80 : 0xfdba74 }));
          crown.position.set(x, y - 0.4 + h, 0); dyn.add(crown);
          const lbl = labelSprite(THREE, z, tall ? "Tall" : "Dwarf", { scale: 0.52, size: 22, color: tall ? "#bbf7d0" : "#fed7aa" });
          lbl.position.set(x, y - 0.85, 0.45); dyn.add(lbl);
        });
        h1.textContent = `Cross ${G.g1} × ${G.g2} · Tall ${G.tallPct}% : Dwarf ${G.dwarfPct}%`;
        h2.textContent = G.ratioText;
      }
    };

    const stopFrame = st.onFrame(dt => { dna.rotation.y += dt * 0.9; });

    const side = ctx.side; side.replaceChildren();
    const sl = sliders(ctx, side);
    const presets = el("div", "cl-presets"); presets.appendChild(el("span", "cl-lab", "Crosses · संकरण"));
    [["F₁ (TT×tt)", 0, 2, 0], ["F₂ (Tt×Tt)", 1, 1, 0], ["Test (Tt×tt)", 1, 2, 0], ["Human XX×XY", 1, 1, 1]].forEach(([lbl, a, b, c]) => {
      actionButton(presets, lbl, () => { evoMode = false; ctx.set("p1", a); ctx.set("p2", b); ctx.set("cross", c); sfx.play("pop"); sl.sync(); rebuild(); }, "cl-chipb");
    });
    actionButton(presets, "🦴 Evolution & Fossils", () => { evoMode = !evoMode; sfx.play("pop"); rebuild(); }, "cl-chipb");
    side.insertBefore(presets, sl.root.nextSibling);

    const facts = factsView(ctx, side);
    note(side, "Mendel's F₁ (TT × tt) yields 100% Tall hybrids (Tt). Selfing F₁ (Tt × Tt) reveals the hidden recessive trait in a 3:1 phenotypic ratio (1 TT : 2 Tt : 1 tt)!", "मेंडल के F₁ में सभी पौधे लंबे (Tt) होते हैं। F₂ (Tt × Tt) में 3:1 लक्षणप्ररूप व 1:2:1 जीनप्ररूप अनुपात मिलता है!");

    const off = bus.on("sim:change", e => {
      if (e.labId !== "genetics") return;
      rebuild(); facts.update(); sl.sync();
    });
    rebuild(); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ p1: seen(q, "p1"), p2: seen(q, "p2"), cross: 0 });
    {
      const x = { p1: 1, p2: 1, cross: 0 };
      const c = ["3 Tall : 1 Dwarf (75% Tall, 25% Dwarf)", "3 लंबे : 1 बौना (75% लंबे, 25% बौने)"];
      const pool = [["1 Tall : 1 Dwarf", "1 लंबा : 1 बौना"], ["100% Dwarf", "100% बौने"], ["2 Tall : 2 Dwarf", "2 लंबे : 2 बौने"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "gen-f2", prompt: ["When two hybrid tall pea plants (Tt × Tt) are crossed, what is the F₂ phenotypic ratio?", "दो संकर लंबे मटर पौधों (Tt × Tt) के संकरण पर F₂ लक्षणप्ररूप अनुपात क्या होगा?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Tt × Tt produces TT, Tt, Tt, and tt — three Tall plants to one Dwarf plant (3:1).", "Tt × Tt से TT, Tt, Tt, tt बनते हैं — अर्थात 3 लंबे व 1 बौना (3:1)।"]
      }));
    }
    {
      const x = { p1: 0, p2: 2, cross: 0 };
      const c = ["100% Tall (all Tt)", "100% लंबे (सभी Tt)"];
      const pool = [["50% Tall, 50% Dwarf", "50% लंबे, 50% बौने"], ["100% Dwarf (all tt)", "100% बौने"], ["75% Tall, 25% Dwarf", "75% लंबे, 25% बौने"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "gen-f1", prompt: ["What are the F₁ offspring when a pure Tall (TT) pea plant is crossed with a pure Dwarf (tt) plant?", "शुद्ध लंबे (TT) और शुद्ध बौने (tt) पौधे के संकरण से F₁ पीढ़ी कैसी होगी?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Every offspring gets T from TT and t from tt, giving 100% Tt — all phenotypically Tall because T is dominant.", "सभी संतति को T और t मिलने से 100% Tt (प्रभावी T के कारण सभी लंबे) प्राप्त होते हैं।"]
      }));
    }
    {
      const x = { p1: 1, p2: 1, cross: 0 };
      const c = ["1 TT : 2 Tt : 1 tt", "1 TT : 2 Tt : 1 tt"];
      const pool = [["3 TT : 1 tt", "3 TT : 1 tt"], ["2 TT : 1 Tt : 1 tt", "2 TT : 1 Tt : 1 tt"], ["4 Tt : 0 tt", "4 Tt : 0 tt"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "gen-geno", prompt: ["In a monohybrid F₂ cross (Tt × Tt), what is the exact GENOTYPIC ratio?", "एकसंकर F₂ संकरण (Tt × Tt) में सटीक जीनप्ररूप (Genotypic) अनुपात क्या है?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["The four Punnett squares are 1 homozygous tall (TT), 2 heterozygous tall (Tt), and 1 homozygous dwarf (tt).", "पनेट वर्ग में 1 TT, 2 Tt तथा 1 tt — अर्थात 1:2:1 अनुपात मिलता है।"]
      }));
    }
    {
      const x = { p1: 1, p2: 1, cross: 1 };
      const c = ["Father's sperm (carries either X or Y)", "पिता का शुक्राणु (जिसमें X या Y गुणसूत्र होता है)"];
      const pool = [["Mother's egg (carries either X or Y)", "माता का अंडाणु"], ["Temperature of the womb", "गर्भ का तापमान"], ["Mother's blood group", "माता का रक्त समूह"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "gen-sex", prompt: ["In humans, which parent's gamete determines whether the child is a boy (XY) or a girl (XX)?", "मनुष्यों में बच्चे का लिंग (XX या XY) किस जनक के युग्मक पर निर्भर करता है?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["All eggs carry X, while sperm carry either X (→ XX girl) or Y (→ XY boy) with 50% probability each.", "माता के सभी अंडाणु में X होता है; पिता के शुक्राणु का X या Y गुणसूत्र ही लिंग तय करता है।"]
      }));
    }
    {
      const x = v(), G = view(x), P = p => [`${p}% Tall`, `${p}% लंबे`];
      const c = P(G.tallPct);
      const alts = [0, 25, 50, 75, 100].filter(p => p !== G.tallPct).map(P);
      const d = withDistractors(c, alts, 3, q.rnd);
      out.push(ask({
        id: "gen-pct", prompt: [`For the cross ${G.g1} × ${G.g2}, what percentage of offspring will be TALL?`, `${G.g1} × ${G.g2} संकरण में कितने प्रतिशत संतति लंबे (Tall) होंगे?`],
        image: { vars: x, focus: "blind" }, options: d.options, correct: d.correct,
        why: [`Out of 4 Punnett combinations (${G.cells.join(", ")}), ${G.tallPct / 25} contain dominant allele T → ${G.tallPct}% Tall.`, `4 में से ${G.tallPct / 25} संतति में प्रभावी T एलील होने से ${G.tallPct}% लंबे होंगे।`]
      }));
    }
    {
      const x = { p1: 1, p2: 2, cross: 0 };
      const c = ["50% Tall (Tt) and 50% Dwarf (tt)", "50% लंबे (Tt) व 50% बौने (tt)"];
      const pool = [["100% Tall (TT)", "100% लंबे"], ["75% Tall : 25% Dwarf", "75% लंबे : 25% बौने"], ["100% Dwarf (tt)", "100% बौने"]];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "gen-predict", kind: "predict", prompt: ["A tall plant of unknown genotype is test-crossed with a dwarf plant (tt). Half the seeds grow dwarf! What was the tall parent's genotype, and what is the ratio?", "अज्ञात जीनप्ररूप वाले लंबे पौधे का संकरण बौने (tt) से कराने पर आधे पौधे बौने उगे। अनुपात क्या है?"],
        image: { vars: x }, options: d.options, correct: d.correct,
        why: ["Seeing dwarf (tt) offspring proves the tall parent was heterozygous (Tt), yielding 50% Tt (Tall) and 50% tt (Dwarf).", "आधे बौने पौधे तभी आते हैं जब लंबा जनक Tt हो — इससे 50% Tt और 50% tt मिलते हैं।"]
      }));
    }
    return out;
  }
};
