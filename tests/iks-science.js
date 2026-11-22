const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SCHEMA = require('../modules/iks-science/schemas/evidence-schema');
const EVIDENCE = require('../modules/iks-science/historical-sources/evidence-engine');
const CURRICULUM = require('../modules/iks-science/curriculum/cbse-mapping');
const DOMAINS = require('../modules/iks-science/content/domains-data');
const EXPERIMENTS = require('../modules/iks-science/experiments/experiment-engine');
const VIZ = require('../modules/iks-science/visualizations/viz-engine');
const ASSESSMENT = require('../modules/iks-science/assessments/assessment-engine');
const PROGRESS = require('../modules/iks-science/analytics/progress-service');
const ADMIN = require('../modules/iks-science/services/admin-service');

// 1. Evidence & Schema Validation
const claimCheck = EVIDENCE.validateAllClaims();
assert.equal(claimCheck.valid, true, 'Evidence validation failed: ' + JSON.stringify(claimCheck.issues));
assert.ok(claimCheck.total >= 24, 'Expected at least 24 evidence claims');

// Guardrail checks on evidence claims
const paramanu = EVIDENCE.getClaimById('IKS-A-01');
assert.equal(paramanu.evidenceClass, 'P1');
assert.ok(paramanu.scientificSufficiencyNote.includes(SCHEMA.INSUFFICIENCY_NOTICE));

const tridosha = EVIDENCE.getClaimById('IKS-C-03');
assert.equal(tridosha.evidenceClass, 'P1');
assert.ok(tridosha.scientificSufficiencyNote.includes(SCHEMA.INSUFFICIENCY_NOTICE));

const astrology = EVIDENCE.getClaimById('IKS-G-03');
assert.equal(astrology.evidenceClass, 'U1');
assert.ok(astrology.scientificSufficiencyNote.includes(SCHEMA.INSUFFICIENCY_NOTICE));

// Verify no fabricated DOI strings exist anywhere in evidence claims
const rawEvidence = JSON.stringify(EVIDENCE.CLAIMS);
assert.equal(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i.test(rawEvidence), false, 'Unexpected DOI string found');

