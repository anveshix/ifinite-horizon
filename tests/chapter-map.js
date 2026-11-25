// Chapter map test — the COMPLETE NCERT chapter tree (docs/ch2-ncert-inventory.md):
// every section, subsection, activity, figure, table, box and exercise of printed
// Chapter 3 ("Tissues in Action", pp. 28–47) present, stats correct, render + inspector
// wiring intact, index.html wiring unchanged.
"use strict";
const fs = require("fs"), path = require("path");
const assert = (c, m) => { if (!c) { console.error("ASSERT FAIL:", m); process.exit(1); } };
const src = fs.readFileSync(path.join(__dirname, "..", "assets", "va-chapter-map.js"), "utf8");
assert(/\(function\(root,factory\)\{const api=factory\(\)/.test(src), "compact UMD wrapper preserved");
assert(!src.includes("�"), "no U+FFFD in chapter map source");
const M = require(path.join(__dirname, "..", "assets", "va-chapter-map.js"));

// ---------- registry + curriculum fixtures ----------
const coverage = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "docs", "class9-coverage.json"), "utf8"));
const curriculum = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "api", "ai", "curriculum.json"), "utf8"));
const ix2c = coverage.modules.find(m => m.id === "ix2");
const ix2k = curriculum.chapters.find(c => c.id === "ix2");
assert(ix2c && ix2k, "ix2 present in coverage and curriculum");
assert(ix2c.keyConcepts === ix2k.keyConcepts.length, "coverage keyConcepts count matches curriculum array");
const ch = Object.assign({}, ix2k, { kp: "ix2" });

// runtime stubs (harvest sources)
global.VA_SIM_CORE = { SIMS: [
  { id: "apical", key: "ix2/meristem", title: "Root tip growth" }
] };
global.__va2d = { map: {
  "ix2/meristem": ["class9/biology/plant_tissues_schematic"],
  "ix2/tissues": ["class9/biology/plant_tissues_schematic"],
  "ix2/joint": ["class9/biology/skeleton_joint"]
}, set: () => 0, show: () => 0 };
global.__atlas = { keys: () => ["ix2/meristem", "ix2/joint", "ix2/joint3d"], go: () => 0, key: () => "", topic: () => ({ ch: "ix2" }) };
global.VA_TISSUE_CONTENT = { sections: [
  { title: "Introduction", pages: "pp. 28–29" }, { title: "Apical meristem", pages: "pp. 29–31" },
  { title: "Permanent tissues", pages: "pp. 32–33" }, { title: "Epithelial", pages: "p. 34" },
  { title: "Connective", pages: "pp. 35–36" }, { title: "Muscular & nervous", pages: "pp. 36–38" },
  { title: "Musculoskeletal & joints", pages: "pp. 38–41" }, { title: "Totipotency", pages: "p. 42" }
] };

// ---------- API surface ----------
assert(typeof M.build === "function" && typeof M.render === "function" &&
  typeof M.wire === "function" && typeof M.has === "function" && typeof M.preview === "function",
  "all five exports present");
assert(M.has("ix2") === true && M.has("nope") === false, "has() on ix2");
assert(Object.keys(M.DATA.ix).length === 1, "ix2 is the only chapter so far (one at a time)");

// ---------- book completeness (hand inventory vs NCERT) ----------
const d = M.DATA.ix.ix2;
const bookJson = JSON.stringify(d.book);
const collect = re => { const out = new Set(); let g;
  while ((g = re.exec(bookJson)) !== null) { out.add(+g[1]); if (g[2]) for (let i = +g[1]; i <= +g[2]; i++) out.add(i); } return out; };
const seq = (set, n) => set.size === n && Array.from({ length: n }, (_, i) => i + 1).every(x => set.has(x));

const figs = collect(/Fig\.? ?3\.(\d+)(?:[–-]3\.(\d+))?/g);
const acts = collect(/Activity ?3\.(\d+)/g);
const tbls = collect(/Table ?3\.(\d+)/g);
const qs = collect(/Q(\d+)(?:[–-](?:Q)?(\d+))?/g);
assert(seq(figs, 25), "all figures Fig 3.1–3.25 present (" + figs.size + ")");
assert(seq(acts, 5), "all activities Activity 3.1–3.5 present (" + acts.size + ")");
assert(seq(tbls, 7), "all tables Table 3.1–3.7 present (" + tbls.size + ")");
assert(seq(qs, 15), "all exercises Q1–Q15 present (" + qs.size + ")");
const secs = new Set(); (function walk(ns) { ns.forEach(n => { if (/^3\.\d/.test(n.n)) secs.add(n.n.split(" ")[0]); if (n.kids) walk(n.kids); }); })(d.book);
assert(secs.size === 19, "19 section headings 3.1–3.6 incl. subsections (" + [...secs].sort().join(",") + ")");

