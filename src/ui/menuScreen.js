import { globalGameState } from '../core/gameState.js';
import { globalEventBus } from '../core/eventBus.js';
import { globalHUD } from './hud.js';

export class MenuScreen {
  constructor(options = {}) {
    this.container = options.container || (typeof document !== 'undefined' ? document.getElementById('menu-screen') : null);
    this.gameState = options.gameState || globalGameState;
    this.eventBus = options.eventBus || globalEventBus;
  }

  show() {
    if (!this.container) return;
    this.container.classList.remove('hidden');

    const hasSave = typeof localStorage !== 'undefined' && !!localStorage.getItem('megasoft_probation_save_v1');

    this.container.innerHTML = `
      <div class="max-w-md w-full bg-slate-900 border border-slate-700/80 rounded-3xl p-8 shadow-2xl flex flex-col items-center select-none font-sans">
        <!-- Logo & Title -->
        <div class="text-5xl mb-3 animate-pulse">🏢</div>
        <h1 class="text-2xl font-black text-indigo-400 tracking-wide text-center uppercase">MegaSoft Corp</h1>
        <div class="text-xs font-mono text-slate-400 tracking-widest uppercase mb-6">60 Ngày Thử Việc IT</div>

        <!-- Role Selection -->
        <div class="w-full text-left mb-4">
          <label class="block text-[11px] font-bold text-slate-300 uppercase font-mono mb-1">Tên nhân viên mới:</label>
          <input type="text" id="menu-player-name" value="Tân Binh IT" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-semibold focus:border-indigo-500 outline-none">
        </div>

        <div class="w-full text-left mb-6">
          <label class="block text-[11px] font-bold text-slate-300 uppercase font-mono mb-2">Chọn vị trí thử việc:</label>
          <div class="grid grid-cols-2 gap-2" id="menu-roles">
            <button data-role="frontend" class="role-btn p-2.5 rounded-xl border border-indigo-500 bg-indigo-950/60 text-indigo-300 text-xs font-bold transition flex flex-col items-center">
              <span class="text-lg mb-1">🎨</span>
              <span>Frontend Dev</span>
            </button>
            <button data-role="backend" class="role-btn p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-400 text-xs font-bold transition flex flex-col items-center">
              <span class="text-lg mb-1">⚙️</span>
              <span>Backend Dev</span>
            </button>
            <button data-role="qa" class="role-btn p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-400 text-xs font-bold transition flex flex-col items-center">
              <span class="text-lg mb-1">🔍</span>
              <span>QA / Tester</span>
            </button>
            <button data-role="devops" class="role-btn p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-400 text-xs font-bold transition flex flex-col items-center">
              <span class="text-lg mb-1">🔧</span>
              <span>DevOps / SRE</span>
            </button>
          </div>
        </div>

        <!-- Buttons -->
        <div class="w-full space-y-2.5">
          <button id="btn-start-game" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition">
            🎮 Bắt đầu Thử Việc Mới
          </button>
          ${hasSave ? `
            <button id="btn-continue-game" class="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition">
              ▶ Tiếp tục ván chơi trước
            </button>
          ` : ''}
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    let selectedRole = 'frontend';
    const roleBtns = this.container.querySelectorAll('.role-btn');

    roleBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedRole = btn.getAttribute('data-role');
        roleBtns.forEach((b) => {
          b.className = 'role-btn p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-400 text-xs font-bold transition flex flex-col items-center';
        });
        btn.className = 'role-btn p-2.5 rounded-xl border border-indigo-500 bg-indigo-950/60 text-indigo-300 text-xs font-bold transition flex flex-col items-center';
      });
    });

    const startBtn = this.container.querySelector('#btn-start-game');
    startBtn?.addEventListener('click', () => {
      const nameInput = this.container.querySelector('#menu-player-name');
      const name = nameInput?.value.trim() || 'Tân Binh IT';

      this.gameState.reset();
      this.gameState.set('player.name', name);
      this.gameState.set('player.role', selectedRole);
      globalHUD.updateAll();

      this.container.classList.add('hidden');
      this.eventBus.emit('game:started');
    });

    const continueBtn = this.container.querySelector('#btn-continue-game');
    continueBtn?.addEventListener('click', () => {
      this.gameState.load();
      globalHUD.updateAll();
      this.container.classList.add('hidden');
      this.eventBus.emit('game:continued');
    });
  }
}

export const globalMenuScreen = new MenuScreen();
