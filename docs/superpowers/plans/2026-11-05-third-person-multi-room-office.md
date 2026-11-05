# Third-Person Multi-Room Walking RPG Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mở rộng trải nghiệm thành game nhập vai góc nhìn thứ 3 (Third-Person Walking RPG) với bản đồ văn phòng 4 phòng kết nối bởi hành lang (Phòng Kỹ Thuật IT, Quầy Pantry, Phòng Họp Kính, Phòng Server), điều khiển Avatar đi bộ mượt mà, tương tác vật lý phím `[E]` và chuyển đổi vào máy tính làm việc CyberWork OS.

**Architecture:**
- Mở rộng `assets/maps/office.json` thành bản đồ 32x20 tiles đa phòng với 4 phân khu và hành lang trung tâm.
- Tạo `src/office/roomTracker.js` theo dõi vị trí phòng hiện tại của Avatar và cập nhật huy hiệu HUD.
- Nâng cấp `src/office/spriteGenerator.js` và `src/office/officeRenderer.js` vẽ các nội thất đặc thù (tủ rack server nhấp nháy đèn, bàn họp oval, máy pha cafe, tủ lạnh, thảm trải sàn).
- Đặt NPC tự nhiên tại các phòng (Senior Minh ở phòng IT, HR Lan & QA Trang ở Pantry, Sếp Tuấn Anh ở phòng Họp).
- Tích hợp bong bóng tương tác `[E]` nổi trên đầu nhân vật, chuyển đổi mượt mà vào máy tính CyberWork OS khi ngồi vào bàn, và đứng dậy đi lại khi bấm "Rời Bàn".

**Tech Stack:** Vanilla ES6+ Modules, HTML5 Canvas 2D, Tailwind CSS, Node.js Native Test Runner (`node --test`).

**Spec:** `docs/superpowers/specs/2026-11-05-third-person-multi-room-office-spec.md`

## Global Constraints
- Zero heavy bundlers: chạy trực tiếp ES6 modules trên trình duyệt, tương thích static deploy Vercel.
- 100% test coverage: tất cả logic nghiệp vụ mới đều có unit test tự động bằng `node --test` và pass 100%.
- Giữ nguyên các minigames, ticket system, âm thanh Web Audio và LLM dynamic dialogue đã hoàn thiện.

## Review Focus
1. Va chạm (Collision): Người chơi không thể đi xuyên tường ngăn giữa các phòng nhưng đi xuyên qua các ô cửa ra vào thông thoáng.
2. Room Tracker xác định chính xác tên phòng dựa trên tọa độ `(tileX, tileY)` của người chơi và cập nhật huy hiệu HUD.
3. Khi đứng cạnh bàn làm việc của người chơi và bấm `[E]`, view chuyển sang CyberWork OS; khi bấm "Rời Bàn Làm Việc" (`Esc`), quay lại điều khiển Avatar ngay tại vị trí bàn.
4. Tương tác máy pha cà phê ở Pantry và bàn họp Scrum ở Phòng Họp hoạt động chuẩn xác qua phím `[E]` với âm thanh phản hồi.
5. Camera Canvas 2D theo sát Avatar mượt mà và kẹp biên chuẩn xác không bị tràn ra ngoài kích thước bản đồ 32x20.

---

### Task 1: Thiết Kế Bản Đồ Văn Phòng Đa Phòng & Hệ Thống Theo Dõi Phòng (Multi-Room Map & RoomTracker)

**Files:**
- Create: `src/office/roomTracker.js`
- Modify: `assets/maps/office.json`
- Test: `tests/roomTracker.test.js`

- [ ] **Step 1:** Viết test `tests/roomTracker.test.js` kiểm tra `RoomTracker` xác định đúng 4 phòng (`it_room`, `pantry`, `meeting`, `server`, `hallway`) theo tọa độ tile và phát sự kiện `room:changed`.
- [ ] **Step 2:** Chạy `npm test` để xác nhận test thất bại (Red).
- [ ] **Step 3:** Triển khai `src/office/roomTracker.js` chứa danh mục bounding box của 4 phòng và hàm `getRoomAt(tileX, tileY)`.
- [ ] **Step 4:** Cập nhật `assets/maps/office.json` mở rộng kích thước lên 32x20 tiles với ma trận tường, cửa ra vào và các vùng tương tác (zones: desk, coffee, fridge, sofa, meeting, server).
- [ ] **Step 5:** Chạy `npm test` để xác nhận test pass (Green).
- [ ] **Step 6:** Commit Task 1: `git add -A ; git commit -m "feat(map): implement 32x20 multi-room office layout and RoomTracker system"`.

---

### Task 2: Nâng Cấp Đồ Họa Nội Thất & Đa Phòng (OfficeRenderer & SpriteGenerator)

**Files:**
- Modify: `src/office/spriteGenerator.js`
- Modify: `src/office/officeRenderer.js`
- Test: `tests/officeRenderer.test.js`

