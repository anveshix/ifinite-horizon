# Infinite Horizons: evidence-led review and improvement plan

**Review date:** 2026-11-11  
**Scope:** current repository snapshot on `arena/3453c426-ifinite-horizon`; Class IX and X Science (086), CBSE 2026–27.  
**Decision:** review and plan only. No application fixes are included in this change.

## Executive summary

The reported critics’ score of **4/10 is not independently verifiable**: no critic comments, rubric, or test context were supplied. I therefore do not attribute that number to any particular issue or claim to reproduce it.

There is strong evidence for several quality risks that could reasonably undermine confidence: the repository’s own testing report says scientific comparison and subject-teacher sign-off were not done for its anatomy pilot; the existing tests are historical software-rendered/headless checks, not device or learning validation; the app advertises offline readiness although there is no tracked service worker or web-app manifest in this checkout; and curriculum coverage documents count modules, model pages, and practical links without showing that each official learning outcome has been independently checked or learned. These are evidence-based findings, not an explanation of the critics’ score.

The app also has real strengths: the Class IX chapter list, unit weightings, 13 practical headings, and broad topic coverage correspond closely to the CBSE IX 2026–27 structure. The plan is therefore **not “add more scenes first.”** It is to establish syllabus/content trust, improve outcome-led teaching and assessment, verify the actual classroom experience, and make the technical/release claims reproducible.

## What I checked—and what I could not check

- Read `index.html`, `docs/CLASS9_COVERAGE.md`, `docs/class9-coverage.json`, `docs/AUDIT.md`, `docs/3D_AUDIT.md`, `docs/TESTING.md`, `docs/ARCHITECTURE.md`, `docs/ADDING_A_TOPIC.md`, `DEPLOY.md`, `vercel.json`, `package.json`, and the existing regression test.
- Compared the Class IX and X curriculum structure, marks, assessed/formative distinctions, learning outcomes, question-design guidance, and practical lists against the official CBSE curriculum PDFs linked below.
- Confirmed the Class IX registry contains 12 compulsory modules, the published unit marks (27/25/23/5), and 13 virtual-practical entries; its JSON reports 53 interactive model pages and 154 listed concepts. These are **inventory counts**, not measures of syllabus mastery, accuracy, or teaching effectiveness.
- `docs/TESTING.md` reports earlier Chromium/software-WebGL tests. I did not rerun them: Playwright is not installed in this checkout/environment. No real-device, teacher, accessibility, usability, or student-learning study was available for this review.
- The Class IX 2026–27 PDF is the authority used for Class IX. The linked NCERT Grade 9 document is labelled draft and is not used here to overrule CBSE’s syllabus.

## Official curriculum baseline

### Class IX (Science 086)

CBSE assigns 80 theory marks and 20 internal-assessment marks. Theory unit weights are:

| Unit | Chapters | Marks | Share of theory |
|---|---:|---:|---:|
| World of Living | 2, 3, 11, 12 | 27 | 33.75% |
| Matter—Its Nature and Behaviour | 5, 8, 9 | 25 | 31.25% |
| Motion, Force, Work and Sound | 4, 6, 7, 10 | 23 | 28.75% |
| Earth as a system | 13 | 5 | 6.25% |

The curriculum lists 13 practicals. Its question-paper design is 50% knowledge/understanding, 30% application, and 20% formulating/analyzing/evaluating/creating. It also calls for varied objective, assertion–reason, short/long answer and source/case/passage/integrated question types, with approximately 33% internal choice. Outcomes include planning investigations, using instruments, representing and interpreting data, drawing inferences, modelling, and communicating findings—not just recognising a 3D object.

### Class X (Science 086)

Theory unit weights are Chemical Substances—Nature and Behaviour 25, World of Living 25, Natural Phenomena 12, Effects of Current 13, and Natural Resources 5 (80 theory marks); internal assessment is 20. The same 50/30/20 competency split and broad question types apply.

Important scope distinction: the 2026–27 syllabus marks **Periodic Classification of Elements, Heredity and Evolution, and Motor/Electromagnetic Induction/Electric Generator** as formative-only—not assessed in the year-end examination. They may still support learning/portfolio work. “Included for learning” must not be presented to pupils as “summatively examinable.” The syllabus also lists 14 numbered practical entries (the first has A/B parts); unlike the dedicated Class IX practical overlay, I found no Class X practical-coverage audit or parallel structured Class X lab workflow in the repository. This is a documentation/product gap to verify, not a claim that none of the individual Class X experiments are represented anywhere.

