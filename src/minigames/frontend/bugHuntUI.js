import { FRONTEND_MINIGAME_CONTENT } from '../../data/minigameContent/frontend.js';

export class BugHuntUIMinigame {
  constructor(options = {}) {
    this.bugs = options.bugs || FRONTEND_MINIGAME_CONTENT.bugHuntUI.bugs;
    this.foundBugs = new Set();
  }

  registerClick(bugId) {
    if (this.bugs.some((b) => b.id === bugId)) {
      this.foundBugs.add(bugId);
    }
  }

  checkCompletion() {
    return {
      score: this.foundBugs.size,
      maxScore: this.bugs.length,
      completed: this.foundBugs.size === this.bugs.length
    };
  }

  renderDOM() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col bg-slate-950 text-slate-200 p-3 select-none font-sans';

    container.innerHTML = `
      <div class="mb-3 p-2 bg-indigo-950/40 border border-indigo-800 rounded-lg text-xs flex justify-between items-center">
        <div>
          <span class="font-bold text-indigo-400">🔍 Tìm 5 điểm sai khác giữa Thiết kế & Thực tế:</span>
          <span class="text-slate-400 text-[11px] block">Click trực tiếp vào các phần tử bị lỗi bên khung 'Thực tế render' để bắt bug!</span>
        </div>
        <div class="text-sm font-mono font-bold text-amber-400">
          Đã bắt: <span id="hunt-score">0</span>/5
        </div>
      </div>

      <div class="flex-1 grid grid-cols-2 gap-3 overflow-hidden">
        <!-- Mockup Left -->
        <div class="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col items-center justify-center">
          <div class="text-[10px] text-emerald-400 font-mono font-bold mb-2">Bản thiết kế Figma Chuẩn (Target)</div>
          <div class="w-64 bg-slate-950 border border-slate-700 rounded-lg p-4 text-center">
            <div class="text-lg font-bold text-indigo-400 mb-2">MegaSoft ProjectX</div>
            <div class="text-xs text-slate-400 mb-3">Đăng nhập tài khoản</div>
            <div class="h-7 bg-slate-800 rounded mb-2 border border-slate-700"></div>
            <div class="h-7 bg-slate-800 rounded mb-3 border border-slate-700 flex items-center justify-end pr-2 text-slate-400">🔒</div>
            <button class="w-full py-1.5 bg-indigo-600 text-white text-xs rounded font-semibold">Đăng nhập</button>
          </div>
        </div>

        <!-- Broken Right -->
        <div class="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col items-center justify-center">
          <div class="text-[10px] text-rose-400 font-mono font-bold mb-2">Thực tế render (Click vào điểm lỗi)</div>
          <div class="w-64 bg-slate-950 border border-slate-700 rounded-lg p-4 text-left">
            <!-- Bug 3: Logo rotated -->
            <div class="bug-target cursor-pointer p-1 rounded hover:ring-2 hover:ring-amber-500" data-bug="3">
              <span class="text-xs text-slate-500 inline-block transform rotate-180">🏢</span>
            </div>
            <!-- Bug 2: Title size too small -->
            <div class="bug-target cursor-pointer p-1 rounded hover:ring-2 hover:ring-amber-500" data-bug="2">
              <div class="text-[10px] text-slate-400 mb-1">MegaSoft ProjectX</div>
            </div>
            <!-- Bug 5: Padding skewed -->
            <div class="bug-target cursor-pointer p-1 rounded hover:ring-2 hover:ring-amber-500" data-bug="5">
              <div class="text-xs text-slate-500 mb-2">Đăng nhập</div>
            </div>
            <div class="h-7 bg-slate-800 rounded mb-2 border border-slate-700"></div>
            <!-- Bug 4: Missing lock icon -->
            <div class="bug-target cursor-pointer p-1 rounded hover:ring-2 hover:ring-amber-500" data-bug="4">
              <div class="h-7 bg-slate-800 rounded mb-3 border border-slate-700 flex items-center justify-end pr-2 text-slate-400">❌</div>
            </div>
            <!-- Bug 1: Wrong button color (rose instead of indigo) -->
            <div class="bug-target cursor-pointer p-1 rounded hover:ring-2 hover:ring-amber-500" data-bug="1">
              <button class="w-full py-1.5 bg-rose-600 text-white text-xs rounded font-semibold">Đăng nhập</button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-3 flex justify-end">
        <button id="btn-submit-hunt" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow transition">
          Xác nhận nộp bài ✔
        </button>
      </div>
    `;

    return container;
  }

  bindEvents(containerEl, onComplete) {
    if (!containerEl) return;
    const scoreEl = containerEl.querySelector('#hunt-score');
    const submitBtn = containerEl.querySelector('#btn-submit-hunt');

    containerEl.querySelectorAll('.bug-target').forEach((el) => {
      el.addEventListener('click', () => {
        const bugId = parseInt(el.getAttribute('data-bug'), 10);
        this.registerClick(bugId);
        el.classList.add('bg-emerald-950/80', 'border', 'border-emerald-500');
        if (scoreEl) scoreEl.textContent = this.foundBugs.size;

        if (this.foundBugs.size === this.bugs.length) {
          submitBtn.classList.add('animate-bounce');
        }
      });
    });

    submitBtn?.addEventListener('click', () => {
      const result = this.checkCompletion();
      if (onComplete) onComplete(result);
    });
  }
}
