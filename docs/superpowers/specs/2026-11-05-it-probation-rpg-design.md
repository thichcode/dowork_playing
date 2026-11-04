# IT Probation RPG — Design Specification

**Tên game:** MegaSoft Corp: 60 Ngày Thử Việc  
**Thể loại:** Webgame nhập vai mô phỏng thử việc IT  
**Phong cách:** Hybrid — Pixel 2D Office Top-Down + Desktop OS giả lập  
**Công nghệ:** Single Page App (HTML5 Canvas 2D + Tailwind CSS + Vanilla JS ES6 Modules)  
**Lưu trữ:** LocalStorage (auto-save)  
**Ngày tạo:** 2026-11-05  

---

## 1. Tổng Quan

Người chơi vào vai một kỹ sư IT mới ra trường, được nhận thử việc 2 tháng tại **MegaSoft Corp** — công ty phần mềm lớn đang phát triển sản phẩm SaaS "ProjectX". Game kết hợp hai chế độ tương tác:

- **Office Mode (Canvas 2D):** Di chuyển nhân vật pixel art quanh văn phòng, tương tác NPC, quản lý thời gian và chỉ số.
- **Workstation OS Mode (HTML/CSS):** Giao diện máy tính giả lập với SlackChat, JiraBoard, Terminal, CodeEditor, Browser — nơi hoàn thành các minigame kỹ thuật theo role.

Tiến trình game chia thành **4 Chương** (Chapter-based), kết thúc bằng buổi đánh giá thử việc với **5 ending** khác nhau dựa trên 4 chỉ số tích lũy: KPI, Reputation, Energy, Stress.

---

## 2. Kiến Trúc Kỹ Thuật

### 2.1 Stack công nghệ

| Thành phần | Công nghệ | Ghi chú |
|------------|-----------|---------|
| Rendering văn phòng | HTML5 Canvas 2D | Tile-based 32×32px, camera follow |
| UI hệ điều hành | HTML + Tailwind CSS | Draggable windows, taskbar |
| Logic game | Vanilla JavaScript (ES6 Modules) | Không framework, không bundler bắt buộc |
| Âm thanh | Web Audio API | Tổng hợp 8-bit chiptune realtime |
| Lưu trữ | LocalStorage | Auto-save sau mỗi sự kiện quan trọng |
| Font | Pixel font (embed via CSS @font-face) | Phong cách retro |

### 2.2 Cấu trúc thư mục

