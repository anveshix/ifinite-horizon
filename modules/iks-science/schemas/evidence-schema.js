(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.VA_IKS_SCHEMA = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var INSUFFICIENCY_NOTICE = 'Evidence insufficient to establish this claim as a scientifically verified fact.';
  var INSUFFICIENCY_NOTICE_HI = 'इस दावे को वैज्ञानिक रूप से सिद्ध तथ्य के रूप में स्थापित करने के लिए प्रमाण अपर्याप्त हैं।';
  var PENDING_REF_LABEL = 'Reference verification pending';

  var EVIDENCE_CLASSES = {
    H1: {
      code: 'H1',
      label: 'Historically Documented Textual Evidence',
      labelHi: 'ऐतिहासिक रूप से प्रलेखित ग्रंथ प्रमाण',
      isScientificFact: false,
      requiresInsufficiencyNotice: false,
      color: '#bd6e3b'
    },
    H2: {
      code: 'H2',
      label: 'Archaeological / Artifact Evidence',
      labelHi: 'पुरातत्व / भौतिक कलाकृति प्रमाण',
      isScientificFact: false,
      requiresInsufficiencyNotice: false,
      color: '#a36a2c'
    },
    P1: {
      code: 'P1',
      label: 'Philosophical / Conceptual Framework',
      labelHi: 'दार्शनिक / वैचारिक ढाँचा',
      isScientificFact: false,
      requiresInsufficiencyNotice: true,
      color: '#6b5b95'
    },
    T1: {
      code: 'T1',
      label: 'Traditional Practical Knowledge',
      labelHi: 'पारंपरिक व्यावहारिक ज्ञान',
      isScientificFact: false,
      requiresInsufficiencyNotice: false,
      color: '#2e7d6b'
    },
    S1: {
      code: 'S1',
      label: 'Experimentally Verified Modern Scientific Fact',
      labelHi: 'प्रयोगात्मक रूप से सिद्ध आधुनिक वैज्ञानिक तथ्य',
      isScientificFact: true,
      requiresInsufficiencyNotice: false,
      color: '#1b6ca8'
    },
    S2: {
      code: 'S2',
      label: 'Ongoing Scientific Investigation',
      labelHi: 'प्रगतिशील वैज्ञानिक अनुसंधान',
      isScientificFact: false,
      requiresInsufficiencyNotice: false,
      color: '#2b7a78'
    },
    D1: {
      code: 'D1',
      label: 'Debated / Context-Dependent Claim',
      labelHi: 'विवादित / संदर्भ-आधारित दावा',
      isScientificFact: false,
      requiresInsufficiencyNotice: true,
      color: '#b07b28'
    },
    U1: {
      code: 'U1',
      label: 'Unverified / Mythological / Non-Scientific Claim',
      labelHi: 'अप्रमाणित / पौराणिक / गैर-वैज्ञानिक दावा',
      isScientificFact: false,
      requiresInsufficiencyNotice: true,
      color: '#a94442'
    }
  };

  var SCOPE_LABELS = [
    'CBSE Prescribed Content',
    'CBSE Curriculum-linked Enrichment',
    'IKS Historical Enrichment',
    'Independent Research Activity',
    'Teacher Extension Material'
  ];

  var ACTIVITY_TYPES = {
    A: { code: 'A', label: 'Real laboratory experiment', labelHi: 'वास्तविक प्रयोगशाला प्रयोग' },
    B: { code: 'B', label: 'Interactive mathematical model', labelHi: 'संवादात्मक गणितीय मॉडल' },
    C: { code: 'C', label: 'Simulated experiment', labelHi: 'अनुरूपित (सिम्युलेटेड) प्रयोग' },
    D: { code: 'D', label: 'Historical reconstruction', labelHi: 'ऐतिहासिक पुनर्निर्माण' },
    E: { code: 'E', label: 'Demonstration model', labelHi: 'प्रदर्शन मॉडल' }
  };

  var REQUIRED_EVIDENCE_FIELDS = [
    'claimId',
    'claimTitle',
    'originalClaim',
    'historicalPeriod',
    'originalSource',
    'sourceLanguage',
    'attributedAuthor',
    'historicalInterpretation',
    'modernScientificComparison',
    'evidenceClass',
    'supportingReferences',
    'conflictingInterpretations',
    'limitations',
    'lastVerificationDate',
    'reviewerStatus'
  ];

  var REQUIRED_EXPERIMENT_FIELDS = [
    'experimentId',
    'title',
    'classAndSubject',
    'learningObjective',
    'historicalConnection',
    'scientificConcept',
    'researchQuestion',
    'hypothesis',
    'independentVariable',
    'dependentVariable',
    'controlledVariables',
    'materials',
    'safetyRequirements',
    'teacherSupervision',
    'procedure',
    'observationTableColumns',
    'dataCollectionSchema',
    'graphConfig',
    'scientificInterpretation',
    'conclusion',
    'sourcesOfError',
    'limitations',
    'reflectionQuestions',
    'assessmentRubric',
    'activityType'
  ];

  function isNonEmptyString(v) {
    return typeof v === 'string' && v.trim().length > 0;
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function validateEvidenceRecord(record) {
    var errors = [];
    if (!record || typeof record !== 'object') {
      return { valid: false, errors: ['Record must be an object'] };
    }
    REQUIRED_EVIDENCE_FIELDS.forEach(function (field) {
      var val = record[field];
      if (field === 'supportingReferences') {
        if (!Array.isArray(val) || val.length === 0) {
          errors.push('Missing or empty supportingReferences');
        }
      } else if (!isNonEmptyString(val)) {
        errors.push('Missing or empty field: ' + field);
      }
    });
    if (!EVIDENCE_CLASSES[record.evidenceClass]) {
      errors.push('Invalid evidenceClass: ' + record.evidenceClass);
    }
    var meta = EVIDENCE_CLASSES[record.evidenceClass];
    if (meta && meta.requiresInsufficiencyNotice && !isNonEmptyString(record.scientificSufficiencyNote)) {
      errors.push('Claims classified as ' + record.evidenceClass + ' must include scientificSufficiencyNote');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(record.lastVerificationDate || ''))) {
      errors.push('lastVerificationDate must be YYYY-MM-DD');
    }
    return { valid: errors.length === 0, errors: errors };
  }

  function validateExperimentRecord(exp) {
    var errors = [];
    if (!exp || typeof exp !== 'object') {
      return { valid: false, errors: ['Experiment must be an object'] };
    }
    REQUIRED_EXPERIMENT_FIELDS.forEach(function (field) {
      var val = exp[field];
      if (Array.isArray(val)) {
        if (val.length === 0) errors.push('Empty array field: ' + field);
      } else if (typeof val === 'object' && val !== null) {
        if (Object.keys(val).length === 0) errors.push('Empty object field: ' + field);
      } else if (!isNonEmptyString(val)) {
        errors.push('Missing or empty field: ' + field);
      }
    });
    if (!ACTIVITY_TYPES[exp.activityType]) {
      errors.push('Invalid activityType: ' + exp.activityType);
    }
    if (exp.domainId === 'F') {
      var joined = JSON.stringify(exp).toLowerCase();
      var banned = ['ethanol production', 'ferment alcohol', 'distill alcohol', 'methanol', 'benzene', 'chloroform'];
      banned.forEach(function (term) {
        if (joined.indexOf(term) !== -1) {
          errors.push('Unsafe chemical reference detected in Domain F: ' + term);
        }
      });
    }
    return { valid: errors.length === 0, errors: errors };
  }

  function validateCurriculumRecord(item) {
    var errors = [];
    if (!item || typeof item !== 'object') {
      return { valid: false, errors: ['Curriculum record must be an object'] };
    }
    if (item.classLevel !== 'IX' && item.classLevel !== 'X') {
      errors.push('classLevel must be IX or X');
    }
    if (!isNonEmptyString(item.curriculumSession)) {
      errors.push('Missing curriculumSession');
    }
    if (SCOPE_LABELS.indexOf(item.scopeLabel) === -1) {
      errors.push('Invalid scopeLabel: ' + item.scopeLabel);
    }
    if (item.scopeLabel !== 'CBSE Prescribed Content' && item.isCompulsoryBoardContent !== false) {
      errors.push('Enrichment items must explicitly set isCompulsoryBoardContent = false');
    }
    if (!isNonEmptyString(item.subject) || !isNonEmptyString(item.chapterId) || !isNonEmptyString(item.learningOutcome)) {
      errors.push('Missing subject, chapterId, or learningOutcome');
    }
    return { valid: errors.length === 0, errors: errors };
  }

  function validateAssessmentItem(item) {
    var errors = [];
    if (!item || typeof item !== 'object') {
      return { valid: false, errors: ['Assessment item must be an object'] };
    }
    var req = ['id', 'domainId', 'classLevel', 'competency', 'question', 'questionHi', 'options', 'correctIndex', 'rationale', 'rationaleHi', 'scopeLabel'];
    req.forEach(function (k) {
      if (k === 'options') {
        if (!Array.isArray(item.options) || item.options.length < 3) errors.push('options must have >= 3 choices');
      } else if (k === 'correctIndex') {
        if (typeof item.correctIndex !== 'number' || item.correctIndex < 0 || !Array.isArray(item.options) || item.correctIndex >= item.options.length) {
          errors.push('Invalid correctIndex');
        }
      } else if (!isNonEmptyString(item[k])) {
        errors.push('Missing field: ' + k);
      }
    });
    if (SCOPE_LABELS.indexOf(item.scopeLabel) === -1) {
      errors.push('Invalid scopeLabel in assessment: ' + item.scopeLabel);
    }
    return { valid: errors.length === 0, errors: errors };
  }

  return {
    INSUFFICIENCY_NOTICE: INSUFFICIENCY_NOTICE,
    INSUFFICIENCY_NOTICE_HI: INSUFFICIENCY_NOTICE_HI,
    PENDING_REF_LABEL: PENDING_REF_LABEL,
    EVIDENCE_CLASSES: EVIDENCE_CLASSES,
    SCOPE_LABELS: SCOPE_LABELS,
    ACTIVITY_TYPES: ACTIVITY_TYPES,
    REQUIRED_EVIDENCE_FIELDS: REQUIRED_EVIDENCE_FIELDS,
    REQUIRED_EXPERIMENT_FIELDS: REQUIRED_EXPERIMENT_FIELDS,
    escapeHtml: escapeHtml,
    validateEvidenceRecord: validateEvidenceRecord,
    validateExperimentRecord: validateExperimentRecord,
    validateCurriculumRecord: validateCurriculumRecord,
    validateAssessmentItem: validateAssessmentItem
  };
});
