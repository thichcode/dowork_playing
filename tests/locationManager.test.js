import test from 'node:test';
import assert from 'node:assert/strict';
import { LocationManager } from '../src/office/locationManager.js';
import { NPCDeskManager } from '../src/office/npcDeskManager.js';
import { EventBus } from '../src/core/eventBus.js';

test('LocationManager switches locations and emits event', () => {
  const eventBus = new EventBus();
  let changedData = null;
  eventBus.on('location:changed', (data) => { changedData = data; });

  const loc = new LocationManager({ eventBus });
  assert.equal(loc.getLocation(), 'desk');

  loc.switchLocation('pantry');
  assert.equal(loc.getLocation(), 'pantry');
  assert.equal(changedData.location, 'pantry');

  loc.switchLocation('meeting');
  assert.equal(loc.getLocation(), 'meeting');

  loc.switchLocation('invalid_place');
  assert.equal(loc.getLocation(), 'meeting', 'Should ignore invalid location');
});

test('NPCDeskManager spawns and dismisses NPC with emotion', () => {
  const eventBus = new EventBus();
  let spawnedData = null;
  let dismissed = false;

  eventBus.on('npc:desk-spawned', (data) => { spawnedData = data; });
  eventBus.on('npc:desk-dismissed', () => { dismissed = true; });

  const npcDesk = new NPCDeskManager({ eventBus });
  assert.equal(npcDesk.hasActiveNPC(), false);

  npcDesk.spawnNPC('tuan_anh', 'angry', 'Tiến độ sprint thế nào rồi em?!');
  assert.equal(npcDesk.hasActiveNPC(), true);
  assert.equal(spawnedData.npcId, 'tuan_anh');
  assert.equal(spawnedData.emotion, 'angry');

  npcDesk.dismissNPC();
  assert.equal(npcDesk.hasActiveNPC(), false);
  assert.equal(dismissed, true);
});
