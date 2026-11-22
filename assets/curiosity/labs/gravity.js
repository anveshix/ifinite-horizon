/* Curiosity Lab · Gravity & Motion Lab (NCERT Class IX, Ch 9 Motion / Free Fall).
   Drop a heavy ball next to a light reference pebble in vacuum on Moon, Earth, or Jupiter:
   both hit together (g is independent of m), while Weight W = m·g changes across worlds! */
import { bus } from "../core.js";
import { PLANETS, freeFall, fmt } from "./models.js";
import { sound as sfx } from "../quiz/fx.js";
import { loadThree, makeStage, labelSprite, sliders, factsView, note, actionButton, el, C2, ask, seen, withDistractors } from "./kit.js";

const view = v => freeFall({ planet: v.planet, h: v.h, m: v.m });

/* ---------------------------------------------------------------- 2D diagram (quiz + 2D fallback) */
function snapshot(canvas, vars, focus) {
  const W = 720, H = 340, g = C2.prep(canvas, W, H, "#0b1424"), F = view(vars);
  /* left: drop tower */
  const tx = 175, topY = 54, botY = 294, pxH = botY - topY;
  C2.rect(g, tx - 85, botY, 210, 14, { stroke: "#64748b", fill: "#334155", lw: 1.5, r: 3 });
  C2.line(g, [[tx - 55, topY], [tx - 55, botY]], "#94a3b8", 2, [5, 5]);
  C2.arrow(g, tx - 65, topY, tx - 65, botY, "#ffd23f", 2.5, 9);
  C2.text(g, `h = ${F.h} m`, tx - 82, (topY + botY) / 2, { size: 14, color: "#ffd23f", align: "right" });

  const ballY = topY + 18;
  const rMain = 12 + Math.cbrt(F.m) * 4.5;
  C2.circle(g, tx, ballY, rMain, { stroke: "#fff", fill: PLANETS[F.planet].color, w: 2 });
  C2.text(g, `${F.m} kg`, tx, ballY + rMain + 14, { size: 13, color: "#e2e8f0" });
  C2.circle(g, tx + 64, ballY, 8, { stroke: "#fff", fill: "#e2e8f0", w: 1.5 });
  C2.text(g, "0.1 kg", tx + 64, ballY + 20, { size: 12, color: "#cbd5e1" });
  C2.text(g, `${F.planetName} · g = ${F.g} m/s²`, tx + 18, 26, { size: 15, color: "#bae6fd" });

  /* right: v-t graph */
  const gx = 370, gy = 278, gw = 295, gh = 200;
  C2.arrow(g, gx, gy, gx + gw, gy, "#cbd5e1", 2, 8);
  C2.arrow(g, gx, gy, gx, gy - gh, "#cbd5e1", 2, 8);
  C2.text(g, `t (${fmt(F.tFall, 2)} s)`, gx + gw - 35, gy + 18, { size: 13, color: "#cbd5e1" });
  C2.text(g, focus === "vt" ? "v (m/s)" : `v = ${fmt(F.vImpact, 1)} m/s`, gx + 54, gy - gh - 12, { size: 13, color: "#4cc9f0" });
  C2.line(g, [[gx, gy], [gx + gw - 28, gy - gh + 24]], "#4cc9f0", 3.5);
  C2.text(g, `slope = g = ${F.g} m/s²`, gx + gw * 0.56, gy - gh * 0.45 + 16, { size: 13, color: "#ffd23f" });
  if (focus !== "vt") {
    C2.text(g, `Weight W = ${fmt(F.weight, 1)} N`, gx + gw * 0.52, 26, { size: 14, color: "#86efac" });
  }
  return canvas;
}

