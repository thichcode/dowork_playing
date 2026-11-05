import { BACKEND_MINIGAME_CONTENT } from '../../data/minigameContent/backend.js';

export class LogDetectiveMinigame {
  constructor(options = {}) {
    this.targetLineId = options.targetLineId || BACKEND_MINIGAME_CONTENT.logDetective.targetLineId;
    this.selectedLineId = null;
  }

  selectLine(lineId) {
    this.selectedLineId = lineId;
    return {
      isRootCause: lineId === this.targetLineId
    };
  }

  checkCompletion() {
    const isSuccess = this.selectedLineId === this.targetLineId;
    return {
      score: isSuccess ? 1 : 0,
      maxScore: 1,
      completed: isSuccess
    };
  }

  renderDOM() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col bg-slate-950 text-slate-200 p-3 select-none font-mono text-xs';

    const logs = [];
    for (let i = 1; i <= 60; i++) {
      if (i === 42) {
        logs.push({ id: 42, text: '[2026-11-05 09:18:22] FATAL: deadlock detected on transaction 10928 between process 412 and 415 on table tbl_order', isError: true });
      } else if (i % 7 === 0) {
        logs.push({ id: i, text: `[2026-11-05 09:1${i % 10}:00] WARN: High latency on endpoint /api/v1/metrics (took ${i * 12}ms)`, isError: false });
      } else {
        logs.push({ id: i, text: `[2026-11-05 09:12:${String(i).padStart(2, '0')}] INFO: Handled request ID #${1000 + i} status 200 OK`, isError: false });
      }
    }

    container.innerHTML = `
      <div class="mb-2 p-2 bg-indigo-950/40 border border-indigo-800 rounded-lg text-xs font-sans">
        <span class="font-bold text-indigo-400">🕵️ Cuộn tìm & click chọn dòng log chứa Root Cause sự cố:</span>
        <span class="text-slate-400 text-[11px] block">Gợi ý: Tìm dòng báo lỗi Deadlock / Transaction Lock trên database.</span>
      </div>

      <div class="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2 overflow-y-auto space-y-1 font-mono text-[11px]">
        ${logs.map((l) => `
          <div class="log-line cursor-pointer px-2 py-1 rounded hover:bg-slate-800 transition ${l.isError ? 'text-rose-400 font-bold' : 'text-slate-400'}" data-id="${l.id}">
            ${l.text}
          </div>
        `).join('')}
      </div>

      <div class="mt-2 flex justify-between items-center font-sans">
        <span id="selected-log-preview" class="text-xs text-amber-400 italic">Chưa chọn dòng log nào...</span>
        <button id="btn-submit-log" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow transition">
          Xác nhận Root Cause ✔
        </button>
      </div>
    `;

    return container;
  }

  bindEvents(containerEl, onComplete) {
    if (!containerEl) return;
    const lines = containerEl.querySelectorAll('.log-line');
    const preview = containerEl.querySelector('#selected-log-preview');
    const submitBtn = containerEl.querySelector('#btn-submit-log');

    lines.forEach((l) => {
      l.addEventListener('click', () => {
        lines.forEach((item) => item.classList.remove('bg-indigo-900', 'border-l-4', 'border-indigo-400'));
        l.classList.add('bg-indigo-900', 'border-l-4', 'border-indigo-400');
        const id = parseInt(l.getAttribute('data-id'), 10);
        this.selectLine(id);
        if (preview) preview.textContent = `Đã chọn dòng #${id}`;
      });
    });

    submitBtn?.addEventListener('click', () => {
      const res = this.checkCompletion();
      if (onComplete) onComplete(res);
    });
  }
}
