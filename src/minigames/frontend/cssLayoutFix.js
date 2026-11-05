import { FRONTEND_MINIGAME_CONTENT } from '../../data/minigameContent/frontend.js';

export class CssLayoutFixMinigame {
  constructor(options = {}) {
    this.content = options.content || FRONTEND_MINIGAME_CONTENT.cssLayoutFix;
    this.currentCSS = this.content.initialBrokenCSS;
  }

  validateCSS(cssString) {
    let score = 0;
    const reqs = this.content.targetRequirements;
    const maxScore = reqs.length;

    for (const req of reqs) {
      if (req.pattern.test(cssString)) {
        score += 1;
      }
    }

    return {
      score,
      maxScore,
      completed: score === maxScore
    };
  }

  checkCompletion() {
    return this.validateCSS(this.currentCSS);
  }

  renderDOM() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col bg-slate-950 text-slate-200 p-3 select-none font-sans';

    container.innerHTML = `
      <div class="mb-3 p-2 bg-indigo-950/40 border border-indigo-800 rounded-lg text-xs">
        <div class="font-bold text-indigo-400 mb-1">🎯 Mục tiêu nhiệm vụ:</div>
        <ul class="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
          <li>Bỏ margin-top âm (-30px) đổi thành số dương (ví dụ: 16px)</li>
          <li>Đổi <code class="text-amber-300">display: block</code> thành <code class="text-amber-300">display: flex</code></li>
          <li>Thêm <code class="text-amber-300">justify-content: center</code></li>
        </ul>
      </div>

      <div class="flex-1 flex space-x-3 overflow-hidden">
        <!-- Editor Left -->
        <div class="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-lg p-2">
          <div class="text-[10px] text-slate-400 font-mono mb-1 font-bold">LoginForm.css (Chỉnh sửa tại đây)</div>
          <textarea id="css-fix-textarea" class="flex-1 bg-slate-950 p-2 font-mono text-xs text-emerald-400 border border-slate-800 rounded resize-none outline-none leading-relaxed">${this.currentCSS}</textarea>
        </div>

        <!-- Preview Right -->
        <div class="w-64 bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col items-center justify-center">
          <div class="text-[10px] text-slate-400 font-mono mb-2">Live Render Mockup</div>
          <div id="css-preview-box" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-center">
            <div class="text-xs font-bold text-indigo-400 mb-2">MegaSoft ProjectX</div>
            <div class="h-6 bg-slate-800 rounded mb-1.5"></div>
            <div class="h-6 bg-slate-800 rounded mb-2"></div>
            <button id="css-preview-btn" class="w-full py-1 bg-indigo-600 text-white text-[10px] rounded font-semibold">Đăng nhập</button>
          </div>
        </div>
      </div>

      <div class="mt-3 flex justify-end space-x-2">
        <button id="btn-submit-css" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow transition">
          Nộp bài kiểm tra ✔
        </button>
      </div>
    `;

    return container;
  }

  bindEvents(containerEl, onComplete) {
    if (!containerEl) return;
    const textarea = containerEl.querySelector('#css-fix-textarea');
    const submitBtn = containerEl.querySelector('#btn-submit-css');

    textarea?.addEventListener('input', () => {
      this.currentCSS = textarea.value;
    });

    submitBtn?.addEventListener('click', () => {
      this.currentCSS = textarea.value;
      const result = this.validateCSS(this.currentCSS);
      if (onComplete) onComplete(result);
    });
  }
}
