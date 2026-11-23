# Design system

One visual language across the home page, lessons, labs, teacher tools and the stand-alone pages.

| Token | Value | Use |
|---|---|---|
| `--va-ink` | `#0f1a3a` | Text, primary buttons, brand mark |
| `--va-brand` | `#2342c8` | Links, focus rings, icon strokes |
| `--va-marker` | `#ffd23f` | "You are here": active tab, current topic, label pins |
| `--va-paper` / `--va-wash` | `#f4f6fb` / `#e9eefa` | Page and quiet surfaces |
| Subjects | physics `#1565c0`, chemistry `#7e57c2`, biology `#2e7d32`, environment `#00897b` | Chapter numbers, card top edge, unit dots |

Type: **Bricolage Grotesque** for headings, **Atkinson Hyperlegible Next** for text, Noto Sans Devanagari for हिंदी. All self-hosted in `assets/fonts` (SIL OFL), so the app stays offline-ready.

## Files

- `assets/va-design.css` — tokens, legacy-variable map (light and night), app shell, lesson panel, stage toolbar. Loaded last.
- `assets/va-home.css` — home page.
- `assets/va-pages.css` — stand-alone pages (`public/**`): light index pages and the night variant for the old viewers.
- `assets/va-simulator.css`, `va-mindmap.css`, `va-teacher.css`, `va-iks.css`, `va-*-content.css` — overlays. Their palettes were migrated with `tools/retone-css.py`.
- `assets/curiosity/curiosity.css` reads the legacy variables, so it follows the tokens without changes.

## Rules

- Yellow marks the current location only. It is never decoration.
- A subject keeps its colour everywhere (home card, sidebar, mind map).
- Sentence case, no tracked all-caps labels, one primary action per view.
- 3D scene backdrop is set in `sf()` in `index.html` (neutral light / navy night).
- Keyboard focus is always visible; `prefers-reduced-motion` is respected.
