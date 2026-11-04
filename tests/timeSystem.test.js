import test from 'node:test';
import assert from 'node:assert/strict';

import { EventBus } from '../src/core/eventBus.js';
import { GameState } from '../src/core/gameState.js';
import { TimeSystem } from '../src/office/timeSystem.js';

test('TimeSystem advances minutes with real seconds', () => {
  const bus = new EventBus();
  const state = new GameState({ eventBus: bus, storageKey: 'test_time' });
  const timeSystem = new TimeSystem({ eventBus: bus, gameState: state });

  assert.equal(state.get('time.hour'), 9);
  assert.equal(state.get('time.minute'), 0);

  // Advance by 1.0 second deltaTime -> 1 in-game minute
  timeSystem.update(1.0);
  assert.equal(state.get('time.minute'), 1);

  // Advance by 59 seconds -> 60 min -> 10:00
  timeSystem.update(59.0);
  assert.equal(state.get('time.hour'), 10);
  assert.equal(state.get('time.minute'), 0);
});

test('TimeSystem emits time:end-of-day at 18:00', () => {
  const bus = new EventBus();
  const state = new GameState({ eventBus: bus, storageKey: 'test_time_eod' });
  const timeSystem = new TimeSystem({ eventBus: bus, gameState: state });

  let eodEmitted = false;
  bus.on('time:end-of-day', () => {
    eodEmitted = true;
  });

  // Advance 9 hours (540 minutes = 540 seconds)
  timeSystem.advanceMinutes(540);
  assert.equal(state.get('time.hour'), 18);
  assert.equal(eodEmitted, true);
});

test('Review Focus 2: Day transition resets coffeeCount to 0', () => {
  const bus = new EventBus();
  const state = new GameState({ eventBus: bus, storageKey: 'test_coffee_reset' });
  const timeSystem = new TimeSystem({ eventBus: bus, gameState: state });

  state.set('coffeeCount', 3);
  assert.equal(state.get('coffeeCount'), 3);

  timeSystem.nextDay();
  assert.equal(state.get('coffeeCount'), 0);
  assert.equal(state.get('time.day'), 2);
  assert.equal(state.get('time.hour'), 9);
  assert.equal(state.get('time.minute'), 0);
});