## Findings: weaknesses supported by repository evidence

### P0 — Scientific and syllabus trust is not yet release-grade

1. **Scientific sign-off is explicitly missing.** `docs/TESTING.md` says the digestive and heart-scene content was not compared against the official syllabus/textbook and had no subject-teacher review. It calls out specific unresolved anatomy, terminology, and schematic-path issues. This does not prove every topic is wrong; it does mean passing JavaScript/render checks cannot be treated as science approval.
2. **Coverage claims are stronger than their evidence.** `docs/CLASS9_COVERAGE.md` and its JSON establish that entries/pages/practical links exist. They do not establish that every official outcome is accurately taught, that the practical simulation produces valid observations, or that a learner can transfer the concept. A single model can touch many listed concepts while leaving important explanations or skills unlearned.
3. **Assessment scope needs a visible, auditable distinction.** Class X contains formative-only material. Some content is labelled formative inside the app (for example, an evolution-scene HUD note), but I found no explicit “not assessed in the year-end exam” wording in the app and no evidence of a consistent, syllabus-wide scope treatment. Per-topic status should be checked and shown clearly before the app is used for exam revision.
4. **Source traceability is incomplete.** The IX registry flags some details for teacher/textbook confirmation, and its source references say page references are to be confirmed. The coverage report cites a “Complete Syllabus & 3D Model Brief,” rather than giving a clean, versioned CBSE source-to-outcome audit trail. Topics, claims, Hindi equivalents, and assessment items need provenance and named review status.

### P1 — Learning design and assessment are less developed than the feature/coverage counts suggest

5. **The product is scene-led, while CBSE is outcome- and inquiry-led.** A lesson can have a live model and step player without requiring a prediction, controlled variable, measurement, graph interpretation, evidence-backed conclusion, or explanation in the learner’s own words. The curriculum explicitly expects these skills. The IX coverage table itself shows examples left as text-only and practical links rather than equivalent interactive inquiry.
6. **A short quiz score is not a CBSE-aligned mastery signal.** The app’s per-topic “Test yourself” bank is a small formative interaction; the existing student report mainly tracks which models were opened and quiz results. There is no demonstrated full-paper blueprint, evidence for the 50/30/20 competency balance, adequate question-type sampling, or rubric for practical/inquiry skills. “Explored” must not be confused with “learned.”
7. **Class IX teacher reporting is incomplete by the project’s own report.** `docs/CLASS9_COVERAGE.md` states teacher-dashboard per-chapter columns remain Class X-only. A teacher cannot reliably identify IX outcome-level gaps from the reported dashboard.
8. **Visual sequencing was not comprehensively validated.** `docs/3D_AUDIT.md` describes the large majority of scenes as primitive/schematic and says that after guided wrappers were added, the visual result was not checked for every individual step (only spot checks). Schematic 3D is often exactly right for graphs, rays, circuits, and particles; the problem is unverified clarity/correctness, not lack of photorealism. The audit should be regenerated so its initial “free-play” counts are not mistaken for current state.

### P1 — Offline and classroom reliability claims need proof

9. **Offline readiness is not substantiated by this checkout.** The home UI advertises “Offline ready.” The app contains conditional service-worker registration, and `vercel.json` sets headers for `/sw.js` and a manifest, but neither `sw.js` nor a manifest is tracked at the repository root or under `public/`. The registration condition also requires a manifest link. This is not a reliable installable/offline app-shell implementation as checked in. `docs/ARCHITECTURE.md` already lists an app-shell service worker as not yet done.
10. **Real target-device performance is unknown.** `docs/TESTING.md` explicitly excludes real GPUs/phones and other browsers; software WebGL cannot establish frame rate, thermals, memory stability, or readable labels on the school’s lowest-end device/projector. The app uses a large single HTML bundle and substantial WebGL scenes, so these need actual measurements rather than assumptions.
11. **Deploy guidance is inconsistent.** Current `vercel.json` uses `outputDirectory: "."`, and `DEPLOY.md` says to deploy the repository root, while older audit/deployment notes describe `public/` as the Vercel output. Reconcile the docs against the actual configuration and test the exact production build path.

