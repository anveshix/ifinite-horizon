(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../schemas/evidence-schema'));
  } else {
    root.VA_IKS_EXPERIMENTS = factory(root.VA_IKS_SCHEMA);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (SCHEMA) {
  'use strict';

  var ELEMENTS = [
    null,
    ['H', 'Hydrogen'], ['He', 'Helium'], ['Li', 'Lithium'], ['Be', 'Beryllium'],
    ['B', 'Boron'], ['C', 'Carbon'], ['N', 'Nitrogen'], ['O', 'Oxygen'],
    ['F', 'Fluorine'], ['Ne', 'Neon'], ['Na', 'Sodium'], ['Mg', 'Magnesium'],
    ['Al', 'Aluminium'], ['Si', 'Silicon'], ['P', 'Phosphorus'], ['S', 'Sulfur'],
    ['Cl', 'Chlorine'], ['Ar', 'Argon']
  ];

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, Number(v)));
  }

  function bohrShells(e) {
    var rem = Math.max(0, Math.round(e));
    var caps = [2, 8, 8, 2];
    var out = [];
    for (var i = 0; i < caps.length && rem > 0; i++) {
      var put = Math.min(rem, caps[i]);
      out.push(put);
      rem -= put;
    }
    return out.length ? out : [0];
  }

  var EXPERIMENTS = [
    {
      experimentId: 'EXP-A',
      domainId: 'A',
      activityType: 'B',
      title: 'Subatomic Structure Builder vs Paramanu Conceptual Contrast',
      titleHi: 'उप-परमाण्विक संरचना मॉडल बनाम वैशेषिक परमाणु तुलना',
      classAndSubject: 'Class IX (ix6, ix7) & Class X (ch3, ch4) — Science (086)',
      learningObjective: 'Construct neutral atoms, ions, and isotopes using protons, neutrons, and electrons, and contrast measurable atomic properties with Vaiśeṣika Paramanu philosophy.',
      historicalConnection: 'Acharya Kaṇāda’s Vaiśeṣika Sūtra postulated indivisible Paramanus combining into Dvyaṇuka and Tryaṇuka without subatomic charge or quantitative mass.',
      scientificConcept: 'Atomic number Z defines the element; mass number A = Z + N; net charge = Z − e⁻; chemical reactivity depends on outer-shell valence electrons.',
      researchQuestion: 'How do changes in proton, neutron, and electron counts alter elemental identity, mass number, and charge—unlike indivisible philosophical Paramanu?',
      hypothesis: 'Changing proton count Z changes the element itself, changing N creates isotopes, and changing e⁻ creates ions.',
      independentVariable: 'Proton count (Z: 1–18), Neutron count (N: 0–22), Electron count (e⁻: 1–18)',
      dependentVariable: 'Element identity, Mass number (A), Net ionic charge, Bohr shell configuration',
      controlledVariables: 'Isolated single-atom ground-state shell capacities [2, 8, 8, 2]',
      materials: ['Interactive mathematical atomic shell model', 'Periodic table (Z = 1–18) reference'],
      safetyRequirements: 'Digital mathematical model; zero physical hazards.',
      teacherSupervision: 'Teacher facilitates philosophical vs empirical demarcation discussion (15 min).',
      procedure: [
        '1. Set Protons (Z = 6), Neutrons (N = 6), Electrons (e⁻ = 6) to model Carbon-12.',
        '2. Increase Neutrons to 8 (C-14) and observe that element identity stays Carbon while Mass Number A rises.',
        '3. Change Protons to 7 and observe elemental transmutation to Nitrogen.',
        '4. Compare measurable Z, A, and charge against the non-quantitative Paramanu table.'
      ],
      observationTableColumns: ['Z (p⁺)', 'N (n⁰)', 'e⁻', 'Element', 'Mass A', 'Charge', 'Shells'],
      dataCollectionSchema: { xKey: 'Z', yKey: 'massNumber', unitX: 'protons', unitY: 'u' },
      graphConfig: { title: 'Mass Number (A) & Valence vs Proton Number (Z)', xLabel: 'Atomic Number (Z)', yLabel: 'Mass Number (A) / Valence' },
      scientificInterpretation: 'Unlike classical philosophical Paramanu (defined as structureless and indivisible), real atoms possess internal subatomic structure governed by electrostatic and nuclear forces.',
      conclusion: 'Atomic identity is uniquely determined by Z, isotopes by N, and chemical valency by outer-shell electrons.',
      sourcesOfError: 'Bohr concentric circles are simplified 2D energy-level schematics, not literal classical orbits.',
      limitations: 'Limited to Z = 1–18 light elements; quantum orbital shapes (s, p, d) require Class XI–XII mechanics.',
      reflectionQuestions: [
        'Why is it scientifically inaccurate to equate Kaṇāda’s Paramanu with a Bohr or quantum atom?',
        'Which single subatomic change converts Na (Z=11) into a +1 cation vs into Mg (Z=12)?'
      ],
      assessmentRubric: {
        criteria: ['Correctly distinguishes Z, A, and charge', 'Explains philosophical vs empirical evidence (P1 vs S1)'],
        maxScore: 10
      },
      controls: [
        { key: 'protons', label: 'Protons (Z)', labelHi: 'प्रोटॉन (Z)', min: 1, max: 18, step: 1, defaultValue: 6, unit: '' },
        { key: 'neutrons', label: 'Neutrons (N)', labelHi: 'न्यूट्रॉन (N)', min: 0, max: 22, step: 1, defaultValue: 6, unit: '' },
        { key: 'electrons', label: 'Electrons (e⁻)', labelHi: 'इलेक्ट्रॉन (e⁻)', min: 1, max: 18, step: 1, defaultValue: 6, unit: '' }
      ],
      run: function (params) {
        var z = Math.round(clamp(params.protons !== undefined ? params.protons : 6, 1, 18));
        var n = Math.round(clamp(params.neutrons !== undefined ? params.neutrons : 6, 0, 22));
        var e = Math.round(clamp(params.electrons !== undefined ? params.electrons : 6, 1, 18));
        var el = ELEMENTS[z] || ['X', 'Element ' + z];
        var A = z + n;
        var charge = z - e;
        var shells = bohrShells(e);
        var valence = shells[shells.length - 1];
        return {
          protons: z,
          neutrons: n,
          electrons: e,
          symbol: el[0],
          elementName: el[1],
          massNumber: A,
          charge: charge,
          chargeText: charge === 0 ? '0 (Neutral)' : (charge > 0 ? '+' + charge : String(charge)),
          shells: shells,
          shellsText: shells.join(', '),
          valenceElectrons: valence,
          summary: el[1] + '-' + A + ' (' + el[0] + '), Charge ' + (charge >= 0 && charge !== 0 ? '+' + charge : charge) + ', Shells [' + shells.join(', ') + ']'
        };
      },
      generateSeries: function (params) {
        var z0 = Math.round(clamp(params.protons !== undefined ? params.protons : 6, 1, 18));
        var n0 = Math.round(clamp(params.neutrons !== undefined ? params.neutrons : 6, 0, 22));
        var pts = [];
        for (var z = 1; z <= 18; z++) {
          var sh = bohrShells(z);
          pts.push({ x: z, y: z + n0, y2: sh[sh.length - 1], active: z === z0 });
        }
        return pts;
      }
    },

    {
      experimentId: 'EXP-B',
      domainId: 'B',
      activityType: 'B',
      title: 'Baudhāyana Śulbasūtra Diagonal & Place-Value Precision Model',
      titleHi: 'बौधायन शुल्बसूत्र विकर्ण और स्थान-मान गणितीय मॉडल',
      classAndSubject: 'Class IX & X — Mathematics / Science Quantitative Link',
      learningObjective: 'Verify the geometric area relation c² = a² + b² from Baudhāyana Śulbasūtra and evaluate Āryabhaṭa’s rational approximation of π.',
      historicalConnection: 'Baudhāyana described diagonal square areas (c² = a² + b²), Āryabhaṭa gave π ≈ 62832/20000 = 3.1416 (499 CE), and Brahmagupta formalized 0 and negative operations (628 CE).',
      scientificConcept: 'Euclidean right-triangle hypotenuse length, Pythagorean triples, and rational vs irrational number precision.',
      researchQuestion: 'How accurately do integer triples and rational approximations reproduce exact Euclidean diagonals and circle circumferences?',
      hypothesis: 'Diagonal square area c² always equals the sum a² + b² on a flat plane, while finite rational fractions approximate irrational lengths.',
      independentVariable: 'Base length a (1–20 units), Height b (1–20 units)',
      dependentVariable: 'Diagonal length c = √(a² + b²), Area sum a² + b², Integer triple check',
      controlledVariables: 'Flat 2D Euclidean coordinate plane',
      materials: ['Interactive geometric grid', 'Cord-measurement ratio model'],
      safetyRequirements: 'Mathematical visualization; zero physical hazards.',
      teacherSupervision: 'Teacher guides comparison between empirical construction and deductive proof.',
      procedure: [
        '1. Set a = 3, b = 4 and check whether c is an exact integer (Baudhāyana triple 3–4–5).',
        '2. Set a = 1, b = 1 to examine √2 ≈ 1.414213... and compare with classical rational approximation 577/408.',
        '3. Observe how c² exactly equals the sum of areas a² and b².'
      ],
      observationTableColumns: ['a', 'b', 'a² + b²', 'c = √(a²+b²)', 'Integer Triple?'],
      dataCollectionSchema: { xKey: 'b', yKey: 'c', unitX: 'units', unitY: 'units' },
      graphConfig: { title: 'Diagonal c vs Height b (for fixed Base a)', xLabel: 'Side b (units)', yLabel: 'Diagonal c (units)' },
      scientificInterpretation: 'Euclidean geometry validates a² + b² = c² universally on flat surfaces; Brahmagupta’s zero/negative rules remain foundational except division by zero.',
      conclusion: 'Area addition holds exactly in flat geometry, while square-root diagonals like √2 are irrational except for special triples.',
      sourcesOfError: 'Decimal display rounded to 4 decimal places.',
      limitations: 'Euclidean metric does not hold on curved planetary/relativistic surfaces.',
      reflectionQuestions: [
        'Why did Āryabhaṭa label 3.1416 as āsanna (approximate) rather than exact?',
        'Why does modern mathematics define 5 ÷ 0 and 0 ÷ 0 as undefined?'
      ],
      assessmentRubric: {
        criteria: ['Computes c² = a² + b² accurately', 'Explains rational approximation vs exact irrational value'],
        maxScore: 10
      },
      controls: [
        { key: 'sideA', label: 'Base a (units)', labelHi: 'आधार a', min: 1, max: 20, step: 1, defaultValue: 3, unit: 'u' },
        { key: 'sideB', label: 'Height b (units)', labelHi: 'ऊँचाई b', min: 1, max: 20, step: 1, defaultValue: 4, unit: 'u' }
      ],
      run: function (params) {
        var a = Math.round(clamp(params.sideA !== undefined ? params.sideA : 3, 1, 20));
        var b = Math.round(clamp(params.sideB !== undefined ? params.sideB : 4, 1, 20));
        var areaSum = a * a + b * b;
        var c = Math.sqrt(areaSum);
        var isTriple = Math.abs(c - Math.round(c)) < 1e-9;
        var aryabhataPi = 62832 / 20000;
        var piError = Math.abs(aryabhataPi - Math.PI);
        return {
          sideA: a,
          sideB: b,
          areaA2: a * a,
          areaB2: b * b,
          areaSum: areaSum,
          diagonalC: Number(c.toFixed(4)),
          isTriple: isTriple ? 'Yes (' + a + ',' + b + ',' + Math.round(c) + ')' : 'No (Irrational)',
          aryabhataPi: aryabhataPi,
          piError: Number(piError.toFixed(6)),
          summary: 'a²+b² = ' + areaSum + ', c = ' + c.toFixed(4) + ' (' + (isTriple ? 'Exact integer triple' : 'Irrational diagonal') + ')'
        };
      },
      generateSeries: function (params) {
        var a = Math.round(clamp(params.sideA !== undefined ? params.sideA : 3, 1, 20));
        var b0 = Math.round(clamp(params.sideB !== undefined ? params.sideB : 4, 1, 20));
        var pts = [];
        for (var b = 1; b <= 20; b++) {
          pts.push({ x: b, y: Number(Math.sqrt(a * a + b * b).toFixed(3)), active: b === b0 });
        }
        return pts;
      }
    },

    {
      experimentId: 'EXP-C',
      domainId: 'C',
      activityType: 'D',
      title: 'Phytochemical Bioassay vs Clinical Evidence Hierarchy Explorer',
      titleHi: 'पादप अर्क जैव-परीक्षण बनाम नैदानिक प्रमाण पदानुक्रम मॉडल',
      classAndSubject: 'Class IX (ix1, ix4) & Class X (ch5) — Science (086)',
      learningObjective: 'Distinguish historical botanical knowledge and laboratory in-vitro inhibition from validated human clinical trial efficacy.',
      historicalConnection: 'Suśruta and Charaka catalogued plants such as Azadirachta indica and Curcuma longa empirically before modern microbiology or clinical trials existed.',
      scientificConcept: 'Dose–response curves, bioavailability attenuation, and Evidence-Based Medicine (EBM) validation stages.',
      researchQuestion: 'Why does positive antimicrobial activity in a petri dish (in vitro) often fail to guarantee clinical effectiveness in humans?',
      hypothesis: 'Poor gastrointestinal absorption (low bioavailability) and lack of randomized control groups prevent direct extrapolation from petri dishes to patients.',
      independentVariable: 'Extract concentration (mg/L), Bioavailability (% absorbed), Evidence stage (1=In vitro, 2=Preclinical, 3=Human RCT)',
      dependentVariable: 'Effective systemic fraction, Clinical confidence tier',
      controlledVariables: 'Standardized reference compound assay simulation',
      materials: ['Virtual EBM evidence-pyramid model', 'Pharmacokinetic attenuation curve'],
      safetyRequirements: 'Virtual educational model ONLY. Never culture unknown microbes at home and never use for self-medication or diagnosis.',
      teacherSupervision: 'Teacher reinforces strict distinction between educational pharmacology and medical advice.',
      procedure: [
        '1. Set Extract Concentration = 100 mg/L and Bioavailability = 5% (typical of raw poorly absorbed polyphenols).',
        '2. Observe how systemic blood concentration is drastically lower than raw dish concentration.',
        '3. Switch Evidence Stage from In-Vitro (1) to Human RCT (3) and note the verification threshold.'
      ],
      observationTableColumns: ['Conc (mg/L)', 'Bioavail (%)', 'Systemic Eq (mg/L)', 'Stage', 'Clinical Status'],
      dataCollectionSchema: { xKey: 'concentration', yKey: 'systemicDose', unitX: 'mg/L', unitY: 'mg/L' },
      graphConfig: { title: 'Systemic Available Fraction vs Extract Concentration', xLabel: 'Initial Concentration (mg/L)', yLabel: 'Effective Systemic Dose (mg/L)' },
      scientificInterpretation: 'Historical botanical observations generate valuable research hypotheses, but only controlled dosing, toxicity testing, and RCTs verify human safety and efficacy.',
      conclusion: 'In-vitro activity alone is insufficient to establish clinical treatment claims.',
      sourcesOfError: 'Linear first-pass absorption is a simplified teaching approximation of hepatic metabolism.',
      limitations: 'Educational simulation only; represents no real drug prescription or clinical outcome.',
      reflectionQuestions: [
        'Why do scientists require a placebo/control group in human clinical trials?',
        'What is the difference between a historical textual record (H1/T1) and clinical validation (S1)?'
      ],
      assessmentRubric: {
        criteria: ['Correctly contrasts in-vitro vs human RCT evidence', 'Includes medical disclaimer reasoning'],
        maxScore: 10
      },
      controls: [
        { key: 'conc', label: 'Assay Concentration (mg/L)', labelHi: 'अर्क सांद्रता (mg/L)', min: 10, max: 200, step: 10, defaultValue: 100, unit: 'mg/L' },
        { key: 'bioavail', label: 'Oral Bioavailability (%)', labelHi: 'जैव-उपलब्धता (%)', min: 2, max: 80, step: 2, defaultValue: 10, unit: '%' },
        { key: 'stage', label: 'Evidence Stage (1=InVitro, 2=Preclin, 3=RCT)', labelHi: 'प्रमाण चरण (1-3)', min: 1, max: 3, step: 1, defaultValue: 1, unit: '' }
      ],
      run: function (params) {
        var conc = clamp(params.conc !== undefined ? params.conc : 100, 10, 200);
        var bio = clamp(params.bioavail !== undefined ? params.bioavail : 10, 2, 80);
        var stage = Math.round(clamp(params.stage !== undefined ? params.stage : 1, 1, 3));
        var systemic = Number((conc * (bio / 100)).toFixed(2));
        var stageNames = { 1: 'In-vitro Petri Assay (S2)', 2: 'Preclinical Safety (S2)', 3: 'Controlled Human RCT (EBM)' };
        var status = stage < 3
          ? 'Evidence insufficient for clinical treatment claim'
          : (systemic >= 15 ? 'Requires peer-reviewed RCT dosing verification' : 'Sub-therapeutic systemic level');
        return {
          concentration: conc,
          bioavailability: bio,
          systemicDose: systemic,
          stage: stageNames[stage],
          clinicalStatus: status,
          summary: 'Systemic = ' + systemic + ' mg/L (' + bio + '% absorbed) · ' + status
        };
      },
      generateSeries: function (params) {
        var bio = clamp(params.bioavail !== undefined ? params.bioavail : 10, 2, 80);
        var c0 = clamp(params.conc !== undefined ? params.conc : 100, 10, 200);
        var pts = [];
        for (var c = 20; c <= 200; c += 20) {
          pts.push({ x: c, y: Number((c * bio / 100).toFixed(2)), active: c === Math.round(c0 / 20) * 20 });
        }
        return pts;
      }
    },

    {
      experimentId: 'EXP-D',
      domainId: 'D',
      activityType: 'C',
      title: 'Respiratory Ventilation & Post-Exertion Heart-Rate Recovery Model',
      titleHi: 'श्वसन संवातन और व्यायाम के बाद हृदय गति पुनर्प्राप्ति मॉडल',
      classAndSubject: 'Class IX (ix2) & Class X (ch5, ch6) — Science (086)',
      learningObjective: 'Calculate minute and alveolar ventilation and model how breathing depth and pacing influence simulated autonomic heart-rate recovery.',
      historicalConnection: 'Separates Haṭha Yoga’s contemplative breath traditions from measurable respiratory mechanics and vagal parasympathetic physiology.',
      scientificConcept: 'V_E = V_T × f; V_A = (V_T − V_D) × f (dead space V_D ≈ 150 mL); exponential autonomic heart-rate recovery.',
      researchQuestion: 'Why does deeper, slower breathing yield higher alveolar gas-exchange efficiency per litre than shallow rapid breathing?',
      hypothesis: 'Because anatomical dead space (~150 mL) stays constant per breath, deeper tidal volume reduces the wasted dead-space fraction.',
      independentVariable: 'Breathing rate f (6–20 breaths/min), Tidal volume V_T (350–750 mL), Exertion level (20–100%)',
      dependentVariable: 'Minute ventilation V_E, Alveolar ventilation V_A, Simulated recovery HR at 3 min',
      controlledVariables: 'Anatomical dead space V_D = 150 mL, Resting baseline HR = 72 bpm',
      materials: ['Parameterized mathematical physiology simulator (NO personal student data collected)'],
      safetyRequirements: 'Simulated mathematical model ONLY. Do not hold breath forcefully or perform strenuous breath-retention exercises.',
      teacherSupervision: 'Teacher emphasizes no medical claims and zero personal biometric data collection.',
      procedure: [
        '1. Compare shallow rapid breathing (f = 18/min, V_T = 350 mL) vs slow deep breathing (f = 8/min, V_T = 650 mL).',
        '2. Notice Minute Ventilation V_E can be similar while Alveolar Ventilation efficiency improves markedly at higher V_T.',
        '3. Inspect the simulated post-exertion recovery curve over 0–5 minutes.'
      ],
      observationTableColumns: ['f (/min)', 'V_T (mL)', 'V_E (L/min)', 'V_A (L/min)', 'Alveolar %', 'HR @3m (sim)'],
      dataCollectionSchema: { xKey: 'timeMin', yKey: 'hrSim', unitX: 'min', unitY: 'bpm (sim)' },
      graphConfig: { title: 'Simulated Heart-Rate Recovery Curve (0–5 min)', xLabel: 'Recovery Time (min)', yLabel: 'Simulated HR (bpm)' },
      scientificInterpretation: 'Deeper diaphragmatic excursion lowers dead-space fraction (V_D / V_T), and slow exhalation activates vagal stretch-receptor feedback.',
      conclusion: 'Respiratory mechanics and autonomic heart-rate recovery follow quantitative physiological laws.',
      sourcesOfError: 'Fixed dead space (150 mL) ignores individual body height variations.',
      limitations: 'Purely theoretical educational model; never substitute for clinical cardiorespiratory assessment.',
      reflectionQuestions: [
        'If f = 15/min and V_T = 400 mL with V_D = 150 mL, what percentage of air reaches the alveoli?',
        'Why should contemplative terms like prāṇa be kept distinct from oxygen partial pressure measurements?'
      ],
      assessmentRubric: {
        criteria: ['Computes V_A accurately', 'Clearly separates simulated physiology from philosophical claims'],
        maxScore: 10
      },
      controls: [
        { key: 'freq', label: 'Breathing Rate f (breaths/min)', labelHi: 'श्वसन दर (प्रति मिनट)', min: 6, max: 20, step: 1, defaultValue: 10, unit: '/min' },
        { key: 'vt', label: 'Tidal Volume V_T (mL)', labelHi: 'ज्वारीय आयतन (mL)', min: 350, max: 750, step: 25, defaultValue: 550, unit: 'mL' },
        { key: 'exertion', label: 'Prior Exertion Intensity (%)', labelHi: 'व्यायाम तीव्रता (%)', min: 20, max: 100, step: 10, defaultValue: 60, unit: '%' }
      ],
      run: function (params) {
        var f = clamp(params.freq !== undefined ? params.freq : 10, 6, 20);
        var vt = clamp(params.vt !== undefined ? params.vt : 550, 350, 750);
        var ex = clamp(params.exertion !== undefined ? params.exertion : 60, 20, 100);
        var vd = 150;
        var ve = Number(((vt * f) / 1000).toFixed(2));
        var va = Number((((vt - vd) * f) / 1000).toFixed(2));
        var effPct = Number((((vt - vd) / vt) * 100).toFixed(1));
        var peakHr = 72 + 0.8 * ex;
        var tau = f <= 10 ? 1.5 : 2.2;
        var hr3 = Number((72 + (peakHr - 72) * Math.exp(-3 / tau)).toFixed(1));
        return {
          freq: f,
          tidalVolume: vt,
          veLMin: ve,
          vaLMin: va,
          alveolarEfficiencyPct: effPct,
          simulatedHr3Min: hr3,
          summary: 'V_E = ' + ve + ' L/min, V_A = ' + va + ' L/min (' + effPct + '% effective), Sim HR@3m = ' + hr3 + ' bpm'
        };
      },
      generateSeries: function (params) {
        var f = clamp(params.freq !== undefined ? params.freq : 10, 6, 20);
        var ex = clamp(params.exertion !== undefined ? params.exertion : 60, 20, 100);
        var peakHr = 72 + 0.8 * ex;
        var tau = f <= 10 ? 1.5 : 2.2;
        var pts = [];
        for (var t = 0; t <= 5; t += 0.5) {
          pts.push({ x: t, y: Number((72 + (peakHr - 72) * Math.exp(-t / tau)).toFixed(1)) });
        }
        return pts;
      }
    },

    {
      experimentId: 'EXP-E',
      domainId: 'E',
      activityType: 'C',
      title: 'Electrochemical Iron Corrosion & Phosphorus Passive-Film Simulation',
      titleHi: 'लोहे का विद्युत-रासायनिक संक्षारण और फॉस्फोरस निष्क्रिय परत मॉडल',
      classAndSubject: 'Class IX (ix5) & Class X (ch1, ch3) — Science (086)',
      learningObjective: 'Analyze how humidity, chloride salinity, and phosphorus-assisted passive barrier formation affect iron oxidation kinetics.',
      historicalConnection: 'Investigates why the ~4th–5th century CE Mehrauli Iron Pillar (~0.25% P wrought iron) corroded far more slowly than ordinary carbon steel in Delhi’s inland atmosphere.',
      scientificConcept: 'Anodic iron oxidation (Fe → Fe²⁺ + 2e⁻), oxygen reduction, chloride pitting acceleration, and passive oxide-phosphate barrier formation.',
      researchQuestion: 'Under what humidity and salinity conditions does high-phosphorus wrought iron resist rusting, and when does passive protection break down?',
      hypothesis: 'High-P iron slows oxidation at moderate inland humidity via a protective phosphate film, but high chloride salinity still drives rapid corrosion.',
      independentVariable: 'Phosphorus level (0.02% mild steel vs 0.25% Delhi-type wrought iron), Relative Humidity (20–95%), Salinity Cl⁻ (0–3.5%)',
      dependentVariable: 'Modeled corrosion depth (µm), Protective passive factor',
      controlledVariables: 'Ambient temperature 25 °C, uncoated exposed surface area',
      materials: ['Simulated corrosion kinetics model (optional classroom iron-nail in water/oil/salt tube demo)'],
      safetyRequirements: 'Handle glassware carefully in optional physical nail demonstration; no strong mineral acids.',
      teacherSupervision: 'Teacher explains that "corrosion-resistant" is context-dependent, never magically rust-proof.',
      procedure: [
        '1. Set Humidity = 45%, Salinity = 0%, Phosphorus = 0.25% (Delhi climate analog) and observe low corrosion depth.',
        '2. Switch Phosphorus to 0.02% (ordinary steel) at 75% humidity and compare corrosion growth.',
        '3. Increase Salinity to 3.5% (marine spray) and verify that even 0.25% P corrodes significantly.'
      ],
      observationTableColumns: ['P (%)', 'RH (%)', 'Salinity (%)', 'Days', 'Modeled Oxide (µm)', 'Protection'],
      dataCollectionSchema: { xKey: 'days', yKey: 'oxideUm', unitX: 'days', unitY: 'µm (sim)' },
      graphConfig: { title: 'Simulated Oxide Thickness Growth Over Time', xLabel: 'Exposure Time (days)', yLabel: 'Modeled Corrosion (µm)' },
      scientificInterpretation: 'Passivation slows electrochemical ion transport only as long as the film remains intact and unbreached by aggressive chloride ions.',
      conclusion: 'The Delhi Iron Pillar’s preservation reflects combined materials chemistry (high-P passive film) and dry inland climate—not supernatural immunity.',
      sourcesOfError: 'Parabolic diffusion-limited passivation curve is a simplified kinetic model.',
      limitations: 'Real monumental corrosion spans centuries of seasonal cycles.',
      reflectionQuestions: [
        'Why do coastal iron structures rust much faster than monuments in semi-arid Delhi?',
        'What modern corrosion prevention methods in CBSE Class X ch3 work on similar barrier principles?'
      ],
      assessmentRubric: {
        criteria: ['Explains role of O₂, H₂O, Cl⁻, and passive layer', 'Avoids "magical rust-proof" misconception'],
        maxScore: 10
      },
      controls: [
        { key: 'phosphorus', label: 'Phosphorus Content (%)', labelHi: 'फॉस्फोरस मात्रा (%)', min: 0.02, max: 0.30, step: 0.04, defaultValue: 0.26, unit: '%' },
        { key: 'humidity', label: 'Relative Humidity (%)', labelHi: 'सापेक्ष आर्द्रता (%)', min: 20, max: 95, step: 5, defaultValue: 45, unit: '%' },
        { key: 'salinity', label: 'Chloride Salinity (%)', labelHi: 'लवणता Cl⁻ (%)', min: 0, max: 3.5, step: 0.5, defaultValue: 0, unit: '%' },
        { key: 'days', label: 'Exposure Duration (days)', labelHi: 'अवधि (दिन)', min: 30, max: 360, step: 30, defaultValue: 180, unit: 'd' }
      ],
      run: function (params) {
        var p = clamp(params.phosphorus !== undefined ? params.phosphorus : 0.26, 0.02, 0.30);
        var rh = clamp(params.humidity !== undefined ? params.humidity : 45, 20, 95);
        var sal = clamp(params.salinity !== undefined ? params.salinity : 0, 0, 3.5);
        var days = clamp(params.days !== undefined ? params.days : 180, 30, 360);
        var rhFactor = rh < 35 ? 0.15 : Math.pow((rh - 30) / 65, 1.4);
        var salFactor = 1 + 2.8 * sal;
        var passiveFactor = (p >= 0.2 && sal < 1.0) ? 0.22 : (1 - 1.4 * p);
        var oxideUm = Number((3.8 * rhFactor * salFactor * Math.max(0.18, passiveFactor) * Math.sqrt(days)).toFixed(1));
        var regime = oxideUm < 25 ? 'Passive phosphate barrier effective' : (oxideUm < 90 ? 'Moderate oxidation' : 'Severe pitting / breakdown');
        return {
          phosphorus: p,
          humidity: rh,
          salinity: sal,
          days: days,
          oxideUm: oxideUm,
          regime: regime,
          summary: 'Modeled corrosion = ' + oxideUm + ' µm in ' + days + ' d (' + regime + ')'
        };
      },
      generateSeries: function (params) {
        var p = clamp(params.phosphorus !== undefined ? params.phosphorus : 0.26, 0.02, 0.30);
        var rh = clamp(params.humidity !== undefined ? params.humidity : 45, 20, 95);
        var sal = clamp(params.salinity !== undefined ? params.salinity : 0, 0, 3.5);
        var rhFactor = rh < 35 ? 0.15 : Math.pow((rh - 30) / 65, 1.4);
        var salFactor = 1 + 2.8 * sal;
        var passiveFactor = (p >= 0.2 && sal < 1.0) ? 0.22 : (1 - 1.4 * p);
        var pts = [];
        for (var d = 30; d <= 360; d += 30) {
          pts.push({ x: d, y: Number((3.8 * rhFactor * salFactor * Math.max(0.18, passiveFactor) * Math.sqrt(d)).toFixed(1)) });
        }
        return pts;
      }
    },

    {
      experimentId: 'EXP-F',
      domainId: 'F',
      activityType: 'C',
      title: 'Safe Saline-Water Hydro-Distillation & Boiling-Point Plateau Model',
      titleHi: 'सुरक्षित लवणीय-जल आसवन और क्वथनांक पठार मॉडल',
      classAndSubject: 'Class IX (ix5, PRAC) & Class X (ch2) — Science (086)',
      learningObjective: 'Separate pure water from dissolved salt using vaporization and condensation, connecting Tiryakpātana Yantra / Deg–Bhapka geometry to modern Liebig condensers.',
      historicalConnection: 'Rasashastra Tiryakpātana Yantra and traditional Deg–Bhapka hydro-distillation use inclined vapor tubes and water-cooled receivers.',
      scientificConcept: 'Boiling-point elevation (ΔTb = i·Kb·m), latent heat plateau during boiling, and vapor condensation efficiency.',
      researchQuestion: 'How do salt concentration and condenser water temperature govern boiling temperature and pure distillate recovery rate?',
      hypothesis: 'Dissolved salt raises the boiling point slightly above 100 °C, while cooler condenser water increases distillate condensation efficiency.',
      independentVariable: 'Heater target temperature (40–108 °C), Condenser coolant temp (10–35 °C), Dissolved salt % (0–15%)',
      dependentVariable: 'Solution boiling point (°C), Distillate yield rate (mL/min), Distillate purity',
      controlledVariables: '1 atm atmospheric pressure, 250 mL initial saline solution, strictly non-hazardous NaCl + H₂O',
      materials: ['Virtual distillation apparatus (aqueous NaCl solution only — ZERO alcohol or toxic solvents)'],
      safetyRequirements: 'STRICTLY aqueous saline/floral-water models only. Never demonstrate alcohol fermentation/distillation, mercury, or flammable solvents.',
      teacherSupervision: 'In any real Class IX distillation demo, teacher supervises hot glassware and boiling chips.',
      procedure: [
        '1. Set Salt = 5%, Heater Temp = 103 °C, Coolant = 15 °C and run the distillation model.',
        '2. Observe the temperature plateau at the solution boiling point (~100.9 °C).',
        '3. Lower Heater Temp to 85 °C (below boiling) and verify negligible distillate flow.',
        '4. Raise Coolant Temp to 32 °C and observe reduced condensation recovery.'
      ],
      observationTableColumns: ['Salt (%)', 'Boil Pt (°C)', 'Heater (°C)', 'Coolant (°C)', 'Yield (mL/min)', 'Distillate TDS'],
      dataCollectionSchema: { xKey: 'timeMin', yKey: 'distillateMl', unitX: 'min', unitY: 'mL' },
      graphConfig: { title: 'Cumulative Distilled Pure Water Over Time', xLabel: 'Heating Time (min)', yLabel: 'Distillate Collected (mL)' },
      scientificInterpretation: 'Non-volatile dissolved Na⁺/Cl⁻ ions remain in the boiling flask while pure H₂O vapor condenses in the cooled tube.',
      conclusion: 'Both traditional hydro-distillation and modern Liebig condensers rely on phase-change physics and cooling gradients.',
      sourcesOfError: 'Assumes ideal vapor transport without steam leaks.',
      limitations: 'Simple distillation only separates non-volatile solutes or liquids with wide (>25 °C) boiling-point differences.',
      reflectionQuestions: [
        'Why does the distillate collected from salt water contain zero dissolved salt?',
        'Why does counter-current cold water improve a Liebig condenser compared to stagnant warm water?'
      ],
      assessmentRubric: {
        criteria: ['Identifies boiling-point elevation & phase plateau', 'Follows strict aqueous safety constraints'],
        maxScore: 10
      },
      controls: [
        { key: 'heaterTemp', label: 'Heater Temp (°C)', labelHi: 'तापमान (°C)', min: 40, max: 108, step: 2, defaultValue: 104, unit: '°C' },
        { key: 'coolantTemp', label: 'Condenser Coolant (°C)', labelHi: 'शीतलक तापमान (°C)', min: 10, max: 35, step: 1, defaultValue: 15, unit: '°C' },
        { key: 'saltPct', label: 'Dissolved Salt (% w/w)', labelHi: 'लवण सांद्रता (%)', min: 0, max: 15, step: 1, defaultValue: 5, unit: '%' }
      ],
      run: function (params) {
        var ht = clamp(params.heaterTemp !== undefined ? params.heaterTemp : 104, 40, 108);
        var ct = clamp(params.coolantTemp !== undefined ? params.coolantTemp : 15, 10, 35);
        var salt = clamp(params.saltPct !== undefined ? params.saltPct : 5, 0, 15);
        var molality = (salt * 10) / 58.44;
        var bp = Number((100 + 2 * 0.512 * molality).toFixed(2));
        var condEff = clamp((100 - ct) / 90, 0.55, 0.98);
        var yieldRate = ht >= bp ? Number(((0.8 + 0.35 * (ht - bp)) * condEff).toFixed(2)) : Number((0.02 * (ht / 100)).toFixed(2));
        return {
          heaterTemp: ht,
          coolantTemp: ct,
          saltPct: salt,
          boilingPointC: bp,
          condenserEffPct: Number((condEff * 100).toFixed(1)),
          yieldMlPerMin: yieldRate,
          distillatePpm: 0,
          summary: 'Boiling Pt = ' + bp + ' °C · Yield = ' + yieldRate + ' mL/min (0 ppm salt in distillate)'
        };
      },
      generateSeries: function (params) {
        var res = this.run(params);
        var pts = [];
        for (var t = 0; t <= 20; t += 2) {
          pts.push({ x: t, y: Number(Math.min(220, t * res.yieldMlPerMin).toFixed(1)) });
        }
        return pts;
      }
    },

    {
      experimentId: 'EXP-G',
      domainId: 'G',
      activityType: 'B',
      title: 'Śaṅku Gnomon Shadow Trigonometry & Lunar Eclipse Geometry',
      titleHi: 'शंकु धूपघड़ी छाया त्रिकोणमिति और ग्रहण ज्यामिति मॉडल',
      classAndSubject: 'Class IX (ix8, ix9) & Class X (ch9, ch10) — Science (086)',
      learningObjective: 'Compute exact solar altitude and gnomon shadow length from latitude, solar declination, and hour angle, and contrast astronomical shadow optics with non-scientific astrology.',
      historicalConnection: 'Āryabhaṭa (499 CE) explained eclipses via shadow geometry and Earth’s rotation; Jantar Mantar masonry sundials apply identical spherical astronomy.',
      scientificConcept: 'sin α = sin φ sin δ + cos φ cos δ cos H; shadow length L = h / tan α.',
      researchQuestion: 'How do observer latitude and seasonal solar declination alter noon shadow lengths across Indian cities like Patna, Ranchi, and Delhi?',
      hypothesis: 'Minimum noon shadow occurs when |φ − δ| is smallest; winter solstice produces the longest noon shadows in the Northern Hemisphere.',
      independentVariable: 'Latitude φ (8°–35° N), Solar Declination δ (−23.4° to +23.4°), Local Solar Hour (8–16 h)',
      dependentVariable: 'Solar altitude α (°), Gnomon shadow length L (m) for 1 m gnomon',
      controlledVariables: 'Vertical 1.0 m gnomon on level horizontal plane',
      materials: ['Spherical trigonometry calculator', 'Interactive shadow-angle canvas'],
      safetyRequirements: 'NEVER look directly at the Sun during real outdoor shadow observations.',
      teacherSupervision: 'Teacher reinforces strict demarcation between astronomy (science) and astrology (non-science).',
      procedure: [
        '1. Set Latitude φ = 25.6° (Patna) / 23.3° (Ranchi), Solar Hour = 12:00, Declination δ = +23.4° (June Solstice).',
        '2. Observe near-zero noon shadow near the Tropic of Cancer (Ranchi ~23.3° N).',
        '3. Change Declination to −23.4° (December Solstice) and record the dramatic increase in noon shadow length.'
      ],
      observationTableColumns: ['Lat φ (°N)', 'Decl δ (°)', 'Hour', 'Altitude α (°)', 'Shadow L (m)'],
      dataCollectionSchema: { xKey: 'hour', yKey: 'shadowM', unitX: 'solar hour', unitY: 'm' },
      graphConfig: { title: 'Gnomon Shadow Length vs Local Solar Hour', xLabel: 'Local Solar Hour (h)', yLabel: 'Shadow Length L (m)' },
      scientificInterpretation: 'Seasonal shadow variations result purely from Earth’s 23.44° axial tilt orbiting the Sun—predictable to arcminute precision without astrological claims.',
      conclusion: 'Classical gnomon observations and modern spherical astronomy obey exact trigonometric geometry.',
      sourcesOfError: 'Atmospheric refraction near the horizon (~0.5°) slightly raises apparent low sun angles.',
      limitations: 'Gives local apparent solar time; Equation of Time and IST longitude offset are needed for wristwatch time.',
      reflectionQuestions: [
        'Why is Ranchi (23.34° N) nearly shadow-free at solar noon around June 21?',
        'Why does Āryabhaṭa’s shadow model refute mythological explanations of eclipses?'
      ],
      assessmentRubric: {
        criteria: ['Correctly links axial tilt δ and latitude φ to shadow length', 'Separates astronomy from astrology'],
        maxScore: 10
      },
      controls: [
        { key: 'lat', label: 'Latitude φ (°N · Patna 25.6, Ranchi 23.3)', labelHi: 'अक्षांश φ (°N)', min: 8, max: 35, step: 0.5, defaultValue: 25.5, unit: '°N' },
        { key: 'decl', label: 'Solar Declination δ (°)', labelHi: 'सौर क्रांति δ (°)', min: -23.4, max: 23.4, step: 1.8, defaultValue: 0, unit: '°' },
        { key: 'hour', label: 'Local Solar Hour (6–18h)', labelHi: 'सौर समय (घंटे)', min: 7, max: 17, step: 0.5, defaultValue: 12, unit: 'h' }
      ],
      run: function (params) {
        var lat = clamp(params.lat !== undefined ? params.lat : 25.5, 8, 35);
        var decl = clamp(params.decl !== undefined ? params.decl : 0, -23.4, 23.4);
        var hour = clamp(params.hour !== undefined ? params.hour : 12, 7, 17);
        var rad = Math.PI / 180;
        var H = (hour - 12) * 15;
        var sinAlt = Math.sin(lat * rad) * Math.sin(decl * rad) + Math.cos(lat * rad) * Math.cos(decl * rad) * Math.cos(H * rad);
        sinAlt = clamp(sinAlt, -1, 1);
        var altDeg = Math.asin(sinAlt) / rad;
        var shadow = altDeg > 2 ? Number((1 / Math.tan(altDeg * rad)).toFixed(3)) : 28.6;
        return {
          latitude: lat,
          declination: decl,
          solarHour: hour,
          altitudeDeg: Number(altDeg.toFixed(2)),
          shadowLengthM: shadow,
          summary: 'Solar Altitude α = ' + altDeg.toFixed(2) + '° · 1 m Gnomon Shadow = ' + shadow + ' m'
        };
      },
      generateSeries: function (params) {
        var lat = clamp(params.lat !== undefined ? params.lat : 25.5, 8, 35);
        var decl = clamp(params.decl !== undefined ? params.decl : 0, -23.4, 23.4);
        var rad = Math.PI / 180;
        var pts = [];
        for (var hr = 7; hr <= 17; hr += 0.5) {
          var H = (hr - 12) * 15;
          var sinAlt = clamp(Math.sin(lat * rad) * Math.sin(decl * rad) + Math.cos(lat * rad) * Math.cos(decl * rad) * Math.cos(H * rad), -1, 1);
          var altDeg = Math.asin(sinAlt) / rad;
          var sh = altDeg > 3 ? Math.min(12, 1 / Math.tan(altDeg * rad)) : 12;
          pts.push({ x: hr, y: Number(sh.toFixed(2)) });
        }
        return pts;
      }
    },

    {
      experimentId: 'EXP-H',
      domainId: 'H',
      activityType: 'C',
      title: 'Jharkhand & Santhal Pargana Watershed Runoff–Infiltration Balance Model',
      titleHi: 'झारखंड और संताल परगना जलग्रहण अपवाह–अंतःस्यंदन मॉडल',
      classAndSubject: 'Class IX (ix4, ix8) & Class X (ch13) — Science (086)',
      learningObjective: 'Quantify how terrain slope, monsoon rainfall, Sal/Sarna forest cover, and Dobha / Ahar–Pyne structures alter runoff vs soil moisture storage—and identify where they fail.',
      historicalConnection: 'Models regional Jharkhand & Santhal Pargana watershed traditions (Dobha ponds, Ahar–Pyne channels, Sarna groves) within local Chota Nagpur lateritic plateau hydrology.',
      scientificConcept: 'Watershed water balance: Rainfall (P) = Surface Runoff (Q) + Infiltration & Recharge (I) + Evapotranspiration (ET) + Captured Storage (ΔS).',
      researchQuestion: 'How do slope steepness and watershed conservation structures change runoff and moisture retention on plateau red soils?',
      hypothesis: 'Contour bunds, Dobha storage, and Sal forest cover increase infiltration and reduce erosive runoff on moderate slopes, but lose effectiveness on steep degraded slopes or severe drought.',
      independentVariable: 'Monsoon rainfall (400–1600 mm), Terrain slope (1–15%), Vegetation/Sarna cover (10–90%), Dobha/Bund capacity (0–300 mm eq)',
      dependentVariable: 'Erosive surface runoff (mm), Infiltrated/Stored water (mm), Context suitability alert',
      controlledVariables: '1-hectare lateritic/red-loam Chota Nagpur plateau micro-watershed',
      materials: ['Hydrological water-balance simulator (regional Jharkhand/Santhal Pargana parameters)'],
      safetyRequirements: 'Simulation model; real watershed field visits require teacher supervision near ponds/streams.',
      teacherSupervision: 'Teacher emphasizes contextual evaluation—no traditional method is universally effective everywhere.',
      procedure: [
        '1. Set Rainfall = 1200 mm, Slope = 6%, Cover = 25%, Dobha/Bund = 0 mm (degraded bare slope) and note high erosive runoff.',
        '2. Increase Sarna/vegetation cover to 65% and Dobha/Bund capacity to 180 mm; compare runoff drop and infiltration gain.',
        '3. Test Rainfall = 450 mm and Slope = 14% to see hydrological boundary limits.'
      ],
      observationTableColumns: ['Rain (mm)', 'Slope (%)', 'Cover (%)', 'Dobha (mm)', 'Runoff (mm)', 'Retained (mm)'],
      dataCollectionSchema: { xKey: 'slope', yKey: 'runoffMm', unitX: '% slope', unitY: 'mm' },
      graphConfig: { title: 'Surface Runoff vs Terrain Slope (%)', xLabel: 'Terrain Slope (%)', yLabel: 'Surface Runoff (mm)' },
      scientificInterpretation: 'Dobha ponds and Sarna tree cover slow overland flow velocity, raising infiltration time on moderate Chota Nagpur slopes, while steep slopes or unmaintained siltation limit capture.',
      conclusion: 'Traditional ecological systems succeed when matched accurately to local slope, soil permeability, and rainfall regime.',
      sourcesOfError: 'Simplified annual water-balance curve averages intense single-day cloudburst peaks.',
      limitations: 'Regional site engineering requires soil-core permeability tests and local community maintenance.',
      reflectionQuestions: [
        'Why does a Dobha farm pond work better on moderate undulating fields than on steep rocky ridges?',
        'How do Sarna / Jaher Than sacred groves support both biodiversity and watershed stability?'
      ],
      assessmentRubric: {
        criteria: ['Applies water balance P = Q + I + ET + ΔS', 'States explicit geographical/climatic limits'],
        maxScore: 10
      },
      controls: [
        { key: 'rainfall', label: 'Seasonal Rainfall (mm)', labelHi: 'मौसमी वर्षा (mm)', min: 400, max: 1600, step: 50, defaultValue: 1150, unit: 'mm' },
        { key: 'slope', label: 'Terrain Slope (%)', labelHi: 'ढलान (%)', min: 1, max: 15, step: 1, defaultValue: 5, unit: '%' },
        { key: 'cover', label: 'Sarna / Vegetation Cover (%)', labelHi: 'वनस्पति आवरण (%)', min: 10, max: 90, step: 5, defaultValue: 55, unit: '%' },
        { key: 'dobha', label: 'Dobha / Bund Capture (mm eq)', labelHi: 'डोभा / मेड़ क्षमता (mm)', min: 0, max: 300, step: 25, defaultValue: 150, unit: 'mm' }
      ],
      run: function (params) {
        var rain = clamp(params.rainfall !== undefined ? params.rainfall : 1150, 400, 1600);
        var slope = clamp(params.slope !== undefined ? params.slope : 5, 1, 15);
        var cover = clamp(params.cover !== undefined ? params.cover : 55, 10, 90);
        var dobha = clamp(params.dobha !== undefined ? params.dobha : 150, 0, 300);
        var rawRunoffCoeff = clamp(0.22 + 0.025 * slope - 0.0022 * cover, 0.08, 0.72);
        var rawRunoff = rain * rawRunoffCoeff;
        var captured = Math.min(rawRunoff * 0.75, dobha);
        var runoff = Number((rawRunoff - captured).toFixed(1));
        var et = Number((rain * (0.28 + 0.0012 * cover)).toFixed(1));
        var infiltration = Number(Math.max(0, rain - runoff - et).toFixed(1));
        var contextNote = slope > 11
          ? 'Steep slope limit: simple bunds/dobhas face overflow risk without terracing'
          : (rain < 550 ? 'Low-rainfall deficit: supplemental basin planning needed' : 'Well-suited to Chota Nagpur / Santhal Pargana micro-watershed');
        return {
          rainfall: rain,
          slope: slope,
          cover: cover,
          dobha: dobha,
          runoffMm: runoff,
          infiltrationAndStoredMm: Number((infiltration + captured).toFixed(1)),
          evapotranspirationMm: et,
          contextNote: contextNote,
          summary: 'Runoff = ' + runoff + ' mm · Retained/Recharged = ' + (infiltration + captured).toFixed(1) + ' mm (' + contextNote + ')'
        };
      },
      generateSeries: function (params) {
        var rain = clamp(params.rainfall !== undefined ? params.rainfall : 1150, 400, 1600);
        var cover = clamp(params.cover !== undefined ? params.cover : 55, 10, 90);
        var dobha = clamp(params.dobha !== undefined ? params.dobha : 150, 0, 300);
        var pts = [];
        for (var sl = 1; sl <= 15; sl += 2) {
          var rc = clamp(0.22 + 0.025 * sl - 0.0022 * cover, 0.08, 0.72);
          var raw = rain * rc;
          var cap = Math.min(raw * 0.75, dobha);
          pts.push({ x: sl, y: Number((raw - cap).toFixed(1)) });
        }
        return pts;
      }
    }
  ];

  function getAllExperiments() {
    return EXPERIMENTS.slice();
  }

  function getExperimentByDomain(domainId) {
    for (var i = 0; i < EXPERIMENTS.length; i++) {
      if (EXPERIMENTS[i].domainId === domainId) return EXPERIMENTS[i];
    }
    return null;
  }

  function getExperimentById(expId) {
    for (var i = 0; i < EXPERIMENTS.length; i++) {
      if (EXPERIMENTS[i].experimentId === expId) return EXPERIMENTS[i];
    }
    return null;
  }

  function getDefaultParams(exp) {
    var out = {};
    (exp.controls || []).forEach(function (c) {
      out[c.key] = c.defaultValue;
    });
    return out;
  }

  function exportReportMarkdown(exp, params, observations) {
    var res = exp.run(params || getDefaultParams(exp));
    var actMeta = SCHEMA.ACTIVITY_TYPES[exp.activityType] || { label: exp.activityType };
    var lines = [
      '# IKS × Modern Science Lab Report: ' + exp.title,
      '- **Experiment ID:** ' + exp.experimentId,
      '- **Activity Type:** ' + exp.activityType + ' — ' + actMeta.label,
      '- **CBSE Alignment:** ' + exp.classAndSubject,
      '- **Research Question:** ' + exp.researchQuestion,
      '- **Hypothesis:** ' + exp.hypothesis,
      '- **Current Output:** ' + res.summary,
      '',
      '## Safety & Supervision',
      '- ' + exp.safetyRequirements,
      '- ' + exp.teacherSupervision,
      '',
      '## Recorded Observations (' + (observations ? observations.length : 0) + ' rows)'
    ];
    if (observations && observations.length) {
      observations.forEach(function (row, idx) {
        lines.push((idx + 1) + '. Predicted: `' + (row.predicted || '—') + '` | Observed: `' + row.observed + '`');
      });
    } else {
      lines.push('_No manual observation rows logged yet._');
    }
    lines.push('', '## Scientific Interpretation & Limitations', '- ' + exp.scientificInterpretation, '- **Limitations:** ' + exp.limitations);
    return lines.join('\n');
  }

  function validateAllExperiments() {
    var issues = [];
    EXPERIMENTS.forEach(function (exp) {
      var res = SCHEMA.validateExperimentRecord(exp);
      if (!res.valid) issues.push({ experimentId: exp.experimentId, errors: res.errors });
    });
    return { valid: issues.length === 0, total: EXPERIMENTS.length, issues: issues };
  }

  return {
    EXPERIMENTS: EXPERIMENTS,
    getAllExperiments: getAllExperiments,
    getExperimentByDomain: getExperimentByDomain,
    getExperimentById: getExperimentById,
    getDefaultParams: getDefaultParams,
    exportReportMarkdown: exportReportMarkdown,
    validateAllExperiments: validateAllExperiments
  };
});
