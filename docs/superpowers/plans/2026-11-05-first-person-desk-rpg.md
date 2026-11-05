# First-Person Desk Simulator & Plot Twist Technical Tasks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Chuyển đổi toàn diện giao diện sang mô phỏng Bàn làm việc góc nhìn thứ nhất (First-Person Desk Simulator), bổ sung hệ thống Hướng dẫn (Guide bar, Hover Tooltips, Day 1 Walkthrough, Help Modal), và mở rộng 16+ nhiệm vụ chuyên môn kèm cơ chế Plot Twist giữa giờ.

**Architecture:** 
- Thay thế canvas 2D top-down bằng `DeskView`: khung bàn làm việc trực diện gồm Màn hình máy tính CyberWork OS có thể Zoom In/Out (`Space`), các đồ vật tương tác vật lý (Cốc cà phê, Điện thoại bàn chuông reo, Vịt cao su xả stress, Giấy note vàng).
- Hệ thống `NPCDeskManager`: NPC xuất hiện trực diện trước bàn làm việc với biểu cảm và thoại tương tác thực tế.
- Hệ thống `LocationManager`: Chuyển đổi nhanh giữa Bàn làm việc (Desk), Quầy Pantry (hóng drama) và Phòng họp (Meeting).
- Hệ thống `GuideSystem`: Thanh phím tắt nhanh cố định, tooltip giải thích khi hover, hướng dẫn ngày 1, và pop-up cẩm nang `[?]`.
- Hệ thống `PlotTwistEngine`: Kích hoạt biến cố bất ngờ giữa chừng khi đang giải minigame kỹ thuật.
- Mở rộng kho nhiệm vụ (16 tickets) và nội dung chi tiết cho cả 4 vai trò (Frontend, Backend, QA, DevOps).

**Tech Stack:** Vanilla ES6+ Modules, HTML5 Canvas/DOM, Tailwind CSS, Web Audio API (Synthesizer), Node native test runner (`node --test`).

**Spec:** `docs/superpowers/specs/2026-11-05-first-person-desk-spec.md`

## Global Constraints
- Pure Client-Side Static SPA: Zero heavy build steps (Webpack/Vite), 100% tương thích deploy Vercel tĩnh.
- Test Coverage: Mọi logic nghiệp vụ mới đều phải có unit test tự động bằng `node --test` và pass 100%.
- Accessibility & UX: Mọi nút bấm và vật phẩm đều có phím tắt (`[Space]`, `[1]`, `[2]`, `[3]`, `[P]`, `[M]`, `[?]`) và hover tooltip.
- Giữ nguyên tính năng lưu/tải trạng thái qua `GameState` và tích hợp LLM động sẵn có.

## Review Focus
1. Phím `Space` hoặc click màn hình phải toggle mượt mà giữa chế độ bàn làm việc (Desk View) và chế độ phóng to toàn màn hình (Zoom Focus View) mà không làm mất trạng thái cửa sổ đang mở.
2. Cốc cà phê chỉ được uống tối đa 3 lần/ngày, giảm số lần và reset về 3 khi sang ngày mới (`time:new-day`).
3. Chuông điện thoại bàn chỉ rung khi có cuộc gọi/plot twist đang chờ, click nghe máy sẽ dừng chuông và mở nội dung plot twist.
4. Plot twist giữa chừng không làm crash minigame mà cập nhật thêm yêu cầu hoặc trừ thời gian theo đúng kịch bản.
5. Thanh Guide bar và Tooltip hiển thị chính xác trên mọi kích thước màn hình mà không che khuất khu vực làm việc.

---

### Task 1: Hệ Thống Hướng Dẫn & Trợ Giúp (Guide System, Hover Tooltips & Help Modal)

**Files:**
- Create: `src/ui/guideSystem.js`
- Create: `src/ui/guideModal.js`
- Test: `tests/guideSystem.test.js`

