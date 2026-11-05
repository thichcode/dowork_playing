import { DEVOPS_MINIGAME_CONTENT } from '../../data/minigameContent/devops.js';

export class IncidentCommanderMinigame {
  constructor(options = {}) {
    this.steps = options.steps || DEVOPS_MINIGAME_CONTENT.incidentCommander.steps;
    this.expectedOrder = ['acknowledge', 'check_logs', 'root_cause', 'rollback', 'post_mortem'];
    this.completedSteps = [];
  }

  executeStep(stepId) {
    const nextExpected = this.expectedOrder[this.completedSteps.length];
    if (stepId === nextExpected) {
      this.completedSteps.push(stepId);
      return { success: true, stepIndex: this.completedSteps.length };
    }
    return { success: false, expected: nextExpected };
  }

  checkCompletion() {
    const isSuccess = this.completedSteps.length === this.expectedOrder.length;
    return {
      score: this.completedSteps.length,
      maxScore: this.expectedOrder.length,
      completed: isSuccess
    };
  }

  renderDOM() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col bg-slate-950 text-slate-200 p-3 select-none font-sans text-xs';

    container.innerHTML = `
      <div class="mb-2 p-2 bg-rose-950/60 border border-rose-800 rounded-lg flex items-center justify-between">
        <div>
          <span class="font-bold text-rose-400">🚨 SỰ CỐ PRODUCTION: SẬP TOÀN BỘ SERVICE!</span>
          <span class="text-slate-300 text-[11px] block">Thực hiện đúng quy trình ứng cứu sự cố 5 bước chuẩn quốc tế SRE.</span>
        </div>
        <div class="text-xs font-mono font-bold text-amber-400">Tiến độ: <span id="incident-prog">0</span>/5</div>
      </div>

      <div class="flex-1 flex flex-col justify-center space-y-2 max-w-md mx-auto w-full">
        ${this.steps.map((s) => `
          <button class="incident-step-btn w-full py-2.5 px-3 bg-slate-900 hover:bg-indigo-900 border border-slate-700 rounded-lg text-left text-xs font-semibold text-slate-200 transition flex items-center justify-between" data-id="${s.id}">
            <span>${s.title}</span>
            <span class="step-status text-[10px] text-slate-500 font-mono">Chờ thực hiện</span>
          </button>
        `).join('')}
      </div>

      <div class="mt-2 flex justify-end">
        <button id="btn-submit-incident" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow transition">
          Xác nhận Hoàn tất Ứng Cứu ✔
        </button>
      </div>
    `;

    return container;
  }

  bindEvents(containerEl, onComplete) {
    if (!containerEl) return;
    const btns = containerEl.querySelectorAll('.incident-step-btn');
    const progEl = containerEl.querySelector('#incident-prog');
    const submitBtn = containerEl.querySelector('#btn-submit-incident');

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const res = this.executeStep(id);
        if (res.success) {
          btn.classList.remove('bg-slate-900', 'border-slate-700');
          btn.classList.add('bg-emerald-950/80', 'border-emerald-500', 'pointer-events-none');
          const status = btn.querySelector('.step-status');
          if (status) {
            status.textContent = '✓ ĐÃ XONG';
            status.className = 'step-status text-[10px] text-emerald-400 font-bold';
          }
          if (progEl) progEl.textContent = this.completedSteps.length;
        } else {
          alert('Sai thứ tự quy trình ứng cứu! Hãy làm theo trình tự từ Acknowledge -> Check Logs -> Root Cause -> Rollback -> Post-mortem.');
        }
      });
    });

    submitBtn?.addEventListener('click', () => {
      const res = this.checkCompletion();
      if (onComplete) onComplete(res);
    });
  }
}
