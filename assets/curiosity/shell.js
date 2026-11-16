/* Curiosity Lab — shell (ES module).
   Full-screen overlay: HUD (XP, level, streak), tabs (Simulator | Knowledge check), lab picker, and the lifecycle that mounts / disposes a lab.
   Labs and the quiz plug in through core.js; the shell never knows what a lens or a resistor is. */
import { labs, getLab, store, bus, levelInfo, defaults, snap, SYLLABUS } from "./core.js";

const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const LS = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } } };

let root = null, tab = "sim", cur = null /* {lab, handle, vars} */, filter = LS.get("va.cl.cls") || "all", prevFocus = null, unsub = [], prevPause;
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
  unsub.push(store.subscribe(paintHud));
}

/* ---------- HUD ---------- */
function paintHud() {
  if (!root) return;
  const s = store.get(), li = levelInfo(s.xp);
  $("#clXp b", root).textContent = s.xp;
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
function paintTabs() {
  const b = $("#clTabQuiz", root), ok = quizUnlocked();
  b.disabled = !ok; b.classList.toggle("locked", !ok);
  b.title = ok ? "Answer questions about what you just saw" : "Do an experiment first — change a slider in the simulator, then your results become the questions";
}

/* ---------- lab picker ---------- */
function paintPicker() {
  const all = labs(), shown = all.filter(l => filter === "all" || String(l.cls) === filter);
  const chips = [["all", "All classes"], ["9", "Class IX"], ["10", "Class X"]].map(([k, t]) => `<button type="button" class="cl-f${filter === k ? " on" : ""}" data-filter="${k}" aria-pressed="${filter === k}">${t}</button>`).join("");
  const cards = shown.map(l => {
    const r = store.lab(l.id), unit = SYLLABUS[l.unit];
    return `<button type="button" class="cl-card" data-lab="${esc(l.id)}"><span class="cl-ico" aria-hidden="true">${esc(l.icon)}</span>
      <span class="cl-ct"><b>${esc(l.title.en)}</b><span class="hi" lang="hi">${esc(l.title.hi)}</span><em>${esc(l.blurb.en)}</em><small>Class ${l.cls === 9 ? "IX" : "X"} · NCERT Ch ${unit.no} · ${esc(unit.title.en)}</small></span>
      <span class="cl-meta">${r.tweaks ? `🧪 ${r.tweaks}` : "New"}${r.answered ? ` · 🎯 ${r.correct}/${r.answered}` : ""}</span></button>`;
  }).join("");
  $("#clPick", root).innerHTML = `<div class="cl-pickhead"><h2>What do you want to explore? <span class="hi" lang="hi">आप क्या खोजना चाहते हैं?</span></h2><div class="cl-filters" role="group" aria-label="Filter by class">${chips}</div></div>
    <div class="cl-cards">${cards || `<p class="cl-empty">${all.length ? "No experiments for this class yet." : "No experiments are registered yet."}</p>`}</div>`;
}

/* ---------- lab lifecycle ---------- */
function disposeLab() {
  if (!cur) return;
  try { cur.handle.dispose && cur.handle.dispose(); } catch (e) { console.error("[curiosity] dispose failed", e); }
  $("#clStage", root).replaceChildren(); $("#clSide", root).replaceChildren();
  cur = null;
}
export async function openLab(id) {
  const lab = getLab(id); if (!lab) return;
  disposeLab();
  const vars = defaults(lab);
  const ctx = {
    lab, vars, stage: $("#clStage", root), side: $("#clSide", root),
    /** Labs call this when the student moves a control: snaps, stores, tells the quiz. */
    set(varId, raw) {
      const v = lab.vars.find(x => x.id === varId); if (!v) throw new Error(`unknown variable ${varId}`);
      const val = snap(v, raw); if (val === vars[varId]) return val;
      vars[varId] = val; store.recordTweak(lab.id, varId, val); paintTabs();
      bus.emit("sim:change", { labId: lab.id, varId, value: val, vars: { ...vars }, facts: lab.facts({ ...vars }) });
      return val;
    },
    run() { store.recordRun(lab.id); bus.emit("sim:run", { labId: lab.id, vars: { ...vars } }); },
    get facts() { return lab.facts({ ...vars }); }
  };
  cur = { lab, vars, ctx, handle: { dispose() {} } };
  const u = SYLLABUS[lab.unit];
  $("#clLabT", root).innerHTML = `${esc(lab.icon)} ${esc(lab.title.en)} <span class="hi" lang="hi">${esc(lab.title.hi)}</span>`;
  $("#clLabU", root).textContent = `Class ${lab.cls === 9 ? "IX" : "X"} · NCERT Ch ${u.no} · ${u.title.en}`;
  setTab("sim");
  try {
    const h = await lab.mount(ctx);
    if (cur && cur.lab === lab) cur.handle = h || cur.handle;
  } catch (e) {
    console.error("[curiosity] lab failed to start", lab.id, e);
    $("#clStage", root).innerHTML = `<p class="cl-empty">This experiment could not start on this device. · यह प्रयोग इस डिवाइस पर शुरू नहीं हो सका।</p>`;
  }
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
  quizDispose = hooks.quiz(host, { lab: cur.lab, vars: { ...cur.vars }, store, bus, back: () => setTab("sim") }) || null;
}

/* ---------- events ---------- */
function onClick(e) {
  const t = e.target.closest("button"); if (!t) return;
  if (t.id === "clClose") return close();
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
export function open(labId) {
  if (!root) build();
  prevFocus = document.activeElement;
  prevPause = window.__vaPause; window.__vaPause = true;       // the atlas pauses its own 3D render loop while the lab is on screen
  document.body.classList.add("cl-open");
  root.hidden = false;
  paintHud(); paintPicker(); setTab("sim");
  if (labId && getLab(labId)) openLab(labId); else $("#clClose", root).focus({ preventScroll: true });
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
