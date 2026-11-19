# Class IX simulator lab — scope and learning map

**Release slice:** seven 2026–27 Class IX activities plus one separately tagged 2025–26 Matter inquiry (Science 086).

**Course scope:** The 2026–27 slice covers four Physics chapters and three Chemistry chapters. A separate 2025–26 track adds one Matter inquiry; it does not alter the current course. Class X is not implemented in this release.
**Curriculum authority:** [CBSE Science (086), Class IX, 2026–27](https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/ScienceSt_SecP1_2026-27.pdf). The app's Class IX registry and chapter keys are in `docs/class9-coverage.json` and `index.html`.

This is an **initial, chapter-linked inquiry slice**, not evidence that every official learning outcome, practical, or examination demand is covered. Outcomes below are short teaching goals for the individual models, not official CBSE quotations. The simulator does not claim teacher validation. The visualisations are idealised and must support, not replace, hands-on practical work.

| Subject | Official chapter in the app registry | Activity | Main learner investigation | Related app topic |
|---|---|---|---|---|
| Physics | Motion | Position–time explorer | Change initial velocity, acceleration, and time; compare displacement, velocity, and a schematic position–time curve under constant acceleration. | `ix9/line` |
| Physics | Force and Laws of Motion | Net-force block | Vary resultant force and mass; observe `a = Fnet / m`. Friction and air resistance are omitted. | `ix10/forces` |
| Physics | Work, Energy and Simple Machines | Ideal lever | Vary effort/load arms and effort; inspect ideal mechanical advantage and the force–distance trade-off. | `ix11/energy` |
| Physics | Sound | Longitudinal-wave model | Vary frequency, amplitude, and medium; compare source frequency, schematic particle vibration, wave speed, and `v = fλ`. | `ix12/source` |
| Chemistry | Exploring Mixtures and their Separation | Separation decision lab | Choose a mixture, a recovery goal, and a separation technique; compare the choice with the physical-property rationale. This is a conceptual chooser, not a lab protocol. | `ix5/lab` |
| Chemistry | Structure of an Atom | Atomic number / isotope / ion explorer | Change protons, neutrons, and electrons; inspect element identity, mass number, net charge, and simplified 2,8,8 shell filling for the first 18 elements. | `ix6/atom` |
| Chemistry | Atoms and Molecules | Formula and relative-mass builder | Select a common molecule/formula unit and vary particle count; count atoms and calculate relative formula mass using school-level values. | `ix7/molecules` |
| 2025–26 historical track | Matter in Our Surroundings | Water particle-state inquiry | At about 1 atm, vary temperature around school-level 0 °C and 100 °C thresholds; predict particle arrangement and state. | `ix25_1/states` |

## Model limitations that are surfaced in the interface

- Matter (2025–26 only) is a qualitative pure-water particle sketch at approximately 1 atm; the interface surfaces assumptions and the practical-work caveat. It does not calculate pressure-dependent phase boundaries, latent heat, evaporation rate or actual particle trajectories.
- Motion assumes one-dimensional uniformly accelerated motion; its chart is schematic.
- The force model uses **net** force and omits friction, air resistance, and variable mass.
- The lever is ideal: no friction, beam mass, or energy loss. It must not imply that a real machine creates energy.
- The sound particles oscillate parallel to propagation in a schematic representation. They do not travel from source to listener with the wave. The amplitude slider is relative, not a calibrated loudness scale.
- The mixtures activity gives a first-principles method-choice explanation only. It is not a safe or complete procedure and does not replace the official practical.
- The atom diagram is a Bohr-style teaching model, not literal electron trajectories or a scale drawing. It shows simplified shell filling only for the first 18 elements.
- Molecule/formula diagrams are not to scale and do not model bonding geometry, chemical reactions, or particle stability. Relative atomic masses are school-level approximations.

## Verification

Run `npm run test:sim` for simulator scope-map and calculation checks, and `npm test` for both simulator and 2D-bundle checks. These are automated content/math checks, **not** browser rendering, scientific peer review, or classroom evidence. Browser-based and subject-teacher validation should be completed before making stronger claims about teaching effectiveness or full syllabus alignment.
