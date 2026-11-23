# Third-party notices

This project ships the third-party code, fonts and models listed below. Each keeps its own licence. The application code itself has no licence yet (see README → *License*).

| Component | Where it is in this repo | Licence | Copyright / source |
|---|---|---|---|
| three.js (module build r160, examples) | `assets/vendor/three.module.min.js`, `assets/vendor/loaders/`, `assets/vendor/utils/`, `public/lib/` | MIT — text in `assets/vendor/THREE_LICENSE.txt` | © 2010–2023 three.js authors |
| cannon-es | `assets/vendor/cannon-es.js` | MIT — text in `assets/vendor/CANNON_ES_LICENSE.txt` | © 2015 cannon.js Authors |
| Draco decoder (Google) | `assets/vendor/draco/` | Apache-2.0 — text in `assets/vendor/draco/LICENSE-APACHE-2.0.txt` | Google, Draco project |
| Atkinson Hyperlegible Next | `assets/fonts/atkinson-*.woff2` | SIL OFL 1.1 — `assets/fonts/licenses/OFL-Atkinson-Hyperlegible-Next.txt` | © The Atkinson Hyperlegible Next Project Authors |
| Bricolage Grotesque | `assets/fonts/bricolage-*.woff2` | SIL OFL 1.1 — `assets/fonts/licenses/OFL-Bricolage-Grotesque.txt` | © The Bricolage Grotesque Project Authors |
| Inter | `assets/fonts/inter-*.woff2` | SIL OFL 1.1 — `assets/fonts/licenses/OFL-Inter.txt` | © The Inter Project Authors |
| Noto Sans Devanagari | `assets/fonts/noto-sans-devanagari-*.woff2` | SIL OFL 1.1 — `assets/fonts/licenses/OFL-Noto-Sans-Devanagari.txt` | © The Noto Project Authors |
| Source Serif 4 | `assets/fonts/source-serif-4-*.woff2` | SIL OFL 1.1 — `assets/fonts/licenses/OFL-Source-Serif-4.txt` | © The Source Serif 4 Project Authors |
| Anatomy meshes (`digestive`, `heart`, `eye` `.glb` files) | `assets/digestive/`, `assets/heart/`, `assets/eye/` | CC BY-SA 4.0 (derived from BodyParts3D, CC BY-SA 2.1 JP, and Z-Anatomy, CC BY-SA 4.0) | See `docs/ASSET_LICENSES.md` for the source chain and the required attribution text. Share-alike applies to these files. |

## Notes

- The anatomy meshes are the one component that imposes a share-alike condition. Any export or render of those files must keep CC BY-SA and the attribution.
- The Khronos glTF specification is linked in code comments only; no Khronos code is shipped.
- Full provenance of each asset: [`docs/ASSET_LICENSES.md`](docs/ASSET_LICENSES.md).
