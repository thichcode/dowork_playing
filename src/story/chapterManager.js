import { globalEventBus } from '../core/eventBus.js';
import { globalGameState } from '../core/gameState.js';
import { globalCutscenePlayer } from '../ui/cutscenePlayer.js';
import { globalHUD } from '../ui/hud.js';

import { CHAPTER_1_CONFIG } from './chapters/chapter1.js';
import { CHAPTER_2_CONFIG } from './chapters/chapter2.js';
import { CHAPTER_3_CONFIG } from './chapters/chapter3.js';
import { CHAPTER_4_CONFIG } from './chapters/chapter4.js';

export class ChapterManager {
  constructor(options = {}) {
    this.eventBus = options.eventBus || globalEventBus;
    this.gameState = options.gameState || globalGameState;
    this.cutscenePlayer = options.cutscenePlayer || globalCutscenePlayer;
    this.hud = options.hud || globalHUD;

    this.chapters = {
      1: CHAPTER_1_CONFIG,
      2: CHAPTER_2_CONFIG,
      3: CHAPTER_3_CONFIG,
      4: CHAPTER_4_CONFIG
    };

    // Auto-advance chapter when tickets completed
    this.eventBus.on('ticket:completed', () => this.checkChapterProgression());
  }

  getCurrentChapterConfig() {
    const ch = this.gameState.get('chapter') || 1;
    return this.chapters[ch] || CHAPTER_1_CONFIG;
  }

  advanceEvent() {
    const cur = this.gameState.get('chapterProgress') || 0;
    this.gameState.set('chapterProgress', cur + 1);
  }

  async transitionToChapter(newChapter) {
    this.gameState.set('chapter', newChapter);
    this.gameState.set('chapterProgress', 0);

    const cfg = this.chapters[newChapter];
    if (cfg && cfg.introScenes && this.cutscenePlayer) {
      await this.cutscenePlayer.play(cfg.introScenes);
    }

    this.hud?.showNotification(`📖 Bước vào ${cfg?.name || `Chương ${newChapter}`}!`, 4000, 'info');
    this.eventBus.emit('chapter:transitioned', { chapter: newChapter });
  }

  checkChapterProgression() {
    const ch = this.gameState.get('chapter') || 1;
    const completed = this.gameState.get('completedTickets') || [];

    // Simple milestone: 1 ticket done -> Ch 2; 2 tickets done -> Ch 3; 3 tickets done -> Ch 4
    if (ch === 1 && completed.length >= 1) {
      this.transitionToChapter(2);
    } else if (ch === 2 && completed.length >= 2) {
      this.transitionToChapter(3);
    } else if (ch === 3 && completed.length >= 3) {
      this.transitionToChapter(4);
    }
  }
}

export const globalChapterManager = new ChapterManager();
