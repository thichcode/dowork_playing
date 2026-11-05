export const DEVOPS_MINIGAME_CONTENT = {
  yamlSurgeon: {
    initialBrokenYaml: `steps:\n\t- name: Build\n\t  run: npm run build\n  - name: Test\n\t  run: npm test`,
    errorCount: 3
  },
  incidentCommander: {
    steps: [
      { id: 'acknowledge', title: '1. Acknowledge Alert (Nhận thông báo sự cố)' },
      { id: 'check_logs', title: '2. Check Logs & Metrics (Kiểm tra log lỗi 500)' },
      { id: 'root_cause', title: '3. Identify Root Cause (Xác định commit lỗi)' },
      { id: 'rollback', title: '4. Rollback to Stable Release (Quay lại bản an toàn)' },
      { id: 'post_mortem', title: '5. Write Post-Mortem Report (Viết báo cáo nguyên nhân)' }
    ]
  }
};
