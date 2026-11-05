# High-Detail Stylized 3D Assets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade procedural 3D assets to high-detail stylized human characters (facial features, eyes, hair styles, glasses, IT ID badge, sneakers) and a realistic tech office environment (transparent glass partitions, potted Monstera plants, laptops with keyboards, office water cooler, whiteboard with Post-it notes).

**Architecture:** Extend `Character3D` and `OfficeBuilder3D` in `src/office3d/` with modular procedural sub-mesh generators. Pure Three.js geometry ensuring instant 0ms load without external GLTF/asset downloads, maintaining full offline and headless Node test compatibility.

**Tech Stack:** Three.js, WebGL Canvas, Vanilla ES Modules, Node.js Native Test Runner (`node --test`).

**Spec:** `docs/superpowers/specs/2026-11-05-high-detail-stylized-3d-assets-spec.md`

## Global Constraints
- Zero external asset files: 100% procedural Three.js meshes.
- 100% test compatibility: All 69 existing unit tests must remain Green.
- Performance: Keep polygon count lightweight (< 15,000 tris) for 60 FPS performance on all devices.

## Review Focus
1. Mesh hierarchy integrity: Adding neck, eyes, ears, badge, and shoes must preserve the `Character3D` limb hierarchy so animation rotations don't break.
2. Material transparency sorting: Glass partitions must use `transparent: true, opacity: ~0.35` and not occlude background furniture.
3. Node test safety: Enhanced mesh generation must not call unsupported browser-only APIs.
4. Scale & Alignment: Prop scales (laptop, coffee cup, water cooler) must naturally match character proportions.
5. NPC variety: NPCs must display distinct styles (glasses for mentors/leads, different hair colors and female hairstyles for HR/QA).

---

### Task 1: High-Detail Humanoid Character Mesh & Animation
**Files:**
- Create: `tests/characterDetail3D.test.js`
- Modify: `src/office3d/character3D.js`

- [ ] Write failing test in `tests/characterDetail3D.test.js` testing eyes, ears, neck, ID badge lanyard, hands, and sneakers generation.
- [ ] Run `node --test tests/characterDetail3D.test.js` to verify failure.
- [ ] Implement enhanced `Character3D`:
  - Neck cylinder connecting torso and head.
  - Face features: eyes (dark pupils), eyebrows, nose bridge, ears.
  - Optional glasses with sleek frames.
  - Styled hair mesh with gender/style options (`short`, `bob`, `undercut`).
  - Shirt collar + IT ID Badge hanging from a lanyard with MegaSoft badge.
  - Hands at wrist ends with skin tone.
  - Sneakers with dual-tone white sole and colored upper.
- [ ] Run `npm test` to verify all tests pass.
- [ ] Commit: `feat(3d): enhance Character3D with humanoid anatomy, facial features, ID lanyard, and sneakers`.

---

### Task 2: Office Architecture Upgrade — Glass Partitions, Wall Posters & Tropical Plants
**Files:**
- Create: `tests/officeDetail3D.test.js`
- Modify: `src/office3d/officeBuilder3D.js`

- [ ] Write failing test in `tests/officeDetail3D.test.js` testing glass partition materials, aluminum frames, indoor potted plants, and wall posters.
- [ ] Run `node --test tests/officeDetail3D.test.js` to verify failure.
- [ ] Implement in `src/office3d/officeBuilder3D.js`:
  - Transparent glass partitions (`opacity: 0.35`) with dark aluminum frame borders between rooms.
  - `createPottedPlantMesh(type)`: Monstera broadleaf plant and tall Ficus in ceramic pots placed in room corners and hallways.
  - `createWallPosterMesh(title, color)`: Framed tech slogan posters along hallway walls.
- [ ] Run `npm test` to verify all tests pass.
- [ ] Commit: `feat(3d): add transparent glass room partitions, potted tropical plants, and wall posters`.

---

### Task 3: Office Furniture & Workplace Props Upgrade — Laptops, Water Cooler, Whiteboard Notes
**Files:**
- Create: `tests/furnitureDetail3D.test.js`
- Modify: `src/office3d/officeBuilder3D.js`

- [ ] Write failing test in `tests/furnitureDetail3D.test.js` testing laptop with keyboard & screen, office water cooler dispenser, and whiteboard with Post-it notes.
- [ ] Run `node --test tests/furnitureDetail3D.test.js` to verify failure.
- [ ] Implement in `src/office3d/officeBuilder3D.js`:
  - `createDetailedDeskMesh()`: Desk with ergonomic mesh chair, laptop open with keyboard keycaps and glowing code screen, ergonomic mouse, and desk succulent.
  - `createWaterCoolerMesh()`: Standup office water dispenser with inverted 20L blue bottle, hot/cold levers, and drip tray.
  - `createWhiteboardMesh()`: Glass/metal whiteboard on wall with colorful Post-it sticky notes and marker tray.
  - Upgrade Pantry coffee counter with coffee spouts and cups.
- [ ] Run `npm test` to verify all tests pass.
- [ ] Commit: `feat(3d): add detailed laptops, ergonomic chairs, water cooler, and meeting whiteboard`.

---

### Task 4: NPC Customization & Full Regression Pass
**Files:**
- Modify: `src/office3d/npcManager3D.js`
- Modify: `src/office3d/officeRenderer3D.js`

- [ ] Update `src/office3d/npcManager3D.js` to give each NPC customized hair styles, glasses (Senior Minh, Tech Lead Đức, PM Hùng), and personalized palettes.
- [ ] Run full regression suite: `npm test` (all tests passing).
- [ ] Commit: `feat(3d): personalize 3D NPCs with role-specific accessories and styles`.

---

### Task 5: Documentation, README Update & GitHub Push
**Files:**
- Modify: `README.md`
- Update: `.superpowers/sdd/`

- [ ] Run `npm test` to verify 100% Green pass rate.
- [ ] Update `README.md` with new high-detail 3D human and tech office asset highlights.
- [ ] Commit: `docs: update README with high-detail stylized 3D human and office environment details`.
- [ ] Push to GitHub: `git push origin main`.
- [ ] Update tracking artifact.
