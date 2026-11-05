import { QA_MINIGAME_CONTENT } from '../../data/minigameContent/qa.js';

export class BugSpotterMinigame {
  constructor(options = {}) {
    this.bugs = options.bugs || QA_MINIGAME_CONTENT.bugSpotter.bugs;
    this.foundBugs = new Set();
  }

  spotBug(id) {
    if (this.bugs.some((b) => b.id === id)) {
      this.foundBugs.add(id);
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
    container.className = 'w-full h-full flex flex-col bg-slate-950 text-slate-200 p-3 select-none font-sans text-xs';

    container.innerHTML = `
      <div class="mb-2 p-2 bg-indigo-950/40 border border-indigo-800 rounded-lg flex justify-between items-center">
        <div>
          <span class="font-bold text-indigo-400">🔍 Bắt 5 Bug nghiệp vụ trong Giỏ hàng:</span>
          <span class="text-slate-400 text-[11px] block">Tương tác và click vào các chức năng bị lỗi để phát hiện bug!</span>
        </div>
        <div class="font-mono text-sm font-bold text-amber-400">Đã bắt: <span id="qa-spot-count">0</span>/5</div>
      </div>

      <!-- Fake Cart Page -->
      <div class="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-4 max-w-lg mx-auto w-full space-y-3">
        <!-- Product Item -->
        <div class="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
          <div>
            <div class="font-bold text-slate-200">Gói Bản Quyền MegaSoft SaaS Pro</div>
            <div class="text-[10px] text-slate-400">Đơn giá: $99/tháng</div>
          </div>
          <!-- Bug 1: Negative Quantity input allowed -->
          <div class="flex items-center space-x-2">
            <span class="text-[11px] text-slate-400">SL:</span>
            <input type="number" id="cart-qty" value="-5" class="qa-bug-input w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-center text-xs text-rose-400" data-bug="neg_qty">
          </div>
        </div>

        <!-- Coupon Code Area -->
        <div class="p-3 bg-slate-950 border border-slate-800 rounded-lg flex space-x-2">
          <input type="text" placeholder="Nhập mã giảm giá..." class="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs">
          <!-- Bug 3: Button does nothing -->
          <button id="btn-apply-coupon" class="qa-bug-btn px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs" data-bug="btn_no_action">
            Áp dụng
          </button>
        </div>

        <!-- Shipping Info & XSS -->
        <div class="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
          <div class="text-[11px] font-bold text-slate-300">Thông tin nhận hóa đơn:</div>
          <!-- Bug 4: XSS name unescaped -->
          <div class="qa-bug-xss cursor-pointer p-1.5 bg-slate-800 rounded text-rose-300 font-mono text-[10px]" data-bug="xss_name">
            Tên: &lt;script&gt;alert('Hacked')&lt;/script&gt; (Click để báo lỗi)
          </div>
        </div>

        <!-- Total Price Overflow -->
        <!-- Bug 2: Layout overflow -->
        <div class="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
          <span class="font-bold">Tổng thanh toán:</span>
          <span class="qa-bug-overflow cursor-pointer font-mono font-bold text-rose-400 text-sm" data-bug="cart_overflow">
            -$999,999,999,999.00 USD
          </span>
        </div>

        <!-- Checkout Button -->
        <!-- Bug 5: Zero checkout allowed -->
        <button id="btn-checkout-zero" class="qa-bug-checkout w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs shadow" data-bug="zero_checkout">
          Thanh Toán Ngay ($0.00)
        </button>
      </div>

      <div class="mt-2 flex justify-end">
        <button id="btn-submit-spotter" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow transition">
          Nộp báo cáo Bug QA ✔
        </button>
      </div>
    `;

    return container;
  }

  bindEvents(containerEl, onComplete) {
    if (!containerEl) return;
    const countEl = containerEl.querySelector('#qa-spot-count');
    const submitBtn = containerEl.querySelector('#btn-submit-spotter');

    const handleFound = (bugId, targetEl) => {
      this.spotBug(bugId);
      targetEl.classList.add('ring-2', 'ring-emerald-500');
      if (countEl) countEl.textContent = this.foundBugs.size;
    };

    containerEl.querySelectorAll('[data-bug]').forEach((el) => {
      el.addEventListener('click', () => {
        const bugId = el.getAttribute('data-bug');
        handleFound(bugId, el);
      });
    });

    submitBtn?.addEventListener('click', () => {
      const res = this.checkCompletion();
      if (onComplete) onComplete(res);
    });
  }
}
