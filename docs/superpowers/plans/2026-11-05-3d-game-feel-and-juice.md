# 3D Game Feel, Movement Physics & Audio Juice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a juicy, tactile, and immersive 3D gameplay experience featuring smooth momentum-based movement with sprinting (`Shift`), spatial synthesized footstep & ambient audio, comic speech bubbles on NPCs, running dust particles, and plant foliage sway.

**Architecture:** Extend `Player` with sprint velocity and acceleration physics; enhance `Character3D` with dynamic limb scaling and cornering body lean; augment `SoundEngine` with procedural Web Audio footstep bursts and ambient room soundscapes; build high-DPI comic speech bubbles in `NPCManager3D`; and add low-overhead particle and plant animation to `OfficeRenderer3D`.

**Tech Stack:** Three.js (WebGL), Web Audio API (native synth nodes), Vanilla JavaScript (ES6+), Node.js native test runner (`node --test`).

**Spec:** `docs/superpowers/specs/2026-11-05-3d-game-feel-and-juice-spec.md`

## Global Constraints

- 100% Zero-External-Download: Audio synthesized purely via Web Audio API nodes; visuals rendered procedurally with Three.js geometry and canvas textures.
- 60 FPS performance budget with negligible CPU/GPU overhead.
- Safe execution in headless Node.js native test runner (`node --test`).
- Seamless coexistence with existing 2D/3D toggle and Desk Simulator.

## Review Focus

1. Sprinting across room boundaries must maintain smooth continuous speed without rubber-banding.
2. Web Audio synthesized footsteps must not produce clicks or audio pops when rapidly triggered during sprinting.
3. Rapid camera rotation or player stopping must smoothly lerp body banking tilt back to vertical (0 rad).
4. Comic speech bubbles must cleanly scale to 0 and become invisible when the player walks away.
5. Particle pools must recycle geometries/materials to avoid garbage collection stuttering.

---

### Task 1: Kinetic Movement, Sprint & Cornering Banking

**Files:**
- Modify: `src/game/player.js`
- Modify: `src/office3d/character3D.js`
- Create: `tests/gameFeelPhysics.test.js`

- [ ] Write failing test in `tests/gameFeelPhysics.test.js` checking:
  - `Player` sets `isSprinting = true` when sprint modifier is active and applies `1.7x` speed multiplier.
  - Smooth acceleration: velocity ramps from 0 to max over time rather than instant jump.
  - `Character3D.updateAnimation(deltaTime, isMoving, isSprinting, turnAngle)` adjusts limb swing frequency and body lean (`torso.rotation.z`).
- [ ] Run `node --test tests/gameFeelPhysics.test.js` and confirm failure.
- [ ] Implement sprint state and smooth acceleration in `src/game/player.js`.
- [ ] Implement sprint limb frequency multiplier and cornering lean in `src/office3d/character3D.js`.
- [ ] Re-run `node --test tests/gameFeelPhysics.test.js` and confirm Green.
- [ ] Commit: `feat(physics): add smooth momentum acceleration, sprint mode, and cornering body lean`.

---

### Task 2: Spatial Web Audio Synth (Footsteps & Room Ambient Soundscapes)

**Files:**
- Modify: `src/audio/soundEngine.js`
- Create: `tests/spatialAudio.test.js`

- [ ] Write failing test in `tests/spatialAudio.test.js` checking:
  - `SoundEngine.playFootstep(surface, isSprint)` produces bandpass-filtered noise burst without error.
  - Cadence control: does not fire more frequently than interval threshold (~180ms sprint, ~320ms walk).
  - `SoundEngine.setRoomAmbience(roomId)` smoothly initializes or fades ambient drones (`server` hum, `it_room` typing clacks, `pantry` hum).
- [ ] Run `node --test tests/spatialAudio.test.js` and confirm failure.
- [ ] Implement `playFootstep` and `setRoomAmbience` in `src/audio/soundEngine.js`.
- [ ] Re-run `node --test tests/spatialAudio.test.js` and confirm Green.
- [ ] Commit: `feat(audio): synthesize procedural footsteps and room ambient soundscapes`.

---

### Task 3: Comic Speech Bubbles & Dynamic Emotes on NPCs

**Files:**
- Modify: `src/office3d/npcManager3D.js`
- Create: `tests/npcSpeechBubbles.test.js`

- [ ] Write failing test in `tests/npcSpeechBubbles.test.js` checking:
  - `NPCManager3D` creates floating speech bubble group on each NPC.
  - Each bubble contains role-specific witty quotes and emoji badge.
  - Proximity trigger (`checkProximity`) scales up the bubble with bounce (`scale = 1.0`), and scaling down to 0 when exiting proximity.
- [ ] Run `node --test tests/npcSpeechBubbles.test.js` and confirm failure.
- [ ] Implement procedural canvas comic speech bubble generator and pop-in bounce animation in `src/office3d/npcManager3D.js`.
- [ ] Re-run `node --test tests/npcSpeechBubbles.test.js` and confirm Green.
- [ ] Commit: `feat(3d): add pop-in comic speech bubbles and dynamic emotes for NPCs`.

---

### Task 4: Footstep Dust Particles & Foliage Sway

**Files:**
- Modify: `src/office3d/officeRenderer3D.js`
- Modify: `src/office3d/officeBuilder3D.js`
- Create: `tests/particlesAndFoliage.test.js`

- [ ] Write failing test in `tests/particlesAndFoliage.test.js` checking:
  - Footstep dust particle emitter spawns particles when player is sprinting and updates lifetime.
  - Potted plant leaf mesh subtly sways when character is within proximity radius.
- [ ] Run `node --test tests/particlesAndFoliage.test.js` and confirm failure.
- [ ] Implement particle pool and foliage sway in `src/office3d/officeRenderer3D.js` and `officeBuilder3D.js`.
- [ ] Re-run `node --test tests/particlesAndFoliage.test.js` and confirm Green.
- [ ] Commit: `feat(3d): add footstep dust particles and responsive foliage sway`.

---

### Task 5: Integration, Full Regression & Push to GitHub

**Files:**
- Modify: `src/main.js`
- Modify: `README.md`

- [ ] Connect `Shift` key listeners to `Player` sprint state in `src/main.js`.
- [ ] Connect `RoomTracker` room transitions to `SoundEngine.setRoomAmbience`.
- [ ] Connect footstep sound triggers to player movement in 3D update loop.
- [ ] Update `README.md` with new controls (`Shift` Sprint) and sensory features.
- [ ] Run full regression suite (`npm test`) and verify 100% test pass.
- [ ] Commit: `feat(game): integrate sprint physics, ambient soundscapes, and comic speech bubbles`.
- [ ] Push all commits to `https://github.com/thichcode/dowork_playing` (`main` branch).
