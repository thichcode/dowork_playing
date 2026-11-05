import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { Character3D } from '../src/office3d/character3D.js';
import { NPCManager3D } from '../src/office3d/npcManager3D.js';

test('Character3D builds hierarchical mesh with limbs and applies role palette', () => {
  const palette = {
    hair: 0x475569,
    shirt: 0x10b981,
    pants: 0x0f172a,
    skin: 0xfed7aa
  };

  const char = new Character3D({ THREE, palette });
  assert.ok(char.mesh instanceof THREE.Group);
  assert.ok(char.head instanceof THREE.Mesh);
  assert.ok(char.torso instanceof THREE.Mesh);
  assert.ok(char.leftLeg instanceof THREE.Mesh);
  assert.ok(char.rightLeg instanceof THREE.Mesh);

  // Check torso shirt color
  assert.equal(char.torso.material.color.getHex(), 0x10b981);
});

test('Character3D animates limbs and vertical bobbing during movement', () => {
  const char = new Character3D({ THREE });

  // Initially idle at rotation 0
  assert.equal(char.leftLeg.rotation.x, 0);

  // Move for 0.2s
  char.updateAnimation(0.2, true);

  // Leg should have swung
  assert.notEqual(char.leftLeg.rotation.x, 0);
  assert.notEqual(char.rightLeg.rotation.x, 0);

  // Idle for 1s should return limbs towards 0
  char.updateAnimation(1.0, false);
  assert.ok(Math.abs(char.leftLeg.rotation.x) < 0.15);
});

test('NPCManager3D creates 3D NPC meshes at designated coordinates', () => {
  const npcs = [
    { id: 'hr_lan', name: 'HR Lan', tileX: 23, tileY: 3, palette: { shirt: '#ec4899' } },
    { id: 'pm_hung', name: 'PM Hùng', tileX: 8, tileY: 14, palette: { shirt: '#0284c7' } }
  ];

  const manager = new NPCManager3D({ THREE, npcs });
  assert.equal(manager.npcMeshes.size, 2);

  const hrMesh = manager.getNpcMesh('hr_lan');
  assert.ok(hrMesh);
  assert.ok(hrMesh.position.x !== 0);

  // Check proximity in 3D
  const nearby = manager.checkProximity(hrMesh.position.x, hrMesh.position.z);
  assert.equal(nearby?.id, 'hr_lan');
});