```
game_thuviec/
├── index.html                  # Entry point duy nhất
├── css/
│   └── styles.css              # Tailwind + custom OS theme
├── assets/
│   ├── sprites/                # Tileset, character sprites, NPC portraits
│   ├── maps/                   # Map data JSON (tile collision)
│   └── fonts/                  # Pixel font files
├── src/
│   ├── main.js                 # Bootstrap, game loop init
│   ├── core/
│   │   ├── gameLoop.js         # requestAnimationFrame loop
│   │   ├── gameState.js        # Central state store + localStorage
│   │   ├── eventBus.js         # Event emitter pub/sub
│   │   ├── inputManager.js     # Keyboard input handler
│   │   └── viewManager.js      # Office ⇄ Workstation view switching
│   ├── office/
│   │   ├── officeRenderer.js   # Canvas 2D tile rendering + camera
│   │   ├── player.js           # Player sprite, movement, collision
│   │   ├── npcManager.js       # NPC positions, proximity detection
│   │   ├── dialogueSystem.js   # Dialogue tree engine + choice handling
│   │   ├── interactionZones.js # Special interaction points (desk, pantry, etc.)
│   │   └── timeSystem.js       # In-game clock 09:00-18:00, day cycle
│   ├── workstation/
│   │   ├── desktopOS.js        # Window manager (drag, resize, minimize)
│   │   ├── apps/
│   │   │   ├── slackChat.js    # Chat channels, NPC messages, reply choices
│   │   │   ├── jiraBoard.js    # Kanban board, ticket management
│   │   │   ├── terminal.js     # Command-line with autocomplete
│   │   │   ├── codeEditor.js   # Syntax highlighted editor
│   │   │   ├── browser.js      # Fake browser with page render
│   │   │   └── fileManager.js  # Project directory tree
│   │   └── ticketSystem.js     # Ticket metadata, minigame trigger
│   ├── minigames/
│   │   ├── minigameManager.js  # Scoring, timer, result handling
│   │   ├── frontend/
│   │   │   ├── cssLayoutFix.js
│   │   │   ├── bugHuntUI.js
│   │   │   ├── responsiveChallenge.js
│   │   │   └── stateDebugger.js
│   │   ├── backend/
│   │   │   ├── apiPipeline.js
│   │   │   ├── queryOptimizer.js
│   │   │   ├── deadlockResolver.js
│   │   │   └── logDetective.js
│   │   ├── qa/
│   │   │   ├── bugSpotter.js
│   │   │   ├── testCaseBuilder.js
│   │   │   ├── regressionRoulette.js
│   │   │   └── ticketTriage.js
│   │   └── devops/
│   │       ├── yamlSurgeon.js
│   │       ├── containerTetris.js
│   │       ├── incidentCommander.js
│   │       └── deployPipeline.js
│   ├── story/
│   │   ├── chapterManager.js   # Chapter progression logic
│   │   ├── chapters/
│   │   │   ├── chapter1.js     # Onboarding & Setup
│   │   │   ├── chapter2.js     # First Sprint
│   │   │   ├── chapter3.js     # Production Incident
│   │   │   └── chapter4.js     # Probation Review
│   │   ├── randomEvents.js     # Random daily events
│   │   └── endingSystem.js     # 5 endings + result screen
│   ├── ui/
│   │   ├── hud.js              # Stats bar, clock, notifications
│   │   ├── menuScreen.js       # Title screen, role selection
│   │   ├── cutscenePlayer.js   # Story cutscene renderer
│   │   └── resultScreen.js     # Ending card, radar chart, replay
│   └── audio/
│       └── soundEngine.js      # Web Audio API 8-bit synth
└── docs/
    └── superpowers/
        └── specs/
            └── (this file)
```

### 2.3 Core State Schema

```javascript
const initialState = {
  player: {
    name: "",
    role: null,           // "frontend" | "backend" | "qa" | "devops"
    energy: 100,          // 0-100, 0 = collapse
    stress: 20,           // 0-100, ≥95 = burnout ending
    kpi: 50,              // 0-100, probation score
    reputation: 50        // 0-100, team relationships
  },
  chapter: 0,             // 0=menu, 1-4=chapters
  chapterProgress: 0,     // Event index within current chapter
  time: {
    day: 1,
    hour: 9,
    minute: 0
  },
  activeView: "office",   // "office" | "workstation"
  completedTickets: [],    // Array of ticket IDs
  activeTicket: null,
  dialogueFlags: {},       // Track NPC dialogue state
  eventFlags: {},          // Track story choices made
  randomEventsToday: [],
  coffeeCount: 0,          // Max 3/day
  settings: {
    musicVolume: 0.5,
    sfxVolume: 0.7
  }
};
```

### 2.4 Game Loop

```
┌─────────────────────────────────────────────┐
│            requestAnimationFrame            │
│                                             │
│  1. inputManager.poll()                     │
│  2. timeSystem.update(deltaTime)            │
│  3. if (activeView === "office")            │
│       player.update()                       │
│       npcManager.update()                   │
│       officeRenderer.draw()                 │
│     else                                    │
│       workstation handles own DOM events    │
│  4. hud.update()                            │
│  5. eventBus.flush()                        │
└─────────────────────────────────────────────┘
```

Workstation OS mode thoát khỏi canvas loop — UI tương tác hoàn toàn qua DOM events (click, drag, input). Game loop chỉ tiếp tục cập nhật đồng hồ (timeSystem) và HUD.

---

## 3. Chế Độ Văn Phòng (Office Mode)

### 3.1 Bản đồ

Tile-based map, mỗi tile 32×32px. Tổng kích thước map: ~25×20 tiles (800×640px logical). Camera viewport responsive, scale theo cửa sổ trình duyệt, camera follow player với lerp smoothing, clamp ở biên map.

**Layout các khu vực:**

