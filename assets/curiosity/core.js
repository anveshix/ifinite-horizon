/* Curiosity Lab — core (ES module, no dependencies).
   Syllabus map, lab registry with a strict contract, persistent progress store and the simulator→quiz event bus.
   Every other Curiosity Lab file imports from here, so the rules live in exactly one place. */

/* ---------- NCERT alignment: only units that already exist in Infinite Horizons (see docs/CLASS9_COVERAGE.md) ---------- */
export const SYLLABUS = Object.freeze({
  /* Class X (NCERT, 2023-24 rationalised): app keys ch1…ch13 */
  "x/ch1":  { cls: 10, no: 1,  title: { en: "Chemical Reactions and Equations", hi: "रासायनिक अभिक्रियाएँ एवं समीकरण" } },
  "x/ch2":  { cls: 10, no: 2,  title: { en: "Acids, Bases and Salts", hi: "अम्ल, क्षारक एवं लवण" } },
  "x/ch3":  { cls: 10, no: 3,  title: { en: "Metals and Non-metals", hi: "धातु एवं अधातु" } },
  "x/ch4":  { cls: 10, no: 4,  title: { en: "Carbon and its Compounds", hi: "कार्बन एवं उसके यौगिक" } },
  "x/ch5":  { cls: 10, no: 5,  title: { en: "Life Processes", hi: "जैव प्रक्रम" } },
  "x/ch6":  { cls: 10, no: 6,  title: { en: "Control and Coordination", hi: "नियंत्रण एवं समन्वय" } },
  "x/ch7":  { cls: 10, no: 7,  title: { en: "How do Organisms Reproduce?", hi: "जीव जनन कैसे करते हैं?" } },
  "x/ch8":  { cls: 10, no: 8,  title: { en: "Heredity", hi: "आनुवंशिकता" } },
  "x/ch9":  { cls: 10, no: 9,  title: { en: "Light – Reflection and Refraction", hi: "प्रकाश – परावर्तन तथा अपवर्तन" } },
  "x/ch10": { cls: 10, no: 10, title: { en: "The Human Eye and the Colourful World", hi: "मानव नेत्र तथा रंगबिरंगा संसार" } },
  "x/ch11": { cls: 10, no: 11, title: { en: "Electricity", hi: "विद्युत" } },
  "x/ch12": { cls: 10, no: 12, title: { en: "Magnetic Effects of Electric Current", hi: "विद्युत धारा के चुंबकीय प्रभाव" } },
  "x/ch13": { cls: 10, no: 13, title: { en: "Our Environment", hi: "हमारा पर्यावरण" } },
  /* Class IX Science 2026-27 (Compulsory 086): app keys ix1…ix12 */
  "ix/ix1":  { cls: 9, no: 1,  title: { en: "The Fundamental Unit of Life (Cell)", hi: "जीवन की मौलिक इकाई (कोशिका)" } },
  "ix/ix2":  { cls: 9, no: 2,  title: { en: "Tissues", hi: "ऊतक" } },
  "ix/ix3":  { cls: 9, no: 3,  title: { en: "Reproduction & Dispersal", hi: "जनन एवं प्रकीर्णन" } },
  "ix/ix4":  { cls: 9, no: 4,  title: { en: "Diversity in Living Organisms", hi: "जीवों में विविधता" } },
  "ix/ix5":  { cls: 9, no: 5,  title: { en: "Is Matter Around Us Pure?", hi: "क्या हमारे आस-पास के पदार्थ शुद्ध हैं?" } },
  "ix/ix6":  { cls: 9, no: 6,  title: { en: "Structure of the Atom", hi: "परमाणु की संरचना" } },
  "ix/ix7":  { cls: 9, no: 7,  title: { en: "Atoms and Molecules", hi: "परमाणु एवं अणु" } },
  "ix/ix8":  { cls: 9, no: 8,  title: { en: "Earth Systems, Atmosphere & Cycles", hi: "पृथ्वी तंत्र, वायुमंडल एवं चक्र" } },
  "ix/ix9":  { cls: 9, no: 9,  title: { en: "Motion", hi: "गति" } },
  "ix/ix10": { cls: 9, no: 10, title: { en: "Force and Laws of Motion", hi: "बल तथा गति के नियम" } },
  "ix/ix11": { cls: 9, no: 11, title: { en: "Work, Energy and Power", hi: "कार्य, ऊर्जा और शक्ति" } },
  "ix/ix12": { cls: 9, no: 12, title: { en: "Sound", hi: "ध्वनि" } }
});

/* ---------- lab registry ---------- */
const LABS = new Map();
const isObj = v => v && typeof v === "object" && !Array.isArray(v);
const bi = (o, where) => { if (!isObj(o) || typeof o.en !== "string" || !o.en || typeof o.hi !== "string" || !o.hi) throw new Error(`Curiosity Lab: ${where} needs {en, hi} strings`); };

