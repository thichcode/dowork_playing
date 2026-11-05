import test from 'node:test';
import assert from 'node:assert/strict';

import { CssLayoutFixMinigame } from '../src/minigames/frontend/cssLayoutFix.js';
import { BugHuntUIMinigame } from '../src/minigames/frontend/bugHuntUI.js';
import { MinigameManager } from '../src/minigames/minigameManager.js';
import { EventBus } from '../src/core/eventBus.js';

test('CssLayoutFixMinigame checks CSS rules correctly', () => {
  const minigame = new CssLayoutFixMinigame();

  // Bad CSS with bug
  const badCSS = '.login-card { margin-top: -30px; display: block; }';
  const badResult = minigame.validateCSS(badCSS);
  assert.equal(badResult.completed, false);
  assert.ok(badResult.score < badResult.maxScore);

  // Fixed CSS
  const fixedCSS = '.login-card { margin-top: 16px; display: flex; justify-content: center; }';
  const goodResult = minigame.validateCSS(fixedCSS);
  assert.equal(goodResult.completed, true);
  assert.equal(goodResult.score, goodResult.maxScore);
});

test('BugHuntUIMinigame tracks found bugs up to total', () => {
  const minigame = new BugHuntUIMinigame();

  assert.equal(minigame.foundBugs.size, 0);

  minigame.registerClick(1); // Click bug #1
  minigame.registerClick(2); // Click bug #2
  assert.equal(minigame.foundBugs.size, 2);

  const res = minigame.checkCompletion();
  assert.equal(res.score, 2);
  assert.equal(res.maxScore, 5);
});

test('Review Focus 4: MinigameManager timer expiring auto-submits current score', () => {
  const bus = new EventBus();
  let ticketCompleted = null;
  const fakeTicketSystem = {
    completeTicket: (id, result) => {
      ticketCompleted = { id, result };
    }
  };

  const manager = new MinigameManager({
    eventBus: bus,
    ticketSystem: fakeTicketSystem
  });

  const ticket = { id: 'TK-FE-1', minigameType: 'cssLayoutFix', timeLimit: 10 };
  manager.start(ticket);

  // Simulate timeout: advance delta >= timeLimit
  manager.update(10.5);

  assert.ok(ticketCompleted !== null, 'Timeout should auto-submit ticket');
  assert.equal(ticketCompleted.id, 'TK-FE-1');
  assert.equal(manager.isActive, false);
});
