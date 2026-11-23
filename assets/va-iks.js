(function () {
  'use strict';

  var SCHEMA = window.VA_IKS_SCHEMA;
  var DOMAINS = window.VA_IKS_DOMAINS;
  var EVIDENCE = window.VA_IKS_EVIDENCE;
  var CURRICULUM = window.VA_IKS_CURRICULUM;
  var EXPERIMENTS = window.VA_IKS_EXPERIMENTS;
  var VIZ = window.VA_IKS_VIZ;
  var ASSESSMENT = window.VA_IKS_ASSESSMENT;
  var PROGRESS = window.VA_IKS_PROGRESS;
  var ADMIN = window.VA_IKS_ADMIN;

  if (!SCHEMA || !DOMAINS || !EVIDENCE || !CURRICULUM || !EXPERIMENTS || !VIZ || !ASSESSMENT || !PROGRESS || !ADMIN) {
    return;
  }
  if (!ADMIN.isEnabled()) {
    return;
  }

  var esc = SCHEMA.escapeHtml;
  var ui = {
    open: false,
    tab: 'explore', // explore | evidence | lab | quiz | teacher
    domainId: 'A',
    classFilter: 'ALL', // ALL | IX | X
    lang: (document.body && !document.body.classList.contains('nohi')) ? 'en' : 'en',
    highContrast: false,
    lowBandwidth: false,
    evidenceClassFilter: 'ALL',
    evidenceQuery: '',
    teacherClassTab: 'IX',
    gapTierFilter: 'ALL',
    fullscreenViz: false,
    paramsByExp: {},
    vizState: VIZ.createViewState('A'),
    rafId: null,
    progress: PROGRESS.loadState()
  };

  function t(en, hi) {
    return ui.lang === 'hi' && hi ? hi : en;
  }

  function findDomainForChapter(chapterId) {
    if (!chapterId) return 'A';
    var maps = CURRICULUM.getByChapterId(chapterId);
    if (maps.length) return maps[0].domainId;
    var domains = DOMAINS.getAllDomains();
    for (var i = 0; i < domains.length; i++) {
      if (domains[i].vigyanAtlasLinks.indexOf(chapterId) !== -1) return domains[i].id;
    }
    return 'A';
  }

  function mountHomeSection() {
    var home = document.getElementById('home');
    if (!home || document.getElementById('vaIksHomeSection')) return;

    // 1. Add hero quick action button
    var heroActions = home.querySelector('.va-hero-actions');
    if (heroActions && !document.getElementById('vaIksHeroBtn')) {
      var heroBtn = document.createElement('button');
      heroBtn.type = 'button';
      heroBtn.id = 'vaIksHeroBtn';
      heroBtn.className = 'va-btn va-btn-ghost';
      heroBtn.textContent = 'IKS × Modern Science · भारतीय ज्ञान परंपरा ↗';
      heroBtn.addEventListener('click', function () { openDialog({ tab: 'explore', domainId: 'A' }); });
      heroActions.appendChild(heroBtn);
    }

    // 2. Add card to existing tools grid if present
    var toolsGrid = home.querySelector('.va-tools-grid');
    if (toolsGrid && !toolsGrid.querySelector('[data-va-tool="iks"]')) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'va-tool-card';
      card.setAttribute('data-va-tool', 'iks');
      card.innerHTML = [
        '<div class="va-tool-top"><span class="va-tool-tag">CBSE IX–X Enrichment · 8 Domains</span><span class="va-tool-arrow">↗</span></div>',
        '<h3>IKS × Modern Science Engine</h3>',
        '<p>Research-based comparison of Indian Knowledge Systems with modern science, evidence classifications (H1–U1), interactive labs &amp; Jharkhand ecology.</p>'
      ].join('');
      card.addEventListener('click', function () { openDialog({ tab: 'explore', domainId: 'A' }); });
      toolsGrid.appendChild(card);
    }

    // 3. Dedicated Home Section ("एक नया सेक्शन")
    var sec = document.createElement('section');
    sec.id = 'vaIksHomeSection';
    sec.className = 'va-iks-home-section';
    sec.setAttribute('aria-labelledby', 'vaIksHomeHeading');

    var domainsHtml = DOMAINS.getAllDomains().map(function (d) {
      return [
        '<button type="button" class="va-iks-domain-card" data-iks-domain="' + esc(d.id) + '">',
        '<div>',
        '<div class="va-iks-domain-top">',
        '<span class="va-iks-domain-icon" aria-hidden="true">' + esc(d.icon) + '</span>',
        '<span class="va-iks-pill">' + esc(d.scopeLabel) + '</span>',
        '</div>',
        '<h4>' + esc(d.id + '. ' + d.title) + '</h4>',
        '<p class="va-iks-domain-hi" lang="hi">' + esc(d.titleHi) + '</p>',
        '</div>',
        '<div class="va-iks-domain-meta">CBSE Link: ' + esc(d.classTags.join(' · ')) + '</div>',
        '</button>'
      ].join('');
    }).join('');

    sec.innerHTML = [
      '<div class="va-iks-home-head">',
      '<div>',
      '<span class="va-iks-eyebrow">Universal IKS × Modern Science Integration Engine · v2.0</span>',
      '<h2 id="vaIksHomeHeading" class="va-iks-home-title">Indian Knowledge Systems × Modern Science <span lang="hi">(भारतीय ज्ञान परंपरा × आधुनिक विज्ञान)</span></h2>',
      '<p class="va-iks-home-sub">Evidence-classified comparative learning linking historical Indian texts, artifacts, and regional ecological wisdom (including Jharkhand &amp; Santhal Pargana) with modern experimental science and CBSE 2026–27 Class IX &amp; X concepts.</p>',
      '<div class="va-iks-scope-note"><strong>Honest Scope Notice:</strong> Historical IKS modules are <em>curriculum-linked enrichment &amp; reference</em>—not compulsory CBSE board exam content. Unverified claims are explicitly flagged with evidence limits.</div>',
      '</div>',
      '<div class="va-iks-home-actions">',
      '<button type="button" class="va-iks-btn va-iks-btn-primary" data-iks-launch="explore">Open Explorer</button>',
      '<button type="button" class="va-iks-btn" data-iks-launch="evidence">Evidence Ledger (H1–U1)</button>',
      '<button type="button" class="va-iks-btn" data-iks-launch="lab">Interactive Lab</button>',
      '<button type="button" class="va-iks-btn" data-iks-launch="teacher">Class IX &amp; X Mapping</button>',
      '</div>',
      '</div>',
      '<div class="va-iks-domain-grid">' + domainsHtml + '</div>'
    ].join('');

    var toolsSection = home.querySelector('.va-tools-section');
    if (toolsSection && toolsSection.parentNode) {
      toolsSection.parentNode.insertBefore(sec, toolsSection.nextSibling);
    } else {
      home.appendChild(sec);
    }

    sec.querySelectorAll('[data-iks-launch]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openDialog({ tab: btn.getAttribute('data-iks-launch') });
      });
    });
    sec.querySelectorAll('[data-iks-domain]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openDialog({ tab: 'explore', domainId: btn.getAttribute('data-iks-domain') });
      });
    });
  }

  function mountStageAndTeacherHooks() {
    // Stagebar contextual button
    var stagebar = document.getElementById('stagebar');
    if (stagebar && !document.getElementById('vaIksStageBtn')) {
      var sb = document.createElement('button');
      sb.type = 'button';
      sb.id = 'vaIksStageBtn';
      sb.className = 'sbtn';
      sb.title = 'Open IKS × Modern Science context for this chapter';
      sb.textContent = 'IKS';
      sb.addEventListener('click', function () {
        var chId = '';
        if (window.__atlas && typeof window.__atlas.state === 'function') {
          chId = window.__atlas.state().chapterId || '';
        }
        openDialog({ tab: 'explore', domainId: findDomainForChapter(chId) });
      });
      stagebar.appendChild(sb);
    }

    // Side link
    var sidelinks = document.getElementById('sidelinks');
    if (sidelinks && !document.getElementById('vaIksSideBtn')) {
      var sl = document.createElement('button');
      sl.type = 'button';
      sl.id = 'vaIksSideBtn';
      sl.className = 'slink';
      sl.textContent = '🪷 IKS × Science';
      sl.addEventListener('click', function () {
        var chId = '';
        if (window.__atlas && typeof window.__atlas.state === 'function') {
          chId = window.__atlas.state().chapterId || '';
        }
        openDialog({ tab: 'explore', domainId: findDomainForChapter(chId) });
      });
      sidelinks.appendChild(sl);
    }

    // Teacher Dashboard readiness card
    var teacher = document.getElementById('teacher');
    if (teacher && !document.getElementById('vaIksTeacherPanel')) {
      var claimAudit = EVIDENCE.validateAllClaims();
      var expAudit = EXPERIMENTS.validateAllExperiments();
      var mapAudit = CURRICULUM.validateAllMappings();
      var panel = document.createElement('section');
      panel.id = 'vaIksTeacherPanel';
      panel.className = 'va-tcard';
      panel.style.cssText = 'margin:18px auto;max-width:1120px;padding:18px;border:1px solid rgba(19,37,42,0.16);border-radius:12px;background:#ffffff;';
      panel.innerHTML = [
        '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;">',
        '<div>',
        '<h3 style="margin:0 0 4px;">IKS × Modern Science Teacher Readiness</h3>',
        '<p style="margin:0;font-size:13px;color:#415b61;">Schema-Verified Claims: <strong>' + claimAudit.total + '/' + claimAudit.total + '</strong> · Standardized 23-Field Labs: <strong>' + expAudit.total + '/' + expAudit.total + '</strong> · CBSE IX &amp; X Mappings: <strong>' + mapAudit.total + '</strong></p>',
        '</div>',
        '<div style="display:flex;gap:8px;flex-wrap:wrap;">',
        '<button type="button" class="va-iks-btn va-iks-btn-primary" id="vaIksOpenTeacherStudio">Open Teacher &amp; Curriculum Studio</button>',
        '<button type="button" class="va-iks-btn" id="vaIksPrintSheetQuick">Printable Worksheet (Domain A)</button>',
        '</div>',
        '</div>'
      ].join('');
      var firstChild = teacher.querySelector('.va-tgrid') || teacher.lastElementChild;
      if (firstChild && firstChild.parentNode) {
        firstChild.parentNode.insertBefore(panel, firstChild.nextSibling);
      } else {
        teacher.appendChild(panel);
      }
      document.getElementById('vaIksOpenTeacherStudio').addEventListener('click', function () {
        openDialog({ tab: 'teacher' });
      });
      document.getElementById('vaIksPrintSheetQuick').addEventListener('click', function () {
        openWorksheetWindow(ui.domainId || 'A');
      });
    }
  }

  function openWorksheetWindow(domainId) {
    var html = PROGRESS.buildPrintableWorksheetHtml(domainId);
    var win = window.open('', '_blank', 'noopener');
    if (win) {
      win.document.open();
      win.document.write(html);
      win.document.close();
    } else {
      var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'iks-worksheet-' + domainId + '.html';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }
  }

  function ensureDialog() {
    var dlg = document.getElementById('vaIksDialog');
    if (dlg) return dlg;
    dlg = document.createElement('div');
    dlg.id = 'vaIksDialog';
    dlg.setAttribute('role', 'dialog');
    dlg.setAttribute('aria-modal', 'true');
    dlg.setAttribute('aria-labelledby', 'vaIksDialogTitle');
    dlg.innerHTML = [
      '<div class="va-iks-topbar">',
      '  <div class="va-iks-brand">',
      '    <span aria-hidden="true" style="font-size:20px;">🪷</span>',
      '    <h2 id="vaIksDialogTitle">IKS × Modern Science Integration Engine</h2>',
      '  </div>',
      '  <div class="va-iks-top-controls">',
      '    <button type="button" class="va-iks-chip-btn" id="vaIksLangBtn" aria-pressed="false">EN / हिंदी</button>',
      '    <button type="button" class="va-iks-chip-btn" id="vaIksHcBtn" aria-pressed="false">High Contrast</button>',
      '    <button type="button" class="va-iks-chip-btn" id="vaIksBwBtn" aria-pressed="false">Low Bandwidth</button>',
      '    <select id="vaIksClassFilter" class="va-iks-chip-btn" aria-label="Filter by Class">',
      '      <option value="ALL">Class IX &amp; X</option>',
      '      <option value="IX">Class IX (2026–27)</option>',
      '      <option value="X">Class X (2026–27)</option>',
      '    </select>',
      '    <button type="button" class="va-iks-chip-btn" id="vaIksCloseBtn" aria-label="Close IKS Workspace">✕ Close (Esc)</button>',
      '  </div>',
      '</div>',
      '<div class="va-iks-tabs" role="tablist" aria-label="IKS Modules">',
      '  <button type="button" role="tab" class="va-iks-tab" data-iks-tab="explore" aria-selected="true">1. Explore Domains (A–H)</button>',
      '  <button type="button" role="tab" class="va-iks-tab" data-iks-tab="evidence" aria-selected="false">2. Evidence Ledger (H1–U1)</button>',
      '  <button type="button" role="tab" class="va-iks-tab" data-iks-tab="lab" aria-selected="false">3. Experiment &amp; Viz Lab</button>',
      '  <button type="button" role="tab" class="va-iks-tab" data-iks-tab="quiz" aria-selected="false">4. Self-Assessment</button>',
      '  <button type="button" role="tab" class="va-iks-tab" data-iks-tab="teacher" aria-selected="false">5. Teacher &amp; Curriculum Studio</button>',
      '</div>',
      '<div class="va-iks-body">',
      '  <nav class="va-iks-rail" id="vaIksRail" aria-label="8 IKS Knowledge Domains"></nav>',
      '  <main class="va-iks-main" id="vaIksMain" tabindex="-1"></main>',
      '</div>'
    ].join('');
    document.body.appendChild(dlg);

    dlg.querySelector('#vaIksCloseBtn').addEventListener('click', closeDialog);
    dlg.querySelector('#vaIksLangBtn').addEventListener('click', function () {
      ui.lang = ui.lang === 'en' ? 'hi' : 'en';
      renderDialog();
    });
    dlg.querySelector('#vaIksHcBtn').addEventListener('click', function () {
      ui.highContrast = !ui.highContrast;
      dlg.classList.toggle('va-iks-hc', ui.highContrast);
      renderDialog();
    });
    dlg.querySelector('#vaIksBwBtn').addEventListener('click', function () {
      ui.lowBandwidth = !ui.lowBandwidth;
      ui.vizState.lowBandwidth = ui.lowBandwidth;
      if (ui.lowBandwidth) ui.vizState.playing = false;
      renderDialog();
    });
    dlg.querySelector('#vaIksClassFilter').addEventListener('change', function (e) {
      ui.classFilter = e.target.value;
      renderDialog();
    });
    dlg.querySelectorAll('[data-iks-tab]').forEach(function (tabBtn) {
      tabBtn.addEventListener('click', function () {
        ui.tab = tabBtn.getAttribute('data-iks-tab');
        renderDialog();
      });
    });

    document.addEventListener('keydown', function (e) {
      if (!ui.open) return;
      if (e.key === 'Escape') {
        if (ui.fullscreenViz) {
          ui.fullscreenViz = false;
          renderDialog();
        } else {
          closeDialog();
        }
      }
    });

    return dlg;
  }

  function openDialog(opts) {
    var o = opts || {};
    ensureDialog();
    if (o.tab) ui.tab = o.tab;
    if (o.domainId) {
      ui.domainId = o.domainId;
      ui.vizState = VIZ.createViewState(o.domainId);
      ui.vizState.lowBandwidth = ui.lowBandwidth;
      if (ui.lowBandwidth) ui.vizState.playing = false;
    }
    PROGRESS.markDomainExplored(ui.progress, ui.domainId);
    PROGRESS.saveState(ui.progress);

    ui.open = true;
    var dlg = document.getElementById('vaIksDialog');
    dlg.classList.add('open');
    renderDialog();
    var main = document.getElementById('vaIksMain');
    if (main) main.focus();
  }

  function closeDialog() {
    ui.open = false;
    ui.fullscreenViz = false;
    if (ui.rafId) {
      cancelAnimationFrame(ui.rafId);
      ui.rafId = null;
    }
    var dlg = document.getElementById('vaIksDialog');
    if (dlg) dlg.classList.remove('open');
  }

  function getActiveExpParams(exp) {
    if (!ui.paramsByExp[exp.experimentId]) {
      ui.paramsByExp[exp.experimentId] = EXPERIMENTS.getDefaultParams(exp);
    }
    return ui.paramsByExp[exp.experimentId];
  }

  function renderDialog() {
    var dlg = document.getElementById('vaIksDialog');
    if (!dlg) return;

    dlg.querySelector('#vaIksLangBtn').setAttribute('aria-pressed', String(ui.lang === 'hi'));
    dlg.querySelector('#vaIksLangBtn').textContent = ui.lang === 'hi' ? 'हिंदी सक्रिय · Switch EN' : 'EN Active · हिंदी';
    dlg.querySelector('#vaIksHcBtn').setAttribute('aria-pressed', String(ui.highContrast));
    dlg.querySelector('#vaIksBwBtn').setAttribute('aria-pressed', String(ui.lowBandwidth));
    dlg.querySelector('#vaIksClassFilter').value = ui.classFilter;

    dlg.querySelectorAll('[data-iks-tab]').forEach(function (b) {
      b.setAttribute('aria-selected', String(b.getAttribute('data-iks-tab') === ui.tab));
    });

    // Rail
    var rail = document.getElementById('vaIksRail');
    rail.innerHTML = DOMAINS.getAllDomains().map(function (d) {
      var active = d.id === ui.domainId ? ' active' : '';
      return '<button type="button" class="va-iks-rail-btn' + active + '" data-rail-domain="' + esc(d.id) + '">' +
        '<span aria-hidden="true">' + esc(d.icon) + '</span>' +
        '<span><strong>' + esc(d.id) + '.</strong> ' + esc(t(d.title, d.titleHi)) + '</span>' +
        '</button>';
    }).join('');
    rail.querySelectorAll('[data-rail-domain]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        ui.domainId = btn.getAttribute('data-rail-domain');
        ui.vizState = VIZ.createViewState(ui.domainId);
        ui.vizState.lowBandwidth = ui.lowBandwidth;
        if (ui.lowBandwidth) ui.vizState.playing = false;
        PROGRESS.markDomainExplored(ui.progress, ui.domainId);
        PROGRESS.saveState(ui.progress);
        renderDialog();
      });
    });

    if (ui.rafId) {
      cancelAnimationFrame(ui.rafId);
      ui.rafId = null;
    }

    var main = document.getElementById('vaIksMain');
    if (ui.tab === 'explore') renderExploreTab(main);
    else if (ui.tab === 'evidence') renderEvidenceTab(main);
    else if (ui.tab === 'lab') renderLabTab(main);
    else if (ui.tab === 'quiz') renderQuizTab(main);
    else if (ui.tab === 'teacher') renderTeacherTab(main);
  }

  function renderExploreTab(main) {
    var domain = DOMAINS.getDomainById(ui.domainId);
    var mappings = CURRICULUM.getByDomain(domain.id, ui.classFilter === 'ALL' ? null : ui.classFilter);
    var glossaryRows = DOMAINS.getGlossary().map(function (g) {
      return '<tr><td><strong>' + esc(g.en) + '</strong></td><td lang="hi">' + esc(g.hi) + '</td><td>' + esc(t(g.def, g.defHi)) + '</td></tr>';
    }).join('');

    var regionalHtml = '';
    if (domain.regionalContext) {
      regionalHtml = [
        '<div class="va-iks-subcard" style="margin-top:10px;">',
        '<h4 style="margin:0 0 6px;color:#82d4c4;">Regional Contextual Focus: ' + esc(domain.regionalContext.region) + '</h4>',
        '<ul style="margin:4px 0 8px 18px;">' + domain.regionalContext.examples.map(function (ex) { return '<li>' + esc(ex) + '</li>'; }).join('') + '</ul>',
        '<p style="margin:0;font-size:12.5px;color:#ffd2c6;"><strong>Failure / Boundary Conditions:</strong> ' + esc(domain.regionalContext.failureConditions) + '</p>',
        '</div>'
      ].join('');
    }

    main.innerHTML = [
      '<div class="va-iks-card">',
      '  <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:center;">',
      '    <span class="va-iks-pill" style="background:#1e4249;color:#ffd36b;">' + esc(domain.scopeLabel) + ' · Non-Compulsory Reference</span>',
      '    <div style="display:flex;gap:6px;flex-wrap:wrap;">',
      '      <button type="button" class="va-iks-chip-btn" id="vaIksJumpLab">Open Experiment &amp; Viz Lab →</button>',
      '      <button type="button" class="va-iks-chip-btn" id="vaIksJumpEv">View Evidence Claims →</button>',
      '    </div>',
      '  </div>',
      '  <h3 style="margin:10px 0 4px;font-size:20px;color:#ffffff;">' + esc(domain.icon + ' ' + t(domain.title, domain.titleHi)) + '</h3>',
      '  <p style="margin:0 0 12px;color:#a9ccc6;font-size:13.5px;">' + esc(t(domain.subtitle, domain.subtitleHi)) + '</p>',
      '  <div class="va-iks-guardrail"><strong>' + esc(t('Scientific & Historical Guardrail:', 'वैज्ञानिक एवं ऐतिहासिक सावधानी:')) + '</strong> ' + esc(t(domain.guardrail, domain.guardrailHi)) + '</div>',
      '  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-top:12px;">',
      '    <div class="va-iks-subcard"><h4 style="margin:0 0 6px;color:#ffd36b;">' + esc(t('Historical IKS Context', 'ऐतिहासिक भारतीय ज्ञान संदर्भ')) + '</h4><p style="margin:0;font-size:13.5px;line-height:1.55;">' + esc(t(domain.historicalOverview, domain.historicalOverviewHi)) + '</p></div>',
      '    <div class="va-iks-subcard"><h4 style="margin:0 0 6px;color:#80c8be;">' + esc(t('Modern Scientific Comparison', 'आधुनिक वैज्ञानिक तुलना')) + '</h4><p style="margin:0;font-size:13.5px;line-height:1.55;">' + esc(t(domain.modernComparison, domain.modernComparisonHi)) + '</p></div>',
      '  </div>',
      regionalHtml,
      '</div>',

      '<div class="va-iks-card">',
      '  <h4 style="margin:0 0 10px;color:#ffd36b;">Structured Comparison Matrix</h4>',
      '  <table class="va-iks-table"><thead><tr><th>Dimension</th><th>Historical / IKS</th><th>Modern Scientific Evidence</th></tr></thead><tbody>',
      domain.comparisonRows.map(function (r) {
        return '<tr><td><strong>' + esc(r.dimension) + '</strong></td><td>' + esc(r.historical) + '</td><td>' + esc(r.modern) + '</td></tr>';
      }).join(''),
      '  </tbody></table>',
      '  <p style="margin:10px 0 0;font-size:12.5px;color:#b7ceca;"><strong>Limitations:</strong> ' + esc(domain.limitations) + '</p>',
      '</div>',

      '<div class="va-iks-card">',
      '  <h4 style="margin:0 0 8px;color:#80c8be;">CBSE 2026–27 Curriculum Links (Class IX &amp; X Separate)</h4>',
      '  <table class="va-iks-table"><thead><tr><th>Class</th><th>Infinite Horizons Chapter</th><th>Scope Label</th><th>Prescribed Core vs IKS Enrichment</th></tr></thead><tbody>',
      mappings.map(function (m) {
        return '<tr><td><strong>Class ' + esc(m.classLevel) + '</strong></td><td><code>' + esc(m.chapterId) + '</code> · ' + esc(t(m.chapterTitle, m.chapterTitleHi)) + '</td><td>' + esc(m.scopeLabel) + '<br><small style="color:#ffd36b;">Non-compulsory</small></td><td><strong>Core:</strong> ' + esc(m.prescribedCore) + '<br><strong>IKS:</strong> ' + esc(m.iksEnrichment) + '</td></tr>';
      }).join(''),
      '  </tbody></table>',
      '</div>',

      '<div class="va-iks-card">',
      '  <details><summary style="cursor:pointer;font-weight:600;color:#ffd36b;">Validated Bilingual Scientific Glossary (EN + हिंदी)</summary>',
      '  <table class="va-iks-table" style="margin-top:10px;"><thead><tr><th>English Term</th><th>हिंदी पारिभाषिक शब्द</th><th>Definition</th></tr></thead><tbody>' + glossaryRows + '</tbody></table>',
      '  </details>',
      '</div>'
    ].join('');

    main.querySelector('#vaIksJumpLab').addEventListener('click', function () { ui.tab = 'lab'; renderDialog(); });
    main.querySelector('#vaIksJumpEv').addEventListener('click', function () { ui.tab = 'evidence'; renderDialog(); });
  }

  function renderEvidenceTab(main) {
    var claims = EVIDENCE.filterClaims({
      domainId: ui.domainId,
      evidenceClass: ui.evidenceClassFilter,
      query: ui.evidenceQuery
    });
    var classOptions = ['ALL'].concat(Object.keys(SCHEMA.EVIDENCE_CLASSES));

    main.innerHTML = [
      '<div class="va-iks-card">',
      '  <h3 style="margin:0 0 8px;color:#ffd36b;">Historical Evidence &amp; Scientific Verification Ledger</h3>',
      '  <p style="margin:0 0 12px;font-size:13px;color:#bcd4d0;">Every claim carries mandatory 15-field metadata, explicit limitations, and evidence classification (H1–U1). Unverified or philosophical claims display the formal insufficiency notice.</p>',
      '  <div style="display:grid;grid-template-columns:1fr 220px;gap:10px;">',
      '    <input type="search" id="vaIksEvSearch" class="va-iks-input" placeholder="Search claims, sources, authors..." value="' + esc(ui.evidenceQuery) + '">',
      '    <select id="vaIksEvFilter" class="va-iks-select">' + classOptions.map(function (c) {
        var meta = SCHEMA.EVIDENCE_CLASSES[c];
        var label = c === 'ALL' ? 'All Classifications' : (c + ' — ' + meta.label);
        return '<option value="' + esc(c) + '"' + (ui.evidenceClassFilter === c ? ' selected' : '') + '>' + esc(label) + '</option>';
      }).join('') + '</select>',
      '  </div>',
      '</div>',
      claims.length ? claims.map(function (c) {
        var meta = SCHEMA.EVIDENCE_CLASSES[c.evidenceClass];
        return [
          '<div class="va-iks-card">',
          '  <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:center;">',
          '    <div><span class="va-iks-badge" style="background:' + esc(meta.color) + ';">' + esc(c.evidenceClass + ' · ' + meta.label) + '</span> <code style="color:#ffd36b;">' + esc(c.claimId) + '</code></div>',
          '    <span style="font-size:12px;color:#a3c2be;">Verified: ' + esc(c.lastVerificationDate) + ' · ' + esc(c.reviewerStatus) + '</span>',
          '  </div>',
          '  <h4 style="margin:10px 0 6px;font-size:16px;color:#ffffff;">' + esc(t(c.claimTitle, c.claimTitleHi)) + '</h4>',
          '  <p style="margin:0 0 8px;font-size:13.5px;"><strong>Original Claim:</strong> ' + esc(c.originalClaim) + '</p>',
          '  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;font-size:12.5px;color:#cbe0dc;">',
          '    <div><strong>Period:</strong> ' + esc(c.historicalPeriod) + '</div>',
          '    <div><strong>Source:</strong> ' + esc(c.originalSource) + ' (' + esc(c.sourceLanguage) + ')</div>',
          '    <div><strong>Attributed Author:</strong> ' + esc(c.attributedAuthor) + '</div>',
          '  </div>',
          '  <p style="margin:8px 0 4px;font-size:13px;"><strong>Historical Interpretation:</strong> ' + esc(c.historicalInterpretation) + '</p>',
          '  <p style="margin:4px 0;font-size:13px;"><strong>Modern Scientific Comparison:</strong> ' + esc(c.modernScientificComparison) + '</p>',
          '  <p style="margin:4px 0;font-size:12.5px;color:#b7ceca;"><strong>Conflicting Interpretations:</strong> ' + esc(c.conflictingInterpretations) + '</p>',
          '  <p style="margin:4px 0;font-size:12.5px;color:#b7ceca;"><strong>Limitations:</strong> ' + esc(c.limitations) + '</p>',
          '  <p style="margin:4px 0;font-size:12px;color:#93b7b2;"><strong>Supporting References:</strong> ' + c.supportingReferences.map(esc).join(' | ') + '</p>',
          c.scientificSufficiencyNote ? ('<div class="va-iks-insufficiency">' + esc(c.scientificSufficiencyNote) + '</div>') : '',
          '</div>'
        ].join('');
      }).join('') : '<div class="va-iks-card"><p>No matching claims for this domain/filter.</p></div>'
    ].join('');

    main.querySelector('#vaIksEvSearch').addEventListener('input', function (e) {
      ui.evidenceQuery = e.target.value;
      renderEvidenceTab(main);
      var inp = main.querySelector('#vaIksEvSearch');
      if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
    });
    main.querySelector('#vaIksEvFilter').addEventListener('change', function (e) {
      ui.evidenceClassFilter = e.target.value;
      renderEvidenceTab(main);
    });
  }

  function renderLabTab(main) {
    var exp = EXPERIMENTS.getExperimentByDomain(ui.domainId);
    var params = getActiveExpParams(exp);
    var out = exp.run(params);
    var series = exp.generateSeries(params);
    var actMeta = SCHEMA.ACTIVITY_TYPES[exp.activityType];
    var obsRows = ui.progress.observations[exp.experimentId] || [];

    PROGRESS.markExperimentRun(ui.progress, exp.experimentId);
    PROGRESS.saveState(ui.progress);

    main.innerHTML = [
      '<div class="va-iks-card">',
      '  <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:center;">',
      '    <div><span class="va-iks-pill" style="background:#ffd36b;color:#102024;">Activity Type ' + esc(exp.activityType) + ': ' + esc(t(actMeta.label, actMeta.labelHi)) + '</span> <code style="color:#82d4c4;">' + esc(exp.experimentId) + '</code></div>',
      '    <button type="button" class="va-iks-chip-btn" id="vaIksExportReportBtn">⬇ Export Lab Report (.md)</button>',
      '  </div>',
      '  <h3 style="margin:10px 0 4px;color:#ffffff;">' + esc(t(exp.title, exp.titleHi)) + '</h3>',
      '  <p style="margin:0 0 8px;font-size:13px;color:#a8cac5;">' + esc(exp.classAndSubject) + ' · <strong>Research Question:</strong> ' + esc(exp.researchQuestion) + '</p>',
      '  <div class="va-iks-guardrail"><strong>Safety &amp; Supervision:</strong> ' + esc(exp.safetyRequirements) + ' — ' + esc(exp.teacherSupervision) + '</div>',
      '</div>',

      '<div class="va-iks-exp-layout">',
      '  <div class="va-iks-card">',
      '    <div class="va-iks-canvas-wrap' + (ui.fullscreenViz ? ' fullscreen' : '') + '" id="vaIksCanvasWrap">',
      '      <canvas id="vaIksCanvas" width="560" height="300" tabindex="0" aria-label="Interactive visualization for ' + esc(exp.title) + '"></canvas>',
      '      <div class="va-iks-viz-toolbar">',
      '        <button type="button" class="va-iks-chip-btn" id="vaVizPlay">' + (ui.vizState.playing ? '⏸ Pause' : '▶ Play') + '</button>',
      '        <button type="button" class="va-iks-chip-btn" id="vaVizStep">Step (' + (ui.vizState.step + 1) + '/4)</button>',
      '        <button type="button" class="va-iks-chip-btn" id="vaVizRot">↻ Rotate</button>',
      '        <button type="button" class="va-iks-chip-btn" id="vaVizZoomIn">🔍+</button>',
      '        <button type="button" class="va-iks-chip-btn" id="vaVizZoomOut">🔍−</button>',
      '        <button type="button" class="va-iks-chip-btn" id="vaVizCmp" aria-pressed="' + ui.vizState.compareMode + '">Compare</button>',
      '        <button type="button" class="va-iks-chip-btn" id="vaVizLab" aria-pressed="' + ui.vizState.showLabels + '">Labels</button>',
      '        <button type="button" class="va-iks-chip-btn" id="vaVizReset">↺ Reset</button>',
      '        <button type="button" class="va-iks-chip-btn" id="vaVizFs">' + (ui.fullscreenViz ? 'Exit Fullscreen' : '⛶ Fullscreen') + '</button>',
      '      </div>',
      '    </div>',
      '    <p id="vaIksStepBanner" style="margin:8px 0 0;font-size:12.5px;color:#ffd36b;">' + esc(VIZ.stepLabel(ui.domainId, ui.vizState.step)) + '</p>',
      '    ' + VIZ.renderSeriesSvg(series, exp.graphConfig),
      '  </div>',

      '  <div class="va-iks-card">',
      '    <h4 style="margin:0 0 10px;color:#ffd36b;">Experiment Variables &amp; Live Output</h4>',
      exp.controls.map(function (c) {
        var val = params[c.key];
        return '<div class="va-iks-slider-row">' +
          '<label for="vaCtrl-' + esc(c.key) + '"><span>' + esc(t(c.label, c.labelHi)) + ':</span> <strong id="vaCtrlVal-' + esc(c.key) + '" style="color:#82d4c4;">' + esc(val + ' ' + c.unit) + '</strong></label>' +
          '<input id="vaCtrl-' + esc(c.key) + '" type="range" min="' + c.min + '" max="' + c.max + '" step="' + c.step + '" value="' + val + '" data-exp-ctrl="' + esc(c.key) + '">' +
          '</div>';
      }).join(''),
      '    <div class="va-iks-subcard" aria-live="polite">',
      '      <strong style="color:#ffd36b;">Simulated Observation Result:</strong>',
      '      <p id="vaIksExpSummary" style="margin:6px 0 0;font-size:13.5px;color:#ffffff;">' + esc(out.summary) + '</p>',
      '    </div>',
      '    <div class="va-iks-subcard" style="margin-top:10px;">',
      '      <h5 style="margin:0 0 6px;color:#80c8be;">Log Predicted vs Observed Row</h5>',
      '      <input type="text" id="vaIksPredInput" class="va-iks-input" placeholder="Your prediction before running...">',
      '      <button type="button" class="va-iks-chip-btn" id="vaIksAddObsBtn" style="margin-top:8px;">+ Record Observation</button>',
      '      <div style="margin-top:8px;max-height:130px;overflow:auto;font-size:12px;">' +
        (obsRows.length ? obsRows.map(function (r, idx) {
          return '<div style="padding:4px 0;border-bottom:1px solid rgba(128,200,190,0.14);">#' + (idx + 1) + ' Pred: ' + esc(r.predicted || '—') + ' | Obs: ' + esc(r.observed) + '</div>';
        }).join('') : '<span style="color:#8cb0aa;">No logged rows yet.</span>') +
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>',

      '<div class="va-iks-card">',
      '  <details open><summary style="cursor:pointer;font-weight:600;color:#ffd36b;">Standardized 23-Field Scientific Protocol &amp; Limitations</summary>',
      '  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;margin-top:10px;font-size:13px;">',
      '    <div><strong>Hypothesis:</strong> ' + esc(exp.hypothesis) + '</div>',
      '    <div><strong>Independent Var:</strong> ' + esc(exp.independentVariable) + '</div>',
      '    <div><strong>Dependent Var:</strong> ' + esc(exp.dependentVariable) + '</div>',
      '    <div><strong>Controlled Vars:</strong> ' + esc(exp.controlledVariables) + '</div>',
      '    <div><strong>Interpretation:</strong> ' + esc(exp.scientificInterpretation) + '</div>',
      '    <div><strong>Sources of Error &amp; Limits:</strong> ' + esc(exp.sourcesOfError + ' ' + exp.limitations) + '</div>',
      '  </div>',
      '  <h5 style="margin:10px 0 4px;color:#80c8be;">Procedure</h5>',
      '  <p style="margin:0;font-size:13px;">' + exp.procedure.map(esc).join('<br>') + '</p>',
      '  <h5 style="margin:10px 0 4px;color:#80c8be;">Reflection Questions</h5>',
      '  <ul style="margin:0 0 0 18px;font-size:13px;">' + exp.reflectionQuestions.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul>',
      '  </details>',
      '</div>'
    ].join('');

    // Wire sliders
    main.querySelectorAll('[data-exp-ctrl]').forEach(function (inp) {
      inp.addEventListener('input', function () {
        var key = inp.getAttribute('data-exp-ctrl');
        params[key] = Number(inp.value);
        var ctrlMeta = exp.controls.filter(function (c) { return c.key === key; })[0];
        var valEl = document.getElementById('vaCtrlVal-' + key);
        if (valEl && ctrlMeta) valEl.textContent = inp.value + ' ' + ctrlMeta.unit;
        var res = exp.run(params);
        var sumEl = document.getElementById('vaIksExpSummary');
        if (sumEl) sumEl.textContent = res.summary;
        var oldSvg = main.querySelector('.va-iks-svg-graph');
        if (oldSvg) {
          var tmp = document.createElement('div');
          tmp.innerHTML = VIZ.renderSeriesSvg(exp.generateSeries(params), exp.graphConfig);
          oldSvg.replaceWith(tmp.firstElementChild);
        }
        drawLabCanvas();
      });
    });

    // Wire viz toolbar & pointer/keyboard pan-zoom
    var canvas = document.getElementById('vaIksCanvas');
    function drawLabCanvas() {
      VIZ.drawOnCanvas(canvas, ui.vizState, exp.run(params));
    }

    var dragging = false, lastX = 0, lastY = 0;
    canvas.addEventListener('pointerdown', function (e) {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
    });
    window.addEventListener('pointerup', function () { dragging = false; });
    canvas.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      ui.vizState.panX += (e.clientX - lastX);
      ui.vizState.panY += (e.clientY - lastY);
      lastX = e.clientX; lastY = e.clientY;
      drawLabCanvas();
    });
    canvas.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { ui.vizState.panX -= 14; drawLabCanvas(); }
      else if (e.key === 'ArrowRight') { ui.vizState.panX += 14; drawLabCanvas(); }
      else if (e.key === 'ArrowUp') { ui.vizState.panY -= 14; drawLabCanvas(); }
      else if (e.key === 'ArrowDown') { ui.vizState.panY += 14; drawLabCanvas(); }
      else if (e.key === '+') { ui.vizState.zoom = Math.min(2.2, ui.vizState.zoom + 0.15); drawLabCanvas(); }
      else if (e.key === '-') { ui.vizState.zoom = Math.max(0.6, ui.vizState.zoom - 0.15); drawLabCanvas(); }
    });

    main.querySelector('#vaVizPlay').addEventListener('click', function () {
      ui.vizState.playing = !ui.vizState.playing;
      renderLabTab(main);
    });
    main.querySelector('#vaVizStep').addEventListener('click', function () {
      ui.vizState.step = (ui.vizState.step + 1) % 4;
      document.getElementById('vaIksStepBanner').textContent = VIZ.stepLabel(ui.domainId, ui.vizState.step);
      document.getElementById('vaVizStep').textContent = 'Step (' + (ui.vizState.step + 1) + '/4)';
    });
    main.querySelector('#vaVizRot').addEventListener('click', function () {
      ui.vizState.rotateDeg = (ui.vizState.rotateDeg + 30) % 360;
      drawLabCanvas();
    });
    main.querySelector('#vaVizZoomIn').addEventListener('click', function () {
      ui.vizState.zoom = Math.min(2.2, Number((ui.vizState.zoom + 0.2).toFixed(2)));
      drawLabCanvas();
    });
    main.querySelector('#vaVizZoomOut').addEventListener('click', function () {
      ui.vizState.zoom = Math.max(0.6, Number((ui.vizState.zoom - 0.2).toFixed(2)));
      drawLabCanvas();
    });
    main.querySelector('#vaVizCmp').addEventListener('click', function () {
      ui.vizState.compareMode = !ui.vizState.compareMode;
      renderLabTab(main);
    });
    main.querySelector('#vaVizLab').addEventListener('click', function () {
      ui.vizState.showLabels = !ui.vizState.showLabels;
      renderLabTab(main);
    });
    main.querySelector('#vaVizReset').addEventListener('click', function () {
      ui.paramsByExp[exp.experimentId] = EXPERIMENTS.getDefaultParams(exp);
      ui.vizState = VIZ.createViewState(ui.domainId);
      ui.vizState.lowBandwidth = ui.lowBandwidth;
      renderLabTab(main);
    });
    main.querySelector('#vaVizFs').addEventListener('click', function () {
      ui.fullscreenViz = !ui.fullscreenViz;
      renderLabTab(main);
    });

    main.querySelector('#vaIksAddObsBtn').addEventListener('click', function () {
      var pred = document.getElementById('vaIksPredInput').value;
      var cur = exp.run(params);
      PROGRESS.logObservation(ui.progress, exp.experimentId, { predicted: pred, observed: cur.summary });
      PROGRESS.saveState(ui.progress);
      renderLabTab(main);
    });

    main.querySelector('#vaIksExportReportBtn').addEventListener('click', function () {
      var md = EXPERIMENTS.exportReportMarkdown(exp, params, ui.progress.observations[exp.experimentId] || []);
      var blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = exp.experimentId.toLowerCase() + '-report.md';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });

    // Animation loop (paused in low-bandwidth mode)
    function tick() {
      if (!ui.open || ui.tab !== 'lab') return;
      if (ui.vizState.playing && !ui.lowBandwidth) {
        ui.vizState.phase += 0.035;
      }
      drawLabCanvas();
      if (ui.vizState.playing && !ui.lowBandwidth) {
        ui.rafId = requestAnimationFrame(tick);
      }
    }
    drawLabCanvas();
    if (ui.vizState.playing && !ui.lowBandwidth) {
      ui.rafId = requestAnimationFrame(tick);
    }
  }

  function renderQuizTab(main) {
    var qs = ASSESSMENT.getQuestions({
      domainId: 'ALL',
      classLevel: ui.classFilter
    });
    var score = ASSESSMENT.scoreSubmission(ui.progress.quizAnswers);

    main.innerHTML = [
      '<div class="va-iks-card">',
      '  <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;">',
      '    <div><h3 style="margin:0;color:#ffd36b;">Competency Self-Assessment</h3><p style="margin:4px 0 0;font-size:13px;color:#b7ceca;">Tests historical vs modern scientific reasoning, evidence literacy, and curriculum applications.</p></div>',
      '    <div class="va-iks-subcard" style="padding:8px 14px;">Score: <strong>' + score.correct + '/' + score.answered + '</strong> (' + score.pct + '%)</div>',
      '  </div>',
      '</div>',
      qs.map(function (q, idx) {
        var chosen = ui.progress.quizAnswers[q.id];
        var opts = (ui.lang === 'hi' && q.optionsHi) ? q.optionsHi : q.options;
        return [
          '<div class="va-iks-card">',
          '  <div style="display:flex;justify-content:space-between;gap:8px;font-size:12px;color:#82d4c4;">',
          '    <span>' + esc(q.id + ' · Domain ' + q.domainId + ' · Class ' + q.classLevel) + '</span>',
          '    <span>' + esc(q.competency + ' · ' + q.scopeLabel) + '</span>',
          '  </div>',
          '  <p style="margin:8px 0;font-size:14.5px;font-weight:600;color:#ffffff;">' + (idx + 1) + '. ' + esc(t(q.question, q.questionHi)) + '</p>',
          opts.map(function (opt, oIdx) {
            var cls = 'va-iks-quiz-opt';
            if (typeof chosen === 'number') {
              if (oIdx === q.correctIndex) cls += ' correct';
              else if (oIdx === chosen) cls += ' wrong';
            }
            return '<button type="button" class="' + cls + '" data-quiz-q="' + esc(q.id) + '" data-quiz-opt="' + oIdx + '">' + esc(opt) + '</button>';
          }).join(''),
          typeof chosen === 'number' ? ('<div class="va-iks-subcard" style="margin-top:8px;font-size:13px;"><strong>' + (chosen === q.correctIndex ? '✓ Verified Reasoning:' : '✗ Review Evidence:') + '</strong> ' + esc(t(q.rationale, q.rationaleHi)) + '</div>') : '',
          '</div>'
        ].join('');
      }).join('')
    ].join('');

    main.querySelectorAll('[data-quiz-q]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var qid = btn.getAttribute('data-quiz-q');
        var optIdx = Number(btn.getAttribute('data-quiz-opt'));
        ui.progress.quizAnswers[qid] = optIdx;
        PROGRESS.saveState(ui.progress);
        renderQuizTab(main);
      });
    });
  }

  function renderTeacherTab(main) {
    var mappings = CURRICULUM.getByClass(ui.teacherClassTab);
    var gaps = CURRICULUM.getGapMatrix(ui.gapTierFilter);
    var pol = CURRICULUM.POLICY_ASYMMETRY_2026_27;
    var savedPlan = ui.progress.lessonPlanOverrides[ui.domainId + '-' + ui.teacherClassTab] ||
      PROGRESS.buildLessonPlanTemplate(ui.domainId, ui.teacherClassTab);
    var auditEntries = ADMIN.getAuditEntries();
    var claimAudit = EVIDENCE.validateAllClaims();
    var expAudit = EXPERIMENTS.validateAllExperiments();

    main.innerHTML = [
      '<div class="va-iks-card">',
      '  <h3 style="margin:0 0 6px;color:#ffd36b;">Teacher &amp; CBSE 2026–27 Curriculum Studio</h3>',
      '  <p style="margin:0 0 10px;font-size:13px;color:#cfe2de;">' + esc(CURRICULUM.CURRICULUM_META.compulsoryExamDisclaimer) + '</p>',
      '  <p style="margin:0 0 10px;font-size:12px;color:#9fc1bc;">' + esc(CURRICULUM.CURRICULUM_META.verificationStatus) + '</p>',
      '  <div class="va-iks-subcard" style="margin-bottom:10px;font-size:12.5px;line-height:1.5;">',
      '    <strong style="color:#ffd36b;">' + esc(pol.circularRef) + ' — Structural Asymmetry:</strong><br>',
      '    • <strong>Class IX:</strong> ' + esc(pol.classIXStatus) + '<br>',
      '    • <strong>Class X:</strong> ' + esc(pol.classXStatus) + '<br>',
      '    • <strong>KTPI (073):</strong> ' + esc(pol.ktpiNote),
      '  </div>',
      '  <div style="display:flex;gap:8px;flex-wrap:wrap;">',
      '    <button type="button" class="va-iks-chip-btn" id="vaTeachIxBtn" aria-pressed="' + (ui.teacherClassTab === 'IX') + '">Class IX (Science 086 · 2026–27)</button>',
      '    <button type="button" class="va-iks-chip-btn" id="vaTeachXBtn" aria-pressed="' + (ui.teacherClassTab === 'X') + '">Class X (Science 086 · 2026–27)</button>',
      '    <button type="button" class="va-iks-chip-btn" id="vaTeachPrintBtn">🖨 Printable Worksheet (Domain ' + esc(ui.domainId) + ')</button>',
      '  </div>',
      '</div>',

      '<div class="va-iks-card">',
      '  <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;">',
      '    <h4 style="margin:0;color:#ffd36b;">CBSE 2026–27 Gap Audit: Verified Absent Science vs Refuted Myths</h4>',
      '    <div style="display:flex;gap:6px;flex-wrap:wrap;">',
      '      <button type="button" class="va-iks-chip-btn" data-gap-tier="ALL" aria-pressed="' + (ui.gapTierFilter === 'ALL') + '">All Tiers</button>',
      '      <button type="button" class="va-iks-chip-btn" data-gap-tier="TIER_1" aria-pressed="' + (ui.gapTierFilter === 'TIER_1') + '">Tier 1: Absent Verified</button>',
      '      <button type="button" class="va-iks-chip-btn" data-gap-tier="TIER_2" aria-pressed="' + (ui.gapTierFilter === 'TIER_2') + '">Tier 2: Non-Eval Box / IX-Only</button>',
      '      <button type="button" class="va-iks-chip-btn" data-gap-tier="TIER_3" aria-pressed="' + (ui.gapTierFilter === 'TIER_3') + '">Tier 3: Refuted Myths</button>',
      '    </div>',
      '  </div>',
      '  <table class="va-iks-table"><thead><tr><th>Tier</th><th>CBSE Chapter / Area</th><th>Current Syllabus Status</th><th>Verified Science / Rigor Boundary</th></tr></thead><tbody>',
      gaps.map(function (g) {
        var tMeta = SCHEMA.CBSE_GAP_TIERS[g.tier];
        return '<tr><td><span class="va-iks-badge" style="background:' + esc(tMeta.color) + ';">' + esc(g.tier) + '</span></td><td><strong>' + esc(g.cbseChapter) + '</strong></td><td>' + esc(g.currentInSyllabus) + '</td><td>' + esc(g.absentVerifiedScience) + '<br><small style="color:#9fc1bc;">Basis: ' + esc(g.evidenceBasis) + '</small></td></tr>';
      }).join(''),
      '  </tbody></table>',
      '</div>',

      '<div class="va-iks-card">',
      '  <h4 style="margin:0 0 8px;color:#80c8be;">Class ' + esc(ui.teacherClassTab) + ' Curriculum Alignment &amp; Topic Assignment</h4>',
      '  <table class="va-iks-table"><thead><tr><th>Domain</th><th>Chapter</th><th>Scope Label</th><th>Learning Outcome</th><th>Assign</th></tr></thead><tbody>',
      mappings.map(function (m) {
        var isAssigned = ui.progress.assignedTopics.indexOf(m.id) !== -1;
        return '<tr><td><strong>' + esc(m.domainId) + '</strong></td><td><code>' + esc(m.chapterId) + '</code> ' + esc(m.chapterTitle) + '</td><td>' + esc(m.scopeLabel) + '</td><td>' + esc(m.learningOutcome) + '</td><td><button type="button" class="va-iks-chip-btn" data-assign-id="' + esc(m.id) + '" aria-pressed="' + isAssigned + '">' + (isAssigned ? '✓ Assigned' : 'Assign') + '</button></td></tr>';
      }).join(''),
      '  </tbody></table>',
      '</div>',

      '<div class="va-iks-card">',
      '  <h4 style="margin:0 0 8px;color:#ffd36b;">Editable Lesson Plan (Domain ' + esc(ui.domainId) + ' · Class ' + esc(ui.teacherClassTab) + ')</h4>',
      '  <textarea id="vaIksLessonPlanBox" class="va-iks-textarea" rows="8">' + esc(savedPlan) + '</textarea>',
      '  <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">',
      '    <button type="button" class="va-iks-chip-btn" id="vaSavePlanBtn">Save Lesson Plan Locally</button>',
      '    <button type="button" class="va-iks-chip-btn" id="vaResetPlanBtn">Reset Template</button>',
      '  </div>',
      '</div>',

      '<div class="va-iks-card">',
      '  <h4 style="margin:0 0 8px;color:#80c8be;">Verification, Student Progress &amp; Privacy Status</h4>',
      '  <p style="margin:0 0 6px;font-size:13px;">Schema Validation: Claims <strong>' + claimAudit.total + '/' + claimAudit.total + '</strong> · Experiments <strong>' + expAudit.total + '/' + expAudit.total + '</strong> · Explored Domains: <strong>' + ui.progress.exploredDomains.length + '/8</strong> · Experiments Run: <strong>' + ui.progress.experimentsRun.length + '/8</strong></p>',
      '  <p style="margin:0;font-size:12px;color:#9fc1bc;">Privacy Protection: Zero personal student health/biometric data is stored or transmitted (all physiological labs run parameterized models locally).</p>',
      auditEntries.length ? ('<div style="margin-top:8px;font-size:12px;color:#cfe2de;"><strong>Recent Local Audit Log:</strong><br>' + auditEntries.slice(0, 4).map(function (a) {
        return esc(a.timestamp.slice(0, 16) + ' · ' + a.action + ' — ' + a.details);
      }).join('<br>') + '</div>') : '',
      '</div>'
    ].join('');

    main.querySelector('#vaTeachIxBtn').addEventListener('click', function () { ui.teacherClassTab = 'IX'; renderTeacherTab(main); });
    main.querySelector('#vaTeachXBtn').addEventListener('click', function () { ui.teacherClassTab = 'X'; renderTeacherTab(main); });
    main.querySelector('#vaTeachPrintBtn').addEventListener('click', function () { openWorksheetWindow(ui.domainId); });
    main.querySelectorAll('[data-gap-tier]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        ui.gapTierFilter = btn.getAttribute('data-gap-tier');
        renderTeacherTab(main);
      });
    });
    main.querySelectorAll('[data-assign-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-assign-id');
        var idx = ui.progress.assignedTopics.indexOf(id);
        if (idx === -1) ui.progress.assignedTopics.push(id);
        else ui.progress.assignedTopics.splice(idx, 1);
        PROGRESS.saveState(ui.progress);
        ADMIN.recordAuditEntry('ASSIGN_TOPIC', id + ' -> ' + (idx === -1 ? 'assigned' : 'unassigned'));
        renderTeacherTab(main);
      });
    });
    main.querySelector('#vaSavePlanBtn').addEventListener('click', function () {
      var val = document.getElementById('vaIksLessonPlanBox').value;
      ui.progress.lessonPlanOverrides[ui.domainId + '-' + ui.teacherClassTab] = val;
      PROGRESS.saveState(ui.progress);
      ADMIN.recordAuditEntry('SAVE_LESSON_PLAN', 'Domain ' + ui.domainId + ' Class ' + ui.teacherClassTab);
      renderTeacherTab(main);
    });
    main.querySelector('#vaResetPlanBtn').addEventListener('click', function () {
      delete ui.progress.lessonPlanOverrides[ui.domainId + '-' + ui.teacherClassTab];
      PROGRESS.saveState(ui.progress);
      renderTeacherTab(main);
    });
  }

  function init() {
    mountHomeSection();
    mountStageAndTeacherHooks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.VA_IKS_UI = {
    open: openDialog,
    close: closeDialog,
    getState: function () { return ui; }
  };
})();
