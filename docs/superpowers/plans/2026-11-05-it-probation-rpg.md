# MegaSoft Corp: 60 Ngày Thử Việc — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a hybrid pixel-art office RPG + desktop OS simulator webgame where players experience a 2-month IT probation period across 4 chapters, 4 roles, 16 minigames, and 5 endings — with optional LLM-powered dynamic dialogue.

**Architecture:** Single Page App with two rendering modes — Canvas 2D for top-down office exploration, DOM-based desktop OS simulator for workstation interactions. Central state store with event bus for communication. ES6 modules, no framework.

**Tech Stack:** HTML5 Canvas 2D, Tailwind CSS (CDN), Vanilla JavaScript ES6 Modules, Web Audio API, LocalStorage, Vercel (deploy)

**Spec:** `docs/superpowers/specs/2026-11-05-it-probation-rpg-design.md`

## Global Constraints

- Zero external JS dependencies — vanilla ES6 modules only
- Tailwind CSS via CDN (play CDN for dev, standalone CLI for prod build)
- All pixel art generated procedurally via Canvas draw functions (no external image assets)
- All audio synthesized via Web Audio API (no mp3/wav files)
- Game state persisted to localStorage, auto-save on every significant event
- Must work opening index.html directly via static server (no Node.js runtime required)
- Minimum viewport: 1024×768
- Keyboard-only playable (WASD + E + Enter + Escape + Tab)
- MVP: 8 minigames (2 per role); remaining 8 are stretch goals

## Review Focus

1. **Stress ≥ 95 at any time** must immediately trigger Burnout ending regardless of chapter — verify the state setter checks this on every stress mutation
2. **Coffee limit enforcement** (max 3/day) must reset on day change — verify day transition resets `coffeeCount`
3. **LLM failure mid-dialogue** must not freeze the game — verify fallback renders static dialogue within the same frame
4. **Minigame timer expiring** must auto-submit with current score, not soft-lock — verify `checkCompletion()` fires on timeout
5. **localStorage full/unavailable** (private browsing) must not crash — verify save wraps in try/catch with console warning

---

### Task 1: Project Scaffold & Core Engine

**Files:**
- Create: `index.html`
- Create: `css/styles.css`
- Create: `src/main.js`
- Create: `src/core/gameLoop.js`
- Create: `src/core/gameState.js`
- Create: `src/core/eventBus.js`
- Create: `src/core/inputManager.js`
- Create: `src/core/viewManager.js`
- Create: `vercel.json`
- Create: `package.json` (metadata + Tailwind build script only)

**Interfaces:**
- Produces:
  - `GameState.get(path: string) → any`
  - `GameState.set(path: string, value: any) → void`
  - `GameState.subscribe(path: string, callback: Function) → unsubscribe: Function`
  - `GameState.save() → void`, `GameState.load() → object|null`
  - `EventBus.emit(event: string, data?: any) → void`
  - `EventBus.on(event: string, callback: Function) → unsubscribe: Function`
  - `InputManager.isKeyDown(key: string) → boolean`
  - `InputManager.isKeyPressed(key: string) → boolean` (single-frame)
  - `ViewManager.switch(view: "office"|"workstation") → void`
  - `ViewManager.currentView → string`
  - `GameLoop.start() → void`, `GameLoop.stop() → void`

- [ ] **Step 1:** Create `index.html` with `<canvas id="game-canvas">`, `<div id="workstation-os" class="hidden">`, `<div id="hud">`, Tailwind CDN link, and `<script type="module" src="src/main.js">`

- [ ] **Step 2:** Create `vercel.json` with `{ "cleanUrls": true, "trailingSlash": false }` static config

- [ ] **Step 3:** Create `package.json` with name `megasoft-probation-rpg`, no dependencies, script `"dev": "npx serve ."` and `"build": "npx tailwindcss -i css/styles.css -o css/output.css --minify"`

- [ ] **Step 4:** Implement `src/core/eventBus.js` — Map-based pub/sub with `on(event, cb)`, `emit(event, data)`, `off(event, cb)`

- [ ] **Step 5:** Implement `src/core/gameState.js` — Proxy-wrapped state object from spec Section 2.3 `initialState`. `get(path)` supports dot notation. `set(path, value)` updates + emits `state:changed:{path}` via EventBus + auto-calls `save()`. `save()`/`load()` wrap `localStorage.setItem`/`getItem` in try/catch. On every `set` to `player.stress`, check `≥ 95` → emit `game:burnout`

- [ ] **Step 6:** Implement `src/core/inputManager.js` — `keydown`/`keyup` listeners on `window`, tracks Set of currently-held keys. `poll()` copies current frame pressed keys then clears single-frame buffer. `isKeyDown(key)` for held, `isKeyPressed(key)` for just-pressed-this-frame

- [ ] **Step 7:** Implement `src/core/viewManager.js` — Toggles `hidden` class between `#game-canvas` and `#workstation-os`. Emits `view:changed` with new view name. `switch("office")` shows canvas, `switch("workstation")` shows OS div

- [ ] **Step 8:** Implement `src/core/gameLoop.js` — `requestAnimationFrame` loop. Calculates `deltaTime` (capped at 100ms). Each frame: `InputManager.poll()` → emit `game:update` with deltaTime → emit `game:render`. `start()`/`stop()` control loop

- [ ] **Step 9:** Implement `src/main.js` — Import all core modules. On `DOMContentLoaded`: init InputManager, attempt `GameState.load()`, start GameLoop. Wire `game:burnout` → trigger burnout ending

