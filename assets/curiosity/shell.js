/* Curiosity Lab — shell (ES module).
   Full-screen overlay: HUD (XP, level, streak), tabs (Simulator | Knowledge check), lab picker, and the lifecycle that mounts / disposes a lab.
   Labs and the quiz plug in through core.js; the shell never knows what a lens or a resistor is. */
import { labs, getLab, store, bus, levelInfo, defaults, snap, SYLLABUS } from "./core.js";
import * as fx from "./quiz/fx.js";
import { sliders, factsView } from "./labs/kit.js";

const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const LS = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } } };

let root = null, tab = "sim", cur = null /* {lab, handle, vars} */, filter = LS.get("va.cl.cls") || "all", prevFocus = null, unsub = [], prevPause, mountToken = 0;
const hooks = { quiz: null };            // Phase 3 registers the quiz renderer here: (host, ctx) => dispose
export const setQuizRenderer = fn => { hooks.quiz = fn; if (root && tab === "quiz") paintQuiz(); };

function build() {
  root = document.createElement("div");
  root.id = "cl"; root.hidden = true; root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", "Curiosity Lab");
  root.innerHTML = `
  <header class="cl-top">
    <div class="cl-brand"><b>Curiosity Lab</b><small>जिज्ञासा प्रयोगशाला · 3D Simulator &amp; Visual Check</small></div>
    <nav class="cl-tabs" role="tablist" aria-label="Curiosity Lab sections">
      <button type="button" role="tab" id="clTabSim" data-tab="sim" aria-selected="true">🧪 Simulator <span class="hi" lang="hi">प्रयोग</span></button>
      <button type="button" role="tab" id="clTabQuiz" data-tab="quiz" aria-selected="false">🎯 Knowledge check <span class="hi" lang="hi">जाँच</span></button>
    </nav>
    <div class="cl-hud" aria-live="polite">
      <span class="cl-chip" id="clXp" title="Experience points">⭐ <b>0</b> XP</span>
      <span class="cl-chip" id="clStreak" title="Correct answers in a row">🔥 <b>0</b></span>
      <span class="cl-lv" id="clLv" title="Level"><span class="cl-lvn">Lv 1</span><i><u></u></i></span>
    </div>
    <button type="button" class="cl-snd" id="clSnd" aria-pressed="false" title="Sound effects on / off · ध्वनि प्रभाव">🔇</button>
    <button type="button" class="cl-x" id="clClose" aria-label="Close Curiosity Lab" title="Close (Esc)">✕</button>
  </header>
  <main class="cl-main">
    <section id="clPick" aria-label="Choose an experiment"></section>
    <section id="clLab" hidden aria-label="Simulator"><div class="cl-lbar"><button type="button" class="cl-back" data-act="back">← All experiments <span class="hi" lang="hi">सभी प्रयोग</span></button><b id="clLabT"></b><span class="cl-unit" id="clLabU"></span></div><div id="clStage" tabindex="-1"></div><aside id="clSide" aria-label="Experiment controls"></aside></section>
    <section id="clQuiz" hidden aria-label="Knowledge check"></section>
  </main>
  <div id="clFx" aria-hidden="true"></div>`;
  document.body.appendChild(root);
  root.addEventListener("click", onClick);
  root.addEventListener("keydown", onKey);
  fx.mount($("#clFx", root));
  unsub.push(store.subscribe(paintHud));
  const syncSnd = () => {
    const b = $("#clSnd", root);
    if (!b) return;
    const on = fx.sound.on;
    b.textContent = on ? "🔊" : "🔇";
    b.setAttribute("aria-pressed", String(on));
  };
  syncSnd();
  window.addEventListener("va-cl-snd", syncSnd);
}

