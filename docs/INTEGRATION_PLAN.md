# INTEGRATION PLAN — Universal IKS × Modern Science Integration Engine

**Target Application:** Infinite Horizons (`anveshix/ifinite-horizon`)  
**Integration Version:** 2.0  
**Strategy:** Non-destructive, zero-build-step modular extension aligned with Infinite Horizons's existing UMD/IIFE architecture.

---

## 1. Logical Layer Mapping to Existing Repository

We adapt the 10 logical layers into `modules/iks-science/` (pure UMD modules testable directly in Node.js AND usable directly in browser `<script>` tags) plus a thin Infinite Horizons UI shell (`assets/va-iks.js` and `assets/va-iks.css`):

| Logical Layer | Module File | Responsibility |
|---|---|---|
| 1. Content Repository (8 Domains) | `modules/iks-science/content/domains-data.js` | Domains A–H bilingual EN+HI content, glossary, historical–modern comparison, scope boundaries |
| 2. Evidence & Reference Engine | `modules/iks-science/historical-sources/evidence-engine.js` | Structured claims with all 15 metadata fields, `H1`/`H2`/`P1`/`T1`/`S1`/`S2`/`D1`/`U1` classifications, insufficiency & pending-ref enforcement |
| 3. Scientific Verification & Schemas | `modules/iks-science/schemas/evidence-schema.js` | Strict runtime schema validation for claims, experiments, curriculum records, and assessments |
| 4. CBSE Curriculum Mapping Engine | `modules/iks-science/curriculum/cbse-mapping.js` | Separate Class IX & Class X (CBSE 2026–27) mappings, 5 content scope labels, outcome alignment, non-compulsory enrichment flag |
| 5. Interactive Experiment Engine | `modules/iks-science/experiments/experiment-engine.js` | 8 standardized 23-field experiments (A–H), Activity Types `A`–`E`, deterministic scientific simulation models, CSV/MD/JSON report export |
| 6. 2D/3D Visualization Engine | `modules/iks-science/visualizations/viz-engine.js` | Lightweight responsive Canvas 2D/SVG interactive engine (rotate/angle, pan, zoom, play/pause/reset, step-by-step, comparison mode, labels, fullscreen, low-bandwidth fallback) |
| 7. Student Assessment Engine | `modules/iks-science/assessments/assessment-engine.js` | Bilingual EN+HI competency-tagged questions (Knowledge, Application, Analysis/Evaluation), rubrics, instant evidence-based feedback |
| 8 & 9. Teacher Integration & Analytics | `modules/iks-science/analytics/progress-service.js` | Privacy-first `localStorage` (`va.iks.v1`), Teacher Dashboard summary & printable sheets/lesson plans, zero PII/health tracking |
| 10. Content Admin & Version Control | `modules/iks-science/services/admin-service.js` | Feature flags (`VA_IKS_FLAGS`), schema-gated publishing (`verified`/`teacher-reviewed`/`draft`), browser-local audit log (`va.iks.audit.v1`) |
| Shell UI & Infinite Horizons Hooks | `assets/va-iks.js`, `assets/va-iks.css` | Home section (`#vaIksHomeSection`), Hero & Stagebar buttons, `#teacher` integration, full-viewport accessible `#vaIksDialog` workspace |

---

## 2. Staged Execution Plan

- **Stage 1 (Audit):** Complete `ARCHITECTURE_AUDIT.md`, `INTEGRATION_PLAN.md`, `RISK_REGISTER.md`, `CURRICULUM_MAPPING.md`.
- **Stage 2 (Schemas & Evidence):** Implement `evidence-schema.js` and `evidence-engine.js` with strict anti-fabrication rules.
- **Stage 3 (Curriculum Mapping):** Implement `cbse-mapping.js` separating Class IX and Class X CBSE 2026–27 mappings and linking to existing Infinite Horizons topic keys (`ix1`–`ix12`, `ch1`–`ch13`).
- **Stage 4 (Pilot Module + Content System):** Implement Domain A (Ancient Indian Atomic Thought) through Domain H (Traditional Ecological Knowledge incl. Jharkhand & Santhal Pargana) in `domains-data.js`.
- **Stage 5 (Experiment Engine):** Implement all 8 domain experiments with 23 standardized fields and deterministic scientific simulation equations in `experiment-engine.js`.
- **Stage 6 (Visualization Engine):** Implement `viz-engine.js` with full interactive controls (rotate/pan/zoom/play/pause/reset/compare/step/labels/fullscreen) and zero heavy downloads.
- **Stage 7 (Assessment, Analytics, Admin):** Implement `assessment-engine.js`, `progress-service.js`, `admin-service.js`.
- **Stage 8 (UI Integration):** Build `assets/va-iks.css` and `assets/va-iks.js`, wire into `index.html` (Home section, Hero CTA, Toolkit card, Stagebar, Teacher Dashboard) behind feature flag `window.VA_IKS_ENABLED` (default `true`, disableable via `?iks=0`).
- **Stage 9 (Testing & Verification):** Add `tests/iks-science.js` covering schemas, evidence rules, scientific calculations/units/physical bounds, curriculum separation, assessment scoring, admin publishing gates, XSS escaping, and existing `npm test` regression checks.
- **Stage 10 (Documentation & Readiness):** Publish test results, performance budget measurements, known limitations, and deployment instructions.

---

## 3. Rollout & Feature Flag Control

- Runtime kill-switch: `?iks=0` query parameter or `localStorage.setItem('va.iks.enabled', '0')` disables the IKS UI integration cleanly without affecting existing 3D lessons, simulators, mind map, or teacher dashboard.
- No existing files (`va-simulator-core.js`, `va-mindmap-core.js`, `va-curiosity.js`, `va-ai-tools.js`, `api/ai/*`) are overwritten destructively; `index.html` receives minimal additive `<link>`/`<script>` tags and a dedicated home mount container.
