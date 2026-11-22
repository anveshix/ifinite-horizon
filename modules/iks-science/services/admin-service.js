(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../schemas/evidence-schema'));
  } else {
    root.VA_IKS_ADMIN = factory(root.VA_IKS_SCHEMA);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (SCHEMA) {
  'use strict';

  var AUDIT_STORAGE_KEY = 'va.iks.audit.v1';

  var DEFAULT_FLAGS = {
    iksModuleEnabled: true,
    evidenceLedgerEnabled: true,
    experimentEngineEnabled: true,
    teacherStudioEnabled: true,
    highContrastDefault: false,
    lowBandwidthModeDefault: false
  };

  function isEnabled(searchStr, storage) {
    if (typeof window !== 'undefined' && window.VA_IKS_ENABLED === false) return false;
    var s = searchStr !== undefined ? searchStr : (typeof location !== 'undefined' ? location.search : '');
    if (s && /[?&]iks=0(?:&|$)/.test(s)) return false;
    try {
      var st = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
      if (st && st.getItem('va.iks.enabled') === '0') return false;
    } catch (e) { /* ignore */ }
    return true;
  }

  function evaluatePublishGate(claimRecord) {
    if (!claimRecord || typeof claimRecord !== 'object') {
      return { approved: false, reason: 'Missing claim object' };
    }
    if (claimRecord.generatedByAI && claimRecord.reviewerStatus !== 'Human-Reviewed & Verified') {
      return { approved: false, reason: 'AI-generated content cannot auto-publish without human verification.' };
    }
    var check = SCHEMA.validateEvidenceRecord(claimRecord);
    if (!check.valid) {
      return { approved: false, reason: 'Schema validation failed: ' + check.errors.join('; ') };
    }
    return { approved: true, reason: 'Schema & verification gate passed.' };
  }

  function recordAuditEntry(action, details, storage) {
    var entry = {
      id: 'AUD-' + Date.now(),
      timestamp: new Date().toISOString(),
      action: String(action || 'UPDATE').slice(0, 80),
      details: String(details || '').slice(0, 240)
    };
    try {
      var st = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
      if (st) {
        var existing = [];
        try {
          existing = JSON.parse(st.getItem(AUDIT_STORAGE_KEY) || '[]');
          if (!Array.isArray(existing)) existing = [];
        } catch (e) { existing = []; }
        existing.unshift(entry);
        st.setItem(AUDIT_STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
      }
    } catch (e) { /* ignore */ }
    return entry;
  }

  function getAuditEntries(storage) {
    try {
      var st = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
      if (!st) return [];
      var list = JSON.parse(st.getItem(AUDIT_STORAGE_KEY) || '[]');
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  return {
    AUDIT_STORAGE_KEY: AUDIT_STORAGE_KEY,
    DEFAULT_FLAGS: DEFAULT_FLAGS,
    isEnabled: isEnabled,
    evaluatePublishGate: evaluatePublishGate,
    recordAuditEntry: recordAuditEntry,
    getAuditEntries: getAuditEntries
  };
});
