(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../schemas/evidence-schema'));
  } else {
    root.VA_IKS_ASSESSMENT = factory(root.VA_IKS_SCHEMA);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (SCHEMA) {
  'use strict';

  var QUESTIONS = [
    {
      id: 'Q-A-1',
      domainId: 'A',
      classLevel: 'IX',
      competency: 'Analysis & Evaluation',
      questionType: 'Assertion–Reason / Evidence Distinction',
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      question: 'Why must Acharya Kaṇāda’s philosophical Paramanu NOT be equated directly with the modern Bohr/quantum atom?',
      questionHi: 'आचार्य कणाद के दार्शनिक परमाणु को आधुनिक बोर/क्वांटम परमाणु के बराबर क्यों नहीं माना जाना चाहिए?',
      options: [
        'Paramanu is a metaphysical indivisible postulate without experimental subatomic structure, whereas modern atoms have measured protons, neutrons, and electrons.',
        'Paramanu was defined only for liquids, whereas modern atoms apply only to gases.',
        'Modern atoms are strictly indivisible spheres with no internal parts.',
        'Paramanu included exact atomic mass numbers measured by mass spectrometry.'
      ],
      optionsHi: [
        'वैशेषिक परमाणु बिना प्रयोगात्मक उप-परमाण्विक संरचना के एक दार्शनिक सिद्धांत है, जबकि आधुनिक परमाणु में मापे गए प्रोटॉन, न्यूट्रॉन व इलेक्ट्रॉन होते हैं।',
        'परमाणु केवल द्रवों के लिए था और आधुनिक परमाणु केवल गैसों के लिए।',
        'आधुनिक परमाणु पूर्णतः अविभाज्य गोले हैं।',
        'परमाणु में द्रव्यमान स्पेक्ट्रोमेट्री से मापे गए परमाणु भार शामिल थे।'
      ],
      correctIndex: 0,
      rationale: 'Kaṇāda’s Vaiśeṣika Paramanu is classified as P1 (Philosophical/Conceptual Framework), whereas modern atomic structure (S1) rests on cathode-ray, scattering, and spectroscopic experiments.',
      rationaleHi: 'कणाद का परमाणु एक दार्शनिक ढाँचा (P1) है, जबकि आधुनिक परमाणु संरचना (S1) प्रयोगात्मक प्रमाणों पर आधारित है।'
    },
    {
      id: 'Q-B-1',
      domainId: 'B',
      classLevel: 'IX',
      competency: 'Knowledge & Understanding',
      questionType: 'Historical vs Modern Mathematics',
      scopeLabel: 'IKS Historical Enrichment',
      question: 'Which statement accurately describes Brahmagupta’s (628 CE) contribution to algebra and how modern mathematics treats it?',
      questionHi: 'ब्रह्मगुप्त (628 ई.) के बीजगणित योगदान और आधुनिक गणित के दृष्टिकोण के बारे में कौन-सा कथन सही है?',
      options: [
        'Brahmagupta formalized addition, subtraction, and multiplication with zero and negative numbers, though modern algebra revises his 0 ÷ 0 rule to undefined.',
        'Brahmagupta proved that π is transcendental.',
        'Modern calculus accepts division by zero as equal to zero.',
        'Brahmagupta rejected negative numbers as impossible.'
      ],
      optionsHi: [
        'ब्रह्मगुप्त ने शून्य और ऋणात्मक संख्याओं के जोड़, घटाव व गुणा के नियम दिए, जबकि आधुनिक गणित ने 0 ÷ 0 को अपरिभाषित माना है।',
        'ब्रह्मगुप्त ने सिद्ध किया कि π अबीजीय (transcendental) है।',
        'आधुनिक कलन में शून्य से भाग शून्य के बराबर माना जाता है।',
        'ब्रह्मगुप्त ने ऋणात्मक संख्याओं को अस्वीकार किया।'
      ],
      correctIndex: 0,
      rationale: 'Brāhmasphuṭasiddhānta (628 CE) gave systematic rules for zero and negatives (dhana/ṛṇa); modern arithmetic defines division by zero as undefined.',
      rationaleHi: 'ब्रह्मस्फुटसिद्धांत में शून्य और ऋणात्मक संख्याओं के नियम दिए गए, पर आधुनिक गणित शून्य से विभाजन को अपरिभाषित मानता है।'
    },
    {
      id: 'Q-C-1',
      domainId: 'C',
      classLevel: 'X',
      competency: 'Analysis & Evaluation',
      questionType: 'Evidence-Based Medicine Literacy',
      scopeLabel: 'Independent Research Activity',
      question: 'A laboratory study finds a traditional plant extract inhibits bacteria in a petri dish. What is required before claiming it treats human infection?',
      questionHi: 'एक प्रयोगशाला अध्ययन में पाया गया कि पारंपरिक पौधे का अर्क पेट्री डिश में बैक्टीरिया रोकता है। मानव संक्रमण के उपचार का दावा करने से पहले क्या आवश्यक है?',
      options: [
        'Standardized dosing, safety/toxicity testing, bioavailability checks, and randomized controlled human clinical trials (RCTs).',
        'Simply citing a historical text without clinical testing.',
        'Assuming petri-dish concentration equals human blood concentration.',
        'Treating all plant extracts as universally risk-free.'
      ],
      optionsHi: [
        'मानकीकृत खुराक, सुरक्षा/विषाक्तता जांच, जैव-उपलब्धता और यादृच्छिक नियंत्रित मानव नैदानिक परीक्षण (RCT)।',
        'बिना नैदानिक परीक्षण के केवल प्राचीन ग्रंथ का उल्लेख करना।',
        'पेट्री डिश की सांद्रता को मानव रक्त के बराबर मान लेना।',
        'सभी पादप अर्कों को स्वतः सुरक्षित मान लेना।'
      ],
      correctIndex: 0,
      rationale: 'In-vitro inhibition (S2) often fails in humans due to poor oral bioavailability or toxicity; Evidence-Based Medicine requires controlled human trials.',
      rationaleHi: 'इन-विट्रो परिणाम मानव शरीर में अवशोषण व सुरक्षा की गारंटी नहीं देते; इसके लिए नियंत्रित मानव परीक्षण (RCT) अनिवार्य हैं।'
    },
    {
      id: 'Q-D-1',
      domainId: 'D',
      classLevel: 'X',
      competency: 'Application',
      questionType: 'Quantitative Physiology',
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      question: 'If tidal volume is 550 mL, dead space is 150 mL, and breathing rate is 10 breaths/min, what is alveolar ventilation (V_A)?',
      questionHi: 'यदि ज्वारीय आयतन 550 mL, डेड स्पेस 150 mL और श्वसन दर 10 श्वास/मिनट है, तो कूपिका संवातन (V_A) कितना होगा?',
      options: [
        '4.0 L/min (400 mL × 10)',
        '5.5 L/min',
        '1.5 L/min',
        '7.0 L/min'
      ],
      optionsHi: [
        '4.0 L/min (400 mL × 10)',
        '5.5 L/min',
        '1.5 L/min',
        '7.0 L/min'
      ],
      correctIndex: 0,
      rationale: 'Alveolar ventilation V_A = (V_T − V_D) × f = (550 − 150) × 10 = 4000 mL/min = 4.0 L/min.',
      rationaleHi: 'V_A = (V_T − V_D) × f = (550 − 150) × 10 = 4000 mL/min = 4.0 L/min।'
    },
    {
      id: 'Q-E-1',
      domainId: 'E',
      classLevel: 'X',
      competency: 'Knowledge & Understanding',
      questionType: 'Materials Chemistry',
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      question: 'Which scientific combination best explains the slow rusting of the Mehrauli Iron Pillar of Delhi?',
      questionHi: 'दिल्ली के महरौली लौह स्तंभ में बहुत धीमे संक्षारण की सबसे सटीक वैज्ञानिक व्याख्या क्या है?',
      options: [
        'High phosphorus (~0.25%) catalyzing a protective iron-hydrogen-phosphate passive film combined with Delhi’s relatively dry inland climate.',
        'The pillar is made of pure elemental gold coated in black paint.',
        'Iron never reacts with oxygen or water under any conditions.',
        'Chloride sea spray protects wrought iron from oxidation.'
      ],
      optionsHi: [
        'उच्च फॉस्फोरस (~0.25%) द्वारा सुरक्षात्मक फॉस्फेट निष्क्रिय परत का निर्माण और दिल्ली की अपेक्षाकृत शुष्क जलवायु।',
        'स्तंभ शुद्ध सोने का बना है।',
        'लोहा कभी भी ऑक्सीजन और जल से अभिक्रिया नहीं करता।',
        'समुद्री लवण (क्लोराइड) लोहे को जंग से बचाता है।'
      ],
      correctIndex: 0,
      rationale: 'Materials studies show phosphorus (~0.25% in wrought iron) promotes a passive crystalline phosphate barrier that slows electrochemical oxidation in low-salinity inland air.',
      rationaleHi: 'फॉस्फोरस (~0.25%) सुरक्षात्मक फॉस्फेट परत बनाने में सहायक होता है, जो शुष्क जलवायु में ऑक्सीकरण की दर धीमी करता है।'
    },
    {
      id: 'Q-F-1',
      domainId: 'F',
      classLevel: 'IX',
      competency: 'Application',
      questionType: 'Separation Science & Safety',
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      question: 'In a school hydro-distillation of aqueous salt water (analogous to Tiryakpātana condensation), why is the collected distillate free of salt?',
      questionHi: 'लवणीय जल के सुरक्षित आसवन (तिर्यक्पातन संघनन के अनुरूप) में प्राप्त आसुत जल लवण-रहित क्यों होता है?',
      options: [
        'Water vaporizes around 100 °C and re-condenses in the cooled tube, while non-volatile Na⁺ and Cl⁻ ions remain behind.',
        'Sodium chloride evaporates first at 40 °C.',
        'Cold condenser water chemically converts NaCl into oxygen.',
        'Salt melts and rises through the condenser tube faster than steam.'
      ],
      optionsHi: [
        'जल लगभग 100 °C पर वाष्पित होकर ठंडी नली में संघनित होता है, जबकि अवाष्पशील Na⁺ और Cl⁻ आयन फ्लास्क में रह जाते हैं।',
        'सोडियम क्लोराइड 40 °C पर पहले वाष्पित होता है।',
        'ठंडा जल NaCl को ऑक्सीजन में बदल देता है।',
        'नमक पिघलकर भाप से तेज़ संघनित्र में जाता है।'
      ],
      correctIndex: 0,
      rationale: 'Simple aqueous distillation separates volatile H₂O from non-volatile ionic salt based on boiling-point difference and phase change.',
      rationaleHi: 'सरल आसवन क्वथनांक अंतर और अवस्था परिवर्तन के आधार पर वाष्पशील जल को अवाष्पशील लवण से अलग करता है।'
    },
    {
      id: 'Q-G-1',
      domainId: 'G',
      classLevel: 'IX',
      competency: 'Analysis & Evaluation',
      questionType: 'Scientific Demarcation',
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      question: 'Which pair correctly separates verified Indian astronomical contributions from non-scientific claims?',
      questionHi: 'निम्न में से कौन-सा विकल्प प्रमाणित भारतीय खगोलीय योगदान को गैर-वैज्ञानिक दावों से सही ढंग से अलग करता है?',
      options: [
        'Āryabhaṭa’s Earth rotation & shadow-eclipse geometry are empirical astronomy (H1/S1); predictive personal horoscopy is non-scientific astrology (U1).',
        'Both eclipse shadow mechanics and predictive horoscopes are identical modern physics.',
        'Jantar Mantar sundials cannot measure solar altitude without horoscopes.',
        'Eclipses are caused by planetary moods rather than Earth/Moon shadows.'
      ],
      optionsHi: [
        'आर्यभट का पृथ्वी घूर्णन व ग्रहण-छाया मॉडल खगोल विज्ञान (H1/S1) है; व्यक्तिगत भविष्यवाणी फलित ज्योतिष गैर-वैज्ञानिक (U1) है।',
        'ग्रहण छाया और फलित भविष्यवाणी दोनों समान आधुनिक भौतिकी हैं।',
        'जंतर मंतर धूपघड़ी बिना ज्योतिष के सौर ऊँचाई नहीं माप सकती।',
        'ग्रहण पृथ्वी/चंद्रमा की छाया से नहीं होते।'
      ],
      correctIndex: 0,
      rationale: 'Observational astronomy (rotation, gnomon solar altitude, eclipse umbra/penumbra) is empirically testable; predictive astrology fails scientific verification.',
      rationaleHi: 'प्रेक्षणात्मक खगोल विज्ञान प्रयोगात्मक रूप से परीक्षणीय है, जबकि फलित ज्योतिष वैज्ञानिक कसौटी पर प्रमाणित नहीं है।'
    },
    {
      id: 'Q-H-1',
      domainId: 'H',
      classLevel: 'X',
      competency: 'Analysis & Evaluation',
      questionType: 'Contextual Ecology (Jharkhand & Santhal Pargana)',
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      question: 'How should Jharkhand’s Dobha farm ponds and Sarna sacred groves be evaluated scientifically?',
      questionHi: 'झारखंड के डोभा तालाबों और सरना पवित्र उपवनों का वैज्ञानिक मूल्यांकन किस प्रकार किया जाना चाहिए?',
      options: [
        'They reduce monsoon runoff and protect local Sal/Mahua biodiversity on moderate plateau slopes, but effectiveness depends on local slope, soil permeability, rainfall, and maintenance.',
        'They guarantee 100% drought immunity in every desert and rocky ridge worldwide.',
        'Sacred groves reduce biodiversity compared to bare concrete.',
        'Traditional ponds violate the hydrological water-balance equation.'
      ],
      optionsHi: [
        'ये मध्यम पठारी ढलानों पर वर्षा अपवाह घटाते हैं और साल/महुआ जैव विविधता बचाते हैं, परंतु इनकी प्रभावशीलता स्थानीय ढलान, मिट्टी, वर्षा और रखरखाव पर निर्भर करती है।',
        'ये विश्व के हर मरुस्थल और खड़ी चट्टान पर 100% सूखा रोकते हैं।',
        'पवित्र उपवन कंक्रीट की तुलना में जैव विविधता घटाते हैं।',
        'पारंपरिक तालाब जल-संतुलन समीकरण का उल्लंघन करते हैं।'
      ],
      correctIndex: 0,
      rationale: 'Traditional ecological systems are context-dependent (D1/T1): effective within matching Chota Nagpur plateau hydrology, limited on steep eroded ridges or multi-year droughts.',
      rationaleHi: 'पारंपरिक पारिस्थितिक प्रणालियाँ स्थानीय भूगोल, ढलान और वर्षा के संदर्भ में ही प्रभावी होती हैं।'
    }
  ];

  function getAllQuestions() {
    return QUESTIONS.slice();
  }

  function getQuestions(opts) {
    var o = opts || {};
    return QUESTIONS.filter(function (q) {
      if (o.domainId && o.domainId !== 'ALL' && q.domainId !== o.domainId) return false;
      if (o.classLevel && o.classLevel !== 'ALL' && q.classLevel !== o.classLevel) return false;
      return true;
    });
  }

  function scoreSubmission(answersById) {
    var total = 0;
    var correct = 0;
    var details = [];
    QUESTIONS.forEach(function (q) {
      if (answersById && typeof answersById[q.id] === 'number') {
        total++;
        var isRight = answersById[q.id] === q.correctIndex;
        if (isRight) correct++;
        details.push({
          id: q.id,
          domainId: q.domainId,
          correct: isRight,
          selected: answersById[q.id],
          expected: q.correctIndex
        });
      }
    });
    return {
      answered: total,
      correct: correct,
      totalBank: QUESTIONS.length,
      pct: total ? Math.round((correct / total) * 100) : 0,
      details: details
    };
  }

  function validateAllQuestions() {
    var issues = [];
    QUESTIONS.forEach(function (q) {
      var res = SCHEMA.validateAssessmentItem(q);
      if (!res.valid) issues.push({ id: q.id, errors: res.errors });
    });
    return { valid: issues.length === 0, total: QUESTIONS.length, issues: issues };
  }

  return {
    QUESTIONS: QUESTIONS,
    getAllQuestions: getAllQuestions,
    getQuestions: getQuestions,
    scoreSubmission: scoreSubmission,
    validateAllQuestions: validateAllQuestions
  };
});
