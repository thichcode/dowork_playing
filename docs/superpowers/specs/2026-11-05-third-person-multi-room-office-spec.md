# Đặc Tả Thiết Kế: Góc Nhìn Thứ 3 — Văn Phòng Đa Phòng & Điều Khiển Avatar (Third-Person Multi-Room Walking RPG)

> **Phiên bản:** 3.0  
> **Dự án:** MegaSoft Corp: 60 Ngày Thử Việc — IT Probation RPG  
> **Mục tiêu:** Tích hợp Góc nhìn thứ 3 (Third-Person Perspective), điều khiển Avatar nhân vật tự do đi bộ khám phá giữa 4 căn phòng thông qua hành lang (Phòng Kỹ Thuật IT, Quầy Pantry, Phòng Họp Kính, Phòng Server), tương tác vật lý bằng phím `[E]` và chuyển đổi mượt mà vào máy tính làm việc CyberWork OS.

---

## 1. Bản Đồ Văn Phòng Đa Phòng (Multi-Room Office Layout)

Bản đồ được mở rộng thành một tổ hợp văn phòng công nghệ quy mô 32 x 20 ô gạch (tiles), bao gồm 4 phân khu chính kết nối bởi Hành Lang Trung Tâm:

```
+-------------------------------------------------------------------------------+
|                                HÀNH LANG PHÍA BẮC                             |
|  +--------------------------+   Cửa   +------------------------------------+  |
|  |     PHÒNG SERVER 🖥️      |═══╤═════|           QUẦY PANTRY ☕            |  |
|  |  - Tủ rack máy chủ LED   |   │     |  - Máy pha cà phê thơm lừng        |  |
|  |  - Máy lạnh công nghiệp  |   │     |  - Tủ lạnh & bàn ăn nhẹ snack      |  |
|  |  - Cảnh báo Black Friday |   │     |  - Ghế sofa nghỉ ngơi              |  |
|  |  - Cửa từ an ninh        |   │     |  - HR Lan & QA Trang buôn chuyện   |  |
|  +--------------------------+   │     +------------------------------------+  |
|                                 │                                             |
|                             HÀNH LANG                                         |
|                             TRUNG TÂM                                         |
|                                 │                                             |
|  +--------------------------+   │     +------------------------------------+  |
|  |      PHÒNG HỌP 📊        |═══╧═════|        PHÒNG LÀM VIỆC IT 💻        |  |
|  |  - Bàn họp kính oval dài |         |  - Bàn làm việc của Người Chơi [E] |  |
|  |  - Máy chiếu Projector   |   Cửa   |  - Dãy bàn Frontend, Backend       |  |
|  |  - Bảng trắng sơ đồ      |         |  - Senior Minh & PM Hùng làm việc  |  |
|  |  - Sếp Tuấn Anh họp 1-on-1|        |  - Cửa kính nhìn ra thành phố      |  |
|  +--------------------------+         +------------------------------------+  |
+-------------------------------------------------------------------------------+
```

### 1.1 Chi Tiết Các Căn Phòng:
1. **Phòng Làm Việc IT (IT Department)**:
   - Dãy bàn lập trình viên với 2 màn hình, case máy tính đèn RGB.
   - Bàn làm việc riêng của người chơi có bảng tên *"Tân Binh"* phát sáng hiệu ứng pulse. Bước đến gần và bấm `[E]` để ngồi vào bàn làm việc, mở máy tính **CyberWork OS**.
   - Các đồng nghiệp Senior Minh, PM Hùng ngồi làm việc tại bàn của họ.
2. **Quầy Pantry (Pantry & Lounge)**:
   - Máy pha cà phê tự động: Bấm `[E]` để rót cà phê, hồi `+15 Energy`, `-5 Stress` (tối đa 3 cốc/ngày).
   - Tủ lạnh và bàn snack bánh ngọt: Bấm `[E]` để ăn nhẹ.
   - Ghế sofa êm ái thư giãn: Bấm `[E]` để ngồi nghỉ giảm stress.
   - Đồng nghiệp HR Lan và QA Trang đứng buôn chuyện công sở.
3. **Phòng Họp Kính (Meeting Room Alpha)**:
   - Bàn họp chữ nhật lớn với ghế xoay, máy chiếu và bảng trắng vẽ kiến trúc hệ thống.
   - Bước tới ghế quanh bàn bấm `[E]` để tham gia Daily Scrum báo cáo tiến độ (`+5 KPI`, `+3 Rep`) hoặc bảo vệ thử việc 1-on-1 với Sếp Tuấn Anh.
