# AI tools for the Infinite Horizons dashboard — implementation plan

**Status:** Phase 0 foundation and Phase 1 pilot tools are implemented. The features remain disabled until deployment configuration is supplied; Phases 2/3 and deferred integrations are still plan-only.
**Requested provider:** Google Gemini.
**Deployment context:** the Atlas core remains static and no-build. The optional tools now use Vercel serverless functions; a browser-only integration is not used because it would expose the provider key. They stay off until server-side configuration is complete.

## Product goal

Turn the dashboard from a launcher into a small, trustworthy set of classroom workflows. Start with tools that can use Infinite Horizons's existing Class IX chapter registry and produce editable, printable materials. Do not reproduce the reference's whole list as disconnected cards, and do not label ordinary templates as AI.

## Rollout order

### Phase 0 — safe AI foundation (required before any public AI feature)

Implemented in the pilot:
1. Same-origin Vercel functions: `GET /api/ai/status` and `POST /api/ai/generate`.
2. `GEMINI_API_KEY` and `GEMINI_MODEL` are read only on the server; secrets are never placed in browser assets. The feature also requires an explicit `AI_TOOLS_ENABLED` flag, Upstash REST settings, and a private rate-limit salt.
3. The browser sends only an allow-listed tool ID, Class IX chapter ID, language, and bounded form inputs. Provider prompts/model/URL are fixed server-side.
4. Server-side chapter context is generated from the existing `IXC` Class IX curriculum registry. Request/output schemas, timeout, body-size, origin, and chapter bounds are enforced; only validated JSON results are returned.
5. Provider errors are reduced to stable error codes. Provider bodies, prompts, and stack traces are not returned or logged.
6. Shared Upstash counters fail closed: 8 requests/minute and 40/day per keyed IP hash, plus a 100-request daily global ceiling. Google project quotas/budget alerts are still required; the fixed request ceiling is not a monetary guarantee.
7. If a complete configuration is absent, status is disabled and AI cards stay hidden; existing Atlas features remain usable.

**Implemented request envelope**

```json
{
  "schemaVersion": 1,
  "toolId": "lesson-plan",
  "course": "ix",
  "chapterId": "ix9",
  "locale": "en",
  "inputs": { "durationMinutes": 40, "learningGoals": "...", "teacherNotes": "..." }
}
```

`chapterId` is one of the 12 current Class IX compulsory IDs (`ix1`–`ix12`), not an individual visual model key. The response carries `toolId`, `schemaVersion`, authoritative chapter metadata, a typed `result`, and `reviewRequired: true`. Stable error codes include `AI_NOT_CONFIGURED`, `RATE_LIMITED`, `AI_CAP_REACHED`, `RATE_LIMIT_UNAVAILABLE`, `INVALID_INPUT`, `AI_TIMEOUT`, and `AI_INVALID_OUTPUT`.

### Phase 1 — teacher authoring tools (first pilot)

1. **Lesson planner — implemented** — Class IX chapter, 20–90 minute duration, optional teacher-selected learning goals, English/Hindi output, and bounded teacher notes. Returns objectives, timed sequence, materials, understanding checks, differentiation, and exit ticket. All generated content is labelled as a draft for review.
2. **Quiz & worksheet builder — implemented** — Class IX chapter, 5–10 questions, mixed/MCQ/short-answer format, difficulty, language, and bounded notes. Returns questions, choices/answer key, rationales, marks, and chapter metadata. The server checks schema, answer indexes, question count, and computes total marks.

The current UI provides **Edit**, **Regenerate draft**, **Copy**, and **Print / Save PDF** (not section-only regeneration). It never publishes or assigns generated material. English and Hindi are offered, but translations require teacher review.

### Phase 2 — explain and adapt existing Atlas content

3. **Concept explainer / doubt solver** — answer one selected Class IX topic at a time, using only supplied chapter context plus the learner's question; provide a short explanation, example, misconception check, and a “show in Atlas” link. If the answer is outside that context, say so instead of inventing a syllabus claim.
4. **Notes and presentation outline** — create structured revision notes or a slide-by-slide outline from an existing chapter, with key terms, figures/models to open, and a short recap. Export text/print first; do not promise a downloadable slide deck until a real export format is implemented.
5. **Activity and project planner** — suggest safe, low-cost, age-appropriate activities tied to selected objectives, with materials, procedure, observation prompt, and explicit safety notes. Require teacher review; never suggest hazardous home experiments.

