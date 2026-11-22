/* Curiosity Lab — Visual Knowledge Check (ES module).
   A round of up to 8 picture questions generated from what the student explored in the simulator.
   Gamification: XP + speed bonus, streak flames and milestones, level-ups, 50:50 lifeline, confetti / fireworks, glowing text,
   CSS haptic shake + vibration on a wrong answer, optional sounds, a results screen with review. All effects live in fx.js. */
import { validateQuestion } from "../core.js";
import { rng, shuffle, el, esc } from "../labs/kit.js";
import * as fx from "./fx.js";

const ROUND = 8;
const rounds = new Map();                                   // labId → round in progress (kept while the student hops between tabs)
const LETTERS = ["1", "2", "3", "4", "5"];

/* ---------------------------------------------------------------- round construction */
export function buildRound(lab, store, vars, seed) {
  const explored = (store.lab(lab.id).explored) || {}, all = [], seen = new Set();
  for (let k = 0; k < 12 && all.length < ROUND * 2; k++) {           // a student who tried few settings repeats questions: draw more until there is enough variety
    let qs = [];
    try { qs = lab.questions({ vars, explored, rnd: rng(seed * 131 + k * 977 + 1), seed: seed + k }); } catch (e) { console.error("[curiosity] questions failed", lab.id, e); }
    qs.forEach(q => { try { validateQuestion(q); } catch (e) { console.warn("[curiosity]", e.message); return; } const key = q.id + "|" + q.prompt.en; if (!seen.has(key)) { seen.add(key); all.push(q); } });
  }
  const rec = store.lab(lab.id), acc = rec.answered >= 6 ? rec.correct / rec.answered : null, hard = acc !== null && acc >= 0.85;   // a student who is cruising gets the harder "predict" questions first
  const rnd = rng(seed * 7 + 3), mixed = shuffle(all, rnd), lead = mixed.findIndex(q => q.kind === (hard ? "predict" : "name"));
  if (lead > 0) [mixed[0], mixed[lead]] = [mixed[lead], mixed[0]];                       // otherwise start with a "name it" question: the easiest way in
  const qs = mixed.slice(0, ROUND).map(q => ({ ...q, opts: shuffle(q.options, rnd) }));
  return { labId: lab.id, seed, qs, i: 0, results: [], usedFifty: false, startXp: store.get().xp, answered: false, t0: 0, bestStreak: 0 };
}

const MILESTONES = { 3: ["On fire!", "आग लगा दी!", "🔥"], 5: ["Unstoppable!", "रुकने वाला नहीं!", "⚡"], 7: ["Genius!", "प्रतिभाशाली!", "🧠"], 10: ["LEGEND!", "महान!", "👑"] };
const milestone = s => MILESTONES[s] || (s > 10 && s % 5 === 0 ? ["LEGEND ×" + s, "महान ×" + s, "👑"] : null);

