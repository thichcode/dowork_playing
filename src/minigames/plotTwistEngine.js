export const ROLE_PLOT_TWISTS = {
  frontend: [
    {
      id: 'fe_vip_dark_mode',
      title: '🚨 PM réo gấp: Khách VIP đòi Dark Mode ngay lập tức!',
      dilemma: 'Khách hàng lớn vừa mở trang web trên màn hình OLED trong phòng tối và phàn nàn bị chói mắt. PM yêu cầu đổi background sang tối (#0f172a) và chữ trắng!',
      options: [
        {
          text: '⚡ Hotfix nhanh: Áp dụng CSS Dark theme ngay (+10 KPI, +5 Stress)',
          kpiDelta: 10,
          stressDelta: 5,
          repDelta: 5
        },
        {
          text: '🛡️ Phản bác: Giải thích cần làm chuẩn Design Token trong Sprint sau (+5 KPI, -5 Rep)',
          kpiDelta: 5,
          stressDelta: -5,
          repDelta: -5
        }
      ]
    },
    {
      id: 'fe_safari_bug',
      title: '🍎 Bug kinh điển: Safari cũ không hỗ trợ CSS Gap!',
      dilemma: 'Khách hàng sếp tổng dùng iPad đời cũ báo giao diện bị dính chùm vào nhau do trình duyệt WebKit cũ không nhận thuộc tính gap trong Flexbox!',
      options: [
        {
          text: '🛠️ Dùng margin âm và padding tương thích ngược (+8 KPI, +10 Stress)',
          kpiDelta: 8,
          stressDelta: 10,
          repDelta: 8
        },
        {
          text: '🤷 "Works on modern browsers" — đề xuất khách nâng cấp iPad (+0 KPI, -10 Rep)',
          kpiDelta: 0,
          stressDelta: 0,
          repDelta: -10
        }
      ]
    }
  ],

  backend: [
    {
      id: 'be_webhook_signature',
      title: '💳 Nguy cơ gian lận: Cổng thanh toán gửi Webhook thiếu Signature!',
      dilemma: 'Đang xếp luồng API thì phát hiện Webhook không có chữ ký số xác thực HMAC-SHA256. Kẻ xấu có thể giả mạo thông báo thanh toán thành công để mua hàng 0 đồng!',
      options: [
        {
          text: '🔒 Chặn đứng: Chèn ngay middleware verifyWebhookSignature trước DB (+15 KPI, +8 Rep)',
          kpiDelta: 15,
          stressDelta: 5,
          repDelta: 8
        },
        {
          text: '⚠️ Bỏ qua ghi log tạm thời để kịp release deadline (+5 KPI, +15 Stress, -10 Rep)',
          kpiDelta: 5,
          stressDelta: 15,
          repDelta: -10
        }
      ]
    },
    {
      id: 'be_intern_deadlock',
      title: '💥 Tội đồ lộ diện: Query thiếu Index của Thực tập sinh!',
      dilemma: 'Truy vết log phát hiện Deadlock DB là do câu query `SELECT * FROM tbl_order WHERE status = 1` không có index do bạn intern mới commit tối qua!',
      options: [
        {
          text: '🤝 Tạo Composite Index & nhẹ nhàng hướng dẫn bạn Intern (+10 KPI, +10 Rep)',
          kpiDelta: 10,
          stressDelta: 2,
          repDelta: 10
        },
        {
          text: '📢 Báo cáo sếp phê bình bạn intern trong Daily Scrum (+5 KPI, -10 Rep)',
          kpiDelta: 5,
          stressDelta: -3,
          repDelta: -10
        }
      ]
    }
  ],

  qa: [
    {
      id: 'qa_works_on_my_machine',
      title: '🗣️ Phản hồi từ Developer: "Ơ trên máy anh vẫn chạy bình thường mà?!"',
      dilemma: 'Bạn vừa log bug nghiêm trọng giỏ hàng tính sai tiền, Developer nhắn tin cãi gay gắt và từ chối sửa vì không tái hiện được trên localhost.',
      options: [
        {
          text: '📸 Xuất log Network, Console Stacktrace & HAR file gửi đối chứng (+12 KPI, +10 Rep)',
          kpiDelta: 12,
          stressDelta: 5,
          repDelta: 10
        },
        {
          text: '💥 Tranh cãi nảy lửa trong group chat chung (+0 KPI, +15 Stress, -15 Rep)',
          kpiDelta: 0,
          stressDelta: 15,
          repDelta: -15
        }
      ]
    },
    {
      id: 'qa_idor_security',
      title: '🕵️ Phát hiện chấn động: Lỗ hổng IDOR xem được bảng lương toàn công ty!',
      dilemma: 'Khi kiểm thử API user profile, đổi `id=1` trên URL thì dữ liệu trả về bảng lương và hợp đồng mật của Ban Giám đốc!',
      options: [
        {
          text: '🛡️ Báo cáo mật cho Trưởng ban An ninh Thông tin CISO (+20 KPI, +15 Rep)',
          kpiDelta: 20,
          stressDelta: 10,
          repDelta: 15
        },
        {
          text: '🤐 Xem lén lương sếp rồi giả vờ như không thấy (+0 KPI, +20 Stress)',
          kpiDelta: 0,
          stressDelta: 20,
          repDelta: 0
        }
      ]
    }
  ],

  devops: [
    {
      id: 'de_k8s_crashloop',
      title: '☸️ K8s Incident: Pod Backend rơi vào CrashLoopBackOff!',
      dilemma: 'File YAML sửa xong cú pháp thụt lề nhưng Pod vẫn liên tục crash khi vừa khởi động. Log container báo: `FATAL: DATABASE_PASSWORD is empty`!',
      options: [
        {
          text: '🔑 Inject Kubernetes Secret envFrom vào Deployment manifest (+15 KPI, +10 Rep)',
          kpiDelta: 15,
          stressDelta: 5,
          repDelta: 10
        },
        {
          text: '⚡ Hardcode mật khẩu trực tiếp vào file config để chạy gấp (+5 KPI, +15 Stress, -15 Rep)',
          kpiDelta: 5,
          stressDelta: 15,
          repDelta: -15
        }
      ]
    },
    {
      id: 'de_migration_block',
      title: '🛑 Rollback bất thành: DB Migration đã lỡ DROP COLUMN!',
      dilemma: 'Muốn rollback về bản code cũ nhưng Migration chạy trước đó đã xóa mất cột dữ liệu cũ. Rollback code sẽ làm toàn bộ ứng dụng crash 100%!',
      options: [
        {
          text: '⏩ Quyết định Forward-Fix: Giữ bản mới và tung Hotfix vá lỗi (+18 KPI, +12 Rep)',
          kpiDelta: 18,
          stressDelta: 10,
          repDelta: 12
        },
        {
          text: '⏪ Restore full database backup từ snapshot 2 tiếng trước (+5 KPI, +25 Stress, -10 Rep)',
          kpiDelta: 5,
          stressDelta: 25,
          repDelta: -10
        }
      ]
    }
  ]
};

