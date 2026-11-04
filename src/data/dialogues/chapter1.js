export const CHAPTER_1_DIALOGUES = {
  hr_lan: [
    {
      id: 'onboarding_welcome',
      speaker: 'HR Lan',
      text: 'Chào mừng em gia nhập MegaSoft Corp! Hôm nay là ngày đầu tiên của 2 tháng thử việc đầy thách thức.',
      emotion: 'happy',
      choices: [
        { text: '✨ Dạ em chào chị! Em rất háo hức bắt đầu.', type: 'responsible' },
        { text: '☕ Cho em hỏi công ty mình có cà phê miễn phí ở đâu ạ?', type: 'neutral' }
      ]
    },
    {
      id: 'onboarding_desk',
      speaker: 'HR Lan',
      text: 'Bàn làm việc của em ở góc kia nhé. Hãy đi đến bàn, nhấn [E] để mở máy tính làm việc và bắt đầu ticket Onboarding đầu tiên!',
      emotion: 'happy'
    }
  ],
  dev_minh: [
    {
      id: 'minh_intro',
      speaker: 'Senior Dev Minh',
      text: 'Chào em mới. Anh là Minh, mentor kỹ thuật. Quy tắc số 1 ở đây: Đọc kỹ tài liệu trước khi hỏi, và tuyệt đối không push thẳng code lên nhánh master nhé!',
      emotion: 'neutral',
      choices: [
        { text: '🫡 Em ghi nhớ ạ! Mong anh chỉ bảo thêm.', type: 'responsible' },
        { text: '😅 Master có CI/CD chặn rồi mà anh lo gì.', type: 'deflect_blame' }
      ]
    }
  ],
  pm_hung: [
    {
      id: 'hung_intro',
      speaker: 'PM Hùng',
      text: 'Chào người anh em mới! Team đang chạy nước rút cho ProjectX. Sprint đầu của em sẽ bắt đầu từ thứ Hai. Nhớ cập nhật Jira đúng giờ hàng ngày nha.',
      emotion: 'happy'
    }
  ],
  qa_trang: [
    {
      id: 'trang_intro',
      speaker: 'QA Lead Trang',
      text: 'Lại thêm một bạn mới à? Chị nói trước: Chị test rất kỹ đấy, đừng mong cheat qua mặt được chị!',
      emotion: 'annoyed'
    }
  ],
  devops_khoa: [
    {
      id: 'khoa_intro',
      speaker: 'DevOps Khoa',
      text: 'Chào bạn. Bên phòng máy server này hơi ồn và lạnh tí, nhưng cần gì về Docker hay deploy thì cứ ới mình.',
      emotion: 'neutral'
    }
  ],
  lead_duc: [
    {
      id: 'duc_intro',
      speaker: 'Tech Lead Đức',
      text: 'Chào em. Công ty rất kỳ vọng vào đợt tuyển dụng này. Sau 2 tháng, chúng ta sẽ có buổi 1-on-1 đánh giá chính thức. Chúc em thể hiện tốt!',
      emotion: 'neutral'
    }
  ]
};
