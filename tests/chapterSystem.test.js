import test from 'node:test';
import assert from 'node:assert/strict';

import { EventBus } from '../src/core/eventBus.js';
import { GameState } from '../src/core/gameState.js';
import { ChapterManager } from '../src/story/chapterManager.js';
import { RandomEventsManager } from '../src/story/randomEvents.js';

test('ChapterManager tracks progress and transitions chapters', () => {
  const bus = new EventBus();
  const state = new GameState({ eventBus: bus, storageKey: 'test_chap_mgr' });
  const cm = new ChapterManager({ eventBus: bus, gameState: state });

  assert.equal(state.get('chapter'), 1);
  assert.equal(state.get('chapterProgress'), 0);

  // Advance event in chapter 1
  cm.advanceEvent();
  assert.equal(state.get('chapterProgress'), 1);

  // Trigger chapter transition
  cm.transitionToChapter(2);
  assert.equal(state.get('chapter'), 2);
  assert.equal(state.get('chapterProgress'), 0);
});

test('RandomEventsManager rolls and triggers daily events', () => {
  const bus = new EventBus();
  const state = new GameState({ eventBus: bus, storageKey: 'test_rand_events' });
  const rm = new RandomEventsManager({ eventBus: bus, gameState: state });

  const initialRep = state.get('player.reputation');
  // Force trigger pizza event: +15 Energy, +5 Reputation
  const event = rm.triggerEvent('pizza_party');

  assert.equal(event.id, 'pizza_party');
  assert.equal(state.get('player.reputation'), initialRep + 5);
});
