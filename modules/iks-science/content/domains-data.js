(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.VA_IKS_DOMAINS = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var GLOSSARY = [
    { en: 'Atom (Subatomic)', hi: 'परमाणु (अवपरमाण्विक)', def: 'Modern experimentally verified smallest chemical unit of an element (protons, neutrons, electrons). Distinct from Vaisheshika Paramanu.', defHi: 'आधुनिक प्रयोगात्मक रूप से सिद्ध रासायनिक इकाई (प्रोटॉन, न्यूट्रॉन, इलेक्ट्रॉन)। वैशेषिक परमाणु से भिन्न।' },
    { en: 'Paramanu (Vaisheshika)', hi: 'परमाणु (वैशेषिक दर्शन)', def: 'Philosophical indivisible substance-unit postulated in Acharya Kanad’s Vaisheshika Sutra.', defHi: 'आचार्य कणाद के वैशेषिक सूत्र में वर्णित दार्शनिक अविभाज्य कण।' },
    { en: 'Decimal Place-Value', hi: 'दशमलव स्थान-मान प्रणाली', def: 'Base-10 positional numeral system where a digit’s value scales by powers of 10.', defHi: '10 के आधार वाली स्थानीय मान संख्या प्रणाली।' },
    { en: 'Evidence-Based Medicine (EBM)', hi: 'साक्ष्य-आधारित चिकित्सा', def: 'Clinical validation requiring controlled human trials, standardized dosing, and reproducible safety data.', defHi: 'नियंत्रित नैदानिक परीक्षण और मानकीकृत सुरक्षा डेटा पर आधारित आधुनिक चिकित्सा।' },
    { en: 'Autonomic Regulation', hi: 'स्वायत्त तंत्रिका नियंत्रण', def: 'Involuntary regulation of heart rate and breathing by sympathetic and parasympathetic (vagal) pathways.', defHi: 'सिम्पेथेटिक और पैरासिम्पेथेटिक तंत्र द्वारा हृदय गति व श्वसन का अनैच्छिक नियंत्रण।' },
    { en: 'Corrosion / Redox', hi: 'संक्षारण / रेडॉक्स अभिक्रिया', def: 'Electrochemical oxidation of a metal (e.g. Fe → Fe²⁺ + 2e⁻) coupled with reduction of oxygen in moisture.', defHi: 'नमी और ऑक्सीजन की उपस्थिति में धातु का विद्युत-रासायनिक ऑक्सीकरण।' },
    { en: 'Hydro-Distillation', hi: 'जल-वाष्प आसवन', def: 'Separation of volatile components or pure water using vaporization and controlled condensation.', defHi: 'वाष्पीकरण और संघनन द्वारा जल या वाष्पशील पदार्थों का पृथक्करण।' },
    { en: 'Astronomical Declination', hi: 'खगोलीय क्रांति (डेक्लिनेशन)', def: 'Angular distance of the Sun or a celestial body north or south of the celestial equator.', defHi: 'खगोलीय विषुवत वृत्त के उत्तर या दक्षिण में सूर्य या खगोलीय पिंड की कोणीय दूरी।' },
    { en: 'Watershed Runoff & Infiltration', hi: 'जलग्रहण अपवाह और अंतःस्यंदन', def: 'Partitioning of rainfall between surface flow (runoff) and soil absorption (infiltration).', defHi: 'वर्षा जल का सतही बहाव और मृदा में अवशोषण के बीच विभाजन।' }
  ];

  var DOMAINS = [
    {
      id: 'A',
      code: 'ATOMIC',
      icon: '⚛',
      title: 'Ancient Indian Atomic Thought',
      titleHi: 'प्राचीन भारतीय परमाणु चिंतन',
      subtitle: 'Vaiśeṣika Paramanu Philosophy vs Modern Experimental Atomic Theory',
      subtitleHi: 'वैशेषिक परमाणु दर्शन बनाम आधुनिक प्रयोगात्मक परमाणु सिद्धांत',
      classTags: ['IX (ix6, ix7)', 'X (ch3, ch4)'],
      vigyanAtlasLinks: ['ix6', 'ix7', 'ch3', 'ch4'],
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      guardrail: 'Never equate Kaṇāda’s philosophical Paramanu directly with the modern experimentally characterized, divisible atom.',
      guardrailHi: 'आचार्य कणाद के दार्शनिक परमाणु को आधुनिक प्रयोगात्मक रूप से विभाज्य परमाणु के समतुल्य कभी न मानें।',
      historicalOverview: 'Acharya Kaṇāda’s Vaiśeṣika Sūtra proposed a systematic natural philosophy in which macroscopic substances arise from eternal, indivisible Paramanus combining first into dyads (Dvyaṇuka) and triads (Tryaṇuka). It represents rational philosophical atomism rather than laboratory chemistry.',
      historicalOverviewHi: 'आचार्य कणाद के वैशेषिक सूत्र ने एक व्यवस्थित प्राकृतिक दर्शन प्रस्तुत किया जिसमें दृश्य पदार्थ शाश्वत, अविभाज्य परमाणुओं के द्व्यणुक और त्र्यणुक संयोजन से बनते हैं। यह प्रयोगशाला रसायन के बजाय तार्किक दार्शनिक परमाणुवाद है।',
      modernComparison: 'From Dalton’s stoichiometric law of multiple proportions (1808) to Thomson’s electron (1897), Rutherford’s nucleus (1911), Bohr’s quantized energy levels (1913), and modern quantum orbital mechanics, modern atomic theory rests on quantitative experiments and predicts chemical bonding, spectra, and isotopes.',
      modernComparisonHi: 'डाल्टन के गुणित अनुपात नियम (1808) से लेकर थॉमसन के इलेक्ट्रॉन (1897), रदरफोर्ड के नाभिक (1911), बोर के ऊर्जा स्तरों (1913) और आधुनिक क्वांटम कक्षक यांत्रिकी तक आधुनिक परमाणु सिद्धांत मात्रात्मक प्रयोगों पर आधारित है।',
      comparisonRows: [
        { dimension: 'Basis of Knowledge', historical: 'Philosophical inference & logical taxonomy (P1/H1)', modern: 'Quantitative stoichiometry, scattering, spectroscopy (S1)' },
        { dimension: 'Divisibility', historical: 'Paramanu defined as strictly indivisible', modern: 'Divisible into protons, neutrons, electrons & quarks' },
        { dimension: 'Mass & Charge', historical: 'Qualitative qualities (guṇa); no numeric mass or charge', modern: 'Measured atomic mass units, +1e / -1e charges, isotopes' },
        { dimension: 'Predictive Power', historical: 'Conceptual explanation of substance & change', modern: 'Predicts periodic trends, covalent/ionic bonding, nuclear reactions' }
      ],
      keyFigures: ['Acharya Kaṇāda (Vaiśeṣika Sūtra)', 'John Dalton (1808)', 'J. J. Thomson (1897)', 'Ernest Rutherford (1911)', 'Niels Bohr (1913)', 'Erwin Schrödinger (1926)'],
      limitations: 'Vaiśeṣika texts provide no experimental apparatus, numerical atomic weights, subatomic particles, or quantum wave equations.'
    },
    {
      id: 'B',
      code: 'MATH',
      icon: '∑',
      title: 'Indian Mathematics',
      titleHi: 'भारतीय गणित परंपरा',
      subtitle: 'Śūnya, Decimal Place-Value, Āryabhaṭa, Brahmagupta & Śulbasūtra Geometry',
      subtitleHi: 'शून्य, दशमलव स्थान-मान, आर्यभट, ब्रह्मगुप्त और शुल्बसूत्र ज्यामिति',
      classTags: ['IX (Cross-Math/ix9)', 'X (Cross-Math/ch9, ch11)'],
      vigyanAtlasLinks: ['ix9', 'ix11', 'ch9', 'ch11'],
      scopeLabel: 'IKS Historical Enrichment',
      guardrail: 'Present historical contributions accurately alongside their mathematical limits (e.g., Brahmagupta’s 0÷0=0 is revised to undefined in modern algebra).',
      guardrailHi: 'ऐतिहासिक योगदानों को उनकी गणितीय सीमाओं सहित सटीक रूप से प्रस्तुत करें (जैसे आधुनिक गणित में शून्य से भाग अपरिभाषित है)।',
      historicalOverview: 'Indian mathematics formalized the base-10 positional system with zero (Śūnya), Brahmagupta’s arithmetic rules for zero and negative numbers (628 CE), Āryabhaṭa’s place-value calculations, half-chord sine tables (ardha-jyā), and π ≈ 3.1416 (499 CE), plus Baudhāyana’s geometric diagonal triples. Transmitted via Baghdad scholars such as Al-Khwārizmī, these tools reshaped global computation.',
      historicalOverviewHi: 'भारतीय गणित ने शून्य सहित दशमलव स्थानीय मान प्रणाली, ब्रह्मगुप्त (628 ई.) के शून्य व ऋणात्मक संख्या नियम, आर्यभट (499 ई.) के अर्ध-ज्या त्रिकोणमिति व π ≈ 3.1416 मान तथा बौधायन के विकर्ण ज्यामिति संबंधों को विकसित किया।',
      modernComparison: 'Modern mathematics builds rigorously on axiomatic set theory, real/complex analysis, formal definitions preventing division by zero, and proofs of π’s irrationality and transcendence.',
      modernComparisonHi: 'आधुनिक गणित स्वयंसिद्ध समुच्चय सिद्धांत, वास्तविक/सम्मिश्र विश्लेषण, शून्य-भाजन के निषेध और π की अपरिमेयता के प्रमाणों पर आधारित है।',
      comparisonRows: [
        { dimension: 'Zero & Negatives', historical: 'Brahmagupta formalized +, −, × with 0 & debts (628 CE)', modern: 'Field axioms; a ÷ 0 strictly undefined' },
        { dimension: 'Value of π', historical: 'Āryabhaṭa: 62832/20000 = 3.1416 (explicitly āsanna/approx)', modern: 'Proven irrational & transcendental (3.14159265...)' },
        { dimension: 'Right Triangle Rule', historical: 'Baudhāyana Śulbasūtra cord construction (a² + b² = c²)', modern: 'Deductive Euclidean proof & vector norm generalization' }
      ],
      keyFigures: ['Baudhāyana', 'Āryabhaṭa I (499 CE)', 'Brahmagupta (628 CE)', 'Bhāskara II', 'Al-Khwārizmī (transmission)'],
      limitations: 'Early mathematical verses prioritized concise algorithmic rules over modern symbolic proofs; division by zero had to be corrected later.'
    },
    {
      id: 'C',
      code: 'MEDICAL',
      icon: '⚕',
      title: 'Ayurveda & Medical History',
      titleHi: 'आयुर्वेद और चिकित्सा इतिहास',
      subtitle: 'Suśruta Instruments, Botanical History vs Evidence-Based Pharmacology',
      subtitleHi: 'सुश्रुत शल्य उपकरण, वनस्पति इतिहास बनाम साक्ष्य-आधारित औषध विज्ञान',
      classTags: ['IX (ix1, ix2, ix4)', 'X (ch2, ch5, ch6)'],
      vigyanAtlasLinks: ['ix1', 'ix2', 'ix4', 'ch5'],
      scopeLabel: 'Independent Research Activity',
      guardrail: 'Educational history only: NEVER provide medical diagnoses, prescribe remedies, or present traditional systems as clinically validated without RCT evidence.',
      guardrailHi: 'केवल शैक्षिक इतिहास: कभी भी चिकित्सीय निदान या उपचार न सुझाएं, और बिना नियंत्रित नैदानिक परीक्षण के किसी दावे को चिकित्सकीय रूप से सिद्ध न बताएं।',
      historicalOverview: 'The Suśruta Saṃhitā documented specialized surgical instruments (blunt yantras and sharp śastras), training methods on plant gourds, and historical flap surgery. Classical texts also catalogued botanical materia medica (such as Azadirachta indica, Curcuma longa, Ocimum tenuiflorum) within the historical Tridoṣa conceptual framework.',
      historicalOverviewHi: 'सुश्रुत संहिता ने शल्य उपकरणों (यंत्र व शस्त्र), अभ्यास विधियों और पुनर्निर्माण शल्य इतिहास का वर्णन किया। चरक व सुश्रुत ग्रंथों ने पारंपरिक वनस्पतियों का भी वर्गीकरण किया।',
      modernComparison: 'Modern Evidence-Based Medicine (EBM) relies on cellular microbiology, germ theory, sterile autoclaving, anesthesia, active-molecule isolation, pharmacokinetics, and randomized controlled clinical trials (RCTs). Laboratory in-vitro extract activity does not automatically prove human clinical efficacy.',
      modernComparisonHi: 'आधुनिक साक्ष्य-आधारित चिकित्सा कोशिकीय सूक्ष्मजीव विज्ञान, रोगाणु सिद्धांत, जीवाणुरहित शल्यक्रिया, एनेस्थीसिया और यादृच्छिक नियंत्रित नैदानिक परीक्षणों (RCT) पर आधारित है।',
      comparisonRows: [
        { dimension: 'Surgical Tools & Hygiene', historical: 'Metal yantra/śastra forms & heated cleaning described', modern: 'Stainless surgical alloys, autoclave sterilization, germ theory' },
        { dimension: 'Physiological Framework', historical: 'Tridoṣa (Vāta–Pitta–Kapha) conceptual model (P1)', modern: 'Cellular pathology, biochemical markers, imaging (S1)' },
        { dimension: 'Medicinal Plants', historical: 'Whole-plant empirical formulations (T1)', modern: 'Isolated bioactives tested for bioavailability, dose & RCT safety (S2)' }
      ],
      keyFigures: ['Suśruta (Suśruta Saṃhitā)', 'Charaka (Charaka Saṃhitā)', 'Modern Pharmacologists & EBM Researchers'],
      limitations: 'Lacks pre-modern microbiology, standardized molecular dosing, and randomized clinical trial safety datasets. Zero clinical advice is offered here.'
    },
    {
      id: 'D',
      code: 'YOGA',
      icon: '🫁',
      title: 'Yoga & Human Physiology',
      titleHi: 'योग और मानव शरीर क्रिया विज्ञान',
      subtitle: 'Separating Historical Contemplative Philosophy from Measurable Respiratory & Heart Mechanics',
      subtitleHi: 'ऐतिहासिक योग दर्शन और मापनीय श्वसन-हृदय यांत्रिकी का स्पष्ट अंतर',
      classTags: ['IX (ix2, ix11)', 'X (ch5, ch6)'],
      vigyanAtlasLinks: ['ix2', 'ch5', 'ch6'],
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      guardrail: 'Keep philosophical concepts (prāṇa, cakras) strictly separate from measurable physiology. Never collect personal student health data or make medical claims.',
      guardrailHi: 'दार्शनिक अवधारणाओं (प्राण, चक्र) को मापनीय शरीर विज्ञान से अलग रखें। छात्रों का कोई व्यक्तिगत स्वास्थ्य डेटा एकत्र न करें।',
      historicalOverview: 'Patañjali’s Yoga Sūtras defined āsana primarily as steady meditative posture within an eight-fold ethical-contemplative system, while medieval Haṭha Yoga texts expanded physical postures and regulated breathing practices.',
      historicalOverviewHi: 'पतंजलि के योगसूत्रों ने आसन को मुख्यतः स्थिर ध्यान मुद्रा के रूप में परिभाषित किया, जबकि मध्यकालीन हठयोग ग्रंथों ने शारीरिक आसनों और श्वसन अभ्यासों का विस्तार किया।',
      modernComparison: 'Modern physiology measures concrete mechanical variables: skeletal muscle isometric load, diaphragmatic excursion, alveolar ventilation V_A = (V_T − V_D) × f, vagal heart-rate modulation during slow exhalation, and post-exercise heart-rate recovery.',
      modernComparisonHi: 'आधुनिक शरीर विज्ञान कंकाल पेशी भार, डायाफ्रामिक गति, कूपिका संवातन V_A = (V_T − V_D) × f और व्यायाम के बाद हृदय गति पुनर्प्राप्ति जैसे मापनीय चरों का अध्ययन करता है।',
      comparisonRows: [
        { dimension: 'Breathing Mechanism', historical: 'Prāṇāyāma experiential breath pacing', modern: 'Diaphragm/intercostal pressure gradients & alveolar gas exchange (S1)' },
        { dimension: 'Postural Hold', historical: 'Sthira–sukham āsanam stability concept', modern: 'Isometric muscle recruitment, joint torque, proprioception (S1)' },
        { dimension: 'Subtle Anatomy', historical: 'Nāḍīs & Cakras contemplative symbolism (P1)', modern: 'Somatic & autonomic nervous pathways; no physical chakras' }
      ],
      keyFigures: ['Patañjali (Yoga Sūtras)', 'Svātmārāma (Haṭhapradīpikā)', 'Modern Exercise & Respiratory Physiologists'],
      limitations: 'Classroom simulators use purely mathematical physiological models—never uncontrolled student medical measurements.'
    },
    {
      id: 'E',
      code: 'METALLURGY',
      icon: '⚒',
      title: 'Indian Metallurgy',
      titleHi: 'भारतीय धातुकर्म विज्ञान',
      subtitle: 'Wootz Crucible Steel, Delhi Iron Pillar & Redox Corrosion Science',
      subtitleHi: 'वूट्ज़ क्रूसिबल इस्पात, दिल्ली का लौह स्तंभ और संक्षारण रसायन',
      classTags: ['IX (ix5, ix7)', 'X (ch1, ch3)'],
      vigyanAtlasLinks: ['ix5', 'ix7', 'ch1', 'ch3'],
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      guardrail: 'Explain the Delhi Iron Pillar scientifically via high-phosphorus passive films and low-humidity environment—never as "magical rust-proof iron".',
      guardrailHi: 'दिल्ली के लौह स्तंभ की संक्षारण-रोधी क्षमता को फॉस्फोरस की निष्क्रिय परत और शुष्क जलवायु से समझाएं—इसे "चमत्कारी जंग-रहित लोहा" न कहें।',
      historicalOverview: 'South Indian crucible craftsmen produced ultra-high-carbon Wootz (Ukku) steel prized for tough banded Damascus blades. In North India, Gupta-era blacksmiths forge-welded the ~7.2 m Mehrauli Iron Pillar (~98% wrought iron with ~0.25% phosphorus and slag inclusions).',
      historicalOverviewHi: 'दक्षिण भारतीय कारीगरों ने उच्च-कार्बन वूट्ज़ (उक्कु) क्रूसिबल इस्पात बनाया, जबकि गुप्तकालीन लोहारों ने लगभग 7.2 मीटर ऊँचे महरौली लौह स्तंभ (~0.25% फॉस्फोरस युक्त पिटवाँ लोहा) का निर्माण किया।',
      modernComparison: 'Electrochemistry explains rusting as an anodic–cathodic redox reaction requiring both O₂ and H₂O. Materials characterization shows that phosphorus in the Delhi Pillar catalyzes a protective crystalline iron-hydrogen-phosphate hydrate passive barrier, slowing oxidation in Delhi’s semi-arid climate.',
      modernComparisonHi: 'विद्युत-रसायन में जंग लगना O₂ और H₂O की उपस्थिति में रेडॉक्स प्रक्रिया है। आधुनिक विश्लेषण दर्शाता है कि दिल्ली स्तंभ के फॉस्फोरस से एक सुरक्षात्मक फॉस्फेट निष्क्रिय परत बनती है।',
      comparisonRows: [
        { dimension: 'Iron Pillar Survival', historical: 'Monumental forge-welded wrought iron (~4th–5th c. CE, H2)', modern: 'High-P (~0.25%) passive misawite/phosphate film slows redox in dry air (S1)' },
        { dimension: 'Wootz Steel Pattern', historical: 'Sealed crucible carburization & slow cooling (H2)', modern: 'Banded Fe₃C cementite microstructure influenced by trace elements (S1)' },
        { dimension: 'Corrosion Limit', historical: 'Durable in dry inland monuments', modern: 'Still oxidizes if exposed to marine chloride salts or strong acids' }
      ],
      keyFigures: ['Deccan & South Indian Ukku Smelters', 'Gupta-era Ironworkers (Mehrauli)', 'Modern Archaeometallurgists (e.g., IIT Kanpur studies)'],
      limitations: 'High-phosphorus wrought iron becomes brittle under cold impact and is unsuitable for modern structural steel beams; modern stainless steels use chromium passive films instead.'
    },
    {
      id: 'F',
      code: 'DISTILLATION',
      icon: '⚗',
      title: 'Traditional Chemistry & Distillation',
      titleHi: 'पारंपरिक रसायन और आसवन विज्ञान',
      subtitle: 'Tiryakpātana Yantra, Deg–Bhapka & Modern Mixture Separation',
      subtitleHi: 'तिर्यक्पातन यंत्र, देग-भपका और आधुनिक मिश्रण पृथक्करण',
      classTags: ['IX (ix5, PRAC)', 'X (ch2)'],
      vigyanAtlasLinks: ['ix5', 'ch2'],
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      guardrail: 'STRICT SAFETY RULE: Aqueous salt-water and non-hazardous floral hydro-distillation models ONLY. Zero alcohol production, zero toxic solvents, zero mercury/arsenic.',
      guardrailHi: 'कठोर सुरक्षा नियम: केवल सुरक्षित लवणीय जल और पुष्प जल-वाष्प आसवन मॉडल। अल्कोहल निर्माण, पारा या विषैले विलायक पूर्णतः वर्जित हैं।',
      historicalOverview: 'Rasashastra texts described the Tiryakpātana Yantra (inclined lateral distillation) and Pātana Yantras for vaporizing and condensing substances. Artisan traditions like Kannauj’s copper Deg–Bhapka still practice water-steam hydro-distillation of floral petals.',
      historicalOverviewHi: 'रसशास्त्र ग्रंथों में वाष्पीकरण व संघनन के लिए तिर्यक्पातन और पातन यंत्रों का वर्णन है। कन्नौज की देग-भपका विधि आज भी पुष्प जल-वाष्प आसवन में प्रयुक्त होती है।',
      modernComparison: 'CBSE Class IX separation science explains these practices rigorously through boiling-point differences, latent heat of vaporization, vapor pressure, Liebig water-jacket condensation, crystallization, and paper chromatography.',
      modernComparisonHi: 'सीबीएसई कक्षा 9 का पृथक्करण विज्ञान इन्हें क्वथनांक अंतर, वाष्पीकरण की गुप्त ऊष्मा, लीबिग संघनित्र, क्रिस्टलीकरण और क्रोमैटोग्राफी द्वारा समझाता है।',
      comparisonRows: [
        { dimension: 'Condenser Design', historical: 'Bamboo/copper chonga tube into water-cooled receiver', modern: 'Borosilicate Liebig counter-current water condenser' },
        { dimension: 'Temperature Control', historical: 'Wood/charcoal hearth judged qualitatively', modern: 'Thermometer-monitored boiling plateau & controlled heating' },
        { dimension: 'Elemental Theory', historical: 'Mixed practical apparatus with alchemical transmutation hopes (U1)', modern: 'Atomic number & phase-equilibrium chemistry strictly distinguish elements from mixtures (S1)' }
      ],
      keyFigures: ['Rasaratna Samuccaya compilers', 'Kannauj Hydro-distillation Artisans', 'Modern Analytical Chemists'],
      limitations: 'Simple distillation cannot separate mixtures with nearly identical boiling points or azeotropes; alchemical claims of turning base metals into gold are scientifically false.'
    },
    {
      id: 'G',
      code: 'ASTRONOMY',
      icon: '🔭',
      title: 'Indian Astronomy',
      titleHi: 'भारतीय खगोल विज्ञान',
      subtitle: 'Āryabhaṭa’s Earth Rotation, Eclipse Shadows & Jantar Mantar Gnomons',
      subtitleHi: 'आर्यभट का पृथ्वी घूर्णन, ग्रहण छाया सिद्धांत और जंतर मंतर धूपघड़ी',
      classTags: ['IX (ix8, ix9)', 'X (ch9, ch10)'],
      vigyanAtlasLinks: ['ix8', 'ix9', 'ch9', 'ch10'],
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      guardrail: 'Keep observational astronomy (eclipses, orbital timekeeping, sundials) strictly separate from predictive astrology (Phalita Jyotiṣa), which is non-scientific.',
      guardrailHi: 'प्रेक्षणात्मक खगोल विज्ञान (ग्रहण, काल-गणना, धूपघड़ी) को फलित ज्योतिष से पूरी तरह अलग रखें—फलित ज्योतिष विज्ञान नहीं है।',
      historicalOverview: 'In 499 CE, Āryabhaṭa proposed that Earth rotates eastward on its axis and explained lunar and solar eclipses geometrically as shadows of Earth and the Moon. Later observatories built by Sawai Jai Singh II (Jantar Mantar) scaled stone equinoctial sundials (Samrat Yantra) to track solar altitude and local apparent solar time.',
      historicalOverviewHi: '499 ई. में आर्यभट ने पृथ्वी के अक्षीय घूर्णन का प्रस्ताव रखा और ग्रहणों को पृथ्वी व चंद्रमा की छाया से समझाया। सवाई जयसिंह द्वितीय के जंतर मंतर यंत्रों ने सूर्य की स्थिति व समय मापा।',
      modernComparison: 'Modern astrophysics confirms Earth’s rotation via Foucault pendulums and satellites, models elliptical Keplerian–Newtonian orbits, and computes solar shadow angles identically via spherical trigonometry: sin α = sin φ sin δ + cos φ cos δ cos H.',
      modernComparisonHi: 'आधुनिक खगोल भौतिकी फूको पेंडुलम व उपग्रहों से घूर्णन की पुष्टि करती है और गोलाकार त्रिकोणमिति sin α = sin φ sin δ + cos φ cos δ cos H से सौर छाया कोण की गणना करती है।',
      comparisonRows: [
        { dimension: 'Cause of Eclipses', historical: 'Āryabhaṭa: Earth & Moon shadow geometry (H1)', modern: 'Exact umbra/penumbra orbital mechanics (S1)' },
        { dimension: 'Timekeeping', historical: 'Gnomon (Śaṅku) & Samrat Yantra local solar time (H2)', modern: 'Atomic UTC/IST clocks + Equation of Time correction (S1)' },
        { dimension: 'Astrology vs Astronomy', historical: 'Calendar calculation vs predictive horoscopes', modern: 'Astronomy = verified physical science; Astrology = non-scientific (U1)' }
      ],
      keyFigures: ['Āryabhaṭa I (499 CE)', 'Brahmagupta (628 CE)', 'Bhāskara II', 'Sawai Jai Singh II (Jantar Mantar, 1724–37)'],
      limitations: 'Classical Siddhāntas retained geocentric planetary epicycles; modern heliocentric/relativistic celestial mechanics is required for spacecraft navigation.'
    },
    {
      id: 'H',
      code: 'ECOLOGY',
      icon: '🌱',
      title: 'Traditional Ecological Knowledge',
      titleHi: 'पारंपरिक पारिस्थितिक ज्ञान',
      subtitle: 'Watershed Harvesting, Sacred Groves & Contextual Case Studies (Jharkhand & Santhal Pargana)',
      subtitleHi: 'जल संचयन, पवित्र उपवन और संदर्भ-आधारित अध्ययन (झारखंड एवं संताल परगना)',
      classTags: ['IX (ix4, ix8)', 'X (ch13)'],
      vigyanAtlasLinks: ['ix4', 'ix8', 'ch13'],
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      guardrail: 'CONTEXTUAL GUARDRAIL: Never assume any traditional ecological practice is universally effective. Evaluate strictly by local slope, soil permeability, rainfall, and governance.',
      guardrailHi: 'संदर्भ नियम: किसी भी पारंपरिक पारिस्थितिक विधि को हर स्थान के लिए सार्वभौमिक रूप से प्रभावी न मानें—इसे स्थानीय ढलान, मिट्टी और वर्षा के संदर्भ में परखें।',
      historicalOverview: 'Across eastern India—especially Jharkhand’s Chota Nagpur plateau and Santhal Pargana—agrarian and indigenous communities developed runoff-capture systems (Ahar–Pyne diversion embankments, Dobha farm ponds) and community-protected Sal/Mahua sacred groves (Sarna / Jaher Than) alongside rainwater Kunds and Johads in arid/semi-arid regions.',
      historicalOverviewHi: 'पूर्वी भारत—विशेषतः झारखंड के छोटानागपुर पठार और संताल परगना—में कृषक व आदिवासी समुदायों ने वर्षा-जल संचयन (आहार-पइन, डोभा तालाब) और साल-महुआ आधारित पवित्र उपवन (सरना / जाहेर थान) विकसित किए।',
      modernComparison: 'Hydrological water-balance modeling (P = Q + ET + I + ΔS) shows why Dobha ponds and contour bunds curb monsoon erosion on sloping lateritic red soils in Jharkhand, and ecological surveys confirm Sarna groves preserve native seed banks—yet performance fails if unmaintained, silted, or misapplied on steep/hyper-arid terrain.',
      modernComparisonHi: 'जल-संतुलन मॉडल (P = Q + ET + I + ΔS) दर्शाता है कि झारखंड की लाल लैटेराइट मिट्टी और ढलान पर डोभा व मेड़बंदी अपवाह घटाते हैं, और सरना उपवन देशी जैव विविधता बचाते हैं—परंतु इनकी सफलता स्थानीय भूगोल व रखरखाव पर निर्भर है।',
      regionalContext: {
        region: 'Jharkhand & Santhal Pargana (Chota Nagpur Plateau)',
        examples: [
          'Dobha (small farm ponds) & contour trenches reducing monsoon sheet runoff on undulating red/lateritic soils',
          'Ahar–Pyne gravity-fed diversion channels in transition valleys of Bihar–Jharkhand',
          'Sarna / Jaher Than sacred groves protecting Sal (Shorea robusta), Mahua, and understory biodiversity'
        ],
        failureConditions: 'High evaporation losses in unshaded shallow pits during peak summer, siltation without desilting, or rapid seepage on fractured bedrock.'
      },
      comparisonRows: [
        { dimension: 'Monsoon Capture', historical: 'Ahar–Pyne & Jharkhand Dobha ponds (T1)', modern: 'Measured runoff reduction & groundwater recharge balance (S1/D1)' },
        { dimension: 'Forest Stewardship', historical: 'Sarna / Jaher Than cultural sanctuaries (T1)', modern: 'Biodiversity richness & edge-effect fragmentation monitoring (S1)' },
        { dimension: 'Generalizability', historical: 'Locally adapted to plateau/valley topography', modern: 'Strictly site-specific; requires slope, soil & climate evaluation' }
      ],
      keyFigures: ['Indigenous & Agrarian Communities of Jharkhand & Santhal Pargana', 'Watershed Hydrologists & Forest Ecologists'],
      limitations: 'Local ponds cannot replace regional river-basin planning during severe multi-year droughts or industrial water contamination.'
    }
  ];

  function getAllDomains() {
    return DOMAINS.slice();
  }

  function getDomainById(id) {
    for (var i = 0; i < DOMAINS.length; i++) {
      if (DOMAINS[i].id === id) return DOMAINS[i];
    }
    return null;
  }

  function getGlossary() {
    return GLOSSARY.slice();
  }

  return {
    DOMAINS: DOMAINS,
    GLOSSARY: GLOSSARY,
    getAllDomains: getAllDomains,
    getDomainById: getDomainById,
    getGlossary: getGlossary
  };
});
