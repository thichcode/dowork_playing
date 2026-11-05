import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { OfficeRenderer3D } from '../src/office3d/officeRenderer3D.js';
import { EventBus } from '../src/core/eventBus.js';

test('OfficeRenderer3D toggles dimension between 3D and 2D', () => {
  const bus = new EventBus();
  let dimensionEvent = null;
  bus.on('view:dimension-changed', (mode) => { dimensionEvent = mode; });

  const renderer = new OfficeRenderer3D({ eventBus: bus });
  assert.equal(renderer.is3DMode, true);

  // Toggle to 2D
  const mode2D = renderer.toggleDimension();
  assert.equal(mode2D, '2d');
  assert.equal(renderer.is3DMode, false);
  assert.equal(dimensionEvent, '2d');

  // Toggle back to 3D
  const mode3D = renderer.toggleDimension();
  assert.equal(mode3D, '3d');
  assert.equal(renderer.is3DMode, true);
  assert.equal(dimensionEvent, '3d');
});

test('OfficeRenderer3D updates player avatar position and camera target from 2D coordinates', () => {
  const renderer = new OfficeRenderer3D({ THREE });

  const mockPlayer = {
    x: 20 * 32,
    y: 14 * 32,
    tileSize: 32,
    direction: 'down',
    isMoving: true,
    tileX: 20,
    tileY: 14
  };

  // Mock scene and avatar
  let cameraTarget = null;
  renderer.scene = {
    setTarget: (x, y, z) => { cameraTarget = { x, y, z }; },
    render: () => {}
  };

  renderer.playerAvatar = {
    setPosition: (x, y, z) => {},
    setFacing: (rad) => {},
    updateAnimation: (dt, moving) => {}
  };

  renderer.update(0.016, mockPlayer);

  // Desk (20, 14) in 3D coordinates is (6, 0, 6)
  assert.ok(cameraTarget);
  assert.equal(cameraTarget.x, 6);
  assert.equal(cameraTarget.z, 6);
});

test('OfficeRenderer3D manages contextual 3D prompt text', () => {
  const renderer = new OfficeRenderer3D();
  assert.equal(renderer.promptText, '');

  renderer.setPrompt('[E] Ngồi vào bàn làm việc 💻');
  assert.equal(renderer.promptText, '[E] Ngồi vào bàn làm việc 💻');

  renderer.clearPrompt();
  assert.equal(renderer.promptText, '');
});
