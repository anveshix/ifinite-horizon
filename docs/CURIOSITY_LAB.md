# Curiosity Lab — 3D Simulator & Visual Knowledge Check

Status: **Phase 1 (scaffold) done.** Phases 2–4 add the labs, the quiz and the wiring (see plan below).

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
  labs/                         (Phase 2)  lens.js  ohm.js  force.js  energy.js
  quiz/                         (Phase 3)  visual questions + dopamine effects
tests/curiosity.js              Playwright + in-page unit checks
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
  questions(ctx) { return [/* visual MCQs built from what the student explored */]; }
};
```
Rules that keep it honest: `ctx.set` snaps to `min/max/step`, records the value the student actually saw (`store.explored`), and emits `sim:change` with the derived `facts`; the **Knowledge check tab stays locked until the student has changed at least one variable** — you answer after you experiment.

## Plan
* **Phase 2** — Three.js labs: Lens (u, f → image position, size, nature; lens formula & sign convention), Ohm's law (V, R → I, bulb brightness), Force & motion (F, m → a), Energy (height, mass → PE/KE, speed; free fall independent of mass). NCERT-only maths, no out-of-syllabus physics.
* **Phase 3** — visual MCQ engine + effects: canvas confetti, glowing text, streak flames, CSS haptic shake + `navigator.vibrate`, sound-free by default (respects reduced-motion).
* **Phase 4** — questions generated from the student's own explored values; wiring to `store`, XP and the atlas progress; integration test over every lab.
