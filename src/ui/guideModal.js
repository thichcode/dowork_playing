import { globalEventBus } from '../core/eventBus.js';

export class GuideModal {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.container = options.container || (typeof document !== 'undefined' ? document.getElementById('modal-container') : null);
    this._isOpen = false;
  }

  isOpen() {
    return this._isOpen;
  }

  show() {
    this._isOpen = true;
    if (this.container) {
      this.container.classList.remove('hidden');
      this.render();
      this.bindEvents();
    }
    this.eventBus.emit('guide:shown');
  }

  close() {
    this._isOpen = false;
    if (this.container) {
      this.container.classList.add('hidden');
    }
    this.eventBus.emit('guide:closed');
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-2xl w-full shadow-2xl font-sans text-xs text-slate-200 select-none overflow-y-auto max-h-[85vh]">
        <!-- Header -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div class="flex items-center space-x-3">
            <span class="text-2xl">📘</span>
            <div>
              <h3 class="font-bold text-sm text-indigo-400">Cẩm Nang Sống Sót 60 Ngày Thử Việc — MegaSoft Corp</h3>
              <p class="text-[10px] text-slate-400">Tài liệu hướng dẫn nội bộ dành riêng cho Tân Binh IT</p>
            </div>
          </div>
          <button id="btn-close-guide" class="text-slate-400 hover:text-white text-lg px-2">✕</button>
        </div>

        <!-- 4 Survival Stats -->
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div class="font-bold text-emerald-400 flex items-center space-x-1.5 mb-1 text-xs">
              <span>⚡</span>
              <span>Năng Lượng (Energy)</span>
            </div>
            <p class="text-[11px] text-slate-300 leading-relaxed">
              Mỗi ca làm việc tiêu hao năng lượng. Click vào <b class="text-amber-300">Cốc Cà Phê [Phím 1]</b> trên bàn để hồi phục (+15 ⚡). Tối đa 3 cốc/ngày.
            </p>
          </div>

          <div class="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div class="font-bold text-rose-400 flex items-center space-x-1.5 mb-1 text-xs">
              <span>🔥</span>
              <span>Căng Thẳng (Stress)</span>
            </div>
            <p class="text-[11px] text-slate-300 leading-relaxed">
              Làm quá giờ (OT), giải quyết bug hóc búa làm tăng stress. <b class="text-rose-400 font-bold">Nếu Stress ≥ 95%, bạn sẽ kiệt sức (Burnout) và bị đuổi việc ngay lập tức!</b> Bóp vịt cao su [Phím 3] để giải tỏa.
            </p>
          </div>

          <div class="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div class="font-bold text-amber-400 flex items-center space-x-1.5 mb-1 text-xs">
              <span>🎯</span>
              <span>KPI Đánh Giá (KPI Score)</span>
            </div>
            <p class="text-[11px] text-slate-300 leading-relaxed">
              Hoàn thành các Ticket Jira và minigame kỹ thuật để tích lũy điểm KPI. Đạt KPI ≥ 85 để mở khóa kết thúc <b class="text-amber-400">Senior Rookie xuất sắc</b>.
            </p>
          </div>

          <div class="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div class="font-bold text-sky-400 flex items-center space-x-1.5 mb-1 text-xs">
              <span>🤝</span>
              <span>Uy Tín Đồng Nghiệp (Reputation)</span>
            </div>
            <p class="text-[11px] text-slate-300 leading-relaxed">
              Giao tiếp hòa nhã, nhận trách nhiệm thật thà thay vì đùn đẩy blame sẽ giúp bạn được đồng nghiệp quý mến và hỗ trợ khi có biến cố.
            </p>
          </div>
        </div>

        <!-- Working Hours & OT -->
        <div class="p-3 bg-indigo-950/30 border border-indigo-900/60 rounded-xl mb-4 text-[11px] text-slate-300">
          <div class="font-bold text-indigo-300 mb-1 flex items-center space-x-1.5">
            <span>⏰</span>
            <span>Giờ Làm Việc & Tăng Ca (OT):</span>
          </div>
          <p class="leading-relaxed">
            - Ca làm bắt đầu lúc <b class="text-slate-100">09:00</b> và chuông hết giờ reo lúc <b class="text-slate-100">18:00</b>.<br>
            - Hết giờ bạn có thể chọn: <b class="text-emerald-400">Về nhà nghỉ ngơi</b> (Hồi phục thể lực) hoặc <b class="text-amber-400">Ở lại OT đến 20:00</b> (Làm thêm ticket nhưng tăng nhiều Stress).
          </p>
        </div>

        <!-- Shortcuts Table -->
        <div class="mb-4">
          <div class="font-bold text-slate-200 mb-2">⌨️ Bảng Phím Tắt Tiện Dụng:</div>
          <div class="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div class="p-2 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center">
              <span class="text-slate-400">Phóng to/Thu nhỏ màn hình:</span>
              <kbd class="px-2 py-0.5 bg-indigo-900 text-indigo-200 rounded font-bold">Space</kbd>
            </div>
            <div class="p-2 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center">
              <span class="text-slate-400">Uống Cà Phê:</span>
              <kbd class="px-2 py-0.5 bg-indigo-900 text-indigo-200 rounded font-bold">1</kbd>
            </div>
            <div class="p-2 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center">
              <span class="text-slate-400">Nhấc Điện Thoại Khi Reo:</span>
              <kbd class="px-2 py-0.5 bg-indigo-900 text-indigo-200 rounded font-bold">2</kbd>
            </div>
            <div class="p-2 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center">
              <span class="text-slate-400">Bóp Vịt Cao Su:</span>
              <kbd class="px-2 py-0.5 bg-indigo-900 text-indigo-200 rounded font-bold">3</kbd>
            </div>
            <div class="p-2 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center">
              <span class="text-slate-400">Quầy Pantry / Phòng Họp:</span>
              <kbd class="px-2 py-0.5 bg-indigo-900 text-indigo-200 rounded font-bold">P / M</kbd>
            </div>
            <div class="p-2 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center">
              <span class="text-slate-400">Đóng Hội Thoại / Đóng Modal:</span>
              <kbd class="px-2 py-0.5 bg-indigo-900 text-indigo-200 rounded font-bold">Esc</kbd>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="pt-3 border-t border-slate-800 flex justify-end">
          <button id="btn-ok-guide" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow transition text-xs">
            Đã Rõ, Bắt Đầu Làm Việc! 🚀
          </button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const btnClose = this.container?.querySelector('#btn-close-guide');
    const btnOk = this.container?.querySelector('#btn-ok-guide');

    btnClose?.addEventListener('click', () => this.close());
    btnOk?.addEventListener('click', () => this.close());
  }
}

export const globalGuideModal = new GuideModal();