| Khu vực | Vị trí tile (x,y approx) | NPCs | Tương tác |
|---------|--------------------------|------|-----------|
| Sảnh Lễ tân | (1,1)-(6,4) | HR Lan | Tutorial, hồ sơ |
| Phòng họp Standup | (7,1)-(12,4) | PM Hùng | Nhận ticket, daily standup |
| Khu Dev Seats | (1,5)-(6,9) | Senior Dev Minh + Player's desk | Mentor, code review, **vào Workstation** |
| Khu QA / Testing Lab | (7,5)-(12,9) | QA Lead Trang | Drama, test feedback |
| Server Room | (1,10)-(6,13) | DevOps Khoa | Incident trigger, server status |
| Pantry / Break Room | (7,10)-(12,13) | Random NPC gossip | Cà phê (+Energy), sofa (+rest) |
| Phòng Tech Lead | (1,14)-(6,17) | Tech Lead Đức | KPI review, 1-on-1 |
| Hành lang | (7,14)-(12,17) | — | Trang trí, easter egg |

**Collision map:** Mảng 2D `0` = walkable, `1` = blocked (tường, bàn, rack). Được load từ JSON file.

### 3.2 Player Character

- Sprite: 16×24px pixel art.
- Animation frames: idle (3 frames, 0.5s/frame), walk (4 frames × 4 hướng, 0.15s/frame).
- Tốc độ di chuyển: 3 tiles/giây (96px/s).
- Input: WASD hoặc Arrow Keys. Collision check trước khi di chuyển.

### 3.3 NPC System

Mỗi NPC:
- Vị trí tile cố định, sprite 16×24px với idle animation.
- Interaction radius: 2 tiles. Khi player trong radius → hiện bubble `[!]` phía trên NPC.
- Bấm `[E]` → mở dialogue overlay.

**6 NPC chính:**

| ID | Tên | Vị trí | Vai trò narrative |
|----|-----|--------|-------------------|
| `hr_lan` | HR Lan | Sảnh | Onboarding guide, policy info |
| `pm_hung` | PM Hùng | Phòng họp | Task assignment, sprint management |
| `dev_minh` | Senior Dev Minh | Khu Dev | Technical mentor, code review |
| `qa_trang` | QA Lead Trang | Khu QA | Bug reporter, drama queen "máy tôi chạy bình thường" |
| `devops_khoa` | DevOps Khoa | Server Room | Infrastructure, incident response |
| `lead_duc` | Tech Lead Đức | Phòng Lead | Evaluator, probation decision maker |

### 3.4 Dialogue System

Dialogue tree engine hỗ trợ:
- **Linear lines:** Tuần tự hiển thị text với speaker name + emotion portrait (64×64px).
- **Choice nodes:** 2-4 lựa chọn, mỗi lựa chọn có `effect` object thay đổi state.
- **Conditional branching:** `condition` function kiểm tra state trước khi hiển thị node (ví dụ: chỉ hiện nếu `player.role === "backend"` hoặc `chapter === 2`).
- **Flag-gated:** Dialogue thay đổi dựa trên `dialogueFlags` (đã nói chuyện chưa, đã chọn gì trước đó).

```javascript
// Dialogue node structure
{
  npcId: "qa_trang",
  chapter: 2,
  condition: (state) => state.player.role === "backend",
  nodes: [
    { type: "line", speaker: "Trang", text: "...", emotion: "annoyed" },
    {
      type: "choice",
      options: [
        { text: "🔍 Để em check lại log ngay", effect: { kpi: +5, reputation: +3 } },
        { text: "😅 Chắc do cache, chị clear đi", effect: { kpi: -3, reputation: -5, stress: +10 } }
      ]
    }
  ]
}
```

### 3.5 Interaction Zones

| Zone | Trigger | Action |
|------|---------|--------|
| Player's Desk | `[E] Vào làm việc` | `viewManager.switch("workstation")` |
| Máy cà phê | `[E] Pha cà phê` | +30 Energy, -10 Stress, -15min game-time. Max 3/day |
| Ghế sofa | `[E] Nghỉ ngơi` | +20 Energy, -15 Stress, -30min game-time |
| Scrum Board | `[E] Xem Board` | Overlay hiển thị Kanban tickets |
| Server Rack | `[E] Kiểm tra` | Dashboard server status (DevOps: thao tác; khác: chỉ xem) |

### 3.6 Time System