/** Validates a lab against the contract and registers it. Throws a descriptive Error on any violation. */
export function registerLab(lab) {
  if (!isObj(lab)) throw new Error("Curiosity Lab: lab must be an object");
  if (!/^[a-z0-9-]+$/.test(lab.id || "")) throw new Error(`Curiosity Lab: bad lab id "${lab.id}" (a-z, 0-9, -)`);
  if (LABS.has(lab.id)) throw new Error(`Curiosity Lab: duplicate lab id "${lab.id}"`);
  const id = lab.id;
  if (lab.cls !== 9 && lab.cls !== 10) throw new Error(`Curiosity Lab: ${id}.cls must be 9 or 10`);
  if (!SYLLABUS[lab.unit]) throw new Error(`Curiosity Lab: ${id}.unit "${lab.unit}" is not an NCERT unit in SYLLABUS`);
  if (SYLLABUS[lab.unit].cls !== lab.cls) throw new Error(`Curiosity Lab: ${id}.unit belongs to class ${SYLLABUS[lab.unit].cls}, lab says ${lab.cls}`);
  bi(lab.title, `${id}.title`); bi(lab.blurb, `${id}.blurb`);
  if (typeof lab.icon !== "string" || !lab.icon) throw new Error(`Curiosity Lab: ${id}.icon required`);
  if (!Array.isArray(lab.vars) || !lab.vars.length) throw new Error(`Curiosity Lab: ${id}.vars must list at least one variable`);
  const seen = new Set();
  lab.vars.forEach(v => {
    if (!/^[A-Za-z][A-Za-z0-9]*$/.test(v.id || "")) throw new Error(`Curiosity Lab: ${id} bad variable id "${v.id}"`);
    if (seen.has(v.id)) throw new Error(`Curiosity Lab: ${id} duplicate variable "${v.id}"`);
    seen.add(v.id); bi(v.label, `${id}.${v.id}.label`);
    if (typeof v.unit !== "string") throw new Error(`Curiosity Lab: ${id}.${v.id}.unit must be a string ("" if unitless)`);
    if (![v.min, v.max, v.step, v.value].every(Number.isFinite) || !(v.min < v.max) || !(v.step > 0) || v.value < v.min || v.value > v.max)
      throw new Error(`Curiosity Lab: ${id}.${v.id} needs finite min < max, step > 0 and min ≤ value ≤ max`);
  });
  ["mount", "facts", "questions", "snapshot"].forEach(fn => { if (typeof lab[fn] !== "function") throw new Error(`Curiosity Lab: ${id}.${fn} must be a function`); });
  if (lab.missions !== undefined) {
    if (!Array.isArray(lab.missions)) throw new Error(`Curiosity Lab: ${id}.missions must be an array`);
    const ms = new Set();
    lab.missions.forEach((m, i) => {
      if (!isObj(m) || !m.id || ms.has(m.id)) throw new Error(`Curiosity Lab: ${id}.missions[${i}] needs a unique id`);
      ms.add(m.id); bi(m, `${id}.missions[${i}]`);
      if (typeof m.check !== "function") throw new Error(`Curiosity Lab: ${id}.missions[${i}].check must be a function`);
    });
  }
  LABS.set(id, Object.freeze(lab));
  return lab;
}
/** A visual question as the quiz engine expects it. Throws a readable Error if anything is wrong (used by the tests and by the quiz before it shows a question). */
export function validateQuestion(q) {
  const w = m => { throw new Error(`question ${q && q.id}: ${m}`); };
  if (!isObj(q) || !q.id) throw new Error("question needs an id");
  if (q.kind !== "name" && q.kind !== "predict") w(`kind must be "name" or "predict"`);
  bi(q.prompt, `${q.id}.prompt`); bi(q.why, `${q.id}.why`);
  if (q.image !== null && !(isObj(q.image) && isObj(q.image.vars))) w("image must be null or {vars, focus?}");
  if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 5) w("2–5 options required");
  const ids = new Set(), texts = new Set();
  q.options.forEach(o => { bi(o, `${q.id}.option`); if (!o.id || ids.has(o.id)) w("option ids must be unique"); ids.add(o.id); if (texts.has(o.en)) w(`duplicate option text "${o.en}"`); texts.add(o.en); });
  if (!ids.has(q.answer)) w("answer must be one of the option ids");
  return q;
}
export const labs = () => [...LABS.values()];
export const getLab = id => LABS.get(id) || null;
/** Test helper: forget every registered lab. */
export const _resetLabs = () => LABS.clear();

