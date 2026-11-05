# Đặc Tả Thiết Kế: Giao Diện Góc Nhìn Thứ Nhất (First-Person Desk Simulator) & Nội Dung Kỹ Thuật Kịch Tính

> **Phiên bản:** 2.0  
> **Dự án:** MegaSoft Corp: 60 Ngày Thử Việc — IT Probation RPG  
> **Mục tiêu:** Chuyển đổi từ góc nhìn 2D Top-down sang Góc nhìn thứ nhất tại Bàn làm việc (First-Person Desk Simulator), bổ sung hệ thống Hướng dẫn (Guide / Tooltips) trực quan và nâng cấp kho nhiệm vụ chuyên môn với các tình huống Plot Twist kịch tính.

---

## 1. Kiến Trúc Giao Diện Góc Nhìn Thứ Nhất (First-Person Desk View)

### 1.1 Bố Cục Màn Hình Chính (Desk Perspective)
Người chơi đóng vai lập trình viên thử việc đang ngồi trực diện trước bàn làm việc:
- **Phía trước (Background View)**:
  - Khung cảnh văn phòng MegaSoft hiện đại với đèn LED trần, vách ngăn văn phòng, các bàn làm việc của đồng nghiệp xung quanh.
  - Cửa sổ lớn nhìn ra toàn cảnh thành phố với hiệu ứng ánh sáng thay đổi theo giờ làm việc (09:00 sáng tươi sáng, 17:00 chiều hoàng hôn, 20:00 tối tăng ca đèn neon).
- **Khu vực Xuất hiện của NPC (Face-to-Face Interaction Layer)**:
  - Khi có đối thoại hoặc sự kiện, NPC (Sếp Tuấn Anh, PM Linh, Senior Dũng, QA Lan, DevOps Hùng) sẽ xuất hiện đứng trước bàn làm việc với avatar nửa người/toàn thân sắc nét và biểu cảm phong phú (nghiêm nghị, cười cợt, lo âu, hốt hoảng khi server sập).
  - Khung thoại tích hợp ngay tại bàn đối diện tầm mắt người chơi.
- **Bàn Làm Việc Vật Lý (Interactive Desk)**:
  1. **Màn hình máy tính chính (CyberWork OS)**:
     - *Chế độ Thu Nhỏ (Desk View)*: Đặt ở trung tâm bàn, viền bezel màn hình, camera có dán băng dính che webcam.
     - *Chế độ Phóng To (Zoom Focus View)*: Bấm phím `Space` hoặc click vào màn hình để phóng to tràn khung hình, toàn quyền thao tác Terminal, CodeEditor, Jira, Slack và Minigames. Bấm `Esc` hoặc nút góc trên để thu nhỏ về bàn làm việc.
  2. **Cốc Cà Phê Gốm MegaSoft (Bên phải bàn)**:
     - Click vào (hoặc bấm phím `1`): Húp 1 ngụm cà phê (hiệu ứng tiếng "Slurp"), hồi `+15 Energy`, giảm `-5 Stress`. Tối đa 3 cốc/ngày. Cốc vơi dần theo số ngụm.
  3. **Điện Thoại Bàn / Smartphone (Bên trái bàn)**:
     - Khi có sự cố hoặc PM/Sếp gọi ngoài giờ: Điện thoại rung lắc giật nảy trên bàn kèm chuông "Rrrrring!". Click vào để nhấc máy nhận cuộc gọi khẩn cấp.
  4. **Giấy Ghi Chú Vàng (Post-it notes)**:
     - Dán quanh viền màn hình: Hiển thị task hiện tại, deadline sprint, mật khẩu wifi.
  5. **Vịt Cao Su Xả Stress (Rubber Duck)**:
     - Click vào (hoặc bấm phím `3`): Phát tiếng "Chít chít!", giảm `-2 Stress` (Rubber Duck Debugging).
  6. **Bàn Phím Cơ & Chuột Quang**:
     - Đặt trước màn hình với đèn nền LED RGB đổi màu, phát tiếng gõ switch cơ chân thực.

