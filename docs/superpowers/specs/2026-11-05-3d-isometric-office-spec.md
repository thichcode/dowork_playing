# Spec: 3D Isometric Low-Poly Office Exploration ("The Sims / Game Dev Tycoon" Style)

## 1. Mục Tiêu & Trải Nghiệm Người Chơi (Overview)
Nâng cấp giao diện khám phá không gian văn phòng từ 2D Canvas Tilemap lên **Không Gian 3D Isometric Low-Poly chân thực, hiện đại** bằng Three.js:
- Người chơi nhìn thấy mô hình 3D toàn cảnh 4 phòng ban (Phòng Kỹ Thuật IT, Quầy Pantry, Phòng Họp Alpha, Phòng Server Datacenter) kết nối bởi hành lang trung tâm.
- Tường cắt vát thấp (half-height architectural cutaway) theo phong cách *The Sims* giúp không bị che khuất tầm nhìn.
- Điều khiển avatar nhân vật 3D chạy nhảy, đi lại mượt mà bằng `[WASD / Mũi tên]` với hiệu ứng chuyển động bước chân (bobbing & leg swing animation).
- Cho phép người chơi xoay camera tự do (Orbit / Rotate) bằng chuột hoặc nút phím, phóng to / thu nhỏ (Zoom In/Out).
- Đèn chiếu sáng dịu mắt (soft directional light), bóng đổ nhẹ (subtle shadows) và đèn LED nhấp nháy phát sáng (Emissive lights) ở phòng Server.
- Nút chuyển đổi nhanh **"3D Mode / 2D Mode"** trên thanh công cụ HUD để người chơi có thể tự do đổi giữa đồ họa 3D hiện đại và phong cách Pixel Retro 2D bất kỳ lúc nào.
- Chuyển tiếp liền mạch: Đi tới bàn làm việc nhấn `[E]`, camera lượn 3D mượt mà vào màn hình làm việc CyberWork OS; nhấn `[Esc]` hoặc "Đứng dậy" để camera lùi về góc nhìn 3D Isometric.

---

## 2. Kiến Trúc Kỹ Thuật (Architecture & Components)

### 2.1 Thư Viện & Tải Module (Zero-Bundler Compatibility)
- Sử dụng **Three.js** qua chuẩn W3C `<script type="importmap">`:
  ```html
  <script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"
    }
  }
  </script>
  ```
  Giữ nguyên 100% mô hình Static SPA không cần Webpack/Vite build, tương thích hoàn hảo deploy Vercel và GitHub Pages.

### 2.2 Các Module Chính trong Thư Mục `src/office3d/`:

1. **`src/office3d/threeOfficeScene.js` (Quản lý Scene, Camera & Ánh sáng)**:
   - Khởi tạo `THREE.Scene`, `THREE.PerspectiveCamera` (FOV 45°, đặt ở góc chéo `(20, 25, 20)` nhìn vào tâm `(0, 0, 0)`), `THREE.WebGLRenderer` với `antialias: true`.
   - Ánh sáng:
     - `AmbientLight` (ấm, cường độ 0.6).
     - `DirectionalLight` (mô phỏng nắng cửa sổ với bóng đổ mềm soft shadow).
     - `PointLight` phát sáng xanh/đỏ tại tủ rack Datacenter và đèn quầy Bar Pantry.
   - Hỗ trợ Orbit Controls nhẹ nhàng (xoay góc nhìn bằng kéo chuột, lăn chuột để zoom).