// structural nodes
let flat = []; (function wf(ns, depth) { ns.forEach(n => { n.__depth = depth; flat.push(n); if (n.kids) wf(n.kids, depth + 1); }); })(d.book, 0);
assert(flat.length >= 80, "book tree has at least 80 nodes (" + flat.length + ")");
assert(flat.every(n => n.id && n.n), "every node has id and name");
assert(new Set(flat.map(n => n.id)).size === flat.length, "node ids unique");
assert(d.xlinks.length >= 8, "cross-links defined (" + d.xlinks.length + ")");
assert(d.xlinks.every(l => flat.some(n => n.id === l[0]) && flat.some(n => n.id === l[1])), "xlink endpoints exist");
// key branches exist
["b0", "b1", "b21", "b24", "b31", "b34", "b4", "b5d", "b6", "b7", "b9", "b10", "b11", "b12"]
  .forEach(id => assert(flat.find(n => n.id === id), "node " + id + " exists"));

// ---------- build → stats + attachments ----------
const m = M.build("ix2", ch, null);
assert(m, "build succeeds");
const s = m.stats;
assert(s.sections === 19, "stats.sections = 19 (" + s.sections + ")");
assert(s.activities === 5, "stats.activities = 5 (" + s.activities + ")");
assert(s.tables === 7, "stats.tables = 7 (" + s.tables + ")");
assert(s.figs === 25, "stats.figs = 25 (" + s.figs + ")");
assert(s.exercises === 15, "stats.exercises = 15 (" + s.exercises + ")");
assert(s.boxes === 14, "stats.boxes = 14 (" + s.boxes + ")");
assert(s.lessons === 8, "lesson sections = 8 (" + s.lessons + ")");
assert(s.sims >= 1, "simulator attached (" + s.sims + ")");
assert(s.prac === 2, "practical items = 2 (" + s.prac + ")");

const byId = id => m.flat.find(n => n.id === id);
assert(byId("b21").att && byId("b21").att.sim === "apical", "b21 → apical simulator");
assert(byId("b21").att.prac && byId("b21").att.prac.length === 2, "b21 → 2 practical items");
assert(byId("b21").att.lesson && byId("b21").att.lesson.length >= 1, "b21 → lesson section");
assert(byId("b4").att && byId("b4").att.has3d, "b4 (musculoskeletal) → 3D view");
assert(byId("b4").att.images.length >= 1, "b4 → image");
assert(byId("b33").att.images.length >= 2, "muscular node → 2 images");
assert(byId("b5").att.has3d, "joints node → 3D view");

// ---------- render ----------
const html = M.render(ch);
assert(html.length > 10000, "render output substantial (" + html.length + ")");
assert((html.match(/data-cm-node=/g) || []).length === m.flat.length, "every node rendered once");
assert(/19 sections/.test(html) && /Fig 25/.test(html) && /Q 15/.test(html), "stats header shows chapter totals");
assert(/data-cm-toggle="all"/.test(html) && /data-cm-toggle="none"/.test(html), "Expand all / Fold all controls");
assert(/data-cm-zoom="fit"/.test(html), "fit control");
assert(/📖 Read source-grounded lesson/.test(html), "lesson action on overview");
assert(/data-cm-act="lab"/.test(html) && /data-cm-act="inquiry"/.test(html), "practical actions on overview");
assert(/⚗/.test(html), "simulator action present");
assert(!/�/.test(html), "no U+FFFD in render output");

// ---------- preview / inspector ----------
assert(/COMPLETE NCERT CHAPTER MAP/.test(M.preview("ix2", ch)), "overview preview");
const pAct = M.preview("ix2", ch, "b21");
assert(/Root-tip growth simulator|Open simulator/.test(pAct), "b21 inspector offers simulator");
assert(/Practical 5/.test(pAct), "b21 inspector offers Practical 5");
const pX = M.preview("ix2", ch, "b22");
assert(/Connected/.test(pX) && /annual rings/.test(pX), "b22 inspector shows cross-link to annual-rings exercise");
const pLeaf = M.preview("ix2", ch, "b10c");
assert(/Q7/.test(pLeaf) && /Connected/.test(pLeaf), "exercise node inspector works");
const pSec = M.preview("ix2", ch, "b10");
assert(/Subtopics/.test(pSec), "section node lists subtopics");
assert(/cm-back/.test(pSec), "back to overview control");

// ---------- index.html wiring unchanged ----------
const htmlPage = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
assert(htmlPage.includes("va-chapter-map.js"), "script tag present");
assert(/const chapterMap\s*=/.test(htmlPage), "chapterMap const present");
assert(htmlPage.includes("${chapterMap}"), "template slot present");
assert(/VA_CHAPTER_MAPS\?\.wire\(box\)/.test(htmlPage), "wire(box) call present");

// ---------- style + pwa registration ----------
const css = fs.readFileSync(path.join(__dirname, "..", "assets", "va-chapter-map.css"), "utf8");
assert(css.includes(".cmap-int") && css.includes(".cm-stats") && css.includes(".cm-legend"), "chapter map CSS present");
assert(css.includes(".cm-d0") && css.includes(".cm-d3"), "tree depth styles present");

console.log("Chapter map OK · Ch2 exemplar: " + s.sections + " sections, " + s.activities +
  " activities, " + s.figs + " figures, " + s.tables + " tables, " + s.exercises +
  " exercises, " + m.flat.length + " nodes, " + d.xlinks.length + " cross-links · completeness asserted against NCERT inventory");
