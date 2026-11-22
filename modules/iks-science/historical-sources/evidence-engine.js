(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../schemas/evidence-schema'));
  } else {
    root.VA_IKS_EVIDENCE = factory(root.VA_IKS_SCHEMA);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (SCHEMA) {
  'use strict';

  var INSUFF = SCHEMA.INSUFFICIENCY_NOTICE;
  var PENDING = SCHEMA.PENDING_REF_LABEL;

  var CLAIMS = [
    // DOMAIN A: ANCIENT INDIAN ATOMIC THOUGHT
    {
      claimId: 'IKS-A-01',
      domainId: 'A',
      claimTitle: 'Vaisheshika Concept of Paramanu (Indivisible Ultimate Particle)',
      claimTitleHi: 'वैशेषिक दर्शन में परमाणु की अवधारणा',
      originalClaim: 'Matter is composed of ultimate, eternal, indivisible particles (Paramanu) that combine in dyads (Dvyanuka) and triads (Tryanuka) to form perceptible substances.',
      historicalPeriod: 'c. 6th–2nd century BCE (dating debated across scholarship)',
      originalSource: 'Vaiśeṣika Sūtra (with later commentaries such as Praśastapāda Bhāṣya)',
      sourceLanguage: 'Sanskrit',
      attributedAuthor: 'Acharya Kaṇāda (Kaśyapa)',
      historicalInterpretation: 'A systematic metaphysical and logical taxonomy of substance (Dravya), quality (Guṇa), and motion (Karma) explaining physical variety through combinations of eternal Paramanus.',
      modernScientificComparison: 'Modern atomic theory (Dalton 1808, Thomson 1897, Rutherford 1911, Bohr 1913, Quantum Mechanics) is grounded in quantitative stoichiometry, cathode-ray measurements, alpha scattering, spectroscopy, and subatomic particles (protons, neutrons, electrons).',
      evidenceClass: 'P1',
      scientificSufficiencyNote: INSUFF + ' Paramanu is a philosophical-metaphysical postulate and must not be equated with the modern experimentally characterized, divisible atom.',
      supportingReferences: [
        'NCERT Class IX Science (ix6 LO reference to Acharya Kanad)',
        'Vaiśeṣika Sūtra primary philosophical tradition (exact critical-edition verse numbering: ' + PENDING + ')'
      ],
      conflictingInterpretations: 'Scholars debate the exact chronology of the Vaiśeṣika Sūtra and whether Kaṇāda held Paramanu to be dimensionless or possessing minimal spherical extension (parimaṇḍala).',
      limitations: 'Contains no quantitative mass ratios, experimental apparatus, subatomic structure, or testable electromagnetic/quantum predictions.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Historical-Philosophical Distinction'
    },
    {
      claimId: 'IKS-A-02',
      domainId: 'A',
      claimTitle: 'Modern Experimental Characterization of the Atom & Subatomic Structure',
      claimTitleHi: 'परमाणु और उप-परमाण्विक संरचना का आधुनिक प्रायोगिक प्रमाण',
      originalClaim: 'Atoms consist of a dense, positively charged nucleus (protons and neutrons) surrounded by quantized electron distributions; chemical behaviour arises from valence electrons.',
      historicalPeriod: '1808–1932 CE (Dalton to Chadwick) and ongoing quantum electrodynamics',
      originalSource: 'Peer-reviewed experimental physics and chemistry (Dalton, Thomson, Rutherford, Bohr, Schrödinger, Chadwick)',
      sourceLanguage: 'English / German / French (scientific literature)',
      attributedAuthor: 'Multiple experimental & theoretical physicists',
      historicalInterpretation: 'Not applicable (modern empirical scientific framework).',
      modernScientificComparison: 'Directly verified through mass spectrometry, X-ray diffraction, atomic force/scanning tunneling microscopy, and particle scattering.',
      evidenceClass: 'S1',
      supportingReferences: [
        'CBSE Class IX Science (ix6 Structure of an Atom; ix7 Atoms and Molecules)',
        'CBSE Class X Science (ch3 Metals & Non-metals; ch4 Carbon & its Compounds)'
      ],
      conflictingInterpretations: 'Quantum interpretations differ philosophically (Copenhagen vs Many-Worlds), while experimental atomic observables remain reproducibly verified.',
      limitations: 'Classical Bohr orbits are simplified pedagogical approximations of 3D quantum probability orbitals.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified CBSE Scientific Fact'
    },
    {
      claimId: 'IKS-A-03',
      domainId: 'A',
      claimTitle: 'Claim that Ancient Texts Contained Modern Nuclear or Quantum Physics Equations',
      claimTitleHi: 'प्राचीन ग्रंथों में आधुनिक नाभिकीय या क्वांटम समीकरण होने का दावा',
      originalClaim: 'Popular assertions that ancient philosophical sutras explicitly describe quarks, nuclear fission, or Schrödinger wave equations.',
      historicalPeriod: 'Modern anachronistic reinterpretations (20th–21st century)',
      originalSource: 'Secondary popular interpretations (no primary mathematical/experimental source)',
      sourceLanguage: 'Modern vernacular / English',
      attributedAuthor: 'Unattributed secondary commentators',
      historicalInterpretation: 'Retrospective projection of modern scientific terminology onto broad philosophical metaphors.',
      modernScientificComparison: 'Modern nuclear and quantum physics require differential calculus, Planck constant measurements, and particle-accelerator evidence absent from ancient texts.',
      evidenceClass: 'U1',
      scientificSufficiencyNote: INSUFF,
      supportingReferences: [
        'Standard historiography of Indian science & philosophical atomism (' + PENDING + ')'
      ],
      conflictingInterpretations: 'Consensus historians of science distinguish authentic philosophical atomism (Paramanu) from anachronistic modern physics claims.',
      limitations: 'No mathematical derivations or experimental evidence exist in classical Vaiśeṣika texts for subatomic particles.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Rejected Anachronism — Guardrail Enforced'
    },

    // DOMAIN B: INDIAN MATHEMATICS
    {
      claimId: 'IKS-B-01',
      domainId: 'B',
      claimTitle: 'Brahmagupta’s Rules for Zero (Śūnya) and Negative Numbers',
      claimTitleHi: 'शून्य और ऋणात्मक संख्याओं के लिए ब्रह्मगुप्त के नियम',
      originalClaim: 'Explicit arithmetic rules for addition, subtraction, and multiplication involving zero (śūnya) and positive/negative quantities (dhana/ṛṇa).',
      historicalPeriod: '628 CE',
      originalSource: 'Brāhmasphuṭasiddhānta (Chapter 18, Kuṭṭaka / Algebra)',
      sourceLanguage: 'Sanskrit',
      attributedAuthor: 'Brahmagupta',
      historicalInterpretation: 'Treated zero as a full-fledged number subject to algebraic operations rather than merely a placeholder, and formalized negative numbers as debts.',
      modernScientificComparison: 'Modern algebra retains Brahmagupta’s rules for addition, subtraction, and multiplication with zero and negative integers; division by zero (0/0 or a/0) is today defined as undefined rather than Brahmagupta’s ambiguous 0/0 = 0.',
      evidenceClass: 'H1',
      supportingReferences: [
        'Brāhmasphuṭasiddhānta (628 CE), critical mathematical historiography',
        'Gwalior Chaturbhuj Temple inscription (876 CE) & Bakhshali manuscript radiocarbon scholarship (' + PENDING + ')'
      ],
      conflictingInterpretations: 'Modern mathematics rejects Brahmagupta’s statement that 0 ÷ 0 = 0 and treats division by zero as undefined in arithmetic/calculus.',
      limitations: 'Symbolic algebraic notation evolved gradually; early Sanskrit prose/verse used verbal abbreviations.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Historical Mathematics'
    },
    {
      claimId: 'IKS-B-02',
      domainId: 'B',
      claimTitle: 'Āryabhaṭa’s Place-Value Decimal System & Approximation of π',
      claimTitleHi: 'आर्यभट की दशमलव स्थान-मान प्रणाली और π का सन्निकट मान',
      originalClaim: 'Decimal place-value arithmetic ("sthānāt sthānaṁ daśaguṇaṁ syāt"), sine tables (ardha-jyā), and a close rational approximation of π (62832/20000 = 3.1416).',
      historicalPeriod: '499 CE',
      originalSource: 'Āryabhaṭīya (Gaṇitapāda)',
      sourceLanguage: 'Sanskrit',
      attributedAuthor: 'Āryabhaṭa I',
      historicalInterpretation: 'Provided concise versified rules for square/cube roots, mensuration, trigonometry using half-chords, and astronomy.',
      modernScientificComparison: '3.1416 matches π ≈ 3.14159265... to four decimal places; Āryabhaṭa explicitly called this value āsanna (approximate), anticipating later proofs of irrationality.',
      evidenceClass: 'H1',
      supportingReferences: [
        'Āryabhaṭīya (499 CE), Gaṇitapāda',
        'Transmission of Hindu-Arabic numerals via Al-Khwārizmī (9th century CE)'
      ],
      conflictingInterpretations: 'Minor scholarly debate continues on whether "āsanna" meant practical approximation or implied non-terminating/irrational nature.',
      limitations: 'Did not prove the irrationality or transcendence of π (proven in 18th–19th century Europe).',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Historical Mathematics'
    },
    {
      claimId: 'IKS-B-03',
      domainId: 'B',
      claimTitle: 'Baudhāyana Śulbasūtra Diagonal-of-Rectangle Geometric Relation',
      claimTitleHi: 'बौधायन शुल्बसूत्र में आयत के विकर्ण का ज्यामितीय संबंध',
      originalClaim: 'The diagonal (akṣṇayā-rajju) of a rectangle produces both the areas produced separately by its length and breadth (c² = a² + b²).',
      historicalPeriod: 'c. 800–500 BCE (exact dating debated)',
      originalSource: 'Baudhāyana Śulbasūtra',
      sourceLanguage: 'Sanskrit',
      attributedAuthor: 'Baudhāyana',
      historicalInterpretation: 'Geometric construction rules using cords (śulba) for altar design, including integer triples (3,4,5; 5,12,13; 8,15,17) and a rational approximation of √2.',
      modernScientificComparison: 'Corresponds directly to the Euclidean right-triangle theorem (Pythagorean relation), proved deductively in Euclid’s Elements and verified across Euclidean geometry.',
      evidenceClass: 'H1',
      supportingReferences: [
        'Baudhāyana Śulbasūtra geometrical tradition (exact verse index: ' + PENDING + ')'
      ],
      conflictingInterpretations: 'Presented as an empirical/geometric construction rule rather than an axiomatic deductive proof in the Euclidean style.',
      limitations: 'Applies to flat (Euclidean) geometry; non-Euclidean curved spaces violate a² + b² = c².',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Historical Geometry'
    },

    // DOMAIN C: AYURVEDA AND MEDICAL HISTORY
    {
      claimId: 'IKS-C-01',
      domainId: 'C',
      claimTitle: 'Suśruta Saṃhitā Classification of Surgical Instruments & Reconstructive History',
      claimTitleHi: 'सुश्रुत संहिता में शल्य उपकरणों का वर्गीकरण और शल्य चिकित्सा इतिहास',
      originalClaim: 'Systematic documentation of blunt instruments (yantras) and sharp instruments (śastras), wound care, and reconstructive flap techniques (nasal reconstruction).',
      historicalPeriod: 'Early centuries BCE to c. 3rd–5th century CE (layered compilation)',
      originalSource: 'Suśruta Saṃhitā (Sūtrasthāna & Cikitsāsthāna)',
      sourceLanguage: 'Sanskrit',
      attributedAuthor: 'Suśruta (redacted by Nāgārjuna in later strata)',
      historicalInterpretation: 'Demonstrates early anatomical observation, surgical apprenticeship using gourds/models, and structured pre- and post-operative protocols.',
      modernScientificComparison: 'Modern surgery validates the anatomical principle of pedicled skin flaps and aseptic instrument hygiene, while introducing germ theory, sterile autoclaving, anesthesia, antibiotics, and imaging.',
      evidenceClass: 'H1',
      supportingReferences: [
        'Suśruta Saṃhitā historical surgical treatise tradition',
        '18th-century Poona nasal flap historical reports (' + PENDING + ')'
      ],
      conflictingInterpretations: 'Exact dating of individual textual layers in Suśruta Saṃhitā remains actively researched by philologists.',
      limitations: 'Historical texts lack modern germ theory (microbiology), anesthesia pharmacology, and randomized surgical outcome trials. Not a manual for clinical practice.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Historical Medical Record'
    },
    {
      claimId: 'IKS-C-02',
      domainId: 'C',
      claimTitle: 'Phytochemical & Clinical Evidence Status of Traditional Medicinal Plants (e.g., Curcuma longa / Azadirachta indica)',
      claimTitleHi: 'पारंपरिक औषधीय पौधों (हल्दी/नीम) का फाइटोकेमिकल और नैदानिक प्रमाण स्तर',
      originalClaim: 'Traditional texts record topical and dietary uses of turmeric (Haridrā), neem (Nimba), and tulsi for skin hygiene, inflammation, and digestive discomfort.',
      historicalPeriod: 'Classical Ayurveda (Charaka/Suśruta) through modern ethnobotany',
      originalSource: 'Charaka Saṃhitā / Suśruta Saṃhitā materia medica & modern pharmacognosy',
      sourceLanguage: 'Sanskrit / English (clinical trials)',
      attributedAuthor: 'Classical compilers & modern pharmacological researchers',
      historicalInterpretation: 'Empirical botanical classification based on taste (rasa), potency (vīrya), and observed symptomatic patterns.',
      modernScientificComparison: 'Modern chemistry isolates bioactive molecules (e.g., curcuminoids, azadirachtin, eugenol). In vitro antimicrobial or anti-inflammatory activity does NOT automatically prove human clinical efficacy due to bioavailability, dosing, and safety limits.',
      evidenceClass: 'S2',
      supportingReferences: [
        'CBSE Class IX Biology (ix4 Diversity) & Class X (ch5 Life Processes) botanical/microbial context',
        'Evidence-Based Medicine (EBM) RCT standards (' + PENDING + ')'
      ],
      conflictingInterpretations: 'Many laboratory (petri-dish) plant extract effects fail to translate into standardized human clinical trial efficacy without formulation/dosing verification.',
      limitations: 'Students must NOT treat historical botanical notes as medical prescriptions or self-medication guidance.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified EBM Boundary'
    },
    {
      claimId: 'IKS-C-03',
      domainId: 'C',
      claimTitle: 'Tridoṣa (Vāta–Pitta–Kapha) Diagnostic System as a Biomedical Equivalent',
      claimTitleHi: 'त्रिदोष (वात-पित्त-कफ) प्रणाली की आधुनिक बायोमेडिकल समतुल्यता का दावा',
      originalClaim: 'Claims that the classical Tridoṣa constitutional framework directly maps onto modern molecular pathology or replaces evidence-based clinical diagnostics.',
      historicalPeriod: 'Classical Ayurvedic theory',
      originalSource: 'Charaka Saṃhitā (conceptual physiology)',
      sourceLanguage: 'Sanskrit',
      attributedAuthor: 'Charaka / Ātreya school',
      historicalInterpretation: 'A holistic humoral/functional conceptual model used historically to organize diet, environment, and symptom clusters.',
      modernScientificComparison: 'Modern medicine diagnoses disease via cellular pathology, microbiology, biochemistry, and controlled clinical trials; Tridoṣa is a historical conceptual framework, not an experimentally validated physiological mechanism.',
      evidenceClass: 'P1',
      scientificSufficiencyNote: INSUFF + ' Do not present traditional diagnostic systems or treatments as clinically validated without randomized controlled clinical trial evidence.',
      supportingReferences: [
        'Charaka Saṃhitā conceptual framework (' + PENDING + ')'
      ],
      conflictingInterpretations: 'Ayurgenomics explores statistical correlations, but robust universal clinical diagnostic equivalence remains unproven.',
      limitations: 'No medical diagnosis or treatment advice may be derived from this historical overview.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Clinical Disclaimer'
    },

    // DOMAIN D: YOGA AND HUMAN PHYSIOLOGY
    {
      claimId: 'IKS-D-01',
      domainId: 'D',
      claimTitle: 'Physiological Mechanics of Slow Diaphragmatic Breathing & Postural Activity',
      claimTitleHi: 'धीमी डायाफ्रामिक श्वास और आसन के शारीरिक यांत्रिक प्रभाव',
      originalClaim: 'Controlled slow breathing and low-to-moderate isometric postures engage diaphragmatic excursion, skeletal muscle endurance, and autonomic heart-rate modulation.',
      historicalPeriod: 'Historical Yoga practices studied with modern physiology (20th–21st century)',
      originalSource: 'Haṭha Yoga tradition (historical postures) + Modern Respiratory/Cardiovascular Physiology',
      sourceLanguage: 'Sanskrit (historical) / English (physiology)',
      attributedAuthor: 'Classical Yoga texts & modern exercise physiologists',
      historicalInterpretation: 'Historically practiced for mental steadiness and physical discipline.',
      modernScientificComparison: 'Experimentally measured spirometry, respiratory sinus arrhythmia (vagal tone modulation during slow exhalation), and heart-rate recovery physics align with standard CBSE Class X Life Processes & Control/Coordination.',
      evidenceClass: 'S1',
      supportingReferences: [
        'CBSE Class X Science (ch5 Life Processes: respiration & circulation; ch6 Control & Coordination)',
        'CBSE Class IX Science (ix2 Tissues: muscular & nervous tissues)'
      ],
      conflictingInterpretations: 'Effect sizes vary significantly by individual fitness, breathing cadence, and study methodology.',
      limitations: 'Classroom modules use parameterized physiological models only and do not measure or store personal student health data or make clinical diagnoses.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Physiological Link'
    },
    {
      claimId: 'IKS-D-02',
      domainId: 'D',
      claimTitle: 'Historical Evolution of Patañjali’s Yoga Sūtras & Haṭha Yoga Texts',
      claimTitleHi: 'पतंजलि के योगसूत्र और हठयोग ग्रंथों का ऐतिहासिक विकास',
      originalClaim: 'Patañjali’s Yoga Sūtras systemize eight-limbed meditative ethics and stillness (āsana as steady seated posture), while later medieval Haṭha Yoga texts expand physical postures and breath-control techniques.',
      historicalPeriod: 'c. 2nd–5th century CE (Yoga Sūtras); c. 11th–17th century CE (Haṭha Yoga)',
      originalSource: 'Pātañjala Yogaśāstra; Haṭhapradīpikā (Svātmārāma)',
      sourceLanguage: 'Sanskrit',
      attributedAuthor: 'Patañjali; Svātmārāma',
      historicalInterpretation: 'Philosophical-soteriological discipline that later incorporated bodily and respiratory techniques.',
      modernScientificComparison: 'Modern sports science distinguishes historical meditative aims from biomechanical joint loading, muscle fiber recruitment, and oxygen uptake.',
      evidenceClass: 'H1',
      supportingReferences: [
        'Pātañjala Yogaśāstra & Haṭhapradīpikā textual historiography (' + PENDING + ')'
      ],
      conflictingInterpretations: 'Scholars note that modern global posture-centered yoga combines medieval Haṭha traditions with 20th-century physical culture.',
      limitations: 'Textual dating and authorship strata remain subject to philological debate.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Historical Context'
    },
    {
      claimId: 'IKS-D-03',
      domainId: 'D',
      claimTitle: 'Subtle Energy Channels (Nāḍīs) & Cakras as Physical Anatomical Structures',
      claimTitleHi: 'नाड़ी और चक्रों को भौतिक शारीरिक अंग मानने का दावा',
      originalClaim: 'Claims that subtle Prāṇa channels (iḍā, piṅgalā, suṣumnā) or cakras are physically dissectible anatomical organs equivalent to blood vessels or endocrine glands.',
      historicalPeriod: 'Tantric & Haṭha Yoga literature',
      originalSource: 'Haṭhapradīpikā & Tantric symbolic anatomy',
      sourceLanguage: 'Sanskrit',
      attributedAuthor: 'Medieval Tantric/Yogic traditions',
      historicalInterpretation: 'Experiential contemplative maps used during visualization and meditation practices.',
      modernScientificComparison: 'Human anatomical dissection, histology, and neuroimaging find nerves, blood vessels, and endocrine glands—not subtle energy cakras.',
      evidenceClass: 'P1',
      scientificSufficiencyNote: INSUFF + ' Philosophical/contemplative frameworks must be kept strictly separate from measurable anatomical and physiological facts.',
      supportingReferences: [
        'Modern human anatomy & CBSE Class IX/X nervous system curriculum'
      ],
      conflictingInterpretations: 'Contemplative traditions themselves often interpret cakras symbolically rather than literally anatomical.',
      limitations: 'Cannot be measured by physical instruments or taught as empirical human anatomy.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Philosophical–Physiological Separation'
    },

    // DOMAIN E: INDIAN METALLURGY
    {
      claimId: 'IKS-E-01',
      domainId: 'E',
      claimTitle: 'Iron Pillar of Delhi: High-Phosphorus Passive Protective Film',
      claimTitleHi: 'दिल्ली का लौह स्तंभ: उच्च फॉस्फोरस और निष्क्रिय सुरक्षात्मक परत',
      originalClaim: 'The ~7.2-metre Gupta-era forged wrought iron pillar in Mehrauli exhibits remarkable resistance to atmospheric rusting due to its phosphorus content (~0.25%), low sulfur/manganese, slag inclusions, and dry Delhi climate.',
      historicalPeriod: 'c. 4th–5th century CE (Gupta period inscription)',
      originalSource: 'Physical archaeological artifact (Mehrauli, New Delhi) & metallurgical X-ray/spectroscopic studies',
      sourceLanguage: 'Sanskrit (Brāhmī inscription) / English (materials science)',
      attributedAuthor: 'Gupta-era blacksmiths; modern materials characterization (e.g., Balasubramaniam, IIT Kanpur)',
      historicalInterpretation: 'Demonstrates advanced solid-state forge welding of bloomery wrought iron on a massive monumental scale.',
      modernScientificComparison: 'Materials science confirms a thin crystalline iron-hydrogen-phosphate hydrate (misawite-rich) passive barrier forms via phosphorus reaction at the metal-oxide interface, slowing electrochemical oxidation (Fe → Fe²⁺ + 2e⁻).',
      evidenceClass: 'H2',
      supportingReferences: [
        'Archaeological artifact: Iron Pillar of Mehrauli (Gupta Brāhmī inscription)',
        'CBSE Class X Science (ch1 Corrosion; ch3 Metals & Non-metals: prevent rusting)',
        'IIT Kanpur materials characterization studies (' + PENDING + ')'
      ],
      conflictingInterpretations: 'Relative contribution of climate vs passive phosphate film vs initial slag coating is quantified differently across surface samples.',
      limitations: 'It is NOT "rust-proof" in absolute terms: a thin protective oxide-phosphate patina exists and would corrode rapidly in acidic or marine salt-spray conditions.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Archaeological + Materials Science'
    },
    {
      claimId: 'IKS-E-02',
      domainId: 'E',
      claimTitle: 'Wootz (Ukku) Crucible High-Carbon Steel Production',
      claimTitleHi: 'वूट्ज़ (उक्कु) क्रूसिबल उच्च-कार्बन इस्पात निर्माण',
      originalClaim: 'Historical South Indian crucible smelting produced ultra-high-carbon steel (~1.2–1.8% C) with characteristic iron carbide (Fe₃C cementite) banding prized across Eurasia for Damascus blades.',
      historicalPeriod: 'c. 3rd century BCE – 18th century CE (archaeological sites in Telangana/Karnataka/Tamil Nadu)',
      originalSource: 'Crucible slag mounds (e.g., Konasamudram, Kodumanal, Gatihosahalli) & historical European/Arab accounts',
      sourceLanguage: 'Tamil/Kannada/Telugu ("ukku") & English/Arabic metallurgical records',
      attributedAuthor: 'Historical Deccan & South Indian iron-smelting communities',
      historicalInterpretation: 'Sealed clay crucibles carburized wrought iron with organic carbon sources in forced-draft furnaces, followed by slow cooling and low-temperature forging.',
      modernScientificComparison: 'Modern metallography (SEM/XRD) explains the watered surface pattern via micro-segregation of carbide-forming trace elements (such as vanadium/molybdenum) creating banded Fe₃C spheroidized networks.',
      evidenceClass: 'H2',
      supportingReferences: [
        'Archaeometallurgical crucible excavations in South India (' + PENDING + ')',
        'CBSE Class X Science (ch3 Metals & Non-metals: carbon reduction & alloys)'
      ],
      conflictingInterpretations: 'Variations existed across regional workshops in carbon percentage and cooling profiles.',
      limitations: 'Specific lost workshop recipes varied regionally; trace impurity levels depended heavily on local iron ore.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Archaeometallurgy'
    },
    {
      claimId: 'IKS-E-03',
      domainId: 'E',
      claimTitle: 'Electrochemical Mechanism of Iron Rusting & Alloy Protection',
      claimTitleHi: 'लोहे में जंग लगने की विद्युत-रासायनिक प्रक्रिया और मिश्रधातु सुरक्षा',
      originalClaim: 'Rusting of iron requires both oxygen and water, proceeding via anodic iron oxidation and cathodic oxygen reduction; alloying, galvanization, or passive films retard this redox cell.',
      historicalPeriod: 'Modern electrochemistry & materials science',
      originalSource: 'Standard experimental electrochemistry',
      sourceLanguage: 'English (chemical sciences)',
      attributedAuthor: 'Modern materials scientists',
      historicalInterpretation: 'Not applicable (empirical modern science).',
      modernScientificComparison: 'Directly verified in school and research laboratories via controlled moisture, oxygen, salt electrolyte, and pH experiments.',
      evidenceClass: 'S1',
      supportingReferences: [
        'CBSE Class X Science (ch1 redox & corrosion; ch3 Metals & Non-metals: reactivity & corrosion prevention)'
      ],
      conflictingInterpretations: 'None on core redox mechanism.',
      limitations: 'Quantitative rates depend on temperature, electrolyte conductivity, and surface microstructure.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified CBSE Scientific Fact'
    },

    // DOMAIN F: TRADITIONAL CHEMISTRY AND DISTILLATION
    {
      claimId: 'IKS-F-01',
      domainId: 'F',
      claimTitle: 'Tiryakpātana Yantra & Hydro-Distillation (Deg–Bhapka) Apparatus',
      claimTitleHi: 'तिर्यक्पातन यंत्र और जल-वाष्प आसवन (देग-भपका) उपकरण',
      originalClaim: 'Classical Rasashastra texts describe inclined/lateral distillation (Tiryakpātana Yantra) using connected earthen/metal vessels for vapor condensation, mirrored in traditional water-steam floral hydro-distillation (Deg–Bhapka).',
      historicalPeriod: 'c. 8th–14th century CE (Rasashastra texts) & ongoing Kannauj traditional steam attar craft',
      originalSource: 'Rasārṇava / Rasaratna Samuccaya (Yantra chapters) & documented artisan hydro-distillation',
      sourceLanguage: 'Sanskrit / Hindi',
      attributedAuthor: 'Rasashastra compilers; traditional perfumery artisans',
      historicalInterpretation: 'Demonstrates practical mastery of vaporization, vapor transport through a bamboo/copper condenser tube (chonga), and condensation in water-cooled receivers.',
      modernScientificComparison: 'Operates on the exact physical laws of phase change (liquid → vapor → liquid), latent heat of vaporization, and boiling-point separation covered in CBSE Class IX Mixture Separation.',
      evidenceClass: 'H1',
      supportingReferences: [
        'Rasaratna Samuccaya apparatus descriptions (' + PENDING + ')',
        'CBSE Class IX Science (ix5 Exploring Mixtures and their Separation; PRAC Separation)'
      ],
      conflictingInterpretations: 'Medieval texts blended empirical laboratory apparatus with alchemical/mercurial goals that modern chemistry rejects.',
      limitations: 'School demonstrations must use strictly water, saline water, or non-hazardous floral steam models—never mercury, alcohol production, or flammable solvents.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Historical Apparatus + Safe Scope'
    },
    {
      claimId: 'IKS-F-02',
      domainId: 'F',
      claimTitle: 'Evaporation, Simple Distillation & Chromatography Separation Principles',
      claimTitleHi: 'वाष्पीकरण, सरल आसवन और क्रोमैटोग्राफी पृथक्करण सिद्धांत',
      originalClaim: 'Miscible liquids with sufficient boiling-point differences separate by distillation, dissolved solids by evaporation/crystallization, and soluble pigments by paper chromatography.',
      historicalPeriod: 'Modern physical & analytical chemistry',
      originalSource: 'Experimental separation science',
      sourceLanguage: 'English / Hindi (NCERT)',
      attributedAuthor: 'Modern chemists',
      historicalInterpretation: 'Not applicable (empirical modern science).',
      modernScientificComparison: 'Directly verified in Class IX practical laboratories using thermometers, Liebig condensers, and chromatography paper.',
      evidenceClass: 'S1',
      supportingReferences: [
        'CBSE Class IX Science (ix5 Exploring Mixtures and their Separation; PRAC)'
      ],
      conflictingInterpretations: 'None.',
      limitations: 'Azeotropic mixtures cannot be completely separated by simple distillation alone.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified CBSE Scientific Fact'
    },
    {
      claimId: 'IKS-F-03',
      domainId: 'F',
      claimTitle: 'Alchemical Transmutation of Base Metals into Gold (Rasavāda)',
      claimTitleHi: 'रसवाद द्वारा सामान्य धातुओं को सोने में बदलने का दावा',
      originalClaim: 'Classical alchemical assertions that chemical heating of mercury and herbs transmutes copper or lead into elemental gold.',
      historicalPeriod: 'Medieval Rasavāda literature',
      originalSource: 'Alchemical Rasashastra traditions',
      sourceLanguage: 'Sanskrit',
      attributedAuthor: 'Medieval alchemists',
      historicalInterpretation: 'Produced brass/amalgam surface colourations (golden appearance) mistaken conceptually for elemental transmutation before atomic number was discovered.',
      modernScientificComparison: 'Elemental identity is determined by nuclear proton count (Z = 29 Cu vs Z = 79 Au); chemical reactions rearrange valence electrons only and cannot transmute elements.',
      evidenceClass: 'U1',
      scientificSufficiencyNote: INSUFF + ' Chemical processes cannot alter atomic nuclei; elemental transmutation occurs only in high-energy nuclear reactions.',
      supportingReferences: [
        'CBSE Class IX Science (ix6 Structure of an Atom — atomic number defines element)'
      ],
      conflictingInterpretations: 'Modern chemistry completely refutes chemical transmutation.',
      limitations: 'Historical mercury/arsenic preparations are highly toxic and strictly prohibited in school labs.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Scientific Refutation & Safety Rule'
    },

    // DOMAIN G: INDIAN ASTRONOMY
    {
      claimId: 'IKS-G-01',
      domainId: 'G',
      claimTitle: 'Āryabhaṭa’s Axial Rotation of Earth & Shadow Model of Eclipses',
      claimTitleHi: 'आर्यभट का पृथ्वी के अक्षीय घूर्णन और ग्रहण-छाया का सिद्धांत',
      originalClaim: 'Apparent westward motion of fixed stars arises from Earth rotating eastward on its own axis (like a person in a moving boat seeing stationary trees move backward); eclipses are caused by the shadow of the Earth and Moon.',
      historicalPeriod: '499 CE',
      originalSource: 'Āryabhaṭīya (Golapāda)',
      sourceLanguage: 'Sanskrit',
      attributedAuthor: 'Āryabhaṭa I',
      historicalInterpretation: 'Replaced mythological eclipse explanations (Rāhu–Ketu) with geometric shadow mechanics and identified Earth’s diurnal rotation.',
      modernScientificComparison: 'Confirmed by Foucault pendulum, Coriolis deflections, spaceflight imagery, and exact orbital ephemerides of solar/lunar eclipses.',
      evidenceClass: 'H1',
      supportingReferences: [
        'Āryabhaṭīya (499 CE), Golapāda',
        'CBSE Class IX (ix8 Earth as a System; ix9 Motion) & Class X (ch9 Light)'
      ],
      conflictingInterpretations: 'Later commentators such as Brahmagupta initially criticized Earth’s rotation on everyday intuition, highlighting healthy historical scientific debate.',
      limitations: 'Āryabhaṭa used geocentric epicycles for planetary orbits; heliocentric elliptical mechanics came later (Kepler/Newton).',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Historical Astronomy'
    },
    {
      claimId: 'IKS-G-02',
      domainId: 'G',
      claimTitle: 'Jantar Mantar Masonry Instruments (Samrat Yantra Equinoctial Sundial)',
      claimTitleHi: 'जंतर मंतर के पाषाण यंत्र (सम्राट यंत्र विषुव धूपघड़ी)',
      originalClaim: 'Large-scale masonry gnomons tilted parallel to Earth’s rotational axis (altitude = local latitude) cast solar shadows to measure local solar time and solar declination.',
      historicalPeriod: '1724–1737 CE',
      originalSource: 'Astronomical observatories at Delhi, Jaipur, Ujjain, Varanasi (and Zij-i-Muhammad Shahi)',
      sourceLanguage: 'Sanskrit / Persian / Hindi',
      attributedAuthor: 'Maharaja Sawai Jai Singh II & observatory astronomers',
      historicalInterpretation: 'Scaled up traditional brass astrolabes/gnomons into rigid stone masonry to reduce graduation error for naked-eye positional astronomy.',
      modernScientificComparison: 'Mathematically identical to modern spherical solar trigonometry (sin α = sin φ sin δ + cos φ cos δ cos H) and equinoctial sundial geometry.',
      evidenceClass: 'H2',
      supportingReferences: [
        'Archaeological observatories (Jaipur UNESCO heritage / New Delhi Jantar Mantar)',
        'CBSE Class IX Science (ix8 Earth as a System)'
      ],
      conflictingInterpretations: 'Masonry instruments lacked telescopic magnification, limiting precision compared to contemporary European refracting telescopes.',
      limitations: 'Sundials measure local apparent solar time; Equation of Time and longitude corrections are needed to convert to Indian Standard Time (IST).',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Astronomical Artifact'
    },
    {
      claimId: 'IKS-G-03',
      domainId: 'G',
      claimTitle: 'Predictive Astrology (Phalita Jyotiṣa) vs Observational Astronomy (Gaṇita Jyotiṣa)',
      claimTitleHi: 'फलित ज्योतिष बनाम गणितीय खगोल विज्ञान (स्पष्ट भेद)',
      originalClaim: 'Claims that planetary positions at birth causally determine individual human fortune or future personal events.',
      historicalPeriod: 'Historical & contemporary popular belief',
      originalSource: 'Predictive astrological traditions (distinct from mathematical Siddhānta astronomy)',
      sourceLanguage: 'Sanskrit / regional languages',
      attributedAuthor: 'Traditional astrological texts',
      historicalInterpretation: 'Cultural divinatory tradition that historically shared calendar computation tools with astronomy.',
      modernScientificComparison: 'Controlled double-blind scientific tests find no causal physical mechanism or predictive accuracy above chance for astrology. Astronomy is an empirical physical science; astrology is NOT.',
      evidenceClass: 'U1',
      scientificSufficiencyNote: INSUFF + ' Astronomy (orbital mechanics, eclipses, timekeeping) and astrology (predictive horoscopy) are strictly separated.',
      supportingReferences: [
        'Standard scientific methodology & astronomical consensus'
      ],
      conflictingInterpretations: 'None within empirical science.',
      limitations: 'Excluded from scientific predictions; discussed only to clarify scientific demarcation.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Astronomy–Astrology Demarcation'
    },

    // DOMAIN H: TRADITIONAL ECOLOGICAL KNOWLEDGE (INCL. JHARKHAND & SANTHAL PARGANA)
    {
      claimId: 'IKS-H-01',
      domainId: 'H',
      claimTitle: 'Ahar–Pyne & Jharkhand Dobha Traditional Runoff Harvesting Systems',
      claimTitleHi: 'आहार-पइन और झारखंड का डोभा पारंपरिक वर्षा-जल संचयन',
      originalClaim: 'In sloping plateau and alluvial transition zones of Bihar, Jharkhand, and Santhal Pargana, diversion channels (pynes), embankment reservoirs (ahars), and small farm ponds (dobhas) capture seasonal monsoon runoff for soil moisture and irrigation.',
      historicalPeriod: 'Pre-modern agrarian heritage continuing into modern watershed programs',
      originalSource: 'Documented regional agrarian hydrology & Jharkhand watershed field surveys',
      sourceLanguage: 'Hindi / Santhali / Magahi / English field documentation',
      attributedAuthor: 'Local farming communities of South Bihar, Chota Nagpur & Santhal Pargana',
      historicalInterpretation: 'Community-managed gravity-fed water harvesting adapted to undulating terrain and short intense monsoon bursts.',
      modernScientificComparison: 'Modern hydrology verifies reduced peak surface runoff, increased infiltration into weathered Chota Nagpur regolith, and higher local moisture availability—provided siltation is managed and local slope/soil permeability match design.',
      evidenceClass: 'T1',
      supportingReferences: [
        'CBSE Class IX Science (ix8 Earth as a System — traditional knowledge LO)',
        'CBSE Class X Science (ch13 Our Environment — resource conservation)',
        'Regional hydrology documentation of Jharkhand & Santhal Pargana (' + PENDING + ')'
      ],
      conflictingInterpretations: 'Effectiveness drops sharply on steep un-terraced slopes, highly fractured rock with rapid seepage, or during prolonged multi-year droughts.',
      limitations: 'Must NEVER be claimed universally effective across all climates/soils; requires site-specific watershed engineering.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Contextual Ecological Knowledge'
    },
    {
      claimId: 'IKS-H-02',
      domainId: 'H',
      claimTitle: 'Sarna / Jaher Than Sacred Groves & Biodiversity Stewardship in Jharkhand & Santhal Pargana',
      claimTitleHi: 'झारखंड और संताल परगना में सरना / जाहेर थान पवित्र उपवन और जैव विविधता संरक्षण',
      originalClaim: 'Community-protected forest patches (Sarna / Jaher Than) dominated by Sal (Shorea robusta) and Mahua act as cultural sanctuaries preserving native tree seed banks, pollinators, and understory microclimates.',
      historicalPeriod: 'Indigenous community traditions documented across Chota Nagpur & Santhal Pargana',
      originalSource: 'Ecological & ethnobotanical biodiversity surveys of Jharkhand sacred groves',
      sourceLanguage: 'Santhali / Mundari / Ho / Kurukh / Hindi / English',
      attributedAuthor: 'Indigenous communities of Jharkhand & Santhal Pargana',
      historicalInterpretation: 'Social-cultural taboos against felling live grove trees functioned as decentralized community conservation.',
      modernScientificComparison: 'Ecological biodiversity indices frequently show higher native species richness, soil organic carbon, and microclimate stability inside intact sacred groves compared to adjacent degraded scrub—though fragmented small groves remain vulnerable to edge effects and invasive weeds.',
      evidenceClass: 'T1',
      supportingReferences: [
        'CBSE Class IX Science (ix4 Diversity; ix8 Earth as a System)',
        'Vigyan Atlas Jharkhand contextual scripts (assets/va-voice-data.js)',
        'Jharkhand sacred grove ecological surveys (' + PENDING + ')'
      ],
      conflictingInterpretations: 'Ecological outcomes vary strongly with grove area, grazing pressure, and surrounding land-use fragmentation.',
      limitations: 'Cultural conservation alone cannot offset large-scale watershed deforestation or industrial pollution without broader landscape protection.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Contextual Ecology'
    },
    {
      claimId: 'IKS-H-03',
      domainId: 'H',
      claimTitle: 'Context-Dependent Boundaries of Traditional Ecological Practices',
      claimTitleHi: 'पारंपरिक पारिस्थितिक प्रणालियों की संदर्भ-निर्भर सीमाएँ',
      originalClaim: 'Evaluating whether any single traditional irrigation, cropping, or soil practice works identically across arid deserts, floodplains, and plateau watersheds.',
      historicalPeriod: 'Contemporary ecological science',
      originalSource: 'Comparative watershed hydrology & agro-ecology',
      sourceLanguage: 'English / Hindi',
      attributedAuthor: 'Modern ecologists & hydrologists',
      historicalInterpretation: 'Traditional knowledge itself evolved locally rather than as a one-size-fits-all global prescription.',
      modernScientificComparison: 'Water-balance physics (Precipitation = Runoff + Evapotranspiration + Infiltration + ΔStorage) proves that soil texture, slope, rainfall intensity, and evapotranspiration govern whether a practice succeeds or fails.',
      evidenceClass: 'D1',
      scientificSufficiencyNote: INSUFF + ' Ecological practices must be evaluated strictly within local geography, climate, soil hydrology, and social governance context.',
      supportingReferences: [
        'CBSE Class IX (ix8 Earth as a System) & Class X (ch13 Our Environment)'
      ],
      conflictingInterpretations: 'Romanticized claims of universal traditional ecological perfection conflict with empirical hydrological limits.',
      limitations: 'Requires local field data (rainfall, slope, soil permeability) before scaling to new regions.',
      lastVerificationDate: '2026-11-22',
      reviewerStatus: 'Verified Context-Dependency Guardrail'
    }
  ];

  function getAllClaims() {
    return CLAIMS.slice();
  }

  function getClaimsByDomain(domainId) {
    return CLAIMS.filter(function (c) { return c.domainId === domainId; });
  }

  function getClaimById(claimId) {
    for (var i = 0; i < CLAIMS.length; i++) {
      if (CLAIMS[i].claimId === claimId) return CLAIMS[i];
    }
    return null;
  }

  function filterClaims(opts) {
    var o = opts || {};
    return CLAIMS.filter(function (c) {
      if (o.domainId && o.domainId !== 'ALL' && c.domainId !== o.domainId) return false;
      if (o.evidenceClass && o.evidenceClass !== 'ALL' && c.evidenceClass !== o.evidenceClass) return false;
      if (o.query) {
        var q = String(o.query).toLowerCase();
        var blob = (c.claimTitle + ' ' + c.claimTitleHi + ' ' + c.originalClaim + ' ' + c.originalSource + ' ' + c.attributedAuthor).toLowerCase();
        if (blob.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function validateAllClaims() {
    var issues = [];
    CLAIMS.forEach(function (c) {
      var res = SCHEMA.validateEvidenceRecord(c);
      if (!res.valid) {
        issues.push({ claimId: c.claimId, errors: res.errors });
      }
    });
    return { valid: issues.length === 0, total: CLAIMS.length, issues: issues };
  }

  return {
    CLAIMS: CLAIMS,
    getAllClaims: getAllClaims,
    getClaimsByDomain: getClaimsByDomain,
    getClaimById: getClaimById,
    filterClaims: filterClaims,
    validateAllClaims: validateAllClaims
  };
});
