# Specification: 3D Game Feel, Movement Physics & Audio Juice

- **Date:** 2026-11-05
- **Status:** Proposed (Awaiting Review)
- **Target Repository:** `https://github.com/thichcode/dowork_playing` (branch: `main`)

---

## 1. Background & User Intent

While the procedural 3D humanoid avatars and modern office architecture (glass walls, tropical plants, laptops, water coolers) look great, the in-game experience currently feels static and rigid ("trải nghiệm vẫn chưa sướng"). Players lack physical weight, speed variability, acoustic feedback, and lively social atmosphere when walking through the office.

This specification details a comprehensive "Juice & Game Feel" upgrade covering:
1. **Kinetic Movement**: Smooth acceleration/deceleration, sprinting (`Shift`), and banking/lean tilt when cornering.
2. **Spatial Web Audio Synth**: Synchronized footstep audio with material acoustic differences (wood/tile vs carpet) and room ambient soundscapes (server hum, keyboard chatter).
3. **Comic Speech Bubbles & Dynamic Emotes**: Pop-in floating speech bubbles and expressive icons over NPCs when approaching them.
4. **Physical Particles & Foliage Sway**: Running dust puffs and subtle plant leaf vibration on proximity.

---

## 2. Core Functional Requirements

### 2.1 Kinetic Movement & Sprint Controller (`src/office3d/character3D.js` & `src/game/player.js`)
- **Acceleration & Friction (Inertia)**:
  - Movement speed smoothly ramps up towards target velocity using linear interpolation (`lerp`), rather than jumping instantaneously to max speed.
  - Releasing input causes subtle deceleration/slide before coming to a stop.
- **Sprint Mode (`Shift` key)**:
  - Base walking speed: 5.0 tiles/sec (or 7.5 units/sec in 3D).
  - Sprinting speed with `Shift`: 8.5 tiles/sec (or ~12.5 units/sec in 3D, ~1.7x boost).
  - Limb swing frequency doubles proportionally during sprint.
- **Dynamic Banking / Body Lean**:
  - When turning sharply while running, the character's torso and head roll slightly towards the inside of the turn (up to `±0.12` radians) and recover smoothly.

### 2.2 Spatial Web Audio Synth (`src/audio/soundEngine.js`)
- **100% Zero-External-Download Synthesized Audio**:
  - `playFootstep(surfaceType = 'wood', isSprint = false)`:
    - Generates short acoustic burst using a bandpass-filtered noise node with micro pitch variations.
    - Slower cadence (~320ms) when walking; rapid cadence (~180ms) when sprinting.
    - Surface pitch/filter differentiation: higher frequency click on tile/hardwood (`wood`), muffled lower frequency thud on meeting room carpet (`carpet`).
  - **Room Ambience Drone Generator**:
    - `setRoomAmbience(roomId)`:
      - `server`: Low sine-wave drone (~65Hz) combined with gentle high-frequency white noise simulating air conditioners and server rack cooling fans.
      - `it_room`: Occasional soft mechanical key clicks (`tick-clack`) generated at random intervals (0.8s - 2.5s).
      - `pantry`: Gentle bubbling hum or soft white noise.
      - `meeting` / `hallway`: Subtle quiet room tone.
      - Smoothly fades in/out when transitioning between rooms.

### 2.3 Comic Speech Bubbles & Dynamic Emotes (`src/office3d/npcManager3D.js`)
- **Pop-In Speech Bubble Billboards**:
  - When the player enters proximity radius (`threshold <= 3.2` units):
    - Replaces static orange sphere marker with a stylized floating speech bubble.
    - Procedurally rendered onto a high-DPI 2D canvas texture or formatted Three.js sprite billboard.
    - Features rounded white comic bubble, dark border, comic tail pointing to NPC head, and iconic dialogue snippet:
      - **Senior Minh**: `☕` *"Merge code đừng conflict nha em..."*
      - **Tech Lead Đức**: `🔥` *"Hôm nay release kịp 5h chiều không?!"*
      - **QA Lead Trang**: `🐞` *"Máy em chạy bình thường hả? Để chị soi bug!"*
      - **HR Lan**: `🧋` *"Chiều nay ai order trà sữa không nè~"*
      - **DevOps Khoa**: `🚨` *"Ai vừa chọc vào Database Production đấy?!"*
      - **PM Hùng**: `📊` *"Chạy Sprint này nhớ log Jira đầy đủ nhé!"*
  - Pop-in scale animation with bounce (`0 -> 1.15 -> 1.0` in 0.2s).

### 2.4 Dust Puffs & Foliage Sway (`src/office3d/officeRenderer3D.js`)
- **Footstep Dust Particle System**:
  - When sprinting (`isSprint === true`), character emits small low-poly puffy dust particles (tiny white/buff dodecahedrons or circles) at shoe contact points that scale up and fade out over 0.35s.
- **Plant Foliage Sway**:
  - Potted Monstera/Ficus plants within 1.8 units of a moving character experience slight rotational sway (`Math.sin(time) * amplitude`), simulating brushing past foliage.

---

## 3. Architecture & Technical Constraints

1. **No External Asset Dependencies**:
   - Audio synthesized entirely via standard `AudioContext`, `OscillatorNode`, `BiquadFilterNode`, and `AudioBufferSourceNode`.
   - Visuals created via Three.js primitives and canvas dynamic textures.
2. **Performance Budget**:
   - Zero frame drops on standard Intel/AMD integrated GPUs (60 FPS).
   - Audio nodes cleanly disconnected / garbage collected to avoid memory leaks.
3. **Headless Test Compatibility**:
   - All modules must continue to run flawlessly in headless Node.js native test runner (`node --test`), where `AudioContext` and `HTMLCanvasElement` are polyfilled/mocked safely.

---

## 4. Verification & Testing Strategy

- `tests/gameFeelPhysics.test.js`:
  - Verify `Player` sprint state tracking (`isSprinting`) and speed multipliers.
  - Verify acceleration/deceleration physics calculations.
  - Verify character banking/tilt calculations during rotation.
- `tests/spatialAudio.test.js`:
  - Verify `SoundEngine.playFootstep` triggers audio without errors.
  - Verify room ambient sound transitions without hanging nodes.
- `tests/npcSpeechBubbles.test.js`:
  - Verify `NPCManager3D` creates and manages speech bubble meshes with comic text and emotes for all 6 NPCs.
  - Verify proximity triggers scale-in animation and hide on retreat.
- Full regression pass: All 81 existing tests + new tests must pass.
