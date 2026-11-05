# Spec: High-Detail Stylized Procedural 3D Assets (Characters & Office Environment)

## 1. Mục Tiêu (Overview)
Nâng cấp toàn bộ mô hình 3D từ các khối hộp thô sơ (primitives) lên **Mô hình nhân vật Stylized giàu chi tiết giải phẫu con người** (khuôn mặt, mắt, tóc tạo kiểu, kính cận, cổ áo, dây đeo thẻ nhân viên IT, giày sneakers) và **khung cảnh văn phòng công nghệ cao hiện đại** (vách kính trong suốt khung nhôm, chậu cây Monstera, laptop gập có phím, cây nước nóng lạnh, bảng whiteboard dán note, tranh slogan công nghệ).

Duy trì 100% nguyên tắc:
- Zero external assets: Dựng thuần bằng Three.js procedural geometry (tải tức thì 0ms, không lag, không tốn băng thông, không lỗi CORS).
- 100% test compatibility: Tiếp tục đảm bảo tất cả bài test chạy headless trên Node.js runner (`npm test`).

---

## 2. Chi Tiết Nâng Cấp Nhân Vật (`Character3D`)

### 2.1 Khuôn Mặt & Đầu:
- **Cổ (Neck)**: Trụ nối tự nhiên giữa đầu và thân.
- **Mặt (Face)**: Mắt có tròng đen rõ rệt, lông mày, sống mũi, tai hai bên.
- **Kính Cận (Glasses)**: Gọng kính đen/bạc thời trang đặc trưng của lập trình viên và dân công nghệ.
- **Kiểu Tóc (Styled Hair)**: Tóc có khối phồng và lọn tóc:
  - Nam (Dev Minh, PM Hùng, DevOps Khoa, Lead Đức): Undercut / Side-part chải nếp hiện đại.
  - Nữ (HR Lan, QA Trang): Tóc bob cá tính hoặc tóc cột đuôi gà có mái bay.

### 2.2 Thân & Trang Phục:
- **Cổ Áo (Collar)**: Cổ áo sơ mi gập đôi hoặc bo cổ áo polo/hoodie.
- **Dây Đeo Thẻ Nhân Viên IT (ID Badge & Lanyard)**: Dây vải xanh/đỏ đeo quanh cổ buông xuống ngực, gắn thẻ nhân viên MegaSoft Corp nền trắng khung xanh.
- **Bàn Tay (Hands)**: Khối bàn tay màu da tự nhiên gắn ở đầu cánh tay.
- **Giày Sneakers**: Giày thể thao 2 lớp (đế trắng cao su + thân giày thể thao năng động).

### 2.3 Chuyển Động Bước Đi (Walking Cycle):
- Vung tay và bước chân luân phiên nhịp nhàng.
- Khớp chân gập nhẹ khi bước và nhún người tự nhiên khi di chuyển.

---

## 3. Chi Tiết Nâng Cấp Khung Cảnh Văn Phòng (`OfficeBuilder3D`)

### 3.1 Vách Ngăn & Cửa Kính (Glass Partitions):
- Vách kính cường lực trong suốt (`opacity: 0.35, color: 0xbae6fd`) viền khung nhôm đen chia ranh giới giữa Phòng IT, Phòng Họp, Quầy Pantry và Server Room.
- Cửa mở khung kính có tay nắm kim loại sáng bóng.

### 3.2 Bàn Làm Việc & Đồ Công Nghệ:
- **Bàn làm việc**: Mặt bàn gỗ sồi bo viền, chân khung thép chữ U, ghế xoay công thái học có tựa lưng dạng lưới (mesh) và tay vịn.
- **Laptop & Màn hình**: Laptop mở góc 110° có bàn phím và màn hình xanh phát sáng code; màn hình phụ viền mỏng LED.
- **Vật phẩm trên bàn**: Chuột quang công thái học, cốc sứ MegaSoft, chậu sen đá mini trong chậu gốm trắng.

### 3.3 Quầy Pantry & Góc Nghỉ Ngơi:
- **Cây nước nóng lạnh**: Máy lọc nước văn phòng dạng cây đứng có bình nước 20L úp ngược trong suốt màu xanh dương, vòi đỏ (nóng) và vòi xanh (lạnh).
- **Máy pha cà phê**: Máy espresso 2 họng pha kim loại sáng bóng, hàng ly sứ úp trên nóc máy.
- **Tủ lạnh**: Tủ lạnh 2 cánh màu bạc kim loại có tay nắm dài và sticker trang trí.
- **Bàn ghế cafe**: Bàn tròn gỗ chân 3 chạc và ghế nệm tròn.

### 3.4 Phòng Họp Alpha (Conference Room):
- Bàn họp oval lớn gỗ nâu sẫm, ở giữa có nắp luồn dây điện và hộp cắm micro hội nghị.
- Bảng Whiteboard kính treo tường có dán các tờ giấy ghi chú Post-it màu vàng, hồng, xanh lá và khay đựng bút lông.

### 3.5 Phòng Server Datacenter:
- Tủ Rack server 42U màu đen nhám có các khay server 1U/2U/4U, dải đèn LED xanh/đỏ chớp nháy (Emissive pulse).
- Khay máng cáp mạng màu vàng chạy dọc theo trần và tường.

### 3.6 Cây Xanh Văn Phòng (Indoor Plants):
- Chậu cây bàng Singapore và chậu trầu bà lá xẻ Monstera tán rộng đặt ở các góc phòng và hành lang trung tâm.

### 3.7 Tranh Treo Tường (Wall Posters):
- Các khung tranh canvas slogan công nghệ treo trên tường hành lang ("Keep Calm and Git Push", "Eat Sleep Code Repeat").

---

## 4. Kế Hoạch Kiểm Thử & Tương Thích
- Giữ nguyên các hàm cốt lõi để 69 bài unit test hiện tại tiếp tục pass 100%.
- Bổ sung unit tests cho các mesh mới: ID badge, glasses, glass walls, water cooler, potted plants, laptop keyboard.
