export const MVP_TICKETS = [
  // ==========================================
  // --- FRONTEND DEVELOPER TICKETS (4 Chap) ---
  // ==========================================
  {
    id: 'TK-FE-1',
    title: 'CSS Layout Fix: Sửa nút bấm lệch vỡ khung đăng nhập',
    role: 'frontend',
    chapter: 1,
    difficulty: 'easy',
    minigameType: 'cssLayoutFix',
    timeLimit: 120,
    gameDuration: 45,
    rewards: { kpi: 10, reputation: 5 },
    penalties: { kpi: -5, stress: 10 },
    description: 'Nút "Đăng nhập" trên trang chủ ProjectX đang bị margin âm đè lên input mật khẩu trên màn hình nhỏ. Hãy chỉnh lại flexbox và margin cho chuẩn!',
    hint: 'Kiểm tra justify-center và bỏ margin-top âm của container.'
  },
  {
    id: 'TK-FE-2',
    title: 'Bug Hunt UI: Soi 5 lỗi giao diện so với bản thiết kế Figma',
    role: 'frontend',
    chapter: 2,
    difficulty: 'medium',
    minigameType: 'bugHuntUI',
    timeLimit: 90,
    gameDuration: 60,
    rewards: { kpi: 15, reputation: 10 },
    penalties: { kpi: -8, stress: 15 },
    description: 'Bản dựng web đang lệch 5 điểm so với mockup thiết kế của Designer. Hãy tìm và nhấp vào cả 5 điểm sai trước khi Designer mở cuộc họp mắng vốn!',
    hint: 'Để ý màu sắc nút bấm, font size tiêu đề, khoảng cách padding và icon bị ngược.'
  },
  {
    id: 'TK-FE-3',
    title: 'CSS Dark Mode Emergency: Khách VIP đòi Dark Mode gấp nửa đêm',
    role: 'frontend',
    chapter: 3,
    difficulty: 'hard',
    minigameType: 'cssLayoutFix',
    timeLimit: 75,
    gameDuration: 60,
    rewards: { kpi: 20, reputation: 12 },
    penalties: { kpi: -10, stress: 20 },
    description: 'Sự cố Black Friday: Sếp Tuấn Anh réo gấp vì khách VIP dùng màn hình OLED đòi giao diện Dark Mode ngay lập tức để không bị chói mắt!',
    hint: 'Đổi nền sang #0f172a và text sang #f8fafc cùng flexbox căn giữa.'
  },
  {
    id: 'TK-FE-4',
    title: 'UI Audit: Tối ưu độ tương phản & Accessibility chuẩn WCAG',
    role: 'frontend',
    chapter: 4,
    difficulty: 'medium',
    minigameType: 'bugHuntUI',
    timeLimit: 90,
    gameDuration: 45,
    rewards: { kpi: 15, reputation: 8 },
    penalties: { kpi: -5, stress: 10 },
    description: 'Chuẩn bị cho buổi đánh giá thử việc 1-on-1: Soi kỹ các lỗi vi phạm khả năng tiếp cận (Accessibility) để ghi điểm tuyệt đối với Giám đốc Kỹ thuật.',
    hint: 'Kiểm tra độ tương phản nút bấm, icon thiếu nhãn và font chữ quá mờ.'
  },

  // ==========================================
  // --- BACKEND DEVELOPER TICKETS (4 Chap) ---
  // ==========================================
  {
    id: 'TK-BE-1',
    title: 'API Pipeline: Sắp xếp đúng luồng xử lý Authentication & Query',
    role: 'backend',
    chapter: 1,
    difficulty: 'easy',
    minigameType: 'apiPipeline',
    timeLimit: 120,
    gameDuration: 45,
    rewards: { kpi: 10, reputation: 5 },
    penalties: { kpi: -5, stress: 10 },
    description: 'API /api/v1/user/profile đang trả về 500 do các middleware bị đảo lộn thứ tự. Kéo thả các bước vào đúng trình tự từ Client Request đến Server Response!',
    hint: 'Luồng chuẩn: Validate Input -> Auth Token -> Query DB -> Sanitize Output -> 200 OK.'
  },
  {
    id: 'TK-BE-2',
    title: 'Log Detective: Truy tìm nguyên nhân gốc rễ gây Deadlock DB',
    role: 'backend',
    chapter: 2,
    difficulty: 'medium',
    minigameType: 'logDetective',
    timeLimit: 90,
    gameDuration: 60,
    rewards: { kpi: 15, reputation: 10 },
    penalties: { kpi: -8, stress: 15 },
    description: 'Database báo lỗi lock wait timeout. Giữa hàng trăm dòng log console, hãy tìm dòng log chứa root cause thật sự để báo cáo cho Lead!',
    hint: 'Tìm dòng có từ khóa Transaction Lock trên bảng tbl_order.'
  },
  {
    id: 'TK-BE-3',
    title: 'API Hotfix: Chặn Webhook giả mạo thanh toán lúc 23:00',
    role: 'backend',
    chapter: 3,
    difficulty: 'hard',
    minigameType: 'apiPipeline',
    timeLimit: 75,
    gameDuration: 60,
    rewards: { kpi: 20, reputation: 15 },
    penalties: { kpi: -12, stress: 25 },
    description: 'Báo động đỏ đêm Black Friday: Kẻ xấu lợi dụng cổng thanh toán gửi webhook giả để chiếm đoạt đơn hàng! Phải cấu hình lại pipeline có xác thực Signature ngay.',
    hint: 'Đảm bảo bước Xác thực Token & Chữ ký số đặt trước khi Query/Update DB.'
  },
  {
    id: 'TK-BE-4',
    title: 'Log Detective: Điều tra rò rỉ bộ nhớ (Memory Leak) trước 1-on-1',
    role: 'backend',
    chapter: 4,
    difficulty: 'medium',
    minigameType: 'logDetective',
    timeLimit: 90,
    gameDuration: 45,
    rewards: { kpi: 15, reputation: 8 },
    penalties: { kpi: -6, stress: 10 },
    description: 'Dọn sạch các vấn đề tồn đọng trước ngày thử việc cuối cùng: Truy vết dòng log gây lỗi OutOfMemoryError để hoàn thiện báo cáo hiệu năng.',
    hint: 'Tìm dòng log OutOfMemoryError và unclosed database connections.'
  },

  // ==========================================
  // --- QA / TESTER TICKETS (4 Chap) ---------
  // ==========================================
  {
    id: 'TK-QA-1',
    title: 'Bug Spotter: Bắt 5 lỗi ngầm trong luồng thanh toán giỏ hàng',
    role: 'qa',
    chapter: 1,
    difficulty: 'easy',
    minigameType: 'bugSpotter',
    timeLimit: 120,
    gameDuration: 45,
    rewards: { kpi: 10, reputation: 5 },
    penalties: { kpi: -5, stress: 10 },
    description: 'Tester mới vào team: Kiểm thử kỹ lưỡng trang thanh toán Checkout để bắt trọn các lỗi nghiệp vụ quái đản như số âm, tràn số và XSS payload.',
    hint: 'Để ý ô số lượng nhập số âm (-5), tổng tiền tràn viền và nút bấm vô tác dụng.'
  },
  {
    id: 'TK-QA-2',
    title: 'Test Case Matrix: Phân loại kịch bản kiểm thử Happy/Negative/Security',
    role: 'qa',
    chapter: 2,
    difficulty: 'medium',
    minigameType: 'testCaseBuilder',
    timeLimit: 90,
    gameDuration: 60,
    rewards: { kpi: 15, reputation: 10 },
    penalties: { kpi: -8, stress: 15 },
    description: 'Thiết kế bộ Test Cases chuẩn chỉnh cho tính năng Đăng nhập & Xác thực 2 yếu tố để QA Lead duyệt trước khi release lên Staging.',
    hint: 'Nhập đúng pass là happy_path, bỏ trống là negative, payload OR 1=1 là security.'
  },
  {
    id: 'TK-QA-3',
    title: 'Bug Spotter Crisis: Phát hiện lỗ hổng IDOR rò rỉ dữ liệu VIP',
    role: 'qa',
    chapter: 3,
    difficulty: 'hard',
    minigameType: 'bugSpotter',
    timeLimit: 75,
    gameDuration: 60,
    rewards: { kpi: 20, reputation: 15 },
    penalties: { kpi: -10, stress: 20 },
    description: 'Nửa đêm nhận tin báo có rò rỉ dữ liệu tài khoản VIP. Hãy soi ngay giao diện quản trị để bắt lỗi bảo mật nghiêm trọng trước khi Hacker công khai!',
    hint: 'Tìm lỗi XSS không escape thẻ script và thanh toán 0 đồng thành công.'
  },
  {
    id: 'TK-QA-4',
    title: 'Test Case Matrix: Bộ kịch bản kiểm thử hồi quy (Regression Test)',
    role: 'qa',
    chapter: 4,
    difficulty: 'medium',
    minigameType: 'testCaseBuilder',
    timeLimit: 90,
    gameDuration: 45,
    rewards: { kpi: 15, reputation: 8 },
    penalties: { kpi: -5, stress: 10 },
    description: 'Tổng duyệt kịch bản kiểm thử toàn hệ thống trước buổi đánh giá thử việc 1-on-1 với Giám đốc QA.',
    hint: 'Phân loại chính xác các ca kiểm thử biên (boundary) và kiểm thử phủ định.'
  },

  // ==========================================
  // --- DEVOPS / SRE TICKETS (4 Chap) --------
  // ==========================================
  {
    id: 'TK-DE-1',
    title: 'YAML Surgeon: Sửa lỗi cú pháp Tab & thụt lề CI/CD Pipeline',
    role: 'devops',
    chapter: 1,
    difficulty: 'easy',
    minigameType: 'yamlSurgeon',
    timeLimit: 120,
    gameDuration: 45,
    rewards: { kpi: 10, reputation: 5 },
    penalties: { kpi: -5, stress: 10 },
    description: 'File `.github/workflows/deploy.yml` bị dev gõ lẫn phím Tab khiến parser YAML ném lỗi cú pháp đỏ lòm. Hãy chỉnh lại 2 khoảng trắng (spaces) chuẩn chỉ!',
    hint: 'Thay thế toàn bộ ký tự \\t bằng 2 dấu cách và căn chỉnh thụt dòng đồng đều.'
  },
  {
    id: 'TK-DE-2',
    title: 'Incident Commander: Quy trình 5 bước dập tắt sự cố sập Web',
    role: 'devops',
    chapter: 2,
    difficulty: 'medium',
    minigameType: 'incidentCommander',
    timeLimit: 90,
    gameDuration: 60,
    rewards: { kpi: 15, reputation: 10 },
    penalties: { kpi: -8, stress: 15 },
    description: 'Hệ thống báo động PagerDuty réo inh ỏi! Hãy thực hiện chuẩn quy trình phản ứng sự cố SRE từ Acknowledge đến Rollback và Post-Mortem.',
    hint: 'Thứ tự: Acknowledge -> Check Logs -> Root Cause -> Rollback -> Post-Mortem.'
  },
  {
    id: 'TK-DE-3',
    title: 'YAML Surgeon: Cứu cụm K8s Pod CrashLoopBackOff đêm sự cố',
    role: 'devops',
    chapter: 3,
    difficulty: 'hard',
    minigameType: 'yamlSurgeon',
    timeLimit: 75,
    gameDuration: 60,
    rewards: { kpi: 20, reputation: 15 },
    penalties: { kpi: -12, stress: 25 },
    description: 'Sự cố Black Friday lúc 23:30: File Kubernetes deployment cấu hình sai thụt dòng khiến toàn bộ Pod backend rơi vào CrashLoopBackOff! Phải sửa ngay.',
    hint: 'Sửa các lỗi thụt đầu dòng lệch cấp để container khởi động thành công.'
  },
  {
    id: 'TK-DE-4',
    title: 'Incident Commander: Diễn tập quy trình Zero-Downtime Rollout',
    role: 'devops',
    chapter: 4,
    difficulty: 'medium',
    minigameType: 'incidentCommander',
    timeLimit: 90,
    gameDuration: 45,
    rewards: { kpi: 15, reputation: 8 },
    penalties: { kpi: -5, stress: 10 },
    description: 'Chuẩn bị cho buổi phỏng vấn thử việc: Diễn tập quy trình ứng phó thảm họa hạ tầng trước mặt Tech Lead DevOps để chứng minh năng lực Senior.',
    hint: 'Tuân thủ đúng quy trình tiêu chuẩn 5 bước không được đảo lộn.'
  }
];
