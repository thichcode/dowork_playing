import { globalEventBus } from '../core/eventBus.js';

export const ITEM_TOOLTIPS = {
  coffee: {
    title: '☕ Cốc Cà Phê Gốm MegaSoft',
    desc: 'Húp ngụm cà phê thơm lừng để tỉnh táo.',
    effect: '+15 ⚡ Năng lượng, -5 🔥 Stress',
    hotkey: '1',
    limit: 'Tối đa 3 cốc/ngày'
  },
  phone: {
    title: '☎️ Điện Thoại Bàn Công Ty',
    desc: 'Nhấc máy khi có chuông reo để nhận cuộc gọi khẩn hoặc nghe PM réo.',
    effect: 'Kích hoạt biến cố / Plot Twist khẩn',
    hotkey: '2',
    limit: 'Khi chuông reo'
  },
  duck: {
    title: '🦆 Vịt Cao Su (Rubber Duck)',
    desc: 'Bóp vịt xả stress & tâm sự khi gặp bug khó hiểu.',
    effect: '-2 🔥 Stress',
    hotkey: '3',
    limit: 'Không giới hạn'
  },
  monitor: {
    title: '💻 Màn Hình CyberWork OS',
    desc: 'Nhấp hoặc ấn SPACE để Zoom In toàn màn hình làm việc.',
    effect: 'Mở CyberWork OS & Minigames',
    hotkey: 'Space',
    limit: 'Bất cứ lúc nào'
  },
  notes: {
    title: '📝 Giấy Ghi Chú Post-it',
    desc: 'Xem nhanh nhiệm vụ hiện tại và mẹo sinh tồn.',
    effect: 'Hiển thị To-do list',
    hotkey: 'Tab',
    limit: 'Xem nhanh'
  },
  pantry: {
    title: '🥐 Quầy Pantry',
    desc: 'Ra quầy cafe buôn chuyện, hóng drama công ty.',
    effect: 'Tương tác đồng nghiệp',
    hotkey: 'P',
    limit: 'Tự do'
  },
  meeting: {
    title: '👥 Phòng Họp Scrum',
    desc: 'Vào phòng họp Daily Scrum hoặc bảo vệ thử việc.',
    effect: 'Họp team / Đánh giá',
    hotkey: 'M',
    limit: 'Tự do'
  },
  guide: {
    title: '❓ Cẩm Nang Thử Việc',
    desc: 'Mở sổ tay hướng dẫn sinh tồn và phím tắt.',
    effect: 'Xem bảng luật chơi',
    hotkey: '?',
    limit: 'Tra cứu'
  }
};

export const SHORTCUTS_LIST = [
  { key: 'Space', label: 'Zoom In/Out Màn hình' },
  { key: '1', label: 'Uống Cà phê' },
  { key: '2', label: 'Nhấc Điện thoại' },
  { key: '3', label: 'Bóp Vịt xả stress' },
  { key: 'P', label: 'Quầy Pantry' },
  { key: 'M', label: 'Phòng Họp' },
  { key: '?', label: 'Cẩm Nang Hướng Dẫn' }
];

export class GuideSystem {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.container = options.container || (typeof document !== 'undefined' ? document.getElementById('guide-bar') : null);
    this.tooltipContainer = options.tooltipContainer || (typeof document !== 'undefined' ? document.getElementById('item-tooltip') : null);
    this.activeTooltipItem = null;
  }

  getTooltip(itemId) {
    return ITEM_TOOLTIPS[itemId] || null;
  }

  getShortcuts() {
    return SHORTCUTS_LIST;
  }

  showTooltip(itemId, x = 0, y = 0) {
    const tip = this.getTooltip(itemId);
    if (!tip || !this.tooltipContainer) return;

    this.activeTooltipItem = itemId;
    this.tooltipContainer.classList.remove('hidden');
    this.tooltipContainer.innerHTML = `
      <div class="font-bold text-indigo-300 flex items-center justify-between text-xs mb-0.5">
        <span>${tip.title}</span>
        <span class="bg-indigo-900/80 text-amber-300 font-mono text-[10px] px-1.5 py-0.2 rounded border border-indigo-700 ml-2">[${tip.hotkey}]</span>
      </div>
      <div class="text-[11px] text-slate-300">${tip.desc}</div>
      <div class="text-[10px] text-emerald-400 font-semibold mt-1">⚡ ${tip.effect}</div>
    `;

    // Position tooltip smoothly
    if (x && y) {
      this.tooltipContainer.style.left = `${Math.min(window.innerWidth - 260, Math.max(10, x - 100))}px`;
      this.tooltipContainer.style.top = `${Math.max(10, y - 80)}px`;
    }
  }

  hideTooltip() {
    this.activeTooltipItem = null;
    if (this.tooltipContainer) {
      this.tooltipContainer.classList.add('hidden');
    }
  }

  renderGuideBar() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="flex items-center justify-between w-full px-4 py-1.5 bg-slate-950/90 border-t border-slate-800 text-xs select-none backdrop-blur font-sans">
        <div class="flex items-center space-x-2 text-slate-400 text-[11px]">
          <span class="text-amber-400 font-bold">💡 Phím tắt nhanh:</span>
          ${SHORTCUTS_LIST.map(s => `
            <span class="inline-flex items-center space-x-1 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-300">
              <kbd class="font-mono text-indigo-400 font-bold">[${s.key}]</kbd>
              <span>${s.label}</span>
            </span>
          `).join('')}
        </div>
        <button id="btn-open-guide-modal" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-semibold transition flex items-center space-x-1 shadow">
          <span>❓</span>
          <span>Cẩm Nang [?]</span>
        </button>
      </div>
    `;
  }
}

export const globalGuideSystem = new GuideSystem();
