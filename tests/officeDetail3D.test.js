import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { OfficeBuilder3D } from '../src/office3d/officeBuilder3D.js';

test('OfficeBuilder3D creates transparent glass room partitions with aluminum frames', () => {
  const builder = new OfficeBuilder3D({ THREE });
  const mapData = {
    width: 32,
    height: 20,
    tileSize: 32,
    tiles: [],
    collision: [],
    zones: []
  };

  const officeGroup = builder.buildOffice(mapData);
  const glassWalls = officeGroup.getObjectByName('glass_walls');
  assert.ok(glassWalls);

  let hasTransparentGlass = false;
  glassWalls.traverse((child) => {
    if (child.isMesh && child.material && child.material.transparent && child.material.opacity < 0.6) {
      hasTransparentGlass = true;
    }
  });
  assert.equal(hasTransparentGlass, true);
});

test('OfficeBuilder3D creates potted Monstera and Ficus tropical plants', () => {
  const builder = new OfficeBuilder3D({ THREE });
  const monstera = builder.createPottedPlantMesh('monstera');
  assert.ok(monstera instanceof THREE.Group);

  const pot = monstera.getObjectByName('plant_pot');
  assert.ok(pot);

  let leafCount = 0;
  monstera.traverse((child) => {
    if (child.isMesh && child.name.includes('leaf')) {
      leafCount++;
    }
  });
  assert.ok(leafCount >= 3);
});

test('OfficeBuilder3D creates framed tech wall posters', () => {
  const builder = new OfficeBuilder3D({ THREE });
  const poster = builder.createWallPosterMesh('Keep Calm & Git Push', 0x3b82f6);
  assert.ok(poster instanceof THREE.Group);

  const frame = poster.getObjectByName('poster_frame');
  assert.ok(frame);

  const canvas = poster.getObjectByName('poster_canvas');
  assert.ok(canvas);
  assert.equal(canvas.material.color.getHex(), 0x3b82f6);
});
