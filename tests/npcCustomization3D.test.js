import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { NPCManager3D } from '../src/office3d/npcManager3D.js';
import { Character3D } from '../src/office3d/character3D.js';
import { NPCS_DATA } from '../src/data/npcs.js';

test('Character3D supports ponytail and undercut hairstyles', () => {
  const ponytailChar = new Character3D({ THREE, hairStyle: 'ponytail' });
  const hairGroup = ponytailChar.head.getObjectByName('hair_mesh');
  assert.ok(hairGroup, 'Character should have hair mesh');
  assert.ok(hairGroup.children.length >= 3, 'Ponytail should include band and tail');

  const undercutChar = new Character3D({ THREE, hairStyle: 'undercut' });
  const undercutHair = undercutChar.head.getObjectByName('hair_mesh');
  assert.ok(undercutHair, 'Undercut character should have hair mesh');
  assert.ok(undercutHair.children.length >= 3, 'Undercut should include top pompadour');
});

test('NPCManager3D creates stylized NPCs with role-specific hair, accessories, and palettes', () => {
  const manager = new NPCManager3D({ THREE, npcs: NPCS_DATA });

  // Dev Minh: Glasses + Sidepart
  const minh = manager.npcCharacters.get('dev_minh');
  assert.ok(minh, 'Dev Minh should exist');
  assert.equal(minh.hasGlasses, true, 'Dev Minh should wear glasses');
  assert.ok(minh.mesh.getObjectByName('glasses'), 'Dev Minh should have 3D glasses mesh');

  // Lead Đức: Glasses + Undercut
  const duc = manager.npcCharacters.get('lead_duc');
  assert.ok(duc, 'Lead Duc should exist');
  assert.equal(duc.hasGlasses, true, 'Lead Duc should wear glasses');
  assert.equal(duc.hairStyle, 'undercut', 'Lead Duc should have undercut hairstyle');

  // QA Trang: Ponytail
  const trang = manager.npcCharacters.get('qa_trang');
  assert.ok(trang, 'QA Trang should exist');
  assert.equal(trang.hairStyle, 'ponytail', 'QA Trang should have ponytail');

  // HR Lan: Bob hair
  const lan = manager.npcCharacters.get('hr_lan');
  assert.ok(lan, 'HR Lan should exist');
  assert.equal(lan.hairStyle, 'bob', 'HR Lan should have bob hairstyle');
});