/* ---------------------------------------------------------------- the renderer the shell calls */
export function renderQuiz(host, ctx) {
  const { lab, store } = ctx, root = host.closest("#cl") || document.body;
  let R = rounds.get(lab.id);
  if (R && R.answered && R.i < R.qs.length) { R.i++; R.answered = false; }          // the student left after answering: that question is finished, carry on with the next
  const start = () => { R = buildRound(lab, store, ctx.vars, (Date.now() % 100000) + 1); rounds.set(lab.id, R); paint(); };
  const snd = () => fx.sound.on;

  /* ---------- shell of the quiz ---------- */
  host.replaceChildren();
  const box = el("div", "cq"); host.appendChild(box);

  function paint() {
    if (!R || !R.qs.length) { box.innerHTML = `<p class="cl-empty">No questions could be made yet — change a slider in the simulator and try again.<br><span class="hi" lang="hi">अभी प्रश्न नहीं बन सके — सिमुलेटर में कोई स्लाइडर बदलकर फिर आज़माओ।</span></p>`; return; }
    if (R.i >= R.qs.length) return summary();
    const q = R.qs[R.i], s = store.get(), n = R.qs.length;
    box.innerHTML = `
      <div class="cq-top">
        <div class="cq-prog" role="progressbar" aria-valuemin="0" aria-valuemax="${n}" aria-valuenow="${R.i}"><i style="width:${(R.i / n) * 100}%"></i></div>
        <span class="cq-count">Question ${R.i + 1} / ${n}</span>
        <span class="cq-flame${s.streak >= 3 ? " hot" : ""}" id="cqFlame" title="Correct answers in a row">${flames(s.streak)} <b>${s.streak}</b></span>
        <button type="button" class="cq-tool" id="cqFifty" title="Remove wrong options (once per round)" ${R.usedFifty || q.opts.length < 3 ? "disabled" : ""}>✂ 50 : 50</button>
        <button type="button" class="cq-tool" id="cqSnd" aria-pressed="${snd()}" title="Sounds on / off">${snd() ? "🔊" : "🔇"}</button>
      </div>
      ${basedOn()}
      <article class="cq-card" id="cqCard" aria-live="polite">
        <span class="cq-badge ${q.kind}">${q.kind === "predict" ? "🔮 Predict · अनुमान लगाओ" : "🏷️ Perfect name · सही नाम"}</span>
        <h2 class="cq-prompt">${esc(q.prompt.en)}<span class="hi" lang="hi">${esc(q.prompt.hi)}</span></h2>
        ${q.image ? `<div class="cq-img"><canvas id="cqImg" role="img" aria-label="Diagram for the question"></canvas></div>` : ""}
        <div class="cq-opts" role="radiogroup" aria-label="Answers">
          ${q.opts.map((o, k) => `<button type="button" class="cq-opt" role="radio" aria-checked="false" data-id="${o.id}" style="--d:${k * 70}ms"><span class="cq-key">${LETTERS[k]}</span><span class="cq-ot"><b>${esc(o.en)}</b><span class="hi" lang="hi">${esc(o.hi)}</span></span></button>`).join("")}
        </div>
        <div class="cq-fb" id="cqFb" hidden></div>
        <div class="cq-actions" id="cqAct" hidden></div>
      </article>`;
    if (q.image) { try { lab.snapshot($("#cqImg"), q.image.vars, q.image.focus); } catch (e) { console.error("[curiosity] snapshot failed", e); $("#cqImg").closest(".cq-img").remove(); } }
    R.answered = false; R.t0 = performance.now(); q.fifty = false;
  }
  const $ = s => box.querySelector(s);
  /** The proof that the questions come from the simulator: the settings the student actually tried. */
  function basedOn() {
    const ex = store.lab(lab.id).explored || {}, parts = lab.vars.filter(v => (ex[v.id] || []).length).map(v => `${esc(v.label.en.split(" (")[0])}: <b>${ex[v.id].slice(-6).map(x => +x.toFixed(2)).join(", ")}</b>${v.unit ? " " + esc(v.unit) : ""}`);
    return parts.length ? `<p class="cq-based">🧪 Built from your experiments · <span class="hi" lang="hi">तुम्हारे प्रयोगों से बना</span> — ${parts.join(" · ")}</p>` : "";
  }
  const flames = s => s >= 10 ? "🔥🔥🔥" : s >= 5 ? "🔥🔥" : "🔥";

  /* ---------- answering ---------- */
  function answer(optId) {
    if (!R || R.answered || R.i >= R.qs.length) return;
    const q = R.qs[R.i], btn = box.querySelector(`.cq-opt[data-id="${optId}"]`); if (!btn || btn.disabled || btn.classList.contains("gone")) return;
    R.answered = true;
    const correct = optId === q.answer, secs = (performance.now() - R.t0) / 1000, speed = correct && !q.fifty ? (secs <= 6 ? 5 : secs <= 12 ? 2 : 0) : 0, before = store.get().streak;
    const res = store.recordAnswer(lab.id, correct, speed);
    R.results.push({ q, picked: optId, correct, gained: res.gained, secs, speed, fifty: q.fifty });
    if (correct) R.bestStreak = Math.max(R.bestStreak, res.streak);
    const card = $("#cqCard"), right = box.querySelector(`.cq-opt[data-id="${q.answer}"]`);
    box.querySelectorAll(".cq-opt").forEach(b => { b.disabled = true; b.setAttribute("aria-checked", String(b === btn)); if (b !== btn && b !== right) b.classList.add("dim"); });
    btn.classList.add(correct ? "right" : "wrong"); right.classList.add("right");
    const fl = $("#cqFlame"); fl.querySelector("b").textContent = res.streak; fl.classList.toggle("hot", res.streak >= 3); fl.firstChild.textContent = flames(res.streak) + " "; fl.classList.remove("bump"); void fl.offsetWidth; fl.classList.add("bump");
    const fb = $("#cqFb"); fb.hidden = false; fb.className = "cq-fb " + (correct ? "ok" : "no");
    if (correct) {
      fb.innerHTML = `<div class="cq-head glow">Perfect! ✓ <span class="hi" lang="hi">बिल्कुल सही!</span></div><div class="cq-xp">+${res.gained} XP${speed ? ` <em>⚡ speed bonus +${speed}</em>` : ""}${q.fifty ? ` <em>✂ 50:50 used — no speed bonus</em>` : ""}</div><p class="cq-why">${esc(q.why.en)}<span class="hi" lang="hi">${esc(q.why.hi)}</span></p>`;
      fx.burstFrom(btn, { count: 55 + Math.min(res.streak, 10) * 9, power: 12 + Math.min(res.streak, 8) });
      fx.floatFrom(btn, `+${res.gained} XP`, { color: "#ffe066", size: 30 });
      fx.vibrate(28); fx.sound.play("right");
      const m = milestone(res.streak);
      if (m) setTimeout(() => { banner(`${m[2]} ${m[0]}`, m[1], "#ffb703"); fx.fireworks(res.streak >= 10 ? 7 : 3); fx.sound.play("streak"); fx.vibrate([40, 30, 40, 30, 80]); }, 380);
    } else {
      fb.innerHTML = `<div class="cq-head">Not quite · <span class="hi" lang="hi">अभी नहीं</span></div><div class="cq-ans">The perfect answer: <b>${esc(q.options.find(o => o.id === q.answer).en)}</b> <span class="hi" lang="hi">${esc(q.options.find(o => o.id === q.answer).hi)}</span></div><p class="cq-why">${esc(q.why.en)}<span class="hi" lang="hi">${esc(q.why.hi)}</span></p>${before >= 3 ? `<div class="cq-lost">🔥 ${before}-streak lost — build it again!</div>` : ""}`;
      fx.shake(card); fx.flash("rgba(255,50,50,.38)"); fx.vibrate([70, 40, 70]); fx.sound.play("wrong");
      if (before >= 3) fx.floatFrom(fl, "streak lost", { color: "#ff8a8a", size: 22 });
    }
    if (res.leveledUp) setTimeout(() => levelUp(res.level), correct ? 900 : 300);
    $("#cqFifty").disabled = true;
    const last = R.i === R.qs.length - 1, act = $("#cqAct"); act.hidden = false;
    act.innerHTML = `<button type="button" class="cl-act" id="cqNext">${last ? "🏁 See results · नतीजे देखो" : "Next question · अगला प्रश्न →"}</button>${q.image ? `<button type="button" class="cl-act sec" id="cqShow">🧪 Show me in the simulator · सिमुलेटर में देखो</button>` : ""}`;
    const prog = box.querySelector(".cq-prog"); prog.querySelector("i").style.width = ((R.i + 1) / R.qs.length) * 100 + "%"; prog.setAttribute("aria-valuenow", R.i + 1);
    $("#cqNext").focus({ preventScroll: true });
  }

  function banner(title, hi, color) {
    const b = el("div", "cq-banner", `<b>${esc(title)}</b><span class="hi" lang="hi">${esc(hi)}</span>`); b.style.setProperty("--c", color);
    root.appendChild(b); setTimeout(() => b.remove(), 1900); fx.flash("rgba(255,200,60,.25)");
  }
  function levelUp(level) {
    const o = el("div", "cq-level", `<div><small>LEVEL UP · स्तर बढ़ा</small><b>LEVEL ${level}</b><span>You are getting stronger! · तुम और मज़बूत हो रहे हो!</span></div>`);
    root.appendChild(o); fx.fireworks(8); fx.flash("rgba(255,215,0,.4)"); fx.sound.play("level"); fx.vibrate([60, 40, 60, 40, 140]);
    const kill = () => o.remove(); o.addEventListener("click", kill); setTimeout(kill, 2800);
  }

  /* ---------- 50 : 50 ---------- */
  function fifty() {
    if (!R || R.answered || R.usedFifty) return;
    const q = R.qs[R.i], wrong = shuffle(q.opts.filter(o => o.id !== q.answer), rng(Date.now() % 9973 + 1)), kill = Math.min(2, wrong.length - 1);
    if (kill < 1) return;
    R.usedFifty = true; q.fifty = true;
    wrong.slice(0, kill).forEach(o => { const b = box.querySelector(`.cq-opt[data-id="${o.id}"]`); b.classList.add("gone"); b.disabled = true; b.setAttribute("aria-hidden", "true"); });
    $("#cqFifty").disabled = true; fx.sound.play("tick");
  }

  /* ---------- results ---------- */
  function summary() {
    R.done = true;
    const n = R.results.length, ok = R.results.filter(r => r.correct).length, pct = n ? Math.round((ok / n) * 100) : 0, xp = store.get().xp - R.startXp, avg = n ? R.results.reduce((s, r) => s + r.secs, 0) / n : 0;
    const [title, hi, em] = pct === 100 ? ["Perfect round!", "शानदार — पूरे अंक!", "🏆"] : pct >= 75 ? ["Brilliant!", "बहुत बढ़िया!", "🌟"] : pct >= 50 ? ["Good effort!", "अच्छा प्रयास!", "👍"] : ["Keep experimenting!", "प्रयोग करते रहो!", "🔬"];
    const wrong = R.results.filter(r => !r.correct), C = 2 * Math.PI * 54;
    box.innerHTML = `
      <section class="cq-sum">
        <div class="cq-ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" class="bg"/><circle cx="60" cy="60" r="54" class="fg" style="stroke-dasharray:${C};stroke-dashoffset:${C}" data-to="${C * (1 - (n ? ok / n : 0))}"/></svg><div><b id="cqPct">0</b><small>%</small></div></div>
        <h2 class="glow">${em} ${esc(title)} <span class="hi" lang="hi">${esc(hi)}</span></h2>
        <ul class="cq-stats"><li><b>${ok} / ${n}</b><span>correct · सही</span></li><li><b>+${xp}</b><span>XP earned · अंक</span></li><li><b>${R.bestStreak}</b><span>best streak · सबसे लंबी श्रृंखला</span></li><li><b>${avg.toFixed(1)} s</b><span>avg time · औसत समय</span></li></ul>
        ${wrong.length ? `<div class="cq-review"><h3>Look again · दोबारा देखो</h3>${wrong.map((r, k) => `<div class="cq-rv"><div><b>${esc(r.q.prompt.en)}</b><span class="hi" lang="hi">${esc(r.q.prompt.hi)}</span><em>✔ ${esc(r.q.options.find(o => o.id === r.q.answer).en)}</em></div>${r.q.image ? `<button type="button" class="cl-chipb" data-show="${k}">🧪 Show me</button>` : ""}</div>`).join("")}</div>` : `<p class="cq-allgood">No mistakes to review — every answer was right! · कोई गलती नहीं!</p>`}
        <div class="cq-actions"><button type="button" class="cl-act" id="cqAgain">🔁 New round · नया दौर</button><button type="button" class="cl-act sec" id="cqBack">🧪 Back to the simulator · सिमुलेटर पर लौटो</button></div>
      </section>`;
    requestAnimationFrame(() => { const fg = box.querySelector(".fg"); if (fg) requestAnimationFrame(() => { fg.style.strokeDashoffset = fg.dataset.to; }); });
    fx.countUp($("#cqPct"), pct, 900);
    if (pct === 100) { fx.rain(); fx.fireworks(5); fx.sound.play("level"); fx.vibrate([50, 30, 50, 30, 120]); }
    else if (pct >= 75) { fx.fireworks(3); fx.sound.play("streak"); }
    $("#cqAgain").focus({ preventScroll: true });
    box.dataset.summary = `${ok}/${n}`;
  }

  /* ---------- events ---------- */
  const onClick = e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.classList.contains("cq-opt")) return answer(b.dataset.id);
    if (b.id === "cqNext") { R.i++; paint(); box.querySelector(".cq-opt")?.focus({ preventScroll: true }); return; }
    if (b.id === "cqFifty") return fifty();
    if (b.id === "cqSnd") { const on = fx.sound.toggle(); b.textContent = on ? "🔊" : "🔇"; b.setAttribute("aria-pressed", String(on)); return; }
    if (b.id === "cqShow") return ctx.apply(R.qs[R.i].image.vars, true);
    if (b.dataset.show) return ctx.apply(R.results.filter(r => !r.correct)[+b.dataset.show].q.image.vars, true);
    if (b.id === "cqAgain") { start(); return; }
    if (b.id === "cqBack") return ctx.back();
  };
  const onKey = e => {
    if (e.ctrlKey || e.metaKey || e.altKey || !box.isConnected || host.hidden || /^(INPUT|TEXTAREA|SELECT)$/.test((e.target || {}).tagName || "")) return;
    if (/^[1-5]$/.test(e.key)) { const vis = [...box.querySelectorAll(".cq-opt:not(.gone)")], b = vis[+e.key - 1]; if (b && !b.disabled) { e.preventDefault(); answer(b.dataset.id); } }
    else if ((e.key === "Enter" || e.key === "ArrowRight") && R && R.answered && box.querySelector("#cqNext")) { e.preventDefault(); box.querySelector("#cqNext").click(); }
  };
  const syncQuizSnd = () => { const b = $("#cqSnd"); if (b) { const on = fx.sound.on; b.textContent = on ? "🔊" : "🔇"; b.setAttribute("aria-pressed", String(on)); } };
  box.addEventListener("click", onClick); document.addEventListener("keydown", onKey); window.addEventListener("va-cl-snd", syncQuizSnd);
  box.__round = () => R;                                  // test hook
  if (R && R.qs.length) paint(); else start();
  return () => { document.removeEventListener("keydown", onKey); window.removeEventListener("va-cl-snd", syncQuizSnd); fx.stopAll(); };
}
