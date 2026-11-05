import test from 'node:test';
import assert from 'node:assert/strict';
import { tileTo3D, pos3DToTile, calcFacingAngle, lerpAngle } from '../src/office3d/coord3D.js';

test('tileTo3D converts 2D tile coordinates into centered 3D world space', () => {
  // Center of map is (16, 10) -> (0, 0, 0)
  const center = tileTo3D(16, 10, 1.5);
  assert.equal(center.x, 0);
  assert.equal(center.y, 0);
  assert.equal(center.z, 0);

  // Top-left (0, 0) -> x: -24, z: -15
  const topLeft = tileTo3D(0, 0, 1.5);
  assert.equal(topLeft.x, -24);
  assert.equal(topLeft.z, -15);

  // Player desk in IT Room (20, 14) -> x: 6, z: 6
  const desk = tileTo3D(20, 14, 1.5);
  assert.equal(desk.x, 6);
  assert.equal(desk.z, 6);
});

test('pos3DToTile correctly converts 3D world coordinates back to tile coordinates', () => {
  const tileCenter = pos3DToTile(0, 0, 1.5);
  assert.equal(tileCenter.tileX, 16);
  assert.equal(tileCenter.tileY, 10);

  const tileDesk = pos3DToTile(6, 6, 1.5);
  assert.equal(tileDesk.tileX, 20);
  assert.equal(tileDesk.tileY, 14);
});

test('calcFacingAngle computes correct orientation in radians', () => {
  // Moving South (+Z) -> 0 rad
  const south = calcFacingAngle(0, 1);
  assert.equal(south, 0);

  // Moving North (-Z) -> Math.PI rad
  const north = calcFacingAngle(0, -1);
  assert.equal(Math.abs(north), Math.PI);

  // Moving East (+X) -> Math.PI / 2
  const east = calcFacingAngle(1, 0);
  assert.equal(east, Math.PI / 2);
});

test('lerpAngle handles smooth rotational interpolation', () => {
  const interpolated = lerpAngle(0, Math.PI, 0.5);
  assert.ok(Math.abs(interpolated - Math.PI / 2) < 0.01);
});
