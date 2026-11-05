import { globalEventBus } from '../core/eventBus.js';
import { globalGameState } from '../core/gameState.js';

export const ENDINGS_CATALOG = {
  burnout: {
    id: 'burnout',
    title: '🔥 Kết Thúc Sớm: Burnout Kiệt Sức',
    emoji: '🚑',
    resultBadge: 'FAIL THỬ VIỆC',
    leadQuote: '"Sức khỏe tinh thần là quan trọng nhất. Hãy nghỉ ngơi, đừng hy sinh bản thân quá mức vì deadline."',
    desc: 'Chỉ số Stress vượt quá 95%! Bạn đã gục ngã trên bàn phím và phải nhập viện điều trị. Một bài học sâu sắc về Work-Life Balance.'
  },
  superstar: {
    id: 'superstar',
    title: '🏆 Ngôi Sao Mới (Pass Xuất Sắc + Tăng Lương)',
    emoji: '🌟',
    resultBadge: 'PASS THỬ VIỆC XUẤT SẮC',
    leadQuote: '"Rất lâu rồi anh mới thấy một nhân viên thử việc chủ động, kỹ thuật chắc tay và tinh thần đồng đội tuyệt vời như em!"',
    desc: 'Chúc mừng! Bạn chính thức trở thành Kỹ sư Phần mềm chính thức tại MegaSoft Corp với mức lương đề xuất tăng 25% + Thưởng nóng dự án!'
  },
  passed: {
    id: 'passed',
    title: '✅ Đủ Điểm Đậu (Gia Nhập Chính Thức)',
    emoji: '🎉',
    resultBadge: 'PASS THỬ VIỆC',
    leadQuote: '"Em đã thể hiện tốt các kỹ năng cơ bản và hòa nhập với team. Chào mừng em chính thức đến với MegaSoft!"',
    desc: 'Bạn đã hoàn thành tốt 60 ngày thử việc và được ký hợp đồng lao động chính thức 1 năm!'
  },
  extended: {
    id: 'extended',
    title: '😰 Gia Hạn Thử Việc Thêm 1 Tháng',
    emoji: '⏳',
    resultBadge: 'GIA HẠN 30 NGÀY',
    leadQuote: '"Anh thấy em có tiềm năng nhưng cần cải thiện thêm kỹ năng giao tiếp và giảm bớt các lỗi vặt trong Sprint."',
    desc: 'Hội đồng chuyên môn quyết định cho bạn thêm 30 ngày để chứng minh năng lực. Hãy cố gắng hơn nữa!'
  },
  failed: {
    id: 'failed',
    title: '❌ Không Phù Hợp (Dừng Hợp Đồng)',
    emoji: '💼',
    resultBadge: 'KHÔNG PASS THỬ VIỆC',
    leadQuote: '"Cảm ơn em đã đồng hành trong 2 tháng qua. Rất tiếc vị trí này hiện chưa thực sự phù hợp với định hướng của em."',
    desc: 'Bạn nhận được thư cảm ơn và quyết định chấm dứt thử việc từ phòng Nhân sự. Nhưng thất bại là mẹ thành công, hãy tiếp tục trau dồi!'
  }
};

export class EndingSystem {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.gameState = options.gameState || globalGameState;
  }

  evaluate(stats = null) {
    const s = stats || {
      kpi: this.gameState.get('player.kpi') ?? 50,
      reputation: this.gameState.get('player.reputation') ?? 50,
      stress: this.gameState.get('player.stress') ?? 20
    };

    // Priority 1: Burnout (Review Focus 1: stress >= 95)
    if (s.stress >= 95) {
      return ENDINGS_CATALOG.burnout;
    }

    // Priority 2: Superstar
    if (s.kpi >= 80 && s.reputation >= 70 && s.stress < 50) {
      return ENDINGS_CATALOG.superstar;
    }

    // Priority 3: Passed
    if (s.kpi >= 60 && s.reputation >= 50) {
      return ENDINGS_CATALOG.passed;
    }

    // Priority 4: Extended
    if ((s.kpi >= 40 && s.kpi < 60) || (s.reputation >= 30 && s.reputation < 50)) {
      return ENDINGS_CATALOG.extended;
    }

    // Priority 5: Failed
    return ENDINGS_CATALOG.failed;
  }
}

export const globalEndingSystem = new EndingSystem();
