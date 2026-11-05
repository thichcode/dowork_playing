import { globalEventBus } from '../core/eventBus.js';
import { globalGameState } from '../core/gameState.js';
import { CHAPTER_1_DIALOGUES } from '../data/dialogues/chapter1.js';
import { CHAPTER_2_DIALOGUES } from '../data/dialogues/chapter2.js';
import { CHAPTER_3_DIALOGUES } from '../data/dialogues/chapter3.js';
import { CHAPTER_4_DIALOGUES } from '../data/dialogues/chapter4.js';
import { globalDynamicDialogue } from '../story/dynamicDialogue.js';

export const CHOICE_EFFECT_TEMPLATES = {
  responsible:   { kpi: 5,  reputation: 3,  stress: 0,   energy: 0 },
  deflect_blame: { kpi: -3, reputation: -5, stress: 10,  energy: 0 },
  neutral:       { kpi: 2,  reputation: 0,  stress: 0,   energy: 0 },
  honest_help:   { kpi: 0,  reputation: 5,  stress: 5,   energy: 0 }
};

export class DialogueSystem {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.gameState = options.gameState || globalGameState;
    this.container = options.container || (typeof document !== 'undefined' ? document.getElementById('dialogue-overlay') : null);
    this.currentNode = null;
    this.queue = [];
    this.isDialogueActive = false;
  }

  isActive() {
    return this.isDialogueActive;
  }

  getDialogueForNPC(npcId, chapter) {
    const chapters = {
      1: CHAPTER_1_DIALOGUES,
      2: CHAPTER_2_DIALOGUES,
      3: CHAPTER_3_DIALOGUES,
      4: CHAPTER_4_DIALOGUES
    };
    const chapterData = chapters[chapter] || CHAPTER_1_DIALOGUES;
    return chapterData[npcId] || null;
  }

  async startWithNPC(npcId, chapter) {
    const dialogue = await globalDynamicDialogue.getDialogue(npcId, chapter);
    if (dialogue) {
      this.start(dialogue);
    }
  }

  start(dialogueList) {
    if (!dialogueList || dialogueList.length === 0) return;
    this.queue = Array.isArray(dialogueList) ? [...dialogueList] : [dialogueList];
    this.isDialogueActive = true;
    this.next();
  }

  next() {
    if (this.queue.length === 0) {
      this.close();
      return;
    }
    this.currentNode = this.queue.shift();
    this.render();
  }

  close() {
    this.isDialogueActive = false;
    this.currentNode = null;
    this.queue = [];
    if (this.container) {
      this.container.classList.add('hidden');
      this.container.innerHTML = '';
    }
    this.eventBus.emit('dialogue:closed');
  }

  applyChoiceEffect(type) {
    const effect = CHOICE_EFFECT_TEMPLATES[type] || CHOICE_EFFECT_TEMPLATES.neutral;
    const player = this.gameState.get('player') || {};

    const newKpi = Math.max(0, Math.min(100, (player.kpi || 50) + (effect.kpi || 0)));
    const newRep = Math.max(0, Math.min(100, (player.reputation || 50) + (effect.reputation || 0)));
    const newStress = Math.max(0, Math.min(100, (player.stress || 20) + (effect.stress || 0)));
    const newEnergy = Math.max(0, Math.min(100, (player.energy || 100) + (effect.energy || 0)));

    this.gameState.set('player.kpi', newKpi);
    this.gameState.set('player.reputation', newRep);
    this.gameState.set('player.stress', newStress);
    this.gameState.set('player.energy', newEnergy);

    this.eventBus.emit('dialogue:choice-selected', { type, effect });
  }

  render() {
    if (!this.container || !this.currentNode) return;

    this.container.classList.remove('hidden');
    const { speaker, text, choices } = this.currentNode;

    let choicesHtml = '';
    if (choices && choices.length > 0) {
      choicesHtml = `
        <div class="mt-4 flex flex-col space-y-2">
          ${choices.map((c, i) => `
            <button data-index="${i}" class="dlg-choice-btn w-full text-left px-3 py-2 bg-slate-800 hover:bg-indigo-900/60 border border-slate-700 hover:border-indigo-500 rounded text-xs text-slate-200 transition">
              ${c.text}
            </button>
          `).join('')}
        </div>
      `;
    } else {
      choicesHtml = `
        <div class="mt-4 flex justify-end">
          <button id="btn-dlg-continue" class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold shadow transition flex items-center space-x-1">
            <span>Tiếp tục</span>
            <span class="text-[10px] text-indigo-200 font-mono">[E]</span>
          </button>
        </div>
      `;
    }

    this.container.innerHTML = `
      <div class="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-2xl flex space-x-4">
        <div class="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shrink-0">
          💬
        </div>
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <div class="font-bold text-sm text-indigo-400 mb-1">${speaker}</div>
            <div class="text-xs text-slate-200 leading-relaxed font-sans">${text}</div>
          </div>
          ${choicesHtml}
        </div>
      </div>
    `;

    // Bind event listeners
    if (choices && choices.length > 0) {
      const btns = this.container.querySelectorAll('.dlg-choice-btn');
      btns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(btn.getAttribute('data-index'), 10);
          const selectedChoice = choices[idx];
          this.applyChoiceEffect(selectedChoice.type);
          this.next();
        });
      });
    } else {
      const btnNext = this.container.querySelector('#btn-dlg-continue');
      if (btnNext) {
        btnNext.addEventListener('click', () => this.next());
      }
    }
  }

  handleKeyPress() {
    if (!this.isDialogueActive) return;
    if (this.currentNode && (!this.currentNode.choices || this.currentNode.choices.length === 0)) {
      this.next();
    }
  }
}

export const globalDialogueSystem = new DialogueSystem();
