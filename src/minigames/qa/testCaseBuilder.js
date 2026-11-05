import { QA_MINIGAME_CONTENT } from '../../data/minigameContent/qa.js';

export class TestCaseBuilderMinigame {
  constructor(options = {}) {
    this.cases = options.cases || QA_MINIGAME_CONTENT.testCaseBuilder.cases;
    this.userPlacements = new Map(); // caseId -> category
  }

  placeCase(caseId, category) {
    this.userPlacements.set(caseId, category);
  }

  checkCompletion() {
    let score = 0;
    const maxScore = this.cases.length;

    for (const c of this.cases) {
      if (this.userPlacements.get(c.id) === c.expectedCategory) {
        score += 1;
      }
    }

    return {
      score,
      maxScore,
      completed: score === maxScore
    };
  }

  renderDOM() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col bg-slate-950 text-slate-200 p-3 select-none font-sans text-xs';

    container.innerHTML = `
      <div class="mb-2 p-2 bg-indigo-950/40 border border-indigo-800 rounded-lg">
        <span class="font-bold text-indigo-400">📋 Phân loại Test Case vào đúng nhóm:</span>
        <span class="text-slate-400 text-[11px] block">Chọn từng test case và gán vào nhóm thích hợp (Happy Path, Negative, Boundary, Security).</span>
      </div>

      <!-- Test Cases List -->
      <div class="space-y-1.5 mb-3">
        ${this.cases.map((c) => `
          <div class="p-2 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
            <span class="text-xs text-slate-200">${c.text}</span>
            <select class="qa-select-cat bg-slate-800 border border-slate-700 text-indigo-300 rounded px-2 py-1 text-xs outline-none" data-id="${c.id}">
              <option value="">-- Chọn loại Test --</option>
              <option value="happy_path">Happy Path (Kịch bản chuẩn)</option>
              <option value="negative">Negative (Trường hợp sai/lỗi)</option>
              <option value="boundary">Boundary (Giá trị biên)</option>
              <option value="security">Security (Bảo mật/Tấn công)</option>
            </select>
          </div>
        `).join('')}
      </div>

      <div class="flex-1"></div>

      <div class="flex justify-end">
        <button id="btn-submit-tc" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow transition">
          Nộp bài Test Matrix ✔
        </button>
      </div>
    `;

    return container;
  }

  bindEvents(containerEl, onComplete) {
    if (!containerEl) return;
    const selects = containerEl.querySelectorAll('.qa-select-cat');
    const submitBtn = containerEl.querySelector('#btn-submit-tc');

    selects.forEach((sel) => {
      sel.addEventListener('change', () => {
        const id = sel.getAttribute('data-id');
        this.placeCase(id, sel.value);
      });
    });

    submitBtn?.addEventListener('click', () => {
      const res = this.checkCompletion();
      if (onComplete) onComplete(res);
    });
  }
}