/** Default variable values of a lab, as a plain object. */
export const defaults = lab => Object.fromEntries(lab.vars.map(v => [v.id, v.value]));
/** Clamp + snap a value to a variable's range and step. */
export function snap(v, x) {
  const n = Math.round((Math.min(v.max, Math.max(v.min, +x)) - v.min) / v.step) * v.step + v.min;
  const dp = (String(v.step).split(".")[1] || "").length;
  return +Math.min(v.max, Math.max(v.min, n)).toFixed(dp);
}

/* ---------- tiny event bus (simulator → quiz) ---------- */
const subs = new Map();
export const bus = {
  on(ev, fn) { (subs.get(ev) || subs.set(ev, new Set()).get(ev)).add(fn); return () => subs.get(ev)?.delete(fn); },
  emit(ev, data) { (subs.get(ev) || []).forEach(fn => { try { fn(data); } catch (e) { console.error("[curiosity] listener failed", ev, e); } }); }
};

/* ---------- XP / level maths (level L needs 100·L·(L−1)/2 XP in total) ---------- */
export function levelInfo(xp) {
  xp = Math.max(0, Math.floor(xp));
  const level = Math.floor((1 + Math.sqrt(1 + (8 * xp) / 100)) / 2);
  const base = (100 * level * (level - 1)) / 2, next = (100 * (level + 1) * level) / 2;
  return { level, xp, into: xp - base, span: next - base, pct: Math.round(((xp - base) / (next - base)) * 100) };
}

/* ---------- persistent progress store ---------- */
const KEY = "va.cl.v1";
const blank = () => ({ xp: 0, streak: 0, bestStreak: 0, answered: 0, correct: 0, labs: {} });
const labRec = () => ({ tweaks: 0, runs: 0, explored: {}, correct: 0, answered: 0, missions: [] });
const read = () => { try { const o = JSON.parse(localStorage.getItem(KEY) || "null"); return isObj(o) ? { ...blank(), ...o, labs: isObj(o.labs) ? o.labs : {} } : blank(); } catch { return blank(); } };
const write = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode: progress simply lives for this visit */ } };

let state = read();
const listeners = new Set();
const commit = () => { write(state); try { window.dispatchEvent(new Event("va-cl-progress")); } catch { /* not in a page */ } listeners.forEach(fn => { try { fn(state); } catch (e) { console.error("[curiosity] store listener failed", e); } }); };

export const store = {
  get: () => state,
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  lab(id) { return state.labs[id] || labRec(); },
  /** A student changed a variable: counts a tweak and remembers which values they have seen (so questions only ask what they explored). */
  recordTweak(labId, varId, value) {
    const r = (state.labs[labId] = { ...labRec(), ...state.labs[labId] });
    r.tweaks++; const seen = (r.explored[varId] = r.explored[varId] || []);
    if (!seen.includes(value)) { seen.push(value); if (seen.length > 60) seen.shift(); }
    commit();
  },
  /** One simulator run finished (e.g. an object was dropped / a circuit closed). */
  recordRun(labId) { const r = (state.labs[labId] = { ...labRec(), ...state.labs[labId] }); r.runs++; commit(); },
  /** Marks a discovery mission complete (idempotent: XP is awarded only the first time). */
  recordMission(labId, missionId, bonus = 15) {
    const r = (state.labs[labId] = { ...labRec(), ...state.labs[labId] });
    const list = Array.isArray(r.missions) ? r.missions : (r.missions = []);
    if (list.includes(missionId)) return { awarded: false, xp: state.xp, level: levelInfo(state.xp).level, leveledUp: false };
    const before = levelInfo(state.xp).level;
    list.push(missionId);
    state.xp += Math.max(0, bonus | 0);
    const level = levelInfo(state.xp).level;
    commit();
    return { awarded: true, gained: bonus | 0, xp: state.xp, level, leveledUp: level > before };
  },
  /** An answer was given: updates streak, XP and per-lab accuracy. Returns {gained, streak, level, leveledUp}. */
  recordAnswer(labId, correct, bonus = 0) {
    const before = levelInfo(state.xp).level, r = (state.labs[labId] = { ...labRec(), ...state.labs[labId] });
    state.answered++; r.answered++;
    let gained = 0;
    if (correct) { state.correct++; r.correct++; state.streak++; state.bestStreak = Math.max(state.bestStreak, state.streak); gained = 10 + Math.min(state.streak - 1, 10) * 2 + bonus; state.xp += gained; }
    else state.streak = 0;
    const level = levelInfo(state.xp).level;
    commit();
    return { gained, streak: state.streak, level, leveledUp: level > before };
  },
  /** Experiments done in this lab so far: gates the knowledge check (you answer after you experiment). */
  explored: labId => Object.keys(store.lab(labId).explored).length,
  reset() { state = blank(); commit(); },
  /** Test helper: re-read from storage. */
  _reload() { state = read(); }
};
