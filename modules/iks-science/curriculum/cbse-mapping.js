(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../schemas/evidence-schema'));
  } else {
    root.VA_IKS_CURRICULUM = factory(root.VA_IKS_SCHEMA);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (SCHEMA) {
  'use strict';

  var CURRICULUM_META = {
    session: '2026–27',
    board: 'CBSE',
    subjectCode: 'Science (086)',
    portalUrl: 'https://cbseacademic.nic.in/',
    curricularGoalReference: 'CG 6: India’s contribution to science (C6.1) — Vigyan Atlas CGR registry',
    verificationStatus: 'Aligned with Vigyan Atlas verified 2026–27 repository registry (IXC, Hi, CGR, api/ai/curriculum.json). Direct external PDF download: ' + SCHEMA.PENDING_REF_LABEL,
    compulsoryExamDisclaimer: 'IKS historical discussions and enrichment modules are curriculum-linked references only and are NOT compulsory CBSE board examination content unless explicitly listed in the prescribed NCERT/CBSE syllabus.'
  };

  var CLASS_IX_MAPPINGS = [
    {
      id: 'CBSE-IX-A',
      curriculumSession: '2026–27',
      classLevel: 'IX',
      subject: 'Science (086)',
      domainId: 'A',
      chapterId: 'ix6',
      chapterTitle: 'Structure of an Atom (also links ix7 Atoms & Molecules)',
      chapterTitleHi: 'परमाणु की संरचना (एवं परमाणु और अणु ix7)',
      learningOutcome: 'Distinguishes philosophical atomism (Acharya Kanad’s Paramanu mentioned in ix6 LO) from experimental Dalton, Thomson, Rutherford, and Bohr atomic models.',
      prescribedCore: 'Subatomic particles (p⁺, n⁰, e⁻), Thomson/Rutherford/Bohr models, atomic number Z, mass number A, isotopes, valency.',
      iksEnrichment: 'Vaiśeṣika Sūtra Paramanu & Anu conceptual framework (explicitly contrasted—never equated—with modern divisible atoms).',
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      isCompulsoryBoardContent: false,
      curricularGoal: 'CG 6 · C6.1'
    },
    {
      id: 'CBSE-IX-B',
      curriculumSession: '2026–27',
      classLevel: 'IX',
      subject: 'Science (086) & Class IX Mathematics Cross-Link',
      domainId: 'B',
      chapterId: 'ix9',
      chapterTitle: 'Motion (Quantitative Graphing & Mensuration Cross-Link)',
      chapterTitleHi: 'गति (मात्रात्मक ग्राफ और क्षेत्रमिति सह-संबंध)',
      learningOutcome: 'Applies decimal place-value precision, coordinate geometry, and right-triangle diagonal relations to motion graphs and physical measurement.',
      prescribedCore: 'Distance-time/velocity-time graphs, SI unit conversions, vector displacement via right-triangle Pythagoras relation.',
      iksEnrichment: 'Āryabhaṭa’s decimal place-value, Brahmagupta’s zero & negative-number arithmetic, Baudhāyana Śulbasūtra diagonal theorem.',
      scopeLabel: 'IKS Historical Enrichment',
      isCompulsoryBoardContent: false,
      curricularGoal: 'CG 6 · C6.1'
    },
    {
      id: 'CBSE-IX-C',
      curriculumSession: '2026–27',
      classLevel: 'IX',
      subject: 'Science (086)',
      domainId: 'C',
      chapterId: 'ix4',
      chapterTitle: 'Diversity in Living Organisms (also ix1 Cell, ix2 Tissues)',
      chapterTitleHi: 'जीवों में विविधता (एवं कोशिका ix1, ऊतक ix2)',
      learningOutcome: 'Connects plant diversity and cellular/microbial biology to documented surgical history and evidence-based pharmacology.',
      prescribedCore: 'Plantae taxonomy, cell structure, tissue organization, evidence-based microbiology concepts.',
      iksEnrichment: 'Suśruta Saṃhitā historical surgical tools and Charaka botanical traditions evaluated strictly via modern EBM standards.',
      scopeLabel: 'Independent Research Activity',
      isCompulsoryBoardContent: false,
      curricularGoal: 'CG 6 · C6.1'
    },
    {
      id: 'CBSE-IX-D',
      curriculumSession: '2026–27',
      classLevel: 'IX',
      subject: 'Science (086)',
      domainId: 'D',
      chapterId: 'ix2',
      chapterTitle: 'Tissues (Muscular & Nervous Tissue Mechanics)',
      chapterTitleHi: 'ऊतक (पेशीय और तंत्रिका ऊतक यांत्रिकी)',
      learningOutcome: 'Relates voluntary/involuntary muscular contraction and nervous signaling to posture stability and breathing mechanics.',
      prescribedCore: 'Striated, smooth, and cardiac muscle structure; neuron structure and impulse conduction.',
      iksEnrichment: 'Distinguishing historical Yoga philosophy from measurable musculoskeletal posture and respiratory physiology.',
      scopeLabel: 'IKS Historical Enrichment',
      isCompulsoryBoardContent: false,
      curricularGoal: 'CG 6 · C6.1'
    },
    {
      id: 'CBSE-IX-E',
      curriculumSession: '2026–27',
      classLevel: 'IX',
      subject: 'Science (086)',
      domainId: 'E',
      chapterId: 'ix5',
      chapterTitle: 'Exploring Mixtures and their Separation (Alloys & Pure Substances)',
      chapterTitleHi: 'मिश्रण और उनका पृथक्करण (मिश्रधातु और शुद्ध पदार्थ)',
      learningOutcome: 'Identifies alloys such as steel as solid-solution mixtures/microstructures and contrasts them with pure elements and compounds.',
      prescribedCore: 'Elements, compounds, homogeneous/heterogeneous mixtures, alloys, physical vs chemical change.',
      iksEnrichment: 'Wootz crucible high-carbon steel (ukku) and Mehrauli Iron Pillar phosphorus-rich wrought iron.',
      scopeLabel: 'IKS Historical Enrichment',
      isCompulsoryBoardContent: false,
      curricularGoal: 'CG 6 · C6.1'
    },
    {
      id: 'CBSE-IX-F',
      curriculumSession: '2026–27',
      classLevel: 'IX',
      subject: 'Science (086)',
      domainId: 'F',
      chapterId: 'ix5',
      chapterTitle: 'Exploring Mixtures and their Separation (Distillation & Evaporation)',
      chapterTitleHi: 'मिश्रण और उनका पृथक्करण (आसवन और वाष्पीकरण)',
      learningOutcome: 'Explains evaporation, condensation, crystallization, chromatography, and distillation using safe aqueous models.',
      prescribedCore: 'Separating funnel, simple/fractional distillation, crystallization, paper chromatography (PRAC aligned).',
      iksEnrichment: 'Rasashastra Tiryakpātana Yantra and traditional water-steam floral hydro-distillation (Deg–Bhapka) history.',
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      isCompulsoryBoardContent: false,
      curricularGoal: 'CG 6 · C6.1'
    },
    {
      id: 'CBSE-IX-G',
      curriculumSession: '2026–27',
      classLevel: 'IX',
      subject: 'Science (086)',
      domainId: 'G',
      chapterId: 'ix8',
      chapterTitle: 'Earth as a System (also ix9 Motion)',
      chapterTitleHi: 'एक प्रणाली के रूप में पृथ्वी (एवं गति ix9)',
      learningOutcome: 'Models Earth’s axial rotation, shadow angles, and eclipse geometry alongside ix8 LO on traditional Earth observations.',
      prescribedCore: 'Earth rotation & revolution, seasons, day/night geometry, circular motion principles.',
      iksEnrichment: 'Āryabhaṭa’s Earth rotation & eclipse shadow theory; Jantar Mantar Samrat Yantra sundial geometry (astrology excluded).',
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      isCompulsoryBoardContent: false,
      curricularGoal: 'CG 6 · C6.1'
    },
    {
      id: 'CBSE-IX-H',
      curriculumSession: '2026–27',
      classLevel: 'IX',
      subject: 'Science (086)',
      domainId: 'H',
      chapterId: 'ix8',
      chapterTitle: 'Earth as a System (LO: Reflect on changing conditions using traditional knowledge)',
      chapterTitleHi: 'एक प्रणाली के रूप में पृथ्वी (पारंपरिक ज्ञान और पर्यावरणीय परिवर्तन)',
      learningOutcome: 'Directly addresses ix8 LO ("Reflect on changing conditions using traditional knowledge") using Jharkhand & Santhal Pargana watershed case studies.',
      prescribedCore: 'Water cycle, soil infiltration, forest biodiversity, climate variability.',
      iksEnrichment: 'Ahar–Pyne, Jharkhand Dobha ponds, and Sarna sacred groves evaluated rigorously within local plateau hydrology.',
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      isCompulsoryBoardContent: false,
      curricularGoal: 'CG 6 · C6.1'
    }
  ];

  var CLASS_X_MAPPINGS = [
    {
      id: 'CBSE-X-A',
      curriculumSession: '2026–27',
      classLevel: 'X',
      subject: 'Science (086)',
      domainId: 'A',
      chapterId: 'ch4',
      chapterTitle: 'Carbon and its Compounds (also ch3 Metals & Non-metals)',
      chapterTitleHi: 'कार्बन एवं उसके यौगिक (एवं धातु एवं अधातु ch3)',
      learningOutcome: 'Explains covalent/ionic bonding and carbon allotropes via valence electrons while contrasting with ancient indivisible-particle metaphysics.',
      prescribedCore: 'Covalent bonding, versatile nature of carbon, allotropes, ionic compounds, reactivity.',
      iksEnrichment: 'Why classical Paramanu metaphysics could not predict chemical valency or allotropy without electron shells.',
      scopeLabel: 'IKS Historical Enrichment',
      isCompulsoryBoardContent: false,
      curricularGoal: 'CG 6 · C6.1'
    },
    {
      id: 'CBSE-X-B',
      curriculumSession: '2026–27',
      classLevel: 'X',
      subject: 'Science (086) & Class X Quantitative Link',
      domainId: 'B',
      chapterId: 'ch9',
      chapterTitle: 'Light — Reflection & Refraction (also ch11 Electricity)',
      chapterTitleHi: 'प्रकाश — परावर्तन तथा अपवर्तन (एवं विद्युत ch11)',
      learningOutcome: 'Applies sign conventions (positive/negative focal lengths and object distances) and trigonometric/decimal precision to lens and Ohm’s law calculations.',
      prescribedCore: 'Mirror/lens formulas (1/v ± 1/u = 1/f), Snell’s law sine ratio, Ohm’s law V = IR.',
      iksEnrichment: 'Historical roots of negative-number sign rules (Brahmagupta) and half-chord sine tables (Āryabhaṭa).',
      scopeLabel: 'Teacher Extension Material',
      isCompulsoryBoardContent: false,
      curricularGoal: 'CG 6 · C6.1'
    },
    {
      id: 'CBSE-X-C',
      curriculumSession: '2026–27',
      classLevel: 'X',
      subject: 'Science (086)',
      domainId: 'C',
      chapterId: 'ch5',
      chapterTitle: 'Life Processes (Nutrition, Immunity & Digestive Chemistry ch2)',
      chapterTitleHi: 'जैव प्रक्रम (पोषण, पाचन रसायन ch2)',
      learningOutcome: 'Evaluates historical medical plant uses against modern human physiology, pH chemistry, and clinical evidence hierarchies.',
      prescribedCore: 'Human digestive/circulatory/excretory systems, enzymes, acid-base neutralization.',
      iksEnrichment: 'Critical comparison of Suśruta/Charaka botanical history vs Evidence-Based Medicine (non-clinical educational overview).',
      scopeLabel: 'Independent Research Activity',
      isCompulsoryBoardContent: false,
      curricularGoal: 'CG 6 · C6.1'
    },
    {
      id: 'CBSE-X-D',
      curriculumSession: '2026–27',
      classLevel: 'X',
      subject: 'Science (086)',
      domainId: 'D',
      chapterId: 'ch5',
      chapterTitle: 'Life Processes & ch6 Control and Coordination',
      chapterTitleHi: 'जैव प्रक्रम एवं नियंत्रण तथा समन्वय (ch6)',
      learningOutcome: 'Quantifies alveolar gas exchange, minute ventilation, and autonomic heart-rate regulation using parameterized models.',
      prescribedCore: 'Alveolar respiration, heart pumping cycle, reflex arc, autonomic nervous system, coordination.',
      iksEnrichment: 'Separation of Yoga’s philosophical heritage from measurable respiratory & cardiovascular recovery dynamics.',
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      isCompulsoryBoardContent: false,
      curricularGoal: 'CG 6 · C6.1'
    },
    {
      id: 'CBSE-X-E',
      curriculumSession: '2026–27',
      classLevel: 'X',
      subject: 'Science (086)',
      domainId: 'E',
      chapterId: 'ch3',
      chapterTitle: 'Metals and Non-metals & ch1 Chemical Reactions (Corrosion & Redox)',
      chapterTitleHi: 'धातु एवं अधातु तथा रासायनिक अभिक्रियाएँ (संक्षारण और रेडॉक्स ch1)',
      learningOutcome: 'Applies redox chemistry and corrosion-prevention principles to understand the Iron Pillar of Delhi and Wootz steel.',
      prescribedCore: 'Redox reactions, corrosion of iron, reactivity series, extraction of metals, galvanization & alloying.',
      iksEnrichment: 'Archaeometallurgy of the Mehrauli Iron Pillar phosphate passive film and South Indian Wootz crucible steel.',
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      isCompulsoryBoardContent: false,
      curricularGoal: 'CG 6 · C6.1'
    },
    {
      id: 'CBSE-X-F',
      curriculumSession: '2026–27',
      classLevel: 'X',
      subject: 'Science (086)',
      domainId: 'F',
      chapterId: 'ch2',
      chapterTitle: 'Acids, Bases and Salts (Crystallization & Safe Water Purification)',
      chapterTitleHi: 'अम्ल, क्षारक एवं लवण (क्रिस्टलीकरण और सुरक्षित जल पृथक्करण)',
      learningOutcome: 'Connects water-of-crystallization and phase separation concepts to historical condensation apparatus using safe aqueous models only.',
      prescribedCore: 'Salt crystallization, water purification, boiling point and condensation phase changes.',
      iksEnrichment: 'Historical Tiryakpātana Yantra and water-steam floral hydro-distillation apparatus history (strictly zero alcohol/toxic solvents).',
      scopeLabel: 'IKS Historical Enrichment',
      isCompulsoryBoardContent: false,
      curricularGoal: 'CG 6 · C6.1'
    },
    {
      id: 'CBSE-X-G',
      curriculumSession: '2026–27',
      classLevel: 'X',
      subject: 'Science (086)',
      domainId: 'G',
      chapterId: 'ch10',
      chapterTitle: 'The Human Eye and the Colourful World (also ch9 Light)',
      chapterTitleHi: 'मानव नेत्र तथा रंगबिरंगा संसार (एवं प्रकाश ch9)',
      learningOutcome: 'Links rectilinear propagation of light, shadow optics, and atmospheric scattering to eclipses and solar gnomon instruments.',
      prescribedCore: 'Ray optics, atmospheric refraction, scattering of light, sunrise/sunset geometry.',
      iksEnrichment: 'Āryabhaṭa’s shadow model of eclipses and Samrat Yantra equinoctial sundial timekeeping (strictly non-astrological).',
      scopeLabel: 'IKS Historical Enrichment',
      isCompulsoryBoardContent: false,
      curricularGoal: 'CG 6 · C6.1'
    },
    {
      id: 'CBSE-X-H',
      curriculumSession: '2026–27',
      classLevel: 'X',
      subject: 'Science (086)',
      domainId: 'H',
      chapterId: 'ch13',
      chapterTitle: 'Our Environment',
      chapterTitleHi: 'हमारा पर्यावरण',
      learningOutcome: 'Evaluates ecosystem trophic balance, watershed conservation, and biodiversity protection using Jharkhand & Santhal Pargana field contexts.',
      prescribedCore: 'Ecosystems, food webs, trophic pyramids, environmental degradation, sustainable resource management.',
      iksEnrichment: 'Regional Ahar–Pyne, Dobha farm ponds, and Sarna sacred groves analyzed with geographic and hydrological boundary conditions.',
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      isCompulsoryBoardContent: false,
      curricularGoal: 'CG 6 · C6.1'
    }
  ];

  function getAllMappings() {
    return CLASS_IX_MAPPINGS.concat(CLASS_X_MAPPINGS);
  }

  function getByClass(classLevel) {
    if (classLevel === 'IX') return CLASS_IX_MAPPINGS.slice();
    if (classLevel === 'X') return CLASS_X_MAPPINGS.slice();
    return getAllMappings();
  }

  function getByDomain(domainId, classLevel) {
    return getByClass(classLevel).filter(function (m) {
      return m.domainId === domainId;
    });
  }

  function getByChapterId(chapterId) {
    return getAllMappings().filter(function (m) {
      return m.chapterId === chapterId;
    });
  }

  function validateAllMappings() {
    var all = getAllMappings();
    var issues = [];
    all.forEach(function (m) {
      var res = SCHEMA.validateCurriculumRecord(m);
      if (!res.valid) issues.push({ id: m.id, errors: res.errors });
    });
    return { valid: issues.length === 0, total: all.length, issues: issues };
  }

  return {
    CURRICULUM_META: CURRICULUM_META,
    CLASS_IX_MAPPINGS: CLASS_IX_MAPPINGS,
    CLASS_X_MAPPINGS: CLASS_X_MAPPINGS,
    getAllMappings: getAllMappings,
    getByClass: getByClass,
    getByDomain: getByDomain,
    getByChapterId: getByChapterId,
    validateAllMappings: validateAllMappings
  };
});