- [ ] **Step 10:** Verify by opening via `npx serve .` — canvas visible, no console errors, pressing keys logs in InputManager, GameLoop running at 60fps

- [ ] **Step 11:** Commit
```bash
git add -A
git commit -m "feat: project scaffold with core engine (game loop, state, events, input, view manager)"
```

---

### Task 2: Time System & HUD

**Files:**
- Create: `src/office/timeSystem.js`
- Create: `src/ui/hud.js`
- Modify: `src/main.js` (wire time + HUD)

**Interfaces:**
- Consumes: `GameState.get/set`, `EventBus.on/emit`, `GameLoop` update event
- Produces:
  - `TimeSystem.update(deltaTime: number) → void`
  - `TimeSystem.advanceMinutes(minutes: number) → void`
  - `TimeSystem.isEndOfDay() → boolean`
  - `HUD.update() → void`
  - `HUD.showNotification(text: string, duration?: number) → void`

- [ ] **Step 1:** Implement `src/office/timeSystem.js` — Listens to `game:update`. Accumulates real seconds; every 1 real second increments `state.time.minute` by 1. When minute ≥ 60: hour++, minute = 0. `advanceMinutes(n)` for instant time jumps (coffee, rest). When hour ≥ 18: emit `time:end-of-day`. When hour ≥ 20 (OT max): force end day. Emit `time:tick` every game-minute

- [ ] **Step 2:** Implement `src/ui/hud.js` — DOM overlay on `#hud`. Renders: clock `HH:MM` (top-right), Energy bar (green), Stress bar (red), KPI counter, Reputation counter, Day counter. Subscribes to state changes to update values. `showNotification(text, duration=3000)` shows toast popup top-center, auto-fades

- [ ] **Step 3:** Wire in `src/main.js`: init TimeSystem and HUD after GameState load

- [ ] **Step 4:** Verify: clock ticks from 09:00, HUD bars visible, notification shows on test emit

- [ ] **Step 5:** Commit
```bash
git add -A
git commit -m "feat: time system (1s=1min game time) and HUD overlay with stats bars"
```

---

### Task 3: Office Map Renderer & Player Movement

**Files:**
- Create: `src/office/officeRenderer.js`
- Create: `src/office/player.js`
- Create: `assets/maps/office.json`
- Create: `src/office/spriteGenerator.js`

**Interfaces:**
- Consumes: `GameLoop` update/render, `InputManager.isKeyDown`, `GameState`
- Produces:
  - `OfficeRenderer.draw(ctx: CanvasRenderingContext2D, camera: {x,y}) → void`
  - `Player.update(deltaTime: number, collisionMap: number[][]) → void`
  - `Player.position → {x: number, y: number}` (pixel coords)
  - `Player.tilePos → {tx: number, ty: number}` (tile coords)
  - `SpriteGenerator.drawCharacter(ctx, x, y, direction, frame, palette) → void`
  - `SpriteGenerator.drawTile(ctx, x, y, tileType) → void`

- [ ] **Step 1:** Create `assets/maps/office.json` — 25×20 tile grid. Each cell is integer tile type: 0=floor, 1=wall, 2=desk, 3=chair, 4=server-rack, 5=coffee-machine, 6=sofa, 7=scrum-board, 8=door. Include `collisionMap` (same dimensions, 0=walkable, 1=blocked) and `zones` array with `{id, type, tileX, tileY, label}` for interaction points

- [ ] **Step 2:** Implement `src/office/spriteGenerator.js` — Procedural pixel art via canvas draw calls. `drawTile(ctx, x, y, tileType)`: fill colored rectangles for floor (light gray), wall (dark blue-gray), desk (brown rect + monitor rect), chair (small brown), rack (dark gray + blinking green dots), coffee machine (gray + brown cup), sofa (dark green rect), scrum board (white rect with colored sticky notes). `drawCharacter(ctx, x, y, direction, frame, palette)`: 16×24 body with head circle, body rect, legs (animated per frame). 4 directions via mirroring. `palette` object for hair/shirt/pants colors

- [ ] **Step 3:** Implement `src/office/player.js` — Holds pixel position `{x, y}`, direction (0-3), animation frame + timer. `update(dt, collisionMap)`: read InputManager WASD → calculate next position at 96px/s → check collisionMap at target tile → move if walkable. Cycle walk animation frames at 0.15s intervals when moving, idle animation at 0.5s when stopped

- [ ] **Step 4:** Implement `src/office/officeRenderer.js` — Load `office.json`. Calculate camera offset: center on player, lerp factor 0.1, clamp to map bounds. `draw(ctx)`: clear canvas → iterate visible tiles (viewport + 1 tile margin) → `SpriteGenerator.drawTile` each → draw NPC sprites → draw player sprite on top. Apply lighting tint overlay based on `state.time.hour` (bright 9-12, warm 12-15, orange 15-18, dark 18-20)

- [ ] **Step 5:** Wire in `main.js`: on `game:update` → `player.update()`, on `game:render` → `officeRenderer.draw()` (only when `activeView === "office"`)

- [ ] **Step 6:** Verify: player sprite walks around office with WASD, collides with walls/desks, camera follows smoothly, lighting changes over time

- [ ] **Step 7:** Commit
```bash
git add -A
git commit -m "feat: office map renderer, procedural sprites, player movement with collision"
```

---

### Task 4: NPC System & Dialogue Engine

