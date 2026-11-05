import { globalLLMProvider } from '../core/llmProvider.js';
import { globalGameState } from '../core/gameState.js';
import { NPC_PERSONAS } from '../data/npcPersonas.js';
import { CHAPTER_1_DIALOGUES } from '../data/dialogues/chapter1.js';
import { CHAPTER_2_DIALOGUES } from '../data/dialogues/chapter2.js';
import { CHAPTER_3_DIALOGUES } from '../data/dialogues/chapter3.js';
import { CHAPTER_4_DIALOGUES } from '../data/dialogues/chapter4.js';

export class DynamicDialogue {
  constructor(options = {}) {
    this.llmProvider = options.llmProvider || globalLLMProvider;
    this.gameState = options.gameState || globalGameState;
    this.cache = new Map();
  }

  getStaticDialogue(npcId, chapter) {
    const chapters = {
      1: CHAPTER_1_DIALOGUES,
      2: CHAPTER_2_DIALOGUES,
      3: CHAPTER_3_DIALOGUES,
      4: CHAPTER_4_DIALOGUES
    };
    const chapterData = chapters[chapter] || CHAPTER_1_DIALOGUES;
    return chapterData[npcId] || null;
  }

  async getDialogue(npcId, chapter) {
    const staticFallback = this.getStaticDialogue(npcId, chapter);

    // If LLM disabled, immediately return static
    if (!this.llmProvider.enabled) {
      return staticFallback;
    }

    const persona = NPC_PERSONAS[npcId];
    if (!persona) return staticFallback;

    const role = this.gameState.get('player.role') || 'frontend';
    const day = this.gameState.get('time.day') || 1;
    const kpi = this.gameState.get('player.kpi') || 50;
    const rep = this.gameState.get('player.reputation') || 50;
    const stress = this.gameState.get('player.stress') || 20;

    const userPrompt = `Người chơi: Vị trí ${role}, Ngày ${day}, Chương ${chapter}, KPI: ${kpi}, Uy tín: ${rep}, Stress: ${stress}%.
Hãy sinh một đoạn đối thoại ngắn gồm lời nói của bạn và 2-3 lựa chọn phản hồi cho người chơi (gán type: 'responsible', 'deflect_blame', 'neutral' hoặc 'honest_help').`;

    try {
      const raw = await this.llmProvider.generate(persona, userPrompt);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.text) {
          return [
            {
              speaker: parsed.speaker || 'Đồng nghiệp',
              text: parsed.text,
              choices: (parsed.choices || []).map((c) => ({
                text: c.text,
                type: ['responsible', 'deflect_blame', 'neutral', 'honest_help'].includes(c.type) ? c.type : 'neutral'
              }))
            }
          ];
        }
      }
    } catch (e) {
      console.warn('Error parsing dynamic dialogue, using fallback:', e);
    }

    // Safe fallback to static (Review Focus 3)
    return staticFallback;
  }
}

export const globalDynamicDialogue = new DynamicDialogue();
