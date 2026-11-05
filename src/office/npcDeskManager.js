import { globalEventBus } from '../core/eventBus.js';
import { NPCS_DATA } from '../data/npcs.js';

export const NPC_EMOTIONS = {
  normal: '😐',
  happy: '😄',
  thinking: '🤔',
  angry: '😠',
  panic: '😱'
};

export class NPCDeskManager {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.activeNPC = null;
    this.container = options.container || (typeof document !== 'undefined' ? document.getElementById('desk-npc-stage') : null);
  }

  hasActiveNPC() {
    return this.activeNPC !== null;
  }

  getActiveNPC() {
    return this.activeNPC;
  }

  spawnNPC(npcId, emotion = 'normal', message = '') {
    const npcMeta = (NPCS_DATA || []).find(n => n.id === npcId) || { name: 'Đồng nghiệp', role: 'MegaSoft' };
    
    this.activeNPC = {
      npcId,
      name: npcMeta.name,
      role: npcMeta.role,
      emotion,
      message
    };

    if (this.container) {
      this.render();
    }

    this.eventBus.emit('npc:desk-spawned', this.activeNPC);
    return this.activeNPC;
  }

  dismissNPC() {
    if (!this.activeNPC) return;
    this.activeNPC = null;

    if (this.container) {
      this.container.innerHTML = '';
    }

    this.eventBus.emit('npc:desk-dismissed');
  }

  render() {
    if (!this.container || !this.activeNPC) return;

    const emo = NPC_EMOTIONS[this.activeNPC.emotion] || '😐';

    this.container.innerHTML = `
      <div class="pointer-events-auto flex flex-col items-center animate-fade-in">
        <!-- NPC Face-to-Face Avatar Box -->
        <div class="relative bg-slate-900 border-2 border-indigo-500 rounded-2xl p-3 shadow-2xl flex items-center space-x-3 mb-2">
          <div class="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shadow">
            ${emo}
          </div>
          <div>
            <div class="font-bold text-sm text-indigo-400">${this.activeNPC.name}</div>
            <div class="text-[10px] text-slate-400 uppercase tracking-wider">${this.activeNPC.role}</div>
          </div>
          <button id="btn-dismiss-npc" class="text-slate-400 hover:text-white px-2 py-1 text-sm font-bold ml-2">✕</button>
        </div>

        ${this.activeNPC.message ? `
          <!-- Speech Balloon -->
          <div class="max-w-md bg-slate-900/95 border border-indigo-500/80 rounded-2xl p-3 shadow-2xl text-xs text-slate-200 leading-relaxed text-center relative backdrop-blur">
            ${this.activeNPC.message}
            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-indigo-500/80 rotate-45"></div>
          </div>
        ` : ''}
      </div>
    `;

    this.container.querySelector('#btn-dismiss-npc')?.addEventListener('click', () => {
      this.dismissNPC();
    });
  }
}

export const globalNPCDeskManager = new NPCDeskManager();
