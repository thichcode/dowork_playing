import { DEVOPS_MINIGAME_CONTENT } from '../../data/minigameContent/devops.js';

export class YamlSurgeonMinigame {
  constructor(options = {}) {
    this.content = options.content || DEVOPS_MINIGAME_CONTENT.yamlSurgeon;
    this.currentYaml = this.content.initialBrokenYaml;
  }

  validateYaml(yamlString) {
    // 1. Must NOT contain tab character \t
    const hasTabs = /\t/.test(yamlString);
    // 2. Must contain properly indented build and test steps
    const hasBuild = /run:\s*npm run build/.test(yamlString);
    const hasTest = /run:\s*npm test/.test(yamlString);
    const hasCorrectIndent = /^\s{2}-\s*name:/m.test(yamlString);

    const completed = !hasTabs && hasBuild && hasTest && hasCorrectIndent;
    return {
      score: completed ? 1 : 0,
      maxScore: 1,
      completed
    };
  }

  checkCompletion() {
    return this.validateYaml(this.currentYaml);
  }

  renderDOM() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col bg-slate-950 text-slate-200 p-3 select-none font-sans text-xs';

    container.innerHTML = `
      <div class="mb-2 p-2 bg-indigo-950/40 border border-indigo-800 rounded-lg">
        <span class="font-bold text-indigo-400">🔧 Phẫu thuật YAML: Sửa lỗi thụt lề Tab vs Space:</span>
        <span class="text-slate-400 text-[11px] block">Xóa sạch các ký tự Tab (\\t), thay bằng 2 spaces thụt lề chuẩn để pipeline CI/CD xanh lại!</span>
      </div>

      <div class="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono">
        <div class="text-[10px] text-slate-400 mb-1 font-bold">.github/workflows/deploy.yml</div>
        <textarea id="yaml-textarea" class="flex-1 bg-slate-950 p-2 font-mono text-xs text-emerald-400 border border-slate-800 rounded resize-none outline-none leading-relaxed" spellcheck="false">${this.currentYaml}</textarea>
      </div>

      <div class="mt-2 flex justify-between items-center">
        <button id="btn-auto-untab" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition">
          🪄 Thay tất cả Tab bằng 2 Spaces
        </button>
        <button id="btn-submit-yaml" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow transition">
          Verify & Trigger CI Pipeline ✔
        </button>
      </div>
    `;

    return container;
  }

  bindEvents(containerEl, onComplete) {
    if (!containerEl) return;
    const textarea = containerEl.querySelector('#yaml-textarea');
    const autoUntabBtn = containerEl.querySelector('#btn-auto-untab');
    const submitBtn = containerEl.querySelector('#btn-submit-yaml');

    textarea?.addEventListener('input', () => {
      this.currentYaml = textarea.value;
    });

    autoUntabBtn?.addEventListener('click', () => {
      textarea.value = textarea.value.replace(/\t/g, '  ');
      this.currentYaml = textarea.value;
    });

    submitBtn?.addEventListener('click', () => {
      this.currentYaml = textarea.value;
      const res = this.validateYaml(this.currentYaml);
      if (onComplete) onComplete(res);
    });
  }
}