/* ---------------------------------------------------------------- the lab */
export default {
  id: "gravity", cls: 9, unit: "ix/ix9", icon: "🌍",
  title: { en: "Gravity & Motion Lab — free fall", hi: "गुरुत्व और गति प्रयोगशाला — मुक्त पतन" },
  blurb: { en: "Drop heavy and light objects together on the Moon, Earth, and Jupiter — watch velocity climb and time stay equal!", hi: "चन्द्रमा, पृथ्वी और बृहस्पति पर भारी व हल्की वस्तु साथ गिराओ — वेग और समय देखो!" },
  vars: [
    { id: "planet", label: { en: "World (0 Moon · 1 Earth · 2 Jupiter)", hi: "ग्रह / उपग्रह (चन्द्रमा · पृथ्वी · बृहस्पति)" }, unit: "", min: 0, max: 2, step: 1, value: 1 },
    { id: "h", label: { en: "Drop height h", hi: "गिराने की ऊँचाई h" }, unit: "m", min: 10, max: 100, step: 10, value: 40 },
    { id: "m", label: { en: "Ball mass m", hi: "गेंद का द्रव्यमान m" }, unit: "kg", min: 1, max: 10, step: 1, value: 4 }
  ],
  facts(v) {
    const F = view(v);
    return [
      { id: "g", en: `Gravity on ${F.planetName}  g`, hi: `${F.planetHi} पर गुरुत्वीय त्वरण`, value: `${F.g} m/s²` },
      { id: "t", en: "Fall time  t = √(2h / g)", hi: "गिरने का समय t", value: `${fmt(F.tFall, 2)} s (same for 0.1 kg!)` },
      { id: "v", en: "Impact speed  v = √(2 g h)", hi: "टकराव की चाल v", value: `${fmt(F.vImpact, 2)} m/s` },
      { id: "W", en: "Weight  W = m g  (mass stays constant)", hi: "भार W = m g", value: `${fmt(F.weight, 1)} N` }
    ];
  },
  snapshot,
  missions: [
    { id: "grav-drop", en: "Launch a vacuum drop race and watch both balls land together!", hi: "निर्वात पतन दौड़ चलाओ — दोनों गेंदें एक साथ पहुँचती हैं!", check: (_v, _f, meta) => meta.runs >= 1 },
    { id: "grav-moon", en: "Visit the Moon (g = 1.63 m/s²) and feel slow-motion fall", hi: "चन्द्रमा पर जाओ और धीमी गति से गिरना देखो", check: v => v.planet === 0 },
    { id: "grav-jup", en: "Drop from h = 100 m on Jupiter for extreme speed!", hi: "बृहस्पति पर h = 100 m से गिराकर अधिकतम वेग पाओ!", check: v => v.planet === 2 && v.h >= 100 }
  ],

  async mount(ctx) {
    const THREE = await loadThree();
    const st = makeStage(THREE, ctx, { pos: [3.2, 3.6, 10.5], target: [0, 2.5, 0], bg: 0x0b1424, minDist: 4.5, maxDist: 22 });
    const { scene } = st;

    const padMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.75 });
    const pad = new THREE.Mesh(new THREE.BoxGeometry(7, 0.25, 4), padMat); pad.position.set(0, -0.125, 0); scene.add(pad);

    /* drop tower (5 scene units tall representing h up to 100 m) */
    const H_SCENE = 5.4;
    const pole = new THREE.Mesh(new THREE.BoxGeometry(0.14, H_SCENE + 0.4, 0.14), new THREE.MeshStandardMaterial({ color: 0x64748b }));
    pole.position.set(-1.6, H_SCENE / 2, -0.4); scene.add(pole);
    for (let i = 0; i <= 5; i++) {
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.03, 0.04), new THREE.MeshBasicMaterial({ color: 0xffd23f }));
      tick.position.set(-1.3, (i / 5) * H_SCENE, -0.4); scene.add(tick);
    }

    const ballMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.25 });
    const ball = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), ballMat); scene.add(ball);
    const pebble = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 16), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 }));
    scene.add(pebble);

    const mTag = labelSprite(THREE, "4 kg", "", { scale: 0.85, size: 28, color: "#bae6fd" }); scene.add(mTag);
    const pTag = labelSprite(THREE, "0.1 kg", "", { scale: 0.75, size: 24, color: "#f8fafc" }); scene.add(pTag);

    const hud = el("div", "cl-hudline"); ctx.stage.appendChild(hud);
    const ht = el("span"), hv = el("span"), hs = el("span"); hud.append(ht, hv, hs);

    let t = 0, running = false, landed = false, tagM = -1;

    const placeAt = tc => {
      const F = view(ctx.vars), stAt = F.at(tc);
      const topScene = 0.4 + (F.h / 100) * (H_SCENE - 0.5);
      const r = 0.16 + Math.cbrt(F.m) * 0.09;
      const frac = F.h > 0 ? stAt.y / F.h : 0;
      const y = r + frac * (topScene - r);
      ball.scale.setScalar(r); ball.position.set(-0.35, y, 0);
      pebble.position.set(0.85, 0.13 + frac * (topScene - 0.13), 0);
      mTag.position.set(-0.35, y + r + 0.35, 0);
      pTag.position.set(0.85, pebble.position.y + 0.38, 0);
      ht.textContent = `t = ${fmt(stAt.t, 2)} s`;
      hv.textContent = `v = ${fmt(stAt.v, 2)} m/s`;
      hs.textContent = `height = ${fmt(stAt.y, 1)} m`;
      drawGraph(stAt.t);
    };

    const reset = () => {
      running = false; landed = false; t = 0;
      btnGo.textContent = "▶ Drop Both · दोनों गिराओ";
      const F = view(ctx.vars);
      ballMat.color.set(PLANETS[F.planet].color);
      padMat.color.set(F.planet === 0 ? 0x334155 : F.planet === 1 ? 0x1e3a5f : 0x5c2d16);
      if (tagM !== F.m) {
        tagM = F.m;
        const a = labelSprite(THREE, `${F.m} kg`, "", { scale: 0.85, size: 28, color: "#bae6fd" });
        mTag.material.map.dispose(); mTag.material.map = a.material.map; mTag.scale.copy(a.scale);
      }
      placeAt(0);
    };

    const stopFrame = st.onFrame(dt => {
      if (!running) return;
      const F = view(ctx.vars);
      t += dt;
      if (t >= F.tFall) {
        t = F.tFall; running = false;
        if (!landed) { landed = true; sfx.play("thud"); btnGo.textContent = "↺ Reset · फिर से"; }
      }
      placeAt(t);
    });

    /* side panel */
    const side = ctx.side; side.replaceChildren();
    const seg = el("div", "cl-seg"); seg.setAttribute("role", "group"); seg.setAttribute("aria-label", "Planet");
    const pBtns = PLANETS.map((p, idx) => {
      const b = el("button", "cl-opt" + (ctx.vars.planet === idx ? " on" : ""), `${p.name}<br><span class="hi">${p.g} m/s²</span>`);
      b.type = "button";
      b.onclick = () => { ctx.set("planet", idx); pBtns.forEach((x, j) => x.classList.toggle("on", j === idx)); };
      seg.appendChild(b);
      return b;
    });
    side.appendChild(el("h3", "cl-h", "World · स्थान")); side.appendChild(seg);

    const sl = sliders(ctx, side, { skip: ["planet"] });
    const btns = el("div", "cl-btns"); side.appendChild(btns);
    const btnGo = actionButton(btns, "▶ Drop Both · दोनों गिराओ", () => {
      if (landed || running) { reset(); return; }
      running = true; landed = false; t = 0;
      btnGo.textContent = "■ Reset · रोकें";
      sfx.play("whoosh");
      ctx.run();
    }, "cl-act");

    const graph = el("canvas", "cl-graph"); graph.width = 340; graph.height = 160; graph.setAttribute("role", "img"); graph.setAttribute("aria-label", "Live velocity vs time graph");
    side.appendChild(el("h3", "cl-h", "Velocity–time graph · वेग–समय ग्राफ़")); side.appendChild(graph);
    function drawGraph(tNow) {
      const F = view(ctx.vars), g = C2.prep(graph, 340, 160, "#0b1424");
      const ox = 40, oy = 134, w = 278, h = 108;
      C2.arrow(g, ox, oy, ox + w, oy, "#94a3b8", 1.5, 7);
      C2.arrow(g, ox, oy, ox, oy - h, "#94a3b8", 1.5, 7);
      C2.line(g, [[ox, oy], [ox + w - 18, oy - h + 12]], "#4cc9f0", 3);
      const frac = F.tFall > 0 ? Math.min(1, tNow / F.tFall) : 0;
      const px = ox + frac * (w - 18), py = oy - frac * (h - 12);
      C2.circle(g, px, py, 5, { stroke: "#fff", fill: "#ffd23f", w: 1.5 });
      C2.text(g, `v = ${fmt(F.at(tNow).v, 1)} m/s`, ox + 86, 18, { size: 12, color: "#ffd23f" });
      C2.text(g, `t_max = ${fmt(F.tFall, 2)} s`, ox + w - 48, oy + 14, { size: 11, color: "#cbd5e1" });
    }

    const facts = factsView(ctx, side);
    const presets = el("div", "cl-presets"); presets.appendChild(el("span", "cl-lab", "Try · आज़माओ"));
    const jump = (txt, fn) => actionButton(presets, txt, () => { fn(); sl.sync(); pBtns.forEach((b, j) => b.classList.toggle("on", j === ctx.vars.planet)); }, "cl-chipb");
    jump("Moon vs Earth", () => ctx.set("planet", ctx.vars.planet === 0 ? 1 : 0));
    jump("h × 4 (v doubles!)", () => ctx.set("h", Math.min(100, ctx.vars.h <= 25 ? ctx.vars.h * 4 : 80)));
    jump("m = 10 kg", () => ctx.set("m", 10));
    side.insertBefore(presets, sl.root.nextSibling);

    note(side, "In vacuum, acceleration g is identical for every mass — a 10 kg iron ball and a 0.1 kg pebble land side by side at the exact same moment!", "निर्वात में गुरुत्वीय त्वरण g द्रव्यमान पर निर्भर नहीं करता — 10 kg और 0.1 kg एक ही पल ज़मीन छूते हैं!");

    const off = bus.on("sim:change", e => {
      if (e.labId !== "gravity") return;
      reset(); facts.update(); sl.sync();
      pBtns.forEach((b, j) => b.classList.toggle("on", j === ctx.vars.planet));
    });
    reset(); facts.update(); ctx.stage.dataset.ready = "1";
    return { resize: st.resize, dispose() { off(); stopFrame(); st.dispose(); } };
  },

  questions(q) {
    const out = [], v = () => ({ planet: seen(q, "planet"), h: seen(q, "h"), m: seen(q, "m") });
    const uniq = (arr, c) => { const s = new Set([c]); return arr.filter(o => !s.has(o[0]) && s.add(o[0])); };

    /* 1 · fall time */
    {
      const x = v(), F = view(x), S = s => [`${fmt(s, 2)} s`, `${fmt(s, 2)} s`];
      const c = S(F.tFall);
      const d = withDistractors(c, uniq([S(F.h / F.g), S(F.tFall * 2), S(Math.sqrt(F.h / F.g)), S(F.tFall / 2)], c[0]), 3, q.rnd);
      out.push(ask({
        id: "grav-time",
        prompt: [`A ${x.m} kg ball is dropped from ${x.h} m on ${F.planetName} (g = ${F.g} m/s²). How long does it take to reach the ground?`, `${F.planetHi} (g = ${F.g} m/s²) पर ${x.m} kg की गेंद ${x.h} m से छोड़ी गई। नीचे पहुँचने में कितना समय लगेगा?`],
        image: { vars: x },
        options: d.options, correct: d.correct,
        why: [`From s = ½ g t², t = √(2h / g) = √(${2 * x.h} / ${F.g}) = ${fmt(F.tFall, 2)} s.`, `s = ½ g t² से t = √(2h / g) = ${fmt(F.tFall, 2)} s।`]
      }));
    }

    /* 2 · impact speed */
    {
      const x = v(), F = view(x), V = s => [`${fmt(s, 2)} m/s`, `${fmt(s, 2)} m/s`];
      const c = V(F.vImpact);
      const d = withDistractors(c, uniq([V(F.vImpact / 2), V(2 * F.g * x.h), V(F.g * x.h), V(F.vImpact * 2)], c[0]), 3, q.rnd);
      out.push(ask({
        id: "grav-impact",
        prompt: [`Dropped from rest at height ${x.h} m on ${F.planetName} (g = ${F.g} m/s²), what speed does it reach just before hitting the ground?`, `${F.planetHi} पर ${x.h} m ऊँचाई से विराम से गिरने पर ज़मीन छूने से ठीक पहले चाल क्या होगी?`],
        image: { vars: x },
        options: d.options, correct: d.correct,
        why: [`v² = 2 g h, so v = √(2 × ${F.g} × ${x.h}) = ${fmt(F.vImpact, 2)} m/s.`, `v² = 2 g h से v = ${fmt(F.vImpact, 2)} m/s।`]
      }));
    }

    /* 3 · Galileo vacuum race (mass independence) */
    {
      const x = v(), F = view(x);
      const c = ["Both hit the ground at the exact same time", "दोनों ठीक एक ही समय ज़मीन पर पहुँचते हैं"];
      const pool = [
        [`The ${x.m} kg ball lands much sooner`, `${x.m} kg की गेंद बहुत पहले गिरती है`],
        ["The 0.1 kg pebble lands sooner", "0.1 kg का कंकड़ पहले गिरता है"],
        ["The heavier ball reaches twice the speed", "भारी गेंद की चाल दोगुनी हो जाती है"]
      ];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "grav-mass",
        prompt: [`A ${x.m} kg sphere and a 0.1 kg pebble are dropped together from ${x.h} m in vacuum on ${F.planetName}. Which lands first?`, `${F.planetHi} पर निर्वात में ${x.m} kg का गोला और 0.1 kg का कंकड़ ${x.h} m से साथ छोड़े गए। कौन पहले गिरेगा?`],
        image: { vars: x },
        options: d.options, correct: d.correct,
        why: ["Gravitational acceleration g = GM/R² does not depend on the falling object's mass, so both accelerate equally and land together.", "गुरुत्वीय त्वरण g वस्तु के द्रव्यमान पर निर्भर नहीं करता, इसलिए दोनों साथ गिरते हैं।"]
      }));
    }

    /* 4 · weight = m g */
    {
      const x = v(), F = view(x), W = w => [`${fmt(w, 1)} N`, `${fmt(w, 1)} N`];
      const c = W(F.weight);
      const d = withDistractors(c, uniq([W(x.m), W(F.g), W(F.weight * 2), W(F.weight / 2)], c[0]), 3, q.rnd);
      out.push(ask({
        id: "grav-weight",
        prompt: [`What is the weight W = m g of a ${x.m} kg ball on ${F.planetName} (g = ${F.g} m/s²)?`, `${F.planetHi} (g = ${F.g} m/s²) पर ${x.m} kg की गेंद का भार W = m g कितना है?`],
        image: { vars: x },
        options: d.options, correct: d.correct,
        why: [`Mass is ${x.m} kg everywhere, while weight W = m × g = ${x.m} × ${F.g} = ${fmt(F.weight, 1)} N.`, `द्रव्यमान हर जगह ${x.m} kg रहता है, जबकि भार W = m × g = ${fmt(F.weight, 1)} N।`]
      }));
    }

    /* 5 · predict: h × 4 -> v doubles */
    {
      const x = v(), h1 = x.h <= 25 ? x.h : 20, h2 = h1 * 4;
      const c = ["Impact speed doubles", "टकराव की चाल दोगुनी हो जाती है"];
      const pool = [
        ["Impact speed becomes four times", "चाल चार गुनी हो जाती है"],
        ["Impact speed stays the same", "चाल वही रहती है"],
        ["Impact speed becomes half", "चाल आधी हो जाती है"]
      ];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "grav-predict", kind: "predict",
        prompt: [`You increase the drop height fourfold from ${h1} m to ${h2} m. What happens to the impact speed?`, `यदि गिराने की ऊँचाई ${h1} m से चार गुनी (${h2} m) कर दी जाए, तो टकराव की चाल का क्या होगा?`],
        image: { vars: { ...x, h: h1 } },
        options: d.options, correct: d.correct,
        meta: { a: { planet: x.planet, h: h1, m: x.m }, b: { planet: x.planet, h: h2, m: x.m }, ratio: 2 },
        why: [`Since v = √(2 g h), multiplying height by 4 multiplies speed by √4 = 2.`, `v = √(2 g h) होने से ऊँचाई 4× होने पर चाल √4 = 2× हो जाती है।`]
      }));
    }

    /* 6 · v-t graph meaning */
    {
      const x = v();
      const c = ["Uniformly accelerated motion (slope = g)", "एकसमान त्वरित गति (ढाल = g)"];
      const pool = [
        ["Constant velocity (zero acceleration)", "नियत वेग (शून्य त्वरण)"],
        ["Object at rest", "वस्तु विराम अवस्था में है"],
        ["Decreasing acceleration", "घटता हुआ त्वरण"]
      ];
      const d = withDistractors(c, pool, 3, q.rnd);
      out.push(ask({
        id: "grav-vt",
        prompt: ["The velocity–time (v–t) graph of the falling ball is a straight line rising from the origin. What does it represent?", "गिरती हुई गेंद का वेग–समय (v–t) ग्राफ़ मूलबिंदु से उठती सीधी रेखा है। यह क्या दर्शाता है?"],
        image: { vars: x, focus: "vt" },
        options: d.options, correct: d.correct,
        why: ["A straight v–t line from the origin has constant slope dv/dt = g, showing uniform gravitational acceleration.", "सीधी v–t रेखा का नियत ढाल dv/dt = g है, जो एकसमान त्वरण दर्शाता है।"]
      }));
    }

    return out;
  }
};