2. **`src/office3d/officeBuilder3D.js` (Dựng Kiến Trúc & Nội Thất 3D)**:
   - Dựng sàn 4 phòng ban với màu sắc và chất liệu đặc trưng:
     - **IT Room**: Sàn gạch đá slate xám than công nghệ cao `#1e293b`.
     - **Pantry**: Sàn gỗ sồi ấm áp `#78350f` / `#9a3412`.
     - **Phòng Họp Alpha**: Thảm xanh navy hội nghị `#0f172a`.
     - **Server Room**: Sàn kim loại nâng kỹ thuật `#090d16` viền neon xanh `#0ea5e9`.
   - Dựng đồ nội thất thủ công 3D (Procedural Low-Poly Mesh):
     - **Bàn làm việc IT**: Mặt bàn gỗ, chân thép, màn hình cong đôi LED xanh, ghế công thái học, laptop, chậu cây xanh nhỏ.
     - **Quầy Pantry**: Quầy bar dài, máy pha cà phê espresso inox sáng bóng, tủ lạnh 2 cánh, bàn tròn cafe, sofa nệm bọc da.
     - **Phòng Họp Alpha**: Bàn họp hình oval lớn, hàng ghế xoay, bảng kính trình chiếu Kanban.
     - **Cụm Server**: Các tủ rack đen cao với dải đèn LED nhấp nháy chuyển màu (Pulse animation).

3. **`src/office3d/character3D.js` (Avatar Người Chơi & NPC 3D)**:
   - Tạo nhân vật 3D Low-Poly dễ thương (Torso, Head, Chân, Tay) với palette màu đồng bộ trang phục (theo Role đã chọn).
   - Tọa độ thế giới 3D ánh xạ 1-1 với tọa độ Tilemap (`x_3d = (tileX - 16) * 1.5`, `z_3d = (tileY - 10) * 1.5`).
   - Xoay hướng mặt nhân vật mượt mà theo góc di chuyển `Math.atan2(dx, dz)`.
   - Hoạt ảnh bước đi: Rung lắc nhẹ (bobbing) và vung tay chân khi đang di chuyển.

4. **`src/office3d/npcManager3D.js` (Quản lý 6 NPC 3D)**:
   - Render 6 NPC tại các phòng: Senior Minh & Tech Lead Đức (IT), HR Lan & QA Trang (Pantry), PM Hùng (Phòng Họp), DevOps Khoa (Server).
   - Bong bóng 3D tương tác (Billboard Sprite quay về phía camera) hiển thị `[E] Trò chuyện` hoặc `!` khi người chơi đến gần.

5. **`src/office3d/officeRenderer3D.js` (Cầu Nối Controller)**:
   - Đồng bộ giữa `Player` (input di chuyển, collision) và Scene 3D.
   - Hỗ trợ chuyển đổi mượt mà giữa chế độ 3D và 2D canvas thông qua EventBus (`view:toggle-dimension`).
   - Khi tương tác bàn làm việc: Camera 3D phóng tới màn hình máy tính -> kích hoạt CyberWork OS.

---

## 3. Khả Năng Tương Thích & Kiểm Thử (Compatibility & Testing)
- **Node.js Test Runner**: Các logic tính toán tọa độ 3D, collision, room bounds và camera math được module hóa độc lập, chạy và pass 100% trong `npm test` không cần headless browser hay WebGL mock phức tạp.
- **Tương thích ngược**: Chế độ 2D Canvas cũ vẫn được bảo lưu nguyên vẹn; người chơi có thể bật tắt 3D bất cứ lúc nào qua nút bấm `[🎮 3D / 2D]` trên HUD.
- **Hiệu năng**: Low-poly mesh với tổng số polygon < 5,000 tris, đảm bảo chạy 60 FPS trên mọi trình duyệt Chrome, Edge, Safari, Firefox và thiết bị di động.

---

## 4. Kế Hoạch Triển Khai (Phases)
1. **Pha 1**: Thiết lập import Three.js, cấu hình Scene 3D, Camera Isometric và Ánh sáng.
2. **Pha 2**: Dựng kiến trúc văn phòng 3D (sàn 4 phòng, tường cắt thấp, cửa mở, nội thất đặc trưng).
3. **Pha 3**: Tạo Avatar người chơi 3D và 6 NPC 3D với animation bước chân và chỉ báo tương tác.
4. **Pha 4**: Tích hợp điều khiển WASD, camera follow, xoay chuột Orbit, và luồng ngồi vào bàn làm việc CyberWork OS.
5. **Pha 5**: Bổ sung nút chuyển đổi 3D/2D trên HUD, chạy bộ test tự động, cập nhật tài liệu và push GitHub.