**Files:**
- Create: `src/office/npcManager.js`
- Create: `src/office/dialogueSystem.js`
- Create: `src/data/npcs.js`
- Create: `src/data/dialogues/chapter1.js`
- Create: `src/data/dialogues/chapter2.js`
- Create: `src/data/dialogues/chapter3.js`
- Create: `src/data/dialogues/chapter4.js`

**Interfaces:**
- Consumes: `Player.tilePos`, `GameState`, `EventBus`, `SpriteGenerator`, `OfficeRenderer`
- Produces:
  - `NPCManager.update() → void` (proximity check, show `[!]` bubble)
  - `NPCManager.interact() → void` (called on E press near NPC)
  - `DialogueSystem.start(dialogueTree: DialogueNode[]) → void`
  - `DialogueSystem.isActive() → boolean`
  - `DialogueSystem.handleInput() → void`

- [ ] **Step 1:** Create `src/data/npcs.js` — Export array of 6 NPC definitions: `{ id, name, tileX, tileY, palette (hair/shirt colors), role }` for hr_lan, pm_hung, dev_minh, qa_trang, devops_khoa, lead_duc

- [ ] **Step 2:** Create `src/data/dialogues/chapter1.js` — Export dialogue trees for Chapter 1 (Onboarding). Each NPC has 1-2 dialogue sequences. HR Lan has tutorial sequence (longest). Each dialogue: `{ npcId, chapter, condition?, nodes: [{ type:"line", speaker, text, emotion } | { type:"choice", options: [{ text, type (effect key) }] }] }`

- [ ] **Step 3:** Create dialogue data for chapters 2-4 in respective files — Chapter 2: standup choices, merge conflict, scope creep. Chapter 3: incident slack messages, blame choice. Chapter 4: five interview questions

- [ ] **Step 4:** Implement `src/office/npcManager.js` — Holds NPC array from data. `update()`: for each NPC, calculate Manhattan distance to player tile. If ≤ 2: set `nearbyNpc` ref, draw `[!]` bubble sprite above NPC. `interact()`: if `nearbyNpc` exists and E pressed → look up matching dialogue from chapter data (filter by npcId + chapter + condition) → `DialogueSystem.start(nodes)`

- [ ] **Step 5:** Implement `src/office/dialogueSystem.js` — Modal overlay `<div id="dialogue-overlay">`. Shows NPC portrait (64×64 procedural) + name + text with typewriter effect (30 chars/sec). On "line" node: Enter/E advances. On "choice" node: render 2-4 buttons, arrow keys select, Enter confirms. On choice selected: look up `CHOICE_EFFECT_TEMPLATES[option.type]` → apply stat changes via `GameState.set` → `HUD.showNotification` with effect summary → advance to next node. `isActive()` blocks player movement and other interactions while dialogue open

- [ ] **Step 6:** Wire: on E keypress in office → if DialogueSystem active, handleInput; else NPCManager.interact(). Block player movement when dialogue active

- [ ] **Step 7:** Verify: walk near NPC → `[!]` appears → E opens dialogue → text types out → choices appear → selecting choice changes stats → dialogue closes

- [ ] **Step 8:** Commit
```bash
git add -A
git commit -m "feat: NPC system with proximity detection, dialogue engine with typewriter + choices"
```

---

### Task 5: Interaction Zones & Day Cycle

**Files:**
- Create: `src/office/interactionZones.js`
- Modify: `src/office/timeSystem.js` (end-of-day popup)
- Modify: `src/main.js`

**Interfaces:**
- Consumes: `Player.tilePos`, `GameState`, `ViewManager`, `TimeSystem`, zones from `office.json`
- Produces:
  - `InteractionZones.update() → void`
  - `InteractionZones.interact() → void`
  - End-of-day popup UI + day transition logic

- [ ] **Step 1:** Implement `src/office/interactionZones.js` — Load zones from map data. `update()`: check player tile against zone positions. If on zone → show `[E] {label}` prompt overlay. `interact()`: switch on zone type:
  - `"desk"` → `ViewManager.switch("workstation")`
  - `"coffee"` → if `coffeeCount < 3`: Energy +30, Stress -10, `TimeSystem.advanceMinutes(15)`, coffeeCount++, show notification. Else: "Hôm nay uống đủ rồi!"
  - `"sofa"` → Energy +20, Stress -15, advance 30min
  - `"scrum_board"` → emit `ui:show-kanban-overlay`
  - `"server_rack"` → emit `ui:show-server-dashboard`

- [ ] **Step 2:** Add end-of-day popup to TimeSystem — On `time:end-of-day`: show modal with two buttons `[🏠 Về nhà]` and `[💪 OT +2h]`. Về nhà: emit `day:end`. OT: set state `time.hour = 18` (continue), Stress +15, show notification "OT mode! Stress tăng..."

- [ ] **Step 3:** Implement day transition on `day:end` — Increment `state.time.day`, reset hour=9 minute=0, reset coffeeCount=0, Energy natural regen +10 (cap 100), emit `day:new-day`. Calculate end-of-day KPI summary notification

- [ ] **Step 4:** Wire into main game E-press handler chain: DialogueSystem (if active) → NPCManager (if nearby NPC) → InteractionZones (if on zone)

- [ ] **Step 5:** Verify: coffee gives energy + advances time (max 3), sofa works, desk switches to workstation view, OT extends day with stress penalty, day transition resets properly

- [ ] **Step 6:** Commit
```bash
git add -A
git commit -m "feat: interaction zones (coffee, rest, desk) and day cycle with OT option"
```

---

### Task 6: Workstation OS — Window Manager & Desktop

