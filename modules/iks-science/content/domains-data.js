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
      historicalOverview: 'Acharya Kaṇāda’s Vaiśeṣika Sūtra proposed a systematic natural philosophy in which macroscopic substances arise from eternal, indivisible Paramanus combining first into dyads (Dvyaṇuka) and triads (Tryaṇuka). In addition, authentic Vaiśeṣika Sūtras (1.1.11, 5.1.7, 5.1.8, 5.1.17) articulate qualitative motion, gravity (gurutva), impulse (nodana), and persistence (saṁskāra/vega).',
      historicalOverviewHi: 'आचार्य कणाद के वैशेषिक सूत्र ने शाश्वत, अविभाज्य परमाणुओं के द्व्यणुक और त्र्यणुक संयोजन के साथ-साथ प्रामाणिक सूत्रों (1.1.11, 5.1.7, 5.1.8, 5.1.17) में गति, गुरुत्व, नोदन और वेग-संस्कार के गुणात्मक सिद्धांत दिए।',
      modernComparison: 'From Dalton’s stoichiometric law (1808) to Thomson, Rutherford, Bohr, and Quantum Mechanics, modern atomic theory rests on quantitative experiments, while Newton and Euler formalized F = ma. Never equate Paramanu with the divisible atom or accept fabricated blog verses attributing F = ma or nuclear weapons to Kaṇāda.',
      modernComparisonHi: 'डाल्टन से लेकर क्वांटम यांत्रिकी तक आधुनिक परमाणु सिद्धांत मात्रात्मक प्रयोगों पर आधारित है, और न्यूटन-यूलर ने F = ma का गणितीय रूप दिया। कणाद के नाम पर प्रचलित अप्रामाणिक श्लोकों या परमाणु-बम दावों से सावधान रहें।',
      comparisonRows: [
        { dimension: 'Basis of Knowledge', historical: 'Philosophical inference & qualitative dynamics (VS 1.1.11, 5.1.7–17)', modern: 'Quantitative stoichiometry, scattering, spectroscopy & Newton–Euler F = ma (S1)' },
        { dimension: 'Divisibility', historical: 'Paramanu defined as strictly indivisible', modern: 'Divisible into protons, neutrons, electrons & quarks' },
        { dimension: 'Mass & Charge', historical: 'Qualitative qualities (guṇa); no numeric mass or charge', modern: 'Measured atomic mass units, +1e / -1e charges, isotopes' },
        { dimension: 'Predictive Power', historical: 'Conceptual explanation of substance & change (authentic vs fake blog quotes)', modern: 'Predicts periodic trends, covalent/ionic bonding, nuclear reactions' }
      ],
      keyFigures: ['Acharya Kaṇāda (Vaiśeṣika Sūtra 1.1.11, 5.1.7–17)', 'John Dalton (1808)', 'J. J. Thomson (1897)', 'Ernest Rutherford (1911)', 'Niels Bohr (1913)', 'Isaac Newton & Leonhard Euler'],
      limitations: 'Vaiśeṣika texts provide no experimental apparatus, numerical atomic weights, differential equations, or subatomic structure.'
    },
    {
      id: 'B',
      code: 'MATH',
      icon: '∑',
      title: 'Indian Mathematics',
      titleHi: 'भारतीय गणित परंपरा',
      subtitle: 'Baudhāyana √2 (577/408), Piṅgala Meru Prastāra, Āryabhaṭa, Brahmagupta & Kerala School',
      subtitleHi: 'बौधायन √2 (577/408), पिंगल मेरु प्रस्तार, आर्यभट, ब्रह्मगुप्त और केरल संप्रदाय',
      classTags: ['IX (Ganita Manjari)', 'X (Zero Indian Names in Syllabus Gap)'],
      vigyanAtlasLinks: ['ix9', 'ix11', 'ch9', 'ch11'],
      scopeLabel: 'IKS Historical Enrichment',
      guardrail: 'Distinguish authentic classical math (Śulbasūtras, Piṅgala, Āryabhaṭa, Brahmagupta, Bakhshali, Kerala School) from 20th-century "16 Vedic Maths sutras" (not in Atharvaveda per TIFR Prof. S. G. Dani).',
      guardrailHi: 'प्रामाणिक प्राचीन गणित (शुल्बसूत्र, पिंगल, आर्यभट, ब्रह्मगुप्त, बख्शाली, केरल संप्रदाय) को 20वीं सदी के 16 "वैदिक गणित" सूत्रों (जो अथर्ववेद में नहीं हैं) से स्पष्ट अलग रखें।',
      historicalOverview: 'Baudhāyana Śulbasūtra (c. 800 BCE) gave √2 ≈ 577/408 ≈ 1.4142156863 (0.000150% relative error) and integer triples; Piṅgala’s Chandaḥśāstra & Halāyudha’s Mṛtasañjīvanī constructed Meru Prastāra (binomial triangle); Āryabhaṭa (499 CE) formalized ardha-jyā sine tables and π ≈ 3.1416; Brahmagupta (628 CE) gave zero/negative rules; and the Kerala School (Mādhava, Nīlakaṇṭha’s Tantrasaṅgraha) developed trigonometric series.',
      historicalOverviewHi: 'बौधायन शुल्बसूत्र ने √2 ≈ 577/408 (5 दशमलव स्थान सटीकता), पिंगल व हलायुध ने मेरु प्रस्तार, आर्यभट ने अर्ध-ज्या व π ≈ 3.1416, ब्रह्मगुप्त ने शून्य नियम तथा केरल संप्रदाय ने त्रिकोणमितीय श्रेणियाँ विकसित कीं।',
      modernComparison: 'Modern mathematics verifies the Heron/Newton–Raphson equivalence of Baudhāyana’s strip iteration, proves π and √2 irrational, revises Brahmagupta’s 0 ÷ 0 = 0 to undefined, and separates genuine historical treatises from 20th-century arithmetic tricks.',
      modernComparisonHi: 'आधुनिक गणित बौधायन सूत्र की पुनरावर्ती सटीकता की पुष्टि करता है, π और √2 की अपरिमेयता सिद्ध करता है, 0 ÷ 0 को अपरिभाषित मानता है और 20वीं सदी की शॉर्टकट युक्तियों को प्राचीन वेदों से अलग रखता है।',
      comparisonRows: [
        { dimension: 'Baudhāyana √2 & Triples', historical: '577/408 ≈ 1.4142156863 (error 2.12×10⁻⁶) + (5,12,13), (8,15,17)', modern: 'Iterative Heron/Newton–Raphson match; formal √2 irrationality proof' },
        { dimension: 'Combinatorics & Series', historical: 'Piṅgala–Halāyudha Meru Prastāra; Mādhava–Nīlakaṇṭha π & trig series', modern: 'Binomial C(n,k), Taylor/Gregory–Leibniz series & calculus rigor' },
        { dimension: 'Zero & 20th-c. Myth Check', historical: 'Brahmagupta (628 CE) +,−,× with 0; 16 Vedic Sutras = 20th-c. creation (Dani/Shukla)', modern: 'Field axioms (a ÷ 0 undefined); authentic IKS math ≠ 20th-c. shortcuts' }
      ],
      keyFigures: ['Baudhāyana (c. 800 BCE)', 'Piṅgala & Halāyudha', 'Āryabhaṭa I (499 CE)', 'Brahmagupta (628 CE)', 'Mādhava & Nīlakaṇṭha Somayājī'],
      limitations: 'Śulbasūtras do not preserve written derivations of 577/408; 16 "Vedic Maths" sutras are modern 20th-century pedagogy rather than ancient Vedic texts.'
    },
    {
      id: 'C',
      code: 'MEDICAL',
      icon: '⚕',
      title: 'Ayurveda & Medical History',
      titleHi: 'आयुर्वेद और चिकित्सा इतिहास',
      subtitle: 'Suśruta’s 121 Instruments, Indian Flap Rhinoplasty & EBM Pharmacology',
      subtitleHi: 'सुश्रुत के 121 शल्य उपकरण, राइनोप्लास्टी फ्लैप और साक्ष्य-आधारित औषध विज्ञान',
      classTags: ['IX (ix1, ix2, ix3, ix4)', 'X (ch2, ch5, ch6)'],
      vigyanAtlasLinks: ['ix1', 'ix2', 'ix3', 'ix4', 'ch5'],
      scopeLabel: 'Independent Research Activity',
      guardrail: 'Educational history only: NEVER provide medical diagnoses, prescribe remedies, or overclaim immunological equivalence without RCT evidence.',
      guardrailHi: 'केवल शैक्षिक इतिहास: कभी भी चिकित्सीय निदान या उपचार न सुझाएं, और बिना RCT प्रमाण के आधुनिक प्रतिरक्षाविज्ञान से समतुल्यता का अतिरंजित दावा न करें।',
      historicalOverview: 'Suśruta Saṃhitā (c. 600 BCE; oldest palm-leaf MS 878 CE Kathmandu) documented 121 standardized surgical instruments (101 blunt yantras across 6 classes + 20 hair-splitting sharp śastras), Aṣṭavidha Śastrakarma (8 surgical acts), Trividha Karma care, heat-sanitization, simulation training on gourds/leather bags, 7 skin layers, cadaver dissection, and cheek/forehead rhinoplasty (witnessed in Pune 1793 by Findlay & Cruso).',
      historicalOverviewHi: 'सुश्रुत संहिता (लगभग 600 ई.पू.; प्राचीनतम पांडुलिपि 878 ई. काठमांडू) में 121 शल्य उपकरण (101 कुंद यंत्र + 20 तीक्ष्ण शस्त्र), अष्टविध शस्त्रकर्म, विसंक्रमण, लौकी/चमड़े पर सिमुलेशन प्रशिक्षण, त्वचा की 7 परतें और 1793 की पुणे राइनोप्लास्टी का प्रामाणिक इतिहास है।',
      modernComparison: 'Modern Evidence-Based Medicine validates pedicled skin flaps while advancing germ theory, autoclaving, anesthesia, and RCTs. Note: Suśruta counted 300 bones (including cartilages and tooth sockets) vs modern 206; Caraka’s historical preventive framework has no standardized RCT-equivalent molecular dataset here.',
      modernComparisonHi: 'आधुनिक चिकित्सा जीवित ऊतक-फ्लैप की पुष्टि करते हुए रोगाणु सिद्धांत, एनेस्थीसिया और RCT जोड़ती है। सुश्रुत की 300 अस्थि-गणना में उपास्थि व दंत-कोटर भी शामिल थे (आधुनिक 206 की तुलना में)।',
      comparisonRows: [
        { dimension: 'Surgical Tools & Training', historical: '101 yantras + 20 śastras, heated tools, gourd/leather simulation (H1)', modern: 'Stainless alloys, autoclave sterilization, germ theory, surgical simulators' },
        { dimension: 'Anatomy & Reconstruction', historical: '7 skin layers, 300 bones (incl. cartilage/sockets), 1793 Pune Flap (H1)', modern: 'Histology, 206 ossified adult bones, modern plastic surgery' },
        { dimension: 'Medicinal Plants & Immunity', historical: 'Charaka preventive traditions & empirical botanical materia medica (T1)', modern: 'Isolated bioactives tested for bioavailability, dose & human RCTs (S2)' }
      ],
      keyFigures: ['Suśruta (Suśruta Saṃhitā, c. 600 BCE)', 'Charaka (Charaka Saṃhitā)', 'James Findlay & Thomas Cruso (1793 Pune report)'],
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
      historicalOverview: 'South Indian crucible craftsmen (Tamil Nadu South Arcot, Karnataka Gulbarga) produced ultra-high-carbon Wootz (1–2% C, superplastic behavior) steel. In Mehrauli, Chandragupta II-era ironworkers (c. 375–415 CE) forge-welded horizontally without lime flux the 7.21 m Iron Pillar (~0.25% P wrought iron). At Zawar (Rajasthan), closed-retort downward distillation condensed metallic zinc vapor (~907 °C boiling point).',
      historicalOverviewHi: 'दक्षिण भारत (तमिलनाडु/कर्नाटक) में 1–2% कार्बन युक्त वूट्ज़ इस्पात, दिल्ली के महरौली में चंद्रगुप्त द्वितीय काल (375–415 ई.) का बिना चूना-फ्लक्स 7.21 मी. लौह स्तंभ (~0.25% P) और राजस्थान के जावर में बंद रिटॉर्ट जस्ता आसवन विकसित हुआ।',
      modernComparison: 'Prof. R. Balasubramaniam (IIT Kanpur, FTIR & Mössbauer spectroscopy) showed that moisture + phosphorus forms phosphoric acid (2H₃PO₄ + Fe → Fe(H₂PO₄)₂ + H₂), precipitating FeHPO₄ and Fe₃(PO₄)₂ and building an amorphous/nanocrystalline δ-FeOOH (misawite) and phosphate passive film. IISc studies (Sharada Srinivasan & S. Ranganathan) clarified Wootz carbide banding.',
      modernComparisonHi: 'IIT कानपुर के प्रो. आर. बालसुब्रमण्यम (FTIR/मॉसबाउर विश्लेषण) ने सिद्ध किया कि 2H₃PO₄ + Fe → Fe(H₂PO₄)₂ + H₂ से FeHPO₄/Fe₃(PO₄)₂ तथा δ-FeOOH (मिसावाइट) की सघन निष्क्रिय परत बनती है। IISc अध्ययनों ने वूट्ज़ की सुपर-प्लास्टिक संरचना स्पष्ट की।',
      comparisonRows: [
        { dimension: 'Iron Pillar Chemistry', historical: '7.21 m (1.12 m underground) horizontal forge-welded wrought iron (~375–415 CE, H2)', modern: '2H₃PO₄ + Fe → Fe(H₂PO₄)₂ + H₂ → δ-FeOOH Misawite + phosphate passive film (S1)' },
        { dimension: 'Wootz & Zawar Zinc', historical: '1–2% C crucible steel (IISc) + Zawar closed-retort zinc distillation (H2)', modern: 'Fe₃C banded superplasticity; oxygen-free condensation of 907 °C Zn vapor (S1)' },
        { dimension: 'Corrosion Limit', historical: 'Durable in dry inland monuments (non-evaluative box in CBSE Ch.3)', modern: 'Still oxidizes if exposed to marine chloride salts or strong acids' }
      ],
      keyFigures: ['Gupta-era Ironworkers (Mehrauli)', 'Prof. R. Balasubramaniam (IIT Kanpur)', 'Prof. Sharada Srinivasan & S. Ranganathan (IISc)', 'Zawar Zinc Metallurgists'],
      limitations: 'High-phosphorus wrought iron becomes brittle under cold impact; Zawar earliest-phase dates rely on secondary/archaeometallurgical summaries pending primary trench papers.'
    },
    {
      id: 'F',
      code: 'DISTILLATION',
      icon: '⚗',
      title: 'Traditional Chemistry & Distillation',
      titleHi: 'पारंपरिक रसायन और आसवन विज्ञान',
      subtitle: 'Rasashala Pātana Yantras (Ūrdhva, Adhaḥ, Tiryak), Deg–Bhapka & Modern Separation',
      subtitleHi: 'रसशाला के पातन यंत्र (ऊर्ध्व, अधः, तिर्यक्), देग-भपका और आधुनिक पृथक्करण',
      classTags: ['IX (ix5, PRAC)', 'X (ch2)'],
      vigyanAtlasLinks: ['ix5', 'ch2'],
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      guardrail: 'STRICT SAFETY RULE: Aqueous salt-water and non-hazardous floral hydro-distillation models ONLY. Zero alcohol production, zero toxic solvents, zero mercury/cinnabar in school labs.',
      guardrailHi: 'कठोर सुरक्षा नियम: केवल सुरक्षित लवणीय जल और पुष्प जल-वाष्प आसवन मॉडल। अल्कोहल निर्माण, पारा (हिंगुल) या विषैले विलायक स्कूल प्रयोगों में पूर्णतः वर्जित हैं।',
      historicalOverview: 'Rasaratna Samuccaya, Rasārṇava, and Rasendracūḍāmaṇi (c. 9th–14th c. CE; Rasashala model at National Science Centre, Delhi) classified directional vapor apparatuses: Ūrdhvapātana (upward sublimation), Adhaḥpātana (downward vapor condensation), Tiryakpātana (lateral inclined tube distillation), Dolā Yantra (steam-bath), and Ḍamaru Yantra—alongside Kannauj’s copper Deg–Bhapka floral hydro-distillation.',
      historicalOverviewHi: 'रसरत्नसमुच्चय, रसार्णव व रसेंद्रचूड़ामणि (राष्ट्रीय विज्ञान केंद्र, दिल्ली में मॉडल) में ऊर्ध्वपातन, अधःपातन, तिर्यक्पातन, दोला व डमरू यंत्र तथा कन्नौज की देग-भपका जल-वाष्प आसवन विधि का वर्णन है।',
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
      subtitle: 'Āryabhaṭa’s Axial Rotation, Eclipse Shadows, Jantar Mantar & Temple Acoustics (Hampi/Madurai)',
      subtitleHi: 'आर्यभट का घूर्णन, ग्रहण छाया, जंतर मंतर और मंदिर स्तंभ ध्वनिकी (हम्पी/मदुरै)',
      classTags: ['IX (ix8, ix9, ix12 Sound)', 'X (ch9, ch10)'],
      vigyanAtlasLinks: ['ix8', 'ix9', 'ix12', 'ch9', 'ch10'],
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      guardrail: 'Keep observational astronomy (eclipses, orbital timekeeping, sundials) and architectural acoustics strictly separate from predictive astrology (Phalita Jyotiṣa), which is non-scientific.',
      guardrailHi: 'प्रेक्षणात्मक खगोल विज्ञान और स्थापत्य ध्वनिकी को फलित ज्योतिष से पूरी तरह अलग रखें—फलित ज्योतिष विज्ञान नहीं है।',
      historicalOverview: 'In 499 CE, Āryabhaṭa proposed Earth’s eastward axial sidereal rotation and explained eclipses geometrically via Earth/Moon shadows, while Sawai Jai Singh II’s Jantar Mantar scaled stone equinoctial sundials (Samrat Yantra). Separately in architectural acoustics—absent from CBSE Class IX Sound Waves (ix12)—carved granite pillars at Hampi’s Viṭṭhala Temple and Madurai act as tuned flexural resonators alongside the 22 Śrutis of Indian musicology.',
      historicalOverviewHi: '499 ई. में आर्यभट ने पृथ्वी के अक्षीय घूर्णन व ग्रहण-छाया सिद्धांत दिए और जंतर मंतर ने सौर कोण मापे। कक्षा 9 ध्वनि तरंग अध्याय (ix12) से अनुपस्थित हम्पी व मदुरै के ग्रेनाइट संगीत स्तंभ तथा 22 श्रुतियाँ स्थापत्य ध्वनिकी के प्रामाणिक उदाहरण हैं।',
      modernComparison: 'Modern astrophysics confirms axial rotation via Foucault pendulums and satellites, computes gnomon shadows via sin α = sin φ sin δ + cos φ cos δ cos H, and analyzes Hampi/Madurai musical pillar harmonics via beam-resonance physics (f ∝ √(EI/ρA)/L²).',
      modernComparisonHi: 'आधुनिक भौतिकी फूको पेंडुलम व गोलाकार त्रिकोणमिति से खगोलीय मानों की पुष्टि करती है तथा ग्रेनाइट स्तंभों के स्वर को यांत्रिक अनुनाद आवृत्ति (f ∝ √(EI/ρA)/L²) से समझाती है।',
      comparisonRows: [
        { dimension: 'Cause of Eclipses', historical: 'Āryabhaṭa: Earth & Moon shadow geometry (H1)', modern: 'Exact umbra/penumbra orbital mechanics (S1)' },
        { dimension: 'Timekeeping & Acoustics', historical: 'Samrat Yantra gnomons + Hampi/Madurai musical pillars & 22 Śrutis (H2)', modern: 'Spherical astronomy + Euler–Bernoulli stone beam resonance modes (S1)' },
        { dimension: 'Astrology vs Astronomy', historical: 'Calendar calculation vs predictive horoscopes', modern: 'Astronomy = verified physical science; Astrology = non-scientific (U1)' }
      ],
      keyFigures: ['Āryabhaṭa I (499 CE)', 'Brahmagupta (628 CE)', 'Sawai Jai Singh II (1724–37)', 'Vijayanagara & Madurai Temple Artisans'],
      limitations: 'Classical Siddhāntas retained geocentric epicycles; critical scholarship also debates modern over-interpretations of Sūrya Siddhānta constants.'
    },
    {
      id: 'H',
      code: 'ECOLOGY',
      icon: '🌱',
      title: 'Traditional Ecological Knowledge',
      titleHi: 'पारंपरिक पारिस्थितिक ज्ञान',
      subtitle: 'Watershed Harvesting, Sacred Groves (Jharkhand & Santhal Pargana) & Surapāla’s Vṛkṣāyurveda',
      subtitleHi: 'जल संचयन, पवित्र उपवन (झारखंड व संताल परगना) और सुरपाल का वृक्षायुर्वेद',
      classTags: ['IX (ix4, ix8)', 'X (ch13)'],
      vigyanAtlasLinks: ['ix4', 'ix8', 'ch13'],
      scopeLabel: 'CBSE Curriculum-linked Enrichment',
      guardrail: 'CONTEXTUAL GUARDRAIL: Never assume any traditional ecological practice is universally effective. Evaluate strictly by local slope, soil permeability, rainfall, and governance.',
      guardrailHi: 'संदर्भ नियम: किसी भी पारंपरिक पारिस्थितिक विधि को हर स्थान के लिए सार्वभौमिक रूप से प्रभावी न मानें—इसे स्थानीय ढलान, मिट्टी और वर्षा के संदर्भ में परखें।',
      historicalOverview: 'Across eastern India—especially Jharkhand’s Chota Nagpur plateau and Santhal Pargana—communities developed Ahar–Pyne channels, Dobha farm ponds, and Sal/Mahua sacred groves (Sarna / Jaher Than). Earlier in Eastern India (c. 1000 CE), Surapāla’s Vṛkṣāyurveda documented plant-health practices and Kuṇapajala fermented organic bio-fertilizer—topics absent since Class IX omitted agriculture and Class X dropped Sustainable Management of Natural Resources from board exams.',
      historicalOverviewHi: 'झारखंड के छोटानागपुर पठार व संताल परगना में आहार-पइन, डोभा तालाब और सरना/जाहेर थान पवित्र उपवन विकसित हुए। पूर्वी भारत में लगभग 1000 ई. में सुरपाल के वृक्षायुर्वेद ने कुणपजल जैविक सूत्रण का वर्णन किया—जो वर्तमान बोर्ड पाठ्यक्रम से बाहर है।',
      modernComparison: 'Hydrological water-balance modeling (P = Q + ET + I + ΔS) shows why Dobha ponds and contour bunds curb monsoon erosion on sloping lateritic red soils in Jharkhand, ecological surveys confirm Sarna groves preserve native seed banks, and agronomic studies analyze Kuṇapajala nutrient mineralization—yet all depend strictly on local slope, soil, climate, and hygiene.',
      modernComparisonHi: 'जल-संतुलन मॉडल (P = Q + ET + I + ΔS) डोभा और सरना की स्थानीय उपयोगिता दर्शाता है, तथा कृषि अनुसंधान कुणपजल के पोषक तत्वों का विश्लेषण करता है—परंतु सभी विधियाँ स्थानीय भूगोल व रखरखाव पर निर्भर हैं।',
      regionalContext: {
        region: 'Jharkhand & Santhal Pargana (Chota Nagpur Plateau) + Eastern India Agro-Ecology',
        examples: [
          'Dobha (small farm ponds) & contour trenches reducing monsoon sheet runoff on undulating red/lateritic soils',
          'Ahar–Pyne gravity-fed diversion channels in transition valleys of Bihar–Jharkhand',
          'Sarna / Jaher Than sacred groves protecting Sal (Shorea robusta), Mahua, and understory biodiversity',
          'Surapāla’s Vṛkṣāyurveda (c. 1000 CE, Eastern India) Kuṇapajala organic fermentation context'
        ],
        failureConditions: 'High evaporation losses in unshaded shallow pits during peak summer, siltation without desilting, rapid seepage on fractured bedrock, or batch variability in uncalibrated organic manures.'
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