---

## 2. Hệ Thống Hướng Dẫn & Trợ Giúp (Guide & Onboarding System)

Để người chơi không bị bỡ ngỡ trước nhiều nút bấm và vật phẩm tương tác, hệ thống cung cấp 4 lớp hướng dẫn:

### 2.1 Thanh Hướng Dẫn Phím Tắt Trực Quan Dưới Cùng (Quick Controls Bar)
Luôn hiển thị cố định ở chân màn hình ở cả 2 chế độ (Desk View & Zoom View):
- `[Space]` Phóng to / Thu nhỏ máy tính
- `[1] / Click Cốc Cà Phê` Uống cà phê hồi sức
- `[2] / Click Điện Thoại` Nhấc máy khi chuông reo
- `[3] / Click Vịt Cao Su` Bóp vịt xả stress
- `[P] Quầy Pantry` Đi ra quầy cà phê buôn chuyện
- `[M] Phòng Họp` Vào phòng họp Scrum
- `[?] Hướng Dẫn` Mở bảng cẩm nang thử việc

### 2.2 Hiệu Ứng Tooltip Thông Minh Khi Rê Chuột (Hover Tooltips)
Khi di chuột vào bất kỳ vật phẩm nào trên bàn hoặc trên thanh công cụ, một khung tooltip đẹp mắt sẽ lập tức xuất hiện:
- *Cốc cà phê*: `☕ Cà Phê Sữa Đá (Click: +15 ⚡ Energy, -5 🔥 Stress) [Còn lại: X/3 cốc]`.
- *Điện thoại bàn*: `☎️ Điện Thoại Khẩn Cấp (Nhấc máy khi có chuông reo báo biến cố)`.
- *Vịt cao su*: `🦆 Vịt Lập Trình (Click để tâm sự xả stress: -2 🔥 Stress)`.
- *Màn hình PC*: `💻 Màn Hình Làm Việc (Click hoặc nhấn SPACE để Focus vào CyberWork OS)`.
- *Giấy Post-it*: `📝 Ghi Chú Nhanh (Click để xem mục tiêu & mẹo hiện tại)`.

### 2.3 Hướng Dẫn Nhập Môn Ngày Đầu (Day 1 Guided Walkthrough)
Vào Ngày 1, Sếp Tuấn Anh và Mentor Dũng sẽ lần lượt xuất hiện và hiển thị các gợi ý mũi tên phát sáng (Spotlight / Pulse Effect):
1. *"Trước tiên, hãy nhấp vào cốc cà phê để nạp năng lượng cho ca làm việc mới."*
2. *"Tuyệt vời! Bây giờ hãy nhấn SPACE hoặc nhấp vào Màn hình máy tính để đăng nhập CyberWork OS."*
3. *"Hãy mở JiraBoard, nhận ticket đầu tiên và bắt đầu chứng tỏ năng lực nào!"*

### 2.4 Bảng Cẩm Nang Thử Việc Toàn Diện (Help / Guide Modal `[?]`)
Nút `[?]` trên thanh HUD mở một pop-up cẩm nang gồm:
- **Cơ chế 4 chỉ số sinh tồn**: Năng lượng (Energy), Mức độ căng thẳng (Stress), Điểm đánh giá (KPI), Uy tín đồng nghiệp (Reputation).
- **Quy tắc giờ giấc & OT**: 09:00 - 18:00 làm việc bình thường; sau 18:00 có quyền về nhà hoặc ở lại cày OT đến 20:00 (tăng KPI nhưng tăng Stress).
- **Cảnh báo Burnout**: Nếu Stress chạm ngưỡng 95%, người chơi sẽ kiệt sức và kết thúc game với kết cục Burnout Collapse!
- **Bảng phím tắt đầy đủ**.

---

## 3. Hệ Thống Minigames Thực Tế & Plot Twist Kịch Tính

