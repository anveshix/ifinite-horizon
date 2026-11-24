# Critical review — Infinite Horizons from different student groups

Method: scripted browser runs (desktop, Pixel-5 phone, 6× CPU + 1.6 Mbps throttle, offline), code reading, and a pass over every topic. Date: 2026-11-24. ✔ = fixed in this change; ⚠ = open.

## Summary table

| # | Student group | Finding | Severity | Status |
|---|---|---|---|---|
| 1 | Village / low-connectivity | The app claimed "works offline" / "Offline ready" in 4 places but shipped **no service worker and no manifest** (`vercel.json` even referenced both). Not installable, no offline. | Critical | ✔ `sw.js` + `manifest.webmanifest` + icons; verified: offline reload renders and topics open |
| 2 | All students | Topics without a guided sequence kept the **previous topic's "Step by step" list** (e.g. Periodic table showed Ohm's-law steps). | High | ✔ list cleared and section hidden |
| 3 | Phone users | 22 controls smaller than 44 px; 130 text nodes at 11–12 px | High | ✔ 44 px hit areas on touch devices; ⚠ 11–12 px text remains |
| 4 | Low-end phone | `index.html` is 2.4 MB (engine inlined). At 6× CPU / 1.6 Mbps: **14.5 s to load, ~6 fps** in a scene. First paint is fast (0.4 s) but the page is unusable until parsing ends. | High | ⚠ split the engine into a cacheable file, lazy-load 3D after first paint (service worker now caches repeat visits) |
| 5 | Hindi-medium | Hindi covers titles, intros, labels, questions and cards, but **tool buttons, HUD captions, quiz options and quiz explanations are English only**; Hindi-only mode leaves those untranslated. | High | ⚠ |
| 6 | Phone users | Lab controls, steps and quiz live in the side **Panel, collapsed by default on phones** — a student sees the model but not how to operate it. The model uses < 60 % of the screen. | Medium | ⚠ bottom-sheet with controls, larger model |
| 7 | Exam-prep (board) | Practice is MCQ only. The paper design (50/30/20, assertion-reason, case-based, source-based) has no matching practice; no marks-weighted tests, formula sheet, revision summary or printable notes. | Medium | ⚠ |
| 8 | Slow learners | 45 of 184 topics (30 recent + 15 older) have **no guided steps**; no glossary; no prerequisite hints ("revise Ch 11 first"). | Medium | ⚠ |
| 9 | Colour-vision deficiency | Meaning carried by red/green only (beetle colours, pH scale, circuit current dots); no pattern/shape alternative. | Medium | ⚠ |
| 10 | Screen-reader / keyboard | 3D canvas has a generic label only; parts are reachable by pointer, not keyboard. Reduced-motion CSS and A/A+/A++ text size exist ✔. | Medium | ⚠ |
| 11 | Search / navigation | Search covers the current class only: searching "mitosis" in Class X returns nothing and gives no hint to switch to Class IX. Home hero says "Every Class X chapter" only. Sidebar still lists the 2025–26 Class IX tab. | Low–Medium | ⚠ |
| 12 | Curious / advanced | Curiosity Lab and IX Advanced exist; the gap-fill topics link to existing labs only (no new lab interactions). | Low | ⚠ |
| 13 | Everyone | Content added in this programme (30 gap-fill topics) follows textbook knowledge; no subject-teacher review yet. | Process | ⚠ |
| 14 | Deployed on GitHub Pages | `/api/ai/*` is a Vercel serverless route; on Pages it 404s (the AI button simply does not appear). | Info | ⚠ decide hosting |

## Suggested next steps (highest value first)
1. Split/lazy-load the 3D engine; measure on a real ₹8–10k Android phone.
2. Phone layout: controls in a bottom sheet, bigger model, ≥ 14 px body text.
3. Full Hindi mode: translate tool labels, HUD captions, quiz options and explanations (data-driven: add a `hi` field next to each string).
4. Exam-practice mode: assertion-reason, case-based and short-answer items tagged by competency (50/30/20) and unit marks.
5. Guided steps for the 45 topics without them; glossary and prerequisite chips.
6. Accessibility: non-colour cues, keyboard access to parts, text alternatives for each scene.
7. Teacher review loop for the new topics.
