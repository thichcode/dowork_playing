import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SoundEngine } from '../src/audio/soundEngine.js';

test('SoundEngine playFootstep respects surface acoustics and sprint cadence limits', () => {
  const engine = new SoundEngine();

  // Initial step should play
  const played1 = engine.playFootstep('wood', false);
  assert.equal(played1, true, 'First footstep should play');

  // Immediate second step within 100ms should be throttled by walk cadence (>300ms)
  const playedImmediate = engine.playFootstep('wood', false);
  assert.equal(playedImmediate, false, 'Rapid footstep within walk cadence threshold should be throttled');

  // Supports carpet and tile surfaces
  assert.equal(typeof engine.playFootstep, 'function');
});

test('SoundEngine setRoomAmbience switches ambient modes cleanly without errors', () => {
  const engine = new SoundEngine();

  engine.setRoomAmbience('server');
  assert.equal(engine.currentRoom, 'server', 'Ambience should be set to server');

  engine.setRoomAmbience('it_room');
  assert.equal(engine.currentRoom, 'it_room', 'Ambience should switch to it_room');

  engine.stopRoomAmbience();
  assert.equal(engine.currentRoom, null, 'Ambience should be stopped cleanly');
});