/* ---------- HUD ---------- */
const hudPrev = { xp: null, streak: null };
const pulse = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
function paintHud() {
  if (!root) return;
  const s = store.get(), li = levelInfo(s.xp);
  if (hudPrev.xp !== null && s.xp > hudPrev.xp) { fx.countUp($("#clXp b", root), s.xp, 700); pulse($("#clXp", root), "bump"); } else $("#clXp b", root).textContent = s.xp;
  if (hudPrev.streak !== null && s.streak !== hudPrev.streak) pulse($("#clStreak", root), s.streak > hudPrev.streak ? "bump" : "lost");
  hudPrev.xp = s.xp; hudPrev.streak = s.streak;
  $("#clStreak b", root).textContent = s.streak;
  $("#clStreak", root).classList.toggle("hot", s.streak >= 3);
  $(".cl-lvn", root).textContent = "Lv " + li.level;
  $("#clLv u", root).style.width = li.pct + "%";
  $("#clLv", root).title = `Level ${li.level} · ${li.into}/${li.span} XP to next level`;
}

/* ---------- tabs ---------- */
function setTab(t) {
  tab = t === "quiz" && !quizUnlocked() ? "sim" : t;
  root.querySelectorAll(".cl-tabs [role=tab]").forEach(b => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
  $("#clPick", root).hidden = !(tab === "sim" && !cur);
  $("#clLab", root).hidden = !(tab === "sim" && cur);
  $("#clQuiz", root).hidden = tab !== "quiz";
  if (tab === "quiz") paintQuiz();
  if (tab === "sim" && cur && cur.handle.resize) cur.handle.resize();
  paintTabs();
}
const quizUnlocked = () => !!cur && store.explored(cur.lab.id) > 0;
/** How many different settings the student has actually tried in this lab (drives the "ready for the check?" nudge). */
const tried = id => Object.values(store.lab(id).explored).reduce((n, l) => n + l.length, 0);
const NUDGE_AT = 4;
function paintTabs() {
  const b = $("#clTabQuiz", root), ok = quizUnlocked();
  b.disabled = !ok; b.classList.toggle("locked", !ok);
  b.classList.toggle("ready", ok && tab !== "quiz" && tried(cur.lab.id) >= NUDGE_AT);
  b.title = ok ? "Answer questions about what you just saw" : "Do an experiment first — change a slider in the simulator, then your results become the questions";
}

/* ---------- lab picker ---------- */
function paintPicker() {
  const all = labs(), shown = all.filter(l => filter === "all" || String(l.cls) === filter);
  const chips = [["all", "All classes"], ["9", "Class IX"], ["10", "Class X"]].map(([k, t]) => `<button type="button" class="cl-f${filter === k ? " on" : ""}" data-filter="${k}" aria-pressed="${filter === k}">${t}</button>`).join("");
  const cards = shown.map(l => {
    const r = store.lab(l.id), unit = SYLLABUS[l.unit], ms = l.missions || [], doneM = (r.missions || []).filter(id => ms.some(m => m.id === id)).length;
    return `<button type="button" class="cl-card" data-lab="${esc(l.id)}"><span class="cl-ico" aria-hidden="true">${esc(l.icon)}</span>
      <span class="cl-ct"><b>${esc(l.title.en)}</b><span class="hi" lang="hi">${esc(l.title.hi)}</span><em>${esc(l.blurb.en)}</em><small>Class ${l.cls === 9 ? "IX" : "X"} · NCERT Ch ${unit.no} · ${esc(unit.title.en)}</small></span>
      <span class="cl-meta">${r.tweaks ? `🧪 ${r.tweaks}` : "New"}${ms.length ? ` · 🏅 ${doneM}/${ms.length}` : ""}${r.answered ? ` · 🎯 ${r.correct}/${r.answered}` : ""}</span></button>`;
  }).join("");
  $("#clPick", root).innerHTML = `<div class="cl-pickhead"><h2>What do you want to explore? <span class="hi" lang="hi">आप क्या खोजना चाहते हैं?</span></h2><div class="cl-filters" role="group" aria-label="Filter by class">${chips}</div></div>
    <div class="cl-cards">${cards || `<p class="cl-empty">${all.length ? "No experiments for this class yet." : "No experiments are registered yet."}</p>`}</div>`;
}

/* ---------- lab lifecycle ---------- */
function disposeLab() {
  ++mountToken;                          // invalidate any mount that is still awaiting Three.js
  if (!cur) return;
  root.querySelectorAll(".cl-nudge").forEach(n => n.remove());
  const handle = cur.handle, stageHandle = cur.stageHandle;
  try { handle && handle.dispose && handle.dispose(); } catch (e) { console.warn("[curiosity] dispose failed", e); }
  if (stageHandle && stageHandle !== handle) try { stageHandle.dispose && stageHandle.dispose(); } catch (e) { console.warn("[curiosity] stage cleanup failed", e); }
  cur = null;
  $("#clStage", root).replaceChildren(); $("#clSide", root).replaceChildren();
}
function mountFallback(ctx, error, token) {
  if (!root || !cur || cur.ctx !== ctx || token !== mountToken) return;
  console.warn(`[curiosity] ${ctx.lab.id} switched to the 2D compatibility simulator`, error);
  const old = cur.handle, stageHandle = cur.stageHandle;
  try { old && old.dispose && old.dispose(); } catch (e) { console.warn("[curiosity] failed 3D cleanup", e); }
  if (stageHandle && stageHandle !== old) try { stageHandle.dispose && stageHandle.dispose(); } catch (e) { console.warn("[curiosity] failed stage cleanup", e); }
  cur.stageHandle = null;

  const stage = ctx.stage, side = ctx.side;
  stage.replaceChildren(); side.replaceChildren(); stage.classList.add("cl-fallback-mode");
  const view = document.createElement("div"); view.className = "cl-fallback";
  view.innerHTML = `<div class="cl-fallback-message" role="status"><span class="cl-fallback-mark" aria-hidden="true">2D</span><span><b>Interactive 2D mode</b><small>3D could not start, so this experiment is running as a responsive diagram instead. · 3D शुरू नहीं हुआ, इसलिए प्रयोग अब 2D आरेख में चल रहा है।</small></span></div><div class="cl-fallback-art"></div>`;
  const art = $(".cl-fallback-art", view), canvas = document.createElement("canvas");
  canvas.width = 720; canvas.height = 340; canvas.setAttribute("role", "img"); canvas.setAttribute("aria-label", `${ctx.lab.title.en} interactive 2D diagram`); art.appendChild(canvas);
  stage.appendChild(view);
  const sl = sliders(ctx, side, { title: "Adjust the experiment · प्रयोग बदलें" });
  const facts = factsView(ctx, side, "What the physics says · विज्ञान क्या बताता है");
  const note = document.createElement("p"); note.className = "cl-note"; note.textContent = "Change a control to update the diagram and the measured results. · नियंत्रण बदलें — आरेख और परिणाम साथ-साथ बदलेंगे।"; side.appendChild(note);
  let diagramBroken = false;
  const update = () => {
    if (!canvas.isConnected) return;
    sl.sync(); facts.update();
    if (diagramBroken) return;
    try { ctx.lab.snapshot(canvas, { ...ctx.vars }); canvas.hidden = false; }
    catch (e) {
      diagramBroken = true;
      console.warn(`[curiosity] ${ctx.lab.id} 2D diagram unavailable`, e);
      canvas.hidden = true;
      $(".cl-fallback-message small", view).textContent = "This browser cannot draw the diagram, but the controls and calculated results remain available. · इस ब्राउज़र में आरेख नहीं बन सकता, लेकिन नियंत्रण और गणना के परिणाम उपलब्ध हैं।";
      let fallback = $(".cl-fallback-facts", view);
      if (!fallback) { fallback = document.createElement("p"); fallback.className = "cl-fallback-facts"; art.appendChild(fallback); }
      fallback.textContent = ctx.facts.map(f => `${f.en}: ${f.value}`).join(" · ");
    }
  };
  const off = bus.on("sim:change", e => { if (e.labId === ctx.lab.id) update(); });
  cur.handle = { resize: update, dispose() { off(); stage.classList.remove("cl-fallback-mode"); } };
  update();
  renderMissions(ctx);
  setTab("sim");
}
function renderMissions(ctx) {
  const ms = ctx.lab.missions;
  if (!ms || !ms.length || !ctx.side) return;
  let box = $("#clMissions", ctx.side);
  if (!box) { box = document.createElement("div"); box.id = "clMissions"; box.className = "cl-missions"; ctx.side.appendChild(box); }
  const done = store.lab(ctx.lab.id).missions || [];
  const count = ms.filter(m => done.includes(m.id)).length;
  box.innerHTML = `<h3 class="cl-h">🏅 Discovery Missions · खोज मिशन <span class="cl-mcnt">${count}/${ms.length}</span></h3>
    <ul class="cl-ml">${ms.map(m => {
      const ok = done.includes(m.id);
      return `<li class="${ok ? "done" : ""}" data-mid="${esc(m.id)}"><span class="cl-mk">${ok ? "✓" : "○"}</span><span><b>${esc(m.en)}</b> <span class="hi" lang="hi">${esc(m.hi)}</span></span><em>+15 XP</em></li>`;
    }).join("")}</ul>`;
}
function checkMissions(ctx, trigger = "change") {
  const ms = ctx.lab.missions;
  if (!ms || !ms.length) return;
  const facts = ctx.facts, runs = store.lab(ctx.lab.id).runs || 0;
  let changed = false;
  ms.forEach(m => {
    try {
      if (m.check({ ...ctx.vars }, facts, { runs, trigger })) {
        const res = store.recordMission(ctx.lab.id, m.id, 15);
        if (res.awarded) {
          changed = true;
          fx.sound.play("mission");
          fx.vibrate([25, 25, 45]);
          const xpChip = $("#clXp", root);
          if (xpChip) {
            fx.burstFrom(xpChip, { count: 42, spread: 100, angle: 90, power: 10 });
            fx.floatFrom(xpChip, `+15 XP · 🏅 ${m.en.slice(0, 26)}`, { color: "#ffe066", size: 20, ms: 1500 });
          }
        }
      }
    } catch (e) { console.warn("[curiosity] mission check failed", m.id, e); }
  });
  if (changed) renderMissions(ctx);
}
export async function openLab(id, preset = null) {
  const lab = getLab(id); if (!lab) return;
  disposeLab();
  const token = ++mountToken, vars = defaults(lab);
  if (preset && typeof preset === "object") {
    lab.vars.forEach(v => { if (Number.isFinite(preset[v.id])) vars[v.id] = snap(v, preset[v.id]); });
  }
  let nudged = false;
  const active = () => !!root && !!cur && cur.ctx === ctx && token === mountToken;
  const ctx = {
    lab, vars, preset: preset || {}, stage: $("#clStage", root), side: $("#clSide", root),
    registerStage(handle) { if (active()) cur.stageHandle = handle; else handle && handle.dispose && handle.dispose(); },
    fail(error) { if (active()) mountFallback(ctx, error, token); },
    /** Labs call this when the student moves a control: snaps, stores, tells the quiz. */
    set(varId, raw) {
      const v = lab.vars.find(x => x.id === varId); if (!v) throw new Error(`unknown variable ${varId}`);
      const val = snap(v, raw); if (val === vars[varId]) return val;
      vars[varId] = val; store.recordTweak(lab.id, varId, val); paintTabs();
      if (!nudged && tried(lab.id) >= NUDGE_AT) { nudged = true; nudge(); }
      bus.emit("sim:change", { labId: lab.id, varId, value: val, vars: { ...vars }, facts: lab.facts({ ...vars }) });
      checkMissions(ctx, "change");
      return val;
    },
    run() { store.recordRun(lab.id); bus.emit("sim:run", { labId: lab.id, vars: { ...vars } }); checkMissions(ctx, "run"); },
    get facts() { return lab.facts({ ...vars }); }
  };
  cur = { lab, vars, ctx, handle: { dispose() {} }, stageHandle: null };
  const u = SYLLABUS[lab.unit];
  $("#clLabT", root).innerHTML = `${esc(lab.icon)} ${esc(lab.title.en)} <span class="hi" lang="hi">${esc(lab.title.hi)}</span>`;
  $("#clLabU", root).textContent = `Class ${lab.cls === 9 ? "IX" : "X"} · NCERT Ch ${u.no} · ${u.title.en}`;
  setTab("sim");
  try {
    const h = await lab.mount(ctx);
    if (!active()) { if (h && h.dispose) h.dispose(); return; }
    cur.handle = h || cur.handle; cur.stageHandle = null;
    renderMissions(ctx);
  } catch (e) {
    if (!active()) return;
    mountFallback(ctx, e, token);
  }
  if (!active()) return;
  setTab("sim");
  const f = $("#clStage", root); f.focus({ preventScroll: true });
}
export const currentLab = () => cur;
function backToPicker() { disposeLab(); paintPicker(); setTab("sim"); }

/* ---------- quiz host (Phase 3 provides the renderer) ---------- */
let quizDispose = null;
function paintQuiz() {
  const host = $("#clQuiz", root);
  if (quizDispose) { try { quizDispose(); } catch (e) { console.error(e); } quizDispose = null; }
  host.replaceChildren();
  if (!cur) { host.innerHTML = `<p class="cl-empty">Pick an experiment first. · पहले कोई प्रयोग चुनें।</p>`; return; }
  if (!hooks.quiz) { host.innerHTML = `<p class="cl-empty">The knowledge check for this experiment is not available yet.</p>`; return; }
  quizDispose = hooks.quiz(host, { lab: cur.lab, vars: { ...cur.vars }, store, bus, back: () => setTab("sim"), apply: applyVars }) || null;
}

/** After a few different settings the simulator suggests the check (once per visit to a lab). */
function nudge() {
  const stage = $("#clLab", root); if (!stage || $(".cl-nudge", root)) return;
  const n = document.createElement("div"); n.className = "cl-nudge"; n.setAttribute("role", "status");
  n.innerHTML = `<span>🎯 You have tried ${NUDGE_AT} settings — ready to test what you saw? <span class="hi" lang="hi">अब जाँचो कि क्या समझे!</span></span><button type="button" class="cl-act">Take the check →</button><button type="button" class="cl-x2" aria-label="Dismiss">✕</button>`;
  n.querySelector(".cl-act").onclick = () => { n.remove(); setTab("quiz"); };
  n.querySelector(".cl-x2").onclick = () => n.remove();
  stage.appendChild(n); fx.sound.play("tick"); setTimeout(() => n.remove(), 12000);
}

/** "Show me in the simulator": puts the lab into the state a question was about, then switches to the simulator tab. */
function applyVars(vars, goSim = true) {
  if (!cur) return;
  cur.lab.vars.forEach(v => { if (vars && Number.isFinite(vars[v.id])) cur.ctx.set(v.id, vars[v.id]); });
  if (goSim) setTab("sim");
}

/* ---------- events ---------- */
function onClick(e) {
  const t = e.target.closest("button"); if (!t) return;
  if (t.id === "clClose") return close();
  if (t.id === "clSnd") { fx.sound.toggle(); return; }
  if (t.dataset.tab) return setTab(t.dataset.tab);
  if (t.dataset.filter) { filter = t.dataset.filter; LS.set("va.cl.cls", filter); return paintPicker(); }
  if (t.dataset.lab) return openLab(t.dataset.lab);
  if (t.dataset.act === "back") return backToPicker();
}
function onKey(e) {
  if (e.key === "Escape") { e.stopPropagation(); close(); return; }
  if (e.key === "Tab") {                                  // keep focus inside the dialog
    const f = [...root.querySelectorAll("button:not([disabled]),input,select,[tabindex='0']")].filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}

/* ---------- open / close ---------- */
export function open(labId, preset = null) {
  if (!root) build();
  prevFocus = document.activeElement;
  prevPause = window.__vaPause; window.__vaPause = true;       // the atlas pauses its own 3D render loop while the lab is on screen
  document.body.classList.add("cl-open");
  root.hidden = false;
  paintHud(); paintPicker(); setTab("sim");
  if (labId && getLab(labId)) openLab(labId, preset); else $("#clClose", root).focus({ preventScroll: true });
}
export function close() {
  if (!root || root.hidden) return;
  disposeLab();
  if (quizDispose) { try { quizDispose(); } catch (e) { console.error(e); } quizDispose = null; }
  root.hidden = true; document.body.classList.remove("cl-open");
  window.__vaPause = prevPause;
  if (prevFocus && prevFocus.focus) try { prevFocus.focus({ preventScroll: true }); } catch { /* element gone */ }
}
export const isOpen = () => !!root && !root.hidden;