- [ ] **Step 1:** Viết test `tests/officeRenderer.test.js` kiểm tra camera theo sát vị trí Avatar và kẹp biên bản đồ (clamping) trong phạm vi kích thước 32x20.
- [ ] **Step 2:** Chạy `npm test` để xác nhận test thất bại (Red).
- [ ] **Step 3:** Nâng cấp `src/office/spriteGenerator.js` vẽ các sprite nội thất mới: tủ rack server (server rack) đèn LED nhấp nháy, bàn họp kính oval kèm ghế xoay, tủ lạnh pantry, máy pha cà phê, và bảng tên bàn người chơi.
- [ ] **Step 4:** Nâng cấp `src/office/officeRenderer.js` hỗ trợ vẽ nền gạch riêng cho từng phòng (gỗ phòng IT, caro quầy pantry, thảm xanh phòng họp, grid kỹ thuật phòng server) và vẽ bong bóng tương tác trên đầu nhân vật.
- [ ] **Step 5:** Chạy `npm test` để xác nhận test pass (Green).
- [ ] **Step 6:** Commit Task 2: `git add -A ; git commit -m "feat(render): enhance multi-room procedural sprites, room flooring, and camera follow"`.

---

### Task 3: Phân Bổ NPC Tự Nhiên & Bong Bóng Gợi Ý Tương Tác Phím `[E]`

**Files:**
- Modify: `src/data/npcs.js`
- Modify: `src/office/npcManager.js`
- Modify: `src/office/interactionZones.js`
- Test: `tests/interactionZones.test.js`

- [ ] **Step 1:** Cập nhật test `tests/interactionZones.test.js` kiểm tra các vùng tương tác mới: máy pha cafe pantry, tủ lạnh, bàn họp scrum, tủ server.
- [ ] **Step 2:** Cập nhật `src/data/npcs.js` phân bổ tọa độ các NPC vào đúng phòng: Senior Minh ở bàn phòng IT, HR Lan và QA Trang ở Pantry, PM Hùng ở phòng họp/hành lang.
- [ ] **Step 3:** Cập nhật `src/office/npcManager.js` và `src/office/interactionZones.js` trả về thông điệp gợi ý ngữ cảnh chính xác cho bong bóng `[E]`.
- [ ] **Step 4:** Chạy `npm test` để xác nhận test pass (Green).
- [ ] **Step 5:** Commit Task 3: `git add -A ; git commit -m "feat(zones): distribute NPCs across rooms and contextual [E] interaction prompts"`.

---

### Task 4: Chuyển Đổi Mượt Mà Đi Bộ ⇄ Bàn Làm Việc & Tích Hợp Toàn Bộ Giao Diện

**Files:**
- Modify: `index.html`
- Modify: `src/main.js`
- Modify: `src/ui/hud.js`
- Test: Chạy toàn bộ test suite `npm test`

- [ ] **Step 1:** Cập nhật `index.html` hiển thị Canvas văn phòng 2D làm chế độ xem chính khi đi bộ, bổ sung huy hiệu phòng trên thanh HUD (`#hud-room-badge`).
- [ ] **Step 2:** Cập nhật `src/ui/hud.js` cập nhật huy hiệu tên phòng mỗi khi nhận sự kiện `room:changed`.
- [ ] **Step 3:** Cập nhật `src/main.js` kết nối luồng: khi Avatar bước tới bàn cá nhân và bấm `[E]` → mở màn hình CyberWork OS làm việc; khi bấm "Rời Bàn" [Esc] → Avatar đứng dậy và trở lại điều khiển đi bộ tự do trong văn phòng.
- [ ] **Step 4:** Cập nhật thanh Guide Bar dưới chân màn hình: `[WASD / Mũi Tên] Đi Bộ Khám Phá` • `[E] Tương Tác` • `[Esc] Rời Bàn / Thoát` • `[?] Cẩm Nang`.
- [ ] **Step 5:** Chạy toàn bộ test suite `npm test` (xác nhận tất cả test đều GREEN).
- [ ] **Step 6:** Commit Task 4: `git add -A ; git commit -m "feat(integration): integrate third-person walking RPG with seamless desk workstation flow"`.

---

### Task 5: Kiểm Thử Toàn Diện, Cập Nhật README & Đẩy Lên GitHub (`git push`)

**Files:**
- Modify: `README.md`
- Test: Chạy toàn bộ kiểm thử tự động `npm test`

- [ ] **Step 1:** Cập nhật `README.md` với mô tả về bản đồ văn phòng 4 phòng, điều khiển Avatar đi bộ, và cơ chế chuyển đổi làm việc.
- [ ] **Step 2:** Chạy kiểm thử tự động `npm test`.
- [ ] **Step 3:** Commit Task 5: `git add -A ; git commit -m "docs: update README with third-person multi-room office RPG details"`.
- [ ] **Step 4:** Đẩy mã nguồn lên repository: `git push origin main`.