- Đồng hồ hiển thị góc trên phải HUD: `HH:MM`.
- Tốc độ: **1 giây thực = 1 phút in-game** (1 ngày làm việc 9h = ~9 phút thực).
- Hành động tiêu tốn thời gian: cà phê (15 phút), nghỉ ngơi (30 phút), minigame (theo ticket timeLimit).
- Lúc **18:00**: popup chọn `[🏠 Về nhà]` hoặc `[💪 OT +2h]` (OT: +KPI potential, +Stress đáng kể).
- Hiệu ứng ánh sáng canvas: sáng (9-12h), vàng ấm (12-15h), cam chiều (15-18h), tối (18-20h OT).

---

## 4. Chế Độ Workstation OS

### 4.1 Desktop OS UI

Khi chuyển sang Workstation mode, canvas bị ẩn (hoặc mờ nền), thay bằng fullscreen DOM overlay mô phỏng desktop OS:

- **Taskbar (bottom):** Icon các app, đồng hồ, thanh Energy/Stress mini.
- **Desktop area:** Click icon hoặc taskbar để mở cửa sổ app.
- **Window manager:** Mỗi cửa sổ là `<div>` absolute-positioned, hỗ trợ:
  - Drag (thanh title bar)
  - Resize (handle góc phải dưới)
  - Minimize (thu xuống taskbar)
  - Maximize (fullscreen desktop area)
  - Close (đóng cửa sổ)
  - Z-index stacking (click to focus)
- **Nút `[🔙 Rời bàn]`:** Luôn hiển thị, quay về Office mode.

### 4.2 Desktop Apps

#### SlackChat
- Giao diện sidebar channels (`#general`, `#dev`, `#incidents`, `#random`) + message area.
- NPC gửi tin nhắn tự động theo thời gian và chapter events.
- Player reply bằng chọn đáp án (2-3 options) → ảnh hưởng Reputation.
- Notification badge khi có tin mới.

#### JiraBoard
- Kanban 4 cột: `To Do` | `In Progress` | `Review` | `Done`.
- Mỗi ticket card hiển thị: ID, title, difficulty badge, role tag.
- Click ticket → xem detail (description, hint, reward/penalty info).
- Kéo ticket sang `In Progress` + bấm `[▶ Bắt đầu]` → trigger minigame tương ứng.
- Sau minigame, ticket tự chuyển sang `Review` (nếu pass) hoặc quay lại `To Do` (nếu fail).

#### Terminal
- Giao diện command-line monospace, prompt `megasoft@dev:~$`.
- Hỗ trợ tập lệnh giới hạn: `git log/status/add/commit/push/revert`, `npm run build/test`, `docker ps/logs`, `kubectl get pods/rollout`.
- Autocomplete bằng Tab.
- Output giả lập phù hợp ngữ cảnh (ví dụ: `git log` hiển thị commit history liên quan chapter).
- Lệnh sai → "command not found" hoặc hint.

#### CodeEditor
- Textarea với syntax highlighting cơ bản (regex-based: keywords, strings, comments).
- Hiển thị code snippet từ minigame hoặc file trong FileManager.
- Line numbers, highlight dòng hiện tại.

#### Browser (Fake)
- Address bar hiển thị `https://projectx.megasoft.local`.
- Render HTML giả lập (iframe sandbox hoặc rendered div) để hiển thị "output" của dự án ProjectX.
- Dùng trong minigame Frontend (xem kết quả CSS fix) và QA (tìm bug trên UI).

#### FileManager
- Cây thư mục dạng tree view của dự án ProjectX giả lập.
- Click file → mở trong CodeEditor.
- Chỉ đọc (read-only), trừ khi đang trong minigame yêu cầu sửa file.

### 4.3 Ticket System

```javascript
// Ticket metadata schema
{
  id: "TK-301",
  title: "Fix login redirect loop",
  role: "frontend",              // Hiển thị cho đúng role
  chapter: 2,                    // Xuất hiện từ chapter nào
  difficulty: "medium",          // "easy" | "medium" | "hard" | "boss"
  minigameType: "cssLayoutFix",  // Key mapping đến minigame module
  timeLimit: 180,                // Giây thực
  gameDuration: 60,              // Phút in-game tiêu tốn
  rewards: { kpi: 10, reputation: 5 },
  penalties: { kpi: -5, stress: 15 },
  description: "User bị redirect vòng lặp khi login bằng Google OAuth...",
  hint: "Kiểm tra redirect_uri trong callback handler"
}
```

