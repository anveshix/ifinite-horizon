# 3D audit — 127 topics (2026-11-15)

Method: every topic was opened in a headless browser (software GL, so speed numbers are not representative), every step was visited and screenshotted, and consecutive steps were compared. Script: `tools/` + scratchpad run; raw JSON per topic was reviewed by hand.

## Findings
| # | Finding | Count |
|---|---|---|
| 1 | Topics with a real guided step sequence (ordered, captioned) | 42 |
| 2 | **Free-play topics with no step sequence at all** (just a live model + switches) — the "incomplete / not in sequence" complaint | 85 |
| 3 | Guided topics whose steps look identical to the previous step | 4 (`ch3/ionic`, `ix7/ionic`, `ch7/fission`, `ix3/fission`) — one step each, small visual change |
| 4 | JS errors during the sweep | 0 |
| 5 | Models built only from primitives (spheres, tubes) | most of the 120; only heart, digestive, eye, elbow, lungs use real anatomy meshes |

## Fixed in this pass
Guided, bilingual, ordered steps (each step sets the model's own switches and shows a caption + live values) added to **16 biology topics**:
`ch5/xylem`, `ix2/xylem`, `ch6/brain`, `ch6/hormones`, `ch6/plants`, `ch13/web`, `ch13/waste`, `ix1/osmosis`, `ix2/tissues`, `ix3/dispersal`, `ix4/acellular`, `ix4/kingdoms`, `ch5/heart`, `ch5/alveoli`, `ix2/joint`, `ix1/cell`.
Implementation: `tools/guided-module.js` (wrapper; the original models are unchanged).

## Still free-play (no step sequence) — next batches
`adv1/measure`, `adv10/fermenter`, `adv2/frame`, `adv3/gravity`, `adv3/pseudo`, `adv4/machines`, `adv5/spring`, `adv6/rays`, `adv6/spectrum`, `adv7/bonding`, `adv8/column`, `adv8/fractional`, `adv9/microscope`, `adv9/resolution`, `ch1/balancing`, `ch1/combination`, `ch1/corrosion`, `ch1/displacement`, `ch10/eye`, `ch10/prism`, `ch10/scatter`, `ch11/heating`, `ch11/ohm`, `ch11/resistance`, `ch11/series`, `ch12/domestic`, `ch12/field`, `ch12/flhr`, `ch12/induction`, `ch12/magnet`, `ch12/motor`, `ch12/solenoid`, `ch2/indicators`, `ch2/neutralisation`, `ch2/ph`, `ch2/salts`, `ch3/extraction`, `ch3/physical`, `ch3/prevent`, `ch3/reactivity`, `ch4/allotropes`, `ch4/homologous`, `ch4/molecules`, `ch4/reactions`, `ch5/heart3d`, `ch9/optics`, `ch9/power`, `ch9/reflection`, `ch9/slab`, `ix10/forces`, `ix10/trolley`, `ix11/energy`, `ix11/machines`, `ix12/echo`, `ix12/source`, `ix12/wave`, `ix5/conc`, `ix5/lab`, `ix5/types`, `ix6/atom`, `ix7/conserve`, `ix7/molecules`, `ix8/breeze`, `ix8/cycles`, `ix8/heating`, `ix8/spectrum`, `ix8/spheres`, `ix9/circular`, `ix9/line`

## Still primitive-built biology (need real/custom meshes, not just steps)
`ch6/neuron`, `ch6/synapse`, `ch6/reflex`, `ch5/nephron`, `ch7/human`, `ch7/flower`, `ch8/*`, `ix1/division`, `ix2/tissues`, `ix3/human`.
Kidney and brain meshes in the open atlas are not usable (licence: non-commercial / unstated), so these need hand modelling.

## Custom model sets built so far (hand-modelled, procedural, bilingual, stepwise)
1. Animal cell (`ix1/cell3d`) · 2. Plant cell (`ix1/plant3d`) + bacterium (`ix1/bacterium3d`) · 3. Atomic models (`ix6/atom3d`)
4. **Neuron, impulse, synapse, reflex arc (`ch6/neuron3d`)** — myelinated axon with saltatory impulse, Na⁺/K⁺ at a node, magnified synapse with vesicles/receptors/neurotransmitter, reflex arc with relay neuron and contracting muscle.
Real-mesh topics (BodyParts3D): heart, digestive, eye, elbow joint, lungs.
5. **Kidney, nephron & dialysis (`ch5/nephron3d`)** — hand-modelled kidney cut-away, one enlarged nephron (glomerulus, Bowman's capsule, PCT, loop, DCT, collecting duct), animated filtration / selective reabsorption / urine formation, urine path, dialysis.
6. **Human reproduction (`ch7/human3d`)** — male system, sperm cell, female system, ovulation, fertilisation, cleavage to blastocyst and implantation, placenta/foetus, animated 28-day menstrual cycle.
8. **DNA, genes, Mendel, sex determination (`ch8/genetics3d`)** — chromosome→helix zoom, base pairing, semi-conservative copying, gene→mRNA→protein, P/F1 pea cross, 3:1 Punnett, 9:3:3:1 dihybrid, XX/XY. Fixed 2026-11-16: mRNA draw-range bug (was drawing ~12% of the strand), real X chromosome with histone coil, larger gene→protein scene.
9. **Cell division — mitosis & meiosis (`ix1/division3d`)** — interphase → prophase → metaphase → anaphase → telophase/cytokinesis, then meiosis I (pairing, crossing over, homologues separate) and meiosis II, then comparison. Fixed 2026-11-16: meiosis cells no longer overlap (one cell per stage). Flower: cut-away soil block, curved petals.
Next: → flower & pollination → heredity (DNA, Mendel) → cell division (mitosis/meiosis).

## Guided sequences added to the remaining free-play topics (2026-11-16)
`tools/guided-chem.js` (27 chemistry / matter topics) and `tools/guided-phys.js` (40 physics / light / electricity / Earth-system topics) wrap every free-play topic from the audit so it now has an ordered, bilingual step list that presses the model's own buttons. Validated automatically: all 83 guided topics load, every referenced button exists, and the step counter appears (script in the session scratchpad; check = button labels vs `window.__vaSpecs`).
Not verified: the visual result of each individual step (spot-checked: reactivity series, human eye). The model quality of the underlying primitive scenes is unchanged.

## Per-step visual review of the 67 chemistry/physics guided topics (2026-11-17)
All 67 sheets were opened. Fixed: fuse replace (restores 1 A), Fleming-rule steps (current on), combination summary reset, engine "all labels on last step" piling labels (disabled for guided topics), toggle buttons that were clicked blindly (Earth spheres, circular-motion vectors, bar-magnet / wire field lines, microscope ray path → now set to explicit on/off), indicator tests.
Still weak: unrelated-mode labels still show in a few legacy scenes (ix8/cycles last step is crowded), ix10/trolley data table fills only after Release, adv6/spectrum lower panel overlaps. Underlying primitive models are unchanged.

## Custom model set 10: ionic bond NaCl (`ix7/ionic3d`, 7 steps)
Na and Cl atoms with shells, electron transfer, ion formation (Na⁺ smaller, Cl⁻ larger), attraction, 4×4×4 crystal lattice, conductivity (solid vs molten bulb), MgCl₂ / CaO. Verified by screenshots of steps 3, 4, 7 after fixes. Weak: step 4 'attraction' only brings the two ions together visually; electron/ion glows are plain; step 7 is a static schematic.
Planned next: electric circuit (ch11/circuit3d), ray diagrams (ch9/rays3d).

## Custom model set 11: electric circuit (`ch11/circuit3d`, 7 steps)
Cell, plug key (open/closed), bulbs, resistor, ammeter (series), voltmeter (parallel), drifting electrons + conventional-current arrows, V–I graph line, series and parallel layouts, heating glow. Viewed all 7 steps after a camera fix. Honest quality note: this is the weakest of the custom sets so far — the layout is a flat board seen from above, meters partly overlap bulbs, the V–I graph is a single line (no plotted points), series/parallel are drawn by swapping bulbs rather than rewiring. Needs a redesign pass.

## Per-step camera + compact model panel (2026-11-17)
Guided topics now move the camera on every step (`stepCam` in `tools/guided-module.js`): step 1 and the last step use the model's own wide view, middle steps tour left/right/close by ±12–20° yaw and 0.88–0.96 zoom, and the scene is lifted slightly so it sits above the caption. A step can override this with `{cam:"near"|"left"|"right"|"top"|{yaw,zoom,lift}}`. The model's own bottom-right info panel (`#hud`) is capped at 30% height / 46% width, scrolls, and has a ▾/▴ button to collapse it (CSS in `assets/va-skin.css`). Validated: all 83 guided topics still load with no missing buttons; checked visually on ch9/optics and ch12/solenoid only. The tour is generic, not hand-aimed per topic.

## Weakness-fix pass (2026-11-18)
- **Circuit (`ch11/circuit3d`) rebuilt:** series and parallel are now real wiring (series = two bulbs on one rail; parallel = a second branch between two nodes with its own electron path), meters moved off the bulbs, voltmeter leads across the bulb, V–I graph plots points. Viewed all 7 steps.
- **Ray diagrams (`ch9/rays3d`, new, 8 steps):** concave/convex mirror and convex/concave lens, analytic three-ray construction with live u, v, f, m and a REAL/VIRTUAL readout; object slides along the bench. Viewed steps 1–2 only after the last label trim; all 8 viewed earlier.
- **Ionic bond:** attraction line now pulses between ions in step 4. **Flower:** petals have a ripple edge. **Genetics step 4:** one less label. **Cycles, last step:** labels filtered. **Trolley:** longer dwell so the data table fills.
- **Cinema auto-play verified end-to-end** (software GL, 4-step topic): step 1→2→3→4, "Lesson complete" screen, Replay returns to step 1.
- Every custom 3-D topic (18) builds without errors and shows its step counter.
Still open: per-topic hand-aimed cameras (the tour is generic), adv6/spectrum panel overlap, flower soil block, underlying legacy primitive models, real-GPU / projector testing.

## Primitive → custom conversion (physics/chemistry) — progress
Batch 1 (LabKit: glass vessels, liquids, ions, flame, metals): **done** `ch1/displacement3d`, `ch2/neutralisation3d`, `ch2/ph3d` (all steps screenshot-reviewed, software GL only). Liquid colours render pastel under the contrast filter; reaction progress is time-based with per-step baselines so manual stepping shows the right state.
Also done (batch 1): `ch3/reactivity3d`, `ch1/corrosion3d`, `ch1/combination3d` (reviewed; weak spots: rust on the nail is faint, tarnish swatches are flat boxes, deposit on strips is small). Not started: remaining chemistry, mechanics, waves/sound, magnetism, light, Earth systems (~60 topics still legacy-primitive).