**Files:**
- Create: `src/workstation/desktopOS.js`
- Create: `src/workstation/windowManager.js`
- Modify: `css/styles.css` (OS theme styles)

**Interfaces:**
- Consumes: `ViewManager`, `GameState`, `EventBus`
- Produces:
  - `DesktopOS.init(container: HTMLElement) → void`
  - `DesktopOS.openApp(appId: string) → void`
  - `WindowManager.createWindow(config: {title, width, height, content: HTMLElement}) → WindowInstance`
  - `WindowInstance.close()`, `.minimize()`, `.maximize()`, `.focus()`

- [ ] **Step 1:** Add OS theme styles to `css/styles.css` — Tailwind utilities + custom classes for: `.os-taskbar` (bottom bar, dark bg), `.os-window` (white bg, shadow, rounded), `.os-titlebar` (drag handle, blue accent, buttons), `.os-desktop` (full viewport, subtle wallpaper gradient). Window dragging cursor, minimize animation, z-index layering

- [ ] **Step 2:** Implement `src/workstation/windowManager.js` — `createWindow({title, width, height, content, appId})`: creates `.os-window` div with titlebar (title text + minimize/maximize/close buttons) + content area. Drag via mousedown on titlebar + mousemove. Resize via corner handle. Close removes from DOM + deregisters. Minimize hides + shows taskbar indicator. Z-index: track `topZ` counter, click window → bring to front. Returns WindowInstance object

- [ ] **Step 3:** Implement `src/workstation/desktopOS.js` — On `init(container)`: render taskbar with app icons (SlackChat, JiraBoard, Terminal, CodeEditor, Browser, FileManager) + clock + mini Energy/Stress bars + `[🔙 Rời bàn]` button. Click icon → `openApp(appId)` → create window via WindowManager with app-specific content. `[🔙 Rời bàn]` → `ViewManager.switch("office")`

- [ ] **Step 4:** Wire in main.js: on `view:changed` to "workstation" → `DesktopOS.init(document.getElementById("workstation-os"))`

- [ ] **Step 5:** Verify: clicking desk in office → OS desktop appears → click app icons → windows open/drag/resize/minimize/close → "Rời bàn" returns to office

- [ ] **Step 6:** Commit
```bash
git add -A
git commit -m "feat: workstation OS with window manager (drag, resize, minimize, z-stack)"
```

---

### Task 7: Workstation Apps — SlackChat & JiraBoard

**Files:**
- Create: `src/workstation/apps/slackChat.js`
- Create: `src/workstation/apps/jiraBoard.js`
- Create: `src/workstation/ticketSystem.js`
- Create: `src/data/tickets.js`

**Interfaces:**
- Consumes: `WindowManager`, `GameState`, `EventBus`, `TimeSystem`
- Produces:
  - `SlackChat.render(container: HTMLElement) → void`
  - `SlackChat.addMessage(channel, sender, text, options?) → void`
  - `JiraBoard.render(container: HTMLElement) → void`
  - `TicketSystem.getTicketsForChapter(chapter, role) → Ticket[]`
  - `TicketSystem.startTicket(ticketId) → void` (emits `minigame:start`)
  - `TicketSystem.completeTicket(ticketId, result) → void`

- [ ] **Step 1:** Create `src/data/tickets.js` — Export array of 8 MVP tickets (2 per role), following schema from spec Section 4.3. Frontend: `cssLayoutFix` (ch2 medium), `bugHuntUI` (ch3 hard). Backend: `apiPipeline` (ch2 medium), `logDetective` (ch3 hard). QA: `bugSpotter` (ch2 medium), `testCaseBuilder` (ch3 hard). DevOps: `yamlSurgeon` (ch2 medium), `incidentCommander` (ch3 hard)