---

## 5. Hệ Thống Minigame

### 5.1 Kiến trúc minigame

Mỗi minigame là một module độc lập implement interface chung:

```javascript
// Minigame interface
class BaseMinigame {
  constructor(ticket, container) {}  // Nhận ticket data + DOM container
  start() {}                        // Khởi tạo UI, bắt đầu timer
  update(deltaTime) {}              // Gọi mỗi frame (nếu cần animation)
  checkCompletion() {}              // Trả về { completed, score, maxScore }
  destroy() {}                      // Cleanup DOM, event listeners
}
```

Minigame render trong cửa sổ CodeEditor/Browser/Terminal trên Workstation OS (tùy loại).

### 5.2 Frontend Minigames (4 loại)

| ID | Tên | Render trong | Mô tả gameplay |
|----|-----|-------------|----------------|
| `cssLayoutFix` | CSS Layout Fix | CodeEditor + Browser | Trang web bị vỡ layout bên Browser; sửa CSS trong CodeEditor. Bấm `[Preview]` xem realtime. Pass khi layout khớp mockup target |
| `bugHuntUI` | Bug Hunt UI | Browser | Hai screenshot cạnh nhau: mockup vs actual. Click vào 5 điểm sai (màu, font, spacing, icon, text). Timer + limited clicks |
| `responsiveChallenge` | Responsive Challenge | Browser | Kéo thanh viewport 320→1440px. Đánh dấu breakpoint bị vỡ, chọn CSS fix đúng từ 3 đáp án cho mỗi breakpoint |
| `stateDebugger` | State Debugger | CodeEditor | Cây component với state flow. Click component re-render sai → chọn nguyên nhân (missing dep, stale closure, prop drilling) |

### 5.3 Backend Minigames (4 loại)

| ID | Tên | Render trong | Mô tả gameplay |
|----|-----|-------------|----------------|
| `apiPipeline` | API Pipeline | Browser (diagram) | Drag-and-drop node xử lý đúng thứ tự: validate → transform → query → response. Sai = 500 Error animation |
| `queryOptimizer` | Query Optimizer | CodeEditor + Terminal | SQL query chậm + EXPLAIN output. Chọn optimization đúng: INDEX, rewrite JOIN, tách subquery. Thanh tốc độ tăng |
| `deadlockResolver` | Deadlock Resolver | Browser (diagram) | Hai process lock chéo (biểu đồ vòng). Chọn strategy: release order, timeout, retry. Sai = freeze animation |
| `logDetective` | Log Detective | Terminal | Log cuộn với ERROR/WARN/INFO. Scroll tìm root cause, click đánh dấu. Red herring logs gây nhiễu |

### 5.4 QA Minigames (4 loại)

| ID | Tên | Render trong | Mô tả gameplay |
|----|-----|-------------|----------------|
| `bugSpotter` | Bug Spotter | Browser | Tương tác app giả lập, tìm 5 bug ẩn: button broken, text overflow, negative quantity, XSS display, validation fail |
| `testCaseBuilder` | Test Case Builder | CodeEditor | Kéo thả test cases vào category: Happy/Edge/Boundary/Negative. Thiếu critical case = trừ điểm |
| `regressionRoulette` | Regression Roulette | Browser (split) | Hai version app v1.2 vs v1.3 song song. Cùng thao tác, tìm behavior change không mong muốn |
| `ticketTriage` | Ticket Triage | JiraBoard | 10 bug reports mơ hồ. Phân loại severity (Critical/Major/Minor/Trivial) + assign team. Sai priority = feedback từ sếp |

### 5.5 DevOps Minigames (4 loại)

