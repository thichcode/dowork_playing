import test from 'node:test';
import assert from 'node:assert/strict';

import { EventBus } from '../src/core/eventBus.js';
import { GameState } from '../src/core/gameState.js';
import { NPCManager } from '../src/office/npcManager.js';
import { DialogueSystem, CHOICE_EFFECT_TEMPLATES } from '../src/office/dialogueSystem.js';

test('NPCManager detects nearby NPC within 2 tiles', () => {
  const bus = new EventBus();
  const npcs = [
    { id: 'hr_lan', name: 'HR Lan', tileX: 5, tileY: 5, palette: {} }
  ];
  const npcManager = new NPCManager({ npcs, eventBus: bus });

  // Player at (5, 6) -> distance = 1 tile -> nearby
  const nearby = npcManager.checkProximity(5, 6);
  assert.equal(nearby?.id, 'hr_lan');

  // Player at (10, 10) -> distance = 10 -> not nearby
  const far = npcManager.checkProximity(10, 10);
  assert.equal(far, null);
});

test('DialogueSystem applies choice effects to GameState correctly', () => {
  const bus = new EventBus();
  const state = new GameState({ eventBus: bus, storageKey: 'test_dlg_effects' });
  const dialogueSystem = new DialogueSystem({ eventBus: bus, gameState: state });

  const initialKpi = state.get('player.kpi');
  const initialRep = state.get('player.reputation');

  // Apply responsible choice
  dialogueSystem.applyChoiceEffect('responsible');

  assert.equal(state.get('player.kpi'), initialKpi + CHOICE_EFFECT_TEMPLATES.responsible.kpi);
  assert.equal(state.get('player.reputation'), initialRep + CHOICE_EFFECT_TEMPLATES.responsible.reputation);
});

test('DialogueSystem choice effect deflect_blame increases stress and decreases reputation', () => {
  const bus = new EventBus();
  const state = new GameState({ eventBus: bus, storageKey: 'test_dlg_blame' });
  const dialogueSystem = new DialogueSystem({ eventBus: bus, gameState: state });

  const initialStress = state.get('player.stress');
  const initialRep = state.get('player.reputation');

  dialogueSystem.applyChoiceEffect('deflect_blame');

  assert.equal(state.get('player.stress'), initialStress + CHOICE_EFFECT_TEMPLATES.deflect_blame.stress);
  assert.equal(state.get('player.reputation'), initialRep + CHOICE_EFFECT_TEMPLATES.deflect_blame.reputation);
});
