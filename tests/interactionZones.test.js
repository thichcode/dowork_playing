import test from 'node:test';
import assert from 'node:assert/strict';

import { EventBus } from '../src/core/eventBus.js';
import { GameState } from '../src/core/gameState.js';
import { TimeSystem } from '../src/office/timeSystem.js';
import { ViewManager } from '../src/core/viewManager.js';
import { InteractionZones } from '../src/office/interactionZones.js';

test('InteractionZones detects zone under player', () => {
  const zones = [
    { id: 'desk', type: 'desk', x: 3, y: 7, label: 'Bàn làm việc' }
  ];
  const iz = new InteractionZones({ zones });

  const activeZone = iz.checkZone(3, 7);
  assert.equal(activeZone?.id, 'desk');

  const emptyZone = iz.checkZone(10, 10);
  assert.equal(emptyZone, null);
});

test('Coffee interaction adds energy, reduces stress, respects 3 cup limit', () => {
  const bus = new EventBus();
  const state = new GameState({ eventBus: bus, storageKey: 'test_iz_coffee' });
  const timeSystem = new TimeSystem({ eventBus: bus, gameState: state });
  const iz = new InteractionZones({ eventBus: bus, gameState: state, timeSystem });

  state.set('player.energy', 40);
  state.set('player.stress', 50);

  // Cup 1
  const res1 = iz.interactWithZone({ id: 'coffee', type: 'coffee' });
  assert.equal(res1.success, true);
  assert.equal(state.get('player.energy'), 70);
  assert.equal(state.get('player.stress'), 40);
  assert.equal(state.get('coffeeCount'), 1);

  // Cup 2 & 3
  iz.interactWithZone({ id: 'coffee', type: 'coffee' });
  iz.interactWithZone({ id: 'coffee', type: 'coffee' });
  assert.equal(state.get('coffeeCount'), 3);

  // Cup 4 -> blocked by limit
  const res4 = iz.interactWithZone({ id: 'coffee', type: 'coffee' });
  assert.equal(res4.success, false);
  assert.equal(res4.reason, 'coffee_limit_reached');
});

test('Desk interaction switches view to workstation', () => {
  const bus = new EventBus();
  const viewManager = new ViewManager({ eventBus: bus });
  const iz = new InteractionZones({ eventBus: bus, viewManager });

  assert.equal(viewManager.currentView, 'office');
  iz.interactWithZone({ id: 'desk', type: 'desk' });
  assert.equal(viewManager.currentView, 'workstation');
});
