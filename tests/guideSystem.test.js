import test from 'node:test';
import assert from 'node:assert/strict';
import { GuideSystem } from '../src/ui/guideSystem.js';
import { GuideModal } from '../src/ui/guideModal.js';
import { EventBus } from '../src/core/eventBus.js';

test('GuideSystem provides accurate item tooltips', () => {
  const guide = new GuideSystem();
  
  const coffeeTip = guide.getTooltip('coffee');
  assert.ok(coffeeTip, 'Should have coffee tooltip');
  assert.ok(coffeeTip.title.includes('Cà Phê'));
  assert.equal(coffeeTip.hotkey, '1');

  const phoneTip = guide.getTooltip('phone');
  assert.ok(phoneTip, 'Should have phone tooltip');
  assert.equal(phoneTip.hotkey, '2');

  const duckTip = guide.getTooltip('duck');
  assert.ok(duckTip, 'Should have duck tooltip');
  assert.equal(duckTip.hotkey, '3');

  const monitorTip = guide.getTooltip('monitor');
  assert.ok(monitorTip, 'Should have monitor tooltip');
  assert.equal(monitorTip.hotkey, 'Space');
});

test('GuideSystem returns standard shortcut catalog', () => {
  const guide = new GuideSystem();
  const shortcuts = guide.getShortcuts();
  assert.ok(Array.isArray(shortcuts));
  assert.ok(shortcuts.some(s => s.key === 'Space'));
  assert.ok(shortcuts.some(s => s.key === '?'));
  assert.ok(shortcuts.some(s => s.key === '1'));
});

test('GuideModal toggles visibility and triggers events', () => {
  const eventBus = new EventBus();
  let modalShown = false;
  let modalClosed = false;

  eventBus.on('guide:shown', () => { modalShown = true; });
  eventBus.on('guide:closed', () => { modalClosed = true; });

  const modal = new GuideModal({ eventBus });
  assert.equal(modal.isOpen(), false);

  modal.show();
  assert.equal(modal.isOpen(), true);
  assert.equal(modalShown, true);

  modal.close();
  assert.equal(modal.isOpen(), false);
  assert.equal(modalClosed, true);
});
