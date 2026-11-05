import test from 'node:test';
import assert from 'node:assert/strict';
import { RoomTracker } from '../src/office/roomTracker.js';
import { EventBus } from '../src/core/eventBus.js';

test('RoomTracker identifies rooms correctly based on tile coordinates', () => {
  const tracker = new RoomTracker();

  // IT room in south-east
  const itRoom = tracker.getRoomAt(20, 15);
  assert.equal(itRoom.id, 'it_room');
  assert.ok(itRoom.name.includes('Phòng Kỹ Thuật'));

  // Pantry in north-east
  const pantry = tracker.getRoomAt(25, 4);
  assert.equal(pantry.id, 'pantry');
  assert.ok(pantry.name.includes('Pantry'));

  // Meeting in south-west
  const meeting = tracker.getRoomAt(5, 15);
  assert.equal(meeting.id, 'meeting');
  assert.ok(meeting.name.includes('Phòng Họp'));

  // Server room in north-west
  const server = tracker.getRoomAt(5, 4);
  assert.equal(server.id, 'server');
  assert.ok(server.name.includes('Server'));
});

test('RoomTracker emits room:changed when player crosses room boundary', () => {
  const eventBus = new EventBus();
  let changedRoom = null;
  eventBus.on('room:changed', (room) => { changedRoom = room; });

  const tracker = new RoomTracker({ eventBus });

  // Start in IT Room
  tracker.update(20, 15);
  assert.equal(changedRoom.id, 'it_room');

  // Walk into Pantry
  tracker.update(25, 4);
  assert.equal(changedRoom.id, 'pantry');

  // Stay in Pantry -> no extra emit
  changedRoom = null;
  tracker.update(26, 4);
  assert.equal(changedRoom, null);
});