- [ ] **Step 1:** Viết test `tests/guideSystem.test.js` kiểm tra GuideSystem đăng ký các phím tắt (`Space`, `1`, `2`, `3`, `p`, `m`, `?`), sinh tooltip content cho các vật phẩm, và hiển thị/ẩn Help Modal.
- [ ] **Step 2:** Chạy `npm test` để xác nhận test thất bại (Red).
- [ ] **Step 3:** Triển khai `src/ui/guideSystem.js` render thanh điều khiển nhanh dưới chân màn hình và quản lý tooltip khi hover.
- [ ] **Step 4:** Triển khai `src/ui/guideModal.js` hiển thị cẩm nang sinh tồn thử việc (chỉ số KPI/Stress/Energy/Rep, giờ giấc làm việc, cảnh báo Burnout, danh sách phím tắt).
- [ ] **Step 5:** Chạy `npm test` để xác nhận test pass (Green).
- [ ] **Step 6:** Commit Task 1: `git add -A ; git commit -m "feat(guide): add quick controls guide bar, hover tooltips engine, and survival handbook modal"`.

---

### Task 2: Giao Diện Bàn Làm Việc Góc Nhìn Thứ Nhất (DeskView & Interactive Items)

**Files:**
- Create: `src/office/deskView.js`
- Modify: `css/styles.css`
- Test: `tests/deskView.test.js`

- [ ] **Step 1:** Viết test `tests/deskView.test.js` kiểm tra trạng thái tương tác của bàn làm việc: uống cà phê (hồi energy, tăng coffeeCount, giảm stress), bóp vịt cao su (giảm stress), chuông điện thoại reo & nhấc máy, và toggle zoom màn hình PC.
- [ ] **Step 2:** Chạy `npm test` để xác nhận test thất bại (Red).
- [ ] **Step 3:** Triển khai `src/office/deskView.js` tạo cấu trúc DOM góc nhìn thứ nhất: nền văn phòng MegaSoft, bàn làm việc, màn hình CyberWork OS, cốc cà phê, điện thoại, vịt cao su, giấy note dán viền, bàn phím cơ.
- [ ] **Step 4:** Cập nhật `css/styles.css` thêm hiệu ứng zoom-in monitor, rung lắc điện thoại bàn khi có chuông (`@keyframes phoneRing`), và khói cà phê bốc lên.
- [ ] **Step 5:** Chạy `npm test` để xác nhận test pass (Green).
- [ ] **Step 6:** Commit Task 2: `git add -A ; git commit -m "feat(desk): implement first-person desk view with interactive coffee, phone, duck, and monitor zoom"`.

---

### Task 3: Chuyển Đổi Địa Điểm & NPC Trực Diện (LocationManager & NPCDeskManager)

**Files:**
- Create: `src/office/locationManager.js`
- Create: `src/office/npcDeskManager.js`
- Test: `tests/locationManager.test.js`

- [ ] **Step 1:** Viết test `tests/locationManager.test.js` kiểm tra chuyển đổi qua lại giữa 3 địa điểm: `desk` (bàn làm việc), `pantry` (quầy cafe buôn chuyện), `meeting` (phòng họp Scrum); và kiểm tra spawn NPC trước bàn làm việc kèm biểu cảm.
- [ ] **Step 2:** Chạy `npm test` để xác nhận test thất bại (Red).
- [ ] **Step 3:** Triển khai `src/office/locationManager.js` quản lý chế độ hiển thị 3 bối cảnh văn phòng (Desk, Pantry, Meeting Room).
- [ ] **Step 4:** Triển khai `src/office/npcDeskManager.js` quản lý sự xuất hiện trực diện của NPC trước bàn làm việc (Sếp Tuấn Anh, PM Linh, Senior Dũng, Tester Lan, DevOps Hùng) với các biểu cảm (normal, thinking, angry, panic, happy).
- [ ] **Step 5:** Chạy `npm test` để xác nhận test pass (Green).
- [ ] **Step 6:** Commit Task 3: `git add -A ; git commit -m "feat(locations): implement location manager (pantry, meeting) and face-to-face desk NPC system"`.

---

### Task 4: Nâng Cấp Kho Nhiệm Vụ (16+ Tickets) & Nội Dung Minigame Thực Tế

**Files:**
- Modify: `src/data/tickets.js`
- Modify: `src/data/minigameContent/frontend.js`
- Modify: `src/data/minigameContent/backend.js`
- Modify: `src/data/minigameContent/qa.js`
- Modify: `src/data/minigameContent/devops.js`
- Test: `tests/ticketSystem.test.js`

