import { BACKEND_MINIGAME_CONTENT } from '../../data/minigameContent/backend.js';

export class ApiPipelineMinigame {
  constructor(options = {}) {
    this.content = options.content || BACKEND_MINIGAME_CONTENT.apiPipeline;
    this.userOrder = [];
  }

  validateOrder(order = this.userOrder) {
    const correct = this.content.correctOrder;
    let score = 0;
    const maxScore = correct.length;

    for (let i = 0; i < correct.length; i++) {
      if (order[i] === correct[i]) {
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
    return this.validateOrder(this.userOrder);
  }

  renderDOM() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col bg-slate-950 text-slate-200 p-3 select-none font-sans';

    container.innerHTML = `
      <div class="mb-3 p-2 bg-indigo-950/40 border border-indigo-800 rounded-lg text-xs">
        <span class="font-bold text-indigo-400">⚙️ Sắp xếp đúng trình tự xử lý API:</span>
        <span class="text-slate-400 text-[11px] block">Click chọn các bước bên dưới theo đúng thứ tự từ Request đến Response.</span>
      </div>

      <!-- Pipeline Slots -->
      <div class="flex-1 flex flex-col justify-center space-y-2 max-w-lg mx-auto w-full">
        <div id="pipeline-slots" class="space-y-1.5">
          ${[0, 1, 2, 3, 4].map((i) => `
            <div class="slot-box h-9 bg-slate-900 border border-dashed border-slate-700 rounded-lg flex items-center px-3 text-xs text-slate-500 font-mono" data-slot="${i}">
              Bước ${i + 1}: (Trống)
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Node Choices -->
      <div class="mt-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
        <div class="text-[10px] text-slate-400 font-mono mb-2 font-bold uppercase">Các bước xử lý khả dụng (Click để chọn vào slot):</div>
        <div id="pipeline-nodes" class="flex flex-wrap gap-2">
          ${this.content.nodes.map((node) => `
            <button class="node-btn px-2.5 py-1.5 bg-slate-800 hover:bg-indigo-900/60 border border-slate-700 hover:border-indigo-500 rounded text-xs text-slate-200 font-medium transition" data-id="${node.id}">
              ${node.name}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="mt-3 flex justify-between items-center">
        <button id="btn-reset-pipeline" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition">
          ↺ Chọn lại
        </button>
        <button id="btn-submit-pipeline" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow transition">
          Xác nhận nộp Pipeline ✔
        </button>
      </div>
    `;

    return container;
  }

  bindEvents(containerEl, onComplete) {
    if (!containerEl) return;
    const nodeBtns = containerEl.querySelectorAll('.node-btn');
    const slotBoxes = containerEl.querySelectorAll('.slot-box');
    const resetBtn = containerEl.querySelector('#btn-reset-pipeline');
    const submitBtn = containerEl.querySelector('#btn-submit-pipeline');

    nodeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.userOrder.length >= 5) return;
        const id = btn.getAttribute('data-id');
        if (this.userOrder.includes(id)) return;

        this.userOrder.push(id);
        btn.classList.add('opacity-40', 'pointer-events-none');

        const currentSlotIdx = this.userOrder.length - 1;
        const slotEl = slotBoxes[currentSlotIdx];
        if (slotEl) {
          slotEl.className = 'slot-box h-9 bg-indigo-950/60 border border-indigo-500 rounded-lg flex items-center px-3 text-xs text-indigo-300 font-semibold';
          slotEl.textContent = `Bước ${currentSlotIdx + 1}: ${btn.textContent.trim()}`;
        }
      });
    });

    resetBtn?.addEventListener('click', () => {
      this.userOrder = [];
      nodeBtns.forEach((btn) => btn.classList.remove('opacity-40', 'pointer-events-none'));
      slotBoxes.forEach((slot, i) => {
        slot.className = 'slot-box h-9 bg-slate-900 border border-dashed border-slate-700 rounded-lg flex items-center px-3 text-xs text-slate-500 font-mono';
        slot.textContent = `Bước ${i + 1}: (Trống)`;
      });
    });

    submitBtn?.addEventListener('click', () => {
      const res = this.validateOrder();
      if (onComplete) onComplete(res);
    });
  }
}
