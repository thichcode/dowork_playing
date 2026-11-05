import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { OfficeRenderer3D } from '../src/office3d/officeRenderer3D.js';
import { OfficeBuilder3D } from '../src/office3d/officeBuilder3D.js';

test('OfficeRenderer3D manages dust particles pool and spawns particles during sprint', () => {
  const renderer = new OfficeRenderer3D({ THREE });
  assert.ok(renderer.particleGroup instanceof THREE.Group, 'Should initialize particle group');

  // Spawn dust particle
  renderer.spawnDustParticle(1, 0, 1);
  const activeCount = renderer.getActiveParticleCount();
  assert.ok(activeCount > 0, 'Active particle count should be > 0 after spawn');

  // Update particles over lifetime
  renderer.updateParticles(0.1);
  assert.ok(renderer.getActiveParticleCount() > 0, 'Particle should remain active within lifetime');

  // Update beyond max lifetime (e.g. 0.5s)
  renderer.updateParticles(0.5);
  assert.equal(renderer.getActiveParticleCount(), 0, 'Particle should deactivate after lifetime');
});

test('OfficeRenderer3D applies foliage sway to nearby plants when player is moving', () => {
  const builder = new OfficeBuilder3D({ THREE });
  const plant = builder.createPottedPlantMesh('monstera');
  plant.position.set(0, 0, 0);

  const renderer = new OfficeRenderer3D({ THREE });
  renderer.plants = [plant];

  // Player moving near the plant at (0.5, 0.5)
  const fakePlayerNear = {
    x: 0,
    y: 0,
    tileSize: 32,
    isMoving: true,
    isSprinting: true
  };

  renderer.updateFoliageSway(0.1, 0.5, 0.5, true);
  assert.notEqual(plant.rotation.z, 0, 'Plant leaves should sway when player moves closely');

  // Player far away at (20, 20)
  renderer.updateFoliageSway(0.5, 20, 20, false);
  assert.ok(Math.abs(plant.rotation.z) < 0.05, 'Plant sway should smoothly recover when player moves away');
});