| ID | Tên | Render trong | Mô tả gameplay |
|----|-----|-------------|----------------|
| `yamlSurgeon` | YAML Surgeon | CodeEditor | File CI/CD YAML có lỗi cú pháp. Sửa: thụt lề, thiếu `:`, key trùng, tab vs space. Mỗi fix = 1 pipeline stage xanh |
| `containerTetris` | Container Tetris | Browser (dashboard) | Kéo thả container pods vào nodes. Balance CPU/RAM < 80%. Quá tải = node đỏ lửa |
| `incidentCommander` | Incident Commander | Terminal + Browser | 5 bước đúng trình tự: Acknowledge → Check logs → Identify root cause → Rollback → Post-mortem. Sai = downtime kéo dài |
| `deployPipeline` | Deploy Pipeline | Terminal | Gõ chuỗi lệnh deploy: `git tag` → `docker build` → `kubectl apply` → `health check`. Sai/skip = deploy fail |

### 5.6 Scoring System

| Hạng | Điều kiện | Reward multiplier | Bonus effect |
|------|-----------|-------------------|-------------|
| ⭐⭐⭐ Perfect | 100% đúng, < 60% time | ×1.5 | Stress -5, Slack khen |
| ⭐⭐ Good | > 70% đúng, trong time | ×1.0 | Bình thường |
| ⭐ Barely | > 40% hoặc hết time | ×0.5 | Stress +10 |
| 💀 Failed | < 40% hoặc bỏ cuộc | ×0 (full penalty) | Slack "ticket sao rồi?" |

---

## 6. Cốt Truyện 4 Chương

### 6.1 Chương 1: "Ngày Đầu Tiên" (Onboarding) — ~5 phút thực

**Mục đích:** Tutorial toàn bộ cơ chế game qua narrative tự nhiên. Không có nguy cơ fail.

**Chuỗi sự kiện:**
1. Cutscene mở đầu: nhân vật trước cửa công ty. Nhập tên + chọn Role.
2. HR Lan dẫn tour văn phòng → tutorial di chuyển WASD, `[E]` tương tác.
3. Giới thiệu từng NPC qua dialogue ngắn.
4. Ngồi vào bàn → tutorial Workstation OS: mở SlackChat (chào team), mở JiraBoard.
5. Minigame tutorial (Easy) theo role:
   - Frontend: sửa 1 lỗi CSS đơn giản
   - Backend: sắp xếp 3 bước pipeline
   - QA: tìm 2 bug rõ ràng
   - DevOps: sửa 1 lỗi YAML thụt lề
6. Kết thúc: Slack PM Hùng "Welcome aboard! Sprint đầu tiên thứ Hai nhé 💪"

### 6.2 Chương 2: "Sprint Đầu Tiên" (First Project) — ~15 phút thực

**Mục đích:** Gameplay chính bắt đầu. Balance công việc và quan hệ.

**Chuỗi sự kiện:**
1. Daily Standup (PM hỏi tiến độ → 3 lựa chọn trả lời)
2. 3-4 Ticket minigame Medium
3. Drama "Merge Conflict" (Senior Dev Minh): git revert minigame + xin lỗi Slack
4. Drama "Scope Creep" (PM thêm ticket giữa sprint): nhận / từ chối / im lặng
5. Sprint Review: Tech Lead comment dựa trên chỉ số thấp nhất

### 6.3 Chương 3: "Cháy Nhà" (Production Incident) — ~15 phút thực

**Mục đích:** Bài kiểm tra lớn nhất. Stress cao, thời gian eo hẹp.

**Chuỗi sự kiện:**
1. Đang ở Pantry → Slack `#incidents` bùng nổ: ProjectX production DOWN
2. Nhiệm vụ khác nhau theo Role:
   - Frontend: Debug network tab + tạo maintenance page
   - Backend: Log detective (Hard) tìm root cause DB
   - QA: Speed testing 8 case trong 2 phút
   - DevOps: Incident Commander 5 bước
3. Downtime Counter chạy liên tục: mỗi phút = -2 KPI
4. Drama: bug do code sprint trước (có thể của player) → thừa nhận vs đổ lỗi
5. Post-mortem meeting → feedback từ Lead dựa trên performance

### 6.4 Chương 4: "Phán Quyết" (Probation Review) — ~10 phút thực

**Mục đích:** Hồi kết. Tổng hợp mọi quyết định.