### P2 — Maintainability and accessibility constrain iteration

12. **Content, UI, rendering, and curriculum data are hard to change safely.** The core is a roughly 2 MB bundled, minified `index.html` with no reproducible source/build pipeline. That raises the cost of review and makes small content corrections difficult to isolate.
13. **Test execution is not reproducible from the declared package setup.** `tests/regression.js` requires Playwright, but `package.json` contains only deploy/preview scripts and does not declare Playwright or a test command. Historical pass reports are useful evidence of prior smoke testing, but another contributor cannot reproduce them from a documented clean install.
14. **Accessibility and inclusion are unmeasured.** The app has useful controls (Hindi/English, text-size/theme options, keyboard shortcuts), but the audit set contains no screen-reader/keyboard-only evaluation, reduced-motion review, color/contrast assessment, or disability-inclusive learner testing. A 3D canvas must not be the only route to an explanation or an answer.
15. **The repository’s own evidence is stale or contradictory in places.** For example, coverage and 3D-audit documents include older source/status/count claims, and deployment notes disagree. This weakens trust in otherwise useful audits and makes progress hard to verify.

## Prioritized improvement plan

Work should proceed through evidence gates. Calendar estimates are deliberately omitted until teacher availability, target devices, and staffing are known.

### Phase 0 — Establish a trusted curriculum and release baseline (P0)

**Deliverables**
- Create one versioned curriculum registry for each course with fields: official grade/unit/chapter; concept and learning-outcome IDs; theory marks and teaching periods where CBSE specifies them; status (`summative`, `formative-only`, `optional/enrichment`); official source/page; app lesson/practical/question links; language; scientific reviewer; review date; and known limitations.
- Explicitly tag every Class X formative-only area and explain on each relevant page that it is **not assessed in the year-end examination**. Keep it available for joyful learning/portfolio use, but exclude it from summative mock-paper counts and report it separately.
- Have a qualified IX and X Science teacher review the syllabus mapping, scientific statements, equations/units, diagrams, quiz answers/explanations, Hindi scientific terminology, age-appropriateness, and practical safety. Use a per-item checklist and record corrections; do not use “teacher validated” as a blanket status before all in-scope items pass.
- Correct stale audit/deployment documents and publish the review method, exclusions, and source revisions. Label scene counts as inventory—not coverage mastery.

**Exit criteria**
- 100% of official chapter-wise concepts/outcomes have a registry row and an explicit disposition (taught, supported textually, or acknowledged gap).
- 100% of Class X formative-only syllabus content is visibly tagged and absent from summative mock blueprints.
- All in-scope high-risk science claims and assessment keys have named teacher review; zero unresolved critical safety/accuracy items at release.
- All source links resolve, and the coverage report can be regenerated from the registry without hand-maintained contradictory totals.

### Phase 1 — Make lessons teach and assess the official outcomes (P1)

**Deliverables**
- Redesign the lesson template around the learning cycle: **retrieve → predict → manipulate one variable → observe/measure → represent data → explain/infer → transfer**. Where an actual experiment requires physical equipment, the app must model or prepare for it—not imply a simulation replaces laboratory work.
- Map each Class IX and X practical to its official procedure, equipment/materials, safety, observation table, expected trend (not fabricated readings), graph/calculation, inference, and a teacher-checkable rubric. Clearly identify simulations and distinguish simulated from learner-collected data.
- Build full practice-paper/quiz blueprints against the CBSE 50/30/20 competency split, question forms (including case/source and assertion–reason where appropriate), internal choice guidance, and grade-specific examinable scope. Use the official split for complete paper sets, not as a claim that every short quiz must have exact percentages.
- Extend teacher reports to IX/X, showing outcome-level evidence: attempts, misconception/error category, confidence/prediction, practical completion/evidence, and follow-up—not merely visits or best quiz score.
- Prioritize by official marks **and** period/outcome demands. For X, begin with the 25-mark chemistry and 25-mark living-world units, then 13-mark current and 12-mark phenomena, while preserving the 5-mark environment unit. For IX, cover the 27/25/23-mark groups proportionately and do not neglect Earth as a system: it is only 5 marks but has 12 periods and broad systems/inquiry outcomes.

