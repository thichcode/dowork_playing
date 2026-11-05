import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { Character3D } from '../src/office3d/character3D.js';

test('Character3D builds detailed facial anatomy with eyes, ears, and neck', () => {
  const char = new Character3D({
    THREE,
    palette: { skin: '#fed7aa', hair: '#1e293b' }
  });

  assert.ok(char.neck instanceof THREE.Mesh);
  assert.ok(char.head.getObjectByName('left_eye'));
  assert.ok(char.head.getObjectByName('right_eye'));
  assert.ok(char.head.getObjectByName('left_ear'));
  assert.ok(char.head.getObjectByName('right_ear'));
});

test('Character3D supports glasses accessory when requested', () => {
  const char = new Character3D({
    THREE,
    hasGlasses: true
  });

  const glasses = char.head.getObjectByName('glasses');
  assert.ok(glasses);
  assert.ok(glasses instanceof THREE.Group);
});

test('Character3D equips IT ID Badge with lanyard hanging from neck', () => {
  const char = new Character3D({ THREE });

  const lanyard = char.mesh.getObjectByName('lanyard');
  assert.ok(lanyard);

  const badge = char.mesh.getObjectByName('id_badge');
  assert.ok(badge);
});

test('Character3D builds hands and dual-tone sneakers with white soles', () => {
  const char = new Character3D({ THREE });

  assert.ok(char.leftArm.getObjectByName('left_hand'));
  assert.ok(char.rightArm.getObjectByName('right_hand'));

  const leftShoe = char.leftLeg.getObjectByName('left_shoe');
  assert.ok(leftShoe);

  const sole = leftShoe.getObjectByName('shoe_sole');
  assert.ok(sole);
  // Sole should be clean white
  assert.equal(sole.material.color.getHex(), 0xffffff);
});