**Chuỗi sự kiện:**
1. Ngày cuối: cơ hội cứu KPI (ticket tồn), Reputation (NPC), Stress (nghỉ ngơi)
2. 1-on-1 Meeting với Tech Lead Đức — 5 câu hỏi tình huống:
   - "Em học được gì sau 2 tháng?"
   - "Nếu làm lại sprint đầu, em thay đổi gì?"
   - "Em xử lý incident hôm đó thế nào?" (đáp án tốt phụ thuộc hành động thật Chap 3)
   - "Team mình cần cải thiện gì?" (bẫy: chê đồng nghiệp = -Reputation)
   - "Mục tiêu 6 tháng tới?"
3. Tính toán kết quả → Ending.

---

## 7. Hệ Thống Endings (5 kết thúc)

| # | Tên | Điều kiện | Mô tả |
|---|-----|-----------|-------|
| 1 | 🏆 "Ngôi Sao Mới" | KPI ≥ 80, Reputation ≥ 70, Stress < 50 | Pass xuất sắc. Lên chính thức + tăng lương. Confetti + team Slack chúc mừng |
| 2 | ✅ "Đủ Điểm Đậu" | KPI ≥ 60, Reputation ≥ 50 | Pass bình thường. "Cần cải thiện nhưng anh tin em phát triển" |
| 3 | 😰 "Gia Hạn Thêm" | KPI 40-59 HOẶC Reputation 30-49 | Gia hạn thử việc 1 tháng |
| 4 | ❌ "Không Phù Hợp" | KPI < 40 HOẶC Reputation < 30 | Không pass. "Vị trí này chưa phù hợp" |
| 5 | 🔥 "Burnout" | Stress ≥ 95 bất kỳ lúc nào | Kết thúc sớm. Thông điệp work-life balance |

**Màn hình kết thúc:** "Phiếu đánh giá thử việc" với bảng chỉ số, radar chart (KPI/Reputation/Energy/Stress), nút `[🔄 Chơi lại với Role khác]`.

---

## 8. Random Events

30% xác suất trigger 1 event/ngày (ngoài chuỗi chính):

| Event | Hiệu ứng |
|-------|----------|
| 🎂 Sinh nhật đồng nghiệp | +10 Rep nếu dự (-30min), -5 Rep nếu bỏ |
| 🍕 Team đặt pizza | +15 Energy, +5 Rep (miễn phí) |
| 💻 Laptop lag | Restart, mất 20 phút game-time |
| 📧 Email phishing | Click link = -20 KPI. Báo IT = +10 KPI |
| 🏓 Bóng bàn giờ nghỉ | Mini reflex game: +10 Rep thắng, +5 thua |
| 🌧️ Mưa mất wifi | 15 phút không vào Workstation, chỉ NPC offline |
| 📢 All-hands CEO | Cutscene chọn phản ứng (hào hứng/buồn ngủ/hỏi hay) |

---

## 9. Audio

Sử dụng Web Audio API tổng hợp 8-bit realtime (không cần asset mp3):

| Âm thanh | Mô tả |
|----------|-------|
| BGM Office | Chiptune nhẹ nhàng, loop, thay đổi tempo theo chapter (Chap 3 nhanh hơn) |
| SFX Footstep | Tiếng bước pixel ngắn |
| SFX Keyboard | Tiếng gõ phím khi trong CodeEditor/Terminal |
| SFX Slack Ding | "Ting" notification |
| SFX Alert | Còi báo động (incident Chap 3) |
| SFX Success | Fanfare ngắn khi hoàn thành minigame |
| SFX Fail | Descending tone khi fail |
| SFX Coffee | Tiếng rót nước |

---

## 10. Pixel Art & Visual Style

- **Palette:** Giới hạn 32 màu (kiểu PICO-8 / NES extended), tone pastel văn phòng.
- **Character sprites:** 16×24px, 4-directional walk + idle.
- **NPC portraits:** 64×64px, 6 emotions mỗi NPC (neutral, happy, annoyed, angry, smirk, panic).
- **Tileset:** 32×32px tiles cho sàn, tường, bàn ghế, máy tính, cây cối, server rack.
- **Workstation OS:** Flat design clean với accent color xanh dương (MegaSoft brand), dark mode terminal.
- **Tất cả pixel art được tạo procedurally bằng Canvas 2D draw functions** trong phiên bản v1, tránh phụ thuộc asset ngoài. Có thể nâng cấp lên sprite sheet PNG sau.