### Phase 3 — student practice and language support

6. **Concept mastery coach** — practice a chosen topic with hints and progressively harder questions; show the reasoning after an attempt and offer a route to the corresponding Atlas lesson. Do not present generated scores as official assessment or store identifiable student profiles.
7. **Text translator / clarity helper** — user-pasted text only, with source/target language and a preview before replacement. Keep the original text intact and warn that technical/scientific wording needs review.
8. **Creative resource and event/activity prompts** — templates for classroom demonstrations, projects, and science events. Keep these lower priority than the core syllabus-connected tools.

### Defer until separate integrations and privacy review

- **Web Search Assistant:** requires a chosen search provider, source-quality policy, links/citations, and a separate cost/security review. Gemini's generated knowledge alone is not live web search.
- **YouTube Video Analyzer:** accept a transcript supplied by the teacher first. Do not scrape/download videos or imply transcript access without a permitted API and its own configuration.
- **Live quiz, poll, PaperQR, shared documents/chat:** require persistent sessions, identity/anonymous participation decisions, abuse controls, data retention/deletion policies, and accessibility testing. The current app has no backend or account system, so these are not just prompt features.
- **Personalized student reports:** do not send the current locally held report codes, names, roll numbers, or class uploads to an AI provider. Any future server-side report feature needs a separate school/privacy design and consent model.

## Curriculum and safety rules

- Pilot on **Class IX** and the existing registry first. Add Class X only after its chapter context, learning goals, and generated outputs have their own verification pass.
- Build prompts from locally maintained, versioned curriculum context; do not ask the model to reconstruct the syllabus from memory. Each generated item should carry its course/chapter key and an internal prompt/context version for traceability.
- Distinguish official source content, user-provided notes, and generated suggestions in the UI. Do not claim “NCERT/CBSE-aligned” for generated text unless a teacher-reviewed mapping supports that exact claim.
- AI output is a draft, can be wrong, and requires educator review. The interface must make correction easy and must not grade or diagnose learners on its own.
- Do not include student names, roll numbers, report codes, or sensitive personal data in model prompts. Minimize retention: no prompt/response persistence by default; provide a clear notice that requests are sent to Google Gemini when the feature is used.

## Dashboard and rollout behavior

- Keep the current non-AI tool cards and routes working.
- Add separate **AI draft** cards only when the server capability is available. Do not use “Popular” or “Premium” badges without product evidence or an actual entitlement system.
- Mark generated content with an **AI-generated draft · teacher review required** label and include a one-click path to its source chapter.
- Feature-flag each tool server-side/through deployment configuration; hiding a card is not a substitute for protecting the endpoint.
- Roll out to a small teacher pilot, review scientific accuracy and Hindi quality against a fixed test set, inspect cost/rate-limit behavior, then decide whether to enable for students.

## Acceptance checks and remaining rollout

- Automated tests cover both tool schemas, prompt-context selection, bounds, same-origin enforcement, disabled configuration, mocked Gemini responses, and shared rate-limit failure/limit paths. They need no real credentials.
- Manual teacher review is still required for factual correctness, answer keys, age appropriateness, safety, bilingual quality, and curriculum scope. No live Gemini call or teacher pilot was possible in this sandbox.
- Add browser end-to-end coverage for enabled/disabled cards, editable drafts, print behavior, and offline core Atlas behavior before public rollout.
- Configure Vercel secrets and Upstash privately, verify `/api/ai/status`, check Gemini account quota/budget limits, and run teacher review before turning `AI_TOOLS_ENABLED` on in production.
- The request counter caps calls, not actual currency spend. Keep provider budget/quotas monitored; do not treat the counter as a guaranteed billing ceiling.

## Current code touchpoints

- Dashboard and AI modal: `index.html`, `assets/va-home.css`, `assets/va-tools.js`, `assets/va-ai-tools.js`.
- Serverless handlers: `api/ai/status.js`, `api/ai/generate.js`; validation, prompts, and Upstash counters: `lib/ai.js`.
- Generated chapter context and regeneration tool: `api/ai/curriculum.json`, `tools/generate-ai-curriculum.cjs`; source curriculum: `index.html` (`IXC`).
- Private deployment setup: `.env.example`, `.gitignore`, `DEPLOY.md`, `vercel.json`.

Next: configure Preview environment privately, run `npx vercel dev`, conduct educator review, and only then enable the production flag. Phases 2/3 and integrations requiring search, transcripts, persistence, or accounts are not implemented.
