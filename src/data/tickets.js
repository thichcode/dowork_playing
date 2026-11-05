export const MVP_TICKETS = [
  // --- FRONTEND DEVELOPER TICKETS ---
  {
    id: 'TK-FE-1',
    title: 'CSS Layout Fix: Sửa nút bấm lệch vỡ khung đăng nhập',
    role: 'frontend',
    chapter: 1,
    difficulty: 'easy',
    minigameType: 'cssLayoutFix',
    timeLimit: 120, // 2 minutes
    gameDuration: 45, // 45 in-game minutes
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

  // --- BACKEND DEVELOPER TICKETS ---
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

  // --- QA / TESTER TICKETS ---
  {
    id: 'TK-QA-1',
    title: 'Bug Spotter: Tìm 5 bug nghiệp vụ giấu kín trong Giỏ hàng',
    role: 'qa',
    chapter: 1,
    difficulty: 'easy',
    minigameType: 'bugSpotter',
    timeLimit: 120,
    gameDuration: 45,
    rewards: { kpi: 10, reputation: 5 },
    penalties: { kpi: -5, stress: 10 },
    description: 'Dev vừa bàn giao trang Checkout giỏ hàng. Hãy tương tác và tìm ra 5 lỗ hổng: số lượng âm, mã giảm giá vô hạn, nút mua hàng bị disabled,...',
    hint: 'Thử nhập số âm vào ô số lượng hoặc xóa trắng trường địa chỉ giao hàng.'
  },
  {
    id: 'TK-QA-2',
    title: 'Test Case Builder: Phân loại đúng các loại Test Case cho Login',
    role: 'qa',
    chapter: 2,
    difficulty: 'medium',
    minigameType: 'testCaseBuilder',
    timeLimit: 90,
    gameDuration: 60,
    rewards: { kpi: 15, reputation: 10 },
    penalties: { kpi: -8, stress: 15 },
    description: 'Phân loại 8 test case vào đúng các nhóm: Happy Path, Boundary Value, Negative Case và Security Test!',
    hint: 'Nhập password trống là Negative; nhập SQL Injection là Security.'
  },

  // --- DEVOPS / SRE TICKETS ---
  {
    id: 'TK-DO-1',
    title: 'YAML Surgeon: Cứu file CI/CD pipeline GitHub Actions bị lỗi thụt dòng',
    role: 'devops',
    chapter: 1,
    difficulty: 'easy',
    minigameType: 'yamlSurgeon',
    timeLimit: 120,
    gameDuration: 45,
    rewards: { kpi: 10, reputation: 5 },
    penalties: { kpi: -5, stress: 10 },
    description: 'Pipeline CI/CD đỏ lòm vì ai đó dùng phím Tab thay cho Space trong file .github/workflows/deploy.yml. Sửa các lỗi cú pháp để pipeline xanh trở lại!',
    hint: 'YAML nghiêm cấm Tab, thụt dòng con đúng 2 spaces so với cha.'
  },
  {
    id: 'TK-DO-2',
    title: 'Incident Commander: Quy trình 5 bước dập tắt sự cố sập server',
    role: 'devops',
    chapter: 2,
    difficulty: 'hard',
    minigameType: 'incidentCommander',
    timeLimit: 90,
    gameDuration: 60,
    rewards: { kpi: 15, reputation: 10 },
    penalties: { kpi: -8, stress: 15 },
    description: 'Sự cố sập container production! Thực hiện đúng 5 bước chuẩn SRE: Acknowledge -> Check Logs -> Rollback -> Scale -> Post-mortem.',
    hint: 'Đừng vội deploy code mới khi chưa rollback về bản ổn định gần nhất!'
  }
];
