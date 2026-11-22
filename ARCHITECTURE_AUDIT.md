# ARCHITECTURE AUDIT — Vigyan Atlas (`anveshix/ifinite-horizon`)

**Audit Date:** 2026-11-22  
**Repository:** `anveshix/ifinite-horizon` (branch `arena/e2265803-ifinite-horizon`, base `ff1f0814b3c35ef2183e93581d5d25875ec10ffb`)  
**Audited Version:** `vigyan-atlas` `2.1.0`

---

## 1. Technology Stack & Architecture Identification

| Dimension | Finding (Observed in Repository) |
|---|---|
| **Framework & Version** | **Zero-build static web application** (`framework: null` in `vercel.json`, no bundler, no React/Vue/Next.js). Core shell is `index.html` (8,275 lines, ~2.13 MB) paired with modular vanilla JS (`assets/va-*.js`, `assets/curiosity/`) and CSS (`assets/va-*.css`). |
| **Programming Languages** | Client: Vanilla ES6+ JavaScript (IIFEs, UMD modules, ES Modules for lazy loaders) + HTML5 + CSS3. Backend/Tooling: Node.js CommonJS (`api/ai/*.js`, `lib/ai.js`, `tools/*.cjs/*.mjs`) + Python build utilities (`tools/conditions/build.py`, `tools/inject-anatomy.py`). |
| **Frontend Architecture** | Single-page shell (`index.html`) orchestrated by lightweight custom XState-like state machines (`oh()` for UI screen machine `Qe`, playback machine `Nt`, quiz machine `An`). Views: `#home` (editorial field-guide landing), `#app` (3D stage + `#side` TOC + `#panel` lesson inspector), `#teacher` (educator dashboard), `#report` (student report card), plus full-viewport modal workspaces (`#vaSim`, `#vaMindMap`, `#clOverlay`, `#vaAiDialog`, `#vlab`, `#vcg`). |
| **Backend Architecture** | Optional Vercel Serverless Functions (`api/ai/status.js`, `api/ai/generate.js`, `lib/ai.js`) providing same-origin capability discovery and Google Gemini proxy with Upstash Redis rate limiting. Fails closed when env vars are unset so static/offline deployments remain fully functional. |
| **Database & ORM** | **None.** No relational or document database ORM. Static curriculum JSON (`api/ai/curriculum.json`, `api/ai/supplementary-curriculum.json`, `docs/class9-coverage.json`), JS data registries (`Hi`, `IXC`, `ADC`, `IX25`, `PRAC`, `CGR` in `index.html`; `VA_SIM_CORE` in `assets/va-simulator-core.js`; `VA_CELL_CONTENT`; `VA_TISSUES_CONTENT`; `VA_VOICE_DATA`), and browser-local `localStorage` (`va.v2`, `va.student`, `va.class`, `va.cl.v1`, `va.lab.*`, `va.light`, `va.size`). |
| **Authentication & Authorization** | **None.** No user accounts or server-side sessions. Student-to-teacher progress transfer uses checksummed offline report codes (`VA1.<base64>.<4char-checksum>`). Teacher dashboard (`#teacher`) operates locally in the browser; AI endpoints validate `Origin`/`Host` same-origin headers and server-side input/output schemas. |
| **Routing & State Management** | URL hash routing (`#chX/topic`, `#ixN/topic`, `#ix25_1/states`, `#advN/topic`, `#teacher`, empty hash for `#home`) synchronized via `history.pushState`/`replaceState` and `hashchange`. Global integration surface exposed via `window.__atlas` and `window.__va`. |
| **Design System & Components** | Dual aesthetic: (1) Editorial Field-Guide light surface (`#home`, `#teacher`, `#vaMindMap`, `#vaAiDialog`) using `--va-paper: #f2f0e8`, `--va-ink: #17252a`, `--va-copper: #bd6e3b`, `--va-deep: #13252a`, `--va-teal: #80c8be`; (2) Dark laboratory workspace (`#app`, `#vaSim`, `#clOverlay`) using `#10262b` / `#081518` with high-contrast amber `#ffd36b` and mint `#82d4c4` accents. Self-hosted fonts (`Inter`, `Source Serif 4`, `Noto Sans Devanagari` in `assets/fonts/*.woff2`). |
| **2D/3D Visualization Libraries** | **Three.js r160** bundled inline in `index.html` + lazy ES module loader (`assets/va-assets.js` + `assets/vendor/loaders/GLTFLoader.js` & `DRACOLoader.js` + Draco WASM); **HTML5 Canvas 2D** (`assets/va-simulator.js`, `assets/curiosity/labs/`); **Native SVG** (`assets/va-mindmap.js`, `#leaders` in `index.html`); **Pre-rendered 2D WebP Gallery** (`public/2d/`, `assets/va-2d.js`, `public/2d/conditions.js`). |
| **Educational Content Models** | `Hi` (13 Class X chapters), `IXC` (12 Class IX Compulsory 2026–27 chapters), `ADC` (10 IX Advanced Optional chapters), `IX25` (1 Class IX 2025–26 historical chapter), `PRAC` (13 Virtual Practical Lab entries), `CGR` (CBSE Curricular Goals CG 1–8, including **CG 6: India's contribution to science**), `VA_SIM_CORE.SIMS` (10 interactive inquiries), and bilingual audio hooks (`VA_VOICE_DATA`). |
| **Testing & Deployment Pipeline** | `npm test` runs 6 Node.js `node:assert/strict` suites (`tests/2d-bundle.js`, `tests/simulators.js`, `tests/mindmap.js`, `tests/cell-content.js`, `tests/tissues-content.js`, `tests/ai-tools.js`). `tests/regression.js` uses Playwright (not installed in sandbox). Deployed via Vercel (`vercel.json` with `outputDirectory: "."`, `cleanUrls: true`, security headers). |

---

## 2. Reusable Components & Integration Hooks Identified

1. **UMD Dual-Environment Core Pattern** (`assets/va-simulator-core.js`, `assets/va-mindmap-core.js`): Pure logic/data modules export via `(root, factory)` so both Node.js test suites (`require()`) and browser scripts (`window.*`) consume identical code with zero build step.
2. **Toolkit & Launcher Hub** (`assets/va-tools.js`, `#home .va-tools-section`, `#home .va-hero-actions`, `#stagebar`, `#side #sidelinks`): Ready-made entry points for adding a new learning section cleanly.
3. **Self-Hosted Devanagari Typography & Bilingual Toggle** (`assets/va-fonts.css`, `body.nohi` / `#thi`, `.hi[lang="hi"]`): `Noto Sans Devanagari` (400/500/600) is already bundled locally for offline Hindi rendering.
4. **Accessibility & Theme Controls**: `#size` (`fs2`, `fs3` font scaling), `#tmode` (`body.light` theme toggle), keyboard shortcut handler, focus trapping in modal dialogs (`va-simulator.js`, `va-mindmap.js`, `va-ai-tools.js`), and `prefers-reduced-motion` media queries.
5. **Regional / Contextual Foundations**: `assets/va-voice-data.js` already anchors lessons in Jharkhand contexts (Singhbhum, Ghatsila, Netarhat, Hundru Falls, Sarhul/Sal/Palash, Chhau/Santhali dance, Subarnarekha), and `ix8` includes `"Reflect on changing conditions using traditional knowledge"`.
6. **Student Report & Teacher Dashboard (`#report`, `#teacher`)**: `window.__curiosity` demonstrates how an auxiliary module exposes `reportString()`, `parseReport()`, `chips()`, and `classSummary()` without breaking existing `VA1` codes.

---

## 3. Conflicting Dependencies & Constraints

- **No Bundler / No Transpilation**: Code shipped to the browser must be pure ES6+ browser JS (or UMD/IIFE) without JSX, TypeScript, or bare npm package imports.
- **No `playwright` in Sandbox**: `tests/regression.js` cannot run in this environment; verification must combine comprehensive Node.js unit/scientific/schema/integration/DOM-mock tests with static syntax & link integrity checks.
- **Monolithic `index.html` Risk**: Directly editing deep minified lines inside `index.html` risks regressions. Integration should add minimal, clean mount hooks and load all new IKS engine modules from dedicated files (`modules/iks-science/` + `assets/va-iks.js` + `assets/va-iks.css`).
- **Two-Three.js Instance Pattern**: Only needed for GLB loading (`assets/va-assets.js`); the IKS module should prioritize lightweight SVG/Canvas 2D visualizations so low-end rural/semi-urban Android devices experience near-instant startup and zero extra 3D bundle weight.

---

## 4. Performance, Security & Accessibility Audit Findings

### Performance Bottlenecks
- `index.html` is ~2.13 MB (contains minified Three.js + all 3D scene builders inline). Any new module **must not** inflate `index.html` significantly or load heavy assets upfront.
- Unconditional `setInterval(syncCard, 600)` in `assets/va-curiosity.js` runs continuously; the new IKS module must use event-driven/lazy rendering (`render()` only when dialog is open).
- Offline service worker (`sw.js`) and `manifest.webmanifest` are referenced conditionally in `index.html` and `vercel.json` but absent in checkout (`docs/CBSE_2026-27_REVIEW_AND_PLAN.md` P1 #9).

### Security & Privacy Risks
- **XSS Prevention**: All dynamic user/data rendering must pass through HTML escaping (`esc()`) and avoid `innerHTML` with unvalidated inputs.
- **Student Data Protection**: Existing `va-cell-content.js` / `va-tissues-content.js` explicitly prohibit collecting student weight/age/health data. The IKS Yoga/Physiology module must **never** record personal health/heart-rate data from students to servers or shared teacher exports—simulations must remain parameterized models with clear simulation tags.
- **Content Governance**: AI-generated or unverified content must never auto-publish; structured schema validation + explicit `reviewerStatus` and `evidenceClass` metadata are mandatory.

### Accessibility Risks
- Existing 3D canvases require keyboard/text equivalents. Every new IKS visualization must provide keyboard navigation (`Tab`, `Enter`, `Space`, arrow keys, `Escape`), ARIA roles/live regions (`aria-live="polite"`), high-contrast mode toggle, text alternatives, and full bilingual `lang="hi"` markup.