- [ ] **Step 2:** Implement `src/workstation/apps/slackChat.js` — Left sidebar: channel list (#general, #dev, #incidents, #random) with unread badges. Right area: message list (scrollable) + input area with 2-3 reply option buttons (not free text). `addMessage(channel, sender, text, options)`: appends message bubble, if options provided shows reply buttons → on click applies `CHOICE_EFFECT_TEMPLATES` effect. Auto-scroll to bottom. Messages stored in `gameState.slackMessages`

- [ ] **Step 3:** Implement `src/workstation/ticketSystem.js` — `getTicketsForChapter(ch, role)` filters tickets by chapter ≤ ch and matching role. `startTicket(id)`: set `state.activeTicket = id`, emit `minigame:start` with ticket data. `completeTicket(id, {score, maxScore})`: calculate rank (Perfect/Good/Barely/Failed), apply rewards/penalties per spec Section 5.6, move ticket to Done, advance game time by `ticket.gameDuration`, emit `ticket:completed`

- [ ] **Step 4:** Implement `src/workstation/apps/jiraBoard.js` — 4-column Kanban: To Do | In Progress | Review | Done. Render ticket cards from TicketSystem filtered by current chapter+role. Each card shows: ID badge, title, difficulty color (green/yellow/orange/red). Click card → detail popup (description, hint, reward info). "Bắt đầu" button on To Do cards → `TicketSystem.startTicket()`. After minigame complete → ticket auto-moves to Review→Done

- [ ] **Step 5:** Verify: open SlackChat → messages display → reply buttons work → stats change. Open JiraBoard → tickets show for current role → click ticket → detail shows

- [ ] **Step 6:** Commit
```bash
git add -A
git commit -m "feat: SlackChat and JiraBoard apps with ticket system"
```

---

### Task 8: Workstation Apps — Terminal, CodeEditor, Browser, FileManager

**Files:**
- Create: `src/workstation/apps/terminal.js`
- Create: `src/workstation/apps/codeEditor.js`
- Create: `src/workstation/apps/browser.js`
- Create: `src/workstation/apps/fileManager.js`
- Create: `src/data/projectFiles.js`

**Interfaces:**
- Consumes: `WindowManager`, `GameState`
- Produces:
  - `Terminal.render(container) → void`, `Terminal.executeCommand(cmd) → string`
  - `CodeEditor.render(container) → void`, `CodeEditor.loadFile(path, content) → void`, `CodeEditor.getContent() → string`
  - `Browser.render(container) → void`, `Browser.loadPage(html) → void`
  - `FileManager.render(container) → void`

- [ ] **Step 1:** Create `src/data/projectFiles.js` — Fake ProjectX file tree: `{ name: "src", children: [{ name: "components", children: [...] }, { name: "api", children: [...] }] }`. Each leaf has `content` (short code snippet relevant to role minigames)

- [ ] **Step 2:** Implement `src/workstation/apps/terminal.js` — Monospace dark div, prompt `megasoft@dev:~$`. Input field at bottom. Command whitelist: `git log/status/add/commit/push/revert`, `npm run build/test`, `docker ps/logs/build`, `kubectl get pods/rollout`, `ls`, `cd`, `cat`, `clear`, `help`. Each returns contextual fake output string. Tab autocomplete from whitelist. Unknown command → "command not found — type 'help' for available commands"

- [ ] **Step 3:** Implement `src/workstation/apps/codeEditor.js` — Textarea with line numbers gutter (absolute positioned div). Basic syntax highlighting via regex replace on render: keywords (blue), strings (green), comments (gray), numbers (orange). `loadFile(path, content)` sets title + content. `getContent()` returns current text. Used by minigames for code editing challenges

- [ ] **Step 4:** Implement `src/workstation/apps/browser.js` — Address bar (read-only, shows URL). Content area renders sanitized HTML via `innerHTML` (only during minigames with controlled content). `loadPage(html)` sets content. Used by Frontend/QA minigames to show "ProjectX" UI

- [ ] **Step 5:** Implement `src/workstation/apps/fileManager.js` — Tree view with expand/collapse folders. Click file → emit `file:open` with path+content → CodeEditor opens with that file. Icons: 📁 folder, 📄 file (color by extension: .js yellow, .css blue, .html orange, .yml gray)

- [ ] **Step 6:** Verify: all 4 apps open in windows, terminal accepts commands, code editor shows syntax colors, browser renders HTML, file manager navigates tree and opens files in editor

- [ ] **Step 7:** Commit
```bash
git add -A
git commit -m "feat: Terminal, CodeEditor, Browser, FileManager workstation apps"
```

---

### Task 9: Minigame Engine & Frontend Minigames (2 MVP)

**Files:**
- Create: `src/minigames/minigameManager.js`
- Create: `src/minigames/frontend/cssLayoutFix.js`
- Create: `src/minigames/frontend/bugHuntUI.js`
- Create: `src/data/minigameContent/frontend.js`

**Interfaces:**
- Consumes: `TicketSystem`, `CodeEditor`, `Browser`, `WindowManager`, `TimeSystem`, `GameState`
- Produces:
  - `MinigameManager.start(ticket: Ticket) → void`
  - `MinigameManager.end(result: {score, maxScore}) → void`
  - Base class pattern for all minigames: `{ start(container), update(dt), checkCompletion(), destroy() }`

- [ ] **Step 1:** Implement `src/minigames/minigameManager.js` — Listens to `minigame:start`. Creates timer bar UI (countdown from `ticket.timeLimit`). Instantiates correct minigame class by `ticket.minigameType`. On timer expire: call `checkCompletion()` → `end(result)`. `end(result)`: destroy minigame, call `TicketSystem.completeTicket()`, show result popup (⭐ rating + stat changes), emit `minigame:ended`

- [ ] **Step 2:** Create `src/data/minigameContent/frontend.js` — CSS Layout Fix puzzle data: `{ targetCSS: "correct css string", brokenCSS: "css with 3-5 errors", htmlTemplate: "page html", mockupDescription: "what it should look like" }`. Bug Hunt UI data: `{ screenshotHTML: "rendered page html", bugs: [{x, y, width, height, description}] }` for 3 difficulty levels

- [ ] **Step 3:** Implement `src/minigames/frontend/cssLayoutFix.js` — Split view: left = Browser showing broken page (rendered HTML with broken CSS), right = CodeEditor with the CSS to fix. Player edits CSS → clicks `[Preview]` → Browser re-renders with edited CSS. `checkCompletion()`: compare key CSS properties against target values, count correct properties. Score = correct/total

- [ ] **Step 4:** Implement `src/minigames/frontend/bugHuntUI.js` — Split view: left = "Mockup" (correct HTML render), right = "Actual" (HTML with 5 subtle differences). Player clicks on differences in right panel. Clicked spots highlight. `checkCompletion()`: score = found bugs / total bugs. Limited clicks (total bugs + 3) to prevent brute force

- [ ] **Step 5:** Verify: trigger Frontend ticket → cssLayoutFix opens in workstation → edit CSS → preview updates → complete → score + stats. Same for bugHuntUI

- [ ] **Step 6:** Commit
```bash
git add -A
git commit -m "feat: minigame engine + Frontend minigames (CSS Layout Fix, Bug Hunt UI)"
```

---

### Task 10: Backend & QA & DevOps Minigames (6 MVP)

**Files:**
- Create: `src/minigames/backend/apiPipeline.js`
- Create: `src/minigames/backend/logDetective.js`
- Create: `src/minigames/qa/bugSpotter.js`
- Create: `src/minigames/qa/testCaseBuilder.js`
- Create: `src/minigames/devops/yamlSurgeon.js`
- Create: `src/minigames/devops/incidentCommander.js`
- Create: `src/data/minigameContent/backend.js`
- Create: `src/data/minigameContent/qa.js`
- Create: `src/data/minigameContent/devops.js`

**Interfaces:**
- Consumes: `MinigameManager`, `CodeEditor`, `Browser`, `Terminal`, `WindowManager`
- Produces: 6 minigame classes each implementing `{ start, update, checkCompletion, destroy }`

- [ ] **Step 1:** Create data files for all 6 minigames in `src/data/minigameContent/` — API Pipeline node definitions + correct order; Log text blocks with planted root cause lines + red herrings; Bug Spotter interactive HTML with 5 hidden bugs; Test case items with correct categorizations; YAML file with 4-6 syntax errors; Incident 5-step correct sequence

- [ ] **Step 2:** Implement `apiPipeline.js` — Browser shows flow diagram (HTML/CSS boxes + arrows). 5-6 draggable process nodes at bottom. Player drags nodes into pipeline slots in correct order (validate→auth→transform→query→serialize→respond). Drop zones highlight on drag-over. `checkCompletion()`: count nodes in correct position / total

- [ ] **Step 3:** Implement `logDetective.js` — Terminal-style scrolling log (200+ lines, auto-scroll). Player scrolls through, clicks lines to mark as "root cause". 1 correct root cause buried among INFO/WARN/misleading ERROR lines. `checkCompletion()`: found root cause = 100%, wrong line = 0%, partial credit for related errors

- [ ] **Step 4:** Implement `bugSpotter.js` — Browser renders interactive fake app. Player clicks/types/navigates to discover 5 bugs (button 404, text overflow, negative cart, XSS display, missing validation). Each found bug adds to found list with description. `checkCompletion()`: found / 5

- [ ] **Step 5:** Implement `testCaseBuilder.js` — 4 category columns (Happy Path, Edge Case, Boundary, Negative). 10 test case cards to drag into correct columns. `checkCompletion()`: correctly categorized / total

- [ ] **Step 6:** Implement `yamlSurgeon.js` — CodeEditor with YAML CI/CD pipeline containing 4-6 errors. Visual pipeline status bar shows stages (Build→Test→Deploy). Each fixed error turns a stage green. `checkCompletion()`: fixed errors / total errors

- [ ] **Step 7:** Implement `incidentCommander.js` — Split Terminal + Browser dashboard. 5 action buttons in sequence: Acknowledge Alert → Check Logs → Identify Root Cause (3 options) → Execute Rollback → Write Post-mortem. Must do in correct order. Dashboard shows server status animation (red→yellow→green as steps complete). `checkCompletion()`: correct steps in order / 5

- [ ] **Step 8:** Verify: each minigame launches from its ticket, plays through, scores correctly, awards stats

- [ ] **Step 9:** Commit
```bash
git add -A
git commit -m "feat: Backend, QA, DevOps minigames (6 MVP: apiPipeline, logDetective, bugSpotter, testCaseBuilder, yamlSurgeon, incidentCommander)"
```

---

### Task 11: Chapter System & Story Progression

**Files:**
- Create: `src/story/chapterManager.js`
- Create: `src/story/chapters/chapter1.js`
- Create: `src/story/chapters/chapter2.js`
- Create: `src/story/chapters/chapter3.js`
- Create: `src/story/chapters/chapter4.js`
- Create: `src/story/randomEvents.js`
- Create: `src/ui/cutscenePlayer.js`

**Interfaces:**
- Consumes: `GameState`, `EventBus`, `DialogueSystem`, `SlackChat`, `JiraBoard`, `NPCManager`, `TimeSystem`
- Produces:
  - `ChapterManager.init() → void`
  - `ChapterManager.advanceEvent() → void`
  - `CutscenePlayer.play(scenes: Scene[]) → Promise<void>`
  - `RandomEvents.rollDaily() → void`

- [ ] **Step 1:** Implement `src/ui/cutscenePlayer.js` — Fullscreen overlay with dark background. Shows scene image (procedural) + text box at bottom with typewriter text. Supports: `{ type:"narration", text }`, `{ type:"dialogue", speaker, text, emotion }`, `{ type:"choice", options }`. Enter/E advances. Returns Promise that resolves when sequence complete

- [ ] **Step 2:** Implement `src/story/chapters/chapter1.js` — Export event sequence array. Events: opening cutscene (name input + role selection) → HR Lan tour trigger (sequential NPC dialogues) → desk tutorial (force switch to workstation, guided SlackChat + JiraBoard interaction) → tutorial minigame ticket auto-assigned → completion Slack message from PM. Each event has `type` ("cutscene"|"dialogue"|"forceMove"|"assignTicket"|"slackMessage"), `trigger` ("auto"|"onDay"|"onTicketComplete"), and `data`

- [ ] **Step 3:** Implement chapters 2-4 similarly — Ch2: day-triggered standup dialogue, 3-4 ticket assignments, merge conflict event (day 3), scope creep event (day 5), sprint review cutscene. Ch3: incident trigger cutscene, role-specific boss ticket, blame choice dialogue, post-mortem cutscene. Ch4: final day free-roam, 1-on-1 interview (5 question dialogue tree)

- [ ] **Step 4:** Implement `src/story/chapterManager.js` — Tracks `state.chapter` and `state.chapterProgress` (event index). On game start / day start: check current chapter's event list, fire events whose trigger conditions are met. `advanceEvent()`: increment progress, check next event. Chapter transitions: when all events in chapter complete → cutscene bridge → increment `state.chapter`. Listen to `ticket:completed`, `day:new-day`, `dialogue:ended` to check triggers

- [ ] **Step 5:** Implement `src/story/randomEvents.js` — On `day:new-day`: 30% chance roll one random event from pool (spec Section 8). Each event: show notification → cutscene/dialogue → apply effects. Track which events fired to avoid repeats within same playthrough. Pool: birthday, pizza, laptop lag, phishing email, ping pong, rain wifi, CEO all-hands

- [ ] **Step 6:** Verify: start new game → Chapter 1 flows through onboarding → completes → Chapter 2 begins with standup. Random events trigger on some days

- [ ] **Step 7:** Commit
```bash
git add -A
git commit -m "feat: chapter system with 4 chapters, story events, cutscenes, random events"
```

---

### Task 12: Menu Screen, Endings & Result Screen

**Files:**
- Create: `src/ui/menuScreen.js`
- Create: `src/story/endingSystem.js`
- Create: `src/ui/resultScreen.js`

**Interfaces:**
- Consumes: `GameState`, `CutscenePlayer`, `EventBus`
- Produces:
  - `MenuScreen.show() → void` (title screen + new game / continue)
  - `EndingSystem.evaluate() → EndingId`
  - `ResultScreen.show(endingId, stats) → void`

- [ ] **Step 1:** Implement `src/ui/menuScreen.js` — Fullscreen overlay: game title "MegaSoft Corp: 60 Ngày Thử Việc" in pixel font, subtitle, animated pixel office background (simple parallax). Buttons: `[🎮 Chơi mới]` (reset state, start Chapter 1), `[▶ Tiếp tục]` (load from localStorage, disabled if no save), `[⚙️ Cài đặt]` (volume sliders + LLM config). Show on game boot

- [ ] **Step 2:** Implement `src/story/endingSystem.js` — `evaluate()`: read final stats from GameState. Apply ending conditions in priority order: Burnout (stress ≥ 95 flag), Ngôi Sao Mới (kpi≥80 && rep≥70 && stress<50), Đủ Điểm Đậu (kpi≥60 && rep≥50), Gia Hạn (kpi 40-59 || rep 30-49), Không Phù Hợp (kpi<40 || rep<30). Return ending config: `{ id, title, emoji, description, leadQuote }`

- [ ] **Step 3:** Implement `src/ui/resultScreen.js` — Fullscreen "Phiếu Đánh Giá Thử Việc" card: ending emoji + title, Tech Lead quote, 4 stat bars with final values, radar chart (canvas-drawn quadrilateral for KPI/Rep/Energy/Stress on 4 axes), stats summary table, `[🔄 Chơi lại với Role khác]` button (→ MenuScreen). Confetti animation for ending #1 (canvas particles)

- [ ] **Step 4:** Wire: Chapter 4 final event → `EndingSystem.evaluate()` → `ResultScreen.show()`. Burnout: listen to `game:burnout` → immediate ending at any chapter. Menu: show on first load and on replay

- [ ] **Step 5:** Verify: complete Chapter 4 → correct ending displays based on stats → radar chart renders → replay button works → burnout triggers mid-game if stress hits 95

- [ ] **Step 6:** Commit
```bash
git add -A
git commit -m "feat: menu screen, 5 endings evaluation, result screen with radar chart"
```

---

### Task 13: Audio Engine

**Files:**
- Create: `src/audio/soundEngine.js`
- Modify: various files (add sound triggers)

**Interfaces:**
- Consumes: `GameState` (volume settings), `EventBus`
- Produces:
  - `SoundEngine.playBGM(track: string) → void`
  - `SoundEngine.stopBGM() → void`
  - `SoundEngine.playSFX(name: string) → void`
  - `SoundEngine.setVolume(type: "music"|"sfx", value: number) → void`

- [ ] **Step 1:** Implement `src/audio/soundEngine.js` — Web Audio API `AudioContext`. BGM: generate chiptune loop using oscillators (square wave melody + triangle bass + noise percussion). Tracks: "office" (calm, 100bpm), "incident" (tense, 140bpm), "menu" (upbeat, 120bpm). SFX functions: `footstep` (short noise burst), `keyboard` (high click), `slackDing` (two-tone chime), `alert` (ascending square wave siren), `success` (C-E-G arpeggio), `fail` (descending chromatic), `coffee` (noise + low bubble). Volume from `state.settings`. Lazy-init AudioContext on first user interaction (browser policy)

- [ ] **Step 2:** Wire sound triggers throughout codebase — Player movement: footstep every 4th frame. Dialogue advance: soft click. Slack message: slackDing. Minigame complete: success/fail. Coffee: coffee sound. Chapter 3 incident: alert + switch BGM to "incident". Menu: menu BGM. Office: office BGM

- [ ] **Step 3:** Verify: sounds play at correct moments, volume controls work, no audio glitches on rapid triggers

- [ ] **Step 4:** Commit
```bash
git add -A
git commit -m "feat: 8-bit audio engine with Web Audio API synthesized BGM and SFX"
```

---

### Task 14: LLM Integration Layer

**Files:**
- Create: `src/core/llmProvider.js`
- Create: `src/story/dynamicDialogue.js`
- Create: `src/data/npcPersonas.js`
- Create: `src/ui/settingsLLM.js`
- Modify: `src/office/dialogueSystem.js` (use dynamicDialogue)
- Modify: `src/workstation/apps/slackChat.js` (use dynamicDialogue)
- Modify: `src/ui/menuScreen.js` (add settings)

**Interfaces:**
- Consumes: `GameState`, `DialogueSystem`, `SlackChat`, all static dialogue data
- Produces:
  - `LLMProvider.generate(systemPrompt, userPrompt, options?) → Promise<string|null>`
  - `LLMProvider.isEnabled() → boolean`
  - `DynamicDialogue.getDialogue(npcId, chapter, gameState) → Promise<DialogueNode[]>`
  - `DynamicDialogue.getSlackMessage(channel, context) → Promise<{text, options?}>`

- [ ] **Step 1:** Create `src/data/npcPersonas.js` — System prompts for each NPC (personality, speech patterns, emoji habits) per spec Section 12.4. Include output format instructions: return JSON `{ lines: [{speaker, text, emotion}], choices: [{text, type}] }` where `type` must be one of CHOICE_EFFECT_TEMPLATES keys

- [ ] **Step 2:** Implement `src/core/llmProvider.js` — Constructor takes `{provider, apiKey, baseUrl}` from `state.settings`. `generate(system, user, {maxTokens: 300, temperature: 0.8})`: if Gemini → `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent` with API key. If OpenAI → `POST https://api.openai.com/v1/chat/completions`. If custom → POST to baseUrl. Timeout 5s via AbortController. Retry 1x on failure. Return parsed text or null. `test()` method: send simple prompt, return boolean

- [ ] **Step 3:** Implement `src/story/dynamicDialogue.js` — `getDialogue(npcId, chapter, state)`: build user prompt with context (current stats, recent events, role). Check `sessionStorage` cache key `dlg_{npcId}_{chapter}_{hash(stats)}`. If cached → return parsed. If LLM enabled → call `LLMProvider.generate(persona, prompt)` → parse JSON → validate (has lines array, choices have valid types) → cache → return. On any failure → return `staticDialogues[npcId][chapter]`. `pregenerate(chapter, state)`: batch call for all NPC dialogues in chapter (single large prompt → parse sections)

- [ ] **Step 4:** Implement `src/ui/settingsLLM.js` — Modal form: radio Offline/LLM, dropdown provider (Gemini/OpenAI/Custom), text input API key (password masked), text input custom URL (shown only for Custom), `[Test]` button → calls `LLMProvider.test()` → shows ✅/❌, info text "Key lưu trên máy bạn", `[Lưu]`/`[Hủy]`. Save to `state.settings.llm`

- [ ] **Step 5:** Modify `dialogueSystem.js`: before starting dialogue, await `DynamicDialogue.getDialogue()` instead of reading static data directly. Show brief loading indicator ("...") if LLM call in progress

- [ ] **Step 6:** Modify `slackChat.js`: NPC auto-messages use `DynamicDialogue.getSlackMessage()` when LLM enabled

- [ ] **Step 7:** Add settings button to menu screen and workstation taskbar

- [ ] **Step 8:** Verify: with no API key → game works fully with static dialogues. With valid Gemini key → NPC dialogues are dynamic and different each time. With invalid key → fallback works, no crash. Test connection button works

- [ ] **Step 9:** Commit
```bash
git add -A
git commit -m "feat: LLM integration layer with Gemini/OpenAI support, dynamic dialogue, fallback to static"
```

---

### Task 15: Polish, Deploy & Final Integration

**Files:**
- Modify: `index.html` (meta tags, favicon, loading screen)
- Modify: `css/styles.css` (responsive, loading, transitions)
- Modify: `vercel.json` (final config)
- Create: `README.md`

**Interfaces:**
- Consumes: All modules
- Produces: Deployable, polished game

- [ ] **Step 1:** Add loading screen to `index.html` — Simple CSS spinner + "MegaSoft Corp" text, hidden after `main.js` init complete. Add meta tags (title, description, og:image placeholder, viewport). Add inline CSS for loading screen (no FOUC)

- [ ] **Step 2:** Add view transitions — Fade-in/out (CSS opacity transition 300ms) when switching Office ⇄ Workstation. Chapter transition: brief black screen with chapter title text

- [ ] **Step 3:** Responsive adjustments — Canvas scales to fit viewport maintaining 4:3 aspect. Workstation OS adjusts window sizes for smaller screens. HUD repositions. Min-width media query shows "best on desktop" message below 1024px

- [ ] **Step 4:** Keyboard accessibility audit — Ensure all interactive elements reachable via Tab. Escape closes modals/dialogues. All minigames playable with keyboard (no mouse-only actions except optional drag shortcuts)

- [ ] **Step 5:** Create `README.md` — Game title, description, screenshot placeholder, how to play (controls), how to run locally (`npx serve .`), how to deploy to Vercel (`vercel --prod`), LLM setup instructions, tech stack, credits

- [ ] **Step 6:** Final integration test — Play through complete Chapter 1-4 as Frontend role. Verify: menu → role select → onboarding → tickets → minigames → day cycle → chapter transitions → incident → review → ending screen → replay. Check localStorage save/load works across browser refresh

- [ ] **Step 7:** Deploy to Vercel
```bash
npx vercel --prod
```

- [ ] **Step 8:** Commit
```bash
git add -A
git commit -m "feat: polish, responsive, accessibility, README, Vercel deploy"
```