4. **Phòng Máy Chủ (Server Room / Datacenter)**:
   - Các dãy tủ rack máy chủ nhấp nháy đèn xanh đỏ, sàn nâng chống tĩnh điện.
   - Khi có sự cố Black Friday hoặc sập server thanh toán, còi báo động trong phòng server sẽ hú vang, yêu cầu người chơi chạy vào phòng server bấm `[E]` để cắm cáp / rollback!

---

## 2. Cơ Chế Điều Khiển Avatar & Camera (Avatar Controller)

- **Điều khiển di chuyển**:
  - Dùng các phím `W`, `A`, `S`, `D` hoặc các phím mũi tên `↑`, `↓`, `←`, `→`.
  - Hỗ trợ di chuyển mượt mà đa hướng với tốc độ 120 pixels/giây.
- **Hoạt ảnh bước đi (Walking Animation)**:
  - Sprite nhân vật có 4 hướng nhìn (Lên, Xuống, Trái, Phải) với chu kỳ bước chân 2 frame sinh động.
  - Ba lô sau lưng và thẻ nhân viên MegaSoft đeo cổ lay nhẹ theo bước chân.
- **Hệ thống va chạm (Collision Detection)**:
  - Tường ngăn cách giữa các phòng, cửa sổ kính, bàn ghế và tủ máy chủ đều có hộp va chạm (bounding box) chuẩn xác; nhân vật đi xuyên qua cửa ra vào thông thoáng.
- **Camera theo sát (Smooth Camera Follow)**:
  - Camera tự động căn giữa vào vị trí Avatar của người chơi, di chuyển mượt mà và kẹp biên (clamping) không để lộ khoảng trống ngoài bản đồ.

---

## 3. Hệ Thống Tương Tác Trực Quan Bằng Phím `[E]` (Contextual Prompt)

Khi Avatar bước vào phạm vi 1.5 tile của bất kỳ đối tượng tương tác nào, một bong bóng gợi ý sẽ lập tức xuất hiện ngay trên đầu nhân vật:
- Gần bàn làm việc cá nhân: `Nhấn [E] để Ngồi vào bàn làm việc 💻`
- Gần máy pha cà phê: `Nhấn [E] để Rót cà phê Pantry ☕`
- Gần ghế Sofa: `Nhấn [E] để Ngồi nghỉ xả stress 🛋️`
- Gần bàn họp Scrum: `Nhấn [E] để Tham gia họp Daily Scrum 📊`
- Gần tủ rack Server: `Nhấn [E] để Kiểm tra máy chủ Datacenter 🖥️`
- Gần đồng nghiệp (NPC): `Nhấn [E] để Trò chuyện với [Tên NPC] 💬`

---

## 4. Chuyển Đổi Mượt Mà Giữa Đi Bộ (Walking) & Làm Việc (Workstation)

- **Từ Đi Bộ → Bàn Làm Việc**:
  - Người chơi đi đến bàn của mình và nhấn `[E]`.
  - Camera zoom chuyển đổi mượt mà vào giao diện **CyberWork OS** (hoặc Desk View) để làm ticket Jira, gõ Terminal, làm Minigames.
- **Từ Bàn Làm Việc → Tiếp Tục Đi Bộ**:
  - Khi hoàn thành ticket hoặc muốn giải lao, người chơi nhấn nút **"Rời Bàn Làm Việc" [Esc]** trên thanh taskbar.
  - Giao diện máy tính trượt ẩn, nhân vật đứng dậy và người chơi lập tức trở lại quyền điều khiển Avatar đi bộ ra Pantry hoặc phòng họp.

---

## 5. Cập Nhật HUD & Thanh Hướng Dẫn (HUD & Guide Bar)

- **HUD Phía Trên**:
  - Bổ sung huy hiệu vị trí phòng hiện tại: `📍 Phòng Kỹ Thuật IT` / `📍 Quầy Pantry` / `📍 Phòng Họp Alpha` / `📍 Phòng Server Datacenter`.
  - Các thanh chỉ số: Energy ⚡, Stress 🔥, KPI 🎯, Reputation 🤝, Đồng hồ giờ làm việc & Ngày thử việc.
- **Thanh Guide Bar Phía Dưới**:
  - Hiển thị danh mục phím tắt trực quan:
    `[WASD / Mũi Tên] Đi Bộ Khám Phá` • `[E] Tương Tác Vật Thể` • `[Space] Vào Máy Tính` • `[Esc] Rời Bàn / Đóng` • `[?] Cẩm Nang`.
- **Hộp thoại NPC Mặt-đối-mặt**:
  - Khi nhấn `[E]` cạnh NPC nào, khung thoại xuất hiện với avatar NPC, lời thoại phong phú và các lựa chọn ứng xử đạo đức công sở (có tích hợp AI LLM).
