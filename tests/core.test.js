import test from 'node:test';
import assert from 'node:assert/strict';

import { EventBus } from '../src/core/eventBus.js';
import { GameState } from '../src/core/gameState.js';
import { ViewManager } from '../src/core/viewManager.js';

test('EventBus pub/sub operates correctly', () => {
  const bus = new EventBus();
  let received = null;
  const unsub = bus.on('test:event', (data) => {
    received = data;
  });

  bus.emit('test:event', { msg: 'hello' });
  assert.deepEqual(received, { msg: 'hello' });

  unsub();
  bus.emit('test:event', { msg: 'world' });
  assert.deepEqual(received, { msg: 'hello' });
});

test('GameState get/set with dot notation and event emission', () => {
  const bus = new EventBus();
  const state = new GameState({ eventBus: bus, storageKey: 'test_save' });

  assert.equal(state.get('player.energy'), 100);
  assert.equal(state.get('player.stress'), 20);

  let changeEmitted = false;
  bus.on('state:changed:player.energy', (val) => {
    changeEmitted = true;
  });

  state.set('player.energy', 80);
  assert.equal(state.get('player.energy'), 80);
  assert.equal(changeEmitted, true);
});

test('GameState triggers burnout event when stress >= 95', () => {
  const bus = new EventBus();
  const state = new GameState({ eventBus: bus, storageKey: 'test_burnout' });

  let burnoutTriggered = false;
  bus.on('game:burnout', () => {
    burnoutTriggered = true;
  });

  state.set('player.stress', 95);
  assert.equal(burnoutTriggered, true);
});

test('ViewManager switches between office and workstation', () => {
  const bus = new EventBus();
  const officeEl = { classList: { add: () => {}, remove: () => {}, contains: () => false } };
  const workstationEl = { classList: { add: () => {}, remove: () => {}, contains: () => true } };

  const viewManager = new ViewManager({
    eventBus: bus,
    officeEl,
    workstationEl
  });

  assert.equal(viewManager.currentView, 'office');
  let viewChanged = null;
  bus.on('view:changed', (view) => {
    viewChanged = view;
  });

  viewManager.switch('workstation');
  assert.equal(viewManager.currentView, 'workstation');
  assert.equal(viewChanged, 'workstation');
});