---

## 11. Responsive & Accessibility

- **Responsive:** Canvas scale theo viewport giữ tỷ lệ. Workstation OS responsive qua Tailwind breakpoints. Tối thiểu hỗ trợ 1024×768.
- **Mobile:** Hiển thị thông báo "Trải nghiệm tốt nhất trên máy tính" + virtual D-pad nếu muốn chơi mobile (stretch goal).
- **Keyboard-only:** Toàn bộ game chơi được bằng bàn phím (WASD + E + Enter + Escape + Tab).

---

## 12. LLM Dynamic Story Generation

### 12.1 Hai chế độ hoạt động

- **Offline Mode (mặc định):** Dialogue/event tĩnh viết sẵn. Chơi ngay, không cần API key.
- **LLM Mode (cấu hình):** Player nhập API key (Gemini / OpenAI / custom) → LLM sinh dialogue NPC, Slack messages, ticket descriptions, random events, câu hỏi phỏng vấn Chap 4 mới mỗi lần chơi.

### 12.2 Phạm vi sinh nội dung

| Thành phần | LLM sinh? | Lý do |
|------------|-----------|-------|
| Dialogue NPC | ✅ | Mỗi lần chơi khác, tính cách nhất quán nhờ persona prompt |
| Slack messages | ✅ | Tin nhắn tự nhiên, đa dạng, context-aware |
| Ticket description & hint | ✅ | Mô tả bug/task mới mỗi lần |
| Random Events kịch bản | ✅ | Sự kiện bất ngờ ngoài bộ cố định |
| Câu hỏi phỏng vấn Chap 4 | ✅ | Hỏi dựa trên hành trình thực tế player |
| Cấu trúc Chapter | ❌ | Giữ cố định đảm bảo progression |
| Minigame logic (code/SQL/YAML) | ❌ | Cần đáp án chính xác |
| Scoring / stat effects | ❌ | Cân bằng game cố định |

### 12.3 Kiến trúc

```
src/
├── core/
│   └── llmProvider.js        # API adapter (Gemini/OpenAI/custom)
├── story/
│   └── dynamicDialogue.js    # Wrapper: LLM có sẵn → sinh; không → fallback static
```

**LLM chỉ sinh TEXT, không sinh LOGIC.** Mỗi choice LLM trả về có `type` field (e.g. `"responsible"`, `"deflect_blame"`) được map sang bảng effect cố định:

```javascript
const CHOICE_EFFECT_TEMPLATES = {
  "responsible":    { kpi: +5, reputation: +3 },
  "deflect_blame":  { kpi: -3, reputation: -5, stress: +10 },
  "neutral":        { kpi: +2, reputation: 0 },
  "honest_help":    { kpi: 0, reputation: +5, stress: +5 },
};
```

### 12.4 NPC Persona System

Mỗi NPC có system prompt mô tả tính cách, giọng nói, thói quen. LLM nhận persona + game state context (chapter, role, stats, previous choices) để sinh dialogue phù hợp.

### 12.5 Fallback & Resilience

- API fail/timeout (5s) → tự động dùng dialogue tĩnh, player không bị stuck.
- Cache theo session: `sessionStorage` key `{npcId}_{chapter}_{contextHash}`.
- Batch pre-generate đầu mỗi chapter (1 API call lớn).
- Token budget: max ~300 tokens/response.

### 12.6 Settings UI

Menu Settings cho phép:
- Toggle Offline/LLM mode
- Chọn provider (Gemini / OpenAI / Custom endpoint)
- Nhập API key (lưu localStorage, không gửi đi đâu)
- Nút [Test] kiểm tra kết nối

---

## 13. Scope & Constraints

- **Phiên bản 1 (MVP):** Đầy đủ 4 chương, 4 roles, mỗi role 2 minigame (8 minigame tổng thay vì 16). Minigame còn lại là stretch goal.
- **Không backend server:** Hoàn toàn client-side, mở trực tiếp index.html hoặc qua bất kỳ static server nào.
- **Không multiplayer.**
- **Thời gian chơi mỗi lượt:** ~45 phút (4 chương). Replay value từ 4 roles × 5 endings = 20 kịch bản.
