import test from 'node:test';
import assert from 'node:assert/strict';

import { Player } from '../src/office/player.js';

test('Player initializes with coordinates and direction', () => {
  const player = new Player({ startX: 100, startY: 100 });
  assert.equal(player.x, 100);
  assert.equal(player.y, 100);
  assert.equal(player.direction, 0); // 0=down
});

test('Player moves in direction when input provided', () => {
  const fakeInput = {
    isKeyDown: (k) => k === 'd' // moving right
  };
  const collisionMap = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ]; // all walkable

  const player = new Player({ startX: 32, startY: 32, inputManager: fakeInput });
  player.update(0.1, collisionMap); // 0.1s at 96px/s = 9.6px

  assert.ok(player.x > 32, 'Player x should have increased');
  assert.equal(player.direction, 2); // 2=right
});

test('Player collides and stops at blocked tiles', () => {
  const fakeInput = {
    isKeyDown: (k) => k === 'a' // moving left
  };
  // Grid: cell (0, 1) is blocked (1)
  const collisionMap = [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1]
  ];

  // Player at (33, 33) — tile (1, 1) is walkable, moving left towards tile (0, 1) which is blocked
  const player = new Player({ startX: 33, startY: 33, tileSize: 32, inputManager: fakeInput });
  // Repeatedly try to move left
  for (let i = 0; i < 20; i++) {
    player.update(0.1, collisionMap);
  }

  // Player should not be able to cross into tileX 0 (x < 32)
  assert.ok(player.x >= 32, `Player x (${player.x}) should not cross into blocked tile at x < 32`);
});
