export const CHAPTER_2_DIALOGUES = {
  pm_hung: [
    {
      id: 'standup_ch2',
      speaker: 'PM Hùng',
      text: 'Standup sáng nay: Hôm nay bạn làm gì? Có gặp khó khăn hay blocker gì không?',
      emotion: 'neutral',
      choices: [
        { text: '🎯 Em đang bám sát tiến độ ticket trên Jira, dự kiến xong trong hôm nay ạ.', type: 'responsible' },
        { text: '🆘 Em đang bị vướng một chỗ logic, em xin phép nhờ anh Minh xem qua giúp.', type: 'honest_help' },
        { text: '😎 Xong hết rồi anh, chiều rảnh em đi uống trà sữa.', type: 'deflect_blame' }
      ]
    },
    {
      id: 'scope_creep_pm',
      speaker: 'PM Hùng',
      text: 'Ê em ơi, khách hàng vừa yêu cầu gấp một chức năng mới nhỏ xíu. Anh nhét thêm vào Sprint này cho em làm luôn nhé?',
      emotion: 'happy',
      choices: [
        { text: '💪 Dạ được anh, để em sắp xếp cố gắng cày thêm.', type: 'responsible' },
        { text: '✋ Dạ Sprint này em đang đủ tải rồi, nếu thêm task mới thì phải đổi task cũ ra ạ.', type: 'neutral' },
        { text: '🙈 ...(Giả vờ đeo tai nghe không nghe thấy)...', type: 'deflect_blame' }
      ]
    }
  ],
  dev_minh: [
    {
      id: 'conflict_drama',
      speaker: 'Senior Dev Minh',
      text: 'Này em, em vừa push code đè mất commit sửa bug của anh trên nhánh chung kìa! Git log đang báo conflict tùm lum.',
      emotion: 'annoyed',
      choices: [
        { text: '🙇 Em xin lỗi anh nhiều! Em revert lại ngay và sang nhờ anh chỉ cách merge chuẩn.', type: 'responsible' },
        { text: '🤔 Em bấm git push --force theo hướng dẫn trên mạng mà, sao lại thế được nhỉ?', type: 'deflect_blame' }
      ]
    }
  ],
  qa_trang: [
    {
      id: 'qa_reject_ch2',
      speaker: 'QA Lead Trang',
      text: 'Ticket của em chị vừa bấm Reject rồi nhé! Test trên môi trường Staging click 2 lần liên tục là văng lỗi 500.',
      emotion: 'smirk',
      choices: [
        { text: '🔍 Em nhận lỗi, để em lấy log tái hiện lại và fix ngay ạ.', type: 'responsible' },
        { text: '🙄 Ơ trên máy em chạy bình thường mà chị?', type: 'deflect_blame' }
      ]
    }
  ]
};
