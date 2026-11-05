export const BACKEND_MINIGAME_CONTENT = {
  apiPipeline: {
    correctOrder: ['validateInput', 'authenticateToken', 'queryDatabase', 'sanitizeOutput', 'sendResponse'],
    nodes: [
      { id: 'queryDatabase', name: '3. Query Database (PostgreSQL)', desc: 'Truy vấn thông tin user từ DB' },
      { id: 'sendResponse', name: '5. Send 200 OK Response', desc: 'Trả JSON về cho Client' },
      { id: 'validateInput', name: '1. Validate Request Body', desc: 'Kiểm tra schema và sanitize input' },
      { id: 'sanitizeOutput', name: '4. Sanitize Output Data', desc: 'Ẩn password hash và token nhạy cảm' },
      { id: 'authenticateToken', name: '2. Authenticate JWT Bearer', desc: 'Xác thực token người dùng' }
    ]
  },
  logDetective: {
    targetLineId: 42,
    targetSnippet: 'FATAL: deadlock detected on transaction 10928 between process 412 and 415 on table tbl_order'
  }
};
