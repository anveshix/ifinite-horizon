# Deploy Infinite Horizons on Vercel (static core, optional serverless AI tools)

**Option A — drag & drop / CLI (2 minutes)**
1. Install Node 18+ once, then in this `vercel/` folder run: `npx vercel login` → `npx vercel --prod`
2. Questions: Set up and deploy? **Y** · Link to existing project? **N** · Directory? **./** · Override settings? **N**
3. Open the printed `https://….vercel.app` URL on the projector PC. First load online once; after that it works offline (PWA).

**Option B — GitHub**
Push the `vercel/` folder to a repo → vercel.com → Add New Project → Import → Framework: *Other* → Deploy. (`vercel.json` already sets output = `public`.)

**Rebuild after code changes:** `bash tools/make-vercel.sh` (in the full source), then redeploy.

The core Atlas is static and needs no environment variables, API keys, backend, or database. Optional AI drafting adds two Vercel serverless endpoints and requires private environment variables plus Upstash Redis for shared rate limits. Without those settings the AI cards stay hidden and the core Atlas works as before. HTTPS (automatic on Vercel) enables the **Install app** button. Student reports remain in each browser and are not sent to AI.
Keys: **N** chapters panel · **P** lesson panel · **H** home · **F** fps · ←/→ steps · Space play/pause · Esc close.

## 3D | 2D switch (one screen)
The app is the root `index.html`. The **3D | 2D** switch sits in its top bar and on Home (key **V**); 2D shows the labelled image for the *current* topic in the same stage, with the same chapters and lesson panel. Code + topic→image map: `assets/va-2d.js`; images: `public/2d/<class>/<subject>/images/`. Deep link: `index.html?view=2d#ch5/heart`.

**Projector / classroom mode (the complete Class IX + X 2D image set):** press **📽 Present** or key **S** in 2D — in the app (`assets/va-2d.js`) and in every standalone viewer `public/2d/<class>/<subject>/viewer.html` (`public/2d/present.js`). Labels show only for the dot you tap; in Present mode Space/→ reveals one label at a time, PgDn/PgUp change image, **A** Reveal/Quiz/All, **Z** zoom, **L** laser, **B/W** blank, **E** language, **T** theme, **+/−** text size, **F** full screen, **?** help, **Esc** exit.
Deploy the **repository root** (GitHub Pages: branch root; Vercel: `outputDirectory` is `.`). `public/index.html` and `public/science/index.html` only forward old links to the app.

## Syllabus Mind Map
Open **Mind Map** from Home, the sidebar, or the stage bar. It supports the Class IX, Class X, and IX Advanced registries, with unit filters, search, expandable chapter/topic branches, and links to existing 2D/3D lessons. Class IX Physics/Chemistry chapters also link to the IX simulator lab. It uses native SVG—no graph plugin or added runtime dependency—so it remains compatible with the static site. Scope and implementation notes: `docs/MIND_MAP.md`.

## Class IX interactive simulator lab
Open **Class IX simulator lab** from Home, **Interactive simulator** in the Class IX sidebar, or **⚗ Sim** in the stage bar. The first release provides seven chapter-linked inquiry models (four Physics, three Chemistry); model limits and a curriculum map are in `docs/CLASS9_SIMULATORS.md`. Controls float over a full-screen canvas and can be hidden. Related chapter links return to the existing 3D or mapped 2D topic view. This is an initial supported slice—not complete Class IX/X outcome coverage or a replacement for hands-on lab work.

## Optional AI draft tools (Gemini)

The dashboard includes a **Lesson planner** and **Quiz & worksheet builder** for the Class IX registry. They appear only when the server reports a complete, enabled configuration. They produce editable teacher-reviewed drafts; they do not assign work, diagnose learners, or guarantee official syllabus alignment.

The app calls same-origin Vercel functions at `/api/ai/status` and `/api/ai/generate`. The Gemini API key stays on the server and is sent only in the server-to-Gemini request header. The browser never receives the key. Do not enable the feature on a static host that cannot run these functions.

To enable on Vercel:
1. Create a Gemini API key in Google's provider console and a separate Upstash Redis REST database for each deployment environment. Do not paste either secret into chat, source files, or browser code.
2. In Vercel → Project → Settings → Environment Variables, configure `AI_TOOLS_ENABLED=true`, `GEMINI_API_KEY`, `GEMINI_MODEL` (a bare model resource ID supported by your Google project), `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `AI_RATE_LIMIT_SALT` (a private random value, at least 24 characters). Apply to the intended Preview/Production environment, then redeploy.
3. Check `/api/ai/status` on that deployment. It should return `enabled: true` and the Class IX chapter list. The endpoint remains disabled if any required setting is absent or invalid.
4. Confirm rate-limit storage is reachable and check your Google quota/budget controls before sharing the site. The current server limits are 8 requests/minute and 40/day per anonymized IP, plus a 100-request daily global ceiling. The Upstash counters use a keyed hash of the requester IP; they do not store the raw IP. Rate-limit failures are fail-closed.

Requests contain only the selected Class IX chapter and the teacher's bounded form text; the feature has no student identity fields and does not save prompts or drafts. The app discloses that requests go to Google Gemini. Teacher notes must not contain student names, roll numbers, report codes, or sensitive personal data. The server validates request fields and generated JSON before returning a draft. A valid schema does not prove a generated answer is scientifically correct: check the science, scope, answer key, Hindi wording, and safety before use.

For local Vercel-function testing, copy `.env.example` to a private local env file and use `npx vercel dev`; never run the static Python server as evidence that AI functions are available. `.env*` values and `.vercel/` are ignored by Git. Unit tests mock both Upstash and Gemini, so they need no real credentials.

Run `npm test` to check the 2D asset map, simulator chapter links/calculations, Mind Map, and AI request/response validation.

## Teacher narration
🎙 button in the top bar narrates the current topic (Hindi / English / both, male / female). Free, offline, uses device voices. Real recordings can be dropped into `assets/voice/` — see `docs/VOICE.md`.

## Visitor Counter & Analytics
`assets/va-visits.js` automatically displays a privacy-friendly **Unique Visitors** pill (`👥 N visitors · दर्शक`) on the Home screen (`#homeStats`) and `public/2d/index.html` using [Abacus](https://v2.jasoncameron.dev/abacus/) (`abacus.jasoncameron.dev`, no cookies, no signup, deduplicated per browser via `localStorage`, and skipped on `localhost` / `file://` / `navigator.webdriver` / offline).
For a full analytics dashboard (daily graphs, countries, devices, top pages), create a free [GoatCounter](https://www.goatcounter.com/) site and add `<meta name="va-goatcounter" content="YOUR_SITE_CODE">` inside `<head>` of `index.html`. If deploying on Vercel, you can also enable **Vercel Web Analytics** in the Vercel dashboard.
