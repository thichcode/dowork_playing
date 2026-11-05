import test from 'node:test';
import assert from 'node:assert/strict';

import { EventBus } from '../src/core/eventBus.js';
import { GameState } from '../src/core/gameState.js';
import { TimeSystem } from '../src/office/timeSystem.js';
import { TicketSystem } from '../src/workstation/ticketSystem.js';
import { MVP_TICKETS } from '../src/data/tickets.js';

test('MVP_TICKETS contains at least 16 rich tickets across 4 roles and 4 chapters', () => {
  assert.ok(MVP_TICKETS.length >= 16, `Expected at least 16 tickets, got ${MVP_TICKETS.length}`);

  const roles = ['frontend', 'backend', 'qa', 'devops'];
  for (const role of roles) {
    const roleTickets = MVP_TICKETS.filter(t => t.role === role);
    assert.ok(roleTickets.length >= 4, `Role ${role} should have at least 4 tickets, got ${roleTickets.length}`);
    for (let ch = 1; ch <= 4; ch++) {
      assert.ok(roleTickets.some(t => t.chapter === ch), `Role ${role} should have a ticket for Chapter ${ch}`);
    }
  }
});

test('TicketSystem filters tickets by role and chapter', () => {
  const sampleTickets = [
    { id: 'TK-FE-1', role: 'frontend', chapter: 1 },
    { id: 'TK-FE-2', role: 'frontend', chapter: 2 },
    { id: 'TK-BE-1', role: 'backend', chapter: 1 }
  ];
  const ts = new TicketSystem({ tickets: sampleTickets });

  // For frontend at chapter 1 -> only TK-FE-1
  const ch1Tickets = ts.getTicketsForChapter(1, 'frontend');
  assert.equal(ch1Tickets.length, 1);
  assert.equal(ch1Tickets[0].id, 'TK-FE-1');

  // For frontend at chapter 2 -> both chapter 1 and 2
  const ch2Tickets = ts.getTicketsForChapter(2, 'frontend');
  assert.equal(ch2Tickets.length, 2);
});

test('TicketSystem completeTicket computes rank and awards stats', () => {
  const bus = new EventBus();
  const state = new GameState({ eventBus: bus, storageKey: 'test_ts_complete' });
  const timeSystem = new TimeSystem({ eventBus: bus, gameState: state });
  const sampleTickets = [
    {
      id: 'TK-100',
      title: 'Fix Button',
      role: 'frontend',
      rewards: { kpi: 10, reputation: 5 },
      penalties: { kpi: -5, stress: 15 },
      gameDuration: 45
    }
  ];
  const ts = new TicketSystem({
    tickets: sampleTickets,
    eventBus: bus,
    gameState: state,
    timeSystem
  });

  const initKpi = state.get('player.kpi');
  const initRep = state.get('player.reputation');

  // Complete ticket with perfect score
  const result = ts.completeTicket('TK-100', { score: 10, maxScore: 10, timeRatio: 0.5 });

  assert.equal(result.rank, 'perfect');
  assert.equal(state.get('player.kpi'), initKpi + 15); // 10 * 1.5
  assert.equal(state.get('player.reputation'), initRep + 5);
  assert.ok(ts.isTicketCompleted('TK-100'));
});
