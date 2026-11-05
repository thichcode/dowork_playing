export const QA_MINIGAME_CONTENT = {
  bugSpotter: {
    bugs: [
      { id: 'neg_qty', name: 'Số lượng sản phẩm nhập được số âm (-5)' },
      { id: 'cart_overflow', name: 'Nhập 999999999 làm tràn layout tổng tiền' },
      { id: 'btn_no_action', name: 'Nút "Áp dụng mã giảm giá" click không phản hồi' },
      { id: 'xss_name', name: 'Ô tên người nhận hiển thị thẻ <script> không bị escape' },
      { id: 'zero_checkout', name: 'Bấm Thanh toán khi giỏ hàng 0 đồng vẫn thành công' }
    ]
  },
  testCaseBuilder: {
    cases: [
      { id: 'tc_valid_login', text: 'Nhập đúng username & password hợp lệ', expectedCategory: 'happy_path' },
      { id: 'tc_empty_pass', text: 'Để trống mật khẩu và bấm Đăng nhập', expectedCategory: 'negative' },
      { id: 'tc_boundary_len', text: 'Nhập mật khẩu đúng 8 ký tự (giới hạn tối thiểu)', expectedCategory: 'boundary' },
      { id: 'tc_sqli_attack', text: "Nhập payload ' OR 1=1; -- vào ô username", expectedCategory: 'security' }
    ]
  }
};