### 3.1 Cơ Chế Plot Twist Giữa Nhiệm Vụ (Mid-Task Plot Twists)
Trong quá trình làm minigame kỹ thuật, sau khi giải quyết được 1 phần hoặc sau 20-30s, một biến cố bất ngờ sẽ ập đến:
- **Frontend**:
  - *Plot twist "Khách VIP đòi Dark Mode"*: PM nhắn Slack khẩn: Khách hàng lớn đòi thêm Dark Mode & fix giao diện Mobile ngay lập tức → Mở thêm yêu cầu CSS.
  - *Plot twist "Lỗi hiển thị Safari cũ"*: Khách hàng dùng Safari cũ bị vỡ layout flexbox → Phải chọn giải pháp fix vendor prefix.
- **Backend**:
  - *Plot twist "Webhook bên thứ ba thiếu Signature"*: Cổng thanh toán gửi webhook không có chữ ký số xác thực → Phải chèn thêm middleware `verifySignature` trước khi ghi DB.
  - *Plot twist "Query Intern gây Deadlock"*: Đọc log phát hiện nguyên nhân sập là do câu query không index quét hàng triệu bản ghi của bạn thực tập sinh.
- **QA / Tester**:
  - *Plot twist "Works on my machine!"*: Dev chối bỏ trách nhiệm, khẳng định tính năng không có lỗi → Người chơi phải chọn gửi đúng Log Console/Payload để phản biện.
  - *Plot twist "Lỗ hổng IDOR/SQLi"*: Vô tình tìm thấy lỗi bảo mật cho phép xem bảng lương công ty → Quyết định báo cáo có đạo đức hay lờ đi.
- **DevOps / SRE**:
  - *Plot twist "K8s CrashLoopBackOff"*: YAML đúng cú pháp nhưng Pod vẫn sập vì thiếu Secret ENV `DATABASE_URL`!
  - *Plot twist "Rollback bị chặn bởi DB Migration"*: Server sập muốn rollback nhưng DB đã lỡ `DROP COLUMN` → Phải quyết định: Rollback code hay Hotfix DB?

### 3.2 Mở Rộng Kho Nhiệm Vụ (16+ Tickets Đa Dạng)
Mỗi vị trí có ít nhất 4 tickets trải rộng 4 Chương, bao hàm đầy đủ:
- Onboarding (Thiết lập ban đầu).
- Sprint 1 (Tính năng mới, deadline gấp).
- Production Crisis (Sự cố sập hệ thống nửa đêm).
- Refactor & Security Audit (Tối ưu hóa, dọn nợ kỹ thuật).

### 3.3 Góc Nhìn Kỹ Thuật Thực Tế (Tech Insights)
Sau mỗi ticket, hiển thị hộp thoại chia sẻ kinh nghiệm làm nghề thực chiến (vì sao bug này xảy ra ngoài đời thực, cách các công ty công nghệ lớn phòng tránh).

---

## 4. Hệ Thống Chuyển Đổi Địa Điểm (Quick Locations)
Người chơi có thể chuyển góc nhìn từ bàn làm việc sang:
1. **Quầy Pantry (Pantry Lounge)**:
   - Đứng trước máy pha cà phê xịn sò, tủ lạnh dán biển "Đồ ăn ai người nấy lấy", bàn tròn trà sữa.
   - Nơi gặp gỡ đồng nghiệp buôn chuyện công sở, hóng tin đồn thưởng Tết hoặc biến cố công ty.
2. **Phòng Họp (Meeting Room)**:
   - Ngồi quanh bàn họp, đối diện máy chiếu và bảng trắng kiến trúc.
   - Tham gia Daily Scrum, họp Sprint Planning, hoặc bảo vệ kết quả thử việc 1-on-1 với Sếp Tuấn Anh.

---

## 5. Âm Thanh & Hiệu Ứng Chân Thực (Immersive Audio & SFX)
- Tiếng click switch bàn phím cơ khi gõ phím.
- Tiếng húp cà phê "Slurp... Aah!".
- Tiếng vịt cao su "Chít chít!".
- Tiếng chuông điện thoại bàn cổ điển "Rrrrring!".
- Tiếng quạt tản nhiệt case máy tính quay rì rào.
