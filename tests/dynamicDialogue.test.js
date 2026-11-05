import test from 'node:test';
import assert from 'node:assert/strict';

import { EventBus } from '../src/core/eventBus.js';
import { GameState } from '../src/core/gameState.js';
import { LLMProvider } from '../src/core/llmProvider.js';
import { DynamicDialogue } from '../src/story/dynamicDialogue.js';

test('Review Focus 3: DynamicDialogue falls back to static dialogue when LLM disabled or fails', async () => {
  const bus = new EventBus();
  const state = new GameState({ eventBus: bus, storageKey: 'test_llm_fallback' });

  // Disabled provider
  const disabledProvider = new LLMProvider({ enabled: false });
  const ddDisabled = new DynamicDialogue({ llmProvider: disabledProvider, gameState: state });

  const fallback1 = await ddDisabled.getDialogue('hr_lan', 1);
  assert.ok(fallback1 !== null, 'Should return static dialogue');
  assert.ok(fallback1[0].text.includes('MegaSoft'), 'Should contain static text');

  // Failing provider
  const failingProvider = {
    enabled: true,
    generate: async () => {
      throw new Error('Network timeout');
    }
  };
  const ddFailing = new DynamicDialogue({ llmProvider: failingProvider, gameState: state });
  const fallback2 = await ddFailing.getDialogue('hr_lan', 1);
  assert.ok(fallback2 !== null, 'Should safely return static dialogue on exception');
});

test('DynamicDialogue parses valid LLM JSON response', async () => {
  const bus = new EventBus();
  const state = new GameState({ eventBus: bus, storageKey: 'test_llm_parse' });

  const mockProvider = {
    enabled: true,
    generate: async () => JSON.stringify({
      speaker: 'HR Lan (AI)',
      text: 'Hôm nay trời đẹp, em đã hoàn thành ticket nào chưa?',
      choices: [
        { text: 'Em đang làm ạ!', type: 'responsible' }
      ]
    })
  };

  const dd = new DynamicDialogue({ llmProvider: mockProvider, gameState: state });
  const result = await dd.getDialogue('hr_lan', 1);

  assert.equal(result[0].speaker, 'HR Lan (AI)');
  assert.equal(result[0].choices[0].type, 'responsible');
});
