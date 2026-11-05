import { globalEventBus } from '../core/eventBus.js';

export const VALID_LOCATIONS = ['desk', 'pantry', 'meeting'];

export class LocationManager {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.currentLocation = 'desk';
    this.container = options.container || (typeof document !== 'undefined' ? document.getElementById('location-overlay') : null);
  }

  getLocation() {
    return this.currentLocation;
  }

  switchLocation(newLoc) {
    if (!VALID_LOCATIONS.includes(newLoc)) {
      return false;
    }

    const prevLoc = this.currentLocation;
    this.currentLocation = newLoc;

    if (this.container) {
      this.render();
    }

    this.eventBus.emit('location:changed', {
      previous: prevLoc,
      location: newLoc
    });

    return true;
  }

  render() {
    if (!this.container) return;

    if (this.currentLocation === 'desk') {
      this.container.classList.add('hidden');
      this.container.innerHTML = '';
      return;
    }

    this.container.classList.remove('hidden');

    if (this.currentLocation === 'pantry') {
      this.container.innerHTML = `
        <div class="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col font-sans select-none text-xs">
          <!-- Header -->
          <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div class="flex items-center space-x-3">
              <span class="text-3xl">☕</span>
              <div>
                <h3 class="font-bold text-base text-amber-400">Khu Vực Pantry & Tea-break (Tầng 18)</h3>
                <p class="text-[11px] text-slate-400">Nơi hóng tin đồn drama, thưởng Tết, và tiếp nạp calo</p>
              </div>
            </div>
            <button id="btn-leave-location" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition flex items-center space-x-1">
              <span>🔙</span>
              <span>Về bàn làm việc [Esc]</span>
            </button>
          </div>

          <!-- Pantry Content -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <div class="text-2xl mb-2">🧊 Tủ Lạnh Chung</div>
                <p class="text-[11px] text-slate-300 leading-relaxed mb-3">
                  Tủ lạnh đầy hộp cơm trưa dán tên, trà sữa trân châu, và bánh ngọt của team Marketing.
                </p>
              </div>
              <button id="btn-eat-snack" class="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition shadow text-xs">
                🍩 Ăn nhẹ bánh ngọt (+10 ⚡ Energy)
              </button>
            </div>

            <div class="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <div class="text-2xl mb-2">💬 Góc Buôn Chuyện</div>
                <p class="text-[11px] text-slate-300 leading-relaxed mb-3">
                  Tester Lan và Senior Dũng đang thì thầm về đợt audit bảo mật và tin đồn sếp Tuấn Anh sắp tuyển Tech Lead mới.
                </p>
              </div>
              <button id="btn-chat-pantry" class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition shadow text-xs">
                🗣️ Tham gia buôn chuyện (+5 🤝 Uy tín, -5 🔥 Stress)
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (this.currentLocation === 'meeting') {
      this.container.innerHTML = `
        <div class="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col font-sans select-none text-xs">
          <!-- Header -->
          <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div class="flex items-center space-x-3">
              <span class="text-3xl">📊</span>
              <div>
                <h3 class="font-bold text-base text-indigo-400">Phòng Họp Meeting Room Alpha</h3>
                <p class="text-[11px] text-slate-400">Bảng trắng vẽ kiến trúc Microservices rối như tơ vò & màn hình máy chiếu</p>
              </div>
            </div>
            <button id="btn-leave-location" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition flex items-center space-x-1">
              <span>🔙</span>
              <span>Về bàn làm việc [Esc]</span>
            </button>
          </div>

          <!-- Meeting Content -->
          <div class="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl mb-4">
            <div class="font-bold text-sm text-indigo-300 mb-2 flex items-center space-x-2">
              <span>📌</span>
              <span>Daily Scrum Stand-up (15 phút mỗi sáng)</span>
            </div>
            <p class="text-[11px] text-slate-300 leading-relaxed mb-4">
              Mọi người đang báo cáo 3 câu hỏi kinh điển: Hôm qua làm gì? Hôm nay làm gì? Có gặp blocker nào không?
            </p>
            <div class="flex space-x-2">
              <button id="btn-scrum-report" class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow transition text-xs">
                🎤 Báo cáo tiến độ chuẩn chỉnh (+5 🎯 KPI, +3 🤝 Uy tín)
              </button>
            </div>
          </div>
        </div>
      `;
    }

    this.bindLocationEvents();
  }

  bindLocationEvents() {
    const btnLeave = this.container?.querySelector('#btn-leave-location');
    btnLeave?.addEventListener('click', () => this.switchLocation('desk'));

    const btnSnack = this.container?.querySelector('#btn-eat-snack');
    btnSnack?.addEventListener('click', () => {
      this.eventBus.emit('pantry:eat-snack');
      this.switchLocation('desk');
    });

    const btnChat = this.container?.querySelector('#btn-chat-pantry');
    btnChat?.addEventListener('click', () => {
      this.eventBus.emit('pantry:chat');
      this.switchLocation('desk');
    });

    const btnScrum = this.container?.querySelector('#btn-scrum-report');
    btnScrum?.addEventListener('click', () => {
      this.eventBus.emit('meeting:report');
      this.switchLocation('desk');
    });
  }
}

export const globalLocationManager = new LocationManager();
