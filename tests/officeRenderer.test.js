import test from 'node:test';
import assert from 'node:assert/strict';
import { OfficeRenderer } from '../src/office/officeRenderer.js';

test('OfficeRenderer clamps camera smoothly within 32x20 map boundaries', () => {
  const mapData = {
    width: 32,
    height: 20,
    tileSize: 32,
    tiles: [],
    collision: []
  };

  const renderer = new OfficeRenderer();
  // Mock viewport 800x600
  renderer.viewportWidth = 800;
  renderer.viewportHeight = 600;
  renderer.mapData = mapData;

  // Player at top-left (0, 0) -> camera clamped at 0, 0
  renderer.updateCamera(0, 0);
  assert.equal(renderer.cameraX, 0);
  assert.equal(renderer.cameraY, 0);

  // Map dimensions: width 1024, height 640
  // Max X = 1024 - 800 = 224; Max Y = 640 - 600 = 40
  renderer.updateCamera(1000, 600);
  assert.equal(renderer.cameraX, 224);
  assert.equal(renderer.cameraY, 40);
});

test('OfficeRenderer manages active contextual interaction prompt', () => {
  const renderer = new OfficeRenderer();
  assert.equal(renderer.interactionPrompt, '');

  renderer.setInteractionPrompt('Nhấn [E] để Ngồi vào bàn làm việc 💻');
  assert.equal(renderer.interactionPrompt, 'Nhấn [E] để Ngồi vào bàn làm việc 💻');

  renderer.clearInteractionPrompt();
  assert.equal(renderer.interactionPrompt, '');
});
