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
