import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { Player } from '../src/office/player.js';
import { Character3D } from '../src/office3d/character3D.js';

test('Player detects sprint input and applies 1.7x speed multiplier', () => {
  const walkingInput = {
    isKeyDown: (k) => k === 'd'
  };
  const walkingPlayer = new Player({ startX: 32, startY: 32, inputManager: walkingInput });
  walkingPlayer.update(0.1, []);
  const walkDistance = walkingPlayer.x - 32;

  const sprintingInput = {
    isKeyDown: (k) => k === 'd' || k === 'shift'
  };
  const sprintingPlayer = new Player({ startX: 32, startY: 32, inputManager: sprintingInput });
  sprintingPlayer.update(0.1, []);
  const sprintDistance = sprintingPlayer.x - 32;

  assert.equal(sprintingPlayer.isSprinting, true);
  assert.equal(walkingPlayer.isSprinting, false);
  assert.ok(sprintDistance > walkDistance * 1.5, `Sprint distance (${sprintDistance}) should be > 1.5x walk distance (${walkDistance})`);
});

test('Player implements smooth momentum acceleration and deceleration', () => {
  let isPressed = true;
  const input = {
    isKeyDown: (k) => isPressed && k === 'd'
  };
  const player = new Player({ startX: 32, startY: 32, inputManager: input });

  // Step 1: Initial move - velocity ramps up
  player.update(0.05, []);
  const initialSpeed = player.currentVelocity;
  assert.ok(initialSpeed > 0, 'Velocity should start increasing');

  // Step 2: Continuous move reaches full speed
  player.update(0.2, []);
  assert.ok(player.currentVelocity >= initialSpeed, 'Velocity should accelerate over time');

  // Step 3: Release key -> momentum deceleration (does not stop instantaneously at 0 distance)
  isPressed = false;
  const posAtRelease = player.x;
  player.update(0.05, []);
  assert.ok(player.x > posAtRelease, 'Player should have slight friction glide on key release');
});

test('Character3D scales animation speed during sprint and banks body during cornering turns', () => {
  const char = new Character3D({ THREE });

  // Normal walk animation
  char.updateAnimation(0.1, true, false, 0);
  const normalTimer = char.walkTimer;

  // Reset and test sprint walk animation
  char.walkTimer = 0;
  char.updateAnimation(0.1, true, true, 0);
  const sprintTimer = char.walkTimer;

  assert.ok(sprintTimer > normalTimer, `Sprint walkTimer (${sprintTimer}) should advance faster than normal (${normalTimer})`);

  // Test cornering turn banking
  char.updateAnimation(0.1, true, true, 0.4); // turning right
  assert.notEqual(char.torso.rotation.z, 0, 'Torso should bank (roll) during cornering turn');
  assert.ok(Math.abs(char.torso.rotation.z) <= 0.2, 'Bank angle should be safely clamped');

  // Reset to idle straight
  char.updateAnimation(0.5, false, false, 0);
  assert.ok(Math.abs(char.torso.rotation.z) < 0.05, 'Bank angle should recover to near 0 when idle');
});