**Exit criteria**
- Every priority outcome has at least one teachable explanation, one learner action, one feedback opportunity, and one evidence item mapped to it; true gaps are labelled rather than hidden.
- A reviewed sample of complete practice papers meets the official competency blueprint and scope rules; every answer key/explanation is teacher-approved.
- IX teacher dashboard displays chapter/outcome data and separates activity completion from demonstrated mastery.
- Practical-mode copy states prominently that virtual activities support and do not replace required hands-on work.

### Phase 2 — Prove it works in real classrooms and offline conditions (P1)

**Deliverables**
- Select actual lowest-end Android/mobile and classroom projector/laptop targets with partner teachers. Measure startup, scene load, interaction, frame rate, memory, battery/thermal behavior, text readability, and recovery on each; test WebGL unavailable/failed paths.
- Implement and version a real app-shell service worker and manifest (or remove the offline/install claims). Test first visit, second visit, airplane-mode launch, cache update, rollback, and storage exhaustion on supported browsers.
- Conduct teacher-led usability sessions and a small, consented student pilot. Observe task completion, misconceptions, confusion points, time-on-task, and accessibility barriers; use pre/post concept questions only as initial evidence, not a causal impact claim.
- Review keyboard-only navigation, focus order, labels, contrast, zoom/reflow, reduced motion, captions/alt-equivalent explanations, and a non-WebGL text/diagram fallback.

**Exit criteria**
- All supported target devices complete a defined lesson with no blocking failure; performance budgets are set from the chosen hardware and documented with measurements.
- Offline and update behavior pass a scripted test on each supported browser; the visible offline claim matches the tested behavior.
- No critical keyboard, contrast, screen-reader-label, reduced-motion, safety, or learner-confusion blocker remains; documented non-critical limitations have owners.

### Phase 3 — Make quality sustainable and expand selectively (P2)

**Deliverables**
- Extract the app into readable, source-controlled modules with a reproducible build and asset pipeline; retain a static deploy if that is still the right operational choice. Keep generated bundles out of the authoring path.
- Add schema/content validation, link and curriculum-registry checks, question-bank checks, unit tests for calculations, and browser smoke tests as a required CI gate. Pin and declare browser-test dependencies.
- Re-audit visual step progression and learning value. Add custom/realistic assets only when they resolve an identified misconception or improve a required outcome; keep schematic models for abstract systems and display scale/idealisation caveats.
- Publish release notes, tested browser/device matrix, source/curriculum version, teacher-review completion, accessibility status, and known limitations for each release.

**Exit criteria**
- A new contributor can build and run all required tests from documented commands on a clean checkout.
- No content release can silently change marks, exam scope, answer keys, or source mappings without a review diff.
- Every visual enhancement has an outcome-based rationale, source/licence record, device budget, and successful regression/teacher review.

## Ongoing scorecard (measure, don’t market)

Report these per grade and release: proportion of official outcomes mapped and teacher-reviewed; unresolved scientific/safety items; practicals with validated safety/rubric/data interpretation; learner attempts and evidence of transfer (not just scene opens); question-bank/paper blueprint compliance; completion and misconception rates in pilot tasks; real-device performance; offline-test pass rate; and accessibility blockers. Publish limitations beside the metrics. Do not use model count, scene count, or “coverage percentage” alone as a proxy for educational quality.

## Official sources

- [CBSE Science (086), Class IX, 2026–27 syllabus PDF](https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/ScienceSt_SecP1_2026-27.pdf)
- [CBSE Science (086), Class X, 2026–27 syllabus PDF](https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Science_SecP1_2026-27.pdf)
- [NCERT Grade 9 Phase I syllabus PDF](https://ncert.nic.in/pdf/announcement/Syllabus_Secondary_Stage_Phase_I_Grade_9_Part_2.pdf) — draft supplementary context only; not the authority for the CBSE Science 086 scope above.

## Bottom line

The current weakness is not demonstrably “too few 3D scenes.” The strongest evidence-backed risks are **unverified science, incomplete proof of learning against CBSE outcomes, unclear evidence behind coverage/offline claims, and no real-device or classroom validation**. Fix those before spending heavily on realism or expanding the feature set. This plan does not claim the critics’ 4/10 is correct, nor that the listed issues caused it; it turns the known risks into a prioritized, testable route to a more trustworthy educational product.
