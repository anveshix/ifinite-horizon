# Curiosity Lab — 3D Simulator & Visual Knowledge Check

Status: **Phase 1 (scaffold) and Phase 2 (four 3D labs + question generators) done.** Phases 3–4 add the quiz UI / effects and the wiring (see plan below).

## Phase 1 scan — what the codebase is
| Finding | Consequence for the Curiosity Lab |
|---|---|
| Static site, **no build step**, no npm dependencies (`package.json`: "static site, no build step"); `index.html` is the app, deployed as-is on Vercel / GitHub Pages and works offline | A React + R3F + Tailwind toolchain (Vite, JSX, a second Three.js copy) would break the "open the file and it runs" contract and double the 3D payload. **The Curiosity Lab is written as framework-free ES modules on the already vendored Three.js r160** (`assets/vendor/three.module.min.js`) — the same engine R3F wraps — with an R3F-style lifecycle (`mount` → `{ dispose, resize }`, declarative variables, derived `facts`). |
| Features are sibling IIFE scripts (`va-2d.js`, `va-cinema.js`, `va-voice.js`) loaded at the end of `index.html`, injecting a button into `#stagebar` and an overlay | `assets/va-curiosity.js` follows the same pattern; **nothing loads until the first tap** (module, CSS, Three.js are fetched on demand), so the atlas starts exactly as fast as before |
| Theme tokens `--bg --ink --acc --bd --glass --fs` + light "Classroom Bright" skin and dark mode | `curiosity.css` uses only those tokens, so it follows both themes and the text-size control |
| Atlas pauses its 3D loop through `window.__vaPause` | The lab sets it while open and restores the previous value on close |
| No confetti / animation library, offline-first | Phase 3 ships its own canvas confetti, CSS shake and glow (no CDN) |
| NCERT structure is already modelled (`docs/CLASS9_COVERAGE.md`): Class X ch 9 *Light*, ch 11 *Electricity*; Class IX 2026-27 ch 9 *Motion*, 10 *Force and Laws of Motion*, 11 *Work and Energy* | Labs may only register against these units (`SYLLABUS` in `core.js`; the registry rejects anything else) |

## Layout
```
assets/va-curiosity.js          launcher: stage-bar + Home buttons, key K, lazy import
assets/curiosity/
  boot.js                       registers labs, re-exports shell API  (add one line per lab)
  core.js                       NCERT map · lab registry + contract validation · snap() · XP/level maths ·
                                persistent store (va.cl.v1) · sim→quiz event bus
  shell.js                      overlay: HUD (XP, streak, level), tabs, picker, lab lifecycle, quiz host
  curiosity.css                 tokens-based styles
  labs/models.js                pure physics (lens, circuit, F = ma, pendulum) — one source of truth for 3D, 2D and marking
  labs/kit.js                   Three.js stage + orbit camera, sliders, facts panel, sprites, 2D drawing, question helpers
  labs/lens.js ohm.js force.js energy.js   the four simulators
  quiz/                         (Phase 3)  visual questions + dopamine effects
tests/curiosity.js              Playwright: launcher, shell, core.js
tests/curiosity-labs.js         Playwright: all four labs (render, sliders, physics values, run/pause, dispose, phone layout)
tests/curiosity-physics.mjs     node: physics models vs NCERT results (180 checks)
tests/curiosity-questions.mjs   node: every question generator vs an independent re-derivation (≈42 000 checks)
```

## Lab contract (enforced by `registerLab`, violations throw a readable error)
```js
export default {
  id: "lens", cls: 10, unit: "x/ch9", icon: "🔭",
  title: { en, hi }, blurb: { en, hi },
  vars: [{ id: "u", label: { en, hi }, unit: "cm", min, max, step, value }],   // every slider the student may change
  async mount(ctx) { /* build the 3D scene in ctx.stage, controls in ctx.side;
                        call ctx.set(varId, value) when a control moves, ctx.run() when a run completes */
                     return { dispose(){}, resize(){} }; },
  facts(vars) { return [{ id, en, hi, value }]; },        // what the physics says right now (drives questions)
  snapshot(canvas, vars, focus) { /* draws the 2D picture a question shows */ },
  questions({ vars, explored, rnd, seed }) { return [/* visual MCQs, built with ask() from the values the student explored */]; }
};
```
Rules that keep it honest: `ctx.set` snaps to `min/max/step`, records the value the student actually saw (`store.explored`), and emits `sim:change` with the derived `facts`; the **Knowledge check tab stays locked until the student has changed at least one variable** — you answer after you experiment.

## Labs (Phase 2)
| Lab | NCERT unit | Student changes | 3D scene | Questions (kind) |
|---|---|---|---|---|
| Lens Lab | Class X ch 9 | object distance u, focal length f, convex / concave | optical bench, lens, object & image arrows, 3 principal rays, screen, virtual-image dashes | nature of image, position, name the lens, everyday use, *predict* object moved closer, power |
| Circuit Lab | Class X ch 11 | battery voltage, R₁, R₂, single / series / parallel | board, battery cells, ammeter + voltmeter with moving needles, glowing resistors, drifting electrons, live V–I graph | name the component, *predict* V or R changed, name the wiring, equivalent resistance, name the law (V–I graph), heating effect |
| Force Lab | Class IX ch 10 | force F, mass m (even while it runs) | trolley with mass blocks, force arrow, moving track, live v–t graph | acceleration, *predict* F or m changed, name the law, momentum, name the v–t graph, inertia |
| Energy Lab | Class IX ch 11 | bob mass m, release height h (even while it swings) | pendulum with height ruler, live PE / KE / total bars | PE at top, KE at bottom, PE = mgh, *predict* mass doubled (speed unchanged), *predict* height changed, conservation of energy |

A **question** is `{ id, kind: "name"|"predict", prompt, image: {vars, focus?}|null, options[2–5], answer, why, meta? }` (`validateQuestion` in `core.js` enforces it). Its picture is drawn on demand by the lab's own `snapshot(canvas, vars, focus)` from the same physics model as the simulator, and the values come from what the student actually explored (`store.explored`).

**Correctness guard:** `tests/curiosity-questions.mjs` re-derives every answer without the lab's own code (ray-geometry intersection instead of the lens formula, F·t for momentum, V/R series/parallel by hand…). It caught a real bug while the labs were being written — "predict" questions about changing one resistor in a series/parallel circuit marked "stays the same" as correct — which is why those questions now change *all* resistors together or the voltage.

## Plan
* **Phase 2 ✓** — the four Three.js labs above, NCERT-only maths.
* **Phase 3** — visual MCQ engine + effects: canvas confetti, glowing text, streak flames, CSS haptic shake + `navigator.vibrate`, sound-free by default (respects reduced-motion).
* **Phase 4** — questions generated from the student's own explored values; wiring to `store`, XP and the atlas progress; integration test over every lab.
