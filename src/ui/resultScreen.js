import { globalEndingSystem } from '../story/endingSystem.js';
import { globalGameState } from '../core/gameState.js';
import { globalEventBus } from '../core/eventBus.js';

export class ResultScreen {
  constructor(options = {}) {
    this.container = options.container || (typeof document !== 'undefined' ? document.getElementById('modal-container') : null);
    this.gameState = options.gameState || globalGameState;
    this.endingSystem = options.endingSystem || globalEndingSystem;
    this.eventBus = options.eventBus || globalEventBus;

    this.eventBus.on('game:burnout', () => this.show(this.endingSystem.evaluate({ stress: 99 })));
  }

  show(endingConfig = null) {
    if (!this.container) return;

    const ending = endingConfig || this.endingSystem.evaluate();
    const name = this.gameState.get('player.name') || 'Tân Binh IT';
    const role = this.gameState.get('player.role') || 'frontend';
    const kpi = Math.round(this.gameState.get('player.kpi') || 50);
    const rep = Math.round(this.gameState.get('player.reputation') || 50);
    const stress = Math.round(this.gameState.get('player.stress') || 20);
    const energy = Math.round(this.gameState.get('player.energy') || 100);

    this.container.classList.remove('hidden');
    this.container.innerHTML = `
      <div class="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-xl w-full shadow-2xl flex flex-col items-center select-none font-sans">
        <!-- Badge & Emoji -->
        <div class="text-6xl mb-2 animate-bounce">${ending.emoji}</div>
        <div class="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 bg-indigo-950 border border-indigo-700 rounded-full text-indigo-300 mb-2">
          ${ending.resultBadge}
        </div>
        <h2 class="text-xl font-bold text-slate-100 text-center mb-1">${ending.title}</h2>
        <p class="text-xs text-slate-400 text-center mb-4 max-w-md">${ending.desc}</p>

        <!-- Quote -->
        <div class="w-full p-3 bg-slate-950 border-l-4 border-amber-500 rounded-r-lg mb-4 text-xs italic text-amber-300/90 leading-relaxed font-serif">
          ${ending.leadQuote}
          <div class="not-italic font-bold text-[10px] text-slate-400 mt-1">— Tech Lead Đức (Trưởng Phòng IT)</div>
        </div>

        <!-- Radar Chart & Stats Table -->
        <div class="w-full grid grid-cols-2 gap-4 items-center mb-5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <canvas id="radar-canvas" width="180" height="180" class="mx-auto"></canvas>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between border-b border-slate-800 pb-1">
              <span class="text-slate-400">Ứng viên:</span>
              <span class="font-bold text-slate-200">${name}</span>
            </div>
            <div class="flex justify-between border-b border-slate-800 pb-1">
              <span class="text-slate-400">Vị trí:</span>
              <span class="font-bold text-indigo-400 uppercase">${role}</span>
            </div>
            <div class="flex justify-between border-b border-slate-800 pb-1">
              <span class="text-slate-400">KPI Hiệu suất:</span>
              <span class="font-bold text-amber-400">${kpi}/100</span>
            </div>
            <div class="flex justify-between border-b border-slate-800 pb-1">
              <span class="text-slate-400">Uy tín Đồng đội:</span>
              <span class="font-bold text-sky-400">${rep}/100</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Mức Stress:</span>
              <span class="font-bold ${stress >= 80 ? 'text-rose-500' : 'text-slate-300'}">${stress}%</span>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <button id="btn-replay-game" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2">
          <span>🔄</span>
          <span>Chơi Lại (Chọn Role / Vị Trí Khác)</span>
        </button>
      </div>
    `;

    // Draw Radar Chart on Canvas
    this.drawRadarChart(kpi, rep, energy, stress);

    // Replay button
    this.container.querySelector('#btn-replay-game')?.addEventListener('click', () => {
      this.gameState.reset();
      this.container.classList.add('hidden');
      this.eventBus.emit('game:restart');
      window.location.reload();
    });
  }

  drawRadarChart(kpi, rep, energy, stress) {
    const canvas = document.getElementById('radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const centerX = 90;
    const centerY = 90;
    const radius = 65;

    ctx.clearRect(0, 0, 180, 180);

    // Background web circles
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for (let r = 20; r <= radius; r += 20) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Axes
    const axes = [
      { label: 'KPI', val: kpi / 100, angle: -Math.PI / 2 },
      { label: 'Rep', val: rep / 100, angle: 0 },
      { label: 'Energy', val: energy / 100, angle: Math.PI / 2 },
      { label: 'Stress', val: (100 - stress) / 100, angle: Math.PI } // Higher is better (less stress)
    ];

    ctx.strokeStyle = '#475569';
    for (const a of axes) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(a.angle) * radius, centerY + Math.sin(a.angle) * radius);
      ctx.stroke();
    }

    // Filled Polygon
    ctx.fillStyle = 'rgba(99, 102, 241, 0.45)';
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    axes.forEach((a, idx) => {
      const r = radius * a.val;
      const x = centerX + Math.cos(a.angle) * r;
      const y = centerY + Math.sin(a.angle) * r;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

export const globalResultScreen = new ResultScreen();
