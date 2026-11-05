import { globalEventBus } from '../core/eventBus.js';
import { globalGameState } from '../core/gameState.js';

export class HUD {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.gameState = options.gameState || globalGameState;
    this.container = options.container || (typeof document !== 'undefined' ? document.getElementById('hud') : null);
    this.toastContainer = typeof document !== 'undefined' ? document.getElementById('toast-container') : null;

    if (this.container) {
      this.bindElements();
      this.subscribeState();
      this.updateAll();
    }
  }

  bindElements() {
    this.elPlayerName = document.getElementById('hud-player-name');
    this.elPlayerRole = document.getElementById('hud-player-role');
    this.elRoomBadge = document.getElementById('hud-room-badge');
    this.elEnergyBar = document.getElementById('hud-energy-bar');
    this.elEnergyText = document.getElementById('hud-energy-text');
    this.elStressBar = document.getElementById('hud-stress-bar');
    this.elStressText = document.getElementById('hud-stress-text');
    this.elKpiBar = document.getElementById('hud-kpi-bar');
    this.elKpiText = document.getElementById('hud-kpi-text');
    this.elRepBar = document.getElementById('hud-rep-bar');
    this.elRepText = document.getElementById('hud-rep-text');
    this.elClock = document.getElementById('hud-clock');
    this.elDayChapter = document.getElementById('hud-day-chapter');
  }

  subscribeState() {
    this.eventBus.on('state:changed', () => this.updateAll());
    this.eventBus.on('time:tick', () => this.updateClock());
    this.eventBus.on('room:changed', (room) => {
      if (this.elRoomBadge && room) {
        this.elRoomBadge.textContent = room.badge || room.name;
      }
    });
  }

  updateAll() {
    if (!this.container) return;

    const name = this.gameState.get('player.name') || 'Tân Binh IT';
    const role = this.gameState.get('player.role') || 'frontend';
    const energy = Math.max(0, Math.min(100, this.gameState.get('player.energy') ?? 100));
    const stress = Math.max(0, Math.min(100, this.gameState.get('player.stress') ?? 20));
    const kpi = Math.max(0, Math.min(100, this.gameState.get('player.kpi') ?? 50));
    const rep = Math.max(0, Math.min(100, this.gameState.get('player.reputation') ?? 50));

    if (this.elPlayerName) this.elPlayerName.textContent = name;
    if (this.elPlayerRole) {
      const roleMap = {
        frontend: '🎨 Frontend Dev',
        backend: '⚙️ Backend Dev',
        qa: '🔍 QA / Tester',
        devops: '🔧 DevOps / SRE'
      };
      this.elPlayerRole.textContent = roleMap[role] || role;
    }

    if (this.elEnergyBar) this.elEnergyBar.style.width = `${energy}%`;
    if (this.elEnergyText) this.elEnergyText.textContent = `${Math.round(energy)}%`;

    if (this.elStressBar) {
      this.elStressBar.style.width = `${stress}%`;
      // High stress alert color
      if (stress >= 80) {
        this.elStressBar.className = 'bg-rose-600 h-full transition-all duration-300 animate-pulse';
      } else {
        this.elStressBar.className = 'bg-rose-500 h-full transition-all duration-300';
      }
    }
    if (this.elStressText) this.elStressText.textContent = `${Math.round(stress)}%`;

    if (this.elKpiBar) this.elKpiBar.style.width = `${kpi}%`;
    if (this.elKpiText) this.elKpiText.textContent = `${Math.round(kpi)}`;

    if (this.elRepBar) this.elRepBar.style.width = `${rep}%`;
    if (this.elRepText) this.elRepText.textContent = `${Math.round(rep)}`;

    this.updateClock();
  }

  updateClock() {
    const hour = String(this.gameState.get('time.hour') || 9).padStart(2, '0');
    const minute = String(this.gameState.get('time.minute') || 0).padStart(2, '0');
    const day = this.gameState.get('time.day') || 1;
    const chapter = this.gameState.get('chapter') || 1;

    if (this.elClock) this.elClock.textContent = `${hour}:${minute}`;
    if (this.elDayChapter) this.elDayChapter.textContent = `Ngày ${day} • Chap ${chapter}`;
  }

  showNotification(text, duration = 3000, type = 'info') {
    if (!this.toastContainer && typeof document !== 'undefined') {
      this.toastContainer = document.getElementById('toast-container');
    }
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    const colors = {
      info: 'bg-slate-800 border-indigo-500/80 text-indigo-200',
      success: 'bg-slate-800 border-emerald-500/80 text-emerald-200',
      warning: 'bg-slate-800 border-amber-500/80 text-amber-200',
      danger: 'bg-slate-800 border-rose-500/80 text-rose-200'
    };

    toast.className = `${colors[type] || colors.info} border px-4 py-2 rounded-lg shadow-xl text-xs font-medium backdrop-blur flex items-center space-x-2 transition-all duration-300 transform translate-y-[-10px] opacity-0`;
    toast.innerHTML = `<span>${text}</span>`;
    this.toastContainer.appendChild(toast);

    // Fade in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-[-10px]', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    // Fade out & remove
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-[-10px]');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

export const globalHUD = new HUD();
