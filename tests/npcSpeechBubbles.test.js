import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { NPCManager3D, NPC_SPEECH_QUOTES } from '../src/office3d/npcManager3D.js';
import { NPCS_DATA } from '../src/data/npcs.js';

test('NPC_SPEECH_QUOTES defines unique emotes and comic quotes for all 6 NPCs', () => {
  assert.ok(NPC_SPEECH_QUOTES);
  const ids = ['dev_minh', 'lead_duc', 'qa_trang', 'hr_lan', 'devops_khoa', 'pm_hung'];
  for (const id of ids) {
    const q = NPC_SPEECH_QUOTES[id];
    assert.ok(q, `Quote must exist for ${id}`);
    assert.ok(q.emote, `Emote must exist for ${id}`);
    assert.ok(q.quote && q.quote.length > 5, `Quote text must exist for ${id}`);
  }
});

test('NPCManager3D creates speech bubble groups with target bounce scale on proximity', () => {
  const manager = new NPCManager3D({ THREE, npcs: NPCS_DATA });

  const minhMesh = manager.getNpcMesh('dev_minh');
  assert.ok(minhMesh, 'Dev Minh mesh should exist');

  const bubble = minhMesh.getObjectByName('speech_bubble');
  assert.ok(bubble, 'Dev Minh should have a speech_bubble child group');
  assert.equal(bubble.isGroup, true);

  // Initially out of proximity: targetScale is 0
  assert.equal(bubble.targetScale, 0);

  // Trigger proximity when player is next to Dev Minh
  manager.checkProximity(minhMesh.position.x, minhMesh.position.z, 3.2);
  assert.equal(bubble.targetScale, 1.0, 'Bubble targetScale should be 1.0 when player is nearby');

  // Update animation should scale up the bubble
  manager.update(0.1);
  assert.ok(bubble.scale.x > 0, 'Bubble scale should increase during update');

  // Player walks far away
  manager.checkProximity(minhMesh.position.x + 20, minhMesh.position.z + 20, 3.2);
  assert.equal(bubble.targetScale, 0, 'Bubble targetScale should return to 0 when player departs');
});
