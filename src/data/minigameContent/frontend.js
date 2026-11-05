export const FRONTEND_MINIGAME_CONTENT = {
  cssLayoutFix: {
    initialBrokenCSS: `/* Sửa lỗi margin-top âm và thêm flexbox justify-center */\n.login-card {\n  display: block;\n  margin-top: -30px;\n  padding: 24px;\n  background: #1e293b;\n  border-radius: 12px;\n}\n\n.btn-submit {\n  background-color: #6366f1;\n  color: white;\n  padding: 8px 16px;\n}`,
    targetRequirements: [
      { rule: 'margin-top', pattern: /margin-top:\s*(?:1[0-9]|2[0-9]|[0-9])px/i, desc: 'Bỏ margin âm (đổi thành >= 0px)' },
      { rule: 'display', pattern: /display:\s*flex/i, desc: 'Chuyển sang display: flex' },
      { rule: 'justify-content', pattern: /justify-content:\s*center/i, desc: 'Căn giữa với justify-content: center' }
    ]
  },
  bugHuntUI: {
    bugs: [
      { id: 1, name: 'Sai màu nút bấm (Đỏ thay vì Xanh)' },
      { id: 2, name: 'Font size tiêu đề quá nhỏ (12px thay vì 24px)' },
      { id: 3, name: 'Logo bị xoay ngược 180 độ' },
      { id: 4, name: 'Thiếu icon ổ khóa bảo mật tại ô Password' },
      { id: 5, name: 'Khoảng cách padding form bị lệch về bên trái' }
    ]
  }
};