export const TECH_INSIGHTS = {
  cssLayoutFix: '💡 **Bài học thực chiến (CSS Layout & Responsive)**: Trong các dự án lớn, luôn sử dụng CSS Flexbox/Grid hiện đại kết hợp CSS Variables (Design Tokens) để dễ dàng hỗ trợ Dark Mode. Tránh hardcode margin âm vì sẽ làm vỡ giao diện trên các kích thước màn hình khác nhau.',
  bugHuntUI: '💡 **Bài học thực chiến (UI Design System)**: Sai lệch màu sắc hoặc khoảng cách giữa bản thiết kế Figma và mã nguồn là nguyên nhân hàng đầu gây mâu thuẫn giữa Designer và Developer. Sử dụng Tailwind CSS hoặc UI Component Library chuẩn sẽ giúp giảm thiểu 90% lỗi này.',
  apiPipeline: '💡 **Bài học thực chiến (Middleware Pipeline Architecture)**: Thứ tự middleware trong Express/Fastify/NestJS cực kỳ quan trọng. Luôn đặt Rate Limiting và Input Validator lên đầu để bảo vệ server trước các cuộc tấn công DDoS hoặc SQL Injection trước khi chạm tới Database.',
  logDetective: '💡 **Bài học thực chiến (Distributed Tracing & Log Analysis)**: Khi hệ thống microservices gặp sự cố, phân tích Transaction Deadlock và OutOfMemoryError đòi hỏi công cụ APM như Datadog, Prometheus hoặc ELK Stack để khoanh vùng chính xác service gây lỗi thay vì mò mẫm thủ công.',
  bugSpotter: '💡 **Bài học thực chiến (Edge Case Testing)**: Lỗi nhập số lượng âm hoặc số cực lớn trong giỏ hàng là các ca kiểm thử kinh điển (Boundary & Negative Testing). Các hệ thống thanh toán lớn luôn phải có validation kép cả ở Client lẫn Server.',
  testCaseBuilder: '💡 **Bài học thực chiến (Test Coverage Matrix)**: Một bộ test case chuẩn luôn phải bao quát 4 trụ cột: Happy Path (người dùng làm đúng), Boundary (ngưỡng giới hạn), Negative (người dùng cố tình làm sai) và Security (tấn công SQLi/XSS/CSRF).',
  yamlSurgeon: '💡 **Bài học thực chiến (CI/CD Configuration & Linter)**: YAML sử dụng thụt lề bằng dấu cách (spaces) thay vì tab. Để tránh các sự cố CI/CD pipeline chết oan, các đội ngũ DevOps luôn cài đặt công cụ `yamllint` và `pre-commit hook` tự động kiểm tra trước khi push.',
  incidentCommander: '💡 **Bài học thực chiến (SRE Incident Response)**: Theo chuẩn của Google SRE, khi xảy ra sự cố production, ưu tiên số 1 là cô lập và phục hồi dịch vụ (Mitigation / Rollback), tuyệt đối không debug tại chỗ trên môi trường thật. Báo cáo Post-Mortem phải mang tinh thần "Blameless" để cải tiến quy trình.'
};

export class PlotTwistEngine {
  constructor() {}

  getPlotTwistForRole(role) {
    const list = ROLE_PLOT_TWISTS[role] || ROLE_PLOT_TWISTS.frontend;
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex] || list[0];
  }

  getTechInsight(minigameType) {
    return TECH_INSIGHTS[minigameType] || '💡 **Bài học thực tế**: Luôn kiểm thử cẩn thận, viết code sạch và tuân thủ quy trình kiểm thử trước khi release production!';
  }
}

export const globalPlotTwistEngine = new PlotTwistEngine();
