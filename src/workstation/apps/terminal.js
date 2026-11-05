import { globalEventBus } from '../../core/eventBus.js';
import { globalGameState } from '../../core/gameState.js';
import { globalWindowManager } from '../windowManager.js';

export class TerminalApp {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.gameState = options.gameState || globalGameState;
    this.windowManager = options.windowManager || globalWindowManager;
    this.history = [];
    this.historyIndex = -1;
    this.commandWhitelist = [
      'help',
      'clear',
      'ls',
      'pwd',
      'whoami',
      'git status',
      'git log',
      'git diff',
      'git branch',
      'git revert HEAD',
      'npm test',
      'npm run build',
      'docker ps',
      'docker logs projectx-api',
      'kubectl get pods',
      'kubectl rollout restart deploy/api'
    ];
  }

  open() {
    const win = this.windowManager.createWindow({
      id: 'terminal',
      title: '💻 Bash Terminal — megasoft@dev:~',
      width: 600,
      height: 380
    });

    win.setContent(this.renderDOM());
    this.bindEvents(win.bodyEl);
    return win;
  }

  getAutocompleteMatches(prefix) {
    if (!prefix) return [];
    const p = prefix.trim().toLowerCase();
    return this.commandWhitelist.filter((cmd) => cmd.toLowerCase().startsWith(p));
  }

  executeCommand(rawCmd) {
    const cmd = rawCmd.trim();
    if (!cmd) return '';

    if (cmd === 'clear') {
      return '__CLEAR__';
    }

    if (cmd === 'help') {
      return `MegaSoft Dev Bash Terminal v4.2\nCác lệnh khả dụng:\n  git <status|log|diff|branch|revert HEAD>\n  npm <test|run build>\n  docker <ps|logs projectx-api>\n  kubectl <get pods|rollout restart>\n  ls, pwd, whoami, clear, help`;
    }

    if (cmd === 'pwd') {
      return '/home/developer/workspace/projectx';
    }

    if (cmd === 'whoami') {
      return this.gameState.get('player.name') || 'developer';
    }

    if (cmd === 'ls') {
      return 'src/  .github/  package.json  README.md  node_modules/';
    }

    if (cmd === 'git status') {
      return `On branch feature/sprint-task\nYour branch is up to date with 'origin/feature/sprint-task'.\n\nChanges not staged for commit:\n  modified: src/components/LoginForm.css\n\nno changes added to commit (use "git add" to track)`;
    }

    if (cmd === 'git log') {
      return `commit f4b81c2 (HEAD -> feature/sprint-task)\nAuthor: Senior Dev Minh <minh.dev@megasoft.corp>\nDate:   Today\n\n    feat: integrate core auth service\n\ncommit 9a102d1\nAuthor: Tân Binh IT\nDate:   Yesterday\n\n    docs: update readme with onboarding checklist`;
    }

    if (cmd === 'git diff') {
      return `diff --git a/src/components/LoginForm.css b/src/components/LoginForm.css\n--- a/src/components/LoginForm.css\n+++ b/src/components/LoginForm.css\n@@ -8,3 +8,3 @@\n-  margin-top: -30px; /* BUG: layout overlap */\n+  margin-top: 16px;`;
    }

    if (cmd === 'git branch') {
      return `* feature/sprint-task\n  master\n  staging`;
    }

    if (cmd === 'git revert HEAD') {
      this.eventBus.emit('terminal:git-revert');
      return `[feature/sprint-task 8a31e0f] Revert "feat: buggy commit"\n 1 file changed, 1 insertion(+), 1 deletion(-)`;
    }

    if (cmd === 'npm test') {
      return `> projectx-saas@2.4.0 test\n> vitest run\n\n ✓ tests/auth.test.js (4 tests)\n ✓ tests/api.test.js (8 tests)\n\n Test Files  2 passed (2)\n      Tests  12 passed (12)\n   Duration  412ms`;
    }

    if (cmd === 'npm run build') {
      return `> projectx-saas@2.4.0 build\n> vite build\n\nvite v5.2.0 building for production...\n✓ 42 modules transformed.\ndist/index.html   0.84 kB\ndist/assets/index.js   48.21 kB\n✓ built in 184ms`;
    }

    if (cmd === 'docker ps') {
      return `CONTAINER ID   IMAGE                COMMAND                  STATUS         PORTS\n3a81f9b012c4   projectx-api:latest  "docker-entrypoint.s…"   Up 4 hours     0.0.0.0:8080->8080/tcp\n9b418cd031f1   postgres:15-alpine   "docker-entrypoint.s…"   Up 4 hours     0.0.0.0:5432->5432/tcp`;
    }

    if (cmd === 'docker logs projectx-api') {
      return `[INFO] 2026-11-05 09:00:01 Server started on port 8080\n[INFO] 2026-11-05 09:01:23 DB Pool connection established (10/10)\n[WARN] 2026-11-05 09:15:42 High memory usage detected: 82% heap`;
    }

    if (cmd === 'kubectl get pods') {
      return `NAME                             READY   STATUS    RESTARTS   AGE\nprojectx-api-79b8f6c49-x2p4l     1/1     Running   0          2d\nprojectx-web-54b9d79c6-8jkm1     1/1     Running   0          2d\nprojectx-db-0                    1/1     Running   0          5d`;
    }

    if (cmd === 'kubectl rollout restart deploy/api') {
      return `deployment.apps/projectx-api restarted\npod "projectx-api-79b8f6c49-x2p4l" terminating...\npod "projectx-api-79b8f6c49-v9ql2" created and ready.`;
    }

    return `bash: ${cmd}: command not found. Gõ 'help' để xem danh sách lệnh được hỗ trợ.`;
  }

  renderDOM() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col bg-slate-950 text-emerald-400 font-mono text-xs select-text p-3';

    container.innerHTML = `
      <div id="term-output" class="flex-1 overflow-y-auto space-y-1 pr-1 leading-relaxed">
        <div class="text-slate-400 font-bold mb-2">MegaSoft Internal Dev Terminal [bash 5.2]</div>
        <div class="text-slate-500 text-[11px] mb-2">Gõ <span class="text-emerald-300">help</span> để xem các lệnh hỗ trợ. Nhấn <span class="text-emerald-300">Tab</span> để tự động hoàn thành lệnh.</div>
      </div>
      <div class="flex items-center pt-2 border-t border-slate-800 text-slate-300">
        <span class="text-emerald-500 font-bold mr-2">megasoft@dev:~$</span>
        <input type="text" id="term-input" class="flex-1 bg-transparent border-none outline-none text-emerald-300 font-mono text-xs" autocomplete="off" autofocus>
      </div>
    `;

    return container;
  }

  bindEvents(bodyEl) {
    if (!bodyEl) return;
    const input = bodyEl.querySelector('#term-input');
    const output = bodyEl.querySelector('#term-output');

    if (!input || !output) return;

    input.addEventListener('keydown', (e) => {
      // Tab Autocomplete
      if (e.key === 'Tab') {
        e.preventDefault();
        const matches = this.getAutocompleteMatches(input.value);
        if (matches.length === 1) {
          input.value = matches[0];
        } else if (matches.length > 1) {
          const line = document.createElement('div');
          line.className = 'text-slate-400 text-[11px] my-1';
          line.textContent = matches.join('   ');
          output.appendChild(line);
          output.scrollTop = output.scrollHeight;
        }
        return;
      }

      // Enter Command
      if (e.key === 'Enter') {
        const cmd = input.value.trim();
        input.value = '';
        if (!cmd) return;

        this.history.push(cmd);
        this.historyIndex = this.history.length;

        // Print command echo
        const cmdEcho = document.createElement('div');
        cmdEcho.className = 'text-slate-300 font-bold mt-1';
        cmdEcho.innerHTML = `<span class="text-emerald-500">megasoft@dev:~$</span> ${cmd}`;
        output.appendChild(cmdEcho);

        const result = this.executeCommand(cmd);
        if (result === '__CLEAR__') {
          output.innerHTML = '';
        } else if (result) {
          const resEl = document.createElement('div');
          resEl.className = 'text-slate-300 whitespace-pre-wrap pl-2 border-l border-slate-700/60 my-1';
          resEl.textContent = result;
          output.appendChild(resEl);
        }

        output.scrollTop = output.scrollHeight;
      }
    });
  }
}

export const globalTerminalApp = new TerminalApp();
