export const CHAPTER_4_DIALOGUES = {
  lead_duc: [
    {
      id: 'interview_q1',
      speaker: 'Tech Lead Đức',
      text: 'Chào em, hôm nay là ngày cuối của 2 tháng thử việc. Anh có 3 câu hỏi phỏng vấn đánh giá chính thức. Câu đầu tiên: Bài học kỹ thuật lớn nhất em rút ra được ở MegaSoft là gì?',
      emotion: 'neutral',
      choices: [
        { text: '💡 Luôn viết test cẩn thận, hiểu sâu kiến trúc hệ thống và tôn trọng quy trình CI/CD.', type: 'responsible' },
        { text: '☕ Cách pha cà phê ngon nhất và trốn sếp vào giờ giải lao.', type: 'neutral' }
      ]
    },
    {
      id: 'interview_q2',
      speaker: 'Tech Lead Đức',
      text: 'Câu 2: Nếu có cơ hội làm lại Sprint đầu tiên, em sẽ cải thiện điều gì trong cách làm việc với team?',
      emotion: 'neutral',
      choices: [
        { text: '🤝 Em sẽ chủ động giao tiếp sớm hơn khi gặp blocker để tránh dồn deadline.', type: 'honest_help' },
        { text: '🚀 Em thấy mình làm hoàn hảo rồi, không có gì cần thay đổi cả.', type: 'deflect_blame' }
      ]
    },
    {
      id: 'interview_q3',
      speaker: 'Tech Lead Đức',
      text: 'Câu cuối: Em thấy văn hóa làm việc và tinh thần đồng đội ở phòng IT MegaSoft Corp như thế nào?',
      emotion: 'neutral',
      choices: [
        { text: '❤️ Mọi người rất nhiệt tình chỉ bảo, em cảm thấy mình học hỏi và trưởng thành rất nhiều!', type: 'responsible' },
        { text: '😴 Mọi người giao việc nhiều quá, QA thì soi mói quá mức.', type: 'deflect_blame' }
      ]
    }
  ]
};