// 2. Domains A-H Completeness & Bilingual Guardrails
const domains = DOMAINS.getAllDomains();
assert.deepEqual(domains.map((d) => d.id), ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
domains.forEach((d) => {
  assert.ok(d.title && d.titleHi, `Domain ${d.id} missing bilingual title`);
  assert.ok(d.historicalOverview && d.historicalOverviewHi, `Domain ${d.id} missing bilingual overview`);
  assert.ok(d.modernComparison && d.modernComparisonHi, `Domain ${d.id} missing bilingual comparison`);
  assert.ok(d.guardrail && d.guardrailHi, `Domain ${d.id} missing guardrail`);
});
const domH = DOMAINS.getDomainById('H');
assert.ok(domH.regionalContext.region.includes('Jharkhand') && domH.regionalContext.region.includes('Santhal Pargana'));
assert.ok(DOMAINS.getGlossary().length >= 8);

// 3. CBSE 2026-27 Curriculum Mapping & Separation
const mapCheck = CURRICULUM.validateAllMappings();
assert.equal(mapCheck.valid, true, 'Curriculum mapping invalid: ' + JSON.stringify(mapCheck.issues));
const ixMaps = CURRICULUM.getByClass('IX');
const xMaps = CURRICULUM.getByClass('X');
assert.equal(ixMaps.length, 8);
assert.equal(xMaps.length, 8);
ixMaps.forEach((m) => assert.equal(m.classLevel, 'IX'));
xMaps.forEach((m) => assert.equal(m.classLevel, 'X'));

// Verify linked Vigyan Atlas chapter IDs exist in index.html
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
CURRICULUM.getAllMappings().forEach((m) => {
  assert.ok(indexHtml.includes(m.chapterId), `Chapter ID ${m.chapterId} not found in index.html`);
});

// 4. Experiment Engine: 23-field compliance + Scientific correctness + Safety
const expCheck = EXPERIMENTS.validateAllExperiments();
assert.equal(expCheck.valid, true, 'Experiment validation failed: ' + JSON.stringify(expCheck.issues));
assert.equal(EXPERIMENTS.getAllExperiments().length, 8);

// EXP-A: Carbon-12 & Nitrogen-14
const expA = EXPERIMENTS.getExperimentById('EXP-A');
const resA1 = expA.run({ protons: 6, neutrons: 6, electrons: 6 });
assert.equal(resA1.symbol, 'C');
assert.equal(resA1.massNumber, 12);
assert.equal(resA1.charge, 0);
const resA2 = expA.run({ protons: 7, neutrons: 7, electrons: 7 });
assert.equal(resA2.symbol, 'N');

// EXP-B: Baudhayana 3-4-5 & Aryabhata pi
const expB = EXPERIMENTS.getExperimentById('EXP-B');
const resB = expB.run({ sideA: 3, sideB: 4 });
assert.equal(resB.diagonalC, 5);
assert.equal(resB.areaSum, 25);
assert.ok(Math.abs(resB.aryabhataPi - 3.1416) < 1e-9);

// EXP-D: Alveolar ventilation
const expD = EXPERIMENTS.getExperimentById('EXP-D');
const resD = expD.run({ freq: 10, vt: 550, exertion: 60 });
assert.equal(resD.veLMin, 5.5);
assert.equal(resD.vaLMin, 4);
assert.ok(resD.simulatedHr3Min > 72 && resD.simulatedHr3Min < 120);

// EXP-E: Corrosion passive barrier vs saline breakdown
const expE = EXPERIMENTS.getExperimentById('EXP-E');
const delhiIron = expE.run({ phosphorus: 0.26, humidity: 45, salinity: 0, days: 180 });
const marineIron = expE.run({ phosphorus: 0.26, humidity: 85, salinity: 3.0, days: 180 });
assert.ok(marineIron.oxideUm > delhiIron.oxideUm * 5, 'High salinity/humidity should strongly accelerate corrosion');

// EXP-F: Aqueous salt-water boiling point elevation & safety
const expF = EXPERIMENTS.getExperimentById('EXP-F');
const resF = expF.run({ heaterTemp: 104, coolantTemp: 15, saltPct: 5 });
assert.ok(resF.boilingPointC > 100 && resF.boilingPointC < 103);
assert.equal(resF.distillatePpm, 0);
assert.ok(resF.yieldMlPerMin > 0);

// EXP-G: Ranchi solstice noon shadow near zero
const expG = EXPERIMENTS.getExperimentById('EXP-G');
const resG = expG.run({ lat: 23.3, decl: 23.4, hour: 12 });
assert.ok(resG.altitudeDeg > 89, 'Ranchi June solstice solar noon altitude should be > 89°');
assert.ok(resG.shadowLengthM < 0.02, 'Gnomon shadow should be near 0 at zenith');

// EXP-H: Watershed water-balance consistency
const expH = EXPERIMENTS.getExperimentById('EXP-H');
const bare = expH.run({ rainfall: 1200, slope: 6, cover: 20, dobha: 0 });
const conserved = expH.run({ rainfall: 1200, slope: 6, cover: 65, dobha: 200 });
assert.ok(conserved.runoffMm < bare.runoffMm, 'Dobha + Sarna cover must lower surface runoff');
assert.ok(conserved.infiltrationAndStoredMm > bare.infiltrationAndStoredMm);

// 5. Visualization Engine
const svg = VIZ.renderSeriesSvg(expF.generateSeries({ heaterTemp: 104, coolantTemp: 15, saltPct: 5 }), expF.graphConfig);
assert.ok(svg.includes('<svg') && svg.includes('<path'));
assert.ok(VIZ.SCHEMATIC_DISCLAIMER.includes('Conceptual / Simulated'));
const vs = VIZ.createViewState('H');
assert.equal(vs.domainId, 'H');
assert.ok(VIZ.stepLabel('H', 0).includes('Step 1'));

// 6. Assessment Engine
const qCheck = ASSESSMENT.validateAllQuestions();
assert.equal(qCheck.valid, true, 'Assessment validation failed: ' + JSON.stringify(qCheck.issues));
const sampleAns = {};
ASSESSMENT.getAllQuestions().forEach((q) => { sampleAns[q.id] = q.correctIndex; });
const score = ASSESSMENT.scoreSubmission(sampleAns);
assert.equal(score.pct, 100);
assert.equal(score.correct, 8);

// 7. Privacy, XSS Escaping & Admin Gates
assert.equal(SCHEMA.escapeHtml('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
const memStore = PROGRESS.createMemoryStore();
PROGRESS.saveState({ exploredDomains: ['A'], heartRateBpmPersonal: 99, bloodPressure: '120/80' }, memStore);
const loaded = PROGRESS.loadState(memStore);
assert.equal(loaded.heartRateBpmPersonal, undefined, 'Personal health metric must be stripped');
assert.equal(loaded.bloodPressure, undefined, 'Personal bloodPressure must be stripped');

const aiDraftGate = ADMIN.evaluatePublishGate(Object.assign({}, paramanu, { generatedByAI: true, reviewerStatus: 'Draft' }));
assert.equal(aiDraftGate.approved, false, 'Unverified AI draft must be blocked from publishing');
const verifiedGate = ADMIN.evaluatePublishGate(paramanu);
assert.equal(verifiedGate.approved, true);
assert.equal(ADMIN.isEnabled('?iks=0'), false, 'Feature flag kill-switch must disable module');
assert.equal(ADMIN.isEnabled(''), true);

// 8. Index.html asset wiring check
const wiredFiles = [
  'assets/va-iks.css',
  'assets/va-iks.js',
  'modules/iks-science/schemas/evidence-schema.js',
  'modules/iks-science/historical-sources/evidence-engine.js',
  'modules/iks-science/curriculum/cbse-mapping.js',
  'modules/iks-science/content/domains-data.js',
  'modules/iks-science/experiments/experiment-engine.js',
  'modules/iks-science/visualizations/viz-engine.js',
  'modules/iks-science/assessments/assessment-engine.js',
  'modules/iks-science/analytics/progress-service.js',
  'modules/iks-science/services/admin-service.js'
];
wiredFiles.forEach((rel) => {
  assert.ok(indexHtml.includes(rel), `Missing script/link tag in index.html: ${rel}`);
  assert.ok(fs.existsSync(path.join(ROOT, rel)), `Missing file on disk: ${rel}`);
});

console.log(`IKS × Modern Science OK · ${claimCheck.total} verified claims · ${expCheck.total} 23-field labs · ${ixMaps.length + xMaps.length} Class IX/X mappings`);
