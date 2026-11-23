# Infinite Horizons Mind Map

The app now has an original, interactive syllabus map, available from Home, the course sidebar, and the stage bar. It builds its chapter and topic nodes from the existing app registry rather than duplicating the curriculum in a second source.

## Student workflow

- Choose Class IX (2026–27 current course), the separate Class IX (2025–26) historical track, Class X, or IX Advanced.
- Filter by unit or search chapter names, Hindi titles, model titles, briefs, and mapped concepts.
- Select a unit to narrow the view, a chapter to expand its model-topic branches, or a leaf to open that existing visual lesson.
- The inspector lists mapped concepts, learning outcomes and current visual availability. It links to 2D views where a mapping exists.
- Class IX Physics/Chemistry chapters link to the current IX simulator lab. The historical 2025–26 Matter chapter links to its separately tagged inquiry.

The 2025–26 syllabus map is explicitly partial: only Matter in Our Surroundings has been integrated so far. See [`CLASS9_2025-26_INTEGRATION.md`](CLASS9_2025-26_INTEGRATION.md) for its syllabus place and the remaining source-ordered roadmap.

The graph is rendered with native SVG and no third-party mind-map package. That keeps the static site dependency-free, avoids shipping a large graph runtime, and works with the app's existing deployment and offline-oriented workflow. Pan/scroll and zoom controls are built into the map.

**Scope note:** the map reflects content currently present in Infinite Horizons; it is a navigation aid, not a claim of complete CBSE outcome coverage, syllabus approval, or teacher validation. Topics without an interactive scene are identified as such.

## Checks

Run `npm run test:mindmap` for registry-adapter, course/unit filtering, hierarchy, and expansion-layout checks. `npm test` runs the mind-map, simulator-core, and existing 2D bundle checks. These do not replace browser, subject-teacher, accessibility, or classroom review.
