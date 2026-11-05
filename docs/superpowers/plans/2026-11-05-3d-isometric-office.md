# 3D Isometric Low-Poly Office Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the office exploration view into an interactive 3D Isometric Low-Poly world using Three.js, featuring 4 decorated rooms, walking 3D avatar with animated movement, 6 3D NPCs, camera orbit/zoom, seamless desk transition, and a 3D/2D toggle.

**Architecture:** A modular Three.js rendering subsystem in `src/office3d/` with clean mathematical coordinate mapping from 2D tile coordinates to 3D world space. The scene comprises low-poly architectural half-walls, procedural office furniture, emissive server racks, and animated character meshes. It seamlessly connects with `main.js`, `Player`, `ViewManager`, and `CyberWork OS`.

**Tech Stack:** Three.js (via standard W3C importmap), HTML5 WebGL Canvas, Vanilla ES Modules, Node.js Native Test Runner (`node --test`).

**Spec:** `docs/superpowers/specs/2026-11-05-3d-isometric-office-spec.md`

## Global Constraints
- Zero heavy bundler: Vanilla ES Modules runnable directly in browser via `importmap`.
- 100% test compatibility: All math, coordinate mapping, and builder logic must run headless in `npm test` (`node --test`) without WebGL crash.
- Preserve all existing features: CyberWork OS, 16+ tickets, mid-task plot twists, dynamic LLM dialogue, and Web Audio synth.
- Reversible: User can toggle between 3D Mode and 2D Mode anytime via the HUD button.

## Review Focus
1. Headless environment safety: Calling 3D modules in Node tests without `window` or `WebGLRenderingContext` must not throw uncaught errors.
2. Coordinate synchronization: Player tile coordinates (X, Y) must map smoothly to 3D world coordinates (X, 0, Z) without drift.
3. Dimension toggle consistency: Switching between 3D and 2D views must preserve player location and active room.
4. Seamless desk interaction: Entering desk mode from 3D must switch to CyberWork OS, and leaving must restore the 3D isometric view cleanly.
5. Camera clamping & Orbit: Camera zoom and elevation limits must prevent inverted or broken views.

---

### Task 1: Three.js Setup, Importmap & Coordinate Transformation Module
**Files:**
- Create: `src/office3d/coord3D.js`
- Create: `tests/coord3d.test.js`
- Modify: `index.html`

- [ ] Write failing test in `tests/coord3d.test.js` testing 2D tilemap to 3D world position conversion, angle rotation calculations, and bounding box checks.
- [ ] Run `npm test tests/coord3d.test.js` to verify failure.
- [ ] Implement `src/office3d/coord3D.js` with `tileTo3D(tileX, tileY, tileSize = 1.5)`, `calcFacingAngle(dx, dy)`, and boundary clamp helpers.
- [ ] Add Three.js importmap and `#office3d-container` canvas wrapper in `index.html`. Add `#btn-toggle-dimension` on `#hud`.
- [ ] Run `npm test` to verify all tests pass.
- [ ] Commit: `feat(3d): setup Three.js importmap, 3D coordinate converter and viewport container`.

---

### Task 2: 3D Scene Architecture & Procedural Low-Poly Office Builder
**Files:**
- Create: `src/office3d/officeBuilder3D.js`
- Create: `src/office3d/threeOfficeScene.js`
- Create: `tests/officeBuilder3D.test.js`

- [ ] Write failing test in `tests/officeBuilder3D.test.js` testing room floor layout definitions, color palettes, and furniture placement catalog.
- [ ] Run `npm test tests/officeBuilder3D.test.js` to verify failure.
- [ ] Implement `src/office3d/officeBuilder3D.js`:
  - 4 room floor plates with distinct materials: IT (dark slate), Pantry (warm oak), Meeting (navy carpet), Server (dark metal grid).
  - Half-height exterior & partition walls for *The Sims* cutaway look.
  - Procedural furniture: IT desks with dual monitors, ergonomic chairs, coffee machine, fridge, round tables, sofa lounge, conference table, and server racks with glowing emissive lights.
- [ ] Implement `src/office3d/threeOfficeScene.js`:
  - Three.js Scene, PerspectiveCamera (isometric angle: 45° elevation), WebGLRenderer with soft shadow maps.
  - Soft ambient light + warm directional sun light + server rack point lights.
  - OrbitControls support (drag to rotate, wheel to zoom).
- [ ] Run `npm test` to verify all tests pass.
- [ ] Commit: `feat(3d): implement procedural low-poly 3D office architecture and lighting scene`.

---

### Task 3: 3D Character Avatar & NPC Manager with Bobbing Walk Animation
**Files:**
- Create: `src/office3d/character3D.js`
- Create: `src/office3d/npcManager3D.js`
- Create: `tests/character3D.test.js`

- [ ] Write failing test in `tests/character3D.test.js` verifying character mesh hierarchy creation, palette binding, and walk cycle step interpolation.
- [ ] Run `npm test tests/character3D.test.js` to verify failure.
- [ ] Implement `src/office3d/character3D.js`:
  - Low-poly character model: head, torso, legs, arms.
  - Bobbing walk animation when moving, smooth facing rotation towards movement angle.
- [ ] Implement `src/office3d/npcManager3D.js`:
  - Spawns 6 NPCs with respective room placements and role palettes.
  - Floating 3D interaction indicator bubble above heads when player is nearby.
- [ ] Run `npm test` to verify all tests pass.
- [ ] Commit: `feat(3d): create low-poly 3D character mesh, walk animation, and 3D NPC manager`.

---

### Task 4: Main Controller, 3D/2D Dimension Toggle & Desk Seamless Transition
**Files:**
- Create: `src/office3d/officeRenderer3D.js`
- Modify: `src/main.js`
- Modify: `src/office/deskView.js`
- Create: `tests/officeRenderer3D.test.js`

- [ ] Write failing test in `tests/officeRenderer3D.test.js` testing dimension state toggle (`is3DMode`), camera follow target, and desk transition flow.
- [ ] Run `npm test tests/officeRenderer3D.test.js` to verify failure.
- [ ] Implement `src/office3d/officeRenderer3D.js`:
  - Main loop update coordinating player position, camera lerp follow, NPC proximity, and scene rendering.
  - Smooth camera swoop on desk interaction.
- [ ] Wire 3D renderer in `src/main.js`:
  - Initialize `globalOfficeRenderer3D` when WebGL is available.
  - Wire `#btn-toggle-dimension` to toggle between 3D Isometric View and 2D Pixel View.
  - Ensure desk `[E]` and `[Esc]` transitions function identically in both modes.
- [ ] Run `npm test` to verify all tests pass.
- [ ] Commit: `feat(3d): integrate 3D isometric office exploration with 2D fallback and desk transition`.

---

### Task 5: Verification, Documentation, README Update & GitHub Push
**Files:**
- Modify: `README.md`
- Update: `.superpowers/sdd/`

- [ ] Run full test suite: `npm test` (all tests passing).
- [ ] Update `README.md` with 3D Isometric Mode features, controls, and screenshots/diagrams.
- [ ] Commit: `docs: update README with 3D isometric low-poly office features and controls`.
- [ ] Push to GitHub: `git push origin main`.
- [ ] Update tracking artifact.
