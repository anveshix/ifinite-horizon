# Infinite Horizons — Class IX & X Science in 3D

> Interactive 3D models, simulators and quizzes for CBSE Class IX and X Science (NCERT 2026–27), built to run in any modern browser with no install.

**[▶ Open the live site](https://anveshix.github.io/ifinite-horizon/)** · [Realism demo](https://anveshix.github.io/ifinite-horizon/public/realism-demo.html) · [Docs](docs/)

> The live link is the GitHub Pages address for this repository. If it does not load, enable Pages (Settings → Pages → *Deploy from a branch*, `main`, `/`) — the `static.yml` workflow also publishes on every push to `main`.

---

## Features

- **3D models** for biology (digestive system, eye, heart and more) with optimised `.glb` assets and a low-poly fallback.
- **2D simulators** for physics, chemistry and biology topics, including guided experiments.
- **Curiosity labs** — small interactive labs (atom, cell, electricity, optics, reactions and more) with built-in quizzes.
- **Chapter mind maps** generated from the curriculum data.
- **Optional AI draft tools** — serverless endpoints in `api/ai/` that stay off unless configured.

## Tech stack

- Plain HTML, CSS and JavaScript (ES modules); no framework and no bundler for the site.
- three.js for 3D, with GLB models built by scripts in `tools/`.
- Node.js for tests and build helpers; Vercel functions for the optional AI endpoints.
- GitHub Pages for hosting the static site.

## Setup

Requirements: Node.js 18+ (only needed for tests and tools).

```bash
git clone https://github.com/anveshix/ifinite-horizon.git
cd ifinite-horizon
npm install

npx serve public -l 3000     # preview the site at http://localhost:3000
npm test                     # run all test suites
```

Optional AI tools: copy `.env.example` to `.env` (or set the same variables in Vercel) and fill in your own values. Never commit a real `.env`.

## Usage

1. Open the site and pick a class (IX or X), then a chapter.
2. Explore a 3D model: drag to rotate, scroll to zoom, click a part to see its name and function.
3. Use a simulator or lab, change the controls, and watch the result update.
4. Take the chapter quiz to check understanding.

## Folder structure

```
.
├── index.html          # Main site entry point
├── public/             # Static site: 2D simulators, physics, chemistry, biology, realism demo
├── assets/             # Models (.glb), fonts, brand, curiosity labs and quiz code
├── api/ai/             # Optional serverless AI endpoints and curriculum data
├── lib/                # Shared helpers
├── tools/              # Build scripts for models, mind maps and curriculum data
├── tests/              # Node test suites (npm test)
├── docs/               # Audits, curriculum mapping, risks, deployment notes
├── vercel.json         # Vercel config (static output + function limits)
└── .github/workflows/  # GitHub Pages and Jekyll workflows
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security reports: [SECURITY.md](SECURITY.md).

## License

No licence has been chosen for this repository yet. Until one is added, the default applies: **all rights reserved** by the author (anveshix). Please ask before reusing or redistributing the code.

Third-party code, fonts and models keep their own licences. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Author

**anveshix** — [github.com/anveshix](https://github.com/anveshix)
