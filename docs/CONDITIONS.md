# 2D condition pictures ("sub-images") and the haemodialysis topic

## What a condition picture is
A **main** 2D picture (e.g. *Circulatory system*, *Human eye*, *Convex lens*) can have several **conditions**: the same subject shown in a changing situation — *myopia / hypermetropia / corrected*, *sea breeze by day / land breeze by night*, *series / parallel*, *interphase → telophase*, *hypotonic / isotonic*… Each condition has its own picture, bilingual title and description, and its own tap-to-reveal labels.

* **In the app** (`assets/va-2d.js`): a strip of thumbnails "Conditions · स्थितियाँ" under the title; tap one (or press `]` / `[`) and the picture, title, description and labels change. Changing topic or picture resets to the main picture.
* **Projector / Present mode**: every condition is its own slide, right after its main picture (Space / → after the last label moves on to the next condition, then the next picture).
* **Standalone viewers** (`public/2d/<class>/<subject>/viewer.html`, via `public/2d/present.js`): same strip in the top bar, same keys, same Present deck.
* **Data**: `public/2d/conditions.js` (`window.VA_CONDS`, generated) + `public/2d/conditions/*.webp`.

## Where the pictures come from (honest note)
They are **renders of the atlas's own 3D models**, not photographs and not AI-generated art. `tools/conditions/render.mjs` opens each 3D topic, jumps to a step (the end state), hides all UI, takes a picture of the stage and records where every 3D label lands in the picture — so a condition picture has exactly the same bilingual labels as its 3D scene, with correct positions. They match the look of the 3D engine (clean PBR renders), not the photo-style of the older main pictures.

```
node tools/conditions/render.mjs [base-url] [only-substring]   # needs Playwright + Chromium, software GL is fine (~10 s per picture)
python3 tools/conditions/build.py                              # PNG → WebP, writes public/2d/conditions.js and adds the haemodialysis main picture
node tests/conditions.js http://localhost:8765/index.html      # data + UI + 3D checks
```
**Add a condition:** add `{topic, step}` to `tools/conditions/manifest.json` under the main picture's `conds` (or `steps` when one topic supplies all of them), re-run the two commands. Step numbers are 0-based and the picture shows the *end* of that step.

## Haemodialysis (artificial kidney) — new topic `ch5/dialysis3d`
* **3D** (`tools/cell-module.js`, SET 10, injected by `tools/inject-anatomy.py`): patient's forearm with AV fistula, two needles and tape; clear PVC blood lines with live blood; peristaltic blood pump; heparin syringe pump; air trap; machine with monitor; a dialyzer cut open to show ~60 hollow semi-permeable fibres; counter-current dialysing fluid; supply tank and drain; a magnified membrane panel with pores where urea and extra salts cross while blood cells and proteins stay. 8 steps, 23 bilingual labels, info cards for every part, 6-question quiz, "real life" cards. NCERT Class X ch 5: artificial kidney = haemodialysis; **no reabsorption in dialysis**.
* **2D**: main picture `class10/biology/dialysis` (render of the overview with all 18 labels) + 7 condition pictures (fistula, blood out, dialyzer, membrane, counter-current, return, safety). Linked from `ch5/dialysis3d` and `ch5/nephron3d`; also in the standalone Class X Biology viewer.
* Proportions, flow speeds and particle motion are schematic (stated on screen); the dialyzer shows ~60 of ~10 000 fibres.

## Fixed on the way
* Tapping a part in the seven detailed models built from `tools/cell-module.js` (atom, neuron, kidney/nephron, reproduction, flower, genetics, cell division) showed **no info card** — their tables (`KIND3`…`KIND9`) were never consulted. `run()` now takes `kinds`.
* Added `__atlas.anchors()` (screen positions of the current labels) — used by the renderer and handy for tests.

## Known limits
* A report code issued before this release can read topic positions after chapter 5 wrongly, because the topic list gained an entry (same as with earlier new topics).
* The condition renders are only as detailed as the 3D scenes they come from.
