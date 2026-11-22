(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../schemas/evidence-schema'));
  } else {
    root.VA_IKS_VIZ = factory(root.VA_IKS_SCHEMA);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (SCHEMA) {
  'use strict';

  var SCHEMATIC_DISCLAIMER = 'Conceptual / Simulated Schematic — For educational comparison only; not a literal microscopic or real-world measurement.';
  var SCHEMATIC_DISCLAIMER_HI = 'वैचारिक / अनुरूपित आरेख — केवल शैक्षिक तुलना हेतु; वास्तविक सूक्ष्म या भौतिक माप नहीं।';

  var STEP_DESCRIPTIONS = {
    A: [
      'Step 1 · Philosophical Postulate: Kaṇāda’s Paramanu (indivisible concept) combining into Dvyaṇuka.',
      'Step 2 · Dalton & Thomson: Quantitative mass ratios (1808) & electron discovery (1897).',
      'Step 3 · Rutherford & Bohr: Dense positive nucleus + quantized electron shells.',
      'Step 4 · Comparison: Subatomic Z, N, e⁻ determine reactivity; Paramanu has no subatomic structure.'
    ],
    B: [
      'Step 1 · Baudhāyana Cord Construction: Right-angle rectangle sides a and b.',
      'Step 2 · Square Areas: Area a² + b² equals diagonal square c².',
      'Step 3 · Āryabhaṭa Polygon Approximation: Inscribed polygon perimeter approaching 3.1416 × diameter.',
      'Step 4 · Modern Rigor: Algebraic proof + irrationality of √2 and π.'
    ],
    C: [
      'Step 1 · Historical Documentation: Suśruta yantra/śastra classification & botanical logs.',
      'Step 2 · Active Molecule Isolation: Laboratory assay of plant extracts (in vitro).',
      'Step 3 · Pharmacokinetics: Oral bioavailability & hepatic first-pass attenuation.',
      'Step 4 · Clinical EBM Standard: Controlled human RCT required before treatment claims.'
    ],
    D: [
      'Step 1 · Diaphragm Contraction: Thoracic cavity expands; intrapulmonary pressure drops.',
      'Step 2 · Dead Space vs Alveoli: First 150 mL stays in conducting airways (V_D).',
      'Step 3 · Gas Exchange: Deeper V_T increases alveolar ventilation fraction (V_A/V_E).',
      'Step 4 · Autonomic Recovery: Simulated vagal slowing of heart rate post-exertion.'
    ],
    E: [
      'Step 1 · Forged Iron Substrate: Gupta wrought iron (~0.25% P) vs mild steel (0.02% P).',
      'Step 2 · Electrochemical Cell: Fe oxidizes at anode in presence of H₂O and O₂.',
      'Step 3 · Passive Phosphate Film: Phosphorus aids crystalline protective misawite/phosphate layer.',
      'Step 4 · Salinity Boundary: High Cl⁻ ions break down passivation—never "magical rust-proof".'
    ],
    F: [
      'Step 1 · Heating Chamber: Safe aqueous NaCl / floral water heated toward boiling plateau.',
      'Step 2 · Vapor Transport: Inclined tube (Tiryakpātana / Deg–Bhapka chonga) carries steam.',
      'Step 3 · Counter-Current Condensation: Cool water jacket condenses pure H₂O vapor.',
      'Step 4 · Separation Outcome: Non-volatile Na⁺/Cl⁻ remain behind; distillate has 0 ppm salt.'
    ],
    G: [
      'Step 1 · Axial Tilt & Latitude: Observer latitude φ and solar declination δ set Sun elevation α.',
      'Step 2 · Gnomon Shadow: Vertical Śaṅku / Samrat Yantra casts shadow L = h / tan α.',
      'Step 3 · Eclipse Shadow Optics: Earth/Moon cast umbra & penumbra cones (Āryabhaṭa).',
      'Step 4 · Scientific Demarcation: Astronomy = orbital mechanics; Astrology = excluded non-science.'
    ],
    H: [
      'Step 1 · Monsoon Incident Rain: Intense rainfall hits undulating Chota Nagpur plateau slope.',
      'Step 2 · Sarna Forest Canopy: Sal/Mahua litter slows overland flow and aids soil infiltration.',
      'Step 3 · Dobha & Ahar–Pyne Capture: Farm pond/embankment stores seasonal runoff.',
      'Step 4 · Context Boundary: Steep slopes (>11%) or severe drought exceed local pond capacity.'
    ]
  };

  function createViewState(domainId) {
    return {
      domainId: domainId || 'A',
      zoom: 1,
      panX: 0,
      panY: 0,
      rotateDeg: 0,
      playing: true,
      phase: 0,
      step: 0,
      showLabels: true,
      showAnnotations: true,
      compareMode: true,
      lowBandwidth: false
    };
  }

  function stepLabel(domainId, stepIdx) {
    var list = STEP_DESCRIPTIONS[domainId] || STEP_DESCRIPTIONS.A;
    var idx = Math.max(0, Math.min(list.length - 1, stepIdx || 0));
    return list[idx];
  }

  function renderSeriesSvg(series, graphConfig) {
    var pts = Array.isArray(series) ? series : [];
    var W = 540;
    var H = 210;
    var padL = 48;
    var padR = 18;
    var padT = 26;
    var padB = 34;
    if (!pts.length) {
      return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Empty graph"></svg>';
    }
    var minX = pts[0].x, maxX = pts[0].x, minY = pts[0].y, maxY = pts[0].y;
    pts.forEach(function (p) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });
    if (maxX === minX) maxX = minX + 1;
    if (maxY === minY) maxY = minY + 1;
    minY = Math.min(0, minY);

    function sx(x) { return padL + ((x - minX) / (maxX - minX)) * (W - padL - padR); }
    function sy(y) { return H - padB - ((y - minY) / (maxY - minY)) * (H - padT - padB); }

    var pathD = pts.map(function (p, i) {
      return (i === 0 ? 'M' : 'L') + sx(p.x).toFixed(1) + ',' + sy(p.y).toFixed(1);
    }).join(' ');

    var circles = pts.map(function (p) {
      var fill = p.active ? '#ffd36b' : '#80c8be';
      var r = p.active ? 5 : 3.2;
      return '<circle cx="' + sx(p.x).toFixed(1) + '" cy="' + sy(p.y).toFixed(1) + '" r="' + r + '" fill="' + fill + '"><title>(' + p.x + ', ' + p.y + ')</title></circle>';
    }).join('');

    var title = SCHEMA.escapeHtml((graphConfig && graphConfig.title) || 'Simulation Graph');
    var xLab = SCHEMA.escapeHtml((graphConfig && graphConfig.xLabel) || 'X');
    var yLab = SCHEMA.escapeHtml((graphConfig && graphConfig.yLabel) || 'Y');

    return [
      '<svg class="va-iks-svg-graph" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + title + '">',
      '<rect x="0" y="0" width="' + W + '" height="' + H + '" rx="10" fill="#0d2025"/>',
      '<text x="' + (W / 2) + '" y="16" text-anchor="middle" fill="#e6efed" font-size="11" font-weight="600">' + title + '</text>',
      '<line x1="' + padL + '" y1="' + (H - padB) + '" x2="' + (W - padR) + '" y2="' + (H - padB) + '" stroke="#4a6f74" stroke-width="1"/>',
      '<line x1="' + padL + '" y1="' + padT + '" x2="' + padL + '" y2="' + (H - padB) + '" stroke="#4a6f74" stroke-width="1"/>',
      '<path d="' + pathD + '" fill="none" stroke="#80c8be" stroke-width="2.4"/>',
      circles,
      '<text x="' + padL + '" y="' + (H - padB + 14) + '" fill="#a3c2be" font-size="10">' + minX + '</text>',
      '<text x="' + (W - padR) + '" y="' + (H - padB + 14) + '" text-anchor="end" fill="#a3c2be" font-size="10">' + maxX + '</text>',
      '<text x="' + ((padL + W - padR) / 2) + '" y="' + (H - 6) + '" text-anchor="middle" fill="#ffd36b" font-size="10">' + xLab + '</text>',
      '<text x="8" y="' + (padT + 8) + '" fill="#a3c2be" font-size="10">' + maxY.toFixed(1) + '</text>',
      '<text x="8" y="' + (H - padB) + '" fill="#a3c2be" font-size="10">' + minY.toFixed(1) + '</text>',
      '<text x="12" y="' + ((padT + H - padB) / 2) + '" transform="rotate(-90 12 ' + ((padT + H - padB) / 2) + ')" text-anchor="middle" fill="#ffd36b" font-size="9.5">' + yLab + '</text>',
      '</svg>'
    ].join('');
  }

  function drawOnCanvas(canvas, state, simOutput) {
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var W = canvas.width;
    var H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background grid
    ctx.fillStyle = '#0c1f24';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(128,200,190,0.08)';
    ctx.lineWidth = 1;
    for (var gx = 0; gx < W; gx += 32) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
    }
    for (var gy = 0; gy < H; gy += 32) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }

    ctx.save();
    ctx.translate(W / 2 + (state.panX || 0), H / 2 + (state.panY || 0));
    var z = state.zoom || 1;
    ctx.scale(z, z);

    var d = state.domainId;
    var ph = state.phase || 0;
    var rot = ((state.rotateDeg || 0) * Math.PI) / 180;
    var showLab = state.showLabels !== false;
    var compare = state.compareMode !== false;

    if (d === 'A') {
      // Left: Conceptual Paramanu (Dvyanuka); Right: Modern Bohr Atom
      if (compare) {
        ctx.save();
        ctx.translate(-155, 0);
        ctx.strokeStyle = '#bd6e3b';
        ctx.fillStyle = 'rgba(189,110,59,0.22)';
        ctx.beginPath(); ctx.arc(-22, 0, 20, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(22, 0, 20, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        if (showLab) {
          ctx.fillStyle = '#f2c199'; ctx.font = '12px Inter, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('Vaisheshika Dvyaṇuka', 0, -45);
          ctx.fillText('(Philosophical P1 · No e⁻/p⁺)', 0, 48);
        }
        ctx.restore();
      }
      ctx.save();
      ctx.translate(compare ? 135 : 0, 0);
      ctx.rotate(rot);
      var shells = (simOutput && simOutput.shells) ? simOutput.shells : [2, 4];
      var Z = (simOutput && simOutput.protons) || 6;
      // Nucleus
      ctx.fillStyle = '#ffd36b';
      ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#13252a'; ctx.font = 'bold 11px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(Z + 'p⁺', 0, 0);
      // Shells & electrons
      shells.forEach(function (cnt, sIdx) {
        var r = 34 + sIdx * 26;
        ctx.strokeStyle = 'rgba(128,200,190,0.45)';
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
        for (var k = 0; k < cnt; k++) {
          var ang = (k / cnt) * Math.PI * 2 + ph * (0.8 - sIdx * 0.15);
          var ex = Math.cos(ang) * r;
          var ey = Math.sin(ang) * r;
          ctx.fillStyle = '#80c8be';
          ctx.beginPath(); ctx.arc(ex, ey, 4.2, 0, Math.PI * 2); ctx.fill();
        }
      });
      if (showLab) {
        ctx.rotate(-rot);
        ctx.fillStyle = '#82d4c4'; ctx.font = '12px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('Modern Atomic Model (S1): ' + ((simOutput && simOutput.elementName) || 'Carbon'), 0, 118);
      }
      ctx.restore();
    } else if (d === 'B') {
      // Baudhayana Right Triangle + Squares
      var a = (simOutput && simOutput.sideA) ? Math.min(10, simOutput.sideA) : 3;
      var b = (simOutput && simOutput.sideB) ? Math.min(10, simOutput.sideB) : 4;
      var sc = 15;
      var px = a * sc;
      var py = b * sc;
      ctx.save();
      ctx.rotate(rot);
      ctx.translate(-px / 2, py / 2);
      // Triangle
      ctx.fillStyle = 'rgba(128,200,190,0.25)';
      ctx.strokeStyle = '#80c8be';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(px, 0); ctx.lineTo(0, -py); ctx.closePath();
      ctx.fill(); ctx.stroke();
      // Square on a
      ctx.fillStyle = 'rgba(255,211,107,0.16)';
      ctx.strokeStyle = '#ffd36b';
      ctx.fillRect(0, 0, px, px); ctx.strokeRect(0, 0, px, px);
      // Square on b
      ctx.fillStyle = 'rgba(189,110,59,0.22)';
      ctx.strokeStyle = '#bd6e3b';
      ctx.fillRect(-py, -py, py, py); ctx.strokeRect(-py, -py, py, py);
      if (showLab) {
        ctx.fillStyle = '#ffd36b'; ctx.font = '12px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('a²=' + (a * a), px / 2, px / 2);
        ctx.fillStyle = '#f2c199';
        ctx.fillText('b²=' + (b * b), -py / 2, -py / 2);
        ctx.fillStyle = '#e6efed';
        ctx.fillText('c = ' + ((simOutput && simOutput.diagonalC) || 5), px / 2 + 18, -py / 2 - 10);
      }
      ctx.restore();
    } else if (d === 'C') {
      // Evidence-Based Pharmacology Funnel: Botanical -> In Vitro -> Bioavailability -> RCT
      var stages = [
        { label: 'Historical Plant Log (T1/H1)', w: 250, col: '#bd6e3b' },
        { label: 'In-Vitro Assay (S2)', w: 195, col: '#2b7a78' },
        { label: 'Systemic Absorption (' + ((simOutput && simOutput.bioavailability) || 10) + '%)', w: 145, col: '#1b6ca8' },
        { label: 'Human RCT Verified?', w: 105, col: '#ffd36b' }
      ];
      stages.forEach(function (st, idx) {
        var y = -95 + idx * 54;
        ctx.fillStyle = st.col;
        ctx.globalAlpha = 0.28 + (idx === 3 ? 0.12 : 0);
        ctx.fillRect(-st.w / 2, y, st.w, 38);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = st.col;
        ctx.lineWidth = 1.6;
        ctx.strokeRect(-st.w / 2, y, st.w, 38);
        if (showLab) {
          ctx.fillStyle = '#e6efed'; ctx.font = '12px Inter, sans-serif'; ctx.textAlign = 'center';
          ctx.fillText(st.label, 0, y + 23);
        }
      });
    } else if (d === 'D') {
      // Diaphragm & Alveolar vs Dead-Space Volume Bars
      var freq = (simOutput && simOutput.freq) || 10;
      var eff = (simOutput && simOutput.alveolarEfficiencyPct) || 72;
      var breathPhase = 0.5 + 0.5 * Math.sin(ph * (freq / 8));
      ctx.save();
      ctx.translate(-110, 0);
      // Ribcage schematic
      var expand = 12 * breathPhase;
      ctx.strokeStyle = '#80c8be'; ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, -10, 54 + expand, 68, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Diaphragm arc
      ctx.strokeStyle = '#ffd36b'; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-54, 48);
      ctx.quadraticCurveTo(0, 22 + 28 * breathPhase, 54, 48);
      ctx.stroke();
      if (showLab) {
        ctx.fillStyle = '#e6efed'; ctx.font = '12px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('Thoracic Expansion', 0, -90);
        ctx.fillStyle = '#ffd36b';
        ctx.fillText('Diaphragm', 0, 72);
      }
      ctx.restore();
      // Right: Alveolar efficiency bar
      ctx.save();
      ctx.translate(115, 0);
      ctx.strokeStyle = '#4a6f74'; ctx.strokeRect(-45, -75, 90, 140);
      var alvH = (eff / 100) * 140;
      ctx.fillStyle = 'rgba(128,200,190,0.45)';
      ctx.fillRect(-45, 65 - alvH, 90, alvH);
      ctx.fillStyle = 'rgba(189,110,59,0.45)';
      ctx.fillRect(-45, -75, 90, 140 - alvH);
      if (showLab) {
        ctx.fillStyle = '#e6efed'; ctx.font = '11.5px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('Alveolar ' + eff + '%', 0, 20);
        ctx.fillText('Dead space V_D', 0, -52);
      }
      ctx.restore();
    } else if (d === 'E') {
      // Cross-section of Iron substrate + Phosphate Passive Layer vs Mild Steel rust
      var p = (simOutput && simOutput.phosphorus) || 0.26;
      var ox = (simOutput && simOutput.oxideUm) || 12;
      ctx.save();
      ctx.rotate(rot * 0.25);
      // Bulk Iron
      ctx.fillStyle = '#4b5b63';
      ctx.fillRect(-200, 10, 400, 72);
      // Passive phosphate film (stronger when high P)
      var filmH = p >= 0.2 ? 12 : 3;
      ctx.fillStyle = '#80c8be';
      ctx.fillRect(-200, 10 - filmH, 400, filmH);
      // Oxide layer proportional to ox
      var rustH = Math.min(48, Math.max(4, ox * 0.45));
      ctx.fillStyle = 'rgba(189,110,59,0.75)';
      ctx.fillRect(-200, 10 - filmH - rustH, 400, rustH);
      if (showLab) {
        ctx.fillStyle = '#e6efed'; ctx.font = '12px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('Fe Substrate (Wrought Iron / Steel, P=' + p + '%)', 0, 52);
        ctx.fillStyle = '#82d4c4';
        ctx.fillText('Passive Phosphate Barrier', 0, -5);
        ctx.fillStyle = '#ffd36b';
        ctx.fillText('Modeled Oxide Layer: ' + ox + ' µm', 0, -filmH - rustH - 12);
      }
      ctx.restore();
    } else if (d === 'F') {
      // Tiryakpatana / Liebig Aqueous Hydro-Distillation Schematic
      ctx.save();
      // Boiling vessel
      ctx.strokeStyle = '#ffd36b'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(-145, 25, 44, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgba(128,200,190,0.28)';
      ctx.beginPath(); ctx.arc(-145, 25, 42, 0.15, Math.PI - 0.15); ctx.fill();
      // Inclined condenser tube
      ctx.strokeStyle = '#80c8be'; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(-110, -5); ctx.lineTo(105, 30); ctx.stroke();
      // Cooling jacket
      ctx.strokeStyle = 'rgba(128,200,190,0.35)'; ctx.lineWidth = 24;
      ctx.beginPath(); ctx.moveTo(-65, 2); ctx.lineTo(65, 23); ctx.stroke();
      // Receiver flask
      ctx.strokeStyle = '#82d4c4'; ctx.lineWidth = 2;
      ctx.strokeRect(110, 15, 64, 72);
      var dropY = 38 + ((ph * 25) % 40);
      ctx.fillStyle = '#80c8be';
      ctx.beginPath(); ctx.arc(142, dropY, 4, 0, Math.PI * 2); ctx.fill();
      if (showLab) {
        ctx.fillStyle = '#e6efed'; ctx.font = '12px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('Saline Boiler (' + ((simOutput && simOutput.heaterTemp) || 104) + '°C)', -145, 88);
        ctx.fillText('Inclined Condenser (Tiryakpātana / Liebig)', 0, -25);
        ctx.fillText('Pure H₂O (0 ppm)', 142, 105);
      }
      ctx.restore();
    } else if (d === 'G') {
      // Gnomon Sun Elevation & Shadow
      var alt = (simOutput && simOutput.altitudeDeg) || 45;
      var rad = (alt * Math.PI) / 180;
      var gnomonH = 75;
      var shLen = Math.min(200, gnomonH / Math.max(0.25, Math.tan(rad)));
      ctx.save();
      // Ground
      ctx.strokeStyle = '#80c8be'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-210, 65); ctx.lineTo(210, 65); ctx.stroke();
      // Vertical Sanku gnomon
      ctx.strokeStyle = '#e6efed'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-90, 65); ctx.lineTo(-90, 65 - gnomonH); ctx.stroke();
      // Shadow
      ctx.strokeStyle = '#ffd36b'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(-90, 65); ctx.lineTo(-90 + shLen, 65); ctx.stroke();
      // Sun ray
      ctx.strokeStyle = 'rgba(255,211,107,0.55)'; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-90 - Math.cos(rad) * 120, 65 - gnomonH - Math.sin(rad) * 120);
      ctx.lineTo(-90 + shLen, 65); ctx.stroke(); ctx.setLineDash([]);
      // Sun disc
      ctx.fillStyle = '#ffd36b';
      ctx.beginPath(); ctx.arc(-90 - Math.cos(rad) * 110, 65 - gnomonH - Math.sin(rad) * 110, 12, 0, Math.PI * 2); ctx.fill();
      if (showLab) {
        ctx.fillStyle = '#e6efed'; ctx.font = '12px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('Śaṅku (1 m)', -128, 30);
        ctx.fillStyle = '#ffd36b';
        ctx.fillText('Shadow L = ' + ((simOutput && simOutput.shadowLengthM) || 1) + ' m (α=' + alt + '°)', -90 + shLen / 2, 86);
      }
      ctx.restore();
    } else if (d === 'H') {
      // Jharkhand Slope + Sarna Trees + Dobha Pond + Infiltration Arrow
      var slope = (simOutput && simOutput.slope) || 5;
      var dy = slope * 4.5;
      ctx.save();
      ctx.fillStyle = 'rgba(189,110,59,0.28)';
      ctx.strokeStyle = '#bd6e3b'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-220, -dy); ctx.lineTo(100, dy * 0.4); ctx.lineTo(130, dy * 0.4 + 28);
      ctx.lineTo(190, dy * 0.4 + 28); ctx.lineTo(220, dy * 0.4); ctx.lineTo(220, 95); ctx.lineTo(-220, 95); ctx.closePath();
      ctx.fill(); ctx.stroke();
      // Dobha water
      ctx.fillStyle = 'rgba(128,200,190,0.58)';
      ctx.fillRect(122, dy * 0.4 + 8, 76, 20);
      // Sarna grove trees
      [-150, -110, -70].forEach(function (tx) {
        var ty = -dy + ((tx + 220) / 320) * (dy * 1.4);
        ctx.fillStyle = '#2e7d6b';
        ctx.beginPath(); ctx.arc(tx, ty - 22, 16, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#bd6e3b'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx, ty - 12); ctx.stroke();
      });
      if (showLab) {
        ctx.fillStyle = '#e6efed'; ctx.font = '12px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('Sarna / Sal Cover (' + ((simOutput && simOutput.cover) || 55) + '%)', -110, -dy - 48);
        ctx.fillStyle = '#82d4c4';
        ctx.fillText('Dobha Capture', 160, dy * 0.4 - 6);
        ctx.fillStyle = '#ffd36b';
        ctx.fillText('Runoff: ' + ((simOutput && simOutput.runoffMm) || 0) + ' mm | Stored/Infilt: ' + ((simOutput && simOutput.infiltrationAndStoredMm) || 0) + ' mm', 0, 82);
      }
      ctx.restore();
    }

    ctx.restore();

    // Schematic Disclaimer footer
    ctx.fillStyle = 'rgba(8, 21, 24, 0.86)';
    ctx.fillRect(0, H - 24, W, 24);
    ctx.fillStyle = '#ffd36b';
    ctx.font = '10.5px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(SCHEMATIC_DISCLAIMER, W / 2, H - 9);
  }

  return {
    SCHEMATIC_DISCLAIMER: SCHEMATIC_DISCLAIMER,
    SCHEMATIC_DISCLAIMER_HI: SCHEMATIC_DISCLAIMER_HI,
    STEP_DESCRIPTIONS: STEP_DESCRIPTIONS,
    createViewState: createViewState,
    stepLabel: stepLabel,
    renderSeriesSvg: renderSeriesSvg,
    drawOnCanvas: drawOnCanvas
  };
});