- [ ] **Step 1:** Cập nhật test `tests/ticketSystem.test.js` kiểm tra bộ lọc vé chứa đủ 16 tickets (4 tickets/role qua cả 4 Chapters).
- [ ] **Step 2:** Mở rộng `src/data/tickets.js` lên 16 tickets với mô tả hài hước, bối cảnh thực tế (khủng hoảng Black Friday, nợ kỹ thuật 5 năm tuổi, audit bảo mật, refactor code).
- [ ] **Step 3:** Bổ sung nội dung đa kịch bản cho `frontend.js`, `backend.js`, `qa.js`, `devops.js`.
- [ ] **Step 4:** Chạy `npm test` để xác nhận test pass (Green).
- [ ] **Step 5:** Commit Task 4: `git add -A ; git commit -m "feat(tickets): expand to 16 full-chapter tickets and rich technical minigame scenarios"`.

---

### Task 5: Động Cơ Plot Twist Giữa Nhiệm Vụ & Tech Insights (PlotTwistEngine)

**Files:**
- Create: `src/minigames/plotTwistEngine.js`
- Modify: `src/minigames/minigameManager.js`
- Test: `tests/plotTwist.test.js`

- [ ] **Step 1:** Viết test `tests/plotTwist.test.js` kiểm tra PlotTwistEngine kích hoạt sự cố giữa minigame (thêm requirement, Dev cãi "works on my machine", thiếu chữ ký webhook, K8s CrashLoopBackOff) và trả về bài học kỹ thuật (Tech Tips) sau khi hoàn thành.
- [ ] **Step 2:** Chạy `npm test` để xác nhận test thất bại (Red).
- [ ] **Step 3:** Triển khai `src/minigames/plotTwistEngine.js` chứa danh mục các tình huống biến cố thực tế và hàm kích hoạt ngẫu nhiên theo vai trò.
- [ ] **Step 4:** Tích hợp `PlotTwistEngine` vào `MinigameManager` và bổ sung hộp thoại Tech Insights chia sẻ bài học nghề nghiệp sau mỗi ticket.
- [ ] **Step 5:** Chạy `npm test` để xác nhận test pass (Green).
- [ ] **Step 6:** Commit Task 5: `git add -A ; git commit -m "feat(plottwist): implement mid-task plot twist engine and post-ticket real-world tech insights"`.

---

### Task 6: Bổ Sung Âm Thanh Chân Thực & Tích Hợp Toàn Bộ Giao Diện (Audio SFX & Integration)

**Files:**
- Modify: `src/audio/soundEngine.js`
- Modify: `index.html`
- Modify: `src/main.js`
- Test: `tests/soundEngine.test.js`

- [ ] **Step 1:** Bổ sung vào `src/audio/soundEngine.js` các hiệu ứng âm thanh tổng hợp: tiếng điện thoại bàn reo `playPhoneRing()`, tiếng húp cà phê `playSip()`, tiếng vịt kêu `playDuckSqueak()`, tiếng gõ phím cơ `playKeyClick()`. Cập nhật `tests/soundEngine.test.js`.
- [ ] **Step 2:** Cập nhật `index.html` tích hợp khung Desk View thay cho canvas top-down cũ, gắn thanh Guide Bar và modal hướng dẫn.
- [ ] **Step 3:** Cập nhật `src/main.js` khởi tạo `globalDeskView`, `globalGuideSystem`, `globalLocationManager`, `globalNPCDeskManager`, kích hoạt hướng dẫn Ngày 1 (Day 1 Walkthrough).
- [ ] **Step 4:** Chạy toàn bộ test suite `npm test` (xác nhận tất cả test đều GREEN).
- [ ] **Step 5:** Commit Task 6: `git add -A ; git commit -m "feat(integration): integrate first-person desk simulator, sound effects, guide bar, and Day 1 onboarding"`.

---

### Task 7: Kiểm Thử Toàn Diện, Cập Nhật README & Đẩy Lên GitHub

**Files:**
- Modify: `README.md`
- Test: Chạy toàn bộ kiểm thử tự động `npm test`

- [ ] **Step 1:** Cập nhật `README.md` với tài liệu chi tiết về góc nhìn thứ nhất, danh mục phím tắt, cẩm nang hướng dẫn, và cơ chế Plot Twist.
- [ ] **Step 2:** Chạy kiểm thử tự động `npm test`.
- [ ] **Step 3:** Commit Task 7: `git add -A ; git commit -m "docs: update README with first-person desk gameplay, controls, and plot twists"`.
- [ ] **Step 4:** Đẩy mã nguồn lên repository: `git push origin main`.
