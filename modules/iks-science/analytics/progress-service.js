(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('../schemas/evidence-schema'),
      require('../content/domains-data'),
      require('../experiments/experiment-engine')
    );
  } else {
    root.VA_IKS_PROGRESS = factory(root.VA_IKS_SCHEMA, root.VA_IKS_DOMAINS, root.VA_IKS_EXPERIMENTS);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (SCHEMA, DOMAINS_MOD, EXP_MOD) {
  'use strict';

  var STORAGE_KEY = 'va.iks.v1';
  var BANNED_HEALTH_KEYS = ['heartRateBpmPersonal', 'pulseBpm', 'bloodPressure', 'weightKg', 'medicalDiagnosis', 'bmi', 'patientAge'];

  function createMemoryStore() {
    var map = {};
    return {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(map, k) ? map[k] : null; },
      setItem: function (k, v) { map[k] = String(v); },
      removeItem: function (k) { delete map[k]; }
    };
  }

  function defaultState() {
    return {
      version: 1,
      exploredDomains: [],
      verifiedClaims: [],
      experimentsRun: [],
      observations: {},
      quizAnswers: {},
      assignedTopics: [],
      lessonPlanOverrides: {},
      updatedAt: null
    };
  }

  function stripSensitiveKeys(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    BANNED_HEALTH_KEYS.forEach(function (k) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        delete obj[k];
      }
    });
    return obj;
  }

  function loadState(storage) {
    var store = storage || (typeof localStorage !== 'undefined' ? localStorage : createMemoryStore());
    try {
      var raw = store.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      var parsed = JSON.parse(raw);
      return stripSensitiveKeys(Object.assign(defaultState(), parsed));
    } catch (e) {
      return defaultState();
    }
  }

  function saveState(state, storage) {
    var store = storage || (typeof localStorage !== 'undefined' ? localStorage : createMemoryStore());
    var clean = stripSensitiveKeys(Object.assign(defaultState(), state));
    clean.updatedAt = new Date().toISOString();
    try {
      store.setItem(STORAGE_KEY, JSON.stringify(clean));
    } catch (e) { /* storage quota / private mode safe */ }
    return clean;
  }

  function markDomainExplored(state, domainId) {
    if (state.exploredDomains.indexOf(domainId) === -1) {
      state.exploredDomains.push(domainId);
    }
    return state;
  }

  function markExperimentRun(state, expId) {
    if (state.experimentsRun.indexOf(expId) === -1) {
      state.experimentsRun.push(expId);
    }
    return state;
  }

  function logObservation(state, expId, row) {
    if (!state.observations[expId]) state.observations[expId] = [];
    var safeRow = stripSensitiveKeys({
      predicted: String(row.predicted || '').slice(0, 140),
      observed: String(row.observed || '').slice(0, 200),
      ts: new Date().toISOString().slice(0, 10)
    });
    state.observations[expId].push(safeRow);
    return state;
  }

  function buildLessonPlanTemplate(domainId, classLevel) {
    var domain = DOMAINS_MOD.getDomainById(domainId) || DOMAINS_MOD.getAllDomains()[0];
    var exp = EXP_MOD.getExperimentByDomain(domain.id);
    var cls = classLevel === 'X' ? 'Class X' : 'Class IX';
    return [
      'LESSON PLAN — ' + cls + ' Science (086) · IKS × Modern Science Enrichment',
      'Topic: ' + domain.title + ' (' + domain.titleHi + ')',
      'Scope Notice: ' + domain.scopeLabel + ' (Non-compulsory board exam enrichment)',
      '',
      '1. Starter Hook (5 min): Compare historical text/artifact context with modern scientific question.',
      '2. Core Prescribed Science (15 min): ' + (exp ? exp.scientificConcept : domain.modernComparison),
      '3. Interactive / Lab Activity (15 min): ' + (exp ? ('[' + exp.experimentId + ' · Type ' + exp.activityType + '] ' + exp.title) : 'Guided evidence review'),
      '4. Guardrail & Critical Reflection (10 min): ' + domain.guardrail,
      '5. Safety Check: ' + (exp ? exp.safetyRequirements : 'Follow standard classroom safety.')
    ].join('\n');
  }

  function buildPrintableWorksheetHtml(domainId) {
    var domain = DOMAINS_MOD.getDomainById(domainId) || DOMAINS_MOD.getAllDomains()[0];
    var exp = EXP_MOD.getExperimentByDomain(domain.id);
    var esc = SCHEMA.escapeHtml;
    var actMeta = exp && SCHEMA.ACTIVITY_TYPES[exp.activityType];
    return [
      '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">',
      '<title>Worksheet — ' + esc(domain.title) + '</title>',
      '<style>body{font-family:Inter,Arial,sans-serif;max-width:780px;margin:24px auto;color:#17252a;line-height:1.5}h1,h2{color:#13252a}table{width:100%;border-collapse:collapse;margin:12px 0}th,td{border:1px solid #8fa3a0;padding:6px 8px;text-align:left;font-size:13px}.box{border:1px solid #bd6e3b;background:#fdf8f3;padding:10px 12px;border-radius:6px;margin:12px 0}@media print{button{display:none}}</style>',
      '</head><body>',
      '<button onclick="window.print()">Print / Save PDF</button>',
      '<h1>Vigyan Atlas · IKS × Modern Science Worksheet</h1>',
      '<p><strong>Domain ' + esc(domain.id) + ':</strong> ' + esc(domain.title) + ' (' + esc(domain.titleHi) + ')<br>',
      '<strong>Scope:</strong> ' + esc(domain.scopeLabel) + ' (Enrichment — Not compulsory board content)</p>',
      '<div class="box"><strong>Scientific Guardrail:</strong> ' + esc(domain.guardrail) + '</div>',
      exp ? ('<h2>' + esc(exp.experimentId) + ': ' + esc(exp.title) + '</h2>' +
        '<p><strong>Activity Type:</strong> ' + esc(exp.activityType + ' — ' + (actMeta ? actMeta.label : '')) + '<br>' +
        '<strong>Research Question:</strong> ' + esc(exp.researchQuestion) + '<br>' +
        '<strong>Safety:</strong> ' + esc(exp.safetyRequirements) + '</p>' +
        '<h3>Observation Table</h3><table><thead><tr>' +
        exp.observationTableColumns.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') +
        '</tr></thead><tbody><tr>' + exp.observationTableColumns.map(function () { return '<td>&nbsp;</td>'; }).join('') +
        '</tr><tr>' + exp.observationTableColumns.map(function () { return '<td>&nbsp;</td>'; }).join('') +
        '</tr><tr>' + exp.observationTableColumns.map(function () { return '<td>&nbsp;</td>'; }).join('') +
        '</tr></tbody></table><h3>Reflection Questions</h3><ol>' +
        exp.reflectionQuestions.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') +
        '</ol>') : '',
      '</body></html>'
    ].join('');
  }

  return {
    STORAGE_KEY: STORAGE_KEY,
    BANNED_HEALTH_KEYS: BANNED_HEALTH_KEYS,
    createMemoryStore: createMemoryStore,
    loadState: loadState,
    saveState: saveState,
    markDomainExplored: markDomainExplored,
    markExperimentRun: markExperimentRun,
    logObservation: logObservation,
    buildLessonPlanTemplate: buildLessonPlanTemplate,
    buildPrintableWorksheetHtml: buildPrintableWorksheetHtml
  };
});
