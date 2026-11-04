export const CHAPTER_3_DIALOGUES = {
  devops_khoa: [
    {
      id: 'incident_alarm',
      speaker: 'DevOps Khoa',
      text: 'BÁO ĐỘNG ĐỎ! 🚨 Server Production của ProjectX đang bị sập hoàn toàn! 500 errors tăng vọt, khách hàng đang gọi điện réo liên tục!',
      emotion: 'panic',
      choices: [
        { text: '⚡ Em bật Workstation ngay, sẵn sàng hỗ trợ trace log và xử lý!', type: 'responsible' },
        { text: '🏃 Em mới thử việc thôi, vụ này chắc của các anh Senior chứ ạ?', type: 'deflect_blame' }
      ]
    }
  ],
  lead_duc: [
    {
      id: 'post_mortem_duc',
      speaker: 'Tech Lead Đức',
      text: 'Sau 30 phút căng thẳng, hệ thống đã ổn định trở lại. Giờ chúng ta cần tìm hiểu nguyên nhân gốc rễ và ai đã commit đoạn code gây sự cố này.',
      emotion: 'neutral',
      choices: [
        { text: '🙋 Dạ chính là commit của em hôm qua chưa tính hết trường hợp. Em xin nhận trách nhiệm và viết bài Post-mortem.', type: 'responsible' },
        { text: '🤷‍♂️ Em nghĩ do code cũ từ mấy năm trước của ai đó để lại thôi anh.', type: 'deflect_blame' }
      ]
    }
  ]
};
