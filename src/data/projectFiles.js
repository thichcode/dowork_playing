export const PROJECT_FILES = {
  name: 'projectx',
  type: 'folder',
  children: [
    {
      name: '.github',
      type: 'folder',
      children: [
        {
          name: 'workflows',
          type: 'folder',
          children: [
            {
              name: 'deploy.yml',
              type: 'file',
              ext: 'yml',
              content: `name: Production CI/CD\non:\n  push:\n    branches: [ master ]\n\njobs:\n  build-and-deploy:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v3\n    - name: Setup Node\n      uses: actions/setup-node@v3\n      with:\n        node-version: 18\n    - name: Install & Test\n      run: npm ci && npm test\n`
            }
          ]
        }
      ]
    },
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          type: 'folder',
          children: [
            {
              name: 'LoginForm.css',
              type: 'file',
              ext: 'css',
              content: `.login-card {\n  display: flex;\n  flex-direction: column;\n  padding: 24px;\n  border-radius: 12px;\n  background: #1e293b;\n}\n\n.btn-submit {\n  margin-top: 16px;\n  background-color: #6366f1;\n  color: #ffffff;\n  padding: 8px 16px;\n  border-radius: 6px;\n}\n`
            },
            {
              name: 'LoginForm.jsx',
              type: 'file',
              ext: 'js',
              content: `export function LoginForm() {\n  return (\n    <div className="login-card">\n      <h2>MegaSoft ProjectX</h2>\n      <input type="text" placeholder="Username" />\n      <input type="password" placeholder="Password" />\n      <button className="btn-submit">Đăng nhập</button>\n    </div>\n  );\n}\n`
            }
          ]
        },
        {
          name: 'api',
          type: 'folder',
          children: [
            {
              name: 'server.js',
              type: 'file',
              ext: 'js',
              content: `import express from 'express';\nconst app = express();\n\napp.get('/api/health', (req, res) => {\n  res.json({ status: 'healthy', uptime: process.uptime() });\n});\n\napp.listen(8080, () => console.log('Server running on port 8080'));\n`
            }
          ]
        }
      ]
    },
    {
      name: 'package.json',
      type: 'file',
      ext: 'json',
      content: `{\n  "name": "projectx-saas",\n  "version": "2.4.0",\n  "private": true,\n  "scripts": {\n    "build": "vite build",\n    "test": "vitest run"\n  }\n}\n`
    },
    {
      name: 'README.md',
      type: 'file',
      ext: 'md',
      content: `# ProjectX Core\nHệ thống SaaS quản lý doanh nghiệp nội bộ của MegaSoft Corp.\n\n## Hướng dẫn Dev mới\n- Đọc kỹ Jira ticket được giao\n- Chạy kiểm thử trước khi tạo Pull Request\n- Không push --force vào master!\n`
    }
  ]
};
